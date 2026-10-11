import type { ChartSeries } from "../lib/chart-theme";

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const channelRevenue: ChartSeries[] = [
  { name: "Direct", data: [38, 41, 44, 47, 46, 52, 57, 60, 63, 68, 74, 81] },
  { name: "Organic", data: [24, 26, 33, 39, 37, 31, 30, 35, 42, 46, 44, 40] },
  { name: "Referral", data: [11, 12, 12, 13, 14, 15, 16, 16, 18, 19, 21, 23] },
  { name: "Social", data: [7, 8, 9, 10, 12, 13, 14, 16, 19, 24, 33, 38] },
];

export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const weeklyOrders: ChartSeries[] = [
  { name: "This week", data: [186, 214, 198, 236, 252, 301, 274], color: "primary" },
  { name: "Last week", data: [164, 188, 209, 221, 230, 276, 241], color: "indigo" },
];

export const orderVolume: ChartSeries = {
  name: "Orders",
  data: [980, 1040, 1120, 1210, 1180, 1260, 1340, 1410, 1500, 1580, 1720, 1840],
  color: "primary",
};

export const conversionRate: ChartSeries = {
  name: "Conversion",
  data: [1.8, 1.9, 2.2, 2.4, 2.1, 2.3, 2.6, 2.5, 2.8, 2.7, 3.1, 3.4],
  color: "teal",
};

export const hours = Array.from({ length: 24 }, (_, hour) => {
  const suffix = hour < 12 ? "a" : "p";
  const clock = hour % 12 === 0 ? 12 : hour % 12;
  return `${clock}${suffix}`;
});

function demandAt(day: number, hour: number) {
  const weekend = day >= 5;
  const wave = (center: number, width: number, height: number) =>
    height * Math.exp(-((hour - center) ** 2) / width);
  const night = hour < 6 || hour > 22 ? 3 : 7;
  const value = weekend
    ? night + wave(11, 8, 64) + wave(15.5, 12, 34)
    : night + wave(9, 3.5, 24) + wave(12.5, 5.5, 76) + wave(18.5, 6.5, 60);
  const wobble = ((day * 3 + hour * 5) % 7) - 3;
  return Math.max(0, Math.round(value + wobble));
}

export const demandCells: [number, number, number][] = weekdays.flatMap((_, day) =>
  hours.map((_, hour) => [hour, day, demandAt(day, hour)] as [number, number, number]),
);

export const qualityAxes = [
  { name: "Reach", max: 100 },
  { name: "Conversion", max: 100 },
  { name: "Retention", max: 100 },
  { name: "Order value", max: 100 },
  { name: "Repeat", max: 100 },
];

export const channelScores: ChartSeries[] = [
  { name: "Direct", data: [72, 86, 80, 74, 68], color: "primary" },
  { name: "Organic", data: [90, 64, 76, 58, 73], color: "teal" },
  { name: "Social", data: [66, 46, 41, 52, 37], color: "pink" },
];
