/*
 * Navigation highlight regression test  (added 2026-06-14)
 * ---------------------------------------------------------
 * Locks in the sidebar "selected category" behavior that took many iterations to
 * get right. It pulls the REAL delegated click handler out of
 * webapp/wind_sidebar.py (no transcription) and runs it against a faithful copy
 * of the sidebar DOM, dispatching real click events and asserting the invariant:
 *
 *   Exactly ONE category is ever highlighted, plus (when on a sub-page) its one
 *   subsection and its one leaf. Selecting anything clears the previous chain.
 *
 * Covers every clickable kind: category header, subsection row, leaf link, and
 * the MWFRS direct *link* (the one that broke — it depends on a click event, not
 * Dash's url.pathname callback).
 *
 * RUN:  cd tests/nav && npm install && node nav-highlight.test.js
 * Exit code 0 = pass, 1 = fail.  Run this before changing nav highlighting.
 * See memory: dev_nav_active_selection_architecture.md
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const PY = path.join(__dirname, '..', '..', 'webapp', 'wind_sidebar.py');
const py = fs.readFileSync(PY, 'utf8');

// --- extract the delegated click handler that binds on '#sidebar' clicks ---
const anchor = py.indexOf('if (window.__navClickBound)');
if (anchor < 0) { console.error('FAIL: click handler not found in wind_sidebar.py (was it removed?)'); process.exit(1); }
const fnStart = py.lastIndexOf('function() {', anchor);
const tripleEnd = py.lastIndexOf('"""', py.indexOf("Output('sidebar', 'data-click-bound')"));
const clickSrc = py.slice(fnStart, tripleEnd).trim();

const html = `<!DOCTYPE html><html><body><div id="sidebar">
  <div class="section-header"><div class="section-header-content professional-section-header-content" id="header-cc"><span>C&C</span></div></div>
  <ul id="section-cc">
    <div class="subsection-header professional-subsection-header" id="cc-roofs-header"><span>ROOFS</span></div>
    <ul><li><a class="sidebar-link professional-menu-item" href="/cc/roofs/gable"><span>Gable</span></a></li></ul>
  </ul>
  <div class="section-header direct-nav"><a class="section-header-content direct-nav-link professional-direct-nav-link" href="/mwfrs/calculator"><span>MWFRS</span></a></div>
  <div class="section-header"><div class="section-header-content professional-section-header-content" id="header-codes"><span>CODE</span></div></div>
  <ul id="section-codes">
    <div class="subsection-header professional-subsection-header" id="codes-asce-header"><span>ASCE</span></div>
    <ul><li><a class="sidebar-link professional-menu-item" href="/codes/asce/seven-22"><span>7-22</span></a></li></ul>
  </ul>
</div></body></html>`;

const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
const win = dom.window, doc = win.document;
// mirror clearAllHighlights (defined in wind_sidebar.py ~line 479)
win.eval(`window.clearAllHighlights = function() {
  document.querySelectorAll('.section-header-content, .professional-section-header-content').forEach(h => h.classList.remove('active-section','professional-active-section'));
  document.querySelectorAll('.direct-nav-link, .professional-direct-nav-link').forEach(h => h.classList.remove('active-section','professional-active-section'));
  document.querySelectorAll('.subsection-header, .professional-subsection-header').forEach(h => h.classList.remove('active-subsection','professional-active-subsection'));
  document.querySelectorAll('.sidebar-link, .professional-menu-item').forEach(l => l.classList.remove('active','professional-active'));
};`);
win.eval('(' + clickSrc + ')()'); // bind the real handler

const tag = el => el.id ? '#'+el.id : (el.getAttribute('href')||el.className);
const cats = () => [...doc.querySelectorAll('.active-section')].map(tag);
const subs = () => [...doc.querySelectorAll('.active-subsection')].map(tag);
const click = sel => { const el = doc.querySelector(sel); (el.querySelector('span')||el).dispatchEvent(new win.MouseEvent('click',{bubbles:true,cancelable:true})); };

let fail = 0;
function expect(label, sel, wantCat, wantSub) {
  click(sel);
  const c = cats(), s = subs();
  const ok = c.length===1 && c[0]===wantCat && (wantSub===null ? s.length===0 : (s.length===1 && s[0]===wantSub));
  if (!ok) fail++;
  console.log(`${ok?'PASS':'FAIL'}  ${label}  ->  category=[${c.join(',')}] subsection=[${s.join(',')}]`);
}

console.log('Sidebar highlight invariant — exactly one category chain at a time:\n');
expect('click C&C header',                       '#header-cc',                    '#header-cc',    null);
expect('click MWFRS link (the one that broke)',  'a.direct-nav-link',             '/mwfrs/calculator', null);
expect('click CODE header',                      '#header-codes',                 '#header-codes', null);
expect('click C&C > ROOFS subsection',           '#cc-roofs-header',              '#header-cc',    '#cc-roofs-header');
expect('click CODE > ASCE (diff category)',      '#codes-asce-header',            '#header-codes', '#codes-asce-header');
expect('click C&C > Gable leaf (diff category)', 'a[href="/cc/roofs/gable"]',     '#header-cc',    '#cc-roofs-header');
expect('click CODE > 7-22 leaf (diff category)', 'a[href="/codes/asce/seven-22"]','#header-codes', '#codes-asce-header');
expect('click MWFRS again',                      'a.direct-nav-link',             '/mwfrs/calculator', null);

console.log('\n' + (fail ? `*** ${fail} FAILED — nav highlighting regressed ***` : 'ALL PASS — nav highlighting locked in'));
process.exit(fail ? 1 : 0);
