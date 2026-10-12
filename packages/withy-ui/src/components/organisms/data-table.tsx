"use client";

import * as React from "react";
import {
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type Updater,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronsLeft,
  ChevronsRight,
  Download,
  EllipsisVertical,
  Filter,
  type LucideIcon,
} from "lucide-react";
import { Button } from "../atoms/button";
import { Checkbox } from "../atoms/checkbox";
import { Input } from "../atoms/input";
import { Kbd } from "../atoms/kbd";
import { Pagination } from "../molecules/pagination";
import {
  PopupMenu,
  PopupMenuContent,
  PopupMenuItem,
  PopupMenuTrigger,
} from "../molecules/popup-menu";
import { Popup, PopupContent, PopupTrigger } from "../molecules/popup";
import { SearchInput } from "../molecules/search-input";
import { Select } from "../molecules/select";
import { Drawer } from "./drawer";
import { cn } from "../../lib/cn";
import {
  ColumnFilterButton,
  columnMatches,
  isActiveFilter,
  matchesSearch,
  type ColumnFilter,
} from "./data-table-filters";

const markTones = {
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  danger: "bg-danger text-danger-foreground",
  warning: "bg-warning text-warning-foreground",
  info: "bg-info text-info-foreground",
  indigo: "bg-indigo text-white",
  pink: "bg-pink text-[#1C1428]",
  orange: "bg-orange text-[#1C1428]",
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

export type { ColumnFilter };

export type Column<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  width?: string;
  filterValue?: (row: T) => string;
  sortValue?: (row: T) => string | number;
  /** Toolbar filter. Text, choice, number, or date. Replaces the header text filter. */
  filter?: ColumnFilter<T>;
  /** When the View menu is on, set this to false to keep the column visible. */
  hideable?: boolean;
  cell: (row: T) => React.ReactNode;
};

export type DataTableRowAction<T> = {
  label: string;
  onSelect: (row: T) => void;
  tone?: "danger";
  icon?: LucideIcon;
};

export type DataTableBulkAction<T> = {
  id: string;
  label: string;
  /** A single key, such as "e", shown on the selection bar. */
  shortcut?: string;
  onSelect: (rows: T[]) => void;
  tone?: "danger";
  icon?: LucideIcon;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  caption?: string;
  empty?: React.ReactNode;
  className?: string;
  /** Checkbox column, selection summary, and the command bar. */
  selectable?: boolean;
  /** Controlled selection. Keys come from getRowKey. */
  selectedKeys?: string[];
  onSelectedKeysChange?: (keys: string[]) => void;
  /** Shown on the command bar while rows are selected. */
  bulkActions?: DataTableBulkAction<T>[];
  /** Menu at the end of each row. */
  rowActions?: (row: T) => DataTableRowAction<T>[];
  /** Names the row in the actions button, such as "Actions for John Doe". */
  rowLabel?: (row: T) => string;
  /** Drawer body for one row. Adds View details to the row menu. */
  details?: (row: T) => React.ReactNode;
  detailsTitle?: (row: T) => string;
  detailsDescription?: (row: T) => string;
  /** Client page size. Omit to show every row. */
  pageSize?: number;
  pageSizeOptions?: number[];
  /** Shows a search field. Matches searchValue, or each column's filter text. */
  searchPlaceholder?: string;
  searchValue?: (row: T) => string;
  /** Shows Export and receives the rows that match the current filters. */
  onExport?: (rows: T[]) => void;
  /** Shows the View menu for hiding columns. */
  columnVisibility?: boolean;
};

const tableFeatureSet = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

type Features = typeof tableFeatureSet;

function applyUpdate<TValue>(updater: Updater<TValue>, current: TValue) {
  return typeof updater === "function" ? (updater as (old: TValue) => TValue)(current) : updater;
}

function toRowSelection(keys: string[]): RowSelectionState {
  const selection: RowSelectionState = {};
  for (const key of keys) selection[key] = true;
  return selection;
}

function compareSort(left: string | number | undefined, right: string | number | undefined) {
  if (left == null && right == null) return 0;
  if (left == null) return 1;
  if (right == null) return -1;
  if (typeof left === "number" && typeof right === "number") return left - right;
  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function resolvedPageSize(pageSize: number | undefined, pageSizeOptions: number[] | undefined) {
  if (pageSize && pageSize > 0) return pageSize;
  const fallback = pageSizeOptions?.find((size) => size > 0);
  return fallback ?? Number.POSITIVE_INFINITY;
}

type HeaderColumn = {
  id: string;
  getIsSorted: () => false | "asc" | "desc";
  getCanSort: () => boolean;
  toggleSorting: (desc?: boolean) => void;
  clearSorting: () => void;
  getFilterValue: () => unknown;
  setFilterValue: (updater: unknown) => void;
};

function DataColumnHeader<T>({
  column,
  tableColumn,
}: {
  column: Column<T>;
  tableColumn: HeaderColumn;
}) {
  const sorted = tableColumn.getIsSorted();
  const filterValue = tableColumn.getFilterValue();
  const filter = typeof filterValue === "string" ? filterValue : "";
  const headerFilter = Boolean(column.filterValue) && !column.filter;

  return (
    <div className="flex items-center gap-2">
      {tableColumn.getCanSort() ? (
        <button
          type="button"
          className="inline-flex min-w-0 items-center gap-1 truncate rounded-xs text-left outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
          onClick={() => {
            if (!sorted) tableColumn.toggleSorting(false);
            else if (sorted === "asc") tableColumn.toggleSorting(true);
            else tableColumn.clearSorting();
          }}
        >
          {column.header}
          {sorted === "asc" ? <ArrowUp className="size-3 text-primary" aria-hidden /> : null}
          {sorted === "desc" ? <ArrowDown className="size-3 text-primary" aria-hidden /> : null}
        </button>
      ) : (
        <span className="inline-flex min-w-0 items-center gap-1 truncate">{column.header}</span>
      )}
      <span className="ml-auto flex items-center">
        {headerFilter ? (
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
                onChange={(event) => tableColumn.setFilterValue(event.target.value)}
              />
            </PopupContent>
          </Popup>
        ) : null}
        {tableColumn.getCanSort() ? (
          <PopupMenu>
            <PopupMenuTrigger asChild>
              <button
                type="button"
                aria-label={`${column.header} column menu`}
                className="inline-flex size-6 items-center justify-center rounded-xs text-text-3 hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)] hover:text-heading"
              >
                <EllipsisVertical className="size-3.5" />
              </button>
            </PopupMenuTrigger>
            <PopupMenuContent>
              <PopupMenuItem onSelect={() => tableColumn.toggleSorting(false)}>
                Sort ascending
              </PopupMenuItem>
              <PopupMenuItem onSelect={() => tableColumn.toggleSorting(true)}>
                Sort descending
              </PopupMenuItem>
              <PopupMenuItem onSelect={() => tableColumn.clearSorting()}>Clear sort</PopupMenuItem>
            </PopupMenuContent>
          </PopupMenu>
        ) : null}
      </span>
    </div>
  );
}

function rowWord(count: number) {
  return count === 1 ? "row" : "rows";
}

// TanStack Table types a row as `Record<string, any>`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  getRowKey,
  caption,
  empty = "Nothing here yet.",
  className,
  selectable = false,
  selectedKeys,
  onSelectedKeysChange,
  bulkActions,
  rowActions,
  rowLabel,
  details,
  detailsTitle,
  detailsDescription,
  pageSize,
  pageSizeOptions,
  searchPlaceholder,
  searchValue,
  onExport,
  columnVisibility = false,
}: DataTableProps<T>) {
  const showActions = Boolean(rowActions || details);
  const showSearch = searchPlaceholder !== undefined || searchValue !== undefined;
  const searchId = React.useId();
  const pageSizeId = React.useId();
  const size = resolvedPageSize(pageSize, pageSizeOptions);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: size,
  });
  const [seenPageSize, setSeenPageSize] = React.useState(size);
  if (seenPageSize !== size) {
    setSeenPageSize(size);
    setPagination({ pageIndex: 0, pageSize: size });
  }
  const [detailKey, setDetailKey] = React.useState<string | null>(null);

  const selectionKey = selectedKeys?.join("\0");
  const controlledSelection = React.useMemo(() => {
    if (selectionKey === undefined) return undefined;
    return toRowSelection(selectionKey.length === 0 ? [] : selectionKey.split("\0"));
  }, [selectionKey]);

  const onRowSelectionChange = React.useCallback<OnChangeFn<RowSelectionState>>(
    (updater) => {
      if (!controlledSelection) return;
      const next = applyUpdate(updater, controlledSelection);
      onSelectedKeysChange?.(Object.keys(next));
    },
    [controlledSelection, onSelectedKeysChange],
  );

  const globalFilterFn = React.useCallback(
    (row: { original: T }, _columnId: string, filterValue: unknown) =>
      matchesSearch(columns, row.original, filterValue, searchValue),
    [columns, searchValue],
  );

  const columnDefs = React.useMemo(() => {
    const helper = createColumnHelper<Features, T>();
    const defs: ColumnDef<Features, T, unknown>[] = [];

    if (selectable) {
      defs.push(
        helper.display({
          id: "_select",
          enableSorting: false,
          enableColumnFilter: false,
          enableHiding: false,
          enableGlobalFilter: false,
          header: ({ table }) => (
            <Checkbox
              aria-label="Select all"
              checked={
                table.getIsAllPageRowsSelected()
                  ? true
                  : table.getIsSomePageRowsSelected()
                    ? "indeterminate"
                    : false
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              aria-label="Select row"
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(value === true)}
              onClick={(event) => event.stopPropagation()}
            />
          ),
        }) as unknown as ColumnDef<Features, T, unknown>,
      );
    }

    for (const column of columns) {
      defs.push(
        helper.accessor((row) => column.sortValue?.(row) ?? "", {
          id: column.key,
          enableSorting: Boolean(column.sortValue),
          enableColumnFilter: Boolean(column.filter || column.filterValue),
          enableHiding: column.hideable !== false,
          sortDescFirst: false,
          filterFn: (row, _columnId, filterValue) =>
            columnMatches(column, row.original, filterValue),
          sortFn: (rowA, rowB) =>
            compareSort(column.sortValue?.(rowA.original), column.sortValue?.(rowB.original)),
          header: ({ column: tableColumn }) => (
            <DataColumnHeader column={column} tableColumn={tableColumn} />
          ),
          cell: ({ row }) => column.cell(row.original),
        }) as unknown as ColumnDef<Features, T, unknown>,
      );
    }

    if (showActions) {
      defs.push(
        helper.display({
          id: "_actions",
          header: "Actions",
          enableSorting: false,
          enableColumnFilter: false,
          enableHiding: false,
          enableGlobalFilter: false,
          cell: ({ row }) => {
            const actions = rowActions?.(row.original) ?? [];
            if (!details && actions.length === 0) return null;
            const name = rowLabel?.(row.original);
            return (
              <PopupMenu>
                <PopupMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={name ? `Actions for ${name}` : "Row actions"}
                    className="inline-flex size-6 items-center justify-center rounded-xs text-text-3 hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)] hover:text-heading"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <EllipsisVertical className="size-3.5" />
                  </button>
                </PopupMenuTrigger>
                <PopupMenuContent>
                  {details ? (
                    <PopupMenuItem onSelect={() => setDetailKey(getRowKey(row.original))}>
                      View details
                    </PopupMenuItem>
                  ) : null}
                  {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <PopupMenuItem
                        key={action.label}
                        className={action.tone === "danger" ? "text-danger" : undefined}
                        onSelect={() => action.onSelect(row.original)}
                      >
                        {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
                        {action.label}
                      </PopupMenuItem>
                    );
                  })}
                </PopupMenuContent>
              </PopupMenu>
            );
          },
        }) as unknown as ColumnDef<Features, T, unknown>,
      );
    }

    return defs;
  }, [columns, details, getRowKey, rowActions, rowLabel, selectable, showActions]);

  const table = useTable({
    features: tableFeatureSet,
    columns: columnDefs,
    data: rows,
    getRowId: (row) => getRowKey(row),
    enableMultiSort: false,
    enableSortingRemoval: true,
    enableRowSelection: selectable,
    globalFilterFn,
    state: {
      pagination,
      ...(controlledSelection ? { rowSelection: controlledSelection } : {}),
    },
    onPaginationChange: setPagination,
    ...(controlledSelection ? { onRowSelectionChange } : {}),
  });

  React.useEffect(() => {
    if (!selectable) return;
    function onKey(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.repeat
      ) {
        return;
      }
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable) {
          return;
        }
      }
      const selected = table.getFilteredSelectedRowModel().rows;
      if (selected.length === 0) return;
      if (event.key === "Escape") {
        event.preventDefault();
        table.resetRowSelection();
        return;
      }
      if (event.key.length !== 1) return;
      const action = bulkActions?.find(
        (item) => item.shortcut?.toLowerCase() === event.key.toLowerCase(),
      );
      if (!action) return;
      event.preventDefault();
      action.onSelect(selected.map((row) => row.original));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bulkActions, selectable, table]);

  const filteredRows = table.getFilteredRowModel().rows;
  const visibleRows = table.getRowModel().rows;
  const filteredCount = filteredRows.length;
  const selectedRows = selectable ? table.getFilteredSelectedRowModel().rows : [];
  const selectedCount = selectedRows.length;
  const filtering =
    table.state.columnFilters.some((filter) => isActiveFilter(filter.value)) ||
    String(table.state.globalFilter ?? "").trim().length > 0;
  const paginated = Number.isFinite(table.state.pagination.pageSize);
  const pageIndex = table.state.pagination.pageIndex;
  const pages = Math.max(table.getPageCount(), 1);
  const from = filteredCount === 0 ? 0 : pageIndex * table.state.pagination.pageSize + 1;
  const to = filteredCount === 0 ? 0 : from + visibleRows.length - 1;
  const columnById = new Map(columns.map((column) => [column.key, column]));
  const hideable = columnVisibility
    ? table
        .getAllLeafColumns()
        .filter((column) => columnById.get(column.id)?.hideable !== false && column.getCanHide())
    : [];
  const toolbarFilters = columns.filter((column) => column.filter);
  const showToolbar =
    toolbarFilters.length > 0 || showSearch || Boolean(onExport) || hideable.length > 0;
  const detailRow =
    detailKey == null ? undefined : rows.find((row) => getRowKey(row) === detailKey);

  function clearFilters() {
    table.resetColumnFilters();
    table.setGlobalFilter("");
  }

  function openDetails(row: T) {
    setDetailKey(getRowKey(row));
  }

  return (
    <div className={className}>
      {selectedCount > 0 ? (
        <div
          role="toolbar"
          aria-label="Selected rows"
          className="sticky top-0 z-20 flex flex-wrap items-center gap-1 border-b border-border bg-brand px-2 py-1.5 text-white"
        >
          <span className="px-2 text-[13px] font-medium">{selectedCount} selected</span>
          <span aria-hidden className="mx-1 h-4 w-px bg-white/25" />
          {bulkActions?.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-xs px-2 text-[13px] text-white outline-none hover:bg-white/10 focus-visible:ring-4 focus-visible:ring-white/40",
                  action.tone === "danger" && "bg-danger text-danger-foreground hover:bg-danger",
                )}
                onClick={() => action.onSelect(selectedRows.map((row) => row.original))}
              >
                {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
                {action.label}
                {action.shortcut ? (
                  <Kbd className="border-white/30 bg-white/15 text-inherit">
                    {action.shortcut.toUpperCase()}
                  </Kbd>
                ) : null}
              </button>
            );
          })}
          <button
            type="button"
            className="ml-auto inline-flex h-7 items-center gap-1.5 rounded-xs px-2 text-[13px] text-white outline-none hover:bg-white/10 focus-visible:ring-4 focus-visible:ring-white/40"
            onClick={() => table.resetRowSelection()}
          >
            Reset
            <Kbd className="border-white/30 bg-white/15 text-inherit">esc</Kbd>
          </button>
        </div>
      ) : null}

      {showToolbar ? (
        <div className="flex flex-col gap-2 border-b border-border px-3 py-2.5 lg:flex-row lg:items-center">
          {toolbarFilters.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {toolbarFilters.map((column) => (
                <ColumnFilterButton
                  key={column.key}
                  column={column}
                  rows={rows}
                  value={table.getColumn(column.key)?.getFilterValue()}
                  onChange={(value) => table.getColumn(column.key)?.setFilterValue(value)}
                />
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            {showSearch ? (
              <>
                <label htmlFor={searchId} className="sr-only">
                  {searchPlaceholder ?? "Search"}
                </label>
                <SearchInput
                  id={searchId}
                  type="search"
                  className="w-full min-w-48 sm:w-64"
                  placeholder={searchPlaceholder ?? "Search"}
                  aria-label={searchPlaceholder ?? "Search"}
                  value={String(table.state.globalFilter ?? "")}
                  onChange={(event) => table.setGlobalFilter(event.target.value)}
                  onClear={() => table.setGlobalFilter("")}
                />
              </>
            ) : null}
            {onExport ? (
              <Button
                size="sm"
                color="white"
                onClick={() => onExport(filteredRows.map((row) => row.original))}
              >
                <Download aria-hidden />
                Export
              </Button>
            ) : null}
            {hideable.length > 0 ? (
              <Popup>
                <PopupTrigger asChild>
                  <Button size="sm" color="white">
                    View
                  </Button>
                </PopupTrigger>
                <PopupContent align="end" className="w-56">
                  <p className="mb-2 text-[13px] font-medium text-heading">Display properties</p>
                  <ul className="flex flex-col">
                    {hideable.map((column) => {
                      const header = columnById.get(column.id)?.header ?? column.id;
                      const visible = column.getIsVisible();
                      const lastVisible =
                        visible && hideable.filter((item) => item.getIsVisible()).length <= 1;
                      return (
                        <li key={column.id}>
                          <label className="flex items-center gap-2 rounded-xs px-1 py-1.5 text-[13px] text-text-2">
                            <Checkbox
                              checked={visible}
                              disabled={lastVisible}
                              onCheckedChange={(checked) =>
                                column.toggleVisibility(checked === true)
                              }
                            />
                            {header}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </PopupContent>
              </Popup>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[960px] border-collapse text-left text-[13px]"
          style={{ minWidth: 960 }}
        >
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="border-b border-border bg-muted text-text-2">
                {group.headers.map((header) => {
                  const source = columnById.get(header.column.id);
                  const width =
                    header.column.id === "_select"
                      ? "2.75rem"
                      : header.column.id === "_actions"
                        ? "4.5rem"
                        : source?.width;
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      style={width ? { width } : undefined}
                      aria-sort={
                        header.column.getIsSorted() === "asc"
                          ? "ascending"
                          : header.column.getIsSorted() === "desc"
                            ? "descending"
                            : undefined
                      }
                      className={cn(
                        "px-3 py-2 font-medium",
                        source?.align === "right" && "text-right",
                        header.column.id === "_actions" && "text-right",
                      )}
                    >
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="px-3 py-8 text-center text-text-3"
                >
                  {rows.length === 0 ? (
                    empty
                  ) : (
                    <span className="inline-flex flex-wrap items-center justify-center gap-2">
                      No rows match these filters.
                      <Button
                        variant="text"
                        size="sm"
                        className="h-auto py-0"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </Button>
                    </span>
                  )}
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr
                  key={row.id}
                  aria-selected={selectable ? row.getIsSelected() : undefined}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]",
                    row.getIsSelected() && "bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]",
                    details && "cursor-pointer",
                  )}
                  onClick={
                    details
                      ? (event) => {
                          const target = event.target;
                          if (
                            target instanceof Element &&
                            target.closest("button, a, input, label, [role='menu']")
                          ) {
                            return;
                          }
                          openDetails(row.original);
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => {
                    const source = columnById.get(cell.column.id);
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-3 py-2 text-text-2",
                          source?.align === "right" && "text-right",
                          cell.column.id === "_actions" && "text-right",
                        )}
                      >
                        <table.FlexRender cell={cell} />
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 border-t border-border px-3 py-2 text-[12px] text-text-3">
        {filtering && filteredCount > 0 ? (
          <Button variant="text" size="sm" className="mr-auto h-auto py-0" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : null}
        <p role="status" className="flex flex-wrap gap-x-6 gap-y-1">
          {selectable ? (
            <span>
              {selectedCount} of {filteredCount} {rowWord(filteredCount)} selected.
            </span>
          ) : null}
          <span>
            Rows: <span className="font-medium text-heading">{filteredCount}</span>
          </span>
          <span>
            Total rows: <span className="font-medium text-heading">{rows.length}</span>
          </span>
          {paginated ? (
            <span>
              {filteredCount === 0 ? "Showing 0 of 0" : `Showing ${from}–${to} of ${filteredCount}`}
            </span>
          ) : null}
        </p>
        {paginated ? (
          <div className="flex flex-wrap items-center gap-2">
            {pageSizeOptions && pageSizeOptions.length > 0 ? (
              <label htmlFor={pageSizeId} className="flex items-center gap-2">
                Rows per page
                <span className="w-20">
                  <Select
                    id={pageSizeId}
                    fieldSize="sm"
                    aria-label="Rows per page"
                    value={String(table.state.pagination.pageSize)}
                    onValueChange={(value) => table.setPageSize(Number(value))}
                    options={(pageSizeOptions.includes(table.state.pagination.pageSize)
                      ? pageSizeOptions
                      : [table.state.pagination.pageSize, ...pageSizeOptions]
                    ).map((option) => ({
                      label: String(option),
                      value: String(option),
                    }))}
                  />
                </span>
              </label>
            ) : null}
            {pages > 1 ? (
              <div className="flex items-center gap-1">
                <Button
                  icon
                  size="sm"
                  color="white"
                  aria-label="First page"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.firstPage()}
                >
                  <ChevronsLeft />
                </Button>
                <Pagination
                  page={pageIndex + 1}
                  pages={pages}
                  onPageChange={(page) => table.setPageIndex(page - 1)}
                />
                <Button
                  icon
                  size="sm"
                  color="white"
                  aria-label="Last page"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.lastPage()}
                >
                  <ChevronsRight />
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {details ? (
        <Drawer
          open={detailRow != null}
          onOpenChange={(open) => {
            if (!open) setDetailKey(null);
          }}
          title={detailRow ? (detailsTitle?.(detailRow) ?? "Details") : "Details"}
          description={detailRow ? detailsDescription?.(detailRow) : undefined}
        >
          {detailRow ? details(detailRow) : null}
        </Drawer>
      ) : null}
    </div>
  );
}
