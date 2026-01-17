"use strict";
load('sbbsdefs.js');
require("key_defs.js", "KEY_UP");
require("key_defs.js", "KEY_DOWN");
require("key_defs.js", "KEY_LEFT");
require("key_defs.js", "KEY_RIGHT");
require("key_defs.js", "KEY_ESC");
require("key_defs.js", "KEY_HOME");
require("key_defs.js", "KEY_END");
"use strict";
function clamp(value, min, max) {
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
function distance(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}
function distanceSquared(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    return dx * dx + dy * dy;
}
function normalize(v) {
    var len = Math.sqrt(v.x * v.x + v.y * v.y);
    if (len === 0)
        return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
}
function dot(a, b) {
    return a.x * b.x + a.y * b.y;
}
function rotate(p, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return {
        x: p.x * cos - p.y * sin,
        y: p.x * sin + p.y * cos
    };
}
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
function radToDeg(radians) {
    return radians * 180 / Math.PI;
}
function wrapAngle(angle) {
    while (angle > Math.PI)
        angle -= 2 * Math.PI;
    while (angle < -Math.PI)
        angle += 2 * Math.PI;
    return angle;
}
function sign(x) {
    if (x > 0)
        return 1;
    if (x < 0)
        return -1;
    return 0;
}
"use strict";
var Rand = (function () {
    function Rand(seed) {
        this.seed = seed !== undefined ? seed : Date.now();
    }
    Rand.prototype.next = function () {
        this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
        return this.seed / 0x7fffffff;
    };
    Rand.prototype.nextInt = function (min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    };
    Rand.prototype.nextFloat = function (min, max) {
        return this.next() * (max - min) + min;
    };
    Rand.prototype.nextBool = function (probability) {
        var p = probability !== undefined ? probability : 0.5;
        return this.next() < p;
    };
    Rand.prototype.pick = function (array) {
        var index = this.nextInt(0, array.length - 1);
        return array[index];
    };
    Rand.prototype.shuffle = function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = this.nextInt(0, i);
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };
    Rand.prototype.setSeed = function (seed) {
        this.seed = seed;
    };
    return Rand;
}());
var globalRand = new Rand();
"use strict";
var DEBUG_LOG_FILE = "outrun_debug.log";
function repeatString(str, count) {
    var result = "";
    for (var i = 0; i < count; i++) {
        result += str;
    }
    return result;
}
var DebugLogger = (function () {
    function DebugLogger() {
        this.file = null;
        this.enabled = false;
        this.startTime = 0;
        this.logPath = "";
    }
    DebugLogger.prototype.init = function () {
        try {
            var scriptDir = "";
            if (typeof js !== 'undefined' && js.exec_dir) {
                scriptDir = js.exec_dir;
            }
            else {
                scriptDir = "./";
            }
            this.logPath = scriptDir + DEBUG_LOG_FILE;
            this.startTime = Date.now();
            if (typeof console !== 'undefined' && console.print) {
                console.print("DEBUG: Log path = " + this.logPath + "\r\n");
            }
            this.file = new File(this.logPath);
            if (!this.file.open("w")) {
                if (typeof console !== 'undefined' && console.print) {
                    console.print("DEBUG: Failed to open log file!\r\n");
                }
                this.enabled = false;
                return false;
            }
            this.enabled = true;
            this.writeRaw(repeatString("=", 60));
            this.writeRaw("OutRun ANSI Debug Log");
            this.writeRaw("Started: " + new Date().toISOString());
            this.writeRaw("Log file: " + this.logPath);
            this.writeRaw(repeatString("=", 60));
            this.writeRaw("");
            return true;
        }
        catch (e) {
            this.enabled = false;
            return false;
        }
    };
    DebugLogger.prototype.writeRaw = function (text) {
        if (!this.enabled || !this.file)
            return;
        try {
            this.file.writeln(text);
            this.file.flush();
        }
        catch (e) {
        }
    };
    DebugLogger.prototype.getElapsed = function () {
        var elapsed = (Date.now() - this.startTime) / 1000;
        return elapsed.toFixed(3);
    };
    DebugLogger.prototype.write = function (level, message) {
        if (!this.enabled || !this.file)
            return;
        var timestamp = "[" + this.getElapsed() + "s]";
        var line = timestamp + " " + level + " " + message;
        this.writeRaw(line);
    };
    DebugLogger.prototype.debug = function (message) {
        this.write("[DEBUG]", message);
    };
    DebugLogger.prototype.info = function (message) {
        this.write("[INFO ]", message);
    };
    DebugLogger.prototype.warn = function (message) {
        this.write("[WARN ]", message);
    };
    DebugLogger.prototype.error = function (message) {
        this.write("[ERROR]", message);
    };
    DebugLogger.prototype.exception = function (message, error) {
        this.write("[ERROR]", message);
        if (error) {
            this.writeRaw("  Exception: " + String(error));
            if (error.stack) {
                this.writeRaw("  Stack trace:");
                var stack = String(error.stack).split("\n");
                for (var i = 0; i < stack.length; i++) {
                    this.writeRaw("    " + stack[i]);
                }
            }
            if (error.fileName) {
                this.writeRaw("  File: " + error.fileName);
            }
            if (error.lineNumber) {
                this.writeRaw("  Line: " + error.lineNumber);
            }
        }
    };
    DebugLogger.prototype.logState = function (label, state) {
        this.write("[STATE]", label);
        try {
            var json = JSON.stringify(state, null, 2);
            var lines = json.split("\n");
            for (var i = 0; i < lines.length; i++) {
                this.writeRaw("  " + lines[i]);
            }
        }
        catch (e) {
            this.writeRaw("  (could not serialize state)");
        }
    };
    DebugLogger.prototype.logVehicle = function (vehicle) {
        this.debug("Vehicle: playerX=" + vehicle.playerX.toFixed(3) +
            " trackZ=" + vehicle.trackZ.toFixed(1) +
            " speed=" + vehicle.speed.toFixed(1) +
            " offRoad=" + vehicle.isOffRoad +
            " crashed=" + vehicle.isCrashed +
            " lap=" + vehicle.lap);
    };
    DebugLogger.prototype.logInput = function (key, action) {
        var keyStr = key;
        if (key === " ")
            keyStr = "SPACE";
        else if (key === "\r")
            keyStr = "ENTER";
        else if (key.charCodeAt(0) < 32)
            keyStr = "0x" + key.charCodeAt(0).toString(16);
        this.debug("Input: key='" + keyStr + "' action=" + action);
    };
    DebugLogger.prototype.separator = function (label) {
        if (label) {
            this.writeRaw("");
            this.writeRaw("--- " + label + " " + repeatString("-", 50 - label.length));
        }
        else {
            this.writeRaw(repeatString("-", 60));
        }
    };
    DebugLogger.prototype.close = function () {
        if (this.file) {
            this.writeRaw("");
            this.writeRaw(repeatString("=", 60));
            this.writeRaw("Log ended: " + new Date().toISOString());
            this.writeRaw(repeatString("=", 60));
            try {
                this.file.close();
            }
            catch (e) {
            }
            this.file = null;
        }
        this.enabled = false;
    };
    return DebugLogger;
}());
var debugLog = new DebugLogger();
"use strict";
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 7] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 6] = "INFO";
    LogLevel[LogLevel["NOTICE"] = 5] = "NOTICE";
    LogLevel[LogLevel["WARNING"] = 4] = "WARNING";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["CRITICAL"] = 2] = "CRITICAL";
    LogLevel[LogLevel["ALERT"] = 1] = "ALERT";
    LogLevel[LogLevel["EMERGENCY"] = 0] = "EMERGENCY";
})(LogLevel || (LogLevel = {}));
var currentLogLevel = LogLevel.INFO;
function setLogLevel(level) {
    currentLogLevel = level;
}
function logMessage(level, message) {
    if (level <= currentLogLevel) {
        if (typeof log !== 'undefined') {
            log(level, "[OutRun] " + message);
        }
    }
}
function logDebug(message) {
    logMessage(LogLevel.DEBUG, message);
}
function logInfo(message) {
    logMessage(LogLevel.INFO, message);
}
function logWarning(message) {
    logMessage(LogLevel.WARNING, message);
}
function logError(message) {
    logMessage(LogLevel.ERROR, message);
}
"use strict";
var Clock = (function () {
    function Clock() {
        this.lastTime = this.now();
    }
    Clock.prototype.now = function () {
        return system.timer * 1000;
    };
    Clock.prototype.getDelta = function () {
        var currentTime = this.now();
        var delta = currentTime - this.lastTime;
        this.lastTime = currentTime;
        if (delta > 250) {
            delta = 250;
        }
        return delta;
    };
    Clock.prototype.reset = function () {
        this.lastTime = this.now();
    };
    return Clock;
}());
"use strict";
var FixedTimestep = (function () {
    function FixedTimestep(config) {
        this.tickDuration = 1000 / config.tickRate;
        this.maxTicks = config.maxTicksPerFrame;
        this.accumulator = 0;
    }
    FixedTimestep.prototype.update = function (deltaMs) {
        this.accumulator += deltaMs;
        var ticks = 0;
        while (this.accumulator >= this.tickDuration && ticks < this.maxTicks) {
            this.accumulator -= this.tickDuration;
            ticks++;
        }
        if (ticks >= this.maxTicks) {
            this.accumulator = 0;
        }
        return ticks;
    };
    FixedTimestep.prototype.getAlpha = function () {
        return this.accumulator / this.tickDuration;
    };
    FixedTimestep.prototype.getDt = function () {
        return this.tickDuration / 1000;
    };
    FixedTimestep.prototype.reset = function () {
        this.accumulator = 0;
    };
    return FixedTimestep;
}());
"use strict";
var GameAction;
(function (GameAction) {
    GameAction[GameAction["NONE"] = 0] = "NONE";
    GameAction[GameAction["ACCELERATE"] = 1] = "ACCELERATE";
    GameAction[GameAction["BRAKE"] = 2] = "BRAKE";
    GameAction[GameAction["STEER_LEFT"] = 3] = "STEER_LEFT";
    GameAction[GameAction["STEER_RIGHT"] = 4] = "STEER_RIGHT";
    GameAction[GameAction["ACCEL_LEFT"] = 5] = "ACCEL_LEFT";
    GameAction[GameAction["ACCEL_RIGHT"] = 6] = "ACCEL_RIGHT";
    GameAction[GameAction["BRAKE_LEFT"] = 7] = "BRAKE_LEFT";
    GameAction[GameAction["BRAKE_RIGHT"] = 8] = "BRAKE_RIGHT";
    GameAction[GameAction["USE_ITEM"] = 9] = "USE_ITEM";
    GameAction[GameAction["PAUSE"] = 10] = "PAUSE";
    GameAction[GameAction["QUIT"] = 11] = "QUIT";
})(GameAction || (GameAction = {}));
var InputMap = (function () {
    function InputMap() {
        this.bindings = {};
        this.setupDefaultBindings();
    }
    InputMap.prototype.setupDefaultBindings = function () {
        this.bind('Q', GameAction.ACCEL_LEFT);
        this.bind('U', GameAction.ACCEL_LEFT);
        this.bind('W', GameAction.ACCELERATE);
        this.bind('I', GameAction.ACCELERATE);
        this.bind('E', GameAction.ACCEL_RIGHT);
        this.bind('P', GameAction.ACCEL_RIGHT);
        this.bind('q', GameAction.STEER_LEFT);
        this.bind('u', GameAction.STEER_LEFT);
        this.bind('w', GameAction.ACCELERATE);
        this.bind('i', GameAction.ACCELERATE);
        this.bind('e', GameAction.STEER_RIGHT);
        this.bind('p', GameAction.STEER_RIGHT);
        this.bind('A', GameAction.BRAKE_LEFT);
        this.bind('a', GameAction.BRAKE_LEFT);
        this.bind('S', GameAction.BRAKE);
        this.bind('s', GameAction.BRAKE);
        this.bind('D', GameAction.BRAKE_RIGHT);
        this.bind('d', GameAction.BRAKE_RIGHT);
        this.bind('Z', GameAction.ACCELERATE);
        this.bind('z', GameAction.ACCELERATE);
        this.bind('C', GameAction.BRAKE);
        this.bind('c', GameAction.BRAKE);
        this.bind('7', GameAction.ACCEL_LEFT);
        this.bind('8', GameAction.ACCELERATE);
        this.bind('9', GameAction.ACCEL_RIGHT);
        this.bind('4', GameAction.STEER_LEFT);
        this.bind('5', GameAction.BRAKE);
        this.bind('6', GameAction.STEER_RIGHT);
        this.bind('1', GameAction.BRAKE_LEFT);
        this.bind('2', GameAction.BRAKE);
        this.bind('3', GameAction.BRAKE_RIGHT);
        this.bind(' ', GameAction.USE_ITEM);
        this.bind('\r', GameAction.USE_ITEM);
        this.bind('x', GameAction.PAUSE);
        this.bind('X', GameAction.PAUSE);
        this.bind('0', GameAction.QUIT);
    };
    InputMap.prototype.bind = function (key, action) {
        this.bindings[key] = action;
    };
    InputMap.prototype.getAction = function (key) {
        var action = this.bindings[key];
        return action !== undefined ? action : GameAction.NONE;
    };
    return InputMap;
}());
"use strict";
var Controls = (function () {
    function Controls(inputMap) {
        this.inputMap = inputMap;
        this.lastKeyTime = {};
        this.activeActions = {};
        this.justPressedActions = {};
        this.holdThreshold = 200;
        this.currentAccel = 0;
        this.currentSteer = 0;
    }
    Controls.prototype.handleKey = function (key, now) {
        var action = this.inputMap.getAction(key);
        if (action !== GameAction.NONE) {
            if (!this.activeActions[action]) {
                this.justPressedActions[action] = true;
            }
            this.activeActions[action] = true;
            this.lastKeyTime[action] = now;
            this.applyAction(action);
        }
    };
    Controls.prototype.applyAction = function (action) {
        switch (action) {
            case GameAction.ACCELERATE:
                this.currentAccel = 1;
                break;
            case GameAction.BRAKE:
                this.currentAccel = -1;
                break;
            case GameAction.STEER_LEFT:
                this.currentSteer = -1;
                break;
            case GameAction.STEER_RIGHT:
                this.currentSteer = 1;
                break;
            case GameAction.ACCEL_LEFT:
                this.currentAccel = 1;
                this.currentSteer = -1;
                break;
            case GameAction.ACCEL_RIGHT:
                this.currentAccel = 1;
                this.currentSteer = 1;
                break;
            case GameAction.BRAKE_LEFT:
                this.currentAccel = -1;
                this.currentSteer = -1;
                break;
            case GameAction.BRAKE_RIGHT:
                this.currentAccel = -1;
                this.currentSteer = 1;
                break;
        }
    };
    Controls.prototype.update = function (now) {
        this.currentSteer = 0;
        for (var actionStr in this.lastKeyTime) {
            var action = parseInt(actionStr, 10);
            if (now - this.lastKeyTime[action] > this.holdThreshold) {
                this.activeActions[action] = false;
                delete this.lastKeyTime[action];
                if (action === GameAction.ACCELERATE || action === GameAction.BRAKE ||
                    action === GameAction.ACCEL_LEFT || action === GameAction.ACCEL_RIGHT ||
                    action === GameAction.BRAKE_LEFT || action === GameAction.BRAKE_RIGHT) {
                    this.currentAccel = 0;
                }
            }
            else if (this.activeActions[action]) {
                this.applyAction(action);
            }
        }
    };
    Controls.prototype.getAcceleration = function () {
        return this.currentAccel;
    };
    Controls.prototype.getSteering = function () {
        return this.currentSteer;
    };
    Controls.prototype.isActive = function (action) {
        return this.activeActions[action] === true;
    };
    Controls.prototype.wasJustPressed = function (action) {
        return this.justPressedActions[action] === true;
    };
    Controls.prototype.endFrame = function () {
        this.justPressedActions = {};
    };
    Controls.prototype.clearAll = function () {
        this.activeActions = {};
        this.justPressedActions = {};
        this.lastKeyTime = {};
    };
    return Controls;
}());
"use strict";
var nextEntityId = 1;
function generateEntityId() {
    return nextEntityId++;
}
var Entity = (function () {
    function Entity() {
        this.id = generateEntityId();
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.rotation = 0;
        this.speed = 0;
        this.active = true;
    }
    return Entity;
}());
"use strict";
function neutralIntent() {
    return {
        accelerate: 0,
        steer: 0,
        useItem: false
    };
}
"use strict";
var HumanDriver = (function () {
    function HumanDriver(controls) {
        this.controls = controls;
    }
    HumanDriver.prototype.update = function (_vehicle, _track, _dt) {
        return {
            accelerate: this.controls.getAcceleration(),
            steer: this.controls.getSteering(),
            useItem: this.controls.wasJustPressed(GameAction.USE_ITEM)
        };
    };
    return HumanDriver;
}());
"use strict";
var CpuDriver = (function () {
    function CpuDriver(difficulty) {
        this.difficulty = clamp(difficulty, 0, 1);
    }
    CpuDriver.prototype.update = function (_vehicle, _track, _dt) {
        return {
            accelerate: 0.8 * this.difficulty,
            steer: 0,
            useItem: false
        };
    };
    return CpuDriver;
}());
"use strict";
var CommuterDriver = (function () {
    function CommuterDriver(speedFactor) {
        this.speedFactor = speedFactor !== undefined ? speedFactor : 0.3 + Math.random() * 0.2;
        this.driftAmount = 0.1 + Math.random() * 0.1;
        this.driftDirection = 0;
        this.driftTimer = 0;
        this.driftInterval = 2 + Math.random() * 3;
    }
    CommuterDriver.prototype.update = function (vehicle, _track, dt) {
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
    return CommuterDriver;
}());
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
"use strict";
var Road = (function () {
    function Road() {
        this.segments = [];
        this.segmentLength = 200;
        this.baseWidth = 2000;
        this.totalLength = 0;
        this.laps = 3;
        this.name = "Unnamed Road";
    }
    Road.prototype.getSegment = function (z) {
        var index = Math.floor(z / this.segmentLength) % this.segments.length;
        if (index < 0)
            index += this.segments.length;
        return this.segments[index];
    };
    Road.prototype.getSegmentIndex = function (z) {
        var index = Math.floor(z / this.segmentLength) % this.segments.length;
        if (index < 0)
            index += this.segments.length;
        return index;
    };
    Road.prototype.getCurvature = function (z) {
        return this.getSegment(z).curve;
    };
    Road.prototype.isOnRoad = function (x, z) {
        var segment = this.getSegment(z);
        var halfWidth = segment.width / 2;
        return Math.abs(x) <= halfWidth ? 1 : 0;
    };
    return Road;
}());
var RoadBuilder = (function () {
    function RoadBuilder() {
        this.road = new Road();
        this.currentZ = 0;
        this.currentCurve = 0;
        this.stripeCounter = 0;
        this.stripeLength = 3;
    }
    RoadBuilder.prototype.name = function (n) {
        this.road.name = n;
        return this;
    };
    RoadBuilder.prototype.laps = function (n) {
        this.road.laps = n;
        return this;
    };
    RoadBuilder.prototype.straight = function (numSegments) {
        for (var i = 0; i < numSegments; i++) {
            this.addSegment(0);
        }
        return this;
    };
    RoadBuilder.prototype.curve = function (numSegments, curvature) {
        for (var i = 0; i < numSegments; i++) {
            this.addSegment(curvature);
        }
        return this;
    };
    RoadBuilder.prototype.easeIn = function (numSegments, targetCurve) {
        var startCurve = this.currentCurve;
        for (var i = 0; i < numSegments; i++) {
            var t = i / numSegments;
            this.addSegment(lerp(startCurve, targetCurve, t));
        }
        this.currentCurve = targetCurve;
        return this;
    };
    RoadBuilder.prototype.easeOut = function (numSegments) {
        var startCurve = this.currentCurve;
        for (var i = 0; i < numSegments; i++) {
            var t = i / numSegments;
            this.addSegment(lerp(startCurve, 0, t));
        }
        this.currentCurve = 0;
        return this;
    };
    RoadBuilder.prototype.addSegment = function (curve) {
        this.road.segments.push({
            z: this.currentZ,
            curve: curve,
            hill: 0,
            width: 1.0,
            stripe: Math.floor(this.stripeCounter / this.stripeLength) % 2,
            spriteLeft: null,
            spriteRight: null
        });
        this.currentZ += this.road.segmentLength;
        this.stripeCounter++;
    };
    RoadBuilder.prototype.build = function () {
        this.road.totalLength = this.currentZ;
        return this.road;
    };
    return RoadBuilder;
}());
function createNeonCoastRoad() {
    return new RoadBuilder()
        .name("Neon Coast")
        .laps(3)
        .straight(30)
        .easeIn(10, 0.4)
        .curve(30, 0.4)
        .easeOut(10)
        .straight(40)
        .easeIn(8, -0.6)
        .curve(25, -0.6)
        .easeOut(8)
        .straight(25)
        .easeIn(6, 0.5)
        .curve(15, 0.5)
        .easeOut(6)
        .easeIn(6, -0.5)
        .curve(15, -0.5)
        .easeOut(6)
        .straight(35)
        .build();
}
"use strict";
var TRACK_THEMES = {
    'synthwave': {
        id: 'synthwave',
        name: 'Synthwave Sunset',
        sky: {
            top: { fg: MAGENTA, bg: BG_BLACK },
            horizon: { fg: LIGHTMAGENTA, bg: BG_BLACK },
            gridColor: { fg: MAGENTA, bg: BG_BLACK }
        },
        sun: {
            color: { fg: YELLOW, bg: BG_RED },
            glowColor: { fg: LIGHTRED, bg: BG_BLACK },
            position: 0.5
        },
        road: {
            surface: { fg: CYAN, bg: BG_BLACK },
            stripe: { fg: WHITE, bg: BG_BLACK },
            edge: { fg: LIGHTRED, bg: BG_BLACK },
            grid: { fg: CYAN, bg: BG_BLACK }
        },
        offroad: {
            groundColor: { fg: BROWN, bg: BG_BLACK },
            sceneryTypes: ['palm_tree', 'rock', 'grass'],
            sceneryDensity: 0.15
        },
        background: {
            type: 'mountains',
            color: { fg: MAGENTA, bg: BG_BLACK },
            highlightColor: { fg: LIGHTMAGENTA, bg: BG_BLACK }
        }
    },
    'midnight_city': {
        id: 'midnight_city',
        name: 'Midnight City',
        sky: {
            top: { fg: BLUE, bg: BG_BLACK },
            horizon: { fg: LIGHTBLUE, bg: BG_BLACK },
            gridColor: { fg: BLUE, bg: BG_BLACK }
        },
        sun: {
            color: { fg: WHITE, bg: BG_BLUE },
            glowColor: { fg: LIGHTCYAN, bg: BG_BLACK },
            position: 0.5
        },
        road: {
            surface: { fg: DARKGRAY, bg: BG_BLACK },
            stripe: { fg: YELLOW, bg: BG_BLACK },
            edge: { fg: WHITE, bg: BG_BLACK },
            grid: { fg: DARKGRAY, bg: BG_BLACK }
        },
        offroad: {
            groundColor: { fg: DARKGRAY, bg: BG_BLACK },
            sceneryTypes: ['building', 'streetlight', 'sign'],
            sceneryDensity: 0.2
        },
        background: {
            type: 'city',
            color: { fg: BLUE, bg: BG_BLACK },
            highlightColor: { fg: LIGHTCYAN, bg: BG_BLACK }
        }
    },
    'beach_paradise': {
        id: 'beach_paradise',
        name: 'Beach Paradise',
        sky: {
            top: { fg: LIGHTCYAN, bg: BG_BLACK },
            horizon: { fg: CYAN, bg: BG_BLACK },
            gridColor: { fg: CYAN, bg: BG_BLACK }
        },
        sun: {
            color: { fg: YELLOW, bg: BG_BROWN },
            glowColor: { fg: YELLOW, bg: BG_BLACK },
            position: 0.3
        },
        road: {
            surface: { fg: LIGHTGRAY, bg: BG_BLACK },
            stripe: { fg: WHITE, bg: BG_BLACK },
            edge: { fg: YELLOW, bg: BG_BLACK },
            grid: { fg: DARKGRAY, bg: BG_BLACK }
        },
        offroad: {
            groundColor: { fg: YELLOW, bg: BG_BLACK },
            sceneryTypes: ['palm_tree', 'beach_umbrella', 'wave'],
            sceneryDensity: 0.12
        },
        background: {
            type: 'ocean',
            color: { fg: CYAN, bg: BG_BLACK },
            highlightColor: { fg: LIGHTCYAN, bg: BG_BLACK }
        }
    },
    'forest_night': {
        id: 'forest_night',
        name: 'Forest Night',
        sky: {
            top: { fg: BLACK, bg: BG_BLACK },
            horizon: { fg: DARKGRAY, bg: BG_BLACK },
            gridColor: { fg: DARKGRAY, bg: BG_BLACK }
        },
        sun: {
            color: { fg: WHITE, bg: BG_BLACK },
            glowColor: { fg: LIGHTGRAY, bg: BG_BLACK },
            position: 0.7
        },
        road: {
            surface: { fg: DARKGRAY, bg: BG_BLACK },
            stripe: { fg: WHITE, bg: BG_BLACK },
            edge: { fg: BROWN, bg: BG_BLACK },
            grid: { fg: DARKGRAY, bg: BG_BLACK }
        },
        offroad: {
            groundColor: { fg: GREEN, bg: BG_BLACK },
            sceneryTypes: ['pine_tree', 'bush', 'rock'],
            sceneryDensity: 0.25
        },
        background: {
            type: 'forest',
            color: { fg: GREEN, bg: BG_BLACK },
            highlightColor: { fg: LIGHTGREEN, bg: BG_BLACK }
        }
    },
    'haunted_hollow': {
        id: 'haunted_hollow',
        name: 'Haunted Hollow',
        sky: {
            top: { fg: BLACK, bg: BG_BLACK },
            horizon: { fg: MAGENTA, bg: BG_BLACK },
            gridColor: { fg: DARKGRAY, bg: BG_BLACK }
        },
        sun: {
            color: { fg: RED, bg: BG_BLACK },
            glowColor: { fg: LIGHTRED, bg: BG_BLACK },
            position: 0.5
        },
        road: {
            surface: { fg: DARKGRAY, bg: BG_BLACK },
            stripe: { fg: LIGHTRED, bg: BG_BLACK },
            edge: { fg: DARKGRAY, bg: BG_BLACK },
            grid: { fg: DARKGRAY, bg: BG_BLACK }
        },
        offroad: {
            groundColor: { fg: DARKGRAY, bg: BG_BLACK },
            sceneryTypes: ['deadtree', 'gravestone', 'pumpkin', 'skull', 'fence', 'candle'],
            sceneryDensity: 0.3
        },
        background: {
            type: 'cemetery',
            color: { fg: BLACK, bg: BG_BLACK },
            highlightColor: { fg: MAGENTA, bg: BG_BLACK }
        }
    },
    'winter_wonderland': {
        id: 'winter_wonderland',
        name: 'Winter Wonderland',
        sky: {
            top: { fg: BLUE, bg: BG_BLACK },
            horizon: { fg: WHITE, bg: BG_BLACK },
            gridColor: { fg: LIGHTCYAN, bg: BG_BLACK }
        },
        sun: {
            color: { fg: WHITE, bg: BG_LIGHTGRAY },
            glowColor: { fg: YELLOW, bg: BG_BLACK },
            position: 0.3
        },
        road: {
            surface: { fg: LIGHTGRAY, bg: BG_BLACK },
            stripe: { fg: LIGHTRED, bg: BG_BLACK },
            edge: { fg: WHITE, bg: BG_BLACK },
            grid: { fg: LIGHTCYAN, bg: BG_BLACK }
        },
        offroad: {
            groundColor: { fg: WHITE, bg: BG_BLACK },
            sceneryTypes: ['snowpine', 'snowman', 'icecrystal', 'candycane', 'snowdrift', 'signpost'],
            sceneryDensity: 0.25
        },
        background: {
            type: 'mountains',
            color: { fg: WHITE, bg: BG_BLACK },
            highlightColor: { fg: LIGHTCYAN, bg: BG_BLACK }
        }
    },
    'cactus_canyon': {
        id: 'cactus_canyon',
        name: 'Cactus Canyon',
        sky: {
            top: { fg: BLUE, bg: BG_BLACK },
            horizon: { fg: YELLOW, bg: BG_BLACK },
            gridColor: { fg: BROWN, bg: BG_BLACK }
        },
        sun: {
            color: { fg: YELLOW, bg: BG_BROWN },
            glowColor: { fg: YELLOW, bg: BG_BLACK },
            position: 0.6
        },
        road: {
            surface: { fg: BROWN, bg: BG_BLACK },
            stripe: { fg: YELLOW, bg: BG_BLACK },
            edge: { fg: BROWN, bg: BG_BLACK },
            grid: { fg: BROWN, bg: BG_BLACK }
        },
        offroad: {
            groundColor: { fg: YELLOW, bg: BG_BLACK },
            sceneryTypes: ['saguaro', 'barrel', 'tumbleweed', 'cowskull', 'desertrock', 'westernsign'],
            sceneryDensity: 0.2
        },
        background: {
            type: 'dunes',
            color: { fg: BROWN, bg: BG_BLACK },
            highlightColor: { fg: YELLOW, bg: BG_BLACK }
        }
    }
};
var TRACK_CATALOG = [
    {
        id: 'test_oval',
        name: 'Test Oval',
        description: 'Short oval for testing (30 sec lap)',
        difficulty: 1,
        laps: 2,
        themeId: 'synthwave',
        estimatedLapTime: 30,
        npcCount: 3,
        sections: [
            { type: 'straight', length: 15 },
            { type: 'ease_in', length: 5, targetCurve: 0.5 },
            { type: 'curve', length: 15, curve: 0.5 },
            { type: 'ease_out', length: 5 },
            { type: 'straight', length: 15 },
            { type: 'ease_in', length: 5, targetCurve: 0.5 },
            { type: 'curve', length: 15, curve: 0.5 },
            { type: 'ease_out', length: 5 }
        ]
    },
    {
        id: 'neon_coast',
        name: 'Neon Coast',
        description: 'Synthwave sunset drive along the coast',
        difficulty: 2,
        laps: 3,
        themeId: 'synthwave',
        estimatedLapTime: 90,
        npcCount: 6,
        sections: [
            { type: 'straight', length: 30 },
            { type: 'ease_in', length: 10, targetCurve: 0.4 },
            { type: 'curve', length: 30, curve: 0.4 },
            { type: 'ease_out', length: 10 },
            { type: 'straight', length: 40 },
            { type: 'ease_in', length: 8, targetCurve: -0.6 },
            { type: 'curve', length: 25, curve: -0.6 },
            { type: 'ease_out', length: 8 },
            { type: 'straight', length: 25 },
            { type: 's_curve', length: 54 },
            { type: 'straight', length: 35 }
        ]
    },
    {
        id: 'downtown_dash',
        name: 'Downtown Dash',
        description: 'Race through the neon-lit city streets',
        difficulty: 3,
        laps: 3,
        themeId: 'midnight_city',
        estimatedLapTime: 75,
        npcCount: 8,
        sections: [
            { type: 'straight', length: 20 },
            { type: 'ease_in', length: 5, targetCurve: 0.7 },
            { type: 'curve', length: 12, curve: 0.7 },
            { type: 'ease_out', length: 5 },
            { type: 'straight', length: 15 },
            { type: 'ease_in', length: 4, targetCurve: -0.8 },
            { type: 'curve', length: 10, curve: -0.8 },
            { type: 'ease_out', length: 4 },
            { type: 'straight', length: 20 },
            { type: 's_curve', length: 30 },
            { type: 'straight', length: 15 },
            { type: 'ease_in', length: 6, targetCurve: 0.5 },
            { type: 'curve', length: 20, curve: 0.5 },
            { type: 'ease_out', length: 6 }
        ]
    },
    {
        id: 'sunset_beach',
        name: 'Sunset Beach',
        description: 'Cruise along the beautiful coastline',
        difficulty: 1,
        laps: 3,
        themeId: 'beach_paradise',
        estimatedLapTime: 60,
        npcCount: 4,
        sections: [
            { type: 'straight', length: 25 },
            { type: 'ease_in', length: 8, targetCurve: 0.3 },
            { type: 'curve', length: 20, curve: 0.3 },
            { type: 'ease_out', length: 8 },
            { type: 'straight', length: 30 },
            { type: 'ease_in', length: 8, targetCurve: -0.3 },
            { type: 'curve', length: 20, curve: -0.3 },
            { type: 'ease_out', length: 8 },
            { type: 'straight', length: 20 }
        ]
    },
    {
        id: 'haunted_hollow',
        name: 'Haunted Hollow',
        description: 'Race through the cemetery under a blood moon',
        difficulty: 4,
        laps: 3,
        themeId: 'haunted_hollow',
        estimatedLapTime: 70,
        npcCount: 3,
        sections: [
            { type: 'straight', length: 15 },
            { type: 'ease_in', length: 5, targetCurve: -0.4 },
            { type: 'curve', length: 12, curve: -0.4 },
            { type: 'ease_out', length: 4 },
            { type: 'straight', length: 10 },
            { type: 'ease_in', length: 4, targetCurve: 0.7 },
            { type: 'curve', length: 15, curve: 0.7 },
            { type: 'ease_out', length: 4 },
            { type: 'ease_in', length: 3, targetCurve: -0.5 },
            { type: 'curve', length: 10, curve: -0.5 },
            { type: 'ease_in', length: 3, targetCurve: 0.5 },
            { type: 'curve', length: 10, curve: 0.5 },
            { type: 'ease_out', length: 3 },
            { type: 'ease_in', length: 3, targetCurve: -0.8 },
            { type: 'curve', length: 8, curve: -0.8 },
            { type: 'ease_out', length: 3 },
            { type: 'straight', length: 12 }
        ]
    },
    {
        id: 'winter_wonderland',
        name: 'Winter Wonderland',
        description: 'Magical snowy race through a frosty forest',
        difficulty: 2,
        laps: 3,
        themeId: 'winter_wonderland',
        estimatedLapTime: 65,
        npcCount: 4,
        sections: [
            { type: 'straight', length: 20 },
            { type: 'ease_in', length: 6, targetCurve: 0.3 },
            { type: 'curve', length: 18, curve: 0.3 },
            { type: 'ease_out', length: 6 },
            { type: 'straight', length: 15 },
            { type: 'ease_in', length: 5, targetCurve: -0.4 },
            { type: 'curve', length: 15, curve: -0.4 },
            { type: 'ease_out', length: 5 },
            { type: 'ease_in', length: 4, targetCurve: 0.35 },
            { type: 'curve', length: 10, curve: 0.35 },
            { type: 'ease_in', length: 4, targetCurve: -0.35 },
            { type: 'curve', length: 10, curve: -0.35 },
            { type: 'ease_out', length: 4 },
            { type: 'straight', length: 18 }
        ]
    },
    {
        id: 'cactus_canyon',
        name: 'Cactus Canyon',
        description: 'Blazing desert race through the Southwest canyons',
        difficulty: 3,
        laps: 3,
        themeId: 'cactus_canyon',
        estimatedLapTime: 75,
        npcCount: 5,
        sections: [
            { type: 'straight', length: 18 },
            { type: 'ease_in', length: 5, targetCurve: 0.45 },
            { type: 'curve', length: 20, curve: 0.45 },
            { type: 'ease_out', length: 5 },
            { type: 'straight', length: 15 },
            { type: 'ease_in', length: 4, targetCurve: -0.7 },
            { type: 'curve', length: 12, curve: -0.7 },
            { type: 'ease_out', length: 4 },
            { type: 'straight', length: 10 },
            { type: 'ease_in', length: 4, targetCurve: 0.5 },
            { type: 'curve', length: 12, curve: 0.5 },
            { type: 'ease_in', length: 4, targetCurve: -0.5 },
            { type: 'curve', length: 12, curve: -0.5 },
            { type: 'ease_out', length: 4 },
            { type: 'straight', length: 20 }
        ]
    },
    {
        id: 'quick_test',
        name: 'Quick Test',
        description: 'Ultra-short track for quick testing',
        difficulty: 1,
        laps: 2,
        themeId: 'synthwave',
        estimatedLapTime: 15,
        npcCount: 2,
        sections: [
            { type: 'straight', length: 10 },
            { type: 'ease_in', length: 3, targetCurve: 0.4 },
            { type: 'curve', length: 8, curve: 0.4 },
            { type: 'ease_out', length: 3 },
            { type: 'straight', length: 6 }
        ]
    },
    {
        id: 'twilight_grove',
        name: 'Twilight Grove',
        description: 'Winding forest road under dual moons and dancing fireflies',
        difficulty: 3,
        laps: 3,
        themeId: 'forest_night',
        estimatedLapTime: 55,
        sections: [
            { type: 'straight', length: 12 },
            { type: 'ease_in', length: 5, targetCurve: -0.3 },
            { type: 'curve', length: 10, curve: -0.3 },
            { type: 'ease_out', length: 4 },
            { type: 'straight', length: 8 },
            { type: 'ease_in', length: 4, targetCurve: 0.6 },
            { type: 'curve', length: 12, curve: 0.6 },
            { type: 'ease_out', length: 4 },
            { type: 'ease_in', length: 3, targetCurve: -0.4 },
            { type: 'curve', length: 8, curve: -0.4 },
            { type: 'ease_in', length: 3, targetCurve: 0.4 },
            { type: 'curve', length: 8, curve: 0.4 },
            { type: 'ease_out', length: 3 },
            { type: 'straight', length: 10 }
        ]
    }
];
function buildRoadFromDefinition(def) {
    var builder = new RoadBuilder()
        .name(def.name)
        .laps(def.laps);
    for (var i = 0; i < def.sections.length; i++) {
        var section = def.sections[i];
        switch (section.type) {
            case 'straight':
                builder.straight(section.length);
                break;
            case 'curve':
                builder.curve(section.length, section.curve || 0);
                break;
            case 'ease_in':
                builder.easeIn(section.length, section.targetCurve || 0);
                break;
            case 'ease_out':
                builder.easeOut(section.length);
                break;
            case 's_curve':
                var halfLen = Math.floor(section.length / 6);
                builder
                    .easeIn(halfLen, 0.5)
                    .curve(halfLen * 2, 0.5)
                    .easeOut(halfLen)
                    .easeIn(halfLen, -0.5)
                    .curve(halfLen * 2, -0.5)
                    .easeOut(halfLen);
                break;
        }
    }
    return builder.build();
}
function getTrackDefinition(id) {
    for (var i = 0; i < TRACK_CATALOG.length; i++) {
        if (TRACK_CATALOG[i].id === id) {
            return TRACK_CATALOG[i];
        }
    }
    return null;
}
function getTrackTheme(trackDef) {
    return TRACK_THEMES[trackDef.themeId] || TRACK_THEMES['synthwave'];
}
function getAllTracks() {
    return TRACK_CATALOG;
}
function renderDifficultyStars(difficulty) {
    var stars = '';
    for (var i = 0; i < 5; i++) {
        stars += i < difficulty ? '*' : '.';
    }
    return stars;
}
"use strict";
var Track = (function () {
    function Track() {
        this.name = "Unnamed Track";
        this.centerline = [];
        this.width = 40;
        this.length = 0;
        this.checkpoints = [];
        this.spawnPoints = [];
        this.laps = 3;
        this.scenery = {
            sky: {
                type: 'sunset',
                sunAzimuth: 270,
                horizonColors: ['#ff00ff', '#ff6600', '#ffff00']
            },
            props: {
                palmTrees: 0.5,
                buildings: 0.3,
                billboards: 0.2
            },
            road: {
                color: '#333333',
                stripeColor: '#ffffff',
                stripeWidth: 2
            },
            skyline: {
                style: 'city',
                density: 0.5
            }
        };
    }
    Track.prototype.getCenterlineX = function (z) {
        if (this.centerline.length < 2)
            return 0;
        var wrappedZ = z % this.length;
        if (wrappedZ < 0)
            wrappedZ += this.length;
        var segmentLength = this.length / this.centerline.length;
        var segmentIndex = Math.floor(wrappedZ / segmentLength);
        var t = (wrappedZ % segmentLength) / segmentLength;
        var p1 = this.centerline[segmentIndex];
        var p2 = this.centerline[(segmentIndex + 1) % this.centerline.length];
        return lerp(p1.x, p2.x, t);
    };
    Track.prototype.getDirection = function (z) {
        if (this.centerline.length < 2)
            return 0;
        var segmentLength = this.length / this.centerline.length;
        var segmentIndex = Math.floor((z % this.length) / segmentLength);
        var p1 = this.centerline[segmentIndex];
        var p2 = this.centerline[(segmentIndex + 1) % this.centerline.length];
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    };
    return Track;
}());
"use strict";
var TrackLoader = (function () {
    function TrackLoader() {
    }
    TrackLoader.prototype.load = function (trackId) {
        logInfo("TrackLoader: Loading track '" + trackId + "'");
        if (trackId === "neon_coast_01") {
            return this.loadNeonCoast();
        }
        logWarning("TrackLoader: Unknown track '" + trackId + "', using default");
        return this.loadNeonCoast();
    };
    TrackLoader.prototype.loadNeonCoast = function () {
        var track = new Track();
        track.name = "Neon Coast";
        track.width = 40;
        track.laps = 3;
        track.centerline = [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 200, y: 50 },
            { x: 250, y: 150 },
            { x: 200, y: 250 },
            { x: 100, y: 300 },
            { x: 0, y: 300 },
            { x: -100, y: 250 },
            { x: -150, y: 150 },
            { x: -100, y: 50 }
        ];
        track.length = this.calculateTrackLength(track.centerline);
        track.checkpoints = [
            { z: 0 },
            { z: track.length * 0.25 },
            { z: track.length * 0.5 },
            { z: track.length * 0.75 }
        ];
        track.spawnPoints = [
            { x: -5, z: -10 },
            { x: 5, z: -10 },
            { x: -5, z: -25 },
            { x: 5, z: -25 },
            { x: -5, z: -40 },
            { x: 5, z: -40 },
            { x: -5, z: -55 },
            { x: 5, z: -55 }
        ];
        track.scenery = {
            sky: {
                type: 'sunset',
                sunAzimuth: 270,
                horizonColors: ['#ff00ff', '#ff6600', '#ffff00']
            },
            props: {
                palmTrees: 0.7,
                buildings: 0.3,
                billboards: 0.2
            },
            road: {
                color: '#333333',
                stripeColor: '#ffffff',
                stripeWidth: 2
            },
            skyline: {
                style: 'city',
                density: 0.6
            }
        };
        return track;
    };
    TrackLoader.prototype.calculateTrackLength = function (centerline) {
        var length = 0;
        for (var i = 0; i < centerline.length; i++) {
            var p1 = centerline[i];
            var p2 = centerline[(i + 1) % centerline.length];
            length += distance(p1, p2);
        }
        return length;
    };
    TrackLoader.prototype.parseTrackJson = function (data) {
        var _a, _b, _c, _d, _e, _f, _g;
        var track = new Track();
        track.name = ((_a = data.meta) === null || _a === void 0 ? void 0 : _a.name) || "Unknown";
        track.laps = ((_b = data.race) === null || _b === void 0 ? void 0 : _b.laps) || 3;
        track.width = ((_c = data.geometry) === null || _c === void 0 ? void 0 : _c.width) || 40;
        track.centerline = (((_d = data.geometry) === null || _d === void 0 ? void 0 : _d.centerline) || []).map(function (p) {
            return { x: p[0], y: p[1] };
        });
        track.length = ((_e = data.geometry) === null || _e === void 0 ? void 0 : _e.length) || this.calculateTrackLength(track.centerline);
        track.checkpoints = (((_f = data.race) === null || _f === void 0 ? void 0 : _f.checkpoints) || []).map(function (z) {
            return { z: z };
        });
        track.spawnPoints = ((_g = data.race) === null || _g === void 0 ? void 0 : _g.spawnPoints) || [];
        if (data.scenery) {
            track.scenery = data.scenery;
        }
        return track;
    };
    return TrackLoader;
}());
"use strict";
var CheckpointTracker = (function () {
    function CheckpointTracker(track) {
        this.track = track;
        this.vehicleCheckpoints = {};
    }
    CheckpointTracker.prototype.initVehicle = function (vehicleId) {
        this.vehicleCheckpoints[vehicleId] = 0;
    };
    CheckpointTracker.prototype.checkProgress = function (vehicle) {
        var currentCheckpoint = this.vehicleCheckpoints[vehicle.id] || 0;
        var nextCheckpoint = this.track.checkpoints[currentCheckpoint];
        if (!nextCheckpoint) {
            return false;
        }
        var wrappedZ = vehicle.z % this.track.length;
        if (wrappedZ >= nextCheckpoint.z) {
            this.vehicleCheckpoints[vehicle.id] = currentCheckpoint + 1;
            vehicle.checkpoint = currentCheckpoint + 1;
            if (currentCheckpoint + 1 >= this.track.checkpoints.length) {
                this.vehicleCheckpoints[vehicle.id] = 0;
                return true;
            }
        }
        return false;
    };
    CheckpointTracker.prototype.getCurrentCheckpoint = function (vehicleId) {
        return this.vehicleCheckpoints[vehicleId] || 0;
    };
    CheckpointTracker.prototype.reset = function () {
        this.vehicleCheckpoints = {};
    };
    return CheckpointTracker;
}());
"use strict";
var SpawnPointManager = (function () {
    function SpawnPointManager(track) {
        this.track = track;
    }
    SpawnPointManager.prototype.getSpawnPosition = function (gridPosition) {
        if (gridPosition < this.track.spawnPoints.length) {
            var sp = this.track.spawnPoints[gridPosition];
            return { x: sp.x, z: sp.z };
        }
        var row = Math.floor(gridPosition / 2);
        var col = gridPosition % 2;
        return {
            x: col === 0 ? -5 : 5,
            z: -(row + 1) * 15
        };
    };
    SpawnPointManager.prototype.placeVehicle = function (vehicle, gridPosition) {
        var pos = this.getSpawnPosition(gridPosition);
        vehicle.x = pos.x;
        vehicle.z = pos.z;
        vehicle.rotation = 0;
        vehicle.speed = 0;
    };
    SpawnPointManager.prototype.placeVehicles = function (vehicles) {
        for (var i = 0; i < vehicles.length; i++) {
            this.placeVehicle(vehicles[i], i);
        }
    };
    return SpawnPointManager;
}());
"use strict";
var Kinematics = (function () {
    function Kinematics() {
    }
    Kinematics.update = function (entity, dt) {
        entity.x += Math.sin(entity.rotation) * entity.speed * dt;
        entity.z += Math.cos(entity.rotation) * entity.speed * dt;
    };
    Kinematics.applyFriction = function (entity, friction, dt) {
        if (entity.speed > 0) {
            entity.speed = Math.max(0, entity.speed - friction * dt);
        }
    };
    Kinematics.applyAcceleration = function (entity, accel, maxSpeed, dt) {
        entity.speed += accel * dt;
        entity.speed = clamp(entity.speed, 0, maxSpeed);
    };
    return Kinematics;
}());
"use strict";
var Steering = (function () {
    function Steering() {
    }
    Steering.apply = function (vehicle, input, steerSpeed, dt) {
        if (Math.abs(input) < 0.01)
            return;
        if (vehicle.speed < 1)
            return;
        var speedFactor = 1 - (vehicle.speed / VEHICLE_PHYSICS.MAX_SPEED) * 0.5;
        var steerAmount = input * steerSpeed * speedFactor * dt;
        vehicle.rotation += steerAmount;
        vehicle.rotation = wrapAngle(vehicle.rotation);
    };
    Steering.applyLateral = function (vehicle, input, lateralSpeed, dt) {
        if (Math.abs(input) < 0.01)
            return;
        if (vehicle.speed < 1)
            return;
        var speedFactor = vehicle.speed / VEHICLE_PHYSICS.MAX_SPEED;
        vehicle.x += input * lateralSpeed * speedFactor * dt;
    };
    return Steering;
}());
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
var ItemType;
(function (ItemType) {
    ItemType[ItemType["NONE"] = 0] = "NONE";
    ItemType[ItemType["MUSHROOM"] = 1] = "MUSHROOM";
    ItemType[ItemType["SHELL"] = 2] = "SHELL";
    ItemType[ItemType["BANANA"] = 3] = "BANANA";
    ItemType[ItemType["STAR"] = 4] = "STAR";
})(ItemType || (ItemType = {}));
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.respawnTime = 10;
        _this.respawnCountdown = -1;
        return _this;
    }
    Item.prototype.isAvailable = function () {
        return this.active && this.respawnCountdown < 0;
    };
    Item.prototype.pickup = function () {
        this.respawnCountdown = this.respawnTime;
    };
    Item.prototype.updateRespawn = function (dt) {
        if (this.respawnCountdown >= 0) {
            this.respawnCountdown -= dt;
        }
    };
    return Item;
}(Entity));
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
var Mushroom = (function (_super) {
    __extends(Mushroom, _super);
    function Mushroom() {
        var _this = _super.call(this, ItemType.MUSHROOM) || this;
        _this.boostMultiplier = 1.5;
        _this.boostDuration = 2.0;
        return _this;
    }
    Mushroom.applyEffect = function (vehicle) {
        vehicle.speed = Math.min(vehicle.speed * 1.5, VEHICLE_PHYSICS.MAX_SPEED * 1.3);
    };
    return Mushroom;
}(Item));
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
var Shell = (function (_super) {
    __extends(Shell, _super);
    function Shell() {
        var _this = _super.call(this, ItemType.SHELL) || this;
        _this.speed = 300;
        _this.ownerId = -1;
        return _this;
    }
    Shell.fire = function (vehicle) {
        var shell = new Shell();
        shell.x = vehicle.x;
        shell.z = vehicle.z + 12;
        shell.rotation = vehicle.rotation;
        shell.ownerId = vehicle.id;
        shell.speed = 300;
        return shell;
    };
    Shell.prototype.updatePosition = function (dt) {
        this.z += this.speed * dt;
    };
    Shell.applyHit = function (vehicle) {
        vehicle.speed = 0;
    };
    return Shell;
}(Item));
"use strict";
var ItemSystem = (function () {
    function ItemSystem() {
        this.items = [];
        this.projectiles = [];
    }
    ItemSystem.prototype.initFromTrack = function (_track) {
        var itemPositions = [
            { x: 0, z: 150, respawnTime: 10 },
            { x: 0, z: 450, respawnTime: 10 },
            { x: -10, z: 750, respawnTime: 10 },
            { x: 10, z: 750, respawnTime: 10 },
            { x: 0, z: 1050, respawnTime: 10 }
        ];
        for (var i = 0; i < itemPositions.length; i++) {
            var pos = itemPositions[i];
            var item = new Item(ItemType.NONE);
            item.x = pos.x;
            item.z = pos.z;
            item.respawnTime = pos.respawnTime;
            this.items.push(item);
        }
    };
    ItemSystem.prototype.update = function (dt) {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].updateRespawn(dt);
        }
        for (var j = this.projectiles.length - 1; j >= 0; j--) {
            var proj = this.projectiles[j];
            proj.z += proj.speed * dt;
            if (proj.z > 10000) {
                this.projectiles.splice(j, 1);
            }
        }
    };
    ItemSystem.prototype.checkPickups = function (vehicles) {
        for (var i = 0; i < vehicles.length; i++) {
            var vehicle = vehicles[i];
            if (vehicle.heldItem !== null)
                continue;
            for (var j = 0; j < this.items.length; j++) {
                var item = this.items[j];
                if (!item.isAvailable())
                    continue;
                var dx = vehicle.x - item.x;
                var dz = vehicle.z - item.z;
                if (Math.abs(dx) < 10 && Math.abs(dz) < 10) {
                    item.pickup();
                    vehicle.heldItem = this.randomItemType();
                    logInfo("Vehicle " + vehicle.id + " picked up item: " + vehicle.heldItem);
                }
            }
        }
    };
    ItemSystem.prototype.useItem = function (vehicle) {
        if (vehicle.heldItem === null)
            return;
        switch (vehicle.heldItem) {
            case ItemType.MUSHROOM:
                Mushroom.applyEffect(vehicle);
                break;
            case ItemType.SHELL:
                var shell = Shell.fire(vehicle);
                this.projectiles.push(shell);
                break;
        }
        vehicle.heldItem = null;
    };
    ItemSystem.prototype.randomItemType = function () {
        var roll = globalRand.next();
        if (roll < 0.5)
            return ItemType.MUSHROOM;
        if (roll < 0.8)
            return ItemType.SHELL;
        return ItemType.BANANA;
    };
    ItemSystem.prototype.getItemBoxes = function () {
        return this.items;
    };
    ItemSystem.prototype.getProjectiles = function () {
        return this.projectiles;
    };
    return ItemSystem;
}());
"use strict";
var Hud = (function () {
    function Hud() {
        this.startTime = 0;
        this.lapStartTime = 0;
        this.bestLapTime = Infinity;
    }
    Hud.prototype.init = function (currentTime) {
        this.startTime = currentTime;
        this.lapStartTime = currentTime;
        this.bestLapTime = Infinity;
    };
    Hud.prototype.onLapComplete = function (currentTime) {
        var lapTime = currentTime - this.lapStartTime;
        if (lapTime < this.bestLapTime) {
            this.bestLapTime = lapTime;
        }
        this.lapStartTime = currentTime;
    };
    Hud.prototype.compute = function (vehicle, track, road, vehicles, currentTime) {
        var lapProgress = 0;
        if (road.totalLength > 0) {
            lapProgress = (vehicle.trackZ % road.totalLength) / road.totalLength;
            if (lapProgress < 0)
                lapProgress += 1.0;
        }
        return {
            speed: Math.round(vehicle.speed),
            speedMax: VEHICLE_PHYSICS.MAX_SPEED,
            lap: vehicle.lap,
            totalLaps: track.laps,
            lapProgress: lapProgress,
            position: vehicle.racePosition,
            totalRacers: vehicles.length,
            lapTime: currentTime - this.lapStartTime,
            bestLapTime: this.bestLapTime === Infinity ? 0 : this.bestLapTime,
            totalTime: currentTime - this.startTime,
            heldItem: vehicle.heldItem,
            raceFinished: vehicle.lap > track.laps
        };
    };
    Hud.formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        var secStr = secs < 10 ? "0" + secs.toFixed(2) : secs.toFixed(2);
        return mins + ":" + secStr;
    };
    return Hud;
}());
"use strict";
var Minimap = (function () {
    function Minimap(config) {
        this.config = config;
        this.scaleX = 1;
        this.scaleY = 1;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    Minimap.prototype.initForTrack = function (track) {
        var minX = Infinity, maxX = -Infinity;
        var minY = Infinity, maxY = -Infinity;
        for (var i = 0; i < track.centerline.length; i++) {
            var p = track.centerline[i];
            if (p.x < minX)
                minX = p.x;
            if (p.x > maxX)
                maxX = p.x;
            if (p.y < minY)
                minY = p.y;
            if (p.y > maxY)
                maxY = p.y;
        }
        var trackWidth = maxX - minX;
        var trackHeight = maxY - minY;
        var mapInnerW = this.config.width - 2;
        var mapInnerH = this.config.height - 2;
        this.scaleX = mapInnerW / (trackWidth || 1);
        this.scaleY = mapInnerH / (trackHeight || 1);
        var scale = Math.min(this.scaleX, this.scaleY);
        this.scaleX = scale;
        this.scaleY = scale;
        this.offsetX = -minX;
        this.offsetY = -minY;
    };
    Minimap.prototype.worldToMinimap = function (worldX, worldY) {
        return {
            x: Math.round((worldX + this.offsetX) * this.scaleX) + this.config.x + 1,
            y: Math.round((worldY + this.offsetY) * this.scaleY) + this.config.y + 1
        };
    };
    Minimap.prototype.getVehiclePositions = function (vehicles, track, playerId) {
        var result = [];
        for (var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            var progress = (v.z % track.length) / track.length;
            var centerlineIdx = Math.floor(progress * track.centerline.length);
            var centerPoint = track.centerline[centerlineIdx] || { x: 0, y: 0 };
            var pos = this.worldToMinimap(centerPoint.x + v.x * 0.1, centerPoint.y);
            result.push({
                x: pos.x,
                y: pos.y,
                isPlayer: v.id === playerId,
                color: v.color
            });
        }
        return result;
    };
    Minimap.prototype.getConfig = function () {
        return this.config;
    };
    return Minimap;
}());
"use strict";
var Speedometer = (function () {
    function Speedometer(maxBarLength) {
        this.maxBarLength = maxBarLength;
    }
    Speedometer.prototype.calculate = function (currentSpeed, maxSpeed) {
        var percentage = clamp(currentSpeed / maxSpeed, 0, 1);
        var filledLength = Math.round(percentage * this.maxBarLength);
        return {
            currentSpeed: Math.round(currentSpeed),
            maxSpeed: maxSpeed,
            percentage: percentage,
            barLength: this.maxBarLength,
            filledLength: filledLength
        };
    };
    Speedometer.prototype.generateBar = function (data) {
        var filled = '';
        var empty = '';
        for (var i = 0; i < data.filledLength; i++) {
            filled += '█';
        }
        for (var j = data.filledLength; j < data.barLength; j++) {
            empty += '░';
        }
        return filled + empty;
    };
    return Speedometer;
}());
"use strict";
var LapTimer = (function () {
    function LapTimer() {
        this.lapTimes = [];
        this.lapStartTime = 0;
        this.raceStartTime = 0;
        this.bestLapTime = null;
    }
    LapTimer.prototype.start = function (currentTime) {
        this.raceStartTime = currentTime;
        this.lapStartTime = currentTime;
        this.lapTimes = [];
        this.bestLapTime = null;
    };
    LapTimer.prototype.completeLap = function (currentTime) {
        var lapTime = currentTime - this.lapStartTime;
        this.lapTimes.push(lapTime);
        if (this.bestLapTime === null || lapTime < this.bestLapTime) {
            this.bestLapTime = lapTime;
        }
        this.lapStartTime = currentTime;
        return lapTime;
    };
    LapTimer.prototype.getData = function (currentTime, currentLap, totalLaps) {
        return {
            currentLap: currentLap,
            totalLaps: totalLaps,
            currentLapTime: currentTime - this.lapStartTime,
            bestLapTime: this.bestLapTime,
            lapTimes: this.lapTimes.slice(),
            totalTime: currentTime - this.raceStartTime
        };
    };
    LapTimer.format = function (seconds) {
        if (seconds === null || seconds === undefined)
            return "--:--.--";
        var mins = Math.floor(seconds / 60);
        var secs = Math.floor(seconds % 60);
        var ms = Math.floor((seconds % 1) * 100);
        var secStr = secs < 10 ? "0" + secs : "" + secs;
        var msStr = ms < 10 ? "0" + ms : "" + ms;
        return mins + ":" + secStr + "." + msStr;
    };
    return LapTimer;
}());
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
        var sorted = vehicles.slice().sort(function (a, b) {
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
"use strict";
var PALETTE = {
    SKY_TOP: { fg: MAGENTA, bg: BG_BLACK },
    SKY_MID: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    SKY_HORIZON: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    SKY_GRID: { fg: MAGENTA, bg: BG_BLACK },
    SKY_GRID_GLOW: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    SUN_CORE: { fg: YELLOW, bg: BG_RED },
    SUN_GLOW: { fg: LIGHTRED, bg: BG_BLACK },
    MOUNTAIN: { fg: MAGENTA, bg: BG_BLACK },
    MOUNTAIN_HIGHLIGHT: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    GRID_LINE: { fg: CYAN, bg: BG_BLACK },
    GRID_GLOW: { fg: LIGHTCYAN, bg: BG_BLACK },
    ROAD_LIGHT: { fg: LIGHTCYAN, bg: BG_BLACK },
    ROAD_DARK: { fg: CYAN, bg: BG_BLACK },
    ROAD_STRIPE: { fg: WHITE, bg: BG_BLACK },
    ROAD_EDGE: { fg: LIGHTRED, bg: BG_BLACK },
    ROAD_GRID: { fg: CYAN, bg: BG_BLACK },
    OFFROAD_GRASS: { fg: GREEN, bg: BG_BLACK },
    OFFROAD_DIRT: { fg: BROWN, bg: BG_BLACK },
    OFFROAD_ROCK: { fg: DARKGRAY, bg: BG_BLACK },
    OFFROAD_TREE: { fg: LIGHTGREEN, bg: BG_BLACK },
    OFFROAD_TREE_TRUNK: { fg: BROWN, bg: BG_BLACK },
    OFFROAD_CACTUS: { fg: GREEN, bg: BG_BLACK },
    PLAYER_BODY: { fg: YELLOW, bg: BG_BLACK },
    PLAYER_TRIM: { fg: WHITE, bg: BG_BLACK },
    ENEMY_BODY: { fg: LIGHTCYAN, bg: BG_BLACK },
    HUD_FRAME: { fg: LIGHTCYAN, bg: BG_BLACK },
    HUD_TEXT: { fg: WHITE, bg: BG_BLACK },
    HUD_VALUE: { fg: YELLOW, bg: BG_BLACK },
    HUD_LABEL: { fg: LIGHTGRAY, bg: BG_BLACK },
    ITEM_BOX: { fg: YELLOW, bg: BG_BLACK },
    ITEM_MUSHROOM: { fg: LIGHTRED, bg: BG_BLACK },
    ITEM_SHELL: { fg: LIGHTGREEN, bg: BG_BLACK }
};
function makeAttr(fg, bg) {
    return fg | bg;
}
function getFg(attr) {
    return attr & 0x0F;
}
function getBg(attr) {
    return attr & 0xF0;
}
function colorToAttr(color) {
    return color.fg | color.bg;
}
"use strict";
var GLYPH = {
    FULL_BLOCK: String.fromCharCode(219),
    LOWER_HALF: String.fromCharCode(220),
    UPPER_HALF: String.fromCharCode(223),
    LEFT_HALF: String.fromCharCode(221),
    RIGHT_HALF: String.fromCharCode(222),
    LIGHT_SHADE: String.fromCharCode(176),
    MEDIUM_SHADE: String.fromCharCode(177),
    DARK_SHADE: String.fromCharCode(178),
    BOX_H: String.fromCharCode(196),
    BOX_V: String.fromCharCode(179),
    BOX_TL: String.fromCharCode(218),
    BOX_TR: String.fromCharCode(191),
    BOX_BL: String.fromCharCode(192),
    BOX_BR: String.fromCharCode(217),
    BOX_VR: String.fromCharCode(195),
    BOX_VL: String.fromCharCode(180),
    BOX_HD: String.fromCharCode(194),
    BOX_HU: String.fromCharCode(193),
    BOX_CROSS: String.fromCharCode(197),
    DBOX_H: String.fromCharCode(205),
    DBOX_V: String.fromCharCode(186),
    DBOX_TL: String.fromCharCode(201),
    DBOX_TR: String.fromCharCode(187),
    DBOX_BL: String.fromCharCode(200),
    DBOX_BR: String.fromCharCode(188),
    DBOX_VR: String.fromCharCode(204),
    DBOX_VL: String.fromCharCode(185),
    DBOX_HD: String.fromCharCode(203),
    DBOX_HU: String.fromCharCode(202),
    DBOX_CROSS: String.fromCharCode(206),
    TRIANGLE_UP: String.fromCharCode(30),
    TRIANGLE_DOWN: String.fromCharCode(31),
    TRIANGLE_LEFT: String.fromCharCode(17),
    TRIANGLE_RIGHT: String.fromCharCode(16),
    DIAMOND: String.fromCharCode(4),
    BULLET: String.fromCharCode(7),
    CIRCLE: String.fromCharCode(9),
    INVERSE_BULLET: String.fromCharCode(8),
    SPACE: ' ',
    DOT: String.fromCharCode(250),
    SLASH: '/',
    BACKSLASH: '\\',
    EQUALS: '=',
    ASTERISK: '*',
    TREE_TOP: String.fromCharCode(6),
    TREE_TRUNK: String.fromCharCode(179),
    ROCK: String.fromCharCode(178),
    GRASS: String.fromCharCode(176),
    CACTUS: String.fromCharCode(157),
    MOUNTAIN_PEAK: '/',
    MOUNTAIN_SLOPE: '\\',
    CHECKER: String.fromCharCode(177),
    FLAG: String.fromCharCode(16)
};
function getShadeGlyph(intensity) {
    if (intensity >= 0.75)
        return GLYPH.FULL_BLOCK;
    if (intensity >= 0.5)
        return GLYPH.DARK_SHADE;
    if (intensity >= 0.25)
        return GLYPH.MEDIUM_SHADE;
    return GLYPH.LIGHT_SHADE;
}
function getBarGlyph(fill) {
    if (fill >= 0.875)
        return GLYPH.FULL_BLOCK;
    if (fill >= 0.625)
        return GLYPH.DARK_SHADE;
    if (fill >= 0.375)
        return GLYPH.MEDIUM_SHADE;
    if (fill >= 0.125)
        return GLYPH.LIGHT_SHADE;
    return GLYPH.SPACE;
}
"use strict";
var SceneComposer = (function () {
    function SceneComposer(width, height) {
        this.width = width;
        this.height = height;
        this.buffer = [];
        this.defaultAttr = makeAttr(BLACK, BG_BLACK);
        this.clear();
    }
    SceneComposer.prototype.clear = function () {
        this.buffer = [];
        for (var y = 0; y < this.height; y++) {
            var row = [];
            for (var x = 0; x < this.width; x++) {
                row.push({ char: ' ', attr: this.defaultAttr });
            }
            this.buffer.push(row);
        }
    };
    SceneComposer.prototype.setCell = function (x, y, char, attr) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.buffer[y][x] = { char: char, attr: attr };
        }
    };
    SceneComposer.prototype.getCell = function (x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.buffer[y][x];
        }
        return null;
    };
    SceneComposer.prototype.writeString = function (x, y, text, attr) {
        for (var i = 0; i < text.length; i++) {
            this.setCell(x + i, y, text.charAt(i), attr);
        }
    };
    SceneComposer.prototype.drawHLine = function (x, y, length, char, attr) {
        for (var i = 0; i < length; i++) {
            this.setCell(x + i, y, char, attr);
        }
    };
    SceneComposer.prototype.drawVLine = function (x, y, length, char, attr) {
        for (var i = 0; i < length; i++) {
            this.setCell(x, y + i, char, attr);
        }
    };
    SceneComposer.prototype.drawBox = function (x, y, w, h, attr) {
        this.setCell(x, y, GLYPH.BOX_TL, attr);
        this.setCell(x + w - 1, y, GLYPH.BOX_TR, attr);
        this.setCell(x, y + h - 1, GLYPH.BOX_BL, attr);
        this.setCell(x + w - 1, y + h - 1, GLYPH.BOX_BR, attr);
        for (var i = 1; i < w - 1; i++) {
            this.setCell(x + i, y, GLYPH.BOX_H, attr);
            this.setCell(x + i, y + h - 1, GLYPH.BOX_H, attr);
        }
        for (var j = 1; j < h - 1; j++) {
            this.setCell(x, y + j, GLYPH.BOX_V, attr);
            this.setCell(x + w - 1, y + j, GLYPH.BOX_V, attr);
        }
    };
    SceneComposer.prototype.getBuffer = function () {
        return this.buffer;
    };
    SceneComposer.prototype.getRow = function (y) {
        var row = '';
        for (var x = 0; x < this.width; x++) {
            row += this.buffer[y][x].char;
        }
        return row;
    };
    return SceneComposer;
}());
"use strict";
var RoadRenderer = (function () {
    function RoadRenderer(composer, horizonY) {
        this.composer = composer;
        this.horizonY = horizonY;
        this.roadBottom = 23;
    }
    RoadRenderer.prototype.render = function (trackPosition, cameraX, track, road) {
        var roadLength = road ? road.totalLength : 55000;
        for (var screenY = this.roadBottom; screenY > this.horizonY; screenY--) {
            var t = (this.roadBottom - screenY) / (this.roadBottom - this.horizonY);
            var distance = 1 / (1 - t * 0.95);
            var roadWidth = Math.round(40 / distance);
            var halfWidth = Math.floor(roadWidth / 2);
            var curveOffset = 0;
            if (track && typeof track.getCenterlineX === 'function') {
                curveOffset = Math.round(track.getCenterlineX(trackPosition + distance * 10) * 0.1);
            }
            var centerX = 40 + curveOffset - Math.round(cameraX * 0.5);
            this.renderScanline(screenY, centerX, halfWidth, distance, trackPosition, roadLength);
        }
    };
    RoadRenderer.prototype.renderScanline = function (y, centerX, halfWidth, distance, trackZ, roadLength) {
        var width = 80;
        var leftEdge = centerX - halfWidth;
        var rightEdge = centerX + halfWidth;
        var stripePhase = Math.floor((trackZ + distance * 5) / 15) % 2;
        var roadAttr = colorToAttr(distance < 10 ? PALETTE.ROAD_LIGHT : PALETTE.ROAD_DARK);
        var gridAttr = colorToAttr(PALETTE.ROAD_GRID);
        var worldZ = trackZ + distance * 5;
        var wrappedZ = worldZ % roadLength;
        if (wrappedZ < 0)
            wrappedZ += roadLength;
        var isFinishLine = (wrappedZ < 200) || (wrappedZ > roadLength - 200);
        for (var x = 0; x < width; x++) {
            if (x >= leftEdge && x <= rightEdge) {
                if (isFinishLine) {
                    this.renderFinishLineCell(x, y, centerX, leftEdge, rightEdge, distance);
                }
                else {
                    this.renderRoadCell(x, y, centerX, leftEdge, rightEdge, stripePhase, distance, roadAttr, gridAttr);
                }
            }
            else {
                this.renderOffroadCell(x, y, leftEdge, rightEdge, distance, trackZ);
            }
        }
    };
    RoadRenderer.prototype.renderFinishLineCell = function (x, y, centerX, leftEdge, rightEdge, distance) {
        if (x === leftEdge || x === rightEdge) {
            this.composer.setCell(x, y, GLYPH.BOX_V, colorToAttr({ fg: WHITE, bg: BG_BLACK }));
            return;
        }
        var checkerSize = Math.max(1, Math.floor(3 / distance));
        var checkerX = Math.floor((x - centerX) / checkerSize);
        var checkerY = Math.floor(y / 2);
        var isWhite = ((checkerX + checkerY) % 2) === 0;
        if (isWhite) {
            this.composer.setCell(x, y, GLYPH.FULL_BLOCK, colorToAttr({ fg: WHITE, bg: BG_LIGHTGRAY }));
        }
        else {
            this.composer.setCell(x, y, ' ', colorToAttr({ fg: BLACK, bg: BG_BLACK }));
        }
    };
    RoadRenderer.prototype.renderRoadCell = function (x, y, centerX, leftEdge, rightEdge, stripePhase, distance, roadAttr, gridAttr) {
        if (x === leftEdge || x === rightEdge) {
            this.composer.setCell(x, y, GLYPH.BOX_V, colorToAttr(PALETTE.ROAD_EDGE));
            return;
        }
        if (Math.abs(x - centerX) < 1 && stripePhase === 0) {
            this.composer.setCell(x, y, GLYPH.BOX_V, colorToAttr(PALETTE.ROAD_STRIPE));
            return;
        }
        var gridPhase = Math.floor(distance) % 3;
        if (gridPhase === 0 && distance > 5) {
            this.composer.setCell(x, y, GLYPH.BOX_H, gridAttr);
        }
        else {
            var shade = this.getShadeForDistance(distance);
            this.composer.setCell(x, y, shade, roadAttr);
        }
    };
    RoadRenderer.prototype.renderOffroadCell = function (x, y, leftEdge, rightEdge, distance, trackZ) {
        var bgAttr = makeAttr(BLACK, BG_BLACK);
        this.composer.setCell(x, y, ' ', bgAttr);
        var side = x < leftEdge ? 'left' : 'right';
        var distFromRoad = side === 'left' ? leftEdge - x : x - rightEdge;
        var scale = Math.min(1, 3 / distance);
        var gridSize = 8;
        var worldZ = Math.floor(trackZ + distance * 10);
        var gridZ = Math.floor(worldZ / gridSize);
        var anchorX = (side === 'left') ? leftEdge - 8 : rightEdge + 8;
        var seed = gridZ * 1000 + (side === 'left' ? 1 : 2);
        var rand = this.pseudoRandom(seed);
        var shouldDraw = (Math.abs(x - anchorX) < 2) &&
            (rand < 0.7) &&
            (distFromRoad > 3 && distFromRoad < 20);
        if (shouldDraw && x === anchorX) {
            this.drawSceneryObject(x, y, distance, scale, rand);
        }
        else if (distFromRoad <= 2) {
            this.composer.setCell(x, y, GLYPH.GRASS, colorToAttr(PALETTE.OFFROAD_DIRT));
        }
    };
    RoadRenderer.prototype.drawSceneryObject = function (x, y, distance, scale, rand) {
        if (rand < 0.05) {
            this.drawTree(x, y, distance, scale);
        }
        else if (rand < 0.10) {
            this.drawRock(x, y, distance, scale);
        }
        else {
            this.drawBush(x, y, distance, scale);
        }
    };
    RoadRenderer.prototype.drawTree = function (x, y, distance, _scale) {
        var leafTrunkAttr = makeAttr(LIGHTGREEN, BG_BROWN);
        var leafAttr = makeAttr(LIGHTGREEN, BG_BLACK);
        var leafDarkAttr = makeAttr(GREEN, BG_BLACK);
        var trunkAttr = makeAttr(BROWN, BG_BLACK);
        if (distance > 8) {
            this.safePut(x, y, GLYPH.UPPER_HALF, leafTrunkAttr);
        }
        else if (distance > 5) {
            this.safePut(x - 1, y - 1, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x, y - 1, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 1, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x, y, GLYPH.UPPER_HALF, leafTrunkAttr);
        }
        else if (distance > 3) {
            this.safePut(x - 1, y - 2, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 2, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x - 1, y - 1, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x, y - 1, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 1, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 1, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x, y, GLYPH.UPPER_HALF, leafTrunkAttr);
            this.safePut(x + 1, y, GLYPH.UPPER_HALF, leafTrunkAttr);
        }
        else if (distance > 1.5) {
            this.safePut(x - 2, y - 3, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x - 1, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 3, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x - 2, y - 2, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x - 1, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 2, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x - 1, y - 1, GLYPH.LOWER_HALF, leafDarkAttr);
            this.safePut(x, y - 1, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 1, GLYPH.LOWER_HALF, leafDarkAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, trunkAttr);
            this.safePut(x, y + 1, GLYPH.UPPER_HALF, trunkAttr);
        }
        else {
            this.safePut(x - 2, y - 4, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x - 1, y - 4, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x, y - 4, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 4, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 4, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 3, y - 4, GLYPH.UPPER_HALF, leafDarkAttr);
            this.safePut(x - 2, y - 3, GLYPH.FULL_BLOCK, leafDarkAttr);
            this.safePut(x - 1, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 3, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 3, y - 3, GLYPH.FULL_BLOCK, leafDarkAttr);
            this.safePut(x - 1, y - 2, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 1, y - 2, GLYPH.FULL_BLOCK, leafAttr);
            this.safePut(x + 2, y - 2, GLYPH.DARK_SHADE, leafDarkAttr);
            this.safePut(x, y - 1, GLYPH.LOWER_HALF, leafDarkAttr);
            this.safePut(x + 1, y - 1, GLYPH.LOWER_HALF, leafDarkAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, trunkAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, trunkAttr);
            this.safePut(x, y + 1, GLYPH.UPPER_HALF, trunkAttr);
            this.safePut(x + 1, y + 1, GLYPH.UPPER_HALF, trunkAttr);
        }
    };
    RoadRenderer.prototype.drawRock = function (x, y, distance, _scale) {
        var rockAttr = makeAttr(DARKGRAY, BG_BLACK);
        var rockLightAttr = makeAttr(LIGHTGRAY, BG_BLACK);
        if (distance > 8) {
            this.safePut(x, y, GLYPH.LOWER_HALF, rockAttr);
        }
        else if (distance > 5) {
            this.safePut(x - 1, y, GLYPH.LOWER_HALF, rockAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, rockLightAttr);
            this.safePut(x + 1, y, GLYPH.LOWER_HALF, rockAttr);
        }
        else if (distance > 3) {
            this.safePut(x - 1, y, GLYPH.LOWER_HALF, rockAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, rockLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, rockAttr);
            this.safePut(x + 2, y, GLYPH.LOWER_HALF, rockAttr);
        }
        else if (distance > 1.5) {
            this.safePut(x - 2, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x - 1, y - 1, GLYPH.UPPER_HALF, rockLightAttr);
            this.safePut(x, y - 1, GLYPH.UPPER_HALF, rockLightAttr);
            this.safePut(x + 1, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x + 2, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x - 2, y, GLYPH.LOWER_HALF, rockAttr);
            this.safePut(x - 1, y, GLYPH.FULL_BLOCK, rockAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, rockLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, rockAttr);
            this.safePut(x + 2, y, GLYPH.LOWER_HALF, rockAttr);
        }
        else {
            this.safePut(x - 2, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x - 1, y - 1, GLYPH.UPPER_HALF, rockLightAttr);
            this.safePut(x, y - 1, GLYPH.UPPER_HALF, rockLightAttr);
            this.safePut(x + 1, y - 1, GLYPH.UPPER_HALF, rockLightAttr);
            this.safePut(x + 2, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x + 3, y - 1, GLYPH.UPPER_HALF, rockAttr);
            this.safePut(x - 2, y, GLYPH.LOWER_HALF, rockAttr);
            this.safePut(x - 1, y, GLYPH.FULL_BLOCK, rockAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, rockLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, rockLightAttr);
            this.safePut(x + 2, y, GLYPH.FULL_BLOCK, rockAttr);
            this.safePut(x + 3, y, GLYPH.LOWER_HALF, rockAttr);
        }
    };
    RoadRenderer.prototype.drawBush = function (x, y, distance, _scale) {
        var bushAttr = makeAttr(GREEN, BG_BLACK);
        var bushLightAttr = makeAttr(LIGHTGREEN, BG_BLACK);
        if (distance > 8) {
            this.safePut(x, y, GLYPH.LOWER_HALF, bushAttr);
        }
        else if (distance > 5) {
            this.safePut(x - 1, y, GLYPH.LOWER_HALF, bushAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 1, y, GLYPH.LOWER_HALF, bushAttr);
        }
        else if (distance > 3) {
            this.safePut(x - 1, y, GLYPH.LOWER_HALF, bushAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, bushAttr);
            this.safePut(x + 2, y, GLYPH.LOWER_HALF, bushAttr);
        }
        else if (distance > 1.5) {
            this.safePut(x - 1, y - 1, GLYPH.UPPER_HALF, bushAttr);
            this.safePut(x, y - 1, GLYPH.UPPER_HALF, bushLightAttr);
            this.safePut(x + 1, y - 1, GLYPH.UPPER_HALF, bushLightAttr);
            this.safePut(x + 2, y - 1, GLYPH.UPPER_HALF, bushAttr);
            this.safePut(x - 2, y, GLYPH.LOWER_HALF, bushAttr);
            this.safePut(x - 1, y, GLYPH.FULL_BLOCK, bushAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 2, y, GLYPH.FULL_BLOCK, bushAttr);
            this.safePut(x + 3, y, GLYPH.LOWER_HALF, bushAttr);
        }
        else {
            this.safePut(x - 2, y - 1, GLYPH.UPPER_HALF, bushAttr);
            this.safePut(x - 1, y - 1, GLYPH.UPPER_HALF, bushLightAttr);
            this.safePut(x, y - 1, GLYPH.UPPER_HALF, bushLightAttr);
            this.safePut(x + 1, y - 1, GLYPH.UPPER_HALF, bushLightAttr);
            this.safePut(x + 2, y - 1, GLYPH.UPPER_HALF, bushAttr);
            this.safePut(x + 3, y - 1, GLYPH.UPPER_HALF, bushAttr);
            this.safePut(x - 2, y, GLYPH.LOWER_HALF, bushAttr);
            this.safePut(x - 1, y, GLYPH.FULL_BLOCK, bushAttr);
            this.safePut(x, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 1, y, GLYPH.FULL_BLOCK, bushLightAttr);
            this.safePut(x + 2, y, GLYPH.FULL_BLOCK, bushAttr);
            this.safePut(x + 3, y, GLYPH.LOWER_HALF, bushAttr);
        }
    };
    RoadRenderer.prototype.safePut = function (x, y, char, attr) {
        if (x >= 0 && x < 80 && y >= this.horizonY && y <= this.roadBottom) {
            this.composer.setCell(x, y, char, attr);
        }
    };
    RoadRenderer.prototype.pseudoRandom = function (seed) {
        var x = Math.sin(seed * 12.9898) * 43758.5453;
        return x - Math.floor(x);
    };
    RoadRenderer.prototype.getShadeForDistance = function (distance) {
        if (distance < 5)
            return GLYPH.FULL_BLOCK;
        if (distance < 15)
            return GLYPH.DARK_SHADE;
        if (distance < 30)
            return GLYPH.MEDIUM_SHADE;
        return GLYPH.LIGHT_SHADE;
    };
    return RoadRenderer;
}());
"use strict";
var ParallaxBackground = (function () {
    function ParallaxBackground(visibleWidth, horizonY) {
        this.MOUNTAIN_PARALLAX = 0.3;
        this.width = visibleWidth;
        this.height = horizonY;
        this.bufferWidth = visibleWidth * 3;
        this.scrollOffset = this.width;
        this.skyBuffer = [];
        this.mountainBuffer = [];
        this.renderBackgroundLayers();
    }
    ParallaxBackground.prototype.renderBackgroundLayers = function () {
        this.skyBuffer = [];
        this.mountainBuffer = [];
        for (var y = 0; y < this.height; y++) {
            var skyRow = [];
            var mtRow = [];
            for (var x = 0; x < this.bufferWidth; x++) {
                skyRow.push({ char: ' ', attr: makeAttr(BLACK, BG_BLACK) });
                mtRow.push({ char: ' ', attr: makeAttr(BLACK, BG_BLACK) });
            }
            this.skyBuffer.push(skyRow);
            this.mountainBuffer.push(mtRow);
        }
        this.renderSunToBuffer();
        this.renderMountainsToBuffer();
    };
    ParallaxBackground.prototype.renderSunToBuffer = function () {
        var sunCoreAttr = makeAttr(YELLOW, BG_RED);
        var sunGlowAttr = makeAttr(LIGHTRED, BG_BLACK);
        var sunCenterX = Math.floor(this.bufferWidth / 2);
        var sunY = this.height - 5;
        for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -2; dx <= 2; dx++) {
                var y = sunY + dy;
                var x = sunCenterX + dx;
                if (y >= 0 && y < this.height && x >= 0 && x < this.bufferWidth) {
                    this.skyBuffer[y][x] = { char: GLYPH.FULL_BLOCK, attr: sunCoreAttr };
                }
            }
        }
        var glowOffsets = [
            { dx: -3, dy: -1 }, { dx: -3, dy: 0 }, { dx: -3, dy: 1 },
            { dx: 3, dy: -1 }, { dx: 3, dy: 0 }, { dx: 3, dy: 1 },
            { dx: -2, dy: -2 }, { dx: -1, dy: -2 }, { dx: 0, dy: -2 }, { dx: 1, dy: -2 }, { dx: 2, dy: -2 },
            { dx: -2, dy: 2 }, { dx: -1, dy: 2 }, { dx: 0, dy: 2 }, { dx: 1, dy: 2 }, { dx: 2, dy: 2 }
        ];
        for (var i = 0; i < glowOffsets.length; i++) {
            var g = glowOffsets[i];
            var y = sunY + g.dy;
            var x = sunCenterX + g.dx;
            if (y >= 0 && y < this.height && x >= 0 && x < this.bufferWidth) {
                this.skyBuffer[y][x] = { char: GLYPH.DARK_SHADE, attr: sunGlowAttr };
            }
        }
    };
    ParallaxBackground.prototype.renderMountainsToBuffer = function () {
        var mountainAttr = colorToAttr(PALETTE.MOUNTAIN);
        var highlightAttr = colorToAttr(PALETTE.MOUNTAIN_HIGHLIGHT);
        var mountainPattern = [
            { xOffset: 0, height: 4, width: 12 },
            { xOffset: 15, height: 6, width: 16 },
            { xOffset: 35, height: 3, width: 10 },
            { xOffset: 50, height: 5, width: 14 },
            { xOffset: 68, height: 4, width: 11 }
        ];
        var patternWidth = 80;
        var mountainBaseY = this.height - 1;
        for (var tileX = 0; tileX < this.bufferWidth; tileX += patternWidth) {
            for (var m = 0; m < mountainPattern.length; m++) {
                var mt = mountainPattern[m];
                var baseX = tileX + mt.xOffset;
                this.drawMountainToBuffer(baseX, mountainBaseY, mt.height, mt.width, mountainAttr, highlightAttr);
            }
        }
    };
    ParallaxBackground.prototype.drawMountainToBuffer = function (baseX, baseY, height, width, attr, highlightAttr) {
        var peakX = baseX + Math.floor(width / 2);
        for (var h = 0; h < height; h++) {
            var y = baseY - h;
            if (y < 0 || y >= this.height)
                continue;
            var halfWidth = Math.floor((height - h) * width / height / 2);
            for (var dx = -halfWidth; dx < 0; dx++) {
                var x = peakX + dx;
                if (x >= 0 && x < this.bufferWidth) {
                    this.mountainBuffer[y][x] = { char: '/', attr: attr };
                }
            }
            if (peakX >= 0 && peakX < this.bufferWidth) {
                if (h === height - 1) {
                    this.mountainBuffer[y][peakX] = { char: GLYPH.TRIANGLE_UP, attr: highlightAttr };
                }
                else {
                    this.mountainBuffer[y][peakX] = { char: GLYPH.BOX_V, attr: attr };
                }
            }
            for (var dx = 1; dx <= halfWidth; dx++) {
                var x = peakX + dx;
                if (x >= 0 && x < this.bufferWidth) {
                    this.mountainBuffer[y][x] = { char: '\\', attr: attr };
                }
            }
        }
    };
    ParallaxBackground.prototype.updateScroll = function (curvature, playerSteer, speed, dt) {
        var scrollSpeed = (curvature * 0.8 + playerSteer * 0.2) * speed * dt * 0.1;
        this.scrollOffset += scrollSpeed;
        if (this.scrollOffset < 0) {
            this.scrollOffset += this.bufferWidth;
        }
        else if (this.scrollOffset >= this.bufferWidth) {
            this.scrollOffset -= this.bufferWidth;
        }
    };
    ParallaxBackground.prototype.render = function (composer) {
        var mountainScroll = Math.floor(this.scrollOffset * this.MOUNTAIN_PARALLAX) % this.bufferWidth;
        var skyScroll = Math.floor(this.scrollOffset * 0.1) % this.bufferWidth;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var srcX = (x + skyScroll) % this.bufferWidth;
                var cell = this.skyBuffer[y][srcX];
                if (cell.char !== ' ') {
                    composer.setCell(x, y, cell.char, cell.attr);
                }
            }
        }
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var srcX = (x + mountainScroll) % this.bufferWidth;
                var cell = this.mountainBuffer[y][srcX];
                if (cell.char !== ' ') {
                    composer.setCell(x, y, cell.char, cell.attr);
                }
            }
        }
    };
    ParallaxBackground.prototype.getScrollOffset = function () {
        return this.scrollOffset;
    };
    ParallaxBackground.prototype.resetScroll = function () {
        this.scrollOffset = this.width;
    };
    return ParallaxBackground;
}());
"use strict";
var SkylineRenderer = (function () {
    function SkylineRenderer(composer, horizonY) {
        this.composer = composer;
        this.horizonY = horizonY;
        this.parallax = new ParallaxBackground(80, horizonY);
        this.parallax.resetScroll();
    }
    SkylineRenderer.prototype.render = function (trackPosition, curvature, playerSteer, speed, dt) {
        this.renderSkyBackground();
        if (curvature !== undefined && speed !== undefined && dt !== undefined) {
            this.parallax.updateScroll(curvature, playerSteer || 0, speed, dt);
        }
        this.parallax.render(this.composer);
        this.renderSkyGrid(trackPosition);
    };
    SkylineRenderer.prototype.renderSkyBackground = function () {
        var bgAttr = makeAttr(BLACK, BG_BLACK);
        for (var y = 0; y < this.horizonY; y++) {
            for (var x = 0; x < 80; x++) {
                this.composer.setCell(x, y, ' ', bgAttr);
            }
        }
    };
    SkylineRenderer.prototype.renderSkyGrid = function (trackPosition) {
        var gridAttr = colorToAttr(PALETTE.SKY_GRID);
        var glowAttr = colorToAttr(PALETTE.SKY_GRID_GLOW);
        var vanishX = 40;
        for (var y = this.horizonY - 1; y >= 2; y--) {
            var distFromHorizon = this.horizonY - y;
            var spread = distFromHorizon * 6;
            for (var offset = 0; offset <= spread && offset < 40; offset += 10) {
                var leftX = vanishX - offset;
                var rightX = vanishX + offset;
                if (offset === 0) {
                    this.safePutCell(vanishX, y, GLYPH.BOX_V, gridAttr);
                }
                else {
                    if (leftX >= 0 && leftX < 80) {
                        this.safePutCell(leftX, y, '/', glowAttr);
                    }
                    if (rightX >= 0 && rightX < 80) {
                        this.safePutCell(rightX, y, '\\', glowAttr);
                    }
                }
            }
            var linePhase = Math.floor(trackPosition / 50 + distFromHorizon) % 4;
            if (linePhase === 0) {
                var lineSpread = Math.min(spread, 38);
                for (var x = vanishX - lineSpread; x <= vanishX + lineSpread; x++) {
                    if (x >= 0 && x < 80) {
                        this.safePutCell(x, y, GLYPH.BOX_H, glowAttr);
                    }
                }
            }
        }
    };
    SkylineRenderer.prototype.safePutCell = function (x, y, char, attr) {
        if (x < 0 || x >= 80 || y < 0 || y >= 24)
            return;
        var buffer = this.composer.getBuffer();
        if (!buffer[y] || !buffer[y][x])
            return;
        var cell = buffer[y][x];
        if (cell.char === ' ') {
            this.composer.setCell(x, y, char, attr);
        }
    };
    return SkylineRenderer;
}());
"use strict";
var SpriteRenderer = (function () {
    function SpriteRenderer(composer, horizonY) {
        this.composer = composer;
        this.horizonY = horizonY;
        this.roadBottom = 23;
    }
    SpriteRenderer.prototype.renderPlayerVehicle = function (steerOffset) {
        var baseY = 20;
        var baseX = 38 + Math.round(steerOffset * 2);
        var bodyAttr = colorToAttr(PALETTE.PLAYER_BODY);
        var trimAttr = colorToAttr(PALETTE.PLAYER_TRIM);
        this.composer.setCell(baseX, baseY, GLYPH.LOWER_HALF, bodyAttr);
        this.composer.setCell(baseX + 1, baseY, GLYPH.FULL_BLOCK, trimAttr);
        this.composer.setCell(baseX + 2, baseY, GLYPH.LOWER_HALF, bodyAttr);
        this.composer.setCell(baseX - 1, baseY + 1, GLYPH.FULL_BLOCK, bodyAttr);
        this.composer.setCell(baseX, baseY + 1, GLYPH.FULL_BLOCK, bodyAttr);
        this.composer.setCell(baseX + 1, baseY + 1, GLYPH.FULL_BLOCK, trimAttr);
        this.composer.setCell(baseX + 2, baseY + 1, GLYPH.FULL_BLOCK, bodyAttr);
        this.composer.setCell(baseX + 3, baseY + 1, GLYPH.FULL_BLOCK, bodyAttr);
        this.composer.setCell(baseX - 1, baseY + 2, GLYPH.UPPER_HALF, bodyAttr);
        this.composer.setCell(baseX, baseY + 2, GLYPH.LOWER_HALF, bodyAttr);
        this.composer.setCell(baseX + 1, baseY + 2, GLYPH.FULL_BLOCK, trimAttr);
        this.composer.setCell(baseX + 2, baseY + 2, GLYPH.LOWER_HALF, bodyAttr);
        this.composer.setCell(baseX + 3, baseY + 2, GLYPH.UPPER_HALF, bodyAttr);
    };
    SpriteRenderer.prototype.renderOtherVehicle = function (relativeZ, relativeX, color) {
        if (relativeZ < 5 || relativeZ > 200)
            return;
        var t = Math.max(0, Math.min(1, 1 - (relativeZ / 200)));
        var screenY = Math.round(this.horizonY + t * (this.roadBottom - this.horizonY - 3));
        var scale = t;
        var screenX = 40 + Math.round(relativeX * scale * 2);
        if (screenY < this.horizonY || screenY > this.roadBottom - 3)
            return;
        var attr = makeAttr(color, BG_BLACK);
        if (scale > 0.5) {
            this.composer.setCell(screenX, screenY, GLYPH.UPPER_HALF, attr);
            this.composer.setCell(screenX + 1, screenY, GLYPH.UPPER_HALF, attr);
            this.composer.setCell(screenX, screenY + 1, GLYPH.FULL_BLOCK, attr);
            this.composer.setCell(screenX + 1, screenY + 1, GLYPH.FULL_BLOCK, attr);
        }
        else if (scale > 0.25) {
            this.composer.setCell(screenX, screenY, GLYPH.DARK_SHADE, attr);
            this.composer.setCell(screenX, screenY + 1, GLYPH.FULL_BLOCK, attr);
        }
        else {
            this.composer.setCell(screenX, screenY, GLYPH.MEDIUM_SHADE, attr);
        }
    };
    SpriteRenderer.prototype.renderItemBox = function (relativeZ, relativeX) {
        if (relativeZ < 5 || relativeZ > 200)
            return;
        var t = Math.max(0, Math.min(1, 1 - (relativeZ / 200)));
        var screenY = Math.round(this.horizonY + t * (this.roadBottom - this.horizonY - 2));
        var screenX = 40 + Math.round(relativeX * t * 2);
        if (screenY < this.horizonY || screenY > this.roadBottom - 2)
            return;
        var attr = colorToAttr(PALETTE.ITEM_BOX);
        this.composer.setCell(screenX, screenY, '?', attr);
    };
    return SpriteRenderer;
}());
"use strict";
var HudRenderer = (function () {
    function HudRenderer(composer) {
        this.composer = composer;
    }
    HudRenderer.prototype.render = function (hudData) {
        this.renderTopBar(hudData);
        this.renderLapProgress(hudData);
        this.renderSpeedometer(hudData);
        this.renderItemSlot(hudData);
    };
    HudRenderer.prototype.renderTopBar = function (data) {
        var y = 0;
        var valueAttr = colorToAttr(PALETTE.HUD_VALUE);
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        for (var x = 0; x < 80; x++) {
            this.composer.setCell(x, y, ' ', makeAttr(BLACK, BG_BLACK));
        }
        this.composer.writeString(2, y, "LAP", labelAttr);
        this.composer.writeString(6, y, data.lap + "/" + data.totalLaps, valueAttr);
        this.composer.writeString(14, y, "POS", labelAttr);
        var posSuffix = PositionIndicator.getOrdinalSuffix(data.position);
        this.composer.writeString(18, y, data.position + posSuffix, valueAttr);
        this.composer.writeString(26, y, "TIME", labelAttr);
        this.composer.writeString(31, y, LapTimer.format(data.lapTime), valueAttr);
        if (data.bestLapTime > 0) {
            this.composer.writeString(45, y, "BEST", labelAttr);
            this.composer.writeString(50, y, LapTimer.format(data.bestLapTime), valueAttr);
        }
        this.composer.writeString(66, y, "SPD", labelAttr);
        var speedStr = this.padLeft(data.speed.toString(), 3);
        this.composer.writeString(70, y, speedStr, valueAttr);
    };
    HudRenderer.prototype.renderLapProgress = function (data) {
        var y = 1;
        var barX = 2;
        var barWidth = 60;
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        var filledAttr = colorToAttr({ fg: CYAN, bg: BG_BLACK });
        var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
        var finishAttr = colorToAttr({ fg: WHITE, bg: BG_MAGENTA });
        for (var x = 0; x < 80; x++) {
            this.composer.setCell(x, y, ' ', makeAttr(BLACK, BG_BLACK));
        }
        var pct = Math.floor(data.lapProgress * 100);
        var pctStr = this.padLeft(pct.toString(), 3) + "%";
        this.composer.writeString(barX, y, "TRACK", labelAttr);
        this.composer.writeString(barX + 6, y, pctStr, colorToAttr(PALETTE.HUD_VALUE));
        var barStartX = barX + 12;
        this.composer.setCell(barStartX, y, '[', labelAttr);
        var fillWidth = Math.floor(data.lapProgress * barWidth);
        for (var i = 0; i < barWidth; i++) {
            var isFinish = (i === barWidth - 1);
            var attr;
            var char;
            if (isFinish) {
                attr = finishAttr;
                char = GLYPH.CHECKER;
            }
            else if (i < fillWidth) {
                attr = filledAttr;
                char = GLYPH.FULL_BLOCK;
            }
            else {
                attr = emptyAttr;
                char = GLYPH.LIGHT_SHADE;
            }
            this.composer.setCell(barStartX + 1 + i, y, char, attr);
        }
        this.composer.setCell(barStartX + barWidth + 1, y, ']', labelAttr);
        this.composer.writeString(barStartX + barWidth + 3, y, "FINISH", finishAttr);
    };
    HudRenderer.prototype.renderSpeedometer = function (data) {
        var y = 23;
        var barX = 2;
        var barWidth = 20;
        var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
        var filledAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
        var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
        var highAttr = colorToAttr({ fg: LIGHTRED, bg: BG_BLACK });
        this.composer.writeString(barX, y, "[", labelAttr);
        var fillAmount = data.speed / data.speedMax;
        var fillWidth = Math.round(fillAmount * barWidth);
        for (var i = 0; i < barWidth; i++) {
            var attr = i < fillWidth ?
                (fillAmount > 0.8 ? highAttr : filledAttr) :
                emptyAttr;
            var char = i < fillWidth ? GLYPH.FULL_BLOCK : GLYPH.LIGHT_SHADE;
            this.composer.setCell(barX + 1 + i, y, char, attr);
        }
        this.composer.writeString(barX + barWidth + 1, y, "]", labelAttr);
    };
    HudRenderer.prototype.renderItemSlot = function (data) {
        var y = 23;
        var x = 70;
        var frameAttr = colorToAttr(PALETTE.HUD_FRAME);
        this.composer.setCell(x, y, '[', frameAttr);
        this.composer.setCell(x + 5, y, ']', frameAttr);
        if (data.heldItem !== null) {
            var itemAttr;
            var itemChar;
            switch (data.heldItem) {
                case ItemType.MUSHROOM:
                    itemAttr = colorToAttr(PALETTE.ITEM_MUSHROOM);
                    itemChar = 'MUSH';
                    break;
                case ItemType.SHELL:
                    itemAttr = colorToAttr(PALETTE.ITEM_SHELL);
                    itemChar = 'SHEL';
                    break;
                default:
                    itemAttr = colorToAttr(PALETTE.HUD_VALUE);
                    itemChar = 'ITEM';
            }
            this.composer.writeString(x + 1, y, itemChar, itemAttr);
        }
        else {
            this.composer.writeString(x + 1, y, "----", colorToAttr(PALETTE.HUD_LABEL));
        }
    };
    HudRenderer.prototype.padLeft = function (str, len) {
        while (str.length < len) {
            str = ' ' + str;
        }
        return str;
    };
    return HudRenderer;
}());
"use strict";
var ThemeRegistry = {};
var ROADSIDE_SPRITES = {};
function registerTheme(theme) {
    ThemeRegistry[theme.name] = theme;
}
function registerRoadsideSprite(name, creator) {
    ROADSIDE_SPRITES[name] = creator;
}
function getTheme(name) {
    return ThemeRegistry[name] || null;
}
function getThemeNames() {
    var names = [];
    for (var key in ThemeRegistry) {
        if (ThemeRegistry.hasOwnProperty(key)) {
            names.push(key);
        }
    }
    return names;
}
"use strict";
var CitySprites = {
    createBuilding: function () {
        var wall = makeAttr(DARKGRAY, BG_BLACK);
        var window = makeAttr(YELLOW, BG_BLACK);
        var windowDark = makeAttr(DARKGRAY, BG_BLACK);
        var roof = makeAttr(LIGHTGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'building',
            variants: [
                [
                    [{ char: GLYPH.UPPER_HALF, attr: roof }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: roof }, { char: GLYPH.UPPER_HALF, attr: roof }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }],
                    [{ char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: GLYPH.UPPER_HALF, attr: roof }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: windowDark }, { char: GLYPH.FULL_BLOCK, attr: wall }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: roof }, { char: GLYPH.UPPER_HALF, attr: roof }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: windowDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: GLYPH.UPPER_HALF, attr: roof }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: '.', attr: windowDark }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: windowDark }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }]
                ]
            ]
        };
    },
    createLamppost: function () {
        var pole = makeAttr(DARKGRAY, BG_BLACK);
        var light = makeAttr(YELLOW, BG_BLACK);
        var lightBright = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'lamppost',
            variants: [
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: light }]
                ],
                [
                    [{ char: '*', attr: light }],
                    [{ char: GLYPH.BOX_V, attr: pole }]
                ],
                [
                    [{ char: '*', attr: lightBright }, { char: '*', attr: light }],
                    [U, { char: GLYPH.BOX_V, attr: pole }],
                    [U, { char: GLYPH.BOX_V, attr: pole }]
                ],
                [
                    [{ char: GLYPH.DARK_SHADE, attr: light }, { char: '*', attr: lightBright }],
                    [U, { char: GLYPH.BOX_V, attr: pole }],
                    [U, { char: GLYPH.BOX_V, attr: pole }],
                    [U, { char: GLYPH.BOX_V, attr: pole }]
                ],
                [
                    [{ char: GLYPH.DARK_SHADE, attr: light }, { char: '*', attr: lightBright }, { char: GLYPH.DARK_SHADE, attr: light }],
                    [U, { char: GLYPH.BOX_V, attr: pole }, U],
                    [U, { char: GLYPH.BOX_V, attr: pole }, U],
                    [U, { char: GLYPH.BOX_V, attr: pole }, U],
                    [U, { char: GLYPH.BOX_V, attr: pole }, U]
                ]
            ]
        };
    },
    createSign: function () {
        var sign = makeAttr(GREEN, BG_BLACK);
        var signBright = makeAttr(LIGHTGREEN, BG_BLACK);
        var text = makeAttr(WHITE, BG_GREEN);
        var pole = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'sign',
            variants: [
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: sign }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: sign }, { char: GLYPH.FULL_BLOCK, attr: sign }],
                    [U, { char: GLYPH.BOX_V, attr: pole }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: sign }, { char: '-', attr: text }, { char: GLYPH.FULL_BLOCK, attr: sign }],
                    [U, { char: GLYPH.BOX_V, attr: pole }, U]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: sign }, { char: 'E', attr: text }, { char: 'X', attr: text }, { char: GLYPH.FULL_BLOCK, attr: sign }],
                    [{ char: GLYPH.FULL_BLOCK, attr: signBright }, { char: 'I', attr: text }, { char: 'T', attr: text }, { char: GLYPH.FULL_BLOCK, attr: signBright }],
                    [U, { char: GLYPH.BOX_V, attr: pole }, { char: GLYPH.BOX_V, attr: pole }, U]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: sign }, { char: 'E', attr: text }, { char: 'X', attr: text }, { char: 'I', attr: text }, { char: GLYPH.FULL_BLOCK, attr: sign }],
                    [{ char: GLYPH.FULL_BLOCK, attr: signBright }, { char: ' ', attr: text }, { char: '1', attr: text }, { char: ' ', attr: text }, { char: GLYPH.FULL_BLOCK, attr: signBright }],
                    [U, U, { char: GLYPH.BOX_V, attr: pole }, U, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('building', CitySprites.createBuilding);
registerRoadsideSprite('lamppost', CitySprites.createLamppost);
registerRoadsideSprite('sign', CitySprites.createSign);
"use strict";
var BeachSprites = {
    createPalm: function () {
        var frond = makeAttr(LIGHTGREEN, BG_BLACK);
        var frondDark = makeAttr(GREEN, BG_BLACK);
        var trunk = makeAttr(BROWN, BG_BLACK);
        var coconut = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'palm',
            variants: [
                [
                    [{ char: 'Y', attr: frond }],
                    [{ char: '|', attr: trunk }],
                    [{ char: '|', attr: trunk }]
                ],
                [
                    [{ char: '\\', attr: frondDark }, { char: '|', attr: frond }, { char: '/', attr: frondDark }],
                    [U, { char: '|', attr: trunk }, U],
                    [U, { char: '|', attr: trunk }, U],
                    [U, { char: '|', attr: trunk }, U]
                ],
                [
                    [{ char: '~', attr: frondDark }, { char: '\\', attr: frond }, { char: '|', attr: frond }, { char: '/', attr: frond }, { char: '~', attr: frondDark }],
                    [U, { char: '\\', attr: frond }, { char: 'o', attr: coconut }, { char: '/', attr: frond }, U],
                    [U, U, { char: '|', attr: trunk }, U, U],
                    [U, U, { char: ')', attr: trunk }, U, U],
                    [U, U, { char: '|', attr: trunk }, U, U]
                ],
                [
                    [{ char: '/', attr: frondDark }, { char: '~', attr: frond }, U, U, U, { char: '~', attr: frond }, { char: '\\', attr: frondDark }],
                    [U, { char: '\\', attr: frond }, { char: '_', attr: frond }, { char: 'Y', attr: frond }, { char: '_', attr: frond }, { char: '/', attr: frond }, U],
                    [U, U, { char: '\\', attr: frondDark }, { char: '|', attr: trunk }, { char: '/', attr: frondDark }, U, U],
                    [U, U, U, { char: '(', attr: trunk }, U, U, U],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U],
                    [U, U, U, { char: ')', attr: trunk }, U, U, U],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U]
                ],
                [
                    [{ char: '/', attr: frondDark }, { char: '~', attr: frond }, { char: '~', attr: frondDark }, U, U, U, { char: '~', attr: frondDark }, { char: '~', attr: frond }, { char: '\\', attr: frondDark }],
                    [U, { char: '\\', attr: frond }, { char: '_', attr: frond }, { char: '|', attr: frond }, { char: 'o', attr: coconut }, { char: '|', attr: frond }, { char: '_', attr: frond }, { char: '/', attr: frond }, U],
                    [U, U, { char: '\\', attr: frondDark }, { char: '\\', attr: frond }, { char: '|', attr: trunk }, { char: '/', attr: frond }, { char: '/', attr: frondDark }, U, U],
                    [U, U, U, U, { char: '|', attr: trunk }, { char: ')', attr: trunk }, U, U, U],
                    [U, U, U, U, { char: '(', attr: trunk }, { char: '|', attr: trunk }, U, U, U],
                    [U, U, U, U, { char: '|', attr: trunk }, { char: ')', attr: trunk }, U, U, U],
                    [U, U, U, U, { char: '(', attr: trunk }, { char: '|', attr: trunk }, U, U, U],
                    [U, U, U, U, { char: '|', attr: trunk }, { char: ')', attr: trunk }, U, U, U],
                    [U, U, U, U, { char: '|', attr: trunk }, { char: '|', attr: trunk }, U, U, U]
                ]
            ]
        };
    },
    createUmbrella: function () {
        var stripe1 = makeAttr(LIGHTRED, BG_BLACK);
        var stripe2 = makeAttr(YELLOW, BG_BLACK);
        var pole = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'umbrella',
            variants: [
                [
                    [{ char: '/', attr: stripe1 }, { char: '^', attr: stripe2 }, { char: '\\', attr: stripe1 }],
                    [U, { char: '|', attr: pole }, U]
                ],
                [
                    [U, { char: '/', attr: stripe1 }, { char: '^', attr: stripe2 }, { char: '\\', attr: stripe1 }, U],
                    [U, U, { char: '|', attr: pole }, U, U],
                    [U, U, { char: '+', attr: pole }, U, U]
                ],
                [
                    [U, { char: '/', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '^', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '\\', attr: stripe2 }, U],
                    [U, U, U, { char: '|', attr: pole }, U, U, U],
                    [U, U, U, { char: '|', attr: pole }, U, U, U],
                    [U, U, U, { char: '+', attr: pole }, U, U, U]
                ],
                [
                    [U, { char: '_', attr: stripe1 }, { char: '/', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '^', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '\\', attr: stripe2 }, { char: '_', attr: stripe1 }, U],
                    [{ char: '/', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '=', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '|', attr: pole }, { char: '=', attr: stripe1 }, { char: '=', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '\\', attr: stripe2 }],
                    [U, U, U, U, { char: '|', attr: pole }, U, U, U, U],
                    [U, U, U, U, { char: '|', attr: pole }, U, U, U, U],
                    [U, U, U, U, { char: '+', attr: pole }, U, U, U, U]
                ],
                [
                    [U, { char: '_', attr: stripe1 }, { char: '/', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '^', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '\\', attr: stripe2 }, { char: '_', attr: stripe1 }, U],
                    [{ char: '/', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '=', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '|', attr: pole }, { char: '=', attr: stripe1 }, { char: '=', attr: stripe2 }, { char: '=', attr: stripe1 }, { char: '\\', attr: stripe2 }],
                    [U, U, U, U, { char: '|', attr: pole }, U, U, U, U],
                    [U, U, U, U, { char: '|', attr: pole }, U, U, U, U],
                    [U, U, U, U, { char: '|', attr: pole }, U, U, U, U],
                    [U, U, U, U, { char: '+', attr: pole }, U, U, U, U]
                ]
            ]
        };
    },
    createLifeguard: function () {
        var red = makeAttr(LIGHTRED, BG_BLACK);
        var white = makeAttr(WHITE, BG_BLACK);
        var wood = makeAttr(BROWN, BG_BLACK);
        var window = makeAttr(LIGHTCYAN, BG_CYAN);
        var U = null;
        return {
            name: 'lifeguard',
            variants: [
                [
                    [{ char: '[', attr: red }, { char: ']', attr: red }],
                    [{ char: '/', attr: wood }, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, { char: '\\', attr: wood }]
                ],
                [
                    [{ char: '[', attr: red }, { char: '#', attr: white }, { char: ']', attr: red }],
                    [{ char: '/', attr: wood }, { char: '_', attr: wood }, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, { char: '\\', attr: wood }]
                ],
                [
                    [U, { char: '[', attr: red }, { char: '=', attr: white }, { char: ']', attr: red }, U],
                    [U, { char: '|', attr: white }, { char: ' ', attr: window }, { char: '|', attr: white }, U],
                    [{ char: '/', attr: wood }, { char: '|', attr: wood }, { char: '_', attr: wood }, { char: '|', attr: wood }, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, U, U, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, U, U, { char: '\\', attr: wood }]
                ],
                [
                    [U, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, U],
                    [{ char: '/', attr: white }, { char: '[', attr: red }, { char: '=', attr: white }, { char: '=', attr: white }, { char: '=', attr: white }, { char: ']', attr: red }, { char: '\\', attr: white }],
                    [U, { char: '|', attr: white }, { char: ' ', attr: window }, { char: ' ', attr: window }, { char: ' ', attr: red }, { char: '|', attr: white }, U],
                    [{ char: '/', attr: wood }, { char: '|', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '|', attr: wood }, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, U, U, U, U, { char: '\\', attr: wood }],
                    [{ char: '/', attr: wood }, U, U, U, U, U, { char: '\\', attr: wood }]
                ],
                [
                    [U, U, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, { char: '_', attr: red }, U, U],
                    [U, { char: '/', attr: white }, { char: '[', attr: red }, { char: '=', attr: white }, { char: '=', attr: white }, { char: '=', attr: white }, { char: ']', attr: red }, { char: '\\', attr: white }, U],
                    [U, { char: '|', attr: red }, { char: '_', attr: white }, { char: ' ', attr: window }, { char: ' ', attr: window }, { char: '_', attr: white }, { char: '|', attr: red }, U, U],
                    [U, { char: '|', attr: white }, { char: ' ', attr: window }, { char: ' ', attr: window }, { char: ' ', attr: red }, { char: ' ', attr: red }, { char: '|', attr: white }, U, U],
                    [{ char: '/', attr: wood }, { char: '|', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '|', attr: wood }, { char: '\\', attr: wood }, U],
                    [{ char: '/', attr: wood }, U, U, U, U, U, U, { char: '\\', attr: wood }, U],
                    [{ char: '/', attr: wood }, U, U, U, U, U, U, { char: '\\', attr: wood }, U],
                    [{ char: '/', attr: wood }, U, U, U, U, U, U, { char: '\\', attr: wood }, U]
                ]
            ]
        };
    },
    createSurfboard: function () {
        var board = makeAttr(LIGHTCYAN, BG_BLACK);
        var accent = makeAttr(CYAN, BG_BLACK);
        var star = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'surfboard',
            variants: [
                [
                    [{ char: '^', attr: board }],
                    [{ char: '|', attr: board }],
                    [{ char: 'v', attr: accent }]
                ],
                [
                    [{ char: '^', attr: board }],
                    [{ char: '|', attr: board }],
                    [{ char: '|', attr: accent }],
                    [{ char: 'v', attr: board }]
                ],
                [
                    [{ char: '/', attr: board }, { char: '\\', attr: board }],
                    [{ char: '|', attr: board }, { char: '|', attr: accent }],
                    [{ char: '|', attr: accent }, { char: '|', attr: board }],
                    [{ char: '|', attr: board }, { char: '|', attr: accent }],
                    [{ char: '\\', attr: accent }, { char: '/', attr: accent }]
                ],
                [
                    [U, { char: '^', attr: board }, U],
                    [{ char: '/', attr: board }, { char: '~', attr: accent }, { char: '\\', attr: board }],
                    [{ char: '|', attr: board }, { char: '*', attr: star }, { char: '|', attr: accent }],
                    [{ char: '|', attr: accent }, { char: ' ', attr: board }, { char: '|', attr: board }],
                    [{ char: '|', attr: board }, { char: ' ', attr: board }, { char: '|', attr: accent }],
                    [{ char: '\\', attr: accent }, { char: '_', attr: board }, { char: '/', attr: accent }]
                ],
                [
                    [U, { char: '/', attr: board }, { char: '\\', attr: board }, U],
                    [{ char: '/', attr: board }, { char: '~', attr: accent }, { char: '~', attr: board }, { char: '\\', attr: board }],
                    [{ char: '|', attr: board }, { char: ' ', attr: accent }, { char: ' ', attr: accent }, { char: '|', attr: accent }],
                    [{ char: '|', attr: accent }, { char: '*', attr: star }, { char: ' ', attr: board }, { char: '|', attr: board }],
                    [{ char: '|', attr: board }, { char: ' ', attr: board }, { char: ' ', attr: board }, { char: '|', attr: accent }],
                    [{ char: '|', attr: accent }, { char: ' ', attr: board }, { char: ' ', attr: board }, { char: '|', attr: board }],
                    [{ char: '\\', attr: board }, { char: '_', attr: accent }, { char: '_', attr: accent }, { char: '/', attr: board }],
                    [U, { char: '\\', attr: accent }, { char: '/', attr: accent }, U]
                ]
            ]
        };
    },
    createTiki: function () {
        var flame = makeAttr(YELLOW, BG_BLACK);
        var flameOrange = makeAttr(LIGHTRED, BG_BLACK);
        var bamboo = makeAttr(BROWN, BG_BLACK);
        var band = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'tiki',
            variants: [
                [
                    [{ char: '*', attr: flame }],
                    [{ char: '#', attr: bamboo }],
                    [{ char: '|', attr: bamboo }]
                ],
                [
                    [U, { char: '*', attr: flame }, U],
                    [U, { char: '#', attr: bamboo }, U],
                    [U, { char: '|', attr: bamboo }, U],
                    [U, { char: '|', attr: bamboo }, U]
                ],
                [
                    [{ char: '\\', attr: flame }, { char: '*', attr: flameOrange }, { char: '/', attr: flame }],
                    [U, { char: '#', attr: bamboo }, U],
                    [U, { char: '|', attr: bamboo }, U],
                    [U, { char: '=', attr: band }, U],
                    [U, { char: '|', attr: bamboo }, U]
                ],
                [
                    [U, { char: '(', attr: flame }, { char: '*', attr: flameOrange }, { char: ')', attr: flame }, U],
                    [U, { char: '\\', attr: flameOrange }, { char: '|', attr: flame }, { char: '/', attr: flameOrange }, U],
                    [U, { char: '[', attr: bamboo }, { char: '#', attr: bamboo }, { char: ']', attr: bamboo }, U],
                    [U, U, { char: '|', attr: bamboo }, U, U],
                    [U, U, { char: '=', attr: band }, U, U],
                    [U, U, { char: '|', attr: bamboo }, U, U],
                    [U, U, { char: '|', attr: bamboo }, U, U]
                ],
                [
                    [U, { char: '(', attr: flame }, { char: '*', attr: flameOrange }, { char: ')', attr: flame }, U],
                    [U, { char: '\\', attr: flameOrange }, { char: '|', attr: flame }, { char: '/', attr: flameOrange }, U],
                    [U, { char: '[', attr: bamboo }, { char: '#', attr: bamboo }, { char: ']', attr: bamboo }, U],
                    [U, U, { char: '|', attr: bamboo }, U, U],
                    [U, U, { char: '=', attr: band }, U, U],
                    [U, U, { char: '|', attr: bamboo }, U, U],
                    [U, U, { char: '=', attr: band }, U, U],
                    [U, U, { char: '|', attr: bamboo }, U, U]
                ]
            ]
        };
    },
    createBeachhut: function () {
        var thatch = makeAttr(YELLOW, BG_BLACK);
        var thatchDark = makeAttr(BROWN, BG_BLACK);
        var wood = makeAttr(BROWN, BG_BLACK);
        var window = makeAttr(LIGHTCYAN, BG_CYAN);
        var U = null;
        return {
            name: 'beachhut',
            variants: [
                [
                    [{ char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '\\', attr: thatch }],
                    [{ char: '[', attr: wood }, { char: '#', attr: wood }, { char: ']', attr: wood }]
                ],
                [
                    [U, { char: '/', attr: thatch }, { char: '\\', attr: thatch }, U],
                    [{ char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '\\', attr: thatch }],
                    [{ char: '|', attr: wood }, { char: '#', attr: wood }, { char: '#', attr: wood }, { char: '|', attr: wood }]
                ],
                [
                    [U, { char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '\\', attr: thatch }, U],
                    [{ char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '~', attr: thatchDark }, { char: '\\', attr: thatch }],
                    [{ char: '|', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '|', attr: wood }],
                    [{ char: '|', attr: wood }, { char: ' ', attr: window }, { char: '|', attr: wood }, { char: ' ', attr: wood }, { char: '|', attr: wood }]
                ],
                [
                    [U, U, { char: '_', attr: thatch }, { char: '/', attr: thatch }, { char: '\\', attr: thatch }, { char: '_', attr: thatch }, U],
                    [U, { char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '\\', attr: thatch }],
                    [{ char: '/', attr: thatch }, { char: '|', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '|', attr: wood }, { char: '\\', attr: thatch }],
                    [U, { char: '|', attr: wood }, { char: ' ', attr: window }, { char: '|', attr: wood }, { char: '/', attr: wood }, { char: '\\', attr: wood }, { char: '|', attr: wood }],
                    [U, { char: '|', attr: wood }, { char: '_', attr: wood }, { char: '|', attr: wood }, { char: ' ', attr: wood }, { char: '|', attr: wood }, { char: '|', attr: wood }]
                ],
                [
                    [U, U, { char: '_', attr: thatch }, { char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '\\', attr: thatch }, { char: '_', attr: thatch }, U, U],
                    [U, { char: '/', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '~', attr: thatchDark }, { char: '~', attr: thatch }, { char: '\\', attr: thatch }, U],
                    [{ char: '/', attr: thatch }, { char: '|', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '=', attr: wood }, { char: '|', attr: wood }, { char: '\\', attr: thatch }],
                    [U, { char: '|', attr: wood }, { char: ' ', attr: window }, { char: ' ', attr: window }, { char: '|', attr: wood }, { char: ' ', attr: wood }, { char: '/', attr: wood }, { char: '\\', attr: wood }, { char: '|', attr: wood }, U],
                    [U, { char: '|', attr: wood }, { char: '_', attr: window }, { char: '_', attr: window }, { char: '|', attr: wood }, { char: ' ', attr: wood }, { char: ' ', attr: wood }, { char: '|', attr: wood }, { char: '|', attr: wood }, U],
                    [U, { char: '|', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '_', attr: wood }, { char: '|', attr: wood }, { char: ' ', attr: wood }, { char: '|', attr: wood }, { char: '|', attr: wood }, U],
                    [U, { char: '|', attr: wood }, U, U, U, U, U, U, { char: '|', attr: wood }, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('palm', BeachSprites.createPalm);
registerRoadsideSprite('umbrella', BeachSprites.createUmbrella);
registerRoadsideSprite('lifeguard', BeachSprites.createLifeguard);
registerRoadsideSprite('surfboard', BeachSprites.createSurfboard);
registerRoadsideSprite('tiki', BeachSprites.createTiki);
registerRoadsideSprite('beachhut', BeachSprites.createBeachhut);
"use strict";
var HorrorSprites = {
    createDeadTree: function () {
        var branch = makeAttr(BROWN, BG_BLACK);
        var branchDark = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'deadtree',
            variants: [
                [
                    [U, { char: 'Y', attr: branch }, U],
                    [U, { char: '|', attr: branch }, U]
                ],
                [
                    [{ char: '\\', attr: branchDark }, { char: 'Y', attr: branch }, { char: '/', attr: branchDark }],
                    [U, { char: '|', attr: branch }, U],
                    [U, { char: '|', attr: branch }, U]
                ],
                [
                    [{ char: '\\', attr: branchDark }, U, { char: 'Y', attr: branch }, U, { char: '/', attr: branchDark }],
                    [U, { char: '\\', attr: branch }, { char: '|', attr: branch }, { char: '/', attr: branch }, U],
                    [U, U, { char: '|', attr: branch }, U, U],
                    [U, U, { char: '|', attr: branch }, U, U]
                ],
                [
                    [{ char: '\\', attr: branchDark }, U, { char: 'Y', attr: branch }, U, { char: 'Y', attr: branch }, U, { char: '/', attr: branchDark }],
                    [U, { char: '\\', attr: branch }, { char: '\\', attr: branch }, { char: '|', attr: branch }, { char: '/', attr: branch }, { char: '/', attr: branch }, U],
                    [U, U, { char: '\\', attr: branch }, { char: '|', attr: branch }, { char: '/', attr: branch }, U, U],
                    [U, U, U, { char: '|', attr: branch }, U, U, U],
                    [U, U, U, { char: '|', attr: branch }, U, U, U]
                ],
                [
                    [{ char: '_', attr: branchDark }, U, U, U, { char: 'V', attr: branch }, U, U, U, { char: '_', attr: branchDark }],
                    [U, { char: '\\', attr: branch }, { char: 'Y', attr: branch }, U, { char: '|', attr: branch }, U, { char: 'Y', attr: branch }, { char: '/', attr: branch }, U],
                    [U, U, { char: '\\', attr: branch }, { char: '\\', attr: branch }, { char: '|', attr: branch }, { char: '/', attr: branch }, { char: '/', attr: branch }, U, U],
                    [U, U, U, U, { char: '|', attr: branch }, U, U, U, U],
                    [U, U, U, U, { char: '|', attr: branch }, U, U, U, U],
                    [U, U, U, { char: '-', attr: branch }, { char: '|', attr: branch }, { char: '-', attr: branch }, U, U, U]
                ]
            ]
        };
    },
    createGravestone: function () {
        var stone = makeAttr(LIGHTGRAY, BG_BLACK);
        var stoneDark = makeAttr(DARKGRAY, BG_BLACK);
        var stoneText = makeAttr(DARKGRAY, BG_LIGHTGRAY);
        var U = null;
        return {
            name: 'gravestone',
            variants: [
                [
                    [{ char: GLYPH.UPPER_HALF, attr: stone }, { char: GLYPH.UPPER_HALF, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: stone }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: 'R', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'I', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: stone }, { char: GLYPH.UPPER_HALF, attr: stone }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: 'R', attr: stoneText }, { char: 'I', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'P', attr: stoneText }, { char: GLYPH.MEDIUM_SHADE, attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.LOWER_HALF, attr: stoneDark }]
                ],
                [
                    [U, { char: '_', attr: stone }, { char: GLYPH.UPPER_HALF, attr: stone }, { char: '_', attr: stone }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: ' ', attr: stoneText }, { char: '+', attr: stoneText }, { char: ' ', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'R', attr: stoneText }, { char: '.', attr: stoneText }, { char: 'I', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'P', attr: stoneText }, { char: GLYPH.MEDIUM_SHADE, attr: stoneText }, { char: GLYPH.MEDIUM_SHADE, attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.LOWER_HALF, attr: stoneDark }]
                ],
                [
                    [U, { char: '_', attr: stone }, { char: GLYPH.UPPER_HALF, attr: stone }, { char: '_', attr: stone }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: stone }, { char: ' ', attr: stoneText }, { char: '+', attr: stoneText }, { char: ' ', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stone }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'R', attr: stoneText }, { char: '.', attr: stoneText }, { char: 'I', attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: 'P', attr: stoneText }, { char: GLYPH.MEDIUM_SHADE, attr: stoneText }, { char: GLYPH.MEDIUM_SHADE, attr: stoneText }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.FULL_BLOCK, attr: stoneDark }, { char: GLYPH.LOWER_HALF, attr: stoneDark }]
                ]
            ]
        };
    },
    createPumpkin: function () {
        var pumpkin = makeAttr(BROWN, BG_BLACK);
        var glow = makeAttr(YELLOW, BG_BROWN);
        var stem = makeAttr(GREEN, BG_BLACK);
        var face = makeAttr(YELLOW, BG_BROWN);
        var U = null;
        return {
            name: 'pumpkin',
            variants: [
                [
                    [{ char: '(', attr: glow }, { char: ')', attr: glow }],
                    [{ char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }]
                ],
                [
                    [U, { char: '|', attr: stem }, U],
                    [{ char: '(', attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: glow }],
                    [{ char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }]
                ],
                [
                    [U, U, { char: '|', attr: stem }, U, U],
                    [{ char: '(', attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: pumpkin }],
                    [{ char: '(', attr: pumpkin }, { char: '^', attr: face }, { char: 'v', attr: face }, { char: '^', attr: face }, { char: ')', attr: pumpkin }],
                    [U, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, U]
                ],
                [
                    [U, U, { char: '\\', attr: stem }, { char: '/', attr: stem }, U, U],
                    [{ char: '(', attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: pumpkin }],
                    [{ char: '(', attr: pumpkin }, { char: '^', attr: face }, { char: GLYPH.FULL_BLOCK, attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: pumpkin }, { char: '^', attr: face }, { char: ')', attr: pumpkin }],
                    [{ char: '(', attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: 'v', attr: face }, { char: 'v', attr: face }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: pumpkin }],
                    [U, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, U]
                ],
                [
                    [U, U, { char: '\\', attr: stem }, { char: '/', attr: stem }, U, U],
                    [{ char: '(', attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: pumpkin }],
                    [{ char: '(', attr: pumpkin }, { char: '^', attr: face }, { char: GLYPH.FULL_BLOCK, attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: pumpkin }, { char: '^', attr: face }, { char: ')', attr: pumpkin }],
                    [{ char: '(', attr: pumpkin }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: 'v', attr: face }, { char: 'v', attr: face }, { char: GLYPH.FULL_BLOCK, attr: glow }, { char: ')', attr: pumpkin }],
                    [U, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, { char: GLYPH.LOWER_HALF, attr: pumpkin }, U]
                ]
            ]
        };
    },
    createSkull: function () {
        var bone = makeAttr(WHITE, BG_BLACK);
        var eye = makeAttr(BLACK, BG_LIGHTGRAY);
        var stake = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'skull',
            variants: [
                [
                    [{ char: '0', attr: bone }, { char: '0', attr: bone }],
                    [U, { char: '|', attr: stake }]
                ],
                [
                    [{ char: '(', attr: bone }, { char: GLYPH.UPPER_HALF, attr: bone }, { char: ')', attr: bone }],
                    [{ char: 'o', attr: eye }, { char: 'v', attr: bone }, { char: 'o', attr: eye }],
                    [U, { char: '|', attr: stake }, U]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: bone }, { char: GLYPH.UPPER_HALF, attr: bone }, U],
                    [{ char: '(', attr: bone }, { char: 'o', attr: eye }, { char: 'o', attr: eye }, { char: ')', attr: bone }],
                    [U, { char: GLYPH.LOWER_HALF, attr: bone }, { char: GLYPH.LOWER_HALF, attr: bone }, U],
                    [U, { char: '|', attr: stake }, { char: '|', attr: stake }, U]
                ],
                [
                    [U, { char: '_', attr: bone }, { char: GLYPH.UPPER_HALF, attr: bone }, { char: '_', attr: bone }, U],
                    [{ char: '(', attr: bone }, { char: 'O', attr: eye }, { char: ' ', attr: bone }, { char: 'O', attr: eye }, { char: ')', attr: bone }],
                    [{ char: '(', attr: bone }, { char: ' ', attr: bone }, { char: 'v', attr: bone }, { char: ' ', attr: bone }, { char: ')', attr: bone }],
                    [U, { char: GLYPH.LOWER_HALF, attr: bone }, { char: 'w', attr: bone }, { char: GLYPH.LOWER_HALF, attr: bone }, U],
                    [U, U, { char: '|', attr: stake }, U, U]
                ],
                [
                    [U, { char: '_', attr: bone }, { char: GLYPH.UPPER_HALF, attr: bone }, { char: '_', attr: bone }, U],
                    [{ char: '(', attr: bone }, { char: 'O', attr: eye }, { char: ' ', attr: bone }, { char: 'O', attr: eye }, { char: ')', attr: bone }],
                    [{ char: '(', attr: bone }, { char: ' ', attr: bone }, { char: 'v', attr: bone }, { char: ' ', attr: bone }, { char: ')', attr: bone }],
                    [U, { char: GLYPH.LOWER_HALF, attr: bone }, { char: 'w', attr: bone }, { char: GLYPH.LOWER_HALF, attr: bone }, U],
                    [U, U, { char: '|', attr: stake }, U, U]
                ]
            ]
        };
    },
    createFence: function () {
        var iron = makeAttr(DARKGRAY, BG_BLACK);
        var ironPoint = makeAttr(LIGHTGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'fence',
            variants: [
                [
                    [{ char: '|', attr: iron }, { char: '|', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '-', attr: iron }, { char: '-', attr: iron }, { char: '-', attr: iron }]
                ],
                [
                    [{ char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }],
                    [{ char: '|', attr: iron }, { char: '-', attr: iron }, { char: '|', attr: iron }, { char: '-', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }]
                ],
                [
                    [{ char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }]
                ],
                [
                    [{ char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }]
                ],
                [
                    [{ char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }, U, { char: '^', attr: ironPoint }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '+', attr: iron }, { char: '-', attr: iron }, { char: '|', attr: iron }],
                    [{ char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }, U, { char: '|', attr: iron }]
                ]
            ]
        };
    },
    createCandle: function () {
        var flame = makeAttr(YELLOW, BG_BLACK);
        var candle = makeAttr(WHITE, BG_BLACK);
        var holder = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'candle',
            variants: [
                [
                    [{ char: '*', attr: flame }],
                    [{ char: '|', attr: holder }]
                ],
                [
                    [U, { char: '*', attr: flame }, U],
                    [{ char: '(', attr: holder }, { char: GLYPH.FULL_BLOCK, attr: candle }, { char: ')', attr: holder }],
                    [U, { char: '|', attr: holder }, U]
                ],
                [
                    [{ char: '*', attr: flame }, U, { char: '*', attr: flame }, U, { char: '*', attr: flame }],
                    [{ char: '|', attr: candle }, U, { char: '|', attr: candle }, U, { char: '|', attr: candle }],
                    [{ char: '\\', attr: holder }, { char: '-', attr: holder }, { char: '+', attr: holder }, { char: '-', attr: holder }, { char: '/', attr: holder }],
                    [U, U, { char: '|', attr: holder }, U, U]
                ],
                [
                    [{ char: '*', attr: flame }, U, { char: '*', attr: flame }, U, { char: '*', attr: flame }],
                    [{ char: '|', attr: candle }, U, { char: '|', attr: candle }, U, { char: '|', attr: candle }],
                    [{ char: '\\', attr: holder }, { char: '-', attr: holder }, { char: '+', attr: holder }, { char: '-', attr: holder }, { char: '/', attr: holder }],
                    [U, U, { char: '|', attr: holder }, U, U]
                ],
                [
                    [{ char: '*', attr: flame }, U, { char: '*', attr: flame }, U, { char: '*', attr: flame }],
                    [{ char: '|', attr: candle }, U, { char: '|', attr: candle }, U, { char: '|', attr: candle }],
                    [{ char: '\\', attr: holder }, { char: '-', attr: holder }, { char: '+', attr: holder }, { char: '-', attr: holder }, { char: '/', attr: holder }],
                    [U, U, { char: '|', attr: holder }, U, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('deadtree', HorrorSprites.createDeadTree);
registerRoadsideSprite('gravestone', HorrorSprites.createGravestone);
registerRoadsideSprite('pumpkin', HorrorSprites.createPumpkin);
registerRoadsideSprite('skull', HorrorSprites.createSkull);
registerRoadsideSprite('fence', HorrorSprites.createFence);
registerRoadsideSprite('candle', HorrorSprites.createCandle);
"use strict";
var WinterSprites = {
    createSnowPine: function () {
        var snow = makeAttr(WHITE, BG_BLACK);
        var pine = makeAttr(GREEN, BG_BLACK);
        var pineDark = makeAttr(CYAN, BG_BLACK);
        var trunk = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'snowpine',
            variants: [
                [
                    [U, { char: '^', attr: snow }, U],
                    [U, { char: '|', attr: trunk }, U]
                ],
                [
                    [U, { char: '*', attr: snow }, U],
                    [{ char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }],
                    [{ char: '/', attr: pineDark }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: '\\', attr: pineDark }],
                    [U, { char: '|', attr: trunk }, U]
                ],
                [
                    [U, U, { char: '*', attr: snow }, U, U],
                    [U, { char: '/', attr: pine }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: '\\', attr: pine }, U],
                    [{ char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }],
                    [{ char: '/', attr: pineDark }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: '\\', attr: pineDark }],
                    [U, U, { char: '|', attr: trunk }, U, U]
                ],
                [
                    [U, U, U, { char: '*', attr: snow }, U, U, U],
                    [U, U, { char: '/', attr: pine }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: '\\', attr: pine }, U, U],
                    [U, { char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }, U],
                    [{ char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }],
                    [{ char: '/', attr: pineDark }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: '\\', attr: pineDark }],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U]
                ],
                [
                    [U, U, U, { char: '*', attr: snow }, U, U, U],
                    [U, U, { char: '/', attr: pine }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: '\\', attr: pine }, U, U],
                    [U, { char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }, U],
                    [{ char: '/', attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '\\', attr: pine }],
                    [{ char: '/', attr: pineDark }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: GLYPH.FULL_BLOCK, attr: pine }, { char: '\\', attr: pineDark }],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U],
                    [U, U, U, { char: '|', attr: trunk }, U, U, U]
                ]
            ]
        };
    },
    createSnowman: function () {
        var snow = makeAttr(WHITE, BG_BLACK);
        var hat = makeAttr(BLACK, BG_BLACK);
        var face = makeAttr(BLACK, BG_LIGHTGRAY);
        var carrot = makeAttr(BROWN, BG_LIGHTGRAY);
        var scarf = makeAttr(LIGHTRED, BG_BLACK);
        var button = makeAttr(BLACK, BG_LIGHTGRAY);
        var arm = makeAttr(BROWN, BG_BLACK);
        var U = null;
        return {
            name: 'snowman',
            variants: [
                [
                    [{ char: 'o', attr: snow }, { char: 'o', attr: snow }],
                    [{ char: 'O', attr: snow }, { char: 'O', attr: snow }],
                    [{ char: 'O', attr: snow }, { char: 'O', attr: snow }]
                ],
                [
                    [U, { char: GLYPH.FULL_BLOCK, attr: hat }, U],
                    [{ char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }],
                    [{ char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }],
                    [{ char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }]
                ],
                [
                    [U, { char: '_', attr: hat }, { char: GLYPH.FULL_BLOCK, attr: hat }, { char: '_', attr: hat }, U],
                    [U, { char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }, U],
                    [{ char: '-', attr: arm }, { char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }, { char: '-', attr: arm }],
                    [U, { char: '(', attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: ')', attr: snow }, U],
                    [U, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, U]
                ],
                [
                    [U, { char: '_', attr: hat }, { char: GLYPH.FULL_BLOCK, attr: hat }, { char: '_', attr: hat }, U],
                    [U, { char: '.', attr: face }, { char: 'v', attr: carrot }, { char: '.', attr: face }, U],
                    [U, { char: '~', attr: scarf }, { char: '~', attr: scarf }, { char: '~', attr: scarf }, U],
                    [{ char: '-', attr: arm }, { char: '(', attr: snow }, { char: '*', attr: button }, { char: ')', attr: snow }, { char: '-', attr: arm }],
                    [U, { char: '(', attr: snow }, { char: '*', attr: button }, { char: ')', attr: snow }, U],
                    [U, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, U]
                ],
                [
                    [U, U, { char: '_', attr: hat }, { char: GLYPH.FULL_BLOCK, attr: hat }, { char: '_', attr: hat }, U, U],
                    [U, { char: '(', attr: snow }, { char: '.', attr: face }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: '.', attr: face }, { char: ')', attr: snow }, U],
                    [U, { char: '(', attr: snow }, { char: ' ', attr: snow }, { char: '>', attr: carrot }, { char: ' ', attr: snow }, { char: ')', attr: snow }, U],
                    [U, { char: '~', attr: scarf }, { char: '~', attr: scarf }, { char: '~', attr: scarf }, { char: '~', attr: scarf }, { char: '~', attr: scarf }, U],
                    [{ char: '/', attr: arm }, { char: '(', attr: snow }, { char: ' ', attr: snow }, { char: '*', attr: button }, { char: ' ', attr: snow }, { char: ')', attr: snow }, { char: '\\', attr: arm }],
                    [U, { char: '(', attr: snow }, { char: ' ', attr: snow }, { char: '*', attr: button }, { char: ' ', attr: snow }, { char: ')', attr: snow }, U],
                    [U, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }, U]
                ]
            ]
        };
    },
    createIceCrystal: function () {
        var ice = makeAttr(LIGHTCYAN, BG_BLACK);
        var iceShine = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'icecrystal',
            variants: [
                [
                    [{ char: '*', attr: iceShine }],
                    [{ char: 'V', attr: ice }]
                ],
                [
                    [U, { char: '*', attr: iceShine }, U],
                    [{ char: '/', attr: ice }, { char: '|', attr: ice }, { char: '\\', attr: ice }],
                    [U, { char: 'V', attr: ice }, U]
                ],
                [
                    [U, U, { char: '*', attr: iceShine }, U, U],
                    [{ char: '/', attr: ice }, { char: '/', attr: ice }, { char: '|', attr: ice }, { char: '\\', attr: ice }, { char: '\\', attr: ice }],
                    [U, { char: '/', attr: ice }, { char: '|', attr: iceShine }, { char: '\\', attr: ice }, U],
                    [U, U, { char: 'V', attr: ice }, U, U]
                ],
                [
                    [U, U, { char: '*', attr: iceShine }, U, U],
                    [{ char: '\\', attr: ice }, { char: '/', attr: ice }, { char: '|', attr: ice }, { char: '\\', attr: ice }, { char: '/', attr: ice }],
                    [U, { char: '<', attr: ice }, { char: '+', attr: iceShine }, { char: '>', attr: ice }, U],
                    [{ char: '/', attr: ice }, { char: '\\', attr: ice }, { char: '|', attr: ice }, { char: '/', attr: ice }, { char: '\\', attr: ice }],
                    [U, U, { char: 'V', attr: ice }, U, U]
                ],
                [
                    [U, U, { char: '*', attr: iceShine }, U, U],
                    [{ char: '\\', attr: ice }, { char: '/', attr: ice }, { char: '|', attr: ice }, { char: '\\', attr: ice }, { char: '/', attr: ice }],
                    [U, { char: '<', attr: ice }, { char: '+', attr: iceShine }, { char: '>', attr: ice }, U],
                    [{ char: '/', attr: ice }, { char: '\\', attr: ice }, { char: '|', attr: ice }, { char: '/', attr: ice }, { char: '\\', attr: ice }],
                    [U, U, { char: 'V', attr: ice }, U, U]
                ]
            ]
        };
    },
    createCandyCane: function () {
        var red = makeAttr(LIGHTRED, BG_BLACK);
        var white = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'candycane',
            variants: [
                [
                    [{ char: '?', attr: red }],
                    [{ char: '|', attr: white }]
                ],
                [
                    [{ char: '_', attr: red }, { char: ')', attr: red }],
                    [{ char: '|', attr: white }, U],
                    [{ char: '|', attr: red }, U]
                ],
                [
                    [{ char: '_', attr: red }, { char: '_', attr: white }, { char: ')', attr: red }],
                    [{ char: '|', attr: white }, U, U],
                    [{ char: '|', attr: red }, U, U],
                    [{ char: '|', attr: white }, U, U]
                ],
                [
                    [{ char: '_', attr: red }, { char: '_', attr: white }, { char: ')', attr: red }],
                    [{ char: '|', attr: white }, U, { char: '/', attr: white }],
                    [{ char: '|', attr: red }, U, U],
                    [{ char: '|', attr: white }, U, U],
                    [{ char: '|', attr: red }, U, U]
                ],
                [
                    [{ char: '_', attr: red }, { char: '_', attr: white }, { char: ')', attr: red }],
                    [{ char: '|', attr: white }, U, { char: '/', attr: white }],
                    [{ char: '|', attr: red }, U, U],
                    [{ char: '|', attr: white }, U, U],
                    [{ char: '|', attr: red }, U, U]
                ]
            ]
        };
    },
    createSnowDrift: function () {
        var snow = makeAttr(WHITE, BG_BLACK);
        var snowShade = makeAttr(LIGHTGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'snowdrift',
            variants: [
                [
                    [{ char: GLYPH.LOWER_HALF, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snow }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: snowShade }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snowShade }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: snowShade }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snowShade }]
                ],
                [
                    [U, U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U, U],
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: snowShade }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snowShade }]
                ],
                [
                    [U, U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U, U],
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: snowShade }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.FULL_BLOCK, attr: snow }, { char: GLYPH.LOWER_HALF, attr: snowShade }]
                ]
            ]
        };
    },
    createSignpost: function () {
        var wood = makeAttr(BROWN, BG_BLACK);
        var snow = makeAttr(WHITE, BG_BLACK);
        var text = makeAttr(WHITE, BG_BROWN);
        var U = null;
        return {
            name: 'signpost',
            variants: [
                [
                    [{ char: '[', attr: wood }, { char: ']', attr: wood }],
                    [U, { char: '|', attr: wood }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }],
                    [{ char: '[', attr: wood }, { char: '>', attr: text }, { char: ']', attr: wood }],
                    [U, { char: '|', attr: wood }, U]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }],
                    [{ char: '[', attr: wood }, { char: '>', attr: text }, { char: '>', attr: text }, { char: ']', attr: wood }],
                    [U, { char: '|', attr: wood }, { char: '|', attr: wood }, U],
                    [U, { char: '|', attr: wood }, { char: '|', attr: wood }, U]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: '[', attr: wood }, { char: 'S', attr: text }, { char: 'K', attr: text }, { char: 'I', attr: text }, { char: '>', attr: wood }],
                    [U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '|', attr: wood }, U, U]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, { char: GLYPH.UPPER_HALF, attr: snow }, U],
                    [{ char: '[', attr: wood }, { char: 'S', attr: text }, { char: 'K', attr: text }, { char: 'I', attr: text }, { char: '>', attr: wood }],
                    [U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '|', attr: wood }, U, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('snowpine', WinterSprites.createSnowPine);
registerRoadsideSprite('snowman', WinterSprites.createSnowman);
registerRoadsideSprite('icecrystal', WinterSprites.createIceCrystal);
registerRoadsideSprite('candycane', WinterSprites.createCandyCane);
registerRoadsideSprite('snowdrift', WinterSprites.createSnowDrift);
registerRoadsideSprite('signpost', WinterSprites.createSignpost);
"use strict";
var DesertSprites = {
    createSaguaro: function () {
        var cactus = makeAttr(GREEN, BG_BLACK);
        var cactusDark = makeAttr(CYAN, BG_BLACK);
        var U = null;
        return {
            name: 'saguaro',
            variants: [
                [
                    [{ char: '|', attr: cactus }],
                    [{ char: '|', attr: cactus }],
                    [{ char: '|', attr: cactus }]
                ],
                [
                    [U, { char: '|', attr: cactus }, U],
                    [{ char: '/', attr: cactus }, { char: '|', attr: cactus }, { char: '\\', attr: cactus }],
                    [{ char: '|', attr: cactusDark }, { char: '|', attr: cactus }, { char: '|', attr: cactusDark }],
                    [U, { char: '|', attr: cactus }, U]
                ],
                [
                    [U, U, { char: '(', attr: cactus }, U, U],
                    [{ char: '_', attr: cactus }, U, { char: '|', attr: cactus }, U, { char: '_', attr: cactus }],
                    [{ char: '|', attr: cactusDark }, { char: '/', attr: cactus }, { char: '|', attr: cactus }, { char: '\\', attr: cactus }, { char: '|', attr: cactusDark }],
                    [{ char: '|', attr: cactusDark }, U, { char: '|', attr: cactus }, U, { char: '|', attr: cactusDark }],
                    [U, U, { char: '|', attr: cactus }, U, U]
                ],
                [
                    [U, U, U, { char: '(', attr: cactus }, U, U, U],
                    [{ char: '_', attr: cactus }, U, U, { char: '|', attr: cactus }, U, U, { char: '_', attr: cactus }],
                    [{ char: '|', attr: cactusDark }, U, { char: '/', attr: cactus }, { char: '|', attr: cactus }, { char: '\\', attr: cactus }, U, { char: '|', attr: cactusDark }],
                    [{ char: '|', attr: cactusDark }, { char: '/', attr: cactus }, U, { char: '|', attr: cactus }, U, { char: '\\', attr: cactus }, { char: '|', attr: cactusDark }],
                    [U, { char: '|', attr: cactusDark }, U, { char: '|', attr: cactus }, U, { char: '|', attr: cactusDark }, U],
                    [U, U, U, { char: '|', attr: cactus }, U, U, U]
                ],
                [
                    [U, U, U, { char: '(', attr: cactus }, U, U, U],
                    [{ char: '_', attr: cactus }, U, U, { char: '|', attr: cactus }, U, U, { char: '_', attr: cactus }],
                    [{ char: '|', attr: cactusDark }, U, { char: '/', attr: cactus }, { char: '|', attr: cactus }, { char: '\\', attr: cactus }, U, { char: '|', attr: cactusDark }],
                    [{ char: '|', attr: cactusDark }, { char: '/', attr: cactus }, U, { char: '|', attr: cactus }, U, { char: '\\', attr: cactus }, { char: '|', attr: cactusDark }],
                    [U, { char: '|', attr: cactusDark }, U, { char: '|', attr: cactus }, U, { char: '|', attr: cactusDark }, U],
                    [U, { char: '|', attr: cactusDark }, U, { char: '|', attr: cactus }, U, { char: '|', attr: cactusDark }, U],
                    [U, U, U, { char: '|', attr: cactus }, U, U, U]
                ]
            ]
        };
    },
    createBarrelCactus: function () {
        var cactus = makeAttr(GREEN, BG_BLACK);
        var spine = makeAttr(YELLOW, BG_BLACK);
        var flower = makeAttr(LIGHTRED, BG_BLACK);
        var U = null;
        return {
            name: 'barrel',
            variants: [
                [
                    [{ char: '(', attr: cactus }, { char: ')', attr: cactus }],
                    [{ char: GLYPH.LOWER_HALF, attr: cactus }, { char: GLYPH.LOWER_HALF, attr: cactus }]
                ],
                [
                    [{ char: '(', attr: cactus }, { char: '*', attr: flower }, { char: ')', attr: cactus }],
                    [{ char: GLYPH.LOWER_HALF, attr: cactus }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: GLYPH.LOWER_HALF, attr: cactus }]
                ],
                [
                    [U, { char: '*', attr: flower }, { char: '*', attr: flower }, U],
                    [{ char: '(', attr: cactus }, { char: '|', attr: spine }, { char: '|', attr: spine }, { char: ')', attr: cactus }],
                    [{ char: GLYPH.LOWER_HALF, attr: cactus }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: GLYPH.LOWER_HALF, attr: cactus }]
                ],
                [
                    [U, U, { char: '@', attr: flower }, U, U],
                    [U, { char: '/', attr: spine }, { char: GLYPH.UPPER_HALF, attr: cactus }, { char: '\\', attr: spine }, U],
                    [{ char: '(', attr: cactus }, { char: '|', attr: spine }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: '|', attr: spine }, { char: ')', attr: cactus }],
                    [U, { char: GLYPH.LOWER_HALF, attr: cactus }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: GLYPH.LOWER_HALF, attr: cactus }, U]
                ],
                [
                    [U, U, { char: '@', attr: flower }, U, U],
                    [U, { char: '/', attr: spine }, { char: GLYPH.UPPER_HALF, attr: cactus }, { char: '\\', attr: spine }, U],
                    [{ char: '(', attr: cactus }, { char: '|', attr: spine }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: '|', attr: spine }, { char: ')', attr: cactus }],
                    [U, { char: GLYPH.LOWER_HALF, attr: cactus }, { char: GLYPH.FULL_BLOCK, attr: cactus }, { char: GLYPH.LOWER_HALF, attr: cactus }, U]
                ]
            ]
        };
    },
    createTumbleweed: function () {
        var weed = makeAttr(BROWN, BG_BLACK);
        var weedLight = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'tumbleweed',
            variants: [
                [
                    [{ char: '@', attr: weed }, { char: '@', attr: weed }],
                    [{ char: '@', attr: weed }, { char: '@', attr: weed }]
                ],
                [
                    [U, { char: '@', attr: weedLight }, U],
                    [{ char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weed }],
                    [U, { char: '@', attr: weed }, U]
                ],
                [
                    [U, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, U],
                    [{ char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, { char: '@', attr: weed }],
                    [U, { char: '@', attr: weed }, { char: '@', attr: weed }, U]
                ],
                [
                    [U, { char: '~', attr: weedLight }, { char: '@', attr: weedLight }, { char: '~', attr: weedLight }, U],
                    [{ char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, { char: '@', attr: weed }],
                    [{ char: '@', attr: weed }, { char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weed }, { char: '@', attr: weed }],
                    [U, { char: '~', attr: weed }, { char: '@', attr: weed }, { char: '~', attr: weed }, U]
                ],
                [
                    [U, { char: '~', attr: weedLight }, { char: '@', attr: weedLight }, { char: '~', attr: weedLight }, U],
                    [{ char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, { char: '@', attr: weedLight }, { char: '@', attr: weed }],
                    [{ char: '@', attr: weed }, { char: '@', attr: weed }, { char: '@', attr: weedLight }, { char: '@', attr: weed }, { char: '@', attr: weed }],
                    [U, { char: '~', attr: weed }, { char: '@', attr: weed }, { char: '~', attr: weed }, U]
                ]
            ]
        };
    },
    createCowSkull: function () {
        var bone = makeAttr(WHITE, BG_BLACK);
        var eye = makeAttr(BLACK, BG_LIGHTGRAY);
        var U = null;
        return {
            name: 'cowskull',
            variants: [
                [
                    [{ char: '\\', attr: bone }, { char: 'o', attr: bone }, { char: '/', attr: bone }],
                    [U, { char: 'V', attr: bone }, U]
                ],
                [
                    [{ char: '~', attr: bone }, U, U, { char: '~', attr: bone }],
                    [{ char: '(', attr: bone }, { char: 'o', attr: eye }, { char: 'o', attr: eye }, { char: ')', attr: bone }],
                    [U, { char: '\\', attr: bone }, { char: '/', attr: bone }, U]
                ],
                [
                    [{ char: '~', attr: bone }, { char: '_', attr: bone }, U, { char: '_', attr: bone }, { char: '~', attr: bone }],
                    [{ char: '(', attr: bone }, { char: 'O', attr: eye }, { char: ' ', attr: bone }, { char: 'O', attr: eye }, { char: ')', attr: bone }],
                    [U, { char: '\\', attr: bone }, { char: 'v', attr: bone }, { char: '/', attr: bone }, U],
                    [U, U, { char: 'w', attr: bone }, U, U]
                ],
                [
                    [{ char: '/', attr: bone }, { char: '~', attr: bone }, { char: '_', attr: bone }, U, { char: '_', attr: bone }, { char: '~', attr: bone }, { char: '\\', attr: bone }],
                    [U, { char: '(', attr: bone }, { char: 'O', attr: eye }, { char: ' ', attr: bone }, { char: 'O', attr: eye }, { char: ')', attr: bone }, U],
                    [U, { char: '(', attr: bone }, { char: ' ', attr: bone }, { char: 'v', attr: bone }, { char: ' ', attr: bone }, { char: ')', attr: bone }, U],
                    [U, U, { char: '\\', attr: bone }, { char: 'w', attr: bone }, { char: '/', attr: bone }, U, U],
                    [U, U, U, { char: '|', attr: bone }, U, U, U]
                ],
                [
                    [{ char: '/', attr: bone }, { char: '~', attr: bone }, { char: '_', attr: bone }, U, { char: '_', attr: bone }, { char: '~', attr: bone }, { char: '\\', attr: bone }],
                    [U, { char: '(', attr: bone }, { char: 'O', attr: eye }, { char: ' ', attr: bone }, { char: 'O', attr: eye }, { char: ')', attr: bone }, U],
                    [U, { char: '(', attr: bone }, { char: ' ', attr: bone }, { char: 'v', attr: bone }, { char: ' ', attr: bone }, { char: ')', attr: bone }, U],
                    [U, U, { char: '\\', attr: bone }, { char: 'w', attr: bone }, { char: '/', attr: bone }, U, U],
                    [U, U, U, { char: '|', attr: bone }, U, U, U]
                ]
            ]
        };
    },
    createDesertRock: function () {
        var rock = makeAttr(BROWN, BG_BLACK);
        var rockDark = makeAttr(DARKGRAY, BG_BLACK);
        var rockLight = makeAttr(YELLOW, BG_BLACK);
        var U = null;
        return {
            name: 'desertrock',
            variants: [
                [
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.LOWER_HALF, attr: rock }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: rockLight }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.LOWER_HALF, attr: rockDark }]
                ],
                [
                    [U, { char: '_', attr: rockLight }, { char: '_', attr: rockLight }, U],
                    [{ char: '/', attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.MEDIUM_SHADE, attr: rockDark }, { char: '\\', attr: rockDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.LOWER_HALF, attr: rockDark }]
                ],
                [
                    [U, { char: '_', attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: '_', attr: rockLight }, U],
                    [{ char: '/', attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.MEDIUM_SHADE, attr: rockDark }, { char: '\\', attr: rockDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.LOWER_HALF, attr: rockDark }]
                ],
                [
                    [U, { char: '_', attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: '_', attr: rockLight }, U],
                    [{ char: '/', attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.MEDIUM_SHADE, attr: rockDark }, { char: '\\', attr: rockDark }],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockDark }, { char: GLYPH.LOWER_HALF, attr: rockDark }]
                ]
            ]
        };
    },
    createWesternSign: function () {
        var wood = makeAttr(BROWN, BG_BLACK);
        var text = makeAttr(YELLOW, BG_BROWN);
        var U = null;
        return {
            name: 'westernsign',
            variants: [
                [
                    [{ char: '[', attr: wood }, { char: ']', attr: wood }],
                    [U, { char: '|', attr: wood }]
                ],
                [
                    [{ char: '[', attr: wood }, { char: '>', attr: text }, { char: ']', attr: wood }],
                    [U, { char: '|', attr: wood }, U],
                    [U, { char: '|', attr: wood }, U]
                ],
                [
                    [{ char: '[', attr: wood }, { char: 'G', attr: text }, { char: 'O', attr: text }, { char: '!', attr: text }, { char: '>', attr: wood }],
                    [U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '|', attr: wood }, U, U]
                ],
                [
                    [{ char: '<', attr: wood }, { char: 'W', attr: text }, { char: 'E', attr: text }, { char: 'S', attr: text }, { char: 'T', attr: text }, { char: '>', attr: wood }],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '-', attr: wood }, { char: '+', attr: wood }, { char: '-', attr: wood }, U]
                ],
                [
                    [{ char: '<', attr: wood }, { char: 'W', attr: text }, { char: 'E', attr: text }, { char: 'S', attr: text }, { char: 'T', attr: text }, { char: '>', attr: wood }],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, U, { char: '|', attr: wood }, U, U],
                    [U, U, { char: '-', attr: wood }, { char: '+', attr: wood }, { char: '-', attr: wood }, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('saguaro', DesertSprites.createSaguaro);
registerRoadsideSprite('barrel', DesertSprites.createBarrelCactus);
registerRoadsideSprite('tumbleweed', DesertSprites.createTumbleweed);
registerRoadsideSprite('cowskull', DesertSprites.createCowSkull);
registerRoadsideSprite('desertrock', DesertSprites.createDesertRock);
registerRoadsideSprite('westernsign', DesertSprites.createWesternSign);
"use strict";
var NPC_VEHICLE_TYPES = ['sedan', 'truck', 'sportscar'];
var NPC_VEHICLE_COLORS = [
    { body: RED, trim: LIGHTRED, name: 'red' },
    { body: BLUE, trim: LIGHTBLUE, name: 'blue' },
    { body: GREEN, trim: LIGHTGREEN, name: 'green' },
    { body: CYAN, trim: LIGHTCYAN, name: 'cyan' },
    { body: MAGENTA, trim: LIGHTMAGENTA, name: 'magenta' },
    { body: WHITE, trim: LIGHTGRAY, name: 'white' },
    { body: BROWN, trim: YELLOW, name: 'orange' }
];
function createSedanSprite(bodyColor, trimColor) {
    var body = makeAttr(bodyColor, BG_BLACK);
    var trim = makeAttr(trimColor, BG_BLACK);
    var wheel = makeAttr(DARKGRAY, BG_BLACK);
    var window = makeAttr(CYAN, BG_BLACK);
    var taillight = makeAttr(LIGHTRED, BG_BLACK);
    var U = null;
    return {
        name: 'sedan',
        variants: [
            [
                [{ char: GLYPH.LOWER_HALF, attr: taillight }]
            ],
            [
                [{ char: GLYPH.LOWER_HALF, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.LOWER_HALF, attr: taillight }]
            ],
            [
                [{ char: GLYPH.UPPER_HALF, attr: body }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.UPPER_HALF, attr: body }],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [U, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [U, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }],
                [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
            ]
        ]
    };
}
function createTruckSprite(bodyColor, trimColor) {
    var body = makeAttr(bodyColor, BG_BLACK);
    var trim = makeAttr(trimColor, BG_BLACK);
    var wheel = makeAttr(DARKGRAY, BG_BLACK);
    var window = makeAttr(CYAN, BG_BLACK);
    var taillight = makeAttr(LIGHTRED, BG_BLACK);
    var U = null;
    return {
        name: 'truck',
        variants: [
            [
                [{ char: GLYPH.LOWER_HALF, attr: taillight }]
            ],
            [
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: body }],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [U, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }],
                [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
            ],
            [
                [U, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.FULL_BLOCK, attr: body }],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }],
                [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
            ]
        ]
    };
}
function createSportsCarSprite(bodyColor, trimColor) {
    var body = makeAttr(bodyColor, BG_BLACK);
    var trim = makeAttr(trimColor, BG_BLACK);
    var window = makeAttr(CYAN, BG_BLACK);
    var taillight = makeAttr(LIGHTRED, BG_BLACK);
    var U = null;
    return {
        name: 'sportscar',
        variants: [
            [
                [{ char: GLYPH.LOWER_HALF, attr: taillight }]
            ],
            [
                [{ char: GLYPH.LOWER_HALF, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.LOWER_HALF, attr: taillight }]
            ],
            [
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [U, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ],
            [
                [U, { char: GLYPH.UPPER_HALF, attr: window }, { char: GLYPH.FULL_BLOCK, attr: window }, { char: GLYPH.UPPER_HALF, attr: window }, U],
                [{ char: GLYPH.FULL_BLOCK, attr: taillight }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: taillight }]
            ]
        ]
    };
}
var NPC_SPRITE_CACHE = {};
function getNPCSprite(vehicleType, colorIndex) {
    var color = NPC_VEHICLE_COLORS[colorIndex % NPC_VEHICLE_COLORS.length];
    var key = vehicleType + '_' + color.name;
    if (!NPC_SPRITE_CACHE[key]) {
        switch (vehicleType) {
            case 'sedan':
                NPC_SPRITE_CACHE[key] = createSedanSprite(color.body, color.trim);
                break;
            case 'truck':
                NPC_SPRITE_CACHE[key] = createTruckSprite(color.body, color.trim);
                break;
            case 'sportscar':
                NPC_SPRITE_CACHE[key] = createSportsCarSprite(color.body, color.trim);
                break;
            default:
                NPC_SPRITE_CACHE[key] = createSedanSprite(color.body, color.trim);
        }
    }
    return NPC_SPRITE_CACHE[key];
}
function getRandomNPCSprite() {
    var typeIndex = Math.floor(Math.random() * NPC_VEHICLE_TYPES.length);
    var colorIndex = Math.floor(Math.random() * NPC_VEHICLE_COLORS.length);
    var vehicleType = NPC_VEHICLE_TYPES[typeIndex];
    return {
        sprite: getNPCSprite(vehicleType, colorIndex),
        type: vehicleType,
        colorIndex: colorIndex
    };
}
"use strict";
var SynthwaveTheme = {
    name: 'synthwave',
    description: 'Classic 80s synthwave with magenta sky, purple mountains, and setting sun',
    colors: {
        skyTop: { fg: MAGENTA, bg: BG_BLACK },
        skyMid: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        skyHorizon: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        skyGrid: { fg: MAGENTA, bg: BG_BLACK },
        skyGridGlow: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        celestialCore: { fg: YELLOW, bg: BG_RED },
        celestialGlow: { fg: LIGHTRED, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: LIGHTGRAY, bg: BG_BLACK },
        sceneryPrimary: { fg: MAGENTA, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        sceneryTertiary: { fg: WHITE, bg: BG_BLACK },
        roadSurface: { fg: CYAN, bg: BG_BLACK },
        roadSurfaceAlt: { fg: LIGHTCYAN, bg: BG_BLACK },
        roadStripe: { fg: WHITE, bg: BG_BLACK },
        roadEdge: { fg: LIGHTRED, bg: BG_BLACK },
        roadGrid: { fg: CYAN, bg: BG_BLACK },
        shoulderPrimary: { fg: BROWN, bg: BG_BLACK },
        shoulderSecondary: { fg: BROWN, bg: BG_BLACK },
        roadsideColors: {
            'tree': {
                primary: { fg: LIGHTGREEN, bg: BG_BLACK },
                secondary: { fg: GREEN, bg: BG_BLACK },
                tertiary: { fg: BROWN, bg: BG_BLACK }
            },
            'rock': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'bush': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: LIGHTGREEN, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'grid',
        converging: true,
        horizontal: true
    },
    background: {
        type: 'mountains',
        config: {
            count: 5,
            minHeight: 3,
            maxHeight: 6,
            parallaxSpeed: 0.1
        }
    },
    celestial: {
        type: 'sun',
        size: 3,
        positionX: 0.5,
        positionY: 0.6
    },
    stars: {
        enabled: false,
        density: 0,
        twinkle: false
    },
    ground: {
        type: 'grid',
        primary: { fg: MAGENTA, bg: BG_BLACK },
        secondary: { fg: CYAN, bg: BG_BLACK },
        pattern: {
            gridSpacing: 15,
            radialLines: 10
        }
    },
    roadside: {
        pool: [
            { sprite: 'tree', weight: 3, side: 'both' },
            { sprite: 'rock', weight: 2, side: 'both' },
            { sprite: 'bush', weight: 2, side: 'both' }
        ],
        spacing: 10,
        density: 1.0
    }
};
registerTheme(SynthwaveTheme);
"use strict";
var CityNightTheme = {
    name: 'city_night',
    description: 'Midnight city drive with skyscrapers, stars, and neon lights',
    colors: {
        skyTop: { fg: BLUE, bg: BG_BLACK },
        skyMid: { fg: BLUE, bg: BG_BLACK },
        skyHorizon: { fg: LIGHTBLUE, bg: BG_BLACK },
        skyGrid: { fg: BLUE, bg: BG_BLACK },
        skyGridGlow: { fg: LIGHTBLUE, bg: BG_BLACK },
        celestialCore: { fg: WHITE, bg: BG_CYAN },
        celestialGlow: { fg: LIGHTCYAN, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: CYAN, bg: BG_BLACK },
        sceneryPrimary: { fg: DARKGRAY, bg: BG_BLACK },
        scenerySecondary: { fg: YELLOW, bg: BG_BLACK },
        sceneryTertiary: { fg: LIGHTRED, bg: BG_BLACK },
        roadSurface: { fg: DARKGRAY, bg: BG_LIGHTGRAY },
        roadSurfaceAlt: { fg: BLACK, bg: BG_LIGHTGRAY },
        roadStripe: { fg: YELLOW, bg: BG_LIGHTGRAY },
        roadEdge: { fg: LIGHTBLUE, bg: BG_BLUE },
        roadGrid: { fg: DARKGRAY, bg: BG_LIGHTGRAY },
        shoulderPrimary: { fg: LIGHTGRAY, bg: BG_BLUE },
        shoulderSecondary: { fg: DARKGRAY, bg: BG_BLACK },
        roadsideColors: {
            'building': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK },
                tertiary: { fg: LIGHTCYAN, bg: BG_BLACK }
            },
            'lamppost': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'sign': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK }
            },
            'tree': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: GREEN, bg: BG_BLACK },
                tertiary: { fg: DARKGRAY, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'stars',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'skyscrapers',
        config: {
            density: 0.8,
            hasWindows: true,
            hasAntennas: true,
            parallaxSpeed: 0.15
        }
    },
    celestial: {
        type: 'moon',
        size: 2,
        positionX: 0.85,
        positionY: 0.3
    },
    stars: {
        enabled: true,
        density: 0.4,
        twinkle: true
    },
    roadside: {
        pool: [
            { sprite: 'building', weight: 4, side: 'both' },
            { sprite: 'lamppost', weight: 3, side: 'both' },
            { sprite: 'sign', weight: 2, side: 'right' },
            { sprite: 'tree', weight: 1, side: 'both' }
        ],
        spacing: 12,
        density: 1.2
    }
};
registerTheme(CityNightTheme);
"use strict";
var SunsetBeachTheme = {
    name: 'sunset_beach',
    description: 'Tropical sunset with palm trees, warm orange skies, and beach vibes',
    colors: {
        skyTop: { fg: MAGENTA, bg: BG_BLACK },
        skyMid: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        skyHorizon: { fg: LIGHTRED, bg: BG_BLACK },
        skyGrid: { fg: LIGHTRED, bg: BG_BLACK },
        skyGridGlow: { fg: YELLOW, bg: BG_BLACK },
        celestialCore: { fg: YELLOW, bg: BG_BROWN },
        celestialGlow: { fg: BROWN, bg: BG_RED },
        starBright: { fg: YELLOW, bg: BG_BLACK },
        starDim: { fg: BROWN, bg: BG_BLACK },
        sceneryPrimary: { fg: MAGENTA, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTMAGENTA, bg: BG_BLACK },
        sceneryTertiary: { fg: CYAN, bg: BG_BLACK },
        roadSurface: { fg: BROWN, bg: BG_BLACK },
        roadSurfaceAlt: { fg: YELLOW, bg: BG_BLACK },
        roadStripe: { fg: WHITE, bg: BG_BLACK },
        roadEdge: { fg: YELLOW, bg: BG_BLACK },
        roadGrid: { fg: BROWN, bg: BG_BLACK },
        shoulderPrimary: { fg: YELLOW, bg: BG_BLACK },
        shoulderSecondary: { fg: BROWN, bg: BG_BLACK },
        roadsideColors: {
            'palm': {
                primary: { fg: LIGHTGREEN, bg: BG_BLACK },
                secondary: { fg: GREEN, bg: BG_BLACK },
                tertiary: { fg: BROWN, bg: BG_BLACK }
            },
            'umbrella': {
                primary: { fg: LIGHTRED, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'lifeguard': {
                primary: { fg: LIGHTRED, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK },
                tertiary: { fg: BROWN, bg: BG_BLACK }
            },
            'surfboard': {
                primary: { fg: LIGHTCYAN, bg: BG_BLACK },
                secondary: { fg: CYAN, bg: BG_BLACK }
            },
            'tiki': {
                primary: { fg: YELLOW, bg: BG_BLACK },
                secondary: { fg: LIGHTRED, bg: BG_BLACK },
                tertiary: { fg: BROWN, bg: BG_BLACK }
            },
            'beachhut': {
                primary: { fg: YELLOW, bg: BG_BLACK },
                secondary: { fg: BROWN, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'gradient',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'ocean',
        config: {
            count: 3,
            minHeight: 2,
            maxHeight: 4,
            parallaxSpeed: 0.2
        }
    },
    celestial: {
        type: 'sun',
        size: 4,
        positionX: 0.5,
        positionY: 0.75
    },
    stars: {
        enabled: false,
        density: 0,
        twinkle: false
    },
    ground: {
        type: 'sand',
        primary: { fg: YELLOW, bg: BG_BROWN },
        secondary: { fg: WHITE, bg: BG_BROWN }
    },
    roadside: {
        pool: [
            { sprite: 'palm', weight: 4, side: 'both' },
            { sprite: 'umbrella', weight: 3, side: 'both' },
            { sprite: 'tiki', weight: 2, side: 'both' },
            { sprite: 'surfboard', weight: 2, side: 'both' },
            { sprite: 'lifeguard', weight: 1, side: 'right' },
            { sprite: 'beachhut', weight: 1, side: 'left' }
        ],
        spacing: 55,
        density: 1.3
    }
};
registerTheme(SunsetBeachTheme);
"use strict";
var TwilightForestTheme = {
    name: 'twilight_forest',
    description: 'Enchanted forest at twilight with dual moons and dancing fireflies',
    colors: {
        skyTop: { fg: BLUE, bg: BG_BLACK },
        skyMid: { fg: CYAN, bg: BG_BLACK },
        skyHorizon: { fg: BROWN, bg: BG_BLACK },
        skyGrid: { fg: BLUE, bg: BG_BLACK },
        skyGridGlow: { fg: CYAN, bg: BG_BLACK },
        celestialCore: { fg: WHITE, bg: BG_LIGHTGRAY },
        celestialGlow: { fg: LIGHTCYAN, bg: BG_BLACK },
        starBright: { fg: YELLOW, bg: BG_BLACK },
        starDim: { fg: LIGHTGREEN, bg: BG_BLACK },
        sceneryPrimary: { fg: GREEN, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTGREEN, bg: BG_BLACK },
        sceneryTertiary: { fg: BROWN, bg: BG_BLACK },
        roadSurface: { fg: BROWN, bg: BG_BLACK },
        roadSurfaceAlt: { fg: DARKGRAY, bg: BG_BLACK },
        roadStripe: { fg: YELLOW, bg: BG_BLACK },
        roadEdge: { fg: BROWN, bg: BG_BLACK },
        roadGrid: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderPrimary: { fg: GREEN, bg: BG_BLACK },
        shoulderSecondary: { fg: BROWN, bg: BG_BLACK },
        roadsideColors: {
            'tree': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: LIGHTGREEN, bg: BG_BLACK },
                tertiary: { fg: BROWN, bg: BG_BLACK }
            },
            'rock': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'bush': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: LIGHTGREEN, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'stars',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'forest',
        config: {
            count: 8,
            minHeight: 3,
            maxHeight: 7,
            parallaxSpeed: 0.15
        }
    },
    celestial: {
        type: 'dual_moons',
        size: 3,
        positionX: 0.7,
        positionY: 0.3
    },
    stars: {
        enabled: true,
        density: 0.6,
        twinkle: true
    },
    ground: {
        type: 'grass',
        primary: { fg: GREEN, bg: BG_BLACK },
        secondary: { fg: BROWN, bg: BG_BLACK },
        pattern: {
            grassDensity: 0.4,
            grassChars: ['"', 'v', ',', "'", '.']
        }
    },
    roadside: {
        pool: [
            { sprite: 'tree', weight: 5, side: 'both' },
            { sprite: 'bush', weight: 3, side: 'both' },
            { sprite: 'rock', weight: 1, side: 'both' }
        ],
        spacing: 45,
        density: 1.4
    }
};
registerTheme(TwilightForestTheme);
"use strict";
var HauntedHollowTheme = {
    name: 'haunted_hollow',
    description: 'Race through a haunted cemetery under a blood moon',
    colors: {
        skyTop: { fg: BLACK, bg: BG_BLACK },
        skyMid: { fg: DARKGRAY, bg: BG_BLACK },
        skyHorizon: { fg: MAGENTA, bg: BG_BLACK },
        skyGrid: { fg: DARKGRAY, bg: BG_BLACK },
        skyGridGlow: { fg: MAGENTA, bg: BG_BLACK },
        celestialCore: { fg: RED, bg: BG_BLACK },
        celestialGlow: { fg: LIGHTRED, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: DARKGRAY, bg: BG_BLACK },
        sceneryPrimary: { fg: BLACK, bg: BG_BLACK },
        scenerySecondary: { fg: DARKGRAY, bg: BG_BLACK },
        sceneryTertiary: { fg: MAGENTA, bg: BG_BLACK },
        roadSurface: { fg: DARKGRAY, bg: BG_BLACK },
        roadSurfaceAlt: { fg: BLACK, bg: BG_BLACK },
        roadStripe: { fg: LIGHTRED, bg: BG_BLACK },
        roadEdge: { fg: DARKGRAY, bg: BG_BLACK },
        roadGrid: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderPrimary: { fg: DARKGRAY, bg: BG_BLACK },
        shoulderSecondary: { fg: GREEN, bg: BG_BLACK },
        roadsideColors: {
            'deadtree': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            },
            'gravestone': {
                primary: { fg: LIGHTGRAY, bg: BG_BLACK },
                secondary: { fg: DARKGRAY, bg: BG_BLACK }
            },
            'pumpkin': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'skull': {
                primary: { fg: WHITE, bg: BG_BLACK },
                secondary: { fg: BROWN, bg: BG_BLACK }
            },
            'fence': {
                primary: { fg: DARKGRAY, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'candle': {
                primary: { fg: YELLOW, bg: BG_BLACK },
                secondary: { fg: BROWN, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'stars',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'hills',
        config: {
            count: 6,
            minHeight: 2,
            maxHeight: 5,
            parallaxSpeed: 0.1
        }
    },
    celestial: {
        type: 'moon',
        size: 4,
        positionX: 0.5,
        positionY: 0.25
    },
    stars: {
        enabled: true,
        density: 0.3,
        twinkle: true
    },
    ground: {
        type: 'dither',
        primary: { fg: DARKGRAY, bg: BG_BLACK },
        secondary: { fg: GREEN, bg: BG_BLACK },
        pattern: {
            ditherDensity: 0.4,
            ditherChars: ['.', ',', "'", GLYPH.LIGHT_SHADE]
        }
    },
    roadside: {
        pool: [
            { sprite: 'deadtree', weight: 4, side: 'both' },
            { sprite: 'gravestone', weight: 5, side: 'both' },
            { sprite: 'pumpkin', weight: 2, side: 'both' },
            { sprite: 'skull', weight: 1, side: 'both' },
            { sprite: 'fence', weight: 3, side: 'both' },
            { sprite: 'candle', weight: 2, side: 'both' }
        ],
        spacing: 40,
        density: 1.3
    }
};
registerTheme(HauntedHollowTheme);
"use strict";
var WinterWonderlandTheme = {
    name: 'winter_wonderland',
    description: 'Race through a magical snowy forest with sparkling ice',
    colors: {
        skyTop: { fg: BLUE, bg: BG_BLACK },
        skyMid: { fg: LIGHTCYAN, bg: BG_BLACK },
        skyHorizon: { fg: WHITE, bg: BG_BLACK },
        skyGrid: { fg: LIGHTCYAN, bg: BG_BLACK },
        skyGridGlow: { fg: WHITE, bg: BG_BLACK },
        celestialCore: { fg: WHITE, bg: BG_LIGHTGRAY },
        celestialGlow: { fg: YELLOW, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: LIGHTCYAN, bg: BG_BLACK },
        sceneryPrimary: { fg: WHITE, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTCYAN, bg: BG_BLACK },
        sceneryTertiary: { fg: LIGHTGRAY, bg: BG_BLACK },
        roadSurface: { fg: LIGHTGRAY, bg: BG_BLACK },
        roadSurfaceAlt: { fg: WHITE, bg: BG_BLACK },
        roadStripe: { fg: LIGHTRED, bg: BG_BLACK },
        roadEdge: { fg: WHITE, bg: BG_BLACK },
        roadGrid: { fg: LIGHTCYAN, bg: BG_BLACK },
        shoulderPrimary: { fg: WHITE, bg: BG_BLACK },
        shoulderSecondary: { fg: LIGHTCYAN, bg: BG_BLACK },
        roadsideColors: {
            'snowpine': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK }
            },
            'snowman': {
                primary: { fg: WHITE, bg: BG_BLACK },
                secondary: { fg: LIGHTRED, bg: BG_BLACK }
            },
            'icecrystal': {
                primary: { fg: LIGHTCYAN, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK }
            },
            'candycane': {
                primary: { fg: LIGHTRED, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK }
            },
            'snowdrift': {
                primary: { fg: WHITE, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'signpost': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: WHITE, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'stars',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'mountains',
        config: {
            count: 5,
            minHeight: 4,
            maxHeight: 8,
            parallaxSpeed: 0.12
        }
    },
    celestial: {
        type: 'sun',
        size: 2,
        positionX: 0.3,
        positionY: 0.35
    },
    stars: {
        enabled: true,
        density: 0.5,
        twinkle: true
    },
    ground: {
        type: 'dither',
        primary: { fg: WHITE, bg: BG_BLACK },
        secondary: { fg: LIGHTCYAN, bg: BG_BLACK },
        pattern: {
            ditherDensity: 0.3,
            ditherChars: ['.', '*', GLYPH.LIGHT_SHADE, "'"]
        }
    },
    roadside: {
        pool: [
            { sprite: 'snowpine', weight: 5, side: 'both' },
            { sprite: 'snowman', weight: 2, side: 'both' },
            { sprite: 'icecrystal', weight: 2, side: 'both' },
            { sprite: 'candycane', weight: 1, side: 'both' },
            { sprite: 'snowdrift', weight: 3, side: 'both' },
            { sprite: 'signpost', weight: 1, side: 'both' }
        ],
        spacing: 45,
        density: 1.2
    }
};
registerTheme(WinterWonderlandTheme);
"use strict";
var CactusCanyonTheme = {
    name: 'cactus_canyon',
    description: 'Race through the scorching desert canyons of the Southwest',
    colors: {
        skyTop: { fg: BLUE, bg: BG_BLACK },
        skyMid: { fg: CYAN, bg: BG_BLACK },
        skyHorizon: { fg: YELLOW, bg: BG_BLACK },
        skyGrid: { fg: YELLOW, bg: BG_BLACK },
        skyGridGlow: { fg: BROWN, bg: BG_BLACK },
        celestialCore: { fg: YELLOW, bg: BG_BROWN },
        celestialGlow: { fg: YELLOW, bg: BG_BLACK },
        starBright: { fg: WHITE, bg: BG_BLACK },
        starDim: { fg: YELLOW, bg: BG_BLACK },
        sceneryPrimary: { fg: BROWN, bg: BG_BLACK },
        scenerySecondary: { fg: LIGHTRED, bg: BG_BLACK },
        sceneryTertiary: { fg: YELLOW, bg: BG_BLACK },
        roadSurface: { fg: BROWN, bg: BG_BLACK },
        roadSurfaceAlt: { fg: YELLOW, bg: BG_BLACK },
        roadStripe: { fg: YELLOW, bg: BG_BLACK },
        roadEdge: { fg: BROWN, bg: BG_BLACK },
        roadGrid: { fg: BROWN, bg: BG_BLACK },
        shoulderPrimary: { fg: YELLOW, bg: BG_BLACK },
        shoulderSecondary: { fg: BROWN, bg: BG_BLACK },
        roadsideColors: {
            'saguaro': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: CYAN, bg: BG_BLACK }
            },
            'barrel': {
                primary: { fg: GREEN, bg: BG_BLACK },
                secondary: { fg: LIGHTRED, bg: BG_BLACK }
            },
            'tumbleweed': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'cowskull': {
                primary: { fg: WHITE, bg: BG_BLACK },
                secondary: { fg: LIGHTGRAY, bg: BG_BLACK }
            },
            'desertrock': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            },
            'westernsign': {
                primary: { fg: BROWN, bg: BG_BLACK },
                secondary: { fg: YELLOW, bg: BG_BLACK }
            }
        }
    },
    sky: {
        type: 'gradient',
        converging: false,
        horizontal: false
    },
    background: {
        type: 'dunes',
        config: {
            count: 6,
            minHeight: 3,
            maxHeight: 6,
            parallaxSpeed: 0.1
        }
    },
    celestial: {
        type: 'sun',
        size: 3,
        positionX: 0.6,
        positionY: 0.3
    },
    stars: {
        enabled: false,
        density: 0,
        twinkle: false
    },
    ground: {
        type: 'sand',
        primary: { fg: YELLOW, bg: BG_BLACK },
        secondary: { fg: BROWN, bg: BG_BLACK },
        pattern: {
            ditherDensity: 0.35,
            ditherChars: ['.', ',', "'", GLYPH.LIGHT_SHADE, '~']
        }
    },
    roadside: {
        pool: [
            { sprite: 'saguaro', weight: 4, side: 'both' },
            { sprite: 'barrel', weight: 3, side: 'both' },
            { sprite: 'tumbleweed', weight: 2, side: 'both' },
            { sprite: 'cowskull', weight: 1, side: 'both' },
            { sprite: 'desertrock', weight: 3, side: 'both' },
            { sprite: 'westernsign', weight: 1, side: 'both' }
        ],
        spacing: 50,
        density: 0.9
    }
};
registerTheme(CactusCanyonTheme);
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
"use strict";
var SpriteSheet = {
    createTree: function () {
        var leafTop = makeAttr(LIGHTGREEN, BG_BLACK);
        var leafDark = makeAttr(GREEN, BG_BLACK);
        var trunk = makeAttr(BROWN, BG_BLACK);
        var leafTrunk = makeAttr(LIGHTGREEN, BG_BROWN);
        var U = null;
        return {
            name: 'tree',
            variants: [
                [
                    [{ char: GLYPH.UPPER_HALF, attr: leafTrunk }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.UPPER_HALF, attr: leafDark }],
                    [U, { char: GLYPH.UPPER_HALF, attr: leafTrunk }, U]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.UPPER_HALF, attr: leafDark }],
                    [{ char: GLYPH.DARK_SHADE, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.DARK_SHADE, attr: leafDark }],
                    [U, { char: GLYPH.UPPER_HALF, attr: leafTrunk }, { char: GLYPH.UPPER_HALF, attr: leafTrunk }, U]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.UPPER_HALF, attr: leafDark }],
                    [{ char: GLYPH.DARK_SHADE, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.DARK_SHADE, attr: leafDark }],
                    [U, { char: GLYPH.LOWER_HALF, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.LOWER_HALF, attr: leafDark }, U],
                    [U, U, { char: GLYPH.FULL_BLOCK, attr: trunk }, U, U]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.UPPER_HALF, attr: leafDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafDark }],
                    [U, { char: GLYPH.DARK_SHADE, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.DARK_SHADE, attr: leafDark }, U],
                    [U, U, { char: GLYPH.FULL_BLOCK, attr: trunk }, { char: GLYPH.FULL_BLOCK, attr: trunk }, U, U],
                    [U, U, { char: GLYPH.UPPER_HALF, attr: trunk }, { char: GLYPH.UPPER_HALF, attr: trunk }, U, U]
                ]
            ]
        };
    },
    createRock: function () {
        var rock = makeAttr(DARKGRAY, BG_BLACK);
        var rockLight = makeAttr(LIGHTGRAY, BG_BLACK);
        return {
            name: 'rock',
            variants: [
                [
                    [{ char: GLYPH.LOWER_HALF, attr: rock }]
                ],
                [
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockLight }, { char: GLYPH.LOWER_HALF, attr: rock }]
                ],
                [
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockLight }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.LOWER_HALF, attr: rock }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: rock }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rock }, { char: GLYPH.UPPER_HALF, attr: rock }],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockLight }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.LOWER_HALF, attr: rock }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: rock }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rock }, { char: GLYPH.UPPER_HALF, attr: rock }],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockLight }, { char: GLYPH.FULL_BLOCK, attr: rockLight }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.LOWER_HALF, attr: rock }]
                ]
            ]
        };
    },
    createBush: function () {
        var bush = makeAttr(GREEN, BG_BLACK);
        var bushLight = makeAttr(LIGHTGREEN, BG_BLACK);
        var U = null;
        return {
            name: 'bush',
            variants: [
                [
                    [{ char: GLYPH.LOWER_HALF, attr: bush }]
                ],
                [
                    [{ char: GLYPH.LOWER_HALF, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bushLight }, { char: GLYPH.LOWER_HALF, attr: bush }]
                ],
                [
                    [{ char: GLYPH.LOWER_HALF, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bushLight }, { char: GLYPH.FULL_BLOCK, attr: bush }, { char: GLYPH.LOWER_HALF, attr: bush }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: bush }, { char: GLYPH.UPPER_HALF, attr: bushLight }, { char: GLYPH.UPPER_HALF, attr: bush }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bushLight }, { char: GLYPH.FULL_BLOCK, attr: bush }, { char: GLYPH.LOWER_HALF, attr: bush }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: bush }, { char: GLYPH.UPPER_HALF, attr: bushLight }, { char: GLYPH.UPPER_HALF, attr: bushLight }, { char: GLYPH.UPPER_HALF, attr: bushLight }, { char: GLYPH.UPPER_HALF, attr: bush }, { char: GLYPH.UPPER_HALF, attr: bush }],
                    [{ char: GLYPH.LOWER_HALF, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bushLight }, { char: GLYPH.FULL_BLOCK, attr: bushLight }, { char: GLYPH.FULL_BLOCK, attr: bush }, { char: GLYPH.LOWER_HALF, attr: bush }]
                ]
            ]
        };
    },
    createPlayerCar: function () {
        var body = makeAttr(YELLOW, BG_BLACK);
        var trim = makeAttr(WHITE, BG_BLACK);
        var wheel = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'player_car',
            variants: [
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }],
                    [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
                ]
            ]
        };
    },
    createAICar: function (color) {
        var body = makeAttr(color, BG_BLACK);
        var trim = makeAttr(WHITE, BG_BLACK);
        var wheel = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'ai_car',
            variants: [
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }],
                    [{ char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }],
                    [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }],
                    [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
                ]
            ]
        };
    }
};
function renderSpriteToFrame(frame, sprite, scaleIndex) {
    var variant = sprite.variants[scaleIndex];
    if (!variant) {
        variant = sprite.variants[sprite.variants.length - 1];
    }
    frame.clear();
    for (var row = 0; row < variant.length; row++) {
        for (var col = 0; col < variant[row].length; col++) {
            var cell = variant[row][col];
            if (cell !== null && cell !== undefined) {
                frame.setData(col, row, cell.char, cell.attr);
            }
        }
    }
}
function getSpriteSize(sprite, scaleIndex) {
    var variant = sprite.variants[scaleIndex];
    if (!variant) {
        variant = sprite.variants[sprite.variants.length - 1];
    }
    var height = variant.length;
    var width = 0;
    for (var row = 0; row < variant.length; row++) {
        if (variant[row].length > width) {
            width = variant[row].length;
        }
    }
    return { width: width, height: height };
}
registerRoadsideSprite('tree', SpriteSheet.createTree);
registerRoadsideSprite('rock', SpriteSheet.createRock);
registerRoadsideSprite('bush', SpriteSheet.createBush);
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
        this._staticElementsDirty = false;
        logDebug('Static elements rendered, dirty=' + this._staticElementsDirty);
    };
    FrameRenderer.prototype.beginFrame = function () {
    };
    FrameRenderer.prototype.renderSky = function (trackPosition, curvature, playerSteer, speed, dt) {
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
        if (this.activeTheme.ground && this.activeTheme.ground.type === 'grid') {
            this.renderHolodeckFloor(trackPosition);
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
        this.cycle();
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
        var roadAttr = makeAttr(distance < 10 ? colors.roadSurfaceAlt.fg : colors.roadSurface.fg, distance < 10 ? colors.roadSurfaceAlt.bg : colors.roadSurface.bg);
        var gridAttr = makeAttr(colors.roadGrid.fg, colors.roadGrid.bg);
        var edgeAttr = makeAttr(colors.roadEdge.fg, colors.roadEdge.bg);
        var stripeAttr = makeAttr(colors.roadStripe.fg, colors.roadStripe.bg);
        var shoulderAttr = makeAttr(colors.shoulderPrimary.fg, colors.shoulderPrimary.bg);
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
        console.clear();
    };
    Renderer.prototype.beginFrame = function () {
        this.composer.clear();
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
    Renderer.prototype.shutdown = function () {
        if (this.frame) {
            this.frame.close();
            this.frame = null;
        }
        console.attributes = LIGHTGRAY;
        console.clear();
    };
    return Renderer;
}());
"use strict";
function createInitialState(track, road, playerVehicle) {
    return {
        track: track,
        road: road,
        vehicles: [playerVehicle],
        playerVehicle: playerVehicle,
        items: [],
        time: 0,
        racing: false,
        finished: false,
        cameraX: 0
    };
}
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
"use strict";
var DEFAULT_CONFIG = {
    screenWidth: 80,
    screenHeight: 24,
    tickRate: 60,
    maxTicksPerFrame: 5
};
var Game = (function () {
    function Game(config) {
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
        this.state = null;
    }
    Game.prototype.initWithTrack = function (trackDef) {
        logInfo("Game.initWithTrack(): " + trackDef.name);
        this.renderer.init();
        var themeMapping = {
            'synthwave': 'synthwave',
            'midnight_city': 'city_night',
            'beach_paradise': 'sunset_beach',
            'forest_night': 'twilight_forest',
            'haunted_hollow': 'haunted_hollow',
            'winter_wonderland': 'winter_wonderland',
            'cactus_canyon': 'cactus_canyon'
        };
        var themeName = themeMapping[trackDef.themeId] || 'synthwave';
        if (this.renderer.setTheme) {
            this.renderer.setTheme(themeName);
        }
        var road = buildRoadFromDefinition(trackDef);
        var track = this.trackLoader.load("neon_coast_01");
        track.laps = trackDef.laps;
        track.name = trackDef.name;
        var playerVehicle = new Vehicle();
        playerVehicle.driver = new HumanDriver(this.controls);
        playerVehicle.color = YELLOW;
        playerVehicle.trackZ = 0;
        playerVehicle.playerX = 0;
        this.state = createInitialState(track, road, playerVehicle);
        var npcCount = trackDef.npcCount !== undefined ? trackDef.npcCount : 5;
        this.spawnNPCs(npcCount, road);
        this.physicsSystem.init(this.state);
        this.raceSystem.init(this.state);
        this.itemSystem.initFromTrack(track);
        this.hud.init(0);
        this.running = true;
        this.state.racing = true;
        debugLog.info("Game initialized with track: " + trackDef.name);
        debugLog.info("  Road segments: " + road.segments.length);
        debugLog.info("  Road length: " + road.totalLength);
        debugLog.info("  Laps: " + road.laps);
    };
    Game.prototype.init = function () {
        logInfo("Game.init()");
        var defaultTrack = getTrackDefinition('test_oval');
        if (defaultTrack) {
            this.initWithTrack(defaultTrack);
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
                if (this.state.time - lastLogTime >= 1.0) {
                    debugLog.logVehicle(this.state.playerVehicle);
                    lastLogTime = this.state.time;
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
        this.controls.endFrame();
    };
    Game.prototype.tick = function (dt) {
        if (!this.state)
            return;
        this.state.time += dt;
        this.physicsSystem.update(this.state, dt);
        this.raceSystem.update(this.state, dt);
        this.applyNPCPacing();
        this.itemSystem.update(dt);
        this.itemSystem.checkPickups(this.state.vehicles);
        if (this.controls.wasJustPressed(GameAction.USE_ITEM)) {
            this.itemSystem.useItem(this.state.playerVehicle);
        }
        Collision.processVehicleCollisions(this.state.vehicles);
        this.checkNPCRespawn();
        this.state.cameraX = this.state.playerVehicle.x;
        if (this.state.finished && this.state.racing === false) {
            debugLog.info("Race complete! Exiting game loop. Final time: " + this.state.time.toFixed(2));
            this.running = false;
        }
    };
    Game.prototype.checkNPCRespawn = function () {
        if (!this.state)
            return;
        var playerZ = this.state.playerVehicle.trackZ;
        var respawnDistance = 150;
        for (var i = 0; i < this.state.vehicles.length; i++) {
            var vehicle = this.state.vehicles[i];
            if (vehicle.isNPC && vehicle.trackZ < playerZ - respawnDistance) {
                this.respawnNPCAhead(vehicle);
            }
        }
    };
    Game.prototype.applyNPCPacing = function () {
        if (!this.state)
            return;
        var playerZ = this.state.playerVehicle.trackZ;
        var playerSpeed = this.state.playerVehicle.speed;
        for (var i = 0; i < this.state.vehicles.length; i++) {
            var npc = this.state.vehicles[i];
            if (!npc.isNPC)
                continue;
            var distance = npc.trackZ - playerZ;
            if (distance <= 0)
                continue;
            var commuterBaseSpeed = VEHICLE_PHYSICS.MAX_SPEED * 0.4;
            var pacingSpeed;
            if (distance > 150) {
                pacingSpeed = Math.max(commuterBaseSpeed, playerSpeed * 0.75);
            }
            else if (distance > 80) {
                var t = (distance - 80) / 70;
                var fastSpeed = playerSpeed * 0.75;
                pacingSpeed = commuterBaseSpeed + t * (fastSpeed - commuterBaseSpeed);
            }
            else {
                pacingSpeed = commuterBaseSpeed;
            }
            var speedDiff = pacingSpeed - npc.speed;
            npc.speed += speedDiff * 0.1;
            npc.speed = clamp(npc.speed, commuterBaseSpeed * 0.5, VEHICLE_PHYSICS.MAX_SPEED * 0.85);
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
        var speed = vehicle.speed;
        var dt = 1.0 / this.config.tickRate;
        this.renderer.beginFrame();
        this.renderer.renderSky(trackZ, curvature, playerSteer, speed, dt);
        this.renderer.renderRoad(trackZ, this.state.cameraX, this.state.track, this.state.road);
        this.renderer.renderEntities(this.state.playerVehicle, this.state.vehicles, this.itemSystem.getItemBoxes());
        var hudData = this.hud.compute(this.state.playerVehicle, this.state.track, this.state.road, this.state.vehicles, this.state.time);
        this.renderer.renderHud(hudData);
        this.renderer.endFrame();
    };
    Game.prototype.togglePause = function () {
        this.paused = !this.paused;
        if (!this.paused) {
            this.clock.reset();
            this.timestep.reset();
        }
        logInfo("Game " + (this.paused ? "paused" : "resumed"));
    };
    Game.prototype.spawnNPCs = function (count, road) {
        if (!this.state)
            return;
        var roadLength = road.totalLength;
        var minSpawn = 150;
        var maxSpawn = Math.min(roadLength * 0.8, 800);
        var spawnRange = maxSpawn - minSpawn;
        var spacing = spawnRange / (count + 1);
        for (var i = 0; i < count; i++) {
            var npc = new Vehicle();
            npc.driver = new CommuterDriver();
            npc.isNPC = true;
            var typeIndex = Math.floor(Math.random() * NPC_VEHICLE_TYPES.length);
            npc.npcType = NPC_VEHICLE_TYPES[typeIndex];
            npc.npcColorIndex = Math.floor(Math.random() * NPC_VEHICLE_COLORS.length);
            var colorPalette = NPC_VEHICLE_COLORS[npc.npcColorIndex];
            npc.color = colorPalette.body;
            var baseZ = minSpawn + spacing * (i + 1);
            var jitter = spacing * 0.3 * (Math.random() - 0.5);
            npc.trackZ = baseZ + jitter;
            npc.z = npc.trackZ;
            var laneOffset = (i % 2 === 0) ? -0.3 : 0.3;
            npc.playerX = laneOffset + (Math.random() - 0.5) * 0.4;
            this.state.vehicles.push(npc);
        }
        debugLog.info("Spawned " + count + " NPC commuters");
    };
    Game.prototype.respawnNPCAhead = function (npc) {
        if (!this.state)
            return;
        var playerZ = this.state.playerVehicle.trackZ;
        var roadLength = this.state.road.totalLength;
        var minSeparation = 50;
        var attempts = 0;
        var maxAttempts = 10;
        var validPosition = false;
        var newZ = 0;
        while (!validPosition && attempts < maxAttempts) {
            var spawnDistance = 300 + Math.random() * 300;
            newZ = (playerZ + spawnDistance) % roadLength;
            validPosition = true;
            for (var i = 0; i < this.state.vehicles.length; i++) {
                var other = this.state.vehicles[i];
                if (other === npc || !other.isNPC)
                    continue;
                var dist = Math.abs(other.trackZ - newZ);
                if (dist < minSeparation) {
                    validPosition = false;
                    break;
                }
            }
            attempts++;
        }
        npc.trackZ = newZ;
        npc.z = npc.trackZ;
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
    };
    Game.prototype.isRunning = function () {
        return this.running;
    };
    Game.prototype.shutdown = function () {
        logInfo("Game.shutdown()");
        this.renderer.shutdown();
        this.controls.clearAll();
    };
    return Game;
}());
"use strict";
function showTrackSelector() {
    var tracks = getAllTracks();
    var selectedIndex = 0;
    var pageSize = 5;
    var scrollOffset = 0;
    var oldPauseStatus = bbs.sys_status & SS_PAUSEON;
    bbs.sys_status &= ~SS_PAUSEON;
    console.clear();
    drawTrackSelectorScreen(tracks, selectedIndex, scrollOffset, pageSize);
    while (true) {
        var key = console.inkey(K_UPPER, 500);
        if (key === '')
            continue;
        var needsRedraw = false;
        if (key === KEY_UP) {
            selectedIndex--;
            if (selectedIndex < 0)
                selectedIndex = tracks.length - 1;
            needsRedraw = true;
        }
        else if (key === KEY_DOWN) {
            selectedIndex++;
            if (selectedIndex >= tracks.length)
                selectedIndex = 0;
            needsRedraw = true;
        }
        else if (key === 'W' || key === '8') {
            selectedIndex--;
            if (selectedIndex < 0)
                selectedIndex = tracks.length - 1;
            needsRedraw = true;
        }
        else if (key === 'S' || key === '2') {
            selectedIndex++;
            if (selectedIndex >= tracks.length)
                selectedIndex = 0;
            needsRedraw = true;
        }
        else if (key === '\r' || key === '\n' || key === ' ') {
            if (oldPauseStatus)
                bbs.sys_status |= SS_PAUSEON;
            return {
                selected: true,
                track: tracks[selectedIndex]
            };
        }
        else if (key >= '1' && key <= '9') {
            var quickIndex = parseInt(key, 10) - 1;
            if (quickIndex < tracks.length) {
                if (oldPauseStatus)
                    bbs.sys_status |= SS_PAUSEON;
                return {
                    selected: true,
                    track: tracks[quickIndex]
                };
            }
        }
        else if (key === 'Q' || key === KEY_ESC) {
            if (oldPauseStatus)
                bbs.sys_status |= SS_PAUSEON;
            return {
                selected: false,
                track: null
            };
        }
        if (needsRedraw) {
            if (selectedIndex < scrollOffset) {
                scrollOffset = selectedIndex;
            }
            if (selectedIndex >= scrollOffset + pageSize) {
                scrollOffset = selectedIndex - pageSize + 1;
            }
            console.clear();
            drawTrackSelectorScreen(tracks, selectedIndex, scrollOffset, pageSize);
        }
    }
}
function drawTrackSelectorScreen(tracks, selectedIndex, scrollOffset, pageSize) {
    console.attributes = LIGHTMAGENTA;
    console.print("\r\n");
    console.print("  ========================================\r\n");
    console.attributes = LIGHTCYAN;
    console.print("           SELECT YOUR TRACK\r\n");
    console.attributes = LIGHTMAGENTA;
    console.print("  ========================================\r\n");
    console.print("\r\n");
    var endIndex = Math.min(scrollOffset + pageSize, tracks.length);
    for (var i = scrollOffset; i < endIndex; i++) {
        var track = tracks[i];
        var isSelected = (i === selectedIndex);
        var displayNum = i + 1;
        if (isSelected) {
            console.attributes = LIGHTCYAN;
            console.print("  >> ");
        }
        else {
            console.attributes = DARKGRAY;
            console.print("     ");
        }
        console.attributes = isSelected ? WHITE : LIGHTGRAY;
        console.print(displayNum + ". ");
        console.attributes = isSelected ? LIGHTCYAN : CYAN;
        console.print(padRight(track.name, 20));
        console.attributes = isSelected ? YELLOW : BROWN;
        console.print(" [" + renderDifficultyStars(track.difficulty) + "] ");
        console.attributes = isSelected ? LIGHTGRAY : DARKGRAY;
        console.print(track.laps + " laps");
        console.print("\r\n");
        if (isSelected) {
            console.attributes = LIGHTGRAY;
            console.print("        " + track.description + "\r\n");
            console.attributes = DARKGRAY;
            console.print("        Est. lap time: ~" + track.estimatedLapTime + "s\r\n");
        }
    }
    if (scrollOffset > 0) {
        console.attributes = DARKGRAY;
        console.print("\r\n     ^ More tracks above ^\r\n");
    }
    if (endIndex < tracks.length) {
        console.attributes = DARKGRAY;
        console.print("\r\n     v More tracks below v\r\n");
    }
    console.print("\r\n");
    drawTrackPreview(tracks[selectedIndex]);
    console.print("\r\n");
    console.attributes = LIGHTMAGENTA;
    console.print("  ----------------------------------------\r\n");
    console.attributes = LIGHTGRAY;
    console.print("  W/S or UP/DOWN = Navigate    ENTER = Select\r\n");
    console.print("  1-9 = Quick Select           Q = Back\r\n");
    console.attributes = LIGHTMAGENTA;
    console.print("  ----------------------------------------\r\n");
}
function drawTrackPreview(track) {
    var theme = getTrackTheme(track);
    console.attributes = DARKGRAY;
    console.print("  Theme: ");
    console.attributes = LIGHTGRAY;
    console.print(theme.name + "\r\n");
    console.print("  ");
    console.attributes = theme.sky.top.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.sky.horizon.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.sun.color.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.road.surface.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.road.edge.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.offroad.groundColor.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = theme.background.color.fg;
    console.print(String.fromCharCode(219) + String.fromCharCode(219));
    console.attributes = LIGHTGRAY;
    console.print("\r\n");
}
function padRight(str, len) {
    while (str.length < len) {
        str += ' ';
    }
    return str.substring(0, len);
}
"use strict";
debugLog.init();
debugLog.info("OutRun ANSI starting...");
debugLog.info("Synchronet BBS Door Game");
if (typeof console === 'undefined' || console === null) {
    debugLog.error("No console object - not running in BBS session");
    debugLog.close();
    print("ERROR: OutRun ANSI must be run from a Synchronet BBS terminal session.");
    print("This game cannot run directly with jsexec.");
    print("");
    print("To test, you need to either:");
    print("  1. Run from an actual BBS login session");
    print("  2. Use a terminal emulator that connects to your BBS");
    exit(1);
}
function showTitleScreen() {
    console.clear();
    console.attributes = LIGHTMAGENTA;
    var title = [
        "",
        "     .d88b.  db    db d888888b d8888b. db    db d8b   db",
        "    .8P  Y8. 88    88 `~~88~~' 88  `8D 88    88 888o  88",
        "    88    88 88    88    88    88oobY' 88    88 88V8o 88",
        "    88    88 88    88    88    88`8b   88    88 88 V8o88",
        "    `8b  d8' 88b  d88    88    88 `88. 88b  d88 88  V888",
        "     `Y88P'  ~Y8888P'    YP    88   YD ~Y8888P' VP   V8P",
        ""
    ];
    for (var i = 0; i < title.length; i++) {
        console.print(title[i] + "\r\n");
    }
    console.attributes = CYAN;
    console.print("              =========================================\r\n");
    console.attributes = LIGHTCYAN;
    console.print("                   A N S I   S Y N T H W A V E\r\n");
    console.print("                        R A C E R\r\n");
    console.attributes = CYAN;
    console.print("              =========================================\r\n");
    console.print("\r\n");
    console.attributes = DARKGRAY;
    console.print("         /     |     \\         /     |     \\\r\n");
    console.print("        /      |      \\       /      |      \\\r\n");
    console.attributes = CYAN;
    console.print("    ===/=======+=======\\=====/=======+=======\\===\r\n");
    console.attributes = DARKGRAY;
    console.print("      /        |        \\   /        |        \\\r\n");
    console.print("\r\n");
    console.attributes = WHITE;
    console.print("                    Controls:\r\n");
    console.attributes = LIGHTGRAY;
    console.print("        W/Up = Accelerate   A/Left = Steer Left\r\n");
    console.print("        S/Dn = Brake        D/Right = Steer Right\r\n");
    console.print("        SPACE = Use Item    P = Pause\r\n");
    console.print("\r\n");
    console.attributes = YELLOW;
    console.print("              Press any key to start racing...\r\n");
    console.print("                     Q to quit\r\n");
    console.print("\r\n");
    console.attributes = DARKGRAY;
    console.print("     Version 0.1.0 (Iteration 0) - Bootstrap Build\r\n");
    console.attributes = LIGHTGRAY;
}
function waitForTitleInput() {
    while (true) {
        var key = console.inkey(K_UPPER, 1000);
        if (key !== '') {
            if (key === 'Q') {
                return false;
            }
            return true;
        }
    }
}
function showRaceEndScreen() {
    console.clear();
    console.attributes = LIGHTMAGENTA;
    console.print("\r\n\r\n");
    console.print("  ========================================\r\n");
    console.attributes = LIGHTCYAN;
    console.print("             RACE COMPLETE!\r\n");
    console.attributes = LIGHTMAGENTA;
    console.print("  ========================================\r\n");
    console.print("\r\n");
    console.attributes = LIGHTGRAY;
    console.print("         Thanks for racing!\r\n");
    console.print("\r\n");
    console.attributes = YELLOW;
    console.print("    Press any key to continue...\r\n");
    console.print("\r\n");
    console.attributes = LIGHTGRAY;
    console.inkey(K_NONE, 30000);
}
function main() {
    debugLog.separator("GAME START");
    debugLog.info("Entering main()");
    try {
        var keepPlaying = true;
        while (keepPlaying) {
            debugLog.info("Showing title screen");
            showTitleScreen();
            if (!waitForTitleInput()) {
                debugLog.info("User quit from title screen");
                keepPlaying = false;
                break;
            }
            debugLog.info("Showing track selector");
            var trackSelection = showTrackSelector();
            if (!trackSelection.selected || !trackSelection.track) {
                debugLog.info("User went back from track selection");
                continue;
            }
            debugLog.info("Selected track: " + trackSelection.track.name);
            debugLog.separator("GAME INIT");
            var game = new Game();
            game.initWithTrack(trackSelection.track);
            debugLog.separator("GAME LOOP");
            debugLog.info("Entering game loop");
            game.run();
            debugLog.separator("GAME END");
            debugLog.info("Game loop ended");
            game.shutdown();
            showRaceEndScreen();
            debugLog.info("Returning to splash screen");
        }
        console.clear();
        console.attributes = LIGHTGRAY;
        console.print("Thanks for playing OutRun ANSI!\r\n");
    }
    catch (e) {
        debugLog.separator("FATAL ERROR");
        debugLog.exception("Uncaught exception in main()", e);
        console.clear();
        console.attributes = LIGHTRED;
        console.print("An error occurred: " + e + "\r\n");
        console.attributes = LIGHTGRAY;
        console.print("\r\nError details written to: outrun_debug.log\r\n");
        console.print("Press any key to exit...\r\n");
        console.inkey(K_NONE);
    }
    finally {
        console.attributes = LIGHTGRAY;
        debugLog.separator("LOG END");
        debugLog.close();
    }
}
main();
