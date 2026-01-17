"use strict";
var HauntedHollowTheme = {
    name: 'haunted_hollow',
    description: 'Race through a haunted cemetery under a blood moon',
    colors: {
        skyTop: { fg: BLACK, bg: BG_BLACK },
        skyMid: { fg: DARKGRAY, bg: BG_BLACK },
        skyHorizon: { fg: MAGENTA, bg: BG_BLACK },
        skyGrid: { fg: DARKGRAY, bg: BG_BLACK },
        skyGridGlow: { fg: MAGENTA, bg: BG_BLACK },
        celestialCore: { fg: RED, bg: BG_BLACK },
        celestialGlow: { fg: LIGHTRED, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: DARKGRAY, bg: BG_BLACK },
        sceneryPrimary: { fg: BLACK, bg: BG_BLACK },
        scenerySecondary: { fg: DARKGRAY, bg: BG_BLACK },
        sceneryTertiary: { fg: MAGENTA, bg: BG_BLACK },
        roadSurface: { fg: DARKGRAY, bg: BG_BLACK },
        roadSurfaceAlt: { fg: BLACK, bg: BG_BLACK },
        roadStripe: { fg: LIGHTRED, bg: BG_BLACK },
        roadEdge: { fg: DARKGRAY, bg: BG_BLACK },
        roadGrid: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderPrimary: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderSecondary: { fg: GREEN, bg: BG_BLACK },
        roadsideColors: {
            'deadtree': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            },
            'gravestone': {
                primary: { fg: LIGHTGRAY, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            },
            'pumpkin': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'skull': {
                primary: { fg: WHITE, bg: BG_BLACK },
                secondary: { fg: BROWN, bg: BG_BLACK }
            },
            'fence': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'candle': {
                primary: { fg: YELLOW, bg: BG_BLACK },
                secondary: { fg: BROWN, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'stars',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'hills',
        config: {
            count: 6,
            minHeight: 2,
            maxHeight: 5,
            parallaxSpeed: 0.1
        }
    },
    celestial: {
        type: 'moon',
        size: 4,
        positionX: 0.5,
        positionY: 0.25
    },
    stars: {
        enabled: true,
        density: 0.3,
        twinkle: true
    },
    ground: {
        type: 'dither',
        primary: { fg: DARKGRAY, bg: BG_BLACK },
        secondary: { fg: GREEN, bg: BG_BLACK },
        pattern: {
            ditherDensity: 0.4,
            ditherChars: ['.', ',', "'", GLYPH.LIGHT_SHADE]
        }
    },
    roadside: {
        pool: [
            { sprite: 'deadtree', weight: 4, side: 'both' },
            { sprite: 'gravestone', weight: 5, side: 'both' },
            { sprite: 'pumpkin', weight: 2, side: 'both' },
            { sprite: 'skull', weight: 1, side: 'both' },
            { sprite: 'fence', weight: 3, side: 'both' },
            { sprite: 'candle', weight: 2, side: 'both' }
        ],
        spacing: 40,
        density: 1.3
    }
};
registerTheme(HauntedHollowTheme);
