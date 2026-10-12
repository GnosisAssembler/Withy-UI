export type SplitterSize = number | string;

export type SplitterResizeBehavior = "preserve-relative-size" | "preserve-pixel-size";

export type SplitterPanelConfig = {
  id: string;
  /** Keeps this panel's place in the size list when panels are added or removed. */
  order?: number;
  minSize?: SplitterSize;
  maxSize?: SplitterSize;
  collapsible?: boolean;
  collapsedSize?: SplitterSize;
  /**
   * `preserve-pixel-size` keeps this panel's pixel size when the group resizes.
   * Other panels absorb the change. The default keeps each panel's share.
   */
  resizeBehavior?: SplitterResizeBehavior;
};

export type NormalizedPanel = {
  id: string;
  minSize: number;
  maxSize: number;
  collapsible: boolean;
  collapsedSize: number;
  resizeBehavior: SplitterResizeBehavior;
  minCss?: string;
  maxCss?: string;
  collapsedCss?: string;
};

export type SizeMetrics = {
  fontSize: number;
  rem: number;
  vw: number;
  vh: number;
};

export const fallbackMetrics: SizeMetrics = { fontSize: 16, rem: 16, vw: 0, vh: 0 };

const SIZE_PATTERN = /^(-?\d*\.?\d+)(px|%|em|rem|vw|vh)?$/;
const EPSILON = 0.001;

export function sizesEqual(a: readonly number[], b: readonly number[]) {
  if (a.length !== b.length) return false;
  return a.every((size, index) => Math.abs(size - (b[index] ?? Number.NaN)) < EPSILON);
}

export function nearly(a: number, b: number) {
  return Math.abs(a - b) < EPSILON;
}

export function orderedPanels(panels: readonly SplitterPanelConfig[]) {
  return panels
    .map((panel, index) => ({ panel, index }))
    .sort((a, b) => {
      if (a.panel.order == null && b.panel.order == null) return a.index - b.index;
      if (a.panel.order == null) return -1;
      if (b.panel.order == null) return 1;
      return a.panel.order - b.panel.order || a.index - b.index;
    })
    .map((item) => item.panel);
}

export function parsePanelSize(
  size: SplitterSize | undefined,
  rootPx: number,
  metrics: SizeMetrics,
): number | undefined {
  if (size == null) return undefined;
  if (typeof size === "number") return Number.isFinite(size) ? size : undefined;

  const match = size.trim().match(SIZE_PATTERN);
  if (!match) return undefined;
  const value = Number.parseFloat(match[1] ?? "");
  if (!Number.isFinite(value)) return undefined;
  const unit = match[2];
  if (unit == null || unit === "%") return value;
  if (rootPx <= 0) return undefined;

  const pixels =
    unit === "px"
      ? value
      : unit === "em"
        ? value * metrics.fontSize
        : unit === "rem"
          ? value * metrics.rem
          : unit === "vw"
            ? (value / 100) * metrics.vw
            : (value / 100) * metrics.vh;
  return (pixels / rootPx) * 100;
}

export function toCssSize(size: SplitterSize | undefined): string | undefined {
  if (size == null) return undefined;
  if (typeof size === "number") return Number.isFinite(size) ? `${size}%` : undefined;
  const match = size.trim().match(SIZE_PATTERN);
  if (!match) return undefined;
  const value = Number.parseFloat(match[1] ?? "");
  if (!Number.isFinite(value)) return undefined;
  return `${value}${match[2] ?? "%"}`;
}

export function normalizePanels(
  panels: readonly SplitterPanelConfig[],
  rootPx: number,
  metrics: SizeMetrics,
): NormalizedPanel[] {
  return orderedPanels(panels).map((panel) => {
    const minSize = Math.max(0, parsePanelSize(panel.minSize, rootPx, metrics) ?? 0);
    const maxSize = Math.max(minSize, parsePanelSize(panel.maxSize, rootPx, metrics) ?? 100);
    const collapsedSize = Math.min(
      minSize,
      Math.max(0, parsePanelSize(panel.collapsedSize, rootPx, metrics) ?? 0),
    );
    return {
      id: panel.id,
      minSize,
      maxSize,
      collapsible: panel.collapsible === true,
      collapsedSize,
      resizeBehavior: panel.resizeBehavior ?? "preserve-relative-size",
      minCss: panel.minSize != null ? toCssSize(panel.minSize) : undefined,
      maxCss: panel.maxSize != null ? toCssSize(panel.maxSize) : undefined,
      collapsedCss: toCssSize(panel.collapsedSize ?? 0),
    };
  });
}

/**
 * A collapsible panel snaps shut once the drag passes halfway between its
 * collapsed size and its minimum, and snaps open once the drag passes back.
 */
export function clampPanelSize(panel: NormalizedPanel, size: number) {
  let next = size;
  if (next < panel.minSize) {
    if (panel.collapsible) {
      const halfway = (panel.collapsedSize + panel.minSize) / 2;
      next = next < halfway ? panel.collapsedSize : panel.minSize;
    } else {
      next = panel.minSize;
    }
  }
  if (next > panel.maxSize) next = panel.maxSize;
  return next;
}

function roundSize(size: number) {
  return Number(size.toFixed(3));
}

function balance(sizes: readonly number[]) {
  const rounded = sizes.map(roundSize);
  const drift = roundSize(100 - rounded.reduce((sum, size) => sum + size, 0));
  if (Math.abs(drift) >= EPSILON) {
    const index = rounded.length - 1;
    rounded[index] = roundSize((rounded[index] ?? 0) + drift);
  }
  return rounded;
}

export function fitSizes(sizes: readonly number[], panels: readonly NormalizedPanel[]) {
  if (panels.length === 0) return [];
  let next = sizes.map((size, index) => clampPanelSize(panels[index] ?? panels[0]!, size));

  for (let pass = 0; pass < panels.length + 1; pass++) {
    const total = next.reduce((sum, size) => sum + size, 0);
    const extra = total - 100;
    if (Math.abs(extra) < EPSILON) break;

    if (extra > 0) {
      const room = next.map((size, index) => {
        const panel = panels[index];
        if (!panel) return 0;
        const floor = panel.collapsible ? panel.collapsedSize : panel.minSize;
        return Math.max(0, size - floor);
      });
      const roomSum = room.reduce((sum, size) => sum + size, 0);
      if (roomSum <= EPSILON) break;
      const cut = Math.min(extra, roomSum);
      next = next.map((size, index) =>
        clampPanelSize(panels[index] ?? panels[0]!, size - ((room[index] ?? 0) / roomSum) * cut),
      );
    } else {
      const room = next.map((size, index) => {
        const panel = panels[index];
        return panel ? Math.max(0, panel.maxSize - size) : 0;
      });
      const roomSum = room.reduce((sum, size) => sum + size, 0);
      if (roomSum <= EPSILON) break;
      const add = Math.min(-extra, roomSum);
      next = next.map((size, index) =>
        clampPanelSize(panels[index] ?? panels[0]!, size + ((room[index] ?? 0) / roomSum) * add),
      );
    }
  }

  return balance(next);
}

export function layoutFromProps({
  panels,
  sizes,
  rootPx,
  metrics,
}: {
  panels: readonly SplitterPanelConfig[];
  sizes?: readonly SplitterSize[];
  rootPx: number;
  metrics: SizeMetrics;
}) {
  const normalized = normalizePanels(panels, rootPx, metrics);
  const resolved = Array<number>(normalized.length);
  let remaining = 100;
  let specified = 0;

  for (let index = 0; index < normalized.length; index++) {
    const parsed = parsePanelSize(sizes?.[index], rootPx, metrics);
    if (parsed == null) continue;
    resolved[index] = parsed;
    remaining -= parsed;
    specified += 1;
  }

  for (let index = 0; index < normalized.length; index++) {
    if (resolved[index] != null) continue;
    const slots = normalized.length - specified;
    const share = slots > 0 ? remaining / slots : 0;
    resolved[index] = share;
    remaining -= share;
    specified += 1;
  }

  return { panels: normalized, sizes: fitSizes(resolved, normalized) };
}

function directionAway(from: number, other: number) {
  return from > other ? 1 : -1;
}

function keyboardDelta(
  delta: number,
  sizes: readonly number[],
  panels: readonly NormalizedPanel[],
  startIndex: number,
  endIndex: number,
) {
  let next = delta;
  const growIndex = delta < 0 ? endIndex : startIndex;
  const shrinkIndex = delta < 0 ? startIndex : endIndex;
  const grow = panels[growIndex];
  const growSize = sizes[growIndex];
  if (grow && growSize != null && grow.collapsible && nearly(growSize, grow.collapsedSize)) {
    const jump = grow.minSize - growSize;
    if (jump > Math.abs(next)) next = next < 0 ? -jump : jump;
  }
  const shrink = panels[shrinkIndex];
  const shrinkSize = sizes[shrinkIndex];
  if (shrink && shrinkSize != null && shrink.collapsible && nearly(shrinkSize, shrink.minSize)) {
    const jump = shrinkSize - shrink.collapsedSize;
    if (jump > Math.abs(next)) next = next < 0 ? -jump : jump;
  }
  return next;
}

export function resizeByDelta({
  sizes,
  panels,
  startIndex,
  endIndex,
  delta,
  trigger,
}: {
  sizes: readonly number[];
  panels: readonly NormalizedPanel[];
  startIndex: number;
  endIndex: number;
  delta: number;
  trigger: "pointer" | "keyboard" | "api";
}) {
  if (
    startIndex < 0 ||
    endIndex < 0 ||
    startIndex === endIndex ||
    !panels[startIndex] ||
    !panels[endIndex]
  ) {
    return [...sizes];
  }

  let nextDelta = delta;
  if (trigger === "keyboard") {
    nextDelta = keyboardDelta(nextDelta, sizes, panels, startIndex, endIndex);
  }
  if (Math.abs(nextDelta) < EPSILON) return [...sizes];

  const shrinkFrom = nextDelta > 0 ? endIndex : startIndex;
  const growFrom = nextDelta > 0 ? startIndex : endIndex;
  const shrinkStep = directionAway(shrinkFrom, growFrom);
  const growStep = directionAway(growFrom, shrinkFrom);
  const next = [...sizes];
  let applied = 0;
  const magnitude = Math.abs(nextDelta);

  let index = shrinkFrom;
  for (let guard = 0; guard < panels.length && applied < magnitude - EPSILON; guard++) {
    if (index < 0 || index >= panels.length) break;
    const panel = panels[index];
    const current = next[index] ?? 0;
    if (panel) {
      const safe = clampPanelSize(panel, current - (magnitude - applied));
      const changed = current - safe;
      if (changed > EPSILON) {
        next[index] = safe;
        applied += changed;
      }
    }
    index += shrinkStep;
  }

  if (applied < EPSILON) return [...sizes];

  let remaining = applied;
  index = growFrom;
  for (let guard = 0; guard < panels.length && remaining > EPSILON; guard++) {
    if (index < 0 || index >= panels.length) break;
    const panel = panels[index];
    const current = next[index] ?? 0;
    if (panel) {
      const safe = clampPanelSize(panel, current + remaining);
      const grown = safe - current;
      if (grown > EPSILON) {
        next[index] = safe;
        remaining -= grown;
      }
    }
    index += growStep;
  }

  if (remaining > EPSILON) {
    index = shrinkFrom;
    for (let guard = 0; guard < panels.length && remaining > EPSILON; guard++) {
      if (index < 0 || index >= panels.length) break;
      const current = next[index] ?? 0;
      const original = sizes[index] ?? 0;
      const room = Math.max(0, original - current);
      const give = Math.min(room, remaining);
      if (give > EPSILON) {
        next[index] = current + give;
        remaining -= give;
      }
      index += shrinkStep;
    }
  }

  const total = next.reduce((sum, size) => sum + size, 0);
  if (Math.abs(total - 100) > 0.5) return [...sizes];
  return balance(next);
}

export function preservePixelSizes({
  panels,
  sizes,
  previousRoot,
  nextRoot,
}: {
  panels: readonly NormalizedPanel[];
  sizes: readonly number[];
  previousRoot: number;
  nextRoot: number;
}) {
  if (
    previousRoot <= 0 ||
    nextRoot <= 0 ||
    Math.abs(previousRoot - nextRoot) < 0.5 ||
    !panels.some((panel) => panel.resizeBehavior === "preserve-pixel-size")
  ) {
    return [...sizes];
  }

  const next = sizes.map((size, index) => {
    if (panels[index]?.resizeBehavior !== "preserve-pixel-size") return size;
    return (((size / 100) * previousRoot) / nextRoot) * 100;
  });
  const fixed = next.reduce(
    (sum, size, index) =>
      panels[index]?.resizeBehavior === "preserve-pixel-size" ? sum + size : sum,
    0,
  );
  const relative = panels.flatMap((panel, index) =>
    panel.resizeBehavior === "preserve-pixel-size" ? [] : [index],
  );
  const remaining = 100 - fixed;

  if (relative.length === 0) {
    const total = next.reduce((sum, size) => sum + size, 0);
    const scaled = total > EPSILON ? next.map((size) => (size / total) * 100) : next;
    return fitSizes(scaled, panels);
  }

  const relativeTotal = relative.reduce((sum, index) => sum + (sizes[index] ?? 0), 0);
  if (Math.abs(relativeTotal) < EPSILON) {
    const share = remaining / relative.length;
    for (const index of relative) next[index] = share;
  } else {
    for (const index of relative) {
      next[index] = ((sizes[index] ?? 0) / relativeTotal) * remaining;
    }
  }
  return fitSizes(next, panels);
}

export function ariaValues(
  sizes: readonly number[],
  panels: readonly NormalizedPanel[],
  startIndex: number,
) {
  const panel = panels[startIndex];
  const valueNow = sizes[startIndex];
  if (!panel || valueNow == null) {
    return { valueNow: undefined, valueMin: undefined, valueMax: undefined };
  }

  let othersMin = 0;
  let othersMax = 0;
  panels.forEach((item, index) => {
    if (index === startIndex) return;
    othersMin += item.collapsible ? item.collapsedSize : item.minSize;
    othersMax += item.maxSize;
  });

  const floor = panel.collapsible ? panel.collapsedSize : panel.minSize;
  const valueMin = Math.max(floor, 100 - othersMax);
  const valueMax = Math.min(panel.maxSize, 100 - othersMin);
  const roundedNow = Math.round(valueNow);
  return {
    valueMin: Math.round(valueMin),
    valueMax: Math.round(valueMax),
    valueNow: Math.min(Math.round(valueMax), Math.max(Math.round(valueMin), roundedNow)),
  };
}

export function resolveTrigger(id: string, panels: readonly { id: string }[]) {
  const [rawStart = "", rawEnd = ""] = id.split(":");
  let startIndex = panels.findIndex((panel) => panel.id === rawStart);
  let endIndex = panels.findIndex((panel) => panel.id === rawEnd);
  if (rawStart && !rawEnd && startIndex >= 0) endIndex = startIndex + 1;
  if (!rawStart && rawEnd && endIndex >= 0) startIndex = endIndex - 1;
  const start = panels[startIndex];
  const end = panels[endIndex];
  if (!start || !end || startIndex === endIndex) return null;
  return { startIndex, endIndex, startId: start.id, endId: end.id };
}

export function resizePanelTo({
  sizes,
  panels,
  index,
  target,
}: {
  sizes: readonly number[];
  panels: readonly NormalizedPanel[];
  index: number;
  target: number;
}) {
  const current = sizes[index];
  if (current == null || panels.length < 2) return [...sizes];
  const other = index === panels.length - 1 ? index - 1 : index + 1;
  if (other < 0) return [...sizes];
  const startIndex = index < other ? index : other;
  const endIndex = index < other ? other : index;
  const delta = index === startIndex ? target - current : current - target;
  return resizeByDelta({
    sizes,
    panels,
    startIndex,
    endIndex,
    delta,
    trigger: "api",
  });
}
