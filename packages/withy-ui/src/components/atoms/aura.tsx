import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const colors = {
  primary: "text-primary",
  brand: "text-brand",
  pink: "text-pink",
  orange: "text-orange",
  indigo: "text-indigo",
  teal: "text-teal",
  cyan: "text-cyan",
} as const;

const radii = {
  none: "0px",
  xs: "3px",
  sm: "4px",
  md: "6px",
  lg: "8px",
  full: "9999px",
} as const;

const auraVariants = cva("withy-aura", {
  variants: {
    variant: {
      default: "",
      dual: "withy-aura-dual",
      rainbow: "withy-aura-rainbow",
      holo: "withy-aura-holo",
      gold: "withy-aura-gold",
      silver: "withy-aura-silver",
      glow: "withy-aura-glow",
    },
    size: {
      xs: "withy-aura-xs",
      sm: "withy-aura-sm",
      md: "withy-aura-md",
      lg: "withy-aura-lg",
      xl: "withy-aura-xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

export type AuraColor = keyof typeof colors;
export type AuraRadius = keyof typeof radii;

export type AuraProps = React.ComponentProps<"div"> &
  VariantProps<typeof auraVariants> & {
    color?: AuraColor;
    radius?: AuraRadius;
    duration?: number;
  };

const currentColorVariants = new Set<NonNullable<AuraProps["variant"]>>([
  "default",
  "dual",
  "glow",
]);

export function Aura({
  variant,
  size,
  color,
  radius = "sm",
  duration,
  className,
  style,
  ...props
}: AuraProps) {
  const resolved = variant ?? "default";
  const painted = color ?? (currentColorVariants.has(resolved) ? "primary" : undefined);

  return (
    <div
      className={cn(auraVariants({ variant, size }), painted && colors[painted], className)}
      style={
        {
          "--withy-aura-radius": radii[radius],
          ...(duration != null ? { "--withy-aura-duration": `${duration}ms` } : null),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
