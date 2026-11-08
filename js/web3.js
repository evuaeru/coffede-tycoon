// Coffede Tycoon - Web3, Crypto Wallet, DEX Swap, Franchise NFT, Tip Jar & Leaderboard Engine
// Supports simulated offline Web3 as well as optional window.ethereum integration.

class Web3Manager {
    constructor() {
        this.connected = false;
        this.address = null;
        this.isMetaMask = false;
        
        // Token Balances
        this.usdc = 15.0; // Starting crypto balance
        this.bean = 50.0; // Starting $BEAN reward tokens
        
        // Web3 Tip Jar
        this.tipJarUSDC = 0.0;
        this.tipJarCash = 0.0;
        this.tipJarBean = 0.0;

        // Barista Morale Boost (from tipping barista)
        this.baristaMoraleBoost = 0; // +25% speed & tip bonus for the day

        // Franchise Branding & Custom Name
        this.franchiseName = "Master Zay's Cyber Roastery";

        // NFT Franchise Collection
        this.nfts = [];
        this.lastBoostDay = -1;
        this.isBoostActive = false;

        this.loadState();
    }

    loadState() {
        try {
            const saved = localStorage.getItem('coffede_web3');
            if (saved) {
                const data = JSON.parse(saved);
                this.connected = data.connected || false;
                this.address = data.address || null;
                this.usdc = (typeof data.usdc === 'number') ? data.usdc : 15.0;
                this.bean = (typeof data.bean === 'number') ? data.bean : 50.0;
                this.tipJarUSDC = (typeof data.tipJarUSDC === 'number') ? data.tipJarUSDC : 0.0;
                this.tipJarCash = (typeof data.tipJarCash === 'number') ? data.tipJarCash : 0.0;
                this.tipJarBean = (typeof data.tipJarBean === 'number') ? data.tipJarBean : 0.0;
                this.franchiseName = data.franchiseName || "Master Zay's Cyber Roastery";
                this.nfts = data.nfts || [];
                this.lastBoostDay = (typeof data.lastBoostDay === 'number') ? data.lastBoostDay : -1;
                this.isBoostActive = Boolean(data.isBoostActive);
            }
        } catch (e) {
            console.warn('Web3 load error', e);
        }

        // Auto-generate a simulated address if none exists
        if (!this.address) {
            this.address = this.generateSimulatedAddress();
        }
    }

    saveState() {
        try {
            const data = {
                connected: this.connected,
                address: this.address,
                usdc: this.usdc,
                bean: this.bean,
                tipJarUSDC: this.tipJarUSDC,
                tipJarCash: this.tipJarCash,
                tipJarBean: this.tipJarBean,
                franchiseName: this.franchiseName,
                nfts: this.nfts,
                lastBoostDay: this.lastBoostDay,
                isBoostActive: this.isBoostActive
            };
            localStorage.setItem('coffede_web3', JSON.stringify(data));
        } catch (e) {
            console.warn('Web3 save error', e);
        }
    }

    generateSimulatedAddress() {
        const chars = '0123456789abcdef';
        let addr = '0x';
        for (let i = 0; i < 40; i++) {
            addr += chars[Math.floor(Math.random() * chars.length)];
        }
        return addr;
    }

    getShortAddress() {
        if (!this.address) return 'Not Connected';
        return this.address.substring(0, 6) + '...' + this.address.substring(this.address.length - 4);
    }

    async connectWallet() {
        // Check for real browser Web3 wallet (MetaMask, Rabby, etc.)
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts.length > 0) {
                    this.address = accounts[0];
                    this.connected = true;
                    this.isMetaMask = true;
                    this.saveState();
                    if (window.soundManager) window.soundManager.playHappy();
                    return { success: true, address: this.address, provider: 'MetaMask' };
                }
            } catch (err) {
                console.warn('User rejected web3 or error:', err);
            }
        }

        // Fallback to simulated high-security Coffede Web3 Wallet
        this.connected = true;
        this.isMetaMask = false;
        if (!this.address) this.address = this.generateSimulatedAddress();
        this.saveState();
        if (window.soundManager) window.soundManager.playHappy();
        return { success: true, address: this.address, provider: 'Simulated Coffede Vault' };
    }

    disconnectWallet() {
        this.connected = false;
        this.saveState();
    }

    addUSDC(amount) {
        this.usdc += amount;
        this.saveState();
    }

    addBean(amount) {
        this.bean += amount;
        this.saveState();
    }

    // -------------------------------------------------------------
    // DEX SWAP / OFF-RAMP (Solves trapped crypto problem!)
    // -------------------------------------------------------------
    swapUSDCToCash(amount) {
        if (amount <= 0) return { success: false, message: 'Invalid swap amount' };
        if (this.usdc < amount) {
            return { success: false, message: `Insufficient USDC! You have ${this.usdc.toFixed(2)} USDC` };
        }

        this.usdc -= amount;
        if (window.simulationModel) {
            window.simulationModel.cash += amount;
            window.simulationModel.saveState();
        }
        this.saveState();

        if (window.soundManager) window.soundManager.playRegister();
        return { success: true, message: `Successfully swapped ${amount.toFixed(2)} USDC for $${amount.toFixed(2)} Cash!` };
    }

    swapCashToUSDC(amount) {
        if (amount <= 0) return { success: false, message: 'Invalid swap amount' };
        if (!window.simulationModel || window.simulationModel.cash < amount) {
            return { success: false, message: 'Insufficient Cash to swap for USDC!' };
        }

        window.simulationModel.cash -= amount;
        this.usdc += amount;
        window.simulationModel.saveState();
        this.saveState();

        if (window.soundManager) window.soundManager.playCoin();
        return { success: true, message: `Successfully converted $${amount.toFixed(2)} Cash into ${amount.toFixed(2)} USDC!` };
    }

    swapBeanToCash(amount) {
        if (amount <= 0) return { success: false, message: 'Invalid amount' };
        if (this.bean < amount) {
            return { success: false, message: `Insufficient $BEAN! (Need ${amount} $BEAN)` };
        }

        // 10 $BEAN = $1.00 USD cash
        const cashValue = (amount * 0.10);
        this.bean -= amount;
        if (window.simulationModel) {
            window.simulationModel.cash += cashValue;
            window.simulationModel.saveState();
        }
        this.saveState();

        if (window.soundManager) window.soundManager.playCoin();
        return { success: true, message: `Redeemed ${amount} $BEAN for $${cashValue.toFixed(2)} Cash!` };
    }

    // -------------------------------------------------------------
    // WEB3 TIP JAR (Community on-chain tip jar & barista morale)
    // -------------------------------------------------------------
    addToTipJar(type, amount) {
        if (type === 'usdc') this.tipJarUSDC += amount;
        else if (type === 'bean') this.tipJarBean += amount;
        else this.tipJarCash += amount;
        this.saveState();
    }

    collectTipJar() {
        const totalCash = this.tipJarCash;
        const totalUSDC = this.tipJarUSDC;
        const totalBean = this.tipJarBean;

        if (totalCash <= 0 && totalUSDC <= 0 && totalBean <= 0) {
            return { success: false, message: 'Tip Jar is currently empty!' };
        }

        if (window.simulationModel) {
            window.simulationModel.cash += totalCash;
            window.simulationModel.saveState();
        }
        this.usdc += totalUSDC;
        this.bean += totalBean;

        this.tipJarCash = 0;
        this.tipJarUSDC = 0;
        this.tipJarBean = 0;
        this.saveState();

        if (window.soundManager) window.soundManager.playRegister();
        return {
            success: true,
            message: `Emptied Tip Jar! Collected +$${totalCash.toFixed(2)} Cash, +${totalUSDC.toFixed(2)} USDC, and +${totalBean.toFixed(0)} $BEAN!`
        };
    }

    tipBarista(amountUSDC = 2.0) {
        if (this.usdc < amountUSDC) {
            return { success: false, message: `Need ${amountUSDC.toFixed(2)} USDC to tip the barista!` };
        }

        this.usdc -= amountUSDC;
        this.baristaMoraleBoost = 0.25; // 25% faster brewing and extra friendly vibe!
        this.saveState();

        if (window.simulationModel) {
            window.simulationModel.reputation = Math.min(100, window.simulationModel.reputation + 3);
            window.simulationModel.saveState();
        }

        if (window.soundManager) window.soundManager.playHappy();
        return {
            success: true,
            message: `Tipped the Barista ${amountUSDC.toFixed(2)} USDC! Barista Morale +25% Speed & Stand Reputation +3%! ☕❤️`
        };
    }

    // -------------------------------------------------------------
    // ON-CHAIN LEADERBOARDS
    // -------------------------------------------------------------
    setFranchiseName(name) {
        if (!name || name.trim() === '') return;
        this.franchiseName = name.trim();
        this.saveState();
    }

    getLeaderboard() {
        const sim = window.simulationModel;
        const playerCups = sim ? sim.totalCupsSoldLifetime : 0;
        const playerRevenue = sim ? (sim.cash + this.usdc + sim.totalRevenueLifetime) : 50;
        const playerRep = sim ? sim.reputation : 50;

        const defaultRivals = [
            { name: "Satoshi's Genesis Roastery", owner: "0x1A4b...9E21", nft: "COFFEDE-NFT-#0001", cups: 3200, netWorth: 18450.00, rep: 98 },
            { name: "Vitalik's Cold Brew Lab", owner: "0xd8dA...6045", nft: "COFFEDE-NFT-#0003", cups: 2450, netWorth: 13200.50, rep: 95 },
            { name: "Cyber Mocha DAO", owner: "0x8920...2aB1", nft: "COFFEDE-NFT-#0008", cups: 1850, netWorth: 9850.00, rep: 92 },
            { name: "Solana Speed Sips", owner: "0x52E9...7f19", nft: "COFFEDE-NFT-#0014", cups: 1250, netWorth: 6420.00, rep: 88 },
            { name: "DeFi Drip Lounge", owner: "0x34C8...1a02", nft: "COFFEDE-NFT-#0022", cups: 820, netWorth: 3950.00, rep: 82 },
            { name: "Pixel Espresso Corner", owner: "0x91F2...3c44", nft: "COFFEDE-NFT-#0035", cups: 450, netWorth: 1850.00, rep: 74 },
            { name: "Suburban Java Cart", owner: "0x23B0...89D3", nft: "None", cups: 120, netWorth: 420.00, rep: 58 }
        ];

        const playerEntry = {
            name: this.franchiseName,
            owner: this.getShortAddress(),
            nft: this.nfts.length > 0 ? this.nfts[0].id : "None",
            cups: playerCups,
            netWorth: playerRevenue,
            rep: playerRep,
            isPlayer: true
        };

        const all = [...defaultRivals, playerEntry];
        // Sort by netWorth descending
        all.sort((a, b) => b.netWorth - a.netWorth);

        return all.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    }

    // -------------------------------------------------------------
    // ACTIVE NFT PERKS
    // -------------------------------------------------------------
    getNFTPerks() {
        let speedBonus = 0;
        let tipBonus = 0;
        let qualityBonus = 0;

        this.nfts.forEach(nft => {
            if (nft.rarity === 'Genesis' || nft.rarity === 'Legendary') {
                speedBonus += 15;
                tipBonus += 25;
                qualityBonus += 8;
            } else if (nft.rarity === 'Epic') {
                speedBonus += 10;
                tipBonus += 15;
                qualityBonus += 5;
            } else {
                speedBonus += 5;
                tipBonus += 10;
                qualityBonus += 3;
            }
        });

        // Add Barista Morale Boost if active
        if (this.baristaMoraleBoost > 0) {
            speedBonus += 25;
            tipBonus += 15;
        }

        return {
            speedBonus: Math.min(50, speedBonus),
            tipBonus: Math.min(60, tipBonus),
            qualityBonus: Math.min(25, qualityBonus)
        };
    }

    // Activate the /boost Hyper-Flow Campaign ($100.00 Cash, 3-day cooldown)
    activateBoost(currentDay, enforceCash = false) {
        const cashCost = 100.00;
        const cooldownDays = 3;

        if (this.isBoostActive) {
            return {
                success: false,
                message: '⚡ /boost Hyper-Flow Campaign is already active for today!'
            };
        }

        if (this.lastBoostDay >= 0 && (currentDay - this.lastBoostDay < cooldownDays)) {
            const daysRemaining = cooldownDays - (currentDay - this.lastBoostDay);
            return {
                success: false,
                message: `⏳ /boost Hyper-Flow Campaign is on cooldown! Ready in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''} (Day ${this.lastBoostDay + cooldownDays}).`
            };
        }

        const sim = window.simulationModel;
        if (sim) {
            if (sim.cash >= cashCost) {
                sim.cash -= cashCost;
                if (sim.dailyStats) {
                    sim.dailyStats.expenses = (sim.dailyStats.expenses || 0) + cashCost;
                    sim.dailyStats.costBoost = (sim.dailyStats.costBoost || 0) + cashCost;
                    sim.dailyStats.costMarketing = (sim.dailyStats.costMarketing || 0) + cashCost;
                }
                sim.saveState();
            } else if (enforceCash || this.lastBoostDay >= 0) {
                return {
                    success: false,
                    message: `Not enough Cash for /boost Hyper-Flow Campaign! Need $${cashCost.toFixed(2)} Cash (You have $${sim.cash.toFixed(2)}).`
                };
            }
        }

        this.isBoostActive = true;
        this.lastBoostDay = currentDay;
        this.saveState();

        if (window.soundManager) {
            window.soundManager.playBoost();
        }

        return {
            success: true,
            message: `🚀 /boost HYPER-FLOW ACTIVATED! +90% Traffic Surge, +35% Service Speed, +4 Queue Capacity & VIP Patrons for Day ${currentDay}!`
        };
    }

    resetDayBoost() {
        this.isBoostActive = false;
        this.baristaMoraleBoost = 0; // resets daily
        this.saveState();
    }

    // Generate and Mint a Franchise NFT Card
    mintFranchiseNFT(day, totalCups, totalProfit, locationName) {
        const serialNum = this.nfts.length + 1;
        const rarityTier = (serialNum === 1) ? 'Genesis' : 
                           (totalProfit > 1000 ? 'Legendary' : (totalProfit > 400 ? 'Epic' : 'Rare'));

        const nftData = {
            id: `COFFEDE-NFT-#${String(serialNum).padStart(4, '0')}`,
            name: `Coffede Franchise Certificate #${serialNum}`,
            rarity: rarityTier,
            dayMinted: day,
            cupsServed: totalCups,
            profitAtMint: totalProfit.toFixed(2),
            location: locationName,
            owner: this.address,
            mintDate: new Date().toLocaleDateString(),
            traits: {
                caffeineBoost: `+${Math.floor(10 + Math.random() * 20)}% Speed`,
                cryptoAura: `+${Math.floor(15 + Math.random() * 25)}% Tips`,
                roastMastery: `${85 + Math.floor(Math.random() * 15)}/100`
            }
        };

        this.nfts.push(nftData);
        this.addBean(50); // Reward 50 BEAN for minting milestone
        this.saveState();

        if (window.soundManager) {
            window.soundManager.playDayEnd();
        }

        return nftData;
    }

    // Render high-res Pixel Art NFT Certificate onto canvas
    drawNFTToCanvas(canvas, nft) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.imageSmoothingEnabled = false;

        // Card Background / Border gradient
        let bgGrad = ctx.createLinearGradient(0, 0, w, h);
        let borderGrad = ctx.createLinearGradient(0, 0, w, h);

        if (nft.rarity === 'Legendary' || nft.rarity === 'Genesis') {
            bgGrad.addColorStop(0, '#1c1500');
            bgGrad.addColorStop(1, '#382703');
            borderGrad.addColorStop(0, '#ffd700');
            borderGrad.addColorStop(0.5, '#fff2a1');
            borderGrad.addColorStop(1, '#b8860b');
        } else if (nft.rarity === 'Epic') {
            bgGrad.addColorStop(0, '#160824');
            bgGrad.addColorStop(1, '#2c0b4d');
            borderGrad.addColorStop(0, '#c084fc');
            borderGrad.addColorStop(1, '#7e22ce');
        } else {
            bgGrad.addColorStop(0, '#0a192f');
            bgGrad.addColorStop(1, '#172a45');
            borderGrad.addColorStop(0, '#00ffcc');
            borderGrad.addColorStop(1, '#0284c7');
        }

        // Draw card border
        ctx.fillStyle = borderGrad;
        ctx.roundRect(0, 0, w, h, 16);
        ctx.fill();

        // Inner Card Body
        ctx.fillStyle = bgGrad;
        ctx.roundRect(6, 6, w - 12, h - 12, 12);
        ctx.fill();

        // Top Header
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('COFFEDE FRANCHISE NFT', w / 2, 32);

        ctx.fillStyle = (nft.rarity === 'Legendary' || nft.rarity === 'Genesis') ? '#ffd700' : '#00ffcc';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`★ ${nft.rarity.toUpperCase()} PROOF OF ROAST ★`, w / 2, 48);

        // Stand Visual Artwork Box
        ctx.fillStyle = '#060a12';
        ctx.fillRect(24, 60, w - 48, 170);
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 2;
        ctx.strokeRect(24, 60, w - 48, 170);

        // Draw Pixel Coffee Cart in NFT Frame
        ctx.save();
        ctx.translate(w / 2 - 50, 140);
        // Miniature cart render
        ctx.fillStyle = '#6d4c41';
        ctx.fillRect(0, 0, 100, 48);
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(-4, -4, 108, 6);
        // Canopy
        for (let i = 0; i < 9; i++) {
            ctx.fillStyle = (i % 2 === 0) ? '#e74c3c' : '#f1c40f';
            ctx.fillRect(-6 + i * 12, -34, 12, 16);
        }
        // Machine
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(16, -18, 20, 18);
        // Steam
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(24, -28, 4, 8);
        ctx.fillRect(28, -32, 4, 8);
        // Wheels
        ctx.fillStyle = '#212121';
        ctx.beginPath();
        ctx.arc(18, 48, 12, 0, Math.PI * 2);
        ctx.arc(82, 48, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // NFT Serial & Details
        ctx.textAlign = 'left';
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(nft.name, 24, 256);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(`ID: ${nft.id}`, 24, 274);
        ctx.fillText(`Owner: ${nft.owner.substring(0, 10)}...${nft.owner.substring(34)}`, 24, 290);
        ctx.fillText(`Minted: Day ${nft.dayMinted} (${nft.mintDate})`, 24, 306);
        ctx.fillText(`HQ: ${nft.location}`, 24, 322);

        // Divider
        ctx.strokeStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(24, 335);
        ctx.lineTo(w - 24, 335);
        ctx.stroke();

        // Attributes Grid
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('ON-CHAIN PERKS & TRAITS:', 24, 354);

        ctx.fillStyle = '#f1f5f9';
        ctx.font = '10px monospace';
        ctx.fillText(`⚡ Speed: ${nft.traits.caffeineBoost}`, 24, 374);
        ctx.fillText(`💰 Tips: ${nft.traits.cryptoAura}`, 24, 392);
        ctx.fillText(`☕ Roast Skill: ${nft.traits.roastMastery}`, 24, 410);

        // Footer Hash & Badge
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(24, 430, w - 48, 40);
        ctx.fillStyle = '#64748b';
        ctx.font = '8px monospace';
        ctx.fillText('CRYPTOGRAPHIC HASH VERIFIED:', 32, 444);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`0x${Array.from(nft.id).map(c => c.charCodeAt(0).toString(16)).join('').slice(0, 36)}...`, 32, 458);
    }
}

window.web3Manager = new Web3Manager();
