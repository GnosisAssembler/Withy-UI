import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "./form-field";
import { NumberInput } from "./number-input";

const meta = {
  title: "Molecules/Number input",
  component: NumberInput,
  tags: ["autodocs"],
  args: {
    "aria-label": "Seats",
    defaultValue: 2,
    min: 1,
    max: 20,
    step: 1,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A number input takes a number by typing or with its stepper. Arrow keys change it by one step, and Shift or Page Up and Page Down change it by ten steps.",
      },
    },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Seats: Story = {};

export const Examples: Story = {
  render: () => <ExamplesGallery />,
};

function ExamplesGallery() {
  const [seats, setSeats] = React.useState<number | null>(2);
  const [amount, setAmount] = React.useState<number | null>(1240);
  const [rate, setRate] = React.useState<number | null>(18.5);

  return (
    <div className="grid max-w-sm gap-4">
      <FormField label="Seats" hint="Between 1 and 20.">
        <NumberInput
          value={seats}
          onValueChange={setSeats}
          min={1}
          max={20}
          controls="sides"
          className="max-w-36"
        />
      </FormField>
      <FormField label="Amount">
        <NumberInput
          value={amount}
          onValueChange={setAmount}
          min={0}
          step={0.01}
          prefix="$"
          suffix="USD"
          format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        />
      </FormField>
      <FormField label="Tax rate" hint="Added to the invoice total.">
        <NumberInput value={rate} onValueChange={setRate} min={0} max={100} step={0.5} suffix="%" />
      </FormField>
      <FormField label="Quantity" error="Enter a quantity from 1 to 20.">
        <NumberInput min={1} max={20} defaultValue={24} />
      </FormField>
      <FormField label="Reserved seats">
        <NumberInput defaultValue={6} disabled />
      </FormField>
      <FormField label="Copies">
        <NumberInput
          fieldSize="sm"
          min={1}
          defaultValue={1}
          controls="sides"
          className="max-w-36"
        />
      </FormField>
    </div>
  );
}
