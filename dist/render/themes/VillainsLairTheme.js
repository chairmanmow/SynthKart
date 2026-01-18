"use strict";
var VillainsLairTheme = {
    name: 'villains_lair',
    description: 'Speed through the fiery domain of a supervillain',
    colors: {
        skyTop: { fg: BLACK, bg: BG_BLACK },
        skyMid: { fg: RED, bg: BG_BLACK },
        skyHorizon: { fg: YELLOW, bg: BG_BLACK },
        skyGrid: { fg: RED, bg: BG_BLACK },
        skyGridGlow: { fg: YELLOW, bg: BG_BLACK },
        celestialCore: { fg: YELLOW, bg: BG_RED },
        celestialGlow: { fg: RED, bg: BG_BLACK },
        starBright: { fg: YELLOW, bg: BG_BLACK },
        starDim: { fg: RED, bg: BG_BLACK },
        sceneryPrimary: { fg: DARKGRAY, bg: BG_BLACK },
        scenerySecondary: { fg: RED, bg: BG_BLACK },
        sceneryTertiary: { fg: YELLOW, bg: BG_BLACK },
        roadSurface: { fg: DARKGRAY, bg: BG_BLACK },
        roadSurfaceAlt: { fg: BLACK, bg: BG_BLACK },
        roadStripe: { fg: RED, bg: BG_BLACK },
        roadEdge: { fg: YELLOW, bg: BG_BLACK },
        roadGrid: { fg: RED, bg: BG_BLACK },
        shoulderPrimary: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderSecondary: { fg: RED, bg: BG_BLACK },
        roadsideColors: {
            'lava_rock': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: RED, bg: BG_BLACK }
            },
            'flame': {
                primary: { fg: YELLOW, bg: BG_BLACK },
                secondary: { fg: RED, bg: BG_BLACK }
            },
            'skull_pile': {
                primary: { fg: WHITE, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'chain': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'spike': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: RED, bg: BG_BLACK }
            },
            'cauldron': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: LIGHTGREEN, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'gradient',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'volcanic',
        config: {
            lavaGlow: true,
            smokeLevel: 2,
            parallaxSpeed: 0.1
        }
    },
    celestial: {
        type: 'sun',
        size: 5,
        positionX: 0.5,
        positionY: 0.6
    },
    stars: {
        enabled: true,
        density: 0.35,
        twinkle: true
    },
    ground: {
        type: 'lava',
        primary: { fg: DARKGRAY, bg: BG_BLACK },
        secondary: { fg: YELLOW, bg: BG_BLACK },
        pattern: {
            ditherDensity: 0.5,
            ditherChars: ['*', '~', GLYPH.MEDIUM_SHADE]
        }
    },
    roadside: {
        pool: [
            { sprite: 'lava_rock', weight: 4, side: 'both' },
            { sprite: 'flame', weight: 5, side: 'both' },
            { sprite: 'skull_pile', weight: 3, side: 'both' },
            { sprite: 'chain', weight: 2, side: 'both' },
            { sprite: 'spike', weight: 3, side: 'both' },
            { sprite: 'cauldron', weight: 2, side: 'both' }
        ],
        spacing: 35,
        density: 1.1
    }
};
registerTheme(VillainsLairTheme);
