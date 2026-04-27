import { createSeedState } from "../domain/appState";
import type { AppState } from "../domain/types";

const STORAGE_KEY = "mytherapy.local-state.v1";

export function loadLocalState(): AppState {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY);
    if (!raw) return createSeedState();
    const parsed = JSON.parse(String(raw)) as AppState;
    if (!parsed.rules || !parsed.tasks || !parsed.records) return createSeedState();
    return parsed;
  } catch {
    return createSeedState();
  }
}

export function saveLocalState(state: AppState) {
  uni.setStorageSync(STORAGE_KEY, JSON.stringify(state));
}

export function resetLocalState() {
  const state = createSeedState();
  saveLocalState(state);
  return state;
}
