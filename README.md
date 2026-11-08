# ☕ Coffede Tycoon | Pixel Art Coffee Simulation & Web3

**Coffede Tycoon** is a pixel-art tycoon simulation game directly inspired by the classic **Lemonade Tycoon (2003)**, re-imagined for coffee culture with deep economic mechanics, recipe tuning, weather effects, multi-location progression, equipment upgrades, Web3 DEX swap, community tip jar, global on-chain leaderboard, and the **/boost** viral hype mechanic!

---

## 🎮 Core Features

### 1. Lemonade Tycoon Core Loop
- **Day Prep Phase**:
  - Check the daily weather forecast (temperature & weather type: Sunny, Scorching Heatwave, Mild Cloudy, Chilly Rain, Winter Frost).
  - Manage inventory: Coffee beans, fresh milk, sugar packets, ice cubes, paper cups & lids, and gourmet syrups.
  - Spoilage mechanics: Ice melts overnight and milk spoils in warm weather unless you invest in upgraded coolers and refrigerators!
  - Recipe Tuning: Balance beans (strength), milk (creaminess), sugar (sweetness), ice cubes (cold vs hot brew), and gourmet syrup pumps.
  - Set cash price ($1.00 - $12.00) and toggle crypto payment acceptance (USDC / ETH).
  - Interactive recipe gauge dynamically calculates taste score, weather temperature match, customer satisfaction stars (1.0 to 5.0 ⭐), unit brewing costs, and profit margin.
- **Daytime Simulation (Animated Pixel Art Street)**:
  - 640x360 pixel art canvas rendered with `image-rendering: pixelated` for crisp retro aesthetics.
  - Dynamic day cycle (8:00 AM to 6:00 PM) with variable time-of-day sky gradients, sun, drifting clouds, and weather effects (rain streaks, puddle ripples, falling snow, heatwaves).
  - Animated coffee cart with flapping canopy, espresso machine with steam puffs, burr grinder, cup stacks, visible mini-fridge/cooler, glass tip jar, and an animated barista brewing and serving patrons.
  - **Carafe Pouring vs Fresh Batch Brewing**: Coffee is brewed in 10-cup carafes. Pouring from a ready carafe is lightning fast (0.2s - 0.8s), while fresh batches use the machine's full brew time.
  - **Orderly Single-Line Queue & Stock Reservation**: Queue customers reserve ingredients to prevent negative inventory and race condition glitches.
  - 6 pedestrian archetypes:
    - **College Students** (Hoodies & headphones, budget-conscious, craves caffeine & sweet syrups)
    - **Business Executives** (Suits & briefcases, high price tolerance, demands quick service)
    - **Joggers / Athletes** (Tracksuits & headbands, thirsty on hot days, loves iced brews)
    - **Crypto Bros / Tech Whales** (Laser eyes & hoodies, pays in USDC/ETH, tips lavishly!)
    - **Hipsters** (Beanies & scarves, quality-driven artisan tastes)
    - **Seniors** (Gentle walkers, seeks affordable warm comforting coffee)
  - Real-time customer decision AI, queuing line system, and thought/feedback bubbles (*"Too pricey! 💸"*, *"Wrong temp! 🥶"*, *"Sold out?! 😭"*, *"Mmm, delicious! ☕"*, *"Paid with USDC! 🚀"*).
  - Controls: Start Day, Pause, 1x / 2x / 5x simulation speed, Fast Finish.
- **End of Day Financial Statement**:
  - Detailed Lemonade Tycoon-style daily audit sheet:
    - Opening Cash Balance vs Ending Cash Balance
    - Pedestrians passed vs Cups sold
    - Customer loss breakdown (Price resistance, bad recipe/temp, out-of-stock, long queue wait)
    - Cash Revenue + Crypto Revenue
    - Cost of Goods Sold (Beans, Milk, Sugar, Ice, Cups, Syrup)
    - Spoilage / Melt loss & Discarded leftover carafe coffee
    - Location Rent & Loan interest
    - **Net Daily Profit / Loss**
    - Customer satisfaction rating & brand reputation change
    - Next day's weather forecast preview

---

## 📍 20 Iconic Locations Across 5 Realistic Tiers ($0 – $300/day)
1. **Tier 1 – Starter Neighborhoods ($0–$15/day)**: Quiet Cul-de-Sac ($0), Community Garden ($5), Town Public Library ($10), Greenwood Suburbs ($15).
2. **Tier 2 – Charming Scenic & Market Spots ($22–$45/day)**: Lakefront Marina ($22), Pine Forest Campsite ($28), Village Farmers Market ($35), Central City Park ($45).
3. **Tier 3 – High-Traffic Urban Hubs ($55–$90/day)**: Sunny Beach Boardwalk ($55), Downtown Construction Site ($65), Bohemian Art District ($75), Tech University Campus ($90).
4. **Tier 4 – Bustling Commercial Hubs ($110–$165/day)**: Amusement Boardwalk Pier ($110), City Sports Complex ($125), Grand Galleria Mall ($145), Metro Medical Center ($165).
5. **Tier 5 – Peak Megacity Transit & Finance ($190–$300/day)**: Grand Central Metro ($190), Convention & Expo Center ($220), Wall St. Financial Plaza ($250), International Airport Terminal ($300).

---

## 🛠️ Equipment & Stand Upgrades
- **Espresso Machines**: French Press (2.8s brew) ➔ Compact Espresso (1.8s brew) ➔ Italian Dual-Boiler (1.0s brew) ➔ Cyberpunk Web3 Smart Brewer (0.5s brew + 35% taste boost, saves 10% beans & yields 11 cups).
- **Coolers & Refrigeration**: Cardboard Box (85% ice melt) ➔ Insulated Ice Chest (40% melt) ➔ Barista Mini-Fridge (milk never spoils) ➔ Cryo-Freezer (0% melt, 0% spoilage).
- **Coffee Grinders**: Hand Crank ➔ Conical Burr Grinder (+12% quality) ➔ Titanium Flat Burr Laser Mill (+25% quality).
- **Payment Terminals**: Coin Tin ➔ POS Card Terminal (+10% conversion) ➔ Web3 Crypto Terminal (+35% crypto tips).
- **Marketing**: Word of Mouth ➔ Chalkboard & Flyers ➔ Neon Sign ➔ Viral Crypto Social Blitz (+75% foot traffic).
- **Cart Decor**: Rustic Timber ➔ Artisan Mahogany ➔ Cyber Gold Boutique Cart (+30% price tolerance, +20% tips).

---

## 🚀 Web3 Integration, DEX Swap, Tip Jar & The `/boost` Mechanic
- **Coffede Web3 Vault**: Connect simulated wallet (or browser Web3 like MetaMask if available) with persistent Ethereum address (`0x...`).
- **Instant DEX Swap & Off-Ramp**:
  - Swap USDC ➔ Cash (1:1 Peg) to pay rent and buy supplies.
  - Swap Cash ➔ USDC for crypto vault growth.
  - Redeem $BEAN rewards for Cash (10 $BEAN = $1.00 USD).
- **Community Web3 Tip Jar**:
  - Generous patrons drop cash and crypto tips into the counter tip jar.
  - Collect accumulated tips directly into your balances.
  - Tip Barista (2 USDC) to trigger a **+25% Barista Brewing Speed Morale Boost**!
- **On-Chain Global Leaderboard**:
  - Live competitive rankings against rival coffee moguls (*Satoshi's Genesis Roastery, Vitalik's Cold Brew Lab, Cyber Mocha DAO*, etc.).
  - Rebrand your franchise stand with custom name.
- **The `/boost` Feature**:
  - Burn 25 $BEAN (or activate free every 2 in-game days).
  - Triggers a viral on-chain hype surge: **200% customer traffic rush** and high density of affluent Crypto Whales who pay double and tip in USDC!
  - Accompanied by confetti, stand gold aura, and synthesized hype audio.
- **Franchise NFT Minting Engine & Active Traits**:
  - Unlock milestone Franchise NFT Certificates (Genesis, Rare, Epic, Legendary).
  - Renders a unique high-resolution generative pixel-art NFT card directly to canvas.
  - Owned NFTs grant passive perks to brew speed, tips, and coffee quality!
  - "Download NFT (.PNG)" button allows saving your personalized collectible certificate!
- **Emergency Financial Aid & Insolvency Protection**:
  - Barista DAO Emergency Micro-Loan ($50.00 cash).
  - Master Zay's Angel Grant for destitute stands.

---

## 🔊 Sound & Architecture
- **Web Audio API**: 100% self-contained audio synthesizer with zero external MP3 dependencies. Generates chiptune button blips, cash register cha-chings, coin drops, coffee pours, ice clinks, customer reaction chimes, and victory fanfares.
- **Zero Build Step**: Standalone HTML5/CSS/JavaScript. Runs natively by simply double clicking `index.html` in any browser!
