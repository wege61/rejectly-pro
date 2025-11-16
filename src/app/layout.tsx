import type { Metadata } from "next";
import Script from "next/script";
import StyledComponentsRegistry from "@/lib/registry";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Rejectly.pro - AI-Powered Resume Analysis | Why Was I Rejected?",
  description:
    "Get instant AI-powered insights on why your resume didn't match the job. Improve your applications with data-driven analysis. Free demo available!",
  keywords: [
    "Resume analysis",
    "job matching",
    "AI career coach",
    "resume optimizer",
    "ATS checker",
  ],
  authors: [{ name: "Rejectly.pro" }],
  openGraph: {
    title: "Rejectly.pro - Why Was I Rejected?",
    description: "AI-powered resume & job posting match analysis",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
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
                --title-color-blue: #98A1BC;
                --title-color-pink: #F7A5A5;
                --surface-color: #1e293b;
                --surface-hover: #334155;
                --bg-alt: #1e293b;
                --border-color: #334155;
                --primary-color: #696FC7;
                --text-secondary: #94a3b8;
                --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              }

              /* Light theme - Applied via data-theme attribute */
              :root[data-theme="light"] {
                --bg-color: #F5F7FA;
                --text-color: #1F2937;
                --surface-color: #FFFFFF;
                --surface-hover: #F3F4F6;
                --title-color-blue: #5D688A;
                --title-color-pink: #F7A5A5;
                --bg-alt: #FFFFFF;
                --border-color: #D1D5DB;
                --primary-color: #696FC7;
                --text-secondary: #6B7280;
                --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              }

              html {
                background-color: var(--bg-color);
                color: var(--text-color);
                font-size: 16px;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              body {
                background-color: var(--bg-color);
                color: var(--text-color);
                font-family: var(--font-family);
                font-size: 1rem;
                line-height: 1.5;
                margin: 0;
                padding: 0;
                overflow-x: hidden;
              }
              * {
                box-sizing: border-box;
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8P38Q6H1DG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8P38Q6H1DG');
          `}
        </Script>

        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
