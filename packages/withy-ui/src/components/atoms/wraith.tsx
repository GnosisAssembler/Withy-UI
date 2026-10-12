import { cn } from "../../lib/cn";

const sizes = {
  sm: "withy-wraith-sm",
  md: "withy-wraith-md",
  lg: "withy-wraith-lg",
} as const;

export type WraithSize = keyof typeof sizes;

export type WraithProps = Omit<React.ComponentProps<"div">, "children"> & {
  size?: WraithSize;
  label?: string;
};

// Each letter in the sprite rows is one pixel, painted with the matching
// --withy-wraith-* color from styles.css. A dot is an empty pixel.
const inks: Record<string, string> = {
  K: "ink",
  X: "void",
  Y: "gaze",
  D: "shade",
  M: "robe",
  L: "fold",
  T: "spill",
  R: "rim",
  E: "eye",
  B: "bone",
  b: "bone-dim",
  I: "iron",
  i: "iron-lit",
  F: "flame",
  f: "flame-glow",
  g: "flame-edge",
};

// The hood, robe, hands, and lantern frame. The eyes, the flame, and the
// hem below row 35 are drawn as frames over it.
const figure = [
  ".....................KK.........",
  "....................KLK.........",
  "..................KKLK..........",
  "...............KKKLLMK..........",
  ".............KKLLLLMDK..........",
  "...........KKLLLLLLMMDK.........",
  ".........KKLLLLLLLLMMDK.........",
  "........KLLLLLLLLLLMMMDK........",
  ".......KLLLLKKKKKKKMMMDK........",
  ".......KLLLKXXXXXXXKMMDK........",
  ".......KLLKXXXXXXXXXKMMDK.......",
  ".......KLLKXXXXXXXXXKMMDK.......",
  ".......KLLKXXXXXXXXXKMMDK.......",
  ".......KLLKXXXXXXXXXKMMDK.......",
  ".......KLLMKXXXXXXXKMMDDK.......",
  ".......KLLMMKKKKKKKMMMDDK.......",
  "......KLLLLMMMMMMMMMMMMMDDK.....",
  ".....KLLLLLMMMMMMMMMMMMMMDDK....",
  "....KLLLLLKMMMMMMMMMMMMMMMDDK...",
  "...KLLLLMKLMMMMMMMMMMMMMKMDDK...",
  "..KLLLMMKKLMMMMMDMMMMMMKLMDDK...",
  ".KLLMMMDK.KLMMMMDMMMMMMKLMMDDK..",
  "KLMMMMDK..KLMMMMDMMMMMKLMMMDDK..",
  "KTMMMDDK..KLMMMMMDMMMMKLMMMMDDK.",
  "KRTDDDK...KLMMMMMDMMMMKMMMMMDDK.",
  "KKXXXKK...KTMMMMMDMMMKDDDDDDDDK.",
  ".KBbBK....KTMMMMMMDMMKKXXXXXKK..",
  "..KbK.....KTMMMMMMDMMMMKbBBbK...",
  "...K......KRMMMMMMMDMMMMKbKbK...",
  "..KiK.....KRMMMMMMMDMMMMMKMDK...",
  ".KIiIK....KRTMMMMMMMDMMMMMDDK...",
  "KIIiIIK...KRMMMMMMMMDMMMMMDDK...",
  "K.....K...KRTMMMMMMMDMMMMMDDK...",
  "K.....K...KTMMMMMMMMMDMMMMDDK...",
  "K.....K....KTMMMMDMMMDMMMMDDK...",
  "K.....K....KMMMMKMMMMDMMMKDDK...",
  "KIIIIIK.........................",
  ".KIIIK..........................",
  "..KKK...........................",
];

// Open, then shut for a blink.
const eyes = [
  ["..Y...Y..", ".YEY.YEY.", ".YEY.YEY.", "..Y...Y.."],
  [".........", ".........", ".YYY.YYY.", "........."],
];

// Steady, dimmed, then leaning.
const flame = [
  ["gfffg", "fFFFf", "fFFFf", "gfffg"],
  ["ggfgg", "gfFfg", "fFFFf", "gfffg"],
  ["gffgg", "fFFfg", "fFFFf", "gfffg"],
];

// At rest, swaying right, then swaying left.
const hem = [
  [
    "..KMMDKMMMMMDMMKKDDK",
    "..KMDK.KMMMMDMMK.KDDK",
    "..KDK..KMMMMMDMK..KDK",
    "...K...KMMMMDMMK...KK",
    "........KMMMDMMK",
    "........KMMMDMK",
    ".........KMMDMK",
    ".........KMMDK",
    "..........KMDK",
    "..........KDK",
    "...........KK",
  ],
  [
    "..KMMDKMMMMMDMMKKDDK",
    "..KMDK.KMMMMDMMK.KDDK",
    "...KDK.KMMMMMDMK...KDK",
    "....K..KMMMMDMMK....KK",
    "........KMMMDMMK",
    ".........KMMMDMK",
    "..........KMMDMK",
    "..........KMMDK",
    "...........KMDK",
    "............KDK",
    ".............KK",
  ],
  [
    "..KMMDKMMMMMDMMKKDDK",
    "..KMDK.KMMMMDMMK.KDDK",
    ".KDK...KMMMMMDMK.KDK",
    "..K....KMMMMDMMK..KK",
    "........KMMMDMMK",
    ".......KMMMDMMK",
    "........KMMDMK",
    "........KMMDK",
    ".........KMDK",
    ".........KDK",
    ".........KK",
  ],
];

const shadow = ["...KKKKKKKK...", ".KKKKKKKKKKKK.", "...KKKKKKKK..."];

type Pixels = [ink: string, path: string][];

// Merges each row's runs of one color into a single path per color.
function trace(rows: readonly string[], left = 0, top = 0): Pixels {
  const paths = new Map<string, string>();
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      const ink = row[x];
      let end = x + 1;
      while (row[end] === ink) end += 1;
      if (ink !== ".") {
        const run = `M${left + x} ${top + y}h${end - x}v1h${x - end}z`;
        paths.set(ink, (paths.get(ink) ?? "") + run);
      }
      x = end;
    }
  });
  return [...paths];
}

const body = trace(figure);
const eyeFrames = eyes.map((rows) => trace(rows, 11, 10));
const flameFrames = flame.map((rows) => trace(rows, 1, 32));
const hemFrames = hem.map((rows) => trace(rows, 10, 36));
const shadowPixels = trace(shadow);

function Sprite({ pixels, ink }: { pixels: Pixels; ink?: string }) {
  return pixels.map(([key, path]) => (
    <path key={key} d={path} style={{ fill: `var(--withy-wraith-${ink ?? inks[key]})` }} />
  ));
}

function Frames({ frames, className }: { frames: Pixels[]; className: string }) {
  return (
    <g className={className}>
      {frames.map((pixels, index) => (
        <g key={index}>
          <Sprite pixels={pixels} />
        </g>
      ))}
    </g>
  );
}

// Particle positions and travel are in sprite pixels on the 52 by 64 stage.
// Negative delays start each one partway through its loop.
type Particle = {
  x: number;
  y: number;
  travel?: number;
  drift?: number;
  time: number;
  delay: number;
};

const motes: (Particle & { alt?: boolean })[] = [
  { x: 15, y: 44, travel: 22, drift: -2, time: 3.6, delay: -0.4 },
  { x: 18, y: 42, travel: 18, drift: 1, time: 3.1, delay: -1.9 },
  { x: 13, y: 46, travel: 26, drift: -3, time: 4.2, delay: -2.8, alt: true },
  { x: 17, y: 48, travel: 20, drift: 2, time: 3.8, delay: -3.4 },
  { x: 27, y: 50, travel: 24, drift: -1, time: 4.6, delay: -1.2, alt: true },
  { x: 38, y: 52, travel: 22, drift: 2, time: 4, delay: -2.3 },
  { x: 45, y: 44, travel: 26, drift: 1, time: 4.8, delay: -0.9, alt: true },
  { x: 8, y: 38, travel: 20, drift: -1, time: 4.4, delay: -3.9 },
];

const drops: Particle[] = [
  { x: 4, y: 4, travel: 26, time: 2.4, delay: -0.3 },
  { x: 9, y: 0, travel: 20, time: 2, delay: -1.5 },
  { x: 14, y: 8, travel: 14, time: 1.8, delay: -0.2 },
  { x: 20, y: 0, travel: 18, time: 2.2, delay: -0.8 },
  { x: 30, y: 2, travel: 16, time: 1.9, delay: -1.2 },
  { x: 37, y: 0, travel: 22, time: 2.6, delay: -2 },
  { x: 44, y: 6, travel: 24, time: 2.3, delay: -0.5 },
  { x: 49, y: 2, travel: 28, time: 2.8, delay: -1.8 },
];

const embers: Particle[] = [
  { x: 25, y: 46, travel: 7, time: 2.2, delay: -0.6 },
  { x: 34, y: 53, travel: 6, time: 1.9, delay: -1.4 },
  { x: 42, y: 46, travel: 8, time: 2.5, delay: -2.1 },
];

const twinkles: Particle[] = [
  { x: 7, y: 12, time: 3.2, delay: -0.5 },
  { x: 44, y: 9, time: 3.8, delay: -2.4 },
  { x: 49, y: 30, time: 4.4, delay: -1.1 },
  { x: 4, y: 28, time: 3.6, delay: -3 },
  { x: 37, y: 2, time: 4, delay: -1.8 },
];

function place({ x, y, travel = 0, drift = 0, time, delay }: Particle) {
  return {
    "--withy-wraith-x": x,
    "--withy-wraith-y": y,
    "--withy-wraith-travel": travel,
    "--withy-wraith-drift": drift,
    "--withy-wraith-time": `${time}s`,
    "--withy-wraith-delay": `${delay}s`,
  } as React.CSSProperties;
}

export function Wraith({ size = "md", label, className, ...props }: WraithProps) {
  return (
    <div
      className={cn("withy-wraith", sizes[size], className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...props}
    >
      <span className="withy-wraith-aura" />
      <svg viewBox="0 0 14 3" className="withy-wraith-shadow" aria-hidden>
        <Sprite pixels={shadowPixels} ink="shadow" />
      </svg>
      {drops.map((drop, index) => (
        <span key={`drop-${index}`} className="withy-wraith-drop" style={place(drop)} />
      ))}
      <span className="withy-wraith-figure">
        <span className="withy-wraith-glow" />
        <svg viewBox="0 0 32 48" className="withy-wraith-sprite" aria-hidden>
          <Sprite pixels={body} />
          <Frames frames={hemFrames} className="withy-wraith-sway" />
          <Frames frames={flameFrames} className="withy-wraith-flame" />
          <Frames frames={eyeFrames} className="withy-wraith-eyes" />
        </svg>
      </span>
      {embers.map((ember, index) => (
        <span key={`ember-${index}`} className="withy-wraith-ember" style={place(ember)} />
      ))}
      {motes.map((mote, index) => (
        <span
          key={`mote-${index}`}
          className={cn("withy-wraith-mote", mote.alt && "withy-wraith-mote-alt")}
          style={place(mote)}
        />
      ))}
      {twinkles.map((twinkle, index) => (
        <span key={`twinkle-${index}`} className="withy-wraith-twinkle" style={place(twinkle)} />
      ))}
    </div>
  );
}
