import type { Metadata } from "next";
import { WidgetsBoardTemplate } from "@/components/templates/widgets-board";

export const metadata: Metadata = {
  title: "Widgets",
};

export default function WidgetsPage() {
  return <WidgetsBoardTemplate />;
}
