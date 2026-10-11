"use client";

import { Button } from "../atoms/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./dialog";

type ModalProps = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
};

export function Modal({
  trigger,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
}: ModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent title={title} description={description}>
        {children ? <DialogBody>{children}</DialogBody> : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" color="white" size="sm">
              {cancelLabel}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" size="sm" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
