import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Rejectly.pro - AI-Powered CV Analysis | Why Was I Rejected?",
  description:
    "Get instant AI-powered insights on why your CV didn't match the job. Improve your applications with data-driven analysis. Free demo available!",
  keywords: [
    "CV analysis",
    "job matching",
    "AI career coach",
    "resume optimizer",
    "ATS checker",
  ],
  authors: [{ name: "Rejectly.pro" }],
  openGraph: {
    title: "Rejectly.pro - Why Was I Rejected?",
    description: "AI-powered CV & job posting match analysis",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  const root = document.documentElement;
                  root.setAttribute('data-theme', theme);

                  // Apply theme colors immediately to prevent FOUC
                  if (theme === 'light') {
                    root.style.backgroundColor = '#F5F7FA';
                    root.style.color = '#1F2937';
                  } else {
                    root.style.backgroundColor = '#0f172a';
                    root.style.color = '#f1f5f9';
                  }
                } catch (e) {
                  const root = document.documentElement;
                  root.setAttribute('data-theme', 'dark');
                  root.style.backgroundColor = '#0f172a';
                  root.style.color = '#f1f5f9';
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
