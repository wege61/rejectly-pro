/**
 * CV Optimization Prompts
 * Used for generating optimized CVs and analyzing optimization results
 */

// Language-specific writing conventions for CV text.
const LANGUAGE_STYLE: Record<string, string> = {
  English: `- Bullets start with a past-tense action verb ("Led", "Built"); the current role may use present tense.
- Summary: no pronouns ("Product manager with 6 years...").`,
  Turkish: `- Bullets use first-person past tense without a pronoun ("Yönettim", "Geliştirdim", "Hazırladım") or a noun phrase ("Kampanya yönetimi ve bütçe planlaması"). Never third person ("yönetti", "geliştirdi").
- Summary: noun-phrase style with no conjugated third-person verbs ("6 yıllık deneyime sahip dijital pazarlama uzmanı. Aylık 400.000 TL bütçeli kampanya yönetimi ve ROAS optimizasyonu deneyimi."). Never "yönetti", "artırdı".
- Use Turkish number formatting as in the original (400.000 TL, %140, 3,2).`,
  German: `- Bullets use noun style or past tense without pronouns ("Leitung eines Teams von 8 Entwicklern", "Entwickelte ...").`,
};

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
  additionalTools: string[] = [],
  extractedMetrics: string[] = [],
  achievementsSection: string = '',
  outputLanguage: string = 'English',
  userProvidedMetrics?: Record<string, string>,
  academicDetails?: { gpa?: string; coursework?: string; capstone?: string; }
): string {
  const hasAcademic = !!(academicDetails && (academicDetails.gpa || academicDetails.coursework || academicDetails.capstone));

  const extraInputs: string[] = [];

  if (userProvidedMetrics && Object.keys(userProvidedMetrics).length > 0) {
    extraInputs.push(`USER-PROVIDED METRICS (the candidate answered our questions; these are facts you MUST work into the matching bullets):
${Object.entries(userProvidedMetrics).map(([id, answer]) => `- ${id}: ${answer}`).join('\n')}`);
  }

  if (additionalTools.length > 0) {
    extraInputs.push(`USER-CONFIRMED TOOLS (the candidate confirmed real experience with these):
${additionalTools.map(tool => `- ${tool}`).join('\n')}
Add each to skills.technical. Also mention each in ONE bullet whose described work plausibly used it; never invent a new task to host a tool.`);
  }

  if (hasAcademic) {
    extraInputs.push(`ACADEMIC DETAILS PROVIDED BY THE CANDIDATE:
${academicDetails!.gpa ? `- GPA / grade: ${academicDetails!.gpa}\n` : ''}${academicDetails!.coursework ? `- Relevant coursework: ${academicDetails!.coursework}\n` : ''}${academicDetails!.capstone ? `- Capstone / major project: ${academicDetails!.capstone}\n` : ''}${academicDetails!.gpa || academicDetails!.coursework ? '- Put GPA and coursework in the "details" field of the matching education entry.\n' : ''}${academicDetails!.capstone ? '- Add the capstone as a "projects" entry. For a solo academic project use a neutral role ("Individual Academic Project") or null; never "Project Manager" or "Lead" unless they said they led a team.\n' : ''}- Use only these details; do not embellish them.`);
  }

  if (extractedMetrics.length > 0 || achievementsSection) {
    extraInputs.push(`FACTS WE DETECTED IN THE ORIGINAL (all must survive):
${extractedMetrics.map(m => `- ${m}`).join('\n')}${achievementsSection ? `\nAchievements section:\n${achievementsSection}\nPlace each achievement as a bullet under the role where it happened (or the most recent role if unclear).` : ''}`);
  }

  const style = LANGUAGE_STYLE[outputLanguage] || `- Follow the normal CV conventions of ${outputLanguage}: no first-person pronouns, concise action-oriented bullets.`;

  return `You are an expert CV writer. Rewrite the candidate's CV so it presents their REAL experience as clearly and persuasively as possible for the target job.

Your work is judged on three things, in this order of priority:
1. TRUTH — nothing in the output that the candidate did not tell us.
2. COMPLETENESS — nothing the candidate told us is lost.
3. QUALITY — clear, specific, well-ordered, tailored to the job.
Never trade a higher priority for a lower one.

## 1. Truth rules
- Facts are fixed: employers, job titles, dates, degrees, institutions, certifications and every number stay as the candidate gave them.
- Never invent numbers, percentages, amounts, team sizes, durations, tools, duties, projects, outcomes or context. If a bullet has no metric, write it without one.
- Context and scope may only come from the ORIGINAL CV, never from the job posting: the candidate did not work at the hiring company.
- Never add a skill or keyword because the job asks for it. A requirement the candidate doesn't meet stays unmet.
- Use the job posting's vocabulary only for things the candidate actually did (CV "state handling" + job "state management" → "state management").
- Match verbs to the real scope: "helped/assisted" must not become "led/spearheaded"; nobody "architected" or "pioneered" anything the CV doesn't say they led.
- "X years of experience" claims must be computed from the dates of RELEVANT roles. If unsure, leave the number out. Unrelated jobs (e.g. barista for a data role) don't count.
- Unrelated jobs stay honest and short: never add target-field words (design, data, marketing) to a cashier or barista role.

## 2. Completeness rules
- Every fact from every original bullet must appear in the output: each number, metric, award, team size, scope, tool and achievement. You may merge two bullets about the same work or reorder them, but you may not drop a fact. If a role has many bullets, keep them all.
- Copy every monetary amount and metric exactly, including currency symbols and units ($12M, £8,000, 400.000 TL, %140).
- Keep every certification/course/license/award as its own "certifications" entry (name and issuer separated).
- Keep every spoken language in "languages". Put the proficiency only if the CV states it; otherwise use an empty string. Spoken languages do not go in skills.
- Keep leadership, volunteering, societies and extracurricular roles as separate "leadership" entries with their own bullets.
- Keep personal projects as "projects" entries.
- Use everything the CV says, wherever it appears: a thesis/dissertation line under education, a one-line project description, a tool listed only in skills.
- Completeness covers achievements, metrics, scope, tools and responsibilities. Pure filler that carries no information (e.g. "Went to meetings with the team") may be merged into another bullet or dropped.
- skills.technical: every hard skill and tool from the original CV (plus user-confirmed tools), most job-relevant first. No padding with generic phrases ("Bug Fixing", "Team Meetings", "Code Writing"). skills.soft: at most 4 that the CV supports.

## 3. Quality rules
- Summary: 2-4 sentences. Lead with the role and real experience, then 2-3 concrete achievements from the CV, then the skills most relevant to the job. No clichés ("passionate", "hardworking", "eager to", "team player", "results-driven"), no first person.
- Bullets: one idea each, specific, at most ~150 characters, complete sentences. Lead with what was done and its result. Put the bullets most relevant to the target job first within each role.
- Rewrite EVERY bullet in professional language. Casual or vague phrasing from the original must not survive: improve the wording, keep the facts.
  "Fixed bugs when people complained" → "Resolved user-reported bugs"
  "Helped the boss figure out database stuff" → "Supported the manager with database troubleshooting"
  "Made the interface look better" → "Improved the app's user interface"
  "Used XGBoost, pandas" (project) → "Built a UK house-price prediction model with XGBoost, pandas and scikit-learn" (using the project's own description)
- Describe the candidate as what they are. A graduate is "Economics graduate", not "Data Analyst"; only use the target job's title if they have held that role.
- Clean up informal wording without changing facts: "Got a degree in IT" → degree "Degree in Information Technology"; a slang job title like "IT Guy" or "Coder" may become the closest neutral standard title ("IT Support", "Software Developer"), never a more senior one. Proper job titles are kept exactly.
- Do not repeat the same sentence in the summary and in a bullet.

## 4. Format rules
- Write every text value in ${outputLanguage}. JSON keys stay in English.
${style}
- Do not translate or transliterate the candidate's name, email, phone, URLs, company names or product names.
- Locations: keep the same places as the original, with city/country names written in ${outputLanguage} ("İstanbul, Türkiye" → "Istanbul, Turkey" in English). Never add a location the CV doesn't give: use an empty string.
- Dates: keep the precision of the original. Month + year → month name in ${outputLanguage} + year ("Mart 2022", "March 2022"). Year only → just the year ("2019"); never invent a month. Ongoing role → the English word "Present" (we localize it). No date, or a vague one ("a while ago", "recently") → empty string. Never output placeholders like "Month YYYY". education[].graduationDate is the single graduation/end date, not a range.
- Experience in reverse chronological order (current role first).
- education[].details: only GPA/coursework the candidate gave${hasAcademic ? ' (see ACADEMIC DETAILS)' : ''}; otherwise null. Never invent a GPA or coursework, never use placeholders.
- isEntryLevel: true if the candidate is a student/recent graduate or has no relevant professional experience; otherwise false.

## Original CV
"""
${cvText}
"""

## Target job posting${jobTexts.length > 1 ? 's' : ''}
${jobTexts.map((text, i) => `${jobTexts.length > 1 ? `Job ${i + 1}:\n` : ''}"""
${text}
"""`).join('\n\n')}
${analysisResults.rewrittenBullets && analysisResults.rewrittenBullets.length > 0 ? `
## Earlier analysis notes (suggestions only; the truth rules win)
- Suggested bullet rewrites: ${analysisResults.rewrittenBullets.join(' | ')}` : ''}${analysisResults.atsFlags && analysisResults.atsFlags.length > 0 ? `
- ATS tips: ${analysisResults.atsFlags.join(' | ')}` : ''}
${extraInputs.length > 0 ? `
## Additional inputs
${extraInputs.join('\n\n')}
` : ''}
## Before you answer
Check: every number in your output appears in the inputs above; every fact from every original bullet is in your output; nothing comes from the job posting that the candidate didn't state; all text is in ${outputLanguage}.

Return only the JSON object.`;
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
