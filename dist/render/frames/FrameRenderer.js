"use strict";
var FrameRenderer = (function () {
    function FrameRenderer(width, height) {
        this._currentBrakeLightsOn = false;
        this.width = width;
        this.height = height;
        this.horizonY = 8;
        this._mountainScrollOffset = 0;
        this._staticElementsDirty = true;
        this._skyGridAnimPhase = 0;
        this._fireAnimPhase = 0;
        this._currentRoad = null;
        this._currentTrackPosition = 0;
        this._currentCameraX = 0;
        this._lightningBolts = [];
        this._ansiTunnelRenderer = null;
        this._ansiDebugLogged = false;
        this._ansiFrameLogged = false;
        this.frameManager = new FrameManager(width, height, this.horizonY);
        this.composer = new SceneComposer(width, height);
        this.activeTheme = SynthwaveTheme;
        this.spriteCache = {};
    }
    FrameRenderer.prototype.setTheme = function (themeName) {
        var theme = getTheme(themeName);
        if (theme) {
            this.activeTheme = theme;
            this._staticElementsDirty = true;
            this.rebuildSpriteCache();
            if (themeName === 'ansi_tunnel') {
                this._ansiTunnelRenderer = new ANSITunnelRenderer();
                logInfo('ANSI Tunnel renderer initialized');
            }
            else {
                this._ansiTunnelRenderer = null;
            }
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
        else if (this.activeTheme.celestial.type === 'monster') {
            this.renderMonsterSilhouette();
        }
        else if (this.activeTheme.celestial.type === 'mermaid') {
            this.renderMermaid();
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
        else if (this.activeTheme.background.type === 'jungle_canopy') {
            this.renderJungleCanopy();
        }
        else if (this.activeTheme.background.type === 'candy_hills') {
            this.renderCandyHills();
        }
        else if (this.activeTheme.background.type === 'nebula') {
            this.renderNebula();
        }
        else if (this.activeTheme.background.type === 'castle_fortress') {
            this.renderCastleFortress();
        }
        else if (this.activeTheme.background.type === 'volcanic') {
            this.renderVolcanic();
        }
        else if (this.activeTheme.background.type === 'pyramids') {
            this.renderPyramids();
        }
        else if (this.activeTheme.background.type === 'dunes') {
            this.renderDunes();
        }
        else if (this.activeTheme.background.type === 'stadium') {
            this.renderStadium();
        }
        else if (this.activeTheme.background.type === 'destroyed_city') {
            this.renderDestroyedCity();
        }
        else if (this.activeTheme.background.type === 'underwater') {
            this.renderUnderwaterBackground();
        }
        else if (this.activeTheme.background.type === 'aquarium') {
            this.renderAquariumBackground();
        }
        else if (this.activeTheme.background.type === 'ansi') {
            this.renderANSITunnelStatic();
        }
        this._staticElementsDirty = false;
        logDebug('Static elements rendered, dirty=' + this._staticElementsDirty);
    };
    FrameRenderer.prototype.beginFrame = function () {
    };
    FrameRenderer.prototype.renderSky = function (trackPosition, curvature, playerSteer, speed, dt) {
        if (this.activeTheme.name === 'glitch_circuit' && typeof GlitchState !== 'undefined') {
            GlitchState.update(trackPosition, dt || 0.016);
        }
        this._fireAnimPhase += (dt || 0.016) * 8;
        if (this.activeTheme.sky.type === 'grid') {
            this.renderSkyGrid(speed || 0, dt || 0);
        }
        else if (this.activeTheme.sky.type === 'stars') {
            this.renderSkyStars(trackPosition);
        }
        else if (this.activeTheme.sky.type === 'gradient') {
            this.renderSkyGradient(trackPosition);
        }
        else if (this.activeTheme.sky.type === 'water') {
            this.renderSkyWater(trackPosition, speed || 0, dt || 0);
        }
        else if (this.activeTheme.sky.type === 'ansi') {
            if (this._ansiTunnelRenderer && this._currentRoad) {
                this._ansiTunnelRenderer.updateScroll(trackPosition, this._currentRoad.totalLength);
            }
        }
        if (this.activeTheme.background.type === 'ocean') {
            this.renderOceanWaves(trackPosition);
        }
        if (curvature !== undefined && playerSteer !== undefined && speed !== undefined && dt !== undefined && speed > 0) {
            this.updateParallax(curvature, playerSteer, speed, dt);
        }
    };
    FrameRenderer.prototype.renderRoad = function (trackPosition, cameraX, _track, road) {
        this._currentRoad = road;
        this._currentTrackPosition = trackPosition;
        this._currentCameraX = cameraX;
        var bgType = this.activeTheme.background ? this.activeTheme.background.type : 'none';
        if (!this._ansiDebugLogged) {
            this._ansiDebugLogged = true;
            logInfo('renderRoad check: bgType=' + bgType + ' hasRenderer=' + (this._ansiTunnelRenderer ? 'yes' : 'no') + ' theme=' + this.activeTheme.name);
        }
        if (this._ansiTunnelRenderer && bgType === 'ansi') {
            this._ansiTunnelRenderer.updateScroll(trackPosition, road.totalLength);
            var skyFrame = this.frameManager.getSkyGridFrame();
            var roadFrame = this.frameManager.getRoadFrame();
            var roadFrameHeight = this.height - this.horizonY;
            var ansiRoadHeight = roadFrameHeight;
            if (!this._ansiFrameLogged) {
                this._ansiFrameLogged = true;
                logInfo('ANSI frames: sky=' + (skyFrame ? 'ok' : 'null') + ' road=' + (roadFrame ? 'ok' : 'null') + ' horizonY=' + this.horizonY + ' roadFrameHeight=' + roadFrameHeight + ' ansiRoadHeight=' + ansiRoadHeight);
            }
            if (roadFrame) {
                roadFrame.clear();
            }
            this._ansiTunnelRenderer.renderTunnel(skyFrame, roadFrame, this.horizonY, ansiRoadHeight, this.width, trackPosition, cameraX, road, road.totalLength);
            this.renderANSIRoadStripes(trackPosition, cameraX, road, ansiRoadHeight);
            var roadsideObjects = this.buildRoadsideObjects(trackPosition, cameraX, road);
            this.renderRoadsideSprites(roadsideObjects);
            return;
        }
        if (this.activeTheme.ground) {
            if (this.activeTheme.ground.type === 'grid') {
                this.renderHolodeckFloor(trackPosition);
            }
            else if (this.activeTheme.ground.type === 'lava') {
                this.renderLavaGround(trackPosition);
            }
            else if (this.activeTheme.ground.type === 'candy') {
                this.renderCandyGround(trackPosition);
            }
            else if (this.activeTheme.ground.type === 'void') {
                this.renderVoidGround(trackPosition);
            }
            else if (this.activeTheme.ground.type === 'cobblestone') {
                this.renderCobblestoneGround(trackPosition);
            }
            else if (this.activeTheme.ground.type === 'jungle') {
                this.renderJungleGround(trackPosition);
            }
            else if (this.activeTheme.ground.type === 'dirt') {
                this.renderDirtGround(trackPosition);
            }
            else if (this.activeTheme.ground.type === 'water') {
                this.renderWaterGround(trackPosition);
            }
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
    FrameRenderer.prototype.renderEntities = function (playerVehicle, vehicles, items, projectiles) {
        this.renderItemBoxes(playerVehicle, items);
        if (projectiles && projectiles.length > 0) {
            this.renderProjectiles(playerVehicle, projectiles);
        }
        this.renderNPCVehicles(playerVehicle, vehicles);
        var v = playerVehicle;
        this.renderPlayerVehicle(playerVehicle.playerX, playerVehicle.flashTimer > 0, playerVehicle.boostTimer > 0, v.hasEffect ? v.hasEffect(ItemType.STAR) : false, v.hasEffect ? v.hasEffect(ItemType.BULLET) : false, v.hasEffect ? v.hasEffect(ItemType.LIGHTNING) : false, v.carId || 'sports', v.carColorId || 'yellow', this._currentBrakeLightsOn);
    };
    FrameRenderer.prototype.renderProjectiles = function (playerVehicle, projectiles) {
        var frame = this.frameManager.getRoadFrame();
        if (!frame)
            return;
        var visualHorizonY = 5;
        var roadBottom = this.height - 4;
        var roadHeight = roadBottom - visualHorizonY;
        var greenSprites = [
            ['.'],
            ['o'],
            ['(O)'],
            ['_/O\\_', ' \\O/']
        ];
        var redSprites = [
            ['.'],
            ['o'],
            ['(O)'],
            ['_/O\\_', ' \\O/']
        ];
        var blueSprites = [
            ['*'],
            ['@'],
            ['<@>'],
            ['~/~@~\\~', ' ~\\@/~']
        ];
        var bananaSprites = [
            ['.'],
            ['o'],
            ['(o)'],
            [' /\\\\ ', '(__)']
        ];
        for (var i = 0; i < projectiles.length; i++) {
            var projectile = projectiles[i];
            if (projectile.isDestroyed)
                continue;
            var isBanana = projectile.speed === 0;
            var distZ = projectile.trackZ - playerVehicle.trackZ;
            if (distZ < -5 || distZ > 600)
                continue;
            var maxViewDist = 500;
            var normalizedDist = Math.max(0.01, distZ / maxViewDist);
            var t = Math.max(0, Math.min(1, 1 - normalizedDist));
            var screenY = Math.round(visualHorizonY + t * roadHeight);
            var curveOffset = 0;
            if (this._currentRoad && distZ > 0) {
                var projWorldZ = this._currentTrackPosition + distZ;
                var seg = this._currentRoad.getSegment(projWorldZ);
                if (seg) {
                    curveOffset = seg.curve * t * 15;
                }
            }
            var perspectiveScale = t * t;
            var relativeX = projectile.playerX - playerVehicle.playerX;
            var screenX = Math.round(40 + curveOffset + relativeX * perspectiveScale * 25 - this._currentCameraX * 0.5);
            var screenProgress = (screenY - visualHorizonY) / roadHeight;
            var scaleIndex;
            if (screenProgress < 0.08) {
                scaleIndex = 0;
            }
            else if (screenProgress < 0.20) {
                scaleIndex = 1;
            }
            else if (screenProgress < 0.40) {
                scaleIndex = 2;
            }
            else {
                scaleIndex = 3;
            }
            var sprites;
            var attr;
            if (isBanana) {
                sprites = bananaSprites;
                attr = makeAttr(YELLOW, BG_BLACK);
            }
            else {
                var shell = projectile;
                if (shell.shellType === ShellType.GREEN) {
                    sprites = greenSprites;
                    attr = makeAttr(LIGHTGREEN, BG_BLACK);
                }
                else if (shell.shellType === ShellType.RED) {
                    sprites = redSprites;
                    attr = makeAttr(LIGHTRED, BG_BLACK);
                }
                else {
                    sprites = blueSprites;
                    attr = makeAttr(LIGHTBLUE, BG_BLACK);
                }
            }
            var spriteLines = sprites[scaleIndex];
            var spriteWidth = spriteLines[0].length;
            var spriteHeight = spriteLines.length;
            var startX = screenX - Math.floor(spriteWidth / 2);
            var startY = screenY - (spriteHeight - 1);
            for (var ly = 0; ly < spriteHeight; ly++) {
                var line = spriteLines[ly];
                var drawY = startY + ly;
                if (drawY < visualHorizonY || drawY >= roadBottom)
                    continue;
                for (var lx = 0; lx < line.length; lx++) {
                    var ch = line.charAt(lx);
                    if (ch === ' ')
                        continue;
                    var drawX = startX + lx;
                    if (drawX < 0 || drawX >= 80)
                        continue;
                    frame.setData(drawX, drawY, ch, attr);
                }
            }
        }
    };
    FrameRenderer.prototype.renderItemBoxes = function (playerVehicle, items) {
        var frame = this.frameManager.getRoadFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var boxColors = colors.itemBox || {
            border: { fg: YELLOW, bg: BG_BLACK },
            fill: { fg: BROWN, bg: BG_BLACK },
            symbol: { fg: WHITE, bg: BG_BLACK }
        };
        var borderAttr = makeAttr(boxColors.border.fg, boxColors.border.bg);
        var fillAttr = makeAttr(boxColors.fill.fg, boxColors.fill.bg);
        var symbolAttr = makeAttr(boxColors.symbol.fg, boxColors.symbol.bg);
        var visualHorizonY = 5;
        var roadBottom = this.height - 4;
        var itemsToRender = [];
        for (var p = 0; p < items.length; p++) {
            var pItem = items[p];
            if (pItem.isBeingDestroyed() && pItem.pickedUpByPlayer) {
                this.renderPlayerPickupEffect(frame, pItem.destructionTimer, pItem.destructionStartTime, symbolAttr);
            }
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!item.isAvailable() && !item.isBeingDestroyed())
                continue;
            if (item.isBeingDestroyed() && item.pickedUpByPlayer)
                continue;
            var relativeZ = item.z - playerVehicle.trackZ;
            var relativeX = item.x - (playerVehicle.playerX * 20);
            if (relativeZ < 5 || relativeZ > 300)
                continue;
            var maxViewDist = 300;
            var normalizedDist = Math.max(0.01, relativeZ / maxViewDist);
            var t = Math.max(0, Math.min(1, 1 - normalizedDist));
            var screenY = Math.round(visualHorizonY + t * (roadBottom - visualHorizonY));
            var curveOffset = 0;
            if (this._currentRoad && relativeZ > 0) {
                var itemWorldZ = this._currentTrackPosition + relativeZ;
                var seg = this._currentRoad.getSegment(itemWorldZ);
                if (seg) {
                    curveOffset = seg.curve * t * 15;
                }
            }
            var xScale = t * 1.5;
            var screenX = Math.round(40 + curveOffset + relativeX * xScale - this._currentCameraX * 0.5);
            if (screenY < visualHorizonY - 2 || screenY >= this.height)
                continue;
            if (screenX < -3 || screenX >= this.width + 3)
                continue;
            itemsToRender.push({ item: item, screenY: screenY, screenX: screenX, t: t });
        }
        itemsToRender.sort(function (a, b) { return a.screenY - b.screenY; });
        for (var j = 0; j < itemsToRender.length; j++) {
            var data = itemsToRender[j];
            var item = data.item;
            var screenX = data.screenX;
            var screenY = data.screenY;
            var t = data.t;
            var pulse = Math.floor(Date.now() / 150) % 4;
            if (item.isBeingDestroyed()) {
                this.renderItemBoxDestruction(frame, screenX, screenY, t, item.destructionTimer, item.destructionStartTime);
                continue;
            }
            if (t > 0.5) {
                this.renderItemBoxLarge(frame, screenX, screenY, borderAttr, fillAttr, symbolAttr, pulse);
            }
            else if (t > 0.25) {
                this.renderItemBoxMedium(frame, screenX, screenY, borderAttr, symbolAttr, pulse);
            }
            else if (t > 0.1) {
                this.renderItemBoxSmall(frame, screenX, screenY, borderAttr, symbolAttr, pulse);
            }
            else {
                if (screenX >= 0 && screenX < this.width && screenY >= 0 && screenY < this.height) {
                    var tinyAttr = (pulse % 2 === 0) ? borderAttr : symbolAttr;
                    frame.setData(screenX, screenY, '.', tinyAttr);
                }
            }
        }
    };
    FrameRenderer.prototype.renderItemBoxLarge = function (frame, cx, cy, borderAttr, _fillAttr, symbolAttr, pulse) {
        var TL = GLYPH.DBOX_TL;
        var TR = GLYPH.DBOX_TR;
        var BL = GLYPH.DBOX_BL;
        var BR = GLYPH.DBOX_BR;
        var H = GLYPH.DBOX_H;
        var V = GLYPH.DBOX_V;
        var activeBorderAttr = (pulse === 0 || pulse === 2) ? borderAttr :
            makeAttr(WHITE, borderAttr & 0xF0);
        var left = cx - 1;
        var right = cx + 1;
        var top = cy - 1;
        var bottom = cy + 1;
        if (top >= 0 && top < this.height) {
            if (left >= 0 && left < this.width)
                frame.setData(left, top, TL, activeBorderAttr);
            if (cx >= 0 && cx < this.width)
                frame.setData(cx, top, H, activeBorderAttr);
            if (right >= 0 && right < this.width)
                frame.setData(right, top, TR, activeBorderAttr);
        }
        if (cy >= 0 && cy < this.height) {
            if (left >= 0 && left < this.width)
                frame.setData(left, cy, V, activeBorderAttr);
            if (cx >= 0 && cx < this.width) {
                var qAttr = (pulse % 2 === 0) ? symbolAttr : makeAttr(YELLOW, symbolAttr & 0xF0);
                frame.setData(cx, cy, '?', qAttr);
            }
            if (right >= 0 && right < this.width)
                frame.setData(right, cy, V, activeBorderAttr);
        }
        if (bottom >= 0 && bottom < this.height) {
            if (left >= 0 && left < this.width)
                frame.setData(left, bottom, BL, activeBorderAttr);
            if (cx >= 0 && cx < this.width)
                frame.setData(cx, bottom, H, activeBorderAttr);
            if (right >= 0 && right < this.width)
                frame.setData(right, bottom, BR, activeBorderAttr);
        }
    };
    FrameRenderer.prototype.renderItemBoxMedium = function (frame, cx, cy, borderAttr, symbolAttr, pulse) {
        var left = cx - 1;
        var right = cx + 1;
        var activeBorderAttr = (pulse % 2 === 0) ? borderAttr : makeAttr(WHITE, borderAttr & 0xF0);
        if (cy >= 0 && cy < this.height) {
            if (left >= 0 && left < this.width)
                frame.setData(left, cy, '[', activeBorderAttr);
            if (cx >= 0 && cx < this.width) {
                var qAttr = (pulse % 2 === 0) ? symbolAttr : makeAttr(YELLOW, symbolAttr & 0xF0);
                frame.setData(cx, cy, '?', qAttr);
            }
            if (right >= 0 && right < this.width)
                frame.setData(right, cy, ']', activeBorderAttr);
        }
        var bottom = cy + 1;
        if (bottom >= 0 && bottom < this.height) {
            if (cx >= 0 && cx < this.width)
                frame.setData(cx, bottom, GLYPH.LOWER_HALF, makeAttr(DARKGRAY, BG_BLACK));
        }
    };
    FrameRenderer.prototype.renderItemBoxSmall = function (frame, cx, cy, borderAttr, symbolAttr, pulse) {
        if (cx < 0 || cx >= this.width || cy < 0 || cy >= this.height)
            return;
        var char = (pulse % 2 === 0) ? '?' : GLYPH.FULL_BLOCK;
        var attr = (pulse % 2 === 0) ? symbolAttr : borderAttr;
        frame.setData(cx, cy, char, attr);
    };
    FrameRenderer.prototype.renderItemBoxDestruction = function (frame, cx, cy, t, destructionTimer, startTime) {
        var totalDuration = 0.4;
        var progress = 1 - (destructionTimer / totalDuration);
        progress = Math.max(0, Math.min(1, progress));
        var colors = [YELLOW, WHITE, LIGHTCYAN, LIGHTMAGENTA, LIGHTRED];
        var colorIndex = Math.floor((Date.now() - startTime) / 50) % colors.length;
        var explosionAttr = makeAttr(colors[colorIndex], BG_BLACK);
        var sparkAttr = makeAttr(YELLOW, BG_BLACK);
        var scale = t > 0.5 ? 3 : (t > 0.25 ? 2 : 1);
        var spread = Math.floor(progress * scale * 2) + 1;
        var chars = ['*', '+', GLYPH.LIGHT_SHADE, '.', GLYPH.MEDIUM_SHADE];
        if (progress < 0.5) {
            if (cx >= 0 && cx < this.width && cy >= 0 && cy < this.height) {
                frame.setData(cx, cy, chars[0], explosionAttr);
            }
        }
        var particleCount = Math.floor(progress * 8);
        for (var i = 0; i < particleCount; i++) {
            var angle = (i / 8) * Math.PI * 2;
            var dist = spread * (0.5 + progress * 0.5);
            var px = Math.round(cx + Math.cos(angle) * dist);
            var py = Math.round(cy + Math.sin(angle) * dist * 0.5);
            if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
                var charIdx = (i + Math.floor(progress * 3)) % chars.length;
                var attr = (i % 2 === 0) ? explosionAttr : sparkAttr;
                frame.setData(px, py, chars[charIdx], attr);
            }
        }
        if (progress > 0.3 && progress < 0.8) {
            var sparkles = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
            for (var s = 0; s < sparkles.length; s++) {
                var sx = cx + sparkles[s][0];
                var sy = cy + sparkles[s][1];
                if (sx >= 0 && sx < this.width && sy >= 0 && sy < this.height) {
                    var sparkChar = (Date.now() % 100 < 50) ? '*' : '+';
                    frame.setData(sx, sy, sparkChar, sparkAttr);
                }
            }
        }
    };
    FrameRenderer.prototype.renderPlayerPickupEffect = function (frame, destructionTimer, startTime, themeAttr) {
        var totalDuration = 0.5;
        var progress = 1 - (destructionTimer / totalDuration);
        progress = Math.max(0, Math.min(1, progress));
        var cx = Math.floor(this.width / 2);
        var cy = this.height - 5;
        var colors = [WHITE, YELLOW, LIGHTCYAN, LIGHTMAGENTA, YELLOW];
        var colorIndex = Math.floor((Date.now() - startTime) / 40) % colors.length;
        var burstAttr = makeAttr(colors[colorIndex], BG_BLACK);
        var sparkAttr = makeAttr(YELLOW, BG_BLACK);
        var flashChars = ['*', '+', GLYPH.LIGHT_SHADE, '!', '?', GLYPH.MEDIUM_SHADE, GLYPH.FULL_BLOCK];
        if (progress < 0.3) {
            var flashSize = Math.floor(3 + progress * 6);
            for (var fy = -1; fy <= 1; fy++) {
                for (var fx = -flashSize; fx <= flashSize; fx++) {
                    var px = cx + fx;
                    var py = cy + fy;
                    if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
                        var dist = Math.abs(fx) + Math.abs(fy);
                        var charIdx = dist % flashChars.length;
                        var attr = (dist % 2 === 0) ? burstAttr : themeAttr;
                        frame.setData(px, py, flashChars[charIdx], attr);
                    }
                }
            }
        }
        if (progress > 0.1 && progress < 0.7) {
            var ringProgress = (progress - 0.1) / 0.5;
            var ringRadius = 2 + ringProgress * 10;
            var numParticles = 12;
            for (var i = 0; i < numParticles; i++) {
                var angle = (i / numParticles) * Math.PI * 2;
                var px = Math.round(cx + Math.cos(angle) * ringRadius);
                var py = Math.round(cy + Math.sin(angle) * ringRadius * 0.4);
                if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
                    var charIdx = (i + Math.floor(progress * 5)) % flashChars.length;
                    var attr = (i % 3 === 0) ? burstAttr : (i % 3 === 1) ? sparkAttr : themeAttr;
                    frame.setData(px, py, flashChars[charIdx], attr);
                }
            }
        }
        if (progress > 0.2) {
            var riseProgress = (progress - 0.2) / 0.8;
            var numSparkles = 8;
            for (var s = 0; s < numSparkles; s++) {
                var sx = cx + (s - numSparkles / 2) * 2;
                var sy = cy - Math.floor(riseProgress * (4 + (s % 3) * 2));
                if (sx >= 0 && sx < this.width && sy >= 0 && sy < this.height) {
                    var sparkleChar = (Date.now() % 80 < 40) ? '*' : '+';
                    var attr = (s % 2 === 0) ? burstAttr : sparkAttr;
                    frame.setData(sx, sy, sparkleChar, attr);
                }
            }
        }
        if (progress < 0.4) {
            var textY = cy - 3;
            if (progress < 0.15) {
                if (cx >= 0 && cx < this.width && textY >= 0 && textY < this.height) {
                    frame.setData(cx, textY, '!', burstAttr);
                }
            }
        }
    };
    FrameRenderer.prototype.renderNPCVehicles = function (playerVehicle, vehicles) {
        var visibleNPCs = [];
        var roadLength = this._currentRoad ? this._currentRoad.totalLength : 10000;
        for (var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            if (!v.isNPC)
                continue;
            var rawDiff = v.trackZ - playerVehicle.trackZ;
            var relativeZ = rawDiff;
            if (rawDiff > roadLength / 2) {
                relativeZ = rawDiff - roadLength;
            }
            else if (rawDiff < -roadLength / 2) {
                relativeZ = rawDiff + roadLength;
            }
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
        var t;
        if (relativeZ >= 0) {
            var normalizedDist = Math.min(1, relativeZ / maxViewDist);
            t = 1 - normalizedDist;
        }
        else {
            t = 1 + Math.abs(relativeZ) / 50;
        }
        var visualHorizonY = 5;
        var roadBottom = this.height - 4;
        var screenY = Math.round(visualHorizonY + t * (roadBottom - visualHorizonY));
        var curveOffset = 0;
        if (this._currentRoad && relativeZ > 0) {
            var npcWorldZ = this._currentTrackPosition + relativeZ;
            var seg = this._currentRoad.getSegment(npcWorldZ);
            if (seg) {
                curveOffset = seg.curve * t * 15;
            }
        }
        var perspectiveScale = t * t;
        var screenX = Math.round(40 + curveOffset + relativeX * perspectiveScale * 25 - this._currentCameraX * 0.5);
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
        var hasLightning = vehicle.hasEffect(ItemType.LIGHTNING);
        var hasStar = vehicle.hasEffect(ItemType.STAR);
        var hasBullet = vehicle.hasEffect(ItemType.BULLET);
        if (hasLightning) {
            var lightningCycle = Math.floor(Date.now() / 150) % 2;
            flashAttr = lightningCycle === 0 ? makeAttr(CYAN, BG_BLACK) : makeAttr(LIGHTCYAN, BG_BLUE);
            isFlashing = true;
        }
        if (hasStar) {
            var starColors = [LIGHTRED, YELLOW, LIGHTGREEN, LIGHTCYAN, LIGHTMAGENTA, WHITE];
            var starIndex = Math.floor(Date.now() / 80) % starColors.length;
            flashAttr = makeAttr(starColors[starIndex], BG_BLACK);
            isFlashing = true;
        }
        if (hasBullet) {
            var bulletCycle = Math.floor(Date.now() / 100) % 2;
            flashAttr = bulletCycle === 0 ? makeAttr(WHITE, BG_BLACK) : makeAttr(YELLOW, BG_BLACK);
            isFlashing = true;
        }
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
        if (this.activeTheme.name === 'glitch_circuit' && typeof GlitchState !== 'undefined') {
            this.applyGlitchEffects();
        }
        this.renderLightningBolts();
        this.cycle();
    };
    FrameRenderer.prototype.getComposer = function () {
        return this.composer;
    };
    FrameRenderer.prototype.applyGlitchEffects = function () {
        var roadFrame = this.frameManager.getRoadFrame();
        var groundFrame = this.frameManager.getGroundGridFrame();
        if (GlitchState.intensity > 0.2 && roadFrame) {
            for (var row = 0; row < this.height - this.horizonY; row++) {
                if (GlitchState.isNoiseRow(row)) {
                    var noiseAttr = makeAttr(Math.random() < 0.5 ? GREEN : LIGHTGREEN, BG_BLACK);
                    for (var x = 0; x < this.width; x++) {
                        if (Math.random() < 0.7) {
                            roadFrame.setData(x, row, GlitchState.getNoiseChar(), noiseAttr);
                        }
                    }
                }
            }
        }
        if (GlitchState.intensity > 0.4 && groundFrame) {
            var corruptRows = Math.floor(GlitchState.intensity * 3);
            for (var cr = 0; cr < corruptRows; cr++) {
                var corruptY = Math.floor(Math.random() * (this.height - this.horizonY));
                var corruptX = Math.floor(Math.random() * this.width);
                var corruptW = Math.floor(Math.random() * 20) + 5;
                var corruptedColor = GlitchState.corruptColor(GREEN, BG_BLACK);
                var corruptAttr = makeAttr(corruptedColor.fg, corruptedColor.bg);
                for (var cx = corruptX; cx < corruptX + corruptW && cx < this.width; cx++) {
                    groundFrame.setData(cx, corruptY, GlitchState.corruptChar('#'), corruptAttr);
                }
            }
        }
        if (Math.abs(GlitchState.tearOffset) > 0 && roadFrame) {
            var tearY = 5 + Math.floor(Math.random() * 8);
            var offset = GlitchState.tearOffset;
            var tearAttr = makeAttr(LIGHTCYAN, BG_BLACK);
            if (offset > 0) {
                for (var tx = 0; tx < Math.abs(offset); tx++) {
                    roadFrame.setData(tx, tearY, '>', tearAttr);
                }
            }
            else {
                for (var tx2 = this.width - Math.abs(offset); tx2 < this.width; tx2++) {
                    roadFrame.setData(tx2, tearY, '<', tearAttr);
                }
            }
        }
        if (GlitchState.intensity > 0.6 && roadFrame) {
            var numCorruptions = Math.floor(GlitchState.intensity * 10);
            for (var i = 0; i < numCorruptions; i++) {
                var rx = Math.floor(Math.random() * this.width);
                var ry = Math.floor(Math.random() * (this.height - this.horizonY));
                var glitchAttr = makeAttr([LIGHTGREEN, LIGHTCYAN, LIGHTRED, WHITE][Math.floor(Math.random() * 4)], BG_BLACK);
                roadFrame.setData(rx, ry, GlitchState.corruptChar('X'), glitchAttr);
            }
        }
        this.applySkyGlitchEffects();
    };
    FrameRenderer.prototype.applySkyGlitchEffects = function () {
        var mountainsFrame = this.frameManager.getMountainsFrame();
        var skyGridFrame = this.frameManager.getSkyGridFrame();
        switch (GlitchState.skyGlitchType) {
            case 1:
                if (skyGridFrame) {
                    var rainAttr = makeAttr(LIGHTGREEN, BG_BLACK);
                    var rainDimAttr = makeAttr(GREEN, BG_BLACK);
                    for (var d = 0; d < GlitchState.matrixRainDrops.length; d++) {
                        var drop = GlitchState.matrixRainDrops[d];
                        var dropY = Math.floor(drop.y);
                        if (dropY >= 0 && dropY < this.horizonY && drop.x >= 0 && drop.x < this.width) {
                            skyGridFrame.setData(drop.x, dropY, drop.char, rainAttr);
                            if (dropY > 0) {
                                skyGridFrame.setData(drop.x, dropY - 1, drop.char, rainDimAttr);
                            }
                        }
                    }
                }
                break;
            case 2:
                if (mountainsFrame) {
                    var binaryAttr = makeAttr(LIGHTGREEN, BG_BLACK);
                    var numBinary = 15 + Math.floor(GlitchState.intensity * 20);
                    for (var b = 0; b < numBinary; b++) {
                        var bx = Math.floor(Math.random() * this.width);
                        var by = Math.floor(Math.random() * this.horizonY);
                        var binaryChar = Math.random() < 0.5 ? '0' : '1';
                        mountainsFrame.setData(bx, by, binaryChar, binaryAttr);
                    }
                }
                break;
            case 3:
                if (skyGridFrame) {
                    var bsodBgAttr = makeAttr(WHITE, BG_BLUE);
                    var bsodTextAttr = makeAttr(WHITE, BG_BLUE);
                    var bsodHeight = 3 + Math.floor(Math.random() * 3);
                    var bsodY = Math.floor(Math.random() * (this.horizonY - bsodHeight));
                    for (var by2 = bsodY; by2 < bsodY + bsodHeight && by2 < this.horizonY; by2++) {
                        for (var bx2 = 10; bx2 < this.width - 10; bx2++) {
                            skyGridFrame.setData(bx2, by2, ' ', bsodBgAttr);
                        }
                    }
                    var errorMsgs = ['FATAL_ERROR', 'MEMORY_CORRUPT', 'REALITY.SYS', 'STACK_OVERFLOW', '0x0000DEAD'];
                    var msg = errorMsgs[Math.floor(Math.random() * errorMsgs.length)];
                    var msgX = Math.floor((this.width - msg.length) / 2);
                    for (var c = 0; c < msg.length; c++) {
                        if (msgX + c >= 0 && msgX + c < this.width) {
                            skyGridFrame.setData(msgX + c, bsodY + 1, msg[c], bsodTextAttr);
                        }
                    }
                }
                break;
            case 4:
                if (mountainsFrame) {
                    var staticColors = [LIGHTCYAN, LIGHTMAGENTA, YELLOW, WHITE];
                    var numStatic = 20 + Math.floor(GlitchState.intensity * 30);
                    for (var s = 0; s < numStatic; s++) {
                        var sx = Math.floor(Math.random() * this.width);
                        var sy = Math.floor(Math.random() * this.horizonY);
                        var staticAttr = makeAttr(staticColors[Math.floor(Math.random() * staticColors.length)], BG_BLACK);
                        var staticChars = [GLYPH.FULL_BLOCK, GLYPH.DARK_SHADE, GLYPH.MEDIUM_SHADE, '#', '%'];
                        mountainsFrame.setData(sx, sy, staticChars[Math.floor(Math.random() * staticChars.length)], staticAttr);
                    }
                }
                break;
        }
        if (GlitchState.intensity > 0.3 && mountainsFrame && Math.random() < 0.3) {
            var corruptX = Math.floor(Math.random() * this.width);
            var corruptY = Math.floor(Math.random() * this.horizonY);
            var corruptW = 3 + Math.floor(Math.random() * 8);
            var corruptH = 1 + Math.floor(Math.random() * 3);
            var corruptColors = [LIGHTGREEN, GREEN, LIGHTCYAN, CYAN];
            var corruptAttr2 = makeAttr(corruptColors[Math.floor(Math.random() * corruptColors.length)], BG_BLACK);
            for (var cy = corruptY; cy < corruptY + corruptH && cy < this.horizonY; cy++) {
                for (var cx = corruptX; cx < corruptX + corruptW && cx < this.width; cx++) {
                    if (Math.random() < 0.6) {
                        var glitchChars = ['/', '\\', '|', '-', '+', '#', '0', '1'];
                        mountainsFrame.setData(cx, cy, glitchChars[Math.floor(Math.random() * glitchChars.length)], corruptAttr2);
                    }
                }
            }
        }
        if (GlitchState.intensity > 0.5 && Math.random() < 0.2) {
            var sunFrame = this.frameManager.getSunFrame();
            if (sunFrame) {
                var flickerAttr = makeAttr(Math.random() < 0.5 ? BLACK : LIGHTGREEN, Math.random() < 0.3 ? BG_GREEN : BG_BLACK);
                for (var sf = 0; sf < 3; sf++) {
                    var sfx = Math.floor(Math.random() * 8) + 36;
                    var sfy = Math.floor(Math.random() * 4) + 2;
                    sunFrame.setData(sfx, sfy, GlitchState.getNoiseChar(), flickerAttr);
                }
            }
        }
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
    FrameRenderer.prototype.renderMonsterSilhouette = function () {
        var frame = this.frameManager.getSunFrame();
        if (!frame)
            return;
        var baseY = this.horizonY - 1;
        var mothraX = 24;
        var godzillaX = 56;
        var mothBody = makeAttr(BROWN, BG_BLACK);
        var mothWing = makeAttr(YELLOW, BG_BLACK);
        var mothWingLight = makeAttr(WHITE, BG_BROWN);
        var mothEye = makeAttr(LIGHTCYAN, BG_CYAN);
        frame.setData(mothraX - 3, baseY - 8, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX + 3, baseY - 8, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX - 2, baseY - 7, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX + 2, baseY - 7, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX - 2, baseY - 6, GLYPH.FULL_BLOCK, mothEye);
        frame.setData(mothraX - 1, baseY - 6, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX, baseY - 6, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX + 1, baseY - 6, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX + 2, baseY - 6, GLYPH.FULL_BLOCK, mothEye);
        for (var wx = mothraX - 12; wx <= mothraX - 3; wx++) {
            frame.setData(wx, baseY - 5, GLYPH.FULL_BLOCK, mothWing);
        }
        for (var wx = mothraX - 11; wx <= mothraX - 3; wx++) {
            frame.setData(wx, baseY - 4, GLYPH.FULL_BLOCK, (wx > mothraX - 9) ? mothWingLight : mothWing);
        }
        for (var wx = mothraX - 10; wx <= mothraX - 3; wx++) {
            frame.setData(wx, baseY - 3, GLYPH.FULL_BLOCK, (wx > mothraX - 8) ? mothWingLight : mothWing);
        }
        for (var wx = mothraX + 3; wx <= mothraX + 12; wx++) {
            frame.setData(wx, baseY - 5, GLYPH.FULL_BLOCK, mothWing);
        }
        for (var wx = mothraX + 3; wx <= mothraX + 11; wx++) {
            frame.setData(wx, baseY - 4, GLYPH.FULL_BLOCK, (wx < mothraX + 9) ? mothWingLight : mothWing);
        }
        for (var wx = mothraX + 3; wx <= mothraX + 10; wx++) {
            frame.setData(wx, baseY - 3, GLYPH.FULL_BLOCK, (wx < mothraX + 8) ? mothWingLight : mothWing);
        }
        frame.setData(mothraX - 2, baseY - 5, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX - 1, baseY - 5, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX, baseY - 5, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX + 1, baseY - 5, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX + 2, baseY - 5, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX - 1, baseY - 4, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX, baseY - 4, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX + 1, baseY - 4, GLYPH.FULL_BLOCK, mothBody);
        for (var wx = mothraX - 8; wx <= mothraX - 2; wx++) {
            frame.setData(wx, baseY - 2, GLYPH.FULL_BLOCK, mothWing);
        }
        for (var wx = mothraX - 6; wx <= mothraX - 2; wx++) {
            frame.setData(wx, baseY - 1, GLYPH.FULL_BLOCK, mothWing);
        }
        for (var wx = mothraX + 2; wx <= mothraX + 8; wx++) {
            frame.setData(wx, baseY - 2, GLYPH.FULL_BLOCK, mothWing);
        }
        for (var wx = mothraX + 2; wx <= mothraX + 6; wx++) {
            frame.setData(wx, baseY - 1, GLYPH.FULL_BLOCK, mothWing);
        }
        frame.setData(mothraX - 1, baseY - 3, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX, baseY - 3, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX + 1, baseY - 3, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX, baseY - 2, GLYPH.FULL_BLOCK, mothBody);
        frame.setData(mothraX, baseY - 1, GLYPH.FULL_BLOCK, mothBody);
        var godzBody = makeAttr(GREEN, BG_BLACK);
        var godzLight = makeAttr(LIGHTGREEN, BG_BLACK);
        var godzEye = makeAttr(LIGHTRED, BG_RED);
        var godzSpine = makeAttr(LIGHTCYAN, BG_CYAN);
        var godzBreath = makeAttr(LIGHTCYAN, BG_BLACK);
        frame.setData(godzillaX + 1, baseY - 10, GLYPH.FULL_BLOCK, godzSpine);
        frame.setData(godzillaX + 2, baseY - 9, GLYPH.FULL_BLOCK, godzSpine);
        frame.setData(godzillaX + 3, baseY - 10, GLYPH.FULL_BLOCK, godzSpine);
        frame.setData(godzillaX + 4, baseY - 9, GLYPH.FULL_BLOCK, godzSpine);
        frame.setData(godzillaX - 3, baseY - 9, GLYPH.UPPER_HALF, godzLight);
        frame.setData(godzillaX - 2, baseY - 9, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX - 1, baseY - 9, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX, baseY - 9, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX + 1, baseY - 9, GLYPH.UPPER_HALF, godzBody);
        frame.setData(godzillaX - 4, baseY - 8, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 3, baseY - 8, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX - 2, baseY - 8, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX - 1, baseY - 8, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX, baseY - 8, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX + 1, baseY - 8, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 5, baseY - 7, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 4, baseY - 7, GLYPH.FULL_BLOCK, godzEye);
        frame.setData(godzillaX - 3, baseY - 7, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX - 2, baseY - 7, GLYPH.FULL_BLOCK, godzEye);
        frame.setData(godzillaX - 1, baseY - 7, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX, baseY - 7, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 1, baseY - 7, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 7, baseY - 6, GLYPH.LEFT_HALF, godzBody);
        frame.setData(godzillaX - 6, baseY - 6, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 5, baseY - 6, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX - 4, baseY - 6, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX - 3, baseY - 6, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX - 2, baseY - 6, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 1, baseY - 6, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX, baseY - 6, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 8, baseY - 6, GLYPH.FULL_BLOCK, godzBreath);
        frame.setData(godzillaX - 9, baseY - 6, GLYPH.FULL_BLOCK, godzBreath);
        frame.setData(godzillaX - 10, baseY - 6, GLYPH.FULL_BLOCK, godzSpine);
        frame.setData(godzillaX - 11, baseY - 6, GLYPH.MEDIUM_SHADE, godzBreath);
        frame.setData(godzillaX - 10, baseY - 5, GLYPH.LIGHT_SHADE, godzBreath);
        frame.setData(godzillaX - 10, baseY - 7, GLYPH.LIGHT_SHADE, godzBreath);
        frame.setData(godzillaX - 3, baseY - 5, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 2, baseY - 5, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX - 1, baseY - 5, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX, baseY - 5, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX + 1, baseY - 5, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 2, baseY - 5, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 4, baseY - 4, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 3, baseY - 4, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 2, baseY - 4, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX - 1, baseY - 4, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX, baseY - 4, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX + 1, baseY - 4, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 2, baseY - 4, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 3, baseY - 4, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 6, baseY - 4, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 5, baseY - 4, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 3, baseY - 3, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 2, baseY - 3, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX - 1, baseY - 3, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX, baseY - 3, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX + 1, baseY - 3, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 2, baseY - 3, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 3, baseY - 2, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 2, baseY - 2, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX - 3, baseY - 1, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX - 2, baseY - 1, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 1, baseY - 2, GLYPH.FULL_BLOCK, godzLight);
        frame.setData(godzillaX + 2, baseY - 2, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 1, baseY - 1, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 2, baseY - 1, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 3, baseY - 3, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 4, baseY - 2, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 5, baseY - 2, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 6, baseY - 1, GLYPH.FULL_BLOCK, godzBody);
        frame.setData(godzillaX + 7, baseY - 1, GLYPH.RIGHT_HALF, godzBody);
    };
    FrameRenderer.prototype.renderMermaid = function () {
        var frame = this.frameManager.getSunFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var coreAttr = makeAttr(colors.celestialCore.fg, colors.celestialCore.bg);
        var glowAttr = makeAttr(colors.celestialGlow.fg, colors.celestialGlow.bg);
        var hairAttr = makeAttr(LIGHTMAGENTA, BG_BLUE);
        var tailAttr = makeAttr(LIGHTCYAN, BG_BLUE);
        var tailGlowAttr = makeAttr(CYAN, BG_BLUE);
        var posX = Math.floor(this.width * (this.activeTheme.celestial.positionX || 0.7));
        var posY = Math.floor(this.horizonY * (this.activeTheme.celestial.positionY || 0.4));
        frame.setData(posX - 5, posY - 2, '~', hairAttr);
        frame.setData(posX - 4, posY - 2, '~', hairAttr);
        frame.setData(posX - 3, posY - 1, '~', hairAttr);
        frame.setData(posX - 4, posY - 1, '~', hairAttr);
        frame.setData(posX - 5, posY, '~', hairAttr);
        frame.setData(posX - 4, posY, '~', hairAttr);
        frame.setData(posX - 3, posY, '~', hairAttr);
        frame.setData(posX - 2, posY - 1, '(', coreAttr);
        frame.setData(posX - 1, posY - 1, GLYPH.FULL_BLOCK, coreAttr);
        frame.setData(posX, posY - 1, ')', coreAttr);
        frame.setData(posX - 1, posY, GLYPH.FULL_BLOCK, coreAttr);
        frame.setData(posX, posY, GLYPH.FULL_BLOCK, coreAttr);
        frame.setData(posX + 1, posY, '\\', coreAttr);
        frame.setData(posX, posY + 1, GLYPH.FULL_BLOCK, glowAttr);
        frame.setData(posX + 1, posY + 1, GLYPH.FULL_BLOCK, tailAttr);
        frame.setData(posX + 2, posY + 1, GLYPH.FULL_BLOCK, tailAttr);
        frame.setData(posX + 3, posY + 1, GLYPH.FULL_BLOCK, tailAttr);
        frame.setData(posX + 4, posY, GLYPH.FULL_BLOCK, tailAttr);
        frame.setData(posX + 5, posY, GLYPH.FULL_BLOCK, tailAttr);
        frame.setData(posX + 6, posY - 1, GLYPH.FULL_BLOCK, tailAttr);
        frame.setData(posX + 7, posY - 2, '/', tailGlowAttr);
        frame.setData(posX + 7, posY - 1, GLYPH.FULL_BLOCK, tailGlowAttr);
        frame.setData(posX + 7, posY, '\\', tailGlowAttr);
        frame.setData(posX + 8, posY - 2, '/', tailGlowAttr);
        frame.setData(posX + 8, posY, '\\', tailGlowAttr);
        frame.setData(posX - 2, posY - 2, GLYPH.LIGHT_SHADE, glowAttr);
        frame.setData(posX + 1, posY - 2, GLYPH.LIGHT_SHADE, glowAttr);
        frame.setData(posX - 2, posY + 1, GLYPH.LIGHT_SHADE, glowAttr);
        frame.setData(posX + 2, posY + 2, GLYPH.LIGHT_SHADE, glowAttr);
    };
    FrameRenderer.prototype.renderUnderwaterBackground = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var rockAttr = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var rockLightAttr = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var kelpAttr = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
        var coralAttr = makeAttr(LIGHTMAGENTA, BG_BLUE);
        var coralYellowAttr = makeAttr(YELLOW, BG_BLUE);
        for (var y = 0; y < this.horizonY; y++) {
            var wallWidth = 6 - Math.floor(y * 0.5);
            for (var x = 0; x < wallWidth && x < 10; x++) {
                var char = (x === wallWidth - 1) ? GLYPH.RIGHT_HALF : GLYPH.FULL_BLOCK;
                var attr = ((x + y) % 3 === 0) ? rockLightAttr : rockAttr;
                frame.setData(x, y, char, attr);
            }
        }
        for (var y = 0; y < this.horizonY; y++) {
            var wallWidth = 5 - Math.floor(y * 0.4);
            for (var x = 0; x < wallWidth && x < 8; x++) {
                var rx = this.width - 1 - x;
                var char = (x === wallWidth - 1) ? GLYPH.LEFT_HALF : GLYPH.FULL_BLOCK;
                var attr = ((x + y) % 3 === 0) ? rockLightAttr : rockAttr;
                frame.setData(rx, y, char, attr);
            }
        }
        var kelpPositions = [12, 18, 25, 55, 62, 68];
        for (var i = 0; i < kelpPositions.length; i++) {
            var kx = kelpPositions[i];
            var kelpHeight = 3 + (i % 3);
            for (var ky = 0; ky < kelpHeight; ky++) {
                var y = this.horizonY - 1 - ky;
                if (y >= 0) {
                    var kchar = (ky % 2 === 0) ? ')' : '(';
                    frame.setData(kx, y, kchar, kelpAttr);
                    if (i % 2 === 0 && kx + 1 < this.width) {
                        frame.setData(kx + 1, y, (ky % 2 === 0) ? '(' : ')', kelpAttr);
                    }
                }
            }
        }
        var coralPositions = [8, 22, 35, 48, 58, 72];
        for (var i = 0; i < coralPositions.length; i++) {
            var cx = coralPositions[i];
            var y = this.horizonY - 1;
            var attr = (i % 2 === 0) ? coralAttr : coralYellowAttr;
            frame.setData(cx, y, '*', attr);
            frame.setData(cx + 1, y, 'Y', attr);
            frame.setData(cx + 2, y, '*', attr);
            if (y - 1 >= 0) {
                frame.setData(cx + 1, y - 1, '^', attr);
            }
        }
        var bubblePositions = [[30, 2], [45, 3], [50, 1], [15, 4], [65, 2]];
        for (var i = 0; i < bubblePositions.length; i++) {
            var bx = bubblePositions[i][0];
            var by = bubblePositions[i][1];
            frame.setData(bx, by, 'o', makeAttr(WHITE, BG_BLUE));
        }
    };
    FrameRenderer.prototype.renderAquariumBackground = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var glassFrameAttr = makeAttr(LIGHTGRAY, BG_BLACK);
        var glassHighlightAttr = makeAttr(WHITE, BG_BLACK);
        var glassDarkAttr = makeAttr(DARKGRAY, BG_BLACK);
        var waterAttr = makeAttr(CYAN, BG_BLUE);
        var waterDeepAttr = makeAttr(BLUE, BG_BLUE);
        var coralAttr = makeAttr(LIGHTRED, BG_BLUE);
        var coralYellowAttr = makeAttr(YELLOW, BG_BLUE);
        var plantAttr = makeAttr(LIGHTGREEN, BG_BLUE);
        var sandAttr = makeAttr(YELLOW, BG_BLUE);
        var rockAttr = makeAttr(DARKGRAY, BG_BLUE);
        var mermaidSkinAttr = makeAttr(LIGHTMAGENTA, BG_BLUE);
        var mermaidHairAttr = makeAttr(LIGHTRED, BG_BLUE);
        var mermaidTailAttr = makeAttr(LIGHTCYAN, BG_BLUE);
        var mermaidTailGlowAttr = makeAttr(CYAN, BG_BLUE);
        for (var y = 0; y < this.horizonY; y++) {
            frame.setData(0, y, GLYPH.FULL_BLOCK, glassDarkAttr);
            frame.setData(1, y, GLYPH.FULL_BLOCK, glassFrameAttr);
            frame.setData(2, y, GLYPH.LIGHT_SHADE, glassHighlightAttr);
            for (var x = 3; x < 7; x++) {
                frame.setData(x, y, GLYPH.FULL_BLOCK, glassFrameAttr);
            }
            frame.setData(7, y, GLYPH.RIGHT_HALF, glassFrameAttr);
        }
        for (var y = 0; y < this.horizonY; y++) {
            frame.setData(72, y, GLYPH.LEFT_HALF, glassFrameAttr);
            for (var x = 73; x < 77; x++) {
                frame.setData(x, y, GLYPH.FULL_BLOCK, glassFrameAttr);
            }
            frame.setData(77, y, GLYPH.LIGHT_SHADE, glassHighlightAttr);
            frame.setData(78, y, GLYPH.FULL_BLOCK, glassFrameAttr);
            frame.setData(79, y, GLYPH.FULL_BLOCK, glassDarkAttr);
        }
        for (var y = 0; y < this.horizonY; y++) {
            for (var x = 8; x < 72; x++) {
                var attr = (y < 4) ? waterAttr : waterDeepAttr;
                frame.setData(x, y, ' ', attr);
            }
        }
        var bottomY = this.horizonY - 1;
        for (var x = 8; x < 72; x++) {
            var sandChar = (x % 3 === 0) ? GLYPH.LOWER_HALF : GLYPH.LIGHT_SHADE;
            frame.setData(x, bottomY, sandChar, sandAttr);
        }
        var rockPositions = [12, 25, 45, 62];
        for (var i = 0; i < rockPositions.length; i++) {
            var rx = rockPositions[i];
            frame.setData(rx, bottomY, GLYPH.FULL_BLOCK, rockAttr);
            frame.setData(rx + 1, bottomY, GLYPH.FULL_BLOCK, rockAttr);
            if (bottomY - 1 >= 0) {
                frame.setData(rx, bottomY - 1, GLYPH.LOWER_HALF, rockAttr);
            }
        }
        var coralPositions = [15, 32, 50, 65];
        for (var i = 0; i < coralPositions.length; i++) {
            var cx = coralPositions[i];
            var attr = (i % 2 === 0) ? coralAttr : coralYellowAttr;
            frame.setData(cx, bottomY, 'Y', attr);
            frame.setData(cx + 1, bottomY, '*', attr);
            frame.setData(cx + 2, bottomY, 'Y', attr);
            if (bottomY - 1 >= 0) {
                frame.setData(cx + 1, bottomY - 1, '^', attr);
            }
            if (bottomY - 2 >= 0) {
                frame.setData(cx + 1, bottomY - 2, '*', attr);
            }
        }
        var kelpLeft = [10, 14, 18];
        var kelpRight = [58, 62, 68];
        var kelpPositions = kelpLeft.concat(kelpRight);
        for (var i = 0; i < kelpPositions.length; i++) {
            var kx = kelpPositions[i];
            for (var ky = 0; ky < 4; ky++) {
                var y = bottomY - 1 - ky;
                if (y >= 0) {
                    var kchar = (ky % 2 === 0) ? ')' : '(';
                    frame.setData(kx, y, kchar, plantAttr);
                }
            }
        }
        var mermaidX = 38;
        var mermaidY = 5;
        frame.setData(mermaidX - 6, mermaidY - 1, '~', mermaidHairAttr);
        frame.setData(mermaidX - 5, mermaidY - 1, '~', mermaidHairAttr);
        frame.setData(mermaidX - 4, mermaidY - 1, '~', mermaidHairAttr);
        frame.setData(mermaidX - 5, mermaidY, '~', mermaidHairAttr);
        frame.setData(mermaidX - 4, mermaidY, '~', mermaidHairAttr);
        frame.setData(mermaidX - 3, mermaidY, '~', mermaidHairAttr);
        frame.setData(mermaidX - 4, mermaidY + 1, '~', mermaidHairAttr);
        frame.setData(mermaidX - 3, mermaidY + 1, '~', mermaidHairAttr);
        frame.setData(mermaidX - 2, mermaidY, '(', mermaidSkinAttr);
        frame.setData(mermaidX - 1, mermaidY, GLYPH.FULL_BLOCK, mermaidSkinAttr);
        frame.setData(mermaidX, mermaidY, ')', mermaidSkinAttr);
        frame.setData(mermaidX - 1, mermaidY + 1, GLYPH.FULL_BLOCK, mermaidSkinAttr);
        frame.setData(mermaidX, mermaidY + 1, GLYPH.FULL_BLOCK, mermaidSkinAttr);
        frame.setData(mermaidX + 1, mermaidY + 1, '\\', mermaidSkinAttr);
        frame.setData(mermaidX, mermaidY + 2, GLYPH.FULL_BLOCK, mermaidTailAttr);
        frame.setData(mermaidX + 1, mermaidY + 2, GLYPH.FULL_BLOCK, mermaidTailAttr);
        frame.setData(mermaidX + 2, mermaidY + 2, GLYPH.FULL_BLOCK, mermaidTailAttr);
        frame.setData(mermaidX + 3, mermaidY + 2, GLYPH.FULL_BLOCK, mermaidTailAttr);
        frame.setData(mermaidX + 4, mermaidY + 1, GLYPH.FULL_BLOCK, mermaidTailAttr);
        frame.setData(mermaidX + 5, mermaidY + 1, GLYPH.FULL_BLOCK, mermaidTailAttr);
        frame.setData(mermaidX + 6, mermaidY, GLYPH.FULL_BLOCK, mermaidTailAttr);
        frame.setData(mermaidX + 7, mermaidY - 1, '/', mermaidTailGlowAttr);
        frame.setData(mermaidX + 7, mermaidY, GLYPH.FULL_BLOCK, mermaidTailGlowAttr);
        frame.setData(mermaidX + 7, mermaidY + 1, '\\', mermaidTailGlowAttr);
        frame.setData(mermaidX + 8, mermaidY - 1, '/', mermaidTailGlowAttr);
        frame.setData(mermaidX + 8, mermaidY + 1, '\\', mermaidTailGlowAttr);
        var fishAttr = makeAttr(YELLOW, BG_BLUE);
        frame.setData(mermaidX - 8, mermaidY + 3, '<', fishAttr);
        frame.setData(mermaidX - 7, mermaidY + 3, '>', fishAttr);
        frame.setData(mermaidX + 12, mermaidY - 2, '<', makeAttr(LIGHTRED, BG_BLUE));
        frame.setData(mermaidX + 13, mermaidY - 2, '>', makeAttr(LIGHTRED, BG_BLUE));
        frame.setData(mermaidX + 2, mermaidY - 2, 'o', makeAttr(WHITE, BG_BLUE));
        frame.setData(mermaidX + 3, mermaidY - 3, '.', makeAttr(WHITE, BG_BLUE));
        frame.setData(20, 3, 'o', makeAttr(WHITE, BG_BLUE));
        frame.setData(55, 2, 'o', makeAttr(WHITE, BG_BLUE));
    };
    FrameRenderer.prototype.renderANSITunnelStatic = function () {
        var mtnsFrame = this.frameManager.getMountainsFrame();
        if (mtnsFrame) {
            mtnsFrame.clear();
        }
        var sunFrame = this.frameManager.getSunFrame();
        if (sunFrame) {
            sunFrame.clear();
        }
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
    FrameRenderer.prototype.renderJungleCanopy = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var leafDark = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var leafLight = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var vineAttr = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
        var canopyHeight = Math.min(this.horizonY - 1, 7);
        for (var x = 0; x < this.width; x++) {
            var hash = (x * 23 + 7) % 17;
            var topY = this.horizonY - canopyHeight + (hash % 3);
            for (var y = topY; y < this.horizonY; y++) {
                var depth = y - topY;
                var leafChar;
                if (depth === 0) {
                    leafChar = ((x + hash) % 3 === 0) ? '@' : ((x % 2 === 0) ? 'O' : 'o');
                    frame.setData(x, y, leafChar, leafLight);
                }
                else if (depth < 2) {
                    leafChar = ((x + depth) % 2 === 0) ? GLYPH.MEDIUM_SHADE : GLYPH.DARK_SHADE;
                    frame.setData(x, y, leafChar, leafDark);
                }
                else {
                    if ((x * 13 + depth * 7) % 5 !== 0) {
                        leafChar = GLYPH.LIGHT_SHADE;
                        frame.setData(x, y, leafChar, leafDark);
                    }
                }
            }
        }
        for (var vineX = 3; vineX < this.width - 3; vineX += 7 + ((vineX * 11) % 5)) {
            var vineLength = 2 + ((vineX * 7) % 4);
            var vineStartY = this.horizonY - canopyHeight + 2;
            for (var vy = 0; vy < vineLength && vineStartY + vy < this.horizonY; vy++) {
                var vineChar = (vy === vineLength - 1) ? ')' : '|';
                frame.setData(vineX, vineStartY + vy, vineChar, vineAttr);
            }
        }
        for (var fx = 5; fx < this.width - 5; fx += 11 + ((fx * 3) % 7)) {
            var fy = this.horizonY - canopyHeight + 1 + ((fx * 5) % 2);
            if (fy < this.horizonY - 1) {
                frame.setData(fx, fy, '*', makeAttr(LIGHTMAGENTA, BG_BLACK));
            }
        }
    };
    FrameRenderer.prototype.renderCandyHills = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var hill1 = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var hill2 = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var sparkle = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
        var hills = [
            { centerX: 12, height: 4, width: 20, color: hill1 },
            { centerX: 35, height: 5, width: 24, color: hill2 },
            { centerX: 58, height: 3, width: 18, color: hill1 },
            { centerX: 75, height: 4, width: 16, color: hill2 }
        ];
        for (var i = 0; i < hills.length; i++) {
            var hill = hills[i];
            for (var dx = -hill.width / 2; dx <= hill.width / 2; dx++) {
                var x = Math.floor(hill.centerX + dx);
                if (x < 0 || x >= this.width)
                    continue;
                var t = dx / (hill.width / 2);
                var hillHeight = Math.round(hill.height * Math.cos(t * Math.PI / 2));
                for (var h = 0; h < hillHeight; h++) {
                    var y = this.horizonY - 1 - h;
                    if (y < 0)
                        continue;
                    var char;
                    if (h === hillHeight - 1) {
                        char = (Math.abs(dx) < hill.width / 4) ? '@' : 'o';
                    }
                    else {
                        char = ((x + h) % 3 === 0) ? '~' : GLYPH.MEDIUM_SHADE;
                    }
                    frame.setData(x, y, char, hill.color);
                }
            }
        }
        for (var sx = 2; sx < this.width - 2; sx += 5 + ((sx * 7) % 4)) {
            var sy = this.horizonY - 2 - ((sx * 3) % 3);
            if (sy > 0) {
                frame.setData(sx, sy, '*', sparkle);
            }
        }
    };
    FrameRenderer.prototype.renderNebula = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var nebula1 = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var nebula2 = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var starAttr = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
        var clouds = [
            { x: 5, y: this.horizonY - 5, w: 15, h: 4 },
            { x: 25, y: this.horizonY - 7, w: 20, h: 5 },
            { x: 50, y: this.horizonY - 4, w: 12, h: 3 },
            { x: 65, y: this.horizonY - 6, w: 14, h: 4 }
        ];
        for (var c = 0; c < clouds.length; c++) {
            var cloud = clouds[c];
            var cloudAttr = (c % 2 === 0) ? nebula1 : nebula2;
            for (var cy = 0; cy < cloud.h; cy++) {
                for (var cx = 0; cx < cloud.w; cx++) {
                    var px = cloud.x + cx;
                    var py = cloud.y + cy;
                    if (px < 0 || px >= this.width || py < 0 || py >= this.horizonY)
                        continue;
                    var distFromCenter = Math.abs(cx - cloud.w / 2) / (cloud.w / 2) +
                        Math.abs(cy - cloud.h / 2) / (cloud.h / 2);
                    var density = 1 - distFromCenter * 0.6;
                    var hash = (px * 17 + py * 31) % 100;
                    if (hash < density * 80) {
                        var char;
                        if (density > 0.7) {
                            char = GLYPH.MEDIUM_SHADE;
                        }
                        else if (density > 0.4) {
                            char = GLYPH.LIGHT_SHADE;
                        }
                        else {
                            char = '.';
                        }
                        frame.setData(px, py, char, cloudAttr);
                    }
                }
            }
        }
        for (var sx = 1; sx < this.width - 1; sx += 8 + ((sx * 5) % 6)) {
            var sy = ((sx * 13) % (this.horizonY - 2)) + 1;
            if (sy > 0 && sy < this.horizonY - 1) {
                frame.setData(sx, sy, '*', starAttr);
            }
        }
    };
    FrameRenderer.prototype.renderCastleFortress = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var stone = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var window = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var torch = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
        var sections = [
            { type: 'tower', x: 5, h: 7, w: 5 },
            { type: 'wall', x: 10, h: 4, w: 12 },
            { type: 'tower', x: 22, h: 8, w: 6 },
            { type: 'wall', x: 28, h: 4, w: 15 },
            { type: 'tower', x: 43, h: 6, w: 5 },
            { type: 'gate', x: 48, h: 5, w: 8 },
            { type: 'tower', x: 56, h: 7, w: 5 },
            { type: 'wall', x: 61, h: 4, w: 10 },
            { type: 'tower', x: 71, h: 5, w: 5 }
        ];
        for (var i = 0; i < sections.length; i++) {
            var sec = sections[i];
            var baseY = this.horizonY - 1;
            if (sec.type === 'tower') {
                for (var h = 0; h < sec.h; h++) {
                    var y = baseY - h;
                    if (y < 0)
                        continue;
                    for (var dx = 0; dx < sec.w; dx++) {
                        var x = sec.x + dx;
                        if (x >= this.width)
                            continue;
                        if (h === sec.h - 1) {
                            frame.setData(x, y, (dx % 2 === 0) ? GLYPH.FULL_BLOCK : ' ', stone);
                        }
                        else if (h === sec.h - 2 && dx === Math.floor(sec.w / 2)) {
                            frame.setData(x, y, '.', window);
                        }
                        else if (h === 1 && dx === Math.floor(sec.w / 2)) {
                            frame.setData(x, y, '*', torch);
                        }
                        else {
                            frame.setData(x, y, GLYPH.FULL_BLOCK, stone);
                        }
                    }
                }
                var roofX = sec.x + Math.floor(sec.w / 2);
                frame.setData(roofX, baseY - sec.h, GLYPH.TRIANGLE_UP, stone);
            }
            else if (sec.type === 'wall') {
                for (var h = 0; h < sec.h; h++) {
                    var y = baseY - h;
                    if (y < 0)
                        continue;
                    for (var dx = 0; dx < sec.w; dx++) {
                        var x = sec.x + dx;
                        if (x >= this.width)
                            continue;
                        if (h === sec.h - 1) {
                            frame.setData(x, y, (dx % 3 === 0) ? GLYPH.FULL_BLOCK : ' ', stone);
                        }
                        else {
                            frame.setData(x, y, GLYPH.MEDIUM_SHADE, stone);
                        }
                    }
                }
            }
            else if (sec.type === 'gate') {
                for (var h = 0; h < sec.h; h++) {
                    var y = baseY - h;
                    if (y < 0)
                        continue;
                    for (var dx = 0; dx < sec.w; dx++) {
                        var x = sec.x + dx;
                        if (x >= this.width)
                            continue;
                        var inArch = (dx > 1 && dx < sec.w - 2 && h < sec.h - 2);
                        if (inArch) {
                            frame.setData(x, y, (h % 2 === 0) ? '-' : '#', stone);
                        }
                        else {
                            frame.setData(x, y, GLYPH.FULL_BLOCK, stone);
                        }
                    }
                }
            }
        }
    };
    FrameRenderer.prototype.renderVolcanic = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var rock = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var lava = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var smoke = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
        var peaks = [
            { x: 8, h: 5, w: 14, hasLava: false },
            { x: 28, h: 8, w: 20, hasLava: true },
            { x: 55, h: 6, w: 16, hasLava: true },
            { x: 72, h: 4, w: 10, hasLava: false }
        ];
        for (var i = 0; i < peaks.length; i++) {
            var peak = peaks[i];
            var peakX = peak.x + Math.floor(peak.w / 2);
            for (var h = 0; h < peak.h; h++) {
                var y = this.horizonY - 1 - h;
                if (y < 0)
                    continue;
                var rowWidth = Math.floor((peak.h - h) * peak.w / peak.h / 2);
                for (var dx = -rowWidth; dx <= rowWidth; dx++) {
                    var x = peakX + dx;
                    if (x < 0 || x >= this.width)
                        continue;
                    var edgeDist = Math.abs(dx) - rowWidth + 1;
                    if (edgeDist >= 0 && ((x * 7 + h * 3) % 3 === 0)) {
                        continue;
                    }
                    var char;
                    if (h === peak.h - 1 && peak.hasLava) {
                        char = '^';
                        frame.setData(x, y, char, lava);
                    }
                    else if (dx < 0) {
                        char = '/';
                        frame.setData(x, y, char, rock);
                    }
                    else if (dx > 0) {
                        char = '\\';
                        frame.setData(x, y, char, rock);
                    }
                    else {
                        char = GLYPH.BOX_V;
                        frame.setData(x, y, char, rock);
                    }
                }
            }
            if (peak.hasLava) {
                var craterY = this.horizonY - peak.h;
                if (craterY >= 0) {
                    frame.setData(peakX - 1, craterY, '*', lava);
                    frame.setData(peakX, craterY, GLYPH.FULL_BLOCK, lava);
                    frame.setData(peakX + 1, craterY, '*', lava);
                }
                for (var sy = 1; sy <= 2; sy++) {
                    var smokeY = craterY - sy;
                    if (smokeY >= 0) {
                        frame.setData(peakX + (sy % 2), smokeY, '~', smoke);
                        frame.setData(peakX - (sy % 2), smokeY, '~', smoke);
                    }
                }
            }
        }
        for (var lx = 0; lx < this.width; lx += 12 + ((lx * 5) % 7)) {
            var ly = this.horizonY - 1;
            frame.setData(lx, ly, '~', lava);
            if (lx + 1 < this.width)
                frame.setData(lx + 1, ly, '*', lava);
        }
    };
    FrameRenderer.prototype.renderPyramids = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var stone = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var gold = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var pyramids = [
            { x: 15, h: 6 },
            { x: 40, h: 8 },
            { x: 62, h: 5 }
        ];
        for (var i = 0; i < pyramids.length; i++) {
            var pyr = pyramids[i];
            var baseY = this.horizonY - 1;
            for (var h = 0; h < pyr.h; h++) {
                var y = baseY - h;
                if (y < 0)
                    continue;
                var halfWidth = pyr.h - h - 1;
                for (var dx = -halfWidth; dx <= halfWidth; dx++) {
                    var x = pyr.x + dx;
                    if (x < 0 || x >= this.width)
                        continue;
                    var char;
                    var attr = stone;
                    if (h === pyr.h - 1) {
                        char = GLYPH.TRIANGLE_UP;
                        attr = gold;
                    }
                    else if (dx === -halfWidth) {
                        char = '/';
                    }
                    else if (dx === halfWidth) {
                        char = '\\';
                    }
                    else {
                        char = ((h + dx) % 4 === 0) ? '-' : GLYPH.LIGHT_SHADE;
                    }
                    frame.setData(x, y, char, attr);
                }
            }
        }
        var sphinxX = 2;
        var sphinxY = this.horizonY - 1;
        frame.setData(sphinxX, sphinxY, GLYPH.MEDIUM_SHADE, stone);
        frame.setData(sphinxX + 1, sphinxY, GLYPH.MEDIUM_SHADE, stone);
        frame.setData(sphinxX + 2, sphinxY, GLYPH.MEDIUM_SHADE, stone);
        frame.setData(sphinxX + 3, sphinxY, '_', stone);
        frame.setData(sphinxX, sphinxY - 1, ')', stone);
        frame.setData(sphinxX + 1, sphinxY - 1, GLYPH.FULL_BLOCK, stone);
        frame.setData(sphinxX + 1, sphinxY - 2, GLYPH.TRIANGLE_UP, gold);
        var obeliskPositions = [28, 52, 75];
        for (var oi = 0; oi < obeliskPositions.length; oi++) {
            var ox = obeliskPositions[oi];
            frame.setData(ox, this.horizonY - 1, '|', stone);
            frame.setData(ox, this.horizonY - 2, '|', stone);
            frame.setData(ox, this.horizonY - 3, GLYPH.TRIANGLE_UP, gold);
        }
    };
    FrameRenderer.prototype.renderDunes = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var sandLight = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var sandDark = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        for (var x = 0; x < this.width; x++) {
            var wave1 = Math.sin(x * 0.08) * 2;
            var wave2 = Math.sin(x * 0.15 + 1) * 1.5;
            var wave3 = Math.sin(x * 0.04 + 2) * 2.5;
            var duneHeight = Math.round(2 + wave1 + wave2 + wave3);
            for (var h = 0; h < duneHeight; h++) {
                var y = this.horizonY - 1 - h;
                if (y < 0)
                    continue;
                var char;
                var attr = (h % 2 === 0) ? sandLight : sandDark;
                if (h === duneHeight - 1) {
                    char = '~';
                }
                else {
                    char = GLYPH.LIGHT_SHADE;
                }
                frame.setData(x, y, char, attr);
            }
        }
    };
    FrameRenderer.prototype.renderStadium = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var colors = this.activeTheme.colors;
        var structure = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
        var lights = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
        var crowd1 = makeAttr(LIGHTRED, BG_BLACK);
        var crowd2 = makeAttr(YELLOW, BG_BLACK);
        var crowd3 = makeAttr(LIGHTCYAN, BG_BLACK);
        var crowdColors = [crowd1, crowd2, crowd3];
        this.drawGrandstand(frame, 0, 18, structure, crowdColors);
        this.drawGrandstand(frame, 62, 18, structure, crowdColors);
        this.drawScoreboard(frame, 30, lights, structure);
        this.drawFloodlight(frame, 20, lights, structure);
        this.drawFloodlight(frame, 59, lights, structure);
        for (var beamX = 22; beamX < 28; beamX++) {
            for (var beamY = 4; beamY < this.horizonY - 2; beamY += 3) {
                frame.setData(beamX, beamY, '|', makeAttr(YELLOW, BG_BLACK));
            }
        }
        for (var beamX2 = 52; beamX2 < 58; beamX2++) {
            for (var beamY2 = 4; beamY2 < this.horizonY - 2; beamY2 += 3) {
                frame.setData(beamX2, beamY2, '|', makeAttr(YELLOW, BG_BLACK));
            }
        }
    };
    FrameRenderer.prototype.drawGrandstand = function (frame, startX, width, structure, crowdColors) {
        var standHeight = 6;
        for (var tier = 0; tier < standHeight; tier++) {
            var y = this.horizonY - 1 - tier;
            if (y < 0)
                continue;
            var tierWidth = width - tier * 2;
            var tierStart = startX + tier;
            for (var x = tierStart; x < tierStart + tierWidth && x < this.width; x++) {
                if (x < 0)
                    continue;
                if (tier === 0) {
                    frame.setData(x, y, '=', structure);
                }
                else if (x === tierStart || x === tierStart + tierWidth - 1) {
                    frame.setData(x, y, GLYPH.FULL_BLOCK, structure);
                }
                else {
                    var colorIdx = (x * 3 + tier * 7) % crowdColors.length;
                    var crowdChars = ['o', 'O', '@', 'o', '*'];
                    var charIdx = (x * 5 + tier * 11) % crowdChars.length;
                    frame.setData(x, y, crowdChars[charIdx], crowdColors[colorIdx]);
                }
            }
        }
        var roofY = this.horizonY - 1 - standHeight;
        if (roofY >= 0) {
            for (var rx = startX + standHeight; rx < startX + width - standHeight && rx < this.width; rx++) {
                if (rx >= 0) {
                    frame.setData(rx, roofY, '_', structure);
                }
            }
        }
    };
    FrameRenderer.prototype.drawScoreboard = function (frame, centerX, lights, structure) {
        var boardWidth = 20;
        var boardHeight = 4;
        var boardTop = 1;
        var startX = centerX - Math.floor(boardWidth / 2);
        for (var y = boardTop; y < boardTop + boardHeight; y++) {
            for (var x = startX; x < startX + boardWidth; x++) {
                if (x < 0 || x >= this.width)
                    continue;
                if (y === boardTop || y === boardTop + boardHeight - 1) {
                    frame.setData(x, y, '-', structure);
                }
                else if (x === startX || x === startX + boardWidth - 1) {
                    frame.setData(x, y, '|', structure);
                }
                else {
                    var displayChars = [GLYPH.FULL_BLOCK, GLYPH.DARK_SHADE, GLYPH.MEDIUM_SHADE];
                    var charIdx = (x + y * 3) % displayChars.length;
                    frame.setData(x, y, displayChars[charIdx], lights);
                }
            }
        }
        var poleY1 = boardTop + boardHeight;
        var poleY2 = this.horizonY - 1;
        for (var py = poleY1; py < poleY2; py++) {
            frame.setData(startX + 3, py, '|', structure);
            frame.setData(startX + boardWidth - 4, py, '|', structure);
        }
    };
    FrameRenderer.prototype.drawFloodlight = function (frame, centerX, lights, structure) {
        for (var y = 0; y < this.horizonY - 1; y++) {
            frame.setData(centerX, y, '|', structure);
        }
        var lightBank = ['[', '*', '*', '*', ']'];
        for (var i = 0; i < lightBank.length; i++) {
            var lx = centerX - 2 + i;
            if (lx >= 0 && lx < this.width) {
                frame.setData(lx, 0, lightBank[i], lights);
            }
        }
        for (var i2 = 0; i2 < 3; i2++) {
            var lx2 = centerX - 1 + i2;
            if (lx2 >= 0 && lx2 < this.width) {
                frame.setData(lx2, 1, '*', lights);
            }
        }
    };
    FrameRenderer.prototype.renderDestroyedCity = function () {
        var frame = this.frameManager.getMountainsFrame();
        if (!frame)
            return;
        var fire = makeAttr(LIGHTRED, BG_BLACK);
        var fireGlow = makeAttr(YELLOW, BG_BLACK);
        var heli = makeAttr(GREEN, BG_BLACK);
        var tracer = makeAttr(YELLOW, BG_BLACK);
        this.drawSimpleHelicopter(frame, 70, 3, heli);
        frame.setData(67, 4, '-', tracer);
        frame.setData(65, 4, '-', tracer);
        frame.setData(63, 4, '-', tracer);
        frame.setData(61, 5, '*', fire);
        this.drawSimpleHelicopter(frame, 75, 6, heli);
        this.drawSimpleBuilding(frame, 2, 6, 3, true);
        this.drawSimpleBuilding(frame, 7, 8, 3, false);
        this.drawSimpleBuilding(frame, 12, 5, 3, true);
        this.drawSimpleBuilding(frame, 62, 7, 3, true);
        this.drawSimpleBuilding(frame, 68, 9, 4, true);
        frame.setData(70, this.horizonY - 10, '^', fireGlow);
        frame.setData(70, this.horizonY - 11, '*', fire);
        this.drawSimpleBuilding(frame, 74, 6, 3, false);
        frame.setData(5, this.horizonY - 1, '^', fireGlow);
        frame.setData(5, this.horizonY - 2, '*', fire);
        frame.setData(72, this.horizonY - 1, '^', fireGlow);
        frame.setData(72, this.horizonY - 2, '*', fire);
    };
    FrameRenderer.prototype.drawSimpleHelicopter = function (frame, x, y, attr) {
        frame.setData(x - 1, y - 1, '-', attr);
        frame.setData(x, y - 1, '+', attr);
        frame.setData(x + 1, y - 1, '-', attr);
        frame.setData(x - 1, y, '<', attr);
        frame.setData(x, y, GLYPH.FULL_BLOCK, attr);
        frame.setData(x + 1, y, GLYPH.FULL_BLOCK, attr);
        frame.setData(x + 2, y, '-', attr);
        frame.setData(x + 3, y, '>', attr);
    };
    FrameRenderer.prototype.drawSimpleBuilding = function (frame, x, height, width, damaged) {
        var building = makeAttr(DARKGRAY, BG_BLACK);
        var window = makeAttr(BLACK, BG_BLACK);
        var baseY = this.horizonY - 1;
        for (var h = 0; h < height; h++) {
            var y = baseY - h;
            if (y < 0)
                continue;
            if (damaged && h >= height - 1) {
                for (var w = 0; w < width; w++) {
                    if ((x + w) % 2 === 0) {
                        frame.setData(x + w, y, GLYPH.DARK_SHADE, building);
                    }
                }
            }
            else {
                for (var w = 0; w < width; w++) {
                    if (h % 2 === 1 && w > 0 && w < width - 1) {
                        frame.setData(x + w, y, GLYPH.MEDIUM_SHADE, window);
                    }
                    else {
                        frame.setData(x + w, y, GLYPH.FULL_BLOCK, building);
                    }
                }
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
    FrameRenderer.prototype.renderSkyGrid = function (speed, dt) {
        var frame = this.frameManager.getSkyGridFrame();
        if (!frame)
            return;
        frame.clear();
        if (speed > 1) {
            this._skyGridAnimPhase -= speed * dt * 0.004;
            while (this._skyGridAnimPhase < 0)
                this._skyGridAnimPhase += 1;
            while (this._skyGridAnimPhase >= 1)
                this._skyGridAnimPhase -= 1;
        }
        var colors = this.activeTheme.colors;
        var gridAttr = makeAttr(colors.skyGrid.fg, colors.skyGrid.bg);
        var glowAttr = makeAttr(colors.skyGridGlow.fg, colors.skyGridGlow.bg);
        var vanishX = 40;
        for (var y = this.horizonY - 1; y >= 1; y--) {
            var distFromHorizon = this.horizonY - y;
            var spread = distFromHorizon * 6;
            if (this.activeTheme.sky.converging) {
                for (var offset = 0; offset <= 40; offset += 8) {
                    if (offset <= spread) {
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
            }
            if (this.activeTheme.sky.horizontal) {
                var scanlinePhase = (this._skyGridAnimPhase + distFromHorizon * 0.25) % 1;
                if (scanlinePhase < 0)
                    scanlinePhase += 1;
                if (scanlinePhase < 0.33) {
                    var lineSpread = Math.min(spread, 39);
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
    FrameRenderer.prototype.renderSkyWater = function (trackPosition, speed, dt) {
        var frame = this.frameManager.getSkyGridFrame();
        if (!frame)
            return;
        frame.clear();
        if (speed > 1) {
            this._skyGridAnimPhase += dt * 2.0;
            while (this._skyGridAnimPhase >= 1)
                this._skyGridAnimPhase -= 1;
        }
        var deepAttr = makeAttr(BLUE, BG_BLUE);
        var midAttr = makeAttr(CYAN, BG_BLUE);
        var surfaceAttr = makeAttr(LIGHTCYAN, BG_CYAN);
        var waveAttr = makeAttr(WHITE, BG_CYAN);
        var bubbleAttr = makeAttr(WHITE, BG_BLUE);
        var lightrayAttr = makeAttr(LIGHTCYAN, BG_BLUE);
        var fish1Attr = makeAttr(YELLOW, BG_BLUE);
        var fish2Attr = makeAttr(LIGHTRED, BG_BLUE);
        var fish3Attr = makeAttr(LIGHTGREEN, BG_BLUE);
        var surfaceZone = 3;
        var lightZone = Math.floor(this.horizonY * 0.5);
        for (var y = 0; y < this.horizonY; y++) {
            var attr;
            var baseChars;
            if (y < surfaceZone) {
                attr = surfaceAttr;
                baseChars = ['~', '~', GLYPH.UPPER_HALF, '~', GLYPH.LOWER_HALF, '~'];
            }
            else if (y < lightZone) {
                attr = midAttr;
                baseChars = ['~', ' ', GLYPH.LIGHT_SHADE, ' ', '~', ' '];
            }
            else {
                attr = deepAttr;
                baseChars = [' ', ' ', GLYPH.LIGHT_SHADE, ' ', ' ', ' ', ' ', ' '];
            }
            var waveOffset = Math.floor(this._skyGridAnimPhase * 20 + y * 0.5);
            for (var x = 0; x < this.width; x++) {
                var charIndex = (x + waveOffset) % baseChars.length;
                var char = baseChars[charIndex];
                var cellAttr = attr;
                if (y < surfaceZone) {
                    var wavePhase = Math.sin((x + trackPosition * 0.1 + this._skyGridAnimPhase * 10) * 0.3);
                    if (wavePhase > 0.7) {
                        cellAttr = waveAttr;
                        char = GLYPH.FULL_BLOCK;
                    }
                }
                frame.setData(x, y, char, cellAttr);
            }
        }
        var numRays = 5;
        for (var i = 0; i < numRays; i++) {
            var rayX = 10 + i * 15;
            var rayWobble = Math.sin(this._skyGridAnimPhase * 6.28 + i * 2) * 2;
            var actualX = Math.floor(rayX + rayWobble);
            for (var ry = surfaceZone; ry < lightZone; ry++) {
                if (actualX >= 0 && actualX < this.width) {
                    var fade = 1 - (ry - surfaceZone) / (lightZone - surfaceZone);
                    if (Math.random() < fade * 0.6) {
                        frame.setData(actualX, ry, GLYPH.LIGHT_SHADE, lightrayAttr);
                    }
                }
            }
        }
        var fishPhase = trackPosition * 0.02 + this._skyGridAnimPhase * 5;
        var fish1X = Math.floor((fishPhase * 30) % (this.width + 10)) - 5;
        var fish1Y = 5 + Math.floor(Math.sin(fishPhase * 2) * 2);
        if (fish1X >= 0 && fish1X < this.width - 3 && fish1Y >= 0 && fish1Y < this.horizonY) {
            frame.setData(fish1X, fish1Y, '<', fish1Attr);
            frame.setData(fish1X + 1, fish1Y, GLYPH.FULL_BLOCK, fish1Attr);
            frame.setData(fish1X + 2, fish1Y, '>', fish1Attr);
        }
        var fish2X = this.width - Math.floor((fishPhase * 25) % (this.width + 8));
        var fish2Y = 8 + Math.floor(Math.sin(fishPhase * 1.5 + 1) * 2);
        if (fish2X >= 2 && fish2X < this.width && fish2Y >= 0 && fish2Y < this.horizonY) {
            frame.setData(fish2X, fish2Y, '<', fish2Attr);
            frame.setData(fish2X - 1, fish2Y, GLYPH.FULL_BLOCK, fish2Attr);
            frame.setData(fish2X - 2, fish2Y, '>', fish2Attr);
        }
        for (var f = 0; f < 4; f++) {
            var schoolX = Math.floor(((fishPhase + f * 0.7) * 20) % this.width);
            var schoolY = 3 + f * 2;
            if (schoolY < this.horizonY - 2) {
                frame.setData(schoolX, schoolY, '<', fish3Attr);
                frame.setData((schoolX + 1) % this.width, schoolY, '>', fish3Attr);
            }
        }
        var bubblePositions = [8, 22, 38, 55, 72];
        for (var i = 0; i < bubblePositions.length; i++) {
            var bubbleBaseX = bubblePositions[i];
            var bubbleY = this.horizonY - 2 - Math.floor((trackPosition * 0.5 + i * 7) % (this.horizonY - 2));
            var wobble = Math.sin(trackPosition * 0.1 + i * 3) * 1.5;
            var bx = Math.floor(bubbleBaseX + wobble);
            if (bubbleY >= 0 && bubbleY < this.horizonY && bx >= 0 && bx < this.width) {
                frame.setData(bx, bubbleY, 'o', bubbleAttr);
                if (bubbleY + 2 < this.horizonY) {
                    frame.setData(bx, bubbleY + 2, '.', bubbleAttr);
                }
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
    FrameRenderer.prototype.renderLavaGround = function (_trackPosition) {
        var frame = this.frameManager.getGroundGridFrame();
        if (!frame)
            return;
        var ground = this.activeTheme.ground;
        if (!ground)
            return;
        frame.clear();
        var frameHeight = this.height - this.horizonY;
        var firePhase = this._fireAnimPhase;
        var blackAttr = makeAttr(BLACK, BG_BLACK);
        var darkRockAttr = makeAttr(DARKGRAY, BG_BLACK);
        var hotRockAttr = makeAttr(RED, BG_BLACK);
        var lavaAttr = makeAttr(LIGHTRED, BG_RED);
        var lavaGlowAttr = makeAttr(YELLOW, BG_RED);
        var lavaBrightAttr = makeAttr(WHITE, BG_RED);
        var fireAttr = makeAttr(YELLOW, BG_BLACK);
        var fireBrightAttr = makeAttr(WHITE, BG_RED);
        var emberAttr = makeAttr(LIGHTRED, BG_BLACK);
        for (var y = 0; y < frameHeight - 1; y++) {
            var depthFactor = y / frameHeight;
            for (var x = 0; x < this.width; x++) {
                var river1 = Math.sin((x * 0.15) + (y * 0.3) + firePhase * 0.7) * 1.5;
                var river2 = Math.sin((x * 0.1) - (y * 0.2) + firePhase * 0.5 + 2) * 1.2;
                var riverIntensity = river1 + river2;
                var flameBase = Math.sin(x * 0.25 + firePhase * 1.5) +
                    Math.sin(x * 0.4 - firePhase * 2.0) * 0.5;
                var flameFlicker = Math.sin(x * 0.8 + y * 0.5 + firePhase * 4) * 0.5;
                var flameIntensity = flameBase + flameFlicker;
                var emberSeed = (x * 7919 + y * 104729) % 1000;
                var emberPhase = Math.sin(firePhase * 3 + emberSeed * 0.01);
                var isEmber = emberSeed < 30 && emberPhase > 0.7;
                var poolCenterX1 = 15 + Math.sin(firePhase * 0.3) * 3;
                var poolCenterX2 = 55 + Math.sin(firePhase * 0.4 + 1) * 4;
                var poolCenterX3 = 35 + Math.sin(firePhase * 0.2 + 2) * 2;
                var dist1 = Math.sqrt(Math.pow(x - poolCenterX1, 2) + Math.pow(y - 8, 2));
                var dist2 = Math.sqrt(Math.pow(x - poolCenterX2, 2) + Math.pow(y - 12, 2));
                var dist3 = Math.sqrt(Math.pow(x - poolCenterX3, 2) + Math.pow(y - 5, 2));
                var poolBubble = Math.sin(firePhase * 2 + x * 0.3 + y * 0.2);
                var inPool1 = dist1 < 6 + poolBubble;
                var inPool2 = dist2 < 5 + poolBubble * 0.8;
                var inPool3 = dist3 < 4 + poolBubble * 0.6;
                var char;
                var attr;
                if (isEmber && depthFactor > 0.3) {
                    char = '*';
                    attr = emberAttr;
                }
                else if (inPool1 || inPool2 || inPool3) {
                    var poolDist = inPool1 ? dist1 : (inPool2 ? dist2 : dist3);
                    var bubblePhase = Math.sin(firePhase * 3 + poolDist * 0.5);
                    if (bubblePhase > 0.7) {
                        char = 'O';
                        attr = lavaBrightAttr;
                    }
                    else if (bubblePhase > 0.3) {
                        char = GLYPH.FULL_BLOCK;
                        attr = lavaGlowAttr;
                    }
                    else if (bubblePhase > -0.2) {
                        char = GLYPH.MEDIUM_SHADE;
                        attr = lavaAttr;
                    }
                    else {
                        char = '~';
                        attr = lavaAttr;
                    }
                }
                else if (riverIntensity > 1.5) {
                    char = GLYPH.FULL_BLOCK;
                    attr = lavaGlowAttr;
                }
                else if (riverIntensity > 0.8) {
                    char = '~';
                    attr = lavaAttr;
                }
                else if (riverIntensity > 0.3) {
                    char = GLYPH.LIGHT_SHADE;
                    attr = hotRockAttr;
                }
                else if (flameIntensity > 1.2 && depthFactor < 0.6) {
                    char = '^';
                    attr = fireBrightAttr;
                }
                else if (flameIntensity > 0.6 && depthFactor < 0.7) {
                    var flameChar = ((x + Math.floor(firePhase * 5)) % 3 === 0) ? '^' : '*';
                    char = flameChar;
                    attr = fireAttr;
                }
                else if (flameIntensity > 0.2 && depthFactor < 0.8) {
                    char = GLYPH.MEDIUM_SHADE;
                    attr = emberAttr;
                }
                else if (Math.random() < 0.02 && depthFactor > 0.4) {
                    char = '.';
                    attr = emberAttr;
                }
                else {
                    var rockPattern = ((x * 3 + y * 7) % 5);
                    if (rockPattern === 0) {
                        char = GLYPH.DARK_SHADE;
                        attr = darkRockAttr;
                    }
                    else if (rockPattern === 1) {
                        char = GLYPH.MEDIUM_SHADE;
                        attr = blackAttr;
                    }
                    else {
                        char = ' ';
                        attr = blackAttr;
                    }
                }
                frame.setData(x, y, char, attr);
            }
        }
    };
    FrameRenderer.prototype.renderWaterGround = function (_trackPosition) {
        var frame = this.frameManager.getGroundGridFrame();
        if (!frame)
            return;
        var ground = this.activeTheme.ground;
        if (!ground)
            return;
        frame.clear();
        var frameHeight = this.height - this.horizonY;
        var waterPhase = this._fireAnimPhase;
        var deepBlueAttr = makeAttr(BLUE, BG_BLUE);
        var mediumBlueAttr = makeAttr(LIGHTBLUE, BG_BLUE);
        var lightBlueAttr = makeAttr(LIGHTCYAN, BG_BLUE);
        var cyanAttr = makeAttr(CYAN, BG_CYAN);
        var whiteAttr = makeAttr(WHITE, BG_BLUE);
        var sandAttr = makeAttr(YELLOW, BG_BLUE);
        var sandDarkAttr = makeAttr(BROWN, BG_BLUE);
        var seaweedAttr = makeAttr(GREEN, BG_BLUE);
        var bubbleAttr = makeAttr(WHITE, BG_CYAN);
        for (var y = 0; y < frameHeight - 1; y++) {
            var depthFactor = y / frameHeight;
            for (var x = 0; x < this.width; x++) {
                var caustic1 = Math.sin((x * 0.2) + (y * 0.15) + waterPhase * 0.8);
                var caustic2 = Math.sin((x * 0.15) - (y * 0.1) + waterPhase * 0.6 + 1.5);
                var causticIntensity = (caustic1 + caustic2) / 2;
                var currentWave = Math.sin(y * 0.3 + waterPhase * 1.2) * 0.5;
                var currentIntensity = Math.sin((x + waterPhase * 3) * 0.1 + currentWave);
                var bubbleSeed = (x * 7919 + y * 104729) % 1000;
                var bubblePhase = Math.sin(waterPhase * 2 - y * 0.3 + bubbleSeed * 0.01);
                var isBubble = bubbleSeed < 20 && bubblePhase > 0.8 && depthFactor > 0.2;
                var sandNoise = Math.sin(x * 0.4 + y * 0.2) + Math.sin(x * 0.2 - y * 0.3);
                var isSandy = sandNoise > 0.8 && depthFactor > 0.5;
                var seaweedSeed = (x * 31 + y * 17) % 100;
                var seaweedWave = Math.sin(waterPhase * 1.5 + x * 0.5);
                var isSeaweed = seaweedSeed < 8 && depthFactor > 0.3 && seaweedWave > 0.3;
                var char;
                var attr;
                if (isBubble) {
                    char = 'o';
                    attr = bubbleAttr;
                }
                else if (isSeaweed) {
                    var seaweedChar = seaweedWave > 0.6 ? ')' : '(';
                    char = seaweedChar;
                    attr = seaweedAttr;
                }
                else if (isSandy) {
                    var sandRipple = Math.sin(x * 0.5 + waterPhase * 0.5);
                    if (sandRipple > 0.5) {
                        char = '~';
                        attr = sandAttr;
                    }
                    else if (sandRipple > 0) {
                        char = '.';
                        attr = sandDarkAttr;
                    }
                    else {
                        char = ',';
                        attr = sandAttr;
                    }
                }
                else if (causticIntensity > 0.7) {
                    char = GLYPH.LIGHT_SHADE;
                    attr = whiteAttr;
                }
                else if (causticIntensity > 0.3) {
                    char = '~';
                    attr = lightBlueAttr;
                }
                else if (currentIntensity > 0.6) {
                    char = '~';
                    attr = cyanAttr;
                }
                else if (currentIntensity > 0.2) {
                    char = '~';
                    attr = mediumBlueAttr;
                }
                else if (currentIntensity > -0.2) {
                    char = GLYPH.MEDIUM_SHADE;
                    attr = mediumBlueAttr;
                }
                else {
                    char = GLYPH.DARK_SHADE;
                    attr = deepBlueAttr;
                }
                frame.setData(x, y, char, attr);
            }
        }
    };
    FrameRenderer.prototype.renderCandyGround = function (trackPosition) {
        var frame = this.frameManager.getGroundGridFrame();
        if (!frame)
            return;
        var ground = this.activeTheme.ground;
        if (!ground)
            return;
        frame.clear();
        var candy1 = makeAttr(ground.primary.fg, ground.primary.bg);
        var candy2 = makeAttr(ground.secondary.fg, ground.secondary.bg);
        var frameHeight = this.height - this.horizonY;
        var sparklePhase = Math.floor(trackPosition / 30) % 6;
        for (var y = 0; y < frameHeight - 1; y++) {
            for (var x = 0; x < this.width; x++) {
                var swirl = Math.sin(x * 0.2 + y * 0.3) + Math.cos(x * 0.15 - y * 0.25);
                var char;
                var attr;
                if (swirl > 0.5) {
                    char = '@';
                    attr = candy1;
                }
                else if (swirl > -0.5) {
                    char = GLYPH.LIGHT_SHADE;
                    attr = candy2;
                }
                else {
                    char = '.';
                    attr = candy1;
                }
                var isSprinkle = ((x * 7 + y * 13 + sparklePhase) % 17) === 0;
                if (isSprinkle) {
                    var sprinkleColors = [LIGHTRED, LIGHTGREEN, LIGHTCYAN, YELLOW, LIGHTMAGENTA];
                    var colorIdx = (x + y) % sprinkleColors.length;
                    char = '*';
                    attr = makeAttr(sprinkleColors[colorIdx], BG_BLACK);
                }
                frame.setData(x, y, char, attr);
            }
        }
    };
    FrameRenderer.prototype.renderVoidGround = function (trackPosition) {
        var frame = this.frameManager.getGroundGridFrame();
        if (!frame)
            return;
        var ground = this.activeTheme.ground;
        if (!ground)
            return;
        frame.clear();
        var voidAttr = makeAttr(ground.primary.fg, ground.primary.bg);
        var starAttr = makeAttr(ground.secondary.fg, ground.secondary.bg);
        var frameHeight = this.height - this.horizonY;
        var twinklePhase = Math.floor(trackPosition / 15) % 4;
        for (var y = 0; y < frameHeight - 1; y++) {
            for (var x = 0; x < this.width; x++) {
                var hash = (x * 31 + y * 17) % 100;
                if (hash < 3) {
                    var twinkle = ((x + y + twinklePhase) % 4) === 0;
                    frame.setData(x, y, twinkle ? '*' : '+', starAttr);
                }
                else if (hash < 8) {
                    frame.setData(x, y, '.', voidAttr);
                }
                else if (hash < 15) {
                    frame.setData(x, y, GLYPH.LIGHT_SHADE, voidAttr);
                }
            }
        }
        var vanishX = Math.floor(this.width / 2);
        var colors = [LIGHTRED, YELLOW, LIGHTGREEN, LIGHTCYAN, LIGHTBLUE, LIGHTMAGENTA];
        for (var y = 0; y < frameHeight - 1; y++) {
            var distFromHorizon = y + 1;
            for (var ci = 0; ci < colors.length; ci++) {
                var offset = (ci - 2.5) * 8;
                var lineX = Math.floor(vanishX + offset * distFromHorizon / 5);
                if (lineX >= 0 && lineX < this.width) {
                    var glowPhase = (trackPosition / 10 + ci) % colors.length;
                    var colorIdx = Math.floor(glowPhase + ci) % colors.length;
                    frame.setData(lineX, y, GLYPH.BOX_V, makeAttr(colors[colorIdx], BG_BLACK));
                }
            }
        }
    };
    FrameRenderer.prototype.renderCobblestoneGround = function (trackPosition) {
        var frame = this.frameManager.getGroundGridFrame();
        if (!frame)
            return;
        var ground = this.activeTheme.ground;
        if (!ground)
            return;
        frame.clear();
        var stone = makeAttr(ground.primary.fg, ground.primary.bg);
        var mortar = makeAttr(ground.secondary.fg, ground.secondary.bg);
        var frameHeight = this.height - this.horizonY;
        for (var y = 0; y < frameHeight - 1; y++) {
            for (var x = 0; x < this.width; x++) {
                var stoneSize = 3;
                var inMortar = ((x % stoneSize) === 0) || (((y + Math.floor(x / stoneSize)) % 2 === 0) && ((y % stoneSize) === 0));
                if (inMortar) {
                    frame.setData(x, y, '+', mortar);
                }
                else {
                    var texture = ((x * 7 + y * 11) % 5);
                    var char = (texture === 0) ? GLYPH.MEDIUM_SHADE : GLYPH.DARK_SHADE;
                    frame.setData(x, y, char, stone);
                }
            }
        }
        var puddlePhase = Math.floor(trackPosition / 50) % 10;
        for (var py = frameHeight / 2; py < frameHeight - 1; py += 4) {
            var px = (py * 13 + puddlePhase * 7) % this.width;
            frame.setData(px, py, '~', makeAttr(DARKGRAY, BG_BLACK));
        }
    };
    FrameRenderer.prototype.renderJungleGround = function (trackPosition) {
        var frame = this.frameManager.getGroundGridFrame();
        if (!frame)
            return;
        var ground = this.activeTheme.ground;
        if (!ground)
            return;
        frame.clear();
        var leaf = makeAttr(ground.primary.fg, ground.primary.bg);
        var dirt = makeAttr(ground.secondary.fg, ground.secondary.bg);
        var frameHeight = this.height - this.horizonY;
        var rustlePhase = Math.floor(trackPosition / 25) % 4;
        for (var y = 0; y < frameHeight - 1; y++) {
            for (var x = 0; x < this.width; x++) {
                var hash = (x * 23 + y * 19) % 20;
                var char;
                var attr;
                if (hash < 8) {
                    var leafChars = ['"', 'v', 'V', 'Y', 'y'];
                    char = leafChars[(x + y + rustlePhase) % leafChars.length];
                    attr = leaf;
                }
                else if (hash < 12) {
                    char = GLYPH.LIGHT_SHADE;
                    attr = dirt;
                }
                else if (hash < 15) {
                    char = ',';
                    attr = makeAttr(BROWN, BG_BLACK);
                }
                else {
                    char = GLYPH.MEDIUM_SHADE;
                    attr = leaf;
                }
                frame.setData(x, y, char, attr);
            }
        }
        for (var mx = 5; mx < this.width - 5; mx += 15 + ((mx * 3) % 7)) {
            var my = (mx * 7) % (frameHeight - 2) + 1;
            frame.setData(mx, my, 'o', makeAttr(LIGHTRED, BG_BLACK));
        }
    };
    FrameRenderer.prototype.renderDirtGround = function (trackPosition) {
        var frame = this.frameManager.getGroundGridFrame();
        if (!frame)
            return;
        var ground = this.activeTheme.ground;
        if (!ground)
            return;
        frame.clear();
        var dirt = makeAttr(ground.primary.fg, ground.primary.bg);
        var dirtDark = makeAttr(ground.secondary.fg, ground.secondary.bg);
        var tireTrack = makeAttr(DARKGRAY, BG_BLACK);
        var frameHeight = this.height - this.horizonY;
        var dustPhase = Math.floor(trackPosition / 20) % 8;
        for (var y = 0; y < frameHeight - 1; y++) {
            for (var x = 0; x < this.width; x++) {
                var hash = (x * 37 + y * 23 + dustPhase) % 25;
                var char;
                var attr;
                var inTireTrack = (x >= 5 && x <= 12) || (x >= this.width - 12 && x <= this.width - 5);
                if (inTireTrack && y > 2 && ((y + dustPhase) % 3 === 0)) {
                    char = '=';
                    attr = tireTrack;
                }
                else if (hash < 8) {
                    char = GLYPH.MEDIUM_SHADE;
                    attr = dirt;
                }
                else if (hash < 14) {
                    char = GLYPH.DARK_SHADE;
                    attr = dirtDark;
                }
                else if (hash < 17) {
                    char = '.';
                    attr = makeAttr(LIGHTGRAY, BG_BLACK);
                }
                else if (hash < 20) {
                    char = GLYPH.LIGHT_SHADE;
                    attr = dirt;
                }
                else {
                    var clumps = ['`', "'", ','];
                    char = clumps[(x + y) % clumps.length];
                    attr = dirtDark;
                }
                frame.setData(x, y, char, attr);
            }
        }
        for (var px = 8; px < this.width - 8; px += 20 + ((px * 7) % 10)) {
            var py = (px * 5) % (frameHeight - 3) + 1;
            var pw = 3 + (px % 3);
            for (var pox = 0; pox < pw; pox++) {
                if (px + pox < this.width) {
                    frame.setData(px + pox, py, '~', makeAttr(DARKGRAY, BG_BLACK));
                }
            }
        }
    };
    FrameRenderer.prototype.renderANSIRoadStripes = function (trackPosition, cameraX, road, roadHeight) {
        var frame = this.frameManager.getRoadFrame();
        if (!frame)
            return;
        var roadBottom = roadHeight ? roadHeight - 1 : this.height - this.horizonY - 4;
        var accumulatedCurve = 0;
        for (var screenY = roadBottom; screenY >= 0; screenY--) {
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
            var stripePhase = Math.floor((trackPosition + distance * 5) / 15) % 2;
            if (stripePhase === 0 && halfWidth > 2) {
                frame.setData(centerX, screenY, '-', makeAttr(YELLOW, BG_BLACK));
            }
            var leftEdge = centerX - halfWidth;
            var rightEdge = centerX + halfWidth;
            if (leftEdge >= 0 && leftEdge < this.width) {
                frame.setData(leftEdge, screenY, '|', makeAttr(WHITE, BG_BLACK));
            }
            if (rightEdge >= 0 && rightEdge < this.width) {
                frame.setData(rightEdge, screenY, '|', makeAttr(WHITE, BG_BLACK));
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
            this.renderRoadScanline(frame, screenY, centerX, leftEdge, rightEdge, distance, stripePhase, isFinishLine, accumulatedCurve, worldZ);
        }
    };
    FrameRenderer.prototype.renderRoadScanline = function (frame, y, centerX, leftEdge, rightEdge, distance, stripePhase, isFinishLine, curve, worldZ) {
        var colors = this.activeTheme.colors;
        var baseSurfaceFg = distance < 10 ? colors.roadSurfaceAlt.fg : colors.roadSurface.fg;
        var baseSurfaceBg = distance < 10 ? colors.roadSurfaceAlt.bg : colors.roadSurface.bg;
        var baseGridFg = colors.roadGrid.fg;
        var baseGridBg = colors.roadGrid.bg;
        var baseEdgeFg = colors.roadEdge.fg;
        var baseEdgeBg = colors.roadEdge.bg;
        var baseStripeFg = colors.roadStripe.fg;
        var baseStripeBg = colors.roadStripe.bg;
        var baseShoulderFg = colors.shoulderPrimary.fg;
        var baseShoulderBg = colors.shoulderPrimary.bg;
        var isRainbowRoad = this.activeTheme.road && this.activeTheme.road.rainbow;
        if (isRainbowRoad) {
            var rainbowColors = [LIGHTRED, YELLOW, LIGHTGREEN, LIGHTCYAN, LIGHTBLUE, LIGHTMAGENTA];
            var trackPos = worldZ || 0;
            var colorIndex = Math.floor(trackPos * 0.02) % rainbowColors.length;
            var nextColorIndex = (colorIndex + 1) % rainbowColors.length;
            baseSurfaceFg = rainbowColors[colorIndex];
            baseSurfaceBg = BG_BLACK;
            baseGridFg = rainbowColors[nextColorIndex];
            baseGridBg = BG_BLACK;
            baseEdgeFg = rainbowColors[colorIndex];
            baseEdgeBg = BG_BLACK;
            baseStripeFg = WHITE;
            baseStripeBg = BG_BLACK;
            baseShoulderFg = rainbowColors[(colorIndex + 2) % rainbowColors.length];
            baseShoulderBg = BG_BLACK;
        }
        if (this.activeTheme.name === 'glitch_circuit' && typeof GlitchState !== 'undefined' && GlitchState.roadColorGlitch !== 0) {
            var surfaceGlitch = GlitchState.getGlitchedRoadColor(baseSurfaceFg, baseSurfaceBg, distance);
            baseSurfaceFg = surfaceGlitch.fg;
            baseSurfaceBg = surfaceGlitch.bg;
            var gridGlitch = GlitchState.getGlitchedRoadColor(baseGridFg, baseGridBg, distance);
            baseGridFg = gridGlitch.fg;
            baseGridBg = gridGlitch.bg;
            var edgeGlitch = GlitchState.getGlitchedRoadColor(baseEdgeFg, baseEdgeBg, distance);
            baseEdgeFg = edgeGlitch.fg;
            baseEdgeBg = edgeGlitch.bg;
            var stripeGlitch = GlitchState.getGlitchedRoadColor(baseStripeFg, baseStripeBg, distance);
            baseStripeFg = stripeGlitch.fg;
            baseStripeBg = stripeGlitch.bg;
            var shoulderGlitch = GlitchState.getGlitchedRoadColor(baseShoulderFg, baseShoulderBg, distance);
            baseShoulderFg = shoulderGlitch.fg;
            baseShoulderBg = shoulderGlitch.bg;
        }
        var roadAttr = makeAttr(baseSurfaceFg, baseSurfaceBg);
        var gridAttr = makeAttr(baseGridFg, baseGridBg);
        var edgeAttr = makeAttr(baseEdgeFg, baseEdgeBg);
        var stripeAttr = makeAttr(baseStripeFg, baseStripeBg);
        var shoulderAttr = makeAttr(baseShoulderFg, baseShoulderBg);
        var hideEdgeMarkers = this.activeTheme.road && this.activeTheme.road.hideEdgeMarkers;
        for (var x = 0; x < this.width; x++) {
            if (x >= leftEdge && x <= rightEdge) {
                if (isFinishLine) {
                    this.renderFinishCell(frame, x, y, centerX, leftEdge, rightEdge, distance);
                }
                else if ((x === leftEdge || x === rightEdge) && !hideEdgeMarkers) {
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
                        if (isRainbowRoad) {
                            frame.setData(x, y, GLYPH.FULL_BLOCK, roadAttr);
                        }
                        else {
                            frame.setData(x, y, ' ', roadAttr);
                        }
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
            case 'lava':
            case 'candy':
            case 'void':
            case 'cobblestone':
            case 'jungle':
            case 'dirt':
            case 'water':
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
        var applyGlitch = this.activeTheme.name === 'glitch_circuit' &&
            typeof GlitchState !== 'undefined' &&
            GlitchState.roadsideColorShift !== 0;
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
            if (applyGlitch) {
                this.applyGlitchToSpriteFrame(spriteFrame, sprite, scaleIndex);
            }
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
    FrameRenderer.prototype.applyGlitchToSpriteFrame = function (frame, sprite, scaleIndex) {
        var variant = sprite.variants[scaleIndex];
        if (!variant)
            variant = sprite.variants[sprite.variants.length - 1];
        for (var row = 0; row < variant.length; row++) {
            for (var col = 0; col < variant[row].length; col++) {
                var cell = variant[row][col];
                if (cell !== null && cell !== undefined) {
                    var fg = cell.attr & 0x0F;
                    var bg = cell.attr & 0xF0;
                    var glitched = GlitchState.getGlitchedSpriteColor(fg, bg);
                    var newAttr = makeAttr(glitched.fg, glitched.bg);
                    var char = cell.char;
                    if (Math.random() < GlitchState.intensity * 0.15) {
                        char = GlitchState.corruptChar(char);
                    }
                    frame.setData(col, row, char, newAttr);
                }
            }
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
    FrameRenderer.prototype.setBrakeLightState = function (brakeLightsOn) {
        this._currentBrakeLightsOn = brakeLightsOn;
    };
    FrameRenderer.prototype.renderPlayerVehicle = function (playerX, isFlashing, isBoosting, hasStar, hasBullet, hasLightning, carId, carColorId, brakeLightsOn) {
        var frame = this.frameManager.getVehicleFrame(0);
        if (!frame)
            return;
        var effectiveCarId = carId || 'sports';
        var effectiveColorId = carColorId || 'yellow';
        var effectiveBrake = brakeLightsOn !== undefined ? brakeLightsOn : this._currentBrakeLightsOn;
        var carDef = getCarDefinition(effectiveCarId);
        var bodyStyle = carDef ? carDef.bodyStyle : 'sports';
        var sprite = getPlayerCarSprite(bodyStyle, effectiveColorId, effectiveBrake);
        renderSpriteToFrame(frame, sprite, 0);
        var now = Date.now();
        var effectFlashColor = getEffectFlashColor(effectiveColorId);
        if (hasStar) {
            var starColors = [LIGHTRED, YELLOW, LIGHTGREEN, LIGHTCYAN, LIGHTBLUE, LIGHTMAGENTA];
            var colorIndex = Math.floor(now / 60) % starColors.length;
            var starColor = starColors[colorIndex];
            var starAttr = makeAttr(starColor, BG_BLACK);
            for (var y = 0; y < 3; y++) {
                for (var x = 0; x < 5; x++) {
                    var cell = sprite.variants[0][y] ? sprite.variants[0][y][x] : null;
                    if (cell) {
                        frame.setData(x, y, cell.char, starAttr);
                    }
                }
            }
        }
        else if (hasBullet) {
            var bulletColor = (Math.floor(now / 40) % 2 === 0) ? WHITE : effectFlashColor;
            var bulletAttr = makeAttr(bulletColor, BG_BLACK);
            for (var y = 0; y < 3; y++) {
                for (var x = 0; x < 5; x++) {
                    var cell = sprite.variants[0][y] ? sprite.variants[0][y][x] : null;
                    if (cell) {
                        frame.setData(x, y, cell.char, bulletAttr);
                    }
                }
            }
        }
        else if (hasLightning) {
            var lightningColor = (Math.floor(now / 120) % 3 === 0) ? BLUE :
                (Math.floor(now / 120) % 3 === 1) ? LIGHTCYAN : CYAN;
            var lightningAttr = makeAttr(lightningColor, BG_BLACK);
            for (var y = 0; y < 3; y++) {
                for (var x = 0; x < 5; x++) {
                    var cell = sprite.variants[0][y] ? sprite.variants[0][y][x] : null;
                    if (cell) {
                        frame.setData(x, y, cell.char, lightningAttr);
                    }
                }
            }
        }
        else if (isFlashing) {
            var flashColor = (Math.floor(now / 100) % 2 === 0) ? WHITE : LIGHTRED;
            var flashAttr = makeAttr(flashColor, BG_BLACK);
            for (var y = 0; y < 3; y++) {
                for (var x = 0; x < 5; x++) {
                    var cell = sprite.variants[0][y] ? sprite.variants[0][y][x] : null;
                    if (cell) {
                        frame.setData(x, y, cell.char, flashAttr);
                    }
                }
            }
        }
        else if (isBoosting) {
            var boostColor = (Math.floor(now / 80) % 2 === 0) ? LIGHTCYAN : effectFlashColor;
            var boostAttr = makeAttr(boostColor, BG_BLACK);
            for (var bx = 0; bx < 5; bx++) {
                var cell = sprite.variants[0][2] ? sprite.variants[0][2][bx] : null;
                if (cell) {
                    frame.setData(bx, 2, cell.char, boostAttr);
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
        var hudConfig = this.activeTheme.hud;
        var timeLabel = (hudConfig && hudConfig.timeLabel) ? hudConfig.timeLabel : 'TIME';
        var lapLabel = (hudConfig && hudConfig.lapLabel) ? hudConfig.lapLabel : 'LAP';
        var positionPrefix = (hudConfig && hudConfig.positionPrefix) ? hudConfig.positionPrefix : '';
        var speedMultiplier = (hudConfig && hudConfig.speedMultiplier) ? hudConfig.speedMultiplier : 1;
        var speedSuffix = (hudConfig && hudConfig.speedLabel) ? ' ' + hudConfig.speedLabel : '';
        this.writeStringToFrame(frame, 35, 0, timeLabel, labelAttr);
        this.writeStringToFrame(frame, 35 + timeLabel.length + 1, 0, LapTimer.format(hudData.lapTime), valueAttr);
        var bottomY = this.height - 1;
        var posStr = positionPrefix + hudData.position + PositionIndicator.getOrdinalSuffix(hudData.position);
        this.writeStringToFrame(frame, 0, bottomY - 1, posStr, valueAttr);
        this.renderLapProgressBar(frame, hudData.lap, hudData.totalLaps, hudData.lapProgress, 0, bottomY, 16, lapLabel);
        var displaySpeed = Math.round(hudData.speed * speedMultiplier);
        var maxDisplaySpeed = Math.round(300 * speedMultiplier);
        var speedDisplay = displaySpeed > maxDisplaySpeed ? maxDisplaySpeed + '+' : this.padLeft(displaySpeed.toString(), 3);
        if (speedSuffix && displaySpeed <= maxDisplaySpeed) {
            speedDisplay = displaySpeed.toFixed(1) + speedSuffix;
        }
        var speedAttr = displaySpeed > maxDisplaySpeed ? colorToAttr({ fg: LIGHTRED, bg: BG_BLACK }) : valueAttr;
        var speedX = 79 - speedDisplay.length;
        this.writeStringToFrame(frame, speedX - 12, bottomY, speedDisplay, speedAttr);
        this.renderSpeedometerBarCompact(frame, hudData.speed, hudData.speedMax, 67, bottomY, 11);
        this.renderItemSlotWithIcon(frame, hudData.heldItem);
        if (hudData.countdown > 0 && hudData.raceMode === RaceMode.GRAND_PRIX) {
            this.renderStoplight(frame, hudData.countdown);
        }
    };
    FrameRenderer.prototype.renderItemSlotWithIcon = function (frame, heldItem) {
        var slotLeft = 67;
        var slotRight = 79;
        var slotTop = 19;
        var slotBottom = 21;
        var slotHeight = 3;
        var slotWidth = slotRight - slotLeft + 1;
        var separatorAttr = makeAttr(DARKGRAY, BG_BLACK);
        frame.setData(slotLeft, slotTop, GLYPH.BOX_VD_HD, separatorAttr);
        for (var row = slotTop + 1; row < slotBottom; row++) {
            frame.setData(slotLeft, row, GLYPH.BOX_V, separatorAttr);
        }
        frame.setData(slotLeft, slotBottom, GLYPH.BOX_VD_HU, separatorAttr);
        if (heldItem === null) {
            return;
        }
        var itemType = heldItem.type;
        var uses = heldItem.uses;
        var isActivated = heldItem.activated;
        var icon = this.getItemIconCP437(itemType);
        var iconWidth = icon.cells[0].length;
        var availableWidth = slotWidth - 1;
        var iconX = slotLeft + 1 + Math.floor((availableWidth - iconWidth) / 2);
        if (uses > 1) {
            iconX = slotLeft + 3;
            var countAttr = colorToAttr({ fg: WHITE, bg: BG_BLACK });
            frame.setData(slotLeft + 1, slotTop + 1, String(uses).charAt(0), countAttr);
        }
        for (var row = 0; row < icon.cells.length && row < slotHeight; row++) {
            var cellRow = icon.cells[row];
            for (var col = 0; col < cellRow.length; col++) {
                var cellData = cellRow[col];
                if (cellData.char !== ' ') {
                    var attr = this.getIconAttrCP437(cellData.attr, itemType, isActivated);
                    frame.setData(iconX + col, slotTop + row, cellData.char, attr);
                }
            }
        }
    };
    FrameRenderer.prototype.getItemIconCP437 = function (itemType) {
        var FB = GLYPH.FULL_BLOCK;
        var LH = GLYPH.LOWER_HALF;
        var UH = GLYPH.UPPER_HALF;
        var DS = GLYPH.DARK_SHADE;
        var LS = GLYPH.LIGHT_SHADE;
        var __ = ' ';
        function cell(ch, fg, bg) {
            return { char: ch, attr: makeAttr(fg, bg) };
        }
        var X = cell(__, BLACK, BG_BLACK);
        switch (itemType) {
            case ItemType.MUSHROOM:
            case ItemType.MUSHROOM_TRIPLE:
                return {
                    cells: [
                        [X, cell(LH, LIGHTRED, BG_BLACK), cell(FB, LIGHTRED, BG_BLACK), cell(FB, LIGHTRED, BG_BLACK), cell(LH, LIGHTRED, BG_BLACK), X],
                        [cell(FB, LIGHTRED, BG_BLACK), cell('o', WHITE, BG_RED), cell(FB, LIGHTRED, BG_BLACK), cell(FB, LIGHTRED, BG_BLACK), cell('o', WHITE, BG_RED), cell(FB, LIGHTRED, BG_BLACK)],
                        [X, X, cell(FB, WHITE, BG_BLACK), cell(FB, WHITE, BG_BLACK), X, X]
                    ],
                    mainColor: LIGHTRED
                };
            case ItemType.MUSHROOM_GOLDEN:
                return {
                    cells: [
                        [X, cell(LH, YELLOW, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell(LH, YELLOW, BG_BLACK), X],
                        [cell(FB, YELLOW, BG_BLACK), cell('*', WHITE, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell('*', WHITE, BG_BLACK), cell(FB, YELLOW, BG_BLACK)],
                        [X, X, cell(FB, WHITE, BG_BLACK), cell(FB, WHITE, BG_BLACK), X, X]
                    ],
                    mainColor: YELLOW
                };
            case ItemType.GREEN_SHELL:
            case ItemType.GREEN_SHELL_TRIPLE:
                return {
                    cells: [
                        [X, cell(LH, LIGHTGREEN, BG_BLACK), cell(FB, LIGHTGREEN, BG_BLACK), cell(FB, LIGHTGREEN, BG_BLACK), cell(LH, LIGHTGREEN, BG_BLACK), X],
                        [cell(FB, LIGHTGREEN, BG_BLACK), cell(LS, YELLOW, BG_GREEN), cell(FB, LIGHTGREEN, BG_BLACK), cell(FB, LIGHTGREEN, BG_BLACK), cell(LS, YELLOW, BG_GREEN), cell(FB, LIGHTGREEN, BG_BLACK)],
                        [X, cell(UH, LIGHTGREEN, BG_BLACK), cell(FB, LIGHTGREEN, BG_BLACK), cell(FB, LIGHTGREEN, BG_BLACK), cell(UH, LIGHTGREEN, BG_BLACK), X]
                    ],
                    mainColor: LIGHTGREEN
                };
            case ItemType.RED_SHELL:
            case ItemType.RED_SHELL_TRIPLE:
            case ItemType.SHELL:
            case ItemType.SHELL_TRIPLE:
                return {
                    cells: [
                        [X, cell(LH, LIGHTRED, BG_BLACK), cell(FB, LIGHTRED, BG_BLACK), cell(FB, LIGHTRED, BG_BLACK), cell(LH, LIGHTRED, BG_BLACK), X],
                        [cell(FB, LIGHTRED, BG_BLACK), cell(LS, YELLOW, BG_RED), cell(FB, LIGHTRED, BG_BLACK), cell(FB, LIGHTRED, BG_BLACK), cell(LS, YELLOW, BG_RED), cell(FB, LIGHTRED, BG_BLACK)],
                        [X, cell(UH, LIGHTRED, BG_BLACK), cell(FB, LIGHTRED, BG_BLACK), cell(FB, LIGHTRED, BG_BLACK), cell(UH, LIGHTRED, BG_BLACK), X]
                    ],
                    mainColor: LIGHTRED
                };
            case ItemType.BLUE_SHELL:
                return {
                    cells: [
                        [cell(LS, LIGHTCYAN, BG_BLACK), cell(LH, LIGHTCYAN, BG_BLACK), cell(FB, LIGHTCYAN, BG_BLACK), cell(FB, LIGHTCYAN, BG_BLACK), cell(LH, LIGHTCYAN, BG_BLACK), cell(LS, LIGHTCYAN, BG_BLACK)],
                        [cell(UH, WHITE, BG_BLACK), cell(FB, LIGHTCYAN, BG_BLACK), cell(DS, WHITE, BG_CYAN), cell(DS, WHITE, BG_CYAN), cell(FB, LIGHTCYAN, BG_BLACK), cell(UH, WHITE, BG_BLACK)],
                        [X, cell(UH, LIGHTCYAN, BG_BLACK), cell(FB, LIGHTCYAN, BG_BLACK), cell(FB, LIGHTCYAN, BG_BLACK), cell(UH, LIGHTCYAN, BG_BLACK), X]
                    ],
                    mainColor: LIGHTCYAN,
                    altColor: WHITE
                };
            case ItemType.BANANA:
            case ItemType.BANANA_TRIPLE:
                return {
                    cells: [
                        [X, cell(LH, GREEN, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell(LH, GREEN, BG_BLACK), X],
                        [cell(FB, YELLOW, BG_BLACK), cell(UH, YELLOW, BG_BLACK), X, X, cell(UH, YELLOW, BG_BLACK), cell(FB, YELLOW, BG_BLACK)],
                        [cell(UH, YELLOW, BG_BLACK), X, X, X, X, cell(UH, YELLOW, BG_BLACK)]
                    ],
                    mainColor: YELLOW
                };
            case ItemType.STAR:
                return {
                    cells: [
                        [X, X, cell(LH, YELLOW, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell(LH, YELLOW, BG_BLACK), X, X],
                        [cell(UH, YELLOW, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell(FB, YELLOW, BG_BLACK), cell(UH, YELLOW, BG_BLACK)],
                        [X, X, cell(UH, YELLOW, BG_BLACK), X, cell(UH, YELLOW, BG_BLACK), X, X]
                    ],
                    mainColor: YELLOW
                };
            case ItemType.LIGHTNING:
                return {
                    cells: [
                        [X, cell('/', LIGHTCYAN, BG_BLACK), cell('\\', LIGHTCYAN, BG_BLACK), X, X],
                        [cell('/', LIGHTCYAN, BG_BLACK), cell('-', YELLOW, BG_BLACK), cell('-', YELLOW, BG_BLACK), cell('\\', LIGHTCYAN, BG_BLACK), X],
                        [X, X, X, cell('\\', LIGHTCYAN, BG_BLACK), cell('/', LIGHTCYAN, BG_BLACK)]
                    ],
                    mainColor: YELLOW,
                    altColor: LIGHTCYAN
                };
            case ItemType.BULLET:
                return {
                    cells: [
                        [cell(LH, DARKGRAY, BG_BLACK), cell(FB, LIGHTGRAY, BG_BLACK), cell(FB, LIGHTGRAY, BG_BLACK), cell(FB, LIGHTGRAY, BG_BLACK), cell(FB, LIGHTGRAY, BG_BLACK), cell(LH, DARKGRAY, BG_BLACK)],
                        [cell(FB, DARKGRAY, BG_BLACK), cell('O', WHITE, BG_BLACK), cell('O', WHITE, BG_BLACK), cell(FB, LIGHTGRAY, BG_BLACK), cell(FB, LIGHTGRAY, BG_BLACK), cell(UH, LIGHTGRAY, BG_BLACK)],
                        [cell(UH, DARKGRAY, BG_BLACK), cell(FB, LIGHTGRAY, BG_BLACK), cell(FB, LIGHTGRAY, BG_BLACK), cell(FB, LIGHTGRAY, BG_BLACK), cell(FB, LIGHTGRAY, BG_BLACK), cell(UH, DARKGRAY, BG_BLACK)]
                    ],
                    mainColor: LIGHTGRAY,
                    altColor: WHITE
                };
            default:
                return {
                    cells: [
                        [X, X, cell('?', YELLOW, BG_BLACK), X, X],
                        [X, cell('?', YELLOW, BG_BLACK), cell('?', YELLOW, BG_BLACK), cell('?', YELLOW, BG_BLACK), X],
                        [X, X, cell('?', YELLOW, BG_BLACK), X, X]
                    ],
                    mainColor: YELLOW
                };
        }
    };
    FrameRenderer.prototype.getIconAttrCP437 = function (baseAttr, itemType, isActivated) {
        switch (itemType) {
            case ItemType.STAR:
                if (isActivated) {
                    var starColors = [YELLOW, LIGHTRED, LIGHTGREEN, LIGHTCYAN, LIGHTMAGENTA, WHITE];
                    var colorIdx = Math.floor(Date.now() / 100) % starColors.length;
                    var bg = (baseAttr >> 4) & 0x07;
                    return makeAttr(starColors[colorIdx], bg << 4);
                }
                break;
            case ItemType.LIGHTNING:
                if (isActivated && (Math.floor(Date.now() / 150) % 2 === 0)) {
                    var bg2 = (baseAttr >> 4) & 0x07;
                    return makeAttr(LIGHTCYAN, bg2 << 4);
                }
                break;
        }
        return baseAttr;
    };
    FrameRenderer.prototype.renderStoplight = function (frame, countdown) {
        var countNum = Math.ceil(countdown);
        var centerX = 40;
        var topY = 3;
        var frameAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
        var redOn = countNum >= 3;
        var yellowOn = countNum === 2;
        var greenOn = countNum === 1;
        var redAttr = redOn ? colorToAttr({ fg: LIGHTRED, bg: BG_RED }) : colorToAttr({ fg: RED, bg: BG_BLACK });
        var yellowAttr = yellowOn ? colorToAttr({ fg: YELLOW, bg: BG_BROWN }) : colorToAttr({ fg: BROWN, bg: BG_BLACK });
        var greenAttr = greenOn ? colorToAttr({ fg: LIGHTGREEN, bg: BG_GREEN }) : colorToAttr({ fg: GREEN, bg: BG_BLACK });
        var boxX = centerX - 7;
        frame.setData(boxX, topY, GLYPH.DBOX_TL, frameAttr);
        for (var i = 1; i < 14; i++) {
            frame.setData(boxX + i, topY, GLYPH.DBOX_H, frameAttr);
        }
        frame.setData(boxX + 14, topY, GLYPH.DBOX_TR, frameAttr);
        frame.setData(boxX, topY + 1, GLYPH.DBOX_V, frameAttr);
        frame.setData(boxX + 1, topY + 1, GLYPH.FULL_BLOCK, redAttr);
        frame.setData(boxX + 2, topY + 1, GLYPH.FULL_BLOCK, redAttr);
        frame.setData(boxX + 3, topY + 1, GLYPH.FULL_BLOCK, redAttr);
        frame.setData(boxX + 4, topY + 1, GLYPH.DBOX_V, frameAttr);
        frame.setData(boxX + 5, topY + 1, GLYPH.FULL_BLOCK, yellowAttr);
        frame.setData(boxX + 6, topY + 1, GLYPH.FULL_BLOCK, yellowAttr);
        frame.setData(boxX + 7, topY + 1, GLYPH.FULL_BLOCK, yellowAttr);
        frame.setData(boxX + 8, topY + 1, GLYPH.DBOX_V, frameAttr);
        frame.setData(boxX + 9, topY + 1, GLYPH.FULL_BLOCK, greenAttr);
        frame.setData(boxX + 10, topY + 1, GLYPH.FULL_BLOCK, greenAttr);
        frame.setData(boxX + 11, topY + 1, GLYPH.FULL_BLOCK, greenAttr);
        frame.setData(boxX + 12, topY + 1, ' ', frameAttr);
        frame.setData(boxX + 13, topY + 1, countNum.toString(), colorToAttr({ fg: WHITE, bg: BG_BLACK }));
        frame.setData(boxX + 14, topY + 1, GLYPH.DBOX_V, frameAttr);
        frame.setData(boxX, topY + 2, GLYPH.DBOX_BL, frameAttr);
        for (var j = 1; j < 14; j++) {
            frame.setData(boxX + j, topY + 2, GLYPH.DBOX_H, frameAttr);
        }
        frame.setData(boxX + 14, topY + 2, GLYPH.DBOX_BR, frameAttr);
    };
    FrameRenderer.prototype.renderLapProgressBar = function (frame, lap, totalLaps, progress, x, y, width, label) {
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        frame.setData(x, y, '[', labelAttr);
        frame.setData(x + width + 1, y, ']', labelAttr);
        var fillWidth = Math.round(progress * width);
        var lapLabel = label || 'LAP';
        var lapText = lapLabel + ' ' + lap + '/' + totalLaps;
        var textStart = Math.floor((width - lapText.length) / 2);
        for (var i = 0; i < width; i++) {
            var isFilled = i < fillWidth;
            var bg = isFilled ? BG_BLUE : BG_BLACK;
            var textIndex = i - textStart;
            if (textIndex >= 0 && textIndex < lapText.length) {
                var attr = colorToAttr({ fg: YELLOW, bg: bg });
                frame.setData(x + 1 + i, y, lapText.charAt(textIndex), attr);
            }
            else {
                if (isFilled) {
                    var filledAttr = colorToAttr({ fg: LIGHTBLUE, bg: BG_BLUE });
                    frame.setData(x + 1 + i, y, ' ', filledAttr);
                }
                else {
                    var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
                    frame.setData(x + 1 + i, y, GLYPH.LIGHT_SHADE, emptyAttr);
                }
            }
        }
    };
    FrameRenderer.prototype.renderSpeedometerBarCompact = function (frame, speed, maxSpeed, x, y, width) {
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        var filledAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
        var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
        var highAttr = colorToAttr({ fg: LIGHTRED, bg: BG_BLACK });
        var boostAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
        frame.setData(x, y, '[', labelAttr);
        var fillAmount = Math.min(1.0, speed / maxSpeed);
        var isBoost = speed > maxSpeed;
        var fillWidth = Math.round(fillAmount * width);
        for (var i = 0; i < width; i++) {
            var attr;
            if (i < fillWidth) {
                if (isBoost) {
                    attr = boostAttr;
                }
                else if (fillAmount > 0.8) {
                    attr = highAttr;
                }
                else {
                    attr = filledAttr;
                }
            }
            else {
                attr = emptyAttr;
            }
            var char = (i < fillWidth) ? GLYPH.FULL_BLOCK : GLYPH.LIGHT_SHADE;
            frame.setData(x + 1 + i, y, char, attr);
        }
        frame.setData(x + width + 1, y, ']', labelAttr);
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
    FrameRenderer.prototype.triggerLightningBolt = function (targetX, targetY) {
        var x = targetX !== undefined ? targetX : 40;
        var y = targetY !== undefined ? targetY : this.height - 3;
        this._lightningBolts.push({
            x: x,
            startTime: Date.now(),
            targetY: y
        });
    };
    FrameRenderer.prototype.triggerLightningStrike = function (hitCount) {
        this.triggerLightningBolt(40, this.height - 3);
        var additionalBolts = Math.min(hitCount, 4);
        for (var i = 0; i < additionalBolts; i++) {
            var randomX = 10 + Math.floor(Math.random() * 60);
            var randomY = 8 + Math.floor(Math.random() * 10);
            this.triggerLightningBolt(randomX, randomY);
        }
    };
    FrameRenderer.prototype.renderLightningBolts = function () {
        if (this._lightningBolts.length === 0)
            return;
        var now = Date.now();
        var roadFrame = this.frameManager.getRoadFrame();
        if (!roadFrame)
            return;
        var boltDuration = 300;
        var flashCycleMs = 40;
        for (var i = this._lightningBolts.length - 1; i >= 0; i--) {
            var bolt = this._lightningBolts[i];
            var elapsed = now - bolt.startTime;
            if (elapsed > boltDuration) {
                this._lightningBolts.splice(i, 1);
                continue;
            }
            var progress = elapsed / boltDuration;
            var startY = 1;
            var currentEndY = Math.floor(startY + (bolt.targetY - startY) * Math.min(1, progress * 2));
            var colorPhase = Math.floor(now / flashCycleMs) % 3;
            var boltColor = colorPhase === 0 ? WHITE : (colorPhase === 1 ? YELLOW : LIGHTCYAN);
            var boltAttr = makeAttr(boltColor, BG_BLACK);
            var brightAttr = makeAttr(WHITE, BG_BLUE);
            var x = bolt.x;
            for (var y = startY; y <= currentEndY; y++) {
                var jitter = (y % 3 === 0) ? ((y % 6 === 0) ? 1 : -1) : 0;
                var drawX = x + jitter;
                var char = jitter > 0 ? '\\' : (jitter < 0 ? '/' : '|');
                var attr = (y === currentEndY && progress < 0.7) ? brightAttr : boltAttr;
                if (drawX >= 0 && drawX < this.width && y >= 0 && y < this.height - 1) {
                    roadFrame.setData(drawX, y, char, attr);
                }
                x = drawX;
            }
            if (progress > 0.3 && progress < 0.8) {
                var flashRadius = 2;
                var impactAttr = makeAttr(WHITE, BG_CYAN);
                for (var fx = -flashRadius; fx <= flashRadius; fx++) {
                    var impactX = bolt.x + fx;
                    if (impactX >= 0 && impactX < this.width && bolt.targetY < this.height - 1) {
                        roadFrame.setData(impactX, bolt.targetY, '*', impactAttr);
                    }
                }
            }
        }
    };
    FrameRenderer.prototype.cycle = function () {
        this.frameManager.cycle();
    };
    FrameRenderer.prototype.getRootFrame = function () {
        return this.frameManager ? this.frameManager.getRootFrame() : null;
    };
    FrameRenderer.prototype.getHudFrame = function () {
        return this.frameManager ? this.frameManager.getHudFrame() : null;
    };
    FrameRenderer.prototype.shutdown = function () {
        this.frameManager.shutdown();
        console.clear(BG_BLACK, false);
    };
    return FrameRenderer;
}());
