export type Swatch = {
  name: string;
  hex: string;
  role: string;
};

export const brandSwatches: Swatch[] = [
  { name: "Primary", hex: "#0E7484", role: "Flame teal for actions, links, and active states" },
  { name: "Brand", hex: "#301A4B", role: "Deep violet panels" },
  { name: "Secondary", hex: "#E6E0F0", role: "Lilac mist for quiet actions" },
  { name: "Success", hex: "#0E7A58", role: "Jade for positive change and confirmation" },
  { name: "Info", hex: "#3A6A8C", role: "Moonlit steel for informational highlights" },
  { name: "Warning", hex: "#B85E0C", role: "Torch amber for caution" },
  { name: "Danger", hex: "#C41E36", role: "Crimson for errors and destructive actions" },
  { name: "Light", hex: "#E4DEEC", role: "Quiet fills" },
  { name: "Dark", hex: "#352C42", role: "Strong neutral actions" },
];

export const inkSwatches: Swatch[] = [
  { name: "Text", hex: "#1C1428", role: "Body and headings" },
  { name: "Text 2", hex: "#3A3148", role: "Secondary ink" },
  { name: "Text 3", hex: "#6E657C", role: "Muted labels" },
  { name: "Text 4", hex: "#C4BDD0", role: "Input borders" },
  { name: "Whisper", hex: "#F3F0F6", role: "Light skin canvas" },
  { name: "Border", hex: "#3A284829", role: "Hairline borders" },
];

export const graySwatches: Swatch[] = [
  { name: "Gray 50", hex: "#F7F5F9", role: "Raised surface" },
  { name: "Gray 100", hex: "#EBE6F1", role: "Hover and muted fill" },
  { name: "Gray 200", hex: "#DDD6E6", role: "Dividers" },
  { name: "Gray 300", hex: "#C4BDD0", role: "Disabled ink" },
  { name: "Gray 400", hex: "#A398B0", role: "Charts on dark" },
  { name: "Gray 500", hex: "#6E657C", role: "Supporting text" },
  { name: "Gray 600", hex: "#5C5468", role: "Secondary badges" },
  { name: "Gray 700", hex: "#463E52", role: "Dark muted" },
  { name: "Gray 800", hex: "#352C42", role: "Dark buttons" },
  { name: "Gray 900", hex: "#1E1828", role: "Dark surfaces" },
];

export const accentSwatches: Swatch[] = [
  { name: "Blue", hex: "#48ACF0", role: "Charts and tags" },
  { name: "Peach", hex: "#F5D6BA", role: "Soft chart fills and tags" },
  { name: "Purple", hex: "#6B5CA5", role: "Charts and tags" },
  { name: "Mint", hex: "#8AFFC1", role: "Charts and tags" },
  { name: "Pink", hex: "#FE5D9F", role: "Charts and tags" },
];

export type ScaleStep = {
  name: string;
  hex: string;
};

export type ScaleBand = {
  label: string;
  count: number;
  usage: string;
};

export const lightNeutralScale: ScaleStep[] = [
  { name: "Whisper", hex: "#F3F0F6" },
  { name: "Gray 50", hex: "#F7F5F9" },
  { name: "Card", hex: "#FFFFFF" },
  { name: "Gray 100", hex: "#EBE6F1" },
  { name: "Gray 200", hex: "#DDD6E6" },
  { name: "Gray 300", hex: "#C4BDD0" },
  { name: "Gray 400", hex: "#A398B0" },
  { name: "Gray 500", hex: "#6E657C" },
  { name: "Gray 600", hex: "#5C5468" },
  { name: "Gray 700", hex: "#463E52" },
  { name: "Gray 800", hex: "#352C42" },
  { name: "Gray 900", hex: "#1E1828" },
  { name: "Text", hex: "#1C1428" },
];

export const lightNeutralBands: ScaleBand[] = [
  { label: "Background", count: 4, usage: "Page canvas, cards, and muted fills." },
  { label: "Borders", count: 3, usage: "Dividers, input borders, and hairlines." },
  { label: "Text", count: 6, usage: "Muted labels through body and headings." },
];

export const darkNeutralScale: ScaleStep[] = [
  { name: "Night", hex: "#121018" },
  { name: "Card", hex: "#1C1828" },
  { name: "Gray 50", hex: "#262230" },
  { name: "Muted", hex: "#2A2436" },
  { name: "Gray 200", hex: "#3A3348" },
  { name: "Gray 300", hex: "#4E465C" },
  { name: "Gray 400", hex: "#6A6278" },
  { name: "Text 3", hex: "#A79FB4" },
  { name: "Text 2", hex: "#D8D0E2" },
  { name: "Text", hex: "#F4F0F8" },
];

export const darkNeutralBands: ScaleBand[] = [
  { label: "Background", count: 4, usage: "Night canvas, cards, and muted fills." },
  { label: "Borders", count: 3, usage: "Dividers and control edges on dark surfaces." },
  { label: "Text", count: 3, usage: "Muted labels through body and headings." },
];

export type SemanticRole = {
  name: string;
  usage: string;
  light: string;
  dark: string;
};

export const semanticRoles: SemanticRole[] = [
  {
    name: "Primary",
    usage: "Links, selected and active states, and the main action.",
    light: "#0E7484",
    dark: "#5ED4E2",
  },
  {
    name: "Brand",
    usage: "Deep panels and inverse surfaces.",
    light: "#301A4B",
    dark: "#6A3C98",
  },
  {
    name: "Secondary",
    usage: "Quiet actions and soft fills.",
    light: "#E6E0F0",
    dark: "#564C6C",
  },
  {
    name: "Success",
    usage: "Positive change and confirmation.",
    light: "#0E7A58",
    dark: "#3DDBA6",
  },
  {
    name: "Info",
    usage: "Informational highlights that are not the main action.",
    light: "#3A6A8C",
    dark: "#8EBFDC",
  },
  {
    name: "Warning",
    usage: "Caution and states that need attention.",
    light: "#B85E0C",
    dark: "#F0A44A",
  },
  {
    name: "Danger",
    usage: "Errors and destructive actions.",
    light: "#C41E36",
    dark: "#FF6B78",
  },
];

export const typefaces = [
  {
    name: "IBM Plex Sans",
    role: "Body and headings",
    sample: "Dashboard text",
    className: "text-sm",
  },
  {
    name: "Rubik",
    role: "Figures",
    sample: "0.81%",
    className: "font-rubik text-[1.53125rem] leading-none",
  },
  {
    name: "Inter",
    role: "Eyebrows",
    sample: "Sales monitoring",
    className: "font-inter text-[10px] font-semibold tracking-[0.5px] uppercase",
  },
] as const;

export const typeScale = [
  {
    group: "Body",
    name: "Body",
    sample: "Dashboard text",
    className: "text-[0.875rem] leading-[1.5]",
    detail: "14px · IBM Plex Sans · 400 · line-height 1.5",
  },
  {
    group: "Body",
    name: "UI",
    sample: "Email alerts",
    className: "text-[13px]",
    detail: "13px · IBM Plex Sans · 400",
  },
  {
    group: "Body",
    name: "Caption",
    sample: "Updated 2 minutes ago",
    className: "text-[11px] text-text-3",
    detail: "11px · IBM Plex Sans · 400",
  },
  {
    group: "Headings",
    name: "Display",
    sample: "Welcome back",
    className: "text-[2.1875rem] leading-tight font-medium tracking-[-0.5px]",
    detail: "35px · IBM Plex Sans · 500",
  },
  {
    group: "Headings",
    name: "Heading 2",
    sample: "Account settings",
    className: "text-[1.75rem] leading-tight font-medium",
    detail: "28px · IBM Plex Sans · 500",
  },
  {
    group: "Headings",
    name: "Page title",
    sample: "Weekly revenue",
    className: "text-[1.3125rem] leading-tight font-medium tracking-[-0.5px]",
    detail: "21px · IBM Plex Sans · 500",
  },
  {
    group: "Headings",
    name: "Card title",
    sample: "Conversion rate",
    className: "text-[1.09375rem] leading-tight font-medium",
    detail: "17.5px · IBM Plex Sans · 500",
  },
  {
    group: "Headings",
    name: "Heading 6",
    sample: "Section label",
    className: "text-sm leading-tight font-medium",
    detail: "14px · IBM Plex Sans · 500",
  },
  {
    group: "Figures",
    name: "Metric",
    sample: "0.81%",
    className: "font-rubik text-[1.53125rem] leading-none font-normal",
    detail: "24.5px · Rubik · 400",
  },
  {
    group: "Labels",
    name: "Eyebrow",
    sample: "Sales monitoring",
    className: "font-inter text-[10px] font-semibold tracking-[0.5px] uppercase",
    detail: "10px · Inter · 600",
  },
  {
    group: "Labels",
    name: "Code",
    sample: "gap-2.5",
    className: "font-mono text-[12px]",
    detail: "12px · monospace · 400",
  },
] as const;
