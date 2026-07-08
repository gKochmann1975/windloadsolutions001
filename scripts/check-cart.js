#!/usr/bin/env node
/**
 * check-cart.js — Shopping-cart integrity linter for windloadcalc.com shop pages
 *
 * WHY THIS EXISTS
 * ---------------
 * Add-to-Cart silently broke on the MWFRS shop: clicking a buy button popped
 * "This product is coming soon!" and nothing was added, so the header cart-count
 * badge never appeared. The bug was NOT the UI — it was `js/shopping-cart.js`
 * `PRODUCT_CATALOG` being out of sync with the live products: it still had
 * `mwfrs_starter` as `comingSoon` @ $49/$470 and had no `mwfrs_pro`/`mwfrs_premium`.
 * `cart.addItem` returns false (silent) for a missing code and alerts for a
 * comingSoon one. This script encodes that bug class so it's caught mechanically.
 *
 *     node scripts/check-cart.js                 # scan all shop pages
 *     node scripts/check-cart.js shop/mwfrs.html # scan specific file(s)
 *
 * Exit 0 = no CRITICAL findings, 1 = at least one CRITICAL.
 *
 * A shop "buy" button opts into the cart via `data-product-code`. For EVERY such
 * code on a page this checks:
 *   CRITICAL  the code exists in PRODUCT_CATALOG (else addItem -> silent no-op)
 *   CRITICAL  the code is NOT comingSoon (else addItem -> "coming soon" alert)
 *   CRITICAL  the page includes shopping-cart.js + cart-header.js (else no cart)
 *   HIGH      the catalog annualPrice is shown on the page (price drift guard)
 * See website/CLAUDE.md -> "Shop / Pricing Page Format" -> "Add-to-Cart behavior".
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE = /(?:^|[\\/])(?:website|Lib|venv|venv_clean|new_env|\.backups|\.archive|\.held-vs-pages|partials|node_modules|site-packages|\.venv|asce_wind_processor|email)[\\/]/i;
const rel = (f) => path.relative(ROOT, f).replace(/\\/g, '/');

// ---- parse PRODUCT_CATALOG from js/shopping-cart.js -------------------------
function loadCatalog() {
  const file = path.join(ROOT, 'js', 'shopping-cart.js');
  const src = fs.readFileSync(file, 'utf8');
  const m = /PRODUCT_CATALOG\s*=\s*\{([\s\S]*?)\n\};/.exec(src);
  if (!m) { console.error('Could not find PRODUCT_CATALOG in js/shopping-cart.js'); process.exit(2); }
  const body = m[1];
  const catalog = {};
  // each entry: 'code': { ...no nested braces... }
  const re = /'([a-z0-9_]+)'\s*:\s*\{([^}]*)\}/gi;
  let e;
  while ((e = re.exec(body)) !== null) {
    const code = e[1], block = e[2];
    const num = (k) => { const mm = new RegExp(k + '\\s*:\\s*(\\d+(?:\\.\\d+)?)').exec(block); return mm ? parseFloat(mm[1]) : null; };
    catalog[code] = {
      monthlyPrice: num('monthlyPrice'),
      annualPrice: num('annualPrice'),
      comingSoon: /comingSoon\s*:\s*true/.test(block),
    };
  }
  return catalog;
}

// ---- enumerate shop pages (git-tracked html that use data-product-code) -----
function shopHtmlFiles(args) {
  if (args.length) return args.map((a) => path.resolve(ROOT, a));
  let tracked = '';
  try { tracked = execSync('git ls-files "*.html"', { cwd: ROOT, encoding: 'utf8' }); }
  catch (e) { console.error('git ls-files failed:', e.message); process.exit(2); }
  return tracked.split(/\r?\n/).filter(Boolean).filter((f) => !EXCLUDE.test(f))
    .map((f) => path.resolve(ROOT, f))
    .filter((f) => { try { return /data-product-code=/.test(fs.readFileSync(f, 'utf8')); } catch { return false; } });
}

// price string as it would render on the page: 336 -> "$336", 1428 -> "$1,428"
function priceStr(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

// all git-tracked html (for the site-wide category-card scan), minus backups/vendored
function allHtmlFiles() {
  let tracked = '';
  try { tracked = execSync('git ls-files "*.html"', { cwd: ROOT, encoding: 'utf8' }); } catch { return []; }
  return tracked.split(/\r?\n/).filter(Boolean).filter((f) => !EXCLUDE.test(f)).map((f) => path.resolve(ROOT, f));
}

// shop pages that are LIVE = have >=1 data-product-code mapping to a non-comingSoon catalog entry.
// Returns the set of "shop/<name>.html" keys that category cards across the site link to.
function liveShopKeys(catalog) {
  const keys = new Set();
  for (const f of shopHtmlFiles([])) {
    const m = /(?:^|\/)(shop\/[a-z0-9-]+\.html)$/.exec(rel(f));
    if (!m) continue;
    let text; try { text = fs.readFileSync(f, 'utf8'); } catch { continue; }
    const codes = [...text.matchAll(/data-product-code=["']([a-z0-9_]+)["']/gi)].map((x) => x[1]);
    if (codes.some((c) => catalog[c] && !catalog[c].comingSoon)) keys.add(m[1]);
  }
  return keys;
}

// A calculator's status must agree everywhere: once its shop is live, NO category card
// linking to it may still say "Coming soon" (this bit us — the MWFRS card was flipped on
// one landing page but stayed "Coming soon" on 3 others). Catch it mechanically.
function checkCategoryCards(files, liveKeys) {
  const re = /<a\s+href="[^"]*?(shop\/[a-z0-9-]+\.html)"[^>]*?class="cat\b([^"]*)"[\s\S]{0,220}?class="status"\s*>\s*([^<]*?)\s*<\/span>/gi;
  const out = [];
  for (const f of files) {
    let text; try { text = fs.readFileSync(f, 'utf8'); } catch { continue; }
    const findings = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      const key = m[1], cls = m[2] || '', status = (m[3] || '').trim();
      if (!liveKeys.has(key)) continue;
      if (/coming\s*soon/i.test(status)) {
        findings.push({ sev: 'CRITICAL', id: 'STALE_STATUS_CARD', msg: `category card links to ${key} (LIVE for sale) but still shows "${status}" — flip to "● Live now"/"● Available now" + add the "live" class.` });
      } else if (!/\blive\b/.test(cls)) {
        findings.push({ sev: 'HIGH', id: 'STALE_STATUS_CLASS', msg: `category card links to ${key} (LIVE) with status "${status}" but the anchor lacks the "live" class — styling won't match the other live cards.` });
      }
    }
    if (findings.length) out.push({ file: f, findings });
  }
  return out;
}

function checkPage(file, text, catalog) {
  const findings = [];
  const add = (sev, id, msg) => findings.push({ sev, id, msg });

  const codes = [...text.matchAll(/data-product-code=["']([a-z0-9_]+)["']/gi)].map((m) => m[1]);
  const uniq = [...new Set(codes)];
  if (!uniq.length) return findings;

  // cart wiring must be present
  if (!/shopping-cart\.js/.test(text)) add('CRITICAL', 'CART_JS_MISSING', 'Page has data-product-code buttons but does not include js/shopping-cart.js — cart cannot work.');
  if (!/cart-header\.js/.test(text)) add('CRITICAL', 'CART_HEADER_MISSING', 'Page has data-product-code buttons but does not include js/cart-header.js — buttons never wire to the cart / no header badge.');

  for (const code of uniq) {
    const entry = catalog[code];
    if (!entry) {
      add('CRITICAL', 'CODE_NOT_IN_CATALOG', `data-product-code="${code}" has NO PRODUCT_CATALOG entry — Add-to-Cart silently fails ("Product not found").`);
      continue;
    }
    if (entry.comingSoon) {
      add('CRITICAL', 'CODE_COMING_SOON', `data-product-code="${code}" is flagged comingSoon in PRODUCT_CATALOG — clicking pops "coming soon" and nothing is added. Un-flag it now that it sells.`);
    }
    // price-drift guard: the catalog annual price should appear on the page
    if (entry.annualPrice != null && !text.includes(priceStr(entry.annualPrice))) {
      add('HIGH', 'PRICE_DRIFT', `${code} annualPrice ${priceStr(entry.annualPrice)} (from PRODUCT_CATALOG) is not shown anywhere on the page — the cart may charge a different amount than the card advertises. Verify Stripe + prod DB + catalog + page all agree.`);
    }
  }
  return findings;
}

// The cart persists in localStorage, so the header cart indicator must be on EVERY real
// page (not just shop pages) or a user can't see/reach their cart after navigating away.
// Every page with the site header (#fullMenu) must load js/cart-indicator.js — kept in sync
// by partials/sync_cart_indicator.py. Catch a page that forgot it.
function checkCartIndicatorCoverage(files) {
  const out = [];
  for (const f of files) {
    let text; try { text = fs.readFileSync(f, 'utf8'); } catch { continue; }
    if (!/id="fullMenu"/.test(text)) continue;       // only real pages with the site header
    if (!/cart-indicator\.js/.test(text)) {
      out.push({ file: f, findings: [{ sev: 'HIGH', id: 'MISSING_CART_INDICATOR',
        msg: 'page has the site header but does not load js/cart-indicator.js — the cart count/icon will not appear here. Run: python partials/sync_cart_indicator.py' }] });
    }
  }
  return out;
}

// ---- main -------------------------------------------------------------------
const args = process.argv.slice(2);
const catalog = loadCatalog();
const files = shopHtmlFiles(args);
let critical = 0, high = 0;

console.log(`\nShopping-cart integrity — ${files.length} shop page(s) scanned (catalog: ${Object.keys(catalog).length} products)\n`);

for (const file of files) {
  let text; try { text = fs.readFileSync(file, 'utf8'); } catch { continue; }
  const findings = checkPage(file, text, catalog);
  if (!findings.length) continue;
  console.log(`• ${rel(file)}`);
  for (const f of findings) {
    if (f.sev === 'CRITICAL') critical++; else high++;
    console.log(`    [${f.sev}] ${f.id} — ${f.msg}`);
  }
  console.log('');
}

// Site-wide: category/landing cards must not say "Coming soon" for an already-live shop.
const liveKeys = liveShopKeys(catalog);
const catFiles = args.length ? args.map((a) => path.resolve(ROOT, a)) : allHtmlFiles();
const coverage = checkCartIndicatorCoverage(catFiles);
const catResults = [...checkCategoryCards(catFiles, liveKeys), ...coverage];
for (const { file, findings } of catResults) {
  console.log(`• ${rel(file)}`);
  for (const f of findings) {
    if (f.sev === 'CRITICAL') critical++; else high++;
    console.log(`    [${f.sev}] ${f.id} — ${f.msg}`);
  }
  console.log('');
}

console.log(`Summary: ${critical} CRITICAL, ${high} HIGH  (live shops: ${[...liveKeys].join(', ') || 'none'})`);
process.exit(critical > 0 ? 1 : 0);
