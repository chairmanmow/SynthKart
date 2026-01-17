"use strict";
var SynthwaveTheme = {
    name: 'synthwave',
    description: 'Classic 80s synthwave with magenta sky, purple mountains, and setting sun',
    colors: {
        skyTop: { fg: MAGENTA, bg: BG_BLACK },
        skyMid: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        skyHorizon: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        skyGrid: { fg: MAGENTA, bg: BG_BLACK },
        skyGridGlow: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        celestialCore: { fg: YELLOW, bg: BG_RED },
        celestialGlow: { fg: LIGHTRED, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: LIGHTGRAY, bg: BG_BLACK },
        sceneryPrimary: { fg: MAGENTA, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        sceneryTertiary: { fg: WHITE, bg: BG_BLACK },
        roadSurface: { fg: CYAN, bg: BG_BLACK },
        roadSurfaceAlt: { fg: LIGHTCYAN, bg: BG_BLACK },
        roadStripe: { fg: WHITE, bg: BG_BLACK },
        roadEdge: { fg: LIGHTRED, bg: BG_BLACK },
        roadGrid: { fg: CYAN, bg: BG_BLACK },
        shoulderPrimary: { fg: BROWN, bg: BG_BLACK },
        shoulderSecondary: { fg: BROWN, bg: BG_BLACK },
        roadsideColors: {
            'tree': {
                primary: { fg: LIGHTGREEN, bg: BG_BLACK },
                secondary: { fg: GREEN, bg: BG_BLACK },
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
        type: 'grid',
        converging: true,
        horizontal: true
    },
    background: {
        type: 'mountains',
        config: {
            count: 5,
            minHeight: 3,
            maxHeight: 6,
            parallaxSpeed: 0.1
        }
    },
    celestial: {
        type: 'sun',
        size: 3,
        positionX: 0.5,
        positionY: 0.6
    },
    stars: {
        enabled: false,
        density: 0,
        twinkle: false
    },
    ground: {
        type: 'grid',
        primary: { fg: MAGENTA, bg: BG_BLACK },
        secondary: { fg: CYAN, bg: BG_BLACK },
        pattern: {
            gridSpacing: 15,
            radialLines: 10
        }
    },
    roadside: {
        pool: [
            { sprite: 'tree', weight: 3, side: 'both' },
            { sprite: 'rock', weight: 2, side: 'both' },
            { sprite: 'bush', weight: 2, side: 'both' }
        ],
        spacing: 10,
        density: 1.0
    }
};
registerTheme(SynthwaveTheme);
