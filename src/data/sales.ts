export const salesStats = [
  {
    title: "Conversion Rate",
    value: "0.81%",
    change: { value: "1.2%", direction: "up" as const, hint: "than last week" },
    data: [8, 12, 10, 14, 13, 18, 16, 21, 19, 24],
    color: "var(--primary)",
  },
  {
    title: "Unique Purchases",
    value: "3,137",
    change: { value: "0.7%", direction: "down" as const, hint: "than last week" },
    data: [30, 28, 32, 26, 24, 27, 22, 25, 21, 23],
    color: "var(--teal)",
  },
  {
    title: "Avg. Order Value",
    value: "$306.20",
    change: { value: "0.3%", direction: "up" as const, hint: "than last week" },
    data: [12, 14, 13, 16, 18, 17, 20, 19, 22, 24],
    color: "var(--indigo)",
  },
  {
    title: "Order Quantity",
    value: "1,650",
    change: { value: "2.1%", direction: "up" as const, hint: "than last week" },
    data: [6, 9, 8, 11, 10, 14, 13, 16, 18, 20],
    color: "var(--pink)",
  },
];

export const salesChannels = {
  today: [
    { label: "Direct", value: "$1,240", percent: 62 },
    { label: "Organic", value: "$860", percent: 43 },
    { label: "Referral", value: "$420", percent: 21 },
    { label: "Social", value: "$180", percent: 9 },
  ],
  week: [
    { label: "Direct", value: "$8,420", percent: 70 },
    { label: "Organic", value: "$5,110", percent: 48 },
    { label: "Referral", value: "$2,040", percent: 26 },
    { label: "Social", value: "$980", percent: 14 },
  ],
};

export const orderStatusTone = {
  Paid: "success",
  Refund: "warning",
  Delivery: "info",
  Failed: "danger",
} as const;

export type OrderStatus = keyof typeof orderStatusTone;

export type Order = {
  id: string;
  customer: string;
  status: OrderStatus;
  amount: string;
  date: string;
};

export const orders: Order[] = [
  { id: "10322", customer: "Mara Ellison", status: "Paid", amount: "$540.00", date: "04 Oct 2026" },
  { id: "00910", customer: "Jonah Peck", status: "Refund", amount: "$120.00", date: "04 Oct 2026" },
  {
    id: "44333",
    customer: "Leah Ortiz",
    status: "Delivery",
    amount: "$86.40",
    date: "03 Oct 2026",
  },
  {
    id: "087651",
    customer: "Chris Adel",
    status: "Failed",
    amount: "$240.00",
    date: "03 Oct 2026",
  },
  { id: "22018", customer: "Noor Hale", status: "Paid", amount: "$1,024.00", date: "02 Oct 2026" },
];
