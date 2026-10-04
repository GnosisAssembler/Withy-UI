import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sparkline } from "@/components/atoms/sparkline";
import { Card, CardBody } from "@/components/organisms/card";
import { Stat } from "./stat";

const meta = {
  title: "Molecules/Stat",
  component: Stat,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Place Stat and Sparkline inside a Card to rebuild a sales metric.",
      },
    },
  },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Conversion: Story = {
  args: {
    title: "Conversion Rate",
    value: "0.81%",
    change: { value: "1.2%", direction: "up", hint: "than last week" },
  },
};

export const InsideCard: Story = {
  args: Conversion.args,
  render: (args) => (
    <div className="max-w-xs">
      <Card>
        <CardBody>
          <Stat {...args} />
          <Sparkline
            className="-mx-2 mt-3"
            data={[8, 12, 10, 14, 13, 18, 16, 21, 19, 24]}
            label="Conversion trend"
          />
        </CardBody>
      </Card>
    </div>
  ),
};
