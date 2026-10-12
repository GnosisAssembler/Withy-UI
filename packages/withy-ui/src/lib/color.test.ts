import { describe, expect, it } from "vitest";
import { accentSwatches, brandSwatches } from "./palette";
import {
  channelAmount,
  channelGradient,
  formatColor,
  hexToHsv,
  hsvToHex,
  normalizeHex,
  parseColor,
  withChannel,
} from "./color";

describe("parseColor", () => {
  it("reads hex, rgb, and hsl colors", () => {
    expect(formatColor(parseColor("#ff0000")!)).toBe("#FF0000");
    expect(formatColor(parseColor("#0f0")!)).toBe("#00FF00");
    expect(formatColor(parseColor("#0000ff80")!)).toBe("#0000FF80");
    expect(formatColor(parseColor("rgb(0, 0, 255)")!)).toBe("rgb(0, 0, 255)");
    expect(formatColor(parseColor("rgb(100% 0% 0% / 50%)")!)).toBe("rgba(255, 0, 0, 0.5)");
    expect(formatColor(parseColor("hsl(120, 100%, 50%)")!)).toBe("hsl(120, 100%, 50%)");
    expect(formatColor(parseColor("hsl(200deg 40% 30% / 0.25)")!)).toBe(
      "hsla(200, 40%, 30%, 0.25)",
    );
    expect(formatColor(parseColor("hsla(10, 20%, 30%, 1)")!)).toBe("hsl(10, 20%, 30%)");
  });

  it("keeps a full turn at the end of the hue range", () => {
    expect(parseColor("hsl(360, 100%, 50%)")?.h).toBe(360);
    expect(parseColor("hsl(0, 100%, 50%)")?.h).toBe(0);
  });

  it("rejects values that are not a color", () => {
    expect(parseColor("")).toBeNull();
    expect(parseColor("red")).toBeNull();
    expect(parseColor("hsl(not a color)")).toBeNull();
  });
});

describe("channel edits", () => {
  it("changes one channel and keeps the color format", () => {
    const color = parseColor("#00ff00")!;
    expect(channelAmount(color, "hue")).toBe(120);
    expect(formatColor(withChannel(color, "hue", 240))).toBe("#0000FF");
    expect(formatColor(withChannel(color, "saturation", 0))).toBe("#808080");
    expect(formatColor(withChannel(parseColor("rgb(255, 0, 0)")!, "lightness", 100))).toBe(
      "rgb(255, 255, 255)",
    );
  });

  it("draws a gradient for the channel being edited", () => {
    const color = parseColor("hsl(200, 40%, 30%)")!;
    expect(channelGradient(color, "hue", "to right")).toContain("hsl(0 100% 50%)");
    expect(channelGradient(color, "hue", "to right")).toContain("hsl(240 100% 50%)");
    expect(channelGradient(color, "saturation", "to left")).toBe(
      "linear-gradient(to left in hsl, hsl(200 0% 30%), hsl(200 100% 30%))",
    );
    expect(channelGradient(color, "alpha", "to top")).toBe(
      "linear-gradient(to top, transparent, hsl(200 40% 30%))",
    );
  });
});

describe("hex and hsv", () => {
  it("normalizes short, long, and unhashed hex", () => {
    expect(normalizeHex("#abc")).toBe("#AABBCC");
    expect(normalizeHex("0e7484")).toBe("#0E7484");
    expect(normalizeHex("  #fe5d9f  ")).toBe("#FE5D9F");
    expect(normalizeHex("#abcd")).toBeNull();
    expect(normalizeHex("red")).toBeNull();
    expect(normalizeHex("")).toBeNull();
  });

  it("converts the primary hues", () => {
    expect(hsvToHex(0, 100, 100)).toBe("#FF0000");
    expect(hsvToHex(120, 100, 100)).toBe("#00FF00");
    expect(hsvToHex(240, 100, 100)).toBe("#0000FF");
    expect(hsvToHex(0, 0, 100)).toBe("#FFFFFF");
    expect(hsvToHex(0, 0, 0)).toBe("#000000");
    expect(hsvToHex(360, 100, 100)).toBe("#FF0000");
  });

  it("round-trips palette colors and a sample of the cube", () => {
    const failures: string[] = [];
    const samples = [
      ...brandSwatches.map((swatch) => swatch.hex),
      ...accentSwatches.map((swatch) => swatch.hex),
    ];

    for (let red = 0; red < 256; red += 17) {
      for (let green = 0; green < 256; green += 17) {
        for (let blue = 0; blue < 256; blue += 17) {
          samples.push(
            `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`.toUpperCase(),
          );
        }
      }
    }

    for (const sample of samples) {
      const normalized = normalizeHex(sample);
      if (!normalized) continue;
      const hsv = hexToHsv(normalized);
      if (!hsv || hsvToHex(hsv.h, hsv.s, hsv.v) !== normalized) failures.push(normalized);
    }

    expect(failures).toEqual([]);
  });
});
