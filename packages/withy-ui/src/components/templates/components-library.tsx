"use client";

import * as React from "react";
import {
  Bell,
  Calendar,
  Check,
  Compass,
  FileText,
  Folder,
  Home,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  Mail,
  Search,
  Settings,
  Sparkles,
  Table2,
  Trash2,
  User,
} from "lucide-react";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { Eyebrow } from "../atoms/eyebrow";
import { Figure } from "../atoms/figure";
import { Icon } from "../atoms/icon";
import { Link } from "../atoms/link";
import { RadioGroup } from "../atoms/radio-group";
import { Skeleton, SkeletonRows, SkeletonText } from "../atoms/skeleton";
import { Spinner, SpinnerOverlay } from "../atoms/spinner";
import { Tag, type TagColor } from "../atoms/tag";
import { Breadcrumb } from "../molecules/breadcrumb";
import { CheckboxField, RadioField, SwitchField } from "../molecules/choice-field";
import { Code, CodeBlock } from "../molecules/code";
import { ColorPicker } from "../molecules/color-picker";
import { Combobox } from "../molecules/combobox";
import { CopyButton } from "../molecules/copy-button";
import { DatePicker } from "../molecules/date-picker";
import { DateRangePicker, type DateRange } from "../molecules/date-range-picker";
import { EmptyState } from "../molecules/empty-state";
import { Fieldset } from "../molecules/fieldset";
import { FileUploader } from "../molecules/file-uploader";
import { FormField } from "../molecules/form-field";
import { IconButton } from "../molecules/icon-button";
import { InlineMessage } from "../molecules/inline-message";
import { Popup, PopupContent, PopupTrigger } from "../molecules/popup";
import {
  PopupMenu,
  PopupMenuContent,
  PopupMenuItem,
  PopupMenuLabel,
  PopupMenuTrigger,
} from "../molecules/popup-menu";
import { SegmentedControl } from "../molecules/segmented-control";
import { ChipPicker } from "../molecules/chip-picker";
import { SelectPicker } from "../molecules/select-picker";
import { TimePicker } from "../molecules/time-picker";
import { TransferList } from "../molecules/transfer-list";
import { Tooltip, TooltipContent, TooltipTrigger } from "../molecules/tooltip";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "../organisms/card";
import { Dialog } from "../organisms/dialog";
import { Drawer } from "../organisms/drawer";
import { Overlay } from "../organisms/overlay";
import { CommandBar } from "../organisms/command-bar";
import { HoldingsTable } from "../organisms/holdings-table";
import { holdings } from "../../data/holdings";
import { PageHeader } from "../organisms/page-header";
import { Timeline } from "../organisms/timeline";
import { DashboardShell } from "./dashboard-shell";

const reportColumns = [
  { label: "Invoice", value: "invoice" },
  { label: "Customer", value: "customer" },
  { label: "Amount", value: "amount" },
  { label: "Status", value: "status" },
  { label: "Due date", value: "due" },
  { label: "Owner", value: "owner" },
];

const countries = [
  { label: "United States", value: "us" },
  { label: "Canada", value: "ca" },
  { label: "United Kingdom", value: "uk" },
  { label: "Germany", value: "de" },
  { label: "Japan", value: "jp" },
];

const icons = [
  ["Home", Home],
  ["Dashboard", LayoutDashboard],
  ["Mail", Mail],
  ["Inbox", Inbox],
  ["Calendar", Calendar],
  ["Search", Search],
  ["Bell", Bell],
  ["Settings", Settings],
  ["User", User],
  ["Folder", Folder],
  ["File", FileText],
  ["Compass", Compass],
  ["Spark", Sparkles],
  ["Check", Check],
] as const;

const tagColors: TagColor[] = ["primary", "cyan", "orange", "indigo", "teal", "pink"];

export function ComponentsLibraryTemplate() {
  const [time, setTime] = React.useState("09:30");
  const [range, setRange] = React.useState<DateRange>();
  const [country, setCountry] = React.useState("us");
  const [tags, setTags] = React.useState([
    { label: "Design", value: "design" },
    { label: "Billing", value: "billing" },
    { label: "Support", value: "support" },
  ]);
  const [tag, setTag] = React.useState("design");
  const [topics, setTopics] = React.useState(["design", "billing"]);
  const [menuNote, setMenuNote] = React.useState("Choose an action");
  const [fileCount, setFileCount] = React.useState(0);
  const [commandsOpen, setCommandsOpen] = React.useState(false);
  const [dueDate, setDueDate] = React.useState<string>();
  const [brandColor, setBrandColor] = React.useState("#0E7484");
  const [view, setView] = React.useState("table");
  const [filters, setFilters] = React.useState(["Open", "This month"]);
  const [billing, setBilling] = React.useState("monthly");
  const [alerts, setAlerts] = React.useState(true);
  const [chosenColumns, setChosenColumns] = React.useState(["amount", "status"]);

  return (
    <DashboardShell>
      <PageHeader
        crumbs={[
          { label: "Withy UI", href: "/" },
          { label: "Components", href: "/components" },
          { label: "Blocks" },
        ]}
        title="Blocks"
        description="Fields, pickers, a transfer list, tables, messages, overlays, loaders, a timeline, a command bar, code, and the Lucide icon set used across Withy UI."
      />
      <div className="grid gap-2.5 xl:grid-cols-2">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader>
            <CardTitle>Data table</CardTitle>
          </CardHeader>
          <HoldingsTable rows={holdings} />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Command bar</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-wrap items-center gap-3">
            <Button type="button" size="sm" onClick={() => setCommandsOpen(true)}>
              Open command bar
            </Button>
            <span className="text-[13px] text-text-3">
              The top bar search, and ⌘K, open the same palette.
            </span>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time picker</CardTitle>
          </CardHeader>
          <CardBody>
            <TimePicker value={time} onValueChange={setTime} />
            <p className="mt-3 text-[13px] text-text-3">Stored as {time}</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Date range</CardTitle>
          </CardHeader>
          <CardBody>
            <DateRangePicker value={range} onValueChange={setRange} />
            <p className="mt-3 text-[13px] text-text-3">
              {range ? `${range.start} to ${range.end}` : "Pick a start day, then an end day."}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Skeletons</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Skeleton className="h-8 w-40" />
            <SkeletonText lines={3} />
            <SkeletonRows rows={2} />
          </CardBody>
        </Card>
        <Card className="relative">
          <CardHeader>
            <CardTitle>Spinners</CardTitle>
          </CardHeader>
          <CardBody className="flex items-center gap-6">
            <Spinner size="sm" label="Small loading" />
            <Spinner size="md" label="Loading" />
            <Spinner size="lg" label="Large loading" />
            <span className="relative h-16 w-24 rounded-sm border border-border">
              <SpinnerOverlay label="Loading panel" />
            </span>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dialog, drawer, and overlay</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-wrap items-center gap-2">
            <Dialog
              title="Share this view"
              description="A dialog keeps a task in front of the page."
              trigger={
                <Button type="button" color="white" size="sm">
                  Open dialog
                </Button>
              }
              footer={
                <Button type="button" size="sm">
                  Copy link
                </Button>
              }
            >
              Send a read-only link to the current dashboard.
            </Dialog>
            <Drawer
              title="Filters"
              description="A drawer keeps a task at the side of the page."
              trigger={
                <Button type="button" color="white" size="sm">
                  Open drawer
                </Button>
              }
            >
              Show open invoices from this month.
            </Drawer>
            <Overlay
              label="Preview"
              trigger={
                <Button type="button" color="white" size="sm">
                  Open overlay
                </Button>
              }
            >
              <p className="rounded-sm border border-border bg-card px-5 py-4 text-sm text-text-2">
                An overlay covers the page for your own content.
              </p>
            </Overlay>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Code</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            <p className="text-[13px] text-text-2">
              Import pieces from <Code>withy-ui</Code>.
            </p>
            <CodeBlock
              label="tsx"
              code={`import { Button } from "withy-ui";

export function Save() {
  return <Button>Save</Button>;
}`}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Popup menu</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-wrap items-center gap-3">
            <PopupMenu>
              <PopupMenuTrigger asChild>
                <Button type="button" color="white" size="sm">
                  Actions
                </Button>
              </PopupMenuTrigger>
              <PopupMenuContent>
                <PopupMenuLabel>Order</PopupMenuLabel>
                <PopupMenuItem onSelect={() => setMenuNote("View")}>View</PopupMenuItem>
                <PopupMenuItem onSelect={() => setMenuNote("Duplicate")}>Duplicate</PopupMenuItem>
                <PopupMenuItem className="text-danger" onSelect={() => setMenuNote("Delete")}>
                  Delete
                </PopupMenuItem>
              </PopupMenuContent>
            </PopupMenu>
            <Popup>
              <PopupTrigger asChild>
                <Button type="button" color="white" size="sm">
                  Open popup
                </Button>
              </PopupTrigger>
              <PopupContent className="w-56">
                <p className="text-sm font-medium text-heading">Popup</p>
                <p className="mt-1 text-[13px] text-text-3">
                  A floating panel for a short note, filter, or picker.
                </p>
              </PopupContent>
            </Popup>
            <span className="text-[13px] text-text-3">{menuNote}</span>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tooltip and breadcrumb</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" color="white" size="sm">
                  Hover for a tip
                </Button>
              </TooltipTrigger>
              <TooltipContent>Shortcuts stay on the button.</TooltipContent>
            </Tooltip>
            <Breadcrumb
              items={[
                { label: "Withy UI", href: "/" },
                { label: "Components", href: "/components" },
                { label: "Tooltip" },
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Combobox</CardTitle>
          </CardHeader>
          <CardBody>
            <Combobox
              options={countries}
              value={country}
              onValueChange={setCountry}
              placeholder="Country"
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Select picker</CardTitle>
          </CardHeader>
          <CardBody>
            <SelectPicker
              options={tags}
              value={tag}
              onValueChange={setTag}
              placeholder="Tag"
              onCreate={(label) => {
                const value = label.toLowerCase().replace(/\s+/g, "-");
                setTags((current) => [...current, { label, value }]);
                setTag(value);
              }}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chip picker</CardTitle>
          </CardHeader>
          <CardBody>
            <ChipPicker
              options={tags}
              value={topics}
              onValueChange={setTopics}
              placeholder="Topics"
              onCreate={(label) => {
                const value = label.toLowerCase().replace(/\s+/g, "-");
                setTags((current) => [...current, { label, value }]);
              }}
            />
          </CardBody>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Transfer list</CardTitle>
              <CardDescription>
                Move columns into the report. Chosen columns stay in this order.
              </CardDescription>
            </div>
          </CardHeader>
          <CardBody>
            <TransferList
              items={reportColumns}
              value={chosenColumns}
              onValueChange={setChosenColumns}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Type and marks</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div>
              <Eyebrow>Conversion rate</Eyebrow>
              <Figure className="mt-1.5">0.81%</Figure>
            </div>
            <p className="text-[13px] text-text-2">
              Read the <Link href="/foundations/typography">typography guide</Link> before adding a
              new text style.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge color="success">Paid</Badge>
              <Badge variant="muted" color="warning">
                Due soon
              </Badge>
              <Badge variant="muted" color="danger">
                Overdue
              </Badge>
              <Badge variant="muted" color="cyan">
                Design
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {tagColors.map((color) => (
                <Tag key={color} color={color}>
                  {color[0]?.toUpperCase() + color.slice(1)}
                </Tag>
              ))}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Filters and views</CardTitle>
              <CardDescription>
                A segmented control picks one view. Tags show filters.
              </CardDescription>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <SegmentedControl
              aria-label="Invoice view"
              value={view}
              onValueChange={setView}
              options={[
                { label: "Table", value: "table", icon: Table2 },
                { label: "Board", value: "board", icon: LayoutGrid },
              ]}
            />
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => (
                <Tag
                  key={filter}
                  onRemove={() =>
                    setFilters((current) => current.filter((item) => item !== filter))
                  }
                >
                  {filter}
                </Tag>
              ))}
              {filters.length > 0 ? (
                <Button variant="text" size="sm" onClick={() => setFilters([])}>
                  Clear filters
                </Button>
              ) : (
                <Button variant="text" size="sm" onClick={() => setFilters(["Open", "This month"])}>
                  Restore filters
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Choice fields</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-5">
            <Fieldset legend="Billing period" hint="Change it at any time.">
              <RadioGroup value={billing} onValueChange={setBilling}>
                <RadioField value="monthly" label="Monthly" />
                <RadioField value="yearly" label="Yearly" description="Two months free." />
              </RadioGroup>
            </Fieldset>
            <CheckboxField label="Send a copy to billing" defaultChecked />
            <SwitchField
              label="Email alerts"
              description="Saves as soon as you change it."
              checked={alerts}
              onCheckedChange={setAlerts}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Date picker</CardTitle>
          </CardHeader>
          <CardBody>
            <FormField
              label="Due date"
              hint={dueDate ? `Stored as ${dueDate}` : "The invoice is due at the end of this day."}
            >
              <DatePicker value={dueDate} onValueChange={setDueDate} />
            </FormField>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Color picker</CardTitle>
          </CardHeader>
          <CardBody>
            <FormField
              label="Brand color"
              hint={brandColor ? `Stored as ${brandColor}` : "Choose a color for charts and tags."}
            >
              <ColorPicker value={brandColor} onValueChange={setBrandColor} />
            </FormField>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <InlineMessage tone="success">Changes saved.</InlineMessage>
            <InlineMessage tone="info">Exports finish in about a minute.</InlineMessage>
            <InlineMessage tone="warning">Your trial ends in 3 days.</InlineMessage>
            <InlineMessage tone="danger">Enter a card number with 16 digits.</InlineMessage>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Copy and icon buttons</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-wrap items-center gap-2">
            <CopyButton size="sm" color="white" value="https://withy.example/invoices/1048">
              Copy invoice link
            </CopyButton>
            <IconButton icon={Bell} label="Notifications" tooltip />
            <IconButton icon={Settings} label="Settings" tooltip />
            <IconButton icon={Trash2} label="Delete invoice" color="danger" variant="outlined" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Empty state</CardTitle>
          </CardHeader>
          <CardBody>
            <EmptyState
              icon={FileText}
              title="No reports yet"
              description="Create a report to see revenue by week."
              action={
                <Button type="button" size="sm">
                  Create report
                </Button>
              }
            />
          </CardBody>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>File uploader</CardTitle>
          </CardHeader>
          <CardBody>
            <FileUploader onFilesChange={(files) => setFileCount(files.length)} />
            <p className="mt-3 text-[13px] text-text-3">
              {`${fileCount} ${fileCount === 1 ? "file" : "files"} ready`}
            </p>
          </CardBody>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardBody>
            <Timeline
              items={[
                {
                  id: "created",
                  time: "Mar 2 · 9:10",
                  title: "Account created",
                  description: "Ivy Calder joined the Withy UI workspace.",
                  tone: "primary",
                },
                {
                  id: "invoice",
                  time: "Mar 4 · 14:22",
                  title: "Invoice sent",
                  description: "Invoice #1048 emailed to billing.",
                  tone: "info",
                },
                {
                  id: "paid",
                  time: "Mar 6 · 11:05",
                  title: "Payment received",
                  description: "The order was marked paid.",
                  tone: "success",
                },
              ]}
            />
          </CardBody>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Icons</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="mb-4 text-[13px] text-text-3">
              Lucide supplies the line icons. The Icon atom keeps them at the same size and stroke
              as the rest of the UI.
            </p>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
              {icons.map(([name, glyph]) => (
                <span
                  key={name}
                  className="flex flex-col items-center gap-2 rounded-sm border border-border px-2 py-3 text-text-2"
                >
                  <Icon icon={glyph} />
                  <span className="truncate text-[10px] text-text-3">{name}</span>
                </span>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
      <CommandBar
        open={commandsOpen}
        onOpenChange={setCommandsOpen}
        items={[
          { id: "foundations", label: "Foundations", group: "Pages", href: "/foundations" },
          { id: "patterns", label: "UI patterns", group: "Pages", href: "/patterns" },
          { id: "scenarios", label: "Scenario patterns", group: "Pages", href: "/scenarios" },
          { id: "widgets", label: "Widgets", group: "Pages", href: "/components/sparkline" },
          { id: "settings", label: "Settings", group: "Pages", href: "/components" },
        ]}
      />
    </DashboardShell>
  );
}
