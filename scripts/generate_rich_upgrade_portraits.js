const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;
const {
    createPixelCanvas,
    hexToRgba,
    setPixel,
    fillRect,
    strokeRect,
    fillCircle,
    strokeCircle,
    drawShadow
} = require('./pixel_primitives');

function drawBevelBox(png, x, y, w, h, topColor, mainColor, botColor, outlineColor) {
    if (outlineColor) {
        fillRect(png, x - 2, y - 2, w + 4, h + 4, hexToRgba(outlineColor));
    }
    fillRect(png, x, y, w, h, hexToRgba(mainColor));
    fillRect(png, x, y, w, 2, hexToRgba(topColor));
    fillRect(png, x, y, 2, h, hexToRgba(topColor));
    fillRect(png, x, y + h - 2, w, 2, hexToRgba(botColor));
    fillRect(png, x + w - 2, y, 2, h, hexToRgba(botColor));
}

function drawCoffeeBean(png, cx, cy, r, angle = 0) {
    fillCircle(png, cx, cy, r, hexToRgba('#3e2723'));
    fillCircle(png, cx - 1, cy - 1, r * 0.7, hexToRgba('#5d4037'));
    // Center crease line
    const dx = Math.sin(angle);
    const dy = Math.cos(angle);
    for (let d = -r + 1; d <= r - 1; d++) {
        setPixel(png, cx + d * dx, cy + d * dy, hexToRgba('#1a0c02'));
    }
}

function drawIceCube(png, x, y, size) {
    drawBevelBox(png, x, y, size, size, '#ffffff', '#e0f2fe', '#7dd3fc', '#0284c7');
    fillRect(png, x + 2, y + 2, Math.floor(size * 0.4), Math.floor(size * 0.4), hexToRgba('#ffffff', 220));
    fillRect(png, x + size - 4, y + size - 4, 2, 2, hexToRgba('#38bdf8'));
}

const generators = {
    // 1. Cooler Level 1: Cardboard Box Cooler
    'upg_cooler_1.png': (png) => {
        drawShadow(png, 128, 222, 78, 18);
        // Outer cardboard box body with 3-tone shading
        drawBevelBox(png, 54, 96, 148, 120, '#f59e0b', '#d97706', '#92400e', '#451a03');
        // Cardboard fluting vertical texture lines
        for (let x = 62; x < 196; x += 8) {
            fillRect(png, x, 102, 1, 108, hexToRgba('#b45309', 140));
        }
        // Open Box Top Flaps
        drawBevelBox(png, 38, 70, 48, 32, '#fbbf24', '#d97706', '#78350f', '#451a03');
        drawBevelBox(png, 170, 70, 48, 32, '#fbbf24', '#d97706', '#78350f', '#451a03');
        // Packing tape across front
        fillRect(png, 120, 96, 16, 120, hexToRgba('#fde047', 210));
        fillRect(png, 126, 96, 4, 120, hexToRgba('#ffffff', 160));
        // FRAGILE / UPRIGHT stamp
        drawBevelBox(png, 68, 150, 42, 20, '#fca5a5', '#ef4444', '#b91c1c', '#7f1d1d');
        fillRect(png, 74, 156, 30, 8, hexToRgba('#ffffff'));
        // Styrofoam inner insulation liner
        drawBevelBox(png, 66, 80, 124, 28, '#ffffff', '#f1f5f9', '#cbd5e1', '#334155');
        // Shiny Ice Cubes inside
        drawIceCube(png, 76, 68, 24);
        drawIceCube(png, 104, 64, 26);
        drawIceCube(png, 134, 70, 24);
        drawIceCube(png, 92, 80, 22);
        drawIceCube(png, 122, 82, 24);
        // Glass Milk bottle chilling in ice
        drawBevelBox(png, 152, 42, 26, 52, '#ffffff', '#f8fafc', '#cbd5e1', '#1e293b');
        drawBevelBox(png, 158, 30, 14, 14, '#38bdf8', '#0284c7', '#0369a1', '#082f49');
        fillRect(png, 155, 60, 20, 18, hexToRgba('#0284c7')); // Blue cow milk label
        fillRect(png, 160, 64, 10, 10, hexToRgba('#ffffff'));
    },

    // 2. Cooler Level 2: Insulated Ice Chest
    'upg_cooler_2.png': (png) => {
        drawShadow(png, 128, 224, 82, 19);
        // Molded Royal Blue Cooler Tub
        drawBevelBox(png, 50, 100, 156, 116, '#38bdf8', '#0284c7', '#075985', '#082f49');
        // Horizontal aerodynamic ribbing
        fillRect(png, 58, 124, 140, 5, hexToRgba('#0369a1'));
        fillRect(png, 58, 144, 140, 5, hexToRgba('#0369a1'));
        fillRect(png, 58, 164, 140, 5, hexToRgba('#0369a1'));
        fillRect(png, 58, 184, 140, 5, hexToRgba('#0369a1'));
        // Heavy Insulated White Lid with Chrome Handles
        drawBevelBox(png, 44, 68, 168, 38, '#ffffff', '#f1f5f9', '#cbd5e1', '#334155');
        fillRect(png, 48, 102, 160, 4, hexToRgba('#64748b'));
        // Stainless Steel Front Latches with Keyholes
        drawBevelBox(png, 88, 94, 18, 24, '#ffffff', '#cbd5e1', '#64748b', '#0f172a');
        drawBevelBox(png, 150, 94, 18, 24, '#ffffff', '#cbd5e1', '#64748b', '#0f172a');
        fillCircle(png, 97, 106, 2, hexToRgba('#0f172a'));
        fillCircle(png, 159, 106, 2, hexToRgba('#0f172a'));
        // Red Side Heavy-Duty Handles
        drawBevelBox(png, 32, 120, 20, 36, '#f87171', '#ef4444', '#b91c1c', '#7f1d1d');
        drawBevelBox(png, 204, 120, 20, 36, '#f87171', '#ef4444', '#b91c1c', '#7f1d1d');
        // Red Drain Spout Cap
        drawBevelBox(png, 184, 192, 16, 14, '#ef4444', '#dc2626', '#991b1b', '#450a0a');
        // Embossed Vintage Logo Badge
        drawBevelBox(png, 108, 140, 40, 22, '#fef08a', '#facc15', '#ca8a04', '#713f12');
        fillRect(png, 114, 147, 28, 7, hexToRgba('#713f12'));
    },

    // 3. Cooler Level 4: Cryo-Freezer Unit
    'upg_cooler_4.png': (png) => {
        drawShadow(png, 128, 226, 76, 19);
        // Heavy Stainless Steel Commercial Chassis
        drawBevelBox(png, 60, 38, 136, 184, '#ffffff', '#cbd5e1', '#64748b', '#0f172a');
        // Digital Cryo LED Header
        drawBevelBox(png, 76, 46, 104, 18, '#020617', '#0f172a', '#020617', '#000000');
        fillRect(png, 88, 51, 80, 8, hexToRgba('#00ffcc')); // -18°C CRYO ACTIVE
        // Double-Pane Insulated Glass Door Panel
        drawBevelBox(png, 72, 70, 112, 118, '#bae6fd', '#38bdf8', '#0284c7', '#0f172a');
        // Cold Cryogenic Vapor Frosting on Glass
        for (let i = 0; i < 10; i++) {
            fillCircle(png, 85 + (i % 4) * 24, 88 + Math.floor(i / 4) * 30, 8, hexToRgba('#ffffff', 140));
        }
        // Shelves with Ice & Milk Jugs inside
        fillRect(png, 76, 120, 104, 4, hexToRgba('#ffffff', 200));
        drawBevelBox(png, 88, 92, 22, 28, '#ffffff', '#e0f2fe', '#bae6fd', '#0369a1');
        drawBevelBox(png, 120, 92, 22, 28, '#ffffff', '#e0f2fe', '#bae6fd', '#0369a1');
        drawBevelBox(png, 150, 92, 22, 28, '#ffffff', '#e0f2fe', '#bae6fd', '#0369a1');
        // Heavy Chrome Cam-Lock Handle with Safety Lever
        drawBevelBox(png, 172, 110, 14, 48, '#ffffff', '#e2e8f0', '#94a3b8', '#0f172a');
        fillCircle(png, 179, 134, 4, hexToRgba('#00ffcc')); // indicator light
        // Lower Ventilation Compressor Grill
        drawBevelBox(png, 72, 192, 112, 24, '#1e293b', '#0f172a', '#020617', '#000000');
        for (let y = 196; y < 214; y += 4) {
            fillRect(png, 78, y, 100, 2, hexToRgba('#64748b'));
        }
    },

    // 4. Grinder Level 1: Hand Crank Grinder
    'upg_grinder_1.png': (png) => {
        drawShadow(png, 128, 222, 70, 17);
        // Rich Walnut Wood Box Base
        drawBevelBox(png, 70, 106, 116, 108, '#d97706', '#92400e', '#713f12', '#451a03');
        // Dovetail corner joint details
        for (let y = 112; y < 208; y += 16) {
            fillRect(png, 70, y, 6, 8, hexToRgba('#b45309'));
            fillRect(png, 180, y, 6, 8, hexToRgba('#78350f'));
        }
        // Pull-out Ground Coffee Drawer with Brass Knob
        drawBevelBox(png, 84, 144, 88, 56, '#b45309', '#78350f', '#451a03', '#271001');
        fillCircle(png, 128, 172, 8, hexToRgba('#fde047'));
        fillCircle(png, 128, 172, 5, hexToRgba('#ffffff'));
        fillCircle(png, 128, 172, 2, hexToRgba('#ca8a04'));
        // Dark Cast-Iron Hopper Bowl
        drawBevelBox(png, 88, 72, 80, 38, '#64748b', '#334155', '#1e293b', '#020617');
        fillCircle(png, 128, 72, 40, hexToRgba('#334155'));
        strokeCircle(png, 128, 72, 40, hexToRgba('#0f172a'), 3);
        // Roasted Coffee Beans inside Hopper
        drawCoffeeBean(png, 112, 64, 6, 0.4);
        drawCoffeeBean(png, 128, 60, 6, 1.2);
        drawCoffeeBean(png, 144, 65, 6, -0.6);
        drawCoffeeBean(png, 120, 74, 6, 2.1);
        drawCoffeeBean(png, 136, 75, 6, 0.8);
        // Forged Iron Crank Arm & Turned Wooden Handle
        fillRect(png, 125, 34, 6, 40, hexToRgba('#1e293b')); // vertical spindle
        fillCircle(png, 128, 36, 8, hexToRgba('#fde047')); // brass spindle nut
        fillRect(png, 125, 34, 60, 6, hexToRgba('#475569')); // crank arm
        drawBevelBox(png, 176, 22, 18, 30, '#f59e0b', '#b45309', '#78350f', '#451a03'); // wooden handle knob
        // Brass Oval Maker's Emblem on Front
        drawBevelBox(png, 108, 118, 40, 18, '#fef08a', '#facc15', '#ca8a04', '#713f12');
        fillRect(png, 116, 124, 24, 5, hexToRgba('#713f12'));
    },

    // 5. Grinder Level 2: Conical Burr Grinder
    'upg_grinder_2.png': (png) => {
        drawShadow(png, 128, 224, 74, 18);
        // Matte Black Modern Chassis
        drawBevelBox(png, 78, 95, 100, 122, '#64748b', '#1e293b', '#0f172a', '#020617');
        // Transparent Tinted Bean Hopper on Top
        drawBevelBox(png, 84, 42, 88, 56, '#cbd5e1', '#64748b', '#334155', '#020617');
        // Whole Roasted Coffee Beans inside Hopper
        for (let b = 0; b < 16; b++) {
            drawCoffeeBean(png, 96 + (b % 4) * 18, 52 + Math.floor(b / 4) * 11, 5, b * 0.7);
        }
        // Hopper Lid with Finger Grip
        drawBevelBox(png, 80, 32, 96, 12, '#334155', '#1e293b', '#0f172a', '#000000');
        fillRect(png, 120, 26, 16, 6, hexToRgba('#64748b'));
        // Stepped Micrometric Grind Collar with Silver Ticks
        drawBevelBox(png, 74, 92, 108, 14, '#94a3b8', '#64748b', '#334155', '#0f172a');
        for (let s = 80; s < 176; s += 6) {
            fillRect(png, s, 94, 2, 8, hexToRgba('#ffffff'));
        }
        // Portafilter Dispensing Cradle & Catch Bin
        drawBevelBox(png, 94, 135, 68, 58, '#0f172a', '#020617', '#020617', '#000000');
        drawBevelBox(png, 104, 150, 48, 38, '#e2e8f0', '#94a3b8', '#475569', '#0f172a');
        // Illuminated Cyan Power Switch
        fillCircle(png, 128, 120, 8, hexToRgba('#00ffcc'));
        fillCircle(png, 128, 120, 4, hexToRgba('#ffffff'));
    },

    // 6. Grinder Level 3: Titanium Flat Burr Laser Mill
    'upg_grinder_3.png': (png) => {
        drawShadow(png, 128, 226, 78, 19);
        // Machined Aerospace Silver & Titanium Cylinder
        drawBevelBox(png, 72, 75, 112, 144, '#ffffff', '#cbd5e1', '#64748b', '#0f172a');
        // Smoked Aluminum Single-Dose Hopper with Walnut Bellows Cap
        drawBevelBox(png, 82, 35, 92, 44, '#94a3b8', '#475569', '#1e293b', '#020617');
        drawBevelBox(png, 78, 25, 100, 14, '#d97706', '#92400e', '#713f12', '#451a03'); // Wooden cap
        // Giant Knurled Micrometric Dial with Cyan LED Ring
        fillCircle(png, 128, 118, 28, hexToRgba('#00ffcc'));
        fillCircle(png, 128, 118, 24, hexToRgba('#0f172a'));
        fillCircle(png, 128, 118, 14, hexToRgba('#cbd5e1'));
        for (let d = 0; d < 8; d++) {
            const angle = d * (Math.PI / 4);
            const px = 128 + Math.cos(angle) * 19;
            const py = 118 + Math.sin(angle) * 19;
            setPixel(png, px, py, [255, 255, 255, 255]);
        }
        // Digital OLED Micron Readout Screen
        drawBevelBox(png, 88, 156, 80, 20, '#020617', '#082f49', '#020617', '#000000');
        fillRect(png, 96, 162, 64, 8, hexToRgba('#38bdf8')); // 180 um • 1400 RPM
        // Billet Aluminum Solid Base Foot & Portafilter Fork
        drawBevelBox(png, 64, 210, 128, 18, '#ffffff', '#cbd5e1', '#475569', '#0f172a');
        drawBevelBox(png, 108, 184, 40, 28, '#475569', '#1e293b', '#0f172a', '#000000');
    },

    // 7. Terminal Level 1: Vintage Coin Tin
    'upg_terminal_1.png': (png) => {
        drawShadow(png, 128, 222, 72, 17);
        // Round Metal Biscuit/Coffee Tin
        drawBevelBox(png, 66, 110, 124, 102, '#f87171', '#dc2626', '#991b1b', '#450a0a');
        // Vintage Gold Filigree Trim Border
        strokeRect(png, 72, 116, 112, 90, hexToRgba('#fde047'), 2);
        // Aged Parchment Paper Label "CASH"
        drawBevelBox(png, 78, 142, 100, 42, '#fef08a', '#facc15', '#ca8a04', '#713f12');
        fillRect(png, 90, 155, 76, 12, hexToRgba('#713f12'));
        // Overflowing Shiny Gold & Silver Coins
        for (let c = 0; c < 14; c++) {
            const cx = 80 + (c % 6) * 18;
            const cy = 94 + Math.floor(c / 6) * 12;
            const isGold = (c % 2 === 0);
            fillCircle(png, cx, cy, 9, hexToRgba(isGold ? '#fde047' : '#ffffff'));
            fillCircle(png, cx, cy, 7, hexToRgba(isGold ? '#eab308' : '#94a3b8'));
            fillCircle(png, cx - 1, cy - 1, 3, hexToRgba('#ffffff'));
        }
        // Rolled Dollar Bills with Rubber Band
        drawBevelBox(png, 146, 78, 36, 28, '#86efac', '#22c55e', '#15803d', '#14532d');
        fillRect(png, 160, 78, 6, 28, hexToRgba('#f97316')); // orange rubber band
    },

    // 8. Terminal Level 3: Web3 Crypto QR Terminal
    'upg_terminal_3.png': (png) => {
        drawShadow(png, 128, 226, 78, 19);
        // Heavy Angled Desktop POS Stand
        drawBevelBox(png, 96, 172, 64, 48, '#475569', '#1e293b', '#0f172a', '#020617');
        // Sleek Bezel-less Tablet Terminal
        drawBevelBox(png, 56, 50, 144, 132, '#94a3b8', '#1e293b', '#0f172a', '#000000');
        // Vibrant Glass Display Screen
        drawBevelBox(png, 64, 58, 128, 116, '#082f49', '#0369a1', '#0c4a6e', '#020617');
        // Large High-Contrast White QR Code Plaque
        drawBevelBox(png, 94, 76, 68, 68, '#ffffff', '#ffffff', '#ffffff', '#000000');
        // Realistic QR Code Matrix Pattern
        for (let qy = 0; qy < 9; qy++) {
            for (let qx = 0; qx < 9; qx++) {
                const isCornerBox = (qx < 3 && qy < 3) || (qx > 5 && qy < 3) || (qx < 3 && qy > 5);
                const isCenterDot = (qx === 1 && qy === 1) || (qx === 7 && qy === 1) || (qx === 1 && qy === 7);
                if (isCenterDot || (isCornerBox && (qx === 0 || qx === 2 || qx === 6 || qx === 8 || qy === 0 || qy === 2 || qy === 6 || qy === 8)) || ((qx + qy) % 2 === 0 && !isCornerBox)) {
                    fillRect(png, 98 + qx * 7, 80 + qy * 7, 6, 6, hexToRgba('#020617'));
                }
            }
        }
        // USDC & Ethereum Token Badges
        fillCircle(png, 80, 150, 10, hexToRgba('#2775ca')); // USDC Blue
        fillCircle(png, 80, 150, 7, hexToRgba('#ffffff'));
        fillCircle(png, 176, 150, 10, hexToRgba('#627eea')); // ETH Purple
        fillCircle(png, 176, 150, 7, hexToRgba('#ffffff'));
        // Contactless NFC Radiating Waves
        strokeCircle(png, 128, 64, 8, hexToRgba('#00ffcc'), 2);
        strokeCircle(png, 128, 64, 14, hexToRgba('#00ffcc', 140), 2);
    },

    // 9. Canopy Level 1: Open Stand (No Canopy)
    'upg_canopy_1.png': (png) => {
        drawShadow(png, 128, 222, 78, 18);
        // 4 Open Timber Stand Posts with Mortise Joints
        drawBevelBox(png, 64, 65, 12, 145, '#d97706', '#92400e', '#78350f', '#451a03');
        drawBevelBox(png, 180, 65, 12, 145, '#d97706', '#92400e', '#78350f', '#451a03');
        // Open roof connector frame without fabric awning
        drawBevelBox(png, 60, 60, 136, 12, '#f59e0b', '#b45309', '#78350f', '#451a03');
        // Hanging Rustic Wooden Sign reading "OPEN STAND"
        drawBevelBox(png, 82, 78, 92, 32, '#fef08a', '#facc15', '#a16207', '#713f12');
        fillRect(png, 92, 90, 72, 8, hexToRgba('#451a03'));
        // Iron chains holding sign
        fillRect(png, 96, 68, 2, 12, hexToRgba('#1e293b'));
        fillRect(png, 158, 68, 2, 12, hexToRgba('#1e293b'));
        // Cart counter body with cup
        drawBevelBox(png, 56, 170, 144, 45, '#b45309', '#78350f', '#451a03', '#271001');
        drawBevelBox(png, 116, 154, 18, 18, '#ffffff', '#cbd5e1', '#64748b', '#0f172a'); // Cup
    },

    // 10. Canopy Level 3: All-Weather Solar Tech Awning
    'upg_canopy_3.png': (png) => {
        drawShadow(png, 128, 226, 86, 20);
        // Industrial Matte Dark Metal Truss Support Posts
        drawBevelBox(png, 54, 85, 14, 125, '#cbd5e1', '#64748b', '#334155', '#0f172a');
        drawBevelBox(png, 188, 85, 14, 125, '#cbd5e1', '#64748b', '#334155', '#0f172a');
        // Waterproof Deep Navy Awning Canopy Body
        drawBevelBox(png, 40, 45, 176, 56, '#1e3a8a', '#172554', '#0f172a', '#020617');
        // Gleaming 24K Polished Gold Scalloped Awning Fringe
        fillRect(png, 40, 96, 176, 10, hexToRgba('#fbbf24'));
        strokeRect(png, 40, 96, 176, 10, hexToRgba('#78350f'), 1);
        for (let s = 40; s < 216; s += 16) {
            fillCircle(png, s + 8, 108, 8, hexToRgba('#fbbf24'));
            strokeCircle(png, s + 8, 108, 8, hexToRgba('#78350f'), 1);
        }
        // 4 Photovoltaic Solar Panels on Roof with Cyan Grid
        for (let p = 50; p < 200; p += 36) {
            drawBevelBox(png, p, 52, 30, 36, '#38bdf8', '#0284c7', '#0369a1', '#082f49');
            strokeRect(png, p + 2, 54, 26, 32, hexToRgba('#00ffcc', 140), 1);
            fillRect(p + 2, 70, 26, 1, hexToRgba('#ffffff', 180));
        }
        // Warm Hanging Filament Edison Bulbs with Golden Halo
        for (let b = 70; b < 195; b += 42) {
            fillRect(png, b + 6, 108, 2, 14, hexToRgba('#1e293b'));
            fillCircle(png, b + 7, 126, 10, hexToRgba('#fde047', 80)); // halo
            fillCircle(png, b + 7, 126, 6, hexToRgba('#fde047'));
            fillCircle(png, b + 7, 126, 3, hexToRgba('#ffffff'));
        }
    },

    // 11. Marketing Level 1: Word of Mouth
    'upg_marketing_1.png': (png) => {
        drawShadow(png, 128, 222, 64, 16);
        // Wooden Directional Fingerpost in Cobblestones
        drawBevelBox(png, 122, 80, 14, 135, '#b45309', '#78350f', '#451a03', '#271001');
        // Pointing Arrow Signs
        drawBevelBox(png, 54, 95, 115, 26, '#f59e0b', '#d97706', '#92400e', '#451a03');
        drawBevelBox(png, 90, 130, 115, 26, '#fef08a', '#facc15', '#a16207', '#713f12');
        fillRect(png, 70, 104, 75, 7, hexToRgba('#451a03'));
        fillRect(png, 106, 139, 75, 7, hexToRgba('#451a03'));
        // Floating Whimsical Pixel Speech Bubbles
        fillCircle(png, 74, 60, 20, hexToRgba('#38bdf8'));
        fillCircle(png, 74, 60, 16, hexToRgba('#ffffff'));
        fillRect(png, 68, 56, 14, 8, hexToRgba('#0284c7'));
        fillCircle(png, 182, 68, 18, hexToRgba('#22c55e'));
        fillCircle(png, 182, 68, 14, hexToRgba('#ffffff'));
        fillRect(png, 176, 64, 12, 7, hexToRgba('#15803d'));
    },

    // 12. Marketing Level 2: Chalkboard & Street Flyers
    'upg_marketing_2.png': (png) => {
        drawShadow(png, 128, 224, 74, 17);
        // Wooden A-Frame Stand
        drawBevelBox(png, 60, 60, 14, 155, '#d97706', '#92400e', '#78350f', '#451a03');
        drawBevelBox(png, 182, 60, 14, 155, '#d97706', '#92400e', '#78350f', '#451a03');
        // Black Chalkboard Face
        drawBevelBox(png, 72, 70, 112, 130, '#334155', '#0f172a', '#020617', '#000000');
        // Chalk Drawing of Coffee Mug with Steam Swirls
        drawBevelBox(png, 102, 115, 42, 34, '#ffffff', '#ffffff', '#ffffff', '#94a3b8');
        fillCircle(png, 148, 128, 9, hexToRgba('#ffffff'));
        fillCircle(png, 148, 128, 5, hexToRgba('#0f172a'));
        strokeRect(png, 112, 90, 4, 20, hexToRgba('#fde047'), 2);
        strokeRect(png, 126, 86, 4, 24, hexToRgba('#fde047'), 2);
        // Chalk Headline "HOT COFFEE"
        fillRect(png, 84, 80, 88, 6, hexToRgba('#38bdf8'));
        // Colorful Flyers Pinned to Legs
        drawBevelBox(png, 48, 105, 18, 28, '#f43f5e', '#e11d48', '#be123c', '#881337');
        drawBevelBox(png, 48, 140, 18, 28, '#facc15', '#eab308', '#ca8a04', '#713f12');
    },

    // 13. Marketing Level 3: Glowing Neon Stand Sign
    'upg_marketing_3.png': (png) => {
        drawShadow(png, 128, 226, 78, 18);
        // Dark Metal Chassis Frame
        drawBevelBox(png, 52, 50, 152, 155, '#334155', '#0f172a', '#020617', '#000000');
        // Vibrant Neon Magenta Outer Border Glow
        strokeRect(png, 60, 58, 136, 139, hexToRgba('#f43f5e', 80), 4);
        strokeRect(png, 62, 60, 132, 135, hexToRgba('#f43f5e'), 3);
        // Cyan Neon Steaming Coffee Mug
        drawBevelBox(png, 94, 115, 56, 44, '#00ffcc', '#00ffcc', '#00ffcc', '#0891b2');
        fillCircle(png, 154, 132, 14, hexToRgba('#00ffcc'));
        fillCircle(png, 154, 132, 7, hexToRgba('#0f172a'));
        // Neon Amber Steam Curles
        strokeRect(png, 106, 80, 6, 28, hexToRgba('#fde047'), 3);
        strokeRect(png, 124, 75, 6, 33, hexToRgba('#fde047'), 3);
        // Neon Cursive "COFFEE" Glow Header
        fillRect(png, 72, 168, 102, 10, hexToRgba('#38bdf8'));
        fillRect(png, 74, 170, 98, 6, hexToRgba('#ffffff'));
    },

    // 14. Marketing Level 4: Viral Crypto & Social Blitz
    'upg_marketing_4.png': (png) => {
        drawShadow(png, 128, 226, 78, 19);
        // High-Tech Broadcasting Drone in Flight
        drawBevelBox(png, 96, 40, 64, 24, '#cbd5e1', '#64748b', '#334155', '#0f172a');
        fillCircle(png, 88, 46, 14, hexToRgba('#00ffcc')); // Rotor L
        fillCircle(png, 168, 46, 14, hexToRgba('#00ffcc')); // Rotor R
        // Hologram Projection Light Cone
        for (let y = 64; y < 195; y++) {
            const spread = Math.round((y - 64) * 0.48);
            fillRect(png, 128 - spread, y, spread * 2, 1, hexToRgba('#38bdf8', 35));
        }
        // Floating Holographic Smartphone Frame
        drawBevelBox(png, 72, 80, 112, 120, '#38bdf8', '#0284c7', '#0369a1', '#00ffcc');
        // Live Stream Badge
        fillRect(png, 80, 90, 96, 16, hexToRgba('#f43f5e'));
        // Floating Hearts & Rocket
        fillCircle(png, 98, 130, 14, hexToRgba('#f59e0b')); // Rocket
        fillCircle(png, 152, 122, 12, hexToRgba('#ec4899')); // Heart
        fillCircle(png, 144, 150, 14, hexToRgba('#ec4899')); // Heart
        fillRect(png, 86, 168, 86, 6, hexToRgba('#ffffff'));
        fillRect(png, 86, 178, 60, 6, hexToRgba('#38bdf8'));
    },

    // 15. Decor Level 1: Rustic Timber Cart
    'upg_decor_1.png': (png) => {
        drawShadow(png, 128, 224, 78, 18);
        // Warm Horizontal Pine Planks Counter
        drawBevelBox(png, 56, 100, 144, 80, '#f59e0b', '#d97706', '#92400e', '#451a03');
        for (let y = 114; y < 175; y += 14) {
            fillRect(png, 56, y, 144, 2, hexToRgba('#78350f'));
        }
        // Burlap Sack of Arabica Beans
        drawBevelBox(png, 158, 115, 34, 48, '#ca8a04', '#a16207', '#713f12', '#451a03');
        drawCoffeeBean(png, 175, 138, 8, 0.4);
        // Heavy Wooden Spoke Wagon Wheels
        fillCircle(png, 82, 192, 26, hexToRgba('#78350f'));
        fillCircle(png, 82, 192, 20, hexToRgba('#b45309'));
        fillCircle(png, 82, 192, 7, hexToRgba('#451a03'));
        fillCircle(png, 174, 192, 26, hexToRgba('#78350f'));
        fillCircle(png, 174, 192, 20, hexToRgba('#b45309'));
        fillCircle(png, 174, 192, 7, hexToRgba('#451a03'));
    },

    // 16. Decor Level 2: Artisan Mahogany & Brass Stand
    'upg_decor_2.png': (png) => {
        drawShadow(png, 128, 226, 82, 19);
        // Rich Deep Mahogany Counter with Gloss Highlights
        drawBevelBox(png, 52, 95, 152, 88, '#991b1b', '#7f1d1d', '#450a0a', '#180303');
        // Gleaming Polished Brass Corner Brackets & Trim
        fillRect(png, 50, 93, 156, 9, hexToRgba('#fde047'));
        fillRect(png, 50, 93, 12, 90, hexToRgba('#fde047'));
        fillRect(png, 194, 93, 12, 90, hexToRgba('#fde047'));
        fillRect(png, 50, 174, 156, 7, hexToRgba('#fde047'));
        // Brass Hubcap Wheels
        fillCircle(png, 82, 195, 26, hexToRgba('#450a0a'));
        fillCircle(png, 82, 195, 20, hexToRgba('#7f1d1d'));
        fillCircle(png, 82, 195, 9, hexToRgba('#fde047'));
        fillCircle(png, 174, 195, 26, hexToRgba('#450a0a'));
        fillCircle(png, 174, 195, 20, hexToRgba('#7f1d1d'));
        fillCircle(png, 174, 195, 9, hexToRgba('#fde047'));
    },

    // 17. Decor Level 3: Cyber Gold & Neon Boutique Cart
    'upg_decor_3.png': (png) => {
        drawShadow(png, 128, 226, 84, 20);
        // Matte Obsidian Body
        drawBevelBox(png, 52, 90, 152, 94, '#334155', '#0f172a', '#020617', '#000000');
        // 24K Gold Geometric Art Deco Inlay Borders
        strokeRect(png, 56, 94, 144, 86, hexToRgba('#fbbf24'), 4);
        strokeRect(png, 66, 104, 124, 66, hexToRgba('#f59e0b'), 2);
        // Glowing Neon Cyan Ground Undercarriage Glow
        fillRect(png, 60, 182, 136, 8, hexToRgba('#00ffcc'));
        fillRect(png, 66, 185, 124, 10, hexToRgba('#00ffcc', 140));
        // Futuristic Turbine Wheels
        fillCircle(png, 82, 195, 26, hexToRgba('#0f172a'));
        fillCircle(png, 82, 195, 20, hexToRgba('#00ffcc'));
        fillCircle(png, 82, 195, 9, hexToRgba('#fbbf24'));
        fillCircle(png, 174, 195, 26, hexToRgba('#0f172a'));
        fillCircle(png, 174, 195, 20, hexToRgba('#00ffcc'));
        fillCircle(png, 174, 195, 9, hexToRgba('#fbbf24'));
    }
};

const assetsDir = path.join(__dirname, '..', 'assets');
let updatedCount = 0;

Object.entries(generators).forEach(([filename, genFn]) => {
    const png = createPixelCanvas(256, 256);
    genFn(png);
    const outPath = path.join(assetsDir, filename);
    fs.writeFileSync(outPath, PNG.sync.write(png));
    updatedCount++;
    console.log(`✓ Rich Pixel Art Generated [${updatedCount}/17]: ${filename}`);
});

console.log(`\n✅ ALL 17 RICH PIXEL ART PORTRAITS GENERATED SUCCESSFULLY!`);
