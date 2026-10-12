import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCardInput, type CreditCardValue } from "./credit-card-input";

const empty: CreditCardValue = { number: "", name: "", expiry: "", cvc: "" };

const meta = {
  title: "Molecules/Credit card input",
  component: CreditCardInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A credit card input takes the number, name, expiry, and security code. The card changes with the brand as the number is typed.",
      },
    },
  },
} satisfies Meta<typeof CreditCardInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Examples: Story = {
  render: () => <ExamplesGallery />,
};

function ExamplesGallery() {
  const [card, setCard] = React.useState<CreditCardValue>(empty);
  const [brand, setBrand] = React.useState("unknown");

  return (
    <div className="grid max-w-sm gap-8">
      <div className="grid gap-2">
        <CreditCardInput value={card} onValueChange={setCard} onBrandChange={setBrand} />
        <p className="text-[13px] text-text-3">Brand: {brand}</p>
      </div>
      <CreditCardInput
        defaultValue={{
          number: "4242424242424242",
          name: "Ada Lovelace",
          expiry: "1228",
          cvc: "123",
        }}
      />
      <CreditCardInput
        defaultValue={{
          number: "5555555555554444",
          name: "Grace Hopper",
          expiry: "0927",
          cvc: "321",
        }}
      />
      <CreditCardInput
        defaultValue={{
          number: "378282246310005",
          name: "Katherine Johnson",
          expiry: "0429",
          cvc: "1234",
        }}
      />
      <CreditCardInput
        defaultValue={{
          number: "6011111111111117",
          name: "Radia Perlman",
          expiry: "0130",
          cvc: "456",
        }}
      />
      <CreditCardInput
        defaultValue={{ number: "4242", name: "", expiry: "12", cvc: "1" }}
        errors={{
          number: "Enter a valid card number.",
          expiry: "Enter the expiry as MM/YY.",
          cvc: "Enter the 3 digit security code.",
        }}
      />
      <CreditCardInput
        preview={false}
        defaultValue={{
          number: "6200000000000005",
          name: "Mary Jackson",
          expiry: "1128",
          cvc: "789",
        }}
      />
    </div>
  );
}
