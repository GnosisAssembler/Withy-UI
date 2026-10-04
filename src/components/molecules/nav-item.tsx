"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

type NavItemProps = {
  href?: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  collapsed?: boolean;
  className?: string;
  onSelect?: () => void;
};

export function NavItem({
  href,
  label,
  icon,
  active,
  collapsed,
  className,
  onSelect,
}: NavItemProps) {
  const classes = cn(
    "flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-[13px] text-text-2 hover:bg-[color-mix(in_srgb,var(--heading)_6%,transparent)]",
    active && "bg-primary/10 font-medium text-primary",
    collapsed && "justify-center px-2",
    className,
  );
  const content = (
    <>
      {icon ? <span className="text-current [&_svg]:size-4">{icon}</span> : null}
      {collapsed ? <span className="sr-only">{label}</span> : <span>{label}</span>}
    </>
  );

  if (!href) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={classes}
        aria-current={active ? "page" : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={classes}
    >
      {content}
    </Link>
  );
}
