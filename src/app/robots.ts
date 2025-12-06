import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.rejectly.pro'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
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
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
