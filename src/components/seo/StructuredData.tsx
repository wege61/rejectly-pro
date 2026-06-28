export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rejectly.pro',
    url: 'https://rejectly.pro',
    logo: 'https://rejectly.pro/logo.png',
    description: 'Free ATS resume checker and AI-powered resume optimization platform. Check your resume ATS compatibility score and get optimized resumes that pass Applicant Tracking Systems.',
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
    <script
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
    description: 'Free ATS resume checker and AI resume optimizer. Check your resume against ATS systems, get your ATS compatibility score, and create job-specific optimized resumes.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://rejectly.pro/blog?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ProductSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Rejectly.pro ATS Resume Checker & Optimizer',
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
    description: 'Free ATS resume checker that analyzes your resume against Applicant Tracking Systems, identifies ATS compatibility issues, missing keywords, and provides actionable improvements to increase your ATS pass rate and interview callbacks.',
    featureList: [
      'Free ATS Resume Checker',
      'ATS Compatibility Score',
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
    <script
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
    <script
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BlogPostingSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  slug,
  wordCount,
  category,
  tags,
  readingTime,
}: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  slug: string;
  wordCount?: number;
  category?: string;
  tags?: string[];
  readingTime?: number;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://rejectly.pro/blog/${slug}#article`,
    headline: title,
    description: description,
    image: {
      '@type': 'ImageObject',
      url: image || 'https://rejectly.pro/og-image.png',
      width: 1200,
      height: 630,
    },
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
      url: 'https://rejectly.pro/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rejectly.pro',
      url: 'https://rejectly.pro',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rejectly.pro/logo.png',
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://rejectly.pro/blog/${slug}`,
    },
    isPartOf: {
      '@type': 'Blog',
      '@id': 'https://rejectly.pro/blog',
      name: 'Rejectly.pro Blog',
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    ...(wordCount && { wordCount }),
    ...(readingTime && { timeRequired: `PT${readingTime}M` }),
    ...(category && { articleSection: category }),
    ...(tags && tags.length > 0 && { keywords: tags.join(', ') }),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.article-content p:first-of-type'],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ArticleFAQSchema({
  faqs,
  articleUrl,
}: {
  faqs: Array<{ question: string; answer: string }>;
  articleUrl: string;
}) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${articleUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
    isPartOf: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  image,
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
  image?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    ...(image && { image }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogListSchema({
  posts,
}: {
  posts: Array<{
    title: string;
    slug: string;
    excerpt: string;
    datePublished: string;
  }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Rejectly.pro Blog',
    description: 'Expert tips on resume optimization, ATS systems, career advice, and job search strategies.',
    url: 'https://rejectly.pro/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Rejectly.pro',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rejectly.pro/logo.png',
      },
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://rejectly.pro/blog/${post.slug}`,
      datePublished: post.datePublished,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ReviewSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Rejectly.pro ATS Resume Checker',
    description: 'Free ATS resume checker and AI-powered resume optimization tool',
    brand: {
      '@type': 'Organization',
      name: 'Rejectly.pro',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Sarah Chen',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        datePublished: '2024-11-15',
        reviewBody:
          'I went from 2 responses out of 50 applications to 8 interviews in 2 weeks. The ATS optimization alone was worth 10x the price. My resume now actually gets read by humans, not just rejected by bots.',
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Marcus Williams',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        datePublished: '2024-11-10',
        reviewBody:
          'Best investment in my job search. The AI caught keyword gaps I never would have noticed. Within 3 days of using my optimized resume, I had interview requests from 3 companies I thought were out of reach.',
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Priya Patel',
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        datePublished: '2024-11-05',
        reviewBody:
          'The cover letter generator saved me hours. I was spending 45 minutes per application writing custom letters. Now I get personalized, compelling cover letters in under a minute. Already landed 2 final round interviews.',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
