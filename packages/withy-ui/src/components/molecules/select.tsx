"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";
import { useFieldControl } from "../../lib/field";
import { fieldClass, fieldSize } from "../../lib/styles";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: SelectOption[];
  fieldSize?: keyof typeof fieldSize;
  disabled?: boolean;
  name?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function Select({
  id,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select",
  options,
  fieldSize: size = "md",
  disabled,
  name,
  ...aria
}: SelectProps) {
  const control = useFieldControl({
    id,
    "aria-describedby": aria["aria-describedby"],
    "aria-invalid": aria["aria-invalid"],
  });

  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
    >
      <SelectPrimitive.Trigger
        className={cn(
          fieldClass,
          fieldSize[size],
          "flex items-center justify-between gap-2 text-left",
        )}
        aria-label={aria["aria-label"]}
        {...control}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="size-4 text-text-3" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-72 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-sm border border-border bg-card shadow-lg"
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-[13px] text-text-2 outline-none data-[highlighted]:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)] data-[state=checked]:text-primary"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Check className="size-3.5" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
