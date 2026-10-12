"use client";

import * as React from "react";
import { Bell, CreditCard, FileText, Inbox, LayoutDashboard } from "lucide-react";
import { Badge } from "../../atoms/badge";
import { Button } from "../../atoms/button";
import { Figure } from "../../atoms/figure";
import { Input } from "../../atoms/input";
import { Kbd } from "../../atoms/kbd";
import { Progress } from "../../atoms/progress";
import { Sparkline } from "../../atoms/sparkline";
import { Text } from "../../atoms/text";
import { CopyButton } from "../../molecules/copy-button";
import { useToast } from "../../molecules/toast";
import { FormField } from "../../molecules/form-field";
import { IconButton } from "../../molecules/icon-button";
import { Logo } from "../../molecules/logo";
import { CalendarMonth } from "../../organisms/calendar-month";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../organisms/card";
import { CommandBar } from "../../organisms/command-bar";
import { DataTable } from "../../organisms/data-table";
import { Dialog } from "../../organisms/dialog";
import { Drawer } from "../../organisms/drawer";
import { Footer } from "../../organisms/footer";
import { Header } from "../../organisms/header";
import { Overlay } from "../../organisms/overlay";
import { PageHeader } from "../../organisms/page-header";
import { Sidebar } from "../../organisms/sidebar";
import { Timeline } from "../../organisms/timeline";
import type { ComponentDoc } from "./types";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const directory = [
  { id: "1", owner: "John Doe", status: "Live" as const, region: "US-West 1", costs: 5422 },
  { id: "2", owner: "Jane Smith", status: "Live" as const, region: "US-East 2", costs: 6087 },
  { id: "3", owner: "Wei Zhang", status: "Inactive" as const, region: "US-West 2", costs: 0 },
  { id: "4", owner: "Nina Müller", status: "Archived" as const, region: "EU-North 1", costs: 7609 },
  { id: "5", owner: "Yuki Tanaka", status: "Live" as const, region: "US-East 1", costs: 9874 },
  { id: "6", owner: "Olga Ivanova", status: "Live" as const, region: "US-West 2", costs: 6120 },
];

const directoryStatus = { Live: "success", Inactive: "secondary", Archived: "warning" } as const;

function DataTableDemo() {
  const { toast } = useToast();
  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <DataTable
        caption="Workspaces"
        rows={directory}
        getRowKey={(row) => row.id}
        selectable
        pageSize={4}
        searchPlaceholder="Search by owner"
        searchValue={(row) => row.owner}
        columnVisibility
        rowLabel={(row) => row.owner}
        empty="No workspaces yet."
        columns={[
          {
            key: "owner",
            header: "Owner",
            hideable: false,
            sortValue: (row) => row.owner,
            cell: (row) => <span className="font-medium text-heading">{row.owner}</span>,
          },
          {
            key: "status",
            header: "Status",
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
              <Badge variant="muted" color={directoryStatus[row.status]}>
                {row.status}
              </Badge>
            ),
          },
          {
            key: "region",
            header: "Region",
            filter: { type: "select", value: (row) => row.region },
            cell: (row) => row.region,
          },
          {
            key: "costs",
            header: "Costs",
            align: "right",
            sortValue: (row) => row.costs,
            filter: { type: "number", format: "currency", value: (row) => row.costs },
            cell: (row) => (
              <Figure as="span" size="sm">
                {money.format(row.costs)}
              </Figure>
            ),
          },
        ]}
        bulkActions={[
          {
            id: "edit",
            label: "Edit",
            shortcut: "e",
            onSelect: (rows) => toast({ title: `Edit ${rows.length} workspaces` }),
          },
        ]}
        detailsTitle={(row) => row.owner}
        detailsDescription={(row) => row.region}
        details={(row) => (
          <div className="flex flex-col gap-3">
            <Text size="sm">Costs {money.format(row.costs)}</Text>
            <Progress value={72} aria-label={`${row.owner} stability`} />
          </div>
        )}
      />
    </div>
  );
}

function CommandBarDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button size="sm" color="white" onClick={() => setOpen(true)}>
        Search pages <Kbd>⌘K</Kbd>
      </Button>
      <CommandBar
        open={open}
        onOpenChange={setOpen}
        items={[
          { id: "invoices", label: "Invoices", group: "Pages", href: "#invoices" },
          { id: "customers", label: "Customers", group: "Pages", href: "#customers" },
          { id: "create", label: "Create invoice", group: "Actions" },
        ]}
      />
    </>
  );
}

function DialogDemo() {
  const [deleted, setDeleted] = React.useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Dialog
        title="Share this report"
        description="People with the link can view it, but not edit it."
        trigger={
          <Button size="sm" color="white">
            Share report
          </Button>
        }
        footer={
          <CopyButton size="sm" value="https://withy.example/r/weekly">
            Copy link
          </CopyButton>
        }
      >
        <FormField label="Link">
          <Input readOnly value="https://withy.example/r/weekly" />
        </FormField>
      </Dialog>
      <Dialog
        tone="danger"
        title="Delete invoice #1048?"
        confirmLabel="Delete invoice"
        onConfirm={() => setDeleted(true)}
        trigger={
          <Button size="sm" color="danger" disabled={deleted}>
            Delete invoice
          </Button>
        }
      >
        The invoice and its payments are removed. This cannot be undone.
      </Dialog>
      <Text as="span" role="status" size="sm" tone="muted">
        {deleted ? "Invoice #1048 was deleted." : "Invoice #1048 is open."}
      </Text>
    </div>
  );
}

export const organismDocs = [
  {
    slug: "calendar-month",
    name: "Calendar month",
    category: "Organisms",
    description: "A month of events, with the agenda for the selected day beside it.",
    imports: ["CalendarMonth"],
    code: `<CalendarMonth events={events} today="2026-10-12" />`,
    Demo: () => (
      <CalendarMonth
        today="2026-10-12"
        events={[
          { id: "1", date: "2026-10-12", title: "Sprint planning", time: "10:30", color: "info" },
          { id: "2", date: "2026-10-12", title: "Customer call", time: "14:00", color: "success" },
          {
            id: "3",
            date: "2026-10-16",
            title: "Billing dry run",
            time: "16:00",
            color: "warning",
          },
          { id: "4", date: "2026-10-22", title: "Design critique", time: "11:00", color: "pink" },
        ]}
      />
    ),
  },
  {
    slug: "card",
    name: "Card",
    category: "Organisms",
    description:
      "A card groups one subject with a header, a body, and a footer. Cards sit 10px apart.",
    imports: ["Card", "CardBody", "CardDescription", "CardFooter", "CardHeader", "CardTitle"],
    code: `<Card>
  <CardHeader>
    <div>
      <CardTitle>Weekly revenue</CardTitle>
      <CardDescription>Compared with the week before</CardDescription>
    </div>
  </CardHeader>
  <CardBody>…</CardBody>
  <CardFooter>
    <Button size="sm" color="white">Open report</Button>
  </CardFooter>
</Card>`,
    Demo: () => (
      <Card className="max-w-md">
        <CardHeader>
          <div>
            <CardTitle as="h3">Weekly revenue</CardTitle>
            <CardDescription>Compared with the week before</CardDescription>
          </div>
          <Badge variant="muted" color="success">
            12% up
          </Badge>
        </CardHeader>
        <CardBody>
          <Figure>$48,200</Figure>
          <Sparkline
            className="mt-3"
            data={[8, 12, 10, 14, 13, 18, 16, 21, 19, 24]}
            label="Weekly revenue trend"
          />
        </CardBody>
        <CardFooter>
          <Button size="sm" color="white">
            Open report
          </Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    slug: "command-bar",
    name: "Command bar",
    category: "Organisms",
    description:
      "A command bar searches pages and actions from the keyboard. Turn on shortcut to open it with ⌘K.",
    imports: ["CommandBar"],
    code: `<CommandBar
  open={open}
  onOpenChange={setOpen}
  shortcut
  onNavigate={(href) => router.push(href)}
  items={[{ id: "invoices", label: "Invoices", group: "Pages", href: "/invoices" }]}
/>`,
    Demo: CommandBarDemo,
  },
  {
    slug: "data-table",
    name: "Data table",
    category: "Organisms",
    description:
      "A data table shows exact figures in rows and columns. Filter by text, choice, number, or date, then sort, page, select, and act on the rows.",
    imports: ["ColumnSparkline", "DataTable", "SignedFigures", "TickerCell"],
    code: `<DataTable
  caption="Workspaces"
  rows={workspaces}
  getRowKey={(row) => row.id}
  empty="No workspaces yet."
  selectable
  pageSize={20}
  searchPlaceholder="Search by owner"
  columnVisibility
  columns={[
    { key: "owner", header: "Owner", hideable: false, sortValue: (row) => row.owner, cell: (row) => row.owner },
    { key: "status", header: "Status", filter: { type: "select", value: (row) => row.status }, cell: (row) => row.status },
    { key: "costs", header: "Costs", align: "right", sortValue: (row) => row.costs, filter: { type: "number", format: "currency", value: (row) => row.costs }, cell: (row) => money(row.costs) },
  ]}
  bulkActions={[{ id: "edit", label: "Edit", shortcut: "e", onSelect: (rows) => editRows(rows) }]}
  details={(row) => <p>{row.owner}</p>}
/>`,
    Demo: DataTableDemo,
  },
  {
    slug: "dialog",
    name: "Dialog",
    category: "Organisms",
    description:
      "A dialog keeps one task in front of the page. It always has a title. Pass confirmLabel when it asks for a decision, and tone danger for a permanent delete. Pass footer for any other actions.",
    imports: ["Button", "Dialog"],
    code: `<Dialog
  tone="danger"
  title="Delete invoice #1048?"
  confirmLabel="Delete invoice"
  onConfirm={() => deleteInvoice("1048")}
  trigger={<Button color="danger">Delete invoice</Button>}
>
  The invoice and its payments are removed. This cannot be undone.
</Dialog>

<Dialog
  title="Share this report"
  description="People with the link can view it."
  trigger={<Button color="white">Share report</Button>}
  footer={<Button size="sm">Copy link</Button>}
>
  Send a read-only link.
</Dialog>`,
    Demo: DialogDemo,
  },
  {
    slug: "drawer",
    name: "Drawer",
    category: "Organisms",
    description:
      "A drawer keeps a task in a panel at the side of the page. Use it for filters, details, or navigation.",
    imports: ["Button", "Drawer"],
    code: `<Drawer
  title="Filters"
  description="Narrow the invoices on this page."
  trigger={<Button color="white">Filter invoices</Button>}
  footer={<Button size="sm">Apply filters</Button>}
>
  Open invoices from this month.
</Drawer>`,
    Demo: () => (
      <Drawer
        title="Filters"
        description="Narrow the invoices on this page."
        trigger={
          <Button size="sm" color="white">
            Filter invoices
          </Button>
        }
        footer={<Button size="sm">Apply filters</Button>}
      >
        Open invoices from this month.
      </Drawer>
    ),
  },
  {
    slug: "footer",
    name: "Footer",
    category: "Organisms",
    description: "The footer holds quiet links at the end of the page.",
    imports: ["Footer"],
    code: `<Footer links={[{ label: "Privacy", href: "/privacy" }]}>© 2026 Acme Inc.</Footer>`,
    Demo: () => (
      <div className="overflow-hidden rounded-sm border border-border">
        <Footer
          links={[
            { label: "Status", href: "#status" },
            { label: "Privacy", href: "#privacy" },
            { label: "Terms", href: "#terms" },
          ]}
        >
          © 2026 Acme Inc.
        </Footer>
      </div>
    ),
  },
  {
    slug: "header",
    name: "Header",
    category: "Organisms",
    description:
      "The header holds the logo, the main navigation, and actions. It marks the current page and folds into a drawer on a narrow screen.",
    imports: ["Header", "IconButton", "Logo"],
    code: `<Header
  nav={[{ label: "Invoices", href: "/invoices" }]}
  logo={<Logo name="acme" />}
  actions={<IconButton icon={Bell} label="Notifications" />}
/>`,
    Demo: () => (
      <div className="relative h-[60px] overflow-hidden rounded-sm border border-border [transform:translateZ(0)]">
        <Header
          nav={[
            { label: "Invoices", href: "#invoices" },
            { label: "Customers", href: "#customers" },
            { label: "Reports", href: "#reports" },
          ]}
          pathname="#invoices"
          logo={<Logo name="acme" href="#home" />}
          actions={<IconButton icon={Bell} label="Notifications" />}
          themeSwitcher={false}
        />
      </div>
    ),
  },
  {
    slug: "overlay",
    name: "Overlay",
    category: "Organisms",
    description:
      "An overlay covers the page and shows your own content on a dimmed layer. Use it for a preview or a custom panel.",
    imports: ["Button", "Overlay"],
    code: `<Overlay label="Invoice preview" trigger={<Button color="white">Preview invoice</Button>}>
  …
</Overlay>`,
    Demo: () => (
      <Overlay
        label="Invoice preview"
        trigger={
          <Button size="sm" color="white">
            Preview invoice
          </Button>
        }
      >
        <div className="w-80 rounded-sm border border-border bg-card px-5 py-4 text-sm text-text-2 shadow-lg">
          Invoice #1048 for Northwind, due at the end of the month.
        </div>
      </Overlay>
    ),
  },
  {
    slug: "page-header",
    name: "Page header",
    category: "Organisms",
    description:
      "A page header holds the breadcrumb, the one h1 on the page, a description, and the page actions.",
    imports: ["Button", "PageHeader"],
    code: `<PageHeader
  crumbs={[{ label: "Billing", href: "/billing" }, { label: "Invoices" }]}
  title="Invoices"
  description="12 open, 3 overdue."
  actions={<Button>Create invoice</Button>}
/>`,
    Demo: () => (
      <div className="rounded-sm border border-dashed border-border p-4">
        <PageHeader
          className="mb-0"
          crumbs={[{ label: "Billing", href: "#billing" }, { label: "Invoices" }]}
          title="Invoices"
          description="12 open, 3 overdue."
          actions={
            <>
              <Button size="sm" color="white">
                Export
              </Button>
              <Button size="sm">Create invoice</Button>
            </>
          }
        />
      </div>
    ),
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    category: "Organisms",
    description:
      "A sidebar lists the places in an area, grouped by section, and marks the current one.",
    imports: ["Sidebar"],
    code: `<Sidebar
  label="Workspace"
  sections={[
    { items: [{ href: "/", label: "Overview", icon: <LayoutDashboard />, active: true }] },
    { label: "Billing", items: [{ href: "/invoices", label: "Invoices", icon: <FileText /> }] },
  ]}
/>`,
    Demo: () => (
      <div className="h-80 w-60 rounded-sm border border-border bg-card">
        <Sidebar
          label="Sample workspace"
          sections={[
            {
              items: [
                { href: "#overview", label: "Overview", icon: <LayoutDashboard />, active: true },
                { href: "#inbox", label: "Inbox", icon: <Inbox /> },
              ],
            },
            {
              label: "Billing",
              items: [
                { href: "#invoices", label: "Invoices", icon: <FileText /> },
                { href: "#payments", label: "Payments", icon: <CreditCard /> },
              ],
            },
            { label: "Reports", items: [], empty: "No reports yet." },
          ]}
        />
      </div>
    ),
  },
  {
    slug: "timeline",
    name: "Timeline",
    category: "Organisms",
    description: "A timeline lists events in order, with their times.",
    imports: ["Timeline"],
    code: `<Timeline
  items={[
    { id: "created", time: "Mar 2 · 9:10", title: "Account created", tone: "primary" },
    { id: "paid", time: "Mar 6 · 11:05", title: "Payment received", tone: "success" },
  ]}
/>`,
    Demo: () => (
      <Timeline
        items={[
          {
            id: "created",
            time: "Mar 2 · 9:10",
            title: "Account created",
            description: "Ivy Calder joined the workspace.",
            tone: "primary",
          },
          {
            id: "invoice",
            time: "Mar 4 · 14:22",
            title: "Invoice sent",
            description: "Invoice #1048 emailed to billing.",
            tone: "info",
          },
          { id: "paid", time: "Mar 6 · 11:05", title: "Payment received", tone: "success" },
        ]}
      />
    ),
  },
] as const satisfies readonly ComponentDoc[];
