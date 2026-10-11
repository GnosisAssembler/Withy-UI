import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentsLibraryTemplate } from "./components-library";

const meta = {
  title: "Templates/Components",
  component: ComponentsLibraryTemplate,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ComponentsLibraryTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
