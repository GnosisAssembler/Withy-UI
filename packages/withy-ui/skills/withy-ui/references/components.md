# Components

Every export of `withy-ui`, grouped the way the docs group them: layout, atoms, molecules, organisms, widgets, and charts. Blocks at the end are sample pages assembled from those components. They are not separate exports. Each component entry gives the job, an import and a short example, and the props that matter.

Import everything below from `withy-ui` unless it says otherwise. Types such as `ButtonProps`, `Column`, `AdvancedColumn`, `SidebarSection`, `TimelineItem`, `ToastInput`, and `ChartSeries` are exported next to their components.

## Setup and providers

- `WithyProvider` wraps the app once. It holds the theme, tooltips, toasts, and router links. Props: `linkComponent` (your router's link), `pathname`, `onNavigate`, `tooltipDelay`.
- `ThemeProvider`, `useTheme()` (returns `{ theme, setTheme }`), `themes`, `themeBootScript`, and `themeStorageKey` handle the light and dark skin. Render `themeBootScript` in a `<script>` before the app so the saved skin applies before paint.
- `TooltipProvider`, `ToastProvider`, `WithyLinkProvider`, `WithyNavigationProvider`, and `useWithyNavigation()` are the single providers inside `WithyProvider`, for an app that composes them by hand.
- `WithyLink` is the router-aware anchor the components use internally. Use `Link` for visible links.
- `cn(...classes)` merges class names and resolves Tailwind conflicts.
- `spaceScale` and `spaceRanges` describe the spacing scale as data.
- `SproutMark` is the Withy UI sprout. `Logo` uses it unless you pass your own `mark`.

## Layout

### App shell

The app shell places the header, the main area, and the footer, and pads the page by 20, 25, and 30px as it widens.

```tsx
import { AppShell, Footer, Logo } from "withy-ui";

<AppShell
  nav={[{ label: "Invoices", href: "/invoices" }]}
  logo={<Logo name="acme" mark={<AcmeMark />} />}
  footer={<Footer>© 2026 Acme Inc.</Footer>}
>
  <PageHeader title="Invoices" />…
</AppShell>;
```

Props: `nav`, `pathname`, `logo`, `actions`, `themeSwitcher`, `footer`, and the page as children. It renders the fixed `Header`, a padded `main`, and the footer.

### Box

A box pads the inside of a region by 12, 16, or 20px.

```tsx
import { Box } from "withy-ui";

<Box padding="md">…</Box>;
```

Props: `padding` (`none`, `sm` 12px, `md` 16px, `lg` 20px).

### Container

A container caps the width. Fluid fills the main area, wide stops at 1280px, and narrow stops at 768px for reading.

```tsx
import { Container } from "withy-ui";

<Container width="narrow">…</Container>;
```

Props: `width` (`fluid`, `wide` by default, `narrow`).

### Grid

Grid lays out equal columns that fold down on a narrow screen. Columns and Grid column align regions to the 12-column grid.

```tsx
import { Columns, Grid, GridColumn } from "withy-ui";

<Grid columns={3}>…</Grid>

<Columns>
  <GridColumn span={8}>Content</GridColumn>
  <GridColumn span={4}>Pane</GridColumn>
</Columns>
```

`Grid columns`: 1, 2, 3, 4, 6, or 12, folding down on narrow screens, and `gap`. `Columns` is the 12-column grid with `gap`. `GridColumn span` is 1 to 12; it is full width below 768px unless `collapse={false}`.

### Layout

Layout places a header, the content, a start pane, an end pane, and a footer. The content stays first on a narrow screen.

```tsx
import {
  Layout,
  LayoutBody,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPane,
} from "withy-ui";

<Layout>
  <LayoutHeader>…</LayoutHeader>
  <LayoutBody>
    <LayoutPane side="start">Filters</LayoutPane>
    <LayoutContent>Invoices</LayoutContent>
    <LayoutPane side="end">Details</LayoutPane>
  </LayoutBody>
  <LayoutFooter>…</LayoutFooter>
</Layout>;
```

`Layout` stacks regions 10px apart. `LayoutBody` becomes a row from 1024px. `LayoutPane side`: `start` (240px; after the content on a narrow screen) or `end` (256px). `LayoutContent` takes the rest.

### Stack

Stack groups items down the page. Row groups them across and wraps. Rows stacks full-width bands 10px apart.

```tsx
import { Button, Row, Rows, Stack } from "withy-ui";

<Stack gap="sm">…</Stack>
<Row>
  <Button>Save changes</Button>
  <Button color="white">Cancel</Button>
</Row>
```

`Stack` and `Row` take `gap` (`xs` 4px, `sm` 8px, `md` 10px, `lg` 16px, `xl` 32px) and `align` (`start`, `center`, `end`, `stretch`). `Row` wraps by default. `Rows` takes `gap` (`md` by default).

### Splitter

A splitter lets people resize panels by dragging the handle between them.

```tsx
import {
  Splitter,
  SplitterContext,
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterResizeTriggerIndicator,
  SplitterResizeTriggerSeparator,
  useSplitterContext,
} from "withy-ui";

<Splitter panels={[{ id: "invoices" }, { id: "details" }]} defaultSize={[60, 40]}>
  <SplitterPanel id="invoices">Invoices</SplitterPanel>
  <SplitterContext>
    {(splitter) => (
      <SplitterResizeTrigger id="invoices:details" onDoubleClick={() => splitter.resetSizes()}>
        <SplitterResizeTriggerSeparator />
        <SplitterResizeTriggerIndicator />
      </SplitterResizeTrigger>
    )}
  </SplitterContext>
  <SplitterPanel id="details">Details</SplitterPanel>
</Splitter>;
```

Give the splitter a height. `orientation` is `horizontal` by default, or `vertical`. `panels` sets `minSize`, `maxSize`, `collapsible`, `collapsedSize`, and `resizeBehavior` (`preserve-relative-size` or `preserve-pixel-size`). A size is a percentage, or a length such as `240px`. `size` and `onResize` control the panels; `onResize` reports percentages. `keyboardResizeBy` is the arrow-key step in percentage points, 1 by default. Shift moves 10. Home and End jump to the ends. Enter collapses a collapsible panel. Arrow keys, Home, and End follow the writing direction.

`SplitterResizeTrigger` draws `SplitterResizeTriggerSeparator` and `SplitterResizeTriggerIndicator` when it has no children. The trigger id is `before:after`. Pass `disabled` to keep those panels fixed. `useSplitterContext()` and `SplitterContext` expose `size`, `setSize`, `resetSizes`, `collapsePanel`, `expandPanel`, `isPanelCollapsed`, `isPanelExpanded`, `getPanelSize`, and `resizePanel`.

## Atoms

### Aura

An aura draws a moving light around the one card or button you want to stand out. Give the wrapped component an opaque background, and use the same corner radius.

```tsx
import { Aura, Button, Card, CardBody, Text } from "withy-ui";

<Aura>
  <Card>
    <CardBody>
      <Text>This plan includes priority support.</Text>
    </CardBody>
  </Card>
</Aura>
<Aura variant="rainbow" radius="full">
  <Button shape="pill">Subscribe</Button>
</Aura>
```

Props: `variant` (`default` for a spinning border, `dual`, `rainbow`, `holo`, `gold`, `silver`, or `glow` for a steady light), `size` (`xs`, `sm`, `md`, `lg`, `xl`) sets the thickness, `color` (`primary`, `brand`, and the accents `pink`, `orange`, `indigo`, `teal`, `cyan`) colors the default, dual, and glow lights. Rainbow, holo, gold, and silver bring their own colors. `radius` (`none`, `xs`, `sm`, `md`, `lg`, `full`) matches the wrapped component (`sm` matches Card and Button, `full` matches a pill). `duration` is the spin length in milliseconds, 6000 by default and 20000 for holo. The light stays still when reduced motion is on.

### Avatar

An avatar shows a person or a team. Initials stand in when there is no image, or while it loads.

```tsx
import { Avatar } from "withy-ui";

<Avatar initials="IC" />
<Avatar initials="AD" tone="success" size="sm" />
<Avatar src="/people/ada.jpg" alt="Ada Lovelace" initials="AL" size="lg" />
```

Props: `initials` (required), `src`, `alt`, `size` (`xs`, `sm`, `md`, `lg`), `tone` (`primary`, `success`, `info`, `warning`, `danger`, `pink`, `indigo`).

### Badge

A badge labels a status or a category in a word or two. Use the solid fill for emphasis and the muted tint for a quiet label.

```tsx
import { Badge } from "withy-ui";

<Badge color="success">Paid</Badge>
<Badge variant="muted" color="warning">Due soon</Badge>
<Badge variant="muted" color="cyan">Design</Badge>
```

Props: `color` (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`, and the accents `pink`, `orange`, `indigo`, `teal`, `cyan`), `variant` (`contained` for emphasis, `muted` for a tint, `text`), `shape` (`rounded`, `square`, `pill`).

### Button

A button starts an action. Its label starts with a verb, such as Save changes, and has no period.

```tsx
import { Button } from "withy-ui";

<Button>Save changes</Button>
<Button color="white">Export</Button>
<Button variant="outlined">Preview</Button>
<Button color="danger">Delete invoice</Button>
<Button loading>Save changes</Button>
```

Props: `variant` (`contained`, `outlined`, `text`), `color` (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`, `white`, `brand`), `size` (`xs`, `sm`, `md`, `lg`), `shape` (`rounded`, `square`, `pill`), `fullWidth`, `loading`, `active`, `icon` (square, icon only; prefer `IconButton`), `asChild` (render your link: `<Button asChild><Link href="/reports">Open reports</Link></Button>`). It defaults to `type="button"`, so pass `type="submit"` in a form. `color="white"` is the quiet button for most toolbar and secondary actions. Use `ToggleButton` when the button stays pressed.

### Checkbox

A checkbox turns one option on or off. Give it a name, or use Checkbox field for a visible label.

```tsx
import { Checkbox } from "withy-ui";

<Checkbox aria-label="Select invoice #1048" />
<Checkbox aria-label="Select all invoices" checked="indeterminate" />
```

Radix checkbox. Props: `checked` (`true`, `false`, or `"indeterminate"`), `defaultChecked`, `onCheckedChange`, `disabled`, `id`. Prefer `CheckboxField` for a labeled option.

### Color slider

A color slider sets one channel of a color. Hue draws a rainbow, and saturation, lightness, and alpha follow the rest of the current color. Show the color in the hint.

```tsx
import { ColorSlider, FormField } from "withy-ui";

<FormField label="Hue" hint={color}>
  <ColorSlider channel="hue" value={color} onValueChange={setColor} />
</FormField>
<FormField label="Saturation">
  <ColorSlider channel="saturation" value={color} onValueChange={setColor} />
</FormField>
<FormField label="Lightness">
  <ColorSlider channel="lightness" value={color} onValueChange={setColor} />
</FormField>
<FormField label="Alpha">
  <ColorSlider channel="alpha" value={color} onValueChange={setColor} />
</FormField>
```

Props: `value` or `defaultValue` (a `#rgb`, `#rrggbb`, `#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, or `hsla()` color), `onValueChange` (the next color, in the same format), `channel` (`hue` by default, `saturation`, `lightness`, `alpha`), `orientation` (`horizontal` or `vertical`), `disabled`, `name` (submits the color with a form). Name it with `FormField` or `aria-label`. The thumb's value text is the color.

### Eyebrow

An eyebrow is the small Inter label above a title or a figure. Use it for a section label, not for a sentence.

```tsx
import { Eyebrow, Figure } from "withy-ui";

<Eyebrow as="h2">Sales monitoring</Eyebrow>
<Eyebrow tone="muted">Conversion rate</Eyebrow>
<Figure>0.81%</Figure>
```

Props: `as` (`p`, `span`, `h2` to `h6`), `tone` (`primary` by default, `muted`, `heading`).

### Figure

A figure sets a number in Rubik, so metrics read the same on every screen. Use sm inside tables and rows.

```tsx
import { Figure } from "withy-ui";

<Figure size="lg">9.8</Figure>
<Figure>0.81%</Figure>
<Figure as="span" size="sm">$1,240.00</Figure>
```

Props: `size` (`sm` 13px, `md` 24.5px by default, `lg` 35px), `as` (`p` or `span`). Figures use tabular numbers.

### Heading

A heading names a section. Set level for the page outline and size for the look, so you never skip a level.

```tsx
import { Heading } from "withy-ui";

<Heading level={2}>Account settings</Heading>
<Heading level={3} size={5}>Billing</Heading>
```

Props: `level` (1 to 6, default 4) and `size` (1 to 6) to set the look apart from the level. Sizes: 1 is 35px, 2 is 28px, 3 is 24.5px, 4 is 21px, 5 is 17.5px, 6 is 14px.

### Icon

Icon draws a Lucide icon at 14, 16, or 20px. It is hidden from assistive tech unless you give it a label.

```tsx
import { Icon } from "withy-ui";

import { Search } from "lucide-react";

<Icon icon={Search} size="sm" />
<Icon icon={Search} label="Search" />
```

Props: `icon` (a Lucide icon), `size` (`sm` 14px, `md` 16px, `lg` 20px), `label` (makes the icon meaningful; without it the icon is hidden from assistive tech).

### Input

An input takes one line of text. Put it in a form field so it has a visible label, a hint, and an error.

```tsx
import { FormField, Input } from "withy-ui";

<FormField label="Report name" hint="Shown on the report cover.">
  <Input defaultValue="Weekly revenue" />
</FormField>;
```

Native input props, plus `fieldSize` (`sm` 34px, `md` 38px by default). It reads its id, hint, and error from `FormField`.

### Kbd

Kbd shows a key or a shortcut.

```tsx
import { Kbd } from "withy-ui";

<Kbd>⌘</Kbd><Kbd>K</Kbd>
```

Native `kbd` props.

### Label

A label names a control and moves focus to it when clicked. Form field adds one for you.

```tsx
import { Input, Label } from "withy-ui";

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

Radix label with `htmlFor`. `FormField` and the choice fields render it for you.

### Link

A link opens another place. Its text says where it goes. It uses your router when you pass one to Withy provider.

```tsx
import { Link } from "withy-ui";

Read the <Link href="/billing/guide">billing guide</Link>.
<Link href="https://lucide.dev" external>Lucide</Link>
```

Props: `href` (required), `external` (opens a new tab and tells screen readers), and anchor props. It uses the router link passed to `WithyProvider`.

### Progress

Progress shows how far a task has gone. Name the task beside it. When the end is not known yet, use the indeterminate animation.

```tsx
import { Progress } from "withy-ui";

<Progress value={62} aria-label="Exporting report" />
<Progress value={62} animation="stripes" aria-label="Uploading files" />
<Progress value={40} animation="shimmer" color="info" aria-label="Syncing contacts" />
<Progress animation="indeterminate" aria-label="Preparing export" />
<Progress value={100} color="success" aria-label="Import complete" />
```

Props: `value` (0 to 100), `color` (`primary`, `success`, `info`, `warning`, `danger`), `animation` (`fill` eases to the value, `stripes` moves stripes across it, `shimmer` sweeps a light across it, `indeterminate` travels when the end is not known), `duration` in milliseconds, `aria-label`. Stripes and shimmer rest at 100. Motion stays still when reduced motion is on.

### Pulse dot

A pulse dot marks something live, such as agents who are online now.

```tsx
import { PulseDot } from "withy-ui";

<PulseDot label="Live" /> 12 agents online
```

Props: `color` (`primary`, `success`, `danger`, `warning`, `info`, `pink`), `label` (its accessible name; leave it out when nearby text says the same).

### Radio group

A radio group picks one option from a short list. Use Radio field for each labeled option.

```tsx
import { Radio, RadioField, RadioGroup } from "withy-ui";

<RadioGroup aria-label="Billing period" defaultValue="monthly">
  <RadioField value="monthly" label="Monthly" />
  <RadioField value="yearly" label="Yearly" description="Two months free." />
</RadioGroup>

<Radio value="weekly" aria-label="Weekly" />
```

`RadioGroup` is the Radix root: `value`, `defaultValue`, `onValueChange`, and `aria-label` unless a `Fieldset` or `FormField` names it. `Radio` is one item: `value`, `id`. Prefer `RadioField` for labeled options.

### Scroll area

A scroll area gives a region with a fixed height a thin scrollbar.

```tsx
import { ScrollArea } from "withy-ui";

<ScrollArea className="h-40">
  {invoices.map((invoice) => (
    <p key={invoice.id}>{invoice.name}</p>
  ))}
</ScrollArea>;
```

A Radix scroll area with a thin vertical scrollbar. Give it a height with `className`.

### Separator

A separator divides groups inside one region.

```tsx
import { Separator } from "withy-ui";

<Separator className="my-3" />;
```

Props: `orientation` (`horizontal`, `vertical`), `decorative` (true by default).

### Skeleton

A skeleton holds the shape of a larger region while it loads. Replace it as soon as the content arrives.

```tsx
import { Skeleton, SkeletonAvatar, SkeletonRows, SkeletonText } from "withy-ui";

<Skeleton className="h-8 w-40" />
<SkeletonAvatar />
<SkeletonText lines={3} />
<SkeletonRows rows={3} />
```

`Skeleton` takes its size from `className`. `SkeletonText lines`, `SkeletonRows rows`, and `SkeletonAvatar` draw common shapes.

### Slider

A slider picks a number in a range. Show the current value in the hint.

```tsx
import { FormField, Slider } from "withy-ui";

<FormField label="Session timeout" hint={minutes[0] + " minutes"}>
  <Slider min={15} max={120} step={15} value={minutes} onValueChange={setMinutes} />
</FormField>;
```

Radix slider: `value` or `defaultValue` (arrays), `onValueChange`, `min`, `max`, `step`. Name it with `FormField` or `aria-label`; the name lands on the thumb.

### Spinner

A spinner shows that a small region is loading. Name what is loading. Skip it for waits under a second.

```tsx
import { Spinner, SpinnerOverlay } from "withy-ui";

<Spinner label="Loading invoices" />
<div className="relative">
  <SpinnerOverlay label="Loading chart" />
</div>
```

`Spinner` props: `size` (`sm`, `md`, `lg`), `label` ("Loading" by default). It renders `role="status"`. `SpinnerOverlay label` fills the nearest parent with `relative`.

### Switch

A switch turns a setting on or off and saves when it changes. Use Switch field for a labeled settings row.

```tsx
import { Label, Switch } from "withy-ui";

<Switch id="alerts" defaultChecked />
<Label htmlFor="alerts">Email alerts</Label>
```

Radix switch: `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `id`. Prefer `SwitchField` for a labeled settings row.

### Tag

A tag marks a category or an active filter. An accent dot separates categories. A remove button clears a filter.

```tsx
import { Tag } from "withy-ui";

<Tag color="cyan">Design</Tag>
<Tag onRemove={() => clear("status")}>Status: Open</Tag>
```

Props: `color` (`primary`, `cyan`, `orange`, `indigo`, `teal`, `pink`; adds a dot), `onRemove` (adds a remove button), `removeLabel` ("Remove" and the tag text by default).

### Text

Text sets body copy, supporting copy, captions, and status text. Use weight for emphasis and tone for meaning.

```tsx
import { Text } from "withy-ui";

<Text>Body copy at 14px.</Text>
<Text size="sm" tone="secondary">Supporting copy at 13px.</Text>
<Text size="xs" tone="muted">Updated 2 minutes ago</Text>
```

Props: `as` (`p`, `span`, `div`), `size` (`xs` 11px, `sm` 13px, `md` 14px by default), `tone` (`default`, `heading`, `secondary`, `muted`, `primary`, `success`, `info`, `warning`, `danger`), `weight` (`regular`, `medium`, `semibold`).

### Textarea

A textarea takes several lines of text.

```tsx
import { FormField, Textarea } from "withy-ui";

<FormField label="Note" hint="Visible to your team.">
  <Textarea />
</FormField>;
```

Native textarea props. It reads its id, hint, and error from `FormField`.

### Toggle button

A toggle button stays pressed while a selection is on, such as a starred report or bold text. Use Switch field for a setting, and Segmented control when only one option can be on.

```tsx
import { Pin, Star } from "lucide-react";
import { ToggleButton } from "withy-ui";

<ToggleButton icon aria-label="Star" pressed={starred} onPressedChange={setStarred}>
  <Star />
</ToggleButton>
<ToggleButton variant="quiet" defaultPressed>
  <Pin /> Pin
</ToggleButton>
<ToggleButton variant="emphasized">Bold</ToggleButton>
```

Props: `pressed` (controlled), `defaultPressed` (uncontrolled, off by default), `onPressedChange` (called with the next pressed state), `variant` (`default`, `quiet` with no fill until hover or pressed, `emphasized` with a solid primary fill while pressed), `size` (`xs`, `sm`, `md`, `lg`), `icon` (square, icon only; give it an `aria-label`). It sets `aria-pressed` and defaults to `type="button"`.

### Wraith

A wraith is a pixel-art mascot that floats with its lantern in a drift of light. It is decoration, so place one per screen, in a corner away from the content.

```tsx
import { Wraith } from "withy-ui";

<Wraith />
<Wraith size="sm" />
<Wraith size="lg" label="Withy UI wraith" />
<Wraith className="fixed right-2 bottom-2 z-30" />
```

Props: `size` (`sm`, `md`, `lg`) draws each sprite pixel at 2, 3, or 4px; `md` is the default. Set `--withy-wraith-px` in a class, such as `max-md:[--withy-wraith-px:2px]`, to change the scale at a breakpoint. `label` names it for assistive tech; without one it is hidden as decoration. To pin it to a corner of every page, render it once in the root layout with `fixed`, a corner offset, and `z-30`, which keeps it under the header, dialogs, drawers, and toasts. It ignores the pointer, so the content under it stays clickable. Its light comes from the skin's `primary` color, and the lantern glow and motes turn mint on dark. With reduced motion on, the wraith holds still and the particles are hidden.

## Molecules

### Accordion

An accordion opens and closes sections of related content. One section can stay open, or several can be open at once.

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "withy-ui";

<Accordion type="single" collapsible defaultValue="billing">
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
</Accordion>;
```

`type="single"` keeps one section open. `collapsible` defaults to true, so that section can close. Set `collapsible={false}` to keep one section open. `type="multiple"` lets several sections stay open, and `value` and `defaultValue` are then a list of section values.

`AccordionItem` takes `value` and `disabled`. `AccordionTrigger` is an `h3` by default. Pass `as="h2"` when the sections sit under the page title, and keep `h3` under a card title. `AccordionContent` is the panel.

Radix accordion: `value`, `defaultValue`, `onValueChange`.

### Alert

An alert reports a condition next to the region it affects. It stays until the condition changes.

```tsx
import { Alert, Button } from "withy-ui";

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
</Alert>;
```

Props: `color` (`primary`, `success`, `danger`, `warning`, `info`), `title`, `actions`, and the body as children. Each color shows a status icon. It renders `role="status"` and has no close button, because it stays until the condition changes.

### Breadcrumb

A breadcrumb shows where a page sits, and links back up. The last item is the page.

```tsx
import { Breadcrumb } from "withy-ui";

<Breadcrumb
  items={[
    { label: "Billing", href: "/billing" },
    { label: "Invoices", href: "/billing/invoices" },
    { label: "#1048" },
  ]}
/>;
```

Props: `items` (`{ label, href? }[]`). The last item is the current page.

### Callout

A callout points out information that helps with the task on the page. It can carry one action.

```tsx
import { Button, Callout } from "withy-ui";

<Callout color="info" title="Exports run overnight" icon={<Info />}>
  Large reports are ready by 6:00 the next morning.
</Callout>;
```

Props: `title` (required), `color` (`info` by default, `primary`, `success`, `danger`, `warning`), `icon`, `action`, and the body as children.

### Checkbox field

A checkbox with its label and an optional description.

```tsx
import { CheckboxField } from "withy-ui";

<CheckboxField label="Remember me" defaultChecked />
<CheckboxField
  label="Send a copy to billing"
  description="billing@withy.dev gets every invoice."
/>
```

Props: `label` (required), `description`, and the `Checkbox` props.

### Code

Code sets a short token inline. A code block shows a longer snippet on a terminal background, with syntax color and a copy button.

```tsx
import { Code, CodeBlock } from "withy-ui";

Space cards with <Code>gap-2.5</Code>.
<CodeBlock label="tsx" code={snippet} />
```

`Code` wraps an inline token. `CodeBlock` props: `code` (a string), `label` ("Code" by default).

### Color picker

A color picker chooses one color. The value is a CSS color, such as #0e7484, rgb(), or hsl().

```tsx
import { ColorPicker, FormField } from "withy-ui";

<FormField label="Brand color">
  <ColorPicker value={color} onValueChange={setColor} />
</FormField>;
```

Props: `value` and `onValueChange` (a CSS color, or `""` when cleared), `defaultValue`, `presets` (`{ label, value }[]`), `placeholder`, `disabled`, `aria-label`. Presets default to Primary, Brand, and the accent colors. The panel has a saturation and lightness field, hue and alpha sliders, and a color field. Clear removes the color.

### Chip picker

A chip picker selects several options and shows them as removable chips. Search the list, and optionally create a new option.

```tsx
import { ChipPicker, FormField } from "withy-ui";

<FormField label="Topics">
  <ChipPicker options={tags} value={topics} onValueChange={setTopics} onCreate={addTag} />
</FormField>;
```

Props: `options` (`{ label, value }[]`), `value` and `defaultValue` (string arrays), `onValueChange`, `onCreate(label)` (adds a Create action; the picker also selects a slug of the label), `onSearch(search)`, `placeholder`, `cleanable` (true by default), `disabled`, `disabledItemValues`, `loading`, `aria-label`.

### Combobox

A combobox picks one option from a long list that the person can search.

```tsx
import { Combobox, FormField } from "withy-ui";

<FormField label="Country">
  <Combobox options={countries} value={country} onValueChange={setCountry} />
</FormField>;
```

Props: `options` (`{ label, value }[]`), `value`, `onValueChange`, `placeholder`, `id`, `aria-label`.

### Context menu

A context menu lists actions on right click or long press. Name each item with a verb.

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "withy-ui";

<ContextMenu>
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
</ContextMenu>;
```

Radix context menu. Compose with `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`, `ContextMenuCheckboxItem`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, `ContextMenuGroup`, and `ContextMenuPortal` when needed. `ContextMenuItem` takes `onSelect`. Mark a destructive action with `className="text-danger"`.

### Copy button

A copy button puts a value on the clipboard, then says Copied. If the copy fails, it says so.

```tsx
import { CopyButton } from "withy-ui";

<CopyButton value={reportUrl}>Copy report link</CopyButton>;
```

Props: `value` (a string, or a function that returns one), `copiedLabel` ("Copied"), `failedLabel` ("Copy failed"), `onCopy`, and the `Button` props.

### Credit card input

A credit card input takes the number, name, expiry, and security code. The card changes with the brand as the number is typed. It brings its own labels, so it does not sit inside a form field.

```tsx
import { CreditCardInput, detectCardBrand } from "withy-ui";

<CreditCardInput value={card} onValueChange={setCard} onBrandChange={setBrand} />;

detectCardBrand(card.number);
```

`detectCardBrand(number)` returns `visa`, `mastercard`, `amex`, `discover`, `diners`, `jcb`, `unionpay`, or `unknown`.

`value` and `onValueChange` use `{ number, name, expiry, cvc }`. `number`, `expiry`, and `cvc` are digits, and `expiry` is `MMYY`. `onBrandChange` runs when the network changes. `preview` shows the card (true by default). `errors` sets a message on each field. `names` submits the digits from a form. `disabled`, `readOnly`, and `required` apply to every field.

Visa, Mastercard, and the other networks set the card face, the spacing of the number, and the length of the security code. American Express keeps its 4 digit code on the front. The other networks turn the card over while the security code is focused.

### Date picker

A date picker picks one day. Values are ISO dates, such as 2026-10-12.

```tsx
import { DatePicker, FormField } from "withy-ui";

<FormField label="Due date">
  <DatePicker value={due} onValueChange={setDue} min="2026-01-01" />
</FormField>;
```

Props: `value` and `onValueChange` (ISO `yyyy-mm-dd` strings), `min`, `max`, `placeholder`, `disabled`, `aria-label`.

### Date range picker

A date range picker picks a start and an end day, with presets for common ranges.

```tsx
import { DateRangePicker, FormField } from "withy-ui";

<FormField label="Report period">
  <DateRangePicker value={range} onValueChange={setRange} />
</FormField>;
```

Props: `value` (`{ start, end }` as ISO strings), `onValueChange`, `aria-label`. Presets: Today, Last 7 days, This month.

### Empty state

An empty state says what a region is for when it has nothing to show, and offers the first action.

```tsx
import { Button, EmptyState } from "withy-ui";

<EmptyState
  icon={FileText}
  title="No reports yet"
  description="Create a report to see revenue by week."
  action={<Button size="sm">Create report</Button>}
/>;
```

Props: `title` (required), `description`, `icon` (a Lucide icon), `action`, `align` (`start` by default, `center`).

### Fieldset

A fieldset groups related choices under one visible legend.

```tsx
import { CheckboxField, Fieldset } from "withy-ui";

<Fieldset legend="Notify me about" hint="We send at most one email a day.">
  <CheckboxField label="New invoices" defaultChecked />
  <CheckboxField label="Failed payments" />
</Fieldset>;
```

Props: `legend` (required), `hint`, `error`, children. It names a radio group inside it and describes each control with the hint or the error.

### File input

A file input picks one file.

```tsx
import { FileInput, FormField } from "withy-ui";

<FormField label="Avatar" hint="PNG or JPG, up to 2 MB.">
  <FileInput accept="image/png,image/jpeg" onFileChange={setFile} />
</FormField>;
```

Props: `accept`, `onFileChange(file)`, `id`.

### File uploader

A file uploader takes several files by drop or browse. Each file shows its size, and a progress bar while it uploads. `onFilesChange` receives the files that have finished uploading.

```tsx
import { FileUploader, FormField } from "withy-ui";

<FormField label="Receipts" hint="PDFs or images.">
  <FileUploader accept="application/pdf,image/*" onFilesChange={setFiles} />
</FormField>;
```

Props: `accept`, `multiple` (true by default), `onFilesChange(files)` (files that finished uploading), `id`.

### Form field

A form field gives a control its visible label, a hint, and an error, and connects them for assistive tech.

```tsx
import { FormField, Input, Select } from "withy-ui";

<FormField label="Owner" error="Enter a name between 2 and 20 characters.">
  <Input value={owner} onChange={(event) => setOwner(event.target.value)} />
</FormField>;
```

Props: `label` (required), `hint`, `error` (replaces the hint and marks the control invalid), `htmlFor` (optional; created when left out), `className`.

### Hover gallery

A hover gallery shows the first image by default. Move the pointer horizontally to reveal the others. Use it on product cards, portfolios, and image galleries, with up to ten images.

```tsx
import { HoverGallery } from "withy-ui";

<HoverGallery
  className="max-w-60"
  images={[
    { src: "/study-1.webp", alt: "Color study 1" },
    { src: "/study-2.webp", alt: "Color study 2" },
    { src: "/study-3.webp", alt: "Color study 3" },
    { src: "/study-4.webp", alt: "Color study 4" },
  ]}
/>;
```

Props: `images` (`{ src, alt }[]`, required; extras after ten are ignored), `label` (accessible name; defaults to the first image's `alt`). Pass width with `className`, such as `max-w-60`.

### Icon button

An icon button runs an action from an icon alone. Its label is the accessible name, and the tooltip shows it.

```tsx
import { IconButton } from "withy-ui";

import { Bell } from "lucide-react";

<IconButton icon={Bell} label="Notifications" tooltip />;
```

Props: `icon` (a Lucide icon), `label` (required; the accessible name), `tooltip` (shows the label on hover and focus), and the `Button` props. It defaults to `color="white"` and `size="sm"`. Use `ToggleButton` with `icon` for a selection that stays on.

### Inline message

An inline message reports a result next to the thing it describes, such as Changes saved after a form.

```tsx
import { InlineMessage } from "withy-ui";

<InlineMessage tone="success">Changes saved.</InlineMessage>;
```

Props: `tone` (required: `success`, `warning`, `danger`, `info`) and the message as children. It renders `role="status"` with a matching icon.

### Input group

An input group adds a fixed prefix or suffix to a field.

```tsx
import { FormField, Input, InputGroup } from "withy-ui";

<FormField label="Amount">
  <InputGroup prefix="$" suffix="USD">
    <Input inputMode="decimal" />
  </InputGroup>
</FormField>;
```

Props: `prefix`, `suffix`, and one `Input` as children.

### Input OTP

An input OTP takes a one-time code, one character per slot. Put it in a form field so it has a visible label. Paste and autofill fill the whole code.

```tsx
import { FormField, InputOtp } from "withy-ui";

<FormField label="Verification code" hint="Enter the 6-digit code from your email.">
  <InputOtp />
</FormField>

<FormField label="Backup code" hint="Letters and digits from your recovery card.">
  <InputOtp length={8} groups={[4, 4]} pattern="alphanumeric" />
</FormField>
```

Props: `value` and `onValueChange` (the code string), or `defaultValue`. `onComplete` runs when every slot is filled. `length` is 6 by default (1 to 12). `pattern` is `numeric` or `alphanumeric` (letters are stored in uppercase). `groups` splits the slots, such as `[3, 3]`, and `separator` is the mark between groups (`null` leaves the gap). `mask` hides the characters on screen. The field value stays available to assistive tech. `placeholder` is the mark in an empty slot. `fieldSize` (`sm` 34px, `md` 38px by default). `name` submits the code. `autoComplete` is `one-time-code`. It reads its id, hint, and error from `FormField`.

Arrow keys move through the characters. Backspace deletes. A pasted code can include spaces or dashes. Typing replaces the character at the caret.

### Logo

A logo shows the product mark and name, and links home. Pass your own name and mark.

```tsx
import { Logo } from "withy-ui";

<Logo name="acme" mark={<AcmeMark />} href="/" />;
```

Props: `name` ("withy-ui" by default), `mark` (the Withy UI sprout by default), `href` ("/" by default), `inverse` for dark panels.

### Media

Media places an avatar or an image beside text that can truncate.

```tsx
import { Avatar, Media, MediaBody, Truncate } from "withy-ui";

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
</Media>;
```

`Media` is a row with a 12px gap. `MediaBody` takes the remaining width so `Truncate` can shorten the text.

### Meter list

A meter list compares a few values as labeled bars.

```tsx
import { MeterList } from "withy-ui";

<MeterList items={[{ label: "Direct", value: "44%", percent: 44 }]} />;
```

Props: `items` (`{ label, value, percent }[]`).

### Nav item

A nav item is one link in a sidebar. It marks the current page.

```tsx
import { NavItem } from "withy-ui";

<NavItem href="/invoices" label="Invoices" icon={<FileText />} active />;
```

Props: `label` (required), `href` (or `onSelect` for a button), `icon`, `active`, `collapsed` (icon only; the label stays for screen readers).

### Number input

A number input takes a number by typing or with its stepper. Put it in a form field so it has a visible label.

```tsx
import { FormField, NumberInput } from "withy-ui";

<FormField label="Seats" hint="Between 1 and 20.">
  <NumberInput min={1} max={20} defaultValue={2} />
</FormField>

<FormField label="Amount">
  <NumberInput
    prefix="$"
    suffix="USD"
    min={0}
    step={0.01}
    format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
    defaultValue={1240}
  />
</FormField>
```

Props: `value` and `onValueChange` (`number`, or `null` when the field is empty), or `defaultValue`. `min`, `max`, and `step` (1 by default). `prefix` and `suffix` sit inside the field. `format` (`true` groups thousands, or options for `Intl.NumberFormat`) and `locale` (`en` by default). `controls` (`end` by default, `sides` for a quantity, `none` to type only). `fieldSize` (`sm` 34px, `md` 38px by default). `name` submits the plain number. It reads its id, hint, and error from `FormField`.

Arrow keys step. Shift, or Page Up and Page Down, steps ten times. Home and End jump to `min` and `max` when those are set. The value is clamped when the field blurs. Out-of-range typing is kept until then.

### Pagination

Pagination moves through the pages of a long list. Long ranges fold into gaps.

```tsx
import { Pagination } from "withy-ui";

<Pagination page={page} pages={12} onPageChange={setPage} />;
```

Props: `page`, `pages`, `onPageChange`. It shows up to seven slots and folds the rest into gaps.

### Password input

A password input can show or hide what was typed.

```tsx
import { FormField, PasswordInput } from "withy-ui";

<FormField label="New password" hint="Use at least 8 characters.">
  <PasswordInput autoComplete="new-password" />
</FormField>;
```

The `Input` props without `type`. It adds a Show password button.

### Popup

A popup floats a small panel next to its trigger, for a note, a filter, or a picker.

```tsx
import { Button, Popup, PopupClose, PopupContent, PopupTrigger } from "withy-ui";

<Popup>
  <PopupTrigger asChild>
    <Button color="white" size="sm">
      Show totals
    </Button>
  </PopupTrigger>
  <PopupContent className="w-60">
    48 invoices, $62,400 collected.
    <PopupClose asChild>
      <Button variant="text" size="sm">
        Close
      </Button>
    </PopupClose>
  </PopupContent>
</Popup>;
```

Radix popover: `Popup` (`open`, `onOpenChange`), `PopupTrigger asChild`, `PopupContent` (`align` is `start` by default), `PopupClose`.

### Popup menu

A popup menu lists actions behind a button. Name each item with a verb.

```tsx
import {
  Button,
  PopupMenu,
  PopupMenuContent,
  PopupMenuItem,
  PopupMenuLabel,
  PopupMenuSeparator,
  PopupMenuTrigger,
} from "withy-ui";

<PopupMenu>
  <PopupMenuTrigger asChild>
    <Button color="white" size="sm">
      Invoice actions
    </Button>
  </PopupMenuTrigger>
  <PopupMenuContent align="start">
    <PopupMenuLabel>Invoice #1048</PopupMenuLabel>
    <PopupMenuItem onSelect={send}>Send invoice</PopupMenuItem>
    <PopupMenuSeparator />
    <PopupMenuItem className="text-danger" onSelect={confirmDelete}>
      Delete invoice
    </PopupMenuItem>
  </PopupMenuContent>
</PopupMenu>;
```

Radix dropdown menu. `PopupMenuContent` takes `align` (`end` by default) and `sideOffset`. `PopupMenuItem` takes `onSelect`. `PopupMenuLabel` and `PopupMenuSeparator` group the items.

### QR code

A QR code turns a link or a short text into a code a phone camera can scan. Choose how much damage it can recover from, and cover it while it loads, after a scan, or when it expires.

```tsx
import { CopyButton, QrCode, qrCodeSvg } from "withy-ui";

<QrCode value="https://withy.dev" level="M" />;

<CopyButton value={() => qrCodeSvg("https://withy.dev", { level: "M" })}>Copy as SVG</CopyButton>;

<QrCode value="https://withy.dev" status="expired" onRefresh={refresh} />;
```

Props: `value` (the text or URL), `level` (`L` recovers 7%, `M` 15%, `Q` 25%, `H` 30%; `M` by default), `margin` (quiet-zone modules, 4 by default), `label` ("QR code"), `status` (`loading`, `success`, `expired`), `statusLabel`, `onRefresh` (shown as Refresh on an expired code), `refreshLabel` ("Refresh").

`qrCodeSvg(value, { level, margin })` returns a standalone SVG with dark modules on a white plate. It throws when the value is empty or too long for the correction level.

Size it with `className`, such as `size-48` (the default) or `size-56`. The modules use the text color on a white plate, so `className="border-0 bg-brand text-white"` draws a light code on a brand panel. Pass `bg-transparent` when the panel behind the code should show through the quiet zone.

### Radio field

A radio with its label and an optional description. Place it inside a radio group.

```tsx
import { RadioField, RadioGroup } from "withy-ui";

<RadioGroup aria-label="Plan" defaultValue="team">
  <RadioField value="starter" label="Starter" description="One workspace." />
  <RadioField value="team" label="Team" description="Up to 20 people." />
</RadioGroup>;
```

Props: `label` (required), `value` (required), `description`. Place it inside `RadioGroup`.

### Search input

A search input finds things by name. Its label says what is being searched.

```tsx
import { FormField, SearchInput } from "withy-ui";

<FormField label="Search reports">
  <SearchInput
    value={query}
    onChange={(event) => setQuery(event.target.value)}
    onClear={() => setQuery("")}
  />
</FormField>;
```

The `Input` props, plus `fieldSize` (`sm` by default) and `onClear` (shows a Clear search button when there is a value).

### Section nav

A section nav moves between the sections of one area. It runs across on a narrow screen and down from 1024px.

```tsx
import { SectionNav } from "withy-ui";

<SectionNav
  label="Account"
  current={pathname}
  items={[
    { label: "Profile", href: "/account/profile" },
    { label: "Security", href: "/account/security" },
  ]}
/>;
```

Props: `label` (the accessible name), `items` (`{ label, href }[]`), `current` (the href of the current item; the pathname from `WithyProvider` by default), `className`.

### Segmented control

A segmented control picks one of a few views or filters, and marks the current one. It applies right away.

```tsx
import { SegmentedControl } from "withy-ui";

<SegmentedControl
  aria-label="Invoice view"
  value={view}
  onValueChange={setView}
  options={[
    { label: "Table", value: "table", icon: Table2 },
    { label: "Board", value: "board", icon: LayoutGrid },
  ]}
/>;
```

A Radix radio group. Props: `options` (`{ label, value, icon?, disabled? }[]`), `value`, `defaultValue`, `onValueChange`, `aria-label` (required), `size` (`sm` 34px by default, `md` 38px).

### Segmented meter

A segmented meter shows the parts of a whole, with a legend and percentages.

```tsx
import { SegmentedMeter } from "withy-ui";

<SegmentedMeter
  label="Ticket status"
  segments={[
    { label: "Open", value: 42, color: "primary" },
    { label: "Solved", value: 64, color: "success" },
  ]}
/>;
```

Props: `segments` (`{ label, value, color }[]`), `label` (the accessible name).

### Select

A select picks one option from a short list.

```tsx
import { FormField, Select } from "withy-ui";

<FormField label="Status">
  <Select value={status} onValueChange={setStatus} options={statusOptions} />
</FormField>;
```

Props: `options` (`{ label, value }[]`), `value`, `defaultValue`, `onValueChange`, `placeholder`, `fieldSize` (`sm`, `md`), `disabled`, `name`, `id`, `aria-label`.

### Select picker

A select picker searches its options, and can create a new one.

```tsx
import { FormField, SelectPicker } from "withy-ui";

<FormField label="Tag">
  <SelectPicker options={tags} value={tag} onValueChange={setTag} onCreate={addTag} />
</FormField>;
```

Props: `options`, `value`, `onValueChange`, `onCreate(label)`, `placeholder`, `aria-label`.

### Speed dial

A speed dial opens three to six related actions from one button. They fan out up, down, left, or right, and each action keeps its label in view.

```tsx
import { SpeedDial } from "withy-ui";

import { Copy, Printer, Save } from "lucide-react";

<SpeedDial
  className="fixed right-5 bottom-5"
  label="Create"
  actions={[
    { label: "Copy", icon: Copy, onSelect: copyPage },
    { label: "Save", icon: Save, onSelect: savePage },
    { label: "Print", icon: Printer, onSelect: printPage },
  ]}
/>;
```

Props: `label` (required; the button's accessible name), `actions` (`{ label, icon, onSelect?, disabled? }[]`), `icon` (a Lucide icon, Plus by default; it turns 45 degrees while open), `openIcon` (replaces that turn with another Lucide icon), `direction` (`up`, `down`, `left`, `right`; `up` by default), `labels` (`always` or `hover`; `always` by default), `openOnHover` (opens while the pointer is over it; a click then keeps it open), `open`, `defaultOpen`, `onOpenChange(open)`, `color` (a button color, `primary` by default), `className`.

The button shows its label on hover and focus. Click, Enter, Space, or an arrow key opens the dial. Arrow keys move between the actions. Enter or Space runs the focused action and closes the dial. Escape closes it and returns focus to the button. A click outside closes it too.

Keep the labels short. For a longer list, use `PopupMenu`.

### Stat

A stat shows a figure with its label and how it changed.

```tsx
import { Stat } from "withy-ui";

<Stat
  title="Conversion rate"
  value="0.81%"
  change={{ value: "1.2%", direction: "up", hint: "than last week" }}
/>;
```

Props: `title`, `value`, `change` (`{ value, direction: "up" | "down", hint? }`).

### Stepper

A stepper shows progress through an ordered task, such as creating an invoice. The current step is marked, completed steps show a check, and an error uses the danger color.

```tsx
import { Stepper } from "withy-ui";

<Stepper
  label="Create invoice"
  activeStep={step}
  onStepChange={setStep}
  steps={[
    { label: "Customer", description: "Who the invoice is for." },
    { label: "Line items", description: "What you are billing." },
    { label: "Review", description: "Check the total, then send it." },
  ]}
/>;
```

`activeStep` is zero-based. Set it to the number of steps when every step is complete.

`onStepChange` makes steps selectable. With `linear` (the default), only the current step and earlier steps open. Set `linear={false}` to open every step. A `disabled` step stays closed.

`orientation="vertical"` stacks the steps and shows the current step's `content` beside its marker. A horizontal stepper shows that content under the list. `labelPlacement="below"` puts a horizontal label under the marker.

`variant` can be `text`, `dots`, or `progress` for a narrow space. Pass `back` and `next` to place controls at the ends. `text` reads "2 of 3".

A step takes `label`, `description`, `content`, `optional`, `completed` (`false` when an optional step was skipped), `error` (the message to show), `disabled`, and `icon`. `label` on `Stepper` is the accessible name, and it defaults to Steps. `contentId` points selectable steps at the panel they control.

```tsx
<Stepper
  variant="dots"
  label="Create invoice"
  activeStep={step}
  steps={steps}
  back={
    <Button color="white" size="sm">
      Back
    </Button>
  }
  next={<Button size="sm">Continue</Button>}
/>
```

### Switch field

A switch with its label and description, for a setting that saves when it changes. Keep it out of forms with a save button.

```tsx
import { SwitchField } from "withy-ui";

<SwitchField
  label="Email alerts"
  description="Saves as soon as you change it."
  checked={alerts}
  onCheckedChange={setAlerts}
/>;
```

Props: `label` (required), `description`, and the `Switch` props (`checked`, `onCheckedChange`, `defaultChecked`, `disabled`).

### Tabs

Tabs switch between panels of related content in the same place.

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "withy-ui";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="payments">Payments</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="payments">…</TabsContent>
</Tabs>;
```

Radix tabs: `Tabs` (`value`, `defaultValue`, `onValueChange`), `TabsList`, `TabsTrigger value`, `TabsContent value`.

### Theme switcher

A switch for the light or dark skin. A sun marks light and a moon marks dark. The choice is remembered.

```tsx
import { ThemeSwitcher } from "withy-ui";

<ThemeSwitcher />;
```

No props. It reads and sets the skin through `WithyProvider`.

### Time picker

A time picker picks an hour and a minute, in 5-minute steps. Values are 24-hour.

```tsx
import { FormField, TimePicker } from "withy-ui";

<FormField label="Start time">
  <TimePicker value={time} onValueChange={setTime} />
</FormField>;
```

Props: `value` and `onValueChange` (24-hour `HH:mm`), `aria-label`.

### Toast

A toast reports a change when the person may be looking elsewhere. It can offer Undo for a reversible remove.

```tsx
import { useToast } from "withy-ui";

const { toast } = useToast();

toast({
  title: "Invoice #1049 removed from this report",
  description: "It is still in Invoices.",
  action: { label: "Undo", onClick: restore },
});
```

`useToast()` returns `toast(input)`. Input: `title` (required), `description`, `color` (`primary`, `success`, `danger`, `warning`, `info`), `action` (`{ label, onClick, altText? }`), `duration` in milliseconds (4200 by default, 8000 with an action).

### Tooltip

A tooltip adds a short hint on hover or focus. It is never the only name for a control.

```tsx
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "withy-ui";

<Tooltip>
  <TooltipTrigger asChild>
    <Button color="white" size="sm">
      Export
    </Button>
  </TooltipTrigger>
  <TooltipContent>Exports the visible rows as CSV.</TooltipContent>
</Tooltip>;
```

Radix tooltip: `Tooltip`, `TooltipTrigger asChild`, `TooltipContent`. Use it for a hint, never as the only name of a control.

### Tracker

A tracker shows a sequence of statuses, one block per moment, such as daily uptime. Hover or focus a block to read its status.

```tsx
import { Tracker } from "withy-ui";

<Tracker
  label="API uptime"
  hoverEffect
  data={[
    { color: "success", tooltip: "Operational" },
    { color: "danger", tooltip: "Down for 14 minutes" },
    { color: "warning", tooltip: "Degraded response time" },
    { color: "neutral", tooltip: "No data" },
  ]}
/>;
```

Props: `data` (`{ id?, color?, tooltip? }[]`, oldest first), `label` (the accessible name), `defaultColor` (`neutral` when a block omits `color`), `hoverEffect` (dims a block under the pointer). `color` is a chart color or `neutral`. Use `success`, `info`, `warning`, and `danger` only when the block means that status. `tooltip` is the block's name; without one, the block is presentational. Arrow keys move between named blocks.

### Transfer list

A transfer list moves one or more items between an available list and a chosen list. Check the items to move, or move every enabled item. Chosen values stay in the order they were moved. Items moved back return to their original order.

```tsx
import { FormField, TransferList } from "withy-ui";

<FormField label="Report columns" hint="Chosen columns appear in this order.">
  <TransferList items={columns} value={chosen} onValueChange={setChosen} />
</FormField>;
```

Props: `items` (`{ value, label, description?, disabled? }[]`, values unique), `value` and `defaultValue` (chosen values, in list order), `onValueChange(value)`, `availableLabel` ("Available"), `chosenLabel` ("Chosen"), `showMoveAll` (true; set false to hide the move-all buttons), `disabled`. Each list has a select-all checkbox and a count. The move buttons are named from the list labels, such as Move selected to chosen. Inside `FormField`, the field label, hint, and error name the whole control.

### Truncate

Truncate shortens overflowing text with an ellipsis. A tooltip shows the full string when the text is cut off.

```tsx
import { Truncate } from "withy-ui";

<div className="flex w-48 flex-col gap-2">
  <Truncate weight="medium" tone="heading">
    Northwind Trading Company, Limited
  </Truncate>
  <Truncate lines={2} size="sm" tone="secondary">
    Invoices for this account stay on this card until they are paid or written off.
  </Truncate>
</div>;
```

Props: `lines` (1 by default), `tooltip` (on by default). It takes `Text`'s `as` (`span` by default), `size`, `tone`, and `weight`. Set a width on it, or put it in a row that can shrink. The tooltip comes from `WithyProvider`.

## Organisms

### Calendar month

A month of events, with the agenda for the selected day beside it.

```tsx
import { CalendarMonth } from "withy-ui";

<CalendarMonth events={events} today="2026-10-12" />;
```

Props: `events` (`CalendarEvent[]`: `id`, `date` as ISO, `title`, `time`, `color` of `primary`, `success`, `warning`, `pink`, or `info`), `today` (an ISO date).

### Card

A card groups one subject with a header, a body, and a footer. Cards sit 10px apart.

```tsx
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from "withy-ui";

<Card>
  <CardHeader>
    <div>
      <CardTitle>Weekly revenue</CardTitle>
      <CardDescription>Compared with the week before</CardDescription>
    </div>
  </CardHeader>
  <CardBody>…</CardBody>
  <CardFooter>
    <Button size="sm" color="white">
      Open report
    </Button>
  </CardFooter>
</Card>;
```

`Card tone`: `default`, or `primary`, `success`, `info`, `warning`, `danger` for a solid emphasis panel. `CardHeader` lays out a title and actions. `CardTitle as`: `h2` by default, `h3`, `h4`. `CardDescription` sits under the title. `CardBody` pads 16px top and bottom and 20px on the sides. `CardFooter` aligns actions to the end.

### Command bar

A command bar searches pages and actions from the keyboard. Turn on shortcut to open it with ⌘K.

```tsx
import { CommandBar } from "withy-ui";

<CommandBar
  open={open}
  onOpenChange={setOpen}
  shortcut
  onNavigate={(href) => router.push(href)}
  items={[{ id: "invoices", label: "Invoices", group: "Pages", href: "/invoices" }]}
/>;
```

Props: `open`, `onOpenChange`, `items` (`CommandItem[]`: `id`, `label`, `group`, `keywords`, `href`, `icon`, `onSelect`), `shortcut` (⌘K or Ctrl+K toggles it), `onNavigate(href)`.

### Data table

A data table shows exact figures in rows and columns. It sorts, filters, pages, and acts on the rows you pass in. Filtering runs in the browser.

```tsx
import { ColumnSparkline, DataTable, SignedFigures, TickerCell } from "withy-ui";

<DataTable
  caption="Workspaces"
  rows={workspaces}
  getRowKey={(row) => row.id}
  empty="No workspaces yet."
  selectable
  pageSize={20}
  searchPlaceholder="Search by owner"
  columnVisibility
  columns={[
    { key: "owner", header: "Owner", hideable: false, sortValue: (row) => row.owner, cell: (row) => row.owner },
    {
      key: "status",
      header: "Status",
      filter: { type: "select", value: (row) => row.status },
      cell: (row) => row.status,
    },
    {
      key: "costs",
      header: "Costs",
      align: "right",
      sortValue: (row) => row.costs,
      filter: { type: "number", format: "currency", value: (row) => row.costs },
      cell: (row) => money(row.costs),
    },
  ]}
  bulkActions={[{ id: "delete", label: "Delete", shortcut: "d", onSelect: (rows) => deleteRows(rows) }]}
  details={(row) => <p>{row.owner}</p>}
/>

// A header text filter still works without a typed filter
{ key: "customer", header: "Customer", filterValue: (row) => row.customer, cell: (row) => row.customer }

// Cells for a holdings table
<TickerCell symbol="DAL" name="Delta Air Lines" mark="D" tone="indigo" />
<ColumnSparkline data={[4, 6, 5, 8]} label="DAL timeline" />
<SignedFigures value={-2.14} note="0.98" />
```

Props: `columns`, `rows`, `getRowKey`, `caption`, `empty`, `selectable`, `selectedKeys`, `onSelectedKeysChange`, `bulkActions`, `rowActions`, `rowLabel`, `details`, `detailsTitle`, `detailsDescription`, `pageSize`, `pageSizeOptions`, `searchPlaceholder`, `searchValue`, `onExport`, `columnVisibility`.

`Column<T>`: `key`, `header`, `cell(row)`, `align`, `width`, `sortValue(row)`, `hideable`. `filterValue(row)` adds a text filter in the header. `filter` adds a toolbar filter instead: `{ type: "text" }`, `{ type: "select", value, options? }`, `{ type: "number", value, format?: "number" | "currency" }`, or `{ type: "date", value }`. Number conditions are equal to, between, greater than, and less than. Date conditions are on, before, after, and between.

`bulkActions` appear on the command bar while rows are selected. `shortcut` is one key, such as `"d"`. Escape clears the selection. `onExport` receives the rows that match the current filters. Cell helpers: `TickerCell`, `ColumnSparkline`, `SignedFigures`.

### Dialog

A dialog keeps one task in front of the page. It always has a title. Pass `confirmLabel` when it asks for a decision, and `tone="danger"` for a permanent delete. Pass `footer` for any other actions.

```tsx
import { Button, Dialog } from "withy-ui";

<Dialog
  tone="danger"
  title="Delete invoice #1048?"
  confirmLabel="Delete invoice"
  onConfirm={() => deleteInvoice("1048")}
  trigger={<Button color="danger">Delete invoice</Button>}
>
  The invoice and its payments are removed. This cannot be undone.
</Dialog>;
```

Props: `title` (required), `description`, `children` (the body), `footer` (actions; ignored when `confirmLabel` is set), `confirmLabel` (repeat the verb), `cancelLabel` ("Cancel"), `tone` (`primary`, `danger`), `onConfirm` (return a promise to show loading; a rejected promise keeps the dialog open), `onSubmit` (wraps the dialog in a form so a footer button can submit it), `trigger`, `open`, `defaultOpen`, `onOpenChange`, `className`.

### Drawer

A drawer keeps a task in a panel at the side of the page. Use it for filters, details, or navigation.

```tsx
import { Button, Drawer } from "withy-ui";

<Drawer
  title="Filters"
  description="Narrow the invoices on this page."
  trigger={<Button color="white">Filter invoices</Button>}
  footer={<Button size="sm">Apply filters</Button>}
>
  Open invoices from this month.
</Drawer>;
```

Props: `title` (required), `description`, `children`, `footer`, `side` (`right` by default, or `left`), `trigger`, `open`, `defaultOpen`, `onOpenChange`, `className`.

### Footer

The footer holds quiet links at the end of the page.

```tsx
import { Footer } from "withy-ui";

<Footer links={[{ label: "Privacy", href: "/privacy" }]}>© 2026 Acme Inc.</Footer>;
```

Props: children on the start side, such as the copyright, and `links` (`{ label, href }[]`) on the end side.

### Header

The header holds the logo, the main navigation, and actions. It marks the current page and folds into a drawer on a narrow screen.

```tsx
import { Header, IconButton, Logo } from "withy-ui";

<Header
  nav={[{ label: "Invoices", href: "/invoices" }]}
  logo={<Logo name="acme" />}
  actions={<IconButton icon={Bell} label="Notifications" />}
/>;
```

Props: `nav` (`{ label, href, children? }[]`; children make a menu), `pathname` (marks the current link; from `WithyProvider` by default), `logo` (the Withy UI logo by default, so pass yours), `actions` (the end side), `themeSwitcher` (true by default). It is fixed to the top and 60px tall.

### Overlay

An overlay covers the page and shows your own content on a dimmed layer. Use it for a preview or a custom panel.

```tsx
import { Button, Overlay } from "withy-ui";

<Overlay label="Invoice preview" trigger={<Button color="white">Preview invoice</Button>}>
  …
</Overlay>;
```

Props: `label` (the accessible name), `description`, `children`, `trigger`, `open`, `defaultOpen`, `onOpenChange`, `className`.

### Page header

A page header holds the breadcrumb, the one h1 on the page, a description, and the page actions.

```tsx
import { Button, PageHeader } from "withy-ui";

<PageHeader
  crumbs={[{ label: "Billing", href: "/billing" }, { label: "Invoices" }]}
  title="Invoices"
  description="12 open, 3 overdue."
  actions={<Button>Create invoice</Button>}
/>;
```

Props: `title` (required; the page's `h1`), `crumbs`, `description`, `actions`, `className`.

### Sidebar

A sidebar lists the places in an area, grouped by section, and marks the current one.

```tsx
import { Sidebar } from "withy-ui";

<Sidebar
  label="Workspace"
  sections={[
    { items: [{ href: "/", label: "Overview", icon: <LayoutDashboard />, active: true }] },
    { label: "Billing", items: [{ href: "/invoices", label: "Invoices", icon: <FileText /> }] },
  ]}
/>;
```

Props: `sections` (`{ label?, items, empty? }[]`), `label` (the accessible name of the nav), `collapsed`. Items: `href` or `onSelect`, `label`, `icon`, `active`. Give it a height; it scrolls.

### Timeline

A timeline lists events in order, with their times.

```tsx
import { Timeline } from "withy-ui";

<Timeline
  items={[
    { id: "created", time: "Mar 2 · 9:10", title: "Account created", tone: "primary" },
    { id: "paid", time: "Mar 6 · 11:05", title: "Payment received", tone: "success" },
  ]}
/>;
```

Props: `items` (`{ id, title, time, description?, tone? }[]`), with `tone` of `primary`, `success`, `warning`, `danger`, `info`, or `indigo`.

## Charts

Import from `withy-ui/charts`. This entry loads ECharts, so import it only where you draw a chart. Charts read the active skin and redraw when it changes. Every chart needs a `label`, and every series a `name`. The default height is 288px; set another with `className`, such as `className="h-[320px]"`.

```tsx
import {
  AreaChart,
  BarChart,
  BubbleChart,
  LineChart,
  BarList,
  CategoryBar,
  ComboChart,
  DonutChart,
  HeatmapChart,
  RadarChart,
  TimelineChart,
  TreemapChart,
} from "withy-ui/charts";

<BarChart
  label="Orders this week"
  categories={["Mon", "Tue", "Wed"]}
  series={[
    { name: "This week", data: [186, 214, 198], color: "primary" },
    { name: "Last week", data: [164, 188, 209], color: "indigo" },
  ]}
/>;

<DonutChart
  label="Revenue share"
  data={[
    { name: "Direct", value: 486, color: "primary" },
    { name: "Organic", value: 312, color: "teal" },
  ]}
/>;

<BarList
  label="Top pages"
  data={[
    { name: "/pricing", value: 2480, href: "/pricing" },
    { name: "/docs", value: 1860 },
  ]}
/>;

<CategoryBar
  label="Accounts by plan"
  segments={[
    { name: "Free", value: 420, color: "cyan" },
    { name: "Pro", value: 260, color: "primary" },
  ]}
  marker={{ value: 500, label: "Paid goal" }}
/>;
```

### Area chart

`AreaChart` uses `categories`, `series`, `label`, `stacked` (true by default), `filled` (true by default), `legend` (true by default), `axes` (`all`, `x`, `none`), and `valueFormatter` (thousands of dollars by default).

### Line chart

`LineChart` uses `categories`, `series`, `label`, `smooth` (true by default), `showPoints` (true by default), `legend` (true by default), `axes` (`all`, `x`, `none`), and `valueFormatter` (a grouped count by default). Lines are not filled.

### Bar chart

`BarChart` uses `categories`, `series`, `label`, and `valueFormatter`.

### Timeline chart

`TimelineChart` draws a horizontal bar for each task, from `start` to `end`. `categories` are the rows. `series` is `{ name, data: { category, start, end, markers? }[], color?, swatch? }[]`. Each series keeps its own lane in a row. A marker is `{ name, at, color? }` and draws a line on that bar. Also `label`, `legend` (true by default), and `dateFormatter`. `start`, `end`, and `at` are a `Date`, a timestamp, or a `YYYY-MM-DD` date.

### Bubble chart

`BubbleChart` uses `series` (`{ name, data: { name, x, y, size }[], color? }[]`), `label`, `xLabel`, `yLabel`, `sizeLabel`, `legend` (true by default), `xFormatter`, `yFormatter`, and `sizeFormatter`. Position uses `x` and `y`. Bubble diameter uses `size`.

### Combo chart

`ComboChart` uses `categories`, `bars` (one series or more), `line` (one series), `label`, `stackBars`, `dualAxis` (true by default), `lineArea` (true by default), `barMaxWidth`, `barFormatter`, and `lineFormatter` (percent by default).

### Donut chart

`DonutChart` uses `data` (`{ name, value, color?, swatch? }[]`), `label`, `variant` (`donut` by default, or `pie`), `legend` (true by default), `showTotal` (true for a donut), `totalLabel` (`Total` by default), and `valueFormatter` (a grouped count by default).

### Treemap

`TreemapChart` uses `series` (`{ name, data: { name, value }[], color? }[]`), `label`, `legend` (true by default), `valueLabel` (`Value` by default), and `valueFormatter`. Tile area uses `value`. Color marks the series. The legend can hide a series.

### Bar list

`BarList` uses `data` (`{ name, value, href?, color?, icon? }[]`), `label`, `sortOrder` (`descending` by default, or `ascending` or `none`), `color` (`primary` by default), and `valueFormatter`. A row with `href` is a link. The bar length is relative to the largest value.

### Category bar

`CategoryBar` uses `segments` (`{ name, value, color? }[]`), `label`, `marker` (`{ value, label? }`), `legend` (true by default), and `valueFormatter`. The marker sits on the bar at its value.

### Heatmap

`HeatmapChart` uses `xLabels`, `yLabels`, `cells` (`[x, y, value][]`), `label`, and `valueLabel`.

### Radar chart

`RadarChart` uses `indicators` (`{ name, max }[]`), `series`, and `label`.

`Chart` with `useChartTheme()` draws any ECharts option with the theme's colors and fonts.

`ChartSeries` is `{ name, data: number[], color?: ChartColor, swatch?: string }`. `chartColorNames` lists the `ChartColor` values: `primary`, `cyan`, `teal`, `indigo`, `pink`, and `orange` for series, and `success`, `info`, `warning`, and `danger` only when a series means that status.

## Widgets

Sparkline and Metric tile import from `withy-ui`. The finished dashboard cards import from `withy-ui/widgets`. Pass your own data. The ones that draw charts load the charts entry.

### Sparkline

A sparkline shows the shape of a trend in a small space. Name what it shows.

```tsx
import { Sparkline } from "withy-ui";

<Sparkline data={[8, 12, 10, 14, 13, 18]} label="Weekly revenue trend" />;
```

Props: `data` (numbers), `label` (its accessible name), `color` (a CSS color, `var(--primary)` by default), `className` (`h-12 w-full` by default).

### Metric tile

A metric tile shows one figure with an icon and a label.

```tsx
import { MetricTile } from "withy-ui";

<MetricTile icon={<BarChart3 />} value="33.50%" label="Bounce rate" />;
```

Props: `icon`, `value`, `label`, `tone` (`primary`, `muted`).

### Revenue map

A revenue map shows sales by United States state and lists the five states with the highest earnings. Point at a state, or focus the map and use the arrow keys, to read its earnings.

```tsx
import { RevenueMap } from "withy-ui/widgets";

<RevenueMap
  label="United States sales map"
  rows={[
    { id: "CA", orders: 12201, earnings: 150200.8 },
    { id: "NY", orders: 8560, earnings: 117087.5 },
  ]}
/>;
```

- `rows` (`StateSale[]`): `{ id, orders, earnings }` for each state. `id` is the postal abbreviation. States you leave out draw as empty.
- `title` (`Sales revenue` by default): the card heading.
- `label` (`United States sales map` by default): the accessible name of the map.
- `className`: passed to the card.

### KPI cards

A grid of metric cards. Each card has a label, a figure, and an optional change. Import from `withy-ui/widgets`.

```tsx
import { KpiCards } from "withy-ui/widgets";

<KpiCards
  label="Audience"
  items={[
    { label: "Unique visitors", value: "10,450", change: { value: "-12.5%", direction: "down" } },
    {
      label: "Bounce rate",
      value: "56.1%",
      change: { value: "+1.8%", direction: "up", tone: "danger" },
    },
  ]}
/>;
```

- `label`: the accessible name of the group.
- `items`: `{ label, value, change?, previous?, hint?, href?, action?, accent? }`. `change` is `{ value, direction: "up" | "down", tone?: "success" | "danger" }`. The tone defaults from the direction. Set `tone` when a rise is a problem, such as a higher bounce rate. `previous` is shown as "from {previous}".
- `variant`: `inline` (default), `badge`, `stacked`, `linked`, `comparison`, `delta`, or `accent`. `linked` needs `href`. The link text defaults to "View {label}". `accent` draws a rail in `accent`, or `primary` when it is omitted.
- `className`: passed to the group.

### Stat strip

One bordered strip of figures. Cells stack on a narrow screen.

```tsx
import { StatStrip } from "withy-ui/widgets";

<StatStrip
  label="Deploys"
  items={[
    { label: "Number of deploys", value: "405", previous: "401" },
    { label: "Average deploy time", value: "3.65", unit: "mins" },
  ]}
/>;
```

- `items`: `{ label, value, previous?, unit? }`.
- `columns`: `1`, `2`, `3`, or `4`. Defaults from the number of items, up to 4.

### Icon stats

A metric card with a decorative icon, a figure, a change, and a link to the detail.

```tsx
import { Users } from "lucide-react";
import { IconStats } from "withy-ui/widgets";

<IconStats
  label="Subscribers"
  items={[
    {
      label: "Total subscribers",
      value: "71,897",
      icon: <Users />,
      href: "/subscribers",
      change: { value: "122", direction: "up" },
    },
  ]}
/>;
```

The icon is decorative. The label names the metric.

### Status KPI

A metric with a status. `within` is success, `observe` is warning, and `critical` is danger.

```tsx
import { StatusKpi } from "withy-ui/widgets";

<StatusKpi
  label="Operating range"
  items={[
    { label: "Daily active users", value: "345", status: "within", detail: "200–410" },
    { label: "Europe", value: "$10,023", status: "observe", goals: "3 of 5 goals", href: "/europe" },
  ]}
/>;
```

`detail` is shown after the status name. `goals` replaces the chip with a status row, and `href` makes that row a link.

### Usage meters

How much of a limit is used. `value` is a percent from 0 to 100, including a score out of 100.

```tsx
import { UsageMeters } from "withy-ui/widgets";

<UsageMeters
  label="Allowances"
  items={[{ label: "Requests", value: 9.96, current: "996", limit: "10,000" }]}
/>;
```

- `variant`: `bar` (default), `ring`, `budget`, or `score`.
- `title`, `titleAs` (`h2` by default), `description`, and `action` (`{ label, href, external? }`) sit above the grid.
- A score uses danger below 50, warning from 50 to 75, and success from 75, unless the item sets `tone`.
- `budget` uses `href` for the footer link.

### Spark KPI

A quote card with the latest figure, the change, and a sparkline.

```tsx
import { SparkKpi } from "withy-ui/widgets";

<SparkKpi
  label="Quotes"
  items={[
    {
      label: "Baer Limited",
      symbol: "BAL",
      value: "$49.33",
      change: "-9.85",
      changePercent: "-1.9%",
      direction: "down",
      data: [67, 58, 49],
    },
  ]}
/>;
```

Include the sign in `change` and `changePercent`. `tone` overrides the color when the direction alone would use the wrong status.

### Split KPI

A total split into named parts.

```tsx
import { SplitKpi } from "withy-ui/widgets";

<SplitKpi
  label="Tokens"
  items={[
    {
      label: "Average tokens per request",
      total: "341",
      parts: [
        { label: "Completion tokens", value: "136", amount: 136, color: "cyan" },
        { label: "Prompt tokens", value: "205", amount: 205, color: "indigo" },
      ],
    },
  ]}
/>;
```

`layout` is `legend` (default) or `rows`. `amount` sizes the bar. `value` is the formatted figure. `color` is a chart color.

### Channel split

One total, a bar of its parts, and a card for each part.

```tsx
import { ChannelSplit } from "withy-ui/widgets";

<ChannelSplit
  label="Total sales"
  total="$292,400"
  distributionLabel="Sales channel distribution"
  parts={[
    { label: "Direct sales", value: "$100.5K", amount: 34.4, color: "primary", href: "/direct" },
  ]}
/>;
```

A part with `href` is a link to that channel.

### Share cards

A headline figure and a list of shares.

```tsx
import { ShareCards } from "withy-ui/widgets";

<ShareCards
  label="Heart rate"
  items={[
    {
      label: "Running",
      value: "156",
      unit: "bpm",
      shareLabel: "Zone share",
      detailLabel: "BPM range",
      rows: [{ label: "Endurance", share: "25.5%", detail: "<126", href: "/endurance" }],
    },
  ]}
/>;
```

A row with `href` is a link.

### Dashboard cards

- `SatisfactionScore score change segments`: a score with a segmented breakdown.
- `AcquisitionPanel bounceRate sessions categories series learnMoreHref`: traffic sources with two metric tiles and an area chart.
- `ComplaintsPanel categories series`: complaints over time with a range select.
- `TicketStatus categories bars line totals asOf`: stacked bars, a line, and totals.
- `ActivityFeed items` (`ActivityItem[]`): recent events with icons.
- `HoldingsTable rows` (`Holding[]`): a data table of holdings with sparklines and signed figures.

## Blocks

Sample pages in the component docs. Copy the closest one, then change the copy and the fields. On a real page, use `PageHeader` for the single `h1`. These examples use `Heading` because the docs page already has one.

### Registration form

A short form for joining a workspace. Name, email, and address use a grid that becomes one column on a narrow screen.

### Profile form

Personal details, workspace settings, and notification choices. The description sits beside the fields on a wide screen.

### Plan application

An early-access form with a company and a choice of package. The included features follow the selected plan.

### Create workspace

Organization, workspace name, region, and a plan. A side card explains which plan fits.

### Members

Search, filter, invite, edit a role, and remove access. A search with no matches says how to clear it.

### Invite members

Invite by email and role, then review people with access and invites that are still waiting.

### Account settings

Tabs for email and password, workspace switches, and paid add-ons. A switch saves when it changes and stays outside the form. The other sections save with a button.

### Settings screen

A section list for profile, password, notifications, and billing, including a payment card.

### Sign in

A centered sign-in form with email, password, and a dialog that requests a reset link.

### Sign up

A centered sign-up form with a name, email, password, and agreement to the workspace terms.

## Examples

`withy-ui/examples` holds the docs site: page templates such as `SettingsPageTemplate`, `SignInTemplate`, `ChartsGalleryTemplate`, `WidgetsBoardTemplate`, `CalendarPageTemplate`, and `DashboardShell`, the guideline pages, and their fixture data. Read them to see how the pieces fit together. Don't ship them in a product: `DashboardShell` carries the Withy UI navigation and footer. Build your pages on `AppShell`.
