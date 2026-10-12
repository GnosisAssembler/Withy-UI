import type { Meta, StoryObj } from "@storybook/react-vite";
import { DonutChart } from "./donut-chart";

const data = [
  { name: "Direct", value: 486, color: "primary" as const },
  { name: "Organic", value: 312, color: "teal" as const },
  { name: "Referral", value: 148, color: "indigo" as const },
  { name: "Social", value: 96, color: "pink" as const },
];

const meta = {
  title: "Organisms/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
  args: {
    label: "Revenue share",
    data,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A donut chart shows how a total splits across named categories. Use a pie when the center does not need a total.",
      },
    },
  },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Donut: Story = {
  args: {
    className: "max-w-lg",
  },
};

export const Pie: Story = {
  args: {
    variant: "pie",
    className: "max-w-lg",
  },
};
