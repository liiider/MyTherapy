import { reactive } from "vue";

import {
  addOneOffTask,
  collectRisks,
  confirmOcrDraft,
  createExportReport,
  createRule,
  ensureTasksForDate,
  performTaskAction,
  saveAiSuggestion,
  todayISO,
} from "../domain/appState";
import type { AiSuggestion, AppState, OcrDraft, Rule, TaskAction } from "../domain/types";
import { loadLocalState, resetLocalState, saveLocalState } from "../services/localStore";

const state = reactive<{ data: AppState; loaded: boolean; error: string }>({
  data: loadLocalState(),
  loaded: false,
  error: "",
});

export function useAppStore() {
  const persist = () => saveLocalState(state.data);

  return {
    state,
    load() {
      state.data = loadLocalState();
      ensureTasksForDate(state.data);
      state.loaded = true;
      persist();
    },
    reset() {
      state.data = resetLocalState();
      state.loaded = true;
    },
    todayTasks() {
      const today = todayISO();
      return state.data.tasks.filter((task) => task.scheduledAt.startsWith(today)).sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
    },
    risks() {
      return collectRisks(state.data);
    },
    acknowledgePrivacy() {
      state.data.profile.privacyAcknowledged = true;
      persist();
    },
    saveManualRule(rule: Pick<Rule, "type" | "title" | "instruction" | "notes" | "inventory"> & { time: string }) {
      const created = createRule({
        type: rule.type,
        title: rule.title,
        time: rule.time,
        instruction: rule.instruction,
        source: "手动创建",
        notes: rule.notes,
        inventory: rule.inventory,
      });
      state.data.rules.push(created);
      ensureTasksForDate(state.data);
      persist();
      return created;
    },
    addOneOffTask(input: Parameters<typeof addOneOffTask>[1]) {
      const task = addOneOffTask(state.data, input);
      persist();
      return task;
    },
    saveAiSuggestion(suggestion: AiSuggestion) {
      if (!state.data.profile.privacyAcknowledged) {
        throw new Error("请先确认隐私授权，再使用 AI 识别。");
      }
      const rules = saveAiSuggestion(state.data, suggestion);
      persist();
      return rules;
    },
    confirmOcrDraft(draft: OcrDraft) {
      const rule = confirmOcrDraft(state.data, draft);
      persist();
      return rule;
    },
    performTaskAction(taskId: string, action: TaskAction, actualAt?: string, note?: string) {
      const result = performTaskAction(state.data, taskId, action, actualAt, note);
      persist();
      return result;
    },
    createReport() {
      const report = createExportReport(state.data);
      persist();
      return report;
    },
  };
}
