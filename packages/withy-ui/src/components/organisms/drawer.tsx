"use client";

import { cn } from "../../lib/cn";
import { LayerBody, LayerFooter, LayerFrame, LayerHeader, useControllableOpen } from "./layer";

export type DrawerSide = "left" | "right";

export type DrawerProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  side?: DrawerSide;
  className?: string;
};

const sides: Record<DrawerSide, string> = {
  left: "withy-drawer-left left-0 border-r",
  right: "withy-drawer-right right-0 border-l",
};

export function Drawer({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
  className,
}: DrawerProps) {
  const [open, setOpen] = useControllableOpen({ open: openProp, defaultOpen, onOpenChange });

  return (
    <LayerFrame
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      className={cn(
        "fixed inset-y-0 flex h-full w-full max-w-sm flex-col border-border bg-card text-text shadow-[0_1rem_3rem_rgb(0_0_0/0.175)]",
        sides[side],
        className,
      )}
    >
      <LayerHeader title={title} description={description} />
      {children ? (
        <LayerBody className="min-h-0 flex-1 overflow-y-auto">{children}</LayerBody>
      ) : null}
      {footer ? <LayerFooter>{footer}</LayerFooter> : null}
    </LayerFrame>
  );
}
