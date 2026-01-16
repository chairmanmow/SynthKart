# Architecture

## High-level loop
- Input → Driver intent
- Physics update → Vehicle state
- Game state update → lap/time/checkpoints
- Render snapshot build (pure data)
- Render snapshot draw (CP437 output)

## Core boundaries
### game/
Owns:
- Authoritative GameState
- System wiring
- High-level mode transitions (menus later)

Does not own:
- Rendering details
- Low-level console I/O

### render/
Owns:
- CP437 scene composition
- Layering (skyline, road, sprites, HUD)
- Minimizing terminal writes

Does not own:
- Physics calculations
- Input handling
- Track rules

### world/
Owns:
- Track definition format
- Coordinate systems (track-space ↔ world-space)
- Checkpoints/finish line geometry

### entities/
Owns:
- Vehicle state
- Driver intent interface (human + CPU)
- No rendering

### synchro/
Owns:
- The only place allowed to touch Synchronet-specific globals directly
- Thin wrappers/shims only (e.g., capability detection)

## Data flow: Render Snapshot
Renderer should not read/write GameState directly.
Instead:
- Build a RenderSnapshot object each tick:
  - camera pose
  - road params
  - skyline params
  - sun visibility params
  - sprite list (vehicle + props)
  - HUD values (speed, lap time, position)
Renderer draws snapshot, no side effects beyond output.