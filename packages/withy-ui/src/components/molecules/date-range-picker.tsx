"use client";

import * as React from "react";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../atoms/button";
import { Popup, PopupContent, PopupTrigger } from "./popup";
import { cn } from "../../lib/cn";
import {
  addMonths,
  formatIsoDate,
  formatMonth,
  monthCells,
  parseIsoDate,
  startOfMonth,
  toIsoDate,
  weekdayInitials,
} from "../../lib/dates";
import { useFieldControl } from "../../lib/field";
import { fieldClass, fieldSize } from "../../lib/styles";

export type DateRange = {
  start: string;
  end: string;
};

function formatRange(range: DateRange | undefined) {
  if (!range?.start || !range.end) return "Select dates";
  return `${formatIsoDate(range.start)} – ${formatIsoDate(range.end)}`;
}

type DateRangePickerProps = {
  id?: string;
  value?: DateRange;
  onValueChange?: (value: DateRange) => void;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

export function DateRangePicker({
  id,
  value,
  onValueChange,
  className,
  "aria-label": ariaLabel,
  ...aria
}: DateRangePickerProps) {
  const control = useFieldControl({ id, ...aria });
  const initial = value?.start ? parseIsoDate(value.start) : new Date();
  const [cursor, setCursor] = React.useState(startOfMonth(initial));
  const [draft, setDraft] = React.useState<Partial<DateRange>>(value ?? {});
  const cells = monthCells(cursor);

  function selectDay(day: string) {
    if (!draft.start || (draft.start && draft.end)) {
      setDraft({ start: day });
      return;
    }
    if (day < draft.start) {
      const next = { start: day, end: draft.start };
      setDraft(next);
      onValueChange?.(next);
      return;
    }
    const next = { start: draft.start, end: day };
    setDraft(next);
    onValueChange?.(next);
  }

  function applyPreset(start: Date, end: Date) {
    const next = { start: toIsoDate(start), end: toIsoDate(end) };
    setDraft(next);
    setCursor(startOfMonth(start));
    onValueChange?.(next);
  }

  const today = new Date();

  return (
    <Popup>
      <PopupTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            fieldClass,
            fieldSize.md,
            "flex items-center justify-between gap-2 text-left",
            className,
          )}
          {...control}
        >
          <span className="truncate">
            {formatRange(value ?? (draft.start && draft.end ? (draft as DateRange) : undefined))}
          </span>
          <CalendarRange className="size-4 shrink-0 text-text-3" />
        </button>
      </PopupTrigger>
      <PopupContent className="w-[20rem] p-3">
        <div className="mb-3 flex flex-wrap gap-1">
          <Button type="button" size="xs" color="white" onClick={() => applyPreset(today, today)}>
            Today
          </Button>
          <Button
            type="button"
            size="xs"
            color="white"
            onClick={() => {
              const start = new Date(today);
              start.setDate(today.getDate() - 6);
              applyPreset(start, today);
            }}
          >
            Last 7 days
          </Button>
          <Button
            type="button"
            size="xs"
            color="white"
            onClick={() =>
              applyPreset(
                new Date(today.getFullYear(), today.getMonth(), 1),
                new Date(today.getFullYear(), today.getMonth() + 1, 0),
              )
            }
          >
            This month
          </Button>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <Button
            type="button"
            icon
            size="xs"
            color="white"
            aria-label="Previous month"
            onClick={() => setCursor(addMonths(cursor, -1))}
          >
            <ChevronLeft />
          </Button>
          <p className="text-[13px] font-medium text-heading">{formatMonth(cursor)}</p>
          <Button
            type="button"
            icon
            size="xs"
            color="white"
            aria-label="Next month"
            onClick={() => setCursor(addMonths(cursor, 1))}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold tracking-[0.4px] text-text-3 uppercase">
          {weekdayInitials.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day) => {
            const key = toIsoDate(day);
            const inMonth = day.getMonth() === cursor.getMonth();
            const start = draft.start;
            const end = draft.end;
            const inRange = Boolean(start && end && key >= start && key <= end);
            const endpoint = key === start || key === end;
            return (
              <button
                key={key}
                type="button"
                aria-label={formatIsoDate(key, { dateStyle: "full" })}
                aria-pressed={inRange || endpoint}
                onClick={() => selectDay(key)}
                className={cn(
                  "h-8 rounded-xs text-[12px] outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
                  inMonth ? "text-text-2" : "text-text-4",
                  inRange && "bg-primary/10",
                  endpoint && "bg-primary text-primary-foreground",
                )}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </PopupContent>
    </Popup>
  );
}
