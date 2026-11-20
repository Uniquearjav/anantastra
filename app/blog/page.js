import { BLOG_POSTS } from '@/data/blogPosts';
import BlogIndexClient from '@/components/blog/BlogIndexClient';
import { NativeBannerAd } from '@/components/ads';

export const metadata = {
  title: 'Engineering, Tax & Security Guides | Use All Tools Blog',
  description: 'Explore 40+ comprehensive, high-volume guides on Indian taxation, financial formulas (EMI, SIP, GST), cryptographic hashing, UUID architectures, and zero-telemetry development.',
  keywords: [
    'online calculators blog',
    'income tax guide fy 2025-26',
    'emi calculator formula',
    'sip compounding guide',
    'password security entropy',
    'offline json formatter',
    'gst inclusive formula',
    'QR code security',
    'UUID v4 vs v7 database keys',
    'WCAG color contrast guide',
    'Use All Tools articles'
  ],
  alternates: {
    canonical: 'https://www.usealltools.com/blog',
  },
  openGraph: {
    title: 'Engineering, Tax & Security Guides | Use All Tools Blog',
    description: 'Explore 40+ comprehensive guides on Indian taxation, financial formulas, cryptography, and client-side web utilities.',
    url: 'https://www.usealltools.com/blog',
    siteName: 'Use All Tools',
    type: 'website',
    images: [
      {
        url: 'https://www.usealltools.com/logo.svg',
        width: 960,
        height: 240,
        alt: 'Use All Tools Engineering & Tax Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering, Tax & Security Guides | Use All Tools Blog',
    description: 'Explore 40+ comprehensive guides on Indian taxation, financial formulas, cryptography, and client-side web utilities.',
    images: ['https://www.usealltools.com/logo.svg'],
  },
};

export default function BlogPage() {
  return (
    <>
      <BlogIndexClient posts={BLOG_POSTS} />
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl pb-12">
        <NativeBannerAd />
      </div>
    </>
  );
}
