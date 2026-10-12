"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

export const layerOverlayClassName = "withy-overlay fixed inset-0 z-50 bg-[#0f1520]/70";

export function useControllableOpen({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  function setOpen(next: boolean) {
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  return [open, setOpen] as const;
}

export function LayerFrame({
  open,
  onOpenChange,
  trigger,
  className,
  dismissible = true,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  children: React.ReactNode;
}) {
  function blockDismiss(event: { preventDefault: () => void }) {
    if (!dismissible) event.preventDefault();
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={layerOverlayClassName} />
        <DialogPrimitive.Content
          className={cn("z-50 focus:outline-none", className)}
          onPointerDownOutside={blockDismiss}
          onInteractOutside={blockDismiss}
          onEscapeKeyDown={blockDismiss}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function LayerHeader({
  title,
  description,
  closeDisabled = false,
}: {
  title: string;
  description?: string;
  closeDisabled?: boolean;
}) {
  return (
    <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
      <div>
        <DialogPrimitive.Title className="text-base font-medium text-heading">
          {title}
        </DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="mt-1 text-[13px] text-text-3">
            {description}
          </DialogPrimitive.Description>
        ) : (
          <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
        )}
      </div>
      <DialogPrimitive.Close
        type="button"
        disabled={closeDisabled}
        aria-label="Close"
        className="shrink-0 rounded-xs p-1 text-text-3 hover:text-heading focus-visible:ring-4 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-50"
      >
        <X className="size-4" />
      </DialogPrimitive.Close>
    </header>
  );
}

export function LayerBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 py-4 text-sm text-text-2", className)} {...props} />;
}

export function LayerFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      className={cn(
        "flex shrink-0 items-center justify-end gap-2 border-t border-border px-5 py-3",
        className,
      )}
      {...props}
    />
  );
}
