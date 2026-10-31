import type { RoleExample } from "./types";

/*
 * Maya Chen is the homepage demo's student (components/marketing/hero/
 * parserLensRows): Economics at Lakeside University, a data analyst internship
 * at Halden Analytics, a churn-prediction group project, the Marketing
 * Society. Keep her facts the same in both places.
 */
export const dataAnalyst: RoleExample = {
  title: "Data Analyst",
  metaTitle: "Entry-Level Data Analyst Resume: Example and Tips",
  metaDescription:
    "A full new-grad data analyst resume, before and after, scored by the same 19 checks as our free ATS scan. Why a skills chart reads as nothing, how to order it, and an example you can edit.",
  hero: {
    headline: ["A data analyst resume for your ", "first", " job."],
    sub: "What to put on it when your experience is one internship, a class project and a student club, and how it reads to an applicant tracking system. With a full example you can edit.",
  },
  person: { first: "Maya", pronoun: "she", detail: "A skills chart, “Contact Me”, “Responsible for”" },

  before: {
    name: "Maya Chen",
    tagline: "Student",
    look: { side: "#3b2c5a", accent: "#f7b32b", mark: "◆" },
    sidebar: [
      { heading: "Contact Me", pin: "contact", lines: ["(555) 014-2290", "maya.chen@mail.com", "Lakeside, CA"], icons: ["in"] },
      {
        heading: "Computer Skills",
        pin: "skills",
        chart: [
          { label: "Excel", value: 35 },
          { label: "SQL", value: 25 },
          { label: "Python", value: 20 },
          { label: "Tableau", value: 20 },
        ],
      },
    ],
    main: [
      { heading: "Profile", text: "Economics student who loves working with data." },
      {
        heading: "Experience",
        entries: [{ title: "Halden Analytics", sub: "Intern", bullets: ["Helped the team with weekly reports in Tableau", "Responsible for data entry tasks", "Attended client meetings"], pin: "numbers" }],
      },
      {
        heading: "Projects",
        entries: [
          { title: "Group project predicting churn", bullets: ["Used Python and made charts for class"], pin: "bullets" },
          { title: "Social media for Marketing Society", pin: "structure" },
        ],
      },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "Economics, in progress" }] },
    ],
  },

  after: {
    contact: {
      name: "Maya Chen",
      email: "maya.chen@mail.com",
      phone: "(555) 014-2290",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/mayachen",
    },
    summary:
      "Economics graduate with a data analyst internship and a churn-prediction project in Python. Looking for an entry-level data analyst role working with SQL, Python and Tableau.",
    education: [
      {
        degree: "B.S.",
        fieldOfStudy: "Economics",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Relevant coursework: Econometrics, Statistics, Databases, Data Visualization",
      },
    ],
    experience: [
      {
        title: "Data Analyst Intern",
        company: "Halden Analytics",
        location: "Lakeside, CA",
        startDate: "Jun 2026",
        endDate: "Aug 2026",
        bullets: [
          "Helped build weekly sales reports in Tableau for a team of ⟦8⟧",
          "Handled data entry for ⟦12,000⟧ CRM records",
          "Took notes in ⟦10⟧ client meetings and shared the follow-up questions with the analysts",
        ],
      },
    ],
    projects: [
      {
        name: "Customer churn prediction (group project)",
        role: "Python, pandas, scikit-learn",
        startDate: "Jan 2026",
        endDate: "May 2026",
        bullets: [
          "Built a model in Python with a team of ⟦4⟧ to flag customers likely to cancel",
          "Made data visualizations in Matplotlib to present the results to the class",
        ],
      },
      {
        name: "Marketing Society social media",
        role: "Student club",
        startDate: "Sep 2024",
        endDate: "May 2026",
        bullets: ["Ran the club’s Instagram account and tracked post engagement in Excel for ⟦1,200⟧ followers"],
      },
    ],
    skills: {
      technical: ["SQL", "Python", "pandas", "Excel", "Tableau", "Matplotlib", "scikit-learn", "Statistics", "Data visualization", "Data cleaning"],
      soft: [],
    },
    isEntryLevel: true,
    themeColor: "#1E2024",
    photoUrl: "",
    language: "en",
  },

  changes: {
    contact: {
      before: "No LinkedIn, contact in the sidebar",
      after: "Contact details and LinkedIn as text",
      why: "Her LinkedIn is only an icon, so nothing of it reaches the ATS, and her contact details sit in a sidebar that runs into the main column.",
      whyAfter: "Email, phone, city and LinkedIn on one line under her name.",
    },
    skills: {
      before: "Skills drawn as a chart",
      after: "Skills listed one by one",
      why: "Her skills are a pie chart, which is a picture. Excel, SQL, Python and Tableau never reach the ATS.",
      whyAfter: "Ten skills as plain text, the way data analyst posts word them.",
    },
    numbers: {
      after: "Numbers she can back up",
      why: "“Helped the team”, “Responsible for data entry”: duties, not results.",
      whyAfter: "Team size, records handled, meetings covered. Her own answers, not estimates.",
    },
    structure: { why: "The Marketing Society line is just a title; there’s nothing under it to read." },
    length: {
      why: "A school name and “Economics, in progress”, and little else.",
      whyAfter: "Her graduation month, coursework, and project details she already had. Nothing that didn’t happen.",
    },
  },
  afterAnchors: {
    columns: "Maya Chen",
    contact: "maya.chen@mail.com",
    skills: "SKILLS",
    numbers: "weekly sales reports",
    bullets: "flag customers",
    structure: "Instagram account",
    length: "Relevant coursework",
  },

  mistakes: {
    read: [
      { title: "Skills as a chart", text: "A pie chart of Excel, SQL and Python is a picture. None of those words reach the ATS.", tag: "see" },
      { title: "Two or more columns", text: "The parser reads across the page, so the sidebar runs into the main column.", tag: "see" },
      { title: "Links shown only as icons", text: "A LinkedIn icon is a picture. Write the address out.", tag: "see" },
      { title: "A table for skills or tools", text: "Cells come out as one line with wide gaps between them. A plain list reads cleanly.", tag: "practice" },
    ],
    match: [
      { title: "Your words, not the post’s", text: "“Made charts” won’t match a search for data visualization. Use the post’s words for what you really did.", tag: "practice" },
      { title: "Abbreviations only", text: "“BI” or “ETL” alone may not match. Write business intelligence (BI) the first time.", tag: "practice" },
      { title: "Too few skills it can read", text: "Four tools in a sentence aren’t enough. List each skill on its own.", tag: "check" },
      { title: "Dates missing", text: "No dates means no way to tell how recent or how long anything was.", tag: "practice" },
    ],
    reader: [
      { title: "“Responsible for …”", text: "Say what you did and what came of it: “Handled data entry for 12,000 CRM records”.", tag: "check" },
      { title: "A profile about loving data", text: "Two lines on your degree, your experience and the role you want say more.", tag: "practice" },
      { title: "Coursework that doesn’t fit", text: "Statistics and databases help a data role. List what the job can use.", tag: "practice" },
      { title: "Numbers you can’t back up", text: "Only use a number you could explain in an interview.", tag: "practice" },
    ],
  },
  order: [
    { title: "Education", text: "On top while you’re in school or just graduated: degree, school, graduation month, and coursework that fits the job." },
    { title: "Projects", text: "Class and personal projects with real data. Name the tools and say what the analysis found or did." },
    { title: "Experience", text: "Internships, part-time jobs, research assistant roles. Newest first." },
    { title: "Skills", text: "SQL, Python, Excel, a BI tool, and the methods you’ve actually used." },
  ],
  rewrites: [
    { before: "Helped the team with weekly reports in Tableau", after: "Helped build weekly sales reports in Tableau for a team of {n}", answers: ["8"] },
    { before: "Responsible for data entry tasks", after: "Handled data entry for {n} CRM records", answers: ["12,000"] },
    { before: "Worked on a group project predicting churn", after: "Built a model in Python with a team of {n} to flag customers likely to cancel", answers: ["4"] },
  ],
  skills: ["SQL", "Excel", "Python", "pandas", "Tableau", "Power BI", "R", "Statistics", "Data cleaning", "Data visualization", "A/B testing", "Google Analytics"],
  myths: [
    { belief: "A skills chart looks data-savvy.", truth: "It’s a picture: the ATS reads nothing, and no recruiter can tell what “35% Excel” means. List the tools and show them in your bullets." },
    { belief: "Certificates count more than projects.", truth: "A project with real data and a finding shows more than a course badge. List both if you have them, projects first." },
    { belief: "One resume is enough for every application.", truth: "Each post asks for different tools. Keep one base resume and adjust the skills and first bullets for each job." },
  ],
};
