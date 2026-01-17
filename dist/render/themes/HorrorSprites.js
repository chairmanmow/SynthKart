"use strict";
var HorrorSprites = {
    createDeadTree: function () {
        var branch = makeAttr(BROWN, BG_BLACK);
        var branchDark = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'deadtree',
            variants: [
                [
                    [U, { char: 'Y', attr: branch }, U],
                    [U, { char: '|', attr: branch }, U]
                ],
                [
                    [{ char: '\\', attr: branchDark }, { char: 'Y', attr: branch }, { char: '/', attr: branchDark }],
                    [U, { char: '|', attr: branch }, U],
                    [U, { char: '|', attr: branch }, U]
                ],
                [
                    [{ char: '\\', attr: branchDark }, U, { char: 'Y', attr: branch }, U, { char: '/', attr: branchDark }],
                    [U, { char: '\\', attr: branch }, { char: '|', attr: branch }, { char: '/', attr: branch }, U],
                    [U, U, { char: '|', attr: branch }, U, U],
                    [U, U, { char: '|', attr: branch }, U, U]
                ],
                [
                    [{ char: '\\', attr: branchDark }, U, { char: 'Y', attr: branch }, U, { char: 'Y', attr: branch }, U, { char: '/', attr: branchDark }],
                    [U, { char: '\\', attr: branch }, { char: '\\', attr: branch }, { char: '|', attr: branch }, { char: '/', attr: branch }, { char: '/', attr: branch }, U],
                    [U, U, { char: '\\', attr: branch }, { char: '|', attr: branch }, { char: '/', attr: branch }, U, U],
                    [U, U, U, { char: '|', attr: branch }, U, U, U],
                    [U, U, U, { char: '|', attr: branch }, U, U, U]
                ],
                [
                    [{ char: '_', attr: branchDark }, U, U, U, { char: 'V', attr: branch }, U, U, U, { char: '_', attr: branchDark }],
                    [U, { char: '\\', attr: branch }, { char: 'Y', attr: branch }, U, { char: '|', attr: branch }, U, { char: 'Y', attr: branch }, { char: '/', attr: branch }, U],
                    [U, U, { char: '\\', attr: branch }, { char: '\\', attr: branch }, { char: '|', attr: branch }, { char: '/', attr: branch }, { char: '/', attr: branch }, U, U],
                    [U, U, U, U, { char: '|', attr: branch }, U, U, U, U],
                    [U, U, U, U, { char: '|', attr: branch }, U, U, U, U],
                    [U, U, U, { char: '-', attr: branch }, { char: '|', attr: branch }, { char: '-', attr: branch }, U, U, U]
                ]
            ]
        };
    },
    createGravestone: function () {
        var stone = makeAttr(LIGHTGRAY, BG_BLACK);
        var stoneDark = makeAttr(DARKGRAY, BG_BLACK);
        var stoneText = makeAttr(DARKGRAY, BG_LIGHTGRAY);
        var U = null;
        return {
            name: 'gravestone',
            variants: [
                [
                    [{ char: GLYPH.UPPER_HALF, attr: stone }, { char: GLYPH.UPPER_HALF, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: stone }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: 'R', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'I', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: stone }, { char: GLYPH.UPPER_HALF, attr: stone }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: 'R', attr: stoneText }, { char: 'I', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'P', attr: stoneText }, { char: GLYPH.MEDIUM_SHADE, attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.LOWER_HALF, attr: stoneDark }]
                ],
                [
                    [U, { char: '_', attr: stone }, { char: GLYPH.UPPER_HALF, attr: stone }, { char: '_', attr: stone }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: ' ', attr: stoneText }, { char: '+', attr: stoneText }, { char: ' ', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'R', attr: stoneText }, { char: '.', attr: stoneText }, { char: 'I', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'P', attr: stoneText }, { char: GLYPH.MEDIUM_SHADE, attr: stoneText }, { char: GLYPH.MEDIUM_SHADE, attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.LOWER_HALF, attr: stoneDark }]
                ],
                [
                    [U, { char: '_', attr: stone }, { char: GLYPH.UPPER_HALF, attr: stone }, { char: '_', attr: stone }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: ' ', attr: stoneText }, { char: '+', attr: stoneText }, { char: ' ', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'R', attr: stoneText }, { char: '.', attr: stoneText }, { char: 'I', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'P', attr: stoneText }, { char: GLYPH.MEDIUM_SHADE, attr: stoneText }, { char: GLYPH.MEDIUM_SHADE, attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.LOWER_HALF, attr: stoneDark }]
                ]
            ]
        };
    },
    createPumpkin: function () {
        var pumpkin = makeAttr(BROWN, BG_BLACK);
        var glow = makeAttr(YELLOW, BG_BROWN);
        var stem = makeAttr(GREEN, BG_BLACK);
        var face = makeAttr(YELLOW, BG_BROWN);
        var U = null;
        return {
            name: 'pumpkin',
            variants: [
                [
                    [{ char: '(', attr: glow }, { char: ')', attr: glow }],
                    [{ char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }]
                ],
                [
                    [U, { char: '|', attr: stem }, U],
                    [{ char: '(', attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: glow }],
                    [{ char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }]
                ],
                [
                    [U, U, { char: '|', attr: stem }, U, U],
                    [{ char: '(', attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: pumpkin }],
                    [{ char: '(', attr: pumpkin }, { char: '^', attr: face }, { char: 'v', attr: face }, { char: '^', attr: face }, { char: ')', attr: pumpkin }],
                    [U, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, U]
                ],
                [
                    [U, U, { char: '\\', attr: stem }, { char: '/', attr: stem }, U, U],
                    [{ char: '(', attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: pumpkin }],
                    [{ char: '(', attr: pumpkin }, { char: '^', attr: face }, { char: GLYPH.FULL_BLOCK, attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: pumpkin }, { char: '^', attr: face }, { char: ')', attr: pumpkin }],
                    [{ char: '(', attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: 'v', attr: face }, { char: 'v', attr: face }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: pumpkin }],
                    [U, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, U]
                ],
                [
                    [U, U, { char: '\\', attr: stem }, { char: '/', attr: stem }, U, U],
                    [{ char: '(', attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: pumpkin }],
                    [{ char: '(', attr: pumpkin }, { char: '^', attr: face }, { char: GLYPH.FULL_BLOCK, attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: pumpkin }, { char: '^', attr: face }, { char: ')', attr: pumpkin }],
                    [{ char: '(', attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: 'v', attr: face }, { char: 'v', attr: face }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: pumpkin }],
                    [U, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, U]
                ]
            ]
        };
    },
    createSkull: function () {
        var bone = makeAttr(WHITE, BG_BLACK);
        var eye = makeAttr(BLACK, BG_LIGHTGRAY);
        var stake = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'skull',
            variants: [
                [
                    [{ char: '0', attr: bone }, { char: '0', attr: bone }],
                    [U, { char: '|', attr: stake }]
                ],
                [
                    [{ char: '(', attr: bone }, { char: GLYPH.UPPER_HALF, attr: bone }, { char: ')', attr: bone }],
                    [{ char: 'o', attr: eye }, { char: 'v', attr: bone }, { char: 'o', attr: eye }],
                    [U, { char: '|', attr: stake }, U]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: bone }, { char: GLYPH.UPPER_HALF, attr: bone }, U],
                    [{ char: '(', attr: bone }, { char: 'o', attr: eye }, { char: 'o', attr: eye }, { char: ')', attr: bone }],
                    [U, { char: GLYPH.LOWER_HALF, attr: bone }, { char: GLYPH.LOWER_HALF, attr: bone }, U],
                    [U, { char: '|', attr: stake }, { char: '|', attr: stake }, U]
                ],
                [
                    [U, { char: '_', attr: bone }, { char: GLYPH.UPPER_HALF, attr: bone }, { char: '_', attr: bone }, U],
                    [{ char: '(', attr: bone }, { char: 'O', attr: eye }, { char: ' ', attr: bone }, { char: 'O', attr: eye }, { char: ')', attr: bone }],
                    [{ char: '(', attr: bone }, { char: ' ', attr: bone }, { char: 'v', attr: bone }, { char: ' ', attr: bone }, { char: ')', attr: bone }],
                    [U, { char: GLYPH.LOWER_HALF, attr: bone }, { char: 'w', attr: bone }, { char: GLYPH.LOWER_HALF, attr: bone }, U],
                    [U, U, { char: '|', attr: stake }, U, U]
                ],
                [
                    [U, { char: '_', attr: bone }, { char: GLYPH.UPPER_HALF, attr: bone }, { char: '_', attr: bone }, U],
                    [{ char: '(', attr: bone }, { char: 'O', attr: eye }, { char: ' ', attr: bone }, { char: 'O', attr: eye }, { char: ')', attr: bone }],
                    [{ char: '(', attr: bone }, { char: ' ', attr: bone }, { char: 'v', attr: bone }, { char: ' ', attr: bone }, { char: ')', attr: bone }],
                    [U, { char: GLYPH.LOWER_HALF, attr: bone }, { char: 'w', attr: bone }, { char: GLYPH.LOWER_HALF, attr: bone }, U],
                    [U, U, { char: '|', attr: stake }, U, U]
                ]
            ]
        };
    },
    createFence: function () {
        var iron = makeAttr(DARKGRAY, BG_BLACK);
        var ironPoint = makeAttr(LIGHTGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'fence',
            variants: [
                [
                    [{ char: '|', attr: iron }, { char: '|', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '-', attr: iron }, { char: '-', attr: iron }, { char: '-', attr: iron }]
                ],
                [
                    [{ char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }],
                    [{ char: '|', attr: iron }, { char: '-', attr: iron }, { char: '|', attr: iron }, { char: '-', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }]
                ],
                [
                    [{ char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }]
                ],
                [
                    [{ char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }]
                ],
                [
                    [{ char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }]
                ]
            ]
        };
    },
    createCandle: function () {
        var flame = makeAttr(YELLOW, BG_BLACK);
        var candle = makeAttr(WHITE, BG_BLACK);
        var holder = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'candle',
            variants: [
                [
                    [{ char: '*', attr: flame }],
                    [{ char: '|', attr: holder }]
                ],
                [
                    [U, { char: '*', attr: flame }, U],
                    [{ char: '(', attr: holder }, { char: GLYPH.FULL_BLOCK, attr: candle }, { char: ')', attr: holder }],
                    [U, { char: '|', attr: holder }, U]
                ],
                [
                    [{ char: '*', attr: flame }, U, { char: '*', attr: flame }, U, { char: '*', attr: flame }],
                    [{ char: '|', attr: candle }, U, { char: '|', attr: candle }, U, { char: '|', attr: candle }],
                    [{ char: '\\', attr: holder }, { char: '-', attr: holder }, { char: '+', attr: holder }, { char: '-', attr: holder }, { char: '/', attr: holder }],
                    [U, U, { char: '|', attr: holder }, U, U]
                ],
                [
                    [{ char: '*', attr: flame }, U, { char: '*', attr: flame }, U, { char: '*', attr: flame }],
                    [{ char: '|', attr: candle }, U, { char: '|', attr: candle }, U, { char: '|', attr: candle }],
                    [{ char: '\\', attr: holder }, { char: '-', attr: holder }, { char: '+', attr: holder }, { char: '-', attr: holder }, { char: '/', attr: holder }],
                    [U, U, { char: '|', attr: holder }, U, U]
                ],
                [
                    [{ char: '*', attr: flame }, U, { char: '*', attr: flame }, U, { char: '*', attr: flame }],
                    [{ char: '|', attr: candle }, U, { char: '|', attr: candle }, U, { char: '|', attr: candle }],
                    [{ char: '\\', attr: holder }, { char: '-', attr: holder }, { char: '+', attr: holder }, { char: '-', attr: holder }, { char: '/', attr: holder }],
                    [U, U, { char: '|', attr: holder }, U, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('deadtree', HorrorSprites.createDeadTree);
registerRoadsideSprite('gravestone', HorrorSprites.createGravestone);
registerRoadsideSprite('pumpkin', HorrorSprites.createPumpkin);
registerRoadsideSprite('skull', HorrorSprites.createSkull);
registerRoadsideSprite('fence', HorrorSprites.createFence);
registerRoadsideSprite('candle', HorrorSprites.createCandle);
