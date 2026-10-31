import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

const TITLE = "Privacy Policy | Rejectly.pro";
const DESCRIPTION =
  "What Rejectly.pro collects, why, who else handles it, how long we keep it and how to see, export or delete it. No selling, no ads, no training AI on your resume.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://rejectly.pro/privacy",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rejectly.pro Privacy Policy" }],
  },
  alternates: {
    canonical: "https://rejectly.pro/privacy",
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
          { name: "Home", url: "https://rejectly.pro" },
          { name: "Privacy Policy", url: "https://rejectly.pro/privacy" },
        ]}
      />
      {children}
    </>
  );
}
