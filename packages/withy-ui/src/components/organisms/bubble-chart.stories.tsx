import type { Meta, StoryObj } from "@storybook/react-vite";
import { BubbleChart } from "./bubble-chart";

const series = [
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

const meta = {
  title: "Organisms/BubbleChart",
  component: BubbleChart,
  tags: ["autodocs"],
  args: {
    label: "Account value",
    series,
    xLabel: "Order value",
    yLabel: "Orders",
    sizeLabel: "Revenue",
    className: "max-w-3xl",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A bubble chart is a scatter plot. Horizontal and vertical position compare two values, and the bubble size shows a third.",
      },
    },
  },
} satisfies Meta<typeof BubbleChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Regions: Story = {};
