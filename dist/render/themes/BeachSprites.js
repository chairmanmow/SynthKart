"use strict";
var BeachSprites = {
    createPalm: function () {
        var frond = makeAttr(LIGHTGREEN, BG_BLACK);
        var frondDark = makeAttr(GREEN, BG_BLACK);
        var trunk = makeAttr(BROWN, BG_BLACK);
        var coconut = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'palm',
            variants: [
                [
                    [{ char: 'Y', attr: frond }],
                    [{ char: '|', attr: trunk }],
                    [{ char: '|', attr: trunk }]
                ],
                [
                    [{ char: '\\', attr: frondDark }, { char: '|', attr: frond }, { char: '/', attr: frondDark }],
                    [U, { char: '|', attr: trunk }, U],
                    [U, { char: '|', attr: trunk }, U],
                    [U, { char: '|', attr: trunk }, U]
                ],
                [
                    [{ char: '~', attr: frondDark }, { char: '\\', attr: frond }, { char: '|', attr: frond }, { char: '/', attr: frond }, { char: '~', attr: frondDark }],
                    [U, { char: '\\', attr: frond }, { char: 'o', attr: coconut }, { char: '/', attr: frond }, U],
                    [U, U, { char: '|', attr: trunk }, U, U],
                    [U, U, { char: ')', attr: trunk }, U, U],
                    [U, U, { char: '|', attr: trunk }, U, U]
                ],
                [
                    [{ char: '/', attr: frondDark }, { char: '~', attr: frond }, U, U, U, { char: '~', attr: frond }, { char: '\\', attr: frondDark }],
                    [U, { char: '\\', attr: frond }, { char: '_', attr: frond }, { char: 'Y', attr: frond }, { char: '_', attr: frond }, { char: '/', attr: frond }, U],
                    [U, U, { char: '\\', attr: frondDark }, { char: '|', attr: trunk }, { char: '/', attr: frondDark }, U, U],
                    [U, U, U, { char: '(', attr: trunk }, U, U, U],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U],
                    [U, U, U, { char: ')', attr: trunk }, U, U, U],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U]
                ],
                [
                    [{ char: '/', attr: frondDark }, { char: '~', attr: frond }, { char: '~', attr: frondDark }, U, U, U, { char: '~', attr: frondDark }, { char: '~', attr: frond }, { char: '\\', attr: frondDark }],
                    [U, { char: '\\', attr: frond }, { char: '_', attr: frond }, { char: '|', attr: frond }, { char: 'o', attr: coconut }, { char: '|', attr: frond }, { char: '_', attr: frond }, { char: '/', attr: frond }, U],
                    [U, U, { char: '\\', attr: frondDark }, { char: '\\', attr: frond }, { char: '|', attr: trunk }, { char: '/', attr: frond }, { char: '/', attr: frondDark }, U, U],
                    [U, U, U, U, { char: '|', attr: trunk }, { char: ')', attr: trunk }, U, U, U],
                    [U, U, U, U, { char: '(', attr: trunk }, { char: '|', attr: trunk }, U, U, U],
                    [U, U, U, U, { char: '|', attr: trunk }, { char: ')', attr: trunk }, U, U, U],
                    [U, U, U, U, { char: '(', attr: trunk }, { char: '|', attr: trunk }, U, U, U],
                    [U, U, U, U, { char: '|', attr: trunk }, { char: ')', attr: trunk }, U, U, U],
                    [U, U, U, U, { char: '|', attr: trunk }, { char: '|', attr: trunk }, U, U, U]
                ]
            ]
        };
    },
    createUmbrella: function () {
        var stripe1 = makeAttr(LIGHTRED, BG_BLACK);
        var stripe2 = makeAttr(YELLOW, BG_BLACK);
        var pole = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'umbrella',
            variants: [
                [
                    [{ char: '/', attr: stripe1 }, { char: '^', attr: stripe2 }, { char: '\\', attr: stripe1 }],
                    [U, { char: '|', attr: pole }, U]
                ],
                [
                    [U, { char: '/', attr: stripe1 }, { char: '^', attr: stripe2 }, { char: '\\', attr: stripe1 }, U],
                    [U, U, { char: '|', attr: pole }, U, U],
                    [U, U, { char: '+', attr: pole }, U, U]
                ],
                [
                    [U, { char: '/', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '^', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '\\', attr: stripe2 }, U],
                    [U, U, U, { char: '|', attr: pole }, U, U, U],
                    [U, U, U, { char: '|', attr: pole }, U, U, U],
                    [U, U, U, { char: '+', attr: pole }, U, U, U]
                ],
                [
                    [U, { char: '_', attr: stripe1 }, { char: '/', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '^', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '\\', attr: stripe2 }, { char: '_', attr: stripe1 }, U],
                    [{ char: '/', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '=', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '|', attr: pole }, { char: '=', attr: stripe1 }, { char: '=', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '\\', attr: stripe2 }],
                    [U, U, U, U, { char: '|', attr: pole }, U, U, U, U],
                    [U, U, U, U, { char: '|', attr: pole }, U, U, U, U],
                    [U, U, U, U, { char: '+', attr: pole }, U, U, U, U]
                ],
                [
                    [U, { char: '_', attr: stripe1 }, { char: '/', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '^', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '\\', attr: stripe2 }, { char: '_', attr: stripe1 }, U],
                    [{ char: '/', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '=', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '|', attr: pole }, { char: '=', attr: stripe1 }, { char: '=', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '\\', attr: stripe2 }],
                    [U, U, U, U, { char: '|', attr: pole }, U, U, U, U],
                    [U, U, U, U, { char: '|', attr: pole }, U, U, U, U],
                    [U, U, U, U, { char: '|', attr: pole }, U, U, U, U],
                    [U, U, U, U, { char: '+', attr: pole }, U, U, U, U]
                ]
            ]
        };
    },
    createLifeguard: function () {
        var red = makeAttr(LIGHTRED, BG_BLACK);
        var white = makeAttr(WHITE, BG_BLACK);
        var wood = makeAttr(BROWN, BG_BLACK);
        var window = makeAttr(LIGHTCYAN, BG_CYAN);
        var U = null;
        return {
            name: 'lifeguard',
            variants: [
                [
                    [{ char: '[', attr: red }, { char: ']', attr: red }],
                    [{ char: '/', attr: wood }, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, { char: '\\', attr: wood }]
                ],
                [
                    [{ char: '[', attr: red }, { char: '#', attr: white }, { char: ']', attr: red }],
                    [{ char: '/', attr: wood }, { char: '_', attr: wood }, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, { char: '\\', attr: wood }]
                ],
                [
                    [U, { char: '[', attr: red }, { char: '=', attr: white }, { char: ']', attr: red }, U],
                    [U, { char: '|', attr: white }, { char: ' ', attr: window }, { char: '|', attr: white }, U],
                    [{ char: '/', attr: wood }, { char: '|', attr: wood }, { char: '_', attr: wood }, { char: '|', attr: wood }, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, U, U, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, U, U, { char: '\\', attr: wood }]
                ],
                [
                    [U, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, U],
                    [{ char: '/', attr: white }, { char: '[', attr: red }, { char: '=', attr: white }, { char: '=', attr: white }, { char: '=', attr: white }, { char: ']', attr: red }, { char: '\\', attr: white }],
                    [U, { char: '|', attr: white }, { char: ' ', attr: window }, { char: ' ', attr: window }, { char: ' ', attr: red }, { char: '|', attr: white }, U],
                    [{ char: '/', attr: wood }, { char: '|', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '|', attr: wood }, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, U, U, U, U, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, U, U, U, U, { char: '\\', attr: wood }]
                ],
                [
                    [U, U, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, U, U],
                    [U, { char: '/', attr: white }, { char: '[', attr: red }, { char: '=', attr: white }, { char: '=', attr: white }, { char: '=', attr: white }, { char: ']', attr: red }, { char: '\\', attr: white }, U],
                    [U, { char: '|', attr: red }, { char: '_', attr: white }, { char: ' ', attr: window }, { char: ' ', attr: window }, { char: '_', attr: white }, { char: '|', attr: red }, U, U],
                    [U, { char: '|', attr: white }, { char: ' ', attr: window }, { char: ' ', attr: window }, { char: ' ', attr: red }, { char: ' ', attr: red }, { char: '|', attr: white }, U, U],
                    [{ char: '/', attr: wood }, { char: '|', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '|', attr: wood }, { char: '\\', attr: wood }, U],
                    [{ char: '/', attr: wood }, U, U, U, U, U, U, { char: '\\', attr: wood }, U],
                    [{ char: '/', attr: wood }, U, U, U, U, U, U, { char: '\\', attr: wood }, U],
                    [{ char: '/', attr: wood }, U, U, U, U, U, U, { char: '\\', attr: wood }, U]
                ]
            ]
        };
    },
    createSurfboard: function () {
        var board = makeAttr(LIGHTCYAN, BG_BLACK);
        var accent = makeAttr(CYAN, BG_BLACK);
        var star = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'surfboard',
            variants: [
                [
                    [{ char: '^', attr: board }],
                    [{ char: '|', attr: board }],
                    [{ char: 'v', attr: accent }]
                ],
                [
                    [{ char: '^', attr: board }],
                    [{ char: '|', attr: board }],
                    [{ char: '|', attr: accent }],
                    [{ char: 'v', attr: board }]
                ],
                [
                    [{ char: '/', attr: board }, { char: '\\', attr: board }],
                    [{ char: '|', attr: board }, { char: '|', attr: accent }],
                    [{ char: '|', attr: accent }, { char: '|', attr: board }],
                    [{ char: '|', attr: board }, { char: '|', attr: accent }],
                    [{ char: '\\', attr: accent }, { char: '/', attr: accent }]
                ],
                [
                    [U, { char: '^', attr: board }, U],
                    [{ char: '/', attr: board }, { char: '~', attr: accent }, { char: '\\', attr: board }],
                    [{ char: '|', attr: board }, { char: '*', attr: star }, { char: '|', attr: accent }],
                    [{ char: '|', attr: accent }, { char: ' ', attr: board }, { char: '|', attr: board }],
                    [{ char: '|', attr: board }, { char: ' ', attr: board }, { char: '|', attr: accent }],
                    [{ char: '\\', attr: accent }, { char: '_', attr: board }, { char: '/', attr: accent }]
                ],
                [
                    [U, { char: '/', attr: board }, { char: '\\', attr: board }, U],
                    [{ char: '/', attr: board }, { char: '~', attr: accent }, { char: '~', attr: board }, { char: '\\', attr: board }],
                    [{ char: '|', attr: board }, { char: ' ', attr: accent }, { char: ' ', attr: accent }, { char: '|', attr: accent }],
                    [{ char: '|', attr: accent }, { char: '*', attr: star }, { char: ' ', attr: board }, { char: '|', attr: board }],
                    [{ char: '|', attr: board }, { char: ' ', attr: board }, { char: ' ', attr: board }, { char: '|', attr: accent }],
                    [{ char: '|', attr: accent }, { char: ' ', attr: board }, { char: ' ', attr: board }, { char: '|', attr: board }],
                    [{ char: '\\', attr: board }, { char: '_', attr: accent }, { char: '_', attr: accent }, { char: '/', attr: board }],
                    [U, { char: '\\', attr: accent }, { char: '/', attr: accent }, U]
                ]
            ]
        };
    },
    createTiki: function () {
        var flame = makeAttr(YELLOW, BG_BLACK);
        var flameOrange = makeAttr(LIGHTRED, BG_BLACK);
        var bamboo = makeAttr(BROWN, BG_BLACK);
        var band = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'tiki',
            variants: [
                [
                    [{ char: '*', attr: flame }],
                    [{ char: '#', attr: bamboo }],
                    [{ char: '|', attr: bamboo }]
                ],
                [
                    [U, { char: '*', attr: flame }, U],
                    [U, { char: '#', attr: bamboo }, U],
                    [U, { char: '|', attr: bamboo }, U],
                    [U, { char: '|', attr: bamboo }, U]
                ],
                [
                    [{ char: '\\', attr: flame }, { char: '*', attr: flameOrange }, { char: '/', attr: flame }],
                    [U, { char: '#', attr: bamboo }, U],
                    [U, { char: '|', attr: bamboo }, U],
                    [U, { char: '=', attr: band }, U],
                    [U, { char: '|', attr: bamboo }, U]
                ],
                [
                    [U, { char: '(', attr: flame }, { char: '*', attr: flameOrange }, { char: ')', attr: flame }, U],
                    [U, { char: '\\', attr: flameOrange }, { char: '|', attr: flame }, { char: '/', attr: flameOrange }, U],
                    [U, { char: '[', attr: bamboo }, { char: '#', attr: bamboo }, { char: ']', attr: bamboo }, U],
                    [U, U, { char: '|', attr: bamboo }, U, U],
                    [U, U, { char: '=', attr: band }, U, U],
                    [U, U, { char: '|', attr: bamboo }, U, U],
                    [U, U, { char: '|', attr: bamboo }, U, U]
                ],
                [
                    [U, { char: '(', attr: flame }, { char: '*', attr: flameOrange }, { char: ')', attr: flame }, U],
                    [U, { char: '\\', attr: flameOrange }, { char: '|', attr: flame }, { char: '/', attr: flameOrange }, U],
                    [U, { char: '[', attr: bamboo }, { char: '#', attr: bamboo }, { char: ']', attr: bamboo }, U],
                    [U, U, { char: '|', attr: bamboo }, U, U],
                    [U, U, { char: '=', attr: band }, U, U],
                    [U, U, { char: '|', attr: bamboo }, U, U],
                    [U, U, { char: '=', attr: band }, U, U],
                    [U, U, { char: '|', attr: bamboo }, U, U]
                ]
            ]
        };
    },
    createBeachhut: function () {
        var thatch = makeAttr(YELLOW, BG_BLACK);
        var thatchDark = makeAttr(BROWN, BG_BLACK);
        var wood = makeAttr(BROWN, BG_BLACK);
        var window = makeAttr(LIGHTCYAN, BG_CYAN);
        var U = null;
        return {
            name: 'beachhut',
            variants: [
                [
                    [{ char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '\\', attr: thatch }],
                    [{ char: '[', attr: wood }, { char: '#', attr: wood }, { char: ']', attr: wood }]
                ],
                [
                    [U, { char: '/', attr: thatch }, { char: '\\', attr: thatch }, U],
                    [{ char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '\\', attr: thatch }],
                    [{ char: '|', attr: wood }, { char: '#', attr: wood }, { char: '#', attr: wood }, { char: '|', attr: wood }]
                ],
                [
                    [U, { char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '\\', attr: thatch }, U],
                    [{ char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '~', attr: thatchDark }, { char: '\\', attr: thatch }],
                    [{ char: '|', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '|', attr: wood }],
                    [{ char: '|', attr: wood }, { char: ' ', attr: window }, { char: '|', attr: wood }, { char: ' ', attr: wood }, { char: '|', attr: wood }]
                ],
                [
                    [U, U, { char: '_', attr: thatch }, { char: '/', attr: thatch }, { char: '\\', attr: thatch }, { char: '_', attr: thatch }, U],
                    [U, { char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '\\', attr: thatch }],
                    [{ char: '/', attr: thatch }, { char: '|', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '|', attr: wood }, { char: '\\', attr: thatch }],
                    [U, { char: '|', attr: wood }, { char: ' ', attr: window }, { char: '|', attr: wood }, { char: '/', attr: wood }, { char: '\\', attr: wood }, { char: '|', attr: wood }],
                    [U, { char: '|', attr: wood }, { char: '_', attr: wood }, { char: '|', attr: wood }, { char: ' ', attr: wood }, { char: '|', attr: wood }, { char: '|', attr: wood }]
                ],
                [
                    [U, U, { char: '_', attr: thatch }, { char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '\\', attr: thatch }, { char: '_', attr: thatch }, U, U],
                    [U, { char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '\\', attr: thatch }, U],
                    [{ char: '/', attr: thatch }, { char: '|', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '|', attr: wood }, { char: '\\', attr: thatch }],
                    [U, { char: '|', attr: wood }, { char: ' ', attr: window }, { char: ' ', attr: window }, { char: '|', attr: wood }, { char: ' ', attr: wood }, { char: '/', attr: wood }, { char: '\\', attr: wood }, { char: '|', attr: wood }, U],
                    [U, { char: '|', attr: wood }, { char: '_', attr: window }, { char: '_', attr: window }, { char: '|', attr: wood }, { char: ' ', attr: wood }, { char: ' ', attr: wood }, { char: '|', attr: wood }, { char: '|', attr: wood }, U],
                    [U, { char: '|', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '|', attr: wood }, { char: ' ', attr: wood }, { char: '|', attr: wood }, { char: '|', attr: wood }, U],
                    [U, { char: '|', attr: wood }, U, U, U, U, U, U, { char: '|', attr: wood }, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('palm', BeachSprites.createPalm);
registerRoadsideSprite('umbrella', BeachSprites.createUmbrella);
registerRoadsideSprite('lifeguard', BeachSprites.createLifeguard);
registerRoadsideSprite('surfboard', BeachSprites.createSurfboard);
registerRoadsideSprite('tiki', BeachSprites.createTiki);
registerRoadsideSprite('beachhut', BeachSprites.createBeachhut);
