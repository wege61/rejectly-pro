import type { RoleExample } from "./types";

/*
 * Omar Haddad is fictional: Accounting at Lakeside University, an audit
 * internship at Pryor & Webb LLP (fictional), IRS VITA volunteer tax
 * preparation, club treasurer. His "before" mixes date formats, which the
 * date check catches, and puts "CPA" after his name, which he isn't yet.
 */
export const accountant: RoleExample = {
  title: "Accountant",
  metaTitle: "Entry-Level Accountant Resume: Example and Tips",
  metaDescription:
    "A full new-grad staff accountant resume, before and after, scored by the same 19 checks as our free ATS scan. Consistent dates, the CPA title, and an example you can edit.",
  hero: {
    headline: ["An accountant resume for your ", "first", " job."],
    sub: "For a staff accountant or audit associate role, when your experience is an internship, volunteer tax returns and a club’s books. How it reads to an applicant tracking system, and a full example you can edit.",
  },
  person: { first: "Omar", pronoun: "he", detail: "Mixed dates, “CPA”, “Excel: Expert”" },

  before: {
    name: "Omar Haddad, CPA",
    tagline: "Future Big Four Leader",
    look: { side: "#1e3a5f", accent: "#93c5fd", mark: "▪" },
    sidebar: [
      { heading: "Contact", pin: "contact", lines: ["omar.haddad@mail.com", "Lakeside, CA"], icons: ["in"] },
      { heading: "Expertise", pin: "skills", bars: [{ label: "Excel", level: 5 }, { label: "Accounting", level: 5 }, { label: "Attention to detail", level: 5 }] },
    ],
    main: [
      { heading: "Professional Profile", text: "Detail-oriented, 100% accurate accounting professional with a passion for numbers." },
      {
        heading: "Professional Background",
        pin: "headings",
        entries: [
          { title: "Pryor & Webb LLP", sub: "Audit Intern, 01/2026 – 04/2026", bullets: ["Did audit work", "Reconciled accounts", "Used accounting software"], pin: "numbers" },
          { title: "IRS VITA Program", sub: "Volunteer, Spring ’25", bullets: ["Prepared tax returns"], pin: "bullets" },
          { title: "Accounting Society", sub: "Treasurer, Sep 2024 – Present", pin: "structure" },
        ],
      },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "Accounting, 2026" }] },
    ],
  },

  after: {
    contact: {
      name: "Omar Haddad",
      email: "omar.haddad@mail.com",
      phone: "(555) 014-3091",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/omarhaddad",
    },
    summary:
      "Accounting graduate with an audit internship at a regional CPA firm and two seasons of volunteer tax preparation. CPA exam candidate. Looking for a staff accountant or audit associate role.",
    education: [
      {
        degree: "B.S.",
        fieldOfStudy: "Accounting",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Relevant coursework: Intermediate Accounting I and II, Auditing, Federal Taxation, Cost Accounting. CPA exam candidate.",
      },
    ],
    experience: [
      {
        title: "Audit Intern",
        company: "Pryor & Webb LLP",
        location: "Lakeside, CA",
        startDate: "Jan 2026",
        endDate: "Apr 2026",
        bullets: [
          "Tested ⟦60⟧ cash and accounts payable samples for ⟦3⟧ nonprofit audit clients and documented each in the workpapers",
          "Reconciled ⟦2,400⟧ general ledger lines to bank statements in Excel using pivot tables and VLOOKUP",
          "Drafted the cash and accounts payable sections of the financial statements for the senior’s review",
        ],
      },
      {
        title: "Volunteer Tax Preparer (IRS VITA)",
        company: "Lakeside Community Center",
        location: "Lakeside, CA",
        startDate: "Feb 2025",
        endDate: "Apr 2026",
        bullets: ["Prepared ⟦45⟧ federal and state returns for low-income families over ⟦2⟧ tax seasons, each checked by a second preparer"],
      },
      {
        title: "Treasurer, Accounting Society",
        company: "Lakeside University",
        location: "Lakeside, CA",
        startDate: "Sep 2024",
        endDate: "May 2026",
        bullets: ["Kept the books for a ⟦$12,000⟧ annual budget in QuickBooks and closed each month within ⟦5⟧ days"],
      },
    ],
    skills: {
      technical: ["GAAP", "Account reconciliation", "Journal entries", "Accounts payable", "Accounts receivable", "Financial statements", "Excel (pivot tables, VLOOKUP)", "QuickBooks", "Tax preparation", "Audit sampling"],
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
      whyAfter: "Email, phone, city and LinkedIn on one line under his name, without a title he doesn’t hold.",
    },
    skills: {
      before: "Skills rated with bars",
      after: "Accounting skills listed one by one",
      why: "“Excel ●●●●●, Accounting ●●●●●” reads as three words. The skills an accounting post asks for never appear.",
      whyAfter: "GAAP, reconciliations, journal entries, QuickBooks: the words accounting posts use.",
    },
    headings: {
      why: "“Professional Background” isn’t a section name an ATS looks for, so it found no experience. (“Professional Profile” got through as a summary.)",
      whyAfter: "Summary, Education, Experience, Skills: names every ATS recognizes.",
    },
    numbers: {
      after: "Numbers he can back up",
      why: "“Did audit work.” What did you test, how much of it, for whom?",
      whyAfter: "Samples tested, ledger lines reconciled, returns prepared, a budget kept. His own answers.",
    },
    structure: { before: "Mixed date formats and empty entries", why: "“01/2026”, “Spring ’25”, “Sep 2024”: three formats on one page. And the treasurer role has nothing under it.", whyAfter: "One date format throughout, and a bullet under every role." },
    length: {
      why: "A school, a major and a year, and little else.",
      whyAfter: "His graduation month, coursework, CPA exam status and details of three roles he already had.",
    },
  },
  afterAnchors: {
    columns: "Omar Haddad",
    contact: "omar.haddad@mail.com",
    skills: "SKILLS",
    headings: "EXPERIENCE",
    numbers: "cash and accounts payable samples",
    bullets: "federal and state returns",
    structure: "annual budget",
    length: "Relevant coursework",
  },

  mistakes: {
    read: [
      { title: "Two or more columns", text: "The parser reads across the page, so the sidebar runs into the main column.", tag: "see" },
      { title: "Skills rated with bars", text: "“Excel ●●●●●” reads as one word. Show the skill: “reconciled 2,400 ledger lines”.", tag: "see" },
      { title: "Numbers laid out in a table", text: "Cells come out as one line with wide gaps. Put figures in sentences.", tag: "practice" },
      { title: "Contact details as icons", text: "A LinkedIn icon is a picture. Write the address out.", tag: "see" },
    ],
    match: [
      { title: "Mixed date formats", text: "“01/2026”, “Spring ’25”, “Sep 2024”. Pick one format and use it everywhere.", tag: "check" },
      { title: "“CPA” after your name too early", text: "Only licensed CPAs may use the title. Write “CPA exam candidate”: honest, and still searchable.", tag: "practice" },
      { title: "“Accounting software”", text: "Name it: QuickBooks, NetSuite, SAP. Posts search for the tool.", tag: "practice" },
      { title: "Headings like “Professional Background”", text: "Use Summary, Experience, Education and Skills.", tag: "check" },
    ],
    reader: [
      { title: "Claims like “100% accurate”", text: "Unprovable, and a red flag to an auditor. Show your accuracy through what was reviewed.", tag: "practice" },
      { title: "Typos and wrong figures", text: "In accounting, one wrong number on your resume says a lot. Check every figure twice.", tag: "practice" },
      { title: "Duties instead of results", text: "“Reconciled accounts.” How many, how often, with what tool?", tag: "check" },
      { title: "Leaving out volunteer returns or club books", text: "VITA returns and a treasurer’s ledger are real accounting work. Keep them, with numbers.", tag: "practice" },
    ],
  },
  order: [
    { title: "Education", text: "Degree, school, graduation month, accounting coursework, and your CPA exam status." },
    { title: "Experience", text: "Audit or tax internships, VITA, bookkeeping jobs, treasurer roles. Newest first." },
    { title: "Skills", text: "GAAP, reconciliations, journal entries, and the software by name." },
    { title: "Certifications", text: "Only what you hold, with the date. Exam progress goes in Education or the summary." },
  ],
  rewrites: [
    { before: "Did audit work", after: "Tested {n} cash and accounts payable samples for 3 nonprofit audit clients", answers: ["60"] },
    { before: "Reconciled accounts", after: "Reconciled {n} general ledger lines to bank statements in Excel", answers: ["2,400"] },
    { before: "Prepared tax returns", after: "Prepared {n} federal and state returns as an IRS VITA volunteer, each checked by a second preparer", answers: ["45"] },
  ],
  skills: ["GAAP", "Account reconciliation", "Journal entries", "General ledger", "Accounts payable", "Accounts receivable", "Financial statements", "Month-end close", "Excel (pivot tables, VLOOKUP)", "QuickBooks", "NetSuite", "Tax preparation"],
  myths: [
    { belief: "Write “CPA” to show where you’re headed.", truth: "Using the title before you’re licensed can break state rules, and firms check. “CPA exam candidate” is honest and still searchable." },
    { belief: "“Excel: Expert” proves you know Excel.", truth: "Everyone writes it. Pivot tables, VLOOKUP and “reconciled 2,400 ledger lines” prove it." },
    { belief: "Unpaid work doesn’t count.", truth: "Volunteer tax returns and a club’s books are real accounting. List them with numbers." },
  ],
};
