import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "./tooltip";
import { Tracker } from "./tracker";

const blocks = [
  { color: "success" as const, tooltip: "Operational" },
  { color: "danger" as const, tooltip: "Down for 14 minutes" },
  { tooltip: "No data" },
];

function renderTracker(ui: React.ReactElement) {
  return render(
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      {ui}
    </TooltipProvider>,
  );
}

describe("Tracker", () => {
  it("names the row and each block, and uses the default color when one is omitted", () => {
    renderTracker(<Tracker label="API uptime" data={blocks} />);

    expect(screen.getByRole("group", { name: "API uptime" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Operational" })).toHaveClass(
      "bg-success",
      "rounded-l-sm",
    );
    expect(screen.getByRole("button", { name: "Down for 14 minutes" })).toHaveClass("bg-danger");
    expect(screen.getByRole("button", { name: "Down for 14 minutes" })).not.toHaveClass(
      "rounded-l-sm",
      "rounded-r-sm",
    );
    expect(screen.getByRole("button", { name: "No data" })).toHaveClass("bg-muted", "rounded-r-sm");
    expect(screen.getByRole("button", { name: "Operational" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("button", { name: "Down for 14 minutes" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("uses defaultColor and dims blocks when the hover effect is on", () => {
    renderTracker(
      <Tracker
        label="API uptime"
        defaultColor="info"
        hoverEffect
        data={[{ tooltip: "Maintenance" }]}
      />,
    );

    const block = screen.getByRole("button", { name: "Maintenance" });
    expect(block).toHaveClass("bg-info", "rounded-l-sm", "rounded-r-sm", "hover:opacity-50");
  });

  it("shows the block status in a tooltip", async () => {
    const user = userEvent.setup();
    renderTracker(<Tracker label="API uptime" data={blocks} />);

    await user.hover(screen.getByRole("button", { name: "Down for 14 minutes" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Down for 14 minutes");
  });

  it("keeps the status visible after a click", async () => {
    const user = userEvent.setup();
    renderTracker(<Tracker label="API uptime" data={blocks} />);

    await user.click(screen.getByRole("button", { name: "Down for 14 minutes" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Down for 14 minutes");
  });

  it("moves between named blocks with the arrow keys", async () => {
    const user = userEvent.setup();
    renderTracker(
      <Tracker
        label="API uptime"
        data={[
          { color: "success", tooltip: "Operational" },
          { color: "neutral" },
          { color: "danger", tooltip: "Down for 14 minutes" },
          { color: "warning", tooltip: "Degraded response time" },
        ]}
      />,
    );

    const first = screen.getByRole("button", { name: "Operational" });
    first.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Down for 14 minutes" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    const last = screen.getByRole("button", { name: "Degraded response time" });
    expect(last).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(last).toHaveFocus();
    await user.keyboard("{Home}");
    expect(first).toHaveFocus();
    await user.keyboard("{End}");
    expect(last).toHaveFocus();
    expect(screen.queryByRole("button", { name: "Block 2" })).not.toBeInTheDocument();
  });

  it("renders an empty track and keeps a custom height", () => {
    const { container } = renderTracker(
      <Tracker label="API uptime" data={[]} className="h-6 max-w-md" />,
    );

    const row = screen.getByRole("group", { name: "API uptime" });
    expect(row).toHaveClass("h-6", "max-w-md");
    expect(row).not.toHaveClass("h-8");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.querySelector(".bg-muted")).toHaveClass("rounded-sm");
  });

  it("lets a parent handle the key first", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn((event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") event.preventDefault();
    });
    renderTracker(<Tracker label="API uptime" data={blocks} onKeyDown={onKeyDown} />);

    screen.getByRole("button", { name: "Operational" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onKeyDown).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Operational" })).toHaveFocus();
  });
});
