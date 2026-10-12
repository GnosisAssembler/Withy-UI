import type { Metadata } from "next";
import { HomeTemplate } from "withy-ui/examples";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return <HomeTemplate />;
}
