import { NextResponse } from 'next/server';

// Base URL of the website - update this with your domain
const BASE_URL = 'https://anantastra.com';

// Get the current date in the format YYYY-MM-DD
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// Define the routes structure
const getRoutes = () => {
  // Main routes
  const mainRoutes = [
    {
      path: '/',
      priority: '1.0',
      changeFrequency: 'weekly',
    },
    {
      path: '/tools',
      priority: '0.9',
      changeFrequency: 'weekly',
    },
    {
      path: '/text',
      priority: '0.8',
      changeFrequency: 'monthly',
    },
  ];

  // Tool categories and their tools
  const toolCategories = [
    {
      category: 'calculator',
      tools: ['interest-calculator', 'loan-emi-calculator'],
    },
    {
      category: 'converters',
      tools: ['morse-code-converter'],
    },
    {
      category: 'checkers',
      tools: ['prime-checker'],
    },
    {
      category: 'password-tools',
      tools: ['password-generator', 'password-age-checker'],
    },
  ];

  // Generate routes for all tools
  const toolRoutes = [];
  toolCategories.forEach(({ category, tools }) => {
    tools.forEach((tool) => {
      toolRoutes.push({
        path: `/tools/${category}/${tool}`,
        priority: '0.8',
        changeFrequency: 'monthly',
      });

      // Add legacy routes for redirects (with lower priority)
      toolRoutes.push({
        path: `/${tool}`,
        priority: '0.6',
        changeFrequency: 'monthly',
        redirectTo: `/tools/${category}/${tool}`,
      });
    });
  });

  return [...mainRoutes, ...toolRoutes];
};

// Generate the sitemap XML
const generateSitemapXML = () => {
  const routes = getRoutes();
  const currentDate = getCurrentDate();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach(route => {
    // Skip routes that are redirects
    if (route.redirectTo) {
      return;
    }
    
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.changeFrequency}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
};

// API route handler
export async function GET() {
  const sitemap = generateSitemapXML();
  
  // Return the XML with appropriate headers
  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  });
}