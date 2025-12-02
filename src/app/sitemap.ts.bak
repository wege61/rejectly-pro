import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.rejectly.pro'

  // Use ISO string format for better compatibility
  const now = new Date().toISOString()

  // Different dates for different update frequencies
  const today = new Date()
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  // Static routes with their priorities and change frequencies
  const routes: MetadataRoute.Sitemap = [
    // High priority pages (landing, core features)
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: lastWeek,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: lastMonth,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: lastMonth,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: lastMonth,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },

    // Auth pages (lower priority, but still indexed)
    {
      url: `${baseUrl}/signup`,
      lastModified: lastMonth,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: lastMonth,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },

    // Informational pages
    {
      url: `${baseUrl}/about`,
      lastModified: lastMonth,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastMonth,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },

    // Legal pages
    {
      url: `${baseUrl}/terms`,
      lastModified: lastMonth,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: lastMonth,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  return routes
}
