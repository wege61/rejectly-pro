import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import Providers from "@/components/Providers";
import { OrganizationSchema, WebSiteSchema, ProductSchema } from "@/components/seo/StructuredData";
import { WebVitals } from "@/components/analytics/WebVitals";

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL('https://rejectly.pro'),
  title: {
    default: "Rejectly.pro: ATS Resume Checker for Students & New Grads",
    template: "%s | Rejectly.pro"
  },
  description:
    "Before a recruiter sees your resume, an applicant tracking system reads it. Rejectly shows you what it sees, then rewrites your projects and internships in the job's words, without inventing anything.",
  keywords: [
    "ATS resume checker",
    "ATS resume checker free",
    "free ATS resume checker",
    "AI resume optimizer",
    "ATS optimization",
    "resume ATS score",
    "ATS compatible resume",
    "resume scanner",
    "new grad resume",
    "entry level ATS",
    "first job resume",
    "resume for students",
    "job matching AI",
    "resume improvement",
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
    title: "Rejectly.pro: ATS Resume Checker for Students & New Grads",
    description: "Before a recruiter sees your resume, an applicant tracking system reads it. Rejectly shows you what it sees, then rewrites your projects and internships in the job's words, without inventing anything.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro ATS resume checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rejectlypro",
    creator: "@rejectlypro",
    title: "Rejectly.pro: ATS Resume Checker for Students & New Grads",
    description: "Before a recruiter sees your resume, an applicant tracking system reads it. Rejectly shows you what it sees, then rewrites your projects and internships in the job's words, without inventing anything.",
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
    icon: [
      { url: 'https://rejectly.pro/favicon.svg', type: 'image/svg+xml' },
      { url: 'https://rejectly.pro/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: 'https://rejectly.pro/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: 'https://rejectly.pro/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: 'https://rejectly.pro/favicon.ico', sizes: '48x48' },
    ],
    shortcut: 'https://rejectly.pro/favicon.ico',
    apple: [
      { url: 'https://rejectly.pro/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Runs before paint so the saved theme never flashes. Light is the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('rj-theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){document.documentElement.setAttribute('data-theme','light')}`,
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
                --checkbox: rgba(255, 255, 255, 0.2);

                /* Accent (Warm CTA) */
                --accent: #FF7A73;
                --accent-rgb: 255, 122, 115;
                --accent-hover: #ff6a64;
                --accent-light: rgba(255, 122, 115, 0.1);

                /* Success */
                --success: #6EE7B7;
                --success-light: rgba(110, 231, 183, 0.1);
                --success-bg: rgba(110, 231, 183, 0.08);
                --success-border: rgba(110, 231, 183, 0.3);

                /* Dark Mode Neutrals */
                --dark-bg: #151517;
                --dark-card: #000000;
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

              /* Lets the hero's Parser Lens animate its split position in pure CSS. */
              @property --rj-lens-pos {
                syntax: '<percentage>';
                inherits: true;
                initial-value: 62%;
              }

              /* Redesign tokens (rj-*). Paper and ink, with one job per color:
                 hl = brand + keyword match, pen = rejection only, pass = system success only.
                 Legacy variables above stay untouched until each screen is migrated. */
              :root {
                --rj-font: var(--font-geist), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                --rj-mono: var(--font-geist-mono), ui-monospace, 'SF Mono', Menlo, monospace;
                --rj-paper: #F3F4F1;
                --rj-surface: #FFFFFF;
                --rj-ink: #0D0E10;
                --rj-ink-2: #4A4D55;
                --rj-ink-3: #767A83;
                --rj-line: rgba(13, 14, 16, 0.10);
                --rj-hl: #FFE14D;
                --rj-hl-ink: #0D0E10;
                --rj-pen: #E0352B;
                --rj-pass: #138A52;
                --rj-btn: #0D0E10;
                --rj-btn-ink: #FFFFFF;
                --rj-nav: rgba(243, 244, 241, 0.8);
                --rj-doc: #FBFBF9;
                --rj-doc-ink: #1B1C20;
                --rj-doc-side: #26344D;
                --rj-term: #1A1B1F;
                --rj-term-ink: #D9DBD4;
                --rj-term-dim: #81858E;
                --rj-term-pass: #5CD69A;
                --rj-term-fail: #FF7468;
                --rj-shadow: 0 30px 60px -36px rgba(0, 0, 0, 0.35);
                --rj-sheet: #FFFFFF;
                --rj-tile: #F4F4F1;
                --rj-bridge: #0D0E10;
                --rj-bridge-ink: #F2F2EF;
                --rj-bridge-ink-2: #A6A9B0;
                --rj-bridge-card: #1A1B1F;
                --rj-bridge-line: rgba(255, 255, 255, 0.08);
              }
              [data-theme="dark"] {
                --rj-paper: #0C0D0F;
                --rj-surface: #16171A;
                --rj-ink: #F2F2EF;
                --rj-ink-2: #A6A9B0;
                --rj-ink-3: #7C808A;
                --rj-line: rgba(255, 255, 255, 0.09);
                --rj-pen: #FF5A4E;
                --rj-pass: #4BD08B;
                --rj-btn: #F2F2EF;
                --rj-btn-ink: #0D0E10;
                --rj-nav: rgba(12, 13, 15, 0.75);
                --rj-term: #101114;
                --rj-shadow: 0 30px 60px -36px rgba(0, 0, 0, 0.8);
                --rj-sheet: #0F1012;
                --rj-tile: #18191C;
                --rj-bridge: #1F2024;
                --rj-bridge-card: #2A2B30;
                --rj-bridge-line: rgba(255, 255, 255, 0.08);
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

        {/* Web Vitals Tracking */}
        <WebVitals />

        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
