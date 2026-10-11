import { cn } from "../../lib/cn";

type MetricTileProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone?: "primary" | "muted";
  className?: string;
};

export function MetricTile({ icon, value, label, tone = "primary", className }: MetricTileProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-sm [&_svg]:size-5",
          tone === "primary" ? "bg-primary/10 text-primary" : "bg-muted text-text-3",
        )}
      >
        {icon}
      </span>
      <span>
        <span className="block font-rubik text-[1.53125rem] leading-none text-heading">
          {value}
        </span>
        <span className="mt-1 block font-inter text-[10px] font-semibold tracking-[0.5px] text-text-3 uppercase">
          {label}
        </span>
      </span>
    </div>
  );
}
