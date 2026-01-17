"use strict";
var FrameRenderer = (function () {
    function FrameRenderer(width, height) {
        this.width = width;
        this.height = height;
        this.horizonY = 8;
        this._mountainScrollOffset = 0;
        this._staticElementsDirty = true;
        this.frameManager = new FrameManager(width, height, this.horizonY);
        this.activeTheme = SynthwaveTheme;
        this.spriteCache = {};
        this.playerCarSprite = null;
    }
    FrameRenderer.prototype.setTheme = function (themeName) {
        var theme = getTheme(themeName);
        if (theme) {
            this.activeTheme = theme;
            this._staticElementsDirty = true;
            this.rebuildSpriteCache();
            if (this.frameManager.getSunFrame()) {
                this.clearStaticFrames();
                this.renderStaticElements();
            }
            logInfo('Theme changed to: ' + themeName);
        }
        else {
            logWarning('Theme not found: ' + themeName);
        }
    };
    FrameRenderer.prototype.getAvailableThemes = function () {
        return getThemeNames();
    };
    FrameRenderer.prototype.init = function () {
        load('frame.js');
        this.frameManager.init();
        this.rebuildSpriteCache();
        this.playerCarSprite = SpriteSheet.createPlayerCar();
        this.renderStaticElements();
        logInfo('FrameRenderer initialized with theme: ' + this.activeTheme.name);
    };
    FrameRenderer.prototype.rebuildSpriteCache = function () {
        this.spriteCache = {};
        var pool = this.activeTheme.roadside.pool;
        for (var i = 0; i < pool.length; i++) {
            var entry = pool[i];
            var creator = ROADSIDE_SPRITES[entry.sprite];
            if (creator) {
                this.spriteCache[entry.sprite] = creator();
            }
        }
    };
    FrameRenderer.prototype.selectFromPool = function (worldZ) {
        var pool = this.activeTheme.roadside.pool;
        var totalWeight = 0;
        for (var i = 0; i < pool.length; i++) {
            totalWeight += pool[i].weight;
        }
        var hash = (Math.floor(worldZ) * 7919) % totalWeight;
        var cumulative = 0;
        for (var j = 0; j < pool.length; j++) {
            cumulative += pool[j].weight;
            if (hash < cumulative) {
                return { sprite: pool[j].sprite, side: pool[j].side || 'both' };
            }
        }
        return { sprite: pool[0].sprite, side: pool[0].side || 'both' };
    };
    FrameRenderer.prototype.clearStaticFrames = function () {
        var sunFrame = this.frameManager.getSunFrame();
        var mtnsFrame = this.frameManager.getMountainsFrame();
        if (sunFrame)
            sunFrame.clear();
        if (mtnsFrame)
            mtnsFrame.clear();
    };
    FrameRenderer.prototype.renderStaticElements = function () {
        if (this.activeTheme.celestial.type === 'sun') {
            this.renderSun();
        }
        else if (this.activeTheme.celestial.type === 'moon') {
            this.renderMoon();
        }
        else if (this.activeTheme.celestial.type === 'dual_moons') {
            this.renderDualMoons();
        }
        if (this.activeTheme.background.type === 'mountains') {
            this.renderMountains();
        }
        else if (this.activeTheme.background.type === 'skyscrapers') {
            this.renderSkyscrapers();
        }
        else if (this.activeTheme.background.type === 'ocean') {
            this.renderOceanIslands();
        }
        else if (this.activeTheme.background.type === 'forest') {
            this.renderForestTreeline();
        }
        this._staticElementsDirty = false;
        logDebug('Static elements rendered, dirty=' + this._staticElementsDirty);
    };
    FrameRenderer.prototype.beginFrame = function () {
    };
    FrameRenderer.prototype.renderSky = function (trackPosition, curvature, playerSteer, speed, dt) {
        if (this.activeTheme.sky.type === 'grid') {
            this.renderSkyGrid(trackPosition);
        }
        else if (this.activeTheme.sky.type === 'stars') {
            this.renderSkyStars(trackPosition);
        }
        else if (this.activeTheme.sky.type === 'gradient') {
            this.renderSkyGradient(trackPosition);
        }
        if (this.activeTheme.background.type === 'ocean') {
            this.renderOceanWaves(trackPosition);
        }
        if (curvature !== undefined && playerSteer !== undefined && speed !== undefined && dt !== undefined) {
            this.updateParallax(curvature, playerSteer, speed, dt);
        }
    };
    FrameRenderer.prototype.renderRoad = function (trackPosition, cameraX, _track, road) {
        if (this.activeTheme.ground && this.activeTheme.ground.type === 'grid') {
            this.renderHolodeckFloor(trackPosition);
        }
        this.renderRoadSurface(trackPosition, cameraX, road);
        var roadsideObjects = this.buildRoadsideObjects(trackPosition, cameraX, road);
        this.renderRoadsideSprites(roadsideObjects);
    };
    FrameRenderer.prototype.buildRoadsideObjects = function (trackPosition, cameraX, road) {
        var objects = [];
        var roadHeight = this.height - this.horizonY;
        var viewDistanceWorld = 100;
        var startZ = trackPosition;
        var endZ = trackPosition + viewDistanceWorld;
        var spacing = this.activeTheme.roadside.spacing;
        var firstObjectZ = Math.ceil(startZ / spacing) * spacing;
        for (var worldZ = firstObjectZ; worldZ < endZ; worldZ += spacing) {
            var selection = this.selectFromPool(worldZ);
            var spriteType = selection.sprite;
            var allowedSide = selection.side;
            var worldZInt = Math.floor(worldZ);
            var relativeZ = worldZ - trackPosition;
            if (relativeZ <= 0)
                continue;
            var distance = relativeZ / 5;
            if (distance < 1 || distance > 20)
                continue;
            var t = 1 - (1 / distance);
            var screenY = Math.round(this.horizonY + roadHeight * (1 - t));
            if (screenY <= this.horizonY || screenY >= this.height)
                continue;
            var accumulatedCurve = 0;
            for (var z = trackPosition; z < worldZ; z += 5) {
                var seg = road.getSegment(z);
                if (seg)
                    accumulatedCurve += seg.curve * 0.5;
            }
            var curveOffset = accumulatedCurve * distance * 0.8;
            var centerX = 40 + Math.round(curveOffset) - Math.round(cameraX * 0.5);
            var roadHalfWidth = Math.round(20 / distance);
            var leftEdge = centerX - roadHalfWidth;
            var rightEdge = centerX + roadHalfWidth;
            var edgeOffset = Math.round(15 / distance) + 3;
            var leftX = leftEdge - edgeOffset;
            var rightX = rightEdge + edgeOffset;
            var preferredSide = (Math.floor(worldZ / spacing) % 2 === 0) ? 'left' : 'right';
            if (allowedSide === 'left' || (allowedSide === 'both' && preferredSide === 'left')) {
                if (leftX >= 0) {
                    objects.push({ x: leftX, y: screenY, distance: distance, type: spriteType });
                }
            }
            if (allowedSide === 'right' || (allowedSide === 'both' && preferredSide === 'right')) {
                if (rightX < 80) {
                    objects.push({ x: rightX, y: screenY, distance: distance, type: spriteType });
                }
            }
            if (this.activeTheme.roadside.density > 1.0 && (worldZInt % 2 === 0)) {
                if (allowedSide === 'both' || allowedSide === 'right') {
                    if (preferredSide === 'left' && rightX < 80) {
                        objects.push({ x: rightX, y: screenY, distance: distance, type: spriteType });
                    }
                }
                if (allowedSide === 'both' || allowedSide === 'left') {
                    if (preferredSide === 'right' && leftX >= 0) {
                        objects.push({ x: leftX, y: screenY, distance: distance, type: spriteType });
                    }
                }
            }
        }
        objects.sort(function (a, b) { return b.distance - a.distance; });
        return objects;
    };
    FrameRenderer.prototype.renderEntities = function (playerVehicle, vehicles, _items) {
        this.renderNPCVehicles(playerVehicle, vehicles);
        this.renderPlayerVehicle(playerVehicle.playerX, playerVehicle.flashTimer > 0);
    };
    FrameRenderer.prototype.renderNPCVehicles = function (playerVehicle, vehicles) {
        var visibleNPCs = [];
        for (var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            if (!v.isNPC)
                continue;
            var relativeZ = v.trackZ - playerVehicle.trackZ;
            var relativeX = v.playerX - playerVehicle.playerX;
            if (relativeZ > -10 && relativeZ < 600) {
                visibleNPCs.push({ vehicle: v, relativeZ: relativeZ, relativeX: relativeX });
            }
        }
        visibleNPCs.sort(function (a, b) { return b.relativeZ - a.relativeZ; });
        for (var j = 0; j < visibleNPCs.length; j++) {
            this.renderNPCVehicle(visibleNPCs[j].vehicle, visibleNPCs[j].relativeZ, visibleNPCs[j].relativeX);
        }
    };
    FrameRenderer.prototype.renderNPCVehicle = function (vehicle, relativeZ, relativeX) {
        var sprite = getNPCSprite(vehicle.npcType, vehicle.npcColorIndex);
        var maxViewDist = 500;
        var normalizedDist = Math.max(0.01, relativeZ / maxViewDist);
        var t = Math.max(0, Math.min(1, 1 - normalizedDist));
        var visualHorizonY = 5;
        var roadBottom = this.height - 4;
        var screenY = Math.round(visualHorizonY + t * (roadBottom - visualHorizonY));
        var perspectiveScale = t * t;
        var screenX = Math.round(40 + relativeX * perspectiveScale * 25);
        var roadHeight = roadBottom - visualHorizonY;
        var screenProgress = (screenY - visualHorizonY) / roadHeight;
        var scaleIndex;
        if (screenProgress < 0.04) {
            scaleIndex = 0;
        }
        else if (screenProgress < 0.10) {
            scaleIndex = 1;
        }
        else if (screenProgress < 0.20) {
            scaleIndex = 2;
        }
        else if (screenProgress < 0.35) {
            scaleIndex = 3;
        }
        else {
            scaleIndex = 4;
        }
        scaleIndex = Math.min(scaleIndex, sprite.variants.length - 1);
        var size = getSpriteSize(sprite, scaleIndex);
        screenX -= Math.floor(size.width / 2);
        var variant = sprite.variants[scaleIndex];
        var frame = this.frameManager.getRoadFrame();
        if (!frame)
            return;
        var isFlashing = vehicle.flashTimer > 0;
        var flashAttr = makeAttr(LIGHTRED, BG_BLACK);
        var visualHorizon = 5;
        for (var row = 0; row < variant.length; row++) {
            for (var col = 0; col < variant[row].length; col++) {
                var cell = variant[row][col];
                if (cell !== null && cell !== undefined) {
                    var drawX = screenX + col;
                    var drawY = screenY + row;
                    if (drawX >= 0 && drawX < this.width && drawY >= visualHorizon && drawY < this.height - 1) {
                        var attr = isFlashing && (Math.floor(Date.now() / 100) % 2 === 0) ? flashAttr : cell.attr;
                        frame.setData(drawX, drawY, cell.char, attr);
                    }
                }
            }
        }
    };
    FrameRenderer.prototype.endFrame = function () {
        this.cycle();
    };
    FrameRenderer.prototype.renderSun = function () {
        var sunFrame = this.frameManager.getSunFrame();
        if (!sunFrame)
            return;
        var colors = this.activeTheme.colors;
        var sunCoreAttr = makeAttr(colors.celestialCore.fg, colors.celestialCore.bg);
        var sunGlowAttr = makeAttr(colors.celestialGlow.fg, colors.celestialGlow.bg);
        var celestial = this.activeTheme.celestial;
        var sunX = Math.floor(this.width * celestial.positionX) - 3;
        var sunY = Math.floor(this.horizonY * celestial.positionY);
        var size = celestial.size;
        var coreWidth = size + 2;
        var coreHeight = Math.max(1, size);
        for (var dy = 0; dy < coreHeight; dy++) {
            for (var dx = 0; dx < coreWidth; dx++) {
                sunFrame.setData(sunX + dx, sunY + dy, GLYPH.FULL_BLOCK, sunCoreAttr);
            }
        }
        var glowChar = GLYPH.DARK_SHADE;
        for (var x = sunX - 1; x <= sunX + coreWidth; x++) {
            sunFrame.setData(x, sunY - 1, glowChar, sunGlowAttr);
        }
        for (var x = sunX - 1; x <= sunX + coreWidth; x++) {
            sunFrame.setData(x, sunY + coreHeight, glowChar, sunGlowAttr);
        }
        for (var dy = 0; dy < coreHeight; dy++) {
            sunFrame.setData(sunX - 1, sunY + dy, glowChar, sunGlowAttr);
            sunFrame.setData(sunX + coreWidth, sunY + dy, glowChar, sunGlowAttr);
        }
    };
    FrameRenderer.prototype.renderMoon = function () {
        var moonFrame = this.frameManager.getSunFrame();
        if (!moonFrame)
            return;
        var colors = this.activeTheme.colors;
        var moonCoreAttr = makeAttr(colors.celestialCore.fg, colors.celestialCore.bg);
        var moonGlowAttr = makeAttr(colors.celestialGlow.fg, colors.celestialGlow.bg);
        var moonGlowDimAttr = makeAttr(CYAN, BG_BLACK);
        var celestial = this.activeTheme.celestial;
        var moonX = Math.floor(this.width * celestial.positionX);
        var moonY = Math.max(1, Math.floor((this.horizonY - 2) * celestial.positionY));
        moonFrame.setData(moonX, moonY, ')', moonCoreAttr);
        moonFrame.setData(moonX, moonY + 1, ')', moonCoreAttr);
        moonFrame.setData(moonX + 1, moonY, ')', moonCoreAttr);
        moonFrame.setData(moonX + 1, moonY + 1, ')', moonCoreAttr);
        moonFrame.setData(moonX - 1, moonY, GLYPH.MEDIUM_SHADE, moonGlowAttr);
        moonFrame.setData(moonX - 1, moonY + 1, GLYPH.MEDIUM_SHADE, moonGlowAttr);
        moonFrame.setData(moonX + 2, moonY, GLYPH.MEDIUM_SHADE, moonGlowAttr);
        moonFrame.setData(moonX + 2, moonY + 1, GLYPH.MEDIUM_SHADE, moonGlowAttr);
        moonFrame.setData(moonX, moonY - 1, GLYPH.MEDIUM_SHADE, moonGlowAttr);
        moonFrame.setData(moonX + 1, moonY - 1, GLYPH.MEDIUM_SHADE, moonGlowAttr);
        moonFrame.setData(moonX, moonY + 2, GLYPH.MEDIUM_SHADE, moonGlowAttr);
        moonFrame.setData(moonX + 1, moonY + 2, GLYPH.MEDIUM_SHADE, moonGlowAttr);
        moonFrame.setData(moonX - 2, moonY, GLYPH.DARK_SHADE, moonGlowDimAttr);
        moonFrame.setData(moonX - 2, moonY + 1, GLYPH.DARK_SHADE, moonGlowDimAttr);
        moonFrame.setData(moonX + 3, moonY, GLYPH.DARK_SHADE, moonGlowDimAttr);
        moonFrame.setData(moonX + 3, moonY + 1, GLYPH.DARK_SHADE, moonGlowDimAttr);
        moonFrame.setData(moonX - 1, moonY - 1, GLYPH.DARK_SHADE, moonGlowDimAttr);
        moonFrame.setData(moonX + 2, moonY - 1, GLYPH.DARK_SHADE, moonGlowDimAttr);
        moonFrame.setData(moonX - 1, moonY + 2, GLYPH.DARK_SHADE, moonGlowDimAttr);
        moonFrame.setData(moonX + 2, moonY + 2, GLYPH.DARK_SHADE, moonGlowDimAttr);
    };
    FrameRenderer.prototype.renderDualMoons = function () {
        var moonFrame = this.frameManager.getSunFrame();
        if (!moonFrame)
            return;
        var colors = this.activeTheme.colors;
        var moonCoreAttr = makeAttr(colors.celestialCore.fg, colors.celestialCore.bg);
        var moonGlowAttr = makeAttr(colors.celestialGlow.fg, colors.celestialGlow.bg);
        var celestial = this.activeTheme.celestial;
        var moon1X = Math.floor(this.width * celestial.positionX);
        var moon1Y = Math.max(1, Math.floor((this.horizonY - 3) * celestial.positionY));
        moonFrame.setData(moon1X, moon1Y, '(', moonCoreAttr);
        moonFrame.setData(moon1X + 1, moon1Y, ')', moonCoreAttr);
        moonFrame.setData(moon1X, moon1Y + 1, '(', moonCoreAttr);
        moonFrame.setData(moon1X + 1, moon1Y + 1, ')', moonCoreAttr);
        moonFrame.setData(moon1X - 1, moon1Y, GLYPH.LIGHT_SHADE, moonGlowAttr);
        moonFrame.setData(moon1X + 2, moon1Y, GLYPH.LIGHT_SHADE, moonGlowAttr);
        moonFrame.setData(moon1X - 1, moon1Y + 1, GLYPH.LIGHT_SHADE, moonGlowAttr);
        moonFrame.setData(moon1X + 2, moon1Y + 1, GLYPH.LIGHT_SHADE, moonGlowAttr);
        moonFrame.setData(moon1X, moon1Y - 1, GLYPH.LIGHT_SHADE, moonGlowAttr);
        moonFrame.setData(moon1X + 1, moon1Y - 1, GLYPH.LIGHT_SHADE, moonGlowAttr);
        moonFrame.setData(moon1X, moon1Y + 2, GLYPH.LIGHT_SHADE, moonGlowAttr);
        moonFrame.setData(moon1X + 1, moon1Y + 2, GLYPH.LIGHT_SHADE, moonGlowAttr);
        var moon2X = Math.floor(this.width * 0.25);
        var moon2Y = Math.max(1, Math.floor((this.horizonY - 2) * 0.2));
        var moon2Attr = makeAttr(LIGHTCYAN, BG_CYAN);
        var moon2GlowAttr = makeAttr(CYAN, BG_BLACK);
        moonFrame.setData(moon2X, moon2Y, ')', moon2Attr);
        moonFrame.setData(moon2X - 1, moon2Y, GLYPH.LIGHT_SHADE, moon2GlowAttr);
        moonFrame.setData(moon2X + 1, moon2Y, GLYPH.LIGHT_SHADE, moon2GlowAttr);
        moonFrame.setData(moon2X, moon2Y - 1, GLYPH.LIGHT_SHADE, moon2GlowAttr);
        moonFrame.setData(moon2X, moon2Y + 1, GLYPH.LIGHT_SHADE, moon2GlowAttr);
    };
    FrameRenderer.prototype.renderMountains = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var mountainAttr = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var highlightAttr = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var mountains = [
            { x: 5, height: 4, width: 12 },
            { x: 20, height: 6, width: 16 },
            { x: 42, height: 5, width: 14 },
            { x: 60, height: 4, width: 10 },
            { x: 72, height: 3, width: 8 }
        ];
        for (var i = 0; i < mountains.length; i++) {
            this.drawMountainToFrame(frame, mountains[i].x, this.horizonY - 1, mountains[i].height, mountains[i].width, mountainAttr, highlightAttr);
        }
    };
    FrameRenderer.prototype.renderSkyscrapers = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var wallAttr = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var windowAttr = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var antennaAttr = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
        var buildings = [
            { x: 2, height: 5, width: 6 },
            { x: 10, height: 7, width: 4 },
            { x: 16, height: 4, width: 5 },
            { x: 23, height: 6, width: 7 },
            { x: 32, height: 8, width: 5 },
            { x: 39, height: 5, width: 6 },
            { x: 47, height: 7, width: 4 },
            { x: 53, height: 4, width: 5 },
            { x: 60, height: 6, width: 6 },
            { x: 68, height: 5, width: 5 },
            { x: 75, height: 4, width: 4 }
        ];
        for (var i = 0; i < buildings.length; i++) {
            this.drawBuildingToFrame(frame, buildings[i].x, this.horizonY - 1, buildings[i].height, buildings[i].width, wallAttr, windowAttr, antennaAttr);
        }
    };
    FrameRenderer.prototype.drawBuildingToFrame = function (frame, baseX, baseY, height, width, wallAttr, windowAttr, antennaAttr) {
        for (var h = 0; h < height; h++) {
            var y = baseY - h;
            if (y < 0)
                continue;
            for (var dx = 0; dx < width; dx++) {
                var x = baseX + dx;
                if (x >= 0 && x < this.width) {
                    var isWindow = (dx > 0 && dx < width - 1 && h > 0 && h < height - 1);
                    var isLit = ((dx + h) % 3 === 0);
                    if (isWindow && isLit) {
                        frame.setData(x, y, '.', windowAttr);
                    }
                    else {
                        frame.setData(x, y, GLYPH.FULL_BLOCK, wallAttr);
                    }
                }
            }
        }
        if (width >= 5 && height >= 5) {
            var antennaX = baseX + Math.floor(width / 2);
            var antennaY = baseY - height;
            if (antennaY >= 0) {
                frame.setData(antennaX, antennaY, '|', antennaAttr);
                frame.setData(antennaX, antennaY - 1, '*', antennaAttr);
            }
        }
    };
    FrameRenderer.prototype.renderOceanIslands = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var islandAttr = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var highlightAttr = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var islands = [
            { x: 15, height: 2, width: 8 },
            { x: 55, height: 3, width: 12 },
        ];
        for (var i = 0; i < islands.length; i++) {
            this.drawMountainToFrame(frame, islands[i].x, this.horizonY - 1, islands[i].height, islands[i].width, islandAttr, highlightAttr);
        }
    };
    FrameRenderer.prototype.renderForestTreeline = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var treeAttr = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var topAttr = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var trunkAttr = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
        var treeChars = ['^', GLYPH.TRIANGLE_UP, 'A', '*'];
        for (var x = 0; x < this.width; x++) {
            var hash = (x * 17 + 5) % 13;
            var treeHeight = 2 + (hash % 4);
            var treeType = hash % treeChars.length;
            for (var h = 0; h < treeHeight; h++) {
                var y = this.horizonY - 1 - h;
                if (y < 0)
                    continue;
                if (h === treeHeight - 1) {
                    frame.setData(x, y, treeChars[treeType], topAttr);
                }
                else if (h === 0 && treeHeight >= 3) {
                    frame.setData(x, y, '|', trunkAttr);
                }
                else {
                    var bodyChar = (h === treeHeight - 2) ? GLYPH.TRIANGLE_UP : GLYPH.MEDIUM_SHADE;
                    frame.setData(x, y, bodyChar, treeAttr);
                }
            }
            if ((x * 7) % 11 === 0) {
                x++;
            }
        }
    };
    FrameRenderer.prototype.renderOceanWaves = function (trackPosition) {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var waveAttr = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
        var foamAttr = makeAttr(WHITE, BG_BLACK);
        var wavePhase = Math.floor(trackPosition / 8) % 4;
        for (var row = 0; row < 2; row++) {
            var y = this.horizonY - row;
            if (y < 0)
                continue;
            for (var x = 0; x < this.width; x++) {
                if ((x >= 15 && x <= 23) || (x >= 55 && x <= 67)) {
                    if (row === 0)
                        continue;
                }
                var wave1 = Math.sin((x + wavePhase * 3) * 0.3);
                var wave2 = Math.sin((x - wavePhase * 2 + 10) * 0.5);
                var combined = wave1 + wave2 * 0.5;
                var char;
                var attr;
                if (combined > 0.8) {
                    char = (wavePhase % 2 === 0) ? '~' : '^';
                    attr = foamAttr;
                }
                else if (combined > 0.2) {
                    char = '~';
                    attr = waveAttr;
                }
                else if (combined > -0.3) {
                    char = (row === 0) ? '-' : '~';
                    attr = waveAttr;
                }
                else {
                    char = '_';
                    attr = waveAttr;
                }
                var sparkle = ((x * 17 + wavePhase * 31) % 23) === 0;
                if (sparkle && row === 0) {
                    char = '*';
                    attr = foamAttr;
                }
                frame.setData(x, y, char, attr);
            }
        }
    };
    FrameRenderer.prototype.drawMountainToFrame = function (frame, baseX, baseY, height, width, attr, highlightAttr) {
        var peakX = baseX + Math.floor(width / 2);
        for (var h = 0; h < height; h++) {
            var y = baseY - h;
            if (y < 0)
                continue;
            var halfWidth = Math.floor((height - h) * width / height / 2);
            for (var dx = -halfWidth; dx <= halfWidth; dx++) {
                var x = peakX + dx;
                if (x >= 0 && x < this.width) {
                    if (dx < 0) {
                        frame.setData(x, y, '/', attr);
                    }
                    else if (dx > 0) {
                        frame.setData(x, y, '\\', attr);
                    }
                    else {
                        if (h === height - 1) {
                            frame.setData(x, y, GLYPH.TRIANGLE_UP, highlightAttr);
                        }
                        else {
                            frame.setData(x, y, GLYPH.BOX_V, attr);
                        }
                    }
                }
            }
        }
    };
    FrameRenderer.prototype.renderSkyGrid = function (trackPosition) {
        var frame = this.frameManager.getSkyGridFrame();
        if (!frame)
            return;
        frame.clear();
        var colors = this.activeTheme.colors;
        var gridAttr = makeAttr(colors.skyGrid.fg, colors.skyGrid.bg);
        var glowAttr = makeAttr(colors.skyGridGlow.fg, colors.skyGridGlow.bg);
        var vanishX = 40 + Math.round(this._mountainScrollOffset * 0.5);
        for (var y = this.horizonY - 1; y >= 1; y--) {
            var distFromHorizon = this.horizonY - y;
            var spread = distFromHorizon * 6;
            if (this.activeTheme.sky.converging) {
                for (var offset = 0; offset <= spread && offset < 40; offset += 10) {
                    if (offset === 0) {
                        frame.setData(vanishX, y, GLYPH.BOX_V, gridAttr);
                    }
                    else {
                        var leftX = vanishX - offset;
                        var rightX = vanishX + offset;
                        if (leftX >= 0 && leftX < this.width)
                            frame.setData(leftX, y, '/', glowAttr);
                        if (rightX >= 0 && rightX < this.width)
                            frame.setData(rightX, y, '\\', glowAttr);
                    }
                }
            }
            if (this.activeTheme.sky.horizontal) {
                var linePhase = Math.floor(trackPosition / 50 + distFromHorizon) % 4;
                if (linePhase === 0) {
                    var lineSpread = Math.min(spread, 38);
                    for (var x = vanishX - lineSpread; x <= vanishX + lineSpread; x++) {
                        if (x >= 0 && x < this.width) {
                            frame.setData(x, y, GLYPH.BOX_H, glowAttr);
                        }
                    }
                }
            }
        }
    };
    FrameRenderer.prototype.renderSkyStars = function (trackPosition) {
        var frame = this.frameManager.getSkyGridFrame();
        if (!frame)
            return;
        frame.clear();
        var colors = this.activeTheme.colors;
        var brightAttr = makeAttr(colors.starBright.fg, colors.starBright.bg);
        var dimAttr = makeAttr(colors.starDim.fg, colors.starDim.bg);
        var density = this.activeTheme.stars.density;
        var numStars = Math.floor(this.width * this.horizonY * density * 0.15);
        var parallaxOffset = Math.round(this._mountainScrollOffset * 0.1);
        var twinklePhase = this.activeTheme.stars.twinkle ? Math.floor(trackPosition / 30) : 0;
        for (var i = 0; i < numStars; i++) {
            var baseX = (i * 17 + 5) % this.width;
            var x = (baseX + parallaxOffset + this.width) % this.width;
            var y = (i * 13 + 3) % (this.horizonY - 1);
            var twinkleState = (i + twinklePhase) % 5;
            var isBright = (i % 3 === 0) ? (twinkleState !== 0) : (twinkleState === 0);
            var char = isBright ? '*' : '.';
            if (x >= 0 && x < this.width && y >= 0 && y < this.horizonY) {
                frame.setData(x, y, char, isBright ? brightAttr : dimAttr);
            }
        }
    };
    FrameRenderer.prototype.renderSkyGradient = function (trackPosition) {
        var frame = this.frameManager.getSkyGridFrame();
        if (!frame)
            return;
        frame.clear();
        var colors = this.activeTheme.colors;
        var highAttr = makeAttr(colors.skyTop.fg, colors.skyTop.bg);
        var midAttr = makeAttr(colors.skyMid.fg, colors.skyMid.bg);
        var lowAttr = makeAttr(colors.skyHorizon.fg, colors.skyHorizon.bg);
        var cloudOffset = Math.floor(trackPosition / 50) % this.width;
        var topZone = Math.floor(this.horizonY * 0.35);
        var midZone = Math.floor(this.horizonY * 0.7);
        for (var y = 0; y < this.horizonY; y++) {
            var attr;
            var chars;
            if (y < topZone) {
                attr = highAttr;
                chars = [' ', ' ', ' ', '.', ' '];
            }
            else if (y < midZone) {
                attr = midAttr;
                chars = [' ', '~', ' ', ' ', '-'];
            }
            else {
                attr = lowAttr;
                chars = ['~', '-', '~', ' ', '='];
            }
            for (var x = 0; x < this.width; x++) {
                var hash = ((x + cloudOffset) * 31 + y * 17) % 37;
                var charIndex = hash % chars.length;
                var char = chars[charIndex];
                frame.setData(x, y, char, attr);
            }
        }
    };
    FrameRenderer.prototype.updateParallax = function (curvature, steer, speed, dt) {
        var scrollAmount = (curvature * 0.8 + steer * 0.3) * speed * dt * 0.15;
        this._mountainScrollOffset += scrollAmount;
        if (this._mountainScrollOffset > 80)
            this._mountainScrollOffset -= 80;
        if (this._mountainScrollOffset < -80)
            this._mountainScrollOffset += 80;
    };
    FrameRenderer.prototype.renderHolodeckFloor = function (trackPosition) {
        var frame = this.frameManager.getGroundGridFrame();
        if (!frame)
            return;
        var ground = this.activeTheme.ground;
        if (!ground)
            return;
        frame.clear();
        var primaryAttr = makeAttr(ground.primary.fg, ground.primary.bg);
        var frameHeight = this.height - this.horizonY;
        var vanishX = Math.floor(this.width / 2);
        var radialSpacing = 6;
        for (var y = 0; y < frameHeight - 1; y++) {
            var distFromHorizon = y + 1;
            var spread = distFromHorizon * 6;
            frame.setData(vanishX, y, GLYPH.BOX_V, primaryAttr);
            for (var offset = radialSpacing; offset <= spread; offset += radialSpacing) {
                var leftX = vanishX - offset;
                var rightX = vanishX + offset;
                if (leftX >= 0) {
                    frame.setData(leftX, y, '/', primaryAttr);
                }
                if (rightX < this.width) {
                    frame.setData(rightX, y, '\\', primaryAttr);
                }
            }
            var linePhase = Math.floor(trackPosition / 40 + distFromHorizon * 1.5) % 5;
            if (linePhase === 0) {
                for (var x = 0; x < this.width; x++) {
                    var distFromVanish = Math.abs(x - vanishX);
                    var isOnRadial = (distFromVanish === 0) || (distFromVanish <= spread && (distFromVanish % radialSpacing) === 0);
                    frame.setData(x, y, isOnRadial ? '+' : GLYPH.BOX_H, primaryAttr);
                }
            }
        }
    };
    FrameRenderer.prototype.renderRoadSurface = function (trackPosition, cameraX, road) {
        var frame = this.frameManager.getRoadFrame();
        if (!frame)
            return;
        frame.clear();
        var roadBottom = this.height - this.horizonY - 1;
        var roadLength = road.totalLength;
        var accumulatedCurve = 0;
        for (var screenY = roadBottom; screenY >= 0; screenY--) {
            var t = (roadBottom - screenY) / roadBottom;
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
            var stripePhase = Math.floor((trackPosition + distance * 5) / 15) % 2;
            var wrappedZ = worldZ % roadLength;
            if (wrappedZ < 0)
                wrappedZ += roadLength;
            var isFinishLine = (wrappedZ < 200) || (wrappedZ > roadLength - 200);
            this.renderRoadScanline(frame, screenY, centerX, leftEdge, rightEdge, distance, stripePhase, isFinishLine, accumulatedCurve);
        }
    };
    FrameRenderer.prototype.renderRoadScanline = function (frame, y, centerX, leftEdge, rightEdge, distance, stripePhase, isFinishLine, curve) {
        var colors = this.activeTheme.colors;
        var roadAttr = makeAttr(distance < 10 ? colors.roadSurfaceAlt.fg : colors.roadSurface.fg, distance < 10 ? colors.roadSurfaceAlt.bg : colors.roadSurface.bg);
        var gridAttr = makeAttr(colors.roadGrid.fg, colors.roadGrid.bg);
        var edgeAttr = makeAttr(colors.roadEdge.fg, colors.roadEdge.bg);
        var stripeAttr = makeAttr(colors.roadStripe.fg, colors.roadStripe.bg);
        var shoulderAttr = makeAttr(colors.shoulderPrimary.fg, colors.shoulderPrimary.bg);
        for (var x = 0; x < this.width; x++) {
            if (x >= leftEdge && x <= rightEdge) {
                if (isFinishLine) {
                    this.renderFinishCell(frame, x, y, centerX, leftEdge, rightEdge, distance);
                }
                else if (x === leftEdge || x === rightEdge) {
                    frame.setData(x, y, GLYPH.BOX_V, edgeAttr);
                }
                else if (Math.abs(x - centerX) < 1 && stripePhase === 0) {
                    frame.setData(x, y, GLYPH.BOX_V, stripeAttr);
                }
                else {
                    var gridPhase = Math.floor(distance) % 3;
                    if (gridPhase === 0 && distance > 5) {
                        frame.setData(x, y, GLYPH.BOX_H, gridAttr);
                    }
                    else {
                        frame.setData(x, y, ' ', roadAttr);
                    }
                }
            }
            else {
                var distFromRoad = (x < leftEdge) ? leftEdge - x : x - rightEdge;
                this.renderGroundCell(frame, x, y, distFromRoad, distance, leftEdge, rightEdge, shoulderAttr, curve || 0);
            }
        }
    };
    FrameRenderer.prototype.renderFinishCell = function (frame, x, y, centerX, leftEdge, rightEdge, distance) {
        if (x === leftEdge || x === rightEdge) {
            frame.setData(x, y, GLYPH.BOX_V, makeAttr(WHITE, BG_BLACK));
            return;
        }
        var checkerSize = Math.max(1, Math.floor(3 / distance));
        var checkerX = Math.floor((x - centerX) / checkerSize);
        var checkerY = Math.floor(y / 2);
        var isWhite = ((checkerX + checkerY) % 2) === 0;
        if (isWhite) {
            frame.setData(x, y, GLYPH.FULL_BLOCK, makeAttr(WHITE, BG_LIGHTGRAY));
        }
        else {
            frame.setData(x, y, ' ', makeAttr(BLACK, BG_BLACK));
        }
    };
    FrameRenderer.prototype.renderGroundCell = function (frame, x, y, distFromRoad, distance, _leftEdge, _rightEdge, shoulderAttr, _curve) {
        var ground = this.activeTheme.ground;
        if (!ground) {
            if (distFromRoad <= 2) {
                frame.setData(x, y, GLYPH.GRASS, shoulderAttr);
            }
            return;
        }
        switch (ground.type) {
            case 'grid':
                return;
            case 'dither':
                this.renderDitherGround(frame, x, y, distFromRoad, distance, ground);
                break;
            case 'grass':
                this.renderGrassGround(frame, x, y, distFromRoad, distance, ground);
                break;
            case 'sand':
                this.renderSandGround(frame, x, y, distFromRoad, distance, ground);
                break;
            case 'solid':
            default:
                if (distFromRoad <= 2) {
                    frame.setData(x, y, GLYPH.GRASS, shoulderAttr);
                }
                else {
                    var solidAttr = makeAttr(ground.primary.fg, ground.primary.bg);
                    frame.setData(x, y, ' ', solidAttr);
                }
                break;
        }
    };
    FrameRenderer.prototype.renderDitherGround = function (frame, x, y, _distFromRoad, distance, ground) {
        var pattern = ground.pattern || {};
        var density = pattern.ditherDensity || 0.3;
        var chars = pattern.ditherChars || ['.', ',', "'"];
        var primaryAttr = makeAttr(ground.primary.fg, ground.primary.bg);
        var secondaryAttr = makeAttr(ground.secondary.fg, ground.secondary.bg);
        var hash = (x * 31 + y * 17 + Math.floor(distance)) % 100;
        var normalized = hash / 100;
        if (normalized < density) {
            var charIndex = hash % chars.length;
            frame.setData(x, y, chars[charIndex], secondaryAttr);
        }
        else {
            frame.setData(x, y, ' ', primaryAttr);
        }
    };
    FrameRenderer.prototype.renderGrassGround = function (frame, x, y, _distFromRoad, distance, ground) {
        var pattern = ground.pattern || {};
        var density = pattern.grassDensity || 0.4;
        var chars = pattern.grassChars || ['"', "'", ',', '.'];
        var primaryAttr = makeAttr(ground.primary.fg, ground.primary.bg);
        var secondaryAttr = makeAttr(ground.secondary.fg, ground.secondary.bg);
        var hash = (x * 23 + y * 41 + Math.floor(distance * 2)) % 100;
        var normalized = hash / 100;
        if (normalized < density) {
            var charIndex = hash % chars.length;
            var attr = ((x + y) % 3 === 0) ? secondaryAttr : primaryAttr;
            frame.setData(x, y, chars[charIndex], attr);
        }
        else {
            frame.setData(x, y, ' ', primaryAttr);
        }
    };
    FrameRenderer.prototype.renderSandGround = function (frame, x, y, _distFromRoad, distance, ground) {
        var primaryAttr = makeAttr(ground.primary.fg, ground.primary.bg);
        var secondaryAttr = makeAttr(ground.secondary.fg, ground.secondary.bg);
        var hash = (x * 17 + y * 29 + Math.floor(distance)) % 100;
        if (hash < 15) {
            frame.setData(x, y, '~', secondaryAttr);
        }
        else if (hash < 25) {
            frame.setData(x, y, '.', primaryAttr);
        }
        else {
            frame.setData(x, y, ' ', primaryAttr);
        }
    };
    FrameRenderer.prototype.renderRoadsideSprites = function (objects) {
        objects.sort(function (a, b) { return b.distance - a.distance; });
        var poolSize = this.frameManager.getRoadsidePoolSize();
        var used = 0;
        for (var i = 0; i < objects.length && used < poolSize; i++) {
            var obj = objects[i];
            var spriteFrame = this.frameManager.getRoadsideFrame(used);
            if (!spriteFrame)
                continue;
            var sprite = this.spriteCache[obj.type];
            if (!sprite) {
                var pool = this.activeTheme.roadside.pool;
                if (pool.length > 0) {
                    sprite = this.spriteCache[pool[0].sprite];
                }
                if (!sprite)
                    continue;
            }
            var scaleIndex = this.getScaleForDistance(obj.distance);
            renderSpriteToFrame(spriteFrame, sprite, scaleIndex);
            var size = getSpriteSize(sprite, scaleIndex);
            var frameX = Math.round(obj.x - size.width / 2);
            var frameY = Math.round(obj.y - size.height + 1);
            this.frameManager.positionRoadsideFrame(used, frameX, frameY, true);
            used++;
        }
        for (var j = used; j < poolSize; j++) {
            this.frameManager.positionRoadsideFrame(j, 0, 0, false);
        }
    };
    FrameRenderer.prototype.getScaleForDistance = function (distance) {
        if (distance > 8)
            return 0;
        if (distance > 5)
            return 1;
        if (distance > 3)
            return 2;
        if (distance > 1.5)
            return 3;
        return 4;
    };
    FrameRenderer.prototype.renderPlayerVehicle = function (playerX, isFlashing) {
        var frame = this.frameManager.getVehicleFrame(0);
        if (!frame)
            return;
        renderSpriteToFrame(frame, this.playerCarSprite, 0);
        if (isFlashing) {
            var flashColor = (Math.floor(Date.now() / 100) % 2 === 0) ? WHITE : LIGHTRED;
            var flashAttr = makeAttr(flashColor, BG_BLACK);
            for (var y = 0; y < 3; y++) {
                for (var x = 0; x < 5; x++) {
                    var cell = this.playerCarSprite.variants[0][y] ? this.playerCarSprite.variants[0][y][x] : null;
                    if (cell) {
                        frame.setData(x, y, cell.char, flashAttr);
                    }
                }
            }
        }
        var screenX = 40 + Math.round(playerX * 5) - 2;
        var screenY = this.height - 3;
        this.frameManager.positionVehicleFrame(0, screenX, screenY, true);
    };
    FrameRenderer.prototype.renderHud = function (hudData) {
        var frame = this.frameManager.getHudFrame();
        if (!frame)
            return;
        frame.clear();
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        var valueAttr = colorToAttr(PALETTE.HUD_VALUE);
        this.writeStringToFrame(frame, 2, 0, 'LAP', labelAttr);
        this.writeStringToFrame(frame, 6, 0, hudData.lap + '/' + hudData.totalLaps, valueAttr);
        this.writeStringToFrame(frame, 14, 0, 'POS', labelAttr);
        this.writeStringToFrame(frame, 18, 0, hudData.position + PositionIndicator.getOrdinalSuffix(hudData.position), valueAttr);
        this.writeStringToFrame(frame, 26, 0, 'TIME', labelAttr);
        this.writeStringToFrame(frame, 31, 0, LapTimer.format(hudData.lapTime), valueAttr);
        this.writeStringToFrame(frame, 66, 0, 'SPD', labelAttr);
        this.writeStringToFrame(frame, 70, 0, this.padLeft(hudData.speed.toString(), 3), valueAttr);
        this.renderSpeedometerBar(frame, hudData.speed, hudData.speedMax);
        this.renderTrackProgress(frame, hudData.lapProgress);
    };
    FrameRenderer.prototype.renderTrackProgress = function (frame, progress) {
        var y = this.height - 1;
        var barX = 60;
        var barWidth = 15;
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        var filledAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
        var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
        var finishAttr = colorToAttr({ fg: WHITE, bg: BG_BLACK });
        this.writeStringToFrame(frame, barX - 5, y, 'TRK', labelAttr);
        frame.setData(barX, y, '[', labelAttr);
        var fillWidth = Math.round(progress * barWidth);
        for (var i = 0; i < barWidth; i++) {
            var attr = (i < fillWidth) ? filledAttr : emptyAttr;
            var char = (i < fillWidth) ? GLYPH.FULL_BLOCK : GLYPH.LIGHT_SHADE;
            frame.setData(barX + 1 + i, y, char, attr);
        }
        frame.setData(barX + barWidth + 1, y, ']', finishAttr);
    };
    FrameRenderer.prototype.renderSpeedometerBar = function (frame, speed, maxSpeed) {
        var y = this.height - 1;
        var barX = 2;
        var barWidth = 20;
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        var filledAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
        var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
        var highAttr = colorToAttr({ fg: LIGHTRED, bg: BG_BLACK });
        frame.setData(barX, y, '[', labelAttr);
        var fillAmount = speed / maxSpeed;
        var fillWidth = Math.round(fillAmount * barWidth);
        for (var i = 0; i < barWidth; i++) {
            var attr = (i < fillWidth) ? (fillAmount > 0.8 ? highAttr : filledAttr) : emptyAttr;
            var char = (i < fillWidth) ? GLYPH.FULL_BLOCK : GLYPH.LIGHT_SHADE;
            frame.setData(barX + 1 + i, y, char, attr);
        }
        frame.setData(barX + barWidth + 1, y, ']', labelAttr);
    };
    FrameRenderer.prototype.writeStringToFrame = function (frame, x, y, str, attr) {
        for (var i = 0; i < str.length; i++) {
            frame.setData(x + i, y, str.charAt(i), attr);
        }
    };
    FrameRenderer.prototype.padLeft = function (str, len) {
        while (str.length < len) {
            str = ' ' + str;
        }
        return str;
    };
    FrameRenderer.prototype.cycle = function () {
        this.frameManager.cycle();
    };
    FrameRenderer.prototype.shutdown = function () {
        this.frameManager.shutdown();
        console.clear();
    };
    return FrameRenderer;
}());
