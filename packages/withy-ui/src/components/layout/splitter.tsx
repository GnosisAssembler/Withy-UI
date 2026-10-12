"use client";

import * as React from "react";
import { cn } from "../../lib/cn";
import {
  ariaValues,
  fallbackMetrics,
  fitSizes,
  layoutFromProps,
  nearly,
  normalizePanels,
  preservePixelSizes,
  resolveTrigger,
  resizeByDelta,
  resizePanelTo,
  sizesEqual,
  type NormalizedPanel,
  type SizeMetrics,
  type SplitterPanelConfig,
  type SplitterSize,
} from "./splitter-math";

export type { SplitterPanelConfig, SplitterResizeBehavior, SplitterSize } from "./splitter-math";

export type SplitterResizeDetails = {
  size: number[];
  resizeTriggerId: string | null;
};

export type SplitterResizeEndDetails = SplitterResizeDetails;

export type SplitterExpandCollapseDetails = {
  panelId: string;
  size: number;
};

export type SplitterApi = {
  /** Panel sizes in percentage points. */
  size: number[];
  orientation: "horizontal" | "vertical";
  dragging: boolean;
  setSize: (size: readonly SplitterSize[]) => void;
  resetSizes: () => void;
  collapsePanel: (id: string) => void;
  expandPanel: (id: string, minSize?: number) => void;
  isPanelCollapsed: (id: string) => boolean;
  isPanelExpanded: (id: string) => boolean;
  getPanelSize: (id: string) => number;
  resizePanel: (id: string, size: number) => void;
};

type DragState = {
  id: string;
  start: number;
  sizes: number[];
  startIndex: number;
  endIndex: number;
};

type ResizeActions = {
  keyboardStep: number;
  onResizeStart?: () => void;
  onResizeEnd?: (details: SplitterResizeEndDetails) => void;
  runResize: (
    sizes: readonly number[],
    startIndex: number,
    endIndex: number,
    delta: number,
    triggerId: string | null,
    trigger: "pointer" | "keyboard" | "api",
  ) => number[];
  draggingId: string | null;
  startDrag: (drag: DragState) => void;
  finishDrag: (id: string) => void;
  getDrag: () => DragState | null;
  getRoot: () => HTMLElement | null;
  getSize: () => number[];
};

const SplitterReactContext = React.createContext<SplitterApi | null>(null);
const RootIdContext = React.createContext("");
const PanelListContext = React.createContext<readonly NormalizedPanel[]>([]);
const ResizeContext = React.createContext<ResizeActions | null>(null);

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function readMetrics(root: HTMLElement): SizeMetrics {
  const view = root.ownerDocument.defaultView;
  const fontSize = Number.parseFloat(view?.getComputedStyle(root).fontSize ?? "");
  const rem = Number.parseFloat(
    view?.getComputedStyle(root.ownerDocument.documentElement).fontSize ?? "",
  );
  return {
    fontSize: Number.isFinite(fontSize) ? fontSize : fallbackMetrics.fontSize,
    rem: Number.isFinite(rem) ? rem : fallbackMetrics.rem,
    vw: view?.innerWidth ?? 0,
    vh: view?.innerHeight ?? 0,
  };
}

function readGroupSize(root: HTMLElement, orientation: "horizontal" | "vertical") {
  const rect = root.getBoundingClientRect();
  const measured = orientation === "horizontal" ? rect.width : rect.height;
  if (measured > 0) return measured;
  return orientation === "horizontal" ? root.clientWidth : root.clientHeight;
}

function panelDomId(rootId: string, panelId: string) {
  return `${rootId}-panel-${panelId}`;
}

function panelStyle(
  size: number | undefined,
  panel: NormalizedPanel | undefined,
  orientation: "horizontal" | "vertical",
  dragging: boolean,
): React.CSSProperties {
  const horizontal = orientation === "horizontal";
  const collapsed =
    panel?.collapsible === true && size != null && nearly(size, panel.collapsedSize);
  const minCss = collapsed ? (panel?.collapsedCss ?? "0%") : panel?.minCss;
  return {
    flexGrow: size ?? 1,
    flexShrink: 1,
    flexBasis: 0,
    overflow: "hidden",
    minWidth: horizontal ? (minCss ?? 0) : 0,
    minHeight: horizontal ? 0 : (minCss ?? 0),
    maxWidth: horizontal ? panel?.maxCss : undefined,
    maxHeight: horizontal ? undefined : panel?.maxCss,
    pointerEvents: dragging ? "none" : undefined,
  };
}

function layoutKeyFor(
  panels: readonly SplitterPanelConfig[],
  defaultSize: readonly SplitterSize[] | undefined,
  orientation: string,
) {
  return JSON.stringify({
    orientation,
    defaultSize: defaultSize ?? null,
    panels: panels.map((panel) => [
      panel.id,
      panel.order ?? null,
      panel.minSize ?? null,
      panel.maxSize ?? null,
      panel.collapsible === true,
      panel.collapsedSize ?? null,
      panel.resizeBehavior ?? "preserve-relative-size",
    ]),
  });
}

function focusHandle(element: HTMLElement) {
  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }
}

export function Splitter({
  panels,
  orientation = "horizontal",
  defaultSize,
  size,
  onResize,
  onResizeStart,
  onResizeEnd,
  onCollapse,
  onExpand,
  keyboardResizeBy,
  className,
  children,
  id,
  ...props
}: Omit<React.ComponentProps<"div">, "onResize"> & {
  panels: readonly SplitterPanelConfig[];
  orientation?: "horizontal" | "vertical";
  defaultSize?: readonly SplitterSize[];
  size?: readonly SplitterSize[];
  onResize?: (details: SplitterResizeDetails) => void;
  onResizeStart?: () => void;
  onResizeEnd?: (details: SplitterResizeEndDetails) => void;
  onCollapse?: (details: SplitterExpandCollapseDetails) => void;
  onExpand?: (details: SplitterExpandCollapseDetails) => void;
  /** Percentage points an arrow key moves the handle. 1 by default. Shift moves 10. */
  keyboardResizeBy?: number;
}) {
  const reactId = React.useId();
  const rootId = id ?? reactId;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<DragState | null>(null);
  const controlled = size !== undefined;
  const [rootPx, setRootPx] = React.useState(0);
  const [metrics, setMetrics] = React.useState<SizeMetrics>(fallbackMetrics);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [internalSizes, setInternalSizes] = React.useState(
    () =>
      layoutFromProps({
        panels,
        sizes: size ?? defaultSize,
        rootPx: 0,
        metrics: fallbackMetrics,
      }).sizes,
  );

  const latestRef = React.useRef({ panels, size, defaultSize, orientation });
  const onResizeRef = React.useRef(onResize);
  const onCollapseRef = React.useRef(onCollapse);
  const onExpandRef = React.useRef(onExpand);

  const normalized = React.useMemo(
    () => normalizePanels(panels, rootPx, metrics),
    [panels, rootPx, metrics],
  );
  const visibleSizes =
    !controlled && internalSizes.length === normalized.length
      ? internalSizes
      : layoutFromProps({
          panels,
          sizes: controlled ? size : defaultSize,
          rootPx,
          metrics,
        }).sizes;

  const sizesRef = React.useRef(visibleSizes);
  const panelsRef = React.useRef(normalized);
  const initialSizesRef = React.useRef<number[] | null>(null);
  const previousRootRef = React.useRef<number | null>(null);
  const sizeBeforeCollapseRef = React.useRef(new Map<string, number>());
  const layoutKey = layoutKeyFor(panels, defaultSize, orientation);

  useIsoLayoutEffect(() => {
    latestRef.current = { panels, size, defaultSize, orientation };
    onResizeRef.current = onResize;
    onCollapseRef.current = onCollapse;
    onExpandRef.current = onExpand;
    sizesRef.current = visibleSizes;
    panelsRef.current = normalized;
  });

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const apply = (reason: "mount" | "resize") => {
      if (dragRef.current) return;
      const current = latestRef.current;
      const nextRoot = readGroupSize(root, current.orientation);
      const nextMetrics = readMetrics(root);
      if (nextRoot <= 0) return;

      const previousRoot = previousRootRef.current;
      previousRootRef.current = nextRoot;
      setRootPx((value) => (value === nextRoot ? value : nextRoot));
      setMetrics((currentMetrics) =>
        currentMetrics.fontSize === nextMetrics.fontSize &&
        currentMetrics.rem === nextMetrics.rem &&
        currentMetrics.vw === nextMetrics.vw &&
        currentMetrics.vh === nextMetrics.vh
          ? currentMetrics
          : nextMetrics,
      );

      const laid = layoutFromProps({
        panels: current.panels,
        sizes: current.size ?? current.defaultSize,
        rootPx: nextRoot,
        metrics: nextMetrics,
      });

      if (reason === "mount" || previousRoot == null) {
        initialSizesRef.current = laid.sizes;
        if (current.size === undefined) {
          setInternalSizes((currentSizes) =>
            sizesEqual(currentSizes, laid.sizes) ? currentSizes : laid.sizes,
          );
        }
        return;
      }

      const next = fitSizes(
        preservePixelSizes({
          panels: laid.panels,
          sizes: sizesRef.current,
          previousRoot,
          nextRoot,
        }),
        laid.panels,
      );
      if (sizesEqual(sizesRef.current, next)) return;
      if (current.size === undefined) setInternalSizes(next);
      else onResizeRef.current?.({ size: next, resizeTriggerId: null });
    };

    apply("mount");
    const observer = new ResizeObserver(() => apply("resize"));
    observer.observe(root);
    return () => observer.disconnect();
  }, [layoutKey]);

  React.useEffect(() => {
    if (!draggingId) return;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = orientation === "horizontal" ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [draggingId, orientation]);

  const notifyCollapse = React.useCallback(
    (previous: readonly number[], next: readonly number[]) => {
      panelsRef.current.forEach((panel, index) => {
        if (!panel.collapsible) return;
        const before = previous[index];
        const after = next[index];
        if (before == null || after == null || nearly(before, after)) return;
        if (nearly(after, panel.collapsedSize) && !nearly(before, panel.collapsedSize)) {
          sizeBeforeCollapseRef.current.set(panel.id, before);
          onCollapseRef.current?.({ panelId: panel.id, size: after });
        } else if (nearly(before, panel.collapsedSize) && !nearly(after, panel.collapsedSize)) {
          onExpandRef.current?.({ panelId: panel.id, size: after });
        }
      });
    },
    [],
  );

  const commit = React.useCallback(
    (next: readonly number[], triggerId: string | null) => {
      const safe = fitSizes(next, panelsRef.current);
      const previous = sizesRef.current;
      if (sizesEqual(previous, safe)) return [...previous];
      notifyCollapse(previous, safe);
      if (!controlled) {
        sizesRef.current = safe;
        setInternalSizes(safe);
      }
      onResizeRef.current?.({ size: safe, resizeTriggerId: triggerId });
      return safe;
    },
    [controlled, notifyCollapse],
  );

  const runResize = React.useCallback(
    (
      sizes: readonly number[],
      startIndex: number,
      endIndex: number,
      delta: number,
      triggerId: string | null,
      trigger: "pointer" | "keyboard" | "api",
    ) =>
      commit(
        resizeByDelta({
          sizes,
          panels: panelsRef.current,
          startIndex,
          endIndex,
          delta,
          trigger,
        }),
        triggerId,
      ),
    [commit],
  );

  const resizeTo = React.useCallback(
    (panelId: string, target: number) => {
      const index = panelsRef.current.findIndex((panel) => panel.id === panelId);
      if (index < 0) return [...sizesRef.current];
      return commit(
        resizePanelTo({
          sizes: sizesRef.current,
          panels: panelsRef.current,
          index,
          target,
        }),
        null,
      );
    },
    [commit],
  );

  const api = React.useMemo<SplitterApi>(() => {
    const panelAt = (panelId: string) => {
      const index = normalized.findIndex((panel) => panel.id === panelId);
      const panel = normalized[index];
      if (!panel || index < 0) throw new Error(`Splitter has no panel "${panelId}".`);
      return { panel, panelSize: visibleSizes[index] ?? 0 };
    };

    return {
      size: visibleSizes,
      orientation,
      dragging: draggingId != null,
      setSize(next) {
        const laid = layoutFromProps({ panels, sizes: next, rootPx, metrics });
        onResizeStart?.();
        const applied = commit(laid.sizes, null);
        onResizeEnd?.({ size: applied, resizeTriggerId: null });
      },
      resetSizes() {
        const next =
          initialSizesRef.current ??
          layoutFromProps({
            panels: latestRef.current.panels,
            sizes: latestRef.current.defaultSize,
            rootPx,
            metrics,
          }).sizes;
        onResizeStart?.();
        const applied = commit(next, null);
        onResizeEnd?.({ size: applied, resizeTriggerId: null });
      },
      collapsePanel(panelId) {
        const { panel, panelSize } = panelAt(panelId);
        if (!panel.collapsible || nearly(panelSize, panel.collapsedSize)) return;
        onResizeStart?.();
        const applied = resizeTo(panelId, panel.collapsedSize);
        onResizeEnd?.({ size: applied, resizeTriggerId: null });
      },
      expandPanel(panelId, minSize) {
        const { panel, panelSize } = panelAt(panelId);
        if (!panel.collapsible || !nearly(panelSize, panel.collapsedSize)) return;
        const saved = sizeBeforeCollapseRef.current.get(panelId);
        const floor = minSize ?? panel.minSize;
        const target = saved != null && saved >= floor ? saved : floor;
        onResizeStart?.();
        const applied = resizeTo(panelId, target);
        onResizeEnd?.({ size: applied, resizeTriggerId: null });
      },
      isPanelCollapsed(panelId) {
        const { panel, panelSize } = panelAt(panelId);
        return panel.collapsible && nearly(panelSize, panel.collapsedSize);
      },
      isPanelExpanded(panelId) {
        const { panel, panelSize } = panelAt(panelId);
        return !panel.collapsible || !nearly(panelSize, panel.collapsedSize);
      },
      getPanelSize(panelId) {
        return panelAt(panelId).panelSize;
      },
      resizePanel(panelId, nextSize) {
        onResizeStart?.();
        const applied = resizeTo(panelId, nextSize);
        onResizeEnd?.({ size: applied, resizeTriggerId: null });
      },
    };
  }, [
    commit,
    draggingId,
    metrics,
    normalized,
    onResizeEnd,
    onResizeStart,
    orientation,
    panels,
    resizeTo,
    rootPx,
    visibleSizes,
  ]);

  const resizeActions = React.useMemo<ResizeActions>(
    () => ({
      keyboardStep: keyboardResizeBy ?? 1,
      onResizeStart,
      onResizeEnd,
      runResize,
      draggingId,
      startDrag(drag) {
        dragRef.current = drag;
        setDraggingId(drag.id);
      },
      finishDrag(triggerId) {
        if (dragRef.current?.id !== triggerId) return;
        const finalSize = [...sizesRef.current];
        dragRef.current = null;
        setDraggingId(null);
        onResizeEnd?.({ size: finalSize, resizeTriggerId: triggerId });
      },
      getDrag: () => dragRef.current,
      getRoot: () => rootRef.current,
      getSize: () => sizesRef.current,
    }),
    [draggingId, keyboardResizeBy, onResizeEnd, onResizeStart, runResize],
  );

  return (
    <SplitterReactContext.Provider value={api}>
      <RootIdContext.Provider value={rootId}>
        <PanelListContext.Provider value={normalized}>
          <ResizeContext.Provider value={resizeActions}>
            <div
              {...props}
              ref={rootRef}
              id={rootId}
              data-part="root"
              data-orientation={orientation}
              data-dragging={draggingId ? "true" : undefined}
              className={cn(
                "flex h-full w-full min-h-0 min-w-0 overflow-hidden",
                orientation === "horizontal" ? "flex-row" : "flex-col",
                className,
              )}
            >
              {children}
            </div>
          </ResizeContext.Provider>
        </PanelListContext.Provider>
      </RootIdContext.Provider>
    </SplitterReactContext.Provider>
  );
}

export function useSplitterContext() {
  const value = React.useContext(SplitterReactContext);
  if (!value) throw new Error("useSplitterContext must be used inside Splitter.");
  return value;
}

export function SplitterContext({
  children,
}: {
  children: (splitter: SplitterApi) => React.ReactNode;
}) {
  return children(useSplitterContext());
}

export function SplitterPanel({
  id,
  className,
  style,
  ...props
}: Omit<React.ComponentProps<"div">, "id"> & { id: string }) {
  const splitter = useSplitterContext();
  const rootId = React.useContext(RootIdContext);
  const panels = React.useContext(PanelListContext);
  const index = panels.findIndex((panel) => panel.id === id);
  const panel = index >= 0 ? panels[index] : undefined;
  const panelSize = index >= 0 ? splitter.size[index] : undefined;
  const collapsed =
    panel?.collapsible === true && panelSize != null && nearly(panelSize, panel.collapsedSize);

  return (
    <div
      {...props}
      id={panelDomId(rootId, id)}
      data-part="panel"
      data-id={id}
      data-orientation={splitter.orientation}
      data-collapsed={collapsed ? "true" : undefined}
      className={cn("min-h-0 min-w-0", className)}
      style={{
        ...panelStyle(panelSize, panel, splitter.orientation, splitter.dragging),
        ...style,
      }}
    />
  );
}

export function SplitterResizeTrigger({
  id,
  disabled = false,
  className,
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  onLostPointerCapture,
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<"div">, "id"> & {
  /** The panels this handle resizes, written as `before:after`. */
  id: string;
  disabled?: boolean;
}) {
  const splitter = useSplitterContext();
  const resize = React.useContext(ResizeContext);
  const panels = React.useContext(PanelListContext);
  const rootId = React.useContext(RootIdContext);
  if (!resize) throw new Error("SplitterResizeTrigger must be used inside Splitter.");

  const trigger = resolveTrigger(id, panels);
  const horizontal = splitter.orientation === "horizontal";
  const dragging = resize.draggingId === id;
  const aria = trigger ? ariaValues(splitter.size, panels, trigger.startIndex) : undefined;
  const label =
    ariaLabel ?? (trigger ? `Resize ${trigger.startId} and ${trigger.endId}` : "Resize panels");

  function endDrag() {
    resize?.finishDrag(id);
  }

  return (
    <div
      {...props}
      id={`${rootId}-trigger-${id}`}
      role="separator"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-orientation={splitter.orientation}
      aria-label={label}
      aria-valuenow={aria?.valueNow}
      aria-valuemin={aria?.valueMin}
      aria-valuemax={aria?.valueMax}
      aria-controls={
        trigger
          ? `${panelDomId(rootId, trigger.startId)} ${panelDomId(rootId, trigger.endId)}`
          : undefined
      }
      data-part="resize-trigger"
      data-id={id}
      data-ownedby={rootId}
      data-orientation={splitter.orientation}
      data-dragging={dragging ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      className={cn(
        "group relative z-10 flex shrink-0 touch-none items-center justify-center outline-none select-none",
        horizontal
          ? "-mx-1 w-2 cursor-col-resize self-stretch"
          : "-my-1 h-2 cursor-row-resize self-stretch",
        disabled && "pointer-events-none cursor-default",
        className,
      )}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || disabled || !trigger || event.button !== 0) return;
        if (event.isPrimary === false) return;
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        focusHandle(event.currentTarget);
        const point = horizontal ? event.clientX : event.clientY;
        resize.startDrag({
          id,
          start: point,
          sizes: [...splitter.size],
          startIndex: trigger.startIndex,
          endIndex: trigger.endIndex,
        });
        resize.onResizeStart?.();
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const drag = resize.getDrag();
        const root = resize.getRoot();
        if (!drag || drag.id !== id || !root || !trigger) return;
        const group = readGroupSize(root, splitter.orientation);
        if (group <= 0) return;
        const point = horizontal ? event.clientX : event.clientY;
        const rtl =
          horizontal && root.ownerDocument.defaultView?.getComputedStyle(root).direction === "rtl";
        const signed = (rtl ? -1 : 1) * (point - drag.start);
        resize.runResize(
          drag.sizes,
          drag.startIndex,
          drag.endIndex,
          (signed / group) * 100,
          id,
          "pointer",
        );
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        endDrag();
      }}
      onLostPointerCapture={(event) => {
        onLostPointerCapture?.(event);
        endDrag();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || disabled || !trigger) return;
        const root = resize.getRoot();
        const rtl =
          horizontal &&
          root != null &&
          root.ownerDocument.defaultView?.getComputedStyle(root).direction === "rtl";
        const step = event.shiftKey ? 10 : resize.keyboardStep;

        if (event.key === "Enter") {
          event.preventDefault();
          const panel = panels[trigger.startIndex];
          if (!panel?.collapsible) return;
          if (splitter.isPanelCollapsed(panel.id)) splitter.expandPanel(panel.id);
          else splitter.collapsePanel(panel.id);
          return;
        }

        if (event.key === "F6") {
          event.preventDefault();
          const owner = CSS.escape(rootId);
          const triggers = root
            ? [
                ...root.querySelectorAll<HTMLElement>(
                  `[data-ownedby="${owner}"][data-part="resize-trigger"]:not([data-disabled="true"])`,
                ),
              ]
            : [];
          const index = triggers.findIndex((element) => element === event.currentTarget);
          if (triggers.length === 0) return;
          const nextIndex = event.shiftKey
            ? index <= 0
              ? triggers.length - 1
              : index - 1
            : index === -1 || index === triggers.length - 1
              ? 0
              : index + 1;
          triggers[nextIndex]?.focus();
          return;
        }

        let delta = 0;
        switch (event.key) {
          case "ArrowLeft":
            if (!horizontal) return;
            delta = rtl ? step : -step;
            break;
          case "ArrowRight":
            if (!horizontal) return;
            delta = rtl ? -step : step;
            break;
          case "ArrowUp":
            if (horizontal) return;
            delta = -step;
            break;
          case "ArrowDown":
            if (horizontal) return;
            delta = step;
            break;
          case "Home":
            delta = rtl && horizontal ? 100 : -100;
            break;
          case "End":
            delta = rtl && horizontal ? -100 : 100;
            break;
          default:
            return;
        }

        event.preventDefault();
        resize.onResizeStart?.();
        const next = resize.runResize(
          splitter.size,
          trigger.startIndex,
          trigger.endIndex,
          delta,
          id,
          "keyboard",
        );
        resize.onResizeEnd?.({ size: next, resizeTriggerId: id });
      }}
    >
      {children ?? (
        <>
          <SplitterResizeTriggerSeparator />
          <SplitterResizeTriggerIndicator />
        </>
      )}
    </div>
  );
}

export function SplitterResizeTriggerSeparator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const splitter = useSplitterContext();
  const horizontal = splitter.orientation === "horizontal";
  return (
    <span
      {...props}
      aria-hidden
      data-part="resize-trigger-separator"
      data-orientation={splitter.orientation}
      className={cn(
        "pointer-events-none absolute bg-border group-hover:bg-primary group-focus-visible:bg-primary group-data-[dragging=true]:bg-primary group-data-[disabled=true]:bg-border",
        horizontal
          ? "inset-y-0 left-1/2 w-px -translate-x-1/2"
          : "inset-x-0 top-1/2 h-px -translate-y-1/2",
        className,
      )}
    />
  );
}

export function SplitterResizeTriggerIndicator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const splitter = useSplitterContext();
  const horizontal = splitter.orientation === "horizontal";
  return (
    <span
      {...props}
      aria-hidden
      data-part="resize-trigger-indicator"
      data-orientation={splitter.orientation}
      className={cn(
        "relative z-10 rounded-full border border-border bg-card shadow-sm group-hover:border-primary group-focus-visible:border-primary group-focus-visible:ring-4 group-focus-visible:ring-primary/25 group-data-[dragging=true]:border-primary group-data-[dragging=true]:ring-4 group-data-[dragging=true]:ring-primary/25 group-data-[disabled=true]:invisible",
        horizontal ? "h-6 w-2" : "h-2 w-6",
        className,
      )}
    />
  );
}
