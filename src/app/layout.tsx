import type { Metadata } from "next";
import Script from "next/script";
import StyledComponentsRegistry from "@/lib/registry";
import Providers from "@/components/Providers";
import { OrganizationSchema, WebSiteSchema, ProductSchema, ReviewSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.rejectly.pro'),
  title: {
    default: "Rejectly.pro - AI Resume Optimizer | Get 3x More Interviews",
    template: "%s | Rejectly.pro"
  },
  description:
    "Transform your resume with AI. Get past ATS systems, find your perfect job match, and land 3x more interviews. Free analysis in 30 seconds. Used by 500+ professionals.",
  keywords: [
    "AI resume optimizer",
    "ATS resume checker",
    "resume analysis",
    "job matching AI",
    "career coach",
    "resume improvement",
    "ATS optimization",
    "resume keywords",
    "job application success",
    "interview rate boost",
    "GPT-4 resume",
    "professional resume",
  ],
  authors: [{ name: "Rejectly.pro", url: "https://rejectly.pro" }],
  creator: "Rejectly.pro",
  publisher: "Rejectly.pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rejectly.pro",
    siteName: "Rejectly.pro",
    title: "Rejectly.pro - AI Resume Optimizer | Get 3x More Interviews",
    description: "Transform your resume with AI-powered analysis. Beat ATS systems, find perfect job matches, and boost your interview rate by 300%. Free 30-second analysis.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro - AI-Powered Resume Optimization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rejectlypro",
    creator: "@rejectlypro",
    title: "Rejectly.pro - AI Resume Optimizer | Get 3x More Interviews",
    description: "Transform your resume with AI. Beat ATS systems and land 3x more interviews in 7 days.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://rejectly.pro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
                /* Primary Colors (Cool Spectrum) */
                --primary-900: #071952;
                --primary-700: #0B666A;
                --primary-500: #35A29F;
                --primary-200: #0B666A;
                --primary-100: rgba(53, 162, 159, 0.15);
                --primary-50: rgba(53, 162, 159, 0.08);
                --landing: #f84938;
                --landing-button: #f84938;
                --navbar: #03374e;

                /* Accent (Warm CTA) */
                --accent: #FF7A73;
                --accent-hover: #ff6a64;
                --accent-light: rgba(255, 122, 115, 0.1);

                /* Success */
                --success: #6EE7B7;
                --success-light: rgba(110, 231, 183, 0.1);
                --success-bg: rgba(110, 231, 183, 0.08);
                --success-border: rgba(110, 231, 183, 0.3);

                /* Dark Mode Neutrals */
                --dark-bg: #002332;
                --dark-card: #121623;
                --dark-text: #F3F4F8;
                --dark-subtext: #A5A9B3;

                /* Gradients */
                --gradient-primary: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
                --gradient-accent: linear-gradient(135deg, var(--accent) 0%, #ff6a64 100%);

                /* Legacy mappings for dark mode */
                --bg-color: var(--dark-bg);
                --text-color: var(--dark-text);
                --surface-color: var(--dark-card);
                --surface-hover: #1a1f2e;
                --bg-alt: var(--dark-card);
                --border-color: rgba(255, 255, 255, 0.08);
                --primary-color: var(--primary-500);
                --text-secondary: var(--dark-subtext);
                --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              }

              /* Light theme - Applied via data-theme attribute */
              :root[data-theme="light"] {
                /* Light Mode Neutrals */
                --light-bg: #F4F7FA;
                --light-card: #FFFFFF;
                --light-text: #1E1E2A;
                --light-subtext: #5C6570;
                --landing: #006e81;
                --landing-button: #ea7a18;
                --navbar: #fefffd;

                /* Light mode color overrides */
                --primary-100: rgba(11, 102, 106, 0.12);
                --primary-50: rgba(11, 102, 106, 0.06);
                --success-light: rgba(40, 167, 69, 0.1);
                --success-bg: rgba(40, 167, 69, 0.05);
                --success-border: rgba(40, 167, 69, 0.3);
                --accent-light: rgba(255, 122, 115, 0.12);

                /* Legacy mappings for light mode */
                --bg-color: var(--light-bg);
                --text-color: var(--light-text);
                --surface-color: var(--light-card);
                --surface-hover: #F3F4F6;
                --bg-alt: var(--light-card);
                --border-color: var(--primary-200);
                --primary-color: var(--primary-500);
                --text-secondary: var(--light-subtext);
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

        {/* Structured Data (JSON-LD) */}
        <OrganizationSchema />
        <WebSiteSchema />
        <ProductSchema />
        <ReviewSchema />

        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
