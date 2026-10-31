import type { Pin } from "./types";

/** Default wording for each change; a role can override any of it. */
export const CHANGE_COPY: Record<Pin, { before: string; after: string; why: string; whyAfter: string }> = {
  columns: {
    before: "Two columns",
    after: "One column",
    why: "A parser reads straight across the page, so the sidebar runs into the main column, line by line.",
    whyAfter: "One column reads top to bottom, in the order it was written.",
  },
  contact: {
    before: "Contact details missing or shown as icons",
    after: "Contact details as text",
    why: "A missing phone number, and links shown only as icons: an icon is a picture, so nothing of it reaches the ATS.",
    whyAfter: "Email, phone, city and links on one line under the name, written out.",
  },
  headings: {
    before: "Headings an ATS doesn’t know",
    after: "Standard headings",
    why: "Creative section names aren’t ones an ATS looks for, so the experience under them isn’t found as experience.",
    whyAfter: "Experience, Education, Skills: names every ATS recognizes.",
  },
  numbers: {
    before: "Nothing anyone can measure",
    after: "Numbers they can back up",
    why: "The bullets describe duties, not results, so they could be anyone’s.",
    whyAfter: "Counts and results the person gave when asked. Not estimates.",
  },
  bullets: {
    before: "Decorative bullets",
    after: "Plain bullets",
    why: "Arrows and symbols instead of bullets, so the lines don’t read as a list.",
    whyAfter: "The standard • that every parser reads as a list item.",
  },
  structure: {
    before: "Lines that aren’t bullets",
    after: "Bullets that say something",
    why: "Entries with nothing under them, or lines that don’t read as bullets.",
    whyAfter: "Each bullet starts with what they did and ends with what came of it.",
  },
  length: {
    before: "Too thin to judge",
    after: "Enough to read",
    why: "A name, a school and a few lines: not enough for anyone to judge.",
    whyAfter: "Dates, coursework and details the person already had. Nothing that didn’t happen.",
  },
  breaks: {
    before: "Sections that run together",
    after: "Clear sections",
    why: "Without clear breaks, sections blur into each other in the text.",
    whyAfter: "One heading per section, with space between them.",
  },
  dividers: {
    before: "Decorative dividers",
    after: "Simple dividers",
    why: "Stars, boxes and lines made of symbols come through as stray characters.",
    whyAfter: "A plain rule under each heading, or none at all.",
  },
  skills: {
    before: "Skills hidden in sentences",
    after: "Skills listed one by one",
    why: "Skills mentioned only inside sentences are hard to pick out.",
    whyAfter: "A skills section that lists each one, the way job posts word them.",
  },
};

export const MISTAKE_TAG: Record<"check" | "see" | "practice", string> = {
  check: "We check this",
  see: "See it above",
  practice: "Good practice",
};
