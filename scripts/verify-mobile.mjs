import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const mobileRoot = path.join(root, "mobile");
const requiredFiles = [
  "package.json",
  "src/App.vue",
  "src/main.ts",
  "src/manifest.json",
  "src/pages.json",
  "src/domain/appState.ts",
  "src/domain/types.ts",
  "src/services/aiGateway.ts",
  "src/services/localStore.ts",
  "src/stores/appStore.ts",
  "src/styles/tokens.scss",
];

for (const file of requiredFiles) {
  await assertFile(path.join(mobileRoot, file));
}

const pagesJson = JSON.parse(await readFile(path.join(mobileRoot, "src/pages.json"), "utf8"));
if (!Array.isArray(pagesJson.pages) || pagesJson.pages.length < 6) {
  throw new Error("mobile/src/pages.json must define the core app pages.");
}

for (const page of pagesJson.pages) {
  if (!page.path || typeof page.path !== "string") throw new Error("Each mobile page must include a path.");
  await assertFile(path.join(mobileRoot, "src", `${page.path}.vue`));
}

const appState = await readFile(path.join(mobileRoot, "src/domain/appState.ts"), "utf8");
assertIncludes(appState, "privacyAcknowledged", "mobile app state must keep privacy acknowledgement.");
assertIncludes(appState, "addMinutes", "mobile app state must handle delayed tasks.");
assertIncludes(appState, "formatLocalDateTime", "mobile app state must format local time without UTC shifts.");

const store = await readFile(path.join(mobileRoot, "src/stores/appStore.ts"), "utf8");
assertIncludes(store, "请先确认隐私授权", "AI persistence must require privacy acknowledgement.");

const manifest = await readFile(path.join(mobileRoot, "src/manifest.json"), "utf8");
assertIncludes(manifest, "NSCameraUsageDescription", "iOS camera privacy description is required.");
assertIncludes(manifest, "NSPhotoLibraryUsageDescription", "iOS photo privacy description is required.");

const allText = await readChangedMobileText();
const secretPatterns = [
  /c8254ded8/i,
  /3NNAKh60/i,
  /sk-[A-Za-z0-9_-]{20,}/,
  /(ZHIPUAI_API_KEY|BIGMODEL_API_KEY)\s*=\s*["']?[A-Za-z0-9._-]{8,}/,
  /BEGIN (RSA|OPENSSH|PRIVATE) KEY/,
];
for (const pattern of secretPatterns) {
  if (pattern.test(allText)) throw new Error(`Potential secret found in mobile files: ${pattern}`);
}

console.log("Mobile app structure verification passed.");

async function assertFile(filePath) {
  const result = await stat(filePath);
  if (!result.isFile()) throw new Error(`${filePath} is not a file.`);
}

function assertIncludes(text, needle, message) {
  if (!text.includes(needle)) throw new Error(message);
}

async function readChangedMobileText() {
  const files = [
    ...requiredFiles.map((file) => path.join(mobileRoot, file)),
    ...pagesJson.pages.map((page) => path.join(mobileRoot, "src", `${page.path}.vue`)),
  ];
  const contents = await Promise.all(files.map((file) => readFile(file, "utf8")));
  return contents.join("\n");
}
