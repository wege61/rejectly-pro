import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

const TITLE = "About Rejectly: We Show You What the Software Sees";
const DESCRIPTION =
  "Why we built Rejectly, the promises we won't make, and what's code and what's AI. An ATS resume checker for students and new grads, built by a small, independent team.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://rejectly.pro/about",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About Rejectly.pro" }],
  },
  alternates: {
    canonical: "https://rejectly.pro/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rejectly.pro" },
          { name: "About", url: "https://rejectly.pro/about" },
        ]}
      />
      {children}
    </>
  );
}
