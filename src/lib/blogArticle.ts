import DOMPurify from "isomorphic-dompurify";

/*
 * Prepares a guide's HTML on the server: every h2/h3 gets a stable id (an
 * existing id is kept), images load lazily with an alt, and the result is
 * sanitized once, so the server and the browser render the same markup.
 * The contents list is the h2s only; the h3s would make it too long to scan.
 */

export interface ArticleSection {
  id: string;
  text: string;
}

const stripTags = (s: string) => s.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').trim();

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

export function prepareArticle(content: string, title: string): { html: string; sections: ArticleSection[] } {
  const used = new Set<string>();
  const sections: ArticleSection[] = [];

  let html = content.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_m, level: string, attrs: string, inner: string) => {
    const text = stripTags(inner);
    const existing = /\bid=["']([^"']+)["']/i.exec(attrs)?.[1];
    let id = existing || slugify(text) || "section";
    if (!existing) {
      const base = id;
      for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    }
    used.add(id);
    if (level === "2") sections.push({ id, text });
    const rest = attrs.replace(/\s*\bid=["'][^"']*["']/i, "");
    return `<h${level}${rest} id="${id}">${inner}</h${level}>`;
  });

  html = html.replace(/<img([^>]*)>/gi, (_m, attrs: string) => {
    let a = attrs;
    if (!/\bloading=/i.test(a)) a += ' loading="lazy"';
    if (!/\bdecoding=/i.test(a)) a += ' decoding="async"';
    if (!/\balt=["'][^"']+["']/i.test(a)) a = a.replace(/\s*\balt=["'][^"']*["']/i, "") + ` alt="${title.replace(/"/g, "&quot;")}"`;
    return `<img${a}>`;
  });

  return { html: DOMPurify.sanitize(html, { ADD_ATTR: ["target", "loading", "decoding"] }), sections };
}
