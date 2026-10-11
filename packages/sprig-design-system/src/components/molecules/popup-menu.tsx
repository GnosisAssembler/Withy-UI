"use client";

import { Button } from "../atoms/button";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "./menu";

export type PopupMenuItem = {
  label: string;
  onSelect?: () => void;
  tone?: "danger";
};

export function PopupMenu({
  label,
  items,
  group,
}: {
  label: string;
  items: PopupMenuItem[];
  group?: string;
}) {
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button type="button" color="white" size="sm">
          {label}
        </Button>
      </MenuTrigger>
      <MenuContent>
        {group ? <MenuLabel>{group}</MenuLabel> : null}
        {items.map((item, index) =>
          item.label === "-" ? (
            <MenuSeparator key={`sep-${index}`} />
          ) : (
            <MenuItem
              key={item.label}
              className={item.tone === "danger" ? "text-danger" : undefined}
              onSelect={() => item.onSelect?.()}
            >
              {item.label}
            </MenuItem>
          ),
        )}
      </MenuContent>
    </Menu>
  );
}
