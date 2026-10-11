import type { Metadata } from "next";
import { ChartsGalleryTemplate } from "sprig-design-system/examples";

export const metadata: Metadata = {
  title: "Charts",
};

export default function ChartsPage() {
  return <ChartsGalleryTemplate />;
}
