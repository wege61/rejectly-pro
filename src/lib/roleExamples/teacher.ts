import type { RoleExample } from "./types";

/*
 * Jamal Wright is fictional: Liberal Studies at Lakeside University with a
 * preliminary multiple subject credential, student teaching in a third grade
 * classroom at Maple Street Elementary (fictional), summer camp and tutoring.
 * Nothing here names or describes a student.
 */
export const teacher: RoleExample = {
  title: "Teacher",
  metaTitle: "First-Year Teacher Resume: Example and Tips",
  metaDescription:
    "A full first-year teacher resume, before and after, scored by the same 19 checks as our free ATS scan. How to list student teaching and your credential, and an example you can edit.",
  hero: {
    headline: ["A teacher resume for your ", "first", " classroom."],
    sub: "When your experience is student teaching, tutoring and a summer camp: how to list them and your credential, and how it reads to the applicant tracking systems districts use. With a full example you can edit.",
  },
  person: { first: "Jamal", pronoun: "he", detail: "A philosophy paragraph, “Certified!”, no grade level" },

  before: {
    name: "Jamal Wright",
    tagline: "Passionate Educator",
    look: { side: "#15803d", accent: "#fde047", mark: "✎", photo: true },
    sidebar: [
      { heading: "Contact", pin: "contact", lines: ["jamal.wright@mail.com"] },
      { heading: "Teacher Traits", pin: "skills", bars: [{ label: "Patience", level: 5 }, { label: "Creativity", level: 5 }, { label: "Kindness", level: 5 }] },
      { heading: "Credential", lines: ["Certified!"] },
    ],
    main: [
      {
        heading: "My Teaching Philosophy",
        text: "I believe every child can learn and deserves a safe, joyful classroom where curiosity is celebrated, mistakes are welcomed and every voice is heard, because education is the key to unlocking each student’s potential.",
      },
      {
        heading: "My Classroom Journey",
        pin: "headings",
        entries: [
          { title: "Maple Street Elementary", sub: "Student Teacher", bullets: ["Inspired young minds", "Taught lessons", "Managed the classroom"], pin: "numbers" },
          { title: "Camp Willow", bullets: ["Worked with kids"], pin: "bullets" },
          { title: "Tutoring", pin: "structure" },
        ],
      },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "Liberal Studies" }] },
      { heading: "References", text: "Available upon request." },
    ],
  },

  after: {
    contact: {
      name: "Jamal Wright",
      email: "jamal.wright@mail.com",
      phone: "(555) 014-6245",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/jamalwright",
    },
    summary:
      "New elementary teacher with a preliminary California multiple subject credential and a full semester of student teaching in third grade. Looking for a first-year teaching position in grades 2 to 5.",
    education: [
      {
        degree: "B.A.",
        fieldOfStudy: "Liberal Studies, with a preliminary multiple subject teaching credential",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Coursework: Teaching Reading, Mathematics Methods, Classroom Management, Teaching English Learners",
      },
    ],
    experience: [
      {
        title: "Student Teacher, Grade 3",
        company: "Maple Street Elementary, Lakeside Unified School District",
        location: "Lakeside, CA",
        startDate: "Jan 2026",
        endDate: "May 2026",
        bullets: [
          "Planned and taught daily math and reading lessons for a class of ⟦26⟧ students, ⟦6⟧ of them English learners",
          "Used weekly exit tickets as formative assessment to regroup students for small-group reading; the share meeting the fractions unit goal rose from ⟦60%⟧ to ⟦81%⟧",
          "Led the class on my own for the last ⟦4⟧ weeks of the semester, following the school’s classroom management plan",
        ],
      },
      {
        title: "Math and Reading Tutor",
        company: "Lakeside Learning Center",
        location: "Lakeside, CA",
        startDate: "Sep 2024",
        endDate: "Dec 2025",
        bullets: ["Tutored ⟦8⟧ students in grades 2 to 5 each week and sent a short progress note to families after every session"],
      },
      {
        title: "Camp Counselor",
        company: "Camp Willow",
        location: "Lakeside, CA",
        startDate: "Jun 2024",
        endDate: "Aug 2024",
        bullets: ["Led a cabin group of ⟦10⟧ campers aged 8 to 10 and ran ⟦3⟧ daily outdoor science activities"],
      },
    ],
    certifications: [
      { name: "Preliminary Multiple Subject Teaching Credential", issuer: "California Commission on Teacher Credentialing", date: "Jun 2026" },
      { name: "CPR and First Aid", issuer: "American Red Cross", date: "Mar 2026" },
    ],
    skills: {
      technical: ["Lesson planning", "Classroom management", "Differentiated instruction", "Formative assessment", "Small-group reading instruction", "Supporting English learners", "Google Classroom", "Tutoring", "Family communication", "Microsoft Office"],
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
      why: "Only an email: no phone number for a principal to call and no LinkedIn.",
      whyAfter: "Email, phone, city and LinkedIn on one line under his name.",
    },
    skills: {
      before: "Traits instead of teaching skills",
      after: "Teaching skills listed one by one",
      why: "Patience, creativity and kindness rated with dots: no teaching skill an ATS or a principal can search for.",
      whyAfter: "Lesson planning, classroom management, formative assessment: the words districts use.",
    },
    headings: {
      why: "“My Teaching Philosophy”, “My Classroom Journey” and “Teacher Traits” aren’t section names an ATS looks for. It found no summary, no experience and no skills section.",
      whyAfter: "Summary, Education, Experience, Certifications, Skills: names every ATS recognizes.",
    },
    numbers: {
      after: "Numbers he can back up",
      why: "“Inspired young minds” is what every teacher hopes to do. Which grade, how many students, for how long?",
      whyAfter: "Class size, English learners, weeks leading the class. His own answers, and nothing about any one student.",
    },
    structure: { why: "Tutoring is just a word; there’s nothing under it to read." },
    length: {
      why: "A school and a major, “Certified!”, and little else.",
      whyAfter: "The credential by name, coursework, and the details of three roles he already had.",
    },
  },
  afterAnchors: {
    columns: "Jamal Wright",
    contact: "jamal.wright@mail.com",
    skills: "SKILLS",
    headings: "SUMMARY",
    numbers: "math and reading lessons",
    bullets: "cabin group",
    structure: "Tutored",
    length: "Coursework",
  },

  mistakes: {
    read: [
      { title: "A photo or clipart", text: "Apples and pencils reach the ATS as nothing, and most US districts prefer no photo.", tag: "practice" },
      { title: "Two or more columns", text: "The parser reads across the page, so the sidebar runs into the main column.", tag: "see" },
      { title: "Borders and text boxes", text: "Some systems skip text inside boxes and frames. Keep it plain.", tag: "practice" },
      { title: "A scanned or image PDF", text: "If you can’t select the text, no ATS can read it either.", tag: "check" },
    ],
    match: [
      { title: "“Certified!”", text: "Write the credential’s full name, the state and its status: preliminary, clear, or expected with a date.", tag: "practice" },
      { title: "No grade level or subject", text: "Districts search by grade band and subject. Put both in your title and summary.", tag: "practice" },
      { title: "Headings like “My Classroom Journey”", text: "Use Summary, Experience, Education, Certifications and Skills.", tag: "check" },
      { title: "Traits instead of skills", text: "Patience and kindness match no search. Lesson planning and formative assessment do.", tag: "practice" },
    ],
    reader: [
      { title: "A full teaching philosophy", text: "Save it for the interview or a separate statement. Two lines of summary are enough here.", tag: "practice" },
      { title: "“Inspired young minds”", text: "Say what you taught, to how many students, and for how long.", tag: "check" },
      { title: "Anything that identifies a student", text: "No names, photos or stories with details. Class sizes and counts only.", tag: "practice" },
      { title: "“References available upon request”", text: "Districts ask for them in the application. Use the line for something else.", tag: "practice" },
    ],
  },
  order: [
    { title: "Education", text: "Degree, school, graduation month, and teaching coursework like reading and math methods." },
    { title: "Experience", text: "Student teaching first, with grade, school and district, then tutoring, camps and aide jobs. Newest first." },
    { title: "Certifications", text: "Your credential by full name, state and status, then CPR and first aid." },
    { title: "Skills", text: "Planning, management and assessment methods, then the tools you used, like Google Classroom." },
  ],
  rewrites: [
    { before: "Taught lessons", after: "Planned and taught daily math and reading lessons for a class of {n} students", answers: ["26"] },
    { before: "Managed the classroom", after: "Led the class on my own for the last {n} weeks of the semester", answers: ["4"] },
    { before: "Worked with kids", after: "Led a cabin group of {n} campers aged 8 to 10 and ran 3 daily science activities", answers: ["10"] },
  ],
  skills: ["Lesson planning", "Classroom management", "Differentiated instruction", "Formative assessment", "Small-group instruction", "Supporting English learners", "Special education collaboration", "Google Classroom", "Curriculum development", "Tutoring", "Family communication", "Behavior support"],
  myths: [
    { belief: "Include your teaching philosophy so they know who you are.", truth: "A principal skims a resume in seconds. Two lines of summary go further; the philosophy belongs in the interview or a separate statement." },
    { belief: "Clipart and color make a teacher’s resume friendly.", truth: "They reach the ATS as nothing and crowd the page. Your grade level, credential and student teaching are what get read." },
    { belief: "Substitute teaching and tutoring don’t count.", truth: "They’re classroom experience. List each with the grades, subjects and how long you did it." },
  ],
};
