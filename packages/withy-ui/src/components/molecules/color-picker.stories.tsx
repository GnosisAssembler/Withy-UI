import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorPicker } from "./color-picker";

const meta = {
  title: "Molecules/Color picker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A color picker chooses one color. The value is a CSS color, such as #0e7484, rgb(), or hsl(). Clear removes it.",
      },
    },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Selected: Story = {
  args: { defaultValue: "#0E7484" },
};

export const CustomPresets: Story = {
  args: {
    defaultValue: "#1C1428",
    presets: [
      { label: "Ink", value: "#1C1428" },
      { label: "Mist", value: "#E6E0F0" },
      { label: "Teal", value: "#0E7484" },
    ],
  },
};

export const Disabled: Story = {
  args: { defaultValue: "#0E7484", disabled: true },
};
