"use client";

import * as React from "react";
import type { EChartsCoreOption } from "echarts/core";
import { Chart, useChartTheme } from "@/components/organisms/chart";
import {
  axisTooltip,
  categoryAxis,
  chartGrid,
  fade,
  formatCount,
  legendStyle,
  seriesColor,
  valueAxis,
  type ChartSeries,
} from "@/lib/chart-theme";

type BarChartProps = {
  categories: string[];
  series: ChartSeries[];
  label: string;
  valueFormatter?: (value: number) => string;
  className?: string;
};

export function BarChart({
  categories,
  series,
  label,
  valueFormatter = formatCount,
  className,
}: BarChartProps) {
  const theme = useChartTheme();
  const option = React.useMemo<EChartsCoreOption>(() => {
    const format = (value: number) => valueFormatter(value);
    return {
      backgroundColor: "transparent",
      color: theme.series,
      textStyle: { fontFamily: theme.font, color: theme.muted },
      legend: legendStyle(theme),
      grid: chartGrid({ top: 36, bottom: 4 }),
      tooltip: {
        ...axisTooltip(theme, format),
        axisPointer: {
          type: "shadow",
          shadowStyle: { color: fade(theme.colors.primary, 0.08) },
        },
      },
      xAxis: categoryAxis(theme, categories, true),
      yAxis: valueAxis(theme, format),
      series: series.map((item, index) => {
        const color = seriesColor(theme, item, index);
        return {
          name: item.name,
          type: "bar" as const,
          data: item.data,
          barMaxWidth: 18,
          itemStyle: { color, borderRadius: [3, 3, 0, 0] },
          emphasis: { focus: "series" as const },
        };
      }),
      animationDuration: 700,
    };
  }, [categories, series, theme, valueFormatter]);

  return <Chart option={option} label={label} className={className} />;
}
