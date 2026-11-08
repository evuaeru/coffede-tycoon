// Unit test script for Coffede Tycoon simulation engine
const fs = require('fs');

// Mock browser globals for headless testing
global.window = global;
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
// Mock web3
require('./js/web3.js');
// Mock simulation
require('./js/simulation.js');

console.log('Testing SimulationModel & Game Mechanics:');

const sim = window.simulationModel;
console.log(`Initial Cash: $${sim.cash}, Reputation: ${sim.reputation}%`);

// 1. Test Recipe Evaluation in Heat vs Cold
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 2.50 };
const coldEval = sim.evaluateRecipe(8); // 8°C
console.log(`8°C (Cold/Winter) evaluation with ice=2: Quality=${coldEval.overallQuality}%, Stars=${coldEval.stars}, TempScore=${coldEval.tempScore}%`);

sim.recipe.ice = 0; // Proper hot coffee
const coldHotEval = sim.evaluateRecipe(8);
console.log(`8°C with ice=0 (Hot coffee): Quality=${coldHotEval.overallQuality}%, Stars=${coldHotEval.stars}, TempScore=${coldHotEval.tempScore}%`);
if (coldHotEval.tempScore < coldEval.tempScore) {
    throw new Error('Expected hot coffee (0 ice) to score better than iced coffee in 8°C freezing weather!');
}

sim.recipe.ice = 4; // Iced coffee
const hotEval = sim.evaluateRecipe(35); // 35°C Scorching
console.log(`35°C (Scorching) evaluation with ice=4: Quality=${hotEval.overallQuality}%, Stars=${hotEval.stars}, TempScore=${hotEval.tempScore}%`);
if (hotEval.tempScore < 90) {
    throw new Error('Expected iced coffee to score 90%+ in 35°C heat!');
}

// 2. Test Buying Supplies
console.log('\nTesting Supplies Store:');
const startBeans = sim.inventory.beans;
const startCash = sim.cash;
const buyRes = sim.buySupply('beans_med');
console.log(`Bought beans_med: ${buyRes.message}`);
if (!buyRes.success || sim.inventory.beans !== startBeans + 80 || sim.cash >= startCash) {
    throw new Error('Failed to purchase supplies correctly');
}

// 3. Test Upgrades
console.log('\nTesting Upgrades:');
sim.cash += 150.0; // Give cash to test upgrade purchase (Grinder Lvl 2 costs $110)
const upgRes = sim.buyUpgrade('grinder', 2);
console.log(`Upgrade grinder Lvl 2: ${upgRes.message}`);
if (!upgRes.success || sim.upgrades.grinder !== 2) {
    throw new Error('Failed to buy grinder upgrade');
}

// 4. Test Customer Purchase Cycle
console.log('\nTesting Customer Decisions & Purchases:');
sim.weather = { type: 'sunny', temp: 26, icon: '☀️', desc: 'Warm & Sunny' };
sim.inventory = { beans: 100, milk: 100, sugar: 100, ice: 100, cups: 100, syrup: 100 };
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 5.00 };
// High price test:
const expensiveDecision = sim.evaluateCustomerDecision({ archetype: 'student' }, false);
console.log(`Student decision at $5.00: Buy=${expensiveDecision.buy}, Feedback="${expensiveDecision.feedback}"`);
if (expensiveDecision.buy !== false) throw new Error('Expected student to reject $5 coffee in starter neighborhood');

// Affordable price test:
sim.recipe.price = 2.50;
const studentDecision = sim.evaluateCustomerDecision({ archetype: 'student' }, false);
console.log(`Student decision at $2.50: Buy=${studentDecision.buy}, Feedback="${studentDecision.feedback}"`);
if (!studentDecision.buy) throw new Error('Expected student to buy affordable $2.50 coffee');

const prevCups = sim.dailyStats.cupsSold;
sim.executePurchase(studentDecision);
console.log(`Executed purchase! Cups sold today: ${sim.dailyStats.cupsSold}, Daily Cash Rev: $${sim.dailyStats.revenueCash.toFixed(2)}`);
if (sim.dailyStats.cupsSold !== prevCups + 1) throw new Error('Purchase did not increment cups sold');

// Tech-savvy patron Contactless Tap / QRIS test:
sim.upgrades.terminal = 3; // Contactless NFC Tap & Smart QRIS POS
const tapDecision = sim.evaluateCustomerDecision({ id: 1, archetype: 'cryptobro' }, true);
console.log(`Tech Founder decision: Buy=${tapDecision.buy}, PaymentMethod=${tapDecision.paymentMethod}, IsCrypto=${tapDecision.isCrypto}, Feedback="${tapDecision.feedback}"`);
if (!tapDecision.buy || tapDecision.isCrypto !== false || (tapDecision.paymentMethod !== 'Tap' && tapDecision.paymentMethod !== 'QRIS')) {
    throw new Error('Expected Tech Founder to pay via Contactless Tap or QRIS (not crypto) with Terminal Lvl 3');
}
sim.executePurchase(tapDecision);
console.log(`Executed Contactless Tap purchase! Tap count: ${sim.dailyStats.paymentTapCount}, Total Cash Rev: $${sim.dailyStats.revenueCash.toFixed(2)}`);

// 5. Test Web3 /boost
console.log('\nTesting Web3 & /boost:');
const web3 = window.web3Manager;
console.log(`Web3 address: ${web3.address}, USDC: ${web3.usdc}, BEAN: ${web3.bean}`);
const boostRes = web3.activateBoost(sim.dayNumber);
console.log(`Boost activation: ${boostRes.message}`);
if (!boostRes.success || !web3.isBoostActive) {
    throw new Error('Failed to activate /boost');
}

// 6. Test NFT Franchise Minting
const mockNft = web3.mintFranchiseNFT(1, 15, 65.0, 'Greenwood Suburbs');
console.log(`Minted Franchise NFT: ${mockNft.id} (${mockNft.name}), Rarity: ${mockNft.rarity}`);
if (!mockNft || web3.nfts.length !== 1) {
    throw new Error('Failed to mint Franchise NFT');
}

// 7. Test End of Day & Spoilage
console.log('\nTesting End of Day Audit:');
const ledgerEntry = sim.endDay();
console.log(`Day ended! Audit result:
- Revenue: $${ledgerEntry.totalRevenue.toFixed(2)}
- Expenses: -$${ledgerEntry.totalExpenses.toFixed(2)}
- Net Profit: $${ledgerEntry.netProfit.toFixed(2)}
- Ice Melted: ${ledgerEntry.meltedIce} cubes
- Spoiled Milk: ${ledgerEntry.spoiledMilk} servings
- Closing Cash: $${ledgerEntry.closingCash.toFixed(2)}
- New Day: Day ${sim.dayNumber}
`);

console.log('✅ ALL TESTS PASSED SUCCESSFULLY!');
