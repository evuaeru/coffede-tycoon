const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('js/game.js', 'utf8');

const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const found = new Set();
const missing = [];
while ((match = idRegex.exec(js)) !== null) {
  const id = match[1];
  found.add(id);
  if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
    missing.push(id);
  }
}

console.log(`Found ${found.size} unique getElementById references.`);
if (missing.length === 0) {
  console.log('✓ All DOM IDs in game.js exist in index.html!');
} else {
  console.error('Missing IDs in index.html:', missing);
  process.exit(1);
}
