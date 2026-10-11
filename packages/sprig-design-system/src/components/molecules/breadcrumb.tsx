import { cn } from "../../lib/cn";
import { SprigLink } from "../theme/sprig-routing";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 font-inter text-[10px] font-semibold tracking-[0.5px] uppercase">
        {items.map((item, index) => {
          const current = !item.href || index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span className="text-gray-500">/</span> : null}
              {item.href && !current ? (
                <SprigLink href={item.href} className="text-heading hover:text-primary">
                  {item.label}
                </SprigLink>
              ) : (
                <span
                  className={cn(current ? "text-primary" : "text-heading")}
                  aria-current={current ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
