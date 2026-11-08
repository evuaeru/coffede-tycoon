const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, '..', req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'application/javascript';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    
    let content = fs.readFileSync(filePath);
    if (req.url.startsWith('/test_upgrades.html')) {
        const cat = req.url.includes('cat=') ? req.url.split('cat=')[1].split('&')[0] : 'all';
        const idx = req.url.includes('idx=') ? parseInt(req.url.split('idx=')[1]) : 0;
        let html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
        html = html.replace('</body>', `<script>
            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (window.gameController) {
                        window.gameController.switchTab('upgrades');
                        window.gameController.jumpToUpgradeCategory('${cat}');
                        window.gameController.selectedUpgradeIndex = ${idx};
                        window.gameController.renderUpgradesTab();
                    }
                }, 500);
            });
        </script></body>`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
});

server.listen(8088, () => {
    console.log('Server running on 8088');
    const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    
    function capture(url, fileName) {
        const screenshotPath = path.join(__dirname, '..', fileName);
        try {
            execSync(`"${chrome}" --headless=new --no-sandbox --disable-gpu --screenshot="${screenshotPath}" --window-size=1200,850 "${url}"`, {
                timeout: 15000
            });
            console.log('Saved', fileName);
        } catch (e) {
            console.error('Error on', fileName, e.message);
        }
    }

    // Capture the 5 items reported by Master Zay:
    capture('http://localhost:8088/test_upgrades.html?cat=grinder&idx=2', 'snap_upg_grinder_3.png');
    capture('http://localhost:8088/test_upgrades.html?cat=canopy&idx=0', 'snap_upg_canopy_1.png');
    capture('http://localhost:8088/test_upgrades.html?cat=canopy&idx=2', 'snap_upg_canopy_3.png');
    capture('http://localhost:8088/test_upgrades.html?cat=marketing&idx=0', 'snap_upg_marketing_1.png');
    capture('http://localhost:8088/test_upgrades.html?cat=marketing&idx=1', 'snap_upg_marketing_2.png');

    server.close();
});
