import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper, type StepperStep } from "./stepper";

const steps = [
  { label: "Customer", description: "Who the invoice is for." },
  { label: "Line items", description: "What you are billing." },
  { label: "Review", description: "Check the total, then send it." },
] satisfies StepperStep[];

const meta = {
  title: "Molecules/Stepper",
  component: Stepper,
  args: {
    label: "Create invoice",
    activeStep: 1,
    steps,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const LabelsBelow: Story = {
  args: { labelPlacement: "below" },
};

export const Vertical: Story = {
  args: { orientation: "vertical", className: "max-w-sm" },
};

export const WithError: Story = {
  args: {
    label: "Account setup",
    orientation: "vertical",
    className: "max-w-sm",
    activeStep: 1,
    steps: [
      { label: "Account details", description: "Name and email on the invoice." },
      { label: "Billing address", optional: true, error: "Enter a city." },
      { label: "Review", description: "Check the details, then send the invoice." },
    ],
  },
};

export const Text: Story = {
  args: { variant: "text", className: "max-w-sm" },
};

export const Dots: Story = {
  args: { variant: "dots", className: "max-w-sm" },
};

export const Progress: Story = {
  args: { variant: "progress", className: "max-w-sm" },
};
