import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../atoms/button";
import { Overlay } from "./overlay";

const meta = {
  title: "Organisms/Overlay",
  component: Overlay,
  tags: ["autodocs"],
} satisfies Meta<typeof Overlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Preview: Story = {
  args: {
    label: "Invoice preview",
    trigger: <Button color="white">Preview invoice</Button>,
    children: (
      <div className="w-80 rounded-sm border border-border bg-card px-5 py-4 text-sm text-text-2 shadow-lg">
        Invoice #1048 for Northwind, due at the end of the month.
      </div>
    ),
  },
};
