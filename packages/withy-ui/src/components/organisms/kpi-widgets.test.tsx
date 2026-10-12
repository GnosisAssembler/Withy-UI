import { render, screen, within } from "@testing-library/react";
import { Users } from "lucide-react";
import { describe, expect, it } from "vitest";
import { IconStats } from "./icon-stats";
import { KpiCards } from "./kpi-cards";
import { ShareCards } from "./share-cards";
import { SparkKpi } from "./spark-kpi";
import { ChannelSplit, SplitKpi } from "./split-kpi";
import { StatStrip } from "./stat-strip";
import { StatusKpi } from "./status-kpi";
import { UsageMeters } from "./usage-meters";

const audience = [
  {
    label: "Unique visitors",
    value: "10,450",
    change: { value: "-12.5%", direction: "down" as const },
  },
  {
    label: "Bounce rate",
    value: "56.1%",
    change: { value: "+1.8%", direction: "up" as const, tone: "danger" as const },
  },
];

describe("KpiCards", () => {
  it("shows the figure beside its change", () => {
    render(<KpiCards label="Audience" items={audience} />);

    expect(screen.getByText("Unique visitors")).toBeInTheDocument();
    expect(screen.getByText("10,450")).toBeInTheDocument();
    expect(screen.getByText("-12.5%")).toHaveClass("text-danger");
    expect(screen.getByText("+1.8%")).toHaveClass("text-danger");
    expect(screen.getByText("Decreased")).toBeInTheDocument();
  });

  it("puts the change in a badge and keeps the previous figure", () => {
    render(
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
        ]}
      />,
    );

    expect(screen.getByText("Daily active users")).toBeInTheDocument();
    expect(screen.getByText("+12.1%")).toBeInTheDocument();
    expect(screen.getByText("from 3,080")).toBeInTheDocument();
    expect(screen.getByText("Increased")).toBeInTheDocument();
  });

  it("links to the metric from the footer", () => {
    render(
      <KpiCards
        label="Revenue"
        variant="linked"
        items={[
          {
            label: "Monthly recurring revenue",
            value: "$34.1K",
            href: "/revenue",
            change: { value: "+6.1%", direction: "up" },
          },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "View monthly recurring revenue" })).toHaveAttribute(
      "href",
      "/revenue",
    );
  });

  it("keeps a leading acronym in the link", () => {
    render(
      <KpiCards
        label="Scores"
        variant="linked"
        items={[{ label: "SEO score", value: "43", href: "/seo" }]}
      />,
    );

    expect(screen.getByRole("link", { name: "View SEO score" })).toHaveAttribute("href", "/seo");
  });

  it("colors the accent rail from the metric color", () => {
    render(
      <KpiCards
        label="Growth"
        variant="accent"
        items={[
          {
            label: "Monthly sessions",
            value: "1,672",
            accent: "cyan",
            change: { value: "+9.1%", direction: "up" },
          },
        ]}
      />,
    );

    expect(screen.getByText("Monthly sessions").closest("div")).toHaveAttribute(
      "style",
      expect.stringContaining("--cyan"),
    );
  });
});

describe("StatStrip", () => {
  it("shows each figure with its earlier value", () => {
    render(
      <StatStrip
        label="Deploys"
        items={[
          { label: "Number of deploys", value: "405", previous: "401" },
          { label: "Average deploy time", value: "3.65", unit: "mins" },
        ]}
      />,
    );

    expect(screen.getByText("Number of deploys")).toBeInTheDocument();
    expect(screen.getByText("405")).toBeInTheDocument();
    expect(screen.getByText("from 401")).toBeInTheDocument();
    expect(screen.getByText("mins")).toBeInTheDocument();
  });
});

describe("IconStats", () => {
  it("names the metric and links to its detail", () => {
    render(
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
      />,
    );

    expect(screen.getByText("Total subscribers")).toBeInTheDocument();
    expect(screen.getByText("71,897")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View total subscribers" })).toHaveAttribute(
      "href",
      "/subscribers",
    );
    expect(
      screen.getByText("Total subscribers").closest("dt")?.querySelector("svg"),
    ).toHaveAttribute("aria-hidden", "true");
  });
});

describe("StatusKpi", () => {
  it("names the range and the goal link", () => {
    render(
      <StatusKpi
        label="Operating range"
        items={[
          { label: "Daily active users", value: "345", status: "within", detail: "200–410" },
          {
            label: "Europe",
            value: "$10,023",
            status: "observe",
            goals: "3 of 5 goals",
            href: "/europe",
          },
        ]}
      />,
    );

    expect(screen.getByText("Within: 200–410")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /3 of 5 goals/ })).toHaveAttribute("href", "/europe");
    expect(screen.getByText("Observe")).toBeInTheDocument();
  });
});

describe("UsageMeters", () => {
  it("shows how much of the limit is used", () => {
    render(
      <UsageMeters
        label="Allowances"
        items={[{ label: "Requests", value: 9.96, current: "996", limit: "10,000" }]}
      />,
    );

    expect(screen.getByRole("progressbar", { name: "Requests used" })).toHaveAttribute(
      "aria-valuenow",
      "9.96",
    );
    expect(screen.getByText("9.96%")).toBeInTheDocument();
    expect(screen.getByText("996 of 10,000")).toBeInTheDocument();
  });

  it("colors a score from its band and names the ring", () => {
    render(
      <UsageMeters
        label="Web vitals"
        variant="score"
        items={[
          { label: "Performance", value: 91 },
          { label: "Accessibility", value: 65 },
          { label: "SEO", value: 43 },
        ]}
      />,
    );

    expect(screen.getByRole("meter", { name: "Performance score" })).toHaveAttribute(
      "aria-valuenow",
      "91",
    );
    expect(screen.getByRole("meter", { name: "SEO score" })).toHaveAttribute("aria-valuenow", "43");
    expect(screen.getByRole("list", { name: "Score bands" })).toBeInTheDocument();
    expect(screen.getAllByText("/100")).toHaveLength(3);
  });

  it("links a budget to its detail", () => {
    render(
      <UsageMeters
        label="Budgets"
        variant="budget"
        items={[{ label: "Budget HR", value: 25, current: "$250", limit: "$1,000", href: "/hr" }]}
      />,
    );

    expect(screen.getByRole("meter", { name: "Budget HR used" })).toHaveAttribute(
      "aria-valuenow",
      "25",
    );
    expect(screen.getByText("$250 / $1,000")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View budget HR" })).toHaveAttribute("href", "/hr");
  });
});

describe("SparkKpi", () => {
  it("names the trend and the direction of the change", () => {
    render(
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
            data: [67, 58, 49],
          },
        ]}
      />,
    );

    expect(screen.getByText("Baer Limited")).toBeInTheDocument();
    expect(screen.getByText("(BAL)")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Baer Limited trend" })).toBeInTheDocument();
    expect(screen.getByText("Decreased")).toBeInTheDocument();
  });
});

describe("SplitKpi", () => {
  it("lists each part of the total", () => {
    render(
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
        ]}
      />,
    );

    expect(screen.getByText("341")).toBeInTheDocument();
    expect(screen.getByText("Completion tokens")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Average tokens per request breakdown/ }),
    ).toBeInTheDocument();
  });

  it("sizes a row to that part's share", () => {
    render(
      <SplitKpi
        label="Tokens"
        layout="rows"
        items={[
          {
            label: "Total tokens",
            total: "100",
            parts: [
              { label: "Completion token", value: "40", amount: 40 },
              { label: "Prompt token", value: "60", amount: 60 },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByRole("progressbar", { name: "Completion token share" })).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
    expect(screen.getByText("(60%)")).toBeInTheDocument();
  });
});

describe("ChannelSplit", () => {
  it("links each channel to its detail", () => {
    render(
      <ChannelSplit
        label="Total sales"
        total="$292,400"
        distributionLabel="Sales channel distribution"
        parts={[
          { label: "Direct sales", value: "$100.5K", amount: 100.5, href: "/direct" },
          { label: "Retail stores", value: "$89.5K", amount: 89.5 },
        ]}
      />,
    );

    expect(screen.getByText("$292,400")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Direct sales/ })).toHaveAttribute("href", "/direct");
    expect(screen.getByText("Retail stores").closest("a")).toBeNull();
  });
});

describe("ShareCards", () => {
  it("lists each share and follows its link", () => {
    const { container } = render(
      <ShareCards
        label="Heart rate"
        items={[
          {
            label: "Running",
            value: "156",
            unit: "bpm",
            rows: [
              { label: "Endurance", share: "25.5%", detail: "<126", href: "/endurance" },
              { label: "Tempo", share: "14.2%", detail: "157–173" },
            ],
          },
        ]}
      />,
    );

    const list = within(container).getByRole("list");
    expect(within(list).getByRole("link", { name: /Endurance/ })).toHaveAttribute(
      "href",
      "/endurance",
    );
    expect(screen.getByText("156")).toBeInTheDocument();
    expect(screen.getByText("bpm")).toBeInTheDocument();
    expect(screen.getByText("157–173")).toBeInTheDocument();
  });
});
