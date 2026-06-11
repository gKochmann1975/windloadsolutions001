#!/usr/bin/env node
/**
 * check-mobile.js — Mobile-first anti-pattern linter for windloadcalc.com
 *
 * WHY THIS EXISTS
 * ---------------
 * The site's marketing pages were repeatedly broken on phones by the SAME small
 * set of copy-pasted CSS/JS anti-patterns. This script encodes each one so the
 * bug class is caught mechanically and never silently reappears.
 *
 * Run it after fixing ANY page, and before committing a batch of page fixes:
 *     node scripts/check-mobile.js                # scan all live pages
 *     node scripts/check-mobile.js index.html     # scan specific file(s)
 *
 * Exit code: 0 = clean, 1 = at least one CRITICAL finding. (Wire into a
 * pre-commit hook later if desired.)
 *
 * The "live" page set = git-tracked *.html at the repo root + subdir index pages,
 * excluding the untracked website/ mirror, python venvs, and vendored packages.
 *
 * Each rule below documents the bug it prevents. When you discover a NEW mobile
 * failure mode, add a rule here in the same commit as the fix — that is the
 * "process" half of "have a command + follow the right process".
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE = /(?:^|[\\/])(?:website|Lib|venv|venv_clean|new_env|\.backups|node_modules|site-packages|\.venv|asce_wind_processor)[\\/]/i;

// ---- Rules ------------------------------------------------------------------
// Each rule: a single-pass regex over the full file text. Heuristic by design —
// false positives are cheaper than a broken homepage. `severity: 'CRITICAL'`
// fails the build; 'HIGH' warns.

// Media-query context of a match: the condition string of the nearest preceding
// @media, lowercased ('' = top-level). Lets rules fire only where they matter
// (portrait mobile) instead of on legitimate desktop/landscape rules.
function nearestMedia(text, index) {
  const at = text.lastIndexOf('@media', index);
  if (at === -1) return '';
  const brace = text.indexOf('{', at);
  if (brace === -1 || brace > index) return '';
  return text.slice(at + 6, brace).trim().toLowerCase();
}
const isPortraitMobile = (q) => /max-width/.test(q) && !/landscape/.test(q);
const isSmallWidth = (q) => {
  const m = q.match(/max-width\s*:\s*(\d+)/);
  return !!m && Number(m[1]) <= 768 && !/landscape/.test(q);
};

const RULES = [
  {
    id: 'HIDDEN_HERO_HEADING',
    severity: 'CRITICAL',
    why: 'Hero <h1>/subtitle set to display:none on mobile — invisible headline (bad UX + the indexable H1 is hidden from Google).',
    fix: 'Show the heading on mobile with clamp() sizing instead of hiding it.',
    re: /\.hero-(?:title|subtitle)\s*\{[^}]*?display\s*:\s*none[^}]*?\}/gi,
    accept: (q) => q === '' || isPortraitMobile(q), // skip landscape-only hides
  },
  {
    id: 'OVERSIZED_NOWRAP_CTA',
    severity: 'CRITICAL',
    why: 'Hero CTA uses white-space:nowrap so a long label ("Explore Intelligence Platform") cannot wrap and runs off the right edge of the phone.',
    fix: 'Use white-space:normal, proportional font (~1.05rem), width:100% max ~340px so buttons wrap and stay on-screen.',
    re: /\.hero-(?:btn|action-btn|buttons-mobile)[^{]*\{[^}]*?white-space\s*:\s*nowrap[^}]*?\}/gi,
    accept: isPortraitMobile,
  },
  {
    id: 'GIANT_CTA_FONT',
    severity: 'CRITICAL',
    why: 'Hero CTA font-size >= 1.4rem on mobile produces oversized, unproportional buttons.',
    fix: 'Drop mobile CTA font-size to ~1.05rem.',
    re: /\.hero-(?:btn|action-btn|buttons-mobile)[^{]*\{[^}]*?font-size\s*:\s*(?:1\.[4-9]\d*|[2-9](?:\.\d+)?)rem[^}]*?\}/gi,
    accept: isPortraitMobile,
  },
  {
    id: 'HEADER_STACK_OVERLAP',
    severity: 'CRITICAL',
    why: 'Mobile .header-container stacked into a column makes the fixed header taller than the hero top-padding, so hero content overlaps the header.',
    fix: 'Keep .header-container as a single row (flex-direction:row / justify-content:space-between) on mobile.',
    re: /\.header-container\s*\{[^}]*?flex-direction\s*:\s*column[^}]*?\}/gi,
    accept: isPortraitMobile,
  },
  {
    id: 'FRAGILE_SCALE_WRAPPER',
    severity: 'HIGH',
    why: 'Scaling a fixed-size hero box with transform:scale() per breakpoint is fragile and overflows/jumps on real mobile devices.',
    fix: 'On mobile reset the wrapper to width:100%; height:auto; transform:none and let content flow.',
    re: /\.hero-scale-wrapper\s*\{[^}]*?transform\s*:\s*scale\([^}]*?\}/gi,
    accept: isSmallWidth, // only flag scaling in mobile breakpoints, not desktop
  },
  {
    id: 'PARALLAX_NO_MOBILE_GUARD',
    severity: 'HIGH',
    why: 'A scroll parallax that sets heroContent.style.transform = translateY(...) without a mobile guard shoves the short mobile hero down over the next section (and fades it).',
    fix: 'Guard the scroll handler with `if (window.innerWidth <= 768) { clear styles; return; }`.',
    test: (text) => {
      const idx = text.indexOf('heroContent.style.transform');
      if (idx === -1) return null;                       // no parallax at all
      if (!/translateY/.test(text.slice(idx, idx + 120))) return null;
      // Look for an innerWidth guard within the handler preceding the assignment.
      const before = text.slice(Math.max(0, idx - 400), idx);
      if (/innerWidth\s*<=?\s*\d+/.test(before)) return null; // guarded — OK
      return idx;                                        // unguarded — flag
    },
  },
];

// ---- File discovery ---------------------------------------------------------

function liveHtmlFiles(args) {
  if (args.length) return args.map((a) => path.resolve(ROOT, a));
  let tracked = '';
  try {
    tracked = execSync('git ls-files "*.html"', { cwd: ROOT, encoding: 'utf8' });
  } catch (e) {
    console.error('Could not run git ls-files:', e.message);
    process.exit(2);
  }
  return tracked
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((f) => !EXCLUDE.test(f))
    .map((f) => path.resolve(ROOT, f));
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

// ---- Scan -------------------------------------------------------------------

const files = liveHtmlFiles(process.argv.slice(2));
let critical = 0;
let high = 0;
const byFile = new Map();

for (const file of files) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  const findings = [];
  for (const rule of RULES) {
    if (rule.test) {
      const idx = rule.test(text);
      if (idx != null) findings.push({ rule, line: lineOf(text, idx) });
    } else {
      let m;
      rule.re.lastIndex = 0;
      while ((m = rule.re.exec(text)) !== null) {
        if (rule.accept && !rule.accept(nearestMedia(text, m.index))) continue;
        findings.push({ rule, line: lineOf(text, m.index) });
      }
    }
  }
  if (findings.length) byFile.set(file, findings);
}

// ---- Report -----------------------------------------------------------------

const rel = (f) => path.relative(ROOT, f).replace(/\\/g, '/');

if (byFile.size === 0) {
  console.log(`✅ Mobile check passed — ${files.length} page(s) scanned, no anti-patterns found.`);
  process.exit(0);
}

console.log(`\nMobile anti-pattern report (${byFile.size} of ${files.length} page(s) flagged)\n`);
for (const [file, findings] of byFile) {
  console.log(`✖ ${rel(file)}`);
  for (const f of findings) {
    const tag = f.rule.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH';
    if (f.rule.severity === 'CRITICAL') critical++; else high++;
    console.log(`    [${tag}] ${f.rule.id}  (line ${f.line})`);
    console.log(`        why: ${f.rule.why}`);
    console.log(`        fix: ${f.rule.fix}`);
  }
  console.log('');
}

console.log(`Summary: ${critical} CRITICAL, ${high} HIGH across ${byFile.size} page(s).`);
process.exit(critical > 0 ? 1 : 0);
