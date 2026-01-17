"use strict";
var Collision = (function () {
    function Collision() {
    }
    Collision.aabbOverlap = function (a, b) {
        return Math.abs(a.x - b.x) < (a.halfWidth + b.halfWidth) &&
            Math.abs(a.z - b.z) < (a.halfLength + b.halfLength);
    };
    Collision.vehicleToAABB = function (v) {
        return {
            x: v.x,
            z: v.z,
            halfWidth: 4,
            halfLength: 6
        };
    };
    Collision.isOffTrack = function (vehicle, track) {
        var centerX = track.getCenterlineX(vehicle.z);
        var lateralDist = Math.abs(vehicle.x - centerX);
        return lateralDist > track.width / 2;
    };
    Collision.resolveBoundary = function (vehicle, track) {
        var centerX = track.getCenterlineX(vehicle.z);
        var halfWidth = track.width / 2;
        var lateralDist = vehicle.x - centerX;
        if (Math.abs(lateralDist) > halfWidth) {
            var dir = lateralDist > 0 ? 1 : -1;
            vehicle.x = centerX + dir * halfWidth * 0.95;
            vehicle.speed *= 0.8;
        }
    };
    Collision.processCollisions = function (vehicles, track) {
        for (var i = 0; i < vehicles.length; i++) {
            this.resolveBoundary(vehicles[i], track);
        }
    };
    Collision.processVehicleCollisions = function (vehicles) {
        for (var i = 0; i < vehicles.length; i++) {
            for (var j = i + 1; j < vehicles.length; j++) {
                var a = vehicles[i];
                var b = vehicles[j];
                if (a.isCrashed || b.isCrashed)
                    continue;
                if (a.isNPC && b.isNPC)
                    continue;
                var latDist = Math.abs(a.playerX - b.playerX);
                var longDist = Math.abs(a.trackZ - b.trackZ);
                var collisionLat = 0.4;
                var collisionLong = 10;
                if (latDist < collisionLat && longDist < collisionLong) {
                    this.resolveVehicleCollision(a, b);
                }
            }
        }
    };
    Collision.resolveVehicleCollision = function (a, b) {
        var aAhead = a.trackZ > b.trackZ;
        var faster = aAhead ? a : b;
        var slower = aAhead ? b : a;
        var pushForce = 0.15;
        if (a.playerX < b.playerX) {
            a.playerX -= pushForce;
            b.playerX += pushForce;
        }
        else {
            a.playerX += pushForce;
            b.playerX -= pushForce;
        }
        var speedTransfer = 20;
        if (!faster.isNPC && slower.isNPC) {
            faster.speed = Math.max(0, faster.speed - speedTransfer * 1.5);
            slower.speed = Math.min(VEHICLE_PHYSICS.MAX_SPEED, slower.speed + speedTransfer);
            faster.flashTimer = 0.3;
        }
        else if (faster.isNPC && !slower.isNPC) {
            slower.speed = Math.max(0, slower.speed - speedTransfer * 0.5);
            faster.speed = Math.max(0, faster.speed - speedTransfer);
            slower.flashTimer = 0.3;
        }
        else {
            faster.speed = Math.max(0, faster.speed - speedTransfer);
            slower.speed = Math.max(0, slower.speed - speedTransfer * 0.5);
        }
        if (a.flashTimer <= 0)
            a.flashTimer = 0.2;
        if (b.flashTimer <= 0)
            b.flashTimer = 0.2;
    };
    return Collision;
}());
