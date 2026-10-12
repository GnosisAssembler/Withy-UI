import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../atoms/button";
import { Drawer } from "./drawer";

const meta = {
  title: "Organisms/Drawer",
  component: Drawer,
  tags: ["autodocs"],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filters: Story = {
  args: {
    title: "Filters",
    description: "Narrow the invoices on this page.",
    side: "right",
    trigger: <Button color="white">Filter invoices</Button>,
    footer: <Button size="sm">Apply filters</Button>,
    children: "Open invoices from this month.",
  },
};

export const Navigation: Story = {
  args: {
    title: "Navigate",
    side: "left",
    trigger: <Button color="white">Open navigation</Button>,
    children: "Invoices, customers, and reports.",
  },
};
