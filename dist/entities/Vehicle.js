"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var VEHICLE_PHYSICS = {
    MAX_SPEED: 300,
    ACCEL: 150,
    BRAKE: 250,
    DECEL: 20,
    OFFROAD_DECEL: 200,
    STEER_RATE: 2.0,
    STEER_SPEED_FACTOR: 0.3,
    CENTRIFUGAL: 0.6,
    ROAD_HALF_WIDTH: 1.0,
    OFFROAD_LIMIT: 1.8,
    CRASH_TIME: 1.5,
};
var Vehicle = (function (_super) {
    __extends(Vehicle, _super);
    function Vehicle() {
        var _this = _super.call(this) || this;
        _this.speed = 0;
        _this.playerX = 0;
        _this.trackZ = 0;
        _this.x = 0;
        _this.z = 0;
        _this.driver = null;
        _this.lap = 1;
        _this.checkpoint = 0;
        _this.racePosition = 1;
        _this.heldItem = null;
        _this.color = YELLOW;
        _this.isOffRoad = false;
        _this.isCrashed = false;
        _this.crashTimer = 0;
        _this.flashTimer = 0;
        _this.isNPC = false;
        _this.npcType = 'sedan';
        _this.npcColorIndex = 0;
        return _this;
    }
    Vehicle.prototype.updatePhysics = function (road, intent, dt) {
        if (this.flashTimer > 0) {
            this.flashTimer -= dt;
            if (this.flashTimer < 0)
                this.flashTimer = 0;
        }
        if (this.isCrashed) {
            this.crashTimer -= dt;
            if (this.crashTimer <= 0) {
                this.isCrashed = false;
                this.crashTimer = 0;
                this.playerX = 0;
                this.flashTimer = 0.5;
            }
            return;
        }
        if (intent.accelerate > 0) {
            this.speed += VEHICLE_PHYSICS.ACCEL * dt;
        }
        else if (intent.accelerate < 0) {
            this.speed -= VEHICLE_PHYSICS.BRAKE * dt;
        }
        else {
            this.speed -= VEHICLE_PHYSICS.DECEL * dt;
        }
        this.isOffRoad = Math.abs(this.playerX) > VEHICLE_PHYSICS.ROAD_HALF_WIDTH;
        if (this.isOffRoad) {
            this.speed -= VEHICLE_PHYSICS.OFFROAD_DECEL * dt;
            if (this.flashTimer <= 0) {
                this.flashTimer = 0.15;
            }
            if (this.speed < 10) {
                this.speed = 0;
                this.playerX = 0;
                this.isOffRoad = false;
                this.flashTimer = 0.5;
            }
        }
        this.speed = clamp(this.speed, 0, VEHICLE_PHYSICS.MAX_SPEED);
        var speedRatio = this.speed / VEHICLE_PHYSICS.MAX_SPEED;
        if (this.speed >= 5) {
            var steerMult = 1.0 - (speedRatio * VEHICLE_PHYSICS.STEER_SPEED_FACTOR);
            var steerDelta = intent.steer * VEHICLE_PHYSICS.STEER_RATE * steerMult * dt;
            this.playerX += steerDelta;
        }
        var curve = road.getCurvature(this.trackZ);
        var centrifugal = curve * speedRatio * VEHICLE_PHYSICS.CENTRIFUGAL * dt;
        this.playerX += centrifugal;
        if (Math.abs(this.playerX) > VEHICLE_PHYSICS.OFFROAD_LIMIT) {
            this.triggerCrash();
            return;
        }
        this.trackZ += this.speed * dt;
        if (this.trackZ >= road.totalLength) {
            this.trackZ = this.trackZ % road.totalLength;
        }
        this.z = this.trackZ;
        this.x = this.playerX * 20;
    };
    Vehicle.prototype.triggerCrash = function () {
        debugLog.warn("CRASH! playerX=" + this.playerX.toFixed(3) + " (limit=" + VEHICLE_PHYSICS.OFFROAD_LIMIT + ")");
        debugLog.info("  trackZ=" + this.trackZ.toFixed(1) + " speed=" + this.speed.toFixed(1));
        debugLog.info("  Entering recovery for " + VEHICLE_PHYSICS.CRASH_TIME + " seconds");
        this.isCrashed = true;
        this.crashTimer = VEHICLE_PHYSICS.CRASH_TIME;
        this.speed = 0;
    };
    return Vehicle;
}(Entity));
