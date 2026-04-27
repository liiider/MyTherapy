export type TherapyType = "medication" | "symptom" | "metric" | "mood" | "activity" | "reminder";
export type RuleStatus = "enabled" | "paused";
export type TaskStatus = "pending" | "done" | "delayed" | "skipped" | "backfilled";
export type TaskAction = "done" | "delayed" | "skipped" | "backfilled";

export interface Profile {
  name: string;
  privacyAcknowledged: boolean;
  notificationHealthy: boolean;
}

export interface Inventory {
  amount: number;
  threshold: number;
  unit: string;
}

export interface Rule {
  id: string;
  type: Exclude<TherapyType, "reminder">;
  title: string;
  schedule: {
    frequency: "daily";
    time: string;
  };
  instruction: string;
  source: string;
  status: RuleStatus;
  notes: string;
  inventory: Inventory | null;
  createdAt: string;
}

export interface Task {
  id: string;
  ruleId: string | null;
  type: TherapyType;
  title: string;
  scheduledAt: string;
  instruction: string;
  source: string;
  isOneOff: boolean;
  status: TaskStatus;
}

export interface RecordEntry {
  id: string;
  taskId: string | null;
  ruleId: string | null;
  type: TherapyType;
  plannedAt: string;
  actualAt: string;
  action: TaskAction;
  value: string;
  note: string;
  sourcePage: string;
}

export interface OcrDraft {
  id: string;
  status: "pending" | "saved" | "deferred";
  title: string;
  dose: string;
  frequency: string;
  time: string;
  instruction: string;
  notes: string;
  confidenceFlags: string[];
}

export interface AiSuggestion {
  id: string;
  rawInput: string;
  createdAt: string;
  ruleSuggestions: Array<{
    type: Exclude<TherapyType, "reminder">;
    title: string;
    time: string;
    instruction: string;
    notes?: string;
  }>;
  oneOffTasks: Array<{
    type: TherapyType;
    title: string;
    scheduledAt: string;
    instruction: string;
  }>;
  recordSuggestions: Array<{
    type: TherapyType;
    actualAt: string;
    value?: string;
    note: string;
  }>;
  disclaimer: string;
}

export interface ExportReport {
  id: string;
  createdAt: string;
  generatedFrom: "records_and_rule_snapshot";
  records: RecordEntry[];
  rules: Rule[];
}

export interface AppState {
  profile: Profile;
  ocrDraft: OcrDraft;
  aiSuggestions: AiSuggestion[];
  rules: Rule[];
  tasks: Task[];
  records: RecordEntry[];
  reports: ExportReport[];
}

export interface Risk {
  id: string;
  type: "low_stock" | "notification_unhealthy" | "ocr_low_confidence";
  severity: "high" | "medium";
  title: string;
  description: string;
}
