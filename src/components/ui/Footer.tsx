"use client";

import styled from "styled-components";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const FooterWrapper = styled.footer`
  position: relative;
  margin-top: 80px;
  background: var(--bg-color);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(238, 90, 90, 0.4), transparent);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px 32px;
  margin-bottom: 48px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  }
`;

const FooterColumn = styled.section`
  h3 {
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 16px;
    color: var(--text-color);
  }

  h4 {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 16px;
    color: var(--text-color);
  }

  p {
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.6;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  li a {
    color: var(--text-secondary);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--text-color);
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--border-color);
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  p {
    color: var(--text-secondary);
    font-size: 14px;
  }
`;

const FooterLinks = styled.nav`
  display: flex;
  gap: 24px;

  a {
    color: var(--text-secondary);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--text-color);
    }
  }
`;

const SocialIcon = styled.a`
  color: var(--text-secondary);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: var(--accent);
    transform: translateY(-2px);
  }
`;

const BrandLogo = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.05em;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #fff 0%, #a5a5a5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  
  span {
    color: var(--accent);
    -webkit-text-fill-color: var(--accent);
  }
`;

const TrustBadge = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .stars {
    color: #f59e0b;
    font-size: 14px;
    letter-spacing: 2px;
  }
  
  .text {
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
  }
`;

const SystemStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
  margin-top: 16px;

  @media (min-width: 768px) {
    margin-top: 0;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }
`;

export function Footer() {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterGrid>
          <FooterColumn>
            <BrandLogo>Rejectly<span>.pro</span></BrandLogo>
            <p>AI-powered resume analysis to help you land your dream job faster and smarter.</p>
            <TrustBadge>
              <div className="stars">★★★★★</div>
              <div className="text">4.9/5 from 10,000+ job seekers</div>
            </TrustBadge>
          </FooterColumn>
          <FooterColumn>
            <h4>Product</h4>
            <ul>
              <li>
                <Link href="/#features">Features</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.PRICING}>Pricing</Link>
              </li>
              <li>
                <Link href="/#demo">Demo</Link>
              </li>
              <li>
                <Link href={ROUTES.AUTH.SIGNUP}>Get Started</Link>
              </li>
            </ul>
          </FooterColumn>
          <FooterColumn>
            <h4>Free Tools</h4>
            <ul>
              <li>
                <Link href={ROUTES.PUBLIC.ATS_CHECK}>ATS Resume Checker</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.CV_BUILDER}>Free CV Builder</Link>
              </li>
              <li>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', cursor: 'not-allowed', opacity: 0.6 }}>Cover Letter AI <span style={{ fontSize: '10px', background: 'var(--accent)', color: '#fff', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>Soon</span></span>
              </li>
            </ul>
          </FooterColumn>
          <FooterColumn>
            <h4>Company</h4>
            <ul>
              <li>
                <Link href={ROUTES.PUBLIC.ABOUT}>About Us</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.BLOG}>ATS Guides</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.CONTACT}>Contact</Link>
              </li>
            </ul>
          </FooterColumn>
          <FooterColumn>
            <h4>Support</h4>
            <ul>
              <li>
                <Link href={ROUTES.PUBLIC.FAQ}>Help & FAQ</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.PRIVACY}>Privacy Policy</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.TERMS}>Terms of Service</Link>
              </li>
            </ul>
          </FooterColumn>
        </FooterGrid>

        <FooterBottom>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p>© {new Date().getFullYear()} Bulbul Labs LLC. All rights reserved.</p>
            <SystemStatus><div className="dot" /> All systems operational</SystemStatus>
          </div>
          <FooterLinks>
            <SocialIcon href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </SocialIcon>
            <SocialIcon href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </SocialIcon>
            <SocialIcon href="#" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </SocialIcon>
          </FooterLinks>
        </FooterBottom>
      </FooterContent>
    </FooterWrapper>
  );
}
