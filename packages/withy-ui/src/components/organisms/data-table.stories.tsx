import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "../atoms/badge";
import { Figure } from "../atoms/figure";
import { Progress } from "../atoms/progress";
import { Text } from "../atoms/text";
import { useToast } from "../molecules/toast";
import { holdings } from "../../data/holdings";
import { orders, orderStatusTone, type Order } from "../../data/sales";
import { workspaceStatusColor, workspaces, type Workspace } from "../../data/workspaces";
import {
  DataTable,
  type Column,
  type DataTableBulkAction,
  type DataTableRowAction,
} from "./data-table";
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

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const workspaceColumns: Column<Workspace>[] = [
  {
    key: "owner",
    header: "Owner",
    width: "18%",
    hideable: false,
    sortValue: (row) => row.owner,
    cell: (row) => <span className="font-medium text-heading">{row.owner}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (row) => row.status,
    filter: {
      type: "select",
      value: (row) => row.status,
      options: [
        { label: "Live", value: "Live" },
        { label: "Inactive", value: "Inactive" },
        { label: "Archived", value: "Archived" },
      ],
    },
    cell: (row) => (
      <Badge variant="muted" color={workspaceStatusColor[row.status]}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: "region",
    header: "Region",
    sortValue: (row) => row.region,
    filter: { type: "select", value: (row) => row.region },
    cell: (row) => row.region,
  },
  {
    key: "stability",
    header: "Stability",
    width: "16%",
    sortValue: (row) => row.stability,
    filter: { type: "number", value: (row) => row.stability },
    cell: (row) => (
      <span className="flex items-center gap-2">
        <Progress
          value={row.stability}
          color={row.stability >= 90 ? "success" : row.stability >= 20 ? "warning" : "danger"}
          className="w-16"
          aria-label={`${row.owner} stability`}
        />
        <span className="tabular-nums">{row.stability}</span>
      </span>
    ),
  },
  {
    key: "costs",
    header: "Costs",
    width: "14%",
    align: "right",
    sortValue: (row) => row.costs,
    filter: { type: "number", format: "currency", value: (row) => row.costs },
    cell: (row) => (
      <Figure as="span" size="sm">
        {money.format(row.costs)}
      </Figure>
    ),
  },
  {
    key: "edited",
    header: "Last edited",
    sortValue: (row) => row.edited,
    filter: { type: "date", value: (row) => row.edited },
    cell: (row) => row.editedAt,
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

function stabilityColor(value: number) {
  if (value >= 90) return "success" as const;
  if (value >= 20) return "warning" as const;
  return "danger" as const;
}

function WorkspaceDetails({ workspace }: { workspace: Workspace }) {
  return (
    <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-3">
      <Text as="span" size="sm" tone="muted">
        Status
      </Text>
      <Badge variant="muted" color={workspaceStatusColor[workspace.status]}>
        {workspace.status}
      </Badge>
      <Text as="span" size="sm" tone="muted">
        Region
      </Text>
      <Text as="span" size="sm">
        {workspace.region}
      </Text>
      <Text as="span" size="sm" tone="muted">
        Stability
      </Text>
      <span className="flex items-center gap-2">
        <Progress
          value={workspace.stability}
          color={stabilityColor(workspace.stability)}
          className="w-24"
          aria-label={`${workspace.owner} stability`}
        />
        <Text as="span" size="sm">
          {workspace.stability}
        </Text>
      </span>
      <Text as="span" size="sm" tone="muted">
        Costs
      </Text>
      <Figure as="span" size="sm">
        {money.format(workspace.costs)}
      </Figure>
      <Text as="span" size="sm" tone="muted">
        Last edited
      </Text>
      <Text as="span" size="sm">
        {workspace.editedAt}
      </Text>
    </dl>
  );
}

function WorkspacesTable() {
  const [rows, setRows] = useState(workspaces);
  const { toast } = useToast();

  const bulkActions: DataTableBulkAction<Workspace>[] = [
    {
      id: "edit",
      label: "Edit",
      shortcut: "e",
      icon: Pencil,
      onSelect: (selected) =>
        toast({
          title: `Edit ${selected.length} ${selected.length === 1 ? "workspace" : "workspaces"}`,
        }),
    },
    {
      id: "delete",
      label: "Delete",
      shortcut: "d",
      tone: "danger",
      icon: Trash2,
      onSelect: (selected) => {
        const keys = new Set(selected.map((row) => row.id));
        setRows((current) => current.filter((row) => !keys.has(row.id)));
        toast({
          title: `Deleted ${selected.length} ${selected.length === 1 ? "workspace" : "workspaces"}`,
          color: "danger",
        });
      },
    },
  ];

  const rowActions = (row: Workspace): DataTableRowAction<Workspace>[] => [
    {
      label: "Edit",
      icon: Pencil,
      onSelect: () => toast({ title: `Edit ${row.owner}` }),
    },
    {
      label: "Delete",
      icon: Trash2,
      tone: "danger",
      onSelect: () => {
        setRows((current) => current.filter((item) => item.id !== row.id));
        toast({ title: `Deleted ${row.owner}`, color: "danger" });
      },
    },
  ];

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card">
      <DataTable
        caption="Workspaces"
        rows={rows}
        getRowKey={(row) => row.id}
        columns={workspaceColumns}
        selectable
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        searchPlaceholder="Search by owner"
        searchValue={(row) => `${row.owner} ${row.region} ${row.status}`}
        columnVisibility
        rowLabel={(row) => row.owner}
        bulkActions={bulkActions}
        rowActions={rowActions}
        detailsTitle={(row) => row.owner}
        detailsDescription={(row) => row.region}
        details={(row) => <WorkspaceDetails workspace={row} />}
        onExport={(exported) =>
          toast({ title: `Exported ${exported.length} ${exported.length === 1 ? "row" : "rows"}` })
        }
        empty="No workspaces yet."
      />
    </div>
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

export const Details: Story = {
  args: { rows: [] },
  render: () => <WorkspacesTable />,
};
