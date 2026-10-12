import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "../theme/theme-provider";
import { BubbleChart } from "./bubble-chart";

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
  HeatmapChart: {},
  LineChart: {},
  PieChart: {},
  RadarChart: {},
  CustomChart: {},
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

const series = [
  {
    name: "Direct",
    color: "primary" as const,
    data: [
      { name: "North", x: 48, y: 220, size: 18 },
      { name: "East", x: 72, y: 410, size: 46 },
    ],
  },
  {
    name: "Partner",
    color: "indigo" as const,
    data: [{ name: "West", x: 80, y: 210, size: 28 }],
  },
];

function latestSeries() {
  return setOption.mock.calls.at(-1)?.[0] as {
    series: {
      type: string;
      name: string;
      data: { name: string; value: number[] }[];
      symbolSize: (raw: number | number[]) => number;
    }[];
  };
}

describe("BubbleChart", () => {
  beforeEach(() => {
    setOption.mockClear();
  });

  it("plots each point by two values and sizes the bubble from the third", () => {
    render(
      <ThemeProvider>
        <BubbleChart label="Account value" series={series} />
      </ThemeProvider>,
    );

    expect(screen.getByRole("img", { name: "Account value" })).toBeInTheDocument();
    const plotted = latestSeries().series;
    expect(plotted.map((item) => item.type)).toEqual(["scatter", "scatter"]);
    expect(plotted[0]?.data[0]).toEqual({ name: "North", value: [48, 220, 18] });
    expect(plotted[0]?.symbolSize([48, 220, 46])).toBeGreaterThan(
      plotted[0]?.symbolSize([48, 220, 18]) ?? 0,
    );
  });

  it("drops a point that has no position", () => {
    render(
      <ThemeProvider>
        <BubbleChart
          label="Account value"
          series={[
            {
              name: "Direct",
              data: [
                { name: "North", x: 10, y: 20, size: 4 },
                { name: "Missing", x: Number.NaN, y: 20, size: 8 },
              ],
            },
          ]}
        />
      </ThemeProvider>,
    );

    expect(latestSeries().series[0]?.data.map((point) => point.name)).toEqual(["North"]);
  });
});
