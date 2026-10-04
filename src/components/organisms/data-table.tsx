"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, EllipsisVertical, Filter } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/molecules/menu";
import { Popup, PopupContent, PopupTrigger } from "@/components/molecules/popup";
import { cn } from "@/lib/cn";

const markTones = {
  primary: "bg-primary text-white",
  success: "bg-success text-white",
  danger: "bg-danger text-white",
  warning: "bg-warning text-warning-foreground",
  info: "bg-info text-white",
  indigo: "bg-indigo text-white",
  pink: "bg-pink text-white",
  orange: "bg-orange text-white",
} as const;

export type TickerTone = keyof typeof markTones;

export function TickerCell({
  symbol,
  name,
  mark,
  tone = "primary",
}: {
  symbol: string;
  name: string;
  mark: string;
  tone?: TickerTone;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
          markTones[tone],
        )}
        aria-hidden
      >
        {mark}
      </span>
      <span className="min-w-0 truncate">
        <span className="font-medium text-heading">{symbol}</span>
        <span className="text-text-3"> {name}</span>
      </span>
    </span>
  );
}

export function ColumnSparkline({ data, label = "Timeline" }: { data: number[]; label?: string }) {
  const max = Math.max(...data, 1);
  const height = 28;
  const bar = 3;
  const gap = 1;
  const width = data.length * bar + Math.max(data.length - 1, 0) * gap;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-32" role="img" aria-label={label}>
      {data.map((value, index) => {
        const barHeight = Math.max(1.5, (value / max) * height);
        return (
          <rect
            key={index}
            x={index * (bar + gap)}
            y={height - barHeight}
            width={bar}
            height={barHeight}
            fill="var(--primary)"
          />
        );
      })}
    </svg>
  );
}

const figureFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function SignedFigures({
  value,
  note,
  strongNote = false,
}: {
  value: number;
  note: string;
  strongNote?: boolean;
}) {
  const up = value >= 0;
  return (
    <span className="inline-flex items-baseline gap-3 tabular-nums">
      <span className={up ? "text-success" : "text-danger"}>
        {up ? "↑" : "↓"}
        {figureFormat.format(Math.abs(value))}
      </span>
      <span className={strongNote ? "font-medium text-heading" : "text-text-3"}>{note}</span>
    </span>
  );
}

export type Column<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  width?: string;
  filterValue?: (row: T) => string;
  sortValue?: (row: T) => string | number;
  cell: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  caption?: string;
  className?: string;
};

export function DataTable<T>({ columns, rows, getRowKey, caption, className }: DataTableProps<T>) {
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [sort, setSort] = React.useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const filtered = rows.filter((row) =>
    columns.every((column) => {
      const query = (filters[column.key] ?? "").trim().toLowerCase();
      if (!query || !column.filterValue) return true;
      return column.filterValue(row).toLowerCase().includes(query);
    }),
  );

  const sorted = [...filtered].sort((left, right) => {
    if (!sort) return 0;
    const column = columns.find((item) => item.key === sort.key);
    if (!column?.sortValue) return 0;
    const a = column.sortValue(left);
    const b = column.sortValue(right);
    const result =
      typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b));
    return sort.direction === "asc" ? result : -result;
  });

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-border bg-muted text-text-2">
              {columns.map((column) => {
                const filter = filters[column.key] ?? "";
                const sortedHere = sort?.key === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    style={column.width ? { width: column.width } : undefined}
                    aria-sort={
                      sortedHere
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                    className="px-3 py-2 font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex min-w-0 items-center gap-1 truncate">
                        {column.header}
                        {sortedHere ? (
                          sort.direction === "asc" ? (
                            <ArrowUp className="size-3 text-primary" />
                          ) : (
                            <ArrowDown className="size-3 text-primary" />
                          )
                        ) : null}
                      </span>
                      <span className="ml-auto flex items-center">
                        {column.filterValue ? (
                          <Popup>
                            <PopupTrigger asChild>
                              <button
                                type="button"
                                aria-label={`Filter ${column.header}`}
                                className={cn(
                                  "inline-flex size-6 items-center justify-center rounded-xs text-text-3 hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)] hover:text-heading",
                                  filter && "text-primary",
                                )}
                              >
                                <Filter className="size-3.5" />
                              </button>
                            </PopupTrigger>
                            <PopupContent className="w-56">
                              <label className="mb-2 block text-[12px] font-medium text-heading">
                                Filter {column.header}
                              </label>
                              <Input
                                fieldSize="sm"
                                value={filter}
                                aria-label={`${column.header} contains`}
                                placeholder="Contains…"
                                onChange={(event) =>
                                  setFilters((current) => ({
                                    ...current,
                                    [column.key]: event.target.value,
                                  }))
                                }
                              />
                            </PopupContent>
                          </Popup>
                        ) : null}
                        {column.sortValue ? (
                          <Menu>
                            <MenuTrigger asChild>
                              <button
                                type="button"
                                aria-label={`${column.header} column menu`}
                                className="inline-flex size-6 items-center justify-center rounded-xs text-text-3 hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)] hover:text-heading"
                              >
                                <EllipsisVertical className="size-3.5" />
                              </button>
                            </MenuTrigger>
                            <MenuContent>
                              <MenuItem
                                onSelect={() => setSort({ key: column.key, direction: "asc" })}
                              >
                                Sort ascending
                              </MenuItem>
                              <MenuItem
                                onSelect={() => setSort({ key: column.key, direction: "desc" })}
                              >
                                Sort descending
                              </MenuItem>
                              <MenuItem onSelect={() => setSort(null)}>Clear sort</MenuItem>
                            </MenuContent>
                          </Menu>
                        ) : null}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-text-3">
                  No rows match these filters.
                </td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className="border-b border-border last:border-0 hover:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-3 py-2 text-text-2",
                        column.align === "right" && "text-right",
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div
        role="status"
        className="flex justify-end gap-6 border-t border-border px-3 py-2 text-[12px] text-text-3"
      >
        <span>
          Rows: <span className="font-medium text-heading">{sorted.length}</span>
        </span>
        <span>
          Total Rows: <span className="font-medium text-heading">{rows.length}</span>
        </span>
      </div>
    </div>
  );
}
