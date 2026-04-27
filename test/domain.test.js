import assert from "node:assert/strict";
import test from "node:test";

import { analyzeInput } from "../server/aiMock.js";
import {
  addOneOffTask,
  addSymptomRecord,
  confirmOcrDraft,
  createManualRecord,
  createManualRule,
  createManualTask,
  createExportReport,
  createSeedState,
  ensureTasksForDate,
  saveAiRules,
  taskAction,
  toggleRuleStatus,
  updateProfile,
  updateRule,
} from "../server/domain.js";

test("enabled daily rules generate one task per rule per date", () => {
  const state = createSeedState("2026-04-24");

  ensureTasksForDate(state, "2026-04-24");
  ensureTasksForDate(state, "2026-04-24");

  const todayTasks = state.tasks.filter((task) => task.scheduledAt.startsWith("2026-04-24"));
  const ruleIds = todayTasks.filter((task) => task.ruleId).map((task) => task.ruleId);

  assert.equal(ruleIds.length, new Set(ruleIds).size);
  assert.ok(todayTasks.some((task) => task.title === "补剂"));
});

test("completing a medication task writes a record and decrements inventory", () => {
  const state = createSeedState("2026-04-24");
  ensureTasksForDate(state, "2026-04-24");

  const medicationTask = state.tasks.find((task) => task.title === "补剂");
  const rule = state.rules.find((item) => item.id === medicationTask.ruleId);

  taskAction(state, medicationTask.id, "done", "2026-04-24T09:00");

  assert.equal(medicationTask.status, "done");
  assert.equal(rule.inventory.amount, 3);
  assert.ok(state.records.some((record) => record.taskId === medicationTask.id && record.action === "done"));
});

test("resolved medication tasks cannot be completed twice", () => {
  const state = createSeedState("2026-04-24");
  ensureTasksForDate(state, "2026-04-24");

  const medicationTask = state.tasks.find((task) => task.title === "补剂");
  const rule = state.rules.find((item) => item.id === medicationTask.ruleId);

  taskAction(state, medicationTask.id, "done", "2026-04-24T08:40");
  const inventoryAfterFirstDone = rule.inventory.amount;
  const recordCountAfterFirstDone = state.records.length;

  assert.throws(() => taskAction(state, medicationTask.id, "done", "2026-04-24T08:45"), /Task is already resolved/);
  assert.equal(rule.inventory.amount, inventoryAfterFirstDone);
  assert.equal(state.records.length, recordCountAfterFirstDone);
});

test("delaying a task does not duplicate the same rule task", () => {
  const state = createSeedState("2026-04-24");
  ensureTasksForDate(state, "2026-04-24");

  const medicationTask = state.tasks.find((task) => task.title === "补剂");
  taskAction(state, medicationTask.id, "delayed", "2026-04-24T08:25");
  ensureTasksForDate(state, "2026-04-24");

  const sameRuleTasks = state.tasks.filter((task) => task.ruleId === medicationTask.ruleId && task.scheduledAt.startsWith("2026-04-24"));
  assert.equal(sameRuleTasks.length, 1);
  assert.equal(sameRuleTasks[0].scheduledAt, "2026-04-24T09:00");
});

test("confirmed OCR draft becomes an enabled medication rule", () => {
  const state = createSeedState("2026-04-24");
  state.rules = [];

  const rule = confirmOcrDraft(state, {
    title: "阿司匹林",
    dose: "100mg",
    frequency: "每天 1 次",
    time: "08:00",
    instruction: "饭后服用",
    notes: "按医嘱确认",
  });

  assert.equal(rule.type, "medication");
  assert.equal(rule.status, "enabled");
  assert.equal(rule.source, "OCR 导入");
  assert.equal(state.ocrDraft.status, "saved");
});

test("AI suggestions save rules, one-off tasks, and direct records separately", () => {
  const state = createSeedState("2026-04-24");

  const rules = saveAiRules(state, [
    { type: "symptom", title: "晚间副作用自查", time: "20:00", instruction: "恶心自查" },
  ]);
  const oneOff = addOneOffTask(state, {
    title: "今晚 9 点补水提醒",
    scheduledAt: "2026-04-24T21:00",
    instruction: "喝水 300ml",
  });
  const record = addSymptomRecord(state, {
    actualAt: "2026-04-24T21:30",
    note: "轻微恶心",
    value: "轻微",
  });

  assert.equal(rules[0].source, "AI 生成");
  assert.equal(oneOff.isOneOff, true);
  assert.equal(oneOff.ruleId, null);
  assert.equal(record.ruleId, null);
  assert.ok(!state.rules.some((rule) => rule.id === oneOff.id));
});

test("export report is generated from records and a rule snapshot", () => {
  const state = createSeedState("2026-04-24");
  ensureTasksForDate(state, "2026-04-24");

  const task = state.tasks.find((item) => item.title === "补剂");
  taskAction(state, task.id, "done", "2026-04-24T09:00");

  const report = createExportReport(state, "2026-04-24T10:00");

  assert.equal(report.records.length, state.records.length);
  assert.equal(report.rules.length, state.rules.length);
  assert.equal(report.dateRange, "all_records");
  assert.ok(state.reports.some((item) => item.id === report.id));
});

test("paused rules stop future task generation without deleting history", () => {
  const state = createSeedState("2026-04-24");
  const rule = state.rules.find((item) => item.title === "补剂");

  toggleRuleStatus(state, rule.id, "paused");
  ensureTasksForDate(state, "2026-04-25");

  assert.equal(rule.status, "paused");
  assert.ok(!state.tasks.some((task) => task.ruleId === rule.id && task.scheduledAt.startsWith("2026-04-25")));
});

test("profile and rule edit pages can persist user changes", () => {
  const state = createSeedState("2026-04-24");
  const rule = state.rules.find((item) => item.title === "补剂");

  updateProfile(state, { name: "Patient A", privacyAcknowledged: true, notificationHealthy: true });
  updateRule(state, rule.id, {
    title: "补剂更新",
    time: "09:15",
    instruction: "饭后 1 片，温水送服",
    inventory: { amount: 12, threshold: 5, unit: "片" },
  });

  assert.equal(state.profile.name, "Patient A");
  assert.equal(state.profile.privacyAcknowledged, true);
  assert.equal(rule.title, "补剂更新");
  assert.equal(rule.schedule.time, "09:15");
  assert.equal(rule.inventory.amount, 12);
  assert.equal(rule.inventory.threshold, 5);
});

test("manual entry can create long-term rules, one-off tasks, and direct records", () => {
  const state = createSeedState("2026-04-24");

  const rule = createManualRule(state, {
    type: "metric",
    title: "晨间血压",
    time: "07:30",
    instruction: "记录收缩压和舒张压",
    notes: "复诊前重点关注",
  });
  const oneOff = createManualTask(state, {
    type: "reminder",
    title: "今晚整理病历",
    scheduledAt: "2026-04-24T21:20",
    instruction: "准备复诊资料",
  });
  const record = createManualRecord(state, {
    type: "metric",
    actualAt: "2026-04-24T07:35",
    value: "128/82",
    note: "晨起测量",
  });

  assert.equal(rule.source, "手动创建");
  assert.equal(rule.status, "enabled");
  assert.equal(oneOff.isOneOff, true);
  assert.equal(oneOff.ruleId, null);
  assert.equal(record.sourcePage, "manual-entry");
  assert.equal(record.value, "128/82");
});

test("manual medication rules persist initial inventory inputs", () => {
  const state = createSeedState("2026-04-24");
  const rule = createManualRule(state, {
    type: "medication",
    title: "库存药",
    time: "10:00",
    instruction: "饭后服用",
    inventory: { amount: 20, threshold: 5, unit: "片" },
  });

  assert.deepEqual(rule.inventory, { amount: 20, threshold: 5, unit: "片" });
});

test("domain validation rejects impossible times at input boundaries", () => {
  const state = createSeedState("2026-04-24");
  const rule = state.rules.find((item) => item.title === "补剂");

  assert.throws(
    () =>
      createManualRule(state, {
        type: "medication",
        title: "晚间用药",
        time: "25:99",
        instruction: "饭后服用",
      }),
    /time must use a valid HH:mm/,
  );

  assert.throws(
    () =>
      createManualTask(state, {
        type: "reminder",
        title: "无效任务",
        scheduledAt: "2026-04-24T24:00",
        instruction: "测试",
      }),
    /scheduledAt must use a valid YYYY-MM-DDTHH:mm/,
  );

  assert.throws(() => updateRule(state, rule.id, { time: "12:60" }), /time must use a valid HH:mm/);
});

test("AI analysis rejects empty user input before generating suggestions", () => {
  assert.throws(() => analyzeInput({ text: "   " }), /text is required/);
  assert.throws(() => analyzeInput({ text: "医嘱".repeat(501) }), /text is too long/);
});

test("AI analysis does not invent medication rules without medication and dose signals", () => {
  const suggestion = analyzeInput({ text: "我今天只是头痛，没有任何医生开的药，也没有剂量。" });

  assert.equal(suggestion.ruleSuggestions.some((item) => item.type === "medication"), false);
  assert.equal(suggestion.oneOffTasks.length, 0);
  assert.equal(suggestion.recordSuggestions.length, 1);
});

test("Zhipu text analysis sends the user's input to the model", async () => {
  const originalKey = process.env.ZHIPUAI_API_KEY;
  const originalFetch = globalThis.fetch;
  const requests = [];

  process.env.ZHIPUAI_API_KEY = "test-key";
  globalThis.fetch = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    return jsonResponse({
      choices: [
        {
          message: {
            content: JSON.stringify({
              ruleSuggestions: [],
              oneOffTasks: [],
              recordSuggestions: [],
              disclaimer: "test",
            }),
          },
        },
      ],
    });
  };

  try {
    const { analyzeInput: analyzeZhipuInput } = await import(`../server/aiService.js?case=text-${Date.now()}`);
    await analyzeZhipuInput({ text: "Take aspirin 100mg after breakfast." });
  } finally {
    restoreEnv("ZHIPUAI_API_KEY", originalKey);
    globalThis.fetch = originalFetch;
  }

  assert.equal(requests.length, 1);
  const messages = JSON.stringify(requests[0].messages);
  assert.match(messages, /Take aspirin 100mg after breakfast\./);
  assert.doesNotMatch(messages, /\{text\}/);
});

test("Zhipu OCR extraction sends supplemental text to the model", async () => {
  const originalKey = process.env.ZHIPUAI_API_KEY;
  const originalFetch = globalThis.fetch;
  const requests = [];

  process.env.ZHIPUAI_API_KEY = "test-key";
  globalThis.fetch = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    return jsonResponse({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: "Aspirin",
              dose: "100mg",
              frequency: "daily",
              time: "08:30",
              instruction: "After breakfast",
              notes: "test",
              confidenceFlags: [],
            }),
          },
        },
      ],
    });
  };

  try {
    const { extractOcrDraft: extractZhipuOcrDraft } = await import(`../server/aiService.js?case=ocr-${Date.now()}`);
    await extractZhipuOcrDraft({ text: "Prescription text from OCR." });
  } finally {
    restoreEnv("ZHIPUAI_API_KEY", originalKey);
    globalThis.fetch = originalFetch;
  }

  assert.equal(requests.length, 1);
  const messages = JSON.stringify(requests[0].messages);
  assert.match(messages, /Prescription text from OCR\./);
  assert.doesNotMatch(messages, /\{String\(input\.text\)\.slice\(0, 1000\)\}/);
});

function jsonResponse(body) {
  return {
    ok: true,
    async json() {
      return body;
    },
  };
}

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}
