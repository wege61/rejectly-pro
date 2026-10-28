import { Metadata } from "next";
import ATSCheckClient from "./client";
import { DESCRIPTION, TITLE } from "./meta";

export async function generateMetadata(props: { searchParams: Promise<{ score?: string }> }): Promise<Metadata> {
  const searchParams = await props.searchParams;
  // Older shared links carry ?score=; keep rendering their score card.
  const score = Number(searchParams?.score);
  const imageUrl =
    Number.isInteger(score) && score >= 0 && score <= 100
      ? `https://rejectly.pro/api/og/score?score=${score}`
      : "https://rejectly.pro/og-ats-checker.jpg";

  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: "https://rejectly.pro/ats-check",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Rejectly ATS resume checker",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [imageUrl],
    },
  };
}

export default function ATSCheckPage() {
  return <ATSCheckClient />;
}
