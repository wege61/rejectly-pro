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

2. **Role Recommendations** (exactly 3): Alternative job titles the candidate should REALISTICALLY consider based on their ACTUAL background and skills. CRITICAL RULES:
   - Analyze candidate's education, work experience, and demonstrated skills
   - DO NOT recommend roles that are completely unrelated to their background
   - Match scores MUST reflect realistic alignment (e.g., electrical engineer → UX designer = max 30-40%, not 90%)
   - For career transitions, recommend intermediate stepping-stone roles
   - Prioritize roles that leverage transferable skills
   - Consider candidate's seniority level (entry-level, mid-level, senior)

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
- **CRITICAL FOR ROLE RECOMMENDATIONS:**
  - Base recommendations on candidate's ACTUAL background, not aspirations
  - Same/similar roles: 85-95% match
  - Related roles in same industry: 70-84% match
  - Career pivot with transferable skills: 50-69% match
  - Completely different field: 30-49% match (be honest about gaps)
  - NEVER give 90%+ match to unrelated roles
  - Examples:
    * Software Engineer → Senior Software Engineer: 90%
    * Software Engineer → DevOps Engineer: 75%
    * Software Engineer → Product Manager: 55%
    * Electrical Engineer → Software Engineer: 40%
    * Electrical Engineer → UX Designer: 25% (too different)
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
      "reason": "Critical keyword from job posting that was missing",
      "section": "skills"
    },
    {
      "category": "Keyword Addition",
      "action": "Added 'SQL Server' to experience bullets",
      "impact": 8,
      "reason": "Required database technology mentioned in job posting",
      "section": "experience"
    },
    {
      "category": "Bullet Rewriting",
      "action": "Quantified achievement in project management bullet",
      "impact": 7,
      "reason": "Added measurable results (30% efficiency increase)",
      "section": "experience"
    },
    {
      "category": "ATS Optimization",
      "action": "Restructured experience section with clear job titles",
      "impact": 5,
      "reason": "Better ATS parsing and keyword matching",
      "section": "experience"
    },
    {
      "category": "Professional Summary",
      "action": "Added summary incorporating target role keywords",
      "impact": 5,
      "reason": "Improved initial impression and keyword density",
      "section": "summary"
    }
  ]
}

Guidelines:
- List 5-8 most impactful improvements (prioritize by impact)
- Impact values must be realistic and their SUM must equal EXACTLY ${actualDifference}%
- Categories: "Keyword Addition", "Bullet Rewriting", "ATS Optimization", "Professional Summary", "Skills Organization", "Other"
- Section must be one of: "summary", "experience", "skills", "education", "certifications", "languages", "contact"
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
  },
  fakeItMode: boolean = false
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
${analysisResults.rewrittenBullets ? `- Suggested Bullets: ${analysisResults.rewrittenBullets.join(" | ")}` : ""}
${analysisResults.atsFlags ? `- ATS Tips: ${analysisResults.atsFlags.join(" | ")}` : ""}

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
🛡️ HONEST MODE - DO NOT ADD FAKE SKILLS
═══════════════════════════════════════════════════════
The candidate wants an honest, realistic CV optimization.

KEYWORDS MISSING FROM CV (DO NOT ADD THESE): ${analysisResults.missingKeywords.join(", ")}

⛔ CRITICAL RULES:
❌ DO NOT add these missing keywords to the CV
❌ DO NOT add skills/technologies the candidate has never used
❌ DO NOT fabricate experience or capabilities
✅ ONLY optimize and improve presentation of EXISTING skills
✅ ONLY add keywords that already align with their background
✅ Be conservative and truthful

TASK: Create an optimized CV using ONLY the candidate's real skills and experience.
`}

IMPORTANT INSTRUCTIONS:
- Extract and preserve ALL personal information (name, email, phone, location, LinkedIn, portfolio)
- Rewrite experience bullets to be achievement-focused with quantifiable results
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
${fakeItMode ? `
🚀 FAKE IT MODE GUIDELINES:
- Add ALL missing keywords from the list above to skills section
- Integrate keywords naturally into experience bullets where possible
- NEVER fabricate companies, job positions, or dates (keep those real)
- You may add skills the candidate doesn't have - they chose this mode
- Add missing keywords primarily to: skills section, professional summary, experience bullets
- Be bold with keyword placement - that's the point of this mode
` : `
🛡️ HONEST MODE GUIDELINES:
- Preserve ALL factual information from original CV
- ABSOLUTELY DO NOT add skills/technologies not in original CV
- ABSOLUTELY DO NOT add the missing keywords listed above
- Be conservative - only enhance existing skills and experience
- Focus on better wording and presentation of real capabilities
- If a skill/keyword is not in the original CV, DO NOT add it
`}
- Enhance wording and presentation, not fabricate facts
- Ensure every experience bullet demonstrates impact
- Professional summary should be compelling
- All dates should be in "Month Year" format
- Keep professional tone throughout
- Use standard ASCII characters only (avoid special Unicode symbols, emojis, or fancy characters)
- Use simple quotes (""), not smart quotes or other variants`;
}

export function generateFakeSkillsRecommendationsPrompt(
  missingKeywords: string[],
  jobTexts: string[]
): string {
  return `You are an expert career coach and learning advisor. The candidate has chosen to add missing skills to their CV (even though they don't currently possess them) to increase their chances of getting interviews. Your job is to create a realistic, actionable learning path for each fake skill so they can actually acquire these skills.

MISSING KEYWORDS/SKILLS: ${missingKeywords.join(", ")}

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

TASK: For each missing keyword/skill, create a comprehensive learning recommendation that will help the candidate actually acquire this skill within a reasonable timeframe.

Respond in JSON format:
{
  "recommendations": [
    {
      "skill": "Figma",
      "category": "Design Tool",
      "learningPath": [
        "Complete Figma official tutorial series (2-3 hours)",
        "Take 'UI Design with Figma' course on Coursera or Udemy (8-10 hours)",
        "Practice by redesigning 3 existing websites/apps",
        "Study design systems and component libraries",
        "Learn about prototyping and animation in Figma"
      ],
      "projectIdeas": [
        "Redesign a popular mobile app (e.g., Instagram, Twitter) with improved UX",
        "Create a complete design system for a fictional startup",
        "Design a portfolio website for yourself in Figma",
        "Participate in Daily UI Challenge for 30 days",
        "Create interactive prototypes for 3 different products"
      ],
      "estimatedTime": "2-3 weeks"
    },
    {
      "skill": "Adobe XD",
      "category": "Design Tool",
      "learningPath": [
        "Watch Adobe XD Quick Start tutorial (1 hour)",
        "Complete Adobe XD Masterclass on YouTube (3-4 hours)",
        "Learn about wireframing and mockups",
        "Practice creating responsive designs",
        "Master XD's prototyping features"
      ],
      "projectIdeas": [
        "Design a complete e-commerce website with XD",
        "Create a mobile app prototype with micro-interactions",
        "Design a SaaS dashboard with complex user flows",
        "Build a design portfolio showcasing your XD work"
      ],
      "estimatedTime": "1-2 weeks"
    }
  ]
}

Guidelines:
- Create recommendations for ALL missing keywords (typically 5 keywords)
- Each learning path should have 4-6 actionable steps
- Each skill should have 3-5 realistic project ideas
- Estimated time should be realistic: 1-2 weeks for simple tools, 2-4 weeks for frameworks/languages, 1-3 months for complex skills
- Categories: "Design Tool", "Programming Language", "Framework", "Library", "Methodology", "Soft Skill", "Technical Skill", "Platform", etc.
- Be specific and actionable - avoid vague advice
- Learning path should go from beginner to competent (not expert)
- Project ideas should be practical and portfolio-worthy
- Consider free resources when possible (YouTube, official docs, free courses)
- Focus on hands-on learning and building real projects
- Make sure recommendations are tailored to the job requirements`;
}
