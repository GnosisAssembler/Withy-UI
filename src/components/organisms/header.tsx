"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Calendar,
  Compass,
  LayoutDashboard,
  LayoutGrid,
  LogIn,
  Menu as MenuIcon,
  Moon,
  Search,
  Settings,
  Sun,
  UserPlus,
} from "lucide-react";
import { Avatar } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Kbd } from "@/components/atoms/kbd";
import { Logo } from "@/components/molecules/logo";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from "@/components/molecules/menu";
import { ThemeSwitcher } from "@/components/molecules/theme-switcher";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/molecules/tooltip";
import { CommandBar, type CommandItem } from "@/components/organisms/command-bar";
import { Dialog, DialogBody, DialogContent } from "@/components/organisms/dialog";
import { useTheme } from "@/components/theme/theme-provider";
import { currentUser, mainNav } from "@/data/navigation";
import { cn } from "@/lib/cn";

const notices = [
  { title: "Payment from #10322", time: "2 minutes ago" },
  { title: "Refund processed for #00910", time: "1 hour ago" },
  { title: "Delivery scheduled for #44333", time: "Yesterday" },
];

export function Header() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);

  const commands = React.useMemo<CommandItem[]>(
    () => [
      {
        id: "foundations",
        label: "Foundations",
        group: "Pages",
        href: "/",
        keywords: "home palette",
        icon: <Compass />,
      },
      {
        id: "components",
        label: "Components",
        group: "Pages",
        href: "/examples/components",
        icon: <LayoutGrid />,
      },
      {
        id: "charts",
        label: "Charts",
        group: "Pages",
        href: "/examples/charts",
        icon: <BarChart3 />,
      },
      {
        id: "widgets",
        label: "Widgets",
        group: "Pages",
        href: "/examples/widgets",
        icon: <LayoutDashboard />,
      },
      {
        id: "calendar",
        label: "Calendar",
        group: "Pages",
        href: "/examples/calendar",
        icon: <Calendar />,
      },
      {
        id: "settings",
        label: "Settings",
        group: "Pages",
        href: "/examples/settings",
        keywords: "profile",
        icon: <Settings />,
      },
      { id: "signin", label: "Sign in", group: "Account", href: "/signin", icon: <LogIn /> },
      { id: "signup", label: "Sign up", group: "Account", href: "/signup", icon: <UserPlus /> },
      {
        id: "light",
        label: "Use light theme",
        group: "Theme",
        keywords: "skin day",
        icon: <Sun />,
        onSelect: () => setTheme("light"),
      },
      {
        id: "dark",
        label: "Use dark theme",
        group: "Theme",
        keywords: "skin night",
        icon: <Moon />,
        onSelect: () => setTheme("dark"),
      },
    ],
    [setTheme],
  );

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
            {mainNav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-sm px-3 py-2 text-[13px] text-text-2 hover:text-primary",
                    active && "font-medium text-primary",
                  )}
                >
                  {item.label}
                </Link>
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
                  <Avatar initials={currentUser.initials} size="sm" alt={currentUser.name} />
                </button>
              </MenuTrigger>
              <MenuContent>
                <MenuLabel>{currentUser.name}</MenuLabel>
                <MenuItem disabled>{currentUser.email}</MenuItem>
                <MenuSeparator />
                <MenuItem asChild>
                  <Link href="/examples/settings">Settings</Link>
                </MenuItem>
                <MenuItem asChild>
                  <Link href="/signin">Sign in</Link>
                </MenuItem>
                <MenuItem asChild>
                  <Link href="/signup">Sign up</Link>
                </MenuItem>
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
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-sm px-3 py-2 text-sm text-text-2 hover:bg-[color-mix(in_srgb,var(--heading)_6%,transparent)]"
                >
                  {item.label}
                </Link>
              ))}
            </DialogBody>
          </DialogContent>
        </Dialog>
      </header>
      <CommandBar shortcut open={commandOpen} onOpenChange={setCommandOpen} items={commands} />
    </>
  );
}
