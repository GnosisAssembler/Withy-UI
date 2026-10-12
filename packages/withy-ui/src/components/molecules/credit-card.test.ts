import { describe, expect, it } from "vitest";
import {
  caretFromDigitCount,
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  normalizeCreditCard,
  normalizeExpiry,
} from "./credit-card";

describe("detectCardBrand", () => {
  it.each([
    ["", "unknown"],
    ["3", "unknown"],
    ["30", "unknown"],
    ["5", "unknown"],
    ["50", "unknown"],
    ["2", "unknown"],
    ["222", "unknown"],
    ["2220", "unknown"],
    ["2721", "unknown"],
    ["6", "unknown"],
    ["60", "unknown"],
    ["601", "unknown"],
    ["6012", "unknown"],
    ["64", "unknown"],
    ["643", "unknown"],
    ["35", "unknown"],
    ["3527", "unknown"],
    ["3590", "unknown"],
    ["4", "visa"],
    ["4242424242424242", "visa"],
    ["51", "mastercard"],
    ["5555555555554444", "mastercard"],
    ["2221", "mastercard"],
    ["2720", "mastercard"],
    ["34", "amex"],
    ["37", "amex"],
    ["378282246310005", "amex"],
    ["300", "diners"],
    ["30569309025904", "diners"],
    ["36", "diners"],
    ["38", "diners"],
    ["6011", "discover"],
    ["65", "discover"],
    ["644", "discover"],
    ["649", "discover"],
    ["3528", "jcb"],
    ["3589", "jcb"],
    ["3530111333300000", "jcb"],
    ["62", "unionpay"],
    ["6200000000000005", "unionpay"],
  ] as const)("reads %s as %s", (number, brand) => {
    expect(detectCardBrand(number)).toBe(brand);
  });

  it("ignores spaces and dashes", () => {
    expect(detectCardBrand("4242-4242 4242")).toBe("visa");
  });
});

describe("card formatting", () => {
  it("groups numbers by brand", () => {
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
    expect(formatCardNumber("4242424242424242123")).toBe("4242 4242 4242 4242 123");
    expect(formatCardNumber("378282246310005")).toBe("3782 822463 10005");
    expect(formatCardNumber("30569309025904")).toBe("3056 930902 5904");
  });

  it("normalizes the expiry month", () => {
    expect(normalizeExpiry("3")).toBe("03");
    expect(normalizeExpiry("12")).toBe("12");
    expect(normalizeExpiry("1228")).toBe("1228");
    expect(normalizeExpiry("13")).toBe("1");
    expect(normalizeExpiry("00")).toBe("01");
    expect(formatExpiry("1228")).toBe("12/28");
    expect(formatExpiry("03")).toBe("03");
  });

  it("keeps a normalized card stable and trims the security code to the brand", () => {
    const card = normalizeCreditCard({
      number: "4242-4242-4242-4242",
      name: "Ada Lovelace 9",
      expiry: "1228",
      cvc: "12345",
    });
    expect(card).toEqual({
      number: "4242424242424242",
      name: "Ada Lovelace ",
      expiry: "1228",
      cvc: "123",
    });
    expect(normalizeCreditCard(card)).toEqual(card);

    expect(
      normalizeCreditCard({
        number: "378282246310005",
        name: "Ada",
        expiry: "1228",
        cvc: "12345",
      }).cvc,
    ).toBe("1234");
  });

  it("places the caret after a number of digits", () => {
    expect(caretFromDigitCount("4242 42", 4)).toBe(4);
    expect(caretFromDigitCount("4242 42", 5)).toBe(6);
    expect(caretFromDigitCount("12/28", 2)).toBe(2);
    expect(caretFromDigitCount("12/28", 3)).toBe(4);
  });
});
