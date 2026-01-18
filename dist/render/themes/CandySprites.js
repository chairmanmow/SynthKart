"use strict";
var CandySprites = {
    createLollipop: function () {
        var candy1 = makeAttr(LIGHTRED, BG_BLACK);
        var candy2 = makeAttr(WHITE, BG_BLACK);
        var candy3 = makeAttr(LIGHTMAGENTA, BG_BLACK);
        var stick = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'lollipop',
            variants: [
                [
                    [{ char: '(', attr: candy1 }, { char: ')', attr: candy2 }],
                    [U, { char: '|', attr: stick }],
                    [U, { char: '|', attr: stick }]
                ],
                [
                    [U, { char: '@', attr: candy1 }, U],
                    [{ char: '(', attr: candy2 }, { char: '@', attr: candy3 }, { char: ')', attr: candy2 }],
                    [U, { char: '|', attr: stick }, U],
                    [U, { char: '|', attr: stick }, U]
                ],
                [
                    [U, { char: '/', attr: candy1 }, { char: '-', attr: candy2 }, { char: '\\', attr: candy1 }, U],
                    [{ char: '(', attr: candy2 }, { char: '@', attr: candy3 }, { char: '@', attr: candy1 }, { char: '@', attr: candy3 }, { char: ')', attr: candy2 }],
                    [U, { char: '\\', attr: candy1 }, { char: '-', attr: candy2 }, { char: '/', attr: candy1 }, U],
                    [U, U, { char: '|', attr: stick }, U, U],
                    [U, U, { char: '|', attr: stick }, U, U]
                ],
                [
                    [U, { char: '/', attr: candy1 }, { char: '~', attr: candy2 }, { char: '~', attr: candy3 }, { char: '\\', attr: candy1 }, U],
                    [{ char: '(', attr: candy2 }, { char: '@', attr: candy3 }, { char: '@', attr: candy1 }, { char: '@', attr: candy3 }, { char: '@', attr: candy1 }, { char: ')', attr: candy2 }],
                    [{ char: '(', attr: candy1 }, { char: '@', attr: candy2 }, { char: '@', attr: candy3 }, { char: '@', attr: candy2 }, { char: '@', attr: candy3 }, { char: ')', attr: candy1 }],
                    [U, { char: '\\', attr: candy2 }, { char: '~', attr: candy1 }, { char: '~', attr: candy2 }, { char: '/', attr: candy2 }, U],
                    [U, U, U, { char: '|', attr: stick }, U, U],
                    [U, U, U, { char: '|', attr: stick }, U, U]
                ],
                [
                    [U, { char: '/', attr: candy1 }, { char: '~', attr: candy2 }, { char: '~', attr: candy3 }, { char: '\\', attr: candy1 }, U],
                    [{ char: '(', attr: candy2 }, { char: '@', attr: candy3 }, { char: '@', attr: candy1 }, { char: '@', attr: candy3 }, { char: '@', attr: candy1 }, { char: ')', attr: candy2 }],
                    [{ char: '(', attr: candy1 }, { char: '@', attr: candy2 }, { char: '@', attr: candy3 }, { char: '@', attr: candy2 }, { char: '@', attr: candy3 }, { char: ')', attr: candy1 }],
                    [U, { char: '\\', attr: candy2 }, { char: '~', attr: candy1 }, { char: '~', attr: candy2 }, { char: '/', attr: candy2 }, U],
                    [U, U, U, { char: '|', attr: stick }, U, U],
                    [U, U, U, { char: '|', attr: stick }, U, U]
                ]
            ]
        };
    },
    createCandyCane: function () {
        var red = makeAttr(LIGHTRED, BG_BLACK);
        var white = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'candy_cane',
            variants: [
                [
                    [{ char: '/', attr: red }, { char: ')', attr: white }],
                    [{ char: '|', attr: white }, U],
                    [{ char: '|', attr: red }, U]
                ],
                [
                    [U, { char: '/', attr: red }, { char: ')', attr: white }],
                    [U, { char: '|', attr: white }, U],
                    [U, { char: '|', attr: red }, U],
                    [U, { char: '|', attr: white }, U]
                ],
                [
                    [U, { char: '_', attr: red }, { char: '/', attr: white }, { char: ')', attr: red }],
                    [{ char: '(', attr: white }, { char: '|', attr: red }, U, U],
                    [U, { char: '|', attr: white }, U, U],
                    [U, { char: '|', attr: red }, U, U],
                    [U, { char: '|', attr: white }, U, U]
                ],
                [
                    [U, { char: '_', attr: white }, { char: '_', attr: red }, { char: '/', attr: white }, { char: ')', attr: red }],
                    [{ char: '(', attr: red }, { char: '_', attr: white }, { char: '|', attr: red }, U, U],
                    [U, U, { char: '|', attr: white }, U, U],
                    [U, U, { char: '|', attr: red }, U, U],
                    [U, U, { char: '|', attr: white }, U, U],
                    [U, U, { char: '|', attr: red }, U, U]
                ],
                [
                    [U, { char: '_', attr: white }, { char: '_', attr: red }, { char: '/', attr: white }, { char: ')', attr: red }],
                    [{ char: '(', attr: red }, { char: '_', attr: white }, { char: '|', attr: red }, U, U],
                    [U, U, { char: '|', attr: white }, U, U],
                    [U, U, { char: '|', attr: red }, U, U],
                    [U, U, { char: '|', attr: white }, U, U],
                    [U, U, { char: '|', attr: red }, U, U]
                ]
            ]
        };
    },
    createGummyBear: function () {
        var body = makeAttr(LIGHTGREEN, BG_BLACK);
        var bodyDark = makeAttr(GREEN, BG_BLACK);
        var eye = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'gummy_bear',
            variants: [
                [
                    [{ char: '(', attr: body }, { char: ')', attr: body }],
                    [{ char: GLYPH.LOWER_HALF, attr: bodyDark }, { char: GLYPH.LOWER_HALF, attr: bodyDark }]
                ],
                [
                    [{ char: 'o', attr: body }, U, { char: 'o', attr: body }],
                    [{ char: '(', attr: body }, { char: GLYPH.FULL_BLOCK, attr: bodyDark }, { char: ')', attr: body }],
                    [{ char: '/', attr: bodyDark }, U, { char: '\\', attr: bodyDark }]
                ],
                [
                    [{ char: '(', attr: body }, { char: ')', attr: body }, U, { char: '(', attr: body }, { char: ')', attr: body }],
                    [U, { char: '(', attr: body }, { char: GLYPH.FULL_BLOCK, attr: bodyDark }, { char: ')', attr: body }, U],
                    [U, { char: '(', attr: bodyDark }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: ')', attr: bodyDark }, U],
                    [U, { char: '/', attr: bodyDark }, U, { char: '\\', attr: bodyDark }, U]
                ],
                [
                    [{ char: '(', attr: body }, { char: ')', attr: body }, U, { char: '(', attr: body }, { char: ')', attr: body }],
                    [U, { char: '(', attr: body }, { char: GLYPH.FULL_BLOCK, attr: bodyDark }, { char: ')', attr: body }, U],
                    [U, { char: '.', attr: eye }, { char: 'u', attr: bodyDark }, { char: '.', attr: eye }, U],
                    [U, { char: '(', attr: bodyDark }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: ')', attr: bodyDark }, U],
                    [U, { char: '/', attr: bodyDark }, U, { char: '\\', attr: bodyDark }, U]
                ],
                [
                    [{ char: '(', attr: body }, { char: ')', attr: body }, U, { char: '(', attr: body }, { char: ')', attr: body }],
                    [U, { char: '(', attr: body }, { char: GLYPH.FULL_BLOCK, attr: bodyDark }, { char: ')', attr: body }, U],
                    [U, { char: '.', attr: eye }, { char: 'u', attr: bodyDark }, { char: '.', attr: eye }, U],
                    [U, { char: '(', attr: bodyDark }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: ')', attr: bodyDark }, U],
                    [U, { char: '/', attr: bodyDark }, U, { char: '\\', attr: bodyDark }, U]
                ]
            ]
        };
    },
    createCupcake: function () {
        var frosting = makeAttr(LIGHTMAGENTA, BG_BLACK);
        var frostingAlt = makeAttr(LIGHTCYAN, BG_BLACK);
        var wrapper = makeAttr(BROWN, BG_BLACK);
        var cherry = makeAttr(LIGHTRED, BG_BLACK);
        var U = null;
        return {
            name: 'cupcake',
            variants: [
                [
                    [{ char: GLYPH.UPPER_HALF, attr: frosting }, { char: GLYPH.UPPER_HALF, attr: frosting }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wrapper }, { char: GLYPH.FULL_BLOCK, attr: wrapper }]
                ],
                [
                    [U, { char: 'o', attr: cherry }, U],
                    [{ char: '~', attr: frosting }, { char: '~', attr: frostingAlt }, { char: '~', attr: frosting }],
                    [{ char: '\\', attr: wrapper }, { char: GLYPH.FULL_BLOCK, attr: wrapper }, { char: '/', attr: wrapper }]
                ],
                [
                    [U, { char: 'o', attr: cherry }, U, U],
                    [{ char: '~', attr: frosting }, { char: '~', attr: frostingAlt }, { char: '~', attr: frosting }, { char: '~', attr: frostingAlt }],
                    [{ char: '~', attr: frostingAlt }, { char: '~', attr: frosting }, { char: '~', attr: frostingAlt }, { char: '~', attr: frosting }],
                    [{ char: '\\', attr: wrapper }, { char: GLYPH.FULL_BLOCK, attr: wrapper }, { char: GLYPH.FULL_BLOCK, attr: wrapper }, { char: '/', attr: wrapper }]
                ],
                [
                    [U, U, { char: 'o', attr: cherry }, U, U],
                    [U, { char: '/', attr: frosting }, { char: '~', attr: frostingAlt }, { char: '\\', attr: frosting }, U],
                    [{ char: '~', attr: frosting }, { char: '~', attr: frostingAlt }, { char: '~', attr: frosting }, { char: '~', attr: frostingAlt }, { char: '~', attr: frosting }],
                    [{ char: '~', attr: frostingAlt }, { char: '~', attr: frosting }, { char: '~', attr: frostingAlt }, { char: '~', attr: frosting }, { char: '~', attr: frostingAlt }],
                    [U, { char: '\\', attr: wrapper }, { char: GLYPH.FULL_BLOCK, attr: wrapper }, { char: '/', attr: wrapper }, U]
                ],
                [
                    [U, U, { char: 'o', attr: cherry }, U, U],
                    [U, { char: '/', attr: frosting }, { char: '~', attr: frostingAlt }, { char: '\\', attr: frosting }, U],
                    [{ char: '~', attr: frosting }, { char: '~', attr: frostingAlt }, { char: '~', attr: frosting }, { char: '~', attr: frostingAlt }, { char: '~', attr: frosting }],
                    [{ char: '~', attr: frostingAlt }, { char: '~', attr: frosting }, { char: '~', attr: frostingAlt }, { char: '~', attr: frosting }, { char: '~', attr: frostingAlt }],
                    [U, { char: '\\', attr: wrapper }, { char: GLYPH.FULL_BLOCK, attr: wrapper }, { char: '/', attr: wrapper }, U]
                ]
            ]
        };
    },
    createIceCream: function () {
        var scoop1 = makeAttr(LIGHTMAGENTA, BG_BLACK);
        var scoop2 = makeAttr(BROWN, BG_BLACK);
        var scoop3 = makeAttr(WHITE, BG_BLACK);
        var cone = makeAttr(YELLOW, BG_BLACK);
        var coneDark = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'ice_cream',
            variants: [
                [
                    [{ char: '(', attr: scoop1 }, { char: ')', attr: scoop1 }],
                    [{ char: '\\', attr: cone }, { char: '/', attr: cone }],
                    [U, { char: 'V', attr: coneDark }]
                ],
                [
                    [U, { char: '@', attr: scoop1 }, U],
                    [{ char: '(', attr: scoop2 }, { char: '@', attr: scoop3 }, { char: ')', attr: scoop2 }],
                    [U, { char: '\\', attr: cone }, { char: '/', attr: cone }],
                    [U, U, { char: 'V', attr: coneDark }]
                ],
                [
                    [U, { char: '@', attr: scoop1 }, { char: '@', attr: scoop1 }, U],
                    [{ char: '(', attr: scoop2 }, { char: '@', attr: scoop3 }, { char: '@', attr: scoop2 }, { char: ')', attr: scoop3 }],
                    [U, { char: '(', attr: scoop2 }, { char: ')', attr: scoop3 }, U],
                    [U, { char: '\\', attr: cone }, { char: '/', attr: cone }, U],
                    [U, U, { char: 'V', attr: coneDark }, U]
                ],
                [
                    [U, { char: '(', attr: scoop1 }, { char: '@', attr: scoop1 }, { char: ')', attr: scoop1 }, U],
                    [{ char: '(', attr: scoop2 }, { char: '@', attr: scoop2 }, { char: '@', attr: scoop3 }, { char: '@', attr: scoop2 }, { char: ')', attr: scoop3 }],
                    [U, { char: '(', attr: scoop3 }, { char: '@', attr: scoop2 }, { char: ')', attr: scoop3 }, U],
                    [U, { char: '\\', attr: cone }, { char: '#', attr: cone }, { char: '/', attr: cone }, U],
                    [U, U, { char: '\\', attr: coneDark }, { char: '/', attr: coneDark }, U],
                    [U, U, U, { char: 'V', attr: coneDark }, U]
                ],
                [
                    [U, { char: '(', attr: scoop1 }, { char: '@', attr: scoop1 }, { char: ')', attr: scoop1 }, U],
                    [{ char: '(', attr: scoop2 }, { char: '@', attr: scoop2 }, { char: '@', attr: scoop3 }, { char: '@', attr: scoop2 }, { char: ')', attr: scoop3 }],
                    [U, { char: '(', attr: scoop3 }, { char: '@', attr: scoop2 }, { char: ')', attr: scoop3 }, U],
                    [U, { char: '\\', attr: cone }, { char: '#', attr: cone }, { char: '/', attr: cone }, U],
                    [U, U, { char: '\\', attr: coneDark }, { char: '/', attr: coneDark }, U],
                    [U, U, U, { char: 'V', attr: coneDark }, U]
                ]
            ]
        };
    },
    createCottonCandy: function () {
        var fluff1 = makeAttr(LIGHTMAGENTA, BG_BLACK);
        var fluff2 = makeAttr(LIGHTCYAN, BG_BLACK);
        var stick = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'cotton_candy',
            variants: [
                [
                    [{ char: '(', attr: fluff1 }, { char: ')', attr: fluff2 }],
                    [{ char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }],
                    [U, { char: '|', attr: stick }]
                ],
                [
                    [{ char: '(', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: ')', attr: fluff1 }],
                    [{ char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }],
                    [U, { char: '@', attr: fluff1 }, U],
                    [U, { char: '|', attr: stick }, U]
                ],
                [
                    [U, { char: '(', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: ')', attr: fluff1 }, U],
                    [{ char: '(', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: ')', attr: fluff2 }],
                    [{ char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }],
                    [U, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, U],
                    [U, U, { char: '|', attr: stick }, U, U]
                ],
                [
                    [U, { char: '(', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: ')', attr: fluff1 }, U],
                    [{ char: '(', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: ')', attr: fluff2 }],
                    [{ char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }],
                    [{ char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }],
                    [U, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, U],
                    [U, U, U, { char: '|', attr: stick }, U, U]
                ],
                [
                    [U, { char: '(', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: ')', attr: fluff1 }, U],
                    [{ char: '(', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: ')', attr: fluff2 }],
                    [{ char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }],
                    [{ char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }],
                    [U, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, { char: '@', attr: fluff2 }, { char: '@', attr: fluff1 }, U],
                    [U, U, U, { char: '|', attr: stick }, U, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('lollipop', CandySprites.createLollipop);
registerRoadsideSprite('candy_cane', CandySprites.createCandyCane);
registerRoadsideSprite('gummy_bear', CandySprites.createGummyBear);
registerRoadsideSprite('cupcake', CandySprites.createCupcake);
registerRoadsideSprite('ice_cream', CandySprites.createIceCream);
registerRoadsideSprite('cotton_candy', CandySprites.createCottonCandy);
