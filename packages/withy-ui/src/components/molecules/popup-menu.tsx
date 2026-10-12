"use client";

import * as MenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "../../lib/cn";

export function PopupMenu(props: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root {...props} />;
}

export function PopupMenuTrigger(props: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger {...props} />;
}

export function PopupMenuContent({
  className,
  sideOffset = 8,
  align = "end",
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-50 min-w-48 overflow-hidden rounded-sm border border-border bg-card p-1 text-text-2 shadow-lg",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function PopupMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item>) {
  return (
    <MenuPrimitive.Item
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-xs px-3 py-1.5 text-[13px] outline-none select-none data-[highlighted]:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)] data-[highlighted]:text-heading",
        className,
      )}
      {...props}
    />
  );
}

export function PopupMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return (
    <MenuPrimitive.Label
      className={cn(
        "px-3 py-1.5 font-inter text-[10px] font-semibold tracking-[0.5px] text-text-3 uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function PopupMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
  );
}
