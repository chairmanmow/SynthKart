"use strict";
var AncientRuinsTheme = {
    name: 'ancient_ruins',
    description: 'Discover the secrets of ancient Egypt at high speed',
    colors: {
        skyTop: { fg: CYAN, bg: BG_BLACK },
        skyMid: { fg: YELLOW, bg: BG_BLACK },
        skyHorizon: { fg: WHITE, bg: BG_BLACK },
        skyGrid: { fg: YELLOW, bg: BG_BLACK },
        skyGridGlow: { fg: WHITE, bg: BG_BLACK },
        celestialCore: { fg: WHITE, bg: BG_BROWN },
        celestialGlow: { fg: YELLOW, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: YELLOW, bg: BG_BLACK },
        sceneryPrimary: { fg: BROWN, bg: BG_BLACK },
        scenerySecondary: { fg: YELLOW, bg: BG_BLACK },
        sceneryTertiary: { fg: WHITE, bg: BG_BLACK },
        roadSurface: { fg: BROWN, bg: BG_BLACK },
        roadSurfaceAlt: { fg: YELLOW, bg: BG_BLACK },
        roadStripe: { fg: WHITE, bg: BG_BLACK },
        roadEdge: { fg: LIGHTGRAY, bg: BG_BLACK },
        roadGrid: { fg: YELLOW, bg: BG_BLACK },
        shoulderPrimary: { fg: YELLOW, bg: BG_BLACK },
        shoulderSecondary: { fg: BROWN, bg: BG_BLACK },
        roadsideColors: {
            'column': {
                primary: { fg: WHITE, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'statue': {
                primary: { fg: YELLOW, bg: BG_BLACK },
                secondary: { fg: BROWN, bg: BG_BLACK }
            },
            'obelisk': {
                primary: { fg: LIGHTGRAY, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'sphinx': {
                primary: { fg: YELLOW, bg: BG_BLACK },
                secondary: { fg: BROWN, bg: BG_BLACK }
            },
            'hieroglyph': {
                primary: { fg: YELLOW, bg: BG_BLACK },
                secondary: { fg: LIGHTCYAN, bg: BG_BLACK }
            },
            'scarab': {
                primary: { fg: LIGHTGREEN, bg: BG_BLACK },
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
        type: 'pyramids',
        config: {
            pyramidCount: 3,
            hasSphinx: true,
            parallaxSpeed: 0.06
        }
    },
    celestial: {
        type: 'sun',
        size: 4,
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
            ditherChars: ['.', "'", '~', GLYPH.LIGHT_SHADE]
        }
    },
    roadside: {
        pool: [
            { sprite: 'column', weight: 4, side: 'both' },
            { sprite: 'statue', weight: 3, side: 'both' },
            { sprite: 'obelisk', weight: 3, side: 'both' },
            { sprite: 'sphinx', weight: 2, side: 'both' },
            { sprite: 'hieroglyph', weight: 3, side: 'both' },
            { sprite: 'scarab', weight: 2, side: 'both' }
        ],
        spacing: 45,
        density: 0.9
    }
};
registerTheme(AncientRuinsTheme);
