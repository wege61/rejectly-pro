"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { LogoMark } from "./Navbar";

/*
 * Site footer: one signature line, four quiet columns, a legal bar. No buttons
 * (the page above already ends on one). On phones the columns fold into an
 * accordion so the role list doesn't run the page long.
 */

const RESUME_GUIDES = [
  { slug: "software-engineer", label: "Software Engineer" },
  { slug: "product-manager", label: "Product Manager" },
  { slug: "data-analyst", label: "Data Analyst" },
  { slug: "marketing-manager", label: "Marketing Manager" },
  { slug: "project-manager", label: "Project Manager" },
  { slug: "ux-designer", label: "UX Designer" },
  { slug: "business-analyst", label: "Business Analyst" },
  { slug: "sales-representative", label: "Sales Representative" },
  { slug: "human-resources", label: "Human Resources" },
  { slug: "accountant", label: "Accountant" },
  { slug: "nurse", label: "Nurse" },
  { slug: "teacher", label: "Teacher" },
];

const COLUMNS: { title: string; roles?: boolean; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "ATS resume checker", href: ROUTES.PUBLIC.ATS_CHECK },
      { label: "Job Match demo", href: "/#demo" },
      { label: "CV Builder", href: ROUTES.PUBLIC.CV_BUILDER },
      { label: "Pricing", href: ROUTES.PUBLIC.PRICING },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Guides", href: ROUTES.PUBLIC.BLOG },
      { label: "How it works", href: ROUTES.PUBLIC.HOW_IT_WORKS },
      { label: "FAQ", href: ROUTES.PUBLIC.FAQ },
    ],
  },
  {
    title: "Resume by role",
    roles: true,
    links: RESUME_GUIDES.map(({ slug, label }) => ({ label: `${label} resume`, href: `/resume/${slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: ROUTES.PUBLIC.ABOUT },
      { label: "Contact", href: ROUTES.PUBLIC.CONTACT },
      { label: "Privacy", href: ROUTES.PUBLIC.PRIVACY },
      { label: "Terms", href: ROUTES.PUBLIC.TERMS },
    ],
  },
];

const Root = styled.footer`
  background: var(--rj-paper);
  color: var(--rj-ink-2);
  font-family: var(--rj-font);
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
`;

const Inner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 48px max(20px, env(safe-area-inset-right, 0px)) calc(28px + env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { padding: 64px 40px 32px; }
  @media (min-width: 1000px) { padding: 72px 40px 36px; }
`;

const Brand = styled.div`
  padding-bottom: 32px;
  border-bottom: 1px solid var(--rj-line);

  .logo {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--rj-ink);
    text-decoration: none;

    svg { width: 22px; height: 22px; }
    small { margin-left: -4px; font: 500 12px var(--rj-mono); letter-spacing: 0; color: var(--rj-ink-3); }
    &:hover { color: var(--rj-ink); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; border-radius: 4px; }
  }

  [data-theme="dark"] & .logo-tile { stroke: rgba(255, 255, 255, 0.28); stroke-width: 1; }

  p {
    margin: 14px 0 0;
    font-size: clamp(24px, 5.6vw, 30px);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.035em;
    color: var(--rj-ink);
    text-wrap: balance;
  }

  .humans {
    padding: 0 0.08em;
    margin: 0 -0.04em;
    border-radius: 0.08em;
    color: var(--rj-hl-ink);
    background: linear-gradient(transparent 12%, var(--rj-hl) 12%, var(--rj-hl) 92%, transparent 92%);
  }

  .bots {
    font-family: var(--rj-mono);
    font-size: 0.86em;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
`;

const Columns = styled.nav`
  display: grid;
  padding: 8px 0;
  border-bottom: 1px solid var(--rj-line);

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px 24px;
    padding: 36px 0 40px;
  }

  @media (min-width: 1000px) { grid-template-columns: 1fr 1fr 2fr 1fr; }
`;

const Column = styled.div<{ $open: boolean; $roles?: boolean }>`
  border-bottom: 1px solid var(--rj-line);
  &:last-child { border-bottom: 0; }

  @media (min-width: 640px) {
    border-bottom: 0;
    ${({ $roles }) => $roles && "grid-column: 1 / -1; order: 4;"}
  }

  @media (min-width: 1000px) {
    ${({ $roles }) => $roles && "grid-column: auto; order: 0;"}
  }

  h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--rj-ink);

    @media (min-width: 640px) { padding-bottom: 14px; }
  }

  h3 button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border: 0;
    background: none;
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;

    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; border-radius: 4px; }

    &::after {
      content: "";
      flex: none;
      width: 7px;
      height: 7px;
      margin: ${({ $open }) => ($open ? "4px 4px 0 0" : "-4px 4px 0 0")};
      border-right: 1.5px solid var(--rj-ink-3);
      border-bottom: 1.5px solid var(--rj-ink-3);
      transform: rotate(${({ $open }) => ($open ? 225 : 45)}deg);
      transition: transform 0.25s, margin 0.25s;
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0 0 14px;
    display: ${({ $open }) => ($open ? "grid" : "none")};
    gap: 10px;

    @media (min-width: 640px) {
      display: grid;
      padding: 0;
      ${({ $roles }) => $roles && "grid-template-columns: repeat(3, 1fr); column-gap: 24px;"}
    }

    @media (min-width: 1000px) {
      ${({ $roles }) => $roles && "grid-template-columns: 1fr 1fr;"}
    }
  }
`;

const FooterLink = styled(Link)`
  color: var(--rj-ink-2);
  text-decoration: none;

  &:hover { color: var(--rj-ink); text-decoration: underline; text-underline-offset: 3px; }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; border-radius: 4px; }
`;

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
  padding-top: 20px;
  color: var(--rj-ink-3);
`;

const Social = styled.div`
  display: flex;
  gap: 8px;

  a {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: var(--rj-ink-2);
    box-shadow: inset 0 0 0 1px var(--rj-line);

    &:hover { color: var(--rj-ink); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  }

  svg { width: 15px; height: 15px; }
`;

export function Footer() {
  // Columns fold into an accordion only on phones; elsewhere they're plain headings.
  const [phone, setPhone] = useState(false);
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const toggle = (title: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });

  return (
    <Root>
      <Inner>
        <Brand>
          <Link className="logo" href={ROUTES.PUBLIC.HOME} aria-label="Rejectly home">
            <LogoMark />
            Rejectly<small>.pro</small>
          </Link>
          <p>
            Written for <span className="humans">humans</span>. Readable by <span className="bots">bots</span>.
          </p>
        </Brand>

        <Columns aria-label="Footer">
          {COLUMNS.map((col) => {
            const isOpen = !phone || open.has(col.title);
            const listId = `footer-${col.title.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <Column key={col.title} $open={isOpen} $roles={col.roles}>
                <h3>
                  {phone ? (
                    <button type="button" aria-expanded={isOpen} aria-controls={listId} onClick={() => toggle(col.title)}>
                      {col.title}
                    </button>
                  ) : (
                    col.title
                  )}
                </h3>
                <ul id={listId}>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <FooterLink href={l.href}>{l.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </Column>
            );
          })}
        </Columns>

        <Bar>
          <span>© {new Date().getFullYear()} Bulbul Labs LLC</span>
          <Social>
            <a href="https://www.instagram.com/rejectly.pro" target="_blank" rel="noopener noreferrer" aria-label="Rejectly on Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@rejectly.pro" target="_blank" rel="noopener noreferrer" aria-label="Rejectly on TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.6 3c.4 2 1.7 3.4 3.9 3.6v3.1c-1.4.1-2.7-.3-3.9-1v6.6c0 3.4-2.6 5.7-5.8 5.7-3.1 0-5.6-2.4-5.6-5.4 0-3.4 2.9-5.9 6.5-5.3v3.2c-1.5-.4-3.2.5-3.2 2.1 0 1.2 1 2.2 2.3 2.2 1.4 0 2.4-1 2.4-2.6V3h3.4z" />
              </svg>
            </a>
          </Social>
        </Bar>
      </Inner>
    </Root>
  );
}

export default Footer;
