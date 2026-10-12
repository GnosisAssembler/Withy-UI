"use client";

import { BarChart3, MousePointerClick, Server, Users } from "lucide-react";
import { Text } from "../../atoms/text";
import { stateSales } from "../../../data/widgets";
import { Sparkline } from "../../atoms/sparkline";
import { MetricTile } from "../../molecules/metric-tile";
import { IconStats } from "../../organisms/icon-stats";
import { KpiCards } from "../../organisms/kpi-cards";
import { RevenueMap } from "../../organisms/revenue-map";
import { ShareCards } from "../../organisms/share-cards";
import { SparkKpi } from "../../organisms/spark-kpi";
import { ChannelSplit, SplitKpi } from "../../organisms/split-kpi";
import { StatStrip } from "../../organisms/stat-strip";
import { StatusKpi } from "../../organisms/status-kpi";
import { UsageMeters } from "../../organisms/usage-meters";
import type { ComponentDoc } from "./types";

function ExampleLabel({ children }: { children: string }) {
  return (
    <Text size="sm" weight="medium" tone="secondary" className="mb-2">
      {children}
    </Text>
  );
}

export const widgetDocs = [
  {
    slug: "sparkline",
    name: "Sparkline",
    category: "Widgets",
    description: "A sparkline shows the shape of a trend in a small space. Name what it shows.",
    imports: ["Sparkline"],
    code: `<Sparkline data={[8, 12, 10, 14, 13, 18]} label="Weekly revenue trend" />`,
    Demo: () => (
      <div className="max-w-xs rounded-sm border border-border px-4 py-3">
        <p className="text-[13px] font-medium text-heading">Weekly revenue</p>
        <Sparkline
          className="mt-2"
          data={[8, 12, 10, 14, 13, 18, 16, 21, 19, 24]}
          label="Weekly revenue trend"
        />
      </div>
    ),
  },
  {
    slug: "metric-tile",
    name: "Metric tile",
    category: "Widgets",
    description: "A metric tile shows one figure with an icon and a label.",
    imports: ["MetricTile"],
    code: `<MetricTile icon={<BarChart3 />} value="33.50%" label="Bounce rate" />`,
    Demo: () => (
      <div className="flex flex-wrap gap-6">
        <MetricTile icon={<BarChart3 />} value="33.50%" label="Bounce rate" />
        <MetricTile icon={<Users />} value="9,065" label="Page sessions" tone="muted" />
      </div>
    ),
  },
  {
    slug: "revenue-map",
    name: "Revenue map",
    category: "Widgets",
    description:
      "A revenue map shows sales by United States state and lists the five states with the highest earnings. Point at a state, or focus the map and use the arrow keys, to read its earnings.",
    imports: ["RevenueMap"],
    from: "withy-ui/widgets",
    code: `<RevenueMap
  label="United States sales map"
  rows={[
    { id: "CA", orders: 12201, earnings: 150200.8 },
    { id: "NY", orders: 8560, earnings: 117087.5 },
  ]}
/>`,
    Demo: () => <RevenueMap rows={stateSales} className="max-w-xl" />,
  },
  {
    slug: "kpi-cards",
    name: "KPI cards",
    category: "Widgets",
    description:
      "A grid of metric cards. Each card has a label, a figure, and an optional change. Choose a variant for a badge, a previous figure, a footer link, or a color rail. An increase is green and a decrease is red, unless you set a tone because the rise is a problem.",
    imports: ["KpiCards"],
    from: "withy-ui/widgets",
    code: `<KpiCards
  label="Audience"
  items={[
    { label: "Unique visitors", value: "10,450", change: { value: "-12.5%", direction: "down" } },
    {
      label: "Bounce rate",
      value: "56.1%",
      change: { value: "+1.8%", direction: "up", tone: "danger" },
    },
  ]}
/>`,
    Demo: () => (
      <div className="flex flex-col gap-8">
        <div>
          <ExampleLabel>Inline</ExampleLabel>
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
        </div>
        <div>
          <ExampleLabel>Badge</ExampleLabel>
          <KpiCards
            label="Activity"
            variant="badge"
            items={[
              {
                label: "Daily active users",
                value: "3,450",
                previous: "3,080",
                change: { value: "+12.1%", direction: "up" },
              },
              {
                label: "Weekly sessions",
                value: "1,342",
                change: { value: "-9.8%", direction: "down" },
              },
              { label: "Duration", value: "5.2 min", change: { value: "+7.7%", direction: "up" } },
            ]}
          />
        </div>
        <div>
          <ExampleLabel>Stacked</ExampleLabel>
          <KpiCards
            label="Revenue summary"
            variant="stacked"
            items={[
              {
                label: "Recurring revenue",
                value: "$34.1K",
                change: { value: "+6.1%", direction: "up" },
              },
              {
                label: "Total users",
                value: "500.1K",
                change: { value: "+19.2%", direction: "up" },
              },
              {
                label: "User growth",
                value: "11.3%",
                change: { value: "-1.2%", direction: "down" },
              },
            ]}
          />
        </div>
        <div>
          <ExampleLabel>Linked</ExampleLabel>
          <KpiCards
            label="Revenue links"
            variant="linked"
            items={[
              {
                label: "Monthly recurring revenue",
                value: "$34.1K",
                href: "/revenue",
                change: { value: "+6.1%", direction: "up" },
              },
              {
                label: "Users",
                value: "500.1K",
                href: "/users",
                change: { value: "+19.2%", direction: "up" },
              },
              {
                label: "User growth",
                value: "11.3%",
                href: "/growth",
                change: { value: "-1.2%", direction: "down" },
              },
            ]}
          />
        </div>
        <div>
          <ExampleLabel>Comparison</ExampleLabel>
          <KpiCards
            label="Monthly comparison"
            variant="comparison"
            items={[
              {
                label: "Monthly active users",
                value: "340",
                previous: "400",
                change: { value: "-15%", direction: "down" },
              },
              {
                label: "Monthly sessions",
                value: "672",
                previous: "350",
                change: { value: "+91.4%", direction: "up" },
              },
              {
                label: "Monthly page views",
                value: "3,290",
                previous: "3,012",
                change: { value: "+9.2%", direction: "up" },
              },
            ]}
          />
        </div>
        <div>
          <ExampleLabel>Delta</ExampleLabel>
          <KpiCards
            label="Previous month"
            variant="delta"
            items={[
              {
                label: "Monthly active users",
                value: "340",
                previous: "400",
                hint: "from the previous month",
                change: { value: "15%", direction: "down" },
              },
              {
                label: "Monthly sessions",
                value: "672",
                previous: "350",
                hint: "from the previous month",
                change: { value: "91.4%", direction: "up" },
              },
              {
                label: "Monthly page views",
                value: "3,290",
                previous: "3,012",
                hint: "from the previous month",
                change: { value: "9.2%", direction: "up" },
              },
            ]}
          />
        </div>
        <div>
          <ExampleLabel>Accent</ExampleLabel>
          <KpiCards
            label="Accented metrics"
            variant="accent"
            items={[
              {
                label: "Monthly active users",
                value: "996",
                accent: "cyan",
                change: { value: "+1.3%", direction: "up" },
              },
              {
                label: "Monthly sessions",
                value: "1,672",
                accent: "indigo",
                change: { value: "+9.1%", direction: "up" },
              },
              {
                label: "Monthly user growth",
                value: "5.1%",
                accent: "pink",
                change: { value: "-4.8%", direction: "down" },
              },
            ]}
          />
        </div>
      </div>
    ),
  },
  {
    slug: "stat-strip",
    name: "Stat strip",
    category: "Widgets",
    description:
      "One bordered strip of figures. On a narrow screen the cells stack. Each cell can show a unit or the previous figure.",
    imports: ["StatStrip"],
    from: "withy-ui/widgets",
    code: `<StatStrip
  label="Deploys"
  items={[
    { label: "Number of deploys", value: "405", previous: "401" },
    { label: "Average deploy time", value: "3.65", unit: "mins" },
    { label: "Number of servers", value: "3" },
    { label: "Success rate", value: "98.5%" },
  ]}
/>`,
    Demo: () => (
      <StatStrip
        label="Deploys"
        items={[
          { label: "Number of deploys", value: "405", previous: "401" },
          { label: "Average deploy time", value: "3.65", unit: "mins" },
          { label: "Number of servers", value: "3" },
          { label: "Success rate", value: "98.5%" },
        ]}
      />
    ),
  },
  {
    slug: "icon-stats",
    name: "Icon stats",
    category: "Widgets",
    description:
      "A metric card with a decorative icon, a figure, a change, and a link to the detail. The label names the metric.",
    imports: ["IconStats"],
    from: "withy-ui/widgets",
    code: `import { Users } from "lucide-react";

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
  ]}
/>`,
    Demo: () => (
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
    ),
  },
  {
    slug: "status-kpi",
    name: "Status KPI",
    category: "Widgets",
    description:
      "A metric with a status. Within, observe, and critical use success, warning, and danger. Add goals to show a linked status row instead of a chip.",
    imports: ["StatusKpi"],
    from: "withy-ui/widgets",
    code: `<StatusKpi
  label="Operating range"
  items={[
    { label: "Daily active users", value: "345", status: "within", detail: "200–410" },
    { label: "Europe", value: "$10,023", status: "observe", goals: "3 of 5 goals", href: "/europe" },
  ]}
/>`,
    Demo: () => (
      <div className="flex flex-col gap-8">
        <div>
          <ExampleLabel>Range</ExampleLabel>
          <StatusKpi
            label="Operating range"
            items={[
              { label: "Daily active users", value: "345", status: "within", detail: "200–410" },
              { label: "Weekly sessions", value: "254", status: "critical", detail: "550–1,200" },
              { label: "Open issues", value: "34", status: "observe", detail: "10–25" },
            ]}
          />
        </div>
        <div>
          <ExampleLabel>Goals</ExampleLabel>
          <StatusKpi
            label="Regional goals"
            items={[
              {
                label: "Europe",
                value: "$10,023",
                status: "observe",
                goals: "3 of 5 goals",
                href: "/europe",
              },
              {
                label: "North America",
                value: "$14,092",
                status: "within",
                goals: "5 of 5 goals",
                href: "/north-america",
              },
              {
                label: "Asia",
                value: "$113,232",
                status: "critical",
                goals: "1 of 5 goals",
                href: "/asia",
              },
            ]}
          />
        </div>
      </div>
    ),
  },
  {
    slug: "usage-meters",
    name: "Usage meters",
    category: "Widgets",
    description:
      "How much of a limit is used. Bar shows a progress bar, ring shows a circle, budget adds a footer link, and score colors the ring from the value.",
    imports: ["UsageMeters"],
    from: "withy-ui/widgets",
    code: `<UsageMeters
  label="Allowances"
  items={[
    { label: "Requests", value: 9.96, current: "996", limit: "10,000" },
    { label: "Credits", value: 67.2, current: "$672", limit: "$1,000" },
    { label: "Storage", value: 18.5, current: "1.85", limit: "10 GB" },
  ]}
/>`,
    Demo: () => (
      <div className="flex flex-col gap-8">
        <div>
          <ExampleLabel>Bar</ExampleLabel>
          <UsageMeters
            label="Allowances"
            items={[
              { label: "Requests", value: 9.96, current: "996", limit: "10,000" },
              { label: "Credits", value: 67.2, current: "$672", limit: "$1,000" },
              { label: "Storage", value: 18.5, current: "1.85", limit: "10 GB" },
            ]}
          />
        </div>
        <div>
          <ExampleLabel>Ring</ExampleLabel>
          <UsageMeters
            label="Plan usage"
            variant="ring"
            title="Plan overview"
            titleAs="h3"
            description="You are on the starter plan."
            action={{ label: "View other plans", href: "/plans" }}
            items={[
              { label: "Workspaces", value: 20, current: "1", limit: "5" },
              { label: "Dashboards", value: 10, current: "2", limit: "20" },
              { label: "Chart widgets", value: 0, current: "0", limit: "50" },
            ]}
          />
        </div>
        <div>
          <ExampleLabel>Budget</ExampleLabel>
          <UsageMeters
            label="Budgets"
            variant="budget"
            items={[
              { label: "Budget HR", value: 25, current: "$250", limit: "$1,000", href: "/hr" },
              {
                label: "Budget Marketing",
                value: 55,
                current: "$550",
                limit: "$1,000",
                href: "/marketing",
              },
              {
                label: "Budget Finance",
                value: 85,
                current: "$850",
                limit: "$1,000",
                href: "/finance",
              },
            ]}
          />
        </div>
        <div>
          <ExampleLabel>Score</ExampleLabel>
          <UsageMeters
            label="Web vitals"
            variant="score"
            title="Web vitals"
            titleAs="h3"
            description="Scores from the latest crawl of the marketing site."
            items={[
              { label: "Performance", value: 91 },
              { label: "Accessibility", value: 65 },
              { label: "SEO", value: 43 },
            ]}
          />
        </div>
      </div>
    ),
  },
  {
    slug: "spark-kpi",
    name: "Spark KPI",
    category: "Widgets",
    description:
      "A quote card with the latest figure, the change, and a sparkline. Include the sign in the change so the direction is not carried by color alone.",
    imports: ["SparkKpi"],
    from: "withy-ui/widgets",
    code: `<SparkKpi
  label="Quotes"
  items={[
    {
      label: "Baer Limited",
      symbol: "BAL",
      value: "$49.33",
      change: "-9.85",
      changePercent: "-1.9%",
      direction: "down",
      data: [67, 58, 49],
    },
  ]}
/>`,
    Demo: () => (
      <SparkKpi
        label="Quotes"
        items={[
          {
            label: "Baer Limited",
            symbol: "BAL",
            value: "$49.33",
            change: "-9.85",
            changePercent: "-1.9%",
            direction: "down",
            data: [67, 65, 58, 67, 63, 68, 59, 57, 55, 69, 71, 67, 55, 59, 49],
          },
          {
            label: "QuantData Holding",
            symbol: "QDH",
            value: "$129.10",
            change: "+12.10",
            changePercent: "+7.1%",
            direction: "up",
            data: [59, 42, 49, 57, 69, 72, 39, 48, 59, 80, 78, 79, 89, 99, 129],
          },
          {
            label: "Not Normal, Inc.",
            symbol: "NNO",
            value: "$89.80",
            change: "+7.50",
            changePercent: "+1.2%",
            direction: "up",
            data: [36, 49, 42, 39, 41, 49, 38, 45, 39, 53, 68, 69, 72, 79, 89],
          },
        ]}
      />
    ),
  },
  {
    slug: "split-kpi",
    name: "Split KPI",
    category: "Widgets",
    description:
      "A total split into named parts. Legend draws one bar and a swatch list. Rows draws a progress bar for each part.",
    imports: ["SplitKpi"],
    from: "withy-ui/widgets",
    code: `<SplitKpi
  label="Tokens"
  items={[
    {
      label: "Average tokens per request",
      total: "341",
      parts: [
        { label: "Completion tokens", value: "136", amount: 136, color: "cyan" },
        { label: "Prompt tokens", value: "205", amount: 205, color: "indigo" },
      ],
    },
  ]}
/>`,
    Demo: () => (
      <div className="flex flex-col gap-8">
        <div>
          <ExampleLabel>Legend</ExampleLabel>
          <SplitKpi
            label="Tokens"
            items={[
              {
                label: "Average tokens per request",
                total: "341",
                parts: [
                  { label: "Completion tokens", value: "136", amount: 136, color: "cyan" },
                  { label: "Prompt tokens", value: "205", amount: 205, color: "indigo" },
                ],
              },
              {
                label: "Total tokens",
                total: "4,229",
                parts: [
                  { label: "Completion tokens", value: "1,480", amount: 1480, color: "cyan" },
                  { label: "Prompt tokens", value: "2,749", amount: 2749, color: "indigo" },
                ],
              },
            ]}
          />
        </div>
        <div>
          <ExampleLabel>Rows</ExampleLabel>
          <SplitKpi
            label="Token rows"
            layout="rows"
            items={[
              {
                label: "Total tokens by base model",
                total: "2,920",
                parts: [
                  { label: "Completion token", value: "847", amount: 29 },
                  { label: "Prompt token", value: "2,073", amount: 71 },
                ],
              },
            ]}
          />
        </div>
      </div>
    ),
  },
  {
    slug: "channel-split",
    name: "Channel split",
    category: "Widgets",
    description:
      "One total, a bar of its parts, and a card for each part. A part with an href is a link to that channel.",
    imports: ["ChannelSplit"],
    from: "withy-ui/widgets",
    code: `<ChannelSplit
  label="Total sales"
  total="$292,400"
  distributionLabel="Sales channel distribution"
  parts={[
    { label: "Direct sales", value: "$100.5K", amount: 34.4, color: "primary", href: "/direct" },
    { label: "Retail stores", value: "$89.5K", amount: 30.6, color: "orange", href: "/retail" },
  ]}
/>`,
    Demo: () => (
      <div className="max-w-2xl">
        <ChannelSplit
          label="Total sales"
          total="$292,400"
          distributionLabel="Sales channel distribution"
          parts={[
            {
              label: "Direct sales",
              value: "$100.5K",
              amount: 34.4,
              color: "primary",
              href: "/direct",
            },
            {
              label: "Retail stores",
              value: "$89.5K",
              amount: 30.6,
              color: "orange",
              href: "/retail",
            },
            { label: "E-commerce", value: "$61.2K", amount: 20.9, color: "cyan", href: "/web" },
            {
              label: "Wholesale",
              value: "$41.2K",
              amount: 14.1,
              color: "indigo",
              href: "/wholesale",
            },
          ]}
        />
      </div>
    ),
  },
  {
    slug: "share-cards",
    name: "Share cards",
    category: "Widgets",
    description:
      "A headline figure and a list of shares. Each row shows its share, its name, and a detail such as a range. A row with an href is a link.",
    imports: ["ShareCards"],
    from: "withy-ui/widgets",
    code: `<ShareCards
  label="Heart rate"
  items={[
    {
      label: "Running",
      value: "156",
      unit: "bpm",
      shareLabel: "Zone share",
      detailLabel: "BPM range",
      rows: [
        { label: "Endurance", share: "25.5%", detail: "<126", href: "/endurance" },
        { label: "Moderate", share: "35.3%", detail: "126–157", href: "/moderate" },
      ],
    },
  ]}
/>`,
    Demo: () => (
      <ShareCards
        label="Heart rate"
        items={[
          {
            label: "Running",
            value: "156",
            unit: "bpm",
            shareLabel: "Zone share",
            detailLabel: "BPM range",
            rows: [
              { label: "Endurance", share: "25.5%", detail: "<126", href: "/endurance" },
              { label: "Moderate", share: "35.3%", detail: "126–157", href: "/moderate" },
              { label: "Tempo", share: "14.2%", detail: "157–173", href: "/tempo" },
              { label: "Threshold", share: "25.0%", detail: "173–189", href: "/threshold" },
            ],
          },
        ]}
      />
    ),
  },
] as const satisfies readonly ComponentDoc[];
