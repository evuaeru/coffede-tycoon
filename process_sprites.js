const { Jimp } = require('jimp');
const path = require('path');

async function processSprites() {
    console.log('--- Processing Cart Sprite ---');
    const cart = await Jimp.read('assets/coffee_cart.jpg');
    console.log(`Cart dimensions: ${cart.bitmap.width}x${cart.bitmap.height}`);

    const w = cart.bitmap.width;
    const h = cart.bitmap.height;
    let minX = w, maxX = 0, minY = h, maxY = 0;

    cart.scan(0, 0, w, h, (x, y, idx) => {
        const r = cart.bitmap.data[idx];
        const g = cart.bitmap.data[idx + 1];
        const b = cart.bitmap.data[idx + 2];

        // If near white, make transparent
        if (r >= 235 && g >= 235 && b >= 235) {
            cart.bitmap.data[idx + 3] = 0; // Alpha = 0
        } else {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    });

    console.log(`Cart Bounding Box: [${minX}, ${minY}] to [${maxX}, ${maxY}] (${maxX - minX + 1}x${maxY - minY + 1})`);
    
    // Add small 2px padding
    const pad = 2;
    const cropX = Math.max(0, minX - pad);
    const cropY = Math.max(0, minY - pad);
    const cropW = Math.min(w - cropX, (maxX - minX + 1) + pad * 2);
    const cropH = Math.min(h - cropY, (maxY - minY + 1) + pad * 2);

    cart.crop({ x: cropX, y: cropY, w: cropW, h: cropH });
    await cart.write('assets/coffee_cart.png');
    console.log('✓ Successfully saved assets/coffee_cart.png');

    console.log('\n--- Processing NPC Sprites ---');
    const npcs = await Jimp.read('assets/npc_sprites.jpg');
    const nw = npcs.bitmap.width;
    const nh = npcs.bitmap.height;
    console.log(`NPC sheet dimensions: ${nw}x${nh}`);

    // Chroma-key white background
    const colHasPixels = new Array(nw).fill(false);
    npcs.scan(0, 0, nw, nh, (x, y, idx) => {
        const r = npcs.bitmap.data[idx];
        const g = npcs.bitmap.data[idx + 1];
        const b = npcs.bitmap.data[idx + 2];

        if (r >= 235 && g >= 235 && b >= 235) {
            npcs.bitmap.data[idx + 3] = 0;
        } else {
            colHasPixels[x] = true;
        }
    });

    // Find horizontal segments (characters separated by blank columns)
    const segments = [];
    let inSeg = false;
    let segStart = 0;

    for (let x = 0; x < nw; x++) {
        if (colHasPixels[x] && !inSeg) {
            inSeg = true;
            segStart = x;
        } else if (!colHasPixels[x] && inSeg) {
            inSeg = false;
            // Ignore tiny noise (< 10px)
            if (x - segStart > 15) {
                segments.push({ start: segStart, end: x });
            }
        }
    }
    if (inSeg && (nw - segStart > 15)) {
        segments.push({ start: segStart, end: nw });
    }

    console.log(`Found ${segments.length} character segments:`, segments);

    // Save each segment as individual cropped NPC png
    for (let i = 0; i < Math.min(6, segments.length); i++) {
        const seg = segments[i];
        // Clone and crop
        const charImg = npcs.clone();
        
        // Find vertical bounds for this segment
        let cMinY = nh, cMaxY = 0;
        charImg.scan(seg.start, 0, seg.end - seg.start, nh, (x, y, idx) => {
            if (charImg.bitmap.data[idx + 3] > 0) {
                if (y < cMinY) cMinY = y;
                if (y > cMaxY) cMaxY = y;
            }
        });

        const cPad = 2;
        const cX = Math.max(0, seg.start - cPad);
        const cY = Math.max(0, cMinY - cPad);
        const cW = Math.min(nw - cX, (seg.end - seg.start) + cPad * 2);
        const cH = Math.min(nh - cY, (cMaxY - cMinY + 1) + cPad * 2);

        charImg.crop({ x: cX, y: cY, w: cW, h: cH });
        const outName = `assets/npc_${i}.png`;
        await charImg.write(outName);
        console.log(`✓ Saved ${outName} (${cW}x${cH})`);
    }

    console.log('\n✅ All sprites processed successfully with true alpha transparency!');
}

processSprites().catch(err => {
    console.error('Error processing sprites:', err);
});
