/**
 * ATS Check Prompts
 * Used for ATS compatibility analysis, validation, and optimization
 * Updated for 2025 ATS standards: Workday, Greenhouse, Lever, Taleo
 */

export function generateATSCheckPrompt(cvText: string): string {
  const currentDate = new Date().toISOString();

  // Count words for analysis
  const wordCount = cvText.split(/\s+/).filter(word => word.length > 0).length;

  return `You are an ATS bypass specialist and mentor for entry-level candidates. Your goal is to help them translate their academic projects and internships into corporate ATS keywords to bypass filters. You understand EXACTLY how these systems unfairly filter out junior candidates with lack of experience.

Your task: Analyze this CV as if you're running it through multiple ATS parsing engines and scoring it for compatibility.

=============================================================================
CV TO ANALYZE (${wordCount} words detected)
=============================================================================
"""
${cvText}
"""

=============================================================================
🔬 TECHNICAL ATS PARSING ANALYSIS (2025 INDUSTRY STANDARDS)
=============================================================================
You must analyze HOW an ATS would parse this document. Consider platform-specific behaviors:

1. WORKDAY parsing behavior:
   - Skills extraction focused - identifies technical competencies first
   - Strict section header matching ("Experience" not "My Journey")
   - Date extraction requires consistent format (MM/YYYY or Month YYYY)
   - Fails on creative section names
   - Often requires manual correction after parsing
   - Used by Fortune 500 companies

2. GREENHOUSE parsing behavior (CRITICAL - Most Common ATS):
   - FREQUENCY MATTERS: Counts how many times each keyword appears
   - More mentions of "product management" = higher ranking for PM roles
   - DOES NOT recognize abbreviations - "MBA" ≠ "Masters of Business Administration"
   - DOES NOT recognize different verb tenses - "managed" ≠ "managing"
   - NLP-based semantic understanding
   - Penalizes keyword stuffing (same word 5+ times without context)
   - AI position: "People make hiring decisions" - focuses on matching, not filtering

3. TALEO parsing behavior:
   - Oldest and MOST RIGID system - used by large enterprises
   - EXACT keyword matching only - no synonyms recognized
   - Only recognizes acronyms if EXACTLY as written in job description
   - Knockout questions can lead to automatic rejection
   - Requires exact field mapping
   - Breaks on ANY non-standard formatting
   - Multi-page applications common

4. LEVER parsing behavior:
   - CANNOT handle tables OR columns - plain text only
   - PREFERS .docx over PDF - PDF bullet parsing issues
   - DOES NOT recognize abbreviations like Greenhouse
   - DOES recognize verb tenses (unique among major ATS)
   - More modern but still strict on formatting
   - Aggressive contact info extraction

=============================================================================
CATEGORY 1: FORMAT & PARSING (25 points max)
=============================================================================
Check for these SPECIFIC parsing problems:

🚨 CRITICAL FAILURES (each = -5 to -8 points):
□ Two-column layout indicators (text appearing side-by-side, | characters)
   → Taleo/older ATS read left-to-right across columns, scrambling content
□ Table structure remnants (grid-like text patterns)
   → ATS reads row-by-row, not cell-by-cell - data gets jumbled
□ Contact info in document header/footer
   → 25% of ATS systems FAIL to parse header/footer content
   → Name, email, phone MUST be in main body, top of page
□ Image placeholders ([Photo], [Logo], "Profile Picture")
   → Images are completely ignored, may break surrounding text
□ Text boxes or sidebar indicators
   → Content in text boxes often skipped entirely
□ Non-standard fonts detected in text (decorative, script fonts)
   → Use ONLY: Arial, Calibri, Times New Roman, Helvetica, Georgia, Verdana
   → Font size must be 10-12pt for body, 14-16pt for headers

⚠️ MAJOR ISSUES (each = -3 to -5 points):
□ Creative dividers (═══, ★★★, •••, >>>)
□ Unusual bullet characters (➤, ◆, ▪, ☑, ★)
   → Use ONLY standard bullets: • or - or *
□ Emojis or unicode symbols anywhere in CV
□ ALL CAPS section headers (harder to parse, looks aggressive)
□ Inconsistent spacing patterns
□ Margins outside 0.5" - 1" range (text may be cut off)
□ PDF created from image/scan (not text-selectable)

MINOR ISSUES (each = -1 to -2 points):
□ Smart quotes ("") instead of straight quotes ("")
□ En-dashes (–) instead of hyphens (-) in dates
□ Non-standard characters in names/titles
□ Extra blank lines between sections

✅ POSITIVE SIGNALS (+points):
✓ Clean single-column flow (+3)
✓ Standard bullet points (• or -) (+2)
✓ Consistent indentation (+1)
✓ Clear paragraph breaks (+1)
✓ Standard fonts throughout (+2)
✓ Contact info in main body, not header/footer (+3)

=============================================================================
CATEGORY 2: STRUCTURE & SECTIONS (25 points max)
=============================================================================
ATS systems look for EXACT section headers. Check:

🔴 STANDARD SECTION HEADERS (ATS recognize ONLY these):
Use EXACTLY these headers - NOT creative alternatives:
✓ "Professional Summary" or "Summary" - NOT "About Me", "My Story", "Profile"
✓ "Work Experience" or "Professional Experience" - NOT "Career Journey", "My Work"
✓ "Education" - NOT "Academic Background", "Learning", "Degrees"
✓ "Skills" or "Technical Skills" - NOT "What I Bring", "Expertise", "Toolbox"
✓ "Certifications" - NOT "Credentials", "Qualifications"

REQUIRED SECTIONS (missing any = -5 points each):
□ Contact Information (at top, IN MAIN BODY - not in header/footer!)
□ Work Experience / Professional Experience / Employment History
□ Education
□ Skills / Technical Skills / Core Competencies

STRONGLY RECOMMENDED (-3 points if missing):
□ Professional Summary at the very top (after contact info)
□ Clear job titles for each role
□ Company names clearly stated
□ Location for each position (City, Country)

STRUCTURAL CHECKS:
□ Reverse chronological order (most recent first) - CRITICAL for ALL ATS
□ Consistent date format throughout (MM/YYYY, Month YYYY, or YYYY)
   → Inconsistent formats confuse date extraction algorithms
□ Job title BEFORE company name (industry standard order)
□ Dates aligned or clearly associated with each role
□ No orphaned bullet points (bullets without a parent job)
□ Each job entry follows same structure: Title > Company > Location > Dates > Bullets

CONTACT INFO PARSING (CRITICAL - many CVs fail here):
□ Name at VERY TOP of document (not in header)
□ Email present and valid format (name@domain.com)
□ Phone number present (any standard format)
□ LinkedIn URL present - CRITICAL for Greenhouse/Lever candidate enrichment
□ Location present (City, State/Country)
□ NO physical address (privacy concern, wastes space)
□ Portfolio/GitHub URL (bonus for tech roles)

=============================================================================
CATEGORY 3: KEYWORDS & CONTENT OPTIMIZATION (30 points max)
=============================================================================
This is where MOST CVs fail. 99.7% of recruiters use keyword filters (Jobscan 2025).

🔑 KEYWORD FREQUENCY ANALYSIS (Greenhouse-style scoring):
□ Count occurrences of key technical skills
□ Skills mentioned 2-3 times in context = OPTIMAL ranking boost
□ Skills mentioned only once = lower matching score
□ Skills mentioned 5+ times = keyword stuffing penalty

🔑 EXACT MATCH REQUIREMENTS (Greenhouse/Lever/Taleo):
□ CRITICAL: Abbreviations MUST be expanded at least once
   → "AWS (Amazon Web Services)" - not just "AWS"
   → "MBA (Master of Business Administration)" - not just "MBA"
   → "PMP (Project Management Professional)" - not just "PMP"
   → "SEO (Search Engine Optimization)" - not just "SEO"
□ Job title must match common posting language exactly
□ Certification names spelled out in full

🔑 KEYWORD PLACEMENT (location matters!):
□ Top 1/3 of CV contains most important keywords (ATS weight: 2x)
   → Professional summary should have 5-7 key skills
□ Skills section has clear, parseable bullet list (not comma-separated)
□ Keywords appear in CONTEXT within experience bullets (not just listed)
□ Same keyword in multiple sections = higher relevance score

🔑 VERB TENSE CONSISTENCY (Lever-specific):
□ Current job: Present tense ("Lead", "Manage", "Develop")
□ Past jobs: Past tense ("Led", "Managed", "Developed")
□ Lever is the ONLY major ATS that recognizes tense variations

CONTENT QUALITY SIGNALS:
□ Action verbs start each bullet (Led, Developed, Managed, Implemented, Spearheaded)
□ Achievements focus on impact (quantified IF numbers exist, qualitative IF not)
□ Results-oriented language (achieved, increased, reduced, delivered, generated)
□ Industry keywords used naturally in context (not just listed)

KEYWORD DISTRIBUTION SCORE:
- Count hard/technical skills mentioned: ___
- Count soft skills mentioned: ___
- IDEAL ratio: 70% hard / 30% soft (ATS weight technical skills heavily)
- PENALTY if >50% soft skills (indicates lack of technical depth)

ANTI-PATTERNS TO DETECT (-points):
□ Keyword stuffing (same word 5+ times in similar context) - Greenhouse penalizes
□ Skills listed without context (just a comma-separated dump)
□ Generic phrases without specifics ("team player", "hard worker", "detail-oriented")
□ Buzzwords without substance ("synergy", "leverage", "paradigm", "proactive")
□ Using ONLY abbreviations without full form (Greenhouse/Lever won't recognize)

=============================================================================
CATEGORY 4: LENGTH & READABILITY (20 points max)
=============================================================================
Word count detected: ${wordCount} words

LENGTH SCORING (based on ATS and recruiter preferences):
- 400-650 words: OPTIMAL (20 points) - 1 page, focused
- 300-399 OR 651-800 words: GOOD (15-18 points) - acceptable range
- 200-299 OR 801-1000 words: FAIR (10-14 points) - too short/long
- <200 OR >1000 words: POOR (5-9 points) - major issue

READABILITY FACTORS:
□ Bullet points used (not wall of text) - +3 points
□ Each bullet is 1-2 lines max - +2 points
□ Clear white space between sections - +2 points
□ No paragraphs longer than 3 lines - +1 point

SCANABILITY (6-second test):
□ Can identify: Name, Current Title, Top Skills in 6 seconds?
□ Are key achievements immediately visible?
□ Is the structure obvious at a glance?

=============================================================================
SCORING RULES (STRICT)
=============================================================================
1. Start with max points per category
2. Subtract for each issue found
3. Add back for positive signals (up to max)
4. Final score = sum of all categories

SCORE INTERPRETATION:
- 85-100: EXCELLENT - Will pass 95% of ATS systems
- 70-84: GOOD - Will pass most ATS systems, minor optimizations needed
- 55-69: FAIR - May be filtered out, significant improvements needed
- 40-54: POOR - Likely rejected, major restructuring required
- 0-39: CRITICAL - Almost certainly rejected, rebuild recommended

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "version": "2.0",
  "checkedAt": "${currentDate}",
  "overallScore": <0-100>,
  "categories": {
    "format": {
      "name": "Format & Parsing",
      "maxPoints": 25,
      "earnedPoints": <0-25>,
      "percentage": <0-100>,
      "issues": [
        {
          "issue": "<specific technical issue>",
          "impact": "<how this breaks ATS parsing>",
          "severity": "<critical|major|minor>",
          "fix": "<exact steps to fix>"
        }
      ],
      "passes": ["<what's done well>"]
    },
    "structure": {
      "name": "Structure & Sections",
      "maxPoints": 25,
      "earnedPoints": <0-25>,
      "percentage": <0-100>,
      "issues": [...],
      "passes": [...]
    },
    "keywords": {
      "name": "Keywords & Content",
      "maxPoints": 30,
      "earnedPoints": <0-30>,
      "percentage": <0-100>,
      "issues": [...],
      "passes": [...]
    },
    "readability": {
      "name": "Length & Readability",
      "maxPoints": 20,
      "earnedPoints": <0-20>,
      "percentage": <0-100>,
      "issues": [...],
      "passes": [...]
    }
  },
  "summary": "<2-3 sentences: What ATS systems will see, main strengths, biggest risk>",
  "topIssues": [
    {
      "severity": "<critical|major|minor>",
      "issue": "<problem statement>",
      "suggestion": "<how to fix>",
      "category": "<format|structure|keywords|readability>"
    }
  ],
  "quickWins": [
    "<5-minute fix that will improve score>",
    "<another quick improvement>",
    "<third easy optimization>",
    "<fourth simple change>",
    "<fifth fast fix>"
  ],
  "metadata": {
    "wordCount": ${wordCount},
    "estimatedPages": <1 or 2>,
    "detectedSections": ["<sections found>"],
    "hasContactInfo": {
      "email": <true|false>,
      "phone": <true|false>,
      "linkedin": <true|false>,
      "location": <true|false>
    },
    "keywordStats": {
      "hardSkillsCount": <number>,
      "softSkillsCount": <number>,
      "actionVerbsCount": <number>,
      "quantifiedAchievements": <number>
    }
  },
  "atsCompatibility": {
    "workday": {
      "rating": "<high|medium|low>",
      "reason": "<why this rating - focus on skills extraction and section headers>"
    },
    "greenhouse": {
      "rating": "<high|medium|low>",
      "reason": "<why - focus on keyword frequency and abbreviation expansion>"
    },
    "taleo": {
      "rating": "<high|medium|low>",
      "reason": "<why - focus on exact matching and format strictness>"
    },
    "lever": {
      "rating": "<high|medium|low>",
      "reason": "<why - focus on plain text parsing and format compatibility>"
    }
  },
  "abbreviationCheck": {
    "expandedCorrectly": ["<abbreviations that have full form, e.g. 'AWS (Amazon Web Services)'>"],
    "needsExpansion": ["<abbreviations used without full form - CRITICAL for Greenhouse/Lever>"]
  },
  "metricQuestions": [
    {
      "id": "<unique_id_like_mq1>",
      "original_bullet": "<exact text of the original CV bullet that lacks metrics>",
      "question": "<short, friendly question asking the user to provide the missing number/metric>",
      "options": ["<logical option 1>", "<logical option 2>", "<logical option 3>", "<logical option 4>"]
    }
  ]
}

=============================================================================
FIELD INSTRUCTIONS
=============================================================================
### metricQuestions (0 to 2 items max)
Identify the 1 or 2 most critical experience bullets in the original CV that sound impressive but lack ANY quantifiable metrics.
CRITICAL RULE: DO NOT select a bullet if it ALREADY contains ANY numbers, $, %, data points, or timeframes (e.g., "$50k+", "2,500 vehicles", "3 months"). ONLY select purely qualitative bullets.
Create a VERY SHORT, PUNCHY, AND DIRECT question (max 4-6 words when possible). DO NOT restate what the user did. Just ask for the missing number.
- "id": A simple unique string like "metric_1"
- "original_bullet": The exact text from their CV.
- "question": Ultra-short and direct. (e.g., "By how much?", "How many tickets daily?", "What was the budget?", "How many users?")
- "options": An array of 3 or 4 logical, realistic options the user can just click on. (e.g. for a budget question: ["Under $10k", "$10k - $50k", "$50k - $250k", "Over $250k"])
If the CV already has great metrics everywhere, return an empty array [].

=============================================================================
ATS COMPATIBILITY RATING RULES
=============================================================================
Rate each ATS based on these SPECIFIC criteria:

WORKDAY (Fortune 500 companies):
- HIGH: Standard sections, clear skills list, proper date format
- MEDIUM: Minor section naming issues, some skills buried in text
- LOW: Creative headers, skills not clearly listed, inconsistent dates

GREENHOUSE (Most common - keyword frequency matters):
- HIGH: Keywords repeated 2-3x in context, ALL abbreviations expanded, proper structure
- MEDIUM: Keywords present but not repeated, some abbreviations unexpanded
- LOW: Missing key abbreviation expansions, keyword stuffing, poor frequency

TALEO (Oldest, most rigid - enterprise companies):
- HIGH: Exact standard format, no tables/columns, all fields clear
- MEDIUM: Minor formatting quirks, mostly standard structure
- LOW: Any non-standard formatting, creative elements, tables detected

LEVER (Modern but strict on format):
- HIGH: Plain text friendly, no tables, .docx compatible format
- MEDIUM: Simple format but some parsing challenges
- LOW: Complex formatting, tables, columns, heavy styling

=============================================================================
EXAMPLES OF GOOD ISSUE DESCRIPTIONS
=============================================================================
GOOD (specific, technical, actionable):
✓ Issue: "Two-column layout detected - left column contains contact info"
  Impact: "Taleo and older ATS parse left-to-right, will mix content incorrectly"
  Fix: "Convert to single-column layout, move contact info to top"

✓ Issue: "Skills section uses comma-separated list without categories"
  Impact: "ATS cannot distinguish skill types, reduces keyword matching accuracy"
  Fix: "Group skills into Technical Skills, Tools, Languages with bullet points"

✓ Issue: "No LinkedIn URL in contact section"
  Impact: "Modern ATS (Greenhouse, Lever) use LinkedIn for candidate enrichment"
  Fix: "Add LinkedIn profile URL: linkedin.com/in/yourname"

✓ Issue: "MBA abbreviation used without expansion"
  Impact: "Greenhouse and Lever will NOT match 'MBA' to 'Master of Business Administration' in job postings"
  Fix: "Change to 'MBA (Master of Business Administration)' at first mention"

✓ Issue: "AWS mentioned 6 times in skills section"
  Impact: "Greenhouse penalizes keyword stuffing - may flag as gaming the system"
  Fix: "Reduce to 2-3 contextual mentions across different sections"

BAD (vague, unhelpful):
✗ "Format could be improved"
✗ "Add more keywords"
✗ "Structure is weak"

=============================================================================
FINAL VALIDATION CHECKLIST
=============================================================================
Before responding, verify:
□ overallScore = sum of all earnedPoints (must equal exactly)
□ Each earnedPoints <= maxPoints
□ At least 2-3 issues per category OR explicit "passes" if category is strong
□ topIssues sorted by severity (critical → major → minor)
□ quickWins are genuinely quick (5 minutes or less)
□ atsCompatibility ratings are justified by specific platform behaviors
□ abbreviationCheck lists ALL abbreviations found and their status
□ All issues have actionable fixes

Respond with ONLY the JSON object. No markdown, no explanations.`;
}

export function generateOptimizedCVValidationPrompt(
  optimizedCVText: string,
  originalIssues: { issue: string; category: string }[],
  originalScore: number
): string {
  return `You are an ATS bypass validator. Your job is to verify that the entry-level candidate's CV has successfully implemented the bypass tactics and fixed all issues.

=============================================================================
OPTIMIZED CV TO VALIDATE
=============================================================================
"""
${optimizedCVText}
"""

=============================================================================
ORIGINAL SCORE: ${originalScore}/100
ISSUES THAT NEEDED TO BE FIXED (${originalIssues.length} total):
=============================================================================
${originalIssues.map((issue, i) => `${i + 1}. [${issue.category.toUpperCase()}] ${issue.issue}`).join('\n')}

=============================================================================
YOUR TASK: VALIDATE THE OPTIMIZATION
=============================================================================
Check each original issue and determine if it was FIXED in the optimized CV.

VALIDATION CRITERIA:
✅ FIXED = The issue no longer exists in the optimized CV
❌ NOT FIXED = The issue still exists
⚠️ PARTIALLY FIXED = Improved but not fully resolved

SCORING RULES:
- Start with base score of 85 (optimized CVs start higher)
- Each FIXED issue: +1-3 points (based on severity)
- Each NOT FIXED issue: -3-5 points
- Each PARTIALLY FIXED: +0.5-1 points

BONUS POINTS (can exceed 100, cap at 100):
+5 if ALL issues are fixed
+3 if professional summary has metrics and no clichés
+2 if every bullet starts with action verb
+2 if every bullet has quantified results
+2 if skills are properly categorized
+1 if LinkedIn URL is present

EXPECTED OUTCOME:
If the optimization was done correctly, the score should be 90-100.
If score is below 90, clearly explain what's still wrong.

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "overallScore": <85-100, based on validation>,
  "validationResults": [
    {
      "originalIssue": "The issue that was flagged",
      "category": "format|structure|keywords|readability",
      "status": "fixed|not_fixed|partially_fixed",
      "evidence": "What in the CV shows this is fixed/not fixed",
      "pointsAwarded": <number>
    }
  ],
  "bonusPoints": {
    "allIssuesFixed": <true|false>,
    "summaryQuality": <true|false>,
    "actionVerbs": <true|false>,
    "quantifiedResults": <true|false>,
    "skillsCategorized": <true|false>,
    "linkedInPresent": <true|false>,
    "totalBonus": <0-15>
  },
  "summary": "2-3 sentences about the optimization quality",
  "remainingIssues": ["Any issues that still exist"]
}

IMPORTANT: Be ACCURATE with scoring, not generous or harsh.
If an issue is clearly fixed, give full credit. If partially fixed, give partial credit.
A well-optimized CV should realistically score 85-95%. Do not inflate to 100%.

Respond with ONLY the JSON object. No markdown, no explanations.`;
}

export function generateATSOptimizationPrompt(
  cvText: string,
  atsResult: {
    overallScore: number;
    categories: {
      format: { issues: { issue: string; fix?: string }[]; passes: string[] };
      structure: { issues: { issue: string; fix?: string }[]; passes: string[] };
      keywords: { issues: { issue: string; fix?: string }[]; passes: string[] };
      readability: { issues: { issue: string; fix?: string }[]; passes: string[] };
    };
    topIssues: { issue: string; suggestion: string; category: string }[];
    quickWins: string[];
  },
  userProvidedMetrics?: Record<string, string>
): string {
  const allIssues = [
    ...atsResult.categories.format.issues.map(i => ({ ...i, category: 'format' })),
    ...atsResult.categories.structure.issues.map(i => ({ ...i, category: 'structure' })),
    ...atsResult.categories.keywords.issues.map(i => ({ ...i, category: 'keywords' })),
    ...atsResult.categories.readability.issues.map(i => ({ ...i, category: 'readability' })),
  ];

  return `You are an ATS bypass specialist. Your ONLY goal is to transform this junior CV to achieve a PERFECT 95-100% ATS compatibility score by leveraging every possible academic/project experience.

🎯 TARGET: 95-100% ATS SCORE - ACCEPT NOTHING LESS!

=============================================================================
🌐 LANGUAGE DETECTION & OUTPUT LANGUAGE (CRITICAL!)
=============================================================================
STEP 1: Detect the language of the original CV below.
STEP 2: ALL text content in your response MUST be in the SAME language as the original CV.

RULES:
- JSON keys ("contact", "summary", "experience", "title", "company", etc.) stay in ENGLISH.
- ALL VALUES (summary text, bullet points, skill names, dates, proficiency levels, etc.) MUST be in the DETECTED language.
- If the CV is in Turkish → write everything in Turkish.
  - Use Turkish month names: Ocak, Şubat, Mart, Nisan, Mayıs, Haziran, Temmuz, Ağustos, Eylül, Ekim, Kasım, Aralık
  - Use "Devam Ediyor" instead of "Present" for current positions
  - Write section content in Turkish (e.g., summary, bullets)
- If the CV is in English → write everything in English.
- If the CV is in any other language → write everything in that language.
- NEVER translate a non-English CV into English. Preserve the original language!
=============================================================================

${userProvidedMetrics && Object.keys(userProvidedMetrics).length > 0 ? `
🎯🎯🎯 USER PROVIDED METRICS - MUST INTEGRATE! 🎯🎯🎯
================================================================================
The user was asked to provide specific metrics for some of their original bullet points.
Here are the answers they provided:
${Object.entries(userProvidedMetrics).map(([id, answer]) => `- For bullet ID ${id}: User answered "${answer}"`).join('\n')}

You MUST use these numbers to enhance the corresponding bullet points in the CV! Do not ignore them.
================================================================================
` : ''}

=============================================================================
ORIGINAL CV (SCORE: ${atsResult.overallScore}/100 - UNACCEPTABLE!)
=============================================================================
"""
${cvText}
"""

=============================================================================
🚨 CRITICAL ISSUES THAT MUST BE FIXED (ZERO TOLERANCE)
=============================================================================
${allIssues.map((issue, i) => `❌ ${i + 1}. [${issue.category.toUpperCase()}] ${issue.issue}
   🔧 Fix: ${issue.fix || 'MUST BE RESOLVED'}`).join('\n\n')}

=============================================================================
🔥 TOP PRIORITY FIXES (DO THESE FIRST)
=============================================================================
${atsResult.topIssues.map((issue, i) => `🚨 ${i + 1}. ${issue.issue}
   ✅ Solution: ${issue.suggestion}`).join('\n\n')}

=============================================================================
⚡ QUICK WINS (EASY POINTS)
=============================================================================
${atsResult.quickWins.map((win, i) => `✓ ${i + 1}. ${win}`).join('\n')}

=============================================================================
🎯 OPTIMIZATION STRATEGY FOR 95-100% SCORE
=============================================================================

FORMAT (Target: 25/25 points):
✅ Single-column layout ONLY
✅ Standard ASCII characters (no emojis, special chars)
✅ Standard bullet points (• or -) ONLY
✅ Consistent spacing and indentation
✅ No tables, columns, or graphics
✅ Clean paragraph breaks between sections
🚫 NEVER use pipe (|) character - it confuses ATS parsers!

STRUCTURE (Target: 25/25 points):
✅ Contact info at TOP (name, email, phone, location, LinkedIn)
✅ Professional Summary immediately after contact

🚨 CRITICAL: SECTION HEADERS MUST BE EXACTLY AS FOLLOWS (Title Case, NOT All-Caps):
   1. "Professional Summary" (or just "Summary")
   2. "Professional Experience" (NOT "Work Experience", NOT "Experience", NOT all-caps)
   3. "Education" (exact wording, title case)
   4. "Skills" (NOT "Technical Skills", NOT "Core Competencies", NOT all-caps)
   5. "Certifications" (if applicable, title case)
   6. "Languages" (if applicable, title case)

⚠️ NEVER use ALL-CAPS for section headers - ATS parsers penalize this!

✅ REVERSE CHRONOLOGICAL order (newest job first)
✅ Job Title format: "[Title] at [Company]" on first line
✅ Location and dates: "[Location] • [Month YYYY] - [Month YYYY]" on second line
✅ Date format MUST be "Month YYYY" (e.g., "January 2020", NOT "Jan 2020" or "January 20")
✅ 3-5 bullets per job
🚫 NEVER use "Job Title | Company | Location" format - use the format above!

KEYWORDS & CONTENT (Target: 30/30 points):
✅ EVERY bullet starts with STRONG action verb
✅ EVERY bullet demonstrates concrete IMPACT (qualitative scope or actual metrics)
✅ Industry keywords appear in CONTEXT (not just listed)
✅ Same key skills mentioned 2-3 times across CV (summary + skills + experience)
🚨 CRITICAL: PRESERVE EXACT TECHNICAL KEYWORDS
- If the original mentions "React", do NOT rewrite it as "frontend framework"
- If it mentions "Python", do NOT rewrite as "scripting language"
- The ATS scores based on exact matches. You MUST preserve all original hard skills exactly as written!

🚨 CRITICAL: ABBREVIATION EXPANSION (Greenhouse/Lever REQUIREMENT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Greenhouse and Lever do NOT recognize unexpanded abbreviations!
ALL abbreviations MUST be expanded at FIRST mention:

MANDATORY EXPANSIONS (use this exact format):
✅ "Amazon Web Services (AWS)" - not just "AWS"
✅ "Master of Business Administration (MBA)" - not just "MBA"
✅ "Project Management Professional (PMP)" - not just "PMP"
✅ "Search Engine Optimization (SEO)" - not just "SEO"
✅ "Customer Relationship Management (CRM)" - not just "CRM"
✅ "Key Performance Indicators (KPIs)" - not just "KPIs"
✅ "Return on Investment (ROI)" - not just "ROI"
✅ "Application Programming Interface (API)" - not just "API"
✅ "Continuous Integration/Continuous Deployment (CI/CD)" - not just "CI/CD"
✅ "Structured Query Language (SQL)" - not just "SQL"

RULE: In skills section, list BOTH forms: "AWS (Amazon Web Services)"
RULE: In experience bullets, expand on FIRST use, then use short form

🚨 CRITICAL: HARD SKILLS MUST DOMINATE!
- Minimum 10-15 hard/technical skills
- Maximum 4-5 soft skills
- Hard to soft ratio: 70/30 or better
- If original CV has < 10 hard skills, ADD relevant ones for their industry

READABILITY (Target: 20/20 points):
✅ 400-650 words total (OPTIMAL for 1 page)

🚨 BULLET LENGTH RULE (STRICTLY ENFORCED):
- Maximum 120 characters per bullet (count them!)
- Maximum 2 lines when rendered
- ONE metric per bullet (don't cram multiple achievements)
- If a bullet is > 120 chars, SPLIT IT into 2 bullets!

✅ Each bullet is ONE concise sentence - no run-on sentences!
✅ Clear white space between sections
✅ Scannable in 6 seconds

=============================================================================
🔥 AGGRESSIVE BULLET TRANSFORMATION (MANDATORY FOR EVERY BULLET)
=============================================================================
FORMULA: [Power Verb] + [Specific Action] + [Metric/Result OR Qualitative Scope]

TRANSFORM EXAMPLES (Keep bullets concise - max 120 characters!):
If metrics exist in original CV:
❌ "Worked on sales"
✅ "Generated $250K+ revenue by closing 30+ enterprise deals"

If NO metrics exist in original CV (DO NOT FABRICATE):
❌ "Responsible for customer service"
✅ "Proactively managed complex inquiries and optimized resolution workflows"

❌ "Managed team"
✅ "Led cross-functional team, delivering multiple strategic projects on-time"

❌ "Did marketing"
✅ "Executed multi-channel campaigns, significantly expanding audience reach"

❌ "Helped with projects"
✅ "Spearheaded key initiatives, resulting in major efficiency gains"

CRITICAL: Keep bullets SHORT and PUNCHY. One metric (if known) per bullet is enough! If NO metrics exist, focus on "How" and "Scope" (enterprise-grade, cross-functional) rather than hallucinating numbers!

POWER VERBS TO USE (START EVERY BULLET WITH ONE OF THESE):
Spearheaded, Orchestrated, Pioneered, Accelerated, Transformed, Championed,
Architected, Delivered, Generated, Achieved, Drove, Optimized, Streamlined,
Launched, Established, Cultivated, Maximized, Revolutionized, Led, Developed,
Managed, Increased, Reduced, Implemented, Created, Built, Improved, Executed,
Designed, Directed, Expanded, Initiated, Modernized, Negotiated, Scaled

=============================================================================
🎯 SENIORITY-BASED VERB SELECTION (AUTO-DETECT FROM CV)
=============================================================================
FIRST: Detect the candidate's seniority level from the CV:

DETECTION SIGNALS:
- SENIOR/LEAD: Title contains "Senior", "Lead", "Principal", "Staff", "Head of", "Director", "Manager", "VP", "CTO", "CEO"
  OR 5+ years total experience OR managed/led teams
- MID-LEVEL: Title is plain (e.g., "Software Developer", "Marketing Specialist"), 2-5 years experience
- JUNIOR/ENTRY: Title contains "Junior", "Associate", "Intern", "Trainee", "Graduate", OR 0-2 years experience

VERB RULES BY SENIORITY:

📌 SENIOR/LEAD ROLES → ONLY POWER VERBS:
✅ Use: Led, Spearheaded, Orchestrated, Architected, Directed, Transformed, Pioneered
✅ Use: Established, Cultivated, Championed, Maximized, Revolutionized
🚫 NEVER use: Assisted, Participated, Helped, Supported, Collaborated with seniors

📌 MID-LEVEL ROLES → MOSTLY POWER VERBS:
✅ Use: Developed, Implemented, Managed, Executed, Delivered, Created, Built
✅ Use: Collaborated, Contributed (when describing cross-team work)
⚠️ Avoid: Assisted, Helped (unless truly supporting a senior initiative)

📌 JUNIOR/ENTRY ROLES → GROWTH-FOCUSED VERBS:
✅ Use: Contributed to, Collaborated on, Developed, Built, Implemented
✅ Use: Supported (senior team members in...), Assisted (in delivering...)
✅ Use: Gained expertise in, Acquired proficiency in
✅ Show learning: "Contributed to 5+ projects under senior guidance, reducing bug rate by 20%"
⚠️ Transform "Helped" to "Collaborated with senior engineers to..."
⚠️ Transform "Participated" to "Contributed to team initiative that..."

EXAMPLES BY SENIORITY:

SENIOR (5+ yrs, Lead title):
❌ "Assisted the team with architecture decisions"
✅ "Architected microservices platform handling 10M+ daily requests"

MID-LEVEL (2-5 yrs):
❌ "Helped build features"
✅ "Developed 15+ features, increasing user engagement by 40%"

JUNIOR (0-2 yrs):
❌ "Helped with code" (too vague)
✅ "Collaborated with senior engineers to deliver 8 features, reducing deployment time by 25%"
✅ "Contributed to team codebase with 50+ pull requests, maintaining 95% approval rate"

🚫 UNIVERSAL BANNED VERBS (ALL SENIORITY LEVELS):
- "Was responsible for" → Use "Managed" or "Owned"
- "Worked on" → Use "Developed" or "Built"
- "Did" → Use specific action verb
- "Made" → Use "Created" or "Designed"
- "Handled" → Use "Managed" or "Orchestrated"

📌 CONTEXT-DEPENDENT VERBS:
These are OK for Junior/Mid but NOT for Senior:
- "Assisted" → Junior OK: "Assisted senior engineers in delivering..."
- "Supported" → Junior/Mid OK: "Supported product launch that generated..."
- "Participated" → Junior OK: "Participated in agile ceremonies, contributing..."
- "Collaborated" → All levels OK (even seniors collaborate!)

⚠️ IMPORTANT: Even for juniors, ALWAYS add metrics and outcomes!
❌ "Assisted with testing"
✅ "Assisted QA team in testing 3 major releases, identifying 25+ bugs pre-launch"

=============================================================================
🎯 SKILLS SECTION REQUIREMENTS (STRICTLY ENFORCED)
=============================================================================

MINIMUM REQUIREMENTS:
- 10-15 Technical/Hard Skills (MINIMUM!)
- 4-5 Soft Skills (MAXIMUM!)
- If original CV lacks skills, ADD relevant ones for their industry

HARD SKILLS EXAMPLES BY ROLE:
- Software: Python, JavaScript, React, Node.js, AWS, Docker, MongoDB, PostgreSQL, Git, CI/CD, Kubernetes, REST APIs
- Marketing: Google Analytics, SEO, SEM, Facebook Ads, HubSpot, Salesforce, Content Marketing, Email Marketing, A/B Testing
- Sales: Salesforce, CRM Systems, Lead Generation, Pipeline Management, Contract Negotiation, Account Management
- Customer Service: Zendesk, Intercom, CRM Tools, Ticketing Systems, Live Chat, Help Desk Software
- Finance: Excel, QuickBooks, Financial Modeling, Budgeting, Forecasting, SAP, Bloomberg Terminal

SOFT SKILLS (Keep to 4-5 ONLY):
Leadership, Communication, Problem Solving, Team Collaboration, Adaptability

FORMAT IN JSON:
"skills": {
  "technical": [
    "Skill 1", "Skill 2", "Skill 3", "Tool 1", "Technology 1",
    "Skill 4", "Skill 5", "Skill 6", "Tool 2", "Technology 2",
    "Skill 7", "Skill 8"  // At least 10-12 items!
  ],
  "soft": [
    "Leadership", "Communication", "Problem Solving", "Team Collaboration"  // MAX 4-5!
  ]
}

=============================================================================
🚫 NO FAKE METRICS POLICY (CRITICAL)
=============================================================================
If original CV lacks specific numbers, DO NOT invent or estimate them:
- Focus on qualitative impact and scope ("large-scale", "enterprise-grade")
- Describe the methodology and tools used ("leveraging CRM systems")
- Highlight cross-functional collaboration and business alignment
- Emphasize successful delivery rather than fake percentages.

=============================================================================
📝 PROFESSIONAL SUMMARY (REWRITE COMPLETELY)
=============================================================================
🚫 BANNED PHRASES (NEVER USE):
- "I am eager to..."
- "I am passionate about..."
- "I believe I would be..."
- "Seeking a challenging position..."
- "Hardworking professional..."
- Any sentence starting with "I am" or "I have"

✅ CORRECT FORMAT:
"[Role] with [X] years of experience in [expertise]. [Key achievement with metric]. [Another achievement]. Proven track record in [skills relevant to career]."

EXAMPLE:
"Results-driven Sales Manager with 7+ years of experience in B2B enterprise sales. Generated $2.5M+ in annual revenue and expanded client base by 150%. Proven track record in team leadership, strategic planning, and exceeding quarterly targets by 25%+."

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "contact": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, Country",
    "linkedin": "linkedin.com/in/username",
    "portfolio": "portfolio.com"
  },
  "summary": "Powerful 3-4 sentence summary with metrics. NO clichés. Lead with role + years + expertise.",
  "experience": [
    {
      "title": "Job Title",        // JUST the title, e.g., "Software Developer" - NOT "Software Developer at Company"
      "company": "Company Name",   // SEPARATE field for company
      "location": "City, Country",
      "startDate": "Month YYYY",
      "endDate": "Present",
      "bullets": [
        "Power verb + specific action + quantified result (metric)",
        "Another achievement demonstrating scale or scope",
        "Third bullet demonstrating clear business impact",
        "Fourth bullet with business outcome"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University Name",
      "location": "City, Country",
      "graduationDate": "Month YYYY or null if not in original CV",
      "details": "GPA, honors, relevant coursework or null"
    }
  ],
  "skills": {
    "technical": ["Skill 1", "Skill 2", "Skill 3", "Tool 1", "Technology 1"],
    "soft": ["Leadership", "Communication", "Problem Solving", "Team Collaboration"]
  },
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Month YYYY or null if not in original CV"
    }
  ],
  "languages": [
    {
      "language": "English",
      "proficiency": "Native/Fluent"
    }
  ],
  "changes": [
    {
      "category": "format",
      "issue": "What was wrong",
      "fix": "What was fixed",
      "impact": "high"
    }
  ],
  "detectedSeniority": {
    "level": "senior|mid|junior",
    "signals": ["Title: Senior Software Engineer", "5+ years experience", "Led team of 8"],
    "verbStrategy": "power_verbs_only|mostly_power_verbs|growth_focused"
  }
}

=============================================================================
CHANGES TRACKING (DOCUMENT ALL IMPROVEMENTS)
=============================================================================
Track EVERY change in the "changes" array:
- category: "format" | "structure" | "keywords" | "readability" | "content"
- issue: Original problem
- fix: What you changed
- impact: "high" | "medium" | "low"

Include 10-15 changes minimum!

=============================================================================
✅ FINAL QUALITY CHECKLIST (ALL MUST BE TRUE)
=============================================================================
□ Contact info at top with LinkedIn URL (NO pipe | characters!)
□ Professional Summary has NO clichés, HAS metrics
□ Section headers in TITLE CASE (NOT all-caps): "Professional Summary", "Professional Experience", "Education", "Skills"
□ Experience in REVERSE chronological order
□ LANGUAGE CHECK: ALL output text is in the SAME language as the original CV (NOT translated to English!)
□ Job titles in format: "[Title] at [Company]" (NOT "Title | Company")
□ ALL dates in "Month YYYY" format (e.g., "January 2020", NOT "Jan 2020" or "January 20")
□ EVERY bullet starts with power verb
□ Bullets feature metrics/numbers OR strong qualitative scope if numbers are absent
□ EVERY bullet is SHORT (max 120 characters, 1-2 lines) - COUNT THE CHARACTERS!
□ 3-5 bullets per job
□ 10-15 HARD/Technical skills listed (MINIMUM 10!)
□ 4-5 SOFT skills ONLY (MAXIMUM 5!)
□ Skills properly split: technical array has 10+ items, soft array has 4-5 items
□ Total word count: 400-650
□ NO pipe (|) characters ANYWHERE in the CV
□ ALL identified issues are fixed
□ Target: 90-95% ATS score (be realistic!)

🎯 CRITICAL RULES (READ THESE 3 TIMES BEFORE GENERATING):
1. NEVER use pipe (|) character - it makes ATS think you have columns!
2. In JSON: "title" and "company" are SEPARATE fields - do NOT combine them!
   ✅ "title": "Software Developer", "company": "ABC Tech"
   ❌ "title": "Software Developer at ABC Tech"
3. ALL dates MUST be "Month YYYY" format (e.g., "January 2020", NOT "Jan 2020")
4. Section headers in TITLE CASE: "Professional Experience" (NOT "PROFESSIONAL EXPERIENCE" or "Work Experience")
5. NEVER use all-caps for section headers - ATS systems penalize this!
6. Bullets must be SHORT and PUNCHY (max 120 chars) - if longer, SPLIT into 2 bullets!
7. Every bullet needs ONE clear metric (not 3 metrics in one bullet!)
8. MINIMUM 10 hard skills - if original CV lacks them, ADD relevant ones!
9. MAXIMUM 5 soft skills - cut them down if too many!
10. The optimized CV should score 90-95%. Aim for excellence, not perfection!

🚫 NEVER FABRICATE DATA (ZERO TOLERANCE - READ CAREFULLY):
11. NEVER invent dates that are not in the original CV!
    - If education has no graduation date → use null, NOT a made-up date
    - If certification has no date → use null, NOT a made-up date
    - If course has no date → use null, NOT a made-up date
    ✅ "graduationDate": null (if not in original)
    ❌ "graduationDate": "June 2018" (FABRICATED - FORBIDDEN!)
    ❌ "graduationDate": "Present" (WRONG - use null!)
    ❌ "graduationDate": "2018" (MADE UP - use null!)
12. NEVER invent GPA, honors, or details not in the original CV
13. NEVER add certifications or courses the person didn't list
14. You CANNOT estimate metrics for experience bullets (no fake metrics!)
15. You CANNOT fabricate factual data like dates, degrees, or institutions

⚠️ CRITICAL CHECK BEFORE SUBMITTING:
Look at the original CV education section. Does it have a graduation date/year?
- Original: "Computer Science, Istanbul University" → NO DATE → use null
- Original: "Computer Science, Istanbul University, 2018" → HAS DATE → use "2018"

Respond with ONLY the JSON object. No markdown, no explanations.`;
}
