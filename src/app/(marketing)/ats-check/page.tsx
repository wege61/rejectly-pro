import { Metadata } from "next";
import ATSCheckClient from "./client";

export async function generateMetadata(props: { searchParams: Promise<{ score?: string }> }): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const score = searchParams?.score;
  const imageUrl = score ? `https://rejectly.pro/api/og/score?score=${score}` : "https://rejectly.pro/og-ats-checker.jpg";
  
  return {
    openGraph: {
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "ATS Resume Score Checker",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  };
}

export default function ATSCheckPage() {
  return <ATSCheckClient />;
}
