"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const tones = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
  "white",
  "brand",
  "facebook",
  "twitter",
] as const;

export type ButtonTone = (typeof tones)[number];

const contained: Record<ButtonTone, string> = {
  primary:
    "border-primary bg-primary text-white hover:border-[color-mix(in_srgb,#0168fa_82%,black)] hover:bg-[color-mix(in_srgb,#0168fa_88%,black)]",
  secondary:
    "border-secondary bg-secondary text-white hover:border-[color-mix(in_srgb,#5f6d88_82%,black)] hover:bg-[color-mix(in_srgb,#5f6d88_88%,black)]",
  success:
    "border-success bg-success text-white hover:border-[color-mix(in_srgb,#10b759_82%,black)] hover:bg-[color-mix(in_srgb,#10b759_88%,black)]",
  danger:
    "border-danger bg-danger text-white hover:border-[color-mix(in_srgb,#dc3545_82%,black)] hover:bg-[color-mix(in_srgb,#dc3545_88%,black)]",
  warning:
    "border-warning bg-warning text-warning-foreground hover:border-[color-mix(in_srgb,#ffc107_82%,black)] hover:bg-[color-mix(in_srgb,#ffc107_88%,black)]",
  info: "border-info bg-info text-white hover:border-[color-mix(in_srgb,#00b8d4_82%,black)] hover:bg-[color-mix(in_srgb,#00b8d4_88%,black)]",
  light:
    "border-light bg-light text-gray-800 hover:border-[color-mix(in_srgb,#e5e9f2_75%,black)] hover:bg-[color-mix(in_srgb,#e5e9f2_82%,black)]",
  dark: "border-dark bg-dark text-white hover:border-[color-mix(in_srgb,#3b4863_82%,black)] hover:bg-[color-mix(in_srgb,#3b4863_88%,black)]",
  white:
    "border-border bg-white-button text-white-button-foreground hover:bg-[color-mix(in_srgb,var(--white-button)_92%,var(--heading))]",
  brand:
    "border-brand bg-brand text-white hover:border-[color-mix(in_srgb,#042893_82%,black)] hover:bg-[color-mix(in_srgb,#042893_88%,black)]",
  facebook:
    "border-facebook bg-facebook text-white hover:border-[color-mix(in_srgb,#4064ac_82%,black)] hover:bg-[color-mix(in_srgb,#4064ac_88%,black)]",
  twitter:
    "border-twitter bg-twitter text-white hover:border-[color-mix(in_srgb,#00a7e6_82%,black)] hover:bg-[color-mix(in_srgb,#00a7e6_88%,black)]",
};

const outlined: Record<ButtonTone, string> = {
  primary: "border-primary bg-transparent text-primary hover:bg-primary hover:text-white",
  secondary: "border-secondary bg-transparent text-secondary hover:bg-secondary hover:text-white",
  success: "border-success bg-transparent text-success hover:bg-success hover:text-white",
  danger: "border-danger bg-transparent text-danger hover:bg-danger hover:text-white",
  warning:
    "border-warning bg-transparent text-warning-foreground hover:bg-warning hover:text-warning-foreground",
  info: "border-info bg-transparent text-info hover:bg-info hover:text-white",
  light: "border-gray-300 bg-transparent text-text-2 hover:bg-light",
  dark: "border-dark bg-transparent text-dark hover:bg-dark hover:text-white",
  white: "border-white bg-transparent text-white hover:bg-white hover:text-gray-900",
  brand: "border-brand bg-transparent text-brand hover:bg-brand hover:text-white",
  facebook: "border-facebook bg-transparent text-facebook hover:bg-facebook hover:text-white",
  twitter: "border-twitter bg-transparent text-twitter hover:bg-twitter hover:text-white",
};

const texted: Record<ButtonTone, string> = {
  primary: "border-transparent bg-transparent text-primary hover:underline",
  secondary: "border-transparent bg-transparent text-secondary hover:underline",
  success: "border-transparent bg-transparent text-success hover:underline",
  danger: "border-transparent bg-transparent text-danger hover:underline",
  warning: "border-transparent bg-transparent text-warning-foreground hover:underline",
  info: "border-transparent bg-transparent text-info hover:underline",
  light: "border-transparent bg-transparent text-text hover:underline",
  dark: "border-transparent bg-transparent text-dark hover:underline",
  white: "border-transparent bg-transparent text-white hover:underline",
  brand: "border-transparent bg-transparent text-brand hover:underline",
  facebook: "border-transparent bg-transparent text-facebook hover:underline",
  twitter: "border-transparent bg-transparent text-twitter hover:underline",
};

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[7px] whitespace-nowrap border text-center align-middle leading-normal font-normal select-none transition-[color,background-color,border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/35 disabled:pointer-events-none disabled:opacity-65 [&_svg]:shrink-0 data-[active=true]:brightness-90",
  {
    variants: {
      variant: {
        contained: "",
        outlined: "",
        text: "px-0",
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
        white: "",
        brand: "",
        facebook: "",
        twitter: "",
      },
      size: {
        xs: "px-[0.9375rem] py-[5px] text-xs [&_svg]:size-3",
        sm: "px-[15px] py-[0.391rem] text-[13px] [&_svg]:size-3.5",
        md: "px-[0.9375rem] py-[0.46875rem] text-sm [&_svg]:size-4",
        lg: "px-4 py-[0.6rem] text-sm [&_svg]:size-[18px]",
      },
      shape: {
        rounded: "rounded-sm",
        square: "rounded-none",
        pill: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      icon: {
        true: "px-0",
        false: "",
      },
    },
    compoundVariants: [
      ...tones.map((color) => ({
        variant: "contained" as const,
        color,
        class: contained[color],
      })),
      ...tones.map((color) => ({
        variant: "outlined" as const,
        color,
        class: outlined[color],
      })),
      ...tones.map((color) => ({
        variant: "text" as const,
        color,
        class: texted[color],
      })),
      { icon: true, size: "xs" as const, class: "size-7" },
      { icon: true, size: "sm" as const, class: "size-8" },
      { icon: true, size: "md" as const, class: "size-[38px]" },
      { icon: true, size: "lg" as const, class: "size-10" },
    ],
    defaultVariants: {
      variant: "contained",
      color: "primary",
      size: "md",
      shape: "rounded",
      fullWidth: false,
      icon: false,
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    active?: boolean;
  };

export function Button({
  asChild = false,
  className,
  variant,
  color,
  size,
  shape,
  fullWidth,
  icon,
  active,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, color, size, shape, fullWidth, icon }), className);

  if (asChild) {
    return <Slot className={classes} data-active={active || undefined} {...props} />;
  }

  return (
    <button
      type={type ?? "button"}
      className={classes}
      data-active={active || undefined}
      aria-pressed={active || undefined}
      {...props}
    />
  );
}

export { buttonVariants };
