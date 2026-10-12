"use client";

import * as React from "react";
import { Text } from "../atoms/text";
import { Tabs, TabsList, TabsTrigger } from "../molecules/tabs";
import { Tracker } from "../molecules/tracker";
import { uptimeTrackerSample } from "../molecules/tracker.sample";
import { AreaChart } from "../organisms/area-chart";
import { BarChart } from "../organisms/bar-chart";
import { BarList } from "../organisms/bar-list";
import { BubbleChart } from "../organisms/bubble-chart";
import { Card, CardBody, CardHeader, CardTitle } from "../organisms/card";
import { CategoryBar } from "../organisms/category-bar";
import { ComboChart } from "../organisms/combo-chart";
import { DonutChart } from "../organisms/donut-chart";
import { HeatmapChart } from "../organisms/heatmap-chart";
import { LineChart } from "../organisms/line-chart";
import { PageHeader } from "../organisms/page-header";
import { RadarChart } from "../organisms/radar-chart";
import { TimelineChart } from "../organisms/timeline-chart";
import { TreemapChart } from "../organisms/treemap-chart";
import { DashboardShell } from "./dashboard-shell";
import {
  accountBubbles,
  activeAccounts,
  channelRevenue,
  channelScores,
  channelShare,
  conversionRate,
  demandCells,
  deviceTreemap,
  hours,
  months,
  orderVolume,
  planMix,
  qualityAxes,
  sprintSchedule,
  sprintTasks,
  topPages,
  weekdays,
  weeklyOrders,
} from "../../data/charts";

export function ChartsGalleryTemplate() {
  const [areaMode, setAreaMode] = React.useState<"stacked" | "overlay">("stacked");

  return (
    <DashboardShell>
      <PageHeader
        crumbs={[
          { label: "Withy UI", href: "/" },
          { label: "Components", href: "/components" },
          { label: "Charts" },
        ]}
        title="Charts"
        description="Areas, lines, bars, bubbles, timelines, a treemap, a donut, ranked lists, a demand heatmap, mixed charts, and a status tracker colored with the Withy UI palette."
      />
      <div className="grid gap-2.5 xl:grid-cols-6">
        <Card className="min-w-0 xl:col-span-6">
          <CardHeader>
            <div>
              <CardTitle>Revenue by channel</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Monthly revenue, in thousands of USD
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <Tabs
              value={areaMode}
              onValueChange={(value) => setAreaMode(value === "overlay" ? "overlay" : "stacked")}
            >
              <TabsList>
                <TabsTrigger value="stacked">Stacked</TabsTrigger>
                <TabsTrigger value="overlay">Overlay</TabsTrigger>
              </TabsList>
            </Tabs>
            <AreaChart
              className="mt-4 h-[320px]"
              categories={months}
              series={channelRevenue}
              stacked={areaMode === "stacked"}
              label="Revenue by channel"
            />
          </CardBody>
        </Card>
        <Card className="min-w-0 xl:col-span-6">
          <CardHeader>
            <div>
              <CardTitle>Active accounts</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Paid and free accounts, by month
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <LineChart
              className="h-[320px]"
              categories={months}
              series={activeAccounts}
              label="Active accounts"
            />
          </CardBody>
        </Card>
        <Card className="min-w-0 xl:col-span-4">
          <CardHeader>
            <div>
              <CardTitle>Hourly demand</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Orders by weekday and hour
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <HeatmapChart
              className="h-[340px]"
              xLabels={hours}
              yLabels={weekdays}
              cells={demandCells}
              label="Hourly demand"
              valueLabel="Orders"
            />
          </CardBody>
        </Card>
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Channel quality</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Five scores, side by side
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <RadarChart
              className="h-[340px]"
              indicators={qualityAxes}
              series={channelScores}
              label="Channel quality"
            />
          </CardBody>
        </Card>
        <Card className="min-w-0 xl:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Orders this week</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Completed orders against last week
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <BarChart
              className="h-[280px]"
              categories={weekdays}
              series={weeklyOrders}
              label="Orders this week"
            />
          </CardBody>
        </Card>
        <Card className="min-w-0 xl:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Volume and conversion</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Orders on the left, conversion rate on the right
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <ComboChart
              className="h-[280px]"
              categories={months}
              bars={orderVolume}
              line={conversionRate}
              label="Volume and conversion"
            />
          </CardBody>
        </Card>
        <Card className="min-w-0 xl:col-span-6">
          <CardHeader>
            <div>
              <CardTitle>Account value</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Order value across, orders up. Bubble size is revenue, in thousands.
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <BubbleChart
              className="h-[320px]"
              series={accountBubbles}
              label="Account value"
              xLabel="Order value"
              yLabel="Orders"
              sizeLabel="Revenue"
            />
          </CardBody>
        </Card>
        <Card className="min-w-0 xl:col-span-6">
          <CardHeader>
            <div>
              <CardTitle>Devices by category</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Units in each category. Tile size is the count.
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <TreemapChart
              className="h-[360px]"
              series={deviceTreemap}
              label="Devices by category"
              valueLabel="Units"
            />
          </CardBody>
        </Card>
        <Card className="min-w-0 xl:col-span-6">
          <CardHeader>
            <div>
              <CardTitle>Sprint schedule</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Tasks by teammate. A mark shows a break.
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <TimelineChart
              className="h-[450px]"
              categories={sprintTasks}
              series={sprintSchedule}
              label="Sprint schedule"
            />
          </CardBody>
        </Card>
        <Card className="flex h-full min-w-0 flex-col xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Orders by channel</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Share of orders this year
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <DonutChart className="h-[280px]" data={channelShare} label="Orders by channel" />
          </CardBody>
        </Card>
        <Card className="flex h-full min-w-0 flex-col xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Top pages</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Visits in the last 7 days
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <BarList label="Top pages" data={topPages} />
          </CardBody>
        </Card>
        <Card className="flex h-full min-w-0 flex-col xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Accounts by plan</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                Share of accounts, with the paid goal marked
              </Text>
            </div>
          </CardHeader>
          <CardBody className="flex flex-1 items-center">
            <CategoryBar
              className="w-full"
              label="Accounts by plan"
              segments={planMix}
              marker={{ value: 700, label: "Paid goal" }}
            />
          </CardBody>
        </Card>
        <Card className="min-w-0 xl:col-span-6">
          <CardHeader>
            <div>
              <CardTitle>API uptime</CardTitle>
              <Text tone="muted" size="xs" className="mt-0.5">
                One block per day for the last 90 days
              </Text>
            </div>
          </CardHeader>
          <CardBody>
            <Tracker label="API uptime, last 90 days" data={uptimeTrackerSample(90)} hoverEffect />
          </CardBody>
        </Card>
      </div>
    </DashboardShell>
  );
}
