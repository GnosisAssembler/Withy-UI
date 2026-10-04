import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "@/components/atoms/input";
import { FormField } from "./form-field";

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
});
