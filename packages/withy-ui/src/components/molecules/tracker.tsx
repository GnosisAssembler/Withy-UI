"use client";

import * as React from "react";
import { chartFillClass } from "../../lib/chart-theme";
import { cn } from "../../lib/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const trackerFill = {
  ...chartFillClass,
  neutral: "bg-muted",
} as const;

export type TrackerColor = keyof typeof trackerFill;

export type TrackerBlock = {
  /** Stable identity. The index is used when this is omitted. */
  id?: string;
  /** Status or category color. Omitted blocks use `defaultColor`. */
  color?: TrackerColor;
  /** Shown on hover and focus, and used as the block's accessible name. */
  tooltip?: string;
};

export type TrackerProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** One block per moment, from oldest to newest. */
  data: readonly TrackerBlock[];
  /** Accessible name for the tracker. */
  label: string;
  /** Color used when a block omits `color`. */
  defaultColor?: TrackerColor;
  /** Dims a block while the pointer is over it. */
  hoverEffect?: boolean;
};

function blockTooltip(block: TrackerBlock) {
  const tooltip = block.tooltip?.trim();
  return tooltip ? tooltip : undefined;
}

function blockShape(color: TrackerColor, index: number, count: number, hoverEffect: boolean) {
  return cn(
    "h-full min-w-0 flex-1 outline-none",
    trackerFill[color],
    index === 0 && "rounded-l-sm",
    index === count - 1 && "rounded-r-sm",
    hoverEffect && "transition-opacity duration-150 hover:opacity-50 motion-reduce:transition-none",
  );
}

function TrackerBlockView({
  tooltip,
  shape,
  tabIndex,
  onFocus,
  buttonRef,
}: {
  tooltip: string;
  shape: string;
  tabIndex: number;
  onFocus: () => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={0} disableHoverableContent>
      <TooltipTrigger asChild>
        <button
          ref={buttonRef}
          type="button"
          aria-label={tooltip}
          tabIndex={tabIndex}
          onFocus={onFocus}
          onClick={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
          className={cn(
            shape,
            "cursor-default focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-primary/40",
          )}
        />
      </TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function Tracker({
  data,
  label,
  defaultColor = "neutral",
  hoverEffect = false,
  className,
  onKeyDown,
  ...props
}: TrackerProps) {
  const blocks = data ?? [];
  const [active, setActive] = React.useState(0);
  const buttons = React.useRef<(HTMLButtonElement | null)[]>([]);
  const focusable = blocks.flatMap((block, index) => (blockTooltip(block) ? [index] : []));
  const current = focusable.includes(active) ? active : (focusable[0] ?? -1);

  function move(event: React.KeyboardEvent<HTMLDivElement>) {
    if (focusable.length === 0 || current < 0) return;
    if (event.altKey || event.metaKey || event.ctrlKey || event.shiftKey) return;

    const position = focusable.indexOf(current);
    let next = position;
    if (event.key === "ArrowRight") next = Math.min(focusable.length - 1, position + 1);
    else if (event.key === "ArrowLeft") next = Math.max(0, position - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = focusable.length - 1;
    else return;

    event.preventDefault();
    const index = focusable[next] ?? current;
    setActive(index);
    buttons.current[index]?.focus();
  }

  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      className={cn("flex h-8 w-full min-w-0 gap-px", className)}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) move(event);
      }}
    >
      {blocks.length === 0 ? (
        <div aria-hidden className="h-full min-w-0 flex-1 rounded-sm bg-muted" />
      ) : (
        blocks.map((block, index) => {
          const tooltip = blockTooltip(block);
          const shape = blockShape(block.color ?? defaultColor, index, blocks.length, hoverEffect);

          if (!tooltip) {
            return <div key={block.id ?? index} aria-hidden className={shape} />;
          }

          return (
            <TrackerBlockView
              key={block.id ?? index}
              tooltip={tooltip}
              shape={shape}
              tabIndex={index === current ? 0 : -1}
              onFocus={() => setActive(index)}
              buttonRef={(node) => {
                buttons.current[index] = node;
              }}
            />
          );
        })
      )}
    </div>
  );
}
