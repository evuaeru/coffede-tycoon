/**
 * test_all.js
 * 
 * Unified Test Suite Runner for Coffede Tycoon
 * Executes all 17 existing automated test suites sequentially, followed by
 * the automated mobile responsive verification test suite (test_mobile_responsive.js).
 * 
 * Total Suites: 18
 * Exit Code: 0 only if all 18 test suites succeed; 1 if any suite fails.
 */

const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname);

const TEST_SUITES = [
    { name: 'test_20_locations.js', desc: '20-location catalog, economic scaling, rent & pixel bounds' },
    { name: 'test_audio_skip.js', desc: 'Web Audio API mock, limiter, sound suppression' },
    { name: 'test_deep_verification.js', desc: 'Stock reservation, DEX swap mechanics, ledger endurance' },
    { name: 'test_gameplay_economy_staff_and_ui_overhaul.js', desc: 'JSDOM economy, staff, starting cash, queue limit' },
    { name: 'test_location_carousel.js', desc: 'Location carousel navigation, DOM ordering, CSS invariants' },
    { name: 'test_location_stand_and_waypoints.js', desc: 'Stand coordinates, queue slots, waypoint geometry' },
    { name: 'test_map_editor.js', desc: 'Map editor model, hit testing, drag-drop anchors, JSON I/O' },
    { name: 'test_map_editor_ui.js', desc: 'CSS Grid/Flex rules, 2-col sidebar layout, cache busters' },
    { name: 'test_npc_animations.js', desc: 'SpriteRenderer walk cycles, direction flipping, speech bubbles' },
    { name: 'test_npc_despawn_and_sprite_integrity.js', desc: 'Sprite procedural fallback, customer terminus despawn' },
    { name: 'test_npc_variants_deep.js', desc: 'PNG dimensions, multi-archetype palette swapping' },
    { name: 'test_queue_advancement.js', desc: 'Queue forward kinematics, cascade step mechanics' },
    { name: 'test_sim.js', desc: 'Recipe evaluation, supplies purchasing, customer heuristics' },
    { name: 'test_sprites_deep.js', desc: 'SpriteRenderer verification, cart levels 0-5, weather particles' },
    { name: 'test_ui_integrity.js', desc: '442 CSS class cross-check, 207 getElementById verifications' },
    { name: 'test_upgrades_carousel_and_balance.js', desc: '7 upgrade categories, 27 tiers, carousel wrap & balance' },
    { name: 'verify_dom.js', desc: 'Static DOM ID verification across game.js and index.html' },
    { name: 'test_mobile_responsive.js', desc: 'Automated mobile responsive verification (375px, 390px, 412px, 1200px)' }
];

function runUnifiedSuite() {
    console.log('='.repeat(80));
    console.log(' COFFEDE TYCOON — UNIFIED TEST SUITE RUNNER');
    console.log(` Executing ${TEST_SUITES.length} test suites sequentially...`);
    console.log('='.repeat(80));

    const startTime = Date.now();
    const results = [];
    let passedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < TEST_SUITES.length; i++) {
        const suite = TEST_SUITES[i];
        const num = String(i + 1).padStart(2, '0');
        console.log(`\n[${num}/${TEST_SUITES.length}] RUNNING: ${suite.name}`);
        console.log(`     Desc: ${suite.desc}`);

        const suiteStart = Date.now();
        const proc = spawnSync('node', [suite.name], {
            cwd: PROJECT_ROOT,
            stdio: 'inherit',
            shell: true,
            env: { ...process.env, FORCE_COLOR: '1' }
        });
        const suiteDuration = Date.now() - suiteStart;

        const passed = proc.status === 0;
        if (passed) {
            passedCount++;
            console.log(`     >>> RESULT: ✅ PASSED (${suiteDuration}ms)`);
        } else {
            failedCount++;
            console.log(`     >>> RESULT: ❌ FAILED (exit code: ${proc.status}, duration: ${suiteDuration}ms)`);
        }

        results.push({
            name: suite.name,
            desc: suite.desc,
            passed: passed,
            exitCode: proc.status,
            duration: suiteDuration
        });
    }

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(80));
    console.log(' UNIFIED TEST EXECUTION SUMMARY');
    console.log('='.repeat(80));
    console.log(' #   Suite Name                                    Duration  Result');
    console.log('-'.repeat(80));

    results.forEach((r, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        const nameCol = r.name.padEnd(46, ' ');
        const durCol = (r.duration + 'ms').padStart(8, ' ');
        const statusCol = r.passed ? '✅ PASS' : '❌ FAIL';
        console.log(` ${num}  ${nameCol} ${durCol}  ${statusCol}`);
    });

    console.log('='.repeat(80));
    console.log(` Total Suites : ${TEST_SUITES.length}`);
    console.log(` Passed       : ${passedCount}`);
    console.log(` Failed       : ${failedCount}`);
    console.log(` Total Time   : ${totalDuration}s`);
    console.log('='.repeat(80));

    if (failedCount > 0) {
        console.log(`\n❌ TEST SUITE FAILED: ${failedCount} suite(s) failed.`);
        process.exit(1);
    } else {
        console.log('\n✅ ALL 18 TEST SUITES PASSED 100%!');
        process.exit(0);
    }
}

runUnifiedSuite();
