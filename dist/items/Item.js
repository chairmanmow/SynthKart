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
    ItemType[ItemType["GREEN_SHELL"] = 2] = "GREEN_SHELL";
    ItemType[ItemType["RED_SHELL"] = 3] = "RED_SHELL";
    ItemType[ItemType["BLUE_SHELL"] = 4] = "BLUE_SHELL";
    ItemType[ItemType["SHELL"] = 5] = "SHELL";
    ItemType[ItemType["BANANA"] = 6] = "BANANA";
    ItemType[ItemType["MUSHROOM_TRIPLE"] = 7] = "MUSHROOM_TRIPLE";
    ItemType[ItemType["GREEN_SHELL_TRIPLE"] = 8] = "GREEN_SHELL_TRIPLE";
    ItemType[ItemType["RED_SHELL_TRIPLE"] = 9] = "RED_SHELL_TRIPLE";
    ItemType[ItemType["SHELL_TRIPLE"] = 10] = "SHELL_TRIPLE";
    ItemType[ItemType["BANANA_TRIPLE"] = 11] = "BANANA_TRIPLE";
    ItemType[ItemType["MUSHROOM_GOLDEN"] = 12] = "MUSHROOM_GOLDEN";
    ItemType[ItemType["STAR"] = 13] = "STAR";
    ItemType[ItemType["LIGHTNING"] = 14] = "LIGHTNING";
    ItemType[ItemType["BULLET"] = 15] = "BULLET";
})(ItemType || (ItemType = {}));
function getBaseItemType(type) {
    switch (type) {
        case ItemType.MUSHROOM_TRIPLE:
        case ItemType.MUSHROOM_GOLDEN:
            return ItemType.MUSHROOM;
        case ItemType.GREEN_SHELL_TRIPLE:
            return ItemType.GREEN_SHELL;
        case ItemType.RED_SHELL_TRIPLE:
        case ItemType.SHELL_TRIPLE:
        case ItemType.SHELL:
            return ItemType.RED_SHELL;
        case ItemType.BANANA_TRIPLE:
            return ItemType.BANANA;
        case ItemType.BLUE_SHELL:
            return ItemType.BLUE_SHELL;
        default:
            return type;
    }
}
function getItemUses(type) {
    switch (type) {
        case ItemType.MUSHROOM_TRIPLE:
        case ItemType.GREEN_SHELL_TRIPLE:
        case ItemType.RED_SHELL_TRIPLE:
        case ItemType.SHELL_TRIPLE:
        case ItemType.BANANA_TRIPLE:
            return 3;
        default:
            return 1;
    }
}
function isDurationItem(type) {
    switch (type) {
        case ItemType.MUSHROOM_GOLDEN:
        case ItemType.STAR:
        case ItemType.LIGHTNING:
        case ItemType.BULLET:
            return true;
        default:
            return false;
    }
}
function getItemDuration(type) {
    switch (type) {
        case ItemType.MUSHROOM_GOLDEN: return 8.0;
        case ItemType.STAR: return 8.0;
        case ItemType.LIGHTNING: return 5.0;
        case ItemType.BULLET: return 8.0;
        default: return 0;
    }
}
function itemStaysInSlotWhileActive(type) {
    switch (type) {
        case ItemType.MUSHROOM_GOLDEN:
        case ItemType.BULLET:
            return true;
        default:
            return false;
    }
}
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.respawnTime = 2.5;
        _this.respawnCountdown = -1;
        _this.destructionTimer = 0;
        _this.destructionStartTime = 0;
        _this.pickedUpByPlayer = false;
        return _this;
    }
    Item.prototype.isAvailable = function () {
        return this.active && this.respawnCountdown < 0 && this.destructionTimer <= 0;
    };
    Item.prototype.isBeingDestroyed = function () {
        return this.destructionTimer > 0;
    };
    Item.prototype.pickup = function (byPlayer) {
        if (byPlayer === void 0) { byPlayer = false; }
        this.destructionTimer = 0.4;
        this.destructionStartTime = Date.now();
        this.pickedUpByPlayer = byPlayer;
    };
    Item.prototype.updateRespawn = function (dt) {
        if (this.destructionTimer > 0) {
            this.destructionTimer -= dt;
            if (this.destructionTimer <= 0) {
                this.respawnCountdown = this.respawnTime;
                this.destructionTimer = 0;
            }
        }
        else if (this.respawnCountdown >= 0) {
            this.respawnCountdown -= dt;
        }
    };
    return Item;
}(Entity));
