export type StateSale = {
  id: string;
  orders: number;
  earnings: number;
};

export const stateSales: StateSale[] = [
  { id: "CA", orders: 12201, earnings: 150200.8 },
  { id: "TX", orders: 11950, earnings: 138910.2 },
  { id: "WY", orders: 11198, earnings: 132050 },
  { id: "FL", orders: 12201, earnings: 150200.8 },
  { id: "NY", orders: 8560, earnings: 117087.5 },
  { id: "WA", orders: 6420, earnings: 84210 },
  { id: "IL", orders: 7104, earnings: 90110.4 },
  { id: "CO", orders: 4988, earnings: 67340 },
  { id: "GA", orders: 5330, earnings: 70120.5 },
  { id: "MA", orders: 4210, earnings: 58990 },
];

export const satisfactionSegments = [
  { label: "Excellent", value: 3007, color: "primary" as const },
  { label: "Very Good", value: 1674, color: "success" as const },
  { label: "Good", value: 125, color: "warning" as const },
  { label: "Fair", value: 98, color: "pink" as const },
  { label: "Poor", value: 512, color: "info" as const },
  { label: "Very Poor", value: 81, color: "indigo" as const },
];

const wave = (length: number, seed: number, base: number, swing: number) =>
  Array.from({ length }, (_, index) =>
    Math.round(base + Math.sin(index / 2.2 + seed) * swing + ((index * 17 + seed) % 9) - 4),
  );

export const acquisitionCategories = Array.from({ length: 36 }, (_, index) => String(index + 1));

export const acquisitionSeries = [
  { name: "Visits", data: wave(36, 0.4, 46, 18) },
  { name: "Engaged", data: wave(36, 1.7, 28, 14) },
];

export const complaintCategories = [
  "50",
  "55",
  "60",
  "65",
  "70",
  "75",
  "80",
  "85",
  "90",
  "95",
  "100",
];

export const complaintSeries = [
  {
    name: "Complaints",
    data: [18, 22, 16, 24, 21, 36, 28, 42, 33, 39, 44],
    color: "primary" as const,
  },
];

export const ticketDates = [
  "11 Feb",
  "13 Feb",
  "15 Feb",
  "17 Feb",
  "19 Feb",
  "21 Feb",
  "23 Feb",
  "25 Feb",
  "27 Feb",
  "01 Mar",
  "03 Mar",
  "05 Mar",
  "07 Mar",
  "09 Mar",
  "11 Mar",
  "13 Mar",
];

export const ticketBars = [
  {
    name: "New tickets",
    data: [22, 28, 18, 24, 36, 30, 26, 22, 24, 34, 38, 20, 18, 22, 40, 28],
    color: "primary" as const,
  },
  {
    name: "Solved tickets",
    data: [16, 26, 20, 18, 30, 24, 32, 24, 20, 28, 26, 18, 26, 16, 32, 26],
    color: "info" as const,
  },
];

export const ticketLine = {
  name: "Open tickets",
  data: [24, 22, 26, 20, 22, 18, 22, 28, 22, 24, 28, 22, 26, 20, 22, 28],
  color: "indigo" as const,
};

export const ticketTotals = [
  {
    label: "New tickets",
    value: "156",
    change: "1.2% than yesterday",
    direction: "up" as const,
    color: "var(--primary)",
  },
  {
    label: "Solved tickets",
    value: "86",
    change: "0.6% than yesterday",
    direction: "down" as const,
    color: "var(--info)",
  },
  {
    label: "Unresolved tickets",
    value: "27",
    change: "0.3% than yesterday",
    direction: "up" as const,
    color: "var(--danger)",
  },
  {
    label: "Open tickets",
    value: "45",
    change: "0.3% than yesterday",
    direction: "up" as const,
    color: "var(--indigo)",
  },
  {
    label: "Unassigned",
    value: "30",
    change: "0.3% than yesterday",
    direction: "up" as const,
    color: "var(--success)",
  },
];
