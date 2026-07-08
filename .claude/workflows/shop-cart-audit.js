export const meta = {
  name: 'shop-cart-audit',
  description: 'Audit every shop page: static cart-catalog lint + a headless Add-to-Cart click test per page (badge, green confirm, checkout link, price), then synthesize a pass/fail report',
  whenToUse: 'After changing any shop page, cart JS, pricing, or when a product goes live — proves Add-to-Cart works on every shop card, not just the one you touched.',
  phases: [
    { title: 'Discover', detail: 'lint catalog + enumerate shop pages and their product codes' },
    { title: 'Verify', detail: 'one agent per shop page — headless click every tier' },
    { title: 'Report', detail: 'synthesize a pass/fail table + root-cause fixes' },
  ],
}

const PAGES_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['staticSummary', 'pages'],
  properties: {
    staticSummary: { type: 'string', description: 'the Summary line from check-cart.js + any CRITICAL/HIGH lines' },
    pages: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['url', 'codes'],
        properties: {
          url: { type: 'string', description: 'full https://windloadcalc.com/... URL of the shop page' },
          codes: { type: 'array', items: { type: 'string' }, description: 'every data-product-code on the page' },
        },
      },
    },
  },
}

const VERIFY_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['url', 'pass', 'rows'],
  properties: {
    url: { type: 'string' },
    pass: { type: 'boolean', description: 'true only if EVERY tier added cleanly with badge+green+jump and no dialog' },
    rows: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['code', 'badgeCount', 'green', 'jumpLink', 'inCart', 'dialog'],
        properties: {
          code: { type: 'string' },
          badgeCount: { type: 'string', description: 'header badge text after clicking this tier' },
          green: { type: 'boolean', description: 'button has .in-cart / green confirm state' },
          jumpLink: { type: 'boolean', description: 'a .cart-jump "Go to checkout" link appeared' },
          inCart: { type: 'boolean', description: 'localStorage.windloadcalc_cart contains this code' },
          dialog: { type: 'string', description: 'any alert/dialog text that fired ("" if none; a "coming soon" here = BUG)' },
        },
      },
    },
    notes: { type: 'string' },
  },
}

phase('Discover')
const disc = await agent(
  `Enumerate the windloadcalc.com shop pages and lint the cart catalog. From the repo root:\n` +
  `1. Run: cd website && node scripts/check-cart.js  — capture the Summary line and any CRITICAL/HIGH findings.\n` +
  `2. List every git-tracked *.html under website/ that contains \`data-product-code\`, and for each collect the full set of data-product-code values.\n` +
  `Return the static summary and, for each shop page, its live URL (https://windloadcalc.com/<relative path from website/>) and its product codes.`,
  { label: 'discover', schema: PAGES_SCHEMA, effort: 'low' }
)

log(`Static lint: ${disc.staticSummary}`)
log(`Shop pages: ${disc.pages.map(p => p.url.split('/').pop()).join(', ')}`)

phase('Verify')
const results = await parallel(disc.pages.map(pg => () => agent(
  `Headless-verify Add-to-Cart on ${pg.url} (product codes: ${pg.codes.join(', ')}). VERIFY WITH DATA — never eyeball.\n` +
  `Write and run a puppeteer-core script (Chrome at C:/Program Files/Google/Chrome/Application/chrome.exe; puppeteer-core is in the session scratchpad node_modules, run node from there). The script must:\n` +
  `  - launch headless, open a page, register a dialog handler that RECORDS + dismisses any alert;\n` +
  `  - goto the URL (waitUntil networkidle2), then evaluate localStorage.removeItem('windloadcalc_cart') and reload;\n` +
  `  - for EACH product code in order: click [data-product-code="<code>"], wait ~500ms, then read: header badge (#header-cart-badge) computed display + text; the clicked button's textContent + whether it has class 'in-cart'; whether a .cart-jump link exists; and JSON.parse(localStorage.windloadcalc_cart) length + codes.\n` +
  `Report per code: badgeCount (badge text), green (in-cart), jumpLink (present), inCart (code in localStorage), dialog (any alert text — a "coming soon" alert means the catalog is stale = FAIL). pass = every code added cleanly (badge increments, green, jumpLink, inCart, no dialog).`,
  { label: `verify:${pg.url.split('/').pop()}`, phase: 'Verify', schema: VERIFY_SCHEMA }
)))

phase('Report')
const clean = results.filter(Boolean)
const failed = clean.filter(r => !r.pass)
const report = await agent(
  `Synthesize a shop-cart audit report from this JSON. Give a pass/fail table (page → each tier: badge/green/jump/inCart/dialog), then for every FAIL state the ROOT cause (almost always: js/shopping-cart.js PRODUCT_CATALOG missing the code, flagged comingSoon, or a price that drifts from the page/Stripe/DB) and the exact one-line fix. End with an overall PASS/FAIL.\n\n` +
  `Static lint: ${disc.staticSummary}\nResults: ${JSON.stringify(clean)}`,
  { label: 'report', effort: 'medium' }
)

return { staticSummary: disc.staticSummary, pagesAudited: clean.length, failing: failed.map(f => f.url), report }
