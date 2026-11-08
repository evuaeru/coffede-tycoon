const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve(__dirname, '..', 'index.html');

const testHtml = `<!DOCTYPE html>
<html>
<head><title>Upgrades Visual Test</title></head>
<body>
<iframe id="appFrame" src="${htmlPath.replace(/\\/g, '/')}" style="width: 1200px; height: 900px; border: none;"></iframe>
<script>
const iframe = document.getElementById('appFrame');
iframe.onload = () => {
    const fWin = iframe.contentWindow;
    const fDoc = iframe.contentDocument;
    
    setTimeout(() => {
        const game = fWin.gameController;
        const sim = fWin.simulationModel;
        game.switchTab('upgrades');
        game.jumpToUpgradeCategory('all');
        const items = game.getFilteredUpgrades();
        const report = [];

        items.forEach((item, idx) => {
            game.selectedUpgradeIndex = idx;
            game.renderUpgradesTab();
            const title = fDoc.getElementById('upgCardTitle');
            const desc = fDoc.getElementById('upgCardDesc');
            const card = fDoc.getElementById('upgCardFrame');
            const portrait = fDoc.getElementById('upgPortraitBox');
            const portraitImg = fDoc.getElementById('upgPortraitImg');
            const infoCol = fDoc.querySelector('.upg-card-info-col');
            const nextBtn = fDoc.getElementById('btnUpgNext');
            const prevBtn = fDoc.getElementById('btnUpgPrev');
            const buyBtn = fDoc.getElementById('upgBtnBuy');
            const priceVal = fDoc.getElementById('upgPriceVal');

            const cardRect = card.getBoundingClientRect();
            const nextRect = nextBtn.getBoundingClientRect();
            const prevRect = prevBtn.getBoundingClientRect();
            const infoRect = infoCol.getBoundingClientRect();
            const portRect = portrait.getBoundingClientRect();

            // Collision checks
            const nextCollides = !(cardRect.right <= nextRect.left);
            const prevCollides = !(prevRect.right <= cardRect.left);
            const infoOverflows = infoCol.scrollWidth > infoCol.clientWidth;
            const imgNaturalW = portraitImg.naturalWidth;
            const imgNaturalH = portraitImg.naturalHeight;

            report.push({
                index: idx,
                id: item.id,
                category: item.category,
                level: item.level,
                name: title.textContent,
                cardWidth: cardRect.width,
                portraitWidth: portRect.width,
                portraitHeight: portRect.height,
                imgNaturalW,
                imgNaturalH,
                infoWidth: infoRect.width,
                prevGap: cardRect.left - prevRect.right,
                nextGap: nextRect.left - cardRect.right,
                prevCollides,
                nextCollides,
                infoOverflows,
                buyText: buyBtn.textContent.trim(),
                priceText: priceVal.textContent.trim()
            });
        });

        // Also verify real HTML5 gameCanvas stand rendering across ALL 7 categories in isolation
        const canvas = fDoc.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const categoryMaxLevels = {
            decor: 5,
            machine: 4,
            cooler: 4,
            grinder: 3,
            terminal: 3,
            canopy: 3,
            marketing: 4
        };
        const categoryChecksums = {};
        const dpr = fWin.simulationEngine.dpr || 2;
        const sx = Math.max(0, Math.floor(((fWin.simulationEngine.standX || 235) - 60) * dpr));
        const sy = Math.max(0, Math.floor(((fWin.simulationEngine.standY || 180) - 85) * dpr));
        const sw = 200 * dpr;
        const sh = 180 * dpr;

        for (const [cat, maxLvl] of Object.entries(categoryMaxLevels)) {
            categoryChecksums[cat] = [];
            for (let lvl = 1; lvl <= maxLvl; lvl++) {
                sim.upgrades = {
                    decor: 1,
                    machine: 1,
                    cooler: 1,
                    grinder: 1,
                    terminal: 1,
                    canopy: 1,
                    marketing: 1
                };
                sim.upgrades[cat] = lvl;
                fWin.simulationEngine.render();
                const imgData = ctx.getImageData(sx, sy, sw, sh).data;
                let checksum = 0;
                for (let i = 0; i < imgData.length; i += 4) {
                    checksum = ((checksum << 5) - checksum + imgData[i] + imgData[i+1]*3 + imgData[i+2]*7) | 0;
                }
                categoryChecksums[cat].push({ level: lvl, checksum });
            }
        }

        // Also verify custom cartWidth scaling extremes (45px and 130px) with full Tier 5 upgrades
        const origCartW = fWin.spriteRenderer.cartWidth;
        const scaleChecksums = {};
        for (const wVal of [45, 76, 130]) {
            fWin.spriteRenderer.cartWidth = wVal;
            sim.upgrades = { decor: 5, machine: 4, cooler: 4, grinder: 3, terminal: 3, canopy: 3, marketing: 4 };
            fWin.simulationEngine.render();
            const imgData = ctx.getImageData(sx, sy, sw, sh).data;
            let cs = 0;
            for (let i = 0; i < imgData.length; i += 4) {
                cs = ((cs << 5) - cs + imgData[i] + imgData[i+1]*3 + imgData[i+2]*7) | 0;
            }
            scaleChecksums[wVal] = cs;
        }
        fWin.spriteRenderer.cartWidth = origCartW;

        // Draw a 3x5 visual inspection matrix at the top of the body for screenshot verification
        const matrixCanvas = document.createElement('canvas');
        matrixCanvas.width = 1200;
        matrixCanvas.height = 750;
        matrixCanvas.style.cssText = 'position:fixed;top:0;left:0;z-index:99999;background:#0f172a;';
        document.body.appendChild(matrixCanvas);
        const mctx = matrixCanvas.getContext('2d');
        mctx.imageSmoothingEnabled = false;

        const rows = [
            { label: 'Lvl 1 Upgs', fn: (d) => ({ decor: d, machine: 1, cooler: 1, grinder: 1, terminal: 1, canopy: 1, marketing: 1 }) },
            { label: 'Mid Upgs',   fn: (d) => ({ decor: d, machine: 2, cooler: 2, grinder: 2, terminal: 2, canopy: 2, marketing: 2 }) },
            { label: 'MAX Upgs',   fn: (d) => ({ decor: d, machine: 4, cooler: 4, grinder: 3, terminal: 3, canopy: 3, marketing: 4 }) }
        ];
        rows.forEach((row, rIdx) => {
            for (let d = 1; d <= 5; d++) {
                sim.upgrades = row.fn(d);
                fWin.simulationEngine.render();
                mctx.drawImage(canvas, sx, sy, sw, sh, (d - 1) * 240, rIdx * 250, 236, 246);
                mctx.fillStyle = '#0f172a';
                mctx.fillRect((d - 1) * 240, rIdx * 250, 236, 22);
                mctx.fillStyle = rIdx === 2 ? '#fde047' : '#f8fafc';
                mctx.font = 'bold 13px monospace';
                mctx.fillText('Decor ' + d + ' (' + row.label + ')', (d - 1) * 240 + 8, rIdx * 250 + 15);
            }
        });

        console.log('---UPGRADES_REPORT_START---' + JSON.stringify({ count: report.length, report, categoryChecksums, scaleChecksums }) + '---UPGRADES_REPORT_END---');
    }, 600);
};
</script>
</body>
</html>`;

const runnerPath = path.resolve(__dirname, '..', 'upgrades_visual_runner.html');
const matrixSnapPath = path.resolve(__dirname, '..', 'snap_stand_matrix.png');
fs.writeFileSync(runnerPath, testHtml);

try {
    const res = cp.spawnSync(chrome, [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--allow-file-access-from-files',
        '--virtual-time-budget=5000',
        '--enable-logging=stderr',
        '--v=1',
        '--window-size=1200,750',
        '--screenshot=' + matrixSnapPath,
        'file:///' + runnerPath.replace(/\\/g, '/')
    ], { encoding: 'utf8', timeout: 20000 });

    const out = (res.stderr || '') + '\n' + (res.stdout || '');
    const startIdx = out.indexOf('---UPGRADES_REPORT_START---');
    const endIdx = out.indexOf('---UPGRADES_REPORT_END---');
    if (startIdx !== -1 && endIdx !== -1) {
        let rawBlock = out.substring(startIdx + '---UPGRADES_REPORT_START---'.length, endIdx).trim();
        const firstBrace = rawBlock.indexOf('{');
        const lastBrace = rawBlock.lastIndexOf('}');
        const jsonStr = rawBlock.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(jsonStr);
        const data = parsed.report;
        console.log(`Successfully verified ${data.length} upgrades in headless Chrome!`);
        let hasCollisions = false;
        let hasImgErrors = false;
        data.forEach(r => {
            if (r.prevCollides || r.nextCollides) {
                console.error(`COLLISION in ${r.id}: prev=${r.prevCollides}, next=${r.nextCollides}`);
                hasCollisions = true;
            }
            if (r.infoOverflows) {
                console.error(`INFO OVERFLOW in ${r.id}`);
            }
            if (r.imgNaturalW === 0 || r.imgNaturalH === 0) {
                console.error(`IMAGE FAILED TO LOAD in ${r.id}: ${r.imgNaturalW}x${r.imgNaturalH}`);
                hasImgErrors = true;
            }
        });

        let allCategoriesDistinct = true;
        for (const [cat, hashes] of Object.entries(parsed.categoryChecksums)) {
            const unique = new Set(hashes.map(h => h.checksum));
            console.log(`Category '${cat}' live canvas checksums (${unique.size}/${hashes.length} distinct):`, hashes.map(h => `L${h.level}:${h.checksum}`).join(', '));
            if (unique.size !== hashes.length) {
                console.error(`ERROR: Category '${cat}' did not produce distinct canvas renders for every level!`);
                allCategoriesDistinct = false;
            }
        }

        const scaleVals = Object.values(parsed.scaleChecksums || {});
        const uniqueScales = new Set(scaleVals);
        console.log(`Custom cartWidth (45px, 76px, 130px) live canvas checksums (${uniqueScales.size}/3 distinct):`, JSON.stringify(parsed.scaleChecksums));
        if (uniqueScales.size !== 3) {
            console.error('ERROR: Custom cartWidth scaling did not produce distinct canvas renders!');
            allCategoriesDistinct = false;
        }

        if (!hasCollisions && !hasImgErrors && allCategoriesDistinct && data.length === 26) {
            console.log(`✅ ALL ${data.length} UPGRADES, ALL 7 CATEGORIES & CUSTOM CART WIDTH SCALES VERIFIED IN HEADLESS CHROME!`);
        } else {
            process.exit(1);
        }
    } else {
        console.log('Output did not contain report tags. Log length:', out.length);
        console.log(out.slice(-1000));
        process.exit(1);
    }
} finally {
    if (fs.existsSync(runnerPath)) fs.unlinkSync(runnerPath);
    if (fs.existsSync(matrixSnapPath)) fs.unlinkSync(matrixSnapPath);
}
