const fs = require('fs');
const path = require('path');

// Read the sitemap JSON file
const sitemapJsonPath = path.join(__dirname, '../public/sitemap.json');
const sitemapData = JSON.parse(fs.readFileSync(sitemapJsonPath, 'utf8'));

// Base URL of the website
const BASE_URL = 'https://anantastra.com'; // Change this to your actual domain

// Generate sitemap XML
function generateSitemapXML(routes) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  routes.forEach(route => {
    // Skip routes that are redirects
    if (route.redirectTo) {
      return;
    }
    
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
    xml += `    <lastmod>${route.lastModified}</lastmod>\n`;
    xml += `    <changefreq>${route.changeFrequency}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
}

// Write sitemap.xml file
const sitemapXML = generateSitemapXML(sitemapData.routes);
const sitemapXMLPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapXMLPath, sitemapXML);

console.log('Sitemap XML generated successfully at public/sitemap.xml');