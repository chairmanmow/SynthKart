"use strict";
var Renderer = (function () {
    function Renderer(width, height) {
        this.width = width;
        this.height = height;
        this.horizonY = 8;
        this.frame = null;
        this.useFrame = false;
        this.composer = new SceneComposer(width, height);
        this.skylineRenderer = new SkylineRenderer(this.composer, this.horizonY);
        this.roadRenderer = new RoadRenderer(this.composer, this.horizonY);
        this.spriteRenderer = new SpriteRenderer(this.composer, this.horizonY);
        this.hudRenderer = new HudRenderer(this.composer);
    }
    Renderer.prototype.init = function () {
        try {
            load("frame.js");
            this.frame = new Frame(1, 1, this.width, this.height, BG_BLACK);
            this.frame.open();
            this.useFrame = true;
            logInfo("Renderer: Using frame.js");
        }
        catch (e) {
            logWarning("Renderer: frame.js not available, using direct console");
            this.useFrame = false;
        }
        console.clear(BG_BLACK, false);
    };
    Renderer.prototype.beginFrame = function () {
        this.composer.clear();
    };
    Renderer.prototype.getComposer = function () {
        return this.composer;
    };
    Renderer.prototype.renderSky = function (trackPosition, curvature, playerSteer, speed, dt) {
        this.skylineRenderer.render(trackPosition, curvature, playerSteer, speed, dt);
    };
    Renderer.prototype.renderRoad = function (trackPosition, cameraX, track, road) {
        this.roadRenderer.render(trackPosition, cameraX, track, road);
    };
    Renderer.prototype.renderEntities = function (playerVehicle, vehicles, items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!item.isAvailable())
                continue;
            var relZ = item.z - playerVehicle.z;
            var relX = item.x - playerVehicle.x;
            this.spriteRenderer.renderItemBox(relZ, relX);
        }
        var sortedVehicles = vehicles.slice();
        sortedVehicles.sort(function (a, b) {
            return (b.z - playerVehicle.z) - (a.z - playerVehicle.z);
        });
        for (var j = 0; j < sortedVehicles.length; j++) {
            var v = sortedVehicles[j];
            if (v.id === playerVehicle.id)
                continue;
            var relZ = v.z - playerVehicle.z;
            var relX = v.x - playerVehicle.x;
            this.spriteRenderer.renderOtherVehicle(relZ, relX, v.color);
        }
        this.spriteRenderer.renderPlayerVehicle(playerVehicle.x);
    };
    Renderer.prototype.renderHud = function (hudData) {
        this.hudRenderer.render(hudData);
    };
    Renderer.prototype.endFrame = function () {
        var buffer = this.composer.getBuffer();
        if (this.useFrame && this.frame) {
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var cell = buffer[y][x];
                    this.frame.setData(x + 1, y + 1, cell.char, cell.attr);
                }
            }
            this.frame.draw();
        }
        else {
            console.home();
            for (var y = 0; y < this.height; y++) {
                var line = '';
                for (var x = 0; x < this.width; x++) {
                    line += buffer[y][x].char;
                }
                console.print(line);
                if (y < this.height - 1) {
                    console.print("\r\n");
                }
            }
        }
    };
    Renderer.prototype.getRootFrame = function () {
        return this.frame;
    };
    Renderer.prototype.shutdown = function () {
        if (this.frame) {
            this.frame.close();
            this.frame = null;
        }
        console.attributes = LIGHTGRAY;
        console.clear(BG_BLACK, false);
    };
    return Renderer;
}());
