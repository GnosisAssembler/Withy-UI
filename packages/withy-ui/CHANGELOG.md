# withy-ui

## 0.2.0

### Minor Changes

- 9d351e2: Add `Accordion` for sections that open and close.
- 9d351e2: Add `Aura`, a moving light that highlights one card or button.
- 9d351e2: Add `BubbleChart` for a scatter plot where bubble size shows a third value.
- 9d351e2: Add `DonutChart`, `BarList`, and `CategoryBar` to the charts entry, beside the area, bar, and combo charts.
- 9d351e2: Add `ChipPicker` for multi-select with removable chips, search, and optional create.
- 9d351e2: Add `ColorPicker` for choosing a CSS color from a field, with a spectrum, hue and alpha sliders, and presets.
- 9d351e2: Add `ColorSlider` for choosing a color along hue, saturation, lightness, or alpha.
- 9d351e2: Add `ContextMenu` for actions on right click or long press.
- 9d351e2: Add `CreditCardInput`, a card form whose preview changes with the detected brand.
- 9d351e2: DataTable now runs on TanStack Table, with row selection, typed filters, pagination, row details, and a command bar for bulk actions.
- 9d351e2: Keep one dialog, and add a drawer and an overlay.

  `Dialog` is the centered panel. Pass `confirmLabel` and `tone="danger"` for a permanent delete, or `footer` for any other actions. `Drawer` slides in from the left or right. `Overlay` covers the page so you can show your own content. The header menu on a narrow screen opens a drawer.

  Breaking changes:

  - `Modal` is removed. Use `Dialog` with the same `title`, `confirmLabel`, `tone`, `onConfirm`, `trigger`, `open`, and `onOpenChange` props.
  - `DialogTrigger`, `DialogContent`, `DialogBody`, `DialogFooter`, and `DialogClose` are removed. Pass `trigger`, `title`, children, and `footer` to `Dialog`.

- 9d351e2: Show each file's size in the file uploader, and a loading state while it uploads.
- 9d351e2: Add the components the Withy UI guidelines call for, and ship an agent skill with the guidelines.

  New components: `AppShell`, `WithyProvider`, `Eyebrow`, `Figure`, `Link`, `Tag`, `EmptyState`, `InlineMessage`, `SegmentedControl`, `CopyButton`, `IconButton`, `SectionNav`, `DatePicker`, `CheckboxField`, `RadioField`, `SwitchField`, `Fieldset`, and `CardDescription`.

  Improvements:

  - `FormField` connects its label, hint, and error to the control inside it, and creates the id when `htmlFor` is left out.
  - `Button` takes `loading`. `Badge` takes `variant="muted"` and the `cyan` accent. `Text` takes `weight`, `as`, and the `heading`, `info`, and `warning` tones. `Heading` takes `size`.
  - `Dialog` takes `tone="danger"`, a controlled `open`, and an async `onConfirm` that keeps it open until the promise settles.
  - Toasts take an Undo `action` and a `duration`. `Alert` takes `actions`. `SearchInput` takes `onClear`.
  - `Header` takes `logo`, `actions`, and `themeSwitcher`. `Footer` takes its content and `links`. `Logo` takes `name` and `mark`. `PageHeader` no longer requires `crumbs`. `Sidebar` takes `label` and an `empty` message per section.
  - `DataTable` tells an empty table apart from one with no matches and offers Clear filters. `Pagination` folds long ranges.
  - Charts add the `cyan` and `warning` colors, and the default series no longer uses the success color.
  - `npx withy-ui add-skill` installs the agent skill for Claude Code and Cursor.

  Breaking changes:

  - `CardTitle` renders an `h2` by default. Pass `as="h3"` to keep the old level.
  - `Footer` no longer renders the Withy UI copyright on its own. Pass your own content.
  - The unused `HeaderUser` and `HeaderNotice` types are removed.

- 9d351e2: Add `HoverGallery` for product and portfolio images that change on horizontal hover.
- 9d351e2: Add `InputOtp` for a one-time code, with grouped slots, paste, and autofill.
- 9d351e2: Add dashboard widgets for key metrics: KPI cards, a shared-border stat strip, icon stats, status and usage meters, sparkline quotes, split totals, and share lists.
- 9d351e2: Add `LineChart` for comparing named series over categories, with points and no fill.
- 9d351e2: Add `NumberInput` for a labeled number with steppers, a prefix and suffix, and formatted values.
- 9d351e2: Keep one action menu, named `PopupMenu`.

  Breaking changes:

  - `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuLabel`, and `MenuSeparator` are now `PopupMenu`, `PopupMenuTrigger`, `PopupMenuContent`, `PopupMenuItem`, `PopupMenuLabel`, and `PopupMenuSeparator`.
  - `PopupMenu` no longer takes `label`, `items`, and `group`. Compose the trigger and the items instead.

- 9d351e2: Add stripes, shimmer, and indeterminate animations to Progress.
- 9d351e2: Add `QrCode` to turn a link or short text into a scannable code, with correction levels and loading, scanned, and expired states.
- 9d351e2: Add the revenue map to the widget docs. Each state can be read with the pointer or the arrow keys, and the card lists the five states with the highest earnings.
- 9d351e2: Add sample blocks for forms, members, settings, sign-in, and sign-up.
- 9d351e2: Add `Splitter` so people can resize panels by dragging the handle between them.
- 9d351e2: Add `TimelineChart` for horizontal bars that run from a start to an end, with one lane per series and a marker on a bar.
- 9d351e2: Add `ToggleButton` for a selection that stays pressed, such as starring a report or turning bold on.
- 9d351e2: Add `Tracker` for a sequence of statuses, such as daily uptime, with a tooltip on each block.
- 9d351e2: Add `TransferList` for moving items between an available list and a chosen list.
- 9d351e2: Add `TreemapChart` for a multi-series treemap where tile size shows the value and color shows the group.
- 9d351e2: Add `Truncate` for text that does not fit. It shortens the string with an ellipsis and shows the full text in a tooltip when the line is cut off.
- 9d351e2: Add `Wraith`, a pixel-art mascot that floats with its lantern in a drift of light, for a corner of the screen.

### Patch Changes

- 9d351e2: Quiet the theme switcher so the sun and moon share one track.
