"use client";

import * as React from "react";
import { Text } from "../atoms/text";
import { cn } from "../../lib/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export type TruncateProps = Omit<React.ComponentProps<typeof Text>, "children"> & {
  children: string;
  lines?: number;
  tooltip?: boolean;
};

function wholeLines(lines: number | undefined) {
  if (lines === undefined || !Number.isFinite(lines)) return 1;
  return Math.max(1, Math.floor(lines));
}

function setReactRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

// Clamped text can report its visible height as the scroll height, so compare an unconstrained copy.
function isOverflowing(element: HTMLElement, lines: number) {
  if (element.clientWidth === 0) return false;
  if (lines === 1) return element.scrollWidth - element.clientWidth > 1;

  const clone = element.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.style.position = "fixed";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.visibility = "hidden";
  clone.style.pointerEvents = "none";
  clone.style.height = "auto";
  clone.style.maxHeight = "none";
  clone.style.width = `${element.clientWidth}px`;
  clone.style.display = "block";
  clone.style.overflow = "visible";
  clone.style.webkitLineClamp = "unset";
  clone.style.webkitBoxOrient = "initial";
  document.body.appendChild(clone);
  try {
    return clone.scrollHeight - element.clientHeight > 1;
  } finally {
    clone.remove();
  }
}

export function Truncate({
  children,
  lines,
  tooltip = true,
  as = "span",
  className,
  style,
  ref,
  ...props
}: TruncateProps) {
  const count = wholeLines(lines);
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const [truncated, setTruncated] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const multi = count > 1;

  if (!truncated && open) setOpen(false);

  const measure = React.useCallback(() => {
    const node = nodeRef.current;
    if (!node?.isConnected) return;
    const next = isOverflowing(node, count);
    setTruncated((current) => (current === next ? current : next));
  }, [count]);

  React.useLayoutEffect(() => {
    measure();
    const node = nodeRef.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(() => measure());
    observer.observe(node);
    let cancelled = false;
    const ready = document.fonts?.ready;
    if (ready) {
      void ready.then(() => {
        if (!cancelled) measure();
      });
    }

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [measure, children]);

  const clampStyle: React.CSSProperties | undefined = multi
    ? {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: count,
        overflow: "hidden",
        ...style,
      }
    : style;

  const text = (
    <Text
      {...props}
      as={as}
      ref={(node: HTMLParagraphElement | null) => {
        nodeRef.current = node;
        setReactRef(ref, node);
      }}
      data-truncated={truncated ? "true" : "false"}
      className={cn("block min-w-0 max-w-full", multi ? "wrap-break-word" : "truncate", className)}
      style={clampStyle}
    >
      {children}
    </Text>
  );

  if (!tooltip) return text;

  return (
    <Tooltip
      open={truncated && open}
      onOpenChange={(next) => {
        if (truncated) setOpen(next);
      }}
    >
      <TooltipTrigger asChild>{text}</TooltipTrigger>
      <TooltipContent className="max-w-xs text-left whitespace-pre-wrap wrap-break-word">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
