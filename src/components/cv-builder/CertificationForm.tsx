"use client";

import styled from "styled-components";
import { useCVStore } from "./store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MonthYearPicker } from "@/components/ui/MonthYearPicker";

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const CertCard = styled(motion.div)`
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

export function CertificationForm() {
  const { cv, addCertification, updateCertification, removeCertification } = useCVStore();

  useEffect(() => {
    // Auto-add an empty card if user arrives and it's empty
    if (!cv.certifications || cv.certifications.length === 0) {
      addCertification({
        name: "",
        issuer: "",
        date: "",
      });
    }
  }, [cv.certifications, addCertification]);

  const handleAdd = () => {
    addCertification({
      name: "",
      issuer: "",
      date: "",
    });
  };

  const certs = cv.certifications || [];

  return (
    <FormContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {certs.map((cert, index) => (
          <CertCard
            key={index}
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, overflow: 'hidden' }}
            transition={{ duration: 0.2 }}
          >
            {certs.length > 1 && (
              <DeleteButton onClick={() => removeCertification(index)} title="Remove certification">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </DeleteButton>
            )}

            <Row>
              <InputGroup style={{ flex: 1 }}>
                <Label>Certification / Course Name</Label>
                <Input 
                  placeholder="e.g. AWS Certified Solutions Architect" 
                  value={cert.name}
                  onChange={(e) => updateCertification(index, { name: e.target.value })}
                  onFocus={(e) => {
                    if (e.target.value === "Level 3 Security Clearance" || e.target.value === "Hazardous Environment (HEV) Suit Operations Mark IV") updateCertification(index, { name: "" });
                  }}
                />
              </InputGroup>
            </Row>

            <Row>
              <InputGroup style={{ flex: 1 }}>
                <Label>Issuing Organization</Label>
                <Input 
                  placeholder="e.g. Amazon Web Services" 
                  value={cert.issuer || ""}
                  onChange={(e) => updateCertification(index, { issuer: e.target.value })}
                  onFocus={(e) => {
                    if (e.target.value === "Black Mesa Research Facility" || e.target.value === "Black Mesa Training Facility") updateCertification(index, { issuer: "" });
                  }}
                />
              </InputGroup>
              
              <InputGroup style={{ flex: 1 }}>
                <Label>Date Issued</Label>
                <MonthYearPicker 
                  placeholder="Select Date" 
                  value={cert.date || ""}
                  onChange={(val) => updateCertification(index, { date: val })}
                  showPresent={false}
                />
              </InputGroup>
            </Row>

            <Row>
              <InputGroup style={{ flex: 1 }}>
                <Label>Credential ID / URL (Optional)</Label>
                <Input 
                  placeholder="e.g. AWS-12345 or https://..." 
                  value={cert.credentialId || ""}
                  onChange={(e) => updateCertification(index, { credentialId: e.target.value })}
                />
              </InputGroup>
            </Row>
          </CertCard>
        ))}
      </AnimatePresence>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        <AddButton onClick={handleAdd} style={{ flex: 1 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Another Certification
        </AddButton>
      </div>
    </FormContainer>
  );
}
