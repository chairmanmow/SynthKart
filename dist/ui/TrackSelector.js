"use strict";
function showTrackSelector() {
    var tracks = getAllTracks();
    var selectedIndex = 0;
    var pageSize = 5;
    var scrollOffset = 0;
    var oldPauseStatus = bbs.sys_status & SS_PAUSEON;
    bbs.sys_status &= ~SS_PAUSEON;
    console.clear();
    drawTrackSelectorScreen(tracks, selectedIndex, scrollOffset, pageSize);
    while (true) {
        var key = console.inkey(K_UPPER, 500);
        if (key === '')
            continue;
        var needsRedraw = false;
        if (key === KEY_UP) {
            selectedIndex--;
            if (selectedIndex < 0)
                selectedIndex = tracks.length - 1;
            needsRedraw = true;
        }
        else if (key === KEY_DOWN) {
            selectedIndex++;
            if (selectedIndex >= tracks.length)
                selectedIndex = 0;
            needsRedraw = true;
        }
        else if (key === 'W' || key === '8') {
            selectedIndex--;
            if (selectedIndex < 0)
                selectedIndex = tracks.length - 1;
            needsRedraw = true;
        }
        else if (key === 'S' || key === '2') {
            selectedIndex++;
            if (selectedIndex >= tracks.length)
                selectedIndex = 0;
            needsRedraw = true;
        }
        else if (key === '\r' || key === '\n' || key === ' ') {
            if (oldPauseStatus)
                bbs.sys_status |= SS_PAUSEON;
            return {
                selected: true,
                track: tracks[selectedIndex]
            };
        }
        else if (key >= '1' && key <= '9') {
            var quickIndex = parseInt(key, 10) - 1;
            if (quickIndex < tracks.length) {
                if (oldPauseStatus)
                    bbs.sys_status |= SS_PAUSEON;
                return {
                    selected: true,
                    track: tracks[quickIndex]
                };
            }
        }
        else if (key === 'Q' || key === KEY_ESC) {
            if (oldPauseStatus)
                bbs.sys_status |= SS_PAUSEON;
            return {
                selected: false,
                track: null
            };
        }
        if (needsRedraw) {
            if (selectedIndex < scrollOffset) {
                scrollOffset = selectedIndex;
            }
            if (selectedIndex >= scrollOffset + pageSize) {
                scrollOffset = selectedIndex - pageSize + 1;
            }
            console.clear();
            drawTrackSelectorScreen(tracks, selectedIndex, scrollOffset, pageSize);
        }
    }
}
function drawTrackSelectorScreen(tracks, selectedIndex, scrollOffset, pageSize) {
    console.attributes = LIGHTMAGENTA;
    console.print("\r\n");
    console.print("  ========================================\r\n");
    console.attributes = LIGHTCYAN;
    console.print("           SELECT YOUR TRACK\r\n");
    console.attributes = LIGHTMAGENTA;
    console.print("  ========================================\r\n");
    console.print("\r\n");
    var endIndex = Math.min(scrollOffset + pageSize, tracks.length);
    for (var i = scrollOffset; i < endIndex; i++) {
        var track = tracks[i];
        var isSelected = (i === selectedIndex);
        var displayNum = i + 1;
        if (isSelected) {
            console.attributes = LIGHTCYAN;
            console.print("  >> ");
        }
        else {
            console.attributes = DARKGRAY;
            console.print("     ");
        }
        console.attributes = isSelected ? WHITE : LIGHTGRAY;
        console.print(displayNum + ". ");
        console.attributes = isSelected ? LIGHTCYAN : CYAN;
        console.print(padRight(track.name, 20));
        console.attributes = isSelected ? YELLOW : BROWN;
        console.print(" [" + renderDifficultyStars(track.difficulty) + "] ");
        console.attributes = isSelected ? LIGHTGRAY : DARKGRAY;
        console.print(track.laps + " laps");
        console.print("\r\n");
        if (isSelected) {
            console.attributes = LIGHTGRAY;
            console.print("        " + track.description + "\r\n");
            console.attributes = DARKGRAY;
            console.print("        Est. lap time: ~" + track.estimatedLapTime + "s\r\n");
        }
    }
    if (scrollOffset > 0) {
        console.attributes = DARKGRAY;
        console.print("\r\n     ^ More tracks above ^\r\n");
    }
    if (endIndex < tracks.length) {
        console.attributes = DARKGRAY;
        console.print("\r\n     v More tracks below v\r\n");
    }
    console.print("\r\n");
    drawTrackPreview(tracks[selectedIndex]);
    console.print("\r\n");
    console.attributes = LIGHTMAGENTA;
    console.print("  ----------------------------------------\r\n");
    console.attributes = LIGHTGRAY;
    console.print("  W/S or UP/DOWN = Navigate    ENTER = Select\r\n");
    console.print("  1-9 = Quick Select           Q = Back\r\n");
    console.attributes = LIGHTMAGENTA;
    console.print("  ----------------------------------------\r\n");
}
function drawTrackPreview(track) {
    var theme = getTrackTheme(track);
    console.attributes = DARKGRAY;
    console.print("  Theme: ");
    console.attributes = LIGHTGRAY;
    console.print(theme.name + "\r\n");
    console.print("  ");
    console.attributes = theme.sky.top.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.sky.horizon.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.sun.color.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.road.surface.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.road.edge.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.offroad.groundColor.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.background.color.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = LIGHTGRAY;
    console.print("\r\n");
}
function padRight(str, len) {
    while (str.length < len) {
        str += ' ';
    }
    return str.substring(0, len);
}
