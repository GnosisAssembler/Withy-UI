import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center justify-center font-inter text-[10px] leading-none font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        contained: "",
        muted: "",
        text: "bg-transparent px-0 text-text",
      },
      color: {
        primary: "",
        secondary: "",
        success: "",
        danger: "",
        warning: "",
        info: "",
        light: "",
        dark: "",
        pink: "",
        orange: "",
        indigo: "",
        teal: "",
        cyan: "",
      },
      shape: {
        rounded: "rounded-xs",
        square: "rounded-none",
        pill: "rounded-full px-2",
      },
    },
    compoundVariants: [
      { variant: "contained", color: "primary", class: "bg-primary text-primary-foreground" },
      { variant: "contained", color: "secondary", class: "bg-gray-600 text-white" },
      { variant: "contained", color: "success", class: "bg-success text-success-foreground" },
      { variant: "contained", color: "danger", class: "bg-danger text-danger-foreground" },
      { variant: "contained", color: "warning", class: "bg-warning text-warning-foreground" },
      { variant: "contained", color: "info", class: "bg-info text-info-foreground" },
      { variant: "contained", color: "light", class: "bg-light text-gray-900" },
      { variant: "contained", color: "dark", class: "bg-dark text-white" },
      { variant: "contained", color: "pink", class: "bg-pink text-[#1C1428]" },
      { variant: "contained", color: "orange", class: "bg-orange text-[#1C1428]" },
      { variant: "contained", color: "indigo", class: "bg-indigo text-white" },
      { variant: "contained", color: "teal", class: "bg-teal text-[#1C1428]" },
      { variant: "contained", color: "cyan", class: "bg-cyan text-[#1C1428]" },
      { variant: "muted", color: "primary", class: "bg-primary/10 text-primary" },
      { variant: "muted", color: "secondary", class: "bg-muted text-text-2" },
      { variant: "muted", color: "success", class: "bg-success/15 text-success" },
      { variant: "muted", color: "danger", class: "bg-danger/10 text-danger" },
      { variant: "muted", color: "warning", class: "bg-warning/15 text-warning" },
      { variant: "muted", color: "info", class: "bg-info/10 text-info" },
      { variant: "muted", color: "light", class: "bg-light/60 text-text-2" },
      { variant: "muted", color: "dark", class: "bg-dark/10 text-heading" },
      { variant: "muted", color: "pink", class: "bg-pink/20 text-heading" },
      { variant: "muted", color: "orange", class: "bg-orange/40 text-heading" },
      { variant: "muted", color: "indigo", class: "bg-indigo/20 text-heading" },
      { variant: "muted", color: "teal", class: "bg-teal/30 text-heading" },
      { variant: "muted", color: "cyan", class: "bg-cyan/20 text-heading" },
    ],
    defaultVariants: {
      variant: "contained",
      color: "primary",
      shape: "rounded",
    },
  },
);

export type BadgeProps = React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, color, shape, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({ variant, color, shape }),
        variant !== "text" && "px-[5px] pt-[3px] pb-1",
        className,
      )}
      {...props}
    />
  );
}
