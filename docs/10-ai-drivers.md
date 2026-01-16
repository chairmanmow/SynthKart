# AI Drivers

## Overview

CPU-controlled drivers provide competition in single-player mode. The AI must:
- Navigate the track (follow the racing line)
- Avoid collisions (with other vehicles and obstacles)
- Use items strategically
- Provide appropriate challenge (rubber-banding difficulty)

## AI Architecture

```
┌────────────────────────────────────────────────────────────┐
│                       CpuDriver                            │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Perception  │─▶│   Planning   │─▶│  Execution   │    │
│  │  (see world) │  │  (decide)    │  │  (act)       │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│         │                 │                 │             │
│         ▼                 ▼                 ▼             │
│     Track data       Target point      DriverIntent       │
│     Nearby vehicles  Speed target      (accel, steer,     │
│     Items            Item decision       useItem)         │
└────────────────────────────────────────────────────────────┘
```

## Perception

The AI "sees" relevant game state:

```typescript
interface AIPerception {
  // Track information
  trackPosition: number;      // Current Z along track
  distanceToNextCheckpoint: number;
  upcomingCurve: CurveInfo;   // Next curve direction and severity

  // Vehicle state
  speed: number;
  lateralOffset: number;      // Distance from centerline
  heading: number;            // Current direction vs track direction

  // Nearby entities
  vehiclesAhead: VehicleInfo[];
  vehiclesBehind: VehicleInfo[];
  itemsNearby: ItemInfo[];

  // Race state
  currentPosition: number;    // 1st, 2nd, etc.
  lapProgress: number;        // 0-1 through current lap
  heldItem: ItemType | null;
}

interface CurveInfo {
  direction: -1 | 0 | 1;  // -1 = left, 0 = straight, 1 = right
  severity: number;        // 0 = gentle, 1 = hairpin
  distance: number;        // How far ahead
}

interface VehicleInfo {
  distance: number;        // Distance from this vehicle
  lateralOffset: number;   // Left/right relative to us
  speed: number;
  isPlayer: boolean;
}
```

### Building Perception

```typescript
function buildPerception(vehicle: IVehicle, state: GameState): AIPerception {
  const track = state.track;

  // Find upcoming curve
  const lookahead = vehicle.speed * 2;  // Look 2 seconds ahead
  const upcomingCurve = analyzeCurve(track, vehicle.z, lookahead);

  // Find nearby vehicles
  const vehiclesAhead: VehicleInfo[] = [];
  const vehiclesBehind: VehicleInfo[] = [];

  for (const other of state.vehicles) {
    if (other.id === vehicle.id) continue;

    const dz = other.z - vehicle.z;
    const info: VehicleInfo = {
      distance: Math.abs(dz),
      lateralOffset: other.x - vehicle.x,
      speed: other.speed,
      isPlayer: other.driver instanceof HumanDriver
    };

    if (dz > 0) {
      vehiclesAhead.push(info);
    } else {
      vehiclesBehind.push(info);
    }
  }

  // Sort by distance
  vehiclesAhead.sort((a, b) => a.distance - b.distance);
  vehiclesBehind.sort((a, b) => a.distance - b.distance);

  return {
    trackPosition: vehicle.z,
    distanceToNextCheckpoint: getDistanceToCheckpoint(vehicle, track),
    upcomingCurve,
    speed: vehicle.speed,
    lateralOffset: vehicle.x - getCenterlineX(track, vehicle.z),
    heading: vehicle.rotation - getTrackDirection(track, vehicle.z),
    vehiclesAhead,
    vehiclesBehind,
    itemsNearby: findNearbyItems(vehicle, state.items),
    currentPosition: vehicle.racePosition,
    lapProgress: vehicle.checkpoint / track.checkpoints.length,
    heldItem: vehicle.heldItem
  };
}
```

## Planning

The AI decides what to do based on perception:

```typescript
interface AITarget {
  targetX: number;         // Lateral position to aim for
  targetSpeed: number;     // Speed to maintain
  useItem: boolean;        // Whether to use held item
  itemTarget?: IVehicle;   // Who to target with item
}

function planAction(perception: AIPerception, difficulty: number): AITarget {
  let targetX = 0;  // Default: track centerline
  let targetSpeed = MAX_SPEED;
  let useItem = false;

  // 1. Racing line: aim for curve apex
  if (perception.upcomingCurve.severity > 0.3) {
    // Cut toward inside of curve
    const apexOffset = perception.upcomingCurve.direction * TRACK_WIDTH * 0.3;
    targetX = apexOffset;

    // Slow down for curves
    const slowdown = 1 - (perception.upcomingCurve.severity * 0.4);
    targetSpeed *= slowdown;
  }

  // 2. Avoidance: steer away from nearby vehicles
  const nearestAhead = perception.vehiclesAhead[0];
  if (nearestAhead && nearestAhead.distance < AVOIDANCE_DISTANCE) {
    // Steer away from their lateral position
    const avoidDirection = nearestAhead.lateralOffset > 0 ? -1 : 1;
    targetX += avoidDirection * AVOIDANCE_OFFSET;

    // Slow down if directly behind
    if (Math.abs(nearestAhead.lateralOffset) < VEHICLE_WIDTH) {
      targetSpeed = Math.min(targetSpeed, nearestAhead.speed * 0.95);
    }
  }

  // 3. Item usage
  if (perception.heldItem) {
    useItem = shouldUseItem(perception);
  }

  // 4. Difficulty adjustment (rubber-banding)
  targetSpeed *= getDifficultySpeedMultiplier(perception, difficulty);

  return { targetX, targetSpeed, useItem };
}
```

## Execution

Convert plan to control inputs:

```typescript
function executeTarget(vehicle: IVehicle, target: AITarget, dt: number): DriverIntent {
  const currentX = vehicle.x;
  const steerError = target.targetX - currentX;

  // P controller for steering
  const steerP = 0.1;
  let steer = clamp(steerError * steerP, -1, 1);

  // Add some noise for human-like imprecision
  steer += (Math.random() - 0.5) * 0.05;

  // Acceleration based on speed difference
  const speedError = target.targetSpeed - vehicle.speed;
  let accelerate = speedError > 0 ? 1 : (speedError < -10 ? -1 : 0);

  return {
    accelerate,
    steer,
    useItem: target.useItem
  };
}
```

## CpuDriver Class

```typescript
class CpuDriver implements IDriver {
  private difficulty: number;  // 0.0 to 1.0
  private personality: AIPersonality;

  constructor(difficulty: number, personality: AIPersonality) {
    this.difficulty = difficulty;
    this.personality = personality;
  }

  update(vehicle: IVehicle, state: GameState, dt: number): DriverIntent {
    const perception = buildPerception(vehicle, state);
    const target = planAction(perception, this.difficulty);
    return executeTarget(vehicle, target, dt);
  }
}
```

## Difficulty System

### Rubber-Banding

AI adjusts performance based on position relative to player:

```typescript
function getDifficultySpeedMultiplier(perception: AIPerception, baseDifficulty: number): number {
  // Find player
  const playerBehind = perception.vehiclesBehind.find(v => v.isPlayer);
  const playerAhead = perception.vehiclesAhead.find(v => v.isPlayer);

  if (playerBehind) {
    // AI is ahead of player - slow down slightly
    const leadDistance = playerBehind.distance;
    const slowdown = 1 - (leadDistance / 500) * (1 - baseDifficulty) * 0.2;
    return Math.max(slowdown, 0.85);
  }

  if (playerAhead) {
    // AI is behind player - speed up
    const behindDistance = playerAhead.distance;
    const speedup = 1 + (behindDistance / 500) * baseDifficulty * 0.15;
    return Math.min(speedup, 1.15);
  }

  return 1.0;
}
```

### Difficulty Presets

```typescript
const DIFFICULTY_PRESETS = {
  EASY: {
    baseSpeed: 0.75,
    reactionTime: 0.3,     // Seconds
    mistakeChance: 0.1,    // Per second
    itemUseSmart: 0.3,     // Chance to use item optimally
  },
  MEDIUM: {
    baseSpeed: 0.9,
    reactionTime: 0.15,
    mistakeChance: 0.03,
    itemUseSmart: 0.6,
  },
  HARD: {
    baseSpeed: 1.0,
    reactionTime: 0.05,
    mistakeChance: 0.01,
    itemUseSmart: 0.9,
  }
};
```

## Personalities

Add variety with different AI personalities:

```typescript
interface AIPersonality {
  aggression: number;      // 0-1: how close they get to others
  riskTaking: number;      // 0-1: how late they brake for curves
  itemPreference: number;  // 0-1: offensive vs defensive item use
  consistency: number;     // 0-1: how steady their driving is
}

const PERSONALITIES: AIPersonality[] = [
  { aggression: 0.8, riskTaking: 0.7, itemPreference: 0.9, consistency: 0.5 },  // Aggressive
  { aggression: 0.3, riskTaking: 0.4, itemPreference: 0.3, consistency: 0.9 },  // Cautious
  { aggression: 0.5, riskTaking: 0.9, itemPreference: 0.5, consistency: 0.4 },  // Risky
  { aggression: 0.5, riskTaking: 0.5, itemPreference: 0.5, consistency: 0.8 },  // Balanced
];
```

## Item Usage AI

When to use items:

```typescript
function shouldUseItem(perception: AIPerception): boolean {
  const item = perception.heldItem;
  if (!item) return false;

  switch (item) {
    case ItemType.MUSHROOM:
      // Use on straights, not curves
      return perception.upcomingCurve.severity < 0.2 &&
             perception.upcomingCurve.distance > 100;

    case ItemType.SHELL:
      // Use when someone is ahead and in range
      const target = perception.vehiclesAhead[0];
      return target && target.distance < SHELL_RANGE &&
             Math.abs(target.lateralOffset) < VEHICLE_WIDTH * 2;

    case ItemType.BANANA:
      // Drop when someone is close behind
      const chaser = perception.vehiclesBehind[0];
      return chaser && chaser.distance < 50;

    default:
      return false;
  }
}
```

## Racing Line Calculation

Pre-compute optimal racing line for track:

```typescript
interface RacingLinePoint {
  z: number;         // Track position
  idealX: number;    // Optimal lateral position
  idealSpeed: number; // Optimal speed
}

function computeRacingLine(track: ITrack): RacingLinePoint[] {
  const line: RacingLinePoint[] = [];

  for (let z = 0; z < track.length; z += RACING_LINE_RESOLUTION) {
    const curvature = getTrackCurvature(track, z);
    const nextCurvature = getTrackCurvature(track, z + 50);

    // Cut toward inside of upcoming curve
    const idealX = -nextCurvature * TRACK_WIDTH * 0.35;

    // Speed based on current curvature
    const idealSpeed = MAX_SPEED * (1 - Math.abs(curvature) * 0.5);

    line.push({ z, idealX, idealSpeed });
  }

  return line;
}
```

## Performance Optimization

### Update Frequency
Don't need to run full AI every frame:

```typescript
class CpuDriver {
  private lastUpdateTime: number = 0;
  private cachedIntent: DriverIntent = { accelerate: 0, steer: 0, useItem: false };
  private readonly UPDATE_INTERVAL = 100;  // ms

  update(vehicle: IVehicle, state: GameState, dt: number): DriverIntent {
    const now = state.time;

    if (now - this.lastUpdateTime > this.UPDATE_INTERVAL) {
      this.lastUpdateTime = now;
      this.cachedIntent = this.computeIntent(vehicle, state, dt);
    }

    return this.cachedIntent;
  }
}
```

### Perception Caching
Share perception data between AI drivers when possible.

### LOD for Distant AI
AI far from player can use simpler logic:

```typescript
function getAIUpdateRate(distanceFromPlayer: number): number {
  if (distanceFromPlayer < 100) return 50;   // Near: 20 Hz
  if (distanceFromPlayer < 300) return 100;  // Medium: 10 Hz
  return 200;                                  // Far: 5 Hz
}
```

## Debugging AI

Visualize AI decisions:

```typescript
function renderAIDebug(vehicle: IVehicle, perception: AIPerception, target: AITarget): void {
  // Draw target point
  drawMarker(target.targetX, vehicle.z + 50, 'X', CYAN);

  // Draw perception radius
  drawCircle(vehicle.x, vehicle.z, PERCEPTION_RANGE, YELLOW);

  // Draw racing line
  // etc.
}
```
