"use client";

import styled from "styled-components";
import { useCVStore } from "./store";
import { motion, AnimatePresence } from "framer-motion";
import { AutocompleteInput } from "@/components/ui/AutocompleteInput";
import { useState, useEffect } from "react";
import { MonthYearPicker } from "@/components/ui/MonthYearPicker";

const Select = styled.select`
  width: 100%;
  background: color-mix(in srgb, var(--rj-ink) 3%, transparent);
  border: 1px solid color-mix(in srgb, var(--rj-ink) 10%, transparent);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--rj-ink);
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;
  appearance: none;
  cursor: pointer;

  &:focus {
    background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
    border-color: color-mix(in srgb, var(--rj-ink) 30%, transparent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--rj-ink) 5%, transparent);
  }

  option {
    background: var(--rj-surface);
    color: var(--rj-ink);
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid color-mix(in srgb, var(--rj-ink) 40%, transparent);
    pointer-events: none;
  }
`;

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const EduCard = styled(motion.div)`
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



export function EducationForm() {
  const { cv, addEducation, updateEducation, removeEducation, nextStep, setStep } = useCVStore();

  const [loadingLocationIndex, setLoadingLocationIndex] = useState<number | null>(null);

  useEffect(() => {
    // Auto-add an empty card if user arrives and it's empty
    if (cv.education.length === 0) {
      addEducation({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        location: "",
        graduationDate: "",
      });
    }
  }, [cv.education.length, addEducation]);

  const handleAdd = () => {
    addEducation({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      graduationDate: "",
    });
  };

  const fetchSchoolLocation = async (schoolName: string, index: number, context?: any) => {
    try {
      setLoadingLocationIndex(index);
      
      let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(schoolName)}&format=json&limit=1&addressdetails=1&accept-language=en`;
      
      // Strict country filtering to avoid mapping foreign universities to US restaurants
      if (context?.domain) {
        url += `&countrycodes=${encodeURIComponent(context.domain.toLowerCase())}`;
      }

      const res = await fetch(url, {
        headers: { 'User-Agent': 'RejectlyCVBuilder/1.0' }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const addr = data[0].address || {};
        const city = addr.city || addr.province || addr.town || addr.village || addr.county || addr.state || "";
        const country = addr.country || "";
        const locationString = [city, country].filter(Boolean).join(", ");
        
        updateEducation(index, { location: locationString });
      }
    } catch (e) {
      console.error("Failed to auto-fetch location", e);
    } finally {
      setLoadingLocationIndex(null);
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {cv.education.map((edu, index) => (
          <EduCard
            key={index} // In a real app we'd use a stable ID, index is ok for simple lists
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, overflow: 'hidden' }}
            transition={{ duration: 0.2 }}
          >
            {cv.education.length > 1 && (
              <DeleteButton onClick={() => removeEducation(index)} title="Remove education">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </DeleteButton>
            )}

            <Row>
              <InputGroup style={{ flex: 1 }}>
                <Label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '40px' }}>
                  <span>School / University</span>
                  {loadingLocationIndex === index && (
                    <span style={{ fontSize: '12px', color: 'var(--rj-ink)' }}>(Detecting Location...)</span>
                  )}
                  {edu.location && loadingLocationIndex !== index && edu.degree !== "High School Diploma" && (
                    <span style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--rj-ink) 40%, transparent)', fontWeight: 400 }}>
                      {edu.location}
                    </span>
                  )}
                </Label>
                <AutocompleteInput 
                  placeholder="e.g. Stanford University" 
                  value={edu.institution}
                  onChange={(val) => updateEducation(index, { institution: val, location: "" })}
                  onSelect={(val, context) => fetchSchoolLocation(val, index, context)}
                  onFocus={(e) => {
                    if (e.target.value === "Massachusetts Institute of Technology (MIT)") updateEducation(index, { institution: "" });
                  }}
                  fetchType="university"
                />
              </InputGroup>
            </Row>

            <Row>
              <InputGroup style={{ flex: 1 }}>
                <Label>Degree Type</Label>
                <SelectWrapper>
                  <Select 
                    value={edu.degree}
                    onChange={(e) => {
                      const newDegree = e.target.value;
                      if (newDegree === "High School Diploma") {
                        updateEducation(index, {
                          degree: newDegree,
                          institution: "",
                          fieldOfStudy: "",
                          location: ""
                        });
                      } else {
                        updateEducation(index, { degree: newDegree });
                      }
                    }}
                  >
                    <option value="" disabled>Select Degree</option>
                    <option value="Associate">Associate's Degree</option>
                    <option value="Bachelor's">Bachelor's Degree (B.A., B.S., etc.)</option>
                    <option value="Master's">Master's Degree (M.A., M.S., etc.)</option>
                    <option value="Doctorate">Doctorate (Ph.D., M.D., etc.)</option>
                    <option value="High School Diploma">High School Diploma</option>
                    <option value="Certificate">Certificate / Diploma</option>
                    <option value="Other">Other</option>
                  </Select>
                </SelectWrapper>
              </InputGroup>
              
              {edu.degree !== "High School Diploma" && (
                <InputGroup style={{ flex: 1 }}>
                  <Label>Field of Study</Label>
                  <AutocompleteInput 
                    placeholder="e.g. Computer Science" 
                    value={edu.fieldOfStudy ?? ""}
                    onChange={(val) => updateEducation(index, { fieldOfStudy: val })}
                    onFocus={(e) => {
                      if (e.target.value === "Theoretical Physics") updateEducation(index, { fieldOfStudy: "" });
                    }}
                    fetchType="field_of_study"
                  />
                </InputGroup>
              )}
            </Row>

            <Row>
              <InputGroup style={{ flex: 1 }}>
                <Label>Graduation Date</Label>
                <MonthYearPicker 
                  placeholder="Select Graduation Date" 
                  value={edu.graduationDate || ""}
                  onChange={(val: string) => updateEducation(index, { graduationDate: val })}
                  showPresent={true}
                />
              </InputGroup>

              {edu.degree === "High School Diploma" && (
                <InputGroup style={{ flex: 1, position: 'relative' }}>
                  <Label style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Location</span>
                    {loadingLocationIndex === index && (
                      <span style={{ fontSize: '11px', color: 'var(--rj-ink)' }}>(Auto-detecting...)</span>
                    )}
                  </Label>
                  <AutocompleteInput 
                    placeholder="e.g. Istanbul, Turkey" 
                    value={edu.location ?? ""}
                    onChange={(val) => updateEducation(index, { location: val })}
                    fetchType="location"
                  />
                </InputGroup>
              )}
            </Row>
          </EduCard>
        ))}
      </AnimatePresence>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        <AddButton onClick={handleAdd} style={{ flex: 1 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Another Education
        </AddButton>
      </div>
    </FormContainer>
  );
}
