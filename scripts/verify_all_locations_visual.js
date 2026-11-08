const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve(__dirname, '..', 'index.html');

// Create test runner HTML that executes check in real browser
const testHtml = `<!DOCTYPE html>
<html>
<head><title>Visual Test</title></head>
<body>
<iframe id="appFrame" src="${htmlPath.replace(/\\/g, '/')}" style="width: 1200px; height: 900px; border: none;"></iframe>
<script>
window.addEventListener('message', (e) => {});
const iframe = document.getElementById('appFrame');
iframe.onload = () => {
    const fWin = iframe.contentWindow;
    const fDoc = iframe.contentDocument;
    
    setTimeout(() => {
        const game = fWin.gameController;
        const sim = fWin.simulationModel;
        game.switchTab('locations');
        const locs = sim.getLocations();
        const keys = Object.keys(locs);
        const report = [];

        keys.forEach((k, idx) => {
            game.selectedLocationIndex = idx;
            game.renderLocationsTab();
            const title = fDoc.getElementById('locCardTitle');
            const desc = fDoc.getElementById('locCardDesc');
            const card = fDoc.getElementById('locCardFrame');
            const portrait = fDoc.getElementById('locPortraitBox');
            const infoCol = fDoc.querySelector('.loc-card-info-col');
            const nextBtn = fDoc.getElementById('btnLocNext');
            const prevBtn = fDoc.getElementById('btnLocPrev');

            const cardRect = card.getBoundingClientRect();
            const nextRect = nextBtn.getBoundingClientRect();
            const prevRect = prevBtn.getBoundingClientRect();
            const infoRect = infoCol.getBoundingClientRect();
            const portRect = portrait.getBoundingClientRect();

            // Collision checks
            const nextCollides = !(cardRect.right <= nextRect.left);
            const prevCollides = !(prevRect.right <= cardRect.left);
            const infoOverflows = infoCol.scrollWidth > infoCol.clientWidth;

            report.push({
                index: idx,
                key: k,
                name: title.textContent,
                cardWidth: cardRect.width,
                portraitWidth: portRect.width,
                infoWidth: infoRect.width,
                prevGap: cardRect.left - prevRect.right,
                nextGap: nextRect.left - cardRect.right,
                prevCollides,
                nextCollides,
                infoOverflows,
                descHeight: desc.offsetHeight
            });
        });

        console.log('---VISUAL_REPORT_START---');
        console.log(JSON.stringify(report, null, 2));
        console.log('---VISUAL_REPORT_END---');
    }, 200);
};
</script>
</body>
</html>`;

const runnerPath = path.resolve(__dirname, '..', 'visual_runner.html');
fs.writeFileSync(runnerPath, testHtml);

try {
    const res = cp.spawnSync(chrome, [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--enable-logging=stderr',
        '--v=1',
        '--window-size=1200,900',
        'file:///' + runnerPath.replace(/\\/g, '/')
    ], { encoding: 'utf8', timeout: 10000 });

    console.log(res.stderr || res.stdout);
} finally {
    if (fs.existsSync(runnerPath)) fs.unlinkSync(runnerPath);
}
