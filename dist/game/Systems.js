"use strict";
var PhysicsSystem = (function () {
    function PhysicsSystem() {
    }
    PhysicsSystem.prototype.init = function (_state) {
    };
    PhysicsSystem.prototype.update = function (state, dt) {
        for (var i = 0; i < state.vehicles.length; i++) {
            var vehicle = state.vehicles[i];
            if (!vehicle.active)
                continue;
            var intent = { accelerate: 0, steer: 0, useItem: false };
            if (vehicle.driver) {
                intent = vehicle.driver.update(vehicle, state.track, dt);
            }
            vehicle.updatePhysics(state.road, intent, dt);
        }
    };
    return PhysicsSystem;
}());
var RaceSystem = (function () {
    function RaceSystem() {
        this.lastTrackZ = {};
    }
    RaceSystem.prototype.init = function (state) {
        for (var i = 0; i < state.vehicles.length; i++) {
            var vehicle = state.vehicles[i];
            this.lastTrackZ[vehicle.id] = vehicle.trackZ || 0;
        }
    };
    RaceSystem.prototype.update = function (state, _dt) {
        if (state.finished)
            return;
        var roadLength = state.road.totalLength;
        for (var i = 0; i < state.vehicles.length; i++) {
            var vehicle = state.vehicles[i];
            if (vehicle.isCrashed || !vehicle.active)
                continue;
            var lastZ = this.lastTrackZ[vehicle.id] || 0;
            var currentZ = vehicle.trackZ || 0;
            var crossedFinishLine = (lastZ > roadLength * 0.75 && currentZ < roadLength * 0.25);
            if (crossedFinishLine) {
                vehicle.lap++;
                debugLog.info("LAP COMPLETE! Vehicle " + vehicle.id + " now on lap " + vehicle.lap + "/" + state.track.laps);
                debugLog.info("  lastZ=" + lastZ.toFixed(1) + " currentZ=" + currentZ.toFixed(1) + " roadLength=" + roadLength);
                if (!vehicle.isNPC && vehicle.lap > state.track.laps) {
                    state.finished = true;
                    state.racing = false;
                    debugLog.info("RACE FINISHED! Final time: " + state.time.toFixed(2));
                }
            }
            this.lastTrackZ[vehicle.id] = currentZ;
        }
        PositionIndicator.calculatePositions(state.vehicles);
    };
    return RaceSystem;
}());
