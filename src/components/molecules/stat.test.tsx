import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stat } from "./stat";

describe("Stat", () => {
  it("shows the metric, direction, and hint", () => {
    render(
      <Stat
        title="Conversion Rate"
        value="0.81%"
        change={{ value: "1.2%", direction: "up", hint: "than last week" }}
      />,
    );

    expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
    expect(screen.getByText("0.81%")).toBeInTheDocument();
    expect(screen.getByText("1.2%")).toBeInTheDocument();
    expect(screen.getByText(/than last week/)).toBeInTheDocument();
  });
});
