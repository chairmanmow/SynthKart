"use strict";
var VillainSprites = {
    createLavaRock: function () {
        var rock = makeAttr(DARKGRAY, BG_BLACK);
        var rockDark = makeAttr(BLACK, BG_BLACK);
        var lava = makeAttr(LIGHTRED, BG_BLACK);
        var lavaGlow = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'lava_rock',
            variants: [
                [
                    [{ char: '(', attr: rock }, { char: ')', attr: rock }],
                    [{ char: GLYPH.LOWER_HALF, attr: lava }, { char: GLYPH.LOWER_HALF, attr: lava }]
                ],
                [
                    [U, { char: '^', attr: rock }, U],
                    [{ char: '(', attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: ')', attr: rockDark }],
                    [{ char: '~', attr: lava }, { char: '~', attr: lavaGlow }, { char: '~', attr: lava }]
                ],
                [
                    [U, { char: '/', attr: rock }, { char: '^', attr: rockDark }, { char: '\\', attr: rock }, U],
                    [{ char: '/', attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: '\\', attr: rockDark }],
                    [{ char: '(', attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: '*', attr: lavaGlow }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: ')', attr: rock }],
                    [{ char: '~', attr: lava }, { char: '~', attr: lavaGlow }, { char: '~', attr: lava }, { char: '~', attr: lavaGlow }, { char: '~', attr: lava }]
                ],
                [
                    [U, U, { char: '/', attr: rock }, { char: '^', attr: rockDark }, { char: '\\', attr: rock }, U, U],
                    [U, { char: '/', attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: '\\', attr: rockDark }, U],
                    [{ char: '/', attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: '*', attr: lavaGlow }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: '\\', attr: rock }],
                    [{ char: '(', attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: '*', attr: lava }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: ')', attr: rockDark }],
                    [{ char: '~', attr: lavaGlow }, { char: '~', attr: lava }, { char: '~', attr: lavaGlow }, { char: '~', attr: lava }, { char: '~', attr: lavaGlow }, { char: '~', attr: lava }, { char: '~', attr: lavaGlow }]
                ],
                [
                    [U, U, { char: '/', attr: rock }, { char: '^', attr: rockDark }, { char: '\\', attr: rock }, U, U],
                    [U, { char: '/', attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: '\\', attr: rockDark }, U],
                    [{ char: '/', attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: '*', attr: lavaGlow }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: '\\', attr: rock }],
                    [{ char: '(', attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: '*', attr: lava }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: ')', attr: rockDark }],
                    [{ char: '~', attr: lavaGlow }, { char: '~', attr: lava }, { char: '~', attr: lavaGlow }, { char: '~', attr: lava }, { char: '~', attr: lavaGlow }, { char: '~', attr: lava }, { char: '~', attr: lavaGlow }]
                ]
            ]
        };
    },
    createFlame: function () {
        var core = makeAttr(YELLOW, BG_BLACK);
        var mid = makeAttr(LIGHTRED, BG_BLACK);
        var outer = makeAttr(RED, BG_BLACK);
        var smoke = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'flame',
            variants: [
                [
                    [{ char: '*', attr: core }],
                    [{ char: '^', attr: mid }],
                    [{ char: '~', attr: outer }]
                ],
                [
                    [U, { char: '.', attr: smoke }, U],
                    [U, { char: '*', attr: core }, U],
                    [{ char: '(', attr: mid }, { char: '^', attr: core }, { char: ')', attr: mid }],
                    [{ char: '~', attr: outer }, { char: '^', attr: mid }, { char: '~', attr: outer }]
                ],
                [
                    [U, U, { char: '.', attr: smoke }, U, U],
                    [U, { char: '(', attr: core }, { char: '*', attr: core }, { char: ')', attr: core }, U],
                    [{ char: '(', attr: mid }, { char: '^', attr: core }, { char: '*', attr: core }, { char: '^', attr: core }, { char: ')', attr: mid }],
                    [{ char: '(', attr: outer }, { char: '^', attr: mid }, { char: '^', attr: core }, { char: '^', attr: mid }, { char: ')', attr: outer }],
                    [U, { char: '~', attr: outer }, { char: '^', attr: mid }, { char: '~', attr: outer }, U]
                ],
                [
                    [U, U, { char: '.', attr: smoke }, { char: '.', attr: smoke }, { char: '.', attr: smoke }, U, U],
                    [U, U, { char: '(', attr: core }, { char: '*', attr: core }, { char: ')', attr: core }, U, U],
                    [U, { char: '(', attr: mid }, { char: '^', attr: core }, { char: '*', attr: core }, { char: '^', attr: core }, { char: ')', attr: mid }, U],
                    [{ char: '(', attr: outer }, { char: '^', attr: mid }, { char: '^', attr: core }, { char: '*', attr: core }, { char: '^', attr: core }, { char: '^', attr: mid }, { char: ')', attr: outer }],
                    [{ char: '(', attr: outer }, { char: '^', attr: outer }, { char: '^', attr: mid }, { char: '^', attr: core }, { char: '^', attr: mid }, { char: '^', attr: outer }, { char: ')', attr: outer }],
                    [U, { char: '~', attr: outer }, { char: '~', attr: mid }, { char: '^', attr: mid }, { char: '~', attr: mid }, { char: '~', attr: outer }, U]
                ],
                [
                    [U, U, { char: '.', attr: smoke }, { char: '.', attr: smoke }, { char: '.', attr: smoke }, U, U],
                    [U, U, { char: '(', attr: core }, { char: '*', attr: core }, { char: ')', attr: core }, U, U],
                    [U, { char: '(', attr: mid }, { char: '^', attr: core }, { char: '*', attr: core }, { char: '^', attr: core }, { char: ')', attr: mid }, U],
                    [{ char: '(', attr: outer }, { char: '^', attr: mid }, { char: '^', attr: core }, { char: '*', attr: core }, { char: '^', attr: core }, { char: '^', attr: mid }, { char: ')', attr: outer }],
                    [{ char: '(', attr: outer }, { char: '^', attr: outer }, { char: '^', attr: mid }, { char: '^', attr: core }, { char: '^', attr: mid }, { char: '^', attr: outer }, { char: ')', attr: outer }],
                    [U, { char: '~', attr: outer }, { char: '~', attr: mid }, { char: '^', attr: mid }, { char: '~', attr: mid }, { char: '~', attr: outer }, U]
                ]
            ]
        };
    },
    createSkullPile: function () {
        var skull = makeAttr(WHITE, BG_BLACK);
        var skullDark = makeAttr(LIGHTGRAY, BG_BLACK);
        var bone = makeAttr(LIGHTGRAY, BG_BLACK);
        var eye = makeAttr(RED, BG_BLACK);
        var U = null;
        return {
            name: 'skull_pile',
            variants: [
                [
                    [{ char: '(', attr: skull }, { char: ')', attr: skull }],
                    [{ char: 'o', attr: skullDark }, { char: 'o', attr: skullDark }]
                ],
                [
                    [U, { char: '(', attr: skull }, { char: ')', attr: skull }],
                    [{ char: '(', attr: skullDark }, { char: 'o', attr: eye }, { char: ')', attr: skullDark }],
                    [{ char: '-', attr: bone }, { char: '-', attr: bone }, { char: '-', attr: bone }]
                ],
                [
                    [U, { char: '/', attr: skull }, { char: 'O', attr: skull }, { char: '\\', attr: skull }, U],
                    [{ char: '/', attr: skullDark }, { char: '.', attr: eye }, { char: 'v', attr: skull }, { char: '.', attr: eye }, { char: '\\', attr: skullDark }],
                    [{ char: '(', attr: skull }, { char: 'o', attr: skullDark }, { char: '(', attr: skull }, { char: 'o', attr: skullDark }, { char: ')', attr: skull }],
                    [{ char: '-', attr: bone }, { char: '=', attr: bone }, { char: '-', attr: bone }, { char: '=', attr: bone }, { char: '-', attr: bone }]
                ],
                [
                    [U, U, { char: '/', attr: skull }, { char: 'O', attr: skull }, { char: '\\', attr: skull }, U, U],
                    [U, { char: '/', attr: skull }, { char: '*', attr: eye }, { char: 'v', attr: skull }, { char: '*', attr: eye }, { char: '\\', attr: skull }, U],
                    [{ char: '/', attr: skullDark }, { char: 'O', attr: skull }, { char: '\\', attr: skullDark }, U, { char: '/', attr: skullDark }, { char: 'O', attr: skull }, { char: '\\', attr: skullDark }],
                    [{ char: '.', attr: eye }, { char: 'v', attr: skull }, { char: '.', attr: eye }, { char: '-', attr: bone }, { char: '.', attr: eye }, { char: 'v', attr: skull }, { char: '.', attr: eye }],
                    [{ char: '-', attr: bone }, { char: '=', attr: bone }, { char: '-', attr: bone }, { char: '=', attr: bone }, { char: '-', attr: bone }, { char: '=', attr: bone }, { char: '-', attr: bone }]
                ],
                [
                    [U, U, { char: '/', attr: skull }, { char: 'O', attr: skull }, { char: '\\', attr: skull }, U, U],
                    [U, { char: '/', attr: skull }, { char: '*', attr: eye }, { char: 'v', attr: skull }, { char: '*', attr: eye }, { char: '\\', attr: skull }, U],
                    [{ char: '/', attr: skullDark }, { char: 'O', attr: skull }, { char: '\\', attr: skullDark }, U, { char: '/', attr: skullDark }, { char: 'O', attr: skull }, { char: '\\', attr: skullDark }],
                    [{ char: '.', attr: eye }, { char: 'v', attr: skull }, { char: '.', attr: eye }, { char: '-', attr: bone }, { char: '.', attr: eye }, { char: 'v', attr: skull }, { char: '.', attr: eye }],
                    [{ char: '-', attr: bone }, { char: '=', attr: bone }, { char: '-', attr: bone }, { char: '=', attr: bone }, { char: '-', attr: bone }, { char: '=', attr: bone }, { char: '-', attr: bone }]
                ]
            ]
        };
    },
    createChain: function () {
        var chain = makeAttr(DARKGRAY, BG_BLACK);
        var chainLight = makeAttr(LIGHTGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'chain',
            variants: [
                [
                    [{ char: 'o', attr: chain }],
                    [{ char: 'O', attr: chainLight }],
                    [{ char: 'o', attr: chain }],
                    [{ char: 'O', attr: chainLight }]
                ],
                [
                    [{ char: '(', attr: chain }, { char: ')', attr: chain }],
                    [U, { char: 'O', attr: chainLight }],
                    [{ char: '(', attr: chain }, { char: ')', attr: chain }],
                    [U, { char: 'O', attr: chainLight }],
                    [{ char: '(', attr: chain }, { char: ')', attr: chain }]
                ],
                [
                    [{ char: '/', attr: chain }, { char: 'o', attr: chainLight }, { char: '\\', attr: chain }],
                    [U, { char: 'O', attr: chain }, U],
                    [{ char: '/', attr: chainLight }, { char: 'o', attr: chain }, { char: '\\', attr: chainLight }],
                    [U, { char: 'O', attr: chainLight }, U],
                    [{ char: '/', attr: chain }, { char: 'o', attr: chainLight }, { char: '\\', attr: chain }],
                    [U, { char: 'O', attr: chain }, U]
                ],
                [
                    [{ char: '/', attr: chain }, { char: 'O', attr: chainLight }, { char: '\\', attr: chain }],
                    [{ char: '\\', attr: chainLight }, { char: 'o', attr: chain }, { char: '/', attr: chainLight }],
                    [{ char: '/', attr: chain }, { char: 'O', attr: chainLight }, { char: '\\', attr: chain }],
                    [{ char: '\\', attr: chainLight }, { char: 'o', attr: chain }, { char: '/', attr: chainLight }],
                    [{ char: '/', attr: chain }, { char: 'O', attr: chainLight }, { char: '\\', attr: chain }],
                    [{ char: '\\', attr: chainLight }, { char: 'o', attr: chain }, { char: '/', attr: chainLight }],
                    [U, { char: 'V', attr: chain }, U]
                ],
                [
                    [{ char: '/', attr: chain }, { char: 'O', attr: chainLight }, { char: '\\', attr: chain }],
                    [{ char: '\\', attr: chainLight }, { char: 'o', attr: chain }, { char: '/', attr: chainLight }],
                    [{ char: '/', attr: chain }, { char: 'O', attr: chainLight }, { char: '\\', attr: chain }],
                    [{ char: '\\', attr: chainLight }, { char: 'o', attr: chain }, { char: '/', attr: chainLight }],
                    [{ char: '/', attr: chain }, { char: 'O', attr: chainLight }, { char: '\\', attr: chain }],
                    [{ char: '\\', attr: chainLight }, { char: 'o', attr: chain }, { char: '/', attr: chainLight }],
                    [U, { char: 'V', attr: chain }, U]
                ]
            ]
        };
    },
    createSpike: function () {
        var spike = makeAttr(LIGHTGRAY, BG_BLACK);
        var spikeDark = makeAttr(DARKGRAY, BG_BLACK);
        var blood = makeAttr(RED, BG_BLACK);
        var U = null;
        return {
            name: 'spike',
            variants: [
                [
                    [{ char: '^', attr: spike }, { char: '^', attr: spike }, { char: '^', attr: spike }],
                    [{ char: '/', attr: spikeDark }, { char: '|', attr: spike }, { char: '\\', attr: spikeDark }]
                ],
                [
                    [U, { char: '^', attr: spike }, { char: '^', attr: spike }, U],
                    [{ char: '/', attr: spikeDark }, { char: '|', attr: spike }, { char: '|', attr: spike }, { char: '\\', attr: spikeDark }],
                    [{ char: '/', attr: spikeDark }, { char: '/', attr: spike }, { char: '\\', attr: spike }, { char: '\\', attr: spikeDark }]
                ],
                [
                    [U, { char: '^', attr: spike }, U, { char: '^', attr: spike }, U],
                    [{ char: '/', attr: spikeDark }, { char: '|', attr: spike }, { char: '^', attr: spike }, { char: '|', attr: spike }, { char: '\\', attr: spikeDark }],
                    [{ char: '|', attr: spikeDark }, { char: '|', attr: spike }, { char: '|', attr: spike }, { char: '|', attr: spike }, { char: '|', attr: spikeDark }],
                    [{ char: '/', attr: spikeDark }, { char: '-', attr: spike }, { char: '-', attr: spike }, { char: '-', attr: spike }, { char: '\\', attr: spikeDark }]
                ],
                [
                    [U, { char: '^', attr: spike }, U, { char: '^', attr: spike }, U, { char: '^', attr: spike }, U],
                    [{ char: '/', attr: spikeDark }, { char: '|', attr: spike }, { char: '/', attr: spikeDark }, { char: '|', attr: spike }, { char: '\\', attr: spikeDark }, { char: '|', attr: spike }, { char: '\\', attr: spikeDark }],
                    [{ char: '|', attr: spikeDark }, { char: '|', attr: spike }, { char: '|', attr: spikeDark }, { char: '|', attr: spike }, { char: '|', attr: spikeDark }, { char: '|', attr: spike }, { char: '|', attr: spikeDark }],
                    [{ char: '|', attr: spike }, { char: '|', attr: spikeDark }, { char: '|', attr: spike }, { char: '.', attr: blood }, { char: '|', attr: spike }, { char: '|', attr: spikeDark }, { char: '|', attr: spike }],
                    [{ char: '-', attr: spikeDark }, { char: '-', attr: spike }, { char: '-', attr: spikeDark }, { char: '-', attr: spike }, { char: '-', attr: spikeDark }, { char: '-', attr: spike }, { char: '-', attr: spikeDark }]
                ],
                [
                    [U, { char: '^', attr: spike }, U, { char: '^', attr: spike }, U, { char: '^', attr: spike }, U],
                    [{ char: '/', attr: spikeDark }, { char: '|', attr: spike }, { char: '/', attr: spikeDark }, { char: '|', attr: spike }, { char: '\\', attr: spikeDark }, { char: '|', attr: spike }, { char: '\\', attr: spikeDark }],
                    [{ char: '|', attr: spikeDark }, { char: '|', attr: spike }, { char: '|', attr: spikeDark }, { char: '|', attr: spike }, { char: '|', attr: spikeDark }, { char: '|', attr: spike }, { char: '|', attr: spikeDark }],
                    [{ char: '|', attr: spike }, { char: '|', attr: spikeDark }, { char: '|', attr: spike }, { char: '.', attr: blood }, { char: '|', attr: spike }, { char: '|', attr: spikeDark }, { char: '|', attr: spike }],
                    [{ char: '-', attr: spikeDark }, { char: '-', attr: spike }, { char: '-', attr: spikeDark }, { char: '-', attr: spike }, { char: '-', attr: spikeDark }, { char: '-', attr: spike }, { char: '-', attr: spikeDark }]
                ]
            ]
        };
    },
    createCauldron: function () {
        var pot = makeAttr(DARKGRAY, BG_BLACK);
        var potDark = makeAttr(BLACK, BG_BLACK);
        var brew = makeAttr(LIGHTGREEN, BG_BLACK);
        var bubble = makeAttr(GREEN, BG_BLACK);
        var fire = makeAttr(LIGHTRED, BG_BLACK);
        var U = null;
        return {
            name: 'cauldron',
            variants: [
                [
                    [{ char: 'o', attr: bubble }, { char: 'o', attr: bubble }],
                    [{ char: '(', attr: pot }, { char: ')', attr: pot }],
                    [{ char: '^', attr: fire }, { char: '^', attr: fire }]
                ],
                [
                    [U, { char: 'o', attr: bubble }, U],
                    [{ char: '(', attr: pot }, { char: '~', attr: brew }, { char: ')', attr: pot }],
                    [{ char: '(', attr: potDark }, { char: '_', attr: pot }, { char: ')', attr: potDark }],
                    [{ char: '^', attr: fire }, { char: '^', attr: fire }, { char: '^', attr: fire }]
                ],
                [
                    [U, { char: 'o', attr: bubble }, U, { char: 'o', attr: bubble }, U],
                    [{ char: '/', attr: pot }, { char: '~', attr: brew }, { char: '~', attr: brew }, { char: '~', attr: brew }, { char: '\\', attr: pot }],
                    [{ char: '|', attr: pot }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: '|', attr: pot }],
                    [{ char: '\\', attr: potDark }, { char: '_', attr: pot }, { char: '_', attr: pot }, { char: '_', attr: pot }, { char: '/', attr: potDark }],
                    [U, { char: '^', attr: fire }, { char: '*', attr: fire }, { char: '^', attr: fire }, U]
                ],
                [
                    [U, { char: 'o', attr: bubble }, U, { char: 'o', attr: bubble }, U, { char: 'o', attr: bubble }, U],
                    [U, { char: '/', attr: pot }, { char: '~', attr: brew }, { char: '~', attr: brew }, { char: '~', attr: brew }, { char: '\\', attr: pot }, U],
                    [{ char: '/', attr: pot }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: 'o', attr: bubble }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: 'o', attr: bubble }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: '\\', attr: pot }],
                    [{ char: '|', attr: potDark }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: '|', attr: potDark }],
                    [{ char: '\\', attr: potDark }, { char: '_', attr: pot }, { char: '_', attr: pot }, { char: '_', attr: pot }, { char: '_', attr: pot }, { char: '_', attr: pot }, { char: '/', attr: potDark }],
                    [U, { char: '^', attr: fire }, { char: '*', attr: fire }, { char: '^', attr: fire }, { char: '*', attr: fire }, { char: '^', attr: fire }, U]
                ],
                [
                    [U, { char: 'o', attr: bubble }, U, { char: 'o', attr: bubble }, U, { char: 'o', attr: bubble }, U],
                    [U, { char: '/', attr: pot }, { char: '~', attr: brew }, { char: '~', attr: brew }, { char: '~', attr: brew }, { char: '\\', attr: pot }, U],
                    [{ char: '/', attr: pot }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: 'o', attr: bubble }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: 'o', attr: bubble }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: '\\', attr: pot }],
                    [{ char: '|', attr: potDark }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: GLYPH.FULL_BLOCK, attr: brew }, { char: '|', attr: potDark }],
                    [{ char: '\\', attr: potDark }, { char: '_', attr: pot }, { char: '_', attr: pot }, { char: '_', attr: pot }, { char: '_', attr: pot }, { char: '_', attr: pot }, { char: '/', attr: potDark }],
                    [U, { char: '^', attr: fire }, { char: '*', attr: fire }, { char: '^', attr: fire }, { char: '*', attr: fire }, { char: '^', attr: fire }, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('lava_rock', VillainSprites.createLavaRock);
registerRoadsideSprite('flame', VillainSprites.createFlame);
registerRoadsideSprite('skull_pile', VillainSprites.createSkullPile);
registerRoadsideSprite('chain', VillainSprites.createChain);
registerRoadsideSprite('spike', VillainSprites.createSpike);
registerRoadsideSprite('cauldron', VillainSprites.createCauldron);
