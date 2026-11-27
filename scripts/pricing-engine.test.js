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

// --- Curve anchors at 5 calcs (per tier) preserve $99 / $167 / $422 (count-based, not Complete) ---
eq("curve@5 Starter", P.curveTotal(5, { tier: "starter" }), 99);
eq("curve@5 Pro",     P.curveTotal(5, { tier: "pro" }), 167);
eq("curve@5 Premium", P.curveTotal(5, { tier: "premium" }), 422);

// --- Live catalog = 6 (open_structures live #6, 2026-11-23; solar still not live).
//     Complete = curve(6). MUST stay in lockstep with the backend program count. ---
eq("liveCount today", P.liveCount(), 6);
eq("completePrice today (Starter)", P.completePrice({ tier: "starter" }), 111);
eq("completePrice today (Pro)", P.completePrice({ tier: "pro" }), 188);

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
// showCompleteNudge is now false at 3-of-6 (3 remaining > 2); it only appears within 2 of Complete.
eq("new/3 flags", [q1.showSaveMore, q1.showBipOffer, q1.showCompleteNudge], [true, true, false]);

// --- Scenario: EXISTING user owns 2, adds 1 (account) ---
var q2 = P.quote({ owned: ["wd", "mwfrs"], selected: ["roofs"], tier: "starter", cycle: "monthly" });
eq("existing 2+1 currentTotal", q2.currentTotal, 55);
eq("existing 2+1 delta = the add-next", q2.delta, 16);      // 71 - 55
eq("existing 2+1 afterCount", q2.afterCount, 3);

// --- Scenario: reaching Complete (owns all 6 live) -> BIP free, nothing more to add ---
var q3 = P.quote({ owned: ["wd", "mwfrs", "roofs", "other", "specialty", "open_structures"], selected: [], tier: "starter" });
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

// --- MEMBERSHIP-based BIP-free (mirrors backend): free iff ⊇ all live OR ⊇ original 5 ---
eq("bipIsFree original-5", P.bipIsFree(["wd", "mwfrs", "roofs", "other", "specialty"]), true);
eq("bipIsFree all-6 live", P.bipIsFree(["wd", "mwfrs", "roofs", "other", "specialty", "open_structures"]), true);
eq("bipIsFree 4 of 5 -> no", P.bipIsFree(["wd", "mwfrs", "roofs", "other"]), false);
// 5 calcs but NOT the original set (open_structures swapped in, missing specialty) -> NOT free
eq("bipIsFree 5-but-wrong-set -> no", P.bipIsFree(["wd", "mwfrs", "roofs", "other", "open_structures"]), false);
// Grandfathered: owns exactly the original 5 (not open_structures) -> BIP free though count < live(6)
var qg = P.quote({ owned: ["wd", "mwfrs", "roofs", "other", "specialty"], selected: [], tier: "starter", bipSelected: true });
eq("original-5 owner: BIP free though not pricing-complete", [qg.bipIncludedFree, qg.isComplete], [true, false]);
eq("original-5 owner: BIP not charged", [qg.dueWithBip, qg.bipEligible, qg.showBipOffer], [0, false, false]);
// Adding Open Structures to reach all 6 is still offered (addNext > 0) but BIP already free
eq("original-5 owner: can still add #6", qg.addNextPrice, P.addNext(5, { tier: "starter", cycle: "monthly" }));

console.log("\n" + passes + " passed, " + fails + " failed");
process.exit(fails ? 1 : 0);
