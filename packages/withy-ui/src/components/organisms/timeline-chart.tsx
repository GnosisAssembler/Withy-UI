"use client";

import * as React from "react";
import type { EChartsCoreOption } from "echarts/core";
import { Chart, useChartTheme } from "./chart";
import {
  categoryAxis,
  chartGrid,
  fade,
  formatCount,
  legendStyle,
  readTimelineValue,
  seriesColor,
  tooltipBase,
  tooltipHtml,
  type ChartColor,
  type ChartTheme,
} from "../../lib/chart-theme";

export type TimelineDate = Date | number | string;

export type TimelineMarker = {
  name: string;
  at: TimelineDate;
  color?: ChartColor;
};

export type TimelineBar = {
  category: string;
  start: TimelineDate;
  end: TimelineDate;
  markers?: TimelineMarker[];
};

export type TimelineSeries = {
  name: string;
  data: TimelineBar[];
  color?: ChartColor;
  swatch?: string;
};

type TimelineChartProps = {
  categories: string[];
  series: TimelineSeries[];
  label: string;
  legend?: boolean;
  dateFormatter?: (value: number) => string;
  className?: string;
};

type PreparedMarker = { name: string; at: number; color: string };

type PreparedBar = {
  name: string;
  category: string;
  start: number;
  end: number;
  value: [string, number, number];
  markers: PreparedMarker[];
};

type PreparedSeries = {
  name: string;
  color: string;
  data: PreparedBar[];
};

type Box = { x: number; y: number; width: number; height: number };

type RenderParams = {
  seriesIndex: number;
  dataIndex: number;
  coordSys: { x?: unknown; y?: unknown; width?: unknown; height?: unknown };
};

type RenderApi = {
  coord: (data: (string | number)[]) => number[];
  size?: (dataSize: number[], dataItem?: (string | number)[]) => number | number[];
};

const dayMs = 86_400_000;
const hourMs = 3_600_000;
const minuteMs = 60_000;
const barShare = 0.8;
const minBarWidth = 2;
const barRadius = 3;

export function TimelineChart({
  categories,
  series,
  label,
  legend = true,
  dateFormatter,
  className,
}: TimelineChartProps) {
  const theme = useChartTheme();
  const option = React.useMemo<EChartsCoreOption>(() => {
    const groups = prepareSeries(categories, series, theme);
    const span = timeSpan(groups);
    const formatAxis = dateFormatter ?? ((value: number) => formatTimelineDate(value, span));
    const formatTip = dateFormatter ?? ((value: number) => formatTimelineStamp(value, span));
    const categoriesAxis = categoryAxis(theme, categories, true);

    return {
      backgroundColor: "transparent",
      textStyle: { fontFamily: theme.font, color: theme.muted },
      legend: legend ? legendStyle(theme) : { show: false },
      grid: chartGrid({ top: legend ? 36 : 16, right: 16, bottom: 8, left: 4 }),
      tooltip: {
        trigger: "item" as const,
        ...tooltipBase(theme),
        formatter: (params: unknown) => {
          const bar = readTimelineValue(params);
          if (!bar) return "";
          return tooltipHtml(theme, bar.category, [
            {
              name: bar.seriesName,
              color: bar.color,
              value: `${formatTip(bar.start)} – ${formatTip(bar.end)}`,
            },
            { name: "Duration", color: bar.color, value: formatDuration(bar.start, bar.end) },
            ...bar.markers.map((marker) => ({
              name: marker.name,
              color: marker.color || bar.color,
              value: formatTip(marker.at),
            })),
          ]);
        },
      },
      xAxis: {
        type: "time" as const,
        ...timeDomain(groups),
        axisLine: { lineStyle: { color: theme.border } },
        axisTick: { show: false },
        axisLabel: {
          color: theme.muted,
          fontFamily: theme.font,
          fontSize: 11,
          hideOverlap: true,
          formatter: (value: number | string) => {
            const time = typeof value === "number" ? value : new Date(value).getTime();
            return Number.isFinite(time) ? formatAxis(time) : "";
          },
        },
        splitLine: { lineStyle: { color: theme.border } },
      },
      yAxis: {
        ...categoriesAxis,
        inverse: true,
        axisLabel: { ...categoriesAxis.axisLabel, interval: 0, width: 128, overflow: "truncate" },
        splitLine: { show: true, lineStyle: { color: theme.border } },
      },
      series: groups.map((item) => ({
        name: item.name,
        type: "custom" as const,
        coordinateSystem: "cartesian2d" as const,
        clip: true,
        itemStyle: { color: item.color },
        encode: { x: [1, 2], y: 0 },
        data: item.data,
        renderItem: (params: RenderParams, api: RenderApi) =>
          renderBar(params, api, groups, item.color),
      })),
      animationDuration: 700,
    };
  }, [categories, dateFormatter, legend, series, theme]);

  return <Chart option={option} label={label} className={className} />;
}

function renderBar(params: RenderParams, api: RenderApi, groups: PreparedSeries[], color: string) {
  const datum = groups[params.seriesIndex]?.data[params.dataIndex];
  if (!datum) return null;
  const start = readPoint(api, datum.start, datum.category);
  const end = readPoint(api, datum.end, datum.category);
  if (!start || !end) return null;

  let x = Math.min(start.x, end.x);
  let width = Math.abs(end.x - start.x);
  if (width < minBarWidth) {
    x -= (minBarWidth - width) / 2;
    width = minBarWidth;
  }

  const band = readBand(api, datum.start, datum.category);
  const lane = laneBox(start.y, band, params.seriesIndex, groups.length, x, width);
  const bounds = gridBox(params.coordSys);
  const clipped = bounds ? clipBox(lane, bounds) : lane;
  if (!clipped) return null;

  const cut =
    bounds !== null &&
    (lane.x < bounds.x - 0.5 || lane.x + lane.width > bounds.x + bounds.width + 0.5);
  const radius = cut ? 0 : Math.min(barRadius, clipped.width / 2, clipped.height / 2);
  const children: Record<string, unknown>[] = [
    {
      type: "rect",
      transition: ["shape"],
      shape: { ...clipped, r: radius },
      style: {
        fill: translucent(color, 0.6),
        stroke: color,
        lineWidth: 1,
      },
      emphasis: { style: { fill: translucent(color, 0.9) } },
    },
  ];

  for (const marker of datum.markers) {
    const point = readPoint(api, marker.at, datum.category);
    if (!point) continue;
    if (point.x < clipped.x - 0.5 || point.x > clipped.x + clipped.width + 0.5) continue;
    children.push({
      type: "line",
      silent: true,
      z2: 2,
      transition: ["shape"],
      shape: {
        x1: point.x,
        y1: clipped.y,
        x2: point.x,
        y2: clipped.y + clipped.height,
      },
      style: { stroke: marker.color, lineWidth: 2, lineCap: "round" },
    });
  }

  return { type: "group", focus: "series", children };
}

function prepareSeries(
  categories: string[],
  series: TimelineSeries[],
  theme: ChartTheme,
): PreparedSeries[] {
  const known = new Set(categories);
  return series.map((item, index) => ({
    name: item.name,
    color: seriesColor(theme, item, index),
    data: item.data.flatMap((bar) => {
      if (!known.has(bar.category)) return [];
      const start = toTime(bar.start);
      const end = toTime(bar.end);
      if (start === null || end === null || end < start) return [];
      return [
        {
          name: bar.category,
          category: bar.category,
          start,
          end,
          value: [bar.category, start, end],
          markers: prepareMarkers(bar.markers, start, end, theme),
        },
      ];
    }),
  }));
}

function prepareMarkers(
  markers: TimelineMarker[] | undefined,
  start: number,
  end: number,
  theme: ChartTheme,
) {
  return (markers ?? []).flatMap((marker) => {
    if (!marker || typeof marker.name !== "string" || marker.name.trim() === "") return [];
    const at = toTime(marker.at);
    if (at === null || at < start || at > end) return [];
    return [
      { name: marker.name, at, color: marker.color ? theme.colors[marker.color] : theme.text },
    ];
  });
}

function toTime(value: TimelineDate): number | null {
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : null;
  }
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return parseDateOnly(trimmed);
  const time = new Date(trimmed).getTime();
  return Number.isFinite(time) ? time : null;
}

function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date.getTime();
}

function timeSpan(groups: PreparedSeries[]) {
  const times = groups.flatMap((group) => group.data.flatMap((bar) => [bar.start, bar.end]));
  if (times.length === 0) return 0;
  return Math.max(...times) - Math.min(...times);
}

function timeDomain(groups: PreparedSeries[]) {
  const times = groups.flatMap((group) => group.data.flatMap((bar) => [bar.start, bar.end]));
  if (times.length === 0) return {};
  const min = Math.min(...times);
  const max = Math.max(...times);
  const span = Math.max(max - min, dayMs);
  const pad = span * 0.04;
  return { min: min - pad, max: max + pad };
}

function formatTimelineDate(value: number, span: number) {
  if (span > 0 && span <= hourMs * 36) {
    return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(value);
  }
  if (span > 0 && span <= dayMs * 2) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
    }).format(value);
  }
  if (span >= dayMs * 370) {
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(value);
  }
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(value);
}

function formatTimelineStamp(value: number, span: number) {
  const date = new Date(value);
  const clock =
    date.getHours() !== 0 ||
    date.getMinutes() !== 0 ||
    date.getSeconds() !== 0 ||
    date.getMilliseconds() !== 0;
  if (!clock) return formatTimelineDate(value, span);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function formatDuration(start: number, end: number) {
  if (isMidnight(start) && isMidnight(end)) {
    const days = calendarDays(start, end);
    if (days <= 0) return "Less than a day";
    return days === 1 ? "1 day" : `${formatCount(days)} days`;
  }
  const ms = Math.max(0, end - start);
  if (ms >= dayMs) {
    const days = Math.round(ms / dayMs);
    return days === 1 ? "1 day" : `${formatCount(days)} days`;
  }
  if (ms >= hourMs) {
    const hours = Math.round(ms / hourMs);
    return hours === 1 ? "1 hour" : `${formatCount(hours)} hours`;
  }
  if (ms >= minuteMs) {
    const minutes = Math.round(ms / minuteMs);
    return minutes === 1 ? "1 minute" : `${formatCount(minutes)} minutes`;
  }
  return "Less than a minute";
}

function isMidnight(time: number) {
  const date = new Date(time);
  return (
    date.getHours() === 0 &&
    date.getMinutes() === 0 &&
    date.getSeconds() === 0 &&
    date.getMilliseconds() === 0
  );
}

function calendarDays(start: number, end: number) {
  const from = new Date(start);
  const to = new Date(end);
  const startUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const endUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((endUtc - startUtc) / dayMs);
}

function readPoint(api: RenderApi, time: number, category: string) {
  const pair = api.coord([time, category]);
  const x = pair?.[0];
  const y = pair?.[1];
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    !Number.isFinite(x) ||
    !Number.isFinite(y)
  ) {
    return null;
  }
  return { x, y };
}

function readBand(api: RenderApi, time: number, category: string) {
  const sized = api.size?.([0, 1], [time, category]);
  const band = Array.isArray(sized) ? sized[1] : sized;
  if (typeof band === "number" && Number.isFinite(band) && band > 0) return band;
  return 24;
}

function laneBox(
  centerY: number,
  band: number,
  seriesIndex: number,
  seriesCount: number,
  x: number,
  width: number,
): Box {
  const lanes = Math.max(seriesCount, 1);
  const laneHeight = band / lanes;
  const height = Math.max(laneHeight * barShare, 1);
  const y = centerY - band / 2 + seriesIndex * laneHeight + (laneHeight - height) / 2;
  return { x, y, width, height };
}

function gridBox(coordSys: RenderParams["coordSys"]): Box | null {
  const { x, y, width, height } = coordSys;
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number"
  ) {
    return null;
  }
  if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) return null;
  return { x, y, width, height };
}

function clipBox(target: Box, bounds: Box): Box | null {
  const x = Math.max(target.x, bounds.x);
  const y = Math.max(target.y, bounds.y);
  const right = Math.min(target.x + target.width, bounds.x + bounds.width);
  const bottom = Math.min(target.y + target.height, bounds.y + bounds.height);
  if (right <= x || bottom <= y) return null;
  return { x, y, width: right - x, height: bottom - y };
}

function translucent(color: string, alpha: number) {
  const faded = fade(color, alpha);
  if (faded !== color) return faded;
  return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}
