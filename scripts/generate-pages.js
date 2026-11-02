import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_AI_TOOLS } from '../src/data/aiToolsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');
const distDir = path.resolve(rootDir, 'dist');

// Canonical live domain on Vercel
const CANONICAL_BASE_URL = 'https://www.allaitools.online';
const APEX_BASE_URL = 'https://allaitools.online';

const isPostBuild = process.argv.includes('--post-build');

// Helper to generate the HTML for a tool
function buildToolHtml(tool, index, scriptTags = '<script type="module" src="/src/main.jsx"></script>', linkTags = '') {
  const toolRank = index + 1;
  const canonicalUrl = `${CANONICAL_BASE_URL}/${tool.id}`;
  const pageTitle = `${tool.name} — Reviews, Pricing & Direct Access | AI Tool Matrix`;
  const metaDescription = `${tool.name} by ${tool.developer}: ${tool.hoverSummary || tool.tagline}. Rank #${toolRank} in popularity. Compare pricing, features, and open directly.`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    applicationCategory: tool.category,
    operatingSystem: 'Web, Cloud',
    offers: {
      '@type': 'Offer',
      price: tool.pricing === 'Free' ? '0' : 'Varies',
      priceCurrency: 'USD',
      category: tool.pricing
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.rating || 4.8,
      ratingCount: tool.ratingCount || 1000
    },
    description: tool.description,
    url: tool.url
  };

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <meta name="description" content="${metaDescription.replace(/"/g, '&quot;')}" />
    <meta name="keywords" content="${tool.name}, ${tool.name} AI, ${tool.developer}, ${tool.category}, ${tool.pricing}, AI tools directory, ${CANONICAL_BASE_URL}/${tool.id}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="all, index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

    <!-- Open Graph / Social -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${metaDescription.replace(/"/g, '&quot;')}" />
    <meta property="og:site_name" content="AI Tool Matrix" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${canonicalUrl}" />
    <meta property="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta property="twitter:description" content="${metaDescription.replace(/"/g, '&quot;')}" />

    <!-- Schema.org SoftwareApplication JSON-LD -->
    <script type="application/ld+json">
      ${JSON.stringify(structuredData, null, 2)}
    </script>

    <title>${pageTitle}</title>
    ${linkTags}
    ${scriptTags}
  </head>
  <body>
    <div id="root">
      <!-- Static SEO Fallback Preview (hydrated by React) -->
      <div style="font-family:system-ui,-apple-system,sans-serif; background:#080914; color:#f8fafc; min-height:100vh; padding:2rem 1.5rem; max-width:900px; margin:0 auto;">
        <nav style="margin-bottom:1.5rem;">
          <a href="/" style="color:#6366f1; text-decoration:none; font-weight:600;">← Back to AI Tools Directory</a>
        </nav>
        <header style="margin-bottom:1.5rem;">
          <h1 style="font-size:2.5rem; margin-bottom:0.5rem;">${tool.name}</h1>
          <p style="color:#94a3b8; font-size:1.1rem;">by <strong>${tool.developer}</strong> • Rank #${toolRank} (${tool.category})</p>
          <p style="font-size:1.2rem; margin:1rem 0; line-height:1.5;">${tool.tagline}</p>
        </header>
        <div style="margin:1.5rem 0;">
          <a href="${tool.url}" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:0.9rem 2rem; background:linear-gradient(135deg, #6366f1, #8b5cf6); color:#fff; text-decoration:none; border-radius:8px; font-weight:700; font-size:1.1rem;">
            Open ${tool.name} →
          </a>
        </div>
        <section style="margin:2rem 0; color:#cbd5e1; line-height:1.7;">
          <h2 style="color:#fff; font-size:1.4rem;">About ${tool.name}</h2>
          <p>${tool.description}</p>
        </section>
      </div>
    </div>
  </body>
</html>
`;
}

// Generate complete robots.txt
function getRobotsTxt() {
  return `# Robots.txt for https://www.allaitools.online
# Allow all web search engines, AI crawlers, and user agents

User-agent: *
Allow: /

# Google Search, Googlebot, Gemini & Extended Crawlers
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Googlebot-News
Allow: /

User-agent: Googlebot-Video
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Mediapartners-Google
Allow: /

User-agent: AdsBot-Google
Allow: /

# Microsoft Bing & Copilot
User-agent: Bingbot
Allow: /

User-agent: msnbot
Allow: /

# OpenAI Crawlers (ChatGPT, SearchGPT, GPTBot)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# Anthropic Claude Crawlers
User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

# Perplexity AI Search Crawler
User-agent: PerplexityBot
Allow: /

# Apple Intelligence
User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

# Common Crawl & Open Datasets
User-agent: CCBot
Allow: /

# Sitemap Declarations (HTTPS canonical endpoints without redirects)
Sitemap: ${CANONICAL_BASE_URL}/sitemap.xml
Sitemap: ${APEX_BASE_URL}/sitemap.xml
`;
}

// Generate complete sitemap.xml
function getSitemapXml() {
  const today = new Date().toISOString().split('T')[0];
  const sitemapUrls = [
    `  <url>
    <loc>${CANONICAL_BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`
  ];

  INITIAL_AI_TOOLS.forEach((tool) => {
    sitemapUrls.push(`  <url>
    <loc>${CANONICAL_BASE_URL}/${tool.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>
`;
}

if (!isPostBuild) {
  // Pre-build mode: populate public/
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Generate tool pages in public/
  INITIAL_AI_TOOLS.forEach((tool, index) => {
    const toolDir = path.join(publicDir, tool.id);
    if (!fs.existsSync(toolDir)) {
      fs.mkdirSync(toolDir, { recursive: true });
    }
    const html = buildToolHtml(tool, index);
    fs.writeFileSync(path.join(toolDir, 'index.html'), html, 'utf-8');
    // Also write [toolId].html as direct file
    fs.writeFileSync(path.join(publicDir, `${tool.id}.html`), html, 'utf-8');
  });

  // 2. Generate sitemap.xml
  const sitemapContent = getSitemapXml();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf-8');
  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapContent, 'utf-8');

  // 3. Generate robots.txt
  const robotsContent = getRobotsTxt();
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent, 'utf-8');
  fs.writeFileSync(path.join(rootDir, 'robots.txt'), robotsContent, 'utf-8');

  // 4. Generate _redirects for Netlify / Cloudflare
  const redirectsContent = `/robots.txt    /robots.txt    200
/sitemap.xml   /sitemap.xml   200
/*             /index.html    200
`;
  fs.writeFileSync(path.join(publicDir, '_redirects'), redirectsContent, 'utf-8');

  // 5. Generate .htaccess for Apache
  const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`;
  fs.writeFileSync(path.join(publicDir, '.htaccess'), htaccessContent, 'utf-8');

  console.log(`Pre-build complete: generated ${INITIAL_AI_TOOLS.length} tool pages, sitemap, robots, and rewrite configs.`);
} else {
  // Post-build mode: update dist/[toolId]/index.html and dist/[toolId].html with production assets
  const distIndexHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(distIndexHtmlPath)) {
    const distHtml = fs.readFileSync(distIndexHtmlPath, 'utf-8');

    // Extract production script and style tags
    const scriptMatch = distHtml.match(/<script type="module"[^>]*src="\/assets\/[^>]*><\/script>/gi);
    const linkMatch = distHtml.match(/<link rel="stylesheet"[^>]*href="\/assets\/[^>]*>/gi);

    const prodScript = scriptMatch ? scriptMatch.join('\n    ') : '';
    const prodLink = linkMatch ? linkMatch.join('\n    ') : '';

    INITIAL_AI_TOOLS.forEach((tool, index) => {
      const toolDistDir = path.join(distDir, tool.id);
      if (!fs.existsSync(toolDistDir)) {
        fs.mkdirSync(toolDistDir, { recursive: true });
      }
      const prodHtml = buildToolHtml(tool, index, prodScript, prodLink);
      fs.writeFileSync(path.join(toolDistDir, 'index.html'), prodHtml, 'utf-8');
      fs.writeFileSync(path.join(distDir, `${tool.id}.html`), prodHtml, 'utf-8');
    });

    // 404.html fallback in dist (exact copy of index.html for SPA fallback)
    fs.writeFileSync(path.join(distDir, '404.html'), distHtml, 'utf-8');

    // Ensure sitemap.xml and robots.txt are in dist
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), getSitemapXml(), 'utf-8');
    fs.writeFileSync(path.join(distDir, 'robots.txt'), getRobotsTxt(), 'utf-8');

    console.log(`Post-build complete: synchronized production asset bundles for ${INITIAL_AI_TOOLS.length} tools in dist/`);
  }
}
