import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GeneratedCV, CVEducation, CVExperience, CVCertification, CVLeadership } from '@/types/cv';

// Initial empty CV state
const initialCVState: GeneratedCV = {
  contact: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: ""
  },
  summary: "",
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: []
  },
  certifications: [],
  languages: [],
  leadership: [],
  themeColor: "#000000",
};

interface CVState {
  cv: GeneratedCV;
  activeCVId: string | null;
  currentStep: number;
  setActiveCVId: (id: string | null) => void;
  resetCV: () => void;
  updateContact: (contact: Partial<GeneratedCV['contact']>) => void;
  updatePhoto: (photoBase64: string) => void;
  updateSummary: (summary: string) => void;
  updateThemeColor: (color: string) => void;
  addEducation: (edu: CVEducation) => void;
  updateEducation: (index: number, edu: Partial<CVEducation>) => void;
  removeEducation: (index: number) => void;
  addExperience: (exp: CVExperience) => void;
  updateExperience: (index: number, exp: Partial<CVExperience>) => void;
  removeExperience: (index: number) => void;
  addExperienceBullet: (index: number, bullet: string) => void;
  updateExperienceBullet: (expIndex: number, bulletIndex: number, newBullet: string) => void;
  removeExperienceBullet: (index: number, bulletIndex: number) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addCertification: (cert: CVCertification) => void;
  updateCertification: (index: number, cert: Partial<CVCertification>) => void;
  removeCertification: (index: number) => void;
  addLeadership: (role: CVLeadership) => void;
  updateLeadership: (index: number, role: Partial<CVLeadership>) => void;
  removeLeadership: (index: number) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useCVStore = create<CVState>()(
  persist(
    (set) => ({
      cv: initialCVState,
      activeCVId: null,
      currentStep: 1, // 1: Basics, 2: Education, 3: Experience, 4: Certifications, 5: Skills, 6: Summary
      
      setActiveCVId: (id: string | null) => set({ activeCVId: id }),
      
      resetCV: () => set({ cv: initialCVState, activeCVId: null, currentStep: 1 }),
      
      updateContact: (contactPatch: Partial<GeneratedCV['contact']>) => set((state: CVState) => ({
        cv: { 
          ...state.cv, 
          contact: { ...state.cv.contact, ...contactPatch } 
        }
      })),

      updatePhoto: (photoBase64: string) => set((state: CVState) => ({
        cv: { ...state.cv, photoUrl: photoBase64 }
      })),
      
      updateSummary: (summary: string) => set((state: CVState) => ({
        cv: { ...state.cv, summary }
      })),
      
      updateThemeColor: (color: string) => set((state: CVState) => ({
        cv: { ...state.cv, themeColor: color }
      })),
      
      addEducation: (edu: CVEducation) => set((state: CVState) => ({
        cv: { ...state.cv, education: [...state.cv.education, edu] }
      })),
      
      updateEducation: (index: number, eduPatch: Partial<CVEducation>) => set((state: CVState) => {
        const newEdu = [...state.cv.education];
        newEdu[index] = { ...newEdu[index], ...eduPatch };
        return { cv: { ...state.cv, education: newEdu } };
      }),
      
      removeEducation: (index: number) => set((state: CVState) => ({
        cv: { ...state.cv, education: state.cv.education.filter((_, i) => i !== index) }
      })),
      
      addExperience: (exp: CVExperience) => set((state: CVState) => ({
        cv: { ...state.cv, experience: [...state.cv.experience, exp] }
      })),
      
      updateExperience: (index: number, expPatch: Partial<CVExperience>) => set((state: CVState) => {
        const newExp = [...state.cv.experience];
        newExp[index] = { ...newExp[index], ...expPatch };
        return { cv: { ...state.cv, experience: newExp } };
      }),
      
      removeExperience: (index: number) => set((state: CVState) => ({
        cv: { ...state.cv, experience: state.cv.experience.filter((_, i) => i !== index) }
      })),
      
      addExperienceBullet: (index: number, bullet: string) => set((state: CVState) => {
        const newExp = [...state.cv.experience];
        newExp[index] = { ...newExp[index], bullets: [...newExp[index].bullets, bullet] };
        return { cv: { ...state.cv, experience: newExp } };
      }),
      
      updateExperienceBullet: (expIndex: number, bulletIndex: number, newBullet: string) => set((state: CVState) => {
        const newExp = [...state.cv.experience];
        const newBullets = [...newExp[expIndex].bullets];
        newBullets[bulletIndex] = newBullet;
        newExp[expIndex] = { ...newExp[expIndex], bullets: newBullets };
        return { cv: { ...state.cv, experience: newExp } };
      }),
      
      removeExperienceBullet: (index: number, bulletIndex: number) => set((state: CVState) => {
        const newExp = [...state.cv.experience];
        newExp[index] = { 
          ...newExp[index], 
          bullets: newExp[index].bullets.filter((_, i) => i !== bulletIndex) 
        };
        return { cv: { ...state.cv, experience: newExp } };
      }),
      
      addSkill: (skill: string) => set((state: CVState) => {
        if (state.cv.skills.technical.includes(skill)) return state;
        return {
          cv: {
            ...state.cv,
            skills: {
              ...state.cv.skills,
              technical: [...state.cv.skills.technical, skill]
            }
          }
        };
      }),
      
      removeSkill: (skill: string) => set((state: CVState) => ({
        cv: {
          ...state.cv,
          skills: {
            ...state.cv.skills,
            technical: state.cv.skills.technical.filter(s => s !== skill)
          }
        }
      })),
      
      addCertification: (cert: CVCertification) => set((state: CVState) => ({
        cv: { ...state.cv, certifications: [...(state.cv.certifications || []), cert] }
      })),
      
      updateCertification: (index: number, certPatch: Partial<CVCertification>) => set((state: CVState) => {
        const newCerts = [...(state.cv.certifications || [])];
        newCerts[index] = { ...newCerts[index], ...certPatch };
        return { cv: { ...state.cv, certifications: newCerts } };
      }),
      
      removeCertification: (index: number) => set((state: CVState) => ({
        cv: { ...state.cv, certifications: (state.cv.certifications || []).filter((_, i) => i !== index) }
      })),

      addLeadership: (role: CVLeadership) => set((state: CVState) => ({
        cv: { ...state.cv, leadership: [...(state.cv.leadership || []), role] }
      })),

      updateLeadership: (index: number, rolePatch: Partial<CVLeadership>) => set((state: CVState) => {
        const newRoles = [...(state.cv.leadership || [])];
        newRoles[index] = { ...newRoles[index], ...rolePatch };
        return { cv: { ...state.cv, leadership: newRoles } };
      }),

      removeLeadership: (index: number) => set((state: CVState) => ({
        cv: { ...state.cv, leadership: (state.cv.leadership || []).filter((_, i) => i !== index) }
      })),
      
      setStep: (step: number) => set({ currentStep: step }),
      nextStep: () => set((state: CVState) => {
        let newEducation = [...state.cv.education];
        let newCerts = [...(state.cv.certifications || [])];
        // Clean up empty education card when leaving step 2
        if (state.currentStep === 2) {
          newEducation = newEducation.filter(edu => edu.institution.trim() !== "");
        }
        if (state.currentStep === 4) {
          newCerts = newCerts.filter(cert => cert.name.trim() !== "");
        }
        
        return { 
          cv: { ...state.cv, education: newEducation, certifications: newCerts },
          currentStep: Math.min(state.currentStep + 1, 7) 
        };
      }),
      prevStep: () => set((state: CVState) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
    }),
    {
      name: 'rejectly-cv-builder-storage', // Saves to local storage instantly
    }
  )
);
