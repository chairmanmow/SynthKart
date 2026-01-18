"use strict";
var JungleSprites = {
    createJungleTree: function () {
        var leaf = makeAttr(GREEN, BG_BLACK);
        var leafBright = makeAttr(LIGHTGREEN, BG_BLACK);
        var trunk = makeAttr(BROWN, BG_BLACK);
        var trunkDark = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'jungle_tree',
            variants: [
                [
                    [{ char: '@', attr: leaf }, { char: '@', attr: leafBright }],
                    [U, { char: '|', attr: trunk }],
                    [U, { char: '|', attr: trunk }]
                ],
                [
                    [{ char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }],
                    [{ char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }],
                    [U, { char: '|', attr: trunk }, U],
                    [U, { char: '|', attr: trunk }, U]
                ],
                [
                    [U, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, U],
                    [{ char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }],
                    [{ char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '|', attr: trunk }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }],
                    [U, U, { char: '|', attr: trunk }, U, U],
                    [U, U, { char: '|', attr: trunkDark }, U, U]
                ],
                [
                    [U, U, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, U, U],
                    [U, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, U],
                    [{ char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }],
                    [{ char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '\\', attr: trunk }, { char: '|', attr: trunk }, { char: '/', attr: trunk }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U],
                    [U, U, U, { char: '|', attr: trunkDark }, U, U, U]
                ],
                [
                    [U, U, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, U, U],
                    [U, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, U],
                    [{ char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }],
                    [{ char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '|', attr: trunk }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }, { char: '@', attr: leaf }, { char: '@', attr: leafBright }],
                    [U, U, { char: '@', attr: leaf }, { char: '\\', attr: trunk }, { char: '|', attr: trunk }, { char: '/', attr: trunk }, { char: '@', attr: leaf }, U, U],
                    [U, U, U, U, { char: '|', attr: trunk }, U, U, U, U],
                    [U, U, U, U, { char: '|', attr: trunkDark }, U, U, U, U]
                ]
            ]
        };
    },
    createFern: function () {
        var frond = makeAttr(GREEN, BG_BLACK);
        var frondLight = makeAttr(LIGHTGREEN, BG_BLACK);
        var U = null;
        return {
            name: 'fern',
            variants: [
                [
                    [{ char: '/', attr: frond }, { char: '\\', attr: frond }],
                    [{ char: '/', attr: frondLight }, { char: '\\', attr: frondLight }]
                ],
                [
                    [{ char: '/', attr: frond }, { char: '|', attr: frondLight }, { char: '\\', attr: frond }],
                    [{ char: '/', attr: frondLight }, { char: '|', attr: frond }, { char: '\\', attr: frondLight }]
                ],
                [
                    [{ char: '/', attr: frondLight }, { char: '/', attr: frond }, { char: '|', attr: frondLight }, { char: '\\', attr: frond }, { char: '\\', attr: frondLight }],
                    [{ char: '/', attr: frond }, { char: '/', attr: frondLight }, { char: '|', attr: frond }, { char: '\\', attr: frondLight }, { char: '\\', attr: frond }],
                    [U, { char: '/', attr: frond }, { char: '|', attr: frondLight }, { char: '\\', attr: frond }, U]
                ],
                [
                    [{ char: '/', attr: frond }, { char: '/', attr: frondLight }, { char: '/', attr: frond }, { char: '|', attr: frondLight }, { char: '\\', attr: frond }, { char: '\\', attr: frondLight }, { char: '\\', attr: frond }],
                    [U, { char: '/', attr: frondLight }, { char: '/', attr: frond }, { char: '|', attr: frondLight }, { char: '\\', attr: frond }, { char: '\\', attr: frondLight }, U],
                    [U, U, { char: '/', attr: frond }, { char: '|', attr: frondLight }, { char: '\\', attr: frond }, U, U],
                    [U, U, U, { char: '|', attr: frond }, U, U, U]
                ],
                [
                    [{ char: '/', attr: frond }, { char: '/', attr: frondLight }, { char: '/', attr: frond }, { char: '|', attr: frondLight }, { char: '\\', attr: frond }, { char: '\\', attr: frondLight }, { char: '\\', attr: frond }],
                    [U, { char: '/', attr: frondLight }, { char: '/', attr: frond }, { char: '|', attr: frondLight }, { char: '\\', attr: frond }, { char: '\\', attr: frondLight }, U],
                    [U, U, { char: '/', attr: frond }, { char: '|', attr: frondLight }, { char: '\\', attr: frond }, U, U],
                    [U, U, U, { char: '|', attr: frond }, U, U, U]
                ]
            ]
        };
    },
    createVine: function () {
        var vine = makeAttr(GREEN, BG_BLACK);
        var vineLight = makeAttr(LIGHTGREEN, BG_BLACK);
        var flower = makeAttr(LIGHTMAGENTA, BG_BLACK);
        return {
            name: 'vine',
            variants: [
                [
                    [{ char: '|', attr: vine }],
                    [{ char: ')', attr: vineLight }],
                    [{ char: '|', attr: vine }]
                ],
                [
                    [{ char: '(', attr: vine }, { char: ')', attr: vineLight }],
                    [{ char: ')', attr: vineLight }, { char: '(', attr: vine }],
                    [{ char: '|', attr: vine }, { char: ')', attr: vineLight }],
                    [{ char: ')', attr: vineLight }, { char: '|', attr: vine }]
                ],
                [
                    [{ char: '(', attr: vineLight }, { char: '|', attr: vine }, { char: ')', attr: vineLight }],
                    [{ char: ')', attr: vine }, { char: '*', attr: flower }, { char: '(', attr: vine }],
                    [{ char: '|', attr: vineLight }, { char: ')', attr: vine }, { char: '|', attr: vineLight }],
                    [{ char: ')', attr: vine }, { char: '|', attr: vineLight }, { char: '(', attr: vine }],
                    [{ char: '|', attr: vineLight }, { char: '(', attr: vine }, { char: '|', attr: vineLight }]
                ],
                [
                    [{ char: '(', attr: vine }, { char: '(', attr: vineLight }, { char: ')', attr: vineLight }, { char: ')', attr: vine }],
                    [{ char: ')', attr: vineLight }, { char: '*', attr: flower }, { char: '*', attr: flower }, { char: '(', attr: vineLight }],
                    [{ char: '|', attr: vine }, { char: ')', attr: vineLight }, { char: '(', attr: vineLight }, { char: '|', attr: vine }],
                    [{ char: ')', attr: vineLight }, { char: '|', attr: vine }, { char: '|', attr: vine }, { char: '(', attr: vineLight }],
                    [{ char: '(', attr: vine }, { char: ')', attr: vineLight }, { char: '(', attr: vineLight }, { char: ')', attr: vine }],
                    [{ char: '|', attr: vineLight }, { char: '|', attr: vine }, { char: '|', attr: vine }, { char: '|', attr: vineLight }]
                ],
                [
                    [{ char: '(', attr: vine }, { char: '(', attr: vineLight }, { char: ')', attr: vineLight }, { char: ')', attr: vine }],
                    [{ char: ')', attr: vineLight }, { char: '*', attr: flower }, { char: '*', attr: flower }, { char: '(', attr: vineLight }],
                    [{ char: '|', attr: vine }, { char: ')', attr: vineLight }, { char: '(', attr: vineLight }, { char: '|', attr: vine }],
                    [{ char: ')', attr: vineLight }, { char: '|', attr: vine }, { char: '|', attr: vine }, { char: '(', attr: vineLight }],
                    [{ char: '(', attr: vine }, { char: ')', attr: vineLight }, { char: '(', attr: vineLight }, { char: ')', attr: vine }],
                    [{ char: '|', attr: vineLight }, { char: '|', attr: vine }, { char: '|', attr: vine }, { char: '|', attr: vineLight }]
                ]
            ]
        };
    },
    createFlower: function () {
        var petal = makeAttr(LIGHTMAGENTA, BG_BLACK);
        var petalDark = makeAttr(MAGENTA, BG_BLACK);
        var center = makeAttr(YELLOW, BG_BLACK);
        var stem = makeAttr(GREEN, BG_BLACK);
        var leaf = makeAttr(LIGHTGREEN, BG_BLACK);
        var U = null;
        return {
            name: 'flower',
            variants: [
                [
                    [{ char: '*', attr: petal }],
                    [{ char: '|', attr: stem }]
                ],
                [
                    [U, { char: '*', attr: petal }, U],
                    [{ char: '*', attr: petalDark }, { char: 'o', attr: center }, { char: '*', attr: petalDark }],
                    [U, { char: '|', attr: stem }, U]
                ],
                [
                    [U, { char: '*', attr: petal }, { char: '*', attr: petalDark }, { char: '*', attr: petal }, U],
                    [{ char: '*', attr: petalDark }, { char: '*', attr: petal }, { char: '@', attr: center }, { char: '*', attr: petal }, { char: '*', attr: petalDark }],
                    [U, { char: '*', attr: petal }, { char: '|', attr: stem }, { char: '*', attr: petal }, U],
                    [U, { char: '/', attr: leaf }, { char: '|', attr: stem }, { char: '\\', attr: leaf }, U]
                ],
                [
                    [U, { char: '*', attr: petal }, { char: '*', attr: petalDark }, { char: '*', attr: petal }, U],
                    [{ char: '*', attr: petalDark }, { char: '*', attr: petal }, { char: '@', attr: center }, { char: '*', attr: petal }, { char: '*', attr: petalDark }],
                    [{ char: '*', attr: petal }, { char: '*', attr: petalDark }, { char: '*', attr: petal }, { char: '*', attr: petalDark }, { char: '*', attr: petal }],
                    [U, { char: '/', attr: leaf }, { char: '|', attr: stem }, { char: '\\', attr: leaf }, U],
                    [U, U, { char: '|', attr: stem }, U, U]
                ],
                [
                    [U, { char: '*', attr: petal }, { char: '*', attr: petalDark }, { char: '*', attr: petal }, U],
                    [{ char: '*', attr: petalDark }, { char: '*', attr: petal }, { char: '@', attr: center }, { char: '*', attr: petal }, { char: '*', attr: petalDark }],
                    [{ char: '*', attr: petal }, { char: '*', attr: petalDark }, { char: '*', attr: petal }, { char: '*', attr: petalDark }, { char: '*', attr: petal }],
                    [U, { char: '/', attr: leaf }, { char: '|', attr: stem }, { char: '\\', attr: leaf }, U],
                    [U, U, { char: '|', attr: stem }, U, U]
                ]
            ]
        };
    },
    createParrot: function () {
        var body = makeAttr(LIGHTRED, BG_BLACK);
        var wing = makeAttr(LIGHTBLUE, BG_BLACK);
        var beak = makeAttr(YELLOW, BG_BLACK);
        var tail = makeAttr(LIGHTGREEN, BG_BLACK);
        var eye = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'parrot',
            variants: [
                [
                    [{ char: '(', attr: body }, { char: '>', attr: beak }],
                    [{ char: '~', attr: tail }, { char: ')', attr: body }]
                ],
                [
                    [U, { char: '(', attr: body }, { char: '<', attr: beak }],
                    [{ char: '/', attr: wing }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: ')', attr: body }],
                    [U, { char: '~', attr: tail }, { char: '~', attr: tail }]
                ],
                [
                    [U, { char: '(', attr: body }, { char: 'o', attr: eye }, { char: '<', attr: beak }],
                    [{ char: '/', attr: wing }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: ')', attr: body }],
                    [{ char: '/', attr: wing }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: ')', attr: body }, U],
                    [U, { char: '~', attr: tail }, { char: '~', attr: tail }, { char: '~', attr: tail }]
                ],
                [
                    [U, { char: '(', attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: 'o', attr: eye }, { char: '<', attr: beak }],
                    [{ char: '/', attr: wing }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: ')', attr: body }],
                    [{ char: '/', attr: wing }, { char: '/', attr: wing }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: ')', attr: body }, U],
                    [U, U, { char: '\\', attr: body }, { char: '/', attr: body }, U],
                    [U, { char: '~', attr: tail }, { char: '~', attr: tail }, { char: '~', attr: tail }, { char: '~', attr: tail }]
                ],
                [
                    [U, { char: '(', attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: 'o', attr: eye }, { char: '<', attr: beak }],
                    [{ char: '/', attr: wing }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: ')', attr: body }],
                    [{ char: '/', attr: wing }, { char: '/', attr: wing }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: ')', attr: body }, U],
                    [U, U, { char: '\\', attr: body }, { char: '/', attr: body }, U],
                    [U, { char: '~', attr: tail }, { char: '~', attr: tail }, { char: '~', attr: tail }, { char: '~', attr: tail }]
                ]
            ]
        };
    },
    createBanana: function () {
        var leaf = makeAttr(GREEN, BG_BLACK);
        var leafLight = makeAttr(LIGHTGREEN, BG_BLACK);
        var trunk = makeAttr(BROWN, BG_BLACK);
        var banana = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'banana',
            variants: [
                [
                    [{ char: '/', attr: leaf }, { char: '\\', attr: leaf }],
                    [U, { char: ')', attr: banana }],
                    [U, { char: '|', attr: trunk }]
                ],
                [
                    [{ char: '/', attr: leafLight }, { char: '|', attr: leaf }, { char: '\\', attr: leafLight }],
                    [{ char: '/', attr: leaf }, { char: ')', attr: banana }, { char: '\\', attr: leaf }],
                    [U, { char: '|', attr: trunk }, U],
                    [U, { char: '|', attr: trunk }, U]
                ],
                [
                    [{ char: '/', attr: leaf }, { char: '/', attr: leafLight }, { char: '|', attr: leaf }, { char: '\\', attr: leafLight }, { char: '\\', attr: leaf }],
                    [{ char: '/', attr: leafLight }, U, { char: '|', attr: trunk }, U, { char: '\\', attr: leafLight }],
                    [U, { char: ')', attr: banana }, { char: ')', attr: banana }, { char: ')', attr: banana }, U],
                    [U, U, { char: '|', attr: trunk }, U, U],
                    [U, U, { char: '|', attr: trunk }, U, U]
                ],
                [
                    [{ char: '/', attr: leaf }, { char: '/', attr: leafLight }, U, { char: '|', attr: leaf }, U, { char: '\\', attr: leafLight }, { char: '\\', attr: leaf }],
                    [U, { char: '/', attr: leaf }, { char: '/', attr: leafLight }, { char: '|', attr: trunk }, { char: '\\', attr: leafLight }, { char: '\\', attr: leaf }, U],
                    [U, U, { char: ')', attr: banana }, { char: ')', attr: banana }, { char: ')', attr: banana }, U, U],
                    [U, U, { char: ')', attr: banana }, { char: ')', attr: banana }, { char: ')', attr: banana }, U, U],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U]
                ],
                [
                    [{ char: '/', attr: leaf }, { char: '/', attr: leafLight }, U, { char: '|', attr: leaf }, U, { char: '\\', attr: leafLight }, { char: '\\', attr: leaf }],
                    [U, { char: '/', attr: leaf }, { char: '/', attr: leafLight }, { char: '|', attr: trunk }, { char: '\\', attr: leafLight }, { char: '\\', attr: leaf }, U],
                    [U, U, { char: ')', attr: banana }, { char: ')', attr: banana }, { char: ')', attr: banana }, U, U],
                    [U, U, { char: ')', attr: banana }, { char: ')', attr: banana }, { char: ')', attr: banana }, U, U],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('jungle_tree', JungleSprites.createJungleTree);
registerRoadsideSprite('fern', JungleSprites.createFern);
registerRoadsideSprite('vine', JungleSprites.createVine);
registerRoadsideSprite('flower', JungleSprites.createFlower);
registerRoadsideSprite('parrot', JungleSprites.createParrot);
registerRoadsideSprite('banana', JungleSprites.createBanana);
