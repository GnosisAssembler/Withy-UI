import { ArrowRight } from "lucide-react";
import { Figure } from "../atoms/figure";
import { Link } from "../atoms/link";
import { Progress } from "../atoms/progress";
import { Text } from "../atoms/text";
import { cn } from "../../lib/cn";
import { clampPercent, kpiFrame, kpiGrid, viewLabel } from "./kpi";

export type UsageTone = "primary" | "success" | "warning" | "danger";

export type UsageItem = {
  label: string;
  /** Share used, from 0 to 100. A score uses the same range. */
  value: number;
  /** Amount used, already formatted. */
  current?: string;
  /** Amount allowed, already formatted. */
  limit?: string;
  href?: string;
  /** Footer link text for the budget variant. Defaults to "View {label}". */
  action?: string;
  /** Bar and ring color. A score picks danger, warning, or success from the value when this is omitted. */
  tone?: UsageTone;
};

export type UsageBand = {
  label: string;
  tone: Exclude<UsageTone, "primary">;
};

export type UsageMetersProps = {
  /** Accessible name of the group. */
  label: string;
  items: readonly UsageItem[];
  /** bar: a progress bar. ring: a circle beside the label. budget: a circle with a footer link. score: a figure out of 100. */
  variant?: "bar" | "ring" | "budget" | "score";
  title?: string;
  titleAs?: "h2" | "h3";
  description?: string;
  action?: { label: string; href: string; external?: boolean };
  /** Score legend. Defaults to 0–50, 50–75, and 75–100. */
  bands?: readonly UsageBand[];
  className?: string;
};

const toneText: Record<UsageTone, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const bandFill: Record<UsageBand["tone"], string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const defaultBands: readonly UsageBand[] = [
  { label: "0–50", tone: "danger" },
  { label: "50–75", tone: "warning" },
  { label: "75–100", tone: "success" },
];

function scoreTone(value: number): Exclude<UsageTone, "primary"> {
  if (value >= 75) return "success";
  if (value >= 50) return "warning";
  return "danger";
}

function precisePercent(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(clampPercent(value));
}

function MeterRing({
  value,
  tone,
  label,
  center,
  valueText,
}: {
  value: number;
  tone: UsageTone;
  label: string;
  center: string;
  valueText: string;
}) {
  const amount = clampPercent(value);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dash = (amount / 100) * circumference;

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(amount)}
      aria-valuetext={valueText}
      className="relative size-12 shrink-0 self-center"
    >
      <svg viewBox="0 0 48 48" className={cn("size-12 -rotate-90", toneText[tone])} aria-hidden>
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="4"
          stroke="color-mix(in srgb, var(--heading) 12%, transparent)"
        />
        {amount > 0 ? (
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        ) : null}
      </svg>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-inter text-[10px] font-medium text-heading"
      >
        {center}
      </span>
    </div>
  );
}

function Amount({
  current,
  limit,
  join,
}: {
  current?: string;
  limit?: string;
  join: "of" | "slash";
}) {
  if (!current && !limit) return null;
  const text =
    current && limit
      ? join === "slash"
        ? `${current} / ${limit}`
        : `${current} of ${limit}`
      : (current ?? limit);
  return (
    <Text as="span" size="sm" tone="muted">
      {text}
    </Text>
  );
}

function BudgetLink({ item }: { item: UsageItem }) {
  if (!item.href) return null;
  return (
    <dd className="col-span-2 row-start-3 -mx-5 mt-4 flex justify-end border-t border-border px-5 py-3">
      <Link href={item.href} className="inline-flex items-center gap-1 text-[13px]">
        {viewLabel(item.label, item.action)}
        <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </dd>
  );
}

function UsageCard({
  item,
  variant,
}: {
  item: UsageItem;
  variant: NonNullable<UsageMetersProps["variant"]>;
}) {
  const tone = item.tone ?? (variant === "score" ? scoreTone(item.value) : "primary");
  const rounded = Math.round(clampPercent(item.value));

  if (variant === "bar") {
    return (
      <div className={kpiFrame("px-5 py-4")}>
        <dt>
          <Text as="span" size="sm" tone="secondary">
            {item.label}
          </Text>
        </dt>
        <dd>
          {item.current ? <Figure className="mt-1">{item.current}</Figure> : null}
          <Progress
            className="mt-4"
            value={item.value}
            color={tone}
            aria-label={`${item.label} used`}
          />
          <p className="mt-2 flex items-center justify-between gap-3 text-[13px]">
            <span className={cn("font-medium", toneText[tone])}>{precisePercent(item.value)}%</span>
            {item.current && item.limit ? (
              <span className="text-text-3">
                {item.current} of {item.limit}
              </span>
            ) : null}
          </p>
        </dd>
      </div>
    );
  }

  if (variant === "score") {
    return (
      <div className={kpiFrame("px-5 py-4")}>
        <dt>
          <Text as="span" size="sm" tone="secondary">
            {item.label}
          </Text>
        </dt>
        <dd className="mt-3 flex items-center justify-between gap-3">
          <p className="flex items-baseline gap-1">
            <Figure as="span">{rounded}</Figure>
            <Text as="span" size="sm" tone="muted">
              /100
            </Text>
          </p>
          <MeterRing
            value={item.value}
            tone={tone}
            label={`${item.label} score`}
            center={String(rounded)}
            valueText={`${rounded} out of 100`}
          />
        </dd>
      </div>
    );
  }

  const ring = (
    <MeterRing
      value={item.value}
      tone={tone}
      label={`${item.label} used`}
      center={`${rounded}%`}
      valueText={`${rounded}%`}
    />
  );

  if (variant === "budget") {
    return (
      <div
        className={kpiFrame(
          cn("grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-5 pt-4", item.href ? undefined : "pb-4"),
        )}
      >
        <dt className="col-start-2 row-start-2 self-start">
          <Text as="span" size="sm" tone="secondary">
            {item.label}
          </Text>
        </dt>
        <dd className="col-start-1 row-span-2 row-start-1 flex items-center">{ring}</dd>
        <dd className="col-start-2 row-start-1 self-end">
          <Text as="span" size="sm" weight="medium" tone="heading">
            {item.current && item.limit
              ? `${item.current} / ${item.limit}`
              : (item.current ?? item.limit)}
          </Text>
        </dd>
        <BudgetLink item={item} />
      </div>
    );
  }

  return (
    <div className={kpiFrame("flex items-center gap-3 px-5 py-4")}>
      <dt className="order-2 min-w-0 flex-1">
        <Text as="span" size="sm" weight="medium" tone="heading" className="block truncate">
          {item.label}
        </Text>
        {item.current && item.limit ? (
          <Text as="span" size="sm" tone="muted" className="mt-1 block">
            {item.current} of {item.limit} used
          </Text>
        ) : (
          <span className="mt-1 block">
            <Amount current={item.current} limit={item.limit} join="of" />
          </span>
        )}
      </dt>
      {/* The label stays first for assistive tech. Order places the ring on the left. */}
      <dd className="order-1">{ring}</dd>
    </div>
  );
}

export function UsageMeters({
  label,
  items,
  variant = "bar",
  title,
  titleAs = "h2",
  description,
  action,
  bands = defaultBands,
  className,
}: UsageMetersProps) {
  const HeadingTag = titleAs;
  const showIntro = title || description || action || variant === "score";

  return (
    <div className={className}>
      {showIntro ? (
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {title ? (
              <HeadingTag className="text-[15px] font-medium text-heading">{title}</HeadingTag>
            ) : null}
            {description || action ? (
              <Text tone="muted" size="sm" className={title ? "mt-1" : undefined}>
                {description ? `${description} ` : null}
                {action ? (
                  <Link href={action.href} external={action.external} className="text-[13px]">
                    {action.label}
                  </Link>
                ) : null}
              </Text>
            ) : null}
          </div>
          {variant === "score" ? (
            <ul
              aria-label="Score bands"
              className="flex w-full flex-wrap items-center justify-center gap-4 rounded-sm border border-border px-3 py-2 sm:w-auto sm:justify-start"
            >
              {bands.map((band) => (
                <li
                  key={band.label}
                  className="inline-flex items-center gap-1.5 text-[11px] text-heading"
                >
                  <span aria-hidden className={cn("size-2.5 rounded-xs", bandFill[band.tone])} />
                  {band.label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      <dl aria-label={label} className={kpiGrid()}>
        {items.map((item, index) => (
          <UsageCard key={`${item.label}-${index}`} item={item} variant={variant} />
        ))}
      </dl>
    </div>
  );
}
