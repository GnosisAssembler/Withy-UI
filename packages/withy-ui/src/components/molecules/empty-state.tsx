import type { LucideIcon } from "lucide-react";
import { Icon } from "../atoms/icon";
import { cn } from "../../lib/cn";

type EmptyStateProps = {
  title: string;
  description?: React.ReactNode;
  icon?: LucideIcon;
  action?: React.ReactNode;
  align?: "start" | "center";
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  align = "start",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-sm border border-dashed border-border px-5 py-8",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {icon ? <Icon icon={icon} size="lg" className="text-text-3" /> : null}
      <div>
        <p className="text-[13px] font-medium text-heading">{title}</p>
        {description ? (
          <p className="mt-1 max-w-sm text-[13px] text-text-2">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
