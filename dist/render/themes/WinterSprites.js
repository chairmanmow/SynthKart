"use strict";
var WinterSprites = {
    createSnowPine: function () {
        var snow = makeAttr(WHITE, BG_BLACK);
        var pine = makeAttr(GREEN, BG_BLACK);
        var pineDark = makeAttr(CYAN, BG_BLACK);
        var trunk = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'snowpine',
            variants: [
                [
                    [U, { char: '^', attr: snow }, U],
                    [U, { char: '|', attr: trunk }, U]
                ],
                [
                    [U, { char: '*', attr: snow }, U],
                    [{ char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }],
                    [{ char: '/', attr: pineDark }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: '\\', attr: pineDark }],
                    [U, { char: '|', attr: trunk }, U]
                ],
                [
                    [U, U, { char: '*', attr: snow }, U, U],
                    [U, { char: '/', attr: pine }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: '\\', attr: pine }, U],
                    [{ char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }],
                    [{ char: '/', attr: pineDark }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: '\\', attr: pineDark }],
                    [U, U, { char: '|', attr: trunk }, U, U]
                ],
                [
                    [U, U, U, { char: '*', attr: snow }, U, U, U],
                    [U, U, { char: '/', attr: pine }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: '\\', attr: pine }, U, U],
                    [U, { char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }, U],
                    [{ char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }],
                    [{ char: '/', attr: pineDark }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: '\\', attr: pineDark }],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U]
                ],
                [
                    [U, U, U, { char: '*', attr: snow }, U, U, U],
                    [U, U, { char: '/', attr: pine }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: '\\', attr: pine }, U, U],
                    [U, { char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }, U],
                    [{ char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }],
                    [{ char: '/', attr: pineDark }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: '\\', attr: pineDark }],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U]
                ]
            ]
        };
    },
    createSnowman: function () {
        var snow = makeAttr(WHITE, BG_BLACK);
        var hat = makeAttr(BLACK, BG_BLACK);
        var face = makeAttr(BLACK, BG_LIGHTGRAY);
        var carrot = makeAttr(BROWN, BG_LIGHTGRAY);
        var scarf = makeAttr(LIGHTRED, BG_BLACK);
        var button = makeAttr(BLACK, BG_LIGHTGRAY);
        var arm = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'snowman',
            variants: [
                [
                    [{ char: 'o', attr: snow }, { char: 'o', attr: snow }],
                    [{ char: 'O', attr: snow }, { char: 'O', attr: snow }],
                    [{ char: 'O', attr: snow }, { char: 'O', attr: snow }]
                ],
                [
                    [U, { char: GLYPH.FULL_BLOCK, attr: hat }, U],
                    [{ char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }],
                    [{ char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }],
                    [{ char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }]
                ],
                [
                    [U, { char: '_', attr: hat }, { char: GLYPH.FULL_BLOCK, attr: hat }, { char: '_', attr: hat }, U],
                    [U, { char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }, U],
                    [{ char: '-', attr: arm }, { char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }, { char: '-', attr: arm }],
                    [U, { char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }, U],
                    [U, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, U]
                ],
                [
                    [U, { char: '_', attr: hat }, { char: GLYPH.FULL_BLOCK, attr: hat }, { char: '_', attr: hat }, U],
                    [U, { char: '.', attr: face }, { char: 'v', attr: carrot }, { char: '.', attr: face }, U],
                    [U, { char: '~', attr: scarf }, { char: '~', attr: scarf }, { char: '~', attr: scarf }, U],
                    [{ char: '-', attr: arm }, { char: '(', attr: snow }, { char: '*', attr: button }, { char: ')', attr: snow }, { char: '-', attr: arm }],
                    [U, { char: '(', attr: snow }, { char: '*', attr: button }, { char: ')', attr: snow }, U],
                    [U, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, U]
                ],
                [
                    [U, U, { char: '_', attr: hat }, { char: GLYPH.FULL_BLOCK, attr: hat }, { char: '_', attr: hat }, U, U],
                    [U, { char: '(', attr: snow }, { char: '.', attr: face }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '.', attr: face }, { char: ')', attr: snow }, U],
                    [U, { char: '(', attr: snow }, { char: ' ', attr: snow }, { char: '>', attr: carrot }, { char: ' ', attr: snow }, { char: ')', attr: snow }, U],
                    [U, { char: '~', attr: scarf }, { char: '~', attr: scarf }, { char: '~', attr: scarf }, { char: '~', attr: scarf }, { char: '~', attr: scarf }, U],
                    [{ char: '/', attr: arm }, { char: '(', attr: snow }, { char: ' ', attr: snow }, { char: '*', attr: button }, { char: ' ', attr: snow }, { char: ')', attr: snow }, { char: '\\', attr: arm }],
                    [U, { char: '(', attr: snow }, { char: ' ', attr: snow }, { char: '*', attr: button }, { char: ' ', attr: snow }, { char: ')', attr: snow }, U],
                    [U, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, U]
                ]
            ]
        };
    },
    createIceCrystal: function () {
        var ice = makeAttr(LIGHTCYAN, BG_BLACK);
        var iceShine = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'icecrystal',
            variants: [
                [
                    [{ char: '*', attr: iceShine }],
                    [{ char: 'V', attr: ice }]
                ],
                [
                    [U, { char: '*', attr: iceShine }, U],
                    [{ char: '/', attr: ice }, { char: '|', attr: ice }, { char: '\\', attr: ice }],
                    [U, { char: 'V', attr: ice }, U]
                ],
                [
                    [U, U, { char: '*', attr: iceShine }, U, U],
                    [{ char: '/', attr: ice }, { char: '/', attr: ice }, { char: '|', attr: ice }, { char: '\\', attr: ice }, { char: '\\', attr: ice }],
                    [U, { char: '/', attr: ice }, { char: '|', attr: iceShine }, { char: '\\', attr: ice }, U],
                    [U, U, { char: 'V', attr: ice }, U, U]
                ],
                [
                    [U, U, { char: '*', attr: iceShine }, U, U],
                    [{ char: '\\', attr: ice }, { char: '/', attr: ice }, { char: '|', attr: ice }, { char: '\\', attr: ice }, { char: '/', attr: ice }],
                    [U, { char: '<', attr: ice }, { char: '+', attr: iceShine }, { char: '>', attr: ice }, U],
                    [{ char: '/', attr: ice }, { char: '\\', attr: ice }, { char: '|', attr: ice }, { char: '/', attr: ice }, { char: '\\', attr: ice }],
                    [U, U, { char: 'V', attr: ice }, U, U]
                ],
                [
                    [U, U, { char: '*', attr: iceShine }, U, U],
                    [{ char: '\\', attr: ice }, { char: '/', attr: ice }, { char: '|', attr: ice }, { char: '\\', attr: ice }, { char: '/', attr: ice }],
                    [U, { char: '<', attr: ice }, { char: '+', attr: iceShine }, { char: '>', attr: ice }, U],
                    [{ char: '/', attr: ice }, { char: '\\', attr: ice }, { char: '|', attr: ice }, { char: '/', attr: ice }, { char: '\\', attr: ice }],
                    [U, U, { char: 'V', attr: ice }, U, U]
                ]
            ]
        };
    },
    createCandyCane: function () {
        var red = makeAttr(LIGHTRED, BG_BLACK);
        var white = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'candycane',
            variants: [
                [
                    [{ char: '?', attr: red }],
                    [{ char: '|', attr: white }]
                ],
                [
                    [{ char: '_', attr: red }, { char: ')', attr: red }],
                    [{ char: '|', attr: white }, U],
                    [{ char: '|', attr: red }, U]
                ],
                [
                    [{ char: '_', attr: red }, { char: '_', attr: white }, { char: ')', attr: red }],
                    [{ char: '|', attr: white }, U, U],
                    [{ char: '|', attr: red }, U, U],
                    [{ char: '|', attr: white }, U, U]
                ],
                [
                    [{ char: '_', attr: red }, { char: '_', attr: white }, { char: ')', attr: red }],
                    [{ char: '|', attr: white }, U, { char: '/', attr: white }],
                    [{ char: '|', attr: red }, U, U],
                    [{ char: '|', attr: white }, U, U],
                    [{ char: '|', attr: red }, U, U]
                ],
                [
                    [{ char: '_', attr: red }, { char: '_', attr: white }, { char: ')', attr: red }],
                    [{ char: '|', attr: white }, U, { char: '/', attr: white }],
                    [{ char: '|', attr: red }, U, U],
                    [{ char: '|', attr: white }, U, U],
                    [{ char: '|', attr: red }, U, U]
                ]
            ]
        };
    },
    createSnowDrift: function () {
        var snow = makeAttr(WHITE, BG_BLACK);
        var snowShade = makeAttr(LIGHTGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'snowdrift',
            variants: [
                [
                    [{ char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: snowShade }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snowShade }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: snowShade }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snowShade }]
                ],
                [
                    [U, U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U, U],
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: snowShade }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snowShade }]
                ],
                [
                    [U, U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U, U],
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: snowShade }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snowShade }]
                ]
            ]
        };
    },
    createSignpost: function () {
        var wood = makeAttr(BROWN, BG_BLACK);
        var snow = makeAttr(WHITE, BG_BLACK);
        var text = makeAttr(WHITE, BG_BROWN);
        var U = null;
        return {
            name: 'signpost',
            variants: [
                [
                    [{ char: '[', attr: wood }, { char: ']', attr: wood }],
                    [U, { char: '|', attr: wood }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }],
                    [{ char: '[', attr: wood }, { char: '>', attr: text }, { char: ']', attr: wood }],
                    [U, { char: '|', attr: wood }, U]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }],
                    [{ char: '[', attr: wood }, { char: '>', attr: text }, { char: '>', attr: text }, { char: ']', attr: wood }],
                    [U, { char: '|', attr: wood }, { char: '|', attr: wood }, U],
                    [U, { char: '|', attr: wood }, { char: '|', attr: wood }, U]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: '[', attr: wood }, { char: 'S', attr: text }, { char: 'K', attr: text }, { char: 'I', attr: text }, { char: '>', attr: wood }],
                    [U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '|', attr: wood }, U, U]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: '[', attr: wood }, { char: 'S', attr: text }, { char: 'K', attr: text }, { char: 'I', attr: text }, { char: '>', attr: wood }],
                    [U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '|', attr: wood }, U, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('snowpine', WinterSprites.createSnowPine);
registerRoadsideSprite('snowman', WinterSprites.createSnowman);
registerRoadsideSprite('icecrystal', WinterSprites.createIceCrystal);
registerRoadsideSprite('candycane', WinterSprites.createCandyCane);
registerRoadsideSprite('snowdrift', WinterSprites.createSnowDrift);
registerRoadsideSprite('signpost', WinterSprites.createSignpost);
