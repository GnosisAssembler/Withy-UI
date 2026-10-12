"use client";

import type { LucideIcon } from "lucide-react";
import { Button, type ButtonProps } from "../atoms/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type IconButtonProps = Omit<ButtonProps, "children" | "icon" | "asChild" | "aria-label"> & {
  icon: LucideIcon;
  label: string;
  tooltip?: boolean;
};

export function IconButton({
  icon: Glyph,
  label,
  tooltip = false,
  color = "white",
  size = "sm",
  ...props
}: IconButtonProps) {
  const button = (
    <Button icon color={color} size={size} aria-label={label} {...props}>
      <Glyph aria-hidden />
    </Button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
