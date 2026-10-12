import { authBlocks } from "./auth";
import { formBlocks } from "./forms";
import { peopleBlocks } from "./people";
import { settingsBlocks } from "./settings";
import type { ComponentDoc } from "../types";

export const blockDocs = [
  ...formBlocks,
  ...peopleBlocks,
  ...settingsBlocks,
  ...authBlocks,
] as const satisfies readonly ComponentDoc[];
