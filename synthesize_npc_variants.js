const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    h /= 360;
    l = Math.max(0, Math.min(1, l));
    s = Math.max(0, Math.min(1, s));
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const NPC_VARIANTS_CONFIG = {
    // Base 0 (Jogger / Athletic Blazer)
    jogger: {
        baseIdx: 0,
        isBase: true,
        name: 'Morning Jogger',
        desc: 'Energetic morning runner with quick strides and a love for light roasts.'
    },
    marathon_runner: {
        baseIdx: 0,
        name: 'Marathon Runner',
        desc: 'Endurance athlete pacing long distances, craving high-antioxidant cold brew.',
        palette: {
            skin: { h: 28, s: 0.55, lMult: 0.90 }, // Warm tan
            hair: { h: 0, s: 0.05, lMult: 0.20 },  // Pitch black
            top: { h: 12, s: 0.85, lMult: 0.95 },  // Neon coral athletic
            pants: { h: 210, s: 0.10, lMult: 0.25 }, // Black running shorts
            hasBareLegs: true
        }
    },
    fashionista: {
        baseIdx: 0,
        name: 'City Fashionista',
        desc: 'Trendy stylist sporting pastel designer wear, sipping oat milk cortados.',
        palette: {
            skin: { h: 24, s: 0.60, lMult: 1.05 }, // Fair peach
            hair: { h: 45, s: 0.75, lMult: 1.15 }, // Golden blonde
            top: { h: 345, s: 0.50, lMult: 1.05 }, // Dusty rose designer blazer
            pants: { h: 35, s: 0.35, lMult: 1.10 }, // Pastel cream skirt
            hasBareLegs: true
        }
    },
    casual_shopper: {
        baseIdx: 0,
        name: 'Casual Shopper',
        desc: 'Relaxed weekend browser carrying boutique bags, enjoying sweet vanilla lattes.',
        palette: {
            skin: { h: 36, s: 0.35, lMult: 0.85 }, // Cool olive
            hair: { h: 0, s: 0.05, lMult: 1.25 },  // Silver gray
            top: { h: 265, s: 0.45, lMult: 1.05 }, // Lavender cardigan
            pants: { h: 215, s: 0.50, lMult: 0.55 }, // Denim skirt
            hasBareLegs: true
        }
    },

    // Base 1 (Student / Backpack / Hoodie)
    student: {
        baseIdx: 1,
        isBase: true,
        name: 'College Undergrad',
        desc: 'Undergrad cramming between lectures, fueled by cheap iced Americanos.'
    },
    grad_student: {
        baseIdx: 1,
        name: 'Graduate Researcher',
        desc: 'Exhausted researcher surviving thesis deadlines on triple espresso shots.',
        palette: {
            skin: { h: 28, s: 0.50, lMult: 0.92 }, // Warm tan
            hair: { h: 18, s: 0.55, lMult: 0.55 }, // Chestnut brown
            top: { h: 135, s: 0.50, lMult: 0.70 }, // Forest green hoodie
            pants: { h: 35, s: 0.35, lMult: 0.75 } // Khaki pants
        }
    },
    art_student: {
        baseIdx: 1,
        name: 'Indie Art Student',
        desc: 'Creative soul experimenting with indie zines, fond of lavender syrup.',
        palette: {
            skin: { h: 25, s: 0.60, lMult: 1.05 }, // Fair peach
            hair: { h: 325, s: 0.65, lMult: 1.10 }, // Pastel pink hair
            top: { h: 185, s: 0.70, lMult: 0.90 }, // Pastel cyan hoodie
            pants: { h: 280, s: 0.25, lMult: 0.40 } // Deep plum pants
        }
    },
    bookworm: {
        baseIdx: 1,
        name: 'Quiet Bookworm',
        desc: 'Avid reader lost in classic literature, savoring slow pour-overs.',
        palette: {
            skin: { h: 24, s: 0.58, lMult: 0.70 }, // Deep bronze
            hair: { h: 0, s: 0.05, lMult: 0.20 },  // Pitch black
            top: { h: 348, s: 0.65, lMult: 0.65 }, // Burgundy hoodie
            pants: { h: 215, s: 0.20, lMult: 0.45 } // Charcoal slacks
        }
    },

    // Base 2 (Business / Suit & Tie / Briefcase)
    business: {
        baseIdx: 2,
        isBase: true,
        name: 'Corporate Businessman',
        desc: 'Corporate dealmaker on a tight schedule, demanding swift double shots.'
    },
    corporate_exec: {
        baseIdx: 2,
        name: 'Senior Executive',
        desc: 'Senior executive commanding boardrooms, paying top dollar for reserve roasts.',
        palette: {
            skin: { h: 25, s: 0.55, lMult: 1.02 }, // Fair peach
            hair: { h: 0, s: 0.05, lMult: 1.20 },  // Silver gray
            top: { h: 210, s: 0.08, lMult: 0.40 }, // Charcoal pinstripe suit
            pants: { h: 210, s: 0.08, lMult: 0.40 } // Charcoal pants
        }
    },
    fintech_analyst: {
        baseIdx: 2,
        name: 'Fintech Quant',
        desc: 'High-speed numbers cruncher tracking market arbitrage over macchiatos.',
        palette: {
            skin: { h: 28, s: 0.55, lMult: 0.90 }, // Warm tan
            hair: { h: 20, s: 0.40, lMult: 0.22 }, // Rich espresso dark hair
            top: { h: 225, s: 0.75, lMult: 0.80 }, // Royal blue suit
            pants: { h: 225, s: 0.75, lMult: 0.80 } // Royal blue pants
        }
    },
    metro_commuter: {
        baseIdx: 2,
        name: 'Metro Commuter',
        desc: 'Punctual subway traveler clutching a transit pass and a commuter cup.',
        palette: {
            skin: { h: 36, s: 0.35, lMult: 0.86 }, // Cool olive
            hair: { h: 24, s: 0.60, lMult: 0.50 }, // Chestnut brown
            top: { h: 215, s: 0.20, lMult: 0.60 }, // Slate gray suit
            pants: { h: 215, s: 0.20, lMult: 0.60 } // Slate gray pants
        }
    },

    // Base 3 (Hipster / Flannel / Beanie)
    hipster: {
        baseIdx: 3,
        isBase: true,
        name: 'Artisan Hipster',
        desc: 'Artisanal coffee connoisseur debating single-origin notes and acidity.'
    },
    barista_regular: {
        baseIdx: 3,
        name: 'Off-duty Barista',
        desc: 'Fellow coffee roaster who appreciates velvety micro-foam and floral notes.',
        palette: {
            skin: { h: 28, s: 0.55, lMult: 0.90 }, // Warm tan
            hair: { h: 0, s: 0.05, lMult: 0.20 },  // Pitch black
            top: { h: 38, s: 0.80, lMult: 0.85 },  // Golden amber flannel
            pants: { h: 210, s: 0.10, lMult: 0.35 } // Dark charcoal apron pants
        }
    },
    music_producer: {
        baseIdx: 3,
        name: 'Sound Producer',
        desc: 'Beatmaker with heavy studio headphones, chasing late-night caffeine.',
        palette: {
            skin: { h: 25, s: 0.55, lMult: 1.02 }, // Fair peach
            hair: { h: 185, s: 0.75, lMult: 1.10 }, // Pastel cyan hair
            top: { h: 280, s: 0.60, lMult: 0.75 }, // Purple plaid flannel
            pants: { h: 0, s: 0.05, lMult: 0.25 }  // Jet black pants
        }
    },
    dog_walker: {
        baseIdx: 3,
        name: 'Park Dog Walker',
        desc: 'Friendly neighborhood walker accompanied by a happy canine companion.',
        palette: {
            skin: { h: 24, s: 0.58, lMult: 0.72 }, // Deep bronze
            hair: { h: 22, s: 0.60, lMult: 0.50 }, // Chestnut hair
            top: { h: 95, s: 0.45, lMult: 0.70 },  // Olive green flannel
            pants: { h: 35, s: 0.40, lMult: 0.80 } // Tan cargo pants
        }
    },

    // Base 4 (Cryptobro / Tech Hoodie / Sunglasses)
    cryptobro: {
        baseIdx: 4,
        isBase: true,
        name: 'Crypto Enthusiast',
        desc: 'Blockchain enthusiast checking bull market charts and paying in crypto.'
    },
    crypto_whale: {
        baseIdx: 4,
        name: 'Web3 Whale',
        desc: 'High-roller Web3 investor leaving massive tips in USDC and $BEAN.',
        palette: {
            skin: { h: 24, s: 0.58, lMult: 0.70 }, // Deep bronze
            hair: { h: 0, s: 0.05, lMult: 1.25 },  // Silver gray hair
            top: { h: 45, s: 0.20, lMult: 0.30 },  // Midnight black hoodie with gold trim
            pants: { h: 45, s: 0.15, lMult: 0.25 } // Black slacks
        }
    },
    tech_hacker: {
        baseIdx: 4,
        name: 'Cyber Security Ops',
        desc: 'Cybersecurity specialist operating in terminal dark mode with double espresso.',
        palette: {
            skin: { h: 25, s: 0.50, lMult: 1.02 }, // Fair peach
            hair: { h: 0, s: 0.05, lMult: 0.18 },  // Pitch black
            top: { h: 140, s: 0.85, lMult: 0.70 }, // Matrix green cyber hoodie
            pants: { h: 140, s: 0.15, lMult: 0.25 } // Dark cyber pants
        }
    },
    indie_dev: {
        baseIdx: 4,
        name: 'Indie Game Dev',
        desc: 'Solo indie developer shipping game updates on caffeine and dreams.',
        palette: {
            skin: { h: 28, s: 0.52, lMult: 0.90 }, // Warm tan
            hair: { h: 10, s: 0.75, lMult: 0.75 }, // Auburn red hair
            top: { h: 220, s: 0.65, lMult: 0.65 }, // Deep navy hoodie
            pants: { h: 35, s: 0.30, lMult: 0.65 } // Faded khaki joggers
        }
    },

    // Base 5 (Senior / Trench Coat / Pearls)
    senior: {
        baseIdx: 5,
        isBase: true,
        name: 'Elegant Senior Lady',
        desc: 'Neighborhood elder enjoying gentle morning walks and warm, mellow coffee.'
    },
    professor: {
        baseIdx: 5,
        name: 'University Professor',
        desc: 'Tenured academic carrying lecture notes, fond of dark French roasts.',
        palette: {
            skin: { h: 28, s: 0.52, lMult: 0.90 }, // Warm tan
            hair: { h: 0, s: 0.05, lMult: 1.15 },  // Silver gray
            top: { h: 26, s: 0.45, lMult: 0.65 },  // Chocolate brown tweed coat
            pants: { h: 25, s: 0.30, lMult: 0.45 },
            topYMax: 0.82
        }
    },
    retiree: {
        baseIdx: 5,
        name: 'Peaceful Retiree',
        desc: 'Peaceful park frequenter with plenty of time to enjoy fresh roasts.',
        palette: {
            skin: { h: 25, s: 0.55, lMult: 1.02 }, // Fair peach
            hair: { h: 0, s: 0.05, lMult: 1.35 },  // Snow white
            top: { h: 165, s: 0.40, lMult: 1.00 }, // Mint sage trench coat
            pants: { h: 165, s: 0.20, lMult: 0.55 },
            topYMax: 0.82
        }
    },
    tourist: {
        baseIdx: 5,
        name: 'City Sightseer',
        desc: 'Excited visitor snapping photos and exploring local craft coffee culture.',
        palette: {
            skin: { h: 20, s: 0.45, lMult: 0.52 }, // Rich espresso
            hair: { h: 45, s: 0.75, lMult: 1.15 }, // Golden blonde
            top: { h: 205, s: 0.55, lMult: 1.02 }, // Pastel sky blue trench
            pants: { h: 205, s: 0.25, lMult: 0.60 },
            topYMax: 0.82
        }
    }
};

function applyPaletteToPng(png, palette) {
    const out = new PNG({ width: png.width, height: png.height });
    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            const idx = (png.width * y + x) << 2;
            const a = png.data[idx + 3];
            if (a < 25) {
                out.data[idx] = 0; out.data[idx + 1] = 0; out.data[idx + 2] = 0; out.data[idx + 3] = 0;
                continue;
            }
            let r = png.data[idx], g = png.data[idx + 1], b = png.data[idx + 2];
            let [h, s, l] = rgbToHsl(r, g, b);
            const yRel = y / png.height;

            // Preserve dark outlines & silhouettes
            if (l < 0.10) {
                out.data[idx] = r; out.data[idx + 1] = g; out.data[idx + 2] = b; out.data[idx + 3] = a;
                continue;
            }

            // Skin detection
            const isSkin = (yRel < 0.38 && h >= 10 && h <= 45 && s > 0.20 && l > 0.40) ||
                           (yRel >= 0.65 && yRel < 0.88 && palette.hasBareLegs && h >= 10 && h <= 45 && s > 0.20 && l > 0.35);

            if (isSkin && palette.skin) {
                const [nr, ng, nb] = hslToRgb(palette.skin.h, palette.skin.s, l * (palette.skin.lMult || 1.0));
                out.data[idx] = nr; out.data[idx + 1] = ng; out.data[idx + 2] = nb; out.data[idx + 3] = a;
                continue;
            }

            // Hair detection
            const isHair = (yRel < (palette.hairYMax || 0.22)) && !isSkin && (l > 0.08);
            if (isHair && palette.hair) {
                const [nr, ng, nb] = hslToRgb(palette.hair.h, palette.hair.s, l * (palette.hair.lMult || 1.0));
                out.data[idx] = nr; out.data[idx + 1] = ng; out.data[idx + 2] = nb; out.data[idx + 3] = a;
                continue;
            }

            // Top / jacket / hoodie / coat detection
            const isTop = (yRel >= 0.20 && yRel < (palette.topYMax || 0.62)) && !isSkin;
            if (isTop && palette.top) {
                const [nr, ng, nb] = hslToRgb(palette.top.h, palette.top.s, l * (palette.top.lMult || 1.0));
                out.data[idx] = nr; out.data[idx + 1] = ng; out.data[idx + 2] = nb; out.data[idx + 3] = a;
                continue;
            }

            // Pants / skirt detection
            const isPants = (yRel >= (palette.topYMax || 0.60) && yRel < 0.88) && !isSkin;
            if (isPants && palette.pants) {
                const [nr, ng, nb] = hslToRgb(palette.pants.h, palette.pants.s, l * (palette.pants.lMult || 1.0));
                out.data[idx] = nr; out.data[idx + 1] = ng; out.data[idx + 2] = nb; out.data[idx + 3] = a;
                continue;
            }

            out.data[idx] = r; out.data[idx + 1] = g; out.data[idx + 2] = b; out.data[idx + 3] = a;
        }
    }
    return out;
}

async function synthesizeAll() {
    console.log('--- Starting Synthesis of 24 NPC Variants ---');
    const baseIdlePngs = [];
    const baseWalkCycles = [];

    for (let b = 0; b < 6; b++) {
        const idlePath = `assets/npc_${b}.png`;
        baseIdlePngs[b] = PNG.sync.read(fs.readFileSync(idlePath));
        baseWalkCycles[b] = [];
        for (let f = 0; f < 8; f++) {
            const walkPath = `assets/walk_${b}_${f}.png`;
            baseWalkCycles[b][f] = PNG.sync.read(fs.readFileSync(walkPath));
        }
    }

    let synthesizedCount = 0;
    for (const [key, cfg] of Object.entries(NPC_VARIANTS_CONFIG)) {
        const baseIdx = cfg.baseIdx;
        const outIdleName = `assets/npc_${key}.png`;

        if (cfg.isBase) {
            // For base archetypes, write alias copy or retain
            fs.copyFileSync(`assets/npc_${baseIdx}.png`, outIdleName);
            for (let f = 0; f < 8; f++) {
                fs.copyFileSync(`assets/walk_${baseIdx}_${f}.png`, `assets/walk_${key}_${f}.png`);
            }
            console.log(`✓ Archetype '${key}' (Base ${baseIdx}) linked`);
            synthesizedCount++;
            continue;
        }

        // Palette-swap Idle Sprite
        const swappedIdle = applyPaletteToPng(baseIdlePngs[baseIdx], cfg.palette);
        fs.writeFileSync(outIdleName, PNG.sync.write(swappedIdle));

        // Palette-swap All 8 Walk Frames
        for (let f = 0; f < 8; f++) {
            const swappedWalk = applyPaletteToPng(baseWalkCycles[baseIdx][f], cfg.palette);
            fs.writeFileSync(`assets/walk_${key}_${f}.png`, PNG.sync.write(swappedWalk));
        }

        synthesizedCount++;
        console.log(`✓ Synthesized variant '${key}' (${cfg.name}): idle + 8 walk frames`);
    }

    console.log(`\n🎉 Successfully synthesized all ${synthesizedCount} NPC variants (idle + 8-frame walk cycles)!`);
}

if (require.main === module) {
    synthesizeAll().catch(console.error);
}

module.exports = { NPC_VARIANTS_CONFIG, applyPaletteToPng, rgbToHsl, hslToRgb };
