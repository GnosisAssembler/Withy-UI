"use client";

import { AreaChart } from "../../organisms/area-chart";
import { BarChart } from "../../organisms/bar-chart";
import { BarList } from "../../organisms/bar-list";
import { BubbleChart } from "../../organisms/bubble-chart";
import { CategoryBar } from "../../organisms/category-bar";
import { ComboChart } from "../../organisms/combo-chart";
import { DonutChart } from "../../organisms/donut-chart";
import { HeatmapChart } from "../../organisms/heatmap-chart";
import { LineChart } from "../../organisms/line-chart";
import { RadarChart } from "../../organisms/radar-chart";
import { TimelineChart } from "../../organisms/timeline-chart";
import { TreemapChart } from "../../organisms/treemap-chart";
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
} from "../../../data/charts";
import type { ComponentDoc } from "./types";

const chartFrom = "withy-ui/charts";

export const chartDocs = [
  {
    slug: "area-chart",
    name: "Area chart",
    category: "Charts",
    description:
      "An area chart shows how named series change over categories. It is stacked and filled unless you say otherwise.",
    imports: ["AreaChart"],
    from: chartFrom,
    code: `<AreaChart
  label="Revenue by channel"
  categories={["Jan", "Feb", "Mar"]}
  series={[
    { name: "Direct", data: [38, 41, 44], color: "primary" },
    { name: "Organic", data: [24, 26, 33], color: "teal" },
  ]}
/>`,
    Demo: () => (
      <AreaChart
        className="h-64"
        label="Revenue by channel"
        categories={months}
        series={channelRevenue}
      />
    ),
  },
  {
    slug: "line-chart",
    name: "Line chart",
    category: "Charts",
    description:
      "A line chart compares named series over categories. Each value has a point, and the line is not filled.",
    imports: ["LineChart"],
    from: chartFrom,
    code: `<LineChart
  label="Active accounts"
  categories={["Jan", "Feb", "Mar"]}
  series={[
    { name: "Paid", data: [120, 128, 135], color: "primary" },
    { name: "Free", data: [340, 352, 361], color: "cyan" },
  ]}
/>`,
    Demo: () => (
      <LineChart
        className="h-64"
        label="Active accounts"
        categories={months}
        series={activeAccounts}
      />
    ),
  },
  {
    slug: "bar-chart",
    name: "Bar chart",
    category: "Charts",
    description: "A bar chart compares named series across categories.",
    imports: ["BarChart"],
    from: chartFrom,
    code: `<BarChart
  label="Orders this week"
  categories={["Mon", "Tue", "Wed"]}
  series={[
    { name: "This week", data: [186, 214, 198], color: "primary" },
    { name: "Last week", data: [164, 188, 209], color: "indigo" },
  ]}
/>`,
    Demo: () => (
      <BarChart
        className="h-64"
        label="Orders this week"
        categories={weekdays}
        series={weeklyOrders}
      />
    ),
  },
  {
    slug: "timeline-chart",
    name: "Timeline chart",
    category: "Charts",
    description:
      "A timeline chart draws each task as a horizontal bar from its start to its end. Each series keeps its own lane, and a marker can mark a moment on a bar.",
    imports: ["TimelineChart"],
    from: chartFrom,
    code: `<TimelineChart
  label="Sprint schedule"
  categories={["Design", "Code", "Test"]}
  series={[
    {
      name: "Alice",
      color: "primary",
      data: [
        { category: "Design", start: "2024-03-01", end: "2024-03-03" },
        { category: "Code", start: "2024-03-02", end: "2024-03-05" },
      ],
    },
    {
      name: "Ravi",
      color: "indigo",
      data: [
        {
          category: "Test",
          start: "2024-03-06",
          end: "2024-03-16",
          markers: [{ name: "Break", at: "2024-03-10" }],
        },
      ],
    },
  ]}
/>`,
    Demo: () => (
      <TimelineChart
        className="h-[420px]"
        label="Sprint schedule"
        categories={sprintTasks}
        series={sprintSchedule}
      />
    ),
  },
  {
    slug: "bubble-chart",
    name: "Bubble chart",
    category: "Charts",
    description:
      "A bubble chart plots each point by two values and uses a third value for the bubble size.",
    imports: ["BubbleChart"],
    from: chartFrom,
    code: `<BubbleChart
  label="Account value"
  xLabel="Order value"
  yLabel="Orders"
  sizeLabel="Revenue"
  series={[
    {
      name: "Direct",
      color: "primary",
      data: [{ name: "North", x: 48, y: 220, size: 18 }],
    },
  ]}
/>`,
    Demo: () => (
      <BubbleChart
        className="h-72"
        label="Account value"
        series={accountBubbles}
        xLabel="Order value"
        yLabel="Orders"
        sizeLabel="Revenue"
      />
    ),
  },
  {
    slug: "combo-chart",
    name: "Combo chart",
    category: "Charts",
    description: "A combo chart draws bars and a line on the same categories.",
    imports: ["ComboChart"],
    from: chartFrom,
    code: `<ComboChart
  label="Volume and conversion"
  categories={["Jan", "Feb", "Mar"]}
  bars={{ name: "Orders", data: [980, 1040, 1120], color: "primary" }}
  line={{ name: "Conversion", data: [1.8, 1.9, 2.2], color: "teal" }}
/>`,
    Demo: () => (
      <ComboChart
        className="h-64"
        label="Volume and conversion"
        categories={months}
        bars={orderVolume}
        line={conversionRate}
      />
    ),
  },
  {
    slug: "donut-chart",
    name: "Donut chart",
    category: "Charts",
    description: "A donut chart shows how a total splits across named categories.",
    imports: ["DonutChart"],
    from: chartFrom,
    code: `<DonutChart
  label="Orders by channel"
  data={[
    { name: "Direct", value: 486, color: "primary" },
    { name: "Organic", value: 312, color: "teal" },
  ]}
/>`,
    Demo: () => <DonutChart className="h-64" label="Orders by channel" data={channelShare} />,
  },
  {
    slug: "treemap",
    name: "Treemap",
    category: "Charts",
    description:
      "A treemap splits a total into groups. Tile area shows the value, and each group has its own color.",
    imports: ["TreemapChart"],
    from: chartFrom,
    code: `<TreemapChart
  label="Devices by category"
  valueLabel="Units"
  series={[
    {
      name: "Desktops",
      color: "primary",
      data: [
        { name: "Apple", value: 50 },
        { name: "Acer", value: 30 },
      ],
    },
    {
      name: "Laptops",
      color: "teal",
      data: [{ name: "Dell", value: 21 }],
    },
  ]}
/>`,
    Demo: () => (
      <TreemapChart
        className="h-80"
        label="Devices by category"
        series={deviceTreemap}
        valueLabel="Units"
      />
    ),
  },
  {
    slug: "bar-list",
    name: "Bar list",
    category: "Charts",
    description: "A bar list ranks named values. The longest bar is the largest value.",
    imports: ["BarList"],
    from: chartFrom,
    code: `<BarList
  label="Top pages"
  data={[
    { name: "/pricing", value: 2480 },
    { name: "/docs/charts", value: 1860 },
  ]}
/>`,
    Demo: () => (
      <div className="max-w-md">
        <BarList label="Top pages" data={topPages} />
      </div>
    ),
  },
  {
    slug: "category-bar",
    name: "Category bar",
    category: "Charts",
    description:
      "A category bar splits one total into named shares. A marker can show a value along the bar.",
    imports: ["CategoryBar"],
    from: chartFrom,
    code: `<CategoryBar
  label="Accounts by plan"
  segments={[
    { name: "Free", value: 420, color: "cyan" },
    { name: "Pro", value: 260, color: "primary" },
    { name: "Business", value: 140, color: "indigo" },
  ]}
  marker={{ value: 700, label: "Paid goal" }}
/>`,
    Demo: () => (
      <div className="max-w-md">
        <CategoryBar
          label="Accounts by plan"
          segments={planMix}
          marker={{ value: 700, label: "Paid goal" }}
        />
      </div>
    ),
  },
  {
    slug: "heatmap",
    name: "Heatmap",
    category: "Charts",
    description: "A heatmap shades each cell from low to high across two categories.",
    imports: ["HeatmapChart"],
    from: chartFrom,
    code: `<HeatmapChart
  label="Hourly demand"
  xLabels={["9a", "12p", "3p"]}
  yLabels={["Mon", "Tue"]}
  cells={[
    [0, 0, 24],
    [1, 0, 76],
    [2, 1, 41],
  ]}
  valueLabel="Orders"
/>`,
    Demo: () => (
      <HeatmapChart
        className="h-72"
        label="Hourly demand"
        xLabels={hours}
        yLabels={weekdays}
        cells={demandCells}
        valueLabel="Orders"
      />
    ),
  },
  {
    slug: "radar-chart",
    name: "Radar chart",
    category: "Charts",
    description: "A radar chart compares named series across the same measures.",
    imports: ["RadarChart"],
    from: chartFrom,
    code: `<RadarChart
  label="Channel quality"
  indicators={[
    { name: "Reach", max: 100 },
    { name: "Conversion", max: 100 },
  ]}
  series={[{ name: "Direct", data: [72, 86], color: "primary" }]}
/>`,
    Demo: () => (
      <RadarChart
        className="h-72"
        label="Channel quality"
        indicators={qualityAxes}
        series={channelScores}
      />
    ),
  },
] as const satisfies readonly ComponentDoc[];
