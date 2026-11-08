const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

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
    if (req.url.startsWith('/test_locations.html')) {
        // Inject script to switch to tab_locations immediately
        let html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
        html = html.replace('</body>', `<script>
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const btn = document.querySelector('[data-tab="locations"]');
                    if (btn) btn.click();
                    console.log('Switched to locations tab');
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

server.listen(8089, () => {
    console.log('Server running on 8089');
    const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const screenshotPath = path.join(__dirname, '..', 'current_locations_tab.png');
    
    try {
        execSync(`"${chrome}" --headless=new --no-sandbox --disable-gpu --screenshot="${screenshotPath}" --window-size=1200,900 "http://localhost:8089/test_locations.html"`, {
            timeout: 10000
        });
        console.log('Screenshot saved to', screenshotPath);
    } catch (e) {
        console.error('Error taking screenshot:', e.message);
    } finally {
        server.close();
    }
});
