import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const sizes = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

type IconProps = {
  icon: LucideIcon;
  size?: keyof typeof sizes;
  label?: string;
  className?: string;
};

export function Icon({ icon: Glyph, size = "md", label, className }: IconProps) {
  return (
    <Glyph
      className={cn(sizes[size], className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    />
  );
}
