/**
 * CV Optimization Prompts
 * Used for generating optimized CVs and analyzing optimization results
 */

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
  const userMetricsWarning = userProvidedMetrics && Object.keys(userProvidedMetrics).length > 0 ? `
🎯🎯🎯 USER PROVIDED METRICS - MUST INTEGRATE! 🎯🎯🎯
================================================================================
The user was asked to provide specific metrics for some of their original bullet points.
Here are the answers they provided:
${Object.entries(userProvidedMetrics).map(([id, answer]) => `- For bullet ID ${id}: User answered "${answer}"`).join('\n')}

You MUST use these numbers to enhance the corresponding bullet points in the CV! Do not ignore them.
================================================================================
` : '';

  const academicDetailsWarning = academicDetails && (academicDetails.capstone || academicDetails.coursework || academicDetails.gpa) ? `
🎓🎓🎓 NEW GRAD / ACADEMIC DETAILS PROVIDED 🎓🎓🎓
================================================================================
The candidate has provided the following academic details to strengthen their entry-level profile:
${academicDetails.gpa ? `- GPA: ${academicDetails.gpa}` : ''}
${academicDetails.coursework ? `- Relevant Coursework: ${academicDetails.coursework}` : ''}
${academicDetails.capstone ? `- Capstone/Major Project: ${academicDetails.capstone}` : ''}

CRITICAL INTEGRATION REQUIREMENTS:
- Integrate the Capstone/Major Project as a fully fleshed-out professional project experience in the Experience or Projects section.
- Add the GPA and Relevant Coursework to the Education section.
- Treat these academic details as real, professional-grade qualifications to boost the ATS score.
================================================================================
` : '';

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

  return `You are an ATS bypass specialist and mentor for entry-level candidates. Your goal is to create a CV that hacks ATS filters by translating academic/junior experience into corporate keywords.

================================================================================
OUTPUT LANGUAGE: ${outputLanguage.toUpperCase()}
================================================================================
You MUST write ALL text values (summary, bullets, skills, dates) in ${outputLanguage}.
JSON keys remain in English. Everything else MUST be in ${outputLanguage}.
${outputLanguage !== 'English' ? `Dates: use ${outputLanguage} month names (NOT English month names).
For current positions: use the equivalent of "Present" in ${outputLanguage}.` : ''}

🚨🚨🚨 STRICT PROPER NOUN RULE (CRITICAL) 🚨🚨🚨
DO NOT translate or transliterate the candidate's Name, Email, or URLs!
If the candidate's name is in the Latin alphabet (e.g., "Alp"), DO NOT write it in Cyrillic, Arabic, or any other alphabet. Keep the name EXACTLY as it appears in the original CV.
The same applies to specific Company Names or product names—leave them in their original alphabet unless universally localized.
================================================================================

${metricsWarning}
${achievementsWarning}
${userMetricsWarning}
${academicDetailsWarning}

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

🚨🚨🚨 CRITICAL: NEVER ALTER FINANCIAL FIGURES — THIS IS NON-NEGOTIABLE 🚨🚨🚨
================================================================================
Monetary values (revenue, portfolio sizes, savings, allocation amounts, etc.) from the
original CV MUST be copied EXACTLY as written. Do NOT round, convert, abbreviate, or
change them in any way.

EXAMPLES OF FORBIDDEN CHANGES:
❌ Original "$9M+" → Your output "$500K"  ← THIS IS FALSIFICATION
❌ Original "€2.3M" → Your output "€2 million"  ← NOT ALLOWED
❌ Original "$50M" → Your output "$50 million"  ← Keep the original format

✅ CORRECT APPROACH:
✅ Original "$9M+" → Your output MUST say "$9M+" — verbatim, no changes
✅ Original "$50M capital allocation" → Your output MUST say "$50M capital allocation"

If you change a financial figure, you are FALSIFYING the candidate's record. NEVER do this.
================================================================================

🚨🚨🚨 CRITICAL: PRESERVE ALL CERTIFICATIONS — ZERO TOLERANCE 🚨🚨🚨
================================================================================
If the original CV has a Certifications, Courses, Licenses, or Awards section,
EVERY SINGLE ENTRY must appear in your output's "certifications" array.
Do NOT pick only the most impressive ones. Do NOT summarize or merge them.
Do NOT move them to the education details field and skip the certifications array.

STEP 1: Count how many certifications/courses/licenses/awards are in the original CV.
STEP 2: Count how many are in your output's "certifications" array.
STEP 3: The numbers MUST match. If any are missing → add them back immediately.

FORBIDDEN BEHAVIOR:
❌ Original has 6 certifications → Output has 2 (you dropped 4 — THIS IS FAILURE)
❌ Moving certs to education.details instead of certifications array — NOT ALLOWED
❌ Merging multiple certs into one entry — NOT ALLOWED

✅ CORRECT: Every cert/course/license gets its own object in the certifications array.
================================================================================

🚨🚨🚨 CRITICAL: PRESERVE ALL LANGUAGES — ZERO TOLERANCE 🚨🚨🚨
================================================================================
If the original CV lists spoken languages (e.g., Portuguese, English, Spanish, Mandarin),
ALL of them MUST appear in your output's "languages" array.
Do NOT drop the languages array because you think it's optional.
Do NOT omit any language that appears in the original CV.

FORBIDDEN BEHAVIOR:
❌ Original lists 4 languages → Output has 0 ("languages" array missing — THIS IS FAILURE)
❌ Listing only the most obvious language (e.g., only English) — NOT ALLOWED

✅ CORRECT: Every language mentioned in the original CV gets its own object with
   language name and proficiency level (e.g. Fluent, Advanced, Intermediate, Beginner) translated into ${outputLanguage}.
================================================================================

If the original has an "ACHIEVEMENTS" section:
1. Each achievement becomes a bullet point in the relevant job experience
2. Top 2-3 achievements are ALSO mentioned in the summary
3. NO achievement is left out - they are the candidate's proof of value!

🚀 MANDATORY OPTIMIZATIONS (YOU MUST DO ALL OF THESE):
✅ COMPLETELY REWRITE the professional summary - make it powerful and compelling
✅ TRANSFORM every experience bullet - add metrics, results, impact
✅ PRESERVE ALL original metrics and achievements (integrate them better!)
✅ REORGANIZE skills by relevance to the target job
✅ STRICTLY PRESERVE all original technical keywords (if original says "React", do not rephrase to "frontend framework")
✅ STRICTLY PRESERVE all original Job Titles, Companies, and Dates. DO NOT paraphrase "Customer Service" to "Customer Experience".
✅ ZERO TOLERANCE FOR DROPPED METRICS: Every single number, percentage, or dollar amount from the original CV MUST appear in the experience bullets.
✅ ENHANCE wording with stronger action verbs throughout
✅ IMPROVE ATS compatibility with better formatting

⚠️ IMPORTANT: This is NOT a "keep everything the same" mode!
You MUST significantly improve the CV's presentation and impact.
The ONLY restriction is: don't add skills the candidate doesn't have.
Everything else should be dramatically improved.

MANDATORY TRANSFORMATIONS:
1. Summary → Rewrite with powerful opening, include TOP achievements (NO clichés!)
2. Each bullet → Integrate original metrics + emphasize qualitative impact and scope where metrics are absent (NO FAKE METRICS!)
3. Achievements → Weave into experience bullets where they belong (don't lose them!)
4. Skills → Reorganize by job relevance, group logically
5. Action verbs → Replace weak verbs (managed, helped, worked) with strong ones (spearheaded, pioneered, drove, accelerated)

TASK: Create a SIGNIFICANTLY IMPROVED CV that PRESERVES all original achievements while presenting them more powerfully.

IMPORTANT INSTRUCTIONS:
- Extract and preserve ALL personal information (name, email, phone, location, LinkedIn, portfolio)
- Rewrite experience bullets to focus on scope and impact (use metrics ONLY if present in original)
- Ensure proper ATS formatting (no tables, clear sections, standard fonts)
- Add a compelling professional summary tailored to target jobs
- Organize skills by relevance to target roles
- Keep formatting clean and ATS-friendly
- CRITICAL: Order work experience in REVERSE CHRONOLOGICAL order (most recent job FIRST, oldest job LAST)
- CRITICAL: PRESERVE EXACT LOCATIONS BUT TRANSLATE THEM. The candidate's contact location, education locations, and job experience locations must remain geographically the same as in the original CV. DO NOT hallucinate or change them to match the target job's location (e.g. if the original CV says Istanbul, do not change it to Italy). HOWEVER, you MUST translate the City and Country names into ${outputLanguage} (e.g. "Istanbul/Türkiye" should become "Istanbul, Turkey" if outputLanguage is English).
- CRITICAL: Preserve the EXACT degree name and field of study from the original CV — never paraphrase or change it. If the CV says "Computer Engineering", output must say "Computer Engineering", NOT "Computer Science". Copy it verbatim.
- CRITICAL: If the original CV contains a Leadership, Extracurricular, Volunteer, or Activities section, you MUST preserve it as a separate "leadership" array in the JSON. Do NOT collapse these roles into a single vague sentence. Each role (e.g., Treasurer, VP of Finance, Club President, Founder) must be its own entry with title, organization, dates, and bullets. For new graduates especially, this section is a key differentiator and must NEVER be omitted or summarized away.
- CRITICAL: NEVER use "Month YYYY" as a placeholder anywhere in the CV (not in experience, education, leadership, or certifications). If a date is not available in the original CV, OMIT the date field entirely or use an empty string "". A missing date is far better than a fake placeholder that will embarrass the candidate.

=============================================================================
REMINDER: Write ALL content in ${outputLanguage}.
=============================================================================

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

🚨 CRITICAL: BULLET RULES 🚨
- MAXIMUM 150 characters per bullet
- Every bullet MUST be a COMPLETE sentence — never end mid-thought
- WRONG: "Engineered a React application, enhancing user engagement through a"
- RIGHT: "Engineered a React/Firebase marketplace, boosting user engagement by 30%"
- If a bullet is too long → SPLIT into two complete sentences, each ending with a full stop or logical end
- NEVER truncate. Every bullet must stand alone and make sense.
- Count characters BEFORE submitting your response!

TRANSFORMATION FORMULA (STRICT STAR METHOD):
[Strong Action Verb] + [Specific Action (Action)] + [Context/Scope/Job Relevance (Situation/Task)] + [Measurable/Qualitative Impact (Result)]

CRITICAL RULE: You MUST inject context or scope. If the original bullet lacks it, use the TARGET JOB POSTING to infer relevant context (e.g., "for an enterprise SaaS platform", "within a high-volume sales environment"). Do not leave the action bare.

WEAK → STRONG EXAMPLES:

If metrics exist in original CV:
❌ "Worked on web development projects"
✅ "Developed 5 web applications using React, serving 10K+ monthly users" (75 chars ✓)

If NO metrics exist in original CV (DO NOT FABRICATE):
❌ "Responsible for customer support"
✅ "Proactively managed complex inquiries and optimized resolution workflows" (72 chars ✓)

❌ "Helped with data analysis"
✅ "Analyzed complex datasets using Python and SQL to drive strategic insights" (76 chars ✓)

❌ "Optimized service processes"
✅ "Streamlined service workflows, significantly accelerating delivery times" (74 chars ✓)

🎯 NO FAKE METRICS POLICY (CRITICAL):
If exact numbers aren't in the original CV, DO NOT invent or estimate them (no fake percentages like 98%, no fake amounts like $50K, no fake counts like 50+).
Instead, focus on "How" and "Scope" using strong action verbs:
- Show methodology: Use tools, frameworks, and processes (e.g., "leveraging CRM systems").
- Provide scope context instead of fake numbers: "large-scale", "cross-functional", "end-to-end", "enterprise-grade", "critical".

💪 STRONG ACTION VERBS TO USE:
Spearheaded, Orchestrated, Transformed, Accelerated, Pioneered, Championed, Architected, Streamlined, Drove, Delivered, Achieved, Generated, Increased, Reduced, Optimized

=============================================================================
ATS OPTIMIZATION CHECKLIST (2025 INDUSTRY STANDARDS)
=============================================================================
Your optimized CV must pass Workday, Greenhouse, Lever, and Taleo parsing:

📋 FORMAT REQUIREMENTS (All ATS):
□ Single-column layout ONLY (no two-column formats)
□ NO tables, text boxes, or graphics
□ Contact info in MAIN BODY (NOT in header/footer - 25% of ATS fail to parse headers!)
□ Standard bullets only: • or - or * (NO ➤, ◆, ★, ☑)
□ NO emojis or unicode symbols in output
□ Keep bullet points concise (max 120 characters, 1-2 lines each)

📋 SECTION HEADERS:
Note: The JSON keys ("summary", "experience", etc.) stay in English — they are field names.
But the TEXT CONTENT inside those fields must match the CV's language.
For English CVs, follow standard ATS header conventions.
For non-English CVs, write content naturally in that language.

📋 KEYWORD OPTIMIZATION (Greenhouse frequency scoring):
□ Key skills mentioned 2-3 times across CV (summary + skills + experience)
□ Keywords appear IN CONTEXT within bullets, not just listed
□ Job title matches common posting language

📋 ABBREVIATION EXPANSION (CRITICAL for Greenhouse/Lever):
□ ALL abbreviations MUST be expanded at first mention:
   → "AWS (Amazon Web Services)" not just "AWS"
   → "MBA (Master of Business Administration)" not just "MBA"
   → "PMP (Project Management Professional)" not just "PMP"
   → "SEO (Search Engine Optimization)" not just "SEO"
   → "CRM (Customer Relationship Management)" not just "CRM"
□ Greenhouse and Lever do NOT recognize unexpanded abbreviations!

📋 DATE FORMAT (All ATS):
□ Use standard date format: "Month YYYY"
□ For ENGLISH CVs: "January 2020", "March 2024"
□ For TURKISH CVs: "Ocak 2020", "Mart 2024" (use Turkish month names: Ocak, Şubat, Mart, Nisan, Mayıs, Haziran, Temmuz, Ağustos, Eylül, Ekim, Kasım, Aralık)
□ Use 4-digit year consistently throughout
□ Reverse chronological order (most recent job FIRST)

📋 VERB TENSE (Lever-specific):
□ Current job: Present tense ("Lead", "Manage", "Develop")
□ Past jobs: Past tense ("Led", "Managed", "Developed")

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
      "startDate": "Month YYYY", // e.g., "January 2025" or localized equivalent
      "endDate": "Month YYYY", // or "Present"
      "bullets": [
        "Achievement-focused bullet point demonstrating scope and impact...",
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
      "name": "Certification/Course Name (e.g. Fundamental of Financial Planning)",
      "issuer": "Issuing Organization (e.g. Goldman Sachs, Coursera, Udemy)"
      // CRITICAL: You MUST cleanly separate the course/certification name from the issuing organization.
      // Do NOT combine them into the 'name' field. 
      // "date" field: ONLY include if a real date exists in the original CV.
      // If the original has no date for this cert, OMIT the date field entirely.
      // NEVER write "Month YYYY" as a placeholder — that is worse than omitting it.
    }
  ],
  "languages": [ // optional, only if present in original CV
    {
      "language": "Target Language Name",
      "proficiency": "Proficiency translated into target language"
    }
  ],
  "leadership": [ // REQUIRED if original CV has Leadership/Extracurricular/Activities/Volunteer section
    {
      "title": "Role Title (e.g. Treasurer, VP of Finance, Founder)",
      "organization": "Organization Name",
      "location": "City, Country", // optional
      "startDate": "Month YYYY",
      "endDate": "Month YYYY or Present",
      "bullets": [
        "Achievement or responsibility from this role..."
      ]
    }
    // Include ALL leadership/extracurricular roles from the original CV.
    // Do NOT merge them or summarize them vaguely.
  ]
}

Guidelines:
🛡️ SMART HONEST MODE GUIDELINES:
- Preserve ALL factual information from original CV (companies, titles, dates, degrees)
- ADD related/transferable skills that connect to existing background
- INTEGRATE missing keywords strategically where they fit naturally
- Use honest framing: "Proficient in X" vs "Familiar with Y" vs "Exposure to Z"
- Enhance existing bullets to include relevant keywords from job posting
- Focus on making existing capabilities more discoverable while maintaining integrity
- When adding skills, ensure they're plausible given candidate's background
- Enhance wording and presentation, not fabricate facts
- Ensure every experience bullet demonstrates impact
- Professional summary should be compelling
- All dates MUST use month names in the CV's language (Turkish: "Ocak 2025", English: "January 2025")
- For current positions, ALWAYS use the English word "Present" (our system will translate it automatically)
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

🏆 ACHIEVEMENTS AND KEYWORDS CHECK (CRITICAL - DO NOT SKIP!):
□ Count ALL metrics in original CV (percentages, money, counts, rankings, time periods)
□ Count ALL metrics in your optimized CV
□ Verify EVERY ORIGINAL METRIC is present!
□ Verify EVERY ORIGINAL TECHNICAL KEYWORD from the original text is preserved exactly (so the ATS score does not drop!).
□ Optimized count must be >= original count (ZERO metrics can be lost!)
□ Verify ALL metric types are preserved: volumes, revenue, rankings, time periods, satisfaction scores
□ If original had ACHIEVEMENTS section → EACH item must be in a relevant experience bullet
□ FINANCIAL FIGURES AUDIT: List every dollar/euro/monetary amount in original. Verify EACH appears verbatim in output. ($9M+ must be $9M+. $500K must be $500K. No exceptions.)

🎓 CERTIFICATIONS AUDIT (MANDATORY):
□ Count certifications/courses/licenses/awards in ORIGINAL CV
□ Count entries in your output's "certifications" array
□ The counts MUST match — if any are missing → add them back before responding
□ Certs must be in the certifications array, NOT only buried in education.details

🌍 LANGUAGES AUDIT (MANDATORY):
□ Does the original CV list spoken languages?
□ If YES → "languages" array in JSON MUST be present and populated with ALL of them
□ If you output 0 languages but original had any → YOU FAILED, add them now

🎓 LEADERSHIP / EXTRACURRICULAR CHECK:
□ Does the original CV have a Leadership, Activities, Extracurricular, or Volunteer section?
□ If YES → "leadership" array in JSON MUST be present and populated
□ Every individual role (Treasurer, VP, President, Founder, etc.) must be its own entry
□ If you did not include "leadership" in your JSON but the original had it → YOU FAILED, add it now

🔄 MUST BE DIFFERENT FROM ORIGINAL (these should be noticeably improved):
□ Professional summary → COMPLETELY REWRITTEN (no clichés!) + TOP achievements included
□ Every experience bullet → TRANSFORMED with metrics and strong verbs
□ Skills organization → REORGANIZED by job relevance
□ Work experience order → REVERSE CHRONOLOGICAL (most recent first)

📋 VALIDATION CHECKLIST:
${additionalTools.length > 0 ? `□ CRITICAL: ALL ${additionalTools.length} user-confirmed tools (${additionalTools.join(', ')}) are in skills.technical array
□ CRITICAL: Each user-confirmed tool appears in at least ONE experience bullet point` : ''}
□ Bullets enhanced with quantified metrics
□ Skills.technical array has 10-12+ items (COUNT THEM!)
□ Skills.soft array has 4-5 items MAX (COUNT THEM!)
□ Hard to soft skills ratio is 70/30 or better
□ Summary does NOT start with "I am" or "I have"
□ Summary does NOT contain "eager to apply" or similar clichés
□ ALL original achievements preserved and integrated
□ JSON is valid and complete
□ ATS checklist requirements met
□ LANGUAGE CHECK: Output language matches the original CV language (NOT English unless inputs are English!)
□ DATE PLACEHOLDER CHECK: Search your entire JSON output for "Month YYYY" — if found even once → YOU FAILED. Remove it. If no real date exists, omit the date field entirely.

⚠️ CRITICAL CHECK: Compare your output to the original CV.
If the summary and bullets look almost identical → YOU FAILED. Rewrite them!
If ANY achievement from original is missing → YOU FAILED. Add them back!
If ANY bullet exceeds 120 characters → YOU FAILED. Split it into 2 bullets!
The optimized CV should be NOTICEABLY BETTER, not a copy of the original.

Respond with ONLY the JSON object. No explanations, no markdown.`;
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
