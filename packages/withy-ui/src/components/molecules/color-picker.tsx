"use client";

import * as React from "react";
import { Pipette } from "lucide-react";
import { accentSwatches, brandSwatches } from "../../lib/palette";
import { colorCss, formatColor, parseColor, type ColorValue } from "../../lib/color";
import { cn } from "../../lib/cn";
import { FieldContext, useFieldContext, useFieldControl } from "../../lib/field";
import { fieldClass, fieldSize } from "../../lib/styles";
import { Button } from "../atoms/button";
import { ColorSlider } from "../atoms/color-slider";
import { IconButton } from "./icon-button";
import { Popup, PopupContent, PopupTrigger } from "./popup";

export type ColorPreset = {
  label: string;
  value: string;
};

export type ColorPickerProps = {
  id?: string;
  /** A CSS color (`#rrggbb`, `rgb()`, or `hsl()`), or `""` when none is chosen. */
  value?: string;
  defaultValue?: string;
  /** Receives a CSS color, or `""` when the color is cleared. */
  onValueChange?: (value: string) => void;
  /** Swatches under the spectrum. Values that are not a CSS color are skipped. */
  presets?: readonly ColorPreset[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

type Draft = {
  source: string;
  color: ColorValue;
};

const checkerboard: React.CSSProperties = {
  backgroundColor: "var(--card)",
  backgroundImage:
    "linear-gradient(45deg, var(--muted) 25%, transparent 25%), linear-gradient(-45deg, var(--muted) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--muted) 75%), linear-gradient(-45deg, transparent 75%, var(--muted) 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function presetFrom(label: string, value: string): ColorPreset | null {
  const trimmed = value.trim();
  if (label.trim() === "" || !parseColor(trimmed)) return null;
  return { label: label.trim(), value: trimmed };
}

export const colorPresets: readonly ColorPreset[] = [
  ...brandSwatches.filter((swatch) => swatch.name === "Primary" || swatch.name === "Brand"),
  ...accentSwatches,
].flatMap((swatch) => {
  const preset = presetFrom(swatch.name, swatch.hex);
  return preset ? [preset] : [];
});

const fallbackSource = colorPresets[0]?.value ?? "#0e7484";
const fallbackColor = parseColor(fallbackSource) ?? {
  h: 187,
  s: 81,
  l: 29,
  a: 1,
  format: "hex" as const,
};

function draftFrom(source: string | undefined): Draft {
  const parsed = source ? parseColor(source) : null;
  if (parsed && source) return { source: source.trim(), color: parsed };
  return { source: fallbackSource, color: fallbackColor };
}

function colorKey(value: string) {
  const color = parseColor(value);
  if (!color) return "";
  const hue = Math.round(color.h) % 360;
  return `${hue}:${Math.round(color.s)}:${Math.round(color.l)}:${Math.round(color.a * 100)}`;
}

function isSettledColor(input: string) {
  const trimmed = input.trim();
  if (/^#(?:[\da-f]{6}|[\da-f]{8})$/i.test(trimmed)) return true;
  return /^(?:rgb|hsl)a?\(/i.test(trimmed) && parseColor(trimmed) !== null;
}

type EyeDropperWindow = Window & {
  EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
};

function useCanSampleScreen() {
  const [canSample, setCanSample] = React.useState(false);
  React.useEffect(() => {
    // Read this after mount so the server render matches the first client render.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only API
    setCanSample("EyeDropper" in window);
  }, []);
  return canSample;
}

function ColorArea({
  color,
  onChange,
  areaRef,
}: {
  color: ColorValue;
  onChange: (next: ColorValue) => void;
  areaRef: React.RefObject<HTMLDivElement | null>;
}) {
  const dragging = React.useRef(false);
  const helpId = React.useId();

  function pick(clientX: number, clientY: number) {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    onChange({
      ...color,
      s: clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
      l: clamp((1 - (clientY - rect.top) / rect.height) * 100, 0, 100),
    });
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    pick(event.clientX, event.clientY);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    pick(event.clientX, event.clientY);
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 10 : 1;
    const saturation = Math.round(color.s);
    const lightness = Math.round(color.l);
    const moves: Record<string, Partial<Pick<ColorValue, "s" | "l">> | undefined> = {
      ArrowLeft: { s: saturation - step },
      ArrowRight: { s: saturation + step },
      ArrowDown: { l: lightness - step },
      ArrowUp: { l: lightness + step },
      Home: { s: 0 },
      End: { s: 100 },
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    onChange({
      ...color,
      s: clamp(move.s ?? saturation, 0, 100),
      l: clamp(move.l ?? lightness, 0, 100),
    });
  }

  return (
    <>
      <div
        ref={areaRef}
        role="slider"
        tabIndex={0}
        aria-label="Saturation and lightness"
        aria-describedby={helpId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(color.s)}
        aria-valuetext={`${Math.round(color.s)}% saturation, ${Math.round(color.l)}% lightness`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="relative h-36 w-full cursor-crosshair touch-none rounded-xs border border-border outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
        style={{
          backgroundColor: "white",
          backgroundImage: `linear-gradient(to top, black, transparent 50%, white), linear-gradient(to right, hsl(${color.h} 0% 50%), hsl(${color.h} 100% 50%))`,
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
          style={{
            left: `${color.s}%`,
            top: `${100 - color.l}%`,
            boxShadow: "0 0 0 2px white, 0 0 0 3px rgb(0 0 0 / 0.55)",
          }}
        >
          <span className="absolute inset-0" style={checkerboard} />
          <span className="absolute inset-0" style={{ backgroundColor: colorCss(color) }} />
        </span>
      </div>
      <span id={helpId} className="sr-only">
        Left and right change saturation. Up and down change lightness.
      </span>
    </>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="relative size-4 shrink-0 overflow-hidden rounded-xs border border-border"
    >
      <span className="absolute inset-0" style={checkerboard} />
      <span className="absolute inset-0" style={{ backgroundColor: color }} />
    </span>
  );
}

export function ColorPicker({
  id,
  value,
  defaultValue,
  onValueChange,
  presets = colorPresets,
  placeholder = "Select a color",
  disabled = false,
  className,
  "aria-label": ariaLabel,
  ...aria
}: ColorPickerProps) {
  const control = useFieldControl({ id, ...aria });
  const field = useFieldContext();
  const valueId = React.useId();
  const hueLabelId = React.useId();
  const alphaLabelId = React.useId();
  const colorFieldId = React.useId();
  const presetsId = React.useId();
  const areaRef = React.useRef<HTMLDivElement>(null);
  const produced = React.useRef<string | undefined>(undefined);
  const canSample = useCanSampleScreen();
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<string | undefined>(() => {
    const initial = defaultValue?.trim();
    return initial && parseColor(initial) ? initial : undefined;
  });
  const raw = isControlled ? value : uncontrolled;
  const current = raw?.trim() && parseColor(raw) ? raw.trim() : undefined;
  const [tracked, setTracked] = React.useState(current);
  const [panel, setPanel] = React.useState(() => draftFrom(current));
  const [colorDraft, setColorDraft] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  if (current !== tracked) {
    setTracked(current);
    if (produced.current !== current) setPanel(draftFrom(current));
  }

  const choices = presets.flatMap((preset, index) => {
    const choice = presetFrom(preset.label, preset.value);
    return choice ? [{ ...choice, key: `${choice.label}-${choice.value}-${index}` }] : [];
  });
  const shown = colorDraft ?? current ?? "";

  function commit(next: string | undefined, color?: ColorValue) {
    const source = next?.trim();
    const parsed = source ? parseColor(source) : null;
    if (source && !parsed) return;
    const stored = parsed && source ? source : undefined;
    produced.current = stored;
    setPanel(parsed && stored ? { source: stored, color: color ?? parsed } : draftFrom(undefined));
    setColorDraft(null);
    if (stored === current) return;
    if (!isControlled) setUncontrolled(stored);
    onValueChange?.(stored ?? "");
  }

  function commitValue(next: ColorValue) {
    commit(formatColor(next), next);
  }

  async function sampleScreen() {
    const EyeDropperApi = (window as EyeDropperWindow).EyeDropper;
    if (!EyeDropperApi) return;
    try {
      const result = await new EyeDropperApi().open();
      const parsed = parseColor(result.sRGBHex);
      if (parsed) commit(result.sRGBHex.trim(), parsed);
    } catch {
      // Dismissing the sampler rejects the promise.
    }
  }

  return (
    <Popup
      open={open}
      onOpenChange={(next) => {
        if (disabled) return;
        setOpen(next);
      }}
    >
      <PopupTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            fieldClass,
            fieldSize.md,
            "flex items-center justify-between gap-2 text-left",
            className,
          )}
          {...control}
          aria-label={ariaLabel}
          aria-labelledby={!ariaLabel && field ? `${field.labelId} ${valueId}` : undefined}
        >
          <span className="flex min-w-0 items-center gap-2">
            {current ? (
              <Swatch color={colorCss(parseColor(current) ?? panel.color)} />
            ) : (
              <span
                aria-hidden
                className="size-4 shrink-0 rounded-xs border border-border bg-muted bg-[linear-gradient(135deg,transparent_45%,var(--border)_45%,var(--border)_55%,transparent_55%)]"
              />
            )}
            <span id={valueId} className={cn("truncate", current ? "text-text-2" : "text-text-3")}>
              {current ?? placeholder}
            </span>
          </span>
          <Pipette className="size-4 shrink-0 text-text-3" aria-hidden />
        </button>
      </PopupTrigger>
      <PopupContent
        className="w-[17.5rem]"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          requestAnimationFrame(() => areaRef.current?.focus());
        }}
      >
        <FieldContext.Provider value={null}>
          <div className="flex flex-col gap-2.5">
            <ColorArea color={panel.color} onChange={commitValue} areaRef={areaRef} />
            <div className="flex flex-col gap-1.5">
              <p id={hueLabelId} className="text-[13px] font-medium text-text-2">
                Hue
              </p>
              <ColorSlider
                channel="hue"
                aria-labelledby={hueLabelId}
                value={panel.source}
                onValueChange={(next) => commit(next)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <p id={alphaLabelId} className="text-[13px] font-medium text-text-2">
                Alpha
              </p>
              <ColorSlider
                channel="alpha"
                aria-labelledby={alphaLabelId}
                value={panel.source}
                onValueChange={(next) => commit(next)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={colorFieldId} className="text-[13px] font-medium text-text-2">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id={colorFieldId}
                  value={shown}
                  placeholder="#0e7484"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  onChange={(event) => {
                    const raw = event.target.value;
                    if (!isSettledColor(raw)) {
                      setColorDraft(raw);
                      return;
                    }
                    const parsed = parseColor(raw);
                    if (parsed) commit(formatColor(parsed), parsed);
                  }}
                  onBlur={(event) => {
                    const parsed = parseColor(event.currentTarget.value);
                    if (parsed) commit(formatColor(parsed), parsed);
                    else setColorDraft(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    event.currentTarget.blur();
                  }}
                  className={cn(fieldClass, fieldSize.sm, "min-w-0 flex-1 font-mono")}
                />
                {canSample ? (
                  <IconButton
                    icon={Pipette}
                    label="Pick from the screen"
                    className="shrink-0"
                    onClick={() => void sampleScreen()}
                  />
                ) : null}
              </div>
            </div>
            {choices.length > 0 ? (
              <div className="flex flex-col gap-2">
                <p id={presetsId} className="text-[13px] font-medium text-text-2">
                  Presets
                </p>
                <div role="group" aria-labelledby={presetsId} className="flex flex-wrap gap-2">
                  {choices.map((choice) => {
                    const selected =
                      current !== undefined && colorKey(current) === colorKey(choice.value);
                    return (
                      <button
                        key={choice.key}
                        type="button"
                        aria-label={choice.label}
                        aria-pressed={selected}
                        onClick={() => {
                          const parsed = parseColor(choice.value);
                          if (parsed) commit(choice.value, parsed);
                        }}
                        className={cn(
                          "size-7 rounded-xs border outline-none focus-visible:ring-4 focus-visible:ring-primary/25",
                          selected ? "border-primary ring-2 ring-primary" : "border-border",
                        )}
                        style={{ backgroundColor: choice.value }}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}
            {current ? (
              <div className="flex justify-end">
                <Button type="button" variant="text" size="xs" onClick={() => commit(undefined)}>
                  Clear
                </Button>
              </div>
            ) : null}
          </div>
        </FieldContext.Provider>
      </PopupContent>
    </Popup>
  );
}
