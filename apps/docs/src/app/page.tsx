import type { Metadata } from "next";
import { FoundationsTemplate } from "sprig-design-system/examples";

export const metadata: Metadata = {
  title: "Foundations",
};

export default function HomePage() {
  return <FoundationsTemplate />;
}
