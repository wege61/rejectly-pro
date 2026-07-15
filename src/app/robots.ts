import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://rejectly.pro'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/ats-check',
          '/cv-builder',
          '/pricing',
          '/how-it-works',
          '/features',
          '/faq',
          '/about',
          '/contact',
          '/terms',
          '/privacy',
          '/signup',
          '/login',
          '/blog',
          '/blog/*',
          '/resume/*',
          '/favicon.ico',
          '/favicon.svg',
          '/favicon-*.png',
          '/apple-touch-icon.png',
          '/android-chrome-*.png',
          '/og-image.png',
          '/logo.png',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/settings',
          '/settings/*',
          '/billing',
          '/billing/*',
          '/analyze',
          '/analyze/*',
          '/jobs',
          '/jobs/*',
          // NOTE: robots rules are prefix matches. Keep the trailing-slash and
          // bare variants separate so /cv-builder and /cover-letters-* marketing
          // pages stay crawlable (the explicit Allow above wins by length, but
          // only within this same group — never re-add bot-specific groups that
          // don't repeat the Allow list, that's what blocked /cv-builder in GSC).
          '/cover-letters',
          '/cover-letters/*',
          '/cv',
          '/cv/*',
          '/reports',
          '/reports/*',
          '/api/',
          '/api/*',
          '/auth/callback',
          '/forgot-password',
          '/reset-password',
          '/_next/',
        ],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/image-sitemap.xml`,
    ],
  }
}
