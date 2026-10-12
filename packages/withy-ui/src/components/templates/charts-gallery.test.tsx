import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "../molecules/tooltip";
import { ThemeProvider } from "../theme/theme-provider";
import { ChartsGalleryTemplate } from "./charts-gallery";

vi.mock("echarts/core", () => ({
  use: vi.fn(),
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
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

describe("ChartsGalleryTemplate", () => {
  it("assembles themed chart examples and switches the area chart", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TooltipProvider>
          <ChartsGalleryTemplate />
        </TooltipProvider>
      </ThemeProvider>,
    );

    expect(screen.getByRole("heading", { name: "Charts" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Revenue by channel" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Active accounts" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Hourly demand" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Orders this week" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Volume and conversion" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Account value" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /^Devices by category/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Sprint schedule" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Channel quality" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /^Orders by channel/ })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Top pages" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Accounts by plan" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "API uptime, last 90 days" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Paid goal: 700" })).toBeInTheDocument();

    const overlay = screen.getByRole("tab", { name: "Overlay" });
    await user.click(overlay);
    expect(overlay).toHaveAttribute("data-state", "active");
  });
});
