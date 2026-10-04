"use client";

import * as React from "react";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Popup, PopupContent, PopupTrigger } from "@/components/molecules/popup";
import { cn } from "@/lib/cn";
import { fieldClass, fieldSize } from "@/lib/styles";

export type DateRange = {
  start: string;
  end: string;
};

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function iso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year ?? 2026, (month ?? 1) - 1, day ?? 1);
}

function formatRange(range: DateRange | undefined) {
  if (!range?.start || !range.end) return "Select dates";
  const format = (value: string) =>
    parseIso(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return `${format(range.start)} – ${format(range.end)}`;
}

function monthCells(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

type DateRangePickerProps = {
  id?: string;
  value?: DateRange;
  onValueChange?: (value: DateRange) => void;
  className?: string;
};

export function DateRangePicker({ id, value, onValueChange, className }: DateRangePickerProps) {
  const initial = value?.start ? parseIso(value.start) : new Date();
  const [cursor, setCursor] = React.useState(
    new Date(initial.getFullYear(), initial.getMonth(), 1),
  );
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
    const next = { start: iso(start), end: iso(end) };
    setDraft(next);
    setCursor(new Date(start.getFullYear(), start.getMonth(), 1));
    onValueChange?.(next);
  }

  const today = new Date();

  return (
    <Popup>
      <PopupTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            fieldClass,
            fieldSize.md,
            "flex items-center justify-between gap-2 text-left",
            className,
          )}
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
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            <ChevronLeft />
          </Button>
          <p className="text-[13px] font-medium text-heading">
            {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
          <Button
            type="button"
            icon
            size="xs"
            color="white"
            aria-label="Next month"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold tracking-[0.4px] text-text-3 uppercase">
          {weekdays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day) => {
            const key = iso(day);
            const inMonth = day.getMonth() === cursor.getMonth();
            const start = draft.start;
            const end = draft.end;
            const inRange = Boolean(start && end && key >= start && key <= end);
            const endpoint = key === start || key === end;
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectDay(key)}
                className={cn(
                  "h-8 rounded-xs text-[12px]",
                  inMonth ? "text-text-2" : "text-text-4",
                  inRange && "bg-primary/10",
                  endpoint && "bg-primary text-white",
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
