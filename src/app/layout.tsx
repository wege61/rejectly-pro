import type { Metadata } from "next";
import Script from "next/script";
import StyledComponentsRegistry from "@/lib/registry";
import Providers from "@/components/Providers";
import { OrganizationSchema, WebSiteSchema, ProductSchema, ReviewSchema } from "@/components/seo/StructuredData";
import { CanonicalTag } from "@/components/seo/CanonicalTag";
import { WebVitals } from "@/components/analytics/WebVitals";

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

export const metadata: Metadata = {
  metadataBase: new URL('https://rejectly.pro'),
  title: {
    default: "Free ATS Resume Checker & Score Online | Rejectly.pro",
    template: "%s | Rejectly.pro"
  },
  description:
    "Get your free ATS resume score instantly. Hack the ATS and land your first job. Our AI translates your university projects and internships into corporate keywords to bypass HR bots.",
  keywords: [
    "new grad resume",
    "entry level ATS",
    "bypass ATS",
    "first job resume",
    "resume for students",
    "AI resume optimizer",
    "ATS resume checker",
    "job matching AI",
    "resume improvement",
    "ATS optimization",
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
    title: "Free ATS Resume Checker & Score Online | Rejectly.pro",
    description: "Get your free ATS resume score instantly. Hack the ATS and land your first job. Our AI translates your university projects and internships into corporate keywords to bypass HR bots.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro - Bypass ATS Bots",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rejectlypro",
    creator: "@rejectlypro",
    title: "Rejectly.pro - AI Resume Optimizer | A New Resume for Every Job",
    description: "Transform your resume with AI. Get a unique, ATS-optimized CV for every job you apply to.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-theme', 'dark');`,
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
        <CanonicalTag />
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

        {/* Web Vitals Tracking */}
        <WebVitals />

        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
