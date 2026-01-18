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
  
  /** Number of NPC vehicles (commuters/traffic) on track */
  npcCount?: number;
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
  },

  'haunted_hollow': {
    id: 'haunted_hollow',
    name: 'Haunted Hollow',
    sky: {
      top: { fg: BLACK, bg: BG_BLACK },
      horizon: { fg: MAGENTA, bg: BG_BLACK },
      gridColor: { fg: DARKGRAY, bg: BG_BLACK }
    },
    sun: {
      color: { fg: RED, bg: BG_BLACK },       // Blood moon
      glowColor: { fg: LIGHTRED, bg: BG_BLACK },
      position: 0.5
    },
    road: {
      surface: { fg: DARKGRAY, bg: BG_BLACK },
      stripe: { fg: LIGHTRED, bg: BG_BLACK },
      edge: { fg: DARKGRAY, bg: BG_BLACK },
      grid: { fg: DARKGRAY, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: DARKGRAY, bg: BG_BLACK },
      sceneryTypes: ['deadtree', 'gravestone', 'pumpkin', 'skull', 'fence', 'candle'],
      sceneryDensity: 0.3
    },
    background: {
      type: 'cemetery',
      color: { fg: BLACK, bg: BG_BLACK },
      highlightColor: { fg: MAGENTA, bg: BG_BLACK }
    }
  },

  'winter_wonderland': {
    id: 'winter_wonderland',
    name: 'Winter Wonderland',
    sky: {
      top: { fg: BLUE, bg: BG_BLACK },
      horizon: { fg: WHITE, bg: BG_BLACK },
      gridColor: { fg: LIGHTCYAN, bg: BG_BLACK }
    },
    sun: {
      color: { fg: WHITE, bg: BG_LIGHTGRAY },
      glowColor: { fg: YELLOW, bg: BG_BLACK },
      position: 0.3
    },
    road: {
      surface: { fg: LIGHTGRAY, bg: BG_BLACK },
      stripe: { fg: LIGHTRED, bg: BG_BLACK },
      edge: { fg: WHITE, bg: BG_BLACK },
      grid: { fg: LIGHTCYAN, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: WHITE, bg: BG_BLACK },
      sceneryTypes: ['snowpine', 'snowman', 'icecrystal', 'candycane', 'snowdrift', 'signpost'],
      sceneryDensity: 0.25
    },
    background: {
      type: 'mountains',
      color: { fg: WHITE, bg: BG_BLACK },
      highlightColor: { fg: LIGHTCYAN, bg: BG_BLACK }
    }
  },

  'cactus_canyon': {
    id: 'cactus_canyon',
    name: 'Cactus Canyon',
    sky: {
      top: { fg: BLUE, bg: BG_BLACK },
      horizon: { fg: YELLOW, bg: BG_BLACK },
      gridColor: { fg: BROWN, bg: BG_BLACK }
    },
    sun: {
      color: { fg: YELLOW, bg: BG_BROWN },
      glowColor: { fg: YELLOW, bg: BG_BLACK },
      position: 0.6
    },
    road: {
      surface: { fg: BROWN, bg: BG_BLACK },
      stripe: { fg: YELLOW, bg: BG_BLACK },
      edge: { fg: BROWN, bg: BG_BLACK },
      grid: { fg: BROWN, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: YELLOW, bg: BG_BLACK },
      sceneryTypes: ['saguaro', 'barrel', 'tumbleweed', 'cowskull', 'desertrock', 'westernsign'],
      sceneryDensity: 0.2
    },
    background: {
      type: 'dunes',
      color: { fg: BROWN, bg: BG_BLACK },
      highlightColor: { fg: YELLOW, bg: BG_BLACK }
    }
  },

  'tropical_jungle': {
    id: 'tropical_jungle',
    name: 'Tropical Jungle',
    sky: {
      top: { fg: GREEN, bg: BG_BLACK },
      horizon: { fg: LIGHTGREEN, bg: BG_BLACK },
      gridColor: { fg: GREEN, bg: BG_BLACK }
    },
    sun: {
      color: { fg: YELLOW, bg: BG_GREEN },
      glowColor: { fg: LIGHTGREEN, bg: BG_BLACK },
      position: 0.4
    },
    road: {
      surface: { fg: BROWN, bg: BG_BLACK },
      stripe: { fg: YELLOW, bg: BG_BLACK },
      edge: { fg: GREEN, bg: BG_BLACK },
      grid: { fg: BROWN, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: GREEN, bg: BG_BLACK },
      sceneryTypes: ['jungle_tree', 'fern', 'vine', 'flower', 'parrot', 'banana'],
      sceneryDensity: 0.35
    },
    background: {
      type: 'forest',
      color: { fg: GREEN, bg: BG_BLACK },
      highlightColor: { fg: LIGHTGREEN, bg: BG_BLACK }
    }
  },

  'candy_land': {
    id: 'candy_land',
    name: 'Candy Land',
    sky: {
      top: { fg: LIGHTMAGENTA, bg: BG_BLACK },
      horizon: { fg: LIGHTCYAN, bg: BG_BLACK },
      gridColor: { fg: LIGHTMAGENTA, bg: BG_BLACK }
    },
    sun: {
      color: { fg: YELLOW, bg: BG_MAGENTA },
      glowColor: { fg: LIGHTMAGENTA, bg: BG_BLACK },
      position: 0.5
    },
    road: {
      surface: { fg: LIGHTMAGENTA, bg: BG_BLACK },
      stripe: { fg: WHITE, bg: BG_BLACK },
      edge: { fg: LIGHTCYAN, bg: BG_BLACK },
      grid: { fg: MAGENTA, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: LIGHTGREEN, bg: BG_BLACK },
      sceneryTypes: ['lollipop', 'candy_cane', 'gummy_bear', 'cupcake', 'ice_cream', 'cotton_candy'],
      sceneryDensity: 0.3
    },
    background: {
      type: 'mountains',
      color: { fg: LIGHTMAGENTA, bg: BG_BLACK },
      highlightColor: { fg: LIGHTCYAN, bg: BG_BLACK }
    }
  },

  'rainbow_road': {
    id: 'rainbow_road',
    name: 'Rainbow Road',
    sky: {
      top: { fg: BLUE, bg: BG_BLACK },
      horizon: { fg: LIGHTBLUE, bg: BG_BLACK },
      gridColor: { fg: LIGHTMAGENTA, bg: BG_BLACK }
    },
    sun: {
      color: { fg: WHITE, bg: BG_BLUE },
      glowColor: { fg: LIGHTCYAN, bg: BG_BLACK },
      position: 0.5
    },
    road: {
      surface: { fg: LIGHTRED, bg: BG_BLACK },
      stripe: { fg: YELLOW, bg: BG_BLACK },
      edge: { fg: LIGHTMAGENTA, bg: BG_BLACK },
      grid: { fg: LIGHTCYAN, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: BLUE, bg: BG_BLACK },
      sceneryTypes: ['star', 'moon', 'planet', 'comet', 'nebula', 'satellite'],
      sceneryDensity: 0.2
    },
    background: {
      type: 'space',
      color: { fg: BLUE, bg: BG_BLACK },
      highlightColor: { fg: LIGHTMAGENTA, bg: BG_BLACK }
    }
  },

  'dark_castle': {
    id: 'dark_castle',
    name: 'Dark Castle',
    sky: {
      top: { fg: BLACK, bg: BG_BLACK },
      horizon: { fg: DARKGRAY, bg: BG_BLACK },
      gridColor: { fg: DARKGRAY, bg: BG_BLACK }
    },
    sun: {
      color: { fg: LIGHTGRAY, bg: BG_BLACK },
      glowColor: { fg: DARKGRAY, bg: BG_BLACK },
      position: 0.7
    },
    road: {
      surface: { fg: DARKGRAY, bg: BG_BLACK },
      stripe: { fg: LIGHTGRAY, bg: BG_BLACK },
      edge: { fg: BROWN, bg: BG_BLACK },
      grid: { fg: DARKGRAY, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: DARKGRAY, bg: BG_BLACK },
      sceneryTypes: ['tower', 'battlement', 'torch', 'banner', 'gargoyle', 'portcullis'],
      sceneryDensity: 0.25
    },
    background: {
      type: 'castle',
      color: { fg: DARKGRAY, bg: BG_BLACK },
      highlightColor: { fg: LIGHTGRAY, bg: BG_BLACK }
    }
  },

  'villains_lair': {
    id: 'villains_lair',
    name: "Villain's Lair",
    sky: {
      top: { fg: RED, bg: BG_BLACK },
      horizon: { fg: LIGHTRED, bg: BG_BLACK },
      gridColor: { fg: RED, bg: BG_BLACK }
    },
    sun: {
      color: { fg: LIGHTRED, bg: BG_RED },
      glowColor: { fg: YELLOW, bg: BG_BLACK },
      position: 0.5
    },
    road: {
      surface: { fg: DARKGRAY, bg: BG_BLACK },
      stripe: { fg: LIGHTRED, bg: BG_BLACK },
      edge: { fg: RED, bg: BG_BLACK },
      grid: { fg: RED, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: RED, bg: BG_BLACK },
      sceneryTypes: ['lava_rock', 'flame', 'skull_pile', 'chain', 'spike', 'cauldron'],
      sceneryDensity: 0.28
    },
    background: {
      type: 'volcano',
      color: { fg: RED, bg: BG_BLACK },
      highlightColor: { fg: YELLOW, bg: BG_BLACK }
    }
  },

  'ancient_ruins': {
    id: 'ancient_ruins',
    name: 'Ancient Ruins',
    sky: {
      top: { fg: CYAN, bg: BG_BLACK },
      horizon: { fg: YELLOW, bg: BG_BLACK },
      gridColor: { fg: BROWN, bg: BG_BLACK }
    },
    sun: {
      color: { fg: YELLOW, bg: BG_BROWN },
      glowColor: { fg: YELLOW, bg: BG_BLACK },
      position: 0.4
    },
    road: {
      surface: { fg: BROWN, bg: BG_BLACK },
      stripe: { fg: YELLOW, bg: BG_BLACK },
      edge: { fg: LIGHTGRAY, bg: BG_BLACK },
      grid: { fg: BROWN, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: YELLOW, bg: BG_BLACK },
      sceneryTypes: ['column', 'statue', 'obelisk', 'sphinx', 'hieroglyph', 'scarab'],
      sceneryDensity: 0.22
    },
    background: {
      type: 'pyramids',
      color: { fg: YELLOW, bg: BG_BLACK },
      highlightColor: { fg: BROWN, bg: BG_BLACK }
    }
  },

  'thunder_stadium': {
    id: 'thunder_stadium',
    name: 'Thunder Stadium',
    sky: {
      top: { fg: BLACK, bg: BG_BLACK },
      horizon: { fg: DARKGRAY, bg: BG_BLACK },
      gridColor: { fg: YELLOW, bg: BG_BLACK }
    },
    sun: {
      color: { fg: WHITE, bg: BG_BLACK },
      glowColor: { fg: YELLOW, bg: BG_BLACK },
      position: 0.5
    },
    road: {
      surface: { fg: BROWN, bg: BG_BLACK },
      stripe: { fg: WHITE, bg: BG_BLACK },
      edge: { fg: YELLOW, bg: BG_BLACK },
      grid: { fg: BROWN, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: BROWN, bg: BG_BLACK },
      sceneryTypes: ['grandstand', 'tire_stack', 'hay_bale', 'flag_marshal', 'pit_crew', 'banner'],
      sceneryDensity: 0.35
    },
    background: {
      type: 'stadium',
      color: { fg: DARKGRAY, bg: BG_BLACK },
      highlightColor: { fg: YELLOW, bg: BG_BLACK }
    }
  },

  'glitch_circuit': {
    id: 'glitch_circuit',
    name: 'Glitch Circuit',
    sky: {
      top: { fg: BLACK, bg: BG_BLACK },
      horizon: { fg: LIGHTGREEN, bg: BG_BLACK },
      gridColor: { fg: GREEN, bg: BG_BLACK }
    },
    sun: {
      color: { fg: WHITE, bg: BG_GREEN },
      glowColor: { fg: LIGHTGREEN, bg: BG_BLACK },
      position: 0.5
    },
    road: {
      surface: { fg: DARKGRAY, bg: BG_BLACK },
      stripe: { fg: LIGHTGREEN, bg: BG_BLACK },
      edge: { fg: LIGHTCYAN, bg: BG_BLACK },
      grid: { fg: GREEN, bg: BG_BLACK }
    },
    offroad: {
      groundColor: { fg: GREEN, bg: BG_BLACK },
      sceneryTypes: ['building', 'palm_tree', 'tree', 'gravestone', 'cactus', 'lollipop', 'crystal', 'torch', 'column'],
      sceneryDensity: 0.30
    },
    background: {
      type: 'mountains',
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
    npcCount: 3,
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
    npcCount: 6,
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
    npcCount: 8,
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
    npcCount: 4,
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

  // ---- HAUNTED HOLLOW (horror themed) ----
  {
    id: 'haunted_hollow',
    name: 'Haunted Hollow',
    description: 'Race through the cemetery under a blood moon',
    difficulty: 4,
    laps: 3,
    themeId: 'haunted_hollow',
    estimatedLapTime: 70,
    npcCount: 3,
    sections: [
      // Start at cemetery gates
      { type: 'straight', length: 15 },
      // Wind around gravestones
      { type: 'ease_in', length: 5, targetCurve: -0.4 },
      { type: 'curve', length: 12, curve: -0.4 },
      { type: 'ease_out', length: 4 },
      // Brief straight past the crypt
      { type: 'straight', length: 10 },
      // Sharp turn around haunted mausoleum
      { type: 'ease_in', length: 4, targetCurve: 0.7 },
      { type: 'curve', length: 15, curve: 0.7 },
      { type: 'ease_out', length: 4 },
      // S-curve through dead tree grove
      { type: 'ease_in', length: 3, targetCurve: -0.5 },
      { type: 'curve', length: 10, curve: -0.5 },
      { type: 'ease_in', length: 3, targetCurve: 0.5 },
      { type: 'curve', length: 10, curve: 0.5 },
      { type: 'ease_out', length: 3 },
      // Tight turn around the gallows
      { type: 'ease_in', length: 3, targetCurve: -0.8 },
      { type: 'curve', length: 8, curve: -0.8 },
      { type: 'ease_out', length: 3 },
      // Final stretch back to gates
      { type: 'straight', length: 12 }
    ]
  },

  // ---- WINTER WONDERLAND (snowy themed) ----
  {
    id: 'winter_wonderland',
    name: 'Winter Wonderland',
    description: 'Magical snowy race through a frosty forest',
    difficulty: 2,
    laps: 3,
    themeId: 'winter_wonderland',
    estimatedLapTime: 65,
    npcCount: 4,
    sections: [
      // Start at ski lodge
      { type: 'straight', length: 20 },
      // Gentle curve around frozen lake
      { type: 'ease_in', length: 6, targetCurve: 0.3 },
      { type: 'curve', length: 18, curve: 0.3 },
      { type: 'ease_out', length: 6 },
      // Straight through pine forest
      { type: 'straight', length: 15 },
      // Sweeping turn past snowman village
      { type: 'ease_in', length: 5, targetCurve: -0.4 },
      { type: 'curve', length: 15, curve: -0.4 },
      { type: 'ease_out', length: 5 },
      // S-curve through ice crystal canyon
      { type: 'ease_in', length: 4, targetCurve: 0.35 },
      { type: 'curve', length: 10, curve: 0.35 },
      { type: 'ease_in', length: 4, targetCurve: -0.35 },
      { type: 'curve', length: 10, curve: -0.35 },
      { type: 'ease_out', length: 4 },
      // Final stretch back to lodge
      { type: 'straight', length: 18 }
    ]
  },

  // ---- CACTUS CANYON (desert themed) ----
  {
    id: 'cactus_canyon',
    name: 'Cactus Canyon',
    description: 'Blazing desert race through the Southwest canyons',
    difficulty: 3,
    laps: 3,
    themeId: 'cactus_canyon',
    estimatedLapTime: 75,
    npcCount: 5,
    sections: [
      // Start at old west town
      { type: 'straight', length: 18 },
      // Sweeping turn into canyon
      { type: 'ease_in', length: 5, targetCurve: 0.45 },
      { type: 'curve', length: 20, curve: 0.45 },
      { type: 'ease_out', length: 5 },
      // Straight through saguaro forest
      { type: 'straight', length: 15 },
      // Sharp hairpin around mesa
      { type: 'ease_in', length: 4, targetCurve: -0.7 },
      { type: 'curve', length: 12, curve: -0.7 },
      { type: 'ease_out', length: 4 },
      // Brief straight past cow skull landmark
      { type: 'straight', length: 10 },
      // S-curve through rocky canyon
      { type: 'ease_in', length: 4, targetCurve: 0.5 },
      { type: 'curve', length: 12, curve: 0.5 },
      { type: 'ease_in', length: 4, targetCurve: -0.5 },
      { type: 'curve', length: 12, curve: -0.5 },
      { type: 'ease_out', length: 4 },
      // Final stretch back to town
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
    npcCount: 2,
    sections: [
      { type: 'straight', length: 10 },
      { type: 'ease_in', length: 3, targetCurve: 0.4 },
      { type: 'curve', length: 8, curve: 0.4 },
      { type: 'ease_out', length: 3 },
      { type: 'straight', length: 6 }
    ]
  },

  // ---- TWILIGHT GROVE (forest track) ----
  {
    id: 'twilight_grove',
    name: 'Twilight Grove',
    description: 'Winding forest road under dual moons and dancing fireflies',
    difficulty: 3,
    laps: 3,
    themeId: 'forest_night',
    estimatedLapTime: 55,
    sections: [
      // Start in a clearing
      { type: 'straight', length: 12 },
      // Wind into the forest
      { type: 'ease_in', length: 5, targetCurve: -0.3 },
      { type: 'curve', length: 10, curve: -0.3 },
      { type: 'ease_out', length: 4 },
      // Brief straight through tall trees
      { type: 'straight', length: 8 },
      // Sharp turn around old oak
      { type: 'ease_in', length: 4, targetCurve: 0.6 },
      { type: 'curve', length: 12, curve: 0.6 },
      { type: 'ease_out', length: 4 },
      // S-curve through the grove
      { type: 'ease_in', length: 3, targetCurve: -0.4 },
      { type: 'curve', length: 8, curve: -0.4 },
      { type: 'ease_in', length: 3, targetCurve: 0.4 },
      { type: 'curve', length: 8, curve: 0.4 },
      { type: 'ease_out', length: 3 },
      // Final stretch back to clearing
      { type: 'straight', length: 10 }
    ]
  },

  // ---- JUNGLE RUN (tropical jungle) ----
  {
    id: 'jungle_run',
    name: 'Jungle Run',
    description: 'Race through dense tropical rainforest with exotic wildlife',
    difficulty: 3,
    laps: 3,
    themeId: 'tropical_jungle',
    estimatedLapTime: 60,
    npcCount: 5,
    sections: [
      // Start at jungle outpost
      { type: 'straight', length: 15 },
      // Curve around massive banyan tree
      { type: 'ease_in', length: 5, targetCurve: 0.45 },
      { type: 'curve', length: 15, curve: 0.45 },
      { type: 'ease_out', length: 5 },
      // Through vine-covered passage
      { type: 'straight', length: 12 },
      // Sharp turn at waterfall
      { type: 'ease_in', length: 4, targetCurve: -0.6 },
      { type: 'curve', length: 10, curve: -0.6 },
      { type: 'ease_out', length: 4 },
      // S-curve through fern valley
      { type: 'ease_in', length: 4, targetCurve: 0.4 },
      { type: 'curve', length: 10, curve: 0.4 },
      { type: 'ease_in', length: 4, targetCurve: -0.4 },
      { type: 'curve', length: 10, curve: -0.4 },
      { type: 'ease_out', length: 4 },
      // Final dash back to outpost
      { type: 'straight', length: 18 }
    ]
  },

  // ---- SUGAR RUSH (candy land) ----
  {
    id: 'sugar_rush',
    name: 'Sugar Rush',
    description: 'Sweet racing through a land made entirely of candy!',
    difficulty: 2,
    laps: 3,
    themeId: 'candy_land',
    estimatedLapTime: 50,
    npcCount: 4,
    sections: [
      // Start at Gingerbread Village
      { type: 'straight', length: 12 },
      // Around the giant lollipop
      { type: 'ease_in', length: 4, targetCurve: 0.35 },
      { type: 'curve', length: 12, curve: 0.35 },
      { type: 'ease_out', length: 4 },
      // Through candy cane forest
      { type: 'straight', length: 10 },
      // Spiral around gumdrop mountain
      { type: 'ease_in', length: 5, targetCurve: -0.5 },
      { type: 'curve', length: 14, curve: -0.5 },
      { type: 'ease_out', length: 5 },
      // Chocolate river crossing
      { type: 'straight', length: 8 },
      // S-curves through cotton candy clouds
      { type: 'ease_in', length: 3, targetCurve: 0.3 },
      { type: 'curve', length: 8, curve: 0.3 },
      { type: 'ease_in', length: 3, targetCurve: -0.3 },
      { type: 'curve', length: 8, curve: -0.3 },
      { type: 'ease_out', length: 3 },
      // Back to the village
      { type: 'straight', length: 10 }
    ]
  },

  // ---- CELESTIAL CIRCUIT (rainbow road) ----
  {
    id: 'celestial_circuit',
    name: 'Celestial Circuit',
    description: 'Cosmic racing through the stars on a rainbow of light',
    difficulty: 4,
    laps: 3,
    themeId: 'rainbow_road',
    estimatedLapTime: 70,
    npcCount: 6,
    sections: [
      // Launch from space station
      { type: 'straight', length: 20 },
      // Around the moon
      { type: 'ease_in', length: 6, targetCurve: 0.55 },
      { type: 'curve', length: 18, curve: 0.55 },
      { type: 'ease_out', length: 6 },
      // Through asteroid field
      { type: 'straight', length: 15 },
      // Sharp turn past nebula
      { type: 'ease_in', length: 4, targetCurve: -0.65 },
      { type: 'curve', length: 12, curve: -0.65 },
      { type: 'ease_out', length: 4 },
      // Brief straight past comet
      { type: 'straight', length: 10 },
      // Double helix around binary stars
      { type: 'ease_in', length: 5, targetCurve: 0.5 },
      { type: 'curve', length: 14, curve: 0.5 },
      { type: 'ease_in', length: 5, targetCurve: -0.5 },
      { type: 'curve', length: 14, curve: -0.5 },
      { type: 'ease_out', length: 5 },
      // Return to station
      { type: 'straight', length: 18 }
    ]
  },

  // ---- FORTRESS RALLY (dark castle) ----
  {
    id: 'fortress_rally',
    name: 'Fortress Rally',
    description: 'Navigate the twisting roads of a medieval fortress',
    difficulty: 4,
    laps: 3,
    themeId: 'dark_castle',
    estimatedLapTime: 65,
    npcCount: 5,
    sections: [
      // Through the main gate
      { type: 'straight', length: 14 },
      // Around the outer wall
      { type: 'ease_in', length: 5, targetCurve: 0.4 },
      { type: 'curve', length: 16, curve: 0.4 },
      { type: 'ease_out', length: 5 },
      // Into the courtyard
      { type: 'straight', length: 10 },
      // Sharp hairpin at the tower
      { type: 'ease_in', length: 4, targetCurve: -0.7 },
      { type: 'curve', length: 10, curve: -0.7 },
      { type: 'ease_out', length: 4 },
      // Through the armory
      { type: 'straight', length: 8 },
      // S-curve in the dungeon depths
      { type: 'ease_in', length: 4, targetCurve: 0.45 },
      { type: 'curve', length: 12, curve: 0.45 },
      { type: 'ease_in', length: 4, targetCurve: -0.45 },
      { type: 'curve', length: 12, curve: -0.45 },
      { type: 'ease_out', length: 4 },
      // Back across drawbridge
      { type: 'straight', length: 16 }
    ]
  },

  // ---- INFERNO SPEEDWAY (villain's lair) ----
  {
    id: 'inferno_speedway',
    name: 'Inferno Speedway',
    description: 'Blaze through a volcanic villain hideout at your peril',
    difficulty: 5,
    laps: 3,
    themeId: 'villains_lair',
    estimatedLapTime: 80,
    npcCount: 7,
    sections: [
      // Exit from skull cave
      { type: 'straight', length: 16 },
      // Around the lava lake
      { type: 'ease_in', length: 6, targetCurve: 0.6 },
      { type: 'curve', length: 20, curve: 0.6 },
      { type: 'ease_out', length: 6 },
      // Through fire pit gauntlet
      { type: 'straight', length: 14 },
      // Deadly hairpin at molten core
      { type: 'ease_in', length: 5, targetCurve: -0.75 },
      { type: 'curve', length: 14, curve: -0.75 },
      { type: 'ease_out', length: 5 },
      // Brief respite
      { type: 'straight', length: 8 },
      // Treacherous S-curves over lava flows
      { type: 'ease_in', length: 5, targetCurve: 0.55 },
      { type: 'curve', length: 15, curve: 0.55 },
      { type: 'ease_in', length: 5, targetCurve: -0.55 },
      { type: 'curve', length: 15, curve: -0.55 },
      { type: 'ease_out', length: 5 },
      // Back to skull cave
      { type: 'straight', length: 20 }
    ]
  },

  // ---- PHARAOH'S TOMB (ancient ruins) ----
  {
    id: 'pharaohs_tomb',
    name: "Pharaoh's Tomb",
    description: 'Unearth ancient secrets racing through pyramid ruins',
    difficulty: 3,
    laps: 3,
    themeId: 'ancient_ruins',
    estimatedLapTime: 58,
    npcCount: 5,
    sections: [
      // Start at pyramid entrance
      { type: 'straight', length: 14 },
      // Around the sphinx
      { type: 'ease_in', length: 5, targetCurve: 0.4 },
      { type: 'curve', length: 14, curve: 0.4 },
      { type: 'ease_out', length: 5 },
      // Through column avenue
      { type: 'straight', length: 12 },
      // Turn at the obelisk
      { type: 'ease_in', length: 4, targetCurve: -0.5 },
      { type: 'curve', length: 12, curve: -0.5 },
      { type: 'ease_out', length: 4 },
      // Past hieroglyph walls
      { type: 'straight', length: 10 },
      // S-curve through burial chambers
      { type: 'ease_in', length: 4, targetCurve: 0.35 },
      { type: 'curve', length: 10, curve: 0.35 },
      { type: 'ease_in', length: 4, targetCurve: -0.35 },
      { type: 'curve', length: 10, curve: -0.35 },
      { type: 'ease_out', length: 4 },
      // Back to daylight
      { type: 'straight', length: 16 }
    ]
  },

  // ---- THUNDER STADIUM (dirt track stadium) ----
  {
    id: 'thunder_stadium',
    name: 'Thunder Stadium',
    description: 'Race on packed dirt under stadium lights with roaring crowds',
    difficulty: 2,
    laps: 4,
    themeId: 'thunder_stadium',
    estimatedLapTime: 42,
    npcCount: 6,
    sections: [
      // Start/finish straight past main grandstand
      { type: 'straight', length: 18 },
      // Turn 1 - wide sweeper past pit lane
      { type: 'ease_in', length: 5, targetCurve: 0.45 },
      { type: 'curve', length: 16, curve: 0.45 },
      { type: 'ease_out', length: 5 },
      // Back straight past scoreboard
      { type: 'straight', length: 14 },
      // Turn 2 - tighter hairpin
      { type: 'ease_in', length: 4, targetCurve: 0.65 },
      { type: 'curve', length: 12, curve: 0.65 },
      { type: 'ease_out', length: 4 },
      // Short chute
      { type: 'straight', length: 8 },
      // Turn 3 - carousel
      { type: 'ease_in', length: 5, targetCurve: -0.5 },
      { type: 'curve', length: 18, curve: -0.5 },
      { type: 'ease_out', length: 5 },
      // Infield straight past fans
      { type: 'straight', length: 12 },
      // Turn 4 - back to main straight
      { type: 'ease_in', length: 4, targetCurve: -0.55 },
      { type: 'curve', length: 14, curve: -0.55 },
      { type: 'ease_out', length: 4 },
      // Final approach
      { type: 'straight', length: 10 }
    ]
  },

  // ---- GLITCH CIRCUIT (corrupted reality) ----
  {
    id: 'glitch_circuit',
    name: 'Glitch Circuit',
    description: 'Reality is corrupted. The simulation is breaking down.',
    difficulty: 4,
    laps: 3,
    themeId: 'glitch_circuit',
    estimatedLapTime: 55,
    npcCount: 6,
    sections: [
      // Start in stable zone
      { type: 'straight', length: 12 },
      // Reality starts warping - chaotic curves
      { type: 'ease_in', length: 3, targetCurve: 0.6 },
      { type: 'curve', length: 8, curve: 0.6 },
      { type: 'ease_in', length: 2, targetCurve: -0.7 },
      { type: 'curve', length: 10, curve: -0.7 },
      { type: 'ease_out', length: 3 },
      // Brief stability
      { type: 'straight', length: 8 },
      // Glitch zone - rapid direction changes
      { type: 'ease_in', length: 2, targetCurve: 0.5 },
      { type: 'curve', length: 6, curve: 0.5 },
      { type: 'ease_in', length: 2, targetCurve: -0.5 },
      { type: 'curve', length: 6, curve: -0.5 },
      { type: 'ease_in', length: 2, targetCurve: 0.45 },
      { type: 'curve', length: 6, curve: 0.45 },
      { type: 'ease_out', length: 3 },
      // System attempting recovery
      { type: 'straight', length: 14 },
      // Major corruption event - long sweeper
      { type: 'ease_in', length: 4, targetCurve: -0.55 },
      { type: 'curve', length: 20, curve: -0.55 },
      { type: 'ease_out', length: 4 },
      // Reality stabilizing for finish
      { type: 'straight', length: 16 },
      // One last glitch
      { type: 'ease_in', length: 3, targetCurve: 0.4 },
      { type: 'curve', length: 10, curve: 0.4 },
      { type: 'ease_out', length: 3 },
      // Return to start
      { type: 'straight', length: 10 }
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
