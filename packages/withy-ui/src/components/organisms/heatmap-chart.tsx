"use client";

import * as React from "react";
import type { EChartsCoreOption } from "echarts/core";
import { Chart, useChartTheme } from "./chart";
import {
  categoryAxis,
  chartGrid,
  fade,
  formatCount,
  readHeatmapValue,
  tooltipBase,
  tooltipHtml,
} from "../../lib/chart-theme";

type HeatmapChartProps = {
  xLabels: string[];
  yLabels: string[];
  cells: [number, number, number][];
  label: string;
  valueLabel?: string;
  className?: string;
};

export function HeatmapChart({
  xLabels,
  yLabels,
  cells,
  label,
  valueLabel = "Value",
  className,
}: HeatmapChartProps) {
  const theme = useChartTheme();
  const option = React.useMemo<EChartsCoreOption>(() => {
    const values = cells.map((cell) => cell[2]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const xAxis = categoryAxis(theme, xLabels, true);

    return {
      backgroundColor: "transparent",
      textStyle: { fontFamily: theme.font, color: theme.muted },
      grid: chartGrid({ top: 8, right: 8, bottom: 36, left: 4 }),
      tooltip: {
        trigger: "item",
        ...tooltipBase(theme),
        formatter: (params: unknown) => {
          const point = readHeatmapValue(params);
          if (!point) return "";
          const day = yLabels[point.y] ?? "";
          const hour = xLabels[point.x] ?? "";
          return tooltipHtml(theme, `${day} · ${hour}`, [
            { name: valueLabel, color: theme.colors.primary, value: formatCount(point.value) },
          ]);
        },
      },
      xAxis: {
        ...xAxis,
        axisLabel: {
          ...xAxis.axisLabel,
          interval: (index: number) => index % 3 === 0,
        },
      },
      yAxis: {
        ...categoryAxis(theme, yLabels, true),
        inverse: true,
        splitLine: { show: false },
      },
      visualMap: {
        min,
        max,
        calculable: false,
        orient: "horizontal",
        left: "center",
        bottom: 0,
        itemWidth: 12,
        itemHeight: 140,
        text: ["High", "Low"],
        textGap: 8,
        textStyle: { color: theme.muted, fontSize: 11, fontFamily: theme.font },
        inRange: { color: theme.heat },
      },
      series: [
        {
          name: valueLabel,
          type: "heatmap" as const,
          data: cells,
          itemStyle: {
            borderRadius: 2,
            borderWidth: 2,
            borderColor: theme.card,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: fade(theme.colors.primary, 0.35),
            },
          },
        },
      ],
      animationDuration: 700,
    };
  }, [cells, theme, valueLabel, xLabels, yLabels]);

  return <Chart option={option} label={label} className={className} />;
}
