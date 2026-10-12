# CSS utilities

Withy UI defines its tokens with Tailwind CSS 4 `@theme`, so these classes exist in any app that imports `withy-ui/styles.css`. Use them for custom markup. Never use the default Tailwind palette (`bg-blue-500`, `text-gray-600`), raw hex values, or arbitrary colors.

## Color

Color utilities read the theme tokens. The same class shifts between light and dark.

### Surfaces

| Class | Use |
| --- | --- |
| `bg-background` | The page canvas. |
| `bg-card` | Cards, menus, and dialogs. |
| `bg-muted` | A quiet fill behind a group. |
| `bg-header` | The top bar. |

### Text

| Class | Use |
| --- | --- |
| `text-heading` | Titles and the words that carry the point. |
| `text-text` | Body copy. |
| `text-text-2` | Supporting sentences. |
| `text-text-3` | Hints and metadata. |
| `text-text-4` | The faintest label that still has a job. |

### Roles

| Class | Use |
| --- | --- |
| `bg-primary text-primary-foreground` | The main action and selected state. |
| `bg-secondary text-secondary-foreground` | A quiet action. |
| `bg-success text-success-foreground` | Confirmation. |
| `bg-info text-info-foreground` | Neutral information. |
| `bg-warning text-warning-foreground` | A caution. |
| `bg-danger text-danger-foreground` | A destructive action or an error. |
| `bg-brand` | A deep panel. |

### Accents

Accents separate chart series and tags. They do not mean success, warning, or danger.

| Class | Use |
| --- | --- |
| `bg-cyan` | Blue series. |
| `bg-orange` | Peach series. |
| `bg-indigo` | Purple series. |
| `bg-teal` | Mint series. |
| `bg-pink` | Pink series. |

### Borders and focus

| Class | Use |
| --- | --- |
| `border border-border` | The hairline on cards, fields, and menus. |
| `focus-visible:ring-4 focus-visible:ring-primary/25` | The focus ring on controls. |

## Typography

IBM Plex Sans is the interface. Rubik is for figures. Inter is for eyebrows.

| Class | Use |
| --- | --- |
| `font-sans` | IBM Plex Sans. Body and headings. |
| `font-rubik` | Figures. |
| `font-inter` | Eyebrows. 10px, semibold, uppercase. |
| `font-mono text-[12px]` | Code. |
| `text-[0.875rem] leading-[1.5]` | Body. 14px, line-height 1.5. |
| `text-[13px]` | Compact interface text. |
| `font-medium` | Headings and emphasis. Weight 500. |
| `font-semibold` | Eyebrows and badges. Weight 600. |

## Spacing

Space steps off a 4px unit. 10px sits between 8px and 12px, and it is the gap between cards.

| Class | Use |
| --- | --- |
| `gap-1` | 4px. An icon beside a label. |
| `gap-2` | 8px. A button group. |
| `gap-2.5` | 10px. The gap between cards. |
| `gap-3` | 12px. Related items. Also p-3, compact padding. |
| `gap-4` | 16px. Padding inside a card. Also p-4. |
| `gap-5` | 20px. Padding around the page. Also p-5. |
| `gap-6` | 24px. A block and the actions that follow it. |
| `gap-8` | 32px. The space between sections. |

## Radius

Corners use four radii. Controls use the smallest. Cards use the next.

| Class | Use |
| --- | --- |
| `rounded-xs` | 3px. Controls, badges, menu items, and code. |
| `rounded-sm` | 4px. Cards, fields, and buttons. |
| `rounded-md` | 6px. A slightly softer panel. |
| `rounded-lg` | 8px. The largest corner in the system. |
| `rounded-full` | Circles. Avatars, switches, and the tick on a Do example. |

## Shadow

Cards use one elevation shadow. In dark mode that shadow is transparent, and the border does the work.

| Class | Use |
| --- | --- |
| `shadow-elevation` | The card shadow. A 10px blur at 6% ink in light. Transparent in dark. |

## Layout

Stack, Row, and Grid are the layout pieces. These are the classes they apply.

### Flow

| Class | Use |
| --- | --- |
| `flex flex-col gap-2` | Stack. Items down the page, 8px apart. |
| `flex flex-row flex-wrap items-center gap-2` | Row. Items across, wrapping. |

### Grid

| Class | Use |
| --- | --- |
| `grid grid-cols-12 gap-2.5` | The 12-column grid. The gutter is 10px. |
| `col-span-12 md:col-span-8` | Full width below 768px, then 8 of 12 columns. |
| `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` | Equal columns. One, then two from 768px, then three from 1280px. |

## Motion

Motion is limited to a spinner and a skeleton pulse.

| Class | Use |
| --- | --- |
| `animate-spin` | The spinner. A ring with a transparent edge. |
| `animate-pulse` | Skeleton placeholders while a region loads. |

## Rules for custom markup

- Prefer a component. Write classes only for layout glue or a one-off region.
- Merge classes with `cn()` from withy-ui, so a `className` passed in wins over a default.
- Give any custom interactive element `outline-none focus-visible:ring-4 focus-visible:ring-primary/25`.
- Motion is `animate-spin` and `animate-pulse` only. Add `motion-reduce:animate-none` to decorative motion.
- Dark mode comes from `data-theme="dark"` on `<html>`, which `ThemeProvider` sets. Never write `dark:` variants.
