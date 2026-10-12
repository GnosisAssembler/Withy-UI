const SIZE = 640;

const palettes = [
  ["#102e34", "#0e7484", "#5ed4e2", "#f3efe8", "#f0a44a"],
  ["#2c1810", "#c45c26", "#f0a44a", "#fff4ea", "#5ed4e2"],
  ["#1b1430", "#5b3d8a", "#c4b5fd", "#f7f4fb", "#8affc1"],
  ["#102018", "#245c45", "#7dcea0", "#f3faf6", "#f0a44a"],
] as const;

function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Seeded abstract image for demos. The same index always returns the same picture. */
export function generatedGalleryImage(index: number) {
  const next = random(11 + index * 97);
  const palette = palettes[index % palettes.length] ?? palettes[0];
  const [background, ...inks] = palette;
  const shapes = [`<rect width="${SIZE}" height="${SIZE}" fill="${background}"/>`];

  for (let shape = 0; shape < 4; shape += 1) {
    const ink = inks[Math.floor(next() * inks.length)] ?? inks[0];
    const size = 140 + Math.round(next() * 260);
    const x = Math.round(next() * (SIZE - size * 0.4) - size * 0.2);
    const y = Math.round(next() * (SIZE - size * 0.4) - size * 0.2);
    if (shape % 2 === 0) {
      shapes.push(
        `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${Math.round(size / 2)}" fill="${ink}"/>`,
      );
    } else {
      const height = Math.round(size * (0.45 + next() * 0.7));
      shapes.push(
        `<rect x="${x}" y="${y}" width="${size}" height="${height}" rx="36" fill="${ink}"/>`,
      );
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${shapes.join("")}</svg>`;

  return {
    src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    alt: `Generated color study ${index + 1}`,
  };
}

export const hoverGalleryImages = [0, 1, 2, 3].map((index) => generatedGalleryImage(index));
