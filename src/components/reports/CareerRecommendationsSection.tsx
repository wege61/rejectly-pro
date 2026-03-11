"use client";

import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

// --- Types ---
interface CourseRecommendation {
  name: string;
  platform: string;
  url?: string;
}

interface CareerRecommendation {
  targetRole: string;
  rationale: string;
  recommendedCourses: CourseRecommendation[];
  recommendedCertifications: string[];
  projectIdeas?: string[];
}

export interface CareerRecommendationsReportProps {
  recommendations: CareerRecommendation[];
}

// --- Animations ---
const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 4px rgba(102, 126, 234, 0.2);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
`;

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  animation: ${pulseGlow} 3s infinite ease-in-out;

  svg {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.6));
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #fff;
  letter-spacing: -0.02em;
  background: linear-gradient(to right, #ffffff, #a3bffa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SectionSubtitle = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0;
`;

// Glass Card styling
const GlassCard = styled.div`
  background: rgba(25, 25, 30, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
  }
`;

const PathsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
`;

const PathCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 28px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px;
  }

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(102, 126, 234, 0.2);
  }
`;

const PathHeader = styled.div`
  margin-bottom: 20px;
`;

const RoleTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  }
`;

const RationaleText = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0;
`;

const ListSection = styled.div`
  margin-top: 24px;
`;

const ListTitle = styled.h4`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.8;
  }
`;

const CourseGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const CourseRow = styled.a<{ $isClickable?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  transition: all 0.2s ease;

  ${({ $isClickable }) => $isClickable && `
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  `}
`;

const CourseIcon = styled.div`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(102, 126, 234, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CoursePlatform = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #667eea;
  letter-spacing: 0.05em;
`;

const CourseName = styled.span`
  font-size: 0.9rem;
  color: #fff;
  line-height: 1.4;
`;

const CertTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

// --- Icons ---
const RoadmapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <path d="M6.5 8a2 2 0 0 0-1.5 2v11a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3.5" />
    <path d="M12 21v-4" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const AwardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const LightbulbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// --- Accordion Component for Projects ---
const AccordionHeader = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .accordion-icon {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    font-weight: 600;

    svg {
      width: 16px;
      height: 16px;
      color: #667eea;
    }
  }

  .chevron {
    width: 16px;
    height: 16px;
    color: rgba(255, 255, 255, 0.5);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

const AccordionContent = styled(motion.div)`
  overflow: hidden;
`;

const AccordionInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
`;

function ProjectIdeasAccordion({ ideas }: { ideas: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!ideas || ideas.length === 0) return null;

  return (
    <ListSection>
      <AccordionHeader $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <div className="accordion-icon">
          <LightbulbIcon /> Resume-Worthy Projects ({ideas.length})
        </div>
        <div className="chevron">
          <ChevronDownIcon />
        </div>
      </AccordionHeader>

      <AnimatePresence initial={false}>
        {isOpen && (
          <AccordionContent
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <AccordionInner>
              {ideas.map((idea, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 16px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderLeft: "3px solid #667eea",
                    borderRadius: "0 8px 8px 0",
                    fontSize: "0.9rem",
                    color: "rgba(255, 255, 255, 0.9)",
                    lineHeight: 1.5,
                  }}
                >
                  {idea}
                </div>
              ))}
            </AccordionInner>
          </AccordionContent>
        )}
      </AnimatePresence>
    </ListSection>
  );
}

export function CareerRecommendationsSection({ recommendations }: CareerRecommendationsReportProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <Container>
      <HeaderSection>
        <IconWrapper>
          <RoadmapIcon />
        </IconWrapper>
        <TitleBlock>
          <SectionTitle>Career Growth Roadmap</SectionTitle>
          <SectionSubtitle>
            Certifications, courses, and projects to elevate your profile in <strong style={{color: "var(--primary-400)"}}>{recommendations[0]?.targetRole || "this role"}</strong> to the next level
          </SectionSubtitle>
        </TitleBlock>
      </HeaderSection>

      <GlassCard>
        <PathsGrid>
          {recommendations.map((rec, index) => (
            <PathCard key={index}>
              <PathHeader>
                <RoleTitle>{rec.targetRole}</RoleTitle>
              </PathHeader>

              {rec.recommendedCourses?.length > 0 && (
                <ListSection>
                  <ListTitle>
                    <BookIcon /> Recommended Courses
                  </ListTitle>
                  <CourseGrid>
                    {rec.recommendedCourses.map((course, idx) => {
                      const isClickable = !!course.url && !course.url.includes("google.com/search");
                      return (
                        <CourseRow 
                          key={idx} 
                          as={isClickable ? "a" : "div"}
                          href={isClickable ? course.url : undefined} 
                          target={isClickable ? "_blank" : undefined} 
                          rel={isClickable ? "noopener noreferrer" : undefined}
                          $isClickable={isClickable}
                        >
                          <CourseIcon>
                            <BookIcon />
                          </CourseIcon>
                          <CourseInfo>
                            <CoursePlatform>{course.platform}</CoursePlatform>
                            <CourseName>{course.name}</CourseName>
                          </CourseInfo>
                          {isClickable && (
                            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", color: "rgba(255,255,255,0.4)" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            </div>
                          )}
                        </CourseRow>
                      );
                    })}
                  </CourseGrid>
                </ListSection>
              )}

              {rec.recommendedCertifications?.length > 0 && (
                <ListSection>
                  <ListTitle>
                    <AwardIcon /> Target Certifications
                  </ListTitle>
                  <CertTags>
                    {rec.recommendedCertifications.map((cert, idx) => (
                      <Badge key={idx} variant="default" size="md" style={{ 
                        background: 'rgba(118, 75, 162, 0.15)', 
                        borderColor: 'rgba(118, 75, 162, 0.3)',
                        color: '#ebdaec'
                      }}>
                        {cert}
                      </Badge>
                    ))}
                  </CertTags>
                </ListSection>
              )}

              <ProjectIdeasAccordion ideas={rec.projectIdeas || []} />
            </PathCard>
          ))}
        </PathsGrid>
      </GlassCard>
    </Container>
  );
}
