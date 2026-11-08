// Coffede Tycoon - Simulation Economics, Recipes, Locations, Upgrades & Financial Balances
// Modeled directly after classic Lemonade Tycoon depth, balance, and accounting.

class SimulationModel {
    constructor() {
        // Player Finances
        this.cash = 40.00; // Starting capital ($40.00)
        this.reputation = 50; // 0 to 100%
        this.activeLoan = 0.00; // Outstanding emergency micro-loan
        this.loanInterestRate = 0.05; // 5% daily interest on debt

        // Inventory Stock (Starts at 0 across all items so player must shop wisely!)
        this.inventory = {
            beans: 0,     // Scoops of coffee beans
            milk: 0,      // Servings of fresh milk
            sugar: 0,     // Packets of sugar
            ice: 0,       // Ice cubes
            cups: 0,      // Paper cups & lids
            syrup: 0      // Pumps of flavor syrup
        };

        // Queue Stock Reservations (prevents race conditions and negative inventory!)
        this.reservedStock = {
            cups: 0,
            milk: 0,
            sugar: 0,
            ice: 0,
            syrup: 0
        };
        this.reservedBatches = 0; // pending bean batches spoken for by queue

        // Spoilage tracking
        this.spoiledMilk = 0;
        this.meltedIce = 0;
        this.discardedCarafe = 0;

        // Current Batch state
        this.cupsInBatch = 0;
        this.batchYield = 10; // 10 cups per brewed batch (11 at Lvl 4 Machine)

        // Recipe Settings (Starts uncalibrated & watery so player must tune it!)
        this.recipe = {
            beans: 1,       // scoops per batch (1 - 5) -> 1 is watery/weak
            milk: 0,        // servings per cup (0 - 4)
            sugar: 0,       // packets per cup (0 - 4)
            ice: 0,         // cubes per cup (0 - 6)
            syrup: 0,       // pumps per cup (0 - 3)
            price: 2.50,    // cash price ($1.00 - $12.00)
            acceptCrypto: false
        };

        // Location & Upgrades (Starts at free cul_de_sac and decor Level 0 Folding Table!)
        this.currentLocation = 'cul_de_sac';
        this.prepaidRentLocation = 'cul_de_sac';
        this.prepaidRentAmount = 0;
        this.upgrades = {
            machine: 1,     // 1 to 4
            cooler: 1,      // 1 to 4
            grinder: 1,     // 1 to 3
            terminal: 1,    // 1 to 3 (Cash Box -> QRIS/EDC -> Contactless Tap POS)
            canopy: 1,      // 1 to 3
            marketing: 1,   // 1 to 4
            decor: 0        // 0 to 5 (0 = Folding Table & Makeshift Gear)
        };

        // Daily Staff Hiring State (Paid per day)
        this.hiredStaff = {
            cashier: false,
            entertainer: false,
            promoter: false,
            barista: false
        };

        // Location Popularity & Satisfaction Dynamics (Lemonade Tycoon style)
        // Tracks persistent local fame and customer satisfaction per location
        this.locationStats = {
            cul_de_sac: { popularity: 25, satisfaction: 55 },
            suburbs: { popularity: 30, satisfaction: 60 },
            park: { popularity: 20, satisfaction: 50 },
            campus: { popularity: 15, satisfaction: 50 },
            metro: { popularity: 10, satisfaction: 50 },
            downtown: { popularity: 10, satisfaction: 50 }
        };

        // Current & Forecast Weather
        this.weather = this.generateWeather();
        this.tomorrowWeather = this.generateWeather();

        // Daily Marketing & Advertising Budget ($0 to $50/day)
        this.dailyMarketingBudget = 0.00;

        // Day Progression
        this.dayNumber = 1;
        this.totalDaysPlayed = 0;
        this.totalCupsSoldLifetime = 0;
        this.totalRevenueLifetime = 0;

        // Daily Ledger & Stats
        this.dailyStats = this.createNewDailyStats();
        this.ledgerHistory = [];

        this.loadState();
    }

    createNewDailyStats() {
        return {
            openingCash: this.cash,
            openingCrypto: 0,
            pedestriansTotal: 0,
            passedBy: 0,
            cupsSold: 0,
            lostPrice: 0,
            lostTaste: 0,
            lostStock: 0,
            lostPatience: 0,
            lostQueue: 0,
            happyCount: 0,
            angryCount: 0,
            impatientCount: 0,
            overpricedCount: 0,
            revenueCash: 0,
            revenueCrypto: 0,
            tipsCash: 0,
            tipsCrypto: 0,
            paymentCashCount: 0,
            paymentQrisCount: 0,
            paymentTapCount: 0,
            costIngredients: 0,
            costRent: 0,
            costStaff: 0,
            costLoanInterest: 0,
            costSpoilage: 0,
            costMarketing: 0,
            costBoost: 0,
            ratings: [],
            feedbackList: []
        };
    }

    getLocationPopularity(locId) {
        const id = locId || this.currentLocation;
        if (!this.locationStats[id]) {
            this.locationStats[id] = { popularity: 20, satisfaction: 50 };
        }
        return Math.round(this.locationStats[id].popularity);
    }

    getLocationSatisfaction(locId) {
        const id = locId || this.currentLocation;
        if (!this.locationStats[id]) {
            this.locationStats[id] = { popularity: 20, satisfaction: 50 };
        }
        return Math.round(this.locationStats[id].satisfaction);
    }

    setLocationPopularity(locId, val) {
        const id = locId || this.currentLocation;
        if (!this.locationStats[id]) this.locationStats[id] = { popularity: 20, satisfaction: 50 };
        this.locationStats[id].popularity = Math.max(5, Math.min(100, Math.round(val)));
        this.saveState();
    }

    setLocationSatisfaction(locId, val) {
        const id = locId || this.currentLocation;
        if (!this.locationStats[id]) this.locationStats[id] = { popularity: 20, satisfaction: 50 };
        this.locationStats[id].satisfaction = Math.max(5, Math.min(100, Math.round(val)));
        this.saveState();
    }

    recordCustomerReaction(type) {
        const loc = this.currentLocation;
        if (!this.locationStats[loc]) {
            this.locationStats[loc] = { popularity: 20, satisfaction: 50 };
        }
        const stats = this.locationStats[loc];

        if (type === 'happy') {
            this.dailyStats.happyCount = (this.dailyStats.happyCount || 0) + 1;
            stats.satisfaction = Math.min(100, stats.satisfaction + 0.35);
            stats.popularity = Math.min(100, stats.popularity + 0.25);
        } else if (type === 'angry') {
            this.dailyStats.angryCount = (this.dailyStats.angryCount || 0) + 1;
            stats.satisfaction = Math.max(5, stats.satisfaction - 1.2);
            stats.popularity = Math.max(5, stats.popularity - 0.6);
        } else if (type === 'impatient') {
            this.dailyStats.impatientCount = (this.dailyStats.impatientCount || 0) + 1;
            stats.satisfaction = Math.max(5, stats.satisfaction - 0.7);
        } else if (type === 'queue_full') {
            this.dailyStats.impatientCount = (this.dailyStats.impatientCount || 0) + 1;
            this.dailyStats.lostQueue = (this.dailyStats.lostQueue || 0) + 1;
            // Passing pedestrians seeing a packed line do NOT penalize satisfaction;
            // a bustling line creates mild street buzz (+popularity)
            stats.popularity = Math.min(100, stats.popularity + 0.05);
        } else if (type === 'overpriced') {
            this.dailyStats.overpricedCount = (this.dailyStats.overpricedCount || 0) + 1;
            stats.satisfaction = Math.max(5, stats.satisfaction - 0.4);
        }
    }

    // Weather Generation
    generateWeather() {
        const types = [
            { type: 'sunny', tempMin: 24, tempMax: 32, icon: '☀️', desc: 'Warm & Sunny' },
            { type: 'scorching', tempMin: 33, tempMax: 38, icon: '🔥', desc: 'Scorching Heatwave' },
            { type: 'cloudy', tempMin: 18, tempMax: 24, icon: '⛅', desc: 'Mild & Breezy' },
            { type: 'rainy', tempMin: 12, tempMax: 17, icon: '🌧️', desc: 'Chilly Rain' },
            { type: 'freezing', tempMin: 2, tempMax: 10, icon: '❄️', desc: 'Winter Frost' }
        ];

        // Weighted random
        const rand = Math.random();
        let selected;
        if (rand < 0.35) selected = types[0];      // Sunny
        else if (rand < 0.50) selected = types[2]; // Cloudy
        else if (rand < 0.70) selected = types[3]; // Rainy
        else if (rand < 0.85) selected = types[1]; // Scorching
        else selected = types[4];                  // Freezing

        const temp = Math.floor(selected.tempMin + Math.random() * (selected.tempMax - selected.tempMin + 1));
        return {
            type: selected.type,
            temp: temp,
            icon: selected.icon,
            desc: selected.desc
        };
    }

    // Locations Catalog (Lemonade Tycoon Style: 20 Locations with realistic daily coffee cart/kiosk rent)
    getLocations() {
        return {
            // TIER 1: STARTER / QUIET NEIGHBORHOODS ($0 - $15 / day — Municipal/Community Permits)
            cul_de_sac: {
                id: 'cul_de_sac',
                name: 'Quiet Cul-de-Sac',
                tier: 'Tier 1 (Starter)',
                rent: 0.00,
                baseFootTraffic: 25,
                trafficVariance: 6,
                preferredArchetypes: ['senior', 'retiree', 'dog_walker', 'casual_shopper', 'barista_regular'],
                basePriceTolerance: 3.00,
                rainTrafficMod: 0.85,
                sunTrafficMod: 1.10,
                description: 'Sleepy suburban dead-end circle. Zero rent! Perfect for testing recipes on friendly neighbors.'
            },
            community_garden: {
                id: 'community_garden',
                name: 'Community Garden',
                tier: 'Tier 1 (Starter)',
                rent: 5.00,
                baseFootTraffic: 32,
                trafficVariance: 8,
                preferredArchetypes: ['retiree', 'casual_shopper', 'barista_regular', 'art_student', 'senior', 'dog_walker'],
                basePriceTolerance: 3.25,
                rainTrafficMod: 0.70,
                sunTrafficMod: 1.30,
                description: 'Sunlit greenhouse and garden beds. Gentle nature lovers who appreciate fresh herbal syrup!'
            },
            public_library: {
                id: 'public_library',
                name: 'Town Public Library',
                tier: 'Tier 1 (Starter)',
                rent: 10.00,
                baseFootTraffic: 38,
                trafficVariance: 10,
                preferredArchetypes: ['bookworm', 'student', 'professor', 'senior', 'grad_student'],
                basePriceTolerance: 3.50,
                rainTrafficMod: 1.15, // Readers love rainy coffee!
                sunTrafficMod: 1.05,
                description: 'Civic reading courtyard. Avid bookworms and quiet study groups looking for a hot brew.'
            },
            suburbs: {
                id: 'suburbs',
                name: 'Greenwood Suburbs',
                tier: 'Tier 1 (Starter)',
                rent: 15.00,
                baseFootTraffic: 45,
                trafficVariance: 10,
                preferredArchetypes: ['senior', 'retiree', 'jogger', 'casual_shopper', 'bookworm', 'dog_walker', 'barista_regular', 'grad_student', 'student', 'hipster'],
                basePriceTolerance: 3.75,
                rainTrafficMod: 0.90,
                sunTrafficMod: 1.10,
                description: 'Cozy residential street. Established neighborhood with loyal regulars and steady morning pace.'
            },

            // TIER 2: CHARMING GETAWAYS & SCENIC SPOTS ($22 - $45 / day — Parks & Farmers Markets)
            lake_marina: {
                id: 'lake_marina',
                name: 'Lakefront Marina',
                tier: 'Tier 2 (Charming)',
                rent: 22.00,
                baseFootTraffic: 50,
                trafficVariance: 12,
                preferredArchetypes: ['casual_shopper', 'tourist', 'retiree', 'barista_regular', 'jogger', 'dog_walker'],
                basePriceTolerance: 4.00,
                rainTrafficMod: 0.65,
                sunTrafficMod: 1.45,
                description: 'Weathered wooden boat pier. Anglers, boaters, and morning lake walkers needing warm coffee.'
            },
            campsite: {
                id: 'campsite',
                name: 'Pine Forest Campsite',
                tier: 'Tier 2 (Charming)',
                rent: 28.00,
                baseFootTraffic: 55,
                trafficVariance: 14,
                preferredArchetypes: ['marathon_runner', 'jogger', 'tourist', 'hipster', 'dog_walker', 'barista_regular'],
                basePriceTolerance: 4.20,
                rainTrafficMod: 0.60,
                sunTrafficMod: 1.40,
                description: 'National park mountain trailhead. Campers craving fresh roasted beans around morning campfires.'
            },
            farmers_market: {
                id: 'farmers_market',
                name: 'Village Farmers Market',
                tier: 'Tier 2 (Charming)',
                rent: 35.00,
                baseFootTraffic: 65,
                trafficVariance: 18,
                preferredArchetypes: ['barista_regular', 'casual_shopper', 'art_student', 'hipster', 'senior', 'dog_walker'],
                basePriceTolerance: 4.50,
                rainTrafficMod: 0.70,
                sunTrafficMod: 1.35,
                description: 'Lively open-air produce square. Health-conscious shoppers who appreciate high-quality roast!'
            },
            park: {
                id: 'park',
                name: 'Central City Park',
                tier: 'Tier 2 (Charming)',
                rent: 45.00,
                baseFootTraffic: 75,
                trafficVariance: 20,
                preferredArchetypes: ['jogger', 'marathon_runner', 'dog_walker', 'hipster', 'retiree', 'casual_shopper', 'barista_regular', 'art_student', 'senior'],
                basePriceTolerance: 4.60,
                rainTrafficMod: 0.45,
                sunTrafficMod: 1.50,
                description: 'Lush urban park with gazebo and pond. Massive surge in iced coffee demand when hot!'
            },

            // TIER 3: HIGH-FOOT-TRAFFIC HUBS ($55 - $90 / day — Urban Plazas & University Campuses)
            beach_boardwalk: {
                id: 'beach_boardwalk',
                name: 'Sunny Beach Boardwalk',
                tier: 'Tier 3 (High-Traffic)',
                rent: 55.00,
                baseFootTraffic: 85,
                trafficVariance: 22,
                preferredArchetypes: ['tourist', 'student', 'fashionista', 'jogger', 'hipster', 'casual_shopper'],
                basePriceTolerance: 5.00,
                rainTrafficMod: 0.35, // Empties out in rain
                sunTrafficMod: 1.65, // Massive explosion on sunny beach days
                description: 'Sun-drenched ocean boardwalk. Surfers and beachgoers craving ice-cold brews and sweet lattes!'
            },
            construction_site: {
                id: 'construction_site',
                name: 'Downtown Construction Site',
                tier: 'Tier 3 (High-Traffic)',
                rent: 65.00,
                baseFootTraffic: 90,
                trafficVariance: 20,
                preferredArchetypes: ['casual_shopper', 'business', 'fintech_analyst', 'student', 'barista_regular'],
                basePriceTolerance: 4.80,
                rainTrafficMod: 0.90,
                sunTrafficMod: 1.15,
                description: 'High-rise skyscraper jobsite. Hard-working crews needing strong, hot, robust caffeine fuel!'
            },
            art_district: {
                id: 'art_district',
                name: 'Bohemian Art District',
                tier: 'Tier 3 (High-Traffic)',
                rent: 75.00,
                baseFootTraffic: 95,
                trafficVariance: 24,
                preferredArchetypes: ['art_student', 'fashionista', 'hipster', 'music_producer', 'indie_dev', 'barista_regular'],
                basePriceTolerance: 5.50,
                rainTrafficMod: 0.85,
                sunTrafficMod: 1.25,
                description: 'Trendy mural alley and lofts. Creative hipsters willing to pay premium for artisanal taste.'
            },
            campus: {
                id: 'campus',
                name: 'Tech University Campus',
                tier: 'Tier 3 (High-Traffic)',
                rent: 90.00,
                baseFootTraffic: 110,
                trafficVariance: 25,
                preferredArchetypes: ['student', 'grad_student', 'art_student', 'bookworm', 'professor', 'tech_hacker', 'indie_dev', 'cryptobro', 'hipster', 'music_producer'],
                basePriceTolerance: 5.20,
                rainTrafficMod: 0.85,
                sunTrafficMod: 1.25,
                description: 'Collegiate brick quad. Sleep-deprived students and coders with non-stop caffeine demand!'
            },

            // TIER 4: BUSTLING COMMERCIAL HUBS ($110 - $165 / day — Mall Kiosks & Commercial Plazas)
            amusement_pier: {
                id: 'amusement_pier',
                name: 'Amusement Boardwalk Pier',
                tier: 'Tier 4 (Bustling)',
                rent: 110.00,
                baseFootTraffic: 125,
                trafficVariance: 30,
                preferredArchetypes: ['tourist', 'student', 'fashionista', 'casual_shopper', 'music_producer', 'art_student'],
                basePriceTolerance: 5.80,
                rainTrafficMod: 0.50,
                sunTrafficMod: 1.55,
                description: 'Festive carnival boardwalk with roller coaster & carousel. High volume of cheerful tourists!'
            },
            sports_complex: {
                id: 'sports_complex',
                name: 'City Sports Complex',
                tier: 'Tier 4 (Bustling)',
                rent: 125.00,
                baseFootTraffic: 140,
                trafficVariance: 35,
                preferredArchetypes: ['marathon_runner', 'business', 'corporate_exec', 'student', 'tourist', 'jogger'],
                basePriceTolerance: 6.20,
                rainTrafficMod: 0.75,
                sunTrafficMod: 1.35,
                description: 'Grand athletic arena concourse. Electrifying crowd energy and huge game-day surges!'
            },
            shopping_mall: {
                id: 'shopping_mall',
                name: 'Grand Galleria Mall',
                tier: 'Tier 4 (Bustling)',
                rent: 145.00,
                baseFootTraffic: 155,
                trafficVariance: 30,
                preferredArchetypes: ['fashionista', 'casual_shopper', 'corporate_exec', 'tourist', 'student', 'senior'],
                basePriceTolerance: 6.50,
                rainTrafficMod: 1.40, // People flock indoors to the mall when it rains!
                sunTrafficMod: 1.00,
                description: 'Luxury indoor multi-tier shopping atrium. Rainproof crowds and high shopper spending!'
            },
            hospital_plaza: {
                id: 'hospital_plaza',
                name: 'Metro Medical Center',
                tier: 'Tier 4 (Bustling)',
                rent: 165.00,
                baseFootTraffic: 170,
                trafficVariance: 30,
                preferredArchetypes: ['business', 'corporate_exec', 'professor', 'grad_student', 'student', 'senior'],
                basePriceTolerance: 6.80,
                rainTrafficMod: 1.00, // Hospital runs 24/7 regardless of weather!
                sunTrafficMod: 1.05,
                description: 'Healthcare hub running around the clock. Doctors, nurses, and staff needing constant caffeine!'
            },

            // TIER 5: PEAK MEGACITY TRANSIT & EXECUTIVES ($190 - $300 / day — Major Transit, Expos & Airport Concourses)
            metro: {
                id: 'metro',
                name: 'Grand Central Metro',
                tier: 'Tier 5 (Megacity Peak)',
                rent: 190.00,
                baseFootTraffic: 185,
                trafficVariance: 35,
                preferredArchetypes: ['metro_commuter', 'business', 'fintech_analyst', 'tourist', 'student', 'corporate_exec', 'senior'],
                basePriceTolerance: 7.00,
                rainTrafficMod: 1.35, // Subway explodes with commuters during rainstorms!
                sunTrafficMod: 1.05,
                description: 'Transit nerve-center. Rushing commuters, impatient queues, but colossal passenger throughput!'
            },
            convention_center: {
                id: 'convention_center',
                name: 'Convention & Expo Center',
                tier: 'Tier 5 (Megacity Peak)',
                rent: 220.00,
                baseFootTraffic: 205,
                trafficVariance: 45,
                preferredArchetypes: ['tech_hacker', 'cryptobro', 'crypto_whale', 'indie_dev', 'tourist', 'fashionista', 'music_producer'],
                basePriceTolerance: 7.50,
                rainTrafficMod: 1.10,
                sunTrafficMod: 1.15,
                description: 'Giant tech & comic expo hall. Techies and VIP founders spending freely on double espressos!'
            },
            downtown: {
                id: 'downtown',
                name: 'Wall St. Financial Plaza',
                tier: 'Tier 5 (Megacity Peak)',
                rent: 250.00,
                baseFootTraffic: 220,
                trafficVariance: 45,
                preferredArchetypes: ['corporate_exec', 'business', 'fintech_analyst', 'crypto_whale', 'cryptobro', 'tech_hacker', 'fashionista', 'music_producer', 'senior'],
                basePriceTolerance: 8.00,
                rainTrafficMod: 0.95,
                sunTrafficMod: 1.20,
                description: 'Financial skyscraper district! High-powered executives, big spenders, and generous tips!'
            },
            airport_terminal: {
                id: 'airport_terminal',
                name: 'International Airport Terminal',
                tier: 'Tier 5 (Megacity Peak)',
                rent: 300.00,
                baseFootTraffic: 240,
                trafficVariance: 50,
                preferredArchetypes: ['tourist', 'corporate_exec', 'business', 'metro_commuter', 'fashionista', 'crypto_whale'],
                basePriceTolerance: 8.50,
                rainTrafficMod: 1.05,
                sunTrafficMod: 1.10,
                description: 'Global departures concourse. Non-stop travelers from across the world, premium price tolerance!'
            }
        };
    }

    // Upgrades Catalog (27 Total Upgrades across 7 Categories; Decor starts at Level 0!)
    getUpgrades() {
        return {
            machine: [
                {
                    id: 'machine_1',
                    category: 'machine',
                    level: 1,
                    name: 'French Press & Moka Pot',
                    cost: 0,
                    portrait: 'assets/upg_machine_1.png',
                    brewTime: 2.8,
                    pourTime: 0.80,
                    qualityBonus: 0,
                    speedBonus: 0,
                    attractionBonus: 0,
                    yieldBonus: 0,
                    desc: 'Slow manual drip. Basic aroma.',
                    help: 'The classic entry-level brewing method. It takes 2.8 seconds to brew a carafe and 0.8s to pour. Reliable for small neighbourhood traffic.'
                },
                {
                    id: 'machine_2',
                    category: 'machine',
                    level: 2,
                    name: 'Compact Countertop Espresso Machine',
                    cost: 165,
                    portrait: 'assets/upg_machine_2.png',
                    brewTime: 1.8,
                    pourTime: 0.55,
                    qualityBonus: 12,
                    speedBonus: 15,
                    attractionBonus: 5,
                    yieldBonus: 0,
                    desc: 'Quick extraction & rich crema. Cuts brew time by 35% & +15% service speed!',
                    help: 'Electric tabletop commercial espresso machine inspired by classic countertop cafe equipment. Speeds up brew time to 1.8s, adds +15% serving speed, +5% pedestrian attraction, and enhances coffee extraction with a +12% taste bonus!'
                },
                {
                    id: 'machine_3',
                    category: 'machine',
                    level: 3,
                    name: 'Pro Commercial Dual-Boiler Espresso Machine',
                    cost: 520,
                    portrait: 'assets/upg_machine_3.png',
                    brewTime: 1.0,
                    pourTime: 0.35,
                    qualityBonus: 25,
                    speedBonus: 30,
                    attractionBonus: 12,
                    yieldBonus: 0,
                    desc: 'Commercial steam power: 1.0s brew, +30% speed, +12% attraction & +25% taste!',
                    help: 'Heavy-duty commercial espresso powerhouse. Features dual steam boilers that crush queues with 1.0s brew time, +30% service speed, +12% pedestrian stop rate, and an outstanding +25% taste quality rating!'
                },
                {
                    id: 'machine_4',
                    category: 'machine',
                    level: 4,
                    name: 'Handcrafted Italian Multi-Group Flagship',
                    cost: 1350,
                    portrait: 'assets/upg_machine_4.png',
                    brewTime: 0.5,
                    pourTime: 0.20,
                    qualityBonus: 40,
                    speedBonus: 50,
                    attractionBonus: 20,
                    yieldBonus: 1,
                    desc: 'Artisanal flagship: 0.5s brew, +50% speed, 11 cups/carafe & +40% taste!',
                    help: 'Handcrafted Italian multi-group masterpiece with precision flow profiling and walnut wood handles. Lightning-fast 0.5s brew, +50% service speed, yields 11 cups per carafe (instead of 10), +20% pedestrian attraction, and adds +40% taste perfection!'
                }
            ],
            cooler: [
                {
                    id: 'cooler_1',
                    category: 'cooler',
                    level: 1,
                    name: 'Styrofoam Ice Box Cooler',
                    cost: 0,
                    portrait: 'assets/upg_cooler_1.png',
                    meltRate: 1.00,
                    milkSpoilTemp: -99,
                    milkSpoilRate: 1.00,
                    desc: 'No cooling power! 100% of leftover ice melts & 100% of leftover milk spoils daily!',
                    help: 'Unpowered thin styrofoam box. Without an insulated or electric cooler upgrade, 100% of leftover ice melts completely and 100% of leftover milk spoils at the end of every single day!'
                },
                {
                    id: 'cooler_2',
                    category: 'cooler',
                    level: 2,
                    name: 'Heavy-Duty Insulated Ice Chest',
                    cost: 120,
                    portrait: 'assets/upg_cooler_2.png',
                    meltRate: 0.40,
                    milkSpoilTemp: 26,
                    milkSpoilRate: 0.50,
                    desc: 'Retains 60% of ice overnight; milk stays fresh up to 26°C.',
                    help: 'Rugged double-walled heavy-duty camping cooler. Retains 60% of ice overnight and keeps milk safe up to 26°C on warm sunny days.'
                },
                {
                    id: 'cooler_3',
                    category: 'cooler',
                    level: 3,
                    name: 'Mr. Fridge Commercial Upright Cooler',
                    cost: 360,
                    portrait: 'assets/upg_cooler_3.png',
                    meltRate: 0.15,
                    milkSpoilTemp: 99,
                    milkSpoilRate: 0.00,
                    desc: 'Milk NEVER spoils; preserves 85% of leftover ice!',
                    help: 'The legendary Lemonade Tycoon Mr. Fridge commercial upright cooler! Keeps milk at optimal 3°C so it NEVER spoils regardless of extreme heat, and preserves 85% of leftover ice cubes!'
                },
                {
                    id: 'cooler_4',
                    category: 'cooler',
                    level: 4,
                    name: 'Luxury Dual-Zone Stainless Refrigerator',
                    cost: 850,
                    portrait: 'assets/upg_cooler_4.png',
                    meltRate: 0.00,
                    milkSpoilTemp: 99,
                    milkSpoilRate: 0.00,
                    desc: 'Zero ice melt, zero milk spoilage guaranteed!',
                    help: 'Commercial brushed stainless steel luxury refrigeration unit with digital dual-zone climate regulation. Guarantees 0% ice melting and 0% milk loss, saving maximum supply costs in high-volume locations!'
                }
            ],
            grinder: [
                {
                    id: 'grinder_1',
                    category: 'grinder',
                    level: 1,
                    name: 'Vintage Manual Hand Burr Grinder',
                    cost: 0,
                    portrait: 'assets/upg_grinder_1.png',
                    qualityBonus: 0,
                    speedBonus: 0,
                    attractionBonus: 0,
                    desc: 'Coarse manual grind. Slow hand cranking.',
                    help: 'Traditional hand-operated wooden coffee mill. Satisfactory for basic brewing, but grinds slowly by hand without flavor enhancement.'
                },
                {
                    id: 'grinder_2',
                    category: 'grinder',
                    level: 2,
                    name: 'Electric Conical Burr Grinder',
                    cost: 110,
                    portrait: 'assets/upg_grinder_2.png',
                    qualityBonus: 12,
                    speedBonus: 15,
                    attractionBonus: 5,
                    desc: 'Fast electric grind (+15% service speed), +5% attraction & +12% taste score.',
                    help: 'Hardened steel conical burrs crush beans uniformly and automatically. Speeds up customer service by +15%, wafts fresh aroma (+5% attraction), and improves taste satisfaction by +12%.'
                },
                {
                    id: 'grinder_3',
                    category: 'grinder',
                    level: 3,
                    name: 'Commercial Precision Flat Burr Mill',
                    cost: 380,
                    portrait: 'assets/upg_grinder_3.png',
                    qualityBonus: 26,
                    speedBonus: 30,
                    attractionBonus: 12,
                    desc: 'High-speed flat burr mill (+30% speed), saves 10% beans & +26% taste score!',
                    help: 'Pro commercial Italian flat burr mill with micrometric grind regulation. Speeds up service by +30%, attracts +12% more pedestrians with rich aroma, unlocks +26% taste boost, and saves 10% on coffee beans!'
                }
            ],
            terminal: [
                {
                    id: 'terminal_1',
                    category: 'terminal',
                    level: 1,
                    name: 'Vintage Metal Cash Box',
                    cost: 0,
                    portrait: 'assets/upg_terminal_1.png',
                    conversionBonus: 0,
                    tipBonus: 0,
                    cryptoTipBonus: 0,
                    speedBonus: 0,
                    attractionBonus: 0,
                    paymentMethod: 'Cash Only',
                    desc: 'Accepts physical cash only. Slow manual change calculation.',
                    help: 'Simple metal coin tin for collecting physical bills and coins. Slow manual change counting offers no checkout speed or conversion bonus.'
                },
                {
                    id: 'terminal_2',
                    category: 'terminal',
                    level: 2,
                    name: 'QRIS & EDC Debit/Credit Card Register',
                    cost: 140,
                    portrait: 'assets/upg_terminal_2.png',
                    conversionBonus: 10,
                    tipBonus: 15,
                    cryptoTipBonus: 15,
                    speedBonus: 25,
                    attractionBonus: 6,
                    paymentMethod: 'Cash, QRIS & Card',
                    desc: 'Accepts QRIS & Debit/Credit Cards! +25% faster service & +10% price tolerance!',
                    help: 'Electronic cash register equipped with a dynamic QRIS barcode stand and EDC debit/credit card reader. Eliminates manual coin counting, speeding up customer service by +25%, increasing price willingness by +10%, and boosting tips by +15%!'
                },
                {
                    id: 'terminal_3',
                    category: 'terminal',
                    level: 3,
                    name: 'Contactless NFC Tap & Smart QRIS POS',
                    cost: 420,
                    portrait: 'assets/upg_terminal_3.png',
                    conversionBonus: 18,
                    tipBonus: 35,
                    cryptoTipBonus: 35,
                    speedBonus: 45,
                    attractionBonus: 12,
                    paymentMethod: 'Instant NFC Tap, Card & QRIS',
                    desc: '1-Tap NFC Card/Phone & Smart QRIS POS! +45% checkout speed, +18% conversion & +35% tips!',
                    help: 'High-speed touchscreen POS terminal with instant NFC Contactless Tap (Card, Phone, Smartwatch) and auto-verified QRIS scanner. Cuts checkout time dramatically (+45% service speed), gives +18% price conversion, and boosts customer tips by +35%!'
                }
            ],
            canopy: [
                {
                    id: 'canopy_1',
                    category: 'canopy',
                    level: 1,
                    name: 'Open Cart Framework (No Canopy)',
                    cost: 0,
                    portrait: 'assets/upg_canopy_1.png',
                    rainProtection: 0,
                    patienceBonus: 0,
                    attractionBonus: 0,
                    desc: 'Open air setup. Customers get soaked in rain.',
                    help: 'Basic open framework with no weather shelter. Rainy or scorching weather drives customers away faster and shortens queue patience.'
                },
                {
                    id: 'canopy_2',
                    category: 'canopy',
                    level: 2,
                    name: 'ShadeMaker 3000 Striped Awning',
                    cost: 135,
                    portrait: 'assets/upg_canopy_2.png',
                    rainProtection: 0.25,
                    patienceBonus: 3.0,
                    attractionBonus: 6,
                    desc: 'Keep your customers cool! +25% rain traffic, +6% attraction & +3s patience.',
                    help: 'The authentic Lemonade Tycoon ShadeMaker 3000 red-and-white awning! Keeps patrons sheltered from hot sun and rain, increasing bad-weather foot traffic by +25%, pedestrian stop rate by +6%, and queue patience by +3.0s!'
                },
                {
                    id: 'canopy_3',
                    category: 'canopy',
                    level: 3,
                    name: 'Commercial Retractable All-Weather Awning',
                    cost: 390,
                    portrait: 'assets/upg_canopy_3.png',
                    rainProtection: 0.50,
                    patienceBonus: 6.0,
                    attractionBonus: 14,
                    desc: 'Heavy storm shelter with warm lights: +50% rain traffic, +14% attraction & +6s patience.',
                    help: 'Heavy-duty commercial weather awning with scissor-arm frame and warm Edison lighting. Provides complete shelter in downpours and cold snaps, boosting rain foot traffic by +50%, pedestrian attraction by +14%, and queue patience by +6.0 seconds!'
                }
            ],
            marketing: [
                {
                    id: 'marketing_1',
                    category: 'marketing',
                    level: 1,
                    name: 'Word of Mouth',
                    cost: 0,
                    portrait: 'assets/upg_marketing_1.png',
                    trafficBonus: 0,
                    attractionBonus: 0,
                    desc: 'Only locals notice you. Low pedestrian stop rate.',
                    help: 'Relying purely on organic visibility and local sidewalk curiosity. Baseline foot traffic and low pedestrian stop probability.'
                },
                {
                    id: 'marketing_2',
                    category: 'marketing',
                    level: 2,
                    name: 'Chalkboard & Street Flyers',
                    cost: 90,
                    portrait: 'assets/upg_marketing_2.png',
                    trafficBonus: 15,
                    attractionBonus: 8,
                    desc: '+15% foot traffic & +8% pedestrian attraction chance.',
                    help: 'Eye-catching sidewalk sandwich board with daily latte art chalkboard illustrations and neighborhood flyers. Adds +15% foot traffic and +8% chance for passing pedestrians to stop!'
                },
                {
                    id: 'marketing_3',
                    category: 'marketing',
                    level: 3,
                    name: 'Illuminated Artisan Wooden Sign & Banners',
                    cost: 260,
                    portrait: 'assets/upg_marketing_3.png',
                    trafficBonus: 35,
                    attractionBonus: 18,
                    desc: '+35% traffic & +18% pedestrian attraction chance!',
                    help: 'An elegant handcrafted dark oak wooden sign illuminated by warm hooded brass gooseneck lamps and hanging embroidered fabric banners. Highly visible and inviting, boosting foot traffic by +35% and pedestrian stop rate by +18%!'
                },
                {
                    id: 'marketing_4',
                    category: 'marketing',
                    level: 4,
                    name: 'City Culinary Guide & Food Critic Feature',
                    cost: 680,
                    portrait: 'assets/upg_marketing_4.png',
                    trafficBonus: 75,
                    attractionBonus: 30,
                    desc: '+75% massive foot traffic boost & +30% pedestrian attraction!',
                    help: 'Featured review in the city gourmet food guide and prominent food critic spotlight. Drives huge crowds of passionate coffee connoisseurs with a +75% traffic surge and +30% pedestrian attraction rate!'
                }
            ],
            decor: [
                {
                    id: 'decor_0',
                    category: 'decor',
                    level: 0,
                    name: 'Folding Table & Makeshift Gear',
                    cost: 0,
                    portrait: 'assets/upg_decor_0.png',
                    priceTolBonus: 0.0,
                    tipBonus: 0.0,
                    speedBonus: 0,
                    attractionBonus: 0,
                    desc: 'Simple folding table and makeshift brewing tools. Humble street start.',
                    help: 'A portable folding table with X-frame metal legs, an aluminum kettle, manual drip cone, and tin coin can. Free starter setup, but most passing pedestrians will walk right past unless you upgrade!'
                },
                {
                    id: 'decor_1',
                    category: 'decor',
                    level: 1,
                    name: 'Rustic Timber Cart',
                    cost: 120,
                    portrait: 'assets/upg_decor_1.png',
                    priceTolBonus: 0.0,
                    tipBonus: 0.05,
                    speedBonus: 5,
                    attractionBonus: 8,
                    desc: 'Proper wooden coffee cart! +8% pedestrian attraction, +5% speed & +5% tips.',
                    help: 'Standard wooden cart with iron spoke wheels and counter organization. Upgrading from a folding table makes you look like a real coffee vendor, adding +8% pedestrian attraction and +5% serving speed!'
                },
                {
                    id: 'decor_2',
                    category: 'decor',
                    level: 2,
                    name: 'Artisan Mahogany & Brass Stand',
                    cost: 320,
                    portrait: 'assets/upg_decor_2.png',
                    priceTolBonus: 0.15,
                    tipBonus: 0.10,
                    speedBonus: 10,
                    attractionBonus: 16,
                    desc: '+15% customer price tolerance, +16% attraction & +10% serving speed.',
                    help: 'Hand-polished rich dark mahogany wood with gleaming brass railings and corner guards. Gives an upscale boutique cafe vibe, allowing +15% higher cup pricing, +16% pedestrian stop rate, +10% serving speed, and +10% tip bonus.'
                },
                {
                    id: 'decor_3',
                    category: 'decor',
                    level: 3,
                    name: 'Luxury Italian Marble & Walnut Bar',
                    cost: 750,
                    portrait: 'assets/upg_decor_3.png',
                    priceTolBonus: 0.30,
                    tipBonus: 0.25,
                    speedBonus: 15,
                    attractionBonus: 25,
                    desc: '+30% price tolerance, +25% attraction, +15% speed & +25% generous tips!',
                    help: 'Hand-carved Carrara marble countertop paired with solid walnut paneling and soft warm accent lighting. Creates an ultra-luxury boutique coffee experience that elevates customer price tolerance by +30%, attraction by +25%, and tips by +25%!'
                },
                {
                    id: 'decor_4',
                    category: 'decor',
                    level: 4,
                    name: 'Parisian Art-Deco Copper & Glass Kiosk',
                    cost: 1650,
                    portrait: 'assets/upg_decor_4.png',
                    priceTolBonus: 0.45,
                    tipBonus: 0.40,
                    speedBonus: 22,
                    attractionBonus: 35,
                    desc: '+45% price tolerance, +35% attraction, +22% speed & +40% tips!',
                    help: 'Ornate Parisian Art-Deco architectural coffee kiosk featuring hammered copper relief panels, deep emerald glazed tiles, curved beveled glass pastry display, and warm vintage globe lanterns. Elevates customer price tolerance by +45%, attraction by +35%, and tips by +40%!'
                },
                {
                    id: 'decor_5',
                    category: 'decor',
                    level: 5,
                    name: 'Imperial Gold & Onyx Flagship Pavilion',
                    cost: 3600,
                    portrait: 'assets/upg_decor_5.png',
                    priceTolBonus: 0.65,
                    tipBonus: 0.60,
                    speedBonus: 30,
                    attractionBonus: 48,
                    desc: '+65% price tolerance, +48% attraction, +30% speed & +60% tips! Ultimate flagship.',
                    help: 'The pinnacle of global coffee architecture: a bespoke jet-black onyx and 24k gold-leaf flagship roastery pavilion crowned with an ornate golden dome, crystal chandeliers, master drum roaster, and VIP red velvet entrance. Boosts customer price tolerance by +65%, attraction by +48%, and tips by +60%!'
                }
            ]
        };
    }

    // Helper to safely look up the upgrade object for a category & level (handles decor starting at level 0)
    getUpgradeItem(category, level) {
        const list = this.getUpgrades()[category];
        if (!list || list.length === 0) return null;
        const defaultLvl = category === 'decor' ? 0 : 1;
        const targetLvl = (level !== undefined)
            ? level
            : (this.upgrades && this.upgrades[category] !== undefined ? this.upgrades[category] : defaultLvl);
        return list.find(u => u.level === targetLvl) || list[0];
    }

    // -------------------------------------------------------------
    // STAFF HIRING CATALOG & DAILY WAGE SYSTEM (Lemonade Tycoon Style)
    // -------------------------------------------------------------
    getStaffCatalog() {
        return [
            {
                id: 'cashier',
                name: 'Martine the Cashier',
                role: 'Cashier & Order Specialist',
                wage: 60.00,
                portrait: 'assets/staff_cashier.png',
                speedBonus: 35,
                patienceBonus: 0,
                attractionBonus: 6,
                qualityBonus: 0,
                tipBonus: 10,
                trafficBonus: 0,
                perks: ['⚡ +35% Service Speed', '💵 +10% Customer Tips', '🧲 +6% Stop Chance'],
                desc: 'Too many people to serve? Call for help! Speeds up customer service by +35%.',
                help: 'Martine handles order taking, QRIS scanning, and card payments alongside your barista. Increases overall customer service speed by +35%, boosts tips by +10%, and adds +6% pedestrian stop rate. Paid $60.00 per day.'
            },
            {
                id: 'entertainer',
                name: 'Simon the Coffee Mascot',
                role: 'Queue Entertainer & Mascot',
                wage: 80.00,
                portrait: 'assets/staff_entertainer.png',
                speedBonus: 0,
                patienceBonus: 8.0,
                attractionBonus: 16,
                qualityBonus: 0,
                tipBonus: 10,
                trafficBonus: 10,
                perks: ['⏳ +8.0s Queue Patience', '🧲 +16% Stop Chance', '📢 +10% Foot Traffic'],
                desc: 'Keep your clients happy in line! Extends queue patience by +8.0s & +16% attraction.',
                help: 'Dressed in a cheerful giant roasted coffee bean costume, Simon waves at pedestrians and entertains waiting customers! Extends queue patience by +8.0 seconds so customers rarely walk away from 10-person lines, and boosts pedestrian stop chance by +16%. Paid $80.00 per day.'
            },
            {
                id: 'promoter',
                name: 'Chloe the Street Promoter',
                role: 'Street Flyer & Hype Promoter',
                wage: 95.00,
                portrait: 'assets/staff_promoter.png',
                speedBonus: 0,
                patienceBonus: 2.0,
                attractionBonus: 28,
                qualityBonus: 0,
                tipBonus: 0,
                trafficBonus: 20,
                perks: ['🧲 +28% Pedestrian Stop RNG', '📢 +20% Foot Traffic', '⏳ +2.0s Queue Patience'],
                desc: 'Turn passing strangers into customers! Boosts pedestrian attraction RNG by +28% & traffic by +20%.',
                help: 'Chloe stands on the sidewalk with a megaphone, directional signboard, and sample vouchers. Dramatically boosts your pedestrian attraction gacha rate by +28% and pulls +20% more foot traffic to your street. Paid $95.00 per day.'
            },
            {
                id: 'barista',
                name: 'Marco the Master Barista',
                role: 'Artisan Co-Barista',
                wage: 120.00,
                portrait: 'assets/staff_barista.png',
                speedBonus: 45,
                patienceBonus: 0,
                attractionBonus: 12,
                qualityBonus: 18,
                tipBonus: 25,
                trafficBonus: 0,
                perks: ['⚡ +45% Brewing & Pour Speed', '⭐ +18% Coffee Taste Score', '💵 +25% Customer Tips'],
                desc: 'Master co-barista! +45% brewing & serving speed, +18% coffee taste score & +25% tips!',
                help: 'An experienced Italian specialty barista who pulls espresso shots and pours silky microfoam latte art right beside you. Boosts service speed by +45%, elevates recipe taste quality by +18%, and increases tips by +25%. Paid $120.00 per day.'
            }
        ];
    }

    getStaffPerks() {
        const perks = {
            speedBonus: 0,
            patienceBonus: 0,
            attractionBonus: 0,
            qualityBonus: 0,
            tipBonus: 0,
            trafficBonus: 0,
            dailyWage: 0,
            hiredCount: 0,
            hiredList: []
        };
        if (!this.hiredStaff) return perks;
        const catalog = this.getStaffCatalog();
        catalog.forEach(s => {
            if (this.hiredStaff[s.id]) {
                perks.speedBonus += (s.speedBonus || 0);
                perks.patienceBonus += (s.patienceBonus || 0);
                perks.attractionBonus += (s.attractionBonus || 0);
                perks.qualityBonus += (s.qualityBonus || 0);
                perks.tipBonus += (s.tipBonus || 0);
                perks.trafficBonus += (s.trafficBonus || 0);
                perks.dailyWage += (s.wage || 0);
                perks.hiredCount++;
                perks.hiredList.push(s);
            }
        });
        return perks;
    }

    getDailyStaffCost() {
        return this.getStaffPerks().dailyWage;
    }

    toggleHireStaff(staffId) {
        const catalog = this.getStaffCatalog();
        const staff = catalog.find(s => s.id === staffId);
        if (!staff) return { success: false, message: 'Staff member not found' };
        if (!this.hiredStaff) {
            this.hiredStaff = { cashier: false, entertainer: false, promoter: false, barista: false };
        }
        if (this.hiredStaff[staffId]) {
            this.hiredStaff[staffId] = false;
            this.saveState();
            if (window.soundManager) window.soundManager.playClick();
            return {
                success: true,
                hired: false,
                message: `Dismissed ${staff.name}. ($${staff.wage.toFixed(2)}/day saved)`
            };
        } else {
            const currentCommittedWages = this.getDailyStaffCost();
            if (this.cash < staff.wage || this.cash < currentCommittedWages + staff.wage) {
                return {
                    success: false,
                    hired: false,
                    message: `Need at least $${(currentCommittedWages + staff.wage).toFixed(2)} cash on hand to cover daily staff wages!`
                };
            }
            this.hiredStaff[staffId] = true;
            this.saveState();
            if (window.soundManager) window.soundManager.playRegister();
            return {
                success: true,
                hired: true,
                message: `Hired ${staff.name} ($${staff.wage.toFixed(2)}/day)!`
            };
        }
    }

    // -------------------------------------------------------------
    // RNG / GACHA CUSTOMER ATTRACTION & SERVICE SPEED
    // -------------------------------------------------------------
    getCustomerAttractionChance(customer, isBoostActive) {
        // Low base attraction chance (~22%) so most passing NPCs walk past when player has no upgrades
        let chance = 0.22;

        // Add attraction bonuses from all 7 upgrade categories
        const categories = ['decor', 'marketing', 'canopy', 'machine', 'grinder', 'terminal'];
        categories.forEach(cat => {
            const item = this.getUpgradeItem(cat);
            if (item && item.attractionBonus) {
                chance += (item.attractionBonus / 100);
            }
        });

        // Daily advertising budget bonus (+0% to +18% stop chance)
        if (this.dailyMarketingBudget > 0) {
            chance += Math.min(0.18, (this.dailyMarketingBudget / 50) * 0.18);
        }

        // Hired Staff attraction bonus
        const staffPerks = this.getStaffPerks();
        if (staffPerks.attractionBonus > 0) {
            chance += (staffPerks.attractionBonus / 100);
        }

        // Location popularity bonus
        const pop = this.getLocationPopularity(this.currentLocation);
        chance += Math.max(0, (pop - 25) / 100) * 0.12;

        // Viral /boost active (Hyper-Flow Campaign: +15% attraction bonus)
        if (isBoostActive) {
            chance += 0.15;
        }

        return Math.max(0.18, Math.min(0.92, chance));
    }

    getQueueCapacityBonus() {
        let bonus = 0;
        const canopyLvl = (this.upgrades && this.upgrades.canopy) ? this.upgrades.canopy : 1;
        if (canopyLvl >= 3) bonus += 4;
        else if (canopyLvl === 2) bonus += 2;

        const decorLvl = (this.upgrades && this.upgrades.decor !== undefined) ? this.upgrades.decor : 0;
        if (decorLvl > 1) {
            bonus += (decorLvl - 1); // +1 per cart tier above Level 1
        }

        if (this.hiredStaff && this.hiredStaff.entertainer) {
            bonus += 4; // Simon the Coffee Mascot (+4 queue capacity)
        }

        if (window.web3Manager && window.web3Manager.isBoostActive) {
            bonus += 4; // Hyper-Flow /boost (+4 queue capacity)
        }

        return bonus;
    }

    getMaxQueueSize(base = 10) {
        return base + this.getQueueCapacityBonus();
    }

    getTotalServiceSpeedMultiplier() {
        let speedMult = 1.0;

        // Equipment & Cart Speed Bonuses
        ['terminal', 'grinder', 'machine', 'decor'].forEach(cat => {
            const item = this.getUpgradeItem(cat);
            if (item && item.speedBonus) {
                speedMult += (item.speedBonus / 100);
            }
        });

        // Hired Staff Speed Bonuses (Martine the Cashier +35%, Marco the Master Barista +45%)
        const staffPerks = this.getStaffPerks();
        if (staffPerks.speedBonus > 0) {
            speedMult += (staffPerks.speedBonus / 100);
        }

        // Hyper-Flow /boost Campaign (+35% Service Speed Bonus)
        if (window.web3Manager && window.web3Manager.isBoostActive) {
            speedMult += 0.35;
        }

        // Franchise Perks
        if (window.web3Manager && window.web3Manager.getNFTPerks) {
            const perks = window.web3Manager.getNFTPerks();
            speedMult += ((perks.speedBonus || 0) / 100);
        }

        return Math.max(1.0, speedMult);
    }

    // Supplies Store Catalog (Higher prices for extended progression; starter small packs fit within $40 starter capital)
    getSuppliesCatalog() {
        return [
            { id: 'beans_small', item: 'beans', name: 'Beans (25 Scoops)', qty: 25, cost: 8.00, tier: 'Small', unitLabel: '25 Scoops', icon: '☕' },
            { id: 'beans_med', item: 'beans', name: 'Beans (80 Scoops)', qty: 80, cost: 22.00, tier: 'Medium', unitLabel: '80 Scoops', icon: '☕' },
            { id: 'beans_bulk', item: 'beans', name: 'Beans (200 Scoops - Bulk)', qty: 200, cost: 48.00, tier: 'Bulk', unitLabel: '200 Scoops', icon: '☕' },

            { id: 'milk_small', item: 'milk', name: 'Milk (20 Servings)', qty: 20, cost: 5.50, tier: 'Small', unitLabel: '20 Servings', icon: '🥛' },
            { id: 'milk_med', item: 'milk', name: 'Milk (60 Servings)', qty: 60, cost: 14.50, tier: 'Medium', unitLabel: '60 Servings', icon: '🥛' },
            { id: 'milk_case', item: 'milk', name: 'Milk (150 Servings - Case)', qty: 150, cost: 32.00, tier: 'Bulk', unitLabel: '150 Servings', icon: '🥛' },

            { id: 'sugar_box', item: 'sugar', name: 'Sugar (50 Packets)', qty: 50, cost: 3.50, tier: 'Small', unitLabel: '50 Packets', icon: '🍬' },
            { id: 'sugar_med', item: 'sugar', name: 'Sugar (100 Packets - Box)', qty: 100, cost: 6.50, tier: 'Medium', unitLabel: '100 Packets', icon: '🍬' },
            { id: 'sugar_bulk', item: 'sugar', name: 'Sugar (200 Packets - Bulk)', qty: 200, cost: 11.50, tier: 'Bulk', unitLabel: '200 Packets', icon: '🍬' },

            { id: 'ice_small', item: 'ice', name: 'Ice (60 Cubes)', qty: 60, cost: 3.00, tier: 'Small', unitLabel: '60 Cubes', icon: '🧊' },
            { id: 'ice_med', item: 'ice', name: 'Ice (150 Cubes)', qty: 150, cost: 6.50, tier: 'Medium', unitLabel: '150 Cubes', icon: '🧊' },
            { id: 'ice_bulk', item: 'ice', name: 'Ice (400 Cubes - Big Sack)', qty: 400, cost: 14.00, tier: 'Bulk', unitLabel: '400 Cubes', icon: '🧊' },

            { id: 'cups_sleeve', item: 'cups', name: 'Cups & Lids (40 Units)', qty: 40, cost: 5.50, tier: 'Small', unitLabel: '40 Units', icon: '🥤' },
            { id: 'cups_pack', item: 'cups', name: 'Cups & Lids (120 Units)', qty: 120, cost: 14.00, tier: 'Medium', unitLabel: '120 Units', icon: '🥤' },
            { id: 'cups_case', item: 'cups', name: 'Cups & Lids (300 Units - Case)', qty: 300, cost: 30.00, tier: 'Bulk', unitLabel: '300 Units', icon: '🥤' },

            { id: 'syrup_small', item: 'syrup', name: 'Vanilla Syrup (15 Pumps)', qty: 15, cost: 3.50, tier: 'Small', unitLabel: '15 Pumps', icon: '🍯' },
            { id: 'syrup_bottle', item: 'syrup', name: 'Vanilla Syrup (40 Pumps)', qty: 40, cost: 8.00, tier: 'Medium', unitLabel: '40 Pumps', icon: '🍯' },
            { id: 'syrup_tri', item: 'syrup', name: 'Syrup Tri-Pack (140 Pumps - Bulk)', qty: 140, cost: 22.00, tier: 'Bulk', unitLabel: '140 Pumps', icon: '🍯' }
        ];
    }

    // Purchase single supplies item
    buySupply(supplyId) {
        const catalog = this.getSuppliesCatalog();
        const item = catalog.find(s => s.id === supplyId);
        if (!item) return { success: false, message: 'Item not found' };

        if (this.cash < item.cost) {
            return { success: false, message: `Insufficient cash! Need $${item.cost.toFixed(2)}` };
        }

        this.cash -= item.cost;
        this.inventory[item.item] = Math.max(0, this.inventory[item.item]) + item.qty;
        this.saveState();

        if (window.soundManager) window.soundManager.playCoin();
        return { success: true, message: `Purchased ${item.name} for $${item.cost.toFixed(2)}!` };
    }

    // Purchase batch of supplies across multiple ingredients (Lemonade Tycoon 1-Click checkout)
    buySuppliesBatch(cartItems) {
        if (!cartItems || typeof cartItems !== 'object') {
            return { success: false, message: 'Invalid cart data' };
        }
        const catalog = this.getSuppliesCatalog();
        let totalCost = 0;
        let totalQty = 0;
        const validEntries = [];

        Object.keys(cartItems).forEach(supplyId => {
            const count = parseInt(cartItems[supplyId], 10) || 0;
            if (count > 0) {
                const item = catalog.find(s => s.id === supplyId);
                if (item) {
                    totalCost += item.cost * count;
                    totalQty += count;
                    validEntries.push({ item, count });
                }
            }
        });

        if (validEntries.length === 0) {
            return { success: false, message: 'Cart is empty! Select package quantities first.' };
        }

        totalCost = Math.round(totalCost * 100) / 100;
        if (this.cash < totalCost) {
            return { success: false, message: `Insufficient cash! Need $${totalCost.toFixed(2)} (You have $${this.cash.toFixed(2)})` };
        }

        this.cash -= totalCost;
        validEntries.forEach(({ item, count }) => {
            this.inventory[item.item] = Math.max(0, this.inventory[item.item]) + (item.qty * count);
        });
        this.saveState();

        if (window.soundManager) window.soundManager.playRegister();
        return {
            success: true,
            totalCost: totalCost,
            itemsCount: totalQty,
            message: `Purchased ${totalQty} batch${totalQty > 1 ? 'es' : ''} for $${totalCost.toFixed(2)}!`
        };
    }

    // -------------------------------------------------------------
    // MARKETING STRATEGY & CUP MARGINS (Lemonade Tycoon Style)
    // -------------------------------------------------------------
    setDailyMarketingBudget(amount) {
        this.dailyMarketingBudget = Math.max(0, Math.min(50, Math.round((parseFloat(amount) || 0) * 100) / 100));
        this.saveState();
        return this.dailyMarketingBudget;
    }

    getMarketingTrafficBonus() {
        const b = this.dailyMarketingBudget;
        if (b <= 0) return 0;
        if (b <= 15) return Math.round(b * 2.33); // $15 gives ~35%
        if (b <= 35) return Math.round(35 + (b - 15) * 2.0); // $35 gives 75%
        return Math.round(75 + (b - 35) * 3.0); // $50 gives 120%
    }

    getMarketingTierInfo() {
        const b = this.dailyMarketingBudget;
        const bonus = this.getMarketingTrafficBonus();
        if (b <= 0) {
            return {
                tier: 'Organic',
                badge: '🌱 Organic (Word of Mouth)',
                bonus: 0,
                desc: 'Zero ad spend. Rely solely on passing foot traffic.'
            };
        } else if (b <= 15) {
            return {
                tier: 'Social',
                badge: '📱 Social Media Ads (Instagram & TikTok Stories)',
                bonus: bonus,
                desc: 'Targeted short-form video ads driving young patrons and students.'
            };
        } else if (b <= 35) {
            return {
                tier: 'Blogger',
                badge: '🌟 Foodie Bloggers & Street Banners',
                bonus: bonus,
                desc: 'Featured reviews on city food blogs and prominent street signs.'
            };
        } else {
            return {
                tier: 'Influencer',
                badge: '🔥 Mega Influencer Endorsement & Viral Blitz',
                bonus: bonus,
                desc: 'Celebrity barista reviews and viral hype storming your stand!'
            };
        }
    }

    getEstimatedCupCost() {
        const r = this.recipe;
        const yieldPerBatch = (this.upgrades && this.upgrades.machine >= 4) ? 11 : this.batchYield;
        const beansCost = (r.beans / yieldPerBatch) * 0.32;
        const milkCost = r.milk * 0.27;
        const sugarCost = r.sugar * 0.07;
        const iceCost = r.ice * 0.05;
        const cupCost = 0.14;
        const syrupCost = r.syrup * 0.20;
        return Math.round((beansCost + milkCost + sugarCost + iceCost + cupCost + syrupCost) * 100) / 100;
    }

    calculateMarginPerCup() {
        return Math.round((this.recipe.price - this.getEstimatedCupCost()) * 100) / 100;
    }

    applyDailyMarketingBudget() {
        const boostSpend = (this.dailyStats && this.dailyStats.costBoost) ? this.dailyStats.costBoost : 0;
        if (this.dailyMarketingBudget > 0) {
            const actualSpend = Math.min(this.cash, this.dailyMarketingBudget);
            this.cash -= actualSpend;
            this.dailyStats.costMarketing = boostSpend + actualSpend;
            this.saveState();
            return actualSpend;
        }
        this.dailyStats.costMarketing = boostSpend;
        return 0;
    }

    // Purchase equipment upgrade (Supports decor starting at level 0 and other categories at level 1)
    buyUpgrade(category, targetLevel) {
        const list = this.getUpgrades()[category];
        if (!list) return { success: false, message: 'Invalid category' };
        const upgrade = list.find(u => u.level === targetLevel);
        if (!upgrade) return { success: false, message: 'Invalid upgrade level' };

        const defaultLvl = category === 'decor' ? 0 : 1;
        const curLvl = (this.upgrades[category] !== undefined) ? this.upgrades[category] : defaultLvl;
        if (curLvl >= targetLevel) {
            return { success: false, message: 'Already owned!' };
        }
        if (targetLevel > curLvl + 1) {
            return { success: false, message: `Unlock Level ${curLvl + 1} first!` };
        }

        if (this.cash < upgrade.cost) {
            return { success: false, message: `Need $${upgrade.cost.toFixed(2)} to purchase ${upgrade.name}` };
        }

        this.cash -= upgrade.cost;
        this.upgrades[category] = targetLevel;
        this.saveState();

        if (window.soundManager) window.soundManager.playRegister();
        return { success: true, message: `Upgraded to ${upgrade.name}!` };
    }

    // Upfront Location Rental (Blocks renting if cash < rent, and deducts rent immediately upfront!)
    rentLocation(locId) {
        const locs = this.getLocations();
        const loc = locs[locId];
        if (!loc) return { success: false, message: 'Location not found' };

        const isRentAlreadyPaidForTarget = (loc.rent <= 0) ||
            (this.prepaidRentLocation === locId && this.paidLocationRentForDay === this.dayNumber);
        if (this.currentLocation === locId && isRentAlreadyPaidForTarget) {
            return { success: false, message: `Already stationed at ${loc.name}!` };
        }

        // If the player already prepaid rent for another location earlier this same morning
        // (before opening the stand), credit that unused upfront rent toward the new location.
        const unusedMorningRentCredit = (this.paidLocationRentForDay === this.dayNumber)
            ? (this.prepaidRentAmount || 0)
            : 0;
        const effectiveCash = Math.round((this.cash + unusedMorningRentCredit) * 100) / 100;

        if (effectiveCash < loc.rent) {
            return {
                success: false,
                message: `Need $${loc.rent.toFixed(2)} cash upfront to rent ${loc.name}! (You have $${effectiveCash.toFixed(2)})`
            };
        }

        // Apply any unused same-morning rent credit and deduct the new location's upfront rental fee
        this.cash = Math.round((effectiveCash - loc.rent) * 100) / 100;
        this.prepaidRentAmount = loc.rent;
        this.dailyStats.costRent = Math.max(0, (this.dailyStats.costRent || 0) - unusedMorningRentCredit) + loc.rent;
        this.currentLocation = locId;
        this.prepaidRentLocation = locId;
        this.paidLocationRentForDay = this.dayNumber;

        if (typeof window !== 'undefined' && window.simulationEngine) {
            window.simulationEngine._overrideStandX = undefined;
            window.simulationEngine._overrideStandY = undefined;
            if (typeof window.simulationEngine.render === 'function' && window.simulationEngine.ctx) {
                window.simulationEngine.render();
            }
        }
        this.saveState();
        if (window.soundManager) {
            if (loc.rent > 0) window.soundManager.playRegister();
            else window.soundManager.playClick();
        }
        return {
            success: true,
            rentPaid: loc.rent,
            message: loc.rent > 0
                ? `Rented ${loc.name}! Paid $${loc.rent.toFixed(2)} upfront.`
                : `Moved stand to ${loc.name} (Free)!`
        };
    }

    // Ensure daily location rent is paid upfront before opening stand on a new day
    ensureDailyLocationRentPaid() {
        const locs = this.getLocations();
        const loc = locs[this.currentLocation];
        if (!loc) return { success: false, message: 'Invalid location' };
        if (loc.rent <= 0 || (this.prepaidRentLocation === this.currentLocation && this.paidLocationRentForDay === this.dayNumber)) {
            this.prepaidRentLocation = this.currentLocation;
            this.paidLocationRentForDay = this.dayNumber;
            return { success: true, rentPaid: 0 };
        }
        if (this.cash < loc.rent) {
            return {
                success: false,
                message: `Insufficient cash for today's upfront rent at ${loc.name} ($${loc.rent.toFixed(2)})! Move to an affordable location first.`
            };
        }
        this.cash = Math.round((this.cash - loc.rent) * 100) / 100;
        this.prepaidRentLocation = this.currentLocation;
        this.paidLocationRentForDay = this.dayNumber;
        this.prepaidRentAmount = (this.prepaidRentAmount || 0) + loc.rent;
        this.dailyStats.costRent = (this.dailyStats.costRent || 0) + loc.rent;
        this.saveState();
        return { success: true, rentPaid: loc.rent };
    }

    // Change location (Enforces upfront rent payment if cash >= loc.rent)
    setLocation(locId) {
        const res = this.rentLocation(locId);
        return res.success;
    }

    // -------------------------------------------------------------
    // STOCK RESERVATION SYSTEM (Prevents negative inventory)
    // -------------------------------------------------------------
    getAvailableStock() {
        return {
            beans: Math.max(0, this.inventory.beans - (this.reservedBatches * this.recipe.beans)),
            milk: Math.max(0, this.inventory.milk - this.reservedStock.milk),
            sugar: Math.max(0, this.inventory.sugar - this.reservedStock.sugar),
            ice: Math.max(0, this.inventory.ice - this.reservedStock.ice),
            cups: Math.max(0, this.inventory.cups - this.reservedStock.cups),
            syrup: Math.max(0, this.inventory.syrup - this.reservedStock.syrup)
        };
    }

    reserveStock(needed) {
        const avail = this.getAvailableStock();
        if (avail.cups < needed.cups ||
            avail.milk < needed.milk ||
            avail.sugar < needed.sugar ||
            avail.ice < needed.ice ||
            avail.syrup < needed.syrup) {
            return false;
        }

        // Check if pending brewed batch (including already-reserved batches) covers this cup
        const yieldPerBatch = (this.upgrades && this.upgrades.machine >= 4) ? 11 : (this.batchYield || 10);
        const coveredCups = this.cupsInBatch + (this.reservedBatches * yieldPerBatch);
        const unreservedCarafe = coveredCups - this.reservedStock.cups;
        if (unreservedCarafe <= 0) {
            if (avail.beans < this.recipe.beans) {
                return false;
            }
            this.reservedBatches++;
        }

        this.reservedStock.cups += needed.cups;
        this.reservedStock.milk += needed.milk;
        this.reservedStock.sugar += needed.sugar;
        this.reservedStock.ice += needed.ice;
        this.reservedStock.syrup += needed.syrup;
        return true;
    }

    releaseStock(needed) {
        if (!needed) return;
        this.reservedStock.cups = Math.max(0, this.reservedStock.cups - (needed.cups || 0));
        this.reservedStock.milk = Math.max(0, this.reservedStock.milk - (needed.milk || 0));
        this.reservedStock.sugar = Math.max(0, this.reservedStock.sugar - (needed.sugar || 0));
        this.reservedStock.ice = Math.max(0, this.reservedStock.ice - (needed.ice || 0));
        this.reservedStock.syrup = Math.max(0, this.reservedStock.syrup - (needed.syrup || 0));
        const yieldPerBatch = (this.upgrades && this.upgrades.machine >= 4) ? 11 : (this.batchYield || 10);
        const cupsNeedingBrew = Math.max(0, this.reservedStock.cups - this.cupsInBatch);
        this.reservedBatches = Math.ceil(cupsNeedingBrew / yieldPerBatch);
    }

    resetReservedStock() {
        this.reservedStock = { cups: 0, milk: 0, sugar: 0, ice: 0, syrup: 0 };
        this.reservedBatches = 0;
    }

    // -------------------------------------------------------------
    // RECIPE QUALITY EVALUATION
    // -------------------------------------------------------------
    evaluateRecipe(temp) {
        const r = this.recipe;

        // 1. Taste Score (0 to 100)
        let taste = 80;

        // Bean strength
        if (r.beans <= 0) taste = 10; // no beans!
        else if (r.beans === 1) taste -= 25; // watery
        else if (r.beans >= 4 && r.milk === 0 && r.sugar === 0) taste -= 35; // unbearably bitter!

        // Balance ratio: beans vs milk/sugar
        const sweetness = r.sugar * 1.0 + r.syrup * 1.5;
        const creaminess = r.milk * 1.2;
        const bitterness = r.beans * 2.0;

        const balanceDiff = Math.abs(bitterness - (sweetness + creaminess + 1.0));
        taste -= balanceDiff * 6;

        // Grinder Bonus
        const grinderUpg = this.getUpgradeItem('grinder');
        taste += (grinderUpg ? grinderUpg.qualityBonus : 0);

        // Machine Bonus
        const machineUpg = this.getUpgradeItem('machine');
        taste += (machineUpg ? machineUpg.qualityBonus : 0);

        // Hired Staff Quality Bonus (Marco the Master Barista +18%)
        const staffPerks = this.getStaffPerks();
        taste += (staffPerks.qualityBonus || 0);

        // Active NFT Perks (Roast skill bonus)
        if (window.web3Manager && window.web3Manager.getNFTPerks) {
            const nftPerks = window.web3Manager.getNFTPerks();
            taste += nftPerks.qualityBonus;
        }

        taste = Math.max(10, Math.min(100, Math.round(taste)));

        // 2. Temperature & Weather Match (0 to 100)
        let tempScore = 80;
        if (temp >= 32) {
            // Scorching: wants lots of ice (3-6)
            if (r.ice >= 3) tempScore = 100;
            else if (r.ice === 2) tempScore = 75;
            else if (r.ice === 1) tempScore = 50;
            else tempScore = 20; // 0 ice in scorching heat!
        } else if (temp >= 24) {
            // Warm & Sunny: wants moderate to high ice (2-4)
            if (r.ice >= 2 && r.ice <= 4) tempScore = 95;
            else if (r.ice === 0) tempScore = 55;
            else tempScore = 70;
        } else if (temp >= 16) {
            // Mild & Cloudy: flexible, both hot and light iced work
            if (r.ice <= 2) tempScore = 95;
            else tempScore = 65;
        } else {
            // Rainy / Freezing: Wants steaming hot coffee (0 Ice!)
            if (r.ice === 0) tempScore = 100;
            else if (r.ice === 1) tempScore = 55;
            else tempScore = 15; // Iced coffee in freezing snow!
        }

        // Overall Quality
        const overall = Math.round(taste * 0.55 + tempScore * 0.45);
        const stars = (overall / 20).toFixed(1);

        let tasteLabel = 'Balanced & Smooth';
        if (taste < 40) tasteLabel = 'Unbalanced / Watery';
        else if (taste > 85) tasteLabel = 'Artisan Masterpiece ✨';

        let tempLabel = 'Comfortable Temp';
        if (tempScore < 40) tempLabel = (temp > 25 ? 'Too Warm / Needs Ice!' : 'Too Cold / Unwanted Ice!');
        else if (tempScore > 85) tempLabel = 'Perfect Temperature!';

        return {
            overallQuality: overall,
            tasteScore: taste,
            tempScore: tempScore,
            stars: parseFloat(stars),
            tasteLabel,
            tempLabel
        };
    }

    // -------------------------------------------------------------
    // CUSTOMER EVALUATION ON STREET
    // -------------------------------------------------------------
    evaluateCustomerDecision(customer, isBoostActive) {
        const loc = this.getLocations()[this.currentLocation] || this.getLocations().cul_de_sac;
        const evalResult = this.evaluateRecipe(this.weather.temp);

        // 1. Willingness to Pay based on archetype, location, and quality
        let baseTol = loc.basePriceTolerance;
        const archetypeWillingness = {
            'corporate_exec': 1.70,
            'crypto_whale': 2.10,
            'cryptobro': 1.65,
            'fintech_analyst': 1.50,
            'fashionista': 1.45,
            'tech_hacker': 1.40,
            'music_producer': 1.35,
            'business': 1.35,
            'tourist': 1.30,
            'barista_regular': 1.30,
            'metro_commuter': 1.25,
            'hipster': 1.25,
            'marathon_runner': 1.20,
            'professor': 1.20,
            'indie_dev': 1.15,
            'dog_walker': 1.15,
            'jogger': 1.10,
            'casual_shopper': 1.05,
            'grad_student': 1.05,
            'bookworm': 1.00,
            'art_student': 0.95,
            'student': 0.90,
            'retiree': 0.90,
            'senior': 0.85
        };
        const archTol = archetypeWillingness[customer.archetype];
        if (typeof archTol === 'number') {
            baseTol *= archTol;
        } else if (customer.archetype === 'business') baseTol *= 1.35;
        else if (customer.archetype === 'cryptobro') baseTol *= 1.65;
        else if (customer.archetype === 'hipster') baseTol *= 1.25;
        else if (customer.archetype === 'jogger') baseTol *= 1.10;
        else if (customer.archetype === 'student') baseTol *= 0.90;
        else if (customer.archetype === 'senior') baseTol *= 0.85;

        // Quality tolerance multiplier
        const qualityMult = 0.5 + (evalResult.overallQuality / 100) * 0.75;
        baseTol *= qualityMult;

        // Decor upgrade multiplier (Supports decor Level 0..5)
        const decorUpg = this.getUpgradeItem('decor');
        const decorBonus = decorUpg ? (decorUpg.priceTolBonus || 0) : 0;
        baseTol *= (1 + decorBonus);

        // POS Terminal Upgrade multiplier (Lvl 2 QRIS/Card = +10%, Lvl 3 Contactless Tap POS = +18% price willingness)
        const termUpg = this.getUpgradeItem('terminal');
        if (termUpg && termUpg.conversionBonus > 0) {
            baseTol *= (1 + termUpg.conversionBonus / 100);
        }

        // /boost aura multiplier
        if (isBoostActive) baseTol *= 1.25;

        // Check if customer is willing to buy at current price
        const price = this.recipe.price;
        if (price > baseTol) {
            this.recordCustomerReaction('overpriced');
            return {
                buy: false,
                reason: 'price',
                feedback: 'Too pricey! 💸',
                rating: 2.0
            };
        }

        // Quality barrier: If quality is abysmal (< 42), customer tastes and leaves bad review
        if (evalResult.overallQuality < 42 && Math.random() < 0.65) {
            this.recordCustomerReaction('angry');
            return {
                buy: false,
                reason: 'taste',
                feedback: (evalResult.tempScore < 40 ? 'Wrong temp! 🥶' : 'Watery / Bad taste! 😖'),
                rating: 1.5
            };
        }

        // Customer wants to buy! Check available stock (including pending queue reservations)
        const needed = {
            milk: this.recipe.milk,
            sugar: this.recipe.sugar,
            ice: this.recipe.ice,
            cups: 1,
            syrup: this.recipe.syrup
        };

        const avail = this.getAvailableStock();
        let canBrew = true;
        const yieldPerBatch = (this.upgrades && this.upgrades.machine >= 4) ? 11 : (this.batchYield || 10);
        const coveredCups = this.cupsInBatch + (this.reservedBatches * yieldPerBatch);
        const unreservedCarafe = coveredCups - this.reservedStock.cups;
        if (unreservedCarafe <= 0) {
            if (avail.beans < this.recipe.beans) {
                canBrew = false;
            }
        }

        if (!canBrew || avail.cups < needed.cups ||
            avail.milk < needed.milk ||
            avail.sugar < needed.sugar ||
            avail.ice < needed.ice ||
            avail.syrup < needed.syrup) {
            this.recordCustomerReaction('angry');
            return {
                buy: false,
                reason: 'stock',
                feedback: 'Sold out?! 😭',
                rating: 2.0
            };
        }

        // Successful sale! Calculate tip & payment method (Cash / QRIS / Contactless Card Tap)
        let tip = 0;
        const valueMargin = baseTol - price;
        if (valueMargin >= 1.20) {
            tip = 0.50 + Math.random() * 1.50;
        }

        // Decor Upgrade Bonus (Lvl 1..5 tip bonus)
        if (decorUpg && decorUpg.tipBonus > 0) {
            tip *= (1 + decorUpg.tipBonus);
        }

        // Hired Staff Tip Bonus (Martine +10%, Simon +10%, Marco +25%)
        const staffPerks = this.getStaffPerks();
        if (staffPerks.tipBonus > 0) {
            tip *= (1 + staffPerks.tipBonus / 100);
        }

        // Active NFT Perks (+Tips)
        if (window.web3Manager && window.web3Manager.getNFTPerks) {
            const perks = window.web3Manager.getNFTPerks();
            if (perks.tipBonus > 0) {
                tip *= (1 + perks.tipBonus / 100);
            }
        }

        // Digital Payment Method (QRIS / Debit Card / Contactless NFC Tap replaces Crypto!)
        let paymentMethod = 'Cash';
        const digitalArchetypes = ['corporate_exec', 'crypto_whale', 'cryptobro', 'tech_hacker', 'indie_dev', 'business', 'fintech_analyst', 'fashionista', 'student', 'metro_commuter'];
        if (this.upgrades.terminal >= 3 && (digitalArchetypes.includes(customer.archetype) || Math.random() < 0.65)) {
            paymentMethod = Math.random() < 0.55 ? 'Tap' : 'QRIS';
            const tapTip = (customer.archetype === 'corporate_exec' || customer.archetype === 'crypto_whale' ? 1.80 : 0.75) + Math.random() * 1.20;
            const bonusPct = (termUpg && termUpg.tipBonus) ? termUpg.tipBonus : 35;
            tip += tapTip * (1 + bonusPct / 100);
        } else if (this.upgrades.terminal === 2 && (digitalArchetypes.includes(customer.archetype) || Math.random() < 0.45)) {
            paymentMethod = Math.random() < 0.6 ? 'QRIS' : 'Card';
            const qrisTip = 0.45 + Math.random() * 0.85;
            const bonusPct = (termUpg && termUpg.tipBonus) ? termUpg.tipBonus : 15;
            tip += qrisTip * (1 + bonusPct / 100);
        }

        let feedback = 'Mmm, delicious! ☕';
        if (evalResult.overallQuality < 48) {
            feedback = evalResult.tempScore < 40 ? 'Too cold! 🥶' : 'A bit watery... 😐';
        } else if (evalResult.overallQuality >= 88) {
            feedback = 'Masterpiece! 🌟';
        } else if (tip > 0) {
            feedback = 'Keep the change! 💖';
        }
        if (paymentMethod === 'Tap') feedback = 'Contactless Tap! 💳⚡';
        else if (paymentMethod === 'QRIS') feedback = 'Paid via QRIS! 📱✨';
        else if (paymentMethod === 'Card') feedback = 'Paid by Card! 💳';

        // Archetype-flavored commentary (All 24 archetypes)
        const archetypeThoughts = {
            jogger: 'Fresh morning stride energy! 🏃‍♀️✨',
            marathon_runner: 'Perfect split pace fuel! 🏃💨',
            fashionista: 'Chic microfoam aesthetics! 💅✨',
            casual_shopper: 'Sweet shopping treat! 🛍️',
            student: 'Fuel for my morning lecture! 📚☕',
            grad_student: 'Thesis fuel saved my life! 📖⚡',
            art_student: 'Vibrant and aesthetic notes! 🎨☕',
            bookworm: 'Pairs beautifully with my book! 📚',
            business: 'Sharp and decisive flavor! 💼⚡',
            corporate_exec: 'Executive caliber roast! 💼✨',
            fintech_analyst: 'High-alpha caffeine boost! 📈',
            metro_commuter: 'Fast commuter fix on the go! 🚆',
            hipster: 'Superb single-origin acidity! ☕👌',
            barista_regular: 'Silky microfoam texture, fellow roaster! ☕🌟',
            music_producer: 'Hits with high sonic fidelity! 🎧🎵',
            dog_walker: 'Pup and I both approve! 🐕🐾',
            cryptobro: 'High-energy espresso shot! 🚀☕',
            crypto_whale: 'Luxury reserve roast! 🌟☕',
            tech_hacker: 'Zero-latency compiler fuel! 💻🟢',
            indie_dev: 'Bug squashing brew! 🕹️🚀',
            senior: 'Delightfully smooth and mellow! 🌸☕',
            professor: 'Scholarly balance and enlightenment! 🎓',
            retiree: 'Peaceful golden sunshine sip! ☀️🌸',
            tourist: 'Best hidden gem in the city! 🗺️📸'
        };

        // Location-flavored customer commentary when quality is good
        const locationPraise = {
            cul_de_sac: ['Friendly neighborhood cup! 🏡', 'Nice morning brew! ☀️', 'Good luck with the stand! ☕'],
            suburbs: ['Cozy morning brew! 🏡', 'Fresh neighborhood roast! 🌸', 'Warm & peaceful! ✨', 'Mmm, delicious! ☕'],
            park: ['Great post-jog fuel! 🏃', 'Sunny park iced bliss! ☀️', 'Refreshing under the trees! 🌳', 'Mmm, delicious! ☕'],
            campus: ['Saved my exam study! 📚', 'Cramming fuel! 🎓', 'Best study drink on campus! 💻', 'Mmm, delicious! ☕'],
            metro: ['Quick commuter fix! 🚆', 'Just made my train! ⏱️', 'Fast subway brew! 🚇', 'Mmm, delicious! ☕'],
            downtown: ['Fuel for the boardroom! 💼', 'Market-moving roast! 📈', 'Executive flavor! 💎', 'Mmm, delicious! ☕']
        };
        const locPhrases = locationPraise[this.currentLocation] || locationPraise.suburbs;
        if (evalResult.overallQuality >= 75 && paymentMethod === 'Cash' && tip <= 0.6 && Math.random() < 0.6) {
            if (archetypeThoughts[customer.archetype] && Math.random() < 0.5) {
                feedback = archetypeThoughts[customer.archetype];
            } else {
                feedback = locPhrases[Math.floor(Math.random() * locPhrases.length)];
            }
        }

        return {
            buy: true,
            price: price,
            tip: parseFloat(tip.toFixed(2)),
            isCrypto: false,
            paymentMethod: paymentMethod,
            feedback: feedback,
            rating: evalResult.stars,
            needed: needed
        };
    }

    // Parallel Pre-Brewing for Staff (Marco / Martine) & Commercial Dual-Boiler / Multi-Group Machines
    preBrewCarafe() {
        if (this.cupsInBatch > 0) return true;
        const beansNeeded = this.recipe.beans || 1;
        if (this.inventory.beans < beansNeeded) return false;

        let beansToDeduct = beansNeeded;
        if (this.upgrades.machine >= 4 && Math.random() < 0.20) {
            beansToDeduct = Math.max(1, beansToDeduct - 1);
        }
        if (this.upgrades.grinder >= 3 && Math.random() < 0.15) {
            beansToDeduct = Math.max(1, beansToDeduct - 1);
        }
        this.inventory.beans = Math.max(0, this.inventory.beans - beansToDeduct);
        const yieldPerBatch = (this.upgrades.machine >= 4) ? 11 : this.batchYield;
        this.cupsInBatch = yieldPerBatch;
        this.dailyStats.costIngredients += beansToDeduct * 0.32;

        const cupsNeedingBrew = Math.max(0, this.reservedStock.cups - this.cupsInBatch);
        this.reservedBatches = Math.ceil(cupsNeedingBrew / yieldPerBatch);
        return true;
    }

    // Process customer purchase and safely deduct inventory
    executePurchase(decision) {
        // Brew batch if carafe is empty
        if (this.cupsInBatch <= 0) {
            let beansToDeduct = this.recipe.beans;
            // Level 4 Smart Brewer: 20% chance to save 1 scoop of beans
            if (this.upgrades.machine >= 4 && Math.random() < 0.20) {
                beansToDeduct = Math.max(1, beansToDeduct - 1);
            }
            // Level 3 Titanium Flat Burr Grinder: 15% chance to save 1 scoop of beans
            if (this.upgrades.grinder >= 3 && Math.random() < 0.15) {
                beansToDeduct = Math.max(1, beansToDeduct - 1);
            }
            this.inventory.beans = Math.max(0, this.inventory.beans - beansToDeduct);
            this.cupsInBatch = (this.upgrades.machine >= 4) ? 11 : this.batchYield;
            this.dailyStats.costIngredients += beansToDeduct * 0.32;
        }

        // Deduct 1 cup from brewed carafe
        this.cupsInBatch = Math.max(0, this.cupsInBatch - 1);

        // Deduct per-cup supplies safely with clamping
        this.inventory.cups = Math.max(0, this.inventory.cups - decision.needed.cups);
        this.inventory.milk = Math.max(0, this.inventory.milk - decision.needed.milk);
        this.inventory.sugar = Math.max(0, this.inventory.sugar - decision.needed.sugar);
        this.inventory.ice = Math.max(0, this.inventory.ice - decision.needed.ice);
        this.inventory.syrup = Math.max(0, this.inventory.syrup - decision.needed.syrup);

        // Clear queue reservation for this customer
        this.releaseStock(decision.needed);

        // Calculate ingredient cost
        const cupCost = (decision.needed.cups * 0.14) +
                        (decision.needed.milk * 0.27) +
                        (decision.needed.sugar * 0.07) +
                        (decision.needed.ice * 0.05) +
                        (decision.needed.syrup * 0.20);
        this.dailyStats.costIngredients += cupCost;

        // Record payment method breakdown (Cash / QRIS / Tap — all settled into Cash!)
        const pm = decision.paymentMethod || 'Cash';
        if (pm === 'Tap') {
            this.dailyStats.paymentTapCount = (this.dailyStats.paymentTapCount || 0) + 1;
        } else if (pm === 'QRIS' || pm === 'Card') {
            this.dailyStats.paymentQrisCount = (this.dailyStats.paymentQrisCount || 0) + 1;
        } else {
            this.dailyStats.paymentCashCount = (this.dailyStats.paymentCashCount || 0) + 1;
        }

        const priceAmt = decision.price || this.recipe.price || 0;
        const tipAmt = decision.tip || 0;
        this.dailyStats.revenueCash += priceAmt;
        this.dailyStats.tipsCash += tipAmt;
        this.cash = Math.round((this.cash + priceAmt + tipAmt) * 100) / 100;

        this.dailyStats.cupsSold++;
        this.totalCupsSoldLifetime++;
        if (decision.rating !== undefined) {
            this.dailyStats.ratings.push(decision.rating);
        }
        if (decision.feedback) {
            this.dailyStats.feedbackList.push(decision.feedback);
        }
        if ((decision.rating || 3.5) >= 3.0) {
            this.recordCustomerReaction('happy');
        } else {
            this.recordCustomerReaction('angry');
        }

        // Sound effect (suppressed during fast skip)
        if (window.soundManager && (!window.simulationEngine || !window.simulationEngine.isSkipping)) {
            window.soundManager.playCoin();
        }

        this.saveState();
    }

    // -------------------------------------------------------------
    // EMERGENCY LOAN / INSOLVENCY BAILOUT
    // -------------------------------------------------------------
    isBankrupt() {
        return this.cash < 0 || (this.cash < 4.00 && this.inventory.cups <= 0 && this.inventory.beans <= 0);
    }

    takeEmergencyLoan() {
        const loanAmount = 50.00;
        this.cash += loanAmount;
        this.activeLoan += loanAmount;
        this.saveState();
        if (window.soundManager) window.soundManager.playRegister();
        return {
            success: true,
            message: `Approved $${loanAmount.toFixed(2)} Emergency Micro-Loan! Cash added to wallet.`
        };
    }

    repayLoan(amount) {
        if (amount <= 0 || this.activeLoan <= 0) return { success: false, message: 'No loan to repay!' };
        const repayAmount = Math.min(amount, this.activeLoan);
        if (this.cash < repayAmount) {
            return { success: false, message: `Insufficient cash! Need $${repayAmount.toFixed(2)}` };
        }

        this.cash -= repayAmount;
        this.activeLoan -= repayAmount;
        this.saveState();
        if (window.soundManager) window.soundManager.playCoin();
        return {
            success: true,
            message: `Successfully repaid $${repayAmount.toFixed(2)} of emergency loan! Remaining debt: $${this.activeLoan.toFixed(2)}`
        };
    }

    claimBailoutGrant() {
        if (this.cash > 5.00) {
            return { success: false, message: 'You have sufficient funds and do not qualify for an emergency grant!' };
        }
        const grant = 25.00;
        this.cash = Math.max(0, this.cash) + grant;
        this.inventory.cups = Math.max(this.inventory.cups, 20);
        this.inventory.beans = Math.max(this.inventory.beans, 20);
        this.saveState();
        if (window.soundManager) window.soundManager.playHappy();
        return {
            success: true,
            message: `Emergency Barista Aid granted! +$${grant.toFixed(2)} Cash, +20 Cups, and +20 Beans!`
        };
    }

    // -------------------------------------------------------------
    // END OF DAY FINANCIAL AUDIT & SPOILAGE
    // -------------------------------------------------------------
    endDay() {
        const loc = this.getLocations()[this.currentLocation] || this.getLocations().cul_de_sac;
        const cooler = this.getUpgradeItem('cooler');

        // 1. Spoilage & Melting
        // Ice Melting (At Level 1 Cooler, meltRate = 1.0 -> 100% of leftover ice melts!)
        const iceMelts = Math.floor(this.inventory.ice * cooler.meltRate);
        this.meltedIce = iceMelts;
        this.inventory.ice = Math.max(0, this.inventory.ice - iceMelts);
        const iceSpoilageCost = iceMelts * 0.05;

        // Milk Spoilage (At Level 1 Cooler, 100% of leftover milk spoils every day!)
        let milkSpoils = 0;
        if (this.upgrades.cooler <= 1) {
            milkSpoils = this.inventory.milk;
        } else if (this.weather.temp > cooler.milkSpoilTemp) {
            const spoilRate = (typeof cooler.milkSpoilRate === 'number') ? cooler.milkSpoilRate : 0.50;
            milkSpoils = Math.floor(this.inventory.milk * spoilRate);
        }
        this.spoiledMilk = milkSpoils;
        this.inventory.milk = Math.max(0, this.inventory.milk - milkSpoils);
        const milkSpoilageCost = milkSpoils * 0.27;

        // Discard leftover brewed coffee carafe (fresh carafe tomorrow)
        this.discardedCarafe = this.cupsInBatch;
        this.cupsInBatch = 0;
        this.resetReservedStock();

        this.dailyStats.costSpoilage = iceSpoilageCost + milkSpoilageCost;

        // 2. Location Rent, Daily Staff Wages & Loan Interest Deduction
        const prepaidToday = this.prepaidRentAmount || 0;
        if (prepaidToday > 0 || this.prepaidRentLocation === this.currentLocation) {
            // Rent was already deducted upfront when renting / starting the day
            this.dailyStats.costRent = Math.max(loc.rent, prepaidToday);
            const unpaidRemainder = Math.max(0, loc.rent - prepaidToday);
            if (unpaidRemainder > 0) {
                this.cash -= unpaidRemainder;
            }
        } else {
            this.dailyStats.costRent = loc.rent;
            this.cash -= loc.rent;
        }
        // Reset upfront rent tracker for the next day (free locations stay marked as paid)
        this.prepaidRentAmount = 0;
        this.prepaidRentLocation = (loc.rent === 0) ? this.currentLocation : null;
        this.paidLocationRentForDay = (loc.rent === 0) ? (this.dayNumber + 1) : null;

        // Deduct daily wages for all hired staff
        const dailyStaffWage = this.getDailyStaffCost();
        this.dailyStats.costStaff = dailyStaffWage;
        if (dailyStaffWage > 0) {
            this.cash -= dailyStaffWage;
        }

        if (this.activeLoan > 0) {
            const dailyInterest = Math.round(this.activeLoan * this.loanInterestRate * 100) / 100;
            this.dailyStats.costLoanInterest = dailyInterest;
            this.cash -= dailyInterest;
        }

        // 3. Balance Sheet Totals
        const totalGrossRevenue = this.dailyStats.revenueCash + this.dailyStats.tipsCash +
                                 this.dailyStats.revenueCrypto + this.dailyStats.tipsCrypto;
        const totalExpenses = this.dailyStats.costIngredients + this.dailyStats.costRent + 
                             (this.dailyStats.costStaff || 0) +
                             this.dailyStats.costSpoilage + (this.dailyStats.costLoanInterest || 0) +
                             (this.dailyStats.costMarketing || 0);
        const netProfit = totalGrossRevenue - totalExpenses;

        this.totalRevenueLifetime += totalGrossRevenue;

        // Average satisfaction
        let avgRating = 0;
        if (this.dailyStats.ratings.length > 0) {
            const sum = this.dailyStats.ratings.reduce((a, b) => a + b, 0);
            avgRating = parseFloat((sum / this.dailyStats.ratings.length).toFixed(1));
        }

        // Reputation & Location Popularity/Satisfaction update
        const locStats = this.locationStats[this.currentLocation] || { popularity: 20, satisfaction: 50 };
        if (avgRating >= 4.0) {
            this.reputation = Math.min(100, this.reputation + 4);
            locStats.popularity = Math.min(100, locStats.popularity + 3.0);
            locStats.satisfaction = Math.min(100, locStats.satisfaction + 4.0);
            if (window.web3Manager) {
                window.web3Manager.addBean(10);
            }
        } else if (avgRating > 0 && avgRating < 3.0) {
            this.reputation = Math.max(10, this.reputation - 5);
            locStats.popularity = Math.max(5, locStats.popularity - 2.5);
            locStats.satisfaction = Math.max(5, locStats.satisfaction - 4.0);
        }

        // Advertising & Promoter bonus to location popularity
        if (this.dailyMarketingBudget > 0) {
            const adPopGain = Math.round(this.dailyMarketingBudget * 0.18);
            locStats.popularity = Math.min(100, locStats.popularity + adPopGain);
        }
        if (this.hiredStaff && this.hiredStaff.promoter) {
            locStats.popularity = Math.min(100, locStats.popularity + 2.5);
        }
        this.locationStats[this.currentLocation] = locStats;

        // Archive day ledger entry
        const ledgerEntry = {
            day: this.dayNumber,
            date: new Date().toLocaleDateString(),
            location: loc.name,
            weather: this.weather,
            stats: { ...this.dailyStats },
            openingCash: this.dailyStats.openingCash,
            openingCrypto: this.dailyStats.openingCrypto,
            totalRevenue: totalGrossRevenue,
            totalExpenses: totalExpenses,
            netProfit: netProfit,
            avgRating: avgRating,
            meltedIce: iceMelts,
            spoiledMilk: milkSpoils,
            discardedCarafe: this.discardedCarafe,
            closingCash: this.cash,
            closingCrypto: 0,
            activeLoan: this.activeLoan
        };

        this.ledgerHistory.unshift(ledgerEntry);

        // Prep next day
        this.dayNumber++;
        this.totalDaysPlayed++;
        this.weather = this.tomorrowWeather;
        this.tomorrowWeather = this.generateWeather();
        this.dailyStats = this.createNewDailyStats();

        // Save
        this.saveState();

        return ledgerEntry;
    }

    // -------------------------------------------------------------
    // PERSISTENCE (localStorage)
    // -------------------------------------------------------------
    loadState() {
        try {
            const saved = localStorage.getItem('coffede_simulation');
            if (saved) {
                const data = JSON.parse(saved);
                this.cash = (typeof data.cash === 'number') ? data.cash : 40.00;
                this.reputation = data.reputation || 50;
                this.activeLoan = (typeof data.activeLoan === 'number') ? data.activeLoan : 0.00;
                this.dailyMarketingBudget = (typeof data.dailyMarketingBudget === 'number') ? data.dailyMarketingBudget : 0.00;
                
                // Safe sanitize inventory to avoid negative values from legacy bugs
                if (data.inventory) {
                    this.inventory = {
                        beans: Math.max(0, data.inventory.beans || 0),
                        milk: Math.max(0, data.inventory.milk || 0),
                        sugar: Math.max(0, data.inventory.sugar || 0),
                        ice: Math.max(0, data.inventory.ice || 0),
                        cups: Math.max(0, data.inventory.cups || 0),
                        syrup: Math.max(0, data.inventory.syrup || 0)
                    };
                }

                this.recipe = data.recipe || this.recipe;
                const validLocs = this.getLocations();
                this.currentLocation = (data.currentLocation && validLocs[data.currentLocation]) ? data.currentLocation : 'cul_de_sac';
                const activeLoc = validLocs[this.currentLocation];
                this.prepaidRentLocation = data.prepaidRentLocation || (activeLoc && activeLoc.rent === 0 ? this.currentLocation : null);
                this.prepaidRentAmount = (typeof data.prepaidRentAmount === 'number' && data.prepaidRentAmount >= 0) ? data.prepaidRentAmount : 0;

                const rawUpgrades = Object.assign({ machine: 1, cooler: 1, grinder: 1, terminal: 1, canopy: 1, marketing: 1, decor: 0 }, data.upgrades || {});
                const upgCatalog = this.getUpgrades();
                for (const cat of Object.keys(upgCatalog)) {
                    const minLvl = (cat === 'decor') ? 0 : 1;
                    const maxLvl = upgCatalog[cat][upgCatalog[cat].length - 1].level;
                    const val = parseInt(rawUpgrades[cat], 10);
                    rawUpgrades[cat] = Number.isFinite(val) ? Math.max(minLvl, Math.min(maxLvl, val)) : minLvl;
                }
                this.upgrades = rawUpgrades;
                if (data.hiredStaff && typeof data.hiredStaff === 'object') {
                    this.hiredStaff = Object.assign({ cashier: false, entertainer: false, promoter: false, barista: false }, data.hiredStaff);
                }
                if (data.locationStats) {
                    this.locationStats = Object.assign(this.locationStats, data.locationStats);
                }
                this.dayNumber = data.dayNumber || 1;
                this.paidLocationRentForDay = data.paidLocationRentForDay || (this.prepaidRentLocation === this.currentLocation ? this.dayNumber : null);

                // Normalize prepaid rent when loading on the same morning (migrates legacy inflated rent saves cleanly)
                if (this.paidLocationRentForDay === this.dayNumber && this.prepaidRentLocation === this.currentLocation && activeLoc) {
                    if (this.prepaidRentAmount > activeLoc.rent) {
                        const refundDiff = Math.round((this.prepaidRentAmount - activeLoc.rent) * 100) / 100;
                        this.cash = Math.round((this.cash + refundDiff) * 100) / 100;
                        this.prepaidRentAmount = activeLoc.rent;
                    } else if (this.prepaidRentAmount === 0 && activeLoc.rent > 0) {
                        this.prepaidRentAmount = activeLoc.rent;
                    }
                } else if (this.paidLocationRentForDay !== this.dayNumber) {
                    this.prepaidRentAmount = 0;
                }

                // Sync dailyStats openingCash and costRent with loaded state
                if (this.dailyStats) {
                    const activePrepaid = (this.paidLocationRentForDay === this.dayNumber) ? (this.prepaidRentAmount || 0) : 0;
                    this.dailyStats.openingCash = Math.round((this.cash + activePrepaid) * 100) / 100;
                    this.dailyStats.costRent = activePrepaid;
                }

                this.totalDaysPlayed = data.totalDaysPlayed || 0;
                this.totalCupsSoldLifetime = data.totalCupsSoldLifetime || 0;
                this.totalRevenueLifetime = data.totalRevenueLifetime || 0;
                this.ledgerHistory = data.ledgerHistory || [];
            }
        } catch (e) {
            console.warn('Simulation load error', e);
        }
    }

    saveState() {
        try {
            const data = {
                cash: this.cash,
                reputation: this.reputation,
                activeLoan: this.activeLoan,
                dailyMarketingBudget: this.dailyMarketingBudget,
                inventory: this.inventory,
                recipe: this.recipe,
                currentLocation: this.currentLocation,
                prepaidRentLocation: this.prepaidRentLocation,
                paidLocationRentForDay: this.paidLocationRentForDay,
                prepaidRentAmount: this.prepaidRentAmount,
                upgrades: this.upgrades,
                hiredStaff: this.hiredStaff,
                locationStats: this.locationStats,
                dayNumber: this.dayNumber,
                totalDaysPlayed: this.totalDaysPlayed,
                totalCupsSoldLifetime: this.totalCupsSoldLifetime,
                totalRevenueLifetime: this.totalRevenueLifetime,
                ledgerHistory: this.ledgerHistory.slice(0, 30) // keep last 30 days
            };
            localStorage.setItem('coffede_simulation', JSON.stringify(data));
        } catch (e) {
            console.warn('Simulation save error', e);
        }
    }

    resetGame() {
        localStorage.removeItem('coffede_simulation');
        localStorage.removeItem('coffede_web3');
        this.cash = 40.00;
        this.reputation = 50;
        this.activeLoan = 0.00;
        this.dailyMarketingBudget = 0.00;
        this.inventory = { beans: 0, milk: 0, sugar: 0, ice: 0, cups: 0, syrup: 0 };
        this.recipe = { beans: 1, milk: 0, sugar: 0, ice: 0, syrup: 0, price: 2.50, acceptCrypto: false };
        this.currentLocation = 'cul_de_sac';
        this.prepaidRentLocation = 'cul_de_sac';
        this.paidLocationRentForDay = 1;
        this.prepaidRentAmount = 0;
        this.upgrades = { machine: 1, cooler: 1, grinder: 1, terminal: 1, canopy: 1, marketing: 1, decor: 0 };
        this.hiredStaff = { cashier: false, entertainer: false, promoter: false, barista: false };
        this.locationStats = {
            cul_de_sac: { popularity: 25, satisfaction: 55 },
            suburbs: { popularity: 30, satisfaction: 60 },
            park: { popularity: 20, satisfaction: 50 },
            campus: { popularity: 15, satisfaction: 50 },
            metro: { popularity: 10, satisfaction: 50 },
            downtown: { popularity: 10, satisfaction: 50 }
        };
        this.dayNumber = 1;
        this.cupsInBatch = 0;
        this.resetReservedStock();
        this.dailyStats = this.createNewDailyStats();
        this.ledgerHistory = [];
        if (typeof window !== 'undefined' && window.web3Manager) {
            window.web3Manager.isBoostActive = false;
            window.web3Manager.lastBoostDay = -1;
        }
        this.saveState();
    }
}

window.simulationModel = new SimulationModel();
