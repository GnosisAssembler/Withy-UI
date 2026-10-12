import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { formatColor, parseColor, withChannel } from "../../lib/color";
import { FormField } from "../molecules/form-field";
import { ColorSlider } from "./color-slider";

describe("ColorSlider", () => {
  it("takes its name and description from the form field", () => {
    render(
      <FormField label="Brand color" hint="#FF0000">
        <ColorSlider defaultValue="#FF0000" />
      </FormField>,
    );

    const slider = screen.getByRole("slider", { name: "Brand color" });
    expect(slider).toHaveAccessibleDescription("#FF0000");
    expect(slider).toHaveAttribute("aria-valuetext", "#FF0000");
    expect(slider).toHaveAttribute("aria-valuenow", "0");
  });

  it("names a bare slider from its channel", () => {
    render(<ColorSlider channel="saturation" defaultValue="hsl(200, 40%, 30%)" />);

    expect(screen.getByRole("slider", { name: "Saturation" })).toHaveAttribute(
      "aria-valuenow",
      "40",
    );
  });

  it("changes the named channel and keeps the color format", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ColorSlider defaultValue="hsl(10, 80%, 40%)" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("slider", { name: "Hue" }));
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalledWith("hsl(11, 80%, 40%)");
    expect(screen.getByRole("slider", { name: "Hue" })).toHaveAttribute(
      "aria-valuetext",
      "hsl(11, 80%, 40%)",
    );
  });

  it("edits saturation, lightness, and alpha on their own", async () => {
    const user = userEvent.setup();
    const onSaturation = vi.fn();
    const onLightness = vi.fn();
    const onAlpha = vi.fn();

    render(
      <>
        <ColorSlider
          channel="saturation"
          defaultValue="hsl(200, 40%, 30%)"
          onValueChange={onSaturation}
        />
        <ColorSlider
          channel="lightness"
          defaultValue="rgb(0, 0, 255)"
          onValueChange={onLightness}
        />
        <ColorSlider channel="alpha" defaultValue="#ff0000" onValueChange={onAlpha} />
      </>,
    );

    await user.click(screen.getByRole("slider", { name: "Saturation" }));
    await user.keyboard("{ArrowRight}");
    await user.click(screen.getByRole("slider", { name: "Lightness" }));
    await user.keyboard("{ArrowLeft}");
    await user.click(screen.getByRole("slider", { name: "Alpha" }));
    await user.keyboard("{ArrowLeft}");

    expect(onSaturation).toHaveBeenCalledWith("hsl(200, 41%, 30%)");
    expect(onLightness).toHaveBeenCalledWith("rgb(0, 0, 250)");
    expect(onAlpha).toHaveBeenCalledWith("#FF0000FC");
  });

  it("keeps a hue change when every hue formats to the same color", async () => {
    const user = userEvent.setup();

    function Harness() {
      const [color, setColor] = React.useState("#000000");
      return <ColorSlider aria-label="Hue" channel="hue" value={color} onValueChange={setColor} />;
    }

    render(<Harness />);
    await user.click(screen.getByRole("slider", { name: "Hue" }));
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("slider", { name: "Hue" })).toHaveAttribute("aria-valuenow", "1");
    expect(screen.getByRole("slider", { name: "Hue" })).toHaveAttribute(
      "aria-valuetext",
      "#000000",
    );
  });

  it("moves off the end of the hue range without snapping back to the start", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ColorSlider defaultValue="#ff0000" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("slider", { name: "Hue" }));
    await user.keyboard("{End}");
    await user.keyboard("{ArrowLeft}");

    const hue359 = formatColor(withChannel(parseColor("#ff0000")!, "hue", 359));
    expect(onValueChange).toHaveBeenLastCalledWith(hue359);
    expect(screen.getByRole("slider", { name: "Hue" })).toHaveAttribute("aria-valuenow", "359");
  });

  it("leaves a disabled slider unchanged", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ColorSlider defaultValue="#ff0000" disabled onValueChange={onValueChange} />);

    const slider = screen.getByRole("slider", { name: "Hue" });
    expect(slider).toHaveAttribute("data-disabled");
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(slider).toHaveAttribute("aria-valuenow", "0");
  });

  it("submits the color with the form", () => {
    render(
      <form>
        <ColorSlider name="brand" defaultValue="hsl(200, 50%, 40%)" />
      </form>,
    );

    expect(document.querySelector("input[name='brand']")).toHaveValue("hsl(200, 50%, 40%)");
  });

  it("marks the field invalid when the form field has an error", () => {
    render(
      <FormField label="Brand color" error="Choose a color.">
        <ColorSlider defaultValue="#FF0000" />
      </FormField>,
    );

    expect(screen.getByRole("slider", { name: "Brand color" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("slider", { name: "Brand color" })).toHaveAccessibleDescription(
      "Choose a color.",
    );
  });
});
