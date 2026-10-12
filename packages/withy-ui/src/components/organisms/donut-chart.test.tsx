import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "../theme/theme-provider";
import { DonutChart } from "./donut-chart";

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

const data = [
  { name: "Direct", value: 30, color: "primary" as const },
  { name: "Organic", value: 10, color: "teal" as const },
];

function renderChart(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

function latestOption() {
  return setOption.mock.calls.at(-1)?.[0] as {
    series: {
      type: string;
      radius: string | string[];
      data: { name: string; value: number }[];
    }[];
  };
}

describe("DonutChart", () => {
  beforeEach(() => {
    setOption.mockClear();
  });

  it("draws a donut and shows the total", () => {
    const { container } = renderChart(<DonutChart label="Revenue share" data={data} />);

    expect(
      screen.getByRole("img", { name: /Revenue share\. Direct 30, Organic 10, Total 40/ }),
    ).toBeInTheDocument();
    const total = container.querySelector("[aria-hidden='true']");
    expect(total).toHaveTextContent("40");
    expect(total).toHaveTextContent("Total");

    const option = latestOption();
    expect(option.series[0]?.type).toBe("pie");
    expect(option.series[0]?.radius).toEqual(["54%", "72%"]);
    expect(option.series[0]?.data.map((slice) => slice.name)).toEqual(["Direct", "Organic"]);
  });

  it("draws a pie without the center total", () => {
    const { container } = renderChart(
      <DonutChart label="Revenue share" data={data} variant="pie" />,
    );

    expect(
      screen.getByRole("img", { name: /Revenue share\. Direct 30, Organic 10$/ }),
    ).toBeInTheDocument();
    expect(container.querySelector("[aria-hidden='true']")).toBeNull();
    expect(latestOption().series[0]?.radius).toBe("72%");
  });

  it("drops values that are not positive", () => {
    const { container } = renderChart(
      <DonutChart
        label="Revenue share"
        data={[
          { name: "Direct", value: 8 },
          { name: "Refunds", value: -3 },
        ]}
      />,
    );

    expect(latestOption().series[0]?.data.map((slice) => slice.value)).toEqual([8, 0]);
    expect(container.querySelector("[aria-hidden='true']")).toHaveTextContent("8");
  });
});
