"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../../lib/cn";
import { useFieldContext, useFieldControl } from "../../lib/field";

export function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  const field = useFieldContext();
  const control = useFieldControl(props);
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      aria-labelledby={props["aria-label"] ? undefined : field?.labelId}
      {...props}
      {...control}
    />
  );
}

export function Radio({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full border border-text-4 bg-card outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-primary",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-primary" />
    </RadioGroupPrimitive.Item>
  );
}
