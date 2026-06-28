import { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "ATS Resume Checker — Free ATS Resume Scanner & Score | Rejectly.pro" },
  description:
    "Use our free ATS resume checker to instantly scan your resume against 40+ ATS criteria used by Workday, Greenhouse, Taleo & Lever. Our ATS resume checker identifies formatting errors, missing keywords, and gives you an actionable score to beat the bots.",
  keywords: [
    "ats resume checker",
    "ats resume checker free",
    "free ats resume checker",
    "ats resume scanner",
    "ats checker",
    "resume ats checker",
    "ats resume check",
    "check resume for ats",
    "ats score checker",
    "resume score checker",
    "ats compatibility checker",
    "ats friendly resume checker",
    "applicant tracking system checker",
    "resume scanner",
    "ats resume scan",
    "ats resume score",
    "resume ats score",
    "check ats score",
    "ats resume test",
    "resume optimization tool",
    "ats keyword checker",
    "resume keyword scanner",
    "ats pass rate checker",
  ],
  openGraph: {
    title: "ATS Resume Checker — Free Resume Scanner & ATS Score | Rejectly.pro",
    description:
      "Check if your resume passes ATS filters with our free ATS resume checker. 99% of Fortune 500 companies use ATS — only 15% of resumes pass. Scan yours now.",
    type: "website",
    url: "https://rejectly.pro/ats-check",
    images: [
      {
        url: "/og-ats-checker.jpg",
        width: 1200,
        height: 630,
        alt: "ATS Resume Checker - Free ATS Resume Scanner Tool by Rejectly.pro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS Resume Checker — Free Resume Scanner | Rejectly.pro",
    description:
      "Free ATS resume checker that scans your resume for ATS compatibility. Check against Workday, Greenhouse, Taleo & Lever in seconds.",
    images: ["/og-ats-checker.jpg"],
  },
  alternates: {
    canonical: "https://rejectly.pro/ats-check",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data — WebApplication
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ATS Resume Checker",
  alternateName: ["ATS Resume Scanner", "Free ATS Checker", "Resume ATS Score Checker"],
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: "https://rejectly.pro/ats-check",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "127",
    bestRating: "5",
    worstRating: "1",
  },
  description:
    "Free ATS resume checker that scans and analyzes your resume against 40+ criteria used by major Applicant Tracking Systems including Workday, Greenhouse, Taleo, and Lever. Get your ATS score instantly.",
  featureList: [
    "Instant ATS resume score calculation",
    "ATS compatibility check for Workday, Greenhouse, Taleo, Lever",
    "Missing keyword analysis against job descriptions",
    "Resume format and structure evaluation",
    "Actionable improvement suggestions",
    "PDF and DOCX resume support",
    "Free unlimited ATS scans",
  ],
  screenshot: "https://rejectly.pro/og-ats-checker.jpg",
  creator: {
    "@type": "Organization",
    name: "Rejectly.pro",
    url: "https://rejectly.pro",
  },
};

// JSON-LD — HowTo Schema (for Google rich snippets)
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Check Your Resume for ATS Compatibility",
  description:
    "Use the Rejectly.pro ATS resume checker to scan your resume and get an instant ATS compatibility score.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your Resume",
      text: "Drag and drop your resume file (PDF or DOCX) into the ATS resume checker, or click to browse your files.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Add Target Job Description (Optional)",
      text: "Paste the job description you're applying for to get keyword match analysis and see which critical terms are missing from your resume.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Get Your ATS Score",
      text: "Click 'Get My ATS Score' to receive an instant breakdown of your resume's ATS compatibility, including formatting issues, missing keywords, and actionable fixes.",
    },
  ],
};

// JSON-LD — FAQ Schema
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an ATS resume checker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An ATS resume checker is a tool that scans your resume to see how well it will perform when parsed by Applicant Tracking Systems (ATS). It checks for formatting issues, missing keywords, and structural problems that could cause your resume to be rejected before a human recruiter ever sees it.",
      },
    },
    {
      "@type": "Question",
      name: "How do I check my resume for ATS compatibility for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your resume (PDF or DOCX) to Rejectly.pro's free ATS resume checker. Within seconds, you'll receive a comprehensive ATS score breakdown including format analysis, keyword optimization gaps, and compatibility ratings for major ATS systems like Workday, Greenhouse, Taleo, and Lever.",
      },
    },
    {
      "@type": "Question",
      name: "What is a good ATS resume score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A good ATS resume score is 80 or above out of 100. This means your formatting is readable by ATS bots and you have strong keyword alignment with target jobs. Scores between 60-79 need improvement, and scores below 60 risk automatic rejection.",
      },
    },
    {
      "@type": "Question",
      name: "Why do 85% of resumes get rejected by ATS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most resumes get rejected due to formatting issues (tables, graphics, text boxes, headers/footers), missing keywords that match the job description, non-standard section headings, and poor document structure. ATS systems cannot parse creative layouts, causing even qualified candidates to be filtered out automatically.",
      },
    },
    {
      "@type": "Question",
      name: "Is Rejectly's ATS resume checker really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Rejectly.pro's ATS resume checker is completely free. You can upload your resume and get an instant ATS compatibility score with detailed feedback on formatting, keywords, and structure — no credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Which ATS systems does the checker test against?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rejectly's ATS resume checker tests your resume against the parsing rules used by major Applicant Tracking Systems including Workday, Greenhouse, Taleo, Lever, iCIMS, and BambooHR. These systems are used by over 99% of Fortune 500 companies.",
      },
    },
    {
      "@type": "Question",
      name: "How is an ATS resume checker different from a regular resume review?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A regular resume review focuses on content quality and visual design. An ATS resume checker specifically tests whether automated software can correctly parse your resume — checking file format compatibility, section header recognition, keyword density, and structural elements that ATS bots look for when screening candidates.",
      },
    },
  ],
};

// JSON-LD — Breadcrumb Schema
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://rejectly.pro",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "ATS Resume Checker",
      item: "https://rejectly.pro/ats-check",
    },
  ],
};

export default function ATSCheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
