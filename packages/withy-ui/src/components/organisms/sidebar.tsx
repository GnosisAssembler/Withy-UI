import { ScrollArea } from "../atoms/scroll-area";
import { NavItem } from "../molecules/nav-item";
import { cn } from "../../lib/cn";

export type SidebarItem = {
  href?: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onSelect?: () => void;
};

export type SidebarSection = {
  label?: string;
  items: SidebarItem[];
  empty?: React.ReactNode;
};

export function Sidebar({
  sections,
  label,
  collapsed = false,
  className,
}: {
  sections: SidebarSection[];
  label?: string;
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <ScrollArea className={cn("h-full", className)}>
      <nav aria-label={label} className={cn("flex flex-col gap-4 p-4", collapsed && "px-2")}>
        {sections.map((section, index) => (
          <div key={section.label ?? section.items[0]?.label ?? index}>
            {section.label && !collapsed ? (
              <p className="mb-2 px-3 font-inter text-[10px] font-semibold tracking-[0.5px] text-text-3 uppercase">
                {section.label}
              </p>
            ) : null}
            {section.items.length > 0 ? (
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <li key={item.href ?? item.label}>
                    <NavItem collapsed={collapsed} {...item} />
                  </li>
                ))}
              </ul>
            ) : section.empty && !collapsed ? (
              <p className="px-3 text-[12px] text-text-3">{section.empty}</p>
            ) : null}
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
}
