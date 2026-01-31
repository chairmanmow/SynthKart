"use strict";
var DEBUG_FORCE_ITEM = null;
var ItemSystem = (function () {
    function ItemSystem() {
        this.items = [];
        this.projectiles = [];
        this.callbacks = {};
    }
    ItemSystem.prototype.setCallbacks = function (callbacks) {
        this.callbacks = callbacks;
    };
    ItemSystem.prototype.initFromTrack = function (_track, road) {
        this.items = [];
        var trackLength = road.totalLength;
        var numRows = Math.max(2, Math.floor(trackLength / 1200));
        var spacing = trackLength / (numRows + 1);
        var rowPatterns = [
            [-12, 0, 12],
            [-10, 0, 10],
            [-14, -5, 5, 14],
            [-12, -4, 4, 12],
            [-14, -7, 0, 7, 14],
            [-10, 10],
            [-12, 12],
            [-14, -6, 2],
            [-2, 6, 14]
        ];
        for (var rowIndex = 1; rowIndex <= numRows; rowIndex++) {
            var z = spacing * rowIndex;
            var patternIdx = (rowIndex - 1) % rowPatterns.length;
            var pattern = rowPatterns[patternIdx];
            for (var j = 0; j < pattern.length; j++) {
                var x = pattern[j];
                x += (globalRand.next() - 0.5) * 2;
                var item = new Item(ItemType.NONE);
                item.x = x;
                item.z = z;
                item.respawnTime = 2.5;
                this.items.push(item);
            }
        }
        logInfo("ItemSystem: Placed " + this.items.length + " item boxes in " + numRows + " rows across track length " + trackLength);
    };
    ItemSystem.prototype.update = function (dt, vehicles, roadLength) {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].updateRespawn(dt);
        }
        if (vehicles && roadLength) {
            for (var j = this.projectiles.length - 1; j >= 0; j--) {
                var shell = this.projectiles[j];
                if (shell.update(dt, vehicles, roadLength)) {
                    this.projectiles.splice(j, 1);
                }
            }
        }
    };
    ItemSystem.prototype.getProjectiles = function () {
        return this.projectiles;
    };
    ItemSystem.prototype.checkPickups = function (vehicles, road) {
        for (var i = 0; i < vehicles.length; i++) {
            var vehicle = vehicles[i];
            if (vehicle.heldItem !== null)
                continue;
            for (var j = 0; j < this.items.length; j++) {
                var item = this.items[j];
                if (!item.isAvailable())
                    continue;
                var dz = vehicle.trackZ - item.z;
                var roadLen = road ? road.totalLength : 10000;
                if (dz > roadLen / 2) {
                    dz -= roadLen;
                }
                else if (dz < -roadLen / 2) {
                    dz += roadLen;
                }
                if (dz < -5 || dz > 15)
                    continue;
                var vehicleX = vehicle.x;
                var itemX = item.x;
                if (road) {
                    var seg = road.getSegment(item.z);
                    if (seg && seg.curve !== 0) {
                        var curveShift = seg.curve * Math.max(0, dz) * 0.3;
                        itemX += curveShift;
                    }
                }
                var dx = vehicleX - itemX;
                var lateralRadius = 12;
                if (Math.abs(dx) < lateralRadius) {
                    var isPlayer = !vehicle.isNPC;
                    item.pickup(isPlayer);
                    var itemType = this.randomItemType(vehicle.racePosition, vehicles.length);
                    vehicle.heldItem = {
                        type: itemType,
                        uses: getItemUses(itemType),
                        activated: false
                    };
                    logInfo("Vehicle picked up " + ItemType[itemType] + " (x" + vehicle.heldItem.uses + ")");
                }
            }
        }
    };
    ItemSystem.prototype.useItem = function (vehicle, allVehicles, fireBackward) {
        if (vehicle.heldItem === null)
            return;
        var itemType = vehicle.heldItem.type;
        var consumed = false;
        switch (itemType) {
            case ItemType.MUSHROOM:
            case ItemType.MUSHROOM_TRIPLE:
                Mushroom.applyEffect(vehicle);
                consumed = true;
                break;
            case ItemType.MUSHROOM_GOLDEN:
                if (!vehicle.heldItem.activated) {
                    vehicle.heldItem.activated = true;
                    this.applyDurationEffect(vehicle, itemType);
                    logInfo("Golden Mushroom ACTIVATED - unlimited boosts for duration!");
                }
                Mushroom.applyEffect(vehicle);
                return;
            case ItemType.STAR:
                this.applyDurationEffect(vehicle, itemType);
                vehicle.heldItem = null;
                return;
            case ItemType.LIGHTNING:
                if (allVehicles) {
                    this.applyLightning(vehicle, allVehicles);
                    vehicle.flashTimer = 0.3;
                }
                vehicle.heldItem = null;
                return;
            case ItemType.BULLET:
                if (!vehicle.heldItem.activated) {
                    vehicle.heldItem.activated = true;
                    this.applyDurationEffect(vehicle, itemType);
                    logInfo("Bullet Bill ACTIVATED - autopilot engaged!");
                }
                return;
            case ItemType.GREEN_SHELL:
            case ItemType.GREEN_SHELL_TRIPLE:
                {
                    var greenShell = Shell.fireGreen(vehicle, fireBackward === true);
                    this.projectiles.push(greenShell);
                }
                consumed = true;
                break;
            case ItemType.RED_SHELL:
            case ItemType.RED_SHELL_TRIPLE:
            case ItemType.SHELL:
            case ItemType.SHELL_TRIPLE:
                if (allVehicles) {
                    var redShell = Shell.fireRed(vehicle, allVehicles);
                    this.projectiles.push(redShell);
                }
                consumed = true;
                break;
            case ItemType.BLUE_SHELL:
                if (allVehicles) {
                    var blueShell = Shell.fireBlue(vehicle, allVehicles);
                    this.projectiles.push(blueShell);
                }
                consumed = true;
                break;
            case ItemType.BANANA:
            case ItemType.BANANA_TRIPLE:
                {
                    var banana = Banana.drop(vehicle);
                    this.projectiles.push(banana);
                }
                consumed = true;
                break;
        }
        if (consumed && vehicle.heldItem) {
            vehicle.heldItem.uses--;
            if (vehicle.heldItem.uses <= 0) {
                vehicle.heldItem = null;
            }
        }
    };
    ItemSystem.prototype.applyDurationEffect = function (vehicle, type) {
        var duration = getItemDuration(type);
        vehicle.addEffect(type, duration, vehicle.id);
        vehicle.boostMinSpeed = Math.max(vehicle.speed, VEHICLE_PHYSICS.MAX_SPEED * 0.5);
        switch (type) {
            case ItemType.MUSHROOM_GOLDEN:
                vehicle.boostMultiplier = 1.4;
                vehicle.speed = Math.min(vehicle.speed * 1.2, VEHICLE_PHYSICS.MAX_SPEED * 1.4);
                break;
            case ItemType.STAR:
                vehicle.boostMultiplier = 1.35;
                vehicle.speed = Math.min(vehicle.speed * 1.25, VEHICLE_PHYSICS.MAX_SPEED * 1.35);
                break;
            case ItemType.BULLET:
                vehicle.boostMultiplier = 1.6;
                vehicle.speed = VEHICLE_PHYSICS.MAX_SPEED * 1.6;
                vehicle.boostMinSpeed = VEHICLE_PHYSICS.MAX_SPEED * 1.5;
                break;
        }
        logInfo("Applied " + ItemType[type] + " effect for " + duration + "s, minSpeed: " + vehicle.boostMinSpeed);
    };
    ItemSystem.prototype.applyLightning = function (user, allVehicles) {
        var duration = getItemDuration(ItemType.LIGHTNING);
        var hitCount = 0;
        for (var i = 0; i < allVehicles.length; i++) {
            var v = allVehicles[i];
            if (v.id === user.id)
                continue;
            if (v.racePosition >= user.racePosition)
                continue;
            if (v.hasEffect && (v.hasEffect(ItemType.STAR) ||
                v.hasEffect(ItemType.BULLET))) {
                continue;
            }
            v.addEffect(ItemType.LIGHTNING, duration, user.id);
            hitCount++;
        }
        if (this.callbacks.onLightningStrike) {
            this.callbacks.onLightningStrike(hitCount);
        }
        logInfo("Lightning struck " + hitCount + " opponents ahead (positions 1-" + (user.racePosition - 1) + ")!");
    };
    ItemSystem.prototype.randomItemType = function (position, totalRacers) {
        if (DEBUG_FORCE_ITEM !== null) {
            return DEBUG_FORCE_ITEM;
        }
        var roll = globalRand.next();
        var positionFactor = totalRacers > 1 ? (position - 1) / (totalRacers - 1) : 0;
        if (positionFactor < 0.25) {
            if (roll < 0.40)
                return ItemType.BANANA;
            if (roll < 0.70)
                return ItemType.GREEN_SHELL;
            if (roll < 0.85)
                return ItemType.MUSHROOM;
            if (roll < 0.95)
                return ItemType.RED_SHELL;
            return ItemType.BANANA_TRIPLE;
        }
        else if (positionFactor < 0.50) {
            if (roll < 0.25)
                return ItemType.MUSHROOM;
            if (roll < 0.45)
                return ItemType.GREEN_SHELL;
            if (roll < 0.65)
                return ItemType.RED_SHELL;
            if (roll < 0.80)
                return ItemType.BANANA;
            if (roll < 0.90)
                return ItemType.MUSHROOM_TRIPLE;
            return ItemType.GREEN_SHELL_TRIPLE;
        }
        else if (positionFactor < 0.75) {
            if (roll < 0.20)
                return ItemType.MUSHROOM_TRIPLE;
            if (roll < 0.35)
                return ItemType.RED_SHELL;
            if (roll < 0.50)
                return ItemType.RED_SHELL_TRIPLE;
            if (roll < 0.65)
                return ItemType.MUSHROOM_GOLDEN;
            if (roll < 0.80)
                return ItemType.STAR;
            if (roll < 0.90)
                return ItemType.LIGHTNING;
            return ItemType.MUSHROOM_GOLDEN;
        }
        else {
            if (roll < 0.20)
                return ItemType.MUSHROOM_GOLDEN;
            if (roll < 0.40)
                return ItemType.STAR;
            if (roll < 0.55)
                return ItemType.BULLET;
            if (roll < 0.70)
                return ItemType.LIGHTNING;
            if (roll < 0.80)
                return ItemType.BLUE_SHELL;
            if (roll < 0.90)
                return ItemType.RED_SHELL_TRIPLE;
            return ItemType.MUSHROOM_GOLDEN;
        }
    };
    ItemSystem.prototype.getItemBoxes = function () {
        return this.items;
    };
    return ItemSystem;
}());
