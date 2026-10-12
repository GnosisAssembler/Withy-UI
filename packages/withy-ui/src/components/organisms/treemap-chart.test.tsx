import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "../theme/theme-provider";
import { TreemapChart } from "./treemap-chart";

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
    name: "Desktops",
    color: "primary" as const,
    data: [
      { name: "Apple", value: 50 },
      { name: "Acer", value: 30 },
      { name: "Asus", value: 21 },
    ],
  },
  {
    name: "Laptops",
    color: "teal" as const,
    data: [
      { name: "Dell", value: 21 },
      { name: "Apple", value: 10 },
    ],
  },
];

type TileNode = {
  id: string;
  name: string;
  value: number;
  itemStyle: { color: string };
  label: { color: string };
};

function latestSeries() {
  return setOption.mock.calls.at(-1)?.[0] as {
    series: {
      type: string;
      roam: boolean;
      nodeClick: false;
      breadcrumb: { show: boolean };
      data: { name: string; children: TileNode[] }[];
    }[];
    tooltip: { formatter: (params: unknown) => string };
  };
}

function channelSum(color: string) {
  const hex = color.replace("#", "");
  const value = Number.parseInt(hex, 16);
  return ((value >> 16) & 255) + ((value >> 8) & 255) + (value & 255);
}

describe("TreemapChart", () => {
  beforeEach(() => {
    setOption.mockClear();
  });

  it("sizes tiles by value and shades each series from its own color", () => {
    render(
      <ThemeProvider>
        <TreemapChart label="Devices" series={series} valueLabel="Units" />
      </ThemeProvider>,
    );

    expect(screen.getByRole("img", { name: /Devices\. Desktops, Apple, 50/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Desktops" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    const plotted = latestSeries().series[0];
    expect(plotted?.type).toBe("treemap");
    expect(plotted?.roam).toBe(false);
    expect(plotted?.nodeClick).toBe(false);
    expect(plotted?.breadcrumb.show).toBe(false);
    expect(plotted?.data.map((group) => group.name)).toEqual(["Desktops", "Laptops"]);

    const desktops = plotted?.data[0]?.children ?? [];
    const apple = desktops.find((tile) => tile.name === "Apple");
    const asus = desktops.find((tile) => tile.name === "Asus");
    expect(apple?.value).toBe(50);
    expect(apple?.itemStyle.color.toLowerCase()).toBe("#0e7484");
    expect(channelSum(asus?.itemStyle.color ?? "#000")).toBeGreaterThan(
      channelSum(apple?.itemStyle.color ?? "#fff"),
    );
    expect(apple?.label.color.toLowerCase()).toBe("#ffffff");

    const laptops = plotted?.data[1]?.children ?? [];
    expect(laptops.find((tile) => tile.name === "Dell")?.label.color).toBe("#1C1428");
    const ids = plotted?.data.flatMap((group) => group.children.map((tile) => tile.id)) ?? [];
    expect(new Set(ids).size).toBe(ids.length);

    const tooltip = latestSeries().tooltip.formatter({
      name: "Apple",
      value: 50,
      color: "#0E7484",
      treeAncestors: [
        { name: "Devices", value: 132 },
        { name: "Desktops", value: 101 },
        { name: "Apple", value: 50 },
      ],
    });
    expect(tooltip).toContain("Apple");
    expect(tooltip).toContain("Desktops");
    expect(tooltip).toContain("Units");
    expect(tooltip).toContain("37.9%");
  });

  it("drops tiles that have no positive value and hides a series from the legend", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TreemapChart
          label="Devices"
          series={[
            ...series,
            {
              name: "Empty",
              data: [
                { name: "Missing", value: Number.NaN },
                { name: "Zero", value: 0 },
              ],
            },
          ]}
        />
      </ThemeProvider>,
    );

    expect(screen.queryByRole("button", { name: "Empty" })).not.toBeInTheDocument();
    expect(latestSeries().series[0]?.data[0]?.children.map((tile) => tile.name)).toEqual([
      "Apple",
      "Acer",
      "Asus",
    ]);

    await user.click(screen.getByRole("button", { name: "Laptops" }));
    expect(screen.getByRole("button", { name: "Laptops" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(latestSeries().series[0]?.data.map((group) => group.name)).toEqual(["Desktops"]);

    await user.click(screen.getByRole("button", { name: "Laptops" }));
    expect(latestSeries().series[0]?.data.map((group) => group.name)).toEqual([
      "Desktops",
      "Laptops",
    ]);
  });

  it("omits the legend when asked", () => {
    render(
      <ThemeProvider>
        <TreemapChart label="Devices" series={series} legend={false} />
      </ThemeProvider>,
    );

    expect(screen.queryByRole("list", { name: "Series" })).not.toBeInTheDocument();
    expect(latestSeries().series[0]?.data).toHaveLength(2);
  });
});
