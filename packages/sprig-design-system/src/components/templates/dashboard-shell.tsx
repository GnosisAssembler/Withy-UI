"use client";

import * as React from "react";
import {
  BarChart3,
  Calendar,
  Compass,
  LayoutDashboard,
  LayoutGrid,
  LogIn,
  Moon,
  Settings,
  Sun,
  UserPlus,
} from "lucide-react";
import { Footer } from "../organisms/footer";
import { Header, type HeaderLink, type HeaderNotice, type HeaderUser } from "../organisms/header";
import type { CommandItem } from "../organisms/command-bar";
import { useTheme } from "../theme/theme-provider";
import { currentUser, mainNav } from "../../data/navigation";

const notices: HeaderNotice[] = [
  { title: "Payment from #10322", time: "2 minutes ago" },
  { title: "Refund processed for #00910", time: "1 hour ago" },
  { title: "Delivery scheduled for #44333", time: "Yesterday" },
];

const accountLinks: HeaderLink[] = [
  { label: "Settings", href: "/examples/settings" },
  { label: "Sign in", href: "/signin" },
  { label: "Sign up", href: "/signup" },
];

export function DashboardShell({
  children,
  nav = mainNav,
  user = currentUser,
  pathname,
  onNavigate,
}: {
  children: React.ReactNode;
  nav?: HeaderLink[];
  user?: HeaderUser;
  pathname?: string;
  onNavigate?: (href: string) => void;
}) {
  const { setTheme } = useTheme();
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
    <div className="min-h-screen bg-background text-text">
      <Header
        nav={nav}
        user={user}
        pathname={pathname}
        onNavigate={onNavigate}
        commands={commands}
        notices={notices}
        accountLinks={accountLinks}
      />
      <main className="min-h-[calc(100vh-117px)] px-5 pt-[80px] pb-5 lg:px-[25px] lg:pt-[85px] xl:px-[30px] xl:pt-[90px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
