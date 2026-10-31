import type { RoleExample } from "./types";

/*
 * Ryan Patel is fictional: Human Resource Management at Lakeside University,
 * an HR internship at Kestrel Manufacturing (fictional), a student job in the
 * campus student employment office, the SHRM student chapter. His "before"
 * repeats keywords, thinking repetition ranks higher. Nothing here names an
 * employee or a case.
 */
export const humanResources: RoleExample = {
  title: "Human Resources",
  metaTitle: "Entry-Level HR Resume (HR Coordinator): Example and Tips",
  metaDescription:
    "A full new-grad HR coordinator resume, before and after, scored by the same 19 checks as our free ATS scan. Why repeating keywords doesn't help, and an example you can edit.",
  hero: {
    headline: ["An HR resume for your ", "first", " job."],
    sub: "For an HR coordinator or assistant role, when your experience is an internship, a campus job and a student chapter. How it reads to an applicant tracking system, and a full example you can edit.",
  },
  person: { first: "Ryan", pronoun: "he", detail: "Repeated keywords, HRIS and I-9, “people person”" },

  before: {
    name: "Ryan Patel",
    tagline: "People Person",
    look: { side: "#6d28d9", accent: "#ddd6fe", mark: "❖" },
    sidebar: [
      { heading: "Contact", pin: "contact", lines: ["ryan.patel@mail.com", "Lakeside, CA"], icons: ["in"] },
      { heading: "HR Skills", pin: "skills", lines: ["HR, HR, Human Resources", "People person", "HRIS, I-9, EEO", "Good listener"] },
    ],
    main: [
      { heading: "Objective", text: "Seeking an HR position where I can use my people skills to make a positive impact on employees." },
      {
        heading: "What I’ve Done",
        pin: "headings",
        entries: [
          { title: "Kestrel Manufacturing", sub: "HR Intern", bullets: ["Helped with recruiting", "Did onboarding", "Handled HR paperwork"], pin: "numbers" },
          { title: "Student Employment Office", bullets: ["Helped students find jobs"], pin: "bullets" },
          { title: "SHRM Student Chapter", pin: "structure" },
        ],
      },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "HR" }] },
    ],
  },

  after: {
    contact: {
      name: "Ryan Patel",
      email: "ryan.patel@mail.com",
      phone: "(555) 014-5376",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/ryanpatel",
    },
    summary:
      "Human resource management graduate with an HR internship in a 400-person manufacturing company and two years in a campus student employment office. Looking for an HR coordinator role.",
    education: [
      {
        degree: "B.S.",
        fieldOfStudy: "Human Resource Management",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Relevant coursework: Employment Law, Compensation and Benefits, Talent Acquisition, Organizational Behavior",
      },
    ],
    experience: [
      {
        title: "Human Resources Intern",
        company: "Kestrel Manufacturing",
        location: "Lakeside, CA",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        bullets: [
          "Scheduled ⟦85⟧ interviews for ⟦14⟧ open roles and kept candidate status current in the applicant tracking system (Workday)",
          "Ran new hire onboarding paperwork for ⟦22⟧ employees, including I-9 employment eligibility verification",
          "Audited ⟦300+⟧ employee files for missing forms and fixed or flagged each one with HR",
        ],
      },
      {
        title: "Student Assistant, Student Employment Office",
        company: "Lakeside University",
        location: "Lakeside, CA",
        startDate: "Sep 2024",
        endDate: "May 2026",
        bullets: ["Answered ⟦40⟧ student job questions a week and processed hiring paperwork for ⟦150+⟧ student workers each semester"],
      },
      {
        title: "Events Chair, SHRM Student Chapter",
        company: "Lakeside University",
        location: "Lakeside, CA",
        startDate: "Sep 2024",
        endDate: "May 2025",
        bullets: ["Organized ⟦5⟧ talks with local HR leaders for ⟦60⟧ members"],
      },
    ],
    skills: {
      technical: ["Recruiting", "Interview scheduling", "Onboarding", "Applicant tracking (Workday)", "I-9 employment eligibility verification", "Benefits administration", "Employee records", "Employment law basics", "Excel", "Microsoft Office"],
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
      why: "There’s no phone number, and his LinkedIn is an icon: nothing of it reaches the ATS.",
      whyAfter: "Email, phone, city and LinkedIn on one line under his name.",
    },
    skills: {
      before: "Repeated keywords and bare acronyms",
      after: "HR skills listed one by one",
      why: "“HR, HR, Human Resources” and “HRIS, I-9, EEO”: repetition and acronyms, but few skills an ATS or recruiter can pick out.",
      whyAfter: "Recruiting, onboarding, I-9 verification, Workday: each once, written out.",
    },
    headings: {
      why: "“Objective” and “What I’ve Done” aren’t section names an ATS looks for. It found no summary and no experience.",
      whyAfter: "Summary, Education, Experience, Skills: names every ATS recognizes.",
    },
    numbers: {
      after: "Numbers he can back up",
      why: "“Helped with recruiting”, “Did onboarding”: how many roles, hires, files?",
      whyAfter: "Interviews scheduled, hires onboarded, files audited. His own answers, and nothing about any one employee.",
    },
    structure: { why: "The SHRM chapter is just a name; there’s nothing under it to read." },
    length: {
      why: "A school and “HR”, and little else.",
      whyAfter: "His degree, coursework and the details of three roles he already had.",
    },
  },
  afterAnchors: {
    columns: "Ryan Patel",
    contact: "ryan.patel@mail.com",
    skills: "SKILLS",
    headings: "SUMMARY",
    numbers: "Scheduled",
    bullets: "student job questions",
    structure: "talks with local HR leaders",
    length: "Relevant coursework",
  },

  mistakes: {
    read: [
      { title: "Two or more columns", text: "The parser reads across the page, so the sidebar runs into the main column.", tag: "see" },
      { title: "Contact details as icons", text: "A LinkedIn icon is a picture. Write the address out.", tag: "see" },
      { title: "Text in boxes or headers", text: "Some systems skip text boxes and page headers. Keep everything in the body.", tag: "practice" },
      { title: "A scanned or image PDF", text: "If you can’t select the text, no ATS can read it either.", tag: "check" },
    ],
    match: [
      { title: "Repeating keywords", text: "“HR, HR, Human Resources.” Recruiters search for a term; saying it three times doesn’t rank you higher.", tag: "see" },
      { title: "Acronyms only: HRIS, I-9, EEO", text: "Write the full term once: human resources information system (HRIS).", tag: "practice" },
      { title: "Systems unnamed", text: "Name the tools: Workday, ADP, BambooHR. Posts search for them.", tag: "practice" },
      { title: "Headings like “What I’ve Done”", text: "Use Summary, Experience, Education and Skills.", tag: "check" },
    ],
    reader: [
      { title: "“People person”", text: "Every HR resume says it. Show the process: hires onboarded, interviews scheduled, files audited.", tag: "practice" },
      { title: "Confidential details", text: "Never name employees or describe cases. Counts and processes only.", tag: "practice" },
      { title: "Duties instead of results", text: "“Handled HR paperwork.” What paperwork, for how many people?", tag: "check" },
      { title: "An objective line", text: "Two lines on your degree, your experience and the role you want say more.", tag: "practice" },
    ],
  },
  order: [
    { title: "Education", text: "Degree, school, graduation month, and HR coursework like employment law and compensation." },
    { title: "Experience", text: "HR internships, campus employment or residence life jobs, recruiting for clubs. Newest first." },
    { title: "Skills", text: "Processes (recruiting, onboarding, I-9) and systems (Workday, ADP) by name." },
    { title: "Certifications", text: "A SHRM or HRCI certification only once you hold it; student membership can go in Experience." },
  ],
  rewrites: [
    { before: "Helped with recruiting", after: "Scheduled {n} interviews for 14 open roles in the applicant tracking system", answers: ["85"] },
    { before: "Did onboarding", after: "Ran new hire onboarding paperwork for {n} employees, including I-9 verification", answers: ["22"] },
    { before: "Handled HR paperwork", after: "Audited {n} employee files for missing forms and fixed or flagged each one", answers: ["300+"] },
  ],
  skills: ["Recruiting", "Interview scheduling", "Onboarding", "Applicant tracking", "Workday", "I-9 verification", "Benefits administration", "Employee records", "Employment law", "Payroll", "Excel", "Microsoft Office"],
  myths: [
    { belief: "Repeat key terms to rank higher.", truth: "Recruiters search for a term; repeating it doesn’t move you up the list, and it reads oddly to the person who opens your resume." },
    { belief: "HR is about people skills, so lead with them.", truth: "Every HR resume says so. Show the work: interviews scheduled, people onboarded, files audited." },
    { belief: "Campus jobs aren’t HR experience.", truth: "A student employment office or residence life job is hiring, paperwork and policy. List it, with numbers." },
  ],
};
