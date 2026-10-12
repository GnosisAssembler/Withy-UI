import type { ReactNode } from "react";
import { Eyebrow } from "../atoms/eyebrow";
import { Code } from "../molecules/code";
import { SectionNav } from "../molecules/section-nav";
import { Card, CardBody } from "../organisms/card";
import { PageHeader } from "../organisms/page-header";
import { cn } from "../../lib/cn";
import { DashboardShell } from "./dashboard-shell";

export const utilitySections = [
  {
    slug: "color",
    label: "Color",
    description:
      "Color utilities read the theme tokens. The same class shifts between light and dark.",
  },
  {
    slug: "typography",
    label: "Typography",
    description: "IBM Plex Sans is the interface. Rubik is for figures. Inter is for eyebrows.",
  },
  {
    slug: "spacing",
    label: "Spacing",
    description:
      "Space steps off a 4px unit. 10px sits between 8px and 12px, and it is the gap between cards.",
  },
  {
    slug: "radius",
    label: "Radius",
    description: "Corners use four radii. Controls use the smallest. Cards use the next.",
  },
  {
    slug: "shadow",
    label: "Shadow",
    description:
      "Cards use one elevation shadow. In dark mode that shadow is transparent, and the border does the work.",
  },
  {
    slug: "layout",
    label: "Layout",
    description: "Stack, Row, and Grid are the layout pieces. These are the classes they apply.",
  },
  {
    slug: "motion",
    label: "Motion",
    description: "Motion is limited to a spinner and a skeleton pulse.",
  },
] as const;

export type UtilitySection = (typeof utilitySections)[number]["slug"];

type UtilityItem = { name: string; use: string; sample: ReactNode };

type UtilityGroup = { heading?: string; text?: string; items: readonly UtilityItem[] };

function Swatch({ className }: { className: string }) {
  return <span className={cn("block h-8 w-full rounded-xs border border-border", className)} />;
}

const spaceRows = [
  { name: "gap-1", px: "4px", bar: "w-1", use: "An icon beside a label." },
  { name: "gap-2", px: "8px", bar: "w-2", use: "A button group." },
  { name: "gap-2.5", px: "10px", bar: "w-2.5", use: "The gap between cards." },
  { name: "gap-3", px: "12px", bar: "w-3", use: "Related items. Also p-3, compact padding." },
  { name: "gap-4", px: "16px", bar: "w-4", use: "Padding inside a card. Also p-4." },
  { name: "gap-5", px: "20px", bar: "w-5", use: "Padding around the page. Also p-5." },
  { name: "gap-6", px: "24px", bar: "w-6", use: "A block and the actions that follow it." },
  { name: "gap-8", px: "32px", bar: "w-8", use: "The space between sections." },
] as const;

export const utilityGuides = {
  color: [
    {
      heading: "Surfaces",
      items: [
        {
          name: "bg-background",
          use: "The page canvas.",
          sample: <Swatch className="bg-background" />,
        },
        {
          name: "bg-card",
          use: "Cards, menus, and dialogs.",
          sample: <Swatch className="bg-card" />,
        },
        {
          name: "bg-muted",
          use: "A quiet fill behind a group.",
          sample: <Swatch className="bg-muted" />,
        },
        { name: "bg-header", use: "The top bar.", sample: <Swatch className="bg-header" /> },
      ],
    },
    {
      heading: "Text",
      items: [
        {
          name: "text-heading",
          use: "Titles and the words that carry the point.",
          sample: <span className="text-[13px] text-heading">Heading</span>,
        },
        {
          name: "text-text",
          use: "Body copy.",
          sample: <span className="text-[13px] text-text">Body</span>,
        },
        {
          name: "text-text-2",
          use: "Supporting sentences.",
          sample: <span className="text-[13px] text-text-2">Support</span>,
        },
        {
          name: "text-text-3",
          use: "Hints and metadata.",
          sample: <span className="text-[13px] text-text-3">Hint</span>,
        },
        {
          name: "text-text-4",
          use: "The faintest label that still has a job.",
          sample: <span className="text-[13px] text-text-4">Faint</span>,
        },
      ],
    },
    {
      heading: "Roles",
      items: [
        {
          name: "bg-primary text-primary-foreground",
          use: "The main action and selected state.",
          sample: <Swatch className="bg-primary" />,
        },
        {
          name: "bg-secondary text-secondary-foreground",
          use: "A quiet action.",
          sample: <Swatch className="bg-secondary" />,
        },
        {
          name: "bg-success text-success-foreground",
          use: "Confirmation.",
          sample: <Swatch className="bg-success" />,
        },
        {
          name: "bg-info text-info-foreground",
          use: "Neutral information.",
          sample: <Swatch className="bg-info" />,
        },
        {
          name: "bg-warning text-warning-foreground",
          use: "A caution.",
          sample: <Swatch className="bg-warning" />,
        },
        {
          name: "bg-danger text-danger-foreground",
          use: "A destructive action or an error.",
          sample: <Swatch className="bg-danger" />,
        },
        { name: "bg-brand", use: "A deep panel.", sample: <Swatch className="bg-brand" /> },
      ],
    },
    {
      heading: "Accents",
      text: "Accents separate chart series and tags. They do not mean success, warning, or danger.",
      items: [
        { name: "bg-cyan", use: "Blue series.", sample: <Swatch className="bg-cyan" /> },
        { name: "bg-orange", use: "Peach series.", sample: <Swatch className="bg-orange" /> },
        { name: "bg-indigo", use: "Purple series.", sample: <Swatch className="bg-indigo" /> },
        { name: "bg-teal", use: "Mint series.", sample: <Swatch className="bg-teal" /> },
        { name: "bg-pink", use: "Pink series.", sample: <Swatch className="bg-pink" /> },
      ],
    },
    {
      heading: "Borders and focus",
      items: [
        {
          name: "border border-border",
          use: "The hairline on cards, fields, and menus.",
          sample: <span className="block h-8 w-full rounded-xs border border-border bg-card" />,
        },
        {
          name: "focus-visible:ring-4 focus-visible:ring-primary/25",
          use: "The focus ring on controls.",
          sample: <span className="block h-8 w-full rounded-xs ring-4 ring-primary/25" />,
        },
      ],
    },
  ],
  typography: [
    {
      items: [
        {
          name: "font-sans",
          use: "IBM Plex Sans. Body and headings.",
          sample: <span className="font-sans text-[13px] text-heading">Dashboard text</span>,
        },
        {
          name: "font-rubik",
          use: "Figures.",
          sample: (
            <span className="font-rubik text-[1.53125rem] leading-none text-heading">0.81%</span>
          ),
        },
        {
          name: "font-inter",
          use: "Eyebrows. 10px, semibold, uppercase.",
          sample: (
            <span className="font-inter text-[10px] font-semibold tracking-[0.5px] text-primary uppercase">
              Sales monitoring
            </span>
          ),
        },
        {
          name: "font-mono text-[12px]",
          use: "Code.",
          sample: <span className="font-mono text-[12px] text-heading">gap-2.5</span>,
        },
        {
          name: "text-[0.875rem] leading-[1.5]",
          use: "Body. 14px, line-height 1.5.",
          sample: <span className="text-[0.875rem] leading-[1.5] text-text">Body text</span>,
        },
        {
          name: "text-[13px]",
          use: "Compact interface text.",
          sample: <span className="text-[13px] text-text-2">Email alerts</span>,
        },
        {
          name: "font-medium",
          use: "Headings and emphasis. Weight 500.",
          sample: <span className="text-[13px] font-medium text-heading">Weekly revenue</span>,
        },
        {
          name: "font-semibold",
          use: "Eyebrows and badges. Weight 600.",
          sample: <span className="text-[13px] font-semibold text-heading">Paid</span>,
        },
      ],
    },
  ],
  spacing: [
    {
      items: spaceRows.map((step) => ({
        name: step.name,
        use: `${step.px}. ${step.use}`,
        sample: <span className={cn("block h-3 rounded-xs bg-primary/25", step.bar)} />,
      })),
    },
  ],
  radius: [
    {
      items: [
        {
          name: "rounded-xs",
          use: "3px. Controls, badges, menu items, and code.",
          sample: <span className="block h-10 w-full rounded-xs border border-border bg-muted" />,
        },
        {
          name: "rounded-sm",
          use: "4px. Cards, fields, and buttons.",
          sample: <span className="block h-10 w-full rounded-sm border border-border bg-muted" />,
        },
        {
          name: "rounded-md",
          use: "6px. A slightly softer panel.",
          sample: <span className="block h-10 w-full rounded-md border border-border bg-muted" />,
        },
        {
          name: "rounded-lg",
          use: "8px. The largest corner in the system.",
          sample: <span className="block h-10 w-full rounded-lg border border-border bg-muted" />,
        },
        {
          name: "rounded-full",
          use: "Circles. Avatars, switches, and the tick on a Do example.",
          sample: <span className="block size-10 rounded-full border border-border bg-muted" />,
        },
      ],
    },
  ],
  shadow: [
    {
      items: [
        {
          name: "shadow-elevation",
          use: "The card shadow. A 10px blur at 6% ink in light. Transparent in dark.",
          sample: (
            <span className="block h-12 w-full rounded-sm border border-border bg-card shadow-elevation" />
          ),
        },
      ],
    },
  ],
  layout: [
    {
      heading: "Flow",
      items: [
        {
          name: "flex flex-col gap-2",
          use: "Stack. Items down the page, 8px apart.",
          sample: (
            <span className="flex flex-col gap-2">
              <span className="h-3 rounded-xs bg-primary/20" />
              <span className="h-3 rounded-xs bg-primary/20" />
            </span>
          ),
        },
        {
          name: "flex flex-row flex-wrap items-center gap-2",
          use: "Row. Items across, wrapping.",
          sample: (
            <span className="flex flex-row flex-wrap items-center gap-2">
              <span className="h-3 w-6 rounded-xs bg-primary/20" />
              <span className="h-3 w-8 rounded-xs bg-primary/30" />
            </span>
          ),
        },
      ],
    },
    {
      heading: "Grid",
      items: [
        {
          name: "grid grid-cols-12 gap-2.5",
          use: "The 12-column grid. The gutter is 10px.",
          sample: (
            <span className="grid grid-cols-12 gap-2.5">
              <span className="col-span-8 h-4 rounded-xs bg-primary/20" />
              <span className="col-span-4 h-4 rounded-xs bg-primary/40" />
            </span>
          ),
        },
        {
          name: "col-span-12 md:col-span-8",
          use: "Full width below 768px, then 8 of 12 columns.",
          sample: <span className="block h-4 w-2/3 rounded-xs bg-primary/25" />,
        },
        {
          name: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
          use: "Equal columns. One, then two from 768px, then three from 1280px.",
          sample: (
            <span className="grid grid-cols-3 gap-1">
              <span className="h-4 rounded-xs bg-primary/20" />
              <span className="h-4 rounded-xs bg-primary/30" />
              <span className="h-4 rounded-xs bg-primary/40" />
            </span>
          ),
        },
      ],
    },
  ],
  motion: [
    {
      items: [
        {
          name: "animate-spin",
          use: "The spinner. A ring with a transparent edge.",
          sample: (
            <span className="inline-flex size-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
          ),
        },
        {
          name: "animate-pulse",
          use: "Skeleton placeholders while a region loads.",
          sample: <span className="block h-3 w-full animate-pulse rounded-xs bg-muted" />,
        },
      ],
    },
  ],
} as const satisfies Record<UtilitySection, readonly UtilityGroup[]>;

function UtilityMenu({ current }: { current: UtilitySection }) {
  return (
    <SectionNav
      label="CSS utilities"
      current={`/utilities/${current}`}
      className="lg:w-44"
      items={utilitySections.map((item) => ({
        label: item.label,
        href: `/utilities/${item.slug}`,
      }))}
    />
  );
}

function UtilityList({ items }: { items: readonly UtilityItem[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li
          key={item.name}
          className="grid items-center gap-3 border-b border-border py-3 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)]"
        >
          <div className="min-w-0">{item.sample}</div>
          <div className="min-w-0">
            <Code>{item.name}</Code>
            <p className="mt-1 text-[13px] text-text-2">{item.use}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function UtilitiesTemplate({ section = "color" }: { section?: UtilitySection }) {
  const current = utilitySections.find((item) => item.slug === section) ?? utilitySections[0];
  const groups: readonly UtilityGroup[] = utilityGuides[current.slug];

  return (
    <DashboardShell>
      <PageHeader
        crumbs={[
          { label: "Withy UI", href: "/" },
          { label: "CSS utilities", href: "/utilities/color" },
          { label: current.label },
        ]}
        title={current.label}
        description={current.description}
      />
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start">
        <UtilityMenu current={current.slug} />
        <div className="min-w-0 flex-1">
          <Card>
            <CardBody className="flex flex-col gap-8">
              {groups.map((group, index) => (
                <section key={group.heading ?? index} className="flex flex-col gap-3">
                  {group.heading ? <Eyebrow as="h2">{group.heading}</Eyebrow> : null}
                  {group.text ? (
                    <p className="max-w-3xl text-[13px] text-text-2">{group.text}</p>
                  ) : null}
                  <UtilityList items={group.items} />
                </section>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
