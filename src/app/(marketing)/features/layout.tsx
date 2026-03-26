import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Features - GPT-4 Powered Resume Analysis Tools | Rejectly.pro" },
  description: "Explore Rejectly.pro's AI-powered tools: Job Match Analysis, ATS Optimizer, Cover Letter Generator, and CV Builder. Create job-specific resumes for every application.",
  keywords: [
    "AI resume features",
    "ATS optimization features",
    "resume analysis tools",
    "GPT-4 resume checker",
    "resume keyword analyzer",
    "professional resume rewriting",
    "AI cover letter generator",
    "job matching AI",
    "resume optimization tools",
    "ATS-friendly resume",
    "job specific resume",
    "resume for each job",
    "cv builder free",
    "ats optimizer no job description",
  ],
  openGraph: {
    title: "Features - GPT-4 Powered Resume Analysis Tools | Rejectly.pro",
    description: "Explore Rejectly.pro's AI-powered tools: Job Match Analysis, ATS Optimizer, Cover Letter Generator, and free CV Builder.",
    url: "https://www.rejectly.pro/features",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro AI Resume Features",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Features - AI Resume Tools | Rejectly.pro",
    description: "Job Match Analysis, ATS Optimizer, Cover Letter Generator, and free CV Builder — all powered by GPT-4.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.rejectly.pro/features",
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

// JSON-LD WebApplication schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Rejectly.pro",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "0",
    highPrice: "12",
    priceCurrency: "USD",
    offerCount: "3",
  },
  description:
    "AI-powered resume optimization platform with Job Match Analysis, ATS Optimizer, Cover Letter Generator, and free CV Builder. Create job-specific resumes for every application.",
  featureList: [
    "Job Match Analysis — paste a JD and get a fully rewritten, optimized resume",
    "ATS Optimizer — no job description needed, tested against Workday, Greenhouse, Taleo, Lever",
    "Cover Letter Generator — personalized letters in 3 tones for each role",
    "CV Builder — free step-by-step resume builder with live preview",
    "Interview Preparation — behavioral, technical, and weakness questions per role",
    "Career Growth Roadmap — personalized certifications and skills ranked by impact",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What tools does Rejectly.pro offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rejectly.pro offers 4 AI-powered tools: (1) Job Match Analysis — upload your CV and a job description to get a fully rewritten, optimized resume, (2) ATS Optimizer — optimize your CV without needing a job description, tested against Workday, Greenhouse, Taleo, and Lever, (3) Cover Letter Generator — create personalized cover letters for each role, and (4) CV Builder — build a professional, ATS-friendly resume from scratch for free.",
      },
    },
    {
      "@type": "Question",
      name: "Is the CV Builder really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the CV Builder is completely free — no credits, no trial, no catch. You can build a full professional resume with our step-by-step wizard, choose themes and colors, get a live preview, and download as PDF.",
      },
    },
    {
      "@type": "Question",
      name: "How is Rejectly different from other resume tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most resume tools give you a single optimized version of your resume. Rejectly creates a unique, ATS-optimized resume specifically tailored to each job you apply for. Every application gets its own CV written to match that specific role's keywords, requirements, and ATS system.",
      },
    },
    {
      "@type": "Question",
      name: "What does the ATS Optimizer do without a job description?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The ATS Optimizer analyzes your CV against 40+ criteria used by the most popular Applicant Tracking Systems (Workday, Greenhouse, Taleo, Lever) without requiring a job description. It gives you a before/after score comparison and one-click optimization with a downloadable PDF.",
      },
    },
    {
      "@type": "Question",
      name: "What's included in a Pro Report?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every Pro Job Match analysis includes 6 deliverables: (1) a fully optimized, job-specific resume, (2) a personalized cover letter, (3) interview preparation with role-specific questions, (4) a career growth roadmap with certifications ranked by impact, (5) a detailed gap analysis with missing keywords, and (6) ATS compatibility testing.",
      },
    },
  ],
};

export default function FeaturesLayout({
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
