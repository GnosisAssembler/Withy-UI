"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Popup, PopupContent, PopupTrigger } from "@/components/molecules/popup";
import { cn } from "@/lib/cn";
import { fieldClass, fieldSize } from "@/lib/styles";

const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

type TimePickerProps = {
  id?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

function parseTime(value: string | undefined) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value ?? "");
  const hour24 = match ? Number(match[1]) : 9;
  const minuteNumber = match ? Number(match[2]) : 30;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const snapped = String(Math.min(55, Math.round(minuteNumber / 5) * 5)).padStart(2, "0");
  return { hour12, minute: snapped, period };
}

function to24(hour12: number, minute: string, period: string) {
  let hour = hour12 % 12;
  if (period === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

export function TimePicker({ id, value, onValueChange, className }: TimePickerProps) {
  const parsed = parseTime(value);
  const [hour12, setHour12] = React.useState(parsed.hour12);
  const [minute, setMinute] = React.useState(parsed.minute);
  const [period, setPeriod] = React.useState(parsed.period);
  const label = `${hour12}:${minute} ${period}`;

  function commit(nextHour: number, nextMinute: string, nextPeriod: string) {
    setHour12(nextHour);
    setMinute(nextMinute);
    setPeriod(nextPeriod);
    onValueChange?.(to24(nextHour, nextMinute, nextPeriod));
  }

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
          <span>{label}</span>
          <Clock className="size-4 text-text-3" />
        </button>
      </PopupTrigger>
      <PopupContent className="w-56 p-2">
        <div className="grid grid-cols-3 gap-1">
          <TimeColumn
            label="Hour"
            values={hours.map(String)}
            selected={String(hour12)}
            onSelect={(next) => commit(Number(next), minute, period)}
          />
          <TimeColumn
            label="Minute"
            values={minutes}
            selected={minute}
            onSelect={(next) => commit(hour12, next, period)}
          />
          <TimeColumn
            label="Period"
            values={["AM", "PM"]}
            selected={period}
            onSelect={(next) => commit(hour12, minute, next)}
          />
        </div>
      </PopupContent>
    </Popup>
  );
}

function TimeColumn({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string;
  values: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <p className="px-1 pb-1 font-inter text-[10px] font-semibold tracking-[0.5px] text-text-3 uppercase">
        {label}
      </p>
      <div className="flex max-h-40 flex-col gap-0.5 overflow-y-auto">
        {values.map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              "rounded-xs px-2 py-1 text-left text-[13px] text-text-2 hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)]",
              item === selected && "bg-primary text-white hover:bg-primary",
            )}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
