"use strict";
var PositionIndicator = (function () {
    function PositionIndicator() {
    }
    PositionIndicator.calculate = function (position, totalRacers) {
        return {
            position: position,
            totalRacers: totalRacers,
            suffix: this.getOrdinalSuffix(position)
        };
    };
    PositionIndicator.getOrdinalSuffix = function (n) {
        var s = ["th", "st", "nd", "rd"];
        var v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };
    PositionIndicator.format = function (data) {
        return data.position + data.suffix + " / " + data.totalRacers;
    };
    PositionIndicator.calculatePositions = function (vehicles) {
        var racers = vehicles.filter(function (v) { return !v.isNPC; });
        var sorted = racers.slice().sort(function (a, b) {
            if (a.lap !== b.lap)
                return b.lap - a.lap;
            if (a.checkpoint !== b.checkpoint)
                return b.checkpoint - a.checkpoint;
            return b.z - a.z;
        });
        for (var i = 0; i < sorted.length; i++) {
            sorted[i].racePosition = i + 1;
        }
    };
    return PositionIndicator;
}());
