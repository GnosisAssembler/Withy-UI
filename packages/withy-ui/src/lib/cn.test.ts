import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("merges tailwind classes and lets the later one win", () => {
    expect(cn("px-2 text-sm", "px-4")).toContain("px-4");
    expect(cn("px-2 text-sm", "px-4")).not.toContain("px-2");
  });
});
