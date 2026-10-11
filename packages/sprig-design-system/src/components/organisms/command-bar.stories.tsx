import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, Settings } from "lucide-react";
import { CommandBar, type CommandItem } from "./command-bar";

const items: CommandItem[] = [
  { id: "foundations", label: "Foundations", group: "Pages", href: "/" },
  {
    id: "calendar",
    label: "Calendar",
    group: "Pages",
    href: "/examples/calendar",
    icon: <Calendar />,
  },
  {
    id: "settings",
    label: "Settings",
    group: "Pages",
    href: "/examples/settings",
    icon: <Settings />,
  },
  { id: "dark", label: "Use dark theme", group: "Theme", keywords: "skin night" },
];

function Demo() {
  const [open, setOpen] = React.useState(true);
  return <CommandBar open={open} onOpenChange={setOpen} items={items} />;
}

const meta = {
  title: "Organisms/Command bar",
  component: Demo,
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
