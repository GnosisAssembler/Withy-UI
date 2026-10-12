import type { Meta, StoryObj } from "@storybook/react-vite";
import { deviceTreemap } from "../../data/charts";
import { TreemapChart } from "./treemap-chart";

const meta = {
  title: "Organisms/TreemapChart",
  component: TreemapChart,
  tags: ["autodocs"],
  args: {
    label: "Devices by category",
    series: deviceTreemap,
    valueLabel: "Units",
    className: "h-[360px] max-w-4xl",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A treemap splits a total into groups. Tile area shows the value, and color shows which series the tile belongs to.",
      },
    },
  },
} satisfies Meta<typeof TreemapChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Devices: Story = {};
