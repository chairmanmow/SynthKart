# Items & Powerups (Future)

## Item system concept
- Items are events + temporary modifiers applied to VehicleState.
- All items produce:
  - an immediate effect (optional)
  - a duration modifier (optional)
  - a collision behavior (optional)

## Examples
### Mushroom
- Applies speed multiplier for N seconds.
- Consumes 1 inventory slot.

### Shell
- Spawns a projectile entity with ownerId.
- On hit: victim speed drops to 0 briefly + spin timer.
- Decrement shell count for attacker on fire (not on hit).

## Collision requirements
- Broadphase: grid or simple radius checks
- Narrowphase: segment intersection or circle-vs-circle for early versions