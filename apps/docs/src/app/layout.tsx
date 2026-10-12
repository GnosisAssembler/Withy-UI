import type { Metadata } from "next";
import type { ReactNode } from "react";
import { themeBootScript, Wraith } from "withy-ui";
import { DocsProviders } from "./docs-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Withy UI",
    template: "%s · Withy UI",
  },
  description: "Withy UI is a Radix and Tailwind design system for dashboards, apps, and pages.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className="h-full">
      <body className="min-h-full font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <DocsProviders>{children}</DocsProviders>
        <Wraith className="fixed right-2 bottom-2 z-30 max-md:[--withy-wraith-px:2px] print:hidden" />
      </body>
    </html>
  );
}
