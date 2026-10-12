import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./progress";

function indicator(name: string) {
  const bar = screen.getByRole("progressbar", { name });
  const fill = bar.firstElementChild;
  if (!(fill instanceof HTMLElement)) throw new Error("Missing progress indicator");
  return { bar, fill };
}

describe("Progress", () => {
  it("eases a clamped value across the bar", () => {
    const { rerender } = render(<Progress value={62} aria-label="Exporting report" />);
    const { bar, fill } = indicator("Exporting report");

    expect(bar).toHaveAttribute("aria-valuenow", "62");
    expect(bar).toHaveAttribute("data-state", "loading");
    expect(fill).toHaveClass("bg-primary", "withy-progress-fill");
    expect(fill).toHaveStyle({ width: "62%" });

    rerender(<Progress value={140} aria-label="Exporting report" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-state", "complete");

    rerender(<Progress value={Number.NaN} aria-label="Exporting report" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("paints the bar with a status color", () => {
    render(<Progress value={10} color="danger" className="max-w-xs" aria-label="Upload failed" />);
    const { bar, fill } = indicator("Upload failed");
    expect(bar).toHaveClass("max-w-xs");
    expect(fill).toHaveClass("bg-danger");
  });

  it("moves stripes and a shimmer while the task is unfinished", () => {
    const { rerender } = render(
      <Progress value={62} animation="stripes" aria-label="Uploading files" />,
    );
    expect(indicator("Uploading files").fill).toHaveClass(
      "withy-progress-fill",
      "withy-progress-stripes",
    );

    rerender(<Progress value={40} animation="shimmer" color="info" aria-label="Uploading files" />);
    expect(indicator("Uploading files").fill).toHaveClass(
      "bg-info",
      "withy-progress-fill",
      "withy-progress-shimmer",
    );

    rerender(<Progress value={100} animation="stripes" aria-label="Uploading files" />);
    const done = indicator("Uploading files");
    expect(done.fill).toHaveClass("withy-progress-fill");
    expect(done.fill).not.toHaveClass("withy-progress-stripes", "withy-progress-shimmer");
    expect(done.fill).toHaveStyle({ width: "100%" });
  });

  it("travels when the end is not known", () => {
    render(<Progress value={80} animation="indeterminate" aria-label="Preparing export" />);
    const { bar, fill } = indicator("Preparing export");

    expect(bar).toHaveAttribute("data-state", "indeterminate");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(fill).toHaveClass("withy-progress-indeterminate", "bg-primary");
    expect(fill).not.toHaveClass("withy-progress-fill");
    expect(fill.style.width).toBe("");
  });

  it("sets the animation length and lets a style override it", () => {
    const { rerender } = render(
      <Progress value={20} duration={900} aria-label="Exporting report" />,
    );
    expect(
      screen.getByRole("progressbar").style.getPropertyValue("--withy-progress-duration"),
    ).toBe("900ms");

    rerender(
      <Progress
        value={20}
        duration={900}
        style={{ "--withy-progress-duration": "200ms" } as React.CSSProperties}
        aria-label="Exporting report"
      />,
    );
    expect(
      screen.getByRole("progressbar").style.getPropertyValue("--withy-progress-duration"),
    ).toBe("200ms");
  });
});
