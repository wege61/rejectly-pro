"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 80px 24px 60px;

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
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: var(--bg-alt);
  border: 2px solid ${({ $featured }) => ($featured ? "var(--accent)" : "var(--border-color)")};
  border-radius: 20px;
  padding: 48px;
  position: relative;
  transition: all 0.3s ease;

  ${({ $featured }) =>
    $featured &&
    `
    box-shadow: 0 10px 40px rgba(var(--accent-rgb), 0.25);
    transform: scale(1.05);
  `}

  &:hover {
    transform: ${({ $featured }) => ($featured ? "scale(1.07)" : "translateY(-8px)")};
    box-shadow: 0 15px 50px rgba(var(--accent-rgb), 0.2);
  }

  @media (max-width: 968px) {
    transform: none !important;
    padding: 40px;

    &:hover {
      transform: translateY(-4px) !important;
    }
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
`;

const PlanName = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-color);
`;

const PlanPrice = styled.div`
  margin-bottom: 32px;
`;

const Price = styled.div`
  font-size: 56px;
  font-weight: 900;
  color: var(--text-color);
  line-height: 1;

  span {
    font-size: 20px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const PriceSubtext = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 8px;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
`;

const Feature = styled.li<{ $enabled?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  font-size: 16px;
  color: ${({ $enabled }) => ($enabled ? "var(--text-secondary)" : "var(--text-tertiary)")};
  opacity: ${({ $enabled }) => ($enabled ? 1 : 0.5)};

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 2px;
    color: ${({ $enabled }) => ($enabled ? "var(--success)" : "var(--error)")};
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

const ComparisonTable = styled.div`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
`;

const TableRow = styled.div<{ $header?: boolean }>`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }

  ${({ $header }) =>
    $header &&
    `
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.08) 0%, rgba(var(--primary-700-rgb), 0.08) 100%);
    font-weight: 700;
  `}

  @media (max-width: 768px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
  }
`;

const TableCell = styled.div<{ $center?: boolean }>`
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: ${({ $center }) => ($center ? "center" : "flex-start")};
  font-size: 15px;
  color: var(--text-secondary);

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px 12px;
    font-size: 14px;
  }
`;

const FeatureName = styled.span`
  color: var(--text-color);
  font-weight: 500;
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
  border: 1px solid var(--border-color);
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

const XIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const features = [
  { name: "Pro analyses", single: "1", starter: "10", pro: "Unlimited" },
  { name: "Match score analysis", single: true, starter: true, pro: true },
  { name: "All missing keywords", single: true, starter: true, pro: true },
  { name: "Job postings comparison", single: "Up to 10", starter: "Up to 10", pro: "Up to 10" },
  { name: "Professional bullet rewriting", single: "3 bullets", starter: "3 bullets", pro: "3 bullets" },
  { name: "ATS optimization guide", single: true, starter: true, pro: true },
  { name: "Alternative role suggestions", single: "3 roles", starter: "3 roles", pro: "3 roles" },
  { name: "AI-generated optimized resume", single: true, starter: true, pro: true },
  { name: "PDF download", single: true, starter: true, pro: true },
  { name: "Priority support", single: false, starter: false, pro: true },
];

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
          { name: 'Home', url: 'https://www.rejectly.pro' },
          { name: 'Pricing', url: 'https://www.rejectly.pro/pricing' }
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
            image: 'https://www.rejectly.pro/logo.png',
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
                url: 'https://www.rejectly.pro/pricing',
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
                url: 'https://www.rejectly.pro/pricing',
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
                url: 'https://www.rejectly.pro/pricing',
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
                <Price>
                  $2<span> one-time</span>
                </Price>
                <PriceSubtext>Try it out with 1 analysis</PriceSubtext>
              </PlanPrice>
              <FeatureList>
                <Feature $enabled>
                  <CheckIcon />
                  <span>1 Pro analysis</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>Detailed match insights</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>All missing keywords</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>3 bullet points rewritten</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>ATS optimization guide</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>3 role recommendations</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>AI-optimized resume</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>PDF download</span>
                </Feature>
              </FeatureList>
              <Button
                size="lg"
                variant="secondary"
                fullWidth
                onClick={() => router.push("/signup")}
              >
                Buy Single
              </Button>
            </PricingCard>

            {/* Starter Plan */}
            <PricingCard $featured>
              <Badge>BEST VALUE</Badge>
              <PlanName>Starter</PlanName>
              <PlanPrice>
                <Price>
                  $7<span> one-time</span>
                </Price>
                <PriceSubtext>$0.70 per report - save 65%</PriceSubtext>
              </PlanPrice>
              <FeatureList>
                <Feature $enabled>
                  <CheckIcon />
                  <span>10 Pro analyses</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>Detailed match insights</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>All missing keywords</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>3 bullet points rewritten</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>ATS optimization guide</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>3 role recommendations</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>AI-optimized resume</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>PDF download</span>
                </Feature>
              </FeatureList>
              <Button
                style={{background: "var(--accent)"}}
                size="lg"
                fullWidth
                onClick={() => router.push("/signup")}
              >
                Buy Starter
              </Button>
            </PricingCard>

            {/* Pro Plan */}
            <PricingCard>
              <PlanName>Pro</PlanName>
              <PlanPrice>
                <Price>
                  $12<span>/month</span>
                </Price>
                <PriceSubtext>Unlimited analyses for power users</PriceSubtext>
              </PlanPrice>
              <FeatureList>
                <Feature $enabled>
                  <CheckIcon />
                  <span>Unlimited Pro analyses</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>Detailed match insights</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>All missing keywords</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>3 bullet points rewritten</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>ATS optimization guide</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>3 role recommendations</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>AI-optimized resume</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>PDF download</span>
                </Feature>
                <Feature $enabled>
                  <CheckIcon />
                  <span>Priority support</span>
                </Feature>
              </FeatureList>
              <Button
                size="lg"
                variant="secondary"
                fullWidth
                onClick={() => router.push("/signup")}
              >
                Subscribe to Pro
              </Button>
            </PricingCard>
          </PricingGrid>
        </PricingSection>

        <ComparisonSection>
          <SectionHeader>
            <SectionTitle>Feature Comparison</SectionTitle>
            <SectionSubtitle>
              See exactly what's included in each plan
            </SectionSubtitle>
          </SectionHeader>

          <ComparisonTable>
            <TableRow $header>
              <TableCell>
                <FeatureName>Feature</FeatureName>
              </TableCell>
              <TableCell $center>
                <FeatureName>Single</FeatureName>
              </TableCell>
              <TableCell $center>
                <FeatureName>Starter</FeatureName>
              </TableCell>
              <TableCell $center>
                <FeatureName>Pro</FeatureName>
              </TableCell>
            </TableRow>
            {features.map((feature, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FeatureName>{feature.name}</FeatureName>
                </TableCell>
                <TableCell $center>
                  {typeof feature.single === "boolean" ? (
                    feature.single ? (
                      <CheckIcon />
                    ) : (
                      <XIcon />
                    )
                  ) : (
                    <span>{feature.single}</span>
                  )}
                </TableCell>
                <TableCell $center>
                  {typeof feature.starter === "boolean" ? (
                    feature.starter ? (
                      <CheckIcon />
                    ) : (
                      <XIcon />
                    )
                  ) : (
                    <span>{feature.starter}</span>
                  )}
                </TableCell>
                <TableCell $center>
                  {typeof feature.pro === "boolean" ? (
                    feature.pro ? (
                      <CheckIcon />
                    ) : (
                      <XIcon />
                    )
                  ) : (
                    <span>{feature.pro}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </ComparisonTable>
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
