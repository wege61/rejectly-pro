import { Metadata } from "next";

const TITLE = "Free Resume Builder with a Live ATS Score";
const DESCRIPTION =
  "Build a one-column resume an ATS can read, with a live score from the same 19 checks as our free ATS scan. Start without an account; a free account saves it and downloads the PDF.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "resume builder",
    "free resume builder",
    "ats friendly resume builder",
    "cv builder",
    "student resume builder",
    "new grad resume",
    "resume pdf",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://rejectly.pro/cv-builder",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rejectly resume builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://rejectly.pro/cv-builder",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Rejectly Resume Builder",
  url: "https://rejectly.pro/cv-builder",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: DESCRIPTION,
  featureList: [
    "One-column layout with standard section headings",
    "Live ATS score from 19 rule-based checks",
    "AI suggestions for bullets, skills and a summary",
    "Accent colors",
    "PDF download with a free account",
  ],
};

export default function CVBuilderLayout({
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
      {children}
    </>
  );
}
