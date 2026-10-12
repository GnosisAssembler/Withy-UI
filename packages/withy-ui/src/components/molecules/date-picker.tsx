"use client";

import * as React from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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

type DatePickerProps = {
  id?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

export function DatePicker({
  id,
  value,
  onValueChange,
  placeholder = "Select a date",
  min,
  max,
  disabled,
  className,
  "aria-label": ariaLabel,
  ...aria
}: DatePickerProps) {
  const control = useFieldControl({ id, ...aria });
  const [open, setOpen] = React.useState(false);
  const [cursor, setCursor] = React.useState(() =>
    startOfMonth(value ? parseIsoDate(value) : new Date()),
  );
  const today = toIsoDate(new Date());
  const cells = monthCells(cursor);

  function choose(day: string) {
    onValueChange?.(day);
    setOpen(false);
  }

  return (
    <Popup
      open={open}
      onOpenChange={(next) => {
        if (next && value) setCursor(startOfMonth(parseIsoDate(value)));
        setOpen(next);
      }}
    >
      <PopupTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          disabled={disabled}
          className={cn(
            fieldClass,
            fieldSize.md,
            "flex items-center justify-between gap-2 text-left",
            className,
          )}
          {...control}
        >
          <span className={cn("truncate", value ? "text-text-2" : "text-text-3")}>
            {value ? formatIsoDate(value) : placeholder}
          </span>
          <Calendar className="size-4 shrink-0 text-text-3" />
        </button>
      </PopupTrigger>
      <PopupContent className="w-[17.5rem] p-3">
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
            const selected = key === value;
            const outOfBounds = Boolean((min && key < min) || (max && key > max));
            return (
              <button
                key={key}
                type="button"
                disabled={outOfBounds}
                aria-label={formatIsoDate(key, { dateStyle: "full" })}
                aria-pressed={selected}
                aria-current={key === today ? "date" : undefined}
                onClick={() => choose(key)}
                className={cn(
                  "h-8 rounded-xs text-[12px] outline-none hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)] focus-visible:ring-4 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-40",
                  inMonth ? "text-text-2" : "text-text-4",
                  key === today && !selected && "font-semibold text-primary",
                  selected && "bg-primary text-primary-foreground hover:bg-primary",
                )}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex justify-end border-t border-border pt-2">
          <Button
            type="button"
            size="xs"
            color="white"
            disabled={Boolean((min && today < min) || (max && today > max))}
            onClick={() => choose(today)}
          >
            Today
          </Button>
        </div>
      </PopupContent>
    </Popup>
  );
}
