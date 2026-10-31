import type { RoleExample } from "./types";
import { softwareEngineer } from "./software-engineer";
import { dataAnalyst } from "./data-analyst";
import { productManager } from "./product-manager";
import { uxDesigner } from "./ux-designer";

/* Roles rebuilt as first-job guides. Slugs not listed here still use the old page. */
export const ROLE_EXAMPLES: Partial<Record<string, RoleExample>> = {
  "software-engineer": softwareEngineer,
  "data-analyst": dataAnalyst,
  "product-manager": productManager,
  "ux-designer": uxDesigner,
};

export const getRoleExample = (slug: string) => ROLE_EXAMPLES[slug];
export type { RoleExample } from "./types";
