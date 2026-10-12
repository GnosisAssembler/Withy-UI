import { Figure } from "../atoms/figure";
import { Text } from "../atoms/text";
import { cn } from "../../lib/cn";
import { kpiFrame } from "./kpi";

export type StatStripItem = {
  label: string;
  value: string;
  /** Shown as "from {previous}". */
  previous?: string;
  /** Quiet unit after the value, such as "mins". */
  unit?: string;
};

export type StatStripColumns = 1 | 2 | 3 | 4;

export type StatStripProps = {
  /** Accessible name of the group. */
  label: string;
  items: readonly StatStripItem[];
  /** Columns from the large breakpoint. Fewer columns are used on a narrow screen. */
  columns?: StatStripColumns;
  className?: string;
};

const columnClass: Record<StatStripColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

function defaultColumns(count: number): StatStripColumns {
  if (count >= 4) return 4;
  if (count === 3) return 3;
  if (count === 2) return 2;
  return 1;
}

function cellBorders(index: number, columns: StatStripColumns) {
  if (columns === 1) return index > 0 ? "border-t border-border" : undefined;
  if (columns === 2) {
    return cn(
      index > 0 && "max-sm:border-t max-sm:border-border",
      index % 2 === 1 && "sm:border-l sm:border-border",
      index >= 2 && "sm:border-t sm:border-border",
    );
  }

  return cn(
    index > 0 && "max-sm:border-t max-sm:border-border",
    index % 2 === 1 && "sm:max-lg:border-l sm:max-lg:border-border",
    index >= 2 && "sm:max-lg:border-t sm:max-lg:border-border",
    index % columns !== 0 && "lg:border-l lg:border-border",
    index >= columns && "lg:border-t lg:border-border",
  );
}

export function StatStrip({ label, items, columns, className }: StatStripProps) {
  const count = columns ?? defaultColumns(items.length);

  return (
    <dl aria-label={label} className={cn(kpiFrame(), "grid", columnClass[count], className)}>
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className={cn("min-w-0 px-5 py-4", cellBorders(index, count))}
        >
          <dt>
            <Text as="span" size="sm" weight="medium" tone="secondary">
              {item.label}
            </Text>
          </dt>
          <dd className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <Figure as="span">{item.value}</Figure>
            {item.unit ? (
              <Text as="span" size="sm" tone="muted">
                {item.unit}
              </Text>
            ) : null}
            {item.previous ? (
              <Text as="span" size="sm" tone="muted">
                from {item.previous}
              </Text>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
