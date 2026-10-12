import type { Meta, StoryObj } from "@storybook/react-vite";
import { Splitter, SplitterPanel, SplitterResizeTrigger } from "./splitter";

const pane = "flex items-center justify-center text-[13px] text-heading";

const meta = {
  title: "Layout/Splitter",
  component: Splitter,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A splitter lets people resize panels by dragging the handle between them. Arrow keys move the focused handle.",
      },
    },
  },
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    panels: [{ id: "invoices" }, { id: "details" }],
    defaultSize: [60, 40],
    className: "h-64 rounded-sm border border-border",
    children: (
      <>
        <SplitterPanel id="invoices" className={`${pane} bg-muted`}>
          Invoices
        </SplitterPanel>
        <SplitterResizeTrigger id="invoices:details" />
        <SplitterPanel id="details" className={pane}>
          Details
        </SplitterPanel>
      </>
    ),
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    panels: [{ id: "summary" }, { id: "activity" }],
    defaultSize: [45, 55],
    className: "h-64 rounded-sm border border-border",
    children: (
      <>
        <SplitterPanel id="summary" className={`${pane} bg-muted`}>
          Summary
        </SplitterPanel>
        <SplitterResizeTrigger id="summary:activity" />
        <SplitterPanel id="activity" className={pane}>
          Activity
        </SplitterPanel>
      </>
    ),
  },
};

export const ThreePanels: Story = {
  args: {
    panels: [{ id: "nav", minSize: 15, maxSize: 30 }, { id: "invoices" }, { id: "details" }],
    defaultSize: [20, 50, 30],
    className: "h-64 rounded-sm border border-border",
    children: (
      <>
        <SplitterPanel id="nav" className={`${pane} bg-muted`}>
          Nav
        </SplitterPanel>
        <SplitterResizeTrigger id="nav:invoices" />
        <SplitterPanel id="invoices" className={pane}>
          Invoices
        </SplitterPanel>
        <SplitterResizeTrigger id="invoices:details" />
        <SplitterPanel id="details" className={`${pane} bg-muted`}>
          Details
        </SplitterPanel>
      </>
    ),
  },
};

export const Collapsible: Story = {
  args: {
    panels: [
      { id: "invoices", collapsible: true, collapsedSize: 0, minSize: 20 },
      { id: "details", minSize: 30 },
    ],
    defaultSize: [40, 60],
    className: "h-64 rounded-sm border border-border",
    children: (
      <>
        <SplitterPanel id="invoices" className={`${pane} bg-muted`}>
          Invoices
        </SplitterPanel>
        <SplitterResizeTrigger id="invoices:details" />
        <SplitterPanel id="details" className={pane}>
          Details
        </SplitterPanel>
      </>
    ),
  },
};
