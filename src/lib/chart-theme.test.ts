import { describe, expect, it } from "vitest";
import { demandCells } from "@/data/charts";
import {
  fade,
  formatPercent,
  formatThousands,
  readChartTheme,
  seriesColor,
  tooltipHtml,
} from "@/lib/chart-theme";

describe("chart theme", () => {
  it("reads palette fallbacks and live custom properties", () => {
    expect(readChartTheme("light").colors.primary).toBe("#0168fa");
    expect(readChartTheme("dark").heat[0]).toBe("#243044");

    document.documentElement.style.setProperty("--primary", "#112233");
    expect(readChartTheme("light").colors.primary).toBe("#112233");
    document.documentElement.style.removeProperty("--primary");
  });

  it("formats values and builds a tooltip", () => {
    const theme = readChartTheme("light");
    expect(formatThousands(42)).toBe("$42k");
    expect(formatPercent(2.5)).toBe("2.5%");
    expect(fade("#0168fa", 0.4)).toBe("rgba(1, 104, 250, 0.4)");
    expect(seriesColor(theme, { name: "Refunds", data: [], color: "orange" }, 0)).toBe("#fd7e14");
    expect(
      tooltipHtml(theme, "Mar", [{ name: "Direct", value: "$44k", color: "#0168fa" }]),
    ).toContain("Direct");
  });

  it("builds a full week of hourly demand with a midday peak", () => {
    expect(demandCells).toHaveLength(24 * 7);
    const mondayNoon = demandCells.find(([hour, day]) => hour === 12 && day === 0)?.[2] ?? 0;
    const mondayNight = demandCells.find(([hour, day]) => hour === 3 && day === 0)?.[2] ?? 0;
    expect(mondayNoon).toBeGreaterThan(mondayNight);
  });
});
