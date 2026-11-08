const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const html = `<!DOCTYPE html><html><body><script>
window.addEventListener('load', () => {
    document.title = 'W=' + window.innerWidth + ',H=' + window.innerHeight + ',M640=' + window.matchMedia('(max-width: 640px)').matches;
});
</script></body></html>`;

fs.writeFileSync('test_mq.html', html);
const res = cp.spawnSync(chrome, [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=480,800',
    '--dump-dom',
    'file:///' + path.resolve('test_mq.html')
]);
console.log('Result:', res.stdout.toString().match(/<title>([^<]+)<\/title>/));
fs.unlinkSync('test_mq.html');
