// Coffede Tycoon - High-Density 16-Bit Isometric Background Generator
// Uses @napi-rs/canvas to generate authentic 1376x768 pixel art backgrounds for all 4 locations.
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const WIDTH = 1376;
const HEIGHT = 768;

// Scale factors: 1376x768 is roughly 2.15x the logical canvas resolution (640x360).
// Logical (220, 200) -> Target (473, 426)
// This leaves the center-left open for the coffee stand cart and queueing customers.

function createBaseCanvas() {
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
}

// -------------------------------------------------------------
// 1. CENTRAL CITY PARK (Lush Botanical Garden & Promenade)
// -------------------------------------------------------------
function generateParkBackground() {
    const { canvas, ctx } = createBaseCanvas();

    // 1. Lush Emerald Lawn Base with Dither Texture
    ctx.fillStyle = '#227838'; // Deep botanical green
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Multitone Lawn Dithering & Grass Tufts
    ctx.fillStyle = '#2c8f44';
    for (let y = 0; y < HEIGHT; y += 8) {
        const xOffset = (Math.floor(y / 8) % 2) * 8;
        for (let x = xOffset; x < WIDTH; x += 16) {
            ctx.fillRect(x, y, 4, 3);
            if ((x + y) % 5 === 0) {
                ctx.fillStyle = '#3aa856';
                ctx.fillRect(x + 2, y - 2, 2, 3);
                ctx.fillStyle = '#2c8f44';
            }
        }
    }

    // 2. Winding River / Park Pond (Upper Right Background)
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(800, 0);
    ctx.bezierCurveTo(950, 80, 1050, 140, 1376, 170);
    ctx.lineTo(1376, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(820, 0);
    ctx.bezierCurveTo(960, 75, 1060, 130, 1376, 155);
    ctx.lineTo(1376, 0);
    ctx.closePath();
    ctx.fill();

    // Water Lily Pads & Ripples
    const lilyPads = [
        { x: 980, y: 80 }, { x: 1040, y: 110 }, { x: 1120, y: 125 },
        { x: 1220, y: 140 }, { x: 1280, y: 100 }
    ];
    lilyPads.forEach(lp => {
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.ellipse(lp.x, lp.y, 14, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f43f5e'; // Pink water blossom
        ctx.fillRect(lp.x - 2, lp.y - 3, 5, 5);
        ctx.fillStyle = '#fbcfe8';
        ctx.fillRect(lp.x - 1, lp.y - 2, 3, 3);
    });

    // Arched Stone Footbridge over River (x: 1050, y: 90)
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(1000, 140);
    ctx.bezierCurveTo(1060, 80, 1120, 80, 1180, 120);
    ctx.lineTo(1190, 145);
    ctx.bezierCurveTo(1130, 105, 1070, 105, 1010, 165);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#cbd5e1'; // Stone railing
    ctx.fillRect(1020, 95, 150, 6);

    // 3. Diagonal Grand Cobblestone Promenade (Slope ~ 0.22)
    // Runs from (-80, 650) to (1450, 310)
    ctx.fillStyle = '#9e9180'; // Warm stone paver base
    ctx.beginPath();
    ctx.moveTo(-80, 650);
    ctx.lineTo(1450, 310);
    ctx.lineTo(1450, 520);
    ctx.lineTo(-80, 860);
    ctx.closePath();
    ctx.fill();

    // Cobblestone Paver Texture
    ctx.fillStyle = '#b5a998';
    for (let py = 310; py < 860; py += 14) {
        const xBase = Math.round((py - 310) / 0.22);
        for (let px = xBase - 280; px < xBase + 280; px += 28) {
            if (px >= 0 && px < WIDTH) {
                ctx.fillRect(px, py, 12, 7);
                ctx.fillStyle = '#7a6f60'; // Paver shadow
                ctx.fillRect(px, py + 6, 12, 2);
                ctx.fillStyle = '#dcd4c8'; // Paver highlight
                ctx.fillRect(px, py, 12, 1);
                ctx.fillStyle = '#b5a998';
            }
        }
    }

    // Granite Curbs & Highlights
    ctx.strokeStyle = '#f3ede4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-80, 650);
    ctx.lineTo(1450, 310);
    ctx.stroke();

    ctx.strokeStyle = '#574d41';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-80, 652);
    ctx.lineTo(1450, 312);
    ctx.stroke();

    // 4. Center-Left Paved Stand Plaza (approx x: 420-560, y: 380-490)
    // Spacious circular & hexagonal sandstone plaza for coffee cart and queue
    ctx.fillStyle = '#d7ccbc';
    ctx.beginPath();
    ctx.ellipse(490, 440, 160, 85, -0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6d6152';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inlaid Geometric Rose Compass in Plaza
    ctx.fillStyle = '#c5b8a5';
    ctx.beginPath();
    ctx.ellipse(490, 440, 120, 60, -0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a89a87';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 5. Ornate Victorian Gazebo / Bandstand (Upper Center-Left: x: 740, y: 220)
    // Octagonal wooden platform, white posts, scalloped terracotta roof
    ctx.fillStyle = '#f8fafc'; // White pillars
    for (let gx = 680; gx <= 800; gx += 40) {
        ctx.fillRect(gx, 180, 6, 50);
    }
    // Wooden Railing
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(670, 210, 140, 6);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(670, 195, 140, 3);
    // Scalloped Bell Roof
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(650, 185);
    ctx.lineTo(740, 110);
    ctx.lineTo(830, 185);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(670, 180);
    ctx.lineTo(740, 120);
    ctx.lineTo(810, 180);
    ctx.closePath();
    ctx.fill();
    // Golden Finial
    ctx.fillStyle = '#facc15';
    ctx.fillRect(738, 95, 5, 16);
    ctx.beginPath();
    ctx.arc(740, 95, 6, 0, Math.PI * 2);
    ctx.fill();

    // 6. Multi-Tiered Stone Fountain (Upper-Left: x: 190, y: 360)
    ctx.fillStyle = '#64748b'; // Lower basin
    ctx.beginPath();
    ctx.ellipse(190, 375, 75, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0284c7'; // Basin water
    ctx.beginPath();
    ctx.ellipse(190, 373, 68, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94a3b8'; // Pedestal
    ctx.fillRect(182, 335, 16, 35);
    ctx.fillStyle = '#64748b'; // Upper tier
    ctx.beginPath();
    ctx.ellipse(190, 335, 45, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8'; // Upper water
    ctx.beginPath();
    ctx.ellipse(190, 333, 38, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Water Jets
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(188, 305, 4, 28);
    ctx.fillRect(184, 312, 3, 18);
    ctx.fillRect(193, 312, 3, 18);

    // 7. Lush Botanical Trees with Dappled Sunlight
    drawRichPixelTree(ctx, 80, 240, 75, '#1e6f3d', '#28a745', '#144d29');
    drawRichPixelTree(ctx, 350, 140, 68, '#c2410c', '#ea580c', '#7c2d12'); // Autumn Japanese Maple
    drawRichPixelTree(ctx, 920, 110, 85, '#15803d', '#22c55e', '#14532d'); // Big Oak
    drawRichPixelTree(ctx, 1260, 260, 80, '#166534', '#16a34a', '#14532d'); // Weeping Willow

    // 8. Wrought-Iron Park Benches & Streetlamps
    drawParkBench(ctx, 310, 420);
    drawParkBench(ctx, 900, 310);
    drawParkLamp(ctx, 410, 380);
    drawParkLamp(ctx, 1080, 260);

    // 9. Flowerbeds & Hedges along Paths
    drawFloweringHedge(ctx, 600, 355, 140, 22);
    drawFloweringHedge(ctx, 220, 480, 110, 22);
    drawFloweringHedge(ctx, 1140, 240, 160, 22);

    // Distant City Skyline Silhouettes (Top Background Horizon)
    ctx.fillStyle = 'rgba(100, 116, 139, 0.45)';
    ctx.fillRect(500, 0, 50, 80);
    ctx.fillRect(570, 0, 65, 95);
    ctx.fillRect(660, 0, 45, 65);
    ctx.fillRect(840, 0, 70, 75);

    return canvas;
}

// -------------------------------------------------------------
// 2. TECH UNIVERSITY CAMPUS (Red-Brick Quad & Clock Tower)
// -------------------------------------------------------------
function generateCampusBackground() {
    const { canvas, ctx } = createBaseCanvas();

    // 1. Manicured Quad Lawn Base
    ctx.fillStyle = '#1e5f30';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#287940';
    for (let y = 0; y < HEIGHT; y += 8) {
        const xOffset = (Math.floor(y / 8) % 2) * 8;
        for (let x = xOffset; x < WIDTH; x += 16) {
            ctx.fillRect(x, y, 4, 3);
        }
    }

    // 2. Collegiate Red-Brick Gothic Halls (Top & Background)
    // Left Wing Hall (x: 0 to 420)
    ctx.fillStyle = '#7f1d1d'; // Dark red brick
    ctx.fillRect(0, 40, 380, 190);
    ctx.fillStyle = '#991b1b'; // Red brick facade
    ctx.fillRect(0, 50, 370, 180);
    // Brick mortar lines
    ctx.fillStyle = '#5c1414';
    for (let by = 55; by < 230; by += 10) {
        ctx.fillRect(0, by, 370, 2);
    }
    // Slate Roof & Gables
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-20, 50);
    ctx.lineTo(80, 0);
    ctx.lineTo(180, 50);
    ctx.lineTo(280, 0);
    ctx.lineTo(390, 50);
    ctx.closePath();
    ctx.fill();
    // Warm Mullioned Glass Windows
    for (let wy = 80; wy <= 170; wy += 45) {
        for (let wx = 30; wx <= 330; wx += 50) {
            ctx.fillStyle = '#fef08a'; // Warm amber glow
            ctx.fillRect(wx, wy, 24, 30);
            ctx.fillStyle = '#451a03'; // Window mullions
            ctx.fillRect(wx + 11, wy, 2, 30);
            ctx.fillRect(wx, wy + 14, 24, 2);
            ctx.strokeStyle = '#ffffff'; // White stone trim
            ctx.lineWidth = 2;
            ctx.strokeRect(wx - 2, wy - 2, 28, 34);
        }
    }

    // Ivy Vines climbing on brick wall
    ctx.fillStyle = '#166534';
    ctx.fillRect(20, 130, 22, 90);
    ctx.fillRect(160, 110, 26, 110);
    ctx.fillRect(320, 140, 30, 80);

    // 3. Central Clock Tower (x: 620 to 760, y: 0 to 240)
    ctx.fillStyle = '#831843'; // Tower base
    ctx.fillRect(620, 30, 140, 220);
    ctx.fillStyle = '#9f1239';
    ctx.fillRect(630, 40, 120, 200);
    // Tower Belfry & Arches
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(655, 60, 30, 50);
    ctx.fillRect(695, 60, 30, 50);
    // Copper/Slate Spire
    ctx.fillStyle = '#0f766e'; // Verdigris oxidized copper
    ctx.beginPath();
    ctx.moveTo(610, 40);
    ctx.lineTo(690, -30);
    ctx.lineTo(770, 40);
    ctx.closePath();
    ctx.fill();
    // Large Glowing Clock Face
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(690, 150, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#facc15'; // Brass rim
    ctx.lineWidth = 4;
    ctx.stroke();
    // Clock hands pointing to 10:10 (morning coffee peak!)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(690, 150);
    ctx.lineTo(708, 140);
    ctx.moveTo(690, 150);
    ctx.lineTo(676, 134);
    ctx.stroke();

    // Right Wing: Modern Computer Science & Engineering Atrium (x: 880 to 1376)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(880, 60, 500, 180);
    ctx.fillStyle = '#0284c7'; // Blue solar glass facade
    ctx.fillRect(900, 75, 460, 155);
    // Steel mullion grid
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    for (let gx = 900; gx <= 1360; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 75);
        ctx.lineTo(gx, 230);
        ctx.stroke();
    }
    for (let gy = 75; gy <= 230; gy += 38) {
        ctx.beginPath();
        ctx.moveTo(900, gy);
        ctx.lineTo(1360, gy);
        ctx.stroke();
    }
    // Glowing server lights inside
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(960, 120, 8, 4);
    ctx.fillRect(1080, 150, 8, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(1200, 110, 8, 4);

    // 4. Diagonal Herringbone Terracotta Quad Promenade
    ctx.fillStyle = '#852417'; // Rich terracotta brick
    ctx.beginPath();
    ctx.moveTo(-80, 650);
    ctx.lineTo(1450, 310);
    ctx.lineTo(1450, 520);
    ctx.lineTo(-80, 860);
    ctx.closePath();
    ctx.fill();

    // Herringbone Paver Texture
    ctx.fillStyle = '#a83222';
    for (let py = 310; py < 860; py += 12) {
        const xBase = Math.round((py - 310) / 0.22);
        for (let px = xBase - 280; px < xBase + 280; px += 24) {
            if (px >= 0 && px < WIDTH) {
                ctx.fillRect(px, py, 14, 5);
                ctx.fillStyle = '#5c140a';
                ctx.fillRect(px, py + 4, 14, 2);
                ctx.fillStyle = '#cf4936';
                ctx.fillRect(px, py, 14, 1);
                ctx.fillStyle = '#a83222';
            }
        }
    }

    // Limestone Walkway Borders
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-80, 650);
    ctx.lineTo(1450, 310);
    ctx.stroke();

    // 5. Center-Left Paved Stand Plaza (Courtyard Stone Inlay)
    ctx.fillStyle = '#e2e8f0'; // Limestone courtyard pavers
    ctx.beginPath();
    ctx.ellipse(490, 440, 160, 85, -0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.stroke();

    // University Compass Crest Inlay
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.ellipse(490, 440, 90, 45, -0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.ellipse(490, 440, 60, 30, -0.22, 0, Math.PI * 2);
    ctx.fill();

    // 6. Campus Amenities: Bicycle Racks, Bulletin Board, Study Benches
    // Retro Bicycle Rack (x: 240, y: 460)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(200, 455, 90, 6);
    for (let bx = 210; bx <= 280; bx += 18) {
        ctx.fillRect(bx, 435, 4, 25);
    }
    // Parked Red Bicycle
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(220, 450, 14, 0, Math.PI * 2);
    ctx.arc(260, 450, 14, 0, Math.PI * 2);
    ctx.moveTo(220, 450);
    ctx.lineTo(240, 435);
    ctx.lineTo(260, 450);
    ctx.stroke();

    // Wooden Campus Bulletin Board (x: 780, y: 350)
    ctx.fillStyle = '#78350f'; // Dark wood frame
    ctx.fillRect(750, 290, 90, 70);
    ctx.fillStyle = '#d97706'; // Corkboard
    ctx.fillRect(756, 296, 78, 58);
    // Colorful Paper Flyers & Notices
    const flyers = [
        { x: 760, y: 300, c: '#fef08a' }, { x: 785, y: 302, c: '#bae6fd' },
        { x: 810, y: 305, c: '#fbcfe8' }, { x: 765, y: 325, c: '#bbf7d0' },
        { x: 795, y: 328, c: '#fed7aa' }
    ];
    flyers.forEach(f => {
        ctx.fillStyle = f.c;
        ctx.fillRect(f.x, f.y, 18, 22);
        ctx.fillStyle = '#475569';
        ctx.fillRect(f.x + 2, f.y + 4, 14, 2);
        ctx.fillRect(f.x + 2, f.y + 8, 10, 2);
    });

    // Collegiate Trees & Garden Shrubs
    drawRichPixelTree(ctx, 420, 180, 65, '#15803d', '#22c55e', '#14532d');
    drawRichPixelTree(ctx, 840, 200, 70, '#ca8a04', '#eab308', '#854d0e'); // Golden Elm
    drawCampusLamp(ctx, 390, 380);
    drawCampusLamp(ctx, 980, 280);

    return canvas;
}

// -------------------------------------------------------------
// 3. GRAND CENTRAL METRO (Transit Concourse & Subway Plaza)
// -------------------------------------------------------------
function generateMetroBackground() {
    const { canvas, ctx } = createBaseCanvas();

    // 1. Vaulted Metro Station Interior Wall & Arches
    ctx.fillStyle = '#1e293b'; // Slate transit interior
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Grand Iron & Glass Skylight Arches (Top Ceiling)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, WIDTH, 160);

    // Arched Steel Trusses & Warm Glass Skylights
    for (let ax = 0; ax < WIDTH; ax += 180) {
        ctx.fillStyle = '#334155'; // Iron arch rib
        ctx.beginPath();
        ctx.moveTo(ax, 160);
        ctx.quadraticCurveTo(ax + 90, 20, ax + 180, 160);
        ctx.lineTo(ax + 170, 160);
        ctx.quadraticCurveTo(ax + 90, 35, ax + 10, 160);
        ctx.closePath();
        ctx.fill();

        // Warm Morning Sunlight streaming through glass
        ctx.fillStyle = 'rgba(254, 243, 199, 0.15)';
        ctx.beginPath();
        ctx.moveTo(ax + 20, 160);
        ctx.lineTo(ax + 100, 500);
        ctx.lineTo(ax + 220, 500);
        ctx.lineTo(ax + 160, 160);
        ctx.closePath();
        ctx.fill();
    }

    // 2. Large Split-Flap Destination Departures / Arrivals Board (x: 520, y: 70)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(480, 60, 420, 95);
    ctx.strokeStyle = '#eab308'; // Amber border
    ctx.lineWidth = 3;
    ctx.strokeRect(480, 60, 420, 95);
    // Header
    ctx.fillStyle = '#eab308';
    ctx.fillRect(485, 65, 410, 16);
    // Flip rows
    ctx.fillStyle = '#f8fafc';
    for (let fy = 88; fy <= 140; fy += 14) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(490, fy, 400, 10);
        ctx.fillStyle = '#fde047'; // Amber glowing text flip lines
        ctx.fillRect(495, fy + 2, 80, 6);
        ctx.fillStyle = '#22c55e'; // ON TIME green
        ctx.fillRect(810, fy + 2, 70, 6);
    }

    // Grand Antique Four-Faced Brass Station Clock (Hanging at x: 440, y: 150)
    ctx.fillStyle = '#78350f'; // Iron bracket
    ctx.fillRect(435, 120, 10, 35);
    ctx.fillStyle = '#facc15'; // Brass casing
    ctx.beginPath();
    ctx.arc(440, 175, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc'; // White clock face
    ctx.beginPath();
    ctx.arc(440, 175, 21, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(440, 175);
    ctx.lineTo(440, 162);
    ctx.moveTo(440, 175);
    ctx.lineTo(453, 175);
    ctx.stroke();

    // 3. Metro Ticket Turnstiles & Escalator Entrance (Background x: 80 to 420, y: 160 to 240)
    ctx.fillStyle = '#0284c7'; // Glowing Subway Line Indicator
    ctx.fillRect(100, 165, 120, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(105, 170, 15, 12);
    // Turnstiles
    ctx.fillStyle = '#64748b';
    for (let tx = 110; tx <= 380; tx += 45) {
        ctx.fillRect(tx, 200, 32, 40);
        ctx.fillStyle = '#22c55e'; // Green swipe light
        ctx.fillRect(tx + 12, 196, 8, 4);
        ctx.fillStyle = '#64748b';
    }

    // 4. Diagonal Polished Terrazzo Concourse Floor
    ctx.fillStyle = '#3f3f46'; // Dark polished granite
    ctx.beginPath();
    ctx.moveTo(-80, 650);
    ctx.lineTo(1450, 310);
    ctx.lineTo(1450, 520);
    ctx.lineTo(-80, 860);
    ctx.closePath();
    ctx.fill();

    // Checkerboard Terrazzo Grid Texture
    for (let py = 310; py < 860; py += 16) {
        const xBase = Math.round((py - 310) / 0.22);
        for (let px = xBase - 280; px < xBase + 280; px += 32) {
            if (px >= 0 && px < WIDTH) {
                const isLight = (Math.floor(px / 32) + Math.floor(py / 16)) % 2 === 0;
                ctx.fillStyle = isLight ? '#71717a' : '#52525b';
                ctx.fillRect(px, py, 28, 12);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // High polish gloss
                ctx.fillRect(px, py, 28, 2);
            }
        }
    }

    // Brass Inlay Border Lines
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-80, 650);
    ctx.lineTo(1450, 310);
    ctx.stroke();

    // 5. Center-Left Paved Stand Plaza (Polished Marble Concourse Ring)
    ctx.fillStyle = '#d4d4d8';
    ctx.beginPath();
    ctx.ellipse(490, 440, 160, 85, -0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04'; // Polished Brass Trim
    ctx.lineWidth = 4;
    ctx.stroke();

    // Marble Floor Star Medallion
    ctx.fillStyle = '#3f3f46';
    ctx.beginPath();
    ctx.ellipse(490, 440, 110, 55, -0.22, 0, Math.PI * 2);
    ctx.fill();

    // 6. Vintage Newsstand Kiosk (Right background: x: 960 to 1180, y: 170 to 270)
    ctx.fillStyle = '#166534'; // Forest green newsstand
    ctx.fillRect(960, 180, 200, 85);
    ctx.fillStyle = '#bbf7d0'; // Awning
    ctx.fillRect(950, 170, 220, 16);
    // Magazine & Newspaper Racks
    ctx.fillStyle = '#f8fafc';
    for (let my = 200; my <= 245; my += 16) {
        ctx.fillStyle = '#d97706';
        ctx.fillRect(970, my, 180, 10);
        // Multi-colored magazine covers
        ctx.fillStyle = '#ef4444'; ctx.fillRect(975, my - 6, 12, 14);
        ctx.fillStyle = '#3b82f6'; ctx.fillRect(995, my - 6, 12, 14);
        ctx.fillStyle = '#eab308'; ctx.fillRect(1015, my - 6, 12, 14);
        ctx.fillStyle = '#10b981'; ctx.fillRect(1035, my - 6, 12, 14);
    }

    // Cast-iron Concourse Lantern Pillars
    drawMetroPillar(ctx, 360, 360);
    drawMetroPillar(ctx, 920, 280);

    return canvas;
}

// -------------------------------------------------------------
// 4. WALL ST. & CRYPTO PLAZA (Financial District & Crypto Center)
// -------------------------------------------------------------
function generateDowntownBackground() {
    const { canvas, ctx } = createBaseCanvas();

    // 1. Sleek Cosmopolitan Sky & Skyscraper Silhouettes
    ctx.fillStyle = '#090d16'; // Deep twilight blue
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Towering Glass Skyscrapers (Background x: 0 to 1376)
    // Left Tower: Wall Street Financial Center
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(40, 20, 220, 230);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(55, 35, 190, 215);
    // Glowing Office Windows
    for (let wy = 50; wy <= 220; wy += 20) {
        for (let wx = 65; wx <= 225; wx += 24) {
            if ((wx + wy) % 7 !== 0) {
                ctx.fillStyle = '#fef08a'; // Executive lights
                ctx.fillRect(wx, wy, 14, 10);
            }
        }
    }

    // Center Tower: Modern Crypto Tech Spire (x: 340 to 620)
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(340, 0, 260, 250);
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(355, 0, 230, 250);
    // Modern Glass Ribs & Spire
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    for (let rx = 370; rx <= 570; rx += 35) {
        ctx.beginPath();
        ctx.moveTo(rx, 0);
        ctx.lineTo(rx, 250);
        ctx.stroke();
    }
    // High-Tech Spire Antennas
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(470, 0);
    ctx.lineTo(470, -40);
    ctx.stroke();

    // Right Tower: Neoclassical Stock Exchange Building (x: 680 to 1040)
    ctx.fillStyle = '#e2e8f0'; // White marble facade
    ctx.fillRect(680, 50, 340, 200);
    // Classical Triangular Pediment
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(660, 50);
    ctx.lineTo(850, 0);
    ctx.lineTo(1040, 50);
    ctx.closePath();
    ctx.fill();
    // Marble Columns
    ctx.fillStyle = '#f8fafc';
    for (let cx = 710; cx <= 990; cx += 45) {
        ctx.fillRect(cx, 50, 20, 160);
        ctx.fillStyle = '#94a3b8'; // Column fluting
        ctx.fillRect(cx + 8, 50, 4, 160);
        ctx.fillStyle = '#f8fafc';
    }

    // Far Right Skyscraper (x: 1060 to 1376)
    ctx.fillStyle = '#111827';
    ctx.fillRect(1060, 10, 316, 240);
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(1080, 25, 280, 225);
    for (let wy = 40; wy <= 220; wy += 22) {
        for (let wx = 1095; wx <= 1340; wx += 28) {
            ctx.fillStyle = '#67e8f9'; // Cyan LED lights
            ctx.fillRect(wx, wy, 16, 12);
        }
    }

    // 2. LIVE CRYPTO & STOCK TICKER RIBBON (Across mid-background)
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 240, WIDTH, 32);
    ctx.strokeStyle = '#22c55e'; // Green bull line
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 240, WIDTH, 32);

    // Glowing Crypto Candlestick Symbols
    const tickers = [
        { sym: 'BTC', price: '$98,420 🟢', x: 80, col: '#22c55e' },
        { sym: 'ETH', price: '$4,120 🟢', x: 340, col: '#22c55e' },
        { sym: 'USDC', price: '$1.000 🔵', x: 620, col: '#38bdf8' },
        { sym: 'COFFEE', price: '$3.50 🚀', x: 890, col: '#facc15' },
        { sym: 'BEAN', price: '$2.80 🟢', x: 1160, col: '#22c55e' }
    ];
    tickers.forEach(t => {
        ctx.fillStyle = t.col;
        ctx.fillRect(t.x, 246, 50, 18);
        ctx.fillRect(t.x + 60, 250, 120, 10);
    });

    // 3. Diagonal High-Tech Granite Plaza / Boulevard
    ctx.fillStyle = '#18181b'; // Dark obsidian granite
    ctx.beginPath();
    ctx.moveTo(-80, 650);
    ctx.lineTo(1450, 310);
    ctx.lineTo(1450, 520);
    ctx.lineTo(-80, 860);
    ctx.closePath();
    ctx.fill();

    // Precision Paved Pavers & Embedded Blue LED Guide Strips
    for (let py = 310; py < 860; py += 16) {
        const xBase = Math.round((py - 310) / 0.22);
        for (let px = xBase - 280; px < xBase + 280; px += 36) {
            if (px >= 0 && px < WIDTH) {
                ctx.fillStyle = '#27272a';
                ctx.fillRect(px, py, 32, 12);
                ctx.fillStyle = '#3f3f46';
                ctx.fillRect(px, py, 32, 2);
                // Embedded Blue LED Ground Strip
                if (px % 72 === 0) {
                    ctx.fillStyle = '#06b6d4';
                    ctx.fillRect(px + 14, py + 5, 4, 3);
                }
            }
        }
    }

    // High-Gloss Curbing & Pedestrian Crosswalk
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-80, 650);
    ctx.lineTo(1450, 310);
    ctx.stroke();

    // Pedestrian White Crosswalk Zebra Stripes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let zx = 100; zx <= 350; zx += 35) {
        const zy = Math.round(620 - (zx - 100) * 0.22);
        ctx.beginPath();
        ctx.moveTo(zx, zy);
        ctx.lineTo(zx + 18, zy - 40);
        ctx.lineTo(zx + 32, zy - 40);
        ctx.lineTo(zx + 14, zy);
        ctx.closePath();
        ctx.fill();
    }

    // 4. Center-Left Paved Stand Plaza (Polished Titanium & Granite)
    ctx.fillStyle = '#3f3f46';
    ctx.beginPath();
    ctx.ellipse(490, 440, 160, 85, -0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#22c55e'; // Glowing Bull Market Green Ring
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.ellipse(490, 440, 110, 55, -0.22, 0, Math.PI * 2);
    ctx.fill();

    // 5. Modern Street Furniture & Planters
    // Architectural Boxwood Topiary Planters (Stainless Steel)
    drawModernPlanter(ctx, 330, 410);
    drawModernPlanter(ctx, 750, 340);
    drawModernPlanter(ctx, 1120, 260);

    // Modern Geometric Cube Benches
    ctx.fillStyle = '#71717a';
    ctx.fillRect(660, 390, 60, 22);
    ctx.fillStyle = '#a1a1aa';
    ctx.fillRect(660, 390, 60, 5);

    // Sleek Titanium Streetlamps with Cyan Halos
    drawDowntownLamp(ctx, 420, 370);
    drawDowntownLamp(ctx, 980, 270);

    return canvas;
}

// -------------------------------------------------------------
// HELPER DRAWING FUNCTIONS
// -------------------------------------------------------------

function drawRichPixelTree(ctx, x, y, r, cDark, cMid, cShadow) {
    // Trunk
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 8, y, 16, 50);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 4, y, 8, 50);

    // Shadow on ground
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y + 50, r * 0.9, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Clustered leafy canopy
    const clusters = [
        { dx: 0, dy: -r * 0.7, cr: r * 0.65 },
        { dx: -r * 0.45, dy: -r * 0.35, cr: r * 0.55 },
        { dx: r * 0.45, dy: -r * 0.35, cr: r * 0.55 },
        { dx: -r * 0.25, dy: 0, cr: r * 0.5 },
        { dx: r * 0.25, dy: 0, cr: r * 0.5 }
    ];

    clusters.forEach(cl => {
        // Deep shadow
        ctx.fillStyle = cShadow;
        ctx.beginPath();
        ctx.arc(x + cl.dx, y + cl.dy + 4, cl.cr, 0, Math.PI * 2);
        ctx.fill();
        // Mid tone
        ctx.fillStyle = cDark;
        ctx.beginPath();
        ctx.arc(x + cl.dx, y + cl.dy, cl.cr, 0, Math.PI * 2);
        ctx.fill();
        // Sunlight highlight
        ctx.fillStyle = cMid;
        ctx.beginPath();
        ctx.arc(x + cl.dx - cl.cr * 0.25, y + cl.dy - cl.cr * 0.25, cl.cr * 0.7, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawParkBench(ctx, x, y) {
    ctx.fillStyle = '#1e3a1e'; // Dark green iron frame
    ctx.fillRect(x, y + 10, 4, 16);
    ctx.fillRect(x + 50, y + 10, 4, 16);
    ctx.fillStyle = '#78350f'; // Warm wood slats
    ctx.fillRect(x - 4, y + 4, 62, 5);
    ctx.fillRect(x - 4, y + 11, 62, 5);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x - 4, y + 16, 62, 4);
}

function drawParkLamp(ctx, x, y) {
    ctx.fillStyle = '#1e293b'; // Cast iron pole
    ctx.fillRect(x - 2, y, 5, 55);
    ctx.fillRect(x - 8, y + 50, 17, 6);
    // Lantern head
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 6, y - 12, 13, 14);
    ctx.fillStyle = '#fef08a'; // Warm amber glow
    ctx.fillRect(x - 4, y - 10, 9, 10);
    // Ambient light halo
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.beginPath();
    ctx.arc(x, y - 5, 22, 0, Math.PI * 2);
    ctx.fill();
}

function drawCampusLamp(ctx, x, y) {
    drawParkLamp(ctx, x, y);
    // Blue & Gold Collegiate Pennant
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(x + 3, y + 6);
    ctx.lineTo(x + 22, y + 15);
    ctx.lineTo(x + 3, y + 24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x + 5, y + 13, 8, 4);
}

function drawMetroPillar(ctx, x, y) {
    ctx.fillStyle = '#166534'; // British racing green cast iron
    ctx.fillRect(x - 6, y, 12, 90);
    ctx.fillRect(x - 14, y + 80, 28, 12);
    ctx.fillRect(x - 14, y - 6, 28, 12);
    // Glowing Metro Lantern
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x, y - 14, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
    ctx.beginPath();
    ctx.arc(x, y - 14, 25, 0, Math.PI * 2);
    ctx.fill();
}

function drawDowntownLamp(ctx, x, y) {
    ctx.fillStyle = '#71717a'; // Titanium pole
    ctx.fillRect(x - 2, y, 4, 60);
    // Angled modern LED arm
    ctx.fillStyle = '#38bdf8'; // Glowing cyan LED
    ctx.fillRect(x - 10, y - 8, 20, 6);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.beginPath();
    ctx.arc(x, y - 5, 20, 0, Math.PI * 2);
    ctx.fill();
}

function drawFloweringHedge(ctx, x, y, w, h) {
    ctx.fillStyle = '#14532d';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(x, y, w, h - 4);
    ctx.fillStyle = '#22c55e';
    for (let fx = x; fx < x + w; fx += 12) {
        ctx.fillRect(fx, y, 6, 4);
        // Flowers
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(fx + 2, y + 5, 4, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(fx + 3, y + 6, 2, 2);
        ctx.fillStyle = '#22c55e';
    }
}

function drawModernPlanter(ctx, x, y) {
    ctx.fillStyle = '#3f3f46'; // Stainless steel cube planter
    ctx.fillRect(x, y, 38, 28);
    ctx.fillStyle = '#71717a';
    ctx.fillRect(x + 2, y + 2, 34, 4);
    // Manicured Boxwood Topiary Ball
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x + 19, y - 10, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(x + 15, y - 14, 10, 0, Math.PI * 2);
    ctx.fill();
}

// -------------------------------------------------------------
// MAIN EXECUTION
// -------------------------------------------------------------
async function main() {
    const assetsDir = path.join(__dirname, '..', 'assets');
    console.log('Generating 16-bit isometric background images in:', assetsDir);

    const generators = [
        { name: 'park_bg.jpg', fn: generateParkBackground },
        { name: 'campus_bg.jpg', fn: generateCampusBackground },
        { name: 'metro_bg.jpg', fn: generateMetroBackground },
        { name: 'downtown_bg.jpg', fn: generateDowntownBackground }
    ];

    for (const gen of generators) {
        console.log(`Rendering ${gen.name}...`);
        const canvas = gen.fn();
        const buffer = canvas.toBuffer('image/jpeg', { quality: 95 });
        const targetPath = path.join(assetsDir, gen.name);
        fs.writeFileSync(targetPath, buffer);
        console.log(`✓ Saved ${gen.name} (${buffer.length} bytes, 1376x768)`);
    }

    console.log('\nAll 4 location backgrounds generated successfully!');
}

main().catch(err => {
    console.error('Generation failed:', err);
    process.exit(1);
});
