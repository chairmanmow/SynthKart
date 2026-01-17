"use strict";
var CactusCanyonTheme = {
    name: 'cactus_canyon',
    description: 'Race through the scorching desert canyons of the Southwest',
    colors: {
        skyTop: { fg: BLUE, bg: BG_BLACK },
        skyMid: { fg: CYAN, bg: BG_BLACK },
        skyHorizon: { fg: YELLOW, bg: BG_BLACK },
        skyGrid: { fg: YELLOW, bg: BG_BLACK },
        skyGridGlow: { fg: BROWN, bg: BG_BLACK },
        celestialCore: { fg: YELLOW, bg: BG_BROWN },
        celestialGlow: { fg: YELLOW, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: YELLOW, bg: BG_BLACK },
        sceneryPrimary: { fg: BROWN, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTRED, bg: BG_BLACK },
        sceneryTertiary: { fg: YELLOW, bg: BG_BLACK },
        roadSurface: { fg: BROWN, bg: BG_BLACK },
        roadSurfaceAlt: { fg: YELLOW, bg: BG_BLACK },
        roadStripe: { fg: YELLOW, bg: BG_BLACK },
        roadEdge: { fg: BROWN, bg: BG_BLACK },
        roadGrid: { fg: BROWN, bg: BG_BLACK },
        shoulderPrimary: { fg: YELLOW, bg: BG_BLACK },
        shoulderSecondary: { fg: BROWN, bg: BG_BLACK },
        roadsideColors: {
            'saguaro': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: CYAN, bg: BG_BLACK }
            },
            'barrel': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: LIGHTRED, bg: BG_BLACK }
            },
            'tumbleweed': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'cowskull': {
                primary: { fg: WHITE, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'desertrock': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'westernsign': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'gradient',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'dunes',
        config: {
            count: 6,
            minHeight: 3,
            maxHeight: 6,
            parallaxSpeed: 0.1
        }
    },
    celestial: {
        type: 'sun',
        size: 3,
        positionX: 0.6,
        positionY: 0.3
    },
    stars: {
        enabled: false,
        density: 0,
        twinkle: false
    },
    ground: {
        type: 'sand',
        primary: { fg: YELLOW, bg: BG_BLACK },
        secondary: { fg: BROWN, bg: BG_BLACK },
        pattern: {
            ditherDensity: 0.35,
            ditherChars: ['.', ',', "'", GLYPH.LIGHT_SHADE, '~']
        }
    },
    roadside: {
        pool: [
            { sprite: 'saguaro', weight: 4, side: 'both' },
            { sprite: 'barrel', weight: 3, side: 'both' },
            { sprite: 'tumbleweed', weight: 2, side: 'both' },
            { sprite: 'cowskull', weight: 1, side: 'both' },
            { sprite: 'desertrock', weight: 3, side: 'both' },
            { sprite: 'westernsign', weight: 1, side: 'both' }
        ],
        spacing: 50,
        density: 0.9
    }
};
registerTheme(CactusCanyonTheme);
