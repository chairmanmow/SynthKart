# Collisions

## Overview

Collision detection and response in OutRun ANSI handles:
- Vehicle-to-vehicle collisions
- Vehicle-to-track-boundary collisions
- Vehicle-to-item collisions
- Vehicle-to-scenery collisions (props)

Given the pseudo-3D rendering style, collision detection happens in 2D (top-down view) while appearing 3D to the player.

## Collision Geometry

### Vehicles
Vehicles use axis-aligned bounding boxes (AABBs) for simplicity:

```typescript
interface AABB {
  x: number;       // Center X
  z: number;       // Center Z (along track)
  halfWidth: number;
  halfLength: number;
}

function vehicleToAABB(v: IVehicle): AABB {
  return {
    x: v.x,
    z: v.z,
    halfWidth: VEHICLE_WIDTH / 2,
    halfLength: VEHICLE_LENGTH / 2
  };
}
```

For more accuracy with rotated vehicles, use oriented bounding boxes (OBBs) or separating axis theorem (SAT). Start with AABB, upgrade if needed.

### Track Boundaries
The track is defined by a centerline with width. Collision with boundaries:

```typescript
function isOffTrack(vehicle: IVehicle, track: ITrack): boolean {
  // Find closest point on centerline
  const closest = findClosestCenterlinePoint(vehicle.z, track.centerline);

  // Calculate lateral distance from centerline
  const lateralDist = Math.abs(vehicle.x - closest.x);

  // Half the road width is the boundary
  const halfWidth = track.width / 2;

  return lateralDist > halfWidth;
}
```

### Items
Items use circular collision volumes:

```typescript
interface Circle {
  x: number;
  z: number;
  radius: number;
}

function itemToCircle(item: IItem): Circle {
  return {
    x: item.x,
    z: item.z,
    radius: ITEM_RADIUS
  };
}
```

## Collision Detection

### AABB vs AABB

```typescript
function aabbOverlap(a: AABB, b: AABB): boolean {
  return Math.abs(a.x - b.x) < (a.halfWidth + b.halfWidth) &&
         Math.abs(a.z - b.z) < (a.halfLength + b.halfLength);
}
```

### AABB vs Circle

```typescript
function aabbCircleOverlap(box: AABB, circle: Circle): boolean {
  // Find closest point on AABB to circle center
  const closestX = Math.max(box.x - box.halfWidth,
                   Math.min(circle.x, box.x + box.halfWidth));
  const closestZ = Math.max(box.z - box.halfLength,
                   Math.min(circle.z, box.z + box.halfLength));

  // Check if closest point is within circle
  const dx = circle.x - closestX;
  const dz = circle.z - closestZ;
  return (dx * dx + dz * dz) < (circle.radius * circle.radius);
}
```

### Broad Phase

Don't check every entity against every other. Use spatial partitioning:

```typescript
class SpatialGrid {
  private cellSize: number = 50;  // World units per cell
  private cells: Map<string, IEntity[]> = new Map();

  private getCell(x: number, z: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cz = Math.floor(z / this.cellSize);
    return `${cx},${cz}`;
  }

  insert(entity: IEntity): void {
    const cell = this.getCell(entity.x, entity.z);
    if (!this.cells.has(cell)) {
      this.cells.set(cell, []);
    }
    this.cells.get(cell)!.push(entity);
  }

  query(x: number, z: number, radius: number): IEntity[] {
    const results: IEntity[] = [];
    const minCx = Math.floor((x - radius) / this.cellSize);
    const maxCx = Math.floor((x + radius) / this.cellSize);
    const minCz = Math.floor((z - radius) / this.cellSize);
    const maxCz = Math.floor((z + radius) / this.cellSize);

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cz = minCz; cz <= maxCz; cz++) {
        const cell = `${cx},${cz}`;
        if (this.cells.has(cell)) {
          results.push(...this.cells.get(cell)!);
        }
      }
    }
    return results;
  }

  clear(): void {
    this.cells.clear();
  }
}
```

### Narrow Phase Algorithm

```typescript
function detectCollisions(entities: IEntity[]): CollisionPair[] {
  const grid = new SpatialGrid();
  const collisions: CollisionPair[] = [];

  // Populate grid
  for (const e of entities) {
    grid.insert(e);
  }

  // Check each entity against nearby entities
  for (const e of entities) {
    const nearby = grid.query(e.x, e.z, MAX_ENTITY_RADIUS * 2);

    for (const other of nearby) {
      if (other.id <= e.id) continue;  // Avoid duplicate pairs

      if (checkCollision(e, other)) {
        collisions.push({ a: e, b: other });
      }
    }
  }

  return collisions;
}
```

## Collision Response

### Vehicle-to-Vehicle

When two vehicles collide:

1. **Separate them** (penetration resolution)
2. **Exchange momentum** (bounce effect)
3. **Apply damage/slowdown** (gameplay effect)

```typescript
function resolveVehicleCollision(a: IVehicle, b: IVehicle): void {
  // Calculate overlap
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist === 0) return;  // Coincident, skip

  const overlap = (VEHICLE_WIDTH) - dist;
  if (overlap <= 0) return;  // Not actually overlapping

  // Normalize direction
  const nx = dx / dist;
  const nz = dz / dist;

  // Separate equally
  const separation = overlap / 2;
  a.x -= nx * separation;
  a.z -= nz * separation;
  b.x += nx * separation;
  b.z += nz * separation;

  // Simple momentum exchange (assume equal mass)
  const relVelX = b.vx - a.vx;
  const relVelZ = b.vz - a.vz;
  const relVelDotNormal = relVelX * nx + relVelZ * nz;

  // Only resolve if approaching
  if (relVelDotNormal > 0) return;

  const restitution = 0.5;  // Bounciness
  const impulse = -(1 + restitution) * relVelDotNormal / 2;

  a.vx -= impulse * nx;
  a.vz -= impulse * nz;
  b.vx += impulse * nx;
  b.vz += impulse * nz;

  // Gameplay effect: both vehicles slow down
  a.speed *= 0.9;
  b.speed *= 0.9;
}
```

### Vehicle-to-Boundary

When a vehicle hits the track edge:

```typescript
function resolveBoundaryCollision(v: IVehicle, track: ITrack): void {
  const closest = findClosestCenterlinePoint(v.z, track.centerline);
  const halfWidth = track.width / 2;

  const lateralDist = v.x - closest.x;

  if (Math.abs(lateralDist) > halfWidth) {
    // Push back onto track
    const sign = lateralDist > 0 ? 1 : -1;
    v.x = closest.x + sign * halfWidth * 0.95;

    // Bounce velocity
    v.vx = -v.vx * 0.5;

    // Slow down (friction)
    v.speed *= 0.8;

    // Play bump sound/effect (future)
  }
}
```

### Vehicle-to-Item

When a vehicle hits an item pickup:

```typescript
function resolveItemCollision(v: IVehicle, item: IItem): void {
  // Vehicle picks up item
  if (!v.heldItem) {
    v.heldItem = item.type;
    item.active = false;  // Remove from world

    // Play pickup sound (future)
  }
}
```

### Projectile Collisions

Shells and other projectiles:

```typescript
function resolveProjectileCollision(proj: IProjectile, target: IVehicle): void {
  // Apply effect to target
  switch (proj.type) {
    case ProjectileType.SHELL:
      target.spinOut = true;
      target.spinTimer = 1.5;  // seconds
      target.speed = 0;
      break;
    // ... other projectile types
  }

  // Remove projectile
  proj.active = false;
}
```

## Collision Layers

Not everything collides with everything:

```typescript
enum CollisionLayer {
  VEHICLE    = 1 << 0,
  ITEM       = 1 << 1,
  PROJECTILE = 1 << 2,
  BOUNDARY   = 1 << 3,
  SCENERY    = 1 << 4,
}

const COLLISION_MATRIX: Record<CollisionLayer, number> = {
  [CollisionLayer.VEHICLE]:    CollisionLayer.VEHICLE | CollisionLayer.ITEM |
                               CollisionLayer.PROJECTILE | CollisionLayer.BOUNDARY |
                               CollisionLayer.SCENERY,
  [CollisionLayer.ITEM]:       CollisionLayer.VEHICLE,
  [CollisionLayer.PROJECTILE]: CollisionLayer.VEHICLE | CollisionLayer.SCENERY,
  [CollisionLayer.BOUNDARY]:   CollisionLayer.VEHICLE,
  [CollisionLayer.SCENERY]:    CollisionLayer.VEHICLE | CollisionLayer.PROJECTILE,
};

function shouldCollide(layerA: CollisionLayer, layerB: CollisionLayer): boolean {
  return (COLLISION_MATRIX[layerA] & layerB) !== 0;
}
```

## Performance Considerations

### Spatial Hashing Cell Size
Choose cell size based on entity density. Too small = many cells to check. Too large = many entities per cell.

Rule of thumb: cell size ≈ 2× largest entity size.

### Continuous Collision Detection
Fast-moving projectiles can tunnel through targets. For shells:

```typescript
function sweepTest(proj: IProjectile, dt: number, targets: IVehicle[]): IVehicle | null {
  const steps = Math.ceil(proj.speed * dt / PROJECTILE_RADIUS);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const testX = proj.x + proj.vx * dt * t;
    const testZ = proj.z + proj.vz * dt * t;

    for (const target of targets) {
      if (circleOverlap({ x: testX, z: testZ, radius: PROJECTILE_RADIUS },
                        vehicleToCircle(target))) {
        return target;
      }
    }
  }
  return null;
}
```

### Frame Coherence
Entities don't move far between frames. Cache collision pairs and only re-check if entities moved significantly.

## Collision Events

Report collisions for sound, effects, scoring:

```typescript
interface CollisionEvent {
  type: 'vehicle-vehicle' | 'vehicle-boundary' | 'vehicle-item' | 'projectile-hit';
  entityA: IEntity;
  entityB?: IEntity;
  position: { x: number; z: number };
  severity: number;  // 0-1 for sound volume, effect intensity
}

class CollisionSystem {
  private events: CollisionEvent[] = [];

  processCollisions(state: GameState): CollisionEvent[] {
    this.events = [];

    // ... detection and resolution code ...
    // Push events when collisions occur

    return this.events;
  }
}
```

## Testing Collisions

Visual debug mode:

```typescript
function renderCollisionDebug(state: GameState): void {
  for (const v of state.vehicles) {
    const aabb = vehicleToAABB(v);
    drawRect(aabb.x - aabb.halfWidth, aabb.z - aabb.halfLength,
             aabb.halfWidth * 2, aabb.halfLength * 2, DEBUG_COLOR);
  }

  // Draw track boundaries
  // Draw item pickups
  // etc.
}
```
