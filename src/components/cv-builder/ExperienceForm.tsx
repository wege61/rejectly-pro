"use client";

import styled from "styled-components";
import { useCVStore } from "./store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AutocompleteInput } from "@/components/ui/AutocompleteInput";
import { BulletModal } from "./BulletModal";
import { MonthYearPicker } from "@/components/ui/MonthYearPicker";

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const ExpCard = styled(motion.div)`
  background: color-mix(in srgb, var(--rj-ink) 2%, transparent);
  border: 1px solid color-mix(in srgb, var(--rj-ink) 8%, transparent);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: color-mix(in srgb, var(--rj-pen) 10%, transparent);
  color: var(--rj-pen);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: color-mix(in srgb, var(--rj-pen) 20%, transparent);
    transform: scale(1.05);
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: color-mix(in srgb, var(--rj-ink) 80%, transparent);
`;

const Input = styled.input`
  width: 100%;
  background: color-mix(in srgb, var(--rj-ink) 3%, transparent);
  border: 1px solid color-mix(in srgb, var(--rj-ink) 10%, transparent);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--rj-ink);
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
    border-color: color-mix(in srgb, var(--rj-ink) 30%, transparent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--rj-ink) 5%, transparent);
  }

  &::placeholder {
    color: color-mix(in srgb, var(--rj-ink) 20%, transparent);
  }
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SuggestionsWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px dashed color-mix(in srgb, var(--rj-ink) 10%, transparent);
  padding-top: 24px;
`;

const SuggestionLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--rj-ink);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--rj-ink);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const SuggestionCard = styled.button`
  text-align: left;
  background: color-mix(in srgb, var(--rj-ink) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--rj-ink) 20%, transparent);
  border-radius: 12px;
  padding: 16px;
  color: color-mix(in srgb, var(--rj-ink) 85%, transparent);
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  gap: 12px;
  align-items: flex-start;

  &:hover {
    background: color-mix(in srgb, var(--rj-ink) 10%, transparent);
    border-color: color-mix(in srgb, var(--rj-ink) 40%, transparent);
    transform: translateY(-1px);
  }

  .icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--rj-ink) 20%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--rj-ink);
    font-size: 16px;
    font-weight: 300;
  }

  &:hover .icon {
    background: var(--rj-ink);
  }
`;

const ActiveBulletCard = styled.div`
  background: color-mix(in srgb, var(--rj-ink) 3%, transparent);
  border: 1px solid color-mix(in srgb, var(--rj-ink) 8%, transparent);
  border-radius: 12px;
  padding: 16px;
  color: color-mix(in srgb, var(--rj-ink) 90%, transparent);
  font-size: 14px;
  line-height: 1.5;
  display: flex;
  gap: 12px;
  align-items: center;

  .icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--rj-pass); /* Green check */
  }
  
  .content {
    flex: 1;
    display: flex;
  }
  
  .delete {
    background: transparent;
    border: none;
    color: color-mix(in srgb, var(--rj-ink) 30%, transparent);
    cursor: pointer;
    padding: 4px;
    display: flex;
    
    &:hover {
      color: var(--rj-pen);
    }
  }
`;

const AddButton = styled.button`
  background: color-mix(in srgb, var(--rj-ink) 5%, transparent);
  border: 1px dashed color-mix(in srgb, var(--rj-ink) 20%, transparent);
  border-radius: 16px;
  padding: 20px;
  color: color-mix(in srgb, var(--rj-ink) 70%, transparent);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: color-mix(in srgb, var(--rj-ink) 10%, transparent);
    border-color: color-mix(in srgb, var(--rj-ink) 40%, transparent);
    color: var(--rj-ink);
  }
`;

const BulletTextarea = styled.textarea`
  flex: 1;
  background: transparent;
  border: 1px solid transparent;
  color: color-mix(in srgb, var(--rj-ink) 90%, transparent);
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  font-family: inherit;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  min-height: 44px;

  /* Highlight bracketed text like [X] softly */
  &::placeholder {
    color: color-mix(in srgb, var(--rj-ink) 30%, transparent);
  }

  &:focus {
    outline: none;
    border-color: color-mix(in srgb, var(--rj-ink) 20%, transparent);
    background: color-mix(in srgb, var(--rj-ink) 5%, transparent);
  }
  
  &:hover:not(:focus) {
    border-color: color-mix(in srgb, var(--rj-ink) 10%, transparent);
  }
`;

export function ExperienceForm() {
  const { cv, addExperience, updateExperience, removeExperience, addExperienceBullet, removeExperienceBullet, updateExperienceBullet } = useCVStore();
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  useEffect(() => {
    if (cv.experience.length === 0) {
      addExperience({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        bullets: []
      });
    }
  }, [cv.experience.length, addExperience]);

  return (
    <FormContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {cv.experience.map((exp, index) => (
          <ExpCard
            key={index}
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, overflow: 'hidden' }}
            transition={{ duration: 0.2 }}
          >
            {cv.experience.length > 1 && (
              <DeleteButton onClick={() => removeExperience(index)} title="Remove experience">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </DeleteButton>
            )}

            <Row>
              <InputGroup style={{ flex: 1 }}>
                <Label>Role</Label>
                <AutocompleteInput 
                  placeholder="e.g. Software Engineering Intern" 
                  value={exp.title}
                  onChange={(val) => updateExperience(index, { title: val })}
                  onFocus={(e) => {
                    if (e.target.value === "Key Operative & Freedom Fighter" || e.target.value === "Research Associate - Anomalous Materials") updateExperience(index, { title: "" });
                  }}
                  fetchType="job_title"
                />
              </InputGroup>
            </Row>

            <Row>
              <InputGroup style={{ flex: 1 }}>
                <Label>Company or organization</Label>
                <AutocompleteInput 
                  placeholder="e.g. Halden Analytics" 
                  value={exp.company}
                  onChange={(val) => updateExperience(index, { company: val })}
                  onFocus={(e) => {
                    if (e.target.value === "The Resistance" || e.target.value === "Black Mesa Research Facility") updateExperience(index, { company: "" });
                  }}
                  fetchType="company"
                />
              </InputGroup>
              <InputGroup style={{ flex: 1 }}>
                <Label>Location</Label>
                <AutocompleteInput 
                  placeholder="e.g. Cupertino, CA" 
                  value={exp.location || ""}
                  onChange={(val) => updateExperience(index, { location: val })}
                  onFocus={(e) => {
                    if (e.target.value === "City 17" || e.target.value === "Black Mesa, NM") updateExperience(index, { location: "" });
                  }}
                  fetchType="location"
                />
              </InputGroup>
            </Row>

            <Row>
              <InputGroup style={{ flex: 1 }}>
                <Label>Start Date</Label>
                <MonthYearPicker 
                  placeholder="Select Start Date" 
                  value={exp.startDate || ""}
                  onChange={(val) => updateExperience(index, { startDate: val })}
                />
              </InputGroup>
              <InputGroup style={{ flex: 1 }}>
                <Label>End Date</Label>
                <MonthYearPicker 
                  placeholder="Select End Date" 
                  value={exp.endDate || ""}
                  onChange={(val) => updateExperience(index, { endDate: val })}
                  showPresent={true}
                />
              </InputGroup>
            </Row>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Key Responsibilities & Achievements</span>
              </Label>

              {/* Show already added bullets */}
              {exp.bullets.map((bullet, bIndex) => (
                <ActiveBulletCard key={bIndex}>
                  <div className="icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div className="content">
                    <BulletTextarea 
                      value={bullet} 
                      onChange={(e) => updateExperienceBullet(index, bIndex, e.target.value)}
                      onFocus={(e) => {
                        if (e.target.value.includes("Universal Union") || e.target.value.includes("Zero-Point Energy") || e.target.value.includes("dark energy reactor") || e.target.value.includes("extra-dimensional crystalline") || e.target.value.includes("structural failure") || e.target.value.includes("hostile military clean-up")) updateExperienceBullet(index, bIndex, "");
                      }}
                      placeholder="Describe what you accomplished..."
                    />
                  </div>
                  <button className="delete" onClick={(e) => { e.preventDefault(); removeExperienceBullet(index, bIndex); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </ActiveBulletCard>
              ))}

              {/* Add Bullet Button */}
              <button 
                onClick={(e) => { e.preventDefault(); setActiveModalIndex(index); }}
                style={{
                  background: 'color-mix(in srgb, var(--rj-ink) 5%, transparent)',
                  color: 'var(--rj-ink)',
                  border: '1px dashed color-mix(in srgb, var(--rj-ink) 30%, transparent)',
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  fontWeight: 500
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                Add Responsibility / Achievement
              </button>
            </div>
          </ExpCard>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {cv.experience.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'color-mix(in srgb, var(--rj-pass) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--rj-pass) 20%, transparent)',
              borderRadius: '12px',
              padding: '16px',
              color: 'color-mix(in srgb, var(--rj-ink) 90%, transparent)',
              fontSize: '14px',
              lineHeight: 1.5,
              marginBottom: '16px'
            }}
          >
            <strong>No work experience yet?</strong> Part-time jobs, TA and research roles, volunteering and club leadership count. Projects have their own step next.
          </motion.div>
        )}
      </AnimatePresence>

      <AddButton onClick={() => addExperience({
        title: "", company: "", location: "", startDate: "", endDate: "", bullets: []
      })}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add experience
      </AddButton>

      {activeModalIndex !== null && (
        <BulletModal 
          isOpen={true}
          onClose={() => setActiveModalIndex(null)}
          onAdd={(bullet) => addExperienceBullet(activeModalIndex, bullet)}
          jobTitle={cv.experience[activeModalIndex].title}
          company={cv.experience[activeModalIndex].company}
        />
      )}
    </FormContainer>
  );
}
