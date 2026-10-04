# Sprig

Sprig is a Next.js design system for dashboards, apps, and pages. Color, type, density, and screen structure are built with Radix primitives and Tailwind.

## Layers

| Layer     | Folder                     | Use it for                                        |
| --------- | -------------------------- | ------------------------------------------------- |
| Atoms     | `src/components/atoms`     | Button, badge, input, avatar, sparkline, progress |
| Molecules | `src/components/molecules` | Form field, stat, search, tabs, menu, meter list  |
| Organisms | `src/components/organisms` | Card, header, sidebar, table, dialog, page header |
| Templates | `src/components/templates` | A full dashboard, app, or page                    |

Import the public set from `@/components`.

## Examples

- `/` foundations: palette, type, and a live atom board
- `/examples/components` pickers, overlays, loaders, timeline, data table, command bar, code, and icons
- `/examples/charts` area, bar, heatmap, and mixed charts
- `/examples/widgets` map, score, acquisition, complaints, and tickets
- `/examples/calendar` month calendar
- `/examples/settings` profile and workspace settings
- `/signin` sign-in page
- `/signup` sign-up page

Storybook shows the same pieces one layer at a time, including full template recipes.

## Skins

Light and dark. The header skin menu stores the choice in `localStorage`.

Fonts are IBM Plex Sans for interface text, Rubik for metrics, and Inter for eyebrows, badges, and breadcrumbs.

## Scripts

```bash
pnpm dev
pnpm storybook
pnpm test
pnpm lint
pnpm format
pnpm typecheck
pnpm commit
pnpm changeset
pnpm version
```

`pnpm commit` opens Commitizen. `pnpm changeset` records a version change, and `pnpm version` applies it. Husky runs lint-staged before a commit and Commitlint on the message.
