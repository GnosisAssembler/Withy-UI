import { ArrowDown, ArrowUp } from "lucide-react";
import { Figure } from "../atoms/figure";
import { Sparkline } from "../atoms/sparkline";
import { Text } from "../atoms/text";
import { cn } from "../../lib/cn";
import { kpiFrame, kpiGrid, kpiTone, type KpiChange } from "./kpi";

export type SparkKpiItem = {
  label: string;
  /** Short code shown after the label, such as a ticker. */
  symbol?: string;
  value: string;
  /** Absolute change, already formatted, such as "-9.85". */
  change: string;
  /** Percent change, already formatted, such as "-1.9%". */
  changePercent: string;
  direction: KpiChange["direction"];
  /** Color of the value and the trend. Defaults from the direction. */
  tone?: KpiChange["tone"];
  data: number[];
};

export type SparkKpiProps = {
  /** Accessible name of the group. */
  label: string;
  items: readonly SparkKpiItem[];
  className?: string;
};

const toneClass = {
  success: "text-success",
  danger: "text-danger",
} as const;

function SparkCard({ item }: { item: SparkKpiItem }) {
  const tone = kpiTone({ value: item.change, direction: item.direction, tone: item.tone });
  const Icon = item.direction === "up" ? ArrowUp : ArrowDown;
  const direction = item.direction === "up" ? "Increased" : "Decreased";

  return (
    <div className={kpiFrame("px-5 py-4")}>
      <dt>
        <Text as="span" size="sm" weight="medium" tone="heading">
          {item.label}
          {item.symbol ? (
            <Text as="span" size="sm" tone="secondary">
              {" "}
              ({item.symbol})
            </Text>
          ) : null}
        </Text>
      </dt>
      <dd className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <Figure as="span" className={toneClass[tone]}>
          {item.value}
        </Figure>
        <span className="inline-flex items-center gap-1 text-[13px]">
          <span className="font-medium text-heading">{item.change}</span>
          <span className={cn("inline-flex items-center gap-0.5", toneClass[tone])}>
            <Icon className="size-3.5 shrink-0" aria-hidden />
            <span className="sr-only">{direction} </span>({item.changePercent})
          </span>
        </span>
      </dd>
      {item.data.length > 0 ? (
        <dd>
          <Sparkline
            className="mt-4 h-10"
            data={item.data}
            color={tone === "success" ? "var(--success)" : "var(--danger)"}
            label={`${item.label} trend`}
          />
        </dd>
      ) : null}
    </div>
  );
}

export function SparkKpi({ label, items, className }: SparkKpiProps) {
  return (
    <dl aria-label={label} className={cn(kpiGrid(), className)}>
      {items.map((item, index) => (
        <SparkCard key={`${item.label}-${index}`} item={item} />
      ))}
    </dl>
  );
}
