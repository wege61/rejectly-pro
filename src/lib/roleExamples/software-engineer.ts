import type { RoleExample } from "./types";

/*
 * Daniel Park is fictional. He shares a world with Maya (the homepage demo):
 * Lakeside University, an internship at Halden Analytics. Every number in his
 * "after" resume is an answer to a question; none describes something his
 * "before" resume didn't already have.
 */
export const softwareEngineer: RoleExample = {
  title: "Software Engineer",
  metaTitle: "Entry-Level Software Engineer Resume: Example and Tips",
  metaDescription:
    "A full new-grad software engineer resume, before and after, scored by the same 19 checks as our free ATS scan. Common mistakes, how to order it, and an example you can edit.",
  hero: {
    headline: ["A software engineer resume for your ", "first", " job."],
    sub: "What to put on it when your experience is an internship, a TA job and a few projects, and how it reads to an applicant tracking system. With a full example you can edit.",
  },
  person: { first: "Daniel", pronoun: "he", detail: "Two columns, icons, “My Journey”" },

  before: {
    name: "Daniel Park",
    tagline: "Aspiring Developer",
    sidebar: [
      { heading: "Contact", pin: "contact", lines: ["danielpark.dev@mail.com", "Lakeside, CA"], icons: ["in", "GH"] },
      {
        heading: "Tech Stack",
        bars: [
          { label: "Python", level: 4 },
          { label: "Java", level: 3 },
          { label: "JS", level: 3 },
          { label: "React", level: 3 },
          { label: "SQL", level: 2 },
          { label: "Git", level: 3 },
        ],
      },
      { heading: "Languages", lines: ["English, Korean"] },
    ],
    main: [
      { heading: "About Me", text: "Passionate computer science student looking for an opportunity to grow my skills and make an impact." },
      {
        heading: "My Journey",
        pin: "headings",
        entries: [{ title: "Halden Analytics", sub: "Software Intern", bullets: ["Worked on the backend", "Helped fix bugs", "Attended stand-ups with the team"], pin: "numbers" }],
      },
      {
        heading: "Things I’ve Built",
        entries: [
          { title: "CourseMap", bullets: ["Made a website for planning courses", "Used React and Node"], pin: "bullets" },
          { title: "Discord bot for my club", pin: "structure" },
        ],
      },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "Computer Science" }] },
    ],
  },

  after: {
    contact: {
      name: "Daniel Park",
      email: "danielpark.dev@mail.com",
      phone: "(555) 014-7731",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/danielpark",
      portfolio: "github.com/danielpark",
    },
    summary:
      "Computer science graduate with a software engineering internship and two shipped projects. Looking for an entry-level software engineer role building backend and full-stack features.",
    education: [
      {
        degree: "B.S.",
        fieldOfStudy: "Computer Science",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Relevant coursework: Data Structures, Algorithms, Databases, Operating Systems, Software Engineering",
      },
    ],
    experience: [
      {
        title: "Software Engineering Intern",
        company: "Halden Analytics",
        location: "Lakeside, CA",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        bullets: [
          "Built ⟦3⟧ REST API endpoints in Python (Flask) for the reporting service, used by ⟦4⟧ internal teams",
          "Fixed ⟦17⟧ backend bugs from the team’s Jira backlog and added unit tests with pytest for each fix",
          "Made a slow report query ⟦78%⟧ faster (⟦9 s to 2 s⟧) by adding PostgreSQL indexes",
        ],
      },
      {
        title: "Teaching Assistant, Data Structures",
        company: "Lakeside University",
        location: "Lakeside, CA",
        startDate: "Jan 2025",
        endDate: "May 2025",
        bullets: ["Held weekly office hours for ⟦60⟧ students and graded Java programming assignments"],
      },
    ],
    projects: [
      {
        name: "CourseMap, course planning web app",
        role: "React, Node.js, PostgreSQL",
        url: "github.com/danielpark/coursemap",
        startDate: "Sep 2025",
        endDate: "Dec 2025",
        bullets: [
          "Built a course planner that checks prerequisites, used by ⟦120⟧ students in its first semester",
          "Deployed on AWS (EC2, RDS) with a GitHub Actions pipeline that runs tests on every push",
        ],
      },
      {
        name: "Club Discord bot",
        role: "Python",
        startDate: "Jan 2024",
        endDate: "May 2024",
        bullets: ["Wrote a Discord bot that posts event reminders for a ⟦300+⟧ member student club"],
      },
    ],
    skills: {
      technical: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "React", "Node.js", "Express", "Flask", "Git", "Docker", "AWS (EC2, RDS)", "PostgreSQL", "Linux", "pytest"],
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
      after: "Phone, LinkedIn and GitHub as text",
      why: "There’s no phone number, and the LinkedIn and GitHub icons are pictures: nothing of them reaches the ATS.",
      whyAfter: "One line under his name, written out, so it survives any parser.",
    },
    headings: {
      why: "“My Journey” and “Things I’ve Built” aren’t section names an ATS looks for, so his internship wasn’t found as experience.",
      whyAfter: "Education, Experience, Projects, Skills: names every ATS recognizes.",
    },
    numbers: {
      after: "Numbers he can back up",
      why: "“Worked on the backend” and “Helped fix bugs” could describe anyone.",
      whyAfter: "Endpoints built, bugs fixed, query time before and after. His own answers, not estimates.",
    },
    structure: { why: "His projects are just titles; there’s nothing under them to read." },
    length: {
      why: "A school name and a major, and little else.",
      whyAfter: "His graduation date, coursework, a TA job and project details he already had. Nothing that didn’t happen.",
    },
  },
  afterAnchors: {
    columns: "Daniel Park",
    contact: "danielpark.dev@mail.com",
    headings: "EXPERIENCE",
    numbers: "REST API endpoints",
    bullets: "checks prerequisites",
    structure: "event reminders",
    length: "Relevant coursework",
  },

  mistakes: {
    read: [
      { title: "Two or more columns", text: "The parser reads across the page, so columns run into each other.", tag: "see" },
      { title: "Skill bars and charts", text: "●●●○○ means nothing as text. Only the word “Python” survives.", tag: "see" },
      { title: "Contact details as icons", text: "A LinkedIn or GitHub icon is a picture. Write the address out.", tag: "see" },
      { title: "A scanned or image PDF", text: "If you can’t select the text, no ATS can read it either.", tag: "check" },
    ],
    match: [
      { title: "Headings like “My Journey”", text: "Use Experience, Projects, Education and Skills.", tag: "check" },
      { title: "Abbreviations only", text: "“JS” or “k8s” won’t match a search for JavaScript or Kubernetes. Write the full name.", tag: "practice" },
      { title: "Skills only in the skills list", text: "Show them in your bullets too: “Built … in React”.", tag: "practice" },
      { title: "Dates missing or mixed", text: "“2024”, “06/2025” and “Summer ’25” on one page. Pick one format and use it everywhere.", tag: "check" },
    ],
    reader: [
      { title: "Bullets that say nothing", text: "“Worked on the backend.” What did you build, and what came of it?", tag: "check" },
      { title: "A paragraph about being passionate", text: "Two lines on who you are and the role you want say more.", tag: "practice" },
      { title: "Long blocks of text", text: "One or two lines per bullet, starting with what you did.", tag: "check" },
      { title: "Personal details", text: "Photo, age, marital status: in the US, leave them off.", tag: "practice" },
    ],
  },
  order: [
    { title: "Education", text: "On top while you’re in school or just graduated: degree, school, graduation month. Coursework only if it fits the job." },
    { title: "Projects", text: "Right after education when they’re your strongest work, as they often are for a first job. Name the stack and link the code." },
    { title: "Experience", text: "Internships, part-time jobs, TA and research roles. Newest first." },
    { title: "Skills", text: "Languages, frameworks and tools. Only what you’d be happy to be asked about." },
  ],
  rewrites: [
    { before: "Worked on the backend", after: "Built {n} REST API endpoints in Python (Flask) for the reporting service", answers: ["3"] },
    { before: "Helped fix bugs", after: "Fixed {n} backend bugs from the team’s backlog and added a unit test for each", answers: ["17"] },
    { before: "Made a website for planning courses", after: "Built a course planner in React and Node.js that checks prerequisites, used by {n} students", answers: ["120"] },
  ],
  skills: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "React", "Node.js", "REST APIs", "Git", "Docker", "AWS", "Linux", "Unit testing", "Data structures and algorithms"],
};
