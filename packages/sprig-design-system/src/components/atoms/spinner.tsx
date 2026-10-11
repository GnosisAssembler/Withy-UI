import { cn } from "../../lib/cn";

const sizes = {
  sm: "size-3 border",
  md: "size-4 border-2",
  lg: "size-8 border-[3px]",
} as const;

type SpinnerProps = {
  size?: keyof typeof sizes;
  label?: string;
  className?: string;
};

export function Spinner({ size = "md", label = "Loading", className }: SpinnerProps) {
  return (
    <span className={cn("inline-flex text-primary", className)} role="status">
      <span
        className={cn("animate-spin rounded-full border-current border-r-transparent", sizes[size])}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function SpinnerOverlay({ label = "Loading" }: { label?: string }) {
  return (
    <span className="absolute inset-0 flex items-center justify-center bg-card/70">
      <Spinner size="lg" label={label} />
    </span>
  );
}
