// Coffede Tycoon - Visual Map, Stand & Pedestrian Waypoint Editor
// Allows Master Zay to visually customize maps, stand placements, queue trajectories,
// pedestrian waypoints, asset scaling (cart & NPC), and camera zoom/pan.

class MapEditor {
    constructor() {
        this.locations = [
            'cul_de_sac', 'community_garden', 'public_library', 'suburbs',
            'lake_marina', 'campsite', 'farmers_market', 'park',
            'beach_boardwalk', 'construction_site', 'art_district', 'campus',
            'amusement_pier', 'sports_complex', 'shopping_mall', 'hospital_plaza',
            'metro', 'convention_center', 'downtown', 'airport_terminal'
        ];
        this.locationNames = {
            cul_de_sac: 'Quiet Cul-de-Sac',
            community_garden: 'Community Garden',
            public_library: 'Town Public Library',
            suburbs: 'Greenwood Suburbs',
            lake_marina: 'Lakefront Marina',
            campsite: 'Pine Forest Campsite',
            farmers_market: 'Village Farmers Market',
            park: 'Central City Park',
            beach_boardwalk: 'Sunny Beach Boardwalk',
            construction_site: 'Downtown Construction Site',
            art_district: 'Bohemian Art District',
            campus: 'Tech University Campus',
            amusement_pier: 'Amusement Boardwalk Pier',
            sports_complex: 'City Sports Complex',
            shopping_mall: 'Grand Galleria Mall',
            hospital_plaza: 'Metro Medical Center',
            metro: 'Grand Central Metro',
            convention_center: 'Convention & Expo Center',
            downtown: 'Wall St. & Crypto Plaza',
            airport_terminal: 'International Airport Terminal'
        };

        this.currentLocation = 'suburbs';
        this.selectedPathIndex = 0;
        this.selectedWaypointIndex = -1;
        this.activeTool = 'select'; // 'select' | 'add_wp' | 'pan'

        // Camera Zoom & Pan
        this.zoom = 1.0;
        this.minZoom = 0.5;
        this.maxZoom = 2.5;
        this.panOffset = { x: 0, y: 0 };
        this.isPanning = false;
        this.panStart = { x: 0, y: 0 };
        this.isSpacePressed = false;
        this.touchStartDist = 0;
        this.touchStartZoom = 1.0;

        // Measurement & Cursor
        this.mousePos = { worldX: 0, worldY: 0, screenX: 0, screenY: 0 };
        this.isMouseOverCanvas = false;
        this.showCrosshair = true;
        this.showGrid = true;
        this.showAllPaths = true;
        this.showForeground = false;

        // Interaction state
        this.draggedItem = null;
        this.hoveredItem = null;
        this.selectedPropId = null;
        this.selectedQueueIndex = -1;

        // Test Walkers Simulation
        this.isTestingWalkers = false;
        this.testWalkers = [];
        this.testSpawnTimer = 0;
        this.lastTestTime = 0;
        this.testAnimFrame = null;

        // Path Colors Palette
        this.pathColors = [
            { stroke: '#00f0ff', fill: '#00f0ff', glow: 'rgba(0, 240, 255, 0.4)' },
            { stroke: '#f59e0b', fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
            { stroke: '#10b981', fill: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
            { stroke: '#ec4899', fill: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
            { stroke: '#8b5cf6', fill: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
            { stroke: '#3b82f6', fill: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' }
        ];

        // Canvas & Context
        this.canvas = null;
        this.ctx = null;

        // Load or initialize config
        this.config = this.getInitialConfig();
    }

    getInitialConfig() {
        const defaultSpawnDirs = (typeof window !== 'undefined' && window.LOCATION_SPAWN_DIRECTIONS) ?
            JSON.parse(JSON.stringify(window.LOCATION_SPAWN_DIRECTIONS)) : {
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

        const defaultStands = (typeof window !== 'undefined' && (window.DEFAULT_STAND_CONFIGS || window.STAND_CONFIGS))
            ? JSON.parse(JSON.stringify(window.DEFAULT_STAND_CONFIGS || window.STAND_CONFIGS))
            : {};
        const defaultPaths = (typeof window !== 'undefined' && (window.DEFAULT_LOCATION_PATHS || window.LOCATION_PATHS))
            ? JSON.parse(JSON.stringify(window.DEFAULT_LOCATION_PATHS || window.LOCATION_PATHS))
            : {};
        const cWidth = (typeof window !== 'undefined' && window.spriteRenderer && window.spriteRenderer.cartWidth) ? window.spriteRenderer.cartWidth : 76;
        const nHeight = (typeof window !== 'undefined' && window.spriteRenderer && window.spriteRenderer.npcHeight) ? window.spriteRenderer.npcHeight : 40;

        if (typeof localStorage !== 'undefined') {
            try {
                const saved = localStorage.getItem('coffede_map_config');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed && parsed.standConfigs && parsed.locationPaths) {
                        return {
                            standConfigs: { ...defaultStands, ...JSON.parse(JSON.stringify(parsed.standConfigs)) },
                            locationPaths: { ...defaultPaths, ...JSON.parse(JSON.stringify(parsed.locationPaths)) },
                            spawnDirections: parsed.spawnDirections
                                ? { ...defaultSpawnDirs, ...JSON.parse(JSON.stringify(parsed.spawnDirections)) }
                                : defaultSpawnDirs,
                            cartWidth: typeof parsed.cartWidth === 'number' ? parsed.cartWidth : cWidth,
                            npcHeight: typeof parsed.npcHeight === 'number' ? parsed.npcHeight : nHeight
                        };
                    }
                }
            } catch (e) {
                console.warn('Error reading saved map config:', e);
            }
        }

        return {
            standConfigs: defaultStands,
            locationPaths: defaultPaths,
            spawnDirections: defaultSpawnDirs,
            cartWidth: cWidth,
            npcHeight: nHeight
        };
    }

    init() {
        if (typeof document === 'undefined') return;

        this.canvas = document.getElementById('editorCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            const dpr = (typeof window !== 'undefined' && window.devicePixelRatio && window.devicePixelRatio >= 1.5) ? 2 : 2;
            this.dpr = dpr;
            this.canvas.width = 640 * dpr;
            this.canvas.height = 360 * dpr;
            if (this.ctx) {
                this.ctx.imageSmoothingEnabled = false;
            }
            this.bindCanvasEvents();
        }

        this.bindUIEvents();
        this.syncUIFromConfig();
        this.render();
    }

    onTabActivated() {
        if (!this.canvas && typeof document !== 'undefined') {
            this.init();
        }
        if (this.canvas) {
            const dpr = this.dpr || 2;
            this.canvas.width = 640 * dpr;
            this.canvas.height = 360 * dpr;
            if (this.ctx) {
                this.ctx.imageSmoothingEnabled = false;
            }
        }
        this.syncUIFromConfig();
        this.render();
        if (this.isTestingWalkers) {
            this.startTestLoop();
        }
    }

    onTabDeactivated() {
        this.stopTestLoop();
    }

    // -------------------------------------------------------------
    // COORDINATE TRANSFORMATIONS
    // -------------------------------------------------------------
    screenToWorld(clientX, clientY) {
        if (!this.canvas) {
            const worldX = (clientX - this.panOffset.x) / this.zoom;
            const worldY = (clientY - this.panOffset.y) / this.zoom;
            return { x: worldX, y: worldY, rawX: clientX, rawY: clientY };
        }
        const rect = (typeof this.canvas.getBoundingClientRect === 'function')
            ? this.canvas.getBoundingClientRect()
            : { left: 0, top: 0, width: 640, height: 360 };
        const cssX = clientX - (rect.left || 0);
        const cssY = clientY - (rect.top || 0);
        const scaleX = 640 / (rect.width || 640);
        const scaleY = 360 / (rect.height || 360);
        const rawX = cssX * scaleX;
        const rawY = cssY * scaleY;

        const worldX = (rawX - this.panOffset.x) / this.zoom;
        const worldY = (rawY - this.panOffset.y) / this.zoom;
        return { x: worldX, y: worldY, rawX, rawY };
    }

    worldToScreen(worldX, worldY) {
        return {
            x: worldX * this.zoom + this.panOffset.x,
            y: worldY * this.zoom + this.panOffset.y
        };
    }

    // -------------------------------------------------------------
    // LOCATION & PATH MANAGEMENT
    // -------------------------------------------------------------
    setLocation(locKey) {
        if (!this.locations.includes(locKey)) return;
        this.currentLocation = locKey;
        this.selectedPathIndex = 0;
        this.selectedWaypointIndex = -1;
        this.selectedPropId = null;
        this.selectedQueueIndex = -1;
        this.hoveredItem = null;
        this.draggedItem = null;
        this.testWalkers = [];

        if (typeof document !== 'undefined') {
            document.querySelectorAll('.editor-loc-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-loc') === locKey);
            });
            const locSelect = document.getElementById('editorLocSelect');
            if (locSelect && locSelect.value !== locKey) {
                locSelect.value = locKey;
            }
        }

        this.syncUIFromConfig();
        this.render();
    }

    getActiveStandConfig() {
        if (!this.config.standConfigs[this.currentLocation]) {
            this.config.standConfigs[this.currentLocation] = {
                stand: { x: 235, y: 180 },
                counter: { x: 252, y: 192 },
                queueStart: { x: 265, y: 200 },
                queueStep: { x: 30, y: 15 },
                decisionDist: 36
            };
        }
        return this.config.standConfigs[this.currentLocation];
    }

    getActivePaths() {
        if (!this.config.locationPaths[this.currentLocation]) {
            this.config.locationPaths[this.currentLocation] = [
                [ { x: -60, y: 240 }, { x: 200, y: 230 }, { x: 450, y: 230 }, { x: 700, y: 240 } ]
            ];
        }
        return this.config.locationPaths[this.currentLocation];
    }

    getActivePath() {
        const paths = this.getActivePaths();
        if (this.selectedPathIndex >= paths.length) {
            this.selectedPathIndex = Math.max(0, paths.length - 1);
        }
        return paths[this.selectedPathIndex];
    }

    selectPath(idx) {
        const paths = this.getActivePaths();
        if (idx >= 0 && idx < paths.length) {
            this.selectedPathIndex = idx;
            this.selectedWaypointIndex = -1;
            this.syncPathUI();
            this.render();
        }
    }

    getRouteSpawnDirection(idx) {
        const targetIdx = idx !== undefined ? idx : this.selectedPathIndex;
        if (!this.config.spawnDirections) this.config.spawnDirections = {};
        if (!this.config.spawnDirections[this.currentLocation]) {
            this.config.spawnDirections[this.currentLocation] = [];
        }
        return this.config.spawnDirections[this.currentLocation][targetIdx] || 'both';
    }

    setRouteSpawnDirection(dir, idx) {
        const targetIdx = idx !== undefined ? idx : this.selectedPathIndex;
        const valid = ['both', 'left_to_right', 'right_to_left'].includes(dir) ? dir : 'both';
        if (!this.config.spawnDirections) this.config.spawnDirections = {};
        if (!this.config.spawnDirections[this.currentLocation]) {
            this.config.spawnDirections[this.currentLocation] = [];
        }
        this.config.spawnDirections[this.currentLocation][targetIdx] = valid;

        const path = this.getActivePath();
        if (path) path.spawnDirection = valid;

        this.syncPathUI();
        this.render();

        const label = valid === 'both' ? 'Both (⇄ Two-Way)' : (valid === 'left_to_right' ? 'Left Entry Only (➡)' : 'Right Entry Only (⬅)');
        this.showToast(`Route ${targetIdx + 1} flow set to: ${label}`);
    }

    addPath() {
        const paths = this.getActivePaths();
        const yOffset = 230 + (paths.length * 14) % 60;
        const newPath = [
            { x: -60, y: yOffset },
            { x: 120, y: yOffset - 6 },
            { x: 260, y: yOffset - 10 },
            { x: 420, y: yOffset - 6 },
            { x: 560, y: yOffset },
            { x: 700, y: yOffset + 4 }
        ];
        paths.push(newPath);
        this.selectedPathIndex = paths.length - 1;
        this.selectedWaypointIndex = -1;

        if (!this.config.spawnDirections) this.config.spawnDirections = {};
        if (!this.config.spawnDirections[this.currentLocation]) this.config.spawnDirections[this.currentLocation] = [];
        this.config.spawnDirections[this.currentLocation].push('both');

        this.syncPathUI();
        this.render();
        this.showToast(`Added Route ${paths.length} to ${this.locationNames[this.currentLocation]}`);
    }

    deletePath() {
        const paths = this.getActivePaths();
        if (paths.length <= 1) {
            this.showToast('Location must have at least 1 path route!', 'error');
            return;
        }
        paths.splice(this.selectedPathIndex, 1);
        if (this.config.spawnDirections && this.config.spawnDirections[this.currentLocation]) {
            this.config.spawnDirections[this.currentLocation].splice(this.selectedPathIndex, 1);
        }
        this.selectedPathIndex = Math.max(0, this.selectedPathIndex - 1);
        this.selectedWaypointIndex = -1;
        this.syncPathUI();
        this.render();
        this.showToast('Route deleted.');
    }

    reversePath() {
        const path = this.getActivePath();
        if (!path || path.length < 2) return;
        path.reverse();
        // Also flip spawn direction if it was one-way
        const curDir = this.getRouteSpawnDirection(this.selectedPathIndex);
        if (curDir === 'left_to_right') {
            this.setRouteSpawnDirection('right_to_left', this.selectedPathIndex);
        } else if (curDir === 'right_to_left') {
            this.setRouteSpawnDirection('left_to_right', this.selectedPathIndex);
        } else {
            this.syncPathUI();
            this.render();
        }
        this.showToast('Route walking direction reversed! (⇄)');
    }

    alignStartOffscreen() {
        const path = this.getActivePath();
        if (!path || path.length === 0) return;
        path[0].x = -60;
        this.syncPathUI();
        this.render();
        this.showToast('Route start aligned to offscreen left (-60px)');
    }

    alignEndOffscreen() {
        const path = this.getActivePath();
        if (!path || path.length === 0) return;
        path[path.length - 1].x = 700;
        this.syncPathUI();
        this.render();
        this.showToast('Route terminus aligned to offscreen right (700px)');
    }

    addWaypointAt(worldX, worldY) {
        const path = this.getActivePath();
        if (!path) return;
        const roundedPt = { x: Math.round(worldX), y: Math.round(worldY) };

        if (this.selectedWaypointIndex >= 0 && this.selectedWaypointIndex < path.length - 1) {
            path.splice(this.selectedWaypointIndex + 1, 0, roundedPt);
            this.selectedWaypointIndex++;
        } else {
            path.push(roundedPt);
            this.selectedWaypointIndex = path.length - 1;
        }
        this.syncPathUI();
        this.render();
        this.showToast(`Waypoint added at (${roundedPt.x}, ${roundedPt.y})`);
    }

    addWaypointToEnd() {
        const path = this.getActivePath();
        if (!path) return;
        let newX = 500, newY = 240;
        if (path.length >= 2) {
            const pLast = path[path.length - 1];
            const pPrev = path[path.length - 2];
            const dx = pLast.x - pPrev.x;
            const dy = pLast.y - pPrev.y;
            const dist = Math.hypot(dx, dy) || 1;
            const step = Math.min(100, Math.max(40, dist));
            newX = Math.round(pLast.x + (dx / dist) * step);
            newY = Math.round(pLast.y + (dy / dist) * step);
        } else if (path.length === 1) {
            newX = path[0].x + 60;
            newY = path[0].y;
        }
        path.push({ x: newX, y: newY });
        this.selectedWaypointIndex = path.length - 1;
        this.syncPathUI();
        this.render();
        this.showToast(`Added Waypoint #${path.length - 1} at (${newX}, ${newY})`);
    }

    insertWaypointAfter() {
        const path = this.getActivePath();
        if (!path || path.length === 0) return;
        const idx = this.selectedWaypointIndex >= 0 ? this.selectedWaypointIndex : path.length - 1;
        const cur = path[idx];
        let newX, newY;
        if (idx < path.length - 1) {
            const next = path[idx + 1];
            newX = Math.round((cur.x + next.x) / 2);
            newY = Math.round((cur.y + next.y) / 2);
        } else {
            newX = cur.x + 50;
            newY = cur.y + 10;
        }
        path.splice(idx + 1, 0, { x: newX, y: newY });
        this.selectedWaypointIndex = idx + 1;
        this.syncPathUI();
        this.render();
        this.showToast(`Inserted Waypoint #${idx + 1} at (${newX}, ${newY})`);
    }

    deleteWaypoint(idx) {
        const path = this.getActivePath();
        if (!path) return;
        const targetIdx = idx !== undefined ? idx : this.selectedWaypointIndex;
        if (targetIdx < 0 || targetIdx >= path.length) {
            this.showToast('Please select a waypoint to delete first!', 'info');
            return;
        }
        if (path.length <= 2) {
            this.showToast('Route must contain at least 2 waypoints!', 'error');
            return;
        }
        path.splice(targetIdx, 1);
        if (this.selectedWaypointIndex >= path.length) {
            this.selectedWaypointIndex = path.length - 1;
        }
        this.syncPathUI();
        this.render();
        this.showToast('Waypoint deleted.');
    }

    // -------------------------------------------------------------
    // ASSET SCALING (Cart Width & NPC Height)
    // -------------------------------------------------------------
    setCartWidth(w) {
        const val = Math.max(50, Math.min(120, Math.round(w)));
        this.config.cartWidth = val;
        if (typeof window !== 'undefined' && window.spriteRenderer) {
            window.spriteRenderer.cartWidth = val;
        }
        this.syncScaleUI();
        this.render();
    }

    setNpcHeight(h) {
        const val = Math.max(25, Math.min(60, Math.round(h)));
        this.config.npcHeight = val;
        if (typeof window !== 'undefined' && window.spriteRenderer) {
            window.spriteRenderer.npcHeight = val;
        }
        this.syncScaleUI();
        this.render();
    }

    // -------------------------------------------------------------
    // DYNAMIC CURVED QUEUE SPOTS (Per-Point Manipulation)
    // -------------------------------------------------------------
    getQueueSpots(standCfg) {
        if (!standCfg) standCfg = this.getActiveStandConfig();
        if (!standCfg.queueSpots || !Array.isArray(standCfg.queueSpots) || standCfg.queueSpots.length === 0) {
            const qStart = standCfg.queueStart || { x: 265, y: 200 };
            const qStep = standCfg.queueStep || { x: 30, y: 15 };
            standCfg.queueSpots = [0, 1, 2, 3, 4].map(i => ({
                x: qStart.x + i * qStep.x,
                y: qStart.y + i * qStep.y
            }));
        }
        return standCfg.queueSpots;
    }

    addQueueSpot() {
        const standCfg = this.getActiveStandConfig();
        const spots = this.getQueueSpots(standCfg);
        if (spots.length >= 8) {
            this.showToast('Maximum 8 queue spots reached!', 'info');
            return;
        }
        const last = spots[spots.length - 1];
        const prev = spots.length >= 2 ? spots[spots.length - 2] : { x: last.x - 28, y: last.y - 16 };
        const dx = last.x - prev.x;
        const dy = last.y - prev.y;
        const newSpot = { x: Math.round(last.x + dx), y: Math.round(last.y + dy) };
        spots.push(newSpot);
        this.syncQueueUI();
        this.render();
        this.showToast(`Added queue spot Q${spots.length - 1} at (${newSpot.x}, ${newSpot.y})`);
    }

    deleteQueueSpot(idx) {
        const standCfg = this.getActiveStandConfig();
        const spots = this.getQueueSpots(standCfg);
        if (spots.length <= 2) {
            this.showToast('Queue must contain at least 2 spots!', 'error');
            return;
        }
        const targetIdx = (typeof idx === 'number' && idx >= 0 && idx < spots.length) ? idx : spots.length - 1;
        spots.splice(targetIdx, 1);
        standCfg.queueStart = { ...spots[0] };
        this.syncQueueUI();
        this.render();
        this.showToast(`Removed queue spot Q${targetIdx}.`);
    }

    straightenQueue() {
        const standCfg = this.getActiveStandConfig();
        const spots = this.getQueueSpots(standCfg);
        const q0 = spots[0];
        const qStep = standCfg.queueStep || { x: 28, y: 16 };
        for (let i = 1; i < spots.length; i++) {
            spots[i].x = Math.round(q0.x + i * qStep.x);
            spots[i].y = Math.round(q0.y + i * qStep.y);
        }
        this.syncQueueUI();
        this.render();
        this.showToast('↺ Straightened queue spots into a line!');
    }

    // -------------------------------------------------------------
    // PLACED MAP PROPS & ASSETS MANAGEMENT
    // -------------------------------------------------------------
    getActiveProps() {
        const standCfg = this.getActiveStandConfig();
        if (!Array.isArray(standCfg.props)) {
            standCfg.props = [];
        }
        return standCfg.props;
    }

    addProp(type = 'cafe_table', x, y) {
        const props = this.getActiveProps();
        if (props.length >= 24) {
            this.showToast('Maximum 24 placed assets reached!', 'info');
            return null;
        }
        const standCfg = this.getActiveStandConfig();
        const defaultX = typeof x === 'number' ? Math.round(x) : Math.round(standCfg.stand.x + 60);
        const defaultY = typeof y === 'number' ? Math.round(y) : Math.round(standCfg.stand.y + 35);
        const propId = 'prop_' + Math.random().toString(36).substring(2, 9);
        const cat = (typeof PROP_CATALOG !== 'undefined' && PROP_CATALOG[type]) ? PROP_CATALOG[type] : { name: 'Asset' };
        const newProp = {
            id: propId,
            type: type,
            x: defaultX,
            y: defaultY,
            scale: 1.0,
            flip: false,
            name: cat.name || type
        };
        props.push(newProp);
        this.selectedPropId = propId;
        this.syncPropUI();
        this.render();
        this.showToast(`Added ${newProp.name} to map! ✨`);
        return newProp;
    }

    getSelectedProp() {
        if (!this.selectedPropId) return null;
        const props = this.getActiveProps();
        return props.find(p => p.id === this.selectedPropId) || null;
    }

    deleteProp(id) {
        const targetId = id || this.selectedPropId;
        if (!targetId) {
            this.showToast('Please select an asset to delete first!', 'info');
            return;
        }
        const props = this.getActiveProps();
        const idx = props.findIndex(p => p.id === targetId);
        if (idx !== -1) {
            const removed = props.splice(idx, 1)[0];
            if (this.selectedPropId === targetId) {
                this.selectedPropId = null;
            }
            this.syncPropUI();
            this.render();
            this.showToast(`Deleted ${removed.name || 'asset'}.`);
        }
    }

    duplicateProp(id) {
        const targetId = id || this.selectedPropId;
        const props = this.getActiveProps();
        const p = props.find(x => x.id === targetId);
        if (!p) return null;
        const clone = {
            ...JSON.parse(JSON.stringify(p)),
            id: 'prop_' + Math.random().toString(36).substring(2, 9),
            x: p.x + 16,
            y: p.y + 16
        };
        props.push(clone);
        this.selectedPropId = clone.id;
        this.syncPropUI();
        this.render();
        this.showToast(`Duplicated ${clone.name}!`);
        return clone;
    }

    setPropType(id, newType) {
        const targetId = id || this.selectedPropId;
        const p = this.getActiveProps().find(x => x.id === targetId);
        if (!p) return;
        p.type = newType;
        const cat = (typeof PROP_CATALOG !== 'undefined' && PROP_CATALOG[newType]) ? PROP_CATALOG[newType] : null;
        if (cat) p.name = cat.name;
        this.syncPropUI();
        this.render();
        this.showToast(`Asset changed to ${p.name}!`);
    }

    setPropScale(id, scale) {
        const targetId = id || this.selectedPropId;
        const p = this.getActiveProps().find(x => x.id === targetId);
        if (!p) return;
        p.scale = Math.max(0.4, Math.min(2.5, Math.round(scale * 100) / 100));
        this.syncPropUI();
        this.render();
    }

    togglePropFlip(id) {
        const targetId = id || this.selectedPropId;
        const p = this.getActiveProps().find(x => x.id === targetId);
        if (!p) return;
        p.flip = !p.flip;
        this.syncPropUI();
        this.render();
    }

    setCartSkin(skin) {
        const standCfg = this.getActiveStandConfig();
        standCfg.cartSkin = skin || 'default';
        this.render();
        this.showToast(`Cart skin updated to: ${skin}!`);
    }

    // -------------------------------------------------------------
    // CAMERA ZOOM & PAN
    // -------------------------------------------------------------
    setZoom(newZoom, centerRawX, centerRawY) {
        const clampedZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
        if (Math.abs(clampedZoom - this.zoom) < 0.001) return;

        if (centerRawX !== undefined && centerRawY !== undefined) {
            this.panOffset.x = centerRawX - (centerRawX - this.panOffset.x) * (clampedZoom / this.zoom);
            this.panOffset.y = centerRawY - (centerRawY - this.panOffset.y) * (clampedZoom / this.zoom);
        }
        this.zoom = clampedZoom;
        this.syncZoomUI();
        this.render();
    }

    resetView() {
        this.zoom = 1.0;
        this.panOffset = { x: 0, y: 0 };
        this.syncZoomUI();
        this.render();
        this.showToast('Camera reset to 1.0x (640x360)');
    }

    // -------------------------------------------------------------
    // HIT TESTING
    // -------------------------------------------------------------
    hitTest(worldX, worldY) {
        const standCfg = this.getActiveStandConfig();
        const cartW = this.config.cartWidth || 76;
        const cartH = Math.round(cartW * 1.24);

        // 1. Waypoint hit test on ACTIVE path (Highest priority for node manipulation)
        const activePath = this.getActivePath();
        if (activePath) {
            const hitRadius = 12 / this.zoom;
            for (let i = 0; i < activePath.length; i++) {
                const pt = activePath[i];
                if (Math.hypot(worldX - pt.x, worldY - pt.y) <= hitRadius) {
                    return { type: 'waypoint', pathIdx: this.selectedPathIndex, wpIdx: i, x: pt.x, y: pt.y };
                }
            }
        }

        // 2. Queue Spot handles (Individual curved spots Q0..Qn)
        const spots = this.getQueueSpots(standCfg);
        for (let i = 0; i < spots.length; i++) {
            const pt = spots[i];
            const hitR = (i === 0 ? 14 : 10) / this.zoom;
            if (Math.hypot(worldX - pt.x, worldY - pt.y) <= hitR) {
                return { type: 'queue', qIdx: i, x: pt.x, y: pt.y };
            }
        }

        // 3. Counter handle
        if (Math.hypot(worldX - standCfg.counter.x, worldY - standCfg.counter.y) <= 10 / this.zoom) {
            return { type: 'counter', x: standCfg.counter.x, y: standCfg.counter.y };
        }

        // 4. Stand anchor handle or cart body
        const standAnchorHit = Math.hypot(worldX - standCfg.stand.x, worldY - standCfg.stand.y) <= 14 / this.zoom;
        const cartLeft = standCfg.stand.x - 18;
        const cartTop = standCfg.stand.y - 44;
        const cartBodyHit = worldX >= cartLeft && worldX <= cartLeft + cartW && worldY >= cartTop && worldY <= cartTop + cartH;

        if (standAnchorHit || cartBodyHit) {
            return { type: 'stand', x: standCfg.stand.x, y: standCfg.stand.y };
        }

        // 5. Placed Props hit testing (reversed for top-most first)
        const props = this.getActiveProps();
        if (props && props.length > 0) {
            for (let i = props.length - 1; i >= 0; i--) {
                const p = props[i];
                const cat = (typeof PROP_CATALOG !== 'undefined' && PROP_CATALOG[p.type]) ? PROP_CATALOG[p.type] : { defaultWidth: 30, defaultHeight: 30 };
                const scale = p.scale || 1.0;
                const pw = (cat.defaultWidth || 30) * scale;
                const ph = (cat.defaultHeight || 30) * scale;
                if (worldX >= p.x - pw / 2 - 6 && worldX <= p.x + pw / 2 + 6 &&
                    worldY >= p.y - ph - 6 && worldY <= p.y + 10) {
                    return { type: 'prop', propId: p.id, propIdx: i, prop: p, x: p.x, y: p.y };
                }
            }
        }

        // 6. Waypoints on OTHER paths (to switch active path)
        if (this.showAllPaths) {
            const allPaths = this.getActivePaths();
            const hitRadius = 10 / this.zoom;
            for (let p = 0; p < allPaths.length; p++) {
                if (p === this.selectedPathIndex) continue;
                const path = allPaths[p];
                for (let i = 0; i < path.length; i++) {
                    const pt = path[i];
                    if (Math.hypot(worldX - pt.x, worldY - pt.y) <= hitRadius) {
                        return { type: 'other_path', pathIdx: p, wpIdx: i, x: pt.x, y: pt.y };
                    }
                }
            }
        }

        return null;
    }

    // -------------------------------------------------------------
    // LIVE TEST SIMULATION WALKERS
    // -------------------------------------------------------------
    toggleTestSimulation() {
        this.isTestingWalkers = !this.isTestingWalkers;
        const btn = document.getElementById('btnTestSimulation');
        if (btn) {
            btn.classList.toggle('active', this.isTestingWalkers);
            btn.innerHTML = this.isTestingWalkers ? '⏸️ Stop Walkers' : '▶️ Test Walkers';
        }

        if (this.isTestingWalkers) {
            this.testSpawnTimer = 0;
            this.startTestLoop();
            this.showToast('Test Pedestrians simulation active! 🚶');
        } else {
            this.stopTestLoop();
            this.testWalkers = [];
            this.render();
            this.showToast('Test simulation stopped.');
        }
    }

    respawnTestWalkers() {
        this.testWalkers = [];
        this.testSpawnTimer = 0;
        if (!this.isTestingWalkers) {
            this.toggleTestSimulation();
        } else {
            this.render();
            this.showToast('Test walkers respawned!');
        }
    }

    spawnTestWalker(forcedPathIdx) {
        const paths = this.getActivePaths();
        if (!paths || paths.length === 0) return;
        const pathIdx = (typeof forcedPathIdx === 'number' && forcedPathIdx >= 0 && forcedPathIdx < paths.length)
            ? forcedPathIdx
            : Math.floor(Math.random() * paths.length);
        const route = paths[pathIdx];
        if (!route || route.length < 2) return;

        // Either walk start-to-end (dir=1) or end-to-start (dir=-1), respecting route spawn direction
        const routeSpawnDir = (route && route.spawnDirection) || this.getRouteSpawnDirection(pathIdx);
        let direction;
        if (routeSpawnDir === 'left_to_right' || routeSpawnDir === 'left') {
            direction = 1;
        } else if (routeSpawnDir === 'right_to_left' || routeSpawnDir === 'right') {
            direction = -1;
        } else {
            direction = Math.random() < 0.5 ? 1 : -1;
        }

        let waypoints;
        if (direction > 0) {
            waypoints = route.map(p => ({ x: p.x, y: p.y }));
        } else {
            waypoints = [...route].reverse().map(p => ({ x: p.x, y: p.y }));
        }

        const archetypes = ['student', 'jogger', 'business', 'hipster', 'cryptobro', 'senior', 'fashionista', 'casual_shopper'];
        const archetype = archetypes[Math.floor(Math.random() * archetypes.length)];

        const walker = {
            id: Math.random().toString(36).substring(7),
            archetype: archetype,
            x: waypoints[0].x,
            y: waypoints[0].y,
            speed: 38 + Math.random() * 14,
            direction: direction,
            origDirection: direction,
            waypoints: waypoints,
            wpIndex: 1,
            state: 'walking', // 'walking' | 'queued' | 'leaving'
            queueSpot: -1,
            queueWaitTimer: 0,
            hasCoffee: false,
            animFrame: 0,
            walkPhase: Math.random() * Math.PI * 2,
            animTimer: 0,
            height: this.config.npcHeight || 40,
            skinColor: '#f5cba7'
        };

        this.testWalkers.push(walker);
    }

    updateTestWalkers(dt) {
        const standCfg = this.getActiveStandConfig();
        const qStart = standCfg.queueStart;
        const qStep = standCfg.queueStep;

        // Periodic spawn
        this.testSpawnTimer += dt;
        if (this.testSpawnTimer >= 1.6 && this.testWalkers.length < 8) {
            this.testSpawnTimer = 0;
            this.spawnTestWalker();
        }

        // Count current queued walkers
        const queuedCount = this.testWalkers.filter(w => w.state === 'queued').length;

        for (let i = this.testWalkers.length - 1; i >= 0; i--) {
            const w = this.testWalkers[i];

            // 4-sided bounds check or invalid coordinates
            if (w.x < -80 || w.x > 720 || w.y < -80 || w.y > 440 || isNaN(w.x) || isNaN(w.y)) {
                this.testWalkers.splice(i, 1);
                continue;
            }

            w.height = this.config.npcHeight || 40;

            if (w.state === 'walking') {
                w.walkPhase += dt * (w.speed * 0.12);
                w.animTimer += dt;
                if (w.animTimer > 0.11) {
                    w.animTimer = 0;
                    w.animFrame = (w.animFrame + 1) % 8;
                }

                // Check if near counter and decides to queue
                const spots = this.getQueueSpots(standCfg);
                const maxQueueCap = spots.length;
                const distToCounter = Math.hypot(w.x - standCfg.counter.x, w.y - standCfg.counter.y);
                if (distToCounter <= standCfg.decisionDist && queuedCount < maxQueueCap && !w.hasCoffee && Math.random() < 0.35) {
                    w.state = 'queued';
                    w.queueSpot = queuedCount;
                    w.queueWaitTimer = 2.5 + Math.random() * 1.5;
                } else if (w.wpIndex < w.waypoints.length) {
                    const targetWp = w.waypoints[w.wpIndex];
                    const dx = targetWp.x - w.x;
                    const dy = targetWp.y - w.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < 4) {
                        w.wpIndex++;
                        if (w.wpIndex >= w.waypoints.length) {
                            this.testWalkers.splice(i, 1);
                            continue;
                        }
                    } else {
                        w.x += (dx / dist) * w.speed * dt;
                        w.y += (dy / dist) * w.speed * dt;
                        w.direction = dx >= 0 ? 1 : -1;
                    }
                } else {
                    // Reached terminus
                    this.testWalkers.splice(i, 1);
                    continue;
                }
            } else if (w.state === 'queued') {
                const spots = this.getQueueSpots(standCfg);
                const sIdx = Math.max(0, Math.min(spots.length - 1, w.queueSpot));
                const targetQ = spots[sIdx] || {
                    x: qStart.x + w.queueSpot * qStep.x,
                    y: qStart.y + w.queueSpot * qStep.y
                };
                const dx = targetQ.x - w.x;
                const dy = targetQ.y - w.y;
                const dist = Math.hypot(dx, dy);

                if (dist > 2) {
                    w.x += (dx / dist) * Math.min(dist, w.speed * dt);
                    w.y += (dy / dist) * Math.min(dist, w.speed * dt);
                    w.walkPhase += dt * (w.speed * 0.1);
                    w.animTimer += dt;
                    if (w.animTimer > 0.11) {
                        w.animTimer = 0;
                        w.animFrame = (w.animFrame + 1) % 8;
                    }
                    w.direction = dx >= 0 ? 1 : -1;
                    w.isMoving = true;
                } else {
                    w.x = targetQ.x;
                    w.y = targetQ.y;
                    w.isMoving = false;
                    w.direction = -1;

                    // REALISTIC QUEUE PROGRESSION: ONLY the person at the front (queueSpot 0) can purchase!
                    if (w.queueSpot === 0) {
                        w.queueWaitTimer -= dt;
                        if (w.queueWaitTimer <= 0) {
                            // Received coffee, resume walking offscreen
                            w.state = 'leaving';
                            w.hasCoffee = true;
                            // Pick next waypoint forward
                            w.direction = w.origDirection || 1;
                            let bestIdx = w.waypoints.length;
                            for (let p = 0; p < w.waypoints.length; p++) {
                                if ((w.waypoints[p].x - w.x) * w.direction > 10) {
                                    bestIdx = p;
                                    break;
                                }
                            }
                            w.wpIndex = bestIdx;
                            if (w.wpIndex >= w.waypoints.length) {
                                this.testWalkers.splice(i, 1);
                                continue;
                            }

                            // CASCADE QUEUE FORWARD: All remaining queued walkers move up 1 spot!
                            this.testWalkers.forEach(other => {
                                if (other !== w && other.state === 'queued' && other.queueSpot > 0) {
                                    other.queueSpot--;
                                }
                            });
                        }
                    }
                }
            } else if (w.state === 'leaving') {
                w.walkPhase += dt * (w.speed * 0.12);
                w.animTimer += dt;
                if (w.animTimer > 0.11) {
                    w.animTimer = 0;
                    w.animFrame = (w.animFrame + 1) % 8;
                }

                if (w.wpIndex < w.waypoints.length) {
                    const targetWp = w.waypoints[w.wpIndex];
                    const dx = targetWp.x - w.x;
                    const dy = targetWp.y - w.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 5) {
                        w.wpIndex++;
                        if (w.wpIndex >= w.waypoints.length) {
                            this.testWalkers.splice(i, 1);
                            continue;
                        }
                    } else {
                        w.x += (dx / dist) * w.speed * dt;
                        w.y += (dy / dist) * w.speed * dt;
                        w.direction = dx >= 0 ? 1 : -1;
                    }
                } else {
                    // Reached terminus
                    this.testWalkers.splice(i, 1);
                    continue;
                }
            }
        }
    }

    startTestLoop() {
        this.stopTestLoop();
        this.lastTestTime = performance.now();
        const loop = (timestamp) => {
            if (!this.isTestingWalkers) return;
            const dt = Math.min(0.1, (timestamp - this.lastTestTime) / 1000);
            this.lastTestTime = timestamp;
            this.updateTestWalkers(dt);
            this.render();
            this.testAnimFrame = requestAnimationFrame(loop);
        };
        this.testAnimFrame = requestAnimationFrame(loop);
    }

    stopTestLoop() {
        if (this.testAnimFrame) {
            cancelAnimationFrame(this.testAnimFrame);
            this.testAnimFrame = null;
        }
    }

    // -------------------------------------------------------------
    // PERSISTENCE (Save, Export, Import, Reset)
    // -------------------------------------------------------------
    saveAndApply() {
        // Deep clone config to ensure data purity
        const snapshot = {
            standConfigs: JSON.parse(JSON.stringify(this.config.standConfigs)),
            locationPaths: JSON.parse(JSON.stringify(this.config.locationPaths)),
            spawnDirections: JSON.parse(JSON.stringify(this.config.spawnDirections || {})),
            cartWidth: this.config.cartWidth,
            npcHeight: this.config.npcHeight
        };

        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem('coffede_map_config', JSON.stringify(snapshot));
            } catch (e) {
                console.error('Failed to save map config to localStorage:', e);
            }
        }

        // Apply immediately to runtime global references
        if (typeof window !== 'undefined') {
            if (window.STAND_CONFIGS) {
                Object.assign(window.STAND_CONFIGS, snapshot.standConfigs);
            }
            if (window.LOCATION_PATHS) {
                Object.assign(window.LOCATION_PATHS, snapshot.locationPaths);
            }
            if (window.LOCATION_SPAWN_DIRECTIONS) {
                Object.assign(window.LOCATION_SPAWN_DIRECTIONS, snapshot.spawnDirections);
            }
            if (window.spriteRenderer) {
                window.spriteRenderer.cartWidth = snapshot.cartWidth;
                window.spriteRenderer.npcHeight = snapshot.npcHeight;
            }
            if (window.simulationEngine) {
                window.simulationEngine._overrideStandX = undefined;
                window.simulationEngine._overrideStandY = undefined;
            }
            if (typeof window.applySavedMapConfigs === 'function') {
                window.applySavedMapConfigs();
            }
        }

        this.showToast('✨ Map configuration saved and applied to game!', 'success');
    }

    exportJSON() {
        const payload = {
            version: 1,
            author: 'Master Zay',
            exportedAt: new Date().toISOString(),
            cartWidth: this.config.cartWidth,
            npcHeight: this.config.npcHeight,
            standConfigs: this.config.standConfigs,
            locationPaths: this.config.locationPaths,
            spawnDirections: this.config.spawnDirections
        };
        return JSON.stringify(payload, null, 2);
    }

    importJSON(jsonStr) {
        try {
            const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid JSON root object.');
            }
            if (!data.standConfigs || !data.locationPaths) {
                throw new Error('JSON missing standConfigs or locationPaths.');
            }

            // Defaults fallback for missing locations
            const defaultsStands = (typeof window !== 'undefined' && window.DEFAULT_STAND_CONFIGS)
                ? JSON.parse(JSON.stringify(window.DEFAULT_STAND_CONFIGS))
                : {};
            const defaultsPaths = (typeof window !== 'undefined' && window.DEFAULT_LOCATION_PATHS)
                ? JSON.parse(JSON.stringify(window.DEFAULT_LOCATION_PATHS))
                : {};

            const normalizedStands = { ...defaultsStands };
            for (const loc of this.locations) {
                if (data.standConfigs[loc]) {
                    const raw = data.standConfigs[loc];
                    normalizedStands[loc] = {
                        stand: { x: Math.round(Number(raw.stand?.x ?? 235)), y: Math.round(Number(raw.stand?.y ?? 180)) },
                        counter: { x: Math.round(Number(raw.counter?.x ?? 252)), y: Math.round(Number(raw.counter?.y ?? 192)) },
                        queueStart: { x: Math.round(Number(raw.queueStart?.x ?? 265)), y: Math.round(Number(raw.queueStart?.y ?? 200)) },
                        queueStep: { x: Math.round(Number(raw.queueStep?.x ?? 30)), y: Math.round(Number(raw.queueStep?.y ?? 15)) },
                        decisionDist: Math.max(15, Math.min(100, Math.round(Number(raw.decisionDist ?? 36))))
                    };
                    if (Array.isArray(raw.queueSpots) && raw.queueSpots.length >= 2) {
                        normalizedStands[loc].queueSpots = raw.queueSpots.map(s => ({
                            x: Math.round(Number(s.x ?? 0)),
                            y: Math.round(Number(s.y ?? 0))
                        }));
                    }
                    if (Array.isArray(raw.props)) {
                        normalizedStands[loc].props = raw.props.map(p => ({
                            id: p.id || ('prop_' + Math.random().toString(36).substring(2, 8)),
                            type: p.type || 'cafe_table',
                            name: p.name || 'Prop',
                            x: Math.round(Number(p.x ?? 250)),
                            y: Math.round(Number(p.y ?? 200)),
                            scale: Math.max(0.4, Math.min(2.5, Number(p.scale ?? 1.0))),
                            flip: !!p.flip,
                            customImageSrc: p.customImageSrc || undefined
                        }));
                    }
                    if (raw.cartSkin) {
                        normalizedStands[loc].cartSkin = raw.cartSkin;
                    }
                }
            }

            const normalizedPaths = { ...defaultsPaths };
            for (const loc of this.locations) {
                if (Array.isArray(data.locationPaths[loc]) && data.locationPaths[loc].length > 0) {
                    normalizedPaths[loc] = data.locationPaths[loc].map(route => {
                        if (!Array.isArray(route)) return [];
                        return route.map(pt => ({
                            x: Math.round(Number(pt.x ?? 0)),
                            y: Math.round(Number(pt.y ?? 200))
                        }));
                    }).filter(r => r.length >= 2);
                    if (normalizedPaths[loc].length === 0 && defaultsPaths[loc]) {
                        normalizedPaths[loc] = JSON.parse(JSON.stringify(defaultsPaths[loc]));
                    }
                }
            }

            this.config.standConfigs = normalizedStands;
            this.config.locationPaths = normalizedPaths;

            if (data.spawnDirections && typeof data.spawnDirections === 'object') {
                for (const loc of this.locations) {
                    if (Array.isArray(data.spawnDirections[loc])) {
                        if (!this.config.spawnDirections) this.config.spawnDirections = {};
                        this.config.spawnDirections[loc] = data.spawnDirections[loc].map(d =>
                            ['both', 'left_to_right', 'right_to_left'].includes(d) ? d : 'both'
                        );
                    }
                }
            }

            if (data.cartWidth !== undefined) {
                const cw = Number(data.cartWidth);
                if (!isNaN(cw)) this.setCartWidth(cw);
            }
            if (data.npcHeight !== undefined) {
                const nh = Number(data.npcHeight);
                if (!isNaN(nh)) this.setNpcHeight(nh);
            }

            this.selectedPathIndex = 0;
            this.selectedWaypointIndex = -1;
            this.saveAndApply();
            this.syncUIFromConfig();
            this.render();
            this.showToast('✅ Map configuration imported and applied successfully!', 'success');
            return true;
        } catch (err) {
            console.error('Import failed:', err);
            this.showToast(`Import error: ${err.message}`, 'error');
            return false;
        }
    }

    resetDefaults() {
        if (typeof window !== 'undefined' && window.DEFAULT_STAND_CONFIGS && window.DEFAULT_LOCATION_PATHS) {
            this.config.standConfigs = JSON.parse(JSON.stringify(window.DEFAULT_STAND_CONFIGS));
            this.config.locationPaths = JSON.parse(JSON.stringify(window.DEFAULT_LOCATION_PATHS));
        }
        if (typeof window !== 'undefined' && window.DEFAULT_LOCATION_SPAWN_DIRECTIONS) {
            this.config.spawnDirections = JSON.parse(JSON.stringify(window.DEFAULT_LOCATION_SPAWN_DIRECTIONS));
        } else {
            this.config.spawnDirections = {
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
        }
        this.setCartWidth(76);
        this.setNpcHeight(40);

        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.removeItem('coffede_map_config');
            } catch (e) {}
        }

        if (typeof window !== 'undefined') {
            if (window.STAND_CONFIGS && window.DEFAULT_STAND_CONFIGS) {
                Object.assign(window.STAND_CONFIGS, JSON.parse(JSON.stringify(window.DEFAULT_STAND_CONFIGS)));
            }
            if (window.LOCATION_PATHS && window.DEFAULT_LOCATION_PATHS) {
                Object.assign(window.LOCATION_PATHS, JSON.parse(JSON.stringify(window.DEFAULT_LOCATION_PATHS)));
            }
            if (window.LOCATION_SPAWN_DIRECTIONS && window.DEFAULT_LOCATION_SPAWN_DIRECTIONS) {
                Object.assign(window.LOCATION_SPAWN_DIRECTIONS, JSON.parse(JSON.stringify(window.DEFAULT_LOCATION_SPAWN_DIRECTIONS)));
            }
            if (window.spriteRenderer) {
                window.spriteRenderer.cartWidth = 76;
                window.spriteRenderer.npcHeight = 40;
            }
            if (window.simulationEngine) {
                window.simulationEngine._overrideStandX = undefined;
                window.simulationEngine._overrideStandY = undefined;
            }
        }

        this.selectedPathIndex = 0;
        this.selectedWaypointIndex = -1;
        this.syncUIFromConfig();
        this.render();
        this.showToast('↺ Restored all handcrafted defaults for all locations!', 'success');
    }

    showToast(message, type = 'info') {
        if (typeof document === 'undefined') return;
        const toast = document.getElementById('editorSaveToast');
        if (!toast) return;
        toast.textContent = message;
        toast.className = `editor-toast toast-${type}`;
        toast.style.display = 'block';
        toast.style.opacity = '1';

        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.style.display = 'none'; }, 300);
        }, 3200);
    }

    // -------------------------------------------------------------
    // UI SYNCHRONIZATION
    // -------------------------------------------------------------
    syncUIFromConfig() {
        if (typeof document === 'undefined') return;

        const standCfg = this.getActiveStandConfig();
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val;
        };

        setVal('inputStandX', standCfg.stand.x);
        setVal('inputStandY', standCfg.stand.y);
        setVal('inputCounterX', standCfg.counter.x);
        setVal('inputCounterY', standCfg.counter.y);
        setVal('inputQueueStartX', standCfg.queueStart.x);
        setVal('inputQueueStartY', standCfg.queueStart.y);
        setVal('inputQueueStepX', standCfg.queueStep.x);
        setVal('inputQueueStepY', standCfg.queueStep.y);
        setVal('inputDecisionDist', standCfg.decisionDist);

        this.syncScaleUI();
        this.syncZoomUI();
        this.syncPathUI();
        this.syncQueueUI();
        this.syncPropUI();
    }

    syncScaleUI() {
        if (typeof document === 'undefined') return;
        const cartW = this.config.cartWidth || 76;
        const npcH = this.config.npcHeight || 40;

        const sliderCart = document.getElementById('sliderCartWidth');
        const labelCart = document.getElementById('labelCartWidthVal');
        if (sliderCart) sliderCart.value = cartW;
        if (labelCart) labelCart.textContent = `${cartW} px`;

        const sliderNpc = document.getElementById('sliderNpcHeight');
        const labelNpc = document.getElementById('labelNpcHeightVal');
        if (sliderNpc) sliderNpc.value = npcH;
        if (labelNpc) labelNpc.textContent = `${npcH} px`;

        document.querySelectorAll('.scale-preset-btn').forEach(btn => {
            const scaleType = btn.getAttribute('data-scale');
            const val = parseInt(btn.getAttribute('data-val'), 10);
            if (scaleType === 'cart') {
                btn.classList.toggle('active', val === cartW);
            } else if (scaleType === 'npc') {
                btn.classList.toggle('active', val === npcH);
            }
        });
    }

    syncZoomUI() {
        if (typeof document === 'undefined') return;
        const pct = Math.round(this.zoom * 100);
        const zoomVal = document.getElementById('editorZoomVal');
        const zoomHUD = document.getElementById('editorZoomHUD');
        const zoomSlider = document.getElementById('sliderEditorZoom');
        if (zoomVal) zoomVal.textContent = `${pct}%`;
        if (zoomHUD) zoomHUD.textContent = `${this.zoom.toFixed(1)}x`;
        if (zoomSlider) zoomSlider.value = this.zoom.toFixed(2);
    }

    syncPathUI(updateInputs = true) {
        if (typeof document === 'undefined') return;
        const paths = this.getActivePaths();
        const select = document.getElementById('selectActivePath');
        if (select) {
            select.innerHTML = '';
            paths.forEach((p, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = `Route ${idx + 1} (${p.length} waypoints)`;
                if (idx === this.selectedPathIndex) opt.selected = true;
                select.appendChild(opt);
            });
        }

        const selHUD = document.getElementById('editorSelectedHUD');
        if (selHUD) {
            selHUD.textContent = `Active: Route ${this.selectedPathIndex + 1}`;
        }

        const currentDir = this.getRouteSpawnDirection(this.selectedPathIndex);
        document.querySelectorAll('.editor-spawn-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-dir') === currentDir);
        });

        // Update Selected Waypoint Inspector
        const inspector = document.getElementById('selectedWpInspector');
        const inspectorTitle = document.getElementById('labelSelectedWpTitle');
        const inputX = document.getElementById('inputWpX');
        const inputY = document.getElementById('inputWpY');
        const path = this.getActivePath();

        if (inspector) {
            if (path && this.selectedWaypointIndex >= 0 && this.selectedWaypointIndex < path.length) {
                inspector.style.display = 'flex';
                const wp = path[this.selectedWaypointIndex];
                const tag = this.selectedWaypointIndex === 0 ? ' (START)' : (this.selectedWaypointIndex === path.length - 1 ? ' (END)' : '');
                if (inspectorTitle) inspectorTitle.textContent = `Selected: #${this.selectedWaypointIndex}${tag}`;
                if (updateInputs) {
                    if (inputX) inputX.value = wp.x;
                    if (inputY) inputY.value = wp.y;
                }
            } else {
                inspector.style.display = 'none';
            }
        }

        // Populate waypoints list
        const list = document.getElementById('editorWaypointList');
        if (list) {
            list.innerHTML = '';
            if (path) {
                path.forEach((pt, idx) => {
                    const row = document.createElement('div');
                    const isSelected = idx === this.selectedWaypointIndex;
                    row.className = `editor-wp-item ${isSelected ? 'selected' : ''}`;
                    const label = idx === 0 ? 'START' : (idx === path.length - 1 ? 'END' : `#${idx}`);
                    row.innerHTML = `
                        <span class="editor-wp-index">${label}</span>
                        <span class="editor-wp-coords">(${pt.x}, ${pt.y})</span>
                        <button type="button" class="editor-wp-del" data-idx="${idx}" title="Delete waypoint">✕</button>
                    `;
                    row.addEventListener('click', (e) => {
                        if (e.target.classList.contains('editor-wp-del')) {
                            this.deleteWaypoint(idx);
                        } else {
                            this.selectedWaypointIndex = idx;
                            this.syncPathUI();
                            this.render();
                        }
                    });
                    list.appendChild(row);
                });
            }
        }
    }

    syncQueueUI() {
        if (typeof document === 'undefined') return;
        const list = document.getElementById('editorQueueSpotsList');
        if (!list) return;
        list.innerHTML = '';
        const standCfg = this.getActiveStandConfig();
        const spots = this.getQueueSpots(standCfg);
        spots.forEach((pt, idx) => {
            const row = document.createElement('div');
            const isSelected = idx === this.selectedQueueIndex;
            row.className = `editor-queue-item ${isSelected ? 'selected' : ''}`;
            row.innerHTML = `
                <span class="editor-queue-badge">Q${idx}</span>
                <span class="editor-queue-coords">(${pt.x}, ${pt.y})</span>
                <button type="button" class="editor-queue-del" data-idx="${idx}" title="Delete spot">✕</button>
            `;
            row.addEventListener('click', (e) => {
                if (e.target.classList.contains('editor-queue-del')) {
                    this.deleteQueueSpot(idx);
                } else {
                    this.selectedQueueIndex = idx;
                    this.syncQueueUI();
                    this.render();
                }
            });
            list.appendChild(row);
        });
    }

    syncPropUI() {
        if (typeof document === 'undefined') return;
        const standCfg = this.getActiveStandConfig();
        const prop = this.getSelectedProp();
        const propTitle = document.getElementById('selectedPropTitle');
        const controlsBody = document.getElementById('propControlsBody');
        const selectType = document.getElementById('selectChangePropType');
        const inputX = document.getElementById('inputPropX');
        const inputY = document.getElementById('inputPropY');
        const sliderScale = document.getElementById('sliderPropScale');
        const labelScale = document.getElementById('labelPropScaleVal');
        const selectSkin = document.getElementById('selectCartSkin');

        if (selectSkin && standCfg.cartSkin) {
            selectSkin.value = standCfg.cartSkin;
        }

        if (prop) {
            if (propTitle) propTitle.textContent = `${prop.name || prop.type} (${prop.x}, ${prop.y})`;
            if (controlsBody) controlsBody.style.display = 'block';
            if (selectType) selectType.value = prop.type;
            if (inputX) inputX.value = prop.x;
            if (inputY) inputY.value = prop.y;
            const sc = prop.scale || 1.0;
            if (sliderScale) sliderScale.value = sc;
            if (labelScale) labelScale.textContent = `${sc.toFixed(2)}x`;
        } else {
            if (propTitle) propTitle.textContent = 'None';
            if (controlsBody) controlsBody.style.display = 'none';
        }

        // Render Placed Props Chips
        const list = document.getElementById('editorPlacedPropsList');
        if (list) {
            list.innerHTML = '';
            const props = this.getActiveProps();
            if (props.length === 0) {
                const empty = document.createElement('span');
                empty.className = 'editor-unit';
                empty.textContent = 'No props placed yet. Select above to add!';
                list.appendChild(empty);
            } else {
                props.forEach(p => {
                    const chip = document.createElement('span');
                    chip.className = `editor-placed-prop-chip ${p.id === this.selectedPropId ? 'selected' : ''}`;
                    const cat = (typeof PROP_CATALOG !== 'undefined' && PROP_CATALOG[p.type]) ? PROP_CATALOG[p.type] : null;
                    const icon = cat?.icon || '📦';
                    chip.textContent = `${icon} ${p.name || p.type}`;
                    chip.addEventListener('click', () => {
                        this.selectedPropId = p.id;
                        this.selectedWaypointIndex = -1;
                        this.selectedQueueIndex = -1;
                        this.syncPropUI();
                        this.render();
                    });
                    list.appendChild(chip);
                });
            }
        }
    }

    syncConfigFromInputs() {
        const standCfg = this.getActiveStandConfig();
        const getNum = (id, fallback) => {
            const el = document.getElementById(id);
            if (!el) return fallback;
            const val = parseFloat(el.value);
            return isNaN(val) ? fallback : Math.round(val);
        };

        standCfg.stand.x = getNum('inputStandX', standCfg.stand.x);
        standCfg.stand.y = getNum('inputStandY', standCfg.stand.y);
        standCfg.counter.x = getNum('inputCounterX', standCfg.counter.x);
        standCfg.counter.y = getNum('inputCounterY', standCfg.counter.y);
        standCfg.queueStart.x = getNum('inputQueueStartX', standCfg.queueStart.x);
        standCfg.queueStart.y = getNum('inputQueueStartY', standCfg.queueStart.y);
        standCfg.queueStep.x = getNum('inputQueueStepX', standCfg.queueStep.x);
        standCfg.queueStep.y = getNum('inputQueueStepY', standCfg.queueStep.y);
        standCfg.decisionDist = Math.max(15, Math.min(100, getNum('inputDecisionDist', standCfg.decisionDist)));

        this.render();
    }

    // -------------------------------------------------------------
    // EVENT BINDINGS
    // -------------------------------------------------------------
    bindCanvasEvents() {
        if (!this.canvas) return;

        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
        this.canvas.addEventListener('contextmenu', (e) => this.onContextMenu(e));
        this.canvas.addEventListener('dblclick', (e) => {
            const { x, y } = this.screenToWorld(e.clientX, e.clientY);
            this.addWaypointAt(x, y);
        });

        // Mobile & Touch Gesture Support
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        window.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });

        this.canvas.addEventListener('mouseenter', () => {
            this.isMouseOverCanvas = true;
            this.render();
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseOverCanvas = false;
            this.hoveredItem = null;
            this.render();
        });

        // Keyboard Shortcuts
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    onTouchStart(e) {
        if (!e || !e.touches) return;
        if (e.touches.length === 1) {
            const t = e.touches[0];
            this.isMouseOverCanvas = true;
            this.onMouseDown({
                button: 0,
                clientX: t.clientX,
                clientY: t.clientY,
                preventDefault: () => { if (typeof e.preventDefault === 'function') e.preventDefault(); }
            });
        } else if (e.touches.length === 2) {
            if (typeof e.preventDefault === 'function') e.preventDefault();
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            this.touchStartDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            this.touchStartZoom = this.zoom;
        }
    }

    onTouchMove(e) {
        if (!e || !e.touches) return;
        if (e.touches.length === 1) {
            const t = e.touches[0];
            this.onMouseMove({
                clientX: t.clientX,
                clientY: t.clientY
            });
        } else if (e.touches.length === 2 && this.touchStartDist > 0) {
            if (typeof e.preventDefault === 'function') e.preventDefault();
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
            const scale = dist / this.touchStartDist;
            const midX = (t1.clientX + t2.clientX) / 2;
            const midY = (t1.clientY + t2.clientY) / 2;
            let rawX = midX;
            let rawY = midY;
            if (this.canvas && typeof this.canvas.getBoundingClientRect === 'function') {
                const rect = this.canvas.getBoundingClientRect();
                rawX = (midX - (rect.left || 0)) * (640 / (rect.width || 640));
                rawY = (midY - (rect.top || 0)) * (360 / (rect.height || 360));
            }
            this.setZoom(this.touchStartZoom * scale, rawX, rawY);
        }
    }

    onTouchEnd(e) {
        this.touchStartDist = 0;
        this.onMouseUp(e);
    }

    onMouseDown(e) {
        if (e.button === 1 || this.isSpacePressed || this.activeTool === 'pan') {
            this.isPanning = true;
            this.panStart = { x: e.clientX - this.panOffset.x, y: e.clientY - this.panOffset.y };
            if (this.canvas) this.canvas.style.cursor = 'grabbing';
            return;
        }

        if (e.button !== 0) return; // Only primary click
        const { x, y, rawX, rawY } = this.screenToWorld(e.clientX, e.clientY);

        if (this.activeTool === 'add_wp') {
            this.addWaypointAt(x, y);
            return;
        }

        const hit = this.hitTest(x, y);
        if (hit) {
            if (hit.type === 'other_path') {
                this.selectPath(hit.pathIdx);
                this.selectedWaypointIndex = hit.wpIdx;
                this.selectedPropId = null;
                this.syncPathUI();
                this.syncPropUI();
                this.render();
                return;
            }

            this.draggedItem = {
                ...hit,
                startWorldX: x,
                startWorldY: y,
                origStandCfg: JSON.parse(JSON.stringify(this.getActiveStandConfig())),
                origPath: this.getActivePath() ? JSON.parse(JSON.stringify(this.getActivePath())) : null,
                origPropX: hit.prop ? hit.prop.x : 0,
                origPropY: hit.prop ? hit.prop.y : 0
            };

            if (hit.type === 'waypoint') {
                this.selectedWaypointIndex = hit.wpIdx;
                this.selectedPropId = null;
                this.syncPathUI();
                this.syncPropUI();
            } else if (hit.type === 'prop') {
                this.selectedPropId = hit.propId;
                this.selectedWaypointIndex = -1;
                this.syncPropUI();
                this.syncPathUI();
            } else if (hit.type === 'queue') {
                this.selectedQueueIndex = hit.qIdx;
                this.syncQueueUI();
            } else {
                this.selectedPropId = null;
                this.syncPropUI();
            }
            this.render();
        } else {
            // Clicked empty space
            this.selectedWaypointIndex = -1;
            this.selectedPropId = null;
            this.selectedQueueIndex = -1;
            this.syncPathUI();
            this.syncPropUI();
            this.syncQueueUI();
            this.render();
        }
    }

    onMouseMove(e) {
        const { x, y, rawX, rawY } = this.screenToWorld(e.clientX, e.clientY);
        this.mousePos = { worldX: Math.round(x), worldY: Math.round(y), screenX: rawX, screenY: rawY };

        // Update HUD
        const hudCoords = document.getElementById('editorCoordsHUD');
        if (hudCoords) {
            hudCoords.textContent = `X: ${this.mousePos.worldX} | Y: ${this.mousePos.worldY}`;
        }

        if (this.isPanning) {
            this.panOffset.x = e.clientX - this.panStart.x;
            this.panOffset.y = e.clientY - this.panStart.y;
            this.render();
            return;
        }

        if (this.draggedItem) {
            const dx = x - this.draggedItem.startWorldX;
            const dy = y - this.draggedItem.startWorldY;
            const standCfg = this.getActiveStandConfig();

            if (this.draggedItem.type === 'stand') {
                const orig = this.draggedItem.origStandCfg;
                standCfg.stand.x = Math.round(orig.stand.x + dx);
                standCfg.stand.y = Math.round(orig.stand.y + dy);
                standCfg.counter.x = Math.round(orig.counter.x + dx);
                standCfg.counter.y = Math.round(orig.counter.y + dy);
                standCfg.queueStart.x = Math.round(orig.queueStart.x + dx);
                standCfg.queueStart.y = Math.round(orig.queueStart.y + dy);
                const spots = this.getQueueSpots(standCfg);
                const origSpots = orig.queueSpots || spots;
                for (let i = 0; i < spots.length; i++) {
                    if (origSpots[i]) {
                        spots[i].x = Math.round(origSpots[i].x + dx);
                        spots[i].y = Math.round(origSpots[i].y + dy);
                    }
                }
                this.syncUIFromConfig();
            } else if (this.draggedItem.type === 'counter') {
                standCfg.counter.x = Math.round(this.draggedItem.origStandCfg.counter.x + dx);
                standCfg.counter.y = Math.round(this.draggedItem.origStandCfg.counter.y + dy);
                this.syncUIFromConfig();
            } else if (this.draggedItem.type === 'queue') {
                const spots = this.getQueueSpots(standCfg);
                const qIdx = this.draggedItem.qIdx;
                const origSpots = this.draggedItem.origStandCfg.queueSpots || spots;
                if (spots[qIdx] && origSpots[qIdx]) {
                    spots[qIdx].x = Math.round(origSpots[qIdx].x + dx);
                    spots[qIdx].y = Math.round(origSpots[qIdx].y + dy);
                    if (qIdx === 0) {
                        standCfg.queueStart.x = spots[0].x;
                        standCfg.queueStart.y = spots[0].y;
                    }
                }
                this.syncQueueUI();
            } else if (this.draggedItem.type === 'prop') {
                const prop = this.draggedItem.prop;
                if (prop) {
                    prop.x = Math.round(this.draggedItem.origPropX + dx);
                    prop.y = Math.round(this.draggedItem.origPropY + dy);
                    this.syncPropUI();
                }
            } else if (this.draggedItem.type === 'waypoint') {
                const path = this.getActivePath();
                if (path && this.draggedItem.wpIdx < path.length) {
                    path[this.draggedItem.wpIdx].x = Math.round(this.draggedItem.origPath[this.draggedItem.wpIdx].x + dx);
                    path[this.draggedItem.wpIdx].y = Math.round(this.draggedItem.origPath[this.draggedItem.wpIdx].y + dy);
                    this.syncPathUI();
                }
            }
            this.render();
            return;
        }

        // Hover hit test
        if (this.isMouseOverCanvas) {
            const hit = this.hitTest(x, y);
            this.hoveredItem = hit;
            if (this.canvas) {
                if (this.isSpacePressed) {
                    this.canvas.style.cursor = 'grab';
                } else if (this.activeTool === 'pan') {
                    this.canvas.style.cursor = 'grab';
                } else if (this.activeTool === 'add_wp') {
                    this.canvas.style.cursor = 'crosshair';
                } else if (hit) {
                    this.canvas.style.cursor = 'pointer';
                } else {
                    this.canvas.style.cursor = 'crosshair';
                }
            }
            this.render();
        }
    }

    onMouseUp(e) {
        if (this.isPanning) {
            this.isPanning = false;
        }
        if (this.draggedItem) {
            this.draggedItem = null;
        }
        if (this.canvas) {
            this.canvas.style.cursor = this.isSpacePressed ? 'grab' : (this.activeTool === 'pan' ? 'grab' : (this.activeTool === 'add_wp' ? 'crosshair' : 'default'));
        }
        this.render();
    }

    onWheel(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const rawX = (e.clientX - rect.left) * (640 / (rect.width || 640));
        const rawY = (e.clientY - rect.top) * (360 / (rect.height || 360));

        const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
        this.setZoom(this.zoom + zoomDelta, rawX, rawY);
    }

    onContextMenu(e) {
        e.preventDefault();
        const { x, y } = this.screenToWorld(e.clientX, e.clientY);
        const hit = this.hitTest(x, y);
        if (hit && hit.type === 'waypoint') {
            this.deleteWaypoint(hit.wpIdx);
        }
    }

    onKeyDown(e) {
        // Only respond when Map Editor tab is active
        if (typeof document !== 'undefined') {
            const tab = document.getElementById('tab_editor');
            if (tab && !tab.classList.contains('active')) return;
        }

        if (e.code === 'Space' || e.key === ' ') {
            if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                e.preventDefault();
                this.isSpacePressed = true;
                if (this.canvas && !this.isPanning) {
                    this.canvas.style.cursor = 'grab';
                }
            }
            return;
        }

        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (this.selectedWaypointIndex >= 0 && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
                e.preventDefault();
                this.deleteWaypoint(this.selectedWaypointIndex);
            }
        } else if (e.key === '+' || e.key === '=') {
            this.setZoom(this.zoom + 0.1, 320, 180);
        } else if (e.key === '-' || e.key === '_') {
            this.setZoom(this.zoom - 0.1, 320, 180);
        } else if (e.key === '0') {
            this.resetView();
        }
    }

    onKeyUp(e) {
        if (e.code === 'Space' || e.key === ' ') {
            this.isSpacePressed = false;
            if (this.isPanning && this.activeTool !== 'pan') {
                this.isPanning = false;
            }
            if (this.canvas) {
                this.canvas.style.cursor = this.activeTool === 'pan' ? 'grab' : (this.activeTool === 'add_wp' ? 'crosshair' : 'default');
            }
        }
    }

    bindUIEvents() {
        if (typeof document === 'undefined') return;

        // Location Buttons & Dropdown
        const locSelect = document.getElementById('editorLocSelect');
        if (locSelect) {
            locSelect.addEventListener('change', (e) => {
                this.setLocation(e.target.value);
            });
        }

        document.querySelectorAll('.editor-loc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const loc = e.currentTarget.getAttribute('data-loc');
                this.setLocation(loc);
            });
        });

        // Tool Mode Buttons
        const setTool = (tool) => {
            this.activeTool = tool;
            ['btnToolSelect', 'btnToolAddWp', 'btnToolPan'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('active');
            });
            if (tool === 'select') document.getElementById('btnToolSelect')?.classList.add('active');
            if (tool === 'add_wp') document.getElementById('btnToolAddWp')?.classList.add('active');
            if (tool === 'pan') document.getElementById('btnToolPan')?.classList.add('active');
            this.render();
        };

        document.getElementById('btnToolSelect')?.addEventListener('click', () => setTool('select'));
        document.getElementById('btnToolAddWp')?.addEventListener('click', () => setTool('add_wp'));
        document.getElementById('btnToolPan')?.addEventListener('click', () => setTool('pan'));

        // Zoom Buttons & Slider
        document.getElementById('btnEditorZoomIn')?.addEventListener('click', () => this.setZoom(this.zoom + 0.2, 320, 180));
        document.getElementById('btnEditorZoomOut')?.addEventListener('click', () => this.setZoom(this.zoom - 0.2, 320, 180));
        document.getElementById('sliderEditorZoom')?.addEventListener('input', (e) => this.setZoom(parseFloat(e.target.value), 320, 180));
        document.getElementById('btnEditorResetView')?.addEventListener('click', () => this.resetView());

        // Toggle Buttons
        const toggleBtn = (id, prop) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', () => {
                    this[prop] = !this[prop];
                    el.classList.toggle('active', this[prop]);
                    this.render();
                });
            }
        };
        toggleBtn('btnToggleGrid', 'showGrid');
        toggleBtn('btnToggleCrosshair', 'showCrosshair');
        toggleBtn('btnToggleForeground', 'showForeground');

        // Test Simulation Buttons
        document.getElementById('btnTestSimulation')?.addEventListener('click', () => this.toggleTestSimulation());
        document.getElementById('btnRespawnTestWalkers')?.addEventListener('click', () => this.respawnTestWalkers());

        // Numeric Stand Inputs
        const numIds = ['inputStandX', 'inputStandY', 'inputCounterX', 'inputCounterY', 'inputQueueStartX', 'inputQueueStartY', 'inputQueueStepX', 'inputQueueStepY', 'inputDecisionDist'];
        numIds.forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => this.syncConfigFromInputs());
        });

        // Path Controls & Spawn Direction
        document.getElementById('selectActivePath')?.addEventListener('change', (e) => {
            this.selectPath(parseInt(e.target.value, 10));
        });
        document.querySelectorAll('.editor-spawn-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dir = e.currentTarget.getAttribute('data-dir');
                this.setRouteSpawnDirection(dir);
            });
        });
        document.getElementById('btnAddPath')?.addEventListener('click', () => this.addPath());
        document.getElementById('btnDeletePath')?.addEventListener('click', () => this.deletePath());
        document.getElementById('btnReversePath')?.addEventListener('click', () => this.reversePath());
        document.getElementById('btnAlignStartLeft')?.addEventListener('click', () => this.alignStartOffscreen());
        document.getElementById('btnAlignEndRight')?.addEventListener('click', () => this.alignEndOffscreen());
        document.getElementById('btnAddWpAtEnd')?.addEventListener('click', () => this.addWaypointToEnd());
        document.getElementById('btnInsertWpAfter')?.addEventListener('click', () => this.insertWaypointAfter());
        document.getElementById('btnDeleteSelectedWp')?.addEventListener('click', () => this.deleteWaypoint());

        document.getElementById('inputWpX')?.addEventListener('input', (e) => {
            const path = this.getActivePath();
            if (path && this.selectedWaypointIndex >= 0 && this.selectedWaypointIndex < path.length) {
                path[this.selectedWaypointIndex].x = Math.round(Number(e.target.value)) || 0;
                this.syncPathUI(false);
                this.render();
            }
        });
        document.getElementById('inputWpY')?.addEventListener('input', (e) => {
            const path = this.getActivePath();
            if (path && this.selectedWaypointIndex >= 0 && this.selectedWaypointIndex < path.length) {
                path[this.selectedWaypointIndex].y = Math.round(Number(e.target.value)) || 0;
                this.syncPathUI(false);
                this.render();
            }
        });

        // Curved Queue Spot Buttons
        document.getElementById('btnAddQueueSpot')?.addEventListener('click', () => this.addQueueSpot());
        document.getElementById('btnDeleteQueueSpot')?.addEventListener('click', () => this.deleteQueueSpot());
        document.getElementById('btnStraightenQueue')?.addEventListener('click', () => this.straightenQueue());

        // Map Props Controls
        document.getElementById('btnAddPropBtn')?.addEventListener('click', () => {
            const catType = document.getElementById('selectPropCatalog')?.value || 'cafe_table';
            this.addProp(catType);
        });
        document.getElementById('selectChangePropType')?.addEventListener('change', (e) => {
            this.setPropType(this.selectedPropId, e.target.value);
        });
        document.getElementById('inputPropX')?.addEventListener('input', (e) => {
            const p = this.getSelectedProp();
            if (p) {
                p.x = Math.round(Number(e.target.value)) || 0;
                this.render();
            }
        });
        document.getElementById('inputPropY')?.addEventListener('input', (e) => {
            const p = this.getSelectedProp();
            if (p) {
                p.y = Math.round(Number(e.target.value)) || 0;
                this.render();
            }
        });
        document.getElementById('sliderPropScale')?.addEventListener('input', (e) => {
            this.setPropScale(this.selectedPropId, parseFloat(e.target.value));
        });
        document.getElementById('btnFlipProp')?.addEventListener('click', () => {
            this.togglePropFlip(this.selectedPropId);
        });
        document.getElementById('btnDuplicateProp')?.addEventListener('click', () => {
            this.duplicateProp(this.selectedPropId);
        });
        document.getElementById('btnDeleteProp')?.addEventListener('click', () => {
            this.deleteProp(this.selectedPropId);
        });

        // Cart Skin & Custom Image Uploads
        document.getElementById('selectCartSkin')?.addEventListener('change', (e) => {
            this.setCartSkin(e.target.value);
        });

        // Custom Prop File Upload (FileReader)
        document.getElementById('inputCustomPropFile')?.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                const prop = this.addProp('custom_image');
                if (prop) {
                    prop.customImageSrc = evt.target.result;
                    prop.name = file.name.replace(/\.[^/.]+$/, "");
                    this.syncPropUI();
                    this.render();
                    this.showToast(`Custom image prop uploaded: ${prop.name}!`);
                }
            };
            reader.readAsDataURL(file);
        });

        // Custom Cart File Upload (FileReader)
        document.getElementById('inputCustomCartFile')?.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                const standCfg = this.getActiveStandConfig();
                standCfg.customCartImageSrc = evt.target.result;
                standCfg.cartSkin = 'custom';
                const skinSelect = document.getElementById('selectCartSkin');
                if (skinSelect) skinSelect.value = 'custom';
                this.render();
                this.showToast(`Custom cart skin uploaded: ${file.name}!`);
            };
            reader.readAsDataURL(file);
        });

        // Sliders
        const sliderCart = document.getElementById('sliderCartWidth');
        if (sliderCart) {
            sliderCart.addEventListener('input', (e) => this.setCartWidth(parseFloat(e.target.value)));
        }
        const sliderNpc = document.getElementById('sliderNpcHeight');
        if (sliderNpc) {
            sliderNpc.addEventListener('input', (e) => this.setNpcHeight(parseFloat(e.target.value)));
        }

        // Preset Scale Buttons
        document.querySelectorAll('.scale-preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scaleType = e.currentTarget.getAttribute('data-scale');
                const val = parseFloat(e.currentTarget.getAttribute('data-val'));
                if (scaleType === 'cart') this.setCartWidth(val);
                else if (scaleType === 'npc') this.setNpcHeight(val);
            });
        });

        // Save & Reset Buttons
        document.getElementById('btnSaveMapConfig')?.addEventListener('click', () => this.saveAndApply());
        document.getElementById('btnResetMapDefaults')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to restore handcrafted default positions and routes for all 20 maps?')) {
                this.resetDefaults();
            }
        });

        // JSON Export / Import Modal
        const modal = document.getElementById('editorJsonModal');
        const txt = document.getElementById('textareaMapJson');
        document.getElementById('btnExportMapJson')?.addEventListener('click', () => {
            if (txt) txt.value = this.exportJSON();
            if (modal) modal.classList.add('active');
        });
        document.getElementById('btnImportMapJson')?.addEventListener('click', () => {
            if (txt) txt.value = '';
            if (modal) modal.classList.add('active');
        });
        document.getElementById('btnCloseEditorJson')?.addEventListener('click', () => {
            if (modal) modal.classList.remove('active');
        });
        document.getElementById('btnCloseMapJsonModal')?.addEventListener('click', () => {
            if (modal) modal.classList.remove('active');
        });
        document.getElementById('btnCopyMapJson')?.addEventListener('click', () => {
            if (txt) {
                txt.select();
                navigator.clipboard?.writeText(txt.value).then(() => {
                    this.showToast('📋 JSON copied to clipboard!', 'success');
                }).catch(() => {
                    this.showToast('Select & copy with Ctrl+C');
                });
            }
        });
        document.getElementById('btnApplyMapJson')?.addEventListener('click', () => {
            if (txt && txt.value.trim()) {
                if (this.importJSON(txt.value)) {
                    if (modal) modal.classList.remove('active');
                }
            } else {
                this.showToast('Paste valid JSON configuration first!', 'error');
            }
        });

        // Collapsible Card Accordion Toggle
        document.querySelectorAll('.editor-card .tycoon-card-title').forEach(title => {
            title.addEventListener('click', (e) => {
                const card = e.currentTarget.closest('.editor-card');
                if (card) {
                    card.classList.toggle('collapsed');
                }
            });
        });
    }

    // -------------------------------------------------------------
    // CANVAS RENDERING
    // -------------------------------------------------------------
    render() {
        if (!this.ctx || !this.canvas) return;
        const ctx = this.ctx;
        const dpr = (this.canvas.width > 640) ? (this.canvas.width / 640) : (this.dpr || 1);

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.save();
        if (dpr !== 1) {
            ctx.scale(dpr, dpr);
        }
        ctx.imageSmoothingEnabled = false;

        // Apply Zoom & Pan
        ctx.translate(this.panOffset.x, this.panOffset.y);
        ctx.scale(this.zoom, this.zoom);

        // 1. Background Backdrop
        if (window.spriteRenderer && typeof window.spriteRenderer.renderBackground === 'function') {
            window.spriteRenderer.renderBackground(ctx, 640, 360, this.currentLocation, { type: 'sunny' }, 0.5);
        } else {
            ctx.fillStyle = '#21130b';
            ctx.fillRect(0, 0, 640, 360);
        }

        // 2. Coordinate Grid
        if (this.showGrid) {
            this.renderGrid(ctx);
        }

        // 3. Pedestrian Waypoint Paths
        this.renderPaths(ctx);

        // 4. Stand & Queue Handles
        this.renderStandAndQueue(ctx);

        // 5. Test Simulation Walkers
        if (this.isTestingWalkers) {
            this.renderTestWalkers(ctx);
        }

        // 6. Foreground Occlusion Pass
        if (this.showForeground && window.spriteRenderer && typeof window.spriteRenderer.renderForegroundLayer === 'function') {
            ctx.save();
            ctx.globalAlpha = 0.72;
            window.spriteRenderer.renderForegroundLayer(ctx, 640, 360, this.currentLocation, { type: 'sunny' });
            ctx.restore();
        }

        // 7. Coordinate Crosshairs
        if (this.showCrosshair && this.isMouseOverCanvas) {
            this.renderCrosshair(ctx);
        }

        ctx.restore();

        // 8. Screen HUD overlay
        ctx.save();
        if (dpr !== 1) {
            ctx.scale(dpr, dpr);
        }
        this.renderScreenHUD(ctx);
        ctx.restore();
    }

    renderGrid(ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 0.8 / this.zoom;
        const step = 40;

        for (let x = -80; x <= 720; x += step) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 360);
            ctx.stroke();
        }
        for (let y = 0; y <= 360; y += step) {
            ctx.beginPath();
            ctx.moveTo(-80, y);
            ctx.lineTo(720, y);
            ctx.stroke();
        }

        // Ground walkable zone indicator (Y: 200..340)
        ctx.fillStyle = 'rgba(46, 204, 113, 0.04)';
        ctx.fillRect(-80, 200, 800, 140);
        ctx.strokeStyle = 'rgba(46, 204, 113, 0.25)';
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-80, 200, 800, 140);
        ctx.setLineDash([]);

        // Coordinate Ruler Markings (Measurement Tools)
        ctx.font = 'bold 7.5px monospace';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        for (let rx = 0; rx <= 640; rx += 80) {
            // Tick mark at top
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(rx, 0);
            ctx.lineTo(rx, 6);
            ctx.stroke();
            ctx.fillText(`${rx}`, rx, 7);
        }

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        for (let ry = 80; ry <= 320; ry += 80) {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, ry);
            ctx.lineTo(6, ry);
            ctx.stroke();
            ctx.fillText(`${ry}`, 7, ry);
        }

        ctx.restore();
    }

    renderPaths(ctx) {
        const allPaths = this.getActivePaths();
        if (!allPaths) return;

        ctx.save();

        // Render Inactive Paths First
        if (this.showAllPaths) {
            allPaths.forEach((path, pIdx) => {
                if (pIdx === this.selectedPathIndex || !path || path.length < 2) return;
                const col = this.pathColors[pIdx % this.pathColors.length];
                ctx.strokeStyle = col.stroke;
                ctx.globalAlpha = 0.35;
                ctx.lineWidth = 1.8;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                for (let i = 1; i < path.length; i++) {
                    ctx.lineTo(path[i].x, path[i].y);
                }
                ctx.stroke();

                // Small waypoint dots
                path.forEach(pt => {
                    ctx.fillStyle = col.fill;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                });
            });
        }

        // Render Active Path (Highlighted)
        const activePath = this.getActivePath();
        if (activePath && activePath.length >= 2) {
            const col = this.pathColors[this.selectedPathIndex % this.pathColors.length];
            const spawnDir = this.getRouteSpawnDirection(this.selectedPathIndex);

            // Path glow
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = col.stroke;
            ctx.lineWidth = 6;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(activePath[0].x, activePath[0].y);
            for (let i = 1; i < activePath.length; i++) {
                ctx.lineTo(activePath[i].x, activePath[i].y);
            }
            ctx.stroke();

            // Core line
            ctx.globalAlpha = 0.95;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.stroke();

            // Directional segment flow arrows
            for (let i = 0; i < activePath.length - 1; i++) {
                const p1 = activePath[i];
                const p2 = activePath[i + 1];
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;
                const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

                ctx.save();
                ctx.translate(midX, midY);
                if (spawnDir === 'right_to_left') {
                    ctx.rotate(angle + Math.PI);
                } else {
                    ctx.rotate(angle);
                }
                ctx.fillStyle = col.fill;
                ctx.beginPath();
                ctx.moveTo(-6, -4);
                ctx.lineTo(5, 0);
                ctx.lineTo(-6, 4);
                ctx.closePath();
                ctx.fill();

                if (spawnDir === 'both') {
                    ctx.beginPath();
                    ctx.moveTo(3, -4);
                    ctx.lineTo(-8, 0);
                    ctx.lineTo(3, 4);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.restore();
            }

            // Draw Waypoint Nodes
            activePath.forEach((pt, idx) => {
                const isSelected = idx === this.selectedWaypointIndex;
                const isHovered = this.hoveredItem && this.hoveredItem.type === 'waypoint' && this.hoveredItem.wpIdx === idx;
                const isStart = idx === 0;
                const isEnd = idx === activePath.length - 1;

                const nodeRadius = isSelected ? 8 : (isHovered ? 7 : 5.5);

                // Selection glow ring
                if (isSelected) {
                    ctx.fillStyle = 'rgba(241, 196, 15, 0.4)';
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, nodeRadius + 5, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Node circle color according to entry/exit flow
                let nodeColor = '#ffffff';
                if (spawnDir === 'left_to_right') {
                    nodeColor = isStart ? '#10b981' : (isEnd ? '#ef4444' : '#ffffff');
                } else if (spawnDir === 'right_to_left') {
                    nodeColor = isStart ? '#ef4444' : (isEnd ? '#10b981' : '#ffffff');
                } else {
                    nodeColor = (isStart || isEnd) ? '#06b6d4' : '#ffffff';
                }

                ctx.fillStyle = nodeColor;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = isSelected ? '#f1c40f' : (isHovered ? '#00ffcc' : '#1e293b');
                ctx.stroke();

                // Node Badge Label
                ctx.font = 'bold 8px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = (isStart || isEnd) ? '#ffffff' : '#0f172a';
                let badgeText = `${idx}`;
                if (isStart) {
                    badgeText = spawnDir === 'right_to_left' ? 'OUT' : (spawnDir === 'left_to_right' ? 'IN➡' : '⇄0');
                } else if (isEnd) {
                    badgeText = spawnDir === 'right_to_left' ? 'IN⬅' : (spawnDir === 'left_to_right' ? 'OUT' : `⇄${idx}`);
                }
                ctx.fillText(badgeText, pt.x, pt.y);
            });
        }

        ctx.restore();
    }

    renderStandAndQueue(ctx) {
        const standCfg = this.getActiveStandConfig();
        const cartW = this.config.cartWidth || 76;
        const cartH = Math.round(cartW * 1.24);
        const standX = standCfg.stand.x;
        const standY = standCfg.stand.y;

        ctx.save();

        // 1. Stand Cart Graphic / Sprite
        if (window.spriteRenderer && typeof window.spriteRenderer.renderStand === 'function') {
            const activeUpgrades = (window.simulationModel && window.simulationModel.upgrades) ? window.simulationModel.upgrades : { decor: 1 };
            window.spriteRenderer.renderStand(ctx, standX, standY, activeUpgrades, false, false, false, { type: 'sunny' }, standCfg.cartSkin || 'default', false);
        } else {
            ctx.fillStyle = '#8c5330';
            ctx.fillRect(standX - 18, standY - 44, cartW, cartH);
        }

        // 2. Stand Bounding Box & Anchor
        const isStandHovered = this.hoveredItem && this.hoveredItem.type === 'stand';
        const isStandDragged = this.draggedItem && this.draggedItem.type === 'stand';

        ctx.strokeStyle = isStandDragged ? '#00ffcc' : (isStandHovered ? '#f1c40f' : 'rgba(241, 196, 15, 0.6)');
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(standX - 18, standY - 44, cartW, cartH);
        ctx.setLineDash([]);

        // Anchor node (Stand center)
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(standX, standY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        // 3. Counter Position Handle
        const isCounterHover = this.hoveredItem && this.hoveredItem.type === 'counter';
        ctx.fillStyle = isCounterHover ? '#00ffcc' : '#e67e22';
        ctx.beginPath();
        ctx.arc(standCfg.counter.x, standCfg.counter.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 4. Decision Distance Ring
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(standCfg.counter.x, standCfg.counter.y, standCfg.decisionDist, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // 5. Curved Queue Spots (Q0..Qn)
        const spots = this.getQueueSpots(standCfg);

        // Serpentine Line connecting Counter -> Q0 -> Q1 -> ... -> Qn
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(standCfg.counter.x, standCfg.counter.y);
        for (let i = 0; i < spots.length; i++) {
            ctx.lineTo(spots[i].x, spots[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Directional chevrons along queue path
        for (let i = 0; i < spots.length - 1; i++) {
            const p1 = spots[i];
            const p2 = spots[i + 1];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

            ctx.save();
            ctx.translate(midX, midY);
            ctx.rotate(angle);
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(-4, -3);
            ctx.lineTo(4, 0);
            ctx.lineTo(-4, 3);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // Queue spot circular nodes
        for (let i = 0; i < spots.length; i++) {
            const qx = spots[i].x;
            const qy = spots[i].y;
            const isQHover = this.hoveredItem && this.hoveredItem.type === 'queue' && this.hoveredItem.qIdx === i;
            const isQDrag = this.draggedItem && this.draggedItem.type === 'queue' && this.draggedItem.qIdx === i;
            const isQSelected = this.selectedQueueIndex === i;

            if (isQSelected) {
                ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
                ctx.beginPath();
                ctx.arc(qx, qy, 11, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = i === 0 ? '#38bdf8' : (isQSelected ? '#f59e0b' : '#0284c7');
            ctx.beginPath();
            ctx.arc(qx, qy, isQDrag ? 7.5 : (isQHover ? 7 : 5.5), 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = isQSelected ? '#f59e0b' : '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Crisp High-Contrast Queue Label Pill
            const labelText = `Q${i}`;
            ctx.font = 'bold 8px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const labelY = Math.round(qy + 10);
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(Math.round(qx - 9), labelY - 5, 18, 10);
            ctx.strokeStyle = isQSelected ? '#f59e0b' : 'rgba(56, 189, 248, 0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(Math.round(qx - 9), labelY - 5, 18, 10);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(labelText, Math.round(qx), labelY + 0.5);
        }

        // 6. Placed Map Props
        this.renderPlacedProps(ctx);

        ctx.restore();
    }

    renderPlacedProps(ctx) {
        const props = this.getActiveProps();
        if (!props || props.length === 0) return;

        // Sort by Y for isometric perspective
        const sorted = [...props].sort((a, b) => a.y - b.y);
        sorted.forEach(p => {
            ctx.save();
            if (window.spriteRenderer && typeof window.spriteRenderer.renderProp === 'function') {
                window.spriteRenderer.renderProp(ctx, p, false, { type: 'sunny' });
            } else {
                ctx.fillStyle = '#8b5cf6';
                ctx.fillRect(p.x - 12, p.y - 12, 24, 24);
            }

            const isSelected = p.id === this.selectedPropId;
            const isHovered = this.hoveredItem && this.hoveredItem.type === 'prop' && this.hoveredItem.propId === p.id;
            const isDragged = this.draggedItem && this.draggedItem.type === 'prop' && this.draggedItem.propId === p.id;

            if (isSelected || isHovered || isDragged) {
                const cat = (typeof PROP_CATALOG !== 'undefined' && PROP_CATALOG[p.type]) ? PROP_CATALOG[p.type] : { defaultWidth: 30, defaultHeight: 30 };
                const scale = p.scale || 1.0;
                const pw = (cat.defaultWidth || 30) * scale;
                const ph = (cat.defaultHeight || 30) * scale;

                ctx.strokeStyle = isSelected ? '#f59e0b' : (isHovered ? '#00ffcc' : '#38bdf8');
                ctx.lineWidth = isSelected ? 2 : 1.2;
                ctx.setLineDash(isSelected ? [] : [3, 2]);
                ctx.strokeRect(p.x - pw / 2 - 2, p.y - ph - 2, pw + 4, ph + 4);
                ctx.setLineDash([]);

                ctx.fillStyle = isSelected ? '#f59e0b' : '#38bdf8';
                ctx.font = 'bold 7.5px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(`${p.name || p.type}${p.flip ? ' (⇄)' : ''}`, p.x, p.y - ph - 4);
            }
            ctx.restore();
        });
    }

    renderTestWalkers(ctx) {
        ctx.save();
        this.testWalkers.forEach(w => {
            if (window.spriteRenderer && typeof window.spriteRenderer.renderCustomer === 'function') {
                window.spriteRenderer.renderCustomer(ctx, w, true);
            } else {
                ctx.fillStyle = '#f5cba7';
                ctx.beginPath();
                ctx.arc(w.x, w.y - 15, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#3498db';
                ctx.fillRect(w.x - 5, w.y - 9, 10, 16);
            }
        });
        ctx.restore();
    }

    renderCrosshair(ctx) {
        const x = this.mousePos.worldX;
        const y = this.mousePos.worldY;

        ctx.save();
        ctx.strokeStyle = 'rgba(0, 255, 204, 0.45)';
        ctx.lineWidth = 0.8 / this.zoom;
        ctx.setLineDash([3, 3]);

        // Horizontal guide
        ctx.beginPath();
        ctx.moveTo(-100, y);
        ctx.lineTo(740, y);
        ctx.stroke();

        // Vertical guide
        ctx.beginPath();
        ctx.moveTo(x, -50);
        ctx.lineTo(x, 410);
        ctx.stroke();

        // Floating tooltip next to crosshair
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(x + 8, y - 20, 72, 16);
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 8, y - 20, 72, 16);
        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = '#00ffcc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`(${x}, ${y})`, x + 44, y - 12);

        ctx.restore();
    }

    renderScreenHUD(ctx) {
        // Draw crisp overlay badges on the top of canvas
        ctx.save();
        ctx.fillStyle = 'rgba(17, 8, 4, 0.78)';
        ctx.fillRect(8, 8, 230, 22);
        ctx.strokeStyle = '#56331c';
        ctx.lineWidth = 1;
        ctx.strokeRect(8, 8, 230, 22);

        ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#f1c40f';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText(`📍 ${this.locationNames[this.currentLocation]}`, 14, 19);

        ctx.fillStyle = '#c4b19d';
        ctx.fillText(`| 🛒 ${this.config.cartWidth}px | 👥 ${this.config.npcHeight}px`, 126, 19);
        ctx.restore();
    }
}

// Global instance
if (typeof window !== 'undefined') {
    window.MapEditor = MapEditor;
    window.mapEditor = new MapEditor();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MapEditor };
}
