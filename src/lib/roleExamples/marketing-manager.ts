import type { RoleExample } from "./types";

/*
 * Priya Nair is fictional: Marketing at Lakeside University, a summer marketing
 * internship at Fernwood Coffee Co. (fictional), promotions for the campus
 * radio station. A first marketing job is usually a coordinator or associate
 * role, so the page speaks to that. Her "before" hides keywords in white text,
 * which the ATS view shows plainly.
 */
export const marketingManager: RoleExample = {
  title: "Marketing",
  metaTitle: "Entry-Level Marketing Resume: Example and Tips",
  metaDescription:
    "A full new-grad marketing resume (coordinator or associate), before and after, scored by the same 19 checks as our free ATS scan. Why hidden keywords backfire, and an example you can edit.",
  hero: {
    headline: ["A marketing resume for your ", "first", " job."],
    sub: "For a coordinator or associate role, when your experience is an internship, a student job and a class project. How it reads to an applicant tracking system, and a full example you can edit.",
  },
  person: { first: "Priya", pronoun: "she", detail: "Hidden keywords, star ratings, “Brand Me”" },

  before: {
    name: "Priya Nair",
    tagline: "Social Media Guru",
    look: { side: "#9d174d", accent: "#fbcfe8", mark: "♥" },
    sidebar: [
      { heading: "Let’s Connect", pin: "contact", lines: ["priya.nair@mail.com"], icons: ["in", "IG"] },
      {
        heading: "Toolkit",
        pin: "skills",
        bars: [
          { label: "Instagram", level: 5 },
          { label: "TikTok", level: 5 },
          { label: "Canva", level: 4 },
          { label: "Copywriting", level: 4 },
        ],
      },
    ],
    main: [
      {
        heading: "Brand Me",
        pin: "headings",
        text: "Creative storyteller and social media guru who lives and breathes brands.",
        hidden: "SEO SEM content marketing digital marketing email marketing Google Ads HubSpot Salesforce brand strategy growth marketing",
      },
      {
        heading: "Campaigns I’ve Loved",
        entries: [{ title: "Fernwood Coffee Co.", sub: "Marketing Intern", bullets: ["Ran social media", "Wrote newsletters", "Grew followers a lot"], pin: "numbers" }],
      },
      {
        heading: "Campus Life",
        entries: [
          { title: "WLKU Campus Radio", bullets: ["Promotions for events"], pin: "bullets" },
          { title: "Bakery brand audit (class project)", pin: "structure" },
        ],
      },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "Marketing" }] },
    ],
  },

  after: {
    contact: {
      name: "Priya Nair",
      email: "priya.nair@mail.com",
      phone: "(555) 014-6604",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/priyanair",
    },
    summary:
      "Marketing graduate with a social media and email internship at a local coffee brand. Looking for an entry-level marketing coordinator role in content and social.",
    education: [
      {
        degree: "B.S.",
        fieldOfStudy: "Marketing",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Relevant coursework: Consumer Behavior, Digital Marketing, Marketing Research, Brand Strategy",
      },
    ],
    experience: [
      {
        title: "Marketing Intern",
        company: "Fernwood Coffee Co.",
        location: "Lakeside, CA",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        bullets: [
          "Planned and posted ⟦60⟧ Instagram and TikTok posts over the summer; followers grew from ⟦2,100⟧ to ⟦3,400⟧",
          "Wrote ⟦8⟧ weekly email newsletters in Mailchimp to ⟦5,000+⟧ subscribers, with a ⟦31%⟧ average open rate",
          "Set up UTM links and a Google Analytics report to compare website visits from each channel",
        ],
      },
      {
        title: "Promotions Director",
        company: "WLKU Campus Radio",
        location: "Lakeside, CA",
        startDate: "Sep 2024",
        endDate: "May 2026",
        bullets: ["Promoted ⟦12⟧ campus events with posters and social posts designed in Canva"],
      },
    ],
    projects: [
      {
        name: "Brand audit for a local bakery",
        role: "Marketing Research course",
        startDate: "Jan 2026",
        endDate: "Apr 2026",
        bullets: ["Surveyed ⟦85⟧ customers and recommended ⟦3⟧ changes to the bakery’s Instagram; the owner adopted ⟦2⟧ of them"],
      },
    ],
    certifications: [{ name: "Google Analytics Certification", issuer: "Google", date: "Oct 2025" }],
    skills: {
      technical: ["Social media marketing", "Content creation", "Email marketing", "Mailchimp", "Google Analytics", "Canva", "Copywriting", "Market research", "Meta Business Suite", "Excel"],
      soft: [],
    },
    isEntryLevel: true,
    themeColor: "#1E2024",
    photoUrl: "",
    language: "en",
  },

  changes: {
    contact: {
      before: "No phone, links only as icons",
      after: "Phone and LinkedIn as text",
      why: "There’s no phone number, and her LinkedIn and Instagram are icons: nothing of them reaches the ATS.",
      whyAfter: "Email, phone, city and LinkedIn on one line under her name.",
    },
    skills: {
      before: "Skills as star ratings",
      after: "Skills listed one by one",
      why: "Her toolkit is rated with dots, and the hidden keywords aren’t skills she shows anywhere. Too few real skills come through.",
      whyAfter: "Ten skills as plain text, each one backed by a bullet or a course.",
    },
    headings: {
      why: "“Brand Me”, “Campaigns I’ve Loved” and “Toolkit” aren’t section names an ATS looks for. It found no summary, no experience and no skills section.",
      whyAfter: "Summary, Education, Projects, Experience, Skills: names every ATS recognizes.",
    },
    numbers: {
      after: "Numbers she can back up",
      why: "“Grew followers a lot.” From what, to what, over how long?",
      whyAfter: "Posts, followers before and after, newsletter opens. Her own answers, not estimates.",
    },
    structure: { why: "The bakery project is just a title; there’s nothing under it to read." },
    length: {
      why: "A school and a major, and little else.",
      whyAfter: "Her graduation month, coursework, a certification and project details she already had.",
    },
  },
  afterAnchors: {
    columns: "Priya Nair",
    contact: "priya.nair@mail.com",
    headings: "SUMMARY",
    skills: "SKILLS",
    numbers: "Instagram and TikTok",
    bullets: "campus events",
    structure: "Surveyed",
    length: "Relevant coursework",
  },

  mistakes: {
    read: [
      { title: "Keywords hidden in white text", text: "The ATS pulls out all the text, white or not, and recruiters see it. Switch the view above.", tag: "see" },
      { title: "Skills rated with stars", text: "“Instagram ●●●●●” reads as one word. Show the skill in a bullet instead.", tag: "see" },
      { title: "An infographic resume", text: "Icons, charts and color blocks look creative and often read as jumbled text.", tag: "practice" },
      { title: "Logos and text inside images", text: "A brand logo or a heading drawn as an image reaches the ATS as nothing.", tag: "practice" },
    ],
    match: [
      { title: "Headings like “Brand Me”", text: "Use Summary, Experience, Projects, Education and Skills.", tag: "check" },
      { title: "Buzzwords instead of skills", text: "“Guru” and “storyteller” match no search. Content creation and email marketing do.", tag: "practice" },
      { title: "Platform names only", text: "Instagram is a platform. Social media marketing is the skill a post asks for. Name both.", tag: "practice" },
      { title: "Certifications without the issuer", text: "Write Google Analytics Certification, Google, and the date.", tag: "practice" },
    ],
    reader: [
      { title: "Growth with no starting point", text: "“Grew followers to 3,400” from what, and over how long? Give both ends.", tag: "check" },
      { title: "Results the whole team made", text: "Say what your part was. Interviews ask.", tag: "practice" },
      { title: "A paragraph about loving brands", text: "Two plain lines on your degree, your experience and the role you want.", tag: "practice" },
      { title: "Long blocks of text", text: "One or two lines per bullet, starting with what you did.", tag: "check" },
    ],
  },
  order: [
    { title: "Education", text: "On top while you’re in school or just graduated, with coursework that fits the role." },
    { title: "Projects", text: "Class projects with a real client, brand audits, campaigns you ran. What you did and what changed." },
    { title: "Experience", text: "Internships, student jobs, campus media. Newest first, with numbers for reach and results." },
    { title: "Skills", text: "Channels and methods (social, email, content), then tools. Certifications in their own section." },
  ],
  rewrites: [
    { before: "Ran social media", after: "Planned and posted {n} Instagram and TikTok posts over the summer", answers: ["60"] },
    { before: "Wrote newsletters", after: "Wrote {n} weekly email newsletters in Mailchimp, with a 31% average open rate", answers: ["8"] },
    { before: "Promotions for events", after: "Promoted {n} campus events with posters and social posts designed in Canva", answers: ["12"] },
  ],
  skills: ["Social media marketing", "Content creation", "Copywriting", "Email marketing", "Google Analytics", "SEO", "Canva", "Market research", "Meta Business Suite", "HubSpot", "Excel", "Campaign reporting"],
  myths: [
    { belief: "Hide the post’s keywords in white text to get past the filter.", truth: "The ATS pulls out every word, white or not, and recruiters see it in the parsed resume. It reads as gaming the system. Use the words where they’re true." },
    { belief: "A creative, designed resume shows you’re a marketer.", truth: "Show it in your portfolio and your results. A designed resume often comes out as jumbled text, and the recruiter never sees the design." },
    { belief: "Big follower numbers speak for themselves.", truth: "Without a starting point and a time frame, they say little. “From 2,100 to 3,400 in a summer” says a lot." },
  ],
};
