const { Jimp } = require('jimp');

async function sliceWalkCycle() {
    console.log('--- Slicing Walk Cycle ---');
    const sheet = await Jimp.read('assets/walk_cycle_0.jpg');
    const w = sheet.bitmap.width;
    const h = sheet.bitmap.height;
    console.log(`Dimensions: ${w}x${h}`);

    // Chroma-key white background
    const colHasPixels = new Array(w).fill(false);
    sheet.scan(0, 0, w, h, (x, y, idx) => {
        const r = sheet.bitmap.data[idx];
        const g = sheet.bitmap.data[idx + 1];
        const b = sheet.bitmap.data[idx + 2];

        if (r >= 235 && g >= 235 && b >= 235) {
            sheet.bitmap.data[idx + 3] = 0;
        } else {
            colHasPixels[x] = true;
        }
    });

    // Find horizontal segments
    const segments = [];
    let inSeg = false;
    let segStart = 0;

    for (let x = 0; x < w; x++) {
        if (colHasPixels[x] && !inSeg) {
            inSeg = true;
            segStart = x;
        } else if (!colHasPixels[x] && inSeg) {
            inSeg = false;
            if (x - segStart > 20) {
                segments.push({ start: segStart, end: x });
            }
        }
    }
    if (inSeg && (w - segStart > 20)) {
        segments.push({ start: segStart, end: w });
    }

    console.log(`Found ${segments.length} frames:`, segments);

    // Crop each frame with uniform height and bottom alignment
    let globalMinY = h, globalMaxY = 0;
    sheet.scan(0, 0, w, h, (x, y, idx) => {
        if (sheet.bitmap.data[idx + 3] > 0) {
            if (y < globalMinY) globalMinY = y;
            if (y > globalMaxY) globalMaxY = y;
        }
    });

    console.log(`Global Y range: ${globalMinY} to ${globalMaxY} (height: ${globalMaxY - globalMinY + 1})`);

    const pad = 2;
    const cropY = Math.max(0, globalMinY - pad);
    const cropH = Math.min(h - cropY, (globalMaxY - globalMinY + 1) + pad * 2);

    for (let i = 0; i < Math.min(4, segments.length); i++) {
        const seg = segments[i];
        const frameImg = sheet.clone();
        const cX = Math.max(0, seg.start - pad);
        const cW = Math.min(w - cX, (seg.end - seg.start) + pad * 2);

        frameImg.crop({ x: cX, y: cropY, w: cW, h: cropH });
        const outName = `assets/walk_0_${i}.png`;
        await frameImg.write(outName);
        console.log(`✓ Saved ${outName} (${cW}x${cropH})`);
    }

    console.log('✅ All 4 walk cycle frames saved successfully!');
}

sliceWalkCycle().catch(console.error);
