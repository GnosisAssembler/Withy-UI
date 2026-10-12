"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Minus, Plus, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import { useFieldControl } from "../../lib/field";
import { fieldSize } from "../../lib/styles";

export type NumberInputProps = {
  /** Current value. `null` is an empty field. */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Amount added or removed by one step. Defaults to 1. */
  step?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /**
   * How the value looks when the field is idle.
   * `true` groups thousands. An object is passed to `Intl.NumberFormat`.
   */
  format?: boolean | Intl.NumberFormatOptions;
  /** Locale used while formatting. Defaults to `en`. */
  locale?: string;
  fieldSize?: keyof typeof fieldSize;
  /** `end` stacks the stepper at the end, `sides` flanks the value, `none` hides it. */
  controls?: "end" | "sides" | "none";
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  autoFocus?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  id?: string;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

const separatorCache = new Map<string, { group: string; decimal: string }>();

function separators(locale: string) {
  const cached = separatorCache.get(locale);
  if (cached) return cached;
  const parts = new Intl.NumberFormat(locale).formatToParts(1000.1);
  const found = {
    group: parts.find((part) => part.type === "group")?.value ?? ",",
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
  };
  separatorCache.set(locale, found);
  return found;
}

function fractionDigits(step: number) {
  if (!Number.isFinite(step)) return 0;
  const text = step.toString().toLowerCase();
  const exponent = /e-(\d+)$/.exec(text);
  if (exponent) return Number(exponent[1]);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

function normalizeStep(step: number | undefined) {
  if (step === undefined || !Number.isFinite(step) || step <= 0) return 1;
  return step;
}

function normalizeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

function roundToDigits(value: number, digits: number) {
  const safe = Math.min(20, Math.max(0, digits));
  return normalizeZero(Number(value.toFixed(safe)));
}

function canonical(value: number) {
  const next = normalizeZero(value);
  if (!Number.isFinite(next)) return "";
  const text = next.toString();
  if (!/[eE]/.test(text)) return text;
  return next.toFixed(20).replace(/\.?0+$/, "");
}

function clamp(value: number, min?: number, max?: number) {
  let next = value;
  if (min !== undefined && next < min) next = min;
  if (max !== undefined && next > max) next = max;
  return normalizeZero(next);
}

function nearlyInteger(value: number) {
  const nearest = Math.round(value);
  const scale = Math.max(1, Math.abs(nearest));
  return Math.abs(value - nearest) <= 1e-8 * scale;
}

/** Step along the grid that starts at `min`, or at 0 when `min` is unset. */
function addStep(
  current: number | null,
  direction: 1 | -1,
  multiplier: number,
  step: number,
  min?: number,
  max?: number,
) {
  const digits = fractionDigits(step);
  if (current === null) {
    const seed = direction > 0 ? (min ?? 0) : (max ?? 0);
    return clamp(roundToDigits(seed, digits), min, max);
  }
  const origin = min ?? 0;
  const quotient = (current - origin) / step;
  const steps = Math.max(1, Math.round(multiplier));
  const index = nearlyInteger(quotient)
    ? Math.round(quotient) + direction * steps
    : direction > 0
      ? Math.ceil(quotient - 1e-6) + (steps - 1)
      : Math.floor(quotient + 1e-6) - (steps - 1);
  return clamp(roundToDigits(origin + index * step, digits), min, max);
}

function decimalPlaces(text: string) {
  const normalized = text.endsWith(".") ? text.slice(0, -1) : text;
  const dot = normalized.indexOf(".");
  return dot === -1 ? 0 : normalized.length - dot - 1;
}

function parseLoose(text: string) {
  if (text === "" || text === "-" || text === "." || text === "-.") return null;
  const normalized = text.endsWith(".") ? text.slice(0, -1) : text;
  if (normalized === "" || normalized === "-") return null;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return normalizeZero(value);
}

function isPartial(text: string) {
  return text === "-" || text === "." || text === "-." || text.endsWith(".");
}

function sanitize(raw: string, locale: string) {
  const { group, decimal } = separators(locale);
  let text = raw.replace(/[\s\u00A0\u202F$€£¥₩%]/g, "");
  if (group && group !== decimal) text = text.split(group).join("");
  if (decimal !== ".") text = text.split(decimal).join(".");
  if (text === "" || /^-?\d*\.?\d*$/.test(text)) return text;
  return null;
}

function showDraft(text: string, decimal: string) {
  if (decimal === "." || !text.includes(".")) return text;
  return text.replace(".", decimal);
}

function formatNumber(
  value: number,
  format: boolean | Intl.NumberFormatOptions | undefined,
  locale: string,
) {
  if (!format) return canonical(value);
  const options: Intl.NumberFormatOptions =
    format === true ? { maximumFractionDigits: 20 } : format;
  return new Intl.NumberFormat(locale, options).format(normalizeZero(value));
}

function clampTyped(text: string, min?: number, max?: number) {
  const parsed = parseLoose(text);
  if (parsed === null) return null;
  return clamp(roundToDigits(parsed, decimalPlaces(text)), min, max);
}

function isInvalid(value: React.AriaAttributes["aria-invalid"]) {
  return value === true || (typeof value === "string" && value !== "false");
}

const stepButtonClass =
  "inline-flex items-center justify-center text-text-3 outline-none transition-colors select-none hover:bg-[color-mix(in_srgb,var(--heading)_10%,var(--muted))] hover:text-heading active:bg-[color-mix(in_srgb,var(--heading)_16%,var(--muted))] disabled:pointer-events-none disabled:opacity-40";

const divider = "border-text-4 group-data-[invalid=true]:border-danger";

function StepperButton({
  label,
  icon: Icon,
  iconClassName,
  className,
  disabled,
  inputId,
  onPointerDown,
  onPointerUp,
  onClick,
}: {
  label: "Increase" | "Decrease";
  icon: LucideIcon;
  iconClassName: string;
  className?: string;
  disabled?: boolean;
  inputId: string;
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: () => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      aria-controls={inputId}
      disabled={disabled}
      className={cn(stepButtonClass, className)}
      onMouseDown={(event) => event.preventDefault()}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      <Icon className={iconClassName} aria-hidden />
    </button>
  );
}

export function NumberInput({
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step,
  prefix,
  suffix,
  format,
  locale = "en",
  fieldSize: size = "md",
  controls = "end",
  placeholder,
  disabled = false,
  readOnly = false,
  required,
  name,
  autoFocus,
  inputMode,
  id,
  className,
  ref,
  onBlur,
  onFocus,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: NumberInputProps) {
  const generatedId = React.useId();
  const control = useFieldControl({
    id,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
  });
  const inputId = control.id ?? generatedId;
  const invalid = isInvalid(control["aria-invalid"]);
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<number | null>(defaultValue ?? null);
  const [draft, setDraft] = React.useState<string | null>(null);
  const [focused, setFocused] = React.useState(false);
  const current = controlled ? (value ?? null) : uncontrolled;
  const safeStep = normalizeStep(step);
  const decimal = separators(locale).decimal;
  const shown =
    draft !== null
      ? showDraft(draft, decimal)
      : current === null
        ? ""
        : focused
          ? showDraft(canonical(current), decimal)
          : formatNumber(current, format, locale);
  const pending = draft !== null ? parseLoose(draft) : current;
  const atMin = min !== undefined && pending !== null && pending <= min;
  const atMax = max !== undefined && pending !== null && pending >= max;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const hiddenRef = React.useRef<HTMLInputElement>(null);
  const currentRef = React.useRef(current);
  const draftRef = React.useRef(draft);
  const focusedRef = React.useRef(focused);
  const shownRef = React.useRef(shown);
  const anchorRef = React.useRef<number | null>(current);
  const selectOnFocus = React.useRef(true);
  const selectFrame = React.useRef<number | null>(null);
  const fromPointer = React.useRef(false);
  const hold = React.useRef<{ timeout?: number; interval?: number }>({});
  const stopHold = React.useRef<() => void>(() => {});
  const stepRef = React.useRef<(direction: 1 | -1, multiplier: number) => void>(() => {});

  React.useEffect(() => {
    const stop = () => {
      window.clearTimeout(hold.current.timeout);
      window.clearInterval(hold.current.interval);
      hold.current.timeout = undefined;
      hold.current.interval = undefined;
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
    stopHold.current = stop;
    return stop;
  }, []);

  function assignInput(node: HTMLInputElement | null) {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }

  function publish(next: number | null) {
    if (hiddenRef.current) hiddenRef.current.value = next === null ? "" : String(next);
    if (Object.is(next, currentRef.current)) return;
    currentRef.current = next;
    if (!controlled) setUncontrolled(next);
    onValueChange?.(next);
  }

  function present(next: number | null) {
    if (!focusedRef.current) {
      draftRef.current = null;
      setDraft(null);
      return;
    }
    const text = next === null ? "" : canonical(next);
    draftRef.current = text;
    setDraft(text);
  }

  function stepBy(direction: 1 | -1, multiplier: number) {
    if (disabled || readOnly) return;
    const base = draftRef.current !== null ? parseLoose(draftRef.current) : currentRef.current;
    if (base !== null && max !== undefined && base > max) {
      if (direction < 0) {
        present(max);
        publish(max);
      }
      return;
    }
    if (base !== null && min !== undefined && base < min) {
      if (direction > 0) {
        present(min);
        publish(min);
      }
      return;
    }
    const next = addStep(base, direction, multiplier, safeStep, min, max);
    if (Object.is(next, base)) stopHold.current();
    present(next);
    publish(next);
  }

  React.useLayoutEffect(() => {
    currentRef.current = current;
    draftRef.current = draft;
    focusedRef.current = focused;
    shownRef.current = shown;
    stepRef.current = stepBy;
  });

  React.useEffect(() => {
    const node = inputRef.current;
    if (!node || disabled || readOnly) return;
    const onWheel = (event: WheelEvent) => {
      if (document.activeElement !== node || event.deltaY === 0) return;
      event.preventDefault();
      stepRef.current(event.deltaY < 0 ? 1 : -1, event.shiftKey ? 10 : 1);
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [disabled, readOnly]);

  function cancelPendingSelect() {
    if (selectFrame.current === null) return;
    cancelAnimationFrame(selectFrame.current);
    selectFrame.current = null;
  }

  function focusInput(select: boolean) {
    const node = inputRef.current;
    if (!node || disabled || document.activeElement === node) return;
    selectOnFocus.current = select;
    node.focus();
  }

  function focusFromChrome(event: React.PointerEvent) {
    event.preventDefault();
    focusInput(true);
  }

  function releaseStepper() {
    stopHold.current();
    focusInput(false);
  }

  function startHold(direction: 1 | -1) {
    fromPointer.current = true;
    if (document.activeElement !== inputRef.current) focusInput(false);
    stopHold.current();
    stepRef.current(direction, 1);
    hold.current.timeout = window.setTimeout(() => {
      hold.current.interval = window.setInterval(() => stepRef.current(direction, 1), 70);
    }, 400);
    window.addEventListener("pointerup", stopHold.current);
    window.addEventListener("pointercancel", stopHold.current);
  }

  function pressFromClick(direction: 1 | -1) {
    if (fromPointer.current) {
      fromPointer.current = false;
      focusInput(false);
      return;
    }
    if (document.activeElement !== inputRef.current) focusInput(false);
    stepRef.current(direction, 1);
  }

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    const text = currentRef.current === null ? "" : canonical(currentRef.current);
    anchorRef.current = currentRef.current;
    draftRef.current = text;
    focusedRef.current = true;
    setDraft(text);
    setFocused(true);
    onFocus?.(event);
    if (selectOnFocus.current) {
      const node = event.currentTarget;
      cancelPendingSelect();
      // Wait until focus settles, but drop the selection if typing starts first.
      selectFrame.current = requestAnimationFrame(() => {
        selectFrame.current = null;
        if (node.isConnected) node.select();
      });
    }
    selectOnFocus.current = true;
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    cancelPendingSelect();
    stopHold.current();
    focusedRef.current = false;
    setFocused(false);
    const next = clampTyped(draftRef.current ?? "", min, max);
    draftRef.current = null;
    setDraft(null);
    publish(next);
    onBlur?.(event);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    cancelPendingSelect();
    const next = sanitize(event.target.value, locale);
    if (next === null) {
      event.target.value = shownRef.current;
      return;
    }
    draftRef.current = next;
    setDraft(next);
    if (isPartial(next)) return;
    publish(next === "" ? null : parseLoose(next));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    cancelPendingSelect();
    if (disabled || readOnly) return;
    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "PageUp" ||
      event.key === "PageDown"
    ) {
      event.preventDefault();
      const direction = event.key === "ArrowUp" || event.key === "PageUp" ? 1 : -1;
      const multiplier =
        event.shiftKey || event.key === "PageUp" || event.key === "PageDown" ? 10 : 1;
      stepBy(direction, multiplier);
      return;
    }
    if (event.key === "Home" && min !== undefined) {
      event.preventDefault();
      present(min);
      publish(min);
      return;
    }
    if (event.key === "End" && max !== undefined) {
      event.preventDefault();
      present(max);
      publish(max);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      const anchor = anchorRef.current;
      const text = anchor === null ? "" : canonical(anchor);
      draftRef.current = text;
      setDraft(text);
      publish(anchor);
      return;
    }
    if (event.key === "Enter") {
      const next = clampTyped(draftRef.current ?? "", min, max);
      present(next);
      publish(next);
    }
  }

  const resolvedInputMode =
    inputMode ??
    (min !== undefined && min >= 0 && fractionDigits(safeStep) === 0 ? "numeric" : "decimal");
  const decreaseDisabled = disabled || readOnly || atMin;
  const increaseDisabled = disabled || readOnly || atMax;

  return (
    <div
      className={cn(
        "group flex w-full min-w-0 flex-nowrap items-stretch overflow-hidden rounded-sm border bg-card text-sm text-text-2 transition-[border-color,box-shadow] duration-150",
        fieldSize[size],
        invalid
          ? "border-danger ring-4 ring-danger/20"
          : "border-text-4 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/25",
        disabled ? "cursor-not-allowed bg-muted opacity-70" : "cursor-text",
        className,
      )}
      data-invalid={invalid ? "true" : undefined}
    >
      {controls === "sides" ? (
        <StepperButton
          label="Decrease"
          icon={Minus}
          iconClassName="size-3.5"
          className={cn("w-9 shrink-0 border-r bg-muted", divider)}
          disabled={decreaseDisabled}
          inputId={inputId}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            startHold(-1);
          }}
          onPointerUp={() => releaseStepper()}
          onClick={() => pressFromClick(-1)}
        />
      ) : null}
      {prefix ? (
        <span
          className="flex shrink-0 items-center pl-2.5 text-[13px] whitespace-nowrap text-text-3 select-none"
          onPointerDown={focusFromChrome}
        >
          {prefix}
        </span>
      ) : null}
      <input
        {...control}
        ref={assignInput}
        id={inputId}
        className={cn(
          "h-full w-0 min-w-0 flex-1 bg-transparent font-rubik text-heading tabular-nums outline-none placeholder:text-text-3",
          controls === "sides" && "text-center",
          prefix ? "pl-1.5" : "pl-2.5",
          suffix || controls === "end" ? "pr-1.5" : "pr-2.5",
        )}
        type="text"
        inputMode={resolvedInputMode}
        role="spinbutton"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        autoFocus={autoFocus}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        value={shown}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={pending ?? undefined}
        aria-valuetext={
          format && pending !== null ? formatNumber(pending, format, locale) : undefined
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {suffix ? (
        <span
          className={cn(
            "flex shrink-0 items-center text-[13px] whitespace-nowrap text-text-3 select-none",
            controls === "none" ? "pr-2.5" : "pr-1.5",
          )}
          onPointerDown={focusFromChrome}
        >
          {suffix}
        </span>
      ) : null}
      {controls === "sides" ? (
        <StepperButton
          label="Increase"
          icon={Plus}
          iconClassName="size-3.5"
          className={cn("w-9 shrink-0 border-l bg-muted", divider)}
          disabled={increaseDisabled}
          inputId={inputId}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            startHold(1);
          }}
          onPointerUp={() => releaseStepper()}
          onClick={() => pressFromClick(1)}
        />
      ) : null}
      {controls === "end" ? (
        <div className={cn("flex w-7 shrink-0 flex-col border-l bg-muted", divider)}>
          <StepperButton
            label="Increase"
            icon={ChevronUp}
            iconClassName="size-3"
            className="min-h-0 flex-1"
            disabled={increaseDisabled}
            inputId={inputId}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              event.preventDefault();
              startHold(1);
            }}
            onPointerUp={() => releaseStepper()}
            onClick={() => pressFromClick(1)}
          />
          <StepperButton
            label="Decrease"
            icon={ChevronDown}
            iconClassName="size-3"
            className={cn("min-h-0 flex-1 border-t", divider)}
            disabled={decreaseDisabled}
            inputId={inputId}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              event.preventDefault();
              startHold(-1);
            }}
            onPointerUp={() => releaseStepper()}
            onClick={() => pressFromClick(-1)}
          />
        </div>
      ) : null}
      {name ? (
        <input
          ref={hiddenRef}
          type="hidden"
          name={name}
          value={current === null ? "" : String(current)}
          disabled={disabled}
        />
      ) : null}
    </div>
  );
}
