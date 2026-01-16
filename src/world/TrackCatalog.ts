/**
 * TrackCatalog - Modular track definition system.
 *
 * Tracks are defined with:
 * - Geometry (segments, curves, length)
 * - Aesthetics (theme, colors, scenery types)
 * - Metadata (name, difficulty, lap count)
 */

// ============================================================
// TRACK THEME DEFINITIONS
// ============================================================

/**
 * Visual theme for a track - defines colors and scenery types.
 */
interface TrackTheme {
  /** Theme identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Sky colors */
  sky: {
    top: ColorDef;
    horizon: ColorDef;
    gridColor: ColorDef;
  };
  
  /** Sun/moon appearance */
  sun: {
    color: ColorDef;
    glowColor: ColorDef;
    position: number;  // 0-1, position on horizon
  };
  
  /** Road colors */
  road: {
    surface: ColorDef;
    stripe: ColorDef;
    edge: ColorDef;
    grid: ColorDef;
  };
  
  /** Off-road scenery */
  offroad: {
    groundColor: ColorDef;
    sceneryTypes: string[];  // e.g., ['palm_tree', 'rock', 'cactus']
    sceneryDensity: number;  // 0-1
  };
  
  /** Background elements */
  background: {
    type: string;  // 'mountains', 'city', 'ocean', 'forest'
    color: ColorDef;
    highlightColor: ColorDef;
  };
}

/**
 * Color definition - uses Synchronet color constants.
 */
interface ColorDef {
  fg: number;
  bg: number;
}

// ============================================================
// TRACK DEFINITION
// ============================================================

/**
 * Complete track definition.
 */
interface TrackDefinition {
  /** Unique identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Description shown in selector */
  description: string;
  
  /** Difficulty rating (1-5 stars) */
  difficulty: number;
  
  /** Number of laps */
  laps: number;
  
  /** Theme ID to use */
  themeId: string;
  
  /** Road geometry - array of section definitions */
  sections: TrackSection[];
  
  /** Estimated time to complete one lap (seconds) - for display */
  estimatedLapTime: number;
}

/**
 * A section of track geometry.
 */
interface TrackSection {
  /** Section type */
  type: 'straight' | 'curve' | 'ease_in' | 'ease_out' | 's_curve';
  
  /** Number of segments */
  length: number;
  
  /** Curvature for curves (-1 to 1) */
  curve?: number;
  
  /** Target curve for ease_in */
  targetCurve?: number;
}

// ============================================================
// PREDEFINED THEMES
// ============================================================

var TRACK_THEMES: { [id: string]: TrackTheme } = {
  'synthwave': {
    id: 'synthwave',
    name: 'Synthwave Sunset',
    sky: {
      top: { fg: MAGENTA, bg: BG_BLACK },
      horizon: { fg: LIGHTMAGENTA, bg: BG_BLACK },
      gridColor: { fg: MAGENTA, bg: BG_BLACK }
    },
    sun: {
      color: { fg: YELLOW, bg: BG_RED },
      glowColor: { fg: LIGHTRED, bg: BG_BLACK },
      position: 0.5
    },
    road: {
      surface: { fg: CYAN, bg: BG_BLACK },
      stripe: { fg: WHITE, bg: BG_BLACK },
      edge: { fg: LIGHTRED, bg: BG_BLACK },
      grid: { fg: CYAN, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: BROWN, bg: BG_BLACK },
      sceneryTypes: ['palm_tree', 'rock', 'grass'],
      sceneryDensity: 0.15
    },
    background: {
      type: 'mountains',
      color: { fg: MAGENTA, bg: BG_BLACK },
      highlightColor: { fg: LIGHTMAGENTA, bg: BG_BLACK }
    }
  },

  'midnight_city': {
    id: 'midnight_city',
    name: 'Midnight City',
    sky: {
      top: { fg: BLUE, bg: BG_BLACK },
      horizon: { fg: LIGHTBLUE, bg: BG_BLACK },
      gridColor: { fg: BLUE, bg: BG_BLACK }
    },
    sun: {
      color: { fg: WHITE, bg: BG_BLUE },
      glowColor: { fg: LIGHTCYAN, bg: BG_BLACK },
      position: 0.5
    },
    road: {
      surface: { fg: DARKGRAY, bg: BG_BLACK },
      stripe: { fg: YELLOW, bg: BG_BLACK },
      edge: { fg: WHITE, bg: BG_BLACK },
      grid: { fg: DARKGRAY, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: DARKGRAY, bg: BG_BLACK },
      sceneryTypes: ['building', 'streetlight', 'sign'],
      sceneryDensity: 0.2
    },
    background: {
      type: 'city',
      color: { fg: BLUE, bg: BG_BLACK },
      highlightColor: { fg: LIGHTCYAN, bg: BG_BLACK }
    }
  },

  'beach_paradise': {
    id: 'beach_paradise',
    name: 'Beach Paradise',
    sky: {
      top: { fg: LIGHTCYAN, bg: BG_BLACK },
      horizon: { fg: CYAN, bg: BG_BLACK },
      gridColor: { fg: CYAN, bg: BG_BLACK }
    },
    sun: {
      color: { fg: YELLOW, bg: BG_BROWN },
      glowColor: { fg: YELLOW, bg: BG_BLACK },
      position: 0.3
    },
    road: {
      surface: { fg: LIGHTGRAY, bg: BG_BLACK },
      stripe: { fg: WHITE, bg: BG_BLACK },
      edge: { fg: YELLOW, bg: BG_BLACK },
      grid: { fg: DARKGRAY, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: YELLOW, bg: BG_BLACK },
      sceneryTypes: ['palm_tree', 'beach_umbrella', 'wave'],
      sceneryDensity: 0.12
    },
    background: {
      type: 'ocean',
      color: { fg: CYAN, bg: BG_BLACK },
      highlightColor: { fg: LIGHTCYAN, bg: BG_BLACK }
    }
  },

  'forest_night': {
    id: 'forest_night',
    name: 'Forest Night',
    sky: {
      top: { fg: BLACK, bg: BG_BLACK },
      horizon: { fg: DARKGRAY, bg: BG_BLACK },
      gridColor: { fg: DARKGRAY, bg: BG_BLACK }
    },
    sun: {
      color: { fg: WHITE, bg: BG_BLACK },
      glowColor: { fg: LIGHTGRAY, bg: BG_BLACK },
      position: 0.7
    },
    road: {
      surface: { fg: DARKGRAY, bg: BG_BLACK },
      stripe: { fg: WHITE, bg: BG_BLACK },
      edge: { fg: BROWN, bg: BG_BLACK },
      grid: { fg: DARKGRAY, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: GREEN, bg: BG_BLACK },
      sceneryTypes: ['pine_tree', 'bush', 'rock'],
      sceneryDensity: 0.25
    },
    background: {
      type: 'forest',
      color: { fg: GREEN, bg: BG_BLACK },
      highlightColor: { fg: LIGHTGREEN, bg: BG_BLACK }
    }
  }
};

// ============================================================
// TRACK CATALOG
// ============================================================

var TRACK_CATALOG: TrackDefinition[] = [
  // ---- TEST TRACK (short, for debugging) ----
  {
    id: 'test_oval',
    name: 'Test Oval',
    description: 'Short oval for testing (30 sec lap)',
    difficulty: 1,
    laps: 2,
    themeId: 'synthwave',
    estimatedLapTime: 30,
    sections: [
      { type: 'straight', length: 15 },
      { type: 'ease_in', length: 5, targetCurve: 0.5 },
      { type: 'curve', length: 15, curve: 0.5 },
      { type: 'ease_out', length: 5 },
      { type: 'straight', length: 15 },
      { type: 'ease_in', length: 5, targetCurve: 0.5 },
      { type: 'curve', length: 15, curve: 0.5 },
      { type: 'ease_out', length: 5 }
    ]
  },

  // ---- NEON COAST (original track) ----
  {
    id: 'neon_coast',
    name: 'Neon Coast',
    description: 'Synthwave sunset drive along the coast',
    difficulty: 2,
    laps: 3,
    themeId: 'synthwave',
    estimatedLapTime: 90,
    sections: [
      { type: 'straight', length: 30 },
      { type: 'ease_in', length: 10, targetCurve: 0.4 },
      { type: 'curve', length: 30, curve: 0.4 },
      { type: 'ease_out', length: 10 },
      { type: 'straight', length: 40 },
      { type: 'ease_in', length: 8, targetCurve: -0.6 },
      { type: 'curve', length: 25, curve: -0.6 },
      { type: 'ease_out', length: 8 },
      { type: 'straight', length: 25 },
      { type: 's_curve', length: 54 },  // S-curve section
      { type: 'straight', length: 35 }
    ]
  },

  // ---- DOWNTOWN DASH ----
  {
    id: 'downtown_dash',
    name: 'Downtown Dash',
    description: 'Race through the neon-lit city streets',
    difficulty: 3,
    laps: 3,
    themeId: 'midnight_city',
    estimatedLapTime: 75,
    sections: [
      { type: 'straight', length: 20 },
      { type: 'ease_in', length: 5, targetCurve: 0.7 },
      { type: 'curve', length: 12, curve: 0.7 },
      { type: 'ease_out', length: 5 },
      { type: 'straight', length: 15 },
      { type: 'ease_in', length: 4, targetCurve: -0.8 },
      { type: 'curve', length: 10, curve: -0.8 },
      { type: 'ease_out', length: 4 },
      { type: 'straight', length: 20 },
      { type: 's_curve', length: 30 },
      { type: 'straight', length: 15 },
      { type: 'ease_in', length: 6, targetCurve: 0.5 },
      { type: 'curve', length: 20, curve: 0.5 },
      { type: 'ease_out', length: 6 }
    ]
  },

  // ---- SUNSET BEACH ----
  {
    id: 'sunset_beach',
    name: 'Sunset Beach',
    description: 'Cruise along the beautiful coastline',
    difficulty: 1,
    laps: 3,
    themeId: 'beach_paradise',
    estimatedLapTime: 60,
    sections: [
      { type: 'straight', length: 25 },
      { type: 'ease_in', length: 8, targetCurve: 0.3 },
      { type: 'curve', length: 20, curve: 0.3 },
      { type: 'ease_out', length: 8 },
      { type: 'straight', length: 30 },
      { type: 'ease_in', length: 8, targetCurve: -0.3 },
      { type: 'curve', length: 20, curve: -0.3 },
      { type: 'ease_out', length: 8 },
      { type: 'straight', length: 20 }
    ]
  },

  // ---- QUICK TEST (very short) ----
  {
    id: 'quick_test',
    name: 'Quick Test',
    description: 'Ultra-short track for quick testing',
    difficulty: 1,
    laps: 2,
    themeId: 'synthwave',
    estimatedLapTime: 15,
    sections: [
      { type: 'straight', length: 10 },
      { type: 'ease_in', length: 3, targetCurve: 0.4 },
      { type: 'curve', length: 8, curve: 0.4 },
      { type: 'ease_out', length: 3 },
      { type: 'straight', length: 6 }
    ]
  }
];

// ============================================================
// TRACK BUILDER FROM DEFINITION
// ============================================================

/**
 * Build a Road from a TrackDefinition.
 */
function buildRoadFromDefinition(def: TrackDefinition): Road {
  var builder = new RoadBuilder()
    .name(def.name)
    .laps(def.laps);

  for (var i = 0; i < def.sections.length; i++) {
    var section = def.sections[i];
    
    switch (section.type) {
      case 'straight':
        builder.straight(section.length);
        break;
        
      case 'curve':
        builder.curve(section.length, section.curve || 0);
        break;
        
      case 'ease_in':
        builder.easeIn(section.length, section.targetCurve || 0);
        break;
        
      case 'ease_out':
        builder.easeOut(section.length);
        break;
        
      case 's_curve':
        // S-curve: right then left (or use length to split evenly)
        var halfLen = Math.floor(section.length / 6);
        builder
          .easeIn(halfLen, 0.5)
          .curve(halfLen * 2, 0.5)
          .easeOut(halfLen)
          .easeIn(halfLen, -0.5)
          .curve(halfLen * 2, -0.5)
          .easeOut(halfLen);
        break;
    }
  }

  return builder.build();
}

/**
 * Get a track definition by ID.
 */
function getTrackDefinition(id: string): TrackDefinition | null {
  for (var i = 0; i < TRACK_CATALOG.length; i++) {
    if (TRACK_CATALOG[i].id === id) {
      return TRACK_CATALOG[i];
    }
  }
  return null;
}

/**
 * Get the theme for a track.
 */
function getTrackTheme(trackDef: TrackDefinition): TrackTheme {
  return TRACK_THEMES[trackDef.themeId] || TRACK_THEMES['synthwave'];
}

/**
 * Get all available tracks.
 */
function getAllTracks(): TrackDefinition[] {
  return TRACK_CATALOG;
}

/**
 * Render difficulty as stars.
 */
function renderDifficultyStars(difficulty: number): string {
  var stars = '';
  for (var i = 0; i < 5; i++) {
    stars += i < difficulty ? '*' : '.';
  }
  return stars;
}
