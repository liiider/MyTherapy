import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { createSeedState } from "./domain.js";

const DATA_DIR = path.resolve("data");
const DATA_FILE = path.join(DATA_DIR, "app-state.json");

export async function loadState() {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed.rules || !parsed.tasks || !parsed.records) {
      return createSeedState();
    }
    return parsed;
  } catch (error) {
    if (error.code === "ENOENT") {
      const state = createSeedState();
      await saveState(state);
      return state;
    }
    throw error;
  }
}

export async function saveState(state) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

export async function resetState() {
  const state = createSeedState();
  await saveState(state);
  return state;
}
