const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock browser globals for simulation
global.window = global;
global.requestAnimationFrame = () => {};
global.performance = { now: () => Date.now() };
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
};

// Load core files
require('./js/audio.js');
require('./js/sprites.js');
require('./js/web3.js');
require('./js/simulation.js');
require('./js/engine.js');
require('./js/editor.js');

console.log('--- STARTING REALISTIC QUEUE ADVANCEMENT & CASCADE TEST SUITE ---');

const sim = window.simulationModel;

const engine = window.simulationEngine;
engine.location = 'suburbs';

const standCfg = engine.getStandConfig();
const q0 = standCfg.queueSpot(0);
const q1 = standCfg.queueSpot(1);
const counter = standCfg.counter;

console.log(`\nStand Coordinates: Counter=(${counter.x}, ${counter.y}), Q0=(${q0.x}, ${q0.y}), Q1=(${q1.x}, ${q1.y})`);

// ====================================================================
// TEST 1: Customers in Queue Must Cascade Forward and Step to Counter
// ====================================================================
console.log('\n[Test 1] Queue Cascade & Physical Forward Walking to Counter:');

// Setup inventory and batch
sim.cupsInBatch = 5;
sim.inventory = { beans: 50, milk: 50, cups: 50, ice: 50, sugar: 50, syrup: 50 };

// Create 3 customers
const custA = {
    id: 'custA',
    x: counter.x,
    y: counter.y,
    speed: 40,
    direction: -1,
    state: 'serving',
    hasArrivedAtCounter: true,
    isMoving: false,
    decision: { buy: true, rating: 5, price: 2.5, tip: 0.5, needed: { beans: 1, cups: 1, milk: 1, ice: 1, sugar: 1 } },
    waypoints: window.LOCATION_PATHS.suburbs[0],
    wpIndex: 2
};

const custB = {
    id: 'custB',
    x: q0.x,
    y: q0.y,
    speed: 40,
    direction: -1,
    state: 'queued',
    queueSpot: 0,
    isMoving: false,
    decision: { buy: true, rating: 5, price: 2.5, tip: 0.5, needed: { beans: 1, cups: 1, milk: 1, ice: 1, sugar: 1 } },
    waypoints: window.LOCATION_PATHS.suburbs[0],
    wpIndex: 2
};

const custC = {
    id: 'custC',
    x: q1.x,
    y: q1.y,
    speed: 40,
    direction: -1,
    state: 'queued',
    queueSpot: 1,
    isMoving: false,
    decision: { buy: true, rating: 5, price: 2.5, tip: 0.5, needed: { beans: 1, cups: 1, milk: 1, ice: 1, sugar: 1 } },
    waypoints: window.LOCATION_PATHS.suburbs[0],
    wpIndex: 2
};

engine.customers = [custA, custB, custC];
engine.queue = [custB, custC];
engine.currentServingCustomer = custA;
engine.isPouring = true;
engine.serviceDuration = 0.5;
engine.serviceProgress = 0.5; // Customer A is ready to finish!

// 1. Advance engine to finish Customer A
engine.updateSim(0.1);

assert.strictEqual(custA.state, 'leaving', 'Customer A must transition to leaving state');
assert.strictEqual(custA.hasCoffee, true, 'Customer A must receive coffee');
console.log('✓ Customer A finished and received coffee');

// 2. Counter vacate delay allows Customer A to step away
assert(engine.counterVacateTimer > 0, 'Counter vacate delay must be active');
for (let i = 0; i < 4; i++) {
    engine.updateSim(0.1);
}
assert.strictEqual(engine.counterVacateTimer, 0, 'Counter vacate delay should have expired');

// 3. Customer B has now been pulled to serving state
assert.strictEqual(engine.currentServingCustomer, custB, 'Customer B must now be the serving customer');
assert.strictEqual(custB.state, 'serving', 'Customer B must be in serving state');
assert.strictEqual(custC.queueSpot, 0, 'Customer C must have cascaded forward from queueSpot 1 to queueSpot 0');
console.log('✓ Customer B became serving customer, Customer C cascaded from spot 1 to spot 0');

// Process 1 movement tick so customers update towards their new destinations
engine.updateSim(0.05);

// 4. Verify Customer B and Customer C are walking forward (isMoving = true)
assert.strictEqual(custB.isMoving, true, 'Customer B must be physically moving towards counter');
assert.strictEqual(custC.isMoving, true, 'Customer C must be physically moving towards spot 0');
console.log('✓ Both Customer B and Customer C are physically advancing along line');

// 5. While Customer B is still walking towards counter, barista MUST NOT pour coffee!
assert.strictEqual(engine.isPouring, false, 'Barista must NOT pour coffee while customer is still walking to counter');
assert.strictEqual(engine.serviceProgress, 0, 'Service progress must remain 0 until customer arrives at counter');
console.log('✓ Barista pauses pouring while Customer B walks to counter window');

// 6. Step forward until Customer B reaches counter
while (!custB.hasArrivedAtCounter) {
    engine.updateSim(0.05);
}

assert(Math.hypot(custB.x - counter.x, custB.y - counter.y) <= 3, 'Customer B must have reached counter coordinates');
assert.strictEqual(custB.isMoving, false, 'Customer B must stop moving upon arrival at counter');
console.log(`✓ Customer B arrived at counter window (${custB.x.toFixed(1)}, ${custB.y.toFixed(1)})`);

// 7. Now that Customer B is at counter, barista starts pouring!
assert.strictEqual(engine.isPouring, true, 'Barista must now start pouring coffee for Customer B');
assert(engine.serviceDuration > 0, 'Service duration must be positive');
console.log(`✓ Barista started pouring coffee for Customer B (duration: ${engine.serviceDuration.toFixed(2)}s)`);

// 8. Step forward until Customer B is served
while (custB.state === 'serving') {
    engine.updateSim(0.05);
}
assert.strictEqual(custB.state, 'leaving', 'Customer B must transition to leaving state after service');
assert.strictEqual(custB.hasCoffee, true, 'Customer B must now hold coffee');
console.log('✓ Customer B successfully purchased coffee at the counter and is now leaving');

// 9. Verify Customer C reached spot 0 and stopped
assert(Math.hypot(custC.x - q0.x, custC.y - q0.y) <= 2, 'Customer C must have reached queueSpot 0');
assert.strictEqual(custC.isMoving, false, 'Customer C must be waiting stopped at queueSpot 0');
console.log(`✓ Customer C arrived at queueSpot 0 (${custC.x.toFixed(1)}, ${custC.y.toFixed(1)})`);


// ====================================================================
// TEST 2: Map Editor Test Walkers Queue Cascading
// ====================================================================
console.log('\n[Test 2] Map Editor Test Walkers Queue Cascade:');

const editor = new MapEditor();
editor.canvas = null;
editor.ctx = null;
editor.setLocation('suburbs');

const edStandCfg = editor.getActiveStandConfig();
const edSpots = editor.getQueueSpots(edStandCfg);
const edQ0 = edSpots[0];
const edQ1 = edSpots[1];

// Create two test walkers in queue
const walkerA = {
    x: edQ0.x,
    y: edQ0.y,
    speed: 40,
    direction: -1,
    state: 'queued',
    queueSpot: 0,
    queueWaitTimer: 0.1, // about to finish
    hasCoffee: false,
    waypoints: window.LOCATION_PATHS.suburbs[0],
    wpIndex: 2
};

const walkerB = {
    x: edQ1.x,
    y: edQ1.y,
    speed: 40,
    direction: -1,
    state: 'queued',
    queueSpot: 1,
    queueWaitTimer: 3.0,
    hasCoffee: false,
    waypoints: window.LOCATION_PATHS.suburbs[0],
    wpIndex: 2
};

editor.testWalkers = [walkerA, walkerB];

// Walker B at spot 1 must NOT decrement queueWaitTimer!
const initialTimerB = walkerB.queueWaitTimer;
editor.updateTestWalkers(0.05);
assert.strictEqual(walkerB.queueWaitTimer, initialTimerB, 'Walker at queueSpot > 0 must NOT decrement purchase timer');
console.log('✓ Walker B at spot 1 did not decrement purchase timer');

// Advance time so Walker A finishes
editor.updateTestWalkers(0.1);
assert.strictEqual(walkerA.state, 'leaving', 'Walker A must have finished and transitioned to leaving');
assert.strictEqual(walkerA.hasCoffee, true, 'Walker A must now have coffee');
assert.strictEqual(walkerB.queueSpot, 0, 'Walker B must cascade from queueSpot 1 to queueSpot 0');
console.log('✓ Walker A finished and Walker B cascaded to queueSpot 0');

// Process 1 movement tick so Walker B steps forward towards newly assigned queueSpot 0
editor.updateTestWalkers(0.05);

// Walker B must now be physically walking forward towards spot 0
assert.strictEqual(walkerB.isMoving, true, 'Walker B must be physically moving towards spot 0');
console.log('✓ Walker B is physically advancing towards spot 0');

// Advance until Walker B arrives at spot 0
while (walkerB.isMoving) {
    editor.updateTestWalkers(0.05);
}

assert(Math.hypot(walkerB.x - edQ0.x, walkerB.y - edQ0.y) <= 2, 'Walker B must reach queueSpot 0');
assert.strictEqual(walkerB.isMoving, false, 'Walker B must stop at queueSpot 0');
console.log(`✓ Walker B arrived at queueSpot 0 (${walkerB.x.toFixed(1)}, ${walkerB.y.toFixed(1)})`);

// Now that Walker B is at spot 0 and stopped, their queueWaitTimer starts decrementing!
const arrivedTimerB = walkerB.queueWaitTimer;
editor.updateTestWalkers(0.1);
assert(walkerB.queueWaitTimer < arrivedTimerB, 'Walker B must now decrement purchase timer once at spot 0');
console.log('✓ Walker B purchase timer now counting down at spot 0');

console.log('\n======================================================');
console.log('✅ ALL REALISTIC QUEUE ADVANCEMENT TESTS PASSED!');
console.log('======================================================');
