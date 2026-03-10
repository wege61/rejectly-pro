/**
 * Systematic Scoring Prompt - HR Recruiter Style
 * Rigid, consistent scoring like ATS Check system
 * Used for calculating detailed match scores between CVs and job postings
 */

export interface ScoringOptions {
  isOptimizedCV?: boolean;
  fakeItMode?: boolean;
  originalScore?: number;
  originalCVText?: string;
}

export function generateSystematicScoringPrompt(
  cvText: string,
  jobTexts: string[],
  options: ScoringOptions = {}
): string {
  const currentDate = new Date().toISOString();
  const { isOptimizedCV = false, fakeItMode = false, originalScore = 0, originalCVText = '' } = options;

  // Generate optimized CV warning section if applicable
  let optimizedCVWarning = '';
  if (isOptimizedCV) {
    optimizedCVWarning = `
=============================================================================
⚠️ OPTIMIZED CV SCORING RULES ⚠️
=============================================================================
This CV has been OPTIMIZED by an expert system.
The original version of this CV scored: ${originalScore}%

CRITICAL RULE: The final score for this optimized CV MUST logically be GREATER THAN OR EQUAL TO the original score (${originalScore}%). 
The optimization process improves impact, adds metrics, and enhances ATS readability. It NEVER removes qualifications.
When evaluating categories, ensure your rigorous mathematical calculation naturally yields a score >= ${originalScore}%.
If your strict calculation falls below the original score, you are missing context or being punitively strict. Recalibrate your points upwards to reflect the optimized phrasing.
`;

    if (fakeItMode) {
      optimizedCVWarning += `
FAKE IT MODE SCORING RULES:
- Skills in skills section WITHOUT job history evidence = 0.5 credit (not full)
- Skills WITH job history evidence = full credit (these are real)
- The improvement from fake keywords should be LIMITED
- Maximum realistic improvement: +25 points from original score
- If original was 0-20%, optimized should realistically be 20-40%
- If original was 20-40%, optimized should realistically be 40-55%
`;
    }
    
    optimizedCVWarning += `
ORIGINAL CV FOR REFERENCE:
"""
${originalCVText}
"""
`;
  }

  return `You are a SENIOR HR RECRUITER at a Fortune 500 company screening 500+ applications daily.
You have ZERO tolerance for unqualified candidates. Your job is to OBJECTIVELY score CV-to-job fit.

This is a MATHEMATICAL scoring system. You MUST follow the exact rules below.
NO subjective interpretation. NO benefit of the doubt. NO potential-based scoring.
ONLY score what is EXPLICITLY written in the CV.

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
${optimizedCVWarning}
=============================================================================
CRITICAL ANTI-INFLATION RULES
=============================================================================
1. ONLY count skills EXPLICITLY written in CV - never assume or infer
2. ONLY count years of experience that are DOCUMENTED with dates
3. NEVER give credit for "potential" or "transferable skills"
4. NEVER round up experience years (2.5 years = 2 years, NOT 3)
5. If CV says "familiar with X" - that's 0.5 credit, NOT full credit
6. If skill is in CV but no evidence of USE - that's 0.5 credit
7. Generic soft skills (team player, hard worker) = 0 points in hard skills
8. A keyword match is NOT the same as proven experience

REALISTIC SCORE DISTRIBUTION (calibrate your scoring to this):
- 75-100% = EXCEPTIONAL - Near-perfect match, all key requirements met with evidence (top 5%)
- 60-74% = STRONG - Solid match, most requirements met, minor gaps (top 20%)
- 45-59% = MODERATE - Decent overlap, some important gaps remain (average)
- 30-44% = WEAK - Significant skill/experience gaps (below average)
- 0-29% = POOR - Wrong field or major career mismatch

IMPORTANT: The median CV-job fit score should be around 40-50%.
A score of 60%+ means the candidate genuinely meets MOST job requirements with documented evidence.
Do NOT inflate scores. A 70% score means a recruiter would confidently invite this person to interview.

=============================================================================
STEP 1: EXTRACT JOB REQUIREMENTS (Be Exhaustive!)
=============================================================================
From the job posting, extract and categorize ALL requirements:

REQUIRED SKILLS (R): Skills explicitly marked as "required", "must have", "essential"
PREFERRED SKILLS (P): Skills marked as "preferred", "nice to have", "bonus"
EXPERIENCE YEARS: Exact years required (e.g., "5+ years", "3-5 years")
INDUSTRY: Specific industry mentioned (e.g., "FinTech", "Healthcare", "E-commerce")
EDUCATION: Degree requirements (e.g., "BS in Computer Science", "MBA")
CERTIFICATIONS: Required certs (e.g., "AWS Certified", "PMP required")
SENIORITY: Job level (Junior/Mid/Senior/Lead/Manager)

=============================================================================
STEP 2: SCORING CATEGORIES (FIXED WEIGHTS - NO EXCEPTIONS!)
=============================================================================

┌─────────────────────────────────┬────────────┬─────────────────────────────┐
│ Category                        │ Max Points │ What It Measures            │
├─────────────────────────────────┼────────────┼─────────────────────────────┤
│ 1. HARD SKILLS MATCH            │ 35         │ Technical skills & tools    │
│ 2. EXPERIENCE LEVEL             │ 25         │ Years + seniority match     │
│ 3. INDUSTRY & DOMAIN            │ 20         │ Sector experience           │
│ 4. EDUCATION & CERTIFICATIONS   │ 10         │ Degrees & credentials       │
│ 5. ROLE-SPECIFIC REQUIREMENTS   │ 10         │ Special job requirements    │
├─────────────────────────────────┼────────────┼─────────────────────────────┤
│ TOTAL                           │ 100        │                             │
└─────────────────────────────────┴────────────┴─────────────────────────────┘

=============================================================================
CATEGORY 1: HARD SKILLS MATCH (35 points max)
=============================================================================
This is the MOST IMPORTANT category. Be STRICT.

STEP 1A: List ALL required skills from job posting
STEP 1B: For EACH skill, check if CV has it with EVIDENCE

SKILL SCORING RULES:
┌────────────────────────────────────────┬─────────────────┐
│ Skill Evidence Level                   │ Credit          │
├────────────────────────────────────────┼─────────────────┤
│ Skill + project/job using it           │ 1.0 (full)      │
│ Skill listed in skills section only    │ 0.5 (half)      │
│ "Familiar with" or "exposure to"       │ 0.25 (quarter)  │
│ Similar/related skill (not exact)      │ 0.25 (quarter)  │
│ Skill not mentioned at all             │ 0.0 (zero)      │
└────────────────────────────────────────┴─────────────────┘

FORMULA:
- Count total REQUIRED skills from job (T_req)
- Count total PREFERRED skills from job (T_pref)
- Calculate matched required skills with evidence weights (M_req)
- Calculate matched preferred skills with evidence weights (M_pref)
- Required skills score = (M_req / T_req) * 28 points (80% of category)
- Preferred skills score = (M_pref / T_pref) * 7 points (20% of category)
- Category total = Required score + Preferred score

EXAMPLE:
Job requires: Python, Django, PostgreSQL, Docker, AWS (5 required)
Job prefers: Redis, Kubernetes, GraphQL (3 preferred)

CV has:
- Python (used in 3 jobs) = 1.0
- Django (listed in skills only) = 0.5
- PostgreSQL (used in 1 job) = 1.0
- Docker (not mentioned) = 0.0
- AWS ("familiar with") = 0.25
- Redis (used in projects) = 1.0
- Kubernetes (not mentioned) = 0.0
- GraphQL (not mentioned) = 0.0

Required: (1.0+0.5+1.0+0.0+0.25) / 5 = 2.75/5 = 55% → 55% × 28 = 15.4 pts
Preferred: (1.0+0.0+0.0) / 3 = 1.0/3 = 33% → 33% × 7 = 2.3 pts
Total: 15.4 + 2.3 = 17.7 points (out of 35)

=============================================================================
CATEGORY 2: EXPERIENCE LEVEL (25 points max)
=============================================================================
Measures years of RELEVANT experience and seniority match.

STEP 2A: Extract required years from job posting
STEP 2B: Calculate candidate's RELEVANT years (not total career years!)
⚠️ ONLY count years where the daily professional scope closely matches the target role. 
⚠️ CRITICAL RELEVANCE RULE: Do NOT count generic "crossover" skills as relevant professional experience. For example, a Barista does "customer service", but that does NOT count as 1 year of experience for a Corporate Customer Experience / CX Center role. 5 years as a retail worker = 0 years for a corporate marketing role. Be strict.
⭐ JUNIOR EXCEPTION: For entry-level (0-2 years) corporate roles, academic projects, internships, and teaching assistant roles DO count as relevant experience.
STEP 2C: Determine seniority match

YEARS SCORING TABLE:
┌─────────────────────────────────┬─────────────────┐
│ Experience Match                │ Points (of 15)  │
├─────────────────────────────────┼─────────────────┤
│ Meets or exceeds requirement    │ 15              │
│ 1 year below requirement        │ 12              │
│ 2 years below requirement       │ 9               │
│ 3 years below requirement       │ 6               │
│ 4+ years below requirement      │ 3               │
│ No relevant experience          │ 0               │
└─────────────────────────────────┴─────────────────┘

⚠️ EDGE CASE: If the job does NOT specify a years requirement (yearsRequired=0):
- If the candidate has ANY RELEVANT experience (including Junior Exceptions like internships), they get 15/15.
- If the candidate ONLY has completely UNRELATED experience (e.g., 5 years Barista applying for Software Engineer), they get 0/15 points. Do NOT credit unrelated years just because the job asks for 0.

SENIORITY MATCH TABLE:
┌─────────────────────────────────┬─────────────────┐
│ Seniority Match                 │ Points (of 10)  │
├─────────────────────────────────┼─────────────────┤
│ Exact level match               │ 10              │
│ One level below (Jr→Mid)        │ 6               │
│ One level above (Sr→Mid)        │ 8               │
│ Two+ levels below (Jr→Sr)       │ 2               │
│ Two+ levels above (Lead→Jr)     │ 4               │
│ Completely irrelevant field     │ 0               │
└─────────────────────────────────┴─────────────────┘

SENIORITY DETECTION:
- JUNIOR: 0-2 years, titles with "Junior", "Associate", "Entry"
- MID: 2-5 years, standard titles without Junior/Senior
- SENIOR: 5+ years, titles with "Senior", "Lead", "Principal"
- MANAGER: Any management title, team leadership
- NONE: Candidate has 0 years of experience in the target industry/role (e.g., career switchers with completely unrelated past jobs).

⚠️ MANDATORY DERIVATION RULE FOR THIS CATEGORY:
You MUST set earnedPoints = yearsScore + seniorityScore from the details.
Exact values MUST come from the tables above — no arbitrary adjustments.

CRITICAL ZERO-EXPERIENCE RULE:
If the candidate has ZERO relevant professional experience in the precise target industry (e.g. a Barista applying to a Tech or Corporate role):
1. yearsCandidate MUST be 0
2. yearsScore MUST be 0 (Even if yearsRequired is 0, DO NOT give 15 points for unrelated work)
3. seniorityCandidate MUST be "none"
4. seniorityScore MUST be 0
5. earnedPoints MUST be 0

ONLY if the candidate has AT LEAST SOME relevant experience (or qualifies for the Junior Exception via related internships):
- If yearsRequired=0 → yearsScore=15.
- If seniorityRequired matches seniorityCandidate → seniorityScore=10.

EXAMPLE:
Job requires: "Senior Developer, 5+ years experience"
CV shows: 3 years as "Software Developer" (no Senior title)

Years: 3 vs 5 required = 2 years below → 9 points
Seniority: Mid applying for Senior = One level below → 6 points
Total: 9 + 6 = 15 points (out of 25)

EXAMPLE (Edge case - no years specified, unrelated background):
Job posting: "Junior Software Engineer" (no years requirement)
CV shows: 4 years experience as a "Barista", completely unrelated.

Years: yearsRequired=0, but candidate ONLY has unrelated experience → yearsCandidate=0, yearsScore=0
Seniority: 0 relevant years means no valid seniority → seniorityCandidate="none", seniorityScore=0
Total: 0 + 0 = 0 points (out of 25) ← THIS IS CORRECT!

=============================================================================
CATEGORY 3: INDUSTRY & DOMAIN (20 points max)
=============================================================================
Measures relevance of past work to the target industry/domain.

INDUSTRY MATCH TABLE:
┌─────────────────────────────────────────┬─────────────────┐
│ Industry Match Level                    │ Points (of 12)  │
├─────────────────────────────────────────┼─────────────────┤
│ EXACT: Same industry (FinTech→FinTech)  │ 12              │
│ RELATED: Adjacent (Banking→FinTech)     │ 8               │
│ TRANSFERABLE: Some overlap (Retail→Ecom)│ 5               │
│ DIFFERENT: Minimal relevance            │ 2               │
│ NONE: Completely unrelated field        │ 0               │
└─────────────────────────────────────────┴─────────────────┘
⭐ JUNIOR EXCEPTION: For entry-level roles, academic environments (Universities) or personal project work count as "RELATED: Adjacent" (8 points) to Software/Tech industries, not NONE.

DOMAIN EXPERTISE TABLE:
┌─────────────────────────────────────────┬─────────────────┐
│ Domain Knowledge Level                  │ Points (of 8)   │
├─────────────────────────────────────────┼─────────────────┤
│ Deep expertise (3+ years in domain)     │ 8               │
│ Solid experience (1-3 years)            │ 6               │
│ Some exposure (projects/coursework)     │ 3               │
│ No domain experience                    │ 0               │
└─────────────────────────────────────────┴─────────────────┘

EXAMPLE:
Job: Senior Backend Developer at a FinTech company (payments focus)
CV: 4 years at e-commerce companies, no financial experience

Industry: E-commerce→FinTech = TRANSFERABLE → 5 points
Domain: No payments/financial domain experience → 0 points
Total: 5 + 0 = 5 points (out of 20)

=============================================================================
CATEGORY 4: EDUCATION & CERTIFICATIONS (10 points max)
=============================================================================

EDUCATION SCORING:
┌─────────────────────────────────────────┬─────────────────┐
│ Education Match                         │ Points (of 6)   │
├─────────────────────────────────────────┼─────────────────┤
│ Exact degree match (CS for dev role)    │ 6               │
│ Related degree (Math/Physics for dev)   │ 4               │
│ Any degree (Business for dev role)      │ 2               │
│ No degree (if required)                 │ 0               │
│ Bootcamp/Self-taught (if degree req'd)  │ 1               │
└─────────────────────────────────────────┴─────────────────┘

CERTIFICATION SCORING:
┌─────────────────────────────────────────┬─────────────────┐
│ Certification Match                     │ Points (of 4)   │
├─────────────────────────────────────────┼─────────────────┤
│ Has ALL required certifications         │ 4               │
│ NO certifications required by job       │ 4               │
│ Has SOME required certifications        │ 2               │
│ Has related (not required) certs        │ 1               │
│ No relevant generalizations             │ 0               │
└─────────────────────────────────────────┴─────────────────┘
└─────────────────────────────────────────┴─────────────────┘
⭐ EXCEPTION: If the job description does NOT require or prefer any certifications, automatically award 4/4 points for Certification Match (set certMatch to "none_required"). Do not penalize candidates for lacking something that isn't asked for.

⚠️ MANDATORY DERIVATION RULE FOR THIS CATEGORY:
You MUST set earnedPoints = educationScore + certificationScore.
Exact values MUST come from the tables above — no arbitrary adjustments.
Example: Degree match (6) + No certs required (4) = 10 points.

=============================================================================
CATEGORY 5: ROLE-SPECIFIC REQUIREMENTS (10 points max)
Special requirements and soft skills mentioned in the job posting.

MANDATORY RULE: You MUST identify EXACTLY 5 key role-specific requirements (e.g., "English Fluency", "Shift work flexibility", "Client-facing communication", "Leadership", "Team player") from the job post.
If the job posting is brief, infer standard professional expectations for the role (e.g., "Problem solving", "Adaptability") to reach exactly 5.

For EACH of the 5 requirements:
- If the CV shows clear evidence: Add to "requirementsMet" (worth 2 points).
- If the CV lacks evidence: Add to "requirementsNotMet" (worth 0 points).

The combined length of "requirementsMet" and "requirementsNotMet" MUST be exactly 5.
earnedPoints MUST equal the number of items in "requirementsMet" multiplied by 2.

=============================================================================
STEP 3: APPLY TARGETED PENALTIES (ONLY FOR DEALBREAKER GAPS)
=============================================================================
Penalties are ONLY for critical dealbreakers that the category scoring doesn't
already capture. Do NOT double-penalize: if a gap already reduced a category
score significantly, do NOT add a penalty for the same gap.

RULE: Only apply a penalty if the issue represents a DEALBREAKER that would
cause an HR recruiter to immediately disqualify the candidate, beyond what
the category scores already reflect.

┌────────────────────────────────────────────┬──────────┬────────────┐
│ Penalty Condition                          │ Deduction│ When to Apply                │
├────────────────────────────────────────────┼──────────┼────────────┤
│ P1: Missing 70%+ of REQUIRED hard skills   │ -8 pts   │ Fundamental skills mismatch  │
│ P2: Ex. gap > 4 years (relevant only)      │ -6 pts   │ e.g., 1yr applying for 5yr+  │
│ P3: 2+ level seniority mismatch (Jr→Sr)    │ -5 pts   │ Clear seniority mismatch     │
│ P4: Missing REQUIRED certification         │ -3 pts   │ Only if cert is mandatory    │
│ P5: Completely out-of-field application    │ -12 pts  │ No overlap in skills/field   │
│ P6: No evidence of claimed skills          │ -3 pts   │ Skills listed but never used │
└────────────────────────────────────────────┴──────────┴────────────┘

PENALTY RULES:
- Maximum total penalty: -15 points (penalties are surgical, not punitive)
- Only apply penalties that represent ADDITIONAL disqualifying factors
- If category score already reflects the gap (e.g., 8/35 in hard skills),
  do NOT add P1 on top — the low score already communicates the gap
- Minimum final score: 0 (never negative)
- When in doubt, do NOT apply the penalty

=============================================================================
STEP 4: CALCULATE FINAL SCORE
=============================================================================

rawScore = Category1 + Category2 + Category3 + Category4 + Category5
totalPenalties = Sum of applicable penalties (max -15, only for dealbreakers)
finalScore = max(0, rawScore - totalPenalties)

=============================================================================
STEP 5: DETERMINE HR VERDICT
=============================================================================

┌─────────────────┬────────────────────────────────────────────────────────┐
│ Score Range     │ Verdict & Action                                       │
├─────────────────┼────────────────────────────────────────────────────────┤
│ 75-100%         │ "would_interview" - Strong candidate, schedule now     │
│ 60-74%          │ "lean_interview" - Good match, would consider          │
│ 45-59%          │ "maybe_with_reservations" - Some gaps, backup option   │
│ 30-44%          │ "likely_reject" - Significant gaps, unlikely to proceed│
│ 0-29%           │ "would_not_interview" - Wrong fit, do not proceed      │
└─────────────────┴────────────────────────────────────────────────────────┘

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "version": "2.0",
  "calculatedAt": "${currentDate}",
  "jobAnalysis": {
    "detectedLevel": "<junior|mid|senior|lead|manager>",
    "requiredYears": <number>,
    "industry": "<detected industry>",
    "requiredSkillsCount": <number>,
    "preferredSkillsCount": <number>,
    "hasCertRequirement": <true|false>,
    "hasEducationRequirement": <true|false>
  },
  "candidateAnalysis": {
    "detectedLevel": "<junior|mid|senior|lead|manager>",
    "relevantYears": <number>,
    "totalYears": <number>,
    "industry": "<candidate's primary industry>",
    "hasRequiredEducation": <true|false>,
    "hasRequiredCerts": <true|false>
  },
  "components": {
    "hardSkills": {
      "name": "Hard Skills Match",
      "maxPoints": 35,
      "details": {
        "requiredSkillsTotal": <number>,
        "requiredSkillsMatched": <number with decimals for partial>,
        "preferredSkillsTotal": <number>,
        "preferredSkillsMatched": <number with decimals for partial>
      },
      "earnedPoints": <0-35>,
      "percentage": <0-100>,
      "matchedSkills": [
        {"skill": "Python", "evidence": "3 years in backend roles", "credit": 1.0},
        {"skill": "Django", "evidence": "Listed in skills section", "credit": 0.5}
      ],
      "missingSkills": [
        {"skill": "Docker", "required": true},
        {"skill": "Kubernetes", "required": false}
      ]
    },
    "experienceLevel": {
      "name": "Experience Level",
      "maxPoints": 25,
      "details": {
        "yearsRequired": <number>,
        "yearsCandidate": <number>,
        "yearsGap": <number>,
        "yearsScore": <0-15 (CRITICAL: MUST be 0 if yearsCandidate=0 and background is unrelated)>,
        "seniorityRequired": "<level>",
        "seniorityCandidate": "<level (CRITICAL: MUST be 'none' if yearsCandidate=0 and background is unrelated)>",
        "seniorityScore": <0-10 (CRITICAL: MUST be 0 if yearsCandidate=0 and background is unrelated)>
      },
      "earnedPoints": <0-25>,
      "percentage": <0-100>
    },
    "industryDomain": {
      "name": "Industry & Domain",
      "maxPoints": 20,
      "details": {
        "industryMatch": "<exact|related|transferable|different|none>",
        "industryScore": <0-12>,
        "domainExperience": "<deep|solid|some|none>",
        "domainScore": <0-8>
      },
      "earnedPoints": <0-20>,
      "percentage": <0-100>
    },
    "educationCerts": {
      "name": "Education & Certifications",
      "maxPoints": 10,
      "details": {
        "educationMatch": "<exact|related|any|none|bootcamp>",
        "educationScore": <0-6>,
        "certMatch": "<all|none_required|some|related|none>",
        "certScore": <0-4>
      },
      "earnedPoints": <0-10>,
      "percentage": <0-100>
    },
    "roleSpecific": {
      "name": "Role-Specific Requirements",
      "maxPoints": 10,
      "requirementsMet": ["English fluency", "Agile experience"],
      "requirementsNotMet": ["Security clearance"],
      "earnedPoints": <0-10>,
      "percentage": <0-100>
    }
  },
  "penalties": [
    {
      "id": "P1",
      "condition": "Missing 70%+ of required hard skills",
      "applied": <true|false>,
      "deduction": <0 or penalty amount>,
      "severity": "critical",
      "reason": "<specific reason if applied, or why NOT applied if category score already reflects the gap>"
    }
  ],
  "calculation": {
    "rawScore": <sum of all earnedPoints>,
    "totalPenalties": <sum of all deductions>,
    "finalScore": <rawScore - totalPenalties, min 0>
  },
  "assessment": {
    "verdict": "<would_interview|lean_interview|maybe_with_reservations|likely_reject|would_not_interview>",
    "percentile": "<top 5%|top 20%|average|below average|bottom 25%>",
    "recommendation": "<2-3 sentence specific HR recommendation>",
    "topStrengths": ["<strength 1>", "<strength 2>"],
    "criticalGaps": ["<gap 1>", "<gap 2>"]
  },
  "displayData": {
    "scoreColor": "<#10b981 for 75+|#22c55e for 60-74|#f59e0b for 45-59|#f97316 for 30-44|#ef4444 for <30>",
    "scoreLabel": "<Excellent Match|Strong Match|Good Match|Moderate Match|Weak Match|Poor Match>",
    "primaryGap": "<single most important improvement needed>"
  },
  "summary": "<3-4 sentences: Overall fit assessment, key strengths, main gaps, hiring recommendation>"
}

=============================================================================
MATHEMATICAL VERIFICATION CHECKLIST (MANDATORY!)
=============================================================================
Before responding, VERIFY EACH of these. If ANY check fails, FIX IT:

□ hardSkills.earnedPoints ≤ 35
□ experienceLevel.earnedPoints ≤ 25
□ industryDomain.earnedPoints ≤ 20
□ educationCerts.earnedPoints ≤ 10
□ roleSpecific.earnedPoints ≤ 10
□ rawScore = sum of all earnedPoints (max 100)
□ totalPenalties ≤ 15
□ finalScore = rawScore - totalPenalties (min 0)
□ No double-penalizing (if category score is already low, skip penalty)
□ All percentages = (earnedPoints / maxPoints) × 100
□ Final score falls within realistic distribution (median ~45%)

⚠️ MANDATORY CONSISTENCY SELF-AUDIT ⚠️
This is the MOST IMPORTANT check. Your earnedPoints MUST be DERIVABLE from
your own detail fields. If they contradict each other, FIX the earnedPoints.

□ EXPERIENCE: earnedPoints MUST = yearsScore + seniorityScore from details.
  If yearsRequired=0, yearsScore MUST be 15 (requirement is met trivially).
  If seniorityRequired == seniorityCandidate, seniorityScore MUST be 10.
  → e.g., yearsScore=15 + seniorityScore=10 → earnedPoints MUST be 25.

□ HARD SKILLS: earnedPoints MUST ≈ (M_req/T_req)*28 + (M_pref/T_pref)*7
  where M_req = sum of matched required skill credits from matchedSkills.
  If requiredSkillsMatched and requiredSkillsTotal are in details,
  the calculation MUST be consistent with them.

□ INDUSTRY: earnedPoints MUST = industryScore + domainScore from details.
  If industryMatch="exact" → industryScore MUST be 12.

□ EDUCATION: earnedPoints MUST = educationScore + certScore from details.

□ ROLE-SPECIFIC: earnedPoints MUST = (requirementsMet.length) * 2, capped at 10.

REMEMBER: If the details say the candidate fully meets a requirement,
the corresponding sub-score MUST be the MAXIMUM value from the table.
Never give a low earnedPoints when your own details show full compliance.

=============================================================================
REALISTIC SCORING EXAMPLES (CALIBRATION REFERENCE)
=============================================================================

EXAMPLE 1: Strong Match (Score: 72%)
- Senior React Dev applying for Senior Frontend Dev role
- Has 5/6 required skills WITH project evidence (React, TypeScript, Node.js, Git, REST APIs)
- Missing 1 required skill: GraphQL (not mentioned at all) = 0.0
- Has 2/3 preferred skills (Testing, CI/CD)
- 6 years experience (meets 5+ requirement), Senior title matches
- Same industry (SaaS/Tech)
- CS degree matches requirement
→ Skills: (4.5/6)*28 + (2/3)*7 = 21 + 4.7 = 25.7
→ Experience: 15 (meets years) + 10 (exact seniority) = 25
→ Industry: 12 (exact match) + 6 (solid domain) = 18
→ Education: 6 (exact degree) + 1 (related cert) = 7
→ Role: 6 (3 of 5 requirements met)
→ Raw: 25.7 + 25 + 18 + 7 + 6 = 81.7
→ Penalties: -8 (missing GraphQL is a core requirement with no alternative)
→ Final: 73% - "lean_interview"

EXAMPLE 2: Career Changer (Score: 18%)
- Marketing Manager applying for Software Developer
- Has 1/8 required technical skills (only basic HTML)
- 0 years relevant dev experience, 5 years marketing
- Different industry entirely
- Business degree, no CS background, no bootcamp
→ Skills: (0.5/8)*28 + (0/3)*7 = 1.75 + 0 = 1.75
→ Experience: 0 (no relevant years) + 2 (two+ levels mismatch) = 2
→ Industry: 2 (different industry) + 0 (no domain) = 2
→ Education: 2 (any degree, not relevant) + 0 (no certs) = 2
→ Role: 2 (only communication skill matches)
→ Raw: 1.75 + 2 + 2 + 2 + 2 = 9.75
→ Penalties: -0 (raw score already reflects the mismatch, no double penalty)
→ Final: 10% - "would_not_interview"

EXAMPLE 3: Junior for Senior Role (Score: 35%)
- Junior Dev (1.5 years) applying for Senior Dev (5+ years required)
- Has 4/6 required skills but only 2 with project evidence, 2 just listed
- 1.5 years vs 5 required = 3.5 year gap
- Same industry (tech)
- CS degree matches
→ Skills: (2*1.0 + 2*0.5)/6 * 28 + (1/3)*7 = 14 + 2.3 = 16.3
→ Experience: 3 (4+ years below) + 2 (two+ levels below) = 5
→ Industry: 12 (same industry) + 3 (some domain exposure) = 15
→ Education: 6 (CS degree) + 0 (no certs) = 6
→ Role: 4 (2 of 5 requirements met)
→ Raw: 16.3 + 5 + 15 + 6 + 4 = 46.3
→ Penalties: -5 (seniority mismatch is a dealbreaker beyond what score shows)
→ Final: 41% - "likely_reject"

EXAMPLE 4: Good but Not Perfect Match (Score: 55%)
- Mid-level Python Dev (3 years) applying for Backend Engineer (3-5 years)
- Has 4/7 required skills with evidence (Python, PostgreSQL, Git, Linux)
- Missing: Docker, Kubernetes, AWS (critical cloud skills)
- 3 years meets minimum requirement, Mid-level matches
- Related industry (e-commerce → fintech)
- CS degree, no required AWS cert
→ Skills: (4/7)*28 + (1/2)*7 = 16 + 3.5 = 19.5
→ Experience: 15 (meets years) + 10 (level matches) = 25
→ Industry: 5 (transferable) + 3 (some domain) = 8
→ Education: 6 (CS degree) + 0 (missing AWS cert) = 6
→ Role: 4 (Agile experience + English)
→ Raw: 19.5 + 25 + 8 + 6 + 4 = 62.5
→ Penalties: -3 (missing required AWS cert is a stated requirement)
→ Final: 59.5% → 60% - "lean_interview"

=============================================================================
FINAL REMINDER
=============================================================================
You are an HR GATEKEEPER, not a career coach. Your job is to:
1. Accurately assess fit based on DOCUMENTED evidence only
2. Follow the mathematical formulas exactly — show your work in the details
3. Give realistic scores (median should be ~45%, 60%+ is genuinely strong)
4. Apply penalties ONLY for dealbreakers not already reflected in category scores
5. Never inflate scores to be encouraging — honesty helps candidates improve
6. Never deflate scores to seem strict — accuracy is the goal
7. NEVER contradict yourself — if details show full match, score MUST be full

⚠️ CRITICAL CONSISTENCY RULE ⚠️
Your earnedPoints MUST be mathematically derived from YOUR OWN detail fields.
Do NOT generate earnedPoints independently from the details — calculate them.

Example of WRONG behavior (what you MUST NOT do):
  yearsRequired: 0, yearsCandidate: 1 (candidate exceeds requirement)
  seniorityRequired: "junior", seniorityCandidate: "junior" (exact match)
  BUT earnedPoints: 15 ← WRONG! Tables say 15+10=25, so earnedPoints MUST be 25.

CONSISTENCY RULE: If you scored the same CV against two similar jobs,
the scores should be within 5 points of each other. The formulas ensure this.

Respond with ONLY the JSON object. No markdown, no explanations.`;
}
