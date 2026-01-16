# Input and Controls

## Overview

Input handling in OutRun ANSI must work within Synchronet's terminal I/O model. This document covers keyboard input, control mapping, and the flow from raw keypress to game action.

## Synchronet Input API

### console.inkey(mode, timeout)

The primary input function. Parameters:
- `mode`: Bitmask of input flags
- `timeout`: Milliseconds to wait (0 = don't wait if K_NONE)

```typescript
// Key mode flags (from sbbsdefs.js)
const K_NONE    = 0;      // No special handling
const K_UPPER   = 1;      // Convert to uppercase
const K_NOCRLF  = 2;      // Don't echo CR/LF
const K_ALPHA   = 4;      // Only accept alphabetic
const K_NOECHO  = 32;     // Don't echo to screen
// ... more flags available

// Non-blocking read
const key = console.inkey(K_NONE, 0);

// Wait up to 100ms
const key = console.inkey(K_NONE, 100);
```

### Return Values

- Returns single character string if key pressed
- Returns empty string `''` if no key (and K_NONE mode)
- Arrow keys and special keys return escape sequences

### Special Keys

Arrow keys and function keys send ANSI escape sequences:

```typescript
const KEY_UP    = '\x1b[A';  // ESC [ A
const KEY_DOWN  = '\x1b[B';  // ESC [ B
const KEY_RIGHT = '\x1b[C';  // ESC [ C
const KEY_LEFT  = '\x1b[D';  // ESC [ D
const KEY_HOME  = '\x1b[H';
const KEY_END   = '\x1b[F';
// ... etc
```

## Input Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   console   │────▶│  InputMap   │────▶│  Controls   │
│   .inkey()  │     │ (raw→action)│     │ (state)     │
└─────────────┘     └─────────────┘     └─────────────┘
     raw key            GameAction         held state
```

### InputMap (src/input/InputMap.ts)

Maps raw keys to game actions:

```typescript
enum GameAction {
  NONE,
  ACCELERATE,
  BRAKE,
  STEER_LEFT,
  STEER_RIGHT,
  USE_ITEM,
  PAUSE,
  QUIT,
}

interface KeyBinding {
  key: string;
  action: GameAction;
}

class InputMap {
  private bindings: Map<string, GameAction> = new Map();

  constructor() {
    // Default bindings
    this.bind('w', GameAction.ACCELERATE);
    this.bind('W', GameAction.ACCELERATE);
    this.bind(KEY_UP, GameAction.ACCELERATE);

    this.bind('s', GameAction.BRAKE);
    this.bind('S', GameAction.BRAKE);
    this.bind(KEY_DOWN, GameAction.BRAKE);

    this.bind('a', GameAction.STEER_LEFT);
    this.bind('A', GameAction.STEER_LEFT);
    this.bind(KEY_LEFT, GameAction.STEER_LEFT);

    this.bind('d', GameAction.STEER_RIGHT);
    this.bind('D', GameAction.STEER_RIGHT);
    this.bind(KEY_RIGHT, GameAction.STEER_RIGHT);

    this.bind(' ', GameAction.USE_ITEM);  // Spacebar
    this.bind('p', GameAction.PAUSE);
    this.bind('P', GameAction.PAUSE);
    this.bind('q', GameAction.QUIT);
    this.bind('Q', GameAction.QUIT);
  }

  bind(key: string, action: GameAction): void {
    this.bindings.set(key, action);
  }

  getAction(key: string): GameAction {
    return this.bindings.get(key) || GameAction.NONE;
  }
}
```

### Controls (src/input/Controls.ts)

Maintains current input state (which actions are active):

```typescript
class Controls {
  private inputMap: InputMap;
  private activeActions: Set<GameAction> = new Set();
  private justPressed: Set<GameAction> = new Set();
  private justReleased: Set<GameAction> = new Set();

  constructor(inputMap: InputMap) {
    this.inputMap = inputMap;
  }

  /**
   * Process a raw key from console.inkey()
   */
  handleKey(key: string): void {
    const action = this.inputMap.getAction(key);
    if (action !== GameAction.NONE) {
      if (!this.activeActions.has(action)) {
        this.justPressed.add(action);
      }
      this.activeActions.add(action);
    }
  }

  /**
   * Check if action is currently held
   */
  isActive(action: GameAction): boolean {
    return this.activeActions.has(action);
  }

  /**
   * Check if action was just pressed this frame
   */
  wasJustPressed(action: GameAction): boolean {
    return this.justPressed.has(action);
  }

  /**
   * Clear per-frame state (call at end of frame)
   */
  endFrame(): void {
    this.justPressed.clear();
    this.justReleased.clear();
  }

  /**
   * Clear held state for action (call when key release detected)
   * Note: Terminal input doesn't have key-up events, so we use timeout
   */
  releaseAction(action: GameAction): void {
    if (this.activeActions.has(action)) {
      this.activeActions.delete(action);
      this.justReleased.add(action);
    }
  }

  /**
   * Clear all active actions (useful for release-on-timeout)
   */
  clearAll(): void {
    for (const action of this.activeActions) {
      this.justReleased.add(action);
    }
    this.activeActions.clear();
  }
}
```

## The Key-Up Problem

Terminals don't send key-up events. When a user releases a key, we get nothing. This is a fundamental limitation.

### Solutions

#### 1. Immediate Response (Simple)
Treat each keypress as a single impulse:

```typescript
// In HumanDriver
if (controls.wasJustPressed(GameAction.STEER_LEFT)) {
  this.steerImpulse = -1;  // Apply once
}
```

Best for: Discrete actions like USE_ITEM, PAUSE

#### 2. Decay Over Time
Actions decay if not reinforced:

```typescript
class HeldActionState {
  private holdTime: Map<GameAction, number> = new Map();
  private readonly DECAY_RATE = 0.1;  // seconds

  reinforce(action: GameAction, dt: number): void {
    this.holdTime.set(action, 0.1);  // Reset hold timer
  }

  update(dt: number): void {
    for (const [action, time] of this.holdTime) {
      const newTime = time - dt;
      if (newTime <= 0) {
        this.holdTime.delete(action);
      } else {
        this.holdTime.set(action, newTime);
      }
    }
  }

  isHeld(action: GameAction): boolean {
    return this.holdTime.has(action);
  }
}
```

Best for: Steering, acceleration (continuous actions)

#### 3. Toggle Mode
Some actions toggle on/off:

```typescript
// Accelerator can be toggle mode for accessibility
if (controls.wasJustPressed(GameAction.ACCELERATE)) {
  this.autoAccelerate = !this.autoAccelerate;
}
```

Best for: Accessibility options

### Recommended Approach for Racing

Use **rapid-fire detection** for continuous controls:

```typescript
class Controls {
  private lastKeyTime: Map<GameAction, number> = new Map();
  private readonly HOLD_THRESHOLD = 150;  // ms

  handleKey(key: string, now: number): void {
    const action = this.inputMap.getAction(key);
    if (action !== GameAction.NONE) {
      this.lastKeyTime.set(action, now);
      this.activeActions.add(action);
    }
  }

  update(now: number): void {
    // Release actions that haven't been reinforced recently
    for (const [action, time] of this.lastKeyTime) {
      if (now - time > this.HOLD_THRESHOLD) {
        this.activeActions.delete(action);
        this.lastKeyTime.delete(action);
      }
    }
  }
}
```

When a user holds a key, the terminal sends repeated keypresses (key repeat). We detect this and keep the action active. When they release, keypresses stop, and the action times out.

## Input Flow in Game Loop

```typescript
class Game {
  private controls: Controls;
  private clock: Clock;

  processInput(): void {
    const now = this.clock.now();

    // Read all available keys (might be multiple if laggy)
    let key: string;
    while ((key = console.inkey(K_NONE, 0)) !== '') {
      this.controls.handleKey(key, now);

      // Handle immediate actions
      if (this.controls.wasJustPressed(GameAction.QUIT)) {
        this.running = false;
        return;
      }
      if (this.controls.wasJustPressed(GameAction.PAUSE)) {
        this.togglePause();
        return;
      }
    }

    // Update held state (release stale actions)
    this.controls.update(now);
  }
}
```

## Control Schemes

### Scheme 1: WASD + Arrows (Default)
```
W / ↑     = Accelerate
S / ↓     = Brake
A / ←     = Steer Left
D / →     = Steer Right
Space     = Use Item
P         = Pause
Q         = Quit
```

### Scheme 2: Numpad
```
8         = Accelerate
2         = Brake
4         = Steer Left
6         = Steer Right
5 / 0     = Use Item
```

### Scheme 3: VI-style
```
K         = Accelerate
J         = Brake
H         = Steer Left
L         = Steer Right
Space     = Use Item
```

## Menu Input

Menus use simpler input—just wait for a key:

```typescript
function menuInput(): string {
  // Block until key pressed
  return console.inkey(K_UPPER);  // Uppercase, wait forever
}

function showMenu(options: string[]): number {
  // Display menu...

  while (true) {
    const key = menuInput();

    // Number selection
    const num = parseInt(key, 10);
    if (num >= 1 && num <= options.length) {
      return num - 1;
    }

    // Arrow navigation
    if (key === KEY_UP) {
      // Move selection up
    } else if (key === KEY_DOWN) {
      // Move selection down
    } else if (key === '\r' || key === '\n') {
      // Confirm selection
      return currentSelection;
    }
  }
}
```

## Escape Sequence Parsing

Arrow keys send multi-character sequences. Must buffer and parse:

```typescript
class InputBuffer {
  private buffer: string = '';
  private readonly ESCAPE_TIMEOUT = 50;  // ms
  private escapeStart: number = 0;

  addChar(char: string, now: number): string | null {
    // If we have a partial escape sequence that timed out, flush it
    if (this.buffer.length > 0 && now - this.escapeStart > this.ESCAPE_TIMEOUT) {
      const flushed = this.buffer;
      this.buffer = '';
      return flushed;
    }

    this.buffer += char;

    // Check for complete escape sequence
    if (this.buffer === '\x1b') {
      // Start of escape sequence
      this.escapeStart = now;
      return null;  // Wait for more
    }

    if (this.buffer.startsWith('\x1b[')) {
      // CSI sequence - check if complete
      if (this.buffer.length >= 3) {
        const seq = this.buffer;
        this.buffer = '';
        return seq;
      }
      return null;  // Wait for more
    }

    // Not an escape sequence, return as-is
    const result = this.buffer;
    this.buffer = '';
    return result;
  }
}
```

## Testing Input

Since Synchronet lacks unit tests, test input manually:

```typescript
// Debug mode input display
function debugInput(): void {
  console.print("Press keys to see codes (Q to quit):\r\n");

  while (true) {
    const key = console.inkey(K_NONE, 100);
    if (key !== '') {
      // Display character codes
      let codes = '';
      for (let i = 0; i < key.length; i++) {
        codes += key.charCodeAt(i).toString(16) + ' ';
      }
      console.print("Key: [" + key + "] Codes: " + codes + "\r\n");

      if (key.toUpperCase() === 'Q') break;
    }
  }
}
```

## Summary

| Concern | Solution |
|---------|----------|
| Non-blocking input | `console.inkey(K_NONE, 0)` |
| Key mapping | InputMap class |
| Held state | Timeout-based decay |
| Special keys | Escape sequence parsing |
| Menu input | Blocking `console.inkey()` |
