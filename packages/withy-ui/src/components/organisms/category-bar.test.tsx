import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "../molecules/tooltip";
import { CategoryBar } from "./category-bar";

const plans = [
  { name: "Free", value: 420, color: "cyan" as const },
  { name: "Pro", value: 260, color: "primary" as const },
  { name: "Business", value: 140, color: "indigo" as const },
];

function renderBar(ui: React.ReactElement) {
  return render(
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      {ui}
    </TooltipProvider>,
  );
}

describe("CategoryBar", () => {
  it("splits one bar by share and lists each category", () => {
    renderBar(
      <CategoryBar
        label="Accounts by plan"
        segments={plans}
        marker={{ value: 700, label: "Paid goal" }}
      />,
    );

    const bar = screen.getByRole("img", { name: "Accounts by plan" });
    const widths = [...bar.querySelectorAll("span")].map((segment) =>
      Number.parseFloat(segment.style.width),
    );
    expect(widths[0]).toBeCloseTo(51.22, 1);
    expect(widths[1]).toBeCloseTo(31.71, 1);
    expect(widths[2]).toBeCloseTo(17.07, 1);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("51%")).toBeInTheDocument();
    expect(screen.getByText("32%")).toBeInTheDocument();
    expect(screen.getByText("17%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Paid goal: 700" })).toHaveAttribute(
      "style",
      expect.stringContaining("85.36585365853658%"),
    );
  });

  it("shows the marker value in a tooltip", async () => {
    const user = userEvent.setup();
    renderBar(
      <CategoryBar
        label="Accounts by plan"
        segments={plans}
        marker={{ value: 700, label: "Paid goal" }}
      />,
    );

    await user.hover(screen.getByRole("button", { name: "Paid goal: 700" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Paid goal: 700");
  });

  it("puts the breakdown on the bar when the legend is hidden", () => {
    renderBar(<CategoryBar label="Accounts by plan" segments={plans} legend={false} />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Accounts by plan. Free 420, Pro 260, Business 140" }),
    ).toBeInTheDocument();
  });

  it("keeps a marker inside the track when the value is past the total", () => {
    renderBar(
      <CategoryBar
        label="Storage"
        segments={[{ name: "Used", value: 40 }]}
        marker={{ value: 80 }}
      />,
    );

    expect(screen.getByRole("button", { name: "80" }).getAttribute("style")).toContain(
      "clamp(0.5rem, 100%",
    );
  });
});
