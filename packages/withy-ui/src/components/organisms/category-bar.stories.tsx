import type { Meta, StoryObj } from "@storybook/react-vite";
import { CategoryBar } from "./category-bar";

const plans = [
  { name: "Free", value: 420, color: "cyan" as const },
  { name: "Pro", value: 260, color: "primary" as const },
  { name: "Business", value: 140, color: "indigo" as const },
];

const meta = {
  title: "Organisms/CategoryBar",
  component: CategoryBar,
  tags: ["autodocs"],
  args: {
    label: "Accounts by plan",
    segments: plans,
    className: "max-w-md",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A category bar splits one total into named shares. A marker shows a value along that total.",
      },
    },
  },
} satisfies Meta<typeof CategoryBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMarker: Story = {
  args: {
    marker: { value: 700, label: "Paid goal" },
  },
};

export const SharesOnly: Story = {};
