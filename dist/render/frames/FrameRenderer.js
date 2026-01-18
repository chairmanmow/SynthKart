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
        this._staticElementsDirty = false;
        logDebug('Static elements rendered, dirty=' + this._staticElementsDirty);
    };
    FrameRenderer.prototype.beginFrame = function () {
    };
    FrameRenderer.prototype.renderSky = function (trackPosition, curvature, playerSteer, speed, dt) {
        if (this.activeTheme.name === 'glitch_circuit' && typeof GlitchState !== 'undefined') {
            GlitchState.update(trackPosition, dt || 0.016);
        }
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
        if (this.activeTheme.name === 'glitch_circuit' && typeof GlitchState !== 'undefined') {
            this.applyGlitchEffects();
        }
        this.cycle();
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
    FrameRenderer.prototype.renderLavaGround = function (trackPosition) {
        var frame = this.frameManager.getGroundGridFrame();
        if (!frame)
            return;
        var ground = this.activeTheme.ground;
        if (!ground)
            return;
        frame.clear();
        var rockAttr = makeAttr(ground.primary.fg, ground.primary.bg);
        var lavaAttr = makeAttr(ground.secondary.fg, ground.secondary.bg);
        var frameHeight = this.height - this.horizonY;
        for (var y = 0; y < frameHeight - 1; y++) {
            for (var x = 0; x < this.width; x++) {
                frame.setData(x, y, GLYPH.DARK_SHADE, rockAttr);
            }
        }
        var flowPhase = Math.floor(trackPosition / 20) % 8;
        for (var y = 0; y < frameHeight - 1; y++) {
            var distFromHorizon = y + 1;
            for (var crack = 0; crack < 4; crack++) {
                var baseX = crack * 20 + 5;
                var waveOffset = Math.sin((y + flowPhase + crack * 3) * 0.5) * 3;
                var x = Math.floor(baseX + waveOffset);
                if (x >= 0 && x < this.width) {
                    var intensity = ((y + flowPhase * 2 + crack) % 4);
                    var char = (intensity < 2) ? '*' : '~';
                    frame.setData(x, y, char, lavaAttr);
                    if (x > 0)
                        frame.setData(x - 1, y, GLYPH.LIGHT_SHADE, rockAttr);
                    if (x < this.width - 1)
                        frame.setData(x + 1, y, GLYPH.LIGHT_SHADE, rockAttr);
                }
            }
            if (distFromHorizon > frameHeight / 2) {
                var poolChance = ((y * 17 + flowPhase) % 11);
                if (poolChance === 0) {
                    var poolX = (y * 13 + flowPhase * 5) % this.width;
                    frame.setData(poolX, y, GLYPH.MEDIUM_SHADE, lavaAttr);
                }
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
