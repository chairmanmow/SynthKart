"use strict";
var SunsetBeachTheme = {
    name: 'sunset_beach',
    description: 'Tropical sunset with palm trees, warm orange skies, and beach vibes',
    colors: {
        skyTop: { fg: MAGENTA, bg: BG_BLACK },
        skyMid: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        skyHorizon: { fg: LIGHTRED, bg: BG_BLACK },
        skyGrid: { fg: LIGHTRED, bg: BG_BLACK },
        skyGridGlow: { fg: YELLOW, bg: BG_BLACK },
        celestialCore: { fg: YELLOW, bg: BG_BROWN },
        celestialGlow: { fg: BROWN, bg: BG_RED },
        starBright: { fg: YELLOW, bg: BG_BLACK },
        starDim: { fg: BROWN, bg: BG_BLACK },
        sceneryPrimary: { fg: MAGENTA, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        sceneryTertiary: { fg: CYAN, bg: BG_BLACK },
        roadSurface: { fg: BROWN, bg: BG_BLACK },
        roadSurfaceAlt: { fg: YELLOW, bg: BG_BLACK },
        roadStripe: { fg: WHITE, bg: BG_BLACK },
        roadEdge: { fg: YELLOW, bg: BG_BLACK },
        roadGrid: { fg: BROWN, bg: BG_BLACK },
        shoulderPrimary: { fg: YELLOW, bg: BG_BLACK },
        shoulderSecondary: { fg: BROWN, bg: BG_BLACK },
        roadsideColors: {
            'palm': {
                primary: { fg: LIGHTGREEN, bg: BG_BLACK },
                secondary: { fg: GREEN, bg: BG_BLACK },
                tertiary: { fg: BROWN, bg: BG_BLACK }
            },
            'umbrella': {
                primary: { fg: LIGHTRED, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'lifeguard': {
                primary: { fg: LIGHTRED, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK },
                tertiary: { fg: BROWN, bg: BG_BLACK }
            },
            'surfboard': {
                primary: { fg: LIGHTCYAN, bg: BG_BLACK },
                secondary: { fg: CYAN, bg: BG_BLACK }
            },
            'tiki': {
                primary: { fg: YELLOW, bg: BG_BLACK },
                secondary: { fg: LIGHTRED, bg: BG_BLACK },
                tertiary: { fg: BROWN, bg: BG_BLACK }
            },
            'beachhut': {
                primary: { fg: YELLOW, bg: BG_BLACK },
                secondary: { fg: BROWN, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'gradient',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'ocean',
        config: {
            count: 3,
            minHeight: 2,
            maxHeight: 4,
            parallaxSpeed: 0.2
        }
    },
    celestial: {
        type: 'sun',
        size: 4,
        positionX: 0.5,
        positionY: 0.75
    },
    stars: {
        enabled: false,
        density: 0,
        twinkle: false
    },
    ground: {
        type: 'sand',
        primary: { fg: YELLOW, bg: BG_BROWN },
        secondary: { fg: WHITE, bg: BG_BROWN }
    },
    roadside: {
        pool: [
            { sprite: 'palm', weight: 4, side: 'both' },
            { sprite: 'umbrella', weight: 3, side: 'both' },
            { sprite: 'tiki', weight: 2, side: 'both' },
            { sprite: 'surfboard', weight: 2, side: 'both' },
            { sprite: 'lifeguard', weight: 1, side: 'right' },
            { sprite: 'beachhut', weight: 1, side: 'left' }
        ],
        spacing: 55,
        density: 1.3
    }
};
registerTheme(SunsetBeachTheme);
