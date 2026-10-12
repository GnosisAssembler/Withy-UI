"use client";

import * as React from "react";
import { ToastProvider } from "../molecules/toast";
import { TooltipProvider } from "../molecules/tooltip";
import { ThemeProvider } from "./theme-provider";
import {
  WithyLinkProvider,
  WithyNavigationProvider,
  type WithyLinkComponent,
} from "./withy-routing";

function assignLocation(href: string) {
  window.location.assign(href);
}

type WithyProviderProps = {
  children: React.ReactNode;
  linkComponent?: WithyLinkComponent;
  pathname?: string;
  onNavigate?: (href: string) => void;
  tooltipDelay?: number;
};

export function WithyProvider({
  children,
  linkComponent,
  pathname,
  onNavigate,
  tooltipDelay,
}: WithyProviderProps) {
  const content = (
    <ThemeProvider>
      <TooltipProvider delayDuration={tooltipDelay}>
        <ToastProvider>{children}</ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  );

  const routed =
    pathname === undefined && onNavigate === undefined ? (
      content
    ) : (
      <WithyNavigationProvider pathname={pathname ?? ""} onNavigate={onNavigate ?? assignLocation}>
        {content}
      </WithyNavigationProvider>
    );

  return <WithyLinkProvider linkComponent={linkComponent}>{routed}</WithyLinkProvider>;
}
