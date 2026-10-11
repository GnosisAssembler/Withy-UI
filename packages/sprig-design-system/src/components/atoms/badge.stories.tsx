import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  args: { children: "Paid" },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = { args: { color: "success" } };

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge color="success">Paid</Badge>
      <Badge color="warning">Refund</Badge>
      <Badge color="info">Delivery</Badge>
      <Badge color="danger">Failed</Badge>
      <Badge color="secondary">Offline</Badge>
      <Badge>New</Badge>
    </div>
  ),
};
