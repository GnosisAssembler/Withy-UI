import type { Meta, StoryObj } from "@storybook/react-vite";
import { stateSales } from "../../data/widgets";
import { RevenueMap } from "./revenue-map";

const meta = {
  title: "Widgets/RevenueMap",
  component: RevenueMap,
  tags: ["autodocs"],
  args: {
    rows: stateSales,
    title: "Sales revenue",
    label: "United States sales map",
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A revenue map shows sales by United States state and lists the five states with the highest earnings. Point at a state, or focus the map and use the arrow keys, to read its earnings.",
      },
    },
  },
} satisfies Meta<typeof RevenueMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    rows: [],
  },
};
