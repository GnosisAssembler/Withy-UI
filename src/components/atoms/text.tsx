import { cn } from "@/lib/cn";

const tones = {
  default: "text-text",
  secondary: "text-text-2",
  muted: "text-text-3",
  primary: "text-primary",
  success: "text-success",
  danger: "text-danger",
} as const;

type TextProps = React.ComponentProps<"p"> & {
  tone?: keyof typeof tones;
  size?: "xs" | "sm" | "md";
};

const sizes = {
  xs: "text-[11px]",
  sm: "text-[13px]",
  md: "text-sm",
} as const;

export function Text({ tone = "default", size = "md", className, ...props }: TextProps) {
  return <p className={cn(tones[tone], sizes[size], className)} {...props} />;
}
