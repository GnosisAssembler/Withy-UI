import type { Meta, StoryObj } from "@storybook/react-vite";
import { Wraith } from "./wraith";

const meta = {
  title: "Atoms/Wraith",
  component: Wraith,
  tags: ["autodocs"],
} satisfies Meta<typeof Wraith>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      <Wraith size="sm" />
      <Wraith />
      <Wraith size="lg" />
    </div>
  ),
};

export const Labeled: Story = {
  args: {
    label: "Withy UI wraith",
  },
};

export const Corner: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="relative h-screen bg-background">
      <Wraith className="absolute right-2 bottom-2" />
    </div>
  ),
};
