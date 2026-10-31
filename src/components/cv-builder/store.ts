import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GeneratedCV, CVEducation, CVExperience, CVCertification, CVLeadership, CVProject } from '@/types/cv';

// Initial placeholder CV state (Showcase for new users - Gordon Freeman Edition)
export const initialCVState: GeneratedCV = {
  contact: {
    name: "Gordon Freeman, Ph.D.",
    email: "gfreeman@blackmesa.gov",
    phone: "(Classified)",
    location: "Black Mesa Research Facility, NM",
    linkedin: "linkedin.com/in/freeman-phd",
    portfolio: "blackmesa.gov/personnel/gfreeman"
  },
  summary: "Theoretical Physicist with expertise in anomalous materials, quantum teleportation, and interdimensional rift containment. Proven track record of surviving resonance cascades and leading resistance movements. Adept at rapid problem-solving under extreme hostile conditions using highly advanced HEV suit technology and improvised tools.",
  experience: [
    {
      company: "The Resistance",
      title: "Key Operative & Freedom Fighter",
      location: "City 17",
      startDate: "2020-01",
      endDate: "Present",
      current: true,
      description: "",
      bullets: [
        "Led the global uprising against the Universal Union (Combine) through targeted strikes on key infrastructure, including Nova Prospekt.",
        "Operated the experimental Zero-Point Energy Field Manipulator (Gravity Gun) to solve complex physics-based puzzles and neutralize heavily armored threats.",
        "Led squad-based urban combat operations resulting in the successful destabilization of the Citadel's dark energy reactor."
      ]
    },
    {
      company: "Black Mesa Research Facility",
      title: "Research Associate - Anomalous Materials",
      location: "Black Mesa, NM",
      startDate: "1999-05",
      endDate: "2000-05",
      current: false,
      description: "",
      bullets: [
        "Handled extremely hazardous extra-dimensional crystalline samples (Sample GG-3883) in the Anti-Mass Spectrometer.",
        "Successfully navigated complex laboratory environments during total structural failure, hazardous material spills, and aggressive alien deployment.",
        "Single-handedly suppressed hostile military clean-up crews and Xen fauna to secure the Lambda Complex teleportation labs."
      ]
    }
  ],
  education: [
    {
      institution: "Massachusetts Institute of Technology (MIT)",
      degree: "Ph.D. in Theoretical Physics",
      location: "Cambridge, MA",
      startDate: "1995-09",
      endDate: "1999-05",
      description: "Thesis: Observation of Einstein-Podolsky-Rosen Entanglement on Supraquantum Structures by Induction Through Nonlinear Transuranic Crystal."
    }
  ],
  skills: {
    technical: ["Theoretical Physics", "Quantum Mechanics", "HEV Suit Operations", "Zero-Point Energy Manipulation", "Tactical Combat", "Xen Biology", "Submachine Guns", "Crowbar Proficiency"],
    soft: []
  },
  certifications: [
    {
      name: "Level 3 Security Clearance",
      issuer: "Black Mesa Research Facility",
      date: "1999-05",
      url: ""
    },
    {
      name: "Hazardous Environment (HEV) Suit Operations Mark IV",
      issuer: "Black Mesa Training Facility",
      date: "1999-04",
      url: ""
    }
  ],
  languages: [],
  leadership: [],
  themeColor: "#E5691F", // Half-Life Orange
  photoUrl: "/gordon-freeman.png",
};

/** "Start empty": a blank resume (the example above is what new visitors see first). */
export const emptyCVState: GeneratedCV = {
  contact: { name: "", email: "", phone: "", location: "", linkedin: "", portfolio: "" },
  summary: "",
  experience: [],
  education: [],
  skills: { technical: [], soft: [] },
  certifications: [],
  languages: [],
  leadership: [],
  projects: [],
  // Most people starting from scratch here are students: lead with education.
  isEntryLevel: true,
  themeColor: "#1E2024",
  photoUrl: "",
};

interface CVState {
  cv: GeneratedCV;
  activeCVId: string | null;
  currentStep: number;
  setActiveCVId: (id: string | null) => void;
  resetCV: () => void;
  startEmpty: () => void;
  /** Opens an example resume (from /resume/[role]) in the builder. */
  loadCV: (cv: GeneratedCV) => void;
  updateContact: (contact: Partial<GeneratedCV['contact']>) => void;
  updatePhoto: (photoBase64: string) => void;
  updateSummary: (summary: string) => void;
  updateThemeColor: (color: string) => void;
  /** Student layout: education first, projects in their own section. */
  setEntryLevel: (entryLevel: boolean) => void;
  addEducation: (edu: CVEducation) => void;
  updateEducation: (index: number, edu: Partial<CVEducation>) => void;
  removeEducation: (index: number) => void;
  addExperience: (exp: CVExperience) => void;
  updateExperience: (index: number, exp: Partial<CVExperience>) => void;
  removeExperience: (index: number) => void;
  addExperienceBullet: (index: number, bullet: string) => void;
  updateExperienceBullet: (expIndex: number, bulletIndex: number, newBullet: string) => void;
  removeExperienceBullet: (index: number, bulletIndex: number) => void;
  addProject: (project: CVProject) => void;
  updateProject: (index: number, project: Partial<CVProject>) => void;
  removeProject: (index: number) => void;
  addProjectBullet: (index: number, bullet: string) => void;
  updateProjectBullet: (projectIndex: number, bulletIndex: number, bullet: string) => void;
  removeProjectBullet: (projectIndex: number, bulletIndex: number) => void;
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
      currentStep: 1, // 1 Basics, 2 Education (+ certifications), 3 Experience, 4 Projects, 5 Skills, 6 Summary, 7 Finish
      
      setActiveCVId: (id: string | null) => set({ activeCVId: id }),
      
      resetCV: () => set({ cv: initialCVState, activeCVId: null, currentStep: 1 }),
      startEmpty: () => set({ cv: emptyCVState, activeCVId: null, currentStep: 1 }),
      loadCV: (cv: GeneratedCV) => set({ cv, activeCVId: null, currentStep: 1 }),
      
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
      
      setEntryLevel: (entryLevel: boolean) => set((state: CVState) => ({ cv: { ...state.cv, isEntryLevel: entryLevel } })),

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
      
      addProject: (project: CVProject) => set((state: CVState) => ({
        cv: { ...state.cv, projects: [...(state.cv.projects || []), project] }
      })),

      updateProject: (index: number, patch: Partial<CVProject>) => set((state: CVState) => {
        const projects = [...(state.cv.projects || [])];
        projects[index] = { ...projects[index], ...patch };
        return { cv: { ...state.cv, projects } };
      }),

      removeProject: (index: number) => set((state: CVState) => ({
        cv: { ...state.cv, projects: (state.cv.projects || []).filter((_, i) => i !== index) }
      })),

      addProjectBullet: (index: number, bullet: string) => set((state: CVState) => {
        const projects = [...(state.cv.projects || [])];
        projects[index] = { ...projects[index], bullets: [...(projects[index].bullets || []), bullet] };
        return { cv: { ...state.cv, projects } };
      }),

      updateProjectBullet: (projectIndex: number, bulletIndex: number, bullet: string) => set((state: CVState) => {
        const projects = [...(state.cv.projects || [])];
        const bullets = [...(projects[projectIndex].bullets || [])];
        bullets[bulletIndex] = bullet;
        projects[projectIndex] = { ...projects[projectIndex], bullets };
        return { cv: { ...state.cv, projects } };
      }),

      removeProjectBullet: (projectIndex: number, bulletIndex: number) => set((state: CVState) => {
        const projects = [...(state.cv.projects || [])];
        projects[projectIndex] = { ...projects[projectIndex], bullets: (projects[projectIndex].bullets || []).filter((_, i) => i !== bulletIndex) };
        return { cv: { ...state.cv, projects } };
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
        let newProjects = [...(state.cv.projects || [])];
        // Leaving step 2 (education and certifications): drop empty cards.
        if (state.currentStep === 2) {
          newEducation = newEducation.filter(edu => edu.institution.trim() !== "");
          newCerts = newCerts.filter(cert => cert.name.trim() !== "");
        }
        // Leaving step 4 (projects): drop empty cards.
        if (state.currentStep === 4) {
          newProjects = newProjects.filter(p => p.name.trim() !== "");
        }

        return {
          cv: { ...state.cv, education: newEducation, certifications: newCerts, projects: newProjects },
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
