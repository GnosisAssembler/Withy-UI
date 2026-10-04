export type Instrument = "Stock" | "ETF" | "Bond";

export type HoldingTone =
  "primary" | "success" | "danger" | "warning" | "info" | "indigo" | "pink" | "orange";

export type Holding = {
  id: string;
  symbol: string;
  name: string;
  mark: string;
  tone: HoldingTone;
  timeline: number[];
  instrument: Instrument;
  pnl: number;
  ratio: number;
  change: number;
  total: number;
};

function bars(seed: number): number[] {
  return Array.from({ length: 22 }, (_, index) => {
    const wave = Math.abs(Math.sin(index * 0.55 + seed) * 7 + Math.cos(index * 0.31 + seed) * 3);
    return Math.round((wave + 0.6) * 10) / 10;
  });
}

export const holdings: Holding[] = [
  {
    id: "dal",
    symbol: "DAL",
    name: "Delta Air Lines",
    mark: "D",
    tone: "danger",
    timeline: bars(1.1),
    instrument: "Stock",
    pnl: 46.79,
    ratio: 68.5,
    change: 1871.54,
    total: 2739.97,
  },
  {
    id: "bp",
    symbol: "BP",
    name: "BP plc",
    mark: "B",
    tone: "success",
    timeline: bars(2.4),
    instrument: "Stock",
    pnl: 1.41,
    ratio: 4.11,
    change: 429.32,
    total: 1252.62,
  },
  {
    id: "ma",
    symbol: "MA",
    name: "Mastercard",
    mark: "M",
    tone: "orange",
    timeline: bars(0.6),
    instrument: "Stock",
    pnl: 0.79,
    ratio: 1.37,
    change: 1276.68,
    total: 477.95,
  },
  {
    id: "vgt",
    symbol: "VGT",
    name: "Vanguard Information Tech",
    mark: "V",
    tone: "danger",
    timeline: bars(3.2),
    instrument: "ETF",
    pnl: 0.24,
    ratio: 3.01,
    change: 90.63,
    total: 1113.6,
  },
  {
    id: "pbr",
    symbol: "PBR",
    name: "Petrobras",
    mark: "P",
    tone: "info",
    timeline: bars(4.1),
    instrument: "Stock",
    pnl: -194.42,
    ratio: 257.41,
    change: -1944.19,
    total: 2574.13,
  },
  {
    id: "tlt",
    symbol: "TLT",
    name: "20+ Year Treasury Bond",
    mark: "T",
    tone: "warning",
    timeline: bars(1.8),
    instrument: "Bond",
    pnl: -3.53,
    ratio: 18.91,
    change: -353.49,
    total: 1890.67,
  },
  {
    id: "lqd",
    symbol: "LQD",
    name: "Investment Grade Corporate",
    mark: "L",
    tone: "success",
    timeline: bars(2.9),
    instrument: "Bond",
    pnl: 11.89,
    ratio: 67.53,
    change: 1248.44,
    total: 7091.04,
  },
  {
    id: "jnj",
    symbol: "JNJ",
    name: "Johnson & Johnson",
    mark: "J",
    tone: "pink",
    timeline: bars(5.2),
    instrument: "Stock",
    pnl: 5.14,
    ratio: 11.96,
    change: 822.36,
    total: 1913.64,
  },
  {
    id: "aapl",
    symbol: "AAPL",
    name: "Apple",
    mark: "A",
    tone: "indigo",
    timeline: bars(0.2),
    instrument: "Stock",
    pnl: 12.4,
    ratio: 22.18,
    change: 640.2,
    total: 3188.5,
  },
  {
    id: "voo",
    symbol: "VOO",
    name: "Vanguard S&P 500",
    mark: "V",
    tone: "primary",
    timeline: bars(3.7),
    instrument: "ETF",
    pnl: -8.16,
    ratio: 14.02,
    change: -210.44,
    total: 4022.18,
  },
  {
    id: "msft",
    symbol: "MSFT",
    name: "Microsoft",
    mark: "M",
    tone: "info",
    timeline: bars(1.4),
    instrument: "Stock",
    pnl: 21.07,
    ratio: 33.4,
    change: 980.11,
    total: 5410.26,
  },
  {
    id: "hyg",
    symbol: "HYG",
    name: "High Yield Corporate",
    mark: "H",
    tone: "orange",
    timeline: bars(4.6),
    instrument: "Bond",
    pnl: -1.92,
    ratio: 6.44,
    change: -88.3,
    total: 966.72,
  },
];
