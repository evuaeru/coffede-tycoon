// Verification Test for Lemonade Tycoon Locations Carousel Navigation
const assert = require('assert');
const fs = require('fs');

console.log('--- STARTING LOCATIONS CAROUSEL VERIFICATION ---');

// Mock browser globals
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
                style: {},
                classList: {
                    _classes: new Set(),
                    add(c) { this._classes.add(c); },
                    remove(c) { this._classes.delete(c); },
                    toggle(c, v) { if (v) this._classes.add(c); else this._classes.delete(c); },
                    contains(c) { return this._classes.has(c); }
                },
                addEventListener: () => {},
                setAttribute: () => {},
                getAttribute: () => null,
                querySelectorAll: () => []
            };
        }
        return this._elements[id];
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
const locs = sim.getLocations();
const keys = Object.keys(locs);

assert.strictEqual(keys.length, 20, 'Catalog must contain 20 locations');

// [Test 1] Initial Rendering & Auto-Focus on Current Stand
console.log('\n[Test 1] Initial Rendering & Auto-Focus on Current Stand:');
sim.currentLocation = 'suburbs';
sim.prepaidRentLocation = 'suburbs';
sim.paidLocationRentForDay = sim.dayNumber;
game.switchTab('locations');
assert.strictEqual(game.selectedLocationIndex, keys.indexOf('suburbs'), 'Must auto-focus player current location');

const titleEl = document.getElementById('locCardTitle');
assert.strictEqual(titleEl.textContent, locs['suburbs'].name, 'Title matches current location');

const rentBtn = document.getElementById('locBtnRent');
assert(rentBtn.disabled, 'Rent button must be disabled for current rented stand');
assert(rentBtn.classList.contains('btn-rent-active'), 'Rent button has active badge class');
console.log('✓ Initial location focus verified on current stand:', locs['suburbs'].name);

// [Test 2] Navigation Next (>) with Wrap-Around
console.log('\n[Test 2] Navigation Next (>) with Wrap-Around:');
const startIdx = game.selectedLocationIndex;
game.navigateLocation(1);
assert.strictEqual(game.selectedLocationIndex, (startIdx + 1) % keys.length, 'Next navigates forward');

// Jump to last and wrap
game.selectedLocationIndex = 19;
game.navigateLocation(1);
assert.strictEqual(game.selectedLocationIndex, 0, 'Wraps from 19 to 0');
console.log('✓ Forward navigation and wrap-around verified');

// [Test 3] Navigation Prev (<) with Wrap-Around
console.log('\n[Test 3] Navigation Prev (<) with Wrap-Around:');
game.selectedLocationIndex = 0;
game.navigateLocation(-1);
assert.strictEqual(game.selectedLocationIndex, 19, 'Wraps from 0 to 19');
game.navigateLocation(-1);
assert.strictEqual(game.selectedLocationIndex, 18, 'Prev navigates backward');
console.log('✓ Backward navigation and wrap-around verified');

// [Test 4] Tier Jump Pills
console.log('\n[Test 4] Tier Quick-Jump Pills:');
game.jumpToLocationTier('1');
assert.strictEqual(game.selectedLocationIndex, 0, 'Tier 1 jumps to index 0 (cul_de_sac)');

game.jumpToLocationTier('2');
assert.strictEqual(game.selectedLocationIndex, 4, 'Tier 2 jumps to index 4 (lake_marina)');

game.jumpToLocationTier('3');
assert.strictEqual(game.selectedLocationIndex, 8, 'Tier 3 jumps to index 8 (beach_boardwalk)');

game.jumpToLocationTier('4');
assert.strictEqual(game.selectedLocationIndex, 12, 'Tier 4 jumps to index 12 (amusement_pier)');

game.jumpToLocationTier('5');
assert.strictEqual(game.selectedLocationIndex, 16, 'Tier 5 jumps to index 16 (metro)');
console.log('✓ Tier quick-jump pills verified across all 5 tiers');

// [Test 5] Moving Stand via Rent Button (Upfront Rent Check)
console.log('\n[Test 5] Moving Stand via Rent Button (Upfront Rent Check):');
global.alert = () => {};
game.selectedLocationIndex = 8; // beach_boardwalk ($55 rent)
sim.cash = 40.00;
game.handleLocationRent();
assert.notStrictEqual(sim.currentLocation, 'beach_boardwalk', 'Must block renting beach_boardwalk when cash < $55');

sim.cash = 500.00;
game.handleLocationRent();
assert.strictEqual(sim.currentLocation, 'beach_boardwalk', 'Stand location moved to beach_boardwalk once cash >= $55');
assert.strictEqual(sim.cash, 445.00, 'Upfront rent ($55) deducted immediately');
assert(rentBtn.disabled, 'Rent button is now disabled after renting');
console.log('✓ Upfront renting and cart relocation verified for location:', sim.currentLocation);

// [Test 6] CSS Layout, Flex Sizing & Collision Prevention
console.log('\n[Test 6] CSS Layout, Flex Sizing & Collision Prevention:');
const css = fs.readFileSync('style.css', 'utf8');
assert(css.includes('.locations-carousel-stage {'), 'Missing .locations-carousel-stage');
assert(css.includes('gap: 16px;'), 'Missing gap: 16px in stage');
assert(css.includes('z-index: 2;'), 'Missing z-index: 2 on .loc-nav-btn');
assert(css.includes('.loc-stage-card {'), 'Missing .loc-stage-card');
assert(css.includes('overflow: hidden;'), 'Missing overflow: hidden on .loc-stage-card');
assert(css.includes('min-width: 0;'), 'Missing min-width: 0 on .loc-stage-card and info column');
assert(css.includes('flex: 0 0 250px;'), 'Portrait must have fixed flex-basis: 250px');
assert(!css.includes('.location-portrait-box {\n    position: relative;\n    width: 100%;'), 'Portrait box base class must NOT force width 100%');
assert(css.includes('hyphens: none;'), 'Title must have hyphens: none');
assert(css.includes('word-break: normal;'), 'Title must have word-break: normal');
console.log('✓ Carousel flex sizing, 250px portrait constraint, and overflow safeguards verified');

// [Test 7] DOM Structure & Cache Busters
console.log('\n[Test 7] DOM Structure & Cache Busters:');
const html = fs.readFileSync('index.html', 'utf8');
const prevIdx = html.indexOf('id="btnLocPrev"');
const cardIdx = html.indexOf('id="locCardFrame"');
const nextIdx = html.indexOf('id="btnLocNext"');
assert(prevIdx !== -1 && cardIdx !== -1 && nextIdx !== -1, 'All carousel elements present');
assert(prevIdx < cardIdx && cardIdx < nextIdx, 'Carousel DOM order must be: btnLocPrev -> locCardFrame -> btnLocNext');
assert(/style\.css\?v=\d+/.test(html), 'Cache buster present on style.css');
assert(/js\/game\.js\?v=\d+/.test(html), 'Cache buster present on game.js');
console.log('✓ DOM flank structure and cache busters verified');

console.log('\n======================================================');
console.log('✅ ALL LOCATIONS CAROUSEL TESTS PASSED WITH 100% SUCCESS!');
console.log('======================================================\n');

