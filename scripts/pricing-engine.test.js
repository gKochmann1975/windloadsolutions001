/* Verifies pricing-engine.js against PRICING_CURVE_SPEC.md. Run: node scripts/pricing-engine.test.js */
var P = require("../js/pricing-engine.js");
var fails = 0, passes = 0;
function eq(label, got, want) {
  var ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { passes++; }
  else { fails++; console.log("  FAIL " + label + "\n        got  " + JSON.stringify(got) + "\n        want " + JSON.stringify(want)); }
}

// --- Spec table: Starter monthly curve totals (N=1..7) ---
var totals = [];
for (var n = 1; n <= 7; n++) totals.push(P.curveTotal(n, { tier: "starter", cycle: "monthly" }));
eq("Starter totals 1..7", totals, [35, 55, 71, 86, 99, 111, 123]);

// --- Add-next marginals (Starter) ---
var marg = [];
for (var m = 1; m <= 6; m++) marg.push(P.addNext(m, { tier: "starter", cycle: "monthly" }));
eq("Starter add-next 1..6", marg, [20, 16, 15, 13, 12, 12]);

// --- Complete anchors at 5 calcs (per tier) preserve $99 / $167 / $422 ---
eq("Complete@5 Starter", P.curveTotal(5, { tier: "starter" }), 99);
eq("Complete@5 Pro",     P.curveTotal(5, { tier: "pro" }), 167);
eq("Complete@5 Premium", P.curveTotal(5, { tier: "premium" }), 422);

// --- Live catalog today = 4 (solar not live); Complete today = curve(4) ---
eq("liveCount today", P.liveCount(), 5);
eq("completePrice today (Starter)", P.completePrice({ tier: "starter" }), 99);
eq("completePrice today (Pro)", P.completePrice({ tier: "pro" }), 167);

// --- Annual = pay 10 ---
eq("Annual 1 calc Starter", P.curveTotal(1, { tier: "starter", cycle: "annual" }), 350);
eq("BIP monthly", P.bipPrice({ cycle: "monthly" }), 5);
eq("BIP annual", P.bipPrice({ cycle: "annual" }), 50);

// --- Scenario: NEW user selects 3 calcs (cart) ---
var q1 = P.quote({ owned: [], selected: ["wd", "mwfrs", "roofs"], tier: "starter", cycle: "monthly" });
eq("new/3 afterCount", q1.afterCount, 3);
eq("new/3 newTotal (=delta)", [q1.newTotal, q1.delta], [71, 71]);
eq("new/3 add-next shown", q1.addNextPrice, 15);            // marginal to reach the 4th
eq("new/3 separate anchor", q1.separatePrice, 105);
eq("new/3 savings", [q1.savings, q1.savingsPct], [34, 32]);
eq("new/3 flags", [q1.showSaveMore, q1.showBipOffer, q1.showCompleteNudge], [true, true, true]);

// --- Scenario: EXISTING user owns 2, adds 1 (account) ---
var q2 = P.quote({ owned: ["wd", "mwfrs"], selected: ["roofs"], tier: "starter", cycle: "monthly" });
eq("existing 2+1 currentTotal", q2.currentTotal, 55);
eq("existing 2+1 delta = the add-next", q2.delta, 16);      // 71 - 55
eq("existing 2+1 afterCount", q2.afterCount, 3);

// --- Scenario: reaching Complete (owns all 5 live) -> BIP free, nothing more to add ---
var q3 = P.quote({ owned: ["wd", "mwfrs", "roofs", "other", "specialty"], selected: [], tier: "starter" });
eq("complete isComplete", q3.isComplete, true);
eq("complete BIP free", [q3.bipIncludedFree, q3.showBipOffer], [true, false]);
eq("complete add-next 0", q3.addNextPrice, 0);

// --- Scenario: BIP toggled at 2 calcs ---
var q4 = P.quote({ owned: [], selected: ["wd", "mwfrs"], tier: "starter", bipSelected: true });
eq("bip eligible @2", q4.bipEligible, true);
eq("bip due incl add-on", q4.dueWithBip, q4.delta + 5);

// --- Selecting an already-owned id is ignored (no double charge) ---
var q5 = P.quote({ owned: ["wd"], selected: ["wd", "mwfrs"], tier: "starter" });
eq("dup ignored -> afterCount 2", q5.afterCount, 2);

console.log("\n" + passes + " passed, " + fails + " failed");
process.exit(fails ? 1 : 0);
