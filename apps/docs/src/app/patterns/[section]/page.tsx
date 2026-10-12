import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PatternsTemplate, type PatternSection } from "withy-ui/examples";

const titles = {
  "data-visualization": "Data visualization",
  "degraded-experiences": "Degraded experiences",
  "empty-states": "Empty states",
  forms: "Forms",
  loading: "Loading",
  navigation: "Navigation",
  notifications: "Notifications",
  "saving-actions": "Saving actions",
} as const satisfies Record<PatternSection, string>;

export function generateStaticParams() {
  return (Object.keys(titles) as PatternSection[]).map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const title = titles[section as PatternSection];
  return { title: title ?? "UI patterns" };
}

export default async function PatternsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!(section in titles)) notFound();
  return <PatternsTemplate section={section as PatternSection} />;
}
