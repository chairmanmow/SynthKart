# Rendering: CP437 Synthwave

## Visual language
- Skyline/mountains: magenta CP437 box-drawing grid (thin lines; layered parallax)
- Road: cyan CP437 grid converging to horizon
- Sun: large circle/half-block motif, appears based on camera yaw (facing)
- Trees (optional): brown trunk + green leaves, sparse to avoid noise

## Layers (back → front)
1. Sky gradient substitute (flat color banding only)
2. Sun (conditional)
3. Mountains/skyline grid (parallax)
4. Road grid (perspective)
5. Sprites (player vehicle; later opponents/items)
6. HUD overlay

## Performance principles
- Minimize cursor moves and attribute toggles.
- Prefer row-string assembly then write once per row when feasible.
- Keep a "dirty region" tracker so HUD updates don’t force full-screen redraw.
- If frame.js is used, treat frames as composition surfaces.
- If swindows is used, treat windows as pre-sized buffers with fast blits.

## CP437 glyph plan (examples)
- Grid lines: box drawing (single-line and corners)
- Sun: full block / half blocks / shaded blocks (if needed)
- Vehicle sprite: tiny 3–7 char wide cluster, palette-limited, consistent silhouette

## Facing direction → sun visibility
- Define a world "sun azimuth" constant.
- Compute relative angle between camera forward and sun azimuth.
- If |angle| < threshold: draw sun centered; else off-screen or hidden.