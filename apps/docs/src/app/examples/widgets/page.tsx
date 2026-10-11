import type { Metadata } from "next";
import { WidgetsBoardTemplate } from "sprig-design-system/examples";

export const metadata: Metadata = {
  title: "Widgets",
};

export default function WidgetsPage() {
  return <WidgetsBoardTemplate />;
}
