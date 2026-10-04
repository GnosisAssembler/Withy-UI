import type { Metadata } from "next";
import { SettingsPageTemplate } from "@/components/templates/settings-page";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return <SettingsPageTemplate />;
}
