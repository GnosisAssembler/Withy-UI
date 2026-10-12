export type ColorFormat = "hex" | "rgb" | "hsl";

export type ColorChannel = "hue" | "saturation" | "lightness" | "alpha";

export type ColorValue = {
  h: number;
  s: number;
  l: number;
  a: number;
  format: ColorFormat;
};

export type GradientDirection = "to right" | "to left" | "to top";

const numberPattern = "-?(?:\\d+\\.?\\d*|\\.\\d+)";

export type Hsv = {
  h: number;
  s: number;
  v: number;
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Accepts `#RGB`, `#RRGGBB`, and the same forms without a hash. */
export function normalizeHex(input: string): string | null {
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(input.trim());
  const digits = match?.[1];
  if (!digits) return null;
  const full =
    digits.length === 3
      ? digits
          .split("")
          .map((char) => char + char)
          .join("")
      : digits;
  return `#${full.toUpperCase()}`;
}

export function hexToHsv(hex: string): Hsv | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const value = Number.parseInt(normalized.slice(1), 16);
  const r = ((value >> 16) & 255) / 255;
  const g = ((value >> 8) & 255) / 255;
  const b = (value & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  };
}

export function hsvToHex(h: number, s: number, v: number): string {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const val = clamp(v, 0, 100) / 100;
  const chroma = val * sat;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = val - chroma;

  let red = 0;
  let green = 0;
  let blue = 0;
  if (hue < 60) {
    red = chroma;
    green = x;
  } else if (hue < 120) {
    red = x;
    green = chroma;
  } else if (hue < 180) {
    green = chroma;
    blue = x;
  } else if (hue < 240) {
    green = x;
    blue = chroma;
  } else if (hue < 300) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  const channel = (n: number) =>
    clamp(Math.round((n + m) * 255), 0, 255)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(red)}${channel(green)}${channel(blue)}`.toUpperCase();
}

function normalizeHue(degrees: number) {
  if (!Number.isFinite(degrees)) return 0;
  const wrapped = ((degrees % 360) + 360) % 360;
  if (wrapped === 0 && degrees > 0) return 360;
  return wrapped;
}

function rgbToHsl(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: lightness * 100 };

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const hue =
    max === red
      ? (green - blue) / delta + (green < blue ? 6 : 0)
      : max === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4;

  return { h: (hue / 6) * 360, s: saturation * 100, l: lightness * 100 };
}

function hslToRgb(h: number, s: number, l: number) {
  const hue = (((h % 360) + 360) % 360) / 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;

  if (saturation === 0) {
    const gray = Math.round(lightness * 255);
    return { r: gray, g: gray, b: gray };
  }

  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const channel = (amount: number) => {
    let t = hue + amount;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  return {
    r: Math.round(channel(1 / 3) * 255),
    g: Math.round(channel(0) * 255),
    b: Math.round(channel(-1 / 3) * 255),
  };
}

function byte(value: number) {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
}

function formatAlpha(alpha: number) {
  return String(Math.round(clamp(alpha, 0, 1) * 100) / 100);
}

function parseHex(input: string): ColorValue | null {
  const match = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(input);
  const hex = match?.[1];
  if (!hex) return null;
  const full = hex.length <= 4 ? [...hex].map((char) => char + char).join("") : hex;
  const rgb = rgbToHsl(
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  );
  const alpha = full.length === 8 ? Number.parseInt(full.slice(6, 8), 16) / 255 : 1;
  return { ...rgb, a: clamp(alpha, 0, 1), format: "hex" };
}

function parseHue(raw: string | undefined) {
  if (!raw) return null;
  const match = new RegExp(`^(${numberPattern})(deg|turn|rad)?$`, "i").exec(raw);
  const amount = match?.[1] ? Number(match[1]) : Number.NaN;
  if (!Number.isFinite(amount)) return null;
  const unit = match?.[2]?.toLowerCase();
  const degrees =
    unit === "turn" ? amount * 360 : unit === "rad" ? (amount * 180) / Math.PI : amount;
  return normalizeHue(degrees);
}

function parsePercent(raw: string | undefined) {
  if (!raw) return null;
  const match = new RegExp(`^(${numberPattern})%?$`).exec(raw);
  const amount = match?.[1] ? Number(match[1]) : Number.NaN;
  if (!Number.isFinite(amount)) return null;
  return clamp(amount, 0, 100);
}

function parseRgbChannel(raw: string | undefined) {
  if (!raw) return null;
  const match = new RegExp(`^(${numberPattern})(%?)$`).exec(raw);
  const amount = match?.[1] ? Number(match[1]) : Number.NaN;
  if (!Number.isFinite(amount)) return null;
  const value = match?.[2] === "%" ? (amount / 100) * 255 : amount;
  return clamp(Math.round(value), 0, 255);
}

function parseAlpha(raw: string | undefined) {
  if (!raw) return null;
  const match = new RegExp(`^(${numberPattern})(%?)$`).exec(raw);
  const amount = match?.[1] ? Number(match[1]) : Number.NaN;
  if (!Number.isFinite(amount)) return null;
  return clamp(match?.[2] === "%" ? amount / 100 : amount, 0, 1);
}

function splitAlpha(body: string): [string, string | undefined] {
  const slash = body.indexOf("/");
  if (slash === -1) {
    const parts = body.split(/\s+/).filter(Boolean);
    if (parts.length === 4) return [parts.slice(0, 3).join(" "), parts[3]];
    return [body, undefined];
  }
  return [body.slice(0, slash).trim(), body.slice(slash + 1).trim()];
}

function parseFunctional(input: string): ColorValue | null {
  const match = new RegExp(`^(rgb|hsl)a?\\(\\s*([^)]+?)\\s*\\)$`, "i").exec(input);
  const kind = match?.[1]?.toLowerCase();
  const body = match?.[2]
    ?.replace(/,/g, " ")
    .replace(/\s*\/\s*/, " / ")
    .trim();
  if (!kind || !body) return null;

  const [channels, alphaPart] = splitAlpha(body);
  const parts = channels.split(/\s+/).filter(Boolean);
  if (parts.length !== 3) return null;
  const alpha = alphaPart === undefined ? 1 : parseAlpha(alphaPart);
  if (alpha === null) return null;

  if (kind === "rgb") {
    const red = parseRgbChannel(parts[0]);
    const green = parseRgbChannel(parts[1]);
    const blue = parseRgbChannel(parts[2]);
    if (red === null || green === null || blue === null) return null;
    return { ...rgbToHsl(red, green, blue), a: alpha, format: "rgb" };
  }

  const hue = parseHue(parts[0]);
  const saturation = parsePercent(parts[1]);
  const lightness = parsePercent(parts[2]);
  if (hue === null || saturation === null || lightness === null) return null;
  return { h: hue, s: saturation, l: lightness, a: alpha, format: "hsl" };
}

export function parseColor(input: string): ColorValue | null {
  const value = input.trim();
  if (!value) return null;
  return parseHex(value) ?? parseFunctional(value);
}

export function formatColor(color: ColorValue) {
  const opaque = color.a >= 0.995;
  if (color.format === "hsl") {
    const hsl = `hsl(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%)`;
    return opaque ? hsl : hsl.replace("hsl(", "hsla(").replace(")", `, ${formatAlpha(color.a)})`);
  }

  const { r, g, b } = hslToRgb(color.h, color.s, color.l);
  if (color.format === "rgb") {
    return opaque ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${formatAlpha(color.a)})`;
  }

  const hex = `#${byte(r)}${byte(g)}${byte(b)}`.toUpperCase();
  return opaque ? hex : `${hex}${byte(color.a * 255)}`.toUpperCase();
}

export function colorCss(color: ColorValue) {
  const alpha = Math.round(clamp(color.a, 0, 1) * 1000) / 1000;
  return `hsl(${Math.round(color.h)} ${Math.round(color.s)}% ${Math.round(color.l)}% / ${alpha})`;
}

export function channelAmount(color: ColorValue, channel: ColorChannel) {
  switch (channel) {
    case "hue": {
      const rounded = Math.round(color.h);
      return rounded >= 360 ? 360 : clamp(rounded, 0, 360);
    }
    case "saturation":
      return clamp(Math.round(color.s), 0, 100);
    case "lightness":
      return clamp(Math.round(color.l), 0, 100);
    case "alpha":
      return clamp(Math.round(color.a * 100), 0, 100);
  }
}

export function withChannel(color: ColorValue, channel: ColorChannel, amount: number): ColorValue {
  switch (channel) {
    case "hue":
      return { ...color, h: clamp(amount, 0, 360) };
    case "saturation":
      return { ...color, s: clamp(amount, 0, 100) };
    case "lightness":
      return { ...color, l: clamp(amount, 0, 100) };
    case "alpha":
      return { ...color, a: clamp(amount, 0, 100) / 100 };
  }
}

export function channelGradient(
  color: ColorValue,
  channel: ColorChannel,
  direction: GradientDirection,
) {
  const hue = Math.round(color.h);
  const saturation = Math.round(color.s);
  const lightness = Math.round(color.l);

  if (channel === "hue") {
    const stops = [0, 60, 120, 180, 240, 300, 360]
      .map((stop) => `hsl(${stop} 100% 50%)`)
      .join(", ");
    return `linear-gradient(${direction} in hsl, ${stops})`;
  }

  if (channel === "saturation") {
    return `linear-gradient(${direction} in hsl, hsl(${hue} 0% ${lightness}%), hsl(${hue} 100% ${lightness}%))`;
  }

  if (channel === "lightness") {
    return `linear-gradient(${direction} in hsl, hsl(${hue} ${saturation}% 0%), hsl(${hue} ${saturation}% 50%), hsl(${hue} ${saturation}% 100%))`;
  }

  return `linear-gradient(${direction}, transparent, hsl(${hue} ${saturation}% ${lightness}%))`;
}
