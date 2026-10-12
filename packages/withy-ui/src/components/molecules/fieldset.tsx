"use client";

import * as React from "react";
import { cn } from "../../lib/cn";
import { FieldContext } from "../../lib/field";

type FieldsetProps = {
  legend: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function Fieldset({ legend, hint, error, children, className }: FieldsetProps) {
  const id = React.useId();
  const labelId = `${id}-legend`;
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const field = React.useMemo(
    () => ({ labelId, describedBy: messageId, invalid: Boolean(error) }),
    [labelId, messageId, error],
  );

  return (
    <FieldContext.Provider value={field}>
      <fieldset aria-describedby={messageId} className={cn("min-w-0", className)}>
        <legend id={labelId} className="mb-2 text-[13px] font-medium text-text-2">
          {legend}
        </legend>
        <div className="flex flex-col gap-2.5">{children}</div>
        {error ? (
          <p id={messageId} className="mt-1.5 text-xs text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={messageId} className="mt-1.5 text-xs text-text-3">
            {hint}
          </p>
        ) : null}
      </fieldset>
    </FieldContext.Provider>
  );
}
