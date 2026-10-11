import type { Metadata } from "next";
import { ComponentsLibraryTemplate } from "sprig-design-system/examples";

export const metadata: Metadata = {
  title: "Components",
};

export default function ComponentsPage() {
  return <ComponentsLibraryTemplate />;
}
