import { describe, expect, it } from "vitest";
import { componentDocs } from "../components/templates/components-docs";
import { highlightCode, type Token, type TokenKind } from "./highlight";

function text(tokens: Token[]) {
  return tokens.map((token) => token.value).join("");
}

function values(tokens: Token[], kind: TokenKind) {
  return tokens.filter((token) => token.kind === kind).map((token) => token.value);
}

describe("highlightCode", () => {
  const sample = `import { Button } from "withy-ui";

export function Save() {
  // Writes the draft, then closes the form.
  return <Button type="submit">Save changes</Button>;
}`;

  it("keeps the source intact", () => {
    expect(text(highlightCode(sample, "tsx"))).toBe(sample);
  });

  it("colors a TypeScript snippet", () => {
    const tokens = highlightCode(sample, "TSX");
    expect(values(tokens, "keyword")).toEqual(
      expect.arrayContaining(["import", "from", "export", "function", "return"]),
    );
    expect(values(tokens, "string")).toContain('"withy-ui"');
    expect(values(tokens, "string")).toContain('"submit"');
    expect(values(tokens, "comment").join("")).toContain("Writes the draft");
    expect(values(tokens, "function")).toContain("Save");
    expect(values(tokens, "tag")).toEqual(expect.arrayContaining(["Button"]));
    expect(values(tokens, "attr")).toContain("type");
  });

  it("colors markup after words and leaves comparisons alone", () => {
    const markup = `Read the <Link href="/billing/guide">billing guide</Link>.`;
    const tokens = highlightCode(markup, "tsx");
    expect(text(tokens)).toBe(markup);
    expect(values(tokens, "tag")).toEqual(["Link", "Link"]);
    expect(values(tokens, "attr")).toContain("href");

    const comparison = "const count = items < 10;";
    const compared = highlightCode(comparison, "ts");
    expect(text(compared)).toBe(comparison);
    expect(values(compared, "tag")).toEqual([]);
    expect(values(compared, "number")).toContain("10");

    const label = "<Badge>Paid</Badge>";
    expect(text(highlightCode(label, "tsx"))).toBe(label);
    expect(values(highlightCode(label, "tsx"), "tag")).toEqual(["Badge", "Badge"]);
  });

  it("preserves every component sample", () => {
    for (const doc of componentDocs) {
      const sample = `import { ${doc.imports.join(", ")} } from "withy-ui";\n\n${doc.code}`;
      expect(text(highlightCode(sample, "tsx"))).toBe(sample);
    }
  });

  it("colors css, json, and shell", () => {
    const css = ".card {\n  color: #0e7484;\n  padding: 12px;\n}";
    const cssTokens = highlightCode(css, "css");
    expect(text(cssTokens)).toBe(css);
    expect(values(cssTokens, "tag")).toContain(".card");
    expect(values(cssTokens, "attr")).toEqual(expect.arrayContaining(["color", "padding"]));
    expect(values(cssTokens, "number")).toEqual(expect.arrayContaining(["#0e7484", "12px"]));

    const json = '{ "name": "withy", "ok": true }';
    const jsonTokens = highlightCode(json, "json");
    expect(text(jsonTokens)).toBe(json);
    expect(values(jsonTokens, "attr")).toEqual(['"name"', '"ok"']);
    expect(values(jsonTokens, "string")).toContain('"withy"');
    expect(values(jsonTokens, "keyword")).toContain("true");

    const shell = "# build\npnpm --filter withy-ui test";
    const shellTokens = highlightCode(shell, "bash");
    expect(text(shellTokens)).toBe(shell);
    expect(values(shellTokens, "comment")).toContain("# build");
    expect(values(shellTokens, "function")).toContain("pnpm");
    expect(values(shellTokens, "attr")).toContain("--filter");
  });

  it("returns nothing for an empty snippet", () => {
    expect(highlightCode("", "tsx")).toEqual([]);
  });
});
