import { Eyebrow } from "../atoms/eyebrow";
import { Figure } from "../atoms/figure";
import { Text } from "../atoms/text";
import { WithyLink } from "../theme/withy-routing";
import { cn } from "../../lib/cn";
import { kpiFrame, kpiGrid } from "./kpi";

export type ShareRow = {
  label: string;
  /** Already formatted, such as "25.5%". */
  share: string;
  detail: string;
  href?: string;
};

export type ShareCardItem = {
  label: string;
  value: string;
  /** Quiet unit after the value, such as "bpm". */
  unit?: string;
  /** Column name above the share. */
  shareLabel?: string;
  /** Column name above the detail. */
  detailLabel?: string;
  rows: readonly ShareRow[];
};

export type ShareCardsProps = {
  /** Accessible name of the group. */
  label: string;
  items: readonly ShareCardItem[];
  className?: string;
};

function ShareRowView({ row }: { row: ShareRow }) {
  const body = (
    <>
      <span className="inline-flex w-16 shrink-0 justify-center rounded-xs bg-primary py-1.5 text-[13px] font-semibold text-primary-foreground">
        {row.share}
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-between gap-3 text-[13px] font-medium">
        <span className="truncate text-text-2">{row.label}</span>
        <span className="shrink-0 text-heading">{row.detail}</span>
      </span>
    </>
  );
  const className =
    "flex items-center gap-3 rounded-sm bg-muted p-1 outline-none focus-visible:ring-4 focus-visible:ring-primary/25";

  if (!row.href) return <div className={className}>{body}</div>;

  return (
    <WithyLink
      href={row.href}
      className={cn(className, "hover:bg-[color-mix(in_srgb,var(--heading)_6%,var(--muted))]")}
    >
      {body}
    </WithyLink>
  );
}

function ShareCard({ item }: { item: ShareCardItem }) {
  return (
    <div className={kpiFrame("px-5 py-4")}>
      <dt>
        <Text as="span" size="sm" weight="medium" tone="secondary">
          {item.label}
        </Text>
      </dt>
      <dd className="mt-1 flex items-baseline gap-2">
        <Figure as="span">{item.value}</Figure>
        {item.unit ? (
          <Text as="span" size="sm" weight="medium" tone="secondary">
            {item.unit}
          </Text>
        ) : null}
      </dd>
      <dd>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Eyebrow as="span" tone="muted">
            {item.shareLabel ?? "Share"}
          </Eyebrow>
          <Eyebrow as="span" tone="muted">
            {item.detailLabel ?? "Range"}
          </Eyebrow>
        </div>
        <ul className="mt-2 flex flex-col gap-2">
          {item.rows.map((row, index) => (
            <li key={`${row.label}-${index}`}>
              <ShareRowView row={row} />
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

export function ShareCards({ label, items, className }: ShareCardsProps) {
  return (
    <dl aria-label={label} className={kpiGrid(className)}>
      {items.map((item, index) => (
        <ShareCard key={`${item.label}-${index}`} item={item} />
      ))}
    </dl>
  );
}
