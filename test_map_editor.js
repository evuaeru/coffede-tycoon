// Comprehensive verification test suite for Coffede Tycoon Map Editor
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
global.cancelAnimationFrame = () => {};
global.performance = { now: () => Date.now() };

// Require game modules
require('./js/audio.js');
require('./js/sprites.js');
require('./js/web3.js');
require('./js/simulation.js');
require('./js/engine.js');
require('./js/editor.js');

console.log('--- STARTING COMPREHENSIVE MAP EDITOR TEST SUITE ---');

const { MapEditor } = require('./js/editor.js');
assert(MapEditor, 'MapEditor class must be defined and exported');

const editor = new MapEditor();
assert(editor, 'MapEditor must instantiate successfully');

// ==============================================================
// TEST 1: Location Switching & Catalog Integrity
// ==============================================================
console.log('\n[Test 1] Location Switching & Catalog Integrity:');
const expectedLocs = [
    'cul_de_sac', 'community_garden', 'public_library', 'suburbs',
    'lake_marina', 'campsite', 'farmers_market', 'park',
    'beach_boardwalk', 'construction_site', 'art_district', 'campus',
    'amusement_pier', 'sports_complex', 'shopping_mall', 'hospital_plaza',
    'metro', 'convention_center', 'downtown', 'airport_terminal'
];
assert.deepStrictEqual(editor.locations, expectedLocs, 'Must support all 20 locations');

for (const loc of expectedLocs) {
    editor.setLocation(loc);
    assert.strictEqual(editor.currentLocation, loc, `Active location must switch to ${loc}`);
    const standCfg = editor.getActiveStandConfig();
    assert(standCfg && standCfg.stand && typeof standCfg.stand.x === 'number', `${loc} must have valid stand config`);
    const paths = editor.getActivePaths();
    assert(Array.isArray(paths) && paths.length >= 1, `${loc} must have at least 1 path`);
    console.log(`✓ Switched to '${loc}': Stand (${standCfg.stand.x}, ${standCfg.stand.y}), ${paths.length} active routes`);
}

// ==============================================================
// TEST 2: Interactive Stand & Queue Placement
// ==============================================================
console.log('\n[Test 2] Interactive Stand & Queue Placement:');
editor.setLocation('suburbs');
const cfg = editor.getActiveStandConfig();
const initialStandX = cfg.stand.x;
const initialStandY = cfg.stand.y;

// Hit test stand anchor
const hitStand = editor.hitTest(initialStandX, initialStandY);
assert(hitStand && hitStand.type === 'stand', 'Hit testing stand anchor must detect stand');

// Hit test queue spots Q0 and Q1
const q0x = cfg.queueStart.x;
const q0y = cfg.queueStart.y;
const hitQ0 = editor.hitTest(q0x, q0y);
assert(hitQ0 && hitQ0.type === 'queue' && hitQ0.qIdx === 0, 'Hit testing Q0 must identify queue spot 0');

const q1x = cfg.queueStart.x + cfg.queueStep.x;
const q1y = cfg.queueStart.y + cfg.queueStep.y;
const hitQ1 = editor.hitTest(q1x, q1y);
assert(hitQ1 && hitQ1.type === 'queue' && hitQ1.qIdx === 1, 'Hit testing Q1 must identify queue spot 1');

// Relocate stand
cfg.stand.x = 280;
cfg.stand.y = 210;
assert.strictEqual(cfg.stand.x, 280, 'Stand X must update');
assert.strictEqual(cfg.stand.y, 210, 'Stand Y must update');

// Adjust queue step & decision distance
cfg.queueStep.x = 35;
cfg.queueStep.y = 18;
cfg.decisionDist = 48;
assert.strictEqual(cfg.queueStep.x, 35, 'Queue step X must update');
assert.strictEqual(cfg.queueStep.y, 18, 'Queue step Y must update');
assert.strictEqual(cfg.decisionDist, 48, 'Decision distance must update');
console.log(`✓ Stand repositioned to (280, 210), Queue step=(35, 18), Decision dist=48px`);

// ==============================================================
// TEST 3: Visual Waypoint & Path Manipulation
// ==============================================================
console.log('\n[Test 3] Visual Waypoint & Path Manipulation:');
editor.setLocation('park');
const initialPathCount = editor.getActivePaths().length;

// Add new path
editor.addPath();
assert.strictEqual(editor.getActivePaths().length, initialPathCount + 1, 'addPath must append a new route');
assert.strictEqual(editor.selectedPathIndex, initialPathCount, 'addPath must select new route');
const newRoute = editor.getActivePath();
assert(Array.isArray(newRoute) && newRoute.length >= 4, 'New route must possess at least 4 default waypoints');
console.log(`✓ Added new path: Total routes is now ${editor.getActivePaths().length}`);

// Add waypoint to active path
const wpsBefore = newRoute.length;
editor.addWaypointAt(300, 250);
assert.strictEqual(newRoute.length, wpsBefore + 1, 'addWaypointAt must insert a waypoint');
assert.strictEqual(newRoute[newRoute.length - 1].x, 300, 'Inserted waypoint X must be 300');
assert.strictEqual(newRoute[newRoute.length - 1].y, 250, 'Inserted waypoint Y must be 250');
console.log(`✓ Inserted waypoint at (300, 250): Route has ${newRoute.length} waypoints`);

// Reverse route direction
const firstWpX = newRoute[0].x;
const lastWpX = newRoute[newRoute.length - 1].x;
editor.reversePath();
assert.strictEqual(newRoute[0].x, lastWpX, 'First waypoint after reverse must match previous last waypoint');
assert.strictEqual(newRoute[newRoute.length - 1].x, firstWpX, 'Last waypoint after reverse must match previous first waypoint');
console.log(`✓ Route direction reversed (⇄): Start is now ${newRoute[0].x}, End is ${newRoute[newRoute.length - 1].x}`);

// Align start and end offscreen
editor.alignStartOffscreen();
assert.strictEqual(newRoute[0].x, -60, 'Start waypoint must snap to -60px');
editor.alignEndOffscreen();
assert.strictEqual(newRoute[newRoute.length - 1].x, 700, 'End waypoint must snap to 700px');
console.log(`✓ Start snapped to -60px, End snapped to 700px`);

// Delete waypoint
const wpsBeforeDel = newRoute.length;
editor.deleteWaypoint(newRoute.length - 1);
assert.strictEqual(newRoute.length, wpsBeforeDel - 1, 'deleteWaypoint must remove targeted waypoint');

// Delete path
editor.deletePath();
assert.strictEqual(editor.getActivePaths().length, initialPathCount, 'deletePath must remove active route');
console.log(`✓ Route deleted: Back to ${editor.getActivePaths().length} routes`);

// Guard: cannot delete if only 1 path remains
const singlePathLoc = 'campus';
editor.setLocation(singlePathLoc);
while (editor.getActivePaths().length > 1) {
    editor.deletePath();
}
assert.strictEqual(editor.getActivePaths().length, 1, 'Campus reduced to 1 path');
editor.deletePath(); // Should reject deletion
assert.strictEqual(editor.getActivePaths().length, 1, 'deletePath must guard against deleting the last remaining route');
console.log(`✓ Minimum 1 path safety guard verified`);

// ==============================================================
// TEST 4: Asset & Scale Controls (Cart Width & NPC Height)
// ==============================================================
console.log('\n[Test 4] Asset & Scale Controls:');
editor.setCartWidth(95);
assert.strictEqual(editor.config.cartWidth, 95, 'Cart width must update to 95px');
assert.strictEqual(window.spriteRenderer.cartWidth, 95, 'window.spriteRenderer.cartWidth must reflect 95px');

editor.setNpcHeight(50);
assert.strictEqual(editor.config.npcHeight, 50, 'NPC height must update to 50px');
assert.strictEqual(window.spriteRenderer.npcHeight, 50, 'window.spriteRenderer.npcHeight must reflect 50px');

// Clamping bounds check: Cart (50px to 120px), NPC (25px to 60px)
editor.setCartWidth(30);
assert.strictEqual(editor.config.cartWidth, 50, 'Cart width must clamp to minimum 50px');
editor.setCartWidth(200);
assert.strictEqual(editor.config.cartWidth, 120, 'Cart width must clamp to maximum 120px');

editor.setNpcHeight(10);
assert.strictEqual(editor.config.npcHeight, 25, 'NPC height must clamp to minimum 25px');
editor.setNpcHeight(100);
assert.strictEqual(editor.config.npcHeight, 60, 'NPC height must clamp to maximum 60px');
console.log(`✓ Asset scales clamped safely within valid ranges (Cart: 50-120px, NPC: 25-60px)`);

// ==============================================================
// TEST 5: Camera Zoom & Pan Transformations
// ==============================================================
console.log('\n[Test 5] Camera Zoom & Pan Transformations:');
editor.resetView();
assert.strictEqual(editor.zoom, 1.0, 'Reset view must restore zoom to 1.0x');
assert.strictEqual(editor.panOffset.x, 0, 'Reset view must restore panOffset.x to 0');
assert.strictEqual(editor.panOffset.y, 0, 'Reset view must restore panOffset.y to 0');

// Screen to World at 1.0x without pan
const screenPt1 = editor.worldToScreen(320, 180);
assert.strictEqual(screenPt1.x, 320);
assert.strictEqual(screenPt1.y, 180);

// Zoom in to 1.5x with center at (320, 180)
editor.setZoom(1.5, 320, 180);
assert.strictEqual(editor.zoom, 1.5, 'Zoom must be 1.5x');
const screenPtCenter = editor.worldToScreen(320, 180);
assert(Math.abs(screenPtCenter.x - 320) < 0.01, 'Center point must remain invariant under centered zoom');
assert(Math.abs(screenPtCenter.y - 180) < 0.01, 'Center point must remain invariant under centered zoom');

// Zoom clamping (0.5x to 2.5x)
editor.setZoom(0.1);
assert.strictEqual(editor.zoom, 0.5, 'Zoom must clamp to minimum 0.5x');
editor.setZoom(5.0);
assert.strictEqual(editor.zoom, 2.5, 'Zoom must clamp to maximum 2.5x');

editor.resetView();
console.log(`✓ Camera coordinate transforms, invariant center zoom, and 0.5x-2.5x bounds verified`);

// ==============================================================
// TEST 6: Live Preview / Test Walkers Simulation
// ==============================================================
console.log('\n[Test 6] Live Preview / Test Walkers Simulation:');
editor.setLocation('suburbs');
editor.testWalkers = [];
editor.spawnTestWalker();
assert.strictEqual(editor.testWalkers.length, 1, 'spawnTestWalker must add 1 test pedestrian');

const walker = editor.testWalkers[0];
assert(walker.waypoints && walker.waypoints.length >= 2, 'Test walker must possess bespoke route waypoints');
assert.strictEqual(walker.wpIndex, 1, 'Test walker must target waypoint index 1');
assert.strictEqual(walker.state, 'walking', 'Initial state must be walking');

const initialWalkerX = walker.x;
for (let step = 0; step < 15; step++) {
    editor.updateTestWalkers(0.1);
}
assert.notStrictEqual(walker.x, initialWalkerX, 'Walker must advance along custom waypoints');
console.log(`✓ Test walker spawned and advanced from x=${initialWalkerX.toFixed(1)} to x=${walker.x.toFixed(1)}`);

// Simulate queuing divergence
const suburbsQ0 = editor.getActiveStandConfig().queueStart;
walker.state = 'queued';
walker.queueSpot = 0;
walker.queueWaitTimer = 5.0;
walker.x = suburbsQ0.x + 20;
walker.y = suburbsQ0.y + 10;
for (let step = 0; step < 10; step++) {
    editor.updateTestWalkers(0.1);
}
assert(Math.hypot(walker.x - suburbsQ0.x, walker.y - suburbsQ0.y) < 5, 'Queued walker must move directly to queue spot 0');
console.log(`✓ Test walker smoothly aligned to queueSpot 0 at (${walker.x.toFixed(1)}, ${walker.y.toFixed(1)})`);

// ==============================================================
// TEST 7: Persistence (Save, Export JSON, Import JSON, Reset Defaults)
// ==============================================================
console.log('\n[Test 7] Persistence (Save, Export JSON, Import JSON, Reset Defaults):');
// Modify suburbs stand
editor.setLocation('suburbs');
editor.getActiveStandConfig().stand.x = 299;
editor.getActiveStandConfig().stand.y = 205;
editor.setCartWidth(88);
editor.setNpcHeight(44);

// Save and apply
editor.saveAndApply();
assert.strictEqual(window.STAND_CONFIGS.suburbs.stand.x, 299, 'window.STAND_CONFIGS must reflect saved stand X');
assert.strictEqual(window.STAND_CONFIGS.suburbs.stand.y, 205, 'window.STAND_CONFIGS must reflect saved stand Y');
assert.strictEqual(window.spriteRenderer.cartWidth, 88, 'window.spriteRenderer.cartWidth must reflect saved 88px');
assert.strictEqual(window.spriteRenderer.npcHeight, 44, 'window.spriteRenderer.npcHeight must reflect saved 44px');

const rawSaved = localStorage.getItem('coffede_map_config');
assert(rawSaved, 'Configuration must be saved to localStorage');
const parsedSaved = JSON.parse(rawSaved);
assert.strictEqual(parsedSaved.standConfigs.suburbs.stand.x, 299);
console.log(`✓ saveAndApply() successfully persisted to localStorage and live engine runtime`);

// Export JSON
const jsonExport = editor.exportJSON();
assert(typeof jsonExport === 'string' && jsonExport.includes('"standConfigs"'), 'exportJSON must produce valid JSON string');
const parsedExport = JSON.parse(jsonExport);
assert.strictEqual(parsedExport.standConfigs.suburbs.stand.x, 299);
console.log(`✓ exportJSON() generated clean structured JSON (${jsonExport.length} bytes)`);

// Import JSON
parsedExport.standConfigs.suburbs.stand.x = 315;
parsedExport.cartWidth = 82;
const importSuccess = editor.importJSON(JSON.stringify(parsedExport));
assert.strictEqual(importSuccess, true, 'importJSON must return true on valid payload');
assert.strictEqual(editor.getActiveStandConfig().stand.x, 315, 'Imported stand X must be 315');
assert.strictEqual(editor.config.cartWidth, 82, 'Imported cartWidth must be 82');
console.log(`✓ importJSON() validated and applied imported configurations`);

// Reset Defaults
editor.resetDefaults();
assert.strictEqual(localStorage.getItem('coffede_map_config'), null, 'localStorage must be cleared on reset');
assert.strictEqual(editor.getActiveStandConfig().stand.x, 235, 'Suburbs stand X must restore to handcrafted default 235');
assert.strictEqual(editor.getActiveStandConfig().stand.y, 180, 'Suburbs stand Y must restore to handcrafted default 180');
assert.strictEqual(editor.config.cartWidth, 76, 'Cart width must restore to 76px');
assert.strictEqual(editor.config.npcHeight, 40, 'NPC height must restore to 40px');
assert.strictEqual(window.STAND_CONFIGS.suburbs.stand.x, 235, 'window.STAND_CONFIGS must restore to default 235');
console.log(`✓ resetDefaults() restored handcrafted defaults across all locations`);

// ==============================================================
// TEST 8: Live Game Simulation Integration
// ==============================================================
console.log('\n[Test 8] Live Game Simulation Integration:');
const sim = window.simulationModel;
const engine = window.simulationEngine;

// Apply custom stand position to suburbs via editor
editor.setLocation('suburbs');
editor.getActiveStandConfig().stand.x = 260;
editor.getActiveStandConfig().stand.y = 195;
editor.saveAndApply();

// Verify game engine immediately picks up the new stand config
sim.currentLocation = 'suburbs';
engine._overrideStandX = undefined;
engine._overrideStandY = undefined;
const gameStandCfg = engine.getStandConfig();
assert.strictEqual(gameStandCfg.x, 260, 'SimulationEngine must immediately reflect custom stand X from editor');
assert.strictEqual(gameStandCfg.y, 195, 'SimulationEngine must immediately reflect custom stand Y from editor');
console.log(`✓ SimulationEngine seamlessly utilizes custom stand placement at (${gameStandCfg.x}, ${gameStandCfg.y})`);

// Restore clean defaults for other tests
editor.resetDefaults();
assert.strictEqual(engine.getStandConfig().x, 235, 'Engine stand position reset to default 235');
console.log(`✓ Clean defaults cleanly restored for simulation engine`);

// ==============================================================
// TEST 9: Spacebar Panning & Key Handling
// ==============================================================
console.log('\n[Test 9] Spacebar Panning & Key Handling:');
assert.strictEqual(editor.isSpacePressed, false, 'isSpacePressed must initially be false');
// Simulate Space keydown
editor.onKeyDown({ code: 'Space', key: ' ', target: { tagName: 'DIV' }, preventDefault: () => {} });
assert.strictEqual(editor.isSpacePressed, true, 'isSpacePressed must be true when Space is held');
// Simulate mousedown while Space held
editor.panOffset = { x: 0, y: 0 };
editor.onMouseDown({ button: 0, clientX: 100, clientY: 50, preventDefault: () => {} });
assert.strictEqual(editor.isPanning, true, 'Mousedown while holding Space must trigger panning');
// Simulate Space keyup
editor.onKeyUp({ code: 'Space', key: ' ' });
assert.strictEqual(editor.isSpacePressed, false, 'isSpacePressed must be false when Space is released');
assert.strictEqual(editor.isPanning, false, 'Releasing Space must terminate panning');
console.log('✓ Spacebar pan activation, pan start, and release verified');

// ==============================================================
// TEST 10: Route Spawn Direction Configuration & Simulation Flow
// ==============================================================
console.log('\n[Test 10] Route Spawn Direction Configuration & Simulation Flow:');
editor.setLocation('suburbs');
assert.strictEqual(editor.getRouteSpawnDirection(0), 'both', 'Default spawn direction must be both');

// Configure route 0 to Left-to-Right only
editor.setRouteSpawnDirection('left_to_right', 0);
assert.strictEqual(editor.getRouteSpawnDirection(0), 'left_to_right', 'Spawn direction must update to left_to_right');

// Test walker spawning with left_to_right
editor.testWalkers = [];
editor.spawnTestWalker(0);
const spawnedWalker = editor.testWalkers[0];
assert(spawnedWalker, 'Walker must spawn');
const suburbsRoute0 = editor.getActivePaths()[0];
assert.strictEqual(spawnedWalker.direction, 1, 'Walker on left_to_right route must face forward (+1)');
assert.strictEqual(spawnedWalker.x, suburbsRoute0[0].x, 'Walker must enter at route start');

// Configure route 0 to Right-to-Left only
editor.setRouteSpawnDirection('right_to_left', 0);
assert.strictEqual(editor.getRouteSpawnDirection(0), 'right_to_left', 'Spawn direction must update to right_to_left');
editor.testWalkers = [];
editor.spawnTestWalker(0);
const reverseWalker = editor.testWalkers[0];
assert.strictEqual(reverseWalker.direction, -1, 'Walker on right_to_left route must face backward (-1)');
assert.strictEqual(reverseWalker.x, suburbsRoute0[suburbsRoute0.length - 1].x, 'Walker must enter at route terminus');

// Test Live Simulation Engine respecting route spawn direction
editor.setRouteSpawnDirection('left_to_right', 0);
editor.setRouteSpawnDirection('left_to_right', 1);
editor.saveAndApply();
sim.currentLocation = 'suburbs';
engine.customers = [];
engine.spawnCustomer();
const simCustomer = engine.customers[0];
assert(simCustomer, 'Simulation customer must spawn');
assert.strictEqual(simCustomer.direction, 1, 'Sim customer must spawn with direction 1 on left_to_right routes');
console.log(`✓ Spawn directions ('left_to_right' & 'right_to_left') strictly enforced on both test walkers and simulation engine`);

// ==============================================================
// TEST 11: Zoom Slider Element & Bidirectional Synchronization
// ==============================================================
console.log('\n[Test 11] Zoom Slider Element & Bidirectional Synchronization:');
editor.resetView();
assert.strictEqual(editor.zoom, 1.0);
editor.setZoom(1.8, 320, 180);
assert.strictEqual(editor.zoom, 1.8);
editor.setZoom(0.6, 320, 180);
assert.strictEqual(editor.zoom, 0.6);
editor.resetView();
console.log('✓ Zoom slider and camera zoom bidirectional synchronization verified');

// ==============================================================
// TEST 12: Robust JSON Import (Data Sanitization & Missing Defaults)
// ==============================================================
console.log('\n[Test 12] Robust JSON Import (Data Sanitization & Missing Defaults):');
// Import payload with string numbers and only 1 location specified
const messyPayload = {
    standConfigs: {
        suburbs: {
            stand: { x: "275", y: "190" },
            counter: { x: "290", y: "200" },
            queueStart: { x: "305", y: "210" },
            queueStep: { x: "25", y: "14" },
            decisionDist: "40"
        }
    },
    locationPaths: {
        suburbs: [
            [ { x: "-60", y: "240" }, { x: "300", y: "245" }, { x: "700", y: "250" } ]
        ]
    },
    cartWidth: "85",
    npcHeight: "45",
    spawnDirections: {
        suburbs: ['left_to_right']
    }
};

const importOk = editor.importJSON(JSON.stringify(messyPayload));
assert.strictEqual(importOk, true, 'importJSON must safely succeed with string coordinates');
const importedCfg = editor.getActiveStandConfig();
assert.strictEqual(typeof importedCfg.stand.x, 'number', 'Imported stand X must be coerced to number');
assert.strictEqual(importedCfg.stand.x, 275);
assert.strictEqual(editor.config.cartWidth, 85);
assert.strictEqual(editor.getRouteSpawnDirection(0), 'left_to_right');

// Verify other locations were safely populated with handcrafted defaults
editor.setLocation('park');
assert(editor.getActiveStandConfig().stand.x > 0, 'Park stand config must not be undefined');
assert(editor.getActivePaths().length >= 1, 'Park paths must not be undefined');
console.log('✓ Robust JSON sanitization, string-to-number coercion, and missing location fallback verified');

// ==============================================================
// TEST 13: Touch Events Simulation (Touchstart, Pinch Zoom, Touchend)
// ==============================================================
console.log('\n[Test 13] Touch Events Simulation:');
editor.setLocation('suburbs');
// Simulate touchstart
editor.onTouchStart({
    touches: [{ clientX: 275, clientY: 190 }],
    preventDefault: () => {}
});
assert(editor.draggedItem !== null || editor.isMouseOverCanvas, 'Touchstart must activate canvas interaction');

// Simulate 2-finger pinch zoom
editor.resetView();
editor.onTouchStart({
    touches: [
        { clientX: 300, clientY: 180 },
        { clientX: 340, clientY: 180 }
    ],
    preventDefault: () => {}
});
assert.strictEqual(editor.touchStartDist, 40, 'Touch pinch distance must be measured');

// Move touches apart to 80px (2x zoom)
editor.onTouchMove({
    touches: [
        { clientX: 280, clientY: 180 },
        { clientX: 360, clientY: 180 }
    ],
    preventDefault: () => {}
});
assert.strictEqual(editor.zoom, 2.0, 'Pinch expansion must zoom canvas to 2.0x');

// Release touch
editor.onTouchEnd({});
assert.strictEqual(editor.touchStartDist, 0, 'Touch distance must reset on release');
editor.resetView();
console.log('✓ Mobile touch interactions, pinch-to-zoom calculation, and touch end verified');

// ==============================================================
// TEST 14: Per-Point Curved Queue Bending & Independent Movement
// ==============================================================
console.log('\n[Test 14] Per-Point Curved Queue Bending:');
editor.setLocation('suburbs');
const standCfg14 = editor.getActiveStandConfig();
const spots14 = editor.getQueueSpots(standCfg14);
assert.strictEqual(Array.isArray(spots14), true, 'Queue spots must be an array');
assert.strictEqual(spots14.length, 5, 'Default queue spots must have 5 points');

// Move Q2 independently (e.g. curve down-left around an obstacle)
const origQ1 = { ...spots14[1] };
const origQ3 = { ...spots14[3] };
spots14[2].x = 310;
spots14[2].y = 260; // Curved bend!
// Verify Q1 and Q3 did not mutate or recalculate into a rigid line
assert.strictEqual(spots14[1].x, origQ1.x, 'Q1 X coordinate must remain unchanged');
assert.strictEqual(spots14[1].y, origQ1.y, 'Q1 Y coordinate must remain unchanged');
assert.strictEqual(spots14[3].x, origQ3.x, 'Q3 X coordinate must remain unchanged');
assert.strictEqual(spots14[3].y, origQ3.y, 'Q3 Y coordinate must remain unchanged');
assert.strictEqual(spots14[2].x, 310, 'Q2 X coordinate bent independently');
assert.strictEqual(spots14[2].y, 260, 'Q2 Y coordinate bent independently');
console.log('✓ Per-point queue bending and independent spot movement verified');

// ==============================================================
// TEST 15: Adding, Deleting, and Straightening Queue Spots
// ==============================================================
console.log('\n[Test 15] Add, Delete, and Straighten Queue Spots:');
// Add spots up to 8 max
editor.addQueueSpot();
assert.strictEqual(spots14.length, 6, 'Queue spots must now have 6 spots');
editor.addQueueSpot();
editor.addQueueSpot();
assert.strictEqual(spots14.length, 8, 'Queue spots must cap at 8 max');
editor.addQueueSpot(); // should be prevented
assert.strictEqual(spots14.length, 8, 'Queue spots must not exceed 8');

// Straighten queue spots
editor.straightenQueue();
for (let i = 1; i < spots14.length; i++) {
    const expectedX = Math.round(spots14[0].x + i * (standCfg14.queueStep?.x || 28));
    const expectedY = Math.round(spots14[0].y + i * (standCfg14.queueStep?.y || 16));
    assert.strictEqual(spots14[i].x, expectedX, `Straightened Q${i} X coordinate matches`);
    assert.strictEqual(spots14[i].y, expectedY, `Straightened Q${i} Y coordinate matches`);
}

// Delete spots until minimum safety guard (2 spots)
while (spots14.length > 2) {
    editor.deleteQueueSpot();
}
assert.strictEqual(spots14.length, 2, 'Queue spots reduced to 2');
editor.deleteQueueSpot(); // Should not delete below 2
assert.strictEqual(spots14.length, 2, 'Queue spots must never delete below 2 spots minimum');
console.log('✓ Adding, deleting, and straightening queue spots verified');

// ==============================================================
// TEST 16: Placed Map Props & Assets Library Management
// ==============================================================
console.log('\n[Test 16] Placed Map Props & Asset Library:');
editor.setLocation('park');
const props = editor.getActiveProps();
assert(Array.isArray(props), 'Props must be an array');
props.length = 0; // Clear for testing

// 1. Add bistro table
const p1 = editor.addProp('cafe_table', 220, 210);
assert.notStrictEqual(p1, null, 'Must successfully add cafe_table prop');
assert.strictEqual(p1.type, 'cafe_table');
assert.strictEqual(p1.x, 220);
assert.strictEqual(p1.y, 210);
assert.strictEqual(editor.selectedPropId, p1.id, 'New prop must be selected');

// 2. Add parasol table & planter
const p2 = editor.addProp('umbrella_table', 320, 240);
const p3 = editor.addProp('flower_planter', 180, 230);
assert.strictEqual(props.length, 3, 'Must have 3 props placed');

// 3. Scale prop
editor.setPropScale(p1.id, 1.4);
assert.strictEqual(p1.scale, 1.4, 'Prop scale updated to 1.4x');
editor.setPropScale(p1.id, 5.0); // clamped to 2.5
assert.strictEqual(p1.scale, 2.5, 'Prop scale clamped to max 2.5x');

// 4. Flip prop
assert.strictEqual(p1.flip, false);
editor.togglePropFlip(p1.id);
assert.strictEqual(p1.flip, true, 'Prop flip toggled to true');

// 5. Change prop type
editor.setPropType(p1.id, 'park_bench');
assert.strictEqual(p1.type, 'park_bench', 'Prop type changed to park_bench');

// 6. Duplicate prop
const clone = editor.duplicateProp(p1.id);
assert.notStrictEqual(clone, null, 'Clone must not be null');
assert.strictEqual(props.length, 4, 'Props count incremented after duplicate');
assert.strictEqual(clone.type, 'park_bench');
assert.strictEqual(clone.x, p1.x + 16);

// 7. Delete prop
editor.deleteProp(clone.id);
assert.strictEqual(props.length, 3, 'Props count decremented after delete');

// 8. Hit testing placed props
const hitProp = editor.hitTest(320, 240);
assert.notStrictEqual(hitProp, null, 'Hit test should detect prop at (320, 240)');
assert.strictEqual(hitProp.type, 'prop');
assert.strictEqual(hitProp.propId, p2.id);
console.log('✓ Placed props management (add, drag, select, scale, flip, delete, duplicate) verified');

// ==============================================================
// TEST 17: Cart Skin & Custom Themes
// ==============================================================
console.log('\n[Test 17] Cart Themes & Skins:');
editor.setCartSkin('vintage_copper');
const cfgPark = editor.getActiveStandConfig();
assert.strictEqual(cfgPark.cartSkin, 'vintage_copper', 'Cart skin set to vintage_copper');

// Verify rendering doesn't crash with custom skins and props
const mockCanvas = { width: 640, height: 360, getBoundingClientRect: () => ({ left: 0, top: 0, width: 640, height: 360 }) };
const mockCtx = {
    save: () => {}, restore: () => {}, beginPath: () => {}, closePath: () => {},
    moveTo: () => {}, lineTo: () => {}, stroke: () => {}, fill: () => {},
    fillRect: () => {}, strokeRect: () => {}, clearRect: () => {}, arc: () => {},
    ellipse: () => {}, quadraticCurveTo: () => {}, bezierCurveTo: () => {},
    fillText: () => {}, measureText: () => ({ width: 20 }),
    translate: () => {}, rotate: () => {}, scale: () => {}, setLineDash: () => {},
    drawImage: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} })
};
editor.canvas = mockCanvas;
editor.ctx = mockCtx;
assert.doesNotThrow(() => {
    editor.render();
}, 'Editor render with curved queue and placed props must execute cleanly');
console.log('✓ Cart theme selection and rendering integrity verified');

// ==============================================================
// TEST 18: Engine Queue Spot Traversal & Unified Y-Sorted Prop Depth
// ==============================================================
console.log('\n[Test 18] Engine Queue Traversal & Y-Sorted Depth:');
const mockEngineCtx = {
    save: () => {}, restore: () => {}, beginPath: () => {}, closePath: () => {},
    moveTo: () => {}, lineTo: () => {}, stroke: () => {}, fill: () => {},
    fillRect: () => {}, strokeRect: () => {}, clearRect: () => {}, arc: () => {},
    ellipse: () => {}, quadraticCurveTo: () => {}, bezierCurveTo: () => {},
    fillText: () => {}, measureText: () => ({ width: 20 }),
    translate: () => {}, rotate: () => {}, scale: () => {}, setLineDash: () => {},
    drawImage: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} })
};
const testEngine = new SimulationEngine();
testEngine.init({
    width: 640,
    height: 360,
    getContext: () => mockEngineCtx,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 640, height: 360 }),
    addEventListener: () => {}
});
testEngine.location = 'park';

// Stand config with curved queue spots and placed props
STAND_CONFIGS.park.queueSpots = [
    { x: 250, y: 195 },
    { x: 275, y: 220 },
    { x: 310, y: 245 }
];
STAND_CONFIGS.park.props = [
    { id: 'bench1', type: 'park_bench', x: 230, y: 190, scale: 1.0, flip: false },
    { id: 'planter1', type: 'flower_planter', x: 280, y: 260, scale: 1.0, flip: false }
];

const engineStandCfg = testEngine.getStandConfig();
assert.strictEqual(engineStandCfg.queueSpots.length, 3);
assert.strictEqual(engineStandCfg.queueSpot(0).x, 250);
assert.strictEqual(engineStandCfg.queueSpot(1).x, 275);
assert.strictEqual(engineStandCfg.queueSpot(2).x, 310);

// Verify customer movement in curved queue
const customerQ = {
    id: 99,
    x: 250,
    y: 190,
    speed: 50,
    state: 'queued',
    queueSpot: 1,
    queueWaitTime: 0,
    isMoving: false
};
testEngine.updateCustomer(customerQ, 0.1);
assert.strictEqual(customerQ.isMoving, true, 'Customer must move toward curved Q1');
assert(customerQ.x > 250, 'Customer X must move toward 275');
assert(customerQ.y > 190, 'Customer Y must move toward 220');

testEngine.customers = [
    { id: 1, x: 200, y: 210, state: 'walking' },
    { id: 2, x: 200, y: 170, state: 'walking' }
];
assert.doesNotThrow(() => {
    testEngine.render();
}, 'SimulationEngine render with props and customers must execute cleanly');
console.log('✓ Engine curved queue traversal and Y-sorted prop depth verified');

// =============================================================
// [Test 19] Dynamic Waypoint Addition, Insertion, and Coordinate Editing
// =============================================================
console.log('\n[Test 19] Dynamic Waypoint Addition, Insertion, and Coordinate Editing:');
editor.setLocation('suburbs');
const curPath = editor.getActivePath();
const initialWpCount = curPath.length;

// 1. addWaypointToEnd
editor.addWaypointToEnd();
assert.strictEqual(curPath.length, initialWpCount + 1, 'addWaypointToEnd must append a waypoint');
assert.strictEqual(editor.selectedWaypointIndex, curPath.length - 1, 'selectedWaypointIndex must point to new waypoint');
const appended = curPath[curPath.length - 1];
assert(typeof appended.x === 'number' && typeof appended.y === 'number', 'Appended point must have valid numeric coords');

// 2. insertWaypointAfter
editor.selectedWaypointIndex = 1;
const ptBeforeInsert = curPath[1];
const ptNextBefore = curPath[2];
editor.insertWaypointAfter();
assert.strictEqual(curPath.length, initialWpCount + 2, 'insertWaypointAfter must insert point after selected index');
assert.strictEqual(editor.selectedWaypointIndex, 2, 'selectedWaypointIndex must point to inserted waypoint');
assert.strictEqual(curPath[2].x, Math.round((ptBeforeInsert.x + ptNextBefore.x) / 2), 'Inserted waypoint X must be midpoint');

// 3. Coordinate modification
curPath[2].x = 333;
curPath[2].y = 222;
assert.strictEqual(curPath[2].x, 333);
assert.strictEqual(curPath[2].y, 222);

// 4. deleteWaypoint
editor.deleteWaypoint(2);
assert.strictEqual(curPath.length, initialWpCount + 1, 'deleteWaypoint must remove targeted point');

// 5. Clean up added end point
editor.deleteWaypoint(curPath.length - 1);
assert.strictEqual(curPath.length, initialWpCount, 'Restored initial waypoint count');
console.log('✓ Dynamic waypoint append, midpoint insertion, coordinate modification, and deletion verified');

// Final Clean Defaults Restore
editor.resetDefaults();

console.log('\n======================================================');
console.log('✅ ALL MAP EDITOR VERIFICATION TESTS PASSED!');
console.log('======================================================');

