import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Privacy Policy - Data Protection & Security | Rejectly.pro",
  description: "Learn how Rejectly.pro protects your personal data. Our privacy policy covers data collection, AI processing, GDPR compliance, and your privacy rights.",
  keywords: [
    "privacy policy",
    "data protection",
    "GDPR compliance",
    "resume data security",
    "AI data processing",
    "personal data protection",
    "privacy rights",
    "data encryption",
    "secure resume storage",
    "cookie policy",
  ],
  openGraph: {
    title: "Privacy Policy - Data Protection & Security | Rejectly.pro",
    description: "Learn how Rejectly.pro protects your personal data and resume information. GDPR compliant with encrypted storage.",
    url: "https://www.rejectly.pro/privacy",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro Privacy Policy",
      },
    ],
  },
  alternates: {
    canonical: "https://www.rejectly.pro/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.rejectly.pro" },
          { name: "Privacy Policy", url: "https://www.rejectly.pro/privacy" },
        ]}
      />
      {children}
    </>
  );
}
