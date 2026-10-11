import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PulseDot } from "../atoms/pulse-dot";
import { AdvancedTable } from "./advanced-table";
import { TooltipProvider } from "../molecules/tooltip";
import { ThemeProvider } from "../theme/theme-provider";

const rows = [
  { id: "1", name: "Ada", amount: 20 },
  { id: "2", name: "Bea", amount: 5 },
  { id: "3", name: "Cid", amount: 12 },
];

describe("PulseDot", () => {
  it("exposes a label for the live state", () => {
    render(<PulseDot color="success" label="Agents online" />);
    expect(screen.getByRole("img", { name: "Agents online" })).toBeInTheDocument();
  });
});

describe("AdvancedTable", () => {
  it("filters by search and sorts a column", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TooltipProvider>
          <AdvancedTable
            caption="People"
            rows={rows}
            getRowKey={(row) => row.id}
            searchValue={(row) => row.name}
            pageSize={10}
            columns={[
              {
                key: "name",
                header: "Name",
                sortable: true,
                sortValue: (row) => row.name,
                cell: (row) => row.name,
              },
              {
                key: "amount",
                header: "Amount",
                sortable: true,
                sortValue: (row) => row.amount,
                cell: (row) => row.amount,
              },
            ]}
          />
        </TooltipProvider>
      </ThemeProvider>,
    );

    await user.type(screen.getByRole("textbox", { name: "Search" }), "bea");
    expect(screen.getByText("Bea")).toBeInTheDocument();
    expect(screen.queryByText("Ada")).not.toBeInTheDocument();

    await user.clear(screen.getByRole("textbox", { name: "Search" }));
    await user.click(screen.getByRole("button", { name: "Amount" }));
    const amounts = screen.getAllByRole("cell").map((cell) => cell.textContent);
    expect(amounts.join(" ")).toMatch(/5[\s\S]*12[\s\S]*20/);
  });
});
