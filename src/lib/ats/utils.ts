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

  // Web Technologies - CRITICAL: Greenhouse/Taleo don't recognize these!
  HTML: "HyperText Markup Language (HTML)",
  CSS: "Cascading Style Sheets (CSS)",
  JSON: "JavaScript Object Notation (JSON)",
  XML: "Extensible Markup Language (XML)",
  HTTP: "Hypertext Transfer Protocol (HTTP)",
  URL: "Uniform Resource Locator (URL)",
  DOM: "Document Object Model (DOM)",
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

    // Method 2: Skill starts with abbreviation (e.g., "REST APIs" -> "Representational State Transfer (REST) APIs")
    if (!expanded) {
      for (const abbr of Object.keys(ABBREVIATION_EXPANSIONS)) {
        if (skill.startsWith(abbr + " ") && !alreadyExpanded.has(abbr)) {
          const remainder = skill.substring(abbr.length);
          expandedSkills.push(ABBREVIATION_EXPANSIONS[abbr] + remainder);
          alreadyExpanded.add(abbr);
          expanded = true;
          break;
        }
      }
    }

    // Method 3: Skill contains abbreviation anywhere - use expandAbbreviations
    if (!expanded) {
      const expandedText = expandAbbreviations(skill);
      if (expandedText !== skill) {
        expandedSkills.push(expandedText);
        expanded = true;
      }
    }

    // No expansion needed
    if (!expanded) {
      expandedSkills.push(skill);
    }
  }

  return expandedSkills;
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
export function normalizeDateFormat(date: string): string {
  if (!date || date.toLowerCase() === "present") {
    return "Present";
  }

  const trimmed = date.trim();

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

  // Handle just year: "2020" -> "January 2020" (assume January for graduation dates)
  const yearOnlyMatch = trimmed.match(/^(\d{4})$/);
  if (yearOnlyMatch) {
    return `January ${yearOnlyMatch[1]}`;
  }

  // Return as-is if no pattern matches
  return trimmed;
}

/**
 * Maximum character length for a bullet point (ATS readability standard)
 */
export const MAX_BULLET_LENGTH = 120;

/**
 * Truncates or splits bullet points to meet ATS length requirements
 * Returns array of bullets (may split long bullets into multiple)
 */
export function normalizeBulletLength(bullet: string): string[] {
  const trimmed = bullet.trim();

  // If within limit, return as-is
  if (trimmed.length <= MAX_BULLET_LENGTH) {
    return [trimmed];
  }

  // Try to split at natural breakpoints
  const splitPoints = [
    ", resulting in",
    ", leading to",
    ", achieving",
    ", which",
    ", driving",
    "; ",
    ", and ",
  ];

  for (const splitPoint of splitPoints) {
    const splitIndex = trimmed.indexOf(splitPoint);
    if (splitIndex > 30 && splitIndex < trimmed.length - 30) {
      const firstPart = trimmed.substring(0, splitIndex).trim();
      const secondPart = trimmed.substring(splitIndex + splitPoint.length).trim();

      // Capitalize second part if it doesn't start with capital
      const capitalizedSecond =
        secondPart.charAt(0).toUpperCase() + secondPart.slice(1);

      // Recursively normalize if still too long
      return [
        ...normalizeBulletLength(firstPart),
        ...normalizeBulletLength(capitalizedSecond),
      ];
    }
  }

  // If no natural split point, truncate at word boundary
  let truncated = trimmed.substring(0, MAX_BULLET_LENGTH);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > MAX_BULLET_LENGTH - 30) {
    truncated = truncated.substring(0, lastSpace);
  }

  // Add ellipsis indicator if truncated mid-thought
  if (truncated.length < trimmed.length && !truncated.endsWith(".")) {
    // Try to end at a logical point
    const lastPeriod = truncated.lastIndexOf(".");
    if (lastPeriod > MAX_BULLET_LENGTH - 50) {
      truncated = truncated.substring(0, lastPeriod + 1);
    }
  }

  return [truncated];
}

/**
 * Cleans special characters from text for ATS compatibility
 * Replaces problematic characters with ATS-safe alternatives
 * Preserves Turkish characters: ç, ğ, ı, i, ö, ş, ü and their uppercase variants
 */
export function cleanSpecialCharacters(text: string): string {
  return text
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
  if (!dateStr || dateStr.toLowerCase() === "present") {
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
    const dateA = parseDateForSorting(a.endDate);
    const dateB = parseDateForSorting(b.endDate);
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
    details?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
}

export function postProcessCVForATS(cv: GeneratedCVData): GeneratedCVData {
  return {
    ...cv,
    // Clean contact info
    contact: {
      ...cv.contact,
      name: cleanSpecialCharacters(cv.contact.name),
      location: cleanSpecialCharacters(cv.contact.location),
    },
    // Expand abbreviations and clean summary
    summary: cleanSpecialCharacters(expandAbbreviations(cv.summary)),
    // Process experience - CRITICAL: Sort in reverse chronological order (newest first)
    experience: sortExperiencesByDate(
      cv.experience.map((exp) => ({
        ...exp,
        title: cleanSpecialCharacters(exp.title),
        company: cleanSpecialCharacters(exp.company),
        location: cleanSpecialCharacters(exp.location),
        startDate: normalizeDateFormat(exp.startDate),
        endDate: normalizeDateFormat(exp.endDate),
        bullets: exp.bullets.flatMap((bullet) =>
          normalizeBulletLength(
            cleanSpecialCharacters(expandAbbreviations(bullet))
          )
        ),
      }))
    ),
    // Process education - CRITICAL: Don't allow fabricated dates like "Present"
    education: cv.education.map((edu) => {
      let graduationDate = edu.graduationDate;

      // "Present" is not a valid graduation date - it's likely fabricated
      if (graduationDate?.toLowerCase() === "present") {
        graduationDate = undefined as any;
      }
      // null or empty strings should stay null/undefined
      else if (!graduationDate || graduationDate === "null") {
        graduationDate = undefined as any;
      }
      else {
        graduationDate = normalizeDateFormat(graduationDate);
      }

      return {
        ...edu,
        degree: cleanSpecialCharacters(expandAbbreviations(edu.degree)),
        institution: cleanSpecialCharacters(edu.institution),
        location: edu.location ? cleanSpecialCharacters(edu.location) : undefined,
        graduationDate,
        details: edu.details
          ? cleanSpecialCharacters(expandAbbreviations(edu.details))
          : undefined,
      };
    }),
    // Expand skill abbreviations
    skills: {
      technical: expandSkillAbbreviations(cv.skills.technical).map(
        cleanSpecialCharacters
      ),
      soft: cv.skills.soft.map(cleanSpecialCharacters),
    },
    // Process certifications - handle null/undefined dates
    certifications: cv.certifications?.map((cert) => {
      let certDate = cert.date;

      // null, empty, or "Present" are not valid certification dates
      if (!certDate || certDate === "null" || certDate.toLowerCase() === "present") {
        certDate = undefined as any;
      } else {
        certDate = normalizeDateFormat(certDate);
      }

      return {
        ...cert,
        name: cleanSpecialCharacters(expandAbbreviations(cert.name)),
        issuer: cert.issuer ? cleanSpecialCharacters(cert.issuer) : undefined,
        date: certDate,
      };
    }),
    // Process languages
    languages: cv.languages?.map((lang) => ({
      ...lang,
      language: cleanSpecialCharacters(lang.language),
      proficiency: cleanSpecialCharacters(lang.proficiency),
    })),
  };
}
