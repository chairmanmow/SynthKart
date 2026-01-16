# Multiplayer Notes

## Overview

This document outlines considerations for potential multiplayer support in OutRun ANSI. Full multiplayer implementation is a **stretch goal** for later iterations.

**Status: Design Notes Only — Not Implemented**

## Synchronet Multi-Node Architecture

Synchronet BBSes run multiple "nodes" — separate processes handling different connected users. For multiplayer, these nodes must communicate.

### Inter-Node Communication Options

#### 1. Shared Files
Nodes can read/write shared files:

```typescript
// Node A writes
const f = new File(system.data_dir + "outrun/race_001.dat");
f.open("w");
f.write(JSON.stringify(gameState));
f.close();

// Node B reads
const f = new File(system.data_dir + "outrun/race_001.dat");
f.open("r");
const gameState = JSON.parse(f.read());
f.close();
```

**Pros:** Simple, no special APIs
**Cons:** File locking issues, slow, no real-time

#### 2. Synchronet's Node Spy/Message System
Synchronet provides inter-node messaging:

```typescript
// Send to specific node
system.put_node_message(nodeNum, "OUTRUN:" + JSON.stringify(data));

// Check for messages
const msg = system.get_node_message();
if (msg && msg.startsWith("OUTRUN:")) {
  const data = JSON.parse(msg.substring(7));
}
```

**Pros:** Built-in, designed for this
**Cons:** Limited message size, polling required

#### 3. Shared Memory / External Process
Run a separate game server process that all nodes connect to.

**Pros:** Real-time, full control
**Cons:** Complex setup, requires server management

### Recommended Approach

For BBS multiplayer, use **Synchronet's node messaging** with a state synchronization protocol.

## Network Model

### Client-Server (Authoritative Host)

One node acts as "host" and runs authoritative simulation:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Node 1    │     │   Node 2    │     │   Node 3    │
│   (Host)    │     │  (Client)   │     │  (Client)   │
│             │     │             │     │             │
│ Simulation  │◄────│   Input     │     │   Input     │
│    ↓        │     │             │     │             │
│  State      │────▶│  Render     │────▶│  Render     │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Protocol:**
1. Clients send input to host
2. Host simulates all vehicles
3. Host broadcasts state to clients
4. Clients render received state

### Peer-to-Peer (Lockstep)

All nodes simulate independently, exchanging inputs:

```
┌─────────────┐     ┌─────────────┐
│   Node 1    │◄───▶│   Node 2    │
│             │     │             │
│ Simulation  │     │ Simulation  │
│    +        │     │    +        │
│ All Inputs  │     │ All Inputs  │
└─────────────┘     └─────────────┘
```

**Protocol:**
1. Each node broadcasts its input
2. All nodes wait for all inputs
3. All nodes simulate identically
4. Deterministic simulation required

### Recommended: Client-Server

For simplicity, use client-server. One player hosts.

## State Synchronization

### Minimal State Packet

Send only what changes:

```typescript
interface NetworkVehicle {
  id: number;
  x: number;
  z: number;
  rotation: number;
  speed: number;
  lap: number;
  item: number;  // Item ID or 0
  flags: number; // Bitfield: spinning, boosting, etc.
}

interface StatePacket {
  tick: number;
  vehicles: NetworkVehicle[];
  items: { id: number; x: number; z: number; type: number }[];
  events: { type: number; data: number[] }[];
}
```

### Delta Compression

Only send changes from previous state:

```typescript
interface DeltaPacket {
  baseTick: number;
  changes: {
    vehicleId: number;
    field: string;
    value: number;
  }[];
}
```

### Packet Rate

BBS terminals are slow. Target 5-10 updates per second max.

## Latency Handling

### Input Delay

Add artificial input delay to mask network latency:

```typescript
const INPUT_DELAY_TICKS = 6;  // 100ms at 60 tick/sec

// Input is applied 6 ticks after it's pressed
const delayedInputs: Map<number, DriverIntent> = new Map();

function processInput(tick: number, intent: DriverIntent): void {
  delayedInputs.set(tick + INPUT_DELAY_TICKS, intent);
}

function getInputForTick(tick: number): DriverIntent | undefined {
  return delayedInputs.get(tick);
}
```

### Client-Side Prediction

Clients predict their own vehicle movement:

```typescript
// Client
function update(dt: number): void {
  // Apply local input immediately
  predictedVehicle = simulateVehicle(myVehicle, myInput, dt);

  // When server state arrives, reconcile
  if (receivedServerState) {
    reconcile(receivedServerState);
  }
}

function reconcile(serverState: StatePacket): void {
  // Check if server position matches prediction
  const serverMe = serverState.vehicles.find(v => v.id === myId);
  const error = distance(serverMe, predictedVehicle);

  if (error > RECONCILE_THRESHOLD) {
    // Snap to server position
    myVehicle = serverMe;
    // Replay inputs since server tick
    replayInputs(serverState.tick);
  }
}
```

### Entity Interpolation

Smooth other vehicles' movement between updates:

```typescript
class InterpolatedVehicle {
  private previous: NetworkVehicle;
  private current: NetworkVehicle;
  private t: number = 0;

  setTarget(state: NetworkVehicle): void {
    this.previous = this.current;
    this.current = state;
    this.t = 0;
  }

  update(dt: number): void {
    this.t += dt * UPDATE_RATE;  // Interpolate over one update period
    this.t = Math.min(this.t, 1);
  }

  getPosition(): { x: number; z: number } {
    return {
      x: lerp(this.previous.x, this.current.x, this.t),
      z: lerp(this.previous.z, this.current.z, this.t)
    };
  }
}
```

## Race Setup Protocol

### Lobby System

```
1. Host creates race:
   - Sends RACE_CREATE to all nodes
   - Waits for JOIN requests

2. Players join:
   - Send JOIN request
   - Receive JOINED confirmation with player list

3. Ready check:
   - Each player sends READY
   - Host broadcasts READY_STATE

4. Race start:
   - When all READY, host sends COUNTDOWN
   - After countdown, host sends RACE_START
```

### Message Types

```typescript
enum MessageType {
  // Lobby
  RACE_CREATE = 1,
  JOIN = 2,
  JOINED = 3,
  LEAVE = 4,
  READY = 5,
  READY_STATE = 6,

  // Race
  COUNTDOWN = 10,
  RACE_START = 11,
  INPUT = 12,
  STATE = 13,
  EVENT = 14,
  RACE_END = 15,

  // Items
  ITEM_USE = 20,
  ITEM_HIT = 21,
}
```

## Cheating Prevention

With client-server model, host is authoritative:

- Clients only send inputs, not positions
- Host validates all actions
- Host detects impossible inputs (moving too fast, etc.)

For peer-to-peer:
- Checksum game state periodically
- Desync = someone cheated (or bug)

## Spectator Mode

Allow connected users to watch without playing:

```typescript
if (isSpectator) {
  // Receive state but don't send input
  // Camera follows leader or cycles through vehicles
}
```

## Testing Multiplayer

### Local Testing
Run multiple Synchronet nodes locally, connect with multiple terminal windows.

### Simulated Latency
Add artificial delay to test lag handling:

```typescript
function sendWithDelay(message: string, delayMs: number): void {
  // Queue message for delayed send
  delayedMessages.push({
    message,
    sendTime: system.timer * 1000 + delayMs
  });
}
```

## Implementation Phases

### Phase 1: Local Testing Framework
- Simulate multi-node on single process
- Verify protocol design

### Phase 2: Two-Player Direct
- Two nodes, client-server
- No lobby, direct IP entry

### Phase 3: Lobby System
- Host/join UI
- Up to 4 players

### Phase 4: Polish
- Spectators
- Disconnection handling
- Anti-cheat

## Limitations

- **Synchronet-only**: Won't work across different BBSes
- **Same BBS**: Players must be on same BBS
- **Node limit**: Limited by BBS node count
- **Latency**: BBS connections add significant delay

## Alternatives

If real-time multiplayer proves infeasible:

### Ghost Racing
Race against recorded times from other players:

```typescript
interface GhostData {
  playerName: string;
  trackId: string;
  inputs: { tick: number; intent: DriverIntent }[];
  totalTime: number;
}
```

### Turn-Based Racing
Not real-time, but competitive:
- Player A races, time recorded
- Player B races same track
- Compare times

### Asynchronous Leagues
- Weekly track rotates
- Players submit best times
- Leaderboard at week end

---

*This document is design notes. Implementation will require significant testing and iteration.*
