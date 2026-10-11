import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandBar } from "./command-bar";

const items = [
  { id: "foundations", label: "Foundations", group: "Pages" },
  { id: "calendar", label: "Calendar", group: "Pages", keywords: "month schedule" },
  { id: "dark", label: "Use dark theme", group: "Theme", keywords: "skin" },
];

describe("CommandBar", () => {
  it("filters commands and runs the highlighted one", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <CommandBar
        open
        onOpenChange={onOpenChange}
        items={items.map((item) => (item.id === "calendar" ? { ...item, onSelect } : item))}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: "Search commands" }), "cal");
    expect(screen.queryByRole("option", { name: "Foundations" })).not.toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Calendar" })).toBeInTheDocument();

    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
