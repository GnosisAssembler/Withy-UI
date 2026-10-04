"use client";

import { ArrowDown, ArrowUp, BarChart3 } from "lucide-react";
import { Text } from "@/components/atoms/text";
import { MetricTile } from "@/components/molecules/metric-tile";
import { SegmentedMeter } from "@/components/molecules/segmented-meter";
import { Select } from "@/components/molecules/select";
import { AreaChart } from "@/components/organisms/area-chart";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/organisms/card";
import { useChartTheme } from "@/components/organisms/chart";
import { ComboChart } from "@/components/organisms/combo-chart";
import { cn } from "@/lib/cn";
import {
  acquisitionCategories,
  acquisitionSeries,
  complaintCategories,
  complaintSeries,
  satisfactionSegments,
  ticketBars,
  ticketDates,
  ticketLine,
  ticketTotals,
} from "@/data/widgets";
import * as React from "react";

export function SatisfactionScore() {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Customer satisfaction</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="flex items-end gap-2">
          <p className="font-rubik text-4xl leading-none text-heading">9.8</p>
          <p className="pb-1 text-[13px] font-medium text-success">
            1.6% <ArrowUp className="inline size-3" />
          </p>
        </div>
        <p className="mt-3 mb-3 font-inter text-[10px] font-semibold tracking-[0.5px] text-text-3 uppercase">
          Performance score
        </p>
        <SegmentedMeter segments={satisfactionSegments} label="Customer satisfaction breakdown" />
      </CardBody>
    </Card>
  );
}

export function AcquisitionPanel() {
  const theme = useChartTheme();
  const series = [
    { ...acquisitionSeries[0]!, swatch: theme.muted },
    { ...acquisitionSeries[1]!, color: "primary" as const },
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
          <a href="/examples/charts" className="font-medium text-primary">
            Learn more
          </a>
        </Text>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <MetricTile icon={<BarChart3 />} value="33.50%" label="Bounce rate" />
          <MetricTile icon={<BarChart3 />} value="9,065" label="Page sessions" tone="muted" />
        </div>
        <AreaChart
          className="-mx-5 mt-4 h-36"
          categories={acquisitionCategories}
          series={series}
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

export function ComplaintsPanel() {
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
          categories={complaintCategories}
          series={complaintSeries}
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

export function TicketStatus() {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <div>
          <CardTitle>Current ticket status</CardTitle>
          <Text tone="muted" size="xs" className="mt-0.5">
            as of 10th to 17th of March 2019
          </Text>
        </div>
      </CardHeader>
      <CardBody>
        <ComboChart
          className="h-72"
          categories={ticketDates}
          bars={ticketBars}
          line={ticketLine}
          stackBars
          dualAxis={false}
          lineArea={false}
          barMaxWidth={16}
          barFormatter={(value) => String(value)}
          lineFormatter={(value) => String(value)}
          label="Current ticket status"
        />
        <div className="mt-2 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-3 xl:grid-cols-5">
          {ticketTotals.map((item) => (
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
