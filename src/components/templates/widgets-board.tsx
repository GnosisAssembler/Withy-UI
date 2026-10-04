import {
  AcquisitionPanel,
  ComplaintsPanel,
  SatisfactionScore,
  TicketStatus,
} from "@/components/organisms/insight-cards";
import { PageHeader } from "@/components/organisms/page-header";
import { RevenueMap } from "@/components/organisms/revenue-map";
import { DashboardShell } from "@/components/templates/dashboard-shell";
import { stateSales } from "@/data/widgets";

export function WidgetsBoardTemplate() {
  return (
    <DashboardShell>
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/examples/widgets" }, { label: "Widgets" }]}
        title="Widgets"
        description="Map, score, acquisition, complaints, and ticket widgets."
      />
      <div className="grid gap-2.5 xl:grid-cols-2">
        <RevenueMap rows={stateSales} />
        <SatisfactionScore />
        <AcquisitionPanel />
        <ComplaintsPanel />
        <div className="xl:col-span-2">
          <TicketStatus />
        </div>
      </div>
    </DashboardShell>
  );
}
