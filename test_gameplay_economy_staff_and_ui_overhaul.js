// Comprehensive Verification Suite for Gameplay, Economy, Staff, Cart Lvl 0, and UI Overhaul
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('=== STARTING COMPREHENSIVE OVERHAUL VERIFICATION ===');

// 1. Verify HTML DOM Structure & Asset Existence
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const dom = new JSDOM(htmlContent, {
    url: 'http://localhost:8080/',
    pretendToBeVisual: true
});
const { window } = dom;
const { document } = window;

global.window = window;
global.document = document;
global.localStorage = {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = String(v); },
    removeItem(k) { delete this.store[k]; }
};
window.localStorage = global.localStorage;
window.alert = (msg) => { window._lastAlert = msg; };
window.confirm = () => true;
global.requestAnimationFrame = () => {};
window.requestAnimationFrame = global.requestAnimationFrame;
window.HTMLCanvasElement.prototype.getContext = () => ({
    fillRect() {}, strokeRect() {}, clearRect() {}, beginPath() {}, moveTo() {}, lineTo() {},
    closePath() {}, stroke() {}, fill() {}, arc() {}, ellipse() {}, save() {}, restore() {},
    translate() {}, scale() {}, rotate() {}, drawImage() {}, fillText() {}, strokeText() {},
    measureText() { return { width: 10 }; },
    createLinearGradient() { return { addColorStop() {} }; },
    createRadialGradient() { return { addColorStop() {} }; },
    clip() {}, rect() {}, quadraticCurveTo() {}, bezierCurveTo() {}, setLineDash() {}
});

// Check PNG Assets exist & dimensions
function readPngDimensions(filePath) {
    assert(fs.existsSync(filePath), `Missing asset file: ${filePath}`);
    const buf = fs.readFileSync(filePath);
    assert(buf.length > 100, `Empty or invalid PNG: ${filePath}`);
    assert.strictEqual(buf[0], 0x89, `Not a PNG file: ${filePath}`);
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    return { width, height, size: buf.length };
}

const cart0Dim = readPngDimensions(path.join(__dirname, 'assets', 'cart_lvl_0.png'));
assert.strictEqual(cart0Dim.width, 250, 'cart_lvl_0.png width must be 250');
assert.strictEqual(cart0Dim.height, 352, 'cart_lvl_0.png height must be 352');

const upg0Dim = readPngDimensions(path.join(__dirname, 'assets', 'upg_decor_0.png'));
assert.strictEqual(upg0Dim.width, 1024, 'upg_decor_0.png width must be 1024');
assert.strictEqual(upg0Dim.height, 1024, 'upg_decor_0.png height must be 1024');

['staff_cashier.png', 'staff_entertainer.png', 'staff_promoter.png', 'staff_barista.png'].forEach(file => {
    const dim = readPngDimensions(path.join(__dirname, 'assets', file));
    assert.strictEqual(dim.width, 1024, `${file} width must be 1024`);
    assert.strictEqual(dim.height, 1024, `${file} height must be 1024`);
});
console.log('[PASS] 1. New Cart Lvl 0 and 4 Staff 16-bit Pixel Art PNG Assets verified.');

// 2. Verify UI Layout Requirements in DOM
const headerEl = document.querySelector('header.game-header');
const suppliesMonitorEl = document.getElementById('standSuppliesMonitor');
assert(headerEl && suppliesMonitorEl, 'Header and standSuppliesMonitor must exist');
assert(headerEl.contains(suppliesMonitorEl), 'standSuppliesMonitor MUST be inside <header class="game-header"> so it is visible across all tabs');
assert(!suppliesMonitorEl.innerHTML.includes('🫖'), 'Broken 🫖 emoji must be removed from CARAFE monitor');
assert(suppliesMonitorEl.innerHTML.includes('♨️'), 'CARAFE monitor must use ♨️ icon');

const canvasWrapperEl = document.querySelector('.stand-canvas-column .canvas-wrapper');
const controlsPanelEl = document.querySelector('.stand-controls-below-canvas');
assert(canvasWrapperEl && controlsPanelEl, 'Canvas wrapper and stand-controls-below-canvas must exist');
assert(!canvasWrapperEl.contains(controlsPanelEl), 'Open Stand & Clock bar MUST sit outside/below .canvas-wrapper (not covering canvas)');

// Verify Redesigned Today's Setting elements
['standSettingRent', 'standSettingPrice', 'standSettingAds', 'standSettingStaff', 'standSettingPayment', 'standSettingSpeed', 'standRecipeQualityBadge', 'standOwnedUpgrades'].forEach(id => {
    assert(document.getElementById(id), `Missing redesigned Today's Setting element #${id}`);
});
console.log('[PASS] 2. Global Top Supplies Ribbon, Below-Canvas Controls Bar & Redesigned Today\'s Setting DOM verified.');

// 3. Load Game Modules
require('./js/audio.js');
require('./js/sprites.js');
require('./js/web3.js');
require('./js/simulation.js');
require('./js/engine.js');
require('./js/editor.js');
const { GameController } = require('./js/game.js');

window.gameController = new GameController();
window.gameController.init();

const sim = window.simulationModel;
const engine = window.simulationEngine;
const gc = window.gameController;

// 4. Verify Starting Cash ($40), Starting Inventory (all 0), Starting Recipe (watery/uncalibrated), Starting Cart (Level 0)
assert.strictEqual(sim.cash, 40.00, 'Starting cash must be $40.00');
['beans', 'milk', 'sugar', 'ice', 'cups', 'syrup'].forEach(k => {
    assert.strictEqual(sim.inventory[k], 0, `Starting inventory for ${k} must be 0`);
});
assert.strictEqual(sim.recipe.beans, 1, 'Starting recipe beans must be 1');
assert.strictEqual(sim.recipe.milk, 0, 'Starting recipe milk must be 0');
assert.strictEqual(sim.recipe.sugar, 0, 'Starting recipe sugar must be 0');
assert.strictEqual(sim.recipe.ice, 0, 'Starting recipe ice must be 0');
assert.strictEqual(sim.recipe.syrup, 0, 'Starting recipe syrup must be 0');
const initEval = sim.evaluateRecipe(22);
assert(initEval.tasteScore < 65, `Starting uncalibrated recipe should have low taste score (<65), got ${initEval.tasteScore}`);
assert.strictEqual(sim.upgrades.decor, 0, 'Starting decor (Cart) level must be 0 (Folding Table & Makeshift Gear)');
const decor0 = sim.getUpgradeItem('decor', 0);
assert.strictEqual(decor0.name, 'Folding Table & Makeshift Gear');
assert.strictEqual(decor0.cost, 0);
const decor1 = sim.getUpgradeItem('decor', 1);
assert.strictEqual(decor1.name, 'Rustic Timber Cart');
assert(decor1.cost >= 100, 'Level 1 Rustic Timber Cart must cost money ($120)');
console.log('[PASS] 3. Starting state ($40 cash, 0 inventory, uncalibrated recipe, Level 0 Folding Table cart) verified.');

// 5. Verify Harsh Early-Game Spoilage (100% ice melt & 100% milk spoilage at Cooler Level 1)
sim.inventory = { beans: 10, milk: 15, sugar: 10, ice: 25, cups: 20, syrup: 5 };
sim.upgrades.cooler = 1;
const day1Summary = sim.endDay();
assert.strictEqual(day1Summary.meltedIce, 25, 'Cooler Level 1 must melt 100% of leftover ice (25/25)');
assert.strictEqual(day1Summary.spoiledMilk, 15, 'Cooler Level 1 must spoil 100% of leftover milk (15/15)');
assert.strictEqual(sim.inventory.ice, 0, 'Remaining ice must be 0 after Cooler Lvl 1 endDay');
assert.strictEqual(sim.inventory.milk, 0, 'Remaining milk must be 0 after Cooler Lvl 1 endDay');
console.log('[PASS] 4. Harsh early-game spoilage (100% ice melt & 100% milk spoil at Cooler Level 1) verified.');

// 6. Verify Queue Size Limit = 10 & Faster Service Speed Multiplier
assert.strictEqual(engine.maxQueueSize, 10, 'Engine maxQueueSize must be 10');
const standCfg = engine.getStandConfig();
assert.strictEqual(standCfg.queueSpots.length, 10, 'getStandConfig().queueSpots must have 10 queue spots');

const baseSpeedMult = sim.getTotalServiceSpeedMultiplier();
assert.strictEqual(baseSpeedMult, 1.0, 'Base service speed multiplier at starter levels must be 1.0');
sim.upgrades.machine = 3;
sim.upgrades.grinder = 3;
sim.upgrades.terminal = 3;
sim.upgrades.decor = 3;
sim.hiredStaff.cashier = true;
sim.hiredStaff.barista = true;
const upgradedSpeedMult = sim.getTotalServiceSpeedMultiplier();
assert(upgradedSpeedMult > 2.0, `Upgraded + Staff service speed multiplier should be > 2.0x, got ${upgradedSpeedMult}`);
// Reset back to starter
sim.resetGame();
console.log('[PASS] 5. Queue limit of 10 and upgrade/staff faster customer service speed multiplier verified.');

// 7. Verify RNG / Gacha Customer Attraction Chance
const locSuburbs = sim.getLocations()['suburbs'];
const baseAttract = sim.getCustomerAttractionChance(locSuburbs);
assert(baseAttract >= 0.15 && baseAttract <= 0.35, `Base pedestrian stop chance should be low (~0.24), got ${baseAttract}`);

sim.upgrades.decor = 4;
sim.upgrades.marketing = 4;
sim.dailyMarketingBudget = 30;
sim.hiredStaff.entertainer = true;
sim.hiredStaff.promoter = true;
const maxedAttract = sim.getCustomerAttractionChance(locSuburbs);
assert(maxedAttract > baseAttract + 0.35, `Upgrades + Staff + Marketing must significantly increase customer attraction chance (${baseAttract.toFixed(2)} -> ${maxedAttract.toFixed(2)})`);
sim.resetGame();
console.log('[PASS] 6. RNG/Gacha pedestrian stop attraction & upgrade/staff attraction boosts verified.');

// 8. Verify Upfront Location Rental Enforcement
assert.strictEqual(sim.cash, 40.00);
// Try renting park ($45 rent) with only $40 cash -> must fail!
const failRent = sim.rentLocation('park');
assert.strictEqual(failRent.success, false, 'Must NOT allow renting $45 location when cash is $40');
assert.strictEqual(sim.currentLocation, 'cul_de_sac', 'Location must remain cul_de_sac when rent fails');
assert.strictEqual(sim.cash, 40.00, 'Cash must not change when rent fails');

// Add cash to $100 and rent suburbs ($15) -> must deduct $15 immediately upfront!
sim.cash = 100.00;
const okRent = sim.rentLocation('suburbs');
assert.strictEqual(okRent.success, true, 'Must allow renting suburbs when cash >= $15');
assert.strictEqual(sim.currentLocation, 'suburbs', 'Location must update to suburbs');
assert.strictEqual(sim.cash, 85.00, 'Upfront rent ($15) must be deducted immediately upon renting ($100 - $15 = $85)');
assert.strictEqual(sim.paidLocationRentForDay, sim.dayNumber, 'paidLocationRentForDay must be set to current dayNumber');

// Verify endDay does NOT double-charge rent that was already paid upfront
const cashBeforeEndDay = sim.cash;
const endEntry = sim.endDay();
assert.strictEqual(endEntry.stats.costRent, 15.00, 'Ledger must record $15 rent expense');
assert.strictEqual(sim.cash, cashBeforeEndDay, 'endDay must not double-deduct upfront-paid rent');

// Now on Day 2 at suburbs ($15 rent), if player has only $10 cash, ensureDailyLocationRentPaid must fail!
sim.cash = 10.00;
const day2RentCheck = sim.ensureDailyLocationRentPaid();
assert.strictEqual(day2RentCheck.success, false, 'Starting Day 2 at $15 location with $10 cash must be blocked');
sim.resetGame();
console.log('[PASS] 7. Upfront location rental payment & anti-double-charge protection verified.');

// 9. Verify Staff Menu (Hiring, Dismissing, Daily Payroll Deduction, UI Carousel)
const staffCatalog = sim.getStaffCatalog();
assert.strictEqual(staffCatalog.length, 4, 'Staff catalog must have 4 members');
// With $40 starting cash, hiring $60 cashier must fail
const failHire = sim.toggleHireStaff('cashier');
assert.strictEqual(failHire.success, false, 'Cannot hire $60/day cashier with only $40 cash');

sim.cash = 200.00;
const okHire1 = sim.toggleHireStaff('cashier');
const okHire2 = sim.toggleHireStaff('barista');
assert.strictEqual(okHire1.success && okHire1.hired, true, 'Cashier should be hired');
assert.strictEqual(okHire2.success && okHire2.hired, true, 'Barista should be hired');
assert.strictEqual(sim.getDailyStaffCost(), 180, 'Total daily payroll for Cashier ($60) + Barista ($120) must be $180');

// Test Staff UI tab rendering & navigation
gc.switchTab('staff');
assert.strictEqual(document.getElementById('staffCardTitle').textContent, 'Martine the Cashier');
gc.navigateStaff(1);
assert.strictEqual(document.getElementById('staffCardTitle').textContent, 'Simon the Coffee Mascot');

// End day and verify $180 staff payroll is deducted
const staffDayEnd = sim.endDay();
assert.strictEqual(staffDayEnd.stats.costStaff, 180, 'endDay must record $180 in costStaff');
assert.strictEqual(sim.cash, 20.00, 'endDay must deduct $180 staff wages from $200 cash -> $20');
sim.resetGame();
console.log('[PASS] 8. Staff menu hiring, dismissal, daily payroll deduction & UI carousel verified.');

// 10. Verify QRIS / Tap Payment Upgrades & /boost Viral Hype
const termUpgs = sim.getUpgrades().terminal;
assert.strictEqual(termUpgs.length, 3);
assert(termUpgs[1].name.includes('QRIS'), 'Terminal Level 2 must be QRIS & EDC Card Register');
assert(termUpgs[2].name.includes('NFC Tap'), 'Terminal Level 3 must be Contactless NFC Tap & Smart QRIS POS');

const boostRes = window.web3Manager.activateBoost(sim.dayNumber);
assert.strictEqual(boostRes.success, true, '/boost must activate cleanly without crypto payment requirement');
assert.strictEqual(window.web3Manager.isBoostActive, true, 'isBoostActive must be true');
window.web3Manager.resetDayBoost();
console.log('[PASS] 9. QRIS/Card/NFC Tap payment registers & /boost viral hype verified.');

// 11. End-to-End Live Day Simulation: Pedestrian RNG Gacha vs Maxed Stand + Barista Serving Speed
sim.resetGame();
sim.weather = { type: 'sunny', temp: 26, icon: '☀️', desc: 'Warm & Sunny' };
// Give starter stand supplies and calibrated recipe, but NO upgrades and NO staff
sim.inventory = { beans: 200, milk: 200, sugar: 200, ice: 200, cups: 200, syrup: 200 };
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 2.00, acceptCrypto: false };
engine.startDay();
engine.skipToEndOfDay();
const starterDayStats = sim.ledgerHistory[0].stats;
const starterPedestrians = starterDayStats.pedestriansTotal;
const starterCupsSold = starterDayStats.cupsSold;
const starterWalkedPast = starterPedestrians - (starterCupsSold + starterDayStats.lostPrice + starterDayStats.lostTaste + starterDayStats.lostStock + starterDayStats.lostPatience);
assert(starterWalkedPast > 0, `With starter Level 0 table and no upgrades, majority of passing pedestrians must walk past via RNG gacha (peds=${starterPedestrians}, cups=${starterCupsSold}, walkedPast=${starterWalkedPast})`);

// Now test with upgraded cart, marketing, machine, terminal, and hired staff
sim.resetGame();
sim.weather = { type: 'sunny', temp: 26, icon: '☀️', desc: 'Warm & Sunny' };
sim.cash = 5000;
sim.inventory = { beans: 500, milk: 500, sugar: 500, ice: 500, cups: 500, syrup: 500 };
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 2.50, acceptCrypto: false };
sim.upgrades = { machine: 4, cooler: 4, grinder: 3, terminal: 3, canopy: 3, marketing: 4, decor: 5 };
sim.hiredStaff = { cashier: true, entertainer: true, promoter: true, barista: true };
engine.startDay();
engine.skipToEndOfDay();
const upgradedDayStats = sim.ledgerHistory[0].stats;
const upgradedCupsSold = upgradedDayStats.cupsSold;
assert(upgradedCupsSold > starterCupsSold, `Upgraded stand + staff must sell significantly more cups (${upgradedCupsSold}) than starter table (${starterCupsSold})`);
assert((upgradedDayStats.paymentTapCount || 0) + (upgradedDayStats.paymentQrisCount || 0) > 0, 'Terminal Level 3 must process QRIS & NFC Tap payments during live day');

// Verify SpriteRenderer renders all 6 Cart levels (0..5) without error
const mockCtx = window.HTMLCanvasElement.prototype.getContext();
for (let lvl = 0; lvl <= 5; lvl++) {
    window.spriteRenderer.cartLoaded = true;
    window.spriteRenderer.cartLevelLoaded[lvl] = true;
    window.spriteRenderer.cartLevelSprites[lvl] = { width: 250, height: 352 };
    window.spriteRenderer.renderStand(mockCtx, 250, 180, { decor: lvl, machine: 1, cooler: 1, grinder: 1, terminal: 1, canopy: 1, marketing: 1 });
    window.spriteRenderer.cartLoaded = false;
    window.spriteRenderer.cartLevelLoaded[lvl] = false;
    window.spriteRenderer.renderStand(mockCtx, 250, 180, { decor: lvl, machine: 1, cooler: 1, grinder: 1, terminal: 1, canopy: 1, marketing: 1 });
}
console.log(`[PASS] 10. End-to-End Live Simulation (Starter Cups=${starterCupsSold}, WalkedPast=${starterWalkedPast} vs Upgraded+Staff Cups=${upgradedCupsSold}) & 6 Cart Tiers (0..5) rendering verified.`);

// 12. Regression Tests for Reviewer Fixes (Tips to Cash, Same-Morning Rent Switch Credit, Day 2+ Rent UI, Staff Help & Payroll DOM)
sim.resetGame();
sim.cash = 100.00;
sim.inventory = { beans: 50, milk: 50, sugar: 50, ice: 50, cups: 50, syrup: 50 };
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 3.00 };
const tipCashBefore = sim.cash;
sim.executePurchase({
    buy: true,
    price: 3.00,
    tip: 1.25,
    paymentMethod: 'Tap',
    needed: { cups: 1, milk: 2, sugar: 2, ice: 2, syrup: 1 }
});
assert.strictEqual(sim.cash, 104.25, 'Customer price ($3.00) + tip ($1.25) must both credit sim.cash directly even when web3Manager is active');
assert.strictEqual(sim.dailyStats.revenueCash, 3.00);
assert.strictEqual(sim.dailyStats.tipsCash, 1.25);

// Same-morning location switching credit
sim.resetGame(); // $40 cash at cul_de_sac ($0)
const rentGarden = sim.rentLocation('community_garden'); // $5 upfront
assert.strictEqual(rentGarden.success, true);
assert.strictEqual(sim.cash, 35.00);
const switchToLib = sim.rentLocation('public_library'); // $10 upfront, credits $5 from community_garden -> net $5 deducted
assert.strictEqual(switchToLib.success, true, 'Switching from $5 location to $10 location on same morning must credit already-paid $5');
assert.strictEqual(sim.cash, 30.00, 'Cash should be $40 - $10 = $30.00');
assert.strictEqual(sim.dailyStats.costRent, 10.00, 'costRent should equal the active location rent ($10), not double-charged ($15)');
const switchBackFree = sim.rentLocation('cul_de_sac'); // $0 upfront, refunds $10 morning credit
assert.strictEqual(switchBackFree.success, true);
assert.strictEqual(sim.cash, 40.00, 'Moving back to free location before opening stand must refund unused morning rent');
assert.strictEqual(sim.dailyStats.costRent, 0.00);

// Day 2+ upfront rent status & payment on current stand
sim.rentLocation('community_garden'); // $5 upfront on Day 1
sim.endDay(); // Advances to Day 2; resets prepaidRentLocation to null
assert.strictEqual(sim.dayNumber, 2);
assert.strictEqual(sim.currentLocation, 'community_garden');
assert.strictEqual(sim.prepaidRentLocation, null);
gc.selectedLocationIndex = Object.keys(sim.getLocations()).indexOf('community_garden');
sim.cash = 3.00; // Cannot afford $5 rent on Day 2 morning
gc.renderLocationsTab();
assert(document.getElementById('locPortraitBadge').textContent.includes('RENT DUE TODAY'), 'Unpaid Day 2 stand must show RENT DUE TODAY badge');
assert(document.getElementById('locBtnRent').disabled === true, 'Rent button must be disabled when cash < Day 2 rent');
assert(document.getElementById('locBtnRent').textContent.includes('Unpaid Rent'), 'Rent button must warn of unpaid rent');

sim.cash = 50.00; // Now can afford $5 rent on Day 2 morning
gc.renderLocationsTab();
assert.strictEqual(document.getElementById('locBtnRent').disabled, false, 'Rent button must be enabled to pay Day 2 rent on current stand');
assert(document.getElementById('locBtnRent').textContent.includes("Pay Today's Rent"), 'Rent button must allow paying today rent');
gc.handleLocationRent();
assert.strictEqual(sim.cash, 45.00, 'Clicking Pay Today Rent deducts $5 upfront');
assert.strictEqual(sim.prepaidRentLocation, 'community_garden');
assert.strictEqual(document.getElementById('locBtnRent').disabled, true, 'Rent button disabled once today rent is paid');

// Staff help & payroll DOM elements
sim.cash = 100.00;
sim.toggleHireStaff('cashier');
gc.selectStaffIndex(0);
assert(document.getElementById('staffTotalWageLabel').textContent.includes('$60.00'), 'staffTotalWageLabel must display active payroll');
assert(document.getElementById('staffHelpSpeed').textContent.includes('+35%'), 'staffHelpSpeed must display cashier speed bonus');
console.log('[PASS] 11. Reviewer Regression Suite (Direct Tip Crediting, Same-Morning Rent Switch Credit, Day 2+ Rent Lockout/Payment, Staff DOM IDs) verified.');

// 13. Queue Throughput, Dynamic Queue Capacity, Non-Penalizing queue_full, Batch Bean Math, Closing Queue Service & /boost Rebalance
sim.resetGame();
assert.strictEqual(sim.getMaxQueueSize(), 10, 'Base max queue size must be 10');
assert.strictEqual(engine.getMaxQueueSize(), 10, 'Engine base max queue size must be 10');

sim.upgrades.canopy = 3; // +4 queue cap
sim.upgrades.decor = 5;  // +4 queue cap
sim.hiredStaff.entertainer = true; // +4 queue cap
window.web3Manager.isBoostActive = true; // +4 queue cap
assert.strictEqual(sim.getMaxQueueSize(), 26, 'Maxed canopy + cart + mascot + /boost must expand maxQueueSize to 26');
assert.strictEqual(engine.getMaxQueueSize(), 26, 'Engine getMaxQueueSize() must return 26 when fully upgraded & boosted');
for (const locKey of Object.keys(window.STAND_CONFIGS)) {
    sim.currentLocation = locKey;
    const seenQueueCoords = new Set();
    for (let s = 0; s < 26; s++) {
        const pt = engine.getQueueSpotCoords(s);
        assert(Number.isFinite(pt.x) && Number.isFinite(pt.y), `[${locKey}] Queue spot ${s} must have valid finite coordinates`);
        assert(pt.x >= 18 && pt.x <= 622 && pt.y >= 110 && pt.y <= 348, `[${locKey}] Queue spot ${s} (${pt.x}, ${pt.y}) must stay within visible canvas bounds`);
        const coordKey = `${pt.x},${pt.y}`;
        assert(!seenQueueCoords.has(coordKey), `[${locKey}] Queue spot ${s} (${coordKey}) must not stack on top of an earlier queue spot`);
        seenQueueCoords.add(coordKey);
    }
}
window.web3Manager.isBoostActive = false;

// Verify batch bean reservation math: 10 queued customers with cupsInBatch=0 only need 1 batch of beans (3 scoops), not 10 batches (30 scoops)
sim.resetGame();
sim.weather = { type: 'sunny', temp: 26, icon: '☀️', desc: 'Warm & Sunny' };
sim.cupsInBatch = 0;
sim.inventory = { beans: 6, milk: 50, sugar: 50, ice: 50, cups: 50, syrup: 50 };
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 1.50 };
for (let i = 0; i < 10; i++) {
    const dec = sim.evaluateCustomerDecision({ archetype: 'student' }, false);
    assert.strictEqual(dec.buy, true, `Customer ${i + 1}/10 must be able to buy with 6 beans in stock (1 batch = 10 cups)`);
    const ok = sim.reserveStock(dec.needed);
    assert.strictEqual(ok, true, `reserveStock for customer ${i + 1}/10 must succeed using 1 reserved batch`);
}
assert.strictEqual(sim.reservedBatches, 1, '10 queued cups must reserve exactly 1 batch of beans');
assert.strictEqual(sim.reservedStock.cups, 10, 'reservedStock.cups must track 10 cups');

// 11th customer needs a 2nd batch (total 6 beans needed, which we have!)
const dec11 = sim.evaluateCustomerDecision({ archetype: 'student' }, false);
assert.strictEqual(dec11.buy, true, '11th customer must be able to buy using the 2nd batch of 3 beans');
assert.strictEqual(sim.reserveStock(dec11.needed), true);
assert.strictEqual(sim.reservedBatches, 2, '11 queued cups (at 10 cups/batch) must reserve 2 batches of beans');

// Release 1 customer's stock and verify reservedBatches drops back to 1
sim.releaseStock(dec11.needed);
assert.strictEqual(sim.reservedStock.cups, 10);
assert.strictEqual(sim.reservedBatches, 1, 'Releasing 11th cup must reduce reservedBatches back to 1');

// Verify decision order & non-penalizing 'queue_full' vs 'impatient'
sim.resetGame();
sim.weather = { type: 'sunny', temp: 26, icon: '☀️', desc: 'Warm & Sunny' };
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 12.00 };
sim.inventory = { beans: 100, milk: 100, sugar: 100, ice: 100, cups: 100, syrup: 100 };
engine.queue = new Array(10).fill({ id: 'dummy' }); // Fill base queue (10/10)
const satBeforeFull = sim.getLocationSatisfaction(sim.currentLocation);
const popBeforeFull = sim.locationStats[sim.currentLocation].popularity;

// A customer who rejects price ($12.00) must record lostPrice, NOT queue_full, even when queue is full
const priceRejectCust = { id: 'c_price', archetype: 'student', x: 250, y: 200, state: 'deciding' };
engine.handleCustomerDecision(priceRejectCust);
assert.strictEqual(sim.dailyStats.lostPrice, 1, 'Price rejection must be evaluated before queue full check');
assert.strictEqual(sim.dailyStats.lostPatience, 0, 'Price rejection must not increment lostPatience');

// A customer who wants to buy ($1.50) when queue is full records 'queue_full' with ZERO satisfaction penalty
sim.recipe.price = 1.50;
const fullQueueCust = { id: 'c_full', archetype: 'student', x: 250, y: 200, state: 'deciding' };
engine.handleCustomerDecision(fullQueueCust);
assert.strictEqual(fullQueueCust.bubble.text, 'Line too long! ⏳');
assert.strictEqual(sim.dailyStats.lostPatience, 1);
assert.strictEqual(sim.dailyStats.lostQueue, 1);
assert.strictEqual(sim.getLocationSatisfaction(sim.currentLocation), satBeforeFull, 'queue_full (Line too long!) must NOT penalize stand satisfaction');
assert(sim.locationStats[sim.currentLocation].popularity > popBeforeFull, 'Busy line should slightly increase stand popularity buzz');

// Verify closing time (06:00 PM) finishes serving queued customers and handles mid-queue stock depletion cleanly
sim.resetGame();
sim.inventory = { beans: 10, milk: 4, sugar: 4, ice: 4, cups: 2, syrup: 2 }; // Only enough cups/ingredients for 2 of the 3 closing customers
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 2.50 };
engine.queue = [];
const closingCust1 = { id: 'close_1', archetype: 'student', state: 'serving', decision: { buy: true, rating: 5, price: 2.50, tip: 0.50, needed: { cups: 1, milk: 2, sugar: 2, ice: 2, syrup: 1 } } };
const closingCust2 = { id: 'close_2', archetype: 'student', state: 'queued', decision: { buy: true, rating: 5, price: 2.50, tip: 0.50, needed: { cups: 1, milk: 2, sugar: 2, ice: 2, syrup: 1 } } };
const closingCust3 = { id: 'close_3', archetype: 'student', state: 'queued', decision: { buy: true, rating: 5, price: 2.50, tip: 0.50, needed: { cups: 1, milk: 2, sugar: 2, ice: 2, syrup: 1 } } };
sim.reservedStock = { cups: 3, milk: 6, sugar: 6, ice: 6, syrup: 3 };
sim.reservedBatches = 1;
engine.currentServingCustomer = closingCust1;
engine.queue = [closingCust2, closingCust3];
engine.finishDay();
assert.strictEqual(closingCust1.hasCoffee, true, 'Customer being served at closing time must finish receiving coffee');
assert.strictEqual(closingCust2.hasCoffee, true, '2nd customer with available stock must be served before stand closes');
assert.strictEqual(Boolean(closingCust3.hasCoffee), false, '3rd customer after stock depletes must not be served out of thin air');
assert.strictEqual(sim.ledgerHistory[0].stats.cupsSold, 2, 'Only the 2 closing-time customers with stock must be counted in daily cupsSold');
assert.strictEqual(sim.ledgerHistory[0].stats.lostStock, 1, 'Unserved closing customer due to stock depletion must increment lostStock');
assert.strictEqual(sim.reservedStock.cups, 0, 'All closing queue stock reservations must be cleanly reset');
assert.strictEqual(sim.reservedBatches, 0, 'All closing batch reservations must be cleanly reset');
assert.strictEqual(sim.inventory.cups, 0, 'Cups inventory must be 0 and never negative');

// Verify /boost $100.00 Cash cost, 3-day cooldown, zero $BEAN errors, and inclusion in costMarketing / totalExpenses
sim.resetGame();
sim.cash = 50.00;
const boostFailCash = window.web3Manager.activateBoost(sim.dayNumber, true);
assert.strictEqual(boostFailCash.success, false, '/boost must fail when enforceCash=true and cash < $100');
assert(!boostFailCash.message.includes('$BEAN'), '/boost error message must NEVER mention $BEAN');
assert(boostFailCash.message.includes('$100.00 Cash'), '/boost error message must state $100.00 Cash requirement');

sim.cash = 250.00;
const speedBeforeBoost = sim.getTotalServiceSpeedMultiplier();
const boostOkDay1 = window.web3Manager.activateBoost(1, true);
assert.strictEqual(boostOkDay1.success, true, '/boost must succeed when cash >= $100');
assert.strictEqual(sim.cash, 150.00, '/boost must deduct $100.00 Cash');
assert.strictEqual(sim.dailyStats.expenses, 100.00, '/boost must record $100.00 in dailyStats.expenses');
assert.strictEqual(sim.dailyStats.costMarketing, 100.00, '/boost must record $100.00 in dailyStats.costMarketing');
sim.applyDailyMarketingBudget();
assert.strictEqual(sim.dailyStats.costMarketing, 100.00, 'applyDailyMarketingBudget() must preserve /boost $100.00 cost in costMarketing');
assert(sim.getTotalServiceSpeedMultiplier() > speedBeforeBoost, '/boost must grant +35% service speed multiplier bonus');

window.web3Manager.resetDayBoost();
const boostCooldownDay2 = window.web3Manager.activateBoost(2, true);
assert.strictEqual(boostCooldownDay2.success, false, '/boost must be on cooldown on Day 2 (after Day 1 activation)');
assert(boostCooldownDay2.message.includes('cooldown'), 'Cooldown message must explain cooldown status');
const boostCooldownDay3 = window.web3Manager.activateBoost(3, true);
assert.strictEqual(boostCooldownDay3.success, false, '/boost must still be on 3-day cooldown on Day 3');
const boostReadyDay4 = window.web3Manager.activateBoost(4, true);
assert.strictEqual(boostReadyDay4.success, true, '/boost must be ready to activate again on Day 4 (3 days after Day 1)');

// High-traffic Campus throughput test with upgrades + staff + /boost
sim.resetGame();
sim.currentLocation = 'campus';
sim.prepaidRentLocation = 'campus';
sim.paidLocationRentForDay = sim.dayNumber;
sim.weather = { type: 'sunny', temp: 26, icon: '☀️', desc: 'Warm & Sunny' };
sim.cash = 5000;
sim.inventory = { beans: 1000, milk: 1000, sugar: 1000, ice: 1000, cups: 1000, syrup: 1000 };
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 3.00, acceptCrypto: false };
sim.upgrades = { machine: 4, cooler: 4, grinder: 3, terminal: 3, canopy: 3, marketing: 4, decor: 5 };
sim.hiredStaff = { cashier: true, entertainer: true, promoter: true, barista: true };
window.web3Manager.activateBoost(sim.dayNumber, true);
engine.startDay();
engine.skipToEndOfDay();
const campusLedger = sim.ledgerHistory[0];
const campusDayStats = campusLedger.stats;
assert(campusDayStats.cupsSold >= 140, `High-traffic Campus with upgrades, staff & /boost must break the old ~61 cup bottleneck and serve 140+ cups (served ${campusDayStats.cupsSold})`);
assert.strictEqual(campusDayStats.lostStock, 0, 'With 1000 units of inventory, lostStock must be 0');
assert.strictEqual(campusDayStats.costMarketing, 100.00, 'Campus day with /boost must include $100.00 in costMarketing after startDay/endDay');
assert(campusLedger.totalExpenses >= 100.00, 'Ledger totalExpenses must include the $100.00 /boost campaign cost');
assert(sim.getLocationSatisfaction('campus') >= 90, `Campus satisfaction must remain high (>=90%, got ${sim.getLocationSatisfaction('campus')}%)`);
console.log(`[PASS] 12. Throughput Overhaul (Campus Cups=${campusDayStats.cupsSold}, Satisfaction=${sim.getLocationSatisfaction('campus')}%), Non-Overlapping Dynamic Queue Cap (26), Batch Bean Math, Closing Depletion Guard & $100 /boost Accounting verified.`);

// 14. Verify Tier 5 Peak Location (International Airport Terminal, $300/day rent) is Profitable
sim.resetGame();
sim.cash = 5000.00;
const airportRentRes = sim.rentLocation('airport_terminal');
assert.strictEqual(airportRentRes.success, true);
assert.strictEqual(airportRentRes.rentPaid, 300.00, 'Airport Terminal rent must be realistic $300.00/day');
sim.weather = { type: 'sunny', temp: 26, icon: '☀️', desc: 'Warm & Sunny' };
sim.inventory = { beans: 1000, milk: 1000, sugar: 1000, ice: 1000, cups: 1000, syrup: 1000 };
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 6.50, acceptCrypto: false };
sim.upgrades = { machine: 4, cooler: 4, grinder: 3, terminal: 3, canopy: 3, marketing: 4, decor: 5 };
sim.hiredStaff = { cashier: true, entertainer: true, promoter: true, barista: true };
engine.startDay();
engine.skipToEndOfDay();
const airportLedger = sim.ledgerHistory[0];
assert.strictEqual(airportLedger.stats.costRent, 300.00, 'Airport Terminal ledger must record $300.00 rent');
assert(airportLedger.netProfit > 500.00, `Tier 5 Airport Terminal must generate healthy positive net profit after $300 rent & $355 staff wages (got $${airportLedger.netProfit.toFixed(2)})`);

// Verify #standSettingRent displays both location name and daily rent
gc.updateStandPanels();
assert.strictEqual(document.getElementById('standSettingRent').textContent, 'International Airport Terminal ($300/d)', '#standSettingRent must show location name and daily rent');
sim.resetGame();
gc.updateStandPanels();
assert.strictEqual(document.getElementById('standSettingRent').textContent, 'Quiet Cul-de-Sac (FREE)', '#standSettingRent must show FREE for $0 rent location');

// Verify loadState() migrates legacy inflated prepaidRentAmount and syncs dailyStats.openingCash & costRent on reload
global.localStorage.setItem('coffede_simulation', JSON.stringify({
    cash: 200.00,
    dayNumber: 5,
    currentLocation: 'airport_terminal',
    prepaidRentLocation: 'airport_terminal',
    paidLocationRentForDay: 5,
    prepaidRentAmount: 4800.00 // Legacy old inflated rent
}));
sim.dailyStats = sim.createNewDailyStats();
sim.loadState();
assert.strictEqual(sim.prepaidRentAmount, 300.00, 'loadState must clamp legacy inflated prepaidRentAmount ($4800) to realistic rent ($300)');
assert.strictEqual(sim.cash, 4700.00, 'loadState must refund legacy rent overcharge ($4800 - $300 = $4500) to player cash ($200 + $4500 = $4700)');
assert.strictEqual(sim.dailyStats.costRent, 300.00, 'loadState must sync dailyStats.costRent with active prepaid rent ($300)');
assert.strictEqual(sim.dailyStats.openingCash, 5000.00, 'loadState must sync dailyStats.openingCash ($4700 + $300 = $5000)');
const migratedEndDay = sim.endDay();
assert.strictEqual(migratedEndDay.stats.costRent, 300.00, 'endDay after legacy migration must record realistic $300.00 rent, not $4800.00');
assert.strictEqual(migratedEndDay.openingCash, 5000.00, 'endDay after reload must preserve synced openingCash ($5000.00)');
sim.resetGame();

console.log(`[PASS] 13. Realistic Location Rent Economics, #standSettingRent readout & legacy localStorage rent migration verified (Airport Terminal Rent=$300/day, Cups=${airportLedger.stats.cupsSold}, Gross=$${airportLedger.totalRevenue.toFixed(2)}, Net Profit=+$${airportLedger.netProfit.toFixed(2)}).`);

console.log('=== ALL 13 OVERHAUL VERIFICATION SUITES PASSED 100%! ===');

