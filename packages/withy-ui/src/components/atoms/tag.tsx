import { X } from "lucide-react";
import { cn } from "../../lib/cn";

const dots = {
  primary: "bg-primary",
  cyan: "bg-cyan",
  orange: "bg-orange",
  indigo: "bg-indigo",
  teal: "bg-teal",
  pink: "bg-pink",
} as const;

export type TagColor = keyof typeof dots;

type TagProps = React.ComponentProps<"span"> & {
  color?: TagColor;
  onRemove?: () => void;
  removeLabel?: string;
};

export function Tag({ color, onRemove, removeLabel, className, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 max-w-full items-center gap-1.5 rounded-xs border border-border bg-muted px-2 text-[12px] whitespace-nowrap text-text-2",
        onRemove && "pr-0.5",
        className,
      )}
      {...props}
    >
      {color ? (
        <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dots[color])} />
      ) : null}
      <span className="truncate">{children}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label={
            removeLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove")
          }
          onClick={onRemove}
          className="inline-flex size-5 shrink-0 items-center justify-center rounded-xs text-text-3 outline-none hover:bg-[color-mix(in_srgb,var(--heading)_8%,transparent)] hover:text-heading focus-visible:ring-4 focus-visible:ring-primary/25"
        >
          <X className="size-3" aria-hidden />
        </button>
      ) : null}
    </span>
  );
}
