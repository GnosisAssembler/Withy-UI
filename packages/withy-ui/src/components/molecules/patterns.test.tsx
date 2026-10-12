import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RadioGroup } from "../atoms/radio-group";
import { CheckboxField, RadioField, SwitchField } from "./choice-field";
import { CopyButton } from "./copy-button";
import { Fieldset } from "./fieldset";
import { Pagination } from "./pagination";
import { SegmentedControl } from "./segmented-control";
import { ToastProvider, useToast } from "./toast";

describe("choice fields", () => {
  it("names each control from its visible label", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <>
        <SwitchField
          label="Email alerts"
          description="Saves as soon as you change it."
          onCheckedChange={onCheckedChange}
        />
        <CheckboxField label="Remember me" />
        <Fieldset legend="Billing period">
          <RadioGroup defaultValue="monthly">
            <RadioField value="monthly" label="Monthly" />
            <RadioField value="yearly" label="Yearly" />
          </RadioGroup>
        </Fieldset>
      </>,
    );

    const alerts = screen.getByRole("switch", { name: "Email alerts" });
    expect(alerts).toHaveAccessibleDescription("Saves as soon as you change it.");
    await user.click(screen.getByText("Email alerts"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    await user.click(screen.getByText("Remember me"));
    expect(screen.getByRole("checkbox", { name: "Remember me" })).toBeChecked();

    expect(screen.getByRole("radiogroup", { name: "Billing period" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Monthly" })).toBeChecked();
  });
});

function stubClipboard(writeText: (value: string) => Promise<void>) {
  Object.defineProperty(window.navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

describe("CopyButton", () => {
  afterEach(() => {
    Reflect.deleteProperty(window.navigator, "clipboard");
  });

  it("copies the value and says so", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard(writeText);
    render(<CopyButton value="https://withy.example/r/1">Copy report link</CopyButton>);

    fireEvent.click(screen.getByRole("button", { name: "Copy report link" }));

    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith("https://withy.example/r/1");
  });

  it("says when the copy fails", async () => {
    stubClipboard(vi.fn().mockRejectedValue(new Error("Denied")));
    render(<CopyButton value="secret">Copy token</CopyButton>);

    fireEvent.click(screen.getByRole("button", { name: "Copy token" }));

    expect(await screen.findByRole("button", { name: "Copy failed" })).toBeInTheDocument();
  });
});

describe("SegmentedControl", () => {
  it("marks the current option and reports a change", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="Invoice view"
        defaultValue="table"
        onValueChange={onValueChange}
        options={[
          { label: "Table", value: "table" },
          { label: "Board", value: "board" },
        ]}
      />,
    );

    expect(screen.getByRole("radiogroup", { name: "Invoice view" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Table" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "Board" }));
    expect(onValueChange).toHaveBeenCalledWith("board");
  });
});

describe("Pagination", () => {
  it("folds a long range around the current page", () => {
    render(<Pagination page={6} pages={12} onPageChange={() => undefined} />);

    const pages = screen.getAllByRole("button", { name: /^Page / }).map((item) => item.textContent);
    expect(pages).toEqual(["1", "5", "6", "7", "12"]);
    expect(screen.getByRole("button", { name: "Page 6" })).toHaveAttribute("aria-current", "page");
  });
});

function RemoveInvoice({ onUndo }: { onUndo: () => void }) {
  const { toast } = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast({ title: "Invoice removed", action: { label: "Undo", onClick: onUndo } })
      }
    >
      Remove invoice
    </button>
  );
}

describe("toast", () => {
  it("offers an undo action", async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    render(
      <ToastProvider>
        <RemoveInvoice onUndo={onUndo} />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Remove invoice" }));
    expect(await screen.findByText("Invoice removed")).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Undo" }));
    });
    expect(onUndo).toHaveBeenCalledOnce();
  });
});
