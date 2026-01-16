/**
 * Vehicle - A racing vehicle for pseudo-3D racing.
 *
 * PSEUDO-3D RACER PHYSICS:
 * In classic sprite-scaled racers (OutRun, Pole Position), the car
 * doesn't turn - the ROAD curves. The player's position is measured
 * relative to the road centerline.
 *
 * Key concepts:
 * - playerX: position from -1.0 (left edge) to +1.0 (right edge)
 * - speed: how fast you move along the Z axis (down the road)
 * - Road curvature pushes you toward the outside of curves
 * - Steering counteracts this centrifugal drift
 * - Off-road (|playerX| > 1.0) slows you down dramatically
 */

interface IVehicle extends IEntity {
  /** Current speed (0 to maxSpeed) */
  speed: number;

  /** Player position relative to road center (-1 to 1 = on road) */
  playerX: number;

  /** Position along the track (Z world units) */
  trackZ: number;

  /** The driver controlling this vehicle */
  driver: IDriver | null;

  /** Current lap (1-indexed) */
  lap: number;

  /** Last checkpoint index passed */
  checkpoint: number;

  /** Race position (1 = first) */
  racePosition: number;

  /** Held item type, or null */
  heldItem: ItemType | null;

  /** Vehicle color for rendering */
  color: number;

  /** Is the vehicle off the road? */
  isOffRoad: boolean;

  /** Is the vehicle crashed (recovering)? */
  isCrashed: boolean;

  /** Crash recovery timer */
  crashTimer: number;

  /** Update vehicle with road data */
  updatePhysics(road: Road, intent: DriverIntent, dt: number): void;
}

/**
 * Vehicle physics tuning for pseudo-3D racing.
 * These values are tuned for the feel of classic arcade racers.
 */
var VEHICLE_PHYSICS = {
  // Speed settings (world units per second)
  MAX_SPEED: 300,         // Top speed (segments per second * segment length)
  ACCEL: 150,             // Acceleration rate
  BRAKE: 250,             // Braking rate  
  DECEL: 20,              // Natural deceleration when coasting (cruise control)
  OFFROAD_DECEL: 200,     // Heavy slowdown when off-road
  
  // Steering (how fast playerX changes per second)
  STEER_RATE: 2.0,        // Base steering rate
  STEER_SPEED_FACTOR: 0.3,// Steering reduced by this % at max speed
  
  // Centrifugal force - how much curves push you outward  
  CENTRIFUGAL: 0.6,       // Multiplied by speed ratio and curve
  
  // Road boundaries
  ROAD_HALF_WIDTH: 1.0,   // playerX = +/- 1.0 is road edge
  OFFROAD_LIMIT: 1.8,     // Crash if |playerX| exceeds this
  
  // Crash recovery
  CRASH_TIME: 1.5,        // Seconds to recover from crash
};

/**
 * Vehicle implementation for pseudo-3D racing.
 */
class Vehicle extends Entity implements IVehicle {
  speed: number;
  playerX: number;
  trackZ: number;
  driver: IDriver | null;
  lap: number;
  checkpoint: number;
  racePosition: number;
  heldItem: ItemType | null;
  color: number;
  isOffRoad: boolean;
  isCrashed: boolean;
  crashTimer: number;

  constructor() {
    super();
    this.speed = 0;
    this.playerX = 0;      // Centered on road
    this.trackZ = 0;       // Start of track
    this.x = 0;            // Screen X (derived from playerX)
    this.z = 0;            // Screen Z (same as trackZ)
    this.driver = null;
    this.lap = 1;
    this.checkpoint = 0;
    this.racePosition = 1;
    this.heldItem = null;
    this.color = YELLOW;
    this.isOffRoad = false;
    this.isCrashed = false;
    this.crashTimer = 0;
  }

  /**
   * Update vehicle physics for one frame.
   * This is the core pseudo-3D racer physics.
   */
  updatePhysics(road: Road, intent: DriverIntent, dt: number): void {
    // --- CRASH RECOVERY ---
    if (this.isCrashed) {
      this.crashTimer -= dt;
      if (this.crashTimer <= 0) {
        this.isCrashed = false;
        this.crashTimer = 0;
        this.playerX = 0;  // Reset to center after crash
      }
      return;  // No control during crash
    }

    // --- ACCELERATION / BRAKING ---
    if (intent.accelerate > 0) {
      this.speed += VEHICLE_PHYSICS.ACCEL * dt;
    } else if (intent.accelerate < 0) {
      this.speed -= VEHICLE_PHYSICS.BRAKE * dt;
    } else {
      // Cruise control - very gradual slowdown
      this.speed -= VEHICLE_PHYSICS.DECEL * dt;
    }

    // --- OFF-ROAD DETECTION & SLOWDOWN ---
    this.isOffRoad = Math.abs(this.playerX) > VEHICLE_PHYSICS.ROAD_HALF_WIDTH;
    if (this.isOffRoad) {
      this.speed -= VEHICLE_PHYSICS.OFFROAD_DECEL * dt;
    }

    // Clamp speed (can't go negative or over max)
    this.speed = clamp(this.speed, 0, VEHICLE_PHYSICS.MAX_SPEED);

    // --- STEERING ---
    // Steering effectiveness decreases at high speed
    var speedRatio = this.speed / VEHICLE_PHYSICS.MAX_SPEED;
    var steerMult = 1.0 - (speedRatio * VEHICLE_PHYSICS.STEER_SPEED_FACTOR);
    var steerDelta = intent.steer * VEHICLE_PHYSICS.STEER_RATE * steerMult * dt;
    this.playerX += steerDelta;

    // --- CENTRIFUGAL FORCE ---
    // Road curves push you toward the outside
    // This is what makes steering necessary on curves!
    var curve = road.getCurvature(this.trackZ);
    var centrifugal = curve * speedRatio * VEHICLE_PHYSICS.CENTRIFUGAL * dt;
    this.playerX += centrifugal;

    // --- CRASH CHECK ---
    if (Math.abs(this.playerX) > VEHICLE_PHYSICS.OFFROAD_LIMIT) {
      this.triggerCrash();
      return;
    }

    // --- ADVANCE ALONG TRACK ---
    this.trackZ += this.speed * dt;

    // Wrap trackZ when completing a lap
    if (this.trackZ >= road.totalLength) {
      this.trackZ = this.trackZ % road.totalLength;
    }

    // Sync Entity position for rendering
    this.z = this.trackZ;
    this.x = this.playerX * 20;  // Scale playerX to screen coordinates
  }

  /**
   * Trigger a crash - stop and recover.
   */
  triggerCrash(): void {
    debugLog.warn("CRASH! playerX=" + this.playerX.toFixed(3) + " (limit=" + VEHICLE_PHYSICS.OFFROAD_LIMIT + ")");
    debugLog.info("  trackZ=" + this.trackZ.toFixed(1) + " speed=" + this.speed.toFixed(1));
    debugLog.info("  Entering recovery for " + VEHICLE_PHYSICS.CRASH_TIME + " seconds");
    
    this.isCrashed = true;
    this.crashTimer = VEHICLE_PHYSICS.CRASH_TIME;
    this.speed = 0;
  }
}
