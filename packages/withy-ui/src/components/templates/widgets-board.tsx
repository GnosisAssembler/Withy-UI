import { MousePointerClick, Server, Users } from "lucide-react";
import {
  AcquisitionPanel,
  ComplaintsPanel,
  SatisfactionScore,
  TicketStatus,
} from "../organisms/insight-cards";
import { IconStats } from "../organisms/icon-stats";
import { KpiCards } from "../organisms/kpi-cards";
import { PageHeader } from "../organisms/page-header";
import { RevenueMap } from "../organisms/revenue-map";
import { SparkKpi } from "../organisms/spark-kpi";
import { StatStrip } from "../organisms/stat-strip";
import { StatusKpi } from "../organisms/status-kpi";
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
        crumbs={[
          { label: "Withy UI", href: "/" },
          { label: "Components", href: "/components" },
          { label: "Widgets" },
        ]}
        title="Widgets"
        description="Map, score, acquisition, complaints, tickets, and key metrics."
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
      <div className="mt-8 flex flex-col gap-2.5">
        <StatStrip
          label="Deploys"
          items={[
            { label: "Number of deploys", value: "405", previous: "401" },
            { label: "Average deploy time", value: "3.65", unit: "mins" },
            { label: "Number of servers", value: "3" },
            { label: "Success rate", value: "98.5%" },
          ]}
        />
        <KpiCards
          label="Audience"
          items={[
            {
              label: "Unique visitors",
              value: "10,450",
              change: { value: "-12.5%", direction: "down" },
            },
            {
              label: "Bounce rate",
              value: "56.1%",
              change: { value: "+1.8%", direction: "up", tone: "danger" },
            },
            {
              label: "Visit duration",
              value: "5.2 min",
              change: { value: "+19.7%", direction: "up" },
            },
          ]}
        />
        <div className="grid gap-2.5 xl:grid-cols-2">
          <StatusKpi
            label="Operating range"
            className="lg:grid-cols-1"
            items={[
              { label: "Daily active users", value: "345", status: "within", detail: "200–410" },
              { label: "Weekly sessions", value: "254", status: "critical", detail: "550–1,200" },
              { label: "Open issues", value: "34", status: "observe", detail: "10–25" },
            ]}
          />
          <SparkKpi
            label="Quotes"
            className="lg:grid-cols-1"
            items={[
              {
                label: "Baer Limited",
                symbol: "BAL",
                value: "$49.33",
                change: "-9.85",
                changePercent: "-1.9%",
                direction: "down",
                data: [67, 58, 63, 55, 49],
              },
              {
                label: "QuantData Holding",
                symbol: "QDH",
                value: "$129.10",
                change: "+12.10",
                changePercent: "+7.1%",
                direction: "up",
                data: [59, 69, 80, 99, 129],
              },
            ]}
          />
        </div>
        <IconStats
          label="Subscribers"
          items={[
            {
              label: "Total subscribers",
              value: "71,897",
              icon: <Users />,
              href: "/subscribers",
              change: { value: "122", direction: "up" },
            },
            {
              label: "Avg. open rate",
              value: "58.16%",
              icon: <MousePointerClick />,
              href: "/opens",
              change: { value: "5.4%", direction: "up" },
            },
            {
              label: "Avg. click rate",
              value: "24.57%",
              icon: <Server />,
              href: "/clicks",
              change: { value: "3.2%", direction: "down" },
            },
          ]}
        />
      </div>
    </DashboardShell>
  );
}
