"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/cn";

const barColor = {
  primary: "bg-primary",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
} as const;

export type ProgressColor = keyof typeof barColor;
export type ProgressAnimation = "fill" | "stripes" | "shimmer" | "indeterminate";

export type ProgressProps = Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "value"> & {
  value?: number | null;
  color?: ProgressColor;
  animation?: ProgressAnimation;
  duration?: number;
};

function clampProgress(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function Progress({
  className,
  style,
  value = 0,
  color = "primary",
  animation = "fill",
  duration,
  ...props
}: ProgressProps) {
  const indeterminate = animation === "indeterminate";
  const amount = clampProgress(indeterminate ? 0 : value);
  const moving = !indeterminate && amount < 100;

  return (
    <ProgressPrimitive.Root
      value={indeterminate ? null : amount}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--heading)_12%,transparent)]",
        className,
      )}
      style={
        {
          ...(duration != null ? { "--withy-progress-duration": `${duration}ms` } : null),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full rounded-full",
          barColor[color],
          indeterminate ? "withy-progress-indeterminate" : "withy-progress-fill",
          moving && animation === "stripes" && "withy-progress-stripes",
          moving && animation === "shimmer" && "withy-progress-shimmer",
        )}
        style={indeterminate ? undefined : { width: `${amount}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
