import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UtilitiesTemplate, type UtilitySection } from "withy-ui/examples";

const titles = {
  color: "Color",
  typography: "Typography",
  spacing: "Spacing",
  radius: "Radius",
  shadow: "Shadow",
  layout: "Layout",
  motion: "Motion",
} as const satisfies Record<UtilitySection, string>;

export function generateStaticParams() {
  return (Object.keys(titles) as UtilitySection[]).map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const title = titles[section as UtilitySection];
  return { title: title ?? "CSS utilities" };
}

export default async function UtilitiesSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!(section in titles)) notFound();
  return <UtilitiesTemplate section={section as UtilitySection} />;
}
