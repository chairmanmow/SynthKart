"use strict";
function getANSITunnelConfig() {
    return {
        directory: OUTRUN_CONFIG.ansiTunnel.directory,
        scrollSpeed: OUTRUN_CONFIG.ansiTunnel.scrollSpeed,
        mirrorSky: true,
        colorShift: true,
        maxRowsToLoad: OUTRUN_CONFIG.ansiTunnel.maxRows
    };
}
var ANSITunnelConfig = getANSITunnelConfig();
var ANSITunnelTheme = {
    name: 'ansi_tunnel',
    description: 'Race through scrolling ANSI art - a digital cyberspace tunnel',
    colors: {
        skyTop: { fg: BLACK, bg: BG_BLACK },
        skyMid: { fg: DARKGRAY, bg: BG_BLACK },
        skyHorizon: { fg: CYAN, bg: BG_BLACK },
        skyGrid: { fg: CYAN, bg: BG_BLACK },
        skyGridGlow: { fg: LIGHTCYAN, bg: BG_BLACK },
        celestialCore: { fg: WHITE, bg: BG_BLACK },
        celestialGlow: { fg: CYAN, bg: BG_BLACK },
        starBright: { fg: LIGHTCYAN, bg: BG_BLACK },
        starDim: { fg: CYAN, bg: BG_BLACK },
        sceneryPrimary: { fg: CYAN, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTCYAN, bg: BG_BLACK },
        sceneryTertiary: { fg: WHITE, bg: BG_BLACK },
        roadSurface: { fg: DARKGRAY, bg: BG_BLACK },
        roadSurfaceAlt: { fg: BLACK, bg: BG_BLACK },
        roadStripe: { fg: LIGHTCYAN, bg: BG_BLACK },
        roadEdge: { fg: CYAN, bg: BG_BLACK },
        roadGrid: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderPrimary: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderSecondary: { fg: BLACK, bg: BG_BLACK },
        roadsideColors: {
            'data_beacon': {
                primary: { fg: LIGHTCYAN, bg: BG_BLACK },
                secondary: { fg: CYAN, bg: BG_BLACK }
            },
            'data_node': {
                primary: { fg: CYAN, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            },
            'signal_pole': {
                primary: { fg: LIGHTCYAN, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            },
            'binary_pillar': {
                primary: { fg: LIGHTCYAN, bg: BG_BLACK },
                secondary: { fg: CYAN, bg: BG_BLACK }
            }
        },
        itemBox: {
            border: { fg: LIGHTCYAN, bg: BG_BLACK },
            fill: { fg: DARKGRAY, bg: BG_BLACK },
            symbol: { fg: WHITE, bg: BG_BLACK }
        }
    },
    sky: {
        type: 'ansi',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'ansi',
        config: {
            parallaxSpeed: 0.0
        }
    },
    celestial: {
        type: 'none',
        size: 0,
        positionX: 0.5,
        positionY: 0.5
    },
    stars: {
        enabled: true,
        density: 0.1,
        twinkle: true
    },
    ground: {
        type: 'solid',
        primary: { fg: BLACK, bg: BG_BLACK },
        secondary: { fg: DARKGRAY, bg: BG_BLACK },
        pattern: {
            ditherDensity: 0.1,
            ditherChars: ['.', GLYPH.LIGHT_SHADE]
        }
    },
    roadside: {
        pool: [
            { sprite: 'data_beacon', weight: 3, side: 'both' },
            { sprite: 'data_node', weight: 2, side: 'both' },
            { sprite: 'signal_pole', weight: 2, side: 'both' },
            { sprite: 'binary_pillar', weight: 3, side: 'both' }
        ],
        spacing: 60,
        density: 0.5
    },
    hud: {
        speedLabel: 'Kbps',
        speedMultiplier: 0.24,
        positionPrefix: 'Node ',
        lapLabel: 'SECTOR',
        timeLabel: 'CONNECT'
    }
};
registerTheme(ANSITunnelTheme);
var ANSITunnelRenderer = (function () {
    function ANSITunnelRenderer() {
        this.combinedCells = [];
        this.combinedWidth = 80;
        this.combinedHeight = 0;
        this.scrollOffset = 0;
        this.loaded = false;
        this._renderDebugLogged = false;
        this.loadANSIFiles();
    }
    ANSITunnelRenderer.prototype.loadANSIFiles = function () {
        var files = ANSILoader.scanDirectory(ANSITunnelConfig.directory);
        if (files.length === 0) {
            logWarning("ANSITunnelRenderer: No ANSI files found in " + ANSITunnelConfig.directory);
            return;
        }
        for (var i = files.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = files[i];
            files[i] = files[j];
            files[j] = temp;
        }
        var maxRows = ANSITunnelConfig.maxRowsToLoad || 2000;
        var filesLoaded = 0;
        logInfo("ANSITunnelRenderer: Loading ANSI files (max " + maxRows + " rows)...");
        this.combinedCells = [];
        this.combinedHeight = 0;
        for (var i = 0; i < files.length && this.combinedHeight < maxRows; i++) {
            var img = ANSILoader.load(files[i]);
            if (img && img.height > 0) {
                var rowsToAdd = Math.min(img.height, maxRows - this.combinedHeight);
                for (var row = 0; row < rowsToAdd; row++) {
                    var newRow = [];
                    for (var col = 0; col < this.combinedWidth; col++) {
                        if (col < img.width && img.cells[row] && img.cells[row][col]) {
                            var cell = img.cells[row][col];
                            var ch = cell.char;
                            var code = ch.charCodeAt(0);
                            if (ANSITunnelRenderer.CONTROL_CHARS[code]) {
                                ch = ' ';
                            }
                            newRow.push({ char: ch, attr: cell.attr });
                        }
                        else {
                            newRow.push({ char: ' ', attr: 7 });
                        }
                    }
                    this.combinedCells.push(newRow);
                    this.combinedHeight++;
                }
                filesLoaded++;
                logInfo("ANSITunnelRenderer: Loaded " + files[i].split('/').pop() + " (" + img.height + " rows, total: " + this.combinedHeight + ")");
            }
        }
        this.loaded = this.combinedHeight > 0;
        var estimatedKB = Math.round(this.combinedHeight * this.combinedWidth * 10 / 1024);
        logInfo("ANSITunnelRenderer: Loaded " + filesLoaded + "/" + files.length + " files, " + this.combinedHeight + " rows (~" + estimatedKB + "KB)");
    };
    ANSITunnelRenderer.prototype.getCell = function (row, col) {
        if (!this.loaded || this.combinedHeight === 0) {
            return { char: ' ', attr: 7 };
        }
        var wrappedRow = Math.floor(row) % this.combinedHeight;
        if (wrappedRow < 0)
            wrappedRow += this.combinedHeight;
        var clampedCol = Math.max(0, Math.min(Math.floor(col), this.combinedWidth - 1));
        if (this.combinedCells[wrappedRow] && this.combinedCells[wrappedRow][clampedCol]) {
            return this.combinedCells[wrappedRow][clampedCol];
        }
        return { char: ' ', attr: 7 };
    };
    ANSITunnelRenderer.prototype.updateScroll = function (trackZ, _trackLength) {
        if (!this.loaded || this.combinedHeight === 0)
            return;
        var scrollMultiplier = 0.5;
        this.scrollOffset = (trackZ * scrollMultiplier) % this.combinedHeight;
        if (this.scrollOffset < 0)
            this.scrollOffset += this.combinedHeight;
    };
    ANSITunnelRenderer.prototype.renderTunnel = function (skyFrame, roadFrame, horizonY, roadHeight, screenWidth, trackPosition, cameraX, road, roadLength) {
        if (!this._renderDebugLogged) {
            this._renderDebugLogged = true;
            logInfo('ANSITunnelRenderer.renderTunnel: canvas=' + this.combinedWidth + 'x' + this.combinedHeight + ' horizonY=' + horizonY + ' roadHeight=' + roadHeight);
        }
        if (!this.loaded || this.combinedHeight === 0) {
            this.renderFallback(skyFrame, roadFrame, horizonY, roadHeight, screenWidth);
            return;
        }
        var startRow = (this.combinedHeight - 1) - Math.floor(this.scrollOffset);
        if (skyFrame) {
            for (var frameY = 0; frameY < horizonY; frameY++) {
                var ansiRow = startRow + frameY;
                for (var frameX = 0; frameX < screenWidth; frameX++) {
                    var cell = this.getCell(ansiRow, frameX);
                    skyFrame.setData(frameX, frameY, cell.char, cell.attr);
                }
            }
        }
        if (roadFrame) {
            var roadBottom = roadHeight - 1;
            var blackAttr = makeAttr(BLACK, BG_BLACK);
            var accumulatedCurve = 0;
            for (var screenY = roadBottom; screenY >= 0; screenY--) {
                var ansiRow = startRow + horizonY + screenY;
                var t = (roadBottom - screenY) / Math.max(1, roadBottom);
                var distance = 1 / (1 - t * 0.95);
                var worldZ = trackPosition + distance * 5;
                var segment = road.getSegment(worldZ);
                if (segment) {
                    accumulatedCurve += segment.curve * 0.5;
                }
                var roadWidth = Math.round(40 / distance);
                var halfWidth = Math.floor(roadWidth / 2);
                var curveOffset = accumulatedCurve * distance * 0.8;
                var centerX = 40 + Math.round(curveOffset) - Math.round(cameraX * 0.5);
                var leftEdge = centerX - halfWidth;
                var rightEdge = centerX + halfWidth;
                var wrappedZ = worldZ % roadLength;
                if (wrappedZ < 0)
                    wrappedZ += roadLength;
                var isFinishLine = (wrappedZ < 200) || (wrappedZ > roadLength - 200);
                for (var frameX = 0; frameX < screenWidth; frameX++) {
                    var onRoad = frameX >= leftEdge && frameX <= rightEdge;
                    if (onRoad) {
                        if (isFinishLine) {
                            var checkerSize = Math.max(1, Math.floor(3 / distance));
                            var checkerX = Math.floor((frameX - centerX) / checkerSize);
                            var checkerY = Math.floor(screenY / 2);
                            var isWhite = ((checkerX + checkerY) % 2) === 0;
                            if (isWhite) {
                                roadFrame.setData(frameX, screenY, GLYPH.FULL_BLOCK, makeAttr(WHITE, BG_LIGHTGRAY));
                            }
                            else {
                                roadFrame.setData(frameX, screenY, ' ', makeAttr(BLACK, BG_BLACK));
                            }
                        }
                        else {
                            roadFrame.setData(frameX, screenY, ' ', blackAttr);
                        }
                    }
                    else {
                        var cell = this.getCell(ansiRow, frameX);
                        roadFrame.setData(frameX, screenY, cell.char, cell.attr);
                    }
                }
            }
        }
    };
    ANSITunnelRenderer.prototype.renderFallback = function (skyFrame, roadFrame, horizonY, roadHeight, screenWidth) {
        var gridAttr = makeAttr(DARKGRAY, BG_BLACK);
        if (skyFrame) {
            for (var y = 0; y < horizonY; y++) {
                var attr = y < 2 ? makeAttr(BLACK, BG_BLACK) : makeAttr(DARKGRAY, BG_BLACK);
                for (var x = 0; x < screenWidth; x++) {
                    skyFrame.setData(x, y, ' ', attr);
                }
            }
        }
        if (roadFrame) {
            for (var y = 0; y < roadHeight; y++) {
                for (var x = 0; x < screenWidth; x++) {
                    var ch = (y + x) % 4 === 0 ? '.' : ' ';
                    roadFrame.setData(x, y, ch, gridAttr);
                }
            }
        }
    };
    ANSITunnelRenderer.prototype.isLoaded = function () {
        return this.loaded;
    };
    ANSITunnelRenderer.CONTROL_CHARS = {
        0: true,
        7: true,
        8: true,
        9: true,
        10: true,
        12: true,
        13: true,
        27: true
    };
    return ANSITunnelRenderer;
}());
var ansiTunnelRenderer = null;
function getANSITunnelRenderer() {
    if (!ansiTunnelRenderer) {
        ansiTunnelRenderer = new ANSITunnelRenderer();
    }
    return ansiTunnelRenderer;
}
