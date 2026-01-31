"use strict";
var CIRCUITS = [
    {
        id: 'retro_cup',
        name: 'RETRO CUP',
        icon: [
            '  ____  ',
            ' /    \\ ',
            '|  RC  |',
            ' \\____/ ',
            '   ||   '
        ],
        color: LIGHTCYAN,
        trackIds: ['neon_coast', 'downtown_dash', 'sunset_beach', 'twilight_grove'],
        description: 'Classic retro vibes'
    },
    {
        id: 'nature_cup',
        name: 'NATURE CUP',
        icon: [
            '   /\\   ',
            '  /  \\  ',
            ' /    \\ ',
            '/______\\',
            '   NC   '
        ],
        color: LIGHTGREEN,
        trackIds: ['winter_wonderland', 'cactus_canyon', 'jungle_run', 'sugar_rush'],
        description: 'Wild natural courses'
    },
    {
        id: 'dark_cup',
        name: 'DARK CUP',
        icon: [
            ' _\\||/_ ',
            '  \\||/  ',
            '  /||\\ ',
            ' /_||\\_',
            '   DC   '
        ],
        color: LIGHTMAGENTA,
        trackIds: ['haunted_hollow', 'fortress_rally', 'inferno_speedway', 'mermaid_lagoon'],
        description: 'Dangerous & mysterious'
    },
    {
        id: 'special_cup',
        name: 'SPECIAL CUP',
        icon: [
            '   **   ',
            '  *  *  ',
            ' * SC * ',
            '  *  *  ',
            '   **   '
        ],
        color: YELLOW,
        trackIds: ['celestial_circuit', 'data_highway', 'glitch_circuit', 'kaiju_rampage'],
        description: 'Ultimate challenge'
    }
];
var LEFT_PANEL_WIDTH = 22;
var RIGHT_PANEL_START = 24;
var SCREEN_WIDTH = 80;
function showTrackSelector(highScoreManager) {
    var state = {
        mode: 'circuit',
        circuitIndex: 0,
        trackIndex: 0
    };
    console.clear(LIGHTGRAY, false);
    drawSelectorUI(state, highScoreManager);
    while (true) {
        var key = console.inkey(K_UPPER, 100);
        if (key === '')
            continue;
        var needsRedraw = false;
        if (state.mode === 'circuit') {
            if (key === KEY_UP || key === 'W' || key === '8') {
                state.circuitIndex = (state.circuitIndex - 1 + CIRCUITS.length) % CIRCUITS.length;
                needsRedraw = true;
            }
            else if (key === KEY_DOWN || key === 'S' || key === '2') {
                state.circuitIndex = (state.circuitIndex + 1) % CIRCUITS.length;
                needsRedraw = true;
            }
            else if (key === '\r' || key === '\n' || key === ' ' || key === KEY_RIGHT || key === 'D' || key === '6') {
                state.mode = 'tracks';
                state.trackIndex = 0;
                needsRedraw = true;
            }
            else if (key === 'H' && highScoreManager) {
                var circuit = CIRCUITS[state.circuitIndex];
                showHighScoreList(HighScoreType.CIRCUIT_TIME, circuit.id, '=== CIRCUIT HIGH SCORES ===', circuit.name, highScoreManager);
                needsRedraw = true;
            }
            else if (key === 'Q' || key === KEY_ESC) {
                return { selected: false, track: null };
            }
            else if (key === '?') {
                var secretResult = showSecretTracksMenu();
                if (secretResult.selected && secretResult.track) {
                    return secretResult;
                }
                needsRedraw = true;
            }
        }
        else {
            if (key === KEY_UP || key === 'W' || key === '8') {
                state.trackIndex--;
                if (state.trackIndex < 0)
                    state.trackIndex = 4;
                needsRedraw = true;
            }
            else if (key === KEY_DOWN || key === 'S' || key === '2') {
                state.trackIndex++;
                if (state.trackIndex > 4)
                    state.trackIndex = 0;
                needsRedraw = true;
            }
            else if (key === '\r' || key === '\n' || key === ' ') {
                var circuit = CIRCUITS[state.circuitIndex];
                if (state.trackIndex === 4) {
                    var circuitTracks = getCircuitTracks(circuit);
                    return {
                        selected: true,
                        track: circuitTracks[0],
                        isCircuitMode: true,
                        circuitTracks: circuitTracks,
                        circuitId: circuit.id,
                        circuitName: circuit.name
                    };
                }
                else {
                    var trackDef = getTrackDefinition(circuit.trackIds[state.trackIndex]);
                    if (trackDef) {
                        return {
                            selected: true,
                            track: trackDef,
                            isCircuitMode: false,
                            circuitTracks: null
                        };
                    }
                }
            }
            else if (key === KEY_LEFT || key === 'A' || key === '4' || key === KEY_ESC) {
                state.mode = 'circuit';
                needsRedraw = true;
            }
            else if (key === 'H' && highScoreManager) {
                var circuit = CIRCUITS[state.circuitIndex];
                if (state.trackIndex === 4) {
                    showHighScoreList(HighScoreType.CIRCUIT_TIME, circuit.id, '=== CIRCUIT HIGH SCORES ===', circuit.name, highScoreManager);
                }
                else {
                    var trackId = circuit.trackIds[state.trackIndex];
                    var trackDef = getTrackDefinition(trackId);
                    if (trackDef) {
                        showTwoColumnHighScores(trackId, trackDef.name, highScoreManager, 0, 0);
                    }
                }
                needsRedraw = true;
            }
            else if (key === 'Q') {
                return { selected: false, track: null };
            }
            else if (key === '?') {
                var secretResult = showSecretTracksMenu();
                if (secretResult.selected && secretResult.track) {
                    return secretResult;
                }
                needsRedraw = true;
            }
        }
        if (needsRedraw) {
            console.clear(LIGHTGRAY, false);
            drawSelectorUI(state, highScoreManager);
        }
    }
}
function getCircuitTracks(circuit) {
    var tracks = [];
    for (var i = 0; i < circuit.trackIds.length; i++) {
        var track = getTrackDefinition(circuit.trackIds[i]);
        if (track)
            tracks.push(track);
    }
    return tracks;
}
function getSecretTracks() {
    var secrets = [];
    var allTracks = getAllTracks();
    for (var i = 0; i < allTracks.length; i++) {
        if (allTracks[i].hidden) {
            secrets.push(allTracks[i]);
        }
    }
    return secrets;
}
function showSecretTracksMenu() {
    var secretTracks = getSecretTracks();
    if (secretTracks.length === 0) {
        console.clear(LIGHTGRAY, false);
        console.gotoxy(1, 10);
        console.attributes = LIGHTMAGENTA;
        console.print('       ' + GLYPH.DBOX_TL + repeatChar(GLYPH.DBOX_H, 44) + GLYPH.DBOX_TR + '\r\n');
        console.print('       ' + GLYPH.DBOX_V + '         NO SECRETS FOUND... YET          ' + GLYPH.DBOX_V + '\r\n');
        console.print('       ' + GLYPH.DBOX_V + '                                          ' + GLYPH.DBOX_V + '\r\n');
        console.print('       ' + GLYPH.DBOX_V + '  Keep racing to unlock hidden tracks!    ' + GLYPH.DBOX_V + '\r\n');
        console.print('       ' + GLYPH.DBOX_BL + repeatChar(GLYPH.DBOX_H, 44) + GLYPH.DBOX_BR + '\r\n');
        console.print('\r\n');
        console.attributes = DARKGRAY;
        console.print('                 Press any key to return...\r\n');
        console.inkey(K_NONE, 5000);
        return { selected: false, track: null };
    }
    var selectedIndex = 0;
    while (true) {
        console.clear(LIGHTGRAY, false);
        console.gotoxy(1, 1);
        console.attributes = LIGHTRED;
        console.print(repeatChar(GLYPH.DBOX_H, 79) + '\r\n');
        console.attributes = YELLOW;
        console.print('                     #### SECRET TRACKS ####\r\n');
        console.attributes = LIGHTRED;
        console.print(repeatChar(GLYPH.DBOX_H, 79) + '\r\n');
        console.print('\r\n');
        console.attributes = DARKGRAY;
        console.print('  These tracks are hidden from the main menu. Shh, it\'s a secret!\r\n\r\n');
        for (var i = 0; i < secretTracks.length; i++) {
            var track = secretTracks[i];
            console.gotoxy(5, 9 + i * 2);
            if (i === selectedIndex) {
                console.attributes = LIGHTCYAN;
                console.print('>>  ');
            }
            else {
                console.attributes = DARKGRAY;
                console.print('    ');
            }
            console.attributes = i === selectedIndex ? WHITE : LIGHTGRAY;
            console.print(track.name);
            console.attributes = DARKGRAY;
            console.print(' - ');
            console.print(track.description);
            console.gotoxy(65, 9 + i * 2);
            console.attributes = YELLOW;
            console.print(renderDifficultyStars(track.difficulty));
        }
        console.gotoxy(5, 20);
        console.attributes = DARKGRAY;
        console.print(repeatChar(GLYPH.BOX_H, 68) + '\r\n');
        console.gotoxy(5, 21);
        console.attributes = CYAN;
        console.print('[');
        console.attributes = WHITE;
        console.print('W/S');
        console.attributes = CYAN;
        console.print('] Select   [');
        console.attributes = WHITE;
        console.print('ENTER');
        console.attributes = CYAN;
        console.print('] Race   [');
        console.attributes = WHITE;
        console.print('ESC/Q');
        console.attributes = CYAN;
        console.print('] Back');
        var key = console.inkey(K_UPPER, 100);
        if (key === '')
            continue;
        if (key === KEY_UP || key === 'W' || key === '8') {
            selectedIndex = (selectedIndex - 1 + secretTracks.length) % secretTracks.length;
        }
        else if (key === KEY_DOWN || key === 'S' || key === '2') {
            selectedIndex = (selectedIndex + 1) % secretTracks.length;
        }
        else if (key === '\r' || key === '\n' || key === ' ') {
            return {
                selected: true,
                track: secretTracks[selectedIndex],
                isCircuitMode: false,
                circuitTracks: null
            };
        }
        else if (key === 'Q' || key === KEY_ESC) {
            return { selected: false, track: null };
        }
    }
}
function drawSelectorUI(state, highScoreManager) {
    drawHeader();
    drawLeftPanel(state);
    drawRightPanel(state, highScoreManager);
    drawControls(state);
}
function drawHeader() {
    console.gotoxy(1, 1);
    console.attributes = LIGHTMAGENTA;
    console.print(repeatChar(GLYPH.BOX_H, SCREEN_WIDTH));
    console.gotoxy(1, 2);
    console.attributes = LIGHTCYAN;
    var title = '  SELECT YOUR RACE  ';
    var padding = Math.floor((SCREEN_WIDTH - title.length) / 2);
    console.print(repeatChar(' ', padding) + title);
    console.gotoxy(1, 3);
    console.attributes = LIGHTMAGENTA;
    console.print(repeatChar(GLYPH.BOX_H, SCREEN_WIDTH));
}
function drawLeftPanel(state) {
    var y = 5;
    for (var sy = 4; sy <= 22; sy++) {
        console.gotoxy(LEFT_PANEL_WIDTH, sy);
        console.attributes = DARKGRAY;
        console.print(GLYPH.BOX_V);
    }
    if (state.mode === 'circuit') {
        drawCircuitSelector(state, y);
    }
    else {
        drawTrackList(state, y);
    }
}
function drawCircuitSelector(state, startY) {
    console.gotoxy(2, startY);
    console.attributes = WHITE;
    console.print('SELECT CIRCUIT');
    for (var i = 0; i < CIRCUITS.length; i++) {
        var circuit = CIRCUITS[i];
        var isSelected = (i === state.circuitIndex);
        var baseY = startY + 2 + (i * 4);
        console.gotoxy(1, baseY + 1);
        if (isSelected) {
            console.attributes = circuit.color;
            console.print(GLYPH.TRIANGLE_RIGHT);
        }
        else {
            console.print(' ');
        }
        console.gotoxy(3, baseY);
        console.attributes = isSelected ? circuit.color : DARKGRAY;
        var shortName = circuit.name.substring(0, 10);
        console.print(shortName);
        console.gotoxy(3, baseY + 1);
        console.attributes = isSelected ? WHITE : DARKGRAY;
        console.print(circuit.icon[2].substring(0, 8));
        console.gotoxy(3, baseY + 2);
        console.attributes = isSelected ? LIGHTGRAY : DARKGRAY;
        console.print('4 tracks');
    }
}
function drawTrackList(state, startY) {
    var circuit = CIRCUITS[state.circuitIndex];
    console.gotoxy(2, startY);
    console.attributes = DARKGRAY;
    console.print(GLYPH.TRIANGLE_LEFT + ' ');
    console.attributes = circuit.color;
    console.print(circuit.name.substring(0, 14));
    console.gotoxy(2, startY + 1);
    console.attributes = DARKGRAY;
    console.print(repeatChar(GLYPH.BOX_H, LEFT_PANEL_WIDTH - 4));
    for (var i = 0; i < circuit.trackIds.length; i++) {
        var track = getTrackDefinition(circuit.trackIds[i]);
        if (!track)
            continue;
        var isSelected = (i === state.trackIndex);
        var y = startY + 3 + (i * 3);
        console.gotoxy(1, y);
        if (isSelected) {
            console.attributes = circuit.color;
            console.print(GLYPH.TRIANGLE_RIGHT);
        }
        else {
            console.print(' ');
        }
        console.gotoxy(3, y);
        console.attributes = isSelected ? WHITE : LIGHTGRAY;
        console.print((i + 1) + '.');
        console.gotoxy(6, y);
        console.attributes = isSelected ? circuit.color : CYAN;
        var name = track.name.substring(0, 13);
        console.print(name);
        console.gotoxy(3, y + 1);
        console.attributes = isSelected ? YELLOW : BROWN;
        console.print(renderDifficultyStars(track.difficulty));
    }
    var playY = startY + 3 + (4 * 3);
    var isPlaySelected = (state.trackIndex === 4);
    console.gotoxy(1, playY);
    if (isPlaySelected) {
        console.attributes = LIGHTGREEN;
        console.print(GLYPH.TRIANGLE_RIGHT);
    }
    else {
        console.print(' ');
    }
    console.gotoxy(3, playY);
    console.attributes = isPlaySelected ? LIGHTGREEN : GREEN;
    console.print(GLYPH.TRIANGLE_RIGHT + ' PLAY CUP');
}
function drawRightPanel(state, highScoreManager) {
    var circuit = CIRCUITS[state.circuitIndex];
    console.gotoxy(RIGHT_PANEL_START, 5);
    console.attributes = WHITE;
    if (state.mode === 'circuit' || (state.mode === 'tracks' && state.trackIndex === 4)) {
        console.print('CIRCUIT INFO');
        console.gotoxy(RIGHT_PANEL_START, 6);
        console.attributes = DARKGRAY;
        console.print(repeatChar(GLYPH.BOX_H, SCREEN_WIDTH - RIGHT_PANEL_START - 1));
        drawCircuitInfo(circuit, highScoreManager);
    }
    else {
        var track = getTrackDefinition(circuit.trackIds[state.trackIndex]);
        if (track) {
            console.print('TRACK INFO');
            console.gotoxy(RIGHT_PANEL_START, 6);
            console.attributes = DARKGRAY;
            console.print(repeatChar(GLYPH.BOX_H, SCREEN_WIDTH - RIGHT_PANEL_START - 1));
            drawTrackInfo(track, circuit.color, highScoreManager);
            drawTrackRoute(track);
        }
    }
}
function drawCircuitInfo(circuit, _highScoreManager) {
    var y = 8;
    console.gotoxy(RIGHT_PANEL_START, y);
    console.attributes = circuit.color;
    console.print(circuit.name);
    for (var iconLine = 0; iconLine < circuit.icon.length; iconLine++) {
        console.gotoxy(RIGHT_PANEL_START + 20, y - 1 + iconLine);
        console.attributes = circuit.color;
        console.print(circuit.icon[iconLine]);
    }
    console.gotoxy(RIGHT_PANEL_START, y + 1);
    console.attributes = LIGHTGRAY;
    console.print(circuit.description);
    console.gotoxy(RIGHT_PANEL_START, y + 3);
    console.attributes = WHITE;
    console.print('Tracks in this circuit:');
    var totalLaps = 0;
    var totalTime = 0;
    for (var i = 0; i < circuit.trackIds.length; i++) {
        var track = getTrackDefinition(circuit.trackIds[i]);
        if (!track)
            continue;
        console.gotoxy(RIGHT_PANEL_START + 2, y + 5 + i);
        console.attributes = CYAN;
        console.print((i + 1) + '. ' + padRight(track.name, 22));
        console.attributes = YELLOW;
        console.print(renderDifficultyStars(track.difficulty));
        totalLaps += track.laps;
        totalTime += track.estimatedLapTime * track.laps;
    }
    console.gotoxy(RIGHT_PANEL_START, y + 11);
    console.attributes = DARKGRAY;
    console.print(repeatChar(GLYPH.BOX_H, 40));
    console.gotoxy(RIGHT_PANEL_START, y + 12);
    console.attributes = LIGHTGRAY;
    console.print('Total Races: ');
    console.attributes = WHITE;
    console.print(circuit.trackIds.length.toString());
    console.gotoxy(RIGHT_PANEL_START + 20, y + 12);
    console.attributes = LIGHTGRAY;
    console.print('Total Laps: ');
    console.attributes = WHITE;
    console.print(totalLaps.toString());
    console.gotoxy(RIGHT_PANEL_START, y + 13);
    console.attributes = LIGHTGRAY;
    console.print('Est. Time: ');
    console.attributes = WHITE;
    console.print(formatTime(totalTime));
}
function drawTrackInfo(track, _accentColor, highScoreManager) {
    var theme = getTrackTheme(track);
    console.gotoxy(RIGHT_PANEL_START, 8);
    console.attributes = theme.road.edge.fg;
    console.print(track.name);
    console.attributes = YELLOW;
    console.print('  ' + renderDifficultyStars(track.difficulty));
    console.gotoxy(RIGHT_PANEL_START, 9);
    console.attributes = DARKGRAY;
    console.print(track.laps + ' laps');
    if (highScoreManager) {
        var trackTimeScore = highScoreManager.getTopScore(HighScoreType.TRACK_TIME, track.id);
        var lapTimeScore = highScoreManager.getTopScore(HighScoreType.LAP_TIME, track.id);
        if (trackTimeScore || lapTimeScore) {
            console.gotoxy(RIGHT_PANEL_START, 10);
            console.attributes = DARKGRAY;
            console.print('High Scores:');
            if (trackTimeScore) {
                console.gotoxy(RIGHT_PANEL_START + 2, 11);
                console.attributes = LIGHTGRAY;
                console.print('Track: ');
                console.attributes = LIGHTGREEN;
                console.print(LapTimer.format(trackTimeScore.time) + ' ');
                console.attributes = DARKGRAY;
                console.print('(' + trackTimeScore.playerName + ')');
            }
            if (lapTimeScore) {
                console.gotoxy(RIGHT_PANEL_START + 2, 12);
                console.attributes = LIGHTGRAY;
                console.print('Lap:   ');
                console.attributes = LIGHTGREEN;
                console.print(LapTimer.format(lapTimeScore.time) + ' ');
                console.attributes = DARKGRAY;
                console.print('(' + lapTimeScore.playerName + ')');
            }
        }
    }
    drawThemedTrackMap(track, theme);
}
function drawThemedTrackMap(track, theme) {
    var mapX = RIGHT_PANEL_START;
    var mapY = 11;
    var mapWidth = SCREEN_WIDTH - RIGHT_PANEL_START - 1;
    var mapHeight = 13;
    var pixelWidth = mapWidth - 2;
    var pixelHeight = (mapHeight - 1) * 2;
    var points = generateTrackLoop(track, pixelWidth, pixelHeight);
    var pixels = createPixelGrid(pixelWidth, pixelHeight);
    rasterizeTrack(points, pixels, pixelWidth, pixelHeight);
    markInfield(pixels, pixelWidth, pixelHeight);
    renderHalfBlockMap(pixels, mapX + 2, mapY + 1, pixelWidth, pixelHeight, theme);
    drawStartFinishHiRes(points, mapX + 2, mapY + 1, pixelWidth, pixelHeight, theme);
}
function createPixelGrid(width, height) {
    var grid = [];
    for (var y = 0; y < height; y++) {
        grid[y] = [];
        for (var x = 0; x < width; x++) {
            grid[y][x] = 0;
        }
    }
    return grid;
}
function markInfield(pixels, width, height) {
    var OUTSIDE_MARKER = -1;
    var queue = [];
    for (var x = 0; x < width; x++) {
        if (pixels[0][x] === 0) {
            pixels[0][x] = OUTSIDE_MARKER;
            queue.push({ x: x, y: 0 });
        }
        if (pixels[height - 1][x] === 0) {
            pixels[height - 1][x] = OUTSIDE_MARKER;
            queue.push({ x: x, y: height - 1 });
        }
    }
    for (var y = 0; y < height; y++) {
        if (pixels[y][0] === 0) {
            pixels[y][0] = OUTSIDE_MARKER;
            queue.push({ x: 0, y: y });
        }
        if (pixels[y][width - 1] === 0) {
            pixels[y][width - 1] = OUTSIDE_MARKER;
            queue.push({ x: width - 1, y: y });
        }
    }
    while (queue.length > 0) {
        var p = queue.shift();
        if (!p)
            break;
        var neighbors = [
            { x: p.x - 1, y: p.y },
            { x: p.x + 1, y: p.y },
            { x: p.x, y: p.y - 1 },
            { x: p.x, y: p.y + 1 }
        ];
        for (var i = 0; i < neighbors.length; i++) {
            var n = neighbors[i];
            if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
                if (pixels[n.y][n.x] === 0) {
                    pixels[n.y][n.x] = OUTSIDE_MARKER;
                    queue.push(n);
                }
            }
        }
    }
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            if (pixels[y][x] === OUTSIDE_MARKER) {
                pixels[y][x] = 0;
            }
            else if (pixels[y][x] === 0) {
                pixels[y][x] = 3;
            }
        }
    }
}
function rasterizeTrack(points, pixels, width, height) {
    if (points.length < 2)
        return;
    var roadWidth = 2;
    var edgeWidth = 1;
    for (var i = 0; i < points.length - 1; i++) {
        var x1 = points[i].x;
        var y1 = points[i].y;
        var x2 = points[i + 1].x;
        var y2 = points[i + 1].y;
        var dx = x2 - x1;
        var dy = y2 - y1;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0)
            continue;
        var perpX = -dy / len;
        var perpY = dx / len;
        var steps = Math.max(Math.ceil(len), 1);
        for (var s = 0; s <= steps; s++) {
            var t = s / steps;
            var cx = x1 + dx * t;
            var cy = y1 + dy * t;
            for (var w = -(roadWidth + edgeWidth); w <= (roadWidth + edgeWidth); w++) {
                var px = Math.floor(cx + perpX * w);
                var py = Math.floor(cy + perpY * w);
                if (px >= 0 && px < width && py >= 0 && py < height) {
                    if (Math.abs(w) <= roadWidth) {
                        pixels[py][px] = 2;
                    }
                    else if (pixels[py][px] === 0) {
                        pixels[py][px] = 1;
                    }
                }
            }
        }
    }
}
function renderHalfBlockMap(pixels, screenX, screenY, width, height, theme) {
    var charRows = Math.floor(height / 2);
    function getPixelColor(pixelType) {
        switch (pixelType) {
            case 0: return theme.offroad.groundColor.fg;
            case 1: return theme.road.edge.fg;
            case 2: return theme.road.surface.fg;
            case 3: return BG_BLACK;
            default: return theme.offroad.groundColor.fg;
        }
    }
    function isFilledPixel(pixelType) {
        return pixelType === 1 || pixelType === 2;
    }
    for (var charRow = 0; charRow < charRows; charRow++) {
        var topPixelY = charRow * 2;
        var bottomPixelY = charRow * 2 + 1;
        for (var col = 0; col < width; col++) {
            var topPixel = (topPixelY < height) ? pixels[topPixelY][col] : 0;
            var bottomPixel = (bottomPixelY < height) ? pixels[bottomPixelY][col] : 0;
            console.gotoxy(screenX + col, screenY + charRow);
            var topFilled = isFilledPixel(topPixel);
            var bottomFilled = isFilledPixel(bottomPixel);
            if (topFilled && bottomFilled) {
                var pixelType = (topPixel === 2 || bottomPixel === 2) ? 2 : 1;
                console.attributes = getPixelColor(pixelType);
                console.print(GLYPH.FULL_BLOCK);
            }
            else if (topFilled) {
                var topColor = getPixelColor(topPixel);
                var bottomColor = getPixelColor(bottomPixel);
                console.attributes = topColor + (bottomColor << 4);
                console.print(GLYPH.UPPER_HALF);
            }
            else if (bottomFilled) {
                var topColor = getPixelColor(topPixel);
                var bottomColor = getPixelColor(bottomPixel);
                console.attributes = bottomColor + (topColor << 4);
                console.print(GLYPH.LOWER_HALF);
            }
            else {
                if (topPixel === 3 || bottomPixel === 3) {
                    console.attributes = BLACK;
                    console.print(' ');
                }
                else {
                    console.attributes = theme.offroad.groundColor.fg;
                    console.print(GLYPH.LIGHT_SHADE);
                }
            }
        }
    }
}
function generateTrackLoop(track, width, height) {
    var sections = track.sections;
    var difficulty = track.difficulty || 3;
    var trackId = track.id || '';
    var totalLength = 0;
    var totalCurve = 0;
    var hasSCurves = false;
    var sharpestCurve = 0;
    if (sections && sections.length > 0) {
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            totalLength += section.length || 0;
            if (section.type === 'curve') {
                totalCurve += Math.abs(section.curve || 0) * (section.length || 1);
                if (Math.abs(section.curve || 0) > sharpestCurve) {
                    sharpestCurve = Math.abs(section.curve || 0);
                }
            }
            if (section.type === 's_curve')
                hasSCurves = true;
        }
    }
    var points = [];
    var cx = width / 2;
    var cy = height / 2;
    var rx = (width - 8) / 2;
    var ry = (height - 6) / 2;
    var numPoints = 80;
    var complexity = Math.min(difficulty, 5);
    var wobbleFreq = 2 + complexity;
    var wobbleAmp = 0.05 + (sharpestCurve * 0.15);
    if (trackId.indexOf('figure') >= 0 || (hasSCurves && difficulty >= 4)) {
        for (var i = 0; i <= numPoints; i++) {
            var t = (i / numPoints) * Math.PI * 2;
            var fx = Math.sin(t);
            var fy = Math.sin(t) * Math.cos(t);
            points.push({
                x: cx + fx * rx,
                y: cy + fy * ry * 1.5
            });
        }
    }
    else {
        for (var i = 0; i <= numPoints; i++) {
            var angle = (i / numPoints) * Math.PI * 2;
            var wobble = Math.sin(angle * wobbleFreq) * wobbleAmp;
            var wobble2 = Math.cos(angle * (wobbleFreq + 1)) * wobbleAmp * 0.5;
            points.push({
                x: cx + Math.cos(angle) * rx * (1 + wobble),
                y: cy + Math.sin(angle) * ry * (1 + wobble2)
            });
        }
    }
    return points;
}
function generatePathFromSections(sections) {
    var totalIntendedCurve = 0;
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var segmentCount = section.length || 10;
        switch (section.type) {
            case 'curve':
                totalIntendedCurve += (section.curve || 0) * segmentCount;
                break;
            case 'ease_in':
                totalIntendedCurve += (section.targetCurve || 0.5) * segmentCount * 0.5;
                break;
            case 'ease_out':
                totalIntendedCurve += (section.targetCurve || 0.5) * segmentCount * 0.5;
                break;
            case 's_curve':
                break;
        }
    }
    var curveScale = 0.1;
    if (Math.abs(totalIntendedCurve) > 0.1) {
        curveScale = (Math.PI * 2) / Math.abs(totalIntendedCurve);
    }
    var direction = totalIntendedCurve >= 0 ? 1 : -1;
    curveScale = Math.abs(curveScale) * direction;
    var points = [];
    var x = 0;
    var y = 0;
    var heading = 0;
    var currentCurve = 0;
    var stepSize = 1.0;
    points.push({ x: x, y: y });
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var segmentCount = section.length || 10;
        switch (section.type) {
            case 'straight':
                for (var s = 0; s < segmentCount; s++) {
                    x += Math.cos(heading) * stepSize;
                    y += Math.sin(heading) * stepSize;
                    points.push({ x: x, y: y });
                }
                currentCurve = 0;
                break;
            case 'curve':
                var curvature = (section.curve || 0) * curveScale;
                for (var s = 0; s < segmentCount; s++) {
                    heading += curvature;
                    x += Math.cos(heading) * stepSize;
                    y += Math.sin(heading) * stepSize;
                    points.push({ x: x, y: y });
                }
                currentCurve = section.curve || 0;
                break;
            case 'ease_in':
                var targetCurve = (section.targetCurve || 0.5) * curveScale;
                for (var s = 0; s < segmentCount; s++) {
                    var t = s / segmentCount;
                    var easedCurve = currentCurve * curveScale + (targetCurve - currentCurve * curveScale) * t;
                    heading += easedCurve;
                    x += Math.cos(heading) * stepSize;
                    y += Math.sin(heading) * stepSize;
                    points.push({ x: x, y: y });
                }
                currentCurve = section.targetCurve || 0.5;
                break;
            case 'ease_out':
                var startCurve = currentCurve * curveScale;
                for (var s = 0; s < segmentCount; s++) {
                    var t = s / segmentCount;
                    var easedCurve = startCurve * (1 - t);
                    heading += easedCurve;
                    x += Math.cos(heading) * stepSize;
                    y += Math.sin(heading) * stepSize;
                    points.push({ x: x, y: y });
                }
                currentCurve = 0;
                break;
            case 's_curve':
                var halfLen = Math.floor(segmentCount / 2);
                var sCurve = 0.06 * curveScale;
                for (var s = 0; s < halfLen; s++) {
                    heading += sCurve;
                    x += Math.cos(heading) * stepSize;
                    y += Math.sin(heading) * stepSize;
                    points.push({ x: x, y: y });
                }
                for (var s = 0; s < halfLen; s++) {
                    heading -= sCurve;
                    x += Math.cos(heading) * stepSize;
                    y += Math.sin(heading) * stepSize;
                    points.push({ x: x, y: y });
                }
                break;
        }
    }
    var startX = points[0].x;
    var startY = points[0].y;
    var endX = points[points.length - 1].x;
    var endY = points[points.length - 1].y;
    var closeSteps = 15;
    for (var s = 1; s <= closeSteps; s++) {
        var t = s / closeSteps;
        var smoothT = t * t * (3 - 2 * t);
        points.push({
            x: endX + (startX - endX) * smoothT,
            y: endY + (startY - endY) * smoothT
        });
    }
    return points;
}
function normalizeAndCenterPath(points, width, height) {
    if (points.length === 0)
        return points;
    var minX = points[0].x, maxX = points[0].x;
    var minY = points[0].y, maxY = points[0].y;
    for (var i = 1; i < points.length; i++) {
        if (points[i].x < minX)
            minX = points[i].x;
        if (points[i].x > maxX)
            maxX = points[i].x;
        if (points[i].y < minY)
            minY = points[i].y;
        if (points[i].y > maxY)
            maxY = points[i].y;
    }
    var pathWidth = maxX - minX;
    var pathHeight = maxY - minY;
    var padding = 3;
    var availWidth = width - padding * 2;
    var availHeight = height - padding * 2;
    var scaleX = pathWidth > 0 ? availWidth / pathWidth : 1;
    var scaleY = pathHeight > 0 ? availHeight / pathHeight : 1;
    var scale = Math.min(scaleX, scaleY);
    var scaledWidth = pathWidth * scale;
    var scaledHeight = pathHeight * scale;
    var offsetX = padding + (availWidth - scaledWidth) / 2;
    var offsetY = padding + (availHeight - scaledHeight) / 2;
    var result = [];
    for (var i = 0; i < points.length; i++) {
        result.push({
            x: (points[i].x - minX) * scale + offsetX,
            y: (points[i].y - minY) * scale + offsetY
        });
    }
    return result;
}
function generateOvalTrack(width, height) {
    var points = [];
    var cx = width / 2;
    var cy = height / 2;
    var rx = (width - 8) / 2;
    var ry = (height - 4) / 2;
    var numPoints = 60;
    for (var i = 0; i <= numPoints; i++) {
        var angle = (i / numPoints) * Math.PI * 2;
        points.push({
            x: cx + Math.cos(angle) * rx,
            y: cy + Math.sin(angle) * ry
        });
    }
    return points;
}
function drawTrackSurface(_points, _x, _y, _width, _height, _theme) {
}
function drawStartFinishHiRes(points, screenX, screenY, _pixelWidth, pixelHeight, theme) {
    if (points.length < 2)
        return;
    var startPixelX = Math.floor(points[0].x);
    var startPixelY = Math.floor(points[0].y);
    var charX = startPixelX;
    var charY = Math.floor(startPixelY / 2);
    var maxCharY = Math.floor(pixelHeight / 2) - 1;
    charY = Math.max(0, Math.min(maxCharY, charY));
    console.gotoxy(screenX + charX, screenY + charY);
    console.attributes = WHITE;
    console.print(GLYPH.CHECKER);
    console.gotoxy(screenX + charX + 1, screenY + charY);
    console.attributes = theme.sun.color.fg;
    console.print('S');
}
function drawStartFinish(_points, _x, _y, _width, _height, _theme) {
}
function drawTrackRoute(_track) {
}
function drawControls(state) {
    console.gotoxy(1, 23);
    console.attributes = LIGHTMAGENTA;
    console.print(repeatChar(GLYPH.BOX_H, SCREEN_WIDTH));
    console.gotoxy(1, 24);
    console.attributes = LIGHTGRAY;
    if (state.mode === 'circuit') {
        console.print('  ');
        console.attributes = WHITE;
        console.print(String.fromCharCode(24) + '/' + String.fromCharCode(25));
        console.attributes = LIGHTGRAY;
        console.print(' Select  ');
        console.attributes = WHITE;
        console.print('ENTER');
        console.attributes = LIGHTGRAY;
        console.print(' Open  ');
        console.attributes = WHITE;
        console.print('H');
        console.attributes = LIGHTGRAY;
        console.print(' Scores  ');
        console.attributes = WHITE;
        console.print('Q');
        console.attributes = LIGHTGRAY;
        console.print(' Quit  ');
        console.attributes = DARKGRAY;
        console.print('?');
        console.attributes = DARKGRAY;
        console.print(' ???');
    }
    else {
        console.print('  ');
        console.attributes = WHITE;
        console.print(String.fromCharCode(24) + '/' + String.fromCharCode(25));
        console.attributes = LIGHTGRAY;
        console.print(' Select  ');
        console.attributes = WHITE;
        console.print('ENTER');
        console.attributes = LIGHTGRAY;
        console.print(' Race  ');
        console.attributes = WHITE;
        console.print('H');
        console.attributes = LIGHTGRAY;
        console.print(' Scores  ');
        console.attributes = WHITE;
        console.print(String.fromCharCode(27));
        console.attributes = LIGHTGRAY;
        console.print(' Back  ');
        console.attributes = WHITE;
        console.print('Q');
        console.attributes = LIGHTGRAY;
        console.print(' Quit  ');
        console.attributes = DARKGRAY;
        console.print('?');
        console.attributes = DARKGRAY;
        console.print(' ???');
    }
    console.gotoxy(1, 25);
    console.attributes = LIGHTMAGENTA;
    console.print(repeatChar(GLYPH.BOX_H, SCREEN_WIDTH));
}
function repeatChar(char, count) {
    var result = '';
    for (var i = 0; i < count; i++) {
        result += char;
    }
    return result;
}
function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}
function padRight(str, len) {
    while (str.length < len) {
        str += ' ';
    }
    return str.substring(0, len);
}
