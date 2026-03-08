/**
 * Interview Preparation Prompts
 * Generates likely interview questions and answer frameworks based on
 * the candidate's REAL CV data and the ACTUAL job posting requirements.
 */

export function generateInterviewPrepPrompt(
  cvText: string,
  jobTexts: string[],
  missingKeywords: string[],
  scoreBreakdown: {
    fitScore: number;
    weakCategories?: string[];
  }
): string {
  return `You are a senior hiring manager preparing interview questions for a specific candidate applying to a specific role.

=============================================================================
CANDIDATE'S CV (SOURCE OF TRUTH FOR ANSWER SUGGESTIONS)
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
CANDIDATE ANALYSIS CONTEXT
=============================================================================
- Match Score: ${scoreBreakdown.fitScore}%
- Missing Keywords/Skills: ${missingKeywords.length > 0 ? missingKeywords.join(", ") : "None"}
${scoreBreakdown.weakCategories && scoreBreakdown.weakCategories.length > 0 ? `- Weak Areas: ${scoreBreakdown.weakCategories.join(", ")}` : ""}

=============================================================================
CRITICAL ANTI-HALLUCINATION RULES
=============================================================================
- Questions MUST be derived from ACTUAL requirements in the job posting
- Answer suggestions MUST reference REAL experiences from the candidate's CV
- If the CV doesn't contain relevant experience for an answer, say "Draw from your experience with [closest relevant thing in CV]" — do NOT invent experiences
- Technical questions must target skills ACTUALLY mentioned in the job posting
- Gap warnings must only flag skills that are ACTUALLY missing (from the missing keywords list)
- NEVER fabricate company names, project names, or achievements not in the CV

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "behavioral": [
    {
      "question": "<likely behavioral question derived from job posting requirements>",
      "why": "<1 sentence: why this question is likely for THIS specific role>",
      "answerFramework": {
        "situation": "<specific situation from CV the candidate can reference>",
        "task": "<the challenge or responsibility from that situation>",
        "action": "<what the candidate did, based on CV evidence>",
        "result": "<outcome/metric from CV, or reasonable framing if no metric>"
      }
    }
  ],
  "technical": [
    {
      "question": "<technical question based on required skills in job posting>",
      "why": "<1 sentence: which job requirement this targets>",
      "preparation": "<specific advice: what to review, based on candidate's ACTUAL skill level from CV>"
    }
  ],
  "gapWarnings": [
    {
      "topic": "<missing skill/keyword from the gap analysis>",
      "likelyQuestion": "<how an interviewer might probe this gap>",
      "strategy": "<honest strategy: how to address this gap without lying, referencing transferable skills from CV>"
    }
  ],
  "closingQuestions": [
    "<smart question the candidate can ask the interviewer, specific to THIS company/role>"
  ]
}

=============================================================================
FIELD INSTRUCTIONS
=============================================================================

### behavioral (3-4 questions)
Generate questions that a hiring manager would ACTUALLY ask for THIS role:
- Extract key responsibilities from job posting → turn into behavioral questions
- Format: "Tell me about a time when..." or "Describe a situation where..."
- Answer frameworks must use STAR method with REAL CV content
- Pick experiences from CV that BEST match each question
- If CV has metrics (numbers, percentages), use them in the result section

Example for a "team leadership" requirement in job posting:
- If CV shows "Led team of 5 developers" → reference this specific experience
- If CV shows no leadership → be honest: "Your CV doesn't highlight direct leadership. Consider framing [relevant experience] to show initiative."

### technical (2-3 questions)
Based on REQUIRED technical skills in the job posting:
- Only ask about technologies/skills explicitly listed as required
- Preparation advice should match candidate's ACTUAL level
  - If skill IS in CV → "Review your experience with X, be ready to discuss [specific project from CV]"
  - If skill is NOT in CV → "This is a gap. Study fundamentals of X. Be honest about your learning journey."
- Questions should be at the appropriate seniority level (match job posting level)

### gapWarnings (1-3 items, only if there ARE gaps)
Only include if missingKeywords is non-empty:
- Each gap warning targets a SPECIFIC missing keyword
- likelyQuestion shows how interviewers probe for this skill
- Strategy must be HONEST — never suggest lying
- Reference the closest transferable skill from the CV
- If no gaps exist, return an empty array []

### closingQuestions (2-3 questions)
Smart questions to ask at the end of interview:
- Must be specific to the ACTUAL company/role from job posting
- NOT generic questions like "What's the culture like?"
- Reference specific things from the job posting (tech stack, team structure, projects mentioned)

=============================================================================
QUALITY CHECKLIST
=============================================================================
- Every behavioral question maps to a REAL job posting requirement
- Every answer framework references REAL CV content (not invented)
- Technical questions target skills ACTUALLY in the job posting
- Gap warnings only cover ACTUALLY missing skills
- No fabricated experiences, metrics, or company references
- Closing questions reference specific details from the job posting
- Language is professional and actionable

Respond with ONLY the JSON object. No markdown, no explanations.`;
}
