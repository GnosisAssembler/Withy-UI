import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartsGalleryTemplate } from "./charts-gallery";

const meta = {
  title: "Templates/Charts",
  component: ChartsGalleryTemplate,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Analytics gallery. Composes DashboardShell, PageHeader, Card, Tabs, and area, line, bar, bubble, timeline, treemap, donut, bar list, category bar, heatmap, combo, and radar charts.",
      },
    },
  },
} satisfies Meta<typeof ChartsGalleryTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
