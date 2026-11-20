const fs = require('fs');
const path = require('path');
const https = require('https');

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '5ffaf57c3f706928109c0e0405f6ceca';
const HOST = 'www.usealltools.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

// Read all URLs from public/sitemap.txt
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.txt');
if (!fs.existsSync(sitemapPath)) {
  console.error(`Error: ${sitemapPath} not found!`);
  process.exit(1);
}

const rawUrls = fs.readFileSync(sitemapPath, 'utf8')
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(line => line.length > 0 && line.startsWith('http'));

// Deduplicate URLs
const urlList = Array.from(new Set(rawUrls));

console.log('='.repeat(80));
console.log('INDEXNOW AUTOMATED SUBMISSION');
console.log('='.repeat(80));
console.log(`Host: ${HOST}`);
console.log(`Key: ${INDEXNOW_KEY}`);
console.log(`Key Location: ${KEY_LOCATION}`);
console.log(`Total URLs to submit: ${urlList.length}`);
console.log('Sample URLs:');
urlList.slice(0, 5).forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
console.log(`  ... and ${urlList.length - 5} more URLs.\n`);

// Helper for pre-flight check to verify the key file is live on production
function checkKeyOnce() {
  return new Promise((resolve) => {
    const req = https.get(KEY_LOCATION, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const bodyTrimmed = data.trim();
        if (res.statusCode === 200 && bodyTrimmed.includes(INDEXNOW_KEY)) {
          resolve({ ok: true, status: res.statusCode, body: bodyTrimmed });
        } else {
          resolve({ ok: false, status: res.statusCode, body: bodyTrimmed });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ ok: false, error: err.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ ok: false, error: 'Request timed out after 5000ms' });
    });
  });
}

async function verifyKeyFileOnProduction(maxAttempts = 1, delayMs = 15000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`[Pre-Flight] Checking live key file at ${KEY_LOCATION}${maxAttempts > 1 ? ` (Attempt ${attempt}/${maxAttempts})` : ''} ...`);
    const result = await checkKeyOnce();
    if (result.ok) {
      return result;
    }
    if (attempt < maxAttempts) {
      console.log(`[Pre-Flight] Key not live yet (HTTP ${result.status || 'ERR'}). Waiting ${delayMs / 1000}s for deployment...`);
      await new Promise(r => setTimeout(r, delayMs));
    } else {
      return result;
    }
  }
}

const payload = JSON.stringify({
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList,
});

function submitToIndexNow(endpointHost, endpointPath) {
  return new Promise((resolve) => {
    console.log(`Submitting ${urlList.length} URLs to https://${endpointHost}${endpointPath} ...`);

    const options = {
      hostname: endpointHost,
      port: 443,
      path: endpointPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'usealltools-indexnow-client/1.0',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`Response from ${endpointHost}: HTTP ${res.statusCode} ${res.statusMessage}`);
        if (data) {
          console.log(`Response Body: ${data}`);
        }

        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`[SUCCESS] IndexNow successfully received and accepted ${urlList.length} URLs!`);
        } else if (res.statusCode === 403) {
          console.log(`[NOTICE] HTTP 403: The remote search engine requires key verification file live on https://${HOST}/${INDEXNOW_KEY}.txt.`);
          console.log(`Ensure your latest deploy with public/${INDEXNOW_KEY}.txt is live on production.`);
        } else {
          console.log(`[STATUS] Received status code ${res.statusCode}`);
        }
        resolve({ host: endpointHost, statusCode: res.statusCode, body: data });
      });
    });

    req.on('error', (err) => {
      console.error(`[ERROR] Connection error to ${endpointHost}:`, err.message);
      resolve({ host: endpointHost, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  const force = process.argv.includes('--force');
  const isCI = Boolean(process.env.CI);
  const maxAttempts = isCI ? 6 : 1;

  // Perform pre-flight verification check
  const preflight = await verifyKeyFileOnProduction(maxAttempts, 15000);
  if (!preflight.ok && !force) {
    const errorDetail = preflight.error 
      ? preflight.error 
      : (preflight.status === 404 ? 'Not Found - 404' : (preflight.body && preflight.body.length > 50 ? 'Received HTML error page instead of key' : preflight.body));

    console.log('='.repeat(80));
    console.log('⚠️  PRE-FLIGHT VERIFICATION CHECK FAILED: Key file not live on production!');
    console.log('='.repeat(80));
    console.log(`Target URL: ${KEY_LOCATION}`);
    console.log(`Result: HTTP ${preflight.status || 'ERROR'} (${errorDetail})`);
    console.log('\nWHY THIS HAPPENED:');
    console.log('IndexNow search engines (Bing, Yandex, Seznam, Naver) require that you prove');
    console.log(`domain ownership of "${HOST}" by fetching the verification key file at:`);
    console.log(`  ${KEY_LOCATION}`);
    console.log('\nBecause this file is newly created locally and has not yet been pushed to GitHub');
    console.log('and deployed to production (Vercel), all search engines will reject the submission');
    console.log('with HTTP 403 Forbidden ("UserForbiddedToAccessSite").');
    console.log('\nHOW TO RESOLVE:');
    console.log('1. Commit and push your changes to GitHub:');
    console.log('   git add .');
    console.log('   git commit -m "feat(seo): add IndexNow verification key and submission workflow"');
    console.log('   git push origin main');
    console.log('2. Allow Vercel ~60 seconds to finish deploying the commit.');
    console.log(`3. Confirm https://${HOST}/${INDEXNOW_KEY}.txt loads in your browser.`);
    console.log('4. Run "npm run indexnow" again. (It will pass with HTTP 200 / 202).');
    console.log('='.repeat(80));
    console.log('(To bypass this check and submit anyway, run with: node scripts/submit-indexnow.js --force)\n');
    process.exit(1);
  }

  if (preflight.ok) {
    console.log(`[Pre-Flight SUCCESS] Live key verified on ${KEY_LOCATION}! Proceeding to submit...`);
  } else if (force) {
    console.log('[Pre-Flight BYPASSED] Submitting with --force flag.');
  }

  const endpoints = [
    { host: 'api.indexnow.org', path: '/indexnow' },
    { host: 'www.bing.com', path: '/indexnow' },
    { host: 'search.seznam.cz', path: '/indexnow' },
    { host: 'yandex.com', path: '/indexnow' },
  ];

  for (const ep of endpoints) {
    await submitToIndexNow(ep.host, ep.path);
    console.log('-'.repeat(60));
  }
}

run().then(() => {
  console.log('\nIndexNow submission routine completed.');
});

