"use client";

import * as React from "react";
import { ChevronDown, Menu as MenuIcon } from "lucide-react";
import { Button } from "../atoms/button";
import { Logo } from "../molecules/logo";
import {
  PopupMenu,
  PopupMenuContent,
  PopupMenuItem,
  PopupMenuTrigger,
} from "../molecules/popup-menu";
import { ThemeSwitcher } from "../molecules/theme-switcher";
import { Drawer } from "./drawer";
import { WithyLink, useWithyNavigation } from "../theme/withy-routing";
import { cn } from "../../lib/cn";

export type HeaderLink = {
  label: string;
  href: string;
  children?: HeaderLink[];
};

type HeaderProps = {
  nav?: HeaderLink[];
  pathname?: string;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  themeSwitcher?: boolean;
};

const linkClass =
  "rounded-sm px-3 py-2 text-[13px] text-text-2 hover:text-primary aria-[current=page]:font-medium aria-[current=page]:text-primary";

function isActive(href: string, pathname: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function linkIsActive(item: HeaderLink, pathname: string) {
  if (item.children?.some((child) => isActive(child.href, pathname))) return true;
  if (item.children) return false;
  return isActive(item.href, pathname);
}

export function Header({
  nav = [],
  pathname: pathnameProp,
  logo = <Logo />,
  actions,
  themeSwitcher = true,
}: HeaderProps) {
  const routing = useWithyNavigation();
  const pathname = pathnameProp ?? routing.pathname;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-[60px] items-center border-b border-border bg-header">
      <div className="flex w-full items-center gap-3 px-4 lg:px-5">
        {nav.length > 0 ? (
          <Button
            icon
            color="white"
            size="sm"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </Button>
        ) : null}
        <div className="mr-2 flex shrink-0 items-center">{logo}</div>
        <nav
          className="hidden min-w-0 items-center gap-0.5 overflow-x-auto lg:flex"
          aria-label="Primary"
        >
          {nav.map((item) => {
            const active = linkIsActive(item, pathname);
            if (item.children) {
              return (
                <PopupMenu key={item.label}>
                  <PopupMenuTrigger
                    className={cn(
                      "inline-flex items-center gap-1 rounded-sm px-3 py-2 text-[13px] text-text-2 outline-none hover:text-primary focus-visible:ring-4 focus-visible:ring-primary/25",
                      active && "font-medium text-primary",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="size-3.5" />
                  </PopupMenuTrigger>
                  <PopupMenuContent align="start">
                    {item.children.map((child) => (
                      <PopupMenuItem key={child.href} asChild>
                        <WithyLink
                          href={child.href}
                          aria-current={isActive(child.href, pathname) ? "page" : undefined}
                          className={linkClass}
                        >
                          {child.label}
                        </WithyLink>
                      </PopupMenuItem>
                    ))}
                  </PopupMenuContent>
                </PopupMenu>
              );
            }
            return (
              <WithyLink
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={linkClass}
              >
                {item.label}
              </WithyLink>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {actions}
          {themeSwitcher ? <ThemeSwitcher /> : null}
        </div>
      </div>
      <Drawer side="left" open={mobileOpen} onOpenChange={setMobileOpen} title="Navigate">
        <div className="flex flex-col gap-1">
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="flex flex-col">
                <p className="px-3 pt-2 pb-1 text-[13px] font-medium text-heading">{item.label}</p>
                {item.children.map((child) => (
                  <WithyLink
                    key={child.href}
                    href={child.href}
                    aria-current={isActive(child.href, pathname) ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-sm px-6 py-2 text-sm text-text-2 hover:bg-[color-mix(in_srgb,var(--heading)_6%,transparent)] aria-[current=page]:font-medium aria-[current=page]:text-primary"
                  >
                    {child.label}
                  </WithyLink>
                ))}
              </div>
            ) : (
              <WithyLink
                key={item.href}
                href={item.href}
                aria-current={linkIsActive(item, pathname) ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className="rounded-sm px-3 py-2 text-sm text-text-2 hover:bg-[color-mix(in_srgb,var(--heading)_6%,transparent)] aria-[current=page]:font-medium aria-[current=page]:text-primary"
              >
                {item.label}
              </WithyLink>
            ),
          )}
        </div>
      </Drawer>
    </header>
  );
}
