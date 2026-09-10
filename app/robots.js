export const dynamic = 'force-dynamic';

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://anantastra.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/llms-full.txt', '/api/sitemap'],
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
        allow: ['/', '/llms.txt', '/llms-full.txt'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

