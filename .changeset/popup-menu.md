---
"withy-ui": minor
---

Keep one action menu, named `PopupMenu`.

Breaking changes:

- `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuLabel`, and `MenuSeparator` are now `PopupMenu`, `PopupMenuTrigger`, `PopupMenuContent`, `PopupMenuItem`, `PopupMenuLabel`, and `PopupMenuSeparator`.
- `PopupMenu` no longer takes `label`, `items`, and `group`. Compose the trigger and the items instead.
