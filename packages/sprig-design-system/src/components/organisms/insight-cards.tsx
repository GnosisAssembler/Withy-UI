"use client";

import { ArrowDown, ArrowUp, BarChart3 } from "lucide-react";
import { Text } from "../atoms/text";
import { MetricTile } from "../molecules/metric-tile";
import { SegmentedMeter } from "../molecules/segmented-meter";
import { Select } from "../molecules/select";
import { AreaChart } from "./area-chart";
import { Card, CardBody, CardHeader, CardTitle } from "./card";
import { useChartTheme } from "./chart";
import { ComboChart } from "./combo-chart";
import { cn } from "../../lib/cn";
import type { ChartSeries } from "../../lib/chart-theme";
import type { MeterSegment } from "../molecules/segmented-meter";
import * as React from "react";

export function SatisfactionScore({
  score,
  change,
  segments,
}: {
  score: string;
  change: string;
  segments: MeterSegment[];
}) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Customer satisfaction</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="flex items-end gap-2">
          <p className="font-rubik text-4xl leading-none text-heading">{score}</p>
          <p className="pb-1 text-[13px] font-medium text-success">
            {change} <ArrowUp className="inline size-3" />
          </p>
        </div>
        <p className="mt-3 mb-3 font-inter text-[10px] font-semibold tracking-[0.5px] text-text-3 uppercase">
          Performance score
        </p>
        <SegmentedMeter segments={segments} label="Customer satisfaction breakdown" />
      </CardBody>
    </Card>
  );
}

export function AcquisitionPanel({
  bounceRate,
  sessions,
  categories,
  series,
  learnMoreHref = "/examples/charts",
}: {
  bounceRate: string;
  sessions: string;
  categories: string[];
  series: ChartSeries[];
  learnMoreHref?: string;
}) {
  const theme = useChartTheme();
  const themed = [
    { ...series[0]!, swatch: series[0]?.swatch ?? theme.muted },
    { ...series[1]!, color: series[1]?.color ?? ("primary" as const) },
  ];

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Acquisition</CardTitle>
      </CardHeader>
      <CardBody className="pb-0">
        <Text tone="muted" size="sm">
          Tells you where your visitors originated from, such as search engines, social networks or
          website referrals.{" "}
          <a href={learnMoreHref} className="font-medium text-primary">
            Learn more
          </a>
        </Text>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <MetricTile icon={<BarChart3 />} value={bounceRate} label="Bounce rate" />
          <MetricTile icon={<BarChart3 />} value={sessions} label="Page sessions" tone="muted" />
        </div>
        <AreaChart
          className="-mx-5 mt-4 h-36"
          categories={categories}
          series={themed}
          stacked={false}
          legend={false}
          axes="none"
          label="Acquisition trend"
          valueFormatter={(value) => String(value)}
        />
      </CardBody>
    </Card>
  );
}

export function ComplaintsPanel({
  categories,
  series,
}: {
  categories: string[];
  series: ChartSeries[];
}) {
  const [range, setRange] = React.useState("month");

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Complaints received</CardTitle>
        <Select
          aria-label="Complaint range"
          value={range}
          onValueChange={setRange}
          fieldSize="sm"
          options={[
            { label: "This month", value: "month" },
            { label: "This week", value: "week" },
          ]}
        />
      </CardHeader>
      <CardBody className="pb-2">
        <div className="flex items-end gap-2">
          <p className="font-rubik text-4xl leading-none text-heading">
            {range === "month" ? "165" : "41"}
          </p>
          <p className="pb-1 text-[13px] text-text-3">
            <span className="font-medium text-success">
              0.3% <ArrowUp className="inline size-3" />
            </span>{" "}
            than last {range === "month" ? "month" : "week"}
          </p>
        </div>
        <Text tone="muted" size="sm" className="mt-3 max-w-xs">
          The total number of complaints that have been received.
        </Text>
        <AreaChart
          className="mt-2 h-40"
          categories={categories}
          series={series}
          stacked={false}
          filled={false}
          legend={false}
          axes="x"
          label="Complaints trend"
          valueFormatter={(value) => String(value)}
        />
      </CardBody>
    </Card>
  );
}

export function TicketStatus({
  categories,
  bars,
  line,
  totals,
  asOf = "as of 10th to 17th of March 2019",
}: {
  categories: string[];
  bars: ChartSeries[];
  line: ChartSeries;
  totals: {
    label: string;
    value: string;
    change: string;
    direction: "up" | "down";
    color: string;
  }[];
  asOf?: string;
}) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <div>
          <CardTitle>Current ticket status</CardTitle>
          <Text tone="muted" size="xs" className="mt-0.5">
            {asOf}
          </Text>
        </div>
      </CardHeader>
      <CardBody>
        <ComboChart
          className="h-72"
          categories={categories}
          bars={bars}
          line={line}
          stackBars
          dualAxis={false}
          lineArea={false}
          barMaxWidth={16}
          barFormatter={(value) => String(value)}
          lineFormatter={(value) => String(value)}
          label="Current ticket status"
        />
        <div className="mt-2 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-3 xl:grid-cols-5">
          {totals.map((item) => (
            <div key={item.label}>
              <p className="font-rubik text-[1.75rem] leading-none text-heading">{item.value}</p>
              <p
                className="mt-2 inline-block border-b-2 pb-0.5 font-inter text-[10px] font-semibold tracking-[0.5px] text-text-3 uppercase"
                style={{ borderColor: item.color }}
              >
                {item.label}
              </p>
              <p
                className={cn(
                  "mt-1 text-[12px]",
                  item.direction === "up" ? "text-success" : "text-danger",
                )}
              >
                {item.change}{" "}
                {item.direction === "up" ? (
                  <ArrowUp className="inline size-3" />
                ) : (
                  <ArrowDown className="inline size-3" />
                )}
              </p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
