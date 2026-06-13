#!/usr/bin/env node
/**
 * check-seo.js — On-page SEO + AI-search (AEO) readiness linter for windloadcalc.com
 *
 * Companion to check-mobile.js. Encodes the on-page essentials every public page
 * needs to rank in standard search AND be cleanly understood/quoted by AI engines
 * (ChatGPT, Perplexity, Google AI Overviews, Claude).
 *
 *   node scripts/check-seo.js                 # scan all live pages
 *   node scripts/check-seo.js index.html      # scan specific file(s)
 *
 * Exit 0 = no CRITICAL findings, 1 = at least one CRITICAL.
 *
 * CRITICAL findings = things that actively hurt indexing or violate a project
 * hard rule (missing H1, fake review schema, robots/sitemap contradiction).
 * HIGH/LOW = quality gaps. Gated/utility pages (login, cart, *-success, etc.)
 * are expected to be noindex and are checked accordingly, not penalised.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE = /(?:^|[\\/])(?:website|Lib|venv|venv_clean|new_env|\.backups|node_modules|site-packages|\.venv|asce_wind_processor|email)[\\/]/i;

// Pages that SHOULD be noindex (gated app / utility / Stripe redirects). For
// these we verify they ARE noindex and are NOT in the sitemap, per CLAUDE.md.
const SHOULD_BE_NOINDEX = /(?:^|\/)(?:account|dashboard|cart|login|admin|reset-password|join-team|download|migrate|team-management|batch-entry-alt|bip-test|payment-thank-you)\.html$|(?:success|cancel|cancelled)\.html$/i;

// ---- helpers ----------------------------------------------------------------

function liveHtmlFiles(args) {
  if (args.length) return args.map((a) => path.resolve(ROOT, a));
  let tracked = '';
  try {
    tracked = execSync('git ls-files "*.html"', { cwd: ROOT, encoding: 'utf8' });
  } catch (e) {
    console.error('git ls-files failed:', e.message);
    process.exit(2);
  }
  return tracked.split(/\r?\n/).filter(Boolean).filter((f) => !EXCLUDE.test(f)).map((f) => path.resolve(ROOT, f));
}

// file path -> canonical sitemap URL path ('' = homepage)
function urlPathOf(file) {
  let rel = path.relative(ROOT, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '';
  rel = rel.replace(/\/index\.html$/, '');     // foo/index.html -> foo
  return rel;
}

function sitemapPaths() {
  const set = new Set();
  let xml = '';
  try { xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8'); } catch { return set; }
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    let p = m[1].replace(/^https?:\/\/[^/]+\//i, '').replace(/\/$/, '');
    set.add(p);
  }
  return set;
}

const rel = (f) => path.relative(ROOT, f).replace(/\\/g, '/');
const firstGroup = (re, text) => { const m = re.exec(text); return m ? m[1].trim() : null; };

// ---- per-page checks --------------------------------------------------------

function checkPage(file, text, smap) {
  const findings = [];
  const add = (sev, id, msg) => findings.push({ sev, id, msg });
  const up = urlPathOf(file);
  const inSitemap = smap.has(up);

  const robots = (firstGroup(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i, text) || '').toLowerCase();
  const noindex = /noindex/.test(robots);
  const shouldNoindex = SHOULD_BE_NOINDEX.test(rel(file));

  // --- robots / sitemap agreement (CLAUDE.md hard rules) ---
  if (noindex && inSitemap) add('CRITICAL', 'NOINDEX_IN_SITEMAP', 'Page is noindex but listed in sitemap.xml — contradiction. Remove from sitemap or make it indexable.');
  if (shouldNoindex && !noindex) add('CRITICAL', 'GATED_NOT_NOINDEX', 'Gated/utility page should be noindex,nofollow but is not.');
  if (shouldNoindex && inSitemap) add('CRITICAL', 'GATED_IN_SITEMAP', 'Gated/utility page should not be in sitemap.xml.');

  // Everything below is only expected on PUBLIC (indexable) pages.
  const isPublic = !noindex && !shouldNoindex;

  // --- title ---
  const title = firstGroup(/<title>([^<]*)<\/title>/i, text);
  if (!title) add('CRITICAL', 'NO_TITLE', 'Missing <title>.');
  else if (isPublic && (title.length < 10 || title.length > 65)) add('LOW', 'TITLE_LENGTH', `<title> is ${title.length} chars (aim 10-65): "${title.slice(0, 70)}"`);

  // --- meta description ---
  const desc = firstGroup(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i, text);
  if (isPublic && !desc) add('HIGH', 'NO_META_DESC', 'Missing meta description.');
  else if (isPublic && desc && (desc.length < 50 || desc.length > 165)) add('LOW', 'META_DESC_LENGTH', `Meta description is ${desc.length} chars (aim 50-165).`);

  // --- canonical ---
  const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(text);
  if (isPublic && !hasCanonical) add('HIGH', 'NO_CANONICAL', 'Missing <link rel="canonical">.');

  // --- exactly one h1 ---
  const h1s = (text.match(/<h1[\s>]/gi) || []).length;
  if (isPublic && h1s === 0) add('CRITICAL', 'NO_H1', 'No <h1> on the page (weak topical signal for search + AI).');
  else if (isPublic && h1s > 1) add('HIGH', 'MULTIPLE_H1', `${h1s} <h1> elements (use exactly one).`);

  // --- Open Graph / Twitter (link previews + some AI surfaces) ---
  if (isPublic) {
    if (!/property=["']og:title["']/i.test(text)) add('LOW', 'NO_OG_TITLE', 'Missing og:title.');
    if (!/property=["']og:description["']/i.test(text)) add('LOW', 'NO_OG_DESC', 'Missing og:description.');
    if (!/property=["']og:image["']/i.test(text)) add('LOW', 'NO_OG_IMAGE', 'Missing og:image (no social/AI thumbnail).');

    // og:image present but pointing at a file that doesn't exist = a broken
    // social/AI thumbnail (404). Only checks our-own/relative paths.
    const ogImg = firstGroup(/property=["']og:image["'][^>]*content=["']([^"']+)["']/i, text);
    if (ogImg) {
      let p = ogImg.replace(/^https?:\/\/(?:www\.)?windloadcalc\.com/i, '');
      if (!/^https?:\/\//i.test(p)) {
        p = p.replace(/^\//, '').split(/[?#]/)[0];
        if (p && !fs.existsSync(path.join(ROOT, p))) {
          add('HIGH', 'BROKEN_OG_IMAGE', `og:image references a missing file (404): ${ogImg}`);
        }
      }
    }
  }

  // --- structured data ---
  const hasJsonLd = /application\/ld\+json/i.test(text);
  if (isPublic && !hasJsonLd) add('HIGH', 'NO_JSONLD', 'No JSON-LD structured data (helps search + AI understand the page).');

  // --- FAKE REVIEW SCHEMA (CLAUDE.md hard rule — sitewide manual-action risk) ---
  if (/("|')?(aggregateRating|reviewCount|ratingCount|ratingValue)("|')?\s*:/i.test(text)) {
    add('CRITICAL', 'REVIEW_SCHEMA', 'aggregateRating/reviewCount/ratingValue present — only allowed if backed by REAL verifiable reviews. Fake review schema risks a Google manual action.');
  }

  // --- indexable but absent from sitemap (informational) ---
  if (isPublic && !inSitemap) add('LOW', 'NOT_IN_SITEMAP', 'Indexable page is not in sitemap.xml (intentional? otherwise add it).');

  return findings;
}

// ---- run --------------------------------------------------------------------

const files = liveHtmlFiles(process.argv.slice(2));
const smap = sitemapPaths();
let critical = 0, high = 0, low = 0;
const byFile = new Map();

for (const file of files) {
  let text;
  try { text = fs.readFileSync(file, 'utf8'); } catch { continue; }
  const findings = checkPage(file, text, smap);
  if (findings.length) byFile.set(file, findings);
}

// sitemap entries with no matching live file (404 risk). Only meaningful in a
// full scan — in single-file mode we can't see the whole site, so skip it.
const fullScan = process.argv.slice(2).length === 0;
const livePaths = new Set(liveHtmlFiles([]).map(urlPathOf));
const orphanSitemap = fullScan ? [...smap].filter((p) => !livePaths.has(p)) : [];

// ---- report -----------------------------------------------------------------

console.log(`\nSEO + AI-readiness report — ${files.length} live page(s) scanned\n`);

for (const [file, findings] of byFile) {
  const c = findings.filter((f) => f.sev === 'CRITICAL').length;
  const h = findings.filter((f) => f.sev === 'HIGH').length;
  if (!c && !h && process.argv.length <= 2 && findings.every((f) => f.sev === 'LOW')) {
    // In full-scan mode, suppress LOW-only files to keep the report focused.
    findings.forEach((f) => { low++; });
    continue;
  }
  console.log(`• ${rel(file)}`);
  for (const f of findings) {
    if (f.sev === 'CRITICAL') critical++; else if (f.sev === 'HIGH') high++; else low++;
    console.log(`    [${f.sev}] ${f.id} — ${f.msg}`);
  }
  console.log('');
}

if (orphanSitemap.length) {
  console.log('• sitemap.xml');
  for (const p of orphanSitemap) {
    critical++;
    console.log(`    [CRITICAL] SITEMAP_404 — "${p || '/'}" is in sitemap.xml but no matching page file exists (404 wastes crawl budget).`);
  }
  console.log('');
}

console.log(`Summary: ${critical} CRITICAL, ${high} HIGH, ${low} LOW (LOW-only pages suppressed in full scan; pass a filename to see them).`);
process.exit(critical > 0 ? 1 : 0);
