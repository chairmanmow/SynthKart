"use strict";
var SpaceSprites = {
    createStar: function () {
        var core = makeAttr(WHITE, BG_BLACK);
        var glow = makeAttr(YELLOW, BG_BLACK);
        var glowDim = makeAttr(LIGHTCYAN, BG_BLACK);
        var U = null;
        return {
            name: 'star',
            variants: [
                [
                    [{ char: '*', attr: core }]
                ],
                [
                    [U, { char: '.', attr: glow }, U],
                    [{ char: '-', attr: glow }, { char: '*', attr: core }, { char: '-', attr: glow }],
                    [U, { char: "'", attr: glow }, U]
                ],
                [
                    [U, U, { char: '.', attr: glowDim }, U, U],
                    [U, { char: '\\', attr: glow }, { char: '|', attr: core }, { char: '/', attr: glow }, U],
                    [{ char: '-', attr: glow }, { char: '-', attr: core }, { char: '*', attr: core }, { char: '-', attr: core }, { char: '-', attr: glow }],
                    [U, { char: '/', attr: glow }, { char: '|', attr: core }, { char: '\\', attr: glow }, U],
                    [U, U, { char: "'", attr: glowDim }, U, U]
                ],
                [
                    [U, U, { char: '.', attr: glowDim }, U, U],
                    [U, { char: '\\', attr: glow }, { char: '|', attr: core }, { char: '/', attr: glow }, U],
                    [{ char: '-', attr: glow }, { char: '-', attr: core }, { char: '*', attr: core }, { char: '-', attr: core }, { char: '-', attr: glow }],
                    [U, { char: '/', attr: glow }, { char: '|', attr: core }, { char: '\\', attr: glow }, U],
                    [U, U, { char: "'", attr: glowDim }, U, U]
                ],
                [
                    [U, U, { char: '.', attr: glowDim }, U, U],
                    [U, { char: '\\', attr: glow }, { char: '|', attr: core }, { char: '/', attr: glow }, U],
                    [{ char: '-', attr: glow }, { char: '-', attr: core }, { char: '*', attr: core }, { char: '-', attr: core }, { char: '-', attr: glow }],
                    [U, { char: '/', attr: glow }, { char: '|', attr: core }, { char: '\\', attr: glow }, U],
                    [U, U, { char: "'", attr: glowDim }, U, U]
                ]
            ]
        };
    },
    createMoon: function () {
        var moonLight = makeAttr(WHITE, BG_BLACK);
        var moonMid = makeAttr(LIGHTGRAY, BG_BLACK);
        var moonDark = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'moon',
            variants: [
                [
                    [{ char: '(', attr: moonLight }, { char: ')', attr: moonMid }],
                    [{ char: '(', attr: moonMid }, { char: ')', attr: moonDark }]
                ],
                [
                    [U, { char: '_', attr: moonLight }, U],
                    [{ char: '(', attr: moonLight }, { char: ' ', attr: moonMid }, { char: ')', attr: moonMid }],
                    [U, { char: '-', attr: moonDark }, U]
                ],
                [
                    [U, { char: '_', attr: moonLight }, { char: '_', attr: moonLight }, { char: '_', attr: moonMid }, U],
                    [{ char: '/', attr: moonLight }, { char: ' ', attr: moonLight }, { char: 'o', attr: moonMid }, { char: ' ', attr: moonMid }, { char: '\\', attr: moonMid }],
                    [{ char: '\\', attr: moonMid }, { char: ' ', attr: moonMid }, { char: ' ', attr: moonDark }, { char: 'o', attr: moonDark }, { char: '/', attr: moonDark }],
                    [U, { char: '-', attr: moonDark }, { char: '-', attr: moonDark }, { char: '-', attr: moonDark }, U]
                ],
                [
                    [U, { char: '_', attr: moonLight }, { char: '_', attr: moonLight }, { char: '_', attr: moonLight }, { char: '_', attr: moonMid }, U],
                    [{ char: '/', attr: moonLight }, { char: ' ', attr: moonLight }, { char: ' ', attr: moonLight }, { char: 'o', attr: moonMid }, { char: ' ', attr: moonMid }, { char: '\\', attr: moonMid }],
                    [{ char: '|', attr: moonLight }, { char: ' ', attr: moonMid }, { char: ' ', attr: moonMid }, { char: ' ', attr: moonMid }, { char: ' ', attr: moonDark }, { char: '|', attr: moonDark }],
                    [{ char: '\\', attr: moonMid }, { char: ' ', attr: moonDark }, { char: 'o', attr: moonDark }, { char: ' ', attr: moonDark }, { char: ' ', attr: moonDark }, { char: '/', attr: moonDark }],
                    [U, { char: '-', attr: moonDark }, { char: '-', attr: moonDark }, { char: '-', attr: moonDark }, { char: '-', attr: moonDark }, U]
                ],
                [
                    [U, { char: '_', attr: moonLight }, { char: '_', attr: moonLight }, { char: '_', attr: moonLight }, { char: '_', attr: moonMid }, U],
                    [{ char: '/', attr: moonLight }, { char: ' ', attr: moonLight }, { char: ' ', attr: moonLight }, { char: 'o', attr: moonMid }, { char: ' ', attr: moonMid }, { char: '\\', attr: moonMid }],
                    [{ char: '|', attr: moonLight }, { char: ' ', attr: moonMid }, { char: ' ', attr: moonMid }, { char: ' ', attr: moonMid }, { char: ' ', attr: moonDark }, { char: '|', attr: moonDark }],
                    [{ char: '\\', attr: moonMid }, { char: ' ', attr: moonDark }, { char: 'o', attr: moonDark }, { char: ' ', attr: moonDark }, { char: ' ', attr: moonDark }, { char: '/', attr: moonDark }],
                    [U, { char: '-', attr: moonDark }, { char: '-', attr: moonDark }, { char: '-', attr: moonDark }, { char: '-', attr: moonDark }, U]
                ]
            ]
        };
    },
    createPlanet: function () {
        var planet = makeAttr(LIGHTRED, BG_BLACK);
        var planetDark = makeAttr(RED, BG_BLACK);
        var ring = makeAttr(YELLOW, BG_BLACK);
        var ringDark = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'planet',
            variants: [
                [
                    [{ char: '(', attr: planet }, { char: ')', attr: planetDark }],
                    [{ char: '-', attr: ring }, { char: '-', attr: ringDark }]
                ],
                [
                    [U, { char: '(', attr: planet }, { char: ')', attr: planetDark }, U],
                    [{ char: '-', attr: ring }, { char: '-', attr: ring }, { char: '-', attr: ringDark }, { char: '-', attr: ringDark }],
                    [U, { char: '(', attr: planetDark }, { char: ')', attr: planetDark }, U]
                ],
                [
                    [U, { char: '/', attr: planet }, { char: GLYPH.FULL_BLOCK, attr: planet }, { char: '\\', attr: planetDark }, U],
                    [{ char: '-', attr: ring }, { char: GLYPH.FULL_BLOCK, attr: planet }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: '-', attr: ringDark }],
                    [{ char: '-', attr: ringDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: '-', attr: ringDark }],
                    [U, { char: '\\', attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: '/', attr: planetDark }, U]
                ],
                [
                    [U, U, { char: '/', attr: planet }, { char: GLYPH.FULL_BLOCK, attr: planet }, { char: '\\', attr: planetDark }, U, U],
                    [U, { char: '/', attr: planet }, { char: GLYPH.FULL_BLOCK, attr: planet }, { char: GLYPH.FULL_BLOCK, attr: planet }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: '\\', attr: planetDark }, U],
                    [{ char: '-', attr: ring }, { char: '-', attr: ring }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: '-', attr: ringDark }, { char: '-', attr: ringDark }],
                    [U, { char: '\\', attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: '/', attr: planetDark }, U],
                    [U, U, { char: '\\', attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: '/', attr: planetDark }, U, U]
                ],
                [
                    [U, U, { char: '/', attr: planet }, { char: GLYPH.FULL_BLOCK, attr: planet }, { char: '\\', attr: planetDark }, U, U],
                    [U, { char: '/', attr: planet }, { char: GLYPH.FULL_BLOCK, attr: planet }, { char: GLYPH.FULL_BLOCK, attr: planet }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: '\\', attr: planetDark }, U],
                    [{ char: '-', attr: ring }, { char: '-', attr: ring }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: '-', attr: ringDark }, { char: '-', attr: ringDark }],
                    [U, { char: '\\', attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: '/', attr: planetDark }, U],
                    [U, U, { char: '\\', attr: planetDark }, { char: GLYPH.FULL_BLOCK, attr: planetDark }, { char: '/', attr: planetDark }, U, U]
                ]
            ]
        };
    },
    createComet: function () {
        var core = makeAttr(WHITE, BG_BLACK);
        var coreGlow = makeAttr(LIGHTCYAN, BG_BLACK);
        var tail1 = makeAttr(LIGHTBLUE, BG_BLACK);
        var tail2 = makeAttr(BLUE, BG_BLACK);
        var U = null;
        return {
            name: 'comet',
            variants: [
                [
                    [{ char: '-', attr: tail2 }, { char: '=', attr: tail1 }, { char: '*', attr: core }]
                ],
                [
                    [U, U, { char: '/', attr: coreGlow }, { char: '*', attr: core }],
                    [{ char: '-', attr: tail2 }, { char: '~', attr: tail1 }, { char: '\\', attr: coreGlow }, U]
                ],
                [
                    [U, U, U, { char: '/', attr: coreGlow }, { char: 'O', attr: core }, { char: ')', attr: coreGlow }],
                    [{ char: '-', attr: tail2 }, { char: '~', attr: tail2 }, { char: '=', attr: tail1 }, { char: '=', attr: coreGlow }, { char: '\\', attr: coreGlow }, U],
                    [U, U, U, { char: '~', attr: tail1 }, U, U]
                ],
                [
                    [U, U, U, U, { char: '.', attr: coreGlow }, { char: '/', attr: coreGlow }, { char: '@', attr: core }, { char: ')', attr: coreGlow }],
                    [{ char: '-', attr: tail2 }, { char: '-', attr: tail2 }, { char: '~', attr: tail1 }, { char: '=', attr: tail1 }, { char: '=', attr: coreGlow }, { char: '@', attr: core }, { char: ')', attr: coreGlow }, U],
                    [U, U, { char: '~', attr: tail2 }, { char: '~', attr: tail1 }, { char: '=', attr: tail1 }, { char: '\\', attr: coreGlow }, U, U],
                    [U, U, U, U, { char: '~', attr: tail1 }, U, U, U]
                ],
                [
                    [U, U, U, U, { char: '.', attr: coreGlow }, { char: '/', attr: coreGlow }, { char: '@', attr: core }, { char: ')', attr: coreGlow }],
                    [{ char: '-', attr: tail2 }, { char: '-', attr: tail2 }, { char: '~', attr: tail1 }, { char: '=', attr: tail1 }, { char: '=', attr: coreGlow }, { char: '@', attr: core }, { char: ')', attr: coreGlow }, U],
                    [U, U, { char: '~', attr: tail2 }, { char: '~', attr: tail1 }, { char: '=', attr: tail1 }, { char: '\\', attr: coreGlow }, U, U],
                    [U, U, U, U, { char: '~', attr: tail1 }, U, U, U]
                ]
            ]
        };
    },
    createNebula: function () {
        var gas1 = makeAttr(LIGHTMAGENTA, BG_BLACK);
        var gas2 = makeAttr(MAGENTA, BG_BLACK);
        var gas3 = makeAttr(LIGHTBLUE, BG_BLACK);
        var gas4 = makeAttr(BLUE, BG_BLACK);
        var star = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'nebula',
            variants: [
                [
                    [{ char: GLYPH.LIGHT_SHADE, attr: gas1 }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.LIGHT_SHADE, attr: gas3 }],
                    [{ char: GLYPH.MEDIUM_SHADE, attr: gas3 }, { char: '*', attr: star }, { char: GLYPH.MEDIUM_SHADE, attr: gas1 }]
                ],
                [
                    [U, { char: GLYPH.LIGHT_SHADE, attr: gas1 }, { char: GLYPH.LIGHT_SHADE, attr: gas2 }, U],
                    [{ char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.MEDIUM_SHADE, attr: gas1 }, { char: '*', attr: star }, { char: GLYPH.MEDIUM_SHADE, attr: gas3 }],
                    [U, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, { char: GLYPH.LIGHT_SHADE, attr: gas4 }, U]
                ],
                [
                    [U, { char: GLYPH.LIGHT_SHADE, attr: gas1 }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.LIGHT_SHADE, attr: gas1 }, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, U],
                    [{ char: GLYPH.LIGHT_SHADE, attr: gas2 }, { char: GLYPH.MEDIUM_SHADE, attr: gas1 }, { char: '*', attr: star }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.MEDIUM_SHADE, attr: gas3 }, { char: GLYPH.LIGHT_SHADE, attr: gas4 }],
                    [{ char: GLYPH.MEDIUM_SHADE, attr: gas3 }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.MEDIUM_SHADE, attr: gas1 }, { char: '*', attr: star }, { char: GLYPH.LIGHT_SHADE, attr: gas4 }, { char: GLYPH.LIGHT_SHADE, attr: gas3 }],
                    [U, { char: GLYPH.LIGHT_SHADE, attr: gas4 }, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, { char: GLYPH.MEDIUM_SHADE, attr: gas4 }, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, U]
                ],
                [
                    [U, U, { char: GLYPH.LIGHT_SHADE, attr: gas1 }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.LIGHT_SHADE, attr: gas1 }, U, U],
                    [U, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.MEDIUM_SHADE, attr: gas1 }, { char: '*', attr: star }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, U],
                    [{ char: GLYPH.LIGHT_SHADE, attr: gas1 }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.MEDIUM_SHADE, attr: gas1 }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: '*', attr: star }, { char: GLYPH.MEDIUM_SHADE, attr: gas3 }, { char: GLYPH.LIGHT_SHADE, attr: gas4 }],
                    [U, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, { char: GLYPH.MEDIUM_SHADE, attr: gas4 }, { char: GLYPH.MEDIUM_SHADE, attr: gas3 }, { char: GLYPH.MEDIUM_SHADE, attr: gas4 }, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, U],
                    [U, U, { char: GLYPH.LIGHT_SHADE, attr: gas4 }, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, { char: GLYPH.LIGHT_SHADE, attr: gas4 }, U, U]
                ],
                [
                    [U, U, { char: GLYPH.LIGHT_SHADE, attr: gas1 }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.LIGHT_SHADE, attr: gas1 }, U, U],
                    [U, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.MEDIUM_SHADE, attr: gas1 }, { char: '*', attr: star }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, U],
                    [{ char: GLYPH.LIGHT_SHADE, attr: gas1 }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: GLYPH.MEDIUM_SHADE, attr: gas1 }, { char: GLYPH.MEDIUM_SHADE, attr: gas2 }, { char: '*', attr: star }, { char: GLYPH.MEDIUM_SHADE, attr: gas3 }, { char: GLYPH.LIGHT_SHADE, attr: gas4 }],
                    [U, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, { char: GLYPH.MEDIUM_SHADE, attr: gas4 }, { char: GLYPH.MEDIUM_SHADE, attr: gas3 }, { char: GLYPH.MEDIUM_SHADE, attr: gas4 }, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, U],
                    [U, U, { char: GLYPH.LIGHT_SHADE, attr: gas4 }, { char: GLYPH.LIGHT_SHADE, attr: gas3 }, { char: GLYPH.LIGHT_SHADE, attr: gas4 }, U, U]
                ]
            ]
        };
    },
    createSatellite: function () {
        var body = makeAttr(LIGHTGRAY, BG_BLACK);
        var bodyDark = makeAttr(DARKGRAY, BG_BLACK);
        var panel = makeAttr(LIGHTBLUE, BG_BLACK);
        var panelDark = makeAttr(BLUE, BG_BLACK);
        var antenna = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'satellite',
            variants: [
                [
                    [{ char: '=', attr: panel }, { char: '[', attr: body }, { char: '=', attr: panel }],
                    [U, { char: '|', attr: antenna }, U]
                ],
                [
                    [U, U, { char: '/', attr: antenna }, U, U],
                    [{ char: '=', attr: panel }, { char: '=', attr: panelDark }, { char: '[', attr: body }, { char: '=', attr: panelDark }, { char: '=', attr: panel }],
                    [U, U, { char: GLYPH.LOWER_HALF, attr: bodyDark }, U, U]
                ],
                [
                    [U, U, U, { char: '/', attr: antenna }, { char: ')', attr: antenna }, U, U],
                    [{ char: '/', attr: panel }, { char: '#', attr: panel }, { char: '\\', attr: panelDark }, { char: '[', attr: body }, { char: '/', attr: panelDark }, { char: '#', attr: panel }, { char: '\\', attr: panel }],
                    [{ char: '\\', attr: panelDark }, { char: '#', attr: panelDark }, { char: '/', attr: panel }, { char: ']', attr: bodyDark }, { char: '\\', attr: panel }, { char: '#', attr: panelDark }, { char: '/', attr: panelDark }],
                    [U, U, U, { char: GLYPH.LOWER_HALF, attr: bodyDark }, U, U, U]
                ],
                [
                    [U, U, U, U, { char: '/', attr: antenna }, { char: ')', attr: antenna }, U, U, U],
                    [U, U, U, U, { char: '[', attr: body }, { char: ']', attr: body }, U, U, U],
                    [{ char: '/', attr: panel }, { char: '#', attr: panel }, { char: '#', attr: panelDark }, { char: '/', attr: panelDark }, { char: '[', attr: body }, { char: ']', attr: bodyDark }, { char: '\\', attr: panelDark }, { char: '#', attr: panel }, { char: '\\', attr: panel }],
                    [{ char: '\\', attr: panelDark }, { char: '#', attr: panelDark }, { char: '#', attr: panel }, { char: '\\', attr: panel }, { char: '[', attr: bodyDark }, { char: ']', attr: bodyDark }, { char: '/', attr: panel }, { char: '#', attr: panelDark }, { char: '/', attr: panelDark }],
                    [U, U, U, U, { char: GLYPH.LOWER_HALF, attr: bodyDark }, { char: GLYPH.LOWER_HALF, attr: bodyDark }, U, U, U]
                ],
                [
                    [U, U, U, U, { char: '/', attr: antenna }, { char: ')', attr: antenna }, U, U, U],
                    [U, U, U, U, { char: '[', attr: body }, { char: ']', attr: body }, U, U, U],
                    [{ char: '/', attr: panel }, { char: '#', attr: panel }, { char: '#', attr: panelDark }, { char: '/', attr: panelDark }, { char: '[', attr: body }, { char: ']', attr: bodyDark }, { char: '\\', attr: panelDark }, { char: '#', attr: panel }, { char: '\\', attr: panel }],
                    [{ char: '\\', attr: panelDark }, { char: '#', attr: panelDark }, { char: '#', attr: panel }, { char: '\\', attr: panel }, { char: '[', attr: bodyDark }, { char: ']', attr: bodyDark }, { char: '/', attr: panel }, { char: '#', attr: panelDark }, { char: '/', attr: panelDark }],
                    [U, U, U, U, { char: GLYPH.LOWER_HALF, attr: bodyDark }, { char: GLYPH.LOWER_HALF, attr: bodyDark }, U, U, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('star', SpaceSprites.createStar);
registerRoadsideSprite('moon', SpaceSprites.createMoon);
registerRoadsideSprite('planet', SpaceSprites.createPlanet);
registerRoadsideSprite('comet', SpaceSprites.createComet);
registerRoadsideSprite('nebula', SpaceSprites.createNebula);
registerRoadsideSprite('satellite', SpaceSprites.createSatellite);
