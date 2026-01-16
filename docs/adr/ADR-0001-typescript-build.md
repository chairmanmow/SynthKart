# ADR-0001: TypeScript Build with outFile

## Status
**Accepted**

## Context

OutRun ANSI targets Synchronet BBS's JavaScript runtime, which is based on SpiderMonkey 1.8.5. This runtime:

- Has no module system (no `require`, no `import/export`)
- Cannot load external module bundlers or loaders
- Executes a single script file directly
- Uses `load()` for Synchronet's built-in libraries only

We want to author in TypeScript for:
- Type safety during development
- Better IDE support and refactoring
- Interfaces to document API contracts
- Catching errors at compile time

## Decision

We will use **TypeScript with `outFile` compilation** to produce a single JavaScript file.

### tsconfig.json Configuration

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "AMD",
    "outFile": "./dist/outrun.js",
    "strict": true,
    "lib": ["ES5", "ES2015.Core", "ES2015.Collection"]
  }
}
```

Key settings:

| Setting | Value | Rationale |
|---------|-------|-----------|
| `target` | ES5 | SpiderMonkey 1.8.5 compatibility |
| `module` | AMD | Required for `outFile` to work |
| `outFile` | dist/outrun.js | Single output file |
| `lib` | ES5 + limited ES2015 | No DOM types, conservative JS features |
| `strict` | true | Maximum type safety |

### Why AMD Module?

TypeScript's `outFile` only works with `AMD` or `System` module formats. We choose AMD because:

1. The AMD wrapper code is minimal
2. It compiles to a single file with no external dependencies
3. The AMD `define()` calls are inert in a non-AMD environment

The output looks like:
```javascript
var __moduleName = ...;
define("game/Game", ["require", "exports"], function(require, exports) {
    // ... class code ...
});
// ... more modules ...
```

Since there's no AMD loader, these `define()` calls just... sit there. The code inside them executes during the define call (it's not deferred). This happens to work because:
- Variables become properties on `exports` object
- Later modules can reference earlier ones via their `define` order
- TypeScript orders the output by dependency

### Why Not...

**CommonJS (`module: "commonjs"`)?**
- Emits `require()` calls which don't exist in Synchronet
- Can't use `outFile` with CommonJS

**ES Modules (`module: "es2015"`)?**
- Emits `import`/`export` statements
- SpiderMonkey 1.8.5 doesn't support ES modules
- Can't use `outFile` with ES modules

**No modules, just scripts?**
- Loses ability to organize code across files
- Would need manual concatenation
- Loses TypeScript's module resolution

**Webpack/Rollup/esbuild?**
- Adds Node.js build dependency
- Bundler output often assumes module environment
- `tsc` alone is simpler and sufficient

### Post-Compilation

The generated `dist/outrun.js` contains AMD boilerplate that is effectively no-ops. If needed, we could post-process to strip it, but testing shows it works as-is.

### Target: ES5

SpiderMonkey 1.8.5 supports most ES5 features:
- `var`, function declarations
- `Object.keys`, `Array.forEach`, `Array.map`, etc.
- `JSON.parse`, `JSON.stringify`
- `"use strict"`

It does NOT support:
- `let`, `const` (ES6)
- Arrow functions (ES6)
- Classes (ES6) — TypeScript compiles to ES5 prototypes
- Promises (ES6)
- Template literals (ES6)

TypeScript compiles modern syntax to ES5 equivalents.

### Library Types

We exclude DOM types (`lib: ["DOM"]`) because there's no DOM in Synchronet. We include:
- `ES5` — Core JavaScript
- `ES2015.Core` — Array.find, etc.
- `ES2015.Collection` — Map, Set (may or may not exist in runtime)

If runtime lacks Map/Set, we'll provide polyfills.

## Consequences

### Positive
- Single `tsc` command produces deployable output
- No Node.js runtime dependency for the game itself
- Full TypeScript type checking
- IDE support (VS Code, etc.)
- Code can be organized across multiple files

### Negative
- AMD wrapper code adds ~2KB overhead
- Must verify output works in actual Synchronet environment
- Some ES6+ features require manual polyfills
- Compilation order matters (dependency graph)

### Risks
- If Synchronet's JS engine behaves unexpectedly with AMD wrappers, we may need to post-process
- Memory constraints could be an issue with large single file

## Verification

After building, verify:

```bash
# Check no import/export statements in output
grep -E "^import |^export " dist/outrun.js
# Should return nothing

# Check file can be parsed
node --check dist/outrun.js
# Should succeed (even though it won't run in Node)
```

Then test in actual Synchronet environment.

## References

- [TypeScript outFile documentation](https://www.typescriptlang.org/tsconfig#outFile)
- [Synchronet JavaScript reference](http://wiki.synchro.net/module:js)
- [SpiderMonkey 1.8.5 features](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Releases/1.8.5)
