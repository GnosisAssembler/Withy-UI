import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreditCardInput, type CreditCardValue } from "./credit-card-input";

const empty: CreditCardValue = { number: "", name: "", expiry: "", cvc: "" };

function preview() {
  const card = document.querySelector("[data-brand][data-side]");
  expect(card).not.toBeNull();
  return card as HTMLElement;
}

describe("CreditCardInput", () => {
  it("labels every field and starts with instructions", () => {
    render(<CreditCardInput />);

    expect(screen.getByRole("group", { name: "Payment card" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Card number" })).toHaveAccessibleDescription(
      "Enter the number on the front of the card.",
    );
    expect(screen.getByRole("textbox", { name: "Name on card" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Expiry" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Security code" })).toHaveAccessibleDescription(
      "3 digits on the back. American Express uses 4 on the front.",
    );
    expect(preview()).toHaveAttribute("data-brand", "unknown");
    expect(preview()).toHaveAttribute("data-side", "front");
  });

  it("formats a Visa number and changes the card", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onBrandChange = vi.fn();
    render(<CreditCardInput onValueChange={onValueChange} onBrandChange={onBrandChange} />);

    const number = screen.getByRole("textbox", { name: "Card number" });
    await user.type(number, "4242424242424242");

    expect(number).toHaveValue("4242 4242 4242 4242");
    expect(number).toHaveFocus();
    expect(number).toHaveAccessibleDescription("Visa");
    expect(preview()).toHaveAttribute("data-brand", "visa");
    expect(preview()).toHaveTextContent("4242424242424242");
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ number: "4242424242424242" }),
    );
    expect(onBrandChange).toHaveBeenCalledWith("visa");
    expect(onBrandChange).not.toHaveBeenCalledWith("unknown");
  });

  it("does not announce the brand already shown on the first render", () => {
    const onBrandChange = vi.fn();
    render(
      <CreditCardInput defaultValue={{ ...empty, number: "4242" }} onBrandChange={onBrandChange} />,
    );

    expect(onBrandChange).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "Card number" })).toHaveAccessibleDescription(
      "Visa",
    );
  });

  it("groups American Express and keeps its code on the front", async () => {
    const user = userEvent.setup();
    render(
      <CreditCardInput
        defaultValue={{ ...empty, number: "378282246310005", name: "Ada Lovelace" }}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Card number" })).toHaveValue("3782 822463 10005");
    expect(preview()).toHaveAttribute("data-brand", "amex");
    expect(preview()).toHaveTextContent("Ada Lovelace");
    expect(screen.getByRole("textbox", { name: "Security code" })).toHaveAccessibleDescription(
      "4 digits on the front of the card.",
    );

    await user.type(screen.getByRole("textbox", { name: "Security code" }), "12345");
    expect(screen.getByRole("textbox", { name: "Security code" })).toHaveValue("1234");
    expect(preview()).toHaveAttribute("data-side", "front");
    expect(preview()).toHaveTextContent("1234");
  });

  it("moves to the name when a fixed-length number is complete", async () => {
    const user = userEvent.setup();
    render(<CreditCardInput />);

    await user.type(screen.getByRole("textbox", { name: "Card number" }), "5555555555554444");

    expect(screen.getByRole("textbox", { name: "Card number" })).toHaveValue("5555 5555 5555 4444");
    expect(screen.getByRole("textbox", { name: "Name on card" })).toHaveFocus();
    expect(preview()).toHaveAttribute("data-brand", "mastercard");
  });

  it("strips separators and deletes the digit before a space", async () => {
    const user = userEvent.setup();
    render(<CreditCardInput />);

    const number = screen.getByRole<HTMLInputElement>("textbox", { name: "Card number" });
    await user.type(number, "4242-42");
    expect(number).toHaveValue("4242 42");

    await user.clear(number);
    await user.type(number, "42424");
    expect(number).toHaveValue("4242 4");
    number.setSelectionRange(5, 5);
    await user.keyboard("{Backspace}");
    expect(number).toHaveValue("4244");
  });

  it("formats the expiry and turns the card over for the security code", async () => {
    const user = userEvent.setup();
    render(<CreditCardInput defaultValue={{ ...empty, number: "4242424242424242" }} />);

    const expiry = screen.getByRole("textbox", { name: "Expiry" });
    await user.type(expiry, "1228");
    expect(expiry).toHaveValue("12/28");
    expect(preview()).toHaveTextContent("12/28");

    const cvc = screen.getByRole("textbox", { name: "Security code" });
    expect(cvc).toHaveFocus();
    expect(preview()).toHaveAttribute("data-side", "back");
    await user.type(cvc, "12345");
    expect(cvc).toHaveValue("123");
    expect(preview()).toHaveTextContent("123");
  });

  it("prefixes a single expiry digit above 1", async () => {
    const user = userEvent.setup();
    render(<CreditCardInput />);

    const expiry = screen.getByRole("textbox", { name: "Expiry" });
    await user.type(expiry, "3");
    expect(expiry).toHaveValue("03");
    await user.clear(expiry);
    await user.type(expiry, "13");
    expect(expiry).toHaveValue("1");
  });

  it("trims a 4 digit code when the brand becomes Visa", async () => {
    const user = userEvent.setup();

    function Harness() {
      const [card, setCard] = React.useState<CreditCardValue>({ ...empty, cvc: "1234" });
      return <CreditCardInput value={card} onValueChange={setCard} />;
    }

    render(<Harness />);
    expect(screen.getByRole("textbox", { name: "Security code" })).toHaveValue("1234");
    await user.type(screen.getByRole("textbox", { name: "Card number" }), "4");
    expect(screen.getByRole("textbox", { name: "Security code" })).toHaveValue("123");
  });

  it("connects field errors and can hide the card", () => {
    const { rerender } = render(
      <CreditCardInput
        errors={{
          number: "Enter a valid card number.",
          cvc: "Enter the 3 digit security code.",
        }}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Card number" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("textbox", { name: "Card number" })).toHaveAccessibleDescription(
      "Enter a valid card number.",
    );
    expect(screen.getByRole("textbox", { name: "Security code" })).toHaveAccessibleDescription(
      "Enter the 3 digit security code.",
    );

    rerender(<CreditCardInput preview={false} names={{ number: "cc-number" }} />);
    expect(document.querySelector("[data-side]")).toBeNull();
    expect(document.querySelector("input[name='cc-number']")).toHaveValue("");
  });

  it("disables every field", () => {
    render(<CreditCardInput disabled />);
    for (const name of ["Card number", "Name on card", "Expiry", "Security code"]) {
      expect(screen.getByRole("textbox", { name })).toBeDisabled();
    }
  });
});
