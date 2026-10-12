import type { Meta, StoryObj } from "@storybook/react-vite";
import { MousePointerClick, Server, Users } from "lucide-react";
import { IconStats } from "./icon-stats";
import { KpiCards } from "./kpi-cards";
import { ShareCards } from "./share-cards";
import { SparkKpi } from "./spark-kpi";
import { ChannelSplit, SplitKpi } from "./split-kpi";
import { StatStrip } from "./stat-strip";
import { StatusKpi } from "./status-kpi";
import { UsageMeters } from "./usage-meters";

const meta = {
  title: "Widgets/Key metrics",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  render: () => (
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
        { label: "Visit duration", value: "5.2 min", change: { value: "+19.7%", direction: "up" } },
      ]}
    />
  ),
};

export const Badge: Story = {
  render: () => (
    <KpiCards
      label="Activity"
      variant="badge"
      items={[
        {
          label: "Daily active users",
          value: "3,450",
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
  ),
};

export const Deploys: Story = {
  render: () => (
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
};

export const Subscribers: Story = {
  render: () => (
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
};

export const OperatingRange: Story = {
  render: () => (
    <StatusKpi
      label="Operating range"
      items={[
        { label: "Daily active users", value: "345", status: "within", detail: "200–410" },
        { label: "Weekly sessions", value: "254", status: "critical", detail: "550–1,200" },
        {
          label: "Europe",
          value: "$10,023",
          status: "observe",
          goals: "3 of 5 goals",
          href: "/europe",
        },
      ]}
    />
  ),
};

export const Allowances: Story = {
  render: () => (
    <UsageMeters
      label="Allowances"
      items={[
        { label: "Requests", value: 9.96, current: "996", limit: "10,000" },
        { label: "Credits", value: 67.2, current: "$672", limit: "$1,000" },
        { label: "Storage", value: 18.5, current: "1.85", limit: "10 GB" },
      ]}
    />
  ),
};

export const Quotes: Story = {
  render: () => (
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
      ]}
    />
  ),
};

export const TokenSplit: Story = {
  render: () => (
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
  ),
};

export const SalesChannels: Story = {
  render: () => (
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
};

export const HeartRate: Story = {
  render: () => (
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
};
