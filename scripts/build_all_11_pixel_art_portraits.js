const { Jimp, ResizeStrategy } = require('jimp');
const path = require('path');

const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');

function pointInPoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][0], yi = poly[i][1];
        const xj = poly[j][0], yj = poly[j][1];
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

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

// 1. Commercial Precision Flat Burr Mill (upg_grinder_3.png)
async function makeGrinder3() {
    console.log('Generating upg_grinder_3.png...');
    const cart = await Jimp.read(path.join(ASSETS_DIR, 'coffee_cart_original_hd.png'));
    const g = cart.clone().crop({ x: 80, y: 360, w: 105, h: 195 });

    // Clean outside pixels
    for (let y = 0; y < g.bitmap.height; y++) {
        for (let x = 0; x < g.bitmap.width; x++) {
            const idx = (y * g.bitmap.width + x) * 4;
            const r = g.bitmap.data[idx], gr = g.bitmap.data[idx + 1], b = g.bitmap.data[idx + 2];
            let keep = true;
            if (x < 9 || y < 23 || y > 188) keep = false;
            if (y < 42 && x > 88) keep = false;
            if (y < 70 && gr > r + 15 && b > r + 10) keep = false;
            if (y >= 70 && y < 115 && x > 84) keep = false;
            if (y >= 70 && y < 115 && gr > r + 20) keep = false;
            if (x > 93) keep = false;
            if (x > 75 && y > 135 && r > 160 && gr > 130 && b > 100) keep = false;
            if (x > 80 && y > 140) keep = false;
            if (y >= 115 && y <= 140 && x > 75) keep = false; // clean right collar edge
            // clean tiny teal artifacts on right
            if (x > 73 && y >= 135 && y <= 165 && gr > r) keep = false;
            if (!keep) g.bitmap.data[idx + 3] = 0;
        }
    }

    // Fill in clean dark wood outline on right boundary where cup was
    for (let y = 135; y <= 188; y++) {
        const x = 74;
        const idx = (y * g.bitmap.width + x) * 4;
        g.bitmap.data[idx] = 30;
        g.bitmap.data[idx + 1] = 23;
        g.bitmap.data[idx + 2] = 19;
        g.bitmap.data[idx + 3] = 255;
    }

    let minX = 105, maxX = 0, minY = 195, maxY = 0;
    for (let y = 0; y < g.bitmap.height; y++) {
        for (let x = 0; x < g.bitmap.width; x++) {
            if (g.bitmap.data[(y * g.bitmap.width + x) * 4 + 3] > 30) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }
    g.crop({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });

    const targetH = 700;
    const targetW = Math.round(g.bitmap.width * (targetH / g.bitmap.height));
    g.resize({ w: targetW, h: targetH, mode: ResizeStrategy.NEAREST_NEIGHBOR });

    const canvas = new Jimp({ width: 1024, height: 1024, color: 0x242424ff });
    drawShadow(canvas, 512, 860, 240, 50, 0.6);
    canvas.composite(g, Math.round((1024 - targetW) / 2), 150);

    await canvas.write(path.join(ASSETS_DIR, 'upg_grinder_3.png'));
    console.log('Saved upg_grinder_3.png');
}

// 2. Vintage Manual Hand Burr Grinder (upg_grinder_1.png)
async function makeGrinder1() {
    console.log('Generating upg_grinder_1.png...');
    // We render an authentic 16-bit pixel art manual coffee grinder
    // with rich woodgrain, dovetail joints, cast iron hopper with coffee beans,
    // and hand crank handle with turned wooden knob.
    const w = 140, h = 140;
    const art = new Jimp({ width: w, height: h, color: 0x00000000 });

    function setPx(x, y, hex, a = 255) {
        if (x < 0 || x >= w || y < 0 || y >= h) return;
        const idx = (y * w + x) * 4;
        art.bitmap.data[idx] = (hex >> 16) & 255;
        art.bitmap.data[idx + 1] = (hex >> 8) & 255;
        art.bitmap.data[idx + 2] = hex & 255;
        art.bitmap.data[idx + 3] = a;
    }

    const cx = 70;

    // A. Main Wooden Box Base (Isometric 3D block)
    // Left Face (Warm Chestnut)
    for (let py = 0; py < 38; py++) {
        for (let px = 0; px < 36; px++) {
            const x = 34 + px;
            const y = 68 + Math.round(px * 0.45) + py;
            let col = 0xa25d2b;
            if (py % 7 === 0) col = 0x8a4b1e;
            if (py % 14 === 0) col = 0xb76d38;
            if (px === 0 || py === 37) col = 0x28170c;
            setPx(x, y, col);
        }
    }

    // Right Face (Shaded Chestnut)
    for (let py = 0; py < 38; py++) {
        for (let px = 0; px < 36; px++) {
            const x = 70 + px;
            const y = 84 - Math.round(px * 0.45) + py;
            let col = 0x7a3e18;
            if (py % 7 === 0) col = 0x622f10;
            if (px === 35 || py === 37) col = 0x28170c;
            setPx(x, y, col);
        }
    }

    // Top Face (Honey Oak Diamond)
    for (let py = 0; py <= 16; py++) {
        const spread = Math.round(py * 2.15);
        for (let px = -spread; px <= spread; px++) {
            setPx(cx + px, 52 + py, (px + py) % 6 === 0 ? 0xd89355 : 0xc67f44);
        }
    }
    for (let py = 0; py <= 16; py++) {
        const spread = Math.round((16 - py) * 2.15);
        for (let px = -spread; px <= spread; px++) {
            setPx(cx + px, 68 + py, 0xb8733a);
        }
    }

    // Brass corner brackets
    for (let dy = 0; dy < 6; dy++) {
        for (let dx = 0; dx < 5; dx++) {
            setPx(32 + dx, 104 + dy, 0xd49b22);
            setPx(68 + dx, 120 + dy, 0xd49b22);
            setPx(104 + dx, 104 + dy, 0xd49b22);
        }
    }

    // Ground coffee drawer on front-left face
    for (let dy = 0; dy < 18; dy++) {
        for (let dx = 0; dx < 22; dx++) {
            const x = 40 + dx;
            const y = 78 + Math.round(dx * 0.45) + dy;
            let c = 0xab6732;
            if (dx === 0 || dx === 21 || dy === 0 || dy === 17) c = 0x3d1e08;
            setPx(x, y, c);
        }
    }
    // Drawer brass pull knob
    for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
            setPx(51 + dx, 92 + dy, 0xf5c342);
        }
    }
    setPx(50, 91, 0xffffff);
    setPx(52, 93, 0x8a6008);

    // B. Cast-Iron Hopper Bowl
    for (let dy = 0; dy < 16; dy++) {
        const r = Math.round(10 + dy * 0.95);
        for (let dx = -r; dx <= r; dx++) {
            const x = cx + dx;
            const y = 40 + dy;
            let c = 0x3e444d;
            if (dx < -r + 3) c = 0x737b85;
            if (dx > r - 4) c = 0x22262c;
            setPx(x, y, c);
        }
    }
    // Hopper brass rim
    for (let dx = -27; dx <= 27; dx++) {
        setPx(cx + dx, 39, 0xf5c342);
        setPx(cx + dx, 40, 0xd49b22);
        setPx(cx + dx, 41, 0x8a6008);
    }
    // Whole roasted coffee beans inside bowl
    for (let dy = 0; dy < 9; dy++) {
        const br = 24 - dy * 2;
        for (let dx = -br; dx <= br; dx++) {
            let bCol = 0x4a2a14;
            if ((dx + dy) % 3 === 0) bCol = 0x6e3d1c;
            if ((dx * dy) % 4 === 0) bCol = 0x2e1709;
            setPx(cx + dx, 42 + dy, bCol);
        }
    }

    // C. Vertical Shaft & Curved Hand Crank Arm
    for (let y = 18; y <= 39; y++) {
        setPx(cx - 1, y, 0x8a929a);
        setPx(cx, y, 0x5b626b);
        setPx(cx + 1, y, 0x2d3238);
    }
    for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
            setPx(cx + dx, 16 + dy, 0xf5c342);
        }
    }

    // S-curved cast-iron crank arm sweeping to right
    const crankPts = [
        [64, 16], [68, 15], [73, 14], [78, 13], [84, 13],
        [90, 14], [96, 16], [102, 19], [108, 24], [112, 30]
    ];
    for (const [px, py] of crankPts) {
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                setPx(px + dx, py + dy, 0x6e7680);
            }
        }
        setPx(px, py, 0x8e98a3);
        setPx(px, py + 1, 0x22262c);
    }

    // Ergonomic turned wooden handle knob at (112, 30)
    for (let ky = -9; ky <= 9; ky++) {
        const kr = Math.round(6 - Math.abs(ky) * 0.4);
        for (let kx = -kr; kx <= kr; kx++) {
            let col = (kx < 0) ? 0xc67f44 : 0x7a3e18;
            if (kx === -1 && ky < 0) col = 0xe49a5b;
            setPx(112 + kx, 30 + ky, col);
        }
    }
    for (let deg = 0; deg < 360; deg += 20) {
        const rad = deg * Math.PI / 180;
        setPx(Math.round(112 + Math.cos(rad) * 6.5), Math.round(30 + Math.sin(rad) * 9.5), 0x22150c);
    }

    art.resize({ w: 700, h: 700, mode: ResizeStrategy.NEAREST_NEIGHBOR });

    const canvas = new Jimp({ width: 1024, height: 1024, color: 0x242424ff });
    drawShadow(canvas, 512, 850, 260, 50, 0.6);
    canvas.composite(art, Math.round((1024 - 700) / 2), 160);

    await canvas.write(path.join(ASSETS_DIR, 'upg_grinder_1.png'));
    console.log('Saved upg_grinder_1.png');
}

// 3. Open Cart Framework (No Canopy) (upg_canopy_1.png)
async function makeCanopy1() {
    console.log('Generating upg_canopy_1.png...');
    const c2 = await Jimp.read(path.join(ASSETS_DIR, 'upg_canopy_2.png'));
    const canvas = c2.clone();
    const bgCol = c2.getPixelColor(30, 30);

    // Clear fabric awning area from y=170 to y=600 completely
    for (let y = 170; y < 600; y++) {
        for (let x = 160; x < 840; x++) {
            canvas.setPixelColor(bgCol, x, y);
        }
    }

    const colIron = 0x141027ff;
    const colIronBody = 0x484d5cff;
    const colIronHi = 0x757994ff;

    function drawSteelPillar(xLeft, xRight, yTop, yBottom) {
        for (let y = yTop; y <= yBottom; y++) {
            for (let x = xLeft; x <= xRight; x++) {
                let c = colIronBody;
                if (x === xLeft || x === xRight) c = colIron;
                if (x === xLeft + 3) c = colIronHi;
                canvas.setPixelColor(c, x, y);
            }
        }
    }

    function drawSteelBeam(x1, y1, x2, y2, thickness = 18) {
        const len = Math.hypot(x2 - x1, y2 - y1);
        const dx = (x2 - x1) / len;
        const dy = (y2 - y1) / len;
        const nx = -dy;
        const ny = dx;
        const half = Math.floor(thickness / 2);
        for (let step = 0; step <= Math.ceil(len); step++) {
            const px = x1 + dx * step;
            const py = y1 + dy * step;
            for (let t = -half; t <= half; t++) {
                const rx = Math.round(px + nx * t);
                const ry = Math.round(py + ny * t);
                let c = colIronBody;
                if (t === -half || t === half) c = colIron;
                if (t === -half + 2) c = colIronHi;
                canvas.setPixelColor(c, rx, ry);
            }
        }
    }

    // 4 Solid Continuous Steel Pillars (seamless from top crossbeam down to bottom floor mounts)
    // Post 1 (Front Left): x = 225..255, y from 340 down to 780
    drawSteelPillar(225, 255, 340, 780);
    // Post 2 (Front Right): x = 604..634, y from 340 down to 780
    drawSteelPillar(604, 634, 340, 780);
    // Post 3 (Back Right): x = 768..798, y from 320 down to 780
    drawSteelPillar(768, 798, 320, 780);
    // Post 4 (Back Left): x = 405..435, y from 320 down to 780
    drawSteelPillar(405, 435, 320, 780);

    // Top Perimeter Crossbeams
    drawSteelBeam(240, 340, 619, 340, 20); // Front beam
    drawSteelBeam(420, 320, 783, 320, 18); // Back beam
    drawSteelBeam(240, 340, 420, 320, 18); // Left beam
    drawSteelBeam(619, 340, 783, 320, 18); // Right beam

    // Diagonal Corner Braces
    drawSteelBeam(240, 395, 290, 340, 14);
    drawSteelBeam(619, 395, 570, 340, 14);
    drawSteelBeam(783, 370, 735, 320, 12);
    drawSteelBeam(420, 370, 465, 320, 12);

    // Decorative Gold Rivets
    const colGold = 0xd49b22ff;
    for (const [bx, by] of [[240, 395], [290, 340], [619, 395], [570, 340], [783, 370], [735, 320]]) {
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                canvas.setPixelColor(colGold, bx + dx, by + dy);
            }
        }
    }

    await canvas.write(path.join(ASSETS_DIR, 'upg_canopy_1.png'));
    console.log('Saved upg_canopy_1.png');
}

// 4. Commercial Retractable All-Weather Awning (upg_canopy_3.png)
async function makeCanopy3() {
    console.log('Generating upg_canopy_3.png...');
    const cart = await Jimp.read(path.join(ASSETS_DIR, 'coffee_cart_original_hd.png'));
    const c = cart.clone().crop({ x: 0, y: 0, w: 748, h: 360 });

    // Contour mask bottom scallops cleanly
    for (let y = 0; y < c.bitmap.height; y++) {
        for (let x = 0; x < c.bitmap.width; x++) {
            const idx = (y * c.bitmap.width + x) * 4;
            const r = c.bitmap.data[idx], gr = c.bitmap.data[idx + 1], b = c.bitmap.data[idx + 2];
            // Clear barista hat / head
            if (x >= 430 && x <= 580 && y >= 295) {
                if (r < 110 && gr < 110 && b < 110) c.bitmap.data[idx + 3] = 0;
            }
            // Clear espresso machine / cups on left below valance
            if (x < 310 && y >= 320) {
                if (r > 150 || (gr > r + 15)) c.bitmap.data[idx + 3] = 0;
            }
            // Clear menu board below lantern on right
            if (x >= 630 && y >= 335) {
                c.bitmap.data[idx + 3] = 0;
            }
            // Clear flat straight cutoff line artifacts
            if (y > 330 && x > 250 && x < 440) {
                // If not red or cream fabric
                const isFabric = (r > 120 && gr < 100 && b < 90) || (r > 190 && gr > 170 && b > 130);
                if (!isFabric) c.bitmap.data[idx + 3] = 0;
            }
        }
    }

    const scale = 1.16;
    const targetW = Math.round(c.bitmap.width * scale);
    const targetH = Math.round(c.bitmap.height * scale);
    c.resize({ w: targetW, h: targetH, mode: ResizeStrategy.NEAREST_NEIGHBOR });

    const canvas = new Jimp({ width: 1024, height: 1024, color: 0xabababff });
    drawShadow(canvas, 512, 850, 360, 60, 0.45);

    // Draw tall iron support pillars
    const colIron = 0x222428ff;
    const colIronHi = 0x5a5e66ff;
    for (let y = 370; y < 850; y++) {
        for (let x = 85; x < 105; x++) canvas.setPixelColor(x === 90 ? colIronHi : colIron, x, y);
        for (let x = 890; x < 910; x++) canvas.setPixelColor(x === 895 ? colIronHi : colIron, x, y);
    }
    // Floor mounting flanges
    for (let y = 840; y < 855; y++) {
        for (let x = 75; x < 115; x++) canvas.setPixelColor(colIron, x, y);
        for (let x = 880; x < 920; x++) canvas.setPixelColor(colIron, x, y);
    }

    const posX = Math.round((1024 - targetW) / 2);
    const posY = 130;
    canvas.composite(c, posX, posY);

    await canvas.write(path.join(ASSETS_DIR, 'upg_canopy_3.png'));
    console.log('Saved upg_canopy_3.png');
}

// 5. Word of Mouth (upg_marketing_1.png)
async function makeMarketing1() {
    console.log('Generating upg_marketing_1.png...');
    const cart = await Jimp.read(path.join(ASSETS_DIR, 'coffee_cart_original_hd.png'));
    const sign = cart.clone().crop({ x: 310, y: 640, w: 185, h: 185 });

    // Precise polygon around the wooden frame of the sign
    const poly = [
        [10, 80],
        [142, 8],
        [174, 105],
        [45, 175]
    ];

    for (let y = 0; y < sign.bitmap.height; y++) {
        for (let x = 0; x < sign.bitmap.width; x++) {
            const idx = (y * sign.bitmap.width + x) * 4;
            const inFrame = pointInPoly(x, y, poly);
            const isCord = (y <= 75 && Math.abs((y - 12) - (x - 30) * 0.55) < 5);
            if (!inFrame && !isCord) {
                sign.bitmap.data[idx + 3] = 0;
            }
        }
    }

    const targetW = 660;
    const targetH = Math.round(sign.bitmap.height * (targetW / sign.bitmap.width));
    sign.resize({ w: targetW, h: targetH, mode: ResizeStrategy.NEAREST_NEIGHBOR });

    const canvas = new Jimp({ width: 1024, height: 1024, color: 0xc8c8c8ff });
    drawShadow(canvas, 512, 860, 260, 45, 0.45);

    // Hanging bracket iron pins
    const colIron = 0x222428ff;
    for (let y = 100; y < 190; y++) {
        for (let x = 320; x < 332; x++) canvas.setPixelColor(colIron, x, y);
        for (let x = 700; x < 712; x++) canvas.setPixelColor(colIron, x, y);
    }

    const posX = Math.round((1024 - targetW) / 2);
    const posY = 170;
    canvas.composite(sign, posX, posY);

    await canvas.write(path.join(ASSETS_DIR, 'upg_marketing_1.png'));
    console.log('Saved upg_marketing_1.png');
}

// 6. Chalkboard & Street Flyers (upg_marketing_2.png)
async function makeMarketing2() {
    console.log('Generating upg_marketing_2.png...');
    const market = await Jimp.read(path.join(ASSETS_DIR, 'farmers_market_bg.jpg'));
    const b = market.clone().crop({ x: 1210, y: 500, w: 80, h: 105 });

    // Precise A-frame polygon
    const poly = [
        [28, 8],
        [36, 5],
        [52, 17],
        [58, 68],
        [52, 72],
        [51, 95],
        [44, 95],
        [43, 76],
        [32, 62],
        [15, 68],
        [12, 85],
        [7, 85],
        [7, 55],
        [22, 18]
    ];

    for (let y = 0; y < b.bitmap.height; y++) {
        for (let x = 0; x < b.bitmap.width; x++) {
            const idx = (y * b.bitmap.width + x) * 4;
            if (!pointInPoly(x, y, poly)) {
                b.bitmap.data[idx + 3] = 0;
            }
        }
    }

    // Add wooden bottom crossbar between legs (x=10..45, y=70..75)
    for (let x = 12; x <= 45; x++) {
        const y = Math.round(68 + (x - 12) * 0.22);
        for (let dy = 0; dy <= 4; dy++) {
            const idx = ((y + dy) * b.bitmap.width + x) * 4;
            b.bitmap.data[idx] = 138;
            b.bitmap.data[idx + 1] = 85;
            b.bitmap.data[idx + 2] = 40;
            b.bitmap.data[idx + 3] = 255;
        }
    }

    const targetH = 720;
    const targetW = Math.round(b.bitmap.width * (targetH / b.bitmap.height));
    b.resize({ w: targetW, h: targetH, mode: ResizeStrategy.NEAREST_NEIGHBOR });

    const canvas = new Jimp({ width: 1024, height: 1024, color: 0xc8c8c8ff });
    drawShadow(canvas, 512, 870, 240, 50, 0.5);

    const posX = Math.round((1024 - targetW) / 2);
    const posY = 150;
    canvas.composite(b, posX, posY);

    await canvas.write(path.join(ASSETS_DIR, 'upg_marketing_2.png'));
    console.log('Saved upg_marketing_2.png');
}

// 7. Glowing Retro Neon Stand Sign (upg_marketing_3.png)
async function makeMarketing3() {
    console.log('Generating upg_marketing_3.png...');
    const conv = await Jimp.read(path.join(ASSETS_DIR, 'convention_center_bg.jpg'));
    const neon = conv.clone().crop({ x: 170, y: 150, w: 310, h: 250 });

    const targetW = 750;
    const targetH = Math.round(neon.bitmap.height * (targetW / neon.bitmap.width));
    neon.resize({ w: targetW, h: targetH, mode: ResizeStrategy.NEAREST_NEIGHBOR });

    const canvas = new Jimp({ width: 1024, height: 1024, color: 0x181a20ff });
    drawShadow(canvas, 512, 860, 320, 50, 0.6);

    const posX = Math.round((1024 - targetW) / 2);
    const posY = 180;
    canvas.composite(neon, posX, posY);

    await canvas.write(path.join(ASSETS_DIR, 'upg_marketing_3.png'));
    console.log('Saved upg_marketing_3.png');
}

// 8. City Culinary Guide & Food Critic Feature (upg_marketing_4.png)
async function makeMarketing4() {
    console.log('Generating upg_marketing_4.png...');
    const metro = await Jimp.read(path.join(ASSETS_DIR, 'metro_bg.jpg'));
    const n = metro.clone().crop({ x: 770, y: 510, w: 210, h: 230 });

    // Clean outside marble floor completely
    for (let y = 0; y < n.bitmap.height; y++) {
        for (let x = 0; x < n.bitmap.width; x++) {
            const idx = (y * n.bitmap.width + x) * 4;
            const r = n.bitmap.data[idx], g = n.bitmap.data[idx + 1], b = n.bitmap.data[idx + 2];
            let keep = true;
            // Floor pattern
            if (r > 160 && g > 145 && b > 120) keep = false;
            if (x < 20 && y < 70) keep = false;
            if (x > 195 && y < 80) keep = false;
            if (x > 185 && y > 145) keep = false;
            if (y > 218) keep = false;
            if (!keep) n.bitmap.data[idx + 3] = 0;
        }
    }

    const targetH = 700;
    const targetW = Math.round(n.bitmap.width * (targetH / n.bitmap.height));
    n.resize({ w: targetW, h: targetH, mode: ResizeStrategy.NEAREST_NEIGHBOR });

    const canvas = new Jimp({ width: 1024, height: 1024, color: 0xc8c8c8ff });
    drawShadow(canvas, 512, 850, 320, 60, 0.5);

    const posX = Math.round((1024 - targetW) / 2);
    const posY = 150;
    canvas.composite(n, posX, posY);

    await canvas.write(path.join(ASSETS_DIR, 'upg_marketing_4.png'));
    console.log('Saved upg_marketing_4.png');
}

// 9. Rustic Timber Cart (upg_decor_1.png)
async function makeDecor1() {
    console.log('Generating upg_decor_1.png...');
    const cart = await Jimp.read(path.join(ASSETS_DIR, 'coffee_cart_original_hd.png'));
    const c = cart.clone().crop({ x: 420, y: 620, w: 280, h: 300 });

    for (let y = 0; y < c.bitmap.height; y++) {
        for (let x = 0; x < c.bitmap.width; x++) {
            const idx = (y * c.bitmap.width + x) * 4;
            if (y > 280 && x > 230) c.bitmap.data[idx + 3] = 0;
        }
    }

    const targetH = 700;
    const targetW = Math.round(c.bitmap.width * (targetH / c.bitmap.height));
    c.resize({ w: targetW, h: targetH, mode: ResizeStrategy.NEAREST_NEIGHBOR });

    const canvas = new Jimp({ width: 1024, height: 1024, color: 0xc8c8c8ff });
    drawShadow(canvas, 512, 860, 300, 60, 0.5);

    const posX = Math.round((1024 - targetW) / 2);
    const posY = 160;
    canvas.composite(c, posX, posY);

    await canvas.write(path.join(ASSETS_DIR, 'upg_decor_1.png'));
    console.log('Saved upg_decor_1.png');
}

// 10. Artisan Mahogany & Brass Stand (upg_decor_2.png)
async function makeDecor2() {
    console.log('Generating upg_decor_2.png...');
    const cart = await Jimp.read(path.join(ASSETS_DIR, 'coffee_cart_original_hd.png'));
    const c = cart.clone().crop({ x: 460, y: 470, w: 285, h: 210 });

    // Fill left side with matching wood counter texture instead of empty hole
    for (let y = 0; y < 140; y++) {
        for (let x = 0; x < 65; x++) {
            const sampleX = 70 + (x % 20);
            const sampleIdx = (y * c.bitmap.width + sampleX) * 4;
            const targetIdx = (y * c.bitmap.width + x) * 4;
            c.bitmap.data[targetIdx] = c.bitmap.data[sampleIdx];
            c.bitmap.data[targetIdx + 1] = c.bitmap.data[sampleIdx + 1];
            c.bitmap.data[targetIdx + 2] = c.bitmap.data[sampleIdx + 2];
            c.bitmap.data[targetIdx + 3] = 255;
        }
    }

    const targetW = 720;
    const targetH = Math.round(c.bitmap.height * (targetW / c.bitmap.width));
    c.resize({ w: targetW, h: targetH, mode: ResizeStrategy.NEAREST_NEIGHBOR });

    const canvas = new Jimp({ width: 1024, height: 1024, color: 0xc8c8c8ff });
    drawShadow(canvas, 512, 850, 320, 60, 0.5);

    const posX = Math.round((1024 - targetW) / 2);
    const posY = 250;
    canvas.composite(c, posX, posY);

    await canvas.write(path.join(ASSETS_DIR, 'upg_decor_2.png'));
    console.log('Saved upg_decor_2.png');
}

// 11. Luxury Italian Marble & Walnut Bar (upg_decor_3.png)
async function makeDecor3() {
    console.log('Generating upg_decor_3.png...');
    const mall = await Jimp.read(path.join(ASSETS_DIR, 'shopping_mall_bg.jpg'));
    const m = mall.clone().crop({ x: 200, y: 500, w: 320, h: 200 });

    // Create an elegant circular/octagonal luxury marble medallion plaque with beveled brass border
    const cx = 160, cy = 95, rx = 145, ry = 85;
    for (let y = 0; y < m.bitmap.height; y++) {
        for (let x = 0; x < m.bitmap.width; x++) {
            const idx = (y * m.bitmap.width + x) * 4;
            const dx = (x - cx) / rx;
            const dy = (y - cy) / ry;
            const d = dx * dx + dy * dy;
            if (d > 1.0) {
                // If it's the velvet rope post on the left (x < 80, y > 80), keep the stanchion!
                const isStanchion = (x <= 85 && y >= 75);
                if (!isStanchion) m.bitmap.data[idx + 3] = 0;
            } else if (d > 0.94) {
                // Polished 24k Gold Beveled Rim
                m.bitmap.data[idx] = 212;
                m.bitmap.data[idx + 1] = 155;
                m.bitmap.data[idx + 2] = 34;
                m.bitmap.data[idx + 3] = 255;
            }
        }
    }

    const targetW = 750;
    const targetH = Math.round(m.bitmap.height * (targetW / m.bitmap.width));
    m.resize({ w: targetW, h: targetH, mode: ResizeStrategy.NEAREST_NEIGHBOR });

    const canvas = new Jimp({ width: 1024, height: 1024, color: 0xc8c8c8ff });
    drawShadow(canvas, 512, 850, 360, 60, 0.5);

    const posX = Math.round((1024 - targetW) / 2);
    const posY = 250;
    canvas.composite(m, posX, posY);

    await canvas.write(path.join(ASSETS_DIR, 'upg_decor_3.png'));
    console.log('Saved upg_decor_3.png');
}

async function run() {
    try {
        await makeGrinder3();
        await makeGrinder1();
        await makeCanopy1();
        await makeCanopy3();
        await makeMarketing1();
        await makeMarketing2();
        await makeMarketing3();
        await makeMarketing4();
        await makeDecor1();
        await makeDecor2();
        await makeDecor3();
        console.log('ALL 11 UPGRADE PORTRAITS RE-COMPOSED WITH MASTER PRECISION!');
    } catch (err) {
        console.error('Error during generation:', err);
    }
}

run();
