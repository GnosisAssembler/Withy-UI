import { cn } from "../../lib/cn";

const tones = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  indigo: "bg-indigo",
} as const;

export type TimelineTone = keyof typeof tones;

export type TimelineItem = {
  id: string;
  title: string;
  time: string;
  description?: string;
  tone?: TimelineTone;
};

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
          {index < items.length - 1 ? (
            <span className="absolute top-3 bottom-0 left-1.25 w-px bg-border" aria-hidden />
          ) : null}
          <span
            className={cn(
              "relative z-10 mt-1.5 size-2.5 shrink-0 rounded-full",
              tones[item.tone ?? "primary"],
            )}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="font-inter text-[10px] font-semibold tracking-[0.5px] text-text-3 uppercase">
              {item.time}
            </p>
            <p className="mt-1 text-sm font-medium text-heading">{item.title}</p>
            {item.description ? (
              <p className="mt-1 text-[13px] text-text-2">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
