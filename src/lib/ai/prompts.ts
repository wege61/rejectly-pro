<<<<<<< Updated upstream
export function generateFreeSummaryPrompt(
  cvText: string,
  jobTexts: string[]
): string {
  return `You are a STRICT HR recruiter at a top-tier company, screening 500+ applications daily. You have NO patience for fluff - only cold, hard qualification matching matters.

Your job is to QUICKLY filter out unqualified candidates. You are NOT here to encourage or be nice - you're here to find the BEST matches and reject the rest.

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
⛔ ONLY reference skills, experiences, and achievements EXPLICITLY written in the CV
⛔ NEVER invent years of experience - if CV says "2 years" you say "2 years"
⛔ NEVER add technologies or skills not mentioned in the CV
⛔ Every claim must be traceable to a specific line in the CV
⛔ If CV is vague, acknowledge limitation rather than filling gaps

=============================================================================
SCORING GUIDELINES (STRICT HR STANDARDS)
=============================================================================
Think like a real HR recruiter screening hundreds of applications. Be STRICT and REALISTIC.

90-100%: EXCEPTIONAL - All required skills present, experience level matches exactly, same industry, would immediately schedule interview
85-89%: EXCELLENT - Nearly all requirements met, minor gaps that won't affect performance
80-84%: STRONG - Most requirements met, candidate could succeed with minimal onboarding
70-79%: GOOD - Core requirements met, some gaps but transferable experience compensates
60-69%: MODERATE - Has foundation but noticeable skill gaps, would need training
50-59%: WEAK - Some relevant background but significant gaps, risky hire
40-49%: POOR - Major skill/experience mismatch, would struggle in role
30-39%: VERY POOR - Few relevant qualifications, career pivot needed
20-29%: MINIMAL MATCH - Almost no alignment, completely different field
Below 20%: NO MATCH - Wrong career path entirely

=============================================================================
STRICT SCORING RULES
=============================================================================
⚠️ AUTOMATIC PENALTIES (Apply these BEFORE calculating final score):
- Missing 50%+ of REQUIRED skills → Cap at 45%
- Experience gap >3 years below requirement → Subtract 20 points
- No industry experience when required → Subtract 15 points
- Missing critical certification (if mandatory) → Subtract 10 points

📊 CALCULATION:
- Required Skills Match: 45% weight (MOST IMPORTANT)
- Experience Level Match: 30% weight
- Industry Relevance: 15% weight
- Education/Certifications: 10% weight

💡 REALITY CHECK:
- Most applications score 35-55% (this is normal - people apply to aspirational jobs)
- 60%+ is genuinely a GOOD match worth interviewing
- 75%+ is STRONG and relatively rare
- 85%+ is EXCEPTIONAL and very rare

DO NOT inflate scores to make candidates feel good. Honest assessment helps them target better opportunities.

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "fitScore": <number 0-100 following scoring guidelines>,
  "summary": "<3-4 sentences, 350-450 characters, professional tone, specific to THIS candidate>",
  "missingKeywords": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"],
  "sampleRewrite": {
    "original": "<EXACT bullet point copied from CV - do not paraphrase>",
    "rewritten": "<enhanced version with metrics and impact>"
  },
  "sampleRole": {
    "title": "<realistic job title based on ACTUAL experience>",
    "fit": <realistic percentage based on CV content>,
    "description": "<2-3 sentences referencing SPECIFIC skills/experiences FROM THE CV>"
  }
}

=============================================================================
FIELD INSTRUCTIONS
=============================================================================

### fitScore
- Be BRUTALLY honest - this helps candidates find better-fit opportunities
- Junior applying for senior role → 25-40% (not 50-60%)
- Missing half of required skills → Cap at 45%
- Career changer with no industry experience → 30-45%
- Good match with minor gaps → 60-75%
- Strong match → 75-85%
- Perfect match (rare) → 85%+
- Compare ACTUAL years of experience - don't assume or round up

### summary
- Be DIRECT and BLUNT - no sugar-coating
- Start with the BIGGEST problem or gap if score is below 60%
- If score is 60%+, start with strongest qualification
- Explicitly state what's MISSING that would get them rejected
- End with honest verdict: "Would interview" / "Would not interview" / "Maybe with reservations"
- Examples:
  * BAD (too nice): "You have great potential and transferable skills..."
  * GOOD (honest): "Missing 3 of 5 required skills. 2 years experience vs 5 required. Would not interview."
  * GOOD (positive): "Strong Python background matches requirements. Minor gap in cloud experience. Would interview."

### missingKeywords
- List EXACTLY 5 keywords/skills from job posting NOT in CV
- Be specific: "Kubernetes" not "container orchestration"
- Prioritize REQUIRED skills first, then nice-to-haves
- Include experience gaps: "5+ years experience" if CV shows only 2
- Include seniority gaps: "Senior level" if candidate is Junior
- These keywords should explain WHY score is low (if low)

### sampleRewrite
- ORIGINAL: Copy ACTUAL bullet from CV verbatim (pick a weak one)
- REWRITTEN: Transform using STAR format (Situation, Task, Action, Result)
- Add metrics only if reasonably inferred
- Incorporate job keywords naturally
- Make it achievement-focused

### sampleRole
- Title must be realistic for someone with THIS CV's background
- DO NOT suggest the same role if they're clearly underqualified
- Base fit % on concrete evidence in CV using same strict standards
- Fit percentages should also follow realistic distribution:
  * 70-85%: Strong match - candidate's background aligns well
  * 55-69%: Moderate match - some alignment with gaps
  * 40-54%: Weak match - limited relevance
  * Below 40%: Consider suggesting a different career path
- Description MUST reference:
  * At least ONE specific technology/skill from CV
  * Candidate's apparent experience level
  * Honest assessment of fit
- BAD: "Your skills make you a great fit" (too vague)
- GOOD: "Your 3 years of React development and experience building e-commerce platforms align well with this role's frontend architecture focus"
- GOOD (honest): "With 1 year of experience, Junior Frontend Developer roles (55-65% fit) would be more realistic than this Senior position"

=============================================================================
QUALITY CHECKLIST (STRICT HR VALIDATION)
=============================================================================
□ Every skill mentioned is actually in the CV
□ Fit score reflects STRICT HR standards (most scores 35-55%)
□ Summary contains specific details from THIS CV
□ Original bullet copied exactly from CV
□ Role recommendation makes sense for this person's background
□ No invented information

🔴 BIAS CHECK (MANDATORY):
□ Would a REAL HR manager with 500 applications give this score?
□ Did you apply automatic penalties for skill/experience gaps?
□ Is the score you gave in the COMMON range (35-55%) or did you go higher?
□ If score is above 60%, can you justify EVERY required skill being present?
□ If score is above 75%, is this candidate genuinely EXCEPTIONAL for this role?

🔴 ANTI-INFLATION CHECK:
□ Did you avoid "benefit of the doubt" scoring?
□ Did you penalize gaps rather than assuming transferable skills?
□ Is this score based on EXPLICIT CV content, not potential?
□ Would rejecting this candidate make sense at this score?

FINAL GUT CHECK:
- If you scored 50%+, ask: "Would I actually interview this person?"
- If you scored 40%-, ask: "Did I find genuine mismatches, not just nitpicks?"
- Be the HR gatekeeper, not the candidate's advocate.

Respond with ONLY the JSON object. No markdown, no explanations.`;
}

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

export function generateOptimizedCVPrompt(
  cvText: string,
  jobTexts: string[],
  analysisResults: {
    fitScore: number;
    summary: string;
    missingKeywords: string[];
    rewrittenBullets?: string[];
    roleRecommendations?: Array<{ title: string; fit: number }>;
    atsFlags?: string[];
  },
  fakeItMode: boolean = false,
  additionalTools: string[] = [],
  extractedMetrics: string[] = [],
  achievementsSection: string = ''
): string {
  const metricsWarning = extractedMetrics.length > 0 ? `
🚨🚨🚨 MANDATORY METRICS - THESE MUST ALL APPEAR IN YOUR OUTPUT! 🚨🚨🚨
================================================================================
We found these metrics in the original CV. EVERY SINGLE ONE must appear:
${extractedMetrics.map((m, i) => `${i + 1}. "${m}"`).join('\n')}

If you miss ANY of these, you have FAILED. Double-check before responding!
================================================================================
` : '';

  const achievementsWarning = achievementsSection ? `
🏆🏆🏆 ACHIEVEMENTS SECTION FOUND - MUST BE INTEGRATED! 🏆🏆🏆
================================================================================
The original CV has these achievements. EACH ONE must become a bullet point:

${achievementsSection}

Integrate these into the relevant job experience bullets!
================================================================================
` : '';

  return `You are an expert CV writer and ATS optimization specialist. Create a fully optimized, ATS-friendly CV based on the original CV, target job postings, and analysis results.

${metricsWarning}
${achievementsWarning}

ORIGINAL CV:
"""
${cvText}
"""

TARGET JOB POSTINGS:
${jobTexts
  .map(
    (text, i) => `
Job ${i + 1}:
"""
${text}
"""
`
  )
  .join("\n")}

ANALYSIS RESULTS:
- Match Score: ${analysisResults.fitScore}/100
${analysisResults.rewrittenBullets ? `- Suggested Bullets: ${analysisResults.rewrittenBullets.join(" | ")}` : ""}
${analysisResults.atsFlags ? `- ATS Tips: ${analysisResults.atsFlags.join(" | ")}` : ""}
${additionalTools.length > 0 ? `
=============================================================================
USER-CONFIRMED ADDITIONAL TOOLS (MANDATORY INTEGRATION)
=============================================================================
The candidate has CONFIRMED they have real experience with these tools:
${additionalTools.map(tool => `- ${tool}`).join("\n")}

🚨 CRITICAL INTEGRATION REQUIREMENTS 🚨

1. SKILLS SECTION (MANDATORY):
   - Add ALL ${additionalTools.length} tools to the skills.technical array
   - These are verified skills - prioritize them in the list

2. EXPERIENCE BULLETS (MANDATORY):
   - For EACH confirmed tool, find the most relevant job experience
   - Naturally integrate the tool into at least ONE bullet point for that experience
   - Use action verbs: "Developed with [Tool]", "Implemented using [Tool]", "Built [X] leveraging [Tool]"

   Example transformations:
   - Original: "Developed web applications"
   - With React: "Developed responsive web applications using React and modern JavaScript"

   - Original: "Managed database systems"
   - With PostgreSQL: "Managed and optimized PostgreSQL database systems, improving query performance by 40%"

3. PROFESSIONAL SUMMARY (IF RELEVANT):
   - If a tool is highly relevant to the target job, mention it in the summary
   - Example: "Full-stack developer proficient in React, Node.js, and cloud technologies"

The user specifically confirmed these tools - they MUST appear in the optimized CV, not just in skills but woven into the experience narrative.
` : ""}

${fakeItMode ? `
═══════════════════════════════════════════════════════
⚠️ FAKE IT UNTIL YOU MAKE IT MODE ENABLED ⚠️
═══════════════════════════════════════════════════════
The candidate has explicitly chosen to add skills they don't have yet.

MISSING KEYWORDS TO ADD: ${analysisResults.missingKeywords.join(", ")}

YOU MUST:
✅ Add ALL of these missing keywords to the skills section
✅ Integrate these keywords into experience bullets where plausible
✅ Be aggressive with keyword placement throughout the CV
✅ The candidate understands these are aspirational skills

TASK: Create an optimized CV that includes ALL missing keywords.
` : `
═══════════════════════════════════════════════════════
🛡️ HONEST MODE - AGGRESSIVE OPTIMIZATION WITHOUT NEW SKILLS
═══════════════════════════════════════════════════════
The candidate wants AGGRESSIVE CV optimization but WITHOUT adding skills they don't have.

🚨 SKILL RESTRICTIONS (DO NOT VIOLATE):
❌ DO NOT add ANY new technical skills not in the original CV
❌ DO NOT invent technologies or tools

🏆 CRITICAL: PRESERVE ALL EXISTING ACHIEVEMENTS & METRICS!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: EXTRACT ALL METRICS FROM ORIGINAL CV
Before writing anything, create a mental list of EVERY metric in the original:
- Percentages (satisfaction scores, improvement rates, etc.)
- Money (revenue, savings, costs, etc.)
- Counts (users, customers, vehicles, products, etc.)
- Rankings (regional ranks, performance standings, etc.)
- Time periods (months, weeks, consecutive periods, etc.)
- Team/scale sizes (team members, partners, etc.)

STEP 2: COUNT THEM
Count the total number of unique metrics/achievements. Remember this number.

STEP 3: VERIFY AFTER WRITING
After creating the optimized CV, count again. The number must be EQUAL or HIGHER.
If ANY metric is missing → add it back immediately!

⚠️ ZERO TOLERANCE POLICY:
Every single metric from the original CV MUST appear in the optimized version.
This includes ALL: percentages, dollar amounts, user counts, rankings, time periods, and volume metrics.

If the original has an "ACHIEVEMENTS" section:
1. Each achievement becomes a bullet point in the relevant job experience
2. Top 2-3 achievements are ALSO mentioned in the summary
3. NO achievement is left out - they are the candidate's proof of value!

🚀 MANDATORY OPTIMIZATIONS (YOU MUST DO ALL OF THESE):
✅ COMPLETELY REWRITE the professional summary - make it powerful and compelling
✅ TRANSFORM every experience bullet - add metrics, results, impact
✅ PRESERVE ALL original metrics and achievements (integrate them better!)
✅ REORGANIZE skills by relevance to the target job
✅ ENHANCE wording with stronger action verbs throughout
✅ IMPROVE ATS compatibility with better formatting

⚠️ IMPORTANT: This is NOT a "keep everything the same" mode!
You MUST significantly improve the CV's presentation and impact.
The ONLY restriction is: don't add skills the candidate doesn't have.
Everything else should be dramatically improved.

MANDATORY TRANSFORMATIONS:
1. Summary → Rewrite with powerful opening, include TOP achievements (NO clichés!)
2. Each bullet → Integrate original metrics + add estimated metrics where missing
3. Achievements → Weave into experience bullets where they belong (don't lose them!)
4. Skills → Reorganize by job relevance, group logically
5. Action verbs → Replace weak verbs (managed, helped, worked) with strong ones (spearheaded, pioneered, drove, accelerated)

TASK: Create a SIGNIFICANTLY IMPROVED CV that PRESERVES all original achievements while presenting them more powerfully.
`}

IMPORTANT INSTRUCTIONS:
- Extract and preserve ALL personal information (name, email, phone, location, LinkedIn, portfolio)
- Rewrite experience bullets to be achievement-focused with quantifiable results
- Ensure proper ATS formatting (no tables, clear sections, standard fonts)
- Add a compelling professional summary tailored to target jobs
- Organize skills by relevance to target roles
- Keep formatting clean and ATS-friendly
- CRITICAL: Order work experience in REVERSE CHRONOLOGICAL order (most recent job FIRST, oldest job LAST). This is the standard CV format expected by recruiters and ATS systems.

=============================================================================
PROFESSIONAL SUMMARY GUIDE (3-4 powerful sentences)
=============================================================================

🚫 BANNED CLICHÉS - NEVER USE THESE:
❌ "I am eager to apply..."
❌ "I am excited about this opportunity..."
❌ "I believe I would be a great fit..."
❌ "I have always been passionate about..."
❌ "Seeking a challenging position..."
❌ "Looking to leverage my skills..."
❌ "Dedicated and hardworking professional..."
❌ Any sentence starting with "I am" or "I have"

✅ CORRECT STRUCTURE:
1. Lead with [Role] + [Years] + [Primary expertise] (no "I am")
2. Highlight 2-3 specific achievements with metrics
3. Mention key technologies/skills matching job requirements
4. End with value proposition (what you bring, not what you want)

✅ GOOD EXAMPLE STRUCTURE:
"[Role] with [X] years [expertise]. [Achievement with metric] and [another achievement]. [Key skills/technologies]."

❌ BAD EXAMPLE (what NOT to do):
"I am a passionate professional who is eager to apply my skills. I believe I would be a great fit for your company."

=============================================================================
🔥 MANDATORY BULLET TRANSFORMATION (EVERY BULLET MUST BE TRANSFORMED!)
=============================================================================

⚠️ DO NOT copy bullets from the original CV as-is!
EVERY bullet must be rewritten to be more impactful.

🚨 CRITICAL: BULLET LENGTH LIMIT 🚨
- MAXIMUM 120 characters per bullet (STRICTLY ENFORCED!)
- Should render as 1-2 lines maximum when displayed
- If a bullet exceeds 120 chars → SPLIT into TWO separate bullets!
- Count characters BEFORE submitting your response!

TRANSFORMATION FORMULA:
[Strong Action Verb] + [Specific Action] + [Quantified Result/Impact]

WEAK → STRONG EXAMPLES:

❌ "Responsible for customer support"
✅ "Resolved 50+ customer inquiries daily, achieving 98% satisfaction rating" (72 chars ✓)

❌ "Worked on web development projects"
✅ "Developed 5 web applications using React, serving 10,000+ monthly users" (75 chars ✓)

❌ "Managed social media accounts"
✅ "Grew social media following by 150% across 3 platforms" (58 chars ✓)
✅ "Generated 2M+ impressions, driving 25% increase in website traffic" (68 chars ✓)
[Note: Split into 2 bullets to keep both under 120 chars]

❌ "Helped with data analysis"
✅ "Analyzed 100K+ records using Python and SQL for cost-saving insights" (71 chars ✓)

❌ "Optimized service processes"
✅ "Streamlined service workflows, reducing wait times by 35%" (59 chars ✓)

🎯 METRIC ESTIMATION RULES:
If exact numbers aren't in the CV, use reasonable estimates:
- Customer interactions → "50+", "100+", "500+"
- Team size → "team of 4-6", "cross-functional teams of 10+"
- Satisfaction → "95%+", "97%+"
- Improvement → "20%", "35%", "2x"
- Revenue/Cost → "$50K+", "$100K+"

💪 STRONG ACTION VERBS TO USE:
Spearheaded, Orchestrated, Transformed, Accelerated, Pioneered, Championed, Architected, Streamlined, Drove, Delivered, Achieved, Generated, Increased, Reduced, Optimized

=============================================================================
ATS OPTIMIZATION CHECKLIST
=============================================================================
Your optimized CV must:
□ Use standard section headings (Professional Experience, Education, Skills)
□ Avoid tables, graphics, or complex formatting
□ Include relevant keywords from job posting naturally
□ Use standard date formats (Month YYYY) with 4-digit year
□ Spell out acronyms at least once
□ Use standard fonts and simple formatting
□ Keep bullet points concise (max 120 characters, 1-2 lines each)

🚨 CRITICAL: HARD SKILLS VS SOFT SKILLS REQUIREMENT 🚨
================================================================================
ATS systems heavily weight hard/technical skills over soft skills!

MANDATORY REQUIREMENTS:
✅ Technical skills array: MINIMUM 10-12 items (STRICTLY ENFORCED!)
✅ Soft skills array: MAXIMUM 4-5 items (cut down if more!)
✅ Hard to soft ratio: 70/30 or better

If the original CV has fewer than 10 hard skills, you MUST add relevant ones based on:
- Their industry and job role
- Technologies mentioned in their experience
- Common tools for their profession
- Skills implied by their achievements

Examples:
- Software developer → Add: Git, REST APIs, SQL, Testing frameworks, CI/CD
- Marketing professional → Add: Google Analytics, SEO, Email Marketing, CRM tools
- Sales professional → Add: CRM Systems, Pipeline Management, Lead Generation tools

DO NOT just copy the original skills - actively expand hard skills to meet the 10-12 minimum!
================================================================================

🚨 FINAL REMINDER BEFORE YOU WRITE JSON 🚨
================================================================================
RE-CHECK the original CV for ALL metrics and achievements.
Every number, percentage, ranking, and achievement MUST appear in your output.
If the original has an ACHIEVEMENTS section, integrate EACH into relevant experience bullets!
================================================================================

Respond in JSON format:
{
  "contact": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, Country",
    "linkedin": "linkedin.com/in/username",
    "portfolio": "portfolio.com" // optional
  },
  "summary": "Compelling 3-4 sentence professional summary tailored to target roles, incorporating key strengths and missing keywords...",
  "experience": [ // MUST be in REVERSE CHRONOLOGICAL order (most recent job FIRST, oldest job LAST)
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "startDate": "Month YYYY",
      "endDate": "Month YYYY", // or "Present"
      "bullets": [
        "Achievement-focused bullet point with quantifiable results...",
        "Another bullet incorporating keywords and STAR format...",
        "Third bullet demonstrating impact and skills..."
      ]
    }
    // Continue with older positions in reverse chronological order...
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University Name",
      "location": "City, Country",
      "graduationDate": "Month YYYY",
      "details": "GPA: 3.8/4.0, Honors, relevant coursework" // optional
    }
  ],
  "skills": {
    "technical": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8", "Skill 9", "Skill 10", "..."], // MINIMUM 10-12 items!
    "soft": ["Leadership", "Communication", "Problem Solving", "Team Collaboration"] // MAXIMUM 4-5 items!
  },
  "certifications": [ // optional, only if present in original CV
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Month YYYY"
    }
  ],
  "languages": [ // optional, only if present in original CV
    {
      "language": "English",
      "proficiency": "Native/Fluent/Professional"
    }
  ]
}

Guidelines:
${fakeItMode ? `
🚀 FAKE IT MODE GUIDELINES:
- Add ALL missing keywords from the list above to skills section
- Integrate keywords naturally into experience bullets where possible
- NEVER fabricate companies, job positions, or dates (keep those real)
- You may add skills the candidate doesn't have - they chose this mode
- Add missing keywords primarily to: skills section, professional summary, experience bullets
- Be bold with keyword placement - that's the point of this mode
` : `
🛡️ SMART HONEST MODE GUIDELINES:
- Preserve ALL factual information from original CV (companies, titles, dates, degrees)
- ADD related/transferable skills that connect to existing background
- INTEGRATE missing keywords strategically where they fit naturally
- Use honest framing: "Proficient in X" vs "Familiar with Y" vs "Exposure to Z"
- Enhance existing bullets to include relevant keywords from job posting
- Focus on making existing capabilities more discoverable while maintaining integrity
- When adding skills, ensure they're plausible given candidate's background
`}
- Enhance wording and presentation, not fabricate facts
- Ensure every experience bullet demonstrates impact
- Professional summary should be compelling
- All dates MUST be in "Month YYYY" format (e.g., "January 2020", "June 2023")
- Keep professional tone throughout
- Use standard ASCII characters only (avoid special Unicode symbols, emojis, or fancy characters)
- Use simple quotes (""), not smart quotes or other variants

=============================================================================
FINAL QUALITY VERIFICATION
=============================================================================
Before responding, verify:

🔒 PRESERVE (must be identical to original):
□ Contact information (name, email, phone, linkedin)
□ Job titles, company names, and employment dates
□ Education details

🏆 ACHIEVEMENTS CHECK (CRITICAL - DO NOT SKIP!):
□ Count ALL metrics in original CV (percentages, money, counts, rankings, time periods)
□ Count ALL metrics in your optimized CV
□ Optimized count must be >= original count (ZERO metrics can be lost!)
□ Verify ALL metric types are preserved: volumes, revenue, rankings, time periods, satisfaction scores
□ If original had ACHIEVEMENTS section → EACH item must be in a relevant experience bullet

🔄 MUST BE DIFFERENT FROM ORIGINAL (these should be noticeably improved):
□ Professional summary → COMPLETELY REWRITTEN (no clichés!) + TOP achievements included
□ Every experience bullet → TRANSFORMED with metrics and strong verbs
□ Skills organization → REORGANIZED by job relevance
□ Work experience order → REVERSE CHRONOLOGICAL (most recent first)

📋 VALIDATION CHECKLIST:
${additionalTools.length > 0 ? `□ CRITICAL: ALL ${additionalTools.length} user-confirmed tools (${additionalTools.join(', ')}) are in skills.technical array
□ CRITICAL: Each user-confirmed tool appears in at least ONE experience bullet point` : ''}
${fakeItMode ? '□ All missing keywords aggressively added per Fake It Mode' : '□ Bullets enhanced with quantified metrics'}
□ Skills.technical array has 10-12+ items (COUNT THEM!)
□ Skills.soft array has 4-5 items MAX (COUNT THEM!)
□ Hard to soft skills ratio is 70/30 or better
□ Summary does NOT start with "I am" or "I have"
□ Summary does NOT contain "eager to apply" or similar clichés
□ ALL original achievements preserved and integrated
□ JSON is valid and complete
□ ATS checklist requirements met

⚠️ CRITICAL CHECK: Compare your output to the original CV.
If the summary and bullets look almost identical → YOU FAILED. Rewrite them!
If ANY achievement from original is missing → YOU FAILED. Add them back!
If ANY bullet exceeds 120 characters → YOU FAILED. Split it into 2 bullets!
The optimized CV should be NOTICEABLY BETTER, not a copy of the original.

Respond with ONLY the JSON object. No explanations, no markdown.`;
}

export function generateFakeSkillsRecommendationsPrompt(
  missingKeywords: string[],
  jobTexts: string[]
): string {
  return `You are an expert career coach and technical learning advisor. A candidate has added skills to their CV that they don't currently possess, with commitment to learn them. Create realistic, actionable learning paths.

=============================================================================
SKILLS THE CANDIDATE NEEDS TO LEARN
=============================================================================
${missingKeywords.map((kw, i) => `${i + 1}. ${kw}`).join("\n")}

=============================================================================
TARGET JOB POSTING(S) (Context for relevance)
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
YOUR TASK
=============================================================================
Create a comprehensive, realistic learning plan for each missing skill that takes the candidate from zero to interview-ready.

=============================================================================
TIME ESTIMATES (Be Realistic)
=============================================================================
- Simple tools (Figma, Notion, Slack): 1-2 weeks
- Programming languages (basics): 4-8 weeks
- Frameworks (React, Django): 4-6 weeks
- Complex systems (Kubernetes, AWS): 6-12 weeks
- Certifications: 4-12 weeks depending on complexity

=============================================================================
LEARNING PATH STRUCTURE
=============================================================================
Each path should include:
1. Foundation (understand concepts): ~20% of time
2. Hands-on tutorials: ~30% of time
3. Building projects: ~40% of time
4. Interview prep: ~10% of time

=============================================================================
RESOURCE PRIORITIES
=============================================================================
1. Official documentation (always free, always current)
2. Free courses (YouTube, freeCodeCamp, official tutorials)
3. Interactive platforms (Codecademy, Exercism, Kaggle)
4. Paid courses only if significantly better (Udemy, Coursera)
5. Books for deep understanding

=============================================================================
PROJECT IDEAS REQUIREMENTS
=============================================================================
Projects should be:
- Portfolio-worthy (can show in interviews)
- Demonstrable (can deploy or demo)
- Relevant to target job
- Progressively challenging
- Completable within time estimate

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "recommendations": [
    {
      "skill": "<skill name>",
      "category": "<one of: Programming Language, Framework, Library, Cloud Platform, DevOps Tool, Design Tool, Database, Methodology, Soft Skill, Certification>",
      "difficulty": "<Beginner, Intermediate, Advanced>",
      "learningPath": [
        "<Step 1: specific action with resource>",
        "<Step 2: specific action with resource>",
        "<Step 3: specific action with resource>",
        "<Step 4: specific action with resource>",
        "<Step 5: specific action with resource>"
      ],
      "projectIdeas": [
        "<Project 1: specific, achievable project with clear deliverable>",
        "<Project 2: project that builds on first>",
        "<Project 3: portfolio-worthy capstone project>",
        "<Project 4: stretch project demonstrating advanced understanding>"
      ],
      "estimatedTime": "<realistic time range>",
      "interviewTips": "<what interviewers typically ask about this skill and how to prepare>",
      "quickWins": "<what candidate can honestly say after just 1 week of learning>"
    }
  ]
}

=============================================================================
EXAMPLE FOR "KUBERNETES"
=============================================================================
{
  "skill": "Kubernetes",
  "category": "DevOps Tool",
  "difficulty": "Intermediate",
  "learningPath": [
    "Week 1-2: Complete Kubernetes official tutorials and understand core concepts (Pods, Deployments, Services) - kubernetes.io/docs/tutorials",
    "Week 3-4: Take 'Kubernetes for Beginners' on KodeKloud or similar hands-on platform",
    "Week 5-6: Set up local cluster using Minikube and deploy sample applications",
    "Week 7-8: Learn Helm charts and implement CI/CD pipeline with GitHub Actions + Kubernetes",
    "Week 9-10: Study for CKA certification (optional but valuable) using killer.sh practice exams"
  ],
  "projectIdeas": [
    "Deploy a simple Node.js app to Minikube with 3 replicas and LoadBalancer service",
    "Create multi-container application (frontend + backend + database) with proper networking",
    "Build complete CI/CD pipeline that auto-deploys to Kubernetes on git push",
    "Implement auto-scaling based on CPU usage with horizontal pod autoscaler"
  ],
  "estimatedTime": "8-10 weeks for job-ready proficiency",
  "interviewTips": "Be ready to explain: Pod lifecycle, difference between Deployment and StatefulSet, how Services work, basic troubleshooting (kubectl logs, describe, exec). Draw architecture diagrams.",
  "quickWins": "After 1 week: 'I understand container orchestration concepts and have deployed applications to a local Kubernetes cluster using Minikube'"
}

=============================================================================
QUALITY REQUIREMENTS
=============================================================================
□ Every learning step includes specific resource or action
□ Time estimates are realistic (not optimistic)
□ Project ideas are concrete and achievable
□ Interview tips based on actual common questions
□ Quick wins give candidate honest talking points

Create recommendations for ALL ${missingKeywords.length} skills listed above.

Respond with ONLY the JSON object. No explanations.`;
}

export function generateCoverLetterPrompt(
  cvText: string,
  jobText: string,
  candidateName: string,
  companyName: string,
  positionTitle: string,
  tone: 'professional' | 'friendly' | 'formal' = 'professional',
  length: 'short' | 'medium' | 'long' = 'medium',
  language: 'en' | 'tr' = 'en',
  template: 'standard' | 'story_driven' | 'technical_focus' | 'results_oriented' | 'career_change' | 'short_intro' = 'standard',
  customizationFields?: {
    emphasize_skills?: string[];
    specific_projects?: string[];
    preferred_style?: string;
  }
): string {
  const wordCounts = {
    short: '150-200',
    medium: '250-300',
    long: '350-400'
  };

  const toneInstructions = {
    professional: 'Use a professional, confident tone. Be direct and results-oriented.',
    friendly: 'Use a warm, approachable tone while maintaining professionalism. Show enthusiasm.',
    formal: 'Use a formal, respectful tone. Follow traditional business letter conventions.'
  };

  const templateInstructions = {
    standard: `Classic cover letter format with clear structure:
- Opening paragraph: Direct statement of interest
- 2-3 body paragraphs: Relevant experience and skills
- Closing: Call to action`,

    story_driven: `Narrative-based approach that tells your professional story:
- Start with a compelling personal anecdote or moment that sparked your interest
- Connect your story to the role and company
- Use storytelling to make achievements memorable
- Show personality and passion through narrative`,

    technical_focus: `Technical expertise showcase:
- Lead with strongest technical skills matching job requirements
- Provide specific examples of technologies, tools, and methodologies
- Quantify technical achievements (performance improvements, systems built)
- Demonstrate problem-solving abilities with technical examples`,

    results_oriented: `Achievement and impact focused:
- Lead each paragraph with a key achievement or result
- Use metrics and numbers extensively (%, $, scale)
- Focus on business impact and outcomes
- Show ROI and value delivered in previous roles`,

    career_change: `Career transition narrative:
- Acknowledge the career change positively
- Connect transferable skills from previous field
- Explain motivation for change authentically
- Demonstrate preparation and commitment to new field
- Highlight relevant learning, projects, or certifications`,

    short_intro: `Concise and impactful (aim for lower word count):
- Brief but powerful opening
- Only 1-2 most relevant highlights
- Direct and to-the-point
- No fluff, every sentence adds value`
  };

  const languageInstruction = language === 'tr'
    ? 'Write the cover letter in TURKISH language.'
    : 'Write the cover letter in ENGLISH language.';

  const customizationNote = customizationFields ? `

CUSTOMIZATION PREFERENCES:
${customizationFields.emphasize_skills ? `- Emphasize these skills: ${customizationFields.emphasize_skills.join(', ')}` : ''}
${customizationFields.specific_projects ? `- Highlight these projects: ${customizationFields.specific_projects.join(', ')}` : ''}
${customizationFields.preferred_style ? `- Style preference: ${customizationFields.preferred_style}` : ''}` : '';

  return `You are an expert cover letter writer. Create a compelling, personalized cover letter for a job application.

CANDIDATE CV:
"""
${cvText}
"""

JOB POSTING:
"""
${jobText}
"""

APPLICATION DETAILS:
- Candidate Name: ${candidateName}
- Company: ${companyName}
- Position: ${positionTitle}
- Tone: ${tone}
- Template: ${template}
- Length: ${wordCounts[length]} words
- Language: ${language.toUpperCase()}
${customizationNote}

${languageInstruction}

TEMPLATE APPROACH:
${templateInstructions[template]}

TONE INSTRUCTIONS:
${toneInstructions[tone]}

FORMAT REQUIREMENTS:
- Include proper cover letter header with candidate name and contact info
- Add date (use "Today" or current date format)
- Include company/hiring manager address section
- Start with appropriate greeting (Dear Hiring Manager, Dear [Name], etc.)
- Write 3-4 body paragraphs clearly separated by double line breaks
- End with professional closing (Best regards, Sincerely, etc.) and candidate name
- Each paragraph should be visually distinct with proper spacing

CRITICAL RULES (Non-Negotiable):
1. NEVER use these clichés:
   - "I am writing to apply for..."
   - "I believe I would be a great fit..."
   - "I am excited about this opportunity..."
   - "I have always been passionate about..."
   - "Please find attached my resume..."
   - "Thank you for considering my application..."

2. EVERY claim must trace back to the CV:
   - If you mention "5 years of experience," the CV must show 5 years
   - If you cite a metric, it must be in CV or reasonably inferred
   - Never invent achievements, projects, or skills

3. COMPANY SPECIFICITY:
   - Reference something specific about ${companyName} (product, mission, news, culture)
   - Don't just say "your company" - show research
   - Connect their needs to candidate's specific capabilities

4. FORMAT & CONTENT:
   - Target word count: ${wordCounts[length]} words
   - Use specific examples and quantifiable achievements from CV
   - Match keywords from job posting naturally
   - DO NOT use placeholder text - use actual candidate name: ${candidateName}
   - ${languageInstruction}
   - Format with proper line breaks between sections

RESPONSE FORMAT:
You must respond with a structured JSON that breaks down the cover letter into paragraphs with explanations and sentence-level alternatives.

Respond in this EXACT JSON format:
{
  "content": "${candidateName}\\nEmail | Phone\\n\\nToday\\n\\n${companyName}\\nCompany Address\\n\\nDear Hiring Manager,\\n\\n[Opening paragraph]\\n\\n[Body paragraph 1]\\n\\n[Body paragraph 2]\\n\\n[Closing paragraph]\\n\\nBest regards,\\n${candidateName}",
  "wordCount": 250,
  "keyHighlights": [
    "Main achievement 1 mentioned",
    "Main achievement 2 mentioned",
    "Main skill highlighted"
  ],
  "paragraphs": [
    {
      "id": "header",
      "type": "header",
      "content": "${candidateName}\\nEmail | Phone",
      "rationale": "Professional header with candidate contact information",
      "sentences": []
    },
    {
      "id": "greeting",
      "type": "greeting",
      "content": "Dear Hiring Manager,",
      "rationale": "Professional greeting appropriate for the application",
      "sentences": []
    },
    {
      "id": "para-1",
      "type": "opening",
      "content": "Full opening paragraph text...",
      "rationale": "Captures attention and states interest in the position",
      "sentences": [
        {
          "id": "sent-1",
          "text": "First sentence of paragraph.",
          "isHighlight": true,
          "alternatives": ["Alternative 1", "Alternative 2"]
        }
      ]
    },
    {
      "id": "para-2",
      "type": "achievement",
      "content": "Full achievement paragraph...",
      "rationale": "Highlights relevant achievements matching job requirements",
      "sentences": [...]
    },
    {
      "id": "para-3",
      "type": "motivation",
      "content": "Full motivation paragraph...",
      "rationale": "Demonstrates company knowledge and cultural fit",
      "sentences": [...]
    },
    {
      "id": "para-4",
      "type": "closing",
      "content": "Full closing paragraph...",
      "rationale": "Strong call to action and availability statement",
      "sentences": [...]
    }
  ]
}

IMPORTANT NOTES:
- The "content" field must be the COMPLETE formatted cover letter with \\n\\n between paragraphs
- Include header: "${candidateName}\\nEmail | Phone"
- Include date line: "Today"
- Include company section: "${companyName}\\nCompany Address"
- Include greeting: "Dear Hiring Manager," or "Dear [Name],"
- 3-4 body paragraphs separated by \\n\\n
- Include closing: "Best regards," or "Sincerely," followed by ${candidateName}
- Each body paragraph should have 2-5 sentences
- Mark 2-3 most impactful sentences per paragraph as "isHighlight": true
- Provide 2 alternative phrasings for highlighted sentences only
- "rationale" explains WHY that paragraph was chosen based on job requirements
- Paragraph "type": "header", "greeting", "opening", "achievement", "motivation", "closing"

=============================================================================
QUALITY CHECKLIST
=============================================================================
Before responding, verify:
□ Word count within ${wordCounts[length]} range
□ No clichéd openings or closings
□ At least one specific metric or achievement from CV
□ Company name (${companyName}) appears with specific context
□ Tone matches "${tone}" specification
□ Template structure matches "${template}"
□ Every claim supported by CV content
□ Letter would make YOU want to interview this person

Respond with ONLY the JSON object. Create a letter that demands an interview.`;
}

export function generateOptimizedCVAnalysisPrompt(
  optimizedCVText: string,
  jobTexts: string[],
  originalScore: number
): string {
  return `You are an elite ATS (Applicant Tracking System) expert analyzing an OPTIMIZED CV.

=============================================================================
IMPORTANT CONTEXT
=============================================================================
This CV has been professionally optimized with:
✅ ATS-friendly formatting and structure
✅ Strategic keyword placement matching job requirements
✅ Improved bullet points with metrics and achievements
✅ Better section organization for ATS parsing
✅ Industry-standard terminology

The ORIGINAL CV scored ${originalScore}% before optimization.

=============================================================================
OPTIMIZED CV (ANALYZE THIS)
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
SCORING GUIDELINES FOR OPTIMIZED CVs (STRICT HR STANDARDS)
=============================================================================
This CV has been optimized for ATS compatibility. Evaluate it fairly but STRICTLY.

The ORIGINAL CV scored ${originalScore}%. Consider what the optimization actually improved:

1. KEYWORD OPTIMIZATION (potential +2-5 points IF keywords were genuinely added)
   - Are job-relevant keywords now present?
   - Is industry terminology properly used?
   - Does skills section better match job requirements?

2. FORMAT & STRUCTURE (potential +1-2 points IF format was improved)
   - Is it more ATS-parseable now?
   - Are sections clearer?

3. CONTENT QUALITY (potential +2-4 points IF bullets were genuinely improved)
   - Are bullets now achievement-focused with metrics?
   - Is the summary stronger?

⚠️ IMPORTANT CONSTRAINTS:
- Optimization CANNOT add skills/experience the candidate doesn't have
- If original score was low due to SKILL GAPS, optimization can only help marginally (+3-8 points max)
- If original score was low due to FORMATTING issues, optimization can help more (+5-12 points)
- A 35% match cannot become 70% through optimization alone - the core skill gap remains

REALISTIC IMPROVEMENT EXPECTATIONS:
- Original ${originalScore}% with skill gaps → Expect ${Math.min(originalScore + 5, originalScore + 8)}% to ${Math.min(originalScore + 8, 85)}%
- Formatting/keyword improvements are real but limited
- The fundamental match quality cannot change dramatically

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "fitScore": <number - realistic score based on actual improvements, typically ${originalScore}% + 3-8 points>,
  "summary": "<3-4 sentences explaining what the optimization improved and any remaining gaps>",
  "missingKeywords": ["<skills/experience gaps that optimization CANNOT fix>"]
}

=============================================================================
SCORING RULES
=============================================================================
1. Start with the original ${originalScore}% as baseline
2. Add ONLY what optimization genuinely improved:
   - Better keyword placement: +2-4 points
   - Improved bullet formatting: +1-3 points
   - Clearer structure: +1-2 points
3. Maximum realistic improvement: +8-12 points (unless original had severe formatting issues)
4. The score should NEVER exceed what the candidate's actual skills warrant

REMEMBER: A well-formatted CV with missing skills is still a poor match.
Optimization improves PRESENTATION, not QUALIFICATIONS.

Respond with ONLY the JSON object. No markdown, no explanations.`;
}

export function generateSystematicScoringPrompt(
  cvText: string,
  jobTexts: string[]
): string {
  const currentDate = new Date().toISOString();

  return `You are a STRICT HR recruiter implementing a SYSTEMATIC scoring system.
You must calculate each component SEPARATELY using the exact weights and rules below.
This is NOT a subjective assessment - follow the mathematical formulas precisely.

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
STEP 1: DETECT JOB LEVEL
=============================================================================
First, analyze the job posting to determine the position level:

ENTRY-LEVEL indicators (use entry-level weights):
- "entry-level", "junior", "graduate", "new grad", "0-2 years", "no experience required"
- "intern", "trainee", "associate", "fresh"

MID-LEVEL indicators (use mid-level weights):
- "3-5 years", "2-4 years", "experienced", "mid-level"
- No explicit junior/senior indicators

SENIOR-LEVEL indicators (use senior-level weights):
- "senior", "lead", "principal", "staff", "architect"
- "5+ years", "7+ years", "10+ years"
- "manager", "director", "head of"

=============================================================================
STEP 2: APPLY CORRECT WEIGHT DISTRIBUTION
=============================================================================

IF ENTRY-LEVEL JOB:
┌─────────────────────────┬────────────┐
│ Component               │ Max Points │
├─────────────────────────┼────────────┤
│ Skills Match            │ 40         │
│ Education & Learning    │ 25         │
│ Potential & Projects    │ 20         │
│ Industry Relevance      │ 15         │
└─────────────────────────┴────────────┘

IF MID-LEVEL JOB:
┌─────────────────────────┬────────────┐
│ Component               │ Max Points │
├─────────────────────────┼────────────┤
│ Skills Match            │ 45         │
│ Experience Match        │ 30         │
│ Industry Relevance      │ 15         │
│ Education & Certs       │ 10         │
└─────────────────────────┴────────────┘

IF SENIOR-LEVEL JOB:
┌─────────────────────────┬────────────┐
│ Component               │ Max Points │
├─────────────────────────┼────────────┤
│ Experience Match        │ 40         │
│ Skills Match            │ 35         │
│ Industry Relevance      │ 15         │
│ Education & Certs       │ 10         │
└─────────────────────────┴────────────┘

=============================================================================
STEP 3: CALCULATE EACH COMPONENT
=============================================================================

### SKILLS MATCH CALCULATION:
1. Extract ALL required/preferred skills from job posting
2. Count total required skills (T)
3. Count matched skills in CV (M)
4. Formula: (M / T) * maxPoints
5. Include: technical skills, tools, languages, frameworks
6. For entry-level: Include coursework, projects, bootcamp skills

### EXPERIENCE MATCH CALCULATION:
For entry-level jobs:
- This becomes "Potential & Projects" component
- Count: internships (0.5x), projects, volunteer work, coursework
- Formula: (relevant_activities / 4) * maxPoints (cap at max)

For mid/senior jobs:
- Extract required years (Y_req) from posting
- Calculate candidate's relevant years (Y_cv)
- Scoring:
  * Y_cv >= Y_req: 100% of maxPoints
  * Y_cv = Y_req - 1: 80% of maxPoints
  * Y_cv = Y_req - 2: 60% of maxPoints
  * Y_cv = Y_req - 3: 40% of maxPoints
  * Y_cv < Y_req - 3: 20% of maxPoints

### INDUSTRY RELEVANCE CALCULATION:
- Same industry + same role type: 100% of maxPoints
- Same industry + different role: 70% of maxPoints
- Adjacent/related industry: 50% of maxPoints
- Different industry with transferables: 30% of maxPoints
- Completely different industry: 15% of maxPoints

### EDUCATION & CERTIFICATIONS CALCULATION:
- Required degree present: 50% of maxPoints
- Relevant certifications: 30% of maxPoints
- Additional relevant education: 20% of maxPoints
- For entry-level: GPA > 3.5: +bonus, relevant courses: +bonus

=============================================================================
STEP 4: APPLY PENALTIES
=============================================================================
Check EACH penalty condition. Apply ALL that match:

P1: MAJOR SKILL GAP
- Condition: Missing 50%+ of REQUIRED skills (not preferred)
- Deduction: -15 points
- Severity: critical

P2: EXPERIENCE SHORTFALL
- Condition: Experience gap > 3 years below requirement
- Deduction: -10 points
- Severity: major
- NOTE: Skip for entry-level positions

P3: NO INDUSTRY EXPERIENCE
- Condition: Job requires industry experience AND candidate has zero
- Deduction: -8 points (entry-level: -4 points)
- Severity: major

P4: MISSING MANDATORY CERTIFICATION
- Condition: Job lists certification as "required" AND candidate lacks it
- Deduction: -5 points
- Severity: minor

P5: SENIORITY MISMATCH
- Condition: Junior applying for Senior role (or significant level gap)
- Deduction: -12 points
- Severity: critical

P6: OVERQUALIFIED
- Condition: Senior applying for entry-level role
- Deduction: -5 points
- Severity: minor

=============================================================================
STEP 5: CALCULATE FINAL SCORE
=============================================================================
1. rawScore = sum of all component earnedPoints
2. totalPenalties = sum of all penalty deductions
3. finalScore = max(0, min(100, rawScore - totalPenalties))

=============================================================================
STEP 6: DETERMINE HR VERDICT
=============================================================================
Based on finalScore:
- 65%+: "would_interview"
- 45-64%: "maybe_with_reservations"
- Below 45%: "would_not_interview"

=============================================================================
RESPONSE FORMAT (STRICT JSON - FOLLOW EXACTLY)
=============================================================================
{
  "version": "1.0",
  "calculatedAt": "${currentDate}",
  "jobLevel": "<entry|mid|senior>",
  "components": {
    "skillsMatch": {
      "name": "Skills Match",
      "weight": <40|45|35 based on job level>,
      "maxPoints": <same as weight>,
      "earnedPoints": <value between 0 and maxPoints - NEVER exceeds maxPoints!>,
      "percentage": <0-100, calculated as (earnedPoints/maxPoints)*100>,
      "details": "<1-2 sentences explaining the calculation>",
      "matchedItems": ["skill1", "skill2", "..."],
      "missingItems": ["skill1", "skill2", "..."]
    },
    "experienceMatch": {
      "name": "<Experience Match OR Potential & Projects for entry-level>",
      "weight": <20|30|40 based on job level>,
      "maxPoints": <same as weight>,
      "earnedPoints": <value between 0 and maxPoints - NEVER exceeds maxPoints!>,
      "percentage": <0-100, calculated as (earnedPoints/maxPoints)*100>,
      "details": "<explain years comparison or projects evaluated>",
      "matchedItems": ["3 years Python", "Team lead experience", "..."],
      "missingItems": ["5 years required", "Leadership gap", "..."]
    },
    "industryRelevance": {
      "name": "Industry Relevance",
      "weight": 15,
      "maxPoints": 15,
      "earnedPoints": <value between 0 and 15 - NEVER exceeds 15!>,
      "percentage": <0-100, calculated as (earnedPoints/15)*100>,
      "details": "<explain industry match assessment>",
      "matchedItems": ["Tech industry background", "..."],
      "missingItems": ["FinTech specific experience", "..."]
    },
    "educationCerts": {
      "name": "<Education & Learning OR Education & Certs>",
      "weight": <25|10 based on job level>,
      "maxPoints": <same as weight>,
      "earnedPoints": <value between 0 and maxPoints - NEVER exceeds maxPoints!>,
      "percentage": <0-100, calculated as (earnedPoints/maxPoints)*100>,
      "details": "<explain education/cert match>",
      "matchedItems": ["BS Computer Science", "AWS Certified", "..."],
      "missingItems": ["Masters preferred", "PMP required", "..."]
    }
  },
  "penalties": [
    {
      "id": "p1_skill_gap",
      "type": "skill_gap",
      "description": "Missing 60% of required skills",
      "pointsDeducted": 15,
      "severity": "critical",
      "reason": "CV lacks Docker, Kubernetes, and CI/CD - all listed as required"
    }
  ],
  "rawScore": <sum of all earnedPoints - should be between 0 and 100>,
  "totalPenalties": <sum of all pointsDeducted>,
  "finalScore": <rawScore - totalPenalties, must be between 0 and 100>,
  "assessment": {
    "verdict": "<would_interview|maybe_with_reservations|would_not_interview>",
    "percentile": "<top 10%|top 25%|average|below average|bottom 25%>",
    "recommendation": "<2-3 sentence specific HR recommendation>"
  },
  "displayData": {
    "scoreColor": "<#10b981 for 70+, #22c55e for 60-69, #f59e0b for 45-59, #f97316 for 30-44, #ef4444 for <30>",
    "scoreLabel": "<Excellent Match|Strong Match|Good Match|Moderate Match|Fair Match|Weak Match|Poor Match>",
    "primaryGap": "<single most important area to improve>"
  },
  "summary": "<3-4 sentences professional summary>"
}

=============================================================================
SCORING REALITY CHECK
=============================================================================
Before finalizing, verify your calculation makes sense:

EXPECTED SCORE DISTRIBUTION (realistic HR perspective):
- 75-100%: Exceptional candidates - very rare (top 5%)
- 60-74%: Strong candidates worth interviewing (top 20%)
- 45-59%: Average candidates, might interview if pool is weak (middle 40%)
- 30-44%: Below average, significant gaps (bottom 30%)
- 0-29%: Poor match, wrong career path (bottom 10%)

NEW GRAD REALITY CHECK:
- A new grad applying for entry-level with matching education and skills: 55-70%
- A new grad applying for mid-level role: 25-40% (seniority penalty applies)
- A new grad with perfect education but no projects: 40-50%

EXPERIENCED CANDIDATE REALITY CHECK:
- Exact match on all requirements: 75-90%
- Good match with minor gaps: 55-70%
- Career changer with transferable skills: 35-50%
- Wrong field entirely: 15-30%

=============================================================================
MATHEMATICAL VERIFICATION (CRITICAL!)
=============================================================================
Before responding, verify:
□ Sum of component maxPoints = 100
□ Each earnedPoints <= corresponding maxPoints (NEVER exceed maxPoints!)
□ rawScore = sum of all earnedPoints (should be between 0 and 100)
□ totalPenalties = sum of all pointsDeducted
□ finalScore = rawScore - totalPenalties (capped 0-100)
□ No penalty applied twice
□ Entry-level jobs don't have experience penalty

=============================================================================
EARNEDPOINTS CALCULATION EXAMPLE (READ CAREFULLY!)
=============================================================================
WRONG: If maxPoints=40 and match is 100%, earnedPoints=100 ❌
CORRECT: If maxPoints=40 and match is 100%, earnedPoints=40, percentage=100 ✓

WRONG: If maxPoints=35 and match is 80%, earnedPoints=80 ❌
CORRECT: If maxPoints=35 and match is 80%, earnedPoints=28, percentage=80 ✓

Formula: earnedPoints = (percentage / 100) * maxPoints
Example: 80% match with maxPoints=40 → earnedPoints = (80/100) * 40 = 32

earnedPoints can NEVER be greater than maxPoints!

Respond with ONLY the JSON object. No markdown, no explanations.`;
}

export function generateATSCheckPrompt(cvText: string): string {
  const currentDate = new Date().toISOString();

  // Count words for analysis
  const wordCount = cvText.split(/\s+/).filter(word => word.length > 0).length;

  return `You are a senior ATS (Applicant Tracking System) engineer who has built and maintained parsing algorithms for Workday, Greenhouse, Lever, and Taleo. You understand EXACTLY how these systems fail to parse resumes.

Your task: Analyze this CV as if you're running it through multiple ATS parsing engines and scoring it for compatibility.

=============================================================================
CV TO ANALYZE (${wordCount} words detected)
=============================================================================
"""
${cvText}
"""

=============================================================================
🔬 TECHNICAL ATS PARSING ANALYSIS
=============================================================================
You must analyze HOW an ATS would parse this document. Consider:

1. WORKDAY parsing behavior:
   - Strict section header matching ("Experience" not "My Journey")
   - Date extraction requires consistent format
   - Fails on creative section names

2. GREENHOUSE parsing behavior:
   - NLP-based keyword extraction
   - Penalizes keyword stuffing
   - Needs contextual skill mentions

3. TALEO parsing behavior:
   - Oldest and most rigid system
   - Requires exact field mapping
   - Breaks on any non-standard formatting

4. LEVER parsing behavior:
   - More modern, handles some variation
   - Still needs clear section breaks
   - Extracts contact info aggressively

=============================================================================
CATEGORY 1: FORMAT & PARSING (25 points max)
=============================================================================
Check for these SPECIFIC parsing problems:

CRITICAL FAILURES (each = -5 to -8 points):
□ Two-column layout indicators (text appearing side-by-side, | characters)
□ Table structure remnants (grid-like text patterns)
□ Image placeholders ([Photo], [Logo], "Profile Picture")
□ Header/footer content that confuses parsers (page numbers, repeated name)
□ Text boxes or sidebar indicators

MAJOR ISSUES (each = -3 to -5 points):
□ Creative dividers (═══, ★★★, •••, >>>)
□ Unusual bullet characters (➤, ◆, ▪)
□ Emojis or unicode symbols
□ All-caps section headers (harder to parse)
□ Inconsistent spacing patterns

MINOR ISSUES (each = -1 to -2 points):
□ Smart quotes instead of straight quotes
□ En-dashes instead of hyphens in dates
□ Non-standard characters in names/titles

POSITIVE SIGNALS (+points):
✓ Clean single-column flow
✓ Standard bullet points (• or -)
✓ Consistent indentation
✓ Clear paragraph breaks

=============================================================================
CATEGORY 2: STRUCTURE & SECTIONS (25 points max)
=============================================================================
ATS systems look for EXACT section headers. Check:

REQUIRED SECTIONS (missing any = -5 points each):
□ Contact Information (at top, not in header)
□ Work Experience / Professional Experience / Employment History
□ Education
□ Skills / Technical Skills / Core Competencies

STRONGLY RECOMMENDED (-3 points if missing):
□ Professional Summary / Summary / Profile (at top)
□ Clear job titles for each role
□ Company names clearly stated
□ Location for each position

STRUCTURAL CHECKS:
□ Reverse chronological order (most recent first) - CRITICAL for ATS
□ Consistent date format (MM/YYYY, Month YYYY, or YYYY)
□ Job title BEFORE company name (standard order)
□ Dates aligned or clearly associated with each role
□ No orphaned bullet points (bullets without a parent job)

CONTACT INFO PARSING:
□ Email present and valid format (name@domain.com)
□ Phone number present (any standard format)
□ LinkedIn URL present (highly valued by modern ATS)
□ Location present (City, State/Country)
□ NO physical address (privacy concern, wastes space)

=============================================================================
CATEGORY 3: KEYWORDS & CONTENT OPTIMIZATION (30 points max)
=============================================================================
This is where most CVs fail. Analyze:

KEYWORD DENSITY ANALYSIS:
□ Technical skills mentioned (programming languages, tools, platforms)
□ Industry-specific terminology present
□ Job title keywords (matching common job posting language)
□ Certifications spelled out correctly

KEYWORD PLACEMENT (location matters!):
□ Top 1/3 of CV contains most important keywords (ATS weight: 2x)
□ Skills section has clear, parseable list
□ Keywords appear in CONTEXT (not just listed)
□ Acronyms expanded at least once: "AWS (Amazon Web Services)"

CONTENT QUALITY SIGNALS:
□ Action verbs start each bullet (Led, Developed, Managed, Implemented)
□ Quantified achievements present (%, $, numbers)
□ Results-oriented language (achieved, increased, reduced, delivered)
□ Industry keywords used naturally in sentences

KEYWORD DISTRIBUTION SCORE:
- Count hard skills mentioned: ___
- Count soft skills mentioned: ___
- Ideal ratio: 70% hard / 30% soft
- Actual ratio penalty if >50% soft skills

ANTI-PATTERNS TO DETECT:
□ Keyword stuffing (same word repeated 5+ times)
□ Skills listed without context
□ Generic phrases without specifics ("team player", "hard worker")
□ Buzzwords without substance ("synergy", "leverage", "paradigm")

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
    "workday": "<high|medium|low>",
    "greenhouse": "<high|medium|low>",
    "taleo": "<high|medium|low>",
    "lever": "<high|medium|low>"
  }
}

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
□ atsCompatibility ratings are justified by specific issues
□ All issues have actionable fixes

Respond with ONLY the JSON object. No markdown, no explanations.`;
}

export function generateOptimizedCVValidationPrompt(
  optimizedCVText: string,
  originalIssues: { issue: string; category: string }[],
  originalScore: number
): string {
  return `You are an ATS validation specialist. Your job is to verify that an OPTIMIZED CV has successfully fixed all the issues that were identified.

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

IMPORTANT: Be GENEROUS with scoring. The CV was professionally optimized.
If in doubt about whether something is fixed, give the benefit of the doubt.
The goal is 95-100% for properly optimized CVs.

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
  }
): string {
  const allIssues = [
    ...atsResult.categories.format.issues.map(i => ({ ...i, category: 'format' })),
    ...atsResult.categories.structure.issues.map(i => ({ ...i, category: 'structure' })),
    ...atsResult.categories.keywords.issues.map(i => ({ ...i, category: 'keywords' })),
    ...atsResult.categories.readability.issues.map(i => ({ ...i, category: 'readability' })),
  ];

  return `You are a world-class CV optimization expert. Your ONLY goal is to transform this CV to achieve a PERFECT 95-100% ATS compatibility score.

🎯 TARGET: 95-100% ATS SCORE - ACCEPT NOTHING LESS!

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
✅ EVERY bullet has QUANTIFIED results (%, $, numbers)
✅ Technical skills listed with full names + acronyms: "Amazon Web Services (AWS)"
✅ Industry keywords appear in CONTEXT (not just listed)
✅ Skills grouped: Technical | Soft | Tools

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
FORMULA: [Power Verb] + [Specific Action] + [Metric/Result]

TRANSFORM EXAMPLES (Keep bullets concise - max 120 characters!):
❌ "Responsible for customer service"
✅ "Resolved 50+ customer inquiries daily, achieving 98% satisfaction rating"

❌ "Worked on sales"
✅ "Generated $250K+ revenue by closing 30+ enterprise deals"

❌ "Managed team"
✅ "Led cross-functional team of 8, delivering 15 projects on-time"

❌ "Did marketing"
✅ "Executed 20+ campaigns across 5 channels, driving 150% lead increase"

❌ "Helped with projects"
✅ "Spearheaded 12 initiatives, resulting in $500K savings and 25% efficiency gain"

CRITICAL: Keep bullets SHORT and PUNCHY. One metric per bullet is enough!

POWER VERBS TO USE:
Spearheaded, Orchestrated, Pioneered, Accelerated, Transformed, Championed,
Architected, Delivered, Generated, Achieved, Drove, Optimized, Streamlined,
Launched, Established, Cultivated, Maximized, Revolutionized

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
📊 METRIC ESTIMATION RULES (ADD METRICS EVERYWHERE!)
=============================================================================
If original CV lacks specific numbers, ADD REASONABLE ESTIMATES:

- Customer interactions → "50+", "100+", "200+ daily"
- Team size → "team of 5", "cross-functional teams of 10+"
- Satisfaction → "95%+", "98%", "4.8/5.0 rating"
- Improvement → "25%", "40%", "2x", "3x"
- Revenue/Cost → "$50K+", "$100K+", "$1M+"
- Time savings → "reduced by 30%", "saved 10+ hours weekly"
- Volume → "processed 500+", "managed 1000+"
- Projects → "delivered 15+", "launched 10"

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
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "startDate": "Month YYYY",
      "endDate": "Present",
      "bullets": [
        "Power verb + specific action + quantified result (metric)",
        "Another achievement with numbers/percentages",
        "Third bullet demonstrating measurable impact",
        "Fourth bullet with business outcome"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University Name",
      "location": "City, Country",
      "graduationDate": "Month YYYY",
      "details": "GPA, honors, relevant coursework"
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
      "date": "Month YYYY"
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
  ]
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
□ Job titles in format: "[Title] at [Company]" (NOT "Title | Company")
□ ALL dates in "Month YYYY" format (e.g., "January 2020", NOT "Jan 2020" or "January 20")
□ EVERY bullet starts with power verb
□ EVERY bullet has a metric/number
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
2. Job title format: "[Title] at [Company]" then "[Location] • [Dates]" on next line
3. ALL dates MUST be "Month YYYY" format (e.g., "January 2020", NOT "Jan 2020")
4. Section headers in TITLE CASE: "Professional Experience" (NOT "PROFESSIONAL EXPERIENCE" or "Work Experience")
5. NEVER use all-caps for section headers - ATS systems penalize this!
6. Bullets must be SHORT and PUNCHY (max 120 chars) - if longer, SPLIT into 2 bullets!
7. Every bullet needs ONE clear metric (not 3 metrics in one bullet!)
8. MINIMUM 10 hard skills - if original CV lacks them, ADD relevant ones!
9. MAXIMUM 5 soft skills - cut them down if too many!
10. The optimized CV should score 90-95%. Aim for excellence, not perfection!

Respond with ONLY the JSON object. No markdown, no explanations.`;
}
=======
/**
 * AI Prompts - Main Export File
 *
 * This file re-exports all prompt functions from the modular prompts directory.
 * Individual prompts are organized into separate files for better maintainability.
 *
 * Structure:
 * - prompts/freeSummary.ts     - Quick CV analysis for free users
 * - prompts/proReport.ts       - Detailed analysis for premium users
 * - prompts/cvOptimization.ts  - Generate optimized CVs
 * - prompts/fakeSkills.ts      - Learning path recommendations
 * - prompts/coverLetter.ts     - Personalized cover letters
 * - prompts/scoring.ts         - Systematic match scoring
 * - prompts/atsCheck.ts        - ATS compatibility analysis
 */

// Re-export all prompts from the modular structure
export * from "./prompts/index";
>>>>>>> Stashed changes
