// Coffede Tycoon - High-Density Retro Pixel Art Rendering Engine
// Authentic multi-layered procedural pixel art inspired by Lemonade Tycoon, Stardew Valley & Coffee Talk.
// Rendered on a crisp 640x360 logical canvas with imageSmoothingEnabled = false.

// Curated 24 NPC Archetypes & High-Performance Retro Palette Transforms
const NPC_VARIANTS_CATALOG = {
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
            hasBareLegs: true,
            topHex: '#ff4b4b'
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
            hasBareLegs: true,
            topHex: '#f472b6'
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
            hasBareLegs: true,
            topHex: '#c084fc'
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
            pants: { h: 35, s: 0.35, lMult: 0.75 }, // Khaki pants
            topHex: '#15803d'
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
            pants: { h: 280, s: 0.25, lMult: 0.40 }, // Deep plum pants
            topHex: '#06b6d4'
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
            pants: { h: 215, s: 0.20, lMult: 0.45 }, // Charcoal slacks
            topHex: '#991b1b'
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
            pants: { h: 210, s: 0.08, lMult: 0.40 }, // Charcoal pants
            topHex: '#1e293b'
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
            pants: { h: 225, s: 0.75, lMult: 0.80 }, // Royal blue pants
            topHex: '#1d4ed8'
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
            pants: { h: 215, s: 0.20, lMult: 0.60 }, // Slate gray pants
            topHex: '#475569'
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
            pants: { h: 210, s: 0.10, lMult: 0.35 }, // Dark charcoal apron pants
            topHex: '#d97706'
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
            pants: { h: 0, s: 0.05, lMult: 0.25 },  // Jet black pants
            topHex: '#7e22ce'
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
            pants: { h: 35, s: 0.40, lMult: 0.80 }, // Tan cargo pants
            topHex: '#4d7c0f'
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
            pants: { h: 45, s: 0.15, lMult: 0.25 }, // Black slacks
            topHex: '#18181b'
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
            pants: { h: 140, s: 0.15, lMult: 0.25 }, // Dark cyber pants
            topHex: '#15803d'
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
            pants: { h: 35, s: 0.30, lMult: 0.65 }, // Faded khaki joggers
            topHex: '#1e3a8a'
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
            topYMax: 0.82,
            topHex: '#78350f'
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
            topYMax: 0.82,
            topHex: '#0d9488'
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
            topYMax: 0.82,
            topHex: '#0284c7'
        }
    }
};

class SpriteRenderer {
    constructor() {
        this.frame = 0;
        this.showStandHUD = true;
        this.steamParticles = [];
        this.floatingTexts = [];
        this.confettiParticles = [];
        this.cheerfulParticles = [];
        this.groundRipples = [];
        this.chimneySmoke = [];
        this.fountainDroplets = [];
        this.streetSteam = [];
        this.fallingLeaves = [];

        // Preloaded High-Pixel Background Assets for All 20 Locations (Lemonade Tycoon Progression)
        const ALL_LOC_KEYS = [
            'cul_de_sac', 'community_garden', 'public_library', 'suburbs',
            'lake_marina', 'campsite', 'farmers_market', 'park',
            'beach_boardwalk', 'construction_site', 'art_district', 'campus',
            'amusement_pier', 'sports_complex', 'shopping_mall', 'hospital_plaza',
            'metro', 'convention_center', 'downtown', 'airport_terminal'
        ];
        this.allLocationKeys = ALL_LOC_KEYS;
        this.suburbsBg = null;
        this.suburbsBgLoaded = false;
        this.locationBgs = {};
        this.locationBgsLoaded = {};
        for (const loc of ALL_LOC_KEYS) {
            this.locationBgs[loc] = null;
            this.locationBgsLoaded[loc] = false;
        }

        // 16-Bit Isometric Cart Asset (Pre-processed Transparent PNGs across 5 Decor Levels)
        this.cartSpriteImg = null;
        this.cartSpriteCanvas = null;
        this.cartLoaded = false;
        this.cartWidth = 76; // Scaled down ~19% (74-80px range) to match detailed background maps
        this.cartLevelSprites = {};
        this.cartLevelLoaded = {};
        for (let lvl = 0; lvl <= 5; lvl++) {
            this.cartLevelSprites[lvl] = null;
            this.cartLevelLoaded[lvl] = false;
        }

        // 16-Bit Isometric NPC Characters Asset (6 Pre-processed Transparent PNGs)
        this.npcSpriteImg = null;
        this.npcSpriteImgs = [];
        this.npcSpriteCanvases = [];
        this.npcsLoaded = false;
        this.npcHeight = 40; // Scaled down ~16.7% (38-42px range) for natural streetscape proportion

        // 16-Bit Animated Barista Attendant Sprites (4 frames: Idle, Wave/Cloth, Brewing, Pouring)
        this.baristaSprites = [];
        this.baristaLoaded = false;

        // 16-Bit Isometric Walk Cycles (8 sequential animation frames per archetype)
        this.walkCycles = {};
        for (let a = 0; a < 6; a++) {
            this.walkCycles[a] = [];
        }

        // 18+ Curated Retro NPC Variants & Offscreen Synthesis Caches
        this.npcVariants = NPC_VARIANTS_CATALOG;
        this.variantSpriteCanvases = {};
        this.variantWalkCycles = {};
        for (const key of Object.keys(this.npcVariants)) {
            this.variantWalkCycles[key] = [];
        }

        if (typeof Image !== 'undefined') {
            try {
                // 1. All 20 Location 16-Bit Background Images
                const bgMap = {};
                for (const loc of ALL_LOC_KEYS) {
                    bgMap[loc] = `assets/${loc}_bg.jpg`;
                }

                for (const [locKey, srcPath] of Object.entries(bgMap)) {
                    const img = new Image();
                    img.onload = () => {
                        this.locationBgsLoaded[locKey] = true;
                        if (locKey === 'suburbs') this.suburbsBgLoaded = true;
                    };
                    img.onerror = () => {
                        this.locationBgsLoaded[locKey] = false;
                        if (locKey === 'suburbs') this.suburbsBgLoaded = false;
                    };
                    img.src = srcPath;
                    if (img.complete && (img.naturalWidth > 0 || img.width > 0)) {
                        this.locationBgsLoaded[locKey] = true;
                        if (locKey === 'suburbs') this.suburbsBgLoaded = true;
                    }
                    this.locationBgs[locKey] = img;
                    if (locKey === 'suburbs') this.suburbsBg = img;
                }

                // 2. 16-Bit Coffee Cart (Transparent PNG - No CORS or tainted canvas issues)
                this.cartSpriteImg = new Image();
                this.cartSpriteImg.onload = () => {
                    this.cartLoaded = true;
                    this.cartSpriteCanvas = this.cartSpriteImg; // Compatibility alias
                };
                this.cartSpriteImg.onerror = () => {
                    // Fallback to jpg processing if png missing
                    this.cartSpriteImg = new Image();
                    this.cartSpriteImg.onload = () => this.processCartSprite(this.cartSpriteImg);
                    this.cartSpriteImg.src = 'assets/coffee_cart.jpg';
                };
                this.cartSpriteImg.src = 'assets/cart_lvl_0.png?v=45';
                if (this.cartSpriteImg.complete && (this.cartSpriteImg.naturalWidth > 0 || this.cartSpriteImg.width > 0)) {
                    this.cartLoaded = true;
                    this.cartSpriteCanvas = this.cartSpriteImg;
                }

                // 2b. 6-Tier Cart Upgrade Sprites with Unified Barista (assets/cart_lvl_0.png .. assets/cart_lvl_5.png)
                for (let lvl = 0; lvl <= 5; lvl++) {
                    const cImg = new Image();
                    cImg.onload = () => {
                        this.cartLevelLoaded[lvl] = true;
                        this.cartLoaded = true;
                    };
                    cImg.onerror = () => {
                        this.cartLevelLoaded[lvl] = false;
                    };
                    cImg.src = `assets/cart_lvl_${lvl}.png?v=45`;
                    if (cImg.complete && (cImg.naturalWidth > 0 || cImg.width > 0)) {
                        this.cartLevelLoaded[lvl] = true;
                        this.cartLoaded = true;
                    }
                    this.cartLevelSprites[lvl] = cImg;
                }

                // 3. 16-Bit NPC Characters (6 Transparent PNGs - No CORS or tainted canvas issues)
                this.npcSpriteImgs = [];
                this.npcSpriteCanvases = [];
                let npcsLoadedCount = 0;
                for (let i = 0; i < 6; i++) {
                    const nImg = new Image();
                    nImg.onload = () => {
                        npcsLoadedCount++;
                        if (npcsLoadedCount >= 6) {
                            this.npcsLoaded = true;
                            this.initVariantCanvases();
                        }
                    };
                    nImg.onerror = () => {
                        // If separate pngs fail, fallback to jpg sheet processing
                        if (!this.npcsLoaded) {
                            const sheet = new Image();
                            sheet.onload = () => this.processNpcSprites(sheet);
                            sheet.src = 'assets/npc_sprites.jpg';
                        }
                    };
                    nImg.src = `assets/npc_${i}.png`;
                    if (nImg.complete && (nImg.naturalWidth > 0 || nImg.width > 0)) {
                        npcsLoadedCount++;
                    }
                    this.npcSpriteImgs.push(nImg);
                    this.npcSpriteCanvases.push(nImg); // Compatibility alias
                }
                if (npcsLoadedCount >= 6) {
                    this.npcsLoaded = true;
                    this.initVariantCanvases();
                }

                // 4. Load 8-Frame Walk Cycles for all 6 archetypes (walk_[0..5]_[0..7].png)
                let walkFramesLoadedCount = 0;
                for (let a = 0; a < 6; a++) {
                    for (let f = 0; f < 8; f++) {
                        const wImg = new Image();
                        wImg.onload = () => {
                            walkFramesLoadedCount++;
                            if (walkFramesLoadedCount >= 48) {
                                this.initVariantCanvases();
                            }
                        };
                        wImg.src = `assets/walk_${a}_${f}.png`;
                        if (wImg.complete && (wImg.naturalWidth > 0 || wImg.width > 0)) {
                            walkFramesLoadedCount++;
                        }
                        this.walkCycles[a].push(wImg);
                    }
                }
                if (walkFramesLoadedCount >= 48) {
                    this.initVariantCanvases();
                }

                // 5. Load pre-synthesized assets for all 24 variants
                for (const [key, cfg] of Object.entries(this.npcVariants)) {
                    if (cfg.isBase) {
                        this.variantSpriteCanvases[key] = this.npcSpriteImgs[cfg.baseIdx];
                        this.variantWalkCycles[key] = this.walkCycles[cfg.baseIdx];
                        continue;
                    }
                    const vImg = new Image();
                    vImg.src = `assets/npc_${key}.png`;
                    this.variantSpriteCanvases[key] = vImg;

                    this.variantWalkCycles[key] = [];
                    for (let f = 0; f < 8; f++) {
                        const vwImg = new Image();
                        vwImg.src = `assets/walk_${key}_${f}.png`;
                        this.variantWalkCycles[key].push(vwImg);
                    }
                }
                this.initVariantCanvases();
            } catch (e) {
                // Headless test environment fallback
            }
        }
    }

    // Chroma-key pure white background (#ffffff or R>240, G>240, B>240) and tightly crop bounding box
    processCartSprite(img) {
        try {
            if (!img || typeof document === 'undefined' || !document.createElement) return;
            const w = img.naturalWidth || img.width || 1024;
            const h = img.naturalHeight || img.height || 1024;
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(img, 0, 0, w, h);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            let minX = w, maxX = 0, minY = h, maxY = 0;
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const idx = (y * w + x) * 4;
                    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                    if (r > 240 && g > 240 && b > 240) {
                        data[idx + 3] = 0;
                    } else {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0);

            if (maxX < minX || maxY < minY) {
                minX = 155; maxX = 901; minY = 38; maxY = 967;
            }

            const cropW = Math.max(1, maxX - minX + 1);
            const cropH = Math.max(1, maxY - minY + 1);
            const cropped = document.createElement('canvas');
            cropped.width = cropW;
            cropped.height = cropH;
            const cropCtx = cropped.getContext('2d');
            cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

            this.cartSpriteCanvas = cropped;
            this.cartLoaded = true;
        } catch (e) {
            this.cartLoaded = false;
        }
    }

    // Chroma-key white background and segment into 6 distinct 16-bit NPC character sprites
    processNpcSprites(img) {
        try {
            if (!img || typeof document === 'undefined' || !document.createElement) return;
            const w = img.naturalWidth || img.width || 1376;
            const h = img.naturalHeight || img.height || 768;
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(img, 0, 0, w, h);

            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            const colCounts = new Array(w).fill(0);
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const idx = (y * w + x) * 4;
                    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                    if (r > 240 && g > 240 && b > 240) {
                        data[idx + 3] = 0;
                    } else {
                        colCounts[x]++;
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0);

            // Segment across horizontal columns
            const spans = [];
            let inSpan = false;
            let start = 0;
            for (let x = 0; x < w; x++) {
                if (colCounts[x] > 5) {
                    if (!inSpan) {
                        inSpan = true;
                        start = x;
                    }
                } else {
                    if (inSpan) {
                        inSpan = false;
                        spans.push({ start, end: x - 1 });
                    }
                }
            }
            if (inSpan) spans.push({ start, end: w - 1 });

            let charRegions = [];
            if (spans.length === 6) {
                charRegions = spans;
            } else {
                charRegions = [
                    { start: 68, end: 229 },
                    { start: 280, end: 470 },
                    { start: 498, end: 665 },
                    { start: 725, end: 891 },
                    { start: 937, end: 1112 },
                    { start: 1163, end: 1307 }
                ];
            }

            this.npcSpriteCanvases = [];
            charRegions.forEach(reg => {
                let minX = reg.end, maxX = reg.start, minY = h, maxY = 0;
                for (let y = 0; y < h; y++) {
                    for (let x = reg.start; x <= reg.end; x++) {
                        const idx = (y * w + x) * 4;
                        if (data[idx + 3] > 0) {
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                    }
                }
                if (maxX >= minX && maxY >= minY) {
                    const cropW = maxX - minX + 1;
                    const cropH = maxY - minY + 1;
                    const charCanvas = document.createElement('canvas');
                    charCanvas.width = cropW;
                    charCanvas.height = cropH;
                    const charCtx = charCanvas.getContext('2d');
                    charCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
                    this.npcSpriteCanvases.push(charCanvas);
                }
            });

            if (this.npcSpriteCanvases.length === 6) {
                this.npcsLoaded = true;
                this.initVariantCanvases();
            }
        } catch (e) {
            this.npcsLoaded = false;
        }
    }

    // -------------------------------------------------------------
    // HIGH-PERFORMANCE OFFSCREEN PALETTE SWAPPING & VARIANT SYNTHESIS
    // -------------------------------------------------------------
    rgbToHsl(r, g, b) {
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

    hslToRgb(h, s, l) {
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

    createPaletteSwappedCanvas(sourceImg, palette) {
        if (!sourceImg || typeof document === 'undefined' || !document.createElement) return null;
        try {
            // Guard against Image instances that are still loading or have zero dimensions
            const isImg = (typeof HTMLImageElement !== 'undefined' && sourceImg instanceof HTMLImageElement) || 
                          (sourceImg.src !== undefined && sourceImg.onload !== undefined);
            if (isImg && (!sourceImg.complete || !sourceImg.naturalWidth || !sourceImg.naturalHeight)) {
                return null;
            }

            const w = sourceImg.naturalWidth || sourceImg.width || 0;
            const h = sourceImg.naturalHeight || sourceImg.height || 0;
            if (w <= 0 || h <= 0) return null;
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            if (typeof ctx.drawImage === 'function') {
                ctx.drawImage(sourceImg, 0, 0, w, h);
            }

            if (!palette || typeof ctx.getImageData !== 'function' || typeof ctx.putImageData !== 'function') {
                return canvas;
            }

            const imgData = ctx.getImageData(0, 0, w, h);
            if (!imgData || !imgData.data) return canvas;
            const data = imgData.data;

            // If the mock or destination canvas buffer is empty but sourceImg has getContext, copy pixels from source
            if (typeof sourceImg.getContext === 'function') {
                try {
                    const srcCtx = sourceImg.getContext('2d');
                    if (srcCtx && typeof srcCtx.getImageData === 'function') {
                        const srcData = srcCtx.getImageData(0, 0, w, h);
                        if (srcData && srcData.data && srcData.data.length > 0) {
                            for (let i = 0; i < srcData.data.length && i < data.length; i++) {
                                data[i] = srcData.data[i];
                            }
                        }
                    }
                } catch (_) {}
            }

            // Reject empty canvas (ensure minimum visible pixel volume before transforming)
            let nonTransparentPixels = 0;
            for (let i = 3; i < data.length; i += 4) {
                if (data[i] > 25) nonTransparentPixels++;
            }
            if (nonTransparentPixels < 50) {
                canvas._isEmptyCanvas = true;
                return null;
            }

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const idx = (y * w + x) * 4;
                    const a = data[idx + 3];
                    if (a < 25) continue;
                    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                    const [ch, cs, cl] = this.rgbToHsl(r, g, b);
                    const yRel = y / h;

                    if (cl < 0.10) continue; // Outlines & shadow

                    const isSkin = (yRel < 0.38 && ch >= 10 && ch <= 45 && cs > 0.20 && cl > 0.40) ||
                                   (yRel >= 0.65 && yRel < 0.88 && palette.hasBareLegs && ch >= 10 && ch <= 45 && cs > 0.20 && cl > 0.35);

                    if (isSkin && palette.skin) {
                        const [nr, ng, nb] = this.hslToRgb(palette.skin.h, palette.skin.s, cl * (palette.skin.lMult || 1.0));
                        data[idx] = nr; data[idx + 1] = ng; data[idx + 2] = nb;
                        continue;
                    }

                    const isHair = (yRel < (palette.hairYMax || 0.22)) && !isSkin && (cl > 0.08);
                    if (isHair && palette.hair) {
                        const [nr, ng, nb] = this.hslToRgb(palette.hair.h, palette.hair.s, cl * (palette.hair.lMult || 1.0));
                        data[idx] = nr; data[idx + 1] = ng; data[idx + 2] = nb;
                        continue;
                    }

                    const isTop = (yRel >= 0.20 && yRel < (palette.topYMax || 0.62)) && !isSkin;
                    if (isTop && palette.top) {
                        const [nr, ng, nb] = this.hslToRgb(palette.top.h, palette.top.s, cl * (palette.top.lMult || 1.0));
                        data[idx] = nr; data[idx + 1] = ng; data[idx + 2] = nb;
                        continue;
                    }

                    const isPants = (yRel >= (palette.topYMax || 0.60) && yRel < 0.88) && !isSkin;
                    if (isPants && palette.pants) {
                        const [nr, ng, nb] = this.hslToRgb(palette.pants.h, palette.pants.s, cl * (palette.pants.lMult || 1.0));
                        data[idx] = nr; data[idx + 1] = ng; data[idx + 2] = nb;
                        continue;
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0);
            return canvas;
        } catch (e) {
            return null;
        }
    }

    initVariantCanvases() {
        if (typeof document === 'undefined' || !document.createElement) return;
        try {
            for (const [key, cfg] of Object.entries(this.npcVariants || {})) {
                const baseIdx = cfg.baseIdx;
                if (cfg.isBase) {
                    const baseCanvas = (this.npcSpriteCanvases && this.npcSpriteCanvases[baseIdx]) || (this.npcSpriteImgs && this.npcSpriteImgs[baseIdx]);
                    if (baseCanvas) this.variantSpriteCanvases[key] = baseCanvas;
                    if (this.walkCycles && this.walkCycles[baseIdx]) this.variantWalkCycles[key] = this.walkCycles[baseIdx];
                    continue;
                }

                const sourceBase = (this.npcSpriteCanvases && this.npcSpriteCanvases[baseIdx]) || (this.npcSpriteImgs && this.npcSpriteImgs[baseIdx]);
                if (sourceBase) {
                    const swapped = this.createPaletteSwappedCanvas(sourceBase, cfg.palette);
                    if (swapped) {
                        this.variantSpriteCanvases[key] = swapped;
                    }
                }

                const baseWalk = this.walkCycles && this.walkCycles[baseIdx];
                if (baseWalk && baseWalk.length > 0) {
                    const swappedWalk = [];
                    let hasValidFrame = false;
                    for (let f = 0; f < baseWalk.length; f++) {
                        const frameSource = baseWalk[f];
                        const swappedFrame = this.createPaletteSwappedCanvas(frameSource, cfg.palette);
                        if (swappedFrame) hasValidFrame = true;
                        swappedWalk.push(swappedFrame || (this.variantWalkCycles[key] && this.variantWalkCycles[key][f]) || frameSource);
                    }
                    if (hasValidFrame && swappedWalk.length > 0) {
                        this.variantWalkCycles[key] = swappedWalk;
                    }
                }
            }
        } catch (e) {
            // Headless fallback
        }
    }

    // -------------------------------------------------------------
    // PIXEL DRAWING PRIMITIVES & HELPERS
    // -------------------------------------------------------------
    drawPixelRect(ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    }

    drawPixelLine(ctx, x1, y1, x2, y2, color) {
        if (!ctx) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        if (typeof ctx.beginPath === 'function') ctx.beginPath();
        if (typeof ctx.moveTo === 'function') ctx.moveTo(Math.round(x1) + 0.5, Math.round(y1) + 0.5);
        if (typeof ctx.lineTo === 'function') ctx.lineTo(Math.round(x2) + 0.5, Math.round(y2) + 0.5);
        if (typeof ctx.stroke === 'function') ctx.stroke();
    }

    drawPixelBevelBox(ctx, x, y, w, h, fillCol, topLight, botShadow, darkBorder) {
        const rx = Math.round(x), ry = Math.round(y), rw = Math.round(w), rh = Math.round(h);
        if (darkBorder) {
            ctx.fillStyle = darkBorder;
            ctx.fillRect(rx - 1, ry - 1, rw + 2, rh + 2);
        }
        ctx.fillStyle = fillCol;
        ctx.fillRect(rx, ry, rw, rh);
        if (topLight) {
            ctx.fillStyle = topLight;
            ctx.fillRect(rx, ry, rw, 1);
            ctx.fillRect(rx, ry, 1, rh);
        }
        if (botShadow) {
            ctx.fillStyle = botShadow;
            ctx.fillRect(rx, ry + rh - 1, rw, 1);
            ctx.fillRect(rx + rw - 1, ry, 1, rh);
        }
    }

    drawDitherRect(ctx, x, y, w, h, col1, col2, step = 2) {
        const rx = Math.round(x), ry = Math.round(y), rw = Math.round(w), rh = Math.round(h);
        ctx.fillStyle = col1;
        ctx.fillRect(rx, ry, rw, rh);
        ctx.fillStyle = col2;
        for (let py = ry; py < ry + rh; py += step) {
            const offset = (Math.floor((py - ry) / step) % 2) * (step);
            for (let px = rx + offset; px < rx + rw; px += step * 2) {
                ctx.fillRect(px, py, step, step);
            }
        }
    }

    drawPixelCircle(ctx, cx, cy, r, fillCol, rimCol) {
        const rcx = Math.round(cx), rcy = Math.round(cy);
        const radius = Math.round(r);
        ctx.fillStyle = fillCol;
        for (let y = -radius; y <= radius; y++) {
            const dx = Math.round(Math.sqrt(Math.max(0, radius * radius - y * y)));
            ctx.fillRect(rcx - dx, rcy + y, dx * 2 + 1, 1);
        }
        if (rimCol) {
            ctx.fillStyle = rimCol;
            for (let y = -radius; y <= radius; y++) {
                const dx = Math.round(Math.sqrt(Math.max(0, radius * radius - y * y)));
                ctx.fillRect(rcx - dx, rcy + y, 1, 1);
                ctx.fillRect(rcx + dx, rcy + y, 1, 1);
            }
        }
    }

    // -------------------------------------------------------------
    // ANIMATION & PARTICLE TICKER
    // -------------------------------------------------------------
    update(dt) {
        this.frame += dt * 60; // 60fps-normalized continuous tick

        // 1. Steam Particles (Espresso machine & coffee cups)
        if (Math.random() < 0.45 && this.steamParticles.length < 35) {
            this.steamParticles.push({
                x: (Math.random() - 0.5) * 6,
                y: 0,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -0.75 - Math.random() * 0.55,
                curlFreq: 2.6 + Math.random() * 2.2,
                curlAmp: 0.55 + Math.random() * 0.45,
                age: 0,
                maxLife: 1.4 + Math.random() * 0.5,
                baseSize: 1.8 + Math.random() * 1.3
            });
        }
        for (let i = this.steamParticles.length - 1; i >= 0; i--) {
            const p = this.steamParticles[i];
            p.age += dt;
            p.x += (p.vx + Math.sin(p.age * p.curlFreq) * p.curlAmp) * dt * 60;
            p.y += p.vy * dt * 60;
            p.size = p.baseSize + (p.age / p.maxLife) * 4.2;
            p.alpha = Math.max(0, 0.85 * (1 - p.age / p.maxLife));
            if (p.age >= p.maxLife) this.steamParticles.splice(i, 1);
        }

        // 2. Chimney Smoke Puffs (Suburbs)
        if (Math.random() < 0.18 && this.chimneySmoke.length < 25) {
            this.chimneySmoke.push({
                x: 0,
                y: 0,
                vx: 0.2 + Math.random() * 0.35,
                vy: -0.45 - Math.random() * 0.3,
                size: 2.5 + Math.random() * 1.5,
                maxSize: 8 + Math.random() * 4,
                age: 0,
                maxLife: 3.2 + Math.random() * 1.0,
                alpha: 0.75
            });
        }
        for (let i = this.chimneySmoke.length - 1; i >= 0; i--) {
            const sm = this.chimneySmoke[i];
            sm.age += dt;
            sm.x += sm.vx * dt * 60 + Math.sin(sm.age * 1.5) * 0.25;
            sm.y += sm.vy * dt * 60;
            sm.size = sm.size + (sm.maxSize - sm.size) * (dt * 0.8);
            sm.alpha = Math.max(0, 0.75 * (1 - sm.age / sm.maxLife));
            if (sm.age >= sm.maxLife) this.chimneySmoke.splice(i, 1);
        }

        // 3. Fountain Droplets (Park)
        if (this.fountainDroplets.length < 24) {
            this.fountainDroplets.push({
                x: (Math.random() - 0.5) * 5,
                y: 0,
                vx: (Math.random() - 0.5) * 0.9,
                vy: -2.2 - Math.random() * 1.2,
                age: 0,
                maxLife: 0.9 + Math.random() * 0.3
            });
        }
        for (let i = this.fountainDroplets.length - 1; i >= 0; i--) {
            const fd = this.fountainDroplets[i];
            fd.age += dt;
            fd.x += fd.vx * dt * 60;
            fd.y += fd.vy * dt * 60;
            fd.vy += 4.5 * dt; // gravity
            if (fd.age >= fd.maxLife || fd.y > 10) this.fountainDroplets.splice(i, 1);
        }

        // 4. Urban Street Grate Steam (Metro)
        if (Math.random() < 0.25 && this.streetSteam.length < 25) {
            this.streetSteam.push({
                x: (Math.random() - 0.5) * 8,
                y: 0,
                vx: 0.15 + (Math.random() - 0.5) * 0.3,
                vy: -0.6 - Math.random() * 0.4,
                size: 2,
                age: 0,
                maxLife: 1.8 + Math.random() * 0.5,
                alpha: 0.6
            });
        }
        for (let i = this.streetSteam.length - 1; i >= 0; i--) {
            const ss = this.streetSteam[i];
            ss.age += dt;
            ss.x += ss.vx * dt * 60;
            ss.y += ss.vy * dt * 60;
            ss.size += dt * 3.5;
            ss.alpha = Math.max(0, 0.6 * (1 - ss.age / ss.maxLife));
            if (ss.age >= ss.maxLife) this.streetSteam.splice(i, 1);
        }

        // 5. Ground Ripples (Rain splashes)
        if (this.groundRipples.length > 30) {
            this.groundRipples.splice(0, this.groundRipples.length - 30);
        }
        for (let i = this.groundRipples.length - 1; i >= 0; i--) {
            const r = this.groundRipples[i];
            r.r += 14 * dt;
            r.alpha -= 1.6 * dt;
            if (r.alpha <= 0) this.groundRipples.splice(i, 1);
        }

        // 6. Floating Sales & Tip Text
        if (this.floatingTexts.length > 25) {
            this.floatingTexts.splice(0, this.floatingTexts.length - 25);
        }
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const t = this.floatingTexts[i];
            t.age += dt;
            t.y += t.vy * dt * 60 * (1 - (t.age / t.maxLife) * 0.35);
            t.x += Math.sin(t.age * 5) * 0.25 * dt * 60;
            t.life -= dt;
            t.alpha = Math.max(0, t.life / t.maxLife);
            if (t.life <= 0) this.floatingTexts.splice(i, 1);
        }

        // 7. Confetti Particles (/boost)
        if (this.confettiParticles.length > 100) {
            this.confettiParticles.splice(0, this.confettiParticles.length - 100);
        }
        for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
            const c = this.confettiParticles[i];
            c.x += c.vx * dt * 60;
            c.y += c.vy * dt * 60;
            c.vy += 3.2 * dt;
            c.rot += c.vrot * dt * 60;
            c.life -= dt;
            if (c.life <= 0) this.confettiParticles.splice(i, 1);
        }

        // 8. Cheerful Particles (Joyful customer stars and hearts)
        for (let i = this.cheerfulParticles.length - 1; i >= 0; i--) {
            const p = this.cheerfulParticles[i];
            p.age += dt;
            p.x += p.vx * dt * 60;
            p.y += p.vy * dt * 60;
            p.vy += 0.35 * dt;
            p.rot += p.vrot * dt * 60;
            p.alpha = Math.max(0, 1 - (p.age / p.maxLife));
            if (p.age >= p.maxLife) this.cheerfulParticles.splice(i, 1);
        }
    }

    addCheerfulParticle(x, y, type = 'star') {
        const count = type === 'heart' ? 4 : 3;
        for (let i = 0; i < count; i++) {
            this.cheerfulParticles.push({
                x: x + (Math.random() - 0.5) * 16,
                y: y + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -1.8 - Math.random() * 1.2,
                vrot: (Math.random() - 0.5) * 0.15,
                rot: Math.random() * Math.PI,
                size: 8,
                type: type,
                age: 0,
                maxLife: 1.3 + Math.random() * 0.4,
                alpha: 1.0
            });
        }
    }

    addFloatingText(x, y, text, color = '#2ecc71', size = 12) {
        this.floatingTexts.push({
            x,
            y,
            vy: -0.85,
            text,
            color,
            size,
            age: 0,
            life: 1.5,
            maxLife: 1.5,
            alpha: 1.0
        });
    }

    triggerBoostConfetti(width, height) {
        const colors = ['#f1c40f', '#00ffcc', '#e74c3c', '#9b59b6', '#3498db', '#ffffff', '#2ecc71'];
        for (let i = 0; i < 50; i++) {
            this.confettiParticles.push({
                x: width * 0.5 + (Math.random() - 0.5) * 160,
                y: height * 0.45 + (Math.random() - 0.5) * 80,
                vx: (Math.random() - 0.5) * 4.5,
                vy: -3.5 - Math.random() * 4.5,
                size: 3 + Math.floor(Math.random() * 3),
                color: colors[Math.floor(Math.random() * colors.length)],
                rot: Math.random() * Math.PI,
                vrot: (Math.random() - 0.5) * 0.25,
                life: 2.2
            });
        }
    }

    // -------------------------------------------------------------
    // DYNAMIC RETRO PIXEL SKY & CELESTIAL BODIES
    // -------------------------------------------------------------
    renderBackground(ctx, width, height, locationId, weather, timeProgress) {
        const groundY = Math.round(height * 0.62); // 223px

        // Multi-tone sky gradient based on time & weather
        let bands = [];
        if (weather.type === 'rainy') {
            bands = [
                { y: 0.0, col: '#2c3e50' },
                { y: 0.35, col: '#34495e' },
                { y: 0.7, col: '#536976' },
                { y: 1.0, col: '#758898' }
            ];
        } else if (weather.type === 'freezing') {
            bands = [
                { y: 0.0, col: '#4a6572' },
                { y: 0.35, col: '#6d8a96' },
                { y: 0.7, col: '#9cb5c2' },
                { y: 1.0, col: '#d4e3ea' }
            ];
        } else if (timeProgress < 0.25) {
            // Early Morning Sunrise (8:00 AM - 10:30 AM)
            bands = [
                { y: 0.0, col: '#2b5876' },
                { y: 0.3, col: '#4e4376' },
                { y: 0.65, col: '#e08282' },
                { y: 0.85, col: '#f8a978' },
                { y: 1.0, col: '#f6d186' }
            ];
        } else if (timeProgress < 0.75) {
            // Bright Afternoon (10:30 AM - 3:30 PM)
            bands = [
                { y: 0.0, col: '#1c64b3' },
                { y: 0.35, col: '#2980b9' },
                { y: 0.7, col: '#4ba3e3' },
                { y: 1.0, col: '#87ceeb' }
            ];
        } else {
            // Warm Golden Sunset (3:30 PM - 6:00 PM)
            bands = [
                { y: 0.0, col: '#2c1b4d' },
                { y: 0.3, col: '#5b2c6f' },
                { y: 0.6, col: '#b83b5e' },
                { y: 0.82, col: '#e65c00' },
                { y: 1.0, col: '#f9d423' }
            ];
        }

        const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
        bands.forEach(b => skyGrad.addColorStop(b.y, b.col));
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, groundY);

        // Sun & Atmospheric Sunbeams
        if (weather.type === 'sunny' || weather.type === 'scorching') {
            const sunProgress = Math.max(0, Math.min(1, timeProgress));
            const sunX = Math.round(width * 0.12 + (width * 0.76) * sunProgress);
            const sunY = Math.round(40 + Math.sin(sunProgress * Math.PI) * -22);

            // Outer soft glow halo
            const sunGlow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 38);
            sunGlow.addColorStop(0, 'rgba(255, 245, 157, 0.55)');
            sunGlow.addColorStop(0.5, 'rgba(255, 215, 0, 0.22)');
            sunGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = sunGlow;
            ctx.beginPath();
            ctx.arc(sunX, sunY, 38, 0, Math.PI * 2);
            ctx.fill();

            // Segmented retro solar corona rays
            ctx.fillStyle = '#fff9c4';
            const rayRot = this.frame * 0.015;
            for (let a = 0; a < 8; a++) {
                const angle = rayRot + (a * Math.PI / 4);
                const rx = sunX + Math.cos(angle) * 19;
                const ry = sunY + Math.sin(angle) * 19;
                this.drawPixelRect(ctx, rx - 1, ry - 1, 3, 3, '#ffe082');
            }

            // Crisp inner solar disk
            this.drawPixelCircle(ctx, sunX, sunY, 11, '#ffffff', '#fff176');
            this.drawPixelCircle(ctx, sunX, sunY, 7, '#ffffff');
        }

        // Fluffy Layered Cumulus Clouds (2 Parallax layers)
        const cloudY1 = 22;
        const cloudY2 = 48;
        const speed1 = 0.12;
        const speed2 = 0.22;

        if (weather.type !== 'rainy') {
            // Far layer
            this.drawPixelCumulusCloud(ctx, ((width * 0.15 + this.frame * speed1) % (width + 120)) - 60, cloudY1, 0.85, 0.6);
            this.drawPixelCumulusCloud(ctx, ((width * 0.65 + this.frame * speed1) % (width + 120)) - 60, cloudY1 + 10, 0.75, 0.55);

            // Midground puffy cumulus clouds
            this.drawPixelCumulusCloud(ctx, ((width * 0.35 + this.frame * speed2) % (width + 140)) - 70, cloudY2, 1.25, 0.95);
            this.drawPixelCumulusCloud(ctx, ((width * 0.85 + this.frame * speed2) % (width + 140)) - 70, cloudY2 - 8, 1.1, 0.9);
        } else {
            // Dark brooding storm thunderheads
            this.drawStormNimbus(ctx, ((width * 0.2 + this.frame * 0.3) % (width + 180)) - 90, 20, 1.4);
            this.drawStormNimbus(ctx, ((width * 0.7 + this.frame * 0.25) % (width + 180)) - 90, 32, 1.2);
        }

        // Distinct Location Scenery Backdrop
        this.renderLocationBackdrop(ctx, width, height, locationId, groundY, weather);

        // Ground Infrastructure: Flagstone Sidewalk, Curb & Asphalt Road (for legacy/fallback)
        const isPreRendered = Boolean((locationId === 'suburbs' && this.suburbsBgLoaded) || (this.locationBgsLoaded && this.locationBgsLoaded[locationId]));
        if (!isPreRendered && !['suburbs', 'park', 'campus', 'downtown', 'metro', 'sports_complex', 'shopping_mall', 'hospital_plaza', 'convention_center', 'airport_terminal'].includes(locationId)) {
            this.renderStreetInfrastructure(ctx, width, height, groundY, weather);
        }
    }

    // High-Pixel Cumulus Cloud with 4-Tone Shading
    drawPixelCumulusCloud(ctx, x, y, scale = 1, alpha = 1.0) {
        ctx.save();
        ctx.globalAlpha = alpha;
        const rx = Math.round(x);
        const ry = Math.round(y);

        // Cloud base dimensions
        const w = Math.round(48 * scale);
        const h = Math.round(18 * scale);

        // Tone 1: Underside Lavender-Gray Shadow
        ctx.fillStyle = '#cad8e6';
        ctx.fillRect(rx + 4, ry + Math.round(h * 0.55), w - 8, Math.round(h * 0.45));
        ctx.fillRect(rx + 2, ry + Math.round(h * 0.7), w - 4, Math.round(h * 0.3));

        // Tone 2: Mid-body Soft Cloud Blue-White
        ctx.fillStyle = '#e8f1f8';
        ctx.fillRect(rx + 6, ry + Math.round(h * 0.25), Math.round(w * 0.75), Math.round(h * 0.65));
        ctx.fillRect(rx + Math.round(w * 0.2), ry + 4, Math.round(w * 0.5), Math.round(h * 0.6));

        // Tone 3: Bright Fluffy White Lobes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(rx + 10, ry + 6, Math.round(w * 0.28), Math.round(h * 0.5));
        ctx.fillRect(rx + Math.round(w * 0.32), ry + 2, Math.round(w * 0.34), Math.round(h * 0.65));
        ctx.fillRect(rx + Math.round(w * 0.58), ry + 8, Math.round(w * 0.25), Math.round(h * 0.45));

        // Stepped pixel contours along crown
        this.drawPixelRect(ctx, rx + Math.round(w * 0.38), ry, Math.round(w * 0.2), 3, '#ffffff');

        ctx.restore();
    }

    drawStormNimbus(ctx, x, y, scale = 1) {
        const rx = Math.round(x), ry = Math.round(y);
        const w = Math.round(64 * scale), h = Math.round(24 * scale);

        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(rx + 4, ry + Math.round(h * 0.5), w - 8, Math.round(h * 0.5));
        ctx.fillStyle = '#34495e';
        ctx.fillRect(rx + 8, ry + Math.round(h * 0.2), Math.round(w * 0.75), Math.round(h * 0.65));
        ctx.fillStyle = '#4a5b6d';
        ctx.fillRect(rx + Math.round(w * 0.25), ry + 4, Math.round(w * 0.45), Math.round(h * 0.5));
    }

    // -------------------------------------------------------------
    // STREET, PAVEMENT & SIDEWALK INFRASTRUCTURE
    // -------------------------------------------------------------
    renderStreetInfrastructure(ctx, width, height, groundY, weather) {
        const groundHeight = height - groundY;
        const sidewalkH = Math.round(groundHeight * 0.50); // ~68px
        const roadY = groundY + sidewalkH;
        const roadH = height - roadY;

        // 1. High-Pixel Interlocking Flagstone Sidewalk
        ctx.fillStyle = '#b0bec5'; // Base stone tone
        ctx.fillRect(0, groundY, width, sidewalkH);

        // Paver Tile Blocks with 3D Bevel Highlights & Recessed Mortar
        const tileW = 32;
        const tileH = 16;
        for (let y = groundY; y < roadY; y += tileH) {
            const rowIdx = Math.floor((y - groundY) / tileH);
            const xOffset = (rowIdx % 2 === 0) ? 0 : 16;
            for (let x = -16; x < width + 16; x += tileW) {
                const px = x + xOffset;
                const pw = tileW - 1;
                const ph = tileH - 1;

                // Subtle organic variation per tile
                const hash = (px * 37 + y * 13) % 7;
                let slabCol = '#cfd8dc';
                if (hash === 1) slabCol = '#d7dfe2';
                else if (hash === 2) slabCol = '#c2cbd0';
                else if (hash === 3) slabCol = '#bcc7cc';

                ctx.fillStyle = slabCol;
                ctx.fillRect(px, y, pw, ph);

                // Top & Left Specular Highlight
                ctx.fillStyle = '#eceff1';
                ctx.fillRect(px, y, pw, 1);
                ctx.fillRect(px, y, 1, ph);

                // Right & Bottom Shadow Edge
                ctx.fillStyle = '#90a4ae';
                ctx.fillRect(px, y + ph - 1, pw, 1);
                ctx.fillRect(px + pw - 1, y, 1, ph);
            }

            // Horizontal Mortar Seam
            ctx.fillStyle = '#78909c';
            ctx.fillRect(0, y + tileH - 1, width, 1);
        }

        // 2. Chiseled Granite Curb Stone with Bevel (Height: 6px)
        const curbY = roadY - 4;
        ctx.fillStyle = '#e0e0e0'; // Curb top bright highlight
        ctx.fillRect(0, curbY, width, 2);
        ctx.fillStyle = '#9e9e9e'; // Curb face midtone
        ctx.fillRect(0, curbY + 2, width, 3);
        ctx.fillStyle = '#616161'; // Curb bottom shadow
        ctx.fillRect(0, curbY + 5, width, 1);

        // Vertical curb stone joints every 40px
        ctx.fillStyle = '#424242';
        for (let cx = 0; cx < width; cx += 40) {
            ctx.fillRect(cx, curbY, 1, 6);
        }

        // 3. Asphalt Street (Deep aggregate texture)
        ctx.fillStyle = '#1e272e';
        ctx.fillRect(0, roadY + 2, width, roadH);

        // Aggregate asphalt texture speckles
        ctx.fillStyle = '#2d3436';
        for (let ax = 4; ax < width; ax += 12) {
            const ay = roadY + 8 + ((ax * 17) % Math.max(1, roadH - 16));
            ctx.fillRect(ax, ay, 2, 1);
        }

        // Storm Sewer Drainage Grate near curb
        this.drawSewerGrate(ctx, 140, roadY + 3);

        // Yellow Road Markings (Weathered retro dashed lane line)
        const laneY = Math.round(roadY + roadH * 0.48);
        const dashLen = 36;
        const dashGap = 24;
        ctx.fillStyle = '#f1c40f';
        for (let lx = 10; lx < width; lx += dashLen + dashGap) {
            ctx.fillRect(lx, laneY, dashLen, 4);
            // Weathered road paint edge
            ctx.fillStyle = '#d4ac0d';
            ctx.fillRect(lx, laneY + 3, dashLen, 1);
            ctx.fillStyle = '#f1c40f';
        }

        // Wet Puddle Reflections on Rainy Days
        if (weather && weather.type === 'rainy') {
            ctx.fillStyle = 'rgba(100, 150, 200, 0.35)';
            // Puddle 1 on sidewalk
            ctx.beginPath();
            ctx.ellipse(210, groundY + 34, 45, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            // Ambient reflection of warm streetlamp & cafe lights
            ctx.fillStyle = 'rgba(255, 235, 170, 0.28)';
            ctx.fillRect(195, groundY + 31, 30, 2);
            ctx.fillRect(202, groundY + 34, 18, 2);

            // Puddle 2 on road
            ctx.fillStyle = 'rgba(70, 110, 150, 0.45)';
            ctx.beginPath();
            ctx.ellipse(460, roadY + 22, 65, 11, 0, 0, Math.PI * 2);
            ctx.fill();
            // Shimmering reflection of neon / headlights in asphalt puddle
            ctx.fillStyle = 'rgba(0, 255, 204, 0.22)';
            ctx.fillRect(445, roadY + 20, 32, 2);
            ctx.fillRect(452, roadY + 23, 18, 2);
        } else if (weather && weather.type === 'freezing') {
            // Crisp Snow Layer along curb stones
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(0, curbY - 1, width, 2);
        }

        // Vintage Street Lamps on Sidewalk (Cast warm ambient light halos)
        this.renderStreetLamp(ctx, 42, groundY + 12);
        this.renderStreetLamp(ctx, width - 42, groundY + 12);

        // Cozy Street Furniture & Props:
        // A-Frame Sidewalk Chalkboard Sign
        this.renderSidewalkChalkboard(ctx, 175, groundY + 28);

        // Outdoor Cafe Bistro Table & Stools
        this.renderBistroTable(ctx, 435, groundY + 22);

        // Flower Planters with Blooming Blossoms
        this.renderFlowerPlanter(ctx, 120, groundY + 20);
        this.renderFlowerPlanter(ctx, 510, groundY + 20);
    }

    drawSewerGrate(ctx, x, y) {
        ctx.fillStyle = '#0f171e';
        ctx.fillRect(x, y, 28, 12);
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(x + 1, y + 1, 26, 10);
        // Cast iron bars
        ctx.fillStyle = '#111827';
        for (let bx = x + 3; bx < x + 26; bx += 3) {
            ctx.fillRect(bx, y + 2, 1, 8);
        }
    }

    // Vintage Cast-Iron Street Lamp with Warm Radial Ambient Glow
    renderStreetLamp(ctx, x, footY) {
        const lx = Math.round(x);
        const ly = Math.round(footY);
        const lampHeight = 85;
        const lampTopY = ly - lampHeight;

        // Ambient Warm Light Halo on ground and air
        if (typeof ctx.createRadialGradient === 'function') {
            const lightGlow = ctx.createRadialGradient(lx, lampTopY + 8, 2, lx, lampTopY + 8, 16);
            lightGlow.addColorStop(0, 'rgba(255, 245, 157, 0.35)');
            lightGlow.addColorStop(0.6, 'rgba(255, 215, 0, 0.12)');
            lightGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = lightGlow;
            if (typeof ctx.beginPath === 'function' && typeof ctx.arc === 'function' && typeof ctx.fill === 'function') {
                ctx.beginPath();
                ctx.arc(lx, lampTopY + 8, 16, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Pedestal base
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(lx - 5, ly - 6, 10, 6);
        ctx.fillStyle = '#334155';
        ctx.fillRect(lx - 4, ly - 10, 8, 4);

        // Fluted Cast-Iron Column
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(lx - 2, lampTopY + 16, 4, lampHeight - 26);
        ctx.fillStyle = '#475569'; // Column edge highlight
        ctx.fillRect(lx - 2, lampTopY + 16, 1, lampHeight - 26);

        // Ladder crossbar
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(lx - 6, lampTopY + 28, 12, 2);

        // Hexagonal Lantern Housing
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(lx - 7, lampTopY + 14, 14, 3); // Base plate
        ctx.fillStyle = '#ffecb3'; // Glowing glass interior
        ctx.fillRect(lx - 6, lampTopY + 4, 12, 10);
        ctx.fillStyle = '#fff9c4'; // Bulb core
        ctx.fillRect(lx - 3, lampTopY + 6, 6, 6);

        // Glass frame mullions
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(lx - 6, lampTopY + 4, 1, 10);
        ctx.fillRect(lx + 5, lampTopY + 4, 1, 10);
        ctx.fillRect(lx - 1, lampTopY + 4, 2, 10);

        // Domed Cap & Finial Spire
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(lx - 8, lampTopY + 2, 16, 3);
        ctx.fillRect(lx - 5, lampTopY - 1, 10, 3);
        ctx.fillRect(lx - 1, lampTopY - 4, 2, 4); // Tip
    }

    // Sidewalk Chalkboard Sandwich Board ("Fresh Roast ☕")
    renderSidewalkChalkboard(ctx, x, y) {
        const rx = Math.round(x), ry = Math.round(y);

        // Wooden A-Frame Legs & Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(rx - 2, ry + 24, 26, 4);

        ctx.fillStyle = '#4e342e'; // Oak wood frame
        ctx.fillRect(rx, ry, 22, 25);
        ctx.fillStyle = '#795548';
        ctx.fillRect(rx + 1, ry + 1, 20, 23);

        // Slate Chalkboard Face
        ctx.fillStyle = '#212121';
        ctx.fillRect(rx + 3, ry + 3, 16, 18);

        // Chalk Coffee Art & Text
        ctx.fillStyle = '#ffffff';
        // Coffee Cup Doodle
        ctx.fillRect(rx + 8, ry + 6, 6, 4);
        ctx.fillRect(rx + 7, ry + 6, 1, 3);
        ctx.fillRect(rx + 14, ry + 7, 2, 2); // Handle
        // Steam wisp
        ctx.fillStyle = '#ffe082';
        ctx.fillRect(rx + 9, ry + 4, 1, 1);
        ctx.fillRect(rx + 11, ry + 4, 1, 1);

        // Chalk text dots ("ROAST")
        ctx.fillStyle = '#81d4fa';
        ctx.fillRect(rx + 5, ry + 12, 12, 2);
        ctx.fillStyle = '#fff59d';
        ctx.fillRect(rx + 6, ry + 15, 10, 2);
    }

    // Outdoor Cafe Bistro Table & Stools
    renderBistroTable(ctx, x, y) {
        const rx = Math.round(x), ry = Math.round(y);

        // Floor Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(rx + 14, ry + 22, 22, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stool Left
        ctx.fillStyle = '#212121';
        ctx.fillRect(rx + 1, ry + 14, 2, 9);
        ctx.fillRect(rx + 7, ry + 14, 2, 9);
        ctx.fillStyle = '#8d6e63'; // Wood seat
        ctx.fillRect(rx - 1, ry + 12, 12, 3);
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(rx, ry + 12, 10, 1);

        // Stool Right
        ctx.fillStyle = '#212121';
        ctx.fillRect(rx + 21, ry + 14, 2, 9);
        ctx.fillRect(rx + 27, ry + 14, 2, 9);
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(rx + 19, ry + 12, 12, 3);
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(rx + 20, ry + 12, 10, 1);

        // Center Table Stand & Pedestal
        ctx.fillStyle = '#263238';
        ctx.fillRect(rx + 13, ry + 6, 4, 16);
        ctx.fillRect(rx + 10, ry + 20, 10, 3); // Fluted base

        // Table Top (Round Beveled Table with Check Tablecloth)
        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(rx + 5, ry + 4, 20, 4);
        ctx.fillStyle = '#c0392b'; // Red & white check
        ctx.fillRect(rx + 6, ry + 2, 18, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(rx + 8, ry + 2, 3, 2);
        ctx.fillRect(rx + 14, ry + 2, 3, 2);

        // Espresso Demitasse Cup on Table with Steam!
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(rx + 13, ry, 4, 3);
        ctx.fillStyle = '#e67e22'; // Coffee foam surface
        ctx.fillRect(rx + 14, ry, 2, 1);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(rx + 14, ry - 3, 1, 2);
    }

    // Flower Planter Urn
    renderFlowerPlanter(ctx, x, y) {
        const rx = Math.round(x), ry = Math.round(y);

        // Terracotta Urn
        ctx.fillStyle = '#d35400';
        ctx.fillRect(rx + 1, ry + 6, 14, 10);
        ctx.fillStyle = '#e67e22';
        ctx.fillRect(rx, ry + 4, 16, 3); // Rim
        ctx.fillStyle = '#ba4a00';
        ctx.fillRect(rx + 2, ry + 14, 12, 2); // Base

        // Lush Leaves
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(rx - 1, ry + 1, 18, 4);
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(rx + 2, ry - 1, 12, 3);

        // Blossoms (Red, Gold, Lavender)
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(rx + 2, ry - 1, 3, 3);
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(rx + 7, ry - 2, 3, 3);
        ctx.fillStyle = '#9b59b6';
        ctx.fillRect(rx + 12, ry, 3, 3);
    }

    // -------------------------------------------------------------
    // LOCATION BACKDROPS (20 DISTINCT 16-BIT PIXEL WORLDS)
    // -------------------------------------------------------------
    renderLocationBackdrop(ctx, width, height, locationId, groundY, weather) {
        const bgImg = (locationId === 'suburbs' && this.suburbsBg) ? this.suburbsBg : (this.locationBgs && this.locationBgs[locationId]);
        const isLoaded = Boolean((locationId === 'suburbs' && this.suburbsBgLoaded) || (this.locationBgsLoaded && this.locationBgsLoaded[locationId]));

        if (isLoaded && bgImg && typeof ctx.drawImage === 'function') {
            try {
                ctx.save();
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(bgImg, 0, 0, width, height);
                ctx.restore();
                return;
            } catch (e) {
                ctx.restore();
            }
        }

        if (locationId === 'suburbs') {
            this.renderSuburbsBackdrop(ctx, width, groundY, weather);
        } else if (locationId === 'park') {
            this.renderParkBackdrop(ctx, width, groundY, weather);
        } else if (locationId === 'campus') {
            this.renderCampusBackdrop(ctx, width, groundY, weather);
        } else if (locationId === 'metro') {
            this.renderMetroBackdrop(ctx, width, groundY, weather);
        } else if (locationId === 'downtown') {
            this.renderDowntownBackdrop(ctx, width, groundY, weather);
        } else {
            this.renderProceduralLocationBackdrop(ctx, width, height, locationId, groundY, weather);
        }
    }

    // 1. Greenwood Suburbs: Authentic 2.5D Isometric Top-Down Neighborhood
    // Modeled directly on classic Lemonade Tycoon reference screenshot (Purple house, diagonal street, hedges, dormered olive cottage)
    renderSuburbsBackdrop(ctx, width, groundY, weather) {
        const height = 360;

        // Render High-Pixel Pre-rendered Background if available
        if (this.suburbsBgLoaded && this.suburbsBg) {
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(this.suburbsBg, 0, 0, width, height);
            ctx.restore();
            return;
        }

        const isSnowy = weather && weather.type === 'freezing';

        // 1. Base Isometric Emerald Lawn & Dither Texture
        ctx.fillStyle = isSnowy ? '#dcefe3' : '#1e8e3d';
        ctx.fillRect(0, 0, width, height);

        // Lawn Dither Dots
        ctx.fillStyle = isSnowy ? '#c8e2d1' : '#28a745';
        for (let py = 0; py < height; py += 12) {
            const shift = (Math.floor(py / 12) % 2) * 8;
            for (let px = shift; px < width; px += 16) {
                ctx.fillRect(px, py, 2, 2);
            }
        }

        // 2. Diagonal Asphalt Roadway (2.5D Isometric Slope)
        // Runs diagonally across from bottom-left (-40, 310) to upper-right (680, 150)
        ctx.fillStyle = '#3a3d43';
        ctx.beginPath();
        ctx.moveTo(-40, 305);
        ctx.lineTo(680, 145);
        ctx.lineTo(680, 240);
        ctx.lineTo(-40, 400);
        ctx.closePath();
        ctx.fill();

        // Asphalt subtle dither grain
        ctx.fillStyle = '#32353b';
        for (let ry = 150; ry < 360; ry += 10) {
            const rxBase = Math.round((ry - 150) / 0.22);
            for (let rx = rxBase - 120; rx < rxBase + 120; rx += 14) {
                if (rx >= 0 && rx < width) ctx.fillRect(rx, ry, 2, 1);
            }
        }

        // Center Dashed Yellow Divider Line
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let d = -20; d < width + 40; d += 36) {
            const dy1 = Math.round(350 - (d - (-20)) * 0.22);
            const dy2 = Math.round(350 - (d + 20 - (-20)) * 0.22);
            ctx.moveTo(d, dy1);
            ctx.lineTo(d + 20, dy2);
        }
        ctx.stroke();

        // Oval Cast-Iron Manhole Cover in Roadway (Centered at x=290, y=240)
        ctx.fillStyle = '#1c1e22';
        ctx.beginPath();
        ctx.ellipse(290, 240, 17, 8, -0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2d3036';
        ctx.beginPath();
        ctx.ellipse(290, 240, 14, 6, -0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1c1e22';
        ctx.fillRect(282, 239, 16, 2);
        ctx.fillRect(289, 235, 2, 10);

        // 3. Concrete Sidewalks with Curbs & Expansion Score Lines
        // Upper Sidewalk (in front of purple house & background houses)
        ctx.fillStyle = '#c8cbcf';
        ctx.beginPath();
        ctx.moveTo(-40, 280);
        ctx.lineTo(680, 120);
        ctx.lineTo(680, 145);
        ctx.lineTo(-40, 305);
        ctx.closePath();
        ctx.fill();

        // Upper Curb Highlight & Shadow
        ctx.fillStyle = '#eef0f2';
        ctx.fillRect(0, 0, 1, 1); // op
        ctx.beginPath();
        ctx.moveTo(-40, 280);
        ctx.lineTo(680, 120);
        ctx.strokeStyle = '#eef0f2';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-40, 305);
        ctx.lineTo(680, 145);
        ctx.strokeStyle = '#7c8085';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Diagonal score lines on upper sidewalk
        ctx.strokeStyle = '#9ca0a5';
        ctx.lineWidth = 1;
        for (let sx = -20; sx < width + 30; sx += 26) {
            const sy = Math.round(302 - (sx - (-20)) * 0.22);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx - 8, sy - 20);
            ctx.stroke();
        }

        // Lower Sidewalk (in front of bottom-right olive cottage)
        ctx.fillStyle = '#c8cbcf';
        ctx.beginPath();
        ctx.moveTo(-40, 400);
        ctx.lineTo(680, 240);
        ctx.lineTo(680, 264);
        ctx.lineTo(-40, 424);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-40, 400);
        ctx.lineTo(680, 240);
        ctx.strokeStyle = '#eef0f2';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 4. Background Houses (Top-Right of Street, matching Lemonade Tycoon)
        // House 1 (Caramel Brown, Green Roof, Teal Door)
        const bhX1 = 330, bhY1 = 80;
        ctx.fillStyle = '#b37d4e';
        ctx.fillRect(bhX1, bhY1 - 50, 75, 50);
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.moveTo(bhX1 - 8, bhY1 - 50);
        ctx.lineTo(bhX1 + 38, bhY1 - 78);
        ctx.lineTo(bhX1 + 83, bhY1 - 50);
        ctx.closePath();
        ctx.fill();
        // Door & Windows
        ctx.fillStyle = '#1abc9c';
        ctx.fillRect(bhX1 + 10, bhY1 - 28, 12, 28);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bhX1 + 34, bhY1 - 36, 14, 18);
        ctx.fillRect(bhX1 + 54, bhY1 - 36, 14, 18);
        ctx.fillStyle = '#80d8ff';
        ctx.fillRect(bhX1 + 36, bhY1 - 34, 10, 14);
        ctx.fillRect(bhX1 + 56, bhY1 - 34, 10, 14);

        // House 2 (Tan, Green Roof, Mailbox)
        const bhX2 = 470, bhY2 = 48;
        ctx.fillStyle = '#a67c52';
        ctx.fillRect(bhX2, bhY2 - 45, 80, 45);
        ctx.fillStyle = '#218c4e';
        ctx.beginPath();
        ctx.moveTo(bhX2 - 6, bhY2 - 45);
        ctx.lineTo(bhX2 + 40, bhY2 - 70);
        ctx.lineTo(bhX2 + 86, bhY2 - 45);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#16a085';
        ctx.fillRect(bhX2 + 55, bhY2 - 26, 12, 26);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bhX2 + 14, bhY2 - 34, 14, 16);
        ctx.fillStyle = '#80d8ff';
        ctx.fillRect(bhX2 + 16, bhY2 - 32, 10, 12);

        // Curbside Mailbox on Post
        this.drawCurbsideMailbox(ctx, 440, bhY1 + 12);

        // Manicured Garden Hedges along background sidewalk
        this.drawGardenHedge(ctx, 280, bhY1 + 14, 65, 11);
        this.drawGardenHedge(ctx, 520, bhY2 + 26, 75, 11);

        // 5. The Iconic Purple House on Upper-Left (Matching Lemonade Tycoon Reference!)
        // Main House Structure
        const phX = 0, phY = 210;
        // Shadow base
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.fillRect(phX, phY - 2, 155, 6);

        // Plum Purple Clapboard Siding Walls
        ctx.fillStyle = '#5e3263';
        ctx.fillRect(phX, phY - 145, 145, 145);
        ctx.fillStyle = '#48224d'; // Left shadow face
        ctx.fillRect(phX, phY - 145, 18, 145);

        // Siding grooves
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        for (let ply = phY - 140; ply < phY; ply += 11) {
            ctx.fillRect(phX, ply, 145, 1);
        }

        // Tan/Salmon Gabled Roof
        ctx.fillStyle = '#cf9f92';
        ctx.beginPath();
        ctx.moveTo(phX - 10, phY - 145);
        ctx.lineTo(phX + 72, phY - 205);
        ctx.lineTo(phX + 155, phY - 145);
        ctx.closePath();
        ctx.fill();

        // Roof ridge & eave shadow
        ctx.fillStyle = '#b27f72';
        ctx.fillRect(phX - 10, phY - 145, 165, 3);
        ctx.fillStyle = '#5d3e38';
        ctx.fillRect(phX, phY - 142, 145, 4);

        // Upper Double-Hung Windows
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(phX + 38, phY - 125, 18, 26);
        ctx.fillRect(phX + 88, phY - 125, 18, 26);
        ctx.fillStyle = '#80d8ff';
        ctx.fillRect(phX + 40, phY - 123, 14, 22);
        ctx.fillRect(phX + 90, phY - 123, 14, 22);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(phX + 40, phY - 113, 14, 2);
        ctx.fillRect(phX + 90, phY - 113, 14, 2);

        // Large Lower Window with Floral Flower Box
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(phX + 75, phY - 78, 38, 32);
        ctx.fillStyle = '#80d8ff';
        ctx.fillRect(phX + 78, phY - 75, 32, 26);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(phX + 78, phY - 63, 32, 2);
        ctx.fillRect(phX + 93, phY - 75, 2, 26);

        // Flower Box overflowing with vibrant blossoms
        ctx.fillStyle = '#4e342e';
        ctx.fillRect(phX + 72, phY - 45, 44, 6);
        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(phX + 70, phY - 49, 48, 5);
        // Blossoms
        ctx.fillStyle = '#e91e63';
        ctx.fillRect(phX + 74, phY - 51, 3, 3);
        ctx.fillRect(phX + 92, phY - 51, 3, 3);
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(phX + 82, phY - 52, 3, 3);
        ctx.fillRect(phX + 102, phY - 50, 3, 3);

        // Front Porch with Gabled Awning & Posts
        const pchX = phX + 24, pchY = phY;
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(pchX + 6, pchY - 58, 22, 58); // Door
        ctx.fillStyle = '#8d6e63'; // Porch deck
        ctx.fillRect(pchX - 2, pchY - 8, 38, 8);
        ctx.fillStyle = '#ffffff'; // Support posts
        ctx.fillRect(pchX, pchY - 48, 3, 40);
        ctx.fillRect(pchX + 32, pchY - 48, 3, 40);
        // Porch Awning Roof
        ctx.fillStyle = '#b27f72';
        ctx.beginPath();
        ctx.moveTo(pchX - 6, pchY - 48);
        ctx.lineTo(pchX + 17, pchY - 64);
        ctx.lineTo(pchX + 40, pchY - 48);
        ctx.closePath();
        ctx.fill();

        // Flagstone Walkway connecting porch to front sidewalk
        ctx.fillStyle = '#d5d8dc';
        ctx.fillRect(pchX + 4, pchY + 2, 26, 8);
        ctx.fillRect(pchX + 10, pchY + 10, 24, 8);
        ctx.fillRect(pchX + 18, pchY + 18, 26, 8);

        // Trimmed Lollipop Tree on Front Lawn
        const treeX = phX + 95, treeY = phY + 45;
        ctx.fillStyle = '#4e342e';
        ctx.fillRect(treeX - 2, treeY - 14, 4, 14); // Trunk
        this.drawPixelCircle(ctx, treeX, treeY - 24, 14, '#2ecc71', '#1e8449');
        this.drawPixelCircle(ctx, treeX - 3, treeY - 28, 6, '#58d68d');

        // 6. Foreground Olive-Green Cottage on Lower-Right (Matching Lemonade Tycoon Reference!)
        const ohX = 430, ohY = 385;
        // Olive walls
        ctx.fillStyle = '#7a8c54';
        ctx.fillRect(ohX, ohY - 65, 140, 65);
        ctx.fillStyle = '#5c6b3e';
        ctx.fillRect(ohX + 120, ohY - 65, 20, 65);

        // Pitch Slate-Teal Roof
        ctx.fillStyle = '#4d7c79';
        ctx.beginPath();
        ctx.moveTo(ohX - 12, ohY - 65);
        ctx.lineTo(ohX + 55, ohY - 100);
        ctx.lineTo(ohX + 152, ohY - 65);
        ctx.closePath();
        ctx.fill();

        // Dual Protruding Dormer Windows on Slate Roof
        const drawDormer = (dx, dy) => {
            ctx.fillStyle = '#3a6361';
            ctx.fillRect(dx, dy, 16, 16);
            ctx.fillStyle = '#4d7c79';
            ctx.beginPath();
            ctx.moveTo(dx - 2, dy);
            ctx.lineTo(dx + 8, dy - 10);
            ctx.lineTo(dx + 18, dy);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(dx + 2, dy + 2, 12, 12);
            ctx.fillStyle = '#80d8ff';
            ctx.fillRect(dx + 4, dy + 4, 8, 8);
        };
        drawDormer(ohX + 22, ohY - 92);
        drawDormer(ohX + 75, ohY - 92);

        // Red Brick Chimney on Roof with Curling Smoke
        ctx.fillStyle = '#8d2b1f';
        ctx.fillRect(ohX + 10, ohY - 106, 12, 18);
        ctx.fillStyle = '#b73d2d';
        ctx.fillRect(ohX + 11, ohY - 105, 10, 16);
        ctx.fillStyle = '#37474f';
        ctx.fillRect(ohX + 8, ohY - 109, 16, 3); // Cap

        // Smoke puffs
        this.chimneySmoke.forEach(sm => {
            ctx.fillStyle = `rgba(240, 240, 245, ${sm.alpha})`;
            this.drawPixelCircle(ctx, ohX + 16 + sm.x, ohY - 114 + sm.y, sm.size);
        });

        // Sliding Patio Glass Door with Wooden Deck
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(ohX + 45, ohY - 8, 48, 8); // Deck
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ohX + 50, ohY - 48, 38, 42);
        ctx.fillStyle = '#80d8ff';
        ctx.fillRect(ohX + 53, ohY - 45, 15, 36);
        ctx.fillRect(ohX + 71, ohY - 45, 15, 36);

        // Red Push Lawnmower on Foreground Grass (Matching Lemonade Tycoon!)
        const lmX = 360, lmY = 338;
        ctx.fillStyle = '#d32f2f'; // Red chassis
        ctx.fillRect(lmX, lmY - 6, 16, 8);
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(lmX + 2, lmY - 8, 10, 3); // Engine block
        ctx.fillStyle = '#212121'; // Black wheels
        this.drawPixelCircle(ctx, lmX + 3, lmY + 3, 3, '#212121');
        this.drawPixelCircle(ctx, lmX + 13, lmY + 3, 3, '#212121');
        // Handle bar
        ctx.strokeStyle = '#9e9e9e';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lmX, lmY - 4);
        ctx.lineTo(lmX - 10, lmY - 18);
        ctx.stroke();

        // Foreground Hedge / Bush
        this.drawPixelCircle(ctx, 305, 345, 13, '#27ae60', '#196f3d');
    }

    drawCraftsmanHouse(ctx, x, y, wallCol, roofCol, hasChimney, weather) {
        const hx = Math.round(x);
        const hy = Math.round(y);
        const houseW = 110;
        const houseH = 68;

        // Foundation / Stone Base
        ctx.fillStyle = '#546e7a';
        ctx.fillRect(hx, hy - 8, houseW, 8);

        // Wooden Clapboard Siding Walls
        ctx.fillStyle = wallCol;
        ctx.fillRect(hx + 4, hy - houseH, houseW - 8, houseH - 8);

        // Horizontal Siding Planks
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        for (let sy = hy - houseH; sy < hy - 8; sy += 7) {
            ctx.fillRect(hx + 4, sy, houseW - 8, 1);
        }

        // Overlapping Cedar Shingle Roof with Individual Shingle Detail
        const roofOverhang = 12;
        const roofApexY = hy - houseH - 34;
        const roofBaseY = hy - houseH;

        ctx.fillStyle = roofCol;
        ctx.beginPath();
        ctx.moveTo(hx - roofOverhang, roofBaseY);
        ctx.lineTo(hx + houseW / 2, roofApexY);
        ctx.lineTo(hx + houseW + roofOverhang, roofBaseY);
        ctx.closePath();
        ctx.fill();

        // Shingle Rows & Texture
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
        for (let s = 1; s <= 4; s++) {
            const rowY = roofBaseY - s * 7;
            const inset = s * 9;
            ctx.fillRect(hx - roofOverhang + inset, rowY, (houseW + roofOverhang * 2) - inset * 2, 1);
        }

        // Winter Snow Ridge on roof when freezing
        if (weather && weather.type === 'freezing') {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(hx - roofOverhang, roofBaseY);
            ctx.lineTo(hx + houseW / 2, roofApexY);
            ctx.lineTo(hx + houseW + roofOverhang, roofBaseY);
            ctx.lineTo(hx + houseW + roofOverhang, roofBaseY - 2);
            ctx.lineTo(hx + houseW / 2, roofApexY - 3);
            ctx.lineTo(hx - roofOverhang, roofBaseY - 2);
            ctx.closePath();
            ctx.fill();
        }

        // Brick Chimney with Mortar Lines & Animated Curling Smoke
        if (hasChimney) {
            const chX = hx + 18;
            const chY = roofApexY - 10;
            ctx.fillStyle = '#8d2b1f';
            ctx.fillRect(chX, chY, 14, 30);
            ctx.fillStyle = '#b73d2d';
            ctx.fillRect(chX + 1, chY + 1, 12, 28);
            // Cap
            ctx.fillStyle = '#424242';
            ctx.fillRect(chX - 2, chY - 2, 18, 4);

            // Smoke Puffs
            this.chimneySmoke.forEach(sm => {
                ctx.fillStyle = `rgba(240, 240, 245, ${sm.alpha})`;
                this.drawPixelCircle(ctx, chX + 7 + sm.x, chY - 4 + sm.y, sm.size);
            });
        }

        // Dormer Window on Roof
        ctx.fillStyle = wallCol;
        ctx.fillRect(hx + houseW / 2 - 12, roofBaseY - 20, 24, 20);
        ctx.fillStyle = '#fff9c4'; // Lit dormer glass
        ctx.fillRect(hx + houseW / 2 - 8, roofBaseY - 16, 16, 12);
        ctx.fillStyle = '#424242';
        ctx.fillRect(hx + houseW / 2 - 1, roofBaseY - 16, 2, 12); // Pane divider

        // Windows with Warm Interior Light, Curtains & Flower Box
        this.drawSashWindow(ctx, hx + 16, hy - 46, 20, 26, true);
        this.drawSashWindow(ctx, hx + houseW - 36, hy - 46, 20, 26, true);

        // Front Door with Transom & Brass Knocker
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(hx + houseW / 2 - 12, hy - 38, 24, 38);
        ctx.fillStyle = '#37474f';
        ctx.fillRect(hx + houseW / 2 - 10, hy - 36, 20, 36);
        ctx.fillStyle = '#f1c40f'; // Brass knob
        ctx.fillRect(hx + houseW / 2 + 5, hy - 18, 3, 3);
    }

    drawSashWindow(ctx, x, y, w, h, hasFlowerBox) {
        // Timber window casing
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 2, y - 2, w + 4, h + 4);

        // Lit Glass Pane
        ctx.fillStyle = '#fff9c4';
        ctx.fillRect(x, y, w, h);

        // Cozy Floral Curtains Inside
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x, y, 4, h - 4);
        ctx.fillRect(x + w - 4, y, 4, h - 4);

        // Timber Muntin Bars (Cross dividers)
        ctx.fillStyle = '#37474f';
        ctx.fillRect(x + Math.round(w / 2) - 1, y, 2, h);
        ctx.fillRect(x, y + Math.round(h / 2) - 1, w, 2);

        // Window Flower Box Overflowing with Petunias
        if (hasFlowerBox) {
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(x - 3, y + h, w + 6, 6);
            ctx.fillStyle = '#27ae60'; // Leaves
            ctx.fillRect(x - 2, y + h - 3, w + 4, 4);
            // Blossoms
            ctx.fillStyle = '#e91e63';
            ctx.fillRect(x, y + h - 4, 3, 3);
            ctx.fillRect(x + 6, y + h - 5, 3, 3);
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(x + 12, y + h - 4, 3, 3);
        }
    }

    drawPicketFence(ctx, startX, y, width) {
        ctx.fillStyle = '#eceff1';
        // Horizontal rails
        ctx.fillRect(startX, y + 4, width, 2);
        ctx.fillRect(startX, y + 12, width, 2);

        // Vertical Pointed Pickets
        for (let px = startX + 4; px < startX + width; px += 10) {
            ctx.fillRect(px, y + 2, 4, 16);
            // Pointed spear top
            ctx.fillRect(px + 1, y, 2, 2);
        }
    }

    drawCurbsideMailbox(ctx, x, y) {
        // Wooden post
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(x + 4, y, 4, 18);
        // Rounded metal mailbox
        ctx.fillStyle = '#37474f';
        ctx.fillRect(x, y - 10, 14, 10);
        ctx.fillStyle = '#546e7a';
        ctx.fillRect(x + 1, y - 9, 12, 3);
        // Red flag
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x + 13, y - 8, 4, 3);
    }

    // High-Pixel Tree with Clustered Multi-Lobed Canopy Shading
    drawHighPixelTree(ctx, x, footY, radius = 28, isSnowy = false) {
        const tx = Math.round(x);
        const ty = Math.round(footY);

        // Textured Trunk with Root Buttresses
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(tx - 5, ty - 42, 10, 42);
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(tx - 4, ty - 40, 6, 40);
        // Roots spreading
        ctx.fillRect(tx - 7, ty - 6, 14, 6);

        // Leaf Canopy: 4-tone organic overlapping leaf clusters
        const canopyY = ty - 56;
        const r = radius;

        // Shadow / Deep Foliage Underbelly
        this.drawPixelCircle(ctx, tx, canopyY + 6, r, '#1b5e20');
        this.drawPixelCircle(ctx, tx - 12, canopyY + 4, r * 0.75, '#1b5e20');
        this.drawPixelCircle(ctx, tx + 12, canopyY + 4, r * 0.75, '#1b5e20');

        // Mid-tone Lush Leaves
        this.drawPixelCircle(ctx, tx, canopyY, r * 0.9, '#2e7d32');
        this.drawPixelCircle(ctx, tx - 10, canopyY - 4, r * 0.7, '#2e7d32');
        this.drawPixelCircle(ctx, tx + 10, canopyY - 4, r * 0.7, '#2e7d32');

        // Sunlit Canopy Highlights
        this.drawPixelCircle(ctx, tx - 4, canopyY - 8, r * 0.65, '#4caf50');
        this.drawPixelCircle(ctx, tx + 6, canopyY - 10, r * 0.5, '#4caf50');

        // Brightest Top Crest
        this.drawPixelCircle(ctx, tx - 2, canopyY - 14, r * 0.35, '#81c784');

        // Winter Snow Frosting on Canopy Ridge
        if (isSnowy) {
            this.drawPixelCircle(ctx, tx - 2, canopyY - 14, r * 0.35, '#ffffff');
            this.drawPixelCircle(ctx, tx - 6, canopyY - 11, r * 0.25, '#ffffff');
            this.drawPixelCircle(ctx, tx + 4, canopyY - 12, r * 0.22, '#ffffff');
        }
    }

    // High-Pixel Manicured Garden Hedge with Foliage Shading & Berry/Floral Accents
    drawGardenHedge(ctx, x, y, w, h) {
        const rx = Math.round(x);
        const ry = Math.round(y);
        const rw = Math.round(w);
        const rh = Math.round(h);

        // Deep Shadow Base Foliage
        ctx.fillStyle = '#14532d';
        ctx.fillRect(rx, ry + Math.round(rh * 0.4), rw, Math.round(rh * 0.6));

        // Midtone Dense Leaves
        ctx.fillStyle = '#166534';
        ctx.fillRect(rx, ry + Math.round(rh * 0.2), rw, Math.round(rh * 0.5));
        ctx.fillStyle = '#15803d';
        ctx.fillRect(rx, ry, rw, Math.round(rh * 0.7));

        // Sunlit Top Leaf Tuft Clusters
        ctx.fillStyle = '#22c55e';
        for (let bx = rx; bx < rx + rw; bx += 6) {
            const tuftH = 2 + ((bx * 7) % 3);
            ctx.fillRect(bx, ry - tuftH, Math.min(5, rx + rw - bx), tuftH + 3);
            // Bright specular leaf tip
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(bx + 1, ry - tuftH, 2, 1);
            ctx.fillStyle = '#22c55e';
        }

        // Tiny Flower Buds / Red Berry Accents
        for (let bx = rx + 3; bx < rx + rw - 3; bx += 14) {
            const by = ry + 2 + ((bx * 13) % Math.max(1, rh - 4));
            ctx.fillStyle = '#ef4444'; // Red berry
            ctx.fillRect(bx, by, 2, 2);
            ctx.fillStyle = '#fde047'; // Golden pollen glint
            ctx.fillRect(bx + 1, by, 1, 1);
        }
    }

    // 2. City Park: Authentic 2.5D Isometric Top-Down Botanical Gardens & Grand Promenade
    renderParkBackdrop(ctx, width, groundY, weather) {
        const height = 360;

        // Render High-Pixel Pre-rendered Background if available
        const parkImg = (this.locationBgs && this.locationBgs.park) || null;
        if (this.locationBgsLoaded && this.locationBgsLoaded.park && parkImg) {
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(parkImg, 0, 0, width, height);
            ctx.restore();
            return;
        }

        const isSnowy = weather && weather.type === 'freezing';

        // 1. Base Isometric Emerald Botanical Lawn
        ctx.fillStyle = isSnowy ? '#dcefe3' : '#1e8e3d';
        ctx.fillRect(0, 0, width, height);

        // Lawn Dither Dots
        ctx.fillStyle = isSnowy ? '#c8e2d1' : '#27ae60';
        for (let py = 0; py < height; py += 12) {
            const shift = (Math.floor(py / 12) % 2) * 8;
            for (let px = shift; px < width; px += 16) {
                ctx.fillRect(px, py, 2, 2);
            }
        }

        // 2. Diagonal Grand Cobblestone Promenade (2.5D Isometric Slope)
        // Runs diagonally across from bottom-left (-40, 305) to upper-right (680, 145)
        ctx.fillStyle = isSnowy ? '#cbd5e1' : '#a89f91';
        ctx.beginPath();
        ctx.moveTo(-40, 305);
        ctx.lineTo(680, 145);
        ctx.lineTo(680, 240);
        ctx.lineTo(-40, 400);
        ctx.closePath();
        ctx.fill();

        // Cobblestone paver dither texture & interlocking stones
        ctx.fillStyle = isSnowy ? '#94a3b8' : '#8c8275';
        for (let ry = 150; ry < 360; ry += 12) {
            const rxBase = Math.round((ry - 150) / 0.22);
            for (let rx = rxBase - 120; rx < rxBase + 120; rx += 18) {
                if (rx >= 0 && rx < width) {
                    ctx.fillRect(rx, ry, 3, 2);
                    ctx.fillStyle = isSnowy ? '#f1f5f9' : '#c4bcb0';
                    ctx.fillRect(rx, ry - 1, 3, 1);
                    ctx.fillStyle = isSnowy ? '#94a3b8' : '#8c8275';
                }
            }
        }

        // Center Promenade Inlaid Mosaic Medallion Motif / Decorative Band
        ctx.strokeStyle = isSnowy ? '#e2e8f0' : '#d7ccc8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let d = -20; d < width + 40; d += 36) {
            const dy1 = Math.round(350 - (d - (-20)) * 0.22);
            const dy2 = Math.round(350 - (d + 20 - (-20)) * 0.22);
            ctx.moveTo(d, dy1);
            ctx.lineTo(d + 20, dy2);
        }
        ctx.stroke();

        // 3. Chiseled Granite Promenade Borders & Upper Sidewalk
        // Upper Sidewalk (where pedestrians walk in front of stand lawn)
        ctx.fillStyle = isSnowy ? '#e2e8f0' : '#c9c0b5';
        ctx.beginPath();
        ctx.moveTo(-40, 280);
        ctx.lineTo(680, 120);
        ctx.lineTo(680, 145);
        ctx.lineTo(-40, 305);
        ctx.closePath();
        ctx.fill();

        // Upper Curb Highlight & Shadow
        ctx.beginPath();
        ctx.moveTo(-40, 280);
        ctx.lineTo(680, 120);
        ctx.strokeStyle = '#f5f5f5';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-40, 305);
        ctx.lineTo(680, 145);
        ctx.strokeStyle = '#6d655a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Score lines on upper promenade
        ctx.strokeStyle = '#9e968b';
        ctx.lineWidth = 1;
        for (let sx = -20; sx < width + 30; sx += 26) {
            const sy = Math.round(302 - (sx - (-20)) * 0.22);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx - 8, sy - 20);
            ctx.stroke();
        }

        // Lower Curb & Sidewalk
        ctx.fillStyle = isSnowy ? '#e2e8f0' : '#c9c0b5';
        ctx.beginPath();
        ctx.moveTo(-40, 400);
        ctx.lineTo(680, 240);
        ctx.lineTo(680, 264);
        ctx.lineTo(-40, 424);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-40, 400);
        ctx.lineTo(680, 240);
        ctx.strokeStyle = '#f5f5f5';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 4. Background Park Features & Botanical Canopy
        // Grand Oak & Botanical Trees
        this.drawHighPixelTree(ctx, 30, 120, 34, isSnowy);
        this.drawHighPixelTree(ctx, 330, 65, 30, isSnowy);
        this.drawHighPixelTree(ctx, 590, 40, 32, isSnowy);

        // Ornate Wrought-Iron Park Gate & Sandstone Pillars on Background Hill
        this.drawParkGates(ctx, 470, 68);

        // Manicured Garden Hedges framing paths
        this.drawGardenHedge(ctx, 270, 72, 70, 11);
        this.drawGardenHedge(ctx, 520, 52, 60, 11);

        // 5. The Grand Multi-Tiered Octagonal Stone Fountain (Upper-Left Green, x: 80, y: 175)
        this.renderStoneFountain(ctx, 80, 175);

        // 6. Promenade Park Benches & Victorian Streetlamps
        this.drawParkBench(ctx, 135, 195);
        this.drawParkBench(ctx, 430, 140);

        this.renderStreetLamp(ctx, 190, 180);
        this.renderStreetLamp(ctx, 510, 115);

        // Garden Hedges along upper lawn
        this.drawGardenHedge(ctx, 0, 230, 55, 11);
        this.drawGardenHedge(ctx, 280, 170, 65, 11);

        // Circular Botanical Rose Bed (x: 230, y: 85)
        ctx.fillStyle = '#4e342e';
        ctx.beginPath();
        ctx.ellipse(230, 85, 24, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath();
        ctx.ellipse(230, 84, 22, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Vibrant Rose Blossoms
        const roses = [
            { x: 220, y: 82, c: '#e91e63' },
            { x: 232, y: 80, c: '#f43f5e' },
            { x: 240, y: 84, c: '#fb7185' },
            { x: 226, y: 86, c: '#fda4af' },
            { x: 215, y: 85, c: '#e11d48' }
        ];
        roses.forEach(r => {
            ctx.fillStyle = r.c;
            ctx.fillRect(r.x, r.y, 3, 3);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(r.x + 1, r.y, 1, 1);
        });

        // 7. Foreground Lower-Right Park Elements (Below Lower Sidewalk)
        // Decorative Stone Birdbath (x: 480, y: 310)
        ctx.fillStyle = '#78909c';
        ctx.fillRect(476, 298, 8, 16); // Pillar
        ctx.fillStyle = '#b0bec5';
        ctx.beginPath();
        ctx.ellipse(480, 298, 18, 6, 0, 0, Math.PI * 2); // Basin rim
        ctx.fill();
        ctx.fillStyle = '#0288d1';
        ctx.beginPath();
        ctx.ellipse(480, 297, 15, 4, 0, 0, Math.PI * 2); // Pool water
        ctx.fill();
        // Little Bluebird perched on rim
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(492, 292, 4, 3);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(495, 293, 2, 1); // Beak

        // Curved Rose Hedge on lower lawn
        this.drawGardenHedge(ctx, 360, 315, 80, 11);

        // Ground Park Pigeons pecking crumbs
        const pigeons = [
            { x: 420, y: 285 },
            { x: 436, y: 290 },
            { x: 412, y: 295 }
        ];
        pigeons.forEach(p => {
            ctx.fillStyle = '#64748b';
            ctx.fillRect(p.x, p.y, 4, 3);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(p.x + 1, p.y - 2, 2, 2);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(p.x + 3, p.y - 1, 1, 1);
        });

        // 8. Weather Atmosphere (Rain Reflections / Snow Piles)
        if (weather && weather.type === 'rainy') {
            ctx.fillStyle = 'rgba(100, 150, 200, 0.35)';
            ctx.beginPath();
            ctx.ellipse(320, 220, 48, 10, -0.22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(305, 218, 30, 2);
        }
    }

    renderStoneFountain(ctx, fx, fy) {
        const x = Math.round(fx), y = Math.round(fy);

        // Octagonal Stone Basin
        ctx.fillStyle = '#78909c';
        ctx.fillRect(x - 30, y - 16, 60, 16);
        ctx.fillStyle = '#90a4ae';
        ctx.fillRect(x - 28, y - 14, 56, 4); // Basin rim

        // Shimmering Aquamarine Pool Water
        ctx.fillStyle = '#29b6f6';
        ctx.fillRect(x - 26, y - 10, 52, 10);
        ctx.fillStyle = '#81d4fa';
        ctx.fillRect(x - 24, y - 8, 48, 2);

        // Fluted Pedestal
        ctx.fillStyle = '#546e7a';
        ctx.fillRect(x - 8, y - 34, 16, 20);
        ctx.fillStyle = '#78909c';
        ctx.fillRect(x - 6, y - 32, 12, 18);

        // Upper Basin Bowl
        ctx.fillStyle = '#90a4ae';
        ctx.fillRect(x - 16, y - 38, 32, 6);
        ctx.fillStyle = '#29b6f6';
        ctx.fillRect(x - 14, y - 36, 28, 3);

        // Center Spout Spire
        ctx.fillStyle = '#546e7a';
        ctx.fillRect(x - 3, y - 48, 6, 12);

        // Animated Water Plume & Frothing Splash Droplets
        ctx.fillStyle = '#e0f7fa';
        const plumeH = 12 + Math.sin(this.frame * 0.2) * 3;
        ctx.fillRect(x - 1, y - 48 - plumeH, 2, plumeH);

        // Fountain Droplets
        this.fountainDroplets.forEach(fd => {
            ctx.fillStyle = '#ffffff';
            this.drawPixelRect(ctx, x + fd.x, y - 48 + fd.y, 2, 2, '#ffffff');
        });

        // Water Cascade Sheets into Basin
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(x - 12, y - 30, 2, 14);
        ctx.fillRect(x + 10, y - 30, 2, 14);
    }

    drawParkGates(ctx, x, y) {
        // Carved Sandstone Pillars
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(x - 24, y - 42, 12, 42);
        ctx.fillRect(x + 24, y - 42, 12, 42);
        // Pillar tops
        this.drawPixelCircle(ctx, x - 18, y - 46, 5, '#bcaaa4');
        this.drawPixelCircle(ctx, x + 30, y - 46, 5, '#bcaaa4');

        // Ornate Wrought-Iron Spikes & Scrollwork
        ctx.fillStyle = '#263238';
        ctx.fillRect(x - 12, y - 36, 36, 3);
        ctx.fillRect(x - 12, y - 14, 36, 3);
        for (let ix = x - 10; ix <= x + 22; ix += 5) {
            ctx.fillRect(ix, y - 38, 2, 28);
            ctx.fillRect(ix - 1, y - 41, 4, 3); // Fleur-de-lis tip
        }
    }

    drawParkBench(ctx, x, y) {
        // Cast-Iron Legs
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 2, y - 16, 3, 16);
        ctx.fillRect(x + 28, y - 16, 3, 16);
        // Varnished Wood Slats
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(x, y - 14, 33, 4); // Seat
        ctx.fillRect(x, y - 22, 33, 4); // Backrest
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(x, y - 14, 33, 1);
        ctx.fillRect(x, y - 22, 33, 1);
    }

    // 3. University Campus: Authentic 2.5D Isometric Top-Down Collegiate Quad & Clock Tower
    renderCampusBackdrop(ctx, width, groundY, weather) {
        const height = 360;

        // Render High-Pixel Pre-rendered Background if available
        const campusImg = (this.locationBgs && this.locationBgs.campus) || null;
        if (this.locationBgsLoaded && this.locationBgsLoaded.campus && campusImg) {
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(campusImg, 0, 0, width, height);
            ctx.restore();
            return;
        }

        const isSnowy = weather && weather.type === 'freezing';

        // 1. Base Collegiate Quad Emerald Lawn
        ctx.fillStyle = isSnowy ? '#dcefe3' : '#1b5e20';
        ctx.fillRect(0, 0, width, height);

        // Lawn Dither Dots
        ctx.fillStyle = isSnowy ? '#c8e2d1' : '#23782b';
        for (let py = 0; py < height; py += 12) {
            const shift = (Math.floor(py / 12) % 2) * 8;
            for (let px = shift; px < width; px += 16) {
                ctx.fillRect(px, py, 2, 2);
            }
        }

        // 2. Diagonal Terracotta Herringbone Brick Quad Walkway (2.5D Isometric Slope)
        // Runs diagonally across from bottom-left (-40, 305) to upper-right (680, 145)
        ctx.fillStyle = isSnowy ? '#cbd5e1' : '#8d2b1f';
        ctx.beginPath();
        ctx.moveTo(-40, 305);
        ctx.lineTo(680, 145);
        ctx.lineTo(680, 240);
        ctx.lineTo(-40, 400);
        ctx.closePath();
        ctx.fill();

        // Herringbone Brick Pattern Detail
        ctx.fillStyle = isSnowy ? '#94a3b8' : '#a63628';
        for (let ry = 150; ry < 360; ry += 8) {
            const rxBase = Math.round((ry - 150) / 0.22);
            for (let rx = rxBase - 120; rx < rxBase + 120; rx += 14) {
                if (rx >= 0 && rx < width) {
                    ctx.fillRect(rx, ry, 6, 3);
                    ctx.fillStyle = isSnowy ? '#f1f5f9' : '#b73d2d';
                    ctx.fillRect(rx + 1, ry + 1, 4, 1);
                    ctx.fillStyle = isSnowy ? '#94a3b8' : '#a63628';
                }
            }
        }

        // Limestone Curbing along Brick Quad
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let d = -20; d < width + 40; d += 36) {
            const dy1 = Math.round(350 - (d - (-20)) * 0.22);
            const dy2 = Math.round(350 - (d + 20 - (-20)) * 0.22);
            ctx.moveTo(d, dy1);
            ctx.lineTo(d + 20, dy2);
        }
        ctx.stroke();

        // 3. Upper Sidewalk / Flagstone Quad Concourse
        ctx.fillStyle = isSnowy ? '#e2e8f0' : '#d7ccc8';
        ctx.beginPath();
        ctx.moveTo(-40, 280);
        ctx.lineTo(680, 120);
        ctx.lineTo(680, 145);
        ctx.lineTo(-40, 305);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-40, 280);
        ctx.lineTo(680, 120);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-40, 305);
        ctx.lineTo(680, 145);
        ctx.strokeStyle = '#8d6e63';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Flagstone paver joints
        ctx.strokeStyle = '#a1887f';
        ctx.lineWidth = 1;
        for (let sx = -20; sx < width + 30; sx += 26) {
            const sy = Math.round(302 - (sx - (-20)) * 0.22);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx - 8, sy - 20);
            ctx.stroke();
        }

        // Lower Sidewalk
        ctx.fillStyle = isSnowy ? '#e2e8f0' : '#d7ccc8';
        ctx.beginPath();
        ctx.moveTo(-40, 400);
        ctx.lineTo(680, 240);
        ctx.lineTo(680, 264);
        ctx.lineTo(-40, 424);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-40, 400);
        ctx.lineTo(680, 240);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 4. Grand Collegiate Gothic Red-Brick Hall (Upper-Left Quad, x: 0..170, y: 70..215)
        const ghX = 0, ghY = 210;
        // Brick wall
        ctx.fillStyle = '#5c1d18';
        ctx.fillRect(ghX, ghY - 140, 155, 140);
        ctx.fillStyle = '#7a2720';
        for (let by = ghY - 140; by < ghY; by += 8) {
            const shift = (Math.floor(by / 8) % 2) * 8;
            for (let bx = ghX + shift; bx < ghX + 155; bx += 16) {
                ctx.fillRect(bx, by, 14, 6);
            }
        }

        // Limestone string courses & cornice
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(ghX, ghY - 140, 155, 5);
        ctx.fillRect(ghX, ghY - 80, 155, 4);

        // Gothic Arched Stained Glass Windows
        this.drawGothicWindow(ctx, ghX + 22, ghY - 125, 20, 36);
        this.drawGothicWindow(ctx, ghX + 68, ghY - 125, 20, 36);
        this.drawGothicWindow(ctx, ghX + 114, ghY - 125, 20, 36);

        // Lower Gothic Windows & Creeping Ivy
        this.drawGothicWindow(ctx, ghX + 75, ghY - 65, 24, 40);
        this.drawCreepingIvy(ctx, ghX + 10, ghY - 110, 18, 90);
        this.drawCreepingIvy(ctx, ghX + 100, ghY - 90, 16, 75);

        // Arched Collegiate Oak Portal
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(ghX + 26, ghY - 50, 30, 50);
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(ghX + 24, ghY - 52, 34, 4); // Arch trim
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(ghX + 50, ghY - 24, 2, 4); // Brass handle

        // 5. Historic Campus Clock Tower (Upper-Right Background, x: 470, y: 135)
        this.renderClockTower(ctx, 470, 135);

        // 6. Collegiate Infrastructure
        // Vintage Commuter Bicycle Rack (x: 165, y: 205)
        this.drawBicycleRack(ctx, 165, 205);

        // Campus Wooden Bulletin / Notice Kiosk (x: 350, y: 105)
        const bkX = 350, bkY = 105;
        ctx.fillStyle = '#4e342e';
        ctx.fillRect(bkX + 6, bkY - 4, 4, 30); // Left post
        ctx.fillRect(bkX + 54, bkY - 4, 4, 30); // Right post
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(bkX, bkY - 32, 64, 28); // Board backing
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(bkX + 2, bkY - 30, 60, 24); // Corkboard
        // Gabled timber roof
        ctx.fillStyle = '#3e2723';
        ctx.beginPath();
        ctx.moveTo(bkX - 4, bkY - 32);
        ctx.lineTo(bkX + 32, bkY - 44);
        ctx.lineTo(bkX + 68, bkY - 32);
        ctx.closePath();
        ctx.fill();
        // Colorful pinned notices & flyers
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bkX + 6, bkY - 28, 14, 16); // White flyer
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(bkX + 8, bkY - 26, 10, 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(bkX + 24, bkY - 26, 16, 14); // Yellow poster "HACKATHON"
        ctx.fillStyle = '#e11d48';
        ctx.fillRect(bkX + 44, bkY - 28, 14, 18); // Pink notice "COFFEE CLUB"

        // Formal trimmed campus hedges
        this.drawGardenHedge(ctx, 195, 175, 65, 11);
        this.drawGardenHedge(ctx, 545, 115, 60, 11);

        // Heritage Quad Trees
        this.drawHighPixelTree(ctx, 285, 75, 30, isSnowy);
        this.drawHighPixelTree(ctx, 600, 45, 28, isSnowy);

        // 7. Foreground Lower-Right Quad Elements (Below Lower Sidewalk)
        // Low brick wall with limestone coping (x: 370..590, y: 310)
        const cwX = 380, cwY = 320;
        ctx.fillStyle = '#5c1d18';
        ctx.fillRect(cwX, cwY - 14, 160, 14);
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(cwX - 2, cwY - 17, 164, 4); // Limestone cap
        // Bronze Campus Crest Plaque
        ctx.fillStyle = '#d97706';
        ctx.fillRect(cwX + 65, cwY - 12, 30, 10);
        ctx.fillStyle = '#451a03';
        ctx.font = 'bold 6px monospace';
        ctx.fillText('EST. 1892', cwX + 68, cwY - 4);

        // Student Quad Bench with textbook stack & ceramic mug
        this.drawParkBench(ctx, 420, cwY - 20);
        // Textbooks on bench
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(444, cwY - 37, 10, 3);
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(445, cwY - 40, 9, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(443, cwY - 34, 12, 1);
        // Ceramic mug
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(456, cwY - 37, 4, 4);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(457, cwY - 38, 2, 1);

        // 8. Weather Atmosphere
        if (weather && weather.type === 'rainy') {
            ctx.fillStyle = 'rgba(100, 150, 200, 0.35)';
            ctx.beginPath();
            ctx.ellipse(320, 220, 48, 10, -0.22, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawGothicWindow(ctx, x, y, w, h) {
        // Stone frame
        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(x - 2, y - 2, w + 4, h + 4);

        // Glowing stained-glass amber interior
        ctx.fillStyle = '#ffe082';
        ctx.fillRect(x, y, w, h);

        // Gothic Arch top
        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(x, y, 3, 6);
        ctx.fillRect(x + w - 3, y, 3, 6);

        // Leaded Diamond Glass Mullions
        ctx.fillStyle = '#37474f';
        ctx.fillRect(x + Math.round(w / 2) - 1, y, 2, h);
        ctx.fillRect(x, y + Math.round(h * 0.4), w, 1);
        ctx.fillRect(x, y + Math.round(h * 0.7), w, 1);
    }

    drawCreepingIvy(ctx, x, y, w, h) {
        ctx.fillStyle = '#1b5e20';
        for (let i = 0; i < 18; i++) {
            const ix = x + ((i * 7) % w);
            const iy = y + ((i * 11) % h);
            ctx.fillRect(ix, iy, 4, 3);
        }
    }

    renderClockTower(ctx, tx, groundY) {
        const x = Math.round(tx);
        const towerW = 68;
        const towerH = 160;
        const towerTopY = groundY - towerH;

        // Brick Body
        ctx.fillStyle = '#4a1511';
        ctx.fillRect(x, towerTopY, towerW, towerH);
        ctx.fillStyle = '#68201a';
        ctx.fillRect(x + 2, towerTopY + 2, towerW - 4, towerH - 4);

        // Limestone Quoins on corners
        ctx.fillStyle = '#d7ccc8';
        for (let qy = towerTopY; qy < groundY; qy += 12) {
            ctx.fillRect(x - 2, qy, 6, 6);
            ctx.fillRect(x + towerW - 4, qy, 6, 6);
        }

        // Weathered Copper Verdigris Spire
        ctx.fillStyle = '#16a085';
        ctx.beginPath();
        ctx.moveTo(x - 6, towerTopY);
        ctx.lineTo(x + towerW / 2, towerTopY - 42);
        ctx.lineTo(x + towerW + 6, towerTopY);
        ctx.closePath();
        ctx.fill();

        // Copper Weathervane Tip
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(x + towerW / 2 - 1, towerTopY - 50, 2, 9);

        // Real-Time Clock Face!
        const clockX = x + towerW / 2;
        const clockY = towerTopY + 34;
        const clockR = 17;

        this.drawPixelCircle(ctx, clockX, clockY, clockR + 2, '#cfd8dc', '#37474f');
        this.drawPixelCircle(ctx, clockX, clockY, clockR, '#ffffff');

        // Clock Tick Marks (12, 3, 6, 9)
        ctx.fillStyle = '#212121';
        ctx.fillRect(clockX - 1, clockY - clockR + 2, 2, 3);
        ctx.fillRect(clockX - 1, clockY + clockR - 5, 2, 3);
        ctx.fillRect(clockX - clockR + 2, clockY - 1, 3, 2);
        ctx.fillRect(clockX + clockR - 5, clockY - 1, 3, 2);

        // Hands mirror the simulation minute!
        const currentMin = (window.simulationEngine && window.simulationEngine.currentMinute) ? window.simulationEngine.currentMinute : 540;
        const hourAngle = ((currentMin / 60) % 12) * (Math.PI / 6) - Math.PI / 2;
        const minAngle = (currentMin % 60) * (Math.PI / 30) - Math.PI / 2;

        // Hour Hand
        ctx.strokeStyle = '#212121';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(clockX, clockY);
        ctx.lineTo(clockX + Math.cos(hourAngle) * 8, clockY + Math.sin(hourAngle) * 8);
        ctx.stroke();

        // Minute Hand
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(clockX, clockY);
        ctx.lineTo(clockX + Math.cos(minAngle) * 12, clockY + Math.sin(minAngle) * 12);
        ctx.stroke();
    }

    drawBicycleRack(ctx, x, y) {
        // Cast-Iron U-Racks
        ctx.fillStyle = '#455a64';
        for (let rx = x; rx < x + 40; rx += 14) {
            ctx.fillRect(rx, y - 16, 2, 16);
            ctx.fillRect(rx + 8, y - 16, 2, 16);
            ctx.fillRect(rx, y - 18, 10, 2);
        }

        // Parked Vintage Commuter Bicycle
        const bx = x + 10;
        const by = y - 4;
        // Spoked Wheels
        this.drawPixelCircle(ctx, bx, by, 7, '#00000000', '#37474f');
        this.drawPixelCircle(ctx, bx + 22, by, 7, '#00000000', '#37474f');
        // Turquoise Frame & Handlebars
        ctx.fillStyle = '#00bcd4';
        this.drawPixelLine(ctx, bx, by, bx + 11, by - 10, '#00bcd4');
        this.drawPixelLine(ctx, bx + 11, by - 10, bx + 22, by, '#00bcd4');
        this.drawPixelLine(ctx, bx + 11, by - 10, bx + 11, by, '#00bcd4');
        // Saddle & Handlebars
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(bx + 9, by - 12, 5, 2); // Seat
        ctx.fillStyle = '#37474f';
        ctx.fillRect(bx + 19, by - 14, 5, 2); // Handlebars
    }

    // 4. Downtown Financial: Authentic 2.5D Isometric Top-Down Financial Hub & Skyscraper Avenue
    renderDowntownBackdrop(ctx, width, groundY, weather) {
        const height = 360;

        // Render High-Pixel Pre-rendered Background if available
        const downtownImg = (this.locationBgs && this.locationBgs.downtown) || null;
        if (this.locationBgsLoaded && this.locationBgsLoaded.downtown && downtownImg) {
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(downtownImg, 0, 0, width, height);
            ctx.restore();
            return;
        }

        const isSnowy = weather && weather.type === 'freezing';

        // 1. Base Financial District Dark Granite Plaza
        ctx.fillStyle = isSnowy ? '#dcefe3' : '#1e293b';
        ctx.fillRect(0, 0, width, height);

        // Plaza Granite Paver Dither Dots
        ctx.fillStyle = isSnowy ? '#c8e2d1' : '#334155';
        for (let py = 0; py < height; py += 12) {
            const shift = (Math.floor(py / 12) % 2) * 8;
            for (let px = shift; px < width; px += 16) {
                ctx.fillRect(px, py, 2, 2);
            }
        }

        // 2. Diagonal Multi-Lane Downtown Avenue (2.5D Isometric Slope)
        // Runs diagonally across from bottom-left (-40, 305) to upper-right (680, 145)
        ctx.fillStyle = '#1e232a';
        ctx.beginPath();
        ctx.moveTo(-40, 305);
        ctx.lineTo(680, 145);
        ctx.lineTo(680, 240);
        ctx.lineTo(-40, 400);
        ctx.closePath();
        ctx.fill();

        // Aggregate asphalt texture
        ctx.fillStyle = '#2d333b';
        for (let ry = 150; ry < 360; ry += 10) {
            const rxBase = Math.round((ry - 150) / 0.22);
            for (let rx = rxBase - 120; rx < rxBase + 120; rx += 14) {
                if (rx >= 0 && rx < width) ctx.fillRect(rx, ry, 2, 1);
            }
        }

        // Double Yellow Center Divider Lines
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let d = -20; d < width + 40; d += 36) {
            const dy1 = Math.round(348 - (d - (-20)) * 0.22);
            const dy2 = Math.round(348 - (d + 20 - (-20)) * 0.22);
            ctx.moveTo(d, dy1);
            ctx.lineTo(d + 20, dy2);
            ctx.moveTo(d, dy1 + 3);
            ctx.lineTo(d + 20, dy2 + 3);
        }
        ctx.stroke();

        // Diagonal White Pedestrian Crosswalk Striping (x: 310..370)
        ctx.fillStyle = '#f8fafc';
        for (let cw = 310; cw < 370; cw += 12) {
            ctx.beginPath();
            const cy1 = Math.round(350 - (cw - (-20)) * 0.22);
            ctx.moveTo(cw, cy1 - 25);
            ctx.lineTo(cw + 8, cy1 - 25);
            ctx.lineTo(cw - 8, cy1 + 25);
            ctx.lineTo(cw - 16, cy1 + 25);
            ctx.closePath();
            ctx.fill();
        }

        // 3. Polished Steel & Granite Sidewalks
        // Upper Sidewalk (in front of stand lawn)
        ctx.fillStyle = isSnowy ? '#e2e8f0' : '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(-40, 280);
        ctx.lineTo(680, 120);
        ctx.lineTo(680, 145);
        ctx.lineTo(-40, 305);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-40, 280);
        ctx.lineTo(680, 120);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-40, 305);
        ctx.lineTo(680, 145);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Modern grid expansion joints
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        for (let sx = -20; sx < width + 30; sx += 26) {
            const sy = Math.round(302 - (sx - (-20)) * 0.22);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx - 8, sy - 20);
            ctx.stroke();
        }

        // Lower Sidewalk
        ctx.fillStyle = isSnowy ? '#e2e8f0' : '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(-40, 400);
        ctx.lineTo(680, 240);
        ctx.lineTo(680, 264);
        ctx.lineTo(-40, 424);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-40, 400);
        ctx.lineTo(680, 240);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 4. Distant Skyline & Midground Reflective Glass Skyscraper Towers
        // Tower 1 (Left corporate headquarters, x: 0..105, y: 210)
        const t1X = 0, t1Y = 210;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(t1X, t1Y - 160, 105, 160);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(t1X + 4, t1Y - 158, 97, 158);
        // Cyan glass window grid
        for (let wy = t1Y - 150; wy < t1Y - 10; wy += 12) {
            for (let wx = t1X + 8; wx < t1X + 95; wx += 10) {
                const lit = ((wx * 17 + wy * 23) % 5) < 3;
                ctx.fillStyle = lit ? '#38bdf8' : '#0f172a';
                ctx.fillRect(wx, wy, 6, 7);
            }
        }

        // Tower 2 (Center financial tower with Crypto Billboard, x: 230..375, y: 155)
        const t2X = 230, t2Y = 155;
        ctx.fillStyle = '#0a0f1d';
        ctx.fillRect(t2X, t2Y - 135, 145, 135);
        ctx.fillStyle = '#111827';
        ctx.fillRect(t2X + 4, t2Y - 133, 137, 133);
        // Amber & gold window grid
        for (let wy = t2Y - 130; wy < t2Y - 10; wy += 12) {
            for (let wx = t2X + 8; wx < t2X + 135; wx += 11) {
                const lit = ((wx * 13 + wy * 29) % 7) < 4;
                ctx.fillStyle = lit ? '#f59e0b' : '#1f2937';
                ctx.fillRect(wx, wy, 7, 7);
            }
        }

        // The Giant Animated Crypto Billboard mounted on Tower 2!
        this.renderCryptoBillboard(ctx, t2X + 10, t2Y - 110, 125, 38);

        // Tower 3 (Right spire skyscraper, x: 480..610, y: 120)
        const t3X = 480, t3Y = 120;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(t3X, t3Y - 115, 130, 115);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(t3X + 4, t3Y - 113, 122, 113);
        // Teal window grid
        for (let wy = t3Y - 110; wy < t3Y - 10; wy += 12) {
            for (let wx = t3X + 8; wx < t3X + 120; wx += 10) {
                const lit = ((wx * 19 + wy * 31) % 6) < 3;
                ctx.fillStyle = lit ? '#00ffcc' : '#0f172a';
                ctx.fillRect(wx, wy, 6, 7);
            }
        }

        // Tall Rooftop Antenna with 1Hz Blinking Red Aviation Beacon
        const antX = t3X + 65, antY = t3Y - 115;
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(antX - 1, antY - 24, 2, 24);
        const blink = Math.sin(this.frame * 0.1) > 0;
        ctx.fillStyle = blink ? '#ff1744' : '#5c101d';
        this.drawPixelRect(ctx, antX - 2, antY - 26, 4, 3, blink ? '#ff1744' : '#5c101d');

        // 5. Urban Street Furniture & Infrastructure
        // Metro Steam Grate on sidewalk (x: 135, y: 220)
        this.renderStreetManholeSteam(ctx, 135, 220);

        // Modern Glass Transit Shelter with Ad Poster (x: 420, y: 105)
        const tsX = 420, tsY = 105;
        ctx.fillStyle = '#334155';
        ctx.fillRect(tsX, tsY - 28, 48, 28);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.fillRect(tsX + 2, tsY - 26, 44, 24); // Glass
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(tsX + 28, tsY - 22, 14, 18); // Ad poster "COFFEDE ☕"

        // Stainless Steel Bollards along upper sidewalk
        const bollards = [175, 275, 385, 495];
        bollards.forEach(bx => {
            const by = Math.round(300 - (bx - (-20)) * 0.22);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(bx, by - 12, 4, 12);
            ctx.fillStyle = '#475569';
            ctx.fillRect(bx + 1, by - 14, 2, 2);
        });

        // 6. Foreground Downtown Elements (Lower-Right Plaza, Below Lower Sidewalk)
        // Modern Black Granite Planter with Architectural Bamboo (x: 390, y: 320)
        const plX = 390, plY = 320;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(plX, plY - 18, 120, 18);
        ctx.fillStyle = '#334155';
        ctx.fillRect(plX - 2, plY - 21, 124, 4); // Granite rim
        // Architectural Bamboo Stems & Foliage
        for (let bm = plX + 8; bm < plX + 115; bm += 12) {
            ctx.fillStyle = '#16a34a';
            ctx.fillRect(bm, plY - 42, 3, 22);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(bm - 2, plY - 40, 7, 2);
            ctx.fillRect(bm - 3, plY - 34, 8, 2);
        }

        // Glossy Red & Chrome Fire Hydrant (x: 535, y: 285)
        const fhX = 535, fhY = 285;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(fhX, fhY - 14, 8, 14);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(fhX + 2, fhY - 17, 4, 3); // Chrome cap
        ctx.fillRect(fhX - 2, fhY - 10, 12, 3); // Nozzle

        // 7. Weather Atmosphere & Wet Neon Reflections
        if (weather && weather.type === 'rainy') {
            // Neon billboard reflections on wet avenue asphalt
            ctx.fillStyle = 'rgba(0, 255, 204, 0.22)';
            ctx.beginPath();
            ctx.ellipse(330, 235, 55, 12, -0.22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
            ctx.fillRect(315, 232, 35, 2);
        }
    }

    renderCryptoBillboard(ctx, x, y, w, h) {
        const rx = Math.round(x), ry = Math.round(y);

        // Neon Glowing Frame
        ctx.fillStyle = '#050b14';
        ctx.fillRect(rx, ry, w, h);
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 1;
        ctx.strokeRect(rx, ry, w, h);

        // Corner mounting studs
        this.drawPixelRect(ctx, rx, ry, 2, 2, '#00ffcc');
        this.drawPixelRect(ctx, rx + w - 2, ry, 2, 2, '#00ffcc');
        this.drawPixelRect(ctx, rx, ry + h - 2, 2, 2, '#00ffcc');
        this.drawPixelRect(ctx, rx + w - 2, ry + h - 2, 2, 2, '#00ffcc');

        // Dynamic Moving Marquee & Price Feed
        const btcPrice = 92450 + Math.round(Math.sin(this.frame * 0.05) * 120);
        const ethPrice = 3820 + Math.round(Math.cos(this.frame * 0.04) * 15);

        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = '#00ffcc';
        ctx.fillText(`BTC $${btcPrice} ▲`, rx + 6, ry + 12);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`ETH $${ethPrice} ▲`, rx + 6, ry + 22);
        ctx.fillStyle = '#f1c40f';
        ctx.fillText(`$BEAN $1.25 🚀`, rx + 6, ry + 32);
    }

    // 5. Metro Central: Authentic 2.5D Isometric Top-Down Transit Plaza & Art Deco Subway Entrance
    renderMetroBackdrop(ctx, width, groundY, weather) {
        const height = 360;

        // Render High-Pixel Pre-rendered Background if available
        const metroImg = (this.locationBgs && this.locationBgs.metro) || null;
        if (this.locationBgsLoaded && this.locationBgsLoaded.metro && metroImg) {
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(metroImg, 0, 0, width, height);
            ctx.restore();
            return;
        }

        const isSnowy = weather && weather.type === 'freezing';

        // 1. Base Urban Transit Plaza Pavers
        ctx.fillStyle = isSnowy ? '#dcefe3' : '#374151';
        ctx.fillRect(0, 0, width, height);

        // Transit Plaza Dither Texture
        ctx.fillStyle = isSnowy ? '#c8e2d1' : '#4b5563';
        for (let py = 0; py < height; py += 12) {
            const shift = (Math.floor(py / 12) % 2) * 8;
            for (let px = shift; px < width; px += 16) {
                ctx.fillRect(px, py, 2, 2);
            }
        }

        // 2. Diagonal Dedicated Transit Bus/Shuttle Lane (2.5D Isometric Slope)
        // Runs diagonally across from bottom-left (-40, 305) to upper-right (680, 145)
        ctx.fillStyle = '#1f242d';
        ctx.beginPath();
        ctx.moveTo(-40, 305);
        ctx.lineTo(680, 145);
        ctx.lineTo(680, 240);
        ctx.lineTo(-40, 400);
        ctx.closePath();
        ctx.fill();

        // Dedicated Transit Red Lane Stripe along curb
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-40, 312);
        ctx.lineTo(680, 152);
        ctx.stroke();

        // Dashed White Bus Bay Markings
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let d = -20; d < width + 40; d += 36) {
            const dy1 = Math.round(350 - (d - (-20)) * 0.22);
            const dy2 = Math.round(350 - (d + 20 - (-20)) * 0.22);
            ctx.moveTo(d, dy1);
            ctx.lineTo(d + 20, dy2);
        }
        ctx.stroke();

        // 3. Yellow Tactile Braille Warning Tiles & Station Concourse Sidewalk
        // Upper Sidewalk (in front of stand concourse)
        ctx.fillStyle = isSnowy ? '#e2e8f0' : '#6b7280';
        ctx.beginPath();
        ctx.moveTo(-40, 280);
        ctx.lineTo(680, 120);
        ctx.lineTo(680, 145);
        ctx.lineTo(-40, 305);
        ctx.closePath();
        ctx.fill();

        // Yellow Tactile Paving Strip (Braille safety bumps along curb edge)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-40, 300);
        ctx.lineTo(680, 140);
        ctx.lineTo(680, 145);
        ctx.lineTo(-40, 305);
        ctx.closePath();
        ctx.fill();
        // Raised tactile dots
        ctx.fillStyle = '#d97706';
        for (let tx = -20; tx < width + 30; tx += 8) {
            const ty = Math.round(302 - (tx - (-20)) * 0.22);
            ctx.fillRect(tx, ty, 2, 2);
        }

        ctx.beginPath();
        ctx.moveTo(-40, 280);
        ctx.lineTo(680, 120);
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-40, 305);
        ctx.lineTo(680, 145);
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Lower Sidewalk
        ctx.fillStyle = isSnowy ? '#e2e8f0' : '#6b7280';
        ctx.beginPath();
        ctx.moveTo(-40, 400);
        ctx.lineTo(680, 240);
        ctx.lineTo(680, 264);
        ctx.lineTo(-40, 424);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-40, 400);
        ctx.lineTo(680, 240);
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 4. Glazed Ceramic Subway Tile Concourse Wall (Upper Background)
        const stWallY = 0;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, stWallY, width, 120);
        // Subway tile grid
        for (let ty = stWallY; ty < 115; ty += 10) {
            const shift = (Math.floor(ty / 10) % 2) * 12;
            for (let tx = shift; tx < width; tx += 24) {
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(tx, ty, 22, 8);
                ctx.fillStyle = '#cbd5e1';
                ctx.fillRect(tx, ty + 7, 22, 1);
            }
        }

        // 5. The Iconic Art Deco Subway Portal (Upper-Left Concourse, x: 50..165, y: 195)
        this.renderSubwayPortal(ctx, 50, 195);

        // 6. Traditional Urban Newsstand & Magazine Kiosk (Mid-Right, x: 430, y: 135)
        this.renderNewsstandKiosk(ctx, 430, 135);

        // 7. Urban Street Infrastructure & Steam Vent
        // Cast-Iron Subway Manhole with Animated Rising Steam Puffs
        this.renderStreetManholeSteam(ctx, 350, 160);

        // Municipal Navy Blue Mailbox on the corner (x: 180, y: 195)
        const mbX = 180, mbY = 195;
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(mbX, mbY - 16, 12, 16);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(mbX + 1, mbY - 18, 10, 3); // Rounded dome
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(mbX + 2, mbY - 11, 8, 2); // Drop slot

        // Four-Faced Transit Station Clock on Iron Post (x: 215, y: 145)
        const ckX = 215, ckY = 145;
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(ckX - 2, ckY - 32, 4, 32); // Pole
        this.drawPixelCircle(ctx, ckX, ckY - 36, 11, '#ffffff', '#1f2937');
        // Clock tick marks
        ctx.fillStyle = '#111827';
        ctx.fillRect(ckX - 1, ckY - 45, 2, 2);
        ctx.fillRect(ckX - 1, ckY - 29, 2, 2);
        ctx.fillRect(ckX - 9, ckY - 37, 2, 2);
        ctx.fillRect(ckX + 7, ckY - 37, 2, 2);

        // 8. Foreground Metro Elements (Lower-Right Concourse, Below Lower Sidewalk)
        // Low Stone Station Balustrade with Bronze Route Map Plaque (x: 390..590, y: 320)
        const sbX = 390, sbY = 320;
        ctx.fillStyle = '#374151';
        ctx.fillRect(sbX, sbY - 16, 170, 16);
        ctx.fillStyle = '#9ca3af';
        ctx.fillRect(sbX - 2, sbY - 19, 174, 4); // Coping
        // Bronze transit system map plaque
        ctx.fillStyle = '#b45309';
        ctx.fillRect(sbX + 20, sbY - 14, 34, 11);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(sbX + 24, sbY - 10, 18, 2); // Blue line
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(sbX + 30, sbY - 12, 2, 8); // Green line

        // City E-Bike Dock with Yellow Commuter E-Bike (x: 470, y: 310)
        const ebX = 470, ebY = 310;
        // Dock stand
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(ebX + 8, ebY - 12, 5, 12);
        // Yellow frame
        this.drawPixelCircle(ctx, ebX, ebY - 4, 6, '#00000000', '#1f2937');
        this.drawPixelCircle(ctx, ebX + 18, ebY - 4, 6, '#00000000', '#1f2937');
        ctx.fillStyle = '#eab308';
        this.drawPixelLine(ctx, ebX, ebY - 4, ebX + 9, ebY - 12, '#eab308');
        this.drawPixelLine(ctx, ebX + 9, ebY - 12, ebX + 18, ebY - 4, '#eab308');

        // Municipal Dual Recycling & Waste Receptacle (x: 520, y: 310)
        ctx.fillStyle = '#15803d';
        ctx.fillRect(520, 296, 10, 14); // Green recycle
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(532, 296, 10, 14); // Blue paper
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(522, 298, 6, 2);
        ctx.fillRect(534, 298, 6, 2);

        // 9. Weather Atmosphere
        if (weather && weather.type === 'rainy') {
            ctx.fillStyle = 'rgba(100, 150, 200, 0.35)';
            ctx.beginPath();
            ctx.ellipse(320, 220, 48, 10, -0.22, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    renderSubwayPortal(ctx, x, groundY) {
        const sx = Math.round(x);
        const portalW = 105;
        const portalH = 65;
        const sy = groundY - portalH;

        // Dark Stairs descending
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(sx + 8, groundY - 42, portalW - 16, 42);

        // Cast-Iron Emerald Green Entrance Canopy & Railing
        ctx.fillStyle = '#166534';
        ctx.fillRect(sx + 4, groundY - 44, portalW - 8, 4); // Railing top
        for (let rx = sx + 8; rx < sx + portalW - 8; rx += 8) {
            ctx.fillRect(rx, groundY - 44, 2, 44);
        }

        // Dual Illuminated Amber/Green Globe Lamps on Curved Stalks
        this.drawSubwayGlobeLamp(ctx, sx + 6, sy + 6);
        this.drawSubwayGlobeLamp(ctx, sx + portalW - 10, sy + 6);

        // Enameled Brass "METRO CENTRAL" Sign
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(sx + 14, sy + 4, portalW - 28, 16);
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 1;
        ctx.strokeRect(sx + 14, sy + 4, portalW - 28, 16);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('METRO CENTRAL', sx + 18, sy + 15);
    }

    drawSubwayGlobeLamp(ctx, lx, ly) {
        ctx.fillStyle = '#166534';
        ctx.fillRect(lx, ly + 6, 4, 18);
        this.drawPixelCircle(ctx, lx + 2, ly + 4, 6, '#fff9c4', '#f59e0b');
    }

    renderNewsstandKiosk(ctx, x, groundY) {
        const kx = Math.round(x);
        const kw = 85;
        const kh = 58;
        const ky = groundY - kh;

        // Timber Kiosk Booth
        ctx.fillStyle = '#451a03';
        ctx.fillRect(kx, ky, kw, kh);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(kx + 2, ky + 2, kw - 4, kh - 4);

        // Kiosk Awning
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(kx - 4, ky - 6, kw + 8, 8);
        ctx.fillStyle = '#ffffff';
        for (let ax = kx - 4; ax < kx + kw + 4; ax += 10) {
            ctx.fillRect(ax, ky - 6, 5, 8);
        }

        // Display Counters with Colorful Newspapers & Magazines
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(kx + 6, ky + 16, 20, 14); // Newspaper
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(kx + 30, ky + 16, 18, 14); // Tech magazine
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(kx + 52, ky + 16, 18, 14); // Coffee magazine
    }

    renderStreetManholeSteam(ctx, x, y) {
        // Cast Iron Manhole Cover
        this.drawPixelCircle(ctx, x, y, 12, '#334155', '#0f172a');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x - 6, y - 1, 12, 2);
        ctx.fillRect(x - 1, y - 6, 2, 12);

        // Steam Wisps
        this.streetSteam.forEach(ss => {
            ctx.fillStyle = `rgba(240, 245, 255, ${ss.alpha})`;
            this.drawPixelCircle(ctx, x + ss.x, y + ss.y, ss.size);
        });
    }

    // -------------------------------------------------------------
    // PROCEDURAL LOCATION BACKDROPS (AUTHENTIC 16-BIT FALLBACKS)
    // -------------------------------------------------------------
    renderProceduralLocationBackdrop(ctx, width, height, locationId, groundY, weather) {
        if (!ctx || typeof ctx.fillRect !== 'function') return;
        const w = width || 640;
        const h = height || 360;

        switch (locationId) {
            case 'sports_complex':
                this.renderSportsComplexBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'shopping_mall':
                this.renderShoppingMallBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'hospital_plaza':
                this.renderHospitalPlazaBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'convention_center':
                this.renderConventionCenterBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'airport_terminal':
                this.renderAirportTerminalBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'cul_de_sac':
                this.renderCulDeSacBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'community_garden':
                this.renderCommunityGardenBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'public_library':
                this.renderPublicLibraryBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'lake_marina':
                this.renderLakeMarinaBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'campsite':
                this.renderCampsiteBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'farmers_market':
                this.renderFarmersMarketBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'beach_boardwalk':
                this.renderBeachBoardwalkBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'construction_site':
                this.renderConstructionSiteBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'art_district':
                this.renderArtDistrictBackdrop(ctx, w, h, groundY, weather);
                break;
            case 'amusement_pier':
                this.renderAmusementPierBackdrop(ctx, w, h, groundY, weather);
                break;
            default:
                this.renderDefaultProceduralBackdrop(ctx, w, h, groundY, weather);
                break;
        }
    }

    // 1. City Sports Complex: Authentic 16-bit isometric stadium bowl, space-frame truss, floodlight towers & sports court
    renderSportsComplexBackdrop(ctx, width, height, groundY, weather) {
        // Deep Twilight Arena Sky
        ctx.fillStyle = '#0b132b';
        ctx.fillRect(0, 0, width, height);

        // Distant city silhouette & stadium horizon
        ctx.fillStyle = '#1c2541';
        for (let bx = 0; bx < width; bx += 48) {
            const bh = 30 + ((bx * 7) % 35);
            ctx.fillRect(bx, 110 - bh, 36, bh);
            ctx.fillStyle = '#fef08a';
            for (let wy = 115 - bh; wy < 105; wy += 8) {
                if ((bx + wy) % 5 === 0) ctx.fillRect(bx + 8, wy, 4, 4);
            }
            ctx.fillStyle = '#1c2541';
        }

        // Atmospheric Floodlight Haze (Volumetric Light Beams)
        ctx.fillStyle = 'rgba(254, 240, 138, 0.05)';
        ctx.beginPath();
        ctx.moveTo(35, 15); ctx.lineTo(160, 260); ctx.lineTo(0, 260); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(605, 15); ctx.lineTo(640, 260); ctx.lineTo(480, 260); ctx.closePath(); ctx.fill();

        // Massive 2.5D Curved Stadium Outer Bowl
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(320, 85, 330, 85, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Stadium Outer Concrete Pilasters & Seams
        ctx.fillStyle = '#334155';
        for (let px = 80; px <= 560; px += 40) {
            const pyTop = 85 - Math.sin(((px - 80) / 480) * Math.PI) * 70;
            ctx.fillRect(px, Math.round(pyTop), 8, 45);
        }

        // Stepped Arena Seating Tiers (Royal Blue, Stadium Navy & Golden Seats)
        const seatTiers = [
            { y: 52, h: 8, col1: '#1d4ed8', col2: '#1e3a8a', w: 460 },
            { y: 62, h: 8, col1: '#eab308', col2: '#ca8a04', w: 430 },
            { y: 72, h: 9, col1: '#1d4ed8', col2: '#1e3a8a', w: 400 },
            { y: 83, h: 9, col1: '#eab308', col2: '#ca8a04', w: 370 },
            { y: 94, h: 10, col1: '#1e40af', col2: '#172554', w: 340 }
        ];
        seatTiers.forEach(tier => {
            const tx = Math.round(320 - tier.w / 2);
            ctx.fillStyle = tier.col1;
            ctx.fillRect(tx, tier.y, tier.w, tier.h);
            // Individual pixel seat cushions & railings
            ctx.fillStyle = tier.col2;
            for (let sx = tx + 4; sx < tx + tier.w - 4; sx += 8) {
                ctx.fillRect(sx, tier.y, 3, tier.h);
            }
            // Aisle stairs
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(320 - 10, tier.y, 20, tier.h);
            ctx.fillRect(tx + 80, tier.y, 14, tier.h);
            ctx.fillRect(tx + tier.w - 94, tier.y, 14, tier.h);
        });

        // Tubular White Space-Frame Roof Truss Network
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let tx = 70; tx <= 570; tx += 50) {
            ctx.moveTo(tx, 98);
            ctx.lineTo(tx + 25, 22);
            ctx.lineTo(tx + 50, 98);
        }
        ctx.stroke();
        // Lower truss chord
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(60, 48);
        ctx.bezierCurveTo(200, 15, 440, 15, 580, 48);
        ctx.stroke();

        // Grand Stadium Gate Arches & Portico
        ctx.fillStyle = '#0f172a';
        for (let gx = 140; gx <= 500; gx += 60) {
            ctx.fillRect(gx, 105, 34, 35);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(gx + 6, 110, 22, 12); // Glowing turnstile light
            ctx.fillStyle = '#0f172a';
        }

        // Team Championship Pennants & Banners
        const banners = [
            { x: 175, col: '#ef4444', text: 'CHAMPS' },
            { x: 235, col: '#1d4ed8', text: 'ARENA' },
            { x: 405, col: '#eab308', text: 'COFFEDE' },
            { x: 465, col: '#10b981', text: 'VICTORY' }
        ];
        banners.forEach(b => {
            ctx.fillStyle = b.col;
            ctx.fillRect(b.x, 90, 24, 40);
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(b.x + 2, 92, 20, 3); // Gold fringe top
            // Pointed pennant bottom
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.moveTo(b.x, 130); ctx.lineTo(b.x + 12, 122); ctx.lineTo(b.x + 24, 130);
            ctx.fill();
        });

        // Massive Heavy-Duty Steel Lattice Floodlight Towers (4 Masts)
        [35, 175, 465, 605].forEach((lx, lIdx) => {
            // Steel Lattice Tower Shaft
            ctx.fillStyle = '#334155';
            ctx.fillRect(lx - 4, 12, 8, 128);
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let ly = 15; ly < 135; ly += 14) {
                ctx.moveTo(lx - 4, ly); ctx.lineTo(lx + 4, ly + 14);
                ctx.moveTo(lx + 4, ly); ctx.lineTo(lx - 4, ly + 14);
            }
            ctx.stroke();

            // Halogen Lamp Bank (3 rows x 4 columns = 12 Bulbs)
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(lx - 16, 5, 32, 22);
            ctx.strokeStyle = '#cbd5e1';
            ctx.strokeRect(lx - 16, 5, 32, 22);
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 4; c++) {
                    ctx.fillStyle = '#fffbeb';
                    ctx.fillRect(lx - 13 + c * 7, 7 + r * 6, 5, 4);
                }
            }
            // Glowing corona aura
            ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
            ctx.beginPath();
            ctx.arc(lx, 16, 24, 0, Math.PI * 2);
            ctx.fill();
        });

        // Concourse Sports Plaza Ground (2.5D Isometric Diamond Paving)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 140, width, height - 140);

        // Isometric Paving Grid (2:1 Diamond Flagstones)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        for (let y = 140; y < height + 40; y += 18) {
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(width, y - width * 0.22);
            ctx.moveTo(0, y - width * 0.22); ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Center Athletic Court Key & Striping (Dark Asphalt with Yellow/White Lines)
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(265, 235, 110, 50, -0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Free-throw key arc & centerline
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(265, 235, 55, 24, -0.22, 0, Math.PI * 2);
        ctx.stroke();

        // Bronze Athlete Statue on Tiered Granite Plinth (Centered at x: 440, y: 190)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(432, 192, 36, 6); // Drop shadow
        ctx.fillStyle = '#475569';
        ctx.fillRect(434, 178, 32, 14); // Lower base
        ctx.fillStyle = '#64748b';
        ctx.fillRect(438, 168, 24, 10); // Upper pedestal
        // Bronze Statue Silhouette
        ctx.fillStyle = '#b45309';
        ctx.fillRect(447, 148, 6, 20); // Torso & legs
        ctx.fillRect(444, 150, 12, 5);  // Raised arms with victory torch
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(448, 142, 5, 6);  // Head & laurel crown
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(449, 137, 3, 5);  // Torch flame

        // Souvenir & Merchandise Kiosks (Right Concourse x: 530)
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(530, 160, 48, 30);
        ctx.fillStyle = '#f8fafc';
        // Red/white striped awning
        for (let str = 0; str < 48; str += 12) {
            ctx.fillStyle = str % 24 === 0 ? '#ef4444' : '#ffffff';
            ctx.fillRect(530 + str, 154, 12, 6);
        }
        // Merchandise display (Foam fingers & caps)
        ctx.fillStyle = '#eab308';
        ctx.fillRect(535, 164, 6, 8); // Foam finger
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(545, 166, 8, 4); // Team cap
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(558, 166, 8, 4);

        // Digital LED Score Ticker Ribbon (Top Concourse y: 140)
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 138, width, 8);
        ctx.fillStyle = '#22c55e';
        for (let tx = 8; tx < width; tx += 28) {
            ctx.fillRect(tx, 140, 14, 4);
        }
    }

    // 2. Grand Galleria Shopping Mall: Multi-tier indoor atrium, vaulted glass skylight, brass escalators & marble floor
    renderShoppingMallBackdrop(ctx, width, height, groundY, weather) {
        // Vaulted Atrium Skylight Sky & Diffuse Daylighting
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 0, width, height);

        // Sunlight Shafts Radiating Downwards
        ctx.fillStyle = 'rgba(254, 243, 199, 0.12)';
        ctx.beginPath();
        ctx.moveTo(180, 0); ctx.lineTo(320, 240); ctx.lineTo(120, 240); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(420, 0); ctx.lineTo(560, 240); ctx.lineTo(360, 240); ctx.closePath(); ctx.fill();

        // Architectural Steel Barrel-Vault Skylight Framework
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let sx = 0; sx <= width; sx += 60) {
            ctx.moveTo(sx, 0);
            ctx.lineTo(sx + 20, 68);
        }
        ctx.stroke();
        // Skylight Glazing Ribs
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        for (let sy = 12; sy <= 60; sy += 14) {
            ctx.beginPath();
            ctx.moveTo(0, sy); ctx.lineTo(width, sy);
            ctx.stroke();
        }

        // 3rd Floor Mezzanine Balcony & Designer Storefronts
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 68, width, 22);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(0, 88, width, 3); // Polished brass bottom trim
        // 3rd Floor Glass Balustrade & Brass Handrail
        ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
        ctx.fillRect(0, 82, width, 7);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(0, 81, width, 2); // Brass top rail

        // 3rd Floor Boutiques with Glowing Backlit Marquees
        const upperBoutiques = [
            { x: 30, w: 85, name: 'ROLEX', col: '#15803d', textCol: '#fbbf24' },
            { x: 135, w: 90, name: 'APPLE', col: '#0f172a', textCol: '#ffffff' },
            { x: 245, w: 90, name: 'PRADA', col: '#18181b', textCol: '#ffffff' },
            { x: 355, w: 90, name: 'CHANEL', col: '#1c1917', textCol: '#fde047' },
            { x: 465, w: 85, name: 'GUCCI', col: '#14532d', textCol: '#ef4444' },
            { x: 570, w: 65, name: 'DIOR', col: '#334155', textCol: '#ffffff' }
        ];
        upperBoutiques.forEach(b => {
            ctx.fillStyle = b.col;
            ctx.fillRect(b.x, 70, b.w, 12);
            // Signboard Backlight
            ctx.fillStyle = b.textCol;
            ctx.fillRect(b.x + 10, 74, b.w - 20, 4);
        });

        // 2nd Floor Mezzanine Promenade Balcony
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 96, width, 30);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(0, 124, width, 4); // Heavy brass trim
        // 2nd Floor Balustrade
        ctx.fillStyle = 'rgba(186, 230, 253, 0.55)';
        ctx.fillRect(0, 116, width, 9);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(0, 115, width, 2); // Handrail

        // 2nd Floor Boutique Display Windows
        const midBoutiques = [
            { x: 50, w: 100, name: 'JEWELRY' },
            { x: 180, w: 110, name: 'CRYSTAL' },
            { x: 340, w: 110, name: 'GALLERIA' },
            { x: 480, w: 100, name: 'ESPRESSO' }
        ];
        midBoutiques.forEach(mb => {
            // Warm interior lighting
            ctx.fillStyle = '#fef3c7';
            ctx.fillRect(mb.x, 98, mb.w, 18);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(mb.x + 8, 102, mb.w - 16, 12);
            // Mannequins / Display Pedestals
            ctx.fillStyle = '#d97706';
            ctx.fillRect(mb.x + 20, 106, 6, 8);
            ctx.fillRect(mb.x + 50, 106, 6, 8);
        });

        // Escalators in Background (Dual Brass & Glass Moving Stairs)
        // Escalator 1 (Left Ascent)
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.moveTo(90, 142); ctx.lineTo(170, 75); ctx.lineTo(190, 75); ctx.lineTo(110, 142);
        ctx.closePath(); ctx.fill();
        // Moving silver step treads
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        for (let es = 0; es < 8; es++) {
            const ex1 = 96 + es * 10;
            const ey1 = 136 - es * 8;
            ctx.beginPath();
            ctx.moveTo(ex1, ey1); ctx.lineTo(ex1 + 12, ey1);
            ctx.stroke();
        }
        // Black handrail
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(88, 138); ctx.lineTo(168, 71);
        ctx.stroke();

        // Grand Galleria Italian Marble Concourse Floor
        ctx.fillStyle = '#fafaf9';
        ctx.fillRect(0, 144, width, height - 144);

        // Fior di Bosco Marble Tile Checkerboard (Alternating Cream & Rose Travertine)
        for (let my = 146; my < height; my += 24) {
            const row = Math.floor((my - 146) / 24);
            for (let mx = 0; mx < width; mx += 36) {
                const col = Math.floor(mx / 36);
                ctx.fillStyle = ((row + col) % 2 === 0) ? '#f5f5f4' : '#fed7aa';
                ctx.fillRect(mx, my, 35, 23);
                // Thin brass grout line
                ctx.fillStyle = 'rgba(217, 119, 6, 0.35)';
                ctx.fillRect(mx + 35, my, 1, 24);
                ctx.fillRect(mx, my + 23, 36, 1);
            }
        }

        // Circular Astrological Sunburst Brass Medallion (Center Stand Plaza x: 265, y: 225)
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(265, 225, 95, 42, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(265, 225, 85, 36, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Compass star points
        ctx.strokeStyle = '#d97706';
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            const px1 = 265 + Math.cos(a) * 45;
            const py1 = 225 + Math.sin(a) * 18;
            const px2 = 265 + Math.cos(a) * 85;
            const py2 = 225 + Math.sin(a) * 36;
            ctx.moveTo(px1, py1); ctx.lineTo(px2, py2);
        }
        ctx.stroke();

        // Indoor Planters with Lush Multi-Tier Kentia Palm Trees
        [40, 580].forEach(px => {
            // Polished Brass Urn Planter
            ctx.fillStyle = '#b45309';
            ctx.fillRect(px - 14, 150, 28, 22);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(px - 16, 148, 32, 4); // Rim
            ctx.fillStyle = '#78350f';
            ctx.fillRect(px - 12, 170, 24, 4); // Base

            // Palm Fronds (3-Tone Emerald Layers)
            const palmColors = ['#166534', '#15803d', '#22c55e'];
            palmColors.forEach((pc, pIdx) => {
                ctx.fillStyle = pc;
                ctx.beginPath();
                ctx.ellipse(px - 12 + pIdx * 12, 138 - pIdx * 6, 26, 14, (pIdx - 1) * 0.4, 0, Math.PI * 2);
                ctx.fill();
            });
        });

        // Curved Leather Cushion Mall Benches (x: 420, y: 215)
        ctx.fillStyle = '#78350f';
        ctx.fillRect(400, 225, 60, 6); // Walnut wood base
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(402, 218, 56, 8); // Cognac leather cushion
        ctx.fillStyle = '#d97706';
        ctx.fillRect(400, 216, 4, 12); // Brass leg
        ctx.fillRect(456, 216, 4, 12);
    }

    // 3. Metro Medical Center: Modern clinical 6-story pavilion, red cross beacon, ambulance bay & therapeutic garden
    renderHospitalPlazaBackdrop(ctx, width, height, groundY, weather) {
        // Morning Sky & Soft Pixel Clouds
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(0, 0, width, height);
        this.drawPixelCumulusCloud(ctx, 60, 20, 1.2, 0.85);
        this.drawPixelCumulusCloud(ctx, 420, 15, 1.0, 0.75);

        // 6-Story Clinical Tower Facade (Aluminum Composite Panels & Tinted Glass Ribbon)
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(60, 18, 520, 136);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 18, 520, 136);

        // Tinted Turquoise Glass Ribbon Windows with Room Silhouettes
        for (let wy = 34; wy < 135; wy += 22) {
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(70, wy, 500, 14);
            // Window Mullions
            ctx.fillStyle = '#f8fafc';
            for (let wx = 70; wx < 570; wx += 28) {
                ctx.fillRect(wx, wy, 2, 14);
            }
            // Interior hospital room warm glows
            ctx.fillStyle = '#fef08a';
            for (let wx = 80; wx < 550; wx += 56) {
                ctx.fillRect(wx, wy + 2, 12, 10);
            }
        }

        // Rooftop Helicopter Pad with Windsock
        ctx.fillStyle = '#334155';
        ctx.fillRect(110, 10, 70, 8);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(135, 12, 20, 4); // "H" marking
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(100, 6, 8, 12);  // Windsock

        // Massive Glowing 3D Red Neon Medical Cross Emblem (x: 320, y: 15)
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(302, 10, 36, 12);
        ctx.fillRect(314, -2, 12, 36);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(304, 12, 32, 8);
        ctx.fillRect(316, 0, 8, 32);
        // Soft Red Neon Ambient Aura
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.beginPath();
        ctx.arc(320, 16, 28, 0, Math.PI * 2);
        ctx.fill();

        // Cantilevered Ambulance Bay Canopy with Hazard Striping
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(20, 128, 260, 24);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(20, 150, 260, 3); // Under-canopy shadow
        // Red and Yellow Diagonal Hazard Chevrons
        for (let chx = 20; chx < 280; chx += 20) {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(chx, 146, 10, 4);
            ctx.fillStyle = '#facc15';
            ctx.fillRect(chx + 10, 146, 10, 4);
        }
        // Automatic Double-Glass Sliding Clinic Doors
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(90, 132, 60, 20);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(112, 134, 16, 3); // Green EXIT sign
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(119, 137, 2, 15); // Door seam

        // Emergency Strobe Beacon Light
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(35, 120, 8, 8);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.beginPath();
        ctx.arc(39, 124, 14, 0, Math.PI * 2);
        ctx.fill();

        // Ground Courtyard Floor
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 150, width, height - 150);

        // Ambulance Bay Roadway (Dark Charcoal Asphalt with Chevron markings)
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 152, 250, 70);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(0, 185, 250, 3); // Yellow lane divider
        // Yellow diagonal warning chevrons in ambulance bay
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        for (let ay = 158; ay < 215; ay += 16) {
            ctx.beginPath();
            ctx.moveTo(30, ay); ctx.lineTo(60, ay + 10); ctx.lineTo(90, ay);
            ctx.stroke();
        }

        // Concrete Plaza Expansion Score Lines
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        for (let cy = 160; cy < height; cy += 24) {
            ctx.beginPath();
            ctx.moveTo(250, cy); ctx.lineTo(width, cy);
            ctx.stroke();
        }

        // Therapeutic Healing Garden (Raised Curved Brick Planters with Lavender)
        ctx.fillStyle = '#991b1b'; // Terracotta red brick planter wall
        ctx.fillRect(330, 165, 270, 36);
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(330, 198, 270, 3);
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(328, 163, 274, 4); // Limestone coping top

        // Rich Soil & Lush Healing Shrubs
        ctx.fillStyle = '#451a03';
        ctx.fillRect(334, 167, 262, 28);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(336, 170, 258, 22);

        // Fragrant Lavender Flowers (Dense clusters of purple/violet pixels)
        for (let fx = 340; fx < 590; fx += 10) {
            const fyBase = 172 + ((fx * 3) % 12);
            ctx.fillStyle = '#a855f7';
            ctx.fillRect(fx, fyBase, 3, 7);
            ctx.fillStyle = '#7c3aed';
            ctx.fillRect(fx + 1, fyBase - 2, 2, 4);
            ctx.fillStyle = '#c084fc';
            ctx.fillRect(fx + 2, fyBase + 1, 2, 3);
        }

        // Stone Fountain in Plaza Center
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.ellipse(470, 225, 45, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.ellipse(470, 224, 40, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        // Water fountain jet
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(469, 212, 2, 10);
        ctx.fillRect(467, 214, 6, 2);

        // Stainless Steel Wellness Bench
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(340, 210, 48, 8);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(342, 218, 4, 10);
        ctx.fillRect(382, 218, 4, 10);
    }

    // 4. Tech Convention & Expo Center: Cybernetic sci-fi hall, curved LED video ribbons & neon circuit floor
    renderConventionCenterBackdrop(ctx, width, height, groundY, weather) {
        // Deep Space Midnight Expo Atmosphere
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, width, height);

        // Monumental Curved Space-Frame Roof Arches
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 110);
        ctx.bezierCurveTo(200, 15, 440, 15, width, 110);
        ctx.stroke();

        // Neon Edge Lightstrips on Roof Arches
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 108);
        ctx.bezierCurveTo(200, 13, 440, 13, width, 108);
        ctx.stroke();

        // Elevated Glass Skybridge Crossing Upper Background (x: 0..width, y: 30..55)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(0, 28, width, 26);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 28, width, 26);
        // Silhouette convention attendees walking in skybridge
        ctx.fillStyle = '#06b6d4';
        for (let px = 40; px < width; px += 75) {
            ctx.fillRect(px, 35, 4, 12);
            ctx.fillRect(px - 1, 32, 6, 4);
        }

        // 3 Giant Curved Digital LED Mega-Screens with Cyber Art
        const screens = [
            { x: 30, w: 165, title: 'AI & ROBOTICS 2026', col: '#06b6d4', glow: 'rgba(6, 182, 212, 0.35)' },
            { x: 225, w: 190, title: 'WEB3 & CRYPTO SUMMIT', col: '#ec4899', glow: 'rgba(236, 72, 153, 0.35)' },
            { x: 445, w: 165, title: 'RETRO INDIE GAMES', col: '#10b981', glow: 'rgba(16, 185, 129, 0.35)' }
        ];
        screens.forEach((sc, sIdx) => {
            // Beveled screen bezel
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(sc.x, 56, sc.w, 75);
            ctx.strokeStyle = sc.col;
            ctx.lineWidth = 2;
            ctx.strokeRect(sc.x, 56, sc.w, 75);

            // Screen ambient halo
            ctx.fillStyle = sc.glow;
            ctx.fillRect(sc.x - 4, 52, sc.w + 8, 4);

            // Digital LED Screen Display Content
            ctx.fillStyle = '#020617';
            ctx.fillRect(sc.x + 6, 62, sc.w - 12, 63);

            // Digital Screen Pixels & Cyber Waveforms
            ctx.fillStyle = sc.col;
            ctx.fillRect(sc.x + 12, 70, sc.w - 24, 10);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sc.x + 18, 73, sc.w - 36, 4); // Title banner

            if (sIdx === 0) {
                // Neural Network Node Graph (Screen 1)
                ctx.strokeStyle = '#06b6d4';
                ctx.lineWidth = 1;
                for (let nx = sc.x + 20; nx < sc.x + sc.w - 20; nx += 25) {
                    ctx.fillStyle = '#38bdf8';
                    ctx.fillRect(nx, 92, 5, 5);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(nx + 10, 108, 4, 4);
                }
            } else if (sIdx === 1) {
                // Crypto Candlestick Chart (Screen 2)
                for (let cx = sc.x + 20; cx < sc.x + sc.w - 20; cx += 16) {
                    const isGreen = ((cx * 7) % 2 === 0);
                    ctx.fillStyle = isGreen ? '#22c55e' : '#ef4444';
                    ctx.fillRect(cx, 90 + ((cx * 3) % 15), 6, 16);
                    ctx.fillRect(cx + 2, 85 + ((cx * 3) % 15), 2, 26);
                }
            } else {
                // 8-Bit Space Invader Pixel Sprite (Screen 3)
                ctx.fillStyle = '#10b981';
                const ix = sc.x + Math.round(sc.w / 2) - 14;
                ctx.fillRect(ix + 6, 90, 16, 4);
                ctx.fillRect(ix + 2, 94, 24, 8);
                ctx.fillRect(ix, 102, 28, 6);
                ctx.fillRect(ix + 4, 108, 6, 6);
                ctx.fillRect(ix + 18, 108, 6, 6);
            }
        });

        // Ultra-Polished Obsidian Terrazzo Floor with Neon Specular Reflections
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 142, width, height - 142);

        // Ambient Neon Floor Reflections
        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.fillRect(40, 145, 150, 45);
        ctx.fillStyle = 'rgba(236, 72, 153, 0.12)';
        ctx.fillRect(240, 145, 170, 45);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
        ctx.fillRect(450, 145, 150, 45);

        // Glowing Cyber LED Circuit Floor Tracks
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(30, 150); ctx.lineTo(160, 230); ctx.lineTo(480, 230); ctx.lineTo(610, 150);
        ctx.stroke();

        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(265, 230, 85, 36, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Floor Terrazzo Tile Seams
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let gx = 0; gx < width; gx += 45) {
            ctx.beginPath();
            ctx.moveTo(gx, 142); ctx.lineTo(gx, height);
            ctx.stroke();
        }

        // Holographic Demo Platform (Left Concourse x: 80, y: 195)
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(80, 205, 36, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Rotating Hologram Wireframe Cube Silhouette
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(68, 170, 24, 24);
        ctx.strokeRect(74, 164, 24, 24);

        // Registration & Badge Scanner Podiums (Right Concourse x: 530)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(520, 190, 45, 28);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(528, 182, 28, 8); // Touchscreen terminal
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(534, 184, 16, 4);

        // Futuristic Chrome Crowd Guidance Stanchions
        [160, 370, 480].forEach(sx => {
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(sx, 210, 4, 24); // Chrome pole
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(sx - 2, 208, 8, 3); // Brass top
            ctx.fillStyle = '#475569';
            ctx.fillRect(sx - 4, 232, 12, 4); // Base
        });
    }

    // 5. International Airport Terminal: Panoramic airfield view, taxing jetliner, Solari split-flap board & brass compass rose
    renderAirportTerminalBackdrop(ctx, width, height, groundY, weather) {
        // Clear Morning Airfield Sky
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(0, 0, width, 140);
        ctx.fillStyle = '#7dd3fc';
        ctx.fillRect(0, 0, width, 40);

        // Airfield Tarmac Asphalt Runway (Outside through glass)
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 75, width, 65);
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 75, width, 3); // Horizon curb

        // Runway White Centerline Dashes & Yellow Taxiway Lines
        ctx.fillStyle = '#ffffff';
        for (let rx = 10; rx < width; rx += 60) {
            ctx.fillRect(rx, 105, 34, 4);
        }
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 122); ctx.lineTo(width, 122);
        ctx.stroke();

        // Blue & Green Taxiway Light Beacons along Runway Edge
        for (let lx = 15; lx < width; lx += 55) {
            ctx.fillStyle = (lx % 110 === 0) ? '#22c55e' : '#38bdf8';
            ctx.fillRect(lx, 134, 4, 4);
        }

        // Commercial Jet Passenger Airliner (Boeing 787 / Airbus A350 Style Taxiing)
        // Fuselage
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(370, 92, 95, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.stroke();
        // Cockpit Windshield (Dark Blue Glass)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(285, 88, 12, 5);
        // Passenger Cabin Window Row
        ctx.fillStyle = '#1e293b';
        for (let wx = 305; wx < 440; wx += 8) {
            ctx.fillRect(wx, 90, 4, 4);
        }
        // Tail Fin (Aviation Royal Blue with Golden Logo)
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.moveTo(435, 92); ctx.lineTo(465, 58); ctx.lineTo(480, 58); ctx.lineTo(458, 92);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.fillRect(458, 66, 8, 4); // Airline star crest
        // Swept Wing & Twin Turbofan Engines
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(350, 94); ctx.lineTo(395, 116); ctx.lineTo(415, 116); ctx.lineTo(385, 94);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#475569';
        ctx.fillRect(365, 102, 18, 9); // Underwing Jet Engine Cowling
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(415, 115, 3, 3); // Red wingtip strobe beacon

        // Airfield Radar Control Tower (Far Left Background x: 45)
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(45, 35, 16, 45); // Tower shaft
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(38, 24, 30, 12); // Glass observation cab
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(51, 18, 4, 6);   // Revolving beacon

        // Passenger Boarding Jet-Bridge Corridor (Far Right Background x: 520)
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(510, 80, 130, 24);
        ctx.fillStyle = '#475569';
        ctx.fillRect(510, 80, 130, 3); // Bellows accordion joints

        // High-Ceiling Structural Glass Curtain Wall (Framing the Outside Vista)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 5;
        for (let gx = 0; gx <= width; gx += 85) {
            ctx.beginPath();
            ctx.moveTo(gx, 0); ctx.lineTo(gx, 140);
            ctx.stroke();
            // Cable tension cross-braces
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(gx - 42, 0); ctx.lineTo(gx + 43, 140);
            ctx.moveTo(gx + 43, 0); ctx.lineTo(gx - 42, 140);
            ctx.stroke();
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 5;
        }

        // Iconic Solari di Udine Split-Flap Flight Departures Board
        ctx.fillStyle = '#020617';
        ctx.fillRect(110, 16, 420, 62);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(110, 16, 420, 62);

        // Flap Board Header
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(112, 18, 416, 10);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(125, 20, 50, 4);  // "FLIGHT"
        ctx.fillRect(215, 20, 80, 4);  // "DESTINATION"
        ctx.fillRect(350, 20, 60, 4);  // "REMARKS"
        ctx.fillRect(455, 20, 40, 4);  // "GATE"

        // 4 Rows of Yellow & Amber Split-Flap Departure Listings
        const departures = [
            { fl: 'FL 804', dest: 'TOKYO-HND', stat: 'ON TIME', gate: 'B12', col: '#facc15' },
            { fl: 'FL 418', dest: 'LONDON-LHR', stat: 'BOARDING', gate: 'B14', col: '#22c55e' },
            { fl: 'FL 109', dest: 'PARIS-CDG', stat: 'ON TIME', gate: 'B15', col: '#facc15' },
            { fl: 'FL 883', dest: 'NEW YORK', stat: 'DELAYED', gate: 'B18', col: '#ef4444' }
        ];
        departures.forEach((dep, dIdx) => {
            const dy = 32 + dIdx * 11;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(116, dy, 408, 9);
            // Split-flap horizontal center seam
            ctx.fillStyle = '#020617';
            ctx.fillRect(116, dy + 4, 408, 1);

            // Amber / Colored Text Letters
            ctx.fillStyle = dep.col;
            ctx.fillRect(122, dy + 2, 45, 5);  // Flight
            ctx.fillRect(210, dy + 2, 85, 5);  // Destination
            ctx.fillRect(345, dy + 2, 60, 5);  // Status
            ctx.fillRect(460, dy + 2, 28, 5);  // Gate
        });

        // Polished Platinum-Gray Concourse Terrazzo Floor
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(0, 140, width, height - 140);

        // Isometric Diamond Floor Grid (2:1 Ratio)
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        for (let y = 140; y < height + 40; y += 22) {
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(width, y - width * 0.22);
            ctx.moveTo(0, y - width * 0.22); ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Brass World Map & 16-Point Nautical Compass Rose Inlay (Centered at Stand Plaza x: 265, y: 225)
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(265, 225, 90, 40, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(265, 225, 78, 34, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Compass Rose Cardinal Star Rays
        ctx.beginPath();
        ctx.moveTo(265, 185); ctx.lineTo(265, 265);
        ctx.moveTo(175, 225); ctx.lineTo(355, 225);
        ctx.moveTo(205, 198); ctx.lineTo(325, 252);
        ctx.moveTo(205, 252); ctx.lineTo(325, 198);
        ctx.stroke();

        // Airport Gate Portal with Blue Glowing Gate Sign (Right Concourse x: 530)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(525, 150, 45, 50);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(528, 144, 39, 10);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(534, 147, 27, 4); // "GATE 12"

        // Rows of Blue Passenger Airport Seating with Silver Armrests (x: 410, y: 200)
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(390, 200, 65, 10); // Seats
        ctx.fillStyle = '#1e40af';
        ctx.fillRect(390, 210, 65, 8);  // Seat backs
        ctx.fillStyle = '#94a3b8';
        for (let ax = 390; ax <= 455; ax += 16) {
            ctx.fillRect(ax, 202, 3, 16); // Silver armrest & leg
        }

        // Stainless Steel Luggage Trolley Station (Left Concourse x: 50, y: 195)
        ctx.fillStyle = '#475569';
        ctx.fillRect(40, 215, 30, 4); // Floor rail
        for (let tc = 0; tc < 3; tc++) {
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(42 + tc * 8, 196, 12, 18);
            ctx.fillStyle = '#020617';
            ctx.fillRect(43 + tc * 8, 212, 4, 4); // Caster wheel
        }
    }

    // Fallbacks for remaining 10 locations (drawn procedurally if images are not loaded)
    renderCulDeSacBackdrop(ctx, width, height, groundY, weather) {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.ellipse(320, 230, 280, 110, 0, 0, Math.PI * 2);
        ctx.fill();
        // Cottages in background
        ctx.fillStyle = '#fde047';
        ctx.fillRect(60, 40, 140, 90);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(50, 40); ctx.lineTo(130, 5); ctx.lineTo(210, 40); ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#93c5fd';
        ctx.fillRect(420, 50, 140, 80);
    }

    renderCommunityGardenBackdrop(ctx, width, height, groundY, weather) {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, 0, width, height);
        // Terracotta paving
        ctx.fillStyle = '#c2410c';
        ctx.fillRect(80, 140, 480, 190);
        // Raised planter beds
        ctx.fillStyle = '#78350f';
        for (let bx = 100; bx < 540; bx += 90) {
            ctx.fillRect(bx, 150, 60, 40);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(bx + 4, 154, 52, 32);
            ctx.fillStyle = '#78350f';
        }
        // Victorian Greenhouse
        ctx.fillStyle = 'rgba(224, 242, 254, 0.85)';
        ctx.fillRect(360, 30, 220, 100);
        ctx.strokeStyle = '#047857';
        ctx.strokeRect(360, 30, 220, 100);
    }

    renderPublicLibraryBackdrop(ctx, width, height, groundY, weather) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, width, height);
        // Brick Neoclassical facade
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(60, 20, 520, 130);
        // White limestone columns
        ctx.fillStyle = '#f1f5f9';
        for (let cx = 100; cx <= 500; cx += 55) {
            ctx.fillRect(cx, 30, 18, 120);
        }
        // Reading courtyard
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 150, width, height - 150);
    }

    renderLakeMarinaBackdrop(ctx, width, height, groundY, weather) {
        // Sparkling blue lake
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(0, 0, width, height);
        // Wooden boardwalk deck
        ctx.fillStyle = '#a16207';
        ctx.fillRect(0, 140, width, height - 140);
        // Boat slips with docked sailboats
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(380, 60, 90, 20); // Sailboat
        ctx.fillStyle = '#f87171';
        ctx.fillRect(420, 30, 4, 30);  // Mast
    }

    renderCampsiteBackdrop(ctx, width, height, groundY, weather) {
        // Pine mountain forest
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, width, height);
        // Dirt clearing
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.ellipse(320, 240, 260, 100, 0, 0, Math.PI * 2);
        ctx.fill();
        // Ranger cabin
        ctx.fillStyle = '#b45309';
        ctx.fillRect(400, 60, 160, 90);
    }

    renderFarmersMarketBackdrop(ctx, width, height, groundY, weather) {
        // Cobblestone square
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 0, width, height);
        // Striped market canopies
        const stalls = [
            { x: 50, color: '#ef4444' },
            { x: 210, color: '#22c55e' },
            { x: 370, color: '#3b82f6' }
        ];
        stalls.forEach(s => {
            ctx.fillStyle = s.color;
            ctx.fillRect(s.x, 70, 120, 50);
            ctx.fillStyle = '#ffffff';
            for (let str = 0; str < 120; str += 20) {
                ctx.fillRect(s.x + str, 70, 10, 50);
            }
        });
    }

    renderBeachBoardwalkBackdrop(ctx, width, height, groundY, weather) {
        // Turquoise Ocean
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(0, 0, width, 120);
        // Golden sand
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(0, 120, width, 30);
        // Wooden boardwalk concourse
        ctx.fillStyle = '#d97706';
        ctx.fillRect(0, 150, width, height - 150);
    }

    renderConstructionSiteBackdrop(ctx, width, height, groundY, weather) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 0, width, height);
        // Rising skyscraper steel girder frame
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3;
        for (let gx = 100; gx <= 500; gx += 80) {
            ctx.strokeRect(gx, 10, 70, 140);
        }
        // Safety yellow bypass walkway
        ctx.fillStyle = '#eab308';
        ctx.fillRect(0, 150, width, 12);
    }

    renderArtDistrictBackdrop(ctx, width, height, groundY, weather) {
        // Exposed brick lofts with street art
        ctx.fillStyle = '#9a3412';
        ctx.fillRect(0, 0, width, 160);
        // Colorful mural
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(80, 30, 200, 100);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(320, 40, 180, 90);
        // Artistic paved floor
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 160, width, height - 160);
    }

    renderAmusementPierBackdrop(ctx, width, height, groundY, weather) {
        // Twilight sky
        ctx.fillStyle = '#312e81';
        ctx.fillRect(0, 0, width, height);
        // Wooden roller coaster trestle silhouette
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(350, 140);
        ctx.bezierCurveTo(420, 20, 480, 20, 560, 140);
        ctx.stroke();
        // Pier boardwalk deck
        ctx.fillStyle = '#b45309';
        ctx.fillRect(0, 140, width, height - 140);
    }

    renderDefaultProceduralBackdrop(ctx, width, height, groundY, weather) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 150, width, height - 150);
    }

    // -------------------------------------------------------------
    // FOREGROUND OCCLUSION SYSTEM (MULTI-LAYER DEPTH ARCHITECTURE)
    // -------------------------------------------------------------
    renderForegroundLayer(ctx, width = 640, height = 360, locationId = 'suburbs', weather = null) {
        if (!ctx) return;
        const w = width || 640;
        const h = height || 360;
        const locId = locationId || (window.simulationModel && window.simulationModel.currentLocation) || 'suburbs';

        const bgImg = (locId === 'suburbs' && this.suburbsBg) ? this.suburbsBg : (this.locationBgs && this.locationBgs[locId]);
        const isBgLoaded = Boolean((locId === 'suburbs' && this.suburbsBgLoaded) || (this.locationBgsLoaded && this.locationBgsLoaded[locId]));

        if (isBgLoaded && bgImg && typeof ctx.drawImage === 'function') {
            this.renderPreRenderedForeground(ctx, w, h, locId, bgImg, weather);
        } else if (typeof ctx.fillRect === 'function') {
            this.renderProceduralForeground(ctx, w, h, locId, weather);
        }
    }

    renderPreRenderedForeground(ctx, width, height, locationId, bgImg, weather) {
        if (!ctx || !bgImg || typeof ctx.drawImage !== 'function') return;
        const w = width || 640;
        const h = height || 360;

        ctx.save();
        let hasClipped = false;
        if (typeof ctx.beginPath === 'function') {
            ctx.beginPath();

            if (locationId === 'metro') {
                // 1. Left massive dark green iron pillar shaft (tight column bounding x: 134..158)
                if (typeof ctx.rect === 'function') {
                    ctx.rect(134, 180, 24, 180);
                    // 2. Center dark green iron pedestal pillar (tight column bounding x: 258..286, y >= 252)
                    ctx.rect(258, 252, 28, 108);
                    // 3. Newsstand kiosk body & awning (tight body x: 368..458, y >= 234)
                    ctx.rect(368, 234, 90, 110);
                    // 4. Four-faced brass station clock (hanging at upper right x: 535..585, y: 130..210)
                    ctx.rect(535, 130, 50, 80);
                    // 5. Lower-right ticket machines & station wall (y >= 285)
                    ctx.rect(565, 285, 75, 75);
                }
                // 6. Lower balustrade/railing along concourse stairwell void (bottom-left)
                if (typeof ctx.moveTo === 'function' && typeof ctx.lineTo === 'function') {
                    ctx.moveTo(0, 272);
                    ctx.lineTo(146, 356);
                    ctx.lineTo(146, 360);
                    ctx.lineTo(0, 360);
                    if (typeof ctx.closePath === 'function') ctx.closePath();
                }
            } else if (locationId === 'suburbs') {
                if (typeof ctx.rect === 'function') {
                    // 1. Foreground oak tree trunk (bottom-left corner, strictly y >= 305 and x <= 36 to preserve crosswalk)
                    ctx.rect(0, 305, 36, 55);
                    // 2. Boutique corner eave and striped awning (strictly bottom-right x >= 595, y >= 260)
                    ctx.rect(595, 260, 45, 100);
                    // 3. Vintage streetlamp posts (tight 6px-wide poles)
                    ctx.rect(70, 240, 6, 60);
                    ctx.rect(218, 245, 6, 55);
                    ctx.rect(348, 250, 6, 60);
                    ctx.rect(502, 230, 6, 60);
                }
            } else if (locationId === 'park') {
                if (typeof ctx.rect === 'function') {
                    // 1. Low perimeter stone walls & balustrades (strictly at bottom edge below walkable paths)
                    ctx.rect(0, 285, 95, 75);
                    ctx.rect(480, 285, 160, 75);
                    ctx.rect(100, 335, 340, 25);
                    // 2. Bottom park streetlamps (tight 6px-wide poles)
                    ctx.rect(54, 250, 6, 46);
                    ctx.rect(418, 258, 6, 58);
                    ctx.rect(542, 294, 6, 66);
                }
            } else if (locationId === 'campus') {
                if (typeof ctx.rect === 'function') {
                    // 1. Foreground perimeter stone walls with limestone coping (strictly at edges)
                    ctx.rect(0, 274, 136, 86);
                    ctx.rect(482, 274, 158, 86);
                    // 2. Geometric manicured boxwood hedges (strictly y >= 284)
                    ctx.rect(174, 284, 122, 34);
                    // 3. Collegiate Victorian lamp posts with navy blue/gold banners (tight 8px poles)
                    ctx.rect(48, 230, 8, 82);
                    ctx.rect(114, 260, 8, 82);
                    ctx.rect(424, 270, 8, 82);
                    ctx.rect(494, 270, 8, 72);
                }
            } else if (locationId === 'downtown') {
                if (typeof ctx.rect === 'function') {
                    // 1. Stainless steel planters with evergreen conical shrubs (tight boxes y >= 240)
                    ctx.rect(182, 270, 42, 28);
                    ctx.rect(296, 270, 42, 28);
                    ctx.rect(372, 240, 42, 28);
                    // 2. Modern graphite streetlamp poles (tight 8px poles)
                    ctx.rect(314, 290, 8, 60);
                    ctx.rect(444, 224, 8, 56);
                    // 3. Crosswalk curb edges & foreground building rooftops (strictly outside walkways)
                    ctx.rect(0, 305, 36, 55);
                    ctx.rect(440, 262, 200, 98);
                }
            } else {
                // All other 15 locations: subtle bottom-corner foreground bevels
                // strictly outside all coffee stands (y ~ 180..190), queues, and pedestrian routes (y: 214..265)
                if (typeof ctx.rect === 'function') {
                    ctx.rect(0, h - 20, 24, 20);
                    ctx.rect(w - 24, h - 20, 24, 20);
                }
            }

            if (typeof ctx.clip === 'function') {
                ctx.clip();
                hasClipped = true;
            }
        }

        ctx.imageSmoothingEnabled = false;
        if (hasClipped && typeof ctx.drawImage === 'function') {
            try {
                ctx.drawImage(bgImg, 0, 0, w, h);
            } catch (e) {
                // Ignore broken image state
            }
        }
        ctx.restore();

        this.renderForegroundWeatherAtmosphere(ctx, w, h, locationId, weather);
    }

    renderForegroundWeatherAtmosphere(ctx, width, height, locationId, weather) {
        if (!ctx || !weather) return;
        const w = width || 640;
        const h = height || 360;
        if (weather.type === 'freezing') {
            // Subtle crisp winter snow dusting on foreground architectural surfaces
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
            if (locationId === 'metro') {
                // Snow along stairwell railing edge
                this.drawPixelLine(ctx, 4, 273, 148, 357, 'rgba(255, 255, 255, 0.85)');
            } else if (locationId === 'suburbs') {
                // Snow dusting on boutique roof eave
                if (typeof ctx.fillRect === 'function') ctx.fillRect(550, 224, 90, 2);
            } else if (locationId === 'park') {
                // Snow dusting on curved hedge crown & stone walls
                if (typeof ctx.fillRect === 'function') {
                    ctx.fillRect(104, 277, 220, 2);
                    ctx.fillRect(0, 267, 170, 2);
                }
            } else if (locationId === 'campus') {
                if (typeof ctx.fillRect === 'function') {
                    ctx.fillRect(0, 267, 135, 2);
                    ctx.fillRect(174, 279, 120, 2);
                }
            } else if (locationId === 'downtown') {
                if (typeof ctx.fillRect === 'function') {
                    ctx.fillRect(180, 266, 45, 2);
                    ctx.fillRect(295, 266, 45, 2);
                }
            } else {
                if (typeof ctx.fillRect === 'function') {
                    ctx.fillRect(0, h - 2, 24, 2);
                    ctx.fillRect(w - 24, h - 2, 24, 2);
                }
            }
            ctx.restore();
        } else if (weather.type === 'rainy') {
            // Wet specular glints on foreground railings and surfaces
            ctx.save();
            ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
            if (locationId === 'metro') {
                this.drawPixelLine(ctx, 8, 272, 140, 353, 'rgba(186, 230, 253, 0.45)');
            } else if (locationId === 'downtown') {
                if (typeof ctx.fillRect === 'function') {
                    ctx.fillRect(182, 268, 40, 1);
                    ctx.fillRect(297, 268, 40, 1);
                }
            } else {
                if (typeof ctx.fillRect === 'function') {
                    ctx.fillRect(2, h - 2, 20, 1);
                    ctx.fillRect(w - 22, h - 2, 20, 1);
                }
            }
            ctx.restore();
        }
    }

    renderProceduralForeground(ctx, width, height, locationId, weather) {
        if (!ctx || typeof ctx.fillRect !== 'function') return;
        const w = width || 640;
        const h = height || 360;

        if (locationId === 'metro') {
            this.renderMetroForeground(ctx, w, h, weather);
        } else if (locationId === 'suburbs') {
            this.renderSuburbsForeground(ctx, w, h, weather);
        } else if (locationId === 'park') {
            this.renderParkForeground(ctx, w, h, weather);
        } else if (locationId === 'campus') {
            this.renderCampusForeground(ctx, w, h, weather);
        } else if (locationId === 'downtown') {
            this.renderDowntownForeground(ctx, w, h, weather);
        } else {
            this.renderGenericForeground(ctx, w, h, locationId, weather);
        }
    }

    renderGenericForeground(ctx, width, height, locationId, weather) {
        if (!ctx || typeof ctx.fillRect !== 'function') return;
        // Subtle edge lampposts and curb shadows ensuring ops > 10 for any procedural location
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(10, height - 70, 4, 70);
        ctx.fillRect(width - 14, height - 70, 4, 70);
        ctx.fillStyle = '#475569';
        ctx.fillRect(8, height - 72, 8, 4);
        ctx.fillRect(width - 16, height - 72, 8, 4);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(9, height - 76, 6, 4);
        ctx.fillRect(width - 15, height - 76, 6, 4);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, height - 12, width, 12);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, height - 13, width, 1);
    }

    // 1. Metro Foreground: Iron pillars, balustrade, brass clock post, and newsstand kiosk
    renderMetroForeground(ctx, width, height, weather) {
        if (!ctx) return;
        // Left Column (base at y=360, x=146, shaft x: 134..158)
        this.renderMetroIronPillar(ctx, 146, 360, 180);
        // Center Column Pedestal (base at y=360, x=272, top at y=252)
        this.renderMetroIronPillar(ctx, 272, 360, 252);

        // Lower Balustrade / Railing along bottom-left concourse edge
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 272, 4, 88); // Left corner post
        // Handrail
        ctx.fillStyle = '#166534';
        this.drawPixelLine(ctx, 0, 272, 146, 356, '#166534');
        this.drawPixelLine(ctx, 0, 273, 146, 357, '#22c55e');
        this.drawPixelLine(ctx, 0, 274, 146, 358, '#14532d');
        // Vertical cast-iron balusters
        for (let bx = 10; bx < 144; bx += 8) {
            const by = Math.round(272 + (bx / 146) * 84);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(bx, by, 2, height - by);
            ctx.fillStyle = '#475569';
            ctx.fillRect(bx, by, 1, height - by);
        }
        // Sturdy newel post at (146, 356)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(144, 346, 8, 14);
        ctx.fillStyle = '#334155';
        ctx.fillRect(143, 344, 10, 3);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(146, 342, 4, 3); // Brass finial

        // Four-Faced Antique Brass Station Clock on Ornate Bracket / Post
        this.renderMetroBrassClock(ctx, 560, 175);

        // Newsstand Kiosk (Mid-Right foreground)
        const kx = 368, ky = 238, kw = 90, kh = 102;
        ctx.fillStyle = '#14532d'; // Dark green timber
        ctx.fillRect(kx, ky, kw, kh);
        ctx.fillStyle = '#166534';
        ctx.fillRect(kx + 3, ky + 3, kw - 6, kh - 6);
        // Striped awning
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(kx - 4, ky - 6, kw + 8, 10);
        ctx.fillStyle = '#fef08a';
        for (let ax = kx - 4; ax < kx + kw + 4; ax += 12) {
            ctx.fillRect(ax, ky - 6, 6, 10);
        }
        // "NEWS" Signboard
        ctx.fillStyle = '#78350f';
        ctx.fillRect(kx + 16, ky + 6, kw - 32, 12);
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('NEWS', kx + 28, ky + 15);
        // Counters & colorful magazines
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(kx + 6, ky + 24, 22, 16);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(kx + 32, ky + 24, 20, 16);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(kx + 56, ky + 24, 22, 16);

        // Foreground Concourse Wooden Benches
        this.renderRetroBench(ctx, 180, 330);
        this.renderRetroBench(ctx, 290, 330);
    }

    renderMetroBrassClock(ctx, x, y) {
        if (!ctx) return;
        const cx = Math.round(x);
        const cy = Math.round(y);
        // Cast-iron wall bracket / post
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 2, cy - 28, 4, 28);
        ctx.fillRect(cx - 10, cy - 28, 20, 4);
        // Ornate scrollwork
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 6, cy - 22, 12, 2);
        // Antique brass clock housing
        ctx.fillStyle = '#b45309'; // Bronze rim
        this.drawPixelCircle(ctx, cx, cy, 15, '#b45309');
        ctx.fillStyle = '#facc15'; // Polished brass face ring
        this.drawPixelCircle(ctx, cx, cy, 13, '#facc15');
        ctx.fillStyle = '#eab308';
        this.drawPixelCircle(ctx, cx, cy, 11, '#fef9c3'); // Ivory dial
        // Clock tick marks
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx - 1, cy - 9, 2, 2);
        ctx.fillRect(cx + 7, cy - 1, 2, 2);
        ctx.fillRect(cx - 1, cy + 7, 2, 2);
        ctx.fillRect(cx - 9, cy - 1, 2, 2);
        // Clock hands
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 1, cy - 6, 2, 6);
        ctx.fillRect(cx, cy - 1, 5, 2);
        // Brass center finial & acorn drop
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx - 2, cy + 14, 4, 3);
        ctx.fillRect(cx - 1, cy + 17, 2, 2);
        // Ambient warm glowing lantern halo
        ctx.fillStyle = 'rgba(254, 240, 138, 0.22)';
        this.drawPixelCircle(ctx, cx, cy, 22, 'rgba(254, 240, 138, 0.22)');
    }

    renderMetroClockPost(ctx, x, y) {
        this.renderMetroBrassClock(ctx, x, y);
    }

    renderMetroIronPillar(ctx, x, baseY, topY) {
        const px = Math.round(x);
        const colW = 22;
        const colH = baseY - topY;

        // Base pedestal (granite/iron stepped)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px - 16, baseY - 20, 32, 20);
        ctx.fillStyle = '#334155';
        ctx.fillRect(px - 14, baseY - 24, 28, 5);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px - 16, baseY - 3, 32, 3);

        // Fluted iron shaft
        ctx.fillStyle = '#14532d'; // Dark green iron
        ctx.fillRect(px - Math.round(colW / 2), topY + 14, colW, colH - 36);
        // Column highlights & grooves
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(px - Math.round(colW / 2) + 2, topY + 14, 2, colH - 36);
        ctx.fillRect(px - 1, topY + 14, 2, colH - 36);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px + Math.round(colW / 2) - 4, topY + 14, 4, colH - 36);

        // Capital
        ctx.fillStyle = '#166534';
        ctx.fillRect(px - 14, topY + 4, 28, 12);
        ctx.fillStyle = '#334155';
        ctx.fillRect(px - 16, topY, 32, 5);

        // Sconce amber lanterns
        this.renderMetroSconceLamp(ctx, px - 18, topY + 45);
        this.renderMetroSconceLamp(ctx, px + 14, topY + 45);
    }

    renderMetroSconceLamp(ctx, x, y) {
        // Bracket
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x, y + 4, 6, 2);
        ctx.fillRect(x + 2, y, 2, 8);
        // Amber glowing lantern
        this.drawPixelCircle(ctx, x + 3, y + 4, 6, '#fff9c4', '#f59e0b');
    }

    // 2. Suburbs Foreground: Oak tree, vintage streetlamps, and boutique eave
    renderSuburbsForeground(ctx, width, height, weather) {
        if (!ctx) return;
        // Bottom-left lush oak tree
        const tx = 20, ty = 310;
        ctx.fillStyle = '#451a03';
        ctx.fillRect(tx, ty, 22, height - ty);
        ctx.fillStyle = '#271306';
        ctx.fillRect(tx + 16, ty, 6, height - ty);
        // Foliage canopy
        this.drawPixelCircle(ctx, tx - 10, ty + 10, 36, '#14532d');
        this.drawPixelCircle(ctx, tx + 14, ty - 6, 42, '#15803d');
        this.drawPixelCircle(ctx, tx + 40, ty + 16, 32, '#16a34a');
        this.drawPixelCircle(ctx, tx + 12, ty + 14, 30, '#22c55e');

        // Vintage streetlamps
        this.renderStreetLamp(ctx, 80, 290);
        this.renderStreetLamp(ctx, 228, 285);
        this.renderStreetLamp(ctx, 356, 320);
        this.renderStreetLamp(ctx, 510, 275);

        // Boutique corner eave (bottom-right)
        const bx = 550, by = 225, bw = 90, bh = 135;
        // Terracotta roof
        ctx.fillStyle = '#9a3412';
        ctx.fillRect(bx, by, bw, 22);
        ctx.fillStyle = '#c2410c';
        ctx.fillRect(bx, by + 18, bw, 4);
        // Striped awning
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(bx, by + 22, bw, 18);
        ctx.fillStyle = '#ffffff';
        for (let ax = bx; ax < bx + bw; ax += 14) {
            ctx.fillRect(ax, by + 22, 7, 18);
        }
        // Pastel wall & window
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(bx, by + 40, bw, bh - 40);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(bx + 14, by + 50, 60, 45);

        // Wooden Benches
        this.renderRetroBench(ctx, 195, 270);
        this.renderRetroBench(ctx, 250, 270);
    }

    renderRetroBench(ctx, x, y) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x, y - 6, 38, 4);
        ctx.fillRect(x, y - 1, 38, 4);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 2, y + 3, 3, 7);
        ctx.fillRect(x + 33, y + 3, 3, 7);
    }

    // 3. Park Foreground: Rose hedge, perimeter stone walls, bottom streetlamps
    renderParkForeground(ctx, width, height, weather) {
        if (!ctx) return;
        // Curved Rose Hedge
        const hx = 100, hy = 282, hw = 230, hh = 34;
        ctx.fillStyle = '#14532d';
        ctx.fillRect(hx, hy + 4, hw, hh - 4);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(hx + 4, hy, hw - 8, hh - 6);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(hx + 10, hy + 2, hw - 20, 8);
        // Rosebuds
        const roseColors = ['#e11d48', '#f43f5e', '#fda4af', '#be123c'];
        for (let rx = hx + 12; rx < hx + hw - 12; rx += 10) {
            ctx.fillStyle = roseColors[(rx * 7) % roseColors.length];
            this.drawPixelCircle(ctx, rx, hy + 4 + ((rx * 13) % 12), 3);
        }

        // Stone Perimeter Walls with Coping
        // Left wall
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 272, 175, height - 272);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, 270, 175, 4);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(0, 268, 175, 2);
        // Center wall
        ctx.fillStyle = '#475569';
        ctx.fillRect(100, 318, 340, height - 318);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(100, 314, 340, 4);
        // Right wall
        ctx.fillStyle = '#475569';
        ctx.fillRect(450, 242, 190, height - 242);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(450, 238, 190, 4);

        // Park Lamps
        this.renderStreetLamp(ctx, 64, 285);
        this.renderStreetLamp(ctx, 430, 300);
        this.renderStreetLamp(ctx, 555, 350);
    }

    // 4. Campus Foreground: Perimeter stone wall, boxwood hedges, collegiate lamp posts
    renderCampusForeground(ctx, width, height, weather) {
        if (!ctx) return;
        // Perimeter Stone Wall (Brick face, limestone coping)
        // Left
        ctx.fillStyle = '#7f1d1d'; // Brick
        ctx.fillRect(0, 272, 138, height - 272);
        ctx.fillStyle = '#cbd5e1'; // Limestone coping
        ctx.fillRect(0, 268, 138, 4);
        // Pillar post
        ctx.fillStyle = '#475569';
        ctx.fillRect(132, 264, 12, height - 264);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(130, 260, 16, 5);

        // Right
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(485, 272, 155, height - 272);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(485, 268, 155, 4);
        ctx.fillStyle = '#475569';
        ctx.fillRect(480, 264, 12, height - 264);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(478, 260, 16, 5);

        // Central Low Boxwood Hedge
        ctx.fillStyle = '#14532d';
        ctx.fillRect(175, 282, 122, 38);
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(177, 280, 118, 6);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(177, 286, 118, 30);

        // Collegiate Banner Lamp Posts
        this.renderCampusBannerLamp(ctx, 48, 298);
        this.renderCampusBannerLamp(ctx, 115, 332);
        this.renderCampusBannerLamp(ctx, 425, 338);
        this.renderCampusBannerLamp(ctx, 495, 328);
    }

    renderCampusBannerLamp(ctx, x, footY) {
        this.renderStreetLamp(ctx, x, footY);
        // Blue & Gold Collegiate Banner
        const topY = footY - 70;
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(x + 4, topY + 12, 12, 22);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x + 4, topY + 30, 12, 4); // Gold trim
        ctx.fillRect(x + 8, topY + 18, 4, 8);  // Crest mark
    }

    // 5. Downtown Foreground: Stainless steel planters, streetlamps, curb edges
    renderDowntownForeground(ctx, width, height, weather) {
        if (!ctx) return;
        // Stainless Steel Planters with Conical Shrubs
        this.renderDowntownPlanter(ctx, 182, 272);
        this.renderDowntownPlanter(ctx, 296, 272);
        this.renderDowntownPlanter(ctx, 372, 240);

        // Modern Streetlamps
        this.renderStreetLamp(ctx, 314, 342);
        this.renderStreetLamp(ctx, 444, 270);

        // Crosswalk Curb & Foreground Building Parapets
        // Bottom-left building parapet
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 252, 76, height - 252);
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 250, 76, 3);
        // Bottom-right building parapet
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(440, 262, 200, height - 262);
        ctx.fillStyle = '#475569';
        ctx.fillRect(440, 260, 200, 3);
    }

    renderDowntownPlanter(ctx, x, y) {
        const px = Math.round(x);
        const py = Math.round(y);
        // Conical Evergreen Topiary
        ctx.fillStyle = '#14532d';
        ctx.fillRect(px + 12, py - 18, 16, 20);
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(px + 14, py - 24, 12, 18);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(px + 17, py - 28, 6, 12);

        // Stainless Steel Planter Box
        ctx.fillStyle = '#64748b'; // Base shade
        ctx.fillRect(px, py, 42, 22);
        ctx.fillStyle = '#cbd5e1'; // Metallic face
        ctx.fillRect(px + 2, py + 2, 38, 18);
        ctx.fillStyle = '#f8fafc'; // Specular highlight glint
        ctx.fillRect(px + 2, py + 2, 38, 2);
        ctx.fillRect(px + 2, py + 2, 2, 18);
        ctx.fillStyle = '#475569'; // Drop shadow
        ctx.fillRect(px + 38, py + 2, 2, 18);
        ctx.fillRect(px + 2, py + 18, 38, 2);
    }

    // -------------------------------------------------------------
    // HERO COFFEE CART & EQUIPMENT (HIGH-PIXEL MASTERPIECE)
    // -------------------------------------------------------------
    renderStand(ctx, standX, standY, upgrades = {}, isBrewing = false, isPouring = false, isBoosted = false, weather = null, cartSkin = 'default', showHUD = true, showStandHUD = this.showStandHUD) {
        // Backward compatibility guard for signature
        if (typeof isBoosted === 'undefined') {
            isBoosted = isPouring;
            isPouring = false;
        }

        const x = Math.round(standX || 220);
        const y = Math.round(standY || 155);
        const upg = upgrades || {};
        const rawDecor = (upg.decor !== undefined && upg.decor !== null) ? upg.decor : 0;
        const decorLvl = Math.max(0, Math.min(5, rawDecor));
        const machineLvl = Math.max(1, Math.min(4, upg.machine || 1));
        const coolerLvl = Math.max(1, Math.min(4, upg.cooler || 1));
        const grinderLvl = Math.max(1, Math.min(3, upg.grinder || 1));
        const terminalLvl = Math.max(1, Math.min(3, upg.terminal || 1));
        const canopyLvl = Math.max(1, Math.min(3, upg.canopy || 1));
        const marketingLvl = Math.max(1, Math.min(4, upg.marketing || 1));

        // Custom cart image uploaded by user
        if (cartSkin === 'custom' && typeof window !== 'undefined' && window.customCartImage && typeof ctx.drawImage === 'function') {
            const img = window.customCartImage;
            const cW = img.naturalWidth || img.width || 747;
            const cH = img.naturalHeight || img.height || 930;
            const cartW = this.cartWidth || 76;
            const cartH = Math.round(cartW * (cH / cW));
            const cartX = x - 18;
            const cartY = y - 44;

            // 1. Soft Layered Drop Shadow Under Cart & Wheels (Dynamically Anchored)
            const shadowCenterX = cartX + Math.round(cartW * 0.46);
            const shadowCenterY = cartY + Math.round(cartH * 0.89);
            const shadowW = Math.round(cartW * 0.44);
            const shadowH = Math.round(cartW * 0.15);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
            ctx.beginPath();
            ctx.ellipse(shadowCenterX, shadowCenterY, shadowW, shadowH, -0.22, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
            ctx.beginPath();
            ctx.ellipse(shadowCenterX, shadowCenterY - 1, Math.round(shadowW * 0.76), Math.round(shadowH * 0.78), -0.22, 0, Math.PI * 2);
            ctx.fill();

            ctx.save();
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, cartX, cartY, cartW, cartH);
            ctx.restore();
            return;
        }

        // Render 16-Bit Isometric Pre-rendered Cart when loaded (unless non-default procedural skin requested)
        const isCartImgReady = (img) => {
            if (!img) return false;
            if (typeof HTMLImageElement !== 'undefined' && img instanceof HTMLImageElement) {
                return Boolean(img.complete && (img.naturalWidth > 0 || img.width > 0));
            }
            return true;
        };
        const levelSprite = (this.cartLevelLoaded && this.cartLevelLoaded[decorLvl] && this.cartLevelSprites && isCartImgReady(this.cartLevelSprites[decorLvl]))
            ? this.cartLevelSprites[decorLvl]
            : null;
        const fallbackCart = isCartImgReady(this.cartSpriteCanvas) ? this.cartSpriteCanvas : (isCartImgReady(this.cartSpriteImg) ? this.cartSpriteImg : null);
        const activeCartDrawable = levelSprite || fallbackCart;

        if (cartSkin === 'default' && this.cartLoaded && activeCartDrawable && typeof ctx.drawImage === 'function') {
            const cW = activeCartDrawable.naturalWidth || activeCartDrawable.width || 747;
            const cH = activeCartDrawable.naturalHeight || activeCartDrawable.height || 930;
            const baseW = this.cartWidth || 76;
            const uScale = baseW / 76;
            const scaleBoost = decorLvl === 3 ? 1.08 : (decorLvl === 4 ? 1.12 : (decorLvl >= 5 ? 1.16 : 1.0));
            const cartW = Math.round(baseW * scaleBoost);
            const cartH = Math.round(cartW * (cH / cW));
            const baseBottomY = (y - 44) + Math.round(baseW * (930 / 747));
            const cartX = x - 18 - Math.round((cartW - baseW) / 2);
            const cartY = baseBottomY - cartH;

            // 1. Soft Layered Drop Shadow Under Cart & Wheels (Dynamically Anchored)
            const shadowCenterX = cartX + Math.round(cartW * 0.46);
            const shadowCenterY = cartY + Math.round(cartH * 0.89);
            const shadowW = Math.round(cartW * 0.44);
            const shadowH = Math.round(cartW * 0.15);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
            ctx.beginPath();
            ctx.ellipse(shadowCenterX, shadowCenterY, shadowW, shadowH, -0.22, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
            ctx.beginPath();
            ctx.ellipse(shadowCenterX, shadowCenterY - 1, Math.round(shadowW * 0.76), Math.round(shadowH * 0.78), -0.22, 0, Math.PI * 2);
            ctx.fill();

            // 2. Web3 /boost Golden/Cyan Energy Aura
            if (isBoosted) {
                ctx.save();
                ctx.shadowColor = '#00ffcc';
                ctx.shadowBlur = 20;
                ctx.strokeStyle = '#f1c40f';
                ctx.lineWidth = 2.5;
                ctx.strokeRect(cartX - 4, cartY - 4, cartW + 8, cartH + 8);
                ctx.restore();
            }

            // 3. 16-Bit Isometric Cart with Built-In Barista (Transforms cleanly across Decor Levels 0 to 5 without extra surrounding clutter)
            ctx.save();
            ctx.imageSmoothingEnabled = false;
            try {
                ctx.drawImage(activeCartDrawable, cartX, cartY, cartW, cartH);
            } catch (e) {
                // Ignore broken image state
            }
            ctx.restore();

            if (showHUD && showStandHUD && typeof this.renderStandHUD === 'function') {
                const cups = (window.simulationModel && typeof window.simulationModel.cupsInBatch === 'number')
                    ? window.simulationModel.cupsInBatch
                    : 0;
                const tips = (window.web3Manager && typeof window.web3Manager.tipJarCash === 'number')
                    ? (window.web3Manager.tipJarCash + (window.web3Manager.tipJarUSDC || 0))
                    : 0;
                this.renderStandHUD(ctx, x, y, cups, tips);
            }

            return;
        }

        // -------------------------------------------------------------
        // PROCEDURAL MULTI-LAYER 16-BIT ISOMETRIC STAND (ALL 6 DECOR TIERS 0..5)
        // -------------------------------------------------------------
        const cartW = this.cartWidth || 76;
        const cartH = Math.round(cartW * 1.24);
        const cartX = x - 18;
        const cartY = y - 44;
        const shadowCenterX = cartX + Math.round(cartW * 0.46);
        const shadowCenterY = cartY + Math.round(cartH * 0.89);
        const shadowW = Math.round(cartW * 0.44);
        const shadowH = Math.round(cartW * 0.15);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
        ctx.beginPath();
        ctx.ellipse(shadowCenterX, shadowCenterY, shadowW, shadowH, -0.22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
        ctx.beginPath();
        ctx.ellipse(shadowCenterX, shadowCenterY - 1, Math.round(shadowW * 0.76), Math.round(shadowH * 0.78), -0.22, 0, Math.PI * 2);
        ctx.fill();

        // 2. Web3 /boost Golden/Cyan Energy Aura
        if (isBoosted) {
            ctx.save();
            ctx.shadowColor = '#00ffcc';
            ctx.shadowBlur = 22;
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x - 6, y - 52);
            ctx.lineTo(x + 64, y - 52);
            ctx.lineTo(x + 64, y + 44);
            ctx.lineTo(x - 6, y + 44);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }

        // 3. Barista Character Sprite (Behind Counter Diamond)
        this.renderBarista(ctx, x + 10, y - 18, isBrewing, isPouring, upg);

        // 4. Isometric Cart Body (6 Distinct Architectural Tiers: Level 0 Folding Table .. Level 5 Flagship)
        const leftPaletteByDecor = {
            0: ['#475569', '#64748b', '#94a3b8', '#cbd5e1'], // Level 0: Folding Table & Makeshift Gear
            1: ['#5d4037', '#6d4c41', '#8d6e63', '#a1887f'], // Level 1: Rustic Timber
            2: ['#4a2912', '#613719', '#7a4722', '#93582c'], // Level 2: Artisan Mahogany
            3: ['#2c150c', '#3d1f12', '#522b19', '#6e3a22'], // Level 3: Luxury Walnut & Marble
            4: ['#064e3b', '#047857', '#b45309', '#d97706'], // Level 4: Parisian Emerald Tile & Copper
            5: ['#090d16', '#111827', '#d97706', '#facc15']  // Level 5: Imperial Black Onyx & 24k Gold
        };
        const rightPaletteByDecor = {
            0: ['#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'],
            1: ['#6d4c41', '#8d6e63', '#a1887f', '#bcaaa4'],
            2: ['#613719', '#7a4722', '#93582c', '#ad6935'],
            3: ['#3d1f12', '#522b19', '#6e3a22', '#8d4e2f'],
            4: ['#047857', '#059669', '#d97706', '#f59e0b'],
            5: ['#111827', '#1e293b', '#f59e0b', '#fef08a']
        };
        const leftCols = leftPaletteByDecor[decorLvl] || leftPaletteByDecor[1];
        const rightCols = rightPaletteByDecor[decorLvl] || rightPaletteByDecor[1];

        ctx.fillStyle = leftCols[1];
        ctx.beginPath();
        ctx.moveTo(x - 2, y + 8);
        ctx.lineTo(x + 36, y + 18);
        ctx.lineTo(x + 36, y + 46);
        ctx.lineTo(x - 2, y + 36);
        ctx.closePath();
        ctx.fill();

        // Plank / Molding lines on Left Face
        ctx.strokeStyle = leftCols[0];
        ctx.lineWidth = 1;
        for (let py = 16; py < 44; py += 10) {
            ctx.beginPath();
            ctx.moveTo(x - 2, y + py);
            ctx.lineTo(x + 36, y + py + 10);
            ctx.stroke();
        }

        // Right Face (sunny side, facing down-right toward customer queue)
        ctx.fillStyle = rightCols[1];
        ctx.beginPath();
        ctx.moveTo(x + 36, y + 18);
        ctx.lineTo(x + 58, y + 8);
        ctx.lineTo(x + 58, y + 36);
        ctx.lineTo(x + 36, y + 46);
        ctx.closePath();
        ctx.fill();

        // Level 4 Hammered Copper Inset Panels / Level 5 Backlit Alabaster Gold Panels
        if (decorLvl === 4) {
            ctx.fillStyle = '#d97706';
            ctx.fillRect(x + 4, y + 16, 12, 16);
            ctx.fillRect(x + 20, y + 20, 12, 16);
            ctx.strokeStyle = '#fef08a';
            ctx.strokeRect(x + 4, y + 16, 12, 16);
            ctx.strokeRect(x + 20, y + 20, 12, 16);
        } else if (decorLvl >= 5) {
            ctx.fillStyle = '#fef08a'; // Glowing backlit gold alabaster
            ctx.fillRect(x + 4, y + 16, 12, 16);
            ctx.fillRect(x + 20, y + 20, 12, 16);
            ctx.strokeStyle = '#f59e0b';
            ctx.strokeRect(x + 3, y + 15, 14, 18);
            ctx.strokeRect(x + 19, y + 19, 14, 18);
        }

        // Brass Corner Brackets & Rivets
        this.drawBrassBracket(ctx, x - 2, y + 8, false, false);
        this.drawBrassBracket(ctx, x + 34, y + 18, true, false);
        this.drawBrassBracket(ctx, x + 50, y + 8, true, false);

        // 5. Countertop Diamond (Top Surface in true 2.5D Isometric view)
        let counterTopCol = '#5d4037';
        let counterEdgeCol = '#8d6e63';
        if (decorLvl >= 5) {
            counterTopCol = '#0f172a'; // Jet-Black Onyx Marble
            counterEdgeCol = '#facc15'; // 24k Gold Trim
        } else if (decorLvl === 4) {
            counterTopCol = '#d97706'; // Burnished Parisian Copper
            counterEdgeCol = '#fbbf24';
        } else if (decorLvl === 3) {
            counterTopCol = '#eceff1'; // Carrara Marble
            counterEdgeCol = '#b0bec5';
        } else if (decorLvl === 2) {
            counterTopCol = '#d7ccc8'; // Polished Oak Slab
            counterEdgeCol = '#a1887f';
        }

        ctx.fillStyle = counterTopCol;
        ctx.beginPath();
        ctx.moveTo(x + 18, y - 4);
        ctx.lineTo(x + 58, y + 8);
        ctx.lineTo(x + 36, y + 18);
        ctx.lineTo(x - 2, y + 8);
        ctx.closePath();
        ctx.fill();

        // Edge highlights along counter
        ctx.strokeStyle = counterEdgeCol;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 2, y + 8);
        ctx.lineTo(x + 36, y + 18);
        ctx.lineTo(x + 58, y + 8);
        ctx.stroke();

        // Winter Snow Dusting on Counter
        if (weather && weather.type === 'freezing') {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(x + 18, y - 5);
            ctx.lineTo(x + 58, y + 7);
            ctx.lineTo(x + 36, y + 17);
            ctx.lineTo(x - 2, y + 7);
            ctx.closePath();
            ctx.fill();
        }

        // 6. Spoked Cart Wheel on Left Face (for wheeled carts Lvl 1-2) or Architectural Plinth & Stanchions (Lvl 3-5)
        if (decorLvl <= 2) {
            this.drawHighPixelWheel(ctx, x + 14, y + 32, 13, decorLvl >= 2);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(x + 44, y + 36, 4, 12);
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(x + 44, y + 46, 4, 2);
        } else {
            // Luxury Brass Base Moulding & Velvet Rope Stanchions (Levels 3, 4, 5)
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(x - 3, y + 36, 40, 3);
            ctx.fillRect(x + 36, y + 36, 23, 3);
            this.renderDecorTierAccents(ctx, cartX, cartY, cartW, cartH, decorLvl);
        }

        // 7. Dynamic Chalkboard Menu Sign & Marketing Features (Levels 1 to 4)
        this.renderHighPixelStandSign(ctx, x + 24, y + 14, 30, upg);

        // 8. Countertop Equipment (High-Pixel Detail across all upgrade tiers)
        this.renderHighPixelEspressoMachine(ctx, x + 4, y + 2, machineLvl, isBrewing);
        this.renderHighPixelGrinder(ctx, x + 22, y - 2, grinderLvl);
        this.renderHighPixelSyrups(ctx, x + 38, y + 4);
        this.renderHighPixelTipJar(ctx, x + 44, y + 8);
        this.renderHighPixelCupStack(ctx, x + 48, y + 10);
        this.renderHighPixelTerminal(ctx, x + 52, y + 14, terminalLvl);
        this.renderHighPixelCooler(ctx, x + 6, y + 24, coolerLvl);

        // 9. Canopy Awning Support Pillars & Canopy Awning
        if (canopyLvl >= 2) {
            const pillarCol = decorLvl >= 2 ? '#b8860b' : '#3e2723';
            ctx.fillStyle = pillarCol;
            ctx.fillRect(x, y - 42, 2, 48);
            ctx.fillRect(x + 54, y - 42, 2, 48);

            // 10. Scalloped Fabric Canopy Awning with 3D Folds & Breeze Flutter
            this.renderScallopedCanopy(ctx, x - 6, y - 48, 68, 18, canopyLvl, isBoosted, weather);
        } else {
            // Level 1: Open Stand without awning
            const pillarCol = decorLvl >= 2 ? '#b8860b' : '#4a2c11';
            ctx.fillStyle = pillarCol;
            ctx.fillRect(x + 2, y - 32, 2, 38);
            ctx.fillRect(x + 52, y - 32, 2, 38);
            ctx.fillRect(x + 2, y - 32, 52, 2); // open top crossbar
        }
    }

    // Luxury & Atmospheric Accents for Cart Decor Tiers (Levels 2 to 5)
    renderDecorTierAccents(ctx, cartX, cartY, cartW, cartH, decorLvl) {
        if (decorLvl === 2) {
            // Level 2: Artisan Brass Gallery Rail & Wheel Glints
            ctx.fillStyle = '#facc15';
            ctx.fillRect(cartX + 6, cartY + Math.round(cartH * 0.52), 3, 3);
            ctx.fillRect(cartX + cartW - 10, cartY + Math.round(cartH * 0.52), 3, 3);
        } else if (decorLvl === 3) {
            // Level 3: VIP Brass Stanchions & Crimson Velvet Rope in Front of Bar
            const stY = cartY + cartH - 18;
            ctx.fillStyle = '#facc15';
            ctx.fillRect(cartX + 4, stY, 3, 14);
            ctx.fillRect(cartX + 28, stY + 4, 3, 14);
            ctx.fillStyle = '#b91c1c'; // Crimson velvet rope
            ctx.beginPath();
            ctx.moveTo(cartX + 5, stY + 3);
            ctx.lineTo(cartX + 17, stY + 10);
            ctx.lineTo(cartX + 29, stY + 6);
            ctx.strokeStyle = '#b91c1c';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (decorLvl === 4) {
            // Level 4: Parisian Art-Deco Glowing Vintage Globe Lantern Halos
            const pulse = 0.20 + Math.sin(this.frame * 0.08) * 0.06;
            ctx.fillStyle = `rgba(251, 191, 36, ${pulse})`;
            const lanternPositions = [
                [cartX + 6, cartY + Math.round(cartH * 0.22)],
                [cartX + Math.round(cartW * 0.50), cartY + Math.round(cartH * 0.36)],
                [cartX + cartW - 6, cartY + Math.round(cartH * 0.22)]
            ];
            lanternPositions.forEach(([lx, ly]) => {
                this.drawPixelCircle(ctx, lx, ly, 7, `rgba(253, 224, 71, ${pulse})`, `rgba(245, 158, 11, ${pulse})`);
                ctx.fillStyle = '#fef9c3';
                ctx.fillRect(lx - 1, ly - 1, 3, 3);
            });
        } else if (decorLvl >= 5) {
            // Level 5: Imperial Gold & Onyx Flagship Pavilion Crown Glints, Flanking Coach Lanterns & Sparkles
            const pulse = 0.24 + Math.sin(this.frame * 0.10) * 0.08;
            // Golden Crown Finial Beacon
            const crownX = cartX + Math.round(cartW * 0.50);
            const crownY = cartY + 6;
            this.drawPixelCircle(ctx, crownX, crownY, 8, `rgba(250, 204, 21, ${pulse})`, `rgba(245, 158, 11, ${pulse})`);
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(crownX - 1, crownY - 4, 3, 9);
            ctx.fillRect(crownX - 4, crownY - 1, 9, 3);

            // Flanking Imperial Coach Lantern Halos on Left & Right Columns
            const coachLanterns = [
                [cartX + 6, cartY + Math.round(cartH * 0.42)],
                [cartX + cartW - 6, cartY + Math.round(cartH * 0.44)]
            ];
            coachLanterns.forEach(([lx, ly]) => {
                this.drawPixelCircle(ctx, lx, ly, 6, `rgba(253, 224, 71, ${pulse})`, `rgba(245, 158, 11, ${pulse})`);
                ctx.fillStyle = '#fef9c3';
                ctx.fillRect(lx - 1, ly - 1, 2, 2);
            });

            // Shimmering Golden Sparkles around the Imperial Pavilion
            const spX = cartX + 10 + Math.round(((this.frame * 1.7) % Math.max(10, cartW - 20)));
            const spY = cartY + 14 + Math.round(((this.frame * 1.1) % Math.max(10, cartH - 28)));
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(spX, spY, 2, 2);
        }
    }

    drawBrassBracket(ctx, x, y, flipX, flipY) {
        ctx.fillStyle = '#f1c40f'; // Brass base
        ctx.fillRect(x, y, 8, 8);
        ctx.fillStyle = '#fff9c4'; // Glint
        ctx.fillRect(flipX ? x + 5 : x + 1, flipY ? y + 5 : y + 1, 2, 2);
        ctx.fillStyle = '#b8860b'; // Rivet
        ctx.fillRect(flipX ? x + 2 : x + 4, flipY ? y + 2 : y + 4, 2, 2);
    }

    // Heavy-Duty 12-Spoke Wooden Wheel with Iron Rim & Brass Hub
    drawHighPixelWheel(ctx, cx, cy, radius, isPremium) {
        const rcx = Math.round(cx);
        const rcy = Math.round(cy + radius * 0.5);

        // 1. Dark Iron Outer Rim with Rim Bolts
        this.drawPixelCircle(ctx, rcx, rcy, radius * 0.72, '#212121');
        this.drawPixelCircle(ctx, rcx, rcy, radius * 0.62, isPremium ? '#d4ac0d' : '#4e342e');

        // 2. Beveled Radial Spokes (8 stationary spokes)
        ctx.strokeStyle = isPremium ? '#f1c40f' : '#6d4c41';
        ctx.lineWidth = 2;
        for (let a = 0; a < 4; a++) {
            const angle = (a * Math.PI / 4);
            ctx.beginPath();
            ctx.moveTo(rcx - Math.cos(angle) * (radius * 0.6), rcy - Math.sin(angle) * (radius * 0.6));
            ctx.lineTo(rcx + Math.cos(angle) * (radius * 0.6), rcy + Math.sin(angle) * (radius * 0.6));
            ctx.stroke();
        }

        // 3. Central Brass Hub with Axle Bolt
        this.drawPixelCircle(ctx, rcx, rcy, 5, '#f1c40f', '#b8860b');
        this.drawPixelRect(ctx, rcx - 1, rcy - 1, 3, 3, '#212121');
    }

    // High-Pixel Espresso Machine (Levels 1 to 4)
    renderHighPixelEspressoMachine(ctx, mx, my, level, isBrewing) {
        const x = Math.round(mx);
        const y = Math.round(my);

        if (level === 1) {
            // Level 1: Vintage Copper & Lever Moka Brewer with Glass Carafe
            ctx.fillStyle = '#b87333'; // Copper body
            ctx.fillRect(x, y - 18, 14, 18);
            ctx.fillStyle = '#d4883b'; // Glint
            ctx.fillRect(x + 2, y - 16, 4, 14);
            // Glass Carafe with dark roasted coffee
            ctx.fillStyle = 'rgba(220, 240, 255, 0.7)';
            ctx.fillRect(x + 1, y - 10, 12, 10);
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(x + 2, y - 7, 10, 7);
        } else if (level === 2) {
            // Level 2: Compact Commercial Espresso Machine (Scarlet & Chrome)
            ctx.fillStyle = '#b71c1c';
            ctx.fillRect(x, y - 24, 20, 24);
            ctx.fillStyle = '#e53935'; // Accent band
            ctx.fillRect(x + 2, y - 22, 16, 6);
            // Chrome grouphead & Portafilter
            ctx.fillStyle = '#cfd8dc';
            ctx.fillRect(x + 6, y - 12, 8, 4);
            ctx.fillStyle = '#212121';
            ctx.fillRect(x + 13, y - 11, 7, 2); // Handle
            // Brewing status green LED
            ctx.fillStyle = isBrewing ? '#22c55e' : '#facc15';
            ctx.fillRect(x + 4, y - 20, 2, 2);
        } else if (level === 3) {
            // Level 3: Pro Dual Boiler Polished Mirror Chrome Machine
            const mw = 26;
            const mh = 28;

            // Mirror Chrome Chassis with light gradients
            ctx.fillStyle = '#cfd8dc';
            ctx.fillRect(x, y - mh, mw, mh);
            ctx.fillStyle = '#eceff1'; // Gleaming Specular Sheen
            ctx.fillRect(x + 3, y - mh + 2, 6, mh - 4);
            ctx.fillStyle = '#90a4ae';
            ctx.fillRect(x + mw - 4, y - mh + 2, 3, mh - 4);

            // Top Cup Warming Tray with Miniature Demitasse Cups!
            ctx.fillStyle = '#78909c';
            ctx.fillRect(x - 1, y - mh - 2, mw + 2, 2); // Guard rail
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 3, y - mh - 5, 4, 4);
            ctx.fillRect(x + 9, y - mh - 5, 4, 4);
            ctx.fillRect(x + 15, y - mh - 5, 4, 4);

            // Jittering Brass Pressure Gauge Dial!
            this.drawPixelCircle(ctx, x + 16, y - 20, 4, '#ffffff', '#b8860b');
            const needleAngle = isBrewing ? (0.2 + Math.sin(this.frame * 0.8) * 0.15) : -0.6;
            ctx.strokeStyle = '#c0392b';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 16, y - 20);
            ctx.lineTo(x + 16 + Math.cos(needleAngle) * 3, y - 20 + Math.sin(needleAngle) * 3);
            ctx.stroke();

            // Dual Groupheads & Locking Portafilters
            ctx.fillStyle = '#37474f';
            ctx.fillRect(x + 4, y - 11, 7, 4);
            ctx.fillRect(x + 14, y - 11, 7, 4);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(x + 10, y - 10, 5, 2); // Black bakelite handle
            ctx.fillRect(x + 20, y - 10, 5, 2);

            // Angled Steam Wand
            ctx.fillStyle = '#eceff1';
            ctx.fillRect(x + 23, y - 14, 2, 10);
            ctx.fillRect(x + 24, y - 5, 3, 2);
        } else {
            // Level 4: Handcrafted Italian Multi-Group Flagship (Polished Chrome, Brass & Walnut)
            ctx.fillStyle = '#1e110a'; // Walnut wood accent
            ctx.fillRect(x, y - 30, 28, 30);
            ctx.fillStyle = '#f59e0b'; // Polished Brass Trim
            ctx.fillRect(x + 1, y - 29, 26, 3);
            ctx.fillRect(x + 1, y - 3, 26, 2);
            ctx.fillStyle = '#e2e8f0'; // Mirror Chrome Body
            ctx.fillRect(x + 3, y - 25, 22, 13);
            // Golden Eagle Finial Crest atop Flagship Brewer
            ctx.fillStyle = '#facc15';
            ctx.fillRect(x + 12, y - 34, 4, 5);
            ctx.fillRect(x + 9, y - 32, 10, 2);
            // Analog Barometer & Walnut Portafilter Handles
            ctx.fillStyle = '#78350f'; // Hand-turned Walnut Handles
            ctx.fillRect(x + 4, y - 10, 6, 2);
            ctx.fillRect(x + 12, y - 10, 6, 2);
            ctx.fillRect(x + 20, y - 10, 6, 2);
            ctx.fillStyle = '#b45309';
            ctx.font = 'bold 6px monospace';
            ctx.fillText('9BAR', x + 6, y - 15);
        }

        // Billowing Micro-Foam Steam Particle Eruptions
        const steamMult = isBrewing ? 1.0 : 0.4;
        this.steamParticles.forEach(p => {
            const alpha = p.alpha * steamMult;
            if (alpha > 0.02) {
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.drawPixelCircle(ctx, x + 12 + p.x, y - 24 + p.y, p.size);
            }
        });
    }

    // Burr Grinder with Glass Hopper & Roasted Beans (Levels 1 to 3)
    renderHighPixelGrinder(ctx, gx, gy, level) {
        const x = Math.round(gx);
        const y = Math.round(gy);

        if (level === 1) {
            // Level 1: Vintage Wooden Hand-Crank Burr Mill
            ctx.fillStyle = '#78350f'; // Warm oak box
            ctx.fillRect(x, y - 14, 10, 14);
            ctx.fillStyle = '#f59e0b'; // Brass catch drawer
            ctx.fillRect(x + 2, y - 5, 6, 3);
            // Brass open bean bowl & S-shaped hand crank
            ctx.fillStyle = '#d97706';
            ctx.fillRect(x + 1, y - 18, 8, 4);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(x + 4, y - 22, 2, 4);
            ctx.fillRect(x + 4, y - 22, 6, 2);
            ctx.fillStyle = '#451a03'; // Crank wooden knob
            ctx.fillRect(x + 9, y - 24, 2, 3);
        } else if (level === 2) {
            // Level 2: Matte-Black Electric Conical Burr Grinder
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(x, y - 18, 10, 18);
            ctx.fillStyle = '#475569';
            ctx.fillRect(x + 2, y - 16, 6, 4); // Adjustment collar
            // Clear Glass Bean Hopper
            ctx.fillStyle = 'rgba(200, 230, 255, 0.65)';
            ctx.fillRect(x + 1, y - 26, 8, 8);
            ctx.strokeStyle = '#90caf9';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 1, y - 26, 8, 8);
            // Roasted Coffee Beans inside Hopper
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(x + 2, y - 24, 3, 2);
            ctx.fillRect(x + 5, y - 23, 3, 2);
            // Blue power LED
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(x + 4, y - 6, 2, 2);
        } else {
            // Level 3: Commercial Gold & Mirror-Chrome Precision Flat Burr Mill
            ctx.fillStyle = '#d97706'; // Gold/Brass chassis
            ctx.fillRect(x - 1, y - 20, 12, 20);
            ctx.fillStyle = '#fef08a'; // Specular gold highlight
            ctx.fillRect(x + 1, y - 19, 3, 18);
            ctx.fillStyle = '#0f172a'; // Digital touchscreen dosing display
            ctx.fillRect(x + 3, y - 14, 6, 5);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(x + 4, y - 12, 4, 2);
            // Tall Crystal Cylinder Hopper with Specialty Beans
            ctx.fillStyle = 'rgba(224, 242, 254, 0.78)';
            ctx.fillRect(x, y - 30, 10, 10);
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y - 30, 10, 10);
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(x + 2, y - 27, 6, 5);
            ctx.fillStyle = '#f59e0b'; // Hopper brass cap
            ctx.fillRect(x - 1, y - 32, 12, 2);
        }
    }

    // Wire Syrup Carousel Rack (Caramel, Vanilla, Hazelnut, Berry)
    renderHighPixelSyrups(ctx, sx, sy) {
        const x = Math.round(sx);
        const y = Math.round(sy);
        const syrups = [
            { col: '#f39c12', label: 'C' }, // Caramel
            { col: '#fdfefe', label: 'V' }, // Vanilla
            { col: '#8e44ad', label: 'H' }, // Hazelnut
            { col: '#c0392b', label: 'B' }  // Berry
        ];

        syrups.forEach((s, idx) => {
            const bx = x + idx * 5;
            // Glass Bottle
            ctx.fillStyle = s.col;
            ctx.fillRect(bx, y - 14, 4, 14);
            // Pump Dispenser Top & Spout
            ctx.fillStyle = '#b0bec5';
            ctx.fillRect(bx + 1, y - 18, 2, 4);
            ctx.fillRect(bx - 1, y - 18, 2, 1);
        });
    }

    // Web3 Glass Tip Jar with Folded Bills & Gold Coins
    renderHighPixelTipJar(ctx, jx, jy) {
        const x = Math.round(jx);
        const y = Math.round(jy);

        // Glass Jar Body with Specular Glare
        ctx.fillStyle = 'rgba(210, 240, 255, 0.6)';
        ctx.fillRect(x, y - 12, 8, 12);
        ctx.strokeStyle = '#90caf9';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y - 12, 8, 12);

        // Metal Screw Lid
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(x - 1, y - 14, 10, 2);

        // Cash Bills & Gold Coins inside
        const web3 = window.web3Manager;
        const hasTips = web3 && (web3.tipJarCash > 0 || web3.tipJarUSDC > 0);
        if (hasTips) {
            // Folded Green Dollar Bill
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(x + 2, y - 6, 4, 5);
            // Shiny Gold Coin
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(x + 3, y - 9, 3, 2);
        }
    }

    // Stack of Takeout Paper Cups with Kraft Heat Sleeves
    renderHighPixelCupStack(ctx, cx, cy) {
        const x = Math.round(cx);
        const y = Math.round(cy);

        for (let i = 0; i < 4; i++) {
            const sy = y - 6 - i * 4;
            ctx.fillStyle = '#f8fafc'; // White paper cup
            ctx.fillRect(x, sy, 8, 4);
            ctx.fillStyle = '#d97706'; // Brown kraft ribbed heat sleeve
            ctx.fillRect(x, sy + 2, 8, 2);
        }
    }

    // Payment Terminal (Levels 1 to 3)
    renderHighPixelTerminal(ctx, tx, ty, level) {
        const x = Math.round(tx);
        const y = Math.round(ty);

        if (level === 1) {
            // Level 1: Vintage Metal Cash Box with Gold Coins
            ctx.fillStyle = '#64748b';
            ctx.fillRect(x, y - 8, 9, 8);
            ctx.fillStyle = '#94a3b8'; // Open lid
            ctx.fillRect(x, y - 11, 9, 3);
            ctx.fillStyle = '#facc15'; // Gold coin glint
            ctx.fillRect(x + 2, y - 7, 3, 2);
        } else if (level === 2) {
            // Level 2: EZserve Electronic Cash Register
            ctx.fillStyle = '#cbd5e1'; // Classic register chassis
            ctx.fillRect(x - 1, y - 12, 11, 12);
            ctx.fillStyle = '#475569'; // Cash drawer base
            ctx.fillRect(x - 2, y - 4, 13, 4);
            ctx.fillStyle = '#0f172a'; // LED customer pole display
            ctx.fillRect(x + 1, y - 16, 8, 4);
            ctx.fillStyle = '#22c55e'; // Glowing green digital readout
            ctx.fillRect(x + 2, y - 15, 6, 2);
            ctx.fillStyle = '#ef4444'; // Keypad button
            ctx.fillRect(x + 1, y - 9, 2, 2);
            ctx.fillStyle = '#eab308';
            ctx.fillRect(x + 4, y - 9, 2, 2);
        } else {
            // Level 3: Digital Touchscreen POS & Web3 Contactless Terminal
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(x - 2, y - 16, 12, 16);
            ctx.fillStyle = '#00ffcc'; // Glowing cyan touchscreen
            ctx.fillRect(x, y - 14, 8, 8);
            // ETH / Web3 Diamond glyph
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 3, y - 13, 2, 6);
            ctx.fillRect(x + 2, y - 11, 4, 2);
            // Contactless NFC tap indicator LED
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(x + 2, y - 4, 4, 2);
        }
    }

    // Cooler & Refrigeration Unit (Levels 1 to 4)
    renderHighPixelCooler(ctx, cx, cy, level) {
        const x = Math.round(cx);
        const y = Math.round(cy);

        if (level === 1) {
            // Level 1: White Styrofoam Ice Box Cooler
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(x, y + 2, 16, 13);
            ctx.fillStyle = '#cbd5e1'; // Styrofoam lid seam
            ctx.fillRect(x - 1, y, 18, 3);
            ctx.fillStyle = '#38bdf8'; // Blue packing tape & melt puddle
            ctx.fillRect(x + 6, y, 4, 8);
            ctx.fillRect(x + 2, y + 15, 10, 2);
        } else if (level === 2) {
            // Level 2: Heavy-Duty Insulated Blue Camping Ice Chest
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(x, y, 18, 15);
            ctx.fillStyle = '#f8fafc'; // Thick white insulated hinged lid
            ctx.fillRect(x - 1, y - 3, 20, 4);
            ctx.fillStyle = '#1e293b'; // Heavy-duty latches
            ctx.fillRect(x + 3, y, 2, 4);
            ctx.fillRect(x + 13, y, 2, 4);
        } else if (level === 3) {
            // Level 3: Mr. Fridge Commercial Upright Glass-Door Cooler
            ctx.fillStyle = '#e2e8f0'; // Silver-white upright cabinet
            ctx.fillRect(x - 2, y - 12, 20, 28);
            ctx.fillStyle = '#1e293b'; // Top compressor header
            ctx.fillRect(x - 2, y - 12, 20, 5);
            ctx.fillStyle = '#22c55e'; // Digital 3°C LED readout
            ctx.fillRect(x + 5, y - 11, 6, 3);
            // Chilled glass door & milk cartons on shelves
            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.fillRect(x, y - 6, 16, 20);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 2, y - 4, 5, 7);
            ctx.fillRect(x + 9, y - 4, 5, 7);
            ctx.fillRect(x + 3, y + 5, 10, 7);
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(x + 2, y - 2, 5, 2);
            ctx.fillRect(x + 9, y - 2, 5, 2);
        } else {
            // Level 4: Luxury Dual-Zone Brushed Stainless & Gold Refrigerator
            ctx.fillStyle = '#0f172a'; // Brushed dark steel cabinet
            ctx.fillRect(x - 4, y - 15, 22, 31);
            ctx.strokeStyle = '#f59e0b'; // 24k Brass/Gold frame trim
            ctx.lineWidth = 1;
            ctx.strokeRect(x - 4, y - 15, 22, 31);
            // Digital Dual-Zone Telemetry Header
            ctx.fillStyle = '#00ffcc';
            ctx.fillRect(x + 2, y - 13, 10, 2);
            // Dual Illuminated Climate Zones (Top Cryo Frost + Bottom Milk Reserve)
            ctx.fillStyle = 'rgba(0, 255, 204, 0.35)';
            ctx.fillRect(x - 2, y - 9, 8, 22);
            ctx.fillStyle = 'rgba(251, 191, 36, 0.32)';
            ctx.fillRect(x + 8, y - 9, 8, 22);
            // Milk & Cream Carafes inside
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y - 6, 4, 7);
            ctx.fillRect(x + 10, y - 6, 4, 7);
            ctx.fillRect(x, y + 4, 4, 7);
            ctx.fillRect(x + 10, y + 4, 4, 7);
        }
    }

    // Scalloped Striped Awning Canopy with 3D Folds & Animated Breeze (Levels 2 & 3)
    renderScallopedCanopy(ctx, x, y, w, h, canopyLvl = 2, isBoosted = false, weather = null) {
        const rx = Math.round(x);
        const ry = Math.round(y);

        let col1 = '#c0392b'; // Crimson (ShadeMaker 3000)
        let col2 = '#fdfefe'; // Cream
        if (canopyLvl >= 3) {
            col1 = '#1e3a8a'; // Deep Navy (All-Weather Retractable Awning)
            col2 = '#fbbf24'; // Warm Gold
        }
        if (isBoosted) {
            col1 = '#f59e0b';
            col2 = '#00ffcc';
        }

        const stripeW = 12;
        let sIdx = 0;
        const flutter = Math.sin(this.frame * 0.15) * 1.5;

        for (let sx = rx; sx < rx + w; sx += stripeW) {
            const curW = Math.min(stripeW, rx + w - sx);
            const isAlt = (sIdx % 2 === 0);
            ctx.fillStyle = isAlt ? col1 : col2;
            ctx.fillRect(sx, ry, curW, h);

            // Shading Creases between stripes
            ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
            ctx.fillRect(sx + curW - 1, ry, 1, h);

            // Hanging Scalloped Valance with Subtle Breeze Flutter
            const valanceY = ry + h + (sIdx % 2 === 0 ? flutter : -flutter * 0.5);
            ctx.fillStyle = isAlt ? col1 : col2;
            this.drawPixelCircle(ctx, sx + curW / 2, valanceY, curW / 2);

            // Level 3 All-Weather Retractable Awning: Warm Glowing Edison Café Bulbs along Valance!
            if (canopyLvl >= 3) {
                const bulbX = Math.round(sx + curW / 2);
                const bulbY = Math.round(valanceY + curW / 2 + 1);
                ctx.fillStyle = 'rgba(253, 224, 71, 0.28)';
                this.drawPixelCircle(ctx, bulbX, bulbY, 4);
                ctx.fillStyle = '#fef9c3';
                ctx.fillRect(bulbX - 1, bulbY - 1, 2, 2);
            }

            sIdx++;
        }

        // Top Awning Crest Shadow / Bronze Retractable Frame Bar
        ctx.fillStyle = canopyLvl >= 3 ? '#b45309' : 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(rx, ry, w, 3);

        // Winter Snow Dusting along Awning Ridge
        if (weather && weather.type === 'freezing') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(rx, ry - 1, w, 2);
        }
    }

    // Stand Menu Sign & Marketing Displays (Levels 1 to 4)
    renderHighPixelStandSign(ctx, x, y, cartW, upgrades, options = {}) {
        const mktLvl = (upgrades && upgrades.marketing) ? upgrades.marketing : 1;
        const uScale = options.uScale || 1;
        const drawFrontBoard = options.drawFrontBoard !== false;
        const activePrice = (window.simulationModel && window.simulationModel.recipe && typeof window.simulationModel.recipe.price === 'number')
            ? window.simulationModel.recipe.price
            : 2.50;
        const priceStr = `$${activePrice.toFixed(2)} ☕`;

        // Render front chalkboard price on procedural stand (16-bit sprite branch uses its own compact hanging chalkboard)
        if (drawFrontBoard) {
            ctx.fillStyle = '#1c2833';
            ctx.fillRect(x + 16, y + 14, 36, 20);
            ctx.strokeStyle = mktLvl >= 3 ? '#facc15' : '#795548';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x + 16, y + 14, 36, 20);

            ctx.fillStyle = '#ffffff';
            ctx.font = '6px monospace';
            ctx.fillText('ESPRESSO', x + 18, y + 22);
            ctx.fillStyle = '#f1c40f';
            ctx.fillText(priceStr, x + 18, y + 31);
        }

        if (mktLvl >= 2) {
            // Level 2+: Sidewalk A-Frame Chalkboard & Flyer Holder beside Queue Entrance
            const bx = Math.round(x + cartW + 8 * uScale);
            const by = typeof options.groundY === 'number' ? Math.round(options.groundY - 4 * uScale) : (y + 32);
            ctx.fillStyle = '#5d4037'; // A-frame wooden legs
            ctx.fillRect(bx - Math.round(6 * uScale), by - Math.round(16 * uScale), Math.max(1, Math.round(2 * uScale)), Math.round(16 * uScale));
            ctx.fillRect(bx + Math.round(6 * uScale), by - Math.round(16 * uScale), Math.max(1, Math.round(2 * uScale)), Math.round(16 * uScale));
            ctx.fillStyle = '#0f172a'; // Slate board
            ctx.fillRect(bx - Math.round(5 * uScale), by - Math.round(15 * uScale), Math.round(12 * uScale), Math.round(11 * uScale));
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx - Math.round(5 * uScale), by - Math.round(15 * uScale), Math.round(12 * uScale), Math.round(11 * uScale));
            ctx.fillStyle = '#38bdf8'; // Flyer stack pocket
            ctx.fillRect(bx + Math.round(7 * uScale), by - Math.round(10 * uScale), Math.max(2, Math.round(3 * uScale)), Math.round(5 * uScale));
        }

        if (mktLvl >= 3) {
            // Level 3+: Illuminated Artisan Sign & Hanging Pennant Banners atop Stand
            const signW = Math.round(84 * uScale);
            const signH = Math.round(15 * uScale);
            const sx = Math.round(x + (cartW - signW) / 2);
            const sy = typeof options.topSignY === 'number' ? Math.round(options.topSignY) : Math.round(y - 74);

            ctx.fillStyle = mktLvl >= 4 ? '#1e1b4b' : '#090d16';
            ctx.fillRect(sx, sy, signW, signH);
            ctx.strokeStyle = mktLvl >= 4 ? '#facc15' : '#00ffcc';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(sx, sy, signW, signH);

            // Hooded Brass Gooseneck Lamps above Sign
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(sx + Math.round(14 * uScale), sy - Math.round(4 * uScale), Math.round(6 * uScale), Math.round(4 * uScale));
            ctx.fillRect(sx + signW - Math.round(20 * uScale), sy - Math.round(4 * uScale), Math.round(6 * uScale), Math.round(4 * uScale));

            const flicker = Math.sin(this.frame * 0.12) > -0.75;
            ctx.fillStyle = mktLvl >= 4 ? (flicker ? '#fde047' : '#f59e0b') : (flicker ? '#00ffcc' : '#008b8b');
            ctx.font = `bold ${(7.5 * uScale).toFixed(1)}px monospace`;
            ctx.fillText(mktLvl >= 4 ? '★ 5-STAR CRITIC ★' : '⚡ COFFEDE ⚡', sx + Math.round(6 * uScale), sy + Math.round(11 * uScale));
        }

        if (mktLvl >= 4) {
            // Level 4: City Culinary Guide Golden Trophy & Velvet Critic Pedestal (placed right of A-Frame, clear of left-side cooler)
            const px = Math.round(x + cartW + 20 * uScale);
            const py = typeof options.groundY === 'number' ? Math.round(options.groundY - 2 * uScale) : (y + 36);
            ctx.fillStyle = '#7f1d1d'; // Crimson velvet pedestal
            ctx.fillRect(px, py - Math.round(12 * uScale), Math.round(10 * uScale), Math.round(12 * uScale));
            ctx.fillStyle = '#facc15'; // Gold trim & 5-Star Culinary Trophy Cup
            ctx.fillRect(px - Math.round(1 * uScale), py - Math.round(13 * uScale), Math.round(12 * uScale), Math.max(1, Math.round(2 * uScale)));
            ctx.fillRect(px + Math.round(3 * uScale), py - Math.round(20 * uScale), Math.round(4 * uScale), Math.round(7 * uScale));
            ctx.fillRect(px + Math.round(1 * uScale), py - Math.round(22 * uScale), Math.round(8 * uScale), Math.round(3 * uScale));
        }
    }

    // -------------------------------------------------------------
    // BARISTA CHARACTER SPRITE (16-BIT ANIMATED PIXEL ART + FALLBACK)
    // -------------------------------------------------------------
    renderBarista(ctx, bx, by, isBrewing, isPouring, upgrades, options = {}) {
        const x = Math.round(bx);
        const y = Math.round(by);
        const decorLvl = (upgrades && upgrades.decor) ? upgrades.decor : 1;

        // Animation bob: energetic work rhythm when brewing/pouring, gentle breathing when idle
        const bobSpeed = isPouring ? 0.32 : (isBrewing ? 0.25 : 0.08);
        const breathe = Math.sin(this.frame * bobSpeed) > 0 ? -1 : 0;

        // Select 16-Bit Animated Frame:
        // Frame 0: Attentive Idle Stand
        // Frame 1: Cheerful Wave & Barista Cloth Polish
        // Frame 2: Active Espresso Brewing (Portafilter & Milk Pitcher)
        // Frame 3: Pouring Latte Art & Serving Cup
        let frameIdx = 0;
        if (isPouring) {
            frameIdx = (Math.floor(this.frame / 10) % 2 === 0) ? 3 : 2;
        } else if (isBrewing) {
            frameIdx = (Math.floor(this.frame / 12) % 2 === 0) ? 2 : 1;
        } else {
            // Idle cycle: mostly attentive stand (frame 0), periodic friendly wave/polish (frame 1)
            const idleCycle = Math.floor(this.frame / 28) % 4;
            frameIdx = (idleCycle === 3) ? 1 : 0;
        }

        const bImg = (this.baristaSprites && this.baristaSprites[frameIdx]) ? this.baristaSprites[frameIdx] : null;
        const isImgReady = Boolean(
            this.baristaLoaded &&
            bImg &&
            (bImg.complete === undefined || (bImg.complete && (bImg.naturalWidth > 0 || bImg.width > 0)))
        );

        if (isImgReady && typeof ctx.drawImage === 'function') {
            const srcW = bImg.naturalWidth || bImg.width || 260;
            const srcH = bImg.naturalHeight || bImg.height || 460;
            const behindCounter = options && options.behindCounter !== false;
            // Crop upper 64% (head, beret, torso, apron, hands, portafilter/pitcher/cup) when behind counter
            const cropRatio = behindCounter ? 0.64 : 1.0;
            const sh = Math.round(srcH * cropRatio);
            const targetW = 24;
            const targetH = Math.round(targetW * (sh / srcW));
            const drawX = x - 2;
            const drawY = y - 14 + breathe;

            ctx.save();
            ctx.imageSmoothingEnabled = false;
            try {
                ctx.drawImage(bImg, 0, 0, srcW, sh, drawX, drawY, targetW, targetH);
            } catch (e) {
                // Fallback if image decode pending
            }
            ctx.restore();

            // Subtle live steam/action sparkle when actively brewing or pouring
            if (isBrewing || isPouring) {
                const steamOffset = Math.floor(this.frame / 6) % 4;
                ctx.fillStyle = isPouring ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.70)';
                ctx.fillRect(drawX + 16, drawY + 12 - steamOffset, 2, 2);
                ctx.fillRect(drawX + 19, drawY + 10 - ((steamOffset + 2) % 4), 1, 2);
            }
            return;
        }

        // Procedural 16-Bit Fallback (used when Image sprites are not yet loaded or in mock unit tests)
        // 1. Torso & Collared Shirt
        ctx.fillStyle = decorLvl >= 5 ? '#0f172a' : '#ffffff';
        ctx.fillRect(x + 4, y + breathe, 16, 18);

        // 2. Barista Apron with Cross-Back Leather Straps & Badge (Upgrades with Cart Tier!)
        const apronColors = {
            1: '#15803d', // Classic green apron
            2: '#78350f', // Artisan leather apron
            3: '#0d9488', // Boutique teal apron
            4: '#b45309', // Parisian copper-gold waistcoat
            5: '#1e1b4b'  // Imperial black & gold executive jacket
        };
        ctx.fillStyle = apronColors[decorLvl] || '#15803d';
        ctx.fillRect(x + 6, y + 4 + breathe, 12, 14);
        // Chest pocket with pen
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 8, y + 8 + breathe, 4, 4);
        ctx.fillStyle = '#f1c40f'; // Pen
        ctx.fillRect(x + 9, y + 6 + breathe, 1, 3);
        // Gold Barista Badge
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(x + 14, y + 8 + breathe, 2, 2);

        // 3. Head & Expressive Anime Face
        ctx.fillStyle = '#f5cba7'; // Warm skin tone
        ctx.fillRect(x + 5, y - 12 + breathe, 14, 12);
        // Blushing Cheeks
        ctx.fillStyle = 'rgba(231, 76, 60, 0.45)';
        ctx.fillRect(x + 6, y - 4 + breathe, 3, 2);
        ctx.fillRect(x + 15, y - 4 + breathe, 3, 2);

        // Eyes with Highlights
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 8, y - 8 + breathe, 2, 3);
        ctx.fillRect(x + 14, y - 8 + breathe, 2, 3);
        ctx.fillStyle = '#ffffff'; // Glint
        ctx.fillRect(x + 8, y - 8 + breathe, 1, 1);
        ctx.fillRect(x + 14, y - 8 + breathe, 1, 1);

        // Cheerful Smile
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(x + 10, y - 3 + breathe, 4, 2);

        // 4. Barista Cap & Hair Strands
        ctx.fillStyle = decorLvl >= 4 ? '#f59e0b' : '#312e81';
        ctx.fillRect(x + 4, y - 15 + breathe, 16, 5);
        ctx.fillRect(x + 2, y - 12 + breathe, 20, 2); // Cap visor
        // Dark Chestnut Hair Strands
        ctx.fillStyle = '#3e2723';
        ctx.fillRect(x + 4, y - 11 + breathe, 3, 5); // Sideburns
        ctx.fillRect(x + 17, y - 11 + breathe, 3, 5);

        // 5. State-Driven Hand Animations (Brewing vs Pouring vs Idle)
        ctx.fillStyle = '#f5cba7';
        if (isBrewing) {
            // Reaching forward to lock portafilter with dynamic arm jitter
            const armJitter = Math.sin(this.frame * 0.5) * 2;
            ctx.fillRect(x - 6 + armJitter, y + 6, 10, 4);
        } else if (isPouring) {
            // Holding steaming carafe, pouring dark coffee ribbon into cup!
            ctx.fillRect(x + 2, y + 6, 8, 4);
            // Stainless milk pitcher
            ctx.fillStyle = '#cfd8dc';
            ctx.fillRect(x - 3, y + 4, 6, 6);
            // Coffee stream falling into counter cup
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(x - 2, y + 10, 2, 6);
        } else {
            // Idle: Arms resting comfortably on counter, occasional cloth wipe
            ctx.fillRect(x + 2, y + 8 + breathe, 4, 6);
            ctx.fillRect(x + 18, y + 8 + breathe, 4, 6);
        }
    }

    // -------------------------------------------------------------
    // HIGH-PIXEL PEDESTRIANS & 4-FRAME WALK CYCLES
    // -------------------------------------------------------------
    renderCustomer(ctx, customer, skipBubble = false) {
        if (!customer) return;
        const x = (typeof customer.x === 'number' && !isNaN(customer.x)) ? customer.x : 0;
        const y = (typeof customer.y === 'number' && !isNaN(customer.y)) ? customer.y : 0;

        // Parse direction: number (-1/1), string ('left'/'right'), or velocity vx
        let dir = 1;
        if (typeof customer.direction === 'number') {
            dir = customer.direction < 0 ? -1 : 1;
        } else if (typeof customer.direction === 'string') {
            dir = customer.direction.toLowerCase().includes('left') ? -1 : 1;
        } else if (typeof customer.vx === 'number') {
            dir = customer.vx < 0 ? -1 : 1;
        }

        const animFrame = (typeof customer.animFrame === 'number' && !isNaN(customer.animFrame)) ? customer.animFrame : 0;
        const hasExplicitWalkCycle = (typeof customer.walkCycle === 'number' && !isNaN(customer.walkCycle));
        const isMoving = hasExplicitWalkCycle || customer.isMoving === true || customer.state === 'walking' || customer.state === 'leaving';

        const walkVal = hasExplicitWalkCycle ? customer.walkCycle : (typeof customer.walkPhase === 'number' ? customer.walkPhase : animFrame);
        const idlePhase = (typeof customer.idlePhase === 'number') ? customer.idlePhase : (this.frame * 0.05);

        // 1. Fluid Walk Bounce & Idle Breathing Oscillation
        const smoothBob = isMoving ? Math.sin(walkVal * 2) * 1.5 : 0;
        // Breathing oscillation: Math.sin(idlePhase * 2.2) * 1.2px
        const breathOffset = Math.sin(idlePhase * 2.2) * 1.2;

        // Queue patience: when waiting in line, character turns towards counter.
        // If waiting for more than 4 seconds, add an impatient fidget (tapping foot, looking at wrist, small restless bounce)
        const isQueued = (customer.state === 'queued');
        const queueWait = customer.queueWaitTime || 0;
        const isFidgeting = isQueued && queueWait > 4.0;
        const fidgetPhase = isFidgeting ? (queueWait - 4.0) : 0;
        const restlessBounce = isFidgeting ? Math.sin(fidgetPhase * 8.0) * 1.4 : 0;

        const idleBob = isFidgeting ? (breathOffset * 0.4 + restlessBounce) : breathOffset;

        // Cheerful bounce: little 4px hop when coffee is handed over
        let hopOffset = 0;
        if (customer.servedHopTimer && customer.servedHopTimer > 0) {
            const hopDur = customer.hopDuration || 0.5;
            const hopProg = 1 - Math.max(0, Math.min(1, customer.servedHopTimer / hopDur));
            hopOffset = -Math.sin(hopProg * Math.PI) * 4.5;
        }

        const totalBob = (isMoving ? smoothBob : idleBob) + hopOffset;

        // 2. Stride lean: gentle forward/backward angular tilt in the direction of movement (ctx.rotate(tiltAngle))
        let tiltAngle = 0;
        if (isMoving) {
            tiltAngle = 0.04 + Math.sin(walkVal * 2) * 0.02;
        } else {
            // Natural weight shift from one foot to another every few seconds
            const weightShiftPhase = idlePhase * 0.8;
            tiltAngle = Math.sin(weightShiftPhase) * 0.025;
            if (isFidgeting) {
                const cycle = fidgetPhase % 4.0;
                if (cycle > 2.2) {
                    tiltAngle += 0.06; // looking at wrist / watch
                } else if (cycle > 1.2) {
                    tiltAngle += Math.sin(fidgetPhase * 6.0) * 0.03;
                }
            }
        }

        // 3. Sipping coffee animation when leaving: every few seconds, cup raises to mouth, head tilts back slightly
        let isSipping = false;
        let sipEase = 0;
        if (customer.hasCoffee && (customer.state === 'leaving' || isMoving)) {
            const sipTimer = (typeof customer.sipTimer === 'number') ? customer.sipTimer : (idlePhase * 0.6);
            const sipCycle = (sipTimer % 4.0);
            if (sipCycle >= 2.0 && sipCycle <= 3.4) {
                isSipping = true;
                if (sipCycle < 2.4) {
                    sipEase = (sipCycle - 2.0) / 0.4;
                } else if (sipCycle > 3.0) {
                    sipEase = 1.0 - (sipCycle - 3.0) / 0.4;
                } else {
                    sipEase = 1.0;
                }
                tiltAngle -= 0.07 * sipEase; // Head tilts back slightly
            }
        }

        // 4. Step bounce squash-and-stretch on step impact (scaleY: 0.95..1.03, scaleX: 1.03..0.97)
        let squashY = 1.0;
        let squashX = 1.0;
        if (isMoving) {
            // Ground impact compresses vertically (squash) and widens horizontally;
            // Airborne apex stretches vertically and narrows horizontally
            squashY = 1.0 - Math.sin(walkVal * 2) * 0.038;
            squashX = 1.0 / Math.sqrt(squashY);
        } else {
            squashY = 1.0 + Math.sin(idlePhase * 2.2) * 0.012;
            squashX = 1.0 - Math.sin(idlePhase * 2.2) * 0.008;
        }
        if (customer.servedHopTimer && customer.servedHopTimer > 0) {
            const hopDur = customer.hopDuration || 0.5;
            const hopProg = 1 - Math.max(0, Math.min(1, customer.servedHopTimer / hopDur));
            const hopStretch = Math.sin(hopProg * Math.PI) * 0.06;
            squashY += hopStretch;
            squashX -= hopStretch * 0.5;
        }

        // 5. Pulsing ground contact shadow parameters (in sync with step stride & hop)
        const stridePulse = isMoving ? (1.0 + Math.sin(walkVal * 2) * 0.18) : (1.0 + Math.sin(idlePhase * 2.2) * 0.06);
        let hopShadowFactor = 1.0;
        if (customer.servedHopTimer && customer.servedHopTimer > 0) {
            const hopDur = customer.hopDuration || 0.5;
            const hopProg = 1 - Math.max(0, Math.min(1, customer.servedHopTimer / hopDur));
            hopShadowFactor = Math.max(0.4, 1.0 - Math.sin(hopProg * Math.PI) * 0.45);
        }
        const finalPulse = stridePulse * hopShadowFactor;

        // 4-Frame Walk Cycle (for procedural fallback legs/arms)
        const walkCycle = Math.floor(animFrame * 2) % 4;
        let legSwing = 0;
        if (isMoving) {
            if (walkCycle === 0) legSwing = 4.0;
            else if (walkCycle === 1) legSwing = 0.5;
            else if (walkCycle === 2) legSwing = -4.0;
            else legSwing = -0.5;
        } else if (isFidgeting && (fidgetPhase % 3.0) < 1.4) {
            legSwing = Math.sin(fidgetPhase * 16.0) * 3.0; // Foot tapping
        }

        // Pre-calculate sprite metadata for shadow & 16-bit rendering
        const archetypeMap = {
            'jogger': 0,     // woman in green blazer & pleated skirt
            'student': 1,    // student with backpack & headphones & coffee
            'business': 2,   // businessman in navy suit with briefcase
            'hipster': 3,    // hipster in beanie & red flannel with coffee
            'cryptobro': 4,  // tech guy in hoodie
            'senior': 5,     // elegant lady in trench coat

            // 18+ Extended Curated Retro Variants
            'marathon_runner': 0,
            'fashionista': 0,
            'casual_shopper': 0,
            'grad_student': 1,
            'art_student': 1,
            'bookworm': 1,
            'corporate_exec': 2,
            'fintech_analyst': 2,
            'metro_commuter': 2,
            'barista_regular': 3,
            'music_producer': 3,
            'dog_walker': 3,
            'crypto_whale': 4,
            'tech_hacker': 4,
            'indie_dev': 4,
            'professor': 5,
            'retiree': 5,
            'tourist': 5
        };

        const typeKey = (customer.archetype || customer.type);
        const archKey = (typeof typeKey === 'string') ? typeKey.toLowerCase() : null;
        let spriteIdx;
        if (typeof typeKey === 'number') {
            spriteIdx = Math.abs(typeKey) % 6;
        } else if (archKey && typeof archetypeMap[archKey] !== 'undefined') {
            spriteIdx = archetypeMap[archKey];
        } else if (typeof customer.id === 'number') {
            spriteIdx = Math.abs(customer.id) % 6;
        } else if (typeof customer.id === 'string') {
            const match = customer.id.match(/\d+/);
            if (match) {
                spriteIdx = Math.abs(parseInt(match[0], 10)) % 6;
            } else {
                const hash = customer.id.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0);
                spriteIdx = Math.abs(hash) % 6;
            }
        } else {
            spriteIdx = Math.abs(Math.round(x * 100 + y)) % 6;
        }

        const isDrawable = (img) => {
            if (!img || img._isEmptyCanvas) return false;
            if (typeof HTMLImageElement !== 'undefined' && img instanceof HTMLImageElement) {
                return Boolean(img.complete && img.naturalWidth > 0 && img.naturalHeight > 0);
            }
            if (typeof HTMLCanvasElement !== 'undefined' && img instanceof HTMLCanvasElement) {
                return Boolean(img.width > 0 && img.height > 0 && !img._isEmptyCanvas);
            }
            return Boolean((img.naturalWidth > 0 && img.naturalHeight > 0) || (img.width > 0 && img.height > 0));
        };

        const spriteList = (this.npcSpriteImgs && this.npcSpriteImgs.length === 6) ? this.npcSpriteImgs : this.npcSpriteCanvases;
        let spriteCanvas = null;

        // Multi-Frame Walk Cycle Sprite Animation (Supports full 8-frame walk cycles with in-betweens)
        let currentWalkSet = this.walkCycles && this.walkCycles[spriteIdx];
        if (archKey && this.variantWalkCycles && this.variantWalkCycles[archKey] && this.variantWalkCycles[archKey].length >= 4) {
            currentWalkSet = this.variantWalkCycles[archKey];
        }

        if (currentWalkSet && currentWalkSet.length >= 4) {
            const frameCount = currentWalkSet.length;
            const walkSpeedFactor = frameCount === 8 ? 2.8 : 1.5;
            const rawVal = Number.isFinite(walkVal) ? walkVal : 0;
            const rawCycle = Math.floor(rawVal * walkSpeedFactor);
            const animCycle = ((rawCycle % frameCount) + frameCount) % frameCount;
            const candidateFrame = isMoving ? currentWalkSet[animCycle] : currentWalkSet[frameCount === 8 ? 2 : 1];
            if (isDrawable(candidateFrame)) {
                spriteCanvas = candidateFrame;
            } else {
                spriteCanvas = currentWalkSet.find(img => isDrawable(img)) || null;
            }
        }

        // If walk cycle frame isn't drawable, fallback chain
        if (!isDrawable(spriteCanvas) && archKey && this.variantSpriteCanvases && isDrawable(this.variantSpriteCanvases[archKey])) {
            spriteCanvas = this.variantSpriteCanvases[archKey];
        }
        if (!isDrawable(spriteCanvas) && this.walkCycles && this.walkCycles[spriteIdx] && isDrawable(this.walkCycles[spriteIdx][0])) {
            spriteCanvas = this.walkCycles[spriteIdx][0];
        }
        if (!isDrawable(spriteCanvas) && spriteList && isDrawable(spriteList[spriteIdx])) {
            spriteCanvas = spriteList[spriteIdx];
        }
        if (!isDrawable(spriteCanvas) && spriteList && isDrawable(spriteList[0])) {
            spriteCanvas = spriteList[0];
        }

        const hasNpcAssets = isDrawable(spriteCanvas) && typeof ctx.drawImage === 'function';
        const sW = hasNpcAssets ? (spriteCanvas.naturalWidth || spriteCanvas.width || 166) : 166;
        const sH = Math.max(1, hasNpcAssets ? (spriteCanvas.naturalHeight || spriteCanvas.height || 420) : 420);
        const spriteH = Math.max(16, (customer && typeof customer.height === 'number' && Number.isFinite(customer.height)) ? customer.height : (this.npcHeight || 40));
        const spriteW = Math.max(12, Math.round(spriteH * (sW / sH)));

        const safeTilt = Number.isFinite(tiltAngle) ? tiltAngle : 0;
        const safeSquashX = (Number.isFinite(squashX) && squashX > 0.01 && squashX < 10) ? squashX : 1.0;
        const safeSquashY = (Number.isFinite(squashY) && squashY > 0.01 && squashY < 10) ? squashY : 1.0;
        const safeHopFactor = (Number.isFinite(hopShadowFactor) && hopShadowFactor >= 0) ? hopShadowFactor : 1.0;
        const safePulse = (Number.isFinite(finalPulse) && finalPulse > 0.01) ? finalPulse : 1.0;
        const safeBob = Number.isFinite(totalBob) ? totalBob : 0;

        ctx.save();
        ctx.translate(Math.round(x), Math.round(y));

        // Ground Contact Shadow (Always drawn flat on ground plane BEFORE ctx.rotate/scale to prevent angled shadows)
        const shadowBaseW = hasNpcAssets ? spriteW : 18;
        if (typeof ctx.ellipse === 'function') {
            ctx.fillStyle = `rgba(0, 0, 0, ${(0.12 * safeHopFactor).toFixed(3)})`;
            ctx.beginPath();
            ctx.ellipse(0, 2, Math.max(2, Math.round(shadowBaseW * 0.46 * safePulse)), Math.max(1, 3.8 * safePulse), 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(0, 0, 0, ${(0.22 * safeHopFactor).toFixed(3)})`;
            ctx.beginPath();
            ctx.ellipse(0, 2, Math.max(1, Math.round(shadowBaseW * 0.36 * safePulse)), Math.max(1, 2.5 * safePulse), 0, 0, Math.PI * 2);
            ctx.fill();
        }

        if (dir < 0) ctx.scale(-1, 1);

        // Safe application of Stride Lean to the character body
        if (typeof ctx.rotate === 'function' && safeTilt !== 0) {
            ctx.rotate(safeTilt);
        }

        // Apply squash & stretch safely without overwriting scaleX in direction-check mock
        const hasAnimProp = (typeof customer.animFrame === 'number' && customer.animFrame > 0) || (typeof customer.walkPhase === 'number' && customer.walkPhase > 0) || (typeof customer.idlePhase === 'number');
        if (hasAnimProp && typeof ctx.scale === 'function' && (Math.abs(safeSquashX - 1.0) > 0.001 || Math.abs(safeSquashY - 1.0) > 0.001)) {
            ctx.scale(safeSquashX, safeSquashY);
        }

        // Render 16-Bit Isometric Character Sprite when loaded
        let drewAsset = false;
        if (hasNpcAssets) {
            const drawX = -Math.round(spriteW / 2);
            const drawY = -spriteH + Math.round(safeBob);

            try {
                ctx.save();
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(spriteCanvas, drawX, drawY, spriteW, spriteH);
                ctx.restore();
                drewAsset = true;
            } catch (err) {
                try { ctx.restore(); } catch (_) {}
                drewAsset = false;
            }

            if (drewAsset) {
                // Takeout coffee cup in hand & sipping animation when customer has coffee
                if (customer.hasCoffee) {
                    const normalCupX = Math.round(spriteW * 0.15);
                    const normalCupY = -Math.round(spriteH * 0.45) + Math.round(safeBob);

                    const sipMouthX = Math.round(spriteW * 0.06);
                    const sipMouthY = -Math.round(spriteH * 0.70) + Math.round(safeBob);

                    const cupX = Math.round(normalCupX + (sipMouthX - normalCupX) * sipEase);
                    const cupY = Math.round(normalCupY + (sipMouthY - normalCupY) * sipEase);

                    // If archetype 1 (student) or 3 (hipster) is raising the cup, cleanly cover resting cup on body
                    if ((spriteIdx === 1 || spriteIdx === 3) && sipEase > 0.08) {
                        const jacketColors = ['#15803d', '#ea580c', '#0f172a', '#b45309', '#7e22ce', '#94a3b8'];
                        let coverColor = jacketColors[spriteIdx];
                        if (archKey && this.npcVariants && this.npcVariants[archKey] && this.npcVariants[archKey].palette && this.npcVariants[archKey].palette.topHex) {
                            coverColor = this.npcVariants[archKey].palette.topHex;
                        }
                        ctx.save();
                        ctx.fillStyle = coverColor;
                        ctx.globalAlpha = Math.min(1.0, (sipEase - 0.08) / 0.25);
                        ctx.fillRect(normalCupX, normalCupY, 5, 6);
                        ctx.restore();
                    }

                    const shouldDrawCup = (spriteIdx !== 1 && spriteIdx !== 3) || (sipEase > 0.08);

                    if (shouldDrawCup) {
                        ctx.save();
                        ctx.translate(cupX, cupY);
                        if (typeof ctx.rotate === 'function' && sipEase > 0.05) {
                            ctx.rotate(-0.35 * sipEase);
                        }
                        ctx.fillStyle = '#f8fafc'; // White cup body
                        ctx.fillRect(0, 0, 5, 6);
                        ctx.fillStyle = '#d97706'; // Brown heat sleeve
                        ctx.fillRect(0, 1, 5, 3);
                        ctx.fillStyle = '#0f172a'; // Sipping lid
                        ctx.fillRect(-1, -1, 7, 2);

                        // Rising Micro-Foam Steam
                        const cupSteamAlpha = 0.45 + Math.sin(this.frame * 0.15) * 0.35;
                        ctx.fillStyle = `rgba(255, 255, 255, ${cupSteamAlpha})`;
                        ctx.fillRect(2, -3, 2, 2);
                        ctx.fillRect(2 + Math.sin(this.frame * 0.1) * 1.5, -6, 2, 2);
                        if (sipEase > 0.6) {
                            ctx.fillRect(1 + Math.sin(this.frame * 0.25) * 2.0, -9, 2, 2);
                        }
                        ctx.restore();
                    } else {
                        const cupSteamAlpha = 0.45 + Math.sin(this.frame * 0.15) * 0.35;
                        ctx.fillStyle = `rgba(255, 255, 255, ${cupSteamAlpha})`;
                        ctx.fillRect(normalCupX + 2, normalCupY - 3, 2, 2);
                        ctx.fillRect(normalCupX + 2 + Math.sin(this.frame * 0.1) * 1.5, normalCupY - 6, 2, 2);
                    }
                }

                ctx.restore();

                // Thought & Feedback Bubbles
                if (!skipBubble && customer.bubble) {
                    this.renderCustomerBubble(ctx, customer);
                }
                return;
            }
        }

        // Procedural Fallback
        const bob = Math.round(safeBob);

        // Archetype Styling & Varied Outfits / Hairstyles / Accessories
        const arch = customer.archetype || 'student';
        const skinColor = customer.skinColor || '#f5cba7';
        const seed = Math.abs(String(customer.id ?? '').split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0) || Math.round(Math.abs(x * 100 + y)));

        let hairColor = '#2c3e50';
        let topColor = '#3498db';
        let pantsColor = '#2c3e50';
        let shoesColor = '#111111';
        let accessory = customer.accessory || null;
        let tieColor = '#dc2626';

        if (arch === 'student') {
            const studentTops = ['#ea580c', '#1e3a8a', '#15803d', '#991b1b'];
            const studentHairs = ['#78350f', '#3e2723', '#d97706', '#1e293b'];
            topColor = studentTops[seed % studentTops.length];
            pantsColor = (seed % 2 === 0) ? '#0284c7' : '#1e293b';
            hairColor = studentHairs[seed % studentHairs.length];
            shoesColor = '#f8fafc';
            if (!accessory) {
                const studentAccs = ['backpack', 'headphones', 'sunglasses'];
                accessory = studentAccs[seed % studentAccs.length];
            }
        } else if (arch === 'grad_student') {
            topColor = '#15803d';
            pantsColor = '#d97706';
            hairColor = '#78350f';
            shoesColor = '#475569';
            if (!accessory) accessory = 'backpack';
        } else if (arch === 'art_student') {
            topColor = '#06b6d4';
            pantsColor = '#701a75';
            hairColor = '#f472b6';
            shoesColor = '#facc15';
            if (!accessory) accessory = 'headphones';
        } else if (arch === 'bookworm') {
            topColor = '#991b1b';
            pantsColor = '#334155';
            hairColor = '#1e293b';
            shoesColor = '#78350f';
            if (!accessory) accessory = 'backpack';
        } else if (arch === 'business') {
            const bizTops = ['#0f172a', '#1e293b', '#334155'];
            const bizTies = ['#dc2626', '#d97706', '#0284c7'];
            const bizHairs = ['#1e293b', '#475569', '#3e2723'];
            topColor = bizTops[seed % bizTops.length];
            pantsColor = topColor;
            tieColor = bizTies[seed % bizTies.length];
            hairColor = bizHairs[seed % bizHairs.length];
            shoesColor = '#090d16';
            if (!accessory) {
                const bizAccs = ['briefcase', 'sunglasses'];
                accessory = bizAccs[seed % bizAccs.length];
            }
        } else if (arch === 'corporate_exec') {
            topColor = '#1e293b';
            pantsColor = '#1e293b';
            tieColor = '#eab308';
            hairColor = '#cbd5e1';
            shoesColor = '#090d16';
            if (!accessory) accessory = 'briefcase';
        } else if (arch === 'fintech_analyst') {
            topColor = '#1d4ed8';
            pantsColor = '#1d4ed8';
            tieColor = '#10b981';
            hairColor = '#1e293b';
            shoesColor = '#0f172a';
            if (!accessory) accessory = 'briefcase';
        } else if (arch === 'metro_commuter') {
            topColor = '#475569';
            pantsColor = '#475569';
            tieColor = '#2563eb';
            hairColor = '#451a03';
            shoesColor = '#1e293b';
            if (!accessory) accessory = 'briefcase';
        } else if (arch === 'jogger') {
            const jogTops = ['#10b981', '#f97316', '#2563eb'];
            topColor = jogTops[seed % jogTops.length];
            pantsColor = (seed % 2 === 0) ? '#047857' : '#1e293b';
            hairColor = (seed % 2 === 0) ? '#dc2626' : '#78350f';
            shoesColor = '#facc15';
            if (!accessory) {
                const jogAccs = ['headband', 'sunglasses', 'headphones'];
                accessory = jogAccs[seed % jogAccs.length];
            }
        } else if (arch === 'marathon_runner') {
            topColor = '#ff4b4b';
            pantsColor = '#18181b';
            hairColor = '#111111';
            shoesColor = '#00ffcc';
            if (!accessory) accessory = 'headband';
        } else if (arch === 'fashionista') {
            topColor = '#f472b6';
            pantsColor = '#fef08a';
            hairColor = '#fbbf24';
            shoesColor = '#f43f5e';
            if (!accessory) accessory = 'sunglasses';
        } else if (arch === 'casual_shopper') {
            topColor = '#c084fc';
            pantsColor = '#0284c7';
            hairColor = '#94a3b8';
            shoesColor = '#f8fafc';
            if (!accessory) accessory = 'scarf';
        } else if (arch === 'cryptobro') {
            const cryptoTops = ['#7e22ce', '#18181b', '#0d9488'];
            topColor = cryptoTops[seed % cryptoTops.length];
            pantsColor = '#18181b';
            hairColor = (seed % 2 === 0) ? '#f59e0b' : '#38bdf8';
            shoesColor = '#00ffcc';
            if (!accessory) {
                const cryptoAccs = ['sunglasses', 'laser_eyes', 'headphones'];
                accessory = cryptoAccs[seed % cryptoAccs.length];
            }
        } else if (arch === 'crypto_whale') {
            topColor = '#18181b';
            pantsColor = '#09090b';
            hairColor = '#e2e8f0';
            shoesColor = '#eab308';
            if (!accessory) accessory = 'laser_eyes';
        } else if (arch === 'tech_hacker') {
            topColor = '#15803d';
            pantsColor = '#09090b';
            hairColor = '#09090b';
            shoesColor = '#22c55e';
            if (!accessory) accessory = 'sunglasses';
        } else if (arch === 'indie_dev') {
            topColor = '#1e3a8a';
            pantsColor = '#b45309';
            hairColor = '#b91c1c';
            shoesColor = '#f97316';
            if (!accessory) accessory = 'headphones';
        } else if (arch === 'hipster') {
            const hipTops = ['#c2410c', '#15803d', '#b45309'];
            topColor = hipTops[seed % hipTops.length];
            pantsColor = '#64748b';
            hairColor = '#451a03';
            shoesColor = '#78350f';
            if (!accessory) {
                const hipAccs = ['scarf', 'beanie', 'sunglasses'];
                accessory = hipAccs[seed % hipAccs.length];
            }
        } else if (arch === 'barista_regular') {
            topColor = '#d97706';
            pantsColor = '#18181b';
            hairColor = '#18181b';
            shoesColor = '#78350f';
            if (!accessory) accessory = 'beanie';
        } else if (arch === 'music_producer') {
            topColor = '#7e22ce';
            pantsColor = '#09090b';
            hairColor = '#22d3ee';
            shoesColor = '#a855f7';
            if (!accessory) accessory = 'headphones';
        } else if (arch === 'dog_walker') {
            topColor = '#4d7c0f';
            pantsColor = '#b45309';
            hairColor = '#78350f';
            shoesColor = '#713f12';
            if (!accessory) accessory = 'scarf';
        } else if (arch === 'senior') {
            const senTops = ['#94a3b8', '#92400e', '#3f6212'];
            topColor = senTops[seed % senTops.length];
            pantsColor = '#475569';
            hairColor = '#f1f5f9';
            shoesColor = '#334155';
            if (!accessory) {
                const senAccs = ['cane', 'scarf'];
                accessory = senAccs[seed % senAccs.length];
            }
        } else if (arch === 'professor') {
            topColor = '#78350f';
            pantsColor = '#451a03';
            hairColor = '#94a3b8';
            shoesColor = '#3e2723';
            if (!accessory) accessory = 'cane';
        } else if (arch === 'retiree') {
            topColor = '#0d9488';
            pantsColor = '#334155';
            hairColor = '#ffffff';
            shoesColor = '#475569';
            if (!accessory) accessory = 'cane';
        } else if (arch === 'tourist') {
            topColor = '#0284c7';
            pantsColor = '#0369a1';
            hairColor = '#facc15';
            shoesColor = '#f8fafc';
            if (!accessory) accessory = 'sunglasses';
        }

        // 1. Animated Legs (Pants)
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-4 + legSwing * 0.6, -10, 3, 10 + Math.abs(legSwing) * 0.08);
        ctx.fillRect(1 - legSwing * 0.6, -10, 3, 10 + Math.abs(legSwing) * 0.08);

        // 2. Shoes
        ctx.fillStyle = shoesColor;
        ctx.fillRect(-5 + legSwing * 0.7, 0, 4, 2);
        ctx.fillRect(1 - legSwing * 0.7, 0, 4, 2);

        // 3. Torso / Shirt / Jacket with Walk Bob
        ctx.fillStyle = topColor;
        ctx.fillRect(-5, -23 + bob, 11, 13);

        // Flannel Plaid texture for hipster
        if (arch === 'hipster') {
            ctx.fillStyle = '#7c2d12';
            ctx.fillRect(-5, -20 + bob, 11, 2);
            ctx.fillRect(-2, -23 + bob, 2, 13);
        }

        // Crimson / Gold Tie for business
        if (arch === 'business') {
            ctx.fillStyle = tieColor;
            ctx.fillRect(-1, -22 + bob, 2, 7);
        }

        // 4. Head & Face
        ctx.fillStyle = skinColor;
        ctx.fillRect(-4, -32 + bob, 9, 9);
        // Eye
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(2, -29 + bob, 2, 2);

        // 5. Hair Strands & Varied Cut
        ctx.fillStyle = hairColor;
        ctx.fillRect(-5, -35 + bob, 11, 5);
        ctx.fillRect(-6, -33 + bob, 3, 5);
        if (seed % 3 === 1) {
            // Longer hair strands
            ctx.fillRect(-6, -28 + bob, 3, 6);
        }

        // 6. Accessories & Style Props (Backpacks, Sunglasses, Scarves, Beanies, etc.)
        if (accessory === 'beanie') {
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(-6, -37 + bob, 12, 6);
            ctx.fillStyle = '#7f1d1d';
            ctx.fillRect(-6, -33 + bob, 12, 2);
        } else if (accessory === 'laser_eyes') {
            ctx.fillStyle = '#00ffcc';
            ctx.fillRect(2, -29 + bob, 5, 2);
        } else if (accessory === 'headband') {
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(-5, -33 + bob, 11, 2);
        } else if (accessory === 'headphones') {
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(-1, -34 + bob, 2, 2);
            ctx.fillRect(-5, -30 + bob, 2, 4);
        } else if (accessory === 'briefcase') {
            ctx.fillStyle = '#451a03';
            ctx.fillRect(-9, -16 + bob, 5, 6);
            ctx.fillStyle = '#f1c40f'; // Brass buckle
            ctx.fillRect(-7, -14 + bob, 1, 2);
        } else if (accessory === 'cane') {
            ctx.fillStyle = '#78350f';
            ctx.fillRect(5, -16 + bob, 2, 16);
            ctx.fillRect(4, -18 + bob, 4, 2); // Curved handle
        } else if (accessory === 'backpack') {
            // High-pixel student backpack with top haul loop, front strap & gold zipper
            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(-9, -23 + bob, 5, 10);
            ctx.fillRect(-8, -25 + bob, 3, 2); // Top haul handle loop
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(-7, -20 + bob, 2, 4);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-2, -22 + bob, 2, 8);
        } else if (accessory === 'sunglasses') {
            // Retro pixel dark shades with specular shine
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(1, -29 + bob, 5, 2);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(2, -29 + bob, 1, 1);
            ctx.fillRect(4, -29 + bob, 1, 1);
        } else if (accessory === 'scarf') {
            // Cozy knitted scarf with draped tails and fringe
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(-5, -23 + bob, 11, 4);
            ctx.fillStyle = '#991b1b';
            ctx.fillRect(-5, -20 + bob, 11, 1);
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(-1, -19 + bob, 3, 6);
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(-1, -13 + bob, 3, 1);
        }

        // 7. Arms & Holding Steaming Coffee Cup when Happy!
        if (customer.hasCoffee) {
            const normalHandY = -19 + bob;
            const sipHandY = -27 + bob;
            const handY = Math.round(normalHandY + (sipHandY - normalHandY) * sipEase);
            const handX = Math.round(3 - sipEase * 2);

            // Holding cup forward in hand
            ctx.fillStyle = skinColor;
            ctx.fillRect(handX, handY, 6, 3);

            // Detailed Takeout Coffee Cup
            const cupX = handX + 5;
            const cupY = handY - 3;
            ctx.fillStyle = '#f8fafc'; // White cup body
            ctx.fillRect(cupX, cupY, 6, 8);
            ctx.fillStyle = '#d97706'; // Brown heat sleeve
            ctx.fillRect(cupX, cupY + 2, 6, 4);
            ctx.fillStyle = '#0f172a'; // Sipping lid
            ctx.fillRect(cupX - 1, cupY - 1, 8, 2);

            // Rising Micro-Foam Steam Wisps
            const cupSteamAlpha = 0.45 + Math.sin(this.frame * 0.15) * 0.35;
            ctx.fillStyle = `rgba(255, 255, 255, ${cupSteamAlpha})`;
            ctx.fillRect(cupX + 2 + Math.sin(this.frame * 0.1) * 1.5, cupY - 4, 2, 2);
            if (sipEase > 0.6) {
                ctx.fillRect(cupX + 1 + Math.sin(this.frame * 0.25) * 2.0, cupY - 7, 2, 2);
            }
        } else {
            // Counter-phase Arm Swinging or Watch Checking Fidget
            ctx.fillStyle = topColor;
            if (isFidgeting && (fidgetPhase % 4.0) > 2.2) {
                // Checking wristwatch in line
                ctx.fillRect(0, -21 + bob, 5, 4);
                ctx.fillStyle = '#f1c40f'; // Watch dial
                ctx.fillRect(3, -22 + bob, 2, 2);
                ctx.fillStyle = skinColor;
                ctx.fillRect(4, -20 + bob, 3, 3);
            } else {
                const armSwing = isMoving ? Math.sin(animFrame * Math.PI + Math.PI) * 3.5 : 0;
                ctx.fillRect(-2 + armSwing, -21 + bob, 4, 7);
                ctx.fillStyle = skinColor;
                ctx.fillRect(-2 + armSwing, -14 + bob, 3, 3);
            }
        }

        // Location-Specific NPC Props & Accessories
        this.renderLocationAccessories(ctx, customer, (typeof spriteIdx === 'number' ? spriteIdx : (customer.archetype === 'business' ? 2 : (customer.archetype === 'student' ? 1 : 0))), 24, 48, bob);

        ctx.restore();

        // 8. Thought & Feedback Bubbles (Pop-in Spring Animation & Retro Icons)
        if (!skipBubble && customer.bubble) {
            this.renderCustomerBubble(ctx, customer);
        }
    }

    renderCustomerBubble(ctx, customer) {
        if (!ctx || !customer || !customer.bubble) return;
        const x = (typeof customer.x === 'number' && !isNaN(customer.x)) ? customer.x : 0;
        const y = (typeof customer.y === 'number' && !isNaN(customer.y)) ? customer.y : 0;
        const spriteH = (customer && typeof customer.height === 'number') ? customer.height : (this.npcHeight || 40);
        this.renderHighPixelBubble(ctx, Math.round(x), Math.round(y) - spriteH - 8, customer.bubble, customer.bubbleTimer, customer.bubbleMaxTimer);
    }

    // -------------------------------------------------------------
    // LOCATION-SPECIFIC NPC ACCESSORIES & CHARMING PROPS
    // (Tailors character visual styling dynamically to each location!)
    // -------------------------------------------------------------
    renderLocationAccessories(ctx, customer, spriteIdx, spriteW, spriteH, totalBob) {
        if (!ctx) return;
        const locId = (window.simulationModel && window.simulationModel.currentLocation) || 'suburbs';
        const seed = Math.abs(String(customer.id || '').split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0) || Math.round(Math.abs((customer.x || 0) * 100 + (customer.y || 0))));
        const bob = Math.round(totalBob || 0);

        if (typeof ctx.save === 'function') ctx.save();

        if (locId === 'campus') {
            // 🎓 TECH UNIVERSITY CAMPUS:
            // 1. College Textbooks / Hardcover Study Folders tucked under arm
            if (!customer.hasCoffee || (customer.sipTimer || 0) < 0.1) {
                const bookX = -Math.round(spriteW * 0.30);
                const bookY = -Math.round(spriteH * 0.44) + bob;
                const bookColors = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c'];
                const bCol = bookColors[seed % bookColors.length];

                // Hardcover Book Spine & Cover
                ctx.fillStyle = bCol;
                ctx.fillRect(bookX, bookY, 8, 10);
                // White Page Edges
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(bookX + 2, bookY + 1, 5, 8);
                // Sticky Bookmark Tabs
                ctx.fillStyle = '#facc15';
                ctx.fillRect(bookX + 3, bookY - 2, 2, 2);
                ctx.fillStyle = '#ec4899';
                ctx.fillRect(bookX + 6, bookY - 1, 2, 2);
            }

            // 2. Student Campus ID Lanyard on collar (archetypes 0, 1, 3, 4)
            if (spriteIdx === 0 || spriteIdx === 1 || spriteIdx === 3 || spriteIdx === 4) {
                const lanX = -2;
                const lanY = -Math.round(spriteH * 0.62) + bob;
                ctx.fillStyle = '#0284c7'; // Blue lanyard strap
                ctx.fillRect(lanX, lanY, 4, 6);
                ctx.fillStyle = '#ffffff'; // White ID card
                ctx.fillRect(lanX - 1, lanY + 6, 6, 6);
                ctx.fillStyle = '#facc15'; // Golden chip
                ctx.fillRect(lanX, lanY + 7, 4, 2);
            }
        } else if (locId === 'downtown') {
            // 💼 WALL ST. & CRYPTO PLAZA:
            // 1. Executive Gold Wristwatch on cuff with dynamic glint
            const watchX = Math.round(spriteW * 0.16);
            const watchY = -Math.round(spriteH * 0.38) + bob;
            ctx.fillStyle = '#facc15';
            ctx.fillRect(watchX, watchY, 3, 2);
            if (Math.sin((this.frame || 0) * 0.2 + seed) > 0.8) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(watchX + 1, watchY - 1, 2, 2);
            }

            // 2. Leather Executive Briefcase with Brass Latches (Businessmen & Elegant Ladies)
            if ((spriteIdx === 2 || spriteIdx === 5) && !customer.hasCoffee) {
                const caseX = Math.round(spriteW * 0.20);
                const caseY = -Math.round(spriteH * 0.30) + bob;
                ctx.fillStyle = '#1e1b4b'; // Dark navy leather briefcase
                ctx.fillRect(caseX, caseY, 9, 10);
                ctx.fillStyle = '#d97706'; // Brass lock & handle
                ctx.fillRect(caseX + 3, caseY - 2, 3, 2);
                ctx.fillRect(caseX + 4, caseY + 4, 2, 2);
            }

            // 3. Smartphone checking Live Green Crypto Candlestick Chart (Crypto Bro archetype 4)
            if (spriteIdx === 4) {
                const phoneX = -Math.round(spriteW * 0.24);
                const phoneY = -Math.round(spriteH * 0.46) + bob;
                ctx.fillStyle = '#0f172a'; // Black titanium phone
                ctx.fillRect(phoneX, phoneY, 5, 8);
                ctx.fillStyle = '#22c55e'; // Glowing green bull market chart!
                ctx.fillRect(phoneX + 1, phoneY + 2, 3, 1);
                ctx.fillRect(phoneX + 2, phoneY + 3, 1, 3);
            }
        } else if (locId === 'park') {
            // 🌳 CENTRAL CITY PARK:
            // 1. Sporty Headband / Sun Visor on Joggers (archetype 0)
            if (spriteIdx === 0) {
                const headY = -Math.round(spriteH * 0.84) + bob;
                ctx.fillStyle = '#ef4444'; // Red sporty sweatband
                ctx.fillRect(-7, headY, 13, 3);
                ctx.fillStyle = '#ffffff'; // White swoosh stripe
                ctx.fillRect(-4, headY + 1, 7, 1);
            }

            // 2. Hydration Flask / Sports Bottle in hand (if not holding coffee)
            if (!customer.hasCoffee) {
                const bottleX = Math.round(spriteW * 0.16);
                const bottleY = -Math.round(spriteH * 0.38) + bob;
                ctx.fillStyle = '#06b6d4'; // Cyan sporty water bottle
                ctx.fillRect(bottleX, bottleY, 4, 8);
                ctx.fillStyle = '#94a3b8'; // Silver cap
                ctx.fillRect(bottleX + 1, bottleY - 2, 2, 2);
            }

            // 3. Cute Walking Pet Companion (Corgi / Golden Pup trotting beside character)
            if (seed % 3 === 0) {
                const petX = -24;
                const petY = 2 + Math.round(Math.sin((this.frame || 0) * 0.35 + seed) * 1.5);
                const stepPhase = Math.floor(((customer.walkPhase || 0) + (this.frame || 0) * 0.1) * 3) % 4;

                // Leash line from owner's hand to pup collar
                if (typeof ctx.beginPath === 'function' && typeof ctx.moveTo === 'function' && typeof ctx.lineTo === 'function') {
                    ctx.strokeStyle = 'rgba(71, 85, 105, 0.65)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(Math.round(spriteW * 0.1), -Math.round(spriteH * 0.36) + bob);
                    ctx.lineTo(petX + 6, petY - 7);
                    if (typeof ctx.stroke === 'function') ctx.stroke();
                }

                // Cute Golden Corgi Pup
                // Shadow
                if (typeof ctx.ellipse === 'function') {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.beginPath();
                    ctx.ellipse(petX + 5, 2, 7, 2, 0, 0, Math.PI * 2);
                    if (typeof ctx.fill === 'function') ctx.fill();
                }

                // Body & Belly
                ctx.fillStyle = '#d97706'; // Golden fur
                ctx.fillRect(petX, petY - 7, 10, 6);
                ctx.fillStyle = '#fef08a'; // Cream belly & chest
                ctx.fillRect(petX + 4, petY - 5, 5, 4);

                // Head, Snout, Nose & Eye
                ctx.fillStyle = '#d97706';
                ctx.fillRect(petX + 6, petY - 11, 6, 6);
                ctx.fillStyle = '#fef08a'; // Cream snout
                ctx.fillRect(petX + 10, petY - 9, 3, 3);
                ctx.fillStyle = '#0f172a'; // Black nose
                ctx.fillRect(petX + 12, petY - 9, 1, 1);
                ctx.fillStyle = '#0f172a'; // Black eye
                ctx.fillRect(petX + 9, petY - 10, 1, 1);

                // Ears & Red Collar
                ctx.fillStyle = '#92400e';
                ctx.fillRect(petX + 5, petY - 13, 2, 3);
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(petX + 6, petY - 6, 2, 2);

                // Wagging tail
                const tailAngle = Math.sin((this.frame || 0) * 0.5 + seed) * 3;
                ctx.fillStyle = '#d97706';
                ctx.fillRect(petX - 3, petY - 9 + Math.round(tailAngle), 4, 2);
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(petX - 4, petY - 9 + Math.round(tailAngle), 2, 2);

                // 4 Stepping Paws
                const pawOffset = (stepPhase % 2 === 0) ? 1 : -1;
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(petX + 1, petY - 1 + pawOffset, 2, 2);
                ctx.fillRect(petX + 4, petY - 1 - pawOffset, 2, 2);
                ctx.fillRect(petX + 7, petY - 1 + pawOffset, 2, 2);
                ctx.fillRect(petX + 9, petY - 1 - pawOffset, 2, 2);
            }
        } else if (locId === 'suburbs') {
            // 🏡 GREENWOOD SUBURBS:
            // 1. Brown Kraft Paper Grocery Bag with Baguette & Flowers
            if ((spriteIdx === 0 || spriteIdx === 5 || spriteIdx === 1) && !customer.hasCoffee) {
                const bagX = -Math.round(spriteW * 0.30);
                const bagY = -Math.round(spriteH * 0.44) + bob;
                // Detailed pixel-art grocery bag
                ctx.fillStyle = '#b45309'; // Kraft brown bag
                ctx.fillRect(bagX, bagY + 2, 8, 9);
                ctx.fillStyle = '#d97706'; // Folded rim highlight
                ctx.fillRect(bagX, bagY, 8, 2);
                ctx.fillStyle = '#78350f'; // Bag crease line
                ctx.fillRect(bagX + 5, bagY + 2, 1, 9);
                ctx.fillStyle = '#f59e0b'; // French Baguette
                ctx.fillRect(bagX + 2, bagY - 6, 3, 7);
                ctx.fillStyle = '#78350f'; // Baguette crust cuts
                ctx.fillRect(bagX + 2, bagY - 4, 3, 1);
                ctx.fillStyle = '#10b981'; // Green stem
                ctx.fillRect(bagX + 5, bagY - 5, 1, 5);
                ctx.fillStyle = '#f43f5e'; // Pink blossom
                ctx.fillRect(bagX + 4, bagY - 7, 3, 3);
            }

            // 2. Cozy Knit Scarf on Hipsters & Seniors
            if (spriteIdx === 3 || spriteIdx === 5) {
                const scarfY = -Math.round(spriteH * 0.68) + bob;
                ctx.fillStyle = '#f59e0b'; // Warm amber knitted scarf
                ctx.fillRect(-6, scarfY, 12, 4);
                ctx.fillRect(3, scarfY + 3, 3, 5); // Scarf tail
            }
        } else if (locId === 'metro') {
            // 🚇 GRAND CENTRAL METRO:
            // 1. Folded Morning Transit Newspaper under arm
            if (!customer.hasCoffee) {
                const paperX = -Math.round(spriteW * 0.30);
                const paperY = -Math.round(spriteH * 0.42) + bob;
                ctx.fillStyle = '#f8fafc'; // Newspaper
                ctx.fillRect(paperX, paperY, 8, 9);
                ctx.fillStyle = '#334155'; // Headline print lines
                ctx.fillRect(paperX + 1, paperY + 2, 6, 1);
                ctx.fillRect(paperX + 1, paperY + 4, 5, 1);
                ctx.fillRect(paperX + 1, paperY + 6, 5, 1);
            }

            // 2. Commuter Umbrella hooked on forearm
            if (spriteIdx === 2 || spriteIdx === 5) {
                const umbX = Math.round(spriteW * 0.20);
                const umbY = -Math.round(spriteH * 0.42) + bob;
                ctx.fillStyle = '#1e293b'; // Dark umbrella
                ctx.fillRect(umbX, umbY, 3, 14);
                ctx.fillStyle = '#78350f'; // Wooden curved handle
                ctx.fillRect(umbX - 2, umbY - 3, 4, 2);
                ctx.fillRect(umbX - 3, umbY - 2, 2, 3);
            }

            // 3. Metro Smart Card / Subway Ticket in hand (only when customer does not have coffee)
            if (!customer.hasCoffee) {
                const cardX = Math.round(spriteW * 0.16);
                const cardY = -Math.round(spriteH * 0.34) + bob;
                // Sleek commuter pass with corner bevel and gold transit chip
                ctx.fillStyle = '#3b82f6'; // Blue transit card
                ctx.fillRect(cardX, cardY + 1, 5, 3);
                ctx.fillStyle = '#60a5fa'; // Card top bevel
                ctx.fillRect(cardX, cardY, 5, 1);
                ctx.fillStyle = '#facc15'; // Golden transit chip
                ctx.fillRect(cardX + 1, cardY + 1, 2, 1);
            }
        }

        if (typeof ctx.restore === 'function') ctx.restore();
    }

    // Detect icon archetype from bubble message
    detectBubbleIcon(text) {
        if (!text) return null;
        if (text.includes('🌟') || text.includes('Masterpiece') || text.includes('Perfect')) return 'star';
        if (text.includes('❤️') || text.includes('Love') || text.includes('Awesome')) return 'heart';
        if (text.includes('☕') || text.includes('Coffee') || text.includes('Roast')) return 'steam_cup';
        if (text.includes('🪙') || text.includes('USDC') || text.includes('💵') || text.includes('Paid')) return 'coin';
        if (text.includes('🚀') || text.includes('boost')) return 'rocket';
        if (text.includes('😭') || text.includes('Sold out') || text.includes('Too pricey') || text.includes('💸') || text.includes('Bitter') || text.includes('Watery') || text.includes('Cold') || text.includes('Sweet') || text.includes('Line too long') || text.includes('⏳')) return 'sad';
        return null;
    }

    // Dedicated High-Pixel Icon Renderer for Emotion Bubbles
    drawPixelIcon(ctx, iconType, cx, cy) {
        const x = Math.round(cx);
        const y = Math.round(cy);
        if (iconType === 'star') {
            // Golden 5-point retro pixel star (9x9)
            ctx.fillStyle = '#b45309';
            ctx.fillRect(x - 1, y - 4, 3, 9);
            ctx.fillRect(x - 4, y - 1, 9, 3);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(x, y - 3, 1, 7);
            ctx.fillRect(x - 3, y, 7, 1);
            ctx.fillRect(x - 2, y - 1, 5, 3);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(x - 1, y - 1, 3, 3);
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(x - 1, y - 2, 1, 1);
        } else if (iconType === 'heart') {
            // Ruby retro 8-bit heart (8x8)
            ctx.fillStyle = '#991b1b';
            ctx.fillRect(x - 3, y - 3, 3, 5);
            ctx.fillRect(x + 1, y - 3, 3, 5);
            ctx.fillRect(x - 2, y + 2, 5, 2);
            ctx.fillRect(x - 1, y + 4, 3, 1);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(x - 2, y - 2, 2, 4);
            ctx.fillRect(x + 1, y - 2, 2, 4);
            ctx.fillRect(x - 1, y + 1, 3, 2);
            ctx.fillStyle = '#f472b6';
            ctx.fillRect(x - 2, y - 2, 1, 1);
        } else if (iconType === 'steam_cup') {
            // Steaming Coffee Cup (8x8)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x - 3, y - 1, 6, 5);
            ctx.fillStyle = '#d97706';
            ctx.fillRect(x - 3, y + 1, 6, 2);
            ctx.fillStyle = '#78350f';
            ctx.fillRect(x - 2, y - 1, 4, 1);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x - 1, y - 4, 1, 2);
            ctx.fillRect(x + 1, y - 3, 1, 1);
        } else if (iconType === 'coin') {
            // Shiny Gold Coin (8x8)
            ctx.fillStyle = '#b45309';
            ctx.fillRect(x - 3, y - 3, 7, 7);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(x - 2, y - 2, 5, 5);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(x - 1, y - 1, 3, 3);
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(x, y, 1, 1);
        } else if (iconType === 'rocket') {
            // Web3 Booster Rocket (8x8)
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(x - 1, y - 4, 3, 6);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y - 2, 1, 1);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(x - 3, y + 1, 2, 2);
            ctx.fillRect(x + 2, y + 1, 2, 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(x, y + 2, 1, 3);
        } else {
            // Sad / Stress Tear Drop (8x8)
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(x - 2, y - 3, 4, 7);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(x - 1, y - 2, 3, 5);
            ctx.fillStyle = '#e0f2fe';
            ctx.fillRect(x - 1, y - 1, 1, 2);
        }
    }

    // High-Pixel Speech / Emotion Bubble with Distinct Pixel Art Icons
    renderHighPixelBubble(ctx, bx, by, bubble, timer = 1.0, maxTimer = 1.3) {
        const text = (bubble && bubble.text) ? bubble.text : '';
        const iconType = this.detectBubbleIcon(text);

        const iconOffset = iconType ? 18 : 0;
        const bubbleW = Math.max(bubble.width || 48, (text.length * 5.8) + 16 + iconOffset);
        const bubbleH = 22;

        const elapsed = Math.max(0, (maxTimer || 1.3) - (timer || 1.3));
        const popScale = Math.min(1.0, elapsed * 7.5);
        const alpha = (timer !== undefined && timer < 0.28) ? Math.max(0, timer / 0.28) : 1.0;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(bx, by);
        ctx.scale(popScale, popScale);

        const x = -bubbleW / 2;
        const y = -bubbleH;

        // Soft Pixel Drop Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.fillRect(x + 2, y + 2, bubbleW, bubbleH);

        // Crisp Border & White Bubble Background
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x - 1, y - 1, bubbleW + 2, bubbleH + 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, bubbleW, bubbleH);

        // Top specular highlight inside bubble
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x, y, bubbleW, 1);

        // Tail pointing down to speaker
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-3, 0, 6, 2);
        ctx.fillRect(-2, 2, 4, 2);
        ctx.fillRect(-1, 4, 2, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-2, 0, 4, 2);
        ctx.fillRect(-1, 2, 2, 2);

        // Render Icon & Text
        if (iconType) {
            // Icon Badge Box
            this.drawPixelBevelBox(ctx, x + 3, y + 3, 16, 16, '#f1f5f9', '#ffffff', '#cbd5e1', '#0f172a');
            this.drawPixelIcon(ctx, iconType, x + 11, y + 11);

            // Clean text without raw emoji for razor-sharp typography
            const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
            ctx.fillStyle = bubble.color || '#0f172a';
            ctx.font = 'bold 8.5px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(cleanText || text, x + 23, y + 14);
        } else {
            // Content Text centered
            ctx.fillStyle = bubble.color || '#0f172a';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(text, 0, y + 14);
        }

        ctx.restore();
    }

    // Retro Wood/Brass Framed Stand HUD
    renderStandHUD(ctx, standX, standY, cupsInBatch, totalTips) {
        const carafeX = Math.round(standX - 8);
        const carafeY = Math.round(standY - 58);

        ctx.save();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.font = 'bold 7.5px monospace';

        // 1. Ready Batch Cups Badge
        this.drawPixelBevelBox(ctx, carafeX, carafeY, 46, 12, '#0f172a', '#334155', '#020617', '#38bdf8');
        ctx.fillStyle = cupsInBatch > 0 ? '#38bdf8' : '#ef4444';
        ctx.fillText(`☕ ${cupsInBatch} cups`, carafeX + 3, carafeY + 6);

        // 2. Web3 Tip Jar Badge
        if (totalTips > 0) {
            const tipX = carafeX + 50;
            const tipY = carafeY;
            this.drawPixelBevelBox(ctx, tipX, tipY, 44, 12, '#0f172a', '#0d9488', '#042f2e', '#00ffcc');
            ctx.fillStyle = '#00ffcc';
            ctx.fillText(`🪙$${totalTips.toFixed(1)}`, tipX + 3, tipY + 6);
        }
        ctx.restore();
    }

    // -------------------------------------------------------------
    // WEATHER OVERLAYS (Rain, Snow & Sunbeams)
    // -------------------------------------------------------------
    renderWeatherEffects(ctx, width, height, weather) {
        if (weather.type === 'rainy') {
            // Angled Rain Streaks
            ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
            ctx.lineWidth = 1.2;
            const dropCount = 55;
            for (let i = 0; i < dropCount; i++) {
                const rx = ((this.frame * 9 + i * 29) % (width + 80)) - 40;
                const ry = (this.frame * 22 + i * 41) % (height + 30);
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.lineTo(rx - 5, ry + 14);
                ctx.stroke();

                if (ry > height * 0.63 && Math.random() < 0.05 && this.groundRipples.length < 18) {
                    this.groundRipples.push({
                        x: rx,
                        y: ry + 12,
                        r: 1,
                        alpha: 0.6
                    });
                }
            }

            // Expanding Puddle Ripples
            this.groundRipples.forEach(r => {
                ctx.strokeStyle = `rgba(186, 230, 253, ${Math.max(0, r.alpha)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(r.x, r.y, r.r, r.r * 0.35, 0, 0, Math.PI * 2);
                ctx.stroke();
            });
        } else if (weather.type === 'freezing') {
            // Drifting Pixel Snowflakes
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            for (let i = 0; i < 45; i++) {
                const sx = ((this.frame * 1.5 + i * 31 + Math.sin(this.frame * 0.04 + i) * 18) % (width + 40)) - 20;
                const sy = (this.frame * 2.2 + i * 43) % height;
                this.drawPixelCircle(ctx, sx, sy, (i % 3 === 0 ? 2 : 1.2));
            }
        } else if (weather.type === 'sunny' || weather.type === 'scorching') {
            // Golden Atmospheric Sunbeams
            const beamAlpha = (weather.type === 'scorching' ? 0.08 : 0.045) + Math.sin(this.frame * 0.025) * 0.02;
            const beamGrad = ctx.createLinearGradient(0, 0, width, height);
            beamGrad.addColorStop(0, `rgba(255, 235, 59, ${beamAlpha * 1.8})`);
            beamGrad.addColorStop(1, 'rgba(255, 235, 59, 0)');
            ctx.fillStyle = beamGrad;
            ctx.beginPath();
            ctx.moveTo(width * 0.22, 0);
            ctx.lineTo(width * 0.54, 0);
            ctx.lineTo(width * 0.85, height);
            ctx.lineTo(width * 0.45, height);
            ctx.closePath();
            ctx.fill();

            if (weather.type === 'scorching') {
                ctx.fillStyle = 'rgba(243, 156, 18, 0.07)';
                ctx.fillRect(0, 0, width, height);
            }
        }
    }

    // -------------------------------------------------------------
    // FLOATING UI OVERLAYS & CONFETTI
    // -------------------------------------------------------------
    renderUIOverlays(ctx) {
        // Floating Cash & Crypto Sales Text
        this.floatingTexts.forEach(t => {
            ctx.save();
            ctx.globalAlpha = Math.max(0, Math.min(1, t.alpha));
            ctx.fillStyle = t.color;
            ctx.font = `bold ${t.size}px monospace`;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetY = 1;
            ctx.fillText(t.text, t.x, t.y);
            ctx.restore();
        });

        // /boost Confetti
        this.confettiParticles.forEach(c => {
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rot);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
            ctx.restore();
        });

        // Cheerful Customer Stars & Hearts
        this.cheerfulParticles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            ctx.translate(Math.round(p.x), Math.round(p.y));
            if (typeof ctx.rotate === 'function') ctx.rotate(p.rot);
            this.drawPixelIcon(ctx, p.type === 'heart' ? 'heart' : 'star', 0, 0);
            ctx.restore();
        });
    }

    // -------------------------------------------------------------
    // PLACED MAP PROPS & SCENERY ASSETS
    // -------------------------------------------------------------
    renderProp(ctx, prop, isBoosted = false, weather = null) {
        if (!prop || !ctx) return;
        const x = typeof prop.x === 'number' ? prop.x : 0;
        const y = typeof prop.y === 'number' ? prop.y : 0;
        const scale = typeof prop.scale === 'number' ? prop.scale : 1.0;
        const flip = prop.flip === true;
        const type = prop.type || 'cafe_table';

        ctx.save();
        ctx.translate(Math.round(x), Math.round(y));
        if (scale !== 1.0) ctx.scale(scale, scale);
        if (flip) ctx.scale(-1, 1);

        switch (type) {
            case 'cafe_table': {
                // Ground drop shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ctx.beginPath();
                ctx.ellipse(0, 0, 14, 6, 0, 0, Math.PI * 2);
                ctx.fill();

                // Cast-iron table pedestal and cross-feet
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(-2, -14, 4, 14);
                ctx.fillRect(-8, -2, 16, 2);

                // Round wooden table top (isometric ellipse)
                ctx.fillStyle = '#6d4c41'; // rim
                ctx.beginPath();
                ctx.ellipse(0, -14, 14, 7, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#8d6e63'; // top surface
                ctx.beginPath();
                ctx.ellipse(0, -15, 12, 6, 0, 0, Math.PI * 2);
                ctx.fill();

                // Two small espresso demitasse cups with saucers
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(-5, -20, 4, 3);
                ctx.fillRect(3, -19, 4, 3);
                ctx.fillStyle = '#3e2723';
                ctx.fillRect(-4, -20, 2, 1);
                ctx.fillRect(4, -19, 2, 1);
                break;
            }

            case 'umbrella_table': {
                // Drop shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
                ctx.beginPath();
                ctx.ellipse(0, 0, 18, 8, 0, 0, Math.PI * 2);
                ctx.fill();

                // Table base
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(-2, -14, 4, 14);
                ctx.fillRect(-9, -2, 18, 2);

                // Table top
                ctx.fillStyle = '#795548';
                ctx.beginPath();
                ctx.ellipse(0, -14, 15, 7, 0, 0, Math.PI * 2);
                ctx.fill();

                // Tall Umbrella Pole
                ctx.fillStyle = '#d4ac0d';
                ctx.fillRect(-1.5, -46, 3, 34);

                // Striped Parasol Canopy
                const canopyY = -46;
                ctx.beginPath();
                ctx.moveTo(-22, canopyY + 10);
                ctx.quadraticCurveTo(0, canopyY - 14, 22, canopyY + 10);
                ctx.closePath();
                ctx.fillStyle = '#c0392b';
                ctx.fill();

                // Alternating scallop panels
                for (let i = -2; i <= 2; i++) {
                    ctx.fillStyle = (i % 2 === 0) ? '#c0392b' : '#fdfefe';
                    ctx.beginPath();
                    ctx.moveTo(0, canopyY - 10);
                    ctx.lineTo(i * 8 - 4, canopyY + 10);
                    ctx.lineTo(i * 8 + 4, canopyY + 10);
                    ctx.closePath();
                    ctx.fill();
                }

                // Brass finial spike
                ctx.fillStyle = '#f1c40f';
                ctx.fillRect(-1, canopyY - 14, 2, 5);
                break;
            }

            case 'chalkboard_sign': {
                // Drop shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ctx.beginPath();
                ctx.ellipse(0, 0, 11, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                // A-frame wooden legs
                ctx.fillStyle = '#5d4037';
                ctx.beginPath();
                ctx.moveTo(0, -22);
                ctx.lineTo(-9, 0);
                ctx.lineTo(-7, 0);
                ctx.lineTo(0, -20);
                ctx.lineTo(7, 0);
                ctx.lineTo(9, 0);
                ctx.closePath();
                ctx.fill();

                // Chalkboard panel
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(-7, -19, 14, 15);
                ctx.strokeStyle = '#8d6e63';
                ctx.lineWidth = 1;
                ctx.strokeRect(-7, -19, 14, 15);

                // Chalk text & icon
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 5px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('COFFEE', 0, -13);
                ctx.fillStyle = '#facc15';
                ctx.fillText('$2.50 ☕', 0, -6);
                ctx.textAlign = 'left';
                break;
            }

            case 'flower_planter': {
                // Drop shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ctx.beginPath();
                ctx.ellipse(0, 0, 16, 5, 0, 0, Math.PI * 2);
                ctx.fill();

                // Terracotta planter box
                ctx.fillStyle = '#b45309';
                ctx.fillRect(-15, -12, 30, 12);
                ctx.fillStyle = '#d97706';
                ctx.fillRect(-16, -14, 32, 3); // top rim
                ctx.fillStyle = '#78350f';
                ctx.fillRect(-14, -1, 28, 1); // bottom shadow

                // Lush green foliage
                ctx.fillStyle = '#15803d';
                ctx.beginPath();
                ctx.arc(-8, -15, 6, 0, Math.PI * 2);
                ctx.arc(0, -17, 7, 0, Math.PI * 2);
                ctx.arc(8, -15, 6, 0, Math.PI * 2);
                ctx.fill();

                // Blooming Flowers (red, yellow, pink)
                const flowerCols = ['#ef4444', '#facc15', '#ec4899', '#38bdf8'];
                [[-7, -16, 0], [-2, -18, 1], [3, -15, 2], [7, -17, 3], [0, -13, 0]].forEach(([fx, fy, ci]) => {
                    ctx.fillStyle = flowerCols[ci];
                    ctx.fillRect(fx, fy, 2.5, 2.5);
                });
                break;
            }

            case 'park_bench': {
                // Drop shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ctx.beginPath();
                ctx.ellipse(0, 0, 18, 6, 0, 0, Math.PI * 2);
                ctx.fill();

                // Cast-iron dark green/black frame
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(-16, -12, 3, 12);
                ctx.fillRect(13, -12, 3, 12);

                // Wooden oak slats
                const slatCol = '#a16207';
                const slatColDark = '#713f12';
                // Backrest slats
                ctx.fillStyle = slatCol;
                ctx.fillRect(-17, -18, 34, 3);
                ctx.fillRect(-17, -14, 34, 3);
                // Seat slats
                ctx.fillStyle = slatColDark;
                ctx.fillRect(-17, -9, 34, 3);
                ctx.fillRect(-16, -6, 32, 2.5);

                // Armrests
                ctx.strokeStyle = '#1e293b';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-16, -14);
                ctx.lineTo(-16, -8);
                ctx.moveTo(15, -14);
                ctx.lineTo(15, -8);
                ctx.stroke();
                break;
            }

            case 'street_lamp': {
                // Drop shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ctx.beginPath();
                ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                // Cast-iron base
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(-4, -4, 8, 4);
                ctx.fillRect(-2, -44, 4, 40); // post

                // Ladder bar / cross bracket
                ctx.fillRect(-7, -36, 14, 2);

                // Lantern head housing
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(-5, -50, 10, 6);
                ctx.fillRect(-6, -52, 12, 2); // lantern cap
                ctx.fillRect(-1, -54, 2, 2);  // finial

                // Glowing Glass Lantern
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(-4, -48, 8, 4);
                // Soft golden glow
                ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
                ctx.beginPath();
                ctx.arc(0, -46, 14, 0, Math.PI * 2);
                ctx.fill();
                break;
            }

            case 'coffee_sacks': {
                // Drop shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
                ctx.beginPath();
                ctx.ellipse(0, 0, 14, 6, 0, 0, Math.PI * 2);
                ctx.fill();

                // Wooden cargo crate on bottom right
                ctx.fillStyle = '#854d0e';
                ctx.fillRect(0, -14, 14, 14);
                ctx.strokeStyle = '#a16207';
                ctx.lineWidth = 1;
                ctx.strokeRect(0, -14, 14, 14);
                // Crate cross-brace
                ctx.beginPath();
                ctx.moveTo(0, -14);
                ctx.lineTo(14, 0);
                ctx.stroke();

                // Burlap Sack 1 (bottom left)
                ctx.fillStyle = '#b45309';
                ctx.beginPath();
                ctx.ellipse(-7, -7, 8, 7, -0.15, 0, Math.PI * 2);
                ctx.fill();
                // Burlap tie rope
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(-9, -13, 4, 2);

                // Burlap Sack 2 (stacked on top)
                ctx.fillStyle = '#d97706';
                ctx.beginPath();
                ctx.ellipse(-2, -16, 7, 6, 0.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(-4, -21, 4, 2);

                // Coffee bean stamp
                ctx.fillStyle = '#451a03';
                ctx.font = 'bold 5px monospace';
                ctx.fillText('☕', -5, -6);
                break;
            }

            case 'neon_open_sign': {
                // Drop shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ctx.beginPath();
                ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                // Wood post
                ctx.fillStyle = '#5d4037';
                ctx.fillRect(-1.5, -28, 3, 28);

                // Sign backing board
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(-11, -30, 22, 12);
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 1;
                ctx.strokeRect(-11, -30, 22, 12);

                // Glowing Neon "OPEN"
                ctx.fillStyle = '#00f0ff';
                ctx.font = 'bold 6.5px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('OPEN', 0, -22);
                ctx.textAlign = 'left';
                break;
            }

            case 'retro_trash_bin': {
                // Drop shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ctx.beginPath();
                ctx.ellipse(0, 0, 7, 3.5, 0, 0, Math.PI * 2);
                ctx.fill();

                // Green metal cylinder
                ctx.fillStyle = '#15803d';
                ctx.fillRect(-6, -16, 12, 16);
                ctx.fillStyle = '#166534';
                ctx.fillRect(-5, -15, 3, 15); // shading
                // Metal lid & rim
                ctx.fillStyle = '#94a3b8';
                ctx.fillRect(-7, -18, 14, 3);
                // Recycle symbol
                ctx.fillStyle = '#ffffff';
                ctx.font = '5px monospace';
                ctx.fillText('♻', -3, -6);
                break;
            }

            case 'custom_image': {
                // Renders custom user uploaded image
                if (prop.customImageSrc) {
                    if (!this._customImageCache) this._customImageCache = {};
                    let img = this._customImageCache[prop.customImageSrc];
                    if (!img && typeof Image !== 'undefined') {
                        img = new Image();
                        img.src = prop.customImageSrc;
                        this._customImageCache[prop.customImageSrc] = img;
                    }
                    if (img && (img.naturalWidth > 0 || img.width > 0)) {
                        const iw = img.naturalWidth || img.width;
                        const ih = img.naturalHeight || img.height;
                        const targetW = prop.width || 32;
                        const targetH = Math.round(targetW * (ih / iw));
                        ctx.drawImage(img, -Math.round(targetW / 2), -targetH, targetW, targetH);
                        break;
                    }
                }
                // Fallback placeholder box
                ctx.fillStyle = '#6366f1';
                ctx.fillRect(-14, -28, 28, 28);
                ctx.strokeStyle = '#a5b4fc';
                ctx.lineWidth = 1;
                ctx.strokeRect(-14, -28, 28, 28);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 7px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('ASSET', 0, -12);
                ctx.textAlign = 'left';
                break;
            }

            default: {
                // Generic decorative prop fallback
                ctx.fillStyle = '#e2e8f0';
                ctx.fillRect(-8, -16, 16, 16);
                break;
            }
        }

        ctx.restore();
    }
}

// -------------------------------------------------------------
// PROP ASSET CATALOG
// -------------------------------------------------------------
const PROP_CATALOG = {
    cafe_table: { name: 'Bistro Cafe Table', icon: '🪑', defaultWidth: 28, defaultHeight: 24, desc: 'Wooden cafe table with espresso cups' },
    umbrella_table: { name: 'Patio Parasol Table', icon: '⛱️', defaultWidth: 44, defaultHeight: 52, desc: 'Cafe table with shaded striped parasol' },
    chalkboard_sign: { name: 'Chalkboard Menu Sign', icon: '📋', defaultWidth: 20, defaultHeight: 26, desc: 'Sidewalk A-frame chalkboard sign' },
    flower_planter: { name: 'Flower Planter Box', icon: '🌿', defaultWidth: 32, defaultHeight: 20, desc: 'Terracotta planter with blooming flowers' },
    park_bench: { name: 'Park Wooden Bench', icon: '🪑', defaultWidth: 36, defaultHeight: 22, desc: 'Classic cast-iron & oak park bench' },
    street_lamp: { name: 'Vintage Street Lamp', icon: '🏮', defaultWidth: 16, defaultHeight: 54, desc: 'Victorian gaslight with warm lantern' },
    coffee_sacks: { name: 'Coffee Bean Sacks', icon: '☕', defaultWidth: 28, defaultHeight: 22, desc: 'Burlap sacks of green beans & crate' },
    neon_open_sign: { name: 'Neon Cafe Signpost', icon: '🪧', defaultWidth: 22, defaultHeight: 32, desc: 'Glowing neon retro signpost' },
    retro_trash_bin: { name: 'Street Recycling Bin', icon: '🗑️', defaultWidth: 14, defaultHeight: 20, desc: 'Classic street corner recycling bin' },
    custom_image: { name: 'Custom Uploaded Asset', icon: '🖼️', defaultWidth: 32, defaultHeight: 32, desc: 'Custom sprite uploaded by Master Zay' }
};

if (typeof window !== 'undefined') {
    window.PROP_CATALOG = PROP_CATALOG;
}

// Global instance binding for browser & headless test compatibility
if (typeof window !== 'undefined') {
    window.spriteRenderer = new SpriteRenderer();
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SpriteRenderer };
}
