"use client";

import * as React from "react";
import type { EChartsCoreOption } from "echarts/core";
import { Chart, useChartTheme } from "./chart";
import {
  chartColorAt,
  chartFillClass,
  formatCount,
  formatPercent,
  readTreemapValue,
  seriesColor,
  tooltipBase,
  tooltipHtml,
  type ChartColor,
  type ChartTheme,
} from "../../lib/chart-theme";
import { cn } from "../../lib/cn";

export type TreemapItem = {
  name: string;
  value: number;
};

export type TreemapSeries = {
  name: string;
  data: TreemapItem[];
  color?: ChartColor;
  swatch?: string;
};

type TreemapChartProps = {
  series: TreemapSeries[];
  label: string;
  legend?: boolean;
  valueLabel?: string;
  valueFormatter?: (value: number) => string;
  className?: string;
};

type TreemapTile = {
  id: string;
  name: string;
  value: number;
  color: string;
  labelColor: string;
};

type TreemapGroup = {
  key: string;
  name: string;
  color: string;
  colorName: ChartColor;
  swatch?: string;
  tiles: TreemapTile[];
};

export function TreemapChart({
  series,
  label,
  legend = true,
  valueLabel = "Value",
  valueFormatter = formatCount,
  className,
}: TreemapChartProps) {
  const theme = useChartTheme();
  const [hiddenKeys, setHiddenKeys] = React.useState<string[]>([]);
  const groups = React.useMemo(() => prepareGroups(series, theme), [series, theme]);
  const shown = React.useMemo(
    () => (legend ? groups.filter((group) => !hiddenKeys.includes(group.key)) : groups),
    [groups, hiddenKeys, legend],
  );
  const option = React.useMemo<EChartsCoreOption>(() => {
    const total = shown.reduce(
      (sum, group) => sum + group.tiles.reduce((inner, tile) => inner + tile.value, 0),
      0,
    );

    return {
      backgroundColor: "transparent",
      textStyle: { fontFamily: theme.font, color: theme.muted },
      tooltip: {
        trigger: "item" as const,
        ...tooltipBase(theme),
        formatter: (params: unknown) => {
          const point = readTreemapValue(params);
          if (!point) return "";
          const share = total > 0 ? (point.value / total) * 100 : null;
          const seriesName =
            point.group && point.group !== point.name && point.group !== label ? point.group : "";
          return tooltipHtml(theme, point.name, [
            ...(seriesName ? [{ name: "Series", color: point.color, value: seriesName }] : []),
            { name: valueLabel, color: point.color, value: valueFormatter(point.value) },
            ...(share === null
              ? []
              : [{ name: "Share", color: point.color, value: formatPercent(share) }]),
          ]);
        },
      },
      series: [
        {
          name: label,
          type: "treemap" as const,
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          roam: false,
          nodeClick: false,
          cursor: "default",
          sort: "desc" as const,
          visibleMin: 0,
          breadcrumb: { show: false },
          label: {
            show: true,
            fontFamily: theme.font,
            fontSize: 12,
            fontWeight: 500,
            overflow: "truncate" as const,
            ellipsis: "...",
          },
          upperLabel: { show: false },
          itemStyle: {
            borderColor: theme.card,
            borderWidth: 2,
            gapWidth: 2,
          },
          emphasis: {
            upperLabel: { show: false },
            itemStyle: { borderColor: theme.heading, borderWidth: 2 },
          },
          levels: [
            {
              itemStyle: { borderWidth: 0, gapWidth: 4 },
              upperLabel: { show: false },
            },
            {
              itemStyle: { borderWidth: 0, gapWidth: 2, borderColor: theme.card },
              upperLabel: { show: false },
            },
            {
              itemStyle: {
                borderWidth: 2,
                gapWidth: 1,
                borderColor: theme.card,
                borderRadius: 2,
              },
              upperLabel: { show: false },
            },
          ],
          data: shown.map((group) => ({
            id: group.key,
            name: group.name,
            itemStyle: { color: group.color, borderWidth: 0, gapWidth: 2 },
            upperLabel: { show: false },
            emphasis: { upperLabel: { show: false } },
            children: group.tiles.map((tile) => ({
              id: tile.id,
              name: tile.name,
              value: tile.value,
              itemStyle: {
                color: tile.color,
                borderColor: theme.card,
                borderWidth: 2,
                borderRadius: 2,
              },
              label: { color: tile.labelColor },
              emphasis: { label: { color: tile.labelColor }, upperLabel: { show: false } },
            })),
          })),
        },
      ],
      animationDuration: 700,
      animationDurationUpdate: 500,
    };
  }, [label, shown, theme, valueFormatter, valueLabel]);

  const summary = shown.flatMap((group) =>
    group.tiles.map((tile) => `${group.name}, ${tile.name}, ${valueFormatter(tile.value)}`),
  );
  const accessibleLabel = summary.length > 0 ? `${label}. ${summary.join("; ")}` : label;

  return (
    <div className={cn("flex h-72 w-full min-h-0 min-w-0 flex-col", className)}>
      <div className="relative min-h-0 w-full flex-1">
        <Chart option={option} label={accessibleLabel} className="absolute inset-0 h-auto" />
      </div>
      {legend && groups.length > 0 ? (
        <ul
          aria-label="Series"
          className="mt-2 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1"
        >
          {groups.map((group) => {
            const shownGroup = !hiddenKeys.includes(group.key);
            return (
              <li key={group.key}>
                <button
                  type="button"
                  aria-pressed={shownGroup}
                  onClick={() =>
                    setHiddenKeys((current) =>
                      current.includes(group.key)
                        ? current.filter((key) => key !== group.key)
                        : [...current, group.key],
                    )
                  }
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-xs px-1 py-0.5 text-xs text-text-2 outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
                    !shownGroup && "opacity-40",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      group.swatch ? undefined : chartFillClass[group.colorName],
                    )}
                    style={group.swatch ? { backgroundColor: group.swatch } : undefined}
                  />
                  {group.name}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function prepareGroups(series: TreemapSeries[], theme: ChartTheme): TreemapGroup[] {
  return series.flatMap((item, index) => {
    const tiles = item.data.flatMap((tile, tileIndex) => {
      if (!tile.name.trim() || !Number.isFinite(tile.value) || tile.value <= 0) return [];
      return [{ name: tile.name, value: tile.value, tileIndex }];
    });
    if (tiles.length === 0) return [];
    const color = seriesColor(theme, item, index);
    const values = tiles.map((tile) => tile.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const key = `${index}:${item.name}`;
    return [
      {
        key,
        name: item.name,
        color,
        colorName: chartColorAt(index, item.color),
        swatch: item.swatch,
        tiles: tiles.map((tile) => {
          const fill = tileColor(color, tile.value, min, max);
          return {
            id: `${key}:${tile.tileIndex}:${tile.name}`,
            name: tile.name,
            value: tile.value,
            color: fill,
            labelColor: ink(fill, theme),
          };
        }),
      },
    ];
  });
}

function tileColor(base: string, value: number, min: number, max: number) {
  if (!(max > min)) return base;
  const rank = (value - min) / (max - min);
  return mixHex(base, "#ffffff", (1 - rank) * 0.45);
}

function ink(fill: string, theme: ChartTheme) {
  const onDark = theme.name === "dark" ? theme.card : theme.heading;
  const onLight = theme.name === "dark" ? theme.heading : theme.card;
  if (!parseHex(fill) || !parseHex(onDark) || !parseHex(onLight)) return onLight;
  return contrast(fill, onDark) >= contrast(fill, onLight) ? onDark : onLight;
}

function mixHex(color: string, toward: string, amount: number) {
  if (amount <= 0) return color;
  const from = parseHex(color);
  const to = parseHex(toward);
  if (!from || !to) return color;
  const mixed = from.map((channel, index) =>
    Math.round(channel + ((to[index] ?? channel) - channel) * Math.min(1, amount)),
  );
  return `#${mixed.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function parseHex(color: string): [number, number, number] | null {
  const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(color.trim());
  if (!match) return null;
  const raw = match[1] ?? "";
  const full = raw.length === 3 ? [...raw].map((char) => char + char).join("") : raw;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

function contrast(a: string, b: string) {
  const lighter = Math.max(luminance(a), luminance(b));
  const darker = Math.min(luminance(a), luminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}

function luminance(color: string) {
  const rgb = parseHex(color);
  if (!rgb) return 0;
  const [red, green, blue] = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (red ?? 0) + 0.7152 * (green ?? 0) + 0.0722 * (blue ?? 0);
}
