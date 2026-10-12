---
name: withy-ui
description: Builds and reviews React interfaces with the Withy UI design system (the withy-ui npm package), covering setup, components, color and type tokens, layout, content rules, and the UI and scenario patterns. Use when writing, changing, or reviewing UI code that imports withy-ui, when building dashboards, forms, tables, settings, or app pages with Withy UI, or when the user mentions Withy, withy-ui, or this design system.
---

# Withy UI

Withy UI is a React design system for dashboards, apps, and pages, built on Radix and Tailwind CSS 4. A screen is assembled from atoms, molecules, organisms, and templates, and every color, size, and gap comes from its tokens. Follow this skill for any UI work in a project that uses `withy-ui`.

## Workflow

1. Check the setup below once per app.
2. Find the pattern for the job in [references/ui-patterns.md](references/ui-patterns.md) (forms, loading, empty states, navigation, notifications, saving, charts, failures) or [references/scenario-patterns.md](references/scenario-patterns.md) (copy, create, customize, delegate, delete, edit, filter, search, view).
3. Pick the smallest existing component that does the job, using the table below. Props and examples for every export are in [references/components.md](references/components.md). Don't rebuild a component from raw markup.
4. Lay the page out with `AppShell`, `PageHeader`, cards, and the layout pieces. Style any custom markup only with the token classes in [references/css-utilities.md](references/css-utilities.md).
5. Write the copy with the content rules.
6. Run the review checklist at the end of this file.

## Setup

Install `withy-ui`. Its peer dependencies are `react` and `react-dom` 19 or newer and `tailwindcss` 4. `lucide-react` comes with it.

Add the fonts, the tokens, and a source scan to the global stylesheet. Tailwind doesn't scan `node_modules`, so the `@source` line is required. Its path is relative to the CSS file.

```css
@import "tailwindcss";
@import "withy-ui/fonts.css";
@import "withy-ui/styles.css";
@source "../node_modules/withy-ui/dist";
```

Wrap the app once in `WithyProvider`. It holds the theme, tooltips, toasts, and router links. In the Next.js App Router, also add `transpilePackages: ["withy-ui"]` to `next.config`, then:

```tsx
// app/providers.tsx
"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { WithyProvider, type WithyLinkProps } from "withy-ui";

function AppLink({ href, ...props }: WithyLinkProps) {
  return <NextLink href={href} {...props} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <WithyProvider
      linkComponent={AppLink}
      pathname={pathname}
      onNavigate={(href) => router.push(href)}
    >
      {children}
    </WithyProvider>
  );
}
```

```tsx
// app/layout.tsx
import { themeBootScript } from "withy-ui";
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

In other React apps, render `<WithyProvider>` around the root, and pass `linkComponent`, `pathname`, and `onNavigate` from your router. Without them, links render a plain `<a>`.

Withy UI components are Client Components. A Server Component can render them when every prop is serializable: strings, numbers, arrays, and JSX. Props that take a function or a component reference, such as `onClick`, `onValueChange`, `icon={Search}`, or a table column's `cell`, need a file marked `"use client"`.

## Entry points

| Import from                                 | What it holds                                                                                                                                        |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `withy-ui`                                  | Every component, layout piece, provider, and helper. No charts.                                                                                      |
| `withy-ui/charts`                           | `AreaChart`, `LineChart`, `BarChart`, `TimelineChart`, `BubbleChart`, `ComboChart`, `DonutChart`, `BarList`, `CategoryBar`, `HeatmapChart`, `RadarChart`, `TreemapChart`, `Chart`. Loads ECharts. |
| `withy-ui/widgets`                          | Finished dashboard cards: `KpiCards`, `StatStrip`, `IconStats`, `StatusKpi`, `UsageMeters`, `SparkKpi`, `SplitKpi`, `ChannelSplit`, `ShareCards`, `RevenueMap`, `SatisfactionScore`, `AcquisitionPanel`, `ComplaintsPanel`, `TicketStatus`, `ActivityFeed`, `HoldingsTable`. |
| `withy-ui/examples`                         | The docs site's templates and fixture data. Read them as references. Don't ship them.                                                                |
| `withy-ui/styles.css`, `withy-ui/fonts.css` | Tokens and fonts.                                                                                                                                    |

## Choose a component

| Need                                      | Use                                                                                                                                                                                                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| App frame, navigation, footer             | `AppShell` with `nav`, `logo`, `actions`, `footer`                                                                                                                                                                                                                                         |
| Page title, breadcrumb, page actions      | `PageHeader`                                                                                                                                                                                                                                                                               |
| A region of a page                        | `Card` with `CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, `CardFooter`                                                                                                                                                                                                         |
| A moving light around one card or button  | `Aura`                                                                                                                                                                                                                                                                                     |
| A pixel-art mascot in a screen corner     | `Wraith`                                                                                                                                                                                                                                                                                   |
| Columns and spacing                       | `Columns` with `GridColumn span`, `Grid`, `Stack`, `Row`, `Box`, `Container`                                                                                                                                                                                                               |
| Panes beside the content                  | `LayoutBody`, `LayoutPane`, `LayoutContent`; `Sidebar` or `SectionNav` inside                                                                                                                                                                                                              |
| Resizable panels                          | `Splitter` with `SplitterPanel` and `SplitterResizeTrigger`                                                                                                                                                                                                                                |
| An action                                 | `Button`; `IconButton` when it has only an icon; `CopyButton` to copy                                                                                                                                                                                                                      |
| A selection that stays pressed            | `ToggleButton`                                                                                                                                                                                                                                                                             |
| A link in text                            | `Link`                                                                                                                                                                                                                                                                                     |
| A labeled field                           | `FormField` around `Input`, `InputOtp`, `NumberInput`, `Textarea`, `Select`, `Combobox`, `SelectPicker`, `ChipPicker`, `DatePicker`, `DateRangePicker`, `ColorPicker`, `ColorSlider`, `TimePicker`, `PasswordInput`, `SearchInput`, `Slider`, `FileInput`, `FileUploader`, or `InputGroup` |
| A one-time code                           | `InputOtp` inside `FormField`                                                                                                                                                                                                                                                              |
| A payment card                            | `CreditCardInput`                                                                                                                                                                                                                                                                          |
| Several options as removable chips        | `ChipPicker`                                                                                                                                                                                                                                                                               |
| One channel of a color                    | `ColorSlider` for hue, saturation, lightness, or alpha                                                                                                                                                                                                                                     |
| Move items between two lists              | `TransferList`                                                                                                                                                                                                                                                                             |
| A labeled choice                          | `CheckboxField`, `RadioField` inside `RadioGroup`, `SwitchField`; group them with `Fieldset`                                                                                                                                                                                               |
| One of a few views or filters             | `SegmentedControl`                                                                                                                                                                                                                                                                         |
| Panels in one place                       | `Tabs`                                                                                                                                                                                                                                                                                     |
| Sections that open and close              | `Accordion`                                                                                                                                                                                                                                                                                |
| Status or category label                  | `Badge` for status, `Tag` for a category or an active filter                                                                                                                                                                                                                               |
| A number                                  | `Figure`, `Stat`, `MetricTile`. For a group of dashboard metrics, use `KpiCards`, `StatStrip`, `IconStats`, `StatusKpi`, `UsageMeters`, `SparkKpi`, `SplitKpi`, `ChannelSplit`, or `ShareCards` from `withy-ui/widgets`                                                                     |
| Text                                      | `Heading`, `Text`, `Eyebrow`, `Code`, `CodeBlock`; `Truncate` when a line may not fit                                                                                                                                                                                                      |
| Exact figures                             | `DataTable` to show, sort, filter, page, and act on rows                                                                                                                                                                                                                                    |
| Trends and comparisons                    | `AreaChart`, `LineChart`, `BarChart`, `TimelineChart`, `BubbleChart`, `ComboChart`, `DonutChart`, `BarList`, `CategoryBar`, `HeatmapChart`, `RadarChart`, and `TreemapChart` from `withy-ui/charts`, plus `Sparkline`, `MeterList`, and `SegmentedMeter` |
| Sales by state                            | `RevenueMap` from `withy-ui/widgets`                                                                                                                                                                                                                                                       |
| Nothing to show                           | `EmptyState`                                                                                                                                                                                                                                                                               |
| A result next to the control              | `InlineMessage`                                                                                                                                                                                                                                                                            |
| A condition on a region                   | `Alert`; `Callout` for guidance                                                                                                                                                                                                                                                            |
| A change the person may miss              | `useToast()`, with an Undo `action` when it can be reversed                                                                                                                                                                                                                                |
| One task or decision in front of the page | `Dialog`, with `confirmLabel` and `tone="danger"` for a permanent delete                                                                                                                                                                                                                   |
| A panel from the side of the page         | `Drawer`                                                                                                                                                                                                                                                                                   |
| Your own content on a dimmed page         | `Overlay`                                                                                                                                                                                                                                                                                  |
| Actions behind a button                   | `PopupMenu`                                                                                                                                                                                                                                                                                |
| Actions on right click or long press      | `ContextMenu`                                                                                                                                                                                                                                                                              |
| A few related actions from one button     | `SpeedDial`                                                                                                                                                                                                                                                                                |
| A floating panel or hint                  | `Popup`, `Tooltip`                                                                                                                                                                                                                                                                         |
| Waiting                                   | `Spinner`, `Skeleton`, `Progress`, `Button loading`                                                                                                                                                                                                                                        |
| Progress through an ordered task          | `Stepper`                                                                                                                                                                                                                                                                                  |
| Moving through pages                      | `Pagination`, `Breadcrumb`, `CommandBar`                                                                                                                                                                                                                                                   |
| People and history                        | `Avatar`, `Media`, `Timeline`, `CalendarMonth`                                                                                                                                                                                                                                             |
| Product or portfolio photos on hover      | `HoverGallery`                                                                                                                                                                                                                                                                             |
| A scannable code for a link or short text | `QrCode`                                                                                                                                                                                                                                                                                   |
| A sequence of statuses over time          | `Tracker`                                                                                                                                                                                                                                                                                  |

Sample pages live in the Blocks category of the component docs: registration, profile, plan application, create workspace, members, invite members, account settings, settings screen, sign in, and sign up. Start from the closest block when the job is one of those pages.

## Rules for every screen

Full rules, with the do and don't examples from the docs, are in [references/foundations.md](references/foundations.md).

**Color**

- Use the role tokens: `primary` for the main action, links, and the current item; `success`, `info`, `warning`, and `danger` only for those meanings; `secondary` for quiet fills; `brand` for deep panels.
- Mark categories in charts and tags with the accents `cyan`, `orange`, `indigo`, `teal`, and `pink`. They never mean status.
- Never use the default Tailwind palette (`bg-blue-500`), hex values, arbitrary colors, or `dark:` variants. Tokens switch skins on their own.

**Type**

- One `h1` per page, from `PageHeader`. Then go down one level at a time. `CardTitle` is an `h2`; use `as="h3"` inside a region that already has one.
- IBM Plex Sans is for reading, Rubik (`Figure`) for numbers, Inter (`Eyebrow`) for small uppercase labels.
- Use weights 400, 500, and 600 only. Show emphasis with weight and size, not color.

**Space and layout**

- Gaps come from the scale: 4, 8, 10, 16, and 32px (`gap` `xs`, `sm`, `md`, `lg`, `xl`). Cards sit 10px apart. Card padding is 16 to 20px. Sections are 32px apart.
- Align cards to the 12-column grid. They fold to one column below 768px, and the content stays before panes and long link lists.
- Use `Container width="narrow"` for reading pages and focused forms.

**Icons**

- Use Lucide icons only, through `Icon` or directly inside a button. Keep Lucide's stroke and let the icon take the text color.
- Pair an icon with a word. An icon-only control is an `IconButton` with a `label`.

**Content**

- Sentence case everywhere. A button starts with a verb and has no period: Save changes, Create report, Delete invoice.
- Address the person as you. Name the problem and the fix: Enter a name between 2 and 20 characters.
- Link text says where it goes. Never write click here, Are you sure?, OK, Submit, easy, just, quick, or an exclamation mark.
- A confirm button repeats the verb of the button that opened it.

**Behavior**

- Every field has a visible label through `FormField`, `Fieldset`, or a choice field. A placeholder is not a label.
- A form saves with its button, which stays enabled. A switch saves when it changes and lives outside forms.
- Check the form on submit. Keep what was typed when something fails, and say what to do next.
- Show loading only for waits over about a second. Replace only the region that failed.
- Tell an empty list apart from a filtered one, and show how to clear filters.

## Page example

```tsx
"use client";

import { FileText } from "lucide-react";
import {
  AppShell,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Columns,
  DataTable,
  EmptyState,
  Footer,
  GridColumn,
  Logo,
  PageHeader,
  Stat,
} from "withy-ui";

const nav = [
  { label: "Overview", href: "/" },
  { label: "Invoices", href: "/invoices" },
  { label: "Customers", href: "/customers" },
];

export function InvoicesPage({
  invoices,
}: {
  invoices: { id: string; customer: string; amount: string }[];
}) {
  return (
    <AppShell nav={nav} logo={<Logo name="acme" />} footer={<Footer>© 2026 Acme Inc.</Footer>}>
      <PageHeader
        crumbs={[{ label: "Billing", href: "/" }, { label: "Invoices" }]}
        title="Invoices"
        description="Open invoices for this month."
        actions={<Button>Create invoice</Button>}
      />
      <Columns>
        <GridColumn span={8}>
          <Card>
            <CardHeader>
              <CardTitle>Open invoices</CardTitle>
            </CardHeader>
            <CardBody>
              {invoices.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No open invoices"
                  description="Invoices you send appear here until they are paid."
                  action={<Button size="sm">Create invoice</Button>}
                />
              ) : (
                <DataTable
                  caption="Open invoices"
                  rows={invoices}
                  getRowKey={(invoice) => invoice.id}
                  columns={[
                    { key: "id", header: "Invoice", cell: (invoice) => `#${invoice.id}` },
                    { key: "customer", header: "Customer", cell: (invoice) => invoice.customer },
                    {
                      key: "amount",
                      header: "Amount",
                      align: "right",
                      cell: (invoice) => invoice.amount,
                    },
                  ]}
                />
              )}
            </CardBody>
          </Card>
        </GridColumn>
        <GridColumn span={4}>
          <Card>
            <CardBody>
              <Stat
                title="Collected this month"
                value="$62,400"
                change={{ value: "8.2%", direction: "up", hint: "than last month" }}
              />
            </CardBody>
          </Card>
        </GridColumn>
      </Columns>
    </AppShell>
  );
}
```

## Review checklist

Check every screen before you finish:

- [ ] Setup: the CSS imports and `@source` line exist, and `WithyProvider` wraps the app.
- [ ] Every piece is a Withy UI component where one exists. No hand-built buttons, fields, tables, badges, menus, dialogs, drawers, or overlays.
- [ ] Colors are tokens. No Tailwind palette colors, hex values, or `dark:` variants. Status colors appear only for status.
- [ ] One `h1` per page, and heading levels don't skip.
- [ ] Gaps and padding come from the scale. No values between steps.
- [ ] Every field has a visible label. Errors say how to fix the value. The submit button stays enabled.
- [ ] Every icon-only control has a name. Every chart has a `label` and named series.
- [ ] Buttons start with a verb, use sentence case, and have no period. No click here, OK, or Are you sure?
- [ ] Loading, empty, filtered, and failed states exist where data loads, and each says what to do next.
- [ ] Destructive actions match their friction: `Dialog tone="danger"` for permanent, Undo for reversible.
- [ ] The page works on a narrow screen: one column, content first, every action still there.

## References

- [references/components.md](references/components.md): every export with its job, import, example, and props, plus charts, widgets, and providers.
- [references/foundations.md](references/foundations.md): color roles and values, content, icons, layout, spacing, typography, and atomic design.
- [references/ui-patterns.md](references/ui-patterns.md): data visualization, degraded experiences, empty states, forms, loading, navigation, notifications, and saving actions.
- [references/scenario-patterns.md](references/scenario-patterns.md): copy, create, customize, delegate, delete, edit, filter, search, and view.
- [references/css-utilities.md](references/css-utilities.md): token classes for color, type, spacing, radius, shadow, layout, and motion.
