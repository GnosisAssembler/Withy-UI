import { ScrollArea } from "@/components/atoms/scroll-area";
import { NavItem } from "@/components/molecules/nav-item";
import { cn } from "@/lib/cn";

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
};

export function Sidebar({
  sections,
  collapsed = false,
  className,
}: {
  sections: SidebarSection[];
  collapsed?: boolean;
  className?: string;
}) {
  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className={cn("flex flex-col gap-4 p-4", collapsed && "px-2")}>
        {sections.map((section) => (
          <div key={section.label ?? section.items[0]?.label}>
            {section.label && !collapsed ? (
              <p className="mb-2 px-3 font-inter text-[10px] font-semibold tracking-[0.5px] text-text-3 uppercase">
                {section.label}
              </p>
            ) : null}
            <nav className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavItem key={item.label} collapsed={collapsed} {...item} />
              ))}
            </nav>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
