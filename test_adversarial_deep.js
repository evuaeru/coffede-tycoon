/**
 * test_adversarial_deep.js
 * 
 * Adversarial Test Coverage Hardening Suite (Tier 5)
 * Coffede Tycoon Mobile Responsive Redesign
 * 
 * Drives headless Google Chrome across 4 viewports (375px, 390px, 412px, 1200px)
 * to programmatically and aggressively stress-test:
 * 1. Deep tab content visibility & horizontal overflow across ALL 10 tabs:
 *    - Stand, Recipe, Supplies, Upgrades, Staff, Locations, Marketing, Leaderboard, Ledger, Map Editor
 * 2. Touch target sizes (>= 44x44px, tolerance >= 43px) inside all active tabs
 * 3. Modal / Dialog containment, viewport fitting & touch targets:
 *    - End-of-Day Financial Audit Modal (#endDayModal)
 *    - Emergency Financial Relief Modal (#emergencyModal)
 *    - Franchise NFT Certificate Modal (#nftModal)
 *    - Insufficient Supplies Warning Modal (#suppliesWarningModal)
 *    - Map Editor JSON Modal (#editorJsonModal)
 * 
 * Returns exit code 0 if all stress tests pass; 1 if any failure occurs.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname);
const CHROME_PATH = process.env.CHROME_BIN || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEST_TIMEOUT_MS = 45000;

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

function generateHarnessHtml() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Coffede Tycoon Adversarial Hardening Suite</title>
    <style>
        body { margin: 0; padding: 16px; font-family: monospace; background: #0f0f0f; color: #eee; }
        .frames { display: flex; flex-direction: column; gap: 20px; }
        iframe { border: 2px solid #444; background: #000; }
    </style>
</head>
<body>
    <h1>Adversarial Test Suite</h1>
    <div class="frames">
        <iframe id="frame375" src="/index.html" style="width: 375px; height: 667px;"></iframe>
        <iframe id="frame390" src="/index.html" style="width: 390px; height: 844px;"></iframe>
        <iframe id="frame412" src="/index.html" style="width: 412px; height: 915px;"></iframe>
        <iframe id="frame1200" src="/index.html" style="width: 1200px; height: 800px;"></iframe>
    </div>

    <script>
    function waitLoad(iframe) {
        return new Promise(resolve => {
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                setTimeout(resolve, 400);
            } else {
                iframe.onload = () => setTimeout(resolve, 400);
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

    function checkTouchTargetsInScope(container, fWin, isMobile) {
        if (!isMobile) return { passed: true, smallTargets: [] };
        const selector = 'button, input[type="button"], input[type="submit"], input[type="reset"], input[type="number"], input[type="text"], select, .stepper-btn, .tab-btn, .nav-tab, .nav-item, .modal-close-btn, a[role="button"]';
        const candidates = Array.from(container.querySelectorAll(selector));
        const smallTargets = [];
        for (const el of candidates) {
            if (!isElementVisible(el, fWin)) continue;
            const r = el.getBoundingClientRect();
            const w = Math.round(r.width);
            const h = Math.round(r.height);
            // 43px minimum to account for 1px subpixel boundary rounding on high-DPI
            if (w < 43 || h < 43) {
                smallTargets.push({
                    tag: el.tagName.toLowerCase(),
                    id: el.id || '',
                    className: (el.className || '').toString().trim().replace(/\\s+/g, ' '),
                    text: (el.textContent || el.value || '').trim().substring(0, 24),
                    width: w,
                    height: h
                });
            }
        }
        return {
            passed: smallTargets.length === 0,
            smallTargets: smallTargets
        };
    }

    async function evaluateViewportAdversarial(width, height, isMobile) {
        const frame = document.getElementById('frame' + width);
        const fDoc = frame.contentDocument;
        const fWin = frame.contentWindow;
        const innerW = fWin.innerWidth;

        const results = {
            viewport: width + 'x' + height,
            isMobile: isMobile,
            innerW: innerW,
            tabs: {},
            modals: {},
            failures: []
        };

        const tabsToTest = [
            'stand', 'recipe', 'supplies', 'upgrades', 'staff',
            'locations', 'marketing', 'leaderboard', 'ledger', 'editor'
        ];

        // 1. ADVERSARIAL TEST: TAB-BY-TAB VISIBILITY, OVERFLOW & ERGONOMICS
        for (const tabId of tabsToTest) {
            if (typeof fWin.switchTab === 'function') {
                fWin.switchTab(tabId);
            } else {
                const btn = fDoc.querySelector('[data-tab="' + tabId + '"]');
                if (btn) btn.click();
            }

            await new Promise(r => setTimeout(r, 80));

            const tabSection = fDoc.getElementById('tab_' + tabId);
            const isTabVisible = tabSection && fWin.getComputedStyle(tabSection).display !== 'none';

            // Check overflow
            const docScroll = fDoc.documentElement.scrollWidth;
            const bodyScroll = fDoc.body.scrollWidth;
            const app = fDoc.querySelector('.app-container');
            const appScroll = app ? app.scrollWidth : docScroll;
            const mainViewport = fDoc.querySelector('.main-viewport');
            const mainScroll = mainViewport ? mainViewport.scrollWidth : docScroll;
            const tabScroll = tabSection ? tabSection.scrollWidth : docScroll;

            const maxScroll = Math.max(docScroll, bodyScroll, appScroll, mainScroll, tabScroll);
            const overflow = maxScroll > innerW;

            // Deep content checks
            let deepContentFound = true;
            let deepContentDesc = '';

            if (tabId === 'stand') {
                const canvas = fDoc.getElementById('gameCanvas');
                const controls = fDoc.getElementById('canvasControlsBar');
                deepContentFound = isElementVisible(canvas, fWin) && isElementVisible(controls, fWin);
                deepContentDesc = 'Canvas & Controls Bar';
            } else if (tabId === 'recipe') {
                const price = fDoc.getElementById('settingPrice') || fDoc.querySelector('.recipe-layout');
                deepContentFound = isElementVisible(price, fWin);
                deepContentDesc = 'Recipe Layout & Price Setting';
            } else if (tabId === 'supplies') {
                const tierCont = fDoc.querySelector('.supplies-tiers-container') || fDoc.querySelector('.supplies-container');
                deepContentFound = isElementVisible(tierCont, fWin);
                deepContentDesc = 'Supplies Tiers Container';
            } else if (tabId === 'upgrades') {
                const upgStage = fDoc.getElementById('upgCardFrame') || fDoc.querySelector('.upgrades-carousel-stage');
                deepContentFound = isElementVisible(upgStage, fWin);
                deepContentDesc = 'Upgrades Carousel Stage';
            } else if (tabId === 'staff') {
                const staffEl = fDoc.getElementById('staffCardFrame') || fDoc.getElementById('staffBtnHire');
                deepContentFound = isElementVisible(staffEl, fWin);
                deepContentDesc = 'Staff Carousel & Hire Button';
            } else if (tabId === 'locations') {
                const locStage = fDoc.getElementById('locCardFrame') || fDoc.querySelector('.locations-carousel-stage');
                deepContentFound = isElementVisible(locStage, fWin);
                deepContentDesc = 'Locations Carousel Stage';
            } else if (tabId === 'marketing') {
                const mktEl = fDoc.querySelector('.marketing-card') || fDoc.querySelector('.marketing-dashboard');
                deepContentFound = isElementVisible(mktEl, fWin);
                deepContentDesc = 'Marketing Channels & Strategy Cards';
            } else if (tabId === 'leaderboard') {
                const lbEl = fDoc.getElementById('btnRefreshLeaderboard') || fDoc.querySelector('#tab_leaderboard .ledger-table-wrapper');
                deepContentFound = isElementVisible(lbEl, fWin);
                deepContentDesc = 'Leaderboard Table & Refresh Button';
            } else if (tabId === 'ledger') {
                const ledgerEl = fDoc.querySelector('#tab_ledger .ledger-table-wrapper') || fDoc.getElementById('ledgerTableBody');
                deepContentFound = isElementVisible(ledgerEl, fWin);
                deepContentDesc = 'Ledger Table & History';
            } else if (tabId === 'editor') {
                const editorWs = fDoc.querySelector('.editor-workspace') || fDoc.querySelector('#tab_editor .editor-container');
                deepContentFound = isElementVisible(editorWs, fWin);
                deepContentDesc = 'Map Editor Workspace';
            }

            // Touch targets inside active tab
            const touchCheck = tabSection ? checkTouchTargetsInScope(tabSection, fWin, isMobile) : { passed: true, smallTargets: [] };

            results.tabs[tabId] = {
                visible: isTabVisible,
                deepContent: deepContentFound,
                deepContentDesc: deepContentDesc,
                maxScroll: maxScroll,
                overflow: overflow,
                touchPassed: touchCheck.passed,
                smallTargets: touchCheck.smallTargets
            };

            if (!isTabVisible) {
                results.failures.push('[' + width + 'px] Tab #' + tabId + ' is not visible after switchTab');
            }
            if (!deepContentFound) {
                results.failures.push('[' + width + 'px] Tab #' + tabId + ' deep content missing: ' + deepContentDesc);
            }
            if (isMobile && overflow) {
                results.failures.push('[' + width + 'px] Tab #' + tabId + ' caused horizontal overflow (maxScroll=' + maxScroll + 'px > innerW=' + innerW + 'px)');
            }
            if (isMobile && !touchCheck.passed) {
                results.failures.push('[' + width + 'px] Tab #' + tabId + ' has ' + touchCheck.smallTargets.length + ' touch targets < 44px: ' + JSON.stringify(touchCheck.smallTargets.slice(0, 3)));
            }
        }

        // Return to stand tab
        if (typeof fWin.switchTab === 'function') {
            fWin.switchTab('stand');
            await new Promise(r => setTimeout(r, 60));
        }

        // 2. ADVERSARIAL TEST: MODALS & DIALOGS
        const modalsToTest = [
            { id: 'endDayModal', name: 'End of Day Financial Audit' },
            { id: 'emergencyModal', name: 'Emergency Relief Bailout' },
            { id: 'nftModal', name: 'Franchise NFT Certificate' },
            { id: 'suppliesWarningModal', name: 'Insufficient Supplies Warning' },
            { id: 'editorJsonModal', name: 'Map Editor JSON' }
        ];

        for (const modalInfo of modalsToTest) {
            const modalEl = fDoc.getElementById(modalInfo.id);
            if (!modalEl) {
                results.failures.push('[' + width + 'px] Missing modal element: #' + modalInfo.id);
                continue;
            }

            const origDisplay = modalEl.style.display;
            const origClass = modalEl.className;

            modalEl.classList.add('active');
            modalEl.style.display = 'flex';
            await new Promise(r => setTimeout(r, 80));

            const modalWindow = modalEl.querySelector('.modal-window, .retro-warning-window') || modalEl;
            const modalRect = modalWindow.getBoundingClientRect();
            const modalWidthFits = Math.round(modalRect.width) <= innerW;

            const docScroll = fDoc.documentElement.scrollWidth;
            const overflow = docScroll > innerW;

            const touchCheck = checkTouchTargetsInScope(modalWindow, fWin, isMobile);

            results.modals[modalInfo.id] = {
                name: modalInfo.name,
                modalWidth: Math.round(modalRect.width),
                modalWidthFits: modalWidthFits,
                overflow: overflow,
                touchPassed: touchCheck.passed,
                smallTargets: touchCheck.smallTargets
            };

            if (isMobile && !modalWidthFits) {
                results.failures.push('[' + width + 'px] Modal ' + modalInfo.name + ' (#' + modalInfo.id + ') width (' + Math.round(modalRect.width) + 'px) exceeds screen (' + innerW + 'px)');
            }
            if (isMobile && overflow) {
                results.failures.push('[' + width + 'px] Modal ' + modalInfo.name + ' (#' + modalInfo.id + ') caused overflow (docScroll=' + docScroll + 'px > innerW=' + innerW + 'px)');
            }
            if (isMobile && !touchCheck.passed) {
                results.failures.push('[' + width + 'px] Modal ' + modalInfo.name + ' (#' + modalInfo.id + ') has ' + touchCheck.smallTargets.length + ' touch targets < 44px: ' + JSON.stringify(touchCheck.smallTargets.slice(0, 3)));
            }

            modalEl.className = origClass;
            modalEl.style.display = origDisplay;
            await new Promise(r => setTimeout(r, 40));
        }

        return results;
    }

    async function runAdversarial() {
        try {
            await Promise.all([
                waitLoad(document.getElementById('frame375')),
                waitLoad(document.getElementById('frame390')),
                waitLoad(document.getElementById('frame412')),
                waitLoad(document.getElementById('frame1200'))
            ]);

            // Allow initial render & tick
            await new Promise(r => setTimeout(r, 600));

            const report = {
                results: {
                    '375': await evaluateViewportAdversarial(375, 667, true),
                    '390': await evaluateViewportAdversarial(390, 844, true),
                    '412': await evaluateViewportAdversarial(412, 915, true),
                    '1200': await evaluateViewportAdversarial(1200, 800, false)
                }
            };

            await fetch('/adversarial-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
            });
        } catch (err) {
            await fetch('/adversarial-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: err.stack || err.message })
            });
        }
    }

    window.addEventListener('load', runAdversarial);
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

function runAdversarialHardening() {
    return new Promise((resolve) => {
        let chromeProc = null;
        let timeoutHandle = null;

        const server = http.createServer((req, res) => {
            const parsedUrl = new URL(req.url, 'http://127.0.0.1');
            const cleanPath = parsedUrl.pathname;

            if (req.method === 'POST' && cleanPath === '/adversarial-report') {
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

            if (cleanPath === '/adversarial-runner') {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(generateHarnessHtml());
                return;
            }

            let relPath = cleanPath === '/' ? 'index.html' : cleanPath.replace(/^\//, '');
            let filePath = path.join(PROJECT_ROOT, relPath);

            if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found: ' + cleanPath);
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            });
            fs.createReadStream(filePath).pipe(res);
        });

        function cleanup() {
            if (timeoutHandle) clearTimeout(timeoutHandle);
            if (chromeProc && chromeProc.pid) {
                killProcessTree(chromeProc.pid);
                chromeProc = null;
            }
            try { server.close(); } catch (e) {}
        }

        server.listen(0, '127.0.0.1', () => {
            const port = server.address().port;
            console.log(`[adversarial_suite] Local verification server listening on port ${port}`);

            const targetUrl = `http://127.0.0.1:${port}/adversarial-runner`;
            const chromeArgs = [
                '--headless=new',
                '--disable-gpu',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--window-size=1600,1200',
                targetUrl
            ];

            console.log(`[adversarial_suite] Launching Headless Chrome (${CHROME_PATH})...`);
            chromeProc = spawn(CHROME_PATH, chromeArgs, {
                stdio: ['ignore', 'pipe', 'pipe']
            });

            chromeProc.on('error', (err) => {
                cleanup();
                resolve({ success: false, error: 'Failed to launch Chrome: ' + err.message });
            });

            timeoutHandle = setTimeout(() => {
                cleanup();
                resolve({ success: false, error: 'Adversarial verification timed out after ' + TEST_TIMEOUT_MS + 'ms' });
            }, TEST_TIMEOUT_MS);
        });
    });
}

async function main() {
    console.log('='.repeat(80));
    console.log(' COFFEDE TYCOON — ADVERSARIAL COVERAGE HARDENING (TIER 5)');
    console.log(' Executing deep tab content, modal, and overflow stress tests...');
    console.log('='.repeat(80));

    const startTime = Date.now();
    const result = await runAdversarialHardening();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (!result.success) {
        console.error(`\n❌ ADVERSARIAL RUNNER ERROR: ${result.error}`);
        process.exit(1);
    }

    if (result.data.error) {
        console.error(`\n❌ IN-BROWSER ADVERSARIAL ERROR:\n${result.data.error}`);
        process.exit(1);
    }

    const { results } = result.data;
    let totalFailures = 0;
    const failureList = [];

    console.log('\n' + '='.repeat(80));
    console.log(' ADVERSARIAL STRESS TEST RESULTS');
    console.log('='.repeat(80));

    for (const [vpKey, vpData] of Object.entries(results)) {
        console.log(`\n--------------------------------------------------------------------------------`);
        console.log(` [VIEWPORT ${vpKey}] — ${vpData.viewport} (${vpData.isMobile ? 'Mobile' : 'Desktop'})`);
        console.log(`--------------------------------------------------------------------------------`);

        console.log(`  Tabs Verified (10 Tabs):`);
        for (const [tabId, tabRes] of Object.entries(vpData.tabs)) {
            const status = (!tabRes.overflow && tabRes.visible && tabRes.deepContent && tabRes.touchPassed) ? '✅' : '❌';
            const ovfInfo = tabRes.overflow ? ` [OVERFLOW maxScroll=${tabRes.maxScroll}px > ${vpData.innerW}px]` : '';
            const touchInfo = (!tabRes.touchPassed && vpData.isMobile) ? ` [${tabRes.smallTargets.length} touch targets < 44px]` : '';
            console.log(`    ${status} Tab #${tabId.padEnd(12, ' ')} : visible=${tabRes.visible}, content=${tabRes.deepContent ? 'OK' : 'MISSING'}${ovfInfo}${touchInfo}`);
        }

        console.log(`  Modals Verified (5 Modals):`);
        for (const [modalId, modalRes] of Object.entries(vpData.modals)) {
            const status = (modalRes.modalWidthFits && !modalRes.overflow && modalRes.touchPassed) ? '✅' : '❌';
            const widthInfo = !modalRes.modalWidthFits ? ` [WIDTH ${modalRes.modalWidth}px > ${vpData.innerW}px]` : '';
            const ovfInfo = modalRes.overflow ? ` [PAGE OVERFLOW]` : '';
            const touchInfo = (!modalRes.touchPassed && vpData.isMobile) ? ` [${modalRes.smallTargets.length} touch targets < 44px]` : '';
            console.log(`    ${status} Modal #${modalId.padEnd(22, ' ')} : fits=${modalRes.modalWidthFits} (${modalRes.modalWidth}px)${widthInfo}${ovfInfo}${touchInfo}`);
        }

        if (vpData.failures && vpData.failures.length > 0) {
            totalFailures += vpData.failures.length;
            failureList.push(...vpData.failures);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log(' SUMMARY');
    console.log('='.repeat(80));
    console.log(` Total Execution Time : ${duration}s`);
    console.log(` Total Hardening Failures : ${totalFailures}`);

    if (totalFailures > 0) {
        console.log('\n❌ HARDENING FAILURES DETECTED:');
        failureList.forEach((f, i) => {
            console.log(` ${i + 1}. ${f}`);
        });
        console.log('\nResult: FAILED (Exit Code 1)');
        process.exit(1);
    } else {
        console.log('\n✅ ALL ADVERSARIAL STRESS TESTS PASSED 100%!');
        console.log('Result: PASSED (Exit Code 0)');
        process.exit(0);
    }
}

if (require.main === module) {
    main();
}
