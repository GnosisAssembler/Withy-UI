import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "../theme/theme-provider";
import { TimelineChart } from "./timeline-chart";

const setOption = vi.hoisted(() => vi.fn());

vi.mock("echarts/core", () => ({
  use: vi.fn(),
  init: vi.fn(() => ({
    setOption,
    resize: vi.fn(),
    dispose: vi.fn(),
    isDisposed: () => false,
  })),
}));

vi.mock("echarts/charts", () => ({
  BarChart: {},
  CustomChart: {},
  HeatmapChart: {},
  LineChart: {},
  PieChart: {},
  RadarChart: {},
  ScatterChart: {},
  TreemapChart: {},
}));

vi.mock("echarts/components", () => ({
  GridComponent: {},
  LegendComponent: {},
  RadarComponent: {},
  TooltipComponent: {},
  VisualMapComponent: {},
}));

vi.mock("echarts/renderers", () => ({
  CanvasRenderer: {},
}));

const categories = ["Design", "Code", "Test"];

const series = [
  {
    name: "Alice",
    color: "primary" as const,
    data: [
      {
        category: "Design",
        start: "2024-03-05",
        end: "2024-03-08",
        markers: [{ name: "Break", at: "2024-03-06" }],
      },
      { category: "Design", start: "2024-03-01", end: "2024-03-03" },
      { category: "Missing", start: "2024-03-01", end: "2024-03-02" },
      { category: "Code", start: "2024-03-08", end: "2024-03-02" },
      { category: "Code", start: "2024-02-31", end: "2024-03-04" },
      { category: "Code", start: "nope", end: "2024-03-04" },
      {
        category: "Test",
        start: "2024-03-01",
        end: "2024-03-01",
        markers: [
          { name: "Early", at: "2024-02-20" },
          { name: " ", at: "2024-03-01" },
        ],
      },
    ],
  },
  {
    name: "Ravi",
    color: "indigo" as const,
    data: [
      {
        category: "Design",
        start: "2024-03-02",
        end: "2024-03-05",
        markers: [{ name: "Hold", at: "2024-03-03", color: "danger" as const }],
      },
    ],
  },
];

type BarDatum = {
  name: string;
  value: [string, number, number];
  markers: { name: string; at: number; color: string }[];
};

type Drawn = {
  type: string;
  children: {
    type: string;
    shape: {
      x: number;
      y: number;
      width: number;
      height: number;
      r?: number;
      x1?: number;
      y1?: number;
    };
    style: { fill?: string; stroke?: string; lineWidth?: number };
  }[];
};

type TimelineOption = {
  xAxis: { type: string; axisLabel: { formatter: (value: number) => string } };
  yAxis: { inverse: boolean; data: string[] };
  legend: { show?: boolean };
  tooltip: { formatter: (params: unknown) => string };
  series: {
    type: string;
    name: string;
    itemStyle: { color: string };
    data: BarDatum[];
    renderItem: (
      params: {
        seriesIndex: number;
        dataIndex: number;
        coordSys: { x: number; y: number; width: number; height: number };
      },
      api: {
        coord: (data: (string | number)[]) => number[];
        size: () => number[];
      },
    ) => Drawn | null;
  }[];
};

function latestOption() {
  return setOption.mock.calls.at(-1)?.[0] as TimelineOption;
}

function at(monthDay: number) {
  return new Date(2024, 2, monthDay).getTime();
}

describe("TimelineChart", () => {
  beforeEach(() => {
    setOption.mockClear();
  });

  it("draws each series in its own lane and marks a moment on the bar", () => {
    render(
      <ThemeProvider>
        <TimelineChart label="Sprint schedule" categories={categories} series={series} />
      </ThemeProvider>,
    );

    expect(screen.getByRole("img", { name: "Sprint schedule" })).toBeInTheDocument();
    const option = latestOption();
    expect(option.xAxis.type).toBe("time");
    expect(option.yAxis.inverse).toBe(true);
    expect(option.yAxis.data).toEqual(categories);
    expect(option.series.map((item) => item.type)).toEqual(["custom", "custom"]);
    expect(option.series[0]?.itemStyle.color).toBe("#0E7484");
    expect(option.series[0]?.data.map((bar) => bar.name)).toEqual(["Design", "Design", "Test"]);
    expect(option.series[0]?.data[0]?.value).toEqual(["Design", at(5), at(8)]);
    expect(option.series[0]?.data[0]?.markers.map((marker) => marker.name)).toEqual(["Break"]);
    expect(option.series[0]?.data[2]?.value[1]).toBe(option.series[0]?.data[2]?.value[2]);
    expect(option.series[0]?.data[2]?.markers).toEqual([]);
    expect(option.series[1]?.data[0]?.markers[0]?.color).toBe("#C41E36");

    const grid = { x: 0, y: 0, width: 1000, height: 400 };
    const alice = option.series[0]?.renderItem(
      { seriesIndex: 0, dataIndex: 0, coordSys: grid },
      {
        coord: (data) => [data[0] === at(5) ? 30 : data[0] === at(8) ? 150 : 70, 100],
        size: () => [0, 48],
      },
    );
    const ravi = option.series[1]?.renderItem(
      { seriesIndex: 1, dataIndex: 0, coordSys: grid },
      {
        coord: () => [80, 100],
        size: () => [0, 48],
      },
    );
    const bar = alice?.children[0];
    const mark = alice?.children[1];
    expect(bar?.style.fill).toBe("rgba(14, 116, 132, 0.6)");
    expect(bar?.style.stroke).toBe("#0E7484");
    expect(bar?.shape).toMatchObject({ x: 30, width: 120, r: 3 });
    expect(bar?.shape.y).toBeCloseTo(78.4);
    expect(bar?.shape.height).toBeCloseTo(19.2);
    expect(mark?.shape.x1).toBe(70);
    expect(mark?.style.stroke).toBe("#1C1428");
    expect((ravi?.children[0]?.shape.y ?? 0) - (bar?.shape.y ?? 0)).toBeCloseTo(24);

    const html = option.tooltip.formatter({
      seriesName: "Alice",
      color: "#0E7484",
      data: option.series[0]?.data[0],
    });
    expect(html).toContain("Design");
    expect(html).toContain("Alice");
    expect(html).toContain("Mar 5");
    expect(html).toContain("Mar 8");
    expect(html).toContain("3 days");
    expect(html).toContain("Break");
    expect(html).toContain("Mar 6");
  });

  it("drops a bar that sits fully outside the plot", () => {
    render(
      <ThemeProvider>
        <TimelineChart label="Sprint schedule" categories={categories} series={series} />
      </ThemeProvider>,
    );

    const drawn = latestOption().series[0]?.renderItem(
      { seriesIndex: 0, dataIndex: 0, coordSys: { x: 0, y: 0, width: 100, height: 80 } },
      { coord: () => [240, 40], size: () => [0, 40] },
    );
    expect(drawn).toBeNull();
  });

  it("uses a custom date formatter and can hide the legend", () => {
    render(
      <ThemeProvider>
        <TimelineChart
          label="Sprint schedule"
          categories={["<Design>"]}
          legend={false}
          dateFormatter={(value) => `t${value}`}
          series={[
            {
              name: "A&B",
              data: [{ category: "<Design>", start: "2024-03-05", end: "2024-03-08" }],
            },
          ]}
        />
      </ThemeProvider>,
    );

    const option = latestOption();
    expect(option.legend.show).toBe(false);
    expect(option.xAxis.axisLabel.formatter(at(5))).toBe(`t${at(5)}`);
    const html = option.tooltip.formatter({
      seriesName: "A&B",
      color: "#0E7484",
      data: option.series[0]?.data[0],
    });
    expect(html).toContain("&lt;Design&gt;");
    expect(html).toContain("A&amp;B");
    expect(html).not.toContain("<Design>");
  });
});
