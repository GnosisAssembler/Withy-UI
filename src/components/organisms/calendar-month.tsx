"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { PulseDot } from "@/components/atoms/pulse-dot";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/organisms/card";
import { calendarEvents, calendarToday, type CalendarEvent } from "@/data/calendar";
import { cn } from "@/lib/cn";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const eventTone = {
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  pink: "bg-pink/15 text-pink",
  info: "bg-info/15 text-info",
} as const;

function iso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
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

export function CalendarMonth({
  events = calendarEvents,
  today = calendarToday,
}: {
  events?: CalendarEvent[];
  today?: string;
}) {
  const initial = new Date(`${today}T12:00:00`);
  const [cursor, setCursor] = React.useState(initial);
  const [selected, setSelected] = React.useState(today);
  const cells = monthCells(cursor);
  const byDate = events.reduce<Record<string, CalendarEvent[]>>((groups, event) => {
    groups[event.date] = [...(groups[event.date] ?? []), event];
    return groups;
  }, {});
  const selectedEvents = byDate[selected] ?? [];
  const label = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="grid gap-2.5 xl:grid-cols-[minmax(0,1.7fr)_minmax(16rem,0.8fr)]">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>{label}</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              icon
              size="sm"
              color="white"
              aria-label="Previous month"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            >
              <ChevronLeft />
            </Button>
            <Button size="sm" color="white" onClick={() => setCursor(initial)}>
              Today
            </Button>
            <Button
              icon
              size="sm"
              color="white"
              aria-label="Next month"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold tracking-[0.5px] text-text-3 uppercase">
            {weekdays.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day) => {
              const key = iso(day);
              const inMonth = day.getMonth() === cursor.getMonth();
              const dayEvents = byDate[key] ?? [];
              const isToday = key === today;
              const isSelected = key === selected;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(key)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex min-h-24 flex-col rounded-sm border px-1.5 py-1.5 text-left outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
                    inMonth ? "bg-card" : "bg-muted/60 text-text-3",
                    isSelected ? "border-primary" : "border-transparent hover:border-border",
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-flex size-6 items-center justify-center rounded-full text-[12px]",
                        isToday && "bg-primary text-white",
                      )}
                    >
                      {day.getDate()}
                    </span>
                    {isToday ? <PulseDot color="primary" label="Today" /> : null}
                  </span>
                  <span className="mt-1 flex flex-col gap-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <span
                        key={event.id}
                        className={cn(
                          "truncate rounded-xs px-1 py-0.5 text-[10px] font-medium",
                          eventTone[event.color],
                        )}
                      >
                        {event.title}
                      </span>
                    ))}
                    {dayEvents.length > 2 ? (
                      <span className="text-[10px] text-text-3">+{dayEvents.length - 2}</span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {new Date(`${selected}T12:00:00`).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </CardTitle>
        </CardHeader>
        <CardBody>
          {selectedEvents.length === 0 ? (
            <p className="text-[13px] text-text-3">Nothing scheduled.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {selectedEvents.map((event) => (
                <li key={event.id} className="flex items-start gap-3">
                  <span
                    className={cn("mt-1 size-2 shrink-0 rounded-full", eventTone[event.color])}
                  />
                  <span>
                    <span className="block text-sm text-heading">{event.title}</span>
                    <span className="text-[12px] text-text-3">{event.time}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
