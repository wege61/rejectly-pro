"use client";

import styled from "styled-components";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const FooterWrapper = styled.footer`
  position: relative;
  margin-top: 56px;
  background: var(--bg-color);

  @media (min-width: 768px) {
    margin-top: 80px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.35), transparent);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 32px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px 32px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2.2fr 1fr 1fr 1fr;
    gap: 48px;
  }
`;

const BrandColumn = styled.div`
  @media (min-width: 640px) and (max-width: 1023px) {
    grid-column: 1 / -1;
    max-width: 480px;
  }

  p {
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.65;
    margin: 0;
    max-width: 34ch;
  }
`;

const FooterColumn = styled.nav`
  h3 {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-color);
    margin: 0 0 18px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--text-color);
    }
  }
`;

const Tag = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 2px 6px;
  border-radius: 999px;
  color: var(--accent);
  background: var(--accent-light);
  border: 1px solid rgba(var(--accent-rgb), 0.25);
`;

const BrandLogo = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.05em;
  margin-bottom: 14px;
  background: linear-gradient(135deg, #fff 0%, #a5a5a5 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  display: inline-block;

  span {
    color: var(--accent);
    -webkit-text-fill-color: var(--accent);
  }
`;

const CtaButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 11px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  background: var(--gradient-accent);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(var(--accent-rgb), 0.28);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CtaNote = styled.p`
  && {
    margin-top: 10px;
    font-size: 13px;
    color: var(--text-secondary);
  }
`;

const SeoLinks = styled.section`
  margin-top: 48px;
  padding-top: 28px;
  border-top: 1px solid var(--border-color);

  h3 {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-color);
    margin: 0 0 14px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
  }

  a {
    color: var(--text-secondary);
    font-size: 13px;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--text-color);
    }
  }
`;

const FooterBottom = styled.div`
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const LegalRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 16px;
  color: var(--text-secondary);
  font-size: 13px;

  p {
    margin: 0;
  }

  a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--text-color);
    }
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 12px;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: var(--accent);
    border-color: rgba(var(--accent-rgb), 0.4);
    transform: translateY(-2px);
  }
`;

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

export function Footer() {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterGrid>
          <BrandColumn>
            <BrandLogo>Rejectly<span>.pro</span></BrandLogo>
            <p>AI-powered resume analysis to help you land your dream job faster and smarter.</p>
            <CtaButton href={ROUTES.PUBLIC.ATS_CHECK}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="m9 15 2 2 4-4" />
              </svg>
              Check your resume
            </CtaButton>
            <CtaNote>Free ATS scan — no signup required.</CtaNote>
          </BrandColumn>

          <FooterColumn aria-label="Product">
            <h3>Product</h3>
            <ul>
              <li>
                <Link href={ROUTES.PUBLIC.FEATURES}>Features</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.PRICING}>Pricing</Link>
              </li>
              <li>
                <Link href={ROUTES.APP.COVER_LETTERS}>
                  Cover Letter AI <Tag>Credits</Tag>
                </Link>
              </li>
              <li>
                <Link href="/#demo">Demo</Link>
              </li>
              <li>
                <Link href={ROUTES.AUTH.SIGNUP}>Get Started</Link>
              </li>
            </ul>
          </FooterColumn>

          <FooterColumn aria-label="Free tools">
            <h3>Free Tools</h3>
            <ul>
              <li>
                <Link href={ROUTES.PUBLIC.ATS_CHECK}>ATS Resume Checker</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.CV_BUILDER}>Free CV Builder</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.BLOG}>ATS Guides</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.HOW_IT_WORKS}>How It Works</Link>
              </li>
            </ul>
          </FooterColumn>

          <FooterColumn aria-label="Company">
            <h3>Company</h3>
            <ul>
              <li>
                <Link href={ROUTES.PUBLIC.ABOUT}>About Us</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.CONTACT}>Contact</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.FAQ}>Help &amp; FAQ</Link>
              </li>
            </ul>
          </FooterColumn>
        </FooterGrid>

        <SeoLinks aria-label="Resume guides by role">
          <h3>Resume Guides by Role</h3>
          <ul>
            {RESUME_GUIDES.map(({ slug, label }) => (
              <li key={slug}>
                <Link href={`/resume/${slug}`}>{label} Resume</Link>
              </li>
            ))}
          </ul>
        </SeoLinks>

        <FooterBottom>
          <LegalRow>
            <p>© {new Date().getFullYear()} Bulbul Labs LLC. All rights reserved.</p>
            <Link href={ROUTES.PUBLIC.PRIVACY}>Privacy Policy</Link>
            <Link href={ROUTES.PUBLIC.TERMS}>Terms of Service</Link>
          </LegalRow>

          <SocialRow>
            <SocialIcon
              href="https://www.instagram.com/rejectly.pro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Rejectly on Instagram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </SocialIcon>
            <SocialIcon
              href="https://www.tiktok.com/@rejectly.pro"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Rejectly on TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </SocialIcon>
          </SocialRow>
        </FooterBottom>
      </FooterContent>
    </FooterWrapper>
  );
}
