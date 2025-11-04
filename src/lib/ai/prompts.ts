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

export function generateImprovementBreakdownPrompt(
  originalCVText: string,
  optimizedCVText: string,
  jobTexts: string[],
  missingKeywords: string[],
  originalScore: number,
  optimizedScore: number
): string {
  const actualDifference = optimizedScore - originalScore;

  return `You are an expert CV analyzer. Compare the original CV with the optimized CV and explain how each improvement contributes to the overall score increase.

ORIGINAL CV:
"""
${originalCVText}
"""

OPTIMIZED CV:
"""
${optimizedCVText}
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

MISSING KEYWORDS THAT SHOULD BE ADDRESSED: ${missingKeywords.join(", ")}

SCORE CHANGE:
- Original Score: ${originalScore}%
- Optimized Score: ${optimizedScore}%
- Actual Difference: ${actualDifference}%

CRITICAL: The total impact of all improvements MUST equal exactly ${actualDifference}%. Do not exceed this total.

TASK: Analyze how the optimized CV improved compared to the original and break down the improvements into actionable categories with estimated score impact.

Respond in JSON format:
{
  "improvements": [
    {
      "category": "Keyword Addition",
      "action": "Added 'C#' to technical skills section",
      "impact": 10,
      "reason": "Critical keyword from job posting that was missing"
    },
    {
      "category": "Keyword Addition",
      "action": "Added 'SQL Server' to experience bullets",
      "impact": 8,
      "reason": "Required database technology mentioned in job posting"
    },
    {
      "category": "Bullet Rewriting",
      "action": "Quantified achievement in project management bullet",
      "impact": 7,
      "reason": "Added measurable results (30% efficiency increase)"
    },
    {
      "category": "ATS Optimization",
      "action": "Restructured experience section with clear job titles",
      "impact": 5,
      "reason": "Better ATS parsing and keyword matching"
    },
    {
      "category": "Professional Summary",
      "action": "Added summary incorporating target role keywords",
      "impact": 5,
      "reason": "Improved initial impression and keyword density"
    }
  ]
}

Guidelines:
- List 5-8 most impactful improvements (prioritize by impact)
- Impact values must be realistic and their SUM must equal EXACTLY ${actualDifference}%
- Categories: "Keyword Addition", "Bullet Rewriting", "ATS Optimization", "Professional Summary", "Skills Organization", "Other"
- Be specific about what changed
- Distribute the ${actualDifference}% across improvements proportionally
- Most impactful changes get higher values, smaller changes get 1-2%
- Focus on concrete, actionable improvements that were made
- Example: If total is 5%, you might have: [2%, 1%, 1%, 1%] = 5% total`;
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
  }
): string {
  return `You are an expert CV writer and ATS optimization specialist. Create a fully optimized, ATS-friendly CV based on the original CV, target job postings, and analysis results.

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
- Missing Keywords: ${analysisResults.missingKeywords.join(", ")}
${analysisResults.rewrittenBullets ? `- Suggested Bullets: ${analysisResults.rewrittenBullets.join(" | ")}` : ""}
${analysisResults.atsFlags ? `- ATS Tips: ${analysisResults.atsFlags.join(" | ")}` : ""}

TASK: Create a complete, optimized CV that:
1. Incorporates ALL missing keywords naturally
2. Uses the rewritten bullets and ATS recommendations
3. Maintains the candidate's authentic voice and achievements
4. Is optimized for ATS scanning
5. Follows professional CV best practices

IMPORTANT INSTRUCTIONS:
- Extract and preserve ALL personal information (name, email, phone, location, LinkedIn, portfolio)
- Rewrite experience bullets to be achievement-focused with quantifiable results
- Incorporate missing keywords throughout (especially in skills and experience)
- Ensure proper ATS formatting (no tables, clear sections, standard fonts)
- Add a compelling professional summary tailored to target jobs
- Organize skills by relevance to target roles
- Keep formatting clean and ATS-friendly

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
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "startDate": "Month Year",
      "endDate": "Month Year", // or "Present"
      "bullets": [
        "Achievement-focused bullet point with quantifiable results...",
        "Another bullet incorporating keywords and STAR format...",
        "Third bullet demonstrating impact and skills..."
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University Name",
      "location": "City, Country",
      "graduationDate": "Month Year",
      "details": "GPA: 3.8/4.0, Honors, relevant coursework" // optional
    }
  ],
  "skills": {
    "technical": ["Skill 1", "Skill 2", "Skill 3", "..."],
    "soft": ["Leadership", "Communication", "Problem Solving", "..."]
  },
  "certifications": [ // optional, only if present in original CV
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Month Year"
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
- Preserve ALL factual information from original CV
- Never fabricate experience, dates, or achievements
- Enhance wording and presentation, not facts
- Ensure every experience bullet demonstrates impact
- Skills section should prioritize keywords from job postings
- Professional summary should be compelling and keyword-rich
- All dates should be in "Month Year" format
- Keep professional tone throughout
- Use standard ASCII characters only (avoid special Unicode symbols, emojis, or fancy characters)
- Use simple quotes (""), not smart quotes or other variants`;
}
