import fs from 'fs';
import path from 'path';
import { BLOG_POSTS } from '@/data/blogPosts';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour, then revalidate

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://anantastra.vercel.app';

// Primary curated routes with priority metadata
const KNOWN_ROUTES = [
  { path: '', priority: 1.0, changeFrequency: 'daily' },
  { path: '/tools', priority: 0.95, changeFrequency: 'daily' },
  { path: '/tools/calculator/income-tax-calculator', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/calculator/gst-calculator', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/calculator/loan-emi-calculator', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/calculator/sip-calculator', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/calculator/interest-calculator', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/calculator/bmi-calculator', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/calculator/age-calculator', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/calculator/factorial-calculator', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/calculator/decimal-binary-calculator', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/converters/currency-converter', priority: 0.9, changeFrequency: 'daily' },
  { path: '/tools/converters/number-words-converter', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/converters/unit-converter', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/converters/markdown-html-converter', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/converters/svg-converter', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/converters/morse-code-converter', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/checkers/prime-checker', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/checkers/palindrome-checker', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/checkers/leap-year-checker', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/checkers/json-formatter', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/password-tools/password-generator', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/password-tools/password-age-checker', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/code-text-tools/google-serp-preview', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/code-text-tools/seo-article-analyzer', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/tools/code-text-tools/text-difference', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/tools/code-text-tools/random-morse-generator', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/text', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/password-generator', priority: 0.75, changeFrequency: 'weekly' },
  { path: '/loan-emi-calculator', priority: 0.75, changeFrequency: 'weekly' },
  { path: '/interest-calculator', priority: 0.75, changeFrequency: 'weekly' },
  { path: '/prime-checker', priority: 0.75, changeFrequency: 'weekly' },
  { path: '/morse-code-converter', priority: 0.75, changeFrequency: 'weekly' },
  { path: '/password-age-checker', priority: 0.75, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.85, changeFrequency: 'daily' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/llms.txt', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/llms-full.txt', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/sitemap.txt', priority: 0.8, changeFrequency: 'weekly' },
];

// Helper to recursively discover all static routes in the app folder
function discoverAppRoutes(dir, baseDir = '') {
  let routes = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(baseDir, entry.name);

      // Skip dynamic params, API routes, private directories, and test files
      if (
        entry.name.startsWith('_') ||
        entry.name.startsWith('.') ||
        entry.name.startsWith('[') ||
        entry.name === 'api'
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        routes = routes.concat(discoverAppRoutes(fullPath, relativePath));
      } else if (entry.isFile() && (entry.name === 'page.js' || entry.name === 'page.jsx' || entry.name === 'page.tsx')) {
        let routePath = baseDir.replace(/\\/g, '/');
        if (routePath === '' || routePath === '.') {
          routePath = '';
        } else {
          routePath = `/${routePath}`;
        }

        // Get file last modification time
        let mtime = new Date();
        try {
          const stats = fs.statSync(fullPath);
          mtime = stats.mtime;
        } catch {
          // fallback to now
        }

        routes.push({
          path: routePath,
          filePath: fullPath,
          lastModified: mtime
        });
      }
    }
  } catch (err) {
    console.error('Error scanning app directory for sitemap:', err);
  }

  return routes;
}

export default async function sitemap() {
  const appDirectory = path.join(process.cwd(), 'app');
  const discoveredRoutes = discoverAppRoutes(appDirectory);

  // Map discovered routes into a fast lookup by path
  const discoveredMap = new Map();
  discoveredRoutes.forEach(r => {
    discoveredMap.set(r.path, r);
  });

  const sitemapEntries = [];
  const processedPaths = new Set();

  // First pass: Known curated routes with customized priorities
  for (const item of KNOWN_ROUTES) {
    const discovered = discoveredMap.get(item.path);
    const lastMod = discovered?.lastModified || new Date();

    sitemapEntries.push({
      url: `${BASE_URL}${item.path}`,
      lastModified: lastMod,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    });
    processedPaths.add(item.path);
  }

  // Second pass: Dynamic Blog Posts from data/blogPosts
  if (Array.isArray(BLOG_POSTS)) {
    for (const post of BLOG_POSTS) {
      const blogPath = `/blog/${post.slug}`;
      if (!processedPaths.has(blogPath)) {
        sitemapEntries.push({
          url: `${BASE_URL}${blogPath}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
        processedPaths.add(blogPath);
      }
    }
  }

  // Third pass: Any newly created pages automatically found on disk
  for (const [rPath, rData] of discoveredMap.entries()) {
    if (!processedPaths.has(rPath)) {
      let priority = 0.7;
      let changeFrequency = 'monthly';

      if (rPath.startsWith('/blog/')) {
        priority = 0.75;
        changeFrequency = 'monthly';
      } else if (rPath.startsWith('/tools/')) {
        priority = 0.85;
        changeFrequency = 'weekly';
      }

      sitemapEntries.push({
        url: `${BASE_URL}${rPath}`,
        lastModified: rData.lastModified || new Date(),
        changeFrequency,
        priority,
      });
      processedPaths.add(rPath);
    }
  }

  return sitemapEntries;
}
