/**
 * Cover Letter Prompt
 * Used for generating personalized cover letters
 */

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

⭐⭐ NEW GRAD PIVOT RULES (Apply when candidate has <2 years experience) ⭐⭐
When the CV shows primarily academic/project-based experience:

a) TRANSLATE, don't apologize:
   - WRONG: "Although I lack professional experience..."
   - RIGHT: "Through my capstone project building [X], I developed..."
   - Treat every project, internship, or hackathon as REAL experience

b) FRAME projects as professional proof:
   - Capstone project → "Led end-to-end development of..."
   - Hackathon win → "Under competitive pressure, delivered..."
   - University coursework → "Applied [skill] to..."
   - Part-time/internship → Full professional framing

c) Lead with POTENTIAL and LEARNING VELOCITY:
   - "Proven ability to pick up [tech] quickly — built X in Y weeks"
   - Highlight how fast they learn, not how much they lack
   - End with forward-looking value: "I'm ready to contribute from day one"

d) NEVER say:
   - "As a recent graduate..."
   - "I don't have much experience but..."
   - "I am eager to learn..."
   - "I am a fast learner" (show it, don't say it)

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
