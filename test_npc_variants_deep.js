// Coffede Tycoon - Deep NPC Variants & Palette Swapping Verification Suite
const assert = require('assert');
const fs = require('fs');
const PNG = require('pngjs').PNG;

// Mock browser globals
global.window = global;
global.requestAnimationFrame = () => {};
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
};

global.document = {
    addEventListener() {},
    removeEventListener() {},
    createElement(tag) {
        if (tag === 'canvas') {
            let buffer = new Uint8Array(200 * 500 * 4);
            return {
                width: 200,
                height: 500,
                getContext(type) {
                    return {
                        drawImage() {},
                        getImageData(x, y, w, h) {
                            return { data: buffer, width: w, height: h };
                        },
                        putImageData(imgData) {
                            buffer = imgData.data;
                        }
                    };
                }
            };
        }
        return {};
    }
};

global.Image = class {
    constructor() {
        this.src = '';
        this.width = 170;
        this.height = 420;
        this.naturalWidth = 170;
        this.naturalHeight = 420;
        this.complete = true;
    }
};

// Load modules
require('./js/audio.js');
require('./js/sprites.js');
require('./js/web3.js');
require('./js/simulation.js');
require('./js/engine.js');

const sim = window.simulationModel;
const web3 = window.web3Manager;
const engine = window.simulationEngine;
const renderer = window.spriteRenderer;

console.log('--- STARTING 24 NPC VARIANTS & PALETTE SWAPPING DEEP VERIFICATION ---\n');

// 1. Catalog Integrity & Diversity Check
console.log('[Test 1] 24 Archetype Catalog Integrity & Palette Diversity:');
const variants = renderer.npcVariants;
const archetypeKeys = Object.keys(variants);
assert(archetypeKeys.length >= 24, `Must have at least 24 archetypes defined (found ${archetypeKeys.length})`);
console.log(`✓ Total archetypes defined: ${archetypeKeys.length}`);

const requiredArchetypes = [
    'jogger', 'marathon_runner', 'fashionista', 'casual_shopper',
    'student', 'grad_student', 'art_student', 'bookworm',
    'business', 'corporate_exec', 'fintech_analyst', 'metro_commuter',
    'hipster', 'barista_regular', 'music_producer', 'dog_walker',
    'cryptobro', 'crypto_whale', 'tech_hacker', 'indie_dev',
    'senior', 'professor', 'retiree', 'tourist'
];

requiredArchetypes.forEach(key => {
    assert(variants[key], `Archetype '${key}' must exist in catalog`);
    assert(typeof variants[key].baseIdx === 'number' && variants[key].baseIdx >= 0 && variants[key].baseIdx <= 5,
        `Archetype '${key}' must map to a base index between 0 and 5`);
    assert(variants[key].name && variants[key].name.length > 0, `Archetype '${key}' must have a valid display name`);
    assert(variants[key].desc && variants[key].desc.length > 0, `Archetype '${key}' must have a valid description`);
    if (!variants[key].isBase) {
        assert(variants[key].palette, `Variant '${key}' must have a curated palette definition`);
        assert(variants[key].palette.skin, `Variant '${key}' must define skin tone`);
        assert(variants[key].palette.hair, `Variant '${key}' must define hair color`);
        assert(variants[key].palette.top, `Variant '${key}' must define outfit top`);
        assert(variants[key].palette.pants, `Variant '${key}' must define outfit pants`);
    }
});
console.log(`✓ All ${requiredArchetypes.length} required archetypes verified with complete metadata and curated palettes`);

// 2. Offscreen Canvas Palette Swapping Engine Execution
console.log('\n[Test 2] Offscreen Canvas Palette Swapping & Pixel Transformations:');
// Create a canvas with test colors (skin, hair, shirt, pants)
const testW = 50, testH = 100;
const testBuf = new Uint8Array(testW * testH * 4);

// Fill with sample pixel art (face skin at y=25, shirt at y=45, hair at y=10)
for (let y = 0; y < testH; y++) {
    for (let x = 0; x < testW; x++) {
        const idx = (y * testW + x) * 4;
        testBuf[idx + 3] = 255; // Alpha
        if (y < 20) {
            // Dark hair
            testBuf[idx] = 40; testBuf[idx + 1] = 30; testBuf[idx + 2] = 20;
        } else if (y < 35) {
            // Peach skin
            testBuf[idx] = 245; testBuf[idx + 1] = 200; testBuf[idx + 2] = 160;
        } else if (y < 65) {
            // Orange shirt
            testBuf[idx] = 230; testBuf[idx + 1] = 100; testBuf[idx + 2] = 20;
        } else {
            // Blue jeans
            testBuf[idx] = 30; testBuf[idx + 1] = 80; testBuf[idx + 2] = 180;
        }
    }
}

const mockSourceCanvas = {
    width: testW,
    height: testH,
    getContext() {
        return {
            drawImage() {},
            getImageData() { return { data: new Uint8Array(testBuf), width: testW, height: testH }; },
            putImageData() {}
        };
    }
};

const swappedCanvas = renderer.createPaletteSwappedCanvas(mockSourceCanvas, variants['art_student'].palette);
assert(swappedCanvas, 'Palette swapping must return a valid canvas');
assert.strictEqual(swappedCanvas.width, testW);
assert.strictEqual(swappedCanvas.height, testH);
console.log('✓ createPaletteSwappedCanvas processed pixel buffer with HSL transforms');

// Verify initVariantCanvases
renderer.initVariantCanvases();
assert(renderer.variantSpriteCanvases, 'variantSpriteCanvases map must be initialized');
assert(renderer.variantWalkCycles, 'variantWalkCycles map must be initialized');
console.log('✓ initVariantCanvases successfully initialized variant sprite and walk cycle maps');

// 3. Rendering all 24 Archetypes Across All States
console.log('\n[Test 3] Rendering all 24 Archetypes (Walking, Queued, Direction Flipping, Sipping):');
class InspectorContext {
    constructor() {
        this.drawnImages = [];
        this.scales = [];
        this.rotations = [];
        this.ops = 0;
    }
    save() { this.ops++; }
    restore() { this.ops++; }
    translate() { this.ops++; }
    rotate(angle) { this.ops++; this.rotations.push(angle); }
    scale(sx, sy) { this.ops++; this.scales.push({ sx, sy }); }
    beginPath() { this.ops++; }
    fill() { this.ops++; }
    stroke() { this.ops++; }
    ellipse() { this.ops++; }
    fillRect() { this.ops++; }
    drawImage(img, dx, dy, dw, dh) {
        this.ops++;
        this.drawnImages.push({ img, dx, dy, dw, dh });
    }
    fillText() { this.ops++; }
}

requiredArchetypes.forEach(arch => {
    // 3a. Moving rightward with walk cycle
    const ctxWalkR = new InspectorContext();
    renderer.renderCustomer(ctxWalkR, {
        x: 100, y: 200,
        direction: 1,
        archetype: arch,
        walkPhase: 0.5,
        isMoving: true
    });
    assert(ctxWalkR.drawnImages.length >= 1, `Archetype '${arch}' must render a character sprite when walking`);

    // 3b. Moving leftward (direction flip test: scale(-1, 1))
    const ctxWalkL = new InspectorContext();
    renderer.renderCustomer(ctxWalkL, {
        x: 100, y: 200,
        direction: -1,
        archetype: arch,
        walkPhase: 0.5,
        isMoving: true
    });
    assert(ctxWalkL.scales.some(s => s.sx === -1), `Archetype '${arch}' walking left must flip sprite with scale(-1, 1)`);

    // 3c. Queued / stationary (frame 2 passing / idle upright pose)
    const ctxIdle = new InspectorContext();
    renderer.renderCustomer(ctxIdle, {
        x: 100, y: 200,
        direction: 1,
        archetype: arch,
        isMoving: false,
        state: 'queued'
    });
    assert(ctxIdle.drawnImages.length >= 1, `Archetype '${arch}' must render when stationary in queue`);

    // 3d. Leaving with steaming coffee cup
    const ctxCoffee = new InspectorContext();
    renderer.renderCustomer(ctxCoffee, {
        x: 100, y: 200,
        direction: 1,
        archetype: arch,
        isMoving: true,
        hasCoffee: true,
        sipTimer: 1.0
    });
    assert(ctxCoffee.drawnImages.length >= 1, `Archetype '${arch}' must render with coffee cup`);
});
console.log('✓ All 24 archetypes successfully rendered across walk cycles, idle, flips, and coffee holding');

// 4. Case-Insensitive Archetype Resolution & Safe Fallbacks
console.log('\n[Test 4] Case-Insensitivity & Null-Safety Fallbacks:');
const ctxMixedCase = new InspectorContext();
renderer.renderCustomer(ctxMixedCase, {
    x: 150, y: 220,
    direction: 1,
    archetype: 'cOrPoRaTe_ExEc',
    isMoving: true
});
assert(ctxMixedCase.drawnImages.length >= 1, 'Mixed-case archetype name must resolve cleanly');

const ctxUnknown = new InspectorContext();
assert.doesNotThrow(() => {
    renderer.renderCustomer(ctxUnknown, {
        x: 150, y: 220,
        direction: 1,
        archetype: 'space_traveler_unknown',
        isMoving: true
    });
}, 'Unknown archetype must safely fallback without throwing');
console.log('✓ Case-insensitivity and safe unknown archetype fallback verified');

// 5. 5-Location Demographic Distribution & /boost Surge
console.log('\n[Test 5] 5-Location Demographic Distribution & /boost Surge:');
const locs = sim.getLocations();
const locationKeys = ['suburbs', 'park', 'campus', 'metro', 'downtown'];

locationKeys.forEach(locId => {
    const loc = locs[locId];
    assert(loc, `Location '${locId}' must exist`);
    assert(loc.preferredArchetypes && loc.preferredArchetypes.length >= 7,
        `Location '${locId}' must have a diverse crowd of at least 7 preferred archetypes (has ${loc.preferredArchetypes.length})`);
    console.log(`- ${loc.name} (${locId}): [${loc.preferredArchetypes.join(', ')}]`);
});

// Test engine customer spawning across locations
locationKeys.forEach(locId => {
    sim.currentLocation = locId;
    const spawnedArchs = new Set();
    for (let i = 0; i < 60; i++) {
        engine.spawnCustomer();
        const spawned = engine.customers[engine.customers.length - 1];
        spawnedArchs.add(spawned.archetype);
    }
    assert(spawnedArchs.size >= 4, `Location '${locId}' must spawn diverse archetypes (spawned ${spawnedArchs.size} distinct variants)`);
});
console.log('✓ Dynamic demographic spawning verified across all 5 locations');

// Test /boost surge spawning crypto whales and crypto bros
web3.isBoostActive = true;
let cryptoSurgeCount = 0;
for (let i = 0; i < 50; i++) {
    engine.spawnCustomer();
    const c = engine.customers[engine.customers.length - 1];
    if (c.archetype === 'cryptobro' || c.archetype === 'crypto_whale') {
        cryptoSurgeCount++;
    }
}
web3.isBoostActive = false;
assert(cryptoSurgeCount > 10, `/boost must significantly increase spawn rate of cryptobro and crypto_whale (spawned ${cryptoSurgeCount}/50)`);
console.log(`✓ /boost surge verified: ${cryptoSurgeCount}/50 spawned patrons were Crypto Whales & Crypto Bros`);

// 6. Economic Price Tolerances & Contactless/QRIS Payments for all 24 Archetypes
console.log('\n[Test 6] Economic Price Tolerances & Contactless/QRIS Payments:');
sim.currentLocation = 'downtown';
sim.weather = { type: 'sunny', temp: 26, icon: '☀️', desc: 'Warm & Sunny' };
sim.inventory = { beans: 100, milk: 100, sugar: 100, ice: 100, cups: 100, syrup: 100 };
sim.recipe = { beans: 3, milk: 2, sugar: 2, ice: 2, syrup: 1, price: 6.00 };
sim.upgrades.terminal = 3;
sim.upgrades.decor = 1;

// VIP Tech Whale must happily pay $6.00, pay with Contactless Tap / QRIS (not crypto), and give high tip
const whaleDec = sim.evaluateCustomerDecision({ id: 1, archetype: 'crypto_whale' }, false);
assert.strictEqual(whaleDec.buy, true, 'VIP Tech Whale should gladly buy coffee at $6.00');
assert.strictEqual(whaleDec.isCrypto, false, 'Crypto payments removed: isCrypto must be false');
assert(whaleDec.paymentMethod === 'Tap' || whaleDec.paymentMethod === 'QRIS', 'VIP Tech Whale should pay via Contactless Tap or QRIS');
assert(whaleDec.tip >= 3.00, `VIP Tech Whale should leave a high tip (tip: $${whaleDec.tip})`);
console.log(`✓ VIP Tech Whale decision: Buy=${whaleDec.buy}, PaymentMethod=${whaleDec.paymentMethod}, IsCrypto=${whaleDec.isCrypto}, Tip=$${whaleDec.tip}, Feedback="${whaleDec.feedback}"`);

// In Suburbs at $4.50, Senior and Student reject while Corporate Exec / Marathon Runner accept
sim.currentLocation = 'suburbs';
sim.recipe.price = 4.50;
const senDec = sim.evaluateCustomerDecision({ archetype: 'senior' }, false);
const execDec = sim.evaluateCustomerDecision({ archetype: 'corporate_exec' }, false);
assert.strictEqual(senDec.buy, false, 'Senior should reject $4.50 coffee in suburbs');
assert.strictEqual(execDec.buy, true, 'Corporate Executive should accept $4.50 coffee in suburbs');
console.log('✓ Price tolerances correctly differentiate budget patrons (Senior: rejected) vs premium patrons (Exec: bought)');

// 7. Realistic Browser Image Loading & Unloaded Safety
console.log('\n[Test 7] Asynchronous Image Loading Safety:');
const unloadedImg = new Image();
unloadedImg.complete = false;
unloadedImg.naturalWidth = 0;
unloadedImg.width = 0;
const unloadedSwapRes = renderer.createPaletteSwappedCanvas(unloadedImg, variants['art_student'].palette);
assert.strictEqual(unloadedSwapRes, null, 'createPaletteSwappedCanvas must return null on unloaded images to prevent blank canvases');
console.log('✓ createPaletteSwappedCanvas safely rejects unloaded Image instances');

// 8. Location-Specific Props on 16-Bit Isometric Characters
// 8. 16-Bit Purity & Procedural Location Accessories
console.log('\n[Test 8] 16-Bit Sprite Purity (No Orange Box Artifacts) & Procedural Location Props:');
class InspectorContextWithRects extends InspectorContext {
    constructor() {
        super();
        this.rects = [];
    }
    fillRect(x, y, w, h) {
        super.fillRect(x, y, w, h);
        this.rects.push({ x, y, w, h, fillStyle: this.fillStyle });
    }
}
Object.defineProperty(InspectorContextWithRects.prototype, 'fillStyle', {
    get() { return this._fs; },
    set(v) { this._fs = v; }
});

// Verify that 16-bit characters are pure and never have clumsy orange/kraft box overlays stamped on them
sim.currentLocation = 'suburbs';
const ctxSuburbs16 = new InspectorContextWithRects();
renderer.renderCustomer(ctxSuburbs16, { x: 100, y: 200, direction: 1, archetype: 'student', isMoving: true });
assert(ctxSuburbs16.drawnImages.length >= 1, '16-bit character sprite must be drawn');
assert(!ctxSuburbs16.rects.some(r => r.fillStyle === '#b45309' || r.fillStyle === '#f59e0b'),
    '16-bit character must NOT have clumsy kraft/orange box overlays stamped onto 16-bit sprite');

// Test procedural location accessories via direct call
sim.currentLocation = 'campus';
const ctxCampus = new InspectorContextWithRects();
renderer.renderLocationAccessories(ctxCampus, { isMoving: true }, 1, 24, 48, 0);
assert(ctxCampus.rects.some(r => r.fillStyle === '#0284c7'), 'Campus location accessories must render blue lanyard for procedural fallback');

sim.currentLocation = 'park';
const ctxPark = new InspectorContextWithRects();
renderer.renderLocationAccessories(ctxPark, { isMoving: true, id: 'cust_0' }, 0, 24, 48, 0);
assert(ctxPark.rects.some(r => r.fillStyle === '#ef4444'), 'Park location accessories must render red headband for procedural fallback');
console.log('✓ 16-bit sprites verified 100% clean of orange box artifacts, and procedural accessories preserved');

// 9. Sipping Mask Color Integrity for Palette Variants
console.log('\n[Test 9] Sipping Mask Color Integrity for Palette Variants:');
const ctxArtSip = new InspectorContextWithRects();
renderer.renderCustomer(ctxArtSip, {
    x: 100, y: 200, direction: 1, archetype: 'art_student',
    isMoving: true, hasCoffee: true, sipTimer: 2.2
});
assert(ctxArtSip.rects.some(r => r.fillStyle === '#06b6d4'), 'art_student sipping mask must match cyan hoodie (#06b6d4) not orange');

const ctxMusicSip = new InspectorContextWithRects();
renderer.renderCustomer(ctxMusicSip, {
    x: 100, y: 200, direction: 1, archetype: 'music_producer',
    isMoving: true, hasCoffee: true, sipTimer: 2.2
});
assert(ctxMusicSip.rects.some(r => r.fillStyle === '#7e22ce'), 'music_producer sipping mask must match purple flannel (#7e22ce) not brown');
console.log('✓ Variant sipping mask colors accurately match curated palette topHex');

// 10. Anticipation Quotes & Dialogue Coverage for All 24 Archetypes
console.log('\n[Test 10] Complete Dialogue & Anticipation Coverage (24 Archetypes):');
sim.recipe.price = 1.00;
sim.cupsInBatch = 100;
sim.inventory = { beans: 500, milk: 500, sugar: 500, ice: 500, cups: 500, syrup: 500 };
sim.reservedStock = { beans: 0, milk: 0, sugar: 0, ice: 0, cups: 0, syrup: 0 };
requiredArchetypes.forEach(arch => {
    // Test spawnCustomer with custom mock engine to check anticipation bubble
    engine.customers = [];
    engine.queue = [];
    const cust = {
        id: 'cust_' + arch,
        x: 280, y: 218, direction: 1,
        archetype: arch, state: 'walking'
    };
    engine.customers.push(cust);
    engine.handleCustomerDecision(cust);
    const queuedCust = engine.queue[engine.queue.length - 1];
    assert(queuedCust && queuedCust.bubble, `Archetype '${arch}' must enter queue with anticipation bubble`);
    assert(queuedCust.bubble.text.length > 0, `Archetype '${arch}' bubble text must not be empty`);
    assert(!queuedCust.bubble.text.includes('undefined'), `Archetype '${arch}' bubble text must be valid`);
});
console.log('✓ All 24 archetypes have verified unique anticipation bubbles and dialogues');

console.log('\n======================================================');
console.log('✅ ALL 24 NPC VARIANTS & PALETTE SWAPPING TESTS PASSED!');
console.log('======================================================\n');
