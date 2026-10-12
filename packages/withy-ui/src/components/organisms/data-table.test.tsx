import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { holdings } from "../../data/holdings";
import { columnMatches } from "./data-table-filters";
import { DataTable, type Column } from "./data-table";
import { HoldingsTable } from "./holdings-table";

type Person = {
  id: string;
  name: string;
  status: "Live" | "Inactive";
  region: string;
  costs: number;
  edited: string;
};

const people: Person[] = [
  {
    id: "1",
    name: "John Doe",
    status: "Live",
    region: "US-West 1",
    costs: 5400,
    edited: "2023-09-23",
  },
  {
    id: "2",
    name: "Wei Zhang",
    status: "Inactive",
    region: "US-West 2",
    costs: 0,
    edited: "2022-11-10",
  },
  {
    id: "3",
    name: "Nina Müller",
    status: "Live",
    region: "EU-North 1",
    costs: 7600,
    edited: "2022-01-23",
  },
];

const directoryColumns: Column<Person>[] = [
  {
    key: "name",
    header: "Owner",
    hideable: false,
    sortValue: (row) => row.name,
    cell: (row) => row.name,
  },
  {
    key: "status",
    header: "Status",
    filter: { type: "select", value: (row) => row.status },
    cell: (row) => row.status,
  },
  {
    key: "region",
    header: "Region",
    filter: { type: "select", value: (row) => row.region },
    cell: (row) => row.region,
  },
  {
    key: "costs",
    header: "Costs",
    filter: { type: "number", value: (row) => row.costs },
    sortValue: (row) => row.costs,
    cell: (row) => row.costs,
  },
  {
    key: "edited",
    header: "Edited",
    filter: { type: "date", value: (row) => row.edited },
    cell: (row) => row.edited,
  },
];

describe("DataTable", () => {
  it("shows ticker rows and filters them down", async () => {
    const user = userEvent.setup();
    render(<HoldingsTable rows={holdings} />);

    expect(screen.getByText("DAL")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Total rows: 12");

    await user.click(screen.getByRole("button", { name: "Filter Instrument" }));
    await user.type(screen.getByRole("textbox", { name: "Instrument contains" }), "Bond");

    expect(screen.getByText("TLT")).toBeInTheDocument();
    expect(screen.queryByText("DAL")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Rows: 3");
    expect(screen.getByRole("status")).toHaveTextContent("Total rows: 12");

    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("DAL")).toBeInTheDocument();
  });

  it("tells an empty table apart from one with no matches", () => {
    render(
      <DataTable
        caption="Invoices"
        rows={[]}
        getRowKey={(row: { id: string }) => row.id}
        columns={[{ key: "id", header: "Invoice", cell: (row) => row.id }]}
        empty="No invoices yet."
      />,
    );

    expect(screen.getByText("No invoices yet.")).toBeInTheDocument();
    expect(screen.queryByText("No rows match these filters.")).not.toBeInTheDocument();
  });

  it("filters by choice, number, and search, then clears them", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        caption="People"
        rows={people}
        getRowKey={(row) => row.id}
        columns={directoryColumns}
        searchPlaceholder="Search by owner"
        searchValue={(row) => row.name}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filter by Status" }));
    await user.click(screen.getByRole("radio", { name: "Inactive" }));
    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(screen.getByText("Wei Zhang")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Rows: 1");

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filter by Costs" }));
    await user.click(screen.getByRole("radio", { name: "is greater than" }));
    await user.type(screen.getByRole("spinbutton", { name: "Value" }), "1000");
    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(screen.queryByText("Wei Zhang")).not.toBeInTheDocument();
    expect(screen.getByText("Nina Müller")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await user.type(screen.getByRole("searchbox", { name: "Search by owner" }), "Nina");
    expect(screen.getByText("Nina Müller")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("pages through rows and reports the visible range", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        caption="People"
        rows={people}
        getRowKey={(row) => row.id}
        pageSize={2}
        columns={[{ key: "name", header: "Owner", cell: (row) => row.name }]}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Showing 1–2 of 3");
    expect(screen.getByText("Wei Zhang")).toBeInTheDocument();
    expect(screen.queryByText("Nina Müller")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByRole("status")).toHaveTextContent("Showing 3–3 of 3");
    expect(screen.getByText("Nina Müller")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "First page" })).toBeEnabled();
  });

  it("sorts from the column header", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        caption="People"
        rows={people}
        getRowKey={(row) => row.id}
        columns={[
          { key: "name", header: "Owner", sortValue: (row) => row.name, cell: (row) => row.name },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Owner" }));

    const bodyRows = within(screen.getAllByRole("rowgroup")[1]).getAllByRole("row");
    expect(bodyRows.map((row) => row.textContent)).toEqual([
      "John Doe",
      "Nina Müller",
      "Wei Zhang",
    ]);
  });

  it("shows a command bar for the selected rows", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <DataTable
        caption="People"
        rows={people}
        getRowKey={(row) => row.id}
        columns={directoryColumns}
        selectable
        bulkActions={[{ id: "delete", label: "Delete", shortcut: "d", onSelect: onDelete }]}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("0 of 3 rows selected.");
    await user.click(screen.getAllByRole("checkbox", { name: "Select row" })[0]);

    const bar = screen.getByRole("toolbar", { name: "Selected rows" });
    expect(bar).toHaveTextContent("1 selected");
    await user.click(within(bar).getByRole("button", { name: /Delete/ }));
    expect(onDelete).toHaveBeenCalledWith([people[0]]);

    await user.click(within(bar).getByRole("button", { name: /Reset/ }));
    expect(screen.queryByRole("toolbar", { name: "Selected rows" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("checkbox", { name: "Select row" })[0]).not.toBeChecked();
  });

  it("runs a bulk shortcut and opens the details drawer", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <DataTable
        caption="People"
        rows={people}
        getRowKey={(row) => row.id}
        columns={directoryColumns}
        selectable
        columnVisibility
        rowLabel={(row) => row.name}
        bulkActions={[{ id: "edit", label: "Edit", shortcut: "e", onSelect: onEdit }]}
        detailsTitle={(row) => row.name}
        details={(row) => <p>Region {row.region}</p>}
      />,
    );

    await user.click(screen.getByRole("button", { name: "View" }));
    await user.click(screen.getByRole("checkbox", { name: "Region" }));
    expect(screen.queryByRole("columnheader", { name: "Region" })).not.toBeInTheDocument();

    await user.click(screen.getAllByRole("checkbox", { name: "Select row" })[1]);
    await user.keyboard("e");
    expect(onEdit).toHaveBeenCalledWith([people[1]]);

    await user.click(screen.getByRole("button", { name: "Actions for Wei Zhang" }));
    await user.click(screen.getByRole("menuitem", { name: "View details" }));
    expect(screen.getByRole("dialog", { name: "Wei Zhang" })).toHaveTextContent("US-West 2");
  });
});

describe("column filters", () => {
  const column: Column<Person> = {
    key: "edited",
    header: "Edited",
    filter: { type: "date", value: (row) => row.edited },
    cell: (row) => row.edited,
  };

  it("matches dates and numbers by condition", () => {
    expect(
      columnMatches(column, people[0], {
        kind: "date",
        condition: "after",
        value: "2023-01-01",
        valueTo: null,
      }),
    ).toBe(true);
    expect(
      columnMatches(column, people[2], {
        kind: "date",
        condition: "after",
        value: "2023-01-01",
        valueTo: null,
      }),
    ).toBe(false);
    expect(
      columnMatches(
        {
          key: "costs",
          header: "Costs",
          filter: { type: "number", value: (row: Person) => row.costs },
        },
        people[1],
        { kind: "number", condition: "eq", value: 0, valueTo: null },
      ),
    ).toBe(true);
  });
});
