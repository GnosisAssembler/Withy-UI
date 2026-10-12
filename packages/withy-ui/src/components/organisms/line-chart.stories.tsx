import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "./line-chart";

const series = [
  {
    name: "Paid",
    data: [120, 128, 135, 142, 148, 160, 171, 180, 194, 210, 228, 246],
    color: "primary" as const,
  },
  {
    name: "Free",
    data: [340, 352, 361, 370, 368, 390, 404, 418, 430, 448, 470, 492],
    color: "cyan" as const,
  },
];

const categories = [
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

const meta = {
  title: "Organisms/LineChart",
  component: LineChart,
  tags: ["autodocs"],
  args: {
    label: "Active accounts",
    categories,
    series,
    className: "max-w-3xl",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A line chart compares named series over categories. Points mark each value, and the lines stay unfilled.",
      },
    },
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Smooth: Story = {};

export const Straight: Story = {
  args: {
    smooth: false,
    showPoints: false,
  },
};
