import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Mail } from "lucide-react";
import { Button, type ButtonTone } from "./button";

const tones: ButtonTone[] = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
  "white",
  "brand",
  "facebook",
  "twitter",
];

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: { children: "Generate report" },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const White: Story = {
  args: { color: "white", children: "Print" },
};

export const Outlined: Story = {
  args: { variant: "outlined" },
};

export const Text: Story = {
  args: { variant: "text", children: "Forgot password" },
};

export const WithIcon: Story = {
  args: {
    color: "white",
    size: "sm",
    children: (
      <>
        <Mail /> Email
      </>
    ),
  },
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {tones.map((color) => (
        <Button key={color} color={color} size="sm">
          {color}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
