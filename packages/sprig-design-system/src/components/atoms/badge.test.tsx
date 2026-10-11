import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("shows the status label", () => {
    render(<Badge color="success">Paid</Badge>);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });
});
