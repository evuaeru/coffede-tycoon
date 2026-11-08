const fs = require('fs');
const { Jimp } = require('jimp');

async function build8FramesForArchetype(archIdx) {
    console.log(`\n--- Synthesizing 8-frame walk cycle for Archetype ${archIdx} ---`);

    // Check if 4 base frames exist
    const baseFiles = [
        `assets/walk_${archIdx}_0.png`,
        `assets/walk_${archIdx}_1.png`,
        `assets/walk_${archIdx}_2.png`,
        `assets/walk_${archIdx}_3.png`
    ];

    for (const f of baseFiles) {
        if (!fs.existsSync(f)) {
            console.log(`Missing ${f}, skipping archetype ${archIdx}`);
            return;
        }
    }

    const imgC1 = await Jimp.read(baseFiles[0]); // Contact 1
    const imgP1 = await Jimp.read(baseFiles[1]); // Pass 1
    const imgC2 = await Jimp.read(baseFiles[2]); // Contact 2
    const imgP3 = await Jimp.read(baseFiles[3]); // Pass 2

    // Helper to create shifted in-between on transparent canvas
    async function createShiftedFrame(baseImg, nextImg, yOffset, blendNextWeight = 0.25) {
        const w = Math.max(baseImg.bitmap.width, nextImg.bitmap.width);
        const h = Math.max(baseImg.bitmap.height, nextImg.bitmap.height) + 6;

        const canvas = new Jimp({ width: w, height: h, color: 0x00000000 });

        // Center base image horizontally, apply vertical shift (yOffset: positive=down, negative=up)
        const baseX = Math.round((w - baseImg.bitmap.width) / 2);
        const baseY = 3 + yOffset;

        // Draw base image
        canvas.composite(baseImg, baseX, baseY);

        // Subtly blend adjacent leg stride motion without causing blur
        // by overlaying next pose at lower opacity in the lower body (legs only: y > h * 0.55)
        const nextX = Math.round((w - nextImg.bitmap.width) / 2);
        const nextY = 3;

        const legH = Math.round(nextImg.bitmap.height * 0.45);
        const legStartY = Math.round(nextImg.bitmap.height * 0.55);
        const legCrop = nextImg.clone().crop({ x: 0, y: legStartY, w: nextImg.bitmap.width, h: legH });

        // Composite partial leg silhouette with subtle weight
        canvas.composite(legCrop, nextX, nextY + legStartY, {
            opacitySource: blendNextWeight
        });

        return canvas;
    }

    // 0: Contact 1
    // 1: Recoil 1 (Down: yOffset = +3px, knee absorbing impact)
    // 2: Passing 1
    // 3: Apex 1 (Up: yOffset = -3px, toe push-off high point)
    // 4: Contact 2
    // 5: Recoil 2 (Down: yOffset = +3px, opposite knee absorbing impact)
    // 6: Passing 2
    // 7: Apex 2 (Up: yOffset = -3px, opposite toe push-off high point)

    const frame0 = imgC1;
    const frame1 = await createShiftedFrame(imgC1, imgP1, +3, 0.20);
    const frame2 = imgP1;
    const frame3 = await createShiftedFrame(imgP1, imgC2, -3, 0.20);
    const frame4 = imgC2;
    const frame5 = await createShiftedFrame(imgC2, imgP3, +3, 0.20);
    const frame6 = imgP3;
    const frame7 = await createShiftedFrame(imgP3, imgC1, -3, 0.20);

    const outFrames = [frame0, frame1, frame2, frame3, frame4, frame5, frame6, frame7];

    for (let i = 0; i < 8; i++) {
        const outName = `assets/walk_${archIdx}_${i}.png`;
        await outFrames[i].write(outName);
        console.log(`✓ Archetype ${archIdx} saved Frame ${i} -> ${outName}`);
    }
}

async function run() {
    // Archetype 0 was already sliced from real 8-frame generation.
    // For archetypes 1 through 5, generate the 8-frame sequences:
    for (let a = 1; a < 6; a++) {
        await build8FramesForArchetype(a);
    }
    console.log('\n✅ All 6 archetypes now have full 8-frame walk cycles on disk!');
}

run().catch(console.error);
