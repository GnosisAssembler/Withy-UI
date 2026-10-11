import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../atoms/badge";
import { holdings } from "../../data/holdings";
import { orders, orderStatusTone, type Order } from "../../data/sales";
import { DataTable, type Column } from "./data-table";
import { HoldingsTable } from "./holdings-table";

const columns: Column<Order>[] = [
  {
    key: "id",
    header: "Order",
    filterValue: (row) => row.id,
    sortValue: (row) => row.id,
    cell: (row) => <span className="font-medium text-heading">#{row.id}</span>,
  },
  {
    key: "customer",
    header: "Customer",
    filterValue: (row) => row.customer,
    sortValue: (row) => row.customer,
    cell: (row) => row.customer,
  },
  {
    key: "status",
    header: "Status",
    filterValue: (row) => row.status,
    sortValue: (row) => row.status,
    cell: (row) => <Badge color={orderStatusTone[row.status]}>{row.status}</Badge>,
  },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    filterValue: (row) => row.amount,
    sortValue: (row) => Number(row.amount.replace(/[$,]/g, "")),
    cell: (row) => row.amount,
  },
];

function RecentOrdersTable() {
  return (
    <DataTable
      columns={columns}
      rows={orders}
      getRowKey={(row) => row.id}
      caption="Recent orders"
    />
  );
}

const meta = {
  title: "Organisms/DataTable",
  component: HoldingsTable,
  tags: ["autodocs"],
  args: { rows: holdings },
} satisfies Meta<typeof HoldingsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Holdings: Story = {};

export const RecentOrders: Story = { render: () => <RecentOrdersTable /> };
