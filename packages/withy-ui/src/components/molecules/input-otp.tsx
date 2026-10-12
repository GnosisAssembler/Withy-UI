"use client";

import * as React from "react";
import { cn } from "../../lib/cn";
import { useFieldControl } from "../../lib/field";
import { fieldSize } from "../../lib/styles";

export type InputOtpProps = {
  /** Current code. An empty string is an empty field. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called when a typed or pasted code fills every slot. */
  onComplete?: (value: string) => void;
  /**
   * How many characters the code has.
   * Integers from 1 to 12. Anything else uses 6.
   */
  length?: number;
  /**
   * Split the slots into groups, such as `[3, 3]`.
   * The sizes must be positive integers that add up to `length`.
   */
  groups?: readonly number[];
  /** Shown between groups. `null` leaves only the gap. */
  separator?: React.ReactNode;
  /** `numeric` allows digits. `alphanumeric` allows letters and digits. */
  pattern?: "numeric" | "alphanumeric";
  /** Hide each character behind a dot. The field value stays readable to assistive tech. */
  mask?: boolean;
  /** Character shown in an empty slot. Defaults to none. */
  placeholder?: string;
  fieldSize?: keyof typeof fieldSize;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  autoFocus?: boolean;
  autoComplete?: string;
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

const slotSize = {
  sm: "h-[34px] w-[34px] text-[13px]",
  md: "h-[38px] w-[38px] text-sm",
} as const;

function normalizeLength(length: number | undefined) {
  if (typeof length !== "number" || !Number.isInteger(length) || length < 1 || length > 12) {
    return 6;
  }
  return length;
}

function normalizeGroups(length: number, groups: readonly number[] | undefined) {
  if (!groups || groups.length === 0) return [length];
  if (groups.some((size) => !Number.isInteger(size) || size < 1)) return [length];
  if (groups.reduce((total, size) => total + size, 0) !== length) return [length];
  return groups;
}

function indexesByGroup(groups: readonly number[]) {
  const grouped: number[][] = [];
  let cursor = 0;
  for (const size of groups) {
    const indexes: number[] = [];
    for (let step = 0; step < size; step += 1) {
      indexes.push(cursor);
      cursor += 1;
    }
    grouped.push(indexes);
  }
  return grouped;
}

function sanitize(raw: string, pattern: "numeric" | "alphanumeric") {
  const source = pattern === "alphanumeric" ? raw.toUpperCase() : raw;
  const matches = source.match(pattern === "numeric" ? /\d/g : /[A-Z0-9]/g);
  return matches?.join("") ?? "";
}

function isInvalid(value: React.AriaAttributes["aria-invalid"]) {
  return value === true || (typeof value === "string" && value !== "false");
}

/** Replace the character under the caret, or write a paste across the following slots. */
function write(current: string, text: string, start: number, end: number, max: number) {
  if (start !== end) {
    const merged = (current.slice(0, start) + text + current.slice(end)).slice(0, max);
    return { value: merged, caret: Math.min(start + text.length, merged.length) };
  }
  if (text.length === 1 && start < current.length) {
    const chars = current.split("");
    chars[start] = text;
    return { value: chars.join("").slice(0, max), caret: Math.min(start + 1, max) };
  }
  const chars = current.split("");
  for (let offset = 0; offset < text.length && start + offset < max; offset += 1) {
    chars[start + offset] = text[offset] ?? "";
  }
  const value = chars.join("").slice(0, max);
  return { value, caret: Math.min(start + text.length, value.length) };
}

function slotIndexAt(root: HTMLElement, x: number, y: number) {
  const slots = [...root.querySelectorAll<HTMLElement>("[data-otp-index]")];
  let nearest = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const slot of slots) {
    const rect = slot.getBoundingClientRect();
    const index = Number(slot.dataset.otpIndex);
    const hit =
      rect.width > 0 && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    if (hit) return index;
    const dx = x - (rect.left + rect.width / 2);
    const dy = y - (rect.top + rect.height / 2);
    const distance = dx * dx + dy * dy;
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = Number.isNaN(index) ? nearest : index;
    }
  }
  return nearest;
}

export function InputOtp({
  value,
  defaultValue,
  onValueChange,
  onComplete,
  length: lengthProp,
  groups: groupsProp,
  separator,
  pattern = "numeric",
  mask = false,
  placeholder,
  fieldSize: size = "md",
  disabled = false,
  readOnly = false,
  required,
  name,
  autoFocus,
  autoComplete = "one-time-code",
  id,
  className,
  ref,
  onBlur,
  onFocus,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: InputOtpProps) {
  const control = useFieldControl({
    id,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
  });
  const length = normalizeLength(lengthProp);
  const groups = normalizeGroups(length, groupsProp);
  const invalid = isInvalid(control["aria-invalid"]);
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    sanitize(defaultValue ?? "", pattern).slice(0, length),
  );
  const current = sanitize(controlled ? (value ?? "") : uncontrolled, pattern).slice(0, length);
  const [focused, setFocused] = React.useState(false);
  const [caret, setCaret] = React.useState(0);
  const hintChar = placeholder ? ([...placeholder][0] ?? "") : "";
  const activeCaret = Math.min(caret, current.length);
  const activeIndex = focused ? Math.min(activeCaret, length - 1) : -1;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const currentRef = React.useRef(current);
  const caretRef = React.useRef(activeCaret);
  const restoreCaret = React.useRef(false);
  const pointerCaret = React.useRef<number | null>(null);

  React.useLayoutEffect(() => {
    currentRef.current = current;
  });

  React.useLayoutEffect(() => {
    const node = inputRef.current;
    if (!node || !restoreCaret.current) return;
    restoreCaret.current = false;
    const pos = Math.min(caretRef.current, node.value.length);
    node.setSelectionRange(pos, pos);
  });

  function assignInput(node: HTMLInputElement | null) {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }

  function commit(next: string, nextCaret: number) {
    const prev = currentRef.current;
    const pos = Math.min(nextCaret, next.length);
    caretRef.current = pos;
    restoreCaret.current = true;
    setCaret(pos);
    if (next === prev) return;
    currentRef.current = next;
    if (!controlled) setUncontrolled(next);
    onValueChange?.(next);
    if (next.length === length) onComplete?.(next);
  }

  function placeCaret(node: HTMLInputElement, pos: number) {
    const next = Math.min(Math.max(0, pos), node.value.length);
    caretRef.current = next;
    node.setSelectionRange(next, next);
    setCaret(next);
  }

  function caretFromPointer(event: React.PointerEvent<HTMLInputElement>) {
    const root = rootRef.current;
    if (!root) return event.currentTarget.value.length;
    return Math.min(
      slotIndexAt(root, event.clientX, event.clientY),
      event.currentTarget.value.length,
    );
  }

  function handlePointerDown(event: React.PointerEvent<HTMLInputElement>) {
    if (disabled || event.button !== 0) return;
    pointerCaret.current = caretFromPointer(event);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLInputElement>) {
    if (disabled || event.button !== 0) return;
    const pos = pointerCaret.current ?? caretFromPointer(event);
    pointerCaret.current = pos;
    placeCaret(event.currentTarget, pos);
    requestAnimationFrame(() => {
      const node = inputRef.current;
      // Typing before this frame wins. The click only places the caret when it is still pending.
      if (!node || document.activeElement !== node || pointerCaret.current !== pos) return;
      placeCaret(node, Math.min(pos, node.value.length));
      pointerCaret.current = null;
    });
  }

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    setFocused(true);
    // A click sets the slot on pointerup. Keyboard focus lands at the end.
    if (pointerCaret.current == null) {
      placeCaret(event.currentTarget, event.currentTarget.value.length);
    }
    onFocus?.(event);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    setFocused(false);
    onBlur?.(event);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    pointerCaret.current = null;
    if (disabled || readOnly || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.length !== 1) return;
    const text = sanitize(event.key, pattern);
    if (!text) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    const start = event.currentTarget.selectionStart ?? currentRef.current.length;
    const end = event.currentTarget.selectionEnd ?? start;
    const next = write(currentRef.current, text, start, end, length);
    commit(next.value, next.caret);
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    pointerCaret.current = null;
    if (disabled || readOnly) return;
    event.preventDefault();
    const text = sanitize(event.clipboardData.getData("text"), pattern);
    if (!text) return;
    if (text.length >= length) {
      commit(text.slice(0, length), Math.min(length, text.length));
      return;
    }
    const start = event.currentTarget.selectionStart ?? currentRef.current.length;
    const end = event.currentTarget.selectionEnd ?? start;
    const next = write(currentRef.current, text, start, end, length);
    commit(next.value, next.caret);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    pointerCaret.current = null;
    const next = sanitize(event.target.value, pattern).slice(0, length);
    const previous = currentRef.current;
    const pos = event.target.selectionStart;
    // Autofill and some pastes arrive as one change. Land at the end of that code.
    const jumped = next.length > previous.length + 1;
    const nextCaret = pos == null || jumped ? next.length : Math.min(pos, next.length);
    if (next === previous) {
      caretRef.current = nextCaret;
      setCaret(nextCaret);
      return;
    }
    commit(next, nextCaret);
  }

  function syncCaret(node: HTMLInputElement) {
    const pos = node.selectionStart ?? node.value.length;
    caretRef.current = pos;
    setCaret(pos);
  }

  const htmlPattern = pattern === "numeric" ? `[0-9]{${length}}` : `[A-Za-z0-9]{${length}}`;
  const groupedSlots = indexesByGroup(groups);

  return (
    <div
      ref={rootRef}
      className={cn("relative inline-flex max-w-full flex-wrap items-center gap-2.5", className)}
      data-invalid={invalid ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
    >
      {groupedSlots.map((indexes, groupIndex) => (
        <div
          key={indexes[0] ?? groupIndex}
          className="inline-flex max-w-full min-w-0 flex-wrap items-center gap-2"
        >
          {groupIndex > 0 && separator !== null ? (
            <span
              aria-hidden
              data-otp-separator=""
              className="inline-flex shrink-0 items-center text-[13px] text-text-3 select-none"
            >
              {separator ?? <span className="block h-px w-2 bg-text-3" />}
            </span>
          ) : null}
          {indexes.map((index) => {
            const char = current[index] ?? "";
            const active = index === activeIndex;
            const showCaret = active && char === "";
            const glyph = char ? (mask ? "•" : char) : showCaret ? "" : hintChar;
            return (
              <span
                key={index}
                aria-hidden
                data-otp-index={index}
                data-active={active ? "true" : undefined}
                className={cn(
                  "relative inline-flex shrink-0 items-center justify-center rounded-sm border bg-card font-rubik leading-none font-medium tabular-nums transition-[border-color,box-shadow] duration-150 select-none",
                  slotSize[size],
                  char ? "text-heading" : "text-text-3",
                  invalid ? "border-danger" : "border-text-4",
                  active && !invalid && "border-primary ring-4 ring-primary/25",
                  active && invalid && "ring-4 ring-danger/20",
                  disabled && "cursor-not-allowed bg-muted opacity-70",
                )}
              >
                {glyph}
                {showCaret ? (
                  <span
                    aria-hidden
                    className="withy-otp-caret pointer-events-none absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-heading"
                  />
                ) : null}
              </span>
            );
          })}
        </div>
      ))}
      <input
        {...control}
        ref={assignInput}
        className="withy-otp-input absolute inset-0 z-10 size-full cursor-text border-0 bg-transparent p-0 text-base text-transparent caret-transparent outline-none selection:bg-transparent disabled:cursor-not-allowed"
        type="text"
        inputMode={pattern === "numeric" ? "numeric" : "text"}
        autoComplete={autoComplete}
        autoCapitalize={pattern === "alphanumeric" ? "characters" : "off"}
        autoCorrect="off"
        spellCheck={false}
        translate="no"
        pattern={htmlPattern}
        maxLength={length}
        autoFocus={autoFocus}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        name={name}
        value={current}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerCaret.current = null;
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={(event) => {
          if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "Home" ||
            event.key === "End"
          ) {
            syncCaret(event.currentTarget);
          }
        }}
        onSelect={(event) => {
          if (pointerCaret.current != null) return;
          syncCaret(event.currentTarget);
        }}
        onPaste={handlePaste}
        onChange={handleChange}
      />
    </div>
  );
}
