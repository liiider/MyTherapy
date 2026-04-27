import type { AiSuggestion, OcrDraft } from "../domain/types";

const API_BASE = "";

export async function analyzeText(text: string): Promise<AiSuggestion> {
  const response = await request<{ suggestion: AiSuggestion }>("/api/ai/analyze", { text });
  return response.suggestion;
}

export async function extractOcrDraft(input: { imageUrl?: string; text?: string }): Promise<OcrDraft> {
  const response = await request<{ ocrDraft: OcrDraft }>("/api/ocr/mock", input);
  return response.ocrDraft;
}

async function request<T>(path: string, body: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE}${path}`,
      method: "POST",
      header: { "Content-Type": "application/json" },
      data: body,
      success: (result) => {
        const statusCode = result.statusCode ?? 500;
        if (statusCode >= 200 && statusCode < 300) {
          resolve(result.data as T);
          return;
        }
        const data = result.data as { error?: { message?: string } };
        reject(new Error(data?.error?.message ?? "服务暂时不可用"));
      },
      fail: () => reject(new Error("网络不可用，请稍后再试")),
    });
  });
}
