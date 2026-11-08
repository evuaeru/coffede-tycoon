const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

function createPixelCanvas(w = 256, h = 256) {
    const png = new PNG({ width: w, height: h });
    png.data.fill(0); // All transparent RGBA(0,0,0,0)
    return png;
}

function hexToRgba(hex, alpha = 255) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const num = parseInt(hex, 16);
    return [
        (num >> 16) & 255,
        (num >> 8) & 255,
        num & 255,
        alpha
    ];
}

function setPixel(png, x, y, rgba) {
    if (x < 0 || x >= png.width || y < 0 || y >= png.height) return;
    const idx = (y * png.width + x) * 4;
    const [r, g, b, a] = rgba;
    if (a === 255) {
        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = a;
    } else {
        const srcA = a / 255;
        const dstA = png.data[idx + 3] / 255;
        const outA = srcA + dstA * (1 - srcA);
        if (outA > 0) {
            png.data[idx] = Math.round((r * srcA + png.data[idx] * dstA * (1 - srcA)) / outA);
            png.data[idx + 1] = Math.round((g * srcA + png.data[idx + 1] * dstA * (1 - srcA)) / outA);
            png.data[idx + 2] = Math.round((b * srcA + png.data[idx + 2] * dstA * (1 - srcA)) / outA);
            png.data[idx + 3] = Math.round(outA * 255);
        }
    }
}

function fillRect(png, x, y, w, h, rgba) {
    for (let py = Math.floor(y); py < Math.floor(y + h); py++) {
        for (let px = Math.floor(x); px < Math.floor(x + w); px++) {
            setPixel(png, px, py, rgba);
        }
    }
}

function strokeRect(png, x, y, w, h, rgba, thickness = 1) {
    fillRect(png, x, y, w, thickness, rgba);
    fillRect(png, x, y + h - thickness, w, thickness, rgba);
    fillRect(png, x, y, thickness, h, rgba);
    fillRect(png, x + w - thickness, y, thickness, h, rgba);
}

function drawBevelBox(png, x, y, w, h, topColor, mainColor, botColor, outlineColor) {
    if (outlineColor) {
        fillRect(png, x - 2, y - 2, w + 4, h + 4, hexToRgba(outlineColor));
    }
    fillRect(png, x, y, w, h, hexToRgba(mainColor));
    // Top & left highlight
    fillRect(png, x, y, w, 3, hexToRgba(topColor));
    fillRect(png, x, y, 3, h, hexToRgba(topColor));
    // Bottom & right shadow
    fillRect(png, x, y + h - 3, w, 3, hexToRgba(botColor));
    fillRect(png, x + w - 3, y, 3, h, hexToRgba(botColor));
}

function fillCircle(png, cx, cy, radius, rgba) {
    const r2 = radius * radius;
    for (let py = Math.floor(cy - radius); py <= Math.ceil(cy + radius); py++) {
        for (let px = Math.floor(cx - radius); px <= Math.ceil(cx + radius); px++) {
            const dx = px - cx;
            const dy = py - cy;
            if (dx * dx + dy * dy <= r2) {
                setPixel(png, px, py, rgba);
            }
        }
    }
}

function drawShadow(png, cx, cy, rx, ry) {
    for (let py = Math.floor(cy - ry); py <= Math.ceil(cy + ry); py++) {
        for (let px = Math.floor(cx - rx); px <= Math.ceil(cx + rx); px++) {
            const dx = (px - cx) / rx;
            const dy = (py - cy) / ry;
            if (dx * dx + dy * dy <= 1.0) {
                const alpha = Math.round(110 * (1 - (dx * dx + dy * dy) * 0.6));
                setPixel(png, px, py, [15, 23, 42, alpha]);
            }
        }
    }
}

// -------------------------------------------------------------
// 18 ITEM GENERATORS
// -------------------------------------------------------------
const generators = {
    // 1. Machine Level 4: Cyberpunk Web3 Smart Brewer
    'upg_machine_4.png': (png) => {
        drawShadow(png, 128, 224, 75, 18);
        // Main Body (Dark Titanium & Chrome)
        drawBevelBox(png, 64, 60, 128, 150, '#94a3b8', '#1e293b', '#0f172a', '#020617');
        // Neon cyan accents & pipes
        fillRect(png, 60, 80, 10, 100, hexToRgba('#06b6d4'));
        fillRect(png, 186, 80, 10, 100, hexToRgba('#a855f7'));
        strokeRect(png, 58, 78, 14, 104, hexToRgba('#083344'), 2);
        strokeRect(png, 184, 78, 14, 104, hexToRgba('#3b0764'), 2);
        // Digital OLED screen
        drawBevelBox(png, 84, 80, 88, 44, '#38bdf8', '#0369a1', '#082f49', '#020617');
        // Matrix graph / UI lines
        fillRect(png, 92, 92, 72, 4, hexToRgba('#38bdf8'));
        fillRect(png, 92, 104, 48, 4, hexToRgba('#00ffcc'));
        fillRect(png, 92, 114, 64, 4, hexToRgba('#f43f5e'));
        // High-tech Dual Dispenser Spouts
        drawBevelBox(png, 96, 134, 28, 30, '#cbd5e1', '#64748b', '#334155', '#020617');
        drawBevelBox(png, 132, 134, 28, 30, '#cbd5e1', '#64748b', '#334155', '#020617');
        // Glowing cyan energy core
        fillCircle(png, 128, 180, 12, hexToRgba('#00ffcc'));
        fillCircle(png, 128, 180, 6, hexToRgba('#ffffff'));
        // Drip tray & chrome grate
        drawBevelBox(png, 72, 195, 112, 18, '#e2e8f0', '#94a3b8', '#475569', '#020617');
        for (let i = 80; i < 176; i += 6) {
            fillRect(png, i, 198, 3, 12, hexToRgba('#1e293b'));
        }
    },

    // 2. Cooler Level 1: Cardboard Box Cooler
    'upg_cooler_1.png': (png) => {
        drawShadow(png, 128, 222, 72, 16);
        // Corrugated Cardboard Box
        drawBevelBox(png, 60, 100, 136, 115, '#d97706', '#b45309', '#78350f', '#451a03');
        // Open Box Flaps
        drawBevelBox(png, 46, 75, 40, 30, '#f59e0b', '#d97706', '#92400e', '#451a03');
        drawBevelBox(png, 170, 75, 40, 30, '#f59e0b', '#d97706', '#92400e', '#451a03');
        // Packing Tape
        fillRect(png, 122, 100, 12, 115, hexToRgba('#fde047', 220));
        // Styrofoam inner liner
        drawBevelBox(png, 70, 85, 116, 25, '#f8fafc', '#e2e8f0', '#cbd5e1', '#475569');
        // Ice Cubes inside
        drawBevelBox(png, 80, 72, 22, 20, '#e0f2fe', '#bae6fd', '#7dd3fc', '#0369a1');
        drawBevelBox(png, 104, 68, 24, 22, '#e0f2fe', '#bae6fd', '#7dd3fc', '#0369a1');
        drawBevelBox(png, 130, 74, 22, 20, '#e0f2fe', '#bae6fd', '#7dd3fc', '#0369a1');
        // Milk bottle standing in ice
        drawBevelBox(png, 142, 50, 24, 45, '#ffffff', '#f1f5f9', '#cbd5e1', '#334155');
        drawBevelBox(png, 147, 40, 14, 12, '#38bdf8', '#0284c7', '#0369a1', '#082f49');
        fillRect(png, 146, 65, 16, 14, hexToRgba('#38bdf8')); // blue milk label
    },

    // 3. Cooler Level 2: Insulated Ice Chest
    'upg_cooler_2.png': (png) => {
        drawShadow(png, 128, 224, 76, 17);
        // Blue Cooler Tub
        drawBevelBox(png, 56, 105, 144, 110, '#38bdf8', '#0284c7', '#075985', '#0c4a6e');
        // White Lid
        drawBevelBox(png, 50, 72, 156, 35, '#ffffff', '#e2e8f0', '#94a3b8', '#334155');
        // Red Handles on sides
        drawBevelBox(png, 38, 125, 18, 30, '#f87171', '#ef4444', '#b91c1c', '#7f1d1d');
        drawBevelBox(png, 200, 125, 18, 30, '#f87171', '#ef4444', '#b91c1c', '#7f1d1d');
        // Chrome Latch & Drain Cap
        drawBevelBox(png, 120, 98, 16, 20, '#f1f5f9', '#94a3b8', '#64748b', '#0f172a');
        drawBevelBox(png, 178, 180, 14, 14, '#ef4444', '#dc2626', '#991b1b', '#450a0a');
        // Vintage embossed brand ribbing
        fillRect(png, 70, 140, 116, 4, hexToRgba('#0369a1'));
        fillRect(png, 70, 155, 116, 4, hexToRgba('#0369a1'));
        fillRect(png, 70, 170, 116, 4, hexToRgba('#0369a1'));
    },

    // 4. Cooler Level 4: Cryo-Freezer Unit
    'upg_cooler_4.png': (png) => {
        drawShadow(png, 128, 226, 70, 18);
        // Heavy Industrial Upright Chassis
        drawBevelBox(png, 65, 45, 126, 175, '#f1f5f9', '#94a3b8', '#475569', '#0f172a');
        // Frosted Glass Door Panel
        drawBevelBox(png, 77, 65, 102, 140, '#e0f2fe', '#bae6fd', '#7dd3fc', '#0369a1');
        // Digital Frost LED Display Header
        drawBevelBox(png, 85, 50, 86, 12, '#0f172a', '#020617', '#020617', '#000000');
        fillRect(png, 105, 53, 46, 6, hexToRgba('#00ffcc')); // -18°C Cryo Active
        // Frost ice crystals & cold steam
        for (let i = 0; i < 6; i++) {
            fillCircle(png, 90 + i * 14, 85 + (i % 3) * 20, 6, hexToRgba('#ffffff', 180));
        }
        // Heavy Chrome Latch Handle
        drawBevelBox(png, 166, 105, 10, 45, '#ffffff', '#cbd5e1', '#64748b', '#0f172a');
        // Base ventilation compressor grill
        for (let y = 190; y < 212; y += 4) {
            fillRect(png, 80, y, 96, 2, hexToRgba('#1e293b'));
        }
    },

    // 5. Grinder Level 1: Hand Crank Grinder
    'upg_grinder_1.png': (png) => {
        drawShadow(png, 128, 220, 65, 16);
        // Polished Wooden Box Base
        drawBevelBox(png, 75, 110, 106, 100, '#d97706', '#92400e', '#713f12', '#451a03');
        // Pull-out drawer with brass knob
        drawBevelBox(png, 88, 145, 80, 50, '#b45309', '#78350f', '#451a03', '#271001');
        fillCircle(png, 128, 170, 7, hexToRgba('#fde047')); // Brass knob
        fillCircle(png, 128, 170, 4, hexToRgba('#ffffff'));
        // Cast Iron Hopper Top
        drawBevelBox(png, 92, 80, 72, 32, '#64748b', '#334155', '#1e293b', '#020617');
        fillCircle(png, 128, 80, 36, hexToRgba('#334155'));
        // Coffee Beans inside hopper
        for (let b = 0; b < 8; b++) {
            fillCircle(png, 108 + (b % 4) * 12, 70 + Math.floor(b / 4) * 10, 5, hexToRgba('#451a03'));
        }
        // Cast Iron Crank Shaft & Handle
        fillRect(png, 124, 45, 8, 35, hexToRgba('#1e293b'));
        fillRect(png, 124, 45, 55, 6, hexToRgba('#475569'));
        // Wooden turning knob
        drawBevelBox(png, 172, 35, 16, 26, '#f59e0b', '#b45309', '#78350f', '#451a03');
    },

    // 6. Grinder Level 2: Conical Burr Grinder
    'upg_grinder_2.png': (png) => {
        drawShadow(png, 128, 224, 68, 17);
        // Matte Black Body
        drawBevelBox(png, 82, 100, 92, 115, '#64748b', '#1e293b', '#0f172a', '#020617');
        // Transparent Tinted Bean Hopper on Top
        drawBevelBox(png, 88, 48, 80, 54, '#cbd5e1', '#64748b', '#334155', '#020617');
        // Dark Roasted Coffee Beans in Hopper
        for (let i = 0; i < 14; i++) {
            fillCircle(png, 98 + (i % 5) * 12, 58 + Math.floor(i / 5) * 10, 5, hexToRgba('#3f1d0b'));
            fillCircle(png, 98 + (i % 5) * 12, 58 + Math.floor(i / 5) * 10, 2, hexToRgba('#78350f'));
        }
        // Hopper Lid
        drawBevelBox(png, 82, 38, 92, 12, '#334155', '#1e293b', '#0f172a', '#000000');
        // Grind Size Stepper Ring
        drawBevelBox(png, 80, 96, 96, 12, '#94a3b8', '#64748b', '#334155', '#0f172a');
        for (let s = 86; s < 170; s += 8) {
            fillRect(png, s, 98, 2, 8, hexToRgba('#f8fafc'));
        }
        // Portafilter Dispensing Cradle & Chrome Switch
        drawBevelBox(png, 98, 140, 60, 48, '#0f172a', '#020617', '#020617', '#000000');
        fillCircle(png, 128, 125, 8, hexToRgba('#38bdf8')); // Glow power button
        fillCircle(png, 128, 125, 4, hexToRgba('#ffffff'));
    },

    // 7. Grinder Level 3: Titanium Flat Burr Laser Mill
    'upg_grinder_3.png': (png) => {
        drawShadow(png, 128, 226, 75, 18);
        // Polished Chrome & Brushed Titanium Cylinder
        drawBevelBox(png, 75, 80, 106, 138, '#ffffff', '#cbd5e1', '#64748b', '#0f172a');
        // Smoked Aluminum Hopper
        drawBevelBox(png, 85, 40, 86, 42, '#94a3b8', '#475569', '#1e293b', '#020617');
        fillCircle(png, 128, 38, 43, hexToRgba('#cbd5e1'));
        // Laser Precision Micrometric Dial with Cyan LED Ring
        fillCircle(png, 128, 120, 24, hexToRgba('#00ffcc'));
        fillCircle(png, 128, 120, 20, hexToRgba('#0f172a'));
        fillCircle(png, 128, 120, 10, hexToRgba('#94a3b8'));
        // Digital RPM and micron readout
        drawBevelBox(png, 94, 155, 68, 18, '#020617', '#082f49', '#020617', '#000000');
        fillRect(png, 102, 161, 52, 6, hexToRgba('#38bdf8')); // Micron 180um
        // Heavy duty base foot
        drawBevelBox(png, 68, 208, 120, 16, '#e2e8f0', '#94a3b8', '#475569', '#020617');
    },

    // 8. Terminal Level 1: Vintage Coin Tin
    'upg_terminal_1.png': (png) => {
        drawShadow(png, 128, 220, 68, 16);
        // Round Metal Cookie/Money Tin
        drawBevelBox(png, 70, 115, 116, 95, '#f87171', '#dc2626', '#991b1b', '#450a0a');
        // Decorative Vintage Label
        drawBevelBox(png, 82, 140, 92, 45, '#fef08a', '#facc15', '#ca8a04', '#713f12');
        fillRect(png, 92, 155, 72, 8, hexToRgba('#713f12')); // Text "TIPS & CASH"
        // Silver & Gold Coins spilling over top
        for (let c = 0; c < 10; c++) {
            const cx = 86 + (c % 5) * 18;
            const cy = 100 + Math.floor(c / 5) * 14;
            fillCircle(png, cx, cy, 9, (c % 2 === 0) ? hexToRgba('#fde047') : hexToRgba('#e2e8f0'));
            fillCircle(png, cx, cy, 7, (c % 2 === 0) ? hexToRgba('#eab308') : hexToRgba('#94a3b8'));
        }
        // Rolled Dollar Bills with Rubber Band
        drawBevelBox(png, 150, 85, 30, 24, '#86efac', '#22c55e', '#15803d', '#14532d');
        fillRect(png, 162, 85, 6, 24, hexToRgba('#f97316')); // orange rubber band
    },

    // 9. Terminal Level 3: Web3 Crypto QR Terminal
    'upg_terminal_3.png': (png) => {
        drawShadow(png, 128, 224, 74, 18);
        // Heavy Angled Desktop POS Stand
        drawBevelBox(png, 100, 175, 56, 45, '#475569', '#1e293b', '#0f172a', '#020617');
        // Sleek Tablet Terminal Housing
        drawBevelBox(png, 60, 55, 136, 125, '#94a3b8', '#1e293b', '#0f172a', '#000000');
        // Glowing Neon Display Screen
        drawBevelBox(png, 68, 63, 120, 108, '#082f49', '#0369a1', '#0c4a6e', '#020617');
        // Prominent Cyan QR Code in Center
        drawBevelBox(png, 98, 80, 60, 60, '#ffffff', '#ffffff', '#ffffff', '#000000');
        // QR Code pixel pattern
        for (let qy = 0; qy < 8; qy++) {
            for (let qx = 0; qx < 8; qx++) {
                if ((qx + qy) % 2 === 0 || (qx < 3 && qy < 3) || (qx > 4 && qy < 3) || (qx < 3 && qy > 4)) {
                    fillRect(png, 102 + qx * 6, 84 + qy * 6, 5, 5, hexToRgba('#020617'));
                }
            }
        }
        // USDC & ETH badges
        fillCircle(png, 82, 148, 8, hexToRgba('#2775ca')); // USDC Blue
        fillCircle(png, 174, 148, 8, hexToRgba('#627eea')); // ETH Purple
        // Contactless Tap waves
        strokeRect(png, 116, 68, 24, 8, hexToRgba('#00ffcc'), 2);
    },

    // 10. Canopy Level 1: Open Stand (No Canopy)
    'upg_canopy_1.png': (png) => {
        drawShadow(png, 128, 220, 75, 17);
        // 4 Open Wooden Cart Corner Posts (No Awning)
        drawBevelBox(png, 68, 70, 10, 140, '#d97706', '#92400e', '#78350f', '#451a03');
        drawBevelBox(png, 178, 70, 10, 140, '#d97706', '#92400e', '#78350f', '#451a03');
        // Open roof connector frame
        drawBevelBox(png, 64, 66, 128, 10, '#f59e0b', '#b45309', '#78350f', '#451a03');
        // Hanging wooden stand name board
        drawBevelBox(png, 85, 82, 86, 28, '#fef08a', '#facc15', '#a16207', '#713f12');
        fillRect(png, 95, 94, 66, 6, hexToRgba('#451a03')); // "OPEN STAND"
        // Cart Base outline
        drawBevelBox(png, 60, 170, 136, 45, '#b45309', '#78350f', '#451a03', '#271001');
    },

    // 11. Canopy Level 3: All-Weather Solar Tech Awning
    'upg_canopy_3.png': (png) => {
        drawShadow(png, 128, 226, 82, 19);
        // Heavy Sturdy Metal Truss Posts
        drawBevelBox(png, 60, 90, 12, 120, '#cbd5e1', '#64748b', '#334155', '#0f172a');
        drawBevelBox(png, 184, 90, 12, 120, '#cbd5e1', '#64748b', '#334155', '#0f172a');
        // Waterproof Deep Navy Awning Roof
        drawBevelBox(png, 45, 50, 166, 52, '#1e3a8a', '#172554', '#0f172a', '#020617');
        // Gold Geometric Awning Edge & Brass Rain Gutters
        fillRect(png, 45, 98, 166, 8, hexToRgba('#fbbf24'));
        strokeRect(png, 45, 98, 166, 8, hexToRgba('#78350f'), 1);
        // Photovoltaic Solar Panels on roof
        for (let p = 55; p < 195; p += 28) {
            drawBevelBox(png, p, 56, 24, 34, '#38bdf8', '#0284c7', '#0369a1', '#082f49');
            fillRect(png, p + 2, 72, 20, 2, hexToRgba('#ffffff', 180));
        }
        // Warm Hanging Edison Lantern Bulbs under awning
        for (let b = 75; b < 185; b += 35) {
            fillRect(png, b + 5, 106, 2, 12, hexToRgba('#1e293b'));
            fillCircle(png, b + 6, 122, 6, hexToRgba('#fde047'));
            fillCircle(png, b + 6, 122, 3, hexToRgba('#ffffff'));
        }
    },

    // 12. Marketing Level 1: Word of Mouth
    'upg_marketing_1.png': (png) => {
        drawShadow(png, 128, 220, 60, 15);
        // Wooden Directional Signpost
        drawBevelBox(png, 122, 85, 12, 130, '#b45309', '#78350f', '#451a03', '#271001');
        // Direction Arrow Signs
        drawBevelBox(png, 60, 100, 110, 24, '#f59e0b', '#d97706', '#92400e', '#451a03');
        drawBevelBox(png, 90, 135, 110, 24, '#fef08a', '#facc15', '#a16207', '#713f12');
        fillRect(png, 75, 108, 70, 6, hexToRgba('#451a03'));
        fillRect(png, 105, 143, 70, 6, hexToRgba('#451a03'));
        // Speech Bubbles around post
        fillCircle(png, 78, 65, 18, hexToRgba('#38bdf8'));
        fillCircle(png, 78, 65, 14, hexToRgba('#ffffff'));
        fillRect(png, 72, 62, 12, 6, hexToRgba('#0284c7'));
        fillCircle(png, 178, 75, 16, hexToRgba('#22c55e'));
        fillCircle(png, 178, 75, 12, hexToRgba('#ffffff'));
        fillRect(png, 174, 72, 8, 5, hexToRgba('#15803d'));
    },

    // 13. Marketing Level 2: Chalkboard & Street Flyers
    'upg_marketing_2.png': (png) => {
        drawShadow(png, 128, 222, 70, 16);
        // Wooden A-Frame Stand Sides
        drawBevelBox(png, 65, 65, 12, 150, '#d97706', '#92400e', '#78350f', '#451a03');
        drawBevelBox(png, 179, 65, 12, 150, '#d97706', '#92400e', '#78350f', '#451a03');
        // Black Chalkboard Face
        drawBevelBox(png, 77, 75, 102, 125, '#334155', '#0f172a', '#020617', '#000000');
        // Chalk Coffee Cup Drawing in center
        drawBevelBox(png, 105, 120, 36, 28, '#ffffff', '#ffffff', '#ffffff', '#94a3b8');
        fillCircle(png, 142, 130, 8, hexToRgba('#ffffff'));
        fillCircle(png, 142, 130, 4, hexToRgba('#0f172a'));
        // Steaming chalk swirls
        strokeRect(png, 114, 98, 4, 16, hexToRgba('#fde047'), 2);
        strokeRect(png, 126, 95, 4, 18, hexToRgba('#fde047'), 2);
        // Chalk Headline "FRESH COFFEE"
        fillRect(png, 88, 85, 80, 5, hexToRgba('#38bdf8'));
        // Colorful Flyers clipped to side
        drawBevelBox(png, 55, 110, 16, 24, '#f43f5e', '#e11d48', '#be123c', '#881337');
        drawBevelBox(png, 55, 140, 16, 24, '#facc15', '#eab308', '#ca8a04', '#713f12');
    },

    // 14. Marketing Level 3: Glowing Neon Stand Sign
    'upg_marketing_3.png': (png) => {
        drawShadow(png, 128, 224, 76, 17);
        // Black Acrylic Sign Backboard
        drawBevelBox(png, 55, 55, 146, 150, '#334155', '#0f172a', '#020617', '#000000');
        // Pink Neon Border Glow
        strokeRect(png, 63, 63, 130, 134, hexToRgba('#f43f5e', 240), 4);
        strokeRect(png, 61, 61, 134, 138, hexToRgba('#f43f5e', 90), 2);
        // Glowing Cyan Coffee Mug Outline
        drawBevelBox(png, 96, 120, 50, 40, '#00ffcc', '#00ffcc', '#00ffcc', '#06b6d4');
        fillCircle(png, 148, 136, 12, hexToRgba('#00ffcc'));
        fillCircle(png, 148, 136, 6, hexToRgba('#0f172a'));
        // Neon Amber Steam rising from mug
        strokeRect(png, 108, 88, 6, 26, hexToRgba('#fde047'), 3);
        strokeRect(png, 124, 82, 6, 32, hexToRgba('#fde047'), 3);
        // Neon Cursive "COFFEE" Glow
        fillRect(png, 75, 170, 92, 8, hexToRgba('#38bdf8'));
        fillRect(png, 77, 172, 88, 4, hexToRgba('#ffffff'));
    },

    // 15. Marketing Level 4: Viral Crypto & Social Blitz
    'upg_marketing_4.png': (png) => {
        drawShadow(png, 128, 226, 75, 18);
        // Futuristic Projector Drone in Air
        drawBevelBox(png, 100, 45, 56, 22, '#cbd5e1', '#64748b', '#334155', '#0f172a');
        fillCircle(png, 92, 50, 12, hexToRgba('#00ffcc')); // Drone rotor L
        fillCircle(png, 164, 50, 12, hexToRgba('#00ffcc')); // Drone rotor R
        // Holographic Phone Screen Projection Beam
        for (let y = 70; y < 195; y++) {
            const spread = Math.round((y - 70) * 0.45);
            fillRect(png, 128 - spread, y, spread * 2, 1, hexToRgba('#38bdf8', 40));
        }
        // Holographic Smartphone Floating Frame
        drawBevelBox(png, 76, 85, 104, 115, '#38bdf8', '#0284c7', '#0369a1', '#00ffcc');
        // Social Media App UI: Live Stream Viewers & Comments
        fillRect(png, 84, 95, 88, 14, hexToRgba('#f43f5e')); // LIVE 142.8K
        // Viral Rocket emoji & Heart Likes
        fillCircle(png, 100, 135, 12, hexToRgba('#f59e0b')); // Rocket
        fillCircle(png, 150, 125, 10, hexToRgba('#ec4899')); // Heart
        fillCircle(png, 142, 150, 12, hexToRgba('#ec4899')); // Big Heart
        // Text lines of viral comments
        fillRect(png, 88, 165, 80, 5, hexToRgba('#ffffff'));
        fillRect(png, 88, 175, 55, 5, hexToRgba('#38bdf8'));
    },

    // 16. Decor Level 1: Rustic Timber Cart
    'upg_decor_1.png': (png) => {
        drawShadow(png, 128, 224, 76, 17);
        // Natural Pine Wood Cart Counter
        drawBevelBox(png, 60, 105, 136, 75, '#f59e0b', '#d97706', '#92400e', '#451a03');
        // Wooden horizontal plank grooves
        for (let y = 120; y < 175; y += 14) {
            fillRect(png, 60, y, 136, 2, hexToRgba('#78350f'));
        }
        // Burlap Jute Sack of Coffee Beans hanging on side
        drawBevelBox(png, 155, 120, 32, 45, '#ca8a04', '#a16207', '#713f12', '#451a03');
        fillCircle(png, 171, 142, 8, hexToRgba('#451a03')); // Bean print on sack
        // Large Wooden Spoke Cart Wheels
        fillCircle(png, 85, 192, 25, hexToRgba('#78350f'));
        fillCircle(png, 85, 192, 20, hexToRgba('#b45309'));
        fillCircle(png, 85, 192, 6, hexToRgba('#451a03'));
        fillCircle(png, 171, 192, 25, hexToRgba('#78350f'));
        fillCircle(png, 171, 192, 20, hexToRgba('#b45309'));
        fillCircle(png, 171, 192, 6, hexToRgba('#451a03'));
    },

    // 17. Decor Level 2: Artisan Mahogany & Brass Stand
    'upg_decor_2.png': (png) => {
        drawShadow(png, 128, 224, 78, 18);
        // Deep Polished Mahogany Counter
        drawBevelBox(png, 56, 100, 144, 82, '#991b1b', '#7f1d1d', '#450a0a', '#180303');
        // Polished Brass Corner Brackets & Trim
        fillRect(png, 54, 98, 148, 8, hexToRgba('#fde047'));
        fillRect(png, 54, 98, 10, 84, hexToRgba('#fde047'));
        fillRect(png, 192, 98, 10, 84, hexToRgba('#fde047'));
        // Sleek Brass Handrail & Foot Rail
        fillRect(png, 48, 104, 8, 60, hexToRgba('#eab308'));
        fillRect(png, 54, 176, 148, 6, hexToRgba('#fde047'));
        // Spoke Wheels with Brass Hubcaps
        fillCircle(png, 85, 195, 24, hexToRgba('#450a0a'));
        fillCircle(png, 85, 195, 18, hexToRgba('#7f1d1d'));
        fillCircle(png, 85, 195, 8, hexToRgba('#fde047')); // Brass hubcap
        fillCircle(png, 171, 195, 24, hexToRgba('#450a0a'));
        fillCircle(png, 171, 195, 18, hexToRgba('#7f1d1d'));
        fillCircle(png, 171, 195, 8, hexToRgba('#fde047'));
    },

    // 18. Decor Level 3: Cyber Gold & Neon Boutique Cart
    'upg_decor_3.png': (png) => {
        drawShadow(png, 128, 226, 80, 19);
        // Matte Obsidian Black Counter Body
        drawBevelBox(png, 56, 95, 144, 88, '#334155', '#0f172a', '#020617', '#000000');
        // 24K Polished Gold Geometric Inlay Edging
        strokeRect(png, 60, 99, 136, 80, hexToRgba('#fbbf24'), 3);
        strokeRect(png, 68, 107, 120, 64, hexToRgba('#f59e0b'), 2);
        // Glowing Neon Cyan Undercarriage Ground Lighting
        fillRect(png, 64, 182, 128, 6, hexToRgba('#00ffcc'));
        fillRect(png, 70, 184, 116, 8, hexToRgba('#00ffcc', 120));
        // Futuristic Carbon Fiber Aerodynamic Wheels
        fillCircle(png, 85, 195, 24, hexToRgba('#0f172a'));
        fillCircle(png, 85, 195, 18, hexToRgba('#00ffcc'));
        fillCircle(png, 85, 195, 8, hexToRgba('#fbbf24'));
        fillCircle(png, 171, 195, 24, hexToRgba('#0f172a'));
        fillCircle(png, 171, 195, 18, hexToRgba('#00ffcc'));
        fillCircle(png, 171, 195, 8, hexToRgba('#fbbf24'));
    }
};

const assetsDir = path.join(__dirname, '..', 'assets');
let generatedCount = 0;

Object.entries(generators).forEach(([filename, genFn]) => {
    const png = createPixelCanvas(256, 256);
    genFn(png);
    const outPath = path.join(assetsDir, filename);
    fs.writeFileSync(outPath, PNG.sync.write(png));
    generatedCount++;
    console.log(`✓ Synthesized [${generatedCount}/18]: ${filename}`);
});

console.log(`\n✅ ALL 18 REMAINING ITEM PORTRAITS SUCCESSFULLY GENERATED IN assets/!`);
