import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "./form-field";
import { InputOtp } from "./input-otp";

function slots() {
  return document.querySelectorAll<HTMLElement>("[data-otp-index]");
}

describe("InputOtp", () => {
  it("connects the label, hint, and error from the form field", () => {
    const { rerender } = render(
      <FormField label="Verification code" hint="Enter the 6-digit code from your email.">
        <InputOtp />
      </FormField>,
    );

    const input = screen.getByRole("textbox", { name: "Verification code" });
    expect(input).toHaveAccessibleDescription("Enter the 6-digit code from your email.");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).not.toHaveAttribute("aria-invalid");

    rerender(
      <FormField label="Verification code" error="Enter the 6-digit code from your email.">
        <InputOtp />
      </FormField>,
    );

    expect(screen.getByRole("textbox", { name: "Verification code" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("textbox", { name: "Verification code" })).toHaveAccessibleDescription(
      "Enter the 6-digit code from your email.",
    );
  });

  it("takes digits, ignores other characters, and completes the code", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onComplete = vi.fn();
    render(
      <InputOtp
        aria-label="Verification code"
        onValueChange={onValueChange}
        onComplete={onComplete}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Verification code" });
    expect(slots()).toHaveLength(6);
    expect(document.querySelector("[data-active='true']")).toBeNull();

    await user.type(input, "12ab34");
    expect(input).toHaveValue("1234");
    expect(onValueChange).toHaveBeenLastCalledWith("1234");
    expect(onComplete).not.toHaveBeenCalled();
    expect(document.querySelector("[data-active='true']")).toHaveAttribute("data-otp-index", "4");

    await user.keyboard("56");
    expect(input).toHaveValue("123456");
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("123456");

    await user.keyboard("7");
    expect(input).toHaveValue("123456");
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("deletes, replaces the character at the caret, and pastes a full code", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<InputOtp aria-label="Verification code" onComplete={onComplete} />);
    const input = screen.getByRole("textbox", { name: "Verification code" });
    if (!(input instanceof HTMLInputElement)) {
      throw new Error("Expected an input");
    }

    await user.type(input, "1234");
    await user.keyboard("{Backspace}");
    expect(input).toHaveValue("123");

    await user.keyboard("456");
    input.setSelectionRange(2, 2);
    await user.keyboard("9");
    expect(input).toHaveValue("129456");
    expect(onComplete).toHaveBeenCalledTimes(2);

    input.setSelectionRange(0, 0);
    await user.paste("65-43 21");
    expect(input).toHaveValue("654321");
    expect(onComplete).toHaveBeenLastCalledWith("654321");
  });

  it("fills from an autofill change and submits the code", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    let submitted = "";
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitted = String(new FormData(event.currentTarget).get("code"));
        }}
      >
        <InputOtp aria-label="Verification code" name="code" onComplete={onComplete} />
        <button type="submit">Check code</button>
      </form>,
    );

    const input = screen.getByRole("textbox", { name: "Verification code" });
    fireEvent.change(input, { target: { value: "120 456" } });
    expect(input).toHaveValue("120456");
    expect(onComplete).toHaveBeenCalledWith("120456");

    await user.click(screen.getByRole("button", { name: "Check code" }));
    expect(submitted).toBe("120456");
  });

  it("uppercases letters and can hide the characters", async () => {
    const user = userEvent.setup();
    render(<InputOtp aria-label="Backup code" pattern="alphanumeric" length={4} mask />);
    const input = screen.getByRole("textbox", { name: "Backup code" });

    expect(input).toHaveAttribute("inputmode", "text");
    await user.type(input, "a-b12");
    expect(input).toHaveValue("AB12");
    expect(slots()[0]).toHaveTextContent("•");
    expect(slots()[3]).toHaveTextContent("•");
  });

  it("splits groups and ignores a group list that does not match the length", () => {
    const { rerender } = render(<InputOtp aria-label="Verification code" groups={[3, 3]} />);
    expect(slots()).toHaveLength(6);
    expect(document.querySelectorAll("[data-otp-separator]")).toHaveLength(1);

    rerender(<InputOtp aria-label="Verification code" groups={[2, 2]} />);
    expect(slots()).toHaveLength(6);
    expect(document.querySelectorAll("[data-otp-separator]")).toHaveLength(0);
  });

  it("blocks changes when disabled or read-only", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <InputOtp
        aria-label="Verification code"
        defaultValue="123456"
        disabled
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Verification code" });
    expect(input).toBeDisabled();
    expect(input).toHaveValue("123456");

    rerender(
      <InputOtp
        aria-label="Verification code"
        defaultValue="123456"
        readOnly
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Verification code" })).toHaveAttribute("readonly");
    await user.click(screen.getByRole("textbox", { name: "Verification code" }));
    await user.keyboard("9");
    expect(screen.getByRole("textbox", { name: "Verification code" })).toHaveValue("123456");
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
