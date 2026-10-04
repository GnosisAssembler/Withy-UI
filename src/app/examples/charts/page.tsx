import type { Metadata } from "next";
import { ChartsGalleryTemplate } from "@/components/templates/charts-gallery";

export const metadata: Metadata = {
  title: "Charts",
};

export default function ChartsPage() {
  return <ChartsGalleryTemplate />;
}
