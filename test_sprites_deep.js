// Comprehensive verification test suite for SpriteRenderer
const assert = require('assert');

// Mock browser globals
global.window = global;
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
};
global.requestAnimationFrame = () => {};

require('./js/sprites.js');
require('./js/web3.js');
require('./js/simulation.js');
require('./js/engine.js');

console.log('--- STARTING HIGH-PIXEL SPRITERENDERER DEEP VERIFICATION ---');

// Mock 2D Canvas Context
class MockCanvasContext {
    constructor() {
        this.ops = 0;
        this.fillStyle = '#000000';
        this.strokeStyle = '#000000';
        this.lineWidth = 1;
        this.font = '10px sans-serif';
        this.textAlign = 'left';
        this.imageSmoothingEnabled = true;
    }

    createLinearGradient() {
        return {
            addColorStop: () => {}
        };
    }

    createRadialGradient() {
        return {
            addColorStop: () => {}
        };
    }

    fillRect(x, y, w, h) {
        this.ops++;
        assert(!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h), `fillRect received NaN: ${x}, ${y}, ${w}, ${h}`);
    }

    strokeRect(x, y, w, h) {
        this.ops++;
        assert(!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h), `strokeRect received NaN: ${x}, ${y}, ${w}, ${h}`);
    }

    clearRect(x, y, w, h) {
        this.ops++;
    }

    beginPath() { this.ops++; }
    closePath() { this.ops++; }
    moveTo(x, y) {
        this.ops++;
        assert(!isNaN(x) && !isNaN(y), `moveTo received NaN: ${x}, ${y}`);
    }
    lineTo(x, y) {
        this.ops++;
        assert(!isNaN(x) && !isNaN(y), `lineTo received NaN: ${x}, ${y}`);
    }
    arc(x, y, r, sa, ea) {
        this.ops++;
        assert(!isNaN(x) && !isNaN(y) && !isNaN(r), `arc received NaN: ${x}, ${y}, ${r}`);
    }
    ellipse(x, y, rx, ry, rot, sa, ea) {
        this.ops++;
        assert(!isNaN(x) && !isNaN(y) && !isNaN(rx) && !isNaN(ry), `ellipse received NaN: ${x}, ${y}, ${rx}, ${ry}`);
    }
    fill() { this.ops++; }
    stroke() { this.ops++; }
    save() { this.ops++; }
    restore() { this.ops++; }
    translate(x, y) {
        this.ops++;
        assert(!isNaN(x) && !isNaN(y), `translate received NaN: ${x}, ${y}`);
    }
    scale(sx, sy) {
        this.ops++;
        assert(!isNaN(sx) && !isNaN(sy), `scale received NaN: ${sx}, ${sy}`);
    }
    rotate(a) {
        this.ops++;
        assert(!isNaN(a), `rotate received NaN: ${a}`);
    }
    fillText(text, x, y) {
        this.ops++;
        assert(!isNaN(x) && !isNaN(y), `fillText received NaN: ${x}, ${y}`);
    }
}

const renderer = window.spriteRenderer;
assert(renderer, 'SpriteRenderer must be instantiated');

// TEST 1: Particle Updates
console.log('\n[Test 1] Particle & Physics Simulation Ticker:');
for (let f = 0; f < 60; f++) {
    renderer.update(1 / 60);
}
renderer.triggerBoostConfetti(640, 360);
renderer.addFloatingText(300, 150, '+3.5 USDC 🚀', '#00ffcc', 13);
renderer.update(0.1);
assert(renderer.confettiParticles.length > 0, 'Confetti particles should be active after boost trigger');
assert(renderer.floatingTexts.length > 0, 'Floating text should be active after addFloatingText');
console.log(`✓ Particle engine active: ${renderer.confettiParticles.length} confetti, ${renderer.steamParticles.length} steam, ${renderer.floatingTexts.length} floating texts`);

// TEST 2: Environment Backdrops Across All 5 Locations
console.log('\n[Test 2] Environment Backdrop Rendering (All 5 Locations):');
const locations = ['suburbs', 'park', 'campus', 'downtown', 'metro'];
const weathers = [
    { type: 'sunny' },
    { type: 'rainy' },
    { type: 'freezing' },
    { type: 'scorching' }
];

locations.forEach(loc => {
    weathers.forEach(weather => {
        [0.1, 0.5, 0.9].forEach(timeProgress => {
            const ctx = new MockCanvasContext();
            renderer.renderBackground(ctx, 640, 360, loc, weather, timeProgress);
            assert(ctx.ops > 100, `Location ${loc} under ${weather.type} at ${timeProgress} should render rich pixel details (got ${ctx.ops} ops)`);
        });
    });
    console.log(`✓ Location '${loc}' rendered successfully across all weather & time variations`);
});

// TEST 3: Hero Coffee Stand Across All Upgrade Tiers
console.log('\n[Test 3] Hero Coffee Stand & Equipment (All Upgrade Combinations):');
for (let machine = 1; machine <= 4; machine++) {
    for (let decor = 1; decor <= 5; decor++) {
        const upgrades = {
            machine,
            decor,
            grinder: Math.min(3, machine),
            cooler: Math.min(4, machine),
            terminal: Math.min(3, machine),
            marketing: 2
        };

        // Test idle, brewing, pouring, and boost aura
        const ctxIdle = new MockCanvasContext();
        renderer.renderStand(ctxIdle, 260, 160, upgrades, false, false, false);
        assert(ctxIdle.ops > 150, `Stand machine=${machine} decor=${decor} should have high detail`);

        const ctxBrewing = new MockCanvasContext();
        renderer.renderStand(ctxBrewing, 260, 160, upgrades, true, false, false);

        const ctxPouring = new MockCanvasContext();
        renderer.renderStand(ctxPouring, 260, 160, upgrades, false, true, false);

        const ctxBoosted = new MockCanvasContext();
        renderer.renderStand(ctxBoosted, 260, 160, upgrades, false, false, true);
    }
}
console.log('✓ All stand upgrade tiers (Moka to Flagship) and barista animations verified');

// TEST 4: Pedestrian Sprites Across All 6 Archetypes & States
console.log('\n[Test 4] Pedestrians & Characters (All 6 Archetypes):');
const archetypes = ['student', 'business', 'jogger', 'cryptobro', 'hipster', 'senior'];
archetypes.forEach(arch => {
    // Walking
    const custWalk = {
        x: 200,
        y: 245,
        direction: 1,
        archetype: arch,
        skinColor: '#f5cba7',
        animFrame: 1.5,
        state: 'walking',
        hasCoffee: false,
        bubble: null
    };
    const ctxWalk = new MockCanvasContext();
    renderer.renderCustomer(ctxWalk, custWalk);
    assert(ctxWalk.ops >= 18, `Pedestrian ${arch} walk should draw (got ${ctxWalk.ops})`);

    // Served with steaming coffee & happy bubble
    const custServed = {
        x: 320,
        y: 250,
        direction: -1,
        archetype: arch,
        skinColor: '#f8c471',
        animFrame: 0.5,
        state: 'leaving',
        hasCoffee: true,
        bubble: { text: 'Masterpiece! 🌟', color: '#27ae60', width: 75 },
        bubbleTimer: 1.2,
        bubbleMaxTimer: 1.5
    };
    const ctxServed = new MockCanvasContext();
    renderer.renderCustomer(ctxServed, custServed);
    assert(ctxServed.ops > 25, `Pedestrian ${arch} served should draw with coffee and bubble`);
});
console.log('✓ All 6 pedestrian archetypes rendered in walk cycles and with steaming coffee');

// TEST 5: Weather Effects & UI Overlays
console.log('\n[Test 5] Weather Overlays & UI Overlays:');
weathers.forEach(w => {
    const ctx = new MockCanvasContext();
    renderer.renderWeatherEffects(ctx, 640, 360, w);
    assert(ctx.ops > 0, `Weather overlay ${w.type} should render ops`);
});

const ctxUI = new MockCanvasContext();
renderer.renderUIOverlays(ctxUI);
assert(ctxUI.ops > 0, 'UI Overlays should render active particles');
console.log('✓ Weather overlays (rain streaks, snowflakes, sunbeams) & UI overlays verified');

// TEST 6: Stand Counter HUD
console.log('\n[Test 6] Stand Counter HUD:');
const ctxHUD = new MockCanvasContext();
renderer.renderStandHUD(ctxHUD, 260, 160, 4, 12.5);
assert(ctxHUD.ops > 10, 'Stand HUD should render badge with cups and tips');
console.log('✓ Stand HUD badge verified');

// TEST 7: Garden Hedges Rendering (Suburbs, Park, Campus)
console.log('\n[Test 7] Lush Garden Hedges Verification:');
const ctxHedge = new MockCanvasContext();
renderer.drawGardenHedge(ctxHedge, 50, 100, 80, 12);
assert(ctxHedge.ops >= 15, `Garden hedge must render detailed leaves and berries (got ${ctxHedge.ops} ops)`);
console.log('✓ Garden hedge rendering verified with multi-toned foliage and berries');

// TEST 8: Patrons with Varied Accessories (Backpack, Sunglasses, Scarf) & Emotion Icons
console.log('\n[Test 8] Patrons Varied Accessories & Retro Pixel Emotion Icons:');
const testAccessories = ['backpack', 'sunglasses', 'scarf', 'headphones', 'briefcase', 'beanie', 'cane', 'laser_eyes'];
testAccessories.forEach(acc => {
    const cust = {
        x: 180,
        y: 240,
        direction: 1,
        archetype: 'student',
        accessory: acc,
        skinColor: '#f5cba7',
        animFrame: 1.0,
        state: 'walking'
    };
    const ctxAcc = new MockCanvasContext();
    renderer.renderCustomer(ctxAcc, cust);
    assert(ctxAcc.ops >= 18, `Accessory ${acc} should draw with customer (got ${ctxAcc.ops})`);
});
console.log(`✓ All ${testAccessories.length} accessories verified (backpacks, sunglasses, scarves, etc.)`);

// Emotion bubble pixel icons
const testEmotions = [
    { text: 'Masterpiece! 🌟', expectedIcon: 'star' },
    { text: 'Love it! ❤️', expectedIcon: 'heart' },
    { text: 'Coffee please! ☕', expectedIcon: 'steam_cup' },
    { text: 'Paid 3.5 USDC! 🪙', expectedIcon: 'coin' },
    { text: 'Moon boost! 🚀', expectedIcon: 'rocket' },
    { text: 'Sold out?! 😭', expectedIcon: 'sad' }
];

testEmotions.forEach(emo => {
    const detected = renderer.detectBubbleIcon(emo.text);
    assert.strictEqual(detected, emo.expectedIcon, `Expected icon '${emo.expectedIcon}' for text '${emo.text}', got '${detected}'`);
    const ctxBubble = new MockCanvasContext();
    renderer.renderHighPixelBubble(ctxBubble, 100, 100, { text: emo.text, width: 75 }, 1.0, 1.3);
    assert(ctxBubble.ops > 15, `Emotion bubble '${emo.text}' should render icon and text`);
});
console.log('✓ All 6 distinct pixel art emotion icons (star, heart, steam cup, coin, rocket, sad) verified');

// TEST 9: Dynamic Stand Chalkboard Price
console.log('\n[Test 9] Hero Coffee Stand Dynamic Chalkboard Price:');
const simModel = window.simulationModel;
simModel.recipe.price = 3.75;
let foundPrice = false;
const ctxPrice = new MockCanvasContext();
const origFillText = ctxPrice.fillText.bind(ctxPrice);
ctxPrice.fillText = function(text, x, y) {
    if (typeof text === 'string' && text.includes('$3.75 ☕')) {
        foundPrice = true;
    }
    origFillText(text, x, y);
};
renderer.renderStand(ctxPrice, 260, 160, { marketing: 1 }, false, false, false);
assert(foundPrice, 'Stand chalkboard menu must dynamically display active recipe price $3.75');
console.log('✓ Dynamic chalkboard price reflects changed player recipe ($3.75 ☕)');

// TEST 10: Seasonal & Weather Specific Visuals (Puddles & Snow)
console.log('\n[Test 10] Seasonal & Weather Atmosphere (Rain Reflections & Freezing Snow):');
const ctxRain = new MockCanvasContext();
renderer.renderStreetInfrastructure(ctxRain, 640, 360, 223, { type: 'rainy' });
assert(ctxRain.ops > 100, 'Rainy infrastructure should render puddles and reflections');

const ctxSnowStand = new MockCanvasContext();
renderer.renderStand(ctxSnowStand, 260, 160, { decor: 2 }, false, false, false, { type: 'freezing' });
assert(ctxSnowStand.ops > 120, 'Freezing stand should render snow dusting on counter and awning');
console.log('✓ Rain puddle reflections and freezing snow dusting verified');

// TEST 11: 16-Bit Isometric Cart & NPC Sprites Processing & Rendering
console.log('\n[Test 11] 16-Bit Isometric Cart & NPC Sprites Processing & Rendering:');
try {
    const fs = require('fs');
    const jpeg = require('jpeg-js');

    function createMockOffscreenCanvas(w, h, initialData) {
        let buffer = initialData ? new Uint8Array(initialData) : new Uint8Array(w * h * 4);
        return {
            width: w,
            height: h,
            getContext(type) {
                return {
                    drawImage() {},
                    getImageData(x, y, w, h) { return { data: buffer, width: w, height: h }; },
                    putImageData(imgData) { buffer = imgData.data; }
                };
            }
        };
    }

    const cartRaw = jpeg.decode(fs.readFileSync('assets/coffee_cart.jpg'), { useTArray: true });
    global.document = {
        createElement: (tag) => createMockOffscreenCanvas(cartRaw.width, cartRaw.height, cartRaw.data)
    };
    renderer.processCartSprite({ width: cartRaw.width, height: cartRaw.height });
    assert(renderer.cartLoaded, 'Cart sprite should be marked as loaded');
    assert(renderer.cartSpriteCanvas && renderer.cartSpriteCanvas.width > 0 && renderer.cartSpriteCanvas.height > 0, 'Cart canvas should have valid dimensions');
    console.log(`✓ 16-bit cart sprite chroma-keyed & cropped to ${renderer.cartSpriteCanvas.width}x${renderer.cartSpriteCanvas.height}`);

    const npcRaw = jpeg.decode(fs.readFileSync('assets/npc_sprites.jpg'), { useTArray: true });
    global.document.createElement = (tag) => createMockOffscreenCanvas(npcRaw.width, npcRaw.height, npcRaw.data);
    renderer.processNpcSprites({ width: npcRaw.width, height: npcRaw.height });
    assert(renderer.npcsLoaded, 'NPC sprites should be marked as loaded');
    assert.strictEqual(renderer.npcSpriteCanvases.length, 6, 'Should extract exactly 6 distinct NPC sprites');
    renderer.npcSpriteCanvases.forEach((c, idx) => {
        assert(c.width > 0 && c.height > 0, `NPC ${idx} must have positive dimensions`);
    });
    console.log('✓ 16-bit NPC spritesheet segmented into 6 distinct character canvases');

    class MockContextWithDrawImage extends MockCanvasContext {
        constructor() {
            super();
            this.drawnImages = [];
            this.texts = [];
        }
        drawImage(img, dx, dy, dw, dh) {
            this.ops++;
            this.drawnImages.push({ img, dx, dy, dw, dh });
        }
        fillText(text, x, y) {
            super.fillText(text, x, y);
            this.texts.push(text);
        }
    }

    // Verify 16-Bit Cart Render with Dynamic Chalkboard, Steam & Live HUD Badge
    const ctxSpriteStand = new MockContextWithDrawImage();
    window.simulationModel.cupsInBatch = 4;
    renderer.renderStand(ctxSpriteStand, 220, 155, {}, false, false, false);
    assert(ctxSpriteStand.drawnImages.length >= 1, 'Cart sprite drawImage should be called');
    assert(ctxSpriteStand.texts.some(t => t.includes('☕')), 'Dynamic chalkboard price must be rendered on 16-bit cart');
    assert(ctxSpriteStand.texts.some(t => t.includes('cups')), 'Live HUD badge (cups in batch) must be rendered on 16-bit cart');
    console.log('✓ 16-bit isometric cart rendered with steam particles, dynamic chalkboard price, and live HUD badge');

    // Verify 16-Bit NPC Characters Render with Flip, Bob & Accessories
    const testNpcArchetypes = ['student', 'business', 'jogger', 'cryptobro', 'hipster', 'senior'];
    testNpcArchetypes.forEach(arch => {
        const ctxNpcSprite = new MockContextWithDrawImage();
        renderer.renderCustomer(ctxNpcSprite, {
            x: 200,
            y: 220,
            direction: -1,
            archetype: arch,
            animFrame: 1.0,
            state: 'walking',
            hasCoffee: true
        });
        assert(ctxNpcSprite.drawnImages.length >= 1, `NPC archetype ${arch} must draw character sprite`);
    });
    console.log('✓ All 6 16-bit character archetypes rendered with smooth walk cycle & coffee cups');

    // Deep Edge Cases Verification
    // 1. Null / undefined customer safety
    assert.doesNotThrow(() => {
        renderer.renderCustomer(new MockContextWithDrawImage(), null);
        renderer.renderCustomer(new MockContextWithDrawImage(), undefined);
    }, 'renderCustomer must handle null/undefined safely');

    // 2. Customer type mapping (customer.type as well as customer.archetype)
    let drawnNpcId = -1;
    const ctxTypeCheck = {
        save() {}, restore() {}, translate() {}, scale() {},
        beginPath() {}, fill() {}, ellipse() {}, stroke() {}, fillRect() {},
        drawImage(img) { drawnNpcId = renderer.npcSpriteCanvases.indexOf(img); }
    };
    renderer.renderCustomer(ctxTypeCheck, { type: 'business', id: 7, state: 'walking' });
    assert.strictEqual(drawnNpcId, 2, 'Customer with type="business" must map to business sprite (index 2)');

    // 3. String direction parsing ('left' vs 'right')
    let scaleXUsed = 1;
    const ctxDirCheck = {
        save() {}, restore() {}, translate() {},
        scale(sx, sy) { scaleXUsed = sx; },
        beginPath() {}, fill() {}, ellipse() {}, stroke() {}, fillRect() {},
        drawImage() {}
    };
    renderer.renderCustomer(ctxDirCheck, { direction: 'left', state: 'walking' });
    assert.strictEqual(scaleXUsed, -1, 'String direction "left" must flip customer sprite with scale(-1, 1)');

    // 4. Smooth walk bobbing with explicit walkCycle
    let drawnSpriteY = 0;
    const ctxBobCheck = {
        save() {}, restore() {}, translate() {}, scale() {},
        beginPath() {}, fill() {}, ellipse() {}, stroke() {}, fillRect() {},
        drawImage(img, dx, dy) { drawnSpriteY = dy; }
    };
    renderer.renderCustomer(ctxBobCheck, { walkCycle: 1.0 });
    const expectedBobOffset = Math.sin(1.0 * 2) * 1.5;
    const baseH = renderer.npcHeight || 40;
    assert.strictEqual(drawnSpriteY, -baseH + Math.round(expectedBobOffset), 'Explicit walkCycle must trigger smooth bobbing');

    // 5. processCartSprite and processNpcSprites with naturalWidth fallback when width is 0
    assert.doesNotThrow(() => {
        renderer.processCartSprite({ naturalWidth: cartRaw.width, naturalHeight: cartRaw.height, width: 0, height: 0 });
        renderer.processNpcSprites({ naturalWidth: npcRaw.width, naturalHeight: npcRaw.height, width: 0, height: 0 });
    }, 'Process sprites must support naturalWidth fallback');
    assert(renderer.cartLoaded && renderer.npcsLoaded, 'Sprites must be loaded after naturalWidth processing');
    console.log('✓ Edge cases verified (null safety, type mapping, string direction flip, walkCycle bobbing, naturalWidth fallback)');

    // Verify Graceful Fallback
    renderer.cartLoaded = false;
    renderer.npcsLoaded = false;
    const ctxFallback = new MockCanvasContext();
    renderer.renderStand(ctxFallback, 220, 155, {}, false, false, false);
    renderer.renderCustomer(ctxFallback, { x: 200, y: 220, direction: 1, archetype: 'student' });
    assert(ctxFallback.ops > 100, 'Procedural fallback must execute with high ops when sprites not loaded');
    console.log('✓ Graceful procedural fallback verified when images not yet loaded');
} catch (e) {
    console.error('Test 11 error:', e);
    throw e;
}

// TEST 12: All 5 Locations 16-Bit Isometric Backgrounds
console.log('\n[Test 12] All 5 Locations 16-Bit Pre-rendered Background Assets:');
const fs = require('fs');
const path = require('path');
const allLocKeys = ['suburbs', 'park', 'campus', 'metro', 'downtown'];

allLocKeys.forEach(locKey => {
    const fileName = locKey === 'suburbs' ? 'suburbs_bg.jpg' : `${locKey}_bg.jpg`;
    const filePath = path.join(__dirname, 'assets', fileName);
    assert(fs.existsSync(filePath), `Background asset '${fileName}' must exist on disk`);
    const stat = fs.statSync(filePath);
    assert(stat.size > 50000, `Background asset '${fileName}' must have valid filesize (found ${stat.size} bytes)`);

    // Verify SpriteRenderer registers the background
    assert(locKey in renderer.locationBgs, `SpriteRenderer must register background key for '${locKey}'`);
    if (!renderer.locationBgs[locKey]) {
        renderer.locationBgs[locKey] = { width: 1376, height: 768, src: fileName };
    }
    if (locKey === 'suburbs') {
        renderer.suburbsBg = renderer.locationBgs[locKey];
    }

    // Test pre-rendered backdrop rendering
    renderer.locationBgsLoaded[locKey] = true;
    if (locKey === 'suburbs') renderer.suburbsBgLoaded = true;
    const mockCtx = {
        save() {},
        restore() {},
        drawImage(img, x, y, w, h) {
            this.called = true;
            this.drawn = { img, x, y, w, h };
        }
    };
    renderer.renderLocationBackdrop(mockCtx, 640, 360, locKey, 200, { type: 'sunny' });
    assert(mockCtx.called, `Location '${locKey}' must draw pre-rendered 16-bit background image`);
    assert.strictEqual(mockCtx.drawn.w, 640);
    assert.strictEqual(mockCtx.drawn.h, 360);
    console.log(`✓ Location '${locKey}' (${fileName}, ${(stat.size / 1024).toFixed(1)} KB) successfully renders 16-bit pre-rendered backdrop`);
});

// TEST 13: Multi-Layer Environment Foreground Occlusion Pass (All 5 Locations)
console.log('\n[Test 13] Multi-Layer Environment Foreground Occlusion Pass (All 5 Locations):');
assert(typeof renderer.renderForegroundLayer === 'function', 'SpriteRenderer must expose renderForegroundLayer');
assert(typeof renderer.renderCustomerBubble === 'function', 'SpriteRenderer must expose renderCustomerBubble');

allLocKeys.forEach(locKey => {
    // 1. Test High-Fidelity Pre-Rendered Foreground Occlusion Pass
    renderer.locationBgsLoaded[locKey] = true;
    if (locKey === 'suburbs') renderer.suburbsBgLoaded = true;

    const mockFgCtx = {
        save() { this.saved = true; },
        restore() { this.restored = true; },
        beginPath() { this.paths++; },
        rect(x, y, w, h) { this.rects.push({ x, y, w, h }); },
        moveTo(x, y) { this.moves.push({ x, y }); },
        lineTo(x, y) { this.lines.push({ x, y }); },
        closePath() {},
        stroke() {},
        clip() { this.clipped = true; },
        drawImage(img, x, y, w, h) {
            this.drawn = { img, x, y, w, h };
        },
        drawn: null,
        paths: 0,
        clipped: false,
        rects: [],
        moves: [],
        lines: []
    };

    renderer.renderForegroundLayer(mockFgCtx, 640, 360, locKey, { type: 'freezing' });
    assert(mockFgCtx.drawn !== null, `renderForegroundLayer must draw pre-rendered foreground image for '${locKey}'`);
    assert(mockFgCtx.clipped === true, `renderForegroundLayer must apply occlusion clipping for '${locKey}'`);
    assert(mockFgCtx.rects.length >= 1 || mockFgCtx.lines.length >= 1, `renderForegroundLayer must register occluding geometry for '${locKey}'`);

    // 2. Test Procedural Fallback Foreground Pass
    renderer.locationBgsLoaded[locKey] = false;
    if (locKey === 'suburbs') renderer.suburbsBgLoaded = false;

    const mockProcCtx = new MockCanvasContext();
    renderer.renderForegroundLayer(mockProcCtx, 640, 360, locKey, { type: 'sunny' });
    assert(mockProcCtx.ops > 10, `Procedural foreground fallback must render geometry for '${locKey}' (ops: ${mockProcCtx.ops})`);

    // Restore pre-rendered state
    renderer.locationBgsLoaded[locKey] = true;
    if (locKey === 'suburbs') renderer.suburbsBgLoaded = true;

    console.log(`✓ Location '${locKey}' foreground occlusion layer verified (pre-rendered image clipping & procedural fallback)`);
});

// 3. Test Bubble Decoupling & Z-Ordering
class FgMockContextWithDrawImage extends MockCanvasContext {
    constructor() {
        super();
        this.drawnImages = [];
        this.texts = [];
    }
    drawImage(img, dx, dy, dw, dh) {
        this.ops++;
        this.drawnImages.push({ img, dx, dy, dw, dh });
    }
    fillText(text, x, y) {
        super.fillText(text, x, y);
        this.texts.push(text);
    }
}
const mockCustCtx = new FgMockContextWithDrawImage();
const mockCustomer = { x: 200, y: 240, direction: 1, archetype: 'student', bubble: { text: 'Coffee Masterpiece! 🌟', width: 80 }, bubbleTimer: 1.0, bubbleMaxTimer: 1.3 };
// Render customer body with skipBubble = true
renderer.renderCustomer(mockCustCtx, mockCustomer, true);
assert(!mockCustCtx.texts.some(t => t.includes('Coffee Masterpiece')), 'skipBubble=true must suppress speech bubble in body pass');

// Render speech bubble on top of foreground
renderer.renderCustomerBubble(mockCustCtx, mockCustomer);
assert(mockCustCtx.texts.some(t => t.includes('Coffee Masterpiece')), 'renderCustomerBubble must render speech bubble in foreground overlay pass');
console.log('✓ Customer body and speech bubble passes correctly decoupled for foreground depth layering');

// 4. Metro Perspective Depth Geometry & Clock Post Check
const metroRects = [];
const mockMetroCtx = {
    save() {}, restore() {}, beginPath() {},
    rect(x, y, w, h) { metroRects.push({ x, y, w, h }); },
    moveTo() {}, lineTo() {}, closePath() {}, clip() {},
    drawImage() {}
};
renderer.renderPreRenderedForeground(mockMetroCtx, 640, 360, 'metro', renderer.locationBgs.metro, { type: 'sunny' });
const hasLeftPillar = metroRects.some(r => r.x <= 138 && r.x + r.w >= 156);
const hasCenterPillar = metroRects.some(r => r.x <= 262 && r.x + r.w >= 284);
const hasNewsstand = metroRects.some(r => r.x <= 375 && r.x + r.w >= 450);
const hasClock = metroRects.some(r => r.x <= 545 && r.x + r.w >= 580);
assert(hasLeftPillar, 'Metro foreground must occlude Left Iron Pillar (x: 134..158)');
assert(hasCenterPillar, 'Metro foreground must occlude Center Iron Pillar (x: 258..286)');
assert(hasNewsstand, 'Metro foreground must occlude Newsstand Kiosk (x: 368..458)');
assert(hasClock, 'Metro foreground must occlude Brass Station Clock (x: 535..585)');
assert(typeof renderer.renderMetroBrassClock === 'function', 'SpriteRenderer must expose renderMetroBrassClock');
console.log('✓ Grand Central Metro foreground occlusion geometry strictly bounds iron pillars, newsstand, and brass clock');

// 5. Procedural Metro Brass Clock Rendering Check
const mockClockCtx = new MockCanvasContext();
renderer.renderMetroBrassClock(mockClockCtx, 560, 175);
assert(mockClockCtx.ops >= 10, 'renderMetroBrassClock must render clock dials, bracket, and brass casing');
console.log('✓ Grand Central Metro four-faced brass station clock verified');

// TEST 14: Real Pixel Verification: Pedestrians on Open Walkways are Never Erased by Floor Clipping
console.log('\n[Test 14] Real Pixel Verification: Open Walkway Pedestrians Never Erased by Foreground Layer:');
(async () => {
    try {
        const { createCanvas, loadImage } = require('@napi-rs/canvas');
        const locations = [
            {
                loc: 'metro',
                openPeds: [
                    { x: 100, y: 250 }, { x: 125, y: 248 }, { x: 170, y: 248 },
                    { x: 210, y: 245 }, { x: 240, y: 245 }, { x: 300, y: 245 },
                    { x: 400, y: 224 }, { x: 500, y: 240 }, { x: 580, y: 250 }
                ],
                occludedPed: { x: 145, y: 248 } // Behind Pillar 1 shaft
            },
            {
                loc: 'suburbs',
                openPeds: [
                    { x: 100, y: 236 }, { x: 235, y: 224 }, { x: 360, y: 234 },
                    { x: 480, y: 232 }, { x: 520, y: 220 }, { x: 600, y: 228 }
                ]
            },
            {
                loc: 'park',
                openPeds: [
                    { x: 80, y: 248 }, { x: 180, y: 232 }, { x: 280, y: 222 },
                    { x: 380, y: 230 }, { x: 480, y: 242 }, { x: 580, y: 252 }
                ]
            },
            {
                loc: 'campus',
                openPeds: [
                    { x: 90, y: 248 }, { x: 210, y: 232 }, { x: 300, y: 220 },
                    { x: 410, y: 216 }, { x: 520, y: 228 }, { x: 580, y: 220 }
                ]
            },
            {
                loc: 'downtown',
                openPeds: [
                    { x: 105, y: 238 }, { x: 230, y: 228 }, { x: 340, y: 224 },
                    { x: 450, y: 228 }, { x: 555, y: 238 }, { x: 600, y: 230 }
                ]
            }
        ];

        for (const cfg of locations) {
            const bg = await loadImage(`./assets/${cfg.loc}_bg.jpg`);
            const canvas = createCanvas(640, 360);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bg, 0, 0, 640, 360);

            // Draw open-walkway pedestrians
            cfg.openPeds.forEach(p => {
                ctx.fillStyle = '#ff00ff';
                ctx.fillRect(p.x - 8, p.y - 32, 16, 32);
            });

            // Set renderer bg for this location
            if (cfg.loc === 'suburbs') {
                renderer.suburbsBg = bg;
                renderer.suburbsBgLoaded = true;
            } else {
                renderer.locationBgs[cfg.loc] = bg;
                renderer.locationBgsLoaded[cfg.loc] = true;
            }

            // Run foreground occlusion pass
            renderer.renderForegroundLayer(ctx, 640, 360, cfg.loc, null);

            // Verify all open pedestrians remained visible (magenta)
            cfg.openPeds.forEach((p, idx) => {
                const d = ctx.getImageData(p.x, p.y - 16, 1, 1).data;
                const isMagenta = d[0] > 180 && d[2] > 180 && d[1] < 60;
                assert(isMagenta, `Location '${cfg.loc}' ped ${idx} at (${p.x}, ${p.y}) must NOT be erased by foreground floor! Got rgb(${d[0]}, ${d[1]}, ${d[2]})`);
            });
            console.log(`✓ Location '${cfg.loc}': All ${cfg.openPeds.length} open-walkway pedestrians verified unclipped by floor`);

            // If test has occluded pedestrian (e.g. behind Metro pillar), test occlusion
            if (cfg.occludedPed) {
                const canvasOcc = createCanvas(640, 360);
                const ctxOcc = canvasOcc.getContext('2d');
                ctxOcc.drawImage(bg, 0, 0, 640, 360);
                ctxOcc.fillStyle = '#ff00ff';
                ctxOcc.fillRect(cfg.occludedPed.x - 8, cfg.occludedPed.y - 32, 16, 32);
                renderer.renderForegroundLayer(ctxOcc, 640, 360, cfg.loc, null);
                const dOcc = ctxOcc.getImageData(cfg.occludedPed.x, cfg.occludedPed.y - 16, 1, 1).data;
                const isOccluded = !(dOcc[0] > 180 && dOcc[2] > 180 && dOcc[1] < 60);
                assert(isOccluded, `Location '${cfg.loc}' ped at (${cfg.occludedPed.x}, ${cfg.occludedPed.y}) behind pillar must be occluded by foreground architecture`);
                console.log(`✓ Location '${cfg.loc}': Pedestrian behind foreground pillar verified properly occluded`);
            }
        }

        console.log('\n======================================================');
        console.log('✅ ALL SPRITERENDERER DEEP VERIFICATION TESTS PASSED!');
        console.log('======================================================');
    } catch (err) {
        console.error('Test 14 failed:', err);
        process.exit(1);
    }
})();
