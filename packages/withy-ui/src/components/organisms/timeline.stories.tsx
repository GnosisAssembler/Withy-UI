import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./timeline";

const items = [
  {
    id: "created",
    time: "Mar 2 · 9:10",
    title: "Account created",
    description: "Ivy Calder joined the workspace.",
    tone: "primary" as const,
  },
  {
    id: "invoice",
    time: "Mar 4 · 14:22",
    title: "Invoice sent",
    description: "Invoice #1048 emailed to billing.",
    tone: "info" as const,
  },
  {
    id: "paid",
    time: "Mar 6 · 11:05",
    title: "Payment received",
    description: "The order was marked paid.",
    tone: "success" as const,
  },
];

const meta = {
  title: "Organisms/Timeline",
  component: Timeline,
  args: { items },
  tags: ["autodocs"],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
