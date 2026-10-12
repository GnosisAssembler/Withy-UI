import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Overlay } from "./overlay";

describe("Overlay", () => {
  it("covers the page with the named content and closes from the close button", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Overlay
        label="Invoice preview"
        onOpenChange={onOpenChange}
        trigger={<button type="button">Preview invoice</button>}
      >
        <p>Page one of invoice #1048.</p>
      </Overlay>,
    );

    await user.click(screen.getByRole("button", { name: "Preview invoice" }));
    expect(screen.getByRole("dialog", { name: "Invoice preview" })).toBeInTheDocument();
    expect(screen.getByText("Page one of invoice #1048.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
