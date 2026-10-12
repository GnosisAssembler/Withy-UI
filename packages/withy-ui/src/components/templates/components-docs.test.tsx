import { readFileSync } from "node:fs";
import path from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WithyProvider } from "../theme/withy-provider";
import { componentDocs, ComponentsDocsTemplate } from "./components-docs";

vi.mock("echarts/core", () => ({
  use: vi.fn(),
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    isDisposed: () => false,
  })),
}));

vi.mock("echarts/charts", () => ({
  BarChart: {},
  HeatmapChart: {},
  LineChart: {},
  PieChart: {},
  RadarChart: {},
  CustomChart: {},
  ScatterChart: {},
  TreemapChart: {},
}));

vi.mock("echarts/components", () => ({
  GridComponent: {},
  LegendComponent: {},
  RadarComponent: {},
  TooltipComponent: {},
  VisualMapComponent: {},
}));

vi.mock("echarts/renderers", () => ({
  CanvasRenderer: {},
}));

const setupExports = new Set([
  "AppShell",
  "SproutMark",
  "ThemeProvider",
  "ToastProvider",
  "TooltipProvider",
  "WithyLink",
  "WithyLinkProvider",
  "WithyNavigationProvider",
  "WithyProvider",
  "cn",
  "spaceRanges",
  "spaceScale",
  "themeBootScript",
  "themeStorageKey",
  "themes",
  "useTheme",
  "useWithyNavigation",
]);

function rootValueExports() {
  const source = readFileSync(path.resolve(__dirname, "../../index.ts"), "utf8");
  const names = [...source.matchAll(/export\s*\{([^}]*)\}/g)].flatMap((match) =>
    (match[1] ?? "")
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part && !part.startsWith("type "))
      .map((part) => part.split(/\s+as\s+/).at(-1) ?? part),
  );
  return [...new Set(names)];
}

const categoryOrder = ["Layout", "Atoms", "Molecules", "Organisms", "Widgets", "Charts", "Blocks"];

describe("ComponentsDocsTemplate", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("documents every component the package exports", () => {
    const documented = new Set<string>(componentDocs.flatMap((doc) => doc.imports));
    const missing = rootValueExports().filter(
      (name) => !setupExports.has(name) && !documented.has(name),
    );
    expect(missing).toEqual([]);
  });

  it("lists every component and the sample blocks", () => {
    render(
      <WithyProvider pathname="/components">
        <ComponentsDocsTemplate />
      </WithyProvider>,
    );

    const sidebar = screen.getByRole("navigation", { name: "Components" });
    expect(within(sidebar).getAllByRole("link")).toHaveLength(componentDocs.length + 1);
    expect(within(sidebar).getByRole("link", { name: "Overview" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const sidebarCategories = within(sidebar).getAllByRole("button");
    const overview = screen.getByRole("region", { name: "Component categories" });
    expect(within(overview).queryAllByRole("button")).toHaveLength(0);
    expect(
      within(overview)
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(categoryOrder);
    for (const [index, label] of categoryOrder.entries()) {
      expect(sidebarCategories[index]).toHaveAccessibleName(new RegExp(`^${label}\\b`));
      expect(sidebarCategories[index]).toHaveAttribute("aria-expanded", "true");
    }
    expect(within(sidebar).queryByText("No pages yet.")).not.toBeInTheDocument();
    expect(within(overview).queryByText("No pages yet.")).not.toBeInTheDocument();
    expect(sidebarCategories[categoryOrder.indexOf("Blocks")]).toHaveAccessibleName(
      /Blocks\s+10components/,
    );
    expect(within(sidebar).getByRole("link", { name: "Registration form" })).toHaveAttribute(
      "href",
      "/components/registration-form",
    );
    expect(within(overview).getByRole("link", { name: "Sign in" })).toBeInTheDocument();
    expect(within(overview).getByRole("link", { name: "Settings screen" })).toBeInTheDocument();
    expect(sidebarCategories[categoryOrder.indexOf("Charts")]).toHaveAccessibleName(
      /Charts\s+12components/,
    );
    expect(within(sidebar).getByRole("link", { name: "Area chart" })).toHaveAttribute(
      "href",
      "/components/area-chart",
    );
    expect(within(overview).getByRole("link", { name: "Bubble chart" })).toBeInTheDocument();
    expect(sidebarCategories[categoryOrder.indexOf("Widgets")]).toHaveAccessibleName(
      /Widgets\s+12components/,
    );
    expect(within(sidebar).getByRole("link", { name: "Sparkline" })).toHaveAttribute(
      "href",
      "/components/sparkline",
    );
    expect(within(sidebar).getByRole("link", { name: "Metric tile" })).toHaveAttribute(
      "href",
      "/components/metric-tile",
    );
    expect(within(sidebar).getByRole("link", { name: "Revenue map" })).toHaveAttribute(
      "href",
      "/components/revenue-map",
    );
    expect(within(overview).getByRole("link", { name: "Sparkline" })).toBeInTheDocument();
    expect(within(overview).getByRole("link", { name: "Metric tile" })).toBeInTheDocument();
  });

  it("folds a category closed and open again", async () => {
    const user = userEvent.setup();
    render(
      <WithyProvider pathname="/components">
        <ComponentsDocsTemplate />
      </WithyProvider>,
    );

    const sidebar = screen.getByRole("navigation", { name: "Components" });
    const overview = screen.getByRole("region", { name: "Component categories" });
    const layout = within(sidebar).getAllByRole("button")[0];
    expect(layout).toHaveAccessibleName(/Layout/);

    await user.click(layout);
    expect(layout).toHaveAttribute("aria-expanded", "false");
    expect(within(sidebar).queryByRole("link", { name: "App shell" })).not.toBeInTheDocument();
    expect(within(overview).getByRole("link", { name: "Box" })).toBeInTheDocument();
    expect(within(sidebar).getByRole("link", { name: "Button" })).toBeInTheDocument();

    await user.click(layout);
    expect(layout).toHaveAttribute("aria-expanded", "true");
    expect(within(sidebar).getByRole("link", { name: "App shell" })).toBeInTheDocument();
  });

  it("filters the overview and leaves the sidebar list in place", async () => {
    const user = userEvent.setup();
    render(
      <WithyProvider pathname="/components">
        <ComponentsDocsTemplate />
      </WithyProvider>,
    );

    const overview = screen.getByRole("region", { name: "Component categories" });
    const search = screen.getByRole("textbox", { name: "Search components" });
    await user.type(search, "button");

    expect(within(overview).getByRole("link", { name: "Button" })).toBeInTheDocument();
    expect(within(overview).getByRole("link", { name: "Icon button" })).toBeInTheDocument();
    expect(within(overview).queryByRole("link", { name: "Tag" })).not.toBeInTheDocument();
    expect(within(overview).queryByRole("link", { name: "App shell" })).not.toBeInTheDocument();
    expect(within(overview).queryByRole("heading", { name: "Layout" })).not.toBeInTheDocument();
    expect(
      within(screen.getByRole("navigation", { name: "Components" })).getByRole("link", {
        name: "App shell",
      }),
    ).toBeInTheDocument();

    await user.clear(search);
    expect(within(overview).getByRole("heading", { name: "Layout" })).toBeInTheDocument();
    expect(within(overview).getByRole("link", { name: "App shell" })).toBeInTheDocument();

    await user.type(search, "zzzz");
    expect(within(overview).getByRole("status")).toHaveTextContent("No components match “zzzz”.");
    expect(within(overview).queryByRole("link", { name: "Button" })).not.toBeInTheDocument();
  });

  it("checks the registration form on submit", async () => {
    const user = userEvent.setup();
    render(
      <WithyProvider pathname="/components/registration-form">
        <ComponentsDocsTemplate component="registration-form" />
      </WithyProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Join workspace" }));
    expect(screen.getByText("Enter a first name.")).toBeInTheDocument();
    expect(screen.getByText("Enter a last name.")).toBeInTheDocument();
    expect(screen.getByText("Enter an email address, such as ivy@withy.dev.")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "First name" }), "Ivy");
    await user.type(screen.getByRole("textbox", { name: "Last name" }), "Calder");
    await user.type(screen.getByRole("textbox", { name: "Email" }), "ivy@withy.dev");
    await user.click(screen.getByRole("button", { name: "Join workspace" }));
    expect(screen.getByText("Registration saved on this page.")).toBeInTheDocument();
  });

  it.each(componentDocs.map((doc) => [doc.name, doc.slug] as const))(
    "renders the %s page",
    (name, slug) => {
      render(
        <WithyProvider pathname={`/components/${slug}`}>
          <ComponentsDocsTemplate component={slug} />
        </WithyProvider>,
      );

      expect(screen.getAllByRole("heading", { name, level: 1 }).length).toBeGreaterThan(0);
      expect(
        within(screen.getByRole("navigation", { name: "Components" })).getByRole("link", {
          name,
        }),
      ).toHaveAttribute("aria-current", "page");
    },
  );
});
