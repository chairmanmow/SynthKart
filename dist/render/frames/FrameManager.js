"use strict";
var FrameManager = (function () {
    function FrameManager(width, height, horizonY) {
        this.width = width;
        this.height = height;
        this.horizonY = horizonY;
        this.layers = [];
        this.roadsidePool = [];
        this.vehicleFrames = [];
        this.skyGridFrame = null;
        this.mountainsFrame = null;
        this.sunFrame = null;
        this.groundGridFrame = null;
        this.roadFrame = null;
        this.hudFrame = null;
        this.rootFrame = null;
    }
    FrameManager.prototype.init = function () {
        this.rootFrame = new Frame(1, 1, this.width, this.height, BG_BLACK);
        this.rootFrame.open();
        this.skyGridFrame = new Frame(1, 1, this.width, this.horizonY, BG_BLACK, this.rootFrame);
        this.skyGridFrame.open();
        this.addLayer(this.skyGridFrame, 'skyGrid', 1);
        this.mountainsFrame = new Frame(1, 1, this.width, this.horizonY, BG_BLACK, this.rootFrame);
        this.mountainsFrame.transparent = true;
        this.mountainsFrame.open();
        this.addLayer(this.mountainsFrame, 'mountains', 2);
        this.sunFrame = new Frame(1, 1, this.width, this.horizonY, BG_BLACK, this.rootFrame);
        this.sunFrame.transparent = true;
        this.sunFrame.open();
        this.addLayer(this.sunFrame, 'sun', 3);
        var roadHeight = this.height - this.horizonY;
        this.groundGridFrame = new Frame(1, this.horizonY + 1, this.width, roadHeight, BG_BLACK, this.rootFrame);
        this.groundGridFrame.open();
        this.addLayer(this.groundGridFrame, 'groundGrid', 4);
        this.roadFrame = new Frame(1, this.horizonY + 1, this.width, roadHeight, BG_BLACK, this.rootFrame);
        this.roadFrame.transparent = true;
        this.roadFrame.open();
        this.addLayer(this.roadFrame, 'road', 5);
        this.hudFrame = new Frame(1, 1, this.width, this.height, BG_BLACK, this.rootFrame);
        this.hudFrame.transparent = true;
        this.hudFrame.open();
        this.addLayer(this.hudFrame, 'hud', 100);
        this.initRoadsidePool(20);
        this.initVehicleFrames(8);
    };
    FrameManager.prototype.addLayer = function (frame, name, zIndex) {
        this.layers.push({ frame: frame, name: name, zIndex: zIndex });
    };
    FrameManager.prototype.initRoadsidePool = function (count) {
        for (var i = 0; i < count; i++) {
            var spriteFrame = new Frame(1, 1, 8, 6, BG_BLACK, this.rootFrame);
            spriteFrame.transparent = true;
            this.roadsidePool.push(spriteFrame);
        }
    };
    FrameManager.prototype.initVehicleFrames = function (count) {
        for (var i = 0; i < count; i++) {
            var vehicleFrame = new Frame(1, 1, 7, 4, BG_BLACK, this.rootFrame);
            vehicleFrame.transparent = true;
            this.vehicleFrames.push(vehicleFrame);
        }
    };
    FrameManager.prototype.getSkyGridFrame = function () {
        return this.skyGridFrame;
    };
    FrameManager.prototype.getMountainsFrame = function () {
        return this.mountainsFrame;
    };
    FrameManager.prototype.getSunFrame = function () {
        return this.sunFrame;
    };
    FrameManager.prototype.getRoadFrame = function () {
        return this.roadFrame;
    };
    FrameManager.prototype.getGroundGridFrame = function () {
        return this.groundGridFrame;
    };
    FrameManager.prototype.getHudFrame = function () {
        return this.hudFrame;
    };
    FrameManager.prototype.getRoadsideFrame = function (index) {
        if (index >= 0 && index < this.roadsidePool.length) {
            return this.roadsidePool[index];
        }
        return null;
    };
    FrameManager.prototype.getVehicleFrame = function (index) {
        if (index >= 0 && index < this.vehicleFrames.length) {
            return this.vehicleFrames[index];
        }
        return null;
    };
    FrameManager.prototype.getRoadsidePoolSize = function () {
        return this.roadsidePool.length;
    };
    FrameManager.prototype.positionRoadsideFrame = function (index, x, y, visible) {
        var frame = this.roadsidePool[index];
        if (!frame)
            return;
        if (visible) {
            frame.moveTo(x, y);
            if (!frame.is_open) {
                frame.open();
            }
        }
        else {
            if (frame.is_open) {
                frame.close();
            }
        }
    };
    FrameManager.prototype.positionVehicleFrame = function (index, x, y, visible) {
        var frame = this.vehicleFrames[index];
        if (!frame)
            return;
        if (visible) {
            frame.moveTo(x, y);
            if (!frame.is_open) {
                frame.open();
            }
            frame.top();
        }
        else {
            if (frame.is_open) {
                frame.close();
            }
        }
    };
    FrameManager.prototype.cycle = function () {
        this.rootFrame.cycle();
    };
    FrameManager.prototype.clearFrame = function (frame) {
        if (frame) {
            frame.clear();
        }
    };
    FrameManager.prototype.getRootFrame = function () {
        return this.rootFrame;
    };
    FrameManager.prototype.shutdown = function () {
        if (this.hudFrame)
            this.hudFrame.close();
        for (var i = 0; i < this.vehicleFrames.length; i++) {
            if (this.vehicleFrames[i].is_open) {
                this.vehicleFrames[i].close();
            }
        }
        for (var j = 0; j < this.roadsidePool.length; j++) {
            if (this.roadsidePool[j].is_open) {
                this.roadsidePool[j].close();
            }
        }
        if (this.roadFrame)
            this.roadFrame.close();
        if (this.sunFrame)
            this.sunFrame.close();
        if (this.mountainsFrame)
            this.mountainsFrame.close();
        if (this.skyGridFrame)
            this.skyGridFrame.close();
        this.rootFrame.close();
    };
    return FrameManager;
}());
