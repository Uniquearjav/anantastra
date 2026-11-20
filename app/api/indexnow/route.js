import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '5ffaf57c3f706928109c0e0405f6ceca';
const HOST = 'www.usealltools.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      // Optional custom body
    }

    let urlList = body.urlList;

    // Default to reading all URLs from public/sitemap.txt if no custom list is passed
    if (!Array.isArray(urlList) || urlList.length === 0) {
      const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.txt');
      if (fs.existsSync(sitemapPath)) {
        urlList = fs.readFileSync(sitemapPath, 'utf8')
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line.length > 0 && line.startsWith('http'));
      }
    }

    if (!urlList || urlList.length === 0) {
      return NextResponse.json({ error: 'No URLs available to submit' }, { status: 400 });
    }

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: Array.from(new Set(urlList)),
    };

    const endpoints = [
      'https://api.indexnow.org/indexnow',
      'https://www.bing.com/indexnow',
      'https://yandex.com/indexnow',
    ];

    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'User-Agent': 'usealltools-indexnow-service/1.0',
            },
            body: JSON.stringify(payload),
          });
          const text = await res.text();
          return { endpoint, status: res.status, ok: res.ok, response: text };
        } catch (err) {
          return { endpoint, error: err.message };
        }
      })
    );

    return NextResponse.json({
      success: true,
      submittedCount: payload.urlList.length,
      keyLocation: KEY_LOCATION,
      results,
    });
  } catch (error) {
    console.error('IndexNow API Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'IndexNow submission endpoint active',
    host: HOST,
    keyLocation: KEY_LOCATION,
    usage: 'Send a POST request to this endpoint to ping IndexNow engines (Bing, Yandex, etc.) with all sitemap.txt URLs.',
  });
}
