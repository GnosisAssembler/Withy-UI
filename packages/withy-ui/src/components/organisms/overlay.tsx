"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import { LayerFrame, useControllableOpen } from "./layer";

export type OverlayProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function Overlay({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  label,
  description,
  children,
  className,
}: OverlayProps) {
  const [open, setOpen] = useControllableOpen({ open: openProp, defaultOpen, onOpenChange });

  return (
    <LayerFrame
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      className={cn(
        "withy-dialog fixed top-1/2 left-1/2 max-h-[calc(100%-2rem)] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto",
        className,
      )}
    >
      <div className="flex w-fit max-w-full flex-col items-end gap-2">
        <DialogPrimitive.Title className="sr-only">{label}</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">
          {description ?? label}
        </DialogPrimitive.Description>
        <DialogPrimitive.Close
          type="button"
          aria-label="Close"
          className="shrink-0 rounded-xs p-1 text-white hover:text-white/80 focus-visible:ring-4 focus-visible:ring-primary/25"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
        {children}
      </div>
    </LayerFrame>
  );
}
