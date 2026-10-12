import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { mainNav } from "../../data/navigation";
import { ThemeProvider } from "../theme/theme-provider";
import { Header } from "./header";

const nav = [
  { label: "Foundations", href: "/foundations" },
  {
    label: "Components",
    href: "/components",
    children: [
      { label: "Widgets", href: "/widgets" },
      { label: "Charts", href: "/charts" },
      { label: "Blocks", href: "/blocks" },
    ],
  },
];

describe("Header", () => {
  it("opens the Components menu", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Header nav={nav} pathname="/widgets" />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Components" }));

    expect(screen.getByRole("menuitem", { name: "Widgets" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("menuitem", { name: "Charts" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Blocks" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Calendar" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Settings" })).not.toBeInTheDocument();
  });

  it("links Components straight to its page in the docs navigation", () => {
    render(
      <ThemeProvider>
        <Header nav={mainNav} pathname="/components/button" />
      </ThemeProvider>,
    );

    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute("href", "/components");
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.queryByRole("button", { name: "Components" })).not.toBeInTheDocument();
  });

  it("shows your logo and actions", () => {
    render(
      <ThemeProvider>
        <Header
          nav={[{ label: "Invoices", href: "/invoices" }]}
          logo={<a href="/">Acme</a>}
          actions={<button type="button">Invite people</button>}
          themeSwitcher={false}
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole("link", { name: "Acme" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invite people" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Theme/ })).not.toBeInTheDocument();
  });

  it("leaves search, notifications, and the account menu off the top bar", () => {
    render(
      <ThemeProvider>
        <Header nav={nav} />
      </ThemeProvider>,
    );

    expect(screen.queryByRole("button", { name: "Search Withy UI" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Notifications" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Account menu" })).not.toBeInTheDocument();
  });

  it("opens navigation in a drawer", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Header nav={nav} pathname="/foundations" />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const dialog = screen.getByRole("dialog", { name: "Navigate" });
    expect(within(dialog).getByRole("link", { name: "Foundations" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
