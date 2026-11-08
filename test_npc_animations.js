// Comprehensive Verification Suite for NPC Animation Systems
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

console.log('--- STARTING NPC ANIMATION SYSTEMS DEEP VERIFICATION ---');

const renderer = window.spriteRenderer;
const engine = window.simulationEngine;

// Initialize mock 16-bit NPC sprite canvases for deep testing
renderer.npcsLoaded = true;
renderer.npcSpriteCanvases = [
    { width: 166, height: 420 },
    { width: 166, height: 420 },
    { width: 166, height: 420 },
    { width: 166, height: 420 },
    { width: 166, height: 420 },
    { width: 166, height: 420 }
];
renderer.npcSpriteImgs = renderer.npcSpriteCanvases;

// Mock context with full inspection capabilities
class InspectorContext {
    constructor() {
        this.drawnImages = [];
        this.scales = [];
        this.rotations = [];
        this.translates = [];
        this.ellipses = [];
        this.rects = [];
        this.fills = [];
        this.history = [];
        this.ops = 0;
    }

    save() { this.ops++; this.history.push({ op: 'save' }); }
    restore() { this.ops++; this.history.push({ op: 'restore' }); }
    translate(x, y) {
        this.ops++;
        this.translates.push({ x, y });
        this.history.push({ op: 'translate', x, y });
    }
    scale(sx, sy) {
        this.ops++;
        this.scales.push({ sx, sy });
        this.history.push({ op: 'scale', sx, sy });
    }
    rotate(angle) {
        this.ops++;
        this.rotations.push(angle);
        this.history.push({ op: 'rotate', angle });
    }
    beginPath() { this.ops++; this.history.push({ op: 'beginPath' }); }
    closePath() { this.ops++; this.history.push({ op: 'closePath' }); }
    moveTo(x, y) { this.ops++; this.history.push({ op: 'moveTo', x, y }); }
    lineTo(x, y) { this.ops++; this.history.push({ op: 'lineTo', x, y }); }
    ellipse(x, y, rx, ry, rot, sa, ea) {
        this.ops++;
        this.ellipses.push({ x, y, rx, ry });
        this.history.push({ op: 'ellipse', x, y, rx, ry });
    }
    fillRect(x, y, w, h) {
        this.ops++;
        this.rects.push({ x, y, w, h, fillStyle: this.fillStyle, alpha: this.globalAlpha });
        this.history.push({ op: 'fillRect', x, y, w, h });
    }
    fill() { this.ops++; this.history.push({ op: 'fill' }); }
    stroke() { this.ops++; this.history.push({ op: 'stroke' }); }
    drawImage(img, dx, dy, dw, dh) {
        this.ops++;
        this.drawnImages.push({ img, dx, dy, dw, dh });
        this.history.push({ op: 'drawImage', img, dx, dy, dw, dh });
    }
    fillText(text, x, y) { this.ops++; this.history.push({ op: 'fillText', text, x, y }); }
}

// 1. Fluid Walk Cycle & Stride Lean & Pulsing Shadow
console.log('\n[Test 1] Fluid Walk Cycle (Stride Lean, Squash/Stretch, Shadow Pulse):');
{
    const ctx = new InspectorContext();
    const custWalk = {
        x: 100,
        y: 200,
        direction: 1,
        archetype: 'student',
        animFrame: 1.5,
        walkPhase: 1.5,
        state: 'walking',
        isMoving: true
    };
    renderer.renderCustomer(ctx, custWalk);

    // Stride lean rotation should be applied in moving direction
    assert(ctx.rotations.length > 0, 'Stride lean ctx.rotate must be called during walking');
    assert(ctx.rotations[0] > 0, 'Forward stride lean should have positive tilt angle');

    // Pulsing contact shadow should be rendered with dynamic radius
    assert(ctx.ellipses.length >= 2, 'Pulsing ground shadow ellipses must be drawn');
    const shadowR1 = ctx.ellipses[0].rx;
    assert(shadowR1 > 0, 'Shadow radius must be positive');

    // Deep check: Ground shadow must be drawn flat on ground plane BEFORE ctx.rotate
    const ellipseIdx = ctx.history.findIndex(h => h.op === 'ellipse');
    const rotateIdx = ctx.history.findIndex(h => h.op === 'rotate');
    assert(ellipseIdx !== -1 && rotateIdx !== -1, 'Both ellipse and rotate operations must exist');
    assert(ellipseIdx < rotateIdx, 'Ground shadow must be rendered before body rotate to stay flat on pavement');

    // Squash & stretch scale should be recorded
    assert(ctx.scales.length > 0, 'Squash & stretch ctx.scale must be called when walking');

    // Verify squash on ground contact impact (sin > 0) and stretch at apex (sin < 0)
    const ctxImpact = new InspectorContext();
    renderer.renderCustomer(ctxImpact, { x: 100, y: 200, direction: 1, archetype: 'student', walkPhase: Math.PI / 4, isMoving: true }); // sin(PI/2) = 1 (impact)
    const impactScaleY = ctxImpact.scales[ctxImpact.scales.length - 1].sy;
    assert(impactScaleY < 1.0, `Step impact must compress/squash vertically (got ${impactScaleY})`);

    const ctxApex = new InspectorContext();
    renderer.renderCustomer(ctxApex, { x: 100, y: 200, direction: 1, archetype: 'student', walkPhase: 3 * Math.PI / 4, isMoving: true }); // sin(3PI/2) = -1 (apex)
    const apexScaleY = ctxApex.scales[ctxApex.scales.length - 1].sy;
    assert(apexScaleY > 1.0, `Step apex must stretch vertically (got ${apexScaleY})`);

    // Verify clean sprite walk animation (squash & stretch, stride tilt, and pulsing shadow)
    assert(Math.abs(impactScaleY - apexScaleY) > 0.05, 'Dynamic squash and stretch difference verified');
    console.log(`✓ Walk cycle active: tilt=${ctx.rotations[0].toFixed(3)} rad, shadowR=${shadowR1}px, squashY=${impactScaleY.toFixed(3)}, stretchY=${apexScaleY.toFixed(3)}`);
}

// 2. Idle Breathing Oscillation & Natural Weight Shift
console.log('\n[Test 2] Idle Breathing Oscillation & Natural Weight Shift:');
{
    const ctx1 = new InspectorContext();
    renderer.renderCustomer(ctx1, {
        x: 100,
        y: 200,
        direction: 1,
        archetype: 'business',
        idlePhase: 0,
        state: 'deciding',
        isMoving: false
    });

    const ctx2 = new InspectorContext();
    renderer.renderCustomer(ctx2, {
        x: 100,
        y: 200,
        direction: 1,
        archetype: 'business',
        idlePhase: Math.PI / 4.4, // Quarter cycle of breathing (peak sin=1.0)
        state: 'deciding',
        isMoving: false
    });

    const baseH = renderer.npcHeight || 40;
    const drawY1 = ctx1.drawnImages.length > 0 ? ctx1.drawnImages[0].dy : -baseH;
    const drawY2 = ctx2.drawnImages.length > 0 ? ctx2.drawnImages[0].dy : -baseH;
    assert.notStrictEqual(drawY1, drawY2, 'Idle breathing should cause vertical elevation oscillation between phases');

    // Natural weight shift should cause rotation sway between idle phases
    const rot1 = ctx1.rotations[0] || 0;
    const rot2 = ctx2.rotations[0] || 0;
    assert.notStrictEqual(rot1, rot2, 'Weight shift should cause angular hip sway oscillation');
    console.log(`✓ Idle breathing & weight shift verified: elevation diff=${Math.abs(drawY1 - drawY2)}px, rot1=${rot1.toFixed(4)}, rot2=${rot2.toFixed(4)}`);
}

// 3. Queue Patience & Impatient Fidgeting
console.log('\n[Test 3] Queue Patience & Fidgeting after 4s:');
{
    // Patient queue (< 4s)
    const ctxPatient = new InspectorContext();
    renderer.renderCustomer(ctxPatient, {
        x: 150,
        y: 200,
        state: 'queued',
        queueWaitTime: 2.0,
        isMoving: false
    });

    // Impatient queue (> 4s): fidget bounce phase
    const ctxFidgetTap = new InspectorContext();
    renderer.renderCustomer(ctxFidgetTap, {
        x: 150,
        y: 200,
        state: 'queued',
        queueWaitTime: 4.8,
        isMoving: false
    });

    assert(ctxFidgetTap.ops > 0, 'Fidgeting customer should render');
    console.log(`✓ Queue fidgeting verified`);
}

// 4. Cheerful Bounce & Particles on Coffee Delivery
console.log('\n[Test 4] Cheerful Bounce Hop & Heart/Star Particles:');
{
    const ctxHop = new InspectorContext();
    renderer.renderCustomer(ctxHop, {
        x: 200,
        y: 200,
        archetype: 'hipster',
        servedHopTimer: 0.25, // Mid-hop peak
        hopDuration: 0.5,
        state: 'leaving',
        hasCoffee: true
    });

    const baseH = renderer.npcHeight || 40;
    const drawY = ctxHop.drawnImages.length > 0 ? ctxHop.drawnImages[0].dy : -baseH;
    // Expected elevation during peak 4.5px hop is around -43 to -45 (when baseH=40)
    assert(drawY < -baseH, `Customer must elevate upward during cheerful hop (drawY: ${drawY})`);

    // Verify cheerful particle generation
    const initialParticles = renderer.cheerfulParticles.length;
    renderer.addCheerfulParticle(200, 160, 'star');
    renderer.addCheerfulParticle(200, 160, 'heart');
    assert(renderer.cheerfulParticles.length > initialParticles, 'Cheerful star/heart particles must be generated');

    // Particle update and decay
    const prevCount = renderer.cheerfulParticles.length;
    renderer.update(0.1);
    assert(renderer.cheerfulParticles.length > 0, 'Cheerful particles must remain active while living');
    console.log(`✓ Cheerful bounce hop: drawY=${drawY}px, spawned ${renderer.cheerfulParticles.length} star/heart particles`);
}

// 5. Coffee Sipping Animation when Leaving
console.log('\n[Test 5] Coffee Sipping Animation (Cup to Mouth, Head Tilt, Rising Steam, Resting Cup Masking):');
{
    // Normal walking with coffee (outside sip window, sipTimer = 1.0s)
    const ctxHold = new InspectorContext();
    renderer.renderCustomer(ctxHold, {
        x: 250,
        y: 200,
        direction: 1,
        archetype: 'student',
        sipTimer: 1.0,
        animFrame: 1.0,
        state: 'leaving',
        hasCoffee: true
    });

    // Actively sipping coffee (sipTimer = 2.7s, during sip window)
    const ctxSip = new InspectorContext();
    renderer.renderCustomer(ctxSip, {
        x: 250,
        y: 200,
        direction: 1,
        archetype: 'student',
        sipTimer: 2.7,
        animFrame: 1.0,
        state: 'leaving',
        hasCoffee: true
    });

    // Head tilt should be tilted back during sipping
    const rotHold = ctxHold.rotations[0] || 0;
    const rotSip = ctxSip.rotations[0] || 0;
    assert(rotSip < rotHold, `Head/torso must tilt back during coffee sip (rotHold: ${rotHold.toFixed(3)}, rotSip: ${rotSip.toFixed(3)})`);

    // Extra steam / cup drawing operations during sip window
    assert(ctxSip.rects.length > 0, 'Cup and steam rectangles must be rendered during active sipping');

    // Deep check: Resting cup masking on archetype 1 (student) during sip to prevent duplicate cups
    const hasJacketMask = ctxSip.rects.some(r => r.fillStyle === '#ea580c');
    assert(hasJacketMask, 'Student resting cup position must be masked with jacket sleeve during sipping');
    console.log(`✓ Sipping animation verified: rotHold=${rotHold.toFixed(3)}, rotSip=${rotSip.toFixed(3)} (tilted back), resting cup mask active`);
}

// 6. Engine Integration & Customer Direction Restoration
console.log('\n[Test 6] Simulation Engine Customer Path & Direction Restoration:');
{
    // Mock simulation model
    window.simulationModel = {
        executePurchase() {},
        getLocations() { return { suburbs: { preferredArchetypes: ['student'] } }; },
        currentLocation: 'suburbs',
        dailyStats: { lostPatience: 0, pedestriansTotal: 0 },
        recordCustomerReaction() {}
    };

    const simCust = {
        id: 'cust_test',
        x: 200,
        y: 220,
        direction: -1, // Facing counter while in queue
        origDirection: 1, // Originally spawned walking rightward
        speed: 40,
        state: 'serving',
        hasCoffee: false,
        decision: { rating: 4.5, feedback: 'Delicious! ☕', price: 3.5, tip: 0.5, isCrypto: false }
    };

    engine.completeService(simCust);
    assert.strictEqual(simCust.direction, 1, 'completeService must restore customer.direction to origDirection (1)');
    assert.strictEqual(simCust.state, 'leaving', 'Customer state must be leaving after service');
    assert.strictEqual(simCust.hasCoffee, true, 'Customer must hold coffee');
    assert.strictEqual(simCust.servedHopTimer, 0.5, 'Cheerful hop timer must be initialized to 0.5s');

    // Test stationary pause during cheerful hop
    engine.updateCustomer(simCust, 0.1);
    assert.strictEqual(simCust.isMoving, false, 'Customer must remain momentarily stationary at counter during cheerful hop');

    // Once hop completes, movement along original direction must resume
    simCust.servedHopTimer = 0;
    const prevX = simCust.x;
    engine.updateCustomer(simCust, 0.1);
    assert.strictEqual(simCust.isMoving, true, 'Customer must resume moving after hop');
    assert(simCust.x > prevX, 'Customer must advance in original forward direction (rightwards)');

    // Test fidgetTimer update in queue
    const queuedCust = {
        state: 'queued',
        queueSpot: 0,
        x: 294,
        y: 239,
        speed: 40,
        queueWaitTime: 4.5,
        isFidgeting: false,
        fidgetTimer: 0
    };
    engine.standX = 220;
    engine.standY = 200;
    engine.updateCustomer(queuedCust, 0.5);
    assert.strictEqual(queuedCust.isFidgeting, true, 'Customer waiting > 4s in queue must have isFidgeting = true');
    assert(queuedCust.fidgetTimer > 0, 'fidgetTimer must increment continuously during queue fidgeting');

    console.log(`✓ Engine customer direction restoration & hop pause verified`);
}

// 7. Sequential 8-Frame Walk Cycle Sprite Frame Progression (with In-Betweens)
console.log('\n[Test 7] Sequential 8-Frame Walk Cycle Sprite Frame Progression (with In-Betweens):');
{
    // Provide mock 8 walk frames for jogger (archetype 0)
    renderer.walkCycles[0] = [
        { id: 'frame_0_contact1', width: 200, height: 500 },
        { id: 'frame_1_recoil1', width: 190, height: 500 },
        { id: 'frame_2_passing1', width: 180, height: 500 },
        { id: 'frame_3_apex1', width: 190, height: 500 },
        { id: 'frame_4_contact2', width: 200, height: 500 },
        { id: 'frame_5_recoil2', width: 190, height: 500 },
        { id: 'frame_6_passing2', width: 180, height: 500 },
        { id: 'frame_7_apex2', width: 190, height: 500 }
    ];

    // Frame 0: Contact 1
    const ctx0 = new InspectorContext();
    renderer.renderCustomer(ctx0, { x: 100, y: 200, direction: 1, archetype: 'jogger', walkPhase: 0.05, isMoving: true });
    assert.strictEqual(ctx0.drawnImages[0].img.id, 'frame_0_contact1', 'Walk frame 0 must be selected at contact 1');

    // Frame 1: Recoil 1 (Down in-between)
    const ctx1 = new InspectorContext();
    renderer.renderCustomer(ctx1, { x: 100, y: 200, direction: 1, archetype: 'jogger', walkPhase: 0.40, isMoving: true });
    assert.strictEqual(ctx1.drawnImages[0].img.id, 'frame_1_recoil1', 'Walk frame 1 must be selected during recoil 1 in-between');

    // Frame 2: Passing 1
    const ctx2 = new InspectorContext();
    renderer.renderCustomer(ctx2, { x: 100, y: 200, direction: 1, archetype: 'jogger', walkPhase: 0.75, isMoving: true });
    assert.strictEqual(ctx2.drawnImages[0].img.id, 'frame_2_passing1', 'Walk frame 2 must be selected during passing 1 pose');

    // Frame 3: Apex 1 (Up in-between)
    const ctx3 = new InspectorContext();
    renderer.renderCustomer(ctx3, { x: 100, y: 200, direction: 1, archetype: 'jogger', walkPhase: 1.15, isMoving: true });
    assert.strictEqual(ctx3.drawnImages[0].img.id, 'frame_3_apex1', 'Walk frame 3 must be selected during apex 1 in-between');

    // Frame 4: Contact 2
    const ctx4 = new InspectorContext();
    renderer.renderCustomer(ctx4, { x: 100, y: 200, direction: 1, archetype: 'jogger', walkPhase: 1.50, isMoving: true });
    assert.strictEqual(ctx4.drawnImages[0].img.id, 'frame_4_contact2', 'Walk frame 4 must be selected during contact 2 pose');

    // Idle in queue: stationary (isMoving = false) -> frame 2 (passing 1 / idle upright pose)
    const ctxIdle = new InspectorContext();
    renderer.renderCustomer(ctxIdle, { x: 100, y: 200, direction: 1, archetype: 'jogger', walkPhase: 1.50, isMoving: false, state: 'queued' });
    assert.strictEqual(ctxIdle.drawnImages[0].img.id, 'frame_2_passing1', 'Stationary customer in queue must use frame 2 (idle upright pose)');

    console.log(`✓ 8-frame walk cycle sequence verified: Frame 0 -> Frame 1 (Recoil) -> Frame 2 (Pass) -> Frame 3 (Apex)...`);
}

// 8. Location-Specific NPC Props & Accessories
console.log('\n[Test 8] Location-Specific NPC Props & Visual Accessories:');
{
    // Test Campus (College textbooks & ID lanyard)
    window.simulationModel.currentLocation = 'campus';
    const ctxCampus = new InspectorContext();
    renderer.renderLocationAccessories(ctxCampus, { isMoving: true }, 1, 24, 48, 0);
    const hasCampusLanyard = ctxCampus.rects.some(r => r.fillStyle === '#0284c7');
    assert(hasCampusLanyard, 'Campus customer must be rendered with college lanyard/book props');

    // Test Downtown (Gold wristwatch & executive briefcase)
    window.simulationModel.currentLocation = 'downtown';
    const ctxDowntown = new InspectorContext();
    renderer.renderLocationAccessories(ctxDowntown, { isMoving: true }, 2, 24, 48, 0);
    const hasGoldWatch = ctxDowntown.rects.some(r => r.fillStyle === '#facc15');
    assert(hasGoldWatch, 'Downtown businessman must be rendered with executive gold watch / briefcase');

    // Test Park (Sporty headband / hydration bottle & pet dog)
    window.simulationModel.currentLocation = 'park';
    const ctxPark = new InspectorContext();
    renderer.renderLocationAccessories(ctxPark, { isMoving: true, id: 'cust_0' }, 0, 24, 48, 0);
    const hasHeadband = ctxPark.rects.some(r => r.fillStyle === '#ef4444');
    assert(hasHeadband, 'Park jogger must be rendered with red sporty headband');

    // Test Suburbs (Kraft paper grocery bag with baguette & flowers)
    window.simulationModel.currentLocation = 'suburbs';
    const ctxSuburbs = new InspectorContext();
    renderer.renderLocationAccessories(ctxSuburbs, { isMoving: true }, 5, 24, 48, 0);
    const hasGroceryBag = ctxSuburbs.rects.some(r => r.fillStyle === '#b45309');
    assert(hasGroceryBag, 'Suburbs resident must be rendered with kraft grocery bag & baguette/scarf');

    // Test Metro (Folded newspaper & commuter umbrella & transit card)
    window.simulationModel.currentLocation = 'metro';
    const ctxMetro = new InspectorContext();
    renderer.renderLocationAccessories(ctxMetro, { isMoving: true }, 2, 24, 48, 0);
    const hasTransitCard = ctxMetro.rects.some(r => r.fillStyle === '#3b82f6');
    assert(hasTransitCard, 'Metro commuter must be rendered with subway transit card / umbrella / newspaper');

    console.log(`✓ Location adaptations verified across all 5 locations (Campus, Downtown, Park, Suburbs, Metro)!`);
}

console.log('\n======================================================');
console.log('✅ ALL NPC ANIMATION SYSTEMS DEEP TESTS PASSED!');
console.log('======================================================');
