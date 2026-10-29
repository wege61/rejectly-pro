import { PRICING } from '@/lib/constants';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rejectly.pro',
    url: 'https://rejectly.pro',
    logo: 'https://rejectly.pro/logo.png',
    description: 'ATS resume checker for students and new grads: see how applicant tracking software reads your resume, then fix it.',
    foundingDate: '2024',
    // The accounts the footer links to.
    sameAs: [
      'https://www.instagram.com/rejectly.pro',
      'https://www.tiktok.com/@rejectly.pro',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@rejectly.pro',
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
    // No SearchAction: Google retired the sitelinks searchbox (2024), and the
    // {search_term_string} placeholder gets crawled as a literal URL (seen in GSC).
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
      lowPrice: PRICING.SINGLE.price.toFixed(2),
      highPrice: PRICING.PRO.price.toFixed(2),
      priceCurrency: 'USD',
      priceSpecification: [PRICING.SINGLE, PRICING.STARTER, PRICING.PRO].map((plan) => ({
        '@type': 'PriceSpecification',
        price: plan.price.toFixed(2),
        priceCurrency: 'USD',
        name: plan.name,
      })),
    },
    description: 'Free ATS resume checker: see how applicant tracking software reads your resume, which keywords a job asks for, and what to fix. A job match rewrites your resume for one posting without inventing experience, with a cover letter and interview prep.',
    featureList: [
      'Free ATS resume scan',
      'ATS compatibility score',
      'Job match against a posting',
      'Rule-based resume rewrite',
      'Cover letter',
      'Interview prep',
      'CV Builder',
    ],
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
