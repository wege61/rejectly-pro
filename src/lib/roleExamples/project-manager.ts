import type { RoleExample } from "./types";

/*
 * Marcus Johnson is fictional: Business Administration (Operations) at
 * Lakeside University, a project coordinator internship at Northgate Logistics
 * (fictional), a Habitat for Humanity chapter build. A first project job is
 * usually a project coordinator role. His "before" is a functional resume:
 * skills grouped up top, no dates, the work history reduced to a name.
 */
export const projectManager: RoleExample = {
  title: "Project Manager",
  metaTitle: "Entry-Level Project Manager Resume: Example and Tips",
  metaDescription:
    "A full new-grad project coordinator resume, before and after, scored by the same 19 checks as our free ATS scan. Why a functional resume backfires, how to list a certification in progress, and an example you can edit.",
  hero: {
    headline: ["A project manager resume for your ", "first", " job."],
    sub: "For a project coordinator role, when your experience is one internship and a volunteer project. How it reads to an applicant tracking system, and a full example you can edit.",
  },
  person: { first: "Marcus", pronoun: "he", detail: "A functional format, no dates, “Objective”" },

  before: {
    name: "Marcus Johnson",
    tagline: "Organized Team Player",
    look: { side: "#334155", accent: "#facc15", mark: "■" },
    sidebar: [
      { heading: "Contact", pin: "contact", lines: ["marcus.johnson@mail.com", "Lakeside, CA"] },
      { heading: "Key Skills", pin: "skills", lines: ["Team player", "Detail-oriented", "Hard worker", "Time management", "PM, WBS, RACI"] },
    ],
    main: [
      { heading: "Objective", text: "To obtain a challenging position where I can utilize my organizational skills and grow professionally." },
      {
        heading: "Relevant Skills",
        pin: "headings",
        entries: [
          { title: "Leadership", bullets: ["Led a team on a volunteer build"], pin: "bullets" },
          { title: "Organization", bullets: ["Managed schedules and deadlines", "Kept track of issues"], pin: "numbers" },
          { title: "Communication", bullets: ["Wrote status reports for stakeholders"] },
        ],
      },
      { heading: "Work History", entries: [{ title: "Northgate Logistics, Intern", pin: "structure" }] },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "Business" }] },
      { heading: "References", text: "Available upon request." },
    ],
  },

  after: {
    contact: {
      name: "Marcus Johnson",
      email: "marcus.johnson@mail.com",
      phone: "(555) 014-8820",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/marcusjohnson",
    },
    summary:
      "Business graduate in operations management with a project coordinator internship on a three-site technology rollout. Looking for an entry-level project coordinator role.",
    education: [
      {
        degree: "B.S.",
        fieldOfStudy: "Business Administration (Operations Management)",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Relevant coursework: Project Management, Operations Management, Supply Chain, Business Statistics",
      },
    ],
    experience: [
      {
        title: "Project Coordinator Intern",
        company: "Northgate Logistics",
        location: "Lakeside, CA",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        bullets: [
          "Kept the schedule for a warehouse scanner rollout across ⟦3⟧ sites in Smartsheet and sent weekly status reports to ⟦12⟧ stakeholders",
          "Logged rollout tasks in Jira and kept the decision log in Confluence up to date",
          "Tracked ⟦45⟧ risks, issues and decisions in a RAID log and followed up until each had an owner and a date",
          "Organized ⟦9⟧ vendor meetings and wrote up the action items within a day of each",
        ],
      },
      {
        title: "Build Project Lead (volunteer)",
        company: "Habitat for Humanity, Lakeside University chapter",
        location: "Lakeside, CA",
        startDate: "Sep 2024",
        endDate: "May 2025",
        bullets: ["Planned a ⟦6⟧-week home build with ⟦30⟧ volunteers and kept it within a ⟦$4,500⟧ budget"],
      },
    ],
    certifications: [{ name: "Certified Associate in Project Management (CAPM), in progress", issuer: "Project Management Institute", date: "Expected Dec 2026" }],
    skills: {
      technical: ["Project scheduling", "Smartsheet", "Microsoft Project", "Jira", "Confluence", "Excel", "Risk and issue tracking (RAID log)", "Budget tracking", "Agile (Scrum)", "Stakeholder communication"],
      soft: [],
    },
    isEntryLevel: true,
    themeColor: "#1E2024",
    photoUrl: "",
    language: "en",
  },

  changes: {
    contact: {
      before: "No phone, no LinkedIn",
      after: "Phone and LinkedIn as text",
      why: "Only an email and a city: no phone number and no LinkedIn.",
      whyAfter: "Email, phone, city and LinkedIn on one line under his name.",
    },
    headings: {
      before: "A functional format",
      after: "Experience with dates",
      why: "His experience sits under “Relevant Skills”, grouped by trait, so the ATS found no experience section, and nothing says where or when he did it.",
      whyAfter: "Each role with its organization and dates, newest first: what recruiters and parsers expect.",
    },
    skills: {
      before: "Soft skills and bare acronyms",
      after: "Skills listed one by one",
      why: "“Team player, detail-oriented, hard worker” aren’t skills an ATS can pick out, and “PM, WBS, RACI” are bare acronyms.",
      whyAfter: "Methods and tools as plain text, with acronyms spelled out once.",
    },
    numbers: {
      after: "Numbers he can back up",
      why: "“Managed schedules and deadlines” could describe any job.",
      whyAfter: "Sites, stakeholders, risks tracked, the budget. His own answers, not estimates.",
    },
    structure: { why: "The internship is a single line with nothing under it to read." },
    length: {
      why: "A school and “Business”, a list of soft skills, and little else.",
      whyAfter: "His degree, coursework, a certification in progress and details he already had.",
    },
  },
  afterAnchors: {
    columns: "Marcus Johnson",
    skills: "SKILLS",
    contact: "marcus.johnson@mail.com",
    headings: "EXPERIENCE",
    numbers: "scanner rollout",
    bullets: "home build",
    structure: "RAID log",
    length: "Relevant coursework",
  },

  mistakes: {
    read: [
      { title: "A functional (skills-based) format", text: "Experience grouped by skill, with no dates, leaves the ATS nothing to file as work history.", tag: "see" },
      { title: "Two or more columns", text: "The parser reads across the page, so the sidebar runs into the main column.", tag: "see" },
      { title: "A Gantt chart or timeline image", text: "A picture of your project reaches the ATS as nothing. Describe it in a bullet.", tag: "practice" },
      { title: "A scanned or image PDF", text: "If you can’t select the text, no ATS can read it either.", tag: "check" },
    ],
    match: [
      { title: "Acronyms only: RAID, WBS, RACI", text: "Write the full term once: risks, assumptions, issues and dependencies (RAID) log.", tag: "practice" },
      { title: "A certification you don’t hold yet", text: "Write “CAPM, in progress, expected December 2026”, never just “CAPM”.", tag: "practice" },
      { title: "Headings like “Relevant Skills” for experience", text: "Use Experience, with each role, organization and dates.", tag: "check" },
      { title: "Dates missing", text: "Every role needs a start and an end, in one format.", tag: "practice" },
    ],
    reader: [
      { title: "An objective line", text: "“A challenging position where I can grow” is about you. A two-line summary of what you bring is about them.", tag: "practice" },
      { title: "Soft skills with no proof", text: "“Team player, detail-oriented” proves nothing. One bullet about a deadline you kept does.", tag: "practice" },
      { title: "“References available upon request”", text: "Everyone knows. Use the line for something they don’t.", tag: "practice" },
      { title: "Tasks instead of outcomes", text: "“Managed schedules.” For what, how big, and did it land on time?", tag: "check" },
    ],
  },
  order: [
    { title: "Education", text: "On top while you’re in school or just graduated: degree, school, graduation month, project or operations coursework." },
    { title: "Experience", text: "Internships, coordinator roles, and volunteer projects you led, each with dates. Newest first." },
    { title: "Certifications", text: "CAPM or PMP only as you hold them; “in progress” with an expected date is honest and searchable." },
    { title: "Skills", text: "Methods (scheduling, risk tracking, budgets) and tools (Smartsheet, Microsoft Project, Jira)." },
  ],
  rewrites: [
    { before: "Managed schedules and deadlines", after: "Kept the schedule for a warehouse scanner rollout across {n} sites in Smartsheet", answers: ["3"] },
    { before: "Kept track of issues", after: "Tracked {n} risks, issues and decisions in a RAID log until each had an owner", answers: ["45"] },
    { before: "Led a team on a volunteer build", after: "Planned a 6-week home build with {n} volunteers and kept it within budget", answers: ["30"] },
  ],
  skills: ["Project scheduling", "Risk tracking", "Stakeholder communication", "Budget tracking", "Smartsheet", "Microsoft Project", "Jira", "Asana", "Excel", "Agile (Scrum)", "Meeting facilitation", "Status reporting"],
  myths: [
    { belief: "A functional resume hides a thin work history.", truth: "It hides your dates, and recruiters notice. Many parsers expect each job with its dates. A short, honest timeline reads better." },
    { belief: "Write “PMP” or “CAPM” to get past keyword filters.", truth: "Only if you hold it; it’s checked. “CAPM, in progress, expected December 2026” is honest and still matches a search." },
    { belief: "One page at any cost: shrink the font and margins.", truth: "A cramped page is harder to read. For a first job, one full page at a normal size is plenty. Cut weak lines instead." },
  ],
};
