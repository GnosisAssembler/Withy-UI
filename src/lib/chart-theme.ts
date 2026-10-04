import type { ThemeName } from "@/lib/theme";

export const chartColorNames = [
  "primary",
  "teal",
  "indigo",
  "pink",
  "orange",
  "success",
  "info",
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
  text: "#001737",
  text2: "#1b2e4b",
  muted: "#8392a5",
  border: "#485e9029",
  card: "#ffffff",
  heading: "#001737",
  mutedFill: "#f4f5f8",
  brand: "#042893",
  primary: "#0168fa",
  teal: "#00cccc",
  indigo: "#5b47fb",
  pink: "#f10075",
  orange: "#fd7e14",
  success: "#10b759",
  info: "#00b8d4",
  danger: "#dc3545",
};

const darkSurfaces = {
  text: "#ffffff",
  text2: "#cdd4e0",
  muted: "#97a3b9",
  card: "#1c273c",
  heading: "#ffffff",
  mutedFill: "#243044",
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
    teal: cssVar("--teal", lightFallbacks.teal),
    indigo: cssVar("--indigo", lightFallbacks.indigo),
    pink: cssVar("--pink", lightFallbacks.pink),
    orange: cssVar("--orange", lightFallbacks.orange),
    success: cssVar("--success", lightFallbacks.success),
    info: cssVar("--info", lightFallbacks.info),
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
    series: [
      colors.primary,
      colors.teal,
      colors.indigo,
      colors.pink,
      colors.orange,
      colors.success,
    ],
    heat: dark
      ? [mutedFill, "#1b5a96", colors.primary, "#9ec5ff"]
      : [mutedFill, "#d4e6ff", colors.primary, brand],
  };
}

export function seriesColor(theme: ChartTheme, series: ChartSeries, index: number) {
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
