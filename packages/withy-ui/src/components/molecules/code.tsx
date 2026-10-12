"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { highlightCode, type TokenKind } from "../../lib/highlight";
import { cn } from "../../lib/cn";

const tokenClass: Record<Exclude<TokenKind, "plain">, string> = {
  comment: "withy-tok-comment",
  string: "withy-tok-string",
  keyword: "withy-tok-keyword",
  number: "withy-tok-number",
  tag: "withy-tok-tag",
  attr: "withy-tok-attr",
  function: "withy-tok-function",
  punctuation: "withy-tok-punctuation",
};

export function Code({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      className={cn("withy-code rounded-xs px-1.5 py-0.5 font-mono text-[12px]", className)}
      {...props}
    />
  );
}

export function CodeBlock({
  code,
  label = "Code",
  className,
}: {
  code: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const tokens = React.useMemo(() => highlightCode(code, label), [code, label]);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div className={cn("withy-terminal overflow-hidden rounded-sm", className)}>
      <div className="withy-terminal-bar flex items-center justify-between gap-3 px-3 py-2">
        <span className="flex min-w-0 items-center gap-2">
          <span className="withy-terminal-dot" aria-hidden />
          <span className="withy-terminal-label truncate font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
            {label}
          </span>
        </span>
        <button
          type="button"
          className={cn(
            "withy-terminal-copy inline-flex shrink-0 cursor-pointer items-center gap-1 px-1.5 py-1 font-mono text-[12px]",
            copied && "is-copied",
          )}
          onClick={() => {
            const clipboard = navigator.clipboard;
            if (!clipboard) return;
            void clipboard.writeText(code).then(
              () => setCopied(true),
              () => undefined,
            );
          }}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="withy-terminal-screen overflow-x-auto px-4 py-3 font-mono text-[13px] leading-6 whitespace-pre-wrap">
        <code>
          {tokens.map((token, index) =>
            token.kind === "plain" ? (
              <span key={index}>{token.value}</span>
            ) : (
              <span key={index} className={tokenClass[token.kind]}>
                {token.value}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
