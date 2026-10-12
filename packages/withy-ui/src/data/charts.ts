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

export const channelShare = [
  { name: "Direct", value: 486, color: "primary" as const },
  { name: "Organic", value: 312, color: "teal" as const },
  { name: "Referral", value: 148, color: "indigo" as const },
  { name: "Social", value: 96, color: "pink" as const },
];

export const topPages = [
  { name: "/pricing", value: 2480 },
  { name: "/docs/charts", value: 1860 },
  { name: "/customers", value: 1420 },
  { name: "/changelog", value: 980 },
  { name: "/billing", value: 760 },
  { name: "/sign-in", value: 640 },
  { name: "/status", value: 410 },
];

export const activeAccounts: ChartSeries[] = [
  {
    name: "Paid",
    data: [120, 128, 135, 142, 148, 160, 171, 180, 194, 210, 228, 246],
    color: "primary",
  },
  {
    name: "Free",
    data: [340, 352, 361, 370, 368, 390, 404, 418, 430, 448, 470, 492],
    color: "cyan",
  },
];

export const accountBubbles = [
  {
    name: "Direct",
    color: "primary" as const,
    data: [
      { name: "North", x: 48, y: 220, size: 18 },
      { name: "East", x: 72, y: 410, size: 46 },
      { name: "South", x: 36, y: 160, size: 12 },
      { name: "West", x: 64, y: 300, size: 33 },
    ],
  },
  {
    name: "Partner",
    color: "indigo" as const,
    data: [
      { name: "North", x: 58, y: 140, size: 22 },
      { name: "East", x: 90, y: 260, size: 54 },
      { name: "South", x: 44, y: 190, size: 16 },
      { name: "West", x: 80, y: 210, size: 28 },
    ],
  },
];

export const deviceTreemap = [
  {
    name: "Desktops",
    color: "primary" as const,
    data: [
      { name: "Apple", value: 50 },
      { name: "Acer", value: 30 },
      { name: "Asus", value: 21 },
    ],
  },
  {
    name: "Laptops",
    color: "teal" as const,
    data: [
      { name: "Dell", value: 21 },
      { name: "HP", value: 16 },
      { name: "Lenovo", value: 20 },
    ],
  },
  {
    name: "Tablets",
    color: "indigo" as const,
    data: [
      { name: "Samsung", value: 4 },
      { name: "Huawei", value: 7 },
      { name: "Microsoft", value: 11 },
      { name: "Amazon", value: 31 },
      { name: "Lenovo", value: 13 },
    ],
  },
  {
    name: "Mobile",
    color: "pink" as const,
    data: [
      { name: "Apple", value: 10 },
      { name: "Samsung", value: 20 },
      { name: "Huawei", value: 51 },
      { name: "Xiaomi", value: 30 },
    ],
  },
];

export const sprintTasks = ["Design", "Code", "Test", "Validation", "Deployment"];

export const sprintSchedule = [
  {
    name: "Alice",
    color: "primary" as const,
    data: [
      { category: "Design", start: "2024-03-01", end: "2024-03-03" },
      { category: "Design", start: "2024-03-05", end: "2024-03-08" },
      { category: "Code", start: "2024-03-02", end: "2024-03-05" },
      { category: "Code", start: "2024-03-05", end: "2024-03-07" },
      { category: "Test", start: "2024-03-03", end: "2024-03-09" },
      { category: "Test", start: "2024-03-08", end: "2024-03-11" },
      { category: "Validation", start: "2024-03-11", end: "2024-03-16" },
    ],
  },
  {
    name: "Ravi",
    color: "indigo" as const,
    data: [
      { category: "Design", start: "2024-03-02", end: "2024-03-05" },
      { category: "Design", start: "2024-03-10", end: "2024-03-16" },
      { category: "Code", start: "2024-03-03", end: "2024-03-07" },
      {
        category: "Test",
        start: "2024-03-06",
        end: "2024-03-16",
        markers: [{ name: "Break", at: "2024-03-10" }],
      },
      { category: "Deployment", start: "2024-03-20", end: "2024-03-22" },
    ],
  },
  {
    name: "Mia",
    color: "pink" as const,
    data: [
      { category: "Code", start: "2024-03-10", end: "2024-03-17" },
      {
        category: "Validation",
        start: "2024-03-05",
        end: "2024-03-09",
        markers: [{ name: "Break", at: "2024-03-07" }],
      },
    ],
  },
];

export const planMix = [
  { name: "Free", value: 420, color: "cyan" as const },
  { name: "Pro", value: 260, color: "primary" as const },
  { name: "Business", value: 140, color: "indigo" as const },
];

export const channelScores: ChartSeries[] = [
  { name: "Direct", data: [72, 86, 80, 74, 68], color: "primary" },
  { name: "Organic", data: [90, 64, 76, 58, 73], color: "teal" },
  { name: "Social", data: [66, 46, 41, 52, 37], color: "pink" },
];
