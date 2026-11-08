// Coffede Tycoon - High-Fidelity Web Audio API Sound Synthesizer & Procedural BGM Engine
// Zero external audio files required, 100% self-contained, browser-safe, and rich multi-channel lounge jazz.

class SoundManager {
    constructor() {
        this.ctx = null;
        this.muted = false; // SFX mute state
        this.musicMuted = false; // BGM mute state
        this.volume = 0.6; // Master volume
        this.sfxVolume = 0.6; // SFX submaster
        this.musicVolume = 0.38; // BGM submaster
        this.initialized = false;

        // BGM Procedural Sequencer state
        this.bgmPlaying = false;
        this.bpm = 100;
        this.stepTime = (60 / this.bpm) / 4; // 16th note in seconds (~0.15s)
        this.nextStepTime = 0;
        this.currentStep = 0;
        this.bgmTimer = null;
        this.noiseBuffer = null;

        // Web Audio Graph Nodes
        this.masterGain = null;
        this.sfxGain = null;
        this.sfxCompressor = null;
        this.musicGain = null;
        this.musicCompressor = null;
        this.suppressed = false; // Global SFX suppression (e.g. during Day Skip / Fast Forward)
        this.lastSoundTime = {}; // Per-sound throttle timestamp tracker

        // Load settings from localStorage if available
        try {
            if (typeof localStorage !== 'undefined') {
                const savedMute = localStorage.getItem('coffede_muted');
                if (savedMute !== null) this.muted = (savedMute === 'true');
                const savedMusicMute = localStorage.getItem('coffede_music_muted');
                if (savedMusicMute !== null) this.musicMuted = (savedMusicMute === 'true');
                const savedVol = localStorage.getItem('coffede_vol');
                if (savedVol !== null) this.volume = parseFloat(savedVol);
            }
        } catch (e) {
            console.warn('Storage not available', e);
        }
    }

    init() {
        if (this.initialized && this.ctx) {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            return;
        }
        try {
            const AudioCtxClass = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext));
            if (AudioCtxClass) {
                this.ctx = new AudioCtxClass();

                // Master gain node
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
                this.masterGain.connect(this.ctx.destination);

                // SFX submaster gain node with hardware-grade dynamics compressor / brickwall limiter
                this.sfxGain = this.ctx.createGain();
                this.sfxGain.gain.setValueAtTime(this.muted ? 0.0001 : this.sfxVolume, this.ctx.currentTime);

                this.sfxCompressor = this.ctx.createDynamicsCompressor();
                this.sfxCompressor.threshold.setValueAtTime(-6, this.ctx.currentTime);
                this.sfxCompressor.knee.setValueAtTime(6, this.ctx.currentTime);
                this.sfxCompressor.ratio.setValueAtTime(16, this.ctx.currentTime);
                this.sfxCompressor.attack.setValueAtTime(0.001, this.ctx.currentTime);
                this.sfxCompressor.release.setValueAtTime(0.08, this.ctx.currentTime);

                this.sfxGain.connect(this.sfxCompressor);
                this.sfxCompressor.connect(this.masterGain);

                // Music submaster bus with gentle glue compressor
                this.musicGain = this.ctx.createGain();
                this.musicGain.gain.setValueAtTime(this.musicMuted ? 0.0001 : this.musicVolume, this.ctx.currentTime);

                this.musicCompressor = this.ctx.createDynamicsCompressor();
                this.musicCompressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
                this.musicCompressor.knee.setValueAtTime(10, this.ctx.currentTime);
                this.musicCompressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
                this.musicCompressor.attack.setValueAtTime(0.006, this.ctx.currentTime);
                this.musicCompressor.release.setValueAtTime(0.18, this.ctx.currentTime);

                this.musicGain.connect(this.musicCompressor);
                this.musicCompressor.connect(this.masterGain);

                // Precompute reusable white noise buffer for crisp brushed percussion
                this.createNoiseBuffer();

                this.initialized = true;
            } else {
                this.ctx = null;
            }
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    createNoiseBuffer() {
        if (!this.ctx) return;
        const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    }

    get isMusicMuted() {
        return this.musicMuted;
    }

    get isMuted() {
        return this.muted;
    }

    setMuted(muted) {
        this.muted = muted;
        if (this.sfxGain && this.ctx) {
            this.sfxGain.gain.setValueAtTime(muted ? 0.0001 : this.sfxVolume, this.ctx.currentTime);
        }
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('coffede_muted', muted);
            }
        } catch (e) {}
    }

    toggleMute() {
        this.setMuted(!this.muted);
        return this.muted;
    }

    setMusicMuted(muted) {
        this.musicMuted = muted;
        if (this.musicGain && this.ctx) {
            const now = this.ctx.currentTime;
            this.musicGain.gain.cancelScheduledValues(now);
            if (muted) {
                this.musicGain.gain.setTargetAtTime(0.0001, now, 0.08);
            } else {
                this.musicGain.gain.setTargetAtTime(this.musicVolume, now, 0.15);
                if (!this.bgmPlaying) {
                    this.startBGM();
                }
            }
        }
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('coffede_music_muted', muted);
            }
        } catch (e) {}
    }

    toggleMusic() {
        this.setMusicMuted(!this.musicMuted);
        return this.musicMuted;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('coffede_vol', this.volume);
            }
        } catch (e) {}
    }

    // Global SFX suppression (e.g. during Day Skip / Fast Forward calculation)
    setSuppressed(suppressed) {
        this.suppressed = !!suppressed;
    }

    // Per-sound intelligent throttle: prevents audio pile-up, ear-clipping & cacophony
    throttle(soundKey, minIntervalSec = 0.08) {
        if (this.muted || this.suppressed) return false;
        this.init();
        if (!this.ctx) return false;
        const now = this.ctx.currentTime;
        const last = this.lastSoundTime[soundKey];
        if (last !== undefined && (now - last) < minIntervalSec) {
            return false;
        }
        this.lastSoundTime[soundKey] = now;
        return true;
    }

    // Helper: route SFX to sfxGain node
    getSfxDestination() {
        return this.sfxGain || (this.ctx ? this.ctx.destination : null);
    }

    // =========================================================================
    // SOUND EFFECTS (SFX)
    // =========================================================================

    // Crisp UI Button Blip
    playClick() {
        if (this.muted) return;
        if (!this.throttle('click', 0.03)) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.getSfxDestination());

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // Subtle UI button/tab hover blip
    playHover() {
        if (this.muted) return;
        if (!this.throttle('hover', 0.02)) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);

        gain.gain.setValueAtTime(this.volume * 0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

        osc.connect(gain);
        gain.connect(this.getSfxDestination());

        osc.start(now);
        osc.stop(now + 0.02);
    }

    // Clean, crisp skip whoosh sound when player fast-forwards through day
    playSkip() {
        if (this.muted) return;
        if (!this.throttle('skip', 0.2)) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.14);

        gain.gain.setValueAtTime(this.volume * 0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.getSfxDestination());

        osc.start(now);
        osc.stop(now + 0.18);
    }

    // Coin Drop / Cash Register Ding
    playCoin() {
        if (!this.throttle('coin', 0.08)) return;

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        osc2.frequency.setValueAtTime(987.77, now);
        osc2.frequency.setValueAtTime(1318.51, now + 0.08);

        gain.gain.setValueAtTime(this.volume * 0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.getSfxDestination());

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
    }

    // Cash Register Cha-Ching
    playRegister() {
        if (!this.throttle('register', 0.12)) return;

        const now = this.ctx.currentTime;
        
        // Bell 1
        const bell = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(1760, now);
        bell.frequency.exponentialRampToValueAtTime(3520, now + 0.05);
        bellGain.gain.setValueAtTime(this.volume * 0.35, now);
        bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        bell.connect(bellGain);
        bellGain.connect(this.getSfxDestination());
        bell.start(now);
        bell.stop(now + 0.4);

        // Drawer mechanical slide
        const noiseBuffer = this.noiseBuffer || this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.15), this.ctx.sampleRate);
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, now + 0.05);
        filter.Q.setValueAtTime(3, now + 0.05);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(this.volume * 0.2, now + 0.05);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.getSfxDestination());

        whiteNoise.start(now + 0.05);
    }

    // Steam Hiss & Espresso Pour
    playPour() {
        if (!this.throttle('pour', 0.10)) return;

        const now = this.ctx.currentTime;
        const dur = 0.4;
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer || this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.4), this.ctx.sampleRate);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(2200, now + 0.2);
        filter.frequency.exponentialRampToValueAtTime(600, now + dur);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(this.volume * 0.22, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.getSfxDestination());

        noise.start(now);
    }

    // Ice Clink
    playIce() {
        if (!this.throttle('ice', 0.08)) return;

        const now = this.ctx.currentTime;
        [2200, 2800, 3400].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.04;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, start + 0.03);

            gain.gain.setValueAtTime(this.volume * 0.15, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.06);

            osc.connect(gain);
            gain.connect(this.getSfxDestination());

            osc.start(start);
            osc.stop(start + 0.07);
        });
    }

    // Happy customer chime (ascending C major arpeggio)
    playHappy() {
        if (!this.throttle('happy', 0.12)) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + i * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(this.volume * 0.2, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

            osc.connect(gain);
            gain.connect(this.getSfxDestination());

            osc.start(start);
            osc.stop(start + 0.15);
        });
    }

    // Sad / disappointed buzz (descending chromatic)
    playSad() {
        if (!this.throttle('sad', 0.15)) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.3);

        gain.gain.setValueAtTime(this.volume * 0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.getSfxDestination());

        osc.start(now);
        osc.stop(now + 0.35);
    }

    // Day start horn / chime
    playDayStart() {
        if (!this.throttle('dayStart', 0.4)) return;

        const now = this.ctx.currentTime;
        const notes = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + i * 0.1;
            const dur = (i === notes.length - 1) ? 0.4 : 0.12;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(this.volume * 0.28, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

            osc.connect(gain);
            gain.connect(this.getSfxDestination());

            osc.start(start);
            osc.stop(start + dur);
        });
    }

    // Day end victory fanfare
    playDayEnd() {
        if (!this.throttle('dayEnd', 0.4)) return;

        const now = this.ctx.currentTime;
        const chords = [
            { t: 0.00, notes: [523.25, 659.25, 783.99] }, // C maj
            { t: 0.15, notes: [587.33, 698.46, 880.00] }, // D min
            { t: 0.30, notes: [659.25, 783.99, 987.77] }, // E min
            { t: 0.45, notes: [783.99, 987.77, 1046.50, 1318.51] } // Final triumph
        ];

        chords.forEach(c => {
            c.notes.forEach(f => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const start = now + c.t;
                const dur = (c.t === 0.45) ? 0.6 : 0.18;

                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, start);

                gain.gain.setValueAtTime(this.volume * 0.15, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

                osc.connect(gain);
                gain.connect(this.getSfxDestination());

                osc.start(start);
                osc.stop(start + dur);
            });
        });
    }

    // Web3 /boost special hype sound (Futuristic ascending arpeggio with cosmic sparkle)
    playBoost() {
        if (!this.throttle('boost', 0.4)) return;

        const now = this.ctx.currentTime;
        const freqs = [330, 440, 554, 659, 880, 1108, 1318, 1760];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.05;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, start);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.05, start + 0.1);

            gain.gain.setValueAtTime(this.volume * 0.22, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

            osc.connect(gain);
            gain.connect(this.getSfxDestination());

            osc.start(start);
            osc.stop(start + 0.16);
        });
    }

    // =========================================================================
    // MULTI-CHANNEL PROCEDURAL BGM ENGINE (Lounge Jazz Cafe)
    // =========================================================================

    startBGM() {
        this.init();
        if (!this.ctx) return;
        if (this.bgmPlaying) return;

        this.bgmPlaying = true;
        this.currentStep = 0;
        this.nextStepTime = this.ctx.currentTime + 0.08;

        if (this.musicGain) {
            const now = this.ctx.currentTime;
            this.musicGain.gain.cancelScheduledValues(now);
            this.musicGain.gain.setValueAtTime(0.001, now);
            this.musicGain.gain.linearRampToValueAtTime(this.musicMuted ? 0.0001 : this.musicVolume, now + 0.4);
        }

        // High-precision lookahead scheduler running every 25ms
        if (this.bgmTimer) clearInterval(this.bgmTimer);
        this.bgmTimer = setInterval(() => {
            if (!this.bgmPlaying || !this.ctx) return;
            const lookahead = 0.14; // Schedule up to 140ms in advance
            while (this.nextStepTime < this.ctx.currentTime + lookahead) {
                this.scheduleStep(this.currentStep, this.nextStepTime);
                this.nextStepTime += this.stepTime;
                this.currentStep = (this.currentStep + 1) % 128; // 8 measures x 16 steps = 128
            }
        }, 25);
    }

    stopBGM() {
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
        if (this.musicGain && this.ctx) {
            const now = this.ctx.currentTime;
            this.musicGain.gain.cancelScheduledValues(now);
            this.musicGain.gain.setTargetAtTime(0.0001, now, 0.08);
        }
        this.bgmPlaying = false;
    }

    scheduleStep(step, time) {
        if (!this.ctx || !this.musicGain) return;
        const measure = Math.floor(step / 16); // 0 to 7
        const stepInMeasure = step % 16; // 0 to 15
        
        // Jazz swing: odd 16th notes are delayed slightly (~22ms)
        const isSwung = (stepInMeasure % 2 !== 0);
        const noteTime = isSwung ? (time + this.stepTime * 0.16) : time;

        // 1. DRUMS (Channel 1)
        this.scheduleDrums(stepInMeasure, noteTime);

        // 2. WALKING BASS (Channel 2)
        if (stepInMeasure % 4 === 0) {
            const beatIndex = Math.floor(stepInMeasure / 4); // 0, 1, 2, 3
            this.scheduleBass(measure, beatIndex, noteTime);
        }

        // 3. WARM RHODES CHORDS (Channel 3)
        // Syncopated rhythm: stabs on steps 2, 4, 10, 14
        if (stepInMeasure === 2 || stepInMeasure === 4 || stepInMeasure === 10 || stepInMeasure === 14) {
            this.scheduleRhodesChord(measure, stepInMeasure, noteTime);
        }

        // 4. MELODIC LEAD (Channel 4 - Vibraphone / Mellow Whistle)
        this.scheduleMelody(step, noteTime);
    }

    scheduleDrums(s, time) {
        // Closed brushed Hi-Hat on 8th notes and ghost 16ths
        if (s % 2 === 0 || s === 7 || s === 15) {
            const isAccent = (s % 4 === 0);
            const hatVol = isAccent ? 0.055 : 0.028;
            this.playHat(time, hatVol);
        }

        // Soft Warm Kick on beats 1 and 3.5 (s=0, s=10)
        if (s === 0 || s === 10) {
            this.playKick(time, s === 0 ? 0.16 : 0.11);
        }

        // Brushed Snare / Rimshot on beats 2 and 4 (s=4, s=12)
        if (s === 4 || s === 12) {
            this.playSnare(time, 0.09);
        }
    }

    playHat(time, vol) {
        if (!this.noiseBuffer) return;
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(6800, time);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(vol * this.musicVolume, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        noise.start(time);
        noise.stop(time + 0.045);
    }

    playKick(time, vol) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(105, time);
        osc.frequency.exponentialRampToValueAtTime(42, time + 0.08);

        gain.gain.setValueAtTime(vol * this.musicVolume, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 0.13);
    }

    playSnare(time, vol) {
        if (!this.noiseBuffer) return;
        // Noise body
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1900, time);
        filter.Q.setValueAtTime(2.2, time);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(vol * 0.9 * this.musicVolume, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.musicGain);

        noise.start(time);
        noise.stop(time + 0.085);

        // Gentle shell tone tap
        const tone = this.ctx.createOscillator();
        const toneGain = this.ctx.createGain();
        tone.type = 'triangle';
        tone.frequency.setValueAtTime(280, time);
        tone.frequency.exponentialRampToValueAtTime(140, time + 0.05);

        toneGain.gain.setValueAtTime(vol * 0.5 * this.musicVolume, time);
        toneGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);

        tone.connect(toneGain);
        toneGain.connect(this.musicGain);

        tone.start(time);
        tone.stop(time + 0.065);
    }

    scheduleBass(measure, beatIndex, time) {
        // Walking jazz bassline frequency table (8 measures x 4 quarter beats)
        const bassScore = [
            // Measure 0: Fmaj7 (F -> A -> C -> B)
            [87.31, 110.00, 130.81, 123.47],
            // Measure 1: Dm9 (D -> F -> A -> Ab)
            [73.42, 87.31, 110.00, 103.83],
            // Measure 2: Gm9 (G -> Bb -> D -> Db)
            [98.00, 116.54, 146.83, 138.59],
            // Measure 3: C13 (C -> E -> G -> Gb)
            [65.41, 82.41, 98.00, 92.50],
            // Measure 4: Am7 (A -> C -> E -> Eb)
            [110.00, 130.81, 164.81, 155.56],
            // Measure 5: D7b9 (D -> F# -> A -> Ab)
            [73.42, 92.50, 110.00, 103.83],
            // Measure 6: Gm7 (G -> D -> F -> F#)
            [98.00, 73.42, 87.31, 92.50],
            // Measure 7: C7 (G -> E -> C -> E)
            [98.00, 82.41, 65.41, 82.41]
        ];

        const freq = bassScore[measure % 8][beatIndex % 4];
        const dur = this.stepTime * 3.8; // Legato quarter note

        // Bass synth: Sine fundamental + soft triangle overtone through lowpass
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, time);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(240, time);

        const vol = 0.16 * this.musicVolume;
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(vol, time + 0.008);
        gain.gain.exponentialRampToValueAtTime(vol * 0.45, time + 0.16);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + dur + 0.02);
        osc2.stop(time + dur + 0.02);
    }

    scheduleRhodesChord(measure, stepInMeasure, time) {
        // Lush Neo-Soul / Jazz chords in F major (8 measures)
        const chordProgressions = [
            [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
            [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9 (D3, F3, A3, C4, E4)
            [196.00, 233.08, 293.66, 349.23, 440.00], // Gm9 (G3, Bb3, D4, F4, A4)
            [130.81, 164.81, 233.08, 293.66, 440.00], // C13 (C3, E3, Bb3, D4, A4)
            [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
            [146.83, 185.00, 261.63, 311.13, 440.00], // D7b9 (D3, F#3, C4, Eb4, A4)
            [196.00, 233.08, 293.66, 349.23], // Gm7 (G3, Bb3, D4, F4)
            [130.81, 174.61, 196.00, 233.08]  // C7sus4 (C3, F3, G3, Bb3)
        ];

        const chord = chordProgressions[measure % 8];
        const dur = (stepInMeasure === 10 || stepInMeasure === 4) ? (this.stepTime * 4.5) : (this.stepTime * 2.2);

        chord.forEach((freq, idx) => {
            // Metallic tine transient
            const tine = this.ctx.createOscillator();
            const tineGain = this.ctx.createGain();
            tine.type = 'sine';
            tine.frequency.setValueAtTime(freq * 2.76, time);

            tineGain.gain.setValueAtTime(0.015 * this.musicVolume, time);
            tineGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);

            tine.connect(tineGain);
            tineGain.connect(this.musicGain);
            tine.start(time);
            tine.stop(time + 0.08);

            // Warm Rhodes body (sine + triangle through 1300Hz lowpass)
            const body = this.ctx.createOscillator();
            const bodyFilter = this.ctx.createBiquadFilter();
            const bodyGain = this.ctx.createGain();

            body.type = idx % 2 === 0 ? 'sine' : 'triangle';
            body.frequency.setValueAtTime(freq, time);

            bodyFilter.type = 'lowpass';
            bodyFilter.frequency.setValueAtTime(1300, time);
            bodyFilter.Q.setValueAtTime(1.1, time);

            const chordVol = 0.038 * this.musicVolume;
            bodyGain.gain.setValueAtTime(0.0001, time);
            bodyGain.gain.linearRampToValueAtTime(chordVol, time + 0.012);
            bodyGain.gain.exponentialRampToValueAtTime(chordVol * 0.5, time + 0.22);
            bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

            body.connect(bodyFilter);
            bodyFilter.connect(bodyGain);
            bodyGain.connect(this.musicGain);

            body.start(time);
            body.stop(time + dur + 0.03);
        });
    }

    scheduleMelody(step, time) {
        // Lyrical, catchy lounge jazz melody across 8 measures (128 steps)
        const melodyPhrases = [
            // Phrase 1 (Measures 0-1)
            { s: 2, f: 440.00, d: 0.28 }, // A4
            { s: 6, f: 523.25, d: 0.35 }, // C5
            { s: 10, f: 587.33, d: 0.42 }, // D5
            { s: 18, f: 523.25, d: 0.26 }, // C5
            { s: 22, f: 440.00, d: 0.26 }, // A4
            { s: 26, f: 392.00, d: 0.36 }, // G4
            { s: 30, f: 349.23, d: 0.55 }, // F4

            // Phrase 2 (Measures 2-3)
            { s: 34, f: 392.00, d: 0.26 }, // G4
            { s: 38, f: 440.00, d: 0.28 }, // A4
            { s: 42, f: 523.25, d: 0.32 }, // C5
            { s: 46, f: 587.33, d: 0.32 }, // D5
            { s: 50, f: 698.46, d: 0.48 }, // F5
            { s: 56, f: 587.33, d: 0.32 }, // D5
            { s: 60, f: 523.25, d: 0.55 }, // C5

            // Phrase 3 (Measures 4-5)
            { s: 66, f: 523.25, d: 0.30 }, // C5
            { s: 70, f: 659.25, d: 0.35 }, // E5
            { s: 74, f: 587.33, d: 0.35 }, // D5
            { s: 80, f: 523.25, d: 0.28 }, // C5
            { s: 84, f: 440.00, d: 0.32 }, // A4
            { s: 88, f: 392.00, d: 0.55 }, // G4

            // Phrase 4 (Measures 6-7 - Resolution)
            { s: 98, f: 349.23, d: 0.26 }, // F4
            { s: 102, f: 392.00, d: 0.28 }, // G4
            { s: 106, f: 440.00, d: 0.35 }, // A4
            { s: 110, f: 523.25, d: 0.40 }, // C5
            { s: 116, f: 698.46, d: 0.55 }, // F5
            { s: 124, f: 349.23, d: 0.60 }  // F4
        ];

        const note = melodyPhrases.find(n => n.s === step);
        if (!note) return;

        // Vibraphone / Cozy Whistle Lead Synth
        const osc = this.ctx.createOscillator();
        const overtone = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, time);

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(note.f * 2, time);

        // Subtle vibrato LFO (5.2 Hz) fades in after 100ms
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(5.2, time);
        lfoGain.gain.setValueAtTime(0, time);
        lfoGain.gain.setValueAtTime(0, time + 0.1);
        lfoGain.gain.linearRampToValueAtTime(3.5, time + 0.25);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, time);

        const leadVol = 0.075 * this.musicVolume;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(leadVol, time + 0.016);
        gain.gain.exponentialRampToValueAtTime(leadVol * 0.45, time + note.d * 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + note.d);

        osc.connect(filter);
        overtone.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        overtone.start(time);
        lfo.start(time);

        osc.stop(time + note.d + 0.04);
        overtone.stop(time + note.d + 0.04);
        lfo.stop(time + note.d + 0.04);
    }
}

// Global Singleton Instance
if (typeof window !== 'undefined') {
    window.soundManager = new SoundManager();
} else if (typeof global !== 'undefined') {
    global.soundManager = new SoundManager();
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}

// User-gesture unlock & auto-play hook
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const unlockAudio = () => {
        if (window.soundManager) {
            window.soundManager.init();
            if (!window.soundManager.isMusicMuted && !window.soundManager.bgmPlaying) {
                window.soundManager.startBGM();
            }
        }
        ['click', 'touchstart', 'keydown'].forEach(e => document.removeEventListener(e, unlockAudio));
    };
    ['click', 'touchstart', 'keydown'].forEach(e => document.addEventListener(e, unlockAudio, { passive: true }));
}
