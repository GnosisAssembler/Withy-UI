import type { ThemeName } from "./theme";

export const chartColorNames = [
  "primary",
  "cyan",
  "teal",
  "indigo",
  "pink",
  "orange",
  "success",
  "info",
  "warning",
  "danger",
] as const;

export type ChartColor = (typeof chartColorNames)[number];

export type ChartSeries = {
  name: string;
  data: number[];
  color?: ChartColor;
  swatch?: string;
};

type ColorMap = Record<ChartColor, string>;

export type ChartTheme = {
  name: ThemeName;
  font: string;
  text: string;
  text2: string;
  muted: string;
  border: string;
  card: string;
  heading: string;
  mutedFill: string;
  colors: ColorMap;
  series: string[];
  heat: string[];
};

const lightFallbacks: ColorMap & {
  font: string;
  text: string;
  text2: string;
  muted: string;
  border: string;
  card: string;
  heading: string;
  mutedFill: string;
  brand: string;
} = {
  font: '"IBM Plex Sans", sans-serif',
  text: "#1C1428",
  text2: "#3A3148",
  muted: "#6E657C",
  border: "#3A284829",
  card: "#ffffff",
  heading: "#1C1428",
  mutedFill: "#EBE6F1",
  brand: "#301A4B",
  primary: "#0E7484",
  cyan: "#48ACF0",
  teal: "#8AFFC1",
  indigo: "#6B5CA5",
  pink: "#FE5D9F",
  orange: "#F5D6BA",
  success: "#0E7A58",
  info: "#3A6A8C",
  warning: "#B85E0C",
  danger: "#C41E36",
};

const darkSurfaces = {
  text: "#F4F0F8",
  text2: "#D8D0E2",
  muted: "#A79FB4",
  card: "#1C1828",
  heading: "#F4F0F8",
  mutedFill: "#2A2436",
};

function cssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function readChartTheme(name: ThemeName = "light"): ChartTheme {
  const dark = name === "dark";
  const font =
    (typeof window !== "undefined" && getComputedStyle(document.body).fontFamily) ||
    lightFallbacks.font;
  const colors: ColorMap = {
    primary: cssVar("--primary", lightFallbacks.primary),
    cyan: cssVar("--cyan", lightFallbacks.cyan),
    teal: cssVar("--teal", lightFallbacks.teal),
    indigo: cssVar("--indigo", lightFallbacks.indigo),
    pink: cssVar("--pink", lightFallbacks.pink),
    orange: cssVar("--orange", lightFallbacks.orange),
    success: cssVar("--success", lightFallbacks.success),
    info: cssVar("--info", lightFallbacks.info),
    warning: cssVar("--warning", lightFallbacks.warning),
    danger: cssVar("--danger", lightFallbacks.danger),
  };
  const mutedFill = cssVar("--muted", dark ? darkSurfaces.mutedFill : lightFallbacks.mutedFill);
  const brand = cssVar("--brand", lightFallbacks.brand);

  return {
    name,
    font,
    text: cssVar("--text", dark ? darkSurfaces.text : lightFallbacks.text),
    text2: cssVar("--text-2", dark ? darkSurfaces.text2 : lightFallbacks.text2),
    muted: cssVar("--text-3", dark ? darkSurfaces.muted : lightFallbacks.muted),
    border: cssVar("--border", lightFallbacks.border),
    card: cssVar("--card", dark ? darkSurfaces.card : lightFallbacks.card),
    heading: cssVar("--heading", dark ? darkSurfaces.heading : lightFallbacks.heading),
    mutedFill,
    colors,
    series: [colors.primary, colors.teal, colors.indigo, colors.pink, colors.orange, colors.cyan],
    heat: dark
      ? [mutedFill, "#1A5560", colors.primary, "#C9F6FA"]
      : [mutedFill, "#D7F4F6", colors.primary, brand],
  };
}

export const chartSeriesColors = [
  "primary",
  "teal",
  "indigo",
  "pink",
  "orange",
  "cyan",
] as const satisfies readonly ChartColor[];

export const chartFillClass = {
  primary: "bg-primary",
  cyan: "bg-cyan",
  teal: "bg-teal",
  indigo: "bg-indigo",
  pink: "bg-pink",
  orange: "bg-orange",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
} as const satisfies Record<ChartColor, string>;

export function chartColorAt(index: number, color?: ChartColor): ChartColor {
  if (color) return color;
  return chartSeriesColors[index % chartSeriesColors.length] ?? "primary";
}

export function chartColorMix(color: ChartColor, percent: number) {
  return `color-mix(in srgb, var(--${color}) ${percent}%, transparent)`;
}

export function chartValue(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function seriesColor(
  theme: ChartTheme,
  series: { color?: ChartColor; swatch?: string },
  index: number,
) {
  if (series.swatch) return series.swatch;
  if (series.color) return theme.colors[series.color];
  return theme.series[index % theme.series.length] ?? theme.colors.primary;
}

export function fade(color: string, alpha: number) {
  const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(color.trim());
  if (!match) return color;
  const raw = match[1] ?? "";
  const full = raw.length === 3 ? [...raw].map((char) => char + char).join("") : raw;
  const red = Number.parseInt(full.slice(0, 2), 16);
  const green = Number.parseInt(full.slice(2, 4), 16);
  const blue = Number.parseInt(full.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatThousands(value: number) {
  return `$${formatCount(value)}k`;
}

export function formatPercent(value: number) {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char] ?? char;
  });
}

export type TooltipRow = {
  name: string;
  color: string;
  value: number;
  axisLabel: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function readTooltipRows(params: unknown): TooltipRow[] {
  const list = Array.isArray(params) ? params : [params];
  return list.flatMap((item) => {
    if (!isObject(item) || typeof item.value !== "number" || Number.isNaN(item.value)) return [];
    return [
      {
        name: typeof item.seriesName === "string" ? item.seriesName : "",
        color: typeof item.color === "string" ? item.color : lightFallbacks.primary,
        value: item.value,
        axisLabel: typeof item.name === "string" ? item.name : "",
      },
    ];
  });
}

export function readSliceTooltip(params: unknown): {
  name: string;
  color: string;
  value: number;
  percent: number | null;
} | null {
  const item = Array.isArray(params) ? params[0] : params;
  if (!isObject(item) || typeof item.value !== "number" || Number.isNaN(item.value)) return null;
  return {
    name: typeof item.name === "string" ? item.name : "",
    color: typeof item.color === "string" ? item.color : lightFallbacks.primary,
    value: item.value,
    percent: typeof item.percent === "number" && !Number.isNaN(item.percent) ? item.percent : null,
  };
}

export function readBubbleValue(params: unknown): {
  name: string;
  seriesName: string;
  color: string;
  x: number;
  y: number;
  size: number;
} | null {
  const item = Array.isArray(params) ? params[0] : params;
  if (!isObject(item) || !Array.isArray(item.value) || item.value.length < 3) return null;
  const [x, y, size] = item.value;
  if (typeof x !== "number" || typeof y !== "number" || typeof size !== "number") return null;
  if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(size)) return null;
  return {
    name: typeof item.name === "string" ? item.name : "",
    seriesName: typeof item.seriesName === "string" ? item.seriesName : "",
    color: typeof item.color === "string" ? item.color : lightFallbacks.primary,
    x,
    y,
    size,
  };
}

export function readTreemapValue(params: unknown): {
  name: string;
  group: string;
  color: string;
  value: number;
} | null {
  const item = Array.isArray(params) ? params[0] : params;
  if (!isObject(item)) return null;
  const raw = Array.isArray(item.value) ? item.value[0] : item.value;
  if (typeof raw !== "number" || Number.isNaN(raw)) return null;
  const ancestors = Array.isArray(item.treeAncestors)
    ? item.treeAncestors
    : Array.isArray(item.treePathInfo)
      ? item.treePathInfo
      : [];
  const names = ancestors.flatMap((node) =>
    isObject(node) && typeof node.name === "string" ? [node.name] : [],
  );
  return {
    name: typeof item.name === "string" ? item.name : (names.at(-1) ?? ""),
    group: names.length >= 2 ? (names.at(-2) ?? "") : "",
    color: typeof item.color === "string" ? item.color : lightFallbacks.primary,
    value: raw,
  };
}

export function readTimelineValue(params: unknown): {
  seriesName: string;
  category: string;
  color: string;
  start: number;
  end: number;
  markers: { name: string; at: number; color: string }[];
} | null {
  const item = Array.isArray(params) ? params[0] : params;
  if (!isObject(item)) return null;
  const data = isObject(item.data) && !Array.isArray(item.data) ? item.data : item;
  const value = Array.isArray(data.value)
    ? data.value
    : Array.isArray(item.value)
      ? item.value
      : null;
  if (!value || value.length < 3) return null;
  const start = value[1];
  const end = value[2];
  if (typeof start !== "number" || typeof end !== "number") return null;
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  const category =
    typeof data.category === "string"
      ? data.category
      : typeof item.name === "string"
        ? item.name
        : "";
  return {
    seriesName: typeof item.seriesName === "string" ? item.seriesName : "",
    category,
    color: typeof item.color === "string" ? item.color : lightFallbacks.primary,
    start,
    end,
    markers: readTimelineMarkers(data.markers),
  };
}

function readTimelineMarkers(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((marker) => {
    if (!isObject(marker) || typeof marker.name !== "string" || typeof marker.at !== "number") {
      return [];
    }
    if (Number.isNaN(marker.at)) return [];
    return [
      {
        name: marker.name,
        at: marker.at,
        color: typeof marker.color === "string" ? marker.color : "",
      },
    ];
  });
}

export function readHeatmapValue(params: unknown) {
  if (!isObject(params) || !Array.isArray(params.value) || params.value.length < 3) return null;
  const [x, y, value] = params.value;
  if (typeof x !== "number" || typeof y !== "number" || typeof value !== "number") return null;
  return { x, y, value };
}

export function tooltipHtml(
  theme: ChartTheme,
  title: string,
  rows: { name: string; value: string; color: string }[],
  total?: string,
) {
  const body = rows
    .map(
      (
        row,
      ) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:4px">
        <span style="display:inline-flex;align-items:center;gap:6px;color:${theme.text2}">
          <span style="width:8px;height:8px;border-radius:99px;background:${row.color}"></span>
          ${escapeHtml(row.name)}
        </span>
        <span style="font-family:var(--font-rubik),Rubik,sans-serif;color:${theme.heading}">${escapeHtml(row.value)}</span>
      </div>`,
    )
    .join("");
  const footer =
    total === undefined
      ? ""
      : `<div style="display:flex;justify-content:space-between;gap:16px;margin-top:8px;padding-top:6px;border-top:1px solid ${theme.border};color:${theme.heading}">
          <span>Total</span>
          <span style="font-family:var(--font-rubik),Rubik,sans-serif">${escapeHtml(total)}</span>
        </div>`;

  return `<div style="min-width:148px;font-family:inherit">
    <div style="font-size:11px;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;color:${theme.muted}">${escapeHtml(title)}</div>
    ${body}${footer}
  </div>`;
}

export function tooltipBase(theme: ChartTheme) {
  return {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    padding: [10, 12] as [number, number],
    extraCssText: "border-radius:4px;box-shadow:0 8px 24px rgb(28 39 60 / 0.12);",
    textStyle: {
      color: theme.text,
      fontFamily: theme.font,
      fontSize: 12,
    },
    confine: true,
  };
}

export function axisTooltip(
  theme: ChartTheme,
  format: (value: number, seriesName: string) => string,
  total?: (rows: TooltipRow[]) => string | undefined,
) {
  return {
    trigger: "axis" as const,
    ...tooltipBase(theme),
    formatter: (params: unknown) => {
      const rows = readTooltipRows(params);
      return tooltipHtml(
        theme,
        rows[0]?.axisLabel ?? "",
        rows.map((row) => ({
          name: row.name,
          color: row.color,
          value: format(row.value, row.name),
        })),
        total?.(rows),
      );
    },
  };
}

export function legendStyle(theme: ChartTheme) {
  return {
    icon: "circle" as const,
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 16,
    top: 0,
    right: 0,
    textStyle: {
      color: theme.text2,
      fontFamily: theme.font,
      fontSize: 12,
    },
  };
}

export function categoryAxis(theme: ChartTheme, categories: string[], boundaryGap: boolean) {
  return {
    type: "category" as const,
    data: categories,
    boundaryGap,
    axisLine: { lineStyle: { color: theme.border } },
    axisTick: { show: false },
    axisLabel: {
      color: theme.muted,
      fontFamily: theme.font,
      fontSize: 11,
      hideOverlap: true,
    },
  };
}

export function valueAxis(theme: ChartTheme, formatter?: (value: number) => string) {
  return {
    type: "value" as const,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: theme.muted,
      fontFamily: theme.font,
      fontSize: 11,
      ...(formatter ? { formatter: (value: number) => formatter(value) } : {}),
    },
    splitLine: {
      lineStyle: { color: theme.border },
    },
  };
}

export function chartGrid(edge?: { top?: number; right?: number; bottom?: number; left?: number }) {
  return {
    top: edge?.top ?? 36,
    right: edge?.right ?? 8,
    bottom: edge?.bottom ?? 4,
    left: edge?.left ?? 4,
    containLabel: true,
  };
}

export function areaFill(color: string, stacked: boolean) {
  if (stacked) return fade(color, 0.88);
  return {
    type: "linear" as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: fade(color, 0.4) },
      { offset: 1, color: fade(color, 0.03) },
    ],
  };
}
