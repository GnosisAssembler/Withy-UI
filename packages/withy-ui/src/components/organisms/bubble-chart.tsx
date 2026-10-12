"use client";

import * as React from "react";
import type { EChartsCoreOption } from "echarts/core";
import { Chart, useChartTheme } from "./chart";
import {
  chartValue,
  fade,
  formatCount,
  legendStyle,
  readBubbleValue,
  seriesColor,
  tooltipBase,
  tooltipHtml,
  valueAxis,
  type ChartColor,
} from "../../lib/chart-theme";

export type BubblePoint = {
  name: string;
  x: number;
  y: number;
  size: number;
};

export type BubbleSeries = {
  name: string;
  data: BubblePoint[];
  color?: ChartColor;
  swatch?: string;
};

type BubbleChartProps = {
  series: BubbleSeries[];
  label: string;
  xLabel?: string;
  yLabel?: string;
  sizeLabel?: string;
  legend?: boolean;
  xFormatter?: (value: number) => string;
  yFormatter?: (value: number) => string;
  sizeFormatter?: (value: number) => string;
  className?: string;
};

const minDiameter = 12;
const maxDiameter = 48;

function diameter(size: number, min: number, max: number) {
  if (max === min) return (minDiameter + maxDiameter) / 2;
  const share = (size - min) / (max - min);
  return minDiameter + share * (maxDiameter - minDiameter);
}

function finitePoint(point: BubblePoint): BubblePoint | null {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return null;
  return { ...point, size: chartValue(point.size) };
}

export function BubbleChart({
  series,
  label,
  xLabel = "X",
  yLabel = "Y",
  sizeLabel = "Size",
  legend = true,
  xFormatter = formatCount,
  yFormatter = formatCount,
  sizeFormatter = formatCount,
  className,
}: BubbleChartProps) {
  const theme = useChartTheme();
  const option = React.useMemo<EChartsCoreOption>(() => {
    const groups = series.map((item) => ({
      ...item,
      data: item.data.flatMap((point) => {
        const next = finitePoint(point);
        return next ? [next] : [];
      }),
    }));
    const sizes = groups.flatMap((item) => item.data.map((point) => point.size));
    const minSize = sizes.length > 0 ? Math.min(...sizes) : 0;
    const maxSize = sizes.length > 0 ? Math.max(...sizes) : 0;
    const xs = groups.flatMap((item) => item.data.map((point) => point.x));
    const ys = groups.flatMap((item) => item.data.map((point) => point.y));
    const xMin = xs.length > 0 && Math.min(...xs) >= 0 ? 0 : undefined;
    const yMin = ys.length > 0 && Math.min(...ys) >= 0 ? 0 : undefined;
    const xMax = axisHeadroom(xs, xMin);
    const yMax = axisHeadroom(ys, yMin);

    return {
      backgroundColor: "transparent",
      textStyle: { fontFamily: theme.font, color: theme.muted },
      legend: legend ? legendStyle(theme) : { show: false },
      grid: chartBubbleGrid(legend),
      tooltip: {
        trigger: "item" as const,
        ...tooltipBase(theme),
        formatter: (params: unknown) => {
          const point = readBubbleValue(params);
          if (!point) return "";
          return tooltipHtml(theme, point.name || point.seriesName, [
            { name: "Series", color: point.color, value: point.seriesName },
            { name: xLabel, color: point.color, value: xFormatter(point.x) },
            { name: yLabel, color: point.color, value: yFormatter(point.y) },
            { name: sizeLabel, color: point.color, value: sizeFormatter(point.size) },
          ]);
        },
      },
      xAxis: { ...valueAxis(theme, xFormatter), min: xMin, max: xMax },
      yAxis: { ...valueAxis(theme, yFormatter), min: yMin, max: yMax },
      series: groups.map((item, index) => {
        const color = seriesColor(theme, item, index);
        return {
          name: item.name,
          type: "scatter" as const,
          data: item.data.map((point) => ({
            name: point.name,
            value: [point.x, point.y, point.size],
          })),
          clip: false,
          symbolSize: (raw: number | number[]) => {
            const size = Array.isArray(raw) ? raw[2] : raw;
            return diameter(typeof size === "number" ? size : 0, minSize, maxSize);
          },
          itemStyle: {
            color: fade(color, 0.82),
            borderColor: theme.card,
            borderWidth: 1.5,
          },
          emphasis: { focus: "series" as const, scale: 1.08 },
        };
      }),
      animationDuration: 700,
    };
  }, [legend, series, sizeFormatter, sizeLabel, theme, xFormatter, xLabel, yFormatter, yLabel]);

  return <Chart option={option} label={label} className={className} />;
}

function niceCeil(value: number) {
  if (!Number.isFinite(value) || value <= 0) return undefined;
  const power = 10 ** Math.floor(Math.log10(value));
  const steps = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  return steps.map((step) => step * power).find((step) => step >= value - 1e-9);
}

function axisHeadroom(values: number[], floor: number | undefined) {
  if (values.length === 0) return undefined;
  const max = Math.max(...values);
  const min = floor ?? Math.min(...values);
  const span = max - min || Math.abs(max) || 1;
  return niceCeil(max + span * 0.12);
}

function chartBubbleGrid(legend: boolean) {
  return {
    top: legend ? 36 : 16,
    right: 16,
    bottom: 8,
    left: 8,
    containLabel: true,
  };
}
