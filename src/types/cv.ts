export interface CVContact {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  portfolio?: string;
}

export interface CVExperience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface CVEducation {
  degree: string;
  fieldOfStudy?: string;
  institution: string;
  location?: string;
  graduationDate?: string | null;
  details?: string | null;
}

export interface CVSkills {
  technical: string[];
  soft: string[];
}

export interface CVCertification {
  name: string;
  issuer?: string;
  date?: string | null;
  credentialId?: string;
}

export interface CVLanguage {
  language: string;
  proficiency: string;
}

export interface GeneratedCV {
  contact: CVContact;
  summary: string;
  experience: CVExperience[];
  education: CVEducation[];
  skills: CVSkills;
  certifications?: CVCertification[];
  languages?: CVLanguage[];
  photoUrl?: string;
  themeColor?: string;
}
