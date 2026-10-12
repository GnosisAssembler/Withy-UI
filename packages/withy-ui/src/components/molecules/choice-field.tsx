"use client";

import * as React from "react";
import { Checkbox } from "../atoms/checkbox";
import { Label } from "../atoms/label";
import { Radio } from "../atoms/radio-group";
import { Switch } from "../atoms/switch";
import { cn } from "../../lib/cn";

type ChoiceText = {
  label: string;
  description?: string;
  className?: string;
};

function ChoiceLabel({
  htmlFor,
  label,
  description,
  descriptionId,
  strong = false,
}: {
  htmlFor: string;
  label: string;
  description?: string;
  descriptionId?: string;
  strong?: boolean;
}) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <Label htmlFor={htmlFor} className={cn("cursor-pointer", strong && "text-heading")}>
        {label}
      </Label>
      {description ? (
        <span id={descriptionId} className="text-[12px] text-text-3">
          {description}
        </span>
      ) : null}
    </span>
  );
}

function useChoiceIds(id: string | undefined, description: string | undefined) {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  return { controlId, descriptionId: description ? `${controlId}-description` : undefined };
}

export function SwitchField({
  label,
  description,
  id,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Switch>, "children"> & ChoiceText) {
  const { controlId, descriptionId } = useChoiceIds(id, description);
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <ChoiceLabel
        htmlFor={controlId}
        label={label}
        description={description}
        descriptionId={descriptionId}
        strong
      />
      <Switch id={controlId} aria-describedby={descriptionId} {...props} />
    </div>
  );
}

export function CheckboxField({
  label,
  description,
  id,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Checkbox>, "children"> & ChoiceText) {
  const { controlId, descriptionId } = useChoiceIds(id, description);
  return (
    <div className={cn("flex gap-2", description ? "items-start" : "items-center", className)}>
      <Checkbox
        id={controlId}
        aria-describedby={descriptionId}
        className={description ? "mt-0.5" : undefined}
        {...props}
      />
      <ChoiceLabel
        htmlFor={controlId}
        label={label}
        description={description}
        descriptionId={descriptionId}
      />
    </div>
  );
}

export function RadioField({
  label,
  description,
  id,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Radio>, "children"> & ChoiceText) {
  const { controlId, descriptionId } = useChoiceIds(id, description);
  return (
    <div className={cn("flex gap-2", description ? "items-start" : "items-center", className)}>
      <Radio
        id={controlId}
        aria-describedby={descriptionId}
        className={description ? "mt-0.5" : undefined}
        {...props}
      />
      <ChoiceLabel
        htmlFor={controlId}
        label={label}
        description={description}
        descriptionId={descriptionId}
      />
    </div>
  );
}
