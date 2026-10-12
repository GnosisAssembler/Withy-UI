"use client";

import * as React from "react";
import {
  Bell,
  Copy,
  FileText,
  Info,
  LayoutDashboard,
  LayoutGrid,
  Printer,
  Save,
  Settings,
  Sparkles,
  Table2,
  Trash2,
} from "lucide-react";
import { Avatar } from "../../atoms/avatar";
import { Badge } from "../../atoms/badge";
import { Button } from "../../atoms/button";
import { Icon } from "../../atoms/icon";
import { Input } from "../../atoms/input";
import { RadioGroup } from "../../atoms/radio-group";
import { Text } from "../../atoms/text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../molecules/accordion";
import { Alert } from "../../molecules/alert";
import { Breadcrumb } from "../../molecules/breadcrumb";
import { Callout } from "../../molecules/callout";
import { CheckboxField, RadioField, SwitchField } from "../../molecules/choice-field";
import { ChipPicker } from "../../molecules/chip-picker";
import { Code, CodeBlock } from "../../molecules/code";
import { ColorPicker } from "../../molecules/color-picker";
import { Combobox } from "../../molecules/combobox";
import { CopyButton } from "../../molecules/copy-button";
import { CreditCardInput, type CreditCardValue } from "../../molecules/credit-card-input";
import { DatePicker } from "../../molecules/date-picker";
import { DateRangePicker, type DateRange } from "../../molecules/date-range-picker";
import { EmptyState } from "../../molecules/empty-state";
import { Fieldset } from "../../molecules/fieldset";
import { FileInput } from "../../molecules/file-input";
import { FileUploader } from "../../molecules/file-uploader";
import { FormField } from "../../molecules/form-field";
import { HoverGallery } from "../../molecules/hover-gallery";
import { hoverGalleryImages } from "../../molecules/hover-gallery.images";
import { IconButton } from "../../molecules/icon-button";
import { InlineMessage } from "../../molecules/inline-message";
import { InputGroup } from "../../molecules/input-group";
import { InputOtp } from "../../molecules/input-otp";
import { Logo } from "../../molecules/logo";
import { Media, MediaBody } from "../../molecules/media";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../../molecules/context-menu";
import {
  PopupMenu,
  PopupMenuContent,
  PopupMenuItem,
  PopupMenuLabel,
  PopupMenuSeparator,
  PopupMenuTrigger,
} from "../../molecules/popup-menu";
import { MeterList } from "../../molecules/meter-list";
import { NavItem } from "../../molecules/nav-item";
import { NumberInput } from "../../molecules/number-input";
import { Pagination } from "../../molecules/pagination";
import { PasswordInput } from "../../molecules/password-input";
import { Popup, PopupContent, PopupTrigger } from "../../molecules/popup";
import { QrCode, qrCodeSvg, type QrCodeLevel } from "../../molecules/qr-code";
import { SearchInput } from "../../molecules/search-input";
import { SectionNav } from "../../molecules/section-nav";
import { SegmentedControl } from "../../molecules/segmented-control";
import { SegmentedMeter } from "../../molecules/segmented-meter";
import { Select } from "../../molecules/select";
import { SelectPicker } from "../../molecules/select-picker";
import { SpeedDial, type SpeedDialDirection } from "../../molecules/speed-dial";
import { Stat } from "../../molecules/stat";
import { Stepper } from "../../molecules/stepper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../molecules/tabs";
import { ThemeSwitcher } from "../../molecules/theme-switcher";
import { TimePicker } from "../../molecules/time-picker";
import { Tracker } from "../../molecules/tracker";
import { uptimeTrackerSample } from "../../molecules/tracker.sample";
import { useToast } from "../../molecules/toast";
import { TransferList } from "../../molecules/transfer-list";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../molecules/tooltip";
import { Truncate } from "../../molecules/truncate";
import { Card, CardBody, CardTitle } from "../../organisms/card";
import type { ComponentDoc } from "./types";

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Paid", value: "paid" },
];

function ComboboxDemo() {
  const [country, setCountry] = React.useState("ca");
  return (
    <FormField label="Country" className="max-w-xs">
      <Combobox
        value={country}
        onValueChange={setCountry}
        placeholder="Choose a country"
        options={[
          { label: "United States", value: "us" },
          { label: "Canada", value: "ca" },
          { label: "United Kingdom", value: "uk" },
          { label: "Germany", value: "de" },
          { label: "Japan", value: "jp" },
        ]}
      />
    </FormField>
  );
}

function ColorPickerDemo() {
  const [color, setColor] = React.useState("#0E7484");
  return (
    <FormField
      label="Brand color"
      hint={color ? `Stored as ${color}` : "Choose a color for charts and tags."}
      className="max-w-xs"
    >
      <ColorPicker value={color} onValueChange={setColor} />
    </FormField>
  );
}

function CreditCardInputDemo() {
  const [card, setCard] = React.useState<CreditCardValue>({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });
  const [brand, setBrand] = React.useState("unknown");
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <CreditCardInput value={card} onValueChange={setCard} onBrandChange={setBrand} />
      <p className="text-[13px] text-text-3">Brand: {brand}</p>
    </div>
  );
}

function DatePickerDemo() {
  const [due, setDue] = React.useState<string>();
  return (
    <FormField label="Due date" hint={due ? `Stored as ${due}` : undefined} className="max-w-xs">
      <DatePicker value={due} onValueChange={setDue} />
    </FormField>
  );
}

function DateRangeDemo() {
  const [range, setRange] = React.useState<DateRange>();
  return (
    <FormField label="Report period" className="max-w-xs">
      <DateRangePicker value={range} onValueChange={setRange} />
    </FormField>
  );
}

function PopupMenuDemo() {
  const [last, setLast] = React.useState("No action yet.");
  return (
    <div className="flex flex-wrap items-center gap-3">
      <PopupMenu>
        <PopupMenuTrigger asChild>
          <Button color="white" size="sm">
            Invoice actions
          </Button>
        </PopupMenuTrigger>
        <PopupMenuContent align="start">
          <PopupMenuLabel>Invoice #1048</PopupMenuLabel>
          <PopupMenuItem onSelect={() => setLast("Invoice sent.")}>Send invoice</PopupMenuItem>
          <PopupMenuItem onSelect={() => setLast("Invoice duplicated.")}>
            Duplicate invoice
          </PopupMenuItem>
          <PopupMenuSeparator />
          <PopupMenuItem className="text-danger" onSelect={() => setLast("Invoice deleted.")}>
            Delete invoice
          </PopupMenuItem>
        </PopupMenuContent>
      </PopupMenu>
      <span role="status" className="text-[13px] text-text-3">
        {last}
      </span>
    </div>
  );
}

function ContextMenuDemo() {
  const [last, setLast] = React.useState("No action yet.");
  const [showGrid, setShowGrid] = React.useState(true);
  const [density, setDensity] = React.useState("comfortable");
  return (
    <div className="flex flex-col gap-3">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex min-h-28 cursor-default items-center justify-center rounded-sm border border-dashed border-border bg-[color-mix(in_srgb,var(--heading)_4%,transparent)] px-4 text-center text-[13px] text-text-2">
            Right click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Invoice #1048</ContextMenuLabel>
          <ContextMenuItem onSelect={() => setLast("Invoice opened.")}>
            Open invoice
            <ContextMenuShortcut>⌘O</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => setLast("Invoice duplicated.")}>
            Duplicate invoice
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onSelect={() => setLast("Link copied.")}>Copy link</ContextMenuItem>
              <ContextMenuItem onSelect={() => setLast("Shared by email.")}>
                Email invoice
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={showGrid}
            onCheckedChange={(checked) => {
              setShowGrid(checked === true);
              setLast(checked === true ? "Grid shown." : "Grid hidden.");
            }}
          >
            Show grid
          </ContextMenuCheckboxItem>
          <ContextMenuRadioGroup
            value={density}
            onValueChange={(value) => {
              setDensity(value);
              setLast(`Density set to ${value}.`);
            }}
          >
            <ContextMenuLabel>Density</ContextMenuLabel>
            <ContextMenuRadioItem value="comfortable">Comfortable</ContextMenuRadioItem>
            <ContextMenuRadioItem value="compact">Compact</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuItem className="text-danger" onSelect={() => setLast("Invoice deleted.")}>
            Delete invoice
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <span role="status" className="text-[13px] text-text-3">
        {last}
      </span>
    </div>
  );
}

function PaginationDemo() {
  const [page, setPage] = React.useState(6);
  return <Pagination page={page} pages={12} onPageChange={setPage} />;
}

function InputOtpDemo() {
  const [code, setCode] = React.useState("");
  const [received, setReceived] = React.useState(false);
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <FormField label="Verification code" hint="Enter the 6-digit code from your email.">
        <InputOtp
          value={code}
          onValueChange={(next) => {
            setCode(next);
            setReceived(false);
          }}
          onComplete={() => setReceived(true)}
        />
      </FormField>
      {received ? <InlineMessage tone="success">Code received.</InlineMessage> : null}
      <FormField label="Backup code" hint="Letters and digits from your recovery card.">
        <InputOtp length={8} groups={[4, 4]} pattern="alphanumeric" />
      </FormField>
      <FormField label="Sign-in code" error="Enter the 6-digit code from your email.">
        <InputOtp defaultValue="123" groups={[3, 3]} />
      </FormField>
    </div>
  );
}

function NumberInputDemo() {
  const [seats, setSeats] = React.useState<number | null>(2);
  const [amount, setAmount] = React.useState<number | null>(1240);
  return (
    <div className="flex max-w-sm flex-col gap-4">
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
      <FormField label="Quantity" error="Enter a quantity from 1 to 20.">
        <NumberInput min={1} max={20} defaultValue={24} />
      </FormField>
    </div>
  );
}

function SearchInputDemo() {
  const [query, setQuery] = React.useState("");
  return (
    <FormField label="Search reports" className="max-w-sm">
      <SearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery("")}
        placeholder="Revenue"
      />
    </FormField>
  );
}

function SegmentedControlDemo() {
  const [view, setView] = React.useState("table");
  return (
    <SegmentedControl
      aria-label="Invoice view"
      value={view}
      onValueChange={setView}
      options={[
        { label: "Table", value: "table", icon: Table2 },
        { label: "Board", value: "board", icon: LayoutGrid },
      ]}
    />
  );
}

function SelectPickerDemo() {
  const [tags, setTags] = React.useState([
    { label: "Design", value: "design" },
    { label: "Billing", value: "billing" },
    { label: "Support", value: "support" },
  ]);
  const [tag, setTag] = React.useState("design");
  return (
    <FormField label="Tag" className="max-w-xs">
      <SelectPicker
        options={tags}
        value={tag}
        onValueChange={setTag}
        placeholder="Choose a tag"
        onCreate={(label) => {
          const value = label.toLowerCase().replace(/\s+/g, "-");
          setTags((current) => [...current, { label, value }]);
          setTag(value);
        }}
      />
    </FormField>
  );
}

function ChipPickerDemo() {
  const [tags, setTags] = React.useState([
    { label: "Design", value: "design" },
    { label: "Billing", value: "billing" },
    { label: "Support", value: "support" },
  ]);
  const [topics, setTopics] = React.useState(["design"]);
  return (
    <FormField label="Topics" className="max-w-sm">
      <ChipPicker
        options={tags}
        value={topics}
        onValueChange={setTopics}
        placeholder="Choose topics"
        onCreate={(label) => {
          const value = label.toLowerCase().replace(/\s+/g, "-");
          setTags((current) => [...current, { label, value }]);
        }}
      />
    </FormField>
  );
}

function SwitchFieldDemo() {
  const [alerts, setAlerts] = React.useState(true);
  return (
    <SwitchField
      className="max-w-sm"
      label="Email alerts"
      description="Saves as soon as you change it."
      checked={alerts}
      onCheckedChange={setAlerts}
    />
  );
}

function TimePickerDemo() {
  const [time, setTime] = React.useState("09:30");
  return (
    <FormField label="Start time" hint={`Stored as ${time}`} className="max-w-xs">
      <TimePicker value={time} onValueChange={setTime} />
    </FormField>
  );
}

function TransferListDemo() {
  const [chosen, setChosen] = React.useState(["amount", "status"]);
  return (
    <FormField label="Report columns" hint="Chosen columns appear in this order.">
      <TransferList
        items={[
          { label: "Invoice", value: "invoice" },
          { label: "Customer", value: "customer" },
          { label: "Amount", value: "amount" },
          { label: "Status", value: "status" },
          { label: "Due date", value: "due" },
          { label: "Owner", value: "owner" },
        ]}
        value={chosen}
        onValueChange={setChosen}
      />
    </FormField>
  );
}

const invoiceSteps = [
  { label: "Customer", description: "Who the invoice is for." },
  { label: "Line items", description: "What you are billing." },
  { label: "Review", description: "Check the total, then send it." },
];

function StepperDemo() {
  const [step, setStep] = React.useState(1);
  const [compactStep, setCompactStep] = React.useState(1);
  const atStart = compactStep <= 0;
  const atEnd = compactStep >= invoiceSteps.length - 1;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-[13px] font-medium text-heading">Labels beside the step</p>
          <Stepper
            label="Create invoice"
            activeStep={step}
            onStepChange={setStep}
            steps={invoiceSteps}
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-[13px] font-medium text-heading">Labels under the step</p>
          <Stepper
            label="Create invoice with labels below"
            labelPlacement="below"
            activeStep={step}
            onStepChange={setStep}
            steps={invoiceSteps}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            color="white"
            size="sm"
            disabled={step <= 0}
            onClick={() => setStep((value) => value - 1)}
          >
            Back
          </Button>
          <Button
            size="sm"
            disabled={step >= invoiceSteps.length - 1}
            onClick={() => setStep((value) => value + 1)}
          >
            Continue
          </Button>
        </div>
      </div>

      <div className="flex max-w-md flex-col gap-3">
        <p className="text-[13px] font-medium text-heading">Down the page</p>
        <Stepper
          orientation="vertical"
          label="Account setup"
          activeStep={1}
          steps={[
            { label: "Account details", description: "Name and email on the invoice." },
            {
              label: "Billing address",
              optional: true,
              error: "Enter a city.",
              content: (
                <p className="text-[13px] text-text-2">
                  Add a city to continue, or skip this step.
                </p>
              ),
            },
            { label: "Review", description: "Check the details, then send the invoice." },
          ]}
        />
      </div>

      <div className="flex max-w-md flex-col gap-4">
        <p className="text-[13px] font-medium text-heading">Narrow space</p>
        <Stepper
          variant="text"
          label="Create invoice, text"
          activeStep={compactStep}
          steps={invoiceSteps}
          back={
            <Button
              color="white"
              size="sm"
              disabled={atStart}
              onClick={() => setCompactStep((value) => value - 1)}
            >
              Back
            </Button>
          }
          next={
            <Button size="sm" disabled={atEnd} onClick={() => setCompactStep((value) => value + 1)}>
              Continue
            </Button>
          }
        />
        <Stepper
          variant="dots"
          label="Create invoice, dots"
          activeStep={compactStep}
          steps={invoiceSteps}
        />
        <Stepper
          variant="progress"
          label="Create invoice, progress"
          activeStep={compactStep}
          steps={invoiceSteps}
        />
      </div>
    </div>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        color="white"
        onClick={() =>
          toast({
            title: "Report ready",
            description: "Weekly revenue is ready to open.",
            color: "success",
          })
        }
      >
        Export report
      </Button>
      <Button
        size="sm"
        color="white"
        onClick={() =>
          toast({
            title: "Invoice #1049 removed from this report",
            description: "It is still in Invoices.",
            action: { label: "Undo", onClick: () => undefined },
          })
        }
      >
        Remove invoice from report
      </Button>
    </div>
  );
}

function SpeedDialDemo() {
  const [direction, setDirection] = React.useState<SpeedDialDirection>("up");
  const [last, setLast] = React.useState("No action yet.");
  const anchor = {
    up: "absolute bottom-4 left-1/2 -translate-x-1/2",
    right: "absolute top-1/2 left-4 -translate-y-1/2",
    down: "absolute top-4 left-1/2 -translate-x-1/2",
    left: "absolute top-1/2 right-4 -translate-y-1/2",
  }[direction];

  return (
    <div className="flex flex-col gap-2.5">
      <SegmentedControl
        aria-label="Direction"
        value={direction}
        onValueChange={(value) => {
          if (value === "up" || value === "right" || value === "down" || value === "left") {
            setDirection(value);
          }
        }}
        options={[
          { label: "Up", value: "up" },
          { label: "Right", value: "right" },
          { label: "Down", value: "down" },
          { label: "Left", value: "left" },
        ]}
      />
      <div className="relative h-80 rounded-sm border border-border bg-muted">
        <SpeedDial
          className={anchor}
          label="Create"
          direction={direction}
          actions={[
            { label: "Copy", icon: Copy, onSelect: () => setLast("Copied.") },
            { label: "Save", icon: Save, onSelect: () => setLast("Saved.") },
            { label: "Print", icon: Printer, onSelect: () => setLast("Sent to the printer.") },
          ]}
        />
      </div>
      <span role="status" className="text-[13px] text-text-3">
        {last}
      </span>
    </div>
  );
}

function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="billing" className="max-w-lg">
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
      <AccordionItem value="tax">
        <AccordionTrigger>Tax details</AccordionTrigger>
        <AccordionContent>The tax id on these invoices is 12-3456789.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function HoverGalleryDemo() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <HoverGallery images={hoverGalleryImages} className="max-w-60" />
      <Card className="max-w-60 overflow-hidden">
        <HoverGallery images={hoverGalleryImages} className="rounded-none" />
        <CardBody>
          <CardTitle className="flex items-baseline justify-between gap-3">
            Color study
            <span className="font-normal text-text-2">$25</span>
          </CardTitle>
          <p className="mt-1 text-[13px] text-text-2">Four generated compositions.</p>
        </CardBody>
      </Card>
    </div>
  );
}

const qrLevelNotes: Record<QrCodeLevel, string> = {
  L: "Recovers 7% of the code. Use it when the print is clean and the code should stay small.",
  M: "Recovers 15% of the code. The usual choice for a link.",
  Q: "Recovers 25% of the code. Use it when the code may be smudged or partly covered.",
  H: "Recovers 30% of the code. Use it when the code may be damaged.",
};

function saveQrCode(value: string, level: QrCodeLevel) {
  let svg: string;
  try {
    svg = qrCodeSvg(value, { level });
  } catch {
    return;
  }
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "qr-code.svg";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function RefreshableQr({ value, level }: { value: string; level: QrCodeLevel }) {
  const [expired, setExpired] = React.useState(true);
  return (
    <div className="flex flex-col items-center gap-2">
      <QrCode
        value={value}
        level={level}
        status={expired ? "expired" : undefined}
        onRefresh={() => setExpired(false)}
      />
      {expired ? null : (
        <Button variant="text" size="sm" onClick={() => setExpired(true)}>
          Expire code
        </Button>
      )}
    </div>
  );
}

function QrCodeDemo() {
  const [value, setValue] = React.useState("https://withy.dev");
  const [level, setLevel] = React.useState<QrCodeLevel>("M");
  const levelLabelId = React.useId();
  const blank = value.trim().length === 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
        <QrCode value={value} level={level} />
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <FormField label="Value">
            <Input value={value} onChange={(event) => setValue(event.target.value)} />
          </FormField>
          <div className="flex flex-col gap-2">
            <span id={levelLabelId} className="text-[13px] font-medium text-text-2">
              Correction level
            </span>
            <SegmentedControl
              aria-labelledby={levelLabelId}
              value={level}
              onValueChange={(next) => {
                if (next === "L" || next === "M" || next === "Q" || next === "H") setLevel(next);
              }}
              options={[
                { label: "L", value: "L" },
                { label: "M", value: "M" },
                { label: "Q", value: "Q" },
                { label: "H", value: "H" },
              ]}
            />
            <Text size="sm" tone="secondary">
              {qrLevelNotes[level]}
            </Text>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton
              color="white"
              size="sm"
              disabled={blank}
              value={() => qrCodeSvg(value, { level })}
            >
              Copy as SVG
            </CopyButton>
            <Button
              color="white"
              size="sm"
              disabled={blank}
              onClick={() => saveQrCode(value, level)}
            >
              Save as file
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col items-center gap-4">
          <Text size="sm" weight="medium" tone="heading">
            With a link
          </Text>
          <QrCode value={value} level={level} />
          <div className="flex w-full max-w-sm items-end gap-2">
            <FormField label="Link" className="min-w-0 flex-1">
              <Input readOnly value={value} />
            </FormField>
            <CopyButton color="white" size="sm" disabled={blank} value={value}>
              Copy
            </CopyButton>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Text size="sm" weight="medium" tone="heading">
            Share a profile
          </Text>
          <Card className="w-full max-w-sm">
            <CardBody className="flex flex-col items-center gap-4 text-center">
              <Avatar initials="AC" aria-label="Avery Chen" />
              <CardTitle>Avery Chen</CardTitle>
              <QrCode value={value} level={level} label="Avery Chen profile" />
              <Text tone="secondary">Share this code so people can open your profile.</Text>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:col-span-2">
          <Text size="sm" weight="medium" tone="heading">
            On a card
          </Text>
          <Card className="max-w-sm">
            <CardBody className="flex flex-col items-start gap-4">
              <div className="flex w-full justify-center rounded-sm bg-brand p-4">
                <QrCode
                  value={value}
                  level={level}
                  className="border-0 bg-transparent text-white"
                />
              </div>
              <CardTitle>Start listening instantly</CardTitle>
              <Text>Use your phone&apos;s camera to scan the QR code and open the app.</Text>
              <Button color="white" size="sm">
                Learn about QR codes
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Text size="sm" weight="medium" tone="heading">
          After a scan
        </Text>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col items-center gap-2">
            <QrCode value={value} level={level} status="loading" />
            <Text size="sm" tone="secondary">
              Loading
            </Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <QrCode value={value} level={level} status="success" />
            <Text size="sm" tone="secondary">
              Scanned
            </Text>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RefreshableQr value={value} level={level} />
            <Text size="sm" tone="secondary">
              Expired
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

const trackerLegend = [
  { label: "Operational", className: "size-2.5 rounded-xs bg-success" },
  { label: "Maintenance", className: "size-2.5 rounded-xs bg-info" },
  { label: "Degraded", className: "size-2.5 rounded-xs bg-warning" },
  { label: "Down", className: "size-2.5 rounded-xs bg-danger" },
  { label: "No data", className: "size-2.5 rounded-xs bg-muted" },
];

function TrackerDemo() {
  const uptime = uptimeTrackerSample();
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Text size="sm" weight="medium" tone="heading">
          API uptime
        </Text>
        <Tracker label="API uptime" data={uptime} />
        <ul className="flex flex-wrap gap-4">
          {trackerLegend.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-[13px] text-text-2">
              <span aria-hidden className={item.className} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <Text size="sm" weight="medium" tone="heading">
          Hover effect
        </Text>
        <Tracker label="Checkout uptime" data={uptime} hoverEffect />
      </div>
    </div>
  );
}

export const moleculeDocs = [
  {
    slug: "accordion",
    name: "Accordion",
    category: "Molecules",
    description:
      "An accordion opens and closes sections of related content. One section can stay open, or several can be open at once.",
    imports: ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"],
    code: `<Accordion type="single" collapsible defaultValue="billing">
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
  <AccordionItem value="tax">
    <AccordionTrigger>Tax details</AccordionTrigger>
    <AccordionContent>The tax id on these invoices is 12-3456789.</AccordionContent>
  </AccordionItem>
</Accordion>`,
    Demo: AccordionDemo,
  },
  {
    slug: "alert",
    name: "Alert",
    category: "Molecules",
    description:
      "An alert reports a condition next to the region it affects. It stays until the condition changes.",
    imports: ["Alert", "Button"],
    code: `<Alert color="success" title="Invoice sent">
  Ada received a copy.
</Alert>
<Alert color="info" title="Payment is processing">
  The bank has not confirmed this invoice yet.
</Alert>
<Alert
  color="warning"
  title="Invoices are unavailable"
  actions={<Button variant="outlined" size="sm">Try again</Button>}
>
  The list could not be loaded. The rest of this page still works.
</Alert>
<Alert color="danger" title="Payment failed">
  The card was declined. Try another card.
</Alert>`,
    Demo: () => (
      <div className="flex max-w-lg flex-col gap-3">
        <Alert color="success" title="Invoice sent">
          Ada received a copy.
        </Alert>
        <Alert color="info" title="Payment is processing">
          The bank has not confirmed this invoice yet.
        </Alert>
        <Alert
          color="warning"
          title="Invoices are unavailable"
          actions={
            <Button variant="outlined" size="sm">
              Try again
            </Button>
          }
        >
          The list could not be loaded. The rest of this page still works.
        </Alert>
        <Alert color="danger" title="Payment failed">
          The card was declined. Try another card.
        </Alert>
      </div>
    ),
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    category: "Molecules",
    description:
      "A breadcrumb shows where a page sits, and links back up. The last item is the page.",
    imports: ["Breadcrumb"],
    code: `<Breadcrumb
  items={[
    { label: "Billing", href: "/billing" },
    { label: "Invoices", href: "/billing/invoices" },
    { label: "#1048" },
  ]}
/>`,
    Demo: () => (
      <Breadcrumb
        items={[
          { label: "Billing", href: "#billing" },
          { label: "Invoices", href: "#invoices" },
          { label: "#1048" },
        ]}
      />
    ),
  },
  {
    slug: "callout",
    name: "Callout",
    category: "Molecules",
    description:
      "A callout points out information that helps with the task on the page. It can carry one action.",
    imports: ["Button", "Callout"],
    code: `<Callout color="info" title="Exports run overnight" icon={<Info />}>
  Large reports are ready by 6:00 the next morning.
</Callout>`,
    Demo: () => (
      <Callout
        color="info"
        title="Exports run overnight"
        icon={<Info />}
        className="max-w-lg"
        action={
          <Button size="sm" color="white">
            Schedule export
          </Button>
        }
      >
        Large reports are ready by 6:00 the next morning.
      </Callout>
    ),
  },
  {
    slug: "checkbox-field",
    name: "Checkbox field",
    category: "Molecules",
    description: "A checkbox with its label and an optional description.",
    imports: ["CheckboxField"],
    code: `<CheckboxField label="Remember me" defaultChecked />
<CheckboxField
  label="Send a copy to billing"
  description="billing@withy.dev gets every invoice."
/>`,
    Demo: () => (
      <div className="flex flex-col gap-3">
        <CheckboxField label="Remember me" defaultChecked />
        <CheckboxField
          label="Send a copy to billing"
          description="billing@withy.dev gets every invoice."
        />
      </div>
    ),
  },
  {
    slug: "chip-picker",
    name: "Chip picker",
    category: "Molecules",
    description:
      "A chip picker selects several options and shows them as removable chips. Search the list, and optionally create a new option.",
    imports: ["ChipPicker", "FormField"],
    code: `<FormField label="Topics">
  <ChipPicker options={tags} value={topics} onValueChange={setTopics} onCreate={addTag} />
</FormField>`,
    Demo: ChipPickerDemo,
  },
  {
    slug: "code",
    name: "Code",
    category: "Molecules",
    description:
      "Code sets a short token inline. A code block shows a longer snippet on a terminal background, with syntax color and a copy button.",
    imports: ["Code", "CodeBlock"],
    code: `Space cards with <Code>gap-2.5</Code>.
<CodeBlock label="tsx" code={snippet} />`,
    Demo: () => (
      <div className="flex flex-col gap-3">
        <p className="text-[13px] text-text-2">
          Space cards with <Code>gap-2.5</Code>.
        </p>
        <CodeBlock
          label="tsx"
          code={`import { Button } from "withy-ui";

export function Save() {
  // Writes the draft, then closes the form.
  return <Button type="submit">Save changes</Button>;
}`}
        />
      </div>
    ),
  },
  {
    slug: "color-picker",
    name: "Color picker",
    category: "Molecules",
    description:
      "A color picker chooses one color. The value is a CSS color, such as #0e7484, rgb(), or hsl().",
    imports: ["ColorPicker", "FormField"],
    code: `<FormField label="Brand color">
  <ColorPicker value={color} onValueChange={setColor} />
</FormField>`,
    Demo: ColorPickerDemo,
  },
  {
    slug: "combobox",
    name: "Combobox",
    category: "Molecules",
    description: "A combobox picks one option from a long list that the person can search.",
    imports: ["Combobox", "FormField"],
    code: `<FormField label="Country">
  <Combobox options={countries} value={country} onValueChange={setCountry} />
</FormField>`,
    Demo: ComboboxDemo,
  },
  {
    slug: "context-menu",
    name: "Context menu",
    category: "Molecules",
    description:
      "A context menu lists actions on right click or long press. Name each item with a verb.",
    imports: [
      "ContextMenu",
      "ContextMenuCheckboxItem",
      "ContextMenuContent",
      "ContextMenuGroup",
      "ContextMenuItem",
      "ContextMenuLabel",
      "ContextMenuPortal",
      "ContextMenuRadioGroup",
      "ContextMenuRadioItem",
      "ContextMenuSeparator",
      "ContextMenuShortcut",
      "ContextMenuSub",
      "ContextMenuSubContent",
      "ContextMenuSubTrigger",
      "ContextMenuTrigger",
    ],
    code: `<ContextMenu>
  <ContextMenuTrigger asChild>
    <div className="flex min-h-28 items-center justify-center rounded-sm border border-dashed border-border px-4 text-[13px] text-text-2">
      Right click here
    </div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuLabel>Invoice #1048</ContextMenuLabel>
    <ContextMenuItem onSelect={open}>
      Open invoice
      <ContextMenuShortcut>⌘O</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem onSelect={duplicate}>Duplicate invoice</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem className="text-danger" onSelect={confirmDelete}>
      Delete invoice
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    Demo: ContextMenuDemo,
  },
  {
    slug: "copy-button",
    name: "Copy button",
    category: "Molecules",
    description:
      "A copy button puts a value on the clipboard, then says Copied. If the copy fails, it says so.",
    imports: ["CopyButton"],
    code: `<CopyButton value={reportUrl}>Copy report link</CopyButton>`,
    Demo: () => (
      <CopyButton size="sm" value="https://withy.example/reports/weekly-revenue">
        Copy report link
      </CopyButton>
    ),
  },
  {
    slug: "credit-card-input",
    name: "Credit card input",
    category: "Molecules",
    description:
      "A credit card input takes the number, name, expiry, and security code. The card changes with the brand. detectCardBrand reads that brand from the digits.",
    imports: ["CreditCardInput", "detectCardBrand"],
    code: `<CreditCardInput value={card} onValueChange={setCard} onBrandChange={setBrand} />`,
    Demo: CreditCardInputDemo,
  },
  {
    slug: "date-picker",
    name: "Date picker",
    category: "Molecules",
    description: "A date picker picks one day. Values are ISO dates, such as 2026-10-12.",
    imports: ["DatePicker", "FormField"],
    code: `<FormField label="Due date">
  <DatePicker value={due} onValueChange={setDue} min="2026-01-01" />
</FormField>`,
    Demo: DatePickerDemo,
  },
  {
    slug: "date-range-picker",
    name: "Date range picker",
    category: "Molecules",
    description:
      "A date range picker picks a start and an end day, with presets for common ranges.",
    imports: ["DateRangePicker", "FormField"],
    code: `<FormField label="Report period">
  <DateRangePicker value={range} onValueChange={setRange} />
</FormField>`,
    Demo: DateRangeDemo,
  },
  {
    slug: "empty-state",
    name: "Empty state",
    category: "Molecules",
    description:
      "An empty state says what a region is for when it has nothing to show, and offers the first action.",
    imports: ["Button", "EmptyState"],
    code: `<EmptyState
  icon={FileText}
  title="No reports yet"
  description="Create a report to see revenue by week."
  action={<Button size="sm">Create report</Button>}
/>`,
    Demo: () => (
      <EmptyState
        icon={FileText}
        title="No reports yet"
        description="Create a report to see revenue by week."
        className="max-w-md"
        action={<Button size="sm">Create report</Button>}
      />
    ),
  },
  {
    slug: "fieldset",
    name: "Fieldset",
    category: "Molecules",
    description: "A fieldset groups related choices under one visible legend.",
    imports: ["CheckboxField", "Fieldset"],
    code: `<Fieldset legend="Notify me about" hint="We send at most one email a day.">
  <CheckboxField label="New invoices" defaultChecked />
  <CheckboxField label="Failed payments" />
</Fieldset>`,
    Demo: () => (
      <Fieldset legend="Notify me about" hint="We send at most one email a day.">
        <CheckboxField label="New invoices" defaultChecked />
        <CheckboxField label="Failed payments" defaultChecked />
        <CheckboxField label="Weekly summary" />
      </Fieldset>
    ),
  },
  {
    slug: "file-input",
    name: "File input",
    category: "Molecules",
    description: "A file input picks one file.",
    imports: ["FileInput", "FormField"],
    code: `<FormField label="Avatar" hint="PNG or JPG, up to 2 MB.">
  <FileInput accept="image/png,image/jpeg" onFileChange={setFile} />
</FormField>`,
    Demo: () => (
      <FormField label="Avatar" hint="PNG or JPG, up to 2 MB." className="max-w-sm">
        <FileInput accept="image/png,image/jpeg" />
      </FormField>
    ),
  },
  {
    slug: "file-uploader",
    name: "File uploader",
    category: "Molecules",
    description:
      "A file uploader takes several files by drop or browse. Each file shows its size, and a progress bar while it uploads.",
    imports: ["FileUploader", "FormField"],
    code: `<FormField label="Receipts" hint="PDFs or images.">
  <FileUploader accept="application/pdf,image/*" onFilesChange={setFiles} />
</FormField>`,
    Demo: () => (
      <FormField label="Receipts" hint="PDFs or images." className="max-w-lg">
        <FileUploader accept="application/pdf,image/*" />
      </FormField>
    ),
  },
  {
    slug: "form-field",
    name: "Form field",
    category: "Molecules",
    description:
      "A form field gives a control its visible label, a hint, and an error, and connects them for assistive tech.",
    imports: ["FormField", "Input", "Select"],
    code: `<FormField label="Owner" error="Enter a name between 2 and 20 characters.">
  <Input value={owner} onChange={(event) => setOwner(event.target.value)} />
</FormField>`,
    Demo: () => (
      <div className="flex max-w-sm flex-col gap-4">
        <FormField label="Report name" hint="Shown on the report cover.">
          <Input defaultValue="Weekly revenue" />
        </FormField>
        <FormField label="Owner" error="Enter a name between 2 and 20 characters.">
          <Input defaultValue="A" />
        </FormField>
        <FormField label="Status">
          <Select defaultValue="draft" options={statusOptions} />
        </FormField>
      </div>
    ),
  },
  {
    slug: "hover-gallery",
    name: "Hover gallery",
    category: "Molecules",
    description:
      "A hover gallery shows the first image by default. Move the pointer horizontally to reveal the others. Use it on product cards, portfolios, and image galleries, with up to ten images.",
    imports: ["HoverGallery"],
    code: `<HoverGallery
  className="max-w-60"
  images={[
    { src: "/study-1.webp", alt: "Color study 1" },
    { src: "/study-2.webp", alt: "Color study 2" },
    { src: "/study-3.webp", alt: "Color study 3" },
    { src: "/study-4.webp", alt: "Color study 4" },
  ]}
/>`,
    Demo: HoverGalleryDemo,
  },
  {
    slug: "icon-button",
    name: "Icon button",
    category: "Molecules",
    description:
      "An icon button runs an action from an icon alone. Its label is the accessible name, and the tooltip shows it.",
    imports: ["IconButton"],
    code: `import { Bell } from "lucide-react";

<IconButton icon={Bell} label="Notifications" tooltip />`,
    Demo: () => (
      <div className="flex items-center gap-2">
        <IconButton icon={Bell} label="Notifications" tooltip />
        <IconButton icon={Settings} label="Settings" tooltip />
        <IconButton
          icon={Trash2}
          label="Delete invoice"
          color="danger"
          variant="outlined"
          tooltip
        />
      </div>
    ),
  },
  {
    slug: "inline-message",
    name: "Inline message",
    category: "Molecules",
    description:
      "An inline message reports a result next to the thing it describes, such as Changes saved after a form.",
    imports: ["InlineMessage"],
    code: `<InlineMessage tone="success">Changes saved.</InlineMessage>`,
    Demo: () => (
      <div className="flex flex-col gap-2">
        <InlineMessage tone="success">Changes saved.</InlineMessage>
        <InlineMessage tone="info">Exports finish in about a minute.</InlineMessage>
        <InlineMessage tone="warning">Your trial ends in 3 days.</InlineMessage>
        <InlineMessage tone="danger">Enter a card number with 16 digits.</InlineMessage>
      </div>
    ),
  },
  {
    slug: "input-group",
    name: "Input group",
    category: "Molecules",
    description: "An input group adds a fixed prefix or suffix to a field.",
    imports: ["FormField", "Input", "InputGroup"],
    code: `<FormField label="Amount">
  <InputGroup prefix="$" suffix="USD">
    <Input inputMode="decimal" />
  </InputGroup>
</FormField>`,
    Demo: () => (
      <div className="flex max-w-sm flex-col gap-4">
        <FormField label="Handle">
          <InputGroup prefix="@">
            <Input defaultValue="ivy" />
          </InputGroup>
        </FormField>
        <FormField label="Amount">
          <InputGroup prefix="$" suffix="USD">
            <Input inputMode="decimal" defaultValue="1,240.00" />
          </InputGroup>
        </FormField>
      </div>
    ),
  },
  {
    slug: "input-otp",
    name: "Input OTP",
    category: "Molecules",
    description:
      "An input OTP takes a one-time code, one character per slot. Paste and autofill fill the whole code.",
    imports: ["FormField", "InputOtp"],
    code: `<FormField label="Verification code" hint="Enter the 6-digit code from your email.">
  <InputOtp />
</FormField>`,
    Demo: InputOtpDemo,
  },
  {
    slug: "logo",
    name: "Logo",
    category: "Molecules",
    description:
      "A logo shows the product mark and name, and links home. Pass your own name and mark.",
    imports: ["Logo"],
    code: `<Logo name="acme" mark={<AcmeMark />} href="/" />`,
    Demo: () => (
      <div className="flex flex-wrap items-center gap-6">
        <Logo href="#home" />
        <Logo href="#home" name="acme" mark={<Icon icon={Sparkles} size="lg" />} />
        <span className="rounded-sm bg-brand px-4 py-3">
          <Logo href="#home" inverse />
        </span>
      </div>
    ),
  },
  {
    slug: "media",
    name: "Media",
    category: "Molecules",
    description: "Media places an avatar or an image beside text that can truncate.",
    imports: ["Avatar", "Media", "MediaBody", "Truncate"],
    code: `<Media className="w-56">
  <Avatar initials="IC" />
  <MediaBody>
    <Truncate size="sm" weight="medium" tone="heading">
      Ivy Calder, Northwind Trading
    </Truncate>
    <Truncate size="xs" tone="muted">ivy.calder@northwind.example</Truncate>
  </MediaBody>
</Media>`,
    Demo: () => (
      <Media className="w-56">
        <Avatar initials="IC" />
        <MediaBody>
          <Truncate size="sm" weight="medium" tone="heading">
            Ivy Calder, Northwind Trading
          </Truncate>
          <Truncate size="xs" tone="muted">
            ivy.calder@northwind.example
          </Truncate>
        </MediaBody>
        <Badge variant="muted" color="secondary">
          Admin
        </Badge>
      </Media>
    ),
  },
  {
    slug: "meter-list",
    name: "Meter list",
    category: "Molecules",
    description: "A meter list compares a few values as labeled bars.",
    imports: ["MeterList"],
    code: `<MeterList items={[{ label: "Direct", value: "44%", percent: 44 }]} />`,
    Demo: () => (
      <div className="max-w-md">
        <MeterList
          items={[
            { label: "Direct", value: "44%", percent: 44 },
            { label: "Organic", value: "31%", percent: 31 },
            { label: "Social", value: "25%", percent: 25 },
          ]}
        />
      </div>
    ),
  },
  {
    slug: "nav-item",
    name: "Nav item",
    category: "Molecules",
    description: "A nav item is one link in a sidebar. It marks the current page.",
    imports: ["NavItem"],
    code: `<NavItem href="/invoices" label="Invoices" icon={<FileText />} active />`,
    Demo: () => (
      <nav aria-label="Sample sidebar" className="flex w-56 flex-col gap-0.5">
        <NavItem href="#overview" label="Overview" icon={<LayoutDashboard />} active />
        <NavItem href="#invoices" label="Invoices" icon={<FileText />} />
        <NavItem href="#settings" label="Settings" icon={<Settings />} />
      </nav>
    ),
  },
  {
    slug: "number-input",
    name: "Number input",
    category: "Molecules",
    description:
      "A number input takes a number by typing or with its stepper. Arrow keys change it by one step.",
    imports: ["FormField", "NumberInput"],
    code: `<FormField label="Seats" hint="Between 1 and 20.">
  <NumberInput min={1} max={20} defaultValue={2} />
</FormField>`,
    Demo: NumberInputDemo,
  },
  {
    slug: "pagination",
    name: "Pagination",
    category: "Molecules",
    description: "Pagination moves through the pages of a long list. Long ranges fold into gaps.",
    imports: ["Pagination"],
    code: `<Pagination page={page} pages={12} onPageChange={setPage} />`,
    Demo: PaginationDemo,
  },
  {
    slug: "password-input",
    name: "Password input",
    category: "Molecules",
    description: "A password input can show or hide what was typed.",
    imports: ["FormField", "PasswordInput"],
    code: `<FormField label="New password" hint="Use at least 8 characters.">
  <PasswordInput autoComplete="new-password" />
</FormField>`,
    Demo: () => (
      <FormField label="New password" hint="Use at least 8 characters." className="max-w-sm">
        <PasswordInput autoComplete="new-password" />
      </FormField>
    ),
  },
  {
    slug: "popup",
    name: "Popup",
    category: "Molecules",
    description:
      "A popup floats a small panel next to its trigger, for a note, a filter, or a picker.",
    imports: ["Button", "Popup", "PopupClose", "PopupContent", "PopupTrigger"],
    code: `<Popup>
  <PopupTrigger asChild>
    <Button color="white" size="sm">Show totals</Button>
  </PopupTrigger>
  <PopupContent className="w-60">
    48 invoices, $62,400 collected.
    <PopupClose asChild>
      <Button variant="text" size="sm">Close</Button>
    </PopupClose>
  </PopupContent>
</Popup>`,
    Demo: () => (
      <Popup>
        <PopupTrigger asChild>
          <Button color="white" size="sm">
            Show totals
          </Button>
        </PopupTrigger>
        <PopupContent className="w-60">
          <p className="text-[13px] font-medium text-heading">March totals</p>
          <p className="mt-1 text-[13px] text-text-3">48 invoices, $62,400 collected.</p>
        </PopupContent>
      </Popup>
    ),
  },
  {
    slug: "popup-menu",
    name: "Popup menu",
    category: "Molecules",
    description: "A popup menu lists actions behind a button. Name each item with a verb.",
    imports: [
      "Button",
      "PopupMenu",
      "PopupMenuContent",
      "PopupMenuItem",
      "PopupMenuLabel",
      "PopupMenuSeparator",
      "PopupMenuTrigger",
    ],
    code: `<PopupMenu>
  <PopupMenuTrigger asChild>
    <Button color="white" size="sm">Invoice actions</Button>
  </PopupMenuTrigger>
  <PopupMenuContent align="start">
    <PopupMenuLabel>Invoice #1048</PopupMenuLabel>
    <PopupMenuItem onSelect={send}>Send invoice</PopupMenuItem>
    <PopupMenuSeparator />
    <PopupMenuItem className="text-danger" onSelect={confirmDelete}>Delete invoice</PopupMenuItem>
  </PopupMenuContent>
</PopupMenu>`,
    Demo: PopupMenuDemo,
  },
  {
    slug: "qr-code",
    name: "QR code",
    category: "Molecules",
    description:
      "A QR code turns a link or a short text into a code a phone camera can scan. Choose how much damage it can recover from, and cover it while it loads, after a scan, or when it expires.",
    imports: ["CopyButton", "QrCode", "qrCodeSvg"],
    code: `<QrCode value="https://withy.dev" level="M" />

<CopyButton value={() => qrCodeSvg("https://withy.dev", { level: "M" })}>
  Copy as SVG
</CopyButton>

<QrCode value="https://withy.dev" status="expired" onRefresh={refresh} />`,
    Demo: QrCodeDemo,
  },
  {
    slug: "radio-field",
    name: "Radio field",
    category: "Molecules",
    description:
      "A radio with its label and an optional description. Place it inside a radio group.",
    imports: ["RadioField", "RadioGroup"],
    code: `<RadioGroup aria-label="Plan" defaultValue="team">
  <RadioField value="starter" label="Starter" description="One workspace." />
  <RadioField value="team" label="Team" description="Up to 20 people." />
</RadioGroup>`,
    Demo: () => (
      <RadioGroup aria-label="Plan" defaultValue="team">
        <RadioField value="starter" label="Starter" description="One workspace." />
        <RadioField value="team" label="Team" description="Up to 20 people." />
      </RadioGroup>
    ),
  },
  {
    slug: "search-input",
    name: "Search input",
    category: "Molecules",
    description: "A search input finds things by name. Its label says what is being searched.",
    imports: ["FormField", "SearchInput"],
    code: `<FormField label="Search reports">
  <SearchInput
    value={query}
    onChange={(event) => setQuery(event.target.value)}
    onClear={() => setQuery("")}
  />
</FormField>`,
    Demo: SearchInputDemo,
  },
  {
    slug: "section-nav",
    name: "Section nav",
    category: "Molecules",
    description:
      "A section nav moves between the sections of one area. It runs across on a narrow screen and down from 1024px.",
    imports: ["SectionNav"],
    code: `<SectionNav
  label="Account"
  current={pathname}
  items={[
    { label: "Profile", href: "/account/profile" },
    { label: "Security", href: "/account/security" },
  ]}
/>`,
    Demo: () => (
      <SectionNav
        label="Account"
        current="#profile"
        className="lg:static"
        items={[
          { label: "Profile", href: "#profile" },
          { label: "Security", href: "#security" },
          { label: "Billing", href: "#billing" },
        ]}
      />
    ),
  },
  {
    slug: "segmented-control",
    name: "Segmented control",
    category: "Molecules",
    description:
      "A segmented control picks one of a few views or filters, and marks the current one. It applies right away.",
    imports: ["SegmentedControl"],
    code: `<SegmentedControl
  aria-label="Invoice view"
  value={view}
  onValueChange={setView}
  options={[
    { label: "Table", value: "table", icon: Table2 },
    { label: "Board", value: "board", icon: LayoutGrid },
  ]}
/>`,
    Demo: SegmentedControlDemo,
  },
  {
    slug: "segmented-meter",
    name: "Segmented meter",
    category: "Molecules",
    description: "A segmented meter shows the parts of a whole, with a legend and percentages.",
    imports: ["SegmentedMeter"],
    code: `<SegmentedMeter
  label="Ticket status"
  segments={[
    { label: "Open", value: 42, color: "primary" },
    { label: "Solved", value: 64, color: "success" },
  ]}
/>`,
    Demo: () => (
      <SegmentedMeter
        className="max-w-md"
        label="Ticket status"
        segments={[
          { label: "Open", value: 42, color: "primary" },
          { label: "Pending", value: 18, color: "warning" },
          { label: "Solved", value: 64, color: "success" },
        ]}
      />
    ),
  },
  {
    slug: "select",
    name: "Select",
    category: "Molecules",
    description: "A select picks one option from a short list.",
    imports: ["FormField", "Select"],
    code: `<FormField label="Status">
  <Select value={status} onValueChange={setStatus} options={statusOptions} />
</FormField>`,
    Demo: () => (
      <FormField label="Status" className="max-w-xs">
        <Select defaultValue="draft" options={statusOptions} />
      </FormField>
    ),
  },
  {
    slug: "select-picker",
    name: "Select picker",
    category: "Molecules",
    description: "A select picker searches its options, and can create a new one.",
    imports: ["FormField", "SelectPicker"],
    code: `<FormField label="Tag">
  <SelectPicker options={tags} value={tag} onValueChange={setTag} onCreate={addTag} />
</FormField>`,
    Demo: SelectPickerDemo,
  },
  {
    slug: "speed-dial",
    name: "Speed dial",
    category: "Molecules",
    description:
      "A speed dial opens three to six related actions from one button. They fan out up, down, left, or right, and each action keeps its label in view.",
    imports: ["SpeedDial"],
    code: `import { Copy, Printer, Save } from "lucide-react";

<SpeedDial
  className="fixed right-5 bottom-5"
  label="Create"
  actions={[
    { label: "Copy", icon: Copy, onSelect: copyPage },
    { label: "Save", icon: Save, onSelect: savePage },
    { label: "Print", icon: Printer, onSelect: printPage },
  ]}
/>`,
    Demo: SpeedDialDemo,
  },
  {
    slug: "stat",
    name: "Stat",
    category: "Molecules",
    description: "A stat shows a figure with its label and how it changed.",
    imports: ["Stat"],
    code: `<Stat
  title="Conversion rate"
  value="0.81%"
  change={{ value: "1.2%", direction: "up", hint: "than last week" }}
/>`,
    Demo: () => (
      <Stat
        title="Conversion rate"
        value="0.81%"
        change={{ value: "1.2%", direction: "up", hint: "than last week" }}
      />
    ),
  },
  {
    slug: "stepper",
    name: "Stepper",
    category: "Molecules",
    description:
      "A stepper shows progress through an ordered task. Steps can sit beside or under the marker, run down the page, or shrink to text, dots, or a progress bar.",
    imports: ["Stepper"],
    code: `<Stepper
  label="Create invoice"
  activeStep={step}
  onStepChange={setStep}
  steps={[
    { label: "Customer", description: "Who the invoice is for." },
    { label: "Line items", description: "What you are billing." },
    { label: "Review", description: "Check the total, then send it." },
  ]}
/>`,
    Demo: StepperDemo,
  },
  {
    slug: "switch-field",
    name: "Switch field",
    category: "Molecules",
    description:
      "A switch with its label and description, for a setting that saves when it changes. Keep it out of forms with a save button.",
    imports: ["SwitchField"],
    code: `<SwitchField
  label="Email alerts"
  description="Saves as soon as you change it."
  checked={alerts}
  onCheckedChange={setAlerts}
/>`,
    Demo: SwitchFieldDemo,
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "Molecules",
    description: "Tabs switch between panels of related content in the same place.",
    imports: ["Tabs", "TabsContent", "TabsList", "TabsTrigger"],
    code: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="payments">Payments</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="payments">…</TabsContent>
</Tabs>`,
    Demo: () => (
      <Tabs defaultValue="overview" className="max-w-lg">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-[13px] text-text-2">Invoice #1048 is open and due on March 30.</p>
        </TabsContent>
        <TabsContent value="payments">
          <p className="text-[13px] text-text-2">No payments yet.</p>
        </TabsContent>
        <TabsContent value="activity">
          <p className="text-[13px] text-text-2">Sent to Northwind on March 2.</p>
        </TabsContent>
      </Tabs>
    ),
  },
  {
    slug: "theme-switcher",
    name: "Theme switcher",
    category: "Molecules",
    description:
      "A switch for the light or dark skin. A sun marks light and a moon marks dark. The choice is remembered.",
    imports: ["ThemeSwitcher"],
    code: `<ThemeSwitcher />`,
    Demo: () => <ThemeSwitcher />,
  },
  {
    slug: "time-picker",
    name: "Time picker",
    category: "Molecules",
    description: "A time picker picks an hour and a minute, in 5-minute steps. Values are 24-hour.",
    imports: ["FormField", "TimePicker"],
    code: `<FormField label="Start time">
  <TimePicker value={time} onValueChange={setTime} />
</FormField>`,
    Demo: TimePickerDemo,
  },
  {
    slug: "toast",
    name: "Toast",
    category: "Molecules",
    description:
      "A toast reports a change when the person may be looking elsewhere. It can offer Undo for a reversible remove.",
    imports: ["useToast"],
    code: `const { toast } = useToast();

toast({
  title: "Invoice #1049 removed from this report",
  description: "It is still in Invoices.",
  action: { label: "Undo", onClick: restore },
});`,
    Demo: ToastDemo,
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "Molecules",
    description:
      "A tooltip adds a short hint on hover or focus. It is never the only name for a control.",
    imports: ["Button", "Tooltip", "TooltipContent", "TooltipTrigger"],
    code: `<Tooltip>
  <TooltipTrigger asChild>
    <Button color="white" size="sm">Export</Button>
  </TooltipTrigger>
  <TooltipContent>Exports the visible rows as CSV.</TooltipContent>
</Tooltip>`,
    Demo: () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button color="white" size="sm">
            Export
          </Button>
        </TooltipTrigger>
        <TooltipContent>Exports the visible rows as CSV.</TooltipContent>
      </Tooltip>
    ),
  },
  {
    slug: "tracker",
    name: "Tracker",
    category: "Molecules",
    description:
      "A tracker shows a sequence of statuses, one block per moment, such as daily uptime. Hover or focus a block to read its status.",
    imports: ["Tracker"],
    code: `<Tracker
  label="API uptime"
  hoverEffect
  data={[
    { color: "success", tooltip: "Operational" },
    { color: "danger", tooltip: "Down for 14 minutes" },
    { color: "warning", tooltip: "Degraded response time" },
    { color: "neutral", tooltip: "No data" },
  ]}
/>`,
    Demo: TrackerDemo,
  },
  {
    slug: "transfer-list",
    name: "Transfer list",
    category: "Molecules",
    description:
      "A transfer list moves one or more items between two lists. Check the items to move, or move every enabled item.",
    imports: ["FormField", "TransferList"],
    code: `<FormField label="Report columns" hint="Chosen columns appear in this order.">
  <TransferList items={columns} value={chosen} onValueChange={setChosen} />
</FormField>`,
    Demo: TransferListDemo,
  },
  {
    slug: "truncate",
    name: "Truncate",
    category: "Molecules",
    description:
      "Truncate shortens overflowing text with an ellipsis. A tooltip shows the full string when the text is cut off.",
    imports: ["Truncate"],
    code: `<div className="flex w-48 flex-col gap-2">
  <Truncate weight="medium" tone="heading">
    Northwind Trading Company, Limited
  </Truncate>
  <Truncate lines={2} size="sm" tone="secondary">
    Invoices for this account stay on this card until they are paid or written off.
  </Truncate>
</div>`,
    Demo: () => (
      <div className="flex w-48 flex-col gap-2">
        <Truncate weight="medium" tone="heading">
          Northwind Trading Company, Limited
        </Truncate>
        <Truncate lines={2} size="sm" tone="secondary">
          Invoices for this account stay on this card until they are paid or written off.
        </Truncate>
      </div>
    ),
  },
] as const satisfies readonly ComponentDoc[];
