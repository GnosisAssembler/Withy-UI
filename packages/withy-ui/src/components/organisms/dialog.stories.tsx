import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../atoms/button";
import { Dialog } from "./dialog";

const meta = {
  title: "Organisms/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Decision: Story = {
  args: {
    tone: "danger",
    title: "Delete invoice #1048?",
    confirmLabel: "Delete invoice",
    children: "The invoice and its payments are removed. This cannot be undone.",
    trigger: <Button color="danger">Delete invoice</Button>,
  },
};

export const Share: Story = {
  args: {
    title: "Share this report",
    description: "People with the link can view it.",
    trigger: <Button color="white">Share report</Button>,
    footer: <Button size="sm">Copy link</Button>,
    children: "Send a read-only link to the current dashboard.",
  },
};
