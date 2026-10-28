import { Metadata } from "next";
import { ATS_FAQS } from "@/components/ats-check/faq";
import { TOTAL_CHECKS } from "@/components/marketing/proof/data";
import { DESCRIPTION } from "./meta";

export const metadata: Metadata = {
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
  ],
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

// JSON-LD — WebApplication
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
  description: DESCRIPTION,
  featureList: [
    "The text an applicant tracking system pulls out of your resume",
    `ATS score from ${TOTAL_CHECKS} checks, the same on every resume`,
    "Layout, sections, contact details, dates and length",
    "Each failed check with its fix and the points it is worth",
    "PDF and DOCX support",
    "No account needed",
  ],
  creator: {
    "@type": "Organization",
    name: "Rejectly.pro",
    url: "https://rejectly.pro",
  },
};

// JSON-LD — HowTo
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to check your resume for ATS compatibility",
  description: "Use the free Rejectly.pro ATS resume checker to see what an applicant tracking system reads in your resume.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload your resume",
      text: "Drop a PDF or DOCX file into the checker. We pull the text out of it the way an applicant tracking system does.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Read",
      text: `The same ${TOTAL_CHECKS} checks run on every resume: layout, sections, contact details, numbers and length.`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Fix",
      text: "See your score, what each check found, and the change that is worth the most points.",
    },
  ],
};

// JSON-LD — FAQ, from the same list the page renders.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ATS_FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
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
