import { nowLocal, todayISO } from "./domain.js";

export function analyzeInput(input) {
  const text = String(input?.text ?? "").trim();
  const date = todayISO();

  return {
    id: `AI-${Date.now()}`,
    inputType: input?.imageRef ? "text_image" : "text",
    rawInput: text,
    createdAt: nowLocal(),
    status: "pending_confirmation",
    ruleSuggestions: [
      {
        type: "medication",
        title: text.includes("阿司匹林") ? "阿司匹林" : "补剂",
        time: "08:30",
        instruction: "饭后 1 片",
        notes: "来自 mock AI，需用户核对医嘱后保存。",
      },
      {
        type: "symptom",
        title: "晚间副作用自查",
        time: "20:00",
        instruction: "记录恶心、头晕、胃痛等不适",
        notes: "用于复诊前回顾，不提供治疗建议。",
      },
    ],
    oneOffTasks: [
      {
        type: "reminder",
        title: "今晚 9 点补水提醒",
        scheduledAt: `${date}T21:00`,
        instruction: "喝水 300ml",
      },
    ],
    recordSuggestions: [
      {
        type: "symptom",
        actualAt: `${date}T21:30`,
        value: "轻微",
        note: "记录今晚恶心感受：轻微，未影响睡眠。",
      },
    ],
    disclaimer: "AI 仅做结构化整理，不提供诊断、治疗或剂量建议。",
  };
}

export function extractOcrDraft() {
  return {
    id: `D-${Date.now()}`,
    status: "pending",
    title: "补剂",
    dose: "1 片",
    frequency: "每天 1 次",
    time: "08:30",
    instruction: "饭后服用",
    notes: "mock OCR：请按处方或医生医嘱人工核对。",
    confidenceFlags: ["frequency", "course"],
  };
}
