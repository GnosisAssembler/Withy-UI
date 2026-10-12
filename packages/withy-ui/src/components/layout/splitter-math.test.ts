import { describe, expect, it } from "vitest";
import {
  fallbackMetrics,
  layoutFromProps,
  orderedPanels,
  parsePanelSize,
  preservePixelSizes,
  resizeByDelta,
  resolveTrigger,
  type NormalizedPanel,
  type SplitterPanelConfig,
} from "./splitter-math";

const metrics = { ...fallbackMetrics, vw: 200, vh: 400 };

function panels(configs: SplitterPanelConfig[], rootPx = 1000) {
  return layoutFromProps({ panels: configs, rootPx, metrics }).panels;
}

function resize(
  sizes: number[],
  configs: SplitterPanelConfig[],
  delta: number,
  trigger: "pointer" | "keyboard" | "api" = "pointer",
  startIndex = 0,
  endIndex = 1,
) {
  return resizeByDelta({
    sizes,
    panels: panels(configs),
    startIndex,
    endIndex,
    delta,
    trigger,
  });
}

describe("splitter math", () => {
  it("parses percentages and css lengths", () => {
    expect(parsePanelSize(40, 1000, metrics)).toBe(40);
    expect(parsePanelSize("50%", 1000, metrics)).toBe(50);
    expect(parsePanelSize("200px", 1000, metrics)).toBe(20);
    expect(parsePanelSize("2rem", 1000, metrics)).toBe(3.2);
    expect(parsePanelSize("10vw", 1000, metrics)).toBe(2);
    expect(parsePanelSize("200px", 0, metrics)).toBeUndefined();
    expect(parsePanelSize("auto", 1000, metrics)).toBeUndefined();
  });

  it("shares unspecified space and converts a fixed length", () => {
    expect(
      layoutFromProps({
        panels: [{ id: "invoices" }, { id: "details" }],
        rootPx: 1000,
        metrics,
      }).sizes,
    ).toEqual([50, 50]);

    expect(
      layoutFromProps({
        panels: [{ id: "nav" }, { id: "main" }],
        sizes: ["200px"],
        rootPx: 1000,
        metrics,
      }).sizes,
    ).toEqual([20, 80]);
  });

  it("orders panels without mutating the list", () => {
    const input = [
      { id: "details", order: 2 },
      { id: "invoices", order: 1 },
    ];
    expect(orderedPanels(input).map((panel) => panel.id)).toEqual(["invoices", "details"]);
    expect(input.map((panel) => panel.id)).toEqual(["details", "invoices"]);
  });

  it("grows the leading panel and spills past a minimum", () => {
    expect(resize([50, 50], [{ id: "a" }, { id: "b" }], 10)).toEqual([60, 40]);
    expect(resize([50, 50], [{ id: "a" }, { id: "b", minSize: 45 }], 10)).toEqual([55, 45]);
    expect(resize([30, 40, 30], [{ id: "a" }, { id: "b", minSize: 35 }, { id: "c" }], 20)).toEqual([
      50, 35, 15,
    ]);
  });

  it("stops at a maximum and gives the unused space back", () => {
    expect(resize([50, 50], [{ id: "a", maxSize: 60 }, { id: "b" }], 20)).toEqual([60, 40]);
  });

  it("snaps a collapsible panel at the halfway point", () => {
    const configs: SplitterPanelConfig[] = [
      { id: "a", collapsible: true, collapsedSize: 0, minSize: 25 },
      { id: "b" },
    ];
    expect(resize([40, 60], configs, -20)).toEqual([25, 75]);
    expect(resize([40, 60], configs, -30)).toEqual([0, 100]);
  });

  it("jumps a collapsible panel open or shut from the keyboard", () => {
    const configs: SplitterPanelConfig[] = [
      { id: "a", collapsible: true, collapsedSize: 0, minSize: 20 },
      { id: "b" },
    ];
    expect(resize([0, 100], configs, 1, "keyboard")).toEqual([20, 80]);
    expect(resize([20, 80], configs, -1, "keyboard")).toEqual([0, 100]);
  });

  it("keeps a fixed panel's pixels when the group resizes", () => {
    const normalized: NormalizedPanel[] = panels([
      { id: "nav", resizeBehavior: "preserve-pixel-size" },
      { id: "main" },
    ]);
    expect(
      preservePixelSizes({
        panels: normalized,
        sizes: [20, 80],
        previousRoot: 1000,
        nextRoot: 500,
      }),
    ).toEqual([40, 60]);
  });

  it("resolves a trigger id to the panels on either side", () => {
    const list = [{ id: "invoices" }, { id: "details" }];
    expect(resolveTrigger("invoices:details", list)?.startId).toBe("invoices");
    expect(resolveTrigger("invoices:", list)?.endId).toBe("details");
    expect(resolveTrigger(":details", list)?.startId).toBe("invoices");
    expect(resolveTrigger("missing:details", list)).toBeNull();
  });
});
