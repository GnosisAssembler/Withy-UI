---
"withy-ui": minor
---

Add the components the Withy UI guidelines call for, and ship an agent skill with the guidelines.

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
