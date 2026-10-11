"use client";

import * as React from "react";
import { Bell, Menu as MenuIcon, Search } from "lucide-react";
import { Avatar } from "../atoms/avatar";
import { Button } from "../atoms/button";
import { Kbd } from "../atoms/kbd";
import { Logo } from "../molecules/logo";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from "../molecules/menu";
import { ThemeSwitcher } from "../molecules/theme-switcher";
import { Tooltip, TooltipContent, TooltipTrigger } from "../molecules/tooltip";
import { CommandBar, type CommandItem } from "./command-bar";
import { Dialog, DialogBody, DialogContent } from "./dialog";
import { SprigLink, useSprigNavigation } from "../theme/sprig-routing";
import { cn } from "../../lib/cn";

export type HeaderLink = {
  label: string;
  href: string;
};

export type HeaderUser = {
  name: string;
  email: string;
  initials: string;
};

export type HeaderNotice = {
  title: string;
  time: string;
};

type HeaderProps = {
  nav: HeaderLink[];
  user: HeaderUser;
  pathname?: string;
  onNavigate?: (href: string) => void;
  commands?: CommandItem[];
  notices?: HeaderNotice[];
  accountLinks?: HeaderLink[];
};

function isActive(href: string, pathname: string) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header({
  nav,
  user,
  pathname: pathnameProp,
  onNavigate: onNavigateProp,
  commands = [],
  notices = [],
  accountLinks = [],
}: HeaderProps) {
  const routing = useSprigNavigation();
  const pathname = pathnameProp ?? routing.pathname;
  const onNavigate = onNavigateProp ?? routing.onNavigate;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-[60px] items-center border-b border-border bg-header">
        <div className="flex w-full items-center gap-3 px-4 lg:px-5">
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
          <Logo className="mr-2 shrink-0" />
          <nav
            className="hidden min-w-0 items-center gap-0.5 overflow-x-auto lg:flex"
            aria-label="Primary"
          >
            {nav.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <SprigLink
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-sm px-3 py-2 text-[13px] text-text-2 hover:text-primary",
                    active && "font-medium text-primary",
                  )}
                >
                  {item.label}
                </SprigLink>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button
              icon
              color="white"
              size="sm"
              className="xl:hidden"
              aria-label="Search Sprig"
              onClick={() => setCommandOpen(true)}
            >
              <Search />
            </Button>
            <button
              type="button"
              className="hidden h-[34px] w-52 items-center gap-2 rounded-sm border border-text-4 bg-card px-2.5 text-left text-[13px] text-text-3 xl:inline-flex"
              aria-label="Search Sprig"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="size-3.5 shrink-0" />
              <span className="flex-1">Search</span>
              <Kbd>⌘K</Kbd>
            </button>
            <ThemeSwitcher />
            <Menu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MenuTrigger asChild>
                    <Button icon color="white" size="sm" aria-label="Notifications">
                      <Bell />
                    </Button>
                  </MenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
              <MenuContent className="w-72">
                <MenuLabel>Notifications</MenuLabel>
                {notices.map((notice) => (
                  <MenuItem key={notice.title}>
                    <span>
                      <span className="block text-text-2">{notice.title}</span>
                      <span className="text-[11px] text-text-3">{notice.time}</span>
                    </span>
                  </MenuItem>
                ))}
              </MenuContent>
            </Menu>
            <Menu>
              <MenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-full outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
                  aria-label="Account menu"
                >
                  <Avatar initials={user.initials} size="sm" alt={user.name} />
                </button>
              </MenuTrigger>
              <MenuContent>
                <MenuLabel>{user.name}</MenuLabel>
                <MenuItem disabled>{user.email}</MenuItem>
                {accountLinks.length > 0 ? <MenuSeparator /> : null}
                {accountLinks.map((link) => (
                  <MenuItem key={link.href} asChild>
                    <SprigLink href={link.href}>{link.label}</SprigLink>
                  </MenuItem>
                ))}
              </MenuContent>
            </Menu>
          </div>
        </div>
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogContent title="Navigate" description="Sprig pages and examples">
            <DialogBody className="flex flex-col gap-1">
              <button
                type="button"
                className="mb-2 flex h-[38px] w-full items-center gap-2 rounded-sm border border-text-4 bg-card px-2.5 text-left text-sm text-text-3"
                onClick={() => {
                  setMobileOpen(false);
                  setCommandOpen(true);
                }}
              >
                <Search className="size-3.5" />
                Search pages and actions
              </button>
              {nav.map((item) => (
                <SprigLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-sm px-3 py-2 text-sm text-text-2 hover:bg-[color-mix(in_srgb,var(--heading)_6%,transparent)]"
                >
                  {item.label}
                </SprigLink>
              ))}
            </DialogBody>
          </DialogContent>
        </Dialog>
      </header>
      <CommandBar
        shortcut
        open={commandOpen}
        onOpenChange={setCommandOpen}
        items={commands}
        onNavigate={onNavigate}
      />
    </>
  );
}
