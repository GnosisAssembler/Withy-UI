"use client";

import { Palette } from "lucide-react";
import { Button } from "../atoms/button";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuTrigger } from "./menu";
import { useTheme } from "../theme/theme-provider";
import { themes } from "../../lib/theme";

const labels = {
  light: "Light",
  dark: "Dark",
} as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Menu>
      <MenuTrigger asChild>
        <Button color="white" size="sm" aria-label={`Theme: ${labels[theme]}`}>
          <Palette />
          <span className="hidden xl:inline">{labels[theme]}</span>
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuLabel>Theme</MenuLabel>
        {themes.map((item) => (
          <MenuItem key={item} onSelect={() => setTheme(item)}>
            {labels[item]}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
}
