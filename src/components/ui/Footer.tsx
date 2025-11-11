"use client";

import styled from "styled-components";
import Link from "next/link";

const FooterWrapper = styled.footer`
  border-top: 1px solid var(--border-color);
  margin-top: 80px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FooterColumn = styled.div`
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

const FooterLinks = styled.div`
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

export function Footer() {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterGrid>
          <FooterColumn>
            <h3>Rejectly.pro</h3>
            <p>AI-powered resume analysis to help you land your dream job.</p>
          </FooterColumn>
          <FooterColumn>
            <h4>Product</h4>
            <ul>
              <li>
                <Link href="/#features">Features</Link>
              </li>
              <li>
                <Link href="/#pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/#demo">Demo</Link>
              </li>
            </ul>
          </FooterColumn>
          <FooterColumn>
            <h4>Company</h4>
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </FooterColumn>
          <FooterColumn>
            <h4>Support</h4>
            <ul>
              <li>
                <Link href="/#faq">FAQ</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
            </ul>
          </FooterColumn>
        </FooterGrid>

        <FooterBottom>
          <p>© 2025 Rejectly.pro. All rights reserved.</p>
          <FooterLinks>
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
          </FooterLinks>
        </FooterBottom>
      </FooterContent>
    </FooterWrapper>
  );
}
