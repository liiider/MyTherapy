import { analyzeInput as analyzeMockInput, extractOcrDraft as extractMockOcrDraft } from "./aiMock.js";
import { nowLocal, todayISO, validationError } from "./domain.js";

const ZHIPU_BASE_URL = process.env.ZHIPU_BASE_URL ?? "https://open.bigmodel.cn/api/paas/v4";
const TEXT_MODEL = process.env.ZHIPU_TEXT_MODEL ?? "glm-5";
const VISION_MODEL = process.env.ZHIPU_VISION_MODEL ?? "glm-4.5v";
const REQUEST_TIMEOUT_MS = Number(process.env.ZHIPU_TIMEOUT_MS ?? 20000);

export async function analyzeInput(input) {
  if (!zhipuApiKey()) {
    return analyzeMockInput(input);
  }

  const text = String(input?.text ?? "").trim();
  if (!text && !input?.imageRef) {
    throw validationError("text", "text is required.");
  }
  if (text.length > 1000) {
    throw validationError("text", "text is too long.");
  }

  const payload = await completeJson({
    model: TEXT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "你是患者侧用药提醒工具的信息结构化助手。只从用户明确提供的医嘱、处方、提醒或症状中抽取结构化字段。不要诊断、不要推荐治疗、不要计算或推断剂量。若缺少药名、剂量或频次，不得生成 medication 规则。",
      },
      {
        role: "user",
        content: `请把下面输入整理为 JSON。仅输出 JSON，不要 Markdown。\n\n输入：${text}\n\nJSON schema:\n{\n  "ruleSuggestions": [{"type":"medication|symptom|metric|mood|activity","title":"string","time":"HH:mm","instruction":"string","notes":"string"}],\n  "oneOffTasks": [{"type":"reminder|activity|symptom|metric","title":"string","scheduledAt":"${todayISO()}THH:mm","instruction":"string"}],\n  "recordSuggestions": [{"type":"symptom|metric|mood|activity","actualAt":"${todayISO()}THH:mm","value":"string","note":"string"}],\n  "disclaimer":"string"\n}`,
      },
    ],
  });

  return normalizeSuggestion(payload, text);
}

export async function extractOcrDraft(input = {}) {
  if (!zhipuApiKey() || (!input.imageUrl && !input.text)) {
    return extractMockOcrDraft();
  }

  const content = [];
  if (input.imageUrl) {
    content.push({ type: "image_url", image_url: { url: String(input.imageUrl) } });
  }
  content.push({
    type: "text",
    text:
      "请从处方或医嘱图片/文本中提取一个待确认的用药规则草稿。只做 OCR/结构化提取，不判断剂量是否合理。仅输出 JSON：{\"title\":\"药名\",\"dose\":\"剂量\",\"frequency\":\"频次\",\"time\":\"HH:mm\",\"instruction\":\"服用说明\",\"notes\":\"备注\",\"confidenceFlags\":[\"低置信字段名\"]}",
  });
  if (input.text) {
    content.push({ type: "text", text: `补充文本：${String(input.text).slice(0, 1000)}` });
  }

  const payload = await completeJson({
    model: VISION_MODEL,
    messages: [{ role: "user", content }],
  });

  return normalizeOcrDraft(payload);
}

function zhipuApiKey() {
  return process.env.ZHIPUAI_API_KEY || process.env.BIGMODEL_API_KEY || "";
}

async function completeJson({ model, messages }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${ZHIPU_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${zhipuApiKey()}`,
      },
      body: JSON.stringify({
        model,
        messages,
        thinking: { type: "disabled" },
        temperature: 0.1,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = body?.error?.message || body?.msg || "AI 服务暂时不可用，请稍后再试。";
      throw serviceError(message);
    }

    const content = body?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      throw serviceError("AI 服务返回格式异常。");
    }

    return parseJsonContent(content);
  } catch (error) {
    if (error.name === "AbortError") {
      throw serviceError("AI 服务请求超时，请稍后再试。");
    }
    if (error.status) {
      throw error;
    }
    throw serviceError("AI 服务暂时不可用，请稍后再试。");
  } finally {
    clearTimeout(timeout);
  }
}

function parseJsonContent(content) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1].trim() : trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < start) {
    throw serviceError("AI 服务未返回可解析的 JSON。");
  }

  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    throw serviceError("AI 服务返回的 JSON 无法解析。");
  }
}

function normalizeSuggestion(payload, rawInput) {
  const date = todayISO();
  return {
    id: `AI-${Date.now()}`,
    inputType: "text",
    rawInput,
    createdAt: nowLocal(),
    status: "pending_confirmation",
    ruleSuggestions: asArray(payload.ruleSuggestions).map(normalizeRuleSuggestion).filter(Boolean).slice(0, 5),
    oneOffTasks: asArray(payload.oneOffTasks).map((item) => normalizeOneOffTask(item, date)).filter(Boolean).slice(0, 5),
    recordSuggestions: asArray(payload.recordSuggestions).map((item) => normalizeRecordSuggestion(item, date)).filter(Boolean).slice(0, 5),
    disclaimer: "AI 仅做结构化整理，不提供诊断、治疗或剂量建议。",
  };
}

function normalizeRuleSuggestion(item) {
  const type = allowed(item?.type, ["medication", "symptom", "metric", "mood", "activity"]);
  const title = shortText(item?.title);
  const time = validTime(item?.time);
  const instruction = shortText(item?.instruction);
  if (!type || !title || !time || !instruction) return null;
  return {
    type,
    title,
    time,
    instruction,
    notes: shortText(item?.notes) || "来自智谱 AI，需用户核对后保存。",
  };
}

function normalizeOneOffTask(item, date) {
  const type = allowed(item?.type, ["reminder", "activity", "symptom", "metric"]) || "reminder";
  const title = shortText(item?.title);
  const scheduledAt = validDateTime(item?.scheduledAt) || `${date}T21:00`;
  const instruction = shortText(item?.instruction);
  if (!title || !instruction) return null;
  return { type, title, scheduledAt, instruction };
}

function normalizeRecordSuggestion(item, date) {
  const type = allowed(item?.type, ["symptom", "metric", "mood", "activity"]) || "symptom";
  const actualAt = validDateTime(item?.actualAt) || `${date}T21:30`;
  const value = shortText(item?.value) || "";
  const note = shortText(item?.note);
  if (!note) return null;
  return { type, actualAt, value, note };
}

function normalizeOcrDraft(payload) {
  return {
    id: `D-${Date.now()}`,
    status: "pending",
    title: shortText(payload.title) || "待确认药品",
    dose: shortText(payload.dose) || "待确认剂量",
    frequency: shortText(payload.frequency) || "待确认频次",
    time: validTime(payload.time) || "08:30",
    instruction: shortText(payload.instruction) || "请按医嘱核对后服用",
    notes: shortText(payload.notes) || "来自智谱 OCR/视觉模型，请人工核对。",
    confidenceFlags: asArray(payload.confidenceFlags).map(shortText).filter(Boolean).slice(0, 5),
  };
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function shortText(value) {
  const text = String(value ?? "").trim();
  return text ? text.slice(0, 120) : "";
}

function allowed(value, values) {
  const text = String(value ?? "").trim();
  return values.includes(text) ? text : "";
}

function validTime(value) {
  const text = String(value ?? "").trim();
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(text) ? text : "";
}

function validDateTime(value) {
  const text = String(value ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/.test(text) ? text : "";
}

function serviceError(message) {
  const error = new Error(message);
  error.status = 502;
  error.code = "AI_SERVICE_ERROR";
  return error;
}
