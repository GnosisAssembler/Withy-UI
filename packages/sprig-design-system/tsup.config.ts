import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "tsup";

const clientDirective = '"use client";\n';

export default defineConfig({
  entry: ["src/index.ts", "src/charts.ts", "src/widgets.ts", "src/examples.ts"],
  format: ["esm"],
  dts: true,
  splitting: true,
  sourcemap: false,
  clean: true,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
    /^echarts(\/.*)?$/,
    /^@radix-ui\/.*/,
    "lucide-react",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ],
  async onSuccess() {
    const dist = path.resolve("dist");
    mkdirSync(dist, { recursive: true });
    for (const file of readdirSync(dist)) {
      if (!file.endsWith(".js")) continue;
      const fullPath = path.join(dist, file);
      const source = readFileSync(fullPath, "utf8");
      if (!source.startsWith(clientDirective)) {
        writeFileSync(fullPath, `${clientDirective}${source}`);
      }
    }
    copyFileSync("src/styles.css", path.join(dist, "styles.css"));
    copyFileSync("src/fonts.css", path.join(dist, "fonts.css"));
  },
});
