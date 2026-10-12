import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "../theme/theme-provider";
import { ThemeSwitcher } from "./theme-switcher";

describe("ThemeSwitcher", () => {
  afterEach(() => {
    document.documentElement.dataset.theme = "light";
    localStorage.removeItem("withy-ui-theme");
  });

  it("switches from a light sun to a dark moon", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    const theme = screen.getByRole("switch", { name: "Dark theme" });
    expect(theme).not.toBeChecked();

    await user.click(theme);

    expect(theme).toBeChecked();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    await user.click(theme);

    expect(theme).not.toBeChecked();
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });
});
