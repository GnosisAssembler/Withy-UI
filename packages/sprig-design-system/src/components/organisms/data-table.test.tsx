import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { holdings } from "../../data/holdings";
import { HoldingsTable } from "./holdings-table";

describe("DataTable", () => {
  it("shows ticker rows and filters them down", async () => {
    const user = userEvent.setup();
    render(<HoldingsTable rows={holdings} />);

    expect(screen.getByText("DAL")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Total Rows: 12");

    await user.click(screen.getByRole("button", { name: "Filter Instrument" }));
    await user.type(screen.getByRole("textbox", { name: "Instrument contains" }), "Bond");

    expect(screen.getByText("TLT")).toBeInTheDocument();
    expect(screen.queryByText("DAL")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Rows: 3");
    expect(screen.getByRole("status")).toHaveTextContent("Total Rows: 12");
  });
});
