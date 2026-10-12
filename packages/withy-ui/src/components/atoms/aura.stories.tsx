import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Aura, type AuraColor } from "./aura";
import { Text } from "./text";
import { Card, CardBody } from "../organisms/card";

const colors: AuraColor[] = ["primary", "brand", "pink", "orange", "indigo", "teal", "cyan"];

const meta = {
  title: "Atoms/Aura",
  component: Aura,
  args: {
    children: "Highlighted",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Aura>;

export default meta;
type Story = StoryObj<typeof meta>;

function Plan({ title }: { title: string }) {
  return (
    <Card className="w-64">
      <CardBody>
        <Text>{title}</Text>
      </CardBody>
    </Card>
  );
}

export const Default: Story = {
  args: {
    children: <Plan title="This plan includes priority support." />,
  },
};

export const Styles: Story = {
  render: () => (
    <div className="flex max-w-5xl flex-wrap items-start gap-4">
      <Aura>
        <Plan title="This plan includes priority support." />
      </Aura>
      <Aura variant="dual" color="cyan">
        <Plan title="Two lights circle this plan." />
      </Aura>
      <Aura variant="rainbow">
        <Plan title="Most teams choose this plan." />
      </Aura>
      <Aura variant="holo">
        <Plan title="A slow holographic light." />
      </Aura>
      <Aura variant="gold">
        <Plan title="Billed once a year." />
      </Aura>
      <Aura variant="silver">
        <Plan title="A silver light around this plan." />
      </Aura>
      <Aura variant="glow" color="pink">
        <Plan title="This is the current plan." />
      </Aura>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Aura size="xs" radius="full">
        <Button shape="pill" color="white">
          Extra small
        </Button>
      </Aura>
      <Aura size="sm" radius="full">
        <Button shape="pill" color="white">
          Small
        </Button>
      </Aura>
      <Aura radius="full">
        <Button shape="pill" color="white">
          Medium
        </Button>
      </Aura>
      <Aura size="lg" radius="full">
        <Button shape="pill" color="white">
          Large
        </Button>
      </Aura>
      <Aura size="xl" radius="full">
        <Button shape="pill" color="white">
          Extra large
        </Button>
      </Aura>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {colors.map((color) => (
        <Aura key={color} color={color} radius="full">
          <Button shape="pill" color="white">
            {color}
          </Button>
        </Aura>
      ))}
    </div>
  ),
};

export const Duration: Story = {
  args: {
    variant: "rainbow",
    duration: 2000,
    children: <Plan title="This light completes a turn in 2 seconds." />,
  },
};
