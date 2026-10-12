import type { Metadata } from "next";
import { ComponentsDocsTemplate } from "withy-ui/examples";

export const metadata: Metadata = {
  title: "Components",
};

export default function ComponentsPage() {
  return <ComponentsDocsTemplate />;
}
