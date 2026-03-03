"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { FlipWords } from "@/components/ui/FlipWords";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";
import { Carousel, AppleCard, Card } from "@/components/ui/AppleCarousel";

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
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 24px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 36px;
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
  gap: 32px;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.08) 0%, rgba(var(--primary-700-rgb), 0.08) 100%);
  border: 1px solid var(--primary-200);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 42px;
  font-weight: 900;
  background: var(--landing-button);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const StatLabel = styled.div`
  font-size: 15px;
  color: var(--text-secondary);
  font-weight: 500;
`;

const ProcessSection = styled.section`
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 60px 16px;
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
  background: var(--bg-alt);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
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
      title: "AI Resume Analysis",
      category: "Smart Insights",
      content: (
        <div>
          <p>See exactly what&apos;s wrong with your resume. Our AI analyzes your resume against the job description and reveals:</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Missing keywords that ATS systems are looking for</li>
            <li>Formatting issues that hurt readability</li>
            <li>Weak action verbs and how to strengthen them</li>
            <li>Quantifiable achievements you should highlight</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Get instant, actionable feedback in seconds—not hours.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
      title: "Smart Job Matching",
      category: "Find Your Fit",
      content: (
        <div>
          <p>Stop applying blindly. Our AI finds jobs where your skills actually match what employers are looking for.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Match score for every job posting</li>
            <li>Skills gap analysis and recommendations</li>
            <li>Salary insights based on your experience</li>
            <li>Company culture compatibility indicators</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Apply smarter, not harder. Focus on roles where you&apos;ll succeed.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
      title: "Cover Letter Generator",
      category: "One Click",
      content: (
        <div>
          <p>One click. Personalized letter. Tailored to the job description and your unique experience.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Professionally written in seconds</li>
            <li>Matches the job requirements perfectly</li>
            <li>Highlights your most relevant achievements</li>
            <li>Multiple tone options (formal, creative, casual)</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Never stare at a blank page again.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      title: "ATS-Optimized Resume Builder",
      category: "Built to Pass",
      content: (
        <div>
          <p>Start fresh with an ATS-optimized resume. Clean formatting, right keywords, professional structure.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Templates designed for ATS systems</li>
            <li>Automatic keyword optimization</li>
            <li>Professional formatting that works everywhere</li>
            <li>Export to PDF, Word, or plain text</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Built from the ground up to get past the robots.</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.rejectly.pro' },
          { name: 'How It Works', url: 'https://www.rejectly.pro/how-it-works' }
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
            description: 'Step-by-step guide to transform your resume and get 3x more interviews using AI-powered optimization',
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
                url: 'https://www.rejectly.pro/how-it-works#step-1',
                image: 'https://www.rejectly.pro/og-image.png',
              },
              {
                '@type': 'HowToStep',
                position: 2,
                name: 'Paste Job Description',
                text: 'Copy and paste the job description for the position you want to apply to. Our AI will analyze the match between your resume and the job requirements.',
                url: 'https://www.rejectly.pro/how-it-works#step-2',
                image: 'https://www.rejectly.pro/og-image.png',
              },
              {
                '@type': 'HowToStep',
                position: 3,
                name: 'AI Analysis & Insights',
                text: 'Our GPT-4 powered AI analyzes your resume in 15-30 seconds, identifying gaps, ATS compatibility issues, and providing actionable recommendations.',
                url: 'https://www.rejectly.pro/how-it-works#step-3',
                image: 'https://www.rejectly.pro/og-image.png',
              },
              {
                '@type': 'HowToStep',
                position: 4,
                name: 'Get Optimized Resume',
                text: 'Download your AI-optimized resume with improved keywords, rewritten bullet points, and ATS-friendly formatting. Start applying and get 3x more interviews.',
                url: 'https://www.rejectly.pro/how-it-works#step-4',
                image: 'https://www.rejectly.pro/og-image.png',
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
            Transform Your{" "}
            <FlipWords words={["Job Search", "Career", "Resume", "Future"]} duration={2500} />
          </HeroTitle>
        <HeroSubtitle>
          From resume upload to your dream job in 4 simple steps. Our AI-powered
          platform helps you create resumes that get noticed.
        </HeroSubtitle>
        <StatsGrid>
          <StatCard>
            <StatNumber>50K+</StatNumber>
            <StatLabel>Resumes Analyzed</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>85%</StatNumber>
            <StatLabel>ATS Pass Rate</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>30s</StatNumber>
            <StatLabel>Analysis Time</StatLabel>
          </StatCard>
        </StatsGrid>
      </HeroSection>

      <ProcessSection>
        <SectionHeader>
          <SectionTitle>Everything you need.</SectionTitle>
          <SectionSubtitle>
            Everything works together to get you hired.
          </SectionSubtitle>
        </SectionHeader>

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
          {/* Left tall card - GPT-4 Powered */}
          <BentoCard $span="tall" $position="left">
            <BentoCardContent $tall>
              <BentoCardTitle>Advanced AI Analysis</BentoCardTitle>
              <BentoCardDescription>
                Cutting-edge language models that understand context, not just keywords. Our AI reads your resume like a human recruiter would.
              </BentoCardDescription>
              <BentoCardVisual>
                <StatHighlight>
                  <div className="number">GPT-4</div>
                  <div className="label">Next-Gen Intelligence</div>
                </StatHighlight>
              </BentoCardVisual>
              <FeatureList>
                <FeatureListItem>Contextual understanding</FeatureListItem>
                <FeatureListItem>Smart keyword extraction</FeatureListItem>
                <FeatureListItem>Industry-specific analysis</FeatureListItem>
                <FeatureListItem>Continuous improvements</FeatureListItem>
              </FeatureList>
            </BentoCardContent>
          </BentoCard>

          {/* Top middle card - Instant Results */}
          <BentoCard>
            <BentoCardContent>
              <BentoCardTitle>Instant Results</BentoCardTitle>
              <BentoCardDescription>
                Get detailed analysis and recommendations in seconds, not hours.
              </BentoCardDescription>
              <BentoCardVisual>
                <StatHighlight>
                  <div className="number">30s</div>
                  <div className="label">Average Analysis Time</div>
                </StatHighlight>
              </BentoCardVisual>
            </BentoCardContent>
          </BentoCard>

          {/* Right tall card - ATS Optimized */}
          <BentoCard $span="tall" $position="right">
            <BentoCardContent $tall>
              <BentoCardTitle>ATS Optimized</BentoCardTitle>
              <BentoCardDescription>
                Beat the robots. Our AI ensures your resume passes through automated screening systems with flying colors.
              </BentoCardDescription>
              <BentoCardVisual>
                <StatHighlight>
                  <div className="number">85%</div>
                  <div className="label">Higher Pass Rate</div>
                </StatHighlight>
              </BentoCardVisual>
              <FeatureList>
                <FeatureListItem>Keyword optimization</FeatureListItem>
                <FeatureListItem>Format compatibility</FeatureListItem>
                <FeatureListItem>Section structure analysis</FeatureListItem>
                <FeatureListItem>Parsing verification</FeatureListItem>
              </FeatureList>
            </BentoCardContent>
          </BentoCard>

          {/* Bottom middle card - Multi-Language */}
          <BentoCard>
            <BentoCardContent>
              <BentoCardTitle>Works in Any Language</BentoCardTitle>
              <BentoCardDescription>
                Upload resumes and job descriptions in any language. Our AI understands and analyzes content globally.
              </BentoCardDescription>
              <BentoCardVisual>
                <StatHighlight>
                  <div className="number">50+</div>
                  <div className="label">Languages Supported</div>
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
