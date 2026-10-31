import type { RoleExample } from "./types";
import { softwareEngineer } from "./software-engineer";
import { dataAnalyst } from "./data-analyst";
import { productManager } from "./product-manager";
import { uxDesigner } from "./ux-designer";
import { marketingManager } from "./marketing-manager";
import { projectManager } from "./project-manager";
import { salesRepresentative } from "./sales-representative";
import { nurse } from "./nurse";
import { accountant } from "./accountant";
import { teacher } from "./teacher";
import { humanResources } from "./human-resources";
import { businessAnalyst } from "./business-analyst";

/* The /resume/[role] pages: one first-job guide per slug. The slugs are the URLs; keep them stable. */
export const ROLE_EXAMPLES: Record<string, RoleExample> = {
  "software-engineer": softwareEngineer,
  "data-analyst": dataAnalyst,
  "product-manager": productManager,
  "ux-designer": uxDesigner,
  "marketing-manager": marketingManager,
  "project-manager": projectManager,
  "sales-representative": salesRepresentative,
  nurse,
  accountant,
  teacher,
  "human-resources": humanResources,
  "business-analyst": businessAnalyst,
};

export const ROLE_SLUGS = Object.keys(ROLE_EXAMPLES);
export const getRoleExample = (slug: string): RoleExample | undefined => ROLE_EXAMPLES[slug];
export type { RoleExample } from "./types";
