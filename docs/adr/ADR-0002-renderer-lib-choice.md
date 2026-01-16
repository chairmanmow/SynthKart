# ADR-0002: Renderer Library Choice — frame.js First

## Status
**Accepted**

## Context

OutRun ANSI needs to render ANSI graphics efficiently on a BBS terminal. Two Synchronet libraries are commonly used for screen management:

### frame.js
Synchronet's standard frame/window library:
- Mature, widely used in BBS doors
- Double-buffered screen updates
- Only redraws changed cells
- Simple API: `gotoxy()`, `putmsg()`, `attr`
- Well-documented

### swindows
Alternative windowing library:
- More features (scrolling, overlapping windows)
- Input handling built-in
- May have different performance characteristics
- Less commonly used

## Decision

**Start with frame.js**, with an abstraction layer that allows switching to swindows later if needed.

### Why frame.js First

1. **Proven track record**: Many Synchronet doors use frame.js successfully
2. **Simpler API**: Less complexity means faster initial development
3. **Good enough performance**: Double-buffering handles most cases
4. **Documentation**: Better documented, more examples available
5. **Conservative choice**: Lower risk for initial implementation

### Abstraction Layer

We will create a `IScreenBuffer` interface that both libraries could implement:

```typescript
// src/render/Renderer.ts

interface IScreenBuffer {
  /**
   * Set a character at position with attribute.
   */
  putChar(x: number, y: number, char: string, attr: number): void;

  /**
   * Set a string at position with attribute.
   */
  putString(x: number, y: number, text: string, attr: number): void;

  /**
   * Commit buffered changes to screen.
   */
  flush(): void;

  /**
   * Clear entire buffer.
   */
  clear(): void;

  /**
   * Get buffer dimensions.
   */
  getWidth(): number;
  getHeight(): number;
}
```

### frame.js Implementation

```typescript
class FrameJsBuffer implements IScreenBuffer {
  private frame: any;  // Synchronet Frame object

  constructor(width: number, height: number) {
    // Frame constructor: (x, y, width, height, attr, parent)
    this.frame = new Frame(1, 1, width, height, BG_BLACK);
    this.frame.open();
  }

  putChar(x: number, y: number, char: string, attr: number): void {
    this.frame.gotoxy(x + 1, y + 1);  // Frame is 1-indexed
    this.frame.attr = attr;
    this.frame.putmsg(char);
  }

  putString(x: number, y: number, text: string, attr: number): void {
    this.frame.gotoxy(x + 1, y + 1);
    this.frame.attr = attr;
    this.frame.putmsg(text);
  }

  flush(): void {
    this.frame.draw();
  }

  clear(): void {
    this.frame.clear();
  }

  getWidth(): number {
    return this.frame.width;
  }

  getHeight(): number {
    return this.frame.height;
  }
}
```

### Future swindows Implementation

If we later switch to swindows:

```typescript
class SwindowsBuffer implements IScreenBuffer {
  private window: any;  // swindows Window object

  constructor(width: number, height: number) {
    // swindows initialization
    this.window = new Window(/* ... */);
  }

  // Implement same interface
  // ...
}
```

### Switching Libraries

In the renderer, we'd switch via configuration:

```typescript
function createScreenBuffer(type: 'frame' | 'swindows'): IScreenBuffer {
  switch (type) {
    case 'frame':
      load("frame.js");
      return new FrameJsBuffer(80, 24);
    case 'swindows':
      load("swindows.js");
      return new SwindowsBuffer(80, 24);
  }
}
```

## Evaluation Criteria for swindows

We would consider switching to swindows if:

1. **Performance issues**: frame.js can't keep up with required updates
2. **Feature needs**: We need scrolling regions, layered windows, etc.
3. **Input integration**: Built-in input handling proves beneficial
4. **Memory efficiency**: swindows handles large screens better

We would NOT switch for:

- Features we don't need
- Minor performance differences
- Aesthetic preference

## Current Assessment

For a racing game with full-screen pseudo-3D rendering:

| Feature | frame.js | swindows |
|---------|----------|----------|
| Full-screen buffer | ✓ | ✓ |
| Per-cell updates | ✓ | ✓ |
| Double buffering | ✓ | ✓ |
| Scrolling | ✗ | ✓ |
| Overlapping windows | Limited | ✓ |
| Simplicity | ✓ | More complex |

We don't need scrolling or overlapping windows for the racing view. frame.js is sufficient.

## Consequences

### Positive
- Faster initial development with simpler API
- Well-tested library reduces bugs
- Abstraction allows future flexibility
- Lower risk approach

### Negative
- May need to switch libraries later
- Abstraction adds slight overhead
- Learning two APIs if we switch

### Risks
- frame.js could have unexpected performance issues
- Abstraction might not cover all edge cases
- swindows might be discontinued or diverge

## Migration Path

If migration to swindows is needed:

1. Implement `SwindowsBuffer` class
2. Test in isolation with mock game state
3. Run both implementations in parallel, compare output
4. Switch configuration flag
5. Remove frame.js code after validation

## References

- [frame.js source](http://cvs.synchro.net/cgi-bin/viewcvs.cgi/exec/load/frame.js)
- [swindows documentation](http://wiki.synchro.net/module:swindows)
- [Synchronet Door Programming](http://wiki.synchro.net/howto:door:js)
