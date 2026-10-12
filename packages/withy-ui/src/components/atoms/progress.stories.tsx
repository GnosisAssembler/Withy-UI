import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./progress";

const meta = {
  title: "Atoms/Progress",
  component: Progress,
  args: {
    value: 62,
    "aria-label": "Exporting report",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fill: Story = {};

export const Stripes: Story = {
  args: { animation: "stripes", "aria-label": "Uploading files" },
};

export const Shimmer: Story = {
  args: { value: 40, animation: "shimmer", color: "info", "aria-label": "Syncing contacts" },
};

export const Indeterminate: Story = {
  args: { value: null, animation: "indeterminate", "aria-label": "Preparing export" },
};

export const Complete: Story = {
  args: { value: 100, color: "success", "aria-label": "Import complete" },
};

export const Animations: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Progress value={62} aria-label="Exporting report" />
      <Progress value={62} animation="stripes" aria-label="Uploading files" />
      <Progress value={40} animation="shimmer" color="info" aria-label="Syncing contacts" />
      <Progress animation="indeterminate" aria-label="Preparing export" />
      <Progress value={100} color="success" aria-label="Import complete" />
    </div>
  ),
};
