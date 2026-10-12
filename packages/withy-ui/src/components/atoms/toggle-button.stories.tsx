import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pin, Star } from "lucide-react";
import { ToggleButton } from "./toggle-button";

const meta = {
  title: "Atoms/ToggleButton",
  component: ToggleButton,
  args: { children: "Bold" },
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Quiet: Story = {
  args: { variant: "quiet", children: "Pin" },
};

export const Emphasized: Story = {
  args: { variant: "emphasized", defaultPressed: true, children: "Bold" },
};

export const IconOnly: Story = {
  args: {
    icon: true,
    "aria-label": "Star",
    children: <Star />,
  },
};

export const WithIcon: Story = {
  args: {
    variant: "quiet",
    defaultPressed: true,
    children: (
      <>
        <Pin /> Pin
      </>
    ),
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <ToggleButton size="xs" defaultPressed>
        Extra small
      </ToggleButton>
      <ToggleButton size="sm" defaultPressed>
        Small
      </ToggleButton>
      <ToggleButton size="md" defaultPressed>
        Medium
      </ToggleButton>
      <ToggleButton size="lg" defaultPressed>
        Large
      </ToggleButton>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleButton>Bold</ToggleButton>
      <ToggleButton defaultPressed>Bold</ToggleButton>
      <ToggleButton variant="quiet">Italic</ToggleButton>
      <ToggleButton variant="quiet" defaultPressed>
        Italic
      </ToggleButton>
      <ToggleButton variant="emphasized">Underline</ToggleButton>
      <ToggleButton variant="emphasized" defaultPressed>
        Underline
      </ToggleButton>
      <ToggleButton disabled>Disabled</ToggleButton>
      <ToggleButton disabled defaultPressed>
        Disabled
      </ToggleButton>
    </div>
  ),
};

function StarExample() {
  const [starred, setStarred] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <ToggleButton icon aria-label="Star" pressed={starred} onPressedChange={setStarred}>
        <Star className={starred ? "fill-current" : undefined} />
      </ToggleButton>
      <span className="text-sm text-text-2">{starred ? "Starred" : "Not starred"}</span>
    </div>
  );
}

export const Selection: Story = {
  render: () => <StarExample />,
};
