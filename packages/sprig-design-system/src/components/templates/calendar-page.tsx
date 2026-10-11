import { calendarEvents, calendarToday } from "../../data/calendar";
import { PageHeader } from "../organisms/page-header";
import { CalendarMonth } from "../organisms/calendar-month";
import { DashboardShell } from "./dashboard-shell";

export function CalendarPageTemplate() {
  return (
    <DashboardShell>
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/examples/calendar" }, { label: "Calendar" }]}
        title="Calendar"
        description="October 2026, with the current day marked and the day's agenda beside the month."
      />
      <CalendarMonth events={calendarEvents} today={calendarToday} />
    </DashboardShell>
  );
}
