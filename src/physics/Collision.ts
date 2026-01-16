/**
 * Collision - Collision detection and response.
 * Stub for Iteration 0.
 */

interface AABB {
  x: number;
  z: number;
  halfWidth: number;
  halfLength: number;
}

class Collision {
  /**
   * Check if two AABBs overlap.
   */
  static aabbOverlap(a: AABB, b: AABB): boolean {
    return Math.abs(a.x - b.x) < (a.halfWidth + b.halfWidth) &&
           Math.abs(a.z - b.z) < (a.halfLength + b.halfLength);
  }

  /**
   * Get AABB for a vehicle.
   */
  static vehicleToAABB(v: IVehicle): AABB {
    return {
      x: v.x,
      z: v.z,
      halfWidth: 4,   // Vehicle half-width
      halfLength: 6   // Vehicle half-length
    };
  }

  /**
   * Check if vehicle is off track.
   */
  static isOffTrack(vehicle: IVehicle, track: ITrack): boolean {
    var centerX = track.getCenterlineX(vehicle.z);
    var lateralDist = Math.abs(vehicle.x - centerX);
    return lateralDist > track.width / 2;
  }

  /**
   * Resolve vehicle-to-boundary collision.
   */
  static resolveBoundary(vehicle: IVehicle, track: ITrack): void {
    var centerX = track.getCenterlineX(vehicle.z);
    var halfWidth = track.width / 2;
    var lateralDist = vehicle.x - centerX;

    if (Math.abs(lateralDist) > halfWidth) {
      // Push back onto track
      var dir = lateralDist > 0 ? 1 : -1;
      vehicle.x = centerX + dir * halfWidth * 0.95;

      // Slow down
      vehicle.speed *= 0.8;
    }
  }

  /**
   * Detect and resolve all collisions.
   * Stub - full implementation in later iteration.
   */
  static processCollisions(vehicles: IVehicle[], track: ITrack): void {
    // Check boundary collisions
    for (var i = 0; i < vehicles.length; i++) {
      this.resolveBoundary(vehicles[i], track);
    }

    // Vehicle-vehicle collisions: TODO
  }
}
