export function generateFreeSummaryPrompt(
  cvText: string,
  jobTexts: string[]
): string {
  return `You are an expert career coach and CV analyzer. Analyze the match between a candidate's CV and job postings.

CV:
"""
${cvText}
"""

Job Postings:
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

Analyze the match and provide:

1. **Match Score** (0-100): Overall compatibility score
2. **Summary** (3-4 sentences, 350-450 characters): Professional summary explaining the match, highlighting strengths and gaps
3. **Missing Keywords** (exactly 5): Critical keywords from job postings that are missing in the CV

Respond in JSON format:
{
  "fitScore": 85,
  "summary": "Your detailed 3-4 sentence summary here...",
  "missingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Guidelines:
- Be honest and constructive
- Focus on actionable insights
- Use professional tone
- Summary should be encouraging yet realistic
- Keywords should be specific technical skills or requirements`;
}

export function generateProReportPrompt(
  cvText: string,
  jobTexts: string[]
): string {
  return `You are an expert career coach and CV optimizer. Provide a detailed analysis to improve the candidate's CV for the target job postings.

CV:
"""
${cvText}
"""

Job Postings:
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

Provide a detailed analysis:

1. **Rewritten Bullets** (exactly 3): Transform existing CV experience bullets to better match job requirements. Make them:
   - Start with strong action verbs
   - Include quantifiable achievements
   - Incorporate relevant keywords
   - Follow STAR format where possible

2. **Role Recommendations** (exactly 3): Alternative job titles the candidate should consider, with match scores

3. **ATS Flags** (3-5 items): Specific recommendations to improve ATS (Applicant Tracking System) compatibility

Respond in JSON format:
{
  "rewrittenBullets": [
    "Bullet point 1...",
    "Bullet point 2...",
    "Bullet point 3..."
  ],
  "roleRecommendations": [
    { "title": "Role Title 1", "fit": 90 },
    { "title": "Role Title 2", "fit": 85 },
    { "title": "Role Title 3", "fit": 75 }
  ],
  "atsFlags": [
    "Tip 1...",
    "Tip 2...",
    "Tip 3..."
  ]
}

Guidelines:
- Rewritten bullets must be impressive and achievement-focused
- Role recommendations should be realistic career paths
- ATS tips should be specific and actionable
- Maintain professional tone throughout`;
}
