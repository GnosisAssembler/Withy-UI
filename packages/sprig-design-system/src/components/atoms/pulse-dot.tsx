import { cn } from "../../lib/cn";

const tones = {
  primary: "bg-primary",
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
  pink: "bg-pink",
} as const;

type PulseDotProps = {
  color?: keyof typeof tones;
  label?: string;
  className?: string;
};

export function PulseDot({ color = "success", label, className }: PulseDotProps) {
  return (
    <span
      className={cn("relative inline-flex size-2.5 shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <span
        className={cn(
          "absolute inline-flex size-full animate-ping rounded-full opacity-70",
          tones[color],
        )}
      />
      <span className={cn("relative inline-flex size-2.5 rounded-full", tones[color])} />
    </span>
  );
}
