import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Wraith } from "./wraith";

describe("Wraith", () => {
  it("stays hidden from assistive tech without a label", () => {
    const { container } = render(<Wraith />);

    const wraith = container.firstElementChild;
    expect(wraith).toHaveClass("withy-wraith", "withy-wraith-md");
    expect(wraith).toHaveAttribute("aria-hidden", "true");
    expect(wraith).not.toHaveAttribute("role");
  });

  it("takes a name from its label", () => {
    render(<Wraith label="Withy UI wraith" />);

    const wraith = screen.getByRole("img", { name: "Withy UI wraith" });
    expect(wraith).not.toHaveAttribute("aria-hidden");
  });

  it("accepts a size, a class, and other div props", () => {
    const { container } = render(
      <Wraith size="lg" className="fixed right-2 bottom-2" data-testid="mascot" />,
    );

    expect(screen.getByTestId("mascot")).toBe(container.firstElementChild);
    expect(container.firstElementChild).toHaveClass("withy-wraith-lg", "fixed", "right-2");
    expect(container.firstElementChild).not.toHaveClass("withy-wraith-md");
  });

  it("draws the sprite one path per color, from runs of pixels", () => {
    const { container } = render(<Wraith />);

    const sprite = container.querySelector(".withy-wraith-sprite");
    expect(sprite).toHaveAttribute("viewBox", "0 0 32 48");
    // The hood's tip is the first ink run: two pixels at column 21 of the top row.
    const ink = sprite?.querySelector("path");
    expect(ink?.getAttribute("d")).toMatch(/^M21 0h2v1h-2z/);
    expect(container.querySelectorAll(".withy-wraith-sway > g")).toHaveLength(3);
    expect(container.querySelectorAll(".withy-wraith-flame > g")).toHaveLength(3);
    expect(container.querySelectorAll(".withy-wraith-eyes > g")).toHaveLength(2);
  });

  it("places its light around the figure", () => {
    const { container } = render(<Wraith />);

    expect(container.querySelectorAll(".withy-wraith-mote")).toHaveLength(8);
    expect(container.querySelectorAll(".withy-wraith-drop")).toHaveLength(8);
    expect(container.querySelectorAll(".withy-wraith-ember")).toHaveLength(3);
    expect(container.querySelectorAll(".withy-wraith-twinkle")).toHaveLength(5);
    const mote = container.querySelector<HTMLElement>(".withy-wraith-mote");
    expect(mote?.style.getPropertyValue("--withy-wraith-travel")).toBe("22");
    expect(mote?.style.getPropertyValue("--withy-wraith-delay")).toBe("-0.4s");
  });
});
