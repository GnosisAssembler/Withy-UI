import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileText } from "lucide-react";
import { Icon } from "../atoms/icon";
import { BarList } from "./bar-list";

const pages = [
  { name: "/pricing", value: 2480, href: "/pricing", icon: <Icon icon={FileText} /> },
  { name: "/docs/charts", value: 1860, href: "/docs/charts" },
  { name: "/customers", value: 1420, href: "/customers" },
  { name: "/changelog", value: 980, href: "/changelog" },
  { name: "/sign-in", value: 640, href: "/sign-in" },
];

const meta = {
  title: "Organisms/BarList",
  component: BarList,
  tags: ["autodocs"],
  args: {
    label: "Top pages",
    data: pages,
    className: "max-w-md",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A bar list ranks named values. The longest bar is the largest value. A row can link to the thing it names.",
      },
    },
  },
} satisfies Meta<typeof BarList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ranked: Story = {};

export const GivenOrder: Story = {
  args: {
    sortOrder: "none",
    color: "indigo",
  },
};
