import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "./form-field";
import { TooltipProvider } from "./tooltip";
import { TransferList, type TransferItem } from "./transfer-list";

const columns: TransferItem[] = [
  { label: "Invoice", value: "invoice" },
  { label: "Customer", value: "customer", description: "The account on the invoice." },
  { label: "Amount", value: "amount" },
  { label: "Archived", value: "archived", disabled: true },
];

function renderList(ui: React.ReactNode) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

function listText(name: string) {
  return screen.getByRole("list", { name }).textContent ?? "";
}

describe("TransferList", () => {
  it("names both lists and describes each item", () => {
    renderList(<TransferList items={columns} defaultValue={["amount"]} />);

    expect(screen.getByRole("list", { name: "Available" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Chosen" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Customer" })).toHaveAccessibleDescription(
      "The account on the invoice.",
    );
    expect(
      screen.getByRole("checkbox", { name: "Select all available" }),
    ).toHaveAccessibleDescription("0 of 3 selected");
    expect(screen.getByRole("checkbox", { name: "Select all chosen" })).toHaveAccessibleDescription(
      "0 of 1 selected",
    );
    expect(screen.getByRole("button", { name: "Move all to chosen" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Move selected to chosen" })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: "Archived" })).toBeDisabled();
    expect(listText("Chosen")).toContain("Amount");
    expect(listText("Available")).not.toContain("Amount");
  });

  it("moves selected items, skips disabled ones, and returns them in catalog order", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Harness() {
      const [chosen, setChosen] = React.useState<string[]>([]);
      return (
        <TransferList
          items={columns}
          value={chosen}
          onValueChange={(next) => {
            onValueChange(next);
            setChosen(next);
          }}
        />
      );
    }

    renderList(<Harness />);

    await user.click(screen.getByText("Amount"));
    expect(screen.getByRole("checkbox", { name: "Amount" })).toBeChecked();
    await user.click(screen.getByText("Amount"));
    expect(screen.getByRole("checkbox", { name: "Amount" })).not.toBeChecked();

    await user.click(screen.getByRole("checkbox", { name: "Amount" }));
    await user.click(screen.getByRole("checkbox", { name: "Invoice" }));
    expect(screen.getByRole("checkbox", { name: "Select all available" })).toBePartiallyChecked();

    await user.click(screen.getByRole("button", { name: "Move selected to chosen" }));

    expect(onValueChange).toHaveBeenCalledWith(["invoice", "amount"]);
    expect(listText("Chosen").indexOf("Invoice")).toBeLessThan(
      listText("Chosen").indexOf("Amount"),
    );
    expect(listText("Available")).toContain("Archived");
    expect(listText("Available")).not.toContain("Invoice");
    expect(screen.getByRole("status")).toHaveTextContent("Moved 2 items to chosen");
    expect(screen.getByRole("checkbox", { name: "Invoice" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Move selected to chosen" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Move all to chosen" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["invoice", "amount", "customer"]);
    expect(listText("Available")).toContain("Archived");
    expect(listText("Available")).not.toContain("Customer");
    expect(screen.getByRole("button", { name: "Move all to chosen" })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: "Select all available" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Move all to available" }));
    const available = listText("Available");
    expect(available.indexOf("Invoice")).toBeLessThan(available.indexOf("Customer"));
    expect(available.indexOf("Customer")).toBeLessThan(available.indexOf("Amount"));
    expect(available.indexOf("Amount")).toBeLessThan(available.indexOf("Archived"));
    expect(screen.getByText("Nothing chosen")).toBeInTheDocument();
  });

  it("selects every enabled item, and connects a form field", async () => {
    const user = userEvent.setup();
    const { rerender } = renderList(
      <FormField label="Report columns" hint="Chosen columns appear in this order.">
        <TransferList
          items={columns}
          defaultValue={[]}
          showMoveAll={false}
          availableLabel="Open columns"
          chosenLabel="Report"
        />
      </FormField>,
    );

    expect(screen.getByRole("group", { name: "Report columns" })).toHaveAccessibleDescription(
      "Chosen columns appear in this order.",
    );
    expect(screen.getByRole("list", { name: "Open columns" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Move all to report" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Move selected to report" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move selected to open columns" })).toBeDisabled();

    await user.click(screen.getByRole("checkbox", { name: "Select all open columns" }));
    expect(screen.getByRole("checkbox", { name: "Invoice" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Customer" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Amount" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Archived" })).not.toBeChecked();

    rerender(
      <TooltipProvider>
        <FormField label="Report columns" error="Choose at least one column.">
          <TransferList items={columns} defaultValue={[]} disabled />
        </FormField>
      </TooltipProvider>,
    );

    expect(screen.getByRole("group", { name: "Report columns" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("checkbox", { name: "Invoice" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move all to chosen" })).toBeDisabled();
  });
});
