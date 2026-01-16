# OutRun ANSI

A synthwave racing game for Synchronet BBS, rendered in ANSI/CP437 graphics.

Inspired by **OutRun** (1986) and **Mario Kart** - experience neon-lit highways, power-ups, and competitive racing through your terminal!

```
    ██████╗ ██╗   ██╗████████╗██████╗ ██╗   ██╗███╗   ██╗
   ██╔═══██╗██║   ██║╚══██╔══╝██╔══██╗██║   ██║████╗  ██║
   ██║   ██║██║   ██║   ██║   ██████╔╝██║   ██║██╔██╗ ██║
   ██║   ██║██║   ██║   ██║   ██╔══██╗██║   ██║██║╚██╗██║
   ╚██████╔╝╚██████╔╝   ██║   ██║  ██║╚██████╔╝██║ ╚████║
    ╚═════╝  ╚═════╝    ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
                  A N S I   R A C E R
```

## Features (Planned)

- 🏎️ **Pseudo-3D Racing** - Classic road rendering with horizon, curves, and hills
- 🌴 **Synthwave Aesthetics** - Neon colors, palm trees, sunset skies in CP437
- 🎮 **Mario Kart Items** - Mushroom boosts, shells, and more
- 🤖 **AI Opponents** - Rubber-banding CPU drivers with personalities
- 🏁 **Multiple Tracks** - JSON-defined courses
- 📊 **HUD Display** - Speedometer, minimap, lap timer, position

## Quick Start

### Building

```bash
# Install TypeScript compiler
npm install

# Build the game
npm run build

# Output: dist/outrun.js
```

### Running (Synchronet)

```bash
# Local test
jsexec xtrn/outrun/dist/outrun.js

# Or configure as external program in SCFG
```

See [scripts/build.md](scripts/build.md) for detailed deployment instructions.

## Controls

| Key | Action |
|-----|--------|
| W / ↑ | Accelerate |
| S / ↓ | Brake |
| A / ← | Steer Left |
| D / → | Steer Right |
| Space | Use Item |
| P | Pause |
| Q | Quit |

## Project Structure

```
outrun/
├── src/               # TypeScript source
│   ├── main.ts        # Entry point
│   ├── game/          # Game loop, state
│   ├── entities/      # Vehicles, drivers
│   ├── physics/       # Movement, collision
│   ├── render/        # ANSI rendering
│   ├── hud/           # UI elements
│   ├── input/         # Controls
│   ├── items/         # Power-ups
│   ├── world/         # Tracks, checkpoints
│   └── util/          # Math, logging
├── data/
│   └── tracks/        # JSON track definitions
├── dist/              # Compiled output
│   └── outrun.js      # Single runnable file
├── docs/              # Architecture documentation
└── scripts/           # Build & deployment
```

## Documentation

- [Architecture Overview](docs/01-architecture.md)
- [CP437 Rendering](docs/02-rendering-cp437.md)
- [Game Loop & Timing](docs/03-game-loop-and-timing.md)
- [Input Handling](docs/04-input-and-controls.md)
- [Vehicle Model](docs/05-vehice-and-driver-model.md)
- [Tracks & Minimap](docs/06-tracks-and-minimap.md)
- [HUD Design](docs/07-hud.md)
- [Collision Detection](docs/08-collisions.md)
- [Items & Power-ups](docs/09-items-and-powerups.md)
- [AI Drivers](docs/10-ai-drivers.md)
- [Multiplayer Notes](docs/11-multiplayer-notes.md)
- [Performance](docs/12-performance.md)

### Architecture Decision Records

- [ADR-0001: TypeScript Build](docs/adr/ADR-0001-typescript-build.md)
- [ADR-0002: Renderer Library](docs/adr/ADR-0002-renderer-lib-choice.md)
- [ADR-0003: Track Format](docs/adr/ADR-0003-track-format.md)

## Development Roadmap

| Iteration | Goal |
|-----------|------|
| 0 | Bootstrap - Title screen, quit |
| 1 | Road renders, car moves forward |
| 2 | Steering, acceleration, braking |
| 3 | Single track loop with lap counter |
| 4 | AI opponents, basic racing |
| 5 | Items, polish, multiple tracks |

## Technical Requirements

- **Runtime**: Synchronet BBS JavaScript (SpiderMonkey 1.8.5)
- **Terminal**: 80×24 ANSI-compatible
- **Build**: Node.js + TypeScript

**Note**: This game runs on Synchronet BBS only. It will NOT work in Node.js or web browsers.

## Contributing

See [copilot-instructions.md](copilot-instructions.md) for coding guidelines and constraints.

## License

MIT License - See LICENSE file

## Credits

- Inspired by SEGA's OutRun (1986) and Nintendo's Mario Kart series
- Built for the Synchronet BBS community
- CP437/ANSI art and rendering techniques
