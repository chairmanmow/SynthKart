"use strict";
var GlitchState = {
    intensity: 0.3,
    intensityTarget: 0.3,
    wavePhase: 0,
    lastSpikeTime: 0,
    colorCorruptPhase: 0,
    tearOffset: 0,
    noiseRows: [],
    skyGlitchType: 0,
    skyGlitchTimer: 0,
    matrixRainDrops: [],
    roadColorGlitch: 0,
    roadGlitchTimer: 0,
    roadsideColorShift: 0,
    update: function (trackPosition, dt) {
        this.wavePhase += dt * 2;
        var baseIntensity = 0.2 + Math.sin(this.wavePhase) * 0.1;
        if (Math.random() < 0.02) {
            this.intensityTarget = 0.6 + Math.random() * 0.4;
            this.lastSpikeTime = trackPosition;
        }
        if (this.intensityTarget > baseIntensity) {
            this.intensityTarget -= dt * 0.5;
        }
        this.intensity += (this.intensityTarget - this.intensity) * dt * 5;
        if (Math.random() < this.intensity * 0.1) {
            this.colorCorruptPhase = Math.floor(Math.random() * 6);
        }
        if (Math.random() < this.intensity * 0.15) {
            this.tearOffset = Math.floor(Math.random() * 8) - 4;
        }
        else if (Math.random() < 0.3) {
            this.tearOffset = 0;
        }
        if (Math.random() < this.intensity * 0.2) {
            this.noiseRows = [];
            var numNoiseRows = Math.floor(Math.random() * 3 * this.intensity);
            for (var i = 0; i < numNoiseRows; i++) {
                this.noiseRows.push(Math.floor(Math.random() * 25));
            }
        }
        else if (Math.random() < 0.2) {
            this.noiseRows = [];
        }
        this.skyGlitchTimer -= dt;
        if (this.skyGlitchTimer <= 0) {
            if (Math.random() < this.intensity * 0.08) {
                this.skyGlitchType = Math.floor(Math.random() * 5);
                this.skyGlitchTimer = 0.5 + Math.random() * 2.0;
                if (this.skyGlitchType === 1) {
                    this.matrixRainDrops = [];
                    for (var r = 0; r < 15; r++) {
                        this.matrixRainDrops.push({
                            x: Math.floor(Math.random() * 80),
                            y: Math.floor(Math.random() * 8),
                            speed: 0.5 + Math.random() * 1.5,
                            char: String.fromCharCode(48 + Math.floor(Math.random() * 10))
                        });
                    }
                }
            }
            else {
                this.skyGlitchType = 0;
            }
        }
        if (this.skyGlitchType === 1) {
            for (var d = 0; d < this.matrixRainDrops.length; d++) {
                var drop = this.matrixRainDrops[d];
                drop.y += drop.speed * dt * 10;
                if (drop.y > 8) {
                    drop.y = 0;
                    drop.x = Math.floor(Math.random() * 80);
                    drop.char = String.fromCharCode(48 + Math.floor(Math.random() * 10));
                }
                if (Math.random() < 0.1) {
                    drop.char = String.fromCharCode(48 + Math.floor(Math.random() * 10));
                }
            }
        }
        this.roadGlitchTimer -= dt;
        if (this.roadGlitchTimer <= 0) {
            if (Math.random() < this.intensity * 0.12) {
                this.roadColorGlitch = 1 + Math.floor(Math.random() * 4);
                this.roadGlitchTimer = 0.3 + Math.random() * 1.5;
            }
            else {
                this.roadColorGlitch = 0;
            }
        }
        if (Math.random() < this.intensity * 0.15) {
            this.roadsideColorShift = Math.floor(Math.random() * 8);
        }
        else if (Math.random() < 0.1) {
            this.roadsideColorShift = 0;
        }
    },
    corruptColor: function (originalFg, originalBg) {
        if (Math.random() > this.intensity * 0.5) {
            return { fg: originalFg, bg: originalBg };
        }
        switch (this.colorCorruptPhase) {
            case 0:
                return { fg: 15 - originalFg, bg: originalBg };
            case 1:
                return { fg: originalBg & 0x07, bg: (originalFg << 4) & 0x70 };
            case 2:
                return { fg: (originalFg + 8) % 16, bg: originalBg };
            case 3:
                return { fg: LIGHTGREEN, bg: BG_BLACK };
            case 4:
                return { fg: LIGHTCYAN, bg: BG_BLACK };
            case 5:
                return { fg: LIGHTRED, bg: BG_BLACK };
            default:
                return { fg: originalFg, bg: originalBg };
        }
    },
    corruptChar: function (original) {
        if (Math.random() > this.intensity * 0.3) {
            return original;
        }
        var glitchChars = [
            GLYPH.FULL_BLOCK, GLYPH.DARK_SHADE, GLYPH.MEDIUM_SHADE, GLYPH.LIGHT_SHADE,
            '#', '@', '%', '&', '$', '!', '?', '/', '\\', '|',
            GLYPH.BOX_H, GLYPH.BOX_V, GLYPH.BOX_TR, GLYPH.BOX_TL,
            '0', '1', 'X', 'x', '>', '<', '^', 'v'
        ];
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
    },
    isNoiseRow: function (row) {
        for (var i = 0; i < this.noiseRows.length; i++) {
            if (this.noiseRows[i] === row)
                return true;
        }
        return false;
    },
    getNoiseChar: function () {
        var noiseChars = [GLYPH.LIGHT_SHADE, GLYPH.MEDIUM_SHADE, GLYPH.DARK_SHADE, ' ', '#', '%'];
        return noiseChars[Math.floor(Math.random() * noiseChars.length)];
    },
    getTearOffset: function (row) {
        if (row > 8 && row < 18 && Math.abs(this.tearOffset) > 0) {
            return this.tearOffset;
        }
        return 0;
    },
    getGlitchedRoadColor: function (baseFg, baseBg, distance) {
        if (this.roadColorGlitch === 0) {
            return { fg: baseFg, bg: baseBg };
        }
        switch (this.roadColorGlitch) {
            case 1:
                return { fg: 15 - baseFg, bg: ((baseBg >> 4) ^ 0x07) << 4 };
            case 2:
                var rainbowColors = [LIGHTRED, YELLOW, LIGHTGREEN, LIGHTCYAN, LIGHTBLUE, LIGHTMAGENTA];
                var colorIndex = Math.floor(distance + (this.wavePhase * 3)) % rainbowColors.length;
                return { fg: rainbowColors[colorIndex], bg: BG_BLACK };
            case 3:
                var flash = Math.floor(Date.now() / 50) % 2;
                return flash === 0 ? { fg: WHITE, bg: BG_BLACK } : { fg: BLACK, bg: BG_LIGHTGRAY };
            case 4:
                if (Math.random() < 0.3) {
                    return { fg: Math.floor(Math.random() * 16), bg: [BG_BLACK, BG_GREEN, BG_CYAN, BG_RED][Math.floor(Math.random() * 4)] };
                }
                return { fg: baseFg, bg: baseBg };
            default:
                return { fg: baseFg, bg: baseBg };
        }
    },
    getGlitchedSpriteColor: function (baseFg, baseBg) {
        if (this.roadsideColorShift === 0 || Math.random() > this.intensity * 0.7) {
            return { fg: baseFg, bg: baseBg };
        }
        var shiftedFg = (baseFg + this.roadsideColorShift) % 16;
        var shiftedBg = baseBg;
        if (Math.random() < 0.2) {
            shiftedBg = [BG_BLACK, BG_GREEN, BG_BLUE, BG_CYAN][Math.floor(Math.random() * 4)];
        }
        return { fg: shiftedFg, bg: shiftedBg };
    }
};
var GlitchTheme = {
    name: 'glitch_circuit',
    description: 'Reality is corrupted. The simulation is breaking down.',
    colors: {
        skyTop: { fg: BLACK, bg: BG_BLACK },
        skyMid: { fg: DARKGRAY, bg: BG_BLACK },
        skyHorizon: { fg: LIGHTGREEN, bg: BG_BLACK },
        skyGrid: { fg: GREEN, bg: BG_BLACK },
        skyGridGlow: { fg: LIGHTGREEN, bg: BG_BLACK },
        celestialCore: { fg: WHITE, bg: BG_GREEN },
        celestialGlow: { fg: LIGHTGREEN, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: GREEN, bg: BG_BLACK },
        sceneryPrimary: { fg: GREEN, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTGREEN, bg: BG_BLACK },
        sceneryTertiary: { fg: WHITE, bg: BG_BLACK },
        roadSurface: { fg: DARKGRAY, bg: BG_BLACK },
        roadSurfaceAlt: { fg: GREEN, bg: BG_BLACK },
        roadStripe: { fg: LIGHTGREEN, bg: BG_BLACK },
        roadEdge: { fg: LIGHTCYAN, bg: BG_BLACK },
        roadGrid: { fg: GREEN, bg: BG_BLACK },
        shoulderPrimary: { fg: GREEN, bg: BG_BLACK },
        shoulderSecondary: { fg: DARKGRAY, bg: BG_BLACK }
    },
    sky: {
        type: 'grid',
        gridDensity: 8,
        converging: true,
        horizontal: true
    },
    background: {
        type: 'mountains',
        config: {
            count: 5,
            minHeight: 3,
            maxHeight: 7,
            parallaxSpeed: 0.08
        }
    },
    celestial: {
        type: 'sun',
        size: 3,
        positionX: 0.5,
        positionY: 0.4
    },
    stars: {
        enabled: true,
        density: 0.3,
        twinkle: true
    },
    ground: {
        type: 'void',
        primary: { fg: GREEN, bg: BG_BLACK },
        secondary: { fg: LIGHTGREEN, bg: BG_BLACK },
        pattern: {
            gridSpacing: 4,
            gridChar: '+'
        }
    },
    roadside: {
        pool: [
            { sprite: 'building', weight: 1, side: 'both' },
            { sprite: 'lamppost', weight: 1, side: 'both' },
            { sprite: 'palm', weight: 1, side: 'both' },
            { sprite: 'umbrella', weight: 1, side: 'both' },
            { sprite: 'tree', weight: 1, side: 'both' },
            { sprite: 'gravestone', weight: 1, side: 'both' },
            { sprite: 'deadtree', weight: 1, side: 'both' },
            { sprite: 'pumpkin', weight: 1, side: 'both' },
            { sprite: 'snowpine', weight: 1, side: 'both' },
            { sprite: 'snowman', weight: 1, side: 'both' },
            { sprite: 'saguaro', weight: 1, side: 'both' },
            { sprite: 'cowskull', weight: 1, side: 'both' },
            { sprite: 'jungle_tree', weight: 1, side: 'both' },
            { sprite: 'fern', weight: 1, side: 'both' },
            { sprite: 'lollipop', weight: 1, side: 'both' },
            { sprite: 'candy_cane', weight: 1, side: 'both' },
            { sprite: 'gummy_bear', weight: 1, side: 'both' },
            { sprite: 'planet', weight: 1, side: 'both' },
            { sprite: 'satellite', weight: 1, side: 'both' },
            { sprite: 'torch', weight: 1, side: 'both' },
            { sprite: 'tower', weight: 1, side: 'both' },
            { sprite: 'flame', weight: 1, side: 'both' },
            { sprite: 'skull_pile', weight: 1, side: 'both' },
            { sprite: 'column', weight: 1, side: 'both' },
            { sprite: 'obelisk', weight: 1, side: 'both' },
            { sprite: 'sphinx', weight: 1, side: 'both' },
            { sprite: 'tire_stack', weight: 1, side: 'both' },
            { sprite: 'hay_bale', weight: 1, side: 'both' }
        ],
        spacing: 35,
        density: 1.2
    }
};
registerTheme(GlitchTheme);
