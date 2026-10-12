"use client";

import * as React from "react";
import { Button, type ButtonProps } from "../atoms/button";

type CopyButtonProps = Omit<ButtonProps, "onClick" | "asChild" | "loading" | "value"> & {
  value: string | (() => string);
  copiedLabel?: string;
  failedLabel?: string;
  onCopy?: () => void;
};

export function CopyButton({
  value,
  copiedLabel = "Copied",
  failedLabel = "Copy failed",
  onCopy,
  children,
  ...props
}: CopyButtonProps) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle");

  React.useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error("The clipboard is not available.");
      await navigator.clipboard.writeText(typeof value === "function" ? value() : value);
      setState("copied");
      onCopy?.();
    } catch {
      setState("failed");
    }
  }

  const message = state === "copied" ? copiedLabel : state === "failed" ? failedLabel : "";

  return (
    <>
      <Button {...props} onClick={() => void copy()}>
        {message || children}
      </Button>
      <span role="status" className="sr-only">
        {message}
      </span>
    </>
  );
}
