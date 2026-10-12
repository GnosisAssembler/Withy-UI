import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "../theme/theme-provider";
import { LineChart } from "./line-chart";

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
  { name: "Paid", data: [120, 128, 135], color: "primary" as const },
  { name: "Free", data: [340, 352, 361], color: "cyan" as const },
];

function latestSeries() {
  return setOption.mock.calls.at(-1)?.[0] as {
    series: {
      type: string;
      name: string;
      data: number[];
      smooth: number | false;
      showSymbol: boolean;
      areaStyle?: unknown;
    }[];
  };
}

describe("LineChart", () => {
  beforeEach(() => {
    setOption.mockClear();
  });

  it("draws named lines with points and no fill", () => {
    render(
      <ThemeProvider>
        <LineChart label="Active accounts" categories={["Jan", "Feb", "Mar"]} series={series} />
      </ThemeProvider>,
    );

    expect(screen.getByRole("img", { name: "Active accounts" })).toBeInTheDocument();
    const lines = latestSeries().series;
    expect(lines.map((line) => line.name)).toEqual(["Paid", "Free"]);
    expect(lines.every((line) => line.type === "line" && line.areaStyle === undefined)).toBe(true);
    expect(lines[0]).toMatchObject({ smooth: 0.35, showSymbol: true, data: [120, 128, 135] });
  });

  it("can draw straight lines without points", () => {
    render(
      <ThemeProvider>
        <LineChart
          label="Active accounts"
          categories={["Jan", "Feb"]}
          series={series}
          smooth={false}
          showPoints={false}
        />
      </ThemeProvider>,
    );

    expect(latestSeries().series[0]).toMatchObject({ smooth: false, showSymbol: false });
  });
});
