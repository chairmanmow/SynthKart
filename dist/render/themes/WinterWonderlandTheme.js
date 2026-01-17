"use strict";
var WinterWonderlandTheme = {
    name: 'winter_wonderland',
    description: 'Race through a magical snowy forest with sparkling ice',
    colors: {
        skyTop: { fg: BLUE, bg: BG_BLACK },
        skyMid: { fg: LIGHTCYAN, bg: BG_BLACK },
        skyHorizon: { fg: WHITE, bg: BG_BLACK },
        skyGrid: { fg: LIGHTCYAN, bg: BG_BLACK },
        skyGridGlow: { fg: WHITE, bg: BG_BLACK },
        celestialCore: { fg: WHITE, bg: BG_LIGHTGRAY },
        celestialGlow: { fg: YELLOW, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: LIGHTCYAN, bg: BG_BLACK },
        sceneryPrimary: { fg: WHITE, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTCYAN, bg: BG_BLACK },
        sceneryTertiary: { fg: LIGHTGRAY, bg: BG_BLACK },
        roadSurface: { fg: LIGHTGRAY, bg: BG_BLACK },
        roadSurfaceAlt: { fg: WHITE, bg: BG_BLACK },
        roadStripe: { fg: LIGHTRED, bg: BG_BLACK },
        roadEdge: { fg: WHITE, bg: BG_BLACK },
        roadGrid: { fg: LIGHTCYAN, bg: BG_BLACK },
        shoulderPrimary: { fg: WHITE, bg: BG_BLACK },
        shoulderSecondary: { fg: LIGHTCYAN, bg: BG_BLACK },
        roadsideColors: {
            'snowpine': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK }
            },
            'snowman': {
                primary: { fg: WHITE, bg: BG_BLACK },
                secondary: { fg: LIGHTRED, bg: BG_BLACK }
            },
            'icecrystal': {
                primary: { fg: LIGHTCYAN, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK }
            },
            'candycane': {
                primary: { fg: LIGHTRED, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK }
            },
            'snowdrift': {
                primary: { fg: WHITE, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'signpost': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'stars',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'mountains',
        config: {
            count: 5,
            minHeight: 4,
            maxHeight: 8,
            parallaxSpeed: 0.12
        }
    },
    celestial: {
        type: 'sun',
        size: 2,
        positionX: 0.3,
        positionY: 0.35
    },
    stars: {
        enabled: true,
        density: 0.5,
        twinkle: true
    },
    ground: {
        type: 'dither',
        primary: { fg: WHITE, bg: BG_BLACK },
        secondary: { fg: LIGHTCYAN, bg: BG_BLACK },
        pattern: {
            ditherDensity: 0.3,
            ditherChars: ['.', '*', GLYPH.LIGHT_SHADE, "'"]
        }
    },
    roadside: {
        pool: [
            { sprite: 'snowpine', weight: 5, side: 'both' },
            { sprite: 'snowman', weight: 2, side: 'both' },
            { sprite: 'icecrystal', weight: 2, side: 'both' },
            { sprite: 'candycane', weight: 1, side: 'both' },
            { sprite: 'snowdrift', weight: 3, side: 'both' },
            { sprite: 'signpost', weight: 1, side: 'both' }
        ],
        spacing: 45,
        density: 1.2
    }
};
registerTheme(WinterWonderlandTheme);
