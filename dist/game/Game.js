"use strict";
var DEFAULT_CONFIG = {
    screenWidth: 80,
    screenHeight: 24,
    tickRate: 60,
    maxTicksPerFrame: 5
};
var Game = (function () {
    function Game(config, highScoreManager) {
        this.config = config || DEFAULT_CONFIG;
        this.running = false;
        this.paused = false;
        this.clock = new Clock();
        this.timestep = new FixedTimestep({
            tickRate: this.config.tickRate,
            maxTicksPerFrame: this.config.maxTicksPerFrame
        });
        this.inputMap = new InputMap();
        this.controls = new Controls(this.inputMap);
        this.renderer = new FrameRenderer(this.config.screenWidth, this.config.screenHeight);
        this.trackLoader = new TrackLoader();
        this.hud = new Hud();
        this.physicsSystem = new PhysicsSystem();
        this.raceSystem = new RaceSystem();
        this.itemSystem = new ItemSystem();
        this.highScoreManager = highScoreManager || null;
        this.state = null;
    }
    Game.prototype.initWithTrack = function (trackDef, raceMode, carSelection) {
        logInfo("Game.initWithTrack(): " + trackDef.name + " mode: " + (raceMode || RaceMode.GRAND_PRIX));
        var mode = raceMode || RaceMode.GRAND_PRIX;
        this.renderer.init();
        var themeMapping = {
            'synthwave': 'synthwave',
            'midnight_city': 'city_night',
            'beach_paradise': 'sunset_beach',
            'forest_night': 'twilight_forest',
            'haunted_hollow': 'haunted_hollow',
            'winter_wonderland': 'winter_wonderland',
            'cactus_canyon': 'cactus_canyon',
            'tropical_jungle': 'tropical_jungle',
            'candy_land': 'candy_land',
            'rainbow_road': 'rainbow_road',
            'dark_castle': 'dark_castle',
            'villains_lair': 'villains_lair',
            'ancient_ruins': 'ancient_ruins',
            'thunder_stadium': 'thunder_stadium',
            'glitch_circuit': 'glitch_circuit',
            'kaiju_rampage': 'kaiju_rampage',
            'underwater_grotto': 'underwater_grotto',
            'ansi_tunnel': 'ansi_tunnel'
        };
        var themeName = themeMapping[trackDef.themeId] || 'synthwave';
        if (this.renderer.setTheme) {
            this.renderer.setTheme(themeName);
        }
        var road = buildRoadFromDefinition(trackDef);
        var track = this.trackLoader.load("neon_coast_01");
        track.laps = trackDef.laps;
        track.name = trackDef.name;
        var selectedCarId = carSelection ? carSelection.carId : 'sports';
        var selectedColorId = carSelection ? carSelection.colorId : 'yellow';
        applyCarStats(selectedCarId);
        var playerVehicle = new Vehicle();
        playerVehicle.driver = new HumanDriver(this.controls);
        playerVehicle.isNPC = false;
        playerVehicle.carId = selectedCarId;
        playerVehicle.carColorId = selectedColorId;
        var carColor = getCarColor(selectedColorId);
        playerVehicle.color = carColor ? carColor.body : YELLOW;
        this.state = createInitialState(track, trackDef, road, playerVehicle, mode);
        if (mode === RaceMode.GRAND_PRIX) {
            this.spawnRacers(7, road);
            this.positionOnStartingGrid(road);
            for (var i = 0; i < this.state.vehicles.length; i++) {
                var v = this.state.vehicles[i];
                var drv = v.driver;
                if (drv && drv.setCanMove) {
                    drv.setCanMove(false);
                }
            }
        }
        else {
            var npcCount = trackDef.npcCount !== undefined ? trackDef.npcCount : 5;
            this.spawnNPCs(npcCount, road);
            playerVehicle.trackZ = 0;
            playerVehicle.playerX = 0;
        }
        this.physicsSystem.init(this.state);
        this.raceSystem.init(this.state);
        this.itemSystem.initFromTrack(track, road);
        var renderer = this.renderer;
        this.itemSystem.setCallbacks({
            onLightningStrike: function (hitCount) {
                if (renderer.triggerLightningStrike) {
                    renderer.triggerLightningStrike(hitCount);
                }
            }
        });
        this.hud.init(this.state.time);
        this.running = true;
        this.state.racing = false;
        debugLog.info("Game initialized with track: " + trackDef.name);
        debugLog.info("  Race mode: " + mode);
        debugLog.info("  Road segments: " + road.segments.length);
        debugLog.info("  Road length: " + road.totalLength);
        debugLog.info("  Laps: " + road.laps);
        debugLog.info("  Total racers: " + this.state.vehicles.length);
    };
    Game.prototype.init = function () {
        logInfo("Game.init()");
        var defaultTrack = getTrackDefinition('test_oval');
        if (defaultTrack) {
            this.initWithTrack(defaultTrack, RaceMode.GRAND_PRIX);
        }
        else {
            this.initWithTrack({
                id: 'fallback',
                name: 'Fallback Track',
                description: 'Default fallback',
                difficulty: 1,
                laps: 2,
                themeId: 'synthwave',
                estimatedLapTime: 30,
                sections: [
                    { type: 'straight', length: 15 },
                    { type: 'curve', length: 15, curve: 0.5 },
                    { type: 'straight', length: 15 },
                    { type: 'curve', length: 15, curve: 0.5 }
                ]
            });
        }
    };
    Game.prototype.run = function () {
        debugLog.info("Entering game loop");
        this.clock.reset();
        var frameCount = 0;
        var lastLogTime = 0;
        while (this.running) {
            var deltaMs = this.clock.getDelta();
            frameCount++;
            this.processInput();
            if (!this.paused && this.state) {
                var ticks = this.timestep.update(deltaMs);
                for (var i = 0; i < ticks; i++) {
                    this.tick(this.timestep.getDt());
                }
                this.controls.endFrame();
                if (this.state.time - lastLogTime >= 1.0) {
                    debugLog.logVehicle(this.state.playerVehicle);
                    lastLogTime = this.state.time;
                }
                if (this.state.finished && this.state.racing === false) {
                    debugLog.info("Race complete! Final time: " + this.state.time.toFixed(2));
                    this.showGameOverScreen();
                    this.running = false;
                }
            }
            this.render();
            mswait(1);
        }
    };
    Game.prototype.processInput = function () {
        var now = this.clock.now();
        var key;
        while ((key = console.inkey(K_NONE, 0)) !== '') {
            this.controls.handleKey(key, now);
        }
        this.controls.update(now);
        if (this.controls.wasJustPressed(GameAction.QUIT)) {
            debugLog.info("QUIT action triggered - exiting game loop");
            this.running = false;
            this.controls.endFrame();
            return;
        }
        if (this.controls.wasJustPressed(GameAction.PAUSE)) {
            this.togglePause();
            this.controls.endFrame();
            return;
        }
    };
    Game.prototype.tick = function (dt) {
        if (!this.state)
            return;
        if (!this.state.raceStarted && this.state.raceMode === RaceMode.GRAND_PRIX) {
            this.state.countdown -= dt;
            if (this.state.countdown <= 0) {
                this.state.raceStarted = true;
                this.state.racing = true;
                this.state.countdown = 0;
                this.state.time = 0;
                this.state.lapStartTime = 0;
                this.hud.init(0);
                for (var i = 0; i < this.state.vehicles.length; i++) {
                    var vehicle = this.state.vehicles[i];
                    var driver = vehicle.driver;
                    if (driver && driver.setCanMove) {
                        driver.setCanMove(true);
                    }
                }
                debugLog.info("Race started! GO!");
            }
            return;
        }
        this.state.time += dt;
        this.physicsSystem.update(this.state, dt);
        this.raceSystem.update(this.state, dt);
        if (this.state.raceMode !== RaceMode.GRAND_PRIX) {
            this.activateDormantNPCs();
            this.applyNPCPacing();
        }
        this.itemSystem.update(dt, this.state.vehicles, this.state.road.totalLength);
        this.itemSystem.checkPickups(this.state.vehicles, this.state.road);
        if (this.controls.consumeJustPressed(GameAction.USE_ITEM)) {
            var fireBackward = this.controls.getLastAccelAction() < 0;
            var currentSpeed = this.state.playerVehicle.speed;
            var currentAccel = this.controls.getAcceleration();
            this.itemSystem.useItem(this.state.playerVehicle, this.state.vehicles, fireBackward);
            if (currentAccel >= 0 && this.state.playerVehicle.speed < currentSpeed) {
                this.state.playerVehicle.speed = currentSpeed;
            }
        }
        for (var i = 0; i < this.state.vehicles.length; i++) {
            var vehicle = this.state.vehicles[i];
            if (vehicle === this.state.playerVehicle)
                continue;
            if (!vehicle.isRacer)
                continue;
            if (!vehicle.driver)
                continue;
            var intent = vehicle.driver.update(vehicle, this.state.track, dt);
            if (intent.useItem && vehicle.heldItem !== null) {
                this.itemSystem.useItem(vehicle, this.state.vehicles);
            }
        }
        Collision.processVehicleCollisions(this.state.vehicles);
        if (this.state.raceMode !== RaceMode.GRAND_PRIX) {
            this.checkNPCRespawn();
        }
        this.state.cameraX = this.state.playerVehicle.x;
    };
    Game.prototype.showGameOverScreen = function () {
        if (!this.state)
            return;
        debugLog.info("Showing game over screen, waiting for ENTER...");
        var player = this.state.playerVehicle;
        var finalPosition = player.racePosition;
        var finalTime = this.state.time;
        var bestLap = this.state.bestLapTime > 0 ? this.state.bestLapTime : 0;
        var trackTimePosition = 0;
        var lapTimePosition = 0;
        if (this.highScoreManager && this.state.trackDefinition) {
            var trackId = this.state.trackDefinition.id;
            trackTimePosition = this.highScoreManager.checkQualification(HighScoreType.TRACK_TIME, trackId, finalTime);
            if (bestLap > 0) {
                lapTimePosition = this.highScoreManager.checkQualification(HighScoreType.LAP_TIME, trackId, bestLap);
            }
            var playerName = "Player";
            try {
                if (typeof user !== 'undefined' && user && user.alias) {
                    playerName = user.alias;
                }
            }
            catch (e) {
            }
            if (trackTimePosition > 0) {
                this.highScoreManager.submitScore(HighScoreType.TRACK_TIME, trackId, playerName, finalTime, this.state.track.name);
                logInfo("NEW HIGH SCORE! Track time #" + trackTimePosition + ": " + finalTime.toFixed(2));
            }
            if (lapTimePosition > 0) {
                this.highScoreManager.submitScore(HighScoreType.LAP_TIME, trackId, playerName, bestLap, this.state.track.name);
                logInfo("NEW HIGH SCORE! Lap time #" + lapTimePosition + ": " + bestLap.toFixed(2));
            }
        }
        this.renderResultsScreen(finalPosition, finalTime, bestLap);
        while (true) {
            var key = console.inkey(K_NONE, 100);
            if (key === '\r' || key === '\n') {
                debugLog.info("ENTER pressed, exiting game over screen");
                break;
            }
        }
        if (this.highScoreManager && this.state.trackDefinition && (trackTimePosition > 0 || lapTimePosition > 0)) {
            var trackId = this.state.trackDefinition.id;
            showTwoColumnHighScores(trackId, this.state.track.name, this.highScoreManager, trackTimePosition, lapTimePosition);
        }
    };
    Game.prototype.renderResultsScreen = function (position, totalTime, bestLap) {
        console.clear(BG_BLACK, false);
        var titleAttr = colorToAttr({ fg: YELLOW, bg: BG_BLACK });
        var labelAttr = colorToAttr({ fg: WHITE, bg: BG_BLACK });
        var valueAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
        var boxAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
        var promptAttr = colorToAttr({ fg: LIGHTMAGENTA, bg: BG_BLACK });
        var viewWidth = 80;
        var viewHeight = 24;
        var boxWidth = 40;
        var boxHeight = 12;
        var boxX = Math.floor((viewWidth - boxWidth) / 2);
        var topY = Math.floor((viewHeight - boxHeight) / 2);
        console.gotoxy(boxX + 1, topY + 1);
        console.attributes = boxAttr;
        console.print(GLYPH.DBOX_TL);
        for (var i = 1; i < boxWidth - 1; i++) {
            console.print(GLYPH.DBOX_H);
        }
        console.print(GLYPH.DBOX_TR);
        for (var j = 1; j < boxHeight - 1; j++) {
            console.gotoxy(boxX + 1, topY + 1 + j);
            console.print(GLYPH.DBOX_V);
            for (var i = 1; i < boxWidth - 1; i++) {
                console.print(' ');
            }
            console.print(GLYPH.DBOX_V);
        }
        console.gotoxy(boxX + 1, topY + boxHeight);
        console.print(GLYPH.DBOX_BL);
        for (var i = 1; i < boxWidth - 1; i++) {
            console.print(GLYPH.DBOX_H);
        }
        console.print(GLYPH.DBOX_BR);
        var title = "=== RACE COMPLETE ===";
        console.gotoxy(boxX + 1 + Math.floor((boxWidth - title.length) / 2), topY + 3);
        console.attributes = titleAttr;
        console.print(title);
        var posSuffix = PositionIndicator.getOrdinalSuffix(position);
        console.gotoxy(boxX + 5, topY + 5);
        console.attributes = labelAttr;
        console.print("FINAL POSITION:");
        console.gotoxy(boxX + 23, topY + 5);
        console.attributes = valueAttr;
        console.print(position + posSuffix);
        console.gotoxy(boxX + 5, topY + 6);
        console.attributes = labelAttr;
        console.print("TOTAL TIME:");
        console.gotoxy(boxX + 23, topY + 6);
        console.attributes = valueAttr;
        console.print(LapTimer.format(totalTime));
        console.gotoxy(boxX + 5, topY + 7);
        console.attributes = labelAttr;
        console.print("BEST LAP:");
        console.gotoxy(boxX + 23, topY + 7);
        console.attributes = valueAttr;
        console.print(bestLap > 0 ? LapTimer.format(bestLap) : "--:--.--");
        console.gotoxy(boxX + 5, topY + 9);
        console.attributes = labelAttr;
        console.print("TRACK:");
        console.gotoxy(boxX + 23, topY + 9);
        console.attributes = valueAttr;
        console.print(this.state.track.name);
        var prompt = "Press ENTER to continue";
        console.gotoxy(boxX + 1 + Math.floor((boxWidth - prompt.length) / 2), topY + 11);
        console.attributes = promptAttr;
        console.print(prompt);
    };
    Game.prototype.activateDormantNPCs = function () {
        if (!this.state)
            return;
        var playerZ = this.state.playerVehicle.trackZ;
        var roadLength = this.state.road.totalLength;
        for (var i = 0; i < this.state.vehicles.length; i++) {
            var npc = this.state.vehicles[i];
            if (!npc.isNPC || npc.isRacer)
                continue;
            var driver = npc.driver;
            if (driver.isActive())
                continue;
            var dist = npc.trackZ - playerZ;
            if (dist < 0)
                dist += roadLength;
            if (dist < driver.getActivationRange()) {
                driver.activate();
                debugLog.info("NPC activated at distance " + dist.toFixed(0));
            }
        }
    };
    Game.prototype.checkNPCRespawn = function () {
        if (!this.state)
            return;
        var playerZ = this.state.playerVehicle.trackZ;
        var roadLength = this.state.road.totalLength;
        var respawnDistance = 100;
        var npcs = [];
        for (var i = 0; i < this.state.vehicles.length; i++) {
            if (this.state.vehicles[i].isNPC && !this.state.vehicles[i].isRacer) {
                npcs.push(this.state.vehicles[i]);
            }
        }
        if (npcs.length === 0)
            return;
        var idealSpacing = roadLength / npcs.length;
        var respawnCount = 0;
        for (var j = 0; j < npcs.length; j++) {
            var npc = npcs[j];
            var distBehind = playerZ - npc.trackZ;
            if (distBehind > respawnDistance) {
                var slotOffset = idealSpacing * (respawnCount + 1);
                var newZ = (playerZ + slotOffset) % roadLength;
                npc.trackZ = newZ;
                npc.z = newZ;
                var driver = npc.driver;
                driver.deactivate();
                npc.speed = 0;
                var laneChoice = Math.random();
                if (laneChoice < 0.4) {
                    npc.playerX = -0.35 + (Math.random() - 0.5) * 0.2;
                }
                else if (laneChoice < 0.8) {
                    npc.playerX = 0.35 + (Math.random() - 0.5) * 0.2;
                }
                else {
                    npc.playerX = (Math.random() - 0.5) * 0.3;
                }
                npc.isCrashed = false;
                npc.crashTimer = 0;
                npc.flashTimer = 0;
                respawnCount++;
            }
        }
    };
    Game.prototype.applyNPCPacing = function () {
        if (!this.state)
            return;
        var playerZ = this.state.playerVehicle.trackZ;
        var roadLength = this.state.road.totalLength;
        for (var i = 0; i < this.state.vehicles.length; i++) {
            var npc = this.state.vehicles[i];
            if (!npc.isNPC)
                continue;
            var driver = npc.driver;
            if (!driver.isActive())
                continue;
            var distance = npc.trackZ - playerZ;
            if (distance < 0)
                distance += roadLength;
            var commuterBaseSpeed = VEHICLE_PHYSICS.MAX_SPEED * driver.getSpeedFactor();
            if (distance < 100) {
                var slowFactor = 0.7 + (distance / 100) * 0.3;
                npc.speed = commuterBaseSpeed * slowFactor;
            }
            else {
                npc.speed = commuterBaseSpeed;
            }
        }
    };
    Game.prototype.render = function () {
        if (!this.state)
            return;
        var trackZ = this.state.playerVehicle.z;
        var vehicle = this.state.playerVehicle;
        var road = this.state.road;
        var curvature = road.getCurvature(trackZ);
        var playerSteer = vehicle.playerX;
        var speed = this.paused ? 0 : vehicle.speed;
        var dt = 1.0 / this.config.tickRate;
        var accel = this.controls.getAcceleration();
        var brakeLightsOn = accel <= 0;
        if (this.renderer.setBrakeLightState) {
            this.renderer.setBrakeLightState(brakeLightsOn);
        }
        this.renderer.beginFrame();
        this.renderer.renderSky(trackZ, curvature, playerSteer, speed, dt);
        this.renderer.renderRoad(trackZ, this.state.cameraX, this.state.track, this.state.road);
        this.renderer.renderEntities(this.state.playerVehicle, this.state.vehicles, this.itemSystem.getItemBoxes(), this.itemSystem.getProjectiles());
        var hudData = this.hud.compute(this.state.playerVehicle, this.state.track, this.state.road, this.state.vehicles, this.state.time, this.state.countdown, this.state.raceMode);
        this.renderer.renderHud(hudData);
        if (this.paused) {
            this.renderPauseOverlay();
        }
        this.renderer.endFrame();
    };
    Game.prototype.renderPauseOverlay = function () {
        var pausedArt = [
            ' ####   ###  #   # ### #### ####  ',
            ' #   # #   # #   # #   #    #   # ',
            ' ####  ##### #   # ### #### #   # ',
            ' #     #   # #   #   # #    #   # ',
            ' #     #   #  ###  ### #### ####  '
        ];
        var rainbowColors = [LIGHTRED, YELLOW, LIGHTGREEN, LIGHTCYAN, LIGHTBLUE, LIGHTMAGENTA];
        var colorIndex = Math.floor((system.timer * 8)) % rainbowColors.length;
        var textColor = rainbowColors[colorIndex];
        var attr = makeAttr(textColor, BG_BLACK);
        var textWidth = pausedArt[0].length;
        var textHeight = pausedArt.length;
        var startX = Math.floor((80 - textWidth) / 2);
        var startY = Math.floor((24 - textHeight) / 2);
        var hudFrame = this.renderer.getHudFrame ? this.renderer.getHudFrame() : null;
        if (!hudFrame)
            return;
        var boxPadding = 2;
        var boxAttr = makeAttr(DARKGRAY, BG_BLACK);
        for (var by = startY - boxPadding; by < startY + textHeight + boxPadding; by++) {
            for (var bx = startX - boxPadding; bx < startX + textWidth + boxPadding; bx++) {
                if (bx >= 0 && bx < 80 && by >= 0 && by < 24) {
                    hudFrame.setData(bx + 1, by + 1, GLYPH.MEDIUM_SHADE, boxAttr);
                }
            }
        }
        for (var row = 0; row < textHeight; row++) {
            var line = pausedArt[row];
            for (var col = 0; col < line.length; col++) {
                var ch = line.charAt(col);
                var x = startX + col;
                var y = startY + row;
                if (x >= 0 && x < 80 && y >= 0 && y < 24) {
                    if (ch !== ' ') {
                        hudFrame.setData(x + 1, y + 1, GLYPH.FULL_BLOCK, attr);
                    }
                }
            }
        }
        var resumeText = 'Press P to resume';
        var resumeX = Math.floor((80 - resumeText.length) / 2);
        var resumeY = startY + textHeight + 2;
        var resumeAttr = makeAttr(WHITE, BG_BLACK);
        for (var i = 0; i < resumeText.length; i++) {
            if (resumeX + i >= 0 && resumeX + i < 80 && resumeY >= 0 && resumeY < 24) {
                hudFrame.setData(resumeX + i + 1, resumeY + 1, resumeText.charAt(i), resumeAttr);
            }
        }
    };
    Game.prototype.togglePause = function () {
        this.paused = !this.paused;
        if (!this.paused) {
            this.clock.reset();
            this.timestep.reset();
        }
        logInfo("Game " + (this.paused ? "paused" : "resumed"));
    };
    Game.prototype.spawnRacers = function (count, _road) {
        if (!this.state)
            return;
        var racerColors = [
            { body: LIGHTRED, highlight: WHITE },
            { body: LIGHTBLUE, highlight: LIGHTCYAN },
            { body: LIGHTGREEN, highlight: WHITE },
            { body: LIGHTMAGENTA, highlight: WHITE },
            { body: LIGHTCYAN, highlight: WHITE },
            { body: WHITE, highlight: LIGHTGRAY },
            { body: BROWN, highlight: YELLOW }
        ];
        var skillLevels = [0.82, 0.75, 0.58, 0.52, 0.42, 0.38, 0.35];
        for (var i = 0; i < count && i < racerColors.length; i++) {
            var racer = new Vehicle();
            var skill = skillLevels[i] || 0.6;
            racer.driver = new RacerDriver(skill);
            racer.isNPC = true;
            racer.isRacer = true;
            var typeIndex = Math.floor(Math.random() * NPC_VEHICLE_TYPES.length);
            racer.npcType = NPC_VEHICLE_TYPES[typeIndex];
            var colorPalette = racerColors[i];
            racer.color = colorPalette.body;
            racer.npcColorIndex = i;
            racer.trackZ = 0;
            racer.z = 0;
            racer.playerX = 0;
            this.state.vehicles.push(racer);
        }
        debugLog.info("Spawned " + count + " CPU racers for Grand Prix");
    };
    Game.prototype.positionOnStartingGrid = function (_road) {
        if (!this.state)
            return;
        var vehicles = this.state.vehicles;
        var gridRowSpacing = 20;
        var gridColSpacing = 0.5;
        var playerIdx = -1;
        for (var p = 0; p < vehicles.length; p++) {
            if (!vehicles[p].isNPC) {
                playerIdx = p;
                break;
            }
        }
        var numAICars = vehicles.length - 1;
        var totalGridLength = Math.ceil(numAICars / 2) * gridRowSpacing;
        var aiSlot = 0;
        for (var v = 0; v < vehicles.length; v++) {
            var vehicle = vehicles[v];
            if (v === playerIdx) {
                vehicle.trackZ = totalGridLength + gridRowSpacing;
                vehicle.z = vehicle.trackZ;
                vehicle.playerX = 0;
            }
            else {
                var row = Math.floor(aiSlot / 2);
                var col = aiSlot % 2;
                vehicle.trackZ = totalGridLength - (row * gridRowSpacing);
                vehicle.z = vehicle.trackZ;
                vehicle.playerX = (col === 0) ? -gridColSpacing : gridColSpacing;
                aiSlot++;
            }
            vehicle.speed = 0;
            vehicle.lap = 1;
            vehicle.checkpoint = 0;
            vehicle.racePosition = 1;
            debugLog.info("Grid slot " + v + " (NPC=" + vehicle.isNPC + "): trackZ=" + vehicle.trackZ.toFixed(0) + " X=" + vehicle.playerX.toFixed(2));
        }
        debugLog.info("Positioned " + vehicles.length + " vehicles on starting grid (player at front)");
    };
    Game.prototype.spawnNPCs = function (count, road) {
        if (!this.state)
            return;
        var roadLength = road.totalLength;
        var spacing = roadLength / count;
        for (var i = 0; i < count; i++) {
            var npc = new Vehicle();
            npc.driver = new CommuterDriver();
            npc.isNPC = true;
            var typeIndex = Math.floor(Math.random() * NPC_VEHICLE_TYPES.length);
            npc.npcType = NPC_VEHICLE_TYPES[typeIndex];
            npc.npcColorIndex = Math.floor(Math.random() * NPC_VEHICLE_COLORS.length);
            var colorPalette = NPC_VEHICLE_COLORS[npc.npcColorIndex];
            npc.color = colorPalette.body;
            var baseZ = spacing * i;
            var jitter = spacing * 0.2 * (Math.random() - 0.5);
            npc.trackZ = (baseZ + jitter + roadLength) % roadLength;
            npc.z = npc.trackZ;
            var laneOffset = (i % 2 === 0) ? -0.3 : 0.3;
            npc.playerX = laneOffset + (Math.random() - 0.5) * 0.4;
            this.state.vehicles.push(npc);
        }
        debugLog.info("Spawned " + count + " NPC commuters");
    };
    Game.prototype.isRunning = function () {
        return this.running;
    };
    Game.prototype.getFinalRaceResults = function () {
        if (!this.state || !this.state.finished)
            return null;
        var positions = [];
        positions.push({
            id: 1,
            position: this.state.playerVehicle.racePosition
        });
        var aiId = 2;
        for (var i = 0; i < this.state.vehicles.length; i++) {
            var v = this.state.vehicles[i];
            if (v !== this.state.playerVehicle && v.isRacer) {
                positions.push({
                    id: aiId++,
                    position: v.racePosition
                });
            }
        }
        return {
            positions: positions,
            playerTime: this.state.time,
            playerBestLap: this.state.bestLapTime > 0 ? this.state.bestLapTime : this.state.time / this.state.track.laps
        };
    };
    Game.prototype.shutdown = function () {
        logInfo("Game.shutdown()");
        this.renderer.shutdown();
        this.controls.clearAll();
    };
    return Game;
}());
