import { cn } from "../../lib/cn";

const fills = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  pink: "bg-pink",
  info: "bg-info",
  indigo: "bg-indigo",
  teal: "bg-teal",
  orange: "bg-orange",
  danger: "bg-danger",
} as const;

export type MeterSegment = {
  label: string;
  value: number;
  color: keyof typeof fills;
};

type SegmentedMeterProps = {
  segments: MeterSegment[];
  label: string;
  className?: string;
};

export function SegmentedMeter({ segments, label, className }: SegmentedMeterProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;

  return (
    <div className={className}>
      <div className="flex h-2.5 overflow-hidden rounded-full" role="img" aria-label={label}>
        {segments.map((segment) => (
          <span
            key={segment.label}
            className={fills[segment.color]}
            style={{ width: `${(segment.value / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-4 flex flex-col gap-2.5">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2 text-[13px]">
            <span className={cn("size-2.5 shrink-0 rounded-full", fills[segment.color])} />
            <span className="text-text-2">{segment.label}</span>
            <span className="ml-auto font-rubik text-heading tabular-nums">
              {new Intl.NumberFormat("en-US").format(segment.value)}
            </span>
            <span className="w-10 text-right text-text-3 tabular-nums">
              {Math.round((segment.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
