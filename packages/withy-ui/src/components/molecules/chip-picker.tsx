"use client";

import * as React from "react";
import { Check, Plus, Search, X } from "lucide-react";
import { Tag } from "../atoms/tag";
import { Button } from "../atoms/button";
import { Spinner } from "../atoms/spinner";
import { Popup, PopupContent, PopupTrigger } from "./popup";
import { cn } from "../../lib/cn";
import { useFieldContext, useFieldControl } from "../../lib/field";
import { fieldClass } from "../../lib/styles";
import type { ComboOption } from "./combobox";

export type ChipPickerProps = {
  id?: string;
  options: ComboOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** When set, the person can create an option from the search text. */
  onCreate?: (label: string) => void;
  onSearch?: (search: string) => void;
  placeholder?: string;
  /** Show a control that clears every selected chip. Defaults to true. */
  cleanable?: boolean;
  disabled?: boolean;
  disabledItemValues?: readonly string[];
  loading?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

function optionValueFromLabel(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

export function ChipPicker({
  id,
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  onCreate,
  onSearch,
  placeholder = "Select",
  cleanable = true,
  disabled = false,
  disabledItemValues = [],
  loading = false,
  className,
  "aria-label": ariaLabel,
  ...aria
}: ChipPickerProps) {
  const field = useFieldContext();
  const control = useFieldControl({ id, ...aria });
  const listboxId = control.id ? `${control.id}-listbox` : undefined;
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(() => [...defaultValue]);
  const value = isControlled ? valueProp : uncontrolled;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const disabledSet = React.useMemo(() => new Set(disabledItemValues), [disabledItemValues]);
  const selectedSet = React.useMemo(() => new Set(value), [value]);
  const byValue = React.useMemo(() => {
    const map = new Map<string, ComboOption>();
    for (const option of options) {
      if (!map.has(option.value)) map.set(option.value, option);
    }
    return map;
  }, [options]);

  const selectedOptions = value.flatMap((item) => {
    const option = byValue.get(item);
    return option ? [option] : [{ label: item, value: item }];
  });

  const trimmed = query.trim();
  const matches = options.filter((option) =>
    option.label.toLowerCase().includes(trimmed.toLowerCase()),
  );
  const canCreate =
    Boolean(onCreate) &&
    trimmed.length > 0 &&
    !options.some((option) => option.label.toLowerCase() === trimmed.toLowerCase());

  function commit(next: string[]) {
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
  }

  function toggle(optionValue: string) {
    if (disabled || disabledSet.has(optionValue)) return;
    if (selectedSet.has(optionValue)) {
      commit(value.filter((item) => item !== optionValue));
      return;
    }
    commit([...value, optionValue]);
  }

  function remove(optionValue: string) {
    if (disabled || disabledSet.has(optionValue)) return;
    commit(value.filter((item) => item !== optionValue));
  }

  function clear() {
    if (disabled) return;
    commit([]);
  }

  function createFromQuery() {
    if (!canCreate || !onCreate) return;
    const label = trimmed;
    const createdValue = optionValueFromLabel(label);
    onCreate(label);
    if (!selectedSet.has(createdValue)) {
      commit([...value, createdValue]);
    }
    setQuery("");
  }

  return (
    <Popup
      open={open}
      onOpenChange={(next) => {
        if (disabled) return;
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopupTrigger asChild>
        <div
          {...control}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-label={ariaLabel}
          aria-labelledby={!ariaLabel && field ? field.labelId : undefined}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          data-disabled={disabled ? "" : undefined}
          className={cn(
            fieldClass,
            "flex min-h-[38px] h-auto cursor-pointer items-start justify-between gap-2 py-1.5 text-left",
            disabled && "cursor-not-allowed",
            className,
          )}
          onKeyDown={(event) => {
            if (disabled) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpen((current) => !current);
            }
            if (event.key === "ArrowDown" && !open) {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          <span className="flex min-w-0 flex-1 flex-wrap content-center items-center gap-1.5">
            {selectedOptions.length === 0 ? (
              <span className="text-text-3">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <Tag
                  key={option.value}
                  onRemove={
                    disabled || disabledSet.has(option.value)
                      ? undefined
                      : () => remove(option.value)
                  }
                  removeLabel={`Remove ${option.label}`}
                  onClick={(event) => event.stopPropagation()}
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  {option.label}
                </Tag>
              ))
            )}
          </span>
          <span className="mt-0.5 flex shrink-0 items-center gap-1">
            {loading ? <Spinner size="sm" /> : null}
            {cleanable && selectedOptions.length > 0 && !disabled ? (
              <button
                type="button"
                aria-label="Clear"
                className="inline-flex size-5 items-center justify-center rounded-xs text-text-3 outline-none hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)] hover:text-heading focus-visible:ring-4 focus-visible:ring-primary/25"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  clear();
                }}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <X className="size-3.5" aria-hidden />
              </button>
            ) : null}
            <Search className="size-4 text-text-3" aria-hidden />
          </span>
        </div>
      </PopupTrigger>
      <PopupContent
        className="w-[var(--radix-popover-trigger-width)] p-2"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <input
          aria-label="Search or create"
          value={query}
          disabled={disabled}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            onSearch?.(next);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && canCreate) {
              event.preventDefault();
              createFromQuery();
            }
          }}
          placeholder="Search"
          className={cn(
            fieldClass,
            "h-[34px]",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
          )}
        />
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-label={ariaLabel ?? "Options"}
          className="mt-2 flex max-h-48 flex-col gap-0.5 overflow-y-auto"
        >
          {matches.map((option) => {
            const selected = selectedSet.has(option.value);
            const itemDisabled = disabledSet.has(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={itemDisabled}
                className="flex items-center justify-between rounded-xs px-2 py-1.5 text-left text-[13px] text-text-2 hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => toggle(option.value)}
              >
                {option.label}
                {selected ? <Check className="size-3.5 text-primary" aria-hidden /> : null}
              </button>
            );
          })}
          {matches.length === 0 ? (
            <p className="px-2 py-2 text-[13px] text-text-3">No matches.</p>
          ) : null}
        </div>
        {onCreate ? (
          <Button
            type="button"
            size="sm"
            variant="outlined"
            className="mt-2 w-full"
            disabled={!canCreate}
            onClick={createFromQuery}
          >
            <Plus />
            {canCreate ? `Create “${trimmed}”` : "Create"}
          </Button>
        ) : null}
      </PopupContent>
    </Popup>
  );
}
