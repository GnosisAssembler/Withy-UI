import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardBody, CardTitle } from "../organisms/card";
import { HoverGallery } from "./hover-gallery";
import { hoverGalleryImages } from "./hover-gallery.images";

const meta = {
  title: "Molecules/Hover gallery",
  component: HoverGallery,
  tags: ["autodocs"],
  args: {
    images: hoverGalleryImages,
    className: "max-w-60",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A hover gallery shows the first image by default. Move the pointer horizontally to reveal the others, up to ten images.",
      },
    },
  },
} satisfies Meta<typeof HoverGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InACard: Story = {
  render: (args) => (
    <Card className="max-w-60 overflow-hidden">
      <HoverGallery {...args} className="rounded-none" />
      <CardBody>
        <CardTitle className="flex items-baseline justify-between gap-3">
          Color study
          <span className="font-normal text-text-2">$25</span>
        </CardTitle>
        <p className="mt-1 text-[13px] text-text-2">Four generated compositions.</p>
      </CardBody>
    </Card>
  ),
};
