import type { JSX } from "react";

export type ComponentCategory =
  "Atoms" | "Molecules" | "Organisms" | "Layout" | "Widgets" | "Charts" | "Blocks";

export type ComponentDoc = {
  slug: string;
  name: string;
  category: ComponentCategory;
  description: string;
  imports: readonly string[];
  /** Package path in the usage snippet. Defaults to withy-ui. */
  from?: string;
  code: string;
  Demo: () => JSX.Element;
};
