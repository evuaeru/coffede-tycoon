// Comprehensive Test for Lemonade Tycoon 16-Bit Upgrades Carousel & Game Balancing
const assert = require('assert');
const fs = require('fs');

console.log('--- STARTING UPGRADES CAROUSEL & GAME BALANCING VERIFICATION ---');

// Mock browser globals for Node.js environment
global.window = global;
global.window.addEventListener = () => {};
global.document = {
    _elements: {},
    getElementById(id) {
        if (!this._elements[id]) {
            this._elements[id] = {
                id,
                textContent: '',
                value: '',
                innerHTML: '',
                style: {},
                disabled: false,
                className: '',
                src: '',
                alt: '',
                children: [],
                classList: {
                    _classes: new Set(),
                    add(c) { this._classes.add(c); },
                    remove(c) { this._classes.delete(c); },
                    toggle(c, v) { if (v) this._classes.add(c); else this._classes.delete(c); },
                    contains(c) { return this._classes.has(c); }
                },
                appendChild(child) {
                    this.children.push(child);
                    return child;
                },
                addEventListener: () => {},
                setAttribute: (k, v) => { this[k] = v; },
                getAttribute: (k) => this[k] || null,
                querySelectorAll: () => []
            };
        }
        return this._elements[id];
    },
    createElement(tag) {
        return {
            tagName: tag.toUpperCase(),
            className: '',
            textContent: '',
            innerHTML: '',
            title: '',
            children: [],
            style: {},
            classList: {
                _classes: new Set(),
                add(c) { this._classes.add(c); },
                remove(c) { this._classes.delete(c); },
                toggle(c, v) { if (v) this._classes.add(c); else this._classes.delete(c); },
                contains(c) { return this._classes.has(c); }
            },
            appendChild(child) {
                this.children.push(child);
                return child;
            },
            addEventListener: () => {}
        };
    },
    querySelectorAll() {
        return [];
    },
    addEventListener() {}
};

global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
};

// Require core modules
require('./js/audio.js');
require('./js/sprites.js');
require('./js/web3.js');
require('./js/simulation.js');
require('./js/engine.js');
require('./js/editor.js');
const { GameController } = require('./js/game.js');

const sim = window.simulationModel;
const game = new GameController();

// -----------------------------------------------------------------
// [Test 1] 7 Categories & 27 Pixel Art Portrait Assets Integrity
// -----------------------------------------------------------------
console.log('\n[Test 1] 7 Categories & 27 Pixel Art Portrait Assets Integrity:');
const upgs = sim.getUpgrades();
const expectedCategories = ['machine', 'cooler', 'grinder', 'terminal', 'canopy', 'marketing', 'decor'];
assert.deepStrictEqual(Object.keys(upgs), expectedCategories, 'All 7 upgrade categories must exist in catalog');

const expectedCounts = {
    machine: 4,
    cooler: 4,
    grinder: 3,
    terminal: 3,
    canopy: 3,
    marketing: 4,
    decor: 6
};

let totalUpgrades = 0;
for (const [cat, count] of Object.entries(expectedCounts)) {
    assert.strictEqual(upgs[cat].length, count, `Category '${cat}' must have exactly ${count} upgrade tiers`);
    totalUpgrades += count;

    upgs[cat].forEach((item, index) => {
        const expectedLevel = cat === 'decor' ? index : index + 1;
        assert.strictEqual(item.level, expectedLevel, `${item.id} level must be ${expectedLevel}`);
        assert.strictEqual(item.category, cat, `${item.id} category must match '${cat}'`);
        assert(item.name && item.name.length > 0, `${item.id} must have a valid name`);
        assert(typeof item.cost === 'number' && item.cost >= 0, `${item.id} must have non-negative cost`);
        assert(item.desc && item.desc.length > 0, `${item.id} must have description`);
        assert(item.help && item.help.length > 0, `${item.id} must have specifications help text`);
        
        // Portrait image asset on disk verification
        assert(item.portrait && item.portrait.startsWith('assets/upg_'), `${item.id} must specify portrait in assets/`);
        assert(fs.existsSync(item.portrait), `Missing portrait asset file: ${item.portrait}`);
        const stat = fs.statSync(item.portrait);
        assert(stat.size > 0, `Portrait asset ${item.portrait} must not be empty`);
    });
}
assert.strictEqual(totalUpgrades, 27, 'Total upgrades catalog must contain exactly 27 items');
console.log('✓ Verified 7 categories, 27 upgrade tiers (including Decor Level 0), and all 27 portrait PNGs on disk');

// -----------------------------------------------------------------
// [Test 2] Carousel Navigation, Wrap-Around & Category Filtering
// -----------------------------------------------------------------
console.log('\n[Test 2] Carousel Navigation, Wrap-Around & Category Filtering:');
game.activeUpgradeCategory = 'all';
game.selectedUpgradeIndex = 0;
let filtered = game.getFilteredUpgrades();
assert.strictEqual(filtered.length, 27, "Default 'all' category returns all 27 items");

// Forward navigation (0 -> 1 -> ... -> 26 -> 0)
game.navigateUpgrade(1);
assert.strictEqual(game.selectedUpgradeIndex, 1, 'Forward navigation advances to index 1');
game.selectedUpgradeIndex = 26;
game.navigateUpgrade(1);
assert.strictEqual(game.selectedUpgradeIndex, 0, 'Forward navigation wraps around from 26 to 0');

// Backward navigation (0 -> 26 -> 25)
game.navigateUpgrade(-1);
assert.strictEqual(game.selectedUpgradeIndex, 26, 'Backward navigation wraps around from 0 to 26');
game.navigateUpgrade(-1);
assert.strictEqual(game.selectedUpgradeIndex, 25, 'Backward navigation steps to 25');

// Category Jump: Cooler (4 tiers)
game.jumpToUpgradeCategory('cooler');
assert.strictEqual(game.activeUpgradeCategory, 'cooler', 'Category set to cooler');
assert.strictEqual(game.selectedUpgradeIndex, 0, 'Index resets to 0 on category switch');
filtered = game.getFilteredUpgrades();
assert.strictEqual(filtered.length, 4, 'Cooler category returns 4 items');
game.navigateUpgrade(-1);
assert.strictEqual(game.selectedUpgradeIndex, 3, 'Cooler wraps backwards from 0 to 3');
game.navigateUpgrade(1);
assert.strictEqual(game.selectedUpgradeIndex, 0, 'Cooler wraps forwards from 3 to 0');

// Category Jump: Canopy (3 tiers: Open Stand, ShadeMaker 3000, Retractable Awning)
game.jumpToUpgradeCategory('canopy');
assert.strictEqual(game.activeUpgradeCategory, 'canopy');
filtered = game.getFilteredUpgrades();
assert.strictEqual(filtered.length, 3, 'Canopy category returns 3 items');
assert.strictEqual(filtered[1].name, 'ShadeMaker 3000 Striped Awning');
assert.strictEqual(filtered[2].name, 'Commercial Retractable All-Weather Awning');

// Category Jump: Decor / Carts (6 tiers: Level 0 Folding Table -> Level 5 Flagship Pavilion)
game.jumpToUpgradeCategory('decor');
assert.strictEqual(game.activeUpgradeCategory, 'decor');
filtered = game.getFilteredUpgrades();
assert.strictEqual(filtered.length, 6, 'Decor (Carts) category returns 6 items (Levels 0..5)');
assert.strictEqual(filtered[0].name, 'Folding Table & Makeshift Gear');
assert.strictEqual(filtered[4].name, 'Parisian Art-Deco Copper & Glass Kiosk');
assert.strictEqual(filtered[5].name, 'Imperial Gold & Onyx Flagship Pavilion');

// Reset to All
game.jumpToUpgradeCategory('all');
assert.strictEqual(game.getFilteredUpgrades().length, 27);
console.log('✓ Navigation forward/backward wrap-around and category jump filtering verified');

// -----------------------------------------------------------------
// [Test 3] Sequential Progression & Purchase Economics
// -----------------------------------------------------------------
console.log('\n[Test 3] Sequential Progression & Purchase Economics:');
// Reset simulation state
sim.upgrades = { machine: 1, cooler: 1, grinder: 1, terminal: 1, canopy: 1, marketing: 1, decor: 0 };
sim.cash = 200.00;

// Attempt to re-purchase already owned Level 1
let res = sim.buyUpgrade('machine', 1);
assert.strictEqual(res.success, false, 'Should reject buying already owned upgrade');
assert.strictEqual(res.message, 'Already owned!');

// Attempt to jump from Level 1 directly to Level 3 (skipping Level 2)
res = sim.buyUpgrade('machine', 3);
assert.strictEqual(res.success, false, 'Should reject skipping levels');
assert.strictEqual(res.message, 'Unlock Level 2 first!');

// Attempt to purchase Level 2 when short on cash
sim.cash = 20.00;
res = sim.buyUpgrade('machine', 2); // Compact Espresso costs $165
assert.strictEqual(res.success, false, 'Should reject purchase if cash < cost');
assert(res.message.includes('Need $165.00'), 'Error message specifies required funds');
assert.strictEqual(sim.upgrades.machine, 1, 'Machine level must remain 1');
assert.strictEqual(sim.cash, 20.00, 'Cash must remain unchanged');

// Successful purchase with adequate cash
sim.cash = 200.00;
res = sim.buyUpgrade('machine', 2);
assert.strictEqual(res.success, true, 'Purchase succeeds with sufficient cash');
assert.strictEqual(sim.upgrades.machine, 2, 'Machine level updated to 2');
assert.strictEqual(sim.cash, 35.00, 'Cash correctly deducted ($200 - $165 = $35)');

// Buy next level (Level 3 - Pro Commercial Dual-Boiler Espresso Machine, costs $520)
sim.cash = 560.00;
res = sim.buyUpgrade('machine', 3);
assert.strictEqual(res.success, true);
assert.strictEqual(sim.upgrades.machine, 3);
assert.strictEqual(sim.cash, 40.00);

// UI Button state check in GameController
game.activeUpgradeCategory = 'machine';
game.selectedUpgradeIndex = 1; // Machine Level 2 (Owned)
game.renderUpgradesTab();
const buyBtn = document.getElementById('upgBtnBuy');
assert.strictEqual(buyBtn.textContent, 'OWNED ★', 'Buy button text must show OWNED ★');
assert.strictEqual(buyBtn.disabled, true, 'Buy button must be disabled for owned item');

game.selectedUpgradeIndex = 3; // Machine Level 4 (Flagship, costs $1350 while cash is $40)
game.renderUpgradesTab();
assert.strictEqual(buyBtn.textContent, 'Need $1350.00', 'Next tier with insufficient cash displays Need $1350.00');
assert.strictEqual(buyBtn.disabled, true);

// Test tier skipping lock: Cooler Level 3 (Mr. Fridge) while Cooler Level 1 is owned
game.activeUpgradeCategory = 'cooler';
game.selectedUpgradeIndex = 2; // Cooler Level 3
game.renderUpgradesTab();
assert(buyBtn.textContent.includes('Unlock Level 2 First'), 'Locked non-adjacent tiers show sequential unlock requirement');
assert.strictEqual(buyBtn.disabled, true);
console.log('✓ Sequential unlock rules, anti-cheating tier locks, and fund deductions verified');

// -----------------------------------------------------------------
// [Test 4] Canopy Weather Mitigation & Queue Patience Balancing
// -----------------------------------------------------------------
console.log('\n[Test 4] Canopy Weather Mitigation & Queue Patience Balancing:');
// 1. Weather Mitigation in engine.js startDay()
sim.currentLocation = 'suburbs';
sim.weather = { type: 'rainy', temp: 15, condition: 'Light rain' };
sim.upgrades.marketing = 1;
sim.dailyMarketingBudget = 0;
const engine = new window.SimulationEngine();

function getAvgPatrons(eng, s, canopyLvl, samples = 30) {
    s.upgrades.canopy = canopyLvl;
    let sum = 0;
    for (let i = 0; i < samples; i++) {
        eng.startDay();
        sum += eng.targetPedestrians;
    }
    return sum / samples;
}

// With canopy: 1 (no shelter)
const avg1 = getAvgPatrons(engine, sim, 1);

// With canopy: 2 (ShadeMaker 3000, +25% rain shelter)
const avg2 = getAvgPatrons(engine, sim, 2);
assert(avg2 > avg1, `Canopy 2 (${avg2.toFixed(1)}) must provide higher traffic than Canopy 1 (${avg1.toFixed(1)}) in rain`);

// With canopy: 3 (Commercial Retractable All-Weather Awning, +50% rain shelter)
const avg3 = getAvgPatrons(engine, sim, 3);
assert(avg3 > avg2, `Canopy 3 (${avg3.toFixed(1)}) must provide higher traffic than Canopy 2 (${avg2.toFixed(1)}) in rain`);

// 2. Queue Patience Limit Verification
// In updateCustomer(c, dt) when state === 'queued':
// canopy 1: limit = 16s
// canopy 2: limit = 16 + 3.0 = 19.0s
// canopy 3: limit = 16 + 6.0 = 22.0s
const customer = {
    id: 101,
    name: 'Test Patron',
    archetype: 'student',
    state: 'queued',
    queueSpot: 0,
    queueWaitTime: 18.0,
    isFidgeting: false,
    fidgetTimer: 0,
    speed: 36,
    x: 100,
    y: 100
};
engine.queue = [customer];

// Test with canopy 1 at 18.0s: patience limit (16s) exceeded -> leaves queue
sim.upgrades.canopy = 1;
engine.updateCustomer(customer, 0.1);
assert.strictEqual(customer.state, 'leaving', 'Customer should leave after 16s with Canopy 1');
assert.strictEqual(customer.bubble.text, 'Too slow! ⏳', 'Patience expiration bubble displayed');

// Test with canopy 2 at 18.0s: patience limit is 19.0s -> remains in queue!
customer.state = 'queued';
customer.queueSpot = 0;
customer.queueWaitTime = 18.0;
customer.bubble = null;
engine.queue = [customer];
sim.upgrades.canopy = 2;
engine.updateCustomer(customer, 0.1);
assert.strictEqual(customer.state, 'queued', 'Customer should stay in queue at 18.1s with ShadeMaker 3000 (limit 19s)');

// Test with canopy 3 at 20.0s: patience limit is 22.0s -> remains in queue!
customer.state = 'queued';
customer.queueSpot = 0;
customer.queueWaitTime = 20.0;
customer.bubble = null;
engine.queue = [customer];
sim.upgrades.canopy = 3;
engine.updateCustomer(customer, 0.1);
assert.strictEqual(customer.state, 'queued', 'Customer should stay in queue at 20.1s with Retractable Awning (limit 22.0s)');
console.log('✓ Canopy rain mitigation and patience extension (+3.0s / +6.0s) verified');

// -----------------------------------------------------------------
// [Test 5] Cash Register & Terminal Serving Speed, Conversion & Tips Balancing
// -----------------------------------------------------------------
console.log('\n[Test 5] Cash Register & Terminal Serving Speed, Conversion & Tips Balancing:');
// Terminal 2 (QRIS & EDC Debit/Credit Card Register) gives +25% checkout speed bonus and +10% conversion
// Terminal 3 (Contactless NFC Tap & Smart QRIS POS) gives +45% checkout speed bonus, +18% conversion, and +35% tips
sim.upgrades.machine = 1; // French Press
sim.upgrades.terminal = 1;

let termList = sim.getUpgrades().terminal;
assert.strictEqual(termList[0].conversionBonus, 0);
assert.strictEqual(termList[1].speedBonus, 25, 'QRIS & Card register provides +25% speed bonus');
assert.strictEqual(termList[1].conversionBonus, 10, 'QRIS & Card register provides +10% conversion bonus');
assert.strictEqual(termList[2].speedBonus, 45, 'Contactless NFC Tap & Smart QRIS POS provides +45% speed bonus');
assert.strictEqual(termList[2].conversionBonus, 18, 'Contactless NFC Tap & Smart QRIS POS provides +18% conversion bonus');
assert.strictEqual(termList[2].tipBonus, 35, 'Contactless NFC Tap & Smart QRIS POS provides +35% tip bonus');

// Test price tolerance scaling with terminal 1 vs 2 vs 3
sim.inventory = { beans: 100, milk: 100, sugar: 100, ice: 100, cups: 100, syrup: 100 };
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 2.00 };
sim.upgrades.terminal = 1;
sim.upgrades.decor = 1;
const testPatron = { archetype: 'student', id: 999 };
let dec1 = sim.evaluateCustomerDecision(testPatron, false);
assert.strictEqual(dec1.buy, true);

sim.upgrades.terminal = 2;
let dec2 = sim.evaluateCustomerDecision(testPatron, false);
assert.strictEqual(dec2.buy, true);

sim.upgrades.terminal = 3;
let dec3 = sim.evaluateCustomerDecision(testPatron, false);
assert.strictEqual(dec3.buy, true);

// Test Decor Levels 0..5 progressive priceTolBonus & tipBonus
const decorCatalog = sim.getUpgrades().decor;
assert.strictEqual(decorCatalog.length, 6, 'Decor catalog must have 6 progressive levels (0..5)');
assert.strictEqual(decorCatalog[0].level, 0);
assert.strictEqual(decorCatalog[0].priceTolBonus, 0.0);
assert.strictEqual(decorCatalog[0].tipBonus, 0.0);
assert.strictEqual(decorCatalog[1].level, 1);
assert.strictEqual(decorCatalog[1].priceTolBonus, 0.0);
assert.strictEqual(decorCatalog[1].tipBonus, 0.05);
assert.strictEqual(decorCatalog[2].priceTolBonus, 0.15);
assert.strictEqual(decorCatalog[2].tipBonus, 0.10);
assert.strictEqual(decorCatalog[3].priceTolBonus, 0.30);
assert.strictEqual(decorCatalog[3].tipBonus, 0.25);
assert.strictEqual(decorCatalog[4].cost, 1650);
assert.strictEqual(decorCatalog[4].priceTolBonus, 0.45);
assert.strictEqual(decorCatalog[4].tipBonus, 0.40);
assert.strictEqual(decorCatalog[5].cost, 3600);
assert.strictEqual(decorCatalog[5].priceTolBonus, 0.65);
assert.strictEqual(decorCatalog[5].tipBonus, 0.60);

// Verify customer price tolerance increases monotonically from Decor 1 to Decor 5
sim.upgrades.terminal = 1;
sim.recipe.price = 4.60; // High luxury price (Decor 1 max ~$4.35, Decor 2+ accepts)
const luxuryPatron = { archetype: 'business', id: 505 };
sim.upgrades.decor = 1;
const decDecor1 = sim.evaluateCustomerDecision(luxuryPatron, false);
sim.upgrades.decor = 2;
const decDecor2 = sim.evaluateCustomerDecision(luxuryPatron, false);
assert.strictEqual(decDecor1.buy, false, 'At $4.60 on Basic Cart (Decor 1), patron refuses as too pricey');
assert.strictEqual(decDecor2.buy, true, 'At $4.60 on Artisan Mahogany Stand (Decor 2, +15% price tolerance), patron buys');

sim.recipe.price = 6.00; // Very high price (Decor 3 max ~$5.66, Decor 4 max ~$6.31)
sim.upgrades.decor = 3;
const decDecor3 = sim.evaluateCustomerDecision(luxuryPatron, false);
sim.upgrades.decor = 4;
const decDecor4 = sim.evaluateCustomerDecision(luxuryPatron, false);
assert.strictEqual(decDecor3.buy, false, 'At $6.00 on Marble Bar (Decor 3), patron refuses as too pricey');
assert.strictEqual(decDecor4.buy, true, 'At $6.00 on Parisian Art-Deco Kiosk (Decor 4, +45% price tolerance), patron buys');

sim.recipe.price = 6.80; // Ultra-luxury price (Decor 4 max ~$6.31, Decor 5 max ~$7.18)
const decDecor4High = sim.evaluateCustomerDecision(luxuryPatron, false);
sim.upgrades.decor = 5;
const decDecor5 = sim.evaluateCustomerDecision(luxuryPatron, false);
assert.strictEqual(decDecor4High.buy, false, 'At $6.80 on Parisian Kiosk (Decor 4), patron refuses as too pricey');
assert.strictEqual(decDecor5.buy, true, 'At $6.80 on Imperial Pavilion (Decor 5, +65% price tolerance), patron happily buys');

console.log('✓ Terminal checkout speed, conversion, tips, and 6-tier decor price tolerance & tip bonuses verified');

// -----------------------------------------------------------------
// [Test 6] Mr. Fridge & Cryo-Freezer Spoilage Balancing
// -----------------------------------------------------------------
console.log('\n[Test 6] Mr. Fridge & Cryo-Freezer Spoilage Balancing:');
// Setup end of day scenario on a scorching hot day (32°C)
sim.weather = { type: 'scorching', temp: 32, condition: 'Scorching sun' };

// Level 1: Styrofoam Ice Box Cooler (meltRate: 1.00, milkSpoilRate: 1.00 -> 100% melts & 100% spoils!)
sim.upgrades.cooler = 1;
sim.inventory.ice = 100;
sim.inventory.milk = 100;
sim.endDay();
assert(sim.meltedIce === 100, 'Level 1 cooler must melt 100% of leftover ice');
assert(sim.spoiledMilk === 100, 'Level 1 cooler must spoil 100% of leftover milk daily');

// Level 3: Mr. Fridge Commercial Upright Cooler (meltRate: 0.15, milkSpoilTemp: 99)
sim.upgrades.cooler = 3;
sim.inventory.ice = 100;
sim.inventory.milk = 100;
sim.endDay();
assert(sim.meltedIce === 15, 'Mr. Fridge must preserve 85% of ice (only 15% melts)');
assert.strictEqual(sim.spoiledMilk, 0, 'Mr. Fridge keeps milk at 3°C: ZERO milk spoiled even at 32°C heat');

// Level 4: Luxury Dual-Zone Stainless Refrigerator (meltRate: 0.00, milkSpoilTemp: 99)
sim.upgrades.cooler = 4;
sim.inventory.ice = 100;
sim.inventory.milk = 100;
sim.endDay();
assert.strictEqual(sim.meltedIce, 0, 'Luxury Refrigerator guarantees zero ice melt');
assert.strictEqual(sim.spoiledMilk, 0, 'Luxury Refrigerator guarantees zero milk spoilage');
console.log('✓ Spoilage mitigation verified: Styrofoam melts 100% & spoils 100% milk, Mr. Fridge & Luxury Fridge prevent milk spoilage');

// -----------------------------------------------------------------
// [Test 7] Grinder & Machine Taste Quality Bonuses
// -----------------------------------------------------------------
console.log('\n[Test 7] Grinder & Machine Taste Quality Bonuses:');
const grinderList = sim.getUpgrades().grinder;
assert.strictEqual(grinderList[0].qualityBonus, 0, 'Level 1 grinder: +0% bonus');
assert.strictEqual(grinderList[1].qualityBonus, 12, 'Level 2 grinder: +12% bonus');
assert.strictEqual(grinderList[2].qualityBonus, 26, 'Level 3 grinder: +26% bonus');

const machineList = sim.getUpgrades().machine;
assert.strictEqual(machineList[0].brewTime, 2.8, 'Level 1 brew time: 2.8s');
assert.strictEqual(machineList[1].brewTime, 1.8, 'Level 2 brew time: 1.8s (35% faster)');
assert.strictEqual(machineList[2].brewTime, 1.0, 'Level 3 brew time: 1.0s (Pro Commercial fast)');
assert.strictEqual(machineList[3].brewTime, 0.5, 'Level 4 brew time: 0.5s (Flagship ultra-fast)');
assert.strictEqual(machineList[3].yieldBonus, 1, 'Level 4 brewer yields 11 cups per carafe');
console.log('✓ Grinder quality scaling and machine extraction times verified');

// -----------------------------------------------------------------
// [Test 8] DOM Structure, Cache Busters & Lemonade Tycoon CSS
// -----------------------------------------------------------------
console.log('\n[Test 8] DOM Structure, Cache Busters & Lemonade Tycoon CSS:');
const html = fs.readFileSync('index.html', 'utf8');

// Required DOM IDs for Upgrades Carousel
const requiredIds = [
    'tab_upgrades',
    'upgCarouselCounter',
    'upgCategoryPills',
    'upgradesCarousel',
    'btnUpgPrev',
    'upgCardFrame',
    'upgPortraitBox',
    'upgPortraitImg',
    'upgPortraitBadge',
    'upgCardTitle',
    'upgCategoryTag',
    'upgBtnHelp',
    'upgCardDesc',
    'upgPerksList',
    'upgPriceVal',
    'btnUpgNext',
    'upgStatusHint',
    'upgBtnBuy',
    'upgHelpPopup',
    'upgBtnHelpClose',
    'upgHelpText',
    'upgHelpSpeed',
    'upgHelpQuality',
    'upgHelpWeather',
    'upgHelpROI',
    'upgOwnedStrip',
    'standOwnedUpgrades'
];

requiredIds.forEach(id => {
    assert(html.includes(`id="${id}"`), `Missing required ID in index.html: ${id}`);
});

// Verify DOM Order of Carousel Stage: Prev Button -> Card Frame -> Next Button
const prevIdx = html.indexOf('id="btnUpgPrev"');
const cardIdx = html.indexOf('id="upgCardFrame"');
const nextIdx = html.indexOf('id="btnUpgNext"');
assert(prevIdx !== -1 && cardIdx !== -1 && nextIdx !== -1, 'All carousel flanking elements must exist');
assert(prevIdx < cardIdx && cardIdx < nextIdx, 'Carousel DOM order must strictly be: btnUpgPrev -> upgCardFrame -> btnUpgNext');

// Verify Cache Busters
assert(/style\.css\?v=\d+/.test(html), 'style.css must have cache buster');
assert(/js\/audio\.js\?v=\d+/.test(html), 'audio.js must have cache buster');
assert(/js\/sprites\.js\?v=\d+/.test(html), 'sprites.js must have cache buster');
assert(/js\/web3\.js\?v=\d+/.test(html), 'web3.js must have cache buster');
assert(/js\/simulation\.js\?v=\d+/.test(html), 'simulation.js must have cache buster');
assert(/js\/engine\.js\?v=\d+/.test(html), 'engine.js must have cache buster');
assert(/js\/editor\.js\?v=\d+/.test(html), 'editor.js must have cache buster');
assert(/js\/game\.js\?v=\d+/.test(html), 'game.js must have cache buster');

// Verify Lemonade Tycoon CSS classes in style.css
const css = fs.readFileSync('style.css', 'utf8');
const requiredCSSClasses = [
    '.upgrades-carousel-stage',
    '.upg-stage-card',
    '.upg-portrait-box',
    '.upg-portrait-img',
    '.upg-card-info-col',
    '.upg-btn-buy',
    '.upg-price-box',
    '.upg-perks-list',
    '.upg-perk-chip',
    '.upg-help-drawer',
    '.upg-cat-pill',
    '.upg-owned-badges-strip'
];
requiredCSSClasses.forEach(cls => {
    assert(css.includes(cls), `Missing Lemonade Tycoon CSS class in style.css: ${cls}`);
});
console.log('✓ Verified 27 DOM IDs, stage ordering, cache busters, and Lemonade Tycoon CSS classes');

// -----------------------------------------------------------------
// [Test 9] Stand Tab 7-Category Mini-Badges Sync & Canopy Stand Rendering
// -----------------------------------------------------------------
console.log('\n[Test 9] Stand Tab 7-Category Mini-Badges Sync & Canopy Stand Rendering:');
// 1. Stand UI update must render all 7 upgrade categories
game.updateStandPanels();
const standBadgesHtml = document.getElementById('standOwnedUpgrades').innerHTML;
const expectedCategories7 = ['grinder', 'machine', 'terminal', 'cooler', 'canopy', 'marketing', 'decor'];
expectedCategories7.forEach(cat => {
    const upgName = sim.getUpgradeItem(cat).name;
    assert(standBadgesHtml.includes(upgName), `Stand owned badges must contain active upgrade for '${cat}': ${upgName}`);
});
assert(standBadgesHtml.includes('upgrade-mini-badge'), 'Badges must have upgrade-mini-badge class');

// 2. Grinder Level 3 Bean Savings in executePurchase
sim.upgrades.grinder = 3;
sim.upgrades.machine = 1;
sim.cupsInBatch = 0;
sim.inventory.beans = 50;
sim.recipe.beans = 3;
let savedAny = false;
for (let b = 0; b < 40; b++) {
    sim.cupsInBatch = 0;
    const initialBeans = sim.inventory.beans;
    sim.executePurchase({ needed: { cups: 1, milk: 0, sugar: 0, ice: 0, syrup: 0 } });
    const used = initialBeans - sim.inventory.beans;
    if (used < 3) savedAny = true;
    sim.inventory.beans = 50;
}
assert(savedAny, 'Grinder Level 3 must occasionally save 1 scoop of coffee beans');

// 3. SpriteRenderer Canopy Verification
let canopyCallArg = null;
const mockCtx = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    fillRect() {},
    strokeRect() {},
    beginPath() {},
    ellipse() {},
    arc() {},
    fill() {},
    save() {},
    restore() {},
    moveTo() {},
    lineTo() {},
    closePath() {},
    stroke() {},
    translate() {},
    scale() {},
    rotate() {},
    drawImage() {},
    createLinearGradient() { return { addColorStop() {} }; },
    createRadialGradient() { return { addColorStop() {} }; },
    font: '',
    textAlign: '',
    fillText() {}
};
const origRenderScallopedCanopy = window.spriteRenderer.renderScallopedCanopy;
window.spriteRenderer.renderScallopedCanopy = function(ctx, x, y, w, h, canopyLvl) {
    canopyCallArg = canopyLvl;
};

// With canopy: 1 (Open Stand) -> renderScallopedCanopy should NOT be called
canopyCallArg = null;
window.spriteRenderer.renderStand(mockCtx, 100, 100, { canopy: 1, decor: 1 });
assert.strictEqual(canopyCallArg, null, 'Canopy 1 (Open Stand) must not render scalloped awning');

// With canopy: 2 (ShadeMaker 3000) -> renderScallopedCanopy should be called with 2
canopyCallArg = null;
window.spriteRenderer.renderStand(mockCtx, 100, 100, { canopy: 2, decor: 1 });
assert.strictEqual(canopyCallArg, 2, 'Canopy 2 (ShadeMaker 3000) must render scalloped awning with level 2');

// With canopy: 3 (Solar Tech Awning) -> renderScallopedCanopy should be called with 3
canopyCallArg = null;
window.spriteRenderer.renderStand(mockCtx, 100, 100, { canopy: 3, decor: 1 });
assert.strictEqual(canopyCallArg, 3, 'Canopy 3 (Solar Awning) must render scalloped awning with level 3');
window.spriteRenderer.renderScallopedCanopy = origRenderScallopedCanopy;

console.log('✓ Stand tab 7-category sync, grinder bean savings, and canopy stand rendering verified');

// -----------------------------------------------------------------
// [Test 10] Live In-Game Stand Visual Transformation (All 6 Cart Tiers 0..5 & All 7 Categories)
// -----------------------------------------------------------------
console.log('\n[Test 10] Live In-Game Stand Visual Transformation (All 6 Cart Tiers 0..5 & All 7 Categories):');
const sr = window.spriteRenderer;
for (let lvl = 0; lvl <= 5; lvl++) {
    const cartPath = `assets/cart_lvl_${lvl}.png`;
    assert(fs.existsSync(cartPath), `In-game cart sprite ${cartPath} must exist on disk`);
    const st = fs.statSync(cartPath);
    assert(st.size > 10000, `In-game cart sprite ${cartPath} must be a non-empty PNG (>10KB)`);
    // Populate mock loaded sprites for 16-bit sprite branch test
    sr.cartLevelSprites[lvl] = { id: `cart_lvl_${lvl}`, width: 400, height: 480 };
    sr.cartLevelLoaded[lvl] = true;
}
sr.cartLoaded = true;
sr.cartSpriteCanvas = sr.cartLevelSprites[1];

// Verify that in 16-bit Sprite Mode (cartLoaded=true), each decor level 0..5 draws its own distinct unified Cart+Barista sprite cleanly without extra clutter around the cart
const drawnSpritesByDecor = [];
for (let dLvl = 0; dLvl <= 5; dLvl++) {
    let drawnCartImg = null;
    let opsCount = 0;
    const recCtx = {
        ...mockCtx,
        fillRect() { opsCount++; },
        strokeRect() { opsCount++; },
        arc() { opsCount++; },
        ellipse() { opsCount++; },
        drawImage(img) {
            if (!drawnCartImg) drawnCartImg = img;
            opsCount++;
        }
    };
    sr.renderStand(recCtx, 250, 180, {
        decor: dLvl,
        machine: Math.min(4, Math.max(1, dLvl)),
        cooler: Math.min(4, Math.max(1, dLvl)),
        grinder: Math.min(3, Math.max(1, dLvl)),
        terminal: Math.min(3, Math.max(1, dLvl)),
        canopy: Math.min(3, Math.max(1, dLvl)),
        marketing: Math.min(4, Math.max(1, dLvl))
    }, false, false, false, null, 'default', false, false);
    assert.strictEqual(drawnCartImg, sr.cartLevelSprites[dLvl], `Decor Level ${dLvl} must draw cartLevelSprites[${dLvl}] in 16-bit sprite mode`);
    assert.strictEqual(opsCount, 3, `Decor Level ${dLvl} in 16-bit mode must render ONLY the 2 shadow ellipses + 1 unified Cart+Barista sprite without extra clutter (got ${opsCount})`);
    drawnSpritesByDecor.push({ dLvl, drawnCartImg, opsCount });
}

// Verify procedural mode (cartLoaded=false) also differentiates all 6 decor levels without errors
sr.cartLoaded = false;
sr.cartLevelLoaded = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false };
const procOpsByDecor = [];
for (let dLvl = 0; dLvl <= 5; dLvl++) {
    let opsCount = 0;
    const procCtx = {
        ...mockCtx,
        fillRect() { opsCount++; },
        strokeRect() { opsCount++; },
        arc() { opsCount++; },
        ellipse() { opsCount++; }
    };
    sr.renderStand(procCtx, 250, 180, { decor: dLvl, machine: 4, cooler: 4, grinder: 3, terminal: 3, canopy: 3, marketing: 4 }, false, false, false);
    procOpsByDecor.push(opsCount);
}
assert(procOpsByDecor[5] > procOpsByDecor[1], 'Procedural stand at Decor Level 5 must render more architectural detail than Decor Level 1');
console.log('✓ All 6 Cart levels (cart_lvl_0..5.png) visually transform cleanly with unified Barista and zero surrounding clutter');

console.log('\n======================================================');
console.log('✅ ALL UPGRADES CAROUSEL & BALANCING TESTS PASSED (100%)');
console.log('======================================================\n');

