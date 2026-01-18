"use strict";
var CommuterDriver = (function () {
    function CommuterDriver(speedFactor) {
        this.speedFactor = speedFactor !== undefined ? speedFactor : 0.3 + Math.random() * 0.2;
        this.driftAmount = 0.1 + Math.random() * 0.1;
        this.driftDirection = 0;
        this.driftTimer = 0;
        this.driftInterval = 2 + Math.random() * 3;
        this.active = false;
        this.activationRange = 400;
    }
    CommuterDriver.prototype.update = function (vehicle, _track, dt) {
        if (!this.active) {
            return {
                accelerate: 0,
                steer: 0,
                useItem: false
            };
        }
        this.driftTimer += dt;
        if (this.driftTimer >= this.driftInterval) {
            this.driftTimer = 0;
            var rand = Math.random();
            if (rand < 0.3) {
                this.driftDirection = -1;
            }
            else if (rand < 0.6) {
                this.driftDirection = 1;
            }
            else {
                this.driftDirection = 0;
            }
            if (vehicle.playerX > 0.5) {
                this.driftDirection = -1;
            }
            else if (vehicle.playerX < -0.5) {
                this.driftDirection = 1;
            }
        }
        return {
            accelerate: this.speedFactor,
            steer: this.driftDirection * this.driftAmount,
            useItem: false
        };
    };
    CommuterDriver.prototype.getSpeedFactor = function () {
        return this.speedFactor;
    };
    CommuterDriver.prototype.isActive = function () {
        return this.active;
    };
    CommuterDriver.prototype.activate = function () {
        this.active = true;
    };
    CommuterDriver.prototype.deactivate = function () {
        this.active = false;
    };
    CommuterDriver.prototype.getActivationRange = function () {
        return this.activationRange;
    };
    return CommuterDriver;
}());
