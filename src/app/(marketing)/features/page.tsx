'use client';

import styled, { keyframes } from 'styled-components';
import { ROUTES } from '@/lib/constants';
import { Footer } from '@/components/ui/Footer';
import { SecondaryCTA } from '@/components/marketing/SecondaryCTA';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import { PieChart, FileUser, Settings2, Wand2, Mail, Briefcase, Target, Sparkles, Shield, Zap, CheckCircle2, ArrowRight, Star } from 'lucide-react';

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

// ─── Page Layout ─────────────────────────────────────────────────────────────

const PageContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
`;

const HeroSection = styled.section`
  position: relative;
  padding: 140px 24px 100px;
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
    padding: 100px 16px 64px;
  }
`;

const HeroEyebrow = styled.div`
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

  svg {
    width: 14px;
    height: 14px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 64px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.05;
  max-width: 900px;
  margin: 0 auto 24px;
  animation: ${fadeInUp} 0.6s ease both 0.1s;

  @media (max-width: 768px) {
    font-size: 38px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 680px;
  margin: 0 auto 48px;
  animation: ${fadeInUp} 0.6s ease both 0.2s;

  @media (max-width: 768px) {
    font-size: 17px;
  }
`;

const HeroCTA = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  animation: ${fadeInUp} 0.6s ease both 0.3s;
`;

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border-radius: 9999px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%),
    rgba(238, 90, 90, 0.82);
  border: 1px solid rgba(255,255,255,0.28);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 32px rgba(238, 90, 90, 0.35);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;

  &:hover {
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.65), 0 12px 40px rgba(238, 90, 90, 0.5);
    transform: translateY(-2px);
  }

  svg { width: 18px; height: 18px; }
`;

const GhostBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 16px 24px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 9999px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-500);
  }

  svg { width: 16px; height: 16px; }
`;

// ─── Tools Section ───────────────────────────────────────────────────────────

const ToolsSection = styled.section`
  padding: 0 24px 120px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0 16px 80px;
  }
`;

const ToolCard = styled.div<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  padding: 100px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);

  &:last-child {
    border-bottom: none;
  }

  ${({ $reverse }) => $reverse && `
    direction: rtl;
    & > * { direction: ltr; }
  `}

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 48px;
    padding: 64px 0;
    direction: ltr !important;
    & > * { direction: ltr !important; }
  }
`;

const ToolContent = styled.div``;

const ToolEyebrow = styled.div<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 20px;
  background: ${({ $color }) => $color || 'rgba(53, 162, 159, 0.1)'};
  color: ${({ $color }) => $color ? 'white' : 'var(--primary-500)'};
  border: 1px solid ${({ $color }) => $color ? 'transparent' : 'rgba(53, 162, 159, 0.2)'};

  svg { width: 14px; height: 14px; }
`;

const ToolTitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const ToolDescription = styled.p`
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 32px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--text-color);

  svg {
    width: 20px;
    height: 20px;
    color: var(--primary-500);
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

const ToolVisual = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 32px;
  min-height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${float} 6s ease-in-out infinite;

  /* Liquid Glass specular top edge */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent);
    pointer-events: none;
  }
`;

const VisualStat = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const VisualStatNumber = styled.div<{ $color?: string }>`
  font-size: 64px;
  font-weight: 900;
  letter-spacing: -0.04em;
  background: ${({ $color }) => $color || 'linear-gradient(135deg, var(--primary-500), #0B666A)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const VisualStatLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
  letter-spacing: 0.02em;
`;

const VisualChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
`;

const VisualChip = styled.div<{ $active?: boolean }>`
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  background: ${({ $active }) => $active ? 'rgba(53, 162, 159, 0.15)' : 'rgba(255,255,255,0.04)'};
  color: ${({ $active }) => $active ? 'var(--primary-500)' : 'var(--text-secondary)'};
  border: 1px solid ${({ $active }) => $active ? 'rgba(53, 162, 159, 0.3)' : 'rgba(255,255,255,0.08)'};
`;

const PriceBadge = styled.div<{ $free?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  margin-top: 28px;
  background: ${({ $free }) => $free
    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.06))'
    : 'rgba(255,255,255,0.04)'};
  color: ${({ $free }) => $free ? '#10b981' : 'var(--text-color)'};
  border: 1px solid ${({ $free }) => $free ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.1)'};

  svg { width: 16px; height: 16px; }
`;

// ─── Pro Report Section ──────────────────────────────────────────────────────

const ProSection = styled.section`
  padding: 100px 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent, rgba(53, 162, 159, 0.03) 50%, transparent);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 64px 16px;
  }
`;

const ProContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  position: relative;
`;

const ProTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const ProSubtitle = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 640px;
  margin: 0 auto 56px;
`;

const ProGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 32px 28px;
  text-align: left;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.14);
    transform: translateY(-4px);
  }
`;

const ProCardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(53, 162, 159, 0.1);
  border: 1px solid rgba(53, 162, 159, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: var(--primary-500);

  svg { width: 22px; height: 22px; }
`;

const ProCardTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
`;

const ProCardDesc = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
`;

// ─── Comparison Section ──────────────────────────────────────────────────────

const ComparisonSection = styled.section`
  padding: 100px 24px;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 64px 16px;
  }
`;

const CompTitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-align: center;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const CompSubtitle = styled.p`
  font-size: 17px;
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 48px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CompTable = styled.div`
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
`;

const CompRow = styled.div<{ $header?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 120px 120px;
  gap: 0;
  padding: 16px 28px;
  align-items: center;
  background: ${({ $header }) => $header ? 'rgba(255,255,255,0.04)' : 'transparent'};
  border-bottom: 1px solid rgba(255,255,255,0.06);

  &:last-child { border-bottom: none; }

  @media (max-width: 640px) {
    grid-template-columns: 1fr 80px 80px;
    padding: 14px 16px;
  }
`;

const CompFeature = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
`;

const CompHeader = styled.div`
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
`;

const CompCell = styled.div<{ $enabled?: boolean }>`
  text-align: center;
  font-size: 16px;
  color: ${({ $enabled }) => $enabled ? '#10b981' : 'rgba(255,255,255,0.2)'};
`;

// ─── Page Component ──────────────────────────────────────────────────────────

const comparisonFeatures = [
  { name: 'ATS Score Check', free: true, pro: true },
  { name: 'Missing Keywords Analysis', free: true, pro: true },
  { name: 'Quick Wins & Suggestions', free: true, pro: true },
  { name: 'Job-Specific Resume Rewrite', free: false, pro: true },
  { name: 'Bullet Point Optimization', free: false, pro: true },
  { name: 'Cover Letter Generation', free: false, pro: true },
  { name: 'Interview Preparation', free: false, pro: true },
  { name: 'Career Growth Roadmap', free: false, pro: true },
  { name: 'Alternative Role Matching', free: false, pro: true },
  { name: 'CV Builder (Standalone)', free: true, pro: true },
  { name: 'ATS Optimizer (No JD)', free: false, pro: true },
];

export default function FeaturesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://rejectly.pro' },
          { name: 'Features', url: 'https://rejectly.pro/features' }
        ]}
      />
      <script
        id="features-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Rejectly.pro Features',
            description: 'AI-powered tools to create job-specific, ATS-optimized resumes for every application',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Job Match Analysis', description: 'Upload your CV and paste a job description to get a fully rewritten, optimized resume tailored to that specific role' },
              { '@type': 'ListItem', position: 2, name: 'ATS Optimizer', description: 'Upload your CV — no job description needed — and get your ATS score with one-click optimization for Workday, Greenhouse, Taleo and Lever' },
              { '@type': 'ListItem', position: 3, name: 'Cover Letter Generator', description: 'Generate personalized cover letters tailored to each job application with tone and length options' },
              { '@type': 'ListItem', position: 4, name: 'CV Builder', description: 'Build a professional, ATS-friendly resume from scratch with our free step-by-step builder' },
              { '@type': 'ListItem', position: 5, name: 'Interview Preparation', description: 'Practice behavioral, technical, and weakness questions generated from the specific job description' },
              { '@type': 'ListItem', position: 6, name: 'Career Growth Roadmap', description: 'Get personalized recommendations for certifications, skills, and career moves ranked by impact' },
            ],
          })
        }}
      />

      <PageContainer>
        {/* ─── HERO ─── */}
        <HeroSection>
          <HeroEyebrow>
            <Sparkles /> 6 AI-Powered Tools
          </HeroEyebrow>
          <HeroTitle>
            Every tool you need.<br />
            One platform.
          </HeroTitle>
          <HeroSubtitle>
            From building your first resume to acing the interview — Rejectly gives you a complete, AI-powered application package tailored to every job you apply for.
          </HeroSubtitle>
          <HeroCTA>
            <PrimaryBtn href={ROUTES.AUTH.SIGNUP}>
              Get Started Free <ArrowRight />
            </PrimaryBtn>
            <GhostBtn href="#tools">
              Explore Tools <ArrowRight />
            </GhostBtn>
          </HeroCTA>
        </HeroSection>

        {/* ─── TOOL DEEP DIVES ─── */}
        <ToolsSection id="tools">

          {/* 1. Job Match Analysis */}
          <ToolCard>
            <ToolContent>
              <ToolEyebrow><PieChart /> Job Match</ToolEyebrow>
              <ToolTitle>A new resume for every job.</ToolTitle>
              <ToolDescription>
                Paste any job description alongside your CV. Our AI compares them word by word, finds every gap, and creates a fully rewritten resume optimized specifically for that role.
              </ToolDescription>
              <FeatureList>
                <FeatureItem><CheckCircle2 /> Precise match score with gap analysis</FeatureItem>
                <FeatureItem><CheckCircle2 /> Missing keywords ranked by impact</FeatureItem>
                <FeatureItem><CheckCircle2 /> Fully rewritten, job-specific resume</FeatureItem>
                <FeatureItem><CheckCircle2 /> Cover letter, interview prep &amp; career roadmap included</FeatureItem>
              </FeatureList>
              <PriceBadge>
                <Zap /> 1 credit per analysis
              </PriceBadge>
            </ToolContent>
            <ToolVisual>
              <VisualStat>
                <VisualStatNumber>94%</VisualStatNumber>
                <VisualStatLabel>Average Match Score After Optimization</VisualStatLabel>
              </VisualStat>
              <VisualChips>
                <VisualChip $active>Keywords Matched</VisualChip>
                <VisualChip $active>Skills Aligned</VisualChip>
                <VisualChip>Gaps Closed</VisualChip>
              </VisualChips>
            </ToolVisual>
          </ToolCard>

          {/* 2. ATS Optimizer */}
          <ToolCard $reverse>
            <ToolContent>
              <ToolEyebrow><Settings2 /> ATS Optimizer</ToolEyebrow>
              <ToolTitle>No job description? No problem.</ToolTitle>
              <ToolDescription>
                Upload your CV — that&apos;s it. Our AI scores it against the exact ATS systems used by the world&apos;s top companies, then rewrites it to pass every one of them.
              </ToolDescription>
              <FeatureList>
                <FeatureItem><CheckCircle2 /> No job description required — works with just your CV</FeatureItem>
                <FeatureItem><CheckCircle2 /> Tested against Workday, Greenhouse, Taleo &amp; Lever</FeatureItem>
                <FeatureItem><CheckCircle2 /> Before &amp; after score comparison</FeatureItem>
                <FeatureItem><CheckCircle2 /> One-click optimization with downloadable PDF</FeatureItem>
              </FeatureList>
              <PriceBadge>
                <Zap /> 1 credit per optimization
              </PriceBadge>
            </ToolContent>
            <ToolVisual>
              <VisualStat>
                <VisualStatNumber $color="linear-gradient(135deg, #f59e0b, #10b981)">
                  45→89
                </VisualStatNumber>
                <VisualStatLabel>Average ATS Score Improvement</VisualStatLabel>
              </VisualStat>
              <VisualChips>
                <VisualChip $active>Workday</VisualChip>
                <VisualChip $active>Greenhouse</VisualChip>
                <VisualChip $active>Taleo</VisualChip>
                <VisualChip $active>Lever</VisualChip>
              </VisualChips>
            </ToolVisual>
          </ToolCard>

          {/* 3. Cover Letters */}
          <ToolCard>
            <ToolContent>
              <ToolEyebrow><Mail /> Cover Letters</ToolEyebrow>
              <ToolTitle>Words that open doors.</ToolTitle>
              <ToolDescription>
                After a Job Match analysis, generate a personalized cover letter that references the specific role, your relevant achievements, and the company&apos;s needs — in the tone you choose.
              </ToolDescription>
              <FeatureList>
                <FeatureItem><CheckCircle2 /> Written specifically for each role and company</FeatureItem>
                <FeatureItem><CheckCircle2 /> Tone options: professional, confident, conversational</FeatureItem>
                <FeatureItem><CheckCircle2 /> Highlights your most relevant achievements</FeatureItem>
                <FeatureItem><CheckCircle2 /> Copy, save, or regenerate in seconds</FeatureItem>
              </FeatureList>
              <PriceBadge>
                <Zap /> 1 credit per letter
              </PriceBadge>
            </ToolContent>
            <ToolVisual>
              <VisualStat>
                <VisualStatNumber $color="linear-gradient(135deg, #818cf8, #6366f1)">
                  3
                </VisualStatNumber>
                <VisualStatLabel>Tone Options Available</VisualStatLabel>
              </VisualStat>
              <VisualChips>
                <VisualChip $active>Professional</VisualChip>
                <VisualChip>Confident</VisualChip>
                <VisualChip>Conversational</VisualChip>
              </VisualChips>
            </ToolVisual>
          </ToolCard>

          {/* 4. CV Builder — FREE */}
          <ToolCard $reverse>
            <ToolContent>
              <ToolEyebrow><Wand2 /> CV Builder</ToolEyebrow>
              <ToolTitle>From blank page to polished CV.</ToolTitle>
              <ToolDescription>
                Don&apos;t have a resume yet? Our step-by-step builder guides you through every section — basics, education, experience, skills, certifications — and produces a clean, ATS-friendly document with a live preview.
              </ToolDescription>
              <FeatureList>
                <FeatureItem><CheckCircle2 /> 7-step guided wizard — no guesswork</FeatureItem>
                <FeatureItem><CheckCircle2 /> Live preview as you build</FeatureItem>
                <FeatureItem><CheckCircle2 /> ATS-optimized formatting from the start</FeatureItem>
                <FeatureItem><CheckCircle2 /> Choose your theme and accent color</FeatureItem>
                <FeatureItem><CheckCircle2 /> Download as PDF, saved to your dashboard</FeatureItem>
              </FeatureList>
              <PriceBadge $free>
                <Star /> Completely Free
              </PriceBadge>
            </ToolContent>
            <ToolVisual>
              <VisualStat>
                <VisualStatNumber $color="linear-gradient(135deg, #10b981, #059669)">
                  $0
                </VisualStatNumber>
                <VisualStatLabel>Forever Free — No Credits Needed</VisualStatLabel>
              </VisualStat>
              <VisualChips>
                <VisualChip $active>Basics</VisualChip>
                <VisualChip>Education</VisualChip>
                <VisualChip>Experience</VisualChip>
                <VisualChip>Skills</VisualChip>
                <VisualChip>Summary</VisualChip>
                <VisualChip $active>Theme</VisualChip>
              </VisualChips>
            </ToolVisual>
          </ToolCard>

        </ToolsSection>

        {/* ─── PRO REPORT SECTION ─── */}
        <ProSection>
          <ProContainer>
            <HeroEyebrow style={{ marginBottom: '24px' }}>
              <Target /> Included in Every Pro Report
            </HeroEyebrow>
            <ProTitle>One analysis. Six deliverables.</ProTitle>
            <ProSubtitle>
              Every Pro Job Match analysis doesn&apos;t just optimize your resume — it gives you a complete application package with everything you need to land the interview.
            </ProSubtitle>
            <ProGrid>
              <ProCard>
                <ProCardIcon><FileUser /></ProCardIcon>
                <ProCardTitle>Optimized Resume</ProCardTitle>
                <ProCardDesc>
                  A fully rewritten CV tailored to the specific job — with the right keywords, structure, and emphasis.
                </ProCardDesc>
              </ProCard>
              <ProCard>
                <ProCardIcon><Mail /></ProCardIcon>
                <ProCardTitle>Cover Letter</ProCardTitle>
                <ProCardDesc>
                  A personalized cover letter referencing the role, company, and your most relevant achievements.
                </ProCardDesc>
              </ProCard>
              <ProCard>
                <ProCardIcon><Briefcase /></ProCardIcon>
                <ProCardTitle>Interview Prep</ProCardTitle>
                <ProCardDesc>
                  Behavioral, technical, and weakness questions generated from the specific job description.
                </ProCardDesc>
              </ProCard>
              <ProCard>
                <ProCardIcon><Target /></ProCardIcon>
                <ProCardTitle>Career Roadmap</ProCardTitle>
                <ProCardDesc>
                  Certifications, skills, and career moves personalized to your field and ranked by impact.
                </ProCardDesc>
              </ProCard>
              <ProCard>
                <ProCardIcon><PieChart /></ProCardIcon>
                <ProCardTitle>Gap Analysis</ProCardTitle>
                <ProCardDesc>
                  Every missing keyword and skill gap identified, ranked by how much they&apos;ll improve your score.
                </ProCardDesc>
              </ProCard>
              <ProCard>
                <ProCardIcon><Shield /></ProCardIcon>
                <ProCardTitle>ATS Compatibility</ProCardTitle>
                <ProCardDesc>
                  Your resume tested against major ATS systems with specific formatting recommendations.
                </ProCardDesc>
              </ProCard>
            </ProGrid>
          </ProContainer>
        </ProSection>

        {/* ─── FREE VS PRO COMPARISON ─── */}
        <ComparisonSection>
          <CompTitle>Free vs Pro</CompTitle>
          <CompSubtitle>
            Start free with our CV Builder and ATS analysis. Upgrade to Pro for job-specific optimization.
          </CompSubtitle>
          <CompTable>
            <CompRow $header>
              <CompHeader style={{ textAlign: 'left' }}>Feature</CompHeader>
              <CompHeader>Free</CompHeader>
              <CompHeader style={{ color: 'var(--primary-500)' }}>Pro</CompHeader>
            </CompRow>
            {comparisonFeatures.map((f) => (
              <CompRow key={f.name}>
                <CompFeature>{f.name}</CompFeature>
                <CompCell $enabled={f.free}>{f.free ? '✓' : '—'}</CompCell>
                <CompCell $enabled={f.pro}>{f.pro ? '✓' : '—'}</CompCell>
              </CompRow>
            ))}
          </CompTable>
        </ComparisonSection>

        {/* ─── SECONDARY CTA ─── */}
        <SecondaryCTA />
      </PageContainer>
      <Footer />
    </>
  );
}