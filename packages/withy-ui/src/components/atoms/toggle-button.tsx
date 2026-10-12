"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

const toggleButtonVariants = cva(
  "inline-flex items-center justify-center gap-[7px] rounded-sm border text-center align-middle leading-normal font-normal whitespace-nowrap select-none transition-[color,background-color,border-color,box-shadow] duration-150 focus-visible:ring-4 focus-visible:ring-primary/35 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-65 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-border bg-white-button text-white-button-foreground hover:bg-muted data-[state=on]:border-primary data-[state=on]:bg-primary/15 data-[state=on]:text-primary data-[state=on]:hover:border-primary data-[state=on]:hover:bg-primary/20 data-[state=on]:hover:text-primary",
        quiet:
          "border-transparent bg-transparent text-text-2 hover:bg-muted hover:text-heading data-[state=on]:border-transparent data-[state=on]:bg-primary/15 data-[state=on]:text-primary data-[state=on]:hover:bg-primary/20 data-[state=on]:hover:text-primary",
        emphasized:
          "border-primary bg-transparent text-primary hover:bg-primary/10 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:border-[color-mix(in_srgb,var(--primary)_82%,black)] data-[state=on]:hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)] data-[state=on]:hover:text-primary-foreground",
      },
      size: {
        xs: "px-[0.9375rem] py-[5px] text-xs [&_svg]:size-3",
        sm: "px-[15px] py-[0.391rem] text-[13px] [&_svg]:size-3.5",
        md: "px-[0.9375rem] py-[0.46875rem] text-sm [&_svg]:size-4",
        lg: "px-4 py-[0.6rem] text-sm [&_svg]:size-[18px]",
      },
      icon: {
        true: "px-0",
        false: "",
      },
    },
    compoundVariants: [
      { icon: true, size: "xs", class: "size-7" },
      { icon: true, size: "sm", class: "size-8" },
      { icon: true, size: "md", class: "size-[38px]" },
      { icon: true, size: "lg", class: "size-10" },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      icon: false,
    },
  },
);

export type ToggleButtonProps = Omit<React.ComponentProps<"button">, "onChange"> &
  VariantProps<typeof toggleButtonVariants> & {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
  };

export function ToggleButton({
  pressed: pressedProp,
  defaultPressed = false,
  onPressedChange,
  variant,
  size,
  icon,
  className,
  disabled,
  type,
  onClick,
  ...props
}: ToggleButtonProps) {
  const [uncontrolledPressed, setUncontrolledPressed] = React.useState(defaultPressed);
  const pressed = pressedProp ?? uncontrolledPressed;

  return (
    <button
      type={type ?? "button"}
      {...props}
      className={cn(toggleButtonVariants({ variant, size, icon }), className)}
      disabled={disabled}
      aria-pressed={pressed}
      data-state={pressed ? "on" : "off"}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const next = !pressed;
        if (pressedProp === undefined) setUncontrolledPressed(next);
        onPressedChange?.(next);
      }}
    />
  );
}
