import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter, Rubik } from "next/font/google";
import { TooltipProvider } from "@/components/molecules/tooltip";
import { ToastProvider } from "@/components/molecules/toast";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { themeBootScript } from "@/lib/theme";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik-family",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-family",
});

export const metadata: Metadata = {
  title: {
    default: "Sprig",
    template: "%s · Sprig",
  },
  description: "Sprig is a Radix and Tailwind design system for dashboards, apps, and pages.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${plex.variable} ${rubik.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <ThemeProvider>
          <TooltipProvider>
            <ToastProvider>{children}</ToastProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
