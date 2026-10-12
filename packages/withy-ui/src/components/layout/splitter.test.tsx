import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Splitter,
  SplitterContext,
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterResizeTriggerSeparator,
  useSplitterContext,
} from "./splitter";

afterEach(() => {
  vi.restoreAllMocks();
});

function mockGroupSize(width: number, height: number) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const part = this.getAttribute("data-part");
    if (part === "root") return new DOMRect(0, 0, width, height);
    return new DOMRect(0, 0, 0, 0);
  });
}

function Example({
  orientation = "horizontal",
  ...props
}: Partial<React.ComponentProps<typeof Splitter>> & {
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <Splitter
      panels={[{ id: "invoices", minSize: 20 }, { id: "details" }]}
      defaultSize={[50, 50]}
      orientation={orientation}
      {...props}
    >
      <SplitterPanel id="invoices">Invoices</SplitterPanel>
      <SplitterResizeTrigger id="invoices:details" />
      <SplitterPanel id="details">Details</SplitterPanel>
    </Splitter>
  );
}

describe("Splitter", () => {
  it("names the handle and points it at both panels", () => {
    render(<Example />);

    const handle = screen.getByRole("separator", { name: "Resize invoices and details" });
    expect(handle).toHaveAttribute("aria-orientation", "horizontal");
    expect(handle).toHaveAttribute("aria-valuenow", "50");
    expect(handle).toHaveAttribute("aria-valuemin", "20");
    expect(handle).toHaveAttribute("aria-valuemax", "100");
    const ids = handle.getAttribute("aria-controls")?.split(" ") ?? [];
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[0]!)?.textContent).toBe("Invoices");
    expect(document.getElementById(ids[1]!)?.textContent).toBe("Details");
    expect(document.querySelector("[data-part='resize-trigger-indicator']")).toBeInTheDocument();
  });

  it("resizes from the keyboard and skips a disabled handle", async () => {
    const user = userEvent.setup();
    const onResize = vi.fn();
    render(<Example onResize={onResize} />);
    expect(onResize).not.toHaveBeenCalled();

    const handle = screen.getByRole("separator");
    handle.focus();
    await user.keyboard("{ArrowRight}");
    expect(handle).toHaveAttribute("aria-valuenow", "51");

    await user.keyboard("{Shift>}{ArrowRight}{/Shift}");
    expect(handle).toHaveAttribute("aria-valuenow", "61");

    await user.keyboard("{Home}");
    expect(handle).toHaveAttribute("aria-valuenow", "20");

    await user.keyboard("{End}");
    expect(handle).toHaveAttribute("aria-valuenow", "100");
    expect(onResize).toHaveBeenCalled();
  });

  it("ignores a disabled handle", () => {
    render(
      <Splitter panels={[{ id: "invoices" }, { id: "details" }]} defaultSize={[50, 50]}>
        <SplitterPanel id="invoices">Invoices</SplitterPanel>
        <SplitterResizeTrigger id="invoices:details" disabled />
        <SplitterPanel id="details">Details</SplitterPanel>
      </Splitter>,
    );

    const disabled = screen.getByRole("separator");
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(disabled, { key: "ArrowRight" });
    expect(disabled).toHaveAttribute("aria-valuenow", "50");
  });

  it("resizes vertically and by dragging", () => {
    mockGroupSize(1000, 400);
    const onResizeEnd = vi.fn();
    render(<Example orientation="vertical" onResizeEnd={onResizeEnd} />);

    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("aria-orientation", "vertical");
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(handle).toHaveAttribute("aria-valuenow", "50");
    fireEvent.keyDown(handle, { key: "ArrowDown" });
    expect(handle).toHaveAttribute("aria-valuenow", "51");

    fireEvent.pointerDown(handle, { button: 0, pointerId: 1, isPrimary: true, clientY: 100 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientY: 200 });
    fireEvent.pointerUp(handle, { pointerId: 1, clientY: 200 });
    expect(handle).toHaveAttribute("aria-valuenow", "76");
    expect(onResizeEnd).toHaveBeenCalledWith(
      expect.objectContaining({ resizeTriggerId: "invoices:details" }),
    );
  });

  it("collapses from the keyboard and resets from the handle", async () => {
    const user = userEvent.setup();

    function Collapsible() {
      return (
        <Splitter
          panels={[
            { id: "invoices", collapsible: true, collapsedSize: 0, minSize: 20 },
            { id: "details" },
          ]}
          defaultSize={[50, 50]}
        >
          <SplitterPanel id="invoices">Invoices</SplitterPanel>
          <SplitterContext>
            {(splitter) => (
              <SplitterResizeTrigger
                id="invoices:details"
                onDoubleClick={() => splitter.resetSizes()}
              >
                <SplitterResizeTriggerSeparator />
              </SplitterResizeTrigger>
            )}
          </SplitterContext>
          <SplitterPanel id="details">Details</SplitterPanel>
        </Splitter>
      );
    }

    render(<Collapsible />);
    expect(
      document.querySelector("[data-part='resize-trigger-indicator']"),
    ).not.toBeInTheDocument();

    const handle = screen.getByRole("separator");
    handle.focus();
    await user.keyboard("{Enter}");
    expect(handle).toHaveAttribute("aria-valuenow", "0");
    expect(document.querySelector("[data-id='invoices']")).toHaveAttribute(
      "data-collapsed",
      "true",
    );

    await user.keyboard("{Enter}");
    expect(handle).toHaveAttribute("aria-valuenow", "50");

    await user.keyboard("{ArrowRight}");
    expect(handle).toHaveAttribute("aria-valuenow", "51");
    await user.dblClick(handle);
    expect(handle).toHaveAttribute("aria-valuenow", "50");
  });

  it("reports controlled sizes and can collapse from outside", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [size, setSize] = React.useState<number[]>([40, 60]);
      return (
        <Splitter
          panels={[
            { id: "invoices", collapsible: true, collapsedSize: 5, minSize: 20 },
            { id: "details", minSize: 30 },
          ]}
          size={size}
          onResize={(details) => setSize(details.size)}
        >
          <SplitterPanel id="invoices">Invoices</SplitterPanel>
          <SplitterResizeTrigger id="invoices:details" />
          <SplitterPanel id="details">
            <Collapse />
          </SplitterPanel>
          <output>{size.map((value) => value.toFixed(0)).join(",")}</output>
        </Splitter>
      );
    }

    function Collapse() {
      const splitter = useSplitterContext();
      return (
        <button type="button" onClick={() => splitter.collapsePanel("invoices")}>
          Collapse invoices
        </button>
      );
    }

    render(<Controlled />);
    expect(screen.getByText("40,60")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toHaveAttribute("aria-valuenow", "40");

    await user.click(screen.getByRole("button", { name: "Collapse invoices" }));
    expect(screen.getByText("5,95")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toHaveAttribute("aria-valuenow", "5");
  });
});
