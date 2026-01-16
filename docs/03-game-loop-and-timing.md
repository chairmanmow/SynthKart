# Game Loop and Timing

## Requirements
- Stable motion regardless of terminal speed variance.
- Avoid spiral-of-death on slow nodes.

## Recommended model
- Fixed timestep simulation (e.g., 30 or 60 Hz) with accumulator.
- Render can run every tick or every N ticks depending on perf.

## What we track
- raceTime (seconds)
- lapTime (seconds)
- currentLap
- checkpointsPassed
- finishLineCrossed (edge-trigger)

## Finish line rendering
- Finish line is part of track definition: a segment + width.
- Renderer draws a distinct CP437 banner pattern across road when within range.