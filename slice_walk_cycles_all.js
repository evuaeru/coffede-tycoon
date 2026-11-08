const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

async function sliceSheet(jpgPath, outPrefix) {
    if (!fs.existsSync(jpgPath)) {
        console.log(`Skipping ${jpgPath} (does not exist yet)`);
        return false;
    }
    console.log(`\n--- Slicing ${jpgPath} -> ${outPrefix}*.png ---`);
    const sheet = await Jimp.read(jpgPath);
    const w = sheet.bitmap.width;
    const h = sheet.bitmap.height;
    console.log(`Dimensions: ${w}x${h}`);

    // Chroma-key pure white background
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
    let segments = [];
    let inSeg = false;
    let segStart = 0;

    for (let x = 0; x < w; x++) {
        if (colHasPixels[x] && !inSeg) {
            inSeg = true;
            segStart = x;
        } else if (!colHasPixels[x] && inSeg) {
            inSeg = false;
            if (x - segStart > 25) {
                segments.push({ start: segStart, end: x });
            }
        }
    }
    if (inSeg && (w - segStart > 25)) {
        segments.push({ start: segStart, end: w });
    }

    console.log(`Found ${segments.length} raw segments`);

    // If more than 4 segments, keep the 4 widest segments sorted by x position
    if (segments.length > 4) {
        segments.sort((a, b) => (b.end - b.start) - (a.end - a.start));
        segments = segments.slice(0, 4);
        segments.sort((a, b) => a.start - b.start);
    }

    // Determine global vertical bounds
    let globalMinY = h, globalMaxY = 0;
    sheet.scan(0, 0, w, h, (x, y, idx) => {
        if (sheet.bitmap.data[idx + 3] > 0) {
            if (y < globalMinY) globalMinY = y;
            if (y > globalMaxY) globalMaxY = y;
        }
    });

    const pad = 2;
    const cropY = Math.max(0, globalMinY - pad);
    const cropH = Math.min(h - cropY, (globalMaxY - globalMinY + 1) + pad * 2);

    for (let i = 0; i < Math.min(4, segments.length); i++) {
        const seg = segments[i];
        const frameImg = sheet.clone();
        const cX = Math.max(0, seg.start - pad);
        const cW = Math.min(w - cX, (seg.end - seg.start) + pad * 2);

        frameImg.crop({ x: cX, y: cropY, w: cW, h: cropH });
        const outName = `${outPrefix}${i}.png`;
        await frameImg.write(outName);
        console.log(`✓ Saved ${outName} (${cW}x${cropH})`);
    }
    return true;
}

module.exports = { sliceSheet };

if (require.main === module) {
    (async () => {
        for (let i = 0; i < 6; i++) {
            const jpg = `assets/walk_cycle_${i}.jpg`;
            const prefix = `assets/walk_${i}_`;
            await sliceSheet(jpg, prefix);
        }
        console.log('\nDone checking/slicing all walk cycles!');
    })().catch(console.error);
}
