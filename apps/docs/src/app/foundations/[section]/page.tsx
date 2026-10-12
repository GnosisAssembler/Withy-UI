import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FoundationsTemplate, type FoundationSection } from "withy-ui/examples";

const titles = {
  color: "Color",
  content: "Content",
  icons: "Icons",
  layout: "Layout",
  spacing: "Spacing",
  typography: "Typography",
  "atomic-design": "Atomic design",
} as const satisfies Record<FoundationSection, string>;

export function generateStaticParams() {
  return (Object.keys(titles) as FoundationSection[]).map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const title = titles[section as FoundationSection];
  return { title: title ?? "Foundations" };
}

export default async function FoundationsSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!(section in titles)) notFound();
  return <FoundationsTemplate section={section as FoundationSection} />;
}
