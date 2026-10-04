"use client";

import * as React from "react";
import type { EChartsCoreOption } from "echarts/core";
import { Chart, useChartTheme } from "@/components/organisms/chart";
import {
  areaFill,
  axisTooltip,
  categoryAxis,
  chartGrid,
  formatThousands,
  legendStyle,
  seriesColor,
  valueAxis,
  type ChartSeries,
} from "@/lib/chart-theme";

type AreaChartProps = {
  categories: string[];
  series: ChartSeries[];
  label: string;
  stacked?: boolean;
  filled?: boolean;
  legend?: boolean;
  axes?: "all" | "x" | "none";
  valueFormatter?: (value: number) => string;
  className?: string;
};

export function AreaChart({
  categories,
  series,
  label,
  stacked = true,
  filled = true,
  legend = true,
  axes = "all",
  valueFormatter = formatThousands,
  className,
}: AreaChartProps) {
  const theme = useChartTheme();
  const option = React.useMemo<EChartsCoreOption>(() => {
    const format = (value: number) => valueFormatter(value);
    const xAxis = categoryAxis(theme, categories, false);
    const yAxis = valueAxis(theme, axes === "all" ? format : undefined);
    return {
      backgroundColor: "transparent",
      color: theme.series,
      textStyle: { fontFamily: theme.font, color: theme.muted },
      legend: legend ? legendStyle(theme) : { show: false },
      grid:
        axes === "none"
          ? { top: 8, right: 0, bottom: 0, left: 0 }
          : axes === "x"
            ? chartGrid({ top: 12, right: 4, bottom: 0, left: 4 })
            : chartGrid(legend ? undefined : { top: 12 }),
      tooltip: {
        ...axisTooltip(theme, format, (rows) =>
          stacked ? format(rows.reduce((sum, row) => sum + row.value, 0)) : undefined,
        ),
        axisPointer: {
          type: "line",
          lineStyle: { color: theme.muted, width: 1 },
          label: { show: false },
        },
      },
      xAxis: {
        ...xAxis,
        axisLine: { show: axes !== "none", lineStyle: { color: theme.border } },
        axisLabel: { ...xAxis.axisLabel, show: axes !== "none" },
      },
      yAxis: {
        ...yAxis,
        axisLabel: { ...yAxis.axisLabel, show: axes === "all" },
        splitLine: { show: axes === "all", lineStyle: { color: theme.border } },
      },
      series: series.map((item, index) => {
        const color = seriesColor(theme, item, index);
        return {
          name: item.name,
          type: "line" as const,
          stack: stacked ? "total" : undefined,
          smooth: stacked ? 0.35 : 0.45,
          showSymbol: false,
          symbol: "circle",
          symbolSize: 7,
          data: item.data,
          itemStyle: { color },
          lineStyle: { width: 2, color },
          ...(filled ? { areaStyle: { color: areaFill(color, stacked) } } : {}),
          emphasis: { focus: "series" as const },
        };
      }),
      animationDuration: 700,
      animationDurationUpdate: 400,
    };
  }, [axes, categories, filled, legend, series, stacked, theme, valueFormatter]);

  return <Chart option={option} label={label} className={className} />;
}
