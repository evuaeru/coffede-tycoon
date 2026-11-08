const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');

function drawShadow(img, cx, cy, rx, ry, maxAlpha = 140) {
    for (let y = cy - ry; y <= cy + ry; y++) {
        for (let x = cx - rx; x <= cx + rx; x++) {
            if (x < 0 || x >= img.bitmap.width || y < 0 || y >= img.bitmap.height) continue;
            const dx = (x - cx) / rx;
            const dy = (y - cy) / ry;
            const distSq = dx * dx + dy * dy;
            if (distSq <= 1.0) {
                const factor = 1.0 - Math.sqrt(distSq);
                const alpha = Math.min(255, Math.floor(factor * maxAlpha));
                const idx = (y * img.bitmap.width + x) * 4;
                const origR = img.bitmap.data[idx];
                const origG = img.bitmap.data[idx + 1];
                const origB = img.bitmap.data[idx + 2];
                const blend = alpha / 255;
                img.bitmap.data[idx] = Math.floor(origR * (1 - blend));
                img.bitmap.data[idx + 1] = Math.floor(origG * (1 - blend));
                img.bitmap.data[idx + 2] = Math.floor(origB * (1 - blend));
            }
        }
    }
}

async function polishGrinder3() {
    console.log('Polishing upg_grinder_3.png...');
    // We already have the top hopper and collar from upg_grinder_3.png.
    // Let's load the current upg_grinder_3.png and fix the lower body cut.
    const orig = await Jimp.read(path.join(ASSETS_DIR, 'upg_grinder_3.png'));
    
    // Find bounds of object on the dark canvas (#242424)
    // Canvas is 1024x1024. The grinder is centered.
    // Let's find the grinder pixels (where color is not #242424 / dark grey)
    // The grinder center is around x=512.
    // Between y=550 and y=800, the body right side is cut off around x=620.
    // Let's scan each row y from 520 to 820:
    // Left edge of grinder is around x=340 to 360.
    // Width of grinder body should be around 280-300px.
    // Center of hopper is ~500.
    // So right edge should be ~500 + (500 - leftEdge) ~ 640-660.
    const data = orig.bitmap.data;
    const w = orig.bitmap.width;

    // Fix the vertical cut at the right side of the body
    for (let y = 520; y <= 830; y++) {
        // Find left edge and right edge of body on this row
        let leftX = -1;
        let rightX = -1;
        for (let x = 300; x < 700; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            // Non-background pixel
            if (r > 45 || g > 45 || b > 45) {
                if (leftX === -1) leftX = x;
                rightX = x;
            }
        }

        if (leftX !== -1 && rightX !== -1) {
            const expectedRight = 505 + (505 - leftX);
            if (rightX < expectedRight) {
                // Symmetrically fill from left side to complete the metallic body!
                for (let x = rightX; x <= expectedRight; x++) {
                    const srcX = 505 - (x - 505);
                    if (srcX >= leftX && srcX < 505) {
                        const srcIdx = (y * w + srcX) * 4;
                        const dstIdx = (y * w + x) * 4;
                        // Darken slightly for 3D right-side shading
                        data[dstIdx] = Math.max(0, Math.floor(data[srcIdx] * 0.85));
                        data[dstIdx + 1] = Math.max(0, Math.floor(data[srcIdx + 1] * 0.85));
                        data[dstIdx + 2] = Math.max(0, Math.floor(data[srcIdx + 2] * 0.85));
                        data[dstIdx + 3] = 255;
                    }
                }
                // Add crisp dark pixel outline to right edge
                const borderIdx = (y * w + expectedRight) * 4;
                data[borderIdx] = 25;
                data[borderIdx + 1] = 20;
                data[borderIdx + 2] = 20;
                data[borderIdx + 3] = 255;
            }
        }
    }

    await orig.write(path.join(ASSETS_DIR, 'upg_grinder_3.png'));
    console.log('✓ upg_grinder_3.png polished and saved!');
}

async function polishCanopy3() {
    console.log('Polishing upg_canopy_3.png...');
    const img = await Jimp.read(path.join(ASSETS_DIR, 'upg_canopy_3.png'));
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    const data = img.bitmap.data;

    // In upg_canopy_3.png, between y=430 and y=560 in the middle (between the two pillars),
    // there are ghost pixels from the cart counter.
    // Left pillar is around x=80-140, right pillar is around x=840-900.
    // In between (x=160 to x=820), below the valance curve, clear back to studio grey #ababab.
    for (let y = 430; y < 750; y++) {
        for (let x = 160; x < 820; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            // If it's not the red/cream valance cloth
            // Valance cloth has y < 510 and specific red or cream color
            if (y > 510 || (g > 100 && b > 100 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20)) {
                // Check if this pixel is junk/counter
                if (r !== 171 || g !== 171 || b !== 171) {
                    data[idx] = 171;
                    data[idx + 1] = 171;
                    data[idx + 2] = 171;
                    data[idx + 3] = 255;
                }
            }
        }
    }

    await img.write(path.join(ASSETS_DIR, 'upg_canopy_3.png'));
    console.log('✓ upg_canopy_3.png polished and saved!');
}

async function polishMarketing2() {
    console.log('Polishing upg_marketing_2.png...');
    const img = await Jimp.read(path.join(ASSETS_DIR, 'upg_marketing_2.png'));
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    const data = img.bitmap.data;

    // Clean up floating sidewalk beige rubble below legs (y > 600)
    for (let y = 600; y < 850; y++) {
        for (let x = 200; x < 700; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];
            // Check if it's the grey-beige sidewalk junk (not dark wood leg)
            // Chalkboard wood legs have dark brown (r ~ 120-160, g ~ 70-100, b ~ 40-70) or dark border
            // Sidewalk rubble has r > 160, g > 150, b > 130
            if (r > 160 && g > 140 && b > 120) {
                // Clear to studio grey #c8c8c8
                data[idx] = 200;
                data[idx + 1] = 200;
                data[idx + 2] = 200;
                data[idx + 3] = 255;
            }
        }
    }

    await img.write(path.join(ASSETS_DIR, 'upg_marketing_2.png'));
    console.log('✓ upg_marketing_2.png polished and saved!');
}

async function polishDecor1() {
    console.log('Polishing upg_decor_1.png...');
    const img = await Jimp.read(path.join(ASSETS_DIR, 'upg_decor_1.png'));
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    const data = img.bitmap.data;

    // Remove the square sharp border at x=180 on the left side of upg_decor_1
    // The spoke wheel center is around x=560, y=470 with radius ~170px.
    // Pixels further left than x=370 belong to the square cart box.
    // Clear everything left of x=370 back to studio grey #c8c8c8!
    for (let y = 150; y < 700; y++) {
        for (let x = 150; x < 370; x++) {
            const idx = (y * w + x) * 4;
            data[idx] = 200;
            data[idx + 1] = 200;
            data[idx + 2] = 200;
            data[idx + 3] = 255;
        }
        // Also clear top of cart above y=240 outside the wheel
        for (let x = 370; x < 750; x++) {
            if (y < 250) {
                const idx = (y * w + x) * 4;
                data[idx] = 200;
                data[idx + 1] = 200;
                data[idx + 2] = 200;
                data[idx + 3] = 255;
            }
        }
    }

    await img.write(path.join(ASSETS_DIR, 'upg_decor_1.png'));
    console.log('✓ upg_decor_1.png polished and saved!');
}

async function polishDecor3() {
    console.log('Polishing upg_decor_3.png...');
    const img = await Jimp.read(path.join(ASSETS_DIR, 'upg_decor_3.png'));
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    const data = img.bitmap.data;

    // In upg_decor_3.png, there is a square chunk sticking out on the bottom left (x < 330, y > 420)
    for (let y = 420; y < 720; y++) {
        for (let x = 120; x < 330; x++) {
            // Keep the stanchion post (x around 150-190) but remove the random tile floor chunk (x > 190)
            if (x > 195) {
                const idx = (y * w + x) * 4;
                data[idx] = 200;
                data[idx + 1] = 200;
                data[idx + 2] = 200;
                data[idx + 3] = 255;
            }
        }
    }

    await img.write(path.join(ASSETS_DIR, 'upg_decor_3.png'));
    console.log('✓ upg_decor_3.png polished and saved!');
}

async function run() {
    await polishGrinder3();
    await polishCanopy3();
    await polishMarketing2();
    await polishDecor1();
    await polishDecor3();
    console.log('All 5 target portraits polished successfully!');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
