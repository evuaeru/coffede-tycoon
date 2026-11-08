/**
 * test_mobile_responsive.js
 * 
 * Automated Mobile Responsive Verification Test Suite (Requirement R4)
 * For Coffede Tycoon (vanilla JS SPA)
 * 
 * Drives headless Google Chrome via a lightweight local HTTP server to programmatically
 * evaluate real Blink-rendered layout geometries across target mobile viewports:
 *   - 375px × 667px  (iPhone SE)
 *   - 390px × 844px  (iPhone 12/13/14/15)
 *   - 412px × 915px  (Samsung Galaxy S21+ / Google Pixel 7)
 *   - 1200px × 800px (Desktop baseline non-regression)
 * 
 * Core Assertions:
 *   a. Zero horizontal overflow (scrollWidth <= innerWidth)
 *   b. Touch target sizes (>= 44x44px for visible interactive elements)
 *   c. Bottom navigation bar (#mobileBottomNav docked on mobile, hidden on desktop, 9 tabs)
 *   d. Simulation canvas responsive scaling & 16:9 aspect ratio
 *   e. Controls bar placement directly below canvas with touch-friendly buttons
 *   f. Supplies ribbon reflow within <header class="game-header"> without overflow
 * 
 * Exits with code 0 on all assertions passed; exit code 1 on any failure.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname);
const CHROME_PATH = process.env.CHROME_BIN || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEST_TIMEOUT_MS = 25000;

// Verify Chrome binary exists
if (!fs.existsSync(CHROME_PATH)) {
    console.error(`❌ Chrome binary not found at: ${CHROME_PATH}`);
    process.exit(1);
}

// MIME types dictionary for static file serving
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

function generateHarnessHtml() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Coffede Tycoon Mobile Verification Harness</title>
    <style>
        body { margin: 0; padding: 16px; font-family: monospace; background: #121212; color: #eee; }
        h1 { font-size: 16px; color: #4caf50; }
        .frames-grid { display: flex; flex-direction: column; gap: 24px; }
        .frame-card { background: #1e1e1e; padding: 12px; border-radius: 8px; display: inline-block; }
        .frame-label { font-weight: bold; margin-bottom: 8px; color: #ffeb3b; }
        iframe { border: 2px solid #555; background: #000; display: block; }
    </style>
</head>
<body>
    <h1>Coffede Tycoon Mobile Automated Verification Suite</h1>
    <div class="frames-grid">
        <div class="frame-card">
            <div class="frame-label">Viewport 1: 375px × 667px (iPhone SE)</div>
            <iframe id="frame375" src="/index.html" style="width: 375px; height: 667px;"></iframe>
        </div>
        <div class="frame-card">
            <div class="frame-label">Viewport 2: 390px × 844px (iPhone 12/13/14)</div>
            <iframe id="frame390" src="/index.html" style="width: 390px; height: 844px;"></iframe>
        </div>
        <div class="frame-card">
            <div class="frame-label">Viewport 3: 412px × 915px (Pixel 7 / Galaxy S21)</div>
            <iframe id="frame412" src="/index.html" style="width: 412px; height: 915px;"></iframe>
        </div>
        <div class="frame-card">
            <div class="frame-label">Viewport 4: 1200px × 800px (Desktop Baseline)</div>
            <iframe id="frame1200" src="/index.html" style="width: 1200px; height: 800px;"></iframe>
        </div>
    </div>

    <script>
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

    function evaluateViewport(width, height, isMobile) {
        const frame = document.getElementById('frame' + width);
        const fDoc = frame.contentDocument;
        const fWin = frame.contentWindow;

        const results = {
            viewport: width + 'x' + height,
            isMobile: isMobile,
            innerWidth: fWin.innerWidth,
            innerHeight: fWin.innerHeight,
            checks: {}
        };

        // 1. HORIZONTAL OVERFLOW CHECK (Req a)
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
                ? 'Zero horizontal overflow (doc=' + docScrollWidth + ', body=' + bodyScrollWidth + ', app=' + appScrollWidth + ' <= ' + innerW + 'px)'
                : 'Horizontal overflow detected (doc=' + docScrollWidth + ', body=' + bodyScrollWidth + ', app=' + appScrollWidth + ' > ' + innerW + 'px)'
        };

        // 2. TOUCH TARGET SIZES (Req b)
        if (isMobile) {
            const selector = 'button, input[type="button"], input[type="submit"], input[type="reset"], input[type="number"], input[type="text"], select, .stepper-btn, .tab-btn, .nav-tab, .nav-item, a[role="button"]';
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
                    ? 'All ' + validCount + ' visible interactive elements meet >= 44x44px touch target minimum'
                    : smallTargets.length + ' visible interactive elements are smaller than 44x44px'
            };
        } else {
            results.checks.touchTargets = {
                passed: true,
                message: 'Desktop baseline: 44px mobile touch target rule not enforced'
            };
        }

        // 3. BOTTOM NAVIGATION BAR (Req c)
        const bottomNav = fDoc.getElementById('mobileBottomNav');
        if (isMobile) {
            if (!bottomNav) {
                results.checks.bottomNavigation = {
                    passed: false,
                    message: 'Missing #mobileBottomNav element in DOM'
                };
            } else {
                const navStyle = fWin.getComputedStyle(bottomNav);
                const isVisible = navStyle.display !== 'none' && navStyle.visibility !== 'hidden';
                const isDocked = navStyle.position === 'fixed' || navStyle.position === 'sticky';
                const navRect = bottomNav.getBoundingClientRect();
                const isAtBottom = navStyle.bottom === '0px' || Math.abs(navRect.bottom - fWin.innerHeight) <= 4;

                const requiredTabs = ['stand', 'recipe', 'supplies', 'upgrades', 'staff', 'locations', 'marketing', 'ledger', 'editor'];
                const missingTabs = [];
                for (const t of requiredTabs) {
                    let found = bottomNav.querySelector('[data-tab="' + t + '"]');
                    if (!found) {
                        const items = Array.from(bottomNav.querySelectorAll('button, a, .nav-tab, [role="tab"]'));
                        found = items.find(el => {
                            const txt = (el.textContent || '').toLowerCase();
                            const dtab = (el.getAttribute('data-tab') || '').toLowerCase();
                            if (t === 'ledger') return txt.includes('ledger') || txt.includes('result') || dtab === 'ledger';
                            if (t === 'editor') return txt.includes('editor') || txt.includes('map') || dtab === 'editor';
                            return txt.includes(t) || dtab === t;
                        });
                    }
                    if (!found) missingTabs.push(t);
                }

                const bottomNavPass = isVisible && isDocked && missingTabs.length === 0;
                results.checks.bottomNavigation = {
                    passed: bottomNavPass,
                    isVisible: isVisible,
                    isDocked: isDocked,
                    position: navStyle.position,
                    missingTabs: missingTabs,
                    message: bottomNavPass
                        ? '#mobileBottomNav is visible, docked (' + navStyle.position + '), and contains all 9 tabs'
                        : (!isVisible ? '#mobileBottomNav is hidden (display: ' + navStyle.display + ')'
                           : (!isDocked ? '#mobileBottomNav is not docked (position: ' + navStyle.position + ')'
                           : 'Missing bottom nav tabs: ' + missingTabs.join(', ')))
                };
            }
        } else {
            // Desktop baseline: bottom nav should be hidden, desktop top nav should be visible
            const desktopNav = fDoc.querySelector('.nav-tab-bar');
            const desktopNavVisible = desktopNav ? fWin.getComputedStyle(desktopNav).display !== 'none' : false;
            let desktopBottomNavHidden = true;
            if (bottomNav) {
                const s = fWin.getComputedStyle(bottomNav);
                desktopBottomNavHidden = s.display === 'none' || s.visibility === 'hidden' || bottomNav.getBoundingClientRect().height === 0;
            }
            const desktopNavPass = desktopBottomNavHidden && desktopNavVisible;
            results.checks.bottomNavigation = {
                passed: desktopNavPass,
                bottomNavHidden: desktopBottomNavHidden,
                desktopTopNavVisible: desktopNavVisible,
                message: desktopNavPass
                    ? 'Desktop navigation verified: #mobileBottomNav is hidden and top .nav-tab-bar is visible'
                    : (!desktopBottomNavHidden ? '#mobileBottomNav is not hidden on desktop (display != none)'
                       : 'Top .nav-tab-bar is missing or hidden on desktop')
            };
        }

        // 4. CANVAS SCALING & 16:9 ASPECT RATIO (Req d)
        const canvas = fDoc.getElementById('gameCanvas') || fDoc.getElementById('simCanvas');
        if (!canvas) {
            results.checks.canvasScaling = {
                passed: false,
                message: 'Simulation canvas (#gameCanvas / #simCanvas) not found in DOM'
            };
        } else {
            const canvasRect = canvas.getBoundingClientRect();
            const fitsWidth = canvasRect.width <= innerW;
            const ratio = canvasRect.width / (canvasRect.height || 1);
            const targetRatio = 16 / 9; // ~1.7778
            const diff = Math.abs(ratio - targetRatio);
            const ratioPass = diff < 0.05;
            const canvasPass = fitsWidth && ratioPass && canvasRect.width > 0;

            results.checks.canvasScaling = {
                passed: canvasPass,
                width: Math.round(canvasRect.width),
                height: Math.round(canvasRect.height),
                ratio: Number(ratio.toFixed(4)),
                diff: Number(diff.toFixed(4)),
                message: canvasPass
                    ? 'Canvas scales to ' + Math.round(canvasRect.width) + 'x' + Math.round(canvasRect.height) + 'px maintaining 16:9 ratio (' + ratio.toFixed(3) + ')'
                    : (!fitsWidth ? 'Canvas width (' + Math.round(canvasRect.width) + 'px) exceeds window (' + innerW + 'px)'
                       : 'Canvas ratio (' + ratio.toFixed(3) + ') deviates from 16:9 by ' + diff.toFixed(3))
            };
        }

        // 5. CONTROLS BAR PLACEMENT (Req e)
        const controls = fDoc.getElementById('canvasControlsBar') || fDoc.querySelector('.stand-controls-below-canvas');
        if (!controls) {
            results.checks.controlsBar = {
                passed: false,
                message: 'Simulation controls bar (#canvasControlsBar or .stand-controls-below-canvas) not found'
            };
        } else {
            const controlsRect = controls.getBoundingClientRect();
            let placedBelow = true;
            if (canvas) {
                const canvasRect = canvas.getBoundingClientRect();
                placedBelow = controlsRect.top >= canvasRect.bottom - 4;
            }

            let controlsBtnPass = true;
            let smallCtrlBtns = [];
            if (isMobile) {
                const ctrlButtons = Array.from(controls.querySelectorAll('button')).filter(b => isElementVisible(b, fWin));
                smallCtrlBtns = ctrlButtons.map(b => {
                    const r = b.getBoundingClientRect();
                    return { text: (b.textContent || '').trim().substring(0, 18), w: Math.round(r.width), h: Math.round(r.height) };
                }).filter(b => b.w < 44 || b.h < 44);
                controlsBtnPass = smallCtrlBtns.length === 0;
            }

            const controlsPass = placedBelow && controlsBtnPass;
            results.checks.controlsBar = {
                passed: controlsPass,
                placedBelow: placedBelow,
                smallButtonCount: smallCtrlBtns.length,
                smallButtons: smallCtrlBtns,
                message: controlsPass
                    ? 'Controls bar sits cleanly below canvas' + (isMobile ? ' with touch targets >= 44x44px' : '')
                    : (!placedBelow ? 'Controls bar is not placed directly below canvas'
                       : 'Controls bar has ' + smallCtrlBtns.length + ' buttons smaller than 44x44px')
            };
        }

        // 6. SUPPLIES RIBBON REFLOW (Req f)
        const supplies = fDoc.getElementById('standSuppliesMonitor');
        const header = fDoc.querySelector('header.game-header');
        if (!supplies) {
            results.checks.suppliesRibbon = {
                passed: false,
                message: '#standSuppliesMonitor not found'
            };
        } else if (!header || !header.contains(supplies)) {
            results.checks.suppliesRibbon = {
                passed: false,
                message: '#standSuppliesMonitor is NOT physically inside <header class="game-header">'
            };
        } else {
            const suppliesRect = supplies.getBoundingClientRect();
            const suppliesScrollWidth = supplies.scrollWidth;
            const reflowPass = suppliesScrollWidth <= innerW && suppliesRect.width <= innerW;
            results.checks.suppliesRibbon = {
                passed: reflowPass,
                scrollWidth: suppliesScrollWidth,
                width: Math.round(suppliesRect.width),
                message: reflowPass
                    ? 'Supplies ribbon reflows inside <header> without overflow (width=' + Math.round(suppliesRect.width) + 'px <= ' + innerW + 'px)'
                    : 'Supplies ribbon overflowed viewport (scrollWidth=' + suppliesScrollWidth + 'px, innerWidth=' + innerW + 'px)'
            };
        }

        return results;
    }

    async function runVerification() {
        try {
            await Promise.all([
                waitLoad(document.getElementById('frame375')),
                waitLoad(document.getElementById('frame390')),
                waitLoad(document.getElementById('frame412')),
                waitLoad(document.getElementById('frame1200'))
            ]);

            // Ensure all iframes have their fonts loaded before reading layout bounding boxes
            await Promise.all(Array.from(document.querySelectorAll('iframe')).map(f => (f.contentDocument && f.contentDocument.fonts) ? f.contentDocument.fonts.ready : Promise.resolve()));

            // Allow initial layout, game engine initialization and animation tick
            await new Promise(r => setTimeout(r, 800));

            const report = {
                viewports: {
                    '375': evaluateViewport(375, 667, true),
                    '390': evaluateViewport(390, 844, true),
                    '412': evaluateViewport(412, 915, true),
                    '1200': evaluateViewport(1200, 800, false)
                }
            };

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

    window.addEventListener('load', runVerification);
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
    } catch (e) {
        // Ignore if process already exited
    }
}

function runMobileResponsiveSuite() {
    return new Promise((resolve) => {
        let chromeProc = null;
        let timeoutHandle = null;

        const server = http.createServer((req, res) => {
            const parsedUrl = new URL(req.url, 'http://127.0.0.1');
            const cleanPath = parsedUrl.pathname;

            // Handle incoming browser report
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

            // Handle test harness runner HTML
            if (cleanPath === '/test-runner') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(generateHarnessHtml());
                return;
            }

            // Handle static files
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

        // Bind to available dynamic port on loopback
        server.listen(0, '127.0.0.1', () => {
            const port = server.address().port;
            const harnessUrl = `http://127.0.0.1:${port}/test-runner`;

            console.log(`[test_mobile_responsive] Local verification server listening on port ${port}`);
            console.log(`[test_mobile_responsive] Launching Headless Chrome (${CHROME_PATH})...`);

            chromeProc = spawn(CHROME_PATH, [
                '--headless=new',
                '--no-sandbox',
                '--disable-gpu',
                '--window-size=1600,1200',
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

function printAndEvaluateReport(report) {
    console.log('\n' + '='.repeat(80));
    console.log(' COFFEDE TYCOON — MOBILE RESPONSIVE VERIFICATION SUITE (R4)');
    console.log('='.repeat(80));

    if (report.error) {
        console.error(`\n❌ TEST RUNNER ERROR: ${report.error}`);
        return false;
    }

    const viewports = report.data ? report.data.viewports : null;
    if (!viewports) {
        console.error('\n❌ Invalid report data received.');
        return false;
    }

    let totalAssertions = 0;
    let passedAssertions = 0;
    let failedAssertions = 0;
    const failures = [];

    const viewportNames = {
        '375': '375px × 667px (iPhone SE)',
        '390': '390px × 844px (iPhone 12/13/14)',
        '412': '412px × 915px (Pixel 7 / Galaxy S21)',
        '1200': '1200px × 800px (Desktop Baseline Non-Regression)'
    };

    for (const vpKey of ['375', '390', '412', '1200']) {
        const vp = viewports[vpKey];
        if (!vp) {
            console.error(`\nMissing viewport data for ${vpKey}`);
            failedAssertions++;
            continue;
        }

        console.log(`\n--------------------------------------------------------------------------------`);
        console.log(` [VIEWPORT ${vpKey}] — ${viewportNames[vpKey] || vpKey}`);
        console.log(`--------------------------------------------------------------------------------`);

        const checkKeys = [
            ['horizontalOverflow', 'Zero Horizontal Overflow'],
            ['touchTargets', 'Touch Target Sizes (>= 44x44px)'],
            ['bottomNavigation', 'Bottom Navigation Bar'],
            ['canvasScaling', 'Simulation Canvas 16:9 Scaling'],
            ['controlsBar', 'Simulation Controls Bar Placement'],
            ['suppliesRibbon', 'Supplies Ribbon Reflow in Header']
        ];

        for (const [key, label] of checkKeys) {
            const check = vp.checks[key];
            totalAssertions++;
            if (!check) {
                console.log(`  ❌ ${label}: Check missing from results`);
                failedAssertions++;
                failures.push(`[${vpKey}] ${label}: check missing`);
                continue;
            }

            if (check.passed) {
                passedAssertions++;
                console.log(`  ✅ ${label}: ${check.message}`);
            } else {
                failedAssertions++;
                console.log(`  ❌ ${label}: ${check.message}`);
                failures.push(`[${vpKey}] ${label}: ${check.message}`);

                if (check.smallTargets && check.smallTargets.length > 0) {
                    console.log(`     Sample violations:`);
                    for (const st of check.smallTargets.slice(0, 5)) {
                        console.log(`       - <${st.tag} class="${st.className}" id="${st.id}"> "${st.text}": ${st.width}×${st.height}px (requires >= 44×44px)`);
                    }
                }
            }
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log(` VERIFICATION SUMMARY:`);
    console.log(` Total Assertions : ${totalAssertions}`);
    console.log(` Passed           : ${passedAssertions}`);
    console.log(` Failed           : ${failedAssertions}`);
    console.log('='.repeat(80));

    if (failedAssertions > 0) {
        console.log('\n❌ FAILED ASSERTIONS BREAKDOWN:');
        failures.forEach((f, idx) => console.log(`  ${idx + 1}. ${f}`));
        console.log('\nResult: FAILED (Exit Code 1)\n');
        return false;
    } else {
        console.log('\n✅ ALL MOBILE RESPONSIVE ASSERTIONS PASSED 100%!');
        console.log('Result: PASSED (Exit Code 0)\n');
        return true;
    }
}

// Entrypoint
(async () => {
    try {
        const report = await runMobileResponsiveSuite();
        const allPassed = printAndEvaluateReport(report);
        process.exit(allPassed ? 0 : 1);
    } catch (err) {
        console.error('Fatal error during test execution:', err);
        process.exit(1);
    }
})();
