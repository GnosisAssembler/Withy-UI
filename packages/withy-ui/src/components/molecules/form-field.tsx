"use client";

import * as React from "react";
import { Label } from "../atoms/label";
import { cn } from "../../lib/cn";
import { FieldContext } from "../../lib/field";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ label, htmlFor, hint, error, children, className }: FormFieldProps) {
  const generatedId = React.useId();
  const id = htmlFor ?? generatedId;
  const labelId = `${id}-label`;
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const field = React.useMemo(
    () => ({ id, labelId, describedBy: messageId, invalid: Boolean(error) }),
    [id, labelId, messageId, error],
  );

  return (
    <FieldContext.Provider value={field}>
      <div className={cn("flex flex-col gap-1.5", className)}>
        <Label id={labelId} htmlFor={id}>
          {label}
        </Label>
        {children}
        {error ? (
          <p id={messageId} className="text-xs text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={messageId} className="text-xs text-text-3">
            {hint}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
