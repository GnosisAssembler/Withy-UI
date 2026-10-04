import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Timeline } from "./timeline";

describe("Timeline", () => {
  it("lists events in order with their times", () => {
    render(
      <Timeline
        items={[
          {
            id: "1",
            time: "Mar 2",
            title: "Account created",
            description: "Joined the workspace.",
          },
          { id: "2", time: "Mar 6", title: "Payment received", tone: "success" },
        ]}
      />,
    );

    const titles = screen.getAllByRole("listitem").map((item) => item.textContent);
    expect(titles[0]).toContain("Account created");
    expect(titles[0]).toContain("Mar 2");
    expect(titles[1]).toContain("Payment received");
    expect(screen.getByText("Joined the workspace.")).toBeInTheDocument();
  });
});
