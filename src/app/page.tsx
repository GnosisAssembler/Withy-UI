import type { Metadata } from "next";
import { FoundationsTemplate } from "@/components/templates/foundations";

export const metadata: Metadata = {
  title: "Foundations",
};

export default function HomePage() {
  return <FoundationsTemplate />;
}
