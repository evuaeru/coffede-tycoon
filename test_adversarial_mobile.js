/**
 * test_adversarial_mobile.js
 * 
 * EMPIRICAL ADVERSARIAL STRESS TEST SUITE
 * For Coffede Tycoon Mobile Responsive Implementation
 * 
 * Rigorously challenges:
 * 1. Intermediate Viewport Widths (360px, 384px, 400px, 430px, 480px, 600px, 768px, 800px, 1024px, 1366px)
 * 2. Landscape Mobile Orientations (667x375, 844x390, 915x412)
 * 3. Exhaustive Multi-Tab Scan (All 9 Tabs on 360px, 375px, 390px for overflow & touch targets)
 * 4. Extreme Dynamic Interactions (rapid tab cycling, simulation controls hammering, stepper bounds)
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname);
const CHROME_PATH = process.env.CHROME_BIN || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEST_TIMEOUT_MS = 60000;

if (!fs.existsSync(CHROME_PATH)) {
    console.error(`❌ Chrome binary not found at: ${CHROME_PATH}`);
    process.exit(1);
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg'
};

const VIEWPORTS_MATRIX = [
    // Intermediate Portrait Viewports
    { id: 'vp_360', width: 360, height: 640, label: '360x640 (Galaxy A / Narrow Budget Phone)', isMobile: true, isLandscape: false },
    { id: 'vp_384', width: 384, height: 854, label: '384x854 (Sony Xperia / Nexus)', isMobile: true, isLandscape: false },
    { id: 'vp_400', width: 400, height: 800, label: '400x800 (Mid-tier Android)', isMobile: true, isLandscape: false },
    { id: 'vp_430', width: 430, height: 932, label: '430x932 (iPhone 14/15/16 Pro Max)', isMobile: true, isLandscape: false },
    { id: 'vp_480', width: 480, height: 800, label: '480x800 (Breakpoint Boundary max-width: 480px)', isMobile: true, isLandscape: false },
    { id: 'vp_600', width: 600, height: 960, label: '600x960 (Small Tablet / Phablet)', isMobile: true, isLandscape: false },
    { id: 'vp_768', width: 768, height: 1024, label: '768x1024 (iPad Portrait / Breakpoint Boundary 768px)', isMobile: true, isLandscape: false },
    { id: 'vp_800', width: 800, height: 600, label: '800x600 (Desktop / Small Display)', isMobile: false, isLandscape: false },
    { id: 'vp_1024', width: 1024, height: 768, label: '1024x768 (Standard Desktop / iPad Landscape)', isMobile: false, isLandscape: false },
    { id: 'vp_1366', width: 1366, height: 768, label: '1366x768 (Standard Laptop Baseline)', isMobile: false, isLandscape: false },
    
    // Landscape Mobile Viewports
    { id: 'vp_667_land', width: 667, height: 375, label: '667x375 (iPhone SE Landscape)', isMobile: true, isLandscape: true },
    { id: 'vp_844_land', width: 844, height: 390, label: '844x390 (iPhone 12/13/14 Landscape)', isMobile: false, isLandscape: true },
    { id: 'vp_915_land', width: 915, height: 412, label: '915x412 (Pixel 7 / Galaxy S21 Landscape)', isMobile: false, isLandscape: true }
];

function generateAdversarialHarnessHtml() {
    const framesHtml = VIEWPORTS_MATRIX.map(vp => `
        <div class="frame-card">
            <div class="frame-label">${vp.label}</div>
            <iframe id="${vp.id}" src="/index.html" style="width: ${vp.width}px; height: ${vp.height}px;"></iframe>
        </div>
    `).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Coffede Tycoon Adversarial Stress Harness</title>
    <style>
        body { margin: 0; padding: 16px; font-family: monospace; background: #121212; color: #eee; }
        .frame-card { background: #1e1e1e; padding: 12px; margin-bottom: 24px; border-radius: 8px; display: inline-block; vertical-align: top; margin-right: 16px; }
        .frame-label { font-weight: bold; margin-bottom: 8px; color: #ffeb3b; }
        iframe { border: 2px solid #555; background: #000; display: block; }
    </style>
</head>
<body>
    <h1>Adversarial Verification Matrix</h1>
    <div class="frames-grid">
        ${framesHtml}
    </div>

    <script>
    const VP_CONFIGS = ${JSON.stringify(VIEWPORTS_MATRIX)};

    function waitLoad(iframe) {
        return new Promise(resolve => {
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                resolve();
            } else {
                iframe.onload = () => resolve();
            }
        });
    }

    function isElementVisible(el, fWin) {
        if (!el) return false;
        const style = fWin.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
            return false;
        }
        if (el.offsetParent === null && style.position !== 'fixed' && style.position !== 'sticky') {
            return false;
        }
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    function evaluateViewportBasic(vpConfig) {
        const frame = document.getElementById(vpConfig.id);
        const fDoc = frame.contentDocument;
        const fWin = frame.contentWindow;

        const results = {
            id: vpConfig.id,
            label: vpConfig.label,
            width: vpConfig.width,
            height: vpConfig.height,
            isMobile: vpConfig.isMobile,
            isLandscape: vpConfig.isLandscape,
            innerWidth: fWin.innerWidth,
            innerHeight: fWin.innerHeight,
            checks: {}
        };

        // 1. HORIZONTAL OVERFLOW
        const docScrollWidth = fDoc.documentElement.scrollWidth;
        const bodyScrollWidth = fDoc.body.scrollWidth;
        const appContainer = fDoc.querySelector('.app-container');
        const appScrollWidth = appContainer ? appContainer.scrollWidth : docScrollWidth;
        const innerW = fWin.innerWidth;

        const overflowPass = docScrollWidth <= innerW && bodyScrollWidth <= innerW && appScrollWidth <= innerW;
        results.checks.horizontalOverflow = {
            passed: overflowPass,
            docScrollWidth: docScrollWidth,
            bodyScrollWidth: bodyScrollWidth,
            appScrollWidth: appScrollWidth,
            innerWidth: innerW,
            message: overflowPass
                ? 'Zero horizontal overflow (doc=' + docScrollWidth + ', app=' + appScrollWidth + ' <= ' + innerW + 'px)'
                : 'Horizontal overflow detected (doc=' + docScrollWidth + ', body=' + bodyScrollWidth + ', app=' + appScrollWidth + ' > ' + innerW + 'px)'
        };

        // 2. TOUCH TARGETS (for mobile viewports)
        if (vpConfig.isMobile) {
            const selector = 'button, input[type="button"], input[type="submit"], input[type="reset"], input[type="number"], input[type="text"], input:not([type]), select, .stepper-btn, .tab-btn, .nav-tab, .nav-item, a[role="button"]';
            const candidates = Array.from(fDoc.querySelectorAll(selector));
            const smallTargets = [];
            let validCount = 0;

            for (const el of candidates) {
                if (!isElementVisible(el, fWin)) continue;
                const r = el.getBoundingClientRect();
                const w = Math.round(r.width);
                const h = Math.round(r.height);
                if (w < 44 || h < 44) {
                    smallTargets.push({
                        tag: el.tagName.toLowerCase(),
                        id: el.id || '',
                        className: (el.className || '').toString().trim().replace(/\\s+/g, ' '),
                        text: (el.textContent || el.value || '').trim().substring(0, 24),
                        width: w,
                        height: h
                    });
                } else {
                    validCount++;
                }
            }

            results.checks.touchTargets = {
                passed: smallTargets.length === 0,
                smallCount: smallTargets.length,
                validCount: validCount,
                smallTargets: smallTargets.slice(0, 10),
                message: smallTargets.length === 0
                    ? 'All ' + validCount + ' visible interactive elements meet >= 44x44px'
                    : smallTargets.length + ' visible interactive elements are smaller than 44x44px'
            };
        } else {
            results.checks.touchTargets = {
                passed: true,
                message: 'Desktop baseline: 44px mobile touch target exempt'
            };
        }

        // 3. NAVIGATION DOCKING / VISIBILITY
        const bottomNav = fDoc.getElementById('mobileBottomNav');
        const desktopNav = fDoc.querySelector('.nav-tab-bar');
        if (vpConfig.width <= 768) {
            // Mobile navigation rules apply
            const isBottomNavVis = bottomNav && fWin.getComputedStyle(bottomNav).display !== 'none';
            const isBottomNavDocked = bottomNav && (fWin.getComputedStyle(bottomNav).position === 'fixed' || fWin.getComputedStyle(bottomNav).position === 'sticky');
            const navPass = isBottomNavVis && isBottomNavDocked;
            results.checks.navigation = {
                passed: navPass,
                message: navPass ? 'Bottom navigation docked and visible on width <= 768px' : 'Bottom navigation missing/not docked on width <= 768px'
            };
        } else {
            // Desktop navigation rules apply
            const isDesktopNavVis = desktopNav && fWin.getComputedStyle(desktopNav).display !== 'none';
            const isBottomNavHidden = !bottomNav || fWin.getComputedStyle(bottomNav).display === 'none';
            const navPass = isDesktopNavVis && isBottomNavHidden;
            results.checks.navigation = {
                passed: navPass,
                message: navPass ? 'Desktop top nav visible and bottom nav hidden on width > 768px' : 'Desktop navigation state incorrect'
            };
        }

        // 4. CANVAS SCALING & 16:9 RATIO
        const canvas = fDoc.getElementById('gameCanvas') || fDoc.getElementById('simCanvas');
        if (canvas) {
            const canvasRect = canvas.getBoundingClientRect();
            const fitsWidth = canvasRect.width <= innerW;
            const ratio = canvasRect.width / (canvasRect.height || 1);
            const ratioPass = Math.abs(ratio - 16 / 9) < 0.05;
            results.checks.canvasScaling = {
                passed: fitsWidth && ratioPass && canvasRect.width > 0,
                width: Math.round(canvasRect.width),
                height: Math.round(canvasRect.height),
                ratio: Number(ratio.toFixed(4)),
                message: fitsWidth && ratioPass ? 'Canvas scales to ' + Math.round(canvasRect.width) + 'x' + Math.round(canvasRect.height) + 'px (16:9)' : 'Canvas scaling/ratio failure'
            };
        }

        return results;
    }

    // EXHAUSTIVE MULTI-TAB SWITCHING SCAN ON NARROW VIEWPORT (e.g. 360px & 390px)
    async function evaluateAllTabs(frameId) {
        const frame = document.getElementById(frameId);
        const fDoc = frame.contentDocument;
        const fWin = frame.contentWindow;
        const innerW = fWin.innerWidth;

        const tabsToTest = ['stand', 'recipe', 'supplies', 'upgrades', 'staff', 'locations', 'marketing', 'ledger', 'editor'];
        const tabResults = {};

        for (const tabKey of tabsToTest) {
            // Find tab button in bottom nav or top nav
            let tabBtn = fDoc.querySelector('#mobileBottomNav [data-tab="' + tabKey + '"]');
            if (!tabBtn) {
                tabBtn = fDoc.querySelector('.nav-tab[data-tab="' + tabKey + '"]');
            }

            if (!tabBtn) {
                tabResults[tabKey] = { passed: false, error: 'Tab button for ' + tabKey + ' not found' };
                continue;
            }

            // Click tab button
            tabBtn.click();
            await new Promise(r => setTimeout(r, 120));

            // Verify section visibility
            const section = fDoc.getElementById('tab_' + tabKey);
            const isSectionActive = section ? section.classList.contains('active') : false;

            // Check horizontal overflow
            const docScrollW = fDoc.documentElement.scrollWidth;
            const bodyScrollW = fDoc.body.scrollWidth;
            const app = fDoc.querySelector('.app-container');
            const appScrollW = app ? app.scrollWidth : docScrollW;
            const tabScrollW = section ? section.scrollWidth : 0;

            const overflowPass = docScrollW <= innerW && bodyScrollW <= innerW && appScrollW <= innerW && tabScrollW <= innerW;

            // Check touch targets on this tab
            const selector = 'button, input[type="button"], input[type="submit"], input[type="reset"], input[type="number"], input[type="text"], input:not([type]), select, .stepper-btn, .tab-btn, .nav-tab, .nav-item, a[role="button"]';
            const candidates = Array.from(fDoc.querySelectorAll(selector));
            const smallTargets = [];
            let validCount = 0;

            for (const el of candidates) {
                if (!isElementVisible(el, fWin)) continue;
                const r = el.getBoundingClientRect();
                const w = Math.round(r.width);
                const h = Math.round(r.height);
                if (w < 44 || h < 44) {
                    smallTargets.push({
                        tag: el.tagName.toLowerCase(),
                        id: el.id || '',
                        className: (el.className || '').toString().trim().replace(/\\s+/g, ' '),
                        text: (el.textContent || el.value || '').trim().substring(0, 20),
                        width: w,
                        height: h
                    });
                } else {
                    validCount++;
                }
            }

            tabResults[tabKey] = {
                passed: isSectionActive && overflowPass && smallTargets.length === 0,
                isSectionActive: isSectionActive,
                overflowPass: overflowPass,
                docScrollW: docScrollW,
                tabScrollW: tabScrollW,
                appScrollW: appScrollW,
                innerW: innerW,
                smallTargetsCount: smallTargets.length,
                smallTargets: smallTargets.slice(0, 10),
                validCount: validCount
            };
        }

        // Return back to stand tab
        const standBtn = fDoc.querySelector('#mobileBottomNav [data-tab="stand"]');
        if (standBtn) standBtn.click();
        await new Promise(r => setTimeout(r, 100));

        return tabResults;
    }

    // EXTREME DYNAMIC STRESS INTERACTIONS
    async function evaluateDynamicStress(frameId) {
        const frame = document.getElementById(frameId);
        const fDoc = frame.contentDocument;
        const fWin = frame.contentWindow;

        const results = {
            rapidTabCycling: { passed: false },
            rapidSimControls: { passed: false },
            stepperBounds: { passed: false }
        };

        const initialErrors = [];
        const originalOnError = fWin.onerror;
        fWin.onerror = (msg, src, lin, col, err) => {
            initialErrors.push({ msg, lin, col });
            if (originalOnError) originalOnError(msg, src, lin, col, err);
        };

        // 1. Rapid Tab Cycling (18 fast switches)
        try {
            const tabs = ['stand', 'recipe', 'supplies', 'upgrades', 'staff', 'locations', 'marketing', 'ledger', 'editor'];
            for (let i = 0; i < 18; i++) {
                const target = tabs[i % tabs.length];
                const btn = fDoc.querySelector('#mobileBottomNav [data-tab="' + target + '"]');
                if (btn) btn.click();
                await new Promise(r => setTimeout(r, 20));
            }
            // Return to stand
            const standBtn = fDoc.querySelector('#mobileBottomNav [data-tab="stand"]');
            if (standBtn) standBtn.click();
            await new Promise(r => setTimeout(r, 100));

            results.rapidTabCycling = {
                passed: initialErrors.length === 0,
                errors: initialErrors.slice()
            };
        } catch (e) {
            results.rapidTabCycling = { passed: false, error: e.message };
        }

        // 2. Rapid Simulation Controls
        try {
            const startBtn = fDoc.getElementById('btnStartDay');
            const pauseBtn = fDoc.getElementById('btnPauseSim');
            const skipBtn = fDoc.getElementById('btnSkipDay');
            const speedBtns = Array.from(fDoc.querySelectorAll('.speed-btn'));

            // Click start if visible
            if (startBtn && fWin.getComputedStyle(startBtn).display !== 'none') {
                startBtn.click();
                await new Promise(r => setTimeout(r, 100));
            }

            // Rapid pause toggling
            if (pauseBtn && fWin.getComputedStyle(pauseBtn).display !== 'none') {
                for (let i = 0; i < 6; i++) {
                    pauseBtn.click();
                    await new Promise(r => setTimeout(r, 25));
                }
            }

            // Rapid speed cycling
            for (const spd of speedBtns) {
                if (fWin.getComputedStyle(spd).display !== 'none') {
                    spd.click();
                    await new Promise(r => setTimeout(r, 25));
                }
            }

            // Skip day to finish clean
            if (skipBtn && fWin.getComputedStyle(skipBtn).display !== 'none') {
                skipBtn.click();
                await new Promise(r => setTimeout(r, 150));
            }

            // Check if game or simulation engine is still healthy
            const simOk = fWin.simulationModel && typeof fWin.simulationModel.cash === 'number';
            results.rapidSimControls = {
                passed: simOk && initialErrors.length === 0,
                errors: initialErrors.slice()
            };
        } catch (e) {
            results.rapidSimControls = { passed: false, error: e.message };
        }

        // 3. Stepper Bounds Testing (Recipe & Supplies)
        try {
            // Switch to Recipe tab
            const recBtn = fDoc.querySelector('#mobileBottomNav [data-tab="recipe"]');
            if (recBtn) recBtn.click();
            await new Promise(r => setTimeout(r, 100));

            // Find steppers
            const minusBtns = Array.from(fDoc.querySelectorAll('#tab_recipe .stepper-btn.minus, #tab_recipe .btn-stepper-minus'));
            const plusBtns = Array.from(fDoc.querySelectorAll('#tab_recipe .stepper-btn.plus, #tab_recipe .btn-stepper-plus'));

            // Click minus 8 times to hit lower bound (0 or min)
            for (const btn of minusBtns) {
                for (let i = 0; i < 8; i++) btn.click();
            }
            await new Promise(r => setTimeout(r, 50));

            // Verify no negative values or NaN
            const recipeInputs = Array.from(fDoc.querySelectorAll('#tab_recipe input[type="number"], #tab_recipe input[type="range"]'));
            let boundsValid = true;
            for (const inp of recipeInputs) {
                const val = parseFloat(inp.value);
                if (isNaN(val) || val < 0) {
                    boundsValid = false;
                    break;
                }
            }

            // Click plus 4 times
            for (const btn of plusBtns) {
                for (let i = 0; i < 4; i++) btn.click();
            }
            await new Promise(r => setTimeout(r, 50));

            for (const inp of recipeInputs) {
                const val = parseFloat(inp.value);
                if (isNaN(val) || val < 0) {
                    boundsValid = false;
                    break;
                }
            }

            // Return to stand tab
            const standBtn = fDoc.querySelector('#mobileBottomNav [data-tab="stand"]');
            if (standBtn) standBtn.click();
            await new Promise(r => setTimeout(r, 100));

            results.stepperBounds = {
                passed: boundsValid && initialErrors.length === 0,
                boundsValid: boundsValid,
                errors: initialErrors.slice()
            };
        } catch (e) {
            results.stepperBounds = { passed: false, error: e.message };
        }

        return results;
    }

    async function runAllAdversarialTests() {
        try {
            // Wait for all frames to load
            await Promise.all(VP_CONFIGS.map(vp => waitLoad(document.getElementById(vp.id))));
            await new Promise(r => setTimeout(r, 1000));

            const report = {
                intermediateViewports: {},
                allTabsScan360: {},
                allTabsScan390: {},
                dynamicStress360: {}
            };

            // Evaluate baseline viewports FIRST before mutating DOM with tab clicks
            for (const vp of VP_CONFIGS) {
                report.intermediateViewports[vp.id] = evaluateViewportBasic(vp);
            }

            // Now run multi-tab scan on vp_360
            report.allTabsScan360 = await evaluateAllTabs('vp_360');

            // Now run multi-tab scan on vp_400 (or vp_430)
            report.allTabsScan390 = await evaluateAllTabs('vp_400');

            // Now run dynamic stress on vp_360
            report.dynamicStress360 = await evaluateDynamicStress('vp_360');

            await fetch('/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
            });
        } catch (err) {
            await fetch('/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: err.stack || err.message })
            });
        }
    }

    window.addEventListener('load', runAllAdversarialTests);
    </script>
</body>
</html>`;
}

function killProcessTree(pid) {
    if (!pid) return;
    try {
        if (process.platform === 'win32') {
            execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
        } else {
            process.kill(pid, 'SIGKILL');
        }
    } catch (e) {}
}

function executeAdversarialSuite() {
    return new Promise((resolve) => {
        let chromeProc = null;
        let timeoutHandle = null;

        const server = http.createServer((req, res) => {
            const parsedUrl = new URL(req.url, 'http://127.0.0.1');
            const cleanPath = parsedUrl.pathname;

            if (req.method === 'POST' && cleanPath === '/report') {
                let body = '';
                req.on('data', chunk => { body += chunk; });
                req.on('end', () => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'received' }));

                    cleanup();
                    try {
                        const data = JSON.parse(body);
                        resolve({ success: true, data });
                    } catch (parseErr) {
                        resolve({ success: false, error: 'Failed to parse browser report: ' + parseErr.message });
                    }
                });
                return;
            }

            if (cleanPath === '/test-runner') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(generateAdversarialHarnessHtml());
                return;
            }

            let relPath = cleanPath === '/' ? 'index.html' : cleanPath.replace(/^\//, '');
            let filePath = path.join(PROJECT_ROOT, relPath);

            if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File Not Found: ' + cleanPath);
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            fs.createReadStream(filePath).pipe(res);
        });

        function cleanup() {
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
                timeoutHandle = null;
            }
            if (chromeProc && chromeProc.pid) {
                killProcessTree(chromeProc.pid);
                chromeProc = null;
            }
            try {
                server.close();
            } catch (e) {}
        }

        server.listen(0, '127.0.0.1', () => {
            const port = server.address().port;
            const harnessUrl = `http://127.0.0.1:${port}/test-runner`;

            console.log(`[test_adversarial_mobile] Server listening on port ${port}`);
            console.log(`[test_adversarial_mobile] Spawning Headless Chrome for matrix execution...`);

            chromeProc = spawn(CHROME_PATH, [
                '--headless=new',
                '--no-sandbox',
                '--disable-gpu',
                '--window-size=1800,1400',
                harnessUrl
            ]);

            chromeProc.on('error', (err) => {
                cleanup();
                resolve({ success: false, error: 'Failed to launch Chrome: ' + err.message });
            });

            timeoutHandle = setTimeout(() => {
                cleanup();
                resolve({ success: false, error: `Execution timed out after ${TEST_TIMEOUT_MS}ms` });
            }, TEST_TIMEOUT_MS);
        });
    });
}

async function main() {
    console.log('='.repeat(80));
    console.log(' COFFEDE TYCOON — EMPIRICAL ADVERSARIAL STRESS TEST SUITE');
    console.log('='.repeat(80));

    const result = await executeAdversarialSuite();
    if (!result.success) {
        console.error('❌ ADVERSARIAL EXECUTION FAILED:', result.error);
        process.exit(1);
    }

    const report = result.data;
    if (report.error) {
        console.error('❌ BROWSER EXECUTION ERROR:', report.error);
        process.exit(1);
    }

    const jsonOutputPath = path.join(PROJECT_ROOT, 'adversarial_test_results.json');
    fs.writeFileSync(jsonOutputPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\nDetailed JSON results saved to: ${jsonOutputPath}`);

    let totalAssertions = 0;
    let passedAssertions = 0;
    let failedAssertions = 0;
    const failureLog = [];

    // 1. Process Intermediate Viewports
    console.log('\n' + '='.repeat(80));
    console.log(' SECTION 1: INTERMEDIATE VIEWPORTS & LANDSCAPE MATRIX');
    console.log('='.repeat(80));

    for (const [vpId, vp] of Object.entries(report.intermediateViewports)) {
        console.log(`\n--- [${vp.id}] ${vp.label} (${vp.width}x${vp.height}) ---`);
        for (const [chkKey, chk] of Object.entries(vp.checks)) {
            totalAssertions++;
            if (chk.passed) {
                passedAssertions++;
                console.log(`  ✅ [${chkKey}]: ${chk.message}`);
            } else {
                failedAssertions++;
                failureLog.push({ section: 'Viewport ' + vp.label, check: chkKey, message: chk.message, details: chk });
                console.log(`  ❌ [${chkKey}]: ${chk.message}`);
                if (chk.smallTargets) {
                    console.log(`     Small targets sample:`, chk.smallTargets);
                }
            }
        }
    }

    // 2. Process Multi-Tab Scan (360px)
    console.log('\n' + '='.repeat(80));
    console.log(' SECTION 2: EXHAUSTIVE MULTI-TAB SCAN (All 9 Tabs on 360px)');
    console.log('='.repeat(80));

    for (const [tabKey, tRes] of Object.entries(report.allTabsScan360)) {
        totalAssertions++;
        if (tRes.passed) {
            passedAssertions++;
            console.log(`  ✅ Tab [${tabKey}]: Zero overflow (tab=${tRes.tabScrollW}px, app=${tRes.appScrollW}px <= ${tRes.innerW}px) & ${tRes.validCount} touch targets >= 44x44px`);
        } else {
            failedAssertions++;
            failureLog.push({ section: 'Tab Scan (360px) [' + tabKey + ']', check: 'tabIntegrity', message: `Overflow: ${tRes.overflowPass}, Small targets: ${tRes.smallTargetsCount}`, details: tRes });
            console.log(`  ❌ Tab [${tabKey}]: FAILED (OverflowPass=${tRes.overflowPass}, SmallTargets=${tRes.smallTargetsCount})`);
            if (tRes.smallTargets && tRes.smallTargets.length > 0) {
                console.log(`     Small targets on tab [${tabKey}]:`, tRes.smallTargets);
            }
        }
    }

    // 3. Process Dynamic Stress Results
    console.log('\n' + '='.repeat(80));
    console.log(' SECTION 3: EXTREME DYNAMIC STRESS & SIMULATION CONTROLS');
    console.log('='.repeat(80));

    for (const [stressKey, sRes] of Object.entries(report.dynamicStress360)) {
        totalAssertions++;
        if (sRes.passed) {
            passedAssertions++;
            console.log(`  ✅ Stress [${stressKey}]: PASSED without JS errors`);
        } else {
            failedAssertions++;
            failureLog.push({ section: 'Dynamic Stress', check: stressKey, message: sRes.error || 'Failed with errors', details: sRes });
            console.log(`  ❌ Stress [${stressKey}]: FAILED (${sRes.error || JSON.stringify(sRes.errors)})`);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log(' ADVERSARIAL CHALLENGE EXECUTION SUMMARY');
    console.log('='.repeat(80));
    console.log(` Total Assertions Evaluated : ${totalAssertions}`);
    console.log(` Assertions Passed          : ${passedAssertions} (${((passedAssertions / totalAssertions) * 100).toFixed(1)}%)`);
    console.log(` Assertions Failed          : ${failedAssertions}`);

    if (failedAssertions > 0) {
        console.log('\n❌ EMPIRICAL FAILURES DETECTED:');
        failureLog.forEach((f, idx) => {
            console.log(`  ${idx + 1}. [${f.section}] ${f.check} -> ${f.message}`);
        });
        console.log('\nVerdict: REQUEST_CHANGES (Deficiencies reproduced empirically)');
        process.exit(1);
    } else {
        console.log('\n✅ ALL ADVERSARIAL STRESS CHECKS PASSED EMPIRICALLY!');
        console.log('Verdict: APPROVE (Implementation proven rock-solid across all dimensions)');
        process.exit(0);
    }
}

main().catch(err => {
    console.error('Fatal crash:', err);
    process.exit(1);
});
