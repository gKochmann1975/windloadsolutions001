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
const EXCLUDE = /(?:^|[\\/])(?:website|Lib|venv|venv_clean|new_env|\.backups|node_modules|site-packages|\.venv|asce_wind_processor|email)[\\/]/i;
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

console.log(`Summary: ${critical} CRITICAL, ${high} HIGH across ${files.length} shop page(s).`);
process.exit(critical > 0 ? 1 : 0);
