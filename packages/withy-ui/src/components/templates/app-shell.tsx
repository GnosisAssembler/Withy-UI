"use client";

import * as React from "react";
import { Header, type HeaderLink } from "../organisms/header";
import { cn } from "../../lib/cn";

type AppShellProps = {
  children: React.ReactNode;
  nav?: HeaderLink[];
  pathname?: string;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  themeSwitcher?: boolean;
  footer?: React.ReactNode;
};

export function AppShell({
  children,
  nav,
  pathname,
  logo,
  actions,
  themeSwitcher,
  footer,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-text">
      <Header
        nav={nav}
        pathname={pathname}
        logo={logo}
        actions={actions}
        themeSwitcher={themeSwitcher}
      />
      <main
        className={cn(
          "px-5 pt-[80px] pb-5 lg:px-[25px] lg:pt-[85px] xl:px-[30px] xl:pt-[90px]",
          footer ? "min-h-[calc(100vh-117px)]" : "min-h-screen",
        )}
      >
        {children}
      </main>
      {footer}
    </div>
  );
}
