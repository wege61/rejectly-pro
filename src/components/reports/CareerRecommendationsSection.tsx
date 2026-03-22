"use client";

import React, { useState } from "react";
import styled from "styled-components";
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

// --- Styled Components ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  margin: 60px 0;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.01em;
`;

const SectionSubtitle = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  line-height: 1.5;
`;

const PathsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 12px;
  width: 100%;
`;

const PathCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  padding: 24px;

  background: rgba(22, 22, 26, 0.78);
  backdrop-filter: blur(60px) saturate(200%);
  -webkit-backdrop-filter: blur(60px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3);

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
      transparent 0%,
      rgba(255, 255, 255, 0.25) 40%,
      rgba(255, 255, 255, 0.45) 60%,
      rgba(255, 255, 255, 0.25) 80%,
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
`;

const PathHeader = styled.div`
  margin-bottom: 20px;
`;

const RoleTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 8px 0;
`;

const RationaleText = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
  margin: 0;
`;

const ListSection = styled.div`
  margin-top: 20px;
`;

const ListTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.28);
  margin: 0 0 10px 0;
`;

const CourseGrid = styled.div`
  display: grid;
  gap: 8px;
`;

const CourseRow = styled.a<{ $isClickable?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 11px 12px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: border-color 0.2s ease, background 0.2s ease;

  ${({ $isClickable }) =>
    $isClickable &&
    `
    cursor: pointer;
    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }
  `}
`;

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
`;

const CoursePlatform = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--primary-400);
  letter-spacing: 0.06em;
`;

const CourseName = styled.span`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.4;
`;

const CertTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`;

// --- Accordion for Projects ---
const AccordionHeader = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .chevron {
    width: 14px;
    height: 14px;
    color: rgba(255, 255, 255, 0.3);
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

const AccordionContent = styled(motion.div)`
  overflow: hidden;
`;

const AccordionInner = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

const ProjectIdeaItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &:last-child {
    border-bottom: none;
  }
`;

const ProjectIdeaText = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
`;

const ExternalLinkIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: "2px", color: "rgba(255,255,255,0.25)" }}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function ProjectIdeasAccordion({ ideas }: { ideas: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!ideas || ideas.length === 0) return null;

  return (
    <ListSection>
      <AccordionHeader $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <span>Resume-worthy projects ({ideas.length})</span>
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
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <AccordionInner>
              {ideas.map((idea, idx) => (
                <ProjectIdeaItem key={idx}>
                  <ProjectIdeaText>{idea}</ProjectIdeaText>
                </ProjectIdeaItem>
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
        <SectionTitle>Career Growth Roadmap</SectionTitle>
        <SectionSubtitle>
          Courses, certifications, and projects to reach{" "}
          <strong style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
            {recommendations[0]?.targetRole || "your target role"}
          </strong>
        </SectionSubtitle>
      </HeaderSection>

      <PathsGrid>
        {recommendations.map((rec, index) => (
          <PathCard key={index}>
            <PathHeader>
              <RoleTitle>{rec.targetRole}</RoleTitle>
              {rec.rationale && <RationaleText>{rec.rationale}</RationaleText>}
            </PathHeader>

            {rec.recommendedCourses?.length > 0 && (
              <ListSection>
                <ListTitle>Recommended Courses</ListTitle>
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
                        <CourseInfo>
                          <CoursePlatform>{course.platform}</CoursePlatform>
                          <CourseName>{course.name}</CourseName>
                        </CourseInfo>
                        {isClickable && <ExternalLinkIcon />}
                      </CourseRow>
                    );
                  })}
                </CourseGrid>
              </ListSection>
            )}

            {rec.recommendedCertifications?.length > 0 && (
              <ListSection>
                <ListTitle>Target Certifications</ListTitle>
                <CertTags>
                  {rec.recommendedCertifications.map((cert, idx) => (
                    <Badge
                      key={idx}
                      variant="default"
                      size="md"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        borderColor: "rgba(255, 255, 255, 0.09)",
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
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
    </Container>
  );
}
