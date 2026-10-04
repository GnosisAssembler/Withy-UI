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
  formatPercent,
  legendStyle,
  seriesColor,
  valueAxis,
  type ChartSeries,
} from "@/lib/chart-theme";

type ComboChartProps = {
  categories: string[];
  bars: ChartSeries | ChartSeries[];
  line: ChartSeries;
  label: string;
  stackBars?: boolean;
  dualAxis?: boolean;
  lineArea?: boolean;
  barMaxWidth?: number;
  barFormatter?: (value: number) => string;
  lineFormatter?: (value: number) => string;
  className?: string;
};

export function ComboChart({
  categories,
  bars,
  line,
  label,
  stackBars = false,
  dualAxis = true,
  lineArea = true,
  barMaxWidth = 22,
  barFormatter = formatCount,
  lineFormatter = formatPercent,
  className,
}: ComboChartProps) {
  const theme = useChartTheme();
  const option = React.useMemo<EChartsCoreOption>(() => {
    const barSeries = Array.isArray(bars) ? bars : [bars];
    const lineColor = seriesColor(theme, line, barSeries.length);
    const yAxis = valueAxis(theme, barFormatter);
    return {
      backgroundColor: "transparent",
      textStyle: { fontFamily: theme.font, color: theme.muted },
      legend: legendStyle(theme),
      grid: chartGrid({ right: dualAxis ? 8 : 8, bottom: 4 }),
      tooltip: {
        ...axisTooltip(
          theme,
          (value, seriesName) =>
            seriesName === line.name ? lineFormatter(value) : barFormatter(value),
          stackBars
            ? (rows) => barFormatter(rows.reduce((sum, row) => sum + row.value, 0))
            : undefined,
        ),
        axisPointer: {
          type: "line",
          lineStyle: { color: theme.muted, width: 1 },
          label: { show: false },
        },
      },
      xAxis: categoryAxis(theme, categories, true),
      yAxis: dualAxis
        ? [yAxis, { ...valueAxis(theme, lineFormatter), splitLine: { show: false } }]
        : yAxis,
      series: [
        ...barSeries.map((item, index) => {
          const color = seriesColor(theme, item, index);
          const top = index === barSeries.length - 1;
          return {
            name: item.name,
            type: "bar" as const,
            stack: stackBars ? "bars" : undefined,
            data: item.data,
            barMaxWidth,
            itemStyle: {
              color,
              borderRadius: !stackBars || top ? [3, 3, 0, 0] : [0, 0, 0, 0],
            },
          };
        }),
        {
          name: line.name,
          type: "line" as const,
          yAxisIndex: dualAxis ? 1 : 0,
          data: line.data,
          smooth: 0.35,
          symbol: "circle",
          symbolSize: 7,
          itemStyle: { color: lineColor, borderColor: theme.card, borderWidth: 2 },
          lineStyle: { width: 2, color: lineColor },
          ...(lineArea
            ? {
                areaStyle: {
                  color: {
                    type: "linear" as const,
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: fade(lineColor, 0.22) },
                      { offset: 1, color: fade(lineColor, 0.02) },
                    ],
                  },
                },
              }
            : {}),
        },
      ],
      animationDuration: 700,
    };
  }, [
    barFormatter,
    barMaxWidth,
    bars,
    categories,
    dualAxis,
    line,
    lineArea,
    lineFormatter,
    stackBars,
    theme,
  ]);

  return <Chart option={option} label={label} className={className} />;
}
