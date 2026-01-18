"use strict";
var StadiumSprites = {
    createGrandstand: function () {
        var structure = makeAttr(DARKGRAY, BG_BLACK);
        var fans1 = makeAttr(LIGHTRED, BG_BLACK);
        var fans2 = makeAttr(YELLOW, BG_BLACK);
        var fans3 = makeAttr(LIGHTCYAN, BG_BLACK);
        var rail = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'grandstand',
            variants: [
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.MEDIUM_SHADE, attr: fans1 }, { char: GLYPH.MEDIUM_SHADE, attr: fans2 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.DARK_SHADE, attr: fans3 }, { char: GLYPH.DARK_SHADE, attr: fans1 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: '-', attr: rail }, { char: '-', attr: rail }, { char: '-', attr: rail }, { char: '-', attr: rail }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }]
                ],
                [
                    [{ char: '/', attr: structure }, { char: GLYPH.MEDIUM_SHADE, attr: fans1 }, { char: GLYPH.MEDIUM_SHADE, attr: fans2 }, { char: GLYPH.MEDIUM_SHADE, attr: fans3 }, { char: GLYPH.MEDIUM_SHADE, attr: fans1 }, { char: GLYPH.MEDIUM_SHADE, attr: fans2 }, { char: '\\', attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: '[', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: ']', attr: rail }]
                ],
                [
                    [U, { char: '/', attr: structure }, { char: '_', attr: structure }, { char: '_', attr: structure }, { char: '_', attr: structure }, { char: '_', attr: structure }, { char: '_', attr: structure }, { char: '\\', attr: structure }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: '[', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: ']', attr: rail }]
                ],
                [
                    [U, { char: '/', attr: structure }, { char: '_', attr: structure }, { char: '_', attr: structure }, { char: '_', attr: structure }, { char: '_', attr: structure }, { char: '_', attr: structure }, { char: '\\', attr: structure }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: 'o', attr: fans3 }, { char: 'o', attr: fans1 }, { char: 'o', attr: fans2 }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }, { char: GLYPH.FULL_BLOCK, attr: structure }],
                    [{ char: '[', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: '=', attr: rail }, { char: ']', attr: rail }]
                ]
            ]
        };
    },
    createTireStack: function () {
        var tire = makeAttr(DARKGRAY, BG_BLACK);
        var tireInner = makeAttr(BLACK, BG_BLACK);
        var paint = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'tire_stack',
            variants: [
                [
                    [{ char: 'O', attr: tire }, { char: 'O', attr: paint }],
                    [{ char: 'O', attr: paint }, { char: 'O', attr: tire }]
                ],
                [
                    [U, { char: 'O', attr: paint }, U],
                    [{ char: 'O', attr: tire }, { char: 'O', attr: paint }, { char: 'O', attr: tire }],
                    [{ char: 'O', attr: paint }, { char: 'O', attr: tire }, { char: 'O', attr: paint }]
                ],
                [
                    [U, { char: 'O', attr: paint }, { char: 'O', attr: tire }, U],
                    [{ char: '(', attr: tire }, { char: '0', attr: tireInner }, { char: '0', attr: tireInner }, { char: ')', attr: tire }],
                    [{ char: '(', attr: paint }, { char: '0', attr: tireInner }, { char: '0', attr: tireInner }, { char: ')', attr: paint }],
                    [{ char: '(', attr: tire }, { char: '0', attr: tireInner }, { char: '0', attr: tireInner }, { char: ')', attr: tire }]
                ],
                [
                    [U, U, { char: 'O', attr: paint }, U, U],
                    [U, { char: '(', attr: tire }, { char: '0', attr: tireInner }, { char: ')', attr: tire }, U],
                    [{ char: '(', attr: paint }, { char: '0', attr: tireInner }, { char: GLYPH.FULL_BLOCK, attr: tire }, { char: '0', attr: tireInner }, { char: ')', attr: paint }],
                    [{ char: '(', attr: tire }, { char: '0', attr: tireInner }, { char: GLYPH.FULL_BLOCK, attr: paint }, { char: '0', attr: tireInner }, { char: ')', attr: tire }],
                    [{ char: '(', attr: paint }, { char: '0', attr: tireInner }, { char: GLYPH.FULL_BLOCK, attr: tire }, { char: '0', attr: tireInner }, { char: ')', attr: paint }]
                ],
                [
                    [U, U, { char: 'O', attr: paint }, U, U],
                    [U, { char: '(', attr: tire }, { char: '0', attr: tireInner }, { char: ')', attr: tire }, U],
                    [{ char: '(', attr: paint }, { char: '0', attr: tireInner }, { char: GLYPH.FULL_BLOCK, attr: tire }, { char: '0', attr: tireInner }, { char: ')', attr: paint }],
                    [{ char: '(', attr: tire }, { char: '0', attr: tireInner }, { char: GLYPH.FULL_BLOCK, attr: paint }, { char: '0', attr: tireInner }, { char: ')', attr: tire }],
                    [{ char: '(', attr: paint }, { char: '0', attr: tireInner }, { char: GLYPH.FULL_BLOCK, attr: tire }, { char: '0', attr: tireInner }, { char: ')', attr: paint }]
                ]
            ]
        };
    },
    createHayBale: function () {
        var hay = makeAttr(YELLOW, BG_BLACK);
        var hayDark = makeAttr(BROWN, BG_BLACK);
        var twine = makeAttr(BROWN, BG_BLACK);
        return {
            name: 'hay_bale',
            variants: [
                [
                    [{ char: '[', attr: hay }, { char: ']', attr: hay }]
                ],
                [
                    [{ char: '/', attr: hay }, { char: '~', attr: hayDark }, { char: '\\', attr: hay }],
                    [{ char: '[', attr: hay }, { char: '=', attr: twine }, { char: ']', attr: hay }]
                ],
                [
                    [{ char: '/', attr: hay }, { char: GLYPH.MEDIUM_SHADE, attr: hayDark }, { char: GLYPH.MEDIUM_SHADE, attr: hay }, { char: '\\', attr: hay }],
                    [{ char: '[', attr: hay }, { char: '=', attr: twine }, { char: '=', attr: twine }, { char: ']', attr: hay }]
                ],
                [
                    [{ char: '/', attr: hay }, { char: '~', attr: hayDark }, { char: '~', attr: hay }, { char: '~', attr: hayDark }, { char: '\\', attr: hay }],
                    [{ char: '[', attr: hay }, { char: GLYPH.MEDIUM_SHADE, attr: hayDark }, { char: '|', attr: twine }, { char: GLYPH.MEDIUM_SHADE, attr: hay }, { char: ']', attr: hay }],
                    [{ char: '\\', attr: hay }, { char: '_', attr: hayDark }, { char: '=', attr: twine }, { char: '_', attr: hay }, { char: '/', attr: hay }]
                ],
                [
                    [{ char: '/', attr: hay }, { char: '~', attr: hayDark }, { char: '~', attr: hay }, { char: '~', attr: hayDark }, { char: '\\', attr: hay }],
                    [{ char: '[', attr: hay }, { char: GLYPH.MEDIUM_SHADE, attr: hayDark }, { char: '|', attr: twine }, { char: GLYPH.MEDIUM_SHADE, attr: hay }, { char: ']', attr: hay }],
                    [{ char: '\\', attr: hay }, { char: '_', attr: hayDark }, { char: '=', attr: twine }, { char: '_', attr: hay }, { char: '/', attr: hay }]
                ]
            ]
        };
    },
    createFlagMarshal: function () {
        var uniform = makeAttr(WHITE, BG_BLACK);
        var pants = makeAttr(DARKGRAY, BG_BLACK);
        var flag = makeAttr(YELLOW, BG_BLACK);
        var flagAlt = makeAttr(LIGHTGREEN, BG_BLACK);
        var U = null;
        return {
            name: 'flag_marshal',
            variants: [
                [
                    [{ char: '\\', attr: flag }],
                    [{ char: 'o', attr: uniform }],
                    [{ char: '|', attr: pants }]
                ],
                [
                    [{ char: '~', attr: flag }, { char: '>', attr: flag }],
                    [U, { char: 'O', attr: uniform }],
                    [{ char: '/', attr: uniform }, { char: '\\', attr: uniform }],
                    [{ char: '/', attr: pants }, { char: '\\', attr: pants }]
                ],
                [
                    [{ char: '~', attr: flagAlt }, { char: '~', attr: flagAlt }, { char: '>', attr: flagAlt }],
                    [U, { char: '|', attr: uniform }, U],
                    [U, { char: 'O', attr: uniform }, U],
                    [{ char: '/', attr: uniform }, { char: '|', attr: uniform }, { char: '\\', attr: uniform }],
                    [{ char: '/', attr: pants }, U, { char: '\\', attr: pants }]
                ],
                [
                    [U, { char: '~', attr: flag }, { char: '~', attr: flag }, { char: '>', attr: flag }],
                    [U, U, { char: '|', attr: uniform }, U],
                    [U, { char: '(', attr: uniform }, { char: ')', attr: uniform }, U],
                    [U, { char: '/', attr: uniform }, { char: '\\', attr: uniform }, U],
                    [U, { char: '|', attr: pants }, { char: '|', attr: pants }, U],
                    [{ char: '/', attr: pants }, U, U, { char: '\\', attr: pants }]
                ],
                [
                    [U, { char: '~', attr: flag }, { char: '~', attr: flag }, { char: '>', attr: flag }],
                    [U, U, { char: '|', attr: uniform }, U],
                    [U, { char: '(', attr: uniform }, { char: ')', attr: uniform }, U],
                    [U, { char: '/', attr: uniform }, { char: '\\', attr: uniform }, U],
                    [U, { char: '|', attr: pants }, { char: '|', attr: pants }, U],
                    [{ char: '/', attr: pants }, U, U, { char: '\\', attr: pants }]
                ]
            ]
        };
    },
    createPitCrew: function () {
        var helmet = makeAttr(LIGHTRED, BG_BLACK);
        var suit = makeAttr(RED, BG_BLACK);
        var tool = makeAttr(LIGHTGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'pit_crew',
            variants: [
                [
                    [{ char: 'o', attr: helmet }],
                    [{ char: '#', attr: suit }],
                    [{ char: 'A', attr: suit }]
                ],
                [
                    [{ char: '(', attr: helmet }, { char: ')', attr: helmet }],
                    [{ char: '[', attr: suit }, { char: ']', attr: suit }],
                    [{ char: '/', attr: suit }, { char: '\\', attr: suit }],
                    [{ char: '|', attr: suit }, { char: '|', attr: suit }]
                ],
                [
                    [U, { char: '@', attr: helmet }, U],
                    [{ char: '/', attr: tool }, { char: '#', attr: suit }, { char: '\\', attr: suit }],
                    [{ char: '|', attr: tool }, { char: '#', attr: suit }, { char: '|', attr: suit }],
                    [U, { char: '/', attr: suit }, { char: '\\', attr: suit }],
                    [U, { char: '|', attr: suit }, { char: '|', attr: suit }]
                ],
                [
                    [U, { char: '(', attr: helmet }, { char: ')', attr: helmet }, U],
                    [{ char: '/', attr: tool }, { char: '[', attr: suit }, { char: ']', attr: suit }, { char: '\\', attr: suit }],
                    [{ char: '|', attr: tool }, { char: '[', attr: suit }, { char: ']', attr: suit }, U],
                    [U, { char: '[', attr: suit }, { char: ']', attr: suit }, U],
                    [U, { char: '/', attr: suit }, { char: '\\', attr: suit }, U],
                    [U, { char: '|', attr: suit }, { char: '|', attr: suit }, U]
                ],
                [
                    [U, { char: '(', attr: helmet }, { char: ')', attr: helmet }, U],
                    [{ char: '/', attr: tool }, { char: '[', attr: suit }, { char: ']', attr: suit }, { char: '\\', attr: suit }],
                    [{ char: '|', attr: tool }, { char: '[', attr: suit }, { char: ']', attr: suit }, U],
                    [U, { char: '[', attr: suit }, { char: ']', attr: suit }, U],
                    [U, { char: '/', attr: suit }, { char: '\\', attr: suit }, U],
                    [U, { char: '|', attr: suit }, { char: '|', attr: suit }, U]
                ]
            ]
        };
    },
    createBanner: function () {
        var frame = makeAttr(DARKGRAY, BG_BLACK);
        var banner1 = makeAttr(LIGHTRED, BG_RED);
        var banner2 = makeAttr(YELLOW, BG_BROWN);
        var banner3 = makeAttr(LIGHTCYAN, BG_CYAN);
        var pole = makeAttr(LIGHTGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'banner',
            variants: [
                [
                    [{ char: '[', attr: frame }, { char: '#', attr: banner1 }, { char: ']', attr: frame }],
                    [U, { char: '|', attr: pole }, U]
                ],
                [
                    [{ char: '[', attr: frame }, { char: GLYPH.FULL_BLOCK, attr: banner2 }, { char: GLYPH.FULL_BLOCK, attr: banner2 }, { char: ']', attr: frame }],
                    [U, { char: '|', attr: pole }, { char: '|', attr: pole }, U],
                    [U, { char: '|', attr: pole }, { char: '|', attr: pole }, U]
                ],
                [
                    [{ char: '/', attr: frame }, { char: '-', attr: frame }, { char: '-', attr: frame }, { char: '-', attr: frame }, { char: '\\', attr: frame }],
                    [{ char: '|', attr: frame }, { char: GLYPH.FULL_BLOCK, attr: banner1 }, { char: GLYPH.FULL_BLOCK, attr: banner1 }, { char: GLYPH.FULL_BLOCK, attr: banner1 }, { char: '|', attr: frame }],
                    [U, U, { char: '|', attr: pole }, U, U],
                    [U, U, { char: '|', attr: pole }, U, U]
                ],
                [
                    [{ char: '/', attr: frame }, { char: '-', attr: frame }, { char: '-', attr: frame }, { char: '-', attr: frame }, { char: '-', attr: frame }, { char: '\\', attr: frame }],
                    [{ char: '|', attr: frame }, { char: GLYPH.FULL_BLOCK, attr: banner3 }, { char: GLYPH.FULL_BLOCK, attr: banner3 }, { char: GLYPH.FULL_BLOCK, attr: banner3 }, { char: GLYPH.FULL_BLOCK, attr: banner3 }, { char: '|', attr: frame }],
                    [{ char: '\\', attr: frame }, { char: '_', attr: frame }, { char: '_', attr: frame }, { char: '_', attr: frame }, { char: '_', attr: frame }, { char: '/', attr: frame }],
                    [U, U, { char: '|', attr: pole }, { char: '|', attr: pole }, U, U],
                    [U, U, { char: '|', attr: pole }, { char: '|', attr: pole }, U, U]
                ],
                [
                    [{ char: '/', attr: frame }, { char: '-', attr: frame }, { char: '-', attr: frame }, { char: '-', attr: frame }, { char: '-', attr: frame }, { char: '\\', attr: frame }],
                    [{ char: '|', attr: frame }, { char: GLYPH.FULL_BLOCK, attr: banner2 }, { char: GLYPH.FULL_BLOCK, attr: banner2 }, { char: GLYPH.FULL_BLOCK, attr: banner2 }, { char: GLYPH.FULL_BLOCK, attr: banner2 }, { char: '|', attr: frame }],
                    [{ char: '\\', attr: frame }, { char: '_', attr: frame }, { char: '_', attr: frame }, { char: '_', attr: frame }, { char: '_', attr: frame }, { char: '/', attr: frame }],
                    [U, U, { char: '|', attr: pole }, { char: '|', attr: pole }, U, U],
                    [U, U, { char: '|', attr: pole }, { char: '|', attr: pole }, U, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('grandstand', StadiumSprites.createGrandstand);
registerRoadsideSprite('tire_stack', StadiumSprites.createTireStack);
registerRoadsideSprite('hay_bale', StadiumSprites.createHayBale);
registerRoadsideSprite('flag_marshal', StadiumSprites.createFlagMarshal);
registerRoadsideSprite('pit_crew', StadiumSprites.createPitCrew);
registerRoadsideSprite('banner', StadiumSprites.createBanner);
