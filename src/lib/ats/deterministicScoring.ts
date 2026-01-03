/**
 * Deterministic ATS Parsing Score System
 *
 * This module checks if a CV can be correctly PARSED by ATS systems.
 * It does NOT check keyword matching with job descriptions (that's in ats-optimizer).
 *
 * Focus: Can the ATS read and extract information correctly?
 *
 * Total: 100 points
 * - Format & Parsing: 35 points (most critical for ATS reading)
 * - Structure & Sections: 35 points (standard sections ATS expects)
 * - Content Quality: 20 points (abbreviations, dates - parsing related)
 * - Readability: 10 points (helps both ATS and recruiters)
 */

import { ATSCheckResult, ATSCategoryScore, ATSIssue, ATSSeverity } from "@/types/atsCheck";
import { ABBREVIATION_EXPANSIONS } from "./utils";

// ============================================================================
// SCORING CRITERIA DEFINITIONS
// ============================================================================

interface ScoringCriterion {
  id: string;
  name: string;
  points: number;
  check: (cv: ParsedCV) => boolean;
  passMessage: string;
  failMessage: string;
  suggestion: string;
  severity: ATSSeverity;
}

interface ParsedCV {
  text: string;
  wordCount: number;
  lines: string[];

  // Contact
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  hasLocation: boolean;
  hasPortfolio: boolean;

  // Sections
  hasProfessionalSummary: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  hasCertifications: boolean;
  hasLanguages: boolean;

  // Format
  hasSingleColumnLayout: boolean;
  hasStandardBullets: boolean;
  hasSpecialCharacters: boolean;
  hasCreativeDividers: boolean;
  hasConsistentSpacing: boolean;
  hasEmojis: boolean;
  hasPipeCharacters: boolean;

  // Content
  hardSkillsCount: number;
  softSkillsCount: number;
  actionVerbsCount: number;
  metricsCount: number;
  abbreviationsExpanded: boolean;
  unexpandedAbbreviations: string[];
  expandedAbbreviations: string[];
  hasConsistentDateFormat: boolean;
  bulletsTooLong: number;

  // Readability
  averageBulletLength: number;
  hasWhiteSpace: boolean;
}

// ============================================================================
// FORMAT & PARSING CRITERIA (35 points)
// These directly affect whether ATS can read and extract data from CV
// ============================================================================

const FORMAT_CRITERIA: ScoringCriterion[] = [
  {
    id: "single_column",
    name: "Single-column layout",
    points: 10,
    check: (cv) => cv.hasSingleColumnLayout,
    passMessage: "Single-column layout - ATS can parse linearly",
    failMessage: "Multi-column or table layout detected",
    suggestion: "Use single-column layout. Multi-column layouts cause ATS to read text in wrong order.",
    severity: "critical",
  },
  {
    id: "no_pipes",
    name: "No column indicators",
    points: 8,
    check: (cv) => !cv.hasPipeCharacters,
    passMessage: "No column-indicating characters",
    failMessage: "Pipe characters (|) detected - indicates columns",
    suggestion: "Replace | separators with commas or line breaks. Pipes confuse ATS parsers.",
    severity: "critical",
  },
  {
    id: "contact_in_body",
    name: "Contact in main body",
    points: 7,
    check: (cv) => cv.hasEmail && cv.hasPhone,
    passMessage: "Contact info in parseable area",
    failMessage: "Contact info may be in header/footer (not parsed by many ATS)",
    suggestion: "Place contact info in main document body, not in header/footer areas.",
    severity: "critical",
  },
  {
    id: "standard_bullets",
    name: "Standard bullet characters",
    points: 4,
    check: (cv) => cv.hasStandardBullets,
    passMessage: "Standard bullet points used",
    failMessage: "Non-standard bullet characters detected",
    suggestion: "Use standard bullets (-, *, •). Fancy bullets may not parse correctly.",
    severity: "major",
  },
  {
    id: "no_special_chars",
    name: "Clean character encoding",
    points: 3,
    check: (cv) => !cv.hasSpecialCharacters && !cv.hasEmojis,
    passMessage: "Standard character set",
    failMessage: "Special characters or emojis detected",
    suggestion: "Remove emojis and special symbols. ATS may not recognize these characters.",
    severity: "major",
  },
  {
    id: "no_creative_dividers",
    name: "Simple section dividers",
    points: 3,
    check: (cv) => !cv.hasCreativeDividers,
    passMessage: "Clean section structure",
    failMessage: "Decorative dividers detected",
    suggestion: "Use simple line breaks. Decorative dividers (═══, ★★★) break parsing.",
    severity: "minor",
  },
];

// ============================================================================
// STRUCTURE & SECTIONS CRITERIA (35 points)
// ATS systems like Workday expect standard section headers
// ============================================================================

const STRUCTURE_CRITERIA: ScoringCriterion[] = [
  {
    id: "has_experience",
    name: "Experience section",
    points: 10,
    check: (cv) => cv.hasExperience,
    passMessage: "Work Experience section found",
    failMessage: "No experience section with standard header",
    suggestion: "Add section titled 'Experience', 'Work Experience', or 'Professional Experience'. ATS looks for these exact headers.",
    severity: "critical",
  },
  {
    id: "has_education",
    name: "Education section",
    points: 8,
    check: (cv) => cv.hasEducation,
    passMessage: "Education section found",
    failMessage: "No education section with standard header",
    suggestion: "Add section titled 'Education'. ATS extracts degree info from this section.",
    severity: "critical",
  },
  {
    id: "has_skills",
    name: "Skills section",
    points: 8,
    check: (cv) => cv.hasSkills,
    passMessage: "Skills section found",
    failMessage: "No skills section with standard header",
    suggestion: "Add section titled 'Skills' or 'Technical Skills'. ATS extracts skills from this section.",
    severity: "critical",
  },
  {
    id: "has_email",
    name: "Email present",
    points: 3,
    check: (cv) => cv.hasEmail,
    passMessage: "Email address found",
    failMessage: "No email address detected",
    suggestion: "Add email address. ATS needs this to create candidate profile.",
    severity: "major",
  },
  {
    id: "has_phone",
    name: "Phone present",
    points: 3,
    check: (cv) => cv.hasPhone,
    passMessage: "Phone number found",
    failMessage: "No phone number detected",
    suggestion: "Add phone number in standard format.",
    severity: "major",
  },
  {
    id: "has_linkedin",
    name: "LinkedIn URL",
    points: 2,
    check: (cv) => cv.hasLinkedIn,
    passMessage: "LinkedIn profile found",
    failMessage: "No LinkedIn URL found",
    suggestion: "Add LinkedIn URL. Many ATS systems use this for candidate enrichment.",
    severity: "minor",
  },
  {
    id: "has_summary",
    name: "Summary section",
    points: 1,
    check: (cv) => cv.hasProfessionalSummary,
    passMessage: "Summary/Profile section present",
    failMessage: "No summary section",
    suggestion: "Consider adding a 'Summary' or 'Profile' section at the top.",
    severity: "minor",
  },
];

// ============================================================================
// CONTENT PARSING CRITERIA (20 points)
// These affect how accurately ATS extracts information
// ============================================================================

const KEYWORDS_CRITERIA: ScoringCriterion[] = [
  {
    id: "quantified_achievements",
    name: "Quantified achievements",
    points: 10,
    check: (cv) => cv.metricsCount >= 3,
    passMessage: "Good use of metrics and numbers",
    failMessage: "Few quantified achievements found",
    suggestion: "Add numbers to your achievements: percentages, dollar amounts, team sizes, timeframes. E.g., 'Increased sales by 25%' or 'Managed team of 8'.",
    severity: "major",
  },
  {
    id: "consistent_dates",
    name: "Consistent date format",
    points: 6,
    check: (cv) => cv.hasConsistentDateFormat,
    passMessage: "Date formats are consistent",
    failMessage: "Mixed date formats detected",
    suggestion: "Use consistent format like 'January 2020' throughout. Mixed formats confuse date extraction.",
    severity: "major",
  },
  {
    id: "has_skills_listed",
    name: "Extractable skills",
    points: 4,
    check: (cv) => cv.hardSkillsCount >= 5,
    passMessage: "Skills are extractable by ATS",
    failMessage: "Few recognizable skills found",
    suggestion: "List skills as separate items, not embedded in sentences. ATS extracts skills better this way.",
    severity: "major",
  },
];

// ============================================================================
// READABILITY CRITERIA (10 points)
// Helps both ATS parsing and recruiter scanning
// ============================================================================

const READABILITY_CRITERIA: ScoringCriterion[] = [
  {
    id: "word_count",
    name: "Reasonable length",
    points: 4,
    check: (cv) => cv.wordCount >= 200 && cv.wordCount <= 1200,
    passMessage: "CV length is reasonable",
    failMessage: "CV too short or too long",
    suggestion: "Keep CV between 300-800 words. Very long CVs may hit ATS character limits.",
    severity: "major",
  },
  {
    id: "white_space",
    name: "Clear section breaks",
    points: 3,
    check: (cv) => cv.hasWhiteSpace,
    passMessage: "Clear spacing between sections",
    failMessage: "Sections run together",
    suggestion: "Add blank lines between sections. Helps ATS identify section boundaries.",
    severity: "minor",
  },
  {
    id: "bullet_structure",
    name: "Bullet point structure",
    points: 3,
    check: (cv) => cv.hasStandardBullets && cv.bulletsTooLong < 3,
    passMessage: "Good bullet point structure",
    failMessage: "Bullet points too long or missing",
    suggestion: "Use concise bullet points. Very long bullets may be truncated by some ATS.",
    severity: "minor",
  },
];

// ============================================================================
// CV PARSING FUNCTIONS
// ============================================================================

export function parseCV(text: string): ParsedCV {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  // Contact detection
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
  const linkedinRegex = /linkedin\.com\/in\/[\w-]+/i;
  const locationRegex = /\b(Turkey|USA|UK|Germany|France|Spain|Italy|Canada|Australia|India|China|Japan|Brazil|Mexico|Netherlands|Belgium|Switzerland|Austria|Sweden|Norway|Denmark|Finland|Poland|Czech|Portugal|Greece|Ireland|Singapore|Hong Kong|Dubai|UAE|Saudi Arabia|Israel|South Africa|New Zealand|Argentina|Chile|Colombia|Peru|Egypt|Morocco|Nigeria|Kenya|Philippines|Indonesia|Malaysia|Thailand|Vietnam|Korea|Taiwan)\b/i;

  const hasEmail = emailRegex.test(text);
  const hasPhone = phoneRegex.test(text);
  const hasLinkedIn = linkedinRegex.test(text);
  const hasLocation = locationRegex.test(text) || /\b[A-Z][a-z]+,\s*[A-Z][a-z]+\b/.test(text);
  const hasPortfolio = /portfolio|github\.com|gitlab\.com|behance|dribbble/i.test(text);

  // Section detection
  const hasProfessionalSummary = /professional\s*summary|summary|profile|about\s*me|objective/i.test(text);
  const hasExperience = /experience|employment|work\s*history|professional\s*experience/i.test(text);
  const hasEducation = /education|academic|degree|university|college/i.test(text);
  const hasSkills = /skills|technical\s*skills|core\s*competencies|expertise/i.test(text);
  const hasCertifications = /certifications?|certificates?|credentials?/i.test(text);
  const hasLanguages = /languages?/i.test(text);

  // Format detection
  const hasPipeCharacters = text.includes('|');
  const hasCreativeDividers = /[═━─▬★●◆■▪►▸⚡🔥✨]/u.test(text);
  const hasEmojis = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(text);
  // Only flag truly problematic bullet characters - not standard ones like •
  const hasSpecialCharacters = /[·●○◦‣⁃▪▫]/u.test(text) || hasEmojis;
  // More flexible bullet detection - PDF extraction might not preserve exact spacing
  // Standard bullets are: - * •
  const hasStandardBullets = /^[\s]*[-*•]\s*/m.test(text) || /\n\s*[-*•]\s*/m.test(text) ||
                            /[-*•]\s+\w/m.test(text) || text.includes('- ') || text.includes('• ');
  const hasSingleColumnLayout = !hasPipeCharacters && !/\t{2,}|\s{4,}\S+\s{4,}/m.test(text);
  const hasConsistentSpacing = !/\n{4,}/.test(text) && !/\n\s*\n\s*\n\s*\n/.test(text);
  // White space detection - check for blank lines OR structured sections
  // PDF extraction might not preserve blank lines, so also check for section structure
  const hasBlankLines = /\n\s*\n/.test(text);
  const hasSectionStructure = (
    /professional\s*(summary|experience)/i.test(text) &&
    /education/i.test(text) &&
    /skills/i.test(text)
  );
  const hasWhiteSpace = hasBlankLines || hasSectionStructure;

  // Content analysis
  const hardSkills = countHardSkills(text);
  const softSkills = countSoftSkills(text);
  const actionVerbs = countActionVerbs(text);
  const metrics = countMetrics(text);
  const { expanded, unexpanded } = checkAbbreviations(text);
  const hasConsistentDateFormat = checkDateFormat(text);
  const bulletsTooLong = countLongBullets(lines);

  return {
    text,
    wordCount,
    lines,
    hasEmail,
    hasPhone,
    hasLinkedIn,
    hasLocation,
    hasPortfolio,
    hasProfessionalSummary,
    hasExperience,
    hasEducation,
    hasSkills,
    hasCertifications,
    hasLanguages,
    hasSingleColumnLayout,
    hasStandardBullets,
    hasSpecialCharacters,
    hasCreativeDividers,
    hasConsistentSpacing,
    hasEmojis,
    hasPipeCharacters,
    hardSkillsCount: hardSkills,
    softSkillsCount: softSkills,
    actionVerbsCount: actionVerbs,
    metricsCount: metrics,
    abbreviationsExpanded: unexpanded.length === 0,
    unexpandedAbbreviations: unexpanded,
    expandedAbbreviations: expanded,
    hasConsistentDateFormat,
    bulletsTooLong,
    averageBulletLength: calculateAverageBulletLength(lines),
    hasWhiteSpace,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const HARD_SKILLS = [
  // Programming Languages
  "javascript", "typescript", "python", "java", "c++", "c#", "go", "golang", "rust", "ruby", "php", "swift", "kotlin",
  "scala", "perl", "matlab", "r language", "objective-c", "dart", "lua", "haskell", "elixir",
  // Frontend
  "react", "reactjs", "react.js", "angular", "angularjs", "vue", "vuejs", "vue.js", "svelte", "next.js", "nextjs",
  "html", "css", "sass", "scss", "less", "tailwind", "bootstrap", "material ui", "chakra",
  // Backend
  "node.js", "nodejs", "express", "expressjs", "django", "flask", "fastapi", "spring", "spring boot",
  "laravel", "rails", "ruby on rails", "asp.net", ".net", "dotnet", "nest.js", "nestjs",
  // Databases
  "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch", "graphql",
  "oracle", "sqlite", "mariadb", "cassandra", "dynamodb", "firebase", "supabase", "prisma",
  // Data Science & ML
  "pandas", "numpy", "tensorflow", "pytorch", "scikit-learn", "keras", "machine learning",
  "deep learning", "data analysis", "data science", "data engineering", "spark", "hadoop",
  "natural language processing", "nlp", "computer vision", "artificial intelligence",
  // Cloud & DevOps
  "aws", "amazon web services", "azure", "microsoft azure", "gcp", "google cloud",
  "docker", "kubernetes", "k8s", "terraform", "jenkins", "ci/cd", "continuous integration",
  "continuous deployment", "github actions", "gitlab ci", "circleci", "ansible", "puppet",
  "cloudformation", "lambda", "ec2", "s3", "serverless",
  // Tools & Platforms
  "git", "github", "gitlab", "bitbucket", "jira", "confluence", "trello", "asana", "notion",
  "figma", "sketch", "adobe xd", "photoshop", "illustrator", "invision",
  "excel", "powerpoint", "google sheets", "tableau", "power bi", "looker", "metabase",
  "salesforce", "hubspot", "zendesk", "intercom", "mailchimp", "segment",
  // APIs & Architecture
  "api", "rest", "restful", "graphql", "microservices", "websocket", "grpc", "soap",
  "oauth", "jwt", "api design", "api development", "system design",
  // Testing & QA
  "jest", "mocha", "cypress", "selenium", "playwright", "testing", "unit testing",
  "integration testing", "test automation", "qa", "quality assurance",
  // Mobile
  "ios", "android", "react native", "flutter", "xamarin", "mobile development",
  // Marketing & Analytics
  "seo", "search engine optimization", "sem", "ppc", "google analytics", "ga4",
  "facebook ads", "google ads", "meta ads", "linkedin ads", "content marketing",
  "email marketing", "marketing automation", "a/b testing", "conversion optimization",
  // Business Tools
  "crm", "erp", "sap", "quickbooks", "xero", "stripe", "paypal",
  // Methodologies
  "agile", "scrum", "kanban", "lean", "devops", "sdlc", "waterfall",
  // Security
  "cybersecurity", "security", "penetration testing", "encryption", "ssl", "oauth",
  // Other Technical
  "linux", "unix", "windows server", "bash", "shell scripting", "powershell",
  "networking", "tcp/ip", "dns", "load balancing", "nginx", "apache",
];

const SOFT_SKILLS = [
  "leadership", "communication", "teamwork", "problem solving", "problem-solving",
  "critical thinking", "creativity", "adaptability", "time management",
  "attention to detail", "collaboration", "interpersonal", "presentation",
  "negotiation", "conflict resolution", "decision making", "emotional intelligence",
  "flexibility", "self-motivated", "proactive", "innovative",
];

const ACTION_VERBS = [
  "achieved", "accelerated", "accomplished", "administered", "advanced",
  "analyzed", "architected", "built", "championed", "collaborated",
  "conducted", "coordinated", "created", "delivered", "designed",
  "developed", "directed", "drove", "enabled", "enhanced",
  "established", "executed", "expanded", "generated", "grew",
  "guided", "implemented", "improved", "increased", "influenced",
  "initiated", "innovated", "introduced", "launched", "led",
  "managed", "maximized", "mentored", "modernized", "negotiated",
  "optimized", "orchestrated", "organized", "oversaw", "pioneered",
  "planned", "produced", "reduced", "resolved", "revamped",
  "scaled", "spearheaded", "streamlined", "strengthened", "supervised",
  "transformed", "unified",
];

function countHardSkills(text: string): number {
  const lowerText = text.toLowerCase();
  return HARD_SKILLS.filter(skill => lowerText.includes(skill)).length;
}

function countSoftSkills(text: string): number {
  const lowerText = text.toLowerCase();
  return SOFT_SKILLS.filter(skill => lowerText.includes(skill)).length;
}

function countActionVerbs(text: string): number {
  const lowerText = text.toLowerCase();
  return ACTION_VERBS.filter(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    return regex.test(lowerText);
  }).length;
}

function countMetrics(text: string): number {
  const patterns = [
    /\d+%/g,
    /\$[\d,]+/g,
    /\d+\+/g,
    /\d+x/gi,
    /\d{1,3}(?:,\d{3})+/g,
  ];

  let count = 0;
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) count += matches.length;
  }
  return Math.min(count, 20);
}

function checkAbbreviations(text: string): { expanded: string[]; unexpanded: string[] } {
  const expanded: string[] = [];
  const unexpanded: string[] = [];

  // IMPORTANT: Greenhouse and Taleo do NOT recognize abbreviations - even common ones!
  // Source: https://thetechresume.com/samples/ats-myths-busted.html
  // "Greenhouse does not recognize abbreviations, even common ones"
  // "Taleo also does not recognize abbreviations, even common ones"
  //
  // Therefore, we should check ALL abbreviations for expansion.
  // Only skip very basic ones that are part of proper nouns or product names.
  const skipList = new Set([
    'iOS', 'macOS', 'PhD',  // Product names / titles that are always written this way
  ]);

  // Common abbreviations to check - sort by length descending to check compound ones first
  const commonAbbreviations = Object.keys(ABBREVIATION_EXPANSIONS)
    .sort((a, b) => b.length - a.length);

  // Track which component abbreviations are covered by compound ones
  const coveredByCompound = new Set<string>();

  // Pre-check: Find all abbreviations that appear in parentheses (already expanded)
  const alreadyExpandedInParens = new Set<string>();
  for (const abbr of commonAbbreviations) {
    const escapedAbbr = abbr.replace(/[/\\]/g, '[/\\\\]');
    const parenPattern = new RegExp(`\\(\\s*${escapedAbbr}\\s*\\)`, 'gi');
    if (parenPattern.test(text)) {
      alreadyExpandedInParens.add(abbr);
    }
  }


  for (const abbr of commonAbbreviations) {
    // Skip if this abbreviation is covered by a compound one (e.g., CI covered by CI/CD)
    if (coveredByCompound.has(abbr)) {
      continue;
    }

    // Skip product names that should never be expanded
    if (skipList.has(abbr)) {
      continue;
    }

    // Use word boundary regex, but handle special chars like /
    const escapedAbbr = abbr.replace(/[/\\]/g, '[/\\\\]');
    const abbrRegex = new RegExp(`\\b${escapedAbbr}\\b`, 'gi');
    if (abbrRegex.test(text)) {
      // FAST PATH: If abbreviation appears in parentheses anywhere, it's expanded
      if (alreadyExpandedInParens.has(abbr)) {
        expanded.push(abbr);
        if (abbr.includes('/')) {
          abbr.split('/').forEach(part => coveredByCompound.add(part));
        }
        continue;
      }

      // Check if expanded form exists nearby
      const expansion = ABBREVIATION_EXPANSIONS[abbr];
      const isExpanded = checkIfExpanded(text, abbr, expansion);

      if (isExpanded) {
        expanded.push(abbr);
        // If this is a compound abbreviation (contains /), mark components as covered
        if (abbr.includes('/')) {
          abbr.split('/').forEach(part => coveredByCompound.add(part));
        }
      } else {
        unexpanded.push(abbr);
      }
    }
  }

  return { expanded, unexpanded };
}

// Helper function to check if an abbreviation is properly expanded
function checkIfExpanded(text: string, abbr: string, expansion: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerAbbr = abbr.toLowerCase();
  const escapedAbbr = abbr.replace(/[/\\]/g, '[/\\\\]');

  // Method 1: Full expansion exists in text (e.g., "Amazon Web Services (AWS)")
  if (text.includes(expansion) || lowerText.includes(expansion.toLowerCase())) {
    return true;
  }

  // Method 2: Check if abbreviation appears in parentheses ANYWHERE in text
  // Flexible pattern: (AWS) or ( AWS ) or (AWS ) etc.
  const parenPatternFlexible = new RegExp(`\\(\\s*${escapedAbbr}\\s*\\)`, 'gi');
  if (parenPatternFlexible.test(text)) {
    return true;
  }

  // Method 3: Pattern like "AWS (Amazon Web Services)" - abbreviation followed by explanation
  const expandedPattern1 = new RegExp(`${escapedAbbr}\\s*\\([^)]+\\)`, 'i');
  if (expandedPattern1.test(text)) {
    return true;
  }

  // Method 4: For compound abbreviations like CI/CD
  if (abbr.includes('/')) {
    const compoundPattern = new RegExp(`\\(\\s*${escapedAbbr}\\s*\\)`, 'i');
    if (compoundPattern.test(text)) {
      return true;
    }
  }

  // Method 5: Check if expansion WITHOUT parentheses exists
  // e.g., "Amazon Web Services" without "(AWS)" - still counts as expanded
  const baseExpansion = expansion.replace(/\s*\([^)]+\)\s*$/, '').trim();
  if (baseExpansion.length > 4 && lowerText.includes(baseExpansion.toLowerCase())) {
    return true;
  }

  // Method 6: Check for common expansion patterns with flexible spacing
  // "Amazon Web Services(AWS)" or "Amazon Web Services ( AWS )"
  const baseExpansionWords = baseExpansion.split(/\s+/);
  if (baseExpansionWords.length >= 2) {
    // Create flexible pattern: word1.*word2.*word3.*(abbr)
    const flexPattern = baseExpansionWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+');
    const fullFlexPattern = new RegExp(`${flexPattern}\\s*\\(?\\s*${escapedAbbr}\\s*\\)?`, 'i');
    if (fullFlexPattern.test(text)) {
      return true;
    }
  }

  return false;
}

function checkDateFormat(text: string): boolean {
  // Look for date patterns
  const monthYearPattern = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/gi;
  const mmyyyyPattern = /\d{1,2}\/\d{4}/g;
  const yyyymmPattern = /\d{4}[-\/]\d{1,2}/g;
  const abbrevMonthPattern = /(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+\d{4}/gi;

  const monthYearMatches = text.match(monthYearPattern) || [];
  const mmyyyyMatches = text.match(mmyyyyPattern) || [];
  const yyyymmMatches = text.match(yyyymmPattern) || [];
  const abbrevMatches = text.match(abbrevMonthPattern) || [];

  const totalDates = monthYearMatches.length + mmyyyyMatches.length + yyyymmMatches.length + abbrevMatches.length;

  // If mostly Month YYYY format, it's consistent
  if (totalDates === 0) return true;
  return monthYearMatches.length >= totalDates * 0.7;
}

function countLongBullets(lines: string[]): number {
  let count = 0;
  for (const line of lines) {
    if (/^[-*•]\s/.test(line) && line.length > 130) {
      count++;
    }
  }
  return count;
}

function calculateAverageBulletLength(lines: string[]): number {
  const bullets = lines.filter(line => /^[-*•]\s/.test(line));
  if (bullets.length === 0) return 0;
  const totalLength = bullets.reduce((sum, b) => sum + b.length, 0);
  return Math.round(totalLength / bullets.length);
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

export interface DeterministicATSResult {
  overallScore: number;
  categories: {
    format: CategoryResult;
    structure: CategoryResult;
    keywords: CategoryResult;
    readability: CategoryResult;
  };
  metadata: {
    wordCount: number;
    estimatedPages: number;
    hasContactInfo: {
      email: boolean;
      phone: boolean;
      linkedin: boolean;
      location: boolean;
    };
    keywordStats: {
      hardSkillsCount: number;
      softSkillsCount: number;
      actionVerbsCount: number;
      quantifiedAchievements: number;
    };
  };
  abbreviationCheck: {
    expandedCorrectly: string[];
    needsExpansion: string[];
  };
  topIssues: ATSIssue[];
  quickWins: string[];
  summary: string;
}

interface CategoryResult {
  name: string;
  maxPoints: number;
  earnedPoints: number;
  percentage: number;
  issues: ATSIssue[];
  passes: string[];
}

export function calculateDeterministicScore(cvText: string): DeterministicATSResult {
  const cv = parseCV(cvText);

  // Calculate each category
  const format = calculateCategoryScore("Format & Parsing", FORMAT_CRITERIA, cv, 35);
  const structure = calculateCategoryScore("Structure & Sections", STRUCTURE_CRITERIA, cv, 35);
  const keywords = calculateCategoryScore("Content Parsing", KEYWORDS_CRITERIA, cv, 20);
  const readability = calculateCategoryScore("Readability", READABILITY_CRITERIA, cv, 10);

  const overallScore = format.earnedPoints + structure.earnedPoints + keywords.earnedPoints + readability.earnedPoints;

  // Collect all issues and sort by severity
  const allIssues = [
    ...format.issues,
    ...structure.issues,
    ...keywords.issues,
    ...readability.issues,
  ].sort((a, b) => {
    const severityOrder = { critical: 0, major: 1, minor: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  // Generate quick wins (top 5 highest impact fixes)
  const quickWins = allIssues
    .filter(issue => issue.severity === "critical" || issue.severity === "major")
    .slice(0, 5)
    .map(issue => issue.recommendation);

  // Generate summary
  const summary = generateSummary(overallScore, cv, allIssues);

  return {
    overallScore,
    categories: {
      format,
      structure,
      keywords,
      readability,
    },
    metadata: {
      wordCount: cv.wordCount,
      estimatedPages: cv.wordCount <= 500 ? 1 : 2,
      hasContactInfo: {
        email: cv.hasEmail,
        phone: cv.hasPhone,
        linkedin: cv.hasLinkedIn,
        location: cv.hasLocation,
      },
      keywordStats: {
        hardSkillsCount: cv.hardSkillsCount,
        softSkillsCount: cv.softSkillsCount,
        actionVerbsCount: cv.actionVerbsCount,
        quantifiedAchievements: cv.metricsCount,
      },
    },
    abbreviationCheck: {
      expandedCorrectly: cv.expandedAbbreviations,
      needsExpansion: cv.unexpandedAbbreviations,
    },
    topIssues: allIssues.slice(0, 5),
    quickWins,
    summary,
  };
}

function calculateCategoryScore(
  name: string,
  criteria: ScoringCriterion[],
  cv: ParsedCV,
  maxPoints: number
): CategoryResult {
  let earnedPoints = 0;
  const issues: ATSIssue[] = [];
  const passes: string[] = [];

  for (const criterion of criteria) {
    const passed = criterion.check(cv);

    if (passed) {
      earnedPoints += criterion.points;
      passes.push(criterion.passMessage);
    } else {
      issues.push({
        id: criterion.id,
        category: name.toLowerCase().split(' ')[0] as "format" | "structure" | "keywords" | "readability",
        severity: criterion.severity,
        issue: criterion.failMessage,
        recommendation: criterion.suggestion,
        impact: criterion.points,
      });
    }
  }

  // Ensure we don't exceed max points
  earnedPoints = Math.min(earnedPoints, maxPoints);

  return {
    name,
    maxPoints,
    earnedPoints,
    percentage: Math.round((earnedPoints / maxPoints) * 100),
    issues,
    passes,
  };
}

function generateSummary(score: number, cv: ParsedCV, issues: ATSIssue[]): string {
  const criticalCount = issues.filter(i => i.severity === "critical").length;

  let summary = "";

  if (score >= 85) {
    summary = "Your CV should parse correctly in most ATS systems. Standard format and sections detected. ";
  } else if (score >= 70) {
    summary = "Good parsing compatibility. Minor formatting adjustments could improve data extraction. ";
  } else if (score >= 50) {
    summary = "Some parsing issues detected. ATS may not extract all information correctly. ";
  } else {
    summary = "Significant parsing issues found. ATS systems may struggle to read this CV correctly. ";
  }

  // Add specific insights
  if (criticalCount > 0) {
    summary += `${criticalCount} critical parsing issue${criticalCount > 1 ? 's' : ''} found. `;
  }

  if (!cv.abbreviationsExpanded && cv.unexpandedAbbreviations.length > 0) {
    summary += `Abbreviations (${cv.unexpandedAbbreviations.slice(0, 2).join(', ')}) need expansion for keyword matching. `;
  }

  if (!cv.hasSingleColumnLayout) {
    summary += "Multi-column layout may cause text to be read in wrong order. ";
  }

  return summary.trim();
}

// ============================================================================
// PARSING COMPATIBILITY CHECK
// Note: Real ATS systems don't "score" resumes - they parse them.
// This shows which parsing features are compatible.
// ============================================================================

export interface ParsingCompatibility {
  singleColumn: { ok: boolean; note: string };
  standardSections: { ok: boolean; note: string };
  cleanCharacters: { ok: boolean; note: string };
  abbreviations: { ok: boolean; note: string };
}

export function calculateParsingCompatibility(cv: ParsedCV): ParsingCompatibility {
  return {
    singleColumn: {
      ok: cv.hasSingleColumnLayout && !cv.hasPipeCharacters,
      note: cv.hasSingleColumnLayout
        ? "Linear text flow - ATS can read in correct order"
        : "Multi-column detected - text may be read in wrong order",
    },
    standardSections: {
      ok: cv.hasExperience && cv.hasEducation && cv.hasSkills,
      note: (cv.hasExperience && cv.hasEducation && cv.hasSkills)
        ? "Standard section headers found"
        : "Missing standard sections (Experience, Education, or Skills)",
    },
    cleanCharacters: {
      ok: !cv.hasSpecialCharacters && !cv.hasEmojis && !cv.hasCreativeDividers,
      note: (!cv.hasSpecialCharacters && !cv.hasEmojis)
        ? "Clean character encoding"
        : "Special characters detected that may not parse",
    },
    abbreviations: {
      ok: cv.metricsCount >= 3,
      note: cv.metricsCount >= 3
        ? "Good use of quantified achievements"
        : "Add more numbers and metrics to your achievements",
    },
  };
}
