import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders a contained primary action", () => {
    render(<Button>Generate report</Button>);
    expect(screen.getByRole("button", { name: "Generate report" })).toBeEnabled();
  });

  it("calls onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Print</Button>);
    await user.click(screen.getByRole("button", { name: "Print" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not submit a form by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });
});
