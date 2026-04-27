import type { AiSuggestion, AppState, ExportReport, OcrDraft, RecordEntry, Risk, Rule, Task, TaskAction } from "./types";

const LOW_STOCK_THRESHOLD = 7;

export function createSeedState(date = todayISO()): AppState {
  return {
    profile: {
      name: "Lider",
      privacyAcknowledged: false,
      notificationHealthy: false,
    },
    ocrDraft: {
      id: "D-2031",
      status: "pending",
      title: "补剂",
      dose: "1 片",
      frequency: "每天 1 次",
      time: "08:30",
      instruction: "饭后服用",
      notes: "请按处方或医生医嘱人工核对。",
      confidenceFlags: ["frequency", "course"],
    },
    aiSuggestions: [],
    rules: [
      createRule({
        id: "R-1024",
        type: "medication",
        title: "补剂",
        time: "08:30",
        instruction: "饭后 1 片",
        source: "OCR 导入",
        inventory: { amount: 4, threshold: LOW_STOCK_THRESHOLD, unit: "片" },
      }),
      createRule({
        id: "R-1102",
        type: "symptom",
        title: "晚间副作用自查",
        time: "20:00",
        instruction: "恶心、头晕、胃痛",
        source: "AI 生成",
      }),
      createRule({
        id: "R-1103",
        type: "metric",
        title: "晚间体重",
        time: "21:30",
        instruction: "记录体重",
        source: "手动创建",
      }),
    ],
    tasks: [
      createTask({
        id: "T-3000",
        ruleId: null,
        type: "activity",
        title: "晨间散步",
        scheduledAt: `${date}T07:10`,
        instruction: "10 分钟",
        source: "今日沉淀",
        isOneOff: true,
        status: "done",
      }),
    ],
    records: [
      createRecord({
        id: "REC-9000",
        taskId: "T-3000",
        ruleId: null,
        type: "activity",
        plannedAt: `${date}T07:10`,
        actualAt: `${date}T07:16`,
        action: "done",
        note: "已完成晨间散步。",
      }),
    ],
    reports: [],
  };
}

export function createRule(input: {
  id?: string;
  type: Rule["type"];
  title: string;
  time: string;
  instruction: string;
  source: string;
  notes?: string;
  status?: Rule["status"];
  inventory?: Rule["inventory"];
}): Rule {
  return {
    id: input.id ?? createId("R"),
    type: input.type,
    title: cleanRequired(input.title, "名称"),
    schedule: { frequency: "daily", time: requireTime(input.time) },
    instruction: cleanRequired(input.instruction, "说明"),
    source: input.source,
    status: input.status ?? "enabled",
    notes: input.notes ?? "",
    inventory: input.inventory ?? null,
    createdAt: nowLocal(),
  };
}

export function createTask(input: {
  id?: string;
  ruleId?: string | null;
  type: Task["type"];
  title: string;
  scheduledAt: string;
  instruction: string;
  source: string;
  isOneOff: boolean;
  status?: Task["status"];
}): Task {
  return {
    id: input.id ?? createId("T"),
    ruleId: input.ruleId ?? null,
    type: input.type,
    title: cleanRequired(input.title, "任务名"),
    scheduledAt: requireDateTime(input.scheduledAt),
    instruction: cleanRequired(input.instruction, "说明"),
    source: input.source,
    isOneOff: input.isOneOff,
    status: input.status ?? "pending",
  };
}

export function createRecord(input: {
  id?: string;
  taskId?: string | null;
  ruleId?: string | null;
  type: RecordEntry["type"];
  plannedAt: string;
  actualAt: string;
  action: TaskAction;
  value?: string;
  note: string;
  sourcePage?: string;
}): RecordEntry {
  return {
    id: input.id ?? createId("REC"),
    taskId: input.taskId ?? null,
    ruleId: input.ruleId ?? null,
    type: input.type,
    plannedAt: requireDateTime(input.plannedAt),
    actualAt: requireDateTime(input.actualAt),
    action: input.action,
    value: input.value ?? "",
    note: input.note,
    sourcePage: input.sourcePage ?? "system",
  };
}

export function ensureTasksForDate(state: AppState, date = todayISO()) {
  for (const rule of state.rules) {
    if (rule.status !== "enabled") continue;
    const exists = state.tasks.some((task) => task.ruleId === rule.id && task.scheduledAt.startsWith(date));
    if (exists) continue;
    state.tasks.push(
      createTask({
        ruleId: rule.id,
        type: rule.type,
        title: rule.title,
        scheduledAt: `${date}T${rule.schedule.time}`,
        instruction: rule.instruction,
        source: rule.source,
        isOneOff: false,
      }),
    );
  }
}

export function confirmOcrDraft(state: AppState, draft: OcrDraft) {
  state.ocrDraft = { ...draft, status: "saved", confidenceFlags: [] };
  const existing = state.rules.find((rule) => rule.title === draft.title && rule.source === "OCR 导入");
  if (existing) return existing;
  const rule = createRule({
    type: "medication",
    title: draft.title,
    time: draft.time,
    instruction: `${draft.instruction} ${draft.dose}`.trim(),
    source: "OCR 导入",
    notes: draft.notes,
    inventory: { amount: 14, threshold: LOW_STOCK_THRESHOLD, unit: "片" },
  });
  state.rules.push(rule);
  ensureTasksForDate(state);
  return rule;
}

export function saveAiSuggestion(state: AppState, suggestion: AiSuggestion) {
  state.aiSuggestions = [suggestion, ...state.aiSuggestions].slice(0, 10);
  const createdRules = suggestion.ruleSuggestions.map((item) => {
    const rule = createRule({
      type: item.type,
      title: item.title,
      time: item.time,
      instruction: item.instruction,
      source: "AI 生成",
      notes: item.notes,
    });
    state.rules.push(rule);
    return rule;
  });
  for (const task of suggestion.oneOffTasks) {
    addOneOffTask(state, task);
  }
  for (const record of suggestion.recordSuggestions) {
    state.records.push(
      createRecord({
        type: record.type,
        plannedAt: record.actualAt,
        actualAt: record.actualAt,
        action: "done",
        value: record.value,
        note: record.note,
        sourcePage: "ai",
      }),
    );
  }
  ensureTasksForDate(state);
  return createdRules;
}

export function addOneOffTask(state: AppState, input: { type: Task["type"]; title: string; scheduledAt: string; instruction: string }) {
  const existing = state.tasks.find((task) => task.isOneOff && task.title === input.title && task.scheduledAt === input.scheduledAt);
  if (existing) return existing;
  const task = createTask({ ...input, source: "手动一次性", isOneOff: true });
  state.tasks.push(task);
  return task;
}

export function performTaskAction(state: AppState, taskId: string, action: TaskAction, actualAt = nowLocal(), note = "") {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) throw new Error("任务不存在");
  if (task.status === "done" || task.status === "skipped" || task.status === "backfilled") {
    throw new Error("此任务已经处理，不能重复提交");
  }

  const plannedAt = task.scheduledAt;
  if (action === "delayed") {
    task.status = "delayed";
    task.scheduledAt = addMinutes(task.scheduledAt, 30);
  } else {
    task.status = action;
    if (action === "done") decrementInventoryForTask(state, task);
  }

  const record = createRecord({
    taskId: task.id,
    ruleId: task.ruleId,
    type: task.type,
    plannedAt,
    actualAt,
    action,
    note: note || actionLabel(action, task.title),
    sourcePage: "task-detail",
  });
  state.records.push(record);
  return { task, record };
}

export function collectRisks(state: AppState): Risk[] {
  const risks: Risk[] = [];
  for (const rule of state.rules) {
    if (rule.inventory && rule.inventory.amount <= rule.inventory.threshold) {
      risks.push({
        id: `RISK-${rule.id}-LOW-STOCK`,
        type: "low_stock",
        severity: "high",
        title: `${rule.title}库存不足`,
        description: `剩余 ${rule.inventory.amount} ${rule.inventory.unit}，低于阈值 ${rule.inventory.threshold} ${rule.inventory.unit}。`,
      });
    }
  }
  if (!state.profile.notificationHealthy) {
    risks.push({
      id: "RISK-NOTIFICATION",
      type: "notification_unhealthy",
      severity: "medium",
      title: "通知权限可能失效",
      description: "请在 iOS 设置中允许 MyTherapy 发送通知。",
    });
  }
  if (state.ocrDraft.status === "pending" && state.ocrDraft.confidenceFlags.length) {
    risks.push({
      id: "RISK-OCR-CONFIDENCE",
      type: "ocr_low_confidence",
      severity: "medium",
      title: "OCR 草稿存在低置信字段",
      description: "频次或疗程字段需要人工确认后才能生效。",
    });
  }
  return risks;
}

export function createExportReport(state: AppState): ExportReport {
  const report: ExportReport = {
    id: createId("REPORT"),
    createdAt: nowLocal(),
    generatedFrom: "records_and_rule_snapshot",
    records: state.records.map((record) => ({ ...record })),
    rules: state.rules.map((rule) => ({ ...rule, schedule: { ...rule.schedule }, inventory: rule.inventory ? { ...rule.inventory } : null })),
  };
  state.reports.push(report);
  return report;
}

export function todayISO() {
  return nowLocal().slice(0, 10);
}

export function nowLocal() {
  const date = new Date();
  return formatLocalDateTime(date);
}

function cleanRequired(value: string, label: string) {
  const text = String(value ?? "").trim();
  if (!text) throw new Error(`请填写${label}`);
  return text;
}

function requireTime(value: string) {
  const text = cleanRequired(value, "时间");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(text)) throw new Error("时间格式不正确");
  return text;
}

function requireDateTime(value: string) {
  const text = cleanRequired(value, "日期时间");
  if (!/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/.test(text)) throw new Error("日期时间格式不正确");
  return text;
}

function decrementInventoryForTask(state: AppState, task: Task) {
  if (!task.ruleId) return;
  const rule = state.rules.find((item) => item.id === task.ruleId);
  if (!rule?.inventory) return;
  rule.inventory.amount = Math.max(0, rule.inventory.amount - 1);
}

function addMinutes(dateTime: string, minutes: number) {
  const [datePart, timePart] = requireDateTime(dateTime).split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const date = new Date(year, month - 1, day, hour, minute);
  date.setMinutes(date.getMinutes() + minutes);
  return formatLocalDateTime(date);
}

function formatLocalDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function actionLabel(action: TaskAction, title: string) {
  const labels: Record<TaskAction, string> = {
    done: "已完成",
    delayed: "已延后",
    skipped: "已跳过",
    backfilled: "已补记",
  };
  return `${labels[action]}：${title}`;
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
