"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/cn";
import {
  channelAmount,
  channelGradient,
  colorCss,
  formatColor,
  parseColor,
  withChannel,
  type ColorChannel,
  type ColorValue,
  type GradientDirection,
} from "../../lib/color";
import { useFieldContext, useFieldControl } from "../../lib/field";

export type { ColorChannel };

const fallbackSource = "#0e7484";

const bounds = {
  hue: { min: 0, max: 360 },
  saturation: { min: 0, max: 100 },
  lightness: { min: 0, max: 100 },
  alpha: { min: 0, max: 100 },
} as const;

const channelLabel: Record<ColorChannel, string> = {
  hue: "Hue",
  saturation: "Saturation",
  lightness: "Lightness",
  alpha: "Alpha",
};

const checkerboard: React.CSSProperties = {
  backgroundColor: "var(--card)",
  backgroundImage:
    "linear-gradient(45deg, var(--muted) 25%, transparent 25%), linear-gradient(-45deg, var(--muted) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--muted) 75%), linear-gradient(-45deg, transparent 75%, var(--muted) 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
};

type PreciseColor = {
  source: string;
  color: ColorValue;
};

function preciseColor(source: string): PreciseColor {
  const trimmed = source.trim();
  const parsed = parseColor(trimmed);
  if (parsed) return { source: trimmed, color: parsed };
  const fallback = parseColor(fallbackSource);
  return {
    source: fallbackSource,
    color: fallback ?? { h: 187, s: 81, l: 29, a: 1, format: "hex" },
  };
}

export type ColorSliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "value" | "defaultValue" | "onValueChange" | "onValueCommit" | "min" | "max" | "step" | "inverted"
> & {
  /** CSS color: hex, rgb, or hsl. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Channel the thumb changes. Hue is a rainbow. The others use the rest of the color. */
  channel?: ColorChannel;
};

export function ColorSlider({
  className,
  value,
  defaultValue,
  onValueChange,
  channel = "hue",
  orientation = "horizontal",
  dir,
  disabled,
  id,
  name,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: ColorSliderProps) {
  const field = useFieldContext();
  const control = useFieldControl({ id, "aria-describedby": ariaDescribedBy });
  const [precise, setPrecise] = React.useState(() => preciseColor(defaultValue ?? fallbackSource));

  const incoming = (value ?? precise.source).trim();
  // A formatted color can round back to the same string, so keep the channel values just set.
  const color =
    incoming === precise.source ? precise.color : (parseColor(incoming) ?? precise.color);
  const output = formatColor(color);
  const limit = bounds[channel];
  const vertical = orientation === "vertical";
  const direction: GradientDirection = vertical ? "to top" : dir === "rtl" ? "to left" : "to right";
  const labelledBy = ariaLabel ? undefined : (ariaLabelledBy ?? field?.labelId);

  function change(next: number[]) {
    const amount = next[0];
    if (amount === undefined) return;
    const updated = withChannel(color, channel, amount);
    const nextSource = formatColor(updated);
    setPrecise({ source: nextSource, color: updated });
    onValueChange?.(nextSource);
  }

  return (
    <SliderPrimitive.Root
      {...props}
      id={control.id}
      dir={dir}
      disabled={disabled}
      orientation={orientation}
      min={limit.min}
      max={limit.max}
      step={1}
      value={[channelAmount(color, channel)]}
      onValueChange={change}
      className={cn(
        "relative flex touch-none select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60",
        vertical ? "h-40 w-6 flex-col items-center" : "h-6 w-full items-center",
        className,
      )}
    >
      {name ? <input type="hidden" name={name} value={output} /> : null}
      <SliderPrimitive.Track
        className={cn(
          "relative grow overflow-hidden rounded-full",
          vertical ? "w-3" : "h-3 w-full",
        )}
      >
        {channel === "alpha" ? (
          <span aria-hidden className="absolute inset-0" style={checkerboard} />
        ) : null}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ background: channelGradient(color, channel, direction) }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={ariaLabel ?? (labelledBy ? undefined : channelLabel[channel])}
        aria-labelledby={labelledBy}
        aria-describedby={control["aria-describedby"]}
        aria-invalid={control["aria-invalid"]}
        aria-valuetext={output}
        className="relative block size-5 overflow-hidden rounded-full border-2 border-card shadow-sm outline-none ring-1 ring-heading/25 focus-visible:ring-4 focus-visible:ring-primary/25"
      >
        <span aria-hidden className="pointer-events-none absolute inset-0" style={checkerboard} />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: colorCss(color) }}
        />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
}
