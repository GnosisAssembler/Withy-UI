import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Figure } from "../atoms/figure";
import { Link } from "../atoms/link";
import { Text } from "../atoms/text";
import { KpiDelta, kpiFrame, kpiGrid, viewLabel, type KpiChange } from "./kpi";

export type IconStatItem = {
  label: string;
  value: string;
  /** Decorative icon. The label names the metric. */
  icon: ReactNode;
  change?: KpiChange;
  href?: string;
  /** Footer link text. Defaults to "View {label}". */
  action?: string;
};

export type IconStatsProps = {
  /** Accessible name of the group. */
  label: string;
  items: readonly IconStatItem[];
  className?: string;
};

function IconStat({ item }: { item: IconStatItem }) {
  return (
    <div className={kpiFrame("px-5 py-4")}>
      <dt className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground [&_svg]:size-5"
        >
          {item.icon}
        </span>
        <Text as="span" size="sm" weight="medium" tone="secondary" className="min-w-0 truncate">
          {item.label}
        </Text>
      </dt>
      <dd>
        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <Figure as="span">{item.value}</Figure>
          {item.change ? <KpiDelta change={item.change} /> : null}
        </div>
        {item.href ? (
          <div className="-mx-5 mt-4 -mb-4 flex justify-end border-t border-border px-5 py-3">
            <Link href={item.href} className="inline-flex items-center gap-1 text-[13px]">
              {viewLabel(item.label, item.action)}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        ) : null}
      </dd>
    </div>
  );
}

export function IconStats({ label, items, className }: IconStatsProps) {
  return (
    <dl aria-label={label} className={kpiGrid(className)}>
      {items.map((item, index) => (
        <IconStat key={`${item.label}-${index}`} item={item} />
      ))}
    </dl>
  );
}
