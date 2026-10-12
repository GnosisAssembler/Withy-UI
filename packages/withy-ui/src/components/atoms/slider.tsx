"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/cn";
import { useFieldContext, useFieldControl } from "../../lib/field";

export function Slider({
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const field = useFieldContext();
  const control = useFieldControl({ id: props.id, "aria-describedby": ariaDescribedBy });
  const thumbs = (props.value ?? props.defaultValue ?? [0]).length;
  const labelledBy = ariaLabel ? undefined : (ariaLabelledBy ?? field?.labelId);

  return (
    <SliderPrimitive.Root
      className={cn("relative flex h-5 w-full touch-none items-center select-none", className)}
      {...props}
      id={control.id}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbs }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={control["aria-describedby"]}
          className="block size-4 rounded-full border border-primary bg-card shadow-sm outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
