import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FileText } from "lucide-react";
import { Icon } from "../atoms/icon";
import { TooltipProvider } from "../molecules/tooltip";
import { BarList } from "./bar-list";

const pages = [
  { name: "/changelog", value: 980 },
  { name: "/pricing", value: 2480, href: "/pricing" },
  { name: "/docs", value: 980, color: "teal" as const },
];

function renderList(ui: React.ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

function fill(name: string) {
  const bar = screen.getByText(name).closest("li")?.querySelector("[aria-hidden='true']");
  if (!bar) throw new Error(`Missing bar for ${name}`);
  return bar;
}

describe("BarList", () => {
  it("ranks rows from the largest value and sizes each bar to that value", () => {
    renderList(<BarList label="Top pages" data={pages} />);

    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.textContent?.replaceAll(/\s/g, ""))).toEqual([
      "/pricing2,480",
      "/changelog980",
      "/docs980",
    ]);
    expect(fill("/pricing")).toHaveStyle({ width: "100%" });
    expect(fill("/changelog")).toHaveStyle({ width: "39.516129032258064%" });
    expect(fill("/docs")).toHaveAttribute("style", expect.stringContaining("var(--teal)"));
    expect(screen.getByRole("link", { name: "/pricing, 2,480" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(screen.getByRole("listitem", { name: "/docs, 980" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Top pages" })).toBeInTheDocument();
  });

  it("keeps the given order when sorting is off", () => {
    renderList(<BarList label="Top pages" data={pages} sortOrder="none" />);

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("/changelog");
    expect(items[1]).toHaveTextContent("/pricing");
    expect(items[2]).toHaveTextContent("/docs");
  });

  it("sorts from the smallest value and shows an icon", () => {
    renderList(
      <BarList
        label="Top pages"
        sortOrder="ascending"
        data={[
          { name: "/pricing", value: 20, icon: <Icon icon={FileText} /> },
          { name: "/docs", value: 5 },
        ]}
      />,
    );

    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("/docs");
    expect(items[1]).toHaveTextContent("/pricing");
    expect(items[1]?.querySelector("svg")).toBeInTheDocument();
  });

  it("renders an empty list", () => {
    renderList(<BarList label="Top pages" data={[]} />);

    expect(screen.getByRole("list", { name: "Top pages" })).toBeEmptyDOMElement();
  });
});
