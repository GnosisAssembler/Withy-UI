"use client";

import * as React from "react";
import type { EChartsCoreOption } from "echarts/core";
import { Chart, useChartTheme } from "@/components/organisms/chart";
import {
  fade,
  legendStyle,
  seriesColor,
  tooltipBase,
  tooltipHtml,
  type ChartSeries,
} from "@/lib/chart-theme";

type RadarChartProps = {
  indicators: { name: string; max: number }[];
  series: ChartSeries[];
  label: string;
  className?: string;
};

export function RadarChart({ indicators, series, label, className }: RadarChartProps) {
  const theme = useChartTheme();
  const option = React.useMemo<EChartsCoreOption>(
    () => ({
      backgroundColor: "transparent",
      textStyle: { fontFamily: theme.font, color: theme.muted },
      legend: { ...legendStyle(theme), top: "auto", right: "auto", bottom: 0, left: "center" },
      tooltip: {
        trigger: "item",
        ...tooltipBase(theme),
        formatter: (params: unknown) => {
          if (typeof params !== "object" || params === null || !("value" in params)) return "";
          const record = params as { name?: unknown; value?: unknown; color?: unknown };
          const values = record.value;
          if (!Array.isArray(values)) return "";
          const name = typeof record.name === "string" ? record.name : "";
          const color = typeof record.color === "string" ? record.color : theme.colors.primary;
          return tooltipHtml(
            theme,
            name,
            indicators.map((indicator, index) => ({
              name: indicator.name,
              color,
              value: String(values[index] ?? ""),
            })),
          );
        },
      },
      radar: {
        indicator: indicators,
        center: ["50%", "46%"],
        radius: "62%",
        axisName: {
          color: theme.muted,
          fontFamily: theme.font,
          fontSize: 11,
        },
        splitNumber: 4,
        axisLine: { lineStyle: { color: theme.border } },
        splitLine: { lineStyle: { color: theme.border } },
        splitArea: {
          areaStyle: {
            color: [fade(theme.colors.primary, 0.02), fade(theme.colors.primary, 0.07)],
          },
        },
      },
      series: [
        {
          type: "radar" as const,
          symbol: "circle",
          symbolSize: 6,
          emphasis: { focus: "series" as const },
          data: series.map((item, index) => {
            const color = seriesColor(theme, item, index);
            return {
              name: item.name,
              value: item.data,
              itemStyle: { color, borderColor: theme.card, borderWidth: 1.5 },
              lineStyle: { width: 2, color },
              areaStyle: { color: fade(color, 0.16) },
            };
          }),
        },
      ],
      animationDuration: 700,
    }),
    [indicators, series, theme],
  );

  return <Chart option={option} label={label} className={className} />;
}
