import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Code, CodeBlock } from "./code";

describe("Code", () => {
  it("renders an inline token", () => {
    render(<Code>gap-2.5</Code>);
    expect(screen.getByText("gap-2.5").tagName).toBe("CODE");
  });
});

describe("CodeBlock", () => {
  afterEach(() => {
    Reflect.deleteProperty(window.navigator, "clipboard");
  });

  it("colors the snippet and copies the original text", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    const code = `export function Save() {\n  return <Button>Save</Button>;\n}`;
    const { container } = render(<CodeBlock label="tsx" code={code} />);

    expect(container.querySelector("pre")?.textContent).toBe(code);
    expect(screen.getByText("export")).toHaveClass("withy-tok-keyword");
    expect(screen.getByText("Save", { selector: ".withy-tok-function" })).toBeInTheDocument();
    expect(screen.getAllByText("Button", { selector: ".withy-tok-tag" })).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith(code);
  });
});
