"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Checkbox } from "@/components/atoms/checkbox";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/molecules/menu";
import { Pagination } from "@/components/molecules/pagination";
import { SearchInput } from "@/components/molecules/search-input";
import { Select } from "@/components/molecules/select";
import { cn } from "@/lib/cn";

export type AdvancedColumn<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  cell: (row: T) => React.ReactNode;
};

type RowAction<T> = {
  label: string;
  onSelect: (row: T) => void;
  tone?: "danger";
};

type AdvancedTableProps<T> = {
  columns: AdvancedColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  caption: string;
  searchPlaceholder?: string;
  searchValue: (row: T) => string;
  filters?: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
    value: (row: T) => string;
  }[];
  actions?: RowAction<T>[];
  bulkActions?: { label: string; onSelect: (rows: T[]) => void }[];
  pageSize?: number;
};

export function AdvancedTable<T>({
  columns,
  rows,
  getRowKey,
  caption,
  searchPlaceholder = "Search",
  searchValue,
  filters = [],
  actions = [],
  bulkActions = [],
  pageSize = 5,
}: AdvancedTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [filterState, setFilterState] = React.useState<Record<string, string>>({});
  const [sort, setSort] = React.useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<string[]>([]);

  const filtered = rows.filter((row) => {
    const matchesQuery = searchValue(row).toLowerCase().includes(query.trim().toLowerCase());
    const matchesFilters = filters.every((filter) => {
      const current = filterState[filter.key] ?? "all";
      return current === "all" || filter.value(row) === current;
    });
    return matchesQuery && matchesFilters;
  });

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

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleKeys = visible.map(getRowKey);
  const allVisibleSelected =
    visibleKeys.length > 0 && visibleKeys.every((key) => selected.includes(key));
  const someVisibleSelected = visibleKeys.some((key) => selected.includes(key));
  const selectedRows = rows.filter((row) => selected.includes(getRowKey(row)));

  function toggleSort(key: string) {
    setSort((current) => {
      if (current?.key !== key) return { key, direction: "asc" };
      if (current.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  function toggleAll(checked: boolean) {
    setSelected((current) =>
      checked
        ? [...new Set([...current, ...visibleKeys])]
        : current.filter((key) => !visibleKeys.includes(key)),
    );
  }

  function toggleOne(key: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, key] : current.filter((item) => item !== key),
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-border px-5 py-3 lg:flex-row lg:items-center">
        <SearchInput
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          className="lg:max-w-xs"
        />
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              aria-label={filter.label}
              value={filterState[filter.key] ?? "all"}
              onValueChange={(value) => {
                setFilterState((current) => ({ ...current, [filter.key]: value }));
                setPage(1);
              }}
              fieldSize="sm"
              options={[{ label: filter.label, value: "all" }, ...filter.options]}
            />
          ))}
        </div>
        {selectedRows.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <span className="text-[13px] text-text-3">{selectedRows.length} selected</span>
            {bulkActions.map((action) => (
              <Button
                key={action.label}
                size="sm"
                color="white"
                onClick={() => {
                  action.onSelect(selectedRows);
                  setSelected([]);
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-border text-[11px] tracking-[0.5px] text-text-3 uppercase">
              <th className="w-12 px-5 py-3">
                <Checkbox
                  aria-label="Select visible rows"
                  checked={
                    allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false
                  }
                  onCheckedChange={(checked) => toggleAll(checked === true)}
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    sort?.key === column.key
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : column.sortable
                        ? "none"
                        : undefined
                  }
                  className={cn(
                    "px-5 py-3 font-semibold",
                    column.align === "right" && "text-right",
                  )}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 uppercase"
                      onClick={() => toggleSort(column.key)}
                    >
                      {column.header}
                      {sort?.key === column.key ? (
                        sort.direction === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        )
                      ) : null}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              {actions.length > 0 ? (
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1 + (actions.length > 0 ? 1 : 0)}
                  className="px-5 py-8 text-center text-text-3"
                >
                  No rows match.
                </td>
              </tr>
            ) : (
              visible.map((row) => {
                const key = getRowKey(row);
                return (
                  <tr
                    key={key}
                    className="border-b border-border last:border-0 hover:bg-[color-mix(in_srgb,var(--heading)_4%,transparent)]"
                  >
                    <td className="px-5 py-3">
                      <Checkbox
                        aria-label={`Select ${key}`}
                        checked={selected.includes(key)}
                        onCheckedChange={(checked) => toggleOne(key, checked === true)}
                      />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          "px-5 py-3 text-text-2",
                          column.align === "right" && "text-right",
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                    {actions.length > 0 ? (
                      <td className="px-5 py-3 text-right">
                        <Menu>
                          <MenuTrigger asChild>
                            <Button icon size="sm" color="white" aria-label={`Actions for ${key}`}>
                              <MoreHorizontal />
                            </Button>
                          </MenuTrigger>
                          <MenuContent>
                            {actions.map((action) => (
                              <MenuItem
                                key={action.label}
                                className={action.tone === "danger" ? "text-danger" : undefined}
                                onSelect={() => action.onSelect(row)}
                              >
                                {action.label}
                              </MenuItem>
                            ))}
                          </MenuContent>
                        </Menu>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <p className="text-[12px] text-text-3">
          {sorted.length} {sorted.length === 1 ? "row" : "rows"}
        </p>
        <Pagination page={currentPage} pages={pages} onPageChange={setPage} />
      </div>
    </div>
  );
}
