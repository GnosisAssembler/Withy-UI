import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { stateSales } from "../../data/widgets";
import { RevenueMap } from "./revenue-map";

function topStateNames() {
  const table = screen.getByRole("table", { name: "Top states by earnings" });
  return within(table)
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell")[0]?.textContent);
}

describe("RevenueMap", () => {
  it("lists the five states with the highest earnings", () => {
    render(<RevenueMap rows={stateSales} />);

    expect(screen.getByRole("heading", { name: "Sales revenue" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Country" })).toHaveTextContent("USA");
    expect(screen.getByRole("group", { name: "United States sales map" })).toBeInTheDocument();
    expect(topStateNames()).toEqual(["California", "Florida", "Texas", "Wyoming", "New York"]);
    expect(
      within(screen.getByRole("table", { name: "Top states by earnings" })).queryByRole("cell", {
        name: "Washington",
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "California · $150,200.80" })).toHaveAttribute(
      "fill",
      "var(--primary)",
    );
    expect(screen.getByRole("button", { name: "Alabama · no orders" })).toHaveAttribute(
      "fill",
      "color-mix(in srgb, var(--primary) 12%, var(--card))",
    );
  });

  it("shows the earnings of the state under the pointer", async () => {
    const user = userEvent.setup();
    render(<RevenueMap rows={stateSales} />);

    await user.hover(screen.getByRole("button", { name: "California · $150,200.80" }));

    expect(screen.getByText("California · $150,200.80")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "California · $150,200.80" })).toHaveAttribute(
      "stroke",
      "var(--heading)",
    );
  });

  it("moves between states with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<RevenueMap rows={stateSales} />);

    await user.tab();
    await user.tab();

    expect(screen.getByRole("button", { name: "Alabama · no orders" })).toHaveFocus();
    expect(screen.getByText("Alabama · no orders")).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Alaska · no orders" })).toHaveFocus();
    expect(screen.getByText("Alaska · no orders")).toBeInTheDocument();

    await user.keyboard("{End}");
    expect(screen.getByRole("button", { name: "Wyoming · $132,050.00" })).toHaveFocus();
    expect(screen.getByText("Wyoming · $132,050.00")).toBeInTheDocument();
  });

  it("says when a focused state has no orders", async () => {
    const user = userEvent.setup();
    render(<RevenueMap rows={[{ id: "CA", orders: 10, earnings: 50 }]} />);

    await user.tab();
    await user.tab();
    expect(screen.getByText("Alabama · no orders")).toBeInTheDocument();
  });

  it("tells an empty map apart from one with sales", () => {
    render(<RevenueMap rows={[]} title="Regional sales" label="Regional sales map" />);

    expect(screen.getByRole("heading", { name: "Regional sales" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Regional sales map" })).toBeInTheDocument();
    expect(screen.getByText("No sales for these states.")).toBeInTheDocument();
    expect(screen.getByText("Choose a state")).toBeInTheDocument();
  });
});
