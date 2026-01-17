"use strict";
var NPC_VEHICLE_TYPES = ['sedan', 'truck', 'sportscar'];
var NPC_VEHICLE_COLORS = [
    { body: RED, trim: LIGHTRED, name: 'red' },
    { body: BLUE, trim: LIGHTBLUE, name: 'blue' },
    { body: GREEN, trim: LIGHTGREEN, name: 'green' },
    { body: CYAN, trim: LIGHTCYAN, name: 'cyan' },
    { body: MAGENTA, trim: LIGHTMAGENTA, name: 'magenta' },
    { body: WHITE, trim: LIGHTGRAY, name: 'white' },
    { body: BROWN, trim: YELLOW, name: 'orange' }
];
function createSedanSprite(bodyColor, trimColor) {
    var body = makeAttr(bodyColor, BG_BLACK);
    var trim = makeAttr(trimColor, BG_BLACK);
    var wheel = makeAttr(DARKGRAY, BG_BLACK);
    var window = makeAttr(CYAN, BG_BLACK);
    var taillight = makeAttr(LIGHTRED, BG_BLACK);
    var U = null;
    return {
        name: 'sedan',
        variants: [
            [
                [{ char: GLYPH.LOWER_HALF, attr: taillight }]
            ],
            [
                [{ char: GLYPH.LOWER_HALF, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.LOWER_HALF, attr: taillight }]
            ],
            [
                [{ char: GLYPH.UPPER_HALF, attr: body }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.UPPER_HALF, attr: body }],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [U, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [U, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }],
                [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
            ]
        ]
    };
}
function createTruckSprite(bodyColor, trimColor) {
    var body = makeAttr(bodyColor, BG_BLACK);
    var trim = makeAttr(trimColor, BG_BLACK);
    var wheel = makeAttr(DARKGRAY, BG_BLACK);
    var window = makeAttr(CYAN, BG_BLACK);
    var taillight = makeAttr(LIGHTRED, BG_BLACK);
    var U = null;
    return {
        name: 'truck',
        variants: [
            [
                [{ char: GLYPH.LOWER_HALF, attr: taillight }]
            ],
            [
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: body }],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [U, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }],
                [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
            ],
            [
                [U, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: body }],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }],
                [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
            ]
        ]
    };
}
function createSportsCarSprite(bodyColor, trimColor) {
    var body = makeAttr(bodyColor, BG_BLACK);
    var trim = makeAttr(trimColor, BG_BLACK);
    var window = makeAttr(CYAN, BG_BLACK);
    var taillight = makeAttr(LIGHTRED, BG_BLACK);
    var U = null;
    return {
        name: 'sportscar',
        variants: [
            [
                [{ char: GLYPH.LOWER_HALF, attr: taillight }]
            ],
            [
                [{ char: GLYPH.LOWER_HALF, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.LOWER_HALF, attr: taillight }]
            ],
            [
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [U, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [U, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ]
        ]
    };
}
var NPC_SPRITE_CACHE = {};
function getNPCSprite(vehicleType, colorIndex) {
    var color = NPC_VEHICLE_COLORS[colorIndex % NPC_VEHICLE_COLORS.length];
    var key = vehicleType + '_' + color.name;
    if (!NPC_SPRITE_CACHE[key]) {
        switch (vehicleType) {
            case 'sedan':
                NPC_SPRITE_CACHE[key] = createSedanSprite(color.body, color.trim);
                break;
            case 'truck':
                NPC_SPRITE_CACHE[key] = createTruckSprite(color.body, color.trim);
                break;
            case 'sportscar':
                NPC_SPRITE_CACHE[key] = createSportsCarSprite(color.body, color.trim);
                break;
            default:
                NPC_SPRITE_CACHE[key] = createSedanSprite(color.body, color.trim);
        }
    }
    return NPC_SPRITE_CACHE[key];
}
function getRandomNPCSprite() {
    var typeIndex = Math.floor(Math.random() * NPC_VEHICLE_TYPES.length);
    var colorIndex = Math.floor(Math.random() * NPC_VEHICLE_COLORS.length);
    var vehicleType = NPC_VEHICLE_TYPES[typeIndex];
    return {
        sprite: getNPCSprite(vehicleType, colorIndex),
        type: vehicleType,
        colorIndex: colorIndex
    };
}
