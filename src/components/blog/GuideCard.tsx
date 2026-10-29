"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { ROUTES } from "@/lib/constants";
import type { GuideListItem } from "./topics";

/* The blog card as it was: image, category, title, two lines, date. Nothing else. */
const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 22px;
  color: inherit;
  text-decoration: none;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1);

  /* display:flex would otherwise override the hidden attribute. */
  &[hidden] { display: none; }
  &:hover { color: inherit; transform: scale(1.02); box-shadow: 0 0 0 1px var(--rj-line), 0 12px 40px rgba(0, 0, 0, 0.14); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }

  .im { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: var(--rj-tile); }
  .bd { flex: 1; display: flex; flex-direction: column; padding: 22px 24px 24px; }
  .c { margin-bottom: 10px; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  h3 { margin: 0 0 10px; font-size: 20px; font-weight: 700; line-height: 1.3; letter-spacing: -0.015em; color: var(--rj-ink); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  p { margin: 0; font-size: 15px; line-height: 1.55; color: var(--rj-ink-2); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  time { margin-top: auto; padding-top: 16px; font-size: 14px; color: var(--rj-ink); }

  @media (prefers-reduced-motion: reduce) { transition: none; &:hover { transform: none; } }
`;

export function GuideCard({ guide, hidden, style }: { guide: GuideListItem; hidden?: boolean; style?: CSSProperties }) {
  return (
    <Card href={ROUTES.PUBLIC.BLOG_POST(guide.slug)} hidden={hidden} style={style}>
      <span className="im">
        {guide.image && (
          <Image src={guide.image} alt={guide.imageAlt || ""} fill sizes="(min-width: 1000px) 400px, (min-width: 640px) 50vw, 100vw" style={{ objectFit: "cover" }} />
        )}
      </span>
      <span className="bd">
        {guide.category && <span className="c">{guide.category}</span>}
        <h3>{guide.title}</h3>
        <p>{guide.excerpt}</p>
        {guide.date && <time>{guide.date}</time>}
      </span>
    </Card>
  );
}

export default GuideCard;
