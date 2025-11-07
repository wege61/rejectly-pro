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

                  // Set CSS variables immediately to prevent FOUC
                  if (theme === 'light') {
                    root.style.setProperty('--bg-color', '#F5F7FA');
                    root.style.setProperty('--text-color', '#1F2937');
                    root.style.setProperty('--surface-color', '#FFFFFF');
                    root.style.setProperty('--border-color', '#D1D5DB');
                  } else {
                    root.style.setProperty('--bg-color', '#0f172a');
                    root.style.setProperty('--text-color', '#f1f5f9');
                    root.style.setProperty('--surface-color', '#1e293b');
                    root.style.setProperty('--border-color', '#334155');
                  }
                } catch (e) {
                  const root = document.documentElement;
                  root.setAttribute('data-theme', 'dark');
                  root.style.setProperty('--bg-color', '#0f172a');
                  root.style.setProperty('--text-color', '#f1f5f9');
                  root.style.setProperty('--surface-color', '#1e293b');
                  root.style.setProperty('--border-color', '#334155');
                }
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --bg-color: #0f172a;
                --text-color: #f1f5f9;
                --surface-color: #1e293b;
                --border-color: #334155;
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
