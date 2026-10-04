"use client";

import * as React from "react";
import { Text } from "@/components/atoms/text";
import { Tabs, TabsList, TabsTrigger } from "@/components/molecules/tabs";
import { AreaChart } from "@/components/organisms/area-chart";
import { BarChart } from "@/components/organisms/bar-chart";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/organisms/card";
import { ComboChart } from "@/components/organisms/combo-chart";
import { HeatmapChart } from "@/components/organisms/heatmap-chart";
import { PageHeader } from "@/components/organisms/page-header";
import { RadarChart } from "@/components/organisms/radar-chart";
import { DashboardShell } from "@/components/templates/dashboard-shell";
import {
  channelRevenue,
  channelScores,
  conversionRate,
  demandCells,
  hours,
  months,
  orderVolume,
  qualityAxes,
  weekdays,
  weeklyOrders,
} from "@/data/charts";

export function ChartsGalleryTemplate() {
  const [areaMode, setAreaMode] = React.useState<"stacked" | "overlay">("stacked");

  return (
    <DashboardShell>
      <PageHeader
        crumbs={[{ label: "Dashboard", href: "/examples/charts" }, { label: "Charts" }]}
        title="Charts"
        description="Multi-series areas, bars, a demand heatmap, and mixed charts colored with the Sprig palette."
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
      </div>
    </DashboardShell>
  );
}
