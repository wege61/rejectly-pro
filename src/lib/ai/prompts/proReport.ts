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
ROLE RECOMMENDATION SCORING (BE BRUTALLY HONEST - STRICT HR STANDARDS)
=============================================================================
Use these guidelines strictly. Most role recommendations should be 50-70%.

EXCEPTIONAL MATCH (80-90%) - RARE:
- Software Engineer → Senior Software Engineer (ONLY if 5+ years documented)
- Marketing Manager → Marketing Director (ONLY if team leadership documented)
- CV must show CLEAR evidence of readiness - don't assume potential

STRONG MATCH (70-79%):
- Same role type, same industry, meets most requirements
- Software Engineer → DevOps Engineer (if relevant skills documented)
- Still requires ALL core skills to be present

MODERATE MATCH (55-69%):
- Some overlap but notable gaps
- Career pivot with transferable skills
- Significant learning curve acknowledged

WEAK MATCH (40-54%):
- Limited relevance, would need substantial upskilling
- Different field with minimal transferable skills
- Honest about the gap

POOR MATCH (Below 40%):
- Almost no alignment
- Suggest fundamentally different career path
- Don't try to force fit

NEVER give 75%+ to:
- Roles requiring skills NOT demonstrated in CV
- Seniority jumps (Junior → Senior) without evidence
- Industry changes without relevant experience
- "Potential" - only score documented capabilities

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
- Role: "Senior Backend Developer" → 88% (strong technical match + leadership)
- Role: "Engineering Manager" → 65% (leadership shown but limited scope)
- Role: "Solutions Architect" → 55% (needs more system design evidence)

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

=============================================================================
QUALITY CHECKLIST (STRICT HR VALIDATION)
=============================================================================
□ All 3 rewritten bullets based on actual CV content
□ Role fit percentages realistic and justified
□ ATS flags address specific issues in THIS CV
□ No invented skills, metrics, or experiences
□ Recommendations actionable and specific

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
