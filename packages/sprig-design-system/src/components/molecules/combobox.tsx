"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popup, PopupContent, PopupTrigger } from "./popup";
import { cn } from "../../lib/cn";
import { fieldClass, fieldSize } from "../../lib/styles";

export type ComboOption = {
  label: string;
  value: string;
};

type ComboboxProps = {
  id?: string;
  options: ComboOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function Combobox({
  id,
  options,
  value,
  onValueChange,
  placeholder = "Search",
  className,
}: ComboboxProps) {
  const selected = options.find((option) => option.value === value);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const matches = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Popup open={open} onOpenChange={setOpen}>
      <PopupTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={id ? `${id}-listbox` : undefined}
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
          <ChevronsUpDown className="size-4 text-text-3" />
        </button>
      </PopupTrigger>
      <PopupContent
        className="w-[var(--radix-popover-trigger-width)] p-2"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <input
          aria-label="Filter options"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          className={cn(fieldClass, fieldSize.sm, "mb-2")}
        />
        <div
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          className="flex max-h-52 flex-col gap-0.5 overflow-y-auto"
        >
          {matches.length === 0 ? (
            <p className="px-2 py-2 text-[13px] text-text-3">No matches.</p>
          ) : (
            matches.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                className="flex items-center justify-between rounded-xs px-2 py-1.5 text-left text-[13px] text-text-2 hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)]"
                onClick={() => {
                  onValueChange?.(option.value);
                  setOpen(false);
                  setQuery("");
                }}
              >
                {option.label}
                {option.value === value ? <Check className="size-3.5 text-primary" /> : null}
              </button>
            ))
          )}
        </div>
      </PopupContent>
    </Popup>
  );
}
