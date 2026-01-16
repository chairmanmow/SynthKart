# OutRun ANSI — Vision Document

## What Is This?

**OutRun ANSI** is a text-mode racing game for Synchronet BBS systems, rendered entirely in ANSI escape codes and CP437 block characters. It draws inspiration from:

- **OutRun** (1986) — The iconic pseudo-3D racing aesthetic, endless summer vibes, branching routes
- **Mario Kart** — Items, power-ups, competitive multiplayer chaos
- **Synthwave/Retrowave** — Neon grids, sunset gradients, 80s cyberpunk atmosphere

## Target Experience

A player connects to a BBS via terminal (SyncTERM, NetRunner, etc.) and selects the game from the door menu. They're greeted with:

1. **Title Screen** — Animated synthwave grid, pulsing neon title
2. **Track Selection** — Choose from themed tracks (Neon Coast, Cyber Highway, etc.)
3. **Race** — Pseudo-3D perspective road, AI opponents, item pickups
4. **Results** — Lap times, position, high score board

The entire experience happens in an 80x24 (or 80x25) terminal using:
- CP437 block characters for shading and shapes
- ANSI colors for the synthwave palette (magenta, cyan, yellow, deep blue)
- Careful character selection to create the illusion of depth

## Why Text Mode?

1. **Nostalgia** — BBSes are a living museum of terminal computing
2. **Constraint-driven creativity** — 80x24 grid forces elegant solutions
3. **Universal compatibility** — Any terminal emulator can play
4. **Low bandwidth** — Works over slow connections
5. **Unique aesthetic** — Nothing else looks quite like CP437 art

## Technical Pillars

### Pseudo-3D Road Rendering
The road uses a classic technique: horizontal scanlines that get narrower and closer together toward the horizon. Block characters (░▒▓█) create depth shading. The road curves left/right by offsetting each scanline.

### Entity System
Vehicles, items, and scenery are "entities" with position, velocity, and sprite data. The renderer projects world coordinates to screen coordinates based on distance from camera.

### Fixed Timestep Game Loop
To maintain consistent physics regardless of terminal speed, the game uses a fixed timestep (e.g., 60 ticks/second logical) with interpolation for rendering.

### Synchronet Integration
The game runs as a Synchronet "external program" (door), using Synchronet's JavaScript runtime. It leverages:
- `console` object for input/output
- `frame.js` for efficient screen updates
- `js.exec_dir` for file paths
- User/system objects for persistence

## Aesthetic Guidelines

### Color Palette
- **Background**: Deep blue (#000033 equivalent → ANSI blue on black)
- **Road**: Dark gray to white gradient
- **Horizon**: Magenta to orange sunset gradient
- **Grid lines**: Bright cyan
- **Player vehicle**: Yellow/white
- **Opponents**: Various colors
- **Items**: Bright, saturated colors

### Typography
- Title uses large block-letter ASCII art
- HUD uses clean single-line displays
- Numbers are crisp and readable

### Animation
- Road stripes scroll toward viewer
- Horizon grid pulses subtly
- Vehicles bob slightly
- Items rotate or pulse

## Scope Boundaries

### In Scope
- Single-player racing against AI
- Multiple tracks with different themes
- Item/power-up system
- Local high scores
- Potentially inter-node multiplayer (stretch)

### Out of Scope
- Network play outside the BBS
- Saveable career mode
- Track editor (data files are hand-authored)
- Sound (unless Synchronet provides audio APIs)

## Success Criteria

1. **Runs reliably** on Synchronet without crashes
2. **Looks impressive** in a standard 80x24 terminal
3. **Plays smoothly** at reasonable frame rates (10-15 FPS minimum)
4. **Feels fun** — the racing should be engaging, not just a tech demo
5. **Is maintainable** — clean code that can be extended

## Development Philosophy

- **Iterate** — Get something running, then improve
- **Constrain** — Embrace limitations, don't fight them
- **Document** — Future maintainers (including AI agents) need context
- **Test on real hardware** — Verify in actual BBS environment

---

*"Chase the sunset. Feel the neon. Race the grid."*
