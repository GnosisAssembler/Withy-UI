"use client";

import type { ReactNode } from "react";
import { Truncate } from "../molecules/truncate";
import { WithyLink } from "../theme/withy-routing";
import { chartColorMix, chartValue, formatCount, type ChartColor } from "../../lib/chart-theme";
import { cn } from "../../lib/cn";

export type BarListItem = {
  name: string;
  value: number;
  href?: string;
  color?: ChartColor;
  icon?: ReactNode;
};

type SortOrder = "ascending" | "descending" | "none";

type BarListProps = {
  data: BarListItem[];
  label: string;
  valueFormatter?: (value: number) => string;
  sortOrder?: SortOrder;
  color?: ChartColor;
  className?: string;
};

function ordered(data: BarListItem[], sortOrder: SortOrder) {
  if (sortOrder === "none") return data;
  return data
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const delta = left.item.value - right.item.value;
      if (delta === 0) return left.index - right.index;
      return sortOrder === "ascending" ? delta : -delta;
    })
    .map(({ item }) => item);
}

export function BarList({
  data,
  label,
  valueFormatter = formatCount,
  sortOrder = "descending",
  color = "primary",
  className,
}: BarListProps) {
  const rows = ordered(data, sortOrder);
  const max = rows.reduce((peak, item) => Math.max(peak, chartValue(item.value)), 0);

  return (
    <ul aria-label={label} className={cn("flex w-full min-w-0 flex-col gap-2.5", className)}>
      {rows.map((item, index) => {
        const width = max > 0 ? (chartValue(item.value) / max) * 100 : 0;
        const itemColor = item.color ?? color;
        const rowLabel = `${item.name}, ${valueFormatter(item.value)}`;
        const content = (
          <>
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 rounded-sm transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{
                width: `${width}%`,
                backgroundColor: chartColorMix(itemColor, 30),
              }}
            />
            <span className="relative flex min-w-0 flex-1 items-center gap-2 px-2.5">
              {item.icon ? (
                <span className="inline-flex shrink-0 text-text-2">{item.icon}</span>
              ) : null}
              <Truncate tone="heading" weight="medium" size="sm" className="flex-1">
                {item.name}
              </Truncate>
            </span>
            <span className="relative shrink-0 pr-2.5 pl-3 font-rubik text-[13px] text-heading tabular-nums">
              {valueFormatter(item.value)}
            </span>
          </>
        );
        const rowClass =
          "relative flex h-8 min-w-0 items-center overflow-hidden rounded-sm outline-none focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:ring-inset";

        return (
          <li key={`${item.name}-${index}`} aria-label={rowLabel}>
            {item.href ? (
              <WithyLink
                href={item.href}
                aria-label={rowLabel}
                className={cn(
                  rowClass,
                  "hover:bg-[color-mix(in_srgb,var(--heading)_5%,transparent)]",
                )}
              >
                {content}
              </WithyLink>
            ) : (
              <div className={rowClass}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
