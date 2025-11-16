"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

// ==================== ICONS ====================
const TargetIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const RocketIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const LightBulbIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const HandshakeIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
    />
  </svg>
);

const AcademicCapIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l9-5-9-5-9 5 9 5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
    />
  </svg>
);

const LockIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const ZapIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

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
  background: #E2A16F;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

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

const Section = styled.section`
  margin-bottom: 120px;

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 24px;
  text-align: center;
  background: linear-gradient(135deg, #B4E7F5 0%, #BFACE2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SectionText = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 32px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const StorySection = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 179, 186, 0.1) 0%,
    rgba(191, 172, 226, 0.1) 100%
  );
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 64px 48px;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    padding: 40px 24px;
    margin-bottom: 48px;
  }
`;

const StoryTitle = styled.h2`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #FFB3BA 0%, #FFC6D3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const StoryParagraph = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const MissionVisionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 80px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 48px;
  }
`;

const MissionVisionCard = styled.div`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 48px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(180, 231, 245, 0.15);
  }

  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const CardIcon = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  svg {
    width: 48px;
    height: 48px;
    color: var(--primary-color);
  }
`;

const CardTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #B4E7F5 0%, #B9E8D8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CardText = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.7;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ValueCard = styled.div`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 40px 32px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(191, 172, 226, 0.4);
    box-shadow: 0 8px 30px rgba(191, 172, 226, 0.12);
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const ValueIcon = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
    color: var(--primary-color);
  }
`;

const ValueTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-color);
`;

const ValueText = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const TeamSection = styled.div`
  background: linear-gradient(
    135deg,
    rgba(180, 231, 245, 0.1) 0%,
    rgba(185, 232, 216, 0.1) 100%
  );
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 64px 48px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const TeamTitle = styled.h2`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #B9E8D8 0%, #B4E7F5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const TeamText = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto 40px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const TeamStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(135deg, #FFB3BA 0%, #FFC6D3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: var(--text-secondary);
  font-weight: 500;
`;

const CTASection = styled.section`
  background: linear-gradient(
    135deg,
    rgba(255, 179, 186, 0.15) 0%,
    rgba(255, 198, 211, 0.15) 100%
  );
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 80px 48px;
  text-align: center;
  margin-bottom: 120px;

  @media (max-width: 768px) {
    padding: 48px 24px;
    margin-bottom: 80px;
  }
`;

const CTATitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #FFB3BA 0%, #BFACE2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const CTAText = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 32px;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

export default function AboutPage() {
  const router = useRouter();

  return (
    <Container>
      <Content>
        <Header>
          <Title>About Rejectly.pro</Title>
          <Subtitle>
            Empowering job seekers with AI-driven insights to land their dream careers
          </Subtitle>
        </Header>

        <StorySection>
          <StoryTitle>Our Story</StoryTitle>
          <StoryParagraph>
            Rejectly.pro was born from a simple observation: talented professionals were
            getting rejected not because they lacked skills, but because their resumes
            didn't effectively communicate their value. We saw countless qualified
            candidates struggling to get past applicant tracking systems and hiring
            managers, simply because their resume format or content wasn't optimized.
          </StoryParagraph>
          <StoryParagraph>
            We built Rejectly.pro to level the playing field. Our AI-powered platform
            analyzes your resume the same way recruiters and ATS systems do, providing
            actionable insights that help you present your experience in the best
            possible light. We believe everyone deserves a fair shot at their dream job,
            and we're here to make that happen.
          </StoryParagraph>
          <StoryParagraph>
            Today, we're proud to help thousands of job seekers optimize their resumes,
            increase their interview callbacks, and ultimately land the positions they
            deserve. Our mission continues to evolve, but our core commitment remains the
            same: helping you succeed in your career journey.
          </StoryParagraph>
        </StorySection>

        <MissionVisionGrid>
          <MissionVisionCard>
            <CardIcon>
              <TargetIcon />
            </CardIcon>
            <CardTitle>Our Mission</CardTitle>
            <CardText>
              To democratize access to professional resume optimization, ensuring every
              job seeker has the tools and insights they need to present themselves
              effectively to potential employers, regardless of their background or
              resources.
            </CardText>
          </MissionVisionCard>

          <MissionVisionCard>
            <CardIcon>
              <RocketIcon />
            </CardIcon>
            <CardTitle>Our Vision</CardTitle>
            <CardText>
              To become the world's most trusted platform for career advancement,
              transforming how people approach job applications and empowering millions to
              achieve their professional goals through intelligent, data-driven resume
              optimization.
            </CardText>
          </MissionVisionCard>
        </MissionVisionGrid>

        <Section>
          <SectionTitle>Our Core Values</SectionTitle>
          <SectionText>
            These principles guide everything we do and shape how we serve our users
          </SectionText>

          <ValuesGrid>
            <ValueCard>
              <ValueIcon>
                <LightBulbIcon />
              </ValueIcon>
              <ValueTitle>Innovation</ValueTitle>
              <ValueText>
                We constantly push boundaries, leveraging cutting-edge AI technology to
                deliver smarter, more effective resume analysis tools.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <HandshakeIcon />
              </ValueIcon>
              <ValueTitle>Accessibility</ValueTitle>
              <ValueText>
                Everyone deserves access to quality career tools. We're committed to
                keeping our platform affordable and user-friendly for all.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <AcademicCapIcon />
              </ValueIcon>
              <ValueTitle>Education</ValueTitle>
              <ValueText>
                We don't just tell you what's wrong—we explain why and teach you best
                practices for long-term career success.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <LockIcon />
              </ValueIcon>
              <ValueTitle>Privacy</ValueTitle>
              <ValueText>
                Your career information is sensitive. We employ industry-leading security
                measures to protect your data at all times.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <ZapIcon />
              </ValueIcon>
              <ValueTitle>Speed</ValueTitle>
              <ValueText>
                Time is crucial in job searches. We deliver fast, actionable insights so
                you can iterate and improve quickly.
              </ValueText>
            </ValueCard>

            <ValueCard>
              <ValueIcon>
                <TargetIcon />
              </ValueIcon>
              <ValueTitle>Accuracy</ValueTitle>
              <ValueText>
                Our AI models are trained on millions of successful resumes, ensuring you
                get reliable, proven recommendations.
              </ValueText>
            </ValueCard>
          </ValuesGrid>
        </Section>

        <TeamSection>
          <TeamTitle>Built by Job Seekers, For Job Seekers</TeamTitle>
          <TeamText>
            Our team has been in your shoes. We've experienced the frustration of resume
            rejections, the anxiety of job searches, and the joy of finally landing that
            perfect role. This firsthand experience drives us to build the best possible
            tools for your career success.
          </TeamText>

          <TeamStats>
            <StatCard>
              <StatNumber>50K+</StatNumber>
              <StatLabel>Resumes Analyzed</StatLabel>
            </StatCard>

            <StatCard>
              <StatNumber>85%</StatNumber>
              <StatLabel>Interview Rate Increase</StatLabel>
            </StatCard>

            <StatCard>
              <StatNumber>24/7</StatNumber>
              <StatLabel>AI-Powered Support</StatLabel>
            </StatCard>
          </TeamStats>
        </TeamSection>

        <CTASection>
          <CTATitle>Ready to Transform Your Resume?</CTATitle>
          <CTAText>
            Join thousands of successful job seekers who've used Rejectly.pro to land
            their dream jobs. Get started for free today.
          </CTAText>
          <CTAButtons>
            <Button onClick={() => router.push(ROUTES.AUTH.SIGNUP)} size="lg">
              Get Started Free
            </Button>
            <Button
              onClick={() => router.push(ROUTES.PUBLIC.PRICING)}
              variant="secondary"
              size="lg"
            >
              View Pricing
            </Button>
          </CTAButtons>
        </CTASection>
      </Content>
      <Footer />
    </Container>
  );
}
