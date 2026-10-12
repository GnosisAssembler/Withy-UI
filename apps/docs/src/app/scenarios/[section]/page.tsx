import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScenariosTemplate, type ScenarioSection } from "withy-ui/examples";

const titles = {
  copy: "Copy",
  create: "Create",
  customize: "Customize",
  delegate: "Delegate",
  delete: "Delete",
  edit: "Edit",
  filter: "Filter",
  search: "Search",
  view: "View",
} as const satisfies Record<ScenarioSection, string>;

export function generateStaticParams() {
  return (Object.keys(titles) as ScenarioSection[]).map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const title = titles[section as ScenarioSection];
  return { title: title ?? "Scenario patterns" };
}

export default async function ScenariosSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!(section in titles)) notFound();
  return <ScenariosTemplate section={section as ScenarioSection} />;
}
