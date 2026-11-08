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

    if (req.url.startsWith('/test_loc')) {
        let html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
        const locIndex = req.url.includes('idx=') ? parseInt(req.url.split('idx=')[1]) : 0;
        const openHelp = req.url.includes('help=true');
        html = html.replace('</body>', `<script>
            window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (window.gameController) {
                        window.gameController.switchTab('locations');
                        window.gameController.selectedLocationIndex = ${locIndex};
                        window.gameController.renderLocationCarousel();
                        if (${openHelp}) {
                            const d = document.getElementById('locHelpPopup');
                            if (d) d.style.display = 'block';
                        }
                    }
                }, 100);
            });
        </script></body>`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    res.writeHead(200, { 'Content-Type': type });
    res.end(fs.readFileSync(filePath));
});

server.listen(8093, async () => {
    const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

    function takeSnap(url, outName, size = '1200,900') {
        return new Promise((resolve) => {
            const outPath = path.join(rootDir, outName);
            const child = spawn(chrome, [
                '--headless',
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

    console.log('Capturing tests...');
    await takeSnap('http://localhost:8093/test_loc?idx=0', 'snap_cul_de_sac.png'); // Quiet Cul-de-Sac
    await takeSnap('http://localhost:8093/test_loc?idx=19', 'snap_airport.png'); // International Airport Terminal
    await takeSnap('http://localhost:8093/test_loc?idx=9', 'snap_construction.png'); // Downtown Construction Site
    await takeSnap('http://localhost:8093/test_loc?idx=0&help=true', 'snap_cul_de_sac_help.png'); // Help drawer open
    await takeSnap('http://localhost:8093/test_loc?idx=0', 'snap_mobile_480.png', '480,800'); // Mobile
    console.log('Done captures!');
    server.close();
});
