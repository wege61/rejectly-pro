import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";

export const metadata: Metadata = {
  title: "Rejectly.pro - Why Was I Rejected?",
  description: "AI-powered CV & job posting match analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
  }