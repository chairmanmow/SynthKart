"use strict";
var CastleSprites = {
    createTower: function () {
        var stone = makeAttr(DARKGRAY, BG_BLACK);
        var stoneDark = makeAttr(BLACK, BG_BLACK);
        var stoneLight = makeAttr(LIGHTGRAY, BG_BLACK);
        var roof = makeAttr(BROWN, BG_BLACK);
        var window = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'tower',
            variants: [
                [
                    [{ char: '/', attr: roof }, { char: '\\', attr: roof }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }]
                ],
                [
                    [U, { char: '^', attr: roof }, U],
                    [{ char: '/', attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: '\\', attr: roof }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: ' ', attr: window }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }]
                ],
                [
                    [U, U, { char: '^', attr: roof }, U, U],
                    [U, { char: '/', attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: '\\', attr: roof }, U],
                    [{ char: 'n', attr: stoneLight }, { char: 'n', attr: stone }, { char: 'n', attr: stoneLight }, { char: 'n', attr: stone }, { char: 'n', attr: stoneLight }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: ' ', attr: window }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }]
                ],
                [
                    [U, U, U, { char: '^', attr: roof }, U, U, U],
                    [U, U, { char: '/', attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: '\\', attr: roof }, U, U],
                    [U, { char: '/', attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: '\\', attr: roof }, U],
                    [{ char: 'n', attr: stoneLight }, { char: 'n', attr: stone }, { char: 'n', attr: stoneLight }, { char: 'n', attr: stone }, { char: 'n', attr: stoneLight }, { char: 'n', attr: stone }, { char: 'n', attr: stoneLight }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: ' ', attr: window }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: ' ', attr: window }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [U, U, U, { char: '^', attr: roof }, U, U, U],
                    [U, U, { char: '/', attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: '\\', attr: roof }, U, U],
                    [U, { char: '/', attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: '\\', attr: roof }, U],
                    [{ char: 'n', attr: stoneLight }, { char: 'n', attr: stone }, { char: 'n', attr: stoneLight }, { char: 'n', attr: stone }, { char: 'n', attr: stoneLight }, { char: 'n', attr: stone }, { char: 'n', attr: stoneLight }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: ' ', attr: window }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: ' ', attr: window }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ]
            ]
        };
    },
    createBattlement: function () {
        var stone = makeAttr(DARKGRAY, BG_BLACK);
        var stoneDark = makeAttr(BLACK, BG_BLACK);
        var stoneLight = makeAttr(LIGHTGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'battlement',
            variants: [
                [
                    [{ char: 'n', attr: stone }, U, { char: 'n', attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [{ char: 'n', attr: stoneLight }, U, { char: 'n', attr: stoneLight }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [{ char: 'n', attr: stoneLight }, { char: 'n', attr: stone }, U, U, { char: 'n', attr: stone }, { char: 'n', attr: stoneLight }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [{ char: 'n', attr: stoneLight }, { char: 'n', attr: stone }, U, U, U, U, { char: 'n', attr: stone }, { char: 'n', attr: stoneLight }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }]
                ],
                [
                    [{ char: 'n', attr: stoneLight }, { char: 'n', attr: stone }, U, U, U, U, { char: 'n', attr: stone }, { char: 'n', attr: stoneLight }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stone }]
                ]
            ]
        };
    },
    createTorch: function () {
        var flame = makeAttr(YELLOW, BG_BLACK);
        var flameOuter = makeAttr(LIGHTRED, BG_BLACK);
        var handle = makeAttr(BROWN, BG_BLACK);
        var bracket = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'torch',
            variants: [
                [
                    [{ char: '*', attr: flame }],
                    [{ char: '|', attr: handle }],
                    [{ char: '+', attr: bracket }]
                ],
                [
                    [U, { char: '*', attr: flame }, U],
                    [{ char: '(', attr: flameOuter }, { char: '*', attr: flame }, { char: ')', attr: flameOuter }],
                    [U, { char: '|', attr: handle }, U],
                    [{ char: '-', attr: bracket }, { char: '+', attr: bracket }, { char: '-', attr: bracket }]
                ],
                [
                    [U, { char: '^', attr: flameOuter }, U],
                    [{ char: '(', attr: flameOuter }, { char: '*', attr: flame }, { char: ')', attr: flameOuter }],
                    [U, { char: '|', attr: handle }, U],
                    [U, { char: '|', attr: handle }, U],
                    [{ char: '-', attr: bracket }, { char: '+', attr: bracket }, { char: '-', attr: bracket }]
                ],
                [
                    [U, U, { char: '^', attr: flameOuter }, U, U],
                    [U, { char: '(', attr: flameOuter }, { char: '*', attr: flame }, { char: ')', attr: flameOuter }, U],
                    [{ char: '~', attr: flame }, { char: '(', attr: flame }, { char: GLYPH.FULL_BLOCK, attr: flame }, { char: ')', attr: flame }, { char: '~', attr: flame }],
                    [U, U, { char: '|', attr: handle }, U, U],
                    [U, U, { char: '|', attr: handle }, U, U],
                    [U, { char: '-', attr: bracket }, { char: '+', attr: bracket }, { char: '-', attr: bracket }, U]
                ],
                [
                    [U, U, { char: '^', attr: flameOuter }, U, U],
                    [U, { char: '(', attr: flameOuter }, { char: '*', attr: flame }, { char: ')', attr: flameOuter }, U],
                    [{ char: '~', attr: flame }, { char: '(', attr: flame }, { char: GLYPH.FULL_BLOCK, attr: flame }, { char: ')', attr: flame }, { char: '~', attr: flame }],
                    [U, U, { char: '|', attr: handle }, U, U],
                    [U, U, { char: '|', attr: handle }, U, U],
                    [U, { char: '-', attr: bracket }, { char: '+', attr: bracket }, { char: '-', attr: bracket }, U]
                ]
            ]
        };
    },
    createBanner: function () {
        var banner = makeAttr(LIGHTRED, BG_BLACK);
        var bannerDark = makeAttr(RED, BG_BLACK);
        var pole = makeAttr(BROWN, BG_BLACK);
        var emblem = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'banner',
            variants: [
                [
                    [{ char: '-', attr: pole }, { char: '-', attr: pole }],
                    [{ char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }],
                    [{ char: '\\', attr: banner }, { char: '/', attr: bannerDark }]
                ],
                [
                    [{ char: '-', attr: pole }, { char: 'o', attr: pole }, { char: '-', attr: pole }],
                    [{ char: GLYPH.FULL_BLOCK, attr: banner }, { char: '*', attr: emblem }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }],
                    [U, { char: 'V', attr: banner }, U]
                ],
                [
                    [{ char: '-', attr: pole }, { char: '-', attr: pole }, { char: 'o', attr: pole }, { char: '-', attr: pole }],
                    [{ char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: '*', attr: emblem }, { char: '*', attr: emblem }, { char: GLYPH.FULL_BLOCK, attr: banner }],
                    [{ char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }],
                    [U, { char: '\\', attr: banner }, { char: '/', attr: bannerDark }, U]
                ],
                [
                    [{ char: '-', attr: pole }, { char: '-', attr: pole }, { char: 'O', attr: pole }, { char: '-', attr: pole }, { char: '-', attr: pole }],
                    [{ char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: GLYPH.FULL_BLOCK, attr: banner }],
                    [{ char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: '/', attr: emblem }, { char: '*', attr: emblem }, { char: '\\', attr: emblem }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: banner }, { char: '\\', attr: emblem }, { char: '*', attr: emblem }, { char: '/', attr: emblem }, { char: GLYPH.FULL_BLOCK, attr: banner }],
                    [{ char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }],
                    [U, { char: '\\', attr: banner }, { char: 'V', attr: bannerDark }, { char: '/', attr: banner }, U]
                ],
                [
                    [{ char: '-', attr: pole }, { char: '-', attr: pole }, { char: 'O', attr: pole }, { char: '-', attr: pole }, { char: '-', attr: pole }],
                    [{ char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: GLYPH.FULL_BLOCK, attr: banner }],
                    [{ char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: '/', attr: emblem }, { char: '*', attr: emblem }, { char: '\\', attr: emblem }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: banner }, { char: '\\', attr: emblem }, { char: '*', attr: emblem }, { char: '/', attr: emblem }, { char: GLYPH.FULL_BLOCK, attr: banner }],
                    [{ char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }, { char: GLYPH.FULL_BLOCK, attr: banner }, { char: GLYPH.FULL_BLOCK, attr: bannerDark }],
                    [U, { char: '\\', attr: banner }, { char: 'V', attr: bannerDark }, { char: '/', attr: banner }, U]
                ]
            ]
        };
    },
    createGargoyle: function () {
        var stone = makeAttr(DARKGRAY, BG_BLACK);
        var stoneDark = makeAttr(BLACK, BG_BLACK);
        var eye = makeAttr(RED, BG_BLACK);
        var U = null;
        return {
            name: 'gargoyle',
            variants: [
                [
                    [{ char: '(', attr: stone }, { char: ')', attr: stone }],
                    [{ char: '/', attr: stoneDark }, { char: '\\', attr: stoneDark }]
                ],
                [
                    [{ char: '/', attr: stone }, { char: '^', attr: stone }, { char: '\\', attr: stone }],
                    [{ char: '(', attr: stoneDark }, { char: 'v', attr: stone }, { char: ')', attr: stoneDark }],
                    [{ char: '/', attr: stone }, U, { char: '\\', attr: stone }]
                ],
                [
                    [{ char: '/', attr: stone }, { char: '^', attr: stone }, U, { char: '^', attr: stone }, { char: '\\', attr: stone }],
                    [{ char: '(', attr: stoneDark }, { char: '.', attr: eye }, { char: 'v', attr: stone }, { char: '.', attr: eye }, { char: ')', attr: stoneDark }],
                    [U, { char: '/', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '\\', attr: stone }, U],
                    [{ char: '/', attr: stoneDark }, U, { char: '|', attr: stone }, U, { char: '\\', attr: stoneDark }]
                ],
                [
                    [U, { char: '/', attr: stone }, { char: '^', attr: stone }, U, { char: '^', attr: stone }, { char: '\\', attr: stone }, U],
                    [{ char: '/', attr: stone }, { char: '(', attr: stoneDark }, { char: '*', attr: eye }, { char: 'w', attr: stone }, { char: '*', attr: eye }, { char: ')', attr: stoneDark }, { char: '\\', attr: stone }],
                    [U, { char: '/', attr: stoneDark }, { char: '/', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '\\', attr: stone }, { char: '\\', attr: stoneDark }, U],
                    [{ char: '/', attr: stone }, U, { char: '(', attr: stoneDark }, { char: '|', attr: stone }, { char: ')', attr: stoneDark }, U, { char: '\\', attr: stone }],
                    [{ char: '/', attr: stoneDark }, U, U, { char: '|', attr: stoneDark }, U, U, { char: '\\', attr: stoneDark }]
                ],
                [
                    [U, { char: '/', attr: stone }, { char: '^', attr: stone }, U, { char: '^', attr: stone }, { char: '\\', attr: stone }, U],
                    [{ char: '/', attr: stone }, { char: '(', attr: stoneDark }, { char: '*', attr: eye }, { char: 'w', attr: stone }, { char: '*', attr: eye }, { char: ')', attr: stoneDark }, { char: '\\', attr: stone }],
                    [U, { char: '/', attr: stoneDark }, { char: '/', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: '\\', attr: stone }, { char: '\\', attr: stoneDark }, U],
                    [{ char: '/', attr: stone }, U, { char: '(', attr: stoneDark }, { char: '|', attr: stone }, { char: ')', attr: stoneDark }, U, { char: '\\', attr: stone }],
                    [{ char: '/', attr: stoneDark }, U, U, { char: '|', attr: stoneDark }, U, U, { char: '\\', attr: stoneDark }]
                ]
            ]
        };
    },
    createPortcullis: function () {
        var iron = makeAttr(DARKGRAY, BG_BLACK);
        var ironLight = makeAttr(LIGHTGRAY, BG_BLACK);
        var stone = makeAttr(BROWN, BG_BLACK);
        return {
            name: 'portcullis',
            variants: [
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: '^', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '#', attr: iron }, { char: '#', attr: iron }, { char: '#', attr: iron }],
                    [{ char: '#', attr: ironLight }, { char: '#', attr: ironLight }, { char: '#', attr: ironLight }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: '/', attr: stone }, { char: '\\', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '|', attr: iron }, { char: '#', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '|', attr: ironLight }, { char: '#', attr: ironLight }, { char: '#', attr: ironLight }, { char: '|', attr: ironLight }],
                    [{ char: '|', attr: iron }, { char: '#', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '/', attr: stone }, { char: '\\', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }, { char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }],
                    [{ char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }, { char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '/', attr: stone }, { char: '^', attr: stone }, { char: '\\', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }],
                    [{ char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }],
                    [{ char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: '/', attr: stone }, { char: '^', attr: stone }, { char: '\\', attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }],
                    [{ char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }, { char: '-', attr: ironLight }, { char: '+', attr: ironLight }],
                    [{ char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }, { char: '#', attr: iron }, { char: '|', attr: iron }]
                ]
            ]
        };
    }
};
registerRoadsideSprite('tower', CastleSprites.createTower);
registerRoadsideSprite('battlement', CastleSprites.createBattlement);
registerRoadsideSprite('torch', CastleSprites.createTorch);
registerRoadsideSprite('banner', CastleSprites.createBanner);
registerRoadsideSprite('gargoyle', CastleSprites.createGargoyle);
registerRoadsideSprite('portcullis', CastleSprites.createPortcullis);
