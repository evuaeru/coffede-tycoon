// Comprehensive Verification Suite for 20 Map Locations (Lemonade Tycoon Style Progression)
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock browser globals
global.window = global;
global.requestAnimationFrame = () => {};
global.cancelAnimationFrame = () => {};
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
require('./js/editor.js');

console.log('--- STARTING 20 MAP LOCATIONS COMPREHENSIVE VERIFICATION ---');

const sim = window.simulationModel;
const engine = window.simulationEngine;
const renderer = window.spriteRenderer;
const { MapEditor } = require('./js/editor.js');
const editor = new MapEditor();

const EXPECTED_20_LOCATIONS = [
    // Tier 1: Starter / Quiet Neighborhoods ($0 - $15/day)
    { id: 'cul_de_sac', tier: 'Tier 1 (Starter)', exactRent: 0, maxRent: 15, minTraffic: 20 },
    { id: 'community_garden', tier: 'Tier 1 (Starter)', exactRent: 5, maxRent: 15, minTraffic: 25 },
    { id: 'public_library', tier: 'Tier 1 (Starter)', exactRent: 10, maxRent: 15, minTraffic: 30 },
    { id: 'suburbs', tier: 'Tier 1 (Starter)', exactRent: 15, maxRent: 15, minTraffic: 40 },

    // Tier 2: Charming Getaways & Scenic Spots ($22 - $45/day)
    { id: 'lake_marina', tier: 'Tier 2 (Charming)', exactRent: 22, maxRent: 45, minTraffic: 45 },
    { id: 'campsite', tier: 'Tier 2 (Charming)', exactRent: 28, maxRent: 45, minTraffic: 50 },
    { id: 'farmers_market', tier: 'Tier 2 (Charming)', exactRent: 35, maxRent: 45, minTraffic: 60 },
    { id: 'park', tier: 'Tier 2 (Charming)', exactRent: 45, maxRent: 45, minTraffic: 70 },

    // Tier 3: High-Traffic Hubs ($55 - $90/day)
    { id: 'beach_boardwalk', tier: 'Tier 3 (High-Traffic)', exactRent: 55, maxRent: 90, minTraffic: 80 },
    { id: 'construction_site', tier: 'Tier 3 (High-Traffic)', exactRent: 65, maxRent: 90, minTraffic: 85 },
    { id: 'art_district', tier: 'Tier 3 (High-Traffic)', exactRent: 75, maxRent: 90, minTraffic: 90 },
    { id: 'campus', tier: 'Tier 3 (High-Traffic)', exactRent: 90, maxRent: 90, minTraffic: 100 },

    // Tier 4: Bustling Commercial Hubs ($110 - $165/day)
    { id: 'amusement_pier', tier: 'Tier 4 (Bustling)', exactRent: 110, maxRent: 165, minTraffic: 120 },
    { id: 'sports_complex', tier: 'Tier 4 (Bustling)', exactRent: 125, maxRent: 165, minTraffic: 130 },
    { id: 'shopping_mall', tier: 'Tier 4 (Bustling)', exactRent: 145, maxRent: 165, minTraffic: 140 },
    { id: 'hospital_plaza', tier: 'Tier 4 (Bustling)', exactRent: 165, maxRent: 165, minTraffic: 150 },

    // Tier 5: Megacity Peak Transit & Finance ($190 - $300/day)
    { id: 'metro', tier: 'Tier 5 (Megacity Peak)', exactRent: 190, maxRent: 300, minTraffic: 180 },
    { id: 'convention_center', tier: 'Tier 5 (Megacity Peak)', exactRent: 220, maxRent: 300, minTraffic: 200 },
    { id: 'downtown', tier: 'Tier 5 (Megacity Peak)', exactRent: 250, maxRent: 300, minTraffic: 210 },
    { id: 'airport_terminal', tier: 'Tier 5 (Megacity Peak)', exactRent: 300, maxRent: 300, minTraffic: 230 }
];

// [Test 1] Simulation Model Locations Catalog & Economic Progression
console.log('\n[Test 1] Simulation Model Locations Catalog & Economic Progression:');
const locCatalog = sim.getLocations();
assert.strictEqual(Object.keys(locCatalog).length, 20, 'getLocations must return exactly 20 locations');

let prevRent = -1;
let prevTraffic = -1;

EXPECTED_20_LOCATIONS.forEach((expected, idx) => {
    const loc = locCatalog[expected.id];
    assert(loc, `Location '${expected.id}' must exist in getLocations()`);
    assert.strictEqual(loc.id, expected.id, `Location id must match`);
    assert(loc.name && loc.name.length > 2, `Location '${expected.id}' must have a descriptive name`);
    assert(loc.tier.includes(expected.tier.split(' ')[0]), `Location '${expected.id}' tier mismatch`);
    assert.strictEqual(loc.rent, expected.exactRent, `Location '${expected.id}' rent must be $${expected.exactRent}/day`);
    assert(typeof loc.rent === 'number' && loc.rent <= expected.maxRent, `Location rent within tier limit`);
    assert(typeof loc.baseFootTraffic === 'number' && loc.baseFootTraffic >= expected.minTraffic, `Location foot traffic within tier limit`);
    assert(typeof loc.basePriceTolerance === 'number' && loc.basePriceTolerance >= 2.50, `Price tolerance must be valid`);
    assert(Array.isArray(loc.preferredArchetypes) && loc.preferredArchetypes.length >= 4, `Location must have demographic preferences`);
    assert(loc.description && loc.description.length > 15, `Location must have lore description`);

    // Verify realistic rent-to-revenue ratio (daily rent never exceeds 20% of baseline traffic * price tolerance)
    const theoreticalPotential = loc.baseFootTraffic * loc.basePriceTolerance;
    assert(loc.rent <= theoreticalPotential * 0.20, `Location '${expected.id}' rent ($${loc.rent}) must be realistic (<=20% of $${theoreticalPotential.toFixed(2)} potential)`);

    // Verify upward economic progression across tiers
    assert(loc.rent >= prevRent, `Rent must monotonically increase along progression (found $${loc.rent} after $${prevRent})`);
    assert(loc.baseFootTraffic >= prevTraffic, `Foot traffic must monotonically increase along progression (found ${loc.baseFootTraffic} after ${prevTraffic})`);
    prevRent = loc.rent;
    prevTraffic = loc.baseFootTraffic;

    console.log(`✓ [${idx + 1}/20] ${loc.name} (${loc.tier}): Rent $${loc.rent}/day, Traffic ~${loc.baseFootTraffic} patrons, Price Tol ~$${loc.basePriceTolerance}`);
});

// [Test 2] Stand Configuration & Queue Spot Integrity
console.log('\n[Test 2] Stand Configuration & Queue Spot Integrity:');
EXPECTED_20_LOCATIONS.forEach(expected => {
    const cfg = window.STAND_CONFIGS[expected.id];
    assert(cfg, `STAND_CONFIGS must define stand for '${expected.id}'`);
    assert(cfg.stand && typeof cfg.stand.x === 'number' && typeof cfg.stand.y === 'number', `Stand coordinates valid`);
    assert(cfg.counter && typeof cfg.counter.x === 'number' && typeof cfg.counter.y === 'number', `Counter coordinates valid`);
    assert(cfg.queueStart && typeof cfg.queueStart.x === 'number' && typeof cfg.queueStart.y === 'number', `QueueStart coordinates valid`);
    assert(cfg.queueStep && typeof cfg.queueStep.x === 'number' && typeof cfg.queueStep.y === 'number', `QueueStep coordinates valid`);
    assert(typeof cfg.decisionDist === 'number' && cfg.decisionDist >= 30, `Decision distance valid`);

    // Engine runtime delegation check
    sim.currentLocation = expected.id;
    engine._overrideStandX = undefined;
    engine._overrideStandY = undefined;
    assert.strictEqual(engine.standX, cfg.stand.x, `${expected.id} engine.standX must match STAND_CONFIGS`);
    assert.strictEqual(engine.standY, cfg.stand.y, `${expected.id} engine.standY must match STAND_CONFIGS`);
    const q0 = engine.queueSpot(0);
    assert(typeof q0.x === 'number' && typeof q0.y === 'number', `${expected.id} Q0 spot valid`);
});
console.log('✓ All 20 locations have verified stand positions, counters, and queue trajectories');

// [Test 3] Bespoke Pedestrian Waypoint Routes (LOCATION_PATHS)
console.log('\n[Test 3] Bespoke Pedestrian Waypoint Routes:');
EXPECTED_20_LOCATIONS.forEach(expected => {
    const paths = window.LOCATION_PATHS[expected.id];
    assert(Array.isArray(paths) && paths.length >= 2, `${expected.id} must define at least 2 distinct pedestrian routes`);
    paths.forEach((route, rIdx) => {
        assert(Array.isArray(route) && route.length >= 4, `${expected.id} route ${rIdx} must have at least 4 waypoints`);
        // Check entry and exit bounds
        const start = route[0];
        const end = route[route.length - 1];
        assert(start.x <= 0 || start.x >= 600, `${expected.id} route ${rIdx} start offscreen`);
        assert(end.x <= 0 || end.x >= 600, `${expected.id} route ${rIdx} end offscreen`);
    });
});
console.log('✓ All 20 locations have verified entry/exit pedestrian waypoint routes');

// [Test 4] SpriteRenderer Preloaded Asset Mapping & Background Registration
console.log('\n[Test 4] SpriteRenderer Preloaded Asset Mapping:');
EXPECTED_20_LOCATIONS.forEach(expected => {
    assert(expected.id in renderer.locationBgs, `locationBgs must have key '${expected.id}'`);
    assert(expected.id in renderer.locationBgsLoaded, `locationBgsLoaded must have key '${expected.id}'`);
});
console.log('✓ SpriteRenderer background cache maps all 20 location keys');

// [Test 5] 15 Generated Disk Backgrounds & 5 Procedural Fallbacks
console.log('\n[Test 5] Disk Background Assets & Procedural Rendering Verification:');
let diskAssetsCount = 0;
let proceduralFallbacksCount = 0;

EXPECTED_20_LOCATIONS.forEach(expected => {
    const fileName = `${expected.id}_bg.jpg`;
    const filePath = path.join(__dirname, 'assets', fileName);
    const exists = fs.existsSync(filePath);

    const mockCtx = {
        save() {},
        restore() {},
        beginPath() {},
        moveTo() {},
        lineTo() {},
        closePath() {},
        stroke() {},
        fill() {},
        fillRect(x, y, w, h) { this.fillCount = (this.fillCount || 0) + 1; },
        strokeRect() {},
        ellipse() {},
        arc() {},
        bezierCurveTo() {},
        quadraticCurveTo() {},
        fillText() {},
        drawImage(img, x, y, w, h) { this.drawnImg = true; }
    };

    if (exists) {
        diskAssetsCount++;
        const stat = fs.statSync(filePath);
        assert(stat.size > 100000, `Background file ${fileName} must be substantial (found ${stat.size} bytes)`);

        // Mock pre-rendered image loaded state
        renderer.locationBgsLoaded[expected.id] = true;
        renderer.locationBgs[expected.id] = { width: 1376, height: 768, src: fileName };
        if (expected.id === 'suburbs') renderer.suburbsBgLoaded = true;

        renderer.renderLocationBackdrop(mockCtx, 640, 360, expected.id, 200, { type: 'sunny' });
        assert(mockCtx.drawnImg, `Location '${expected.id}' must draw pre-rendered background image`);
        console.log(`✓ Location [${expected.id}]: 16-bit pre-rendered JPEG verified (${(stat.size / 1024).toFixed(0)} KB)`);
    } else {
        proceduralFallbacksCount++;
        // Test procedural fallback
        renderer.locationBgsLoaded[expected.id] = false;
        if (expected.id === 'suburbs') renderer.suburbsBgLoaded = false;

        renderer.renderLocationBackdrop(mockCtx, 640, 360, expected.id, 200, { type: 'sunny' });
        assert((mockCtx.fillCount || 0) >= 3, `Location '${expected.id}' procedural fallback must render layered canvas geometry`);
        console.log(`✓ Location [${expected.id}]: High-detail procedural 16-bit canvas fallback verified (ops: ${mockCtx.fillCount})`);
    }
});

assert.strictEqual(diskAssetsCount, 20, 'All 20 locations must have pre-rendered background JPEG assets on disk');
assert.strictEqual(proceduralFallbacksCount, 0, 'No locations rely on procedural fallbacks when all 20 assets are present');

// [Test 6] Map Editor Integration Across All 20 Locations
console.log('\n[Test 6] Map Editor 20-Location Switching & Persistent Configs:');
assert.strictEqual(editor.locations.length, 20, 'MapEditor must support all 20 locations');
EXPECTED_20_LOCATIONS.forEach(expected => {
    editor.setLocation(expected.id);
    assert.strictEqual(editor.currentLocation, expected.id, `MapEditor must switch active location to '${expected.id}'`);
    const standCfg = editor.getActiveStandConfig();
    assert(standCfg && standCfg.stand && typeof standCfg.stand.x === 'number', `${expected.id} stand config valid`);
    const paths = editor.getActivePaths();
    assert(Array.isArray(paths) && paths.length >= 1, `${expected.id} routes valid`);
});
console.log('✓ Map Editor seamlessly navigates and edits all 20 locations');

// [Test 7] Foreground Layer Clipping & Stand/NPC Pixel Preservation Across All 20 Locations
console.log('\n[Test 7] Foreground Layer Clipping & Stand/NPC Pixel Preservation (All 20 Locations):');
(async () => {
    const { createCanvas, loadImage } = require('@napi-rs/canvas');

    for (const expected of EXPECTED_20_LOCATIONS) {
        const locId = expected.id;

        // 7a. Verify mock context receives clip() and occlusion rects for every location
        const mockFgCtx = {
            save() {},
            restore() {},
            beginPath() { this.began = true; },
            rect(x, y, w, h) { this.rects.push({ x, y, w, h }); },
            moveTo(x, y) { this.moves.push({ x, y }); },
            lineTo(x, y) { this.lines.push({ x, y }); },
            closePath() {},
            clip() { this.clipped = true; },
            drawImage(img, x, y, w, h) { this.drawn = { img, x, y, w, h }; },
            rects: [],
            moves: [],
            lines: [],
            clipped: false,
            drawn: null
        };

        renderer.locationBgsLoaded[locId] = true;
        if (locId === 'suburbs') renderer.suburbsBgLoaded = true;
        renderer.renderForegroundLayer(mockFgCtx, 640, 360, locId, { type: 'sunny' });
        assert.strictEqual(mockFgCtx.clipped, true, `Location '${locId}' MUST call ctx.clip() in renderForegroundLayer`);
        assert(mockFgCtx.rects.length >= 1, `Location '${locId}' MUST define foreground clipping rects`);

        // 7b. Verify safety if ctx.clip is missing (must NEVER draw unclipped full-canvas bgImg)
        const noClipCtx = {
            save() {},
            restore() {},
            beginPath() {},
            rect() {},
            drawImage() { this.unclippedDraw = true; },
            unclippedDraw: false
        };
        renderer.renderPreRenderedForeground(noClipCtx, 640, 360, locId, renderer.locationBgs[locId], { type: 'sunny' });
        assert.strictEqual(noClipCtx.unclippedDraw, false, `Location '${locId}' must NEVER draw bgImg when ctx.clip is unavailable`);

        // 7c. Real pixel verification with @napi-rs/canvas: stand and walkway NPC pixels must remain visible after renderForegroundLayer
        const bg = await loadImage(path.join(__dirname, 'assets', `${locId}_bg.jpg`));
        renderer.locationBgs[locId] = bg;
        renderer.locationBgsLoaded[locId] = true;
        if (locId === 'suburbs') {
            renderer.suburbsBg = bg;
            renderer.suburbsBgLoaded = true;
        }

        const canvas = createCanvas(640, 360);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bg, 0, 0, 640, 360);

        const standCfg = window.STAND_CONFIGS[locId];
        const waypoint = window.LOCATION_PATHS[locId][0][2]; // Mid-plaza pedestrian waypoint

        // Paint bright magenta marker at Coffee Stand position & Mid-Plaza Pedestrian position
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(standCfg.stand.x - 10, standCfg.stand.y - 20, 20, 20);
        ctx.fillRect(waypoint.x - 6, waypoint.y - 20, 12, 20);

        // Execute foreground occlusion pass
        renderer.renderForegroundLayer(ctx, 640, 360, locId, { type: 'sunny' });

        const standPx = ctx.getImageData(standCfg.stand.x, standCfg.stand.y - 10, 1, 1).data;
        const npcPx = ctx.getImageData(waypoint.x, waypoint.y - 10, 1, 1).data;
        const standVisible = standPx[0] > 180 && standPx[2] > 180 && standPx[1] < 60;
        const npcVisible = npcPx[0] > 180 && npcPx[2] > 180 && npcPx[1] < 60;

        assert(standVisible, `Location '${locId}' coffee stand at (${standCfg.stand.x}, ${standCfg.stand.y}) was overwritten by foreground layer!`);
        assert(npcVisible, `Location '${locId}' NPC at (${waypoint.x}, ${waypoint.y}) was overwritten by foreground layer!`);
    }
    console.log('✓ All 20 locations verified with real pixel buffer checks: stand & NPCs are never overwritten by foreground layer');

    // [Test 8] Legacy 5-Location localStorage Merge & Post-Skip Morning Clock Reset
    console.log('\n[Test 8] Legacy 5-Location localStorage Merge & Post-Skip Morning Clock Reset:');
    global.localStorage.setItem('coffede_map_config', JSON.stringify({
        standConfigs: { suburbs: window.DEFAULT_STAND_CONFIGS.suburbs },
        locationPaths: { suburbs: window.DEFAULT_LOCATION_PATHS.suburbs }
    }));
    const mergedEditor = new MapEditor();
    assert(mergedEditor.config.standConfigs.public_library, 'MapEditor must preserve public_library stand config when loading legacy localStorage');
    assert(mergedEditor.config.locationPaths.public_library, 'MapEditor must preserve public_library paths when loading legacy localStorage');
    global.localStorage.removeItem('coffede_map_config');

    // Verify skipping day at 09:42 AM fires onDayTick('06:00 PM', 1.0) and resets currentMinute to 08:00 AM (480) for next morning
    sim.currentLocation = 'public_library';
    let lastTickTime = null;
    let lastTickProg = null;
    engine.onDayTick = (t, p) => {
        lastTickTime = t;
        lastTickProg = p;
    };
    engine.startDay();
    engine.currentMinute = 9 * 60 + 42; // 09:42 AM
    engine.skipToEndOfDay();
    assert.strictEqual(lastTickTime, '06:00 PM', 'skipToEndOfDay/finishDay must notify onDayTick with 06:00 PM');
    assert.strictEqual(lastTickProg, 1.0, 'skipToEndOfDay/finishDay must notify onDayTick with progress 1.0');
    assert.strictEqual(engine.isRunning, false, 'Engine must not be running after skipToEndOfDay');
    assert.strictEqual(engine.currentMinute, engine.dayStartMinute, 'Engine currentMinute must reset to dayStartMinute (08:00 AM) after day ends');

    // Verify weather atmosphere on 15 new locations (e.g. public_library) never draws floating mid-air bars at y=315..316
    const weatherRects = [];
    const mockWeatherCtx = {
        save() {},
        restore() {},
        fillRect(x, y, w, h) { weatherRects.push({ x, y, w, h }); }
    };
    renderer.renderForegroundWeatherAtmosphere(mockWeatherCtx, 640, 360, 'public_library', { type: 'rainy' });
    renderer.renderForegroundWeatherAtmosphere(mockWeatherCtx, 640, 360, 'public_library', { type: 'freezing' });
    assert(weatherRects.length >= 2, 'Weather atmosphere must render edge accents');
    weatherRects.forEach(r => {
        assert(r.y >= 355, `Weather accent on public_library must sit along bottom border (y >= 355), got y=${r.y}`);
    });

    // Verify SimulationModel.loadState sanitizes corrupted location & upgrade levels
    global.localStorage.setItem('coffede_simulation', JSON.stringify({
        currentLocation: 'non_existent_map',
        upgrades: { machine: 99, grinder: -3, decor: -2 }
    }));
    sim.loadState();
    assert.strictEqual(sim.currentLocation, 'cul_de_sac', 'Invalid saved location must fallback to cul_de_sac');
    assert.strictEqual(sim.upgrades.machine, 4, 'Out-of-bounds machine level must clamp to max 4');
    assert.strictEqual(sim.upgrades.grinder, 1, 'Negative grinder level must clamp to min 1');
    assert.strictEqual(sim.upgrades.decor, 0, 'Negative decor level must clamp to min 0');
    global.localStorage.removeItem('coffede_simulation');

    // Verify MapEditor.resetDefaults populates all 20 locations in spawnDirections even without window.DEFAULT_LOCATION_SPAWN_DIRECTIONS
    const savedDefaultDirs = window.DEFAULT_LOCATION_SPAWN_DIRECTIONS;
    delete window.DEFAULT_LOCATION_SPAWN_DIRECTIONS;
    mergedEditor.resetDefaults();
    window.DEFAULT_LOCATION_SPAWN_DIRECTIONS = savedDefaultDirs;
    assert.strictEqual(Object.keys(mergedEditor.config.spawnDirections).length, 20, 'resetDefaults fallback must include all 20 locations');

    // Verify index.html #editorLocSelect optgroup labels match realistic tier rent ranges
    const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    ['Tier 1: Starter ($0 - $15)', 'Tier 2: Charming ($22 - $45)', 'Tier 3: High-Traffic ($55 - $90)', 'Tier 4: Bustling ($110 - $165)', 'Tier 5: Megacity Peak ($190 - $300)'].forEach(lbl => {
        assert(htmlContent.includes(lbl), `index.html #editorLocSelect must include realistic optgroup label "${lbl}"`);
    });
    ['$0 - $55', '$95 - $230', '$320 - $650', '$850 - $1,750', '$2,200 - $4,800'].forEach(oldLbl => {
        assert(!htmlContent.includes(oldLbl), `index.html must not contain stale old rent label "${oldLbl}"`);
    });

    console.log('✓ Legacy localStorage merge, 06:00 PM -> 08:00 AM clock reset, bottom-border weather accents, and loadState sanitization verified');

    console.log('\n======================================================');
    console.log('✅ ALL 20 MAP LOCATIONS VERIFICATION TESTS PASSED!');
    console.log('======================================================');
})().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
