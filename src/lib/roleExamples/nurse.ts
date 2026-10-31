import type { RoleExample } from "./types";

/*
 * David Mensah is fictional: BSN at Lakeside University, a capstone
 * preceptorship in a medical ICU, a part-time CNA job. Patient numbers are
 * loads and counts, never details: nothing here could identify a patient.
 */
export const nurse: RoleExample = {
  title: "Nurse",
  metaTitle: "New Grad Nurse Resume (RN): Example and Tips",
  metaDescription:
    "A full new-grad registered nurse resume, before and after, scored by the same 19 checks as our free ATS scan. How to list clinical rotations, your license and certifications, and an example you can edit.",
  hero: {
    headline: ["A new grad nurse resume for your ", "first", " RN job."],
    sub: "When your experience is clinical rotations, a preceptorship and a CNA job: how to list them, your license and your certifications, and how it reads to an applicant tracking system. With a full example you can edit.",
  },
  person: { first: "David", pronoun: "he", detail: "A rotations table, BLS and ACLS, no license line" },

  before: {
    name: "David Mensah",
    tagline: "Compassionate Caregiver",
    look: { side: "#0e7490", accent: "#a5f3fc", mark: "✚" },
    sidebar: [
      { heading: "Contact", pin: "contact", lines: ["david.mensah@mail.com", "Lakeside, CA"] },
      { heading: "Credentials", pin: "skills", lines: ["BSN", "BLS, ACLS", "CNA"] },
      { heading: "Qualities", bars: [{ label: "Compassion", level: 5 }, { label: "Teamwork", level: 5 }, { label: "Patience", level: 4 }] },
    ],
    main: [
      { heading: "About Me", text: "Compassionate, caring nursing graduate who is passionate about making a difference in patients’ lives." },
      {
        heading: "Clinical Journey",
        pin: "headings",
        entries: [{ title: "", table: [["Med-Surg", "Lakeside General", "90 hrs"], ["Pediatrics", "St. Anne’s", "90 hrs"], ["ICU", "Lakeside General", "144 hrs"]] }],
      },
      {
        heading: "Work",
        entries: [
          { title: "Oak Grove Senior Living", sub: "CNA", bullets: ["Helped residents with daily needs", "Took vitals"], pin: "numbers" },
          { title: "Student Nurses’ Association", pin: "structure" },
        ],
      },
      { heading: "Education", pin: "length", entries: [{ title: "Lakeside University", sub: "Nursing", bullets: ["Graduated!"], pin: "bullets" }] },
    ],
  },

  after: {
    contact: {
      name: "David Mensah",
      email: "david.mensah@mail.com",
      phone: "(555) 014-9157",
      location: "Lakeside, CA",
      linkedin: "linkedin.com/in/davidmensah",
    },
    summary:
      "Registered Nurse (RN), licensed in California, with a 144-hour medical ICU preceptorship and a year and a half as a certified nursing assistant. Looking for a new graduate RN residency in critical care or medical-surgical nursing.",
    education: [
      {
        degree: "Bachelor of Science in Nursing (BSN)",
        institution: "Lakeside University",
        location: "Lakeside, CA",
        graduationDate: "May 2026",
        details: "Clinical rotations: Medical-Surgical (90 hours), Pediatrics (90 hours), Obstetrics (90 hours), Psychiatric (90 hours)",
      },
    ],
    experience: [
      {
        title: "Student Nurse, Capstone Preceptorship (144 hours)",
        company: "Lakeside General Hospital, Medical ICU",
        location: "Lakeside, CA",
        startDate: "Feb 2026",
        endDate: "Apr 2026",
        bullets: [
          "Cared for ⟦2⟧ critically ill patients per shift under an RN preceptor in a ⟦24⟧-bed medical ICU",
          "Gave scheduled and IV medications, monitored telemetry and documented assessments in Epic",
          "Taught discharge medication plans to ⟦15⟧ patients and families using teach-back",
        ],
      },
      {
        title: "Certified Nursing Assistant (CNA), part-time",
        company: "Oak Grove Senior Living",
        location: "Lakeside, CA",
        startDate: "Jun 2024",
        endDate: "Jan 2026",
        bullets: [
          "Helped ⟦12⟧ residents per shift with bathing, mobility and meals, and took and charted their vital signs",
          "Reported changes in condition to the charge nurse, including ⟦3⟧ early signs of infection",
        ],
      },
      {
        title: "Community Health Chair, Student Nurses’ Association",
        company: "Lakeside University",
        location: "Lakeside, CA",
        startDate: "Sep 2024",
        endDate: "May 2025",
        bullets: ["Organized ⟦4⟧ free blood pressure screenings that reached ⟦200+⟧ community members"],
      },
    ],
    certifications: [
      { name: "Registered Nurse (RN), California Board of Registered Nursing", date: "Aug 2026" },
      { name: "Basic Life Support (BLS)", issuer: "American Heart Association", date: "Jan 2026" },
      { name: "Advanced Cardiac Life Support (ACLS)", issuer: "American Heart Association", date: "Mar 2026" },
    ],
    skills: {
      technical: ["Patient assessment", "Medication administration", "IV therapy", "Telemetry monitoring", "Electronic health records (Epic)", "Wound care", "Infection control", "Patient education", "Care planning", "Vital signs"],
      soft: [],
    },
    isEntryLevel: true,
    themeColor: "#1E2024",
    photoUrl: "",
    language: "en",
  },

  changes: {
    columns: {
      before: "Two columns and a rotations table",
      why: "A parser reads straight across the page, so the sidebar runs into the main column, and the rotations table comes out as one line with wide gaps.",
      whyAfter: "One column; rotations listed as text under his degree.",
    },
    contact: {
      before: "No phone, no LinkedIn",
      after: "Phone and LinkedIn as text",
      why: "Only an email and a city: no phone number, which a hiring unit will want, and no LinkedIn.",
      whyAfter: "Email, phone, city and LinkedIn on one line under his name.",
    },
    skills: {
      before: "Abbreviations instead of skills",
      after: "Clinical skills listed one by one",
      why: "“BSN, BLS, ACLS, CNA” are bare abbreviations, and compassion and teamwork are rated with dots. Too few skills come through.",
      whyAfter: "Clinical skills as plain text, and each certification written out with its issuer and date.",
    },
    headings: {
      why: "“Clinical Journey”, “Work”, “Credentials” and “Qualities” aren’t section names an ATS looks for. It found no experience and no skills section.",
      whyAfter: "Education, Experience, Certifications, Skills: names every ATS recognizes.",
    },
    numbers: {
      after: "Numbers he can back up",
      why: "“Took vitals” is what every CNA does. How many residents, and what came of it?",
      whyAfter: "Patient loads, unit size, families taught. His own answers, and nothing that identifies a patient.",
    },
    structure: { why: "The association is just a name; there’s nothing under it to read." },
    length: {
      why: "A school, “Nursing” and “Graduated!”, and little else.",
      whyAfter: "His license, three certifications with dates, every rotation with its hours, and details he already had.",
    },
  },
  afterAnchors: {
    columns: "David Mensah",
    contact: "david.mensah@mail.com",
    skills: "SKILLS",
    headings: "EXPERIENCE",
    numbers: "critically ill patients",
    bullets: "Helped",
    structure: "blood pressure screenings",
    length: "Clinical rotations",
  },

  mistakes: {
    read: [
      { title: "Clinical rotations in a table", text: "Cells come out as one line with wide gaps. List each rotation as text: unit, hospital, hours.", tag: "see" },
      { title: "Two or more columns", text: "The parser reads across the page, so the sidebar runs into the main column.", tag: "see" },
      { title: "Certificates pasted as images", text: "A picture of your BLS card reaches the ATS as nothing. Write it out with the issuer and date.", tag: "practice" },
      { title: "A scanned or image PDF", text: "If you can’t select the text, no ATS can read it either.", tag: "check" },
    ],
    match: [
      { title: "Abbreviations only: BLS, ACLS, Med-Surg", text: "Write them out once: Basic Life Support (BLS), Medical-Surgical.", tag: "practice" },
      { title: "No license line", text: "Write “Registered Nurse (RN), California” with the date, or “NCLEX-RN scheduled for” a date.", tag: "practice" },
      { title: "Headings like “Clinical Journey”", text: "Use Education, Experience, Certifications and Skills.", tag: "check" },
      { title: "Unit types missing", text: "Hiring managers look for ICU, med-surg, pediatrics. Name the unit for every rotation.", tag: "practice" },
    ],
    reader: [
      { title: "Duties every nurse has", text: "“Took vitals.” For how many patients, on what unit, and what did you catch?", tag: "check" },
      { title: "Anything that identifies a patient", text: "No names, rooms or stories with details. Loads and counts only.", tag: "practice" },
      { title: "A paragraph about compassion", text: "Every nursing resume says it. Your license, hours and units say more.", tag: "practice" },
      { title: "Hours missing", text: "Preceptorship and rotation hours show how much you’ve done. Include them.", tag: "practice" },
    ],
  },
  order: [
    { title: "Education", text: "BSN or ADN, school, graduation month, and your clinical rotations with unit and hours." },
    { title: "Experience", text: "Your capstone preceptorship first, then CNA, tech or volunteer health work. Newest first." },
    { title: "Licenses and certifications", text: "RN license with state and date (or NCLEX date), then BLS, ACLS, PALS with issuer and date." },
    { title: "Skills", text: "Clinical skills and the charting system you used, like Epic or Cerner." },
  ],
  rewrites: [
    { before: "Helped in the ICU", after: "Cared for {n} critically ill patients per shift under an RN preceptor in a 24-bed medical ICU", answers: ["2"] },
    { before: "Took vitals", after: "Helped {n} residents per shift with daily care, and took and charted their vital signs", answers: ["12"] },
    { before: "Taught patients", after: "Taught discharge medication plans to {n} patients and families using teach-back", answers: ["15"] },
  ],
  skills: ["Patient assessment", "Medication administration", "IV therapy", "Telemetry monitoring", "Electronic health records", "Epic", "Wound care", "Infection control", "Patient education", "Care planning", "Basic Life Support (BLS)", "Vital signs"],
  myths: [
    { belief: "Leave clinicals off; they’re just school.", truth: "For a new grad nurse, rotations and the preceptorship are your experience. List each with unit, hospital and hours." },
    { belief: "Collect every certificate you can find.", truth: "BLS, and ACLS or PALS when the unit asks, matter. A pile of short online certificates adds little." },
    { belief: "A patient story shows your compassion.", truth: "Never include details that could identify a patient. Show care through what you did and for how many." },
  ],
};
