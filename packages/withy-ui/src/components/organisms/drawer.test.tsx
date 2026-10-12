import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "../atoms/button";
import { Drawer } from "./drawer";

describe("Drawer", () => {
  it("opens from the right and closes from the close button", async () => {
    const user = userEvent.setup();
    render(
      <Drawer
        title="Filters"
        description="Narrow the invoices on this page."
        trigger={<Button>Filter invoices</Button>}
      >
        Open invoices from this month.
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "Filter invoices" }));
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    expect(dialog).toHaveClass("right-0");
    expect(screen.getByText("Open invoices from this month.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sits on the left when asked", () => {
    render(
      <Drawer open title="Navigate" side="left" onOpenChange={() => undefined}>
        Invoices
      </Drawer>,
    );

    expect(screen.getByRole("dialog", { name: "Navigate" })).toHaveClass("left-0");
  });
});
