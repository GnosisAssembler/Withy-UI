import * as React from "react";
import { LayoutGrid, Table2 } from "lucide-react";
import { Button } from "../atoms/button";
import { Eyebrow } from "../atoms/eyebrow";
import { Input } from "../atoms/input";
import { Text } from "../atoms/text";
import { Alert } from "../molecules/alert";
import { SwitchField } from "../molecules/choice-field";
import { CopyButton } from "../molecules/copy-button";
import { FormField } from "../molecules/form-field";
import { InlineMessage } from "../molecules/inline-message";
import { SearchInput } from "../molecules/search-input";
import { SectionNav } from "../molecules/section-nav";
import { SegmentedControl } from "../molecules/segmented-control";
import { useToast } from "../molecules/toast";
import { Card, CardBody } from "../organisms/card";
import { Dialog } from "../organisms/dialog";
import { PageHeader } from "../organisms/page-header";
import { DashboardShell } from "./dashboard-shell";
import { Practice } from "./foundations";

export const scenarioSections = [
  {
    slug: "copy",
    label: "Copy",
    description: "Copy puts existing content on the clipboard so it can be pasted somewhere else.",
  },
  {
    slug: "create",
    label: "Create",
    description: "Create makes a new thing. The action names what will exist when it finishes.",
  },
  {
    slug: "customize",
    label: "Customize",
    description: "Customize changes a personal preference. It does not change the shared record.",
  },
  {
    slug: "delegate",
    label: "Delegate",
    description:
      "Delegate hands a piece of work to someone else, and says what they are allowed to do.",
  },
  {
    slug: "delete",
    label: "Delete",
    description:
      "Delete removes a thing. The amount of friction matches how hard the mistake is to undo.",
  },
  {
    slug: "edit",
    label: "Edit",
    description:
      "Edit changes a thing that already exists. The original stays until the change is saved.",
  },
  {
    slug: "filter",
    label: "Filter",
    description: "Filter narrows a collection that is already on the screen.",
  },
  {
    slug: "search",
    label: "Search",
    description: "Search finds things that may not be on the screen yet.",
  },
  {
    slug: "view",
    label: "View",
    description: "View changes how the same content is shown. It does not change the content.",
  },
] as const;

export type ScenarioSection = (typeof scenarioSections)[number]["slug"];

type Guide = {
  rules: readonly string[];
  examples: readonly { topic: string; do: string; dont: string }[];
};

export const scenarioGuides = {
  copy: {
    rules: [
      "Name the thing being copied.",
      "After a successful copy, change the button to Copied, then return it.",
      "Keep the person on the same page. Copy does not navigate.",
      "If the copy fails, say so on the button’s control. Leave the original in place.",
    ],
    examples: [
      {
        topic: "Label",
        do: "Copy report link, then Copied.",
        dont: "Click here, with no sign that the link was copied.",
      },
      {
        topic: "Result",
        do: "The report stays open, and the link is on the clipboard.",
        dont: "A new page opens because the person copied a link.",
      },
    ],
  },
  create: {
    rules: [
      "The button names the thing that will be created.",
      "Ask only for the fields that create needs.",
      "When creation finishes, open the new thing.",
      "If creation fails, keep what was typed and say what to fix.",
    ],
    examples: [
      {
        topic: "Action",
        do: "Create report.",
        dont: "Submit, or New.",
      },
      {
        topic: "After",
        do: "The new report opens.",
        dont: "The person returns to a list with no sign of what was created.",
      },
    ],
  },
  customize: {
    rules: [
      "A preference belongs to the person, not to the shared record.",
      "Apply the preference when it changes.",
      "Show the current choice.",
      "Keep preferences out of a form that saves a shared record.",
    ],
    examples: [
      {
        topic: "Scope",
        do: "Compact tables, saved for this person.",
        dont: "A density switch inside the invoice form that saves the invoice.",
      },
      {
        topic: "Feedback",
        do: "The table tightens as soon as the switch changes.",
        dont: "A preference that waits for Save changes.",
      },
    ],
  },
  delegate: {
    rules: [
      "Name the person who receives the work.",
      "Say what they can do.",
      "Confirm a handoff that cannot be taken back.",
      "Leave the record in place so both people can see it.",
    ],
    examples: [
      {
        topic: "Scope",
        do: "Assign the invoice review to Ada.",
        dont: "Share, with no name and no task.",
      },
      {
        topic: "Record",
        do: "The invoice stays, and Ada is listed as the reviewer.",
        dont: "The invoice disappears from the owner’s list.",
      },
    ],
  },
  delete: {
    rules: [
      "Match the friction to the damage. A permanent delete asks first. A reversible remove can offer undo.",
      "Name the thing, and say whether it can come back.",
      "The confirm button repeats the verb: Delete invoice.",
      "Say Remove when the thing still exists somewhere else.",
    ],
    examples: [
      {
        topic: "Wording",
        do: "Delete invoice #1048. This cannot be undone.",
        dont: "Are you sure?",
      },
      {
        topic: "Button",
        do: "Delete invoice.",
        dont: "OK, or Yes.",
      },
    ],
  },
  edit: {
    rules: [
      "Edit the existing thing. Make a copy only when the person asks for one.",
      "Save applies the change. Cancel returns the previous value.",
      "If saving fails, keep the draft and say what to do next.",
      "The button names the change: Save name.",
    ],
    examples: [
      {
        topic: "Target",
        do: "Save name, on the report that is already open.",
        dont: "Create report, when the person is changing the name.",
      },
      {
        topic: "Cancel",
        do: "Cancel restores Weekly revenue.",
        dont: "Cancel leaves the half-typed name in place.",
      },
    ],
  },
  filter: {
    rules: [
      "Filter narrows a collection that is already on the screen.",
      "Show which filter is on, how many items match, and how to clear it.",
      "An empty result names the filter. It does not say the collection is empty.",
      "Keep the filter with the list it changes.",
    ],
    examples: [
      {
        topic: "State",
        do: "Open, 2 of 3 invoices, with Clear.",
        dont: "A shorter list and no sign that a filter is on.",
      },
      {
        topic: "Empty",
        do: "No invoices are Paid.",
        dont: "You have no invoices.",
      },
    ],
  },
  search: {
    rules: [
      "Search finds things that may not be on the screen yet.",
      "The label says what is being searched.",
      "Show the query and the number of matches.",
      "Search and filter stay separate. Filter narrows what is already listed.",
    ],
    examples: [
      {
        topic: "Job",
        do: "Search reports, then open Weekly revenue.",
        dont: "A search box that only hides rows already on the page, with no name.",
      },
      {
        topic: "Empty",
        do: "No reports match “tax”.",
        dont: "No results.",
      },
    ],
  },
  view: {
    rules: [
      "A view changes the presentation. The records stay the same.",
      "Mark the current view.",
      "Keep filters and search when the view changes.",
      "Use a view when the person is choosing how to look, not what to keep.",
    ],
    examples: [
      {
        topic: "Current",
        do: "Table is marked, and Board is the other choice.",
        dont: "Two views with no current one.",
      },
      {
        topic: "Data",
        do: "The same three invoices, shown as a table or a board.",
        dont: "Switching to Board drops the invoices that were filtered.",
      },
    ],
  },
} as const satisfies Record<ScenarioSection, Guide>;

function ScenarioMenu({ current }: { current: ScenarioSection }) {
  return (
    <SectionNav
      label="Scenario patterns"
      current={`/scenarios/${current}`}
      items={scenarioSections.map((item) => ({
        label: item.label,
        href: `/scenarios/${item.slug}`,
      }))}
    />
  );
}

function SectionHeading({ children }: { children: string }) {
  return <Eyebrow as="h2">{children}</Eyebrow>;
}

function Guidance({ section }: { section: ScenarioSection }) {
  const guide: Guide = scenarioGuides[section];
  return (
    <>
      <section className="flex flex-col gap-3">
        <SectionHeading>Rules</SectionHeading>
        <ul className="flex max-w-3xl flex-col gap-2">
          {guide.rules.map((rule) => (
            <li key={rule} className="text-[13px] text-text-2">
              {rule}
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-3">
        <SectionHeading>Examples</SectionHeading>
        <div className="grid gap-3 lg:grid-cols-2">
          {guide.examples.map((example) => (
            <Practice
              key={example.topic}
              topic={example.topic}
              recommendation={example.do}
              avoid={example.dont}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function CopyScenario() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="copy" />
        <section className="flex flex-col items-start gap-3">
          <SectionHeading>In use</SectionHeading>
          <CopyButton size="sm" value="https://withy.example/reports/weekly-revenue">
            Copy report link
          </CopyButton>
        </section>
      </CardBody>
    </Card>
  );
}

function CreateScenario() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="create" />
        <section className="flex max-w-sm flex-col items-start gap-3">
          <SectionHeading>In use</SectionHeading>
          <FormField label="Report name" className="w-full">
            <Input defaultValue="Weekly revenue" />
          </FormField>
          <Button type="button" size="sm">
            Create report
          </Button>
        </section>
      </CardBody>
    </Card>
  );
}

function CustomizeScenario() {
  const [compact, setCompact] = React.useState(false);

  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="customize" />
        <section className="flex max-w-sm flex-col gap-3">
          <SectionHeading>In use</SectionHeading>
          <SwitchField
            label="Compact tables"
            description="Saved for you. Other people keep their own density."
            checked={compact}
            onCheckedChange={setCompact}
            className="rounded-sm border border-border px-3 py-3"
          />
          <Text size="sm" tone="secondary">
            {compact ? "Rows use the compact density." : "Rows use the regular density."}
          </Text>
        </section>
      </CardBody>
    </Card>
  );
}

function DelegateScenario() {
  const [assignee, setAssignee] = React.useState<string | null>(null);

  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="delegate" />
        <section className="flex flex-col items-start gap-3">
          <SectionHeading>In use</SectionHeading>
          <Button type="button" size="sm" onClick={() => setAssignee("Ada")}>
            Assign review to Ada
          </Button>
          {assignee ? (
            <InlineMessage tone="success">Ada can review this invoice.</InlineMessage>
          ) : (
            <Text size="sm" tone="muted">
              No reviewer yet.
            </Text>
          )}
        </section>
      </CardBody>
    </Card>
  );
}

function DeleteScenario() {
  const { toast } = useToast();
  const [deleted, setDeleted] = React.useState(false);
  const [removed, setRemoved] = React.useState(false);

  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="delete" />
        <section className="flex flex-col items-start gap-3">
          <SectionHeading>In use</SectionHeading>
          <div className="flex flex-wrap items-center gap-2">
            {deleted ? (
              <InlineMessage tone="success">Invoice #1048 was deleted.</InlineMessage>
            ) : (
              <Dialog
                tone="danger"
                title="Delete invoice #1048?"
                confirmLabel="Delete invoice"
                onConfirm={() => setDeleted(true)}
                trigger={
                  <Button type="button" size="sm" color="danger">
                    Delete invoice
                  </Button>
                }
              >
                The invoice and its payments are removed. This cannot be undone.
              </Dialog>
            )}
            <Button
              type="button"
              size="sm"
              color="white"
              disabled={removed}
              onClick={() => {
                setRemoved(true);
                toast({
                  title: "Invoice #1049 removed from this report",
                  description: "It is still in Invoices.",
                  action: { label: "Undo", onClick: () => setRemoved(false) },
                });
              }}
            >
              Remove invoice #1049 from report
            </Button>
          </div>
        </section>
      </CardBody>
    </Card>
  );
}

function EditScenario() {
  const original = "Weekly revenue";
  const [value, setValue] = React.useState(original);
  const [draft, setDraft] = React.useState(original);

  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="edit" />
        <section className="flex max-w-sm flex-col items-start gap-3">
          <SectionHeading>In use</SectionHeading>
          <FormField label="Report name" className="w-full">
            <Input value={draft} onChange={(event) => setDraft(event.target.value)} />
          </FormField>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={() => setValue(draft)}>
              Save name
            </Button>
            <Button type="button" size="sm" variant="outlined" onClick={() => setDraft(value)}>
              Cancel
            </Button>
          </div>
          <Text size="sm" tone="muted">
            Saved name: {value}
          </Text>
        </section>
      </CardBody>
    </Card>
  );
}

const invoices = [
  { id: "1048", name: "Northwind", status: "Open" },
  { id: "1049", name: "Ada Studio", status: "Paid" },
  { id: "1050", name: "Harbor Co", status: "Open" },
] as const;

function FilterScenario() {
  const [status, setStatus] = React.useState("All");
  const visible = invoices.filter((invoice) => status === "All" || invoice.status === status);

  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="filter" />
        <section className="flex max-w-md flex-col gap-3">
          <SectionHeading>In use</SectionHeading>
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl
              aria-label="Invoice status"
              value={status}
              onValueChange={setStatus}
              options={[
                { label: "All", value: "All" },
                { label: "Open", value: "Open" },
                { label: "Paid", value: "Paid" },
              ]}
            />
            {status === "All" ? null : (
              <Button type="button" variant="text" size="sm" onClick={() => setStatus("All")}>
                Clear
              </Button>
            )}
          </div>
          <p role="status" className="text-[13px] text-text-2">
            {visible.length} of {invoices.length} invoices
            {status === "All" ? "" : `, ${status}`}
          </p>
          <ul className="flex flex-col gap-2">
            {visible.map((invoice) => (
              <li
                key={invoice.id}
                className="rounded-sm border border-border px-3 py-2 text-[13px]"
              >
                <span className="font-medium text-heading">#{invoice.id}</span>
                <span className="text-text-2"> {invoice.name}</span>
                <span className="text-text-3"> · {invoice.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </CardBody>
    </Card>
  );
}

const reports = ["Weekly revenue", "Quarterly tax", "Refunds by region"] as const;

function SearchScenario() {
  const [query, setQuery] = React.useState("");
  const visible = reports.filter((report) =>
    report.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="search" />
        <section className="flex max-w-sm flex-col gap-3">
          <SectionHeading>In use</SectionHeading>
          <FormField label="Search reports">
            <SearchInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onClear={() => setQuery("")}
              placeholder="Revenue"
            />
          </FormField>
          <p role="status" className="text-[13px] text-text-2">
            {visible.length === 0
              ? `No reports match “${query.trim()}”.`
              : `${visible.length} reports`}
          </p>
          <ul className="flex flex-col gap-2">
            {visible.map((report) => (
              <li key={report} className="text-[13px] text-heading">
                {report}
              </li>
            ))}
          </ul>
        </section>
      </CardBody>
    </Card>
  );
}

function ViewScenario() {
  const [mode, setMode] = React.useState("Table");

  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="view" />
        <section className="flex flex-col items-start gap-3">
          <SectionHeading>In use</SectionHeading>
          <SegmentedControl
            aria-label="Invoice view"
            value={mode}
            onValueChange={setMode}
            options={[
              { label: "Table", value: "Table", icon: Table2 },
              { label: "Board", value: "Board", icon: LayoutGrid },
            ]}
          />
          <Alert color="info" title={`${mode} view`}>
            Three invoices. Changing the view does not change which invoices are included.
          </Alert>
        </section>
      </CardBody>
    </Card>
  );
}

const sections = {
  copy: CopyScenario,
  create: CreateScenario,
  customize: CustomizeScenario,
  delegate: DelegateScenario,
  delete: DeleteScenario,
  edit: EditScenario,
  filter: FilterScenario,
  search: SearchScenario,
  view: ViewScenario,
} as const satisfies Record<ScenarioSection, () => React.JSX.Element>;

export function ScenariosTemplate({ section = "copy" }: { section?: ScenarioSection }) {
  const current = scenarioSections.find((item) => item.slug === section) ?? scenarioSections[0];
  const Section = sections[current.slug];

  return (
    <DashboardShell>
      <PageHeader
        crumbs={[
          { label: "Withy UI", href: "/" },
          { label: "Scenario patterns", href: "/scenarios/copy" },
          { label: current.label },
        ]}
        title={current.label}
        description={current.description}
      />
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start">
        <ScenarioMenu current={current.slug} />
        <div className="min-w-0 flex-1">
          <Section />
        </div>
      </div>
    </DashboardShell>
  );
}
