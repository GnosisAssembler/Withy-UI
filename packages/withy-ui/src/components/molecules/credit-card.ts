export const cardBrands = [
  "visa",
  "mastercard",
  "amex",
  "discover",
  "diners",
  "jcb",
  "unionpay",
] as const;

export type CardBrand = (typeof cardBrands)[number] | "unknown";

export type CreditCardValue = {
  /** Digits only. */
  number: string;
  name: string;
  /** Month and year digits, `MMYY`. */
  expiry: string;
  /** Digits only. */
  cvc: string;
};

export const emptyCreditCard: CreditCardValue = {
  number: "",
  name: "",
  expiry: "",
  cvc: "",
};

export const cardBrandLabel: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  diners: "Diners Club",
  jcb: "JCB",
  unionpay: "UnionPay",
  unknown: "Card",
};

const brandPatterns: { brand: Exclude<CardBrand, "unknown">; pattern: RegExp }[] = [
  { brand: "visa", pattern: /^4/ },
  { brand: "amex", pattern: /^3[47]/ },
  { brand: "diners", pattern: /^3(?:0[0-5]|[68])/ },
  { brand: "mastercard", pattern: /^(?:5[1-5]|2(?:22[1-9]|2[3-9]\d|[3-6]\d{2}|7(?:[01]\d|20)))/ },
  { brand: "jcb", pattern: /^35(?:2[89]|[3-8]\d)/ },
  { brand: "discover", pattern: /^6(?:011|5|4[4-9])/ },
  { brand: "unionpay", pattern: /^62/ },
];

/** Network that issued the card, from the digits typed so far. */
export function detectCardBrand(input: string): CardBrand {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "unknown";
  return brandPatterns.find((entry) => entry.pattern.test(digits))?.brand ?? "unknown";
}

export function cardNumberMaxLength(brand: CardBrand) {
  switch (brand) {
    case "amex":
      return 15;
    case "diners":
      return 14;
    case "mastercard":
    case "jcb":
      return 16;
    default:
      return 19;
  }
}

/** Length at which typing can move to the next field. Variable-length networks stay put. */
export function cardNumberAdvanceLength(brand: CardBrand) {
  switch (brand) {
    case "amex":
      return 15;
    case "diners":
      return 14;
    case "mastercard":
    case "jcb":
      return 16;
    default:
      return null;
  }
}

export function cardCvcLength(brand: CardBrand) {
  if (brand === "amex" || brand === "unknown") return 4;
  return 3;
}

export function cardNumberGroups(brand: CardBrand, length = 0) {
  if (brand === "amex") return [4, 6, 5];
  if (brand === "diners") return [4, 6, 4];
  if (length > 16) return [4, 4, 4, 4, 3];
  return [4, 4, 4, 4];
}

export function formatCardNumber(digits: string, brand: CardBrand = detectCardBrand(digits)) {
  const groups = cardNumberGroups(brand, digits.length);
  const parts: string[] = [];
  let index = 0;
  for (const size of groups) {
    if (index >= digits.length) break;
    parts.push(digits.slice(index, index + size));
    index += size;
  }
  if (index < digits.length) parts.push(digits.slice(index));
  return parts.join(" ");
}

export function formatExpiry(digits: string) {
  const clean = digits.slice(0, 4);
  if (clean.length <= 2) return clean;
  return `${clean.slice(0, 2)}/${clean.slice(2)}`;
}

export function normalizeExpiry(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.length >= 1 && digits[0]! > "1") digits = `0${digits}`;
  if (digits.length >= 2) {
    const month = Number(digits.slice(0, 2));
    if (month === 0) digits = `01${digits.slice(2)}`;
    else if (month > 12) digits = `${digits[0]}${digits.slice(2)}`;
  }
  return digits.slice(0, 4);
}

export function sanitizeCardName(value: string) {
  return value.replace(/[^\p{L}\p{M} .'-]/gu, "").slice(0, 26);
}

export function normalizeCreditCard(value: CreditCardValue): CreditCardValue {
  const number = value.number.replace(/\D/g, "");
  const brand = detectCardBrand(number);
  return {
    number: number.slice(0, cardNumberMaxLength(brand)),
    name: sanitizeCardName(value.name),
    expiry: normalizeExpiry(value.expiry),
    cvc: value.cvc.replace(/\D/g, "").slice(0, cardCvcLength(brand)),
  };
}

export function caretFromDigitCount(formatted: string, digitCount: number) {
  if (digitCount <= 0) return 0;
  let seen = 0;
  for (let index = 0; index < formatted.length; index += 1) {
    if (/\d/.test(formatted[index] ?? "")) seen += 1;
    if (seen === digitCount) return index + 1;
  }
  return formatted.length;
}

export function cvcHint(brand: CardBrand) {
  if (brand === "amex") return "4 digits on the front of the card.";
  if (brand === "unknown") return "3 digits on the back. American Express uses 4 on the front.";
  return "3 digits on the back of the card.";
}
