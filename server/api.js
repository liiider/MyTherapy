import { readFile } from "node:fs/promises";
import path from "node:path";

import { analyzeInput, extractOcrDraft } from "./aiMock.js";
import {
  addOneOffTask,
  addSymptomRecord,
  collectRisks,
  createManualRecord,
  createManualRule,
  createManualTask,
  confirmOcrDraft,
  createExportReport,
  deferOcrDraft,
  ensureTasksForDate,
  saveAiRules,
  summarizeProgress,
  taskAction,
  todayISO,
  toggleRuleStatus,
  updateProfile,
  updateRule,
  validationError,
} from "./domain.js";
import { loadState, resetState, saveState } from "./store.js";

const PUBLIC_DIR = path.resolve("public");

export async function handleRequest(req, res) {
  try {
    if (req.url.startsWith("/api/")) {
      await handleApi(req, res);
      return;
    }
    await serveStatic(req, res);
  } catch (error) {
    sendError(res, error);
  }
}

async function handleApi(req, res) {
  const url = new URL(req.url, "http://localhost");
  const route = `${req.method} ${url.pathname}`;

  if (route === "GET /api/state") {
    const state = await loadState();
    ensureTasksForDate(state, todayISO());
    await saveState(state);
    sendJson(res, decorateState(state));
    return;
  }

  if (route === "POST /api/reset") {
    const state = await resetState();
    ensureTasksForDate(state, todayISO());
    await saveState(state);
    sendJson(res, decorateState(state));
    return;
  }

  if (route === "POST /api/ocr/mock") {
    const state = await loadState();
    state.ocrDraft = extractOcrDraft();
    await saveState(state);
    sendJson(res, { ocrDraft: state.ocrDraft });
    return;
  }

  if (route === "POST /api/ocr/confirm") {
    const body = await readJson(req);
    const state = await loadState();
    const rule = confirmOcrDraft(state, body);
    ensureTasksForDate(state, todayISO());
    await saveState(state);
    sendJson(res, { rule, state: decorateState(state) });
    return;
  }

  if (route === "POST /api/ocr/defer") {
    const state = await loadState();
    const draft = deferOcrDraft(state);
    await saveState(state);
    sendJson(res, { ocrDraft: draft });
    return;
  }

  if (route === "POST /api/ai/analyze") {
    const body = await readJson(req);
    const state = await loadState();
    const suggestion = analyzeInput(body);
    state.aiSuggestions = [suggestion, ...state.aiSuggestions].slice(0, 10);
    await saveState(state);
    sendJson(res, { suggestion });
    return;
  }

  if (route === "POST /api/ai/save-rules") {
    const body = await readJson(req);
    const state = await loadState();
    const rules = saveAiRules(state, Array.isArray(body.rules) ? body.rules : []);
    ensureTasksForDate(state, todayISO());
    await saveState(state);
    sendJson(res, { rules, state: decorateState(state) });
    return;
  }

  if (route === "POST /api/tasks/one-off") {
    const body = await readJson(req);
    const state = await loadState();
    const task = addOneOffTask(state, body);
    await saveState(state);
    sendJson(res, { task, state: decorateState(state) });
    return;
  }

  if (route === "POST /api/rules/manual") {
    const body = await readJson(req);
    const state = await loadState();
    const rule = createManualRule(state, body);
    ensureTasksForDate(state, todayISO());
    await saveState(state);
    sendJson(res, { rule, state: decorateState(state) });
    return;
  }

  if (route === "POST /api/tasks/manual") {
    const body = await readJson(req);
    const state = await loadState();
    const task = createManualTask(state, body);
    await saveState(state);
    sendJson(res, { task, state: decorateState(state) });
    return;
  }

  if (route === "POST /api/records/manual") {
    const body = await readJson(req);
    const state = await loadState();
    const record = createManualRecord(state, body);
    await saveState(state);
    sendJson(res, { record, state: decorateState(state) });
    return;
  }

  if (route === "POST /api/records/symptom") {
    const body = await readJson(req);
    const state = await loadState();
    const record = addSymptomRecord(state, body);
    await saveState(state);
    sendJson(res, { record, state: decorateState(state) });
    return;
  }

  const taskActionMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)\/action$/);
  if (req.method === "POST" && taskActionMatch) {
    const body = await readJson(req);
    const state = await loadState();
    const result = taskAction(state, taskActionMatch[1], String(body.action ?? ""), body.actualAt, body);
    await saveState(state);
    sendJson(res, { ...result, state: decorateState(state) });
    return;
  }

  const ruleMatch = url.pathname.match(/^\/api\/rules\/([^/]+)$/);
  if (req.method === "PATCH" && ruleMatch) {
    const body = await readJson(req);
    const state = await loadState();
    const rule =
      Object.keys(body).length === 1 && body.status
        ? toggleRuleStatus(state, ruleMatch[1], String(body.status))
        : updateRule(state, ruleMatch[1], body);
    ensureTasksForDate(state, todayISO());
    await saveState(state);
    sendJson(res, { rule, state: decorateState(state) });
    return;
  }

  if (route === "PATCH /api/profile") {
    const body = await readJson(req);
    const state = await loadState();
    const profile = updateProfile(state, body);
    await saveState(state);
    sendJson(res, { profile, state: decorateState(state) });
    return;
  }

  if (route === "POST /api/reports") {
    const state = await loadState();
    const report = createExportReport(state);
    await saveState(state);
    sendJson(res, { report, state: decorateState(state) });
    return;
  }

  throw notFound();
}

function decorateState(state) {
  return {
    ...state,
    today: todayISO(),
    risks: collectRisks(state),
    summary: summarizeProgress(state),
  };
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw validationError("body", "Request body must be valid JSON.");
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, "http://localhost");
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const normalized = path.normalize(decodeURIComponent(requested)).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, normalized);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    throw notFound();
  }

  try {
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType(filePath) });
    res.end(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      const fallback = await readFile(path.join(PUBLIC_DIR, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fallback);
      return;
    }
    throw error;
  }
}

function sendJson(res, payload, status = 200) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function sendError(res, error) {
  const status = error.status && Number.isInteger(error.status) ? error.status : 500;
  sendJson(
    res,
    {
      error: {
        code: error.code ?? "INTERNAL_ERROR",
        message: status >= 500 ? "服务暂时不可用，请稍后再试。" : error.message,
        field: error.field,
      },
    },
    status,
  );
}

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}

function notFound() {
  const error = new Error("Not found.");
  error.status = 404;
  error.code = "NOT_FOUND";
  return error;
}
