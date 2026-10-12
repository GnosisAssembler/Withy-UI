---
"withy-ui": minor
---

Keep one dialog, and add a drawer and an overlay.

`Dialog` is the centered panel. Pass `confirmLabel` and `tone="danger"` for a permanent delete, or `footer` for any other actions. `Drawer` slides in from the left or right. `Overlay` covers the page so you can show your own content. The header menu on a narrow screen opens a drawer.

Breaking changes:

- `Modal` is removed. Use `Dialog` with the same `title`, `confirmLabel`, `tone`, `onConfirm`, `trigger`, `open`, and `onOpenChange` props.
- `DialogTrigger`, `DialogContent`, `DialogBody`, `DialogFooter`, and `DialogClose` are removed. Pass `trigger`, `title`, children, and `footer` to `Dialog`.
