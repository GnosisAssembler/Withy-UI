"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../lib/cn";
import { useFieldControl } from "../../lib/field";

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const control = useFieldControl(props);
  return (
    <SwitchPrimitive.Root
      className={cn(
        "inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-gray-300 outline-none transition-colors focus-visible:ring-4 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
      {...control}
    >
      <SwitchPrimitive.Thumb className="block size-4 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-primary-foreground" />
    </SwitchPrimitive.Root>
  );
}
