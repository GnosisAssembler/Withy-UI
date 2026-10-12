# Foundations

The rules every Withy UI screen follows.

## Color

Color is grouped by job. Neutrals build the surface, semantic roles communicate status and action, and accents mark categories in charts and tags. Light and dark share the same roles. The values shift so text and fills stay readable in both modes.

### Semantic roles

| Role | Usage | Light | Dark | Classes |
| --- | --- | --- | --- | --- |
| Primary | Links, selected and active states, and the main action. | #0E7484 | #5ED4E2 | `bg-primary`, `text-primary`, `text-primary-foreground` |
| Brand | Deep panels and inverse surfaces. | #301A4B | #6A3C98 | `bg-brand` |
| Secondary | Quiet actions and soft fills. | #E6E0F0 | #564C6C | `bg-secondary`, `text-secondary-foreground` |
| Success | Positive change and confirmation. | #0E7A58 | #3DDBA6 | `bg-success`, `text-success`, `text-success-foreground` |
| Info | Informational highlights that are not the main action. | #3A6A8C | #8EBFDC | `bg-info`, `text-info`, `text-info-foreground` |
| Warning | Caution and states that need attention. | #B85E0C | #F0A44A | `bg-warning`, `text-warning`, `text-warning-foreground` |
| Danger | Errors and destructive actions. | #C41E36 | #FF6B78 | `bg-danger`, `text-danger`, `text-danger-foreground` |

Each role has one meaning. Use the solid color for emphasis, a light tint for a muted surface, and the role color itself for text and icons.

### Accents

Accents separate series in charts and tags. They do not mean success, warning, or danger.

| Accent | Hex | Token |
| --- | --- | --- |
| Blue | #48ACF0 | `cyan` |
| Peach | #F5D6BA | `orange` |
| Purple | #6B5CA5 | `indigo` |
| Mint | #8AFFC1 | `teal` |
| Pink | #FE5D9F | `pink` |

### Build it with Withy UI

- Use role tokens only: `bg-primary`, `text-danger`, `border-border`, `bg-muted`, and the rest in [css-utilities.md](css-utilities.md). They switch between light and dark on their own. Never use the default Tailwind palette (`bg-blue-500`), hex values, or `dark:` variants.
- Emphasis is a solid fill: `Button`, `Badge`. Muted is a tint: `Badge variant="muted"`, or `bg-primary/10 text-primary`. Foreground is the role color on text and icons: `Text tone="danger"`, `InlineMessage`.
- Text on a tint uses the role color (`bg-warning/15 text-warning`). The `-foreground` colors are only for text on a solid fill.
- Categories use accents: `Tag color="cyan"`, `Badge variant="muted" color="indigo"`, and the accent chart colors. Status uses roles: `Badge color="success"`, `Alert`, `InlineMessage`.

## Content

Interface text should be plain, consistent, and specific. These rules cover labels, buttons, errors, and empty states.

### Principles

- **Clear.** Use plain words and short sentences. Say the straightforward thing, especially in errors, waiting states, and empty screens.
- **Consistent.** Use one word for one action everywhere. A confirmation should repeat the verb on the button that triggered it.

### Rules

- Use sentence case for titles, labels, and buttons. Don’t put a period on a button.
- Start an action with a verb, such as Save changes or Create report.
- Address the user as “you”, and what belongs to them as “your”.
- Name the problem and the fix. Don’t blame the user, apologize, or joke.
- Write link text that says where it goes. Don’t use “click here”.
- Skip easy, just, quick, and exclamation marks.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Errors | Enter a name between 2 and 20 characters. | Error 4091. You forgot your name. |
| Buttons | Save email preferences | Save Email Preferences. |
| Links | Read the billing guide | Click here |

### Build it with Withy UI

- Buttons use sentence case, start with a verb, and have no period: Save changes, Create report, Delete invoice. A confirm button repeats the verb of the button that opened it.
- A field error in `FormField error` names the problem and the fix: Enter a name between 2 and 20 characters.
- Links use `Link`, with text that says where it goes: Read the billing guide.
- Empty states say what the space is for. Filtered empty states name the filter.
- Never write Are you sure?, OK, Yes, Submit, click here, easy, just, quick, or an exclamation mark.

## Icons

Icons come from Lucide. They are line drawings that follow the text color. Most are decorative. An icon carries meaning on its own only when you give it a name.

### Sizes

- `sm` — Small: 14px, beside compact text
- `md` — Medium: 16px, the default
- `lg` — Large: 20px, empty states

### Rules

- Use Lucide, and pass the icon to the Icon atom. Don’t mix in another set or emoji.
- Inside a button, place the Lucide icon directly. The button sets the size.
- Keep Lucide’s stroke. Don’t restyle one icon to look heavier or filled.
- Let the icon inherit the text color around it. Color an icon only when that color has a meaning, such as danger.
- Pair an icon with a word. Use an icon alone only on a control that already has an accessible name.
- Use one icon for one action. Search stays Search on every screen.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Decorative | A Search icon beside the word Search. Leave label off so the icon stays hidden from assistive tech. | A Search icon as the only content, with no word and no name. |
| Icon buttons | A Bell button with the accessible name Notifications. | A Bell button with no name. |
| Meaning | Name the icon Session timeout when no nearby text does. | Use a tooltip, or an emoji, as the only name. |

### Build it with Withy UI

- Import icons from `lucide-react`, which installs with withy-ui. Draw one with `<Icon icon={Search} />` (`size` `sm`, `md`, or `lg`), or place the Lucide component directly inside `Button`, `PopupMenuItem`, `NavItem`, or `Callout icon`.
- An icon-only action is an `IconButton` with a `label`, which is its accessible name. Add `tooltip` to show the label on hover and focus.
- Give `Icon` a `label` only when no text nearby names it.

```tsx
<Button color="white" size="sm">
  <Download /> Export
</Button>
<IconButton icon={Bell} label="Notifications" tooltip />
```

## Layout

A page reads from top to bottom, then left to right. Keep one subject in view, and let the columns fold down when the screen gets narrower.

### Pieces

- **Box.** Pads the inside of a region.
- **Stack.** Groups items down the page.
- **Row.** Groups items across, and wraps them.
- **Rows.** Stacks full-width bands with the page gap.
- **Grid.** Equal columns that fold down on a narrow screen.
- **Columns.** The 12-column grid. GridColumn sets how many a region spans.
- **Container.** Caps the width: fluid, wide, or narrow.
- **Layout.** Header, content, start pane, end pane, and footer.

### Viewport ranges

| Range | Width | Columns | Use |
| --- | --- | --- | --- |
| Narrow | Under 768px | 1 | Phones. One column. |
| Regular | 768px and up | Up to 2 | A pane beside the content. |
| Wide | 1280px and up | Up to 3 | A pane on each side, or a wider card grid. |

The breakpoint ruler is sm 640, md 768, lg 1024, xl 1280, and 2xl 1536. Use one only to adjust a detail, such as padding. The shell pads the main area by 20px, 25px from 1024px, and 30px from 1280px.

The main area is 12 columns with a 10px gutter, the same gap used between cards. Breakpoints follow the viewport, even when a side pane is open.

### Containers

| Container | Width | Use |
| --- | --- | --- |
| Fluid | No maximum | Dashboards, tables, and boards. |
| Wide | 1280px, centered | Pages that should stay readable on a large monitor. |
| Narrow | 768px, centered | Articles and focused forms. |

### Regions

Header holds the title and actions. Content holds the subject. The start pane holds navigation or filters, and the end pane holds detail. Footer holds quiet links. On a narrow screen the content stays first, and the panes follow it. From 1024px, the start pane sits on the left.

### Rules

- Give the page one subject. Panes support it. They don’t compete with it.
- On a narrow screen, use one column. Keep every action that exists on a wide screen.
- Keep the content first when regions stack. Don’t put a long list of links above the subject.
- Align cards, tables, and forms to the 12 columns. Space buttons and icons with Row and Stack.
- Use a narrow container when the page is mostly text, so a line stays readable.
- Leave dialogs, menus, and tooltips off the grid. They float above the page.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Columns | A card spans 8 columns, and a detail pane spans 4. | A paragraph stretches across all 12 columns on a large monitor. |
| Narrow screens | Regions stack into one column, with the content first. | Three panes stay side by side on a phone. |
| Inside a card | Buttons sit in a Row, with the gap from the spacing scale. | Each button is snapped to its own grid column. |

### Build it with Withy UI

- Wrap the app in `AppShell`. It places the header, pads the main area by 20, 25, and 30px, and adds your footer.
- Start each page with `PageHeader`: the crumbs, the one `h1`, a description, and the page actions.
- Align regions to the 12 columns with `Columns` and `GridColumn span`; they stack below 768px. Use `Grid columns={2}`, `3`, or `4` for equal cards. Cards sit 10px apart.
- Use `Container width="narrow"` for reading pages and focused forms, and `wide` to stop at 1280px.
- Use `LayoutBody`, `LayoutPane side="start"` or `"end"`, and `LayoutContent` for panes. The content stays first on a narrow screen.

```tsx
<AppShell nav={nav} logo={<Logo name="acme" />} footer={<Footer>© 2026 Acme Inc.</Footer>}>
  <PageHeader title="Overview" description="Revenue and orders for this week." />
  <Columns>
    <GridColumn span={8}>
      <Card>…</Card>
    </GridColumn>
    <GridColumn span={4}>
      <Card>…</Card>
    </GridColumn>
  </Columns>
</AppShell>
```

## Spacing

Space steps off a 4px unit. 10px sits between 8px and 12px, and it is the gap between cards. Stack and Row use 4, 8, 10, 16, and 32. Box padding uses 12, 16, and 20.

### Small

4px and 8px. Use these inside compact pieces: an icon and its label, a badge, a table cell, or a button group.

- 4px (`gap-1`, `p-1`): An icon beside a label, or a tight control.
- 8px (`gap-2`, `p-2`): A button group, or a compact row.

### Medium

10px to 24px. Use these for cards, fields, and page padding. 10px is the gap between cards.

- 10px (`gap-2.5`, `p-2.5`): The gap between cards. This is the page rhythm.
- 12px (`gap-3`, `p-3`): Related items, and compact padding.
- 16px (`gap-4`, `p-4`): Padding inside a card.
- 20px (`gap-5`, `p-5`): Padding around the page.
- 24px (`gap-6`, `p-6`): A block and the actions that follow it.

### Large

32px. Use this between sections, so a new subject has room.

- 32px (`gap-8`, `p-8`): The space between sections.

### Rules

- Use the same gap for the same kind of item. Every card in a row shares one step.
- Put related items closer than unrelated ones. A label sits nearer its field than the next field.
- Give a section more space than the items inside it.
- Repeat one gap down a list, so the list can be scanned.
- If a shape looks uneven, move to the next step. Don’t invent a size between steps.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Similarity | Every card in a row is 10px apart. | Some cards are 8px apart and others are 16px apart. |
| Proximity | 4px between an icon and its label, then 16px before the next group. | 16px between the icon and the label, the same as between groups. |
| Hierarchy | 32px between sections, and 8px between a title and its description. | 32px between a title and its description. |

### Build it with Withy UI

- `Stack` and `Row` take `gap`: `xs` 4px, `sm` 8px, `md` 10px, `lg` 16px, `xl` 32px. `Grid`, `Columns`, and `Rows` default to `md`, the 10px gap between cards.
- `Box` takes `padding`: `sm` 12px, `md` 16px, `lg` 20px. `CardBody` pads 16px top and bottom and 20px on the sides.
- In custom markup, use the same steps: `gap-1`, `gap-2`, `gap-2.5`, `gap-3`, `gap-4`, `gap-5`, `gap-6`, `gap-8`, and the matching `p-` and `m-` classes. Don't use values between the steps, such as `gap-[7px]`.

## Typography

Type is set in rem so it follows the browser’s text size. IBM Plex Sans carries the interface. Rubik carries figures. Inter carries eyebrows.

### Typefaces

- **IBM Plex Sans** — Body and headings. `text-sm`
- **Rubik** — Figures. `font-rubik text-[1.53125rem] leading-none`
- **Inter** — Eyebrows. `font-inter text-[10px] font-semibold tracking-[0.5px] uppercase`

### Type scale

| Style | Group | Spec | Classes |
| --- | --- | --- | --- |
| Body | Body | 14px · IBM Plex Sans · 400 · line-height 1.5 | `text-[0.875rem] leading-[1.5]` |
| UI | Body | 13px · IBM Plex Sans · 400 | `text-[13px]` |
| Caption | Body | 11px · IBM Plex Sans · 400 | `text-[11px] text-text-3` |
| Display | Headings | 35px · IBM Plex Sans · 500 | `text-[2.1875rem] leading-tight font-medium tracking-[-0.5px]` |
| Heading 2 | Headings | 28px · IBM Plex Sans · 500 | `text-[1.75rem] leading-tight font-medium` |
| Page title | Headings | 21px · IBM Plex Sans · 500 | `text-[1.3125rem] leading-tight font-medium tracking-[-0.5px]` |
| Card title | Headings | 17.5px · IBM Plex Sans · 500 | `text-[1.09375rem] leading-tight font-medium` |
| Heading 6 | Headings | 14px · IBM Plex Sans · 500 | `text-sm leading-tight font-medium` |
| Metric | Figures | 24.5px · Rubik · 400 | `font-rubik text-[1.53125rem] leading-none font-normal` |
| Eyebrow | Labels | 10px · Inter · 600 | `font-inter text-[10px] font-semibold tracking-[0.5px] uppercase` |
| Code | Labels | 12px · monospace · 400 | `font-mono text-[12px]` |

### Rules

- Use one h1 on a page, then the next heading level. Don’t skip from an h1 to an h4.
- Use size and weight for emphasis. Color marks status, such as danger, and does not rank the text.
- Align text to the left. Keep a reading line near 80 characters, in a narrow container.
- Body text uses a line-height of 1.5. Headings use 1.25.
- IBM Plex Sans is for reading. Rubik is for figures. Inter is for eyebrows.
- Use 400, 500, or 600. Don’t add another weight.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Headings | One h1, then an h2 for the next section. | A div styled to look like a heading, or a jump from h1 to h4. |
| Emphasis | A heavier weight on the words that matter. | The important sentence set in the primary color. |
| Figures | 0.81% set in Rubik. | A metric set in IBM Plex Sans at body size. |

### Build it with Withy UI

- `Heading level` sets the outline and `size` sets the look. `PageHeader` renders the page's one `h1`. `CardTitle` is an `h2`; pass `as="h3"` inside a region that already has an `h2`.
- `Text` sets copy: `size="md"` 14px body, `sm` 13px interface text, `xs` 11px captions. `tone` carries meaning (`secondary`, `muted`, `danger`), and `weight="medium"` carries emphasis.
- `Figure` sets numbers in Rubik: `sm` 13px in tables and rows, `md` 24.5px for metrics, `lg` 35px for a headline number.
- `Eyebrow` sets the 10px Inter uppercase label above a title or a figure.
- `Code` sets inline code, and `CodeBlock` shows a snippet.

## Atomic design

Screens are built from smaller pieces. Each layer has one kind of job. A component contains only smaller layers, so a change in a button reaches every screen that uses it.

### Atoms

- **Create.** Build one control or one mark. An atom does not contain another component. Button, Badge, Input, and Switch are atoms.
- **Use.** Place the atom wherever that single piece is needed. Change it with props, rather than copying it.

### Molecules

- **Create.** Build a molecule when the same atoms always travel together for one job. A Stat is a label, a figure, and a change.
- **Use.** Use the molecule. Don’t paste its atoms into every screen that needs the same job.

### Organisms

- **Create.** Build a section of a screen. A Card can hold a Stat and a Sparkline. It can contain molecules and atoms.
- **Use.** Use an organism as a region of a page. It does not become the page, and it does not contain a template.

### Templates

- **Create.** Build the page structure from organisms. Charts, Widgets, Calendar, and Settings are templates inside the dashboard shell.
- **Use.** Fill a template with the content for that screen. A page is a template with real data. Don’t draw a new shell when one already fits.

### Rules

- Add a component at the smallest layer that can do the job.
- An atom does not import a molecule. A molecule does not import an organism. A component only contains smaller layers.
- If the same group of atoms is copied twice, make a molecule.
- A template owns the page. An organism owns a section. A molecule owns one job.
- Change a shared piece in its own layer, so every screen that uses it stays in step.

### Examples

| Topic | Do | Don’t |
| --- | --- | --- |
| Building | A Stat molecule, when a label and a figure always appear together. | The same label, figure, and change pasted into every card. |
| Direction | A Card organism that contains a Stat. | A Stat that contains a Card. |
| Pages | The settings template, filled with the fields for that screen. | A new page shell for one form. |

### Build it with Withy UI

- Reach for the smallest existing piece in [components.md](components.md): atoms such as `Button` and `Badge`, molecules such as `FormField`, `Stat`, and `EmptyState`, organisms such as `Card`, `DataTable`, and `PageHeader`, and the `AppShell` template.
- When the same group of Withy UI pieces repeats twice in your app, make your own molecule from them instead of copying the markup.
- Change a Withy UI component through its props and `className`. Don't fork a copy.
