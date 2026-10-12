import { Check, ChevronRight, Eye, TriangleAlert } from "lucide-react";
import { Badge } from "../atoms/badge";
import { Figure } from "../atoms/figure";
import { Text } from "../atoms/text";
import { WithyLink } from "../theme/withy-routing";
import { cn } from "../../lib/cn";
import { kpiFrame, kpiGrid } from "./kpi";

export type KpiStatus = "within" | "observe" | "critical";

export type StatusKpiItem = {
  label: string;
  value: string;
  status: KpiStatus;
  /** Shown after the status name, such as "200–410". */
  detail?: string;
  /** Such as "3 of 5 goals". Shows a status row instead of a chip. */
  goals?: string;
  href?: string;
};

export type StatusKpiProps = {
  /** Accessible name of the group. */
  label: string;
  items: readonly StatusKpiItem[];
  className?: string;
};

const statusLabel: Record<KpiStatus, string> = {
  within: "Within",
  observe: "Observe",
  critical: "Critical",
};

const statusBadge = {
  within: "success",
  observe: "warning",
  critical: "danger",
} as const;

const statusText = {
  within: "text-success",
  observe: "text-warning",
  critical: "text-danger",
} as const;

const statusFill = {
  within: "bg-success text-success-foreground",
  observe: "bg-warning text-warning-foreground",
  critical: "bg-danger text-danger-foreground",
} as const;

const statusIcon = {
  within: Check,
  observe: Eye,
  critical: TriangleAlert,
} as const;

function StatusChip({ item }: { item: StatusKpiItem }) {
  const Icon = statusIcon[item.status];
  const name = item.detail
    ? `${statusLabel[item.status]}: ${item.detail}`
    : statusLabel[item.status];
  return (
    <Badge
      variant="muted"
      color={statusBadge[item.status]}
      shape="pill"
      className="mt-4 gap-1 px-2 text-[13px]"
    >
      <Icon className="size-3.5" aria-hidden />
      {name}
    </Badge>
  );
}

function GoalsRow({ item }: { item: StatusKpiItem }) {
  const Icon = statusIcon[item.status];
  const body = (
    <>
      <span
        aria-hidden
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-sm",
          statusFill[item.status],
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <Text as="span" size="sm" tone="secondary" className="block">
          {item.goals}
        </Text>
        <Text as="span" size="sm" weight="medium" className={cn("block", statusText[item.status])}>
          {statusLabel[item.status]}
        </Text>
      </span>
      {item.href ? <ChevronRight aria-hidden className="size-4 shrink-0 text-text-3" /> : null}
    </>
  );
  const className =
    "mt-4 flex items-center gap-3 rounded-sm bg-muted px-2 py-2 outline-none focus-visible:ring-4 focus-visible:ring-primary/25";

  if (!item.href) return <div className={className}>{body}</div>;

  return (
    <WithyLink
      href={item.href}
      className={cn(className, "hover:bg-[color-mix(in_srgb,var(--heading)_6%,var(--muted))]")}
    >
      {body}
    </WithyLink>
  );
}

function StatusCard({ item }: { item: StatusKpiItem }) {
  return (
    <div className={kpiFrame("px-5 py-4")}>
      <dt>
        <Text as="span" size="sm" weight="medium" tone="secondary">
          {item.label}
        </Text>
      </dt>
      <dd>
        <Figure className="mt-1">{item.value}</Figure>
        {item.goals ? <GoalsRow item={item} /> : <StatusChip item={item} />}
      </dd>
    </div>
  );
}

export function StatusKpi({ label, items, className }: StatusKpiProps) {
  return (
    <dl aria-label={label} className={kpiGrid(className)}>
      {items.map((item, index) => (
        <StatusCard key={`${item.label}-${index}`} item={item} />
      ))}
    </dl>
  );
}
