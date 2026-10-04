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
  Mail,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";
import { Skeleton, SkeletonRows, SkeletonText } from "@/components/atoms/skeleton";
import { Spinner, SpinnerOverlay } from "@/components/atoms/spinner";
import { Breadcrumb } from "@/components/molecules/breadcrumb";
import { Code, CodeBlock } from "@/components/molecules/code";
import { Combobox } from "@/components/molecules/combobox";
import { DateRangePicker, type DateRange } from "@/components/molecules/date-range-picker";
import { FileUploader } from "@/components/molecules/file-uploader";
import { Popup, PopupContent, PopupTrigger } from "@/components/molecules/popup";
import { PopupMenu } from "@/components/molecules/popup-menu";
import { SelectPicker } from "@/components/molecules/select-picker";
import { TimePicker } from "@/components/molecules/time-picker";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/molecules/tooltip";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/organisms/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/organisms/dialog";
import { Modal } from "@/components/organisms/modal";
import { CommandBar } from "@/components/organisms/command-bar";
import { HoldingsTable } from "@/components/organisms/holdings-table";
import { PageHeader } from "@/components/organisms/page-header";
import { Timeline } from "@/components/organisms/timeline";
import { DashboardShell } from "@/components/templates/dashboard-shell";

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
  const [menuNote, setMenuNote] = React.useState("Choose an action");
  const [saved, setSaved] = React.useState(false);
  const [fileCount, setFileCount] = React.useState(0);
  const [commandsOpen, setCommandsOpen] = React.useState(false);

  return (
    <DashboardShell>
      <PageHeader
        crumbs={[{ label: "Sprig", href: "/" }, { label: "Components" }]}
        title="Components"
        description="Pickers, overlays, loaders, a timeline, a data table, a command bar, code, and the Lucide icon set used across Sprig."
      />
      <div className="grid gap-2.5 xl:grid-cols-2">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader>
            <CardTitle>Data table</CardTitle>
          </CardHeader>
          <HoldingsTable />
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
            <CardTitle>Dialog and modal</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-wrap items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" color="white" size="sm">
                  Open dialog
                </Button>
              </DialogTrigger>
              <DialogContent
                title="Share this view"
                description="Dialogs keep a task in front of the page."
              >
                <DialogBody>Send a read-only link to the current dashboard.</DialogBody>
                <DialogFooter>
                  <Button type="button" size="sm">
                    Copy link
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Modal
              title="Archive this order?"
              description="A modal asks for a decision before it closes."
              confirmLabel="Archive"
              trigger={
                <Button type="button" size="sm">
                  Open modal
                </Button>
              }
              onConfirm={() => setSaved(true)}
            >
              Archived orders leave the active queue. You can restore them later.
            </Modal>
            {saved ? <span className="text-[13px] text-success">Archived.</span> : null}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Code</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            <p className="text-[13px] text-text-2">
              Import pieces from <Code>@/components</Code>.
            </p>
            <CodeBlock
              label="tsx"
              code={`import { Button } from "@/components";

export function Save() {
  return <Button>Save</Button>;
}`}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Menu popup</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-wrap items-center gap-3">
            <PopupMenu
              label="Actions"
              group="Order"
              items={[
                { label: "View", onSelect: () => setMenuNote("View") },
                { label: "Duplicate", onSelect: () => setMenuNote("Duplicate") },
                { label: "Delete", tone: "danger", onSelect: () => setMenuNote("Delete") },
              ]}
            />
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
                { label: "Sprig", href: "/" },
                { label: "Components", href: "/examples/components" },
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
                  description: "Ivy Calder joined the Sprig workspace.",
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
          { id: "foundations", label: "Foundations", group: "Pages", href: "/" },
          { id: "widgets", label: "Widgets", group: "Pages", href: "/examples/widgets" },
          { id: "settings", label: "Settings", group: "Pages", href: "/examples/settings" },
        ]}
      />
    </DashboardShell>
  );
}
