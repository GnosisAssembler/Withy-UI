import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardBody } from "../organisms/card";
import { Stat } from "./stat";
import { Tracker } from "./tracker";
import { uptimeTrackerSample } from "./tracker.sample";

const meta = {
  title: "Molecules/Tracker",
  component: Tracker,
  tags: ["autodocs"],
  args: {
    label: "API uptime",
    data: uptimeTrackerSample(),
    hoverEffect: false,
    defaultColor: "neutral",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A tracker shows one block per moment, such as each day of uptime. Hover or focus a block to read its status.",
      },
    },
  },
} satisfies Meta<typeof Tracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HoverEffect: Story = {
  args: {
    hoverEffect: true,
  },
};

export const Uptime: Story = {
  args: {
    label: "API uptime, last 48 days",
    hoverEffect: true,
  },
  render: (args) => (
    <Card className="max-w-lg">
      <CardBody>
        <Stat
          title="API uptime"
          value="99.9%"
          change={{ value: "0.1%", direction: "up", hint: "than last month" }}
        />
        <Tracker {...args} className="mt-4" />
      </CardBody>
    </Card>
  ),
};
