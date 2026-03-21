import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: { absolute: "Blog - Resume Tips, Career Advice & ATS Optimization | Rejectly.pro" },
  description:
    "Expert insights on resume optimization, ATS systems, career advice, and job search strategies. Learn how to land more interviews with our AI-powered tips.",
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
    title: "Blog - Resume Tips & Career Advice | Rejectly.pro",
    description:
      "Expert insights on resume optimization, ATS systems, and career advice to help you land more interviews.",
    url: "https://www.rejectly.pro/blog",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro Blog - Resume Tips & Career Advice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rejectlypro",
    creator: "@rejectlypro",
    title: "Blog - Resume Tips & Career Advice | Rejectly.pro",
    description:
      "Expert insights on resume optimization, ATS systems, and career advice to help you land more interviews.",
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
    canonical: "https://www.rejectly.pro/blog",
    types: {
      "application/rss+xml": "https://www.rejectly.pro/blog/feed.xml",
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
          { name: "Home", url: "https://www.rejectly.pro" },
          { name: "Blog", url: "https://www.rejectly.pro/blog" },
        ]}
      />
      {children}
    </>
  );
}
