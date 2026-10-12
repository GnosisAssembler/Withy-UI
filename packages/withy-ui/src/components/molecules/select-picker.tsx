"use client";

import * as React from "react";
import { Check, Plus, Search } from "lucide-react";
import { Button } from "../atoms/button";
import { Popup, PopupContent, PopupTrigger } from "./popup";
import { cn } from "../../lib/cn";
import { useFieldControl } from "../../lib/field";
import { fieldClass, fieldSize } from "../../lib/styles";
import type { ComboOption } from "./combobox";

type SelectPickerProps = {
  id?: string;
  options: ComboOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  onCreate?: (label: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

export function SelectPicker({
  id,
  options,
  value,
  onValueChange,
  onCreate,
  placeholder = "Select",
  className,
  "aria-label": ariaLabel,
  ...aria
}: SelectPickerProps) {
  const control = useFieldControl({ id, ...aria });
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const selected = options.find((option) => option.value === value);
  const matches = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const canCreate =
    query.trim().length > 0 &&
    !options.some((option) => option.label.toLowerCase() === query.trim().toLowerCase());

  return (
    <Popup open={open} onOpenChange={setOpen}>
      <PopupTrigger asChild>
        <button
          {...control}
          type="button"
          aria-label={ariaLabel}
          className={cn(
            fieldClass,
            fieldSize.md,
            "flex items-center justify-between gap-2 text-left",
            className,
          )}
        >
          <span className={selected ? "text-text-2" : "text-text-3"}>
            {selected?.label ?? placeholder}
          </span>
          <Search className="size-4 text-text-3" />
        </button>
      </PopupTrigger>
      <PopupContent
        className="w-[var(--radix-popover-trigger-width)] p-2"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <input
          aria-label="Search or create"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          className={cn(fieldClass, fieldSize.sm)}
        />
        <div className="mt-2 flex max-h-48 flex-col gap-0.5 overflow-y-auto">
          {matches.map((option) => (
            <button
              key={option.value}
              type="button"
              className="flex items-center justify-between rounded-xs px-2 py-1.5 text-left text-[13px] text-text-2 hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)]"
              onClick={() => {
                onValueChange?.(option.value);
                setQuery("");
                setOpen(false);
              }}
            >
              {option.label}
              {option.value === value ? <Check className="size-3.5 text-primary" /> : null}
            </button>
          ))}
          {matches.length === 0 ? (
            <p className="px-2 py-2 text-[13px] text-text-3">No matches.</p>
          ) : null}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outlined"
          className="mt-2 w-full"
          disabled={!canCreate}
          onClick={() => {
            const label = query.trim();
            onCreate?.(label);
            setQuery("");
            setOpen(false);
          }}
        >
          <Plus />
          {canCreate ? `Create “${query.trim()}”` : "Create"}
        </Button>
      </PopupContent>
    </Popup>
  );
}
