import { Copy, Printer, Save } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SpeedDial } from "./speed-dial";

const actions = [
  { label: "Copy", icon: Copy },
  { label: "Save", icon: Save },
  { label: "Print", icon: Printer },
];

function Demo() {
  return (
    <div className="relative h-80 rounded-sm border border-border bg-muted">
      <SpeedDial
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        label="Create"
        actions={actions}
      />
    </div>
  );
}

const meta = {
  title: "Molecules/Speed dial",
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Up: Story = {};
