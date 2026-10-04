export type Swatch = {
  name: string;
  hex: string;
  role: string;
};

export const brandSwatches: Swatch[] = [
  { name: "Primary", hex: "#0168fa", role: "Actions, links, active states" },
  { name: "Brand", hex: "#042893", role: "Deep brand panels" },
  { name: "Secondary", hex: "#5f6d88", role: "Secondary actions" },
  { name: "Success", hex: "#10b759", role: "Positive change and confirmation" },
  { name: "Info", hex: "#00b8d4", role: "Informational highlights" },
  { name: "Warning", hex: "#ffc107", role: "Caution" },
  { name: "Danger", hex: "#dc3545", role: "Errors and destructive actions" },
  { name: "Light", hex: "#e5e9f2", role: "Quiet fills" },
  { name: "Dark", hex: "#3b4863", role: "Strong neutral actions" },
];

export const inkSwatches: Swatch[] = [
  { name: "Text", hex: "#001737", role: "Body and headings" },
  { name: "Text 2", hex: "#1b2e4b", role: "Secondary ink" },
  { name: "Text 3", hex: "#8392a5", role: "Muted labels" },
  { name: "Text 4", hex: "#c0ccda", role: "Input borders" },
  { name: "Whisper", hex: "#f5f6fa", role: "Light skin canvas" },
  { name: "Border", hex: "#485e9029", role: "Hairline borders" },
];

export const graySwatches: Swatch[] = [
  { name: "Gray 50", hex: "#fafbfc", role: "Raised surface" },
  { name: "Gray 100", hex: "#f4f5f8", role: "Hover and muted fill" },
  { name: "Gray 200", hex: "#e3e7ed", role: "Dividers" },
  { name: "Gray 300", hex: "#cdd4e0", role: "Disabled ink" },
  { name: "Gray 400", hex: "#b4bdce", role: "Charts on dark" },
  { name: "Gray 500", hex: "#97a3b9", role: "Supporting text" },
  { name: "Gray 600", hex: "#7987a1", role: "Secondary badges" },
  { name: "Gray 700", hex: "#596882", role: "Dark muted" },
  { name: "Gray 800", hex: "#3b4863", role: "Dark buttons" },
  { name: "Gray 900", hex: "#1c273c", role: "Dark surfaces" },
];

export const accentSwatches: Swatch[] = [
  { name: "Pink", hex: "#f10075", role: "Activity and tags" },
  { name: "Orange", hex: "#fd7e14", role: "Activity and tags" },
  { name: "Indigo", hex: "#5b47fb", role: "Activity and tags" },
  { name: "Teal", hex: "#00cccc", role: "Activity and tags" },
  { name: "Cyan", hex: "#17a2b8", role: "Supporting accent" },
  { name: "Facebook", hex: "#4064ac", role: "Social action" },
  { name: "Twitter", hex: "#00a7e6", role: "Social action" },
];

export const typeScale = [
  {
    name: "Body",
    sample: "Dashboard text",
    className: "text-sm",
    detail: "14px · IBM Plex Sans · 400",
  },
  {
    name: "Heading 6",
    sample: "Section label",
    className: "text-sm font-medium",
    detail: "14px · 500",
  },
  {
    name: "Heading 5",
    sample: "Card title",
    className: "text-[1.09375rem] font-medium",
    detail: "17.5px · 500",
  },
  {
    name: "Heading 4",
    sample: "Welcome to Sprig",
    className: "text-[1.3125rem] font-medium tracking-[-0.5px]",
    detail: "21px · 500",
  },
  {
    name: "Heading 3",
    sample: "0.81%",
    className: "font-rubik text-[1.53125rem] font-normal",
    detail: "24.5px · Rubik · 400",
  },
  {
    name: "Eyebrow",
    sample: "SALES MONITORING",
    className: "font-inter text-[10px] font-semibold uppercase tracking-[0.5px]",
    detail: "10px · Inter · 600",
  },
] as const;
