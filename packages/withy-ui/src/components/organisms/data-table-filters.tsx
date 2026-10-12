"use client";

import * as React from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { Radio, RadioGroup } from "../atoms/radio-group";
import { DatePicker } from "../molecules/date-picker";
import { NumberInput } from "../molecules/number-input";
import { Popup, PopupContent, PopupTrigger } from "../molecules/popup";
import { cn } from "../../lib/cn";
import { formatIsoDate, parseIsoDate } from "../../lib/dates";

export type NumberCondition = "eq" | "between" | "gt" | "lt";
export type DateCondition = "on" | "before" | "after" | "between";

export type NumberFilterValue = {
  kind: "number";
  condition: NumberCondition;
  value: number | null;
  valueTo: number | null;
};

export type DateFilterValue = {
  kind: "date";
  condition: DateCondition;
  value: string | null;
  valueTo: string | null;
};

export type TextColumnFilter<T> = {
  type: "text";
  value?: (row: T) => string;
};

export type SelectColumnFilter<T> = {
  type: "select";
  value: (row: T) => string;
  options?: { label: string; value: string }[];
};

export type NumberColumnFilter<T> = {
  type: "number";
  value: (row: T) => number;
  format?: "number" | "currency";
};

export type DateColumnFilter<T> = {
  type: "date";
  value: (row: T) => string | number | Date;
};

export type ColumnFilter<T> =
  TextColumnFilter<T> | SelectColumnFilter<T> | NumberColumnFilter<T> | DateColumnFilter<T>;

export type FilterableColumn<T> = {
  key: string;
  header: string;
  filter?: ColumnFilter<T>;
  filterValue?: (row: T) => string;
};

const numberConditions: { value: NumberCondition; label: string }[] = [
  { value: "eq", label: "is equal to" },
  { value: "between", label: "is between" },
  { value: "gt", label: "is greater than" },
  { value: "lt", label: "is less than" },
];

const dateConditions: { value: DateCondition; label: string }[] = [
  { value: "on", label: "is on" },
  { value: "before", label: "is before" },
  { value: "after", label: "is after" },
  { value: "between", label: "is between" },
];

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const numberFormat = new Intl.NumberFormat("en-US");

function isNumberFilter(value: unknown): value is NumberFilterValue {
  return Boolean(
    value && typeof value === "object" && (value as NumberFilterValue).kind === "number",
  );
}

function isDateFilter(value: unknown): value is DateFilterValue {
  return Boolean(value && typeof value === "object" && (value as DateFilterValue).kind === "date");
}

function numberReady(value: NumberFilterValue) {
  if (value.condition === "between") return value.value != null && value.valueTo != null;
  return value.value != null;
}

function dateReady(value: DateFilterValue) {
  if (value.condition === "between") return Boolean(value.value && value.valueTo);
  return Boolean(value.value);
}

export function isActiveFilter(value: unknown) {
  if (typeof value === "string") return value.trim().length > 0;
  if (isNumberFilter(value)) return numberReady(value);
  if (isDateFilter(value)) return dateReady(value);
  return false;
}

function formatAmount(amount: number, format: NumberColumnFilter<unknown>["format"]) {
  return format === "currency" ? currencyFormat.format(amount) : numberFormat.format(amount);
}

export function selectOptions<T>(column: FilterableColumn<T>, rows: T[]) {
  if (column.filter?.type !== "select") return [];
  if (column.filter.options) return column.filter.options;
  const seen = new Set<string>();
  for (const row of rows) {
    const value = column.filter.value(row);
    if (value) seen.add(value);
  }
  return [...seen]
    .sort((left, right) => left.localeCompare(right))
    .map((value) => ({ label: value, value }));
}

export function filterSummary<T>(column: FilterableColumn<T>, value: unknown, rows: T[]) {
  if (!isActiveFilter(value) || !column.filter) return null;
  if (typeof value === "string") {
    if (column.filter.type === "select") {
      return selectOptions(column, rows).find((option) => option.value === value)?.label ?? value;
    }
    return value.trim();
  }
  if (isNumberFilter(value) && column.filter.type === "number") {
    const format = column.filter.format;
    if (value.value == null) return null;
    if (value.condition === "eq") return `= ${formatAmount(value.value, format)}`;
    if (value.condition === "gt") return `> ${formatAmount(value.value, format)}`;
    if (value.condition === "lt") return `< ${formatAmount(value.value, format)}`;
    if (value.valueTo == null) return null;
    return `${formatAmount(value.value, format)}–${formatAmount(value.valueTo, format)}`;
  }
  if (isDateFilter(value) && column.filter.type === "date" && value.value) {
    if (value.condition === "on") return formatIsoDate(value.value);
    if (value.condition === "before") return `before ${formatIsoDate(value.value)}`;
    if (value.condition === "after") return `after ${formatIsoDate(value.value)}`;
    if (!value.valueTo) return null;
    return `${formatIsoDate(value.value)}–${formatIsoDate(value.valueTo)}`;
  }
  return null;
}

function dayTime(value: string | number | Date) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  }
  if (typeof value === "number") {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }
  const iso = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return parseIsoDate(iso).getTime();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()).getTime();
}

function matchesNumber(amount: number, filter: NumberFilterValue) {
  if (filter.value == null) return true;
  if (filter.condition === "eq") return amount === filter.value;
  if (filter.condition === "gt") return amount > filter.value;
  if (filter.condition === "lt") return amount < filter.value;
  if (filter.valueTo == null) return true;
  const low = Math.min(filter.value, filter.valueTo);
  const high = Math.max(filter.value, filter.valueTo);
  return amount >= low && amount <= high;
}

function matchesDate(value: string | number | Date, filter: DateFilterValue) {
  if (!filter.value) return true;
  const day = dayTime(value);
  const from = dayTime(filter.value);
  if (day == null || from == null) return false;
  if (filter.condition === "on") return day === from;
  if (filter.condition === "before") return day < from;
  if (filter.condition === "after") return day > from;
  if (!filter.valueTo) return true;
  const to = dayTime(filter.valueTo);
  if (to == null) return false;
  const low = Math.min(from, to);
  const high = Math.max(from, to);
  return day >= low && day <= high;
}

export function columnMatches<T>(column: FilterableColumn<T>, row: T, filterValue: unknown) {
  if (!isActiveFilter(filterValue)) return true;
  if (typeof filterValue === "string") {
    const query = filterValue.trim().toLowerCase();
    if (column.filter?.type === "select") return column.filter.value(row) === filterValue;
    const source =
      column.filter?.type === "text"
        ? (column.filter.value?.(row) ?? column.filterValue?.(row) ?? "")
        : (column.filterValue?.(row) ?? "");
    return source.toLowerCase().includes(query);
  }
  if (isNumberFilter(filterValue) && column.filter?.type === "number") {
    return matchesNumber(column.filter.value(row), filterValue);
  }
  if (isDateFilter(filterValue) && column.filter?.type === "date") {
    return matchesDate(column.filter.value(row), filterValue);
  }
  return true;
}

export function searchHaystack<T>(columns: FilterableColumn<T>[], row: T) {
  return columns
    .map((column) => {
      if (column.filterValue && !column.filter) return column.filterValue(row);
      if (!column.filter) return "";
      if (column.filter.type === "text")
        return column.filter.value?.(row) ?? column.filterValue?.(row) ?? "";
      if (column.filter.type === "select") return column.filter.value(row);
      if (column.filter.type === "number") return String(column.filter.value(row));
      const raw = column.filter.value(row);
      return raw instanceof Date ? raw.toISOString() : String(raw);
    })
    .filter(Boolean)
    .join(" ");
}

export function matchesSearch<T>(
  columns: FilterableColumn<T>[],
  row: T,
  filterValue: unknown,
  searchValue?: (row: T) => string,
) {
  const query = String(filterValue ?? "")
    .trim()
    .toLowerCase();
  if (!query) return true;
  const haystack = (searchValue ? searchValue(row) : searchHaystack(columns, row)).toLowerCase();
  return haystack.includes(query);
}

function keepNestedLayer(event: { target: EventTarget | null; preventDefault: () => void }) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest("[data-radix-select-content], [data-radix-popper-content-wrapper]")) {
    event.preventDefault();
  }
}

function ConditionChoices<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | "";
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="text-[12px] font-medium text-heading">{label}</legend>
      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as T)}
        aria-label={label}
        className="grid gap-1.5"
      >
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-[13px] text-text-2">
            <Radio value={option.value} />
            {option.label}
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

function FilterFields<T>({
  column,
  rows,
  applied,
  onApply,
  onClear,
}: {
  column: FilterableColumn<T>;
  rows: T[];
  applied: unknown;
  onApply: (value: unknown) => void;
  onClear: () => void;
}) {
  const filter = column.filter;
  const [text, setText] = React.useState(typeof applied === "string" ? applied : "");
  const [choice, setChoice] = React.useState(typeof applied === "string" ? applied : "");
  const [numberFilter, setNumberFilter] = React.useState<NumberFilterValue>(
    isNumberFilter(applied)
      ? applied
      : { kind: "number", condition: "gt", value: null, valueTo: null },
  );
  const [numberChosen, setNumberChosen] = React.useState(isNumberFilter(applied));
  const [dateFilter, setDateFilter] = React.useState<DateFilterValue>(
    isDateFilter(applied) ? applied : { kind: "date", condition: "on", value: null, valueTo: null },
  );
  const [dateChosen, setDateChosen] = React.useState(isDateFilter(applied));

  if (!filter) return null;

  let canApply = false;
  if (filter.type === "text") canApply = text.trim().length > 0;
  if (filter.type === "select") canApply = choice.length > 0;
  if (filter.type === "number") canApply = numberChosen && numberReady(numberFilter);
  if (filter.type === "date") canApply = dateChosen && dateReady(dateFilter);

  function apply() {
    if (filter?.type === "text") onApply(text.trim());
    if (filter?.type === "select") onApply(choice);
    if (filter?.type === "number") onApply(numberFilter);
    if (filter?.type === "date") onApply(dateFilter);
  }

  return (
    <div className="flex w-64 flex-col gap-3">
      <p className="text-[13px] font-medium text-heading">Filter by {column.header}</p>
      {filter.type === "text" ? (
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-heading">
          Contains
          <Input
            fieldSize="sm"
            value={text}
            aria-label={`${column.header} contains`}
            placeholder="Contains…"
            onChange={(event) => setText(event.target.value)}
          />
        </label>
      ) : null}
      {filter.type === "select" ? (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-[12px] font-medium text-heading">{column.header}</legend>
          <RadioGroup
            value={choice}
            onValueChange={setChoice}
            aria-label={column.header}
            className="max-h-48 gap-1.5 overflow-y-auto"
          >
            {selectOptions(column, rows).map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-[13px] text-text-2">
                <Radio value={option.value} />
                {option.label}
              </label>
            ))}
          </RadioGroup>
        </fieldset>
      ) : null}
      {filter.type === "number" ? (
        <>
          <ConditionChoices
            label="Condition"
            value={numberChosen ? numberFilter.condition : ""}
            options={numberConditions}
            onChange={(condition) => {
              setNumberChosen(true);
              setNumberFilter((current) => ({ ...current, condition }));
            }}
          />
          <div className="grid gap-2">
            <label className="flex flex-col gap-1.5 text-[12px] font-medium text-heading">
              {numberFilter.condition === "between" ? "From" : "Value"}
              <NumberInput
                controls="none"
                fieldSize="sm"
                disabled={!numberChosen}
                value={numberFilter.value}
                prefix={filter.format === "currency" ? "$" : undefined}
                step={filter.format === "currency" ? 0.01 : 1}
                format={filter.format === "currency" ? { maximumFractionDigits: 2 } : true}
                aria-label={numberFilter.condition === "between" ? "From" : "Value"}
                onValueChange={(next) =>
                  setNumberFilter((current) => ({ ...current, value: next }))
                }
              />
            </label>
            {numberFilter.condition === "between" ? (
              <label className="flex flex-col gap-1.5 text-[12px] font-medium text-heading">
                To
                <NumberInput
                  controls="none"
                  fieldSize="sm"
                  disabled={!numberChosen}
                  value={numberFilter.valueTo}
                  prefix={filter.format === "currency" ? "$" : undefined}
                  step={filter.format === "currency" ? 0.01 : 1}
                  format={filter.format === "currency" ? { maximumFractionDigits: 2 } : true}
                  aria-label="To"
                  onValueChange={(next) =>
                    setNumberFilter((current) => ({ ...current, valueTo: next }))
                  }
                />
              </label>
            ) : null}
          </div>
        </>
      ) : null}
      {filter.type === "date" ? (
        <>
          <ConditionChoices
            label="Condition"
            value={dateChosen ? dateFilter.condition : ""}
            options={dateConditions}
            onChange={(condition) => {
              setDateChosen(true);
              setDateFilter((current) => ({ ...current, condition }));
            }}
          />
          <div className="grid gap-2">
            <label className="flex flex-col gap-1.5 text-[12px] font-medium text-heading">
              {dateFilter.condition === "between" ? "From" : "Date"}
              <DatePicker
                disabled={!dateChosen}
                value={dateFilter.value ?? undefined}
                aria-label={dateFilter.condition === "between" ? "From" : "Date"}
                onValueChange={(next) => setDateFilter((current) => ({ ...current, value: next }))}
              />
            </label>
            {dateFilter.condition === "between" ? (
              <label className="flex flex-col gap-1.5 text-[12px] font-medium text-heading">
                To
                <DatePicker
                  disabled={!dateChosen}
                  value={dateFilter.valueTo ?? undefined}
                  aria-label="To"
                  onValueChange={(next) =>
                    setDateFilter((current) => ({ ...current, valueTo: next }))
                  }
                />
              </label>
            ) : null}
          </div>
        </>
      ) : null}
      <Button size="sm" fullWidth disabled={!canApply} onClick={apply}>
        Apply
      </Button>
      {isActiveFilter(applied) ? (
        <Button size="sm" variant="text" color="secondary" onClick={onClear}>
          Clear filter
        </Button>
      ) : null}
    </div>
  );
}

export function ColumnFilterButton<T>({
  column,
  rows,
  value,
  onChange,
}: {
  column: FilterableColumn<T>;
  rows: T[];
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const [open, setOpen] = React.useState(false);
  if (!column.filter) return null;
  const summary = filterSummary(column, value, rows);
  const label = summary ? `Filter by ${column.header}, ${summary}` : `Filter by ${column.header}`;

  return (
    <Popup open={open} onOpenChange={setOpen}>
      <PopupTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-sm border border-dashed border-border bg-card px-2.5 text-[13px] text-text-2 outline-none hover:border-text-3 hover:text-heading focus-visible:ring-4 focus-visible:ring-primary/25",
            summary && "border-solid border-primary text-heading",
          )}
        >
          {summary ? null : <Plus className="size-3.5" aria-hidden />}
          <span>{column.header}</span>
          {summary ? <span className="font-medium text-primary">{summary}</span> : null}
          <ChevronDown className="size-3.5 text-text-3" aria-hidden />
        </button>
      </PopupTrigger>
      <PopupContent
        className="w-auto"
        onInteractOutside={keepNestedLayer}
        onFocusOutside={keepNestedLayer}
      >
        {open ? (
          <FilterFields
            key={open ? "open" : "closed"}
            column={column}
            rows={rows}
            applied={value}
            onApply={(next) => {
              onChange(next);
              setOpen(false);
            }}
            onClear={() => {
              onChange(undefined);
              setOpen(false);
            }}
          />
        ) : null}
      </PopupContent>
    </Popup>
  );
}
