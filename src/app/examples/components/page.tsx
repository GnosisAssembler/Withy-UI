import type { Metadata } from "next";
import { ComponentsLibraryTemplate } from "@/components/templates/components-library";

export const metadata: Metadata = {
  title: "Components",
};

export default function ComponentsPage() {
  return <ComponentsLibraryTemplate />;
}
