"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 80px 24px 60px;
  margin-top: 40px;

  @media (max-width: 768px) {
    padding: 60px 16px 40px;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    margin-bottom: 48px;
  }
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 24px;
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const PricingSection = styled.section`
  margin-bottom: 120px;

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    max-width: 480px;
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.02)"};
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.08)"};
  border-radius: 24px;
  padding: 40px;
  position: relative;
  transform: ${({ $featured }) => $featured 
    ? "scale(1.05)"
    : "scale(1)"};

  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: ${({ $featured }) => $featured 
    ? "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.03)"
    : "inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 4px 24px rgba(0, 0, 0, 0.3)"};

  &:hover {
    background: ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.04)"};
    border-color: ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.15)"};
    box-shadow: ${({ $featured }) => $featured 
      ? "inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 16px 48px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.05)"
      : "inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)"};
  }

  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--text-color);
  color: var(--bg-alt);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
`;

const PlanName = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--text-color);
`;

const PlanPrice = styled.div`
  margin-bottom: 6px;
`;

const Price = styled.div`
  font-size: 56px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.1;
  letter-spacing: -2px;

  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const PriceSubtext = styled.p`
  font-size: 15px;
  color: var(--text-tertiary);
  margin: 0 0 6px;
`;

const PlanDescription = styled.p`
  font-size: 15px;
  color: var(--text-tertiary);
  margin: 0 0 20px;
`;

const PlanTagline = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 24px;
`;

const CTAButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 28px;
  border-radius: 9999px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin-bottom: 32px;
  text-decoration: none;
  border: none;

  ${({ $primary }) =>
    $primary
      ? `
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%),
      rgba(238, 90, 90, 0.82);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.28);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 16px rgba(238, 90, 90, 0.35);

    &:hover {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 100%),
        rgba(238, 90, 90, 0.92);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 4px 20px rgba(238, 90, 90, 0.5);
    }
  `
      : `
    background: rgba(150, 150, 150, 0.08);
    backdrop-filter: blur(40px) saturate(200%);
    -webkit-backdrop-filter: blur(40px) saturate(200%);
    color: var(--text-color);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);

    &:hover {
      background: rgba(150, 150, 150, 0.16);
      border-color: rgba(255, 255, 255, 0.28);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 24px rgba(0, 0, 0, 0.1);
    }
  `}

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: var(--text-color);

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--text-tertiary);
  }
`;

const FeatureRowMuted = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-tertiary);

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--text-tertiary);
    opacity: 0.7;
  }
`;

const FeatureRowHighlight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: var(--accent);
  font-weight: 500;

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--accent);
  }
`;

const ComparisonSection = styled.section`
  margin-bottom: 120px;

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;

  @media (max-width: 768px) {
    margin-bottom: 48px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

// Feature Comparison Table Styles
const ComparisonTableWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
`;

const ComparisonHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  padding: 32px 24px;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  background: rgba(255, 255, 255, 0.02);

  @media (max-width: 768px) {
    grid-template-columns: 1.5fr 1fr 1fr;
    padding: 24px 16px;
    gap: 8px;
  }
`;

const ComparisonColTitleEmpty = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-secondary);
`;

const ComparisonColHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ComparisonColTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ComparisonRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1.5fr 1fr 1fr;
    padding: 16px;
    gap: 8px;
  }
`;

const ComparisonFeature = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const ComparisonValue = styled.div<{ $isPro?: boolean, $isCross?: boolean }>`
  font-size: 15px;
  color: ${({ $isPro, $isCross }) => 
    $isCross ? "var(--text-tertiary)" : 
    $isPro ? "var(--text-color)" : "var(--text-secondary)"};
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: ${({ $isPro, $isCross }) => 
      $isCross ? "var(--text-tertiary)" : 
      $isPro ? "var(--accent)" : "var(--text-secondary)"};
  }

  @media (max-width: 768px) {
    font-size: 13px;
    gap: 6px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const ComparisonMessage = styled.p`
  text-align: center;
  margin-top: 40px;
  font-size: 20px;
  color: var(--text-color);
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FAQSection = styled.section`
  margin-bottom: 120px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div<{ $isOpen: boolean }>`
  background: var(--bg-alt);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(0, 0, 0, 0.05);

  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  ${({ $isOpen }) =>
    $isOpen &&
    `
    border-color: var(--primary-200);
    box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.15);
  `}
`;

const Question = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.05) 0%, rgba(var(--primary-700-rgb), 0.05) 100%);
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const QuestionText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  flex: 1;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const QuestionIcon = styled.span<{ $isOpen: boolean }>`
  font-size: 24px;
  color: var(--primary-500);
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0)")};
  flex-shrink: 0;
`;

const Answer = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: ${({ $isOpen }) => ($isOpen ? "0 24px 20px 24px" : "0 24px")};

  @media (max-width: 768px) {
    padding: ${({ $isOpen }) => ($isOpen ? "0 20px 16px 20px" : "0 20px")};
  }
`;

const AnswerText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);

  strong {
    color: var(--text-color);
    font-weight: 600;
  }
`;


const CheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CrossMark = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ArrowIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// Feature icons for pricing cards
const CreditIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AnalysisIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ATSIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LetterIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SparklesIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ClockIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const MixIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const SaveIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TargetIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const InfinityIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.303 0-4.303 8 0 8 5.606 0 7.644-8 12.74-8z" />
  </svg>
);

const RocketIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const StarIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const RefreshIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);



const pricingFAQs = [
  {
    question: "What's the difference between credit packs and subscription?",
    answer:
      "Single ($2) and Starter ($7) are one-time purchases that give you credits to use anytime - they never expire. Pro ($12/month) is a subscription with unlimited analyses as long as you're subscribed.",
  },
  {
    question: "Do my credits expire?",
    answer:
      "No! Credits from Single and Starter packs never expire. Use them whenever you need them, at your own pace.",
  },
  {
    question: "What happens if I cancel my Pro subscription?",
    answer:
      "You can cancel anytime with no penalty. After canceling, you'll continue to have unlimited access until the end of your current billing period.",
  },
  {
    question: "Can I buy more credits while subscribed to Pro?",
    answer:
      "Pro subscribers have unlimited analyses, so there's no need to buy additional credits. If you cancel Pro, any previously purchased credits will still be available.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor Stripe. Your payment information is encrypted and secure.",
  },
  {
    question: "Which plan should I choose?",
    answer:
      "If you're applying to a few specific jobs, Single ($2) is perfect. For active job seekers, Starter ($7) offers the best value at $0.70 per analysis. If you're applying to many positions, Pro ($12/month) gives you unlimited access.",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://rejectly.pro' },
          { name: 'Pricing', url: 'https://rejectly.pro/pricing' }
        ]}
      />
      {/* Pricing Offers Schema */}
      <script
        id="pricing-offers-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Rejectly.pro Resume Optimizer',
            description: 'AI-powered resume optimization and ATS checker with multiple pricing options',
            image: 'https://rejectly.pro/logo.png',
            brand: {
              '@type': 'Brand',
              name: 'Rejectly.pro',
            },
            offers: [
              {
                '@type': 'Offer',
                name: 'Single Analysis',
                description: 'One-time resume analysis with AI optimization',
                price: '2.00',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: 'https://rejectly.pro/pricing',
                priceValidUntil: '2025-12-31',
                itemOffered: {
                  '@type': 'Service',
                  name: 'AI Resume Analysis',
                  serviceType: 'Resume Optimization',
                },
              },
              {
                '@type': 'Offer',
                name: 'Starter Pack',
                description: '10 resume analysis credits - Best value at $0.70 per analysis',
                price: '7.00',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: 'https://rejectly.pro/pricing',
                priceValidUntil: '2025-12-31',
                itemOffered: {
                  '@type': 'Service',
                  name: '10 AI Resume Analyses',
                  serviceType: 'Resume Optimization Package',
                },
              },
              {
                '@type': 'Offer',
                name: 'Pro Monthly',
                description: 'Unlimited resume analyses and premium features',
                price: '12.00',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                url: 'https://rejectly.pro/pricing',
                priceValidUntil: '2025-12-31',
                billingDuration: 'P1M',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Unlimited AI Resume Analyses',
                  serviceType: 'Premium Resume Optimization',
                },
              },
            ],
          })
        }}
      />
      <Container>
        <Content>
          <Header>
            <Title>Simple, Transparent Pricing</Title>
          <Subtitle>
            Pay per analysis or subscribe for unlimited access. No hidden fees.
          </Subtitle>
        </Header>

        <PricingSection>
          <PricingGrid>
            {/* Single Plan */}
            <PricingCard>
              <PlanName>Single</PlanName>
              <PlanPrice>
                <Price>$2</Price>
              </PlanPrice>
              <PriceSubtext>one-time payment</PriceSubtext>
              <PlanDescription>Try it with a single analysis</PlanDescription>
              <PlanTagline>Perfect for quick tests</PlanTagline>
              <CTAButton onClick={() => router.push("/signup")}>
                Get started <ArrowIcon />
              </CTAButton>
              <FeatureList>
                <FeatureRow><CreditIcon />1 credit — Perfect for testing</FeatureRow>
                <FeatureRow><AnalysisIcon />1 job match analysis OR</FeatureRow>
                <FeatureRow><ATSIcon />1 ATS optimization OR</FeatureRow>
                <FeatureRow><LetterIcon />1 cover letter</FeatureRow>
                <FeatureRow><SparklesIcon />Full Pro features included</FeatureRow>
                <FeatureRowMuted><ClockIcon />Valid for 30 days</FeatureRowMuted>
                <FeatureRowMuted><ShieldIcon />No subscription, no commitment</FeatureRowMuted>
              </FeatureList>
            </PricingCard>

            {/* Starter Plan - Featured */}
            <PricingCard $featured>
              <Badge>Most popular</Badge>
              <PlanName>Starter</PlanName>
              <PlanPrice>
                <Price>$7</Price>
              </PlanPrice>
              <PriceSubtext>one-time payment</PriceSubtext>
              <PlanDescription>$0.70 per analysis — save 65%</PlanDescription>
              <PlanTagline>Best for active job seekers</PlanTagline>
              <CTAButton $primary onClick={() => router.push("/signup")}>
                Get started <ArrowIcon />
              </CTAButton>
              <FeatureList>
                <FeatureRow><CreditIcon />10 credits — Use however you need</FeatureRow>
                <FeatureRow><AnalysisIcon />Job match analyses</FeatureRow>
                <FeatureRow><ATSIcon />ATS optimizations</FeatureRow>
                <FeatureRow><LetterIcon />Cover letters</FeatureRow>
                <FeatureRow><MixIcon />Mix & match: 5 jobs + 3 ATS + 2 letters</FeatureRow>
                <FeatureRowHighlight><SaveIcon />Save 65% ($0.70 per credit)</FeatureRowHighlight>
                <FeatureRowMuted><ClockIcon />Credits valid for 90 days</FeatureRowMuted>
                <FeatureRowMuted><TargetIcon />Best for 5-10 target positions</FeatureRowMuted>
              </FeatureList>
            </PricingCard>

            {/* Pro Plan */}
            <PricingCard>
              <PlanName>Pro</PlanName>
              <PlanPrice>
                <Price>$12</Price>
              </PlanPrice>
              <PriceSubtext>per month</PriceSubtext>
              <PlanDescription>Unlimited for power users</PlanDescription>
              <PlanTagline>Apply without limits</PlanTagline>
              <CTAButton onClick={() => router.push("/signup")}>
                Get started <ArrowIcon />
              </CTAButton>
              <FeatureList>
                <FeatureRow><InfinityIcon />Unlimited — No limits, no counting</FeatureRow>
                <FeatureRow><AnalysisIcon />Unlimited job match analyses</FeatureRow>
                <FeatureRow><ATSIcon />Unlimited ATS optimizations</FeatureRow>
                <FeatureRow><LetterIcon />Unlimited cover letters</FeatureRow>
                <FeatureRow><RocketIcon />Perfect for graduation season</FeatureRow>
                <FeatureRowHighlight><StarIcon />Best value for 20+ analyses/month</FeatureRowHighlight>
                <FeatureRowMuted><RefreshIcon />Credits never expire while subscribed</FeatureRowMuted>
                <FeatureRowMuted><ShieldIcon />Cancel anytime, no questions asked</FeatureRowMuted>
              </FeatureList>
            </PricingCard>
          </PricingGrid>
        </PricingSection>

        <ComparisonSection>
          <SectionHeader>
            <SectionTitle>Compare Features</SectionTitle>
            <SectionSubtitle>
              See exactly what you get with each plan
            </SectionSubtitle>
          </SectionHeader>

          <ComparisonTableWrapper>
            <ComparisonHeaderRow>
              <ComparisonColTitleEmpty>Feature</ComparisonColTitleEmpty>
              <ComparisonColHeader>
                <ComparisonColTitle>Free</ComparisonColTitle>
              </ComparisonColHeader>
              <ComparisonColHeader>
                <ComparisonColTitle>Pro <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-secondary)' }}>(1 credit)</span></ComparisonColTitle>
              </ComparisonColHeader>
            </ComparisonHeaderRow>

            <ComparisonRow>
              <ComparisonFeature>Job Match Analysis</ComparisonFeature>
              <ComparisonValue><CheckIcon /> Basic score & summary</ComparisonValue>
              <ComparisonValue $isPro><CheckIcon /> Full analysis + AI-optimized resume</ComparisonValue>
            </ComparisonRow>

            <ComparisonRow>
              <ComparisonFeature>ATS Optimizer</ComparisonFeature>
              <ComparisonValue><CheckIcon /> Score & basic checks</ComparisonValue>
              <ComparisonValue $isPro><CheckIcon /> Full report + optimized resume</ComparisonValue>
            </ComparisonRow>

            <ComparisonRow>
              <ComparisonFeature>Cover Letter Generator</ComparisonFeature>
              <ComparisonValue $isCross><CrossMark /></ComparisonValue>
              <ComparisonValue $isPro><CheckIcon /></ComparisonValue>
            </ComparisonRow>

            <ComparisonRow>
              <ComparisonFeature>Missing Keywords</ComparisonFeature>
              <ComparisonValue><CheckIcon /></ComparisonValue>
              <ComparisonValue $isPro><CheckIcon /></ComparisonValue>
            </ComparisonRow>

            <ComparisonRow>
              <ComparisonFeature>ATS Compatibility Score</ComparisonFeature>
              <ComparisonValue><CheckIcon /></ComparisonValue>
              <ComparisonValue $isPro><CheckIcon /></ComparisonValue>
            </ComparisonRow>

            <ComparisonRow>
              <ComparisonFeature>Professional Bullet Points</ComparisonFeature>
              <ComparisonValue $isCross><CrossMark /></ComparisonValue>
              <ComparisonValue $isPro><CheckIcon /></ComparisonValue>
            </ComparisonRow>

            <ComparisonRow>
              <ComparisonFeature>Translate Student Experience</ComparisonFeature>
              <ComparisonValue><CheckIcon /></ComparisonValue>
              <ComparisonValue $isPro><CheckIcon /></ComparisonValue>
            </ComparisonRow>

            <ComparisonRow>
              <ComparisonFeature>Detailed Problem Fixes</ComparisonFeature>
              <ComparisonValue $isCross><CrossMark /></ComparisonValue>
              <ComparisonValue $isPro><CheckIcon /></ComparisonValue>
            </ComparisonRow>
          </ComparisonTableWrapper>

          <ComparisonMessage>
            Start for free, bypass the filter with Pro.
          </ComparisonMessage>
        </ComparisonSection>

        <FAQSection>
          <SectionHeader>
            <SectionTitle>Pricing FAQs</SectionTitle>
            <SectionSubtitle>
              Common questions about our pricing
            </SectionSubtitle>
          </SectionHeader>

          <FAQList>
            {pricingFAQs.map((faq, index) => (
              <FAQItem key={index} $isOpen={openFaq === index}>
                <Question onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <QuestionText>{faq.question}</QuestionText>
                  <QuestionIcon $isOpen={openFaq === index}>
                    {openFaq === index ? "−" : "+"}
                  </QuestionIcon>
                </Question>
                <Answer $isOpen={openFaq === index}>
                  <AnswerText>{faq.answer}</AnswerText>
                </Answer>
              </FAQItem>
            ))}
          </FAQList>
        </FAQSection>

        <SecondaryCTA />
      </Content>
      <Footer />
    </Container>
    </>
  );
}
