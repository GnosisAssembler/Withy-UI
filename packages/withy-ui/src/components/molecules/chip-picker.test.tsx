import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormField } from "./form-field";
import { TooltipProvider } from "./tooltip";
import { ChipPicker } from "./chip-picker";
import { ThemeProvider } from "../theme/theme-provider";

const tags = [
  { label: "Design", value: "design" },
  { label: "Billing", value: "billing" },
  { label: "Support", value: "support" },
  { label: "Archived", value: "archived" },
];

function renderPicker(ui: React.ReactNode) {
  return render(
    <ThemeProvider>
      <TooltipProvider>{ui}</TooltipProvider>
    </ThemeProvider>,
  );
}

describe("ChipPicker", () => {
  it("selects and removes chips", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Harness() {
      const [value, setValue] = React.useState<string[]>(["design"]);
      return (
        <ChipPicker
          aria-label="Tags"
          options={tags}
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }

    renderPicker(<Harness />);

    expect(screen.getByRole("button", { name: "Remove Design" })).toBeInTheDocument();
    await user.click(screen.getByRole("combobox", { name: "Tags" }));

    const listbox = screen.getByRole("listbox", { name: "Tags" });
    await user.click(within(listbox).getByRole("option", { name: "Billing" }));
    expect(onValueChange).toHaveBeenCalledWith(["design", "billing"]);
    expect(screen.getByRole("button", { name: "Remove Billing" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove Design" }));
    expect(onValueChange).toHaveBeenCalledWith(["billing"]);
  });

  it("creates an option from the search text", async () => {
    const user = userEvent.setup();
    const created: string[] = [];
    const onValueChange = vi.fn();

    function Harness() {
      const [options, setOptions] = React.useState(tags);
      const [value, setValue] = React.useState<string[]>([]);
      return (
        <ChipPicker
          aria-label="Tags"
          options={options}
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
          onCreate={(label) => {
            created.push(label);
            const nextValue = label.toLowerCase().replace(/\s+/g, "-");
            setOptions((current) => [...current, { label, value: nextValue }]);
          }}
        />
      );
    }

    renderPicker(<Harness />);

    await user.click(screen.getByRole("combobox", { name: "Tags" }));
    await user.type(screen.getByRole("textbox", { name: "Search or create" }), "Launch");
    await user.click(screen.getByRole("button", { name: "Create “Launch”" }));

    expect(created).toEqual(["Launch"]);
    expect(onValueChange).toHaveBeenCalledWith(["launch"]);
    expect(screen.getByRole("button", { name: "Remove Launch" })).toBeInTheDocument();
  });

  it("clears every chip and skips disabled options", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    renderPicker(
      <ChipPicker
        aria-label="Tags"
        options={tags}
        defaultValue={["design", "billing"]}
        disabledItemValues={["archived"]}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Tags" }));
    expect(screen.getByRole("option", { name: "Archived" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it("connects to FormField", () => {
    renderPicker(
      <FormField label="Tags" hint="Pick the topics for this report.">
        <ChipPicker options={tags} defaultValue={["support"]} />
      </FormField>,
    );

    expect(screen.getByRole("combobox", { name: "Tags" })).toHaveAccessibleDescription(
      "Pick the topics for this report.",
    );
  });
});
