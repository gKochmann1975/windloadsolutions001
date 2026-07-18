/* WindLoadCalc — reusable ZIP → ASCE 7-22 design wind speed lookup widget.
 *
 * Drop-in for static marketing/state pages. Reuses the SAME public engine the
 * free calculator uses (GET https://api.windloadcalc.com/api/public/wind-speed),
 * so a visitor gets the design wind speed for ANY US ZIP on the page — interactive,
 * definitive, and not a static republished table.
 *
 * Usage:  <div class="wlc-vlookup" data-state="Virginia" data-zip="23451"></div>
 *         <script src="/js/velocity-lookup.js" defer></script>
 * data-state (optional) tailors copy; data-zip (optional) prefills an example.
 */
(function () {
  'use strict';
  var API = 'https://api.windloadcalc.com';

  var CSS = ''
    + '.wlc-vlookup{--vl-navy:#0d1233;--vl-blue:#0018ff;--vl-green:#10B981;'
    + 'background:linear-gradient(160deg,#0d1233,#141a44);color:#e8ecff;border:1px solid rgba(88,110,255,.28);'
    + 'border-radius:16px;padding:22px 20px;max-width:640px;margin:1.5rem 0;box-shadow:0 18px 50px rgba(6,10,40,.35)}'
    + '.wlc-vlookup .vl-eyebrow{font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#8ea2ff;font-weight:700;margin-bottom:.35rem}'
    + '.wlc-vlookup .vl-title{font-size:1.15rem;font-weight:800;color:#fff;margin:0 0 .9rem;line-height:1.3}'
    + '.wlc-vlookup .vl-row{display:flex;gap:.5rem;flex-wrap:wrap}'
    + '.wlc-vlookup .vl-zip{flex:1 1 150px;min-width:0;padding:12px 14px;border-radius:11px;border:1.6px solid rgba(140,160,255,.35);'
    + 'background:rgba(255,255,255,.06);color:#fff;font-size:1.05rem;font-weight:700;letter-spacing:.04em;outline:none}'
    + '.wlc-vlookup .vl-zip::placeholder{color:#8a97cc;font-weight:600}'
    + '.wlc-vlookup .vl-zip:focus{border-color:#8ea2ff;background:rgba(255,255,255,.1)}'
    + '.wlc-vlookup .vl-risk{flex:0 0 auto;padding:12px 12px;border-radius:11px;border:1.6px solid rgba(140,160,255,.35);'
    + 'background:rgba(255,255,255,.06);color:#fff;font-size:.95rem;font-weight:700;outline:none}'
    + '.wlc-vlookup .vl-btn{flex:0 0 auto;padding:12px 20px;border:none;border-radius:11px;cursor:pointer;font-size:1rem;font-weight:800;'
    + 'color:#fff;background:linear-gradient(135deg,#0018ff,#3b5bff);transition:all .22s ease}'
    + '.wlc-vlookup .vl-btn:hover{transform:translateY(-2px);background:linear-gradient(135deg,#0a8f5b,#34D399);box-shadow:0 12px 30px rgba(16,185,129,.5)}'
    + '.wlc-vlookup .vl-btn:disabled{opacity:.6;cursor:wait;transform:none}'
    + '.wlc-vlookup .vl-hint{font-size:.78rem;color:#9aa7d6;margin-top:.55rem}'
    + '.wlc-vlookup .vl-result{margin-top:1rem;padding:1rem 1.1rem;border-radius:12px;background:rgba(255,255,255,.05);'
    + 'border:1px solid rgba(140,160,255,.22);display:none}'
    + '.wlc-vlookup .vl-result.show{display:block}'
    + '.wlc-vlookup .vl-speed{font-size:2.6rem;font-weight:800;line-height:1;color:#fff}'
    + '.wlc-vlookup .vl-speed .u{font-size:1rem;font-weight:700;color:#9aa7d6;margin-left:.25rem}'
    + '.wlc-vlookup .vl-loc{font-size:.95rem;color:#cdd6ff;margin:.35rem 0 .1rem;font-weight:600}'
    + '.wlc-vlookup .vl-src{font-size:.82rem;color:#9aa7d6;margin-top:.5rem;line-height:1.5}'
    + '.wlc-vlookup .vl-src .tag{display:inline-block;font-weight:800;font-size:.7rem;letter-spacing:.04em;text-transform:uppercase;'
    + 'padding:2px 8px;border-radius:999px;margin-right:.4rem}'
    + '.wlc-vlookup .vl-src .tag.fbc{background:rgba(16,185,129,.18);color:#6ee7b7}'
    + '.wlc-vlookup .vl-src .tag.asce{background:rgba(88,110,255,.2);color:#a9b6ff}'
    + '.wlc-vlookup .vl-err{color:#ffb4b4;font-size:.9rem;font-weight:600}'
    + '.wlc-vlookup .vl-cta{display:inline-block;margin-top:.7rem;color:#6ee7b7;font-weight:700;text-decoration:none;font-size:.9rem}'
    + '.wlc-vlookup .vl-cta:hover{text-decoration:underline}';

  function injectCSS() {
    if (document.getElementById('wlc-vlookup-css')) return;
    var s = document.createElement('style');
    s.id = 'wlc-vlookup-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function init(el) {
    var state = el.getAttribute('data-state') || '';
    var exZip = el.getAttribute('data-zip') || '';
    var where = state ? (' for any ' + esc(state) + ' ZIP') : '';
    el.innerHTML = ''
      + '<div class="vl-eyebrow">ASCE 7-22 · Live wind speed</div>'
      + '<div class="vl-title">Get the design wind speed' + where + '</div>'
      + '<div class="vl-row">'
      + '  <input class="vl-zip" type="text" inputmode="numeric" maxlength="5" placeholder="Enter ZIP" aria-label="ZIP code"' + (exZip ? ' value="' + esc(exZip) + '"' : '') + '>'
      + '  <select class="vl-risk" aria-label="Risk Category">'
      + '    <option value="1">Risk Cat I</option>'
      + '    <option value="2" selected>Risk Cat II</option>'
      + '    <option value="3">Risk Cat III</option>'
      + '    <option value="4">Risk Cat IV</option>'
      + '  </select>'
      + '  <button class="vl-btn" type="button">Get wind speed</button>'
      + '</div>'
      + '<div class="vl-hint">Free · no signup · powered by our ASCE 7-22 velocity engine (Florida HVHZ overrides built in).</div>'
      + '<div class="vl-result" role="status" aria-live="polite"></div>';

    var zip = el.querySelector('.vl-zip');
    var risk = el.querySelector('.vl-risk');
    var btn = el.querySelector('.vl-btn');
    var out = el.querySelector('.vl-result');

    zip.addEventListener('input', function () { zip.value = zip.value.replace(/\D/g, '').slice(0, 5); });
    zip.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    btn.addEventListener('click', go);

    function show(html, isErr) { out.className = 'vl-result show'; out.innerHTML = isErr ? '<div class="vl-err">' + html + '</div>' : html; }

    function go() {
      var z = (zip.value || '').replace(/\D/g, '');
      if (z.length !== 5) { show('Enter a valid 5-digit US ZIP code.', true); return; }
      btn.disabled = true; btn.textContent = 'Looking up…';
      var url = API + '/api/public/wind-speed?zip=' + encodeURIComponent(z) + '&risk_cat=' + encodeURIComponent(risk.value);
      fetch(url).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          var d = res.d || {};
          if (!res.ok || d.success === false || !d.wind_speed_mph) {
            if (d.source === 'asce_geodatabase_required') {
              show('This territory (PR/HI/VI) needs a manual ASCE 7-22 geodatabase determination — not available in the free lookup.', true);
            } else {
              show(esc(d.error || 'No wind speed on file for that ZIP.'), true);
            }
            return;
          }
          var isFbc = d.source === 'fbc_override';
          var tag = isFbc ? '<span class="tag fbc">FBC override</span>' : '<span class="tag asce">ASCE 7-22 map</span>';
          var supersede = (isFbc && d.supersedes_asce_value_mph) ? ' It supersedes the ASCE 7-22 map value of ' + esc(d.supersedes_asce_value_mph) + ' mph for permit submittal.' : '';
          show(''
            + '<div class="vl-speed">' + esc(d.wind_speed_mph) + '<span class="u">mph</span></div>'
            + '<div class="vl-loc">' + esc(d.jurisdiction || [d.city, d.county, d.state].filter(Boolean).join(', ')) + ' · Risk Category ' + esc(d.risk_category) + '</div>'
            + '<div class="vl-src">' + tag + esc(d.source_label || 'ASCE 7-22 basic wind speed') + '.' + supersede + '</div>'
            + '<a class="vl-cta" href="https://windloadcalc.com/free-wind-load-calculator.html?zip=' + encodeURIComponent(z) + '">Now get the design pressure for a component &rarr;</a>');
        })
        .catch(function () { show('Network error — please try again.', true); })
        .finally(function () { btn.disabled = false; btn.textContent = 'Get wind speed'; });
    }
  }

  function boot() {
    var els = document.querySelectorAll('.wlc-vlookup');
    if (!els.length) return;
    injectCSS();
    els.forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
