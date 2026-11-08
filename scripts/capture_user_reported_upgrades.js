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

    if (req.url.startsWith('/snap_item')) {
        let html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
        const cat = req.url.includes('cat=') ? req.url.split('cat=')[1].split('&')[0] : 'all';
        const idx = req.url.includes('idx=') ? parseInt(req.url.split('idx=')[1]) : 0;
        html = html.replace('</body>', `<script>
            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (window.gameController) {
                        window.gameController.switchTab('upgrades');
                        window.gameController.jumpToUpgradeCategory('${cat}');
                        window.gameController.selectedUpgradeIndex = ${idx};
                        window.gameController.renderUpgradesTab();
                    }
                }, 400);
            });
        </script></body>`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    res.writeHead(200, { 'Content-Type': type });
    res.end(fs.readFileSync(filePath));
});

server.listen(8096, () => {
    const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

    function takeSnap(url, outName) {
        const outPath = path.join(rootDir, outName);
        console.log('Capturing', outName);
        spawnSync(chrome, [
            '--headless=new',
            '--no-sandbox',
            '--disable-gpu',
            '--window-size=1200,800',
            `--screenshot=${outPath}`,
            url
        ], { timeout: 15000 });
        console.log('Done', outName);
    }

    // 1. Commercial Precision Flat Burr Mill
    takeSnap('http://localhost:8096/snap_item?cat=grinder&idx=2', 'snap_verified_grinder_3.png');
    // 2. Open Cart Framework
    takeSnap('http://localhost:8096/snap_item?cat=canopy&idx=0', 'snap_verified_canopy_1.png');
    // 3. Retractable Awning
    takeSnap('http://localhost:8096/snap_item?cat=canopy&idx=2', 'snap_verified_canopy_3.png');
    // 4. Word of Mouth
    takeSnap('http://localhost:8096/snap_item?cat=marketing&idx=0', 'snap_verified_marketing_1.png');
    // 5. Chalkboard & Street Flyers
    takeSnap('http://localhost:8096/snap_item?cat=marketing&idx=1', 'snap_verified_marketing_2.png');

    server.close();
});
