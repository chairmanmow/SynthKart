"use strict";
var RuinsSprites = {
    createColumn: function () {
        var stone = makeAttr(YELLOW, BG_BLACK);
        var stoneDark = makeAttr(BROWN, BG_BLACK);
        var stoneLight = makeAttr(WHITE, BG_BLACK);
        return {
            name: 'column',
            variants: [
                [
                    [{ char: '=', attr: stoneLight }, { char: '=', attr: stoneLight }],
                    [{ char: '|', attr: stone }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stoneDark }, { char: '|', attr: stoneDark }],
                    [{ char: '=', attr: stone }, { char: '=', attr: stone }]
                ],
                [
                    [{ char: '/', attr: stoneLight }, { char: '=', attr: stoneLight }, { char: '\\', attr: stoneLight }],
                    [{ char: '|', attr: stone }, { char: '|', attr: stone }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stoneDark }, { char: '|', attr: stone }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stone }, { char: '|', attr: stoneDark }, { char: '|', attr: stone }],
                    [{ char: '\\', attr: stoneDark }, { char: '=', attr: stone }, { char: '/', attr: stoneDark }]
                ],
                [
                    [{ char: '/', attr: stoneLight }, { char: '-', attr: stoneLight }, { char: '-', attr: stoneLight }, { char: '\\', attr: stoneLight }],
                    [{ char: '|', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '|', attr: stoneDark }],
                    [{ char: '\\', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stone }, { char: '/', attr: stoneDark }]
                ],
                [
                    [{ char: '/', attr: stoneLight }, { char: '=', attr: stoneLight }, { char: '=', attr: stoneLight }, { char: '=', attr: stoneLight }, { char: '\\', attr: stoneLight }],
                    [{ char: '|', attr: stone }, { char: '(', attr: stone }, { char: ')', attr: stone }, { char: '(', attr: stone }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stoneDark }, { char: '|', attr: stone }, { char: '|', attr: stoneDark }, { char: '|', attr: stone }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stone }, { char: '|', attr: stoneDark }, { char: '|', attr: stone }, { char: '|', attr: stoneDark }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stoneDark }, { char: '|', attr: stone }, { char: '|', attr: stoneDark }, { char: '|', attr: stone }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stone }, { char: ')', attr: stoneDark }, { char: '(', attr: stoneDark }, { char: ')', attr: stoneDark }, { char: '|', attr: stone }],
                    [{ char: '\\', attr: stoneDark }, { char: '=', attr: stone }, { char: '=', attr: stone }, { char: '=', attr: stone }, { char: '/', attr: stoneDark }]
                ],
                [
                    [{ char: '/', attr: stoneLight }, { char: '=', attr: stoneLight }, { char: '=', attr: stoneLight }, { char: '=', attr: stoneLight }, { char: '\\', attr: stoneLight }],
                    [{ char: '|', attr: stone }, { char: '(', attr: stone }, { char: ')', attr: stone }, { char: '(', attr: stone }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stoneDark }, { char: '|', attr: stone }, { char: '|', attr: stoneDark }, { char: '|', attr: stone }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stone }, { char: '|', attr: stoneDark }, { char: '|', attr: stone }, { char: '|', attr: stoneDark }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stoneDark }, { char: '|', attr: stone }, { char: '|', attr: stoneDark }, { char: '|', attr: stone }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stone }, { char: ')', attr: stoneDark }, { char: '(', attr: stoneDark }, { char: ')', attr: stoneDark }, { char: '|', attr: stone }],
                    [{ char: '\\', attr: stoneDark }, { char: '=', attr: stone }, { char: '=', attr: stone }, { char: '=', attr: stone }, { char: '/', attr: stoneDark }]
                ]
            ]
        };
    },
    createStatue: function () {
        var stone = makeAttr(YELLOW, BG_BLACK);
        var stoneDark = makeAttr(BROWN, BG_BLACK);
        var gold = makeAttr(YELLOW, BG_BROWN);
        var face = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'statue',
            variants: [
                [
                    [{ char: '/', attr: gold }, { char: '\\', attr: gold }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '/', attr: stoneDark }, { char: '\\', attr: stoneDark }]
                ],
                [
                    [U, { char: '^', attr: gold }, U],
                    [{ char: '/', attr: gold }, { char: 'O', attr: face }, { char: '\\', attr: gold }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '/', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '\\', attr: stoneDark }]
                ],
                [
                    [U, { char: '/', attr: gold }, { char: '^', attr: gold }, { char: '\\', attr: gold }, U],
                    [{ char: '/', attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: 'O', attr: face }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: '\\', attr: gold }],
                    [{ char: '|', attr: stone }, { char: '.', attr: face }, { char: 'v', attr: face }, { char: '.', attr: face }, { char: '|', attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '/', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '\\', attr: stoneDark }]
                ],
                [
                    [U, U, { char: '/', attr: gold }, { char: '^', attr: gold }, { char: '\\', attr: gold }, U, U],
                    [U, { char: '/', attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: '\\', attr: gold }, U],
                    [{ char: '/', attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: '.', attr: face }, { char: 'v', attr: face }, { char: '.', attr: face }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: '\\', attr: gold }],
                    [{ char: '|', attr: stone }, { char: '|', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '|', attr: stone }, { char: '|', attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '/', attr: stoneDark }, { char: '-', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '-', attr: stone }, { char: '\\', attr: stoneDark }]
                ],
                [
                    [U, U, { char: '/', attr: gold }, { char: '^', attr: gold }, { char: '\\', attr: gold }, U, U],
                    [U, { char: '/', attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: '\\', attr: gold }, U],
                    [{ char: '/', attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: '.', attr: face }, { char: 'v', attr: face }, { char: '.', attr: face }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: '\\', attr: gold }],
                    [{ char: '|', attr: stone }, { char: '|', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '|', attr: stone }, { char: '|', attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '/', attr: stoneDark }, { char: '-', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '-', attr: stone }, { char: '\\', attr: stoneDark }]
                ]
            ]
        };
    },
    createObelisk: function () {
        var stone = makeAttr(YELLOW, BG_BLACK);
        var stoneDark = makeAttr(BROWN, BG_BLACK);
        var top = makeAttr(WHITE, BG_BLACK);
        var glyph = makeAttr(RED, BG_BLACK);
        var U = null;
        return {
            name: 'obelisk',
            variants: [
                [
                    [{ char: '^', attr: top }],
                    [{ char: '|', attr: stone }],
                    [{ char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stone }]
                ],
                [
                    [{ char: '/', attr: top }, { char: '\\', attr: top }],
                    [{ char: '|', attr: stone }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stoneDark }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stone }, { char: '|', attr: stone }],
                    [{ char: '/', attr: stoneDark }, { char: '\\', attr: stoneDark }]
                ],
                [
                    [U, { char: '^', attr: top }, U],
                    [{ char: '/', attr: stone }, { char: '\\', attr: stone }, U],
                    [{ char: '|', attr: stone }, { char: '*', attr: glyph }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stone }, { char: '*', attr: glyph }, { char: '|', attr: stoneDark }],
                    [{ char: '/', attr: stoneDark }, { char: '-', attr: stone }, { char: '\\', attr: stoneDark }]
                ],
                [
                    [U, { char: '/', attr: top }, { char: '\\', attr: top }, U],
                    [{ char: '/', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '\\', attr: stone }],
                    [{ char: '|', attr: stone }, { char: '@', attr: glyph }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '*', attr: glyph }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stone }, { char: '*', attr: glyph }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '@', attr: glyph }, { char: '|', attr: stone }],
                    [{ char: '/', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stone }, { char: '\\', attr: stoneDark }]
                ],
                [
                    [U, { char: '/', attr: top }, { char: '\\', attr: top }, U],
                    [{ char: '/', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '\\', attr: stone }],
                    [{ char: '|', attr: stone }, { char: '@', attr: glyph }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '*', attr: glyph }, { char: '|', attr: stone }],
                    [{ char: '|', attr: stone }, { char: '*', attr: glyph }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '|', attr: stoneDark }],
                    [{ char: '|', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '@', attr: glyph }, { char: '|', attr: stone }],
                    [{ char: '/', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stone }, { char: '\\', attr: stoneDark }]
                ]
            ]
        };
    },
    createSphinx: function () {
        var stone = makeAttr(YELLOW, BG_BLACK);
        var stoneDark = makeAttr(BROWN, BG_BLACK);
        var face = makeAttr(BROWN, BG_BLACK);
        var eye = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'sphinx',
            variants: [
                [
                    [{ char: '/', attr: stone }, { char: 'O', attr: face }, { char: '\\', attr: stone }],
                    [{ char: '-', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stoneDark }]
                ],
                [
                    [U, { char: '/', attr: stone }, { char: '\\', attr: stone }, U],
                    [{ char: '/', attr: stone }, { char: 'O', attr: face }, { char: 'v', attr: face }, { char: '\\', attr: stone }],
                    [{ char: '-', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stone }, { char: '-', attr: stoneDark }]
                ],
                [
                    [U, { char: '/', attr: stone }, { char: '_', attr: stone }, { char: '_', attr: stone }, { char: '\\', attr: stone }, U],
                    [{ char: '/', attr: stone }, { char: '.', attr: eye }, { char: GLYPH.FULL_BLOCK, attr: face }, { char: GLYPH.FULL_BLOCK, attr: face }, { char: '.', attr: eye }, { char: '\\', attr: stone }],
                    [{ char: '|', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '>', attr: face }, { char: '<', attr: face }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '|', attr: stoneDark }],
                    [{ char: '-', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stoneDark }, { char: '-', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stoneDark }]
                ],
                [
                    [U, U, { char: '/', attr: stone }, { char: '_', attr: stone }, { char: '_', attr: stone }, { char: '_', attr: stone }, { char: '\\', attr: stone }, U, U],
                    [U, { char: '/', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '.', attr: eye }, { char: GLYPH.FULL_BLOCK, attr: face }, { char: '.', attr: eye }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '\\', attr: stone }, U],
                    [{ char: '/', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '>', attr: face }, { char: 'w', attr: face }, { char: '<', attr: face }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '\\', attr: stoneDark }],
                    [{ char: '-', attr: stone }, { char: '-', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '-', attr: stone }, { char: '-', attr: stone }],
                    [{ char: '-', attr: stoneDark }, { char: '-', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stoneDark }, { char: '-', attr: stoneDark }]
                ],
                [
                    [U, U, { char: '/', attr: stone }, { char: '_', attr: stone }, { char: '_', attr: stone }, { char: '_', attr: stone }, { char: '\\', attr: stone }, U, U],
                    [U, { char: '/', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '.', attr: eye }, { char: GLYPH.FULL_BLOCK, attr: face }, { char: '.', attr: eye }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '\\', attr: stone }, U],
                    [{ char: '/', attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '>', attr: face }, { char: 'w', attr: face }, { char: '<', attr: face }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '\\', attr: stoneDark }],
                    [{ char: '-', attr: stone }, { char: '-', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '-', attr: stone }, { char: '-', attr: stone }],
                    [{ char: '-', attr: stoneDark }, { char: '-', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stoneDark }, { char: '-', attr: stone }, { char: '-', attr: stoneDark }, { char: '-', attr: stoneDark }]
                ]
            ]
        };
    },
    createHieroglyph: function () {
        var stone = makeAttr(YELLOW, BG_BLACK);
        var stoneDark = makeAttr(BROWN, BG_BLACK);
        var glyph1 = makeAttr(RED, BG_BLACK);
        var glyph2 = makeAttr(BLUE, BG_BLACK);
        var glyph3 = makeAttr(GREEN, BG_BLACK);
        return {
            name: 'hieroglyph',
            variants: [
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '*', attr: glyph1 }, { char: '+', attr: glyph2 }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '@', attr: glyph1 }, { char: '+', attr: glyph2 }, { char: '~', attr: glyph3 }],
                    [{ char: '|', attr: glyph3 }, { char: '*', attr: glyph1 }, { char: 'o', attr: glyph2 }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '@', attr: glyph1 }, { char: '~', attr: glyph2 }, { char: '+', attr: glyph3 }, { char: '|', attr: glyph1 }],
                    [{ char: '|', attr: glyph2 }, { char: 'o', attr: glyph3 }, { char: '*', attr: glyph1 }, { char: '~', attr: glyph2 }],
                    [{ char: '^', attr: glyph3 }, { char: '*', attr: glyph1 }, { char: '@', attr: glyph2 }, { char: 'v', attr: glyph3 }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '/', attr: glyph1 }, { char: 'O', attr: glyph2 }, { char: '\\', attr: glyph1 }, { char: '~', attr: glyph3 }, { char: '|', attr: glyph2 }],
                    [{ char: '|', attr: glyph2 }, { char: '*', attr: glyph3 }, { char: '+', attr: glyph1 }, { char: '@', attr: glyph2 }, { char: '~', attr: glyph1 }],
                    [{ char: '^', attr: glyph3 }, { char: '~', attr: glyph1 }, { char: 'o', attr: glyph2 }, { char: '*', attr: glyph3 }, { char: 'v', attr: glyph1 }],
                    [{ char: '|', attr: glyph1 }, { char: '@', attr: glyph2 }, { char: '|', attr: glyph3 }, { char: '+', attr: glyph1 }, { char: '|', attr: glyph2 }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '/', attr: glyph1 }, { char: 'O', attr: glyph2 }, { char: '\\', attr: glyph1 }, { char: '~', attr: glyph3 }, { char: '|', attr: glyph2 }],
                    [{ char: '|', attr: glyph2 }, { char: '*', attr: glyph3 }, { char: '+', attr: glyph1 }, { char: '@', attr: glyph2 }, { char: '~', attr: glyph1 }],
                    [{ char: '^', attr: glyph3 }, { char: '~', attr: glyph1 }, { char: 'o', attr: glyph2 }, { char: '*', attr: glyph3 }, { char: 'v', attr: glyph1 }],
                    [{ char: '|', attr: glyph1 }, { char: '@', attr: glyph2 }, { char: '|', attr: glyph3 }, { char: '+', attr: glyph1 }, { char: '|', attr: glyph2 }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ]
            ]
        };
    },
    createScarab: function () {
        var shell = makeAttr(LIGHTBLUE, BG_BLACK);
        var shellDark = makeAttr(BLUE, BG_BLACK);
        var gold = makeAttr(YELLOW, BG_BLACK);
        var leg = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'scarab',
            variants: [
                [
                    [{ char: '(', attr: shell }, { char: ')', attr: shell }],
                    [{ char: '<', attr: leg }, { char: '>', attr: leg }]
                ],
                [
                    [{ char: '/', attr: shell }, { char: '*', attr: gold }, { char: '\\', attr: shell }],
                    [{ char: '(', attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: ')', attr: shellDark }],
                    [{ char: '<', attr: leg }, { char: '|', attr: leg }, { char: '>', attr: leg }]
                ],
                [
                    [U, { char: '/', attr: shell }, { char: '*', attr: gold }, { char: '\\', attr: shell }, U],
                    [{ char: '/', attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: '\\', attr: shell }],
                    [{ char: '(', attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: ')', attr: shellDark }],
                    [{ char: '<', attr: leg }, { char: '/', attr: leg }, { char: '|', attr: leg }, { char: '\\', attr: leg }, { char: '>', attr: leg }]
                ],
                [
                    [U, U, { char: '/', attr: shell }, { char: '@', attr: gold }, { char: '\\', attr: shell }, U, U],
                    [U, { char: '/', attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: '\\', attr: shell }, U],
                    [{ char: '/', attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: '\\', attr: shellDark }],
                    [{ char: '(', attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: ')', attr: shellDark }],
                    [{ char: '<', attr: leg }, { char: '<', attr: leg }, { char: '/', attr: leg }, { char: '|', attr: leg }, { char: '\\', attr: leg }, { char: '>', attr: leg }, { char: '>', attr: leg }]
                ],
                [
                    [U, U, { char: '/', attr: shell }, { char: '@', attr: gold }, { char: '\\', attr: shell }, U, U],
                    [U, { char: '/', attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: '\\', attr: shell }, U],
                    [{ char: '/', attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: '\\', attr: shellDark }],
                    [{ char: '(', attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: GLYPH.FULL_BLOCK, attr: shell }, { char: GLYPH.FULL_BLOCK, attr: shellDark }, { char: ')', attr: shellDark }],
                    [{ char: '<', attr: leg }, { char: '<', attr: leg }, { char: '/', attr: leg }, { char: '|', attr: leg }, { char: '\\', attr: leg }, { char: '>', attr: leg }, { char: '>', attr: leg }]
                ]
            ]
        };
    }
};
registerRoadsideSprite('column', RuinsSprites.createColumn);
registerRoadsideSprite('statue', RuinsSprites.createStatue);
registerRoadsideSprite('obelisk', RuinsSprites.createObelisk);
registerRoadsideSprite('sphinx', RuinsSprites.createSphinx);
registerRoadsideSprite('hieroglyph', RuinsSprites.createHieroglyph);
registerRoadsideSprite('scarab', RuinsSprites.createScarab);
