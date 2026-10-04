"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const avatarVariants = cva("inline-flex shrink-0 overflow-hidden rounded-full bg-primary/10", {
  variants: {
    size: {
      xs: "size-6 text-[10px]",
      sm: "size-8 text-xs",
      md: "size-10 text-sm",
      lg: "size-16 text-lg",
    },
  },
  defaultVariants: { size: "md" },
});

const fallbackTone = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-warning/20 text-warning-foreground",
  danger: "bg-danger/10 text-danger",
  pink: "bg-pink/10 text-pink",
  indigo: "bg-indigo/10 text-indigo",
} as const;

export type AvatarTone = keyof typeof fallbackTone;

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants> & {
    src?: string;
    alt?: string;
    initials: string;
    tone?: AvatarTone;
  };

export function Avatar({
  className,
  size,
  src,
  alt = "",
  initials,
  tone = "primary",
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root className={cn(avatarVariants({ size }), className)} {...props}>
      {src ? (
        <AvatarPrimitive.Image src={src} alt={alt} className="size-full object-cover" />
      ) : null}
      <AvatarPrimitive.Fallback
        className={cn("flex size-full items-center justify-center font-medium", fallbackTone[tone])}
        delayMs={src ? 300 : 0}
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
