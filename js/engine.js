// Coffede Tycoon - Daytime Simulation Engine, Pedestrian AI & Canvas Loop

// -------------------------------------------------------------
// PER-LOCATION STAND CONFIGURATIONS & QUEUE TRAJECTORIES
// -------------------------------------------------------------
const STAND_CONFIGS = {
    // Tier 1: Starter
    cul_de_sac: {
        stand: { x: 230, y: 180 },
        counter: { x: 247, y: 192 },
        queueStart: { x: 260, y: 200 },
        queueStep: { x: 28, y: 15 },
        decisionDist: 36
    },
    community_garden: {
        stand: { x: 235, y: 182 },
        counter: { x: 252, y: 194 },
        queueStart: { x: 265, y: 202 },
        queueStep: { x: 28, y: 15 },
        decisionDist: 36
    },
    public_library: {
        stand: { x: 240, y: 180 },
        counter: { x: 257, y: 192 },
        queueStart: { x: 270, y: 200 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },
    suburbs: {
        stand: { x: 235, y: 180 },
        counter: { x: 252, y: 192 },
        queueStart: { x: 265, y: 200 },
        queueStep: { x: 30, y: 15 },
        decisionDist: 36
    },

    // Tier 2: Charming
    lake_marina: {
        stand: { x: 240, y: 185 },
        counter: { x: 257, y: 196 },
        queueStart: { x: 270, y: 205 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },
    campsite: {
        stand: { x: 235, y: 180 },
        counter: { x: 252, y: 192 },
        queueStart: { x: 265, y: 200 },
        queueStep: { x: 28, y: 15 },
        decisionDist: 36
    },
    farmers_market: {
        stand: { x: 245, y: 182 },
        counter: { x: 262, y: 194 },
        queueStart: { x: 275, y: 202 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },
    park: {
        stand: { x: 250, y: 185 },
        counter: { x: 267, y: 196 },
        queueStart: { x: 280, y: 205 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },

    // Tier 3: High-Traffic
    beach_boardwalk: {
        stand: { x: 240, y: 185 },
        counter: { x: 257, y: 196 },
        queueStart: { x: 270, y: 205 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },
    construction_site: {
        stand: { x: 235, y: 180 },
        counter: { x: 252, y: 192 },
        queueStart: { x: 265, y: 200 },
        queueStep: { x: 28, y: 15 },
        decisionDist: 36
    },
    art_district: {
        stand: { x: 245, y: 185 },
        counter: { x: 262, y: 196 },
        queueStart: { x: 275, y: 205 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },
    campus: {
        stand: { x: 240, y: 180 },
        counter: { x: 257, y: 192 },
        queueStart: { x: 270, y: 200 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },

    // Tier 4: Bustling
    amusement_pier: {
        stand: { x: 245, y: 185 },
        counter: { x: 262, y: 196 },
        queueStart: { x: 275, y: 205 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },
    sports_complex: {
        stand: { x: 240, y: 185 },
        counter: { x: 257, y: 196 },
        queueStart: { x: 270, y: 205 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },
    shopping_mall: {
        stand: { x: 245, y: 185 },
        counter: { x: 262, y: 196 },
        queueStart: { x: 275, y: 205 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },
    hospital_plaza: {
        stand: { x: 240, y: 180 },
        counter: { x: 257, y: 192 },
        queueStart: { x: 270, y: 200 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },

    // Tier 5: Megacity Peak
    metro: {
        stand: { x: 230, y: 190 },
        counter: { x: 247, y: 202 },
        queueStart: { x: 260, y: 210 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },
    convention_center: {
        stand: { x: 245, y: 185 },
        counter: { x: 262, y: 196 },
        queueStart: { x: 275, y: 205 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },
    downtown: {
        stand: { x: 245, y: 185 },
        counter: { x: 262, y: 196 },
        queueStart: { x: 275, y: 205 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    },
    airport_terminal: {
        stand: { x: 240, y: 185 },
        counter: { x: 257, y: 196 },
        queueStart: { x: 270, y: 205 },
        queueStep: { x: 28, y: 16 },
        decisionDist: 36
    }
};

const DEFAULT_STAND_CONFIGS = JSON.parse(JSON.stringify(STAND_CONFIGS));

if (typeof window !== 'undefined') {
    window.STAND_CONFIGS = STAND_CONFIGS;
    window.DEFAULT_STAND_CONFIGS = DEFAULT_STAND_CONFIGS;
}

// -------------------------------------------------------------
// BESPOKE PEDESTRIAN PATHS & WAYPOINTS PER LOCATION (20 LOCATIONS)
// -------------------------------------------------------------
const LOCATION_PATHS = {
    // 1. Quiet Cul-de-Sac
    cul_de_sac: [
        [ { x: -60, y: 235 }, { x: 100, y: 230 }, { x: 235, y: 222 }, { x: 360, y: 226 }, { x: 490, y: 234 }, { x: 700, y: 242 } ],
        [ { x: -60, y: 250 }, { x: 120, y: 242 }, { x: 250, y: 230 }, { x: 370, y: 225 }, { x: 500, y: 220 }, { x: 700, y: 216 } ]
    ],

    // 2. Community Garden
    community_garden: [
        [ { x: -60, y: 238 }, { x: 110, y: 232 }, { x: 240, y: 225 }, { x: 365, y: 228 }, { x: 485, y: 236 }, { x: 700, y: 245 } ],
        [ { x: -60, y: 255 }, { x: 125, y: 245 }, { x: 255, y: 232 }, { x: 380, y: 225 }, { x: 510, y: 222 }, { x: 700, y: 220 } ]
    ],

    // 3. Town Public Library
    public_library: [
        [ { x: -60, y: 235 }, { x: 105, y: 230 }, { x: 238, y: 222 }, { x: 360, y: 224 }, { x: 485, y: 232 }, { x: 700, y: 242 } ],
        [ { x: -60, y: 250 }, { x: 120, y: 242 }, { x: 250, y: 230 }, { x: 375, y: 224 }, { x: 500, y: 220 }, { x: 700, y: 216 } ]
    ],

    // 4. Greenwood Suburbs (Preserved exact original coordinates)
    suburbs: [
        [ { x: -60, y: 236 }, { x: 100, y: 228 }, { x: 235, y: 220 }, { x: 360, y: 224 }, { x: 480, y: 232 }, { x: 700, y: 242 } ],
        [ { x: -60, y: 252 }, { x: 120, y: 240 }, { x: 255, y: 228 }, { x: 380, y: 222 }, { x: 500, y: 218 }, { x: 700, y: 214 } ]
    ],

    // 5. Lakefront Marina
    lake_marina: [
        [ { x: -60, y: 240 }, { x: 110, y: 235 }, { x: 240, y: 228 }, { x: 365, y: 226 }, { x: 485, y: 234 }, { x: 700, y: 244 } ],
        [ { x: -60, y: 255 }, { x: 125, y: 246 }, { x: 255, y: 234 }, { x: 380, y: 228 }, { x: 510, y: 224 }, { x: 700, y: 222 } ]
    ],

    // 6. Pine Forest Campsite
    campsite: [
        [ { x: -60, y: 235 }, { x: 105, y: 230 }, { x: 235, y: 224 }, { x: 360, y: 225 }, { x: 485, y: 232 }, { x: 700, y: 242 } ],
        [ { x: -60, y: 250 }, { x: 120, y: 242 }, { x: 250, y: 230 }, { x: 375, y: 222 }, { x: 500, y: 218 }, { x: 700, y: 215 } ]
    ],

    // 7. Village Farmers Market
    farmers_market: [
        [ { x: -60, y: 238 }, { x: 110, y: 232 }, { x: 242, y: 226 }, { x: 365, y: 226 }, { x: 485, y: 234 }, { x: 700, y: 245 } ],
        [ { x: -60, y: 254 }, { x: 125, y: 245 }, { x: 255, y: 234 }, { x: 380, y: 226 }, { x: 510, y: 222 }, { x: 700, y: 220 } ]
    ],

    // 8. Central City Park (Preserved exact original coordinates)
    park: [
        [ { x: -60, y: 265 }, { x: 80, y: 248 }, { x: 180, y: 232 }, { x: 280, y: 222 }, { x: 380, y: 230 }, { x: 480, y: 242 }, { x: 580, y: 252 }, { x: 700, y: 262 } ],
        [ { x: -60, y: 275 }, { x: 110, y: 258 }, { x: 230, y: 244 }, { x: 350, y: 238 }, { x: 460, y: 236 }, { x: 560, y: 238 }, { x: 700, y: 242 } ],
        [ { x: -60, y: 245 }, { x: 120, y: 232 }, { x: 250, y: 224 }, { x: 370, y: 220 }, { x: 480, y: 226 }, { x: 580, y: 236 }, { x: 700, y: 248 } ]
    ],

    // 9. Sunny Beach Boardwalk
    beach_boardwalk: [
        [ { x: -60, y: 240 }, { x: 110, y: 235 }, { x: 240, y: 228 }, { x: 365, y: 225 }, { x: 485, y: 232 }, { x: 700, y: 242 } ],
        [ { x: -60, y: 255 }, { x: 125, y: 246 }, { x: 255, y: 235 }, { x: 380, y: 228 }, { x: 510, y: 224 }, { x: 700, y: 220 } ]
    ],

    // 10. Downtown Construction Site
    construction_site: [
        [ { x: -60, y: 236 }, { x: 105, y: 230 }, { x: 235, y: 224 }, { x: 360, y: 225 }, { x: 485, y: 232 }, { x: 700, y: 242 } ],
        [ { x: -60, y: 252 }, { x: 120, y: 242 }, { x: 250, y: 230 }, { x: 375, y: 222 }, { x: 500, y: 218 }, { x: 700, y: 215 } ]
    ],

    // 11. Bohemian Art District
    art_district: [
        [ { x: -60, y: 240 }, { x: 110, y: 234 }, { x: 242, y: 226 }, { x: 365, y: 225 }, { x: 485, y: 232 }, { x: 700, y: 242 } ],
        [ { x: -60, y: 255 }, { x: 125, y: 245 }, { x: 255, y: 234 }, { x: 380, y: 226 }, { x: 510, y: 222 }, { x: 700, y: 218 } ]
    ],

    // 12. Tech University Campus (Preserved exact original coordinates)
    campus: [
        [ { x: -60, y: 265 }, { x: 90, y: 248 }, { x: 210, y: 232 }, { x: 300, y: 220 }, { x: 410, y: 216 }, { x: 520, y: 228 }, { x: 700, y: 242 } ],
        [ { x: -60, y: 235 }, { x: 115, y: 228 }, { x: 230, y: 224 }, { x: 335, y: 230 }, { x: 445, y: 242 }, { x: 555, y: 254 }, { x: 700, y: 264 } ],
        [ { x: -60, y: 252 }, { x: 135, y: 238 }, { x: 260, y: 224 }, { x: 365, y: 218 }, { x: 475, y: 214 }, { x: 585, y: 220 }, { x: 700, y: 232 } ]
    ],

    // 13. Amusement Boardwalk Pier
    amusement_pier: [
        [ { x: -60, y: 242 }, { x: 110, y: 236 }, { x: 242, y: 228 }, { x: 365, y: 226 }, { x: 485, y: 234 }, { x: 700, y: 245 } ],
        [ { x: -60, y: 258 }, { x: 125, y: 248 }, { x: 255, y: 236 }, { x: 380, y: 228 }, { x: 510, y: 224 }, { x: 700, y: 222 } ]
    ],

    // 14. City Sports Complex
    sports_complex: [
        [ { x: -60, y: 240 }, { x: 110, y: 235 }, { x: 240, y: 228 }, { x: 365, y: 225 }, { x: 485, y: 232 }, { x: 700, y: 242 } ],
        [ { x: -60, y: 255 }, { x: 125, y: 245 }, { x: 255, y: 234 }, { x: 380, y: 226 }, { x: 510, y: 222 }, { x: 700, y: 218 } ]
    ],

    // 15. Grand Galleria Shopping Mall
    shopping_mall: [
        [ { x: -60, y: 240 }, { x: 110, y: 235 }, { x: 242, y: 228 }, { x: 365, y: 226 }, { x: 485, y: 234 }, { x: 700, y: 244 } ],
        [ { x: -60, y: 255 }, { x: 125, y: 246 }, { x: 255, y: 235 }, { x: 380, y: 228 }, { x: 510, y: 224 }, { x: 700, y: 220 } ]
    ],

    // 16. Metro Medical Center
    hospital_plaza: [
        [ { x: -60, y: 236 }, { x: 105, y: 230 }, { x: 238, y: 224 }, { x: 360, y: 225 }, { x: 485, y: 232 }, { x: 700, y: 242 } ],
        [ { x: -60, y: 252 }, { x: 120, y: 242 }, { x: 250, y: 230 }, { x: 375, y: 222 }, { x: 500, y: 218 }, { x: 700, y: 215 } ]
    ],

    // 17. Grand Central Metro (Preserved exact original coordinates)
    metro: [
        [ { x: -60, y: 236 }, { x: 110, y: 232 }, { x: 220, y: 228 }, { x: 340, y: 225 }, { x: 470, y: 225 }, { x: 570, y: 235 }, { x: 700, y: 248 } ],
        [ { x: -60, y: 248 }, { x: 110, y: 244 }, { x: 215, y: 240 }, { x: 320, y: 238 }, { x: 430, y: 242 }, { x: 535, y: 248 }, { x: 700, y: 258 } ],
        [ { x: -60, y: 260 }, { x: 110, y: 254 }, { x: 220, y: 248 }, { x: 330, y: 252 }, { x: 440, y: 260 }, { x: 550, y: 262 }, { x: 700, y: 268 } ]
    ],

    // 18. Convention & Expo Center
    convention_center: [
        [ { x: -60, y: 242 }, { x: 110, y: 235 }, { x: 242, y: 228 }, { x: 365, y: 225 }, { x: 485, y: 232 }, { x: 700, y: 244 } ],
        [ { x: -60, y: 258 }, { x: 125, y: 246 }, { x: 255, y: 234 }, { x: 380, y: 226 }, { x: 510, y: 222 }, { x: 700, y: 220 } ]
    ],

    // 19. Wall St. & Crypto Plaza (Preserved exact original coordinates)
    downtown: [
        [ { x: -60, y: 248 }, { x: 105, y: 238 }, { x: 230, y: 228 }, { x: 340, y: 224 }, { x: 450, y: 228 }, { x: 555, y: 238 }, { x: 700, y: 248 } ],
        [ { x: -60, y: 260 }, { x: 115, y: 250 }, { x: 235, y: 240 }, { x: 345, y: 234 }, { x: 455, y: 230 }, { x: 555, y: 226 }, { x: 700, y: 224 } ],
        [ { x: -60, y: 232 }, { x: 100, y: 228 }, { x: 215, y: 224 }, { x: 325, y: 224 }, { x: 435, y: 230 }, { x: 545, y: 238 }, { x: 700, y: 246 } ]
    ],

    // 20. International Airport Terminal
    airport_terminal: [
        [ { x: -60, y: 240 }, { x: 110, y: 235 }, { x: 240, y: 228 }, { x: 365, y: 226 }, { x: 485, y: 234 }, { x: 700, y: 245 } ],
        [ { x: -60, y: 255 }, { x: 125, y: 246 }, { x: 255, y: 235 }, { x: 380, y: 228 }, { x: 510, y: 224 }, { x: 700, y: 220 } ]
    ]
};

const DEFAULT_LOCATION_PATHS = JSON.parse(JSON.stringify(LOCATION_PATHS));

const LOCATION_SPAWN_DIRECTIONS = {
    cul_de_sac: ['both', 'both'],
    community_garden: ['both', 'both'],
    public_library: ['both', 'both'],
    suburbs: ['both', 'both'],
    lake_marina: ['both', 'both'],
    campsite: ['both', 'both'],
    farmers_market: ['both', 'both'],
    park: ['both', 'both', 'both'],
    beach_boardwalk: ['both', 'both'],
    construction_site: ['both', 'both'],
    art_district: ['both', 'both'],
    campus: ['both', 'both', 'both'],
    amusement_pier: ['both', 'both'],
    sports_complex: ['both', 'both'],
    shopping_mall: ['both', 'both'],
    hospital_plaza: ['both', 'both'],
    metro: ['both', 'both', 'both'],
    convention_center: ['both', 'both'],
    downtown: ['both', 'both', 'both'],
    airport_terminal: ['both', 'both']
};

const DEFAULT_LOCATION_SPAWN_DIRECTIONS = JSON.parse(JSON.stringify(LOCATION_SPAWN_DIRECTIONS));

if (typeof window !== 'undefined') {
    window.STAND_CONFIGS = STAND_CONFIGS;
    window.DEFAULT_STAND_CONFIGS = DEFAULT_STAND_CONFIGS;
    window.LOCATION_PATHS = LOCATION_PATHS;
    window.DEFAULT_LOCATION_PATHS = DEFAULT_LOCATION_PATHS;
    window.LOCATION_SPAWN_DIRECTIONS = LOCATION_SPAWN_DIRECTIONS;
    window.DEFAULT_LOCATION_SPAWN_DIRECTIONS = DEFAULT_LOCATION_SPAWN_DIRECTIONS;
}

// Helper to load and apply custom map configurations saved by the Map Editor
function applySavedMapConfigs() {
    if (typeof localStorage === 'undefined') return;
    try {
        const saved = localStorage.getItem('coffede_map_config');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.standConfigs && typeof parsed.standConfigs === 'object') {
                Object.keys(parsed.standConfigs).forEach(loc => {
                    const cfg = parsed.standConfigs[loc];
                    if (cfg && cfg.stand && cfg.counter && cfg.queueStart && cfg.queueStep) {
                        STAND_CONFIGS[loc] = cfg;
                    }
                });
            }
            if (parsed.locationPaths && typeof parsed.locationPaths === 'object') {
                Object.keys(parsed.locationPaths).forEach(loc => {
                    const paths = parsed.locationPaths[loc];
                    if (Array.isArray(paths) && paths.length > 0) {
                        LOCATION_PATHS[loc] = paths;
                    }
                });
            }
            if (parsed.spawnDirections && typeof parsed.spawnDirections === 'object') {
                Object.assign(LOCATION_SPAWN_DIRECTIONS, parsed.spawnDirections);
                if (typeof window !== 'undefined') {
                    window.LOCATION_SPAWN_DIRECTIONS = LOCATION_SPAWN_DIRECTIONS;
                }
            }
            if (typeof parsed.cartWidth === 'number' && typeof window !== 'undefined' && window.spriteRenderer) {
                window.spriteRenderer.cartWidth = parsed.cartWidth;
            }
            if (typeof parsed.npcHeight === 'number' && typeof window !== 'undefined' && window.spriteRenderer) {
                window.spriteRenderer.npcHeight = parsed.npcHeight;
            }
        }
    } catch (e) {
        console.warn('Could not load saved map config:', e);
    }
}

if (typeof window !== 'undefined') {
    window.applySavedMapConfigs = applySavedMapConfigs;
}

class SimulationEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.isPaused = false;
        this.speed = 1; // 1x, 2x, 5x

        // Time simulation
        // In-game day: 8:00 AM (480 min) to 6:00 PM (1080 min) = 600 minutes total
        this.dayStartMinute = 480;
        this.dayEndMinute = 1080;
        this.currentMinute = 480;
        this.secondsPerDay = 55; // 55 seconds real-time at 1x speed

        // Pedestrians & Queue
        this.customers = [];
        this.queue = [];
        this.maxQueueSize = 10; // queue capacity (up to 10 people in line)
        this.spawnTimer = 0;
        this.pedestrianCountToday = 0;

        // Barista Service State
        this.isBrewing = false; // Fresh batch brewing state
        this.isPouring = false; // Pouring cup from carafe
        this.serviceProgress = 0;
        this.serviceDuration = 0;
        this.currentServingCustomer = null;
        this.counterVacateTimer = 0;

        // Dynamic Stand Position resolution (Per-location & override support)
        this._overrideStandX = undefined;
        this._overrideStandY = undefined;

        // Bound callbacks
        this.onDayTick = null;
        this.onDayComplete = null;
        this.lastTime = 0;
    }

    getStandConfig() {
        const loc = this.location || (window.simulationModel && window.simulationModel.currentLocation) || 'suburbs';
        const allStands = (typeof window !== 'undefined' && window.STAND_CONFIGS) ? window.STAND_CONFIGS : STAND_CONFIGS;
        const cfg = allStands[loc] || allStands.suburbs || STAND_CONFIGS.suburbs;
        const sx = this._overrideStandX !== undefined ? this._overrideStandX : cfg.stand.x;
        const sy = this._overrideStandY !== undefined ? this._overrideStandY : cfg.stand.y;
        const dx = sx - cfg.stand.x;
        const dy = sy - cfg.stand.y;

        // Custom individual queue spots (default 10 spots in line, or preserve custom map editor spots)
        let spots = cfg.queueSpots;
        if (!Array.isArray(spots) || spots.length === 0) {
            spots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => ({
                x: cfg.queueStart.x + i * cfg.queueStep.x,
                y: i < 5
                    ? cfg.queueStart.y + i * cfg.queueStep.y
                    : Math.min(342, cfg.queueStart.y + 4 * cfg.queueStep.y + (i - 4) * Math.round(cfg.queueStep.y * 0.7))
            }));
            cfg.queueSpots = spots;
        }

        return {
            x: sx,
            y: sy,
            counter: { x: cfg.counter.x + dx, y: cfg.counter.y + dy },
            queueStart: { x: spots[0].x + dx, y: spots[0].y + dy },
            queueStep: cfg.queueStep,
            queueSpots: spots.map(pt => ({ x: pt.x + dx, y: pt.y + dy })),
            queueSpot: (spot) => {
                const sIdx = Math.max(0, spot);
                if (sIdx < spots.length) {
                    return {
                        x: spots[sIdx].x + dx,
                        y: spots[sIdx].y + dy
                    };
                }
                const last = spots[spots.length - 1];
                const extra = sIdx - spots.length; // 0 for spot 10, 1 for spot 11, etc.
                if (extra < 4) {
                    return {
                        x: Math.min(618, last.x + (extra + 1) * 18) + dx,
                        y: Math.min(342, last.y + (extra + 1) * 3) + dy
                    };
                }
                // Snake back into neatly spaced parallel queue rows on the sidewalk so no two spots overlap
                const snakeIdx = extra - 4;
                const row = Math.floor(snakeIdx / 6);
                const col = snakeIdx % 6;
                const xOffset = 26 - col * 22 - (row % 2) * 11;
                const xPos = Math.max(24, Math.min(618, last.x + xOffset));
                const yPos = Math.max(120, Math.min(347, last.y + 4 + row * 6 + (col % 2) * 2));
                return {
                    x: xPos + dx,
                    y: yPos + dy
                };
            },
            props: Array.isArray(cfg.props) ? cfg.props : [],
            cartSkin: cfg.cartSkin || 'default',
            decisionDist: cfg.decisionDist
        };
    }

    get standX() {
        if (this._overrideStandX !== undefined) return this._overrideStandX;
        return this.getStandConfig().x;
    }
    set standX(val) {
        this._overrideStandX = val;
    }

    get standY() {
        if (this._overrideStandY !== undefined) return this._overrideStandY;
        return this.getStandConfig().y;
    }
    set standY(val) {
        this._overrideStandY = val;
    }

    queueSpot(spot) {
        return this.getStandConfig().queueSpot(spot);
    }

    getQueueSpotCoords(spot) {
        return this.queueSpot(spot);
    }

    getMaxQueueSize() {
        const base = (typeof this.maxQueueSize === 'number' && this.maxQueueSize > 0) ? this.maxQueueSize : 10;
        const sim = window.simulationModel;
        if (!sim || typeof sim.getQueueCapacityBonus !== 'function') return base;
        return base + sim.getQueueCapacityBonus();
    }

    getCounterVacateDelay() {
        const sim = window.simulationModel;
        const speedMult = (sim && typeof sim.getTotalServiceSpeedMultiplier === 'function')
            ? sim.getTotalServiceSpeedMultiplier()
            : 1.0;
        const hasCounterStaff = Boolean(sim && sim.hiredStaff && (sim.hiredStaff.cashier || sim.hiredStaff.barista));
        if (hasCounterStaff) {
            return 0.02;
        }
        if (speedMult > 1.01) {
            return Math.max(0.03, 0.18 / speedMult);
        }
        return 0.35;
    }

    resumeWaypointPath(customer) {
        if (!customer.waypoints || customer.waypoints.length === 0) return;
        const dir = customer.origDirection || customer.direction || 1;
        let bestIdx = -1;
        for (let i = 0; i < customer.waypoints.length; i++) {
            const wp = customer.waypoints[i];
            if ((wp.x - customer.x) * dir > 5) {
                bestIdx = i;
                break;
            }
        }
        if (bestIdx === -1) {
            const cur = typeof customer.wpIndex === 'number' ? customer.wpIndex : 0;
            if (cur < customer.waypoints.length) {
                bestIdx = cur;
            } else {
                bestIdx = customer.waypoints.length;
                customer.isDespawned = true;
            }
        }
        customer.wpIndex = bestIdx;
    }

    init(canvas) {
        applySavedMapConfigs();
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        if (this.ctx) {
            this.ctx.imageSmoothingEnabled = false;
        }

        // Handle canvas sizing (2x HD Super-Sampling)
        const dpr = (typeof window !== 'undefined' && window.devicePixelRatio && window.devicePixelRatio >= 1.5) ? 2 : 2;
        this.dpr = (typeof window !== 'undefined' && window.document) ? dpr : 1;
        this.width = 640;
        this.height = 360;
        if (canvas && typeof window !== 'undefined' && window.document) {
            canvas.width = 640 * this.dpr;
            canvas.height = 360 * this.dpr;
        }
        if (this.ctx) {
            this.ctx.imageSmoothingEnabled = false;
        }
        this.startLoop();
    }

    startDay() {
        this.currentMinute = this.dayStartMinute;
        this.isRunning = true;
        this.isPaused = false;
        this.customers = [];
        this.queue = [];
        this.pedestrianCountToday = 0;
        this.spawnTimer = 0;
        this.isBrewing = false;
        this.isPouring = false;
        this.serviceProgress = 0;
        this.serviceDuration = 0;
        this.counterVacateTimer = 0;
        this.currentServingCustomer = null;
        this._overrideStandX = undefined;
        this._overrideStandY = undefined;

        // Reset any leftover reservations
        if (window.simulationModel) {
            window.simulationModel.resetReservedStock();
        }

        // Apply and deduct daily marketing budget
        if (window.simulationModel && typeof window.simulationModel.applyDailyMarketingBudget === 'function') {
            window.simulationModel.applyDailyMarketingBudget();
        }

        // Calculate expected pedestrian traffic for today
        const sim = window.simulationModel;
        const loc = sim.getLocations()[sim.currentLocation];
        const mktItem = (sim.getUpgradeItem ? sim.getUpgradeItem('marketing') : sim.getUpgrades().marketing[sim.upgrades.marketing - 1]);
        const marketingUpgradeBonus = mktItem ? (mktItem.trafficBonus || 0) : 0;
        const budgetBonus = (sim.getMarketingTrafficBonus ? sim.getMarketingTrafficBonus() : 0);
        const staffTrafficBonus = (sim.getStaffPerks ? sim.getStaffPerks().trafficBonus : 0);

        // Pre-brew initial batch when staff or commercial dual-boiler/multi-group machine is active
        if (sim && typeof sim.preBrewCarafe === 'function') {
            const hasPreBrew = Boolean((sim.hiredStaff && (sim.hiredStaff.barista || sim.hiredStaff.cashier)) || (sim.upgrades && sim.upgrades.machine >= 3));
            if (hasPreBrew && sim.cupsInBatch <= 0) {
                sim.preBrewCarafe();
            }
        }

        let weatherMod = 1.0;
        const weather = sim.weather.type;
        if (weather === 'rainy') weatherMod = loc.rainTrafficMod;
        else if (weather === 'sunny' || weather === 'scorching') weatherMod = loc.sunTrafficMod;

        // Canopy Weather Mitigation (ShadeMaker 3000 & All-Weather Awning)
        if (sim.upgrades && sim.upgrades.canopy >= 2) {
            const canopyUpg = sim.getUpgradeItem ? sim.getUpgradeItem('canopy') : sim.getUpgrades().canopy[sim.upgrades.canopy - 1];
            if (canopyUpg && (weather === 'rainy' || weather === 'scorching' || weather === 'freezing')) {
                const rainBonus = canopyUpg.rainProtection || 0.25;
                weatherMod = Math.min(1.4, weatherMod * (1 + rainBonus));
            }
        }

        let totalExpected = (loc.baseFootTraffic + (Math.random() - 0.5) * loc.trafficVariance) * (1 + (marketingUpgradeBonus + budgetBonus + staffTrafficBonus) / 100) * weatherMod;

        // Popularity & Satisfaction multiplier (Lemonade Tycoon dynamics:
        // New or unknown stands start quieter, while popular/loved stands draw bustling crowds!)
        const pop = sim.getLocationPopularity(sim.currentLocation);
        const sat = sim.getLocationSatisfaction(sim.currentLocation);
        const popMult = 0.50 + (pop / 100) * 1.0; // 30% -> 0.8x, 100% -> 1.5x
        const satMult = 0.70 + (sat / 100) * 0.45; // 60% -> 0.97x, 100% -> 1.15x
        totalExpected = totalExpected * popMult * satMult;

        // /boost multiplier (Hyper-Flow Campaign: +90% traffic surge)
        if (window.web3Manager && window.web3Manager.isBoostActive) {
            totalExpected *= 1.90;
            if (window.spriteRenderer && window.spriteRenderer.triggerBoostConfetti) {
                window.spriteRenderer.triggerBoostConfetti(this.width, this.height);
            }
        }

        this.targetPedestrians = Math.max(18, Math.round(totalExpected));

        if (window.soundManager) {
            window.soundManager.playDayStart();
        }
    }

    setSpeed(speedMultiplier) {
        this.speed = speedMultiplier;
    }

    setPaused(paused) {
        this.isPaused = paused;
    }

    skipToEndOfDay() {
        if (!this.isRunning) return;
        this.isSkipping = true;
        if (window.soundManager) {
            window.soundManager.setSuppressed(true);
            window.soundManager.playSkip();
        }
        try {
            // Fast simulate remaining customers with high-precision 25ms time steps
            const stepDt = 0.025;
            const dayDurationMinutes = this.dayEndMinute - this.dayStartMinute;
            const minStep = (dayDurationMinutes / this.secondsPerDay) * stepDt;
            while (this.currentMinute < this.dayEndMinute) {
                this.currentMinute += minStep;
                this.updateSim(stepDt);
            }
            this.finishDay();
        } finally {
            this.isSkipping = false;
            if (window.soundManager) {
                window.soundManager.setSuppressed(false);
            }
        }
    }

    finishDay() {
        this.isRunning = false;
        this.currentMinute = this.dayEndMinute;

        // Finish serving any customer currently at the counter and any patrons already waiting in line before closing
        const closingQueue = [];
        if (this.currentServingCustomer) {
            closingQueue.push(this.currentServingCustomer);
            this.currentServingCustomer = null;
        }
        while (this.queue.length > 0) {
            closingQueue.push(this.queue.shift());
        }

        for (let i = 0; i < closingQueue.length; i++) {
            const c = closingQueue[i];
            if (c && c.decision && c.decision.buy && window.simulationModel) {
                const sim = window.simulationModel;
                const needed = c.decision.needed || { cups: 1, milk: 0, sugar: 0, ice: 0, syrup: 0 };
                const hasIngredients = sim.inventory.cups >= (needed.cups || 1) &&
                    sim.inventory.milk >= (needed.milk || 0) &&
                    sim.inventory.sugar >= (needed.sugar || 0) &&
                    sim.inventory.ice >= (needed.ice || 0) &&
                    sim.inventory.syrup >= (needed.syrup || 0) &&
                    (sim.cupsInBatch > 0 || sim.inventory.beans >= (sim.recipe.beans || 1));
                if (hasIngredients) {
                    this.completeService(c);
                } else {
                    sim.releaseStock(needed);
                    sim.dailyStats.lostStock = (sim.dailyStats.lostStock || 0) + 1;
                }
            } else if (c && c.decision && window.simulationModel) {
                window.simulationModel.releaseStock(c.decision.needed);
            }
        }
        if (window.simulationModel && typeof window.simulationModel.resetReservedStock === 'function') {
            window.simulationModel.resetReservedStock();
        }
        this.currentServingCustomer = null;
        this.isBrewing = false;
        this.isPouring = false;

        // Clear all remaining customers, queues, and floating badges so scene is completely clean after closing
        this.customers = [];
        this.queue = [];
        if (window.spriteRenderer && Array.isArray(window.spriteRenderer.floatingTexts)) {
            window.spriteRenderer.floatingTexts = [];
        }

        if (this.onDayTick) {
            this.onDayTick(this.getTimeString(), 1.0);
        }

        if (this.onDayComplete) {
            this.onDayComplete();
        }
        this.currentMinute = this.dayStartMinute;
    }

    startLoop() {
        const loop = (timestamp) => {
            try {
                if (!this.lastTime) this.lastTime = timestamp;
                const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
                this.lastTime = timestamp;

                if (this.isRunning && !this.isPaused) {
                    // Advance day clock with sub-stepping at 2x / 5x speeds so throughput matches 1x precision
                    const dayDurationMinutes = this.dayEndMinute - this.dayStartMinute;
                    const totalSimDt = dt * this.speed;
                    const subSteps = this.speed > 1 ? Math.max(1, Math.min(12, Math.ceil(totalSimDt / 0.025))) : 1;
                    const stepDt = totalSimDt / subSteps;
                    const minPerStep = (dayDurationMinutes / this.secondsPerDay) * stepDt;

                    for (let s = 0; s < subSteps; s++) {
                        this.currentMinute += minPerStep;
                        if (this.currentMinute >= this.dayEndMinute) {
                            this.finishDay();
                            break;
                        } else {
                            this.updateSim(stepDt);
                        }
                    }

                    if (this.isRunning && this.onDayTick) {
                        this.onDayTick(this.getTimeString(), (this.currentMinute - this.dayStartMinute) / dayDurationMinutes);
                    }
                } else if (window.spriteRenderer && typeof window.spriteRenderer.update === 'function') {
                    window.spriteRenderer.update(dt);
                }

                // Always render visuals
                this.render();
            } catch (err) {
                console.error('Simulation loop error:', err);
            }

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    getTimeString() {
        const totalMin = Math.floor(this.currentMinute);
        let hours = Math.floor(totalMin / 60);
        const mins = totalMin % 60;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        let displayHours = hours % 12;
        if (displayHours === 0) displayHours = 12;
        return `${String(displayHours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
    }

    // -------------------------------------------------------------
    // UPDATE SIMULATION (Spawning, Movement, Queues, Service)
    // -------------------------------------------------------------
    updateSim(dt) {
        if (window.spriteRenderer && window.spriteRenderer.update) {
            window.spriteRenderer.update(dt);
        }

        // 1. Customer Spawning (Natural Traffic Curve & Evening Wind-Down)
        this.spawnTimer += dt;
        const progress = (this.currentMinute - this.dayStartMinute) / (this.dayEndMinute - this.dayStartMinute);

        // Distribute pedestrian traffic across the active day window
        let spawnInterval = (this.secondsPerDay * 0.88) / Math.max(1, this.targetPedestrians);

        // Late afternoon (after 04:30 PM / progress > 0.85): traffic noticeably thins out
        if (progress > 0.85) {
            spawnInterval *= 2.2;
        }

        // Spawning strictly halts by 05:15 PM (currentMinute >= 1035) so patrons naturally walk away before 06:00 PM
        let spawnsThisTick = 0;
        while (this.currentMinute < 1035 && this.pedestrianCountToday < this.targetPedestrians && this.spawnTimer >= spawnInterval && spawnsThisTick < 6) {
            this.spawnTimer -= spawnInterval;
            this.spawnCustomer();
            spawnsThisTick++;
        }
        if (this.currentMinute >= 1035 || this.pedestrianCountToday >= this.targetPedestrians) {
            this.spawnTimer = 0;
        }

        // 2. Update Customers
        for (let i = this.customers.length - 1; i >= 0; i--) {
            const c = this.customers[i];
            this.updateCustomer(c, dt);

            // Remove offscreen or despawned customers who completed their route
            const isFinished = c.isDespawned === true ||
                c.x < -60 || c.x > this.width + 60 ||
                c.y < -60 || c.y > this.height + 60 ||
                isNaN(c.x) || isNaN(c.y);
            if (isFinished) {
                // If customer was still queued or serving and held reservation, release it
                if ((c.state === 'queued' || c.state === 'serving') && c.decision && window.simulationModel) {
                    window.simulationModel.releaseStock(c.decision.needed);
                }
                if (this.currentServingCustomer === c) {
                    this.currentServingCustomer = null;
                    this.isBrewing = false;
                    this.isPouring = false;
                    this.serviceProgress = 0;
                    this.serviceDuration = 0;
                }
                this.customers.splice(i, 1);
            }
        }

        // 3. Update Barista Service
        this.updateBarista(dt);
    }

    spawnCustomer() {
        this.pedestrianCountToday++;
        window.simulationModel.dailyStats.pedestriansTotal++;

        const loc = (window.simulationModel && window.simulationModel.currentLocation) || 'suburbs';
        const allRoutes = (typeof window !== 'undefined' && window.LOCATION_PATHS) ? window.LOCATION_PATHS : LOCATION_PATHS;
        const routes = allRoutes[loc] || allRoutes.suburbs || LOCATION_PATHS.suburbs;
        const routeIdx = Math.floor(Math.random() * routes.length);
        const route = routes[routeIdx];

        // Determine walk direction based on custom route spawn direction
        const allSpawnDirs = (typeof window !== 'undefined' && window.LOCATION_SPAWN_DIRECTIONS) ? window.LOCATION_SPAWN_DIRECTIONS : LOCATION_SPAWN_DIRECTIONS;
        const spawnDirsForLoc = (allSpawnDirs && allSpawnDirs[loc]) ? allSpawnDirs[loc] : null;
        const routeSpawnDir = (route && route.spawnDirection) || (spawnDirsForLoc && spawnDirsForLoc[routeIdx]) || 'both';

        let direction;
        if (routeSpawnDir === 'left_to_right' || routeSpawnDir === 'left') {
            direction = 1;
        } else if (routeSpawnDir === 'right_to_left' || routeSpawnDir === 'right') {
            direction = -1;
        } else {
            direction = Math.random() < 0.5 ? 1 : -1;
        }

        const lateralJitter = (Math.random() - 0.5) * 10;

        let waypoints;
        if (direction > 0) {
            waypoints = route.map(p => ({ x: p.x, y: p.y + lateralJitter }));
        } else {
            waypoints = [...route].reverse().map(p => ({ x: p.x, y: p.y + lateralJitter }));
        }

        const startPt = waypoints[0];
        const startX = startPt.x;
        const startY = startPt.y;

        // Choose archetype based on location preferences
        const locs = (window.simulationModel && window.simulationModel.getLocations) ? window.simulationModel.getLocations() : null;
        const locData = (locs && window.simulationModel) ? locs[window.simulationModel.currentLocation] : null;
        const archetypes = (locData && locData.preferredArchetypes && locData.preferredArchetypes.length > 0)
            ? locData.preferredArchetypes
            : ['student', 'jogger', 'business', 'hipster', 'cryptobro', 'senior'];
        let archetype = archetypes[Math.floor(Math.random() * archetypes.length)];

        // If Web3 Boost is active, spawn more Crypto Bros & Whales!
        if (window.web3Manager && window.web3Manager.isBoostActive && Math.random() < 0.45) {
            archetype = Math.random() < 0.5 ? 'cryptobro' : 'crypto_whale';
        }

        const skinTones = ['#f5cba7', '#f8c471', '#d5a6bd', '#bb8fce', '#e59866', '#a04000', '#edbb99'];
        const skinColor = skinTones[Math.floor(Math.random() * skinTones.length)];

        const customer = {
            id: 'cust_' + Math.random().toString(36).substr(2, 6),
            x: startX,
            y: startY,
            waypoints: waypoints,
            wpIndex: 1,
            sidewalkOffset: lateralJitter,
            speed: 36 + Math.random() * 24,
            direction: direction,
            origDirection: direction,
            archetype: archetype,
            skinColor: skinColor,
            animFrame: 0,
            walkPhase: 0,
            idlePhase: Math.random() * 10,
            queueWaitTime: 0,
            fidgetTimer: 0,
            isFidgeting: false,
            sipTimer: Math.random() * 2,
            servedHopTimer: 0,
            hopDuration: 0.5,
            state: 'walking', // 'walking', 'deciding', 'queued', 'serving', 'served', 'leaving'
            hasCoffee: false,
            hasEvaluated: false,
            bubble: null,
            bubbleTimer: 0,
            queueSpot: -1,
            targetX: direction > 0 ? this.width + 60 : -60
        };

        this.customers.push(customer);
    }

    updateCustomer(c, dt) {
        if (c.isMoving !== false) {
            c.animFrame = (Number.isFinite(c.animFrame) ? c.animFrame : 0) + dt * (c.speed * 0.12);
            c.walkPhase = (Number.isFinite(c.walkPhase) ? c.walkPhase : 0) + dt * (c.speed * 0.12);
        }
        c.idlePhase = (Number.isFinite(c.idlePhase) ? c.idlePhase : 0) + dt;

        if (c.servedHopTimer && c.servedHopTimer > 0) {
            c.servedHopTimer = Math.max(0, c.servedHopTimer - dt);
        }

        if (c.hasCoffee && (c.state === 'leaving' || c.isMoving)) {
            c.sipTimer = (c.sipTimer || 0) + dt;
        }

        // Update bubble timer
        if (c.bubble) {
            c.bubbleTimer -= dt;
            if (c.bubbleTimer <= 0) {
                c.bubble = null;
            }
        }

        // State Machine (Location-Specific Waypoints & Isometric Queue)
        if (c.state === 'walking') {
            c.isMoving = true;
            if (c.waypoints && c.waypoints.length > 0 && c.wpIndex < c.waypoints.length) {
                const target = c.waypoints[c.wpIndex];
                const dx = target.x - c.x;
                const dy = target.y - c.y;
                const dist = Math.hypot(dx, dy);
                const moveStep = c.speed * dt;
                if (dist <= moveStep) {
                    c.x = target.x;
                    c.y = target.y;
                    c.wpIndex++;
                    if (c.wpIndex >= c.waypoints.length) {
                        c.isDespawned = true;
                    }
                } else if (dist > 0.0001) {
                    c.x += (dx / dist) * moveStep;
                    c.y += (dy / dist) * moveStep;
                } else {
                    c.x = target.x;
                    c.y = target.y;
                }
                c.direction = dx >= 0 ? 1 : -1;
            } else {
                c.isDespawned = true;
                if (c.waypoints && c.waypoints.length >= 2) {
                    const last = c.waypoints[c.waypoints.length - 1];
                    const prev = c.waypoints[c.waypoints.length - 2];
                    const dx = last.x - prev.x;
                    const dy = last.y - prev.y;
                    const len = Math.hypot(dx, dy) || 1;
                    c.x += (dx / len) * c.speed * dt;
                    c.y += (dy / len) * c.speed * dt;
                    c.direction = dx >= 0 ? 1 : -1;
                } else {
                    c.x += (c.origDirection || c.direction || 1) * c.speed * dt;
                }
            }

            // Check if approaching stand stop zone in front of cart counter
            const standCfg = this.getStandConfig();
            const distToCounter = Math.hypot(c.x - standCfg.counter.x, c.y - standCfg.counter.y);
            const distToStandX = Math.abs(c.x - (standCfg.x + 35));
            const isStandClosing = this.currentMinute >= 1035; // 05:15 PM onwards: stand closing, pedestrians head home
            if (!isStandClosing && !c.hasCoffee && !c.hasEvaluated && (distToCounter < 55 || (distToStandX < standCfg.decisionDist && c.y >= standCfg.y - 10))) {
                c.hasEvaluated = true;

                // RNG / Gacha Customer Attraction Roll:
                // Without upgrades, most passing NPCs simply walk past without stopping!
                // Upgrades (Carts, Marketing, Canopy, Machine, Grinder, Terminal) and Hired Staff boost stop chance.
                const sim = window.simulationModel;
                const isBoost = window.web3Manager ? window.web3Manager.isBoostActive : false;
                const stopChance = (sim && typeof sim.getCustomerAttractionChance === 'function')
                    ? sim.getCustomerAttractionChance(c, isBoost)
                    : 0.25;

                if (!c.forceInterested && !c.decision && Math.random() > stopChance) {
                    // Pedestrian walks right past the stand without stopping
                    if (sim && sim.dailyStats) {
                        sim.dailyStats.passedBy = (sim.dailyStats.passedBy || 0) + 1;
                    }
                } else {
                    c.isMoving = false;
                    c.state = 'deciding';
                    this.handleCustomerDecision(c);
                }
            }
        } else if (c.state === 'deciding') {
            c.isMoving = false;
            // Briefly evaluating stand
        } else if (c.state === 'queued') {
            // Authentic Lemonade Tycoon isometric queue: customers line up neatly in front of counter
            const sim = window.simulationModel;
            const speedMult = (sim && typeof sim.getTotalServiceSpeedMultiplier === 'function')
                ? sim.getTotalServiceSpeedMultiplier()
                : 1.0;
            const queueMoveMult = speedMult > 1.01 ? Math.min(3.5, 1.4 + 0.45 * speedMult) : 1.35;
            const standCfg = this.getStandConfig();
            const target = standCfg.queueSpot(c.queueSpot);
            const targetX = target.x;
            const targetY = target.y;
            const dx = targetX - c.x;
            const dy = targetY - c.y;
            const dist = Math.hypot(dx, dy);
            const moveStep = (c.speed * queueMoveMult) * dt;
            if (dist <= moveStep || dist <= 2) {
                c.x = targetX;
                c.y = targetY;
                c.direction = -1; // Face toward counter
                c.isMoving = false;
            } else if (dist > 0.0001) {
                c.x += (dx / dist) * moveStep;
                c.y += (dy / dist) * moveStep;
                c.direction = dx >= 0 ? 1 : -1;
                c.isMoving = true;
            } else {
                c.x = targetX;
                c.y = targetY;
                c.direction = -1;
                c.isMoving = false;
            }

            // Queue Patience: customers won't wait forever if queue or service is slow!
            // Canopy upgrade & Simon the Coffee Mascot keep customers comfortable, boosting patience!
            const canopyLvl = (sim && sim.upgrades && sim.upgrades.canopy) ? sim.upgrades.canopy : 1;
            const patienceExtra = (canopyLvl >= 3) ? 6.0 : (canopyLvl >= 2 ? 3.0 : 0);
            const staffPatience = (sim && typeof sim.getStaffPerks === 'function') ? sim.getStaffPerks().patienceBonus : 0;
            const patienceLimit = 16 + patienceExtra + staffPatience;

            c.queueWaitTime = (c.queueWaitTime || 0) + dt;
            if (c.queueWaitTime > 4.0) {
                c.isFidgeting = true;
                c.fidgetTimer = (c.fidgetTimer || 0) + dt;
            } else {
                c.isFidgeting = false;
                c.fidgetTimer = 0;
            }

            if (c.queueWaitTime > patienceLimit) {
                c.bubble = { text: 'Too slow! ⏳', color: '#e67e22', width: 75 };
                c.bubbleTimer = 1.6;
                c.bubbleMaxTimer = 1.6;
                c.state = 'leaving';
                c.direction = c.origDirection || 1;
                this.resumeWaypointPath(c);
                c.isMoving = true;
                if (c.decision && window.simulationModel) {
                    window.simulationModel.releaseStock(c.decision.needed);
                }
                if (window.simulationModel) {
                    window.simulationModel.dailyStats.lostPatience++;
                    window.simulationModel.recordCustomerReaction('impatient');
                }
                const idx = this.queue.indexOf(c);
                if (idx !== -1) {
                    this.queue.splice(idx, 1);
                    for (let q = 0; q < this.queue.length; q++) {
                        this.queue[q].queueSpot = q;
                    }
                }
            }
        } else if (c.state === 'serving') {
            // Standing right in front of barista counter with smooth approach
            const sim = window.simulationModel;
            const speedMult = (sim && typeof sim.getTotalServiceSpeedMultiplier === 'function')
                ? sim.getTotalServiceSpeedMultiplier()
                : 1.0;
            const serveMoveMult = speedMult > 1.01 ? Math.min(3.8, 1.5 + 0.5 * speedMult) : 1.35;
            const standCfg = this.getStandConfig();
            const counterX = standCfg.counter.x;
            const counterY = standCfg.counter.y;
            const dx = counterX - c.x;
            const dy = counterY - c.y;
            const dist = Math.hypot(dx, dy);
            const moveStep = (c.speed * serveMoveMult) * dt;
            if (dist <= moveStep || dist <= 3) {
                c.x = counterX;
                c.y = counterY;
                c.isMoving = false;
                c.hasArrivedAtCounter = true;
                c.direction = -1; // Face barista at counter
            } else if (dist > 0.0001) {
                c.x += (dx / dist) * moveStep;
                c.y += (dy / dist) * moveStep;
                c.direction = dx >= 0 ? 1 : -1;
                c.isMoving = true;
                c.hasArrivedAtCounter = false;
            } else {
                c.x = counterX;
                c.y = counterY;
                c.isMoving = false;
                c.hasArrivedAtCounter = true;
                c.direction = -1;
            }
            c.isFidgeting = false;
            c.fidgetTimer = 0;
        } else if (c.state === 'leaving') {
            c.isFidgeting = false;
            c.fidgetTimer = 0;
            if (c.servedHopTimer && c.servedHopTimer > 0) {
                c.isMoving = false; // Hold position momentarily during cheerful hop at counter
            } else {
                c.isMoving = true;
                if (c.waypoints && c.waypoints.length > 0 && c.wpIndex < c.waypoints.length) {
                    const target = c.waypoints[c.wpIndex];
                    const dx = target.x - c.x;
                    const dy = target.y - c.y;
                    const dist = Math.hypot(dx, dy);
                    const moveStep = c.speed * dt;
                    if (dist <= moveStep) {
                        c.x = target.x;
                        c.y = target.y;
                        c.wpIndex++;
                        if (c.wpIndex >= c.waypoints.length) {
                            c.isDespawned = true;
                        }
                    } else if (dist > 0.0001) {
                        c.x += (dx / dist) * moveStep;
                        c.y += (dy / dist) * moveStep;
                    } else {
                        c.x = target.x;
                        c.y = target.y;
                    }
                    c.direction = dx >= 0 ? 1 : -1;
                } else {
                    c.isDespawned = true;
                    // Walk toward exit smoothly along last waypoint segment
                    if (c.waypoints && c.waypoints.length >= 2) {
                        const last = c.waypoints[c.waypoints.length - 1];
                        const prev = c.waypoints[c.waypoints.length - 2];
                        const dx = last.x - prev.x;
                        const dy = last.y - prev.y;
                        const len = Math.hypot(dx, dy) || 1;
                        c.x += (dx / len) * c.speed * dt;
                        c.y += (dy / len) * c.speed * dt;
                        c.direction = dx >= 0 ? 1 : -1;
                    } else {
                        c.x += (c.origDirection || c.direction || 1) * c.speed * dt;
                    }
                }
            }
        }
    }

    handleCustomerDecision(customer) {
        // 1. Evaluate customer purchase decision first (price, recipe taste, inventory availability)
        const isBoost = window.web3Manager ? window.web3Manager.isBoostActive : false;
        const decision = (customer.decision && typeof customer.decision.buy === 'boolean')
            ? customer.decision
            : window.simulationModel.evaluateCustomerDecision(customer, isBoost);

        if (!decision.buy) {
            // Customer rejected coffee due to price, taste, or out-of-stock
            customer.bubble = { text: decision.feedback, color: '#e74c3c', width: 68 };
            customer.bubbleTimer = 1.6;
            customer.bubbleMaxTimer = 1.6;
            customer.state = 'leaving';
            customer.direction = customer.origDirection || customer.direction || 1;
            this.resumeWaypointPath(customer);

            if (decision.reason === 'price') window.simulationModel.dailyStats.lostPrice++;
            else if (decision.reason === 'taste') window.simulationModel.dailyStats.lostTaste++;
            else if (decision.reason === 'stock') window.simulationModel.dailyStats.lostStock++;

            if (window.soundManager) window.soundManager.playSad();
            return;
        }

        // 2. Dynamic queue capacity check (base 10 + Canopy, Cart, Mascot & /boost bonuses)
        const maxQueue = this.getMaxQueueSize();
        if (this.queue.length >= maxQueue) {
            customer.bubble = { text: 'Line too long! ⏳', color: '#e67e22', width: 75 };
            customer.bubbleTimer = 1.3;
            customer.bubbleMaxTimer = 1.3;
            customer.state = 'leaving';
            customer.direction = customer.origDirection || customer.direction || 1;
            this.resumeWaypointPath(customer);
            window.simulationModel.dailyStats.lostPatience++;
            // Passing a full queue does NOT tank coffee satisfaction; records 'queue_full' instead of 'impatient'
            window.simulationModel.recordCustomerReaction('queue_full');
            return;
        }

        // 3. Reserve stock for this customer to prevent negative inventory
        const reserved = window.simulationModel.reserveStock(decision.needed);
        if (!reserved) {
            customer.bubble = { text: 'Sold out?! 😭', color: '#e74c3c', width: 68 };
            customer.bubbleTimer = 1.6;
            customer.bubbleMaxTimer = 1.6;
            customer.state = 'leaving';
            customer.direction = customer.origDirection || customer.direction || 1;
            this.resumeWaypointPath(customer);
            window.simulationModel.dailyStats.lostStock++;
            window.simulationModel.recordCustomerReaction('angry');
            if (window.soundManager) window.soundManager.playSad();
            return;
        }

        // Customer wants to buy! Enter queue
        customer.decision = decision;
        customer.queueSpot = this.queue.length;
        customer.queueWaitTime = 0;
        this.queue.push(customer);
        customer.state = 'queued';

        // Show anticipation bubble
        const anticipationMap = {
            'jogger': 'Light roast runner! 🏃‍♀️',
            'marathon_runner': 'Need iced fuel! 🏃',
            'fashionista': 'Oat milk cortado! 💅',
            'casual_shopper': 'Sweet vanilla latte! 🛍️',
            'student': 'Iced Americano stat! 🎓',
            'grad_student': 'Triple shot please! ☕',
            'art_student': 'Make it vibrant! 🎨',
            'bookworm': 'Slow pour-over! 📚',
            'business': 'Black coffee quick! 💼',
            'corporate_exec': 'Double shot, stat! 💼',
            'fintech_analyst': 'Arbitrage espresso! 📈',
            'metro_commuter': 'Quick commuter cup! 🚆',
            'hipster': 'Single-origin pour! ☕',
            'barista_regular': 'Floral microfoam! ☕✨',
            'music_producer': 'Late studio brew! 🎧',
            'dog_walker': 'Coffee & pup walk! 🐕',
            'cryptobro': 'Specialty brew! 🚀',
            'crypto_whale': 'Tap to pay ready! 💳',
            'tech_hacker': 'High octane packet! 💻',
            'indie_dev': 'Debug fuel please! 🕹️',
            'senior': 'Gentle warm roast! 🌸',
            'professor': 'Dark French roast! 🎓',
            'retiree': 'Warm morning cup! ☀️',
            'tourist': 'Local specialty! 🗺️'
        };
        const bubbleText = anticipationMap[customer.archetype] || 'Coffee please! ☕';
        customer.bubble = { text: bubbleText, color: '#2980b9', width: 75 };
        customer.bubbleTimer = 1.3;
        customer.bubbleMaxTimer = 1.3;
    }

    updateBarista(dt) {
        const sim = window.simulationModel;
        const machine = (sim.getUpgradeItem ? sim.getUpgradeItem('machine') : sim.getUpgrades().machine[sim.upgrades.machine - 1]);

        // Combined Service Speed Multiplier (Terminal + Grinder + Machine + Cart + Hired Staff + Perks)
        const speedMult = (sim && typeof sim.getTotalServiceSpeedMultiplier === 'function')
            ? sim.getTotalServiceSpeedMultiplier()
            : 1.0;
        const hasCounterStaff = Boolean(sim && sim.hiredStaff && (sim.hiredStaff.barista || sim.hiredStaff.cashier));
        const hasAutoPreBrew = Boolean(hasCounterStaff || (sim && sim.upgrades && sim.upgrades.machine >= 3));

        // Parallel Pre-Brewing: Hired Barista/Cashier or Dual-Boiler/Multi-Group machine keeps carafe hot & ready!
        if (hasAutoPreBrew && sim && sim.cupsInBatch === 0 && typeof sim.preBrewCarafe === 'function') {
            if (this.queue.length > 0 || this.currentServingCustomer) {
                sim.preBrewCarafe();
            }
        }

        if (this.counterVacateTimer > 0) {
            this.counterVacateTimer = Math.max(0, this.counterVacateTimer - dt);
        }

        // Pull next customer from queue only when counter is clear
        if (!this.currentServingCustomer && this.counterVacateTimer <= 0 && this.queue.length > 0) {
            this.currentServingCustomer = this.queue.shift();
            this.currentServingCustomer.state = 'serving';
            this.currentServingCustomer.hasArrivedAtCounter = false;
            this.currentServingCustomer.isMoving = true;
            this.serviceProgress = 0;
            this.serviceDuration = 0;
            this.isPouring = false;
            this.isBrewing = false;

            // Shift rest of queue forward: customers cascade forward along line
            for (let i = 0; i < this.queue.length; i++) {
                this.queue[i].queueSpot = i;
            }
        }

        // Progress current service when customer reaches counter (or steps up into express zone with upgrades/staff)
        if (this.currentServingCustomer) {
            const standCfg = this.getStandConfig();
            const counterX = standCfg.counter.x;
            const counterY = standCfg.counter.y;
            const distToCounter = Math.hypot(this.currentServingCustomer.x - counterX, this.currentServingCustomer.y - counterY);
            const hasArrived = Boolean(this.currentServingCustomer.hasArrivedAtCounter || distToCounter <= 3);
            const hasExpressFlow = Boolean(speedMult > 1.05 || hasCounterStaff);
            const canStartService = Boolean(hasArrived || (hasExpressFlow && distToCounter <= 28));

            if (hasArrived) {
                // Ensure customer is neatly stopped facing barista
                this.currentServingCustomer.isMoving = false;
                this.currentServingCustomer.x = counterX;
                this.currentServingCustomer.y = counterY;
                this.currentServingCustomer.hasArrivedAtCounter = true;
                this.currentServingCustomer.direction = -1;
            }

            if (canStartService) {
                // Start brewing/pouring ONLY ONCE when customer enters service window
                if (!this.isPouring && !this.isBrewing && this.serviceDuration === 0) {
                    if (hasAutoPreBrew && sim.cupsInBatch === 0 && typeof sim.preBrewCarafe === 'function') {
                        sim.preBrewCarafe();
                    }
                    if (sim.cupsInBatch > 0) {
                        this.isPouring = true;
                        this.isBrewing = false;
                        this.serviceDuration = machine.pourTime / speedMult;
                        if (window.soundManager) window.soundManager.playPour();
                    } else {
                        this.isBrewing = true;
                        this.isPouring = false;
                        this.serviceDuration = machine.brewTime / speedMult;
                        if (window.soundManager) window.soundManager.playPour();
                    }
                }

                // Progress service timer
                this.serviceProgress += dt;
                if (this.serviceDuration > 0 && this.serviceProgress >= this.serviceDuration) {
                    // Snap customer to counter handoff point if finishing in express zone
                    this.currentServingCustomer.x = counterX;
                    this.currentServingCustomer.y = counterY;
                    this.currentServingCustomer.isMoving = false;
                    this.currentServingCustomer.hasArrivedAtCounter = true;
                    this.currentServingCustomer.direction = -1;

                    // Completed service!
                    this.completeService(this.currentServingCustomer);
                    this.currentServingCustomer = null;
                    this.isBrewing = false;
                    this.isPouring = false;
                    this.serviceProgress = 0;
                    this.serviceDuration = 0;
                    this.counterVacateTimer = this.getCounterVacateDelay(speedMult, hasCounterStaff);
                }
            } else {
                // Customer is still advancing/walking from queueSpot 0 towards the counter!
                this.isPouring = false;
                this.isBrewing = false;
                this.serviceProgress = 0;
            }
        }
    }

    completeService(customer) {
        // Process sale in simulation model
        const sim = window.simulationModel;
        sim.executePurchase(customer.decision);

        const speedMult = (sim && typeof sim.getTotalServiceSpeedMultiplier === 'function')
            ? sim.getTotalServiceSpeedMultiplier()
            : 1.0;
        const hasCounterStaff = Boolean(sim && sim.hiredStaff && (sim.hiredStaff.barista || sim.hiredStaff.cashier));

        // Parallel Pre-Brewing: immediately refill carafe when emptied if staff or Lvl 3+ machine is active
        if ((hasCounterStaff || (sim && sim.upgrades && sim.upgrades.machine >= 3)) && sim.cupsInBatch === 0 && typeof sim.preBrewCarafe === 'function') {
            sim.preBrewCarafe();
        }

        const isSatisfied = (customer.decision && customer.decision.rating >= 3.0);
        customer.hasCoffee = true;
        customer.state = 'leaving';
        customer.direction = customer.origDirection || 1;
        customer.servedHopTimer = 0.5;
        customer.hopDuration = 0.5;
        this.counterVacateTimer = this.getCounterVacateDelay(speedMult, hasCounterStaff);
        this.resumeWaypointPath(customer);
        customer.bubble = { 
            text: customer.decision.feedback, 
            color: isSatisfied ? '#27ae60' : '#e67e22', 
            width: 72 
        };
        customer.bubbleTimer = 2.0;
        customer.bubbleMaxTimer = 2.0;

        // Cheerful bounce particle (star / heart)
        if (!this.isSkipping) {
            // Cheerful bounce particle burst
            if (window.spriteRenderer && typeof window.spriteRenderer.addCheerfulParticle === 'function') {
                window.spriteRenderer.addCheerfulParticle(customer.x, customer.y - 36, isSatisfied ? 'heart' : 'star');
            }

            // Floating cash / QRIS / Contactless Tap indicator
            const floatX = this.standX + 40;
            const floatY = this.standY - 18;
            const totalPaid = ((customer.decision.price || 0) + (customer.decision.tip || 0)).toFixed(2);
            const termLvl = (window.simulationModel && window.simulationModel.upgrades) ? (window.simulationModel.upgrades.terminal || 1) : 1;
            const payBadge = termLvl >= 3 ? '💳 TAP' : (termLvl === 2 ? '📱 QRIS' : '💵');
            const text = `+$${totalPaid} ${payBadge}`;
            if (window.spriteRenderer && window.spriteRenderer.addFloatingText) {
                window.spriteRenderer.addFloatingText(floatX, floatY, text, '#2ecc71', 13);
            }

            if (window.soundManager) {
                window.soundManager.playHappy();
            }
        }
    }

    // -------------------------------------------------------------
    // RENDER PASS
    // -------------------------------------------------------------
    render() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        const dpr = (this.canvas && this.canvas.width > 640) ? (this.canvas.width / 640) : (this.dpr || 1);

        // Clear canvas
        if (this.canvas) {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            ctx.clearRect(0, 0, w, h);
        }

        ctx.save();
        if (dpr !== 1) {
            ctx.scale(dpr, dpr);
        }
        ctx.imageSmoothingEnabled = false;

        const timeProgress = (this.currentMinute - this.dayStartMinute) / (this.dayEndMinute - this.dayStartMinute);
        const locId = window.simulationModel.currentLocation;
        const weather = window.simulationModel.weather;

        // 1. Draw Background & Scenery
        window.spriteRenderer.renderBackground(ctx, w, h, locId, weather, Math.max(0, Math.min(1, timeProgress)));

        // 2. Draw Weather Overlays (Rain/Snow/Heat)
        window.spriteRenderer.renderWeatherEffects(ctx, w, h, weather);

        // 3, 4, 5. Unified Y-Sorted Rendering of Stand, Placed Props, and Customers
        const standCfg = this.getStandConfig();
        const cartSkin = standCfg.cartSkin || 'default';
        const isBoost = window.web3Manager ? window.web3Manager.isBoostActive : false;

        const renderItems = [];
        // Stand base position: dynamically grounded based on cart scale for accurate isometric depth
        const cartW = (window.spriteRenderer && window.spriteRenderer.cartWidth) ? window.spriteRenderer.cartWidth : 76;
        const cartH = Math.round(cartW * 1.245);
        const standBaseY = (this.standY - 44) + Math.round(cartH * 0.90);
        renderItems.push({ type: 'stand', y: standBaseY });

        // Add Placed Props
        if (Array.isArray(standCfg.props)) {
            standCfg.props.forEach(p => {
                renderItems.push({ type: 'prop', y: p.y, item: p });
            });
        }

        // Add Customers
        this.customers.forEach(c => {
            renderItems.push({ type: 'customer', y: c.y, item: c });
        });

        // Sort ascending by Y coordinate for authentic 2.5D isometric depth
        renderItems.sort((a, b) => a.y - b.y);

        renderItems.forEach(obj => {
            if (obj.type === 'stand') {
                window.spriteRenderer.renderStand(ctx, this.standX, this.standY, window.simulationModel.upgrades, this.isBrewing, this.isPouring, isBoost, weather, cartSkin, true, false);
                this.renderCounterHUD(ctx);
            } else if (obj.type === 'prop') {
                if (window.spriteRenderer && typeof window.spriteRenderer.renderProp === 'function') {
                    window.spriteRenderer.renderProp(ctx, obj.item, isBoost, weather);
                }
            } else if (obj.type === 'customer') {
                window.spriteRenderer.renderCustomer(ctx, obj.item, true);
            }
        });

        // 6. Foreground Occlusion Pass (Architecture & Scenery in front of characters)
        if (window.spriteRenderer && typeof window.spriteRenderer.renderForegroundLayer === 'function') {
            window.spriteRenderer.renderForegroundLayer(ctx, w, h, locId, weather);
        }

        // 7. Draw Speech & Thought Bubbles for Customers (Layered cleanly above foreground architecture)
        this.customers.forEach(c => {
            if (c.bubble && window.spriteRenderer && typeof window.spriteRenderer.renderCustomerBubble === 'function') {
                window.spriteRenderer.renderCustomerBubble(ctx, c);
            }
        });

        // 8. Draw UI floating texts and confetti
        window.spriteRenderer.renderUIOverlays(ctx);

        // 9. Draw Boost Banner Overlay if active
        if (isBoost) {
            ctx.fillStyle = 'rgba(0, 255, 204, 0.15)';
            ctx.fillRect(0, 0, w, 22);
            ctx.fillStyle = '#00ffcc';
            ctx.font = 'bold 9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('⚡ /BOOST HYPER-FLOW ACTIVE: +90% TRAFFIC • +35% SPEED • VIP SURGE! 🚀☕', w / 2, 15);
            ctx.textAlign = 'start';
        }

        ctx.restore();
    }

    renderCounterHUD(ctx) {
        // Floating HUD badges above stand cart disabled per player request
        // (Real-time ingredients and ready cups are now monitored in the top Lemonade Tycoon style ribbon)
        return;
    }
}

window.SimulationEngine = SimulationEngine;
window.simulationEngine = new SimulationEngine();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STAND_CONFIGS,
        DEFAULT_STAND_CONFIGS,
        LOCATION_PATHS,
        DEFAULT_LOCATION_PATHS,
        LOCATION_SPAWN_DIRECTIONS,
        DEFAULT_LOCATION_SPAWN_DIRECTIONS,
        SimulationEngine,
        simulationEngine: window.simulationEngine
    };
}
