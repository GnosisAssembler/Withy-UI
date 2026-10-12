import { cn } from "../../lib/cn";

const tones = {
  default: "text-text",
  heading: "text-heading",
  secondary: "text-text-2",
  muted: "text-text-3",
  primary: "text-primary",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  danger: "text-danger",
} as const;

const sizes = {
  xs: "text-[11px]",
  sm: "text-[13px]",
  md: "text-sm",
} as const;

const weights = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
} as const;

type TextProps = React.ComponentProps<"p"> & {
  as?: "p" | "span" | "div";
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  weight?: keyof typeof weights;
};

export function Text({
  as: Tag = "p",
  tone = "default",
  size = "md",
  weight,
  className,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(tones[tone], sizes[size], weight && weights[weight], className)}
      {...props}
    />
  );
}
