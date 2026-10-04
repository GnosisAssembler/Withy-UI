import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WidgetsBoardTemplate } from "./widgets-board";

const meta = {
  title: "Templates/Widgets",
  component: WidgetsBoardTemplate,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WidgetsBoardTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
