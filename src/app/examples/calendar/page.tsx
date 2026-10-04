import type { Metadata } from "next";
import { CalendarPageTemplate } from "@/components/templates/calendar-page";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function CalendarPage() {
  return <CalendarPageTemplate />;
}
