/**
 * Pro Report Prompts
 * Used for generating detailed CV analysis reports for premium users
 */

export function generateProReportPrompt(
  cvText: string,
  jobTexts: string[]
): string {
  return `You are an elite CV optimization specialist with expertise in ATS systems and modern hiring practices.

=============================================================================
CANDIDATE'S CV (YOUR SINGLE SOURCE OF TRUTH)
=============================================================================
"""
${cvText}
"""

=============================================================================
TARGET JOB POSTING(S)
=============================================================================
${jobTexts
  .map(
    (text, i) => `
--- JOB ${i + 1} ---
"""
${text}
"""
`
  )
  .join("\n")}

=============================================================================
CRITICAL ANTI-HALLUCINATION RULES
=============================================================================
⛔ Rewritten bullets must be based on ACTUAL content from CV
⛔ Role recommendations must match candidate's REAL background
⛔ ATS flags must address issues actually present in THIS CV
⛔ NEVER invent achievements, metrics, or experiences
⛔ If enhancing bullets, metrics must be plausible based on context

=============================================================================
ROLE RECOMMENDATION SCORING (REALISTIC HR STANDARDS)
=============================================================================
Role fit scores measure how ready the candidate IS TODAY for each role,
based ONLY on documented skills/experience. Most scores should be 45-70%.

EXCEPTIONAL FIT (80-90%) - VERY RARE:
- Near-identical current role with proven results (same title, same level, same industry)
- Example: "Senior React Developer" with 6 years React → "Senior Frontend Engineer" role
- Must have 90%+ of required skills WITH evidence

STRONG FIT (65-79%):
- Same role family, meets most requirements with evidence
- Example: "Backend Engineer" with Python/Django → "Full Stack Developer" (has backend, needs frontend growth)
- Has 70%+ of core skills documented

MODERATE FIT (50-64%):
- Adjacent role with meaningful overlap
- Example: "QA Engineer" → "DevOps Engineer" (testing + automation overlap, needs infra skills)
- Career pivot where transferable skills are clear but gaps exist

STRETCH FIT (35-49%):
- Different role but some foundation exists
- Would require significant upskilling (6+ months)
- Be honest about the gap

POOR FIT (Below 35%):
- Minimal alignment with documented experience
- Would essentially need to start from scratch

NEVER give 75%+ to:
- Roles requiring skills NOT demonstrated in CV
- Seniority jumps (Junior → Senior) without 5+ years documented experience
- Industry changes without directly relevant technical skills
- Aspirational roles based on "potential" rather than evidence

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "rewrittenBullets": [
    "<enhanced bullet 1 based on actual CV content>",
    "<enhanced bullet 2 based on actual CV content>",
    "<enhanced bullet 3 based on actual CV content>"
  ],
  "roleRecommendations": [
    { "title": "<role 1>", "fit": <percentage> },
    { "title": "<role 2>", "fit": <percentage> },
    { "title": "<role 3>", "fit": <percentage> }
  ],
  "atsFlags": [
    "<specific, actionable tip 1>",
    "<specific, actionable tip 2>",
    "<specific, actionable tip 3>"
  ],
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

### rewrittenBullets (exactly 3)
Transform existing CV bullets using achievement-focused format:

WEAK → STRONG example:
"Responsible for managing customer accounts"
→ "Managed portfolio of 50+ enterprise accounts, achieving 95% retention rate and identifying $200K in upsell opportunities"

Guidelines:
- Start with powerful action verbs: Spearheaded, Orchestrated, Transformed, Accelerated
- Include metrics where plausible (don't invent)
- Incorporate 1-2 keywords from job posting naturally
- Show IMPACT not just activity
- Each bullet 1-2 lines, scannable
- Pick bullets that are currently weak and can be significantly improved

### roleRecommendations (exactly 3, ordered by fit)
For each role, verify:
□ Does CV show relevant skills for this role?
□ Does experience level match?
□ Is fit percentage justified by concrete CV evidence?

Example analysis:
- CV: 3 years Python, Django, REST APIs, team lead of 4 people
- Role: "Backend Developer" → 78% (strong technical match, experience aligns)
- Role: "Senior Backend Developer" → 58% (skills match but lacks seniority/years)
- Role: "Engineering Manager" → 42% (some leadership but limited scope, needs growth)

### atsFlags (3-5 items)
Provide specific, actionable tips based on THIS CV's actual issues.

BAD (too generic):
"Use keywords from the job description"

GOOD (specific and actionable):
"Add 'CI/CD' and 'Docker' to your skills section - these appear 4 times in the job posting but are missing from your CV"

Types of ATS flags:
1. Missing critical keywords that ARE in job posting but NOT in CV
2. Formatting issues (if detectable from text)
3. Skills section optimization opportunities
4. Experience bullet improvements for ATS parsing
5. Job title alignment suggestions

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
QUALITY CHECKLIST (STRICT HR VALIDATION)
=============================================================================
□ All 3 rewritten bullets based on actual CV content
□ Role fit percentages realistic and justified
□ ATS flags address specific issues in THIS CV
□ No invented skills, metrics, or experiences
□ Recommendations actionable and specific
□ Metric questions (if any) target the most important vague achievements

🔴 ROLE RECOMMENDATION VALIDATION:
□ Are most role fits in the 50-70% range (realistic)?
□ Did you give 80%+ ONLY with documented evidence?
□ Would a recruiter agree with your fit percentages?
□ Did you avoid "aspirational" role suggestions?

Respond with ONLY the JSON object. No markdown, no explanations.`;
}

export function generateImprovementBreakdownPrompt(
  originalCVText: string,
  optimizedCVText: string,
  jobTexts: string[],
  missingKeywords: string[],
  originalScore: number,
  optimizedScore: number,
  fakeItMode: boolean = false
): string {
  const actualDifference = optimizedScore - originalScore;

  return `You are a CV optimization analyst. Explain exactly how the optimized CV improved upon the original.

${fakeItMode ? `
⚠️ FAKE IT MODE ANALYSIS ⚠️
This CV was optimized in "Fake It Until You Make It" mode, meaning ALL missing keywords were aggressively added, even if the candidate doesn't have real experience with them. Frame problems and solutions accordingly.
` : ''}

=============================================================================
ORIGINAL CV
=============================================================================
"""
${originalCVText}
"""

=============================================================================
OPTIMIZED CV
=============================================================================
"""
${optimizedCVText}
"""

=============================================================================
TARGET JOB POSTING(S)
=============================================================================
${jobTexts
  .map(
    (text, i) => `
--- JOB ${i + 1} ---
"""
${text}
"""
`
  )
  .join("\n")}

=============================================================================
ANALYSIS CONTEXT
=============================================================================
- Missing Keywords Addressed: ${missingKeywords.join(", ")}
- Original Match Score: ${originalScore}%
- Optimized Match Score: ${optimizedScore}%
- Total Improvement: ${actualDifference}%

=============================================================================
🚨 CRITICAL MATHEMATICAL CONSTRAINT 🚨
=============================================================================
The sum of ALL impact values MUST EQUAL EXACTLY ${actualDifference}%

This is NON-NEGOTIABLE. Examples:
- If ${actualDifference} = 15: impacts might be [5, 4, 3, 2, 1] = 15 ✓
- If ${actualDifference} = 8: impacts might be [3, 2, 1.5, 1, 0.5] = 8 ✓
- If ${actualDifference} = 25: impacts might be [8, 6, 5, 4, 2] = 25 ✓

ALWAYS verify: sum of all impacts = ${actualDifference}

=============================================================================
IMPACT DISTRIBUTION GUIDELINES
=============================================================================
Prioritize by typical ATS/recruiter importance:

HIGH IMPACT (3-8% each):
- Adding critical missing keywords appearing multiple times in job posting
- Rewriting bullets to include key requirements
- Adding job-specific technical skills

MEDIUM IMPACT (1.5-3% each):
- Professional summary improvements
- Skills section reorganization
- Secondary keyword additions

LOW IMPACT (0.5-1.5% each):
- Minor formatting improvements
- Additional context additions
- Soft skill additions

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "improvements": [
    {
      "category": "<one of: Keyword Addition, Bullet Rewriting, ATS Optimization, Professional Summary, Skills Organization, Formatting, Other>",
      "problem": "<what was wrong in the original CV - be specific>",
      "before": "<original text/content before optimization (optional but recommended)>",
      "after": "<optimized text/content after changes (optional but recommended)>",
      "action": "<specific change made - be precise>",
      "impact": <number - contribution to total ${actualDifference}%>,
      "severity": "<one of: critical, important, minor - based on impact (≥3: critical, ≥1.5: important, <1.5: minor)>",
      "reason": "<why this change improves match score>",
      "section": "<one of: summary, experience, skills, education, certifications, languages, contact>"
    }
  ]
}

=============================================================================
EXAMPLE (if total improvement was 12%)
=============================================================================
{
  "improvements": [
    {
      "category": "Keyword Addition",
      "problem": "Missing critical keywords 'Kubernetes' and 'Docker' that appear 6 times in job posting",
      "before": "Technical Skills: Python, Django, PostgreSQL, Redis",
      "after": "Technical Skills: Python, Django, PostgreSQL, Redis, Kubernetes, Docker",
      "action": "Added 'Kubernetes' and 'Docker' to technical skills section",
      "impact": 4,
      "severity": "critical",
      "reason": "These container technologies appear 6 times in job posting and are listed as required skills",
      "section": "skills"
    },
    {
      "category": "Bullet Rewriting",
      "problem": "Vague bullet point lacking metrics and specific technologies",
      "before": "• Worked on backend systems",
      "after": "• Architected microservices handling 10K+ requests/second using Python and FastAPI",
      "action": "Transformed weak bullet to achievement-focused format with metrics",
      "impact": 3,
      "severity": "critical",
      "reason": "Added specific metrics and technologies matching job requirements",
      "section": "experience"
    },
    {
      "category": "Professional Summary",
      "problem": "Summary missing key terminology from job description",
      "before": "Backend developer with experience in Python and web applications",
      "after": "Backend developer specializing in cloud-native development and CI/CD pipelines, with experience in Python and scalable web applications",
      "action": "Added 'cloud-native development' and 'CI/CD pipelines' terminology",
      "impact": 2.5,
      "severity": "important",
      "reason": "Summary now immediately signals relevant expertise to ATS",
      "section": "summary"
    },
    {
      "category": "Keyword Addition",
      "problem": "No mention of Agile/Scrum methodologies despite job requirement",
      "before": "Soft Skills: Team collaboration, Problem solving",
      "after": "Soft Skills: Team collaboration, Problem solving, Agile, Scrum",
      "action": "Added 'Agile' and 'Scrum' methodologies",
      "impact": 1.5,
      "severity": "important",
      "reason": "Job posting mentions agile environment",
      "section": "skills"
    },
    {
      "category": "ATS Optimization",
      "problem": "Non-standard job title confuses ATS parsing",
      "before": "Code Writer",
      "after": "Software Engineer",
      "action": "Standardized job title to match industry conventions",
      "impact": 1,
      "severity": "minor",
      "reason": "ATS systems better recognize standard titles",
      "section": "experience"
    }
  ]
}
// Total: 4 + 3 + 2.5 + 1.5 + 1 = 12% ✓

=============================================================================
QUALITY CHECKLIST
=============================================================================
□ Sum of all impact values = exactly ${actualDifference}
□ Each improvement has a clear "problem" description
□ Before/after examples provided where applicable
□ Severity matches impact level (≥3: critical, ≥1.5: important, <1.5: minor)
□ Each improvement references actual changes between CVs
□ Impact values proportional to importance
□ Categories and sections from allowed lists
□ Reasons explain WHY change improves matching
${fakeItMode ? '□ Problem descriptions acknowledge aggressive keyword addition without real experience' : ''}

${fakeItMode ? `
=============================================================================
FAKE IT MODE SPECIFIC GUIDELINES
=============================================================================
When describing problems and solutions in Fake It Mode:
- Problem descriptions should mention "missing keywords despite no real experience"
- Use phrases like "aggressively added", "strategically placed without verification"
- Be honest that keywords were added even without candidate experience
- Example problem: "CV completely missing 'Machine Learning' keywords despite candidate having no ML experience"
- Example solution: "Added ML keywords throughout skills and experience to match job requirements"
- Severity should reflect keyword importance to job posting, not candidate's actual experience
` : ''}

Respond with ONLY the JSON object. Verify math: impacts must sum to ${actualDifference}.`;
}
