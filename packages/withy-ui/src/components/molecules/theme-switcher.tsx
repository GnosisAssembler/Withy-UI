"use client";

import { Moon, Sun } from "lucide-react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../lib/cn";
import { Icon } from "../atoms/icon";
import { useTheme } from "../theme/theme-provider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <SwitchPrimitive.Root
      checked={dark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      aria-label="Dark theme"
      className="relative inline-grid h-8 w-14 shrink-0 cursor-pointer grid-cols-2 place-items-center rounded-full bg-muted p-1 outline-none transition-colors duration-150 ease-out hover:bg-gray-200 focus-visible:ring-4 focus-visible:ring-primary/25 motion-reduce:transition-none"
    >
      <Icon
        icon={Sun}
        size="sm"
        className={cn(
          "pointer-events-none relative z-10 transition-colors duration-150 ease-out motion-reduce:transition-none",
          dark ? "text-text-3" : "text-primary",
        )}
      />
      <Icon
        icon={Moon}
        size="sm"
        className={cn(
          "pointer-events-none relative z-10 -translate-x-px transition-colors duration-150 ease-out motion-reduce:transition-none",
          dark ? "text-primary" : "text-text-3",
        )}
      />
      <SwitchPrimitive.Thumb className="absolute top-1 left-1 z-0 size-6 rounded-full bg-card shadow-sm transition-transform duration-150 ease-out data-[state=checked]:translate-x-6 motion-reduce:transition-none" />
    </SwitchPrimitive.Root>
  );
}
