# Copilot Instructions — OutRun ANSI

> **This document is the constitution for AI coding agents working on this project.**
> Violating these rules produces broken, undeployable code.

---

## 1. RUNTIME ENVIRONMENT

**Target runtime: Synchronet JavaScript (SpiderMonkey 1.8.5 derivative)**

- This is NOT Node.js. This is NOT browser JavaScript.
- No `require()`. No `import`/`export` at runtime.
- No CommonJS. No ESM. No module loaders.
- The final `dist/outrun.js` must be a single flat script with NO module syntax.

**Available globals come from Synchronet:**
- `console` — Synchronet's console object (NOT browser console)
- `js` — JavaScript context control
- `system` — BBS system information
- `user` — Current user object
- `bbs` — BBS control object
- `file_area`, `msg_area` — Area configurations
- Standard Synchronet exec/*.js libraries via `load()`

**Loading libraries:**
```javascript
load("sbbsdefs.js");
load("frame.js");
load("tree.js");
// etc.
```

---

## 2. FORBIDDEN PATTERNS

### 2.1 Do NOT Invent APIs That Duplicate Synchronet

❌ **FORBIDDEN:**
```typescript
class TerminalWrapper {
  print(s: string) { /* custom implementation */ }
  clear() { /* reinvent wheel */ }
}
```

✅ **CORRECT:**
```typescript
// Use Synchronet's console directly
declare const console: SynchronetConsole;
console.clear();
console.print(str);
```

### 2.2 Do NOT Use Node.js / Browser APIs

❌ **FORBIDDEN:**
- `process`, `Buffer`, `fs`, `path`
- `window`, `document`, `fetch`, `XMLHttpRequest`
- `setTimeout`, `setInterval` (use Synchronet timing)
- `Promise`, `async/await` (SpiderMonkey 1.8.5 lacks native Promises)

### 2.3 Do NOT Create Module Syntax in Output

❌ **FORBIDDEN in dist/outrun.js:**
```javascript
import { Game } from './game';
export class Foo {}
module.exports = ...
```

The `outFile` compilation flattens everything. Verify after build.

### 2.4 Do NOT Over-Abstract

❌ **FORBIDDEN:**
- "Engine" classes that wrap Synchronet in another layer
- "Platform abstraction" that might run elsewhere
- Dependency injection frameworks
- Event bus systems beyond simple callbacks

✅ **CORRECT:**
- Direct calls to Synchronet APIs
- Simple class hierarchies
- Explicit dependencies passed to constructors

---

## 3. SUBSYSTEM BOUNDARIES

```
┌─────────────────────────────────────────────────────────────────┐
│                         main.ts                                 │
│                    (entry point only)                           │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                        Game.ts                                  │
│         (orchestrates subsystems, owns game loop)               │
└───┬─────────┬─────────┬─────────┬─────────┬─────────┬───────────┘
    │         │         │         │         │         │
┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│Input  │ │World  │ │Entities│ │Physics│ │Items  │ │Render │
│System │ │System │ │System  │ │System │ │System │ │System │
└───────┘ └───────┘ └────────┘ └───────┘ └───────┘ └───────┘
```

### 3.1 Input (src/input/)
- Reads keyboard via Synchronet console.inkey()
- Maps raw keys to game actions
- No rendering, no game logic

### 3.2 World (src/world/)
- Track definition, checkpoints, spawn points
- Track loading from JSON
- No rendering, no physics

### 3.3 Entities (src/entities/)
- Vehicle, Driver (Human/CPU) definitions
- Position, velocity, state
- No rendering (that's Render's job)

### 3.4 Physics (src/physics/)
- Kinematics, steering model, collision detection
- Operates on entity state
- No rendering, no input handling

### 3.5 Items (src/items/)
- Item definitions, item spawning, item effects
- Operates on entity state
- No rendering

### 3.6 HUD (src/hud/)
- HUD data computation (lap times, positions, speedometer values)
- Minimap coordinate transforms
- Delegates actual drawing to Render

### 3.7 Render (src/render/)
- ALL drawing goes here
- Uses frame.js (or swindows in future)
- CP437 glyph selection, ANSI color application
- Road perspective, sprites, HUD drawing

### 3.8 Timing (src/timing/)
- Clock abstraction over Synchronet's time functions
- Fixed timestep logic
- No rendering, no game logic

### 3.9 Util (src/util/)
- Pure functions: math, random, logging
- No state, no side effects beyond logging

### 3.10 Synchro (src/synchro/)
- TypeScript declarations for Synchronet APIs
- Compatibility shims if absolutely necessary
- NO wrappers—just types

---

## 4. ITERATION ROADMAP

### Iteration 0 (Current Bootstrap)
- [x] Repo structure
- [x] Build pipeline (tsc → single outFile)
- [x] Minimal runnable main: title, tick loop, Q to quit
- [x] Documentation skeleton

### Iteration 1: Drive One Car
- [ ] Load track from JSON (real file I/O)
- [ ] Render pseudo-3D road with horizon
- [ ] Player vehicle with steering/acceleration
- [ ] Basic HUD: speedometer, lap timer
- [ ] Single lap completion detection

### Iteration 2: AI Drivers
- [ ] CPU driver AI (follow centerline, avoid obstacles)
- [ ] Multiple vehicles on track
- [ ] Position tracking (1st, 2nd, etc.)
- [ ] Rubber-banding difficulty

### Iteration 3: Items & Power-ups
- [ ] Item boxes on track
- [ ] Mushroom (speed boost)
- [ ] Shell (projectile)
- [ ] Item HUD slot
- [ ] Hit detection and effects

### Iteration 4: Multiplayer Notes
- [ ] Document how inter-node communication would work
- [ ] Stub multiplayer interfaces
- [ ] (Full implementation is stretch goal)

### Iteration 5: Polish
- [ ] Multiple tracks
- [ ] Track selection menu
- [ ] High score persistence
- [ ] Sound effects (if Synchronet supports)
- [ ] Title screen animation

---

## 5. PERFORMANCE RULES

### 5.1 Minimize Console Writes
```typescript
// ❌ BAD: Write each cell individually
for (let y = 0; y < 24; y++) {
  for (let x = 0; x < 80; x++) {
    console.gotoxy(x, y);
    console.print(buffer[y][x]);
  }
}

// ✅ GOOD: Use frame.js which batches updates
frame.draw();  // Only writes changed cells
```

### 5.2 Use Dirty Rectangles
- Track which screen regions changed
- Only redraw dirty regions
- frame.js handles this; don't bypass it

### 5.3 Reuse Buffers
```typescript
// ❌ BAD: Allocate every frame
function render() {
  const buffer = new Array(24).fill(null).map(() => new Array(80));
  // ...
}

// ✅ GOOD: Reuse allocated buffer
class Renderer {
  private buffer: string[][] = /* allocated once */;
  render() {
    // Clear and reuse this.buffer
  }
}
```

### 5.4 Avoid String Concatenation in Hot Paths
```typescript
// ❌ BAD: Creates garbage every frame
const line = char1 + char2 + char3 + ...;

// ✅ GOOD: Use array join or pre-allocated buffer
lineBuffer[0] = char1;
lineBuffer[1] = char2;
const line = lineBuffer.join('');
```

### 5.5 Profile Before Optimizing
- Measure actual frame times
- Identify real bottlenecks
- Don't optimize speculatively

---

## 6. RENDERING RULES

### 6.1 Prefer frame.js
- Use `load("frame.js")` for screen management
- Frame objects handle double-buffering
- Only changed cells are written to console

### 6.2 swindows Migration Path
- swindows is an alternative with more features
- When evaluating: check if we need scrolling regions, layered windows
- Migration should be isolated to src/render/
- Document decision in ADR-0002

### 6.3 CP437 Character Usage
- Box drawing: ─│┌┐└┘├┤┬┴┼ (single) ═║╔╗╚╝╠╣╦╩╬ (double)
- Blocks: ░▒▓█▀▄▌▐
- Road perspective uses block shading
- Sprites use careful glyph selection for silhouettes

### 6.4 ANSI Color Palette
- 16 foreground colors (0-15)
- 8 background colors (0-7)
- Synthwave palette: magenta, cyan, yellow on dark backgrounds
- Define color constants in Palette.ts

---

## 7. FILE I/O RULES

### 7.1 Use Synchronet File Object
```typescript
// Reading JSON
const f = new File(js.exec_dir + "data/tracks/neon_coast_01.json");
if (f.open("r")) {
  const content = f.read();
  f.close();
  const data = JSON.parse(content);
}
```

### 7.2 Paths Are Relative to js.exec_dir
- `js.exec_dir` is the directory containing the running script
- Always construct paths from this base
- Never assume current working directory

### 7.3 Handle Missing Files Gracefully
```typescript
if (!f.open("r")) {
  log("ERROR: Could not open track file");
  // Provide fallback or exit cleanly
}
```

---

## 8. ERROR HANDLING

### 8.1 Never Crash Without Cleanup
```typescript
try {
  game.run();
} finally {
  cleanup();  // Restore terminal state
}
```

### 8.2 Use Logging, Not Alerts
```typescript
// ❌ BAD
alert("Error!");

// ✅ GOOD
log(LOG_ERR, "Error description");
console.print("An error occurred. Press any key.");
```

### 8.3 Validate External Data
- Track JSON must be validated against schema
- User input must be bounds-checked
- Never trust data from files

---

## 9. CODE STYLE

### 9.1 TypeScript Strict Mode
- `strict: true` in tsconfig.json
- No implicit any
- Null checks required

### 9.2 Naming Conventions
- Classes: PascalCase
- Functions/methods: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: PascalCase for classes, camelCase for utilities

### 9.3 Comments
- Document WHY, not WHAT
- JSDoc for public APIs
- Keep comments updated with code

---

## 10. TESTING APPROACH

Since Synchronet lacks a test framework:

### 10.1 Manual Testing Protocol
1. Build: `npm run build`
2. Copy `dist/outrun.js` to Synchronet xtrn directory
3. Configure in SCFG
4. Run from BBS and verify behavior

### 10.2 Logging for Debug
- Use `log()` function with appropriate log levels
- Can review in Synchronet logs
- Remove verbose logging before release

### 10.3 Stub Testing
- Pure functions in util/ can be tested in Node.js
- Create separate test.js that imports just those functions
- NOT for Synchronet-dependent code

---

## 11. GIT WORKFLOW

### 11.1 Commit Messages
- Prefix with subsystem: `[render] Add road perspective`
- Keep first line under 72 chars
- Reference iteration: `[physics] Iteration 1: basic steering`

### 11.2 Branches
- `main` — stable, deployable
- `iter-N` — work for iteration N
- `fix/*` — bug fixes
- `feat/*` — new features

### 11.3 Never Commit
- `node_modules/`
- `dist/outrun.js` (generated)
- `.DS_Store`, `Thumbs.db`
- Editor temp files

---

## 12. CHECKLIST BEFORE EACH COMMIT

- [ ] `npm run build` succeeds
- [ ] `dist/outrun.js` contains NO import/export
- [ ] No Node.js or browser APIs used
- [ ] No new "wrapper" classes around Synchronet
- [ ] Documentation updated if behavior changed
- [ ] Subsystem boundaries respected

---

*Last updated: Iteration 0 Bootstrap*
