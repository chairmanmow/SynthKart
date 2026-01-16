/**
 * Item types available in the game.
 */
enum ItemType {
  NONE = 0,
  MUSHROOM,
  SHELL,
  BANANA,
  STAR
}

/**
 * Item - Base interface for pickup items.
 */
interface IItem extends IEntity {
  /** Item type */
  type: ItemType;

  /** Time until item respawns after pickup (seconds) */
  respawnTime: number;

  /** Current respawn countdown (-1 if available) */
  respawnCountdown: number;
}

/**
 * Base Item class.
 */
class Item extends Entity implements IItem {
  type: ItemType;
  respawnTime: number;
  respawnCountdown: number;

  constructor(type: ItemType) {
    super();
    this.type = type;
    this.respawnTime = 10;
    this.respawnCountdown = -1;
  }

  /**
   * Check if item is available for pickup.
   */
  isAvailable(): boolean {
    return this.active && this.respawnCountdown < 0;
  }

  /**
   * Mark item as picked up.
   */
  pickup(): void {
    this.respawnCountdown = this.respawnTime;
  }

  /**
   * Update respawn timer.
   */
  updateRespawn(dt: number): void {
    if (this.respawnCountdown >= 0) {
      this.respawnCountdown -= dt;
    }
  }
}
