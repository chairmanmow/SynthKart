"use strict";
if (typeof JSONdb === 'undefined') {
    load('json-db.js');
}
if (typeof JSONClient === 'undefined') {
    load('json-client.js');
}
var HighScoreType;
(function (HighScoreType) {
    HighScoreType["TRACK_TIME"] = "track_time";
    HighScoreType["LAP_TIME"] = "lap_time";
    HighScoreType["CIRCUIT_TIME"] = "circuit_time";
})(HighScoreType || (HighScoreType = {}));
var HighScoreManager = (function () {
    function HighScoreManager() {
        this.maxEntries = 10;
        var config = OUTRUN_CONFIG.highscores;
        this.serviceName = config.serviceName;
        this.useNetwork = config.server !== 'file' && config.server !== '';
        try {
            if (this.useNetwork) {
                this.client = new JSONClient(config.server, config.port);
                logInfo('High scores: connecting to ' + config.server + ':' + config.port +
                    ' service=' + this.serviceName);
            }
            else {
                this.localDb = new JSONdb(config.filePath);
                this.localDb.settings.KEEP_READABLE = true;
                this.localDb.load();
                logInfo('High scores: using local file ' + config.filePath);
            }
        }
        catch (e) {
            logError("Failed to initialize high score storage: " + e);
            this.localDb = null;
            this.client = null;
        }
    }
    HighScoreManager.prototype.getKey = function (type, identifier) {
        var sanitized = identifier.replace(/\s+/g, '_').toLowerCase();
        return type + '.' + sanitized;
    };
    HighScoreManager.prototype.getScoresLocal = function (key) {
        if (!this.localDb)
            return [];
        try {
            this.localDb.load();
            var data = this.localDb.masterData.data || {};
            var scores = data[key];
            return (scores && Array.isArray(scores)) ? scores : [];
        }
        catch (e) {
            logError("Failed to read local scores: " + e);
            return [];
        }
    };
    HighScoreManager.prototype.getScoresNetwork = function (key) {
        if (!this.client)
            return [];
        try {
            var scores = this.client.read(this.serviceName, key, 1);
            return (scores && Array.isArray(scores)) ? scores : [];
        }
        catch (e) {
            logError("Failed to read network scores: " + e);
            return [];
        }
    };
    HighScoreManager.prototype.getScores = function (type, identifier) {
        var key = this.getKey(type, identifier);
        var scores = this.useNetwork ? this.getScoresNetwork(key) : this.getScoresLocal(key);
        scores.sort(function (a, b) {
            return a.time - b.time;
        });
        return scores;
    };
    HighScoreManager.prototype.getTopScore = function (type, identifier) {
        var scores = this.getScores(type, identifier);
        if (scores.length > 0) {
            return scores[0];
        }
        return null;
    };
    HighScoreManager.prototype.checkQualification = function (type, identifier, time) {
        var scores = this.getScores(type, identifier);
        if (scores.length < this.maxEntries) {
            for (var i = 0; i < scores.length; i++) {
                if (time < scores[i].time) {
                    return i + 1;
                }
            }
            return scores.length + 1;
        }
        for (var i = 0; i < scores.length; i++) {
            if (time < scores[i].time) {
                return i + 1;
            }
        }
        return 0;
    };
    HighScoreManager.prototype.submitScore = function (type, identifier, playerName, time, trackName, circuitName) {
        var key = this.getKey(type, identifier);
        var scores = this.getScores(type, identifier);
        var entry = {
            playerName: playerName,
            time: time,
            date: Date.now()
        };
        if (trackName)
            entry.trackName = trackName;
        if (circuitName)
            entry.circuitName = circuitName;
        scores.push(entry);
        scores.sort(function (a, b) {
            return a.time - b.time;
        });
        if (scores.length > this.maxEntries) {
            scores = scores.slice(0, this.maxEntries);
        }
        var position = 0;
        for (var i = 0; i < scores.length; i++) {
            if (scores[i].time === time && scores[i].date === entry.date) {
                position = i + 1;
                break;
            }
        }
        if (position === 0) {
            return 0;
        }
        try {
            if (this.useNetwork) {
                this.client.write(this.serviceName, key, scores, 2);
            }
            else if (this.localDb) {
                var data = this.localDb.masterData.data || {};
                data[key] = scores;
                this.localDb.masterData.data = data;
                this.localDb.save();
            }
        }
        catch (e) {
            logError("Failed to save high score: " + e);
            return 0;
        }
        return position;
    };
    HighScoreManager.prototype.clearAll = function () {
        try {
            if (this.useNetwork) {
                logWarning("Cannot clear all scores on network storage");
            }
            else if (this.localDb) {
                this.localDb.masterData.data = {};
                this.localDb.save();
            }
        }
        catch (e) {
            logError("Failed to clear high scores: " + e);
        }
    };
    HighScoreManager.prototype.clear = function (type, identifier) {
        var key = this.getKey(type, identifier);
        try {
            if (this.useNetwork) {
                this.client.write(this.serviceName, key, [], 2);
            }
            else if (this.localDb) {
                this.localDb.load();
                var data = this.localDb.masterData.data || {};
                delete data[key];
                this.localDb.masterData.data = data;
                this.localDb.save();
            }
        }
        catch (e) {
            logError("Failed to clear high scores: " + e);
        }
    };
    return HighScoreManager;
}());
