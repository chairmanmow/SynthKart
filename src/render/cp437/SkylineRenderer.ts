/**
 * SkylineRenderer - Renders the synthwave sky with parallax scrolling.
 *
 * Uses the classic Super Scaler technique:
 * - Background elements (mountains, sun) are at "infinite distance"
 * - They scroll horizontally when steering/curving (parallax)
 * - They do NOT move forward toward the camera
 * - Sky grid animates based on track position for forward motion feel
 */

class SkylineRenderer {
  private composer: SceneComposer;
  private horizonY: number;
  private parallax: ParallaxBackground;

  constructor(composer: SceneComposer, horizonY: number) {
    this.composer = composer;
    this.horizonY = horizonY;
    this.parallax = new ParallaxBackground(80, horizonY);
    this.parallax.resetScroll();  // Start centered
  }

  /**
   * Render the synthwave sky with parallax.
   * 
   * @param trackPosition Z position for grid animation
   * @param curvature Current road curvature for parallax (-1 to 1)
   * @param playerSteer Player steering input for parallax (-1 to 1)
   * @param speed Current speed for parallax rate
   * @param dt Delta time
   */
  render(trackPosition: number, curvature?: number, playerSteer?: number, speed?: number, dt?: number): void {
    // Clear sky area to black first
    this.renderSkyBackground();
    
    // Update parallax scroll if we have the data
    if (curvature !== undefined && speed !== undefined && dt !== undefined) {
      this.parallax.updateScroll(curvature, playerSteer || 0, speed, dt);
    }
    
    // Render parallax layers (sun, mountains)
    this.parallax.render(this.composer);
    
    // Render sky grid on top (this animates with forward motion)
    this.renderSkyGrid(trackPosition);
  }

  /**
   * Render black sky background.
   */
  private renderSkyBackground(): void {
    var bgAttr = makeAttr(BLACK, BG_BLACK);
    for (var y = 0; y < this.horizonY; y++) {
      for (var x = 0; x < 80; x++) {
        this.composer.setCell(x, y, ' ', bgAttr);
      }
    }
  }

  /**
   * Render synthwave sky grid (magenta) - animates with forward motion.
   */
  private renderSkyGrid(trackPosition: number): void {
    var gridAttr = colorToAttr(PALETTE.SKY_GRID);
    var glowAttr = colorToAttr(PALETTE.SKY_GRID_GLOW);

    // Draw converging vertical grid lines from horizon up
    var vanishX = 40;

    for (var y = this.horizonY - 1; y >= 2; y--) {
      var distFromHorizon = this.horizonY - y;
      var spread = distFromHorizon * 6;

      // Vertical lines emanating from vanishing point
      for (var offset = 0; offset <= spread && offset < 40; offset += 10) {
        var leftX = vanishX - offset;
        var rightX = vanishX + offset;

        if (offset === 0) {
          // Center line
          this.safePutCell(vanishX, y, GLYPH.BOX_V, gridAttr);
        } else {
          // Diagonal lines using / and \
          if (leftX >= 0 && leftX < 80) {
            this.safePutCell(leftX, y, '/', glowAttr);
          }
          if (rightX >= 0 && rightX < 80) {
            this.safePutCell(rightX, y, '\\', glowAttr);
          }
        }
      }

      // Horizontal lines - animated based on track position (forward motion)
      var linePhase = Math.floor(trackPosition / 50 + distFromHorizon) % 4;
      if (linePhase === 0) {
        var lineSpread = Math.min(spread, 38);
        for (var x = vanishX - lineSpread; x <= vanishX + lineSpread; x++) {
          if (x >= 0 && x < 80) {
            this.safePutCell(x, y, GLYPH.BOX_H, glowAttr);
          }
        }
      }
    }
  }

  /**
   * Safely set a cell only if it's empty or a space.
   */
  private safePutCell(x: number, y: number, char: string, attr: number): void {
    if (x < 0 || x >= 80 || y < 0 || y >= 24) return;

    var buffer = this.composer.getBuffer();
    if (!buffer[y] || !buffer[y][x]) return;

    var cell = buffer[y][x];
    // Only draw if cell is empty space
    if (cell.char === ' ') {
      this.composer.setCell(x, y, char, attr);
    }
  }
}

