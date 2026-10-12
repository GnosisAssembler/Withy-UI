"use client";

import { cn } from "../../lib/cn";
import { WithyLink, useWithyNavigation } from "../theme/withy-routing";

export type SectionNavItem = {
  label: string;
  href: string;
};

type SectionNavProps = {
  label: string;
  items: SectionNavItem[];
  current?: string;
  className?: string;
};

export function SectionNav({ label, items, current, className }: SectionNavProps) {
  const { pathname } = useWithyNavigation();
  const active = current ?? pathname;

  return (
    <nav
      aria-label={label}
      className={cn(
        "flex gap-1 overflow-x-auto rounded-sm border border-border bg-card p-1.5 lg:sticky lg:top-20 lg:w-48 lg:shrink-0 lg:flex-col",
        className,
      )}
    >
      {items.map((item) => {
        const isCurrent = item.href === active;
        return (
          <WithyLink
            key={item.href}
            href={item.href}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-xs px-3 py-2 text-[13px] text-text-2 outline-none hover:bg-muted hover:text-heading focus-visible:ring-4 focus-visible:ring-primary/25",
              isCurrent && "bg-muted font-medium text-heading",
            )}
          >
            {item.label}
          </WithyLink>
        );
      })}
    </nav>
  );
}
