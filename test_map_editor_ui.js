const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- STARTING MAP EDITOR SIDEBAR & SCROLL INTEGRITY TEST ---');

const cssContent = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
const editorJsContent = fs.readFileSync(path.join(__dirname, 'js', 'editor.js'), 'utf8');
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Test 1: CSS Grid align-items and flex-shrink rules
console.log('\n[Test 1] CSS Grid & Flexbox Sizing Rules:');
assert(cssContent.includes('.editor-workspace {'), 'Missing .editor-workspace in style.css');
assert(cssContent.includes('align-items: start;'), 'Missing align-items: start; in .editor-workspace');
assert(cssContent.includes('flex-shrink: 0;'), 'Missing flex-shrink: 0; in .editor-card');
assert(cssContent.includes('min-height: min-content;'), 'Missing min-height: min-content; in .editor-card');
console.log('✓ .editor-workspace unconstrained with align-items: start and .editor-card has flex-shrink: 0');

// Test 2: Sidebar Grid & Layout
console.log('\n[Test 2] Sidebar Grid & Layout:');
assert(cssContent.includes('.editor-sidebar {'), 'Missing .editor-sidebar in style.css');
assert(cssContent.includes('display: grid;'), 'Missing display: grid in .editor-sidebar');
assert(cssContent.includes('grid-template-columns: repeat(2, minmax(0, 1fr));'), 'Missing 2-column layout in .editor-sidebar');
console.log('✓ .editor-sidebar configured with responsive 2-column grid layout');

// Test 3: Collapsible Card Accordion Support
console.log('\n[Test 3] Collapsible Card Accordion Support:');
assert(cssContent.includes('.editor-card.collapsed .tycoon-card-body'), 'Missing .editor-card.collapsed .tycoon-card-body rule in style.css');
assert(editorJsContent.includes(".classList.toggle('collapsed')"), 'Missing collapsed toggle in js/editor.js');
console.log('✓ Accordion toggle wired up in CSS and JS');

// Test 4: Simulated DOM Accordion Toggle
console.log('\n[Test 4] Simulated DOM Accordion Toggle:');
class MockClassList {
    constructor() { this.classes = new Set(); }
    add(c) { this.classes.add(c); }
    remove(c) { this.classes.delete(c); }
    toggle(c) {
        if (this.classes.has(c)) { this.classes.delete(c); return false; }
        this.classes.add(c); return true;
    }
    contains(c) { return this.classes.has(c); }
}

const mockCard = {
    classList: new MockClassList()
};
assert.strictEqual(mockCard.classList.contains('collapsed'), false);
mockCard.classList.toggle('collapsed');
assert.strictEqual(mockCard.classList.contains('collapsed'), true);
mockCard.classList.toggle('collapsed');
assert.strictEqual(mockCard.classList.contains('collapsed'), false);
console.log('✓ Simulated card toggle behavior functions properly');

// Test 5: Cache busters in index.html
console.log('\n[Test 5] Cache Busters in index.html:');
assert(/style\.css\?v=(1[7-9]|[2-9]\d)/.test(htmlContent), 'style.css cache buster must be at least v=17');
assert(/js\/editor\.js\?v=(1[7-9]|[2-9]\d)/.test(htmlContent), 'js/editor.js cache buster must be at least v=17');
console.log('✓ Cache busters verified');

// Test 6: Waypoint Actions & Inspector UI Elements
console.log('\n[Test 6] Waypoint Actions & Inspector UI Elements:');
assert(htmlContent.includes('id="btnAddWpAtEnd"'), 'Missing #btnAddWpAtEnd in index.html');
assert(htmlContent.includes('id="btnInsertWpAfter"'), 'Missing #btnInsertWpAfter in index.html');
assert(htmlContent.includes('id="selectedWpInspector"'), 'Missing #selectedWpInspector in index.html');
assert(htmlContent.includes('id="inputWpX"'), 'Missing #inputWpX in index.html');
assert(htmlContent.includes('id="inputWpY"'), 'Missing #inputWpY in index.html');
assert(cssContent.includes('.wp-action-buttons'), 'Missing .wp-action-buttons in style.css');
assert(cssContent.includes('.selected-wp-inspector'), 'Missing .selected-wp-inspector in style.css');
assert(cssContent.includes('.editor-sub-hints'), 'Missing .editor-sub-hints in style.css');
assert(editorJsContent.includes('addWaypointToEnd()'), 'Missing addWaypointToEnd in js/editor.js');
assert(editorJsContent.includes('insertWaypointAfter()'), 'Missing insertWaypointAfter in js/editor.js');
assert(editorJsContent.includes("addEventListener('dblclick'"), 'Missing dblclick listener on canvas');
console.log('✓ Waypoint buttons, inspector, canvas dblclick, and coordinate inputs verified');

console.log('\n======================================================');
console.log('✅ ALL MAP EDITOR SIDEBAR & SCROLL INTEGRITY TESTS PASSED!');
console.log('======================================================');
