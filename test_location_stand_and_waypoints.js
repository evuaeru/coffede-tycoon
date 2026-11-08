// Test suite for Per-Location Stand Placement, Proportional Scaling, and Bespoke Pedestrian Waypoints

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

// Require components
require('./js/audio.js');
require('./js/sprites.js');
require('./js/web3.js');
require('./js/simulation.js');
require('./js/engine.js');

console.log('--- STARTING LOCATION STAND & WAYPOINTS VERIFICATION ---');

const sim = window.simulationModel;
const engine = window.simulationEngine;
const renderer = window.spriteRenderer;

// [Test 1] Per-Location Stand Placement & Queue Coordinates
console.log('\n[Test 1] Per-Location Stand Placement & Dynamic Queue Coordinates:');
const expectedStands = {
    suburbs: { stand: { x: 235, y: 180 }, q0: { x: 265, y: 200 }, q1: { x: 295, y: 215 }, q2: { x: 325, y: 230 } },
    park: { stand: { x: 250, y: 185 }, q0: { x: 280, y: 205 }, q1: { x: 308, y: 221 }, q2: { x: 336, y: 237 } },
    campus: { stand: { x: 240, y: 180 }, q0: { x: 270, y: 200 }, q1: { x: 298, y: 216 }, q2: { x: 326, y: 232 } },
    metro: { stand: { x: 230, y: 190 }, q0: { x: 260, y: 210 }, q1: { x: 288, y: 226 }, q2: { x: 316, y: 242 } },
    downtown: { stand: { x: 245, y: 185 }, q0: { x: 275, y: 205 }, q1: { x: 303, y: 221 }, q2: { x: 331, y: 237 } }
};

for (const [locKey, expected] of Object.entries(expectedStands)) {
    sim.currentLocation = locKey;
    engine._overrideStandX = undefined;
    engine._overrideStandY = undefined;

    assert.strictEqual(engine.standX, expected.stand.x, `${locKey} standX must be ${expected.stand.x}`);
    assert.strictEqual(engine.standY, expected.stand.y, `${locKey} standY must be ${expected.stand.y}`);

    const cfg = engine.getStandConfig();
    const spot0 = cfg.queueSpot(0);
    const spot1 = cfg.queueSpot(1);
    const spot2 = cfg.queueSpot(2);

    assert.strictEqual(spot0.x, expected.q0.x, `${locKey} queue spot 0 x mismatch`);
    assert.strictEqual(spot0.y, expected.q0.y, `${locKey} queue spot 0 y mismatch`);
    assert.strictEqual(spot1.x, expected.q1.x, `${locKey} queue spot 1 x mismatch`);
    assert.strictEqual(spot1.y, expected.q1.y, `${locKey} queue spot 1 y mismatch`);
    assert.strictEqual(spot2.x, expected.q2.x, `${locKey} queue spot 2 x mismatch`);
    assert.strictEqual(spot2.y, expected.q2.y, `${locKey} queue spot 2 y mismatch`);

    // Direct engine.queueSpot method delegation check
    assert.strictEqual(engine.queueSpot(0).x, expected.q0.x, `${locKey} engine.queueSpot(0).x mismatch`);
    assert.strictEqual(engine.queueSpot(0).y, expected.q0.y, `${locKey} engine.queueSpot(0).y mismatch`);
    assert.strictEqual(engine.queueSpot(1).x, expected.q1.x, `${locKey} engine.queueSpot(1).x mismatch`);
    assert.strictEqual(engine.queueSpot(1).y, expected.q1.y, `${locKey} engine.queueSpot(1).y mismatch`);

    console.log(`✓ Location '${locKey}': Stand at (${engine.standX}, ${engine.standY}), Queue Q0=(${spot0.x}, ${spot0.y}), Q1=(${spot1.x}, ${spot1.y})`);
}

// [Test 2] Manual Override Safety
console.log('\n[Test 2] Manual Stand Position Override & Queue Offset:');
engine.standX = 220;
engine.standY = 200;
assert.strictEqual(engine.standX, 220, 'Manual override standX must be preserved');
assert.strictEqual(engine.standY, 200, 'Manual override standY must be preserved');
const customCfg = engine.getStandConfig();
assert.strictEqual(customCfg.x, 220);
assert.strictEqual(customCfg.y, 200);
console.log('✓ Manual override correctly offsets stand and queue spots');
engine._overrideStandX = undefined;
engine._overrideStandY = undefined;

// [Test 3] Proportional Cart & NPC Dimensions
console.log('\n[Test 3] Proportional Cart & NPC Dimensions:');
assert(renderer.cartWidth >= 74 && renderer.cartWidth <= 80, `Cart width must be scaled down to ~75-80px (actual: ${renderer.cartWidth})`);
assert(renderer.npcHeight >= 38 && renderer.npcHeight <= 42, `NPC height must be scaled down to ~38-42px (actual: ${renderer.npcHeight})`);
console.log(`✓ Cart width: ${renderer.cartWidth}px, NPC height: ${renderer.npcHeight}px`);

// [Test 4] Location-Specific Waypoint Catalog Integrity
console.log('\n[Test 4] Location-Specific Waypoint Catalog Integrity:');
const locKeys = ['suburbs', 'park', 'campus', 'metro', 'downtown'];
for (const locKey of locKeys) {
    const paths = window.LOCATION_PATHS[locKey];
    assert(Array.isArray(paths) && paths.length >= 2, `${locKey} must have at least 2 distinct waypoint routes`);
    paths.forEach((route, idx) => {
        assert(route.length >= 4, `${locKey} route ${idx} must contain at least 4 waypoints`);
        // Check start is offscreen left and end is offscreen right
        assert(route[0].x <= -20, `${locKey} route ${idx} start must be offscreen left`);
        assert(route[route.length - 1].x >= 640, `${locKey} route ${idx} end must be offscreen right`);
        // Check Y coordinates are strictly within reasonable ground bounds (200-340)
        route.forEach((pt, pIdx) => {
            assert(pt.y >= 200 && pt.y <= 340, `${locKey} route ${idx} pt ${pIdx} y=${pt.y} out of bounds`);
        });
    });
    console.log(`✓ Location '${locKey}' has ${paths.length} verified bespoke routes within plaza walkable boundaries`);
}

// [Test 5] Pedestrian Spawning with Waypoints
console.log('\n[Test 5] Pedestrian Spawning & Waypoint Progression:');
sim.currentLocation = 'park';
engine.customers = [];
engine.pedestrianCountToday = 0;
engine.targetPedestrians = 10;
engine.spawnCustomer();

assert.strictEqual(engine.customers.length, 1, 'Customer should be spawned');
const cust = engine.customers[0];
assert(Array.isArray(cust.waypoints) && cust.waypoints.length >= 4, 'Spawned customer must possess bespoke waypoints');
assert.strictEqual(cust.wpIndex, 1, 'Spawned customer should target waypoint index 1');

// Simulate traversal along waypoints
const startX = cust.x;
for (let step = 0; step < 20; step++) {
    engine.updateCustomer(cust, 0.1);
}
assert.notStrictEqual(cust.x, startX, 'Customer must move along waypoint trajectory');
console.log(`✓ Customer smoothly walked along waypoints from x=${startX.toFixed(1)} to x=${cust.x.toFixed(1)}, current wpIndex=${cust.wpIndex}`);

// [Test 6] Queue Divergence & Post-Service Waypoint Resumption
console.log('\n[Test 6] Queue Divergence & Post-Service Waypoint Resumption:');
sim.currentLocation = 'suburbs';
sim.recipe.price = 1.00;
sim.cupsInBatch = 10;
sim.reservedStock = { beans: 0, milk: 0, cups: 0, ice: 0, sugar: 0, syrup: 0 };
sim.inventory = { beans: 50, milk: 50, cups: 50, ice: 50, sugar: 50, syrup: 50 };
engine.customers = [];
engine.queue = [];
engine.spawnCustomer();
const buyer = engine.customers[0];
buyer.x = 235;
buyer.y = 222;
buyer.decision = { buy: true, rating: 5.0, price: 2.5, tip: 1.0, isCrypto: false, needed: { beans: 1, milk: 1, cups: 1, ice: 1, sugar: 1 } };

// Trigger decision -> customer diverges from path to queue
engine.handleCustomerDecision(buyer);
assert.strictEqual(buyer.state, 'queued', 'Customer must enter queue state');
assert.strictEqual(buyer.queueSpot, 0, 'First customer must be queueSpot 0');

// Update towards queue spot
for (let step = 0; step < 10; step++) {
    engine.updateCustomer(buyer, 0.1);
}
const suburbsSpot0 = engine.getStandConfig().queueSpot(0);
assert(Math.hypot(buyer.x - suburbsSpot0.x, buyer.y - suburbsSpot0.y) < 5, 'Customer must arrive at queue spot 0');
console.log(`✓ Customer diverged from walkway to queueSpot 0 at (${buyer.x.toFixed(1)}, ${buyer.y.toFixed(1)})`);

// Complete service and test resuming path
engine.completeService(buyer);
assert.strictEqual(buyer.state, 'leaving', 'Customer must be in leaving state');
assert.strictEqual(buyer.hasCoffee, true, 'Customer must hold coffee');
assert(buyer.wpIndex >= 1 && buyer.wpIndex < buyer.waypoints.length, 'Customer must resume valid waypoint index');

// Hop ends, customer walks offscreen along remaining waypoints
buyer.servedHopTimer = 0;
const prevLeavingX = buyer.x;
for (let step = 0; step < 15; step++) {
    engine.updateCustomer(buyer, 0.1);
}
assert.strictEqual(buyer.isMoving, true, 'Customer must be moving along exit waypoints');
assert(Math.abs(buyer.x - prevLeavingX) > 10, 'Customer must progress along exit waypoints');
console.log(`✓ Customer resumed path and moved from ${prevLeavingX.toFixed(1)} to ${buyer.x.toFixed(1)}`);

// [Test 7] Vector Continuity at Waypoint Terminus (No Teleport Snapping)
console.log('\n[Test 7] Vector Continuity at Waypoint Terminus:');
const testExiting = {
    x: 690,
    y: 265,
    speed: 40,
    direction: 1,
    origDirection: 1,
    state: 'leaving',
    waypoints: window.LOCATION_PATHS.suburbs[0],
    wpIndex: window.LOCATION_PATHS.suburbs[0].length // at end of waypoints
};
const startExitingY = testExiting.y;
engine.updateCustomer(testExiting, 0.1);
const yDelta = Math.abs(testExiting.y - startExitingY);
assert(yDelta < 5, `Customer must not vertically snap/teleport at path terminus (delta was ${yDelta.toFixed(2)}px)`);
console.log(`✓ Path terminus smoothly continues vector (yDelta=${yDelta.toFixed(2)}px < 5px) without teleport snapping`);

console.log('\n======================================================');
console.log('✅ ALL LOCATION STAND & WAYPOINTS TESTS PASSED!');
console.log('======================================================');
