import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center justify-center font-inter text-[10px] leading-none font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        contained: "",
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
      },
      shape: {
        rounded: "rounded-xs",
        square: "rounded-none",
        pill: "rounded-full px-2",
      },
    },
    compoundVariants: [
      { variant: "contained", color: "primary", class: "bg-primary text-white" },
      { variant: "contained", color: "secondary", class: "bg-gray-600 text-white" },
      { variant: "contained", color: "success", class: "bg-success text-white" },
      { variant: "contained", color: "danger", class: "bg-danger text-white" },
      { variant: "contained", color: "warning", class: "bg-warning text-warning-foreground" },
      { variant: "contained", color: "info", class: "bg-info text-white" },
      { variant: "contained", color: "light", class: "bg-gray-300 text-gray-900" },
      { variant: "contained", color: "dark", class: "bg-dark text-white" },
      { variant: "contained", color: "pink", class: "bg-pink text-white" },
      { variant: "contained", color: "orange", class: "bg-orange text-white" },
      { variant: "contained", color: "indigo", class: "bg-indigo text-white" },
      { variant: "contained", color: "teal", class: "bg-teal text-gray-900" },
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
