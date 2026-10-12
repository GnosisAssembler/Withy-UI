import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "../molecules/form-field";
import { ColorSlider } from "./color-slider";

const meta = {
  title: "Atoms/Color slider",
  component: ColorSlider,
  tags: ["autodocs"],
  args: {
    defaultValue: "#0e7484",
    channel: "hue",
    "aria-label": "Brand color",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A color slider sets one channel of a color. Hue draws a rainbow. Saturation, lightness, and alpha use the rest of the current color.",
      },
    },
  },
} satisfies Meta<typeof ColorSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hue: Story = {};

export const Channels: Story = {
  render: function ChannelsStory() {
    const [color, setColor] = React.useState("#0e7484");
    return (
      <div className="flex max-w-sm flex-col gap-4">
        <FormField label="Hue" hint={color}>
          <ColorSlider channel="hue" value={color} onValueChange={setColor} />
        </FormField>
        <FormField label="Saturation">
          <ColorSlider channel="saturation" value={color} onValueChange={setColor} />
        </FormField>
        <FormField label="Lightness">
          <ColorSlider channel="lightness" value={color} onValueChange={setColor} />
        </FormField>
        <FormField label="Alpha">
          <ColorSlider channel="alpha" value={color} onValueChange={setColor} />
        </FormField>
      </div>
    );
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
