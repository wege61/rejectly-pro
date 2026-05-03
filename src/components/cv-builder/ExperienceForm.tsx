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
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
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
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
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
    background: rgba(239, 68, 68, 0.2);
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
  color: rgba(255, 255, 255, 0.8);
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
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
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 24px;
`;

const SuggestionLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #3b82f6;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #3b82f6;
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
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  gap: 12px;
  align-items: flex-start;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.4);
    transform: translateY(-1px);
  }

  .icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    font-weight: 300;
  }

  &:hover .icon {
    background: #3b82f6;
  }
`;

const ActiveBulletCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  color: rgba(255, 255, 255, 0.9);
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
    color: #10b981; /* Green check */
  }
  
  .content {
    flex: 1;
    display: flex;
  }
  
  .delete {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    padding: 4px;
    display: flex;
    
    &:hover {
      color: #ef4444;
    }
  }
`;

const AddButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.4);
    color: #fff;
  }
`;

const BulletTextarea = styled.textarea`
  flex: 1;
  background: transparent;
  border: 1px solid transparent;
  color: rgba(255, 255, 255, 0.9);
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
    color: rgba(255, 255, 255, 0.3);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:hover:not(:focus) {
    border-color: rgba(255, 255, 255, 0.1);
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
                <Label>Role / Project Name</Label>
                <AutocompleteInput 
                  placeholder="e.g. Frontend Engineer OR Capstone Project" 
                  value={exp.title}
                  onChange={(val) => updateExperience(index, { title: val })}
                  fetchType="job_title"
                />
              </InputGroup>
            </Row>

            <Row>
              <InputGroup style={{ flex: 1 }}>
                <Label>Company / Context</Label>
                <AutocompleteInput 
                  placeholder="e.g. Apple OR University Name" 
                  value={exp.company}
                  onChange={(val) => updateExperience(index, { company: val })}
                  fetchType="company"
                />
              </InputGroup>
              <InputGroup style={{ flex: 1 }}>
                <Label>Location</Label>
                <AutocompleteInput 
                  placeholder="e.g. Cupertino, CA" 
                  value={exp.location || ""}
                  onChange={(val) => updateExperience(index, { location: val })}
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
                  background: 'rgba(59, 130, 246, 0.05)',
                  color: '#3b82f6',
                  border: '1px dashed rgba(59, 130, 246, 0.3)',
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
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              lineHeight: 1.5,
              marginBottom: '16px'
            }}
          >
            <strong>Pro Tip:</strong> No formal work experience? No problem. Add your university capstone projects, hackathon wins, or freelance work here. Our AI will help you translate them into professional achievements.
          </motion.div>
        )}
      </AnimatePresence>

      <AddButton onClick={() => addExperience({
        title: "", company: "", location: "", startDate: "", endDate: "", bullets: []
      })}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Experience or Project
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
