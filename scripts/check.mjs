import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const roots = ["server", "public", "scripts", "test"];
const files = [];

for (const root of roots) {
  await collectJsFiles(root, files);
}

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

await validateFrontendRoutes();

async function collectJsFiles(dir, output) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectJsFiles(fullPath, output);
    } else if (entry.name.endsWith(".js") || entry.name.endsWith(".mjs")) {
      output.push(fullPath);
    }
  }
}

async function validateFrontendRoutes() {
  const source = await import("node:fs/promises").then((fs) => fs.readFile("public/app.js", "utf8"));
  const routeNames = [...source.matchAll(/\n  ([a-zA-Z]+): \{ label:/g)].map((match) => match[1]);
  const routeRefs = [...source.matchAll(/data-route="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((route) => !route.includes("${"));
  const missingRoutes = [...new Set(routeRefs.filter((route) => !routeNames.includes(route)))];

  if (missingRoutes.length) {
    console.error(`Missing route definitions: ${missingRoutes.join(", ")}`);
    process.exit(1);
  }
}
