'use client';

import { useParams, useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';
import { Footer } from '@/components/ui/Footer';
import { SecondaryCTA } from '@/components/marketing/SecondaryCTA';
import { ArrowRight, CheckCircle2, FileText, Target, Sparkles, Shield, Zap, PieChart } from 'lucide-react';

// ─── Role Data ───────────────────────────────────────────────────────────────

const ROLES: Record<string, {
  title: string;
  description: string;
  challenges: string[];
  keywords: string[];
  atsIssues: string[];
  tips: string[];
}> = {
  'software-engineer': {
    title: 'Software Engineer',
    description: 'Software engineering resumes need the right mix of technical skills, project impact, and ATS-friendly formatting. Generic resumes miss role-specific keywords like CI/CD, microservices, or system design that recruiters filter for.',
    challenges: ['Technical skills buried in paragraphs', 'Missing framework/language keywords', 'No quantified project impact', 'Over-designed layouts that break ATS parsing'],
    keywords: ['JavaScript', 'Python', 'React', 'AWS', 'CI/CD', 'Microservices', 'REST API', 'System Design', 'Agile/Scrum', 'Git'],
    atsIssues: ['Tables and columns break Workday parsing', 'Skills listed without context get lower ranking', 'Missing "years of experience" pattern matching'],
    tips: ['Lead with impact: "Reduced API latency by 40%" not "Worked on APIs"', 'List technologies in context: "Built React dashboard serving 10K daily users"', 'Use standard sections: Experience, Skills, Education — not creative alternatives'],
  },
  'product-manager': {
    title: 'Product Manager',
    description: 'Product management resumes must bridge business strategy and technical execution. ATS systems look for specific PM keywords like roadmap, user research, and OKRs that separate you from generic management resumes.',
    challenges: ['Unclear product ownership scope', 'Missing cross-functional leadership evidence', 'No metrics showing product impact', 'Vague stakeholder management descriptions'],
    keywords: ['Product Roadmap', 'User Research', 'OKRs', 'A/B Testing', 'PRD', 'Stakeholder Management', 'Go-to-Market', 'Sprint Planning', 'Data-Driven', 'Customer Discovery'],
    atsIssues: ['PM-specific terms like "PRD" and "OKR" must be spelled out AND abbreviated', 'Cross-functional skills need explicit keywords', 'Revenue/growth metrics are critical for ranking'],
    tips: ['Show ownership: "Led product vision for $5M revenue stream" not "Managed product"', 'Quantify user impact: "Grew DAU from 10K to 50K through feature iteration"', 'Include both technical and business vocabulary for broader ATS matching'],
  },
  'data-analyst': {
    title: 'Data Analyst',
    description: 'Data analyst resumes need to showcase both technical proficiency (SQL, Python, Tableau) and business impact. ATS systems scan for specific analytics tools and methodologies that prove you can deliver insights.',
    challenges: ['Technical skills without business context', 'Missing specific tool mentions (Tableau, Power BI)', 'No evidence of stakeholder communication', 'Vague "analyzed data" statements'],
    keywords: ['SQL', 'Python', 'Tableau', 'Power BI', 'Excel', 'Statistical Analysis', 'Data Visualization', 'ETL', 'A/B Testing', 'Regression Analysis'],
    atsIssues: ['Tool names must be exact (Tableau, not "visualization tools")', 'SQL variants matter: PostgreSQL, MySQL, BigQuery', 'Missing "business intelligence" composite keyword'],
    tips: ['Quantify insights: "Identified $2M savings through churn analysis" not "Analyzed churn"', 'Name your tools: "Built Tableau dashboards tracking 15 KPIs for C-suite"', 'Show end-to-end work: data collection → analysis → presentation → business impact'],
  },
  'marketing-manager': {
    title: 'Marketing Manager',
    description: 'Marketing manager resumes need to demonstrate both strategic vision and tactical execution. ATS systems look for channel-specific expertise, campaign metrics, and digital marketing vocabulary.',
    challenges: ['Creative achievements hard to quantify', 'Channel expertise not clearly stated', 'Missing digital marketing keywords', 'Campaign results without context'],
    keywords: ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Social Media Marketing', 'Marketing Automation', 'Google Analytics', 'CRM', 'Lead Generation', 'Brand Management', 'ROI Optimization'],
    atsIssues: ['SEO and SEM should be listed separately for keyword matching', 'Platform names (HubSpot, Marketo, Google Ads) are critical', 'Missing "marketing strategy" as a standalone phrase'],
    tips: ['Lead with ROI: "Generated 300% ROAS on $50K Google Ads budget" not "Managed ads"', 'Specify channels: "Grew Instagram from 5K to 50K followers organically"', 'Include both strategy and execution keywords for broader matching'],
  },
  'project-manager': {
    title: 'Project Manager',
    description: 'Project manager resumes must show delivery excellence, stakeholder management, and methodology expertise. ATS systems heavily weight certifications (PMP, Agile) and methodology-specific keywords.',
    challenges: ['Projects described without measurable outcomes', 'Missing methodology keywords (Agile, Waterfall, Hybrid)', 'Certification mentions buried in text', 'Team size and budget not quantified'],
    keywords: ['PMP', 'Agile', 'Scrum Master', 'Waterfall', 'JIRA', 'Risk Management', 'Stakeholder Management', 'Budget Management', 'Resource Planning', 'Change Management'],
    atsIssues: ['PMP and Agile certifications should appear in both Skills and Certifications sections', 'JIRA, Asana, MS Project are high-value tool keywords', '"On-time, on-budget delivery" is a common ATS filter phrase'],
    tips: ['Quantify scope: "Delivered $2M project 2 weeks ahead of schedule with 12-person team"', 'List certifications prominently: PMP, CSM, PRINCE2', 'Show methodology flexibility: mention both Agile and traditional approaches'],
  },
  'ux-designer': {
    title: 'UX Designer',
    description: 'UX designer resumes face a unique challenge: demonstrating visual thinking through a text-based document. ATS systems look for research methods, design tools, and user-centered design vocabulary.',
    challenges: ['Portfolio link not prominent enough', 'Missing UX research methodology keywords', 'Tool names not explicitly listed', 'Design impact not quantified'],
    keywords: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Usability Testing', 'Design Systems', 'Information Architecture', 'Interaction Design', 'Accessibility', 'User Journey Mapping'],
    atsIssues: ['Figma, Sketch, Adobe XD must be listed explicitly as individual tools', 'Research methods (interviews, surveys, card sorting) need separate mentions', 'Accessibility (WCAG, a11y) is increasingly filtered for'],
    tips: ['Quantify impact: "Redesign increased conversion by 35% across 3 user flows"', 'Lead with portfolio: make your portfolio URL the first thing visible', 'Balance research and execution: show you can discover AND deliver'],
  },
  'sales-representative': {
    title: 'Sales Representative',
    description: 'Sales resumes are results-driven by nature, but ATS systems need specific CRM tools, sales methodologies, and revenue vocabulary. Numbers talk — but the right keywords get you to the interview.',
    challenges: ['Revenue numbers without context or quota percentage', 'Missing CRM/tool keywords', 'Sales methodology not mentioned', 'Territory/segment not specified'],
    keywords: ['Salesforce', 'HubSpot CRM', 'Pipeline Management', 'Lead Generation', 'B2B Sales', 'Quota Attainment', 'Cold Calling', 'Solution Selling', 'MEDDIC', 'Account Management'],
    atsIssues: ['CRM names (Salesforce, HubSpot) are critical filter keywords', 'Quota attainment percentage is a common ATS extraction field', 'Industry-specific selling (SaaS, Enterprise, SMB) matters for matching'],
    tips: ['Show quota performance: "Achieved 135% of $1.2M annual quota, ranked #2 of 50 reps"', 'Name your methodology: MEDDIC, Challenger, SPIN, Solution Selling', 'Specify deal sizes: "$50K-$500K enterprise SaaS deals with 6-month sales cycles"'],
  },
  'nurse': {
    title: 'Nurse',
    description: 'Nursing resumes need clinical precision — both in content and ATS formatting. Healthcare ATS systems filter for specific certifications, specializations, and EMR systems that generic resume advice overlooks.',
    challenges: ['Certifications not prominently displayed', 'EMR system experience missing', 'Patient population/department not specified', 'Clinical procedures listed without context'],
    keywords: ['Registered Nurse (RN)', 'BLS/ACLS', 'Patient Assessment', 'Medication Administration', 'Epic EMR', 'Care Planning', 'Patient Education', 'Wound Care', 'Telemetry', 'Charge Nurse'],
    atsIssues: ['Nursing license numbers and state should be easily extractable', 'EMR systems (Epic, Cerner, Meditech) are high-priority filter keywords', 'Unit type (ICU, ER, Med-Surg) is critical for matching'],
    tips: ['Lead with credentials: "BSN, RN | BLS, ACLS, PALS | Epic Certified"', 'Specify unit and patient volume: "40-bed ICU, 1:2 patient ratio, Level I Trauma Center"', 'Quantify outcomes: "Reduced fall rate by 30% through evidence-based protocol implementation"'],
  },
  'accountant': {
    title: 'Accountant',
    description: 'Accounting resumes need to balance technical expertise (GAAP, ERP systems) with business impact. ATS systems in finance heavily weight certifications and specific software proficiency.',
    challenges: ['GAAP/IFRS compliance expertise not highlighted', 'Missing ERP system keywords', 'CPA certification buried in education', 'No quantified financial impact'],
    keywords: ['CPA', 'GAAP', 'Financial Reporting', 'SAP', 'QuickBooks', 'Tax Preparation', 'Accounts Payable/Receivable', 'Reconciliation', 'Audit', 'Excel (Advanced)'],
    atsIssues: ['CPA/CMA certifications are primary filter criteria', 'ERP system names (SAP, Oracle, NetSuite) are critical', 'Financial amounts managed ($X in revenue, $Y budget) are extracted for matching'],
    tips: ['Lead with certification: "CPA licensed in [State], 8+ years public and private accounting"', 'Quantify responsibility scope: "Managed GL with $50M in annual revenue across 12 entities"', 'Specify software fluency: "Advanced Excel (VLOOKUP, Pivot Tables, Power Query), SAP FI/CO"'],
  },
  'teacher': {
    title: 'Teacher',
    description: 'Teaching resumes need to demonstrate instructional excellence, student outcomes, and classroom management. Education-sector ATS systems look for grade levels, subject expertise, and pedagogy keywords.',
    challenges: ['Grade level and subject not immediately clear', 'Student outcome data missing', 'Professional development not highlighted', 'Technology integration not mentioned'],
    keywords: ['Curriculum Development', 'Differentiated Instruction', 'Classroom Management', 'Student Assessment', 'IEP', 'STEM Education', 'Google Classroom', 'Parent Communication', 'Professional Development', 'Common Core Standards'],
    atsIssues: ['Grade level/subject is a primary filter — must be in the headline', 'State certification type matters for matching', 'Special education keywords (IEP, 504 Plan) carry heavy weight'],
    tips: ['Lead with specifics: "8th Grade Mathematics | State Certified | IB Trained"', 'Quantify results: "Improved standardized test scores by 22% over 2 years among 120 students"', 'Show tech adoption: "Implemented Google Classroom for 150 students, increasing assignment completion by 35%"'],
  },
  'human-resources': {
    title: 'Human Resources',
    description: 'HR resumes need to demonstrate both people skills and systems proficiency. ATS systems — ironically the tools HR teams use — filter for specific HRIS platforms, compliance knowledge, and talent management vocabulary.',
    challenges: ['HRIS system experience not listed', 'Compliance knowledge not specific enough', 'Headcount/scale of operations missing', 'Strategic HR vs admin HR not differentiated'],
    keywords: ['HRIS', 'Workday', 'BambooHR', 'Talent Acquisition', 'Employee Relations', 'Performance Management', 'FMLA', 'ADA Compliance', 'Succession Planning', 'Employer Branding'],
    atsIssues: ['HRIS platform names are high-priority extraction fields', 'Compliance terms (FMLA, ADA, EEOC) must be spelled out AND abbreviated', 'Headcount managed is a common filter criterion'],
    tips: ['Quantify scope: "HR Business Partner for 500+ employee division across 3 locations"', 'Show systems: "Implemented Workday HCM for 2,000-employee organization, reducing admin time by 40%"', 'Include both strategic and operational keywords for full-spectrum matching'],
  },
  'business-analyst': {
    title: 'Business Analyst',
    description: 'Business analyst resumes need to showcase both analytical rigor and stakeholder communication. ATS systems look for specific BA methodologies, tools, and documentation types.',
    challenges: ['Requirements gathering approach not specified', 'Missing BA tool keywords (JIRA, Confluence)', 'Documentation types not listed', 'Stakeholder level not clear'],
    keywords: ['Requirements Gathering', 'User Stories', 'JIRA', 'Confluence', 'SQL', 'Process Mapping', 'Data Analysis', 'UAT', 'Business Process Improvement', 'Stakeholder Management'],
    atsIssues: ['BA vs Data Analyst vs PM terminology overlap needs strategic keyword choices', 'Documentation types (BRD, FRD, User Stories) are specific filter terms', 'Agile BA keywords differ significantly from traditional BA keywords'],
    tips: ['Show methodology: "Elicited requirements through 50+ stakeholder interviews and JAD sessions"', 'Quantify impact: "Process improvement initiative saved $1.2M annually across 3 business units"', 'Specify documentation: "Authored BRDs, FRDs, and user stories for 15+ Agile sprints"'],
  },
};

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Styled Components ───────────────────────────────────────────────────────

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
`;

const HeroSection = styled.section`
  position: relative;
  padding: 140px 24px 80px;
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 600px;
    background: radial-gradient(circle, rgba(53, 162, 159, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 100px 16px 48px;
  }
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 9999px;
  background: rgba(53, 162, 159, 0.08);
  border: 1px solid rgba(53, 162, 159, 0.15);
  color: var(--primary-500);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 28px;
  animation: ${fadeInUp} 0.6s ease both;

  svg { width: 14px; height: 14px; }
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.08;
  max-width: 800px;
  margin: 0 auto 24px;
  animation: ${fadeInUp} 0.6s ease both 0.1s;

  @media (max-width: 768px) { font-size: 34px; }
`;

const Subtitle = styled.p`
  font-size: 19px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 640px;
  margin: 0 auto 40px;
  animation: ${fadeInUp} 0.6s ease both 0.2s;

  @media (max-width: 768px) { font-size: 16px; }
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  border-radius: 14px;
  background: var(--primary-500);
  color: white;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  animation: ${fadeInUp} 0.6s ease both 0.3s;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: var(--primary-600);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(53, 162, 159, 0.3);
  }

  svg { width: 18px; height: 18px; }
`;

const ContentSection = styled.section`
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px 80px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--surface-primary);
  border: 1px solid var(--border-primary);
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-500);
    box-shadow: 0 8px 32px rgba(53, 162, 159, 0.08);
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-color);

  svg {
    width: 22px;
    height: 22px;
    color: var(--primary-500);
    flex-shrink: 0;
  }
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);

  svg {
    width: 16px;
    height: 16px;
    color: var(--primary-500);
    flex-shrink: 0;
    margin-top: 4px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  text-align: center;

  @media (max-width: 768px) { font-size: 28px; }
`;

const SectionSubtitle = styled.p`
  font-size: 17px;
  color: var(--text-secondary);
  text-align: center;
  max-width: 600px;
  margin: 0 auto 48px;
  line-height: 1.7;
`;

const KeywordGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 64px;
`;

const Keyword = styled.span`
  padding: 8px 18px;
  border-radius: 9999px;
  background: rgba(53, 162, 159, 0.06);
  border: 1px solid rgba(53, 162, 159, 0.12);
  color: var(--primary-500);
  font-size: 14px;
  font-weight: 600;
  font-family: 'SF Mono', 'Fira Code', monospace;
`;

const TipCard = styled.div`
  background: linear-gradient(135deg, rgba(53, 162, 159, 0.04) 0%, rgba(53, 162, 159, 0.01) 100%);
  border: 1px solid rgba(53, 162, 159, 0.1);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 64px;
`;

const TipList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: tip-counter;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TipItem = styled.li`
  counter-increment: tip-counter;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);

  &::before {
    content: counter(tip-counter);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    border-radius: 10px;
    background: var(--primary-500);
    color: white;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const BottomCTA = styled.div`
  text-align: center;
  padding: 64px 24px;
  margin-bottom: 40px;
`;

const BottomCTATitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 16px;

  @media (max-width: 768px) { font-size: 28px; }
`;

const BottomCTASubtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto 32px;
  line-height: 1.6;
`;

const InternalLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
`;

const InternalLink = styled.a`
  padding: 10px 20px;
  border-radius: 12px;
  background: var(--surface-primary);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-500);
    color: var(--primary-500);
  }
`;

// ─── Page Component ──────────────────────────────────────────────────────────

export default function RoleResumePage() {
  const params = useParams();
  const router = useRouter();
  const roleSlug = params.role as string;
  const role = ROLES[roleSlug];

  if (!role) {
    return null;
  }

  return (
    <PageContainer>
      <HeroSection>
        <Eyebrow>
          <Target />
          Role-Specific ATS Optimization
        </Eyebrow>
        <Title>
          ATS-Optimized Resume for {role.title}s
        </Title>
        <Subtitle>
          {role.description}
        </Subtitle>
        <CTAButton href="/signup">
          Optimize My {role.title} Resume <ArrowRight />
        </CTAButton>
      </HeroSection>

      <ContentSection>
        {/* Common Challenges + ATS Issues */}
        <SectionTitle>Why {role.title} Resumes Get Rejected</SectionTitle>
        <SectionSubtitle>
          85% of resumes never reach a human recruiter. Here&apos;s what goes wrong for {role.title}s specifically.
        </SectionSubtitle>

        <Grid>
          <Card>
            <CardTitle><FileText /> Common Resume Mistakes</CardTitle>
            <CardList>
              {role.challenges.map((c, i) => (
                <CardListItem key={i}><CheckCircle2 />{c}</CardListItem>
              ))}
            </CardList>
          </Card>
          <Card>
            <CardTitle><Shield /> ATS-Specific Issues</CardTitle>
            <CardList>
              {role.atsIssues.map((a, i) => (
                <CardListItem key={i}><CheckCircle2 />{a}</CardListItem>
              ))}
            </CardList>
          </Card>
        </Grid>

        {/* Must-Have Keywords */}
        <SectionTitle>Must-Have Keywords for {role.title} Resumes</SectionTitle>
        <SectionSubtitle>
          These are the keywords ATS systems scan for when filtering {role.title} applications.
        </SectionSubtitle>

        <KeywordGrid>
          {role.keywords.map((k, i) => (
            <Keyword key={i}>{k}</Keyword>
          ))}
        </KeywordGrid>

        {/* Pro Tips */}
        <SectionTitle>Resume Writing Tips for {role.title}s</SectionTitle>
        <SectionSubtitle>
          Expert advice to make your {role.title} resume stand out — both to ATS and human recruiters.
        </SectionSubtitle>

        <TipCard>
          <TipList>
            {role.tips.map((t, i) => (
              <TipItem key={i}>{t}</TipItem>
            ))}
          </TipList>
        </TipCard>

        {/* How Rejectly Helps */}
        <SectionTitle>How Rejectly.pro Helps {role.title}s</SectionTitle>
        <SectionSubtitle>
          Our AI is trained to understand what makes a great {role.title} resume.
        </SectionSubtitle>

        <Grid>
          <Card>
            <CardTitle><PieChart /> Job Match Analysis</CardTitle>
            <CardList>
              <CardListItem><Sparkles />Paste a {role.title} job description</CardListItem>
              <CardListItem><Sparkles />Get a fully rewritten resume matching that specific role</CardListItem>
              <CardListItem><Sparkles />Every keyword, achievement, and bullet point optimized</CardListItem>
            </CardList>
          </Card>
          <Card>
            <CardTitle><Zap /> ATS Optimizer</CardTitle>
            <CardList>
              <CardListItem><Sparkles />No job description needed</CardListItem>
              <CardListItem><Sparkles />Tests against Workday, Greenhouse, Taleo &amp; Lever</CardListItem>
              <CardListItem><Sparkles />One-click optimization with downloadable PDF</CardListItem>
            </CardList>
          </Card>
        </Grid>

        {/* Bottom CTA */}
        <BottomCTA>
          <BottomCTATitle>
            Ready to Land Your {role.title} Role?
          </BottomCTATitle>
          <BottomCTASubtitle>
            Stop sending generic resumes. Get a CV built specifically for each {role.title} position you apply to.
          </BottomCTASubtitle>
          <CTAButton href="/ats-check">
            Check My Resume Score — Free <ArrowRight />
          </CTAButton>

          {/* Internal Links for SEO */}
          <InternalLinks>
            {Object.entries(ROLES)
              .filter(([slug]) => slug !== roleSlug)
              .slice(0, 5)
              .map(([slug, r]) => (
                <InternalLink key={slug} href={`/resume/${slug}`}>
                  {r.title} Resume
                </InternalLink>
              ))}
            <InternalLink href="/features">All Features</InternalLink>
            <InternalLink href="/cv-builder">Free CV Builder</InternalLink>
          </InternalLinks>
        </BottomCTA>
      </ContentSection>

      <SecondaryCTA />
      <Footer />
    </PageContainer>
  );
}
