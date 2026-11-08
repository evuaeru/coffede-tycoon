const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

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

server.listen(8097, async () => {
    const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

    function takeSnap(url, outName, size = '1200,800') {
        return new Promise((resolve) => {
            const outPath = path.join(rootDir, outName);
            const child = spawn(chrome, [
                '--headless=new',
                '--no-sandbox',
                '--disable-gpu',
                '--disable-background-networking',
                '--disable-default-apps',
                '--disable-sync',
                `--window-size=${size}`,
                `--screenshot=${outPath}`,
                url
            ]);
            child.on('close', () => resolve(outPath));
        });
    }

    console.log('Capturing verified upgrades...');
    await takeSnap('http://localhost:8097/snap_item?cat=grinder&idx=2', 'snap_verified_grinder_3.png');
    await takeSnap('http://localhost:8097/snap_item?cat=canopy&idx=0', 'snap_verified_canopy_1.png');
    await takeSnap('http://localhost:8097/snap_item?cat=canopy&idx=2', 'snap_verified_canopy_3.png');
    await takeSnap('http://localhost:8097/snap_item?cat=marketing&idx=0', 'snap_verified_marketing_1.png');
    await takeSnap('http://localhost:8097/snap_item?cat=marketing&idx=1', 'snap_verified_marketing_2.png');
    console.log('All done!');
    server.close();
});
