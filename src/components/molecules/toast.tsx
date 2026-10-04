"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

const tones = {
  primary: "border-l-primary",
  success: "border-l-success",
  danger: "border-l-danger",
  warning: "border-l-warning",
  info: "border-l-info",
} as const;

export type ToastInput = {
  title: string;
  description?: string;
  color?: keyof typeof tones;
};

type ToastItem = ToastInput & { id: string; color: keyof typeof tones };

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((input: ToastInput) => {
    setToasts((current) => [
      ...current,
      { ...input, id: crypto.randomUUID(), color: input.color ?? "primary" },
    ]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right" duration={4200}>
        {children}
        {toasts.map((item) => (
          <ToastPrimitive.Root
            key={item.id}
            className={cn(
              "flex w-full items-start gap-3 rounded-sm border border-l-4 border-border bg-card px-3 py-3 text-text shadow-lg",
              tones[item.color],
            )}
            onOpenChange={(open) => {
              if (!open) setToasts((current) => current.filter((toast) => toast.id !== item.id));
            }}
          >
            <div className="min-w-0 flex-1">
              <ToastPrimitive.Title className="text-sm font-medium text-heading">
                {item.title}
              </ToastPrimitive.Title>
              {item.description ? (
                <ToastPrimitive.Description className="mt-0.5 text-[13px] text-text-3">
                  {item.description}
                </ToastPrimitive.Description>
              ) : null}
            </div>
            <ToastPrimitive.Close
              className="rounded-xs p-1 text-text-3 outline-none hover:text-heading focus-visible:ring-4 focus-visible:ring-primary/25"
              aria-label="Dismiss notification"
            >
              <X className="size-3.5" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed right-4 bottom-4 z-[70] flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
