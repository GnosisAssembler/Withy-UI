import { ArrowRight } from "lucide-react";
import { Figure } from "../atoms/figure";
import { Link } from "../atoms/link";
import { Text } from "../atoms/text";
import type { ChartColor } from "../../lib/chart-theme";
import { cn } from "../../lib/cn";
import { KpiDelta, kpiFrame, kpiGrid, viewLabel, type KpiChange } from "./kpi";

export type { KpiChange, KpiDirection, KpiTone } from "./kpi";

export type KpiItem = {
  label: string;
  value: string;
  change?: KpiChange;
  /** Earlier figure, shown as "from {previous}". */
  previous?: string;
  /** Quiet text after the change, such as "from the previous month". */
  hint?: string;
  href?: string;
  /** Footer link text. Defaults to "View {label}". */
  action?: string;
  /** Rail color for the accent variant. Use a category color, or a status color when the metric is a status. */
  accent?: ChartColor;
};

export type KpiVariant =
  "inline" | "badge" | "stacked" | "linked" | "comparison" | "delta" | "accent";

export type KpiCardsProps = {
  /** Accessible name of the group. */
  label: string;
  items: readonly KpiItem[];
  /**
   * inline: label, then the value beside the change.
   * badge: label beside a change badge, value below.
   * stacked: value beside the change, label below.
   * linked: label beside the change, value, then a footer link.
   * comparison: label beside the change, value beside the previous figure.
   * delta: value beside the previous figure, then the change and a hint.
   * accent: a color rail, the label beside the change, then the value.
   */
  variant?: KpiVariant;
  className?: string;
};

function Previous({ value }: { value: string }) {
  return (
    <Text as="span" size="sm" tone="muted">
      from {value}
    </Text>
  );
}

function LinkedFooter({ item }: { item: KpiItem }) {
  if (!item.href) return null;
  return (
    <div className="-mx-5 mt-4 -mb-4 flex justify-end border-t border-border px-5 py-3">
      <Link href={item.href} className="inline-flex items-center gap-1 text-[13px]">
        {viewLabel(item.label, item.action)}
        <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  );
}

function KpiCard({ item, variant }: { item: KpiItem; variant: KpiVariant }) {
  const frame = cn(
    kpiFrame(),
    "px-5 py-4",
    variant === "accent" && "border-l-4",
    variant === "stacked" && "flex flex-col",
  );
  const accent =
    variant === "accent"
      ? ({ borderLeftColor: `var(--${item.accent ?? "primary"})` } as const)
      : undefined;

  if (variant === "badge") {
    return (
      <div className={frame}>
        <dt className="flex items-center justify-between gap-3">
          <Text as="span" size="sm" weight="medium" tone="secondary" className="min-w-0 truncate">
            {item.label}
          </Text>
          {item.change ? <KpiDelta change={item.change} badge /> : null}
        </dt>
        <dd className="mt-2 flex flex-wrap items-baseline gap-2">
          <Figure as="span">{item.value}</Figure>
          {item.previous ? <Previous value={item.previous} /> : null}
        </dd>
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={frame}>
        {/* The label stays first for assistive tech. Order shows the figure above it. */}
        <dt className="order-2 mt-1">
          <Text as="span" size="sm" tone="secondary">
            {item.label}
          </Text>
        </dt>
        <dd className="order-1 flex items-start justify-between gap-2">
          <Figure as="span">{item.value}</Figure>
          {item.change ? <KpiDelta change={item.change} /> : null}
        </dd>
      </div>
    );
  }

  if (variant === "linked") {
    return (
      <div className={frame}>
        <dt className="flex items-start justify-between gap-2">
          <Text as="span" size="sm" tone="secondary" className="min-w-0 truncate">
            {item.label}
          </Text>
          {item.change ? <KpiDelta change={item.change} /> : null}
        </dt>
        <dd>
          <Figure className="mt-1">{item.value}</Figure>
          <LinkedFooter item={item} />
        </dd>
      </div>
    );
  }

  if (variant === "comparison") {
    return (
      <div className={frame}>
        <dt className="flex items-center justify-between gap-3">
          <Text as="span" size="sm" weight="medium" tone="secondary" className="min-w-0 truncate">
            {item.label}
          </Text>
          {item.change ? <KpiDelta change={item.change} /> : null}
        </dt>
        <dd className="mt-1 flex flex-wrap items-baseline gap-2">
          <Figure as="span">{item.value}</Figure>
          {item.previous ? <Previous value={item.previous} /> : null}
        </dd>
      </div>
    );
  }

  if (variant === "delta") {
    return (
      <div className={frame}>
        <dt>
          <Text as="span" size="sm" weight="medium" tone="secondary">
            {item.label}
          </Text>
        </dt>
        <dd className="mt-1 flex flex-wrap items-baseline gap-2">
          <Figure as="span">{item.value}</Figure>
          {item.previous ? <Previous value={item.previous} /> : null}
        </dd>
        {item.change ? (
          <dd className="mt-4">
            <KpiDelta change={item.change} hint={item.hint} />
          </dd>
        ) : null}
      </div>
    );
  }

  return (
    <div className={frame} style={accent}>
      <dt className="flex items-center justify-between gap-3">
        <Text as="span" size="sm" weight="medium" tone="secondary" className="min-w-0 truncate">
          {item.label}
        </Text>
        {variant === "accent" && item.change ? <KpiDelta change={item.change} /> : null}
      </dt>
      <dd className="mt-2 flex flex-wrap items-baseline gap-2">
        <Figure as="span">{item.value}</Figure>
        {variant === "inline" && item.change ? <KpiDelta change={item.change} /> : null}
      </dd>
    </div>
  );
}

export function KpiCards({ label, items, variant = "inline", className }: KpiCardsProps) {
  return (
    <dl aria-label={label} className={kpiGrid(className)}>
      {items.map((item, index) => (
        <KpiCard key={`${item.label}-${index}`} item={item} variant={variant} />
      ))}
    </dl>
  );
}
