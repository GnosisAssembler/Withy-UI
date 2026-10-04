import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Dialog, DialogBody, DialogContent, DialogFooter } from "./dialog";

const meta = {
  title: "Organisms/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function ReportStory() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Generate report</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          title="Generate report"
          description="Export conversion, orders, and channel mix."
        >
          <DialogBody>
            The report includes the four stat cards, channel mix, and the recent orders table.
          </DialogBody>
          <DialogFooter>
            <Button color="white" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const Report: Story = {
  render: () => <ReportStory />,
};
