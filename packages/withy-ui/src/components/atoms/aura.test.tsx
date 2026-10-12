import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Aura } from "./aura";

describe("Aura", () => {
  it("draws a primary border around its child", () => {
    render(
      <Aura>
        <button type="button">Subscribe</button>
      </Aura>,
    );

    const button = screen.getByRole("button", { name: "Subscribe" });
    const aura = button.parentElement;
    expect(aura).toHaveClass("withy-aura", "withy-aura-md", "text-primary");
    expect(aura?.style.getPropertyValue("--withy-aura-radius")).toBe("4px");
    expect(aura?.style.getPropertyValue("--withy-aura-duration")).toBe("");
  });

  it("keeps rainbow, holo, gold, and silver on their own palette", () => {
    const { rerender } = render(
      <Aura variant="rainbow">
        <p>Highlighted</p>
      </Aura>,
    );

    const aura = screen.getByText("Highlighted").parentElement;
    expect(aura).toHaveClass("withy-aura-rainbow");
    expect(aura).not.toHaveClass("text-primary");

    rerender(
      <Aura variant="gold">
        <p>Highlighted</p>
      </Aura>,
    );
    expect(screen.getByText("Highlighted").parentElement).toHaveClass("withy-aura-gold");
    expect(screen.getByText("Highlighted").parentElement).not.toHaveClass("text-primary");
  });

  it("accepts a color, size, radius, and duration", () => {
    render(
      <Aura variant="glow" color="cyan" size="xl" radius="full" duration={2000} className="w-full">
        <button type="button">Subscribe</button>
      </Aura>,
    );

    const aura = screen.getByRole("button", { name: "Subscribe" }).parentElement;
    expect(aura).toHaveClass("withy-aura-glow", "withy-aura-xl", "text-cyan", "w-full");
    expect(aura?.style.getPropertyValue("--withy-aura-radius")).toBe("9999px");
    expect(aura?.style.getPropertyValue("--withy-aura-duration")).toBe("2000ms");
  });

  it("lets a style override the radius", () => {
    render(
      <Aura radius="lg" style={{ "--withy-aura-radius": "12px" } as React.CSSProperties}>
        <p>Highlighted</p>
      </Aura>,
    );

    expect(
      screen.getByText("Highlighted").parentElement?.style.getPropertyValue("--withy-aura-radius"),
    ).toBe("12px");
  });
});
