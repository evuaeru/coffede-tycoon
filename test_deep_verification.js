// Deep verification test suite for Coffede Tycoon
// Tests edge cases, concurrency/queue race conditions, DEX swaps, Leaderboards, Tip Jar, and multi-day endurance.

const assert = require('assert');

// Mock browser globals
global.window = global;
global.requestAnimationFrame = () => {};
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
};

// Mock audio
require('./js/audio.js');
// Mock sprites
require('./js/sprites.js');
// Web3
require('./js/web3.js');
// Simulation
require('./js/simulation.js');
// Engine
require('./js/engine.js');

console.log('--- STARTING DEEP VERIFICATION SUITE ---');

const sim = window.simulationModel;
const web3 = window.web3Manager;
const engine = window.simulationEngine;

// TEST 1: Stock Reservation & Negative Stock Prevention
console.log('\n[Test 1] Queue Stock Reservation & Negative Inventory Guard:');
sim.resetGame();
sim.recipe = { beans: 2, milk: 1, sugar: 1, ice: 2, syrup: 0, price: 2.00 };
sim.inventory = { beans: 2, milk: 1, sugar: 1, ice: 2, cups: 1, syrup: 0 };
sim.cupsInBatch = 0;

// Customer 1 decides to buy
const cust1 = { archetype: 'student' };
const dec1 = sim.evaluateCustomerDecision(cust1, false);
assert.strictEqual(dec1.buy, true, 'Customer 1 should be willing to buy');
const res1 = sim.reserveStock(dec1.needed);
assert.strictEqual(res1, true, 'Stock should be reserved for Customer 1');

// Customer 2 arrives while Customer 1 is queued
const cust2 = { archetype: 'student' };
const dec2 = sim.evaluateCustomerDecision(cust2, false);
console.log('Customer 2 decision when 1 cup is reserved in queue:', dec2);
assert.strictEqual(dec2.buy, false, 'Customer 2 must NOT be allowed to buy when stock is reserved');
assert.strictEqual(dec2.reason, 'stock', 'Customer 2 rejection reason must be stock');

// Serve Customer 1
sim.executePurchase(dec1);
console.log('Inventory after serving Customer 1:', sim.inventory);
assert.strictEqual(sim.inventory.cups, 0, 'Cups must be 0, never negative');
assert.strictEqual(sim.inventory.milk, 0, 'Milk must be 0, never negative');
assert.strictEqual(sim.inventory.sugar, 0, 'Sugar must be 0, never negative');
assert.strictEqual(sim.inventory.ice, 0, 'Ice must be 0, never negative');
console.log('✓ Stock reservation successfully prevented negative inventory!');

// TEST 2: DEX Swap & Off-Ramp Mechanics
console.log('\n[Test 2] Web3 DEX Swap & Liquidity Off-Ramp:');
const startCash = sim.cash;
const startUSDC = web3.usdc;

// Swap 10 USDC to Cash
const swapRes1 = web3.swapUSDCToCash(10);
assert.strictEqual(swapRes1.success, true);
assert.strictEqual(web3.usdc, startUSDC - 10);
assert.strictEqual(sim.cash, startCash + 10);
console.log(`✓ Swapped 10 USDC for $10 Cash. Cash is now $${sim.cash.toFixed(2)}, USDC is ${web3.usdc.toFixed(2)}`);

// Swap $5 Cash to USDC
const swapRes2 = web3.swapCashToUSDC(5);
assert.strictEqual(swapRes2.success, true);
assert.strictEqual(sim.cash, startCash + 5);
assert.strictEqual(web3.usdc, startUSDC - 5);
console.log(`✓ Converted $5 Cash into 5 USDC. Cash is now $${sim.cash.toFixed(2)}, USDC is ${web3.usdc.toFixed(2)}`);

// Swap $BEAN to Cash
const startBean = web3.bean;
const swapBeanRes = web3.swapBeanToCash(20);
assert.strictEqual(swapBeanRes.success, true);
assert.strictEqual(web3.bean, startBean - 20);
assert.strictEqual(sim.cash, startCash + 5 + 2.0); // 20 BEAN = $2.00
console.log(`✓ Redeemed 20 $BEAN for $2.00 Cash. Cash: $${sim.cash.toFixed(2)}, $BEAN: ${web3.bean}`);

// TEST 3: Web3 Tip Jar & Barista Morale Boost
console.log('\n[Test 3] Web3 Tip Jar & Barista Morale:');
web3.addToTipJar('cash', 3.50);
web3.addToTipJar('usdc', 4.00);
web3.addToTipJar('bean', 15.0);
console.log(`Tip Jar balance: $${web3.tipJarCash.toFixed(2)} Cash, ${web3.tipJarUSDC.toFixed(2)} USDC, ${web3.tipJarBean} $BEAN`);

const collectRes = web3.collectTipJar();
assert.strictEqual(collectRes.success, true);
assert.strictEqual(web3.tipJarCash, 0);
assert.strictEqual(web3.tipJarUSDC, 0);
console.log('✓ Collected all tips into wallet & cash!');

// Barista Tip
const tipBaristaRes = web3.tipBarista(2.0);
assert.strictEqual(tipBaristaRes.success, true);
assert.strictEqual(web3.baristaMoraleBoost, 0.25);
console.log('✓ Tipped barista 2 USDC: Barista Morale Boost +25% Speed active!');

// TEST 4: On-Chain Global Leaderboard
console.log('\n[Test 4] On-Chain Leaderboard:');
web3.setFranchiseName("Master Zay's Cyber Roastery");
const leaderboard = web3.getLeaderboard();
assert(leaderboard.length >= 8, 'Leaderboard must contain at least 8 tycoons');
const playerEntry = leaderboard.find(e => e.isPlayer);
assert(playerEntry, 'Player entry must exist in leaderboard');
assert.strictEqual(playerEntry.name, "Master Zay's Cyber Roastery");
console.log(`✓ Player ranked #${playerEntry.rank} on global leaderboard (${playerEntry.name}, Cups: ${playerEntry.cups}, Net Worth: $${playerEntry.netWorth.toFixed(2)})`);

// TEST 5: Active Upgrades & NFT Traits
console.log('\n[Test 5] Active Upgrade & NFT Traits:');
// Mint an NFT
const testNft = web3.mintFranchiseNFT(1, 20, 100, 'Greenwood Suburbs');
const perks = web3.getNFTPerks();
console.log('Active NFT perks:', perks);
assert(perks.speedBonus > 0, 'NFT should grant speed bonus');
assert(perks.tipBonus > 0, 'NFT should grant tip bonus');
assert(perks.qualityBonus > 0, 'NFT should grant quality bonus');

// Terminal Lvl 2
sim.upgrades.terminal = 2;
const priceTolBase = sim.getLocations().suburbs.basePriceTolerance;
const decisionWithPOS = sim.evaluateCustomerDecision({ archetype: 'student' }, false);
assert(decisionWithPOS, 'Customer evaluation should function with POS upgrade');

// TEST 6: Emergency Relief & Insolvency Recovery
console.log('\n[Test 6] Emergency Relief & Insolvency Recovery:');
sim.cash = -15.00;
sim.inventory.cups = 0;
sim.inventory.beans = 0;
assert.strictEqual(sim.isBankrupt(), true, 'Must identify bankruptcy condition');

// Take loan
const loanRes = sim.takeEmergencyLoan();
assert.strictEqual(loanRes.success, true);
assert.strictEqual(sim.cash, 35.00); // -15 + 50
assert.strictEqual(sim.activeLoan, 50.00);
console.log(`✓ Emergency loan approved: Cash is now $${sim.cash.toFixed(2)}, Active Loan: $${sim.activeLoan.toFixed(2)}`);

// Repay partial loan
const repayRes = sim.repayLoan(10.00);
assert.strictEqual(repayRes.success, true);
assert.strictEqual(sim.activeLoan, 40.00);
assert.strictEqual(sim.cash, 25.00);
console.log(`✓ Repaid $10 loan: Remaining loan debt: $${sim.activeLoan.toFixed(2)}`);

// TEST 7: 15-Day Multi-Day Simulation Endurance
console.log('\n[Test 7] 15-Day Multi-Day Simulation Endurance:');
sim.resetGame();

engine.init({
    getContext: () => ({
        clearRect: () => {},
        fillRect: () => {},
        fillText: () => {}
    })
});

for (let d = 1; d <= 15; d++) {
    // Calibrate recipe to today's weather temperature with attractive pricing ($1.50)
    const idealIce = sim.weather.temp >= 28 ? 4 : (sim.weather.temp >= 22 ? 2 : (sim.weather.temp <= 14 ? 0 : 1));
    sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: idealIce, syrup: 0, price: 1.50 };

    // Financial cushion safety net: take emergency loan if cash drops low
    if (sim.cash < 15.0 && !sim.activeLoan) {
        sim.takeEmergencyLoan();
    }

    // Upgrade marketing/cooler/cart once cash cushion allows
    if (sim.upgrades.marketing === 1 && sim.cash >= 130.0) sim.buyUpgrade('marketing', 2);
    if (sim.upgrades.cooler === 1 && sim.cash >= 160.0) sim.buyUpgrade('cooler', 2);

    // Buy supplies daily (at Cooler Level 1, 100% of leftover milk & ice spoils daily, so buy small perishable packs!)
    const useMedNonPerishable = sim.cash >= 80.0;
    const useMedPerishable = sim.upgrades.cooler >= 2 && sim.cash >= 80.0;
    if (sim.inventory.cups < 25) {
        if (useMedNonPerishable && sim.cash >= 14.0) sim.buySupply('cups_pack');
        else if (sim.cash >= 5.5) sim.buySupply('cups_sleeve');
    }
    if (sim.inventory.beans < 30) {
        if (useMedNonPerishable && sim.cash >= 22.0) sim.buySupply('beans_med');
        else if (sim.cash >= 8.0) sim.buySupply('beans_small');
    }
    if (sim.inventory.milk < 20) {
        if (useMedPerishable && sim.cash >= 14.5) sim.buySupply('milk_med');
        else if (sim.cash >= 5.5) sim.buySupply('milk_small');
    }
    if (sim.inventory.sugar < 25) {
        if (useMedNonPerishable && sim.cash >= 6.5) sim.buySupply('sugar_med');
        else if (sim.cash >= 3.5) sim.buySupply('sugar_box');
    }
    if (idealIce > 0 && sim.inventory.ice < 40) {
        if (useMedPerishable && sim.cash >= 6.5) sim.buySupply('ice_med');
        else if (sim.cash >= 3.0) sim.buySupply('ice_small');
    }

    // Run daytime
    engine.startDay();
    engine.skipToEndOfDay();
    const entry = sim.endDay();

    // Verify stock never went negative
    Object.keys(sim.inventory).forEach(k => {
        assert(sim.inventory[k] >= 0, `Inventory ${k} went negative on Day ${d}: ${sim.inventory[k]}`);
    });

    console.log(`Day ${d}: Sold=${entry.stats.cupsSold} cups | Net=$${entry.netProfit.toFixed(2)} | Cash=$${sim.cash.toFixed(2)} | Rep=${sim.reputation}%`);
    assert(entry.stats.cupsSold > 0, `Stand should sell cups on Day ${d}`);
}

console.log('Final Inventory after 15 days:', sim.inventory);
console.log('Lifetime cups sold:', sim.totalCupsSoldLifetime);
assert(sim.totalCupsSoldLifetime >= 50, 'Should have sold at least 50 cups across 15 days at starter location');
assert(sim.ledgerHistory.length === 15, 'Ledger should have exactly 15 recorded days');

console.log('\n========================================');
console.log('✅ ALL DEEP VERIFICATION TESTS PASSED!');
console.log('========================================');
