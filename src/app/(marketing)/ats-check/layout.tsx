import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free ATS Resume Score Checker | Check Your Resume Score Instantly",
  description:
    "Get your free ATS resume score in seconds. Our ATS score checker analyzes your resume against 40+ criteria used by Workday, Greenhouse, Taleo & Lever. Check your resume score now and see why 85% of resumes get rejected.",
  keywords: [
    "resume score",
    "ats score checker",
    "ats resume checker",
    "resume score checker",
    "ats score",
    "resume ats score",
    "free ats checker",
    "ats compatibility checker",
    "resume scanner",
    "ats resume scan",
    "check resume score",
    "ats friendly resume checker",
    "resume optimization",
    "applicant tracking system checker",
  ],
  openGraph: {
    title: "Free ATS Resume Score Checker | Get Your Score in Seconds",
    description:
      "Check your resume score against real ATS systems. 99% of Fortune 500 companies use ATS - only 15% of resumes pass. Find out where you stand.",
    type: "website",
    url: "https://rejectly.app/ats-check",
    images: [
      {
        url: "/og-ats-checker.jpg",
        width: 1200,
        height: 630,
        alt: "ATS Resume Score Checker - Free Resume Analysis Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS Resume Score Checker",
    description:
      "Get your resume score in seconds. Check ATS compatibility for Workday, Greenhouse, Taleo & Lever.",
    images: ["/og-ats-checker.jpg"],
  },
  alternates: {
    canonical: "https://rejectly.app/ats-check",
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

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ATS Resume Score Checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Free ATS resume checker that analyzes your resume score against major Applicant Tracking Systems like Workday, Greenhouse, Taleo, and Lever.",
  featureList: [
    "Instant ATS score calculation",
    "Compatibility check for Workday, Greenhouse, Taleo, Lever",
    "Keyword analysis",
    "Format and structure evaluation",
    "Actionable improvement suggestions",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "2847",
    bestRating: "5",
    worstRating: "1",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an ATS resume score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An ATS resume score measures how well your resume will perform when parsed by Applicant Tracking Systems. A score of 80+ typically means your resume will pass initial ATS screening, while scores below 60 often result in automatic rejection.",
      },
    },
    {
      "@type": "Question",
      name: "How do I check my resume score for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply upload your resume (PDF or DOCX) to our free ATS resume checker. Within seconds, you'll receive a comprehensive score breakdown including format analysis, keyword optimization, and compatibility ratings for major ATS systems like Workday, Greenhouse, Taleo, and Lever.",
      },
    },
    {
      "@type": "Question",
      name: "What is a good ATS resume score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A good ATS resume score is 80 or above out of 100. Scores between 60-79 are acceptable but have room for improvement. Scores below 60 indicate significant issues that could prevent your resume from passing ATS filters.",
      },
    },
    {
      "@type": "Question",
      name: "Why do 85% of resumes get rejected by ATS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most resumes get rejected due to formatting issues (tables, graphics, headers/footers), missing keywords, non-standard section headings, and poor structure. ATS systems struggle to parse creative layouts, causing qualified candidates to be filtered out before human review.",
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
