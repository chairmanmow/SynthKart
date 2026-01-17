"use strict";
var TwilightForestTheme = {
    name: 'twilight_forest',
    description: 'Enchanted forest at twilight with dual moons and dancing fireflies',
    colors: {
        skyTop: { fg: BLUE, bg: BG_BLACK },
        skyMid: { fg: CYAN, bg: BG_BLACK },
        skyHorizon: { fg: BROWN, bg: BG_BLACK },
        skyGrid: { fg: BLUE, bg: BG_BLACK },
        skyGridGlow: { fg: CYAN, bg: BG_BLACK },
        celestialCore: { fg: WHITE, bg: BG_LIGHTGRAY },
        celestialGlow: { fg: LIGHTCYAN, bg: BG_BLACK },
        starBright: { fg: YELLOW, bg: BG_BLACK },
        starDim: { fg: LIGHTGREEN, bg: BG_BLACK },
        sceneryPrimary: { fg: GREEN, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTGREEN, bg: BG_BLACK },
        sceneryTertiary: { fg: BROWN, bg: BG_BLACK },
        roadSurface: { fg: BROWN, bg: BG_BLACK },
        roadSurfaceAlt: { fg: DARKGRAY, bg: BG_BLACK },
        roadStripe: { fg: YELLOW, bg: BG_BLACK },
        roadEdge: { fg: BROWN, bg: BG_BLACK },
        roadGrid: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderPrimary: { fg: GREEN, bg: BG_BLACK },
        shoulderSecondary: { fg: BROWN, bg: BG_BLACK },
        roadsideColors: {
            'tree': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: LIGHTGREEN, bg: BG_BLACK },
                tertiary: { fg: BROWN, bg: BG_BLACK }
            },
            'rock': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'bush': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: LIGHTGREEN, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'stars',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'forest',
        config: {
            count: 8,
            minHeight: 3,
            maxHeight: 7,
            parallaxSpeed: 0.15
        }
    },
    celestial: {
        type: 'dual_moons',
        size: 3,
        positionX: 0.7,
        positionY: 0.3
    },
    stars: {
        enabled: true,
        density: 0.6,
        twinkle: true
    },
    ground: {
        type: 'grass',
        primary: { fg: GREEN, bg: BG_BLACK },
        secondary: { fg: BROWN, bg: BG_BLACK },
        pattern: {
            grassDensity: 0.4,
            grassChars: ['"', 'v', ',', "'", '.']
        }
    },
    roadside: {
        pool: [
            { sprite: 'tree', weight: 5, side: 'both' },
            { sprite: 'bush', weight: 3, side: 'both' },
            { sprite: 'rock', weight: 1, side: 'both' }
        ],
        spacing: 45,
        density: 1.4
    }
};
registerTheme(TwilightForestTheme);
