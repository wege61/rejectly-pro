import { PRESENT_MAP } from "@/lib/languageUtils";
/**
 * ATS Utility Functions
 * Post-processing utilities to ensure CV content is ATS-compliant
 */

/**
 * Common abbreviations and their full forms
 * Used by Greenhouse, Lever, and other ATS systems that require expanded abbreviations
 */
export const ABBREVIATION_EXPANSIONS: Record<string, string> = {
  // Cloud & Infrastructure
  AWS: "Amazon Web Services (AWS)",
  GCP: "Google Cloud Platform (GCP)",
  Azure: "Microsoft Azure",
  EC2: "Elastic Compute Cloud (EC2)",
  S3: "Simple Storage Service (S3)",
  RDS: "Relational Database Service (RDS)",
  ECS: "Elastic Container Service (ECS)",
  EKS: "Elastic Kubernetes Service (EKS)",
  IAM: "Identity and Access Management (IAM)",
  VPC: "Virtual Private Cloud (VPC)",
  CDN: "Content Delivery Network (CDN)",

  // Programming & Development
  API: "Application Programming Interface (API)",
  REST: "Representational State Transfer (REST)",
  SDK: "Software Development Kit (SDK)",
  IDE: "Integrated Development Environment (IDE)",
  OOP: "Object-Oriented Programming (OOP)",
  TDD: "Test-Driven Development (TDD)",
  BDD: "Behavior-Driven Development (BDD)",
  MVC: "Model-View-Controller (MVC)",
  MVVM: "Model-View-ViewModel (MVVM)",

  // Web Technologies - Only expand truly obscure acronyms, not universal ones
  // NOTE: HTML, CSS, URL, DOM, HTTP are NOT expanded — universally understood and look odd when expanded
  JSON: "JavaScript Object Notation (JSON)",
  XML: "Extensible Markup Language (XML)",
  SPA: "Single Page Application (SPA)",
  PWA: "Progressive Web App (PWA)",

  // DevOps & CI/CD
  "CI/CD": "Continuous Integration/Continuous Deployment (CI/CD)",
  CI: "Continuous Integration (CI)",
  CD: "Continuous Deployment (CD)",
  IaC: "Infrastructure as Code (IaC)",
  K8s: "Kubernetes (K8s)",

  // Databases
  SQL: "Structured Query Language (SQL)",
  NoSQL: "Not Only SQL (NoSQL)",
  RDBMS: "Relational Database Management System (RDBMS)",
  ORM: "Object-Relational Mapping (ORM)",
  ETL: "Extract, Transform, Load (ETL)",

  // Business & Management
  MBA: "Master of Business Administration (MBA)",
  PMP: "Project Management Professional (PMP)",
  PMO: "Project Management Office (PMO)",
  ROI: "Return on Investment (ROI)",
  KPI: "Key Performance Indicator (KPI)",
  KPIs: "Key Performance Indicators (KPIs)",
  OKR: "Objectives and Key Results (OKR)",
  OKRs: "Objectives and Key Results (OKRs)",
  SLA: "Service Level Agreement (SLA)",
  B2B: "Business-to-Business (B2B)",
  B2C: "Business-to-Consumer (B2C)",
  CRM: "Customer Relationship Management (CRM)",
  ERP: "Enterprise Resource Planning (ERP)",
  SWOT: "Strengths, Weaknesses, Opportunities, Threats (SWOT)",
  "P&L": "Profit and Loss (P&L)",
  EBITDA: "Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA)",

  // Marketing & Sales
  SEO: "Search Engine Optimization (SEO)",
  SEM: "Search Engine Marketing (SEM)",
  PPC: "Pay-Per-Click (PPC)",
  CTR: "Click-Through Rate (CTR)",
  CPC: "Cost Per Click (CPC)",
  CPM: "Cost Per Mille (CPM)",
  CPA: "Cost Per Acquisition (CPA)",
  CAC: "Customer Acquisition Cost (CAC)",
  LTV: "Lifetime Value (LTV)",
  CLV: "Customer Lifetime Value (CLV)",
  NPS: "Net Promoter Score (NPS)",
  CSAT: "Customer Satisfaction Score (CSAT)",

  // Technology & Security
  UI: "User Interface (UI)",
  UX: "User Experience (UX)",
  QA: "Quality Assurance (QA)",
  UAT: "User Acceptance Testing (UAT)",
  SSL: "Secure Sockets Layer (SSL)",
  TLS: "Transport Layer Security (TLS)",
  HTTPS: "Hypertext Transfer Protocol Secure (HTTPS)",
  SSH: "Secure Shell (SSH)",
  VPN: "Virtual Private Network (VPN)",
  GDPR: "General Data Protection Regulation (GDPR)",
  SOC: "System and Organization Controls (SOC)",
  PCI: "Payment Card Industry (PCI)",
  HIPAA: "Health Insurance Portability and Accountability Act (HIPAA)",

  // Agile & Methodologies
  Agile: "Agile Methodology",
  Scrum: "Scrum Framework",
  SDLC: "Software Development Life Cycle (SDLC)",
  MVP: "Minimum Viable Product (MVP)",
  POC: "Proof of Concept (POC)",

  // HR & Certifications
  HR: "Human Resources (HR)",
  SHRM: "Society for Human Resource Management (SHRM)",
  PHR: "Professional in Human Resources (PHR)",
  SPHR: "Senior Professional in Human Resources (SPHR)",
  CFA: "Chartered Financial Analyst (CFA)",
  CCNA: "Cisco Certified Network Associate (CCNA)",
  CCNP: "Cisco Certified Network Professional (CCNP)",

  // C-Level & Executive Titles
  CEO: "Chief Executive Officer (CEO)",
  CTO: "Chief Technology Officer (CTO)",
  CFO: "Chief Financial Officer (CFO)",
  COO: "Chief Operating Officer (COO)",
  CMO: "Chief Marketing Officer (CMO)",
  CIO: "Chief Information Officer (CIO)",
  CPO: "Chief Product Officer (CPO)",
  VP: "Vice President (VP)",
  SVP: "Senior Vice President (SVP)",
  EVP: "Executive Vice President (EVP)",

  // IT & Infrastructure
  IT: "Information Technology (IT)",
  SaaS: "Software as a Service (SaaS)",
  PaaS: "Platform as a Service (PaaS)",
  IaaS: "Infrastructure as a Service (IaaS)",
  DNS: "Domain Name System (DNS)",
  TCP: "Transmission Control Protocol (TCP)",
  IP: "Internet Protocol (IP)",
  LAN: "Local Area Network (LAN)",
  WAN: "Wide Area Network (WAN)",

  // Data & Analytics
  ML: "Machine Learning (ML)",
  AI: "Artificial Intelligence (AI)",
  NLP: "Natural Language Processing (NLP)",
  BI: "Business Intelligence (BI)",
  DWH: "Data Warehouse (DWH)",
  OLAP: "Online Analytical Processing (OLAP)",
  OLTP: "Online Transaction Processing (OLTP)",
};

/**
 * Expands abbreviations in text for ATS compatibility
 * Only expands on first occurrence to avoid repetition
 */
export function expandAbbreviations(text: string): string {
  let result = text;
  const expanded = new Set<string>();

  // Sort by length descending to match longer abbreviations first
  const sortedAbbreviations = Object.keys(ABBREVIATION_EXPANSIONS).sort(
    (a, b) => b.length - a.length
  );

  for (const abbr of sortedAbbreviations) {
    // Skip if already expanded
    if (expanded.has(abbr)) continue;

    // Create a word boundary regex for exact match
    const regex = new RegExp(`\\b${abbr}\\b`, "g");
    const matches = result.match(regex);

    if (matches && matches.length > 0) {
      // Only expand first occurrence
      const expansion = ABBREVIATION_EXPANSIONS[abbr];

      // Check if expansion already exists in text (avoid double expansion)
      // Also check for AI's reversed format like "AWS (Amazon Web Services)"
      const hasExpansion = result.includes(expansion);
      const hasReversedFormat = new RegExp(`${abbr}\\s*\\([^)]+\\)`, 'i').test(result);
      const hasParenAbbr = new RegExp(`\\(${abbr}\\)`, 'i').test(result);

      if (!hasExpansion && !hasReversedFormat && !hasParenAbbr) {
        result = result.replace(regex, (match, offset) => {
          if (!expanded.has(abbr)) {
            expanded.add(abbr);
            return expansion;
          }
          return match;
        });
      }
    }
  }

  return result;
}

/**
 * Expands abbreviations in skills array
 * Returns skills with expanded abbreviations at first mention
 */
export function expandSkillAbbreviations(skills: string[]): string[] {
  const expandedSkills: string[] = [];
  const alreadyExpanded = new Set<string>();

  for (const skill of skills) {
    const upperSkill = skill.toUpperCase();
    let expanded = false;

    // Check if skill already contains an expansion pattern
    // Pattern 1: "(AWS)" - abbreviation in parentheses
    // Pattern 2: "AWS (...)" - abbreviation followed by expansion in parentheses
    const hasAbbrInParens = /\([A-Z]{2,}\)/.test(skill);
    const hasAbbrWithExpansion = /^[A-Z]{2,}\s*\([^)]+\)/.test(skill);

    if (hasAbbrInParens || hasAbbrWithExpansion) {
      expandedSkills.push(skill);
      // Mark this abbreviation as expanded so we don't try again
      const match = skill.match(/\(([A-Z/]{2,})\)/) || skill.match(/^([A-Z]{2,})\s*\(/);
      if (match) {
        alreadyExpanded.add(match[1]);
      }
      continue;
    }

    // Method 1: Exact match (e.g., "AWS" -> "Amazon Web Services (AWS)")
    const exactMatch = Object.keys(ABBREVIATION_EXPANSIONS).find(
      (abbr) => abbr.toUpperCase() === upperSkill || skill === abbr
    );

    if (exactMatch && !alreadyExpanded.has(exactMatch)) {
      expandedSkills.push(ABBREVIATION_EXPANSIONS[exactMatch]);
      alreadyExpanded.add(exactMatch);
      expanded = true;
    }

    // Only a skill that IS an abbreviation is expanded ("SQL"). Expanding inside
    // longer names produced wrong product names ("Power Business Intelligence
    // (BI)") and unreadable ones ("Strengths, Weaknesses, ... (SWOT) analizi").

    // No expansion needed
    if (!expanded) {
      expandedSkills.push(skill);
    }
  }

  return expandedSkills.map((skill) => {
    // Deduplicate consecutive repeated words (e.g. "Agile Methodology Methodologies" → "Agile Methodology")
    return skill.replace(/(\b\w+)\s+\1s?\b/gi, '$1');
  });
}

/**
 * Valid month names for date normalization
 */
const VALID_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_ABBREVIATIONS: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Sept: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

/**
 * Normalizes date to "Month YYYY" format for ATS compatibility
 * Handles various input formats: "Jan 2020", "01/2020", "2020-01", etc.
 */
// Words CVs use for an ongoing role, in the languages we support. They are all
// normalized to "Present" so sorting works; localizeCVDates translates it back.
const ONGOING_WORDS = new Set([
  "present", "current", "currently", "now", "ongoing", "today", "to date",
  ...Object.values(PRESENT_MAP).map((w) => w.toLocaleLowerCase("tr")),
  "halen", "hâlen", "hala", "hâlâ", "günümüz", "devam ediyor", "devam", "şu an", "aktif",
  "heute", "aktuell", "actualidad", "presente", "en cours", "huidig", "jelenleg",
]);

function isOngoingDate(date: string): boolean {
  return ONGOING_WORDS.has(date.trim().toLocaleLowerCase("tr"));
}

export function normalizeDateFormat(date: string | null | undefined): string {
  // A missing date stays missing: showing "Present" would claim a job is ongoing.
  if (!date || !date.trim()) return "";
  const trimmed = date.trim();
  if (isOngoingDate(trimmed)) return "Present";

  // Already in correct format "Month YYYY"
  const correctFormat = VALID_MONTHS.find((m) => trimmed.startsWith(m));
  if (correctFormat && /\d{4}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle abbreviated months: "Jan 2020" -> "January 2020"
  for (const [abbr, full] of Object.entries(MONTH_ABBREVIATIONS)) {
    const abbrRegex = new RegExp(`^${abbr}\\s*(\\d{4})$`, "i");
    const match = trimmed.match(abbrRegex);
    if (match) {
      return `${full} ${match[1]}`;
    }
  }

  // Handle MM/YYYY format: "01/2020" -> "January 2020"
  const mmyyyyMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{4})$/);
  if (mmyyyyMatch) {
    const monthIndex = parseInt(mmyyyyMatch[1], 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${VALID_MONTHS[monthIndex]} ${mmyyyyMatch[2]}`;
    }
  }

  // Handle YYYY-MM format: "2020-01" -> "January 2020"
  const yyyymmMatch = trimmed.match(/^(\d{4})[\/\-](\d{1,2})$/);
  if (yyyymmMatch) {
    const monthIndex = parseInt(yyyymmMatch[2], 10) - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${VALID_MONTHS[monthIndex]} ${yyyymmMatch[1]}`;
    }
  }

  // A bare year ("2020") stays a bare year; we don't know the month.

  // Return as-is if no pattern matches
  return trimmed;
}

/**
 * Cleans special characters from text for ATS compatibility
 * Replaces problematic characters with ATS-safe alternatives
 * Preserves Turkish characters: ç, ğ, ı, i, ö, ş, ü and their uppercase variants
 */
export function cleanSpecialCharacters(text: string | null | undefined): string {
  // The model omits fields it has no data for (e.g. location), so tolerate gaps.
  return (text ?? "")
    // Replace smart quotes with straight quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Replace en-dash and em-dash with hyphen
    .replace(/[\u2013\u2014]/g, "-")
    // Replace bullet characters with standard dash
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "-")
    // Replace other problematic characters
    .replace(/[\u00A0]/g, " ") // Non-breaking space
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, ""); // Zero-width characters
    // NOTE: Removed the non-ASCII filter to preserve Turkish and other international characters
    // Turkish chars (İıĞğŞşÜüÖöÇç) and Latin Extended chars are now preserved
}

/**
 * Parses a date string to a comparable Date object
 * Handles formats like "January 2020", "Jan 2020", "Present", etc.
 */
function parseDateForSorting(dateStr: string): Date {
  if (!dateStr) return new Date(0);
  if (dateStr.toLowerCase() === "present") {
    return new Date(); // Present = current date (most recent)
  }

  const trimmed = dateStr.trim();

  // Try to parse "Month YYYY" format
  const monthYearMatch = trimmed.match(/^(\w+)\s+(\d{4})$/);
  if (monthYearMatch) {
    const monthName = monthYearMatch[1];
    const year = parseInt(monthYearMatch[2], 10);

    const monthIndex = VALID_MONTHS.findIndex(
      (m) => m.toLowerCase() === monthName.toLowerCase()
    );
    if (monthIndex !== -1) {
      return new Date(year, monthIndex, 1);
    }

    // Try abbreviated month
    const fullMonth = MONTH_ABBREVIATIONS[monthName];
    if (fullMonth) {
      const fullMonthIndex = VALID_MONTHS.indexOf(fullMonth);
      return new Date(year, fullMonthIndex, 1);
    }
  }

  // Try to parse just year
  const yearMatch = trimmed.match(/^(\d{4})$/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1], 10), 0, 1);
  }

  // Fallback: try native Date parsing
  const parsed = new Date(trimmed);
  return isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

/**
 * Sorts experiences in reverse chronological order (newest first)
 * Uses endDate for sorting, with "Present" treated as most recent
 */
function sortExperiencesByDate<
  T extends { startDate: string; endDate: string }
>(experiences: T[]): T[] {
  return [...experiences].sort((a, b) => {
    const dateA = parseDateForSorting(a.endDate || a.startDate);
    const dateB = parseDateForSorting(b.endDate || b.startDate);
    return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
  });
}

/**
 * Post-processes generated CV for ATS compliance
 * Applies all normalization functions to ensure maximum compatibility
 */
export interface GeneratedCVData {
  contact: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    startDate?: string;
    details?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects?: Array<{
    name: string;
    role?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    bullets?: string[];
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  leadership?: Array<{
    title: string;
    organization: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }>;
  isEntryLevel?: boolean;
  /** Locale the CV is written in (e.g. "en", "tr"); used for PDF headings. */
  language?: string;
  colorTemplate?: string;
  /** Tools the user confirmed having (tool suggestion step). */
  confirmedTools?: string[];
}

// Proficiency values the model uses when the CV gave none; better shown as nothing.
const PROFICIENCY_PLACEHOLDERS = /^(not specified|unspecified|unknown|n\/a|na|none|-|belirtilmemiş|bilinmiyor)$/i;

export function postProcessCVForATS(cv: GeneratedCVData): GeneratedCVData {
  const languages = (cv.languages || [])
    .filter((lang) => lang?.language?.trim())
    .map((lang) => {
      const proficiency = cleanSpecialCharacters(lang.proficiency).trim();
      return {
        language: cleanSpecialCharacters(lang.language).trim(),
        proficiency: PROFICIENCY_PLACEHOLDERS.test(proficiency) ? "" : proficiency,
      };
    });
  const languageNames = new Set(languages.map((l) => l.language.toLowerCase()));

  // Spoken languages belong in the languages section, not in the skills list.
  const technical = (cv.skills?.technical || [])
    .map((skill) => cleanSpecialCharacters(skill).trim())
    .filter((skill) => skill && !languageNames.has(skill.toLowerCase()));

  return {
    ...cv,
    contact: {
      ...cv.contact,
      name: cleanSpecialCharacters(cv.contact?.name),
      location: cleanSpecialCharacters(cv.contact?.location),
      // Sanitize LinkedIn URL — fix common AI typo 'inkedin.com' → 'linkedin.com'
      linkedin: cv.contact?.linkedin
        ? cv.contact.linkedin
            .replace(/^inkedin\.com/i, 'linkedin.com')
            .replace(/^https?:\/\/inkedin\.com/i, 'https://linkedin.com')
        : cv.contact?.linkedin,
    },
    // Abbreviations are expanded once, in the skills list only. Expanding them in
    // every bullet and the summary made the text repetitive and hard to read.
    summary: cleanSpecialCharacters(cv.summary),
    // Process experience - CRITICAL: Sort in reverse chronological order (newest first)
    experience: sortExperiencesByDate(
      (cv.experience || []).map((exp) => ({
        ...exp,
        title: cleanSpecialCharacters(exp.title),
        company: cleanSpecialCharacters(exp.company),
        location: cleanSpecialCharacters(exp.location),
        startDate: normalizeDateFormat(exp.startDate),
        endDate: normalizeDateFormat(exp.endDate),
        bullets: (exp.bullets || []).map((bullet) => cleanSpecialCharacters(bullet).trim()).filter(Boolean),
      }))
    ),
    projects: cv.projects?.map((proj) => ({
      ...proj,
      startDate: normalizeDateFormat(proj.startDate),
      endDate: normalizeDateFormat(proj.endDate),
      bullets: (proj.bullets || []).map((bullet) => cleanSpecialCharacters(bullet).trim()).filter(Boolean),
    })),
    leadership: cv.leadership?.map((role) => ({
      ...role,
      startDate: normalizeDateFormat(role.startDate),
      endDate: normalizeDateFormat(role.endDate),
      bullets: (role.bullets || []).map((bullet) => cleanSpecialCharacters(bullet).trim()).filter(Boolean),
    })),
    // "Present" is not a valid graduation or certification date; drop it.
    education: (cv.education || []).map((edu) => {
      const graduationDate = normalizeDateFormat(edu.graduationDate);
      return {
        ...edu,
        degree: cleanSpecialCharacters(edu.degree),
        institution: cleanSpecialCharacters(edu.institution),
        location: cleanSpecialCharacters(edu.location),
        startDate: normalizeDateFormat(edu.startDate),
        graduationDate: graduationDate === "Present" ? "" : graduationDate,
        details: edu.details ? cleanSpecialCharacters(edu.details) : undefined,
      };
    }),
    skills: {
      technical: expandSkillAbbreviations(technical),
      soft: (cv.skills?.soft || []).map(cleanSpecialCharacters),
    },
    certifications: cv.certifications?.map((cert) => {
      const date = normalizeDateFormat(cert.date);
      return {
        ...cert,
        name: cleanSpecialCharacters(cert.name),
        issuer: cleanSpecialCharacters(cert.issuer),
        date: date === "Present" ? "" : date,
      };
    }),
    languages,
  };
}
