import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ThemeProvider,
  themeBootScript,
  ToastProvider,
  TooltipProvider,
} from "sprig-design-system";
import { DocsProviders } from "./docs-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sprig",
    template: "%s · Sprig",
  },
  description: "Sprig is a Radix and Tailwind design system for dashboards, apps, and pages.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className="h-full">
      <body className="min-h-full font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <ThemeProvider>
          <DocsProviders>
            <TooltipProvider>
              <ToastProvider>{children}</ToastProvider>
            </TooltipProvider>
          </DocsProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
