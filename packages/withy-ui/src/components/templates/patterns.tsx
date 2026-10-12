import * as React from "react";
import { FileText, SearchX } from "lucide-react";
import { Button } from "../atoms/button";
import { Eyebrow } from "../atoms/eyebrow";
import { Input } from "../atoms/input";
import { Progress } from "../atoms/progress";
import { SkeletonRows } from "../atoms/skeleton";
import { Sparkline } from "../atoms/sparkline";
import { Spinner } from "../atoms/spinner";
import { Alert } from "../molecules/alert";
import { SwitchField } from "../molecules/choice-field";
import { EmptyState } from "../molecules/empty-state";
import { FormField } from "../molecules/form-field";
import { InlineMessage } from "../molecules/inline-message";
import { SectionNav } from "../molecules/section-nav";
import { useToast } from "../molecules/toast";
import { Card, CardBody } from "../organisms/card";
import { PageHeader } from "../organisms/page-header";
import { WithyLink } from "../theme/withy-routing";
import { DashboardShell } from "./dashboard-shell";
import { Practice } from "./foundations";

export const patternSections = [
  {
    slug: "data-visualization",
    label: "Data visualization",
    description:
      "A chart shows a change or a comparison. Use one when a single number hides the shape of the data.",
  },
  {
    slug: "degraded-experiences",
    label: "Degraded experiences",
    description:
      "When one part of the product cannot load, keep the rest of the page usable and say what failed.",
  },
  {
    slug: "empty-states",
    label: "Empty states",
    description:
      "An empty state fills a region that has no items yet, or is empty because nothing matches.",
  },
  {
    slug: "forms",
    label: "Forms",
    description: "A form asks for the least information that completes one job.",
  },
  {
    slug: "loading",
    label: "Loading",
    description:
      "Show a loading state when a wait is long enough to notice, and replace it as soon as the content or the error arrives.",
  },
  {
    slug: "navigation",
    label: "Navigation",
    description: "Navigation tells a person where they are and which places they can open next.",
  },
  {
    slug: "notifications",
    label: "Notifications",
    description:
      "A notice reports a result, a warning, or a change that happened away from the control the person just used.",
  },
  {
    slug: "saving-actions",
    label: "Saving actions",
    description: "Saving should make it obvious what was stored, and when.",
  },
] as const;

export type PatternSection = (typeof patternSections)[number]["slug"];

type Guide = {
  rules: readonly string[];
  examples: readonly { topic: string; do: string; dont: string }[];
};

export const patternGuides = {
  "data-visualization": {
    rules: [
      "One chart answers one question.",
      "Name the chart, and name each series.",
      "Accent colors separate series. Success, warning, and danger stay for status.",
      "Keep a table when the reader needs the exact figures.",
    ],
    examples: [
      {
        topic: "Series",
        do: "Revenue and refunds, each with a name.",
        dont: "Six lines and no names.",
      },
      {
        topic: "Status",
        do: "A green line only when that series means success.",
        dont: "Green for the first series because it looks positive.",
      },
    ],
  },
  "degraded-experiences": {
    rules: [
      "Leave the page in place. Replace only the region that failed.",
      "Name the thing that failed and the next step.",
      "Keep every action that still works.",
      "Use a full-page failure only when the page itself cannot be shown.",
    ],
    examples: [
      {
        topic: "Scope",
        do: "The invoice list shows a warning. The rest of the account page stays usable.",
        dont: "The whole page becomes an error because one list failed.",
      },
      {
        topic: "Copy",
        do: "Invoices could not be loaded. Try again.",
        dont: "Error 503.",
      },
    ],
  },
  "empty-states": {
    rules: [
      "Say what the space is for.",
      "Offer one action when the person can add the first item.",
      "A filter with no matches is different from a list that was never used. Say which one it is.",
      "Keep the tone plain. An error is not a welcome.",
    ],
    examples: [
      {
        topic: "First use",
        do: "No reports yet. Create a report.",
        dont: "Nothing to see here.",
      },
      {
        topic: "Filters",
        do: "No invoices match these filters.",
        dont: "You have no invoices, when the list is only filtered.",
      },
    ],
  },
  forms: {
    rules: [
      "Every field has a visible label. A placeholder is not a label.",
      "Stack fields in one column, in the order of the job.",
      "Explain an invalid value, and say how to fix it.",
      "Keep the submit button available. Check the form when it is submitted.",
    ],
    examples: [
      {
        topic: "Labels",
        do: "Report name, with a hint under the field.",
        dont: "A placeholder that disappears once the person types.",
      },
      {
        topic: "Errors",
        do: "Enter a name between 2 and 20 characters.",
        dont: "Invalid input.",
      },
    ],
  },
  loading: {
    rules: [
      "Under about a second, show the content. A flash of a spinner makes the page feel slower.",
      "Use a spinner for a small region, and a skeleton for the shape of a larger region.",
      "Name what is loading for assistive tech.",
      "When the wait fails, replace the indicator with the error and a way to try again.",
    ],
    examples: [
      {
        topic: "Placement",
        do: "A skeleton in the card that is still loading.",
        dont: "A spinner for every row in the same list.",
      },
      {
        topic: "Arrival",
        do: "Each row appears as soon as it arrives.",
        dont: "A blank page until every row has loaded.",
      },
    ],
  },
  navigation: {
    rules: [
      "Mark the current page.",
      "Keep the same destinations in the same order on every screen.",
      "On a narrow screen, put the page content before a long list of links.",
      "A link says where it goes.",
    ],
    examples: [
      {
        topic: "Current",
        do: "Foundations stays marked while you move through its sections.",
        dont: "A menu with no current item.",
      },
      {
        topic: "Labels",
        do: "Billing guide.",
        dont: "Click here.",
      },
    ],
  },
  notifications: {
    rules: [
      "Put a notice next to the thing it describes when the person is still looking there.",
      "Use a toast when the change happens and the person may already be looking elsewhere on the page.",
      "Success, warning, and danger stay distinct.",
      "Let the person dismiss a toast. Leave an inline alert until the condition changes.",
    ],
    examples: [
      {
        topic: "Place",
        do: "Saved, on the form, after the fields.",
        dont: "A toast for an error that belongs on a field.",
      },
      {
        topic: "Meaning",
        do: "Payment failed, in the danger color.",
        dont: "A success color for a warning.",
      },
    ],
  },
  "saving-actions": {
    rules: [
      "A form saves when the person presses the button. A switch saves when it changes.",
      "Keep those two patterns apart. Do not mix them in one form.",
      "The save button stays available, even when the form is unchanged.",
      "If saving fails, keep what was typed and say what to do next.",
      "Start the button with a verb, such as Save changes or Create report.",
    ],
    examples: [
      {
        topic: "Pattern",
        do: "Save changes at the end of the form. The email switch saves on its own, outside that form.",
        dont: "A switch inside the form that saves before Save changes is pressed.",
      },
      {
        topic: "Button",
        do: "Save changes.",
        dont: "Submit, or a save button that is disabled until the form changes.",
      },
    ],
  },
} as const satisfies Record<PatternSection, Guide>;

function PatternMenu({ current }: { current: PatternSection }) {
  return (
    <SectionNav
      label="UI patterns"
      current={`/patterns/${current}`}
      className="lg:w-56"
      items={patternSections.map((item) => ({
        label: item.label,
        href: `/patterns/${item.slug}`,
      }))}
    />
  );
}

function SectionHeading({ children }: { children: string }) {
  return <Eyebrow as="h2">{children}</Eyebrow>;
}

function Guidance({ section }: { section: PatternSection }) {
  const guide: Guide = patternGuides[section];
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

function DataVisualization() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="data-visualization" />
        <section className="flex flex-col gap-3">
          <SectionHeading>In use</SectionHeading>
          <div className="max-w-sm rounded-sm border border-border px-4 py-3">
            <p className="text-[13px] font-medium text-heading">Weekly revenue</p>
            <p className="mt-0.5 text-[12px] text-text-3">Compared with the week before</p>
            <Sparkline
              className="mt-3"
              data={[8, 12, 10, 14, 13, 18, 16, 21, 19, 24]}
              label="Weekly revenue trend"
            />
          </div>
          <Button asChild variant="outlined" size="sm" className="self-start">
            <WithyLink href="/components/area-chart">Open charts</WithyLink>
          </Button>
        </section>
      </CardBody>
    </Card>
  );
}

function DegradedExperiences() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="degraded-experiences" />
        <section className="flex max-w-lg flex-col gap-3">
          <SectionHeading>In use</SectionHeading>
          <Alert
            color="warning"
            title="Invoices are unavailable"
            actions={
              <Button type="button" variant="outlined" size="sm">
                Try again
              </Button>
            }
          >
            The list could not be loaded. The rest of this page still works.
          </Alert>
        </section>
      </CardBody>
    </Card>
  );
}

function EmptyStates() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="empty-states" />
        <section className="flex flex-col gap-3">
          <SectionHeading>In use</SectionHeading>
          <div className="grid gap-3 lg:grid-cols-2">
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
            <EmptyState
              icon={SearchX}
              title="No invoices match these filters"
              description="Paid, from March. Change the filters to see more invoices."
              action={
                <Button type="button" variant="outlined" size="sm">
                  Clear filters
                </Button>
              }
            />
          </div>
        </section>
      </CardBody>
    </Card>
  );
}

function Forms() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="forms" />
        <section className="flex max-w-sm flex-col gap-4">
          <SectionHeading>In use</SectionHeading>
          <FormField label="Report name" hint="Shown on the report cover.">
            <Input defaultValue="Weekly revenue" />
          </FormField>
          <FormField label="Owner" error="Enter a name between 2 and 20 characters.">
            <Input defaultValue="A" />
          </FormField>
          <Button type="button" size="sm" className="self-start">
            Save report
          </Button>
        </section>
      </CardBody>
    </Card>
  );
}

function Loading() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="loading" />
        <section className="flex max-w-3xl flex-col gap-4">
          <SectionHeading>In use</SectionHeading>
          <div className="flex items-center gap-2">
            <Spinner label="Loading invoices" />
            <p className="text-[13px] text-text-2">Loading invoices</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-sm border border-border px-4 py-3">
              <p className="mb-3 text-[13px] font-medium text-heading">Exporting report</p>
              <Progress value={62} animation="stripes" aria-label="Exporting report, 62 percent" />
              <p className="mt-2 text-[12px] text-text-3">62% complete</p>
            </div>
            <div className="rounded-sm border border-border px-4 py-3">
              <p className="mb-3 text-[13px] font-medium text-heading">Recent invoices</p>
              <SkeletonRows rows={3} />
            </div>
          </div>
          <Button type="button" size="sm" loading className="self-start">
            Save report
          </Button>
        </section>
      </CardBody>
    </Card>
  );
}

function NavigationPattern() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="navigation" />
        <section className="flex flex-col gap-3">
          <SectionHeading>In use</SectionHeading>
          <SectionNav
            label="Sample account"
            current="#invoices"
            className="w-fit lg:static"
            items={[
              { label: "Invoices", href: "#invoices" },
              { label: "Customers", href: "#customers" },
              { label: "Reports", href: "#reports" },
            ]}
          />
        </section>
      </CardBody>
    </Card>
  );
}

function Notifications() {
  const { toast } = useToast();

  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="notifications" />
        <section className="flex max-w-lg flex-col items-start gap-3">
          <SectionHeading>In use</SectionHeading>
          <Alert color="success" title="Invoice sent">
            Ada received a copy. This notice stays with the invoice.
          </Alert>
          <Button
            type="button"
            variant="outlined"
            size="sm"
            onClick={() =>
              toast({
                title: "Report ready",
                description: "Weekly revenue is ready to open.",
                color: "success",
              })
            }
          >
            Show a notice
          </Button>
        </section>
      </CardBody>
    </Card>
  );
}

function SavingActions() {
  const [saved, setSaved] = React.useState(false);
  const [alerts, setAlerts] = React.useState(true);

  return (
    <Card>
      <CardBody className="flex flex-col gap-8">
        <Guidance section="saving-actions" />
        <section className="flex max-w-sm flex-col gap-5">
          <SectionHeading>In use</SectionHeading>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSaved(true);
            }}
          >
            <FormField label="Report name">
              <Input defaultValue="Weekly revenue" onChange={() => setSaved(false)} />
            </FormField>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" size="sm">
                Save changes
              </Button>
              {saved ? <InlineMessage tone="success">Changes saved.</InlineMessage> : null}
            </div>
          </form>
          <SwitchField
            label="Email alerts"
            description="Saves as soon as you change it."
            checked={alerts}
            onCheckedChange={setAlerts}
            className="rounded-sm border border-border px-3 py-3"
          />
        </section>
      </CardBody>
    </Card>
  );
}

const sections = {
  "data-visualization": DataVisualization,
  "degraded-experiences": DegradedExperiences,
  "empty-states": EmptyStates,
  forms: Forms,
  loading: Loading,
  navigation: NavigationPattern,
  notifications: Notifications,
  "saving-actions": SavingActions,
} as const satisfies Record<PatternSection, () => React.JSX.Element>;

export function PatternsTemplate({ section = "data-visualization" }: { section?: PatternSection }) {
  const current = patternSections.find((item) => item.slug === section) ?? patternSections[0];
  const Section = sections[current.slug];

  return (
    <DashboardShell>
      <PageHeader
        crumbs={[
          { label: "Withy UI", href: "/" },
          { label: "UI patterns", href: "/patterns/data-visualization" },
          { label: current.label },
        ]}
        title={current.label}
        description={current.description}
      />
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start">
        <PatternMenu current={current.slug} />
        <div className="min-w-0 flex-1">
          <Section />
        </div>
      </div>
    </DashboardShell>
  );
}
