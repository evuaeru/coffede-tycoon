const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0].split('#')[0];
    if (reqUrl === '/') reqUrl = '/index.html';
    let filePath = path.join(rootDir, reqUrl);
    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end();
        return;
    }
    const ext = path.extname(filePath);
    let type = 'text/html';
    if (ext === '.js') type = 'application/javascript';
    if (ext === '.css') type = 'text/css';
    if (ext === '.png') type = 'image/png';
    if (ext === '.jpg') type = 'image/jpeg';

    if (req.url.startsWith('/test_upg')) {
        let html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
        const cat = req.url.includes('cat=') ? req.url.split('cat=')[1].split('&')[0] : 'all';
        const idx = req.url.includes('idx=') ? parseInt(req.url.split('idx=')[1]) : 0;
        const openHelp = req.url.includes('help=true');
        html = html.replace('</body>', `<script>
            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (window.gameController) {
                        window.gameController.switchTab('upgrades');
                        window.gameController.jumpToUpgradeCategory('${cat}');
                        window.gameController.selectedUpgradeIndex = ${idx};
                        window.gameController.renderUpgradesTab();
                        if (${openHelp}) {
                            const d = document.getElementById('upgHelpPopup');
                            if (d) d.style.display = 'block';
                        }
                    }
                }, 300);
            });
        </script></body>`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    res.writeHead(200, { 'Content-Type': type });
    res.end(fs.readFileSync(filePath));
});

server.listen(8095, () => {
    const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

    function takeSnap(url, outName, size = '1200,900') {
        const outPath = path.join(rootDir, outName);
        console.log('Capturing', outName);
        const res = spawnSync(chrome, [
            '--headless',
            '--no-sandbox',
            '--disable-gpu',
            `--window-size=${size}`,
            `--screenshot=${outPath}`,
            url
        ], { timeout: 15000 });
        console.log('Result for', outName, 'status:', res.status, 'stderr:', res.stderr ? res.stderr.toString().slice(0, 150) : '');
    }

    takeSnap('http://localhost:8095/test_upg?cat=all&idx=0', 'snap_upgrades_all_0.png');
    takeSnap('http://localhost:8095/test_upg?cat=canopy&idx=1', 'snap_upgrades_canopy_1.png');
    takeSnap('http://localhost:8095/test_upg?cat=cooler&idx=2&help=true', 'snap_upgrades_mr_fridge_help.png');
    takeSnap('http://localhost:8095/test_upg?cat=terminal&idx=1', 'snap_upgrades_ezserve.png');
    server.close();
});
