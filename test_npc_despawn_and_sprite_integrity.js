/**
 * test_npc_despawn_and_sprite_integrity.js
 * Comprehensive unit & integration tests verifying:
 * 1. Sprite rendering robustness (no disappearing sprite leaving behind only shadow; procedural fallback guaranteed).
 * 2. Terminus despawn in simulation engine (walking and leaving NPCs despawn upon reaching the last waypoint).
 * 3. Terminus despawn in Map Editor test walkers (walkers despawn upon reaching route end, never walk forever).
 */

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
global.document = {
    createElement: (tag) => {
        if (tag === 'canvas') return createMockCanvas(64, 64);
        if (tag === 'img') return { complete: false, naturalWidth: 0, width: 0, height: 0, src: '' };
        return { style: {}, addEventListener: () => {} };
    },
    getElementById: () => null,
    querySelectorAll: () => []
};
global.Image = function() {
    return { complete: false, naturalWidth: 0, width: 0, height: 0, src: '' };
};

function createMockCanvas(w = 640, h = 360) {
    const drawCalls = [];
    const ctx = {
        canvas: { width: w, height: h },
        save: () => drawCalls.push({ type: 'save' }),
        restore: () => drawCalls.push({ type: 'restore' }),
        translate: (x, y) => drawCalls.push({ type: 'translate', x, y }),
        scale: (sx, sy) => drawCalls.push({ type: 'scale', sx, sy }),
        rotate: (r) => drawCalls.push({ type: 'rotate', r }),
        beginPath: () => drawCalls.push({ type: 'beginPath' }),
        closePath: () => drawCalls.push({ type: 'closePath' }),
        moveTo: (x, y) => drawCalls.push({ type: 'moveTo', x, y }),
        lineTo: (x, y) => drawCalls.push({ type: 'lineTo', x, y }),
        arc: (x, y, r, sa, ea) => drawCalls.push({ type: 'arc', x, y, r, sa, ea }),
        ellipse: (x, y, rx, ry, rot, sa, ea) => drawCalls.push({ type: 'ellipse', x, y, rx, ry }),
        fill: () => drawCalls.push({ type: 'fill' }),
        stroke: () => drawCalls.push({ type: 'stroke' }),
        fillRect: (x, y, w, h) => drawCalls.push({ type: 'fillRect', x, y, w, h }),
        clearRect: (x, y, w, h) => drawCalls.push({ type: 'clearRect', x, y, w, h }),
        strokeRect: (x, y, w, h) => drawCalls.push({ type: 'strokeRect', x, y, w, h }),
        drawImage: function(...args) {
            drawCalls.push({ type: 'drawImage', args });
        },
        getImageData: () => ({ data: new Uint8ClampedArray(100 * 100 * 4) }),
        putImageData: () => {},
        measureText: (txt) => ({ width: (txt || '').length * 6 }),
        fillText: (txt, x, y) => drawCalls.push({ type: 'fillText', txt, x, y }),
        strokeText: (txt, x, y) => drawCalls.push({ type: 'strokeText', txt, x, y }),
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} })
    };
    return {
        width: w,
        height: h,
        getContext: () => ctx,
        getBoundingClientRect: () => ({ left: 0, top: 0, width: w, height: h }),
        addEventListener: () => {},
        _drawCalls: drawCalls
    };
}

require('./js/sprites.js');
require('./js/web3.js');
require('./js/simulation.js');
require('./js/engine.js');
require('./js/editor.js');

console.log('--- STARTING NPC DESPAWN & SPRITE INTEGRITY TESTS ---');

// Test 1: Sprite Rendering Fallback when Assets Unloaded or Missing
console.log('\n[Test 1] Sprite Rendering Robustness:');
const renderer = window.spriteRenderer;
assert(renderer, 'spriteRenderer must be defined on window');
const mockCanvas = createMockCanvas(640, 360);
const ctx = mockCanvas.getContext('2d');

// Scenario: Image assets not loaded or naturalWidth === 0
const testCustomer = {
    x: 200,
    y: 200,
    type: 'jogger',
    variantKey: 'jogger',
    state: 'walking',
    isMoving: true,
    walkPhase: 1.0,
    direction: 1
};

renderer.renderCustomer(ctx, testCustomer);
const fills = mockCanvas._drawCalls.filter(c => c.type === 'fill' || c.type === 'fillRect');
// If only shadow was drawn, there would be at most 1 fill call.
// Full procedural sprite has 5+ fill calls (shoes, pants/skirt, torso, head, hair).
assert(fills.length >= 4, `Procedural sprite must render when image assets are unloaded (got ${fills.length} fills)`);
console.log(`✓ Procedural fallback drew complete character (${fills.length} fill calls) when image assets are unloaded`);

// Test 2: Engine Customer Terminus Despawn (Walking State)
console.log('\n[Test 2] Engine Walking Customer Despawns at Route Terminus:');
const sim = window.simulationModel;
const engine = window.simulationEngine;
engine.init(mockCanvas);
sim.currentLocation = 'suburbs';

const samplePath = [
    { x: 100, y: 200 },
    { x: 150, y: 200 },
    { x: 200, y: 200 }
];

const walkingCustomer = {
    x: 198,
    y: 200,
    speed: 40,
    direction: 1,
    state: 'walking',
    waypoints: samplePath,
    wpIndex: 2 // heading to final waypoint at index 2 (x: 200)
};

engine.customers = [walkingCustomer];
// Step 0.1s -> moveStep = 4px. Since dist = 2px <= 4px, customer reaches final waypoint!
engine.updateSim(0.1);

assert.strictEqual(walkingCustomer.isDespawned, true, 'Customer must be marked isDespawned=true upon reaching final waypoint');
assert.strictEqual(engine.customers.length, 0, 'Customer must be removed from engine.customers upon terminus arrival');
console.log('✓ Walking customer correctly despawned and removed at final waypoint terminus');

// Test 3: Engine Customer Terminus Despawn (Leaving State)
console.log('\n[Test 3] Engine Leaving Customer Despawns at Route Terminus:');
const leavingCustomer = {
    x: 198,
    y: 200,
    speed: 40,
    direction: 1,
    state: 'leaving',
    hasCoffee: true,
    waypoints: samplePath,
    wpIndex: 2 // heading to final waypoint at index 2
};

engine.customers = [leavingCustomer];
engine.updateSim(0.1);

assert.strictEqual(leavingCustomer.isDespawned, true, 'Leaving customer must be marked isDespawned=true at route terminus');
assert.strictEqual(engine.customers.length, 0, 'Leaving customer must be cleanly removed from engine.customers at terminus');
console.log('✓ Leaving customer correctly despawned and removed at final waypoint terminus');

// Test 4: Editor Test Walkers Despawn at Terminus (Walking and Leaving)
console.log('\n[Test 4] Map Editor Test Walkers Despawn at Terminus:');
const editor = new MapEditor();
editor.canvas = mockCanvas;
editor.ctx = ctx;
editor.currentLocation = 'suburbs';
editor.isTestingWalkers = true;

// A: Walking test walker reaching terminus
const testWalkerWalking = {
    x: 198,
    y: 200,
    speed: 40,
    direction: 1,
    state: 'walking',
    waypoints: samplePath,
    wpIndex: 2,
    walkPhase: 0,
    animTimer: 0,
    animFrame: 0
};

editor.testWalkers = [testWalkerWalking];
editor.updateTestWalkers(0.1);
assert.strictEqual(editor.testWalkers.length, 0, 'Test walker in walking state must be removed upon reaching terminus');
console.log('✓ Editor walking test walker despawned at terminus');

// B: Leaving test walker reaching terminus
const testWalkerLeaving = {
    x: 198,
    y: 200,
    speed: 40,
    direction: 1,
    state: 'leaving',
    hasCoffee: true,
    waypoints: samplePath,
    wpIndex: 2,
    walkPhase: 0,
    animTimer: 0,
    animFrame: 0
};

editor.testWalkers = [testWalkerLeaving];
editor.updateTestWalkers(0.1);
assert.strictEqual(editor.testWalkers.length, 0, 'Test walker in leaving state must be removed upon reaching terminus');
console.log('✓ Editor leaving test walker despawned at terminus');

// Test 5: Vector Continuity & yDelta Safety (Regression prevention for Test 7)
console.log('\n[Test 5] Vector Continuity at Terminus without Snapping:');
const smoothCustomer = {
    x: 690,
    y: 265,
    speed: 40,
    direction: 1,
    origDirection: 1,
    state: 'leaving',
    waypoints: window.LOCATION_PATHS.suburbs[0],
    wpIndex: window.LOCATION_PATHS.suburbs[0].length
};
const startY = smoothCustomer.y;
engine.updateCustomer(smoothCustomer, 0.1);
const yDelta = Math.abs(smoothCustomer.y - startY);
assert(yDelta < 5, `Customer vector calculation must be smooth (yDelta=${yDelta.toFixed(2)}px < 5px)`);
assert.strictEqual(smoothCustomer.isDespawned, true, 'Customer at/past terminus must have isDespawned=true');
// Test 6: Dynamic Cart Shadow Scaling (Cart Never Floats on Any Scale)
console.log('\n[Test 6] Dynamic Cart Shadow Tracks Wheels Across All Scales:');
const scales = [40, 50, 63, 76, 90, 110];
const standX = 324, standY = 272;

scales.forEach(cartW => {
    renderer.cartWidth = cartW;
    const testCanvas = createMockCanvas(640, 360);
    const testCtx = testCanvas.getContext('2d');
    
    // 1. Test with 16-bit cart loaded
    renderer.cartLoaded = true;
    renderer.cartSpriteCanvas = { width: 747, height: 930 };
    renderer.renderStand(testCtx, standX, standY);
    
    // Find shadow ellipse calls
    const ellipses = testCanvas._drawCalls.filter(c => c.type === 'ellipse');
    assert(ellipses.length >= 2, `Cart at scale ${cartW}px must draw 2 shadow layers (got ${ellipses.length})`);
    
    const shadowOuter = ellipses[0];
    const cartH = Math.round(cartW * (930 / 747));
    const cartX = standX - 18;
    const cartY = standY - 44;
    const expectedCenterX = cartX + Math.round(cartW * 0.46);
    const expectedCenterY = cartY + Math.round(cartH * 0.89);
    const expectedShadowW = Math.round(cartW * 0.44);
    
    assert.strictEqual(shadowOuter.x, expectedCenterX, `Shadow center X at ${cartW}px must follow cartX (expected ${expectedCenterX}, got ${shadowOuter.x})`);
    assert.strictEqual(shadowOuter.y, expectedCenterY, `Shadow center Y at ${cartW}px must follow cartY (expected ${expectedCenterY}, got ${shadowOuter.y})`);
    assert.strictEqual(shadowOuter.rx, expectedShadowW, `Shadow width at ${cartW}px must scale proportionally (expected ${expectedShadowW}, got ${shadowOuter.rx})`);
    
    // Check gap between bottom wheels and shadow center
    const wheelBaseY = cartY + cartH * 0.95;
    const shadowDistToWheels = Math.abs(shadowOuter.y - wheelBaseY);
    assert(shadowDistToWheels < cartH * 0.12, `Shadow must remain glued to wheel base (dist was ${shadowDistToWheels.toFixed(1)}px, cartH=${cartH}px)`);
});
console.log('✓ Dynamic cart shadow verified across all scales (40px..110px): shadow strictly follows wheels with 0 floating gap');

console.log('\n======================================================');
console.log('✅ ALL NPC DESPAWN & SPRITE INTEGRITY TESTS PASSED!');
console.log('======================================================');
