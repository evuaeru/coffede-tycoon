const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

function createPixelCanvas(w = 256, h = 256) {
    const png = new PNG({ width: w, height: h });
    png.data.fill(0);
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
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || x >= png.width || y < 0 || y >= png.height) return;
    const idx = (y * png.width + x) * 4;
    const [r, g, b, a] = rgba;
    if (a === 255) {
        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = a;
    } else if (a > 0) {
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

function strokeCircle(png, cx, cy, radius, rgba, thickness = 1) {
    const rOuter = radius * radius;
    const rInner = (radius - thickness) * (radius - thickness);
    for (let py = Math.floor(cy - radius); py <= Math.ceil(cy + radius); py++) {
        for (let px = Math.floor(cx - radius); px <= Math.ceil(cx + radius); px++) {
            const d2 = (px - cx) * (px - cx) + (py - cy) * (py - cy);
            if (d2 <= rOuter && d2 >= rInner) {
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
            const dist = dx * dx + dy * dy;
            if (dist <= 1.0) {
                const alpha = Math.round(120 * (1 - dist * 0.7));
                setPixel(png, px, py, [15, 23, 42, alpha]);
            }
        }
    }
}

function drawIsometricBox(png, x, y, w, h, depth, topCol, leftCol, rightCol, outlineCol) {
    // Left Face
    for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
            const sy = y + py + Math.floor(px * 0.5);
            const sx = x + px;
            setPixel(png, sx, sy, hexToRgba(leftCol));
        }
    }
    // Right Face
    for (let py = 0; py < h; py++) {
        for (let pz = 0; pz < depth; pz++) {
            const sy = y + py + Math.floor(w * 0.5) - Math.floor(pz * 0.5);
            const sx = x + w + pz;
            setPixel(png, sx, sy, hexToRgba(rightCol));
        }
    }
    // Top Face
    for (let px = 0; px < w; px++) {
        for (let pz = 0; pz < depth; pz++) {
            const sx = x + px + pz;
            const sy = y + Math.floor(px * 0.5) - Math.floor(pz * 0.5);
            setPixel(png, sx, sy, hexToRgba(topCol));
        }
    }
}

module.exports = {
    createPixelCanvas,
    hexToRgba,
    setPixel,
    fillRect,
    strokeRect,
    fillCircle,
    strokeCircle,
    drawShadow,
    drawIsometricBox
};
