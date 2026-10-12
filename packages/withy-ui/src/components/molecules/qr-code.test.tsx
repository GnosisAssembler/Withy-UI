import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QrCode, qrCodeSvg } from "./qr-code";

const value = "https://withy.dev";

function pathOf(container: HTMLElement) {
  return container.querySelector("path")?.getAttribute("d") ?? "";
}

describe("QrCode", () => {
  it("draws a scannable code from the value", () => {
    const { container } = render(<QrCode value={value} className="size-56" />);

    const code = screen.getByRole("img", { name: "QR code" });
    expect(code.tagName).toBe("svg");
    expect(code).toHaveAttribute("shape-rendering", "crispEdges");
    expect(pathOf(container).startsWith("M4 4.5h7")).toBe(true);
    expect(container.firstElementChild).toHaveClass("size-56", "bg-white", "text-gray-900");
    expect(container.firstElementChild).not.toHaveClass("size-48");
  });

  it("uses an explicit name and a different code for each value and level", () => {
    const { container, rerender } = render(<QrCode value={value} label="Profile link" />);
    expect(screen.getByRole("img", { name: "Profile link" })).toBeInTheDocument();

    const first = pathOf(container);
    rerender(<QrCode value="https://withy.dev/listen" label="Profile link" />);
    expect(pathOf(container)).not.toBe(first);

    rerender(<QrCode value={value} label="Profile link" level="H" />);
    expect(pathOf(container)).not.toBe(first);
    expect(pathOf(container).startsWith("M4 4.5h7")).toBe(true);
  });

  it("moves the quiet zone with the margin", () => {
    const { container } = render(<QrCode value={value} margin={0} />);
    expect(pathOf(container).startsWith("M0 0.5h7")).toBe(true);
  });

  it("asks for a value when the text is blank", () => {
    render(<QrCode value="   " />);
    expect(screen.getByText("Enter a value to generate a code.")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("says when the value is too long", () => {
    render(<QrCode value={"x".repeat(4000)} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "This value is too long for a QR code. Shorten it, or choose a lower correction level.",
    );
  });

  it("covers the code while it loads", () => {
    render(<QrCode value={value} status="loading" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("reports a successful scan", () => {
    render(<QrCode value={value} status="success" statusLabel="Pairing complete" />);
    expect(screen.getByRole("status")).toHaveTextContent("Pairing complete");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("offers a refresh when the code has expired", async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(
      <QrCode
        value={value}
        status="expired"
        onRefresh={onRefresh}
        refreshLabel="Generate a new code"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("QR code expired");
    await user.click(screen.getByRole("button", { name: "Generate a new code" }));
    expect(onRefresh).toHaveBeenCalledOnce();
  });

  it("leaves an expired code without a button when refresh is not offered", () => {
    render(<QrCode value={value} status="expired" />);
    expect(screen.getByText("QR code expired")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("qrCodeSvg", () => {
  it("returns a standalone svg that matches the component", () => {
    const { container } = render(<QrCode value={value} level="Q" margin={2} />);
    const svg = qrCodeSvg(value, { level: "Q", margin: 2 });

    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain('fill="#ffffff"');
    expect(svg).toContain('stroke="#1c1428"');
    expect(svg).toContain(pathOf(container));
    expect(svg).toContain("M2 2.5h7");
  });

  it("throws when there is nothing to encode or the value is too long", () => {
    expect(() => qrCodeSvg("  ")).toThrow("Enter a value to generate a code.");
    expect(() => qrCodeSvg("x".repeat(4000))).toThrow(/too long/);
  });
});
