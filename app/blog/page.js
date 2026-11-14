import { BLOG_POSTS } from '@/data/blogPosts';
import BlogIndexClient from '@/components/blog/BlogIndexClient';

export const metadata = {
  title: 'Engineering, Tax & Security Guides | Use All Tools Blog',
  description: 'Explore 25+ comprehensive, high-volume guides on Indian taxation (FY 2025-26), financial formulas (EMI, SIP, GST), password entropy, and zero-telemetry development.',
  keywords: [
    'online calculators blog',
    'income tax guide fy 2025-26',
    'emi calculator formula',
    'sip compounding guide',
    'password security entropy',
    'offline json formatter',
    'gst inclusive formula',
    'Use All Tools articles'
  ],
  alternates: {
    canonical: 'https://www.usealltools.com/blog',
  },
  openGraph: {
    title: 'Engineering, Tax & Security Guides | Use All Tools Blog',
    description: 'Explore 25+ comprehensive guides on Indian taxation, financial formulas, cryptography, and client-side web utilities.',
    url: 'https://www.usealltools.com/blog',
    siteName: 'Use All Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering, Tax & Security Guides | Use All Tools Blog',
    description: 'Explore 25+ comprehensive guides on Indian taxation, financial formulas, cryptography, and client-side web utilities.',
  },
};

export default function BlogPage() {
  return <BlogIndexClient posts={BLOG_POSTS} />;
}
