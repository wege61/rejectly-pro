"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { FlipWords } from "@/components/ui/FlipWords";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";

// ==================== ICONS ====================
const UploadIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const DocumentTextIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// ==================== STYLED COMPONENTS ====================
const Container = styled.div`
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding-bottom: 60px;
`;

const HeroSection = styled.section`
  padding: 120px 24px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 80px 16px 60px;
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

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const ProcessCard = styled.div<{ $color: string; $bgGradient: string }>`
  background: ${({ $bgGradient }) => $bgGradient};
  border: 1px solid ${({ $color }) => `${$color}40`};
  border-radius: 20px;
  padding: 40px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px ${({ $color }) => `${$color}20`};
  }

  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const StepNumber = styled.div<{ $color: string }>`
  position: absolute;
  top: -16px;
  left: 40px;
  width: 48px;
  height: 48px;
  background: ${({ $color }) => $color};
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 900;
  box-shadow: 0 8px 16px ${({ $color }) => `${$color}40`};

  @media (max-width: 768px) {
    left: 32px;
  }
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  svg {
    width: 40px;
    height: 40px;
    color: ${({ $color }) => $color};
  }
`;

const ProcessTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ProcessDescription = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 24px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FeatureItem = styled.li<{ $color: string }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  color: var(--text-secondary);

  svg {
    width: 20px;
    height: 20px;
    color: ${({ $color }) => $color};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const BenefitsSection = styled.section`
  padding: 80px 24px;
  background: linear-gradient(135deg, rgba(191, 172, 226, 0.03) 0%, rgba(180, 231, 245, 0.03) 100%);

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const BenefitCard = styled.div`
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-200);
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.1);
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const BenefitIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.1) 0%, rgba(var(--primary-700-rgb), 0.1) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 32px;
    height: 32px;
    color: var(--primary-500);
  }
`;

const BenefitTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-color);
`;

const BenefitDescription = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
`;


export default function HowItWorksPage() {
  const router = useRouter();

  const processes = [
    {
      number: 1,
      title: "Upload & Analyze",
      description: "Upload your resume and job description. Our AI analyzes the match in 15-30 seconds and gives you an instant score.",
      icon: <UploadIcon />,
      color: "#FF8FA3",
      bgGradient: "linear-gradient(135deg, rgba(255, 179, 186, 0.08) 0%, rgba(255, 204, 229, 0.08) 100%)",
      features: [
        "PDF, DOCX, or text paste",
        "Instant AI analysis",
        "Match score (0-100%)",
        "Missing keywords identification",
      ],
    },
    {
      number: 2,
      title: "Get Smart Recommendations",
      description: "Receive detailed AI-powered feedback with actionable suggestions to improve your resume and increase your match score.",
      icon: <SparklesIcon />,
      color: "var(--primary-500)",
      bgGradient: "linear-gradient(135deg, rgba(180, 231, 245, 0.08) 0%, rgba(199, 233, 251, 0.08) 100%)",
      features: [
        "ATS optimization tips",
        "Professional rewriting suggestions",
        "Formatting improvements",
        "Keyword integration advice",
      ],
    },
    {
      number: 3,
      title: "Generate Cover Letter",
      description: "Create compelling, personalized cover letters with AI. Get job recommendations tailored to your skills and experience.",
      icon: <DocumentTextIcon />,
      color: "var(--accent)",
      bgGradient: "linear-gradient(135deg, rgba(191, 172, 226, 0.08) 0%, rgba(212, 197, 249, 0.08) 100%)",
      features: [
        "AI-generated cover letters",
        "Personalized job matches",
        "Alternative role suggestions",
        "One-click creation",
      ],
    },
    {
      number: 4,
      title: "Download Optimized Resume",
      description: "Get a professionally optimized resume with all improvements. ATS-friendly formatting and 85% higher pass rate.",
      icon: <CheckCircleIcon />,
      color: "var(--success)",
      bgGradient: "linear-gradient(135deg, rgba(185, 232, 216, 0.08) 0%, rgba(208, 240, 228, 0.08) 100%)",
      features: [
        "AI-optimized resume",
        "Professional formatting",
        "Keyword integration",
        "Download as PDF",
      ],
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
          <SectionTitle>How It Works</SectionTitle>
          <SectionSubtitle>
            Four simple steps to create a resume that stands out
          </SectionSubtitle>
        </SectionHeader>

        <ProcessGrid>
          {processes.map((process) => (
            <ProcessCard key={process.number} $color={process.color} $bgGradient={process.bgGradient}>
              <StepNumber $color={process.color}>{process.number}</StepNumber>
              <IconWrapper $color={process.color}>{process.icon}</IconWrapper>
              <ProcessTitle>{process.title}</ProcessTitle>
              <ProcessDescription>{process.description}</ProcessDescription>
              <FeaturesList>
                {process.features.map((feature, idx) => (
                  <FeatureItem key={idx} $color={process.color}>
                    <CheckCircleIcon />
                    <span>{feature}</span>
                  </FeatureItem>
                ))}
              </FeaturesList>
            </ProcessCard>
          ))}
        </ProcessGrid>
      </ProcessSection>

      <BenefitsSection>
        <SectionHeader>
          <SectionTitle>Why Choose Rejectly.pro?</SectionTitle>
          <SectionSubtitle>
            Powerful features designed to help you succeed
          </SectionSubtitle>
        </SectionHeader>

        <BenefitsGrid>
          <BenefitCard>
            <BenefitIcon>
              <SparklesIcon />
            </BenefitIcon>
            <BenefitTitle>GPT-4 Powered</BenefitTitle>
            <BenefitDescription>
              Advanced AI technology that understands context, not just keywords.
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>
              <SparklesIcon />
            </BenefitIcon>
            <BenefitTitle>Instant Results</BenefitTitle>
            <BenefitDescription>
              Get detailed analysis and recommendations in 30 seconds or less.
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>
              <SparklesIcon />
            </BenefitIcon>
            <BenefitTitle>ATS Optimized</BenefitTitle>
            <BenefitDescription>
              85% higher pass rate through automated resume screening systems.
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>
              <SparklesIcon />
            </BenefitIcon>
            <BenefitTitle>Privacy First</BenefitTitle>
            <BenefitDescription>
              GDPR compliant with encrypted data storage and no third-party sharing.
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>
              <SparklesIcon />
            </BenefitIcon>
            <BenefitTitle>Multi-Language</BenefitTitle>
            <BenefitDescription>
              Support for English and Turkish resumes with high accuracy.
            </BenefitDescription>
          </BenefitCard>

          <BenefitCard>
            <BenefitIcon>
              <SparklesIcon />
            </BenefitIcon>
            <BenefitTitle>Job Matching</BenefitTitle>
            <BenefitDescription>
              Discover better-fit positions with our smart job recommendation engine.
            </BenefitDescription>
          </BenefitCard>
        </BenefitsGrid>
      </BenefitsSection>

      <SecondaryCTA />

      <Footer />
    </Container>
    </>
  );
}
