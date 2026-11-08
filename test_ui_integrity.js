const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const gameJs = fs.readFileSync('js/game.js', 'utf8');
const audioJs = fs.readFileSync('js/audio.js', 'utf8');

console.log('--- RUNNING UI INTEGRITY VERIFICATION ---');

// 1. Check all classes used in index.html exist in style.css or are valid
const classRegex = /class=["']([^"']+)["']/g;
let match;
const allClasses = new Set();
while ((match = classRegex.exec(html)) !== null) {
    match[1].split(/\s+/).forEach(c => {
        if (c.trim()) allClasses.add(c.trim());
    });
}
console.log(`Discovered ${allClasses.size} unique CSS classes in index.html.`);

let missingClasses = 0;
allClasses.forEach(cls => {
    // Check if class exists in style.css (e.g. .cls or [class*="cls"])
    const escaped = cls.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\.${escaped}\\b`);
    if (!regex.test(css)) {
        console.warn(`Note: Class .${cls} not explicitly found in style.css`);
        missingClasses++;
    }
});
console.log(`Class coverage check: ${allClasses.size - missingClasses}/${allClasses.size} matched.`);

// 2. Check 91 DOM IDs
const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
const foundIds = new Set();
const missingIds = [];
while ((match = idRegex.exec(gameJs)) !== null) {
    const id = match[1];
    foundIds.add(id);
    if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
        missingIds.push(id);
    }
}
if (missingIds.length > 0) {
    console.error('FAILED: Missing DOM IDs:', missingIds);
    process.exit(1);
}
console.log(`✓ All ${foundIds.size} getElementById references in game.js verified in index.html.`);

// 3. Check audio hover method
if (!audioJs.includes('playHover()')) {
    console.error('FAILED: playHover() not found in audio.js');
    process.exit(1);
}
console.log('✓ playHover() verified in audio.js.');

// 4. Check stepper buttons binding
if (!gameJs.includes('.stepper-btn')) {
    console.error('FAILED: .stepper-btn listener not found in game.js');
    process.exit(1);
}
console.log('✓ Stepper buttons verified in game.js.');

console.log('=== ALL UI INTEGRITY CHECKS PASSED ===');
