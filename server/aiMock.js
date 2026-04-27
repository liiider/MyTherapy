import { nowLocal, todayISO, validationError } from "./domain.js";

export function analyzeInput(input) {
  const text = String(input?.text ?? "").trim();
  if (!text && !input?.imageRef) {
    throw validationError("text", "text is required.");
  }
  if (text.length > 1000) {
    throw validationError("text", "text is too long.");
  }

  const date = todayISO();
  const includesMedication = hasMedicationSignal(text);
  const includesOneOff = /提醒|补水|喝水|复诊|整理病历|临时任务/.test(text);
  const includesSymptom = /恶心|头痛|头疼|头晕|胃痛|不适|症状|疼|痛/.test(text);

  return {
    id: `AI-${Date.now()}`,
    inputType: input?.imageRef ? "text_image" : "text",
    rawInput: text,
    createdAt: nowLocal(),
    status: "pending_confirmation",
    ruleSuggestions: [
      ...(includesMedication
        ? [
            {
              type: "medication",
              title: text.includes("阿司匹林") ? "阿司匹林" : "补剂",
              time: "08:30",
              instruction: "饭后 1 片",
              notes: "来自 mock AI，需用户核对医嘱后保存。",
            },
          ]
        : []),
      ...(includesSymptom
        ? [
            {
              type: "symptom",
              title: "晚间副作用自查",
              time: "20:00",
              instruction: "记录恶心、头晕、胃痛等不适",
              notes: "用于复诊前回顾，不提供治疗建议。",
            },
          ]
        : []),
    ],
    oneOffTasks: includesOneOff
      ? [
          {
            type: "reminder",
            title: "今晚 9 点补水提醒",
            scheduledAt: `${date}T21:00`,
            instruction: "喝水 300ml",
          },
        ]
      : [],
    recordSuggestions: includesSymptom
      ? [
          {
            type: "symptom",
            actualAt: `${date}T21:30`,
            value: "轻微",
            note: "记录今晚恶心感受：轻微，未影响睡眠。",
          },
        ]
      : [],
    disclaimer: "AI 仅做结构化整理，不提供诊断、治疗或剂量建议。",
  };
}

function hasMedicationSignal(text) {
  if (/(没有|无|未开|没开).{0,12}(药|用药|处方|剂量)/.test(text)) {
    return false;
  }

  const hasMedicineName = /阿司匹林|补剂|药片|胶囊|处方|医生说/.test(text);
  const hasDose = /\d+\s*(片|粒|颗|毫克|mg|ml|毫升)|一片|一粒|一颗/.test(text);
  const hasFrequency = /每天|每日|早上|中午|晚上|饭前|饭后|睡前/.test(text);
  return hasMedicineName && hasDose && hasFrequency;
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
