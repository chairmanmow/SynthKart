"use strict";
var DesertSprites = {
    createSaguaro: function () {
        var cactus = makeAttr(GREEN, BG_BLACK);
        var cactusDark = makeAttr(CYAN, BG_BLACK);
        var U = null;
        return {
            name: 'saguaro',
            variants: [
                [
                    [{ char: '|', attr: cactus }],
                    [{ char: '|', attr: cactus }],
                    [{ char: '|', attr: cactus }]
                ],
                [
                    [U, { char: '|', attr: cactus }, U],
                    [{ char: '/', attr: cactus }, { char: '|', attr: cactus }, { char: '\\', attr: cactus }],
                    [{ char: '|', attr: cactusDark }, { char: '|', attr: cactus }, { char: '|', attr: cactusDark }],
                    [U, { char: '|', attr: cactus }, U]
                ],
                [
                    [U, U, { char: '(', attr: cactus }, U, U],
                    [{ char: '_', attr: cactus }, U, { char: '|', attr: cactus }, U, { char: '_', attr: cactus }],
                    [{ char: '|', attr: cactusDark }, { char: '/', attr: cactus }, { char: '|', attr: cactus }, { char: '\\', attr: cactus }, { char: '|', attr: cactusDark }],
                    [{ char: '|', attr: cactusDark }, U, { char: '|', attr: cactus }, U, { char: '|', attr: cactusDark }],
                    [U, U, { char: '|', attr: cactus }, U, U]
                ],
                [
                    [U, U, U, { char: '(', attr: cactus }, U, U, U],
                    [{ char: '_', attr: cactus }, U, U, { char: '|', attr: cactus }, U, U, { char: '_', attr: cactus }],
                    [{ char: '|', attr: cactusDark }, U, { char: '/', attr: cactus }, { char: '|', attr: cactus }, { char: '\\', attr: cactus }, U, { char: '|', attr: cactusDark }],
                    [{ char: '|', attr: cactusDark }, { char: '/', attr: cactus }, U, { char: '|', attr: cactus }, U, { char: '\\', attr: cactus }, { char: '|', attr: cactusDark }],
                    [U, { char: '|', attr: cactusDark }, U, { char: '|', attr: cactus }, U, { char: '|', attr: cactusDark }, U],
                    [U, U, U, { char: '|', attr: cactus }, U, U, U]
                ],
                [
                    [U, U, U, { char: '(', attr: cactus }, U, U, U],
                    [{ char: '_', attr: cactus }, U, U, { char: '|', attr: cactus }, U, U, { char: '_', attr: cactus }],
                    [{ char: '|', attr: cactusDark }, U, { char: '/', attr: cactus }, { char: '|', attr: cactus }, { char: '\\', attr: cactus }, U, { char: '|', attr: cactusDark }],
                    [{ char: '|', attr: cactusDark }, { char: '/', attr: cactus }, U, { char: '|', attr: cactus }, U, { char: '\\', attr: cactus }, { char: '|', attr: cactusDark }],
                    [U, { char: '|', attr: cactusDark }, U, { char: '|', attr: cactus }, U, { char: '|', attr: cactusDark }, U],
                    [U, { char: '|', attr: cactusDark }, U, { char: '|', attr: cactus }, U, { char: '|', attr: cactusDark }, U],
                    [U, U, U, { char: '|', attr: cactus }, U, U, U]
                ]
            ]
        };
    },
    createBarrelCactus: function () {
        var cactus = makeAttr(GREEN, BG_BLACK);
        var spine = makeAttr(YELLOW, BG_BLACK);
        var flower = makeAttr(LIGHTRED, BG_BLACK);
        var U = null;
        return {
            name: 'barrel',
            variants: [
                [
                    [{ char: '(', attr: cactus }, { char: ')', attr: cactus }],
                    [{ char: GLYPH.LOWER_HALF, attr: cactus }, { char: GLYPH.LOWER_HALF, attr: cactus }]
                ],
                [
                    [{ char: '(', attr: cactus }, { char: '*', attr: flower }, { char: ')', attr: cactus }],
                    [{ char: GLYPH.LOWER_HALF, attr: cactus }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: GLYPH.LOWER_HALF, attr: cactus }]
                ],
                [
                    [U, { char: '*', attr: flower }, { char: '*', attr: flower }, U],
                    [{ char: '(', attr: cactus }, { char: '|', attr: spine }, { char: '|', attr: spine }, { char: ')', attr: cactus }],
                    [{ char: GLYPH.LOWER_HALF, attr: cactus }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: GLYPH.LOWER_HALF, attr: cactus }]
                ],
                [
                    [U, U, { char: '@', attr: flower }, U, U],
                    [U, { char: '/', attr: spine }, { char: GLYPH.UPPER_HALF, attr: cactus }, { char: '\\', attr: spine }, U],
                    [{ char: '(', attr: cactus }, { char: '|', attr: spine }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: '|', attr: spine }, { char: ')', attr: cactus }],
                    [U, { char: GLYPH.LOWER_HALF, attr: cactus }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: GLYPH.LOWER_HALF, attr: cactus }, U]
                ],
                [
                    [U, U, { char: '@', attr: flower }, U, U],
                    [U, { char: '/', attr: spine }, { char: GLYPH.UPPER_HALF, attr: cactus }, { char: '\\', attr: spine }, U],
                    [{ char: '(', attr: cactus }, { char: '|', attr: spine }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: '|', attr: spine }, { char: ')', attr: cactus }],
                    [U, { char: GLYPH.LOWER_HALF, attr: cactus }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: GLYPH.LOWER_HALF, attr: cactus }, U]
                ]
            ]
        };
    },
    createTumbleweed: function () {
        var weed = makeAttr(BROWN, BG_BLACK);
        var weedLight = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'tumbleweed',
            variants: [
                [
                    [{ char: '@', attr: weed }, { char: '@', attr: weed }],
                    [{ char: '@', attr: weed }, { char: '@', attr: weed }]
                ],
                [
                    [U, { char: '@', attr: weedLight }, U],
                    [{ char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weed }],
                    [U, { char: '@', attr: weed }, U]
                ],
                [
                    [U, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, U],
                    [{ char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, { char: '@', attr: weed }],
                    [U, { char: '@', attr: weed }, { char: '@', attr: weed }, U]
                ],
                [
                    [U, { char: '~', attr: weedLight }, { char: '@', attr: weedLight }, { char: '~', attr: weedLight }, U],
                    [{ char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, { char: '@', attr: weed }],
                    [{ char: '@', attr: weed }, { char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weed }, { char: '@', attr: weed }],
                    [U, { char: '~', attr: weed }, { char: '@', attr: weed }, { char: '~', attr: weed }, U]
                ],
                [
                    [U, { char: '~', attr: weedLight }, { char: '@', attr: weedLight }, { char: '~', attr: weedLight }, U],
                    [{ char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, { char: '@', attr: weed }],
                    [{ char: '@', attr: weed }, { char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weed }, { char: '@', attr: weed }],
                    [U, { char: '~', attr: weed }, { char: '@', attr: weed }, { char: '~', attr: weed }, U]
                ]
            ]
        };
    },
    createCowSkull: function () {
        var bone = makeAttr(WHITE, BG_BLACK);
        var eye = makeAttr(BLACK, BG_LIGHTGRAY);
        var U = null;
        return {
            name: 'cowskull',
            variants: [
                [
                    [{ char: '\\', attr: bone }, { char: 'o', attr: bone }, { char: '/', attr: bone }],
                    [U, { char: 'V', attr: bone }, U]
                ],
                [
                    [{ char: '~', attr: bone }, U, U, { char: '~', attr: bone }],
                    [{ char: '(', attr: bone }, { char: 'o', attr: eye }, { char: 'o', attr: eye }, { char: ')', attr: bone }],
                    [U, { char: '\\', attr: bone }, { char: '/', attr: bone }, U]
                ],
                [
                    [{ char: '~', attr: bone }, { char: '_', attr: bone }, U, { char: '_', attr: bone }, { char: '~', attr: bone }],
                    [{ char: '(', attr: bone }, { char: 'O', attr: eye }, { char: ' ', attr: bone }, { char: 'O', attr: eye }, { char: ')', attr: bone }],
                    [U, { char: '\\', attr: bone }, { char: 'v', attr: bone }, { char: '/', attr: bone }, U],
                    [U, U, { char: 'w', attr: bone }, U, U]
                ],
                [
                    [{ char: '/', attr: bone }, { char: '~', attr: bone }, { char: '_', attr: bone }, U, { char: '_', attr: bone }, { char: '~', attr: bone }, { char: '\\', attr: bone }],
                    [U, { char: '(', attr: bone }, { char: 'O', attr: eye }, { char: ' ', attr: bone }, { char: 'O', attr: eye }, { char: ')', attr: bone }, U],
                    [U, { char: '(', attr: bone }, { char: ' ', attr: bone }, { char: 'v', attr: bone }, { char: ' ', attr: bone }, { char: ')', attr: bone }, U],
                    [U, U, { char: '\\', attr: bone }, { char: 'w', attr: bone }, { char: '/', attr: bone }, U, U],
                    [U, U, U, { char: '|', attr: bone }, U, U, U]
                ],
                [
                    [{ char: '/', attr: bone }, { char: '~', attr: bone }, { char: '_', attr: bone }, U, { char: '_', attr: bone }, { char: '~', attr: bone }, { char: '\\', attr: bone }],
                    [U, { char: '(', attr: bone }, { char: 'O', attr: eye }, { char: ' ', attr: bone }, { char: 'O', attr: eye }, { char: ')', attr: bone }, U],
                    [U, { char: '(', attr: bone }, { char: ' ', attr: bone }, { char: 'v', attr: bone }, { char: ' ', attr: bone }, { char: ')', attr: bone }, U],
                    [U, U, { char: '\\', attr: bone }, { char: 'w', attr: bone }, { char: '/', attr: bone }, U, U],
                    [U, U, U, { char: '|', attr: bone }, U, U, U]
                ]
            ]
        };
    },
    createDesertRock: function () {
        var rock = makeAttr(BROWN, BG_BLACK);
        var rockDark = makeAttr(DARKGRAY, BG_BLACK);
        var rockLight = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'desertrock',
            variants: [
                [
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.LOWER_HALF, attr: rock }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: rockLight }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.LOWER_HALF, attr: rockDark }]
                ],
                [
                    [U, { char: '_', attr: rockLight }, { char: '_', attr: rockLight }, U],
                    [{ char: '/', attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.MEDIUM_SHADE, attr: rockDark }, { char: '\\', attr: rockDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.LOWER_HALF, attr: rockDark }]
                ],
                [
                    [U, { char: '_', attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: '_', attr: rockLight }, U],
                    [{ char: '/', attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.MEDIUM_SHADE, attr: rockDark }, { char: '\\', attr: rockDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.LOWER_HALF, attr: rockDark }]
                ],
                [
                    [U, { char: '_', attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: '_', attr: rockLight }, U],
                    [{ char: '/', attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.MEDIUM_SHADE, attr: rockDark }, { char: '\\', attr: rockDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.LOWER_HALF, attr: rockDark }]
                ]
            ]
        };
    },
    createWesternSign: function () {
        var wood = makeAttr(BROWN, BG_BLACK);
        var text = makeAttr(YELLOW, BG_BROWN);
        var U = null;
        return {
            name: 'westernsign',
            variants: [
                [
                    [{ char: '[', attr: wood }, { char: ']', attr: wood }],
                    [U, { char: '|', attr: wood }]
                ],
                [
                    [{ char: '[', attr: wood }, { char: '>', attr: text }, { char: ']', attr: wood }],
                    [U, { char: '|', attr: wood }, U],
                    [U, { char: '|', attr: wood }, U]
                ],
                [
                    [{ char: '[', attr: wood }, { char: 'G', attr: text }, { char: 'O', attr: text }, { char: '!', attr: text }, { char: '>', attr: wood }],
                    [U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '|', attr: wood }, U, U]
                ],
                [
                    [{ char: '<', attr: wood }, { char: 'W', attr: text }, { char: 'E', attr: text }, { char: 'S', attr: text }, { char: 'T', attr: text }, { char: '>', attr: wood }],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '-', attr: wood }, { char: '+', attr: wood }, { char: '-', attr: wood }, U]
                ],
                [
                    [{ char: '<', attr: wood }, { char: 'W', attr: text }, { char: 'E', attr: text }, { char: 'S', attr: text }, { char: 'T', attr: text }, { char: '>', attr: wood }],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '-', attr: wood }, { char: '+', attr: wood }, { char: '-', attr: wood }, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('saguaro', DesertSprites.createSaguaro);
registerRoadsideSprite('barrel', DesertSprites.createBarrelCactus);
registerRoadsideSprite('tumbleweed', DesertSprites.createTumbleweed);
registerRoadsideSprite('cowskull', DesertSprites.createCowSkull);
registerRoadsideSprite('desertrock', DesertSprites.createDesertRock);
registerRoadsideSprite('westernsign', DesertSprites.createWesternSign);
