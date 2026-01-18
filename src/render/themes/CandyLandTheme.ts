/**
 * CandyLandTheme.ts - Sweet fantasy racing through a world of candy.
 * Pastel skies, candy cane forests, and sugary treats everywhere.
 */

var CandyLandTheme: Theme = {
  name: 'candy_land',
  description: 'Race through a magical world made entirely of sweets and candy',
  
  colors: {
    // Cotton candy sky
    skyTop: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    skyMid: { fg: LIGHTCYAN, bg: BG_BLACK },
    skyHorizon: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    
    // Sparkly candy atmosphere
    skyGrid: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    skyGridGlow: { fg: WHITE, bg: BG_BLACK },
    
    // Gumdrop sun
    celestialCore: { fg: YELLOW, bg: BG_MAGENTA },
    celestialGlow: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    
    // Sparkle stars
    starBright: { fg: WHITE, bg: BG_BLACK },
    starDim: { fg: LIGHTCYAN, bg: BG_BLACK },
    
    // Candy mountain background
    sceneryPrimary: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    scenerySecondary: { fg: LIGHTCYAN, bg: BG_BLACK },
    sceneryTertiary: { fg: WHITE, bg: BG_BLACK },
    
    // Frosting road
    roadSurface: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    roadSurfaceAlt: { fg: MAGENTA, bg: BG_BLACK },
    roadStripe: { fg: WHITE, bg: BG_BLACK },
    roadEdge: { fg: LIGHTCYAN, bg: BG_BLACK },
    roadGrid: { fg: MAGENTA, bg: BG_BLACK },
    
    // Sugar grass
    shoulderPrimary: { fg: LIGHTGREEN, bg: BG_BLACK },
    shoulderSecondary: { fg: LIGHTCYAN, bg: BG_BLACK },
    
    // Roadside colors - candy palette
    roadsideColors: {
      'lollipop': {
        primary: { fg: LIGHTRED, bg: BG_BLACK },
        secondary: { fg: WHITE, bg: BG_BLACK }
      },
      'candy_cane': {
        primary: { fg: LIGHTRED, bg: BG_BLACK },
        secondary: { fg: WHITE, bg: BG_BLACK }
      },
      'gummy_bear': {
        primary: { fg: LIGHTGREEN, bg: BG_BLACK },
        secondary: { fg: GREEN, bg: BG_BLACK }
      },
      'cupcake': {
        primary: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        secondary: { fg: LIGHTRED, bg: BG_BLACK }
      },
      'ice_cream': {
        primary: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        secondary: { fg: BROWN, bg: BG_BLACK }
      },
      'cotton_candy': {
        primary: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        secondary: { fg: LIGHTCYAN, bg: BG_BLACK }
      }
    }
  },
  
  // Sparkly gradient sky
  sky: {
    type: 'stars',
    converging: false,
    horizontal: false
  },
  
  // Whimsical candy hills - rounded and colorful
  background: {
    type: 'candy_hills',
    config: {
      swirls: true,
      parallaxSpeed: 0.12
    }
  },
  
  // Bright candy sun
  celestial: {
    type: 'sun',
    size: 3,
    positionX: 0.5,
    positionY: 0.3
  },
  
  // Sparkle stars (even during day for magic)
  stars: {
    enabled: true,
    density: 0.4,
    twinkle: true
  },
  
  // Frosted candy ground with sprinkles
  ground: {
    type: 'candy',
    primary: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    secondary: { fg: LIGHTCYAN, bg: BG_BLACK },
    pattern: {
      ditherDensity: 0.4,
      ditherChars: ['*', '@', '.', '~']
    }
  },
  
  // Candy-filled roadside
  roadside: {
    pool: [
      { sprite: 'lollipop', weight: 4, side: 'both' },
      { sprite: 'candy_cane', weight: 4, side: 'both' },
      { sprite: 'gummy_bear', weight: 2, side: 'both' },
      { sprite: 'cupcake', weight: 3, side: 'both' },
      { sprite: 'ice_cream', weight: 2, side: 'both' },
      { sprite: 'cotton_candy', weight: 3, side: 'both' }
    ],
    spacing: 40,
    density: 1.2
  }
};

registerTheme(CandyLandTheme);
