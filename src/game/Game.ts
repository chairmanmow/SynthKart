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
  private renderer: Renderer;
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
    this.renderer = new Renderer(this.config.screenWidth, this.config.screenHeight);
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

    // Update items
    this.itemSystem.update(dt);
    this.itemSystem.checkPickups(this.state.vehicles);

    // Use item if requested
    if (this.controls.wasJustPressed(GameAction.USE_ITEM)) {
      this.itemSystem.useItem(this.state.playerVehicle);
    }

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
