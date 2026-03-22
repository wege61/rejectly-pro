"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { useCVStore } from "@/components/cv-builder/store";
import { BasicsForm } from "@/components/cv-builder/BasicsForm";
import { EducationForm } from "@/components/cv-builder/EducationForm";
import { SkillsForm } from "@/components/cv-builder/SkillsForm";
import { ExperienceForm } from "@/components/cv-builder/ExperienceForm";
import { CertificationForm } from "@/components/cv-builder/CertificationForm";
import { SummaryForm } from "@/components/cv-builder/SummaryForm";
import { ThemeForm } from "@/components/cv-builder/ThemeForm";
import { CVPreview } from "@/components/cv-builder/CVPreview";
import { motion, AnimatePresence } from "framer-motion";
import { generatePDF } from "@/utils/exportPDF";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { Modal } from "@/components/ui/Modal";
import { Drawer, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: var(--bg-primary, #09090b);
  overflow: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
    height: 100dvh;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  max-width: 550px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(20, 20, 22, 0.4);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 10;
  position: relative;

  @media (max-width: 1024px) {
    max-width: 100%;
    height: 50vh;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const RightPanel = styled.div`
  flex: 1.5;
  height: 100%;
  display: flex;
  align-items: flex-start; /* Fixed: allows top of tall elements to be scrollable */
  justify-content: center;
  background: #000; /* Deep black for absolute contrast */
  padding: 40px;
  overflow-y: auto;

  /* Subtle ambient glow behind the CV */
  &::before {
    content: '';
    position: absolute;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const PreviewFAB = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  height: 56px;
  padding: 0 28px;
  border-radius: 9999px;
  z-index: 90;
  background: linear-gradient(135deg, var(--accent) 0%, #2563eb 100%);
  color: white;
  border: none;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(37, 99, 235, 0.5), inset 0 1px 0 rgba(255,255,255,0.3);
  }
`;

const EditorBody = styled.div`
  flex: 1;
  padding: 100px 48px 60px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  /* Minimalist Scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  @media (max-width: 1024px) {
    padding: 80px 24px 120px;
  }
`;

// Apple-like Stepper (Very subtle)
const StepIndicator = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 24px;
`;

const StepTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -0.03em;
  margin: 0 0 12px 0;
  line-height: 1.1;
`;

const StepDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 40px 0;
  line-height: 1.5;
  letter-spacing: -0.01em;
`;

// Form Inputs (Refined & Minimal)
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
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

// Smart Suggestions Area (Invisible AI replacing empty textareas)
const SuggestionsWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SuggestionLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  /* Subtle pulsing dot indicating background intelligence */
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
    opacity: 0.5;
  }
`;

const SuggestionCard = styled.button`
  text-align: left;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
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
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  /* Plus icon */
  .icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    font-weight: 300;
    transition: all 0.2s ease;
  }

  &:hover .icon {
    background: #fff;
    color: #000;
  }
`;

const CustomEntryButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  cursor: pointer;
  padding: 12px 0;
  text-align: left;
  transition: color 0.2s ease;

  &:hover {
  }
`;

const steps = ["Basics", "Education", "Experience", "Certifications", "Skills", "Summary", "Design"];

export default function CVBuilderPage() {
  const { cv, currentStep, nextStep, prevStep } = useCVStore();
  const { user } = useAuth();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDownload = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setDownloading(true);
    const filename = cv.contact.name ? `${cv.contact.name.replace(/\s+/g, '_')}_CV` : 'Rejectly_Pro_CV';
    
    // Auto-save built CV to dashboard
    try {
      await fetch('/api/cv-builder/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData: cv, filename }),
      });
    } catch (e) {
      console.error("Failed to save CV to dashboard", e);
    }
    
    await generatePDF('cv-preview-paper', filename, cv);
    setDownloading(false);
  };

  // Fix hydration mismatch for Zustand persist
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent server-client mismatch rendering

  // In a real app, these would be fetched intelligently based on 'role' and 'company'
  const mockSuggestions = [
    "Architected and developed scalable frontend applications using React and Next.js, improving page load speed by 40%.",
    "Collaborated with cross-functional teams to deliver 15+ features in a fast-paced Agile environment.",
    "Mentored junior developers and established code review guidelines, increasing overall code quality."
  ];

  return (
    <Container>
      <LeftPanel>
        <EditorBody>
          <StepIndicator>Step {currentStep} of 7 · {steps[currentStep - 1]}</StepIndicator>
          
          <StepTitle>
            {currentStep === 1 && "Start with the basics"}
            {currentStep === 2 && "Where did you study?"}
            {currentStep === 3 && "Add your recent role"}
            {currentStep === 4 && "Any Certifications or Courses?"}
            {currentStep === 5 && "What are your skills?"}
            {currentStep === 6 && "Professional Summary"}
            {currentStep === 7 && "Choose your Theme"}
          </StepTitle>
          <StepDescription>
            {currentStep === 1 && "We'll build your profile step by step."}
            {currentStep === 2 && "Add your degrees and educational background."}
            {currentStep === 3 && "Let's focus on what you achieved. We'll handle the formatting."}
            {currentStep === 4 && "Add relevant certifications, licenses or courses."}
            {currentStep === 5 && "Add technical and soft skills (press Enter to add)."}
            {currentStep === 6 && "Add a tailored introduction for your profile."}
            {currentStep === 7 && "Select an accent color before downloading."}
          </StepDescription>

          <AnimatePresence mode="wait">
            {currentStep === 1 && <BasicsForm key="step1" />}
            {currentStep === 2 && <EducationForm key="step2" />}
            {currentStep === 3 && <ExperienceForm key="step3" />}
            {currentStep === 4 && <CertificationForm key="step4" />}
            {currentStep === 5 && <SkillsForm key="step5" />}
            {currentStep === 6 && <SummaryForm key="step6" />}
            {currentStep === 7 && <ThemeForm key="step7" />}
          </AnimatePresence>

          <div style={{ display: 'flex', gap: '12px', marginTop: '48px', alignItems: 'center' }}>
            {currentStep > 1 && (
              <Button 
                variant="secondary"
                onClick={prevStep} 
              >
                Back
              </Button>
            )}
            
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
              {(currentStep === 2 || currentStep === 4) && (
                <Button 
                  variant="ghost"
                  onClick={nextStep}
                  style={{ textDecoration: 'underline' }}
                >
                  Skip this step
                </Button>
              )}
              {currentStep < 7 ? (
                <Button variant="primary" onClick={nextStep}>
                  Continue
                </Button>
              ) : (
                <Button 
                  variant="glass-primary"
                  onClick={handleDownload} 
                  isLoading={downloading}
                >
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </EditorBody>
      </LeftPanel>
      
      {!isMobile && (
        <RightPanel>
          <CVPreview />
        </RightPanel>
      )}

      {isMobile && (
        <>
          <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 90 }}>
            <Button 
              variant="glass-secondary" 
              onClick={() => setPreviewOpen(true)}
              style={{ 
                height: '56px', 
                borderRadius: '9999px', 
                padding: '0 28px',
                background: 'rgba(20, 20, 25, 0.4)',
                backdropFilter: 'blur(30px) saturate(200%)',
                WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview CV
            </Button>
          </div>

          <Drawer isOpen={previewOpen} onClose={() => setPreviewOpen(false)} shouldScaleBackground={true}>
            <DrawerHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                  <DrawerTitle>Live Preview</DrawerTitle>
                  <DrawerDescription>Review your layout before downloading.</DrawerDescription>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    variant="glass-primary"
                    onClick={handleDownload} 
                    isLoading={downloading}
                  >
                    Save PDF
                  </Button>
                </div>
              </div>
            </DrawerHeader>
            <DrawerBody style={{ padding: 0 }}>
               <div style={{ 
                 width: '100%', 
                 height: '75vh',
                 overflow: 'auto', 
                 WebkitOverflowScrolling: 'touch',
                 padding: '24px 16px 60px',
               }}>
                 <div style={{
                   width: '780px',
                   minWidth: '780px',
                   margin: '0 auto',
                   touchAction: 'pan-x pan-y',
                   background: '#fff',
                   borderRadius: '4px'
                 }}>
                   {previewOpen && <CVPreview />}
                 </div>
               </div>
            </DrawerBody>
          </Drawer>
        </>
      )}

      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>Your Executive CV is Ready</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
            Create a free account to download your beautifully formatted CV and unlock our AI-powered ATS optimizer suite.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button 
              variant="ghost"
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
              style={{ flex: 1 }}
            >
              Sign In
            </Button>
            <Button 
              variant="primary"
              onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
              style={{ flex: 1 }}
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </Modal>

    </Container>
  );
}

