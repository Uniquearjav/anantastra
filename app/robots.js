export const dynamic = 'force-dynamic';

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.usealltools.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/sitemap.xml', '/sitemap.txt', '/api/sitemap'],
        disallow: ['/_next/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'PerplexityBot',
          'Anthropic-AI',
          'Google-Extended',
          'cohere-ai',
          'OAI-SearchBot',
        ],
        allow: ['/', '/llms.txt', '/llms-full.txt', '/sitemap.txt'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap.txt`,
    ],
  };
}

