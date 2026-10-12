import { ArrowUpRight } from "lucide-react";
import { Figure } from "../atoms/figure";
import { Progress } from "../atoms/progress";
import { Text } from "../atoms/text";
import { WithyLink } from "../theme/withy-routing";
import { CategoryBar } from "./category-bar";
import { chartColorAt, chartFillClass, chartValue, type ChartColor } from "../../lib/chart-theme";
import { cn } from "../../lib/cn";
import { clampPercent, kpiFrame } from "./kpi";

export type SplitPart = {
  label: string;
  /** Already formatted, such as "136" or "$100.5K". */
  value: string;
  /** Share used to size the bar. */
  amount: number;
  color?: ChartColor;
  href?: string;
};

export type SplitCard = {
  label: string;
  total: string;
  parts: readonly SplitPart[];
};

export type SplitKpiProps = {
  /** Accessible name of the group. */
  label: string;
  items: readonly SplitCard[];
  /** legend: one bar and a swatch list. rows: a progress bar for each part. */
  layout?: "legend" | "rows";
  className?: string;
};

export type ChannelSplitProps = {
  label: string;
  total: string;
  /** Heading above the bar. */
  distributionLabel?: string;
  parts: readonly SplitPart[];
  className?: string;
};

function shares(parts: readonly SplitPart[]) {
  const total = parts.reduce((sum, part) => sum + chartValue(part.amount), 0);
  return parts.map((part, index) => {
    const amount = chartValue(part.amount);
    const percent = total === 0 ? 0 : (amount / total) * 100;
    return {
      ...part,
      index,
      color: chartColorAt(index, part.color),
      percent,
    };
  });
}

function formatShare(percent: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(percent);
}

function partValue(parts: readonly SplitPart[]) {
  return (amount: number) => parts.find((part) => part.amount === amount)?.value ?? String(amount);
}

function SplitCardView({ item, layout }: { item: SplitCard; layout: "legend" | "rows" }) {
  const parts = shares(item.parts);

  return (
    <div className={kpiFrame("px-5 py-4")}>
      <dt>
        <Text as="span" size="sm" tone="secondary">
          {item.label}
        </Text>
      </dt>
      <dd>
        <Figure className="mt-1">{item.total}</Figure>
      </dd>
      {layout === "legend" ? (
        <dd className="mt-4">
          <CategoryBar
            label={`${item.label} breakdown`}
            segments={parts.map((part) => ({
              name: part.label,
              value: part.amount,
              color: part.color,
            }))}
            legend={false}
            valueFormatter={partValue(item.parts)}
          />
          <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            {parts.map((part) => (
              <li key={`${part.label}-${part.index}`} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn("size-2.5 shrink-0 rounded-xs", chartFillClass[part.color])}
                />
                <Text as="span" size="sm" tone="secondary">
                  <span className="font-medium text-heading">{part.value}</span> {part.label}
                </Text>
              </li>
            ))}
          </ul>
        </dd>
      ) : (
        <dd className="mt-4 flex flex-col gap-3">
          {parts.map((part) => (
            <div
              key={`${part.label}-${part.index}`}
              className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3"
            >
              <p className="flex shrink-0 items-center justify-between gap-2 text-[13px] lg:w-5/12">
                <span className="truncate text-text-2">{part.label}</span>
                <span className="font-medium whitespace-nowrap text-heading">
                  {part.value}{" "}
                  <span className="font-normal text-text-3">({formatShare(part.percent)}%)</span>
                </span>
              </p>
              <Progress
                value={clampPercent(part.percent)}
                aria-label={`${part.label} share`}
                className="min-w-0 flex-1"
              />
            </div>
          ))}
        </dd>
      )}
    </div>
  );
}

export function SplitKpi({ label, items, layout = "legend", className }: SplitKpiProps) {
  return (
    <dl aria-label={label} className={cn("grid grid-cols-1 gap-2.5 md:grid-cols-2", className)}>
      {items.map((item, index) => (
        <SplitCardView key={`${item.label}-${index}`} item={item} layout={layout} />
      ))}
    </dl>
  );
}

function ChannelCard({ part }: { part: ReturnType<typeof shares>[number] }) {
  const body = (
    <>
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn("size-2.5 shrink-0 rounded-xs", chartFillClass[part.color])}
        />
        <Text as="span" size="sm" tone="secondary">
          {part.label}
        </Text>
      </span>
      <Text as="span" size="sm" tone="heading" className="mt-1 block">
        <span className="font-medium">{formatShare(part.percent)}%</span>
        <span className="text-text-3"> · </span>
        {part.value}
      </Text>
      {part.href ? (
        <ArrowUpRight aria-hidden className="absolute top-2 right-2 size-4 text-text-3" />
      ) : null}
    </>
  );
  const className = kpiFrame("relative block px-3 py-2");

  return (
    <li>
      {part.href ? (
        <WithyLink
          href={part.href}
          className={cn(
            className,
            "outline-none hover:bg-[color-mix(in_srgb,var(--heading)_4%,var(--card))] focus-visible:ring-4 focus-visible:ring-primary/25",
          )}
        >
          {body}
        </WithyLink>
      ) : (
        <div className={className}>{body}</div>
      )}
    </li>
  );
}

export function ChannelSplit({
  label,
  total,
  distributionLabel = "Distribution",
  parts,
  className,
}: ChannelSplitProps) {
  const rows = shares(parts);

  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[13px] text-text-2">{label}</p>
      <Figure className="mt-1">{total}</Figure>
      <p className="mt-4 text-[13px] text-text-2">{distributionLabel}</p>
      <CategoryBar
        className="mt-4"
        label={distributionLabel}
        segments={rows.map((part) => ({ name: part.label, value: part.amount, color: part.color }))}
        legend={false}
        valueFormatter={partValue(parts)}
      />
      <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {rows.map((part) => (
          <ChannelCard key={`${part.label}-${part.index}`} part={part} />
        ))}
      </ul>
    </div>
  );
}
