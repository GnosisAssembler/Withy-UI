"use client";

import * as React from "react";
import { Footer } from "../organisms/footer";
import type { HeaderLink } from "../organisms/header";
import { mainNav } from "../../data/navigation";
import { AppShell } from "./app-shell";

export function DashboardShell({
  children,
  nav = mainNav,
  pathname,
}: {
  children: React.ReactNode;
  nav?: HeaderLink[];
  pathname?: string;
}) {
  return (
    <AppShell
      nav={nav}
      pathname={pathname}
      footer={<Footer>© {new Date().getFullYear()} Withy UI. All rights reserved.</Footer>}
    >
      {children}
    </AppShell>
  );
}
