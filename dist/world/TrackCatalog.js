"use strict";
var TRACK_THEMES = {
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
            color: { fg: RED, bg: BG_BLACK },
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
    }
};
var TRACK_CATALOG = [
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
            { type: 's_curve', length: 54 },
            { type: 'straight', length: 35 }
        ]
    },
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
            { type: 'straight', length: 15 },
            { type: 'ease_in', length: 5, targetCurve: -0.4 },
            { type: 'curve', length: 12, curve: -0.4 },
            { type: 'ease_out', length: 4 },
            { type: 'straight', length: 10 },
            { type: 'ease_in', length: 4, targetCurve: 0.7 },
            { type: 'curve', length: 15, curve: 0.7 },
            { type: 'ease_out', length: 4 },
            { type: 'ease_in', length: 3, targetCurve: -0.5 },
            { type: 'curve', length: 10, curve: -0.5 },
            { type: 'ease_in', length: 3, targetCurve: 0.5 },
            { type: 'curve', length: 10, curve: 0.5 },
            { type: 'ease_out', length: 3 },
            { type: 'ease_in', length: 3, targetCurve: -0.8 },
            { type: 'curve', length: 8, curve: -0.8 },
            { type: 'ease_out', length: 3 },
            { type: 'straight', length: 12 }
        ]
    },
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
            { type: 'straight', length: 20 },
            { type: 'ease_in', length: 6, targetCurve: 0.3 },
            { type: 'curve', length: 18, curve: 0.3 },
            { type: 'ease_out', length: 6 },
            { type: 'straight', length: 15 },
            { type: 'ease_in', length: 5, targetCurve: -0.4 },
            { type: 'curve', length: 15, curve: -0.4 },
            { type: 'ease_out', length: 5 },
            { type: 'ease_in', length: 4, targetCurve: 0.35 },
            { type: 'curve', length: 10, curve: 0.35 },
            { type: 'ease_in', length: 4, targetCurve: -0.35 },
            { type: 'curve', length: 10, curve: -0.35 },
            { type: 'ease_out', length: 4 },
            { type: 'straight', length: 18 }
        ]
    },
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
            { type: 'straight', length: 18 },
            { type: 'ease_in', length: 5, targetCurve: 0.45 },
            { type: 'curve', length: 20, curve: 0.45 },
            { type: 'ease_out', length: 5 },
            { type: 'straight', length: 15 },
            { type: 'ease_in', length: 4, targetCurve: -0.7 },
            { type: 'curve', length: 12, curve: -0.7 },
            { type: 'ease_out', length: 4 },
            { type: 'straight', length: 10 },
            { type: 'ease_in', length: 4, targetCurve: 0.5 },
            { type: 'curve', length: 12, curve: 0.5 },
            { type: 'ease_in', length: 4, targetCurve: -0.5 },
            { type: 'curve', length: 12, curve: -0.5 },
            { type: 'ease_out', length: 4 },
            { type: 'straight', length: 20 }
        ]
    },
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
    {
        id: 'twilight_grove',
        name: 'Twilight Grove',
        description: 'Winding forest road under dual moons and dancing fireflies',
        difficulty: 3,
        laps: 3,
        themeId: 'forest_night',
        estimatedLapTime: 55,
        sections: [
            { type: 'straight', length: 12 },
            { type: 'ease_in', length: 5, targetCurve: -0.3 },
            { type: 'curve', length: 10, curve: -0.3 },
            { type: 'ease_out', length: 4 },
            { type: 'straight', length: 8 },
            { type: 'ease_in', length: 4, targetCurve: 0.6 },
            { type: 'curve', length: 12, curve: 0.6 },
            { type: 'ease_out', length: 4 },
            { type: 'ease_in', length: 3, targetCurve: -0.4 },
            { type: 'curve', length: 8, curve: -0.4 },
            { type: 'ease_in', length: 3, targetCurve: 0.4 },
            { type: 'curve', length: 8, curve: 0.4 },
            { type: 'ease_out', length: 3 },
            { type: 'straight', length: 10 }
        ]
    }
];
function buildRoadFromDefinition(def) {
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
function getTrackDefinition(id) {
    for (var i = 0; i < TRACK_CATALOG.length; i++) {
        if (TRACK_CATALOG[i].id === id) {
            return TRACK_CATALOG[i];
        }
    }
    return null;
}
function getTrackTheme(trackDef) {
    return TRACK_THEMES[trackDef.themeId] || TRACK_THEMES['synthwave'];
}
function getAllTracks() {
    return TRACK_CATALOG;
}
function renderDifficultyStars(difficulty) {
    var stars = '';
    for (var i = 0; i < 5; i++) {
        stars += i < difficulty ? '*' : '.';
    }
    return stars;
}
