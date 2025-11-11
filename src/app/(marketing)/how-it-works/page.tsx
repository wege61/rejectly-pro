"use client";

import styled from "styled-components";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

const StepsSection = styled.section`
  margin-bottom: 120px;

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 64px;
`;

const StepCard = styled.div<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;

  ${({ $reverse }) =>
    $reverse &&
    `
    direction: rtl;
    > * {
      direction: ltr;
    }
  `}

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    direction: ltr;
    gap: 32px;
  }
`;

const StepContent = styled.div``;

const StepNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const StepTitle = styled.h3`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const StepDescription = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 24px;
`;

const StepFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StepFeature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  color: var(--text-secondary);

  &:before {
    content: "✓";
    color: #10b981;
    font-weight: 700;
    font-size: 18px;
    flex-shrink: 0;
  }
`;

const StepVisual = styled.div`
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 300px;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 32px;
    min-height: 250px;
  }
`;

const VisualIcon = styled.div`
  font-size: 64px;
  text-align: center;
  margin-bottom: 16px;
`;

const VisualText = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
`;

const VisualSubtext = styled.div`
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
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
  color: var(--text-color);

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

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div<{ $featured?: boolean }>`
  background: var(--bg-alt);
  border: 2px solid ${({ $featured }) => ($featured ? "#667eea" : "var(--border-color)")};
  border-radius: 16px;
  padding: 40px;
  position: relative;
  transition: all 0.3s ease;

  ${({ $featured }) =>
    $featured &&
    `
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const PlanBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PlanName = styled.h3`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-color);
`;

const PlanPrice = styled.div`
  font-size: 42px;
  font-weight: 900;
  margin-bottom: 8px;
  color: var(--text-color);

  span {
    font-size: 18px;
    font-weight: 500;
    color: var(--text-secondary);
  }
`;

const PlanDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PlanFeature = styled.li<{ $disabled?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  color: ${({ $disabled }) => ($disabled ? "var(--text-tertiary)" : "var(--text-secondary)")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:before {
    content: "${({ $disabled }) => ($disabled ? "✗" : "✓")}";
    color: ${({ $disabled }) => ($disabled ? "#ef4444" : "#10b981")};
    font-weight: 700;
    font-size: 18px;
    flex-shrink: 0;
  }
`;

const BenefitsSection = styled.section`
  margin-bottom: 120px;

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const BenefitCard = styled.div`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }
`;

const BenefitIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const BenefitTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-color);
`;

const BenefitDescription = styled.p`
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

const CTASection = styled.section`
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 24px;
  padding: 64px 48px;
  text-align: center;
  margin-bottom: 120px;

  @media (max-width: 768px) {
    padding: 48px 32px;
    margin-bottom: 80px;
  }
`;

const CTATitle = styled.h2`
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const CTADescription = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <Container>
      <Content>
        <Header>
          <Title>How It Works</Title>
          <Subtitle>
            From resume upload to your dream job in 4 simple steps. Our AI-powered
            platform analyzes, optimizes, and transforms your resume in seconds.
          </Subtitle>
        </Header>

        <StepsSection>
          <StepsGrid>
            {/* Step 1 */}
            <StepCard>
              <StepContent>
                <StepNumber>1</StepNumber>
                <StepTitle>Upload Your Resume</StepTitle>
                <StepDescription>
                  Upload your resume in PDF or DOCX format, or paste it directly.
                  Our AI instantly parses your resume and extracts all relevant
                  information about your experience, skills, and qualifications.
                </StepDescription>
                <StepFeatures>
                  <StepFeature>Support for PDF and DOCX formats</StepFeature>
                  <StepFeature>Direct text paste option</StepFeature>
                  <StepFeature>Smart parsing of complex layouts</StepFeature>
                  <StepFeature>Maximum file size: 5MB</StepFeature>
                  <StepFeature>Instant text extraction</StepFeature>
                </StepFeatures>
              </StepContent>
              <StepVisual>
                <VisualIcon>📄</VisualIcon>
                <VisualText>Upload & Parse</VisualText>
                <VisualSubtext>
                  AI extracts your skills, experience, and achievements
                </VisualSubtext>
              </StepVisual>
            </StepCard>

            {/* Step 2 */}
            <StepCard $reverse>
              <StepContent>
                <StepNumber>2</StepNumber>
                <StepTitle>Add Job Postings</StepTitle>
                <StepDescription>
                  Paste the job description you're targeting. You can compare
                  your resume against up to 3 job postings at once (unlimited for
                  Pro users) to find the best matches and identify what's
                  missing.
                </StepDescription>
                <StepFeatures>
                  <StepFeature>Compare against multiple jobs</StepFeature>
                  <StepFeature>Save job postings for future use</StepFeature>
                  <StepFeature>Free: up to 3 jobs per analysis</StepFeature>
                  <StepFeature>Pro: unlimited job comparisons</StepFeature>
                  <StepFeature>Edit and manage saved jobs</StepFeature>
                </StepFeatures>
              </StepContent>
              <StepVisual>
                <VisualIcon>💼</VisualIcon>
                <VisualText>Job Matching</VisualText>
                <VisualSubtext>
                  Compare your resume against multiple positions simultaneously
                </VisualSubtext>
              </StepVisual>
            </StepCard>

            {/* Step 3 */}
            <StepCard>
              <StepContent>
                <StepNumber>3</StepNumber>
                <StepTitle>Get AI Analysis</StepTitle>
                <StepDescription>
                  Our GPT-4 powered AI analyzes your resume in 15-30 seconds,
                  comparing it against job requirements. Get an instant match
                  score, missing keywords, and actionable insights to improve
                  your chances.
                </StepDescription>
                <StepFeatures>
                  <StepFeature>Match score (0-100%)</StepFeature>
                  <StepFeature>5 missing keywords identified</StepFeature>
                  <StepFeature>AI-generated summary</StepFeature>
                  <StepFeature>Analysis in 15-30 seconds</StepFeature>
                  <StepFeature>Context-aware recommendations</StepFeature>
                </StepFeatures>
              </StepContent>
              <StepVisual>
                <VisualIcon>🤖</VisualIcon>
                <VisualText>AI-Powered Analysis</VisualText>
                <VisualSubtext>
                  GPT-4 understands context, not just keywords
                </VisualSubtext>
              </StepVisual>
            </StepCard>

            {/* Step 4 */}
            <StepCard $reverse>
              <StepContent>
                <StepNumber>4</StepNumber>
                <StepTitle>Download Optimized Resume</StepTitle>
                <StepDescription>
                  Pro users get a complete, AI-generated resume that incorporates
                  all insights. Download as PDF and start applying with
                  confidence. Your new resume includes rewritten bullets, missing
                  keywords, and ATS optimization.
                </StepDescription>
                <StepFeatures>
                  <StepFeature>Complete resume regeneration</StepFeature>
                  <StepFeature>3 professionally rewritten bullets</StepFeature>
                  <StepFeature>All missing keywords integrated</StepFeature>
                  <StepFeature>ATS-optimized formatting</StepFeature>
                  <StepFeature>Download as PDF</StepFeature>
                  <StepFeature>Interactive preview with highlights</StepFeature>
                </StepFeatures>
              </StepContent>
              <StepVisual>
                <VisualIcon>✨</VisualIcon>
                <VisualText>Ready-to-Send Resume</VisualText>
                <VisualSubtext>
                  Professional, optimized, and ATS-friendly
                </VisualSubtext>
              </StepVisual>
            </StepCard>
          </StepsGrid>
        </StepsSection>

        <ComparisonSection>
          <SectionHeader>
            <SectionTitle>Choose Your Plan</SectionTitle>
            <SectionSubtitle>
              Start free, upgrade when you're ready
            </SectionSubtitle>
          </SectionHeader>

          <ComparisonGrid>
            {/* Free Plan */}
            <PlanCard>
              <PlanName>Free</PlanName>
              <PlanPrice>
                $0<span>/month</span>
              </PlanPrice>
              <PlanDescription>
                Perfect for trying out the platform and getting basic insights
              </PlanDescription>
              <PlanFeatures>
                <PlanFeature>3 analyses per month</PlanFeature>
                <PlanFeature>Basic match score</PlanFeature>
                <PlanFeature>5 missing keywords</PlanFeature>
                <PlanFeature>AI summary</PlanFeature>
                <PlanFeature>Compare up to 3 jobs</PlanFeature>
                <PlanFeature $disabled>Professional rewriting</PlanFeature>
                <PlanFeature $disabled>ATS optimization guide</PlanFeature>
                <PlanFeature $disabled>Role recommendations</PlanFeature>
                <PlanFeature $disabled>Optimized resume generation</PlanFeature>
                <PlanFeature $disabled>PDF download</PlanFeature>
              </PlanFeatures>
              <Button
                size="lg"
                variant="secondary"
                fullWidth
                onClick={() => router.push("/signup")}
              >
                Get Started Free
              </Button>
            </PlanCard>

            {/* Pro Plan */}
            <PlanCard $featured>
              <PlanBadge>Most Popular</PlanBadge>
              <PlanName>Pro</PlanName>
              <PlanPrice>
                $9<span>/month</span>
              </PlanPrice>
              <PlanDescription>
                Everything you need to land your dream job faster
              </PlanDescription>
              <PlanFeatures>
                <PlanFeature>Unlimited analyses</PlanFeature>
                <PlanFeature>Detailed match insights</PlanFeature>
                <PlanFeature>Missing keywords + suggestions</PlanFeature>
                <PlanFeature>AI-generated summaries</PlanFeature>
                <PlanFeature>Compare unlimited jobs</PlanFeature>
                <PlanFeature>3 bullet points rewritten</PlanFeature>
                <PlanFeature>ATS optimization guide</PlanFeature>
                <PlanFeature>3 role recommendations</PlanFeature>
                <PlanFeature>AI-generated optimized resume</PlanFeature>
                <PlanFeature>PDF download</PlanFeature>
                <PlanFeature>Improvement breakdown</PlanFeature>
                <PlanFeature>Interactive resume preview</PlanFeature>
              </PlanFeatures>
              <Button
                size="lg"
                fullWidth
                onClick={() => router.push("/signup")}
              >
                Upgrade to Pro
              </Button>
            </PlanCard>
          </ComparisonGrid>
        </ComparisonSection>

        <BenefitsSection>
          <SectionHeader>
            <SectionTitle>Why Choose Rejectly.pro?</SectionTitle>
            <SectionSubtitle>
              The complete resume optimization solution
            </SectionSubtitle>
          </SectionHeader>

          <BenefitsGrid>
            <BenefitCard>
              <BenefitIcon>⚡</BenefitIcon>
              <BenefitTitle>Instant Feedback</BenefitTitle>
              <BenefitDescription>
                Get results in 30 seconds, not days. Our AI analyzes your resume
                instantly and provides actionable insights immediately.
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard>
              <BenefitIcon>🎯</BenefitIcon>
              <BenefitTitle>ATS Optimization</BenefitTitle>
              <BenefitDescription>
                85% more ATS pass rate. Get past automated screening systems and
                ensure your resume reaches human recruiters.
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard>
              <BenefitIcon>📈</BenefitIcon>
              <BenefitTitle>Proven Results</BenefitTitle>
              <BenefitDescription>
                73% more interview invitations on average. Our users see
                significant improvements in their job search success rate.
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard>
              <BenefitIcon>🔒</BenefitIcon>
              <BenefitTitle>GDPR Compliant</BenefitTitle>
              <BenefitDescription>
                Your data is encrypted and secure. We never share your
                information with third parties. Full GDPR compliance guaranteed.
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard>
              <BenefitIcon>🌍</BenefitIcon>
              <BenefitTitle>Multi-Language</BenefitTitle>
              <BenefitDescription>
                Support for English and Turkish resumes and job descriptions. Our AI
                analyzes content in both languages with high accuracy.
              </BenefitDescription>
            </BenefitCard>

            <BenefitCard>
              <BenefitIcon>💡</BenefitIcon>
              <BenefitTitle>Career Insights</BenefitTitle>
              <BenefitDescription>
                Discover alternative roles you qualify for. Get 3 role
                recommendations with match scores to expand your job search.
              </BenefitDescription>
            </BenefitCard>
          </BenefitsGrid>
        </BenefitsSection>

        <CTASection>
          <CTATitle>Ready to Land Your Dream Job?</CTATitle>
          <CTADescription>
            Join 500+ professionals who improved their resumes and increased their
            interview rates by 73%. Start free, upgrade when you're ready.
          </CTADescription>
          <CTAButtons>
            <Button size="lg" onClick={() => router.push("/signup")}>
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push("/#demo")}
            >
              Try Demo
            </Button>
          </CTAButtons>
        </CTASection>
      </Content>
      <Footer />
    </Container>
  );
}
