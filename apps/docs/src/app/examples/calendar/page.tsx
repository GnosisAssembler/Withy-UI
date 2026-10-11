import type { Metadata } from "next";
import { CalendarPageTemplate } from "sprig-design-system/examples";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function CalendarPage() {
  return <CalendarPageTemplate />;
}
