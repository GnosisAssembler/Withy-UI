# Withy UI

Withy UI is a React design system for dashboards, apps, and pages. Color, type, and density are shared across atoms, molecules, organisms, charts, widgets, and full-page examples. The components are built with Radix primitives and Tailwind CSS.

![Foundations](./media/foundations.png)

## Install

```bash
pnpm add withy-ui
```

Peer dependencies: `react` and `react-dom` 19 or newer, and Tailwind CSS 4.

## Setup

Add the fonts, tokens, and a Tailwind source scan to your global stylesheet. Tailwind does not scan `node_modules` unless you point it at the package.

```css
@import "tailwindcss";
@import "withy-ui/fonts.css";
@import "withy-ui/styles.css";
@source "../node_modules/withy-ui/dist";
```

Wrap the app in `WithyProvider` once. It holds the theme, tooltips, toasts, and router links. Withy UI links render an `<a>` unless you pass your router's link component, so in a Next.js app pass the link and the current path to keep navigation client-side. Next.js apps should also set `transpilePackages: ["withy-ui"]` in `next.config`.

```tsx
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

The boot script applies the saved skin before paint. Light is the default.

```tsx
import { themeBootScript } from "withy-ui";
import { Providers } from "./providers";

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

## Components

Import components, layout, and theme helpers from the package root. This entry does not load ECharts.

```tsx
import { AppShell, Button, FormField, Input, PageHeader } from "withy-ui";
```

Build pages inside `AppShell`. Pass it your `nav`, `logo`, header `actions`, and `footer`. Start each page with `PageHeader`, and lay regions out with `Card`, `Columns`, `Grid`, `Stack`, and `Row`.

Forms connect themselves: `FormField` gives the control inside it an id, a label, and its hint or error for assistive tech. Labeled choices are `CheckboxField`, `RadioField`, and `SwitchField`, grouped with `Fieldset`. The UI and scenario patterns have their own pieces, including `EmptyState`, `InlineMessage`, `SegmentedControl`, `CopyButton`, `IconButton`, `Tag`, `DataTable`, `SectionNav`, `DatePicker`, `ColorPicker`, `Dialog` with a danger tone, `Drawer`, `Overlay`, and toasts with an Undo action.

The docs site has a page for every component, under Components.

![Components](./media/components.png)

## Charts

```tsx
import { AreaChart } from "withy-ui/charts";
```

Area, line, bar, bubble, timeline, combo, donut, bar list, category bar, heatmap, radar, and treemap charts read the active skin. `echarts` is installed with the package and is only loaded from this entry.

![Charts](./media/charts.png)

## Widgets

```tsx
import { RevenueMap, SatisfactionScore } from "withy-ui/widgets";
```

The map, satisfaction score, acquisition panel, complaints panel, ticket status, activity feed, and holdings table live here. Pass your own series and rows. Insight cards that draw charts load the charts entry.

![Widgets](./media/widgets.png)

## Examples

```tsx
import { DashboardShell, ChartsGalleryTemplate } from "withy-ui/examples";
```

Page templates and the fixture data behind this guide are available as references. `DashboardShell` renders the docs site's navigation and footer, so build your own pages on `AppShell`.

![Calendar](./media/calendar.png)

![Settings](./media/settings.png)

## Skins

Light and dark. `ThemeProvider` stores the choice in `localStorage` under `withy-ui-theme` and sets `data-theme` on the document element.

![Components in the dark skin](./media/components-dark.png)

Fonts are IBM Plex Sans for interface text, Rubik for metrics, and Inter for eyebrows, badges, and breadcrumbs. `withy-ui/fonts.css` loads them.

## AI agent skill

The package ships an agent skill with the Withy UI guidelines: setup, a component chooser, every component's props, the foundations, the UI and scenario patterns, the CSS utilities, and a review checklist. Agents that load it build screens with Withy UI components and follow the design system's rules.

Add it to your project after installing the package:

```bash
npx withy-ui add-skill
```

This copies the skill to `.claude/skills/withy-ui`. Claude Code reads that folder, and so does Cursor. Run the command again after you upgrade withy-ui to refresh the skill. It replaces the folder, so keep your own notes elsewhere.

| Option         | Installs to                                                       |
| -------------- | ----------------------------------------------------------------- |
| none           | `.claude/skills/withy-ui`, for Claude Code and Cursor             |
| `--cursor`     | `.cursor/skills/withy-ui`, for Cursor only                        |
| `--global`     | The same folder in your home directory, for every project         |
| `--dir <path>` | `<path>/withy-ui`, for another agent that reads skills from there |

Install it in one place. Cursor reads both `.claude/skills` and `.cursor/skills`, and loads a skill twice when it is in both.

The skill is plain Markdown in `node_modules/withy-ui/skills/withy-ui`. Other tools can read it from there. In the Claude app, upload the folder as a zip from the Skills settings.

## Scripts

From this repo:

```bash
pnpm dev
pnpm storybook
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm changeset
```

`pnpm changeset` records a version bump. On `main`, GitHub Actions opens the version pull request and publishes `withy-ui` to npm with provenance. Versions stay on 0.x while the public API is settling.

The first publish needs a one-time setup on your npm account: create trusted publishing for `withy-ui` and attach the `GnosisAssembler/Withy-UI` GitHub repository. The release job uses GitHub's OIDC token, so the repo does not store an npm token.

## License

MIT
