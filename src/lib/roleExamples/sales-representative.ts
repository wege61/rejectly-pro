import type { RoleExample } from "./types";

/*
 * Lucía Gómez is fictional: Communication at Lakeside University, a sales
 * development internship at Quillstack (fictional), a retail job at Harbor
 * Outfitters (fictional), the alumni phonathon. A first sales job is usually
 * an SDR/BDR role. Her "before" uses emoji, which the encoding check catches.
 */
export const salesRepresentative: RoleExample = {
  title: "Sales Representative",
  metaTitle: "Entry-Level Sales Resume (SDR/BDR): Example and Tips",
  metaDescription:
    "A full new-grad sales development (SDR/BDR) resume, before and after, scored by the same 19 checks as our free ATS scan. Numbers with context, why emoji backfire, and an example you can edit.",
  hero: {
    headline: ["A sales resume for your ", "first", " job."],
    sub: "For an SDR or BDR role, when your experience is a sales internship, a retail job and a phonathon. How it reads to an applicant tracking system, and a full example you can edit.",
  },
  person: { first: "Lucía", pronoun: "she", detail: "Emoji, a photo, “My Wins”" },

  before: {
    name: "Lucía Gómez",
    tagline: "Sales Superstar 🚀",
    look: { side: "#0f766e", accent: "#fde047", mark: "★", photo: true },
    sidebar: [
      { heading: "Reach Me", pin: "contact", lines: ["lucia.gomez@mail.com"], icons: ["in"] },
      { heading: "Superpowers", pin: "skills", lines: ["Closer", "Hunter", "People person", "Hustler"] },
    ],
    main: [
      { heading: "My Wins", pin: "headings", text: "Hungry, competitive closer who LOVES the thrill of the deal!!" },
      {
        heading: "Where I’ve Hustled",
        entries: [
          { title: "Quillstack", sub: "Sales Intern", bullets: ["Crushed my call targets 🔥", "Booked tons of meetings", "Used a CRM"], pin: "numbers" },
          { title: "Harbor Outfitters", sub: "Sales Associate", bullets: ["Hit 110%!!"], pin: "bullets" },
          { title: "Alumni Phonathon", pin: "structure" },
        ],
      },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "Communication" }] },
    ],
  },

  after: {
    contact: {
      name: "Lucía Gómez",
      email: "lucia.gomez@mail.com",
      phone: "(555) 014-2783",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/luciagomez",
    },
    summary:
      "Communication graduate with a sales development internship at a software company and two years of retail and phone fundraising. Looking for an SDR or BDR role.",
    education: [
      {
        degree: "B.A.",
        fieldOfStudy: "Communication",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Relevant coursework: Persuasion, Business Writing, Negotiation, Public Speaking",
      },
    ],
    experience: [
      {
        title: "Sales Development Intern",
        company: "Quillstack",
        location: "Lakeside, CA",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        bullets: [
          "Made ⟦50⟧ cold calls a day on average and booked ⟦18⟧ demos for the account executives in ⟦10⟧ weeks",
          "Wrote and tested ⟦3⟧ email sequences in HubSpot; the best one got a ⟦12%⟧ reply rate",
          "Logged every call, email and next step in HubSpot so the account executives could pick up each lead",
        ],
      },
      {
        title: "Student Caller, Alumni Phonathon",
        company: "Lakeside University",
        location: "Lakeside, CA",
        startDate: "Sep 2024",
        endDate: "May 2026",
        bullets: ["Raised ⟦$8,200⟧ from alumni over ⟦2⟧ semesters of evening calls"],
      },
      {
        title: "Sales Associate",
        company: "Harbor Outfitters",
        location: "Lakeside, CA",
        startDate: "Jun 2023",
        endDate: "Aug 2024",
        bullets: ["Reached ⟦110%⟧ of my monthly sales target in ⟦4⟧ of ⟦6⟧ months and opened ⟦70+⟧ loyalty accounts"],
      },
    ],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Spanish", proficiency: "Native" },
    ],
    skills: {
      technical: ["Cold calling", "Prospecting", "Lead qualification", "Email outreach", "HubSpot CRM", "LinkedIn Sales Navigator", "Objection handling", "Pipeline tracking", "Excel", "Public speaking"],
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
      why: "There’s no phone number, which a sales team will want, and her LinkedIn is an icon: nothing of it reaches the ATS.",
      whyAfter: "Email, phone, city and LinkedIn on one line under her name.",
    },
    headings: {
      why: "“My Wins” and “Where I’ve Hustled” aren’t section names an ATS looks for. It found no summary, no experience and no skills section.",
      whyAfter: "Summary, Education, Experience, Skills: names every ATS recognizes.",
    },
    numbers: {
      after: "Numbers with context",
      why: "“Crushed my call targets”, “Booked tons of meetings”: no numbers, so no way to tell.",
      whyAfter: "Calls a day, demos booked, reply rate, money raised, each with its time frame. Her own answers.",
    },
    bullets: {
      why: "Emoji and arrows instead of bullets: they can come out as stray characters, and the lines don’t read as a list.",
      whyAfter: "The standard • and plain text. The numbers do the standing out.",
    },
    skills: {
      before: "Nicknames instead of skills",
      after: "Skills listed one by one",
      why: "“Closer, Hunter, People person, Hustler” isn’t a single skill an ATS or a recruiter can search for.",
      whyAfter: "Prospecting methods and tools as plain text: cold calling, lead qualification, HubSpot.",
    },
    structure: { why: "The phonathon is just a title; there’s nothing under it to read." },
    length: {
      why: "A school and a major, a list of nicknames, and little else.",
      whyAfter: "Her graduation month, coursework, languages and the details of three jobs she already had.",
    },
  },
  afterAnchors: {
    columns: "Lucía Gómez",
    contact: "lucia.gomez@mail.com",
    headings: "SUMMARY",
    numbers: "cold calls a day",
    bullets: "loyalty accounts",
    structure: "Raised",
    length: "Relevant coursework",
    skills: "SKILLS",
  },

  mistakes: {
    read: [
      { title: "Emoji and symbols", text: "🚀 and 🔥 can come out as stray characters or nothing. Let the numbers stand out.", tag: "check" },
      { title: "Two or more columns", text: "The parser reads across the page, so the sidebar runs into the main column.", tag: "see" },
      { title: "Contact details as icons", text: "A LinkedIn icon is a picture. Write the address out, and add a phone number.", tag: "see" },
      { title: "A photo", text: "An ATS can’t read it, and most US employers prefer none.", tag: "practice" },
    ],
    match: [
      { title: "Headings like “My Wins”", text: "Use Summary, Experience, Education and Skills.", tag: "check" },
      { title: "Nicknames instead of skills", text: "“Closer” and “hunter” match no search. Cold calling and lead qualification do.", tag: "practice" },
      { title: "“Used a CRM”", text: "Name it: HubSpot, Salesforce. Posts search for the tool.", tag: "practice" },
      { title: "Dates missing", text: "A sales team wants to know how long you held each target.", tag: "practice" },
    ],
    reader: [
      { title: "Percentages with no base", text: "“Hit 110%” of what, and how often? Say the target and the period.", tag: "practice" },
      { title: "Exclamation marks and hype", text: "“LOVES the thrill of the deal!!” Numbers convince; adjectives don’t.", tag: "practice" },
      { title: "Duties instead of results", text: "“Booked tons of meetings.” How many, in how long?", tag: "check" },
      { title: "Leaving out retail or phone jobs", text: "They’re sales: strangers, targets, rejection. Keep them, with numbers.", tag: "practice" },
    ],
  },
  order: [
    { title: "Education", text: "On top while you’re in school or just graduated: degree, school, graduation month." },
    { title: "Experience", text: "Sales internships, retail, phonathons, fundraising, anything with a target. Newest first, numbers in every bullet." },
    { title: "Skills", text: "Prospecting methods and the tools you used: HubSpot, Salesforce, Sales Navigator." },
    { title: "Languages", text: "A second language is a real asset in sales. List it with your level." },
  ],
  rewrites: [
    { before: "Crushed my call targets", after: "Made {n} cold calls a day on average and booked 18 demos in 10 weeks", answers: ["50"] },
    { before: "Booked tons of meetings", after: "Booked {n} demos for the account executives in 10 weeks", answers: ["18"] },
    { before: "Hit 110%!!", after: "Reached 110% of my monthly sales target in {n} of 6 months", answers: ["4"] },
  ],
  skills: ["Cold calling", "Prospecting", "Lead qualification", "Email outreach", "Objection handling", "Salesforce", "HubSpot", "LinkedIn Sales Navigator", "Pipeline tracking", "Negotiation", "Excel", "Public speaking"],
  myths: [
    { belief: "Round your numbers up; big numbers impress.", truth: "Sales interviews dig into every number: the target, the period, how you got there. Exact numbers you can explain beat big ones you can’t." },
    { belief: "Emoji and bold colors make you memorable.", truth: "They can come out as stray characters or nothing at all. Numbers make you memorable." },
    { belief: "Retail and phone jobs aren’t “real” sales experience.", truth: "They’re exactly what a first sales role looks for: talking to strangers, hitting targets, handling no. Keep them, with numbers." },
  ],
};
