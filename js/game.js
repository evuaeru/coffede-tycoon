// Coffede Tycoon - Main Game Controller & UI Data Binding
// Handles navigation, tabs, inputs, modals, state synchronization, DEX Swap, Leaderboard & day lifecycle.

class GameController {
    constructor() {
        this.activeTab = 'stand';
        this.selectedSpeed = 1;
        this.activeSuppliesIngredient = 'beans';
        this.suppliesCart = {};
        this.selectedLocationIndex = 0;
        this.selectedUpgradeIndex = 0;
        this.activeUpgradeCategory = 'all';
        this.selectedStaffIndex = 0;
    }

    init() {
        // Initialize Canvas
        const canvas = document.getElementById('gameCanvas');
        if (canvas && window.simulationEngine) {
            window.simulationEngine.init(canvas);
        }

        // Setup Day Tick and End callbacks
        if (window.simulationEngine) {
            window.simulationEngine.onDayTick = (timeStr, progress) => {
                this.updateHUDTime(timeStr, progress);
            };

            window.simulationEngine.onDayComplete = () => {
                this.handleDayEnd();
            };
        }

        this.bindEvents();
        this.updateHUD();
        this.renderActiveTab();
        this.updateRecipeCalculations();

        // Initialize Visual Map Editor
        if (window.mapEditor) {
            window.mapEditor.init();
        }

        if (typeof window !== 'undefined' && window.location && window.location.hash) {
            const h = window.location.hash.replace('#', '');
            if (['stand', 'supplies', 'recipe', 'marketing', 'locations', 'upgrades', 'staff', 'leaderboard', 'ledger', 'editor'].includes(h)) {
                this.switchTab(h);
            } else if (h.startsWith('loc=')) {
                this.switchTab('locations');
                const parts = h.replace('loc=', '').split('&');
                const locKey = parts[0];
                const sim = window.simulationModel;
                if (sim) {
                    const keys = Object.keys(sim.getLocations());
                    const idx = keys.indexOf(locKey);
                    if (idx !== -1) {
                        this.selectedLocationIndex = idx;
                        this.renderLocationsTab();
                    }
                }
                if (parts.includes('help=1') || parts.includes('help=true')) {
                    const drawer = document.getElementById('locHelpPopup');
                    if (drawer) drawer.style.display = 'block';
                }
            }
        }
    }

    // -------------------------------------------------------------
    // EVENT BINDINGS
    // -------------------------------------------------------------
    bindEvents() {
        // Navigation Tabs
        document.querySelectorAll('.nav-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Day Simulation Controls
        const btnStart = document.getElementById('btnStartDay');
        if (btnStart) {
            btnStart.addEventListener('click', () => this.startDaySimulation());
        }

        const btnPause = document.getElementById('btnPauseSim');
        if (btnPause) {
            btnPause.addEventListener('click', () => this.togglePause());
        }

        const btnSkip = document.getElementById('btnSkipDay');
        if (btnSkip) {
            btnSkip.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                if (window.simulationEngine) window.simulationEngine.skipToEndOfDay();
            });
        }

        const btnCanvasSkip = document.getElementById('btnCanvasSkip');
        if (btnCanvasSkip) {
            btnCanvasSkip.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playClick();
                if (window.simulationEngine) window.simulationEngine.skipToEndOfDay();
            });
        }

        const btnPrevUpg = document.getElementById('btnPrevUpgrade');
        const btnNextUpg = document.getElementById('btnNextUpgrade');
        const upgStrip = document.getElementById('standOwnedUpgrades');
        if (btnPrevUpg && upgStrip) {
            btnPrevUpg.addEventListener('click', () => {
                upgStrip.scrollBy({ left: -40, behavior: 'smooth' });
                if (window.soundManager) window.soundManager.playClick();
            });
        }
        if (btnNextUpg && upgStrip) {
            btnNextUpg.addEventListener('click', () => {
                upgStrip.scrollBy({ left: 40, behavior: 'smooth' });
                if (window.soundManager) window.soundManager.playClick();
            });
        }

        // Speed Buttons (1x, 2x, 5x)
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const spd = parseInt(e.currentTarget.getAttribute('data-speed'), 10);
                this.setSimSpeed(spd);
            });
        });

        // BGM Music Toggle
        const btnMusic = document.getElementById('btnMusicToggle');
        if (btnMusic) {
            if (window.soundManager) {
                const isMusicMuted = window.soundManager.isMusicMuted;
                btnMusic.textContent = isMusicMuted ? '🎵 Music: OFF' : '🎵 Music: ON';
                btnMusic.classList.toggle('muted', isMusicMuted);
            }
            btnMusic.addEventListener('click', () => {
                if (window.soundManager) {
                    const isMuted = window.soundManager.toggleMusic();
                    btnMusic.textContent = isMuted ? '🎵 Music: OFF' : '🎵 Music: ON';
                    btnMusic.classList.toggle('muted', isMuted);
                }
            });
        }

        // Audio Mute Toggle (SFX)
        const btnMute = document.getElementById('btnAudioToggle');
        if (btnMute) {
            if (window.soundManager) {
                const isMuted = window.soundManager.isMuted;
                btnMute.textContent = isMuted ? '🔇 Audio: OFF' : '🔊 Audio: ON';
                btnMute.classList.toggle('muted', isMuted);
            }
            btnMute.addEventListener('click', () => {
                if (window.soundManager) {
                    const isMuted = window.soundManager.toggleMute();
                    btnMute.textContent = isMuted ? '🔇 Audio: OFF' : '🔊 Audio: ON';
                    btnMute.classList.toggle('muted', isMuted);
                }
            });
        }

        // Emergency Relief Modal Buttons
        const btnEmergencyAid = document.getElementById('btnEmergencyAid');
        if (btnEmergencyAid) {
            btnEmergencyAid.addEventListener('click', () => this.openEmergencyModal());
        }

        const btnCloseEmergency = document.getElementById('btnCloseEmergency');
        if (btnCloseEmergency) {
            btnCloseEmergency.addEventListener('click', () => this.closeEmergencyModal());
        }

        const btnEmergencySwap = document.getElementById('btnEmergencySwapUSDC');
        if (btnEmergencySwap) {
            btnEmergencySwap.addEventListener('click', () => {
                const web3 = window.web3Manager;
                if (!web3 || web3.usdc <= 0) {
                    if (window.soundManager) window.soundManager.playSad();
                    alert('No USDC available in vault to swap!');
                    return;
                }
                const res = web3.swapUSDCToCash(web3.usdc);
                if (window.soundManager) window.soundManager.playCoin();
                alert(res.message);
                this.updateHUD();
                this.closeEmergencyModal();
            });
        }

        const btnEmergencyLoan = document.getElementById('btnEmergencyLoan');
        if (btnEmergencyLoan) {
            btnEmergencyLoan.addEventListener('click', () => {
                const res = window.simulationModel.takeEmergencyLoan();
                if (window.soundManager) window.soundManager.playCoin();
                alert(res.message);
                this.updateHUD();
                this.closeEmergencyModal();
            });
        }

        const btnEmergencyGrant = document.getElementById('btnEmergencyGrant');
        if (btnEmergencyGrant) {
            btnEmergencyGrant.addEventListener('click', () => {
                const res = window.simulationModel.claimBailoutGrant();
                if (window.soundManager) window.soundManager.playHappy();
                alert(res.message);
                this.updateHUD();
                this.closeEmergencyModal();
            });
        }

        // Insufficient Supplies Warning OK Button
        const btnWarningOK = document.getElementById('btnSuppliesWarningOK');
        if (btnWarningOK) {
            btnWarningOK.addEventListener('click', () => this.closeSuppliesWarningModal());
        }

        // Recipe Sliders
        const recipeInputs = ['beans', 'milk', 'sugar', 'ice', 'syrup', 'price'];
        recipeInputs.forEach(key => {
            const el = document.getElementById(`recipe_${key}`);
            if (el) {
                el.addEventListener('input', (e) => {
                    const val = (key === 'price') ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
                    window.simulationModel.recipe[key] = val;
                    const valDisplay = document.getElementById(`val_${key}`);
                    if (valDisplay) {
                        valDisplay.textContent = (key === 'price') ? `${val.toFixed(2)}` : val;
                    }
                    if (key === 'price') {
                        const mPrice = document.getElementById('marketing_price');
                        const mVal = document.getElementById('val_marketing_price');
                        if (mPrice) mPrice.value = val;
                        if (mVal) mVal.textContent = `${val.toFixed(2)}`;
                    }
                    this.updateRecipeCalculations();
                    window.simulationModel.saveState();
                });
            }
        });

        // Crypto Toggle in Recipe (legacy safe check)
        const cryptoToggle = document.getElementById('recipe_crypto');
        if (cryptoToggle) {
            cryptoToggle.addEventListener('change', (e) => {
                window.simulationModel.recipe.acceptCrypto = e.target.checked;
                window.simulationModel.saveState();
            });
        }

        // Supplies Ingredient Sub-Tabs
        document.querySelectorAll('.supplies-subtab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ing = e.currentTarget.getAttribute('data-ingredient');
                if (ing) {
                    this.activeSuppliesIngredient = ing;
                    this.renderSuppliesTab();
                    if (window.soundManager) window.soundManager.playClick();
                }
            });
        });

        // Supplies Cart Actions (Reset & 1-Click Buy)
        const btnResetCart = document.getElementById('btnResetSuppliesCart');
        if (btnResetCart) {
            btnResetCart.addEventListener('click', () => {
                this.suppliesCart = {};
                this.renderSuppliesTab();
                if (window.soundManager) window.soundManager.playClick();
            });
        }

        const btnBuyCart = document.getElementById('btnBuySuppliesCart');
        if (btnBuyCart) {
            btnBuyCart.addEventListener('click', () => {
                const sim = window.simulationModel;
                const res = sim.buySuppliesBatch(this.suppliesCart);
                if (res.success) {
                    this.suppliesCart = {};
                    this.renderSuppliesTab();
                    this.updateHUD();
                } else {
                    if (window.soundManager) window.soundManager.playSad();
                    alert(res.message);
                }
            });
        }

        // Marketing Price Slider & Steppers
        const marketingPrice = document.getElementById('marketing_price');
        if (marketingPrice) {
            marketingPrice.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                window.simulationModel.recipe.price = val;
                window.simulationModel.saveState();
                const recipePrice = document.getElementById('recipe_price');
                const valPrice = document.getElementById('val_price');
                if (recipePrice) recipePrice.value = val;
                if (valPrice) valPrice.textContent = `${val.toFixed(2)}`;
                this.renderMarketingTab();
                this.updateRecipeCalculations();
            });
        }

        const btnMarketingPriceMinus = document.getElementById('btnMarketingPriceMinus');
        if (btnMarketingPriceMinus) {
            btnMarketingPriceMinus.addEventListener('click', () => {
                const el = document.getElementById('marketing_price');
                if (el) {
                    el.value = Math.max(1.00, parseFloat(el.value) - 0.25).toFixed(2);
                    el.dispatchEvent(new Event('input'));
                }
            });
        }

        const btnMarketingPricePlus = document.getElementById('btnMarketingPricePlus');
        if (btnMarketingPricePlus) {
            btnMarketingPricePlus.addEventListener('click', () => {
                const el = document.getElementById('marketing_price');
                if (el) {
                    el.value = Math.min(12.00, parseFloat(el.value) + 0.25).toFixed(2);
                    el.dispatchEvent(new Event('input'));
                }
            });
        }

        // Marketing Budget Slider & Steppers
        const marketingBudget = document.getElementById('marketing_budget');
        if (marketingBudget) {
            marketingBudget.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                window.simulationModel.dailyMarketingBudget = val;
                window.simulationModel.saveState();
                this.renderMarketingTab();
            });
        }

        const btnMarketingBudgetMinus = document.getElementById('btnMarketingBudgetMinus');
        if (btnMarketingBudgetMinus) {
            btnMarketingBudgetMinus.addEventListener('click', () => {
                const el = document.getElementById('marketing_budget');
                if (el) {
                    el.value = Math.max(0, parseInt(el.value, 10) - 5);
                    el.dispatchEvent(new Event('input'));
                }
            });
        }

        const btnMarketingBudgetPlus = document.getElementById('btnMarketingBudgetPlus');
        if (btnMarketingBudgetPlus) {
            btnMarketingBudgetPlus.addEventListener('click', () => {
                const el = document.getElementById('marketing_budget');
                if (el) {
                    el.value = Math.min(50, parseInt(el.value, 10) + 5);
                    el.dispatchEvent(new Event('input'));
                }
            });
        }

        // Viral /boost Button
        const btnBoost = document.getElementById('btnActivateBoost');
        if (btnBoost) {
            btnBoost.addEventListener('click', () => this.handleBoostClick());
        }

        // Web3 Connect Wallet Button
        const btnConnect = document.getElementById('btnConnectWallet');
        if (btnConnect) {
            btnConnect.addEventListener('click', () => this.handleConnectWallet());
        }

        // Web3 DEX Swap Buttons
        const btnSwapUSDCToCash = document.getElementById('btnSwapUSDCToCash');
        if (btnSwapUSDCToCash) {
            btnSwapUSDCToCash.addEventListener('click', () => {
                const web3 = window.web3Manager;
                const amt = Math.min(10, web3.usdc);
                if (amt <= 0) {
                    if (window.soundManager) window.soundManager.playSad();
                    alert('You have 0 USDC in your vault!');
                    return;
                }
                const res = web3.swapUSDCToCash(amt);
                if (window.soundManager) window.soundManager.playCoin();
                alert(res.message);
                this.renderWeb3Tab();
                this.updateHUD();
            });
        }

        const btnSwapCashToUSDC = document.getElementById('btnSwapCashToUSDC');
        if (btnSwapCashToUSDC) {
            btnSwapCashToUSDC.addEventListener('click', () => {
                const sim = window.simulationModel;
                const amt = Math.min(10, Math.max(0, sim.cash - 5));
                if (amt <= 0) {
                    if (window.soundManager) window.soundManager.playSad();
                    alert('Need at least $10 Cash above reserve to convert to USDC!');
                    return;
                }
                const res = window.web3Manager.swapCashToUSDC(amt);
                if (window.soundManager) window.soundManager.playCoin();
                alert(res.message);
                this.renderWeb3Tab();
                this.updateHUD();
            });
        }

        const btnSwapBean = document.getElementById('btnSwapBeanToCash');
        if (btnSwapBean) {
            btnSwapBean.addEventListener('click', () => {
                const web3 = window.web3Manager;
                const amt = Math.min(20, web3.bean);
                if (amt < 10) {
                    if (window.soundManager) window.soundManager.playSad();
                    alert('Need at least 10 $BEAN to redeem for Cash!');
                    return;
                }
                const res = web3.swapBeanToCash(amt);
                if (window.soundManager) window.soundManager.playCoin();
                alert(res.message);
                this.renderWeb3Tab();
                this.updateHUD();
            });
        }

        // Web3 Tip Jar Buttons
        const btnCollectTipJar = document.getElementById('btnCollectTipJar');
        if (btnCollectTipJar) {
            btnCollectTipJar.addEventListener('click', () => {
                const res = window.web3Manager.collectTipJar();
                if (window.soundManager) window.soundManager.playCoin();
                alert(res.message);
                this.renderWeb3Tab();
                this.updateHUD();
            });
        }

        const btnTipBarista = document.getElementById('btnTipBarista');
        if (btnTipBarista) {
            btnTipBarista.addEventListener('click', () => {
                const res = window.web3Manager.tipBarista(2.0);
                if (res.success && window.soundManager) {
                    window.soundManager.playHappy();
                } else if (window.soundManager) {
                    window.soundManager.playSad();
                }
                alert(res.message);
                this.renderWeb3Tab();
                this.updateHUD();
            });
        }

        // Franchise Name Button
        const btnSaveName = document.getElementById('btnSaveFranchiseName');
        const inputName = document.getElementById('inputFranchiseName');
        if (btnSaveName && inputName) {
            btnSaveName.addEventListener('click', () => {
                window.web3Manager.setFranchiseName(inputName.value);
                if (window.soundManager) window.soundManager.playClick();
                alert(`Franchise rebranded as: "${window.web3Manager.franchiseName}"!`);
                this.renderLeaderboardTab();
            });
        }

        // Refresh Leaderboard Button
        const btnRefreshLeaderboard = document.getElementById('btnRefreshLeaderboard');
        if (btnRefreshLeaderboard) {
            btnRefreshLeaderboard.addEventListener('click', () => {
                this.renderLeaderboardTab();
                if (window.soundManager) window.soundManager.playClick();
            });
        }

        // Mint NFT Button
        const btnMintNFT = document.getElementById('btnMintNFT');
        if (btnMintNFT) {
            btnMintNFT.addEventListener('click', () => this.handleMintNFT());
        }

        // End of Day Modal Close / Next Day Button
        const btnNextDay = document.getElementById('btnNextDay');
        if (btnNextDay) {
            btnNextDay.addEventListener('click', () => {
                const modal = document.getElementById('endDayModal');
                if (modal) modal.classList.remove('active');
                this.switchTab('stand');
                this.updateHUD();
                if (window.soundManager) window.soundManager.playClick();

                // Check for bankruptcy softlock
                if (window.simulationModel.isBankrupt()) {
                    setTimeout(() => this.openEmergencyModal(), 300);
                }
            });
        }

        // Reset Game Button
        const btnReset = document.getElementById('btnResetGame');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                if (confirm('Are you sure you want to start a brand new game? All progress will be reset.')) {
                    window.simulationModel.resetGame();
                    location.reload();
                }
            });
        }

        // Stepper Buttons (+ / -) for Recipe tuning
        document.querySelectorAll('.stepper-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('data-target');
                const step = parseFloat(e.currentTarget.getAttribute('data-step')) || 1;
                const input = document.getElementById(targetId);
                if (input) {
                    const min = parseFloat(input.min) || 0;
                    const max = parseFloat(input.max) || 100;
                    const currentVal = parseFloat(input.value) || 0;
                    const nextVal = Math.min(max, Math.max(min, Math.round((currentVal + step) * 100) / 100));
                    input.value = nextVal;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    if (window.soundManager) window.soundManager.playClick();
                }
            });
        });

        // Tactile sound juice on hover (debounced event delegation)
        let lastHoverSound = 0;
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('.pixel-btn, .nav-tab, .speed-btn, .btn-audio, .stepper-btn, .loc-nav-btn, .loc-tier-pill, .upg-cat-pill, .upg-nav-btn');
            if (target && !target.disabled) {
                const now = Date.now();
                if (now - lastHoverSound > 70) {
                    lastHoverSound = now;
                    if (window.soundManager && typeof window.soundManager.playHover === 'function') {
                        window.soundManager.playHover();
                    }
                }
            }
        });

        // Lemonade Tycoon Locations Carousel Navigation
        const btnLocPrev = document.getElementById('btnLocPrev');
        if (btnLocPrev) {
            btnLocPrev.addEventListener('click', () => {
                this.navigateLocation(-1);
            });
        }

        const btnLocNext = document.getElementById('btnLocNext');
        if (btnLocNext) {
            btnLocNext.addEventListener('click', () => {
                this.navigateLocation(1);
            });
        }

        const btnLocRent = document.getElementById('locBtnRent');
        if (btnLocRent) {
            btnLocRent.addEventListener('click', () => {
                this.handleLocationRent();
            });
        }

        const btnLocHelp = document.getElementById('locBtnHelp');
        if (btnLocHelp) {
            btnLocHelp.addEventListener('click', () => {
                const drawer = document.getElementById('locHelpPopup');
                if (drawer) {
                    const isVisible = drawer.style.display !== 'none';
                    drawer.style.display = isVisible ? 'none' : 'block';
                    if (window.soundManager) window.soundManager.playClick();
                }
            });
        }

        const btnLocHelpClose = document.getElementById('locBtnHelpClose');
        if (btnLocHelpClose) {
            btnLocHelpClose.addEventListener('click', () => {
                const drawer = document.getElementById('locHelpPopup');
                if (drawer) drawer.style.display = 'none';
                if (window.soundManager) window.soundManager.playClick();
            });
        }

        // Tier Quick Jump Pills
        document.querySelectorAll('.loc-tier-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                const tierVal = e.currentTarget.getAttribute('data-tier');
                this.jumpToLocationTier(tierVal);
            });
        });

        // Lemonade Tycoon Upgrades Carousel Navigation
        const btnUpgPrev = document.getElementById('btnUpgPrev');
        if (btnUpgPrev) {
            btnUpgPrev.addEventListener('click', () => {
                this.navigateUpgrade(-1);
            });
        }

        const btnUpgNext = document.getElementById('btnUpgNext');
        if (btnUpgNext) {
            btnUpgNext.addEventListener('click', () => {
                this.navigateUpgrade(1);
            });
        }

        const btnUpgBuy = document.getElementById('upgBtnBuy');
        if (btnUpgBuy) {
            btnUpgBuy.addEventListener('click', () => {
                this.handleUpgradeBuy();
            });
        }

        const btnUpgHelp = document.getElementById('upgBtnHelp');
        if (btnUpgHelp) {
            btnUpgHelp.addEventListener('click', () => {
                const drawer = document.getElementById('upgHelpPopup');
                if (drawer) {
                    const isVisible = drawer.style.display !== 'none';
                    drawer.style.display = isVisible ? 'none' : 'block';
                    if (window.soundManager) window.soundManager.playClick();
                }
            });
        }

        const btnUpgHelpClose = document.getElementById('upgBtnHelpClose');
        if (btnUpgHelpClose) {
            btnUpgHelpClose.addEventListener('click', () => {
                const drawer = document.getElementById('upgHelpPopup');
                if (drawer) drawer.style.display = 'none';
                if (window.soundManager) window.soundManager.playClick();
            });
        }

        // Category Quick-Jump Filter Pills (Upgrades Tab only)
        document.querySelectorAll('#upgCategoryPills .upg-cat-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                const catVal = e.currentTarget.getAttribute('data-cat');
                this.jumpToUpgradeCategory(catVal);
            });
        });

        // Lemonade Tycoon Staff Hiring Carousel Navigation
        const btnStaffPrev = document.getElementById('btnStaffPrev');
        if (btnStaffPrev) {
            btnStaffPrev.addEventListener('click', () => {
                this.navigateStaff(-1);
            });
        }

        const btnStaffNext = document.getElementById('btnStaffNext');
        if (btnStaffNext) {
            btnStaffNext.addEventListener('click', () => {
                this.navigateStaff(1);
            });
        }

        const btnStaffHire = document.getElementById('staffBtnHire');
        if (btnStaffHire) {
            btnStaffHire.addEventListener('click', () => {
                this.handleStaffHireToggle();
            });
        }

        const btnStaffHelp = document.getElementById('staffBtnHelp');
        if (btnStaffHelp) {
            btnStaffHelp.addEventListener('click', () => {
                const drawer = document.getElementById('staffHelpPopup');
                if (drawer) {
                    const isVisible = drawer.style.display !== 'none';
                    drawer.style.display = isVisible ? 'none' : 'block';
                    if (window.soundManager) window.soundManager.playClick();
                }
            });
        }

        const btnStaffHelpClose = document.getElementById('staffBtnHelpClose');
        if (btnStaffHelpClose) {
            btnStaffHelpClose.addEventListener('click', () => {
                const drawer = document.getElementById('staffHelpPopup');
                if (drawer) drawer.style.display = 'none';
                if (window.soundManager) window.soundManager.playClick();
            });
        }

        document.querySelectorAll('.staff-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-staff-idx'), 10);
                this.selectStaffIndex(idx);
            });
        });

        // Keyboard Arrow Navigation for Locations, Upgrades & Staff Carousel
        document.addEventListener('keydown', (e) => {
            if (this.activeTab === 'locations') {
                if (e.key === 'ArrowLeft') {
                    this.navigateLocation(-1);
                } else if (e.key === 'ArrowRight') {
                    this.navigateLocation(1);
                }
            } else if (this.activeTab === 'upgrades') {
                if (e.key === 'ArrowLeft') {
                    this.navigateUpgrade(-1);
                } else if (e.key === 'ArrowRight') {
                    this.navigateUpgrade(1);
                }
            } else if (this.activeTab === 'staff') {
                if (e.key === 'ArrowLeft') {
                    this.navigateStaff(-1);
                } else if (e.key === 'ArrowRight') {
                    this.navigateStaff(1);
                }
            }
        });
    }

    // -------------------------------------------------------------
    // HUD & DATA SYNC
    // -------------------------------------------------------------
    updateHUD() {
        const sim = window.simulationModel;
        const web3 = window.web3Manager;

        // Cash & Tokens
        const elCash = document.getElementById('hudCash');
        if (elCash) {
            elCash.textContent = `$${sim.cash.toFixed(2)}`;
            elCash.style.color = (sim.cash < 0) ? '#e74c3c' : '#2ecc71';
        }

        const elUSDC = document.getElementById('hudUSDC');
        if (elUSDC && web3) elUSDC.textContent = `${web3.usdc.toFixed(2)} USDC`;

        const elBean = document.getElementById('hudBean');
        if (elBean && web3) elBean.textContent = `${web3.bean.toFixed(0)} $BEAN`;

        // Day & Location
        const elDay = document.getElementById('hudDayNum');
        if (elDay) elDay.textContent = `Day ${sim.dayNumber}`;

        const loc = sim.getLocations()[sim.currentLocation];
        const elLoc = document.getElementById('hudLocation');
        if (elLoc) elLoc.textContent = loc.name;

        // Weather
        const elWeatherIcon = document.getElementById('hudWeatherIcon');
        if (elWeatherIcon) elWeatherIcon.textContent = sim.weather.icon;

        const elWeatherText = document.getElementById('hudWeatherText');
        if (elWeatherText) elWeatherText.textContent = `${sim.weather.temp}°C - ${sim.weather.desc}`;

        // Reputation
        const elRep = document.getElementById('hudReputation');
        if (elRep) elRep.textContent = `${sim.reputation}%`;

        // Controls visibility
        const controlsPanel = document.getElementById('simLiveControls');
        const startDayBtn = document.getElementById('btnStartDay');
        if (window.simulationEngine && window.simulationEngine.isRunning) {
            if (controlsPanel) controlsPanel.style.display = 'flex';
            if (startDayBtn) startDayBtn.style.display = 'none';
        } else {
            if (controlsPanel) controlsPanel.style.display = 'none';
            if (startDayBtn) startDayBtn.style.display = 'inline-block';
            const elClock = document.getElementById('hudClock');
            if (elClock) elClock.textContent = '08:00 AM';
            const elProgress = document.getElementById('dayProgressBar');
            if (elProgress) elProgress.style.width = '0%';
            const elLiveSales = document.getElementById('hudLiveSales');
            if (elLiveSales && sim && sim.dailyStats) {
                const todayGross = sim.dailyStats.revenueCash + sim.dailyStats.tipsCash + sim.dailyStats.revenueCrypto + sim.dailyStats.tipsCrypto;
                elLiveSales.textContent = `${sim.dailyStats.cupsSold} cups ($${todayGross.toFixed(2)})`;
            }
        }

        // Update Lemonade Tycoon Stand Panels
        this.updateStandPanels();
    }

    updateStandPanels() {
        const sim = window.simulationModel;
        if (!sim) return;

        // 1. Performance Panel
        const elPerfCups = document.getElementById('perfCupsSold');
        if (elPerfCups) elPerfCups.textContent = sim.dailyStats.cupsSold;

        const elPerfProfit = document.getElementById('perfProfit');
        if (elPerfProfit) {
            const gross = sim.dailyStats.revenueCash + sim.dailyStats.tipsCash + sim.dailyStats.revenueCrypto + sim.dailyStats.tipsCrypto;
            const expenses = sim.dailyStats.costIngredients + (sim.dailyStats.costMarketing || 0) + (sim.dailyStats.costRent || 0) + (sim.dailyStats.costStaff || 0);
            const profit = gross - expenses;
            elPerfProfit.textContent = `$ ${profit.toFixed(2)}`;
            elPerfProfit.style.color = (profit >= 0) ? '#ffffff' : '#ff6b6b';
        }

        const elAngry = document.getElementById('perfReactionAngry');
        if (elAngry) elAngry.textContent = sim.dailyStats.angryCount || 0;

        const elHappy = document.getElementById('perfReactionHappy');
        if (elHappy) elHappy.textContent = sim.dailyStats.happyCount || sim.dailyStats.cupsSold || 0;

        const elImpatient = document.getElementById('perfReactionImpatient');
        if (elImpatient) elImpatient.textContent = sim.dailyStats.impatientCount || sim.dailyStats.lostPatience || 0;

        const elOverpriced = document.getElementById('perfReactionOverpriced');
        if (elOverpriced) elOverpriced.textContent = sim.dailyStats.overpricedCount || sim.dailyStats.lostPrice || 0;

        // 2. Today's Setting Panel (Redesigned Clean Layout)
        const loc = sim.getLocations()[sim.currentLocation];
        const elRent = document.getElementById('standSettingRent');
        if (elRent) {
            elRent.textContent = loc
                ? `${loc.name} (${loc.rent > 0 ? `$${loc.rent.toFixed(0)}/d` : 'FREE'})`
                : 'Quiet Cul-de-Sac (FREE)';
        }

        const elAds = document.getElementById('standSettingAds');
        if (elAds) elAds.textContent = `$${sim.dailyMarketingBudget.toFixed(2)}`;

        const elPrice = document.getElementById('standSettingPrice');
        if (elPrice) elPrice.textContent = `$${sim.recipe.price.toFixed(2)}`;

        const elStaff = document.getElementById('standSettingStaff');
        if (elStaff) {
            const hiredCount = Object.values(sim.hiredStaff || {}).filter(Boolean).length;
            const dailyWages = typeof sim.getDailyStaffCost === 'function' ? sim.getDailyStaffCost() : 0;
            elStaff.textContent = `${hiredCount} Hired ($${dailyWages.toFixed(0)}/d)`;
        }

        const elPayment = document.getElementById('standSettingPayment');
        if (elPayment) {
            const termLvl = sim.upgrades.terminal || 1;
            elPayment.textContent = termLvl >= 3 ? 'NFC Tap + QRIS' : (termLvl === 2 ? 'QRIS + Card' : 'Cash Only');
        }

        const elSpeed = document.getElementById('standSettingSpeed');
        if (elSpeed) {
            const spdMult = typeof sim.getTotalServiceSpeedMultiplier === 'function' ? sim.getTotalServiceSpeedMultiplier() : 1.0;
            elSpeed.textContent = `${spdMult.toFixed(2)}x Speed`;
        }

        const elRecBadge = document.getElementById('standRecipeQualityBadge');
        if (elRecBadge) {
            const evalRes = sim.evaluateRecipe(sim.weather ? sim.weather.temp : 22);
            elRecBadge.textContent = `${evalRes.stars} ★ (${evalRes.overallQuality}%)`;
        }

        const elBeans = document.getElementById('standRecBeans');
        if (elBeans) elBeans.textContent = sim.recipe.beans;

        const elMilk = document.getElementById('standRecMilk');
        if (elMilk) elMilk.textContent = sim.recipe.milk;

        const elSugar = document.getElementById('standRecSugar');
        if (elSugar) elSugar.textContent = sim.recipe.sugar;

        const elIce = document.getElementById('standRecIce');
        if (elIce) elIce.textContent = sim.recipe.ice;

        const elSyrup = document.getElementById('standRecSyrup');
        if (elSyrup) elSyrup.textContent = sim.recipe.syrup;

        // Owned Upgrades mini badges (safe for decor level 0..5)
        const elOwned = document.getElementById('standOwnedUpgrades');
        if (elOwned) {
            const getUpgName = (cat, fallback) => {
                if (typeof sim.getUpgradeItem === 'function') {
                    const item = sim.getUpgradeItem(cat);
                    if (item && item.name) return item.name;
                }
                const upgs = sim.getUpgrades();
                const list = upgs[cat] || [];
                const lvl = sim.upgrades[cat] !== undefined ? sim.upgrades[cat] : (cat === 'decor' ? 0 : 1);
                const found = list.find(u => u.level === lvl) || list[0];
                return found ? found.name : fallback;
            };
            const badges = [
                { icon: '🎨', name: getUpgName('decor', 'Cart') },
                { icon: '☕', name: getUpgName('machine', 'Brewer') },
                { icon: '⚙️', name: getUpgName('grinder', 'Grinder') },
                { icon: '💳', name: getUpgName('terminal', 'Register') },
                { icon: '🧊', name: getUpgName('cooler', 'Cooler') },
                { icon: '⛺', name: getUpgName('canopy', 'Canopy') },
                { icon: '📢', name: getUpgName('marketing', 'Signage') }
            ];
            elOwned.innerHTML = badges.map(b => `<span class="upgrade-mini-badge stand-upg-badge" title="${b.name}">${b.icon} ${b.name}</span>`).join('');
        }

        // 3. Location Info Panel & Popularity / Satisfaction Meters
        const elLocName = document.getElementById('standLocationName');
        if (elLocName && loc) elLocName.textContent = loc.name;

        const elLocDesc = document.getElementById('standLocationDesc');
        if (elLocDesc && loc) elLocDesc.textContent = loc.description;

        const pop = sim.getLocationPopularity(sim.currentLocation);
        const sat = sim.getLocationSatisfaction(sim.currentLocation);

        const elMeterPop = document.getElementById('meterPopularity');
        if (elMeterPop) elMeterPop.style.width = `${Math.min(100, Math.max(0, pop))}%`;
        const elValPop = document.getElementById('valPopularity');
        if (elValPop) elValPop.textContent = `${pop}%`;

        const elMeterSat = document.getElementById('meterSatisfaction');
        if (elMeterSat) elMeterSat.style.width = `${Math.min(100, Math.max(0, sat))}%`;
        const elValSat = document.getElementById('valSatisfaction');
        if (elValSat) elValSat.textContent = `${sat}%`;

        // Canvas Skip button visibility
        const elCanvasSkip = document.getElementById('btnCanvasSkip');
        if (elCanvasSkip) {
            elCanvasSkip.style.display = (window.simulationEngine && window.simulationEngine.isRunning) ? 'block' : 'none';
        }

        // 4. Real-Time Supplies & Cups Monitor Bar (Global Top Header Ribbon)
        const inv = sim.inventory || {};
        const elMonBeans = document.getElementById('hudMonBeans');
        if (elMonBeans) {
            const val = inv.beans !== undefined ? inv.beans : 0;
            elMonBeans.textContent = val;
            elMonBeans.classList.toggle('mon-depleted', val <= 0);
            elMonBeans.classList.toggle('mon-warning', val > 0 && val <= 5);
        }
        const elMonMilk = document.getElementById('hudMonMilk');
        if (elMonMilk) {
            const val = inv.milk !== undefined ? inv.milk : 0;
            elMonMilk.textContent = val;
            elMonMilk.classList.toggle('mon-depleted', val <= 0);
            elMonMilk.classList.toggle('mon-warning', val > 0 && val <= 5);
        }
        const elMonSugar = document.getElementById('hudMonSugar');
        if (elMonSugar) {
            const val = inv.sugar !== undefined ? inv.sugar : 0;
            elMonSugar.textContent = val;
            elMonSugar.classList.toggle('mon-depleted', val <= 0);
            elMonSugar.classList.toggle('mon-warning', val > 0 && val <= 10);
        }
        const elMonIce = document.getElementById('hudMonIce');
        if (elMonIce) {
            const val = inv.ice !== undefined ? inv.ice : 0;
            elMonIce.textContent = val;
            elMonIce.classList.toggle('mon-depleted', val <= 0);
            elMonIce.classList.toggle('mon-warning', val > 0 && val <= 10);
        }
        const elMonSyrup = document.getElementById('hudMonSyrup');
        if (elMonSyrup) {
            const val = inv.syrup !== undefined ? inv.syrup : 0;
            elMonSyrup.textContent = val;
            elMonSyrup.classList.toggle('mon-depleted', val <= 0);
            elMonSyrup.classList.toggle('mon-warning', val > 0 && val <= 5);
        }
        const elMonCups = document.getElementById('hudMonCups');
        if (elMonCups) {
            const val = inv.cups !== undefined ? inv.cups : 0;
            elMonCups.textContent = val;
            elMonCups.classList.toggle('mon-depleted', val <= 0);
            elMonCups.classList.toggle('mon-warning', val > 0 && val <= 10);
        }
        const elMonCarafe = document.getElementById('hudMonCarafe');
        if (elMonCarafe) {
            const val = sim.cupsInBatch !== undefined ? sim.cupsInBatch : 0;
            elMonCarafe.textContent = val;
            elMonCarafe.classList.toggle('mon-depleted', val <= 0);
            elMonCarafe.classList.toggle('mon-active-brew', val > 0);
        }
    }

    updateHUDTime(timeStr, progress) {
        const elClock = document.getElementById('hudClock');
        if (elClock) elClock.textContent = timeStr;

        const elProgress = document.getElementById('dayProgressBar');
        if (elProgress) elProgress.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;

        // Live day sales
        const sim = window.simulationModel;
        const elLiveSales = document.getElementById('hudLiveSales');
        if (elLiveSales) {
            const todayGross = sim.dailyStats.revenueCash + sim.dailyStats.tipsCash + sim.dailyStats.revenueCrypto + sim.dailyStats.tipsCrypto;
            elLiveSales.textContent = `${sim.dailyStats.cupsSold} cups ($${todayGross.toFixed(2)})`;
        }

        // Live Cash
        const elCash = document.getElementById('hudCash');
        if (elCash) {
            elCash.textContent = `$${sim.cash.toFixed(2)}`;
            elCash.style.color = (sim.cash < 0) ? '#e74c3c' : '#2ecc71';
        }

        const elUSDC = document.getElementById('hudUSDC');
        if (elUSDC && window.web3Manager) elUSDC.textContent = `${window.web3Manager.usdc.toFixed(2)} USDC`;

        // Real-time Stand panels update during daytime
        this.updateStandPanels();
    }

    // -------------------------------------------------------------
    // TAB MANAGEMENT
    // -------------------------------------------------------------
    switchTab(tabId) {
        this.activeTab = tabId;

        document.querySelectorAll('.nav-tab').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
        });

        document.querySelectorAll('.game-tab-content').forEach(view => {
            view.classList.toggle('active', view.id === `tab_${tabId}`);
        });

        if (tabId === 'locations') {
            const sim = window.simulationModel;
            if (sim) {
                const keys = Object.keys(sim.getLocations());
                const currIdx = keys.indexOf(sim.currentLocation);
                if (currIdx !== -1) {
                    this.selectedLocationIndex = currIdx;
                }
            }
        }

        this.renderActiveTab();
        if (this.activeTab === 'editor') {
            if (window.mapEditor) {
                window.mapEditor.onTabActivated();
            }
        } else {
            if (window.mapEditor) {
                window.mapEditor.onTabDeactivated();
            }
        }
        if (window.soundManager) window.soundManager.playClick();
    }

    renderActiveTab() {
        this.updateHUD();

        if (this.activeTab === 'supplies') {
            this.renderSuppliesTab();
        } else if (this.activeTab === 'recipe') {
            this.renderRecipeTab();
        } else if (this.activeTab === 'marketing') {
            this.renderMarketingTab();
        } else if (this.activeTab === 'locations') {
            this.renderLocationsTab();
        } else if (this.activeTab === 'upgrades') {
            this.renderUpgradesTab();
        } else if (this.activeTab === 'staff') {
            this.renderStaffTab();
        } else if (this.activeTab === 'web3') {
            this.renderMarketingTab();
        } else if (this.activeTab === 'leaderboard') {
            this.renderLeaderboardTab();
        } else if (this.activeTab === 'ledger') {
            this.renderLedgerTab();
        } else if (this.activeTab === 'editor') {
            if (window.mapEditor) {
                window.mapEditor.onTabActivated();
            }
        }
    }

    // -------------------------------------------------------------
    // SIMULATION LIFECYCLE
    // -------------------------------------------------------------
    startDaySimulation() {
        if (window.simulationEngine && !window.simulationEngine.isRunning) {
            const sim = window.simulationModel;
            const inv = sim.inventory;
            const r = sim.recipe;
            const missing = [];

            // Beans needed for carafe batch
            const beansNeeded = r.beans || 1;
            if (sim.cupsInBatch <= 0 && inv.beans < beansNeeded) {
                missing.push(`Coffee Beans (${inv.beans}/${beansNeeded})`);
            } else if (inv.beans < 1 && sim.cupsInBatch <= 0) {
                missing.push(`Coffee Beans (out of stock)`);
            }

            // Cups: At least 1 cup needed to serve a customer
            if (inv.cups < 1) {
                missing.push(`Cups (out of stock)`);
            }

            // Recipe-specific ingredients:
            if (r.milk > 0 && inv.milk < r.milk) {
                missing.push(`Milk (${inv.milk}/${r.milk})`);
            }
            if (r.sugar > 0 && inv.sugar < r.sugar) {
                missing.push(`Sugar (${inv.sugar}/${r.sugar})`);
            }
            if (r.ice > 0 && inv.ice < r.ice) {
                missing.push(`Ice (${inv.ice}/${r.ice})`);
            }
            if (r.syrup > 0 && inv.syrup < r.syrup) {
                missing.push(`Syrup (${inv.syrup}/${r.syrup})`);
            }

            if (missing.length > 0) {
                this.showSuppliesWarningModal(missing);
                return;
            }

            // Enforce upfront location rental payment before opening stand for the day
            if (typeof sim.ensureDailyLocationRentPaid === 'function') {
                const rentRes = sim.ensureDailyLocationRentPaid();
                if (!rentRes.success) {
                    if (window.soundManager) window.soundManager.playSad();
                    alert(rentRes.message);
                    this.switchTab('locations');
                    return;
                }
            }

            if (window.soundManager) {
                window.soundManager.playDayStart();
                if (!window.soundManager.isMusicMuted) {
                    window.soundManager.startBGM();
                }
            }
            window.simulationEngine.startDay();
            this.switchTab('stand');
            this.updateHUD();
        }
    }

    togglePause() {
        if (!window.simulationEngine || !window.simulationEngine.isRunning) return;
        const isPaused = !window.simulationEngine.isPaused;
        window.simulationEngine.setPaused(isPaused);

        const btn = document.getElementById('btnPauseSim');
        if (btn) btn.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
        if (window.soundManager) window.soundManager.playClick();
    }

    setSimSpeed(multiplier) {
        this.selectedSpeed = multiplier;
        if (window.simulationEngine) {
            window.simulationEngine.setSpeed(multiplier);
        }
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.getAttribute('data-speed'), 10) === multiplier);
        });
        if (window.soundManager) window.soundManager.playClick();
    }

    handleDayEnd() {
        // Trigger balance sheet audit
        const ledgerEntry = window.simulationModel.endDay();
        if (window.web3Manager) window.web3Manager.resetDayBoost();

        if (window.soundManager) {
            if (ledgerEntry.netProfit >= 0) {
                window.soundManager.playDayEnd();
            } else {
                window.soundManager.playSad();
            }
        }

        // Render End of Day Modal
        this.renderEndDayModal(ledgerEntry);
        this.updateHUD();
    }

    renderEndDayModal(entry) {
        const modal = document.getElementById('endDayModal');
        if (!modal) return;

        document.getElementById('modalDayTitle').textContent = `Day ${entry.day} - Daily Financial Audit`;
        document.getElementById('modalLocation').textContent = entry.location;
        document.getElementById('modalWeather').textContent = `${entry.weather.temp}°C ${entry.weather.desc}`;

        const elOpening = document.getElementById('modalOpeningCash');
        if (elOpening) elOpening.textContent = `$${(entry.openingCash || 40.0).toFixed(2)}`;

        document.getElementById('modalTotalPedestrians').textContent = entry.stats.pedestriansTotal;
        document.getElementById('modalCupsSold').textContent = entry.stats.cupsSold;
        document.getElementById('modalLostCustomers').textContent = 
            `Price: ${entry.stats.lostPrice} | Taste: ${entry.stats.lostTaste} | Out of Stock: ${entry.stats.lostStock} | Wait: ${entry.stats.lostPatience}`;

        document.getElementById('modalCashRev').textContent = `$${(entry.stats.revenueCash + entry.stats.tipsCash).toFixed(2)}`;
        const elCryptoRev = document.getElementById('modalCryptoRev');
        if (elCryptoRev) {
            elCryptoRev.textContent = `$${(entry.stats.tipsCash || 0).toFixed(2)} Tips`;
        }
        document.getElementById('modalGrossRev').textContent = `$${entry.totalRevenue.toFixed(2)}`;

        document.getElementById('modalCostIngredients').textContent = `-$${entry.stats.costIngredients.toFixed(2)}`;
        document.getElementById('modalCostRent').textContent = `-$${entry.stats.costRent.toFixed(2)}`;
        const elCostStaff = document.getElementById('modalCostStaff');
        if (elCostStaff) {
            elCostStaff.textContent = `-$${(entry.stats.costStaff || 0).toFixed(2)}`;
        }
        document.getElementById('modalCostSpoilage').textContent = `-$${entry.stats.costSpoilage.toFixed(2)} (Melted Ice: ${entry.meltedIce}, Spoiled Milk: ${entry.spoiledMilk})`;

        const rowLoan = document.getElementById('rowModalLoanDebt');
        const elLoanInterest = document.getElementById('modalCostLoanInterest');
        if (entry.stats.costLoanInterest > 0 && rowLoan && elLoanInterest) {
            rowLoan.style.display = 'flex';
            elLoanInterest.textContent = `-$${entry.stats.costLoanInterest.toFixed(2)}`;
        } else if (rowLoan) {
            rowLoan.style.display = 'none';
        }

        document.getElementById('modalTotalExpenses').textContent = `-$${entry.totalExpenses.toFixed(2)}`;

        const elProfit = document.getElementById('modalNetProfit');
        elProfit.textContent = (entry.netProfit >= 0 ? `+$${entry.netProfit.toFixed(2)}` : `-$${Math.abs(entry.netProfit).toFixed(2)}`);
        elProfit.className = entry.netProfit >= 0 ? 'profit-positive' : 'profit-negative';

        const elClosingCash = document.getElementById('modalClosingCash');
        if (elClosingCash) {
            elClosingCash.textContent = `$${entry.closingCash.toFixed(2)}`;
            elClosingCash.style.color = (entry.closingCash < 0) ? '#e74c3c' : '#2ecc71';
        }

        const elClosingCrypto = document.getElementById('modalClosingCrypto');
        if (elClosingCrypto) elClosingCrypto.textContent = `${entry.closingCrypto.toFixed(2)} USDC`;

        document.getElementById('modalSatisfaction').textContent = `${entry.avgRating > 0 ? entry.avgRating : 'N/A'} / 5.0 Stars ⭐`;
        document.getElementById('modalReputation').textContent = `${window.simulationModel.reputation}%`;

        // Tomorrow's Forecast Preview
        const tomorrow = window.simulationModel.weather;
        document.getElementById('modalTomorrowForecast').textContent = 
            `Tomorrow Forecast: ${tomorrow.icon} ${tomorrow.temp}°C - ${tomorrow.desc}`;

        modal.classList.add('active');
    }

    openEmergencyModal() {
        const modal = document.getElementById('emergencyModal');
        if (modal) modal.classList.add('active');
        if (window.soundManager) window.soundManager.playClick();
    }

    closeEmergencyModal() {
        const modal = document.getElementById('emergencyModal');
        if (modal) modal.classList.remove('active');
        if (window.soundManager) window.soundManager.playClick();
    }

    showSuppliesWarningModal(missingList) {
        const modal = document.getElementById('suppliesWarningModal');
        const sub = document.getElementById('suppliesWarningSubtitle');
        if (sub && missingList && missingList.length > 0) {
            sub.textContent = `Missing: ${missingList.join(', ')}. Change your recipe or buy more supplies.`;
        } else if (sub) {
            sub.textContent = 'Change your recipe or buy more supplies.';
        }
        if (modal) modal.classList.add('active');
        if (window.soundManager) window.soundManager.playSad();
    }

    closeSuppliesWarningModal() {
        const modal = document.getElementById('suppliesWarningModal');
        if (modal) modal.classList.remove('active');
        this.switchTab('supplies');
    }

    // -------------------------------------------------------------
    // TAB: SUPPLIES (LEMONADE TYCOON RETRO STEPPER STYLE)
    // -------------------------------------------------------------
    renderSuppliesTab() {
        const sim = window.simulationModel;

        // Current Inventory Counts on Sub-tabs
        const countMap = {
            beans: `${sim.inventory.beans} scoops`,
            milk: `${sim.inventory.milk} serv`,
            sugar: `${sim.inventory.sugar} packs`,
            ice: `${sim.inventory.ice} cubes`,
            cups: `${sim.inventory.cups} units`,
            syrup: `${sim.inventory.syrup} pumps`
        };

        Object.keys(countMap).forEach(k => {
            const el = document.getElementById(`inv_${k}`);
            if (el) el.textContent = countMap[k];
        });

        // Highlight active subtab
        document.querySelectorAll('.supplies-subtab').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-ingredient') === this.activeSuppliesIngredient);
        });

        // Spoilage warnings
        const cooler = typeof sim.getUpgradeItem === 'function' ? sim.getUpgradeItem('cooler') : sim.getUpgrades().cooler[sim.upgrades.cooler - 1];
        const iceWarning = document.getElementById('suppliesIceWarning');
        if (iceWarning && cooler) {
            const iceMeltPct = Math.round((cooler.meltRate !== undefined ? cooler.meltRate : 1) * 100);
            const milkSpoilPct = Math.round((cooler.milkSpoilRate !== undefined ? cooler.milkSpoilRate : 1) * 100);
            iceWarning.textContent = (iceMeltPct > 0 || milkSpoilPct > 0)
                ? `⚠️ Cooler Level ${sim.upgrades.cooler} (${cooler.name}): ${iceMeltPct}% of unsold ice melts & ${milkSpoilPct}% of unsold milk spoils at the end of every day!`
                : '✅ Dual-Zone Commercial Fridge active: 0% ice melt & 0% milk spoilage!';
        }

        // Render the 3 package tiers for the active ingredient
        this.renderSuppliesPackageTiers();

        // Update cart checkout total
        this.updateSuppliesCartUI();
    }

    renderSuppliesPackageTiers() {
        const sim = window.simulationModel;
        const container = document.getElementById('suppliesPackageTiers');
        if (!container) return;
        container.innerHTML = '';

        const catalog = sim.getSuppliesCatalog();
        const activeItems = catalog.filter(s => s.item === this.activeSuppliesIngredient);

        activeItems.forEach(item => {
            const currentQty = this.suppliesCart[item.id] || 0;
            const subtotal = currentQty * item.cost;

            const card = document.createElement('div');
            card.className = 'supplies-tier-card';
            card.innerHTML = `
                <div>
                    <span class="tier-badge ${item.tier.toLowerCase()}">${item.tier} Pack</span>
                    <div class="tier-name">${item.icon} ${item.name}</div>
                    <div class="tier-desc">${item.qty} units per pack</div>
                </div>
                <div class="tier-price-tag">${item.cost.toFixed(2)}</div>
                <div>
                    <div class="tier-stepper-row">
                        <button type="button" class="tier-stepper-btn btn-pack-minus" data-id="${item.id}">−</button>
                        <span class="tier-qty-val" id="qty_${item.id}">${currentQty}</span>
                        <button type="button" class="tier-stepper-btn btn-pack-plus" data-id="${item.id}">+</button>
                    </div>
                    <div class="tier-subtotal" id="subtotal_${item.id}">Subtotal: ${subtotal.toFixed(2)}</div>
                </div>
            `;

            card.querySelector('.btn-pack-minus').addEventListener('click', () => {
                const q = Math.max(0, (this.suppliesCart[item.id] || 0) - 1);
                if (q === 0) delete this.suppliesCart[item.id];
                else this.suppliesCart[item.id] = q;
                const qtyEl = document.getElementById(`qty_${item.id}`);
                const subEl = document.getElementById(`subtotal_${item.id}`);
                if (qtyEl) qtyEl.textContent = q;
                if (subEl) subEl.textContent = `Subtotal: ${(q * item.cost).toFixed(2)}`;
                this.updateSuppliesCartUI();
                if (window.soundManager) window.soundManager.playClick();
            });

            card.querySelector('.btn-pack-plus').addEventListener('click', () => {
                const q = (this.suppliesCart[item.id] || 0) + 1;
                this.suppliesCart[item.id] = q;
                const qtyEl = document.getElementById(`qty_${item.id}`);
                const subEl = document.getElementById(`subtotal_${item.id}`);
                if (qtyEl) qtyEl.textContent = q;
                if (subEl) subEl.textContent = `Subtotal: ${(q * item.cost).toFixed(2)}`;
                this.updateSuppliesCartUI();
                if (window.soundManager) window.soundManager.playClick();
            });

            container.appendChild(card);
        });
    }

    updateSuppliesCartUI() {
        const sim = window.simulationModel;
        const catalog = sim.getSuppliesCatalog();
        let total = 0;
        let count = 0;

        Object.keys(this.suppliesCart).forEach(id => {
            const qty = this.suppliesCart[id] || 0;
            const item = catalog.find(s => s.id === id);
            if (item && qty > 0) {
                total += item.cost * qty;
                count += qty;
            }
        });

        const elTotal = document.getElementById('suppliesCartTotal');
        if (elTotal) elTotal.textContent = `${total.toFixed(2)}`;

        const elCount = document.getElementById('suppliesCartItemsCount');
        if (elCount) elCount.textContent = `(${count} package${count !== 1 ? 's' : ''} selected)`;

        const btnBuy = document.getElementById('btnBuySuppliesCart');
        if (btnBuy) {
            btnBuy.textContent = `🛒 BUY NOW (${total.toFixed(2)})`;
            btnBuy.disabled = (total <= 0 || total > sim.cash);
        }
    }

    // -------------------------------------------------------------
    // TAB: MARKETING (LEMONADE TYCOON 2-SLIDER MINIMALIST FORMAT)
    // -------------------------------------------------------------
    renderMarketingTab() {
        const sim = window.simulationModel;
        const r = sim.recipe;

        // Sync price slider & display
        const elPrice = document.getElementById('marketing_price');
        const valPrice = document.getElementById('val_marketing_price');
        if (elPrice) elPrice.value = r.price;
        if (valPrice) valPrice.textContent = `${r.price.toFixed(2)}`;

        // Badge
        const badgePrice = document.getElementById('marketingPriceBadge');
        if (badgePrice) {
            if (r.price <= 2.50) badgePrice.textContent = 'Budget Friendly';
            else if (r.price <= 4.50) badgePrice.textContent = 'Standard Cafe';
            else badgePrice.textContent = 'Artisan Premium';
        }

        // Cost & Profit Margin readouts
        const estCost = sim.getEstimatedCupCost();
        const estMargin = sim.calculateMarginPerCup();
        const marginPct = Math.round((estMargin / r.price) * 100);

        const elCost = document.getElementById('marketingEstCost');
        if (elCost) elCost.textContent = `${estCost.toFixed(2)} / cup`;

        const elMargin = document.getElementById('marketingEstMargin');
        if (elMargin) {
            elMargin.textContent = `${estMargin >= 0 ? '+' : ''}${estMargin.toFixed(2)} (${marginPct}%)`;
            elMargin.style.color = (estMargin > 0) ? '#2ecc71' : '#e74c3c';
        }

        // Budget Slider
        const elBudget = document.getElementById('marketing_budget');
        const valBudget = document.getElementById('val_marketing_budget');
        if (elBudget) elBudget.value = sim.dailyMarketingBudget || 0;
        if (valBudget) valBudget.textContent = `${(sim.dailyMarketingBudget || 0).toFixed(2)} / day`;

        // Update Tier Details
        this.updateMarketingTierDetails(sim.dailyMarketingBudget || 0);

        // Sync Web3 drawer elements & Boost status inside Marketing tab
        this.renderWeb3Tab();
        this.updateBoostStatusUI();
    }

    updateBoostStatusUI() {
        const web3 = window.web3Manager;
        const sim = window.simulationModel;
        if (!web3) return;

        const boostText = document.getElementById('boostStatusText');
        const btnBoost = document.getElementById('btnActivateBoost');
        const currentDay = sim ? sim.dayNumber : 1;
        const isBoost = Boolean(web3.isBoostActive);
        const onCooldown = Boolean(!isBoost && web3.lastBoostDay >= 0 && (currentDay - web3.lastBoostDay < 3));
        const daysLeft = onCooldown ? (3 - (currentDay - web3.lastBoostDay)) : 0;

        if (boostText) {
            if (isBoost) {
                boostText.textContent = '🚀 ACTIVE! (+90% Traffic, +35% Speed & +4 Queue Cap Today!)';
                boostText.style.color = '#00ffcc';
            } else if (onCooldown) {
                boostText.textContent = `⏳ Cooldown (${daysLeft}d left • Ready Day ${web3.lastBoostDay + 3})`;
                boostText.style.color = '#e67e22';
            } else {
                boostText.textContent = 'Ready ($100.00 Cash • 3-Day Cooldown)';
                boostText.style.color = '#f1c40f';
            }
        }

        if (btnBoost) {
            btnBoost.disabled = isBoost || onCooldown;
            if (isBoost) {
                btnBoost.textContent = '⚡ /boost HYPER-FLOW ACTIVE TODAY! 🚀';
            } else if (onCooldown) {
                btnBoost.textContent = `⏳ /boost ON COOLDOWN (${daysLeft}d LEFT)`;
            } else {
                btnBoost.textContent = '⚡ ACTIVATE /boost ($100.00 CASH • HYPER-FLOW)';
            }
        }
    }

    updateMarketingTierDetails(budget) {
        const badge = document.getElementById('marketingTierStatus');
        const traffic = document.getElementById('marketingTrafficBonus');
        const desc = document.getElementById('marketingTierDesc');

        if (budget <= 0) {
            if (badge) { badge.textContent = '🌱 Organic (Word of Mouth)'; badge.className = 'marketing-badge badge-organic'; }
            if (traffic) traffic.textContent = '+0% Visitors';
            if (desc) desc.textContent = 'Free organic walk-ins. Zero daily advertising spend.';
        } else if (budget <= 10) {
            if (badge) { badge.textContent = '📱 Social Media (IG/TikTok Ads)'; badge.className = 'marketing-badge badge-ads'; }
            if (traffic) traffic.textContent = '+25% Visitors';
            if (desc) desc.textContent = 'Targeted local neighborhood social media story ads and banner impressions.';
        } else if (budget <= 25) {
            if (badge) { badge.textContent = '🌟 Food Vlogger Endorsements'; badge.className = 'marketing-badge badge-influencer'; }
            if (traffic) traffic.textContent = '+60% Visitors';
            if (desc) desc.textContent = 'Popular food vloggers and lifestyle creators post raving reviews of your signature blend!';
        } else {
            if (badge) { badge.textContent = '🏙️ City-Wide Media Blitz'; badge.className = 'marketing-badge badge-blitz'; }
            if (traffic) traffic.textContent = '+100% Visitors';
            if (desc) desc.textContent = 'Downtown LED billboards, transit station displays, and trending viral sponsorship!';
        }
    }

    // -------------------------------------------------------------
    // TAB: RECIPE
    // -------------------------------------------------------------
    renderRecipeTab() {
        const r = window.simulationModel.recipe;

        ['beans', 'milk', 'sugar', 'ice', 'syrup'].forEach(k => {
            const el = document.getElementById(`recipe_${k}`);
            const val = document.getElementById(`val_${k}`);
            if (el) el.value = r[k];
            if (val) val.textContent = r[k];
        });

        const elPrice = document.getElementById('recipe_price');
        const valPrice = document.getElementById('val_price');
        if (elPrice) elPrice.value = r.price;
        if (valPrice) valPrice.textContent = `$${r.price.toFixed(2)}`;

        const cryptoCheck = document.getElementById('recipe_crypto');
        if (cryptoCheck) cryptoCheck.checked = r.acceptCrypto;

        this.updateRecipeCalculations();
    }

    updateRecipeCalculations() {
        const sim = window.simulationModel;
        const evalRes = sim.evaluateRecipe(sim.weather.temp);

        // Quality gauges
        const elTaste = document.getElementById('recipeTasteScore');
        if (elTaste) elTaste.textContent = `${evalRes.tasteScore}% (${evalRes.tasteLabel})`;

        const elTemp = document.getElementById('recipeTempScore');
        if (elTemp) elTemp.textContent = `${evalRes.tempScore}% (${evalRes.tempLabel})`;

        const elOverall = document.getElementById('recipeOverallStars');
        if (elOverall) elOverall.textContent = `${evalRes.stars} / 5.0 ⭐ (${evalRes.overallQuality}%)`;

        // Unit Cost & Margin estimation
        const r = sim.recipe;
        const estCost = typeof sim.getEstimatedCupCost === 'function' ? sim.getEstimatedCupCost() : 0.45;
        const margin = r.price - estCost;

        const elCost = document.getElementById('recipeEstCost');
        if (elCost) elCost.textContent = `$${estCost.toFixed(2)}`;

        const elMargin = document.getElementById('recipeEstMargin');
        if (elMargin) {
            elMargin.textContent = `$${margin.toFixed(2)} (${Math.round(margin / r.price * 100)}%)`;
            elMargin.style.color = (margin > 0) ? '#2ecc71' : '#e74c3c';
        }

        const elPayBadge = document.getElementById('recipePaymentBadge');
        if (elPayBadge) {
            const term = typeof sim.getUpgradeItem === 'function' ? sim.getUpgradeItem('terminal') : null;
            if (sim.upgrades.terminal >= 3) {
                elPayBadge.textContent = `📲 ${term ? term.name : 'Contactless NFC Tap & QRIS POS'} (Active)`;
            } else if (sim.upgrades.terminal === 2) {
                elPayBadge.textContent = `💳 ${term ? term.name : 'QRIS & EDC Card Register'} (Active)`;
            } else {
                elPayBadge.textContent = `💵 ${term ? term.name : 'Vintage Metal Cash Box'} (Cash Only)`;
            }
        }
    }

    // -------------------------------------------------------------
    // TAB: LOCATIONS (LEMONADE TYCOON CAROUSEL)
    // -------------------------------------------------------------
    navigateLocation(delta) {
        const sim = window.simulationModel;
        if (!sim) return;
        const locs = sim.getLocations();
        const keys = Object.keys(locs);
        if (!keys.length) return;

        if (this.selectedLocationIndex === undefined) {
            this.selectedLocationIndex = keys.indexOf(sim.currentLocation);
            if (this.selectedLocationIndex === -1) this.selectedLocationIndex = 0;
        }

        this.selectedLocationIndex += delta;
        if (this.selectedLocationIndex < 0) {
            this.selectedLocationIndex = keys.length - 1;
        } else if (this.selectedLocationIndex >= keys.length) {
            this.selectedLocationIndex = 0;
        }

        if (window.soundManager) window.soundManager.playClick();
        this.renderLocationsTab();
    }

    jumpToLocationTier(tierVal) {
        const sim = window.simulationModel;
        if (!sim) return;
        const locs = sim.getLocations();
        const keys = Object.keys(locs);

        if (tierVal === 'all') {
            this.selectedLocationIndex = 0;
        } else {
            const tierNum = parseInt(tierVal, 10);
            const foundIdx = keys.findIndex(k => locs[k].tier && locs[k].tier.includes(`Tier ${tierNum}`));
            if (foundIdx !== -1) {
                this.selectedLocationIndex = foundIdx;
            }
        }

        if (window.soundManager) window.soundManager.playClick();
        this.renderLocationsTab();
    }

    handleLocationRent() {
        const sim = window.simulationModel;
        if (!sim) return;
        const locs = sim.getLocations();
        const keys = Object.keys(locs);
        const locKey = keys[this.selectedLocationIndex || 0];
        const loc = locs[locKey];
        if (!loc) return;

        const isSimRunning = window.simulationEngine && window.simulationEngine.isRunning;
        if (isSimRunning) return;
        const isRentPaidToday = (loc.rent <= 0) || (sim.prepaidRentLocation === loc.id && sim.paidLocationRentForDay === sim.dayNumber);
        if (sim.currentLocation === loc.id && isRentPaidToday) return;

        const res = typeof sim.rentLocation === 'function' ? sim.rentLocation(loc.id) : { success: sim.setLocation(loc.id) };
        if (!res.success) {
            if (window.soundManager) window.soundManager.playSad();
            alert(res.message || `Cannot rent ${loc.name}: Insufficient cash for upfront rent ($${loc.rent.toFixed(2)})!`);
            return;
        }

        if (window.simulationEngine && typeof window.simulationEngine.render === 'function' && window.simulationEngine.ctx) {
            window.simulationEngine.render();
        }
        if (window.soundManager) {
            if (typeof window.soundManager.playCash === 'function') {
                window.soundManager.playCash();
            } else {
                window.soundManager.playClick();
            }
        }
        this.renderLocationsTab();
        this.updateHUD();
    }

    renderLocationsTab() {
        const sim = window.simulationModel;
        if (!sim) return;
        const locs = sim.getLocations();
        const keys = Object.keys(locs);
        if (!keys.length) return;

        // Default to player's current stand location if not yet initialized
        if (this.selectedLocationIndex === undefined) {
            const currentIdx = keys.indexOf(sim.currentLocation);
            this.selectedLocationIndex = (currentIdx !== -1) ? currentIdx : 0;
        }

        // Clamp index with wrap-around
        if (this.selectedLocationIndex < 0) this.selectedLocationIndex = keys.length - 1;
        if (this.selectedLocationIndex >= keys.length) this.selectedLocationIndex = 0;

        const currentKey = keys[this.selectedLocationIndex];
        const loc = locs[currentKey];
        const isCurrentStand = (sim.currentLocation === currentKey);
        const isRentPaidToday = (loc.rent <= 0) || (sim.prepaidRentLocation === currentKey && sim.paidLocationRentForDay === sim.dayNumber);
        const unusedMorningRentCredit = (sim.paidLocationRentForDay === sim.dayNumber) ? (sim.prepaidRentAmount || 0) : 0;
        const effectiveCash = Math.round((sim.cash + unusedMorningRentCredit) * 100) / 100;
        const canAffordRent = (effectiveCash >= loc.rent);
        const isSimRunning = window.simulationEngine && window.simulationEngine.isRunning;

        const pop = sim.getLocationPopularity(currentKey);
        const sat = sim.getLocationSatisfaction(currentKey);

        // 1. Counter Badge
        const elCounter = document.getElementById('locCarouselCounter');
        if (elCounter) {
            elCounter.textContent = `Location ${this.selectedLocationIndex + 1} of ${keys.length} • ${loc.tier}`;
        }

        // 2. Portrait Box & Image
        const elImg = document.getElementById('locPortraitImg');
        if (elImg) {
            elImg.src = `assets/${loc.id}_bg.jpg`;
            elImg.alt = loc.name;
        }

        const elBadge = document.getElementById('locPortraitBadge');
        if (elBadge) {
            elBadge.textContent = isCurrentStand
                ? (isRentPaidToday ? '★ CURRENT STAND' : '⚠️ RENT DUE TODAY')
                : loc.tier;
        }

        // 3. Info Column
        const elTitle = document.getElementById('locCardTitle');
        if (elTitle) elTitle.textContent = loc.name;

        const elTier = document.getElementById('locCardTier');
        if (elTier) elTier.textContent = loc.tier;

        const elDesc = document.getElementById('locCardDesc');
        if (elDesc) elDesc.textContent = loc.description;

        // 4. Meters (Lemonade Tycoon Style)
        const elPopVal = document.getElementById('locPopVal');
        if (elPopVal) elPopVal.textContent = `${pop}%`;

        const elPopFill = document.getElementById('locPopFill');
        if (elPopFill) elPopFill.style.width = `${pop}%`;

        const elSatVal = document.getElementById('locSatVal');
        if (elSatVal) elSatVal.textContent = `${sat}%`;

        const elSatFill = document.getElementById('locSatFill');
        if (elSatFill) elSatFill.style.width = `${sat}%`;

        // 5. Rent Box
        const elRentVal = document.getElementById('locRentVal');
        if (elRentVal) {
            elRentVal.textContent = loc.rent > 0 ? `$${loc.rent.toFixed(2)}` : 'FREE';
        }

        // 6. Help Drawer Stats
        const elFootTraffic = document.getElementById('locStatsFootTraffic');
        if (elFootTraffic) elFootTraffic.textContent = `~${loc.baseFootTraffic} patrons/day (±${loc.trafficVariance || 15})`;

        const elPriceTol = document.getElementById('locStatsPriceTol');
        if (elPriceTol) elPriceTol.textContent = `~$${loc.basePriceTolerance.toFixed(2)}`;

        const elDemographics = document.getElementById('locStatsDemographics');
        if (elDemographics) elDemographics.textContent = loc.preferredArchetypes.join(', ');

        // 7. Action Button (Upfront Rent Enforcement)
        const elBtnRent = document.getElementById('locBtnRent');
        if (elBtnRent) {
            if (isCurrentStand && isRentPaidToday) {
                elBtnRent.textContent = '📍 Current Stand (Rented & Active)';
                elBtnRent.disabled = true;
                elBtnRent.classList.add('btn-rent-active');
            } else if (isSimRunning) {
                elBtnRent.textContent = '☕ Stand Open (Move Cart Tomorrow)';
                elBtnRent.disabled = true;
                elBtnRent.classList.remove('btn-rent-active');
            } else if (!canAffordRent) {
                elBtnRent.textContent = isCurrentStand
                    ? `🔒 Unpaid Rent ($${loc.rent.toFixed(2)}) — Need Cash or Move to Free Spot`
                    : `🔒 Need $${loc.rent.toFixed(2)} Cash Upfront to Rent ${loc.name}`;
                elBtnRent.disabled = true;
                elBtnRent.classList.remove('btn-rent-active');
            } else if (isCurrentStand && !isRentPaidToday) {
                elBtnRent.textContent = `💳 Pay Today's Rent for ${loc.name} ($${loc.rent.toFixed(2)} Upfront)`;
                elBtnRent.disabled = false;
                elBtnRent.classList.remove('btn-rent-active');
            } else {
                elBtnRent.textContent = loc.rent > 0
                    ? `🚚 Rent & Move Cart to ${loc.name} (Pay $${loc.rent.toFixed(2)} Upfront)`
                    : `🚚 Move Cart to ${loc.name} (FREE)`;
                elBtnRent.disabled = false;
                elBtnRent.classList.remove('btn-rent-active');
            }
        }

        // 8. Update Tier Pills active state
        document.querySelectorAll('.loc-tier-pill').forEach(pill => {
            const tierVal = pill.getAttribute('data-tier');
            if (tierVal === 'all') {
                pill.classList.remove('active');
            } else {
                const match = loc.tier && loc.tier.includes(`Tier ${tierVal}`);
                pill.classList.toggle('active', !!match);
            }
        });

        // 9. Legacy / compatibility grid sync
        const legacyGrid = document.getElementById('locationsGrid');
        if (legacyGrid) legacyGrid.innerHTML = '';
    }

    // -------------------------------------------------------------
    // TAB: UPGRADES (LEMONADE TYCOON 16-BIT CAROUSEL)
    // -------------------------------------------------------------
    getFilteredUpgrades() {
        const sim = window.simulationModel;
        if (!sim) return [];
        const upgs = sim.getUpgrades();
        const cats = ['machine', 'cooler', 'grinder', 'terminal', 'canopy', 'marketing', 'decor'];
        if (this.activeUpgradeCategory && this.activeUpgradeCategory !== 'all') {
            return upgs[this.activeUpgradeCategory] || [];
        }
        let list = [];
        cats.forEach(c => {
            if (upgs[c]) list = list.concat(upgs[c]);
        });
        return list;
    }

    navigateUpgrade(delta) {
        const items = this.getFilteredUpgrades();
        if (!items.length) return;
        this.selectedUpgradeIndex = (this.selectedUpgradeIndex + delta + items.length) % items.length;
        if (window.soundManager) window.soundManager.playClick();
        this.renderUpgradesTab();
    }

    jumpToUpgradeCategory(cat) {
        this.activeUpgradeCategory = cat || 'all';
        this.selectedUpgradeIndex = 0;
        if (window.soundManager) window.soundManager.playClick();
        this.renderUpgradesTab();
    }

    handleUpgradeBuy() {
        const sim = window.simulationModel;
        if (!sim) return;
        const items = this.getFilteredUpgrades();
        const item = items[this.selectedUpgradeIndex || 0];
        if (!item) return;

        const defaultLvl = item.category === 'decor' ? 0 : 1;
        const curLvl = (sim.upgrades[item.category] !== undefined) ? sim.upgrades[item.category] : defaultLvl;
        if (curLvl >= item.level) return;

        const res = sim.buyUpgrade(item.category, item.level);
        if (res.success) {
            if (window.soundManager) window.soundManager.playRegister();
            if (window.spriteRenderer && window.simulationEngine) {
                const sx = window.simulationEngine.standX || 450;
                const sy = window.simulationEngine.standY || 310;
                if (typeof window.spriteRenderer.addFloatingText === 'function') {
                    window.spriteRenderer.addFloatingText(`✨ ${item.name} Lvl ${item.level}!`, sx + 20, sy - 54, '#ffd700');
                }
                if (typeof window.spriteRenderer.spawnParticles === 'function') {
                    window.spriteRenderer.spawnParticles(sx + 20, sy - 20, 'cheerful_stars');
                }
            }
            if (window.simulationEngine && typeof window.simulationEngine.render === 'function') {
                window.simulationEngine.render();
            }
            this.renderUpgradesTab();
            this.updateHUD();
        } else {
            if (window.soundManager) window.soundManager.playSad();
            alert(res.message);
        }
    }

    renderUpgradesTab() {
        const sim = window.simulationModel;
        if (!sim) return;
        const items = this.getFilteredUpgrades();
        if (!items.length) return;

        if (this.selectedUpgradeIndex === undefined || this.selectedUpgradeIndex < 0) {
            this.selectedUpgradeIndex = 0;
        }
        if (this.selectedUpgradeIndex >= items.length) {
            this.selectedUpgradeIndex = 0;
        }

        const item = items[this.selectedUpgradeIndex];
        const defaultLvl = item.category === 'decor' ? 0 : 1;
        const curLvl = (sim.upgrades[item.category] !== undefined) ? sim.upgrades[item.category] : defaultLvl;
        const isOwned = (curLvl >= item.level);
        const isNext = (item.level === curLvl + 1);
        const canAfford = (sim.cash >= item.cost);

        const categoryNames = {
            machine: 'Espresso Machines & Brewers',
            cooler: 'Cooling & Refrigeration',
            grinder: 'Coffee Grinders',
            terminal: 'Registers & Terminals',
            canopy: 'Weather Awnings & Canopies',
            marketing: 'Advertising & Signage',
            decor: 'Cart Craftsmanship & Aesthetics'
        };
        const catName = categoryNames[item.category] || item.category;

        // 1. Counter Badge
        const elCounter = document.getElementById('upgCarouselCounter');
        if (elCounter) {
            elCounter.textContent = `Upgrade ${this.selectedUpgradeIndex + 1} of ${items.length} • ${catName}`;
        }

        // 2. Portrait Box & Image
        const elImg = document.getElementById('upgPortraitImg');
        if (elImg) {
            const basePortrait = item.portrait || 'assets/upg_machine_1.png';
            elImg.src = `${basePortrait}?v=44`;
            elImg.alt = item.name;
        }

        const elBadge = document.getElementById('upgPortraitBadge');
        if (elBadge) {
            elBadge.textContent = isOwned ? '★ OWNED' : `LEVEL ${item.level}`;
            elBadge.style.background = isOwned ? 'rgba(34, 197, 94, 0.9)' : 'rgba(13, 38, 3, 0.88)';
        }

        // 3. Info Column
        const elTitle = document.getElementById('upgCardTitle');
        if (elTitle) elTitle.textContent = item.name;

        const elCat = document.getElementById('upgCategoryTag');
        if (elCat) elCat.textContent = `${catName} • Level ${item.level}`;

        const elDesc = document.getElementById('upgCardDesc');
        if (elDesc) elDesc.textContent = item.desc;

        // 4. Perks List Chips
        const elPerks = document.getElementById('upgPerksList');
        if (elPerks) {
            elPerks.innerHTML = '';
            const perks = [];
            if (item.category === 'machine') {
                perks.push(`⚡ Brew: ${item.brewTime}s`);
                perks.push(`💧 Pour: ${item.pourTime}s`);
                if (item.qualityBonus > 0) perks.push(`⭐ Taste: +${item.qualityBonus}%`);
                if (item.yieldBonus > 0) perks.push(`📦 Yield: 11 Cups`);
            } else if (item.category === 'cooler') {
                perks.push(`🧊 Ice Saved: ${Math.round((1 - item.meltRate) * 100)}%`);
                const milkKept = item.milkSpoilRate !== undefined ? Math.round((1 - item.milkSpoilRate) * 100) : (item.milkSpoilTemp > 90 ? 100 : 0);
                perks.push(milkKept >= 100 ? '🥛 100% Milk Saved' : `🥛 Milk Saved: ${milkKept}%`);
            } else if (item.category === 'grinder') {
                if (item.qualityBonus > 0) perks.push(`⭐ Quality: +${item.qualityBonus}%`);
                if (item.speedBonus > 0) perks.push(`⚡ Speed: +${item.speedBonus}%`);
                if (item.level >= 3) perks.push(`☕ Saves 10% Beans`);
            } else if (item.category === 'terminal') {
                if (item.conversionBonus > 0) perks.push(`📈 Conversion: +${item.conversionBonus}%`);
                if (item.speedBonus > 0) perks.push(`⏱️ Checkout: +${item.speedBonus}%`);
                if (item.tipBonus > 0 || item.cryptoTipBonus > 0) perks.push(`💵 Tips: +${item.tipBonus || item.cryptoTipBonus}%`);
            } else if (item.category === 'canopy') {
                if (item.rainProtection > 0) perks.push(`🌧️ Rain Shelter: +${Math.round(item.rainProtection * 100)}%`);
                if (item.patienceBonus > 0) perks.push(`⏳ Line Patience: +${item.patienceBonus}s`);
                if (item.level >= 2) perks.push(`👥 Queue Cap: +${item.level >= 3 ? 4 : 2}`);
            } else if (item.category === 'marketing') {
                if (item.trafficBonus > 0) perks.push(`📢 Traffic & Stop: +${item.trafficBonus}%`);
            } else if (item.category === 'decor') {
                if (item.priceTolBonus > 0) perks.push(`💰 Price Tolerance: +${Math.round(item.priceTolBonus * 100)}%`);
                if (item.tipBonus > 0) perks.push(`💵 Tips: +${Math.round(item.tipBonus * 100)}%`);
                if (item.trafficBonus > 0) perks.push(`🧲 Attraction: +${item.trafficBonus}%`);
                if (item.speedBonus > 0) perks.push(`⚡ Workflow: +${item.speedBonus}%`);
                if (item.level >= 2) perks.push(`👥 Queue Cap: +${item.level - 1}`);
            }
            if (!perks.length) perks.push('✨ Starter Standard');

            perks.forEach(p => {
                const chip = document.createElement('span');
                chip.className = 'upg-perk-chip';
                chip.textContent = p;
                elPerks.appendChild(chip);
            });
        }

        // 5. Price Display
        const elPrice = document.getElementById('upgPriceVal');
        if (elPrice) {
            elPrice.textContent = isOwned ? 'OWNED' : (item.cost === 0 ? 'FREE' : `$${item.cost.toFixed(2)}`);
        }

        // 6. Buy Button & Status Hint
        const elBuy = document.getElementById('upgBtnBuy');
        const elHint = document.getElementById('upgStatusHint');
        if (elBuy) {
            if (isOwned) {
                elBuy.textContent = 'OWNED ★';
                elBuy.disabled = true;
                elBuy.className = 'pixel-btn upg-btn-buy upg-btn-owned';
                if (elHint) elHint.textContent = `Equipped on cart (Tier ${item.level} Active)`;
            } else if (isNext) {
                if (canAfford) {
                    elBuy.textContent = `BUY ($${item.cost.toFixed(2)})`;
                    elBuy.disabled = false;
                    elBuy.className = 'pixel-btn upg-btn-buy';
                    if (elHint) elHint.textContent = 'Available for purchase with current earnings!';
                } else {
                    elBuy.textContent = `Need $${item.cost.toFixed(2)}`;
                    elBuy.disabled = true;
                    elBuy.className = 'pixel-btn upg-btn-buy upg-btn-short';
                    if (elHint) elHint.textContent = `Insufficient cash! Short by $${(item.cost - sim.cash).toFixed(2)}`;
                }
            } else {
                elBuy.textContent = `🔒 Unlock Level ${curLvl + 1} First`;
                elBuy.disabled = true;
                elBuy.className = 'pixel-btn upg-btn-buy upg-btn-locked';
                if (elHint) elHint.textContent = `Sequential tier required before unlocking Level ${item.level}`;
            }
        }

        // 7. Specifications Drawer Data
        const elHelpText = document.getElementById('upgHelpText');
        if (elHelpText) elHelpText.textContent = item.help || item.desc;

        const elHelpSpeed = document.getElementById('upgHelpSpeed');
        if (elHelpSpeed) {
            elHelpSpeed.textContent = item.brewTime ? `${item.brewTime}s Brew (${item.pourTime}s Pour)` : (item.speedBonus ? `+${item.speedBonus}% Speed` : 'Standard');
        }

        const elHelpQuality = document.getElementById('upgHelpQuality');
        if (elHelpQuality) {
            elHelpQuality.textContent = (item.qualityBonus ? `+${item.qualityBonus}% Taste` : (item.priceTolBonus ? `+${Math.round(item.priceTolBonus * 100)}% Tolerance` : 'Baseline'));
        }

        const elHelpWeather = document.getElementById('upgHelpWeather');
        if (elHelpWeather) {
            elHelpWeather.textContent = item.rainProtection ? `+${Math.round(item.rainProtection * 100)}% Rain Guard` : (item.milkSpoilTemp > 90 ? 'Zero Milk Spoilage' : (item.meltRate !== undefined ? `${Math.round((1 - item.meltRate) * 100)}% Ice Retained` : 'Standard'));
        }

        const elHelpROI = document.getElementById('upgHelpROI');
        if (elHelpROI) {
            elHelpROI.textContent = item.cost === 0 ? 'Starter Default' : (item.cost < 200 ? 'Early Game Upgrade' : 'Mid/Late Tier Investment');
        }

        // 8. Update Category Pills Active State
        document.querySelectorAll('#upgCategoryPills .upg-cat-pill').forEach(pill => {
            const catVal = pill.getAttribute('data-cat');
            pill.classList.toggle('active', catVal === (this.activeUpgradeCategory || 'all'));
        });

        // 9. Update Stand Owned Strip
        const elOwned = document.getElementById('upgOwnedStrip');
        if (elOwned) {
            elOwned.innerHTML = '';
            const categoriesMeta = [
                { key: 'decor', icon: '🎨', name: 'Cart' },
                { key: 'machine', icon: '☕', name: 'Brewer' },
                { key: 'cooler', icon: '🧊', name: 'Cooler' },
                { key: 'grinder', icon: '⚙️', name: 'Grinder' },
                { key: 'terminal', icon: '💳', name: 'Register' },
                { key: 'canopy', icon: '⛺', name: 'Canopy' },
                { key: 'marketing', icon: '📢', name: 'Marketing' }
            ];

            categoriesMeta.forEach(meta => {
                const defLvl = meta.key === 'decor' ? 0 : 1;
                const lvl = (sim.upgrades[meta.key] !== undefined) ? sim.upgrades[meta.key] : defLvl;
                const upgObj = typeof sim.getUpgradeItem === 'function' ? sim.getUpgradeItem(meta.key, lvl) : null;
                const badge = document.createElement('div');
                badge.className = 'upg-owned-badge';
                badge.title = `Click to browse ${meta.name} upgrades`;
                badge.innerHTML = `
                    <span class="upg-badge-icon">${meta.icon}</span>
                    <div class="upg-badge-text">
                        <span class="upg-badge-name">${upgObj ? upgObj.name : meta.name}</span>
                        <span class="upg-badge-lvl">Level ${lvl}</span>
                    </div>
                `;
                badge.addEventListener('click', () => {
                    this.jumpToUpgradeCategory(meta.key);
                });
                elOwned.appendChild(badge);
            });
        }

        // 10. Stand Tab Owned Upgrades Mini Badges Sync
        this.updateStandPanels();

        // 11. Legacy Grid Compatibility
        const legacyGrid = document.getElementById('upgradesGrid');
        if (legacyGrid) legacyGrid.innerHTML = '';
    }

    // -------------------------------------------------------------
    // TAB: STAFF HIRING (LEMONADE TYCOON DAILY WAGE CAROUSEL)
    // -------------------------------------------------------------
    navigateStaff(delta) {
        const sim = window.simulationModel;
        if (!sim || typeof sim.getStaffCatalog !== 'function') return;
        const catalog = sim.getStaffCatalog();
        if (!catalog.length) return;
        this.selectedStaffIndex = (this.selectedStaffIndex + delta + catalog.length) % catalog.length;
        if (window.soundManager) window.soundManager.playClick();
        this.renderStaffTab();
    }

    selectStaffIndex(idx) {
        const sim = window.simulationModel;
        if (!sim || typeof sim.getStaffCatalog !== 'function') return;
        const catalog = sim.getStaffCatalog();
        if (idx >= 0 && idx < catalog.length) {
            this.selectedStaffIndex = idx;
            if (window.soundManager) window.soundManager.playClick();
            this.renderStaffTab();
        }
    }

    handleStaffHireToggle() {
        const sim = window.simulationModel;
        if (!sim || typeof sim.getStaffCatalog !== 'function') return;
        const isSimRunning = window.simulationEngine && window.simulationEngine.isRunning;
        if (isSimRunning) return;

        const catalog = sim.getStaffCatalog();
        const member = catalog[this.selectedStaffIndex || 0];
        if (!member) return;

        const res = sim.toggleHireStaff(member.id);
        if (res.success) {
            if (window.soundManager) {
                if (res.hired) window.soundManager.playRegister();
                else window.soundManager.playClick();
            }
            this.renderStaffTab();
            this.updateHUD();
        } else {
            if (window.soundManager) window.soundManager.playSad();
            alert(res.message);
        }
    }

    renderStaffTab() {
        const sim = window.simulationModel;
        if (!sim || typeof sim.getStaffCatalog !== 'function') return;
        const catalog = sim.getStaffCatalog();
        if (!catalog.length) return;

        if (this.selectedStaffIndex === undefined || this.selectedStaffIndex < 0 || this.selectedStaffIndex >= catalog.length) {
            this.selectedStaffIndex = 0;
        }

        const member = catalog[this.selectedStaffIndex];
        const isHired = !!(sim.hiredStaff && sim.hiredStaff[member.id]);
        const isSimRunning = window.simulationEngine && window.simulationEngine.isRunning;

        // 1. Counter Badge
        const elCounter = document.getElementById('staffCarouselCounter');
        if (elCounter) {
            elCounter.textContent = `Staff ${this.selectedStaffIndex + 1} of ${catalog.length} • ${member.role}`;
        }

        // 2. Quick-Jump Pills
        document.querySelectorAll('.staff-pill').forEach(pill => {
            const pIdx = parseInt(pill.getAttribute('data-staff-idx'), 10);
            pill.classList.toggle('active', pIdx === this.selectedStaffIndex);
        });

        // 3. Portrait Box & Image
        const elImg = document.getElementById('staffPortraitImg');
        if (elImg) {
            elImg.src = `${member.portrait}?v=44`;
            elImg.alt = member.name;
        }

        const elBadge = document.getElementById('staffPortraitBadge');
        if (elBadge) {
            elBadge.textContent = isHired ? '★ HIRED' : `$${member.wage}/DAY`;
            elBadge.style.background = isHired ? 'rgba(34, 197, 94, 0.92)' : 'rgba(20, 10, 5, 0.92)';
        }

        // 4. Info Column
        const elTitle = document.getElementById('staffCardTitle');
        if (elTitle) elTitle.textContent = member.name;

        const elRole = document.getElementById('staffRoleTag');
        if (elRole) elRole.textContent = `${member.role} • Daily Wage: $${member.wage.toFixed(2)}/day`;

        const elDesc = document.getElementById('staffCardDesc');
        if (elDesc) elDesc.textContent = member.desc;

        // 5. Perks Chips
        const elPerks = document.getElementById('staffPerksList');
        if (elPerks) {
            elPerks.innerHTML = '';
            (member.perks || []).forEach(p => {
                const chip = document.createElement('span');
                chip.className = 'upg-perk-chip';
                chip.textContent = p;
                elPerks.appendChild(chip);
            });
        }

        // 6. Wage Box
        const elWage = document.getElementById('staffWageVal');
        if (elWage) {
            elWage.textContent = isHired ? `HIRED ($${member.wage}/d)` : `$${member.wage.toFixed(2)} / day`;
        }

        // 7. Hire / Dismiss Button & Status Hint
        const elBtnHire = document.getElementById('staffBtnHire');
        const elHint = document.getElementById('staffStatusHint');
        if (elBtnHire) {
            if (isSimRunning) {
                elBtnHire.textContent = '☕ Stand Open (Manage Staff Tomorrow)';
                elBtnHire.disabled = true;
                elBtnHire.className = 'pixel-btn upg-btn-buy upg-btn-locked';
                if (elHint) elHint.textContent = 'Staff roster cannot be changed while the stand is open.';
            } else if (isHired) {
                elBtnHire.textContent = `❌ DISMISS (${member.name.split(' ')[0]})`;
                elBtnHire.disabled = false;
                elBtnHire.className = 'pixel-btn upg-btn-buy upg-btn-dismiss';
                if (elHint) elHint.textContent = `${member.name} is on active payroll ($${member.wage.toFixed(2)}/day).`;
            } else if (sim.cash < member.wage) {
                elBtnHire.textContent = `Need $${member.wage.toFixed(2)} Cash to Hire`;
                elBtnHire.disabled = true;
                elBtnHire.className = 'pixel-btn upg-btn-buy upg-btn-short';
                if (elHint) elHint.textContent = `Need at least $${member.wage.toFixed(2)} cash on hand to cover first day's wage.`;
            } else {
                elBtnHire.textContent = `✅ HIRE ($${member.wage.toFixed(2)}/day)`;
                elBtnHire.disabled = false;
                elBtnHire.className = 'pixel-btn upg-btn-buy';
                if (elHint) elHint.textContent = 'Available to hire! Daily wage is paid at the end of each business day.';
            }
        }

        // 8. Help Drawer
        const elHelpText = document.getElementById('staffHelpText');
        if (elHelpText) elHelpText.textContent = member.help || member.desc;

        const elHelpSpeed = document.getElementById('staffHelpSpeed');
        if (elHelpSpeed) elHelpSpeed.textContent = member.speedBonus > 0 ? `+${member.speedBonus}% Faster Service` : 'Standard';

        const elHelpAttract = document.getElementById('staffHelpAttract');
        if (elHelpAttract) {
            elHelpAttract.textContent = (member.attractionBonus > 0 || member.trafficBonus > 0)
                ? `+${member.attractionBonus || 0}% Stop / +${member.trafficBonus || 0}% Foot Traffic`
                : 'Baseline';
        }

        const elHelpTip = document.getElementById('staffHelpTip');
        if (elHelpTip) {
            elHelpTip.textContent = member.tipBonus > 0
                ? `+${member.tipBonus}% Tips${member.qualityBonus ? ` & +${member.qualityBonus}% Taste` : ''}`
                : 'Standard';
        }

        const elHelpPatience = document.getElementById('staffHelpPatience');
        if (elHelpPatience) {
            elHelpPatience.textContent = member.patienceBonus > 0 ? `+${member.patienceBonus}s Queue Patience` : 'Standard';
        }

        // 9. Active Payroll Summary Strip
        const elTotalWage = document.getElementById('staffTotalWageLabel');
        if (elTotalWage) {
            elTotalWage.textContent = `Total Daily Payroll: $${sim.getDailyStaffCost().toFixed(2)} / day`;
        }

        const elHiredStrip = document.getElementById('staffHiredStrip');
        if (elHiredStrip) {
            elHiredStrip.innerHTML = '';
            catalog.forEach((s, idx) => {
                const hired = !!(sim.hiredStaff && sim.hiredStaff[s.id]);
                const badge = document.createElement('div');
                badge.className = 'upg-owned-badge';
                if (hired) {
                    badge.style.borderColor = '#22c55e';
                    badge.style.background = 'rgba(20, 83, 45, 0.45)';
                }
                badge.innerHTML = `
                    <span class="upg-badge-icon">${hired ? '✅' : '⚪'}</span>
                    <div class="upg-badge-text">
                        <span class="upg-badge-name">${s.name}</span>
                        <span class="upg-badge-lvl">${hired ? `HIRED ($${s.wage}/day)` : `Not Hired ($${s.wage}/day)`}</span>
                    </div>
                `;
                badge.addEventListener('click', () => {
                    this.selectStaffIndex(idx);
                });
                elHiredStrip.appendChild(badge);
            });
        }
    }

    // -------------------------------------------------------------
    // TAB: WEB3 & /boost
    // -------------------------------------------------------------
    renderWeb3Tab() {
        const web3 = window.web3Manager;
        if (!web3) return;

        // Wallet info
        const elWalletStatus = document.getElementById('web3WalletStatus');
        if (elWalletStatus) elWalletStatus.textContent = web3.connected ? 'Connected' : 'Offline / Simulated';
        const elAddr = document.getElementById('web3AddressDisplay');
        if (elAddr) elAddr.textContent = web3.address;
        const elUSDC = document.getElementById('web3USDCDisplay');
        if (elUSDC) elUSDC.textContent = `${web3.usdc.toFixed(2)} USDC`;
        const elBean = document.getElementById('web3BeanDisplay');
        if (elBean) elBean.textContent = `${web3.bean.toFixed(0)} $BEAN`;

        // Tip Jar info
        const elTipCash = document.getElementById('tipJarCashDisplay');
        if (elTipCash) elTipCash.textContent = `$${web3.tipJarCash.toFixed(2)} Cash`;

        const elTipUSDC = document.getElementById('tipJarUSDCDisplay');
        if (elTipUSDC) elTipUSDC.textContent = `${web3.tipJarUSDC.toFixed(2)} USDC`;

        // Franchise name input
        const inputName = document.getElementById('inputFranchiseName');
        if (inputName && inputName.value !== web3.franchiseName) {
            inputName.value = web3.franchiseName;
        }

        const btnConnect = document.getElementById('btnConnectWallet');
        if (btnConnect) {
            btnConnect.textContent = web3.connected ? 'Disconnect Wallet' : '🦊 Connect MetaMask / Vault';
        }

        // Boost Status
        this.updateBoostStatusUI();

        // Render NFT Gallery
        const gallery = document.getElementById('nftGalleryGrid');
        if (gallery) {
            gallery.innerHTML = '';
            if (web3.nfts.length === 0) {
                gallery.innerHTML = '<p class="empty-state">No Franchise NFTs minted yet. Achieve 10 cups sold to mint your first NFT certificate!</p>';
            } else {
                web3.nfts.forEach(nft => {
                    const card = document.createElement('div');
                    card.className = 'nft-thumb-card pixel-card';
                    card.innerHTML = `
                        <div class="nft-badge">${nft.rarity}</div>
                        <div class="nft-title">${nft.name}</div>
                        <div class="nft-stats">Day ${nft.dayMinted} | ${nft.location}</div>
                        <button class="pixel-btn btn-view-nft">🔍 View Card</button>
                    `;
                    card.querySelector('.btn-view-nft').addEventListener('click', () => {
                        this.openNFTPreview(nft);
                    });
                    gallery.appendChild(card);
                });
            }
        }
    }

    async handleConnectWallet() {
        const web3 = window.web3Manager;
        if (!web3) return;

        if (web3.connected) {
            web3.disconnectWallet();
            this.renderWeb3Tab();
            this.updateHUD();
        } else {
            const res = await web3.connectWallet();
            if (res.success) {
                alert(`Wallet Connected: ${web3.getShortAddress()} (${res.provider})`);
                this.renderWeb3Tab();
                this.updateHUD();
            }
        }
    }

    handleBoostClick() {
        const web3 = window.web3Manager;
        const sim = window.simulationModel;
        if (!web3) return;

        const res = web3.activateBoost(sim.dayNumber, true);
        if (res.success) {
            if (window.soundManager) window.soundManager.playBoost();
            alert(res.message);
            this.renderMarketingTab();
            this.renderWeb3Tab();
            this.updateHUD();
            if (window.simulationEngine && typeof window.simulationEngine.render === 'function' && window.simulationEngine.ctx) {
                window.simulationEngine.render();
            }
        } else {
            if (window.soundManager) window.soundManager.playSad();
            alert(res.message);
        }
    }

    handleMintNFT() {
        const sim = window.simulationModel;
        const web3 = window.web3Manager;
        const loc = sim.getLocations()[sim.currentLocation];

        // Profit & cups check
        if (sim.totalCupsSoldLifetime < 10) {
            if (window.soundManager) window.soundManager.playSad();
            alert('You need to serve at least 10 cups before minting your first Franchise NFT!');
            return;
        }

        const nft = web3.mintFranchiseNFT(sim.dayNumber, sim.totalCupsSoldLifetime, sim.totalRevenueLifetime, loc.name);
        if (window.soundManager) window.soundManager.playDayEnd();
        alert(`🎉 Successfully minted ${nft.name}! Rewarded +50 $BEAN tokens!`);
        this.openNFTPreview(nft);
        this.renderWeb3Tab();
        this.updateHUD();
    }

    openNFTPreview(nft) {
        const modal = document.getElementById('nftModal');
        const canvas = document.getElementById('nftCanvas');
        if (!modal || !canvas) return;

        canvas.width = 380;
        canvas.height = 490;
        window.web3Manager.drawNFTToCanvas(canvas, nft);

        const btnDownload = document.getElementById('btnDownloadNFT');
        if (btnDownload) {
            btnDownload.onclick = () => {
                const link = document.createElement('a');
                link.download = `${nft.id}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
        }

        const btnClose = document.getElementById('btnCloseNFT');
        if (btnClose) {
            btnClose.onclick = () => modal.classList.remove('active');
        }

        modal.classList.add('active');
    }

    // -------------------------------------------------------------
    // TAB: LEADERBOARD
    // -------------------------------------------------------------
    renderLeaderboardTab() {
        const container = document.getElementById('leaderboardTableBody');
        if (!container || !window.web3Manager) return;
        container.innerHTML = '';

        const ranks = window.web3Manager.getLeaderboard();
        ranks.forEach(entry => {
            const tr = document.createElement('tr');
            if (entry.isPlayer) {
                tr.className = 'leaderboard-player-row';
            }

            let rankBadge = `#${entry.rank}`;
            if (entry.rank === 1) rankBadge = `<span class="rank-gold">🥇 #1</span>`;
            else if (entry.rank === 2) rankBadge = `<span class="rank-silver">🥈 #2</span>`;
            else if (entry.rank === 3) rankBadge = `<span class="rank-bronze">🥉 #3</span>`;

            tr.innerHTML = `
                <td>${rankBadge}</td>
                <td><strong>${entry.name}</strong> ${entry.isPlayer ? '(YOU) 📍' : ''}</td>
                <td><small style="color: #94a3b8;">${entry.owner}</small></td>
                <td><small style="color: #00ffcc;">${entry.nft}</small></td>
                <td>${entry.cups.toLocaleString()}</td>
                <td>$${entry.netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>${entry.rep}% ⭐</td>
            `;
            container.appendChild(tr);
        });
    }

    // -------------------------------------------------------------
    // TAB: LEDGER / BALANCE SHEET HISTORY
    // -------------------------------------------------------------
    renderLedgerTab() {
        const sim = window.simulationModel;
        const container = document.getElementById('ledgerTableBody');
        if (!container) return;
        container.innerHTML = '';

        if (sim.ledgerHistory.length === 0) {
            container.innerHTML = '<tr><td colspan="9" class="text-center">No completed days yet. Play through Day 1 to record financial data!</td></tr>';
            return;
        }

        sim.ledgerHistory.forEach(entry => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>Day ${entry.day}</td>
                <td>${entry.location}</td>
                <td>${entry.weather.temp}°C ${entry.weather.icon}</td>
                <td>${entry.stats.cupsSold}</td>
                <td>$${entry.totalRevenue.toFixed(2)}</td>
                <td>-$${entry.totalExpenses.toFixed(2)}</td>
                <td class="${entry.netProfit >= 0 ? 'profit-positive' : 'profit-negative'}">
                    ${entry.netProfit >= 0 ? `+$${entry.netProfit.toFixed(2)}` : `-$${Math.abs(entry.netProfit).toFixed(2)}`}
                </td>
                <td style="color: ${entry.closingCash < 0 ? '#e74c3c' : '#2ecc71'};">$${entry.closingCash.toFixed(2)}</td>
                <td>${entry.avgRating > 0 ? `${entry.avgRating} ⭐` : 'N/A'}</td>
            `;
            container.appendChild(tr);
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.gameController = new GameController();
    window.gameController.init();
});

if (typeof module !== 'undefined') {
    module.exports = { GameController };
}
