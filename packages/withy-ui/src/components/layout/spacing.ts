export const gaps = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-4",
  xl: "gap-8",
} as const;

export type Gap = keyof typeof gaps;

export const padding = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
} as const;

export type Padding = keyof typeof padding;

export const spaceScale = [
  {
    token: "1",
    px: 4,
    bar: "w-1",
    range: "Small",
    use: "An icon beside a label, or a tight control.",
  },
  { token: "2", px: 8, bar: "w-2", range: "Small", use: "A button group, or a compact row." },
  {
    token: "2.5",
    px: 10,
    bar: "w-2.5",
    range: "Medium",
    use: "The gap between cards. This is the page rhythm.",
  },
  { token: "3", px: 12, bar: "w-3", range: "Medium", use: "Related items, and compact padding." },
  { token: "4", px: 16, bar: "w-4", range: "Medium", use: "Padding inside a card." },
  { token: "5", px: 20, bar: "w-5", range: "Medium", use: "Padding around the page." },
  {
    token: "6",
    px: 24,
    bar: "w-6",
    range: "Medium",
    use: "A block and the actions that follow it.",
  },
  { token: "8", px: 32, bar: "w-8", range: "Large", use: "The space between sections." },
] as const;

export const spaceRanges = [
  {
    name: "Small",
    text: "4px and 8px. Use these inside compact pieces: an icon and its label, a badge, a table cell, or a button group.",
  },
  {
    name: "Medium",
    text: "10px to 24px. Use these for cards, fields, and page padding. 10px is the gap between cards.",
  },
  {
    name: "Large",
    text: "32px. Use this between sections, so a new subject has room.",
  },
] as const;
