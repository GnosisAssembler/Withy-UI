"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "../molecules/tooltip";
import { Truncate } from "../molecules/truncate";
import {
  chartColorAt,
  chartFillClass,
  chartValue,
  formatCount,
  type ChartColor,
} from "../../lib/chart-theme";
import { cn } from "../../lib/cn";

export type CategoryBarSegment = {
  name: string;
  value: number;
  color?: ChartColor;
};

type CategoryBarProps = {
  segments: CategoryBarSegment[];
  label: string;
  marker?: { value: number; label?: string };
  legend?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
};

export function CategoryBar({
  segments,
  label,
  marker,
  legend = true,
  valueFormatter = formatCount,
  className,
}: CategoryBarProps) {
  const total = segments.reduce((sum, segment) => sum + chartValue(segment.value), 0);
  const details = segments
    .map((segment) => `${segment.name} ${valueFormatter(segment.value)}`)
    .join(", ");
  const imgLabel = !legend && details ? `${label}. ${details}` : label;
  const markerText =
    marker === undefined
      ? ""
      : marker.label
        ? `${marker.label}: ${valueFormatter(marker.value)}`
        : valueFormatter(marker.value);
  const markerPosition =
    marker === undefined
      ? 0
      : Math.min(100, Math.max(0, (chartValue(marker.value) / (total || 1)) * 100));

  return (
    <div className={cn("w-full min-w-0", className)}>
      <div className="relative">
        <div
          role="img"
          aria-label={imgLabel}
          className="flex h-2.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--heading)_12%,transparent)]"
        >
          {segments.map((segment, index) => {
            const width = total === 0 ? 0 : (chartValue(segment.value) / total) * 100;
            const color = chartColorAt(index, segment.color);
            return (
              <span
                key={`${segment.name}-${index}`}
                className={cn(
                  "h-full shrink-0 transition-[width] duration-500 ease-out motion-reduce:transition-none",
                  chartFillClass[color],
                )}
                style={{ width: `${width}%` }}
              />
            );
          })}
        </div>
        {marker ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={markerText}
                className="absolute top-1/2 z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-heading shadow-sm outline-none ring-1 ring-heading/25 focus-visible:ring-4 focus-visible:ring-primary/25"
                style={{ left: `clamp(0.5rem, ${markerPosition}%, calc(100% - 0.5rem))` }}
              />
            </TooltipTrigger>
            <TooltipContent>{markerText}</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      {legend ? (
        <ul className="mt-4 flex flex-col gap-2.5">
          {segments.map((segment, index) => {
            const color = chartColorAt(index, segment.color);
            const share = total === 0 ? 0 : Math.round((chartValue(segment.value) / total) * 100);
            return (
              <li key={`${segment.name}-${index}`} className="flex items-center gap-2 text-[13px]">
                <span
                  aria-hidden
                  className={cn("size-2.5 shrink-0 rounded-full", chartFillClass[color])}
                />
                <Truncate tone="secondary" size="sm" className="flex-1">
                  {segment.name}
                </Truncate>
                <span className="ml-auto font-rubik text-heading tabular-nums">
                  {valueFormatter(segment.value)}
                </span>
                <span className="w-10 text-right text-text-3 tabular-nums">{share}%</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
