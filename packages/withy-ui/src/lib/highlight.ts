export type TokenKind =
  | "comment"
  | "string"
  | "keyword"
  | "number"
  | "tag"
  | "attr"
  | "function"
  | "punctuation"
  | "plain";

export type Token = {
  kind: TokenKind;
  value: string;
};

const KEYWORDS = new Set([
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "of",
  "return",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "yield",
]);

type Language = "js" | "css" | "shell" | "json" | "text";

export function highlightCode(code: string, label = "tsx"): Token[] {
  if (!code) return [];
  switch (languageFromLabel(label)) {
    case "css":
      return highlightCss(code);
    case "shell":
      return highlightShell(code);
    case "json":
      return highlightJson(code);
    case "text":
      return [{ kind: "plain", value: code }];
    default:
      return highlightJs(code);
  }
}

function languageFromLabel(label: string): Language {
  const name =
    label
      .trim()
      .toLowerCase()
      .split(/[\s.]+/)
      .pop() ?? "";
  if (name === "css" || name === "scss" || name === "less") return "css";
  if (name === "sh" || name === "bash" || name === "shell" || name === "zsh") return "shell";
  if (name === "json") return "json";
  if (
    name === "text" ||
    name === "txt" ||
    name === "plain" ||
    name === "md" ||
    name === "markdown"
  ) {
    return "text";
  }
  return "js";
}

function highlightJs(code: string): Token[] {
  const { tokens, push } = writer();
  const stack: Array<{ kind: "js"; closeAt: number | null } | { kind: "tag" }> = [
    { kind: "js", closeAt: null },
  ];
  let i = 0;
  let braceDepth = 0;
  let steps = 0;

  while (i < code.length) {
    if (++steps > code.length) throw new Error("Highlighter stalled.");
    const frame = stack[stack.length - 1]!;
    const char = code[i]!;

    if (isSpace(char)) {
      const start = i;
      while (i < code.length && isSpace(code[i]!)) i++;
      push("plain", code.slice(start, i));
      continue;
    }

    if (frame.kind === "js" && char === "/" && code[i + 1] === "/") {
      const start = i;
      i += 2;
      while (i < code.length && code[i] !== "\n") i++;
      push("comment", code.slice(start, i));
      continue;
    }

    if (frame.kind === "js" && char === "/" && code[i + 1] === "*") {
      const start = i;
      i += 2;
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i = Math.min(code.length, i + 2);
      push("comment", code.slice(start, i));
      continue;
    }

    if (char === "'" || char === '"' || char === "`") {
      const end = scanStringEnd(code, i);
      push("string", code.slice(i, end));
      i = end;
      continue;
    }

    if (frame.kind === "tag" && char === "/" && code[i + 1] === ">") {
      push("punctuation", "/>");
      i += 2;
      stack.pop();
      continue;
    }

    if (frame.kind === "tag" && char === ">") {
      push("punctuation", ">");
      i += 1;
      stack.pop();
      continue;
    }

    if (frame.kind === "js" && char === "<" && isJsxOpen(code, i)) {
      push("punctuation", "<");
      i += 1;
      if (code[i] === "/") {
        push("punctuation", "/");
        i += 1;
      }
      if (code[i] === ">") {
        push("punctuation", ">");
        i += 1;
        continue;
      }
      const start = i;
      while (i < code.length && /[A-Za-z0-9._:-]/.test(code[i]!)) i++;
      if (i > start) push("tag", code.slice(start, i));
      stack.push({ kind: "tag" });
      continue;
    }

    if (char === "{") {
      push("punctuation", "{");
      i += 1;
      braceDepth += 1;
      if (frame.kind === "tag") stack.push({ kind: "js", closeAt: braceDepth - 1 });
      continue;
    }

    if (char === "}") {
      push("punctuation", "}");
      i += 1;
      braceDepth = Math.max(0, braceDepth - 1);
      const current = stack[stack.length - 1]!;
      if (current.kind === "js" && current.closeAt === braceDepth && stack.length > 1) stack.pop();
      continue;
    }

    if (frame.kind === "tag" && /[A-Za-z_]/.test(char)) {
      const start = i;
      i += 1;
      while (i < code.length && /[A-Za-z0-9_:-]/.test(code[i]!)) i++;
      push("attr", code.slice(start, i));
      continue;
    }

    if (frame.kind === "js" && /[A-Za-z_$]/.test(char)) {
      const start = i;
      i += 1;
      while (i < code.length && /[A-Za-z0-9_$]/.test(code[i]!)) i++;
      const word = code.slice(start, i);
      push(identifyWord(code, i, word), word);
      continue;
    }

    if (frame.kind === "js" && /[0-9]/.test(char)) {
      const end = scanNumberEnd(code, i);
      push("number", code.slice(i, end));
      i = end;
      continue;
    }

    push("punctuation", char);
    i += 1;
  }

  return tokens;
}

function identifyWord(code: string, index: number, word: string): TokenKind {
  if (KEYWORDS.has(word)) return "keyword";
  const next = peekNonSpace(code, index);
  if (next === "(") return "function";
  if (next === ":") return "attr";
  if (isComponentName(code, index, word)) return "tag";
  return "plain";
}

function isComponentName(code: string, index: number, word: string): boolean {
  if (!/^[A-Z]/.test(word)) return false;
  let i = index;
  while (i < code.length && isSpace(code[i]!)) i++;
  const next = code[i] ?? "";
  if (!next) return true;
  if (next === "<") return code[i + 1] !== "/";
  return !/[A-Za-z]/.test(next);
}

function isJsxOpen(code: string, index: number): boolean {
  const next = code[index + 1];
  if (!next) return false;
  if (next === "/") {
    const after = code[index + 2];
    return after === ">" || (after !== undefined && /[A-Za-z]/.test(after));
  }
  const previous = code[index - 1];
  if (previous !== undefined && /[A-Za-z0-9_$]/.test(previous)) return false;
  if (next === ">") return true;
  return /[A-Za-z]/.test(next);
}

function highlightCss(code: string): Token[] {
  const { tokens, push } = writer();
  let i = 0;
  let steps = 0;

  while (i < code.length) {
    if (++steps > code.length) throw new Error("Highlighter stalled.");
    const char = code[i]!;

    if (isSpace(char)) {
      const start = i;
      while (i < code.length && isSpace(code[i]!)) i++;
      push("plain", code.slice(start, i));
      continue;
    }

    if (char === "/" && code[i + 1] === "*") {
      const start = i;
      i += 2;
      while (i < code.length && !(code[i] === "*" && code[i + 1] === "/")) i++;
      i = Math.min(code.length, i + 2);
      push("comment", code.slice(start, i));
      continue;
    }

    if (char === "'" || char === '"') {
      const end = scanStringEnd(code, i);
      push("string", code.slice(i, end));
      i = end;
      continue;
    }

    if (char === "#") {
      const hex = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/.exec(
        code.slice(i),
      );
      if (hex) {
        push("number", hex[0]);
        i += hex[0].length;
        continue;
      }
    }

    if (char === "." || char === "#") {
      const start = i;
      i += 1;
      while (i < code.length && /[A-Za-z0-9_-]/.test(code[i]!)) i++;
      push("tag", code.slice(start, i));
      continue;
    }

    if (/[0-9]/.test(char)) {
      const start = i;
      i += 1;
      while (i < code.length && /[0-9.]/.test(code[i]!)) i++;
      while (i < code.length && /[a-z%]/i.test(code[i]!)) i++;
      push("number", code.slice(start, i));
      continue;
    }

    if (/[A-Za-z_-]/.test(char)) {
      const start = i;
      i += 1;
      while (i < code.length && /[A-Za-z0-9_-]/.test(code[i]!)) i++;
      const word = code.slice(start, i);
      push(peekNonSpace(code, i) === ":" ? "attr" : "plain", word);
      continue;
    }

    push("punctuation", char);
    i += 1;
  }

  return tokens;
}

function highlightShell(code: string): Token[] {
  const { tokens, push } = writer();
  let i = 0;
  let atCommand = true;
  let steps = 0;

  while (i < code.length) {
    if (++steps > code.length) throw new Error("Highlighter stalled.");
    const char = code[i]!;

    if (char === "\n") {
      push("plain", "\n");
      i += 1;
      atCommand = true;
      continue;
    }

    if (isSpace(char)) {
      const start = i;
      while (i < code.length && isSpace(code[i]!) && code[i] !== "\n") i++;
      push("plain", code.slice(start, i));
      continue;
    }

    if (char === "#") {
      const start = i;
      while (i < code.length && code[i] !== "\n") i++;
      push("comment", code.slice(start, i));
      atCommand = false;
      continue;
    }

    if (char === "'" || char === '"') {
      const end = scanStringEnd(code, i);
      push("string", code.slice(i, end));
      i = end;
      atCommand = false;
      continue;
    }

    if (/[A-Za-z0-9_./-]/.test(char)) {
      const start = i;
      i += 1;
      while (i < code.length && /[A-Za-z0-9_./:=-]/.test(code[i]!)) i++;
      const word = code.slice(start, i);
      push(word.startsWith("-") ? "attr" : atCommand ? "function" : "plain", word);
      atCommand = false;
      continue;
    }

    push("punctuation", char);
    i += 1;
    atCommand = false;
  }

  return tokens;
}

function highlightJson(code: string): Token[] {
  const { tokens, push } = writer();
  let i = 0;
  let steps = 0;

  while (i < code.length) {
    if (++steps > code.length) throw new Error("Highlighter stalled.");
    const char = code[i]!;

    if (isSpace(char)) {
      const start = i;
      while (i < code.length && isSpace(code[i]!)) i++;
      push("plain", code.slice(start, i));
      continue;
    }

    if (char === '"') {
      const end = scanStringEnd(code, i);
      push(peekNonSpace(code, end) === ":" ? "attr" : "string", code.slice(i, end));
      i = end;
      continue;
    }

    if (char === "-" && /[0-9]/.test(code[i + 1] ?? "")) {
      const end = scanNumberEnd(code, i + 1);
      push("number", code.slice(i, end));
      i = end;
      continue;
    }

    if (/[0-9]/.test(char)) {
      const end = scanNumberEnd(code, i);
      push("number", code.slice(i, end));
      i = end;
      continue;
    }

    if (/[A-Za-z]/.test(char)) {
      const start = i;
      i += 1;
      while (i < code.length && /[A-Za-z]/.test(code[i]!)) i++;
      const word = code.slice(start, i);
      push(word === "true" || word === "false" || word === "null" ? "keyword" : "plain", word);
      continue;
    }

    push("punctuation", char);
    i += 1;
  }

  return tokens;
}

function writer() {
  const tokens: Token[] = [];
  return {
    tokens,
    push(kind: TokenKind, value: string) {
      if (!value) return;
      const previous = tokens.at(-1);
      if (previous?.kind === kind) previous.value += value;
      else tokens.push({ kind, value });
    },
  };
}

function isSpace(char: string): boolean {
  return char === " " || char === "\n" || char === "\t" || char === "\r";
}

function peekNonSpace(code: string, index: number): string {
  let i = index;
  while (i < code.length && isSpace(code[i]!)) i++;
  return code[i] ?? "";
}

function scanStringEnd(code: string, start: number): number {
  const quote = code[start];
  let i = start + 1;
  while (i < code.length) {
    if (code[i] === "\\") {
      i += 2;
      continue;
    }
    if (code[i] === quote) return i + 1;
    if (quote !== "`" && code[i] === "\n") return i;
    i += 1;
  }
  return code.length;
}

function scanNumberEnd(code: string, start: number): number {
  let i = start;
  if (code[i] === "0" && (code[i + 1] === "x" || code[i + 1] === "X")) {
    i += 2;
    while (i < code.length && /[0-9a-fA-F]/.test(code[i]!)) i++;
    return Math.max(start + 1, i);
  }
  while (i < code.length && /[0-9_]/.test(code[i]!)) i++;
  if (code[i] === "." && /[0-9]/.test(code[i + 1] ?? "")) {
    i += 1;
    while (i < code.length && /[0-9_]/.test(code[i]!)) i++;
  }
  return Math.max(start + 1, i);
}
