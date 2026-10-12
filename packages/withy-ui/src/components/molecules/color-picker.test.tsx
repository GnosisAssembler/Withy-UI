import * as React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatColor, parseColor, withChannel } from "../../lib/color";
import { FormField } from "./form-field";
import { ColorPicker, colorPresets } from "./color-picker";

function Harness({
  onValueChange = vi.fn(),
  initial = "#FF0000",
  ...props
}: React.ComponentProps<typeof ColorPicker> & { initial?: string }) {
  const [color, setColor] = React.useState(initial);
  return (
    <FormField label="Brand color">
      <ColorPicker
        value={color}
        onValueChange={(next) => {
          onValueChange(next);
          setColor(next);
        }}
        {...props}
      />
    </FormField>
  );
}

function openPicker(user: ReturnType<typeof userEvent.setup>, name: string) {
  return user.click(screen.getByRole("button", { name }));
}

describe("ColorPicker", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("connects the field label, the current color, and the error", () => {
    const { rerender } = render(
      <FormField label="Brand color" hint="Used on charts.">
        <ColorPicker />
      </FormField>,
    );

    const trigger = screen.getByRole("button", { name: "Brand color Select a color" });
    expect(screen.getByLabelText("Brand color")).toBe(trigger);
    expect(trigger).toHaveAccessibleDescription("Used on charts.");
    expect(trigger).not.toHaveAttribute("aria-invalid");

    rerender(
      <FormField label="Brand color" error="Choose a color.">
        <ColorPicker />
      </FormField>,
    );

    expect(screen.getByRole("button", { name: "Brand color Select a color" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(
      screen.getByRole("button", { name: "Brand color Select a color" }),
    ).toHaveAccessibleDescription("Choose a color.");
  });

  it("chooses a preset, a typed color, and clears it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await openPicker(user, "Brand color #FF0000");
    const presets = screen.getByRole("group", { name: "Presets" });
    expect(within(presets).getAllByRole("button")).toHaveLength(colorPresets.length);
    expect(screen.getByRole("slider", { name: "Hue" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Alpha" })).toBeInTheDocument();

    await user.click(within(presets).getByRole("button", { name: "Primary" }));
    expect(onValueChange).toHaveBeenCalledWith("#0E7484");
    expect(within(presets).getByRole("button", { name: "Primary" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const color = screen.getByRole("textbox", { name: "Color" });
    await user.clear(color);
    await user.type(color, "#00ff00");
    expect(onValueChange).toHaveBeenCalledWith("#00FF00");

    await user.clear(color);
    await user.type(color, "#abc");
    expect(onValueChange).not.toHaveBeenCalledWith("#AABBCC");
    fireEvent.blur(color);
    expect(onValueChange).toHaveBeenCalledWith("#AABBCC");

    await user.clear(screen.getByRole("textbox", { name: "Color" }));
    await user.type(screen.getByRole("textbox", { name: "Color" }), "nope");
    fireEvent.blur(screen.getByRole("textbox", { name: "Color" }));
    expect(screen.getByRole("button", { name: "Brand color #AABBCC" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onValueChange).toHaveBeenCalledWith("");
    expect(screen.getByRole("button", { name: "Brand color Select a color" })).toBeInTheDocument();
  });

  it("changes saturation, lightness, hue, and alpha", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);

    await openPicker(user, "Brand color #FF0000");
    const area = screen.getByRole("slider", { name: "Saturation and lightness" });
    expect(area).toHaveAttribute("aria-valuetext", "100% saturation, 50% lightness");

    area.focus();
    await user.keyboard("{ArrowLeft}");
    expect(area).toHaveAttribute("aria-valuetext", "99% saturation, 50% lightness");
    expect(onValueChange).toHaveBeenCalledWith(
      formatColor(withChannel(parseColor("#FF0000")!, "saturation", 99)),
    );

    await user.click(screen.getByRole("slider", { name: "Hue" }));
    await user.keyboard("{ArrowRight}");
    expect(onValueChange.mock.calls.at(-1)?.[0]).not.toBe(
      formatColor(withChannel(parseColor("#FF0000")!, "saturation", 99)),
    );

    vi.spyOn(area, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 160,
      bottom: 144,
      width: 160,
      height: 144,
      toJSON() {
        return {};
      },
    });
    fireEvent.pointerDown(area, { clientX: 0, clientY: 72, pointerId: 1 });
    expect(onValueChange).toHaveBeenCalledWith("#808080");
    fireEvent.pointerMove(area, { clientX: 0, clientY: 144, pointerId: 1 });
    expect(onValueChange).toHaveBeenCalledWith("#000000");
    const calls = onValueChange.mock.calls.length;
    fireEvent.pointerUp(area, { pointerId: 1 });
    fireEvent.pointerMove(area, { clientX: 160, clientY: 72, pointerId: 1 });
    expect(onValueChange).toHaveBeenCalledTimes(calls);

    await user.click(screen.getByRole("slider", { name: "Alpha" }));
    await user.keyboard("{ArrowLeft}");
    expect(onValueChange).toHaveBeenCalledWith("#000000FC");
  });

  it("keeps a disabled field closed and uses a custom preset list", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ColorPicker aria-label="Brand color" disabled />);

    expect(screen.getByRole("button", { name: "Brand color" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Brand color" }));
    expect(screen.queryByRole("slider", { name: "Hue" })).not.toBeInTheDocument();

    rerender(
      <ColorPicker
        aria-label="Brand color"
        presets={[
          { label: "Ink", value: "#1c1428" },
          { label: "Broken", value: "nope" },
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Brand color" }));
    const presets = screen.getByRole("group", { name: "Presets" });
    expect(within(presets).getAllByRole("button")).toHaveLength(1);
    await user.click(within(presets).getByRole("button", { name: "Ink" }));
    expect(screen.getByRole("button", { name: "Brand color" })).toHaveTextContent("#1c1428");
  });

  it("samples a color from the screen and ignores a dismissed sampler", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    vi.stubGlobal(
      "EyeDropper",
      class {
        open() {
          return Promise.resolve({ sRGBHex: "#123456" });
        }
      },
    );
    const view = render(<Harness onValueChange={onValueChange} />);

    await openPicker(user, "Brand color #FF0000");
    await user.click(await screen.findByRole("button", { name: "Pick from the screen" }));
    expect(onValueChange).toHaveBeenCalledWith("#123456");

    vi.stubGlobal(
      "EyeDropper",
      class {
        open() {
          return Promise.reject(new DOMException("The user aborted a request."));
        }
      },
    );
    view.rerender(<Harness onValueChange={onValueChange} initial="#123456" />);
    await user.click(screen.getByRole("button", { name: "Pick from the screen" }));
    expect(onValueChange).not.toHaveBeenCalledWith("");
    expect(screen.getByRole("button", { name: "Brand color #123456" })).toBeInTheDocument();
  });
});
