export function generateFreeSummaryPrompt(
  cvText: string,
  jobTexts: string[]
): string {
  return `You are an elite career coach with 15+ years of experience. Analyze how well this CV matches the target job(s).

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
SCORING GUIDELINES (BE BALANCED AND FAIR)
=============================================================================
90-100%: Excellent match - ALL required skills, matching experience level, same industry
80-89%: Strong match - Most required skills present, relevant experience, minor gaps
70-79%: Good match - Core skills present, transferable experience, some learning needed
60-69%: Moderate match - Solid foundation with transferable skills, noticeable gaps
50-59%: Fair match - Some relevant background, requires skill development
40-49%: Limited match - Career pivot with some transferable elements
Below 40%: Poor match - Substantial reskilling required

Calculate: skill match (40%) + experience level (30%) + industry relevance (20%) + education (10%)

IMPORTANT: Be fair and encouraging. Most candidates applying to jobs they're interested in fall in 60-85% range.

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
- Be honest - junior applying for senior should score below 50%
- Compare ACTUAL years of experience if mentioned

### summary
- Start with candidate's strongest relevant qualification
- Mention 1-2 specific strengths FROM THE CV
- Acknowledge most critical gap honestly
- End with realistic assessment of competitiveness

### missingKeywords
- List EXACTLY 5 keywords/skills from job posting NOT in CV
- Be specific: "Kubernetes" not "container orchestration"
- Only list genuinely missing items

### sampleRewrite
- ORIGINAL: Copy ACTUAL bullet from CV verbatim (pick a weak one)
- REWRITTEN: Transform using STAR format (Situation, Task, Action, Result)
- Add metrics only if reasonably inferred
- Incorporate job keywords naturally
- Make it achievement-focused

### sampleRole
- Title must be realistic for someone with THIS CV's background
- Base fit % on concrete evidence in CV
- Description MUST reference:
  * At least ONE specific technology/skill from CV
  * Candidate's apparent experience level
  * Why this role fits their background
- BAD: "Your skills make you a great fit" (too vague)
- GOOD: "Your 3 years of React development and experience building e-commerce platforms align well with this role's frontend architecture focus"

=============================================================================
QUALITY CHECKLIST
=============================================================================
□ Every skill mentioned is actually in the CV
□ Fit score reflects realistic assessment
□ Summary contains specific details from THIS CV
□ Original bullet copied exactly from CV
□ Role recommendation makes sense for this person's background
□ No invented information

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
ROLE RECOMMENDATION SCORING (BE BRUTALLY HONEST)
=============================================================================
Use these guidelines strictly:

SAME/SIMILAR ROLE (85-95%):
- Software Engineer → Senior Software Engineer (if experience supports it)
- Marketing Manager → Marketing Director (if leadership exists)
- Only if CV shows clear progression path

RELATED ROLE, SAME INDUSTRY (70-84%):
- Software Engineer → DevOps Engineer (overlapping skills)
- Marketing Manager → Product Marketing Manager
- Requires some transferable skills present in CV

CAREER PIVOT WITH TRANSFERABLES (50-69%):
- Software Engineer → Product Manager (technical background helps)
- Teacher → Corporate Trainer (pedagogy transfers)
- Significant learning curve acknowledged

DIFFERENT FIELD (30-49%):
- Accountant → UX Designer (minimal overlap)
- Be honest about gap and required upskilling

NEVER give 80%+ to:
- Roles requiring skills not demonstrated in CV
- Significant seniority jumps without evidence
- Complete industry changes

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
QUALITY CHECKLIST
=============================================================================
□ All 3 rewritten bullets based on actual CV content
□ Role fit percentages realistic and justified
□ ATS flags address specific issues in THIS CV
□ No invented skills, metrics, or experiences
□ Recommendations actionable and specific

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
🛡️ SMART HONEST MODE - OPTIMIZE WITH INTEGRITY
═══════════════════════════════════════════════════════
The candidate wants CV optimization that improves match score while staying truthful.

MISSING KEYWORDS TO CONSIDER: ${analysisResults.missingKeywords.join(", ")}

⚖️ SMART INTEGRATION RULES:
You CAN add missing keywords IF:
✅ They are RELATED/SIMILAR to existing skills (e.g., CV has "JavaScript" → can add "TypeScript")
✅ They are TOOLS in the same ecosystem (e.g., CV has "React" → can add "Next.js")
✅ They are TRANSFERABLE from demonstrated experience (e.g., "Project Management" → can add "Agile")
✅ They fit naturally in a "Familiar with" or "Exposure to" context

You CANNOT add:
❌ Completely unrelated technologies (e.g., "Python developer" → don't add "3D modeling")
❌ Fabricated job titles, companies, or dates
❌ Invented projects or achievements
❌ Skills with zero connection to their background

OPTIMIZATION STRATEGY:
1. Enhance existing experience bullets with relevant keywords
2. Add related skills to skills section with honest framing (e.g., "Proficient: React, Node.js" + "Familiar: Next.js, GraphQL")
3. Integrate keywords naturally in professional summary if plausible
4. Focus on making existing skills more discoverable by ATS

TASK: Create an optimized CV that IMPROVES the match score by strategic keyword integration while maintaining honesty.
`}

IMPORTANT INSTRUCTIONS:
- Extract and preserve ALL personal information (name, email, phone, location, LinkedIn, portfolio)
- Rewrite experience bullets to be achievement-focused with quantifiable results
- Ensure proper ATS formatting (no tables, clear sections, standard fonts)
- Add a compelling professional summary tailored to target jobs
- Organize skills by relevance to target roles
- Keep formatting clean and ATS-friendly

=============================================================================
PROFESSIONAL SUMMARY GUIDE (3-4 powerful sentences)
=============================================================================
Structure:
1. Lead with years of experience + primary expertise
2. Mention 2-3 key technologies/skills matching job requirements
3. Include a quantified achievement if available
4. End with value proposition or career focus

Example:
"Results-driven Software Engineer with 5+ years building scalable web applications using React, Node.js, and AWS. Proven track record of reducing page load times by 40% and leading teams of up to 8 developers. Passionate about clean code architecture and mentoring junior developers."

=============================================================================
BULLET TRANSFORMATION EXAMPLES
=============================================================================
Transform weak bullets into achievement-focused statements:

WEAK → STRONG:

"Responsible for customer support"
→ "Resolved 50+ customer inquiries daily, maintaining 98% satisfaction rating and reducing average response time by 30%"

"Worked on web development projects"
→ "Developed and deployed 5 responsive web applications using React and Node.js, serving 10,000+ monthly active users"

"Managed social media accounts"
→ "Grew social media following by 150% across 3 platforms, generating 2M+ impressions and driving 25% increase in website traffic"

"Helped with data analysis"
→ "Analyzed datasets of 100K+ records using Python and SQL, delivering insights that informed $500K in cost-saving decisions"

Structure: [Action Verb] + [What you did] + [Result/Impact]

NOTE: Only use specific numbers if they appear in or can be reasonably inferred from original CV.

=============================================================================
ATS OPTIMIZATION CHECKLIST
=============================================================================
Your optimized CV must:
□ Use standard section headings (Experience, Education, Skills)
□ Avoid tables, graphics, or complex formatting
□ Include relevant keywords from job posting naturally
□ Use standard date formats (Month Year)
□ Spell out acronyms at least once
□ Use standard fonts and simple formatting
□ Keep bullet points concise (1-2 lines each)

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
- All dates should be in "Month Year" format
- Keep professional tone throughout
- Use standard ASCII characters only (avoid special Unicode symbols, emojis, or fancy characters)
- Use simple quotes (""), not smart quotes or other variants

=============================================================================
FINAL QUALITY VERIFICATION
=============================================================================
Before responding, verify:
□ All contact information preserved from original
□ All job titles, companies, and dates are EXACT from original
${fakeItMode ? '□ All missing keywords aggressively added per Fake It Mode' : '□ Related/transferable keywords strategically integrated to IMPROVE MATCH SCORE'}
□ Bullets enhanced but based on real content
□ Summary accurately represents the candidate
□ JSON is valid and complete
□ Professional summary follows guide structure
□ Experience bullets follow transformation examples
□ ATS checklist requirements met
${!fakeItMode ? '□ CRITICAL: Optimized CV should score HIGHER than original (aim for +10-20% improvement)' : ''}

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
