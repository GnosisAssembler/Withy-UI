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

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number;
  color?: keyof typeof barColor;
};

export function Progress({ className, value = 0, color = "primary", ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      value={value}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--heading)_12%,transparent)]",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full rounded-full transition-all", barColor[color])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
