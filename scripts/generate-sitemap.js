const fs = require('fs');
const path = require('path');
const { BLOG_POSTS } = require('../data/blogPosts.js');

const BASE_URL = 'https://www.usealltools.com';

const STATIC_ROUTES = [
  '',
  '/tools',
  '/blog',
  '/about',
  '/privacy',
  '/llms.txt',
  '/llms-full.txt',
  '/sitemap.xml',
  '/sitemap.txt',
  // Calculators
  '/tools/calculator/income-tax-calculator',
  '/tools/calculator/gst-calculator',
  '/tools/calculator/loan-emi-calculator',
  '/tools/calculator/sip-calculator',
  '/tools/calculator/interest-calculator',
  '/tools/calculator/bmi-calculator',
  '/tools/calculator/age-calculator',
  '/tools/calculator/factorial-calculator',
  '/tools/calculator/decimal-binary-calculator',
  // Converters
  '/tools/converters/base64-encoder-decoder',
  '/tools/converters/unix-timestamp-converter',
  '/tools/converters/currency-converter',
  '/tools/converters/number-words-converter',
  '/tools/converters/unit-converter',
  '/tools/converters/markdown-html-converter',
  '/tools/converters/svg-converter',
  '/tools/converters/morse-code-converter',
  // Checkers
  '/tools/checkers/color-contrast-checker',
  '/tools/checkers/hash-generator',
  '/tools/checkers/prime-checker',
  '/tools/checkers/palindrome-checker',
  '/tools/checkers/leap-year-checker',
  '/tools/checkers/json-formatter',
  // Passwords
  '/tools/password-tools/password-generator',
  '/tools/password-tools/password-age-checker',
  // Code & Text
  '/tools/code-text-tools/qr-code-generator',
  '/tools/code-text-tools/uuid-generator',
  '/tools/code-text-tools/utm-builder',
  '/tools/code-text-tools/css-glassmorphism-generator',
  '/tools/code-text-tools/regex-tester',
  '/tools/code-text-tools/word-counter',
  '/tools/code-text-tools/google-serp-preview',
  '/tools/code-text-tools/seo-article-analyzer',
  '/tools/code-text-tools/text-difference',
  '/tools/code-text-tools/random-morse-generator',
  '/text',
  // Root Aliases
  '/password-generator',
  '/loan-emi-calculator',
  '/interest-calculator',
  '/prime-checker',
  '/morse-code-converter',
  '/password-age-checker',
];

const allUrls = [
  ...STATIC_ROUTES.map(r => `${BASE_URL}${r}`),
  ...BLOG_POSTS.map(p => `${BASE_URL}/blog/${p.slug}`)
];

const outputPath = path.join(__dirname, '..', 'public', 'sitemap.txt');
fs.writeFileSync(outputPath, allUrls.join('\n') + '\n', 'utf8');

console.log(`Generated public/sitemap.txt with ${allUrls.length} total URLs.`);
