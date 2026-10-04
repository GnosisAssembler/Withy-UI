import { cn } from "@/lib/cn";

const tones = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  orange: "bg-orange/10 text-orange",
  pink: "bg-pink/10 text-pink",
  indigo: "bg-indigo/10 text-indigo",
  info: "bg-info/10 text-info",
} as const;

export type ActivityItem = {
  id: string;
  title: string;
  time: string;
  tone: keyof typeof tones;
  icon: React.ReactNode;
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="flex flex-col">
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
          {index < items.length - 1 ? (
            <span className="absolute top-8 bottom-0 left-4 w-px bg-border" aria-hidden />
          ) : null}
          <span
            className={cn(
              "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full [&_svg]:size-3.5",
              tones[item.tone],
            )}
          >
            {item.icon}
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-[13px] text-text-2">{item.title}</p>
            <p className="text-[11px] text-text-3">{item.time}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
