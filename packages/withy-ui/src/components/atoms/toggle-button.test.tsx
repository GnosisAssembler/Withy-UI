import type { FormEvent } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToggleButton } from "./toggle-button";

describe("ToggleButton", () => {
  it("stays off until pressed", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<ToggleButton onPressedChange={onPressedChange}>Bold</ToggleButton>);

    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAttribute("data-state", "off");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-state", "on");
    expect(onPressedChange).toHaveBeenCalledExactlyOnceWith(true);

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(onPressedChange).toHaveBeenNthCalledWith(2, false);
  });

  it("starts pressed when defaultPressed is set", async () => {
    const user = userEvent.setup();
    render(<ToggleButton defaultPressed>Pin</ToggleButton>);

    const button = screen.getByRole("button", { name: "Pin" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps a controlled value and reports the next one", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ToggleButton pressed={false} onPressedChange={onPressedChange}>
        Bold
      </ToggleButton>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(onPressedChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles from the keyboard", async () => {
    const user = userEvent.setup();
    render(
      <ToggleButton icon aria-label="Star">
        <svg />
      </ToggleButton>,
    );

    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("button", { name: "Star" })).toHaveAttribute("aria-pressed", "true");
  });

  it("does not toggle while disabled", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ToggleButton disabled defaultPressed onPressedChange={onPressedChange}>
        Bold
      </ToggleButton>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("does not toggle when the click is cancelled", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <ToggleButton onClick={(event) => event.preventDefault()} onPressedChange={onPressedChange}>
        Bold
      </ToggleButton>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "false");
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("does not submit a form", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <ToggleButton>Bold</ToggleButton>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
