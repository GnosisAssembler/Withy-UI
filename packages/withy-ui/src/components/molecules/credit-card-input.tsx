"use client";

import * as React from "react";
import { CreditCard } from "lucide-react";
import { Input } from "../atoms/input";
import { Eyebrow } from "../atoms/eyebrow";
import { cn } from "../../lib/cn";
import { FormField } from "./form-field";
import {
  cardBrandLabel,
  cardCvcLength,
  cardNumberAdvanceLength,
  cardNumberGroups,
  caretFromDigitCount,
  cvcHint,
  detectCardBrand,
  emptyCreditCard,
  formatCardNumber,
  formatExpiry,
  normalizeCreditCard,
  type CardBrand,
  type CreditCardValue,
} from "./credit-card";

export type { CardBrand, CreditCardValue };
export { detectCardBrand };

export type CreditCardInputProps = {
  value?: CreditCardValue;
  defaultValue?: Partial<CreditCardValue>;
  onValueChange?: (value: CreditCardValue) => void;
  /** Called when the network changes. Not called on the first render. */
  onBrandChange?: (brand: CardBrand) => void;
  /** Shows the card that follows what was typed. Defaults to true. */
  preview?: boolean;
  errors?: Partial<Record<keyof CreditCardValue, string>>;
  /** Names for the submitted digits. The visible fields stay formatted. */
  names?: Partial<Record<keyof CreditCardValue, string>>;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  className?: string;
};

const fieldMarkClass: Record<CardBrand, string> = {
  visa: "text-visa",
  mastercard: "",
  amex: "text-amex",
  discover: "text-discover",
  diners: "text-diners",
  jcb: "text-jcb",
  unionpay: "text-unionpay",
  unknown: "text-text-3",
};

function cardBackground(brand: CardBrand) {
  if (brand === "mastercard") {
    return "linear-gradient(135deg, var(--gray-900), color-mix(in srgb, var(--mastercard) 42%, black))";
  }
  if (brand === "discover") {
    return "linear-gradient(135deg, var(--gray-900), color-mix(in srgb, var(--discover) 46%, black))";
  }
  const token =
    brand === "visa"
      ? "var(--visa)"
      : brand === "amex"
        ? "var(--amex)"
        : brand === "diners"
          ? "var(--diners)"
          : brand === "jcb"
            ? "var(--jcb)"
            : brand === "unionpay"
              ? "var(--unionpay)"
              : "var(--brand)";
  return `linear-gradient(135deg, color-mix(in srgb, ${token} 82%, black), color-mix(in srgb, ${token} 46%, black))`;
}

function MastercardMark({ className }: { className?: string }) {
  const clipId = React.useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 38 24" className={className} aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <circle cx="14" cy="12" r="8" />
        </clipPath>
      </defs>
      <circle cx="14" cy="12" r="8" fill="var(--mastercard)" />
      <circle cx="24" cy="12" r="8" fill="var(--mastercard-accent)" />
      <circle
        cx="24"
        cy="12"
        r="8"
        clipPath={`url(#${clipId})`}
        fill="color-mix(in srgb, var(--mastercard) 48%, var(--mastercard-accent))"
      />
    </svg>
  );
}

function BrandMark({ brand, surface }: { brand: CardBrand; surface: "card" | "field" }) {
  const onCard = surface === "card";

  if (brand === "mastercard") {
    return <MastercardMark className={onCard ? "h-7 w-11" : "h-5 w-8"} />;
  }

  if (brand === "unknown") {
    return (
      <CreditCard className={onCard ? "size-6 text-white" : "size-4 text-text-3"} aria-hidden />
    );
  }

  if (!onCard && brand === "discover") {
    return <span className="size-4 rounded-full bg-discover" aria-hidden />;
  }

  if (!onCard && brand === "diners") {
    return (
      <span className="inline-flex size-5 items-center justify-center rounded-full border border-diners text-[8px] font-semibold text-diners">
        DC
      </span>
    );
  }

  if (!onCard && brand === "unionpay") {
    return (
      <span className="inline-flex h-4 items-center rounded-xs bg-unionpay px-1 text-[8px] font-semibold tracking-wide text-white">
        UP
      </span>
    );
  }

  const word = {
    visa: "VISA",
    amex: "AMEX",
    discover: "DISCOVER",
    diners: "DINERS",
    jcb: "JCB",
    unionpay: "UnionPay",
  }[brand];

  return (
    <span
      className={cn(
        "inline-flex items-center font-rubik font-semibold tracking-wide",
        onCard ? "text-white" : fieldMarkClass[brand],
        brand === "visa" && "italic",
        onCard ? "text-lg" : "text-[11px]",
        onCard && (brand === "discover" || brand === "diners" || brand === "unionpay") && "text-sm",
        onCard &&
          brand === "amex" &&
          "rounded-xs border border-white/70 px-1.5 py-0.5 text-sm tracking-widest",
      )}
    >
      {word}
      {onCard && brand === "discover" ? (
        <span className="ml-1.5 size-3 rounded-full bg-discover" />
      ) : null}
    </span>
  );
}

function CardChip() {
  return (
    <div
      className="relative h-7 w-10 rounded-sm bg-[linear-gradient(135deg,color-mix(in_srgb,var(--orange)_70%,white),var(--warning))]"
      aria-hidden
    >
      <div className="absolute inset-x-1.5 top-1/2 h-px bg-[color-mix(in_srgb,black_28%,transparent)]" />
      <div className="absolute inset-y-1.5 left-1/2 w-px bg-[color-mix(in_srgb,black_28%,transparent)]" />
      <div className="absolute top-1/2 left-1/2 h-3.5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-xs border border-[color-mix(in_srgb,black_25%,transparent)]" />
    </div>
  );
}

function maskedGroups(number: string, groups: readonly number[]) {
  const slices: string[][] = [];
  let offset = 0;
  for (const size of groups) {
    const characters: string[] = [];
    for (let place = 0; place < size; place += 1) {
      characters.push(number[offset + place] ?? "•");
    }
    slices.push(characters);
    offset += size;
  }
  return slices;
}

function CardDigits({ number, brand }: { number: string; brand: CardBrand }) {
  const groups = cardNumberGroups(brand, number.length);
  const slices = maskedGroups(number, groups);
  return (
    <p
      className={cn(
        "flex gap-2 font-rubik leading-none tracking-wide tabular-nums",
        groups.length > 4 ? "text-[13px]" : "text-base",
      )}
    >
      {slices.map((characters, groupIndex) => (
        <span key={groupIndex}>
          {characters.map((character, place) => (
            <span key={place} className={character === "•" ? "opacity-45" : undefined}>
              {character}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}

function CardFace({
  card,
  brand,
  cvcFocused,
  side,
}: {
  card: CreditCardValue;
  brand: CardBrand;
  cvcFocused: boolean;
  side: "front" | "back";
}) {
  const background = cardBackground(brand);
  return (
    <div
      data-side={side}
      className={cn(
        "absolute inset-0 overflow-hidden rounded-lg text-white shadow-elevation [backface-visibility:hidden]",
        side === "back" && "[transform:rotateY(180deg)]",
      )}
      style={{ background }}
    >
      <div className="pointer-events-none absolute -top-12 -right-10 size-40 rounded-full bg-[color-mix(in_srgb,white_14%,transparent)]" />
      <div className="pointer-events-none absolute -bottom-16 -left-8 size-36 rounded-full bg-[color-mix(in_srgb,black_18%,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_38%,color-mix(in_srgb,white_16%,transparent)_50%,transparent_62%)]" />
      {side === "front" ? (
        <div className="relative flex h-full flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-2">
            <CardChip />
            <div className="flex flex-col items-end gap-1">
              <BrandMark brand={brand} surface="card" />
              {brand === "amex" ? (
                <span
                  className={cn(
                    "font-rubik text-[13px] tracking-[0.2em]",
                    cvcFocused && "rounded-xs px-1 ring-2 ring-white/80",
                  )}
                >
                  {(card.cvc || "").padEnd(4, "•")}
                </span>
              ) : null}
            </div>
          </div>
          <CardDigits number={card.number} brand={brand} />
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <Eyebrow as="span" className="text-white opacity-70">
                Name
              </Eyebrow>
              <p
                className={cn(
                  "truncate text-[13px] font-medium tracking-wide uppercase",
                  card.name.trim() ? undefined : "opacity-50",
                )}
              >
                {card.name.trim() || "Your name"}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <Eyebrow as="span" className="text-white opacity-70">
                Expires
              </Eyebrow>
              <p
                className={cn(
                  "font-rubik text-[13px] tracking-wide",
                  card.expiry ? undefined : "opacity-50",
                )}
              >
                {card.expiry ? formatExpiry(card.expiry) : "MM/YY"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex h-full flex-col">
          <div className="mt-5 h-10 bg-[color-mix(in_srgb,black_80%,var(--gray-900))]" />
          <div className="mx-4 mt-4 flex items-center gap-2">
            <div className="h-8 flex-1 rounded-xs bg-[color-mix(in_srgb,white_92%,var(--gray-300))]" />
            <div className="flex h-8 min-w-14 items-center justify-center rounded-xs bg-[color-mix(in_srgb,white_92%,var(--gray-300))] px-2">
              <span className="font-rubik text-sm tracking-[0.18em] text-gray-900">
                {card.cvc || "•••"}
              </span>
            </div>
          </div>
          <div className="mt-auto flex justify-end p-4">
            <BrandMark brand={brand} surface="card" />
          </div>
        </div>
      )}
    </div>
  );
}

function CardPreview({
  card,
  brand,
  cvcFocused,
}: {
  card: CreditCardValue;
  brand: CardBrand;
  cvcFocused: boolean;
}) {
  const flipped = cvcFocused && brand !== "amex";
  return (
    <div className="[perspective:1000px]" aria-hidden>
      <div
        data-brand={brand}
        data-side={flipped ? "back" : "front"}
        className={cn(
          "relative aspect-[86/54] w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] motion-reduce:transition-none",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        <CardFace card={card} brand={brand} cvcFocused={cvcFocused} side="front" />
        <CardFace card={card} brand={brand} cvcFocused={cvcFocused} side="back" />
      </div>
    </div>
  );
}

type CaretField = "number" | "expiry" | "cvc";

export function CreditCardInput({
  value,
  defaultValue,
  onValueChange,
  onBrandChange,
  preview = true,
  errors,
  names,
  disabled,
  readOnly,
  required,
  className,
}: CreditCardInputProps) {
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    normalizeCreditCard({ ...emptyCreditCard, ...defaultValue }),
  );
  const source = value ?? uncontrolled;
  const card = React.useMemo(
    () =>
      normalizeCreditCard({
        number: source.number,
        name: source.name,
        expiry: source.expiry,
        cvc: source.cvc,
      }),
    [source.number, source.name, source.expiry, source.cvc],
  );
  const brand = detectCardBrand(card.number);
  const [cvcFocused, setCvcFocused] = React.useState(false);
  const baseId = React.useId();
  const numberRef = React.useRef<HTMLInputElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const expiryRef = React.useRef<HTMLInputElement>(null);
  const cvcRef = React.useRef<HTMLInputElement>(null);
  const caretRef = React.useRef<{ field: CaretField; digits: number } | null>(null);
  const focusRef = React.useRef<"name" | "cvc" | null>(null);
  const seenBrand = React.useRef(brand);

  React.useEffect(() => {
    if (seenBrand.current === brand) return;
    seenBrand.current = brand;
    onBrandChange?.(brand);
  }, [brand, onBrandChange]);

  React.useLayoutEffect(() => {
    const pending = caretRef.current;
    caretRef.current = null;
    const fieldRefs = { number: numberRef, expiry: expiryRef, cvc: cvcRef };
    if (pending) {
      const input = fieldRefs[pending.field].current;
      if (input && document.activeElement === input) {
        const position = caretFromDigitCount(input.value, pending.digits);
        input.setSelectionRange(position, position);
      }
    }
    const nextFocus = focusRef.current;
    focusRef.current = null;
    if (nextFocus === "name") nameRef.current?.focus();
    if (nextFocus === "cvc") cvcRef.current?.focus();
  }, [card]);

  function commit(partial: Partial<CreditCardValue>) {
    const next = normalizeCreditCard({ ...card, ...partial });
    if (
      next.number === card.number &&
      next.name === card.name &&
      next.expiry === card.expiry &&
      next.cvc === card.cvc
    ) {
      return card;
    }
    if (value === undefined) setUncontrolled(next);
    onValueChange?.(next);
    return next;
  }

  function onNumberKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Backspace") return;
    const input = event.currentTarget;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    if (start !== end || input.value[start - 1] !== " ") return;
    event.preventDefault();
    const digitsBefore = input.value.slice(0, start).replace(/\D/g, "").length;
    const removeAt = digitsBefore - 1;
    if (removeAt < 0) return;
    const next = commit({
      number: card.number.slice(0, removeAt) + card.number.slice(removeAt + 1),
    });
    if (next === card) return;
    caretRef.current = { field: "number", digits: removeAt };
  }

  function onNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const selection = input.selectionStart ?? input.value.length;
    const digitsBefore = input.value.slice(0, selection).replace(/\D/g, "").length;
    const previousLength = card.number.length;
    const next = commit({ number: input.value });
    if (next === card) return;
    caretRef.current = { field: "number", digits: Math.min(digitsBefore, next.number.length) };
    const nextBrand = detectCardBrand(next.number);
    const advance = cardNumberAdvanceLength(nextBrand);
    if (advance !== null && previousLength < advance && next.number.length === advance) {
      focusRef.current = "name";
    }
  }

  function onExpiryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const selection = input.selectionStart ?? input.value.length;
    const digitsBefore = input.value.slice(0, selection).replace(/\D/g, "").length;
    const previousLength = card.expiry.length;
    const next = commit({ expiry: input.value });
    if (next === card) return;
    const atEnd = selection >= input.value.length;
    caretRef.current = {
      field: "expiry",
      digits: atEnd ? next.expiry.length : Math.min(digitsBefore, next.expiry.length),
    };
    if (previousLength < 4 && next.expiry.length === 4) focusRef.current = "cvc";
  }

  function onCvcChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const selection = input.selectionStart ?? input.value.length;
    const digitsBefore = input.value.slice(0, selection).replace(/\D/g, "").length;
    const next = commit({ cvc: input.value });
    if (next === card) return;
    caretRef.current = { field: "cvc", digits: Math.min(digitsBefore, next.cvc.length) };
  }

  const shared = { disabled, readOnly, required };
  const numberHint =
    brand === "unknown" ? "Enter the number on the front of the card." : cardBrandLabel[brand];

  return (
    <fieldset
      data-brand={brand}
      className={cn("flex w-full max-w-sm min-w-0 flex-col gap-4 border-0 p-0", className)}
    >
      <legend className="sr-only">Payment card</legend>
      <p className="sr-only" role="status">
        {brand === "unknown" ? "" : cardBrandLabel[brand]}
      </p>
      {preview ? <CardPreview card={card} brand={brand} cvcFocused={cvcFocused} /> : null}
      {names?.number ? <input type="hidden" name={names.number} value={card.number} /> : null}
      {names?.name ? <input type="hidden" name={names.name} value={card.name} /> : null}
      {names?.expiry ? <input type="hidden" name={names.expiry} value={card.expiry} /> : null}
      {names?.cvc ? <input type="hidden" name={names.cvc} value={card.cvc} /> : null}
      <FormField
        label="Card number"
        htmlFor={`${baseId}-number`}
        hint={numberHint}
        error={errors?.number}
      >
        <div className="relative">
          <Input
            ref={numberRef}
            id={`${baseId}-number`}
            inputMode="numeric"
            autoComplete="cc-number"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="pr-12 font-rubik tracking-wide tabular-nums"
            value={formatCardNumber(card.number, brand)}
            onChange={onNumberChange}
            onKeyDown={onNumberKeyDown}
            {...shared}
          />
          <span className="pointer-events-none absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center">
            <BrandMark brand={brand} surface="field" />
          </span>
        </div>
      </FormField>
      <FormField label="Name on card" htmlFor={`${baseId}-name`} error={errors?.name}>
        <Input
          ref={nameRef}
          id={`${baseId}-name`}
          autoComplete="cc-name"
          value={card.name}
          onChange={(event) => commit({ name: event.target.value })}
          {...shared}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Expiry" htmlFor={`${baseId}-expiry`} error={errors?.expiry}>
          <Input
            ref={expiryRef}
            id={`${baseId}-expiry`}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            spellCheck={false}
            className="font-rubik tracking-wide tabular-nums"
            value={formatExpiry(card.expiry)}
            onChange={onExpiryChange}
            {...shared}
          />
        </FormField>
        <FormField
          label="Security code"
          htmlFor={`${baseId}-cvc`}
          hint={cvcHint(brand)}
          error={errors?.cvc}
        >
          <Input
            ref={cvcRef}
            id={`${baseId}-cvc`}
            inputMode="numeric"
            autoComplete="cc-csc"
            spellCheck={false}
            className="font-rubik tracking-wide tabular-nums"
            value={card.cvc}
            onChange={onCvcChange}
            onFocus={() => setCvcFocused(true)}
            onBlur={() => setCvcFocused(false)}
            maxLength={cardCvcLength(brand)}
            {...shared}
          />
        </FormField>
      </div>
    </fieldset>
  );
}
