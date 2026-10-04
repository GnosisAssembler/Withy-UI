import { PageHeader } from "@/components/organisms/page-header";
import { CalendarMonth } from "@/components/organisms/calendar-month";
import { DashboardShell } from "@/components/templates/dashboard-shell";

export function CalendarPageTemplate() {
  return (
    <DashboardShell>
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/examples/calendar" }, { label: "Calendar" }]}
        title="Calendar"
        description="October 2026, with the current day marked and the day's agenda beside the month."
      />
      <CalendarMonth />
    </DashboardShell>
  );
}
