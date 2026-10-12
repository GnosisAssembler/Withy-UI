import { describe, expect, it } from "vitest";
import { demandCells } from "../data/charts";
import {
  chartColorAt,
  chartColorMix,
  chartValue,
  fade,
  formatPercent,
  formatThousands,
  readChartTheme,
  readBubbleValue,
  readTimelineValue,
  readTreemapValue,
  readSliceTooltip,
  seriesColor,
  tooltipHtml,
} from "./chart-theme";

describe("chart theme", () => {
  it("reads palette fallbacks and live custom properties", () => {
    expect(readChartTheme("light").colors.primary).toBe("#0E7484");
    expect(readChartTheme("dark").heat[0]).toBe("#2A2436");

    document.documentElement.style.setProperty("--primary", "#112233");
    expect(readChartTheme("light").colors.primary).toBe("#112233");
    document.documentElement.style.removeProperty("--primary");
  });

  it("formats values and builds a tooltip", () => {
    const theme = readChartTheme("light");
    expect(formatThousands(42)).toBe("$42k");
    expect(formatPercent(2.5)).toBe("2.5%");
    expect(fade("#0168fa", 0.4)).toBe("rgba(1, 104, 250, 0.4)");
    expect(seriesColor(theme, { color: "orange" }, 0)).toBe("#F5D6BA");
    expect(
      tooltipHtml(theme, "Mar", [{ name: "Direct", value: "$44k", color: "#0168fa" }]),
    ).toContain("Direct");
  });

  it("reads a slice tooltip and keeps chart values positive", () => {
    expect(chartValue(3.5)).toBe(3.5);
    expect(chartValue(-4)).toBe(0);
    expect(chartValue(Number.NaN)).toBe(0);
    expect(chartColorAt(1)).toBe("teal");
    expect(chartColorAt(2, "pink")).toBe("pink");
    expect(chartColorMix("primary", 30)).toBe(
      "color-mix(in srgb, var(--primary) 30%, transparent)",
    );
    expect(readSliceTooltip({ name: "Direct", value: 12, color: "#111111", percent: 40 })).toEqual({
      name: "Direct",
      value: 12,
      color: "#111111",
      percent: 40,
    });
    expect(readSliceTooltip({ value: "12" })).toBeNull();
    expect(
      readBubbleValue({
        name: "North",
        seriesName: "Direct",
        color: "#111111",
        value: [48, 220, 18],
      }),
    ).toEqual({
      name: "North",
      seriesName: "Direct",
      color: "#111111",
      x: 48,
      y: 220,
      size: 18,
    });
    expect(readBubbleValue({ value: [1, 2] })).toBeNull();
    expect(
      readTreemapValue({
        name: "Apple",
        color: "#0E7484",
        value: 50,
        treeAncestors: [
          { name: "Devices", value: 100 },
          { name: "Desktops", value: 80 },
          { name: "Apple", value: 50 },
        ],
      }),
    ).toEqual({ name: "Apple", group: "Desktops", color: "#0E7484", value: 50 });
    expect(readTreemapValue({ value: "50" })).toBeNull();
    expect(
      readTimelineValue({
        seriesName: "Alice",
        color: "#111111",
        data: {
          category: "Design",
          value: ["Design", 10, 20],
          markers: [{ name: "Break", at: 15, color: "#222222" }],
        },
      }),
    ).toEqual({
      seriesName: "Alice",
      category: "Design",
      color: "#111111",
      start: 10,
      end: 20,
      markers: [{ name: "Break", at: 15, color: "#222222" }],
    });
    expect(readTimelineValue({ value: [1, 2] })).toBeNull();
  });

  it("builds a full week of hourly demand with a midday peak", () => {
    expect(demandCells).toHaveLength(24 * 7);
    const mondayNoon = demandCells.find(([hour, day]) => hour === 12 && day === 0)?.[2] ?? 0;
    const mondayNight = demandCells.find(([hour, day]) => hour === 3 && day === 0)?.[2] ?? 0;
    expect(mondayNoon).toBeGreaterThan(mondayNight);
  });
});
