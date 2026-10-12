"use client";

import * as React from "react";
import type { EChartsCoreOption } from "echarts/core";
import { Chart, useChartTheme } from "./chart";
import {
  axisTooltip,
  categoryAxis,
  chartGrid,
  formatCount,
  legendStyle,
  seriesColor,
  valueAxis,
  type ChartSeries,
} from "../../lib/chart-theme";

type LineChartProps = {
  categories: string[];
  series: ChartSeries[];
  label: string;
  smooth?: boolean;
  showPoints?: boolean;
  legend?: boolean;
  axes?: "all" | "x" | "none";
  valueFormatter?: (value: number) => string;
  className?: string;
};

export function LineChart({
  categories,
  series,
  label,
  smooth = true,
  showPoints = true,
  legend = true,
  axes = "all",
  valueFormatter = formatCount,
  className,
}: LineChartProps) {
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
        ...axisTooltip(theme, format),
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
          smooth: smooth ? 0.35 : false,
          showSymbol: showPoints,
          symbol: "circle",
          symbolSize: 7,
          data: item.data,
          itemStyle: { color, borderColor: theme.card, borderWidth: 2 },
          lineStyle: { width: 2, color },
          emphasis: { focus: "series" as const },
        };
      }),
      animationDuration: 700,
      animationDurationUpdate: 400,
    };
  }, [axes, categories, legend, series, showPoints, smooth, theme, valueFormatter]);

  return <Chart option={option} label={label} className={className} />;
}
