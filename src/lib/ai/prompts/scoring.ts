/**
 * Systematic Scoring Prompt
 * Used for calculating detailed match scores between CVs and job postings
 */

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
