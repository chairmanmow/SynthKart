# ADR-0003: Track JSON Format

## Status
**Accepted**

## Context

OutRun ANSI needs a data format for defining race tracks. Requirements:

1. **Human-readable**: Sysops may want to edit/create tracks
2. **Machine-parseable**: Game must load efficiently
3. **Extensible**: Future features shouldn't break existing tracks
4. **Compact**: Reasonable file sizes
5. **Self-contained**: All track data in one file

## Decision

Use **JSON** with a defined schema for track files.

### Why JSON

| Format | Pros | Cons |
|--------|------|------|
| JSON | Human-readable, native parsing, universal | Verbose, no comments |
| YAML | Readable, comments | Needs parser library |
| Binary | Compact, fast | Not human-editable |
| INI | Simple | Too limited |
| Custom text | Full control | Maintenance burden |

JSON wins because:
- Synchronet's JS runtime has native `JSON.parse()`
- No external dependencies
- Good enough readability
- Widely understood format

### Track Schema

```typescript
interface TrackFile {
  // Metadata
  meta: {
    name: string;           // Display name
    author: string;         // Creator credit
    version: number;        // Schema version (currently 1)
    difficulty: 1 | 2 | 3;  // Easy, Medium, Hard
  };

  // Track geometry
  geometry: {
    // Centerline as array of [x, y] points
    // Forms a closed loop (last point connects to first)
    centerline: [number, number][];

    // Road width in world units
    width: number;

    // Total track length (calculated from centerline, but cached here)
    length: number;
  };

  // Race structure
  race: {
    // Starting grid positions (offsets from start line)
    spawnPoints: {
      x: number;    // Lateral offset from centerline
      z: number;    // Distance behind start line
    }[];

    // Checkpoint positions (z values along track)
    // Must cross all checkpoints in order to complete lap
    checkpoints: number[];

    // Lap count for standard race
    laps: number;
  };

  // Item spawn locations
  items: {
    // Item box positions
    boxes: {
      x: number;
      z: number;
      respawnTime: number;  // Seconds until respawn after pickup
    }[];
  };

  // Visual theming
  scenery: {
    // Sky appearance
    sky: {
      type: 'sunset' | 'night' | 'day';
      sunAzimuth: number;    // Degrees, 0 = behind player
      horizonColors: string[]; // Gradient colors (top to bottom)
    };

    // Roadside decoration density
    props: {
      palmTrees: number;   // 0-1 density
      buildings: number;
      billboards: number;
    };

    // Road surface
    road: {
      color: string;       // Base road color
      stripeColor: string; // Center/edge stripe color
      stripeWidth: number;
    };

    // Background elements
    skyline: {
      style: 'city' | 'mountains' | 'ocean' | 'desert';
      density: number;     // 0-1
    };
  };
}
```

### Example: neon_coast_01.json

```json
{
  "meta": {
    "name": "Neon Coast",
    "author": "OutRun Team",
    "version": 1,
    "difficulty": 1
  },
  "geometry": {
    "centerline": [
      [0, 0],
      [100, 0],
      [200, 50],
      [250, 150],
      [200, 250],
      [100, 300],
      [0, 300],
      [-100, 250],
      [-150, 150],
      [-100, 50]
    ],
    "width": 40,
    "length": 1200
  },
  "race": {
    "spawnPoints": [
      { "x": -5, "z": -10 },
      { "x": 5, "z": -10 },
      { "x": -5, "z": -25 },
      { "x": 5, "z": -25 },
      { "x": -5, "z": -40 },
      { "x": 5, "z": -40 },
      { "x": -5, "z": -55 },
      { "x": 5, "z": -55 }
    ],
    "checkpoints": [0, 300, 600, 900],
    "laps": 3
  },
  "items": {
    "boxes": [
      { "x": 0, "z": 150, "respawnTime": 10 },
      { "x": 0, "z": 450, "respawnTime": 10 },
      { "x": -10, "z": 750, "respawnTime": 10 },
      { "x": 10, "z": 750, "respawnTime": 10 },
      { "x": 0, "z": 1050, "respawnTime": 10 }
    ]
  },
  "scenery": {
    "sky": {
      "type": "sunset",
      "sunAzimuth": 270,
      "horizonColors": ["#ff00ff", "#ff6600", "#ffff00"]
    },
    "props": {
      "palmTrees": 0.7,
      "buildings": 0.3,
      "billboards": 0.2
    },
    "road": {
      "color": "#333333",
      "stripeColor": "#ffffff",
      "stripeWidth": 2
    },
    "skyline": {
      "style": "city",
      "density": 0.6
    }
  }
}
```

### Centerline Representation

The centerline is a polyline of 2D points forming the track shape. The track is implicitly closed (connects back to start).

Why polyline, not Bezier curves?
- Simpler to parse and process
- Good enough for BBS resolution
- Can approximate curves with enough points
- Easier to calculate distance along track

For smooth curves, use more points:
```json
"centerline": [
  [0, 0], [10, 2], [20, 5], [30, 10], [40, 18], [50, 30], ...
]
```

### Coordinate System

- **X**: Lateral (left/right), positive = right
- **Z**: Along track (forward), positive = forward
- **Y**: Vertical (not used for track shape, implicit flat)

Track coordinates are in arbitrary "world units". The renderer scales to screen.

### Validation

The TrackLoader validates:

```typescript
function validateTrack(data: any): TrackFile | Error {
  // Check required fields
  if (!data.meta?.name) return new Error("Missing meta.name");
  if (!data.geometry?.centerline) return new Error("Missing geometry.centerline");
  if (data.geometry.centerline.length < 4) return new Error("Centerline too short");
  if (!data.geometry.width) return new Error("Missing geometry.width");

  // Check race structure
  if (!data.race?.spawnPoints?.length) return new Error("Missing spawn points");
  if (!data.race?.checkpoints?.length) return new Error("Missing checkpoints");

  // Validate checkpoint order
  for (let i = 1; i < data.race.checkpoints.length; i++) {
    if (data.race.checkpoints[i] <= data.race.checkpoints[i-1]) {
      return new Error("Checkpoints must be in ascending order");
    }
  }

  // ... more validation ...

  return data as TrackFile;
}
```

### Versioning

The `meta.version` field allows schema evolution:

```typescript
function loadTrack(data: any): TrackFile {
  switch (data.meta?.version) {
    case 1:
      return loadV1(data);
    case 2:
      return loadV2(data);  // Future
    default:
      if (!data.meta?.version) {
        // Assume version 1 for legacy
        return loadV1(data);
      }
      throw new Error(`Unknown track version: ${data.meta.version}`);
  }
}
```

## Consequences

### Positive
- Native JSON parsing, no dependencies
- Human-readable and editable
- Easy to extend with new fields
- Can validate at load time
- Tracks are portable (just copy JSON file)

### Negative
- No comments in JSON (use external documentation)
- Verbose compared to binary
- No built-in schema validation (must implement)
- Color strings need parsing

### Risks
- Large tracks with many centerline points could be slow to parse
- Schema evolution needs careful management
- Typos in JSON fail at runtime, not compile time

## Alternatives Considered

### Embedded in JavaScript
```javascript
const TRACKS = {
  neon_coast: { centerline: [...], ... }
};
```
Rejected: Mixes code and data, harder to edit.

### Binary Format
Rejected: Not human-editable, overkill for our data sizes.

### Multiple Files
Track definition + scenery + items in separate files.
Rejected: Complicates deployment, all data is related.

## File Location

Tracks stored in: `data/tracks/<track_id>.json`

Track manifest (optional): `data/tracks/manifest.json`
```json
{
  "tracks": ["neon_coast_01", "cyber_highway_01", "sunset_strip_01"]
}
```

Or, auto-discover by listing directory.

## References

- [JSON Schema specification](https://json-schema.org/) (for future formal schema)
- [Racing game track formats](https://www.gamedeveloper.com/design/the-anatomy-of-a-racing-game-track) (design patterns)
