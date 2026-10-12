"use client";

import * as React from "react";
import { Button } from "../atoms/button";
import { cn } from "../../lib/cn";
import { LayerBody, LayerFooter, LayerFrame, LayerHeader, useControllableOpen } from "./layer";

export type DialogProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  onConfirm?: () => void | Promise<unknown>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  className?: string;
};

export function Dialog({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  footer,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "primary",
  onConfirm,
  onSubmit,
  className,
}: DialogProps) {
  const [open, setOpen] = useControllableOpen({ open: openProp, defaultOpen, onOpenChange });
  const [pending, setPending] = React.useState(false);

  async function confirm() {
    const result = onConfirm?.();
    if (!(result instanceof Promise)) {
      setOpen(false);
      return;
    }
    setPending(true);
    try {
      await result;
      setOpen(false);
    } catch {
      // A rejected confirm keeps the dialog open so the caller can show what failed.
    } finally {
      setPending(false);
    }
  }

  const actions = confirmLabel ? (
    <>
      <Button
        type="button"
        color="white"
        size="sm"
        disabled={pending}
        onClick={() => setOpen(false)}
      >
        {cancelLabel}
      </Button>
      <Button
        type="button"
        size="sm"
        color={tone === "danger" ? "danger" : "primary"}
        loading={pending}
        onClick={() => void confirm()}
      >
        {confirmLabel}
      </Button>
    </>
  ) : (
    footer
  );

  const panel = (
    <>
      <LayerHeader title={title} description={description} closeDisabled={pending} />
      {children ? <LayerBody className="min-h-0 overflow-y-auto">{children}</LayerBody> : null}
      {actions ? <LayerFooter>{actions}</LayerFooter> : null}
    </>
  );

  return (
    <LayerFrame
      open={open}
      onOpenChange={(next) => {
        if (!pending) setOpen(next);
      }}
      trigger={trigger}
      dismissible={!pending}
      className={cn(
        "withy-dialog fixed top-1/2 left-1/2 flex max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-sm border border-border bg-card text-text shadow-[0_1rem_3rem_rgb(0_0_0/0.175)]",
        className,
      )}
    >
      {onSubmit && !confirmLabel ? (
        <form onSubmit={onSubmit} className="flex min-h-0 flex-col">
          {panel}
        </form>
      ) : (
        panel
      )}
    </LayerFrame>
  );
}
