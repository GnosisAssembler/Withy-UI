"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../../lib/cn";

export function Code({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "rounded-xs bg-muted px-1.5 py-0.5 font-mono text-[12px] text-heading",
        className,
      )}
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

  return (
    <div className={cn("overflow-hidden rounded-sm border border-border bg-muted", className)}>
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-inter text-[10px] font-semibold tracking-[0.5px] text-text-3 uppercase">
          {label}
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-xs px-1.5 py-1 text-[12px] text-text-3 hover:text-heading"
          onClick={() => {
            void navigator.clipboard.writeText(code).then(() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1200);
            });
          }}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-3 font-mono text-[12px] leading-relaxed text-text-2">
        <code>{code}</code>
      </pre>
    </div>
  );
}
