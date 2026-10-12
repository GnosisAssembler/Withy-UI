import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarPageTemplate } from "./calendar-page";

const meta = {
  title: "Templates/Calendar",
  component: CalendarPageTemplate,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CalendarPageTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
