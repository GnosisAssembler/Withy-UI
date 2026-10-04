import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/components/molecules/tooltip";
import { ThemeProvider } from "@/components/theme/theme-provider";
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
  RadarChart: {},
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
    expect(screen.getByRole("img", { name: "Hourly demand" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Orders this week" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Volume and conversion" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Channel quality" })).toBeInTheDocument();

    const overlay = screen.getByRole("tab", { name: "Overlay" });
    await user.click(overlay);
    expect(overlay).toHaveAttribute("data-state", "active");
  });
});
