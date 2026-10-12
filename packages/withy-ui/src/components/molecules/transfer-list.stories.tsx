import type { Meta, StoryObj } from "@storybook/react-vite";
import { TransferList, type TransferItem } from "./transfer-list";

const columns: TransferItem[] = [
  { label: "Invoice", value: "invoice" },
  { label: "Customer", value: "customer", description: "The account on the invoice." },
  { label: "Amount", value: "amount" },
  { label: "Status", value: "status" },
  { label: "Due date", value: "due" },
  { label: "Owner", value: "owner" },
  { label: "Internal id", value: "internal", disabled: true },
];

const meta = {
  title: "Molecules/Transfer list",
  component: TransferList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A transfer list moves items between an available list and a chosen list. Check items, then move the selection or every enabled item.",
      },
    },
  },
} satisfies Meta<typeof TransferList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReportColumns: Story = {
  args: {
    items: columns,
    defaultValue: ["amount", "status"],
    availableLabel: "Available",
    chosenLabel: "Chosen",
  },
};

export const SelectionOnly: Story = {
  args: {
    items: columns,
    defaultValue: ["due"],
    showMoveAll: false,
    availableLabel: "Choices",
    chosenLabel: "Chosen",
  },
};
