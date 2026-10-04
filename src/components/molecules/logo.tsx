import Link from "next/link";
import { cn } from "@/lib/cn";
import { SproutMark } from "@/components/atoms/sprout";

type LogoProps = {
  href?: string;
  inverse?: boolean;
  className?: string;
};

export function Logo({ href = "/", inverse = false, className }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-[1.09375rem] leading-none font-medium tracking-tight",
        inverse ? "text-white" : "text-heading",
        className,
      )}
    >
      <span className={inverse ? "text-white" : "text-primary"}>
        <SproutMark />
      </span>
      sprig
    </Link>
  );
}
