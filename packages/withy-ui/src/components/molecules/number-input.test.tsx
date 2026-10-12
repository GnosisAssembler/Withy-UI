import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "./form-field";
import { NumberInput } from "./number-input";

describe("NumberInput", () => {
  it("connects the label, hint, and error from the form field", () => {
    const { rerender } = render(
      <FormField label="Seats" hint="Between 1 and 20.">
        <NumberInput min={1} max={20} defaultValue={2} />
      </FormField>,
    );

    const input = screen.getByRole("spinbutton", { name: "Seats" });
    expect(input).toHaveAccessibleDescription("Between 1 and 20.");
    expect(input).toHaveAttribute("aria-valuemin", "1");
    expect(input).toHaveAttribute("aria-valuemax", "20");
    expect(input).toHaveAttribute("aria-valuenow", "2");
    expect(input).not.toHaveAttribute("aria-invalid");

    rerender(
      <FormField label="Seats" error="Enter a quantity from 1 to 20.">
        <NumberInput min={1} max={20} defaultValue={2} />
      </FormField>,
    );

    expect(screen.getByRole("spinbutton", { name: "Seats" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("spinbutton", { name: "Seats" })).toHaveAccessibleDescription(
      "Enter a quantity from 1 to 20.",
    );
  });

  it("steps with the buttons, arrow keys, and a larger jump", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="Seats" defaultValue={2} onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    expect(screen.getByRole("spinbutton")).toHaveValue("3");

    await user.click(screen.getByRole("button", { name: "Decrease" }));
    expect(screen.getByRole("spinbutton")).toHaveValue("2");

    await user.click(screen.getByRole("spinbutton"));
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("spinbutton")).toHaveValue("3");
    await user.keyboard("{Shift>}{ArrowUp}{/Shift}");
    expect(screen.getByRole("spinbutton")).toHaveValue("13");
    await user.keyboard("{PageDown}");
    expect(screen.getByRole("spinbutton")).toHaveValue("3");
  });

  it("keeps decimal steps exact and lands on the bounds", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <NumberInput key="steps" aria-label="Weight" defaultValue={0} step={0.1} min={0} max={1} />,
    );

    await user.click(screen.getByRole("button", { name: "Increase" }));
    await user.click(screen.getByRole("button", { name: "Increase" }));
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(screen.getByRole("spinbutton")).toHaveValue("0.3");

    rerender(<NumberInput key="ends" aria-label="Weight" defaultValue={1} min={1} max={1} />);
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Decrease" })).toBeDisabled();

    rerender(<NumberInput key="above" aria-label="Weight" defaultValue={40} max={10} />);
    await user.click(screen.getByRole("button", { name: "Decrease" }));
    expect(screen.getByRole("spinbutton")).toHaveValue("10");

    rerender(<NumberInput key="below" aria-label="Weight" defaultValue={1} min={5} />);
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(screen.getByRole("spinbutton")).toHaveValue("5");
  });

  it("starts an empty field on the nearest bound", async () => {
    const user = userEvent.setup();
    render(<NumberInput aria-label="Seats" min={1} max={8} />);

    expect(screen.getByRole("spinbutton")).not.toHaveAttribute("aria-valuenow");
    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(screen.getByRole("spinbutton")).toHaveValue("1");
    await user.click(screen.getByRole("spinbutton"));
    await user.keyboard("{End}");
    expect(screen.getByRole("spinbutton")).toHaveValue("8");
    await user.keyboard("{Home}");
    expect(screen.getByRole("spinbutton")).toHaveValue("1");
  });

  it("clamps a typed value on blur and drops characters that are not part of a number", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberInput
        aria-label="Quantity"
        defaultValue={2}
        min={1}
        max={10}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("spinbutton");
    await user.clear(input);
    await user.type(input, "1.");
    expect(input).toHaveValue("1.");
    await user.type(input, "5a");
    expect(input).toHaveValue("1.5");
    await user.tab();
    expect(input).toHaveValue("1.5");

    await user.click(input);
    await user.clear(input);
    await user.type(input, "40");
    await user.tab();
    expect(input).toHaveValue("10");
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  it("reverts an edit when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(<NumberInput aria-label="Seats" defaultValue={4} />);

    const input = screen.getByRole("spinbutton");
    await user.clear(input);
    await user.type(input, "9");
    await user.keyboard("{Escape}");
    expect(input).toHaveValue("4");
  });

  it("formats the idle value and shows a plain number while editing", async () => {
    const user = userEvent.setup();
    render(
      <NumberInput
        aria-label="Amount"
        defaultValue={1240.5}
        format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        prefix="$"
        suffix="USD"
      />,
    );

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue("1,240.50");
    expect(input).toHaveAttribute("aria-valuetext", "1,240.50");
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();

    await user.click(input);
    expect(input).toHaveValue("1240.5");
    await user.tab();
    expect(input).toHaveValue("1,240.50");
  });

  it("formats with the requested locale", () => {
    render(
      <NumberInput
        aria-label="Amount"
        locale="de-DE"
        defaultValue={1240.5}
        format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
      />,
    );

    expect(screen.getByRole("spinbutton")).toHaveValue("1.240,50");
  });

  it("submits the plain number and hides the stepper when asked", async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <NumberInput aria-label="Seats" name="seats" defaultValue={2} controls="none" />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    const hidden = container.querySelector('input[name="seats"]');
    expect(hidden).toHaveValue("2");

    const input = screen.getByRole("spinbutton");
    await user.click(input);
    await user.keyboard("{ArrowUp}");
    expect(hidden).toHaveValue("3");

    rerender(<NumberInput aria-label="Seats" defaultValue={2} controls="sides" />);
    expect(screen.getByRole("button", { name: "Increase" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Decrease" })).toBeEnabled();
  });

  it("blocks changes when disabled or read-only", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <NumberInput aria-label="Seats" defaultValue={2} disabled onValueChange={onValueChange} />,
    );

    expect(screen.getByRole("spinbutton")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();

    rerender(
      <NumberInput aria-label="Seats" defaultValue={2} readOnly onValueChange={onValueChange} />,
    );
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("readonly");
    await user.click(input);
    await user.keyboard("{ArrowUp}");
    expect(input).toHaveValue("2");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("steps with the wheel while the field is focused", () => {
    render(<NumberInput aria-label="Seats" defaultValue={2} />);
    const input = screen.getByRole("spinbutton");

    act(() => {
      input.dispatchEvent(
        new WheelEvent("wheel", { deltaY: -120, bubbles: true, cancelable: true }),
      );
    });
    expect(input).toHaveValue("2");

    act(() => {
      input.focus();
      input.dispatchEvent(
        new WheelEvent("wheel", { deltaY: -120, bubbles: true, cancelable: true }),
      );
    });
    expect(input).toHaveValue("3");
    act(() => {
      input.dispatchEvent(
        new WheelEvent("wheel", { deltaY: 120, bubbles: true, cancelable: true }),
      );
    });
    expect(input).toHaveValue("2");
  });
});
