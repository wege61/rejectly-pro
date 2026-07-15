// Data for the programmatic SEO pages at /resume/[role].
// Server-safe: imported by generateStaticParams, generateMetadata, and the sitemap.

export interface RoleRewrite {
  before: string;
  after: string;
}

export interface RoleAnnotation {
  /** Which part of the mock resume the callout points at. */
  anchor: "header" | "bullet" | "skills";
  text: string;
}

export interface RoleExperience {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export interface RoleResumeDoc {
  name: string;
  /** Optional credential line rendered under the name, e.g. "BSN, RN | BLS, ACLS". */
  credentials?: string;
  headline: string;
  location: string;
  experience: RoleExperience[];
  skills: string[];
  education: string;
}

export interface RoleData {
  title: string;
  /** Professional field shown in the hero eyebrow, e.g. "Engineering". */
  field: string;
  /** Per-page accent; drives the ambient light and highlights. */
  hue: string;
  hueRgb: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  challenges: string[];
  keywords: string[];
  atsIssues: string[];
  tips: string[];
  rewrites: RoleRewrite[];
  annotations: RoleAnnotation[];
  resume: RoleResumeDoc;
}

export const ROLE_SLUGS = [
  "software-engineer",
  "product-manager",
  "data-analyst",
  "marketing-manager",
  "project-manager",
  "ux-designer",
  "sales-representative",
  "nurse",
  "accountant",
  "teacher",
  "human-resources",
  "business-analyst",
] as const;

export type RoleSlug = (typeof ROLE_SLUGS)[number];

export const ROLES: Record<RoleSlug, RoleData> = {
  "software-engineer": {
    title: "Software Engineer",
    field: "Engineering",
    hue: "#3AB8B4",
    hueRgb: "58, 184, 180",
    metaTitle: "Software Engineer Resume: ATS Keywords & Examples",
    metaDescription:
      "How to write a software engineer resume that passes Workday, Greenhouse, and Taleo: the exact keywords ATS systems scan for, real bullet rewrites, and formatting rules that survive parsing.",
    description:
      "Software engineering resumes need the right mix of technical skills, project impact, and ATS-friendly formatting. Generic resumes miss role-specific keywords like CI/CD, microservices, or system design that recruiters filter for.",
    challenges: [
      "Technical skills buried in paragraphs",
      "Missing framework/language keywords",
      "No quantified project impact",
      "Over-designed layouts that break ATS parsing",
    ],
    keywords: ["JavaScript", "Python", "React", "AWS", "CI/CD", "Microservices", "REST API", "System Design", "Agile/Scrum", "Git"],
    atsIssues: [
      "Tables and columns break Workday parsing",
      "Skills listed without context get lower ranking",
      "Missing \"years of experience\" pattern matching",
    ],
    tips: [
      "Lead with impact: \"Reduced API latency by 40%\" not \"Worked on APIs\"",
      "List technologies in context: \"Built React dashboard serving 10K daily users\"",
      "Use standard sections: Experience, Skills, Education — not creative alternatives",
    ],
    rewrites: [
      {
        before: "Worked on backend APIs and improved performance.",
        after: "Reduced API p95 latency by 40% by rewriting the caching layer with Redis, serving 2M requests/day.",
      },
      {
        before: "Responsible for frontend development using modern frameworks.",
        after: "Built a React analytics dashboard used by 10K daily users, cutting support tickets 25%.",
      },
    ],
    annotations: [
      { anchor: "header", text: "Plain single-column header — Workday parses name, title, and contact cleanly." },
      { anchor: "bullet", text: "Metric + technology + scale in one line. This is what rankers reward." },
      { anchor: "skills", text: "Exact keyword matches: \"CI/CD\" and \"React\", not \"modern tooling\"." },
    ],
    resume: {
      name: "Maya Chen",
      headline: "Senior Software Engineer",
      location: "San Francisco, CA · maya.chen@email.com",
      experience: [
        {
          company: "Northa Labs",
          role: "Senior Software Engineer",
          period: "2022 – Present",
          bullets: [
            "Reduced API p95 latency by 40% by rewriting the caching layer with Redis, serving 2M requests/day.",
            "Built a React analytics dashboard used by 10K daily users, cutting support tickets 25%.",
            "Led migration of 40+ services to Kubernetes, cutting deploy time from 45 to 8 minutes.",
          ],
        },
        {
          company: "Brightline Systems",
          role: "Software Engineer",
          period: "2019 – 2022",
          bullets: [
            "Designed REST APIs powering checkout for 500K monthly transactions on AWS.",
            "Introduced CI/CD pipelines that raised deploy frequency from weekly to daily.",
          ],
        },
      ],
      skills: ["JavaScript", "Python", "React", "AWS", "CI/CD", "Microservices", "System Design"],
      education: "B.S. Computer Science — UC San Diego, 2019",
    },
  },

  "product-manager": {
    title: "Product Manager",
    field: "Product",
    hue: "#8E7CF8",
    hueRgb: "142, 124, 248",
    metaTitle: "Product Manager Resume: ATS Keywords & Examples",
    metaDescription:
      "Write a product manager resume that ranks in ATS filters: roadmap, OKR, and user-research keywords recruiters search for, plus real bullet rewrites that show product ownership and impact.",
    description:
      "Product management resumes must bridge business strategy and technical execution. ATS systems look for specific PM keywords like roadmap, user research, and OKRs that separate you from generic management resumes.",
    challenges: [
      "Unclear product ownership scope",
      "Missing cross-functional leadership evidence",
      "No metrics showing product impact",
      "Vague stakeholder management descriptions",
    ],
    keywords: ["Product Roadmap", "User Research", "OKRs", "A/B Testing", "PRD", "Stakeholder Management", "Go-to-Market", "Sprint Planning", "Data-Driven", "Customer Discovery"],
    atsIssues: [
      "PM-specific terms like \"PRD\" and \"OKR\" must be spelled out AND abbreviated",
      "Cross-functional skills need explicit keywords",
      "Revenue/growth metrics are critical for ranking",
    ],
    tips: [
      "Show ownership: \"Led product vision for $5M revenue stream\" not \"Managed product\"",
      "Quantify user impact: \"Grew DAU from 10K to 50K through feature iteration\"",
      "Include both technical and business vocabulary for broader ATS matching",
    ],
    rewrites: [
      {
        before: "Managed the product and worked with engineering teams.",
        after: "Owned product vision for a $5M revenue stream, shipping quarterly roadmaps across 4 engineering teams.",
      },
      {
        before: "Improved user engagement through new features.",
        after: "Grew DAU from 10K to 50K in 12 months through A/B-tested onboarding and activation experiments.",
      },
    ],
    annotations: [
      { anchor: "header", text: "Title matches the job title recruiters search — \"Product Manager\", not \"Product Visionary\"." },
      { anchor: "bullet", text: "Ownership + revenue scope in the first line. Rankers extract dollar figures." },
      { anchor: "skills", text: "\"OKRs (Objectives & Key Results)\" — abbreviation and expansion both match." },
    ],
    resume: {
      name: "Daniel Okafor",
      headline: "Senior Product Manager",
      location: "New York, NY · d.okafor@email.com",
      experience: [
        {
          company: "Loopwell",
          role: "Senior Product Manager",
          period: "2021 – Present",
          bullets: [
            "Owned product vision for a $5M revenue stream, shipping quarterly roadmaps across 4 engineering teams.",
            "Grew DAU from 10K to 50K in 12 months through A/B-tested onboarding and activation experiments.",
            "Authored PRDs and led customer discovery with 60+ user interviews per quarter.",
          ],
        },
        {
          company: "Fieldstone",
          role: "Product Manager",
          period: "2018 – 2021",
          bullets: [
            "Launched a go-to-market plan that drove $1.2M in first-year ARR for a new B2B module.",
            "Ran sprint planning and backlog grooming for a 9-person cross-functional squad.",
          ],
        },
      ],
      skills: ["Product Roadmap", "OKRs", "User Research", "A/B Testing", "PRD", "Go-to-Market", "Stakeholder Management"],
      education: "B.A. Economics — University of Michigan, 2016",
    },
  },

  "data-analyst": {
    title: "Data Analyst",
    field: "Data & Analytics",
    hue: "#4C9EEB",
    hueRgb: "76, 158, 235",
    metaTitle: "Data Analyst Resume: ATS Keywords & Examples",
    metaDescription:
      "Build a data analyst resume that passes ATS filters: the exact SQL, Tableau, and Python keywords systems scan for, plus bullet rewrites that turn \"analyzed data\" into measurable business impact.",
    description:
      "Data analyst resumes need to showcase both technical proficiency (SQL, Python, Tableau) and business impact. ATS systems scan for specific analytics tools and methodologies that prove you can deliver insights.",
    challenges: [
      "Technical skills without business context",
      "Missing specific tool mentions (Tableau, Power BI)",
      "No evidence of stakeholder communication",
      "Vague \"analyzed data\" statements",
    ],
    keywords: ["SQL", "Python", "Tableau", "Power BI", "Excel", "Statistical Analysis", "Data Visualization", "ETL", "A/B Testing", "Regression Analysis"],
    atsIssues: [
      "Tool names must be exact (Tableau, not \"visualization tools\")",
      "SQL variants matter: PostgreSQL, MySQL, BigQuery",
      "Missing \"business intelligence\" composite keyword",
    ],
    tips: [
      "Quantify insights: \"Identified $2M savings through churn analysis\" not \"Analyzed churn\"",
      "Name your tools: \"Built Tableau dashboards tracking 15 KPIs for C-suite\"",
      "Show end-to-end work: data collection → analysis → presentation → business impact",
    ],
    rewrites: [
      {
        before: "Analyzed customer data to find insights.",
        after: "Identified $2M in annual savings through churn analysis of 400K customer records in PostgreSQL.",
      },
      {
        before: "Created reports for management.",
        after: "Built Tableau dashboards tracking 15 KPIs, presented monthly to C-suite to guide pricing decisions.",
      },
    ],
    annotations: [
      { anchor: "header", text: "\"Data Analyst\" in the headline — the exact phrase the filter matches on." },
      { anchor: "bullet", text: "Dollar impact + record volume + named database. Every element is extractable." },
      { anchor: "skills", text: "Exact tool names: \"Tableau\", \"Power BI\", \"SQL\" — never \"visualization tools\"." },
    ],
    resume: {
      name: "Sofia Reyes",
      headline: "Data Analyst",
      location: "Austin, TX · sofia.reyes@email.com",
      experience: [
        {
          company: "Harborline Retail",
          role: "Data Analyst",
          period: "2022 – Present",
          bullets: [
            "Identified $2M in annual savings through churn analysis of 400K customer records in PostgreSQL.",
            "Built Tableau dashboards tracking 15 KPIs, presented monthly to C-suite to guide pricing decisions.",
            "Automated ETL pipelines in Python, cutting weekly reporting time from 6 hours to 20 minutes.",
          ],
        },
        {
          company: "Metric & Co.",
          role: "Junior Data Analyst",
          period: "2020 – 2022",
          bullets: [
            "Ran A/B tests on checkout flows, lifting conversion 12% across 3 regional markets.",
            "Maintained Power BI reports used by 40+ stakeholders across sales and operations.",
          ],
        },
      ],
      skills: ["SQL", "Python", "Tableau", "Power BI", "ETL", "A/B Testing", "Statistical Analysis"],
      education: "B.S. Statistics — UT Austin, 2020",
    },
  },

  "marketing-manager": {
    title: "Marketing Manager",
    field: "Marketing",
    hue: "#FF7A73",
    hueRgb: "255, 122, 115",
    metaTitle: "Marketing Manager Resume: ATS Keywords & Examples",
    metaDescription:
      "Write a marketing manager resume ATS systems rank highly: SEO/SEM, marketing automation, and analytics keywords recruiters filter for, with real before-and-after bullet rewrites.",
    description:
      "Marketing manager resumes need to demonstrate both strategic vision and tactical execution. ATS systems look for channel-specific expertise, campaign metrics, and digital marketing vocabulary.",
    challenges: [
      "Creative achievements hard to quantify",
      "Channel expertise not clearly stated",
      "Missing digital marketing keywords",
      "Campaign results without context",
    ],
    keywords: ["Digital Marketing", "SEO/SEM", "Content Strategy", "Social Media Marketing", "Marketing Automation", "Google Analytics", "CRM", "Lead Generation", "Brand Management", "ROI Optimization"],
    atsIssues: [
      "SEO and SEM should be listed separately for keyword matching",
      "Platform names (HubSpot, Marketo, Google Ads) are critical",
      "Missing \"marketing strategy\" as a standalone phrase",
    ],
    tips: [
      "Lead with ROI: \"Generated 300% ROAS on $50K Google Ads budget\" not \"Managed ads\"",
      "Specify channels: \"Grew Instagram from 5K to 50K followers organically\"",
      "Include both strategy and execution keywords for broader matching",
    ],
    rewrites: [
      {
        before: "Managed advertising campaigns across multiple channels.",
        after: "Generated 300% ROAS on a $50K Google Ads budget, driving 1,200 qualified leads per quarter.",
      },
      {
        before: "Handled the company's social media presence.",
        after: "Grew Instagram from 5K to 50K followers organically in 9 months through a UGC content strategy.",
      },
    ],
    annotations: [
      { anchor: "header", text: "\"Marketing Manager\" verbatim — channel specialties belong in bullets, not the title." },
      { anchor: "bullet", text: "ROAS + budget + lead volume: three extractable metrics in one line." },
      { anchor: "skills", text: "\"SEO\" and \"SEM\" listed separately — each is its own filter keyword." },
    ],
    resume: {
      name: "Emma Larsson",
      headline: "Marketing Manager",
      location: "Chicago, IL · emma.larsson@email.com",
      experience: [
        {
          company: "Copperfield Goods",
          role: "Marketing Manager",
          period: "2021 – Present",
          bullets: [
            "Generated 300% ROAS on a $50K Google Ads budget, driving 1,200 qualified leads per quarter.",
            "Grew Instagram from 5K to 50K followers organically in 9 months through a UGC content strategy.",
            "Built HubSpot automation workflows that lifted email-to-demo conversion 45%.",
          ],
        },
        {
          company: "Brightcast Media",
          role: "Digital Marketing Specialist",
          period: "2018 – 2021",
          bullets: [
            "Ran SEO and SEM programs that doubled organic traffic to 200K monthly sessions.",
            "Managed content strategy and Google Analytics reporting for 6 client accounts.",
          ],
        },
      ],
      skills: ["SEO", "SEM", "Google Analytics", "Marketing Automation", "Content Strategy", "Lead Generation", "CRM"],
      education: "B.A. Communications — Northwestern University, 2018",
    },
  },

  "project-manager": {
    title: "Project Manager",
    field: "Delivery & Operations",
    hue: "#E8A33D",
    hueRgb: "232, 163, 61",
    metaTitle: "Project Manager Resume: ATS Keywords & Examples",
    metaDescription:
      "Build a project manager resume that passes ATS screening: PMP, Agile, and JIRA keywords systems filter for, plus bullet rewrites that quantify budgets, timelines, and team scope.",
    description:
      "Project manager resumes must show delivery excellence, stakeholder management, and methodology expertise. ATS systems heavily weight certifications (PMP, Agile) and methodology-specific keywords.",
    challenges: [
      "Projects described without measurable outcomes",
      "Missing methodology keywords (Agile, Waterfall, Hybrid)",
      "Certification mentions buried in text",
      "Team size and budget not quantified",
    ],
    keywords: ["PMP", "Agile", "Scrum Master", "Waterfall", "JIRA", "Risk Management", "Stakeholder Management", "Budget Management", "Resource Planning", "Change Management"],
    atsIssues: [
      "PMP and Agile certifications should appear in both Skills and Certifications sections",
      "JIRA, Asana, MS Project are high-value tool keywords",
      "\"On-time, on-budget delivery\" is a common ATS filter phrase",
    ],
    tips: [
      "Quantify scope: \"Delivered $2M project 2 weeks ahead of schedule with 12-person team\"",
      "List certifications prominently: PMP, CSM, PRINCE2",
      "Show methodology flexibility: mention both Agile and traditional approaches",
    ],
    rewrites: [
      {
        before: "Managed multiple projects and coordinated with stakeholders.",
        after: "Delivered a $2M ERP migration 2 weeks ahead of schedule, leading a 12-person cross-functional team.",
      },
      {
        before: "Handled project planning and tracking.",
        after: "Cut change-request turnaround 35% by introducing weekly risk reviews and JIRA-based tracking.",
      },
    ],
    annotations: [
      { anchor: "header", text: "\"PMP\" beside the name — certifications are primary filter criteria, don't bury them." },
      { anchor: "bullet", text: "Budget + timeline + team size: the three numbers every PM ranker extracts." },
      { anchor: "skills", text: "Both \"Agile\" and \"Waterfall\" listed — methodology flexibility widens matching." },
    ],
    resume: {
      name: "James Whitfield",
      credentials: "PMP, CSM",
      headline: "Senior Project Manager",
      location: "Denver, CO · j.whitfield@email.com",
      experience: [
        {
          company: "Cairnstone Consulting",
          role: "Senior Project Manager",
          period: "2020 – Present",
          bullets: [
            "Delivered a $2M ERP migration 2 weeks ahead of schedule, leading a 12-person cross-functional team.",
            "Cut change-request turnaround 35% by introducing weekly risk reviews and JIRA-based tracking.",
            "Managed a $4.5M annual portfolio across 6 concurrent projects with on-time, on-budget delivery.",
          ],
        },
        {
          company: "Vellum Works",
          role: "Project Coordinator",
          period: "2017 – 2020",
          bullets: [
            "Coordinated resource planning for 20+ Agile and Waterfall projects in MS Project and Asana.",
            "Ran stakeholder reviews that lifted sponsor satisfaction scores from 3.6 to 4.5 out of 5.",
          ],
        },
      ],
      skills: ["PMP", "Agile", "Scrum", "JIRA", "Risk Management", "Budget Management", "Change Management"],
      education: "B.S. Business Administration — CU Boulder, 2017",
    },
  },

  "ux-designer": {
    title: "UX Designer",
    field: "Design",
    hue: "#E272B8",
    hueRgb: "226, 114, 184",
    metaTitle: "UX Designer Resume: ATS Keywords & Examples",
    metaDescription:
      "Write a UX designer resume that survives ATS parsing: Figma, user research, and accessibility keywords systems filter for, plus rewrites that quantify design impact on conversion and usability.",
    description:
      "UX designer resumes face a unique challenge: demonstrating visual thinking through a text-based document. ATS systems look for research methods, design tools, and user-centered design vocabulary.",
    challenges: [
      "Portfolio link not prominent enough",
      "Missing UX research methodology keywords",
      "Tool names not explicitly listed",
      "Design impact not quantified",
    ],
    keywords: ["Figma", "User Research", "Wireframing", "Prototyping", "Usability Testing", "Design Systems", "Information Architecture", "Interaction Design", "Accessibility", "User Journey Mapping"],
    atsIssues: [
      "Figma, Sketch, Adobe XD must be listed explicitly as individual tools",
      "Research methods (interviews, surveys, card sorting) need separate mentions",
      "Accessibility (WCAG, a11y) is increasingly filtered for",
    ],
    tips: [
      "Quantify impact: \"Redesign increased conversion by 35% across 3 user flows\"",
      "Lead with portfolio: make your portfolio URL the first thing visible",
      "Balance research and execution: show you can discover AND deliver",
    ],
    rewrites: [
      {
        before: "Designed screens and improved the user experience.",
        after: "Redesigned 3 core user flows in Figma, increasing checkout conversion 35% and cutting drop-off by half.",
      },
      {
        before: "Conducted user research for product decisions.",
        after: "Ran 24 usability sessions and card-sorting studies that reshaped the information architecture for 80K users.",
      },
    ],
    annotations: [
      { anchor: "header", text: "Portfolio URL in the header — the first thing both parsers and humans should find." },
      { anchor: "bullet", text: "Named tool + flow count + conversion metric: design impact made extractable." },
      { anchor: "skills", text: "\"Figma\", \"Usability Testing\", \"Accessibility\" — each an explicit filter term." },
    ],
    resume: {
      name: "Aria Nakamura",
      headline: "Senior UX Designer",
      location: "Seattle, WA · arianakamura.design",
      experience: [
        {
          company: "Tidewater Apps",
          role: "Senior UX Designer",
          period: "2021 – Present",
          bullets: [
            "Redesigned 3 core user flows in Figma, increasing checkout conversion 35% and cutting drop-off by half.",
            "Ran 24 usability sessions and card-sorting studies that reshaped the information architecture for 80K users.",
            "Built a WCAG 2.1 AA-compliant design system adopted by 5 product teams.",
          ],
        },
        {
          company: "Meridian Digital",
          role: "UX Designer",
          period: "2018 – 2021",
          bullets: [
            "Delivered wireframes and interactive prototypes for 12 client engagements.",
            "Mapped user journeys that informed a mobile-first redesign, lifting task completion 28%.",
          ],
        },
      ],
      skills: ["Figma", "User Research", "Prototyping", "Usability Testing", "Design Systems", "Accessibility", "Information Architecture"],
      education: "B.Des Interaction Design — University of Washington, 2018",
    },
  },

  "sales-representative": {
    title: "Sales Representative",
    field: "Sales",
    hue: "#F0654E",
    hueRgb: "240, 101, 78",
    metaTitle: "Sales Representative Resume: ATS Keywords & Examples",
    metaDescription:
      "Build a sales resume that ranks in ATS filters: Salesforce, quota attainment, and methodology keywords recruiters search for, plus rewrites that turn activity into ranked, extractable numbers.",
    description:
      "Sales resumes are results-driven by nature, but ATS systems need specific CRM tools, sales methodologies, and revenue vocabulary. Numbers talk — but the right keywords get you to the interview.",
    challenges: [
      "Revenue numbers without context or quota percentage",
      "Missing CRM/tool keywords",
      "Sales methodology not mentioned",
      "Territory/segment not specified",
    ],
    keywords: ["Salesforce", "HubSpot CRM", "Pipeline Management", "Lead Generation", "B2B Sales", "Quota Attainment", "Cold Calling", "Solution Selling", "MEDDIC", "Account Management"],
    atsIssues: [
      "CRM names (Salesforce, HubSpot) are critical filter keywords",
      "Quota attainment percentage is a common ATS extraction field",
      "Industry-specific selling (SaaS, Enterprise, SMB) matters for matching",
    ],
    tips: [
      "Show quota performance: \"Achieved 135% of $1.2M annual quota, ranked #2 of 50 reps\"",
      "Name your methodology: MEDDIC, Challenger, SPIN, Solution Selling",
      "Specify deal sizes: \"$50K-$500K enterprise SaaS deals with 6-month sales cycles\"",
    ],
    rewrites: [
      {
        before: "Consistently exceeded sales targets.",
        after: "Achieved 135% of a $1.2M annual quota, ranked #2 of 50 reps company-wide.",
      },
      {
        before: "Sold software products to business clients.",
        after: "Closed $50K–$500K enterprise SaaS deals on 6-month cycles using MEDDIC qualification.",
      },
    ],
    annotations: [
      { anchor: "header", text: "Segment in the headline — \"Enterprise\" is a matching keyword, not decoration." },
      { anchor: "bullet", text: "Quota % + quota size + rank: the exact fields sales ATS filters extract." },
      { anchor: "skills", text: "\"Salesforce\" and \"MEDDIC\" by name — CRM and methodology are both filters." },
    ],
    resume: {
      name: "Marcus Bell",
      headline: "Enterprise Account Executive",
      location: "Boston, MA · marcus.bell@email.com",
      experience: [
        {
          company: "Stackbridge Software",
          role: "Enterprise Account Executive",
          period: "2021 – Present",
          bullets: [
            "Achieved 135% of a $1.2M annual quota, ranked #2 of 50 reps company-wide.",
            "Closed $50K–$500K enterprise SaaS deals on 6-month cycles using MEDDIC qualification.",
            "Built a $3.4M pipeline in Salesforce through outbound sequences and 40+ discovery calls per month.",
          ],
        },
        {
          company: "Corveta",
          role: "Sales Development Representative",
          period: "2019 – 2021",
          bullets: [
            "Generated 85 qualified opportunities per year via cold calling and HubSpot CRM sequences.",
            "Promoted to AE in 18 months after hitting 120%+ of SDR targets every quarter.",
          ],
        },
      ],
      skills: ["Salesforce", "MEDDIC", "B2B Sales", "Pipeline Management", "Quota Attainment", "Account Management", "Lead Generation"],
      education: "B.A. Business — Boston College, 2019",
    },
  },

  nurse: {
    title: "Nurse",
    field: "Healthcare",
    hue: "#3ECF8E",
    hueRgb: "62, 207, 142",
    metaTitle: "Nurse Resume: ATS Keywords, Certifications & Examples",
    metaDescription:
      "Write a nursing resume that passes healthcare ATS screening: how to surface your RN license, BLS/ACLS certifications, EMR systems, and unit experience so filters match you to the right roles.",
    description:
      "Nursing resumes need clinical precision — both in content and ATS formatting. Healthcare ATS systems filter for specific certifications, specializations, and EMR systems that generic resume advice overlooks.",
    challenges: [
      "Certifications not prominently displayed",
      "EMR system experience missing",
      "Patient population/department not specified",
      "Clinical procedures listed without context",
    ],
    keywords: ["Registered Nurse (RN)", "BLS/ACLS", "Patient Assessment", "Medication Administration", "Epic EMR", "Care Planning", "Patient Education", "Wound Care", "Telemetry", "Charge Nurse"],
    atsIssues: [
      "Nursing license numbers and state should be easily extractable",
      "EMR systems (Epic, Cerner, Meditech) are high-priority filter keywords",
      "Unit type (ICU, ER, Med-Surg) is critical for matching",
    ],
    tips: [
      "Lead with credentials: \"BSN, RN | BLS, ACLS, PALS | Epic Certified\"",
      "Specify unit and patient volume: \"40-bed ICU, 1:2 patient ratio, Level I Trauma Center\"",
      "Quantify outcomes: \"Reduced fall rate by 30% through evidence-based protocol implementation\"",
    ],
    rewrites: [
      {
        before: "Provided quality care to patients in a hospital setting.",
        after: "Managed 1:2 patient ratios in a 40-bed ICU at a Level I Trauma Center, precepting 6 new graduate RNs.",
      },
      {
        before: "Followed safety protocols and documentation standards.",
        after: "Reduced unit fall rate 30% by implementing an evidence-based hourly rounding protocol in Epic.",
      },
    ],
    annotations: [
      { anchor: "header", text: "Credentials on the first line — \"BSN, RN | BLS, ACLS\" is the first thing filters extract." },
      { anchor: "bullet", text: "Unit type + bed count + ratio: exactly what healthcare ATS matching runs on." },
      { anchor: "skills", text: "\"Epic EMR\" by name — EMR systems are high-priority filter keywords." },
    ],
    resume: {
      name: "Rachel Nguyen",
      credentials: "BSN, RN | BLS, ACLS, PALS",
      headline: "ICU Registered Nurse",
      location: "Houston, TX · TX RN License #872xxx",
      experience: [
        {
          company: "St. Meridian Medical Center",
          role: "ICU Registered Nurse",
          period: "2021 – Present",
          bullets: [
            "Managed 1:2 patient ratios in a 40-bed ICU at a Level I Trauma Center, precepting 6 new graduate RNs.",
            "Reduced unit fall rate 30% by implementing an evidence-based hourly rounding protocol in Epic.",
            "Administered high-acuity medication drips and telemetry monitoring for post-surgical patients.",
          ],
        },
        {
          company: "Lakewood Regional Hospital",
          role: "Med-Surg Nurse",
          period: "2018 – 2021",
          bullets: [
            "Coordinated care planning and patient education for a 32-bed medical-surgical unit.",
            "Served as relief Charge Nurse, managing staffing and bed flow for 12-hour shifts.",
          ],
        },
      ],
      skills: ["Patient Assessment", "Epic EMR", "Medication Administration", "Telemetry", "Care Planning", "Wound Care", "Charge Nurse"],
      education: "BSN — University of Texas Health Science Center, 2018",
    },
  },

  accountant: {
    title: "Accountant",
    field: "Finance",
    hue: "#C9A44C",
    hueRgb: "201, 164, 76",
    metaTitle: "Accountant Resume: ATS Keywords, CPA & Examples",
    metaDescription:
      "Build an accountant resume that ranks in finance ATS filters: CPA placement, GAAP and ERP keywords (SAP, NetSuite, QuickBooks), and rewrites that quantify the revenue and entities you managed.",
    description:
      "Accounting resumes need to balance technical expertise (GAAP, ERP systems) with business impact. ATS systems in finance heavily weight certifications and specific software proficiency.",
    challenges: [
      "GAAP/IFRS compliance expertise not highlighted",
      "Missing ERP system keywords",
      "CPA certification buried in education",
      "No quantified financial impact",
    ],
    keywords: ["CPA", "GAAP", "Financial Reporting", "SAP", "QuickBooks", "Tax Preparation", "Accounts Payable/Receivable", "Reconciliation", "Audit", "Excel (Advanced)"],
    atsIssues: [
      "CPA/CMA certifications are primary filter criteria",
      "ERP system names (SAP, Oracle, NetSuite) are critical",
      "Financial amounts managed ($X in revenue, $Y budget) are extracted for matching",
    ],
    tips: [
      "Lead with certification: \"CPA licensed in [State], 8+ years public and private accounting\"",
      "Quantify responsibility scope: \"Managed GL with $50M in annual revenue across 12 entities\"",
      "Specify software fluency: \"Advanced Excel (VLOOKUP, Pivot Tables, Power Query), SAP FI/CO\"",
    ],
    rewrites: [
      {
        before: "Handled month-end close and financial reporting duties.",
        after: "Cut month-end close from 10 to 6 days for a $50M-revenue general ledger spanning 12 entities.",
      },
      {
        before: "Prepared reports and worked with auditors.",
        after: "Delivered GAAP-compliant reporting in SAP FI/CO with zero audit findings across 3 consecutive years.",
      },
    ],
    annotations: [
      { anchor: "header", text: "\"CPA\" beside the name, not buried in education — certifications are primary filters." },
      { anchor: "bullet", text: "Close timeline + revenue + entity count: the numbers finance rankers extract." },
      { anchor: "skills", text: "\"SAP FI/CO\" and \"Advanced Excel\" spelled out — ERP names are critical keywords." },
    ],
    resume: {
      name: "Thomas Eriksen",
      credentials: "CPA",
      headline: "Senior Accountant",
      location: "Minneapolis, MN · t.eriksen@email.com",
      experience: [
        {
          company: "Northgate Industries",
          role: "Senior Accountant",
          period: "2020 – Present",
          bullets: [
            "Cut month-end close from 10 to 6 days for a $50M-revenue general ledger spanning 12 entities.",
            "Delivered GAAP-compliant reporting in SAP FI/CO with zero audit findings across 3 consecutive years.",
            "Managed AP/AR reconciliation workflows covering $4M in monthly transactions.",
          ],
        },
        {
          company: "Halvorsen & Ruiz LLP",
          role: "Staff Accountant",
          period: "2017 – 2020",
          bullets: [
            "Prepared tax filings and quarterly financials for 30+ SMB clients in QuickBooks.",
            "Built advanced Excel models (Power Query, pivot tables) that automated audit sampling.",
          ],
        },
      ],
      skills: ["CPA", "GAAP", "SAP FI/CO", "Financial Reporting", "Reconciliation", "Audit", "Excel (Advanced)"],
      education: "B.S. Accounting — University of Minnesota, 2017",
    },
  },

  teacher: {
    title: "Teacher",
    field: "Education",
    hue: "#F2A65A",
    hueRgb: "242, 166, 90",
    metaTitle: "Teacher Resume: ATS Keywords, Certifications & Examples",
    metaDescription:
      "Write a teaching resume that passes district ATS screening: grade level and certification placement, IEP and curriculum keywords filters match on, plus rewrites that quantify student outcomes.",
    description:
      "Teaching resumes need to demonstrate instructional excellence, student outcomes, and classroom management. Education-sector ATS systems look for grade levels, subject expertise, and pedagogy keywords.",
    challenges: [
      "Grade level and subject not immediately clear",
      "Student outcome data missing",
      "Professional development not highlighted",
      "Technology integration not mentioned",
    ],
    keywords: ["Curriculum Development", "Differentiated Instruction", "Classroom Management", "Student Assessment", "IEP", "STEM Education", "Google Classroom", "Parent Communication", "Professional Development", "Common Core Standards"],
    atsIssues: [
      "Grade level/subject is a primary filter — must be in the headline",
      "State certification type matters for matching",
      "Special education keywords (IEP, 504 Plan) carry heavy weight",
    ],
    tips: [
      "Lead with specifics: \"8th Grade Mathematics | State Certified | IB Trained\"",
      "Quantify results: \"Improved standardized test scores by 22% over 2 years among 120 students\"",
      "Show tech adoption: \"Implemented Google Classroom for 150 students, increasing assignment completion by 35%\"",
    ],
    rewrites: [
      {
        before: "Taught mathematics to middle school students.",
        after: "Raised standardized math scores 22% over 2 years across 120 students through differentiated instruction.",
      },
      {
        before: "Used technology to support learning in the classroom.",
        after: "Implemented Google Classroom for 150 students, increasing assignment completion 35%.",
      },
    ],
    annotations: [
      { anchor: "header", text: "Grade + subject + certification in the headline — the primary district filter." },
      { anchor: "bullet", text: "Score gain + timeframe + student count: outcomes made extractable." },
      { anchor: "skills", text: "\"IEP\" and \"Common Core\" by name — special-education terms carry heavy weight." },
    ],
    resume: {
      name: "Hannah Brooks",
      headline: "8th Grade Mathematics Teacher | State Certified",
      location: "Portland, OR · h.brooks@email.com",
      experience: [
        {
          company: "Riverbend Middle School",
          role: "Mathematics Teacher, Grade 8",
          period: "2020 – Present",
          bullets: [
            "Raised standardized math scores 22% over 2 years across 120 students through differentiated instruction.",
            "Implemented Google Classroom for 150 students, increasing assignment completion 35%.",
            "Developed Common Core-aligned curriculum units adopted across the district's 4 middle schools.",
          ],
        },
        {
          company: "Cascadia Elementary",
          role: "Student Teacher → 5th Grade Teacher",
          period: "2017 – 2020",
          bullets: [
            "Managed IEP accommodations and 504 Plans for 14 students in an inclusive classroom.",
            "Led parent communication programs that raised conference attendance to 92%.",
          ],
        },
      ],
      skills: ["Curriculum Development", "Differentiated Instruction", "IEP", "Student Assessment", "Google Classroom", "Common Core Standards", "Classroom Management"],
      education: "M.Ed Curriculum & Instruction — Portland State University, 2017",
    },
  },

  "human-resources": {
    title: "Human Resources",
    field: "People & Culture",
    hue: "#A88BF0",
    hueRgb: "168, 139, 240",
    metaTitle: "Human Resources Resume: ATS Keywords & Examples",
    metaDescription:
      "Build an HR resume that passes the very systems HR runs: HRIS platform keywords (Workday, BambooHR), compliance terms filters match on, and rewrites that quantify headcount and scope.",
    description:
      "HR resumes need to demonstrate both people skills and systems proficiency. ATS systems — ironically the tools HR teams use — filter for specific HRIS platforms, compliance knowledge, and talent management vocabulary.",
    challenges: [
      "HRIS system experience not listed",
      "Compliance knowledge not specific enough",
      "Headcount/scale of operations missing",
      "Strategic HR vs admin HR not differentiated",
    ],
    keywords: ["HRIS", "Workday", "BambooHR", "Talent Acquisition", "Employee Relations", "Performance Management", "FMLA", "ADA Compliance", "Succession Planning", "Employer Branding"],
    atsIssues: [
      "HRIS platform names are high-priority extraction fields",
      "Compliance terms (FMLA, ADA, EEOC) must be spelled out AND abbreviated",
      "Headcount managed is a common filter criterion",
    ],
    tips: [
      "Quantify scope: \"HR Business Partner for 500+ employee division across 3 locations\"",
      "Show systems: \"Implemented Workday HCM for 2,000-employee organization, reducing admin time by 40%\"",
      "Include both strategic and operational keywords for full-spectrum matching",
    ],
    rewrites: [
      {
        before: "Supported employees across the organization on HR matters.",
        after: "Served as HR Business Partner for a 500+ employee division across 3 locations.",
      },
      {
        before: "Worked on HR systems and process improvements.",
        after: "Implemented Workday HCM for a 2,000-employee organization, reducing HR admin time 40%.",
      },
    ],
    annotations: [
      { anchor: "header", text: "\"HR Business Partner\" — strategic title, matched verbatim by talent filters." },
      { anchor: "bullet", text: "Headcount + locations: scale is a filter criterion, so state it in numbers." },
      { anchor: "skills", text: "\"Workday\" and \"FMLA\" by name — platforms and compliance terms are both filters." },
    ],
    resume: {
      name: "Priya Sharma",
      headline: "HR Business Partner",
      location: "Atlanta, GA · priya.sharma@email.com",
      experience: [
        {
          company: "Meridian Health Group",
          role: "HR Business Partner",
          period: "2021 – Present",
          bullets: [
            "Served as HR Business Partner for a 500+ employee division across 3 locations.",
            "Implemented Workday HCM for a 2,000-employee organization, reducing HR admin time 40%.",
            "Led performance management cycles and succession planning for 45 people managers.",
          ],
        },
        {
          company: "Brightpath Logistics",
          role: "HR Generalist",
          period: "2018 – 2021",
          bullets: [
            "Managed employee relations cases, FMLA and ADA (Americans with Disabilities Act) compliance for 300 employees.",
            "Ran full-cycle talent acquisition in BambooHR, cutting time-to-fill from 42 to 28 days.",
          ],
        },
      ],
      skills: ["Workday", "HRIS", "Talent Acquisition", "Employee Relations", "FMLA", "Performance Management", "Succession Planning"],
      education: "B.A. Psychology — Georgia State University, 2018",
    },
  },

  "business-analyst": {
    title: "Business Analyst",
    field: "Strategy & Analysis",
    hue: "#58C7E3",
    hueRgb: "88, 199, 227",
    metaTitle: "Business Analyst Resume: ATS Keywords & Examples",
    metaDescription:
      "Write a business analyst resume that ranks in ATS screening: requirements, JIRA, and documentation keywords (BRD, FRD, user stories) filters match on, plus rewrites that quantify process impact.",
    description:
      "Business analyst resumes need to showcase both analytical rigor and stakeholder communication. ATS systems look for specific BA methodologies, tools, and documentation types.",
    challenges: [
      "Requirements gathering approach not specified",
      "Missing BA tool keywords (JIRA, Confluence)",
      "Documentation types not listed",
      "Stakeholder level not clear",
    ],
    keywords: ["Requirements Gathering", "User Stories", "JIRA", "Confluence", "SQL", "Process Mapping", "Data Analysis", "UAT", "Business Process Improvement", "Stakeholder Management"],
    atsIssues: [
      "BA vs Data Analyst vs PM terminology overlap needs strategic keyword choices",
      "Documentation types (BRD, FRD, User Stories) are specific filter terms",
      "Agile BA keywords differ significantly from traditional BA keywords",
    ],
    tips: [
      "Show methodology: \"Elicited requirements through 50+ stakeholder interviews and JAD sessions\"",
      "Quantify impact: \"Process improvement initiative saved $1.2M annually across 3 business units\"",
      "Specify documentation: \"Authored BRDs, FRDs, and user stories for 15+ Agile sprints\"",
    ],
    rewrites: [
      {
        before: "Gathered requirements from business stakeholders.",
        after: "Elicited requirements through 50+ stakeholder interviews and JAD sessions across 3 business units.",
      },
      {
        before: "Worked on process improvement initiatives.",
        after: "Led a business process improvement initiative saving $1.2M annually, mapped end-to-end in Confluence.",
      },
    ],
    annotations: [
      { anchor: "header", text: "\"Business Analyst\" verbatim — BA/DA/PM overlap means the exact title must match." },
      { anchor: "bullet", text: "Interview count + business-unit scope: methodology made concrete and extractable." },
      { anchor: "skills", text: "\"BRD\", \"FRD\", \"User Stories\" — documentation types are specific filter terms." },
    ],
    resume: {
      name: "Lucas Moreau",
      headline: "Senior Business Analyst",
      location: "Toronto, ON · lucas.moreau@email.com",
      experience: [
        {
          company: "Keystone Financial",
          role: "Senior Business Analyst",
          period: "2021 – Present",
          bullets: [
            "Elicited requirements through 50+ stakeholder interviews and JAD sessions across 3 business units.",
            "Led a business process improvement initiative saving $1.2M annually, mapped end-to-end in Confluence.",
            "Authored BRDs, FRDs, and user stories for 15+ Agile sprints in JIRA.",
          ],
        },
        {
          company: "Arden Consulting",
          role: "Business Analyst",
          period: "2018 – 2021",
          bullets: [
            "Ran UAT cycles with 20+ end users for two core-banking system rollouts.",
            "Built SQL-based reporting that replaced manual reconciliation for the operations team.",
          ],
        },
      ],
      skills: ["Requirements Gathering", "User Stories", "JIRA", "Confluence", "SQL", "Process Mapping", "UAT"],
      education: "B.Com Management Information Systems — University of Toronto, 2018",
    },
  },
};

export function getRole(slug: string): RoleData | undefined {
  return (ROLES as Record<string, RoleData>)[slug];
}
