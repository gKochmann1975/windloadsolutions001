/*!
 * WindLoadCalc — Volume-Curve Pricing Engine (SOURCE OF TRUTH)
 * Spec: PRICING_CURVE_SPEC.md (locked 2026-07-18).
 *
 * ONE uniform base per calculator ($35/$59/$149 Starter/Pro/Premium) + a COUNT-based
 * power curve: total(N) = base * N^exponent. Owning N calculators costs curve(N),
 * regardless of WHICH N. Adding one = +marginal; owned calcs are never repriced.
 * "Complete" = own every live calc = top of the curve + BIP free. BIP = +$5 attach-only,
 * free at Complete.
 *
 * Framework-free. Loads as a browser global (window.WLCPricing) or a CommonJS module
 * (Node tests / server mirror). No dependencies — portable across projects: override
 * CONFIG via WLCPricing.configure({...}).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.WLCPricing = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var CONFIG = {
    baseMonthly: 35,        // Starter tier, 1st calculator, per month
    exponent: 0.646,        // power-curve exponent (concave, never caps)
    tiers: { starter: 1.0, pro: 1.69, premium: 4.26 },
    annualMonths: 10,       // annual = pay 10, get 12 (2 months free)
    bipMonthly: 5,          // full-BIP attach-on, flat, not tier-scaled
    bipOfferAtCount: 2,     // surface the BIP offer once the cart/account reaches this many calcs
    // BIP-free is MEMBERSHIP-based (must mirror the backend): BIP is free iff the owned/selected
    // set is a SUPERSET of every live program OR a superset of this original-5 grandfather set.
    // Owning the original 5 keeps BIP free even without the later-added programs (e.g. Open
    // Structures), so a pre-launch "Complete" buyer is never asked to re-buy to keep BIP free.
    bipFreeBaseSet: ["wd", "mwfrs", "roofs", "other", "specialty"],
    // Sellable calculator programs. Order-independent; Other Structures is ONE bundle = one line.
    catalog: [
      { id: "wd",    name: "Windows, Doors & Shutters",     live: true },
      { id: "mwfrs", name: "MWFRS Buildings",               live: true },
      { id: "roofs", name: "Roofs, Parapets & Overhangs",   live: true },
      { id: "other", name: "Other Structures",              live: true },
      { id: "specialty", name: "Specialty Components",      live: true },
      { id: "open_structures", name: "Open Structures",     live: true },
      { id: "solar", name: "Solar Panels",                  live: false }
    ]
    // NOTE (2026-11-23, HELD): open_structures is live program #6 so the site's program
    // count matches the backend. This MUST deploy in lockstep with the backend going to 6 —
    // if the site reaches 6 while the backend is still at 5 (or the reverse), a buyer with
    // all 5 current calcs reads as "Complete" (BIP free) on one side but not the other, so
    // they pay for Complete+BIP and get no BIP. Keep this branch HELD until both ship together.
  };

  function configure(overrides) {
    if (!overrides) return CONFIG;
    for (var k in overrides) if (overrides.hasOwnProperty(k)) CONFIG[k] = overrides[k];
    return CONFIG;
  }
  function config() { return CONFIG; }

  function tierMult(tier) {
    var m = CONFIG.tiers[tier || "starter"];
    return (typeof m === "number") ? m : 1.0;
  }
  function cycleFactor(cycle) { return cycle === "annual" ? CONFIG.annualMonths : 1; }
  function liveCount() {
    return CONFIG.catalog.filter(function (c) { return c.live; }).length;
  }
  function liveIds() {
    return CONFIG.catalog.filter(function (c) { return c.live; }).map(function (c) { return c.id; });
  }
  /** True iff `set` contains every id in `required` (order-independent superset test). */
  function isSuperset(set, required) {
    if (!required || !required.length) return false;
    var have = {};
    for (var i = 0; i < set.length; i++) have[set[i]] = 1;
    for (var j = 0; j < required.length; j++) if (!have[required[j]]) return false;
    return true;
  }
  /**
   * MEMBERSHIP-based BIP-free rule (mirrors the backend). BIP is free iff the owned/selected
   * `set` is a superset of all live programs OR of the original-5 grandfather set. This is the
   * ONLY correct BIP-free test — do NOT substitute a pure count >= liveCount() comparison, which
   * would charge a customer who owns the original 5 (BIP-free on the backend) for BIP on screen.
   */
  function bipIsFree(set) {
    set = uniq(set || []);
    return isSuperset(set, liveIds()) || isSuperset(set, CONFIG.bipFreeBaseSet);
  }

  /**
   * Price to OWN `n` calculators (any n of them), at a tier + billing cycle.
   * Rounded to whole dollars — the number the customer is billed and sees.
   */
  function curveTotal(n, opts) {
    opts = opts || {};
    if (n <= 0) return 0;
    var starterMonthly = CONFIG.baseMonthly * Math.pow(n, CONFIG.exponent);
    return Math.round(starterMonthly * tierMult(opts.tier) * cycleFactor(opts.cycle));
  }

  /** Marginal cost to add the (n+1)-th calculator: curve(n+1) - curve(n). */
  function addNext(n, opts) {
    return curveTotal(n + 1, opts) - curveTotal(n, opts);
  }

  /** Undiscounted "buy separately" price for `n` calcs = n * single-calc price. */
  function separatePrice(n, opts) {
    return curveTotal(1, opts) * n;
  }

  /** BIP attach price at a cycle (flat, not tier-scaled). Free once Complete. */
  function bipPrice(opts) {
    opts = opts || {};
    return CONFIG.bipMonthly * cycleFactor(opts.cycle);
  }

  /** Complete = own every live calc = curve(liveCount) (+ BIP free). Auto-grows with the catalog. */
  function completePrice(opts) { return curveTotal(liveCount(), opts); }

  /**
   * Full state for a picker (account "add calculators" OR cart), given what the user
   * already OWNS and what they've currently SELECTED to add. All money at tier+cycle.
   *
   * @param {Object} q
   * @param {string[]} q.owned     ids the user already subscribes to (not recharged)
   * @param {string[]} q.selected  ids currently chosen to add
   * @param {string}   q.tier      'starter' | 'pro' | 'premium'
   * @param {string}   q.cycle     'monthly' | 'annual'
   * @param {boolean}  q.bipSelected  whether the $5 BIP add-on is toggled on
   */
  function quote(q) {
    q = q || {};
    var opts = { tier: q.tier || "starter", cycle: q.cycle || "monthly" };
    var owned = uniq(q.owned || []);
    var selected = uniq(q.selected || []).filter(function (id) { return owned.indexOf(id) === -1; });

    var ownedN = owned.length;
    var afterN = ownedN + selected.length;   // count once this selection is purchased
    var total = liveCount();

    var currentTotal = curveTotal(ownedN, opts);   // what they pay today
    var newTotal = curveTotal(afterN, opts);        // what they'd pay after adding
    var delta = newTotal - currentTotal;            // cost of THIS add / cart

    // Pricing "Complete" = own every live program = top of the curve (count-based).
    var isComplete = afterN >= total && total > 0;
    // BIP-free is a SEPARATE, membership-based decision (⊇ all live OR ⊇ original 5) so it stays
    // in lockstep with what the backend charges — never gate the BIP price on isComplete alone.
    var afterSet = uniq(owned.concat(selected));
    var bipFree = bipIsFree(afterSet);
    var bipOn = q.bipSelected && !bipFree;
    var bip = bipFree ? 0 : (bipOn ? bipPrice(opts) : 0);

    // The single "Add for +$X" price shown on every not-yet-selected card right now:
    // marginal to go from the current running count to +1. Shrinks as more are selected.
    var addNextPrice = afterN >= total ? 0 : addNext(afterN, opts);

    var sep = separatePrice(afterN, opts);          // strike-through anchor
    var savings = Math.max(0, sep - newTotal);

    return {
      tier: opts.tier, cycle: opts.cycle,
      ownedCount: ownedN,
      selectedCount: selected.length,
      afterCount: afterN,
      catalogLive: total,

      currentTotal: currentTotal,
      newTotal: newTotal,
      delta: delta,                 // what the customer pays now to add this selection
      dueWithBip: delta + bip,

      addNextPrice: addNextPrice,   // the shrinking hero number on each addable card
      separatePrice: sep,
      savings: savings,             // vs buying separately
      savingsPct: sep > 0 ? Math.round((savings / sep) * 100) : 0,

      isComplete: isComplete,
      completePrice: completePrice(opts),
      completeDelta: Math.max(0, completePrice(opts) - currentTotal), // +$ to reach Complete from today
      remainingToComplete: Math.max(0, total - afterN),

      bipEligible: afterN >= CONFIG.bipOfferAtCount && !bipFree,
      bipPrice: bipPrice(opts),
      bipIncludedFree: bipFree,

      // UX flags
      showSaveMore: afterN >= 2 && savings > 0,
      showBipOffer: afterN >= CONFIG.bipOfferAtCount && !bipFree,
      showCompleteNudge: !isComplete && total - afterN <= 2 && total - afterN > 0
    };
  }

  function uniq(a) {
    var out = [], seen = {};
    for (var i = 0; i < a.length; i++) if (!seen[a[i]]) { seen[a[i]] = 1; out.push(a[i]); }
    return out;
  }

  return {
    configure: configure,
    config: config,
    curveTotal: curveTotal,
    addNext: addNext,
    separatePrice: separatePrice,
    bipPrice: bipPrice,
    completePrice: completePrice,
    liveCount: liveCount,
    liveIds: liveIds,
    bipIsFree: bipIsFree,
    quote: quote
  };
});
