import assert from "node:assert/strict";
import test from "node:test";

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
