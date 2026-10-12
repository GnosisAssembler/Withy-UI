"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Checkbox } from "../atoms/checkbox";
import { Label } from "../atoms/label";
import { ScrollArea } from "../atoms/scroll-area";
import { cn } from "../../lib/cn";
import { FieldContext, useFieldContext, useFieldControl } from "../../lib/field";
import { IconButton } from "./icon-button";

export type TransferItem = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type TransferListProps = {
  /** Every item the control can show. Values must be unique. */
  items: readonly TransferItem[];
  /** Chosen values, in the order they appear in the chosen list. */
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  availableLabel?: string;
  chosenLabel?: string;
  /** Show the buttons that move every enabled item. */
  showMoveAll?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

const narrowIcon = "[&_svg]:rotate-90 md:[&_svg]:rotate-0";

function lowerFirst(label: string) {
  return label.length === 0 ? label : label.charAt(0).toLowerCase() + label.slice(1);
}

function partition(items: readonly TransferItem[], chosen: readonly string[]) {
  const byValue = new Map<string, TransferItem>();
  for (const item of items) {
    if (!byValue.has(item.value)) byValue.set(item.value, item);
  }

  const seen = new Set<string>();
  const chosenItems: TransferItem[] = [];
  for (const value of chosen) {
    const item = byValue.get(value);
    if (!item || seen.has(item.value)) continue;
    seen.add(item.value);
    chosenItems.push(item);
  }

  const availableItems: TransferItem[] = [];
  for (const item of items) {
    if (seen.has(item.value)) continue;
    seen.add(item.value);
    availableItems.push(item);
  }

  return { availableItems, chosenItems };
}

function movedMessage(moved: readonly TransferItem[], destination: string) {
  const place = lowerFirst(destination);
  if (moved.length === 1) return `Moved ${moved[0]?.label} to ${place}`;
  return `Moved ${moved.length} items to ${place}`;
}

type PaneProps = {
  uid: string;
  label: string;
  items: readonly TransferItem[];
  checked: ReadonlySet<string>;
  disabled?: boolean;
  invalid?: boolean;
  empty: string;
  onToggle: (value: string, next: boolean) => void;
  onToggleAll: () => void;
};

function TransferPane({
  uid,
  label,
  items,
  checked,
  disabled = false,
  invalid = false,
  empty,
  onToggle,
  onToggleAll,
}: PaneProps) {
  const titleId = `${uid}-title`;
  const countId = `${uid}-count`;
  const selectAllId = `${uid}-all`;
  const enabled = items.filter((item) => !item.disabled);
  const selectedCount = items.filter((item) => checked.has(item.value)).length;
  const enabledSelected = enabled.filter((item) => checked.has(item.value)).length;
  const allSelected = enabled.length > 0 && enabledSelected === enabled.length;
  const someSelected = enabledSelected > 0 && !allSelected;

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-sm border bg-card md:flex-1 md:basis-0",
        invalid ? "border-danger" : "border-border",
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-2.5 py-2">
        <Checkbox
          id={selectAllId}
          aria-label={`Select all ${lowerFirst(label)}`}
          aria-describedby={countId}
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          disabled={disabled || enabled.length === 0}
          onCheckedChange={onToggleAll}
        />
        <div className="min-w-0">
          <Label id={titleId} htmlFor={selectAllId} className="block cursor-pointer truncate">
            {label}
          </Label>
          <p id={countId} className="text-[12px] text-text-3 tabular-nums">
            {items.length === 0 ? "None selected" : `${selectedCount} of ${items.length} selected`}
          </p>
        </div>
      </div>
      <ScrollArea className="h-56">
        <ul aria-labelledby={titleId} className="m-0 list-none p-0">
          {items.length === 0 ? (
            <li className="flex h-56 items-center px-2.5 text-[13px] text-text-3">{empty}</li>
          ) : (
            items.map((item, index) => {
              const labelId = `${uid}-item-${index}-label`;
              const descriptionId = item.description
                ? `${uid}-item-${index}-description`
                : undefined;
              const selected = checked.has(item.value);
              const itemDisabled = disabled || item.disabled;
              return (
                <li key={item.value}>
                  <label
                    className={cn(
                      "flex cursor-pointer gap-2 px-2.5 py-2 select-none hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)]",
                      item.description ? "items-start" : "items-center",
                      selected && "bg-primary/10 hover:bg-primary/15",
                      itemDisabled && "cursor-not-allowed opacity-60 hover:bg-transparent",
                    )}
                  >
                    <Checkbox
                      className={item.description ? "mt-0.5" : undefined}
                      checked={selected}
                      disabled={itemDisabled}
                      onCheckedChange={(next) => onToggle(item.value, next === true)}
                      aria-labelledby={labelId}
                      aria-describedby={descriptionId}
                      data-transfer-value={item.value}
                    />
                    <span className="min-w-0">
                      <span
                        id={labelId}
                        className="block truncate text-[13px] font-medium text-text-2"
                      >
                        {item.label}
                      </span>
                      {item.description ? (
                        <span id={descriptionId} className="block text-[12px] text-text-3">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </label>
                </li>
              );
            })
          )}
        </ul>
      </ScrollArea>
    </div>
  );
}

export function TransferList({
  items,
  value,
  defaultValue = [],
  onValueChange,
  availableLabel = "Available",
  chosenLabel = "Chosen",
  showMoveAll = true,
  disabled = false,
  className,
  id,
  "aria-label": ariaLabel,
  ...aria
}: TransferListProps) {
  const field = useFieldContext();
  const control = useFieldControl({ id, ...aria });
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const [checked, setChecked] = React.useState<ReadonlySet<string>>(() => new Set());
  const [announcement, setAnnouncement] = React.useState("");
  const [focusRequest, setFocusRequest] = React.useState<{ value: string; id: number } | null>(
    null,
  );
  const focusId = React.useRef(0);
  const chosen = value ?? uncontrolled;
  const { availableItems, chosenItems } = partition(items, chosen);
  const invalid = control["aria-invalid"] === true || control["aria-invalid"] === "true";
  const named = Boolean(field?.labelId || ariaLabel);

  React.useLayoutEffect(() => {
    if (!focusRequest || !rootRef.current) return;
    const match = [...rootRef.current.querySelectorAll<HTMLElement>("[data-transfer-value]")].find(
      (node) => node.getAttribute("data-transfer-value") === focusRequest.value,
    );
    match?.focus();
  }, [focusRequest]);

  function setItemChecked(itemValue: string, next: boolean) {
    setChecked((current) => {
      const updated = new Set(current);
      if (next) updated.add(itemValue);
      else updated.delete(itemValue);
      return updated;
    });
  }

  function toggleAll(list: readonly TransferItem[]) {
    const enabled = list.filter((item) => !item.disabled).map((item) => item.value);
    setChecked((current) => {
      const updated = new Set(current);
      const allOn = enabled.length > 0 && enabled.every((itemValue) => updated.has(itemValue));
      for (const itemValue of enabled) {
        if (allOn) updated.delete(itemValue);
        else updated.add(itemValue);
      }
      return updated;
    });
  }

  function move(direction: "chosen" | "available", mode: "selected" | "all") {
    if (disabled) return;
    const source = direction === "chosen" ? availableItems : chosenItems;
    const moving = source.filter(
      (item) => !item.disabled && (mode === "all" || checked.has(item.value)),
    );
    if (moving.length === 0) return;

    const movingValues = new Set(moving.map((item) => item.value));
    const next =
      direction === "chosen"
        ? [...chosenItems.map((item) => item.value), ...moving.map((item) => item.value)]
        : chosenItems.filter((item) => !movingValues.has(item.value)).map((item) => item.value);

    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
    setChecked((current) => {
      const updated = new Set(current);
      for (const item of moving) updated.delete(item.value);
      return updated;
    });
    const first = moving[0];
    if (first) {
      focusId.current += 1;
      setFocusRequest({ value: first.value, id: focusId.current });
    }
    setAnnouncement(movedMessage(moving, direction === "chosen" ? chosenLabel : availableLabel));
  }

  const canMove = (list: readonly TransferItem[], mode: "selected" | "all") =>
    !disabled && list.some((item) => !item.disabled && (mode === "all" || checked.has(item.value)));

  return (
    <div
      ref={rootRef}
      id={control.id}
      role={named ? "group" : undefined}
      aria-labelledby={field?.labelId}
      aria-label={field ? undefined : ariaLabel}
      aria-describedby={control["aria-describedby"]}
      aria-invalid={control["aria-invalid"]}
      className={cn("flex w-full flex-col gap-2.5 md:flex-row md:items-center", className)}
    >
      <FieldContext.Provider value={null}>
        <TransferPane
          uid={`${uid}-available`}
          label={availableLabel}
          items={availableItems}
          checked={checked}
          disabled={disabled}
          invalid={invalid}
          empty="Nothing available"
          onToggle={setItemChecked}
          onToggleAll={() => toggleAll(availableItems)}
        />
        <div className="flex shrink-0 flex-row justify-center gap-2 md:flex-col">
          {showMoveAll ? (
            <IconButton
              icon={ChevronsRight}
              label={`Move all to ${lowerFirst(chosenLabel)}`}
              tooltip
              className={narrowIcon}
              disabled={!canMove(availableItems, "all")}
              onClick={() => move("chosen", "all")}
            />
          ) : null}
          <IconButton
            icon={ChevronRight}
            label={`Move selected to ${lowerFirst(chosenLabel)}`}
            tooltip
            className={narrowIcon}
            disabled={!canMove(availableItems, "selected")}
            onClick={() => move("chosen", "selected")}
          />
          <IconButton
            icon={ChevronLeft}
            label={`Move selected to ${lowerFirst(availableLabel)}`}
            tooltip
            className={narrowIcon}
            disabled={!canMove(chosenItems, "selected")}
            onClick={() => move("available", "selected")}
          />
          {showMoveAll ? (
            <IconButton
              icon={ChevronsLeft}
              label={`Move all to ${lowerFirst(availableLabel)}`}
              tooltip
              className={narrowIcon}
              disabled={!canMove(chosenItems, "all")}
              onClick={() => move("available", "all")}
            />
          ) : null}
        </div>
        <TransferPane
          uid={`${uid}-chosen`}
          label={chosenLabel}
          items={chosenItems}
          checked={checked}
          disabled={disabled}
          invalid={invalid}
          empty="Nothing chosen"
          onToggle={setItemChecked}
          onToggleAll={() => toggleAll(chosenItems)}
        />
      </FieldContext.Provider>
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
