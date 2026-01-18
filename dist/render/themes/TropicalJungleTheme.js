"use strict";
var TropicalJungleTheme = {
    name: 'tropical_jungle',
    description: 'Race through a dense tropical rainforest teeming with life',
    colors: {
        skyTop: { fg: LIGHTCYAN, bg: BG_BLACK },
        skyMid: { fg: GREEN, bg: BG_BLACK },
        skyHorizon: { fg: LIGHTGREEN, bg: BG_BLACK },
        skyGrid: { fg: GREEN, bg: BG_BLACK },
        skyGridGlow: { fg: LIGHTGREEN, bg: BG_BLACK },
        celestialCore: { fg: YELLOW, bg: BG_GREEN },
        celestialGlow: { fg: LIGHTGREEN, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: LIGHTGREEN, bg: BG_BLACK },
        sceneryPrimary: { fg: GREEN, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTGREEN, bg: BG_BLACK },
        sceneryTertiary: { fg: BROWN, bg: BG_BLACK },
        roadSurface: { fg: BROWN, bg: BG_BLACK },
        roadSurfaceAlt: { fg: YELLOW, bg: BG_BLACK },
        roadStripe: { fg: YELLOW, bg: BG_BLACK },
        roadEdge: { fg: GREEN, bg: BG_BLACK },
        roadGrid: { fg: BROWN, bg: BG_BLACK },
        shoulderPrimary: { fg: GREEN, bg: BG_BLACK },
        shoulderSecondary: { fg: LIGHTGREEN, bg: BG_BLACK },
        roadsideColors: {
            'jungle_tree': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: BROWN, bg: BG_BLACK }
            },
            'fern': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: LIGHTGREEN, bg: BG_BLACK }
            },
            'vine': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: LIGHTMAGENTA, bg: BG_BLACK }
            },
            'flower': {
                primary: { fg: LIGHTMAGENTA, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'parrot': {
                primary: { fg: LIGHTRED, bg: BG_BLACK },
                secondary: { fg: LIGHTBLUE, bg: BG_BLACK }
            },
            'banana': {
                primary: { fg: GREEN, bg: BG_BLACK },
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
        type: 'jungle_canopy',
        config: {
            vineCount: 8,
            hangingVines: true,
            parallaxSpeed: 0.08
        }
    },
    celestial: {
        type: 'sun',
        size: 2,
        positionX: 0.4,
        positionY: 0.2
    },
    stars: {
        enabled: false,
        density: 0,
        twinkle: false
    },
    ground: {
        type: 'jungle',
        primary: { fg: GREEN, bg: BG_BLACK },
        secondary: { fg: BROWN, bg: BG_BLACK },
        pattern: {
            grassDensity: 0.7,
            grassChars: ['"', 'v', 'V', 'Y', ',']
        }
    },
    roadside: {
        pool: [
            { sprite: 'jungle_tree', weight: 5, side: 'both' },
            { sprite: 'fern', weight: 4, side: 'both' },
            { sprite: 'vine', weight: 3, side: 'both' },
            { sprite: 'flower', weight: 3, side: 'both' },
            { sprite: 'parrot', weight: 1, side: 'both' },
            { sprite: 'banana', weight: 2, side: 'both' }
        ],
        spacing: 35,
        density: 1.4
    }
};
registerTheme(TropicalJungleTheme);
