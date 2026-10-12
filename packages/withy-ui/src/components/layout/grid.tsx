import { cn } from "../../lib/cn";
import { gaps, type Gap } from "./spacing";

const tracks = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 xl:grid-cols-6",
  12: "grid-cols-12",
} as const;

export type GridColumns = keyof typeof tracks;

const spans = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
} as const;

const collapsedSpans = {
  1: "col-span-12 md:col-span-1",
  2: "col-span-12 md:col-span-2",
  3: "col-span-12 md:col-span-3",
  4: "col-span-12 md:col-span-4",
  5: "col-span-12 md:col-span-5",
  6: "col-span-12 md:col-span-6",
  7: "col-span-12 md:col-span-7",
  8: "col-span-12 md:col-span-8",
  9: "col-span-12 md:col-span-9",
  10: "col-span-12 md:col-span-10",
  11: "col-span-12 md:col-span-11",
  12: "col-span-12",
} as const;

export type ColumnSpan = keyof typeof spans;

export function Grid({
  columns = 2,
  gap = "md",
  className,
  children,
}: {
  columns?: GridColumns;
  gap?: Gap;
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn("grid", tracks[columns], gaps[gap], className)}>{children}</div>;
}

export function Columns({
  gap = "md",
  className,
  children,
}: {
  gap?: Gap;
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={cn("grid grid-cols-12", gaps[gap], className)}>{children}</div>;
}

export function Column({
  span = 12,
  collapse = true,
  className,
  children,
}: {
  span?: ColumnSpan;
  collapse?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn(collapse ? collapsedSpans[span] : spans[span], "min-w-0", className)}>
      {children}
    </div>
  );
}
