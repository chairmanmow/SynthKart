/**
 * FrameRenderer - Main renderer using Frame.js layered architecture.
 * 
 * Replaces the old cell-by-cell SceneComposer approach with proper
 * frame-based rendering for efficiency and correct z-ordering.
 * 
 * Implements IRenderer interface for drop-in replacement of old Renderer.
 * 
 * Supports themes for different visual aesthetics.
 */

class FrameRenderer implements IRenderer {
  private frameManager: FrameManager;
  private width: number;
  private height: number;
  private horizonY: number;
  
  // Active theme
  private activeTheme: Theme;
  
  // Sprite cache (built from theme's roadside config)
  private spriteCache: { [name: string]: SpriteDefinition };
  private playerCarSprite: SpriteDefinition;
  
  // Parallax state (placeholders for future scrolling)
  private _mountainScrollOffset: number;
  
  // Flag to track if static elements need re-rendering
  private _staticElementsDirty: boolean;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.horizonY = 8;
    
    this._mountainScrollOffset = 0;
    this._staticElementsDirty = true;
    
    this.frameManager = new FrameManager(width, height, this.horizonY);
    
    // Default to synthwave theme
    this.activeTheme = SynthwaveTheme;
    this.spriteCache = {};
    this.playerCarSprite = null as any;
  }
  
  /**
   * Set the active theme. Call before init() or use setTheme() after.
   */
  setTheme(themeName: string): void {
    var theme = getTheme(themeName);
    if (theme) {
      this.activeTheme = theme;
      this._staticElementsDirty = true;
      this.rebuildSpriteCache();
      
      // Re-render static elements if already initialized
      if (this.frameManager.getSunFrame()) {
        this.clearStaticFrames();
        this.renderStaticElements();
      }
      
      logInfo('Theme changed to: ' + themeName);
    } else {
      logWarning('Theme not found: ' + themeName);
    }
  }
  
  /**
   * Get available theme names.
   */
  getAvailableThemes(): string[] {
    return getThemeNames();
  }
  
  /**
   * Initialize the renderer. Must be called once at startup.
   */
  init(): void {
    // Load frame.js
    load('frame.js');
    
    // Initialize frame manager
    this.frameManager.init();
    
    // Build sprite cache from theme
    this.rebuildSpriteCache();
    this.playerCarSprite = SpriteSheet.createPlayerCar();
    
    // Render static elements based on theme
    this.renderStaticElements();
    
    logInfo('FrameRenderer initialized with theme: ' + this.activeTheme.name);
  }
  
  /**
   * Rebuild sprite cache from current theme's roadside pool.
   */
  private rebuildSpriteCache(): void {
    this.spriteCache = {};
    var pool = this.activeTheme.roadside.pool;
    
    for (var i = 0; i < pool.length; i++) {
      var entry = pool[i];
      var creator = ROADSIDE_SPRITES[entry.sprite];
      if (creator) {
        this.spriteCache[entry.sprite] = creator();
      }
    }
  }
  
  /**
   * Select a sprite from the weighted pool based on world position.
   * Returns { sprite: string, side: 'left' | 'right' | 'both' }
   */
  private selectFromPool(worldZ: number): { sprite: string; side: string } {
    var pool = this.activeTheme.roadside.pool;
    
    // Calculate total weight
    var totalWeight = 0;
    for (var i = 0; i < pool.length; i++) {
      totalWeight += pool[i].weight;
    }
    
    // Deterministic selection based on worldZ
    var hash = (Math.floor(worldZ) * 7919) % totalWeight;  // Prime for better distribution
    
    var cumulative = 0;
    for (var j = 0; j < pool.length; j++) {
      cumulative += pool[j].weight;
      if (hash < cumulative) {
        return { sprite: pool[j].sprite, side: pool[j].side || 'both' };
      }
    }
    
    // Fallback
    return { sprite: pool[0].sprite, side: pool[0].side || 'both' };
  }
  
  /**
   * Clear static frame contents for theme change.
   */
  private clearStaticFrames(): void {
    var sunFrame = this.frameManager.getSunFrame();
    var mtnsFrame = this.frameManager.getMountainsFrame();
    
    if (sunFrame) sunFrame.clear();
    if (mtnsFrame) mtnsFrame.clear();
  }
  
  /**
   * Render all static elements based on current theme.
   */
  private renderStaticElements(): void {
    // Celestial body
    if (this.activeTheme.celestial.type === 'sun') {
      this.renderSun();
    } else if (this.activeTheme.celestial.type === 'moon') {
      this.renderMoon();
    } else if (this.activeTheme.celestial.type === 'dual_moons') {
      this.renderDualMoons();
    }
    
    // Background
    if (this.activeTheme.background.type === 'mountains') {
      this.renderMountains();
    } else if (this.activeTheme.background.type === 'skyscrapers') {
      this.renderSkyscrapers();
    } else if (this.activeTheme.background.type === 'ocean') {
      this.renderOceanIslands();
    } else if (this.activeTheme.background.type === 'forest') {
      this.renderForestTreeline();
    }
    
    this._staticElementsDirty = false;
    logDebug('Static elements rendered, dirty=' + this._staticElementsDirty);
  }
  
  // ============================================================
  // IRenderer interface implementation
  // ============================================================
  
  /**
   * Begin a new frame - no-op for Frame.js (we update in place).
   */
  beginFrame(): void {
    // Frame.js doesn't need explicit begin - we update frames in place
  }
  
  /**
   * Render sky (IRenderer interface).
   */
  renderSky(trackPosition: number, curvature?: number, playerSteer?: number, speed?: number, dt?: number): void {
    // Update sky background based on theme type (grid vs stars vs gradient)
    if (this.activeTheme.sky.type === 'grid') {
      this.renderSkyGrid(trackPosition);
    } else if (this.activeTheme.sky.type === 'stars') {
      this.renderSkyStars(trackPosition);
    } else if (this.activeTheme.sky.type === 'gradient') {
      this.renderSkyGradient(trackPosition);
    }
    // 'plain' type = no sky animation
    
    // Animate ocean waves if ocean background
    if (this.activeTheme.background.type === 'ocean') {
      this.renderOceanWaves(trackPosition);
    }
    
    // Update parallax (if params provided)
    if (curvature !== undefined && playerSteer !== undefined && speed !== undefined && dt !== undefined) {
      this.updateParallax(curvature, playerSteer, speed, dt);
    }
  }
  
  /**
   * Render road (IRenderer interface).
   */
  renderRoad(trackPosition: number, cameraX: number, _track: ITrack, road: Road): void {
    // Render holodeck ground grid first (if theme uses it)
    if (this.activeTheme.ground && this.activeTheme.ground.type === 'grid') {
      this.renderHolodeckFloor(trackPosition);
    }
    
    // Render road surface with curves
    this.renderRoadSurface(trackPosition, cameraX, road);
    
    // Build roadside objects from track/road
    var roadsideObjects = this.buildRoadsideObjects(trackPosition, cameraX, road);
    this.renderRoadsideSprites(roadsideObjects);
  }
  
  /**
   * Build roadside object list from road data.
   * 
   * ARCHITECTURE:
   * - Roadside objects exist at fixed WORLD positions (worldZ, side)
   * - We project world positions to SCREEN positions each frame
   * - Screen X is calculated based on road edge position at that depth
   * - This ensures objects stay alongside the road through curves
   */
  private buildRoadsideObjects(trackPosition: number, cameraX: number, road: Road): { x: number; y: number; distance: number; type: string }[] {
    var objects: { x: number; y: number; distance: number; type: string }[] = [];
    var roadHeight = this.height - this.horizonY;
    
    // Iterate through world Z positions that are visible
    // View distance in world units (matching road rendering)
    var viewDistanceWorld = 100;  // How far ahead in world units
    var startZ = trackPosition;
    var endZ = trackPosition + viewDistanceWorld;
    
    // Objects are placed at fixed intervals in the world
    var spacing = this.activeTheme.roadside.spacing;
    
    // Align to grid so objects stay at fixed world positions
    var firstObjectZ = Math.ceil(startZ / spacing) * spacing;
    
    // Sample at fixed world positions
    for (var worldZ = firstObjectZ; worldZ < endZ; worldZ += spacing) {
      // Select from weighted pool based on world position
      var selection = this.selectFromPool(worldZ);
      var spriteType = selection.sprite;
      var allowedSide = selection.side;
      var worldZInt = Math.floor(worldZ);
      
      // PROJECT: World Z -> Screen Y and distance
      // This is the inverse of the road rendering projection
      var relativeZ = worldZ - trackPosition;
      if (relativeZ <= 0) continue;
      
      // Distance factor (same formula as road uses)
      var distance = relativeZ / 5;  // Convert world units to distance units
      if (distance < 1 || distance > 20) continue;
      
      // Screen Y from distance (inverse of road formula)
      // Road uses: distance = 1 / (1 - t * 0.95) where t = (roadBottom - screenY) / roadBottom
      // Solving for screenY: t = 1 - 1/distance, screenY = roadBottom * (1 - t) = roadBottom / distance * 0.95
      var t = 1 - (1 / distance);
      var screenY = Math.round(this.horizonY + roadHeight * (1 - t));
      
      if (screenY <= this.horizonY || screenY >= this.height) continue;
      
      // Calculate road center at this screen Y (same as road rendering)
      // Accumulate curve from player to this point
      var accumulatedCurve = 0;
      for (var z = trackPosition; z < worldZ; z += 5) {
        var seg = road.getSegment(z);
        if (seg) accumulatedCurve += seg.curve * 0.5;
      }
      var curveOffset = accumulatedCurve * distance * 0.8;
      var centerX = 40 + Math.round(curveOffset) - Math.round(cameraX * 0.5);
      
      // Road width at this distance
      var roadHalfWidth = Math.round(20 / distance);
      
      // Left and right edges of road
      var leftEdge = centerX - roadHalfWidth;
      var rightEdge = centerX + roadHalfWidth;
      
      // Position objects OUTSIDE road edges
      // Offset from edge scales inversely with distance (larger offset when close)
      var edgeOffset = Math.round(15 / distance) + 3;  // Offset from road edge
      
      var leftX = leftEdge - edgeOffset;
      var rightX = rightEdge + edgeOffset;
      
      // Determine which side to place based on world position and allowed sides
      var preferredSide = (Math.floor(worldZ / spacing) % 2 === 0) ? 'left' : 'right';
      
      // Respect the side restriction from pool entry
      if (allowedSide === 'left' || (allowedSide === 'both' && preferredSide === 'left')) {
        if (leftX >= 0) {
          objects.push({ x: leftX, y: screenY, distance: distance, type: spriteType });
        }
      }
      if (allowedSide === 'right' || (allowedSide === 'both' && preferredSide === 'right')) {
        if (rightX < 80) {
          objects.push({ x: rightX, y: screenY, distance: distance, type: spriteType });
        }
      }
      
      // For denser themes, also place on opposite side sometimes (if allowed)
      if (this.activeTheme.roadside.density > 1.0 && (worldZInt % 2 === 0)) {
        if (allowedSide === 'both' || allowedSide === 'right') {
          if (preferredSide === 'left' && rightX < 80) {
            objects.push({ x: rightX, y: screenY, distance: distance, type: spriteType });
          }
        }
        if (allowedSide === 'both' || allowedSide === 'left') {
          if (preferredSide === 'right' && leftX >= 0) {
            objects.push({ x: leftX, y: screenY, distance: distance, type: spriteType });
          }
        }
      }
    }
    
    // Sort by distance (far to near) for proper z-ordering
    objects.sort(function(a, b) { return b.distance - a.distance; });
    return objects;
  }

  /**
   * Render entities (IRenderer interface).
   */
  renderEntities(playerVehicle: IVehicle, vehicles: IVehicle[], _items: Item[]): void {
    // Render NPC vehicles (sorted by distance, far to near)
    this.renderNPCVehicles(playerVehicle, vehicles);
    
    // Render player vehicle with flash effect (always on top)
    this.renderPlayerVehicle(playerVehicle.playerX, playerVehicle.flashTimer > 0);
  }
  
  /**
   * Render NPC vehicles relative to player.
   */
  private renderNPCVehicles(playerVehicle: IVehicle, vehicles: IVehicle[]): void {
    // Build list of visible NPCs with distance info
    var visibleNPCs: { vehicle: IVehicle; relativeZ: number; relativeX: number }[] = [];
    
    for (var i = 0; i < vehicles.length; i++) {
      var v = vehicles[i];
      if (!v.isNPC) continue;  // Skip player
      
      // Calculate relative position
      var relativeZ = v.trackZ - playerVehicle.trackZ;
      var relativeX = v.playerX - playerVehicle.playerX;
      
      // Render if ahead of player and within view distance
      // Extended range so cars can reach the visual horizon (600 units)
      // Also render cars slightly behind player (passed but still visible)
      if (relativeZ > -10 && relativeZ < 600) {
        visibleNPCs.push({ vehicle: v, relativeZ: relativeZ, relativeX: relativeX });
      }
    }
    
    // Sort by distance (far to near, so closer vehicles render on top)
    visibleNPCs.sort(function(a, b) { return b.relativeZ - a.relativeZ; });
    
    // Render each NPC
    for (var j = 0; j < visibleNPCs.length; j++) {
      this.renderNPCVehicle(visibleNPCs[j].vehicle, visibleNPCs[j].relativeZ, visibleNPCs[j].relativeX);
    }
  }
  
  /**
   * Render a single NPC vehicle.
   */
  private renderNPCVehicle(vehicle: IVehicle, relativeZ: number, relativeX: number): void {
    // Get NPC sprite
    var sprite = getNPCSprite(vehicle.npcType, vehicle.npcColorIndex);
    
    // Calculate screen position and scale based on distance
    // t: 0 = far (horizon), 1 = close (bottom)
    var maxViewDist = 500;  // World units before cars disappear
    
    // Use perspective formula to place cars
    var normalizedDist = Math.max(0.01, relativeZ / maxViewDist);  // 0.01 to 1
    var t = Math.max(0, Math.min(1, 1 - normalizedDist));
    
    // Map t to screen Y 
    // Use the VISUAL horizon (where road actually meets sky), not this.horizonY
    // The visual road vanishing point is around row 4-5 (buildings row)
    var visualHorizonY = 5;  // Actual vanishing point of road on screen
    var roadBottom = this.height - 4;
    var screenY = Math.round(visualHorizonY + t * (roadBottom - visualHorizonY));
    
    // Lateral position scales with perspective
    var perspectiveScale = t * t;  // Non-linear for more realistic perspective
    var screenX = Math.round(40 + relativeX * perspectiveScale * 25);
    
    // Select sprite scale based on screen position (5 scales now: 0=dot, 1=tiny, 2=small, 3=medium, 4=large)
    var roadHeight = roadBottom - visualHorizonY;
    var screenProgress = (screenY - visualHorizonY) / roadHeight;  // 0 at horizon, 1 at bottom
    
    // Scale thresholds spread across the road
    var scaleIndex: number;
    if (screenProgress < 0.04) {
      scaleIndex = 0;  // Dot - right at horizon (top 4%)
    } else if (screenProgress < 0.10) {
      scaleIndex = 1;  // Tiny - near horizon (4-10%)
    } else if (screenProgress < 0.20) {
      scaleIndex = 2;  // Small - upper road (10-20%)
    } else if (screenProgress < 0.35) {
      scaleIndex = 3;  // Medium - middle road (20-35%)
    } else {
      scaleIndex = 4;  // Large - lower road (35%+)
    }
    
    // Clamp to available scales
    scaleIndex = Math.min(scaleIndex, sprite.variants.length - 1);
    
    // Get sprite dimensions
    var size = getSpriteSize(sprite, scaleIndex);
    
    // Center sprite horizontally
    screenX -= Math.floor(size.width / 2);
    
    // Draw sprite directly to road frame (NPCs are part of the road scene)
    var variant = sprite.variants[scaleIndex];
    var frame = this.frameManager.getRoadFrame();
    if (!frame) return;
    
    // Apply flash effect if vehicle is flashing
    var isFlashing = vehicle.flashTimer > 0;
    var flashAttr = makeAttr(LIGHTRED, BG_BLACK);
    
    // Visual horizon for bounds check (matches visualHorizonY above)
    var visualHorizon = 5;
    
    for (var row = 0; row < variant.length; row++) {
      for (var col = 0; col < variant[row].length; col++) {
        var cell = variant[row][col];
        if (cell !== null && cell !== undefined) {
          var drawX = screenX + col;
          var drawY = screenY + row;
          
          // Bounds check - allow drawing up to visual horizon
          if (drawX >= 0 && drawX < this.width && drawY >= visualHorizon && drawY < this.height - 1) {
            var attr = isFlashing && (Math.floor(Date.now() / 100) % 2 === 0) ? flashAttr : cell.attr;
            frame.setData(drawX, drawY, cell.char, attr);
          }
        }
      }
    }
  }
  
  /**
   * End frame - push updates to screen.
   */
  endFrame(): void {
    this.cycle();
  }
  
  // ============================================================
  // Internal rendering methods  
  // ============================================================

  /**
   * Render the sun to its frame (static, rendered once).
   */
  private renderSun(): void {
    var sunFrame = this.frameManager.getSunFrame();
    if (!sunFrame) return;
    
    var colors = this.activeTheme.colors;
    var sunCoreAttr = makeAttr(colors.celestialCore.fg, colors.celestialCore.bg);
    var sunGlowAttr = makeAttr(colors.celestialGlow.fg, colors.celestialGlow.bg);
    
    // Sun position based on theme
    var celestial = this.activeTheme.celestial;
    var sunX = Math.floor(this.width * celestial.positionX) - 3;
    var sunY = Math.floor(this.horizonY * celestial.positionY);
    
    // Size based on theme (1-5 scale)
    var size = celestial.size;
    var coreWidth = size + 2;
    var coreHeight = Math.max(1, size);
    
    // Draw sun core
    for (var dy = 0; dy < coreHeight; dy++) {
      for (var dx = 0; dx < coreWidth; dx++) {
        sunFrame.setData(sunX + dx, sunY + dy, GLYPH.FULL_BLOCK, sunCoreAttr);
      }
    }
    
    // Draw glow around edges
    var glowChar = GLYPH.DARK_SHADE;
    // Top edge
    for (var x = sunX - 1; x <= sunX + coreWidth; x++) {
      sunFrame.setData(x, sunY - 1, glowChar, sunGlowAttr);
    }
    // Bottom edge
    for (var x = sunX - 1; x <= sunX + coreWidth; x++) {
      sunFrame.setData(x, sunY + coreHeight, glowChar, sunGlowAttr);
    }
    // Side edges
    for (var dy = 0; dy < coreHeight; dy++) {
      sunFrame.setData(sunX - 1, sunY + dy, glowChar, sunGlowAttr);
      sunFrame.setData(sunX + coreWidth, sunY + dy, glowChar, sunGlowAttr);
    }
  }
  
  /**
   * Render the moon to its frame (for night themes).
   * Creates a glowing crescent moon similar in prominence to the sun.
   */
  private renderMoon(): void {
    var moonFrame = this.frameManager.getSunFrame();  // Reuse sun frame slot
    if (!moonFrame) return;
    
    var colors = this.activeTheme.colors;
    var moonCoreAttr = makeAttr(colors.celestialCore.fg, colors.celestialCore.bg);
    var moonGlowAttr = makeAttr(colors.celestialGlow.fg, colors.celestialGlow.bg);
    var moonGlowDimAttr = makeAttr(CYAN, BG_BLACK);  // Outer glow
    
    var celestial = this.activeTheme.celestial;
    var moonX = Math.floor(this.width * celestial.positionX);
    var moonY = Math.max(1, Math.floor((this.horizonY - 2) * celestial.positionY));
    
    // Prominent crescent moon with glow halo
    // Core crescent shape (bright)
    moonFrame.setData(moonX, moonY, ')', moonCoreAttr);
    moonFrame.setData(moonX, moonY + 1, ')', moonCoreAttr);
    moonFrame.setData(moonX + 1, moonY, ')', moonCoreAttr);
    moonFrame.setData(moonX + 1, moonY + 1, ')', moonCoreAttr);
    
    // Inner glow (bright cyan/yellow)
    moonFrame.setData(moonX - 1, moonY, GLYPH.MEDIUM_SHADE, moonGlowAttr);
    moonFrame.setData(moonX - 1, moonY + 1, GLYPH.MEDIUM_SHADE, moonGlowAttr);
    moonFrame.setData(moonX + 2, moonY, GLYPH.MEDIUM_SHADE, moonGlowAttr);
    moonFrame.setData(moonX + 2, moonY + 1, GLYPH.MEDIUM_SHADE, moonGlowAttr);
    moonFrame.setData(moonX, moonY - 1, GLYPH.MEDIUM_SHADE, moonGlowAttr);
    moonFrame.setData(moonX + 1, moonY - 1, GLYPH.MEDIUM_SHADE, moonGlowAttr);
    moonFrame.setData(moonX, moonY + 2, GLYPH.MEDIUM_SHADE, moonGlowAttr);
    moonFrame.setData(moonX + 1, moonY + 2, GLYPH.MEDIUM_SHADE, moonGlowAttr);
    
    // Outer glow (dimmer, wider)
    moonFrame.setData(moonX - 2, moonY, GLYPH.DARK_SHADE, moonGlowDimAttr);
    moonFrame.setData(moonX - 2, moonY + 1, GLYPH.DARK_SHADE, moonGlowDimAttr);
    moonFrame.setData(moonX + 3, moonY, GLYPH.DARK_SHADE, moonGlowDimAttr);
    moonFrame.setData(moonX + 3, moonY + 1, GLYPH.DARK_SHADE, moonGlowDimAttr);
    moonFrame.setData(moonX - 1, moonY - 1, GLYPH.DARK_SHADE, moonGlowDimAttr);
    moonFrame.setData(moonX + 2, moonY - 1, GLYPH.DARK_SHADE, moonGlowDimAttr);
    moonFrame.setData(moonX - 1, moonY + 2, GLYPH.DARK_SHADE, moonGlowDimAttr);
    moonFrame.setData(moonX + 2, moonY + 2, GLYPH.DARK_SHADE, moonGlowDimAttr);
  }
  
  /**
   * Render dual moons for fantasy/enchanted themes.
   * One larger pale moon and one smaller colored moon.
   */
  private renderDualMoons(): void {
    var moonFrame = this.frameManager.getSunFrame();
    if (!moonFrame) return;
    
    var colors = this.activeTheme.colors;
    var moonCoreAttr = makeAttr(colors.celestialCore.fg, colors.celestialCore.bg);
    var moonGlowAttr = makeAttr(colors.celestialGlow.fg, colors.celestialGlow.bg);
    
    var celestial = this.activeTheme.celestial;
    
    // Main moon (larger, right of center based on positionX)
    var moon1X = Math.floor(this.width * celestial.positionX);
    var moon1Y = Math.max(1, Math.floor((this.horizonY - 3) * celestial.positionY));
    
    // Main moon - full/gibbous
    moonFrame.setData(moon1X, moon1Y, '(', moonCoreAttr);
    moonFrame.setData(moon1X + 1, moon1Y, ')', moonCoreAttr);
    moonFrame.setData(moon1X, moon1Y + 1, '(', moonCoreAttr);
    moonFrame.setData(moon1X + 1, moon1Y + 1, ')', moonCoreAttr);
    
    // Main moon glow
    moonFrame.setData(moon1X - 1, moon1Y, GLYPH.LIGHT_SHADE, moonGlowAttr);
    moonFrame.setData(moon1X + 2, moon1Y, GLYPH.LIGHT_SHADE, moonGlowAttr);
    moonFrame.setData(moon1X - 1, moon1Y + 1, GLYPH.LIGHT_SHADE, moonGlowAttr);
    moonFrame.setData(moon1X + 2, moon1Y + 1, GLYPH.LIGHT_SHADE, moonGlowAttr);
    moonFrame.setData(moon1X, moon1Y - 1, GLYPH.LIGHT_SHADE, moonGlowAttr);
    moonFrame.setData(moon1X + 1, moon1Y - 1, GLYPH.LIGHT_SHADE, moonGlowAttr);
    moonFrame.setData(moon1X, moon1Y + 2, GLYPH.LIGHT_SHADE, moonGlowAttr);
    moonFrame.setData(moon1X + 1, moon1Y + 2, GLYPH.LIGHT_SHADE, moonGlowAttr);
    
    // Secondary moon (smaller, different position)
    // Offset from main moon - upper left
    var moon2X = Math.floor(this.width * 0.25);
    var moon2Y = Math.max(1, Math.floor((this.horizonY - 2) * 0.2));
    var moon2Attr = makeAttr(LIGHTCYAN, BG_CYAN);  // Cyan/teal moon
    var moon2GlowAttr = makeAttr(CYAN, BG_BLACK);
    
    // Smaller crescent
    moonFrame.setData(moon2X, moon2Y, ')', moon2Attr);
    
    // Small glow
    moonFrame.setData(moon2X - 1, moon2Y, GLYPH.LIGHT_SHADE, moon2GlowAttr);
    moonFrame.setData(moon2X + 1, moon2Y, GLYPH.LIGHT_SHADE, moon2GlowAttr);
    moonFrame.setData(moon2X, moon2Y - 1, GLYPH.LIGHT_SHADE, moon2GlowAttr);
    moonFrame.setData(moon2X, moon2Y + 1, GLYPH.LIGHT_SHADE, moon2GlowAttr);
  }
  
  /**
   * Render mountains to their frame (can be scrolled for parallax).
   */
  private renderMountains(): void {
    var frame = this.frameManager.getMountainsFrame();
    if (!frame) return;
    
    var colors = this.activeTheme.colors;
    var mountainAttr = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
    var highlightAttr = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
    
    // Mountain silhouettes at horizon
    var mountains = [
      { x: 5, height: 4, width: 12 },
      { x: 20, height: 6, width: 16 },
      { x: 42, height: 5, width: 14 },
      { x: 60, height: 4, width: 10 },
      { x: 72, height: 3, width: 8 }
    ];
    
    for (var i = 0; i < mountains.length; i++) {
      this.drawMountainToFrame(frame, mountains[i].x, this.horizonY - 1, 
                               mountains[i].height, mountains[i].width,
                               mountainAttr, highlightAttr);
    }
  }
  
  /**
   * Render skyscrapers to their frame (for city themes).
   */
  private renderSkyscrapers(): void {
    var frame = this.frameManager.getMountainsFrame();  // Reuse mountains frame slot
    if (!frame) return;
    
    var colors = this.activeTheme.colors;
    var wallAttr = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
    var windowAttr = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
    var antennaAttr = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
    
    // Skyscraper silhouettes - varied heights and widths
    var buildings = [
      { x: 2, height: 5, width: 6 },
      { x: 10, height: 7, width: 4 },
      { x: 16, height: 4, width: 5 },
      { x: 23, height: 6, width: 7 },
      { x: 32, height: 8, width: 5 },
      { x: 39, height: 5, width: 6 },
      { x: 47, height: 7, width: 4 },
      { x: 53, height: 4, width: 5 },
      { x: 60, height: 6, width: 6 },
      { x: 68, height: 5, width: 5 },
      { x: 75, height: 4, width: 4 }
    ];
    
    for (var i = 0; i < buildings.length; i++) {
      this.drawBuildingToFrame(frame, buildings[i].x, this.horizonY - 1, 
                               buildings[i].height, buildings[i].width,
                               wallAttr, windowAttr, antennaAttr);
    }
  }
  
  /**
   * Draw a single building shape to a frame.
   */
  private drawBuildingToFrame(frame: Frame, baseX: number, baseY: number, 
                               height: number, width: number,
                               wallAttr: number, windowAttr: number, antennaAttr: number): void {
    // Draw building body
    for (var h = 0; h < height; h++) {
      var y = baseY - h;
      if (y < 0) continue;
      
      for (var dx = 0; dx < width; dx++) {
        var x = baseX + dx;
        if (x >= 0 && x < this.width) {
          // Windows pattern - checkerboard of lit/unlit
          var isWindow = (dx > 0 && dx < width - 1 && h > 0 && h < height - 1);
          var isLit = ((dx + h) % 3 === 0);
          
          if (isWindow && isLit) {
            frame.setData(x, y, '.', windowAttr);
          } else {
            frame.setData(x, y, GLYPH.FULL_BLOCK, wallAttr);
          }
        }
      }
    }
    
    // Antenna on some buildings
    if (width >= 5 && height >= 5) {
      var antennaX = baseX + Math.floor(width / 2);
      var antennaY = baseY - height;
      if (antennaY >= 0) {
        frame.setData(antennaX, antennaY, '|', antennaAttr);
        frame.setData(antennaX, antennaY - 1, '*', antennaAttr);
      }
    }
  }
  
  /**
   * Render distant islands for ocean background (static).
   */
  private renderOceanIslands(): void {
    var frame = this.frameManager.getMountainsFrame();
    if (!frame) return;
    
    var colors = this.activeTheme.colors;
    var islandAttr = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
    var highlightAttr = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
    
    // Distant island silhouettes (small, far away)
    var islands = [
      { x: 15, height: 2, width: 8 },   // Small distant island
      { x: 55, height: 3, width: 12 },  // Medium island
    ];
    
    for (var i = 0; i < islands.length; i++) {
      this.drawMountainToFrame(frame, islands[i].x, this.horizonY - 1, 
                               islands[i].height, islands[i].width,
                               islandAttr, highlightAttr);
    }
  }
  
  /**
   * Render forest treeline silhouette at horizon.
   * Creates a dense forest of varied tree shapes.
   */
  private renderForestTreeline(): void {
    var frame = this.frameManager.getMountainsFrame();
    if (!frame) return;
    
    var colors = this.activeTheme.colors;
    var treeAttr = makeAttr(colors.sceneryPrimary.fg, colors.sceneryPrimary.bg);
    var topAttr = makeAttr(colors.scenerySecondary.fg, colors.scenerySecondary.bg);
    var trunkAttr = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
    
    // Dense forest - many overlapping trees
    // Use various tree shapes: pointed conifers, rounded deciduous
    var treeChars = ['^', GLYPH.TRIANGLE_UP, 'A', '*'];
    
    // Fill the horizon with trees at varying heights
    for (var x = 0; x < this.width; x++) {
      // Deterministic "random" height based on position
      var hash = (x * 17 + 5) % 13;
      var treeHeight = 2 + (hash % 4);  // 2-5 rows tall
      var treeType = hash % treeChars.length;
      
      // Draw tree column
      for (var h = 0; h < treeHeight; h++) {
        var y = this.horizonY - 1 - h;
        if (y < 0) continue;
        
        if (h === treeHeight - 1) {
          // Tree top - pointed
          frame.setData(x, y, treeChars[treeType], topAttr);
        } else if (h === 0 && treeHeight >= 3) {
          // Tree trunk base (only for taller trees)
          frame.setData(x, y, '|', trunkAttr);
        } else {
          // Tree body
          var bodyChar = (h === treeHeight - 2) ? GLYPH.TRIANGLE_UP : GLYPH.MEDIUM_SHADE;
          frame.setData(x, y, bodyChar, treeAttr);
        }
      }
      
      // Add some gaps/variety - skip some positions
      if ((x * 7) % 11 === 0) {
        x++;  // Create small gaps
      }
    }
  }
  
  /**
   * Render animated ocean waves at the horizon line.
   * Called every frame to animate the waves.
   */
  renderOceanWaves(trackPosition: number): void {
    var frame = this.frameManager.getMountainsFrame();
    if (!frame) return;
    
    var colors = this.activeTheme.colors;
    var waveAttr = makeAttr(colors.sceneryTertiary.fg, colors.sceneryTertiary.bg);
    var foamAttr = makeAttr(WHITE, BG_BLACK);
    
    // Wave animation phase based on track position
    var wavePhase = Math.floor(trackPosition / 8) % 4;
    
    // Render 2 rows of waves at horizon
    for (var row = 0; row < 2; row++) {
      var y = this.horizonY - row;
      if (y < 0) continue;
      
      for (var x = 0; x < this.width; x++) {
        // Skip where islands are drawn (roughly)
        if ((x >= 15 && x <= 23) || (x >= 55 && x <= 67)) {
          if (row === 0) continue;  // Don't overwrite bottom of islands
        }
        
        // Wave pattern - multiple overlapping sine waves
        var wave1 = Math.sin((x + wavePhase * 3) * 0.3);
        var wave2 = Math.sin((x - wavePhase * 2 + 10) * 0.5);
        var combined = wave1 + wave2 * 0.5;
        
        // Choose character based on wave height and phase
        var char: string;
        var attr: number;
        
        if (combined > 0.8) {
          // Wave crest / foam
          char = (wavePhase % 2 === 0) ? '~' : '^';
          attr = foamAttr;
        } else if (combined > 0.2) {
          // Rising wave
          char = '~';
          attr = waveAttr;
        } else if (combined > -0.3) {
          // Flat water
          char = (row === 0) ? '-' : '~';
          attr = waveAttr;
        } else {
          // Wave trough
          char = '_';
          attr = waveAttr;
        }
        
        // Add some randomness for sparkle effect
        var sparkle = ((x * 17 + wavePhase * 31) % 23) === 0;
        if (sparkle && row === 0) {
          char = '*';
          attr = foamAttr;
        }
        
        frame.setData(x, y, char, attr);
      }
    }
  }
  
  /**
   * Draw a single mountain shape to a frame.
   */
  private drawMountainToFrame(frame: Frame, baseX: number, baseY: number, 
                               height: number, width: number,
                               attr: number, highlightAttr: number): void {
    var peakX = baseX + Math.floor(width / 2);
    
    for (var h = 0; h < height; h++) {
      var y = baseY - h;
      if (y < 0) continue;
      
      var halfWidth = Math.floor((height - h) * width / height / 2);
      
      // Draw mountain row
      for (var dx = -halfWidth; dx <= halfWidth; dx++) {
        var x = peakX + dx;
        if (x >= 0 && x < this.width) {
          if (dx < 0) {
            frame.setData(x, y, '/', attr);
          } else if (dx > 0) {
            frame.setData(x, y, '\\', attr);
          } else {
            // Peak
            if (h === height - 1) {
              frame.setData(x, y, GLYPH.TRIANGLE_UP, highlightAttr);
            } else {
              frame.setData(x, y, GLYPH.BOX_V, attr);
            }
          }
        }
      }
    }
  }
  
  /**
   * Update sky grid animation (called each frame) - synthwave style.
   */
  renderSkyGrid(trackPosition: number): void {
    var frame = this.frameManager.getSkyGridFrame();
    if (!frame) return;
    
    frame.clear();
    
    var colors = this.activeTheme.colors;
    var gridAttr = makeAttr(colors.skyGrid.fg, colors.skyGrid.bg);
    var glowAttr = makeAttr(colors.skyGridGlow.fg, colors.skyGridGlow.bg);
    var vanishX = 40 + Math.round(this._mountainScrollOffset * 0.5);  // Slight parallax shift
    
    for (var y = this.horizonY - 1; y >= 1; y--) {
      var distFromHorizon = this.horizonY - y;
      var spread = distFromHorizon * 6;
      
      // Vertical converging lines
      if (this.activeTheme.sky.converging) {
        for (var offset = 0; offset <= spread && offset < 40; offset += 10) {
          if (offset === 0) {
            frame.setData(vanishX, y, GLYPH.BOX_V, gridAttr);
          } else {
            var leftX = vanishX - offset;
            var rightX = vanishX + offset;
            if (leftX >= 0 && leftX < this.width) frame.setData(leftX, y, '/', glowAttr);
            if (rightX >= 0 && rightX < this.width) frame.setData(rightX, y, '\\', glowAttr);
          }
        }
      }
      
      // Horizontal lines (animated)
      if (this.activeTheme.sky.horizontal) {
        var linePhase = Math.floor(trackPosition / 50 + distFromHorizon) % 4;
        if (linePhase === 0) {
          var lineSpread = Math.min(spread, 38);
          for (var x = vanishX - lineSpread; x <= vanishX + lineSpread; x++) {
            if (x >= 0 && x < this.width) {
              frame.setData(x, y, GLYPH.BOX_H, glowAttr);
            }
          }
        }
      }
    }
  }
  
  /**
   * Render star field to sky background (for night themes).
   */
  renderSkyStars(trackPosition: number): void {
    var frame = this.frameManager.getSkyGridFrame();
    if (!frame) return;
    
    frame.clear();
    
    var colors = this.activeTheme.colors;
    var brightAttr = makeAttr(colors.starBright.fg, colors.starBright.bg);
    var dimAttr = makeAttr(colors.starDim.fg, colors.starDim.bg);
    
    var density = this.activeTheme.stars.density;
    var numStars = Math.floor(this.width * this.horizonY * density * 0.15);
    
    // Parallax offset for stars (very slow)
    var parallaxOffset = Math.round(this._mountainScrollOffset * 0.1);
    
    // Twinkle phase based on track position (if enabled)
    var twinklePhase = this.activeTheme.stars.twinkle ? Math.floor(trackPosition / 30) : 0;
    
    // Deterministic star positions
    for (var i = 0; i < numStars; i++) {
      var baseX = (i * 17 + 5) % this.width;
      var x = (baseX + parallaxOffset + this.width) % this.width;  // Wrap around
      var y = (i * 13 + 3) % (this.horizonY - 1);  // Keep in sky area
      
      // Twinkle: some stars change brightness
      var twinkleState = (i + twinklePhase) % 5;
      var isBright = (i % 3 === 0) ? (twinkleState !== 0) : (twinkleState === 0);
      var char = isBright ? '*' : '.';
      
      if (x >= 0 && x < this.width && y >= 0 && y < this.horizonY) {
        frame.setData(x, y, char, isBright ? brightAttr : dimAttr);
      }
    }
  }
  
  /**
   * Render warm gradient sky (for sunset themes).
   * Creates horizontal bands of color fading from top to horizon.
   */
  renderSkyGradient(trackPosition: number): void {
    var frame = this.frameManager.getSkyGridFrame();
    if (!frame) return;
    
    frame.clear();
    
    var colors = this.activeTheme.colors;
    var highAttr = makeAttr(colors.skyTop.fg, colors.skyTop.bg);
    var midAttr = makeAttr(colors.skyMid.fg, colors.skyMid.bg);
    var lowAttr = makeAttr(colors.skyHorizon.fg, colors.skyHorizon.bg);
    
    // Subtle cloud movement based on track position
    var cloudOffset = Math.floor(trackPosition / 50) % this.width;
    
    // Divide sky into three zones
    var topZone = Math.floor(this.horizonY * 0.35);
    var midZone = Math.floor(this.horizonY * 0.7);
    
    for (var y = 0; y < this.horizonY; y++) {
      var attr: number;
      var chars: string[];
      
      if (y < topZone) {
        // Top zone - deep color, sparse texture
        attr = highAttr;
        chars = [' ', ' ', ' ', '.', ' '];
      } else if (y < midZone) {
        // Middle zone - warm transition
        attr = midAttr;
        chars = [' ', '~', ' ', ' ', '-'];
      } else {
        // Low zone near horizon - bright warm
        attr = lowAttr;
        chars = ['~', '-', '~', ' ', '='];
      }
      
      for (var x = 0; x < this.width; x++) {
        // Create subtle cloud/haze pattern
        var hash = ((x + cloudOffset) * 31 + y * 17) % 37;
        var charIndex = hash % chars.length;
        var char = chars[charIndex];
        
        frame.setData(x, y, char, attr);
      }
    }
  }
  
  /**
   * Update parallax scroll based on steering/curvature.
   * Classic Super Scaler: backgrounds scroll horizontally when turning.
   */
  updateParallax(curvature: number, steer: number, speed: number, dt: number): void {
    // Accumulate horizontal scroll based on curve and steering
    var scrollAmount = (curvature * 0.8 + steer * 0.3) * speed * dt * 0.15;
    this._mountainScrollOffset += scrollAmount;
    
    // Clamp to reasonable range (will wrap in rendering)
    if (this._mountainScrollOffset > 80) this._mountainScrollOffset -= 80;
    if (this._mountainScrollOffset < -80) this._mountainScrollOffset += 80;
  }
  
  /**
   * Render the holodeck grid floor - mirrors the sky grid logic.
   * Ground grid is essentially a reflection of sky grid below the horizon.
   */
  private renderHolodeckFloor(trackPosition: number): void {
    var frame = this.frameManager.getGroundGridFrame();
    if (!frame) return;
    
    var ground = this.activeTheme.ground;
    if (!ground) return;
    
    frame.clear();
    
    var primaryAttr = makeAttr(ground.primary.fg, ground.primary.bg);
    var frameHeight = this.height - this.horizonY;
    var vanishX = Math.floor(this.width / 2);
    var radialSpacing = 6;  // Pixels between radial lines
    
    // Mirror sky grid logic - iterate from horizon downward
    for (var y = 0; y < frameHeight - 1; y++) {
      var distFromHorizon = y + 1;  // 1 at top row, increases going down
      var spread = distFromHorizon * 6;  // How far radials have spread at this row
      
      // === VERTICAL/DIAGONAL CONVERGING LINES ===
      // Draw radials that have emerged AND extend to edges
      // A radial at offset N emerges when spread >= N
      // Once emerged, draw it at that row
      
      // Center line
      frame.setData(vanishX, y, GLYPH.BOX_V, primaryAttr);
      
      // Side radials - draw every radial that has emerged by this row
      for (var offset = radialSpacing; offset <= spread; offset += radialSpacing) {
        var leftX = vanishX - offset;
        var rightX = vanishX + offset;
        if (leftX >= 0) {
          frame.setData(leftX, y, '/', primaryAttr);
        }
        if (rightX < this.width) {
          frame.setData(rightX, y, '\\', primaryAttr);
        }
      }
      
      // === HORIZONTAL LINES ===
      // Animate with trackPosition, span FULL WIDTH
      var linePhase = Math.floor(trackPosition / 40 + distFromHorizon * 1.5) % 5;
      if (linePhase === 0) {
        // Draw horizontal line across entire screen width
        for (var x = 0; x < this.width; x++) {
          // Check if we're on a radial line for intersection
          var distFromVanish = Math.abs(x - vanishX);
          var isOnRadial = (distFromVanish === 0) || (distFromVanish <= spread && (distFromVanish % radialSpacing) === 0);
          frame.setData(x, y, isOnRadial ? '+' : GLYPH.BOX_H, primaryAttr);
        }
      }
    }
  }
  
  /**
   * Render the road surface to its frame (internal method).
   */
  private renderRoadSurface(trackPosition: number, cameraX: number, road: Road): void {
    var frame = this.frameManager.getRoadFrame();
    if (!frame) return;
    
    frame.clear();
    
    var roadBottom = this.height - this.horizonY - 1;  // Frame-relative Y
    var roadLength = road.totalLength;
    
    // Accumulate curvature for perspective curve effect
    var accumulatedCurve = 0;
    
    for (var screenY = roadBottom; screenY >= 0; screenY--) {
      var t = (roadBottom - screenY) / roadBottom;
      var distance = 1 / (1 - t * 0.95);
      
      // Get road segment at this distance
      var worldZ = trackPosition + distance * 5;
      var segment = road.getSegment(worldZ);
      
      // Accumulate curve - each segment's curve affects the road center
      // Further segments have more accumulated curvature
      if (segment) {
        accumulatedCurve += segment.curve * 0.5;
      }
      
      // Road width narrows with distance
      var roadWidth = Math.round(40 / distance);
      var halfWidth = Math.floor(roadWidth / 2);
      
      // Apply curve offset - road center shifts based on accumulated curvature
      var curveOffset = accumulatedCurve * distance * 0.8;
      var centerX = 40 + Math.round(curveOffset) - Math.round(cameraX * 0.5);
      
      var leftEdge = centerX - halfWidth;
      var rightEdge = centerX + halfWidth;
      
      // Stripe phase for animated dashes
      var stripePhase = Math.floor((trackPosition + distance * 5) / 15) % 2;
      
      // Check finish line
      var wrappedZ = worldZ % roadLength;
      if (wrappedZ < 0) wrappedZ += roadLength;
      var isFinishLine = (wrappedZ < 200) || (wrappedZ > roadLength - 200);
      
      this.renderRoadScanline(frame, screenY, centerX, leftEdge, rightEdge, 
                              distance, stripePhase, isFinishLine, accumulatedCurve);
    }
  }
  
  /**
   * Render a single road scanline.
   */
  private renderRoadScanline(frame: Frame, y: number, centerX: number,
                              leftEdge: number, rightEdge: number,
                              distance: number, stripePhase: number,
                              isFinishLine: boolean, curve?: number): void {
    var colors = this.activeTheme.colors;
    var roadAttr = makeAttr(
      distance < 10 ? colors.roadSurfaceAlt.fg : colors.roadSurface.fg,
      distance < 10 ? colors.roadSurfaceAlt.bg : colors.roadSurface.bg
    );
    var gridAttr = makeAttr(colors.roadGrid.fg, colors.roadGrid.bg);
    var edgeAttr = makeAttr(colors.roadEdge.fg, colors.roadEdge.bg);
    var stripeAttr = makeAttr(colors.roadStripe.fg, colors.roadStripe.bg);
    var shoulderAttr = makeAttr(colors.shoulderPrimary.fg, colors.shoulderPrimary.bg);
    
    for (var x = 0; x < this.width; x++) {
      if (x >= leftEdge && x <= rightEdge) {
        // On road
        if (isFinishLine) {
          this.renderFinishCell(frame, x, y, centerX, leftEdge, rightEdge, distance);
        } else if (x === leftEdge || x === rightEdge) {
          frame.setData(x, y, GLYPH.BOX_V, edgeAttr);
        } else if (Math.abs(x - centerX) < 1 && stripePhase === 0) {
          frame.setData(x, y, GLYPH.BOX_V, stripeAttr);
        } else {
          var gridPhase = Math.floor(distance) % 3;
          if (gridPhase === 0 && distance > 5) {
            frame.setData(x, y, GLYPH.BOX_H, gridAttr);
          } else {
            frame.setData(x, y, ' ', roadAttr);
          }
        }
      } else {
        // Off road - render ground pattern based on theme
        var distFromRoad = (x < leftEdge) ? leftEdge - x : x - rightEdge;
        this.renderGroundCell(frame, x, y, distFromRoad, distance, leftEdge, rightEdge, shoulderAttr, curve || 0);
      }
    }
  }
  
  /**
   * Render finish line cell.
   */
  private renderFinishCell(frame: Frame, x: number, y: number, 
                           centerX: number, leftEdge: number, rightEdge: number,
                           distance: number): void {
    if (x === leftEdge || x === rightEdge) {
      frame.setData(x, y, GLYPH.BOX_V, makeAttr(WHITE, BG_BLACK));
      return;
    }
    
    var checkerSize = Math.max(1, Math.floor(3 / distance));
    var checkerX = Math.floor((x - centerX) / checkerSize);
    var checkerY = Math.floor(y / 2);
    var isWhite = ((checkerX + checkerY) % 2) === 0;
    
    if (isWhite) {
      frame.setData(x, y, GLYPH.FULL_BLOCK, makeAttr(WHITE, BG_LIGHTGRAY));
    } else {
      frame.setData(x, y, ' ', makeAttr(BLACK, BG_BLACK));
    }
  }
  
  /**
   * Render a single ground/off-road cell based on theme ground config.
   * Supports solid, grid (holodeck), dither (dirt), grass, and sand patterns.
   */
  private renderGroundCell(frame: Frame, x: number, y: number, 
                           distFromRoad: number, distance: number,
                           _leftEdge: number, _rightEdge: number,
                           shoulderAttr: number, _curve?: number): void {
    var ground = this.activeTheme.ground;
    
    // Default behavior if no ground config - just shoulder then black
    if (!ground) {
      if (distFromRoad <= 2) {
        frame.setData(x, y, GLYPH.GRASS, shoulderAttr);
      }
      return;
    }
    
    // Determine which type of ground pattern to render
    switch (ground.type) {
      case 'grid':
        // Grid type is rendered on dedicated layer - leave transparent here
        // Just don't render anything, let the ground grid layer show through
        return;
      case 'dither':
        this.renderDitherGround(frame, x, y, distFromRoad, distance, ground);
        break;
      case 'grass':
        this.renderGrassGround(frame, x, y, distFromRoad, distance, ground);
        break;
      case 'sand':
        this.renderSandGround(frame, x, y, distFromRoad, distance, ground);
        break;
      case 'solid':
      default:
        // Solid color fill
        if (distFromRoad <= 2) {
          frame.setData(x, y, GLYPH.GRASS, shoulderAttr);
        } else {
          var solidAttr = makeAttr(ground.primary.fg, ground.primary.bg);
          frame.setData(x, y, ' ', solidAttr);
        }
        break;
    }
  }
  
  /**
   * Render dithered dirt/gravel ground pattern.
   */
  private renderDitherGround(frame: Frame, x: number, y: number,
                              _distFromRoad: number, distance: number,
                              ground: any): void {
    var pattern = ground.pattern || {};
    var density = pattern.ditherDensity || 0.3;
    var chars = pattern.ditherChars || ['.', ',', "'"];
    
    var primaryAttr = makeAttr(ground.primary.fg, ground.primary.bg);
    var secondaryAttr = makeAttr(ground.secondary.fg, ground.secondary.bg);
    
    // Pseudo-random based on position
    var hash = (x * 31 + y * 17 + Math.floor(distance)) % 100;
    var normalized = hash / 100;
    
    if (normalized < density) {
      var charIndex = hash % chars.length;
      frame.setData(x, y, chars[charIndex], secondaryAttr);
    } else {
      frame.setData(x, y, ' ', primaryAttr);
    }
  }
  
  /**
   * Render grass ground pattern with tufts.
   */
  private renderGrassGround(frame: Frame, x: number, y: number,
                             _distFromRoad: number, distance: number,
                             ground: any): void {
    var pattern = ground.pattern || {};
    var density = pattern.grassDensity || 0.4;
    var chars = pattern.grassChars || ['"', "'", ',', '.'];
    
    var primaryAttr = makeAttr(ground.primary.fg, ground.primary.bg);
    var secondaryAttr = makeAttr(ground.secondary.fg, ground.secondary.bg);
    
    // Pseudo-random grass placement
    var hash = (x * 23 + y * 41 + Math.floor(distance * 2)) % 100;
    var normalized = hash / 100;
    
    if (normalized < density) {
      var charIndex = hash % chars.length;
      // Alternate colors for depth
      var attr = ((x + y) % 3 === 0) ? secondaryAttr : primaryAttr;
      frame.setData(x, y, chars[charIndex], attr);
    } else {
      frame.setData(x, y, ' ', primaryAttr);
    }
  }
  
  /**
   * Render sand/beach ground pattern.
   */
  private renderSandGround(frame: Frame, x: number, y: number,
                            _distFromRoad: number, distance: number,
                            ground: any): void {
    var primaryAttr = makeAttr(ground.primary.fg, ground.primary.bg);
    var secondaryAttr = makeAttr(ground.secondary.fg, ground.secondary.bg);
    
    // Subtle wave pattern in sand  
    var hash = (x * 17 + y * 29 + Math.floor(distance)) % 100;
    
    if (hash < 15) {
      // Occasional ripple marks
      frame.setData(x, y, '~', secondaryAttr);
    } else if (hash < 25) {
      frame.setData(x, y, '.', primaryAttr);
    } else {
      frame.setData(x, y, ' ', primaryAttr);
    }
  }
  
  /**
   * Render roadside sprites using the sprite pool.
   * Called with list of visible roadside objects.
   */
  renderRoadsideSprites(objects: { x: number; y: number; distance: number; type: string }[]): void {
    // Sort by distance (far to near) for proper z-order
    objects.sort(function(a, b) { return b.distance - a.distance; });
    
    var poolSize = this.frameManager.getRoadsidePoolSize();
    var used = 0;
    
    for (var i = 0; i < objects.length && used < poolSize; i++) {
      var obj = objects[i];
      var spriteFrame = this.frameManager.getRoadsideFrame(used);
      if (!spriteFrame) continue;
      
      // Select sprite and scale based on type and distance
      // Select sprite from cache based on type
      var sprite = this.spriteCache[obj.type];
      if (!sprite) {
        // Fallback: try to find any available sprite from pool
        var pool = this.activeTheme.roadside.pool;
        if (pool.length > 0) {
          sprite = this.spriteCache[pool[0].sprite];
        }
        if (!sprite) continue;  // No sprite available
      }
      
      // Scale index based on distance
      var scaleIndex = this.getScaleForDistance(obj.distance);
      
      // Render sprite to frame
      renderSpriteToFrame(spriteFrame, sprite, scaleIndex);
      
      // Position frame
      var size = getSpriteSize(sprite, scaleIndex);
      var frameX = Math.round(obj.x - size.width / 2);
      var frameY = Math.round(obj.y - size.height + 1);
      
      this.frameManager.positionRoadsideFrame(used, frameX, frameY, true);
      used++;
    }
    
    // Hide unused frames
    for (var j = used; j < poolSize; j++) {
      this.frameManager.positionRoadsideFrame(j, 0, 0, false);
    }
  }
  
  /**
   * Get sprite scale index for a given distance.
   */
  private getScaleForDistance(distance: number): number {
    if (distance > 8) return 0;
    if (distance > 5) return 1;
    if (distance > 3) return 2;
    if (distance > 1.5) return 3;
    return 4;
  }
  
  /**
   * Render player vehicle.
   */
  renderPlayerVehicle(playerX: number, isFlashing?: boolean): void {
    var frame = this.frameManager.getVehicleFrame(0);
    if (!frame) return;
    
    // Render sprite to frame
    renderSpriteToFrame(frame, this.playerCarSprite, 0);
    
    // If flashing, override with flash color (white/red alternating)
    if (isFlashing) {
      var flashColor = (Math.floor(Date.now() / 100) % 2 === 0) ? WHITE : LIGHTRED;
      var flashAttr = makeAttr(flashColor, BG_BLACK);
      // Overlay flash on all non-transparent cells
      for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 5; x++) {
          var cell = this.playerCarSprite.variants[0][y] ? this.playerCarSprite.variants[0][y][x] : null;
          if (cell) {
            frame.setData(x, y, cell.char, flashAttr);
          }
        }
      }
    }
    
    // Player is always at bottom center-ish
    var screenX = 40 + Math.round(playerX * 5) - 2;
    var screenY = this.height - 3;
    
    this.frameManager.positionVehicleFrame(0, screenX, screenY, true);
  }
  
  /**
   * Render HUD elements.
   */
  renderHud(hudData: HudData): void {
    var frame = this.frameManager.getHudFrame();
    if (!frame) return;
    
    frame.clear();
    
    var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
    var valueAttr = colorToAttr(PALETTE.HUD_VALUE);
    
    // Top bar - Lap, Position, Time
    this.writeStringToFrame(frame, 2, 0, 'LAP', labelAttr);
    this.writeStringToFrame(frame, 6, 0, hudData.lap + '/' + hudData.totalLaps, valueAttr);
    
    this.writeStringToFrame(frame, 14, 0, 'POS', labelAttr);
    this.writeStringToFrame(frame, 18, 0, hudData.position + PositionIndicator.getOrdinalSuffix(hudData.position), valueAttr);
    
    this.writeStringToFrame(frame, 26, 0, 'TIME', labelAttr);
    this.writeStringToFrame(frame, 31, 0, LapTimer.format(hudData.lapTime), valueAttr);
    
    this.writeStringToFrame(frame, 66, 0, 'SPD', labelAttr);
    this.writeStringToFrame(frame, 70, 0, this.padLeft(hudData.speed.toString(), 3), valueAttr);
    
    // Speedometer bar at bottom left
    this.renderSpeedometerBar(frame, hudData.speed, hudData.speedMax);
    
    // Track progress bar at bottom right
    this.renderTrackProgress(frame, hudData.lapProgress);
  }
  
  /**
   * Render track progress bar on bottom right.
   */
  private renderTrackProgress(frame: Frame, progress: number): void {
    var y = this.height - 1;
    var barX = 60;  // Bottom right area
    var barWidth = 15;
    
    var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
    var filledAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
    var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
    var finishAttr = colorToAttr({ fg: WHITE, bg: BG_BLACK });
    
    // Label
    this.writeStringToFrame(frame, barX - 5, y, 'TRK', labelAttr);
    
    frame.setData(barX, y, '[', labelAttr);
    
    var fillWidth = Math.round(progress * barWidth);
    
    for (var i = 0; i < barWidth; i++) {
      var attr = (i < fillWidth) ? filledAttr : emptyAttr;
      var char = (i < fillWidth) ? GLYPH.FULL_BLOCK : GLYPH.LIGHT_SHADE;
      frame.setData(barX + 1 + i, y, char, attr);
    }
    
    // Finish flag marker at end
    frame.setData(barX + barWidth + 1, y, ']', finishAttr);
  }
  
  /**
   * Render speedometer bar.
   */
  private renderSpeedometerBar(frame: Frame, speed: number, maxSpeed: number): void {
    var y = this.height - 1;
    var barX = 2;
    var barWidth = 20;
    
    var labelAttr = colorToAttr(PALETTE.HUD_LABEL);
    var filledAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
    var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
    var highAttr = colorToAttr({ fg: LIGHTRED, bg: BG_BLACK });
    
    frame.setData(barX, y, '[', labelAttr);
    
    var fillAmount = speed / maxSpeed;
    var fillWidth = Math.round(fillAmount * barWidth);
    
    for (var i = 0; i < barWidth; i++) {
      var attr = (i < fillWidth) ? (fillAmount > 0.8 ? highAttr : filledAttr) : emptyAttr;
      var char = (i < fillWidth) ? GLYPH.FULL_BLOCK : GLYPH.LIGHT_SHADE;
      frame.setData(barX + 1 + i, y, char, attr);
    }
    
    frame.setData(barX + barWidth + 1, y, ']', labelAttr);
  }
  
  /**
   * Helper to write a string to a frame.
   */
  private writeStringToFrame(frame: Frame, x: number, y: number, str: string, attr: number): void {
    for (var i = 0; i < str.length; i++) {
      frame.setData(x + i, y, str.charAt(i), attr);
    }
  }
  
  /**
   * Pad string on left.
   */
  private padLeft(str: string, len: number): string {
    while (str.length < len) {
      str = ' ' + str;
    }
    return str;
  }
  
  /**
   * Cycle all frames - push updates to screen.
   */
  cycle(): void {
    this.frameManager.cycle();
  }
  
  /**
   * Shutdown renderer.
   */
  shutdown(): void {
    this.frameManager.shutdown();
    console.clear();
  }
}
