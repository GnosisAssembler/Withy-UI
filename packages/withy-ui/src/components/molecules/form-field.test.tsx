import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "../atoms/input";
import { Slider } from "../atoms/slider";
import { FormField } from "./form-field";
import { Select } from "./select";

describe("FormField", () => {
  it("connects the label to the control and shows an error", () => {
    render(
      <FormField label="Email" htmlFor="email" error="Enter a valid email address.">
        <Input id="email" aria-invalid />
      </FormField>,
    );

    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("wires the id, hint, and error without extra props", () => {
    const { rerender } = render(
      <FormField label="Report name" hint="Shown on the report cover.">
        <Input />
      </FormField>,
    );

    const input = screen.getByRole("textbox", { name: "Report name" });
    expect(input).toHaveAccessibleDescription("Shown on the report cover.");
    expect(input).not.toHaveAttribute("aria-invalid");

    rerender(
      <FormField label="Report name" error="Enter a name between 2 and 20 characters.">
        <Input />
      </FormField>,
    );

    expect(screen.getByRole("textbox", { name: "Report name" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("textbox", { name: "Report name" })).toHaveAccessibleDescription(
      "Enter a name between 2 and 20 characters.",
    );
  });

  it("names a select trigger and a slider thumb from the label", () => {
    render(
      <>
        <FormField label="Status">
          <Select options={[{ label: "Draft", value: "draft" }]} />
        </FormField>
        <FormField label="Session timeout" hint="30 minutes">
          <Slider min={15} max={120} defaultValue={[30]} />
        </FormField>
      </>,
    );

    expect(screen.getByRole("combobox", { name: "Status" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Session timeout" })).toHaveAccessibleDescription(
      "30 minutes",
    );
  });
});
