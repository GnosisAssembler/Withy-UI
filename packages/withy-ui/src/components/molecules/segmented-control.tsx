"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import type { LucideIcon } from "lucide-react";
import { Icon } from "../atoms/icon";
import { cn } from "../../lib/cn";

export type SegmentedOption = {
  label: string;
  value: string;
  icon?: LucideIcon;
  disabled?: boolean;
};

type SegmentedControlProps = Omit<
  React.ComponentProps<typeof RadioGroupPrimitive.Root>,
  "children" | "orientation"
> & {
  options: SegmentedOption[];
  size?: "sm" | "md";
};

export function SegmentedControl({
  options,
  size = "sm",
  className,
  ...props
}: SegmentedControlProps) {
  return (
    <RadioGroupPrimitive.Root
      orientation="horizontal"
      className={cn(
        "inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-sm border border-border bg-card p-0.5",
        className,
      )}
      {...props}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-xs px-3 text-[13px] whitespace-nowrap text-text-2 outline-none transition-colors hover:bg-muted hover:text-heading focus-visible:ring-4 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-60 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:hover:bg-primary",
            size === "sm" ? "h-7" : "h-[32px] text-sm",
          )}
        >
          {option.icon ? <Icon icon={option.icon} size="sm" /> : null}
          {option.label}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
