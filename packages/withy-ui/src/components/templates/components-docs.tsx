"use client";

import * as React from "react";
import {
  Atom,
  Blocks,
  ChartColumn,
  ChevronDown,
  Component,
  Layers,
  LayoutTemplate,
  SquareStack,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "../atoms/badge";
import { Link } from "../atoms/link";
import { ScrollArea } from "../atoms/scroll-area";
import { cn } from "../../lib/cn";
import { LayoutBody, LayoutContent, LayoutPane } from "../layout/layout";
import { CodeBlock } from "../molecules/code";
import { NavItem } from "../molecules/nav-item";
import { SearchInput } from "../molecules/search-input";
import { Truncate } from "../molecules/truncate";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "../organisms/card";
import { PageHeader } from "../organisms/page-header";
import { atomDocs } from "./component-docs/atoms";
import { blockDocs } from "./component-docs/blocks";
import { chartDocs } from "./component-docs/charts";
import { layoutDocs } from "./component-docs/layout";
import { moleculeDocs } from "./component-docs/molecules";
import { organismDocs } from "./component-docs/organisms";
import { widgetDocs } from "./component-docs/widgets";
import type { ComponentCategory, ComponentDoc } from "./component-docs/types";
import { DashboardShell } from "./dashboard-shell";

export const componentDocs = [
  ...layoutDocs,
  ...atomDocs,
  ...moleculeDocs,
  ...organismDocs,
  ...widgetDocs,
  ...chartDocs,
  ...blockDocs,
];

export type ComponentSlug = (typeof componentDocs)[number]["slug"];

const categoryStorageKey = "withy-ui.component-categories";

export const componentCategories: readonly {
  label: string;
  description: string;
  docs: readonly ComponentDoc[];
}[] = [
  {
    label: "Layout",
    description: "Pieces that pad, stack, and align regions, and the shell around a page.",
    docs: layoutDocs,
  },
  {
    label: "Atoms",
    description: "One control or one mark. Change an atom with its props.",
    docs: atomDocs,
  },
  {
    label: "Molecules",
    description: "Atoms that always travel together for one job.",
    docs: moleculeDocs,
  },
  {
    label: "Organisms",
    description: "Sections of a screen, built from molecules and atoms.",
    docs: organismDocs,
  },
  { label: "Widgets", description: "Ready-made dashboard cards.", docs: widgetDocs },
  { label: "Charts", description: "Charts that read the active skin.", docs: chartDocs },
  {
    label: "Blocks",
    description: "Sample pages for forms, members, settings, and sign-in.",
    docs: blockDocs,
  },
];

const categoryIcons: Record<string, { icon: LucideIcon; mark: string }> = {
  Layout: { icon: LayoutTemplate, mark: "bg-primary/15 text-primary" },
  Atoms: { icon: Atom, mark: "bg-indigo/15 text-indigo" },
  Molecules: { icon: Component, mark: "bg-cyan/20 text-cyan" },
  Organisms: { icon: Layers, mark: "bg-pink/20 text-pink" },
  Widgets: { icon: SquareStack, mark: "bg-warning/15 text-warning" },
  Charts: { icon: ChartColumn, mark: "bg-info/15 text-info" },
  Blocks: { icon: Blocks, mark: "bg-success/15 text-success" },
};

function CategoryIcon({ label, compact = false }: { label: string; compact?: boolean }) {
  const appearance = categoryIcons[label] ?? { icon: SquareStack, mark: "bg-muted text-text-2" };
  const Glyph = appearance.icon;
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-sm",
        compact ? "mt-0.5 size-6" : "size-8",
        appearance.mark,
      )}
    >
      <Glyph aria-hidden className={compact ? "size-3.5" : "size-4"} />
    </span>
  );
}

const layerNames: Record<ComponentCategory, string> = {
  Atoms: "Atom",
  Molecules: "Molecule",
  Organisms: "Organism",
  Layout: "Layout",
  Widgets: "Widget",
  Charts: "Chart",
  Blocks: "Block",
};

const emptyCategory = "No pages yet.";

function categoryKey(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function overviewCategories(query: string) {
  const q = normalizeSearch(query.trim());
  if (!q) return componentCategories;

  return componentCategories.flatMap((category) => {
    if (normalizeSearch(category.label).includes(q)) return [category];
    const docs = category.docs.filter((doc) => normalizeSearch(doc.name).includes(q));
    return docs.length > 0 ? [{ ...category, docs }] : [];
  });
}

const categoryEvent = "withy-ui-component-categories";
const emptyClosed: ReadonlySet<string> = new Set();

let snapshotRaw: string | null | undefined;
let snapshotClosed: ReadonlySet<string> = emptyClosed;

function parseClosed(raw: string | null): ReadonlySet<string> {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return emptyClosed;
    const labels = parsed.filter((item): item is string => typeof item === "string");
    return labels.length > 0 ? new Set(labels) : emptyClosed;
  } catch {
    return emptyClosed;
  }
}

function readClosedCategories() {
  let raw: string | null;
  try {
    raw = sessionStorage.getItem(categoryStorageKey);
  } catch {
    return emptyClosed;
  }
  if (raw === snapshotRaw) return snapshotClosed;
  snapshotRaw = raw;
  snapshotClosed = parseClosed(raw);
  return snapshotClosed;
}

function writeClosedCategories(closed: ReadonlySet<string>) {
  try {
    const raw = JSON.stringify([...closed]);
    sessionStorage.setItem(categoryStorageKey, raw);
    snapshotRaw = raw;
    snapshotClosed = closed;
    window.dispatchEvent(new Event(categoryEvent));
  } catch {
    // Folding still works for this view when storage is blocked.
  }
}

function subscribeClosed(onStoreChange: () => void) {
  window.addEventListener(categoryEvent, onStoreChange);
  return () => window.removeEventListener(categoryEvent, onStoreChange);
}

function getServerClosed() {
  return emptyClosed;
}

function activeCategory(current?: string) {
  if (!current) return undefined;
  return componentCategories.find((category) => category.docs.some((doc) => doc.slug === current));
}

/** The page's own category stays open until someone folds it on this page. */
function openActive(closed: ReadonlySet<string>, current?: string) {
  const active = activeCategory(current);
  if (!active || !closed.has(active.label)) return closed;
  const next = new Set(closed);
  next.delete(active.label);
  return next;
}

function useClosedCategories(current?: string) {
  const stored = React.useSyncExternalStore(subscribeClosed, readClosedCategories, getServerClosed);
  const [seen, setSeen] = React.useState(current);
  const [folded, setFolded] = React.useState<ReadonlySet<string> | null>(null);
  const pageChanged = seen !== current;
  if (pageChanged) {
    setSeen(current);
    setFolded(null);
  }

  const closed = React.useMemo(() => {
    if (!pageChanged && folded) return folded;
    return openActive(stored, current);
  }, [pageChanged, folded, stored, current]);

  const toggle = React.useCallback(
    (label: string) => {
      const base = folded ?? openActive(stored, current);
      const next = new Set(base);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      setFolded(next);
      writeClosedCategories(next);
    },
    [current, folded, stored],
  );

  return { closed, toggle };
}

function CategoryGroup({
  category,
  open,
  onToggle,
  children,
}: {
  category: (typeof componentCategories)[number];
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const key = categoryKey(category.label);
  const triggerId = `components-nav-${key}-trigger`;
  const titleId = `${triggerId}-title`;
  const descriptionId = `${triggerId}-description`;
  const countId = `${triggerId}-count`;
  const panelId = `components-nav-${key}-panel`;
  const count = category.docs.length;

  return (
    <div className="overflow-hidden rounded-sm border border-gray-200 bg-card">
      <button
        id={triggerId}
        type="button"
        className="flex w-full items-start gap-2 px-2.5 py-2 text-left outline-none hover:bg-[color-mix(in_srgb,var(--heading)_4%,transparent)] focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:ring-inset"
        aria-expanded={open}
        aria-controls={panelId}
        aria-labelledby={`${titleId} ${countId}`}
        aria-describedby={descriptionId}
        onClick={onToggle}
      >
        <CategoryIcon label={category.label} compact />
        <span className="min-w-0 flex-1">
          <span id={titleId} className="block text-[13px] font-medium text-heading">
            {category.label}
          </span>
          <span id={descriptionId} className="mt-0.5 block text-[11px] leading-snug text-text-3">
            {category.description}
          </span>
        </span>
        <span id={countId} className="shrink-0 text-[11px] font-normal text-text-3 tabular-nums">
          {count}
          <span className="sr-only"> {count === 1 ? "component" : "components"}</span>
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            "mt-0.5 size-3.5 shrink-0 text-text-3 transition-transform duration-150",
            open ? "rotate-0" : "-rotate-90",
          )}
        />
      </button>
      <div id={panelId} hidden={!open} className="border-t border-gray-200 px-1.5 py-1.5">
        {children}
      </div>
    </div>
  );
}

function ComponentsSidebar({
  current,
  closed,
  onToggle,
}: {
  current?: string;
  closed: ReadonlySet<string>;
  onToggle: (label: string) => void;
}) {
  return (
    <LayoutPane side="start" className="lg:sticky lg:top-20 lg:h-[calc(100vh-100px)] lg:w-72">
      <ScrollArea className="h-full">
        <nav aria-label="Components" className="flex flex-col gap-2">
          <NavItem href="/components" label="Overview" active={current === undefined} />
          {componentCategories.map((category) => (
            <CategoryGroup
              key={category.label}
              category={category}
              open={!closed.has(category.label)}
              onToggle={() => onToggle(category.label)}
            >
              {category.docs.length > 0 ? (
                <ul className="flex flex-col gap-0.5">
                  {category.docs.map((doc) => (
                    <li key={doc.slug}>
                      <NavItem
                        href={`/components/${doc.slug}`}
                        label={doc.name}
                        active={doc.slug === current}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-1.5 text-[12px] text-text-3">{emptyCategory}</p>
              )}
            </CategoryGroup>
          ))}
        </nav>
      </ScrollArea>
    </LayoutPane>
  );
}

function ComponentsOverview() {
  const [query, setQuery] = React.useState("");
  const categories = overviewCategories(query);
  const trimmed = query.trim();

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Withy UI", href: "/" }, { label: "Components" }]}
        title="Components"
        description="Every piece of Withy UI, from the smallest atom to a full region of a page. Each page shows the component, its import, and an example."
      />
      <SearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onClear={() => setQuery("")}
        placeholder="Search components"
        aria-label="Search components"
        className="mb-5 max-w-md"
      />
      <section className="flex flex-col gap-2.5" aria-label="Component categories">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category.label} className="border-gray-200">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <CategoryIcon label={category.label} />
                  <div>
                    <CardTitle>{category.label}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                {category.docs.length > 0 ? (
                  <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                    {category.docs.map((doc) => (
                      <li key={doc.slug}>
                        <Link href={`/components/${doc.slug}`} className="text-[13px]">
                          {doc.name}
                        </Link>
                        <Truncate lines={2} size="xs" tone="muted" className="mt-0.5">
                          {doc.description}
                        </Truncate>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13px] text-text-3">{emptyCategory}</p>
                )}
              </CardBody>
            </Card>
          ))
        ) : (
          <p role="status" className="text-[13px] text-text-3">
            No components match “{trimmed}”.
          </p>
        )}
      </section>
    </>
  );
}

function ComponentPage({ doc }: { doc: ComponentDoc }) {
  const Demo = doc.Demo;
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Withy UI", href: "/" },
          { label: "Components", href: "/components" },
          { label: doc.name },
        ]}
        title={doc.name}
        description={doc.description}
        actions={
          <Badge variant="muted" color="secondary">
            {layerNames[doc.category]}
          </Badge>
        }
      />
      <div className="flex flex-col gap-2.5">
        <Card>
          <CardHeader>
            <CardTitle>Example</CardTitle>
          </CardHeader>
          <CardBody>
            <Demo />
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardBody>
            <CodeBlock
              label="tsx"
              code={`import { ${doc.imports.join(", ")} } from "${doc.from ?? "withy-ui"}";\n\n${doc.code}`}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export function ComponentsDocsTemplate({ component }: { component?: ComponentSlug }) {
  const doc: ComponentDoc | undefined = componentDocs.find((item) => item.slug === component);
  const { closed, toggle } = useClosedCategories(doc?.slug);

  return (
    <DashboardShell>
      <LayoutBody>
        <ComponentsSidebar current={doc?.slug} closed={closed} onToggle={toggle} />
        <LayoutContent>{doc ? <ComponentPage doc={doc} /> : <ComponentsOverview />}</LayoutContent>
      </LayoutBody>
    </DashboardShell>
  );
}
