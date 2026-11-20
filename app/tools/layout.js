import { BASE_URL } from '@/data/toolsSeo';
import { ToolPageWrapper } from '@/components/ads';

export const metadata = {
  title: 'Free Online Tools & Calculators Suite | 35+ Browser Utilities',
  description: 'Explore 35+ free, privacy-first web utilities and calculators: QR Generator, UUID, Base64, Glassmorphism, Color Contrast, Mutual Fund SIP, GST, Income Tax, Loan EMI, Interest, and Password tools. 100% client-side.',
  keywords: [
    'online tools suite',
    'free calculators online',
    'financial calculators',
    'developer utilities',
    'privacy first tools',
    'SIP calculator online',
    'income tax calculator India',
    'GST calculator',
    'loan EMI calculator',
    'password generator online',
    'JSON formatter',
    'unit converter'
  ],
  alternates: {
    canonical: `${BASE_URL}/tools`,
  },
  openGraph: {
    title: 'Free Online Tools & Calculators Suite | 25+ Browser Utilities',
    description: 'Explore 25+ free, privacy-first web utilities and calculators running 100% in your browser.',
    url: `${BASE_URL}/tools`,
    siteName: 'Use All Tools',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo.svg',
        width: 960,
        height: 240,
        alt: 'Use All Tools Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Tools & Calculators Suite | 25+ Browser Utilities',
    description: 'Explore 25+ free, privacy-first web utilities and calculators running 100% in your browser.',
    images: ['/logo.svg'],
  },
};

export default function ToolsLayout({ children }) {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Online Tools & Calculators Suite',
    description: 'A curated suite of client-side web utilities, calculators, and converters that execute 100% in the user browser without remote telemetry.',
    url: `${BASE_URL}/tools`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Use All Tools',
      url: BASE_URL,
    },
    breadcrumb: {
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
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <ToolPageWrapper>
        {children}
      </ToolPageWrapper>
    </>
  );
}
