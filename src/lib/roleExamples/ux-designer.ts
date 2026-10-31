import type { RoleExample } from "./types";

/*
 * Amara Okafor is fictional: Interaction Design at Lakeside University, a UX
 * internship at Brightline Studio (fictional), two case studies on her
 * portfolio. Designers' first resumes tend to be designed: a photo, a chart of
 * tools, links as icons. That's what her "before" shows.
 */
export const uxDesigner: RoleExample = {
  title: "UX Designer",
  metaTitle: "Entry-Level UX Designer Resume: Example and Tips",
  metaDescription:
    "A full new-grad UX designer resume, before and after, scored by the same 19 checks as our free ATS scan. Why a designed resume can read as nothing, how to link your portfolio, and an example you can edit.",
  hero: {
    headline: ["A UX designer resume for your ", "first", " job."],
    sub: "Your portfolio shows your design. Your resume has to get it opened: one internship, a couple of case studies, and a link an ATS can read. With a full example you can edit.",
  },
  person: { first: "Amara", pronoun: "she", detail: "A photo, a tools chart, “Click here”" },

  before: {
    name: "Amara Okafor",
    tagline: "Creative UX/UI Designer",
    look: { side: "#c2410c", accent: "#fde68a", mark: "✦", photo: true },
    sidebar: [
      { heading: "Say Hello", pin: "contact", lines: ["amara.okafor@mail.com"], icons: ["Bē", "in", "✦"] },
      {
        heading: "My Toolbox",
        pin: "skills",
        chart: [
          { label: "Figma", value: 40 },
          { label: "Sketch", value: 20 },
          { label: "Illustrator", value: 20 },
          { label: "Prototyping", value: 20 },
        ],
      },
    ],
    main: [
      { heading: "Hello!", text: "I’m a creative, detail-oriented designer who loves making things beautiful and easy to use." },
      {
        heading: "Design Journey",
        pin: "headings",
        entries: [{ title: "Brightline Studio", sub: "Design Intern", bullets: ["Designed screens for the app", "Did user testing", "Made the design system"], pin: "numbers" }],
      },
      {
        heading: "Selected Work",
        entries: [
          { title: "Campus Eats redesign", bullets: ["Click here to see the case study"], pin: "bullets" },
          { title: "Bus tracker concept", pin: "structure" },
        ],
      },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "Interaction Design" }] },
    ],
  },

  after: {
    contact: {
      name: "Amara Okafor",
      email: "amara.okafor@mail.com",
      phone: "(555) 014-5512",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/amaraokafor",
      portfolio: "amaraokafor.design",
    },
    summary:
      "Interaction design graduate with a UX internship and two case studies on research-led redesigns. Looking for an entry-level UX designer role.",
    education: [
      {
        degree: "B.F.A.",
        fieldOfStudy: "Interaction Design",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Relevant coursework: User Research Methods, Interaction Design, Prototyping, Accessibility",
      },
    ],
    experience: [
      {
        title: "UX Design Intern",
        company: "Brightline Studio",
        location: "Lakeside, CA",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        bullets: [
          "Designed ⟦14⟧ screens for a grocery delivery app’s checkout flow in Figma and handed them off to ⟦3⟧ engineers",
          "Ran ⟦6⟧ moderated usability tests and changed the checkout layout based on what users missed",
          "Built ⟦40+⟧ reusable components for the studio’s Figma design system",
        ],
      },
    ],
    projects: [
      {
        name: "Campus Eats app redesign",
        role: "Case study",
        url: "amaraokafor.design/campus-eats",
        startDate: "Jan 2026",
        endDate: "Apr 2026",
        bullets: [
          "Interviewed ⟦10⟧ students about ordering food on campus and cut the order flow from ⟦7⟧ steps to ⟦4⟧",
          "Tested the new flow with ⟦5⟧ students; every one of them finished an order without help",
        ],
      },
      {
        name: "Campus bus tracker concept",
        role: "Figma, ProtoPie",
        url: "amaraokafor.design/bus-tracker",
        startDate: "Sep 2025",
        endDate: "Dec 2025",
        bullets: ["Designed and prototyped a real-time shuttle tracker with a high-contrast mode checked against WCAG AA"],
      },
    ],
    skills: {
      technical: ["Figma", "User research", "Usability testing", "Wireframing", "Prototyping", "Design systems", "Accessibility (WCAG)", "Adobe Illustrator", "HTML and CSS", "Interaction design"],
      soft: [],
    },
    isEntryLevel: true,
    themeColor: "#1E2024",
    photoUrl: "",
    language: "en",
  },

  changes: {
    contact: {
      before: "Links only as icons, no phone",
      after: "Portfolio, LinkedIn and phone as text",
      why: "Her portfolio, Behance and LinkedIn are icons, which are pictures: none of them reaches the ATS. And there’s no phone number.",
      whyAfter: "Email, phone, city, LinkedIn and her portfolio address on one line, written out.",
    },
    skills: {
      before: "Tools drawn as a chart",
      after: "Skills listed one by one",
      why: "Her tools are a chart, which is a picture: Figma never reaches the ATS.",
      whyAfter: "Methods and tools as plain text: usability testing, prototyping, Figma.",
    },
    headings: {
      why: "“Hello!”, “Design Journey” and “My Toolbox” aren’t section names an ATS looks for. It found no summary, no experience and no skills section.",
      whyAfter: "Education, Projects, Experience, Skills: names every ATS recognizes.",
    },
    numbers: {
      after: "Numbers she can back up",
      why: "“Designed screens”, “Did user testing”: tasks, not outcomes.",
      whyAfter: "Screens designed, tests run, steps removed. Her own answers, not estimates.",
    },
    bullets: {
      why: "“Click here to see the case study” sends the reader nowhere; in the text it’s just those words.",
      whyAfter: "The case study’s address is written out, and the bullets say what the work changed.",
    },
    structure: { why: "The bus tracker is just a title; there’s nothing under it to read." },
    length: {
      why: "A school and a major, and little else.",
      whyAfter: "Her graduation month, coursework and case study details she already had.",
    },
  },
  afterAnchors: {
    columns: "Amara Okafor",
    contact: "amaraokafor.design",
    headings: "EXPERIENCE",
    skills: "SKILLS",
    numbers: "moderated usability tests",
    bullets: "Interviewed",
    structure: "shuttle tracker",
    length: "Relevant coursework",
  },

  mistakes: {
    read: [
      { title: "Links as icons or “Click here”", text: "A Behance icon is a picture, and “Click here” is just two words. Write your portfolio address out.", tag: "see" },
      { title: "Tools as a chart", text: "A chart of Figma and Sketch is a picture. Nothing of it reaches the ATS.", tag: "see" },
      { title: "Decorative fonts", text: "Some fonts come out as the wrong characters when the PDF’s text is pulled out. Use a standard one.", tag: "practice" },
      { title: "A photo", text: "An ATS can’t read it, and most US employers prefer none.", tag: "practice" },
    ],
    match: [
      { title: "Headings like “Design Journey”", text: "Use Experience, Projects, Education and Skills. Save the voice for your portfolio.", tag: "check" },
      { title: "Tools without methods", text: "Figma is a tool. Posts ask for usability testing, prototyping and research. Name what you did.", tag: "practice" },
      { title: "Abbreviations only", text: "“IxD” or “IA” alone may not match. Write interaction design and information architecture.", tag: "practice" },
      { title: "Dates missing", text: "Projects and internships without dates leave the reader guessing.", tag: "practice" },
    ],
    reader: [
      { title: "Tasks instead of outcomes", text: "“Did user testing.” How many tests, and what changed because of them?", tag: "check" },
      { title: "A greeting instead of a summary", text: "“Hello! I’m a creative designer” says less than your degree and the role you want.", tag: "practice" },
      { title: "A layout that outshines the content", text: "Your portfolio is where design shows. Your resume should be easy to scan.", tag: "practice" },
      { title: "Case studies with no result", text: "Say what the research found and what the design changed.", tag: "practice" },
    ],
  },
  order: [
    { title: "Education", text: "On top while you’re in school or just graduated: degree, school, graduation month, relevant coursework." },
    { title: "Projects", text: "Your case studies, each with its address, the problem, the research and what the design changed." },
    { title: "Experience", text: "Internships, studio work, freelance clients. Newest first." },
    { title: "Skills", text: "Methods first (research, testing, prototyping), then tools." },
  ],
  rewrites: [
    { before: "Designed screens for the app", after: "Designed {n} screens for the checkout flow in Figma", answers: ["14"] },
    { before: "Did user testing", after: "Ran {n} moderated usability tests and changed the layout based on what users missed", answers: ["6"] },
    { before: "Made the design system", after: "Built {n} reusable components for the studio’s Figma design system", answers: ["40+"] },
  ],
  skills: ["Figma", "User research", "Usability testing", "Wireframing", "Prototyping", "Information architecture", "Interaction design", "Design systems", "Accessibility (WCAG)", "Visual design", "Journey mapping", "HTML and CSS"],
};
