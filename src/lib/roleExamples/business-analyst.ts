import type { RoleExample } from "./types";

/*
 * Elena Petrova is fictional: Information Systems at Lakeside University, a
 * business analyst internship at Riverton Bank (fictional), a campus dining
 * process project, a case competition. Her "before" speaks in jargon and puts
 * her tools in a table.
 */
export const businessAnalyst: RoleExample = {
  title: "Business Analyst",
  metaTitle: "Entry-Level Business Analyst Resume: Example and Tips",
  metaDescription:
    "A full new-grad business analyst resume, before and after, scored by the same 19 checks as our free ATS scan. Plain words over jargon, acronyms spelled out, and an example you can edit.",
  hero: {
    headline: ["A business analyst resume for your ", "first", " job."],
    sub: "When your experience is one internship, a process project and a case competition: how to say what you changed, and how it reads to an applicant tracking system. With a full example you can edit.",
  },
  person: { first: "Elena", pronoun: "she", detail: "Jargon, a tools table, BRD and UAT" },

  before: {
    name: "Elena Petrova",
    tagline: "Strategic Thinker & Problem Solver",
    look: { side: "#7c2d12", accent: "#fdba74", mark: "▶" },
    sidebar: [
      { heading: "Contact", pin: "contact", lines: ["elena.petrova@mail.com"], icons: ["in"] },
      { heading: "Competencies", lines: ["Strategic thinking", "Problem solving", "Synergy building"] },
    ],
    main: [
      { heading: "Value Proposition", text: "Results-driven analyst who leverages cross-functional synergies to drive data-driven, best-in-class business outcomes." },
      {
        heading: "Impact",
        pin: "headings",
        entries: [
          { title: "Riverton Bank", sub: "BA Intern", bullets: ["Wrote BRDs", "Supported UAT", "Leveraged data to drive insights"], pin: "numbers" },
          { title: "Campus Dining process project", bullets: ["Optimized workflows"], pin: "bullets" },
          { title: "Case Competition", pin: "structure" },
        ],
      },
      { heading: "Toolkit", pin: "skills", entries: [{ title: "", table: [["SQL", "Excel", "Visio"], ["Jira", "Tableau", "BPMN"]] }] },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "Information Systems" }] },
    ],
  },

  after: {
    contact: {
      name: "Elena Petrova",
      email: "elena.petrova@mail.com",
      phone: "(555) 014-8402",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/elenapetrova",
    },
    summary:
      "Information systems graduate with a business analyst internship at a regional bank and a process redesign project for campus dining. Looking for an entry-level business analyst role.",
    education: [
      {
        degree: "B.S.",
        fieldOfStudy: "Information Systems",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Relevant coursework: Systems Analysis and Design, Database Management, Business Process Management, Statistics",
      },
    ],
    experience: [
      {
        title: "Business Analyst Intern",
        company: "Riverton Bank",
        location: "Lakeside, CA",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        bullets: [
          "Interviewed ⟦9⟧ loan officers and wrote the business requirements document (BRD) for a new loan intake form",
          "Mapped the loan intake process in Visio (BPMN) and found ⟦2⟧ of ⟦9⟧ steps that repeated data entry; both were removed",
          "Wrote ⟦30⟧ user acceptance testing (UAT) cases in Jira and tracked ⟦11⟧ defects to resolution before launch",
        ],
      },
    ],
    projects: [
      {
        name: "Campus dining order process redesign",
        role: "Business Process Management course",
        startDate: "Jan 2026",
        endDate: "Apr 2026",
        bullets: [
          "Timed ⟦120⟧ lunch orders and used SQL and Excel to show where the queue backed up",
          "Proposed a pre-order pickup shelf that dining services piloted; the average wait fell ⟦36%⟧, from ⟦11⟧ to ⟦7⟧ minutes, in the pilot week",
        ],
      },
      {
        name: "Lakeside Business Case Competition",
        role: "Team of 4",
        startDate: "Oct 2025",
        endDate: "Oct 2025",
        bullets: ["Built the cost model in Excel for a retail inventory case and placed ⟦2nd⟧ of ⟦18⟧ teams"],
      },
    ],
    skills: {
      technical: ["Requirements gathering", "Business requirements documents (BRD)", "Process mapping (BPMN)", "User stories", "User acceptance testing (UAT)", "SQL", "Excel (pivot tables)", "Visio", "Jira", "Tableau"],
      soft: [],
    },
    isEntryLevel: true,
    themeColor: "#1E2024",
    photoUrl: "",
    language: "en",
  },

  changes: {
    contact: {
      before: "No phone, LinkedIn only as an icon",
      after: "Phone and LinkedIn as text",
      why: "There’s no phone number, and her LinkedIn is an icon: nothing of it reaches the ATS.",
      whyAfter: "Email, phone, city and LinkedIn on one line under her name.",
    },
    skills: {
      before: "Tools in a table",
      after: "Skills listed one by one",
      why: "Her tools sit in a table that comes out as one line with gaps, next to “synergy building”. Too few skills come through.",
      whyAfter: "Methods and tools as plain text, acronyms spelled out once.",
    },
    headings: {
      why: "“Value Proposition”, “Impact” and “Toolkit” aren’t section names an ATS looks for. It found no summary, no experience and no skills section.",
      whyAfter: "Summary, Education, Projects, Experience, Skills: names every ATS recognizes.",
    },
    numbers: {
      after: "Numbers she can back up",
      why: "“Leveraged data to drive insights” could mean anything. What did she find, and what changed?",
      whyAfter: "People interviewed, steps removed, test cases written, minutes saved. Her own answers.",
    },
    structure: { why: "The case competition is just a name; there’s nothing under it to read." },
    length: {
      why: "A school and a major, and little else.",
      whyAfter: "Her graduation month, coursework and details of an internship and two projects she already had.",
    },
  },
  afterAnchors: {
    columns: "Elena Petrova",
    contact: "elena.petrova@mail.com",
    skills: "SKILLS",
    headings: "SUMMARY",
    numbers: "loan officers",
    bullets: "lunch orders",
    structure: "cost model",
    length: "Relevant coursework",
  },

  mistakes: {
    read: [
      { title: "A table of tools", text: "Cells come out as one line with wide gaps. List tools plainly.", tag: "see" },
      { title: "Process diagrams as images", text: "A BPMN diagram is a picture to an ATS. Describe the change in a bullet; bring the diagram to the interview.", tag: "practice" },
      { title: "Two or more columns", text: "The parser reads across the page, so the sidebar runs into the main column.", tag: "see" },
      { title: "Contact details as icons", text: "A LinkedIn icon is a picture. Write the address out.", tag: "see" },
    ],
    match: [
      { title: "Acronyms only: BRD, UAT, BPMN", text: "Write the full term once: business requirements document (BRD).", tag: "practice" },
      { title: "Headings like “Impact” or “Toolkit”", text: "Use Summary, Experience, Projects, Education and Skills.", tag: "check" },
      { title: "Methods unnamed", text: "Posts ask for requirements gathering, process mapping, user stories. Name what you did.", tag: "practice" },
      { title: "Your title shortened", text: "“BA Intern” may not match “business analyst”. Write the title in full.", tag: "practice" },
    ],
    reader: [
      { title: "Jargon instead of results", text: "“Leveraged synergies to drive outcomes” says nothing. Say what you found and what changed.", tag: "practice" },
      { title: "Changes you didn’t see happen", text: "Only claim a result that was measured, like “a pilot week”. Say so.", tag: "practice" },
      { title: "Duties instead of outcomes", text: "“Supported UAT.” How many test cases, how many defects found?", tag: "check" },
      { title: "Long blocks of text", text: "One or two lines per bullet, starting with what you did.", tag: "check" },
    ],
  },
  order: [
    { title: "Education", text: "Degree, school, graduation month, and coursework like systems analysis and databases." },
    { title: "Projects", text: "Process or data projects with a real organization: what you studied, what you proposed, what changed." },
    { title: "Experience", text: "BA, operations or data internships. Newest first, each with a result." },
    { title: "Skills", text: "Methods first (requirements, process mapping, UAT), then tools (SQL, Excel, Visio, Jira)." },
  ],
  rewrites: [
    { before: "Wrote BRDs", after: "Interviewed {n} loan officers and wrote the business requirements document (BRD) for a new intake form", answers: ["9"] },
    { before: "Optimized workflows", after: "Mapped the loan intake process and found {n} of 9 steps that repeated data entry", answers: ["2"] },
    { before: "Supported UAT", after: "Wrote {n} user acceptance testing (UAT) cases in Jira and tracked 11 defects to resolution", answers: ["30"] },
  ],
  skills: ["Requirements gathering", "Process mapping (BPMN)", "User stories", "User acceptance testing", "Gap analysis", "SQL", "Excel (pivot tables)", "Tableau", "Power BI", "Visio", "Jira", "Data analysis"],
  myths: [
    { belief: "Business jargon sounds professional.", truth: "“Leveraged synergies” says nothing. “Found 2 of 9 steps that repeated data entry; both were removed” says a lot." },
    { belief: "A process diagram on your resume shows your skills.", truth: "It’s a picture to an ATS and too small for a person. Describe the change in a bullet; show the diagram in the interview." },
    { belief: "List every tool in the post.", truth: "List what you’ve used. Business analyst interviews often include a SQL or Excel exercise." },
  ],
};
