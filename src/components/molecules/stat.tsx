import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

export type StatChange = {
  value: string;
  direction: "up" | "down";
  hint?: string;
};

export function Stat({
  title,
  value,
  change,
  className,
}: {
  title: string;
  value: string;
  change?: StatChange;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-[11px] font-semibold tracking-[0.5px] text-text-2 uppercase">
        {title}
      </p>
      <div className="flex items-end gap-2">
        <p className="font-rubik text-[1.53125rem] leading-none font-normal text-heading">
          {value}
        </p>
        {change ? (
          <p className="pb-0.5 text-[11px] text-text-3">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                change.direction === "up" ? "text-success" : "text-danger",
              )}
            >
              {change.value}
              {change.direction === "up" ? (
                <ArrowUp className="size-2.5" />
              ) : (
                <ArrowDown className="size-2.5" />
              )}
            </span>
            {change.hint ? ` ${change.hint}` : null}
          </p>
        ) : null}
      </div>
    </div>
  );
}
