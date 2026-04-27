import assert from "node:assert/strict";
import http from "node:http";

process.env.MYTHERAPY_DATA_DIR = "data/verify-state";

const { handleRequest } = await import("../server/api.js");

const server = http.createServer((req, res) => {
  handleRequest(req, res);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

try {
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  await verifyStaticApp(baseUrl);
  await verifyApiFlow(baseUrl);

  console.log("✔ full static app + API business flow verification passed");
} finally {
  await new Promise((resolve) => server.close(resolve));
}

async function verifyStaticApp(baseUrl) {
  const pages = [
    ["/", ["today.html"]],
    ["/today.html", ["今日", "待完成", "补剂", "bottom-nav"]],
    ["/task-detail.html", ["补剂", "确认完成", "返回今日"]],
    ["/ai.html", ["AI", "扫描医嘱", "AI 建议", "保存"]],
    ["/ocr-review.html", ["OCR 确认", "低置信度", "风险提示", "保存"]],
    ["/therapy-rules.html", ["我的疗程", "药物", "情绪和症状"]],
    ["/progress.html", ["进展", "总结", "列表", "完成率"]],
    ["/progress-detail.html", ["进展详情", "阿司匹林", "备注"]],
    ["/my.html", ["我的", "疗程管理", "提醒与通知", "帮助与反馈"]],
  ];

  for (const [path, expectedTexts] of pages) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200, `${path} should return 200`);
    const html = await response.text();
    for (const text of expectedTexts) {
      assert.ok(html.includes(text), `${path} should include ${text}`);
    }
  }
}

async function verifyApiFlow(baseUrl) {
  await post(baseUrl, "/api/reset", {});

  const initial = await get(baseUrl, "/api/state");
  assert.equal(initial.profile.privacyAcknowledged, false);
  assert.ok(initial.tasks.length > 0);
  assert.ok(initial.risks.length > 0);

  const blockedReport = await postRaw(baseUrl, "/api/reports", {});
  assert.equal(blockedReport.status, 400);
  assert.equal(blockedReport.body.error.field, "privacyAcknowledged");

  await patch(baseUrl, "/api/profile", {
    name: "完整验证用户",
    privacyAcknowledged: true,
    notificationHealthy: true,
  });

  const ai = await post(baseUrl, "/api/ai/analyze", {
    text: "医生说这个补剂每天早上饭后吃一片，今晚提醒我补水，晚上有点恶心。",
  });
  assert.ok(ai.suggestion.ruleSuggestions.length >= 1);
  assert.ok(ai.suggestion.oneOffTasks.length >= 1);
  assert.ok(ai.suggestion.recordSuggestions.length >= 1);

  const savedRules = await post(baseUrl, "/api/ai/save-rules", {
    rules: ai.suggestion.ruleSuggestions,
  });
  assert.ok(savedRules.rules.length >= 1);
  assert.ok(savedRules.state.tasks.some((task) => task.ruleId));

  const oneOff = await post(baseUrl, "/api/tasks/one-off", ai.suggestion.oneOffTasks[0]);
  assert.equal(oneOff.task.isOneOff, true);
  assert.equal(oneOff.existing, false);

  const oneOffAgain = await post(baseUrl, "/api/tasks/one-off", ai.suggestion.oneOffTasks[0]);
  assert.equal(oneOffAgain.task.id, oneOff.task.id);
  assert.equal(oneOffAgain.existing, true);

  const symptom = await post(baseUrl, "/api/records/symptom", ai.suggestion.recordSuggestions[0]);
  assert.equal(symptom.record.sourcePage, "ai");

  const ocr = await post(baseUrl, "/api/ocr/mock", {
    text: "处方：验证药 1片 每日一次 08:30 饭后服用",
  });
  assert.equal(ocr.ocrDraft.status, "pending");

  const confirmedOcr = await post(baseUrl, "/api/ocr/confirm", {
    ...ocr.ocrDraft,
    title: "验证药",
    dose: "1 片",
    frequency: "每天 1 次",
    time: "08:30",
    instruction: "饭后服用",
  });
  assert.equal(confirmedOcr.rule.source, "OCR 导入");
  assert.ok(confirmedOcr.state.tasks.some((task) => task.ruleId === confirmedOcr.rule.id));

  const manualRule = await post(baseUrl, "/api/rules/manual", {
    type: "medication",
    title: "库存验证药",
    time: "10:10",
    instruction: "饭后服用",
    inventory: { amount: 9, threshold: 3, unit: "片" },
  });
  assert.deepEqual(manualRule.rule.inventory, { amount: 9, threshold: 3, unit: "片" });

  const stateAfterRules = await get(baseUrl, "/api/state");
  const medicationTask = stateAfterRules.tasks.find((task) => task.ruleId === manualRule.rule.id);
  assert.ok(medicationTask, "manual medication rule should generate today's task");

  const done = await post(baseUrl, `/api/tasks/${encodeURIComponent(medicationTask.id)}/action`, {
    action: "done",
    actualAt: `${stateAfterRules.today}T10:30`,
    note: "完整验证完成",
  });
  assert.equal(done.task.status, "done");
  assert.equal(done.record.sourcePage, "task-detail");

  const duplicateDone = await postRaw(baseUrl, `/api/tasks/${encodeURIComponent(medicationTask.id)}/action`, {
    action: "done",
    actualAt: `${stateAfterRules.today}T10:35`,
  });
  assert.equal(duplicateDone.status, 400);

  const delayedCandidate = stateAfterRules.tasks.find((task) => task.status === "pending" && task.id !== medicationTask.id);
  assert.ok(delayedCandidate, "there should be another pending task to delay");
  const delayed = await post(baseUrl, `/api/tasks/${encodeURIComponent(delayedCandidate.id)}/action`, {
    action: "delayed",
    actualAt: `${stateAfterRules.today}T12:00`,
    minutes: 30,
  });
  assert.equal(delayed.task.status, "delayed");

  const skippedCandidate = (await get(baseUrl, "/api/state")).tasks.find((task) => task.status === "pending");
  assert.ok(skippedCandidate, "there should be another pending task to skip");
  const skipped = await post(baseUrl, `/api/tasks/${encodeURIComponent(skippedCandidate.id)}/action`, {
    action: "skipped",
    actualAt: `${stateAfterRules.today}T13:00`,
  });
  assert.equal(skipped.task.status, "skipped");

  const manualTask = await post(baseUrl, "/api/tasks/manual", {
    type: "reminder",
    title: "整理复诊材料",
    scheduledAt: `${stateAfterRules.today}T21:20`,
    instruction: "准备复诊资料",
  });
  assert.equal(manualTask.task.isOneOff, true);

  const manualRecord = await post(baseUrl, "/api/records/manual", {
    type: "metric",
    actualAt: `${stateAfterRules.today}T07:35`,
    value: "128/82",
    note: "晨起血压",
  });
  assert.equal(manualRecord.record.sourcePage, "manual-entry");

  const editedRule = await patch(baseUrl, `/api/rules/${encodeURIComponent(manualRule.rule.id)}`, {
    title: "库存验证药更新",
    time: "10:20",
    instruction: "饭后温水服用",
    inventory: { amount: 8, threshold: 2, unit: "片" },
  });
  assert.equal(editedRule.rule.title, "库存验证药更新");
  assert.equal(editedRule.rule.inventory.threshold, 2);

  const paused = await patch(baseUrl, `/api/rules/${encodeURIComponent(manualRule.rule.id)}`, {
    status: "paused",
  });
  assert.equal(paused.rule.status, "paused");

  const enabled = await patch(baseUrl, `/api/rules/${encodeURIComponent(manualRule.rule.id)}`, {
    status: "enabled",
  });
  assert.equal(enabled.rule.status, "enabled");

  const report = await post(baseUrl, "/api/reports", {});
  assert.ok(report.report.records.length >= 5);
  assert.ok(report.report.rules.length >= 1);
  assert.equal(report.report.generatedFrom, "records_and_rule_snapshot");
}

async function get(baseUrl, path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, `${path} should return 200`);
  return response.json();
}

async function post(baseUrl, path, body) {
  const response = await postRaw(baseUrl, path, body);
  assert.equal(response.status, 200, `${path} should return 200`);
  return response.body;
}

async function patch(baseUrl, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  assert.equal(response.status, 200, `${path} should return 200`);
  return payload;
}

async function postRaw(baseUrl, path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}
