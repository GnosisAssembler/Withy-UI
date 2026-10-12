"use client";

import * as React from "react";
import type { EChartsCoreOption } from "echarts/core";
import { Figure } from "../atoms/figure";
import { Text } from "../atoms/text";
import { Chart, useChartTheme } from "./chart";
import {
  chartValue,
  formatCount,
  formatPercent,
  legendStyle,
  readSliceTooltip,
  seriesColor,
  tooltipBase,
  tooltipHtml,
  type ChartColor,
} from "../../lib/chart-theme";
import { cn } from "../../lib/cn";

export type DonutSlice = {
  name: string;
  value: number;
  color?: ChartColor;
  swatch?: string;
};

type DonutChartProps = {
  data: DonutSlice[];
  label: string;
  variant?: "donut" | "pie";
  legend?: boolean;
  showTotal?: boolean;
  totalLabel?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
};

export function DonutChart({
  data,
  label,
  variant = "donut",
  legend = true,
  showTotal,
  totalLabel = "Total",
  valueFormatter = formatCount,
  className,
}: DonutChartProps) {
  const theme = useChartTheme();
  const totalVisible = showTotal ?? variant === "donut";
  const slices = React.useMemo(
    () => data.map((item) => ({ ...item, value: chartValue(item.value) })),
    [data],
  );
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const summary = [
    ...slices.map((slice) => `${slice.name} ${valueFormatter(slice.value)}`),
    ...(totalVisible ? [`${totalLabel} ${valueFormatter(total)}`] : []),
  ];
  const accessibleLabel = summary.length > 0 ? `${label}. ${summary.join(", ")}` : label;

  const option = React.useMemo<EChartsCoreOption>(() => {
    const separated = slices.length > 1;
    return {
      backgroundColor: "transparent",
      color: theme.series,
      textStyle: { fontFamily: theme.font, color: theme.muted },
      legend:
        legend && slices.length > 0
          ? { ...legendStyle(theme), top: "auto", right: "auto", bottom: 0, left: "center" }
          : { show: false },
      tooltip: {
        trigger: "item" as const,
        ...tooltipBase(theme),
        formatter: (params: unknown) => {
          const slice = readSliceTooltip(params);
          if (!slice) return "";
          const rows = [{ name: "Value", color: slice.color, value: valueFormatter(slice.value) }];
          if (slice.percent !== null) {
            rows.push({
              name: "Share",
              color: slice.color,
              value: formatPercent(slice.percent),
            });
          }
          return tooltipHtml(theme, slice.name, rows);
        },
      },
      series: [
        {
          name: label,
          type: "pie" as const,
          radius: variant === "donut" ? ["54%", "72%"] : "72%",
          center: ["50%", legend ? "44%" : "50%"],
          startAngle: 90,
          clockwise: true,
          cursor: "default",
          avoidLabelOverlap: true,
          showEmptyCircle: true,
          emptyCircleStyle: { color: theme.mutedFill },
          label: { show: false },
          labelLine: { show: false },
          itemStyle: {
            borderRadius: separated ? 3 : 0,
            borderColor: theme.card,
            borderWidth: separated ? 2 : 0,
          },
          emphasis: { scale: true, scaleSize: 6 },
          data: slices.map((item, index) => ({
            name: item.name,
            value: item.value,
            itemStyle: { color: seriesColor(theme, item, index) },
          })),
        },
      ],
      animationDuration: 700,
    };
  }, [label, legend, slices, theme, valueFormatter, variant]);

  return (
    <div className={cn("relative h-72 w-full min-w-0", className)}>
      <Chart option={option} label={accessibleLabel} className="h-full" />
      {totalVisible ? (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 flex w-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
          style={{ top: legend ? "44%" : "50%" }}
        >
          <Figure as="span" size="md" className="max-w-full">
            {valueFormatter(total)}
          </Figure>
          <Text as="span" size="xs" tone="muted" className="mt-1">
            {totalLabel}
          </Text>
        </div>
      ) : null}
    </div>
  );
}
