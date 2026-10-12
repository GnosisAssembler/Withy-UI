import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Stepper } from "./stepper";

const invoiceSteps = [
  { label: "Customer", description: "Who the invoice is for." },
  { label: "Line items", description: "What you are billing." },
  { label: "Review", description: "Check the total, then send it." },
];

describe("Stepper", () => {
  it("marks the current step and completed steps before it", () => {
    render(<Stepper label="Create invoice" activeStep={1} steps={invoiceSteps} />);

    expect(screen.getByRole("navigation", { name: "Create invoice" })).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Completed: Customer");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[1]).toHaveTextContent("Current: Line items");
    expect(items[2]).toHaveTextContent("Review");
    expect(items[2]).not.toHaveTextContent("Completed:");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("opens earlier steps in a linear stepper and keeps later steps closed", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    render(
      <Stepper
        activeStep={1}
        onStepChange={onStepChange}
        contentId="invoice-panel"
        steps={invoiceSteps}
      />,
    );

    const current = screen.getByRole("button", { current: "step", name: /Line items/ });
    expect(current).toHaveAttribute("aria-controls", "invoice-panel");
    expect(screen.getByRole("button", { name: /Customer/ })).toHaveAttribute(
      "aria-controls",
      "invoice-panel",
    );
    expect(screen.queryByRole("button", { name: /Review/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Customer/ }));
    expect(onStepChange).toHaveBeenCalledWith(0);
  });

  it("opens every step when the sequence is not linear", async () => {
    const user = userEvent.setup();
    const onStepChange = vi.fn();
    render(
      <Stepper
        activeStep={0}
        linear={false}
        onStepChange={onStepChange}
        steps={[
          { label: "Customer" },
          { label: "Line items", disabled: true },
          { label: "Review" },
        ]}
      />,
    );

    expect(screen.queryByRole("button", { name: /Line items/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Review/ }));
    expect(onStepChange).toHaveBeenCalledWith(2);
  });

  it("shows an optional step and an error, including a skipped step", () => {
    render(
      <Stepper
        activeStep={2}
        steps={[
          { label: "Customer" },
          { label: "Billing address", optional: true, completed: false, error: "Enter a city." },
          { label: "Review" },
        ]}
      />,
    );

    expect(screen.getByText("Optional")).toBeInTheDocument();
    expect(screen.getByText("Enter a city.")).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveTextContent("Needs attention: Billing address");
    expect(items[1]).not.toHaveTextContent("Completed:");
    expect(items[2]).toHaveAttribute("aria-current", "step");
    expect(items[2]).toHaveTextContent("Current: Review");
  });

  it("shows the current step content and hides the others", () => {
    const { rerender } = render(
      <Stepper
        orientation="vertical"
        activeStep={1}
        steps={[
          { label: "Account details", content: "Name and email." },
          { label: "Billing address", content: "City and postal code." },
          { label: "Review", content: "Send the invoice." },
        ]}
      />,
    );

    expect(screen.getByText("City and postal code.")).toBeInTheDocument();
    expect(screen.queryByText("Name and email.")).not.toBeInTheDocument();
    expect(screen.queryByText("Send the invoice.")).not.toBeInTheDocument();

    rerender(
      <Stepper
        activeStep={0}
        steps={[{ label: "Customer", content: "Who the invoice is for." }, { label: "Review" }]}
      />,
    );
    expect(screen.getByText("Who the invoice is for.")).toBeInTheDocument();
  });

  it("marks every step complete when the active step is past the end", () => {
    render(<Stepper activeStep={3} steps={invoiceSteps} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    for (const item of items) {
      expect(item).toHaveTextContent("Completed:");
      expect(item).not.toHaveAttribute("aria-current");
    }
  });

  it("keeps labels under the markers selectable", () => {
    render(
      <Stepper
        label="Create invoice"
        labelPlacement="below"
        activeStep={1}
        onStepChange={() => undefined}
        steps={invoiceSteps}
      />,
    );

    expect(screen.getByRole("button", { current: "step", name: /Line items/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Review/ })).not.toBeInTheDocument();
  });

  it("shows compact text, dots, and progress for the same position", () => {
    const { rerender } = render(<Stepper variant="text" activeStep={1} steps={invoiceSteps} />);
    expect(screen.getByRole("navigation", { name: "Steps" })).toHaveTextContent("2 of 3");

    rerender(<Stepper variant="dots" activeStep={1} steps={invoiceSteps} />);
    const dots = screen.getAllByRole("listitem");
    expect(dots[0]).toHaveTextContent("Completed: Customer");
    expect(dots[1]).toHaveAttribute("aria-current", "step");
    expect(dots[1]).toHaveTextContent("Current: Line items");

    rerender(
      <Stepper
        variant="progress"
        activeStep={1}
        steps={[
          { label: "Customer" },
          { label: "Line items", error: "Add a line." },
          { label: "Review" },
        ]}
      />,
    );
    expect(screen.getByRole("progressbar", { name: "Step 2 of 3" })).toHaveAttribute(
      "aria-valuenow",
      "50",
    );
  });
});
