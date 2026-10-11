import {
  AcquisitionPanel,
  ComplaintsPanel,
  SatisfactionScore,
  TicketStatus,
} from "../organisms/insight-cards";
import { PageHeader } from "../organisms/page-header";
import { RevenueMap } from "../organisms/revenue-map";
import { DashboardShell } from "./dashboard-shell";
import {
  acquisitionCategories,
  acquisitionSeries,
  complaintCategories,
  complaintSeries,
  satisfactionSegments,
  stateSales,
  ticketBars,
  ticketDates,
  ticketLine,
  ticketTotals,
} from "../../data/widgets";

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
        <SatisfactionScore score="9.8" change="1.6%" segments={satisfactionSegments} />
        <AcquisitionPanel
          bounceRate="33.50%"
          sessions="9,065"
          categories={acquisitionCategories}
          series={acquisitionSeries}
        />
        <ComplaintsPanel categories={complaintCategories} series={complaintSeries} />
        <div className="xl:col-span-2">
          <TicketStatus
            categories={ticketDates}
            bars={ticketBars}
            line={ticketLine}
            totals={ticketTotals}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
