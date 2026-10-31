import type { RoleExample } from "./types";

/*
 * Jordan Lee is fictional: Business Administration with a CS minor at
 * Lakeside University, a product internship at Lumen Health (fictional), the
 * Product Club and a hackathon. Jordan's resume leads with experience, to
 * show the builder's other layout.
 */
export const productManager: RoleExample = {
  title: "Product Manager",
  metaTitle: "Entry-Level Product Manager Resume: Example and Tips",
  metaDescription:
    "A full new-grad (APM) product manager resume, before and after, scored by the same 19 checks as our free ATS scan. Tables, acronyms and vague titles, and an example you can edit.",
  hero: {
    headline: ["A product manager resume for your ", "first", " job."],
    sub: "What to put on it when your product experience is one internship, a club and a hackathon, and how it reads to an applicant tracking system. With a full example you can edit.",
  },
  person: { first: "Jordan", pronoun: "they", detail: "A table, PRD and OKR, “Career Highlights”" },

  before: {
    name: "Jordan Lee",
    tagline: "Future Product Leader",
    look: { side: "#1f4d3a", accent: "#f4a261", mark: "●" },
    sidebar: [
      { heading: "Get in Touch", pin: "contact", lines: ["jordan.lee@mail.com", "Lakeside, CA"], icons: ["in"] },
      {
        heading: "Strengths",
        bars: [
          { label: "Leadership", level: 5 },
          { label: "Communication", level: 5 },
          { label: "Strategy", level: 4 },
          { label: "Agile", level: 4 },
        ],
      },
      { heading: "Interests", lines: ["Startups, podcasts, travel"] },
    ],
    main: [
      { heading: "Who I Am", pin: "headings", text: "A passionate, results-driven future product leader who thrives at the intersection of business, technology and design." },
      {
        heading: "Career Highlights",
        entries: [{ title: "Lumen Health", sub: "Product Intern", bullets: ["Responsible for writing PRDs", "Worked with engineering on features", "Helped with user research"], pin: "numbers" }],
      },
      {
        heading: "Core Competencies",
        pin: "skills",
        entries: [{ title: "", table: [["Roadmapping", "OKRs", "GTM"], ["User research", "A/B tests", "SQL"]] }],
      },
      {
        heading: "Leadership",
        entries: [
          { title: "Product Club", pin: "structure" },
          { title: "Lakeside Hackathon", bullets: ["Made an app for campus parking"], pin: "bullets" },
        ],
      },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "Business" }] },
    ],
  },

  after: {
    contact: {
      name: "Jordan Lee",
      email: "jordan.lee@mail.com",
      phone: "(555) 014-3368",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/jordanlee",
    },
    summary:
      "Business graduate with a computer science minor and a product management internship at a health tech startup. Looking for an associate product manager role.",
    education: [
      {
        degree: "B.S.",
        fieldOfStudy: "Business Administration, minor in Computer Science",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Relevant coursework: Product Management, Statistics, Database Systems, Marketing Research",
      },
    ],
    experience: [
      {
        title: "Product Management Intern",
        company: "Lumen Health",
        location: "Lakeside, CA",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        bullets: [
          "Wrote ⟦4⟧ product requirements documents (PRDs) for the patient scheduling app and reviewed each with engineering and design",
          "Ran ⟦12⟧ user interviews with clinic staff and turned the findings into the team’s top ⟦3⟧ backlog items",
          "Tracked an A/B test of appointment reminders that cut missed appointments by ⟦9%⟧ in the pilot clinics",
        ],
      },
      {
        title: "Vice President, Product Club",
        company: "Lakeside University",
        location: "Lakeside, CA",
        startDate: "Sep 2024",
        endDate: "May 2026",
        bullets: ["Organized ⟦6⟧ product teardown workshops for ⟦150+⟧ members"],
      },
    ],
    projects: [
      {
        name: "Campus parking finder (Lakeside Hackathon)",
        role: "Product lead",
        startDate: "Mar 2025",
        endDate: "Mar 2025",
        bullets: ["Led a team of ⟦4⟧ to build a campus parking finder in 36 hours, and wrote the user flows and the pitch"],
      },
    ],
    skills: {
      technical: ["Product requirements documents (PRDs)", "User research", "A/B testing", "Roadmapping", "Objectives and key results (OKRs)", "SQL", "Jira", "Figma", "Google Analytics", "Agile (Scrum)"],
      soft: [],
    },
    isEntryLevel: false,
    themeColor: "#1E2024",
    photoUrl: "",
    language: "en",
  },

  changes: {
    columns: {
      before: "Two columns and a table",
      why: "A parser reads straight across the page, so the sidebar runs into the main column, and the competencies table comes out as one line with wide gaps.",
      whyAfter: "One column, and skills as a plain list.",
    },
    contact: {
      before: "No phone, LinkedIn only as an icon",
      after: "Phone and LinkedIn as text",
      why: "There’s no phone number, and the LinkedIn icon is a picture: nothing of it reaches the ATS.",
      whyAfter: "Email, phone, city and LinkedIn on one line under their name.",
    },
    headings: {
      before: "No summary an ATS can find",
      after: "A two-line summary",
      why: "“Who I Am” isn’t a heading an ATS looks for, so it found no summary. “Career Highlights” is no better; it got through only because the rest of the page made the experience clear.",
      whyAfter: "A plain Summary: degree, internship, the role they want.",
    },
    skills: {
      before: "Skills locked in a table and bars",
      after: "Skills listed one by one",
      why: "The competencies sit in a table and the strengths are bars. Too few skills come through as words the ATS can pick out.",
      whyAfter: "Ten methods and tools as plain text, acronyms spelled out.",
    },
    numbers: {
      after: "Numbers they can back up",
      why: "“Responsible for writing PRDs” says what the job was, not what Jordan did.",
      whyAfter: "Documents written, interviews run, the test result. Their own answers, not estimates.",
    },
    structure: { why: "The Product Club line is just a name; there’s nothing under it to read." },
    length: {
      why: "A school and “Business”, and little else.",
      whyAfter: "Degree, minor, graduation month, coursework, and details they already had.",
    },
  },
  afterAnchors: {
    columns: "Jordan Lee",
    skills: "SKILLS",
    contact: "jordan.lee@mail.com",
    headings: "SUMMARY",
    numbers: "product requirements documents",
    bullets: "parking finder in 36 hours",
    structure: "teardown workshops",
    length: "Relevant coursework",
  },

  mistakes: {
    read: [
      { title: "A table of competencies", text: "Cells come out as one line with wide gaps between them. List skills plainly.", tag: "see" },
      { title: "Two or more columns", text: "The parser reads across the page, so the sidebar runs into the main column.", tag: "see" },
      { title: "Contact details as icons", text: "A LinkedIn icon is a picture. Write the address out.", tag: "see" },
      { title: "Name and contact in the page header", text: "Some systems skip headers and footers. Put them in the body.", tag: "practice" },
    ],
    match: [
      { title: "Acronyms only: PRD, OKR, GTM", text: "Write the full term once: product requirements document (PRD). Recruiters search for either.", tag: "practice" },
      { title: "Headings like “Career Highlights”", text: "Use Experience, Projects, Education and Skills.", tag: "check" },
      { title: "Vague or invented titles", text: "“Product Ninja” matches no search. Use the title on your offer letter.", tag: "practice" },
      { title: "Strengths rated with bars", text: "“Leadership ●●●●●” proves nothing and reads as nothing. Show it in a bullet.", tag: "see" },
    ],
    reader: [
      { title: "“Responsible for …”", text: "Say what you did and what came of it: “Wrote 4 PRDs for the scheduling app”.", tag: "check" },
      { title: "A paragraph about being results-driven", text: "Two plain lines on your background and the role you want say more.", tag: "practice" },
      { title: "Results you can’t back up", text: "Don’t claim revenue or growth you didn’t measure. Interviewers ask.", tag: "practice" },
      { title: "Interests and personal details", text: "“Podcasts, travel” uses space a project could use.", tag: "practice" },
    ],
  },
  order: [
    { title: "Experience", text: "Lead with it once you have a product internship: what you shipped, researched or decided. Education first works too while you’re in school." },
    { title: "Projects", text: "Hackathons, side projects, case competitions. Your role, the team, and what you delivered." },
    { title: "Education", text: "Degree, school, graduation month. Coursework only if it fits product work." },
    { title: "Skills", text: "Methods (user research, A/B testing) and tools (Jira, Figma, SQL), with acronyms spelled out once." },
  ],
  rewrites: [
    { before: "Responsible for writing PRDs", after: "Wrote {n} product requirements documents (PRDs) for the patient scheduling app", answers: ["4"] },
    { before: "Helped with user research", after: "Ran {n} user interviews with clinic staff and turned the findings into backlog items", answers: ["12"] },
    { before: "Made an app for campus parking", after: "Led a team of {n} to build a campus parking finder in 36 hours", answers: ["4"] },
  ],
  skills: ["Product requirements (PRDs)", "User research", "Prioritization", "Roadmapping", "A/B testing", "SQL", "Jira", "Figma", "Google Analytics", "Agile (Scrum)", "Stakeholder communication", "Data analysis"],
};
