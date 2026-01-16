/**
 * ItemSystem - Manages item spawns and effects.
 * Stub for Iteration 0.
 */

interface ItemBoxData {
  x: number;
  z: number;
  respawnTime: number;
}

class ItemSystem {
  private items: Item[];
  private projectiles: IProjectile[];

  constructor() {
    this.items = [];
    this.projectiles = [];
  }

  /**
   * Initialize item boxes from track data.
   */
  initFromTrack(_track: ITrack): void {
    // TODO: Load item box positions from track data
    // For now, create some default item boxes
    var itemPositions: ItemBoxData[] = [
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
  }

  /**
   * Update all items (respawn timers, projectiles).
   */
  update(dt: number): void {
    // Update respawn timers
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].updateRespawn(dt);
    }

    // Update projectiles
    for (var j = this.projectiles.length - 1; j >= 0; j--) {
      var proj = this.projectiles[j];
      proj.z += proj.speed * dt;

      // Remove if out of range
      if (proj.z > 10000) {
        this.projectiles.splice(j, 1);
      }
    }
  }

  /**
   * Check for vehicle-item collisions.
   */
  checkPickups(vehicles: IVehicle[]): void {
    for (var i = 0; i < vehicles.length; i++) {
      var vehicle = vehicles[i];
      if (vehicle.heldItem !== null) continue;

      for (var j = 0; j < this.items.length; j++) {
        var item = this.items[j];
        if (!item.isAvailable()) continue;

        // Simple distance check
        var dx = vehicle.x - item.x;
        var dz = vehicle.z - item.z;
        if (Math.abs(dx) < 10 && Math.abs(dz) < 10) {
          // Pickup!
          item.pickup();
          vehicle.heldItem = this.randomItemType();
          logInfo("Vehicle " + vehicle.id + " picked up item: " + vehicle.heldItem);
        }
      }
    }
  }

  /**
   * Use a vehicle's held item.
   */
  useItem(vehicle: IVehicle): void {
    if (vehicle.heldItem === null) return;

    switch (vehicle.heldItem) {
      case ItemType.MUSHROOM:
        Mushroom.applyEffect(vehicle);
        break;
      case ItemType.SHELL:
        var shell = Shell.fire(vehicle);
        this.projectiles.push(shell);
        break;
      // TODO: Other items
    }

    vehicle.heldItem = null;
  }

  /**
   * Get random item type (weighted by position).
   */
  private randomItemType(): ItemType {
    var roll = globalRand.next();
    if (roll < 0.5) return ItemType.MUSHROOM;
    if (roll < 0.8) return ItemType.SHELL;
    return ItemType.BANANA;
  }

  /**
   * Get all item boxes for rendering.
   */
  getItemBoxes(): Item[] {
    return this.items;
  }

  /**
   * Get all projectiles for rendering.
   */
  getProjectiles(): IProjectile[] {
    return this.projectiles;
  }
}
