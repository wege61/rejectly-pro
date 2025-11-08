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
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Default theme - Dark */
              :root {
                --bg-color: #0f172a;
                --text-color: #f1f5f9;
                --surface-color: #1e293b;
                --border-color: #334155;
              }

              /* Light theme - Applied via data-theme attribute */
              :root[data-theme="light"] {
                --bg-color: #F5F7FA;
                --text-color: #1F2937;
                --surface-color: #FFFFFF;
                --border-color: #D1D5DB;
              }

              html {
                background-color: var(--bg-color);
                color: var(--text-color);
              }
              body {
                background-color: var(--bg-color);
                color: var(--text-color);
              }
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
