"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { FlipWords } from "@/components/ui/FlipWords";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";
import { Carousel, AppleCard, Card, ScreenshotStack, CardLead, CardKicker, FeatureList as CardFeatureList } from "@/components/ui/AppleCarousel";

// ==================== STYLED COMPONENTS ====================
const Container = styled.div`
  min-height: 100vh;
  margin-top: 40px;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 80px 24px 60px;

  @media (max-width: 768px) {
    padding: 60px 16px 40px;
  }
`;

const HeroSection = styled.section`
  padding: 0 0 80px;
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0 0 60px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 64px;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 42px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 48px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px;
  }
`;

const StatCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 24px;
  overflow: hidden;

  /* Apple Liquid Glass core */
background: rgba(24, 24, 24, 0.6);
  backdrop-filter: blur(60px) saturate(200%);
  -webkit-backdrop-filter: blur(60px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  padding: 40px 24px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  /* ── Specular light refraction ─── */
  /* Top highlight — light hits the glass from above */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1.5px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 40%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0.3) 60%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  /* Right-edge refraction — light exits through the glass face */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      rgba(255, 255, 255, 0.0) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(32, 32, 32, 0.7);
    box-shadow:
      0 20px 56px rgba(0, 0, 0, 0.65),
      0 6px 20px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
`;

const StatNumber = styled.div`
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -2px;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
  filter: drop-shadow(0 2px 12px rgba(255, 255, 255, 0.1));
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const ProcessSection = styled.section`
  /* Full viewport width breakout */
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 80px 0;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const ProcessSectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 768px) {
    padding: 0 16px;
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
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const BenefitsSection = styled.section`
  padding: 80px 24px;
  background: var(--bg-color);

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const BentoGrid = styled.div`
  display: grid;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }

  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
`;

const BentoCard = styled.div<{ $span?: "tall" | "normal"; $position?: "left" | "right" | "top" | "bottom" }>`
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  /* Apple Liquid Glass core */
  background: rgba(24, 24, 24, 0.6);
  backdrop-filter: blur(60px) saturate(200%);
  -webkit-backdrop-filter: blur(60px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  /* ── Specular light refraction ─── */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.25) 40%,
      rgba(255, 255, 255, 0.45) 50%,
      rgba(255, 255, 255, 0.25) 60%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      rgba(255, 255, 255, 0.0) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-6px) scale(1.01);
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(32, 32, 32, 0.7);
    box-shadow:
      0 20px 56px rgba(0, 0, 0, 0.65),
      0 6px 20px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 1024px) {
    ${({ $span }) => $span === "tall" && `grid-row: span 2;`}

    ${({ $position }) => {
      if ($position === "left") return `border-radius: 32px 24px 24px 32px;`;
      if ($position === "right") return `border-radius: 24px 32px 32px 24px;`;
      return "";
    }}
  }

  @media (max-width: 1023px) {
    ${({ $position }) => {
      if ($position === "left") return `border-radius: 32px 32px 24px 24px;`;
      if ($position === "right") return `border-radius: 24px 24px 32px 32px;`;
      return "";
    }}
  }
`;

const BentoCardContent = styled.div<{ $tall?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 32px;

  ${({ $tall }) => $tall && `
    min-height: 400px;

    @media (min-width: 1024px) {
      min-height: 100%;
    }
  `}

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const BentoCardTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const BentoCardDescription = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 24px;
`;

const BentoCardVisual = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 120px;
`;

const StatHighlight = styled.div`
  text-align: center;

  .number {
    font-size: 64px;
    font-weight: 900;
    background: var(--landing-button);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: 8px;

    @media (max-width: 768px) {
      font-size: 48px;
    }
  }

  .label {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

const FeatureListItem = styled.li`
  font-size: 14px;
  color: var(--text-secondary);
  padding-left: 20px;
  position: relative;
  line-height: 1.6;

  &::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--primary-500);
    font-weight: 600;
  }
`;

export default function HowItWorksPage() {
  const featureCards: Card[] = [
    {
      src: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop",
      title: "The ATS Filter Reverse-Engineering",
      category: "Hack The Filter",
      content: (
        <>
          <CardLead>See exactly why the bot rejected you. Our AI reverse-engineers the job description and reveals:</CardLead>
          <CardFeatureList
            items={[
              <>The exact corporate keywords the ATS is filtering for</>,
              <>Where your academic projects fall short of the algorithm</>,
              <>Action verbs that bypass junior-level filters</>,
              <>How to quantify school projects to look like real experience</>,
            ]}
          />
          <CardKicker>Don&apos;t guess what the recruiter wants. Know exactly what the bot needs.</CardKicker>
        </>
      ),
    },
    {
      src: "/reports-list.png",
      title: "Score Your Resume Against Any Job",
      category: "Match Intelligence",
      content: (
        <>
          <ScreenshotStack
            base="/reports-list.png"
            detail="/reports-detail.png"
            baseAlt="AI Job Matching Dashboard List"
            detailAlt="Detailed Match Analysis View"
          />
          <CardLead>Don&apos;t apply blindly. Paste the job description you want, and our AI will score your current resume against the exact corporate requirements.</CardLead>
          <CardFeatureList
            items={[
              <>Instant match score for the specific job posting</>,
              <>Identifies the exact skills and keywords you&apos;re missing</>,
              <>Highlights where your university tech stack matches the job</>,
              <>Warns you if your CV needs a major rewrite to pass</>,
            ]}
          />
          <CardKicker>Know if you can pass the filter before you even apply.</CardKicker>
        </>
      ),
    },
    {
      src: "/cover-letters-list.png",
      title: "The Human Hook (Cover Letters)",
      category: "Personalized Outreach",
      content: (
        <>
          <ScreenshotStack
            base="/cover-letters-list.png"
            detail="/cover-letters-detail.png"
            baseAlt="Cover Letters Dashboard"
            detailAlt="Generated Cover Letter Detail View"
          />
          <CardLead>Once you beat the bot, you need to convince the human. Generate cover letters that explain why your hunger beats 3 years of mediocre experience.</CardLead>
          <CardFeatureList
            items={[
              <>Frames academic work as high-impact projects</>,
              <>Directly addresses the lack of formal experience with confidence</>,
              <>Matches the specific company culture and tone</>,
              <>Instantly generated from your ATS-optimized resume</>,
            ]}
          />
          <CardKicker>Prove you&apos;re the junior they need to hire.</CardKicker>
        </>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      title: "The Corporate Translator",
      category: "Resume Builder",
      content: (
        <>
          <CardLead>Turn &quot;built a react app for class&quot; into &quot;Architected a scalable frontend application.&quot; Our builder speaks corporate.</CardLead>
          <CardFeatureList
            items={[
              <>Translates student terminology into HR keywords</>,
              <>Templates designed specifically to bypass modern ATS systems</>,
              <>Automatic keyword density optimization</>,
              <>Hides junior-level tells and highlights actual capabilities</>,
            ]}
          />
          <CardKicker>Built from the ground up to get you that first interview.</CardKicker>
        </>
      ),
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://rejectly.pro' },
          { name: 'How It Works', url: 'https://rejectly.pro/how-it-works' }
        ]}
      />
      {/* HowTo Schema */}
      <script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Optimize Your Resume with Rejectly.pro',
            description: 'Step-by-step guide to creating job-specific, ATS-optimized resumes with AI-powered tools',
            totalTime: 'PT2M',
            estimatedCost: {
              '@type': 'MonetaryAmount',
              currency: 'USD',
              value: '2.00',
            },
            step: [
              {
                '@type': 'HowToStep',
                position: 1,
                name: 'Upload Your Resume',
                text: 'Upload your current resume in PDF or DOCX format, or paste your resume text directly. Our AI can parse any format.',
                url: 'https://rejectly.pro/how-it-works#step-1',
                image: 'https://rejectly.pro/og-image.png',
              },
              {
                '@type': 'HowToStep',
                position: 2,
                name: 'Paste Job Description',
                text: 'Copy and paste the job description for the position you want to apply to. Our AI will analyze the match between your resume and the job requirements.',
                url: 'https://rejectly.pro/how-it-works#step-2',
                image: 'https://rejectly.pro/og-image.png',
              },
              {
                '@type': 'HowToStep',
                position: 3,
                name: 'AI Analysis & Insights',
                text: 'Our GPT-4 powered AI analyzes your resume in under a minute, identifying gaps, ATS compatibility issues, and providing actionable recommendations.',
                url: 'https://rejectly.pro/how-it-works#step-3',
                image: 'https://rejectly.pro/og-image.png',
              },
              {
                '@type': 'HowToStep',
                position: 4,
                name: 'Get Optimized Resume',
                text: 'Download your AI-optimized resume with improved keywords, rewritten bullet points, and ATS-friendly formatting. Start applying with a resume built specifically for each job.',
                url: 'https://rejectly.pro/how-it-works#step-4',
                image: 'https://rejectly.pro/og-image.png',
              },
            ],
            tool: [
              {
                '@type': 'HowToTool',
                name: 'Resume (PDF or DOCX)',
              },
              {
                '@type': 'HowToTool',
                name: 'Job Description',
              },
            ],
          })
        }}
      />
      <Container>
        <HeroSection>
          <HeroTitle>
            How To Bypass The <br /> ATS Filter
          </HeroTitle>
        <HeroSubtitle>
          The corporate system filters out new grads automatically. Here is exactly how Rejectly 
          translates your university experience into the corporate ATS keywords they demand.
        </HeroSubtitle>
        <StatsGrid>
          <StatCard>
            <StatNumber>50+</StatNumber>
            <StatLabel>ATS Systems Bypassed</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>0 to 3</StatNumber>
            <StatLabel>Years Experience Gap Bridged</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>&lt;60s</StatNumber>
            <StatLabel>ATS Translation Time</StatLabel>
          </StatCard>
        </StatsGrid>
      </HeroSection>

      <ProcessSection>
        <ProcessSectionContent>
          <SectionHeader>
            <SectionTitle>Your complete application toolkit.</SectionTitle>
            <SectionSubtitle>
              Job Match, ATS Optimizer, Cover Letters, CV Builder &mdash; everything works together to get you hired.
            </SectionSubtitle>
          </SectionHeader>
        </ProcessSectionContent>

        <Carousel
          items={featureCards.map((card, index) => (
            <AppleCard key={card.title} card={card} index={index} layout />
          ))}
        />
      </ProcessSection>

      <BenefitsSection>
        <SectionHeader>
          <SectionTitle>Why choose Rejectly.pro?</SectionTitle>
          <SectionSubtitle>
            Powerful features designed to help you succeed
          </SectionSubtitle>
        </SectionHeader>

        <BentoGrid>
          {/* Left tall card */}
          <BentoCard $span="tall" $position="left">
            <BentoCardContent $tall>
              <BentoCardTitle>Translate Academic into Corporate</BentoCardTitle>
              <BentoCardDescription>
                We know you don't have 5 years of corporate experience. Our system analyzes your university projects, coursework, and extracurriculars, and translates them into the exact professional terminology recruiters search for.
              </BentoCardDescription>
              <BentoCardVisual>
                <StatHighlight>
                  <div className="number">100%</div>
                  <div className="label">Student to Pro</div>
                </StatHighlight>
              </BentoCardVisual>
              <FeatureList>
                <FeatureListItem>Extracts skills from school projects</FeatureListItem>
                <FeatureListItem>Translates club leadership to management</FeatureListItem>
                <FeatureListItem>Frames hackathons as product ships</FeatureListItem>
                <FeatureListItem>Hides junior-level tells</FeatureListItem>
              </FeatureList>
            </BentoCardContent>
          </BentoCard>

          {/* Top middle card */}
          <BentoCard>
            <BentoCardContent>
              <BentoCardTitle>Beat the Experience Trap</BentoCardTitle>
              <BentoCardDescription>
                Stop getting automatically rejected for &quot;lack of experience&quot; before a human even reads your name.
              </BentoCardDescription>
              <BentoCardVisual>
                <StatHighlight>
                  <div className="number">Bypass</div>
                  <div className="label">The Auto-Reject</div>
                </StatHighlight>
              </BentoCardVisual>
            </BentoCardContent>
          </BentoCard>

          {/* Right tall card */}
          <BentoCard $span="tall" $position="right">
            <BentoCardContent $tall>
              <BentoCardTitle>Hack the Exact ATS Filter</BentoCardTitle>
              <BentoCardDescription>
                Every company uses a different ATS. Workday scans differently than Greenhouse. We read the job description and inject the exact keywords their specific algorithm is trained to catch.
              </BentoCardDescription>
              <BentoCardVisual>
                <StatHighlight>
                  <div className="number">95%+</div>
                  <div className="label">Target Match Score</div>
                </StatHighlight>
              </BentoCardVisual>
              <FeatureList>
                <FeatureListItem>Workday/Greenhouse/Lever ready</FeatureListItem>
                <FeatureListItem>Keyword density optimization</FeatureListItem>
                <FeatureListItem>Format compatibility check</FeatureListItem>
                <FeatureListItem>Hard vs Soft skill balancing</FeatureListItem>
              </FeatureList>
            </BentoCardContent>
          </BentoCard>

          {/* Bottom middle card */}
          <BentoCard>
            <BentoCardContent>
              <BentoCardTitle>Global Bypass</BentoCardTitle>
              <BentoCardDescription>
                Whether you're applying in the US, Europe, or Asia, our tools understand and bypass regional hiring algorithms.
              </BentoCardDescription>
              <BentoCardVisual>
                <StatHighlight>
                  <div className="number">50+</div>
                  <div className="label">Countries Supported</div>
                </StatHighlight>
              </BentoCardVisual>
            </BentoCardContent>
          </BentoCard>
        </BentoGrid>
      </BenefitsSection>

      <SecondaryCTA />

      <Footer />
    </Container>
    </>
  );
}
