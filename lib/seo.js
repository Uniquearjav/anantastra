import { BASE_URL, TOOLS_SEO } from '@/data/toolsSeo';

/**
 * Generates Next.js 14/15 compliant Metadata for any tool by key or slug.
 */
export function generateToolMetadata(toolKey) {
  const tool = TOOLS_SEO[toolKey];
  if (!tool) {
    return {
      title: 'Free Online Tools Suite | usealltools.com',
      description: 'Privacy-focused, fast online utilities that run 100% in your browser.',
    };
  }

  const canonicalUrl = `${BASE_URL}${tool.canonicalPath}`;
  const ogImageUrl = `${BASE_URL}/logo.svg`;

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: canonicalUrl,
      siteName: 'usealltools.com',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 960,
          height: 240,
          alt: `${tool.name} - usealltools.com`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.description,
      images: [ogImageUrl],
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
  };
}

/**
 * Generates Schema.org JSON-LD Structured Data for a tool.
 * Adheres strictly to Schema.org standards and excludes all contact information.
 */
export function generateToolSchema(toolKey) {
  const tool = TOOLS_SEO[toolKey];
  if (!tool) return null;

  const toolUrl = `${BASE_URL}${tool.canonicalPath}`;

  // 1. WebApplication Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: toolUrl,
    description: tool.description,
    applicationCategory: tool.category || 'UtilityApplication',
    operatingSystem: 'All (Web Browser)',
    browserRequirements: 'Requires JavaScript. Runs client-side in Chrome, Firefox, Safari, Edge.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    creator: {
      '@type': 'Organization',
      name: 'usealltools.com',
      url: BASE_URL,
      logo: `${BASE_URL}/logo-icon.svg`,
    },
  };

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${BASE_URL}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.categoryName || 'Calculators',
        item: `${BASE_URL}${tool.categorySlug || '/tools'}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: tool.name,
        item: toolUrl,
      },
    ],
  };

  // 3. FAQPage Schema (if FAQs are defined)
  const faqSchema =
    tool.faqs && tool.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: tool.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return {
    webAppSchema,
    breadcrumbSchema,
    faqSchema,
  };
}

/**
 * Generates Root WebSite and Organization Schema for Layout.
 * Excludes any personal or contact details.
 */
export function generateRootSchema() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'usealltools.com',
    alternateName: ['Anantastra', 'usealltools'],
    url: BASE_URL,
    description: 'Free, fast, privacy-focused online calculators and developer utilities running 100% in your browser.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/tools?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'usealltools.com',
    alternateName: 'Anantastra',
    url: BASE_URL,
    logo: `${BASE_URL}/logo-icon.svg`,
    sameAs: [
      'https://github.com/Uniquearjav/anantastra',
    ],
  };

  return {
    websiteSchema,
    organizationSchema,
  };
}
