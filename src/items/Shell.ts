/**
 * Shell - Projectile item.
 */

interface IProjectile extends IEntity {
  /** Projectile type */
  type: ItemType;

  /** Movement speed */
  speed: number;

  /** ID of vehicle that fired this */
  ownerId: number;
}

class Shell extends Item implements IProjectile {
  speed: number;
  ownerId: number;

  constructor() {
    super(ItemType.SHELL);
    this.speed = 300;
    this.ownerId = -1;
  }

  /**
   * Fire shell from a vehicle.
   */
  static fire(vehicle: IVehicle): Shell {
    var shell = new Shell();
    shell.x = vehicle.x;
    shell.z = vehicle.z + 12;  // Shell starts slightly ahead
    shell.rotation = vehicle.rotation;
    shell.ownerId = vehicle.id;
    shell.speed = 300;
    return shell;
  }

  /**
   * Update shell position.
   */
  updatePosition(dt: number): void {
    this.z += this.speed * dt;
  }

  /**
   * Apply shell hit effect to vehicle.
   */
  static applyHit(vehicle: IVehicle): void {
    vehicle.speed = 0;
    // TODO: Add spin-out state
  }
}
