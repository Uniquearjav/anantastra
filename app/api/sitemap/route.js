import { NextResponse } from 'next/server';
import sitemap from '@/app/sitemap';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    const entries = await sitemap();

    // If client requested JSON format
    if (format === 'json') {
      return NextResponse.json({
        total: entries.length,
        generatedAt: new Date().toISOString(),
        routes: entries,
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        }
      });
    }

    // Otherwise return XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const item of entries) {
      const dateStr = item.lastModified instanceof Date 
        ? item.lastModified.toISOString() 
        : new Date(item.lastModified).toISOString();

      xml += '  <url>\n';
      xml += `    <loc>${item.url}</loc>\n`;
      xml += `    <lastmod>${dateStr}</lastmod>\n`;
      if (item.changeFrequency) {
        xml += `    <changefreq>${item.changeFrequency}</changefreq>\n`;
      }
      if (item.priority !== undefined) {
        xml += `    <priority>${item.priority}</priority>\n`;
      }
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating dynamic sitemap API response:', error);
    return NextResponse.json({ error: 'Failed to generate dynamic sitemap' }, { status: 500 });
  }
}