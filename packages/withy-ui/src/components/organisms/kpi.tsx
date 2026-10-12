import { ArrowDown, ArrowUp } from "lucide-react";
import { Badge } from "../atoms/badge";
import { cn } from "../../lib/cn";

export type KpiDirection = "up" | "down";
export type KpiTone = "success" | "danger";

export type KpiChange = {
  /** Already formatted, such as "+12.1%". */
  value: string;
  direction: KpiDirection;
  /**
   * Color of the change. Defaults to success when the direction is up, and danger when it is down.
   * Set this when a rise is a problem, such as a higher bounce rate.
   */
  tone?: KpiTone;
};

const toneClass = {
  success: "text-success",
  danger: "text-danger",
} as const;

export function kpiTone(change: KpiChange): KpiTone {
  return change.tone ?? (change.direction === "up" ? "success" : "danger");
}

export function kpiFrame(className?: string) {
  return cn(
    "min-w-0 overflow-hidden rounded-sm border border-border bg-card text-card-foreground shadow-elevation",
    className,
  );
}

export function kpiGrid(className?: string) {
  return cn("grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3", className);
}

export function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/** Link text for a metric. Keeps a leading acronym, such as SEO, as written. */
export function viewLabel(label: string, action?: string) {
  if (action) return action;
  const second = label.charAt(1);
  const acronym = second !== second.toLowerCase() && second === second.toUpperCase();
  const sentence = acronym ? label : `${label.charAt(0).toLowerCase()}${label.slice(1)}`;
  return `View ${sentence}`;
}

export function KpiDelta({
  change,
  hint,
  badge = false,
}: {
  change: KpiChange;
  hint?: string;
  badge?: boolean;
}) {
  const tone = kpiTone(change);
  const Icon = change.direction === "up" ? ArrowUp : ArrowDown;
  const direction = change.direction === "up" ? "Increased" : "Decreased";

  const mark = badge ? (
    <Badge variant="muted" color={tone} shape="pill" className="shrink-0 gap-0.5 px-1.5">
      <Icon className="size-3" aria-hidden />
      <span className="sr-only">{direction} </span>
      {change.value}
    </Badge>
  ) : (
    <span
      className={cn("inline-flex items-center gap-0.5 text-[13px] font-medium", toneClass[tone])}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      <span className="sr-only">{direction} </span>
      {change.value}
    </span>
  );

  if (!hint) return mark;

  return (
    <span className="inline-flex items-baseline gap-2">
      {mark}
      <span className="text-[13px] text-text-3">{hint}</span>
    </span>
  );
}
