"use client";

import * as React from "react";
import { BarChart, HeatmapChart, LineChart, RadarChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  RadarComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { init, use as registerEcharts, type ECharts, type EChartsCoreOption } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useTheme } from "@/components/theme/theme-provider";
import { readChartTheme } from "@/lib/chart-theme";
import { cn } from "@/lib/cn";

registerEcharts([
  BarChart,
  CanvasRenderer,
  GridComponent,
  HeatmapChart,
  LegendComponent,
  LineChart,
  RadarChart,
  RadarComponent,
  TooltipComponent,
  VisualMapComponent,
]);

export function useChartTheme() {
  const { theme } = useTheme();
  return React.useMemo(() => readChartTheme(theme), [theme]);
}

type ChartProps = {
  option: EChartsCoreOption;
  label: string;
  className?: string;
};

export function Chart({ option, label, className }: ChartProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<ECharts | null>(null);
  const optionRef = React.useRef(option);

  React.useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const chart = init(node, undefined, { renderer: "canvas" });
    chartRef.current = chart;
    chart.setOption(optionRef.current, { notMerge: true });

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        chart.resize();
      });
      observer.observe(node);
    }

    const fontsReady = document.fonts?.ready.then(() => {
      if (chart.isDisposed()) return;
      chart.setOption(optionRef.current, { notMerge: true });
    });

    return () => {
      void fontsReady?.catch(() => undefined);
      observer?.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    optionRef.current = option;
    chartRef.current?.setOption(option, { notMerge: true });
  }, [option]);

  return (
    <div
      ref={nodeRef}
      role="img"
      aria-label={label}
      className={cn("h-72 w-full min-w-0", className)}
    />
  );
}
