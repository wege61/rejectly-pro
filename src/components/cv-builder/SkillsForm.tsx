"use client";

import styled from "styled-components";
import { useCVStore } from "./store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 20px;
  color: #fff;
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
`;

const EnterHint = styled.div`
  position: absolute;
  right: 16px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
`;

const Tag = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
`;

const DeleteTagButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  border-radius: 50%;
  transition: color 0.1s;

  &:hover {
    color: #ef4444;
  }
`;

const SuggestionsCard = styled(motion.div)`
  margin-top: 16px;
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
    opacity: 0.5;
  }
`;

const RecommendationsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 12px;
`;

const RecommendationsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -0.01em;
`;

const SuggestionPill = styled.button<{ $added: boolean }>`
  background: ${props => props.$added ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.$added ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$added ? '#34d399' : 'rgba(255, 255, 255, 0.8)'};
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  cursor: ${props => props.$added ? 'default' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(8px);

  &:hover {
    background: ${props => props.$added ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.1)'};
    border-color: ${props => props.$added ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.5)'};
    color: ${props => props.$added ? '#34d399' : '#fff'};
    transform: ${props => props.$added ? 'none' : 'translateY(-2px) scale(1.02)'};
    box-shadow: ${props => props.$added ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.15)'};
  }
`;

const SectionHeading = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin: 16px 0 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;

interface SkillGroups {
  experienceSkills: string[];
  educationSkills: string[];
  certificationSkills: string[];
}

export function SkillsForm() {
  const { cv, addSkill, removeSkill } = useCVStore();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<SkillGroups | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      // Create a hash of the user's background to cache results
      const validExp = cv.experience.filter(e => e.title.trim() !== "");
      const validEdu = cv.education.filter(e => e.institution.trim() !== "");
      const validCerts = (cv.certifications || []).filter(c => c.name.trim() !== "");
      
      if (validExp.length === 0 && validEdu.length === 0 && validCerts.length === 0) return;

      const bgHash = btoa(encodeURIComponent(JSON.stringify({ 
        e: validExp.map(x => x.title + x.company), 
        d: validEdu.map(x => x.degree + x.fieldOfStudy), 
        c: validCerts.map(x => x.name) 
      })));
      const cacheKey = `rejectly_skills_${bgHash}`;

      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          // Only use cache if it matches the new SkillGroups structure (not a flat array)
          if (parsed && !Array.isArray(parsed) && (parsed.experienceSkills || parsed.educationSkills || parsed.certificationSkills)) {
            setSuggestions(parsed);
            setHasFetched(true);
            return;
          }
        } catch (e) {}
      }

      setLoadingSuggestions(true);
      try {
        const res = await fetch('/api/cv/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ experience: validExp, education: validEdu, certifications: validCerts })
        });
        const data = await res.json();
        if (data && (data.experienceSkills || data.educationSkills || data.certificationSkills)) {
          const formattedData = {
            experienceSkills: data.experienceSkills || [],
            educationSkills: data.educationSkills || [],
            certificationSkills: data.certificationSkills || []
          };
          setSuggestions(formattedData);
          setHasFetched(true);
          localStorage.setItem(cacheKey, JSON.stringify(formattedData));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    if (!hasFetched) {
      fetchSuggestions();
    }
  }, [cv.experience, cv.education, cv.certifications, hasFetched]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = inputValue.trim();
      if (val) {
        addSkill(val);
        setInputValue("");
      }
    }
  };

    const renderPill = (skill: string, idx: number) => {
      const isAdded = cv.skills.technical.includes(skill);
      return (
        <motion.div
          key={skill}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.04, duration: 0.3 }}
        >
          <SuggestionPill 
            $added={isAdded}
            onClick={() => {
              if (!isAdded) addSkill(skill);
            }}
          >
            {isAdded ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            )}
            {skill}
          </SuggestionPill>
        </motion.div>
      );
    };

    return (
      <FormContainer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
      <InputGroup>
        <Label>Add a skill</Label>
        <InputWrapper>
          <Input 
            placeholder="e.g. React, Python, Project Management..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {inputValue && <EnterHint>Press Enter ↵</EnterHint>}
        </InputWrapper>
      </InputGroup>

      <TagsContainer>
        <AnimatePresence>
          {cv.skills.technical.map((skill) => (
            <Tag 
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              {skill}
              <DeleteTagButton onClick={() => removeSkill(skill)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </DeleteTagButton>
            </Tag>
          ))}
        </AnimatePresence>
      </TagsContainer>

      {/* Smart Suggestions */}
      {suggestions && (suggestions.experienceSkills.length > 0 || suggestions.educationSkills.length > 0 || suggestions.certificationSkills.length > 0) && (
        <SuggestionsCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <RecommendationsHeader>
            <div>
              <RecommendationsTitle>Highly Recommended</RecommendationsTitle>
              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>Tailored to your professional background</div>
            </div>
          </RecommendationsHeader>
          
          {suggestions.experienceSkills.length > 0 && (
            <>
              <SectionHeading>Based on Experience</SectionHeading>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {suggestions.experienceSkills.map((skill, idx) => renderPill(skill, idx))}
              </div>
            </>
          )}

          {suggestions.educationSkills.length > 0 && (
            <>
              <SectionHeading>Based on Education</SectionHeading>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {suggestions.educationSkills.map((skill, idx) => renderPill(skill, idx))}
              </div>
            </>
          )}

          {suggestions.certificationSkills.length > 0 && (
            <>
              <SectionHeading>Based on Certifications</SectionHeading>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {suggestions.certificationSkills.map((skill, idx) => renderPill(skill, idx))}
              </div>
            </>
          )}

        </SuggestionsCard>
      )}

    </FormContainer>
  );
}
