import Script from 'next/script'

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rejectly.pro',
    url: 'https://rejectly.pro',
    logo: 'https://rejectly.pro/logo.png',
    description: 'AI-powered resume optimization platform that helps job seekers get past ATS systems and land more interviews.',
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/rejectlypro',
      'https://linkedin.com/company/rejectlypro',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@rejectly.pro',
      contactType: 'Customer Support',
      availableLanguage: ['English'],
    },
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rejectly.pro',
    url: 'https://rejectly.pro',
    description: 'AI-powered resume optimization and ATS checker. Transform your resume and get 3x more interviews.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://rejectly.pro/?s={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ProductSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Rejectly.pro Resume Optimizer',
    operatingSystem: 'Web',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '2.00',
      highPrice: '12.00',
      priceCurrency: 'USD',
      priceSpecification: [
        {
          '@type': 'PriceSpecification',
          price: '2.00',
          priceCurrency: 'USD',
          name: 'Single Analysis',
        },
        {
          '@type': 'PriceSpecification',
          price: '7.00',
          priceCurrency: 'USD',
          name: 'Starter Pack',
        },
        {
          '@type': 'PriceSpecification',
          price: '12.00',
          priceCurrency: 'USD',
          name: 'Pro Monthly',
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    description: 'AI-powered resume optimization tool that analyzes your resume against job postings, identifies ATS compatibility issues, and provides actionable improvements to increase interview rates.',
    featureList: [
      'AI Resume Analysis',
      'ATS Optimization',
      'Job Matching Algorithm',
      'Cover Letter Generator',
      'Keyword Targeting',
      'Resume Rewriting',
    ],
    screenshot: 'https://rejectly.pro/screenshot.png',
  }

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
