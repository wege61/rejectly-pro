import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: { absolute: "Guides: Resumes, ATS and the Job Search | Rejectly.pro" },
  description:
    "Guides on how applicant tracking systems read a resume, how to format and word yours, and how to get from application to interview. Written for students and new grads.",
  keywords: [
    "resume tips",
    "career advice",
    "ATS optimization",
    "job search strategies",
    "resume writing tips",
    "resume analysis",
    "career development",
    "resume optimization guide",
    "job application tips",
    "CV improvement",
  ],
  openGraph: {
    title: "Guides: Resumes, ATS and the Job Search | Rejectly.pro",
    description:
      "How applicant tracking systems read a resume, and what to do about it. Written for students and new grads.",
    url: "https://rejectly.pro/blog",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rejectlypro",
    creator: "@rejectlypro",
    title: "Guides: Resumes, ATS and the Job Search | Rejectly.pro",
    description:
      "How applicant tracking systems read a resume, and what to do about it. Written for students and new grads.",
    images: ["/og-image.png"],
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
  alternates: {
    canonical: "https://rejectly.pro/blog",
    types: {
      "application/rss+xml": "https://rejectly.pro/blog/feed.xml",
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rejectly.pro" },
          { name: "Blog", url: "https://rejectly.pro/blog" },
        ]}
      />
      {children}
    </>
  );
}
