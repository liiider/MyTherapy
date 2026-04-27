const LOW_STOCK_THRESHOLD = 7;

export const TASK_ACTIONS = new Set(["done", "delayed", "skipped", "backfilled"]);
export const RULE_STATUSES = new Set(["enabled", "paused"]);

export function createSeedState(date = todayISO()) {
  return {
    profile: {
      name: "Lider",
      notificationHealthy: false,
      privacyAcknowledged: false,
    },
    ocrDraft: {
      id: "D-2031",
      status: "pending",
      title: "补剂",
      dose: "1 片",
      frequency: "每天 1 次",
      time: "08:30",
      instruction: "饭后服用",
      notes: "医生建议连续观察胃部反应。",
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
        id: "R-1101",
        type: "mood",
        title: "午间情绪",
        time: "12:30",
        instruction: "情绪自评",
        source: "AI 生成",
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

export function createRule(input) {
  return {
    id: input.id ?? createId("R"),
    type: input.type,
    title: input.title.trim(),
    schedule: {
      frequency: input.frequency ?? "daily",
      time: input.time,
    },
    instruction: input.instruction.trim(),
    source: input.source,
    status: input.status ?? "enabled",
    notes: input.notes ?? "",
    inventory: input.inventory ?? null,
    createdAt: input.createdAt ?? nowLocal(),
  };
}

export function createTask(input) {
  return {
    id: input.id ?? createId("T"),
    ruleId: input.ruleId ?? null,
    type: input.type,
    title: input.title.trim(),
    scheduledAt: input.scheduledAt,
    instruction: input.instruction.trim(),
    source: input.source,
    isOneOff: Boolean(input.isOneOff),
    status: input.status ?? "pending",
  };
}

export function createRecord(input) {
  return {
    id: input.id ?? createId("REC"),
    taskId: input.taskId ?? null,
    ruleId: input.ruleId ?? null,
    type: input.type,
    plannedAt: input.plannedAt,
    actualAt: input.actualAt,
    action: input.action,
    value: input.value ?? "",
    note: input.note ?? "",
    sourcePage: input.sourcePage ?? "system",
  };
}

export function ensureTasksForDate(state, date = todayISO()) {
  for (const rule of state.rules) {
    if (rule.status !== "enabled" || rule.schedule.frequency !== "daily") {
      continue;
    }

    const alreadyExists = state.tasks.some((task) => task.ruleId === rule.id && task.scheduledAt.startsWith(date));
    if (alreadyExists) {
      continue;
    }

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

  return state.tasks.filter((task) => task.scheduledAt.startsWith(date));
}

export function confirmOcrDraft(state, draftInput) {
  const draft = normalizeOcrDraft(draftInput);
  const existing = state.rules.find((rule) => rule.title === draft.title && rule.source === "OCR 导入");

  state.ocrDraft = {
    ...state.ocrDraft,
    ...draft,
    status: "saved",
    confidenceFlags: [],
  };

  if (existing) {
    return existing;
  }

  const rule = createRule({
    type: "medication",
    title: draft.title,
    time: draft.time,
    instruction: `${draft.instruction} ${draft.dose}`.trim(),
    source: "OCR 导入",
    notes: draft.notes,
    inventory: {
      amount: 14,
      threshold: LOW_STOCK_THRESHOLD,
      unit: inferInventoryUnit(draft.dose),
    },
  });
  state.rules.push(rule);
  return rule;
}

export function deferOcrDraft(state) {
  state.ocrDraft.status = "deferred";
  return state.ocrDraft;
}

export function saveAiRules(state, suggestions) {
  const created = [];
  for (const item of suggestions) {
    const suggestion = normalizeRuleSuggestion(item);
    const existing = state.rules.find((rule) => rule.title === suggestion.title && rule.source === "AI 生成");
    if (existing) {
      created.push(existing);
      continue;
    }

    const rule = createRule({
      type: suggestion.type,
      title: suggestion.title,
      time: suggestion.time,
      instruction: suggestion.instruction,
      source: "AI 生成",
      notes: suggestion.notes,
    });
    state.rules.push(rule);
    created.push(rule);
  }
  return created;
}

export function createManualRule(state, input) {
  const suggestion = normalizeRuleSuggestion(input);
  const rule = createRule({
    type: suggestion.type,
    title: suggestion.title,
    time: suggestion.time,
    instruction: suggestion.instruction,
    source: "手动创建",
    notes: suggestion.notes,
    inventory: suggestion.type === "medication" ? normalizeInventoryInput(input.inventory) : null,
  });
  state.rules.push(rule);
  return rule;
}

export function createManualTask(state, input) {
  const normalized = normalizeOneOffTask(input);
  const task = createTask({
    ruleId: null,
    type: normalized.type,
    title: normalized.title,
    scheduledAt: normalized.scheduledAt,
    instruction: normalized.instruction,
    source: "手动一次性",
    isOneOff: true,
  });
  state.tasks.push(task);
  return task;
}

export function createManualRecord(state, input) {
  const actualAt = requireDateTime(input.actualAt, "actualAt");
  const record = createRecord({
    type: requireText(input.type, "type"),
    plannedAt: actualAt,
    actualAt,
    action: "done",
    value: String(input.value ?? "").trim(),
    note: String(input.note ?? "").trim() || "手动记录",
    sourcePage: "manual-entry",
  });
  state.records.push(record);
  return record;
}

export function addOneOffTask(state, input) {
  const normalized = normalizeOneOffTask(input);
  const existing = state.tasks.find(
    (task) => task.isOneOff && task.title === normalized.title && task.scheduledAt === normalized.scheduledAt,
  );
  if (existing) {
    return existing;
  }

  const task = createTask({
    ruleId: null,
    type: normalized.type,
    title: normalized.title,
    scheduledAt: normalized.scheduledAt,
    instruction: normalized.instruction,
    source: "AI 一次性建议",
    isOneOff: true,
  });
  state.tasks.push(task);
  return task;
}

export function addSymptomRecord(state, input) {
  const actualAt = requireDateTime(input.actualAt, "actualAt");
  const record = createRecord({
    type: input.type ?? "symptom",
    plannedAt: actualAt,
    actualAt,
    action: "done",
    value: String(input.value ?? ""),
    note: String(input.note ?? "").trim() || "症状记录",
    sourcePage: "ai",
  });
  state.records.push(record);
  return record;
}

export function taskAction(state, taskId, action, actualAt = nowLocal(), payload = {}) {
  if (!TASK_ACTIONS.has(action)) {
    throw validationError("action", "Unsupported task action.");
  }

  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) {
    throw notFoundError("Task not found.");
  }

  const plannedAt = task.scheduledAt;
  const normalizedActualAt = requireDateTime(actualAt, "actualAt");

  if (task.status === "done" || task.status === "skipped" || task.status === "backfilled") {
    throw validationError("task", "Task is already resolved.");
  }

  if (action === "delayed") {
    const minutes = Number(payload.minutes ?? 30);
    if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 240) {
      throw validationError("minutes", "Delay minutes must be between 1 and 240.");
    }
    task.scheduledAt = addMinutes(task.scheduledAt, minutes);
    task.status = "delayed";
  } else {
    task.status = action;
    if (action === "done") {
      decrementInventoryForTask(state, task);
    }
  }

  const record = createRecord({
    taskId: task.id,
    ruleId: task.ruleId,
    type: task.type,
    plannedAt,
    actualAt: normalizedActualAt,
    action,
    value: String(payload.value ?? ""),
    note: buildActionNote(task, action, payload.note),
    sourcePage: "task-detail",
  });
  state.records.push(record);
  return { task, record };
}

export function toggleRuleStatus(state, ruleId, status) {
  if (!RULE_STATUSES.has(status)) {
    throw validationError("status", "Rule status must be enabled or paused.");
  }

  const rule = state.rules.find((item) => item.id === ruleId);
  if (!rule) {
    throw notFoundError("Rule not found.");
  }

  rule.status = status;
  return rule;
}

export function updateRule(state, ruleId, input) {
  const rule = state.rules.find((item) => item.id === ruleId);
  if (!rule) {
    throw notFoundError("Rule not found.");
  }

  if (input.title !== undefined) {
    rule.title = requireText(input.title, "title");
  }
  if (input.time !== undefined) {
    rule.schedule.time = requireTime(input.time, "time");
  }
  if (input.instruction !== undefined) {
    rule.instruction = requireText(input.instruction, "instruction");
  }
  if (input.notes !== undefined) {
    rule.notes = String(input.notes ?? "").trim();
  }
  if (input.status !== undefined) {
    if (!RULE_STATUSES.has(input.status)) {
      throw validationError("status", "Rule status must be enabled or paused.");
    }
    rule.status = input.status;
  }

  if (rule.inventory && input.inventory) {
    const amount = Number(input.inventory.amount);
    const threshold = Number(input.inventory.threshold);
    if (!Number.isFinite(amount) || amount < 0) {
      throw validationError("inventory.amount", "Inventory amount must be zero or greater.");
    }
    if (!Number.isFinite(threshold) || threshold < 0) {
      throw validationError("inventory.threshold", "Inventory threshold must be zero or greater.");
    }
    rule.inventory.amount = amount;
    rule.inventory.threshold = threshold;
    rule.inventory.unit = requireText(input.inventory.unit ?? rule.inventory.unit, "inventory.unit");
  }

  return rule;
}

export function updateProfile(state, input) {
  if (input.name !== undefined) {
    state.profile.name = requireText(input.name, "name");
  }
  if (input.notificationHealthy !== undefined) {
    state.profile.notificationHealthy = Boolean(input.notificationHealthy);
  }
  if (input.privacyAcknowledged !== undefined) {
    state.profile.privacyAcknowledged = Boolean(input.privacyAcknowledged);
  }
  return state.profile;
}

export function createExportReport(state, createdAt = nowLocal()) {
  const report = {
    id: createId("REPORT"),
    type: "follow_up",
    dateRange: "all_records",
    includedSections: ["rules", "tasks", "records", "inventory", "risks"],
    generatedFrom: "records_and_rule_snapshot",
    createdAt,
    records: state.records.map((record) => ({ ...record })),
    rules: state.rules.map((rule) => ({
      id: rule.id,
      type: rule.type,
      title: rule.title,
      schedule: { ...rule.schedule },
      instruction: rule.instruction,
      source: rule.source,
      status: rule.status,
      inventory: rule.inventory ? { ...rule.inventory } : null,
    })),
    summary: summarizeProgress(state),
  };
  state.reports.push(report);
  return report;
}

export function summarizeProgress(state, date = todayISO()) {
  const todayTasks = state.tasks.filter((task) => task.scheduledAt.startsWith(date));
  const completed = todayTasks.filter((task) => task.status === "done" || task.status === "backfilled").length;
  const total = todayTasks.length;

  return {
    date,
    totalTasks: total,
    completedTasks: completed,
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
    recordCount: state.records.length,
    activeRules: state.rules.filter((rule) => rule.status === "enabled").length,
  };
}

export function collectRisks(state) {
  const risks = [];
  for (const rule of state.rules) {
    if (rule.inventory && rule.inventory.amount <= rule.inventory.threshold) {
      risks.push({
        id: `RISK-${rule.id}-LOW-STOCK`,
        type: "low_stock",
        severity: "high",
        title: `${rule.title}库存不足`,
        description: `剩余 ${rule.inventory.amount} ${rule.inventory.unit}，低于阈值 ${rule.inventory.threshold} ${rule.inventory.unit}。`,
        sourceType: "inventory",
        sourceId: rule.id,
        suggestedAction: "补货或调整库存。",
        status: "open",
      });
    }
  }

  if (!state.profile.notificationHealthy) {
    risks.push({
      id: "RISK-NOTIFICATION",
      type: "notification_unhealthy",
      severity: "medium",
      title: "通知权限可能失效",
      description: "本地原型无法验证系统通知权限，正式 iOS 版必须接入权限检测。",
      sourceType: "profile",
      sourceId: "notificationHealthy",
      suggestedAction: "检查通知权限和后台刷新。",
      status: "open",
    });
  }

  if (state.ocrDraft.status === "pending" && state.ocrDraft.confidenceFlags?.length) {
    risks.push({
      id: "RISK-OCR-CONFIDENCE",
      type: "ocr_low_confidence",
      severity: "medium",
      title: "OCR 草稿存在低置信字段",
      description: "频次或疗程字段需要人工确认后才能生效。",
      sourceType: "ocrDraft",
      sourceId: state.ocrDraft.id,
      suggestedAction: "进入 OCR 确认页核对。",
      status: "open",
    });
  }

  return risks;
}

export function todayISO() {
  return nowLocal().slice(0, 10);
}

export function nowLocal() {
  return formatLocalDateTime(new Date());
}

export function addMinutes(dateTime, minutes) {
  const date = parseLocalDateTime(dateTime);
  date.setMinutes(date.getMinutes() + minutes);
  return formatLocalDateTime(date);
}

export function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function normalizeOcrDraft(input) {
  return {
    title: requireText(input.title, "title"),
    dose: requireText(input.dose, "dose"),
    frequency: requireText(input.frequency, "frequency"),
    time: requireTime(input.time, "time"),
    instruction: requireText(input.instruction, "instruction"),
    notes: String(input.notes ?? "").trim(),
  };
}

function normalizeRuleSuggestion(input) {
  return {
    type: requireText(input.type, "type"),
    title: requireText(input.title, "title"),
    time: requireTime(input.time, "time"),
    instruction: requireText(input.instruction, "instruction"),
    notes: String(input.notes ?? "").trim(),
  };
}

function normalizeOneOffTask(input) {
  return {
    type: String(input.type ?? "reminder").trim(),
    title: requireText(input.title, "title"),
    scheduledAt: requireDateTime(input.scheduledAt, "scheduledAt"),
    instruction: requireText(input.instruction, "instruction"),
  };
}

function normalizeInventoryInput(input) {
  if (!input) {
    return {
      amount: 0,
      threshold: LOW_STOCK_THRESHOLD,
      unit: "片",
    };
  }

  const amount = Number(input.amount ?? 0);
  const threshold = Number(input.threshold ?? LOW_STOCK_THRESHOLD);
  if (!Number.isFinite(amount) || amount < 0) {
    throw validationError("inventory.amount", "Inventory amount must be zero or greater.");
  }
  if (!Number.isFinite(threshold) || threshold < 0) {
    throw validationError("inventory.threshold", "Inventory threshold must be zero or greater.");
  }

  return {
    amount,
    threshold,
    unit: requireText(input.unit ?? "片", "inventory.unit"),
  };
}

function requireText(value, field) {
  const text = String(value ?? "").trim();
  if (!text) {
    throw validationError(field, `${field} is required.`);
  }
  if (text.length > 120) {
    throw validationError(field, `${field} is too long.`);
  }
  return text;
}

function requireTime(value, field) {
  const text = requireText(value, field);
  const match = text.match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    throw validationError(field, `${field} must use valid HH:mm.`);
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) {
    throw validationError(field, `${field} must use a valid HH:mm.`);
  }
  return text;
}

function requireDateTime(value, field) {
  const text = requireText(value, field);
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) {
    throw validationError(field, `${field} must use valid YYYY-MM-DDTHH:mm.`);
  }

  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const parsed = new Date(year, month - 1, day, hour, minute);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hour ||
    parsed.getMinutes() !== minute
  ) {
    throw validationError(field, `${field} must use a valid YYYY-MM-DDTHH:mm.`);
  }
  return text;
}

function decrementInventoryForTask(state, task) {
  if (!task.ruleId) {
    return;
  }
  const rule = state.rules.find((item) => item.id === task.ruleId);
  if (!rule?.inventory) {
    return;
  }
  rule.inventory.amount = Math.max(0, rule.inventory.amount - 1);
}

function buildActionNote(task, action, note) {
  const explicitNote = String(note ?? "").trim();
  if (explicitNote) {
    return explicitNote;
  }

  const labels = {
    done: "已完成",
    delayed: "已延后",
    skipped: "已跳过",
    backfilled: "已补记",
  };
  return `${task.title}${labels[action] ?? action}。`;
}

function inferInventoryUnit(dose) {
  if (dose.includes("粒")) return "粒";
  if (dose.includes("袋")) return "袋";
  if (dose.includes("ml")) return "ml";
  return "片";
}

function parseLocalDateTime(dateTime) {
  const [datePart, timePart] = requireDateTime(dateTime, "dateTime").split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

function formatLocalDateTime(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`;
}

export function validationError(field, message) {
  const error = new Error(message);
  error.status = 400;
  error.code = "VALIDATION_ERROR";
  error.field = field;
  return error;
}

export function notFoundError(message) {
  const error = new Error(message);
  error.status = 404;
  error.code = "NOT_FOUND";
  return error;
}
