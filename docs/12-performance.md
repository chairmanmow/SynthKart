# Performance Notes

## Principles
- Assume remote terminals vary wildly; avoid full redraws when possible.
- Batch output. Avoid per-character writes.
- Keep buffers reusable (no per-frame allocation).

## Library choice
- Start with frame.js for familiarity and availability.
- If profiling shows frame.js overhead dominates, evaluate swindows (reported faster).
- Whichever is chosen, hide it behind `render/Renderer.ts` so the rest of the game doesn’t care.