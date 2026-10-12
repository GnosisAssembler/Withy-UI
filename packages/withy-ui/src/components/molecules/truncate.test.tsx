import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { TooltipProvider } from "./tooltip";
import { Truncate } from "./truncate";

const dimensions = ["scrollWidth", "clientWidth", "scrollHeight", "clientHeight"] as const;
const saved = new Map<string, PropertyDescriptor | undefined>();

function mockSize(overflow: boolean) {
  for (const name of dimensions) {
    if (!saved.has(name)) {
      saved.set(name, Object.getOwnPropertyDescriptor(HTMLElement.prototype, name));
    }
  }

  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: () => 80,
  });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get: () => 20,
  });
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    get: () => (overflow ? 240 : 40),
  });
  Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
    configurable: true,
    get: () => (overflow ? 80 : 20),
  });
}

afterEach(() => {
  for (const name of dimensions) {
    const descriptor = saved.get(name);
    if (descriptor) Object.defineProperty(HTMLElement.prototype, name, descriptor);
    else Reflect.deleteProperty(HTMLElement.prototype, name);
  }
  saved.clear();
});

function renderTruncate(ui: React.ReactElement) {
  return render(
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      {ui}
    </TooltipProvider>,
  );
}

describe("Truncate", () => {
  it("shows the full string on one line", () => {
    renderTruncate(
      <Truncate tone="heading" weight="medium">
        Northwind Trading
      </Truncate>,
    );

    const text = screen.getByText("Northwind Trading");
    expect(text.tagName).toBe("SPAN");
    expect(text).toHaveClass("truncate", "min-w-0", "text-heading", "font-medium");
    expect(text).not.toHaveAttribute("role", "button");
  });

  it("clamps to the given number of lines", () => {
    renderTruncate(
      <Truncate lines={2} as="p" size="sm" tone="secondary">
        Invoices for this account stay on this card until they are paid or written off.
      </Truncate>,
    );

    const text = screen.getByText(/Invoices for this account/);
    expect(text.tagName).toBe("P");
    expect(text).toHaveClass("text-text-2", "wrap-break-word");
    expect(text).not.toHaveClass("truncate");
    expect(text.style.webkitLineClamp).toBe("2");
  });

  it("treats a partial line count as a whole line", () => {
    renderTruncate(<Truncate lines={2.8}>Northwind Trading</Truncate>);
    expect(screen.getByText("Northwind Trading").style.webkitLineClamp).toBe("2");
  });

  it("shows the full string in a tooltip when the line is cut off", async () => {
    mockSize(true);
    const user = userEvent.setup();
    renderTruncate(<Truncate>Northwind Trading Company, Limited</Truncate>);

    const text = screen.getByText("Northwind Trading Company, Limited");
    expect(text).toHaveAttribute("data-truncated", "true");
    await user.hover(text);
    expect(await screen.findByRole("tooltip")).toHaveTextContent(
      "Northwind Trading Company, Limited",
    );
  });

  it("leaves the tooltip closed when the text fits", async () => {
    mockSize(false);
    const user = userEvent.setup();
    renderTruncate(<Truncate>Ada</Truncate>);

    const text = screen.getByText("Ada");
    expect(text).toHaveAttribute("data-truncated", "false");
    await user.hover(text);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("skips the tooltip when tooltip is off", () => {
    mockSize(true);
    render(<Truncate tooltip={false}>Northwind Trading Company, Limited</Truncate>);

    const text = screen.getByText("Northwind Trading Company, Limited");
    expect(text).toHaveAttribute("data-truncated", "true");
    expect(text).not.toHaveAttribute("data-state");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
