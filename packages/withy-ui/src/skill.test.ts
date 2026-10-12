import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { semanticRoles } from "./lib/palette";
import { componentDocs } from "./components/templates/components-docs";
import { foundationGuides, foundationSections } from "./components/templates/foundations";
import { patternGuides, patternSections } from "./components/templates/patterns";
import { scenarioGuides, scenarioSections } from "./components/templates/scenarios";
import { utilityGuides, utilitySections } from "./components/templates/utilities";

const skillDir = path.resolve(__dirname, "../skills/withy-ui");

function read(file: string) {
  return readFileSync(path.join(skillDir, file), "utf8");
}

function missingFrom(text: string, values: readonly string[]) {
  return values.filter((value) => !text.includes(value));
}

type Example = { topic: string; do: string; dont: string };

function guideText(guide: { rules: readonly string[]; examples: readonly Example[] }) {
  return [...guide.rules, ...guide.examples.flatMap((example) => [example.do, example.dont])];
}

describe("agent skill", () => {
  it("has the frontmatter that Cursor and Claude read", () => {
    const skill = read("SKILL.md");
    const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(skill)?.[1] ?? "";
    const name = /^name: (.+)$/m.exec(frontmatter)?.[1];
    const description = /^description: (.+)$/m.exec(frontmatter)?.[1] ?? "";

    expect(name).toBe(path.basename(skillDir));
    expect(name).toMatch(/^[a-z0-9-]{1,64}$/);
    expect(description.length).toBeGreaterThan(0);
    expect(description.length).toBeLessThanOrEqual(1024);
    expect(skill.split("\n").length).toBeLessThan(500);
  });

  it("links only to files that exist", () => {
    const skill = read("SKILL.md");
    const links = [...skill.matchAll(/\]\((references\/[\w.-]+\.md)\)/g)].map((match) => match[1]);
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(existsSync(path.join(skillDir, link ?? "")), link).toBe(true);
    }
  });

  it("carries every foundation rule from the docs", () => {
    const text = read("references/foundations.md");
    const values = [
      ...foundationSections.map((section) => section.description),
      ...semanticRoles.flatMap((role) => [role.usage, role.light, role.dark]),
      ...foundationGuides.content.principles.map((principle) => principle.text),
      ...guideText(foundationGuides.content),
      ...guideText(foundationGuides.icons),
      ...guideText(foundationGuides.layout),
      ...foundationGuides.layout.pieces.map((piece) => piece.text),
      ...guideText(foundationGuides.spacing),
      ...guideText(foundationGuides.typography),
      ...guideText(foundationGuides.atomicDesign),
      ...foundationGuides.atomicDesign.levels.flatMap((level) => [level.create, level.use]),
    ];
    expect(missingFrom(text, values)).toEqual([]);
  });

  it("carries every UI pattern from the docs", () => {
    const text = read("references/ui-patterns.md");
    const values = patternSections.flatMap((section) => [
      section.description,
      ...guideText(patternGuides[section.slug]),
    ]);
    expect(missingFrom(text, values)).toEqual([]);
  });

  it("carries every scenario pattern from the docs", () => {
    const text = read("references/scenario-patterns.md");
    const values = scenarioSections.flatMap((section) => [
      section.description,
      ...guideText(scenarioGuides[section.slug]),
    ]);
    expect(missingFrom(text, values)).toEqual([]);
  });

  it("carries every CSS utility from the docs", () => {
    const text = read("references/css-utilities.md");
    const values = utilitySections.flatMap((section) => [
      section.description,
      ...utilityGuides[section.slug].flatMap((group) =>
        group.items.flatMap((item) => [item.name, item.use]),
      ),
    ]);
    expect(missingFrom(text, values)).toEqual([]);
  });

  it("documents every component page and its imports", () => {
    const text = read("references/components.md");
    expect(
      missingFrom(
        text,
        componentDocs.map((doc) => `### ${doc.name}`),
      ),
    ).toEqual([]);
    const imports = [...new Set(componentDocs.flatMap((doc) => doc.imports))];
    expect(imports.filter((name) => !new RegExp(`\\b${name}\\b`).test(text))).toEqual([]);
  });
});

describe("withy-ui add-skill", () => {
  const bin = path.resolve(__dirname, "../bin/withy-ui.mjs");

  it("copies the skill where Claude Code and Cursor read it", () => {
    const project = mkdtempSync(path.join(tmpdir(), "withy-skill-"));
    try {
      const output = execFileSync(process.execPath, [bin, "add-skill"], {
        cwd: project,
        encoding: "utf8",
      });
      const installed = path.join(project, ".claude/skills/withy-ui");
      expect(output).toContain(".claude/skills/withy-ui");
      expect(readFileSync(path.join(installed, "SKILL.md"), "utf8")).toBe(read("SKILL.md"));
      expect(existsSync(path.join(installed, "references/components.md"))).toBe(true);

      execFileSync(process.execPath, [bin, "add-skill", "--cursor"], { cwd: project });
      expect(existsSync(path.join(project, ".cursor/skills/withy-ui/SKILL.md"))).toBe(true);
    } finally {
      rmSync(project, { recursive: true, force: true });
    }
  });

  it("rejects an unknown command", () => {
    const result = spawnSync(process.execPath, [bin, "install"], { encoding: "utf8" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Unknown command: install");
  });
});
