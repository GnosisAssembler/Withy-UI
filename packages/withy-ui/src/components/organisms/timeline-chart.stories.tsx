import type { Meta, StoryObj } from "@storybook/react-vite";
import { sprintSchedule, sprintTasks } from "../../data/charts";
import { TimelineChart } from "./timeline-chart";

const meta = {
  title: "Organisms/TimelineChart",
  component: TimelineChart,
  tags: ["autodocs"],
  args: {
    label: "Sprint schedule",
    categories: sprintTasks,
    series: sprintSchedule,
    className: "h-[450px] max-w-4xl",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A timeline chart draws each task as a horizontal bar from its start to its end. Each series keeps its own lane, and a marker can mark a moment on a bar.",
      },
    },
  },
} satisfies Meta<typeof TimelineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sprint: Story = {};
