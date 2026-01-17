/**
 * Game - Main game orchestrator.
 *
 * Coordinates all subsystems: input, physics, rendering, etc.
 */

interface GameConfig {
  screenWidth: number;
  screenHeight: number;
  tickRate: number;
  maxTicksPerFrame: number;
}

var DEFAULT_CONFIG: GameConfig = {
  screenWidth: 80,
  screenHeight: 24,
  tickRate: 60,
  maxTicksPerFrame: 5
};

class Game {
  private config: GameConfig;
  private running: boolean;
  private paused: boolean;

  // Subsystems
  private clock: Clock;
  private timestep: FixedTimestep;
  private inputMap: InputMap;
  private controls: Controls;
  private renderer: IRenderer;
  private trackLoader: TrackLoader;
  private hud: Hud;
  private physicsSystem: PhysicsSystem;
  private raceSystem: RaceSystem;
  private itemSystem: ItemSystem;

  // State
  private state: GameState | null;

  constructor(config?: GameConfig) {
    this.config = config || DEFAULT_CONFIG;
    this.running = false;
    this.paused = false;

    // Initialize subsystems
    this.clock = new Clock();
    this.timestep = new FixedTimestep({
      tickRate: this.config.tickRate,
      maxTicksPerFrame: this.config.maxTicksPerFrame
    });
    this.inputMap = new InputMap();
    this.controls = new Controls(this.inputMap);
    // Use FrameRenderer for layered Frame.js rendering
    this.renderer = new FrameRenderer(this.config.screenWidth, this.config.screenHeight);
    this.trackLoader = new TrackLoader();
    this.hud = new Hud();
    this.physicsSystem = new PhysicsSystem();
    this.raceSystem = new RaceSystem();
    this.itemSystem = new ItemSystem();

    this.state = null;
  }

  /**
   * Initialize the game with a track definition.
   */
  initWithTrack(trackDef: TrackDefinition): void {
    logInfo("Game.initWithTrack(): " + trackDef.name);

    // Initialize renderer
    this.renderer.init();
    
    // Set theme based on track's themeId
    var themeMapping: { [key: string]: string } = {
      'synthwave': 'synthwave',
      'midnight_city': 'city_night',
      'beach_paradise': 'sunset_beach',
      'forest_night': 'twilight_forest',
      'haunted_hollow': 'haunted_hollow',
      'winter_wonderland': 'winter_wonderland',
      'cactus_canyon': 'cactus_canyon'
    };
    var themeName = themeMapping[trackDef.themeId] || 'synthwave';
    if (this.renderer.setTheme) {
      this.renderer.setTheme(themeName);
    }

    // Build the road from the track definition
    var road = buildRoadFromDefinition(trackDef);

    // Load legacy track structure (for checkpoints/items - will be removed later)
    var track = this.trackLoader.load("neon_coast_01");
    track.laps = trackDef.laps;  // Override with definition's lap count
    track.name = trackDef.name;

    // Create player vehicle
    var playerVehicle = new Vehicle();
    playerVehicle.driver = new HumanDriver(this.controls);
    playerVehicle.color = YELLOW;
    playerVehicle.trackZ = 0;  // Start at beginning
    playerVehicle.playerX = 0; // Centered on road

    // Create game state with road
    this.state = createInitialState(track, road, playerVehicle);

    // Spawn NPC commuters (traffic)
    var npcCount = trackDef.npcCount !== undefined ? trackDef.npcCount : 5;
    this.spawnNPCs(npcCount, road);

    // Initialize systems
    this.physicsSystem.init(this.state);
    this.raceSystem.init(this.state);
    this.itemSystem.initFromTrack(track);

    // Initialize HUD
    this.hud.init(0);

    this.running = true;
    this.state.racing = true;

    debugLog.info("Game initialized with track: " + trackDef.name);
    debugLog.info("  Road segments: " + road.segments.length);
    debugLog.info("  Road length: " + road.totalLength);
    debugLog.info("  Laps: " + road.laps);
  }

  /**
   * Initialize the game (legacy - uses default track).
   */
  init(): void {
    logInfo("Game.init()");
    // Use the default test track for backwards compatibility
    var defaultTrack = getTrackDefinition('test_oval');
    if (defaultTrack) {
      this.initWithTrack(defaultTrack);
    } else {
      // Fallback to hardcoded if catalog fails
      this.initWithTrack({
        id: 'fallback',
        name: 'Fallback Track',
        description: 'Default fallback',
        difficulty: 1,
        laps: 2,
        themeId: 'synthwave',
        estimatedLapTime: 30,
        sections: [
          { type: 'straight', length: 15 },
          { type: 'curve', length: 15, curve: 0.5 },
          { type: 'straight', length: 15 },
          { type: 'curve', length: 15, curve: 0.5 }
        ]
      });
    }
  }

  /**
   * Main game loop.
   */
  run(): void {
    debugLog.info("Entering game loop");

    this.clock.reset();
    var frameCount = 0;
    var lastLogTime = 0;

    while (this.running) {
      // 1. Measure elapsed real time
      var deltaMs = this.clock.getDelta();
      frameCount++;

      // 2. Process input
      this.processInput();

      // 3. Run fixed timestep logic updates
      if (!this.paused && this.state) {
        var ticks = this.timestep.update(deltaMs);
        for (var i = 0; i < ticks; i++) {
          this.tick(this.timestep.getDt());
        }
        
        // Log vehicle state every second
        if (this.state.time - lastLogTime >= 1.0) {
          debugLog.logVehicle(this.state.playerVehicle);
          lastLogTime = this.state.time;
        }
      }

      // 4. Render
      this.render();

      // 5. Yield to Synchronet
      mswait(1);
    }
  }

  /**
   * Process input (called every frame).
   */
  private processInput(): void {
    var now = this.clock.now();

    // Read all available keys
    var key: string;
    while ((key = console.inkey(K_NONE, 0)) !== '') {
      this.controls.handleKey(key, now);
    }

    // Update held state (decays old inputs)
    this.controls.update(now);

    // Handle immediate actions AFTER processing all keys
    if (this.controls.wasJustPressed(GameAction.QUIT)) {
      debugLog.info("QUIT action triggered - exiting game loop");
      this.running = false;
      this.controls.endFrame();  // Clear just-pressed flags
      return;
    }
    if (this.controls.wasJustPressed(GameAction.PAUSE)) {
      this.togglePause();
      this.controls.endFrame();  // Clear just-pressed flags
      return;
    }

    // Clear just-pressed flags for next frame
    this.controls.endFrame();
  }

  /**
   * Single logic tick.
   */
  private tick(dt: number): void {
    if (!this.state) return;

    // Update game time
    this.state.time += dt;

    // Update physics
    this.physicsSystem.update(this.state, dt);

    // Update race progress
    this.raceSystem.update(this.state, dt);

    // Apply NPC pacing - commuters drive faster when far, slower when close
    this.applyNPCPacing();

    // Update items
    this.itemSystem.update(dt);
    this.itemSystem.checkPickups(this.state.vehicles);

    // Use item if requested
    if (this.controls.wasJustPressed(GameAction.USE_ITEM)) {
      this.itemSystem.useItem(this.state.playerVehicle);
    }

    // Process vehicle-to-vehicle collisions
    Collision.processVehicleCollisions(this.state.vehicles);

    // Respawn NPCs that have fallen behind the player
    this.checkNPCRespawn();

    // Update camera to follow player
    this.state.cameraX = this.state.playerVehicle.x;

    // Check for race finish
    if (this.state.finished && this.state.racing === false) {
      // Race is complete - exit the game loop
      debugLog.info("Race complete! Exiting game loop. Final time: " + this.state.time.toFixed(2));
      this.running = false;
    }
  }

  /**
   * Check if any NPCs need to be respawned ahead.
   */
  private checkNPCRespawn(): void {
    if (!this.state) return;
    
    var playerZ = this.state.playerVehicle.trackZ;
    var respawnDistance = 150;  // Respawn if this far behind player
    
    for (var i = 0; i < this.state.vehicles.length; i++) {
      var vehicle = this.state.vehicles[i];
      if (vehicle.isNPC && vehicle.trackZ < playerZ - respawnDistance) {
        this.respawnNPCAhead(vehicle);
      }
    }
  }

  /**
   * Apply NPC pacing - commuters drive faster when far from player,
   * slower when close. This creates a longer "approach phase" where
   * the player can see and react to upcoming traffic.
   */
  private applyNPCPacing(): void {
    if (!this.state) return;
    
    var playerZ = this.state.playerVehicle.trackZ;
    var playerSpeed = this.state.playerVehicle.speed;
    
    for (var i = 0; i < this.state.vehicles.length; i++) {
      var npc = this.state.vehicles[i];
      if (!npc.isNPC) continue;
      
      var distance = npc.trackZ - playerZ;
      
      // Only apply pacing to NPCs ahead of player
      if (distance <= 0) continue;
      
      // Pacing zones:
      // Far (>150): Match 70-85% of player speed (slower approach)
      // Medium (80-150): Transition zone
      // Close (<80): Normal commuter speed (30-50% of max)
      
      var commuterBaseSpeed = VEHICLE_PHYSICS.MAX_SPEED * 0.4;  // Normal commuter speed
      var pacingSpeed: number;
      
      if (distance > 150) {
        // Far away: drive faster to stay visible longer
        // Match a portion of player's speed so approach is gradual
        pacingSpeed = Math.max(commuterBaseSpeed, playerSpeed * 0.75);
      } else if (distance > 80) {
        // Transition zone: blend from pacing speed to commuter speed
        var t = (distance - 80) / 70;  // 0 at 80, 1 at 150
        var fastSpeed = playerSpeed * 0.75;
        pacingSpeed = commuterBaseSpeed + t * (fastSpeed - commuterBaseSpeed);
      } else {
        // Close: normal commuter behavior
        pacingSpeed = commuterBaseSpeed;
      }
      
      // Smoothly adjust NPC speed toward target (don't jerk)
      var speedDiff = pacingSpeed - npc.speed;
      npc.speed += speedDiff * 0.1;  // Gradual adjustment
      
      // Clamp to reasonable bounds
      npc.speed = clamp(npc.speed, commuterBaseSpeed * 0.5, VEHICLE_PHYSICS.MAX_SPEED * 0.85);
    }
  }

  /**
   * Render current state.
   */
  private render(): void {
    if (!this.state) return;

    var trackZ = this.state.playerVehicle.z;
    var vehicle = this.state.playerVehicle;
    var road = this.state.road;
    
    // Get curvature at player position for parallax
    var curvature = road.getCurvature(trackZ);
    var playerSteer = vehicle.playerX;  // Player's lateral position indicates steering direction
    var speed = vehicle.speed;
    var dt = 1.0 / this.config.tickRate;  // Fixed timestep

    this.renderer.beginFrame();
    this.renderer.renderSky(trackZ, curvature, playerSteer, speed, dt);
    this.renderer.renderRoad(trackZ, this.state.cameraX, this.state.track, this.state.road);
    this.renderer.renderEntities(
      this.state.playerVehicle,
      this.state.vehicles,
      this.itemSystem.getItemBoxes()
    );

    // Compute and render HUD
    var hudData = this.hud.compute(
      this.state.playerVehicle,
      this.state.track,
      this.state.road,
      this.state.vehicles,
      this.state.time
    );
    this.renderer.renderHud(hudData);

    this.renderer.endFrame();
  }

  /**
   * Toggle pause state.
   */
  private togglePause(): void {
    this.paused = !this.paused;
    if (!this.paused) {
      this.clock.reset();
      this.timestep.reset();
    }
    logInfo("Game " + (this.paused ? "paused" : "resumed"));
  }

  /**
   * Spawn NPC commuter vehicles.
   */
  private spawnNPCs(count: number, road: Road): void {
    if (!this.state) return;
    
    var roadLength = road.totalLength;
    
    // Calculate spacing to spread NPCs evenly along the track
    var minSpawn = 150;
    var maxSpawn = Math.min(roadLength * 0.8, 800);  // Spawn up to 800 units ahead
    var spawnRange = maxSpawn - minSpawn;
    var spacing = spawnRange / (count + 1);  // Even spacing between NPCs
    
    for (var i = 0; i < count; i++) {
      var npc = new Vehicle();
      
      // Use CommuterDriver for traffic
      npc.driver = new CommuterDriver();
      npc.isNPC = true;
      
      // Randomize vehicle type and color
      var typeIndex = Math.floor(Math.random() * NPC_VEHICLE_TYPES.length);
      npc.npcType = NPC_VEHICLE_TYPES[typeIndex];
      npc.npcColorIndex = Math.floor(Math.random() * NPC_VEHICLE_COLORS.length);
      
      // Set color from palette for minimap display
      var colorPalette = NPC_VEHICLE_COLORS[npc.npcColorIndex];
      npc.color = colorPalette.body;
      
      // Distribute NPCs evenly along the track with some randomness
      // Base position is evenly spaced, then add small random offset
      var baseZ = minSpawn + spacing * (i + 1);
      var jitter = spacing * 0.3 * (Math.random() - 0.5);  // +/- 15% of spacing
      npc.trackZ = baseZ + jitter;
      npc.z = npc.trackZ;
      
      // Random lateral position (stay on road, alternate left/right bias)
      var laneOffset = (i % 2 === 0) ? -0.3 : 0.3;  // Alternate lanes
      npc.playerX = laneOffset + (Math.random() - 0.5) * 0.4;  // Stay in lane with some variance
      
      this.state.vehicles.push(npc);
    }
    
    debugLog.info("Spawned " + count + " NPC commuters");
  }

  /**
   * Respawn an NPC ahead of the player when passed.
   */
  private respawnNPCAhead(npc: IVehicle): void {
    if (!this.state) return;
    
    var playerZ = this.state.playerVehicle.trackZ;
    var roadLength = this.state.road.totalLength;
    
    // Find where other NPCs are to avoid spawning too close
    var minSeparation = 50;  // Minimum distance between NPCs
    var attempts = 0;
    var maxAttempts = 10;
    var validPosition = false;
    var newZ = 0;
    
    while (!validPosition && attempts < maxAttempts) {
      // Respawn 300-600 units ahead of player (far enough to see approach from horizon)
      var spawnDistance = 300 + Math.random() * 300;
      newZ = (playerZ + spawnDistance) % roadLength;
      
      // Check if position is clear of other NPCs
      validPosition = true;
      for (var i = 0; i < this.state.vehicles.length; i++) {
        var other = this.state.vehicles[i];
        if (other === npc || !other.isNPC) continue;
        
        var dist = Math.abs(other.trackZ - newZ);
        if (dist < minSeparation) {
          validPosition = false;
          break;
        }
      }
      attempts++;
    }
    
    npc.trackZ = newZ;
    npc.z = npc.trackZ;
    
    // Alternate left/right lanes based on random chance
    var laneChoice = Math.random();
    if (laneChoice < 0.4) {
      npc.playerX = -0.35 + (Math.random() - 0.5) * 0.2;  // Left lane
    } else if (laneChoice < 0.8) {
      npc.playerX = 0.35 + (Math.random() - 0.5) * 0.2;   // Right lane
    } else {
      npc.playerX = (Math.random() - 0.5) * 0.3;          // Center
    }
    
    // Reset any crash state
    npc.isCrashed = false;
    npc.crashTimer = 0;
    npc.flashTimer = 0;
  }

  /**
   * Check if game is running.
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * Shutdown the game.
   */
  shutdown(): void {
    logInfo("Game.shutdown()");
    this.renderer.shutdown();
    this.controls.clearAll();
  }
}
