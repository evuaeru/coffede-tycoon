const { Jimp } = require('jimp');

async function slice8Frames() {
    console.log('--- Slicing 8-Frame Walk Cycle from Top Row ---');
    const inputPath = 'C:\\Users\\Nyzan\\.gemini\\antigravity\\brain\\d326c9ec-0ab2-4042-98fb-62f42bc90163\\character_walk_cycle_spritesheet_1792160321403.jpg';
    const sheet = await Jimp.read(inputPath);
    const w = sheet.bitmap.width;
    const h = sheet.bitmap.height;
    console.log(`Original Dimensions: ${w}x${h}`);

    // Crop top half (y: 0 to 450) where the 8 sequential frames are located
    const topRowH = Math.round(h * 0.52);
    sheet.crop({ x: 0, y: 0, w: w, h: topRowH });
    console.log(`Cropped top row to: ${w}x${topRowH}`);

    // Chroma-key white background
    const colHasPixels = new Array(w).fill(false);
    sheet.scan(0, 0, w, topRowH, (x, y, idx) => {
        const r = sheet.bitmap.data[idx];
        const g = sheet.bitmap.data[idx + 1];
        const b = sheet.bitmap.data[idx + 2];

        if (r >= 238 && g >= 238 && b >= 238) {
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
            if (x - segStart > 15) {
                segments.push({ start: segStart, end: x });
            }
        }
    }
    if (inSeg && (w - segStart > 15)) {
        segments.push({ start: segStart, end: w });
    }

    console.log(`Found ${segments.length} segments in top row:`, segments);

    // If more than 8, filter small noise
    if (segments.length > 8) {
        segments.sort((a, b) => (b.end - b.start) - (a.end - a.start));
        segments = segments.slice(0, 8);
        segments.sort((a, b) => a.start - b.start);
    }

    // Determine vertical bounds of the top row sprites
    let globalMinY = topRowH, globalMaxY = 0;
    sheet.scan(0, 0, w, topRowH, (x, y, idx) => {
        if (sheet.bitmap.data[idx + 3] > 0) {
            if (y < globalMinY) globalMinY = y;
            if (y > globalMaxY) globalMaxY = y;
        }
    });

    console.log(`Top row sprite vertical range: ${globalMinY} to ${globalMaxY}`);
    const pad = 2;
    const cropY = Math.max(0, globalMinY - pad);
    const cropH = Math.min(topRowH - cropY, (globalMaxY - globalMinY + 1) + pad * 2);

    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const frameImg = sheet.clone();
        const cX = Math.max(0, seg.start - pad);
        const cW = Math.min(w - cX, (seg.end - seg.start) + pad * 2);

        frameImg.crop({ x: cX, y: cropY, w: cW, h: cropH });
        const outName = `assets/walk_0_${i}.png`;
        await frameImg.write(outName);
        console.log(`✓ Saved 8-frame walk frame ${outName} (${cW}x${cropH})`);
    }

    console.log(`✅ Successfully generated ${segments.length} frames for archetype 0!`);
}

slice8Frames().catch(console.error);
