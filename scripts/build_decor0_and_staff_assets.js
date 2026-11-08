const { Jimp, ResizeStrategy } = require('jimp');
const path = require('path');

const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');
const BRAIN_DIR = 'C:\\Users\\Nyzan\\.gemini\\antigravity\\brain\\93e23ebd-cd40-4a61-a44f-28e7bdb89078';

function drawShadow(canvas, cx, cy, rx, ry, maxAlpha = 0.5) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
        for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
            if (x < 0 || x >= canvas.bitmap.width || y < 0 || y >= canvas.bitmap.height) continue;
            const dx = (x - cx) / rx;
            const dy = (y - cy) / ry;
            const d = dx * dx + dy * dy;
            if (d <= 1) {
                const alpha = Math.pow(1 - Math.sqrt(d), 0.8) * maxAlpha;
                const idx = (y * canvas.bitmap.width + x) * 4;
                const r = canvas.bitmap.data[idx];
                const g = canvas.bitmap.data[idx + 1];
                const b = canvas.bitmap.data[idx + 2];
                canvas.bitmap.data[idx] = Math.round(r * (1 - alpha));
                canvas.bitmap.data[idx + 1] = Math.round(g * (1 - alpha));
                canvas.bitmap.data[idx + 2] = Math.round(b * (1 - alpha));
            }
        }
    }
}

// Flood-fill background removal from corners + enclosed holes of background gray
function extractSpriteFromGrayBg(img, bgTolerance = 22) {
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    const data = img.bitmap.data;

    // Sample corner color
    const bgR = data[0], bgG = data[1], bgB = data[2];

    function isBgColor(idx) {
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        const dr = Math.abs(r - bgR);
        const dg = Math.abs(g - bgG);
        const db = Math.abs(b - bgB);
        // Background is neutral gray around ~184
        const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
        return dr <= bgTolerance && dg <= bgTolerance && db <= bgTolerance && maxDiff <= 10;
    }

    // 1. Flood fill from edges
    const visited = new Uint8Array(w * h);
    const queue = [];

    for (let x = 0; x < w; x++) {
        queue.push(x, 0);
        queue.push(x, h - 1);
    }
    for (let y = 0; y < h; y++) {
        queue.push(0, y);
        queue.push(w - 1, y);
    }

    let head = 0;
    while (head < queue.length) {
        const x = queue[head++];
        const y = queue[head++];
        if (x < 0 || x >= w || y < 0 || y >= h) continue;
        const p = y * w + x;
        if (visited[p]) continue;
        visited[p] = 1;

        const idx = p * 4;
        if (isBgColor(idx)) {
            data[idx + 3] = 0;
            queue.push(x + 1, y);
            queue.push(x - 1, y);
            queue.push(x, y + 1);
            queue.push(x, y - 1);
        }
    }

    // 2. Also remove interior enclosed background holes (e.g. between folding table X-legs and between legs/arms)
    // Only in lower half (y > h * 0.45) where folding table legs are, and where color strictly matches neutral bg gray
    for (let y = Math.floor(h * 0.45); y < h; y++) {
        for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            if (data[idx + 3] !== 0) {
                const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                const dr = Math.abs(r - bgR);
                const dg = Math.abs(g - bgG);
                const db = Math.abs(b - bgB);
                const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
                if (dr <= 12 && dg <= 12 && db <= 12 && maxDiff <= 6) {
                    // Check that this isn't inside the aluminum kettle (kettle is at y < h*0.60, x < w*0.48)
                    const inKettle = (x >= w * 0.36 && x <= w * 0.48 && y >= h * 0.46 && y <= h * 0.61);
                    const inCan = (x >= w * 0.59 && x <= w * 0.66 && y >= h * 0.47 && y <= h * 0.56);
                    if (!inKettle && !inCan) {
                        data[idx + 3] = 0;
                    }
                }
            }
        }
    }

    // Crop to non-transparent bounding box
    let minX = w, maxX = 0, minY = h, maxY = 0;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (data[(y * w + x) * 4 + 3] > 30) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }
    img.crop({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });
    return img;
}

async function buildDecor0() {
    console.log('Building cart_lvl_0.png and upg_decor_0.png...');
    const raw = await Jimp.read(path.join(BRAIN_DIR, 'upg_decor_0_raw_1792236521004.jpg'));
    const sprite = extractSpriteFromGrayBg(raw.clone(), 20);

    // Save in-game cart_lvl_0.png scaled to ~260px width (matching cart_lvl_1.png 250x310)
    const cartSprite = sprite.clone();
    const targetCartW = 250;
    const targetCartH = Math.round(cartSprite.bitmap.height * (targetCartW / cartSprite.bitmap.width));
    cartSprite.resize({ w: targetCartW, h: targetCartH, mode: ResizeStrategy.NEAREST_NEIGHBOR });
    await cartSprite.write(path.join(ASSETS_DIR, 'cart_lvl_0.png'));
    console.log(`Saved cart_lvl_0.png (${targetCartW}x${targetCartH})`);

    // Save 1024x1024 upgrade portrait upg_decor_0.png
    const upgSprite = sprite.clone();
    const targetH = 680;
    const targetW = Math.round(upgSprite.bitmap.width * (targetH / upgSprite.bitmap.height));
    upgSprite.resize({ w: targetW, h: targetH, mode: ResizeStrategy.NEAREST_NEIGHBOR });

    const canvas = new Jimp({ width: 1024, height: 1024, color: 0xc8c8c8ff });
    drawShadow(canvas, 512, 845, 270, 52, 0.45);
    const posX = Math.round((1024 - targetW) / 2);
    const posY = 175;
    canvas.composite(upgSprite, posX, posY);
    await canvas.write(path.join(ASSETS_DIR, 'upg_decor_0.png'));
    console.log('Saved upg_decor_0.png (1024x1024)');
}

async function buildStaffPortraits() {
    const staffFiles = [
        { src: 'staff_cashier_raw_1792236587231.jpg', out: 'staff_cashier.png', cropBottom: 1.0 },
        { src: 'staff_entertainer_raw_1792236600675.jpg', out: 'staff_entertainer.png', cropBottom: 1.0 },
        { src: 'staff_barista_raw_1792236659767.jpg', out: 'staff_barista.png', cropBottom: 0.91 },
        { src: 'staff_promoter_raw_1792236634353.jpg', out: 'staff_promoter.png', cropBottom: 1.0 }
    ];

    for (const item of staffFiles) {
        console.log(`Building ${item.out}...`);
        const raw = await Jimp.read(path.join(BRAIN_DIR, item.src));
        if (item.cropBottom < 1.0) {
            raw.crop({ x: 0, y: 0, w: raw.bitmap.width, h: Math.floor(raw.bitmap.height * item.cropBottom) });
        }
        const sprite = extractSpriteFromGrayBg(raw.clone(), 20);
        const targetH = 740;
        const targetW = Math.round(sprite.bitmap.width * (targetH / sprite.bitmap.height));
        sprite.resize({ w: targetW, h: targetH, mode: ResizeStrategy.NEAREST_NEIGHBOR });

        const canvas = new Jimp({ width: 1024, height: 1024, color: 0xc8c8c8ff });
        drawShadow(canvas, 512, 875, 220, 45, 0.45);
        const posX = Math.round((1024 - targetW) / 2);
        const posY = Math.round((1024 - targetH) / 2);
        canvas.composite(sprite, posX, posY);
        await canvas.write(path.join(ASSETS_DIR, item.out));
        console.log(`Saved ${item.out} (1024x1024)`);
    }
}

async function run() {
    await buildDecor0();
    await buildStaffPortraits();
    console.log('ALL NEW ASSETS GENERATED SUCCESSFULLY!');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
