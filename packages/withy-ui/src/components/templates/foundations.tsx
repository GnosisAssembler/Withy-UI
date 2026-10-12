import type { ReactNode } from "react";
import { Bell, Calendar, Check, Info, Search, Settings, X } from "lucide-react";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { Eyebrow } from "../atoms/eyebrow";
import { Icon } from "../atoms/icon";
import { Input } from "../atoms/input";
import { Sparkline } from "../atoms/sparkline";
import { Switch } from "../atoms/switch";
import { SectionNav } from "../molecules/section-nav";
import { Stat } from "../molecules/stat";
import { Tooltip, TooltipContent, TooltipTrigger } from "../molecules/tooltip";
import { Card, CardBody, CardHeader, CardTitle } from "../organisms/card";
import { PageHeader } from "../organisms/page-header";
import { cn } from "../../lib/cn";
import { Box } from "../layout/box";
import { Container } from "../layout/container";
import { spaceRanges, spaceScale } from "../layout/spacing";
import { Stack } from "../layout/stack";
import { Column, Columns } from "../layout/grid";
import {
  Layout,
  LayoutBody,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPane,
} from "../layout/layout";
import { DashboardShell } from "./dashboard-shell";
import {
  accentSwatches,
  darkNeutralBands,
  darkNeutralScale,
  lightNeutralBands,
  lightNeutralScale,
  semanticRoles,
  typefaces,
  typeScale,
  type ScaleBand,
  type ScaleStep,
} from "../../lib/palette";

function SectionHeading({ children }: { children: string }) {
  return <Eyebrow as="h2">{children}</Eyebrow>;
}

export function Practice({
  topic,
  recommendation,
  avoid,
}: {
  topic: string;
  recommendation: string;
  avoid: string;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <p className="border-b border-border px-3 py-2 text-[13px] font-medium text-heading">
        {topic}
      </p>
      <div className="flex flex-col gap-2 p-2">
        <div className="rounded-xs border border-success/50 bg-success/15 px-3 py-2.5">
          <p className="flex items-center gap-2">
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
              <Icon icon={Check} size="sm" className="size-3" />
            </span>
            <span className="font-inter text-[11px] font-semibold tracking-[0.5px] text-success uppercase">
              Do
            </span>
          </p>
          <p className="mt-1.5 text-[13px] text-heading">{recommendation}</p>
        </div>
        <div className="rounded-xs border border-danger/50 bg-danger/15 px-3 py-2.5">
          <p className="flex items-center gap-2">
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-danger text-danger-foreground">
              <Icon icon={X} size="sm" className="size-3" />
            </span>
            <span className="font-inter text-[11px] font-semibold tracking-[0.5px] text-danger uppercase">
              Don’t
            </span>
          </p>
          <p className="mt-1.5 text-[13px] text-heading">{avoid}</p>
        </div>
      </div>
    </div>
  );
}

function NeutralScale({
  name,
  steps,
  bands,
}: {
  name: string;
  steps: ScaleStep[];
  bands: ScaleBand[];
}) {
  const grouped = bands.map((band, index) => {
    const start = bands.slice(0, index).reduce((sum, item) => sum + item.count, 0);
    return { ...band, steps: steps.slice(start, start + band.count) };
  });

  return (
    <div>
      <p className="mb-2 text-[13px] font-medium text-heading">{name}</p>
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="flex overflow-hidden rounded-sm border border-border">
            {steps.map((step) => (
              <Tooltip key={step.name}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="group relative h-12 min-w-0 flex-1 cursor-default outline-none"
                    style={{ background: step.hex }}
                    aria-label={step.name}
                    onClick={(event) => event.preventDefault()}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                      style={{ boxShadow: "inset 0 0 0 2px #fff, inset 0 0 0 4px #1C1428" }}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{step.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div className="mt-2 flex gap-3">
            {grouped.map((band) => (
              <div key={band.label} className="min-w-0" style={{ flex: band.count }}>
                <div className="border-t border-text-4" />
                <p className="mt-1.5 text-[12px] font-medium text-heading">{band.label}</p>
                <p className="text-[12px] text-text-3">{band.usage}</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {band.steps.map((step) => (
                    <li key={step.name} className="flex items-center gap-2 text-[12px]">
                      <span
                        className="size-3.5 shrink-0 rounded-xs border border-border"
                        style={{ background: step.hex }}
                      />
                      <span className="text-heading">{step.name}</span>
                      <span className="font-inter text-[11px] text-text-3 uppercase">
                        {step.hex}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReferenceTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: readonly string[];
  rows: readonly { key: string; cells: readonly ReactNode[] }[];
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="py-2 pr-4 text-[11px] font-medium tracking-[0.4px] text-text-3 uppercase last:pr-0"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr:last-child]:border-b-0">
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-border">
              {row.cells.map((cell, index) => (
                <td key={`${row.key}-${index}`} className="py-2.5 pr-4 text-text-2 last:pr-0">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleSwatch({ hex }: { hex: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="size-4 rounded-xs border border-border" style={{ background: hex }} />
      <span className="font-inter text-[11px] text-text-3 uppercase">{hex}</span>
    </span>
  );
}

const contentPrinciples = [
  {
    name: "Clear",
    text: "Use plain words and short sentences. Say the straightforward thing, especially in errors, waiting states, and empty screens.",
  },
  {
    name: "Consistent",
    text: "Use one word for one action everywhere. A confirmation should repeat the verb on the button that triggered it.",
  },
] as const;

const contentRules = [
  "Use sentence case for titles, labels, and buttons. Don’t put a period on a button.",
  "Start an action with a verb, such as Save changes or Create report.",
  "Address the user as “you”, and what belongs to them as “your”.",
  "Name the problem and the fix. Don’t blame the user, apologize, or joke.",
  "Write link text that says where it goes. Don’t use “click here”.",
  "Skip easy, just, quick, and exclamation marks.",
] as const;

const contentExamples = [
  {
    topic: "Errors",
    do: "Enter a name between 2 and 20 characters.",
    dont: "Error 4091. You forgot your name.",
  },
  {
    topic: "Buttons",
    do: "Save email preferences",
    dont: "Save Email Preferences.",
  },
  {
    topic: "Links",
    do: "Read the billing guide",
    dont: "Click here",
  },
] as const;

const iconSamples = [
  { name: "Search", icon: Search },
  { name: "Bell", icon: Bell },
  { name: "Check", icon: Check },
  { name: "Calendar", icon: Calendar },
  { name: "Settings", icon: Settings },
  { name: "Info", icon: Info },
] as const;

const iconSizes = [
  { size: "sm", label: "Small", detail: "14px, beside compact text" },
  { size: "md", label: "Medium", detail: "16px, the default" },
  { size: "lg", label: "Large", detail: "20px, empty states" },
] as const;

const iconRules = [
  "Use Lucide, and pass the icon to the Icon atom. Don’t mix in another set or emoji.",
  "Inside a button, place the Lucide icon directly. The button sets the size.",
  "Keep Lucide’s stroke. Don’t restyle one icon to look heavier or filled.",
  "Let the icon inherit the text color around it. Color an icon only when that color has a meaning, such as danger.",
  "Pair an icon with a word. Use an icon alone only on a control that already has an accessible name.",
  "Use one icon for one action. Search stays Search on every screen.",
] as const;

const iconExamples = [
  {
    topic: "Decorative",
    do: "A Search icon beside the word Search. Leave label off so the icon stays hidden from assistive tech.",
    dont: "A Search icon as the only content, with no word and no name.",
  },
  {
    topic: "Icon buttons",
    do: "A Bell button with the accessible name Notifications.",
    dont: "A Bell button with no name.",
  },
  {
    topic: "Meaning",
    do: "Name the icon Session timeout when no nearby text does.",
    dont: "Use a tooltip, or an emoji, as the only name.",
  },
] as const;

const layoutPieces = [
  { name: "Box", text: "Pads the inside of a region." },
  { name: "Stack", text: "Groups items down the page." },
  { name: "Row", text: "Groups items across, and wraps them." },
  { name: "Rows", text: "Stacks full-width bands with the page gap." },
  { name: "Grid", text: "Equal columns that fold down on a narrow screen." },
  { name: "Columns", text: "The 12-column grid. GridColumn sets how many a region spans." },
  { name: "Container", text: "Caps the width: fluid, wide, or narrow." },
  { name: "Layout", text: "Header, content, start pane, end pane, and footer." },
] as const;

const viewportRanges = [
  { name: "Narrow", width: "Under 768px", columns: "1", use: "Phones. One column." },
  { name: "Regular", width: "768px and up", columns: "Up to 2", use: "A pane beside the content." },
  {
    name: "Wide",
    width: "1280px and up",
    columns: "Up to 3",
    use: "A pane on each side, or a wider card grid.",
  },
] as const;

const containerWidths = [
  { name: "Fluid", width: "No maximum", use: "Dashboards, tables, and boards." },
  {
    name: "Wide",
    width: "1280px, centered",
    use: "Pages that should stay readable on a large monitor.",
  },
  { name: "Narrow", width: "768px, centered", use: "Articles and focused forms." },
] as const;

const layoutRules = [
  "Give the page one subject. Panes support it. They don’t compete with it.",
  "On a narrow screen, use one column. Keep every action that exists on a wide screen.",
  "Keep the content first when regions stack. Don’t put a long list of links above the subject.",
  "Align cards, tables, and forms to the 12 columns. Space buttons and icons with Row and Stack.",
  "Use a narrow container when the page is mostly text, so a line stays readable.",
  "Leave dialogs, menus, and tooltips off the grid. They float above the page.",
] as const;

const layoutExamples = [
  {
    topic: "Columns",
    do: "A card spans 8 columns, and a detail pane spans 4.",
    dont: "A paragraph stretches across all 12 columns on a large monitor.",
  },
  {
    topic: "Narrow screens",
    do: "Regions stack into one column, with the content first.",
    dont: "Three panes stay side by side on a phone.",
  },
  {
    topic: "Inside a card",
    do: "Buttons sit in a Row, with the gap from the spacing scale.",
    dont: "Each button is snapped to its own grid column.",
  },
] as const;

const spacingRules = [
  "Use the same gap for the same kind of item. Every card in a row shares one step.",
  "Put related items closer than unrelated ones. A label sits nearer its field than the next field.",
  "Give a section more space than the items inside it.",
  "Repeat one gap down a list, so the list can be scanned.",
  "If a shape looks uneven, move to the next step. Don’t invent a size between steps.",
] as const;

const spacingExamples = [
  {
    topic: "Similarity",
    do: "Every card in a row is 10px apart.",
    dont: "Some cards are 8px apart and others are 16px apart.",
  },
  {
    topic: "Proximity",
    do: "4px between an icon and its label, then 16px before the next group.",
    dont: "16px between the icon and the label, the same as between groups.",
  },
  {
    topic: "Hierarchy",
    do: "32px between sections, and 8px between a title and its description.",
    dont: "32px between a title and its description.",
  },
] as const;

const typeGroups = ["Body", "Headings", "Figures", "Labels"] as const;

const typeRules = [
  "Use one h1 on a page, then the next heading level. Don’t skip from an h1 to an h4.",
  "Use size and weight for emphasis. Color marks status, such as danger, and does not rank the text.",
  "Align text to the left. Keep a reading line near 80 characters, in a narrow container.",
  "Body text uses a line-height of 1.5. Headings use 1.25.",
  "IBM Plex Sans is for reading. Rubik is for figures. Inter is for eyebrows.",
  "Use 400, 500, or 600. Don’t add another weight.",
] as const;

const typeExamples = [
  {
    topic: "Headings",
    do: "One h1, then an h2 for the next section.",
    dont: "A div styled to look like a heading, or a jump from h1 to h4.",
  },
  {
    topic: "Emphasis",
    do: "A heavier weight on the words that matter.",
    dont: "The important sentence set in the primary color.",
  },
  {
    topic: "Figures",
    do: "0.81% set in Rubik.",
    dont: "A metric set in IBM Plex Sans at body size.",
  },
] as const;

const atomicLevels = [
  {
    name: "Atoms",
    create:
      "Build one control or one mark. An atom does not contain another component. Button, Badge, Input, and Switch are atoms.",
    use: "Place the atom wherever that single piece is needed. Change it with props, rather than copying it.",
  },
  {
    name: "Molecules",
    create:
      "Build a molecule when the same atoms always travel together for one job. A Stat is a label, a figure, and a change.",
    use: "Use the molecule. Don’t paste its atoms into every screen that needs the same job.",
  },
  {
    name: "Organisms",
    create:
      "Build a section of a screen. A Card can hold a Stat and a Sparkline. It can contain molecules and atoms.",
    use: "Use an organism as a region of a page. It does not become the page, and it does not contain a template.",
  },
  {
    name: "Templates",
    create:
      "Build the page structure from organisms. Charts, Widgets, Calendar, and Settings are templates inside the dashboard shell.",
    use: "Fill a template with the content for that screen. A page is a template with real data. Don’t draw a new shell when one already fits.",
  },
] as const;

const atomicRules = [
  "Add a component at the smallest layer that can do the job.",
  "An atom does not import a molecule. A molecule does not import an organism. A component only contains smaller layers.",
  "If the same group of atoms is copied twice, make a molecule.",
  "A template owns the page. An organism owns a section. A molecule owns one job.",
  "Change a shared piece in its own layer, so every screen that uses it stays in step.",
] as const;

const atomicExamples = [
  {
    topic: "Building",
    do: "A Stat molecule, when a label and a figure always appear together.",
    dont: "The same label, figure, and change pasted into every card.",
  },
  {
    topic: "Direction",
    do: "A Card organism that contains a Stat.",
    dont: "A Stat that contains a Card.",
  },
  {
    topic: "Pages",
    do: "The settings template, filled with the fields for that screen.",
    dont: "A new page shell for one form.",
  },
] as const;

export const foundationGuides = {
  content: { principles: contentPrinciples, rules: contentRules, examples: contentExamples },
  icons: { sizes: iconSizes, rules: iconRules, examples: iconExamples },
  layout: {
    pieces: layoutPieces,
    viewportRanges,
    containerWidths,
    rules: layoutRules,
    examples: layoutExamples,
  },
  spacing: { rules: spacingRules, examples: spacingExamples },
  typography: { rules: typeRules, examples: typeExamples },
  atomicDesign: { levels: atomicLevels, rules: atomicRules, examples: atomicExamples },
} as const;

export const foundationSections = [
  {
    slug: "color",
    label: "Color",
    description:
      "Color is grouped by job. Neutrals build the surface, semantic roles communicate status and action, and accents mark categories in charts and tags. Light and dark share the same roles. The values shift so text and fills stay readable in both modes.",
  },
  {
    slug: "content",
    label: "Content",
    description:
      "Interface text should be plain, consistent, and specific. These rules cover labels, buttons, errors, and empty states.",
  },
  {
    slug: "icons",
    label: "Icons",
    description:
      "Icons come from Lucide. They are line drawings that follow the text color. Most are decorative. An icon carries meaning on its own only when you give it a name.",
  },
  {
    slug: "layout",
    label: "Layout",
    description:
      "A page reads from top to bottom, then left to right. Keep one subject in view, and let the columns fold down when the screen gets narrower.",
  },
  {
    slug: "spacing",
    label: "Spacing",
    description:
      "Space steps off a 4px unit. 10px sits between 8px and 12px, and it is the gap between cards. Stack and Row use 4, 8, 10, 16, and 32. Box padding uses 12, 16, and 20.",
  },
  {
    slug: "typography",
    label: "Typography",
    description:
      "Type is set in rem so it follows the browser’s text size. IBM Plex Sans carries the interface. Rubik carries figures. Inter carries eyebrows.",
  },
  {
    slug: "atomic-design",
    label: "Atomic design",
    description:
      "Screens are built from smaller pieces. Each layer has one kind of job. A component contains only smaller layers, so a change in a button reaches every screen that uses it.",
  },
] as const;

export type FoundationSection = (typeof foundationSections)[number]["slug"];

function FoundationMenu({ current }: { current: FoundationSection }) {
  return (
    <SectionNav
      label="Foundations"
      current={`/foundations/${current}`}
      items={foundationSections.map((item) => ({
        label: item.label,
        href: `/foundations/${item.slug}`,
      }))}
    />
  );
}

export function FoundationsTemplate({ section = "color" }: { section?: FoundationSection }) {
  const current = foundationSections.find((item) => item.slug === section) ?? foundationSections[0];

  return (
    <DashboardShell>
      <PageHeader
        crumbs={[
          { label: "Withy UI", href: "/" },
          { label: "Foundations", href: "/foundations/color" },
          { label: current.label },
        ]}
        title={current.label}
        description={current.description}
      />
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start">
        <FoundationMenu current={current.slug} />
        <div className="min-w-0 flex-1">
          {current.slug === "color" ? (
            <Card>
              <CardBody className="flex flex-col gap-8">
                <section className="flex flex-col gap-5">
                  <div>
                    <SectionHeading>Neutral colors</SectionHeading>
                    <p className="mt-1 max-w-3xl text-[13px] text-text-2">
                      Light starts at the canvas and ends at ink. Dark starts at the night
                      background and ends at light text, so a step used for backgrounds, borders, or
                      text stays in that job in both modes.
                    </p>
                  </div>
                  <NeutralScale name="Light" steps={lightNeutralScale} bands={lightNeutralBands} />
                  <NeutralScale name="Dark" steps={darkNeutralScale} bands={darkNeutralBands} />
                </section>

                <section className="flex flex-col gap-4">
                  <div>
                    <SectionHeading>Semantic colors</SectionHeading>
                    <p className="mt-1 max-w-3xl text-[13px] text-text-2">
                      Each role has one meaning. Use the solid color for emphasis, a light tint for
                      a muted surface, and the role color itself for text and icons.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm">Emphasis</Button>
                    <span className="rounded-sm bg-primary/10 px-2.5 py-1 text-[13px] text-primary">
                      Muted
                    </span>
                    <span className="px-1 text-[13px] font-medium text-primary">Foreground</span>
                    <Badge color="success">Success</Badge>
                    <Badge color="danger">Danger</Badge>
                  </div>
                  <ReferenceTable
                    caption="Semantic colors"
                    columns={["Role", "Usage", "Light", "Dark"]}
                    rows={semanticRoles.map((role) => ({
                      key: role.name,
                      cells: [
                        <span key="name" className="font-medium text-heading">
                          {role.name}
                        </span>,
                        role.usage,
                        <RoleSwatch key="light" hex={role.light} />,
                        <RoleSwatch key="dark" hex={role.dark} />,
                      ],
                    }))}
                  />
                </section>

                <section className="flex flex-col gap-3">
                  <div>
                    <SectionHeading>Accent colors</SectionHeading>
                    <p className="mt-1 max-w-3xl text-[13px] text-text-2">
                      Accents separate series in charts and tags. They do not mean success, warning,
                      or danger.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {accentSwatches.map((swatch) => (
                      <div key={swatch.name} className="flex items-center gap-3">
                        <span
                          className="size-10 shrink-0 rounded-sm border border-border"
                          style={{ background: swatch.hex }}
                        />
                        <span>
                          <span className="block text-[13px] font-medium text-heading">
                            {swatch.name}
                          </span>
                          <span className="block font-inter text-[11px] text-text-3 uppercase">
                            {swatch.hex}
                          </span>
                          <span className="block text-[12px] text-text-3">{swatch.role}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </CardBody>
            </Card>
          ) : null}
          {current.slug === "content" ? (
            <Card>
              <CardBody className="flex flex-col gap-8">
                <section className="grid gap-4 md:grid-cols-2">
                  {contentPrinciples.map((principle, index) => (
                    <div key={principle.name}>
                      <SectionHeading>{`${index + 1}. ${principle.name}`}</SectionHeading>
                      <p className="mt-1 text-[13px] text-text-2">{principle.text}</p>
                    </div>
                  ))}
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Rules</SectionHeading>
                  <ul className="flex max-w-3xl flex-col gap-2">
                    {contentRules.map((rule) => (
                      <li key={rule} className="text-[13px] text-text-2">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Examples</SectionHeading>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {contentExamples.map((example) => (
                      <Practice
                        key={example.topic}
                        topic={example.topic}
                        recommendation={example.do}
                        avoid={example.dont}
                      />
                    ))}
                  </div>
                </section>
              </CardBody>
            </Card>
          ) : null}
          {current.slug === "icons" ? (
            <Card>
              <CardBody className="flex flex-col gap-8">
                <section className="flex flex-col gap-3">
                  <SectionHeading>Library</SectionHeading>
                  <div className="grid max-w-xl grid-cols-3 gap-3 sm:grid-cols-6">
                    {iconSamples.map((sample) => (
                      <div
                        key={sample.name}
                        className="flex flex-col items-center gap-2 rounded-sm border border-border px-2 py-3 text-text-2"
                      >
                        <Icon icon={sample.icon} />
                        <span className="text-[11px] text-text-3">{sample.name}</span>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Sizes</SectionHeading>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {iconSizes.map((item) => (
                      <div key={item.size} className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-sm border border-border text-text-2">
                          <Icon icon={Search} size={item.size} />
                        </span>
                        <span>
                          <span className="block text-[13px] font-medium text-heading">
                            {item.label}
                          </span>
                          <span className="block text-[12px] text-text-3">{item.detail}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Rules</SectionHeading>
                  <ul className="flex max-w-3xl flex-col gap-2">
                    {iconRules.map((rule) => (
                      <li key={rule} className="text-[13px] text-text-2">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Examples</SectionHeading>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {iconExamples.map((example) => (
                      <Practice
                        key={example.topic}
                        topic={example.topic}
                        recommendation={example.do}
                        avoid={example.dont}
                      />
                    ))}
                  </div>
                </section>
              </CardBody>
            </Card>
          ) : null}
          {current.slug === "layout" ? (
            <Card>
              <CardBody className="flex flex-col gap-8">
                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {layoutPieces.map((piece) => (
                    <div key={piece.name}>
                      <p className="text-[13px] font-medium text-heading">{piece.name}</p>
                      <p className="text-[13px] text-text-2">{piece.text}</p>
                    </div>
                  ))}
                </section>
                <section className="flex flex-col gap-3">
                  <div>
                    <SectionHeading>Viewport ranges</SectionHeading>
                    <p className="mt-1 max-w-3xl text-[13px] text-text-2">
                      Choose a range for the page structure. The ruler underneath is sm 640, md 768,
                      lg 1024, xl 1280, and 2xl 1536. Use one of those only to adjust a detail, such
                      as padding. The shell pads the main area by 20px, 25px from 1024px, and 30px
                      from 1280px.
                    </p>
                  </div>
                  <ReferenceTable
                    caption="Viewport ranges"
                    columns={["Range", "Width", "Columns", "Use"]}
                    rows={viewportRanges.map((range) => ({
                      key: range.name,
                      cells: [
                        <span key="name" className="font-medium text-heading">
                          {range.name}
                        </span>,
                        range.width,
                        range.columns,
                        range.use,
                      ],
                    }))}
                  />
                </section>
                <section className="flex flex-col gap-3">
                  <div>
                    <SectionHeading>Grid</SectionHeading>
                    <p className="mt-1 max-w-3xl text-[13px] text-text-2">
                      The main area is 12 columns with a 10px gutter, the same gap used between
                      cards. Align cards, tables, and forms to those columns. Space the buttons and
                      icons inside them with Row and Stack. Breakpoints follow the viewport, even
                      when a side pane is open.
                    </p>
                  </div>
                  <Columns gap="sm">
                    {Array.from({ length: 12 }, (_, index) => (
                      <Column key={index} span={1} collapse={false}>
                        <div className="h-8 rounded-xs bg-primary/15" />
                      </Column>
                    ))}
                  </Columns>
                  <Columns>
                    <Column span={8}>
                      <Box
                        padding="md"
                        className="rounded-sm border border-border text-[13px] text-heading"
                      >
                        Content · 8 columns
                      </Box>
                    </Column>
                    <Column span={4}>
                      <Box
                        padding="md"
                        className="rounded-sm bg-primary/10 text-[13px] text-primary"
                      >
                        Pane · 4 columns
                      </Box>
                    </Column>
                  </Columns>
                </section>
                <section className="flex flex-col gap-3">
                  <div>
                    <SectionHeading>Containers</SectionHeading>
                    <p className="mt-1 max-w-3xl text-[13px] text-text-2">
                      Container sets how far the content may grow. Fluid fills the main area. Wide
                      stops at 1280px. Narrow stops at 768px, for reading.
                    </p>
                  </div>
                  <ReferenceTable
                    caption="Containers"
                    columns={["Container", "Width", "Use"]}
                    rows={containerWidths.map((item) => ({
                      key: item.name,
                      cells: [
                        <span key="name" className="font-medium text-heading">
                          {item.name}
                        </span>,
                        item.width,
                        item.use,
                      ],
                    }))}
                  />
                  <Stack gap="sm">
                    <Container width="fluid">
                      <Box
                        padding="sm"
                        className="rounded-xs bg-primary/10 text-[12px] text-primary"
                      >
                        Fluid
                      </Box>
                    </Container>
                    <Container width="wide">
                      <Box
                        padding="sm"
                        className="rounded-xs bg-primary/15 text-[12px] text-primary"
                      >
                        Wide
                      </Box>
                    </Container>
                    <Container width="narrow">
                      <Box
                        padding="sm"
                        className="rounded-xs bg-primary/25 text-[12px] text-primary"
                      >
                        Narrow
                      </Box>
                    </Container>
                  </Stack>
                  <p className="text-[12px] text-text-3">
                    Wide matches Fluid until the main area is wider than 1280px.
                  </p>
                </section>
                <section className="flex flex-col gap-3">
                  <div>
                    <SectionHeading>Regions</SectionHeading>
                    <p className="mt-1 max-w-3xl text-[13px] text-text-2">
                      Header holds the title and actions. Content holds the subject. The start pane
                      holds navigation or filters, and the end pane holds detail. Footer holds quiet
                      links. On a narrow screen the content stays first, and the panes follow it.
                      From 1024px, the start pane sits on the left.
                    </p>
                  </div>
                  <Layout className="overflow-hidden rounded-sm border border-border">
                    <LayoutHeader className="border-b border-border bg-muted px-3 py-2 text-[13px] font-medium text-heading">
                      Header
                    </LayoutHeader>
                    <LayoutBody className="p-2">
                      <LayoutPane
                        side="start"
                        className="rounded-xs bg-primary/10 px-3 py-4 text-[13px] text-primary"
                      >
                        Start pane
                      </LayoutPane>
                      <LayoutContent className="rounded-xs border border-dashed border-border px-3 py-4 text-[13px] text-text-2">
                        Content
                      </LayoutContent>
                      <LayoutPane
                        side="end"
                        className="rounded-xs bg-muted px-3 py-4 text-[13px] text-text-2"
                      >
                        End pane
                      </LayoutPane>
                    </LayoutBody>
                    <LayoutFooter className="border-t border-border px-3 py-2 text-[12px] text-text-3">
                      Footer
                    </LayoutFooter>
                  </Layout>
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Rules</SectionHeading>
                  <ul className="flex max-w-3xl flex-col gap-2">
                    {layoutRules.map((rule) => (
                      <li key={rule} className="text-[13px] text-text-2">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Examples</SectionHeading>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {layoutExamples.map((example) => (
                      <Practice
                        key={example.topic}
                        topic={example.topic}
                        recommendation={example.do}
                        avoid={example.dont}
                      />
                    ))}
                  </div>
                </section>
              </CardBody>
            </Card>
          ) : null}
          {current.slug === "spacing" ? (
            <Card>
              <CardBody className="flex flex-col gap-8">
                <section className="flex flex-col gap-6">
                  {spaceRanges.map((range) => (
                    <div key={range.name} className="flex flex-col gap-3">
                      <div>
                        <SectionHeading>{range.name}</SectionHeading>
                        <p className="mt-1 max-w-3xl text-[13px] text-text-2">{range.text}</p>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {spaceScale
                          .filter((step) => step.range === range.name)
                          .map((step) => (
                            <li key={step.token} className="flex items-center gap-3">
                              <span className="w-12 shrink-0 text-[13px] font-medium text-heading">
                                {step.px}px
                              </span>
                              <span
                                className={cn("h-3 shrink-0 rounded-xs bg-primary/20", step.bar)}
                              />
                              <span className="text-[13px] text-text-2">{step.use}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Rules</SectionHeading>
                  <ul className="flex max-w-3xl flex-col gap-2">
                    {spacingRules.map((rule) => (
                      <li key={rule} className="text-[13px] text-text-2">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Examples</SectionHeading>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {spacingExamples.map((example) => (
                      <Practice
                        key={example.topic}
                        topic={example.topic}
                        recommendation={example.do}
                        avoid={example.dont}
                      />
                    ))}
                  </div>
                </section>
              </CardBody>
            </Card>
          ) : null}
          {current.slug === "typography" ? (
            <Card>
              <CardBody className="flex flex-col gap-8">
                <section className="grid gap-3 md:grid-cols-3">
                  {typefaces.map((face) => (
                    <div key={face.name} className="rounded-sm border border-border px-3 py-3">
                      <p className={face.className}>{face.sample}</p>
                      <p className="mt-2 text-[13px] font-medium text-heading">{face.name}</p>
                      <p className="text-[12px] text-text-3">{face.role}</p>
                    </div>
                  ))}
                </section>
                <section className="flex flex-col gap-6">
                  {typeGroups.map((group) => (
                    <div key={group} className="flex flex-col gap-3">
                      <SectionHeading>{group}</SectionHeading>
                      <ul className="flex flex-col gap-4">
                        {typeScale
                          .filter((item) => item.group === group)
                          .map((item) => (
                            <li key={item.name}>
                              <p className={item.className}>{item.sample}</p>
                              <p className="text-[11px] text-text-3">
                                {item.name} · {item.detail}
                              </p>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Rules</SectionHeading>
                  <ul className="flex max-w-3xl flex-col gap-2">
                    {typeRules.map((rule) => (
                      <li key={rule} className="text-[13px] text-text-2">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Examples</SectionHeading>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {typeExamples.map((example) => (
                      <Practice
                        key={example.topic}
                        topic={example.topic}
                        recommendation={example.do}
                        avoid={example.dont}
                      />
                    ))}
                  </div>
                </section>
              </CardBody>
            </Card>
          ) : null}
          {current.slug === "atomic-design" ? (
            <Card>
              <CardBody className="flex flex-col gap-8">
                <section className="flex flex-col gap-8">
                  {atomicLevels.map((level, index) => (
                    <div key={level.name} className="flex flex-col gap-3">
                      <SectionHeading>{`${index + 1}. ${level.name}`}</SectionHeading>
                      <div className="grid max-w-3xl gap-4 lg:grid-cols-2">
                        <p className="text-[13px] text-text-2">
                          <span className="mb-1 block font-medium text-heading">Create</span>
                          {level.create}
                        </p>
                        <p className="text-[13px] text-text-2">
                          <span className="mb-1 block font-medium text-heading">Use</span>
                          {level.use}
                        </p>
                      </div>
                      {level.name === "Atoms" ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <Button size="sm">Generate report</Button>
                          <Badge>New</Badge>
                          <Badge color="success">Paid</Badge>
                          <Input
                            aria-label="Sample field"
                            placeholder="Email address"
                            className="max-w-56"
                          />
                          <Switch defaultChecked aria-label="Email alerts" />
                        </div>
                      ) : null}
                      {level.name === "Molecules" ? (
                        <Stat
                          title="Conversion Rate"
                          value="0.81%"
                          change={{ value: "1.2%", direction: "up", hint: "than last week" }}
                        />
                      ) : null}
                      {level.name === "Organisms" ? (
                        <Card>
                          <CardHeader>
                            <CardTitle as="h3">Weekly revenue</CardTitle>
                          </CardHeader>
                          <CardBody className="flex flex-col gap-3">
                            <Stat
                              title="Conversion Rate"
                              value="0.81%"
                              change={{ value: "1.2%", direction: "up", hint: "than last week" }}
                            />
                            <Sparkline
                              data={[8, 12, 10, 14, 13, 18, 16, 21, 19, 24]}
                              label="Sample trend"
                            />
                          </CardBody>
                        </Card>
                      ) : null}
                    </div>
                  ))}
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Rules</SectionHeading>
                  <ul className="flex max-w-3xl flex-col gap-2">
                    {atomicRules.map((rule) => (
                      <li key={rule} className="text-[13px] text-text-2">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="flex flex-col gap-3">
                  <SectionHeading>Examples</SectionHeading>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {atomicExamples.map((example) => (
                      <Practice
                        key={example.topic}
                        topic={example.topic}
                        recommendation={example.do}
                        avoid={example.dont}
                      />
                    ))}
                  </div>
                </section>
              </CardBody>
            </Card>
          ) : null}
        </div>
      </div>
    </DashboardShell>
  );
}
