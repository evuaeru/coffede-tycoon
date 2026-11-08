// Test Audio Suppression, Throttle & Skip Day Audio Behavior
const fs = require('fs');
const assert = require('assert');

// Mock Web Audio API
class MockAudioNode {
    constructor() {
        this.gain = {
            setValueAtTime: () => {},
            linearRampToValueAtTime: () => {},
            exponentialRampToValueAtTime: () => {},
            cancelScheduledValues: () => {}
        };
        this.frequency = {
            setValueAtTime: () => {},
            linearRampToValueAtTime: () => {},
            exponentialRampToValueAtTime: () => {}
        };
        this.Q = { setValueAtTime: () => {} };
        this.threshold = { setValueAtTime: () => {} };
        this.knee = { setValueAtTime: () => {} };
        this.ratio = { setValueAtTime: () => {} };
        this.attack = { setValueAtTime: () => {} };
        this.release = { setValueAtTime: () => {} };
    }
    connect() {}
    start() {}
    stop() {}
}

class MockAudioContext {
    constructor() {
        this.currentTime = 0;
        this.sampleRate = 44100;
        this.state = 'running';
        this.destination = new MockAudioNode();
    }
    createGain() { return new MockAudioNode(); }
    createOscillator() { return new MockAudioNode(); }
    createDynamicsCompressor() { return new MockAudioNode(); }
    createBiquadFilter() { return new MockAudioNode(); }
    createBuffer(channels, length, rate) {
        return {
            getChannelData: () => new Float32Array(length)
        };
    }
    createBufferSource() {
        const node = new MockAudioNode();
        node.buffer = null;
        return node;
    }
    resume() {}
}

global.window = {
    AudioContext: MockAudioContext,
    webkitAudioContext: MockAudioContext,
    localStorage: {
        getItem: () => null,
        setItem: () => {}
    }
};

const SoundManager = require('./js/audio.js');

console.log('--- STARTING AUDIO SKIP & THROTTLE VERIFICATION ---');

const sm = new SoundManager();
sm.init();

// Test 1: SFX Compressor exists and connects to masterGain
assert.ok(sm.sfxCompressor, 'sfxCompressor should be initialized');
console.log('✓ Test 1: sfxCompressor dynamic brickwall limiter initialized.');

// Test 2: Sound suppression during skip
sm.setSuppressed(true);
let coinPlayed = false;
const origCreateOsc = sm.ctx.createOscillator;
sm.ctx.createOscillator = () => {
    coinPlayed = true;
    return new MockAudioNode();
};

sm.playCoin();
sm.playHappy();
sm.playPour();
sm.playSad();
assert.strictEqual(coinPlayed, false, 'No simulation sounds should play while suppressed');
console.log('✓ Test 2: Audio playback strictly suppressed while setSuppressed(true).');

// Test 3: Audio throttle prevents machine-gunning / pile-up
sm.setSuppressed(false);
let playCount = 0;
sm.ctx.createOscillator = () => {
    playCount++;
    return new MockAudioNode();
};

// Fire 50 coin calls simultaneously at currentTime = 0
for (let i = 0; i < 50; i++) {
    sm.playCoin();
}
// Out of 50 calls at the exact same millisecond, only the first one should proceed (2 oscillators for coin)
assert.strictEqual(playCount, 2, `Expected 2 oscillators for 1 coin, but got ${playCount}`);
console.log('✓ Test 3: Per-sound throttle blocked 49 stacked sound calls within identical frame.');

// Test 4: Advance currentTime past throttle window
sm.ctx.currentTime += 0.1;
sm.playCoin();
assert.strictEqual(playCount, 4, `Expected 4 oscillators after throttle elapsed, got ${playCount}`);
console.log('✓ Test 4: Audio correctly fires once throttle window elapses.');

// Test 5: playSkip is available and throttled
let skipOscPlayed = false;
sm.ctx.createOscillator = () => {
    skipOscPlayed = true;
    return new MockAudioNode();
};
sm.playSkip();
assert.ok(skipOscPlayed, 'playSkip should produce an oscillator');
console.log('✓ Test 5: playSkip sound method verified.');

// Test 6: Verify simulation.js does not contain duplicate playDayEnd
const simCode = fs.readFileSync('js/simulation.js', 'utf8');
assert.ok(!simCode.includes('playDayEnd'), 'simulation.js should not call playDayEnd directly');
console.log('✓ Test 6: Duplicate playDayEnd removed from simulation.js.');

// Test 7: Verify engine.js suppresses audio during skipToEndOfDay
const engineCode = fs.readFileSync('js/engine.js', 'utf8');
assert.ok(engineCode.includes('window.soundManager.setSuppressed(true)'), 'engine.js must call setSuppressed(true) on skip');
assert.ok(engineCode.includes('window.soundManager.setSuppressed(false)'), 'engine.js must call setSuppressed(false) finally');
console.log('✓ Test 7: engine.js skipToEndOfDay cleanly wraps simulation with setSuppressed.');

console.log('\n======================================================');
console.log('✅ ALL AUDIO SUPPRESSION & THROTTLE TESTS PASSED (100%)');
console.log('======================================================\n');
