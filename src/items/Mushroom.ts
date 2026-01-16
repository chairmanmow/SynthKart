/**
 * Mushroom - Speed boost item.
 */

class Mushroom extends Item {
  /** Boost multiplier */
  boostMultiplier: number;

  /** Boost duration in seconds */
  boostDuration: number;

  constructor() {
    super(ItemType.MUSHROOM);
    this.boostMultiplier = 1.5;
    this.boostDuration = 2.0;
  }

  /**
   * Apply mushroom effect to vehicle.
   */
  static applyEffect(vehicle: IVehicle): void {
    // Instant speed boost
    vehicle.speed = Math.min(
      vehicle.speed * 1.5,
      VEHICLE_PHYSICS.MAX_SPEED * 1.3
    );
  }
}
