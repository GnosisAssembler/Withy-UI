import type { Meta, StoryObj } from "@storybook/react-vite";
import { SettingsPageTemplate } from "./settings-page";

const meta = {
  title: "Templates/Settings",
  component: SettingsPageTemplate,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SettingsPageTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
