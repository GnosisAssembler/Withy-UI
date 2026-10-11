import type { Metadata } from "next";
import { SettingsPageTemplate } from "sprig-design-system/examples";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return <SettingsPageTemplate />;
}
