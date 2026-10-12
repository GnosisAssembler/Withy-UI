"use client";

import { cn } from "../../lib/cn";
import { useFieldControl } from "../../lib/field";
import { fieldClass } from "../../lib/styles";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const control = useFieldControl(props);
  return (
    <textarea
      className={cn(fieldClass, "min-h-24 py-2 leading-normal", className)}
      {...props}
      {...control}
    />
  );
}
