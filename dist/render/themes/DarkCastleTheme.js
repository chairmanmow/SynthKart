"use strict";
var DarkCastleTheme = {
    name: 'dark_castle',
    description: 'Race through the moonlit grounds of an ancient fortress',
    colors: {
        skyTop: { fg: BLACK, bg: BG_BLACK },
        skyMid: { fg: DARKGRAY, bg: BG_BLACK },
        skyHorizon: { fg: BLUE, bg: BG_BLACK },
        skyGrid: { fg: DARKGRAY, bg: BG_BLACK },
        skyGridGlow: { fg: LIGHTGRAY, bg: BG_BLACK },
        celestialCore: { fg: WHITE, bg: BG_BLACK },
        celestialGlow: { fg: LIGHTGRAY, bg: BG_BLACK },
        starBright: { fg: LIGHTGRAY, bg: BG_BLACK },
        starDim: { fg: DARKGRAY, bg: BG_BLACK },
        sceneryPrimary: { fg: DARKGRAY, bg: BG_BLACK },
        scenerySecondary: { fg: BLACK, bg: BG_BLACK },
        sceneryTertiary: { fg: BLUE, bg: BG_BLACK },
        roadSurface: { fg: DARKGRAY, bg: BG_BLACK },
        roadSurfaceAlt: { fg: BLACK, bg: BG_BLACK },
        roadStripe: { fg: LIGHTGRAY, bg: BG_BLACK },
        roadEdge: { fg: BROWN, bg: BG_BLACK },
        roadGrid: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderPrimary: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderSecondary: { fg: BROWN, bg: BG_BLACK },
        roadsideColors: {
            'tower': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'battlement': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: BLACK, bg: BG_BLACK }
            },
            'torch': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'banner': {
                primary: { fg: LIGHTRED, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'gargoyle': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'portcullis': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'gradient',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'castle_fortress',
        config: {
            towerCount: 5,
            hasTorches: true,
            parallaxSpeed: 0.08
        }
    },
    celestial: {
        type: 'moon',
        size: 3,
        positionX: 0.7,
        positionY: 0.25
    },
    stars: {
        enabled: true,
        density: 0.25,
        twinkle: true
    },
    ground: {
        type: 'cobblestone',
        primary: { fg: DARKGRAY, bg: BG_BLACK },
        secondary: { fg: BLACK, bg: BG_BLACK },
        pattern: {
            ditherDensity: 0.6,
            ditherChars: ['#', '+', GLYPH.DARK_SHADE]
        }
    },
    roadside: {
        pool: [
            { sprite: 'tower', weight: 3, side: 'both' },
            { sprite: 'battlement', weight: 4, side: 'both' },
            { sprite: 'torch', weight: 5, side: 'both' },
            { sprite: 'banner', weight: 3, side: 'both' },
            { sprite: 'gargoyle', weight: 2, side: 'both' },
            { sprite: 'portcullis', weight: 2, side: 'both' }
        ],
        spacing: 35,
        density: 1.0
    }
};
registerTheme(DarkCastleTheme);
