/**
 * cart-indicator.js — site-wide cart icon + count, on EVERY page.
 *
 * The cart lives in localStorage (windloadcalc_cart), so it persists across the
 * whole site. This injects a single SVG shopping-cart link + red count badge into
 * the header (into .nav-right, before the hamburger, so it shows on desktop AND
 * mobile), links to /cart.html, and shows only when the cart has items. It is
 * self-contained — it does NOT depend on shopping-cart.js — and is loaded on every
 * page via partials/full-menu.html (synced by sync_nav.py). shopping-cart.js
 * dispatches `wlc-cart-updated` so this refreshes instantly after an add/remove.
 */
(function (w, d) {
  var CART_KEY = 'windloadcalc_cart';

  function count() {
    try { return (JSON.parse(w.localStorage.getItem(CART_KEY) || '[]') || []).length; }
    catch (e) { return 0; }
  }

  // Feather "shopping-cart" — inline SVG, inherits currentColor (no FontAwesome dependency).
  var SVG =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>' +
    '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';

  function ensureLink() {
    var link = d.getElementById('wlc-cart-indicator');
    if (link) return link;
    // .nav-right stays visible on mobile (unlike .nav-links); fall back for other headers.
    var host = d.querySelector('.nav-right') ||
               d.querySelector('.nav-links, .header-right, .header-actions, .main-nav');
    if (!host) return null;
    link = d.createElement('a');
    link.id = 'wlc-cart-indicator';
    link.href = 'https://windloadcalc.com/cart.html';
    link.setAttribute('aria-label', 'View cart');
    link.title = 'View cart';
    link.style.cssText = 'position:relative;display:none;align-items:center;color:inherit;' +
      'text-decoration:none;padding:6px 8px;line-height:0';
    link.innerHTML = SVG +
      '<span id="wlc-cart-count" style="position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;' +
      'padding:0 4px;background:#dc2626;color:#fff;border-radius:9px;display:none;align-items:center;' +
      'justify-content:center;font:800 11px/1 system-ui,Segoe UI,sans-serif;box-shadow:0 1px 4px rgba(0,0,0,.4)">0</span>';
    var ham = host.querySelector('.hamburger');
    if (ham && ham.parentNode === host) host.insertBefore(link, ham);
    else host.appendChild(link);
    return link;
  }

  function refresh() {
    var link = ensureLink();
    if (!link) return;
    var n = count();
    var badge = link.querySelector('#wlc-cart-count');
    if (n > 0) {
      link.style.display = 'inline-flex';
      if (badge) { badge.textContent = n; badge.style.display = 'inline-flex'; }
    } else {
      link.style.display = 'none';
      if (badge) badge.style.display = 'none';
    }
  }

  w.WLCCartIndicator = { refresh: refresh };

  function boot() { refresh(); }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
  w.addEventListener('wlc-cart-updated', refresh);                     // same-tab add/remove
  w.addEventListener('storage', function (e) { if (!e || e.key === CART_KEY) refresh(); }); // other tabs
  w.addEventListener('pageshow', refresh);                            // bfcache restores
})(window, document);
