import type { GeneratedCV } from "@/types/cv";

/* Kept apart from score.ts so the browser can use it without the scorer and the PDF code. */

/** Strip the ⟦ ⟧ markers around the numbers the person supplied. */
export const unmark = (s: string) => s.replace(/[⟦⟧]/g, "");

/** The example as the builder should receive it: no markers. */
export function plainCV(cv: GeneratedCV): GeneratedCV {
  return {
    ...cv,
    summary: unmark(cv.summary),
    experience: cv.experience.map((e) => ({ ...e, bullets: e.bullets.map(unmark) })),
    projects: cv.projects?.map((p) => ({ ...p, bullets: p.bullets?.map(unmark) })),
  };
}
