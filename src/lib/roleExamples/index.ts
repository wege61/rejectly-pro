import type { RoleExample } from "./types";
import { softwareEngineer } from "./software-engineer";

/* Roles rebuilt as first-job guides. Slugs not listed here still use the old page. */
export const ROLE_EXAMPLES: Partial<Record<string, RoleExample>> = {
  "software-engineer": softwareEngineer,
};

export const getRoleExample = (slug: string) => ROLE_EXAMPLES[slug];
export type { RoleExample } from "./types";
