import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(packageRoot, "../..");

for (const file of ["README.md", "LICENSE"]) {
  const source = path.join(repoRoot, file);
  if (existsSync(source)) copyFileSync(source, path.join(packageRoot, file));
}

const media = path.join(repoRoot, "media");
if (existsSync(media)) {
  mkdirSync(path.join(packageRoot, "media"), { recursive: true });
  cpSync(media, path.join(packageRoot, "media"), { recursive: true });
}
