import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

function Sections({ taxDisabled = false }: { taxDisabled?: boolean }) {
  return (
    <>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing address</AccordionTrigger>
        <AccordionContent>
          Invoices go to Northwind Trading, 18 Harbor Street, Portland.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="payment">
        <AccordionTrigger>Payment method</AccordionTrigger>
        <AccordionContent>Invoices are charged to the card ending in 4242.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="tax" disabled={taxDisabled}>
        <AccordionTrigger>Tax details</AccordionTrigger>
        <AccordionContent>The tax id on these invoices is 12-3456789.</AccordionContent>
      </AccordionItem>
    </>
  );
}

const meta = {
  title: "Molecules/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "billing",
  },
  parameters: {
    docs: {
      description: {
        component:
          "An accordion opens and closes sections of related content. One section can stay open, or several can be open at once.",
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: (args) => (
    <Accordion {...args} className="max-w-lg">
      <Sections />
    </Accordion>
  ),
};

export const DisabledSection: Story = {
  render: (args) => (
    <Accordion {...args} className="max-w-lg">
      <Sections taxDisabled />
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={["billing"]} className="max-w-lg">
      <Sections />
    </Accordion>
  ),
};
